# Task Plan

## Objective

Set up the LobeHub Skills Marketplace for this Codex workspace, install the `raisiqueira-claude-code-plugins-nextjs-expert` skill for the local repo, read the installed `SKILL.md`, and apply its guidance to complete any concrete Next.js task that is justified by the current codebase.

## Dependency Graph

- T1 -> T2, T3, T5
- T2 -> T3
- T3 -> T4
- T4 -> T5
- T5 -> T6
- T6 -> T7

## Tasks

- [x] T1 Inspect repo, remote skill instructions, and local install prerequisites
  depends_on: []
  success_criteria: Remote marketplace instructions fetched; local project shape and install target confirmed.

- [x] T2 Write execution plan to `tasks/todo.md`
  depends_on: [T1]
  success_criteria: Plan, dependency graph, task list, and review section exist on disk.

- [x] T3 Register this Codex instance with LobeHub Skills Marketplace
  depends_on: [T1, T2]
  success_criteria: `@lobehub/market-cli register` succeeds or confirms existing credentials for source `codex`.

- [x] T4 Install `raisiqueira-claude-code-plugins-nextjs-expert` for Codex
  depends_on: [T3]
  success_criteria: Skill files are present under the repo-local Codex skill directory and include `SKILL.md`.

- [x] T5 Read installed `SKILL.md` and map it to a concrete repo task
  depends_on: [T1, T4]
  success_criteria: The installed skill instructions are reviewed and a bounded Next.js action is selected, or a justified no-op conclusion is recorded.

- [x] T6 Apply the smallest justified repo change guided by the installed skill
  depends_on: [T5]
  success_criteria: Any change is minimal, directly tied to the skill guidance, and includes a regression test when it fits.

- [x] T7 Verify results and document review notes
  depends_on: [T6]
  success_criteria: Relevant checks are run, outcomes recorded below, and remaining risks noted.

## Review

- Status: Complete
- Verification:
  - `npm run lint` (passes with existing warnings in tests and `coverage/`)
  - `npm run test`
  - `npx vitest run tests/integration/page.test.tsx`
  - `npx eslint src/app/page.tsx tests/integration/page.test.tsx`
- Notes:
  - Registered marketplace credentials at `~/.lobehub-market/credentials.json`.
  - Installed skill at `./.agents/skills/raisiqueira-claude-code-plugins-nextjs-expert/SKILL.md`.
  - Applied the installed skill as a targeted Next.js audit and selected the smallest meaningful improvement: a branded loading fallback for the client-only home route.
  - Updated `README.md` with persistent agent workflow pointers.
  - Left marketplace feedback with `skills comment ... --rating 4`.
  - Residual risk: `/` remains a client-only route with `ssr: false`; this fixes the blank initial state, not the broader SEO/first-paint tradeoff.
  - Session handoff written to `tasks/handoff.md` for the next Codex restart.

---

# Task Plan

## Objective

Repair the invalid `seo-audit` skill manifests so the skill loader stops skipping them for missing YAML frontmatter.

## Dependency Graph

- T1 -> T2 -> T3

## Tasks

- [x] T1 Inspect the broken skill manifests and surrounding skill tree
  depends_on: []
  success_criteria: Confirm the current file contents and determine the minimum valid manifest shape required.

- [x] T2 Patch both `SKILL.md` files with valid YAML frontmatter and concise body text
  depends_on: [T1]
  success_criteria: `/Users/joemccann/.agents/skills/seo-audit/SKILL.md` and `/Users/joemccann/.agents/skills/seo-audit/skill/SKILL.md` both contain valid `---`-delimited YAML with `name` and `description`.

- [x] T3 Verify the repair and document review notes
  depends_on: [T2]
  success_criteria: Validation shows the files are no longer empty and review notes record what was changed and any residual risk.

## Review

- Status: Complete
- Verification:
  - `node -e 'const fs=require("fs"); ...'` to confirm both manifests contain a `---`-delimited frontmatter block with `name`, `description`, and non-empty body text
- Notes:
  - The `seo-audit` tree currently contains mostly zero-byte placeholder files; this task only repairs the two invalid manifests called out by the loader.
  - Added minimal placeholder metadata and body content to both `SKILL.md` files to stop the loader from skipping them for missing YAML.
- Residual risk: the loader warning should be resolved, but the broader `seo-audit` package remains functionally incomplete until its other placeholder files are populated.

---

# Task Plan

## Objective

Audit the app's SEO surface and implement the smallest high-impact fixes for crawlability, metadata, structured data, and indexation.

