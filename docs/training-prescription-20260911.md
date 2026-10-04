# Training prescription update — 2026-09-11

Status: implemented and tested locally; not deployed. Existing unrelated worktree changes were preserved. Photos, CSS, animation and component frames were not edited.

## Publication follow-up (2026-09-11)

The training-only subset has now been published from an isolated worktree based on the verified live baseline `9b88909`, not from this dirty working directory. Production commit: `fc8caba0e595de840ae246d54f388a499a872661`; Cloudflare deployment: `c46911ac-e8eb-42a7-976b-211d3ccdd8f8` (`https://c46911ac.vitalrise-7kc.pages.dev`). Live URL: `https://vitalrise.com.ua/training`.

Published: exercise ordering, RIR/rest instructions, volume/time constraints, weekly PPL scheduling, removal of calendar-driven kg increases, and the missing exercise-atlas helper. Existing public rendering, CSS, images, nutrition, access/payments, analytics and backend are preserved. The local journal/adaptation UI and beginner-period feature described below remain local: they were not present in production and were not introduced as an unapproved interface expansion. Public progression is criterion-based guidance, not a claim of automated log-based adjustment.

Verification: release unit tests and structural checks passed; real browser checks passed on the live domain at 390px and 1440px with no JavaScript errors or horizontal overflow; 12 fetched public asset files matched the release commit byte-for-byte. No API writes, purchases, emails or customer-data changes were performed by verification. The isolated release worktree is `.tmp/training-release-20260911` on branch `release/training-load-20260911`; GitHub `main` contains the published commit. The original local worktree was not reset or merged over existing user changes.

The sections below document the earlier, broader local implementation, not the complete scope of what was published.

## Implemented scope

- Existing resistance templates now pass through `training-prescription.js` before weekly progression and journal adaptation.
- For mass, support and non-circuit fat-loss sessions, select up to two existing, matching isolation exercises before the main lifts. Beginners and sessions up to 45 minutes use at most one. Preparation uses up to two sets of 12–20 repetitions, RIR 3–4, without duplicated sets later. Where no appropriate isolation exists or time is insufficient, do not invent one.
- Strength keeps the original priority main lift first. Endurance, initial beginner circuits, ladders and interval protocols are not universally converted into pre-exhaustion sessions.
- Main resistance work targets RIR 2–3. Rest defaults are 150 seconds for compound movements (180 for strength) and 90 seconds for isolation; displayed ranges allow adjustment upwards.
- Work-set caps and a duration estimate reduce sets and lower-priority movements instead of reducing weights and rest to squeeze in unchanged volume. These are conservative engineering defaults, not scientifically established universal optimal doses. Estimates include warm-up/ramp-up time and transitions; cardio is separate.
- Selected days now mean training sessions, not padded recovery cards. PPL retains its six-session sequence, rotating across the requested number of sessions each week instead of forcing an eight-day cycle. Form selection no longer disables or drops the days field.
- Structured resistance loads no longer increase by calendar week. The journal recommends the smallest available increment only when every planned set reaches the upper rep target, required RIR, a consistent logged load, confirmed clean repetitions and no pain. It does not blindly add 2.5 kg: actual equipment increments are unknown.
- Existing journal inputs now explicitly refer to clean repetitions. This is user self-report, not automated technique assessment. Missing RIR/technique, incomplete sets, timed protocols and deload weeks do not qualify for load progression.
- New prescription keys prevent old-order logs from automatically setting loads in the new order. Plan IDs prevent old completed sessions unlocking newly generated plans. Historical logs are retained; older saved plans prompt regeneration rather than silently changing in place.
- Updated script includes and service-worker cache version. No production deployment or account changes.

## Checks

- `npm run test:training`: 10 passing tests, including a real mobile-browser plan/session flow, schedule matrix, duration cases, progression edge cases and historical-plan isolation.
- `npm run test:growth`: 8 passing checks; one existing TODO is the missing `nutrition-athlete.jpg` (404). Protected design hashes pass. No replacement image was introduced.
- No additional user materials are required for the implemented training logic. A replacement for the unrelated missing nutrition photo requires the user's original asset/approval.

## Remaining limitations / publication

- Duration and set caps are starting estimates, not a clinical assessment or guarantee of recovery. High-frequency, specialized and timed workouts still require individual coaching review. No automatic CNS-fatigue or fixed “70% capacity” claim is made.
- Circuit and ladder protocols retain their specific work/rest schemes; this update is not a full redesign of every special protocol.
- The workspace contains substantial prior changes, including local features not present on the live site. A production release must isolate and review the intended training release; deploying the entire dirty workspace would also publish unrelated changes.

## Evidence context discussed with the user

- Exercise-order meta-analysis: https://onlinelibrary.wiley.com/doi/10.1080/17461391.2020.1733672
- RIR versus failure trial: https://pubmed.ncbi.nlm.nih.gov/38393985/
- Wenning's own sample illustrates moderate-effort preparatory work, not a guarantee of reduced central fatigue: https://wenningstrength.com/wp-content/uploads/Conjugate-Strength-Training-for-Beginners_SAMPLEWEEK.pdf

The exact 1–2 exercise / 2-set prescription is the agreed implementation choice, not a claim that these sources establish a universally superior protocol.
