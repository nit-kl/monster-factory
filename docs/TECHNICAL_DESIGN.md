# Technical design — browser-first proposal

## Target and deployment
- PC web browser first, responsive UI where feasible but desktop priority; Cloudflare Pages for static frontend deployment.
- GitHub repository suggested name `monster-factory`; Cloudflare Pages production branch `main`, build command `npm run build`, output `dist` (verify actual build). Use Preview deployments on PRs if available.
- Keep prototype free/low-cost and **client-side only**. IndexedDB for local saves. Clarify to user that local saves may be lost when browser storage is cleared and do not transfer between devices.

## Stack
React + TypeScript + Vite for application and menus; Phaser for scenes/animation; Zustand for shared state (avoid duplicate truth in Phaser and React); pure TypeScript simulation domain; Vitest unit tests; Playwright E2E. Codex is used on local machine; GitHub is version control. Confirm installed versions before scaffolding.

## Architectural rules
- `src/domain/monsters`: body/organs/skills/personality data, compatibility and stat calculation, serializable creature instances.
- `src/domain/factory`: recipes, devices, costs, production effects and production simulations.
- `src/domain/battle`: deterministic actions, targeting, effects, logging, seeded RNG injection, explainable diagnostics.
- `src/domain/story`: events, conditions, flags, dialogue references.
- `src/game`: Phaser scene objects and sprites; **presentation only**.
- `src/app`: React UI menus, scene mount, panels, input.
- `src/state`: Zustand and cross-screen orchestration.
- `src/persistence`: versioned save/load (IndexedDB) and migration tests.
- `src/data`: JSON/typed seed data for parts, units, staff, dialogue.
- `public/assets`: licensed/original visuals and audio; placeholders initially.

## Nonfunctional
- Keyboard/mouse, clear Japanese UI, readable typography, scalable layout, low loading size, pause/resume where relevant, errors handled gracefully.
- Data-driven game balancing rather than hard-coded game logic; reproducible unit tests.
- Only request account/backend or Workers/D1 when justified by new product requirements.
- Security: no client-exposed secrets, no user credentials committed, avoid analytics/cookies until needed and disclosed.

## Codex workflow
1. Read `AGENTS.md` and all `docs/*.md` design docs.
2. Before task: inspect current repo and report brief implementation plan; identify unsupported assumptions.
3. Implement small testable increment, write/update tests, run `npm run build` and relevant tests.
4. Summarize changed files and evidence; do not claim tests pass unless run.
5. Do not push, merge, or deploy without explicit instruction.

## Suggested bootstrap commands
```powershell
mkdir monster-factory
cd monster-factory
git init
# copy this handoff pack (AGENTS.md and docs/) into root
codex
```
First prompt: "Read AGENTS.md and all docs. Before coding, summarize canonical decisions, MVP scope, unresolved points, and a safe first implementation plan. Then scaffold Vite/React/TS/Phaser with Cloudflare Pages-ready static build, placeholder factory scene and 4 navigation screens; add tests and build. Do not push/deploy."
