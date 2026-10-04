const MAX_BODY_BYTES = 16 * 1024;
const MAX_PAGE_LENGTH = 180;

function json(payload, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
      "Referrer-Policy": "strict-origin-when-cross-origin"
    }
  });
}

function isValidEmail(email) {
  return email.length <= 254 && /^[^\s@\x00-\x1f]+@[^\s@\x00-\x1f]+\.[^\s@\x00-\x1f]+$/.test(email);
}

function normalizeText(value, fallback, maxLength) {
  const normalized = String(value || fallback).trim();
  return normalized.slice(0, maxLength) || fallback;
}

function nowIso() {
  return new Date().toISOString();
}

async function sha256(value) {
  const bytes = new TextEncoder().encode(String(value));
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

function getKv(env) {
  return env && env.VITALRISE_ACCESS && typeof env.VITALRISE_ACCESS.get === "function"
    ? env.VITALRISE_ACCESS
    : null;
}

async function readJson(request) {
  const contentLength = Number(request.headers.get("content-length") || 0);
  if (contentLength > MAX_BODY_BYTES) return null;

  try {
    if (!request.body) return null;
    const reader = request.body.getReader(), chunks = [];
    let length = 0;
    try {
      while (true) {
        const {done, value} = await reader.read();
        if (done) break;
        length += value.byteLength;
        if (length > MAX_BODY_BYTES) { await reader.cancel(); return null; }
        chunks.push(value);
      }
    } finally { reader.releaseLock(); }
    const bytes = new Uint8Array(length);
    let offset = 0;
    for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.byteLength; }
    return JSON.parse(new TextDecoder().decode(bytes));
  } catch {
    return null;
  }
}

async function forwardWebhook(url, payload) {
  try {
    if (new URL(url).protocol !== "https:") return { forwarded: false, status: null };
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(7000)
    });
    return { forwarded: response.ok, status: response.status };
  } catch {
    return { forwarded: false, status: null };
  }
}

async function handlePost(request, env, context) {
  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin) return json({ok:false, error:"Origin not allowed"}, 403);
  if (!/^application\/json(?:\s*;|$)/i.test(request.headers.get("content-type") || "")) {
    return json({ ok: false, error: "Content-Type must be application/json" }, 415);
  }

  const body = await readJson(request);
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return json({ ok: false, error: "Invalid JSON body" }, 400);
  }

  const email = String(body.email || "").trim().toLowerCase();
  if (!isValidEmail(email)) return json({ ok: false, error: "Invalid email" }, 400);
  if (body.website) return json({ok:false, error:"Invalid submission"}, 400);
  if (body.consent !== true || body.consentVersion !== "2026-09-06") {
    return json({ok:false, error:"Please confirm email subscription consent"}, 400);
  }

  const kv = getKv(env);
  if (!kv) return json({ ok: false, error: "Subscription temporarily unavailable" }, 503);

  const language = ["uk", "en", "ru"].includes(body.language) ? body.language : "uk";
  const source = body.source === "first_week_guide" ? body.source : "site";
  const candidatePage = normalizeText(body.page, "/", MAX_PAGE_LENGTH).split(/[?#]/)[0];
  const page = /^\/(?:en\/|ru\/)?(?:index\.html)?$/.test(candidatePage) ? candidatePage : "/";
  const key = `newsletter:${await sha256(email)}`;
  const existing = await kv.get(key, { type: "json" });
  const timestamp = nowIso();
  // Best-effort duplicate suppression only; KV is not a globally atomic rate limiter.
  if (existing?.consent?.version === "2026-09-06" && Date.now() - Date.parse(existing.updatedAt) < 60000) {
    return json({ok:true, stored:true});
  }
  const payload = {
    email,
    language,
    source,
    page,
    createdAt: existing?.createdAt || timestamp,
    updatedAt: timestamp,
    count: Number(existing?.count || 0) + 1,
    consent: {purpose:"VitalRise educational email updates", version:"2026-09-06", acceptedAt:timestamp},
    delivery: "not_sent"
  };

  await kv.put(key, JSON.stringify(payload));

  const webhookUrl = String(env.NEWSLETTER_WEBHOOK_URL || "").trim();
  if (webhookUrl) {
    const forwarding = (async () => {
      const result = await forwardWebhook(webhookUrl, payload);
      await kv.put(key.replace("newsletter:", "newsletter-delivery:"), JSON.stringify({updatedAt:nowIso(), forwarded:result.forwarded, status:result.status}));
    })().catch(() => { console.error("newsletter_webhook_delivery_failed"); });
    context.waitUntil(forwarding);
  }
  return json({ok:true, stored:true});
}

export async function onRequest(context) {
  const { request, env } = context;

  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204 });
  }

  if (request.method !== "POST") {
    return json({ ok: false, error: "Method not allowed" }, 405);
  }

  try {
    return await handlePost(request, env, context);
  } catch {
    console.error("newsletter_storage_failed");
    return json({ ok: false, error: "Subscription temporarily unavailable" }, 500);
  }
}
