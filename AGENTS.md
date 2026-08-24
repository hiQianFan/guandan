# Repository instructions

## Commands

- Install: `npm install`
- Develop: `npm run dev`
- Test: `npm test`
- Build: `npm run build`

## Required validation

- Logic changes must pass `npm test`.
- UI or TypeScript changes must pass `npm run build`.
- OpenSpec changes must pass `openspec validate <change-id>`.
- Preserve unrelated user changes in the working tree.

## Context routing

- Product purpose and UX principles: `PRODUCT.md`.
- Visual design system: `DESIGN.md`.
- Guandan rules and domain invariants: `docs/standard-rules.md`.
- Current behavior: `openspec/specs/` when present.
- Active responsive/direct-scoring change: `openspec/changes/optimize-responsive-direct-scoring/`.
- Historical one-off fixes under `docs/` are evidence, not current task state.

## Source-of-truth boundaries

- Do not duplicate game rules outside `docs/standard-rules.md`; link to it.
- Do not place implementation plans or progress in `PRODUCT.md` or `DESIGN.md`; use OpenSpec.
- Treat code and tests as authoritative when documentation describes stale implementation details; update the owning document with the same change.
