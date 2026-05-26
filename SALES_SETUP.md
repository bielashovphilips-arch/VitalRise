# VitalRise Sales & Analytics Setup Guide

This guide covers the critical Phase 1 implementation for monetization.

## 1. Payment Webhook Integration

### Overview
The system now supports automatic order confirmation via webhooks from:
- **LiqPay** (Ukrainian payment provider)
- **WayForPay** (Ukrainian payment provider)  
- **Mono** (Ukrainian fintech payment)

### Setup Steps

#### 1.1 LiqPay Webhook
1. Go to LiqPay merchant dashboard
2. Set webhook URL to: `https://yourdomain.com/api/access/webhook/liqpay`
3. Set webhook secret in environment:
   ```bash
   export LIQPAY_WEBHOOK_SECRET="your-secret-from-liqpay"
   node tools/access-server.js
   ```

#### 1.2 WayForPay Webhook
1. Go to WayForPay merchant settings
2. Set webhook URL to: `https://yourdomain.com/api/access/webhook/wayforpay`
3. Set webhook secret in environment:
   ```bash
   export WAYFORPAY_WEBHOOK_SECRET="your-secret-from-wayforpay"
   node tools/access-server.js
   ```

#### 1.3 Mono Webhook
1. Go to Mono business dashboard
2. Set webhook URL to: `https://yourdomain.com/api/access/webhook/mono`
3. Set webhook secret in environment:
   ```bash
   export MONO_WEBHOOK_SECRET="your-secret-from-mono"
   node tools/access-server.js
   ```

### Testing Webhooks Locally

For development, use `ACCESS_MOCK_PAYMENTS=1`:
```bash
ACCESS_MOCK_PAYMENTS=1 node tools/access-server.js
```

This bypasses webhook verification and auto-confirms all payments immediately.

### Webhook Signature Verification

Each provider uses different signature algorithms:

- **LiqPay**: HMAC-SHA1 of JSON body
- **WayForPay**: HMAC-MD5 of semicolon-separated sorted params
- **Mono**: HMAC-SHA256 of request body

All are verified in `tools/access-server.js`. If signature doesn't match, webhook is rejected with 403 Forbidden.

---

## 2. Google Analytics 4 Setup

### Overview
GA4 tracks:
- User interactions with pricing tiers
- Checkout funnel completion
- Purchase conversions
- Email signup events

### Setup Steps

1. **Get GA4 Measurement ID**:
   - Go to Google Analytics
   - Create property (or use existing)
   - Copy Measurement ID (format: `G-XXXXXXXXXX`)

2. **Update index.html**:
   ```html
   <!-- In <head> section, replace G-XXXXXXXXXX with your ID -->
   <script async src="https://www.googletagmanager.com/gtag/js?id=G-YOUR_ID"></script>
   ```

3. **Verify Tracking**:
   - Open site in browser
   - Open DevTools → Console
   - Expect no GA errors

### Events Tracked

| Event | Trigger | Data |
|-------|---------|------|
| `view_tier` | User opens pricing modal | tier: "start" \| "pro" \| "premium" |
| `begin_checkout` | User enters email | tier, email hash |
| `purchase` | Payment confirmed (mock or real) | tier, order_id |
| `redeem_code` | User activates access code | tier |
| `newsletter_signup` | User submits email | none |

### Viewing Data

1. Go to Google Analytics dashboard
2. Left sidebar → Events
3. Filter by event name (e.g., "purchase")
4. View event counts, user journeys, conversion paths

---

## 3. Enhanced Marketing Copy

### What Changed

Pricing tier descriptions now explain real benefits:

| Tier | Before | After |
|------|--------|-------|
| **Start** | "7-денний раціон, базова програма тренувань і PDF-звіт" | "7-денний раціон, базова програма тренувань, PDF-звіт і Blueprint" |
| **Pro** | "Coach, weekly check-in, прогрес, аналізи і розширений Blueprint" | "Усе з Start + Coach Command Center, тижневий check-in, прогрес-трекер, розширений Blueprint" |
| **Premium** | "усе з Pro, заявка на супровід і ручна корекція плану" | "Усе з Pro + персональний супровід, ручна корекція плану, пріоритетна підтримка" |

This makes it clear what each tier includes and what you get for more money.

---

## 4. Email Capture Form

### What's New

Newsletter signup form added to pricing section:
- Location: Above pricing cards
- Placeholder copy: "Хочеш першим дізнатися про оновлення?"
- Collects email for marketing

