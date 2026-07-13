const DAY_MS = 24 * 60 * 60 * 1000;
const CURRENCY = "UAH";
const DOMAIN_FALLBACK = "vitalrise.com.ua";
const WAYFORPAY_PAY_URL = "https://secure.wayforpay.com/pay";

const PLANS = {
  start: {
    tier: "start",
    label: "VitalRise Start",
    price: 499,
    startWindowDays: 45,
    activeDays: 30
  },
  pro: {
    tier: "pro",
    label: "VitalRise Pro",
    price: 1499,
    startWindowDays: 45,
    activeDays: 30
  },
  premium: {
    tier: "premium",
    label: "VitalRise Premium",
    price: 3500,
    startWindowDays: 45,
    activeDays: 30
  }
};

function json(payload, status = 200) {
  return new Response(JSON.stringify(payload, null, 2), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
      "Referrer-Policy": "strict-origin-when-cross-origin"
    }
  });
}

function methodNotAllowed() {
  return json({ ok: false, error: "Method not allowed" }, 405);
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || "").trim());
}

function addDays(days, fromDate) {
  const base = fromDate ? new Date(fromDate) : new Date();
  return new Date(base.getTime() + days * DAY_MS).toISOString();
}

function nowIso() {
  return new Date().toISOString();
}

function randomHex(bytes = 16) {
  const buffer = new Uint8Array(bytes);
  crypto.getRandomValues(buffer);
  return Array.from(buffer, (value) => value.toString(16).padStart(2, "0")).join("");
}

function randomId(prefix) {
  return `${prefix}_${randomHex(16)}`;
}

function createCode(plan) {
  return `VR-${String(plan).toUpperCase()}-${randomHex(4).toUpperCase()}`;
}

function utf8Bytes(value) {
  return new TextEncoder().encode(String(value));
}

function bytesToHex(bytes) {
  return Array.from(bytes, (value) => value.toString(16).padStart(2, "0")).join("");
}

async function sha256(value) {
  const digest = await crypto.subtle.digest("SHA-256", utf8Bytes(value));
  return bytesToHex(new Uint8Array(digest));
}

function leftRotate(value, bits) {
  return (value << bits) | (value >>> (32 - bits));
}

function md5Bytes(input) {
  const bytes = input instanceof Uint8Array ? input : utf8Bytes(input);
  const originalBitLength = bytes.length * 8;
  const paddedLength = (((bytes.length + 8) >> 6) + 1) * 64;
  const buffer = new Uint8Array(paddedLength);
  buffer.set(bytes);
  buffer[bytes.length] = 0x80;

  for (let i = 0; i < 8; i += 1) {
    buffer[paddedLength - 8 + i] = Math.floor(originalBitLength / 2 ** (8 * i)) & 0xff;
  }

  let a0 = 0x67452301;
  let b0 = 0xefcdab89;
  let c0 = 0x98badcfe;
  let d0 = 0x10325476;

  const shifts = [
    7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22,
    5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20,
    4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23,
    6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21
  ];

  const constants = new Array(64).fill(0).map((_, index) =>
    Math.floor(Math.abs(Math.sin(index + 1)) * 2 ** 32) >>> 0
  );

  for (let chunk = 0; chunk < buffer.length; chunk += 64) {
    const words = new Array(16);
    for (let i = 0; i < 16; i += 1) {
      const offset = chunk + i * 4;
      words[i] =
        buffer[offset] |
        (buffer[offset + 1] << 8) |
        (buffer[offset + 2] << 16) |
        (buffer[offset + 3] << 24);
    }

    let a = a0;
    let b = b0;
    let c = c0;
    let d = d0;

    for (let i = 0; i < 64; i += 1) {
      let f;
      let g;

      if (i < 16) {
        f = (b & c) | (~b & d);
        g = i;
      } else if (i < 32) {
        f = (d & b) | (~d & c);
        g = (5 * i + 1) % 16;
      } else if (i < 48) {
        f = b ^ c ^ d;
        g = (3 * i + 5) % 16;
      } else {
        f = c ^ (b | ~d);
        g = (7 * i) % 16;
      }

      const nextD = d;
      d = c;
      c = b;
      b = (b + leftRotate((a + f + constants[i] + words[g]) >>> 0, shifts[i])) >>> 0;
      a = nextD;
    }

    a0 = (a0 + a) >>> 0;
    b0 = (b0 + b) >>> 0;
    c0 = (c0 + c) >>> 0;
    d0 = (d0 + d) >>> 0;
  }

  const output = new Uint8Array(16);
  [a0, b0, c0, d0].forEach((word, index) => {
    output[index * 4] = word & 0xff;
    output[index * 4 + 1] = (word >>> 8) & 0xff;
    output[index * 4 + 2] = (word >>> 16) & 0xff;
    output[index * 4 + 3] = (word >>> 24) & 0xff;
  });

  return output;
}

