# Training journal and laboratory guidance — 2026-10-01

Built from production `ab28d3d` in an isolated worktree. User authorized publication.

## Training

- Publish the previously local execution journal, session recovery, history and performance adaptation.
- Rename the legacy street mode to **Тренування на вулиці**; retain `prison_workout` as an internal compatibility key only.
- Replace ladder/circuit street prescriptions with individual outdoor exercises, numeric sets and rep targets.
- Record bodyweight reps without inventing kilograms; timed exercises store seconds separately.
- Completed weeks advance for all programs; after the original cycle, append another adapted week. Incomplete sessions do not unlock weeks. Initial gym beginners continue Full Body without repeating the introductory circuit.
- Legacy ladder plans prompt regeneration while retaining session history.

## Labs

- Show preparation guidance before selecting a panel and after reviewing results.
- Add source-linked explanations selected by entered markers: ferritin, glucose/HbA1c, renal and liver markers, thyroid, lipids, prolactin, PSA and male testosterone.
- Nonfasting/unknown glucose is not classified using fasting thresholds. Insulin has no invented universal athletic cutoff. Context-only findings are neutral rather than reassuring green.
- Sources are curated references checked 2026-10-01, not a live literature search or an automated diagnosis. Laboratory-specific ranges and clinical context remain necessary.
- Do not prescribe blanket medication/injection withdrawal. Explain test-specific preparation: EFLM 24-hour minimum for intense activity/alcohol, PSA 48-hour ejaculation restriction, prolactin timing, conditional fasting and plain water. Longer exercise/alcohol recovery is individualized.
- Primary references are listed in `assets/js/modules/lab-evidence.js`. Nobel recognition is not used as a substitute for clinical evidence.

## Verification

- Training: 15 new/current unit and browser tests pass, including bodyweight logging, page reload, weekly unlocking, all-program continuation, and embedded calculators.
- Existing training release checks and owner-access runtime tests pass.
- Project references, labels, module exports and JavaScript syntax checks pass.
- Existing growth checks pass apart from the documented original nutrition photo TODO. Preservation checks exclude the two training files explicitly changed by this release; original CSS, imagery, nutrition and access backend remain intact.
- Lab tests cover fasting context, marker-specific sources, sex-specific guidance and mobile rendering.

Deployment: existing Cloudflare Pages Git integration on `main`. No payment, newsletter or authentication backend changes.
