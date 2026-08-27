---
title: 'Migrate production hosting from Cloudflare Pages to Workers'
type: 'chore'
created: '2026-08-27'
status: 'in-review'
baseline_commit: 'aa145ec0e8bbd8dac752f70160e5f3c2465a2b37'
context:
  - 'AGENTS.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** The current Cloudflare Pages deployment exposes `guandan-bze.pages.dev` and permanent deployment URLs in addition to `guandan.mapin.net`. The production site should have one anonymous public endpoint.

**Approach:** Move the existing Vite `dist` output to Cloudflare Workers Static Assets, connect the GitHub repository to Workers Builds, disable `workers.dev` and preview URLs in repository-owned configuration, and bind only `guandan.mapin.net` as a Custom Domain.

## Boundaries & Constraints

**Always:** Preserve the existing GitHub `main` deployment flow and site behavior; keep `guandan.mapin.net` as the canonical public URL; run existing tests and production build before changing live routing; verify the Worker deployment before deleting the Pages project; retain a recoverable rollback path during cutover.

**Ask First:** Any change to application behavior, DNS outside `guandan.mapin.net`, another Cloudflare zone, GitHub branch protection, or repository secrets beyond those strictly required for deployment.

**Never:** Add Worker runtime code, Pages redirects, Cloudflare Access, a staging environment, a second CI/CD publisher, KV/R2/D1 bindings, or leave `workers.dev`/preview URLs publicly enabled.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|---------------|---------------------------|----------------|
| Production request | `https://guandan.mapin.net/` | Existing SPA loads through Workers Static Assets | Abort cutover if response or assets fail |
| SPA navigation | Navigation to an unknown asset path | `index.html` is returned with 200 | Configure SPA fallback in Wrangler |
| Default Worker URL | Worker and preview hostnames | Not publicly routable | Treat any successful anonymous response as failed migration |
| Failed deployment | Tests, build, or Worker deploy fails | Existing Pages production remains active | Do not detach the Pages custom domain |

</frozen-after-approval>

## Code Map

- `package.json` -- existing npm build/test contract; pins Wrangler for reproducible deployment.
- `wrangler.jsonc` -- repository-owned Worker name, assets, route, and public-host controls.
- `vite.config.ts` -- confirms Vite emits the static application consumed by Workers.

## Tasks & Acceptance

**Execution:**
- [x] `package.json` and lockfile -- add Wrangler as a development dependency without changing application dependencies.
- [x] `wrangler.jsonc` -- configure `dist`, SPA fallback, `workers_dev: false`, `preview_urls: false`, and `guandan.mapin.net` Custom Domain.
- [ ] Cloudflare -- deploy and validate the Worker, transfer the custom domain from Pages, connect Workers Builds to `hiQianFan/guandan` `main`, disable non-production builds, then remove the obsolete Pages project.
- [ ] GitHub -- commit and push the verified repository configuration.

**Acceptance Criteria:**
- Given a push to `main`, when Workers Builds succeeds, then the new version serves `guandan.mapin.net`.
- Given an anonymous request, when any `workers.dev`, Worker preview, old base `pages.dev`, or Pages deployment URL is requested, then it cannot serve the application publicly.
- Given a failed build before cutover, when validation is reviewed, then Pages remains the production target.
- Given a bad Worker version after cutover, when the previous Worker version is selected, then Cloudflare can roll production back without changing DNS.

## Spec Change Log

## Verification

**Commands:**
- `npm test` -- all existing logic tests pass.
- `npm run build` -- Vite produces `dist` successfully.
- `npx wrangler deploy --dry-run` -- Worker configuration and assets package successfully.
- `openspec validate migrate-cloudflare-pages-to-workers` -- change documentation is valid.

**Manual checks:**
- Confirm TLS, homepage, static assets, and an SPA navigation path on `guandan.mapin.net`.
- Confirm the Worker has only the custom domain and both default URL settings are disabled.

## Suggested Review Order

**Hosting contract**

- Defines the only public hostname and static SPA behavior.
  [`wrangler.jsonc:1`](../../../wrangler.jsonc#L1)

**Reproducible tooling**

- Pins the deployment CLI used locally and by Workers Builds.
  [`package.json:18`](../../../package.json#L18)

- Commits the resolved deployment dependency tree.
  [`package-lock.json:1`](../../../package-lock.json#L1)

**Migration record**

- Captures cutover boundaries, validation, and rollback expectations.
  [`spec.md:1`](spec.md#L1)
