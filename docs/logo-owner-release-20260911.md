# Logo and owner access — 2026-09-11

Release based on `fc8caba` (published training update).

- Publish the approved metallic VR SVG, use it in existing header/footer holders, favicon and manifest.
- Preserve existing holder sizes and all other production CSS, photos, animations and page content.
- Version icon, access script and service-worker caches for returning visitors.
- Publish the owner sign-in page and backend: email plus server-held secret, hashed access tokens, permanent admin entitlement and revocation checks.
- Verify admin tokens on every page load; a stored role or URL parameter cannot unlock production access.
- Clear stale subscription dates and pending orders when signing in as owner.
- Owner secret is never published, stored in browser storage, or written to this worktree.
- Existing customer payment flows and paid-plan expiration stay unchanged.

Validation: `npm run test:training`, `npm run test:owner`, Pages Functions build, mobile/desktop browser login and navigation across nine routes. Local verification uses Miniflare KV, never customer records. Live verification issues only owner sessions; no checkout, payment or newsletter writes.

Production owner: `bielashovphilips@gmail.com`. Login: `https://vitalrise.com.ua/founder-access`.
The owner approved key rotation. Private login instructions are stored outside this deployment worktree; use a password manager and do not share them.

Other accumulated homepage, nutrition, marketing and training-journal changes remain unpublished.
