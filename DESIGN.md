---
name: VitalRise calculator studio
description: Approved graphite and gold calculator extension for training, nutrition and Labs only.
colors:
  studio-bg: "#0d1115"
  studio-text: "#f4f5f6"
  studio-muted: "#b7c3cf"
  studio-line: "#46515b"
  studio-gold: "#f3d389"
  studio-control-line: "#82919e"
  action-ink: "#171308"
  focus-ring: "#ffe1a0"
  selected-text: "#fff7e7"
  invalid: "#ffa4a4"
  complete: "#dce5bd"
typography:
  display:
    fontFamily: "Inter, sans-serif"
    fontSize: "36px"
    fontWeight: 750
    lineHeight: 1.2
    letterSpacing: "-.025em"
  display-mobile:
    fontFamily: "Inter, sans-serif"
    fontSize: "26px"
    fontWeight: 750
    lineHeight: 1.2
    letterSpacing: "-.025em"
  title:
    fontFamily: "Inter, sans-serif"
    fontSize: "21px"
    fontWeight: 700
    lineHeight: 1.3
    letterSpacing: "-.01em"
  body:
    fontFamily: "Inter, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "Inter, sans-serif"
    fontSize: "15px"
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "0"
  input:
    fontFamily: "Inter, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.35
    letterSpacing: "0"
  action:
    fontFamily: "Inter, sans-serif"
    fontSize: "16px"
    fontWeight: 700
    lineHeight: 1.35
  reset:
    fontFamily: "Inter, sans-serif"
    fontSize: "14px"
    fontWeight: 700
    lineHeight: 1.5
  disclosure:
    fontFamily: "Inter, sans-serif"
    fontSize: "16px"
    fontWeight: 600
    lineHeight: 1.4
  segment:
    fontFamily: "Inter, sans-serif"
    fontSize: "15px"
    fontWeight: 500
    lineHeight: 1.5
rounded:
  flat: "0"
  selected: "9px"
  control: "10px"
  disclosure: "12px"
spacing:
  field-label-gap: "8px"
  compact: "12px"
  control-inline: "14px"
  mobile-field-gap: "16px"
  field-row-gap: "20px"
  field-column-gap: "24px"
  section-gap: "28px"
  heading-gap: "32px"
  workspace-gap: "48px"
components:
  button-primary:
    textColor: "{colors.action-ink}"
    typography: "{typography.action}"
    rounded: "{rounded.control}"
    padding: "14px 36px 14px 14px"
    width: "100%"
  button-reset:
    backgroundColor: "transparent"
    textColor: "{colors.studio-muted}"
    typography: "{typography.reset}"
    rounded: "{rounded.flat}"
    padding: "8px 0"
  input-field:
    textColor: "{colors.studio-text}"
    typography: "{typography.input}"
    rounded: "{rounded.control}"
    padding: "12px 14px"
    height: "50px"
    width: "100%"
  segment-selected:
    textColor: "{colors.selected-text}"
    typography: "{typography.segment}"
    rounded: "{rounded.selected}"
    padding: "10px 8px"
  disclosure-card:
    textColor: "{colors.studio-text}"
    typography: "{typography.disclosure}"
    rounded: "{rounded.disclosure}"
    padding: "0"
---

# Design System: VitalRise calculator studio

## Overview

**Creative North Star: "Graphite and gold, subtly illuminated"**

The approved calculator extension uses graphite and gold gradients, warm white text, readable secondary text and subtle illumination. Compact forms keep the original controls prominent; desktop summary and sticky action, and a mobile fixed CTA, support training, nutrition and Labs.

This document records that existing visual language for the three calculator routes only. It preserves the incumbent site identity, photos, VR logo and calculation/access logic. It establishes no new systemwide visual bans or product context.

**Key Characteristics:**

- Graphite surfaces and champagne accents.
- Gold gradient actions and subtly lit selected states.
- Compact forms with neutral outlines and readable labels.
- Desktop summary/sticky action and mobile fixed CTA across all three routes.

