const crypto = require("crypto");
const fs = require("fs");
const http = require("http");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");

function loadEnvFile() {
  const candidates = [
    path.join(ROOT, ".env"),
    path.join(ROOT, "docs", ".env")
  ];

  candidates.forEach((envPath) => {
    if (!fs.existsSync(envPath)) return;
    const lines = fs.readFileSync(envPath, "utf8").replace(/^\uFEFF/, "").split(/\r?\n/);
    lines.forEach((line) => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) return;
      const separator = trimmed.indexOf("=");
      if (separator < 1) return;
      const key = trimmed.slice(0, separator).trim();
      let value = trimmed.slice(separator + 1).trim();
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }
      if (!Object.prototype.hasOwnProperty.call(process.env, key)) {
        process.env[key] = value;
      }
    });
  });
}

loadEnvFile();

const PORT = Number(process.env.PORT || 4175);
const HOST = process.env.HOST || "127.0.0.1";
const DATA_DIR = path.join(ROOT, ".vitalrise-access");
const DB_FILE = path.join(DATA_DIR, "access-db.json");
const ADMIN_SECRET = process.env.ACCESS_ADMIN_SECRET || "";
const MOCK_PAYMENTS = process.env.ACCESS_MOCK_PAYMENTS === "1";
const CHECKOUT_URL_TEMPLATE = process.env.CHECKOUT_URL_TEMPLATE || "";
const NEWSLETTER_WEBHOOK_URL = process.env.NEWSLETTER_WEBHOOK_URL || "";

const PLANS = {
  start: { tier: "start", price: 499, startWindowDays: 45, activeDays: 30 },
  pro: { tier: "pro", price: 1499, startWindowDays: 45, activeDays: 30 },
  premium: { tier: "premium", price: 3500, startWindowDays: 45, activeDays: 30 }
};

const WEBHOOK_SECRETS = {
  liqpay: process.env.LIQPAY_WEBHOOK_SECRET || "",
  wayforpay: process.env.WAYFORPAY_WEBHOOK_SECRET || "",
  mono: process.env.MONO_WEBHOOK_SECRET || ""
};

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".webmanifest": "application/manifest+json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".md": "text/markdown; charset=utf-8"
};

const SECURITY_HEADERS = {
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()"
};

function ensureDb() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify({ orders: [], codes: [], tokens: [], subscriptions: [], newsletter: [] }, null, 2));
  }
}

function readDb() {
  ensureDb();
  let raw = fs.readFileSync(DB_FILE, "utf8").replace(/^\uFEFF/, "");
  const jsonStart = raw.indexOf("{");
  if (jsonStart > 0) raw = raw.slice(jsonStart);
  const db = JSON.parse(raw);
  if (!Array.isArray(db.orders)) db.orders = [];
  if (!Array.isArray(db.codes)) db.codes = [];
  if (!Array.isArray(db.tokens)) db.tokens = [];
  if (!Array.isArray(db.subscriptions)) db.subscriptions = [];
  if (!Array.isArray(db.newsletter)) db.newsletter = [];
  return db;
}

function writeDb(db) {
  ensureDb();
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
}

function randomId(prefix) {
  return prefix + "_" + crypto.randomBytes(16).toString("hex");
}

function createCode(plan) {
  return "VR-" + plan.toUpperCase() + "-" + crypto.randomBytes(4).toString("hex").toUpperCase();
}

function hash(value) {
  return crypto.createHash("sha256").update(String(value)).digest("hex");
}

function nowIso() {
  return new Date().toISOString();
}

function addDays(days, fromDate) {
  const date = fromDate ? new Date(fromDate) : new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString();
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || "").trim());
}

function readJsonBody(request) {
  return new Promise((resolve, reject) => {
    if (typeof request.rawBody === "string") {
      if (!request.rawBody) return resolve({});
      try {
        return resolve(JSON.parse(request.rawBody));
      } catch (error) {
        return reject(new Error("Invalid JSON"));
      }
    }

    let body = "";
    request.on("data", (chunk) => {
      body += chunk;
      if (body.length > 1024 * 1024) {
        reject(new Error("Payload too large"));
        request.destroy();
      }
    });
    request.on("end", () => {
      if (!body) return resolve({});
      try {
        resolve(JSON.parse(body));
      } catch (error) {
        reject(new Error("Invalid JSON"));
      }
    });
  });
}

function sendJson(response, statusCode, payload) {
  const body = Buffer.from(JSON.stringify(payload, null, 2), "utf8");
  response.writeHead(statusCode, {
    ...SECURITY_HEADERS,
    "Content-Type": "application/json; charset=utf-8",
    "Content-Length": body.length,
    "Cache-Control": "no-store"
  });
  response.end(body);
}

