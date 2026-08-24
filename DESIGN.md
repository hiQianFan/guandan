---
name: Guandan Scorekeeper
description: A direct, restrained, competitive table-side Guandan scorekeeper.
colors:
  team-red: "#FA114F"
  team-blue: "#00F0FF"
  victory-gold: "#D4AF37"
  canvas: "#020817"
  game-surface: "#050A12"
  panel: "#1E293B"
  track: "#333333"
  ink: "#F8FAFC"
  muted-ink: "#94A3B8"
typography:
  display:
    fontFamily: "ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(6rem, 28vw, 14rem)"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "-0.025em"
  title:
    fontFamily: "ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 700
    lineHeight: 1.2
  body:
    fontFamily: "ui-sans-serif, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 600
    lineHeight: 1.2
rounded:
  sm: "8px"
  md: "12px"
  lg: "16px"
  score: "24px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "24px"
  xxl: "32px"
components:
  result-red:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
    padding: "16px 24px"
    height: "56px"
  result-blue:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
    padding: "16px 24px"
    height: "56px"
  undo:
    backgroundColor: "{colors.game-surface}"
    textColor: "{colors.muted-ink}"
    rounded: "{rounded.lg}"
    padding: "16px 24px"
    height: "56px"
  score-card:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.ink}"
    rounded: "{rounded.score}"
---

# Design System: Guandan Scorekeeper

## Overview

**Creative North Star: "The Shared Table Scoreboard"**

This interface is a shared instrument placed beside a live card game. It must read instantly from more than one seat, accept a result in one touch, and disappear from attention between rounds. The character is direct, restrained, and competitive: a near-black field, two unmistakable teams, and one dominant current level.

The existing visual identity is preserved. Refinement means stronger spatial behavior, larger reachable controls, clearer focus, and less nonessential UI—not a new theme. Desktop and landscape tablet retain the red / score / blue structure; portrait devices move the score above two equal team columns without changing the component vocabulary.

**Key Characteristics:**

- One dominant current-level display
- Symmetric, seat-reachable red and blue controls
- Dark neutral surfaces with color reserved for team identity and state
- Large native buttons with explicit labels
- Responsive structure driven by available space, not device names

**The One-Touch Rule.** A round result commits immediately. Never add a second confirmation step, Toast, modal, or transient success message.

**The Shared-Table Rule.** Duplicate an action entry point only when it materially shortens reach from opposite seats; duplicated undo buttons always operate on the same global history.

## Colors

The palette uses a near-black neutral field so the two team colors carry identity and active state without turning the interface into a decorative neon dashboard.

### Primary

- **Direct Red:** Red-team identity, selected state, progress, and red-side focus treatment.
- **Electric Cyan:** Blue-team identity, selected state, progress, and blue-side focus treatment.

### Secondary

- **Victory Gold:** Victory and crown state only; never use it as general decoration.

### Neutral

- **Night Canvas:** Application background.
- **Table Surface:** Main scoreboard surface and focus-ring offset.
- **Graphite Panel:** Controls and the central score surface.
- **Clear Ink:** Primary text and essential icons.
- **Quiet Ink:** Secondary labels and disabled-adjacent information; it must still meet contrast requirements when used as readable text.

**The Two-Team Rule.** Red and blue identify sides; every actionable or selected state also needs text, shape, icon, or semantic state. Color alone is forbidden.

**The Rare Gold Rule.** Gold appears only for victory. If it appears during ordinary scoring, remove it.

## Typography

**Display Font:** System UI sans-serif
**Body Font:** System UI sans-serif

**Character:** One familiar sans-serif family keeps Chinese labels, numbers, buttons, and status text stable across platforms. Weight and scale—not a second display face—create hierarchy.

### Hierarchy

- **Display** (700, responsive with a 14rem ceiling, 1 line-height): Current level only; it must shrink against both available width and height without clipping.
- **Title** (700, 1.25rem, 1.2 line-height): Team names and current-attacker heading.
- **Body** (400, 1rem, 1.5 line-height): Supporting prose outside the core scoring surface.
- **Label** (600, 0.875rem, 1.2 line-height): Result descriptions and control labels; never smaller than 12px on the scoring surface.

