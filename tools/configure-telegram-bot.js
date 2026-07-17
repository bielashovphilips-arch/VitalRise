const token = String(process.env.TELEGRAM_BOT_TOKEN || "").trim();
const webhookSecret = String(process.env.TELEGRAM_WEBHOOK_SECRET || "").trim();
const siteOrigin = String(process.env.SITE_ORIGIN || "https://vitalrise.com.ua").trim().replace(/\/+$/, "");

if (!token) throw new Error("Set TELEGRAM_BOT_TOKEN before running this script.");
if (!/^[A-Za-z0-9_-]{1,256}$/.test(webhookSecret)) {
  throw new Error("Set TELEGRAM_WEBHOOK_SECRET to 1-256 characters: A-Z, a-z, 0-9, _ or -.");
}

const apiUrl = (method) => `https://api.telegram.org/bot${token}/${method}`;

async function telegram(method, payload) {
  const response = await fetch(apiUrl(method), {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify(payload)
  });
  const result = await response.json().catch(() => ({}));
  if (!response.ok || !result.ok) {
    throw new Error(`${method} failed: ${result.description || response.status}`);
  }
}

async function main() {
  await telegram("setMyCommands", {
    commands: [
      { command: "start", description: "Головне меню" },
      { command: "coach", description: "Написати тренеру" }
    ],
    scope: { type: "all_private_chats" }
  });

  await telegram("setWebhook", {
    url: `${siteOrigin}/api/telegram/webhook`,
    secret_token: webhookSecret,
    allowed_updates: ["message"]
  });

  console.log("Telegram bot commands and webhook are configured.");
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
