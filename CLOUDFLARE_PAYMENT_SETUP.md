# VitalRise payment setup on Cloudflare Pages

The site is static, so payment API routes must run through Cloudflare Pages Functions.
The repository includes these production routes:

- `GET /api/access/health`
- `POST /api/access/checkout`
- `POST /api/access/webhook/wayforpay`
- `POST /api/access/order`
- `POST /api/access/redeem`
- `POST /api/access/verify`
- `POST /api/access/activate`

## Cloudflare bindings

In Cloudflare Dashboard → Workers & Pages → VitalRise Pages project → Settings:

1. Add a KV namespace binding:
   - Variable name: `VITALRISE_ACCESS`
   - Namespace: create/select a KV namespace for VitalRise access orders and tokens.

2. Add environment variables/secrets:
   - `SITE_ORIGIN` = `https://vitalrise.com.ua`
   - `WAYFORPAY_MERCHANT_DOMAIN` = `vitalrise.com.ua`
   - `WAYFORPAY_MERCHANT_ACCOUNT` = merchant account from WayForPay
   - `WAYFORPAY_MERCHANT_SECRET` = merchant secret key from WayForPay

3. For test-only mock payments, add:
   - `ACCESS_MOCK_PAYMENTS` = `1`

Remove `ACCESS_MOCK_PAYMENTS` before real payments.

## WayForPay settings

Use this callback/service URL in WayForPay:

```text
https://vitalrise.com.ua/api/access/webhook/wayforpay
```

The checkout function creates a WayForPay Purchase request, receives a payment URL,
and sends the client to WayForPay. After successful payment, the webhook marks the
order as paid and issues access.

## Smoke tests after deploy

```powershell
Invoke-WebRequest https://vitalrise.com.ua/api/access/health
```

Expected JSON:

```json
{
  "ok": true,
  "runtime": "cloudflare-pages-functions",
  "storage": true,
  "wayForPay": true
}
```

If `storage` is `false`, the KV binding is missing.
If `wayForPay` is `false`, the WayForPay merchant variables are missing.

## Auto-renewal note

The checkout stores the user's auto-renewal consent with the order/subscription data.
Actual recurring charges require an additional scheduled recurrent-charge worker using
the WayForPay recurring/token flow after the merchant account is approved. The stored
subscription date is moved to the active program end after the user starts the program.
