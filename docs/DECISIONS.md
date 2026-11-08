# Decision log

## Confirmed by user
- Browser game as initial release target; Steam not initial priority.
- Cloudflare deployment instead of Vercel.
- Local Codex for implementation, GitHub for source management.
- Characters and story are a high priority; multiple fully monstrous major employees, especially minotaur-like creatures.
- The design direction for monster manufacturing, automated combat, improvements and factory workers is endorsed.

## Suggested / not explicitly locked
- Final product title and subtitle.
- React+Phaser+Vite+Zustand+IndexedDB stack, Cloudflare Pages instead of Workers static assets.
- Character names, exact biographies, number of characters, art direction.
- Scope/length and chapter/endings for full game.
- Manufacturing layout freedom and exact simulation.

## Open questions (do not block bootstrap)
- Visual aesthetic: detailed pixel art, hand-drawn 2D, or 2.5D.
- Single creature versus squad-based battles and deployment specifics.
- Long-term support for mobile screens.
- Content rating/tone balance between workplace comedy and dark fantasy.
- Exact scope of branching narrative and whether specific character can depart or die.

When an open question becomes urgent, propose 1–2 workable defaults and ask for approval rather than changing it silently.

## 2026-11-08：ユーザー承認の工場3D化

- ユーザー指示「工場部分はThree.jsでモンスターの工場を再現」「キャラたちは配置しなくてよい」に基づき、工場描画をThree.jsへ変更。
- 工場内にキャラクターを置かない。会話・設計・戦闘の既存機能は維持。
- 従来のPhaser指定に対する、工場画面の明示的な変更。自由建設や工場配置エンジンの承認は含まない。

## 2026-11-08：クリック移動・会話立ち絵方式

- ユーザー承認「その方向性で対応してみてください」に基づき、主人公・担当者の3Dモデルを使わないクリック移動方式を採用。
- フロア一覧や階段でカメラを移動し、設備へ寄って操作する。担当者は相談時の立ち絵と会話で表現する。
- 最初の試作は製造・研究の2フロア。その他のフロア構成や最終的な建物設計は未確定。

## 2026-11-08：ドラッグ見渡しの追加

- ユーザー指示により、クリック移動と併用するドラッグ回転を採用。ホイール拡大も利用可能。
- 主人公・担当者の3Dモデル不要、会話は立ち絵のみという方針は継続。
