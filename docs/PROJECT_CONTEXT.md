# Project context — read first

## Vision
**モンスター製造課 ～魔王軍最後の工場～** is a browser-first 2D fantasy factory game: invent monsters from parts, build/adjust a manufacturing line, send them into automatic battles against invading hero forces, inspect failures, and improve designs. It begins as workplace comedy in a struggling demonic factory but grows into a character-rich story about war, created life, and the choices of the workers.

**Pitch:** 「モンスターを作るゲーム」であり「モンスターたちと働くゲーム」。

## Established preferences / requirements
- Launch first as a **Web browser game**; consider Steam later.
- Host with **Cloudflare** (Cloudflare Pages for static front end); **do not use Vercel**.
- Develop on user's local machine with **Codex** and GitHub source control. This document pack is an explicit handoff from detailed earlier ChatGPT design discussions. Codex does not automatically have those chats.
- Prioritize **strong, memorable characters**, including **several fully nonhuman monsters** (not mostly human-looking characters with horns/ears).
- Strong mechanics and serious long-form story are equally important; accessible comedic opening, gradually deeper plot.
- Show development progress with an early playable browser demo (5–10 minutes for exhibition) and then a 15–20 minute alpha.
- Avoid unnecessary paid cloud services; client-side initial game and local save.

## Product pillars (do not lose)
1. Design creatures from bodies/organs/behavior traits and see meaningful emergent **trade-offs**, not only stat increases.
2. Production steps affect the resulting creatures' abilities, quality, costs, and personality/behavior.
3. Autocombat visibly demonstrates design decisions; defeat analytics make a concrete improvement path clear.
4. Factory is inhabited by recognizable monster employees who have real jobs, friction, relationships, and personal stories.
5. Combat veterans may return with experience, quirks and relationships; monsters aren't disposable numbers only.
6. The long narrative should surface through the factory and work outcomes, not only long disconnected dialogue scenes.

## Canon vs provisional
**Firm**: browser first, Cloudflare, local Codex, character-centric monster factory, nonhuman major cast, loop above, Japanese UI, GitHub management.
**Provisional design recommendations (confirm before treating as final)**: game subtitle, names and specifics of supporting cast, exact art style (2D top-down/2.5D), 12–20h full game, 5-minute demo, React/Phaser/Zustand/IndexedDB/Vitest/Playwright, exactly how factory tile placement works, combat wave mechanics, specific plot twist, and final ending branches.

When descriptions across documents differ, prefer explicit established preferences, then `docs/DECISIONS.md`, then this context, then other design documents. Ask or propose when a significant conflict remains.
