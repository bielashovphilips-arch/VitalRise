# VitalRise

Static athlete dashboard for nutrition, training, supplements, labs, progress, and Blueprint export.

## Run Locally

Open `index.html` directly in a browser, or run the local PowerShell server:

```powershell
powershell -ExecutionPolicy Bypass -File tools/dev-server.ps1
```

Then open:

```text
http://localhost:4173/
```

Use a different port if needed:

```powershell
powershell -ExecutionPolicy Bypass -File tools/dev-server.ps1 -Port 4174
```

## Access / Payments MVP

For protected Start / Pro / Premium modules, run the Node access server instead of opening `index.html` directly:

```powershell
node tools/access-server.js
```

Then open:

```text
http://127.0.0.1:4175/
```

For local testing with instant mock payment confirmation:

```powershell
$env:ACCESS_MOCK_PAYMENTS='1'; node tools/access-server.js
```

Production flow:

- user enters email and chooses Start / Pro / Premium
- `/api/access/checkout` creates an order
- LiqPay / WayForPay / Mono Pay webhook confirms the order on the server
- server automatically issues a unique access token or one-time access code
- the browser stores only the personal token and verifies it through `/api/access/verify`

**Webhook Integration** (New in Phase 1):

Configure payment provider webhooks to point to:

```text
POST /api/access/webhook/liqpay
POST /api/access/webhook/wayforpay
POST /api/access/webhook/mono
```

Set environment variables for webhook signature verification:

```bash
export LIQPAY_WEBHOOK_SECRET="your-liqpay-secret"
export WAYFORPAY_WEBHOOK_SECRET="your-wayforpay-secret"
export MONO_WEBHOOK_SECRET="your-mono-secret"
```

Orders will auto-confirm when webhooks receive payment confirmation. No manual `/admin/mark-paid` needed for production.

Manual order confirmation endpoint (for testing):

```text
POST /api/access/admin/mark-paid
Header: x-admin-secret: <ACCESS_ADMIN_SECRET>
Body: { "orderId": "..." }
```

Never use a shared public access code for real clients. Each purchase must get a unique token/code bound to email and expiry.

**Google Analytics Setup** (New in Phase 1):

Replace `G-XXXXXXXXXX` in `index.html` with your GA4 measurement ID:

```html
<script async src="https://www.googletagmanager.com/gtag/js?id=G-YOUR_ID"></script>
```

Tracked events:
- `view_tier` - User opens pricing modal
- `begin_checkout` - User enters email
- `purchase` - Successful payment (mock or real)
- `redeem_code` - Code activation
- `newsletter_signup` - Email newsletter signup

## Checks

Run the project sanity checks:

```powershell
powershell -ExecutionPolicy Bypass -File tools/check-project.ps1
```

The check validates:

- duplicate HTML ids
- JavaScript references to missing ids
- missing local `href` / `src` files
- unlabeled form controls
- number inputs without `min`, `max`, or `step`
- debug markers such as `console.log`, `debugger`, `TODO`, `FIXME`, and `alert()`
- duplicate nutrition product ids
- default nutrition selections that reference missing products
- required nutrition product fields and macro data
- expected module script references and global exports

## Current Module Split

The legacy app logic still lives mostly in `assets/js/script.js`. New system-level behavior is split into small modules:

- `assets/js/modules/system.js`
- `assets/js/modules/storage.js`
- `assets/js/modules/print.js`
- `assets/js/modules/calculator-shell.js`
- `assets/js/modules/reveal.js`
- `assets/js/modules/dashboard.js`
- `assets/js/modules/nutrition-custom.js`
- `assets/js/modules/nutrition.js`
- `assets/js/modules/nutrition-render.js`
- `assets/js/modules/training.js`
- `assets/js/modules/training-templates.js`
- `assets/js/modules/training-guidance.js`
- `assets/js/modules/training-progression.js`
- `assets/js/modules/training-render.js`
- `assets/js/modules/training-builder.js`
- `assets/js/modules/exercise-atlas-data.js`
- `assets/js/modules/exercise-atlas.js`
- `assets/js/modules/labs.js`
- `assets/js/modules/lab-protocols.js`
- `assets/js/modules/progress-decision.js`
- `assets/js/modules/blueprint.js`
- `assets/js/modules/supplements.js`
- `assets/js/modules/coach.js`

Nutrition module status:

- product database moved to `assets/js/modules/nutrition.js`
- calculator tabs, background switching, readiness console, and compact context labels moved to `assets/js/modules/calculator-shell.js`
- reveal-on-scroll UI behavior moved to `assets/js/modules/reveal.js`
- custom nutrition products, saved product-selection templates, and ready menu templates use `assets/js/modules/nutrition-custom.js`
- asparagus added as a selectable vegetable product
- meal names and automatic meal templates moved to `assets/js/modules/nutrition.js`
- calorie and macro calculation moved to `assets/js/modules/nutrition.js`
- food lookup, category filtering, portion normalization, and food macro math moved to `assets/js/modules/nutrition.js`
- meal item creation, meal totals, daily plan totals, meal distribution, allowed meal products, and default portion rules moved to `assets/js/modules/nutrition.js`
- meal validation, calorie optimization, selected-day summaries, manual meal selections, and nutrition accuracy status moved to `assets/js/modules/nutrition.js`
- nutrition builder row preparation moved to `assets/js/modules/nutrition.js`
- auto/manual meal-plan generation moved to `assets/js/modules/nutrition.js`
- nutrition HTML rendering helpers for constructor shells, manual builder, meal choice cards, meal constructor view, meal cards, final nutrition output, selected summaries, product lists, choice chips, phase recommendations, electrolytes, and accuracy cards moved to `assets/js/modules/nutrition-render.js`
- training calculation helpers, exercise builders, and label helpers moved to `assets/js/modules/training.js`
- gym, home, outdoor, female training templates and training constraints moved to `assets/js/modules/training-templates.js`
- training RIR, progression, deload, and warning rules moved to `assets/js/modules/training-guidance.js`
- weekly training progression schemes and exercise load updates moved to `assets/js/modules/training-progression.js`
- training result rendering moved to `assets/js/modules/training-render.js`
- training form orchestration and plan assembly moved to `assets/js/modules/training-builder.js`
- exercise atlas cards, image map, and missing-photo backlog moved to `assets/js/modules/exercise-atlas-data.js`
- exercise atlas modal, filters, focus behavior, and inline technique buttons moved to `assets/js/modules/exercise-atlas.js`
- lab panel protocol and lab result review moved to `assets/js/modules/lab-protocols.js`
- weekly progress decision logic and rendering moved to `assets/js/modules/progress-decision.js`
- Athlete Blueprint decision logic and result rendering moved to `assets/js/modules/blueprint.js`
- supplement protocol logic and rendering moved to `assets/js/modules/supplements.js`
- Coach Command Center adds Timeline, plan/fact, weekly check-in, training calendar, training execution log, progression advisor, mini charts, smart warnings, preset profiles, Blueprint 2.0, and PWA registration.
- service worker uses an app shell cache plus runtime cache for local CSS, JS, JSON, images, SVG, and markdown assets.

## Remaining Tooling Notes

- Browser smoke tests and JS syntax checks still need Node.js/Playwright installed locally.
- Image optimization for `assets/images/athlete.png` still needs an image tool such as ImageMagick, cwebp, ffmpeg, or a build pipeline that can emit WebP/AVIF.

Next refactor target: continue reducing `assets/js/script.js` by moving remaining UI orchestration and shared calculator helpers into focused modules.