**The Numeric Anchor Rule.** The current level is always the largest text. No other number competes with it.

## Elevation

The system is flat by default. Depth comes from tonal layers, solid team fills, and the central score boundary. Small focused glows may reinforce an active team state, but resting controls do not combine a decorative border with a wide shadow.

### Shadow Vocabulary

- **Team State Glow** (`0 0 15px -5px currentColor`): Selected or active team state only.
- **Control Lift** (`0 1px 2px rgb(0 0 0 / 0.25)`): Optional pressed/released feedback on primary controls.

**The Flat-at-Rest Rule.** Resting surfaces use tone or a subtle border. Shadows appear only to communicate state or physical press feedback.

## Components

### Buttons

- **Shape:** Clearly bounded controls with 8–16px corner radii; do not introduce pills.
- **Result:** Entire surface is clickable. Mobile target height is at least 56px where space permits and never below 44×44 CSS px.
- **Team assignment:** Red and blue columns use identical geometry and ordering. Team color appears on labels, focus, progress, and active state.
- **Hover / Focus:** Hover is a subtle tonal/team tint. Keyboard focus uses a high-contrast 2px ring with sufficient offset; focus is never removed without replacement.
- **Active:** Brief scale or tonal response is allowed; reduced-motion mode removes scale.
- **Undo:** Both sides expose “撤销上一局”; both buttons match result-button width and height, use a quieter neutral treatment, undo the same global latest round, and use native disabled state when history is empty.

### Cards / Containers

- **Corner Style:** The central score surface may use the existing signature 24px radius; ordinary panels stop at 16px.
- **Background:** Use neutral tonal separation. Avoid nested card stacks.
- **Shadow Strategy:** Flat at rest; active-state glow only.
- **Border:** Use subtle full boundaries where needed; colored side-stripe accents are prohibited.
- **Internal Padding:** 12–24px, reduced before text or touch targets are reduced.

### Navigation

- The product has no primary navigation. Footer links remain visually subordinate, keyboard reachable, and outside the scoring flow.

### Responsive Scoreboard

- **Wide and landscape:** Red controls / current level / blue controls. Each side vertically stacks `+3 / +2 / +1 / 撤销上一局`; side widths are bounded and the center consumes remaining space.
- **Short landscape:** At 500px viewport height or less, each side keeps its position but places `+3 / +2 / +1` in one row, with the full-width undo action below.
- **Portrait:** On phones and tablets, including large portrait iPads, the current level sits at the top; red and blue controls form two equal columns below, each using the same vertical action stack. Never block the interface with a rotate-device prompt.
- **Height pressure:** Remove decorative gaps and reduce padding first. Never clip result or undo controls, and never size the central card with an isolated `vh` rule.
- **Identity:** Do not add visible “红方 / 蓝方” headings; established side placement, controls, accessible names, and color treatment identify each operation zone.
- **Tribute indicator:** Preserve the existing arrow light at its established top position and size.

### Current Level

- The visible current-level region is the only status source for assistive technology. It may announce the updated attacker and level politely without adding visual copy or moving focus.

## Do's and Don'ts

### Do:

- **Do** preserve the current near-black, red, cyan, white, and victory-gold identity.
- **Do** keep every scoring target at least 44×44 CSS px and aim for 56px height on phones.
- **Do** preserve full keyboard operation with native buttons, visible focus, Enter, and Space.
- **Do** keep the desktop/tablet three-part composition and use the portrait two-column composition.
- **Do** remove spacing and decoration before shrinking labels or touch targets.
- **Do** respect reduced motion, forced colors, zoom, and text enlargement.

### Don't:

- **Don't** build a complex dashboard or add decorative information.
- **Don't** use excessive glow, glassmorphism, or continuous animation that affects recognition.
- **Don't** add confirmation buttons, Toasts, temporary success copy, or modal feedback after scoring.
- **Don't** add the ImageGen concept's “贡牌关系” title, textual relationship bar, or explanatory area; preserve the existing left/right arrow light.
- **Don't** rely on red and blue alone to communicate state.
- **Don't** force portrait-phone users to rotate the device.
- **Don't** use `80vh` or unbounded viewport sizing inside a component that shares space with controls and the footer.
