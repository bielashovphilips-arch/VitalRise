# Google Analytics 4 для VitalRise

1. Створи ресурс у Google Analytics 4.
2. Відкрий `Admin` -> `Data streams` -> `Web`.
3. Скопіюй `Measurement ID` у форматі `G-XXXXXXXXXX`.
4. Додай у `.env` або `docs/.env`:

```env
GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

5. Перезбери сайт:

```powershell
powershell -ExecutionPolicy Bypass -File tools\build-index.ps1
```

Сайт відправляє події:

- `view_tier` - відкриття тарифу;
- `begin_checkout` - старт оформлення;
- `purchase` - підтвердження покупки;
- `redeem_code` - активація коду;
- `newsletter_signup` - підписка email.

Email у Google Analytics не передається.