function hmacMd5(secret, message) {
  const blockSize = 64;
  let key = utf8Bytes(secret);
  if (key.length > blockSize) key = md5Bytes(key);

  const paddedKey = new Uint8Array(blockSize);
  paddedKey.set(key);

  const outer = new Uint8Array(blockSize);
  const inner = new Uint8Array(blockSize);
  for (let i = 0; i < blockSize; i += 1) {
    outer[i] = paddedKey[i] ^ 0x5c;
    inner[i] = paddedKey[i] ^ 0x36;
  }

  const messageBytes = utf8Bytes(message);
  const innerPayload = new Uint8Array(inner.length + messageBytes.length);
  innerPayload.set(inner);
  innerPayload.set(messageBytes, inner.length);
  const innerHash = md5Bytes(innerPayload);

  const outerPayload = new Uint8Array(outer.length + innerHash.length);
  outerPayload.set(outer);
  outerPayload.set(innerHash, outer.length);
  return bytesToHex(md5Bytes(outerPayload));
}

function getKv(env) {
  return env && env.VITALRISE_ACCESS && typeof env.VITALRISE_ACCESS.get === "function"
    ? env.VITALRISE_ACCESS
    : null;
}

async function kvGet(kv, key) {
  return kv.get(key, { type: "json" });
}

async function kvPut(kv, key, value) {
  await kv.put(key, JSON.stringify(value));
}

function getOrigin(request, env) {
  const url = new URL(request.url);
  const configured = String(env.SITE_ORIGIN || "").trim().replace(/\/+$/, "");
  return configured || `${url.protocol}//${url.host}`;
}

function getMerchantDomain(request, env) {
  const configured = String(env.WAYFORPAY_MERCHANT_DOMAIN || "").trim();
  if (configured) return configured;
  try {
    return new URL(getOrigin(request, env)).hostname || DOMAIN_FALLBACK;
  } catch {
    return DOMAIN_FALLBACK;
  }
}

function getWayForPayMerchantAccount(env) {
  return String(env.WAYFORPAY_MERCHANT_ACCOUNT_PUBLIC || env.WAYFORPAY_MERCHANT_ACCOUNT || "").trim();
}

function isMock(env) {
  return String(env.ACCESS_MOCK_PAYMENTS || "") === "1";
}

function hasWayForPay(env) {
  return Boolean(getWayForPayMerchantAccount(env) && env.WAYFORPAY_MERCHANT_SECRET);
}

function wayForPayPurchaseSignature(fields, secret) {
  const base = [
    fields.merchantAccount,
    fields.merchantDomainName,
    fields.orderReference,
    fields.orderDate,
    fields.amount,
    fields.currency,
    ...fields.productName,
    ...fields.productCount,
    ...fields.productPrice
  ].join(";");
  return hmacMd5(secret, base);
}

function wayForPayCallbackSignature(body, secret) {
  const base = [
    body.merchantAccount,
    body.orderReference,
    body.amount,
    body.currency,
    body.authCode,
    body.cardPan,
    body.transactionStatus,
    body.reasonCode
  ].map((value) => String(value ?? "")).join(";");
  return hmacMd5(secret, base);
}

function wayForPayAcceptSignature(orderReference, status, time, secret) {
  return hmacMd5(secret, [orderReference, status, time].join(";"));
}

