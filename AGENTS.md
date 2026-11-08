# Codex project instructions — Monster Factory

Read `docs/PROJECT_CONTEXT.md` first, then `docs/GAME_DESIGN.md`, `docs/CHARACTER_BIBLE.md`, `docs/TECHNICAL_DESIGN.md`, and `docs/ROADMAP.md` before any nontrivial implementation. These files are the project source of truth; do not infer product decisions from the latest prompt alone.

## Working rules
- Build a Japanese-language, desktop-first browser game. Use React + TypeScript + Vite for UI, Phaser for the 2D game scenes, Zustand for state, and separated pure TypeScript domain logic.
- Deploy static frontend to **Cloudflare Pages**, not Vercel. Initial release is client-side with local saves, without a required server or paid service.
- The central loop is **monster design → manufacturing → autobattle → analysis → improvement**. Character-driven factory life and a serious long-term narrative are essential; do not replace them with generic monsters or a combat-only game.
- Maintain a consistent canonical roster and lore. Monster workers (e.g. minotaur, lich, giant slime, spider monster, dragon) are full characters, not decoration.
- Use data definitions for species, organs, skills, production modifiers, AI behaviors, dialogue, and character metadata. Keep combat simulation deterministic/testable with an injected seed.
- Build in small, testable increments. Prioritize an enjoyable 5-minute vertical slice, then a 15–20-minute alpha. Tests for core calculations, a build, and an updated docs summary are required for each relevant task.
- Placeholder art only unless original licensed art is provided. Do not search for and embed unlicensed reference images. Do not use generative images as finalized approved character designs unless explicitly requested.
- Do not introduce backend auth, Cloudflare D1/Workers, multiplayer, monetization, Steam packaging, elaborate AI, or complex factory placement unless approved.
- Do not push, deploy, or change Cloudflare/GitHub settings without explicit approval. Never commit secrets.
- Before coding: inspect repository, summarize the relevant requirements and a small plan. After coding: report files changed, tests/build results, and outstanding decisions.
- Any new design choice not clearly established in docs should be written as a **proposal**, not silently canonized. Update `docs/DECISIONS.md` only after approval.
