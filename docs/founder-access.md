# Безстроковий Founder-доступ

У VitalRise додано окремий endpoint `/api/access/founder`. Він видає безстроковий `admin`-токен лише після двох перевірок:

- email збігається з `FOUNDER_EMAIL`;
- заголовок `X-Founder-Secret` збігається з секретом `FOUNDER_ACCESS_SECRET`.

Звичайна оплата клієнтів і коди подарункового доступу не змінюються.

## Production Cloudflare

У Cloudflare Dashboard відкрий Pages → проєкт VitalRise → Settings → Variables and Secrets → Production і додай:

```text
FOUNDER_EMAIL = bielashovphilips@gmail.com
FOUNDER_ACCESS_SECRET = довгий випадковий секрет
```

`FOUNDER_ACCESS_SECRET` потрібно створити як зашифрований Secret, а не як відкриту змінну. Його значення не додається до репозиторію й не вбудовується у JavaScript.

Після додавання змінних виконай новий production deploy. Альтернатива через Wrangler:

```powershell
npx wrangler pages secret put FOUNDER_ACCESS_SECRET --project-name vitalrise
```

Email можна додати у Dashboard як production variable. Для локального access-server додай обидва значення у локальний `.env`, який не комітиться:

```env
FOUNDER_EMAIL=bielashovphilips@gmail.com
FOUNDER_ACCESS_SECRET=довгий-випадковий-секрет
```

## Вхід

Після deploy відкрий:

```text
https://vitalrise.com.ua/founder-access
```

Введи email засновника і секрет. Сервер збереже токен у KV `VITALRISE_ACCESS`, а браузер збереже лише access-токен. Токен має `plan: admin`, `permanent: true` і не має дати завершення.

Не передавай `FOUNDER_ACCESS_SECRET` клієнтам і не вставляй його в HTML, frontend JavaScript або URL.
