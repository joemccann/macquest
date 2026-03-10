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

- [x] T1 Validate git/deploy state and capture the release plan
  depends_on: []
  success_criteria: Current branch, working tree contents, remote, and linked deploy target are confirmed and this plan is on disk.

- [x] T2 Stage the intended release changes and create a commit
  depends_on: [T1]
  success_criteria: The SEO work is committed locally with a non-empty release commit on the current branch.

- [x] T3 Push the release commit to `origin/main`
  depends_on: [T2]
  success_criteria: The current branch is pushed successfully and `origin/main` contains the new commit.

- [x] T4 Deploy the current repo state to production
  depends_on: [T3]
  success_criteria: The linked Vercel project accepts a production deployment and returns a deployment URL or confirmation.

- [x] T5 Verify release outcomes and document review notes
  depends_on: [T4]
  success_criteria: Commit, push, and deploy results are recorded below with any remaining operational risks.

## Review

- Status: Complete
- Verification:
  - `git commit -m "Improve SEO crawlability and metadata"` -> commit `bf9bad5`
  - `git push origin main`
  - `npx vercel deploy --prod --yes`
  - `curl -I https://macquest.app`
  - `curl -s https://macquest.app | rg "canonical|application/ld\\+json|Practice Typing|Spelling Words"`
- Notes:
  - Confirmed `origin` points to `git@github.com:joemccann/macquest.git` and `.vercel/project.json` is linked to project `macquest`.
  - Pushed commit `bf9bad5` to `origin/main`.
  - Vercel created production deployment `https://macquest-my8dvzgpd-joe-mccanns-projects.vercel.app` and aliased it to `https://macquest.app` on March 10, 2026.
  - Live verification returned `HTTP/2 200` from `https://macquest.app` and the response HTML includes the canonical tag, JSON-LD script, and crawlable `Practice Typing` / `Spelling Words` content.
  - Residual risk: this plan file update was written after the first deployment and should be committed so the repo history matches the recorded release notes exactly.

---

# Task Plan

## Objective

Add a styled mute/unmute control that fits the existing MacQuest interface, stops current playback when muted, and preserves the audio preference across sessions.

## Dependency Graph

- T1 -> T2, T3
- T2 -> T4
- T3 -> T4
- T4 -> T5
- T5 -> T6

## Tasks

- [x] T1 Inspect current audio flow, controls, and test coverage
  depends_on: []
  success_criteria: Audio playback entry points, good control placement, and relevant tests are identified.

- [x] T2 Add persisted audio preference state and hook it into playback
  depends_on: [T1]
  success_criteria: Muted state can be read/written safely with SSR, and all speech playback respects it.

- [x] T3 Implement a reusable mute/unmute control matching the current UI
  depends_on: [T1]
  success_criteria: The control is accessible, responsive, and visually consistent with the app’s existing floating chrome.

- [x] T4 Integrate the control across the main game surfaces
  depends_on: [T2, T3]
  success_criteria: Welcome, playing, level-complete, and victory flows expose the toggle without disrupting layout.

- [x] T5 Add regression coverage where it fits
  depends_on: [T4]
  success_criteria: Tests cover preference persistence and the UI toggle behavior at a meaningful level.

- [x] T6 Verify behavior and document review notes
  depends_on: [T5]
  success_criteria: Relevant lint/tests pass and the review notes record the behavior and any remaining risks.

## Review

- Status: Complete
- Verification:
  - `npx eslint src/lib/audio-preference.ts src/components/AudioToggle.tsx src/hooks/useSpeech.ts src/components/KeyboardEngine.tsx tests/unit/useSpeech.test.ts tests/integration/KeyboardEngine.test.tsx`
  - `npx vitest run tests/unit/useSpeech.test.ts tests/integration/KeyboardEngine.test.tsx`
  - `npx vitest run tests/unit/audio-preference.test.ts`
  - `npm run test`
  - `npm run build`
- Notes:
  - Added a dedicated persisted audio preference store in `src/lib/audio-preference.ts` so mute state survives reloads without coupling to gameplay save data.
  - Updated `useSpeech` so both single-file playback and queued sequences honor the mute setting and immediately stop when the user mutes mid-session.
  - Added a reusable floating `AudioToggle` control styled to match the existing glassy HUD chrome, with `Mute sound` / `Unmute sound` accessibility labels and visible `Sound On` / `Muted` state text.
  - Mounted the toggle in the top-right corner across welcome, active play, level-complete, and victory screens so the control stays consistent without interfering with the existing Home button on the left.
  - Added regression coverage for storage persistence in `tests/unit/audio-preference.test.ts`, muted playback behavior in `tests/unit/useSpeech.test.ts`, and persisted toggle behavior in `tests/integration/KeyboardEngine.test.tsx`.
  - Residual risk: `npm run test` still prints the existing `GlobalError` HTML nesting warning from `tests/integration/error-pages.test.tsx`; the suite passes and this feature does not touch that path.

---

# Task Plan

## Objective

Add a "What is MacQuest?" button beneath the welcome-screen actions and show a parent-facing modal that explains the app and its PhD research roots in the existing visual style.

## Dependency Graph

- T1 -> T2, T3
- T2 -> T4
- T3 -> T4
- T4 -> T5

## Tasks

- [x] T1 Inspect the welcome screen layout and relevant tests
  depends_on: []
  success_criteria: The insertion point, modal interaction constraints, and test coverage targets are identified.

- [x] T2 Implement the button and modal interaction
  depends_on: [T1]
  success_criteria: Users can open and close the modal from the welcome screen without affecting the existing primary actions.