### Current State

- ✅ Form displays and accepts input
- ✅ Email validation works
- ✅ Stored in browser localStorage under `vitalrise:access:email`
- ❌ Backend integration with Brevo/MailChimp is **NOT** implemented yet (Phase 2)

### Phase 2 Integration

To connect to email service provider:

1. **MailChimp** (or Brevo, Sendgrid, etc.)
   - Sign up for account
   - Get API key
   - Create audience list
   - In `assets/js/modules/access.js`, update `bindNewsletterForm()` to POST to your backend
   - Backend receives email and adds to service provider via API

Example backend endpoint (Node.js):
```javascript
app.post('/api/newsletter/subscribe', async (req, res) => {
  const email = req.body.email;
  
  // Call MailChimp/Brevo API
  const response = await fetch('https://api.mailchimp.com/3.0/lists/[list-id]/members', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.MAILCHIMP_API_KEY}`
    },
    body: JSON.stringify({
      email_address: email,
      status: 'subscribed',
      tags: ['vitalrise-newsletter']
    })
  });
  
  res.json({ ok: true });
});
```

---

## 5. Testing Checklist

### Before Going Live

- [ ] Set all 3 webhook secrets in environment
- [ ] Test webhook with provider's test dashboard
- [ ] GA4 ID configured in index.html
- [ ] GA4 data shows "purchase" events in real-time
- [ ] Email form submits without errors
- [ ] Order confirmation email sends automatically
- [ ] User can access purchased modules immediately after payment

### Manual Testing

1. **Test Mock Payment**:
   ```bash
   ACCESS_MOCK_PAYMENTS=1 node tools/access-server.js
   ```
   - Go to http://localhost:4175/
   - Click pricing tier
   - Enter test email, submit
   - Should see "Test payment confirmed" instantly

2. **Test Real Webhook** (staging):
   ```bash
   LIQPAY_WEBHOOK_SECRET="test-secret" node tools/access-server.js
   ```
   - Create test order via `/api/access/checkout`
   - Simulate webhook POST with correct signature
   - Check if order auto-confirms

3. **Test GA4**:
   - Open DevTools → Network → check gtag calls
   - Purchase via mock mode
   - Check Google Analytics real-time dashboard

---

## 6. Environment Variables Reference

```bash
# Required for production webhooks
export LIQPAY_WEBHOOK_SECRET="..."
export WAYFORPAY_WEBHOOK_SECRET="..."
export MONO_WEBHOOK_SECRET="..."

# Optional: Admin can manually confirm orders
export ACCESS_ADMIN_SECRET="some-secret"

# Development: Auto-confirm all payments
export ACCESS_MOCK_PAYMENTS="1"

# Port and host
export PORT=4175
export HOST=127.0.0.1
```

---

## 7. Troubleshooting

### Webhook Not Triggering
- **Check**: Is the URL correct in payment provider dashboard?
- **Check**: Is webhook secret set in environment?
- **Check**: Are logs showing incoming requests? (`console.log` in server)

### GA4 Not Tracking
- **Check**: GA4 ID correct in index.html?
- **Check**: No CSP/script blocker preventing gtag.js load?
- **Check**: Are custom events firing? (Check `window.VitalRiseAnalytics`)

### Orders Not Confirming
- **Check**: Is payment provider sending correct status field?
- **Check**: Does orderId in webhook match orderId in database?
- **Check**: Is webhook signature valid?

---

## 8. Next Steps (Phase 2)

After Phase 1 is stable:

1. **Email Marketing**: Connect MailChimp/Brevo → send welcome email + discount code
2. **Testimonials**: Add customer quotes + case studies above pricing
3. **FAQ Section**: Answers to "What's included?", "How long is access valid?", etc
4. **Refund Policy**: Clear terms for money-back guarantee
5. **Support Chat**: Help users during checkout
6. **Affiliate Program**: Let users earn commissions for referrals
7. **Seasonal Campaigns**: Discount codes, limited-time offers
8. **SEO Content**: Blog posts about fitness, nutrition, lab testing

Each adds ~2-5% more conversion rate.

---

**Questions?** Check `README.md` for overview or review code in:
- `tools/access-server.js` — Webhook handlers
- `assets/js/modules/access.js` — GA4 tracking calls
- `index.html` — Newsletter form & GA4 script tag
