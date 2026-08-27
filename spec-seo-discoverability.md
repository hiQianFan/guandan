---
title: 'Improve scorer SEO discoverability'
type: 'feature'
created: '2026-08-27'
status: 'done'
baseline_commit: 'aa145ec0e8bbd8dac752f70160e5f3c2465a2b37'
context:
  - 'PRODUCT.md'
  - 'DESIGN.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** The deployed scorer identifies itself with the misspelled keyword “惯蛋”, declares English as its language, exposes no useful search snippet or canonical URL, and serves the SPA shell instead of real crawler discovery files. Search engines therefore receive weak or misleading signals even though the scoring application itself works.

**Approach:** Correct the static HTML signals, give the rendered application a concise semantic identity without taking space from scoring controls, publish valid crawler files, and correct the same public-facing typo in the repository documentation.

## Boundaries & Constraints

**Always:** Preserve the existing one-touch scoring flow, full-screen responsive layout, accessibility, and unrelated working-tree changes. Use static HTML and files supported by the existing Vite build. Keep all rule behavior sourced from `docs/standard-rules.md`.

**Ask First:** Any deployment-provider configuration change, external webmaster-account action, domain change, analytics/tracking addition, or new public content page.

**Never:** Add an SEO dependency, SSR/prerendering framework, CMS, keyword stuffing, hidden promotional copy, duplicate game rules, or structured data that claims unsupported product capabilities.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|---------------|----------------------------|----------------|
| Search crawl | Request `/` without executing JavaScript | Correct Chinese language, title, description, canonical URL, and social metadata are present in HTML | Core metadata remains independent of JavaScript |
| Crawler discovery | Request `/robots.txt` or `/sitemap.xml` | Each path returns its real static content and references the canonical HTTPS homepage | Files remain simple static assets |
| Interactive use | Vue mounts on any supported viewport | A semantic page heading identifies the tool without reducing scoreboard space or changing controls | Existing layout behavior remains authoritative |

</frozen-after-approval>

## Code Map

- `index.html` -- Static language, search snippet, canonical, robots, and social sharing metadata.
- `src/App.vue` -- Root application semantics and visually unobtrusive product heading.
- `public/robots.txt` -- Crawler permission and sitemap discovery.
- `public/sitemap.xml` -- Canonical homepage discovery.
- `README.md` -- Public project name and description shown by repository/search results.
- `src/style.css` -- Contains one internal typo only; correction keeps terminology consistent.

## Tasks & Acceptance

**Execution:**
- [x] `index.html` -- replace incorrect identity and add static canonical/search/social metadata.
- [x] `src/App.vue` -- add one accessible H1 that does not compete with the current-level display.
- [x] `public/robots.txt`, `public/sitemap.xml` -- add minimal valid crawler discovery files.
- [x] `README.md`, `src/style.css` -- replace remaining user-facing/project terminology typo without touching archived historical artifacts.

**Acceptance Criteria:**
- Given a crawler fetches the built homepage, when it reads the HTML head, then it finds `zh-CN`, the exact term “掼蛋计分器”, a concise description, one HTTPS canonical, indexable robots policy, and consistent Open Graph/Twitter metadata.
- Given the app renders, when semantic structure is inspected, then exactly one H1 names the tool and all scoring controls and responsive geometry remain unchanged.
- Given the production build is generated, when its public assets are inspected, then valid `robots.txt` and `sitemap.xml` exist and reference `https://guandan.mapin.net/`.
- Given repository validation runs, when `npm test` and `npm run build` complete, then both pass.

## Spec Change Log

## Verification

**Commands:**
- `npm test` -- expected: all scoring logic tests pass.
- `npm run build` -- expected: Vue/TypeScript production build succeeds and copies both crawler files.
- `git diff --check` -- expected: no whitespace errors.

**Manual checks:**
- Inspect built HTML and crawler files for correct spelling, URL consistency, parseable XML/plain text, and a single page heading.

## Suggested Review Order

**Search identity**

- Static metadata gives crawlers and shares one canonical Chinese identity.
  [`index.html:2`](index.html#L2)

- Semantic heading identifies the mounted tool without changing scoreboard geometry.
  [`App.vue:22`](src/App.vue#L22)

**Crawler discovery**

- Minimal policy permits crawling and advertises the sitemap.
  [`robots.txt:1`](public/robots.txt#L1)

- Single canonical URL matches this single-page application.
  [`sitemap.xml:1`](public/sitemap.xml#L1)

**Terminology consistency**

- Repository-facing copy now uses the correct product name.
  [`README.md:1`](README.md#L1)

- Internal design-token comment uses the same spelling.
  [`style.css:4`](src/style.css#L4)