function sendFile(response, filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const body = fs.readFileSync(filePath);
  response.writeHead(200, {
    ...SECURITY_HEADERS,
    "Content-Type": MIME_TYPES[ext] || "application/octet-stream",
    "Content-Length": body.length
  });
  response.end(body);
}

function safeFilePath(pathname) {
  const decoded = decodeURIComponent(pathname === "/" ? "/index.html" : pathname);
  const candidate = path.resolve(ROOT, decoded.replace(/^\/+/, ""));
  const relative = path.relative(ROOT, candidate);
  if (relative.startsWith("..") || path.isAbsolute(relative)) return "";
  if (fs.existsSync(candidate) && fs.statSync(candidate).isDirectory()) {
    return path.join(candidate, "index.html");
  }
  return candidate;
}

function issueAccess(db, order) {
  const plan = PLANS[order.plan];
  const code = createCode(order.plan);
  const rawToken = randomId("vat");
  const startDeadlineAt = addDays(plan.startWindowDays);
  const access = {
    id: randomId("code"),
    codeHash: hash(code),
    email: order.email,
    plan: order.plan,
    orderId: order.id,
    createdAt: nowIso(),
    startDeadlineAt,
    activatedAt: null,
    activeExpiresAt: null,
    expiresAt: startDeadlineAt,
    redeemedAt: null
  };
  const token = {
    id: randomId("token"),
    tokenHash: hash(rawToken),
    email: order.email,
    plan: order.plan,
    orderId: order.id,
    createdAt: nowIso(),
    startDeadlineAt,
    activatedAt: null,
    activeExpiresAt: null,
    expiresAt: access.expiresAt,
    revokedAt: null
  };

  order.status = "paid";
  order.paidAt = nowIso();
  db.codes.push(access);
  db.tokens.push(token);

  if (order.autoRenew) {
    db.subscriptions.push({
      id: randomId("sub"),
      email: order.email,
      plan: order.plan,
      orderId: order.id,
      provider: order.provider || "pending",
      status: "active",
      intervalDays: plan.activeDays,
      amount: plan.price,
      currency: order.currency || "UAH",
      createdAt: nowIso(),
      startDeadlineAt: access.startDeadlineAt,
      nextPaymentAt: access.expiresAt,
      cancelledAt: null,
      providerReference: order.providerReference || ""
    });
  }

  return { code, token: rawToken, expiresAt: access.expiresAt };
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

function getEffectiveExpiresAt(record) {
  if (!record) return "";
  return record.activatedAt
    ? (record.activeExpiresAt || record.expiresAt || "")
    : (record.startDeadlineAt || record.expiresAt || "");
}

function isAccessExpired(record) {
  const expiresAt = getEffectiveExpiresAt(record);
  return !expiresAt || new Date(expiresAt).getTime() < Date.now();
}

function activateToken(db, token, source) {
  const plan = PLANS[token.plan];
  if (!plan) return token;

  if (!token.activatedAt) {
    const activatedAt = nowIso();
    const activeExpiresAt = addDays(plan.activeDays, activatedAt);
    token.activatedAt = activatedAt;
    token.activeExpiresAt = activeExpiresAt;
    token.expiresAt = activeExpiresAt;
    token.activationSource = String(source || "program").slice(0, 80);

    const accessCode = db.codes.find((item) => item.orderId === token.orderId && item.email === token.email);
    if (accessCode) {
      accessCode.activatedAt = activatedAt;
      accessCode.activeExpiresAt = activeExpiresAt;
      accessCode.expiresAt = activeExpiresAt;
    }

    const subscription = db.subscriptions.find((item) => item.orderId === token.orderId && item.email === token.email && item.status === "active");
    if (subscription) {
      subscription.activatedAt = activatedAt;
      subscription.activeExpiresAt = activeExpiresAt;
      subscription.nextPaymentAt = activeExpiresAt;
    }
  }

  return token;
}

function buildCheckoutUrl(order) {
  if (!CHECKOUT_URL_TEMPLATE) return null;
  return CHECKOUT_URL_TEMPLATE
    .replace(/\{orderId\}/g, encodeURIComponent(order.id))
    .replace(/\{plan\}/g, encodeURIComponent(order.plan))
    .replace(/\{email\}/g, encodeURIComponent(order.email))
    .replace(/\{amount\}/g, encodeURIComponent(String(order.amount)))
    .replace(/\{currency\}/g, encodeURIComponent(order.currency));
}

// Webhook signature verification for payment providers
function verifyLiqPaySignature(data, signature) {
  if (!WEBHOOK_SECRETS.liqpay) return false;
  const secret = WEBHOOK_SECRETS.liqpay;
  const dataString = JSON.stringify(data);
  const hash = crypto
    .createHmac("sha1", secret)
    .update(dataString)
    .digest("base64");
  return hash === signature;
}

function verifyWayForPaySignature(data, signature) {
  if (!WEBHOOK_SECRETS.wayforpay) return false;
  const secret = WEBHOOK_SECRETS.wayforpay;
  const dataString = Object.keys(data)
    .sort()
    .map((key) => data[key])
    .join(";");
  const hash = crypto
    .createHmac("md5", secret)
    .update(dataString)
    .digest("hex");
  return hash === signature;
}

function verifyMonoSignature(body, xSignHeader) {
  if (!WEBHOOK_SECRETS.mono) return false;
  const secret = WEBHOOK_SECRETS.mono;
  const hash = crypto
    .createHmac("sha256", secret)
    .update(body)
    .digest("base64");
  return hash === xSignHeader;
}

async function handleApi(request, response, pathname) {
  if (request.method === "POST" && pathname === "/api/newsletter") {
    const body = await readJsonBody(request);
    const email = String(body.email || "").trim().toLowerCase();
    const language = String(body.language || "uk").trim().toLowerCase();
    const source = String(body.source || "site").trim().slice(0, 80);
    const page = String(body.page || "").trim().slice(0, 180);

    if (!isValidEmail(email)) return sendJson(response, 400, { ok: false, error: "Invalid email" });

    const db = readDb();
    const existing = db.newsletter.find((item) => item.email === email);
    const payload = {
      email,
      language,
      source,
      page,
      createdAt: existing ? existing.createdAt : nowIso(),
      updatedAt: nowIso()
    };

    if (existing) {
      existing.language = payload.language;
      existing.source = payload.source;
      existing.page = payload.page;
      existing.updatedAt = payload.updatedAt;
      existing.count = Number(existing.count || 1) + 1;
    } else {
      db.newsletter.push(Object.assign({ id: randomId("lead"), count: 1 }, payload));
    }

    writeDb(db);

    let forwarded = false;
    let forwardStatus = null;
    let forwardError = "";
    if (NEWSLETTER_WEBHOOK_URL && typeof fetch === "function") {
      try {
        const forwardResponse = await fetch(NEWSLETTER_WEBHOOK_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
        forwardStatus = forwardResponse.status;
        forwarded = forwardResponse.ok;
      } catch (error) {
        forwardError = error.message || "Forward failed";
        forwarded = false;
      }
    }

    return sendJson(response, 200, {
      ok: true,
      stored: true,
      forwarded,
      forwardStatus,
      forwardError,
      newsletterWebhook: Boolean(NEWSLETTER_WEBHOOK_URL)
    });
  }

  if (request.method === "GET" && pathname === "/api/access/health") {
    return sendJson(response, 200, {
      ok: true,
      mockPayments: MOCK_PAYMENTS,
      newsletterWebhook: Boolean(NEWSLETTER_WEBHOOK_URL)
    });
  }

  if (request.method === "POST" && pathname === "/api/access/checkout") {
    const body = await readJsonBody(request);
    const plan = String(body.plan || "").toLowerCase();
    const email = String(body.email || "").trim().toLowerCase();

    if (!PLANS[plan]) return sendJson(response, 400, { ok: false, error: "Unknown plan" });
    if (!isValidEmail(email)) return sendJson(response, 400, { ok: false, error: "Invalid email" });

    const db = readDb();
    const autoRenew = body.autoRenew === true;
    const order = {
      id: randomId("order"),
      email,
      plan,
      amount: PLANS[plan].price,
      currency: "UAH",
      startWindowDays: PLANS[plan].startWindowDays,
      activeDays: PLANS[plan].activeDays,
      autoRenew,
      renewalIntervalDays: autoRenew ? PLANS[plan].activeDays : 0,
      status: "pending",
      createdAt: nowIso(),
      paidAt: null,
      provider: MOCK_PAYMENTS ? "mock" : "manual"
    };
    db.orders.push(order);

    if (MOCK_PAYMENTS) {
      const access = issueAccess(db, order);
      writeDb(db);
      return sendJson(response, 200, {
        ok: true,
        mode: "mock",
        orderId: order.id,
        tier: plan,
        accessToken: access.token,
        accessCode: access.code,
        expiresAt: access.expiresAt
      });
    }

    writeDb(db);
    return sendJson(response, 200, {
      ok: true,
      mode: "pending",
      orderId: order.id,
      message: CHECKOUT_URL_TEMPLATE
        ? "Order created. Redirecting to payment."
        : "Order created. Add CHECKOUT_URL_TEMPLATE to redirect clients to payment.",
      checkoutUrl: buildCheckoutUrl(order)
    });
  }

  if (request.method === "POST" && pathname === "/api/access/redeem") {
    const body = await readJsonBody(request);
    const email = String(body.email || "").trim().toLowerCase();
    const code = String(body.code || "").trim();

    if (!isValidEmail(email)) return sendJson(response, 400, { ok: false, error: "Invalid email" });
    if (!code) return sendJson(response, 400, { ok: false, error: "Missing code" });

    const db = readDb();
    const codeHash = hash(code);
    const accessCode = db.codes.find((item) => item.codeHash === codeHash);

    if (!accessCode || accessCode.email !== email || accessCode.redeemedAt) {
      return sendJson(response, 403, { ok: false, error: "Access code is invalid or already used" });
    }

    if (isAccessExpired(accessCode)) {
      return sendJson(response, 403, { ok: false, error: "Access code expired" });
    }

    const rawToken = randomId("vat");
    const token = {
      id: randomId("token"),
      tokenHash: hash(rawToken),
      email,
      plan: accessCode.plan,
      orderId: accessCode.orderId,
      createdAt: nowIso(),
      startDeadlineAt: accessCode.startDeadlineAt || accessCode.expiresAt,
      activatedAt: accessCode.activatedAt || null,
      activeExpiresAt: accessCode.activeExpiresAt || null,
      expiresAt: accessCode.expiresAt,
      revokedAt: null
    };
    accessCode.redeemedAt = nowIso();
    db.tokens.push(token);
    writeDb(db);

    return sendJson(response, 200, { ok: true, tier: token.plan, accessToken: rawToken, expiresAt: token.expiresAt });
  }

  if (request.method === "POST" && pathname === "/api/access/verify") {
    const body = await readJsonBody(request);
    const tokenValue = String(body.token || "").trim();
    if (!tokenValue) return sendJson(response, 401, { ok: false, error: "Missing token" });

    const db = readDb();
    const token = db.tokens.find((item) => item.tokenHash === hash(tokenValue));
    if (!token || token.revokedAt || isAccessExpired(token)) {
      return sendJson(response, 401, { ok: false, error: "Token is invalid or expired" });
    }

    return sendJson(response, 200, publicTokenPayload(token));
  }

  if (request.method === "POST" && pathname === "/api/access/activate") {
    const body = await readJsonBody(request);
    const tokenValue = String(body.token || "").trim();
    const source = String(body.source || "program").trim();
    if (!tokenValue) return sendJson(response, 401, { ok: false, error: "Missing token" });

    const db = readDb();
    const token = db.tokens.find((item) => item.tokenHash === hash(tokenValue));
    if (!token || token.revokedAt || isAccessExpired(token)) {
      return sendJson(response, 401, { ok: false, error: "Token is invalid or expired" });
    }

    const activated = activateToken(db, token, source);
    writeDb(db);
    return sendJson(response, 200, publicTokenPayload(activated));
  }

  if (request.method === "POST" && pathname === "/api/access/admin/mark-paid") {
    if (!ADMIN_SECRET || request.headers["x-admin-secret"] !== ADMIN_SECRET) {
      return sendJson(response, 403, { ok: false, error: "Forbidden" });
    }

    const body = await readJsonBody(request);
    const orderId = String(body.orderId || "").trim();
    const db = readDb();
    const order = db.orders.find((item) => item.id === orderId);

    if (!order) return sendJson(response, 404, { ok: false, error: "Order not found" });
    if (order.status === "paid") return sendJson(response, 409, { ok: false, error: "Order already paid" });

    const access = issueAccess(db, order);
    writeDb(db);

    return sendJson(response, 200, {
      ok: true,
      orderId: order.id,
      email: order.email,
      tier: order.plan,
      accessCode: access.code,
      expiresAt: access.expiresAt
    });
  }

  // LiqPay webhook endpoint
  if (request.method === "POST" && pathname === "/api/access/webhook/liqpay") {
    const body = await readJsonBody(request);
    const signature = request.headers["x-signature"] || request.headers["x-liqpay-signature"];

    if (!verifyLiqPaySignature(body, signature)) {
      return sendJson(response, 403, { ok: false, error: "Invalid signature" });
    }

    const orderId = String(body.order_id || "").trim();
    const status = String(body.status || "").toLowerCase();

    if (status !== "success" && status !== "completed") {
      return sendJson(response, 200, { ok: true, message: "Payment not confirmed yet" });
    }

    const db = readDb();
    const order = db.orders.find((item) => item.id === orderId);

    if (!order) {
      return sendJson(response, 404, { ok: false, error: "Order not found" });
    }

    if (order.status === "paid") {
      return sendJson(response, 200, { ok: true, message: "Order already paid" });
    }

    const access = issueAccess(db, order);
    order.provider = "liqpay";
    writeDb(db);

    console.log(`✓ LiqPay payment confirmed for order ${orderId} (${order.email})`);

    return sendJson(response, 200, {
      ok: true,
      orderId: order.id,
      email: order.email,
      tier: order.plan
    });
  }

  // WayForPay webhook endpoint
  if (request.method === "POST" && pathname === "/api/access/webhook/wayforpay") {
    const body = await readJsonBody(request);
    const signature = request.headers["x-signature"];

    if (!verifyWayForPaySignature(body, signature)) {
      return sendJson(response, 403, { ok: false, error: "Invalid signature" });
    }

    const orderId = String(body.orderReference || "").trim();
    const status = String(body.transactionStatus || "").toLowerCase();

    if (status !== "completed") {
      return sendJson(response, 200, { ok: true, message: "Payment not completed" });
    }

    const db = readDb();
    const order = db.orders.find((item) => item.id === orderId);

    if (!order) {
      return sendJson(response, 404, { ok: false, error: "Order not found" });
    }

    if (order.status === "paid") {
      return sendJson(response, 200, { ok: true, message: "Order already paid" });
    }

    const access = issueAccess(db, order);
    order.provider = "wayforpay";
    writeDb(db);

    console.log(`✓ WayForPay payment confirmed for order ${orderId} (${order.email})`);

    return sendJson(response, 200, {
      ok: true,
      orderId: order.id,
      email: order.email,
      tier: order.plan
    });
  }

  // Mono webhook endpoint
  if (request.method === "POST" && pathname === "/api/access/webhook/mono") {
    const rawBody = request.rawBody || "";
    const xSignHeader = request.headers["x-sign"];

    if (!verifyMonoSignature(rawBody, xSignHeader)) {
      return sendJson(response, 403, { ok: false, error: "Invalid signature" });
    }

    const body = await readJsonBody(request);
    const orderId = String(body.reference || "").trim();
    const status = String(body.status || "").toLowerCase();

    if (status !== "success") {
      return sendJson(response, 200, { ok: true, message: "Payment not successful" });
    }

    const db = readDb();
    const order = db.orders.find((item) => item.id === orderId);

    if (!order) {
      return sendJson(response, 404, { ok: false, error: "Order not found" });
    }

    if (order.status === "paid") {
      return sendJson(response, 200, { ok: true, message: "Order already paid" });
    }

    const access = issueAccess(db, order);
    order.provider = "mono";
    writeDb(db);

    console.log(`✓ Mono payment confirmed for order ${orderId} (${order.email})`);

    return sendJson(response, 200, {
      ok: true,
      orderId: order.id,
      email: order.email,
      tier: order.plan
    });
  }

  return sendJson(response, 404, { ok: false, error: "API route not found" });
}

const server = http.createServer(async (request, response) => {
  const requestUrl = new URL(request.url || "/", `http://${request.headers.host || HOST}`);
  const pathname = requestUrl.pathname || "/";

  try {
    // Capture raw body for webhook signature verification
    if (pathname.startsWith("/api/access/webhook")) {
      let rawBody = "";
      request.on("data", (chunk) => {
        rawBody += chunk;
      });
      request.on("end", () => {
        request.rawBody = rawBody;
        handleRequest().catch((error) => {
          if (!response.headersSent) {
            sendJson(response, 500, { ok: false, error: error.message || "Server error" });
          }
        });
      });
    } else {
      await handleRequest();
    }

    async function handleRequest() {
      if (pathname === "/api/newsletter" || pathname.startsWith("/api/access/")) {
        return await handleApi(request, response, pathname);
      }

      const filePath = safeFilePath(pathname);
      if (!filePath || !fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
        response.writeHead(404, { ...SECURITY_HEADERS, "Content-Type": "text/plain; charset=utf-8" });
        return response.end("404 Not Found");
      }

      return sendFile(response, filePath);
    }
  } catch (error) {
    return sendJson(response, 500, { ok: false, error: error.message || "Server error" });
  }
});

ensureDb();
server.listen(PORT, HOST, () => {
  console.log(`VitalRise access server running at http://${HOST}:${PORT}/`);
  console.log(`Mock payments: ${MOCK_PAYMENTS ? "on" : "off"}`);
});
