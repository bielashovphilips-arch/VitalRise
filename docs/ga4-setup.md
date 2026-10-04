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
- `newsletter_signup` - успішна підписка email;
- `generate_lead` - успішний newsletter signup або успішне отримання результату безкоштовного калькулятора. Подія містить `lead_source` і `form_name`.

Події відправляються тільки після згоди користувача на маркетингову аналітику. Для Google Ads як основну конверсію варто позначити `generate_lead` для newsletter, а безкоштовний калькулятор аналізувати окремо за параметром `lead_source=free_calculator`.

Email у Google Analytics не передається.
