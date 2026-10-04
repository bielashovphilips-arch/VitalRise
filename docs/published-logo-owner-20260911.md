# Published logo and owner access

- Production: https://vitalrise.com.ua
- Commit: `0f5ae1e03ec1c8ef1fcd9ccf0a27a51a128d859c` (includes `da69f54`).
- Cloudflare deployment: `192b4d87-fccb-4ad9-b1ae-d6c33df5e90e`, succeeded 2026-09-11 15:37:16 UTC.
- Isolated release worktree: `.tmp/logo-owner-release-20260911`, branch `release/logo-owner-20260911`.
- Approved SVG is used in headers, footers, favicons and manifest. Other production styling, photos and animations are preserved.
- Owner login: https://vitalrise.com.ua/founder-access, email `bielashovphilips@gmail.com`.
- Owner approved a new secret. It was configured securely; private login instructions are in ignored `.vitalrise-access/Founder-login-20260911.txt`, restricted to the current Windows user and SYSTEM. No secrets were committed or deployed as static assets.
- Owner role is permanent admin, verified by the server; expired paid tokens and unauthenticated requests remain denied.
- Production browser tests passed at 390 and 1440 pixels across homepage, labs, nutrition, training, supplements, profile, recovery, progress and blueprint. No paywalls for authenticated owner; guest and forged roles remain locked. These tests do not log the user's everyday browser in: the owner must enter the new key there once.
- Auth tests passed in the Workers runtime; all five training release tests passed; Pages Functions compilation passed.

The primary workspace still contains unrelated unpublished edits. Do not deploy it wholesale. Backend and founder form fixes have been synchronized locally; release HTML/cache versions and narrowly scoped access changes are authoritative in the isolated release worktree.
