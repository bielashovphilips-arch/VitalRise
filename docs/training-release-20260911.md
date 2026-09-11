# Training load release — 2026-09-11

Baseline: production deployment `b6f4e512-c760-47f4-92bf-be3e0cf68fd2`, Git commit `9b88909`. Public training, nutrition, access, stylesheet, logo and service worker were compared against that commit. They match; the local working directory includes additional unpublished differences and was not used wholesale.

## Release scope

- Apply the agreed preparation / main / accessory order to existing resistance programs, with strength retaining its priority main lift first.
- Redistribute existing isolation work; do not add duplicate work. Control RIR and retain adequate rest.
- Reduce volume according to level, weekly sessions and estimated available time. Estimates are coaching starting points, not a guarantee of optimal recovery.
- Stop calendar-driven automatic kg increases; provide explicit progression criteria requiring all sets, upper rep target, RIR, technique and no pain. The public version has no workout journal: actual results remain user-recorded, and this release makes no claim of automatic technique assessment or automated history-based load selection.
- Honor requested weekly session counts, including rotating PPL across weeks.
- Preserve specific circuit/ladder protocols rather than universally converting them into pre-exhaustion work.
- Fix the existing undefined `exerciseNeedsPhoto` helper used by the exercise atlas, without changing image assets.
- Version updated scripts and caches.

No changes to CSS, photos, logo, animation, pricing, payments, nutrition, analytics, backend Functions or Cloudflare bindings. The local-only workout journal, initial-period flow, founder access, newsletter changes and promotional files are not included.

## Verification

- `npm run test:training`: isolation/order, 135 place/level/goal/frequency combinations, short-duration variants, PPL rotation, no calendar kg increases, deload synchronization and unchanged protected modules.
- `npm run check`: existing structural checks.
- Real browser, widths 390 and 1440: homepage, nutrition and training load; selectable PPL frequency; rendered first exercise matches generated order; no page JavaScript errors or horizontal overflow.
- Browser verification aborts external tracking and all API writes; no payments, customer records or emails are created.

Publication uses the isolated release branch based on current production, not the owner's dirty working tree. The previous Cloudflare deployment remains available for rollback.