function createWayForPayForm(order, plan, request, env) {
  const origin = getOrigin(request, env);
  const merchantDomainName = getMerchantDomain(request, env);
  const productName = [`${plan.label} — доступ 45/30 днів`];
  const productPrice = [String(plan.price)];
  const productCount = ["1"];
  const fields = {
    merchantAccount: getWayForPayMerchantAccount(env),
    merchantAuthType: "SimpleSignature",
    merchantDomainName,
    merchantTransactionType: "AUTO",
    merchantTransactionSecureType: "AUTO",
    apiVersion: "1",
    language: "UA",
    serviceUrl: `${origin}/api/access/webhook/wayforpay`,
    returnUrl: `${origin}/api/access/payment-return?orderId=${encodeURIComponent(order.id)}`,
    orderReference: order.id,
    orderDate: order.orderDate,
    amount: String(plan.price),
    currency: CURRENCY,
    productName,
    productPrice,
    productCount,
    clientEmail: order.email,
    clientAccountId: order.email,
    defaultPaymentSystem: "card"
  };
  fields.merchantSignature = wayForPayPurchaseSignature(fields, String(env.WAYFORPAY_MERCHANT_SECRET));

  return {
    action: WAYFORPAY_PAY_URL,
    method: "POST",
    fields
  };
}

function publicTokenPayload(token) {
  return {
    ok: true,
    tier: token.plan,
    email: token.email,
    startDeadlineAt: token.startDeadlineAt || token.expiresAt,
    activatedAt: token.activatedAt || null,
    activeExpiresAt: token.activeExpiresAt || null,
    expiresAt: token.expiresAt
  };
}

function effectiveExpiresAt(record) {
  if (!record) return "";
  return record.activatedAt
    ? (record.activeExpiresAt || record.expiresAt || "")
    : (record.startDeadlineAt || record.expiresAt || "");
}

function isExpired(record) {
  const expiresAt = effectiveExpiresAt(record);
  return !expiresAt || new Date(expiresAt).getTime() < Date.now();
}

async function issueAccess(kv, order) {
  const plan = PLANS[order.plan];
  const accessCode = createCode(order.plan);
  const accessToken = randomId("vat");
  const startDeadlineAt = addDays(plan.startWindowDays);
  const createdAt = nowIso();

  const code = {
    id: randomId("code"),
    codeHash: await sha256(accessCode),
    email: order.email,
    plan: order.plan,
    orderId: order.id,
    createdAt,
    startDeadlineAt,
    activatedAt: null,
    activeExpiresAt: null,
    expiresAt: startDeadlineAt,
    redeemedAt: null
  };
  const token = {
    id: randomId("token"),
    tokenHash: await sha256(accessToken),
    email: order.email,
    plan: order.plan,
    orderId: order.id,
    createdAt,
    startDeadlineAt,
    activatedAt: null,
    activeExpiresAt: null,
    expiresAt: startDeadlineAt,
    revokedAt: null
  };

  order.status = "paid";
  order.paidAt = nowIso();
  order.accessCode = accessCode;
  order.accessToken = accessToken;
  order.startDeadlineAt = startDeadlineAt;
  order.expiresAt = startDeadlineAt;

  await kvPut(kv, `code:${code.codeHash}`, code);
  await kvPut(kv, `token:${token.tokenHash}`, token);
  await kvPut(kv, `order:${order.id}`, order);

  if (order.autoRenew) {
    await kvPut(kv, `subscription:${order.id}`, {
      id: randomId("sub"),
      email: order.email,
      plan: order.plan,
      orderId: order.id,
      provider: order.provider || "wayforpay",
      status: "consented",
      intervalDays: plan.activeDays,
      amount: plan.price,
      currency: CURRENCY,
      createdAt: nowIso(),
      startDeadlineAt,
      nextPaymentAt: startDeadlineAt,
      providerReference: order.providerReference || "",
      note: "Client consent is stored. Automatic charge requires a scheduled recurrent-charge worker."
    });
  }

  return { accessCode, accessToken, expiresAt: startDeadlineAt };
}

