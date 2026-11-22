# 技術構成

React と TypeScript で画面を構成し、Three.js で工場・製造演出・散策を描画します。Vite が静的配信用の dist を生成します。

- src/data/chapter1.ts に全章の会話、工場、章末の順序を定義しています。保存済みの step はこの配列の位置です。
- src/data/script に会話と選択肢、src/domain に配合、製造、進行、セーブの検証があります。
- src/state/store.ts が Zustand の状態更新と自動保存を担当します。
- src/ui/App.tsx がタイトル・本編・章末の画面を切り替えます。現場調査の入口はタイトルと工場です。
