# How to use this handoff pack with local Codex

## ゲーム内の場面をすぐ確認する

`npm run dev` を起動し、表示された URL に `?debug=1` を付けます（例 `http://localhost:5173/?debug=1`）。
右上の「開発プレビュー」で会話、戦闘目標、章の結果、工場・格納庫、配合台、製造演出、戦闘演出を選び、「この地点から開始」を押します。
戦闘演出では戦闘目標と個体を選べます。同じ地点を再確認するには、パネルを開き直して再度開始します。
開始時にはその時点で使える配合から確認用の個体が用意されます。会話の選択履歴は空です。このモードの進行は保存されません。

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