## Dependency Graph

- T1 -> T2, T3
- T2 -> T3
- T3 -> T4
- T4 -> T5, T6
- T5 -> T6

## Tasks

- [x] T1 Inspect the current SEO surface in source and static assets
  depends_on: []
  success_criteria: Rendering mode, metadata, manifest, crawl directives, and structured data gaps are identified from the current codebase.

- [x] T2 Validate runtime output for crawlability and indexable HTML
  depends_on: [T1]
  success_criteria: Built output or local runtime confirms what HTML, metadata, and crawl files are actually exposed to bots.

- [x] T3 Choose the highest-value remediation set
  depends_on: [T1, T2]
  success_criteria: A bounded implementation scope is selected based on the audit findings and documented in the review notes.

- [x] T4 Implement targeted SEO improvements
  depends_on: [T3]
  success_criteria: The selected fixes are applied with minimal code impact and preserve the existing product behavior.

- [x] T5 Add regression coverage where it fits
  depends_on: [T4]
  success_criteria: Automated coverage exists for any new SEO-critical output that can be tested cheaply.

- [x] T6 Verify changes and document review notes
  depends_on: [T4, T5]
  success_criteria: Relevant checks pass, review notes summarize findings and fixes, and residual risks are captured.

## Review

- Status: Complete
- Verification:
  - `npx eslint src/app/layout.tsx src/app/page.tsx src/app/robots.ts src/app/sitemap.ts src/lib/seo.ts src/components/KeyboardEngine.tsx src/lib/save-state.ts tests/integration/page.test.tsx tests/integration/KeyboardEngine.test.tsx tests/unit/metadata-routes.test.ts tests/unit/seo.test.ts`
  - `npx vitest run tests/integration/page.test.tsx tests/integration/KeyboardEngine.test.tsx tests/unit/metadata-routes.test.ts tests/unit/seo.test.ts tests/unit/save-state.test.ts`
  - `npm run test`
  - `npm run build`
  - Built artifact checks against `.next/server/app/index.html`, `.next/server/app/robots.txt.body`, and `.next/server/app/sitemap.xml.body`
- Notes:
  - Centralized SEO metadata in `src/lib/seo.ts`, including canonical URL, robots directives, keywords, social cards, and `SoftwareApplication` JSON-LD.
  - Added static metadata routes for `/robots.txt` and `/sitemap.xml`.
  - Removed the `ssr: false` home-route mount, then made save-state access SSR-safe with a `useSyncExternalStore` snapshot so the route can prerender without browser-only storage access.
  - The built homepage now contains canonical metadata, robots directives, JSON-LD, the richer landing shell, and the welcome UI copy (`Practice Typing`, `Spelling Words`, `The Typing Adventure`) in the emitted HTML.
  - Added regression coverage for SEO metadata, metadata routes, home-route structured data, and the hydration-safe save-state path exercised by `KeyboardEngine`.
  - Residual risk: the prerendered HTML currently contains both the landing shell and the welcome screen markup inside the streamed payload, which is acceptable but heavier than a more explicitly designed marketing/game split.
  - Residual risk: `src/app/sitemap.ts` currently uses a fixed `lastModified` date (`2026-03-10`) and should be updated if you want that field to reflect future content changes automatically.

---

# Task Plan

## Objective

Commit the completed SEO release work, push it to `origin/main`, and deploy the current repo state to the linked Vercel production project.

## Dependency Graph

- T1 -> T2
- T2 -> T3
- T3 -> T4
- T4 -> T5

## Tasks

- [ ] T1 Validate git/deploy state and capture the release plan
  depends_on: []
  success_criteria: Current branch, working tree contents, remote, and linked deploy target are confirmed and this plan is on disk.

- [ ] T2 Stage the intended release changes and create a commit
  depends_on: [T1]
  success_criteria: The SEO work is committed locally with a non-empty release commit on the current branch.

- [ ] T3 Push the release commit to `origin/main`
  depends_on: [T2]
  success_criteria: The current branch is pushed successfully and `origin/main` contains the new commit.

- [ ] T4 Deploy the current repo state to production
  depends_on: [T3]
  success_criteria: The linked Vercel project accepts a production deployment and returns a deployment URL or confirmation.

- [ ] T5 Verify release outcomes and document review notes
  depends_on: [T4]
  success_criteria: Commit, push, and deploy results are recorded below with any remaining operational risks.

## Review

- Status: In progress
- Verification:
  - Pending
- Notes:
  - Pending
