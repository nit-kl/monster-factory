# Roadmap and acceptance criteria

> 過去の企画・決定の記録です。現在の画面と進行は [実装状況](IMPLEMENTATION_STATUS.md) を参照してください。

> 初期ロードマップ。2026-11-14承認の現行ゲームループは [MATERIAL_SYNTHESIS.md](MATERIAL_SYNTHESIS.md)。旧器官設計・ライン管理の項目は再検討対象。

## Milestone 0 — context and bootstrap
- Codex reads this repository context, sets up React/Vite/TypeScript/Phaser, basic scene, tab navigation (factory/design/battle/story), tooling and tests.
- Done when local `npm run dev` displays the placeholder factory, `npm run build` passes, and test scripts are defined and run where feasible.

## Milestone 1 — monster builder
- Three body types, three attack organs, three defense organs; combine to stats, visible layered previews, and meaningful compatibility effects (e.g. fire self-burn vs heat protection).
- Versioned local save/reload of a designed individual.
- Unit tests: reproducible calculations, incompatible parts, stat boundaries, expected traits.

## Milestone 2 — autobattle and analysis
- Three enemy roles, deterministic combat, battle replay/log/diagnostics, repeatable rematch.
- A visible improvement experience: player changes part or manufacturing process and wins a fight previously lost for an explainable reason.

## Milestone 3 — factory
- 3 devices in small simple production line, clear cost/time/quality variation; create and dispatch designed monsters.
- Avoid large custom placement engine until core loop is fun.

## Milestone 4 — character/story/demo
- Introduce Lisette, Vargas, Orphen, Poyon, Pluru in a compact, characterful story flow. Short dialogues; voice-distinct banter; escalating mystery and one striking closing beat.
- One exhibition-ready 5–10-minute slice, restart/reset without facilitator, stable save handling, accessible controls, no tutorial overload.

## Milestone 5 — web alpha and Cloudflare
- 15–20 minutes playable, balancing, bug fixes, browser compatibility, build/test checks, GitHub CI, Cloudflare Pages preview and publication only when user explicitly approves.

## Success measures (qualitative initially)
- Player can say what they changed and why the next battle improved.
- Player notices and remembers the named monster workers.
- A new player can begin without prior explanation; five-minute demo has a clear start, payoff, and narrative hook.
- All core logic can be tested without launching Phaser.
