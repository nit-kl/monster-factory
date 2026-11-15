# Decision log

## 2026-11-14：材料二つの配合と固有の魔物へ全面改修（最新）

- ユーザーは3箇所以上の組み合わせと製造ミニゲームを望まず、材料から魔物を生み出し、その魔物の派手な自動戦闘を見る方向を承認。材料は人間界の品に限定しない。
- 現行実装は2材料・6レシピ・個別の3D造形。未知の姿を誕生時に発見し、以降はレシピから再製造できる。
- 製造は共鳴→形成→測定→誕生を観察。戦闘は全自動を維持し、3回ごとの固有技を追加。
- 旧4スロット設計・工程による品質調整は現行仕様から外す。過去資料より `docs/MATERIAL_SYNTHESIS.md` を優先する。
- 主人公と現場の信頼の物語は維持。保存形式v3へ移行し、v2の原本は初回保存時にバックアップ。

## 2026-11-14：仕事を通じて工場の信頼を得る物語

- ユーザー承認「その方向性で全体的に見直してください」：工場の面々は本社から来た主人公をすぐには仲間と認めない。必要な説明・製造・救護には初日から協力するが、現場の裁量や私的な話は段階的に預ける。
- 第1章は警戒→責任を引き受ける姿の観察→共同作業→限定的な信頼。全員の敵意や理不尽な妨害にはしない。プルルだけは最初から肩書きを気にせず近寄る。
- 敗北を信頼獲得の必須条件にしない。初戦勝利でも損害の記録と帰還後の点検で同じ成長線へ合流する。好感度や新しいセーブ項目は追加しない。
- 第2章の秘密発覚は、ようやく築いた信頼を傷つける事件。一度の謝罪や勝利で解決せず、情報共有と共同決定を通じて修復する。終章でプルル自身に設計を委ねる結末につなげる。
- 実装済みの序章・第1章と相談を改稿。第2章以降は構成資料の改稿であり、ゲームへの追加実装ではない。詳細は `docs/STORY_TRUST_ARC.md`。

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

## 2026-11-14：物語の中心アイデア（魔王製造計画）

- ユーザー承認：`docs/proposals/STORY_AND_STRUCTURE_PROPOSAL.md`（v2）の**案A「魔王を一体、製造せよ」**を物語の中心とする。先代魔王はすでに死んでおり、本社はそれを隠して第七工場に新しい魔王の製造を命じる。
- ユーザー承認：主人公は**魔王軍本社から派遣された人物**。肩書きの細部（宰相府・特命製造監督官）は提案段階。
- ユーザー承認：工場外の両軍の主要人物の**方向性**（魔王軍：先代魔王・宰相・影武者・炎将・獣王・ヴェラ／勇者軍：勇者・騎士団長・魔導技師・聖女・第一王女）。名前と細部は仮。
- ユーザー承認：**王の設計図**を物語全体をつなぐ仕組みとする。
- ユーザー判断：最後に作られる王は、分岐させず固定してよい（面白い方向性であれば）。具体案（プルルが自分で自分を設計した、戦わない王）は提案中で、未承認。
- これにより、GAME_DESIGN.md の旧「Story arc」（記憶を持つ個体／繰り返す侵攻／ゼロ工場）は置き換えられる。

## 2026-11-14：最後に作られる王とキャラクター資料

- ユーザー承認「その王の案で進めて」：最後に作られる王は**プルル**。プルル自身が王の設計図を使って自分を設計し、攻撃のための器官を持たない王になる。王核の一度きりの王命「たたかうのを、やめて」で停戦をもたらし、力は尽きる。玉座には座らず工場に残る。結末は1つで、王の設計図は王の能力・最終戦の手札・エピローグに反映する。
- ユーザー指示によりCHARACTER_BIBLE.mdを更新：主人公、工場メンバーの背景（案Aに合わせた調整）、魔王軍・勇者軍の主要人物、陣営内の対立、秘密の開示時期を記載。工場外の人物の名前・細部の経歴・口調の例は仮。

## 2026-11-14：ゲームの全面作り直し

- ユーザー指示「ストーリーを楽しめるストーリーパート、精巧な3Dモデルの製造パートを演出できるようにゲームを完全に作り直してください。現状のコードを完全に作り直してよい」に基づき、コードを全面的に書き直した。
- これにより、製造される**モンスターの3Dモデル**と製造ラインの3D演出を採用する（従来の「人物の3Dモデルは置かない、会話は立ち絵」という方針は継続。担当者は立ち絵と一言の吹き出しで登場する）。
- 6フロアを歩き回る3D工場の試作は廃止し、製造ラインを主役にした構成へ変更。
- 以下は実装上の**提案**で、未承認：部品の入荷日程、培養槽の容量40、敵の特徴（盾・連射・冷気と凍結）、すべての数値、熟成培養の追加、格納庫5体と療養棟、localStorageの自動保存、Phaserを使わないこと、台本草案の採用と入荷日程に合わせた台詞の調整。

## 2026-11-15：熔炉巨人の2Dイラスト採用

- ユーザー承認「これでいきましょうか」に基づき、生成した熔炉巨人の2D案を採用。重厚な鉄の装甲と胸の炉に宿る竜の炎を造形の軸にする。
- 最初の適用先は配合画面の発見済み熔炉巨人。未発見時の姿の秘匿は維持。戦闘・製造画面と他の魔物の移行は今後の作業。

## 2026-11-15：熔炉巨人の2D表示を各画面に展開

- 継続指示に基づき、熔炉巨人のイラストを製造・誕生・格納庫・戦闘・各アイコンに適用。背景と設備は既存3Dを使う2.5D構成。
- 製造中の暗い形成状態、待機時の呼吸、砲撃時の反動、既存の竜炉砲・被弾・決着演出を接続。動きを減らす設定では追加の呼吸・反動を抑える。
- 熔炉巨人の戦闘では敵も既存2Dイラストを使用。他の魔物のアート制作・置換は未対応。

## 2026-11-15：全戦闘キャラクターの2D化と技構成

- ユーザーの全面対応指示に基づき、味方6種・敵3種すべてを種族共通イラストで表示する。
- 味方は候補4技から通常技2つを選び、種族固有技と合わせた3行動を繰り返す。配合時に選択でき、格納庫で再調整可能。敵も固有の技順を持つ。
- 外見差分の量産は行わず、技ごとの飛び道具・防御・回復・必殺演出で戦い方を表現する。仕様と検証手順は docs/BATTLE_LOADOUTS.md。