Scope and authority: `calculator-studio` is enabled only in `src/training.template.html`, `src/nutrition.template.html` and `src/labs.template.html`, serving the training, nutrition and Labs routes. It also adapts the shared header and footer within those routes. Other incumbent visuals remain untouched; the homepage calculator and other routes do not adopt this extension.

Evidence refreshed on 2026-09-12: `docs/calculator-design-contract.md` including its Labs addendum; `assets/css/calculator-studio.css`; `assets/js/modules/calculator-studio.js`; relevant inherited styles in `assets/css/style.css` and reset markup in `partials/index/calculator.html` and `partials/index/labs.html`. No browser verification is asserted by this documentation pass. No PRODUCT.md exists; existing code and the approved contract supply visual authority. This refresh updates the uncommitted design document from the same active implementation.

The frontmatter owns this extension's extracted primitives. Its descriptive keys map to existing CSS properties or repeated declarations, and do not introduce new runtime CSS variables. The first six colors map directly to the corresponding `--studio-*` properties on `body.calculator-studio`, including the shared input/select and segment-container boundary, `--studio-control-line`. The sidecar extends these primitives with depth, motion, breakpoints, metadata and five isolated component previews. Synthesized tonal ramps are preview metadata only, not approved additional palette tokens.

Typography values record CSS requests, without asserting which individual font faces are loaded.

## Colors

Champagne is the primary accent against graphite neutrals. Use the frontmatter values as written; gradient recipes and translucent surfaces remain in the source CSS and sidecar snippets.

### Primary

- Champagne (`studio-gold`) marks links, selected outlines, caret color and the Labs warning emphasis.
- Gold action gradients use the existing light-to-deep gold stops; selected controls use a darker gold gradient. These are the approved materials, not additional brand accents.
- The pale focus ring remains visibly distinct from both neutral control outlines and the selected-state outline.

### Neutral

- Graphite (`studio-bg`) supplies the route background.
- Warm white (`studio-text`) carries headings, labels and values entered into controls.
- Readable secondary (`studio-muted`) carries explanations, summary values and reset text.
- Structural slate (`studio-line`) divides sections, summaries and disclosures; `studio-control-line` provides the stronger shared boundary for inputs, selects and segment containers. Selected segments retain their champagne outline.
- Dark action ink (`action-ink`) sits on the gold CTA, while `selected-text` sits on the darker selected segment.

### State colors

The existing invalid border and completed-settings text use `invalid` and `complete`. Completion is form readiness, not a calculated health or training outcome.