- [x] T3 Write the parent-facing explanatory content
  depends_on: [T1]
  success_criteria: The copy explains the product and research basis clearly, in a fun tone, using only supported context.

- [x] T4 Add regression coverage for the new welcome-screen behavior
  depends_on: [T2, T3]
  success_criteria: Tests verify the button renders and the modal opens/closes correctly.

- [x] T5 Verify the home-screen changes and document review notes
  depends_on: [T4]
  success_criteria: Relevant lint/tests/build checks are re-run and review notes capture behavior and remaining risks.

## Review

- Status: Complete
- Verification:
  - `npx eslint src/components/WelcomeScreen.tsx src/components/AudioToggle.tsx src/components/KeyboardEngine.tsx src/hooks/useSpeech.ts src/lib/audio-preference.ts tests/integration/WelcomeScreen.test.tsx tests/integration/WelcomeScreen-save.test.tsx tests/integration/KeyboardEngine.test.tsx tests/unit/useSpeech.test.ts tests/unit/audio-preference.test.ts`
  - `npx vitest run tests/integration/WelcomeScreen.test.tsx tests/integration/WelcomeScreen-save.test.tsx tests/integration/KeyboardEngine.test.tsx tests/unit/useSpeech.test.ts tests/unit/audio-preference.test.ts`
  - `npm run test`
  - `npm run build`
- Notes:
  - Added a new `What is MacQuest?` secondary action beneath the existing welcome-screen buttons so parents have a clear explanatory path without diluting the primary play choices.
  - Introduced a modal overlay on the welcome screen with keyboard and click-outside dismissal, plus parent-facing copy that explains the game loop, the research roots, and the learning-science rationale in plain English.
  - Kept the new UI in the existing visual language with the same glass treatment, gradients, motion, and rounded chrome already used throughout the home screen.
  - Expanded welcome-screen integration coverage to verify the button renders in both fresh and resume states and that the modal opens and closes correctly.
  - Residual risk: `npm run test` still prints the existing `GlobalError` HTML nesting warning from `tests/integration/error-pages.test.tsx`; the suite passes and this change does not touch that path.

---

# Task Plan

## Objective

Commit the current audio + welcome-modal feature work, push it to `origin/main`, and deploy the resulting release to the linked Vercel production project.

## Dependency Graph

- T1 -> T2
- T2 -> T3
- T3 -> T4
- T4 -> T5

## Tasks

- [ ] T1 Confirm the release scope, git state, and deploy target
  depends_on: []
  success_criteria: Current branch, changed files, remote, and `.vercel/project.json` target are verified and this plan is recorded on disk.

- [ ] T2 Create a release commit for the current feature work
  depends_on: [T1]
  success_criteria: The intended feature files and task-log updates are staged together and committed with a non-empty commit on `main`.

- [ ] T3 Push the release commit to `origin/main`
  depends_on: [T2]
  success_criteria: The new local commit is present on `origin/main`.

- [ ] T4 Deploy the pushed state to production
  depends_on: [T3]
  success_criteria: Vercel accepts a production deployment and returns a deployment URL for the linked `macquest` project.

- [ ] T5 Verify the release result and document review notes
  depends_on: [T4]
  success_criteria: Git, deploy, and live-site checks are recorded below with any remaining release risks.

## Review

- Status: In progress
- Verification:
  - Pending
- Notes:
  - Pending

---

# Task Plan

## Objective

Commit the current audio and home-screen information updates, push them to `origin/main`, and deploy the release to the linked Vercel production project.

## Dependency Graph

- T1 -> T2
- T2 -> T3
- T3 -> T4
- T4 -> T5

## Tasks

- [x] T1 Validate git/deploy state and capture the release plan
  depends_on: []
  success_criteria: Current branch, working tree contents, and linked deploy target are confirmed and this plan is recorded on disk.

- [x] T2 Create a release commit for the current feature work
  depends_on: [T1]
  success_criteria: The intended UI/audio changes are staged and committed locally on the current branch.

- [x] T3 Push the release commit to `origin/main`
  depends_on: [T2]
  success_criteria: The current branch is pushed successfully and the remote contains the new commit.

- [x] T4 Deploy the current repo state to production
  depends_on: [T3]
  success_criteria: Vercel accepts the deployment and returns a production URL or alias confirmation.

- [x] T5 Verify release outcomes and document review notes
  depends_on: [T4]
  success_criteria: Commit, push, deploy, and live verification results are recorded below with any remaining operational risks.

## Review

- Status: Complete
- Verification:
  - `git commit -m "Add audio controls and home page explainer"` -> commit `74125b6`
  - `git push origin main`
  - `npx vercel deploy --prod --yes`
  - `curl -I https://macquest.app`
  - `curl -s https://macquest.app | rg "What is MacQuest\\?|Practice Typing|Sound On|application/ld\\+json"`
- Notes:
  - Pushed commit `74125b6` to `origin/main`.
  - Vercel created production deployment `https://macquest-4n4ucamt8-joe-mccanns-projects.vercel.app` and aliased it to `https://macquest.app` on March 10, 2026.
  - Live verification returned `HTTP/2 200` from `https://macquest.app`, and the response HTML still includes the structured data and crawlable welcome content alongside the new home-screen experience.
  - This release ships the persisted mute/unmute control and the new parent-facing `What is MacQuest?` modal from the welcome screen.
  - Residual risk: the passing test suite still prints the existing `GlobalError` HTML nesting warning from `tests/integration/error-pages.test.tsx`; this release does not touch that path.
