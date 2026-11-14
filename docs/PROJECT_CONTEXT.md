# Project context — read first

## Vision
**モンスター製造課 ～魔王軍最後の工場～** is a browser-first fantasy factory game: combine TWO materials, discover a distinct monster as it takes shape in a 3D manufacturing scene, then watch it fight automatically with spectacular signature moves. Inspect results and try another recipe. It begins as workplace comedy in a struggling demonic factory but grows into a character-rich story about war, created life, and the choices of the workers. Current mechanics: `docs/MATERIAL_SYNTHESIS.md` (supersedes older organ-slot and production-management proposals).

**Pitch:** 「モンスターを作るゲーム」であり「モンスターたちと働くゲーム」。

**主人公と工場の関係（承認済み）**：本社からの派遣者はすぐには仲間と認められず、責任の取り方と共同作業で信頼を得る。職務協力と個人的な信頼は分ける。第2章の秘密発覚と信頼修復を経て、最後にプルル自身へ設計の判断を委ねる。現行方針は `docs/STORY_TRUST_ARC.md`。

## Established preferences / requirements
- Launch first as a **Web browser game**; consider Steam later.
- Host with **Cloudflare** (Cloudflare Pages for static front end); **do not use Vercel**.
- Develop on user's local machine with **Codex** and GitHub source control. This document pack is an explicit handoff from detailed earlier ChatGPT design discussions. Codex does not automatically have those chats.
- Prioritize **strong, memorable characters**, including **several fully nonhuman monsters** (not mostly human-looking characters with horns/ears).
- Strong mechanics and serious long-form story are equally important; accessible comedic opening, gradually deeper plot.
- Show development progress with an early playable browser demo (5–10 minutes for exhibition) and then a 15–20 minute alpha.
- Avoid unnecessary paid cloud services; client-side initial game and local save.

## Product pillars (do not lose)
1. Combine two materials to discover creatures with distinct silhouettes and fighting styles; materials need not come from the human world.
2. Watch materials resonate and form life. No mandatory production minigame or three-plus-part configuration.
3. Autocombat visibly demonstrates design decisions; defeat analytics make a concrete improvement path clear.
4. Factory is inhabited by recognizable monster employees who have real jobs, friction, relationships, and personal stories.
5. Combat veterans may return with experience, quirks and relationships; monsters aren't disposable numbers only.
6. The long narrative should surface through the factory and work outcomes, not only long disconnected dialogue scenes.

## Canon vs provisional
**Firm**: browser first, Cloudflare, local Codex, character-centric monster factory, nonhuman major cast, loop above, Japanese UI, GitHub management.
**Provisional design recommendations (confirm before treating as final)**: game subtitle, names and specifics of supporting cast, exact art style (2D top-down/2.5D), 12–20h full game, 5-minute demo, React/Phaser/Zustand/IndexedDB/Vitest/Playwright, exactly how factory tile placement works, combat wave mechanics, specific plot twist, and final ending branches.

When descriptions across documents differ, prefer explicit established preferences, then `docs/DECISIONS.md`, then this context, then other design documents. Ask or propose when a significant conflict remains.