The incumbent root palette remains separately authoritative outside this extension: `--bg` (#0b0b0f), `--text` (#f3f4f6), `--text-soft` (#b7bcc8) and `--accent` (#d4af37) still belong to `style.css`. Do not alias those globals to the studio palette.

## Typography

Inter with a sans-serif fallback is inherited from the existing site. Keep the existing font loading and readable sentence-case controls. There is no new display family or fixed modular scale.

The frontmatter's display roles describe the calculator panel heading, title describes section headings, body describes introductory copy, and label/input/action describe their corresponding controls. On screens at or below 640px, section titles become 19px, labels and segment text become 14px, and introductory copy becomes 14px; input and CTA text remain 16px.

Summary rows use 14px text at 1.5 line height and tabular numerals. Hints use 13px at 1.55; status text uses 13px at 1.5. Introductory copy is limited to 65ch; Labs warning and longer guide copy use up to 75ch. Preserve the existing Ukrainian, English and Russian labels and their wrapping behavior.

## Layout

The original form is the primary task surface. The oversized console, introductory shell, calculator tabs and panel chips are hidden only within this route extension.

| Viewport | Observed arrangement |
| --- | --- |
| 1200px and wider | Container `min(1240px,calc(100% - 80px))`; flexible form plus 300px sidebar, separated by 48px. |
| 1024px through 1199px | Container `calc(100% - 48px)`; flexible form plus 280px sidebar, separated by 28px. |
| 641px through 1023px | Single workspace column with 24px side gutters; summary follows the form; primary action is fixed at the bottom. |
| 640px and narrower | 20px side gutters; most fields span both columns, with designated short field pairs; fields and segments are 48px high. |

Desktop form fields use two equal columns with the frontmatter row/column gaps. Mobile gaps use the mobile-field-gap token; optional fields become one column at the narrow breakpoint. Training pairs duration/body weight, nutrition pairs body data, and Labs pairs sex/age according to the existing JS classes.

The desktop sidebar sticks at `calc(var(--studio-header) + 24px)`. The header variable is 76px by default, 64px at or below 1023px and 60px at or below 640px. Visible overflow on both `.site-shell` and `.module-page-main` within the studio route allows sticky positioning; the latter resolves the incumbent hidden overflow.

For short desktop viewports, the summary alone scrolls with `overflow-y: auto`, contained overscroll and a stable scrollbar gutter. Its current maximum height is:

```css
max-height: max(60px,calc(100dvh - var(--studio-sidebar-top,var(--studio-header)) - 200px));
```

The JS sets `--studio-sidebar-top` on the sidebar from `Math.max(headerBottom + 24, aside.getBoundingClientRect().top)`. A requestAnimationFrame-coalesced update runs on scroll, resize and localization (including initialization), only at desktop width. This reserves room below the summary for readiness, reset and the action in both initial and scrolled states. It supersedes the earlier fixed header/240px subtraction.

Below desktop width, the summary starts collapsed and the original submit action moves into the fixed dock. Crossing the desktop breakpoint updates disclosure openness. The dock reserves `--studio-dock: 104px`, adds bottom safe-area clearance, and gives the main section and footer corresponding bottom padding. Its horizontal padding is `max(20px,env(safe-area-inset-right,0px))`; the CTA is capped at 720px.

The dock hides while the keyboard shrinks the visual viewport during text input (more than 120px below innerHeight), while the menu or supported modals are open, and while the Labs review disclosure is open. Locked actions remain within their original entitlement boundary, with the existing static-position exceptions. Preserve these conditions with any future changes to calculator layout.

## Elevation & Depth

Labs and nutrition retain their original background photographs (`labs-bloodwork-bg.webp` and `nutrition-food-bg.webp`). Training uses the user-approved generated gym image (`training-gym-vitalrise.webp`), encoded from the approved PNG at its original 1672×941 resolution. A graphite scrim with minimum alpha 209/255 protects text contrast; controls keep their opaque materials. The section above the photograph stays transparent. Desktop imagery uses the incumbent fixed attachment. On mobile, a 760px-high photo scrolls naturally and fades into graphite, avoiding fixed-background jumps and excessively enlarged crops on long forms. Do not replace or remove these backgrounds in later calculator refinements.

Depth comes from graphite tonal layers, gold gradients and restrained illumination. The form workspace itself has no surrounding raised card. Inputs have no box shadow; optional disclosures use a translucent dark gradient and a thin boundary. The sidebar relies on a divider.

The source recipes retained in the sidecar are the selected-segment glow (`0 6px 14px #bc853422`), CTA glow (`0 8px 20px #af7c282c`) and mobile dock shadow (`0 -8px 24px #0005`). The page combines a warm radial light with a graphite linear gradient; the header and dock use thin fading gold rules. These treatments apply to the scoped calculator extension and do not replace incumbent elevation elsewhere.

Studio action brightness and segmented state transitions use 0.16s ease-out. Enabled original `.btn` controls inherit the site's hover translation of -2px; disabled buttons suppress translation. Reset retains the inherited 0.32s ease transition and 10px backdrop blur, but its scoped transparent background and absent border override the secondary hover fill/border. Fields inherit 0.32s ease transitions for border, background and shadow; scoped materials and shadow removal persist on focus, with the separate focus-visible outline. Reduced motion removes transitions and animations within the calculator surface; initial content is visible without reveal animation. Print hides the sidebar and edit control.

## Shapes

Controls use the control radius, selected segments the slightly tighter selected radius, and disclosures the disclosure radius. Labels and ordinary field wrappers are unboxed. Boundaries are generally 1px; the focus-visible outline is 2px with a 4px offset. Segments have a separate pale focus outline (#fff0cf).

The incumbent site's 14/18/24/32px radius tokens and pill buttons remain valid for other visuals. The studio's compact corners do not impose a new shape system across the site. Native disclosure chevrons are drawn with CSS borders, with rotation indicating open state.

## Components

### Primary and secondary actions

The primary calculator action is a full-width gold gradient button with dark text, a thin pale gold border and a right chevron. Its minimum height is 54px; on hover-capable devices enabled hover raises brightness to 1.09. Disabled buttons use opacity 0.55 and a not-allowed cursor. Preserve visible focus and original form ownership when the action sits outside the form element.

Reset is an underlined secondary text action with a minimum 44px height. The existing edit action appears after a result, uses champagne text and returns focus to the form. The atlas launcher is an existing underlined link-style action. Neither is a new global button variant.

### Fields and segmented selection

Inputs, native selects and segment containers share the `studio-control-line` boundary; inputs and selects also share a graphite gradient and compact corners. Desktop controls are 50px high; the narrow-screen override is recorded in Layout. Selects reserve extra space for their native affordance. Required constraints and all existing field IDs, names and handlers remain attached to the original nodes. Invalid optional fields automatically open their containing disclosure before native focus.

Training format and days use segmented radio buttons synchronized to the original select. Selected state adds the darker gold gradient, champagne outline and small glow; unselected hover uses a lighter graphite fill. The source JS handles arrow keys, Home/End, roving tab stops and disabled-option synchronization. The original select remains the data owner.

### Disclosures and summary

Additional settings use native details/summary with a compact explanatory line and an inset field grid. Pain restrictions stay outside collapsed controls. The desktop summary uses a definition list, readable labels/values and the constrained scrolling described in Layout. Mobile wraps that summary in a bordered disclosure. Readiness, reset and submit remain outside the scrolling summary.

### Labs

Labs shares the same form materials, desktop summary/sticky panel-builder action and mobile fixed panel-builder CTA. Its medical warning stays visible above the form. Longer existing explanations move into a native disclosure. The gated review form keeps every field, filter and its original inline review action; opening it hides the mobile panel-builder dock. Review results, medical explanations, thresholds and interpretation logic remain incumbent.

### Navigation and preview boundary

The shared navigation, photographs and VR logo remain incumbent assets. Only the route-scoped header dimensions, dark material and separator are recorded here; there is no replacement navigation or chip system. The sidecar therefore previews the primary action, reset, input, training segments and disclosure card. These self-contained snippets illustrate visual states, not calculation, entitlement or synchronization logic; no assets, font files or framework runtime are downloaded by them.

## Do's and Don'ts

### Do:

- Do apply this calculator-studio extension only to training, nutrition and Labs.
- Do preserve the approved graphite/gold gradients, subtle illumination, compact forms and readable labels.
- Do preserve desktop summary/sticky actions, measured short-desktop summary sizing and mobile fixed CTA clearance.
- Do preserve native form ownership, keyboard behavior, validation, localization and entitlement boundaries.
- Do keep pain restrictions and the Labs warning visible, and keep the Labs review action inline.

### Don't:

- Don't extend these route-scoped decisions into new systemwide visual bans.
- Don't replace incumbent photos, the VR logo, shared identity or other routes' visuals.
- Don't change formulas, medical interpretation thresholds, access logic or original field constraints as part of this visual system.
- Don't treat preview tonal ramps or isolated snippets as new production tokens or replacement application logic.
