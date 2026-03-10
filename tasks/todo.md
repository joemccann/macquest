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
