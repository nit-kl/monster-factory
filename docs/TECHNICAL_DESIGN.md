# Technical design — browser-first proposal

> 2026-11-15の全キャラクター2D化・技構成・保存互換は [BATTLE_LOADOUTS.md](BATTLE_LOADOUTS.md) を優先。

> 現行実装はReact/TypeScript/Three.js。2026-11-14の配合改修・保存v3・検証は [MATERIAL_SYNTHESIS.md](MATERIAL_SYNTHESIS.md) を優先。以下のPhaser等は初期提案を含む。

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

## 2026-11-08 update: Three.js factory

Per explicit user instruction, the factory now uses Three.js (Factory3D.ts) with OrbitControls, procedural geometry, lighting and raycast equipment selection. React supplies the accessible equipment labels and UI. No characters are placed inside the factory. FactoryView owns renderer creation and disposal on navigation, including geometry, materials, controls, labels and animation frames. Domain simulation remains separate. The prior Phaser scene file is retained as unused historical code and is not imported into the app bundle.

## 2026-11-08 update: click navigation across floors

Factory3D uses separate production and research groups, with the research floor elevated by 11 world units. Only the active floor is visible (cutaway view). Floor switches and equipment selection interpolate the camera and target; reduced-motion preference applies the target immediately. Free drag/scroll camera input is disabled. React retains the selected floor through conversation via the selected equipment. Floor state is session UI state and is not saved to IndexedDB. Characters appear only in the existing portrait conversation view. Hidden-floor objects are excluded from raycasting.

## Camera interaction update

Drag rotation and wheel zoom are enabled alongside click navigation. OrbitControls start cancels automatic camera travel. Automatic travel only runs after equipment selection, floor switching, or reset; it stops at its destination. Manual camera damping is disabled to avoid delayed drift. Horizontal rotation is unrestricted, vertical rotation and distance remain bounded.

## Six-floor prototype and pan controls (2026-11-08)

The proposed full-building layout is B2 power, B1 storage, 1F production, 2F research, 3F recovery/training, and 4F command. This is a provisional spatial design, not new story canon. The active floor alone is rendered. Typed floor metadata maps fourteen equipment selections to floors and existing portrait consultation characters. FactoryDetails builds original procedural machinery and architectural detail, batching its static meshes by material within each equipment parent so raycasting remains intact. New logistics, energy and recovery mechanics are explicitly exhibition-only.

OrbitControls now supports screen-space pan with right drag (or its standard modifier-assisted left drag), orbit with left drag and wheel zoom. Pointer-up picking ignores non-left buttons. Manual interaction cancels automatic camera travel. Desktop viewport height is bounded to keep the room visible. Both upward and downward stair links are available, with endpoints disabled.

## Floor navigation and clarity revision (2026-11-08)

Map-anchored stair navigation buttons are removed at the user's request. Floor selection is handled by the React floor lists; 3D equipment picking remains. Distance fog is removed to avoid hazing distant machinery. Renderer pixel ratio is clamped to 1.5–2 (supersampling standard-DPI displays and improving the previous 1.5 cap on high-DPI displays), recalculated on resize. No depth-of-field blur is used.

## 2026-11-14 update: full rewrite (story + 3D manufacturing)

The app was rebuilt from scratch on explicit user instruction. Sections above describe the earlier prototype and are historical.

- `src/data`: parts, enemies, cast, chapter flow, line comments and the script (`script/`), all typed data.
- `src/domain`: pure TypeScript, no DOM/Three imports — `design` (stats, notes, unlocks), `battle` (seeded simulation, diagnosis), `manufacture` (units, hangar, production timeline), `story` (script format and cursor state machine), `progress` (chapter progression reducer), `save` (v2 format, validation; localStorage read/write is isolated at the bottom).
- `src/state/store.ts`: Zustand store orchestrating the above, with autosave on progress changes.
- `src/three`: presentation only — `kit` (Stage: renderer, bloom, environment, resize, disposal; particles), `monster` (procedural models from a design), `heroes`, `line` (manufacturing line driven by the domain timeline), `preview` (design turntable), `arena` (battle replay).
- `src/ui`: React screens — title, story player, hub, design, manufacture, battle/report, ending.
- One WebGL renderer exists at a time; each screen creates and disposes its own stage.
- Phaser and IndexedDB are no longer used. Tests: Vitest for domain/store, a Playwright script (`npm run e2e`) for a full playthrough against `npm run preview`.
