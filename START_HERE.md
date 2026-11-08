# How to use this handoff pack with local Codex

1. Create or open your local `monster-factory` repository.
2. Copy `AGENTS.md` to repository root and the whole `docs/` folder beside it.
3. Start Codex **inside the repository root** (`codex` in terminal or Codex in VS Code).
4. Send the boot prompt below first. Let Codex summarize the project and make sure it did not change character roster, deployment, or core loop.
5. Then request small changes. Each time, have Codex read relevant docs and update documentation only when a design change was approved.

## First prompt — copy/paste

このリポジトリの `AGENTS.md` と `docs/PROJECT_CONTEXT.md`, `docs/GAME_DESIGN.md`, `docs/CHARACTER_BIBLE.md`, `docs/TECHNICAL_DESIGN.md`, `docs/ROADMAP.md`, `docs/DECISIONS.md` を必ず最初に読んでください。

1. まずコードを変更せず、これまでに決めたゲームの方向性、主要キャラ（完全なモンスター型を含む）、中核ゲームループ、Cloudflare配信方針、初期MVP、未決定事項を日本語で要約してください。
2. 資料間の矛盾や実装上のリスクを指摘し、最初の小さい実装計画を提示してください。
3. その後、React + TypeScript + Vite + Phaser の最小構成を実装し、工場の仮マップと4画面切り替えを動かしてください。ライセンス未確認の画像は使わず、仮図形を使用してください。
4. Vitestを入れ、ビルドと動作可能なテストを実行し、結果を報告してください。
5. **Cloudflare Pages**向けの静的ビルド（dist）を用意してください。Vercelは使わないでください。
6. GitHubへのpush、Cloudflareへの本番デプロイ、有料サービスの導入、未決定の大規模機能追加は行わないでください。

実装完了後、変更ファイル、実行したコマンド、結果、未実装事項、次の推奨タスクをまとめてください。
