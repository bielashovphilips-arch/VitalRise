# VitalRise Telegram bot

The bot runs as a Cloudflare Pages Function at:

```text
https://vitalrise.com.ua/api/telegram/webhook
```

It handles `/start` and `/coach` in private chats. Both replies contain the **Написати тренеру** button linking to `https://t.me/bielashov`.

## One-time production setup

1. In Cloudflare Pages, add two encrypted environment variables for the production environment:
   - `TELEGRAM_BOT_TOKEN` — the token issued by BotFather;
   - `TELEGRAM_WEBHOOK_SECRET` — a new random value of 32 or more letters, digits, `_`, or `-`.
2. Deploy this project to Cloudflare Pages.
3. In PowerShell, set the same values only for the current terminal session and run:

```powershell
$env:TELEGRAM_BOT_TOKEN='paste-token-here'
$env:TELEGRAM_WEBHOOK_SECRET='paste-webhook-secret-here'
$env:SITE_ORIGIN='https://vitalrise.com.ua'
node tools/configure-telegram-bot.js
```

The script configures the Telegram command menu in this order: `/start`, then `/coach`, and registers the webhook. It never writes either secret to a file.

## Access rule

The website displays its **Відкрити Telegram** button only after server-confirmed PRO payment. A public Telegram username can still be opened manually by anyone; Telegram does not offer a way to hide a public bot by username. If the bot later needs to expose paid-only bot features, it will need a payment-to-Telegram account linking flow.
