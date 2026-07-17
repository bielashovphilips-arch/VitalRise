const TELEGRAM_API_URL = "https://api.telegram.org";
const COACH_TELEGRAM_URL = "https://t.me/bielashov";

function json(payload, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff"
    }
  });
}

function getConfig(env) {
  return {
    token: String(env.TELEGRAM_BOT_TOKEN || "").trim(),
    webhookSecret: String(env.TELEGRAM_WEBHOOK_SECRET || "").trim()
  };
}

function isAuthorized(request, webhookSecret) {
  if (!webhookSecret) return false;
  const provided = String(request.headers.get("X-Telegram-Bot-Api-Secret-Token") || "");
  return provided === webhookSecret;
}

async function callTelegram(token, method, payload) {
  const response = await fetch(`${TELEGRAM_API_URL}/bot${token}/${method}`, {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify(payload)
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok || !body.ok) {
    throw new Error(`Telegram ${method} failed`);
  }
  return body.result;
}

function coachKeyboard() {
  return {
    inline_keyboard: [[{
      text: "Написати тренеру",
      url: COACH_TELEGRAM_URL
    }]]
  };
}

function getReply(messageText) {
  const command = String(messageText || "").trim().toLowerCase().split(/\s+/)[0];
  if (command === "/start") {
    return "Вітаю у VitalRise!\n\nОбирайте програму на сайті, а для запитань щодо тренувань та супроводу напишіть тренеру.";
  }
  if (command === "/coach") {
    return "Зв’язок із тренером VitalRise:";
  }
  return "Оберіть команду в меню: /start або /coach.";
}

export async function handleTelegramWebhook(context) {
  const { request, env } = context;
  if (request.method !== "POST") return json({ ok: false, error: "Method not allowed" }, 405);

  const { token, webhookSecret } = getConfig(env);
  if (!token || !webhookSecret) {
    return json({ ok: false, error: "Telegram bot is not configured" }, 503);
  }
  if (!isAuthorized(request, webhookSecret)) {
    return json({ ok: false, error: "Forbidden" }, 403);
  }

  const update = await request.json().catch(() => null);
  const message = update && update.message;
  const chatId = message && message.chat && message.chat.id;
  if (!chatId || message.chat.type !== "private" || typeof message.text !== "string") {
    return json({ ok: true });
  }

  try {
    await callTelegram(token, "sendMessage", {
      chat_id: chatId,
      text: getReply(message.text),
      reply_markup: coachKeyboard()
    });
  } catch {
    return json({ ok: false, error: "Telegram delivery failed" }, 502);
  }

  return json({ ok: true });
}

export const __test = { getReply, coachKeyboard };