async function activateToken(kv, token, source) {
  const plan = PLANS[token.plan];
  if (!plan || token.activatedAt) return token;

  const activatedAt = nowIso();
  const activeExpiresAt = addDays(plan.activeDays, activatedAt);
  token.activatedAt = activatedAt;
  token.activeExpiresAt = activeExpiresAt;
  token.expiresAt = activeExpiresAt;
  token.activationSource = String(source || "program").slice(0, 80);

  await kvPut(kv, `token:${token.tokenHash}`, token);

  const order = await kvGet(kv, `order:${token.orderId}`);
  if (order) {
    order.activatedAt = activatedAt;
    order.activeExpiresAt = activeExpiresAt;
    order.expiresAt = activeExpiresAt;
    await kvPut(kv, `order:${order.id}`, order);
  }

  const subscription = await kvGet(kv, `subscription:${token.orderId}`);
  if (subscription) {
    subscription.activatedAt = activatedAt;
    subscription.activeExpiresAt = activeExpiresAt;
    subscription.nextPaymentAt = activeExpiresAt;
    await kvPut(kv, `subscription:${token.orderId}`, subscription);
  }

  return token;
}

async function readJson(request) {
  try {
    return await request.json();
  } catch {
    return {};
  }
}

async function handleHealth(request, env) {
  if (request.method !== "GET") return methodNotAllowed();
  return json({
    ok: true,
    runtime: "cloudflare-pages-functions",
    storage: Boolean(getKv(env)),
    mockPayments: isMock(env),
    wayForPay: hasWayForPay(env)
  });
}

async function handleCheckout(request, env) {
  if (request.method !== "POST") return methodNotAllowed();
  const kv = getKv(env);
  if (!kv) {
    return json({
      ok: false,
      error: "VITALRISE_ACCESS KV binding is not configured"
    }, 503);
  }

  const body = await readJson(request);
  const planKey = String(body.plan || "").toLowerCase();
  const email = String(body.email || "").trim().toLowerCase();
  const plan = PLANS[planKey];

  if (!plan) return json({ ok: false, error: "Unknown plan" }, 400);
  if (!isValidEmail(email)) return json({ ok: false, error: "Invalid email" }, 400);

  const order = {
    id: randomId("order"),
    email,
    plan: planKey,
    amount: plan.price,
    currency: CURRENCY,
    startWindowDays: plan.startWindowDays,
    activeDays: plan.activeDays,
    autoRenew: body.autoRenew === true,
    renewalIntervalDays: body.autoRenew === true ? plan.activeDays : 0,
    status: "pending",
    provider: isMock(env) ? "mock" : "wayforpay",
    createdAt: nowIso(),
    orderDate: Math.floor(Date.now() / 1000),
    paidAt: null
  };
  await kvPut(kv, `order:${order.id}`, order);

  if (isMock(env)) {
    const access = await issueAccess(kv, order);
    return json({
      ok: true,
      mode: "mock",
      orderId: order.id,
      tier: planKey,
      accessToken: access.accessToken,
      accessCode: access.accessCode,
      expiresAt: access.expiresAt
    });
  }

  if (!hasWayForPay(env)) {
    return json({
      ok: false,
      error: "WayForPay merchant credentials are not configured",
      orderId: order.id
    }, 503);
  }

  const checkoutForm = createWayForPayForm(order, plan, request, env);
  order.checkoutFormCreatedAt = nowIso();
  await kvPut(kv, `order:${order.id}`, order);

  return json({
    ok: true,
    mode: "wayforpay",
    orderId: order.id,
    checkoutForm
  });
}

async function handleRedeem(request, env) {
  if (request.method !== "POST") return methodNotAllowed();
  const kv = getKv(env);
  if (!kv) return json({ ok: false, error: "VITALRISE_ACCESS KV binding is not configured" }, 503);

  const body = await readJson(request);
  const email = String(body.email || "").trim().toLowerCase();
  const codeValue = String(body.code || "").trim();
  if (!isValidEmail(email)) return json({ ok: false, error: "Invalid email" }, 400);
  if (!codeValue) return json({ ok: false, error: "Missing code" }, 400);

  const codeHash = await sha256(codeValue);
  const code = await kvGet(kv, `code:${codeHash}`);
  if (!code || code.email !== email || code.redeemedAt) {
    return json({ ok: false, error: "Access code is invalid or already used" }, 403);
  }
  if (isExpired(code)) return json({ ok: false, error: "Access code expired" }, 403);

  const accessToken = randomId("vat");
  const token = {
    id: randomId("token"),
    tokenHash: await sha256(accessToken),
    email,
    plan: code.plan,
    orderId: code.orderId,
    createdAt: nowIso(),
    startDeadlineAt: code.startDeadlineAt || code.expiresAt,
    activatedAt: code.activatedAt || null,
    activeExpiresAt: code.activeExpiresAt || null,
    expiresAt: code.expiresAt,
    revokedAt: null
  };
  code.redeemedAt = nowIso();
  await kvPut(kv, `code:${codeHash}`, code);
  await kvPut(kv, `token:${token.tokenHash}`, token);

  return json({ ok: true, tier: token.plan, accessToken, expiresAt: token.expiresAt });
}

