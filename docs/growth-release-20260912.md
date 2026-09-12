# Growth copy release — 12 September 2026

Isolated from production baseline `0f5ae1e`. User approved completing and publishing previously agreed copy/conversion work, without redesign.

## Included

- Header CTA across app pages and main hero: free calorie calculator, localized in Ukrainian, English and Russian.
- Pricing and FAQ: free estimate versus paid plans, 7-day meal plan versus 30-day access, activation timing, Pro tools versus Premium personal support.
- Illustrative scenarios explicitly labeled; no invented testimonials or results.
- Newsletter submission requires current consent and confirmed server storage. Failure preserves the email for retry; subscription does not replace the checkout email. No automatic submission of old browser queues.
- Newsletter Pages Function uses existing KV with bounded JSON input, origin checks, generic errors and optional existing webhook. No campaign or real test lead sent.
- Analytics opt-in only on public marketing routes, sanitized URLs, separate calculator/lead events, purchase deduplication. Meta Pixel disabled.
- Language selection persists between pages; localized page metadata/canonical URLs omit tracking parameters.
- Cache versions updated for deployed JS and service worker.

## Preserved

All existing CSS, photos, SVG/logo, animations, layout, nutrition implementation, training prescription and owner authentication backend remain unchanged. Founder secret was not rotated. Prices and payment/activation logic were not changed.

## Validation

- `node --test tests/site-regression.test.mjs tests/training-release.test.mjs tests/owner-access.test.mjs`: 14 pass, 0 fail, 1 pre-existing photo TODO.
- Owner browser verification: guest lock, forged-role/token rejection, owner Premium access on nine routes at 390/1440px.
- Training browser verification: approved preparation ordering, four-day PPL, no runtime errors or overflow at 390/1440px; automated matrix covers 135 combinations.
- Existing CSS/photo/logo preservation is checked against git baseline, including binary images.
- Impeccable copy review and detector; desktop/mobile visual inspection retained incumbent design.
- After deployment: `node tools/verify-growth-live.mjs` checks live asset hashes, localized navigation/calculator/checkout and newsletter route without creating leads or charges.

## Still separate / not published here

- Paid advertisements, social posts, videos, PDF promotion assets and email campaigns.
- Other accumulated local nutrition/training-journal/CSS changes.
- Missing original `assets/images/nutrition-athlete.jpg`: existing 404; replacement photo needs owner material/approval.
- `npm audit` reports three existing high-severity findings in development-only Miniflare/sharp/undici dependencies. These are not bundled into the static frontend or Pages Function. Dependency upgrade remains separate from this scoped release.

Deployment uses the existing Cloudflare Pages Git integration on `main`.