async function handleVerify(request, env) {
  if (request.method !== "POST") return methodNotAllowed();
  const kv = getKv(env);
  if (!kv) return json({ ok: false, error: "VITALRISE_ACCESS KV binding is not configured" }, 503);

  const body = await readJson(request);
  const tokenValue = String(body.token || "").trim();
  if (!tokenValue) return json({ ok: false, error: "Missing token" }, 401);

  const token = await kvGet(kv, `token:${await sha256(tokenValue)}`);
  if (!token || token.revokedAt || isExpired(token)) {
    return json({ ok: false, error: "Token is invalid or expired" }, 401);
  }

  return json(publicTokenPayload(token));
}

async function handleActivate(request, env) {
  if (request.method !== "POST") return methodNotAllowed();
  const kv = getKv(env);
  if (!kv) return json({ ok: false, error: "VITALRISE_ACCESS KV binding is not configured" }, 503);

  const body = await readJson(request);
  const tokenValue = String(body.token || "").trim();
  const source = String(body.source || "program").trim();
  if (!tokenValue) return json({ ok: false, error: "Missing token" }, 401);

  const token = await kvGet(kv, `token:${await sha256(tokenValue)}`);
  if (!token || token.revokedAt || isExpired(token)) {
    return json({ ok: false, error: "Token is invalid or expired" }, 401);
  }

  const activated = await activateToken(kv, token, source);
  return json(publicTokenPayload(activated));
}

async function handleOrder(request, env) {
  if (request.method !== "POST") return methodNotAllowed();
  const kv = getKv(env);
  if (!kv) return json({ ok: false, error: "VITALRISE_ACCESS KV binding is not configured" }, 503);

  const body = await readJson(request);
  const orderId = String(body.orderId || "").trim();
  const email = String(body.email || "").trim().toLowerCase();
  if (!orderId || !isValidEmail(email)) return json({ ok: false, error: "Missing order or email" }, 400);

  const order = await kvGet(kv, `order:${orderId}`);
  if (!order || order.email !== email) return json({ ok: false, error: "Order not found" }, 404);
  if (order.status !== "paid") {
    return json({ ok: false, status: order.status || "pending", orderId }, 202);
  }

  order.claimedAt = order.claimedAt || nowIso();
  await kvPut(kv, `order:${order.id}`, order);

  return json({
    ok: true,
    orderId: order.id,
    tier: order.plan,
    email: order.email,
    accessToken: order.accessToken,
    accessCode: order.accessCode,
    startDeadlineAt: order.startDeadlineAt,
    expiresAt: order.expiresAt
  });
}

async function handlePaymentReturn(request) {
  const url = new URL(request.url);
  let orderId = String(url.searchParams.get("orderId") || "").trim();
  const returnData = {
    transactionStatus: String(url.searchParams.get("transactionStatus") || "").trim(),
    reasonCode: String(url.searchParams.get("reasonCode") || "").trim(),
    reason: String(url.searchParams.get("reason") || "").trim()
  };

  if (!orderId && request.method === "POST") {
    const contentType = String(request.headers.get("content-type") || "").toLowerCase();
    try {
      if (contentType.includes("application/json")) {
        const body = await request.json();
        orderId = String(body.orderReference || body.orderId || "").trim();
        returnData.transactionStatus = String(body.transactionStatus || returnData.transactionStatus || "").trim();
        returnData.reasonCode = String(body.reasonCode || returnData.reasonCode || "").trim();
        returnData.reason = String(body.reason || returnData.reason || "").trim();
      } else {
        const text = await request.text();
        const params = new URLSearchParams(text);
        orderId = String(params.get("orderReference") || params.get("orderId") || "").trim();
        returnData.transactionStatus = String(params.get("transactionStatus") || returnData.transactionStatus || "").trim();
        returnData.reasonCode = String(params.get("reasonCode") || returnData.reasonCode || "").trim();
        returnData.reason = String(params.get("reason") || returnData.reason || "").trim();
      }
    } catch {
      orderId = "";
    }
  }

  const origin = getOrigin(request, {});
  const redirectUrl = new URL("/", origin);
  redirectUrl.searchParams.set("payment", "return");
  if (orderId) redirectUrl.searchParams.set("orderId", orderId);
  if (returnData.transactionStatus) redirectUrl.searchParams.set("paymentStatus", returnData.transactionStatus.slice(0, 80));
  if (returnData.reasonCode) redirectUrl.searchParams.set("reasonCode", returnData.reasonCode.slice(0, 40));
  if (returnData.reason) redirectUrl.searchParams.set("reason", returnData.reason.slice(0, 160));

  return Response.redirect(redirectUrl.toString(), 303);
}

async function handleWayForPayWebhook(request, env) {
  if (request.method !== "POST") return methodNotAllowed();
  const kv = getKv(env);
  if (!kv) return json({ ok: false, error: "VITALRISE_ACCESS KV binding is not configured" }, 503);
  if (!env.WAYFORPAY_MERCHANT_SECRET) return json({ ok: false, error: "WayForPay secret is not configured" }, 503);

  const body = await readJson(request);
  const orderId = String(body.orderReference || "").trim();
  const providedSignature = String(body.merchantSignature || request.headers.get("x-signature") || "").trim();
  const expectedSignature = wayForPayCallbackSignature(body, String(env.WAYFORPAY_MERCHANT_SECRET));

  if (!orderId || !providedSignature || expectedSignature !== providedSignature) {
    return json({ ok: false, error: "Invalid signature" }, 403);
  }

  const order = await kvGet(kv, `order:${orderId}`);
  if (!order) return json({ ok: false, error: "Order not found" }, 404);

  const status = String(body.transactionStatus || "").toLowerCase();
  const reasonCode = String(body.reasonCode || "");
  const approved = status === "approved" || status === "completed" || status === "success";

  if (approved && (!reasonCode || reasonCode === "1100")) {
    if (order.status !== "paid") {
      order.provider = "wayforpay";
      order.providerReference = String(body.authCode || body.cardPan || "");
      order.providerPayload = {
        transactionStatus: body.transactionStatus,
        reasonCode: body.reasonCode,
        paymentSystem: body.paymentSystem,
        createdDate: body.createdDate,
        processingDate: body.processingDate,
        recToken: body.recToken || ""
      };
      await issueAccess(kv, order);
    }
  }

  const responseStatus = "accept";
  const time = Math.floor(Date.now() / 1000);
  return json({
    orderReference: orderId,
    status: responseStatus,
    time,
    signature: wayForPayAcceptSignature(orderId, responseStatus, time, String(env.WAYFORPAY_MERCHANT_SECRET))
  });
}

export async function handleAccessRequest(context) {
  const { request, env } = context;
  const pathname = new URL(request.url).pathname.replace(/\/+$/, "");

  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204 });
  }

  try {
    if (pathname === "/api/access/health") return handleHealth(request, env);
    if (pathname === "/api/access/checkout") return handleCheckout(request, env);
    if (pathname === "/api/access/redeem") return handleRedeem(request, env);
    if (pathname === "/api/access/verify") return handleVerify(request, env);
    if (pathname === "/api/access/activate") return handleActivate(request, env);
    if (pathname === "/api/access/order") return handleOrder(request, env);
    if (pathname === "/api/access/return" || pathname === "/api/access/payment-return") return handlePaymentReturn(request);
    if (pathname === "/api/access/webhook/wayforpay") return handleWayForPayWebhook(request, env);
    return json({ ok: false, error: "API route not found" }, 404);
  } catch (error) {
    return json({ ok: false, error: error?.message || "Server error" }, 500);
  }
}

export const __test = { hmacMd5, md5Bytes };
