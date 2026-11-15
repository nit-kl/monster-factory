# タスクリスト：フィードバック反映（序章〜全6章の構成再編・信頼構築ペース改善・一枚絵＆立ち絵感情演出）

- [x] **序章の改善（視覚的な影武者看破・宰相会話の締め・道中パートの追加）**
  - [x] 声の裏返りではなく「三年前の戦記で折れたはずの左角が帳の影には二本ある矛盾」＋「隙間風でめくれた帳の裾から見えた、からくり糸を引く指と青い硝子の指輪（回廊の侍女と一致）」で影武者に気づく描写と一枚絵（`throne_puppet`・`maid_ring`）を追加
  - [x] ゼルヴァとの会話を唐突に終わらせず、通行証の授与・裏門の定期資材馬車の手配・武闘派への警戒を告げて送り出す締めくくりを追加
  - [x] 魔王城から第七工場へ向かう三日間の荷馬車道中パート（背景 `road` ＋ 勢力図一枚絵 `world_map`）を追加し、三百年戦争・魔王軍の組織体制（本社宰相府／四天王／第一〜第六工場の陥落と最後の第七工場）・撤退兵との遭遇を描写
- [x] **会話シーンの視覚演出強化（一枚絵スチル＆全キャラクター立ち絵のイラスト生成・表情変化）**
  - [x] 既存アセット（`noah-v2.png`・`vera-v2.png`・`maid-v1.png`・`background-v2.png` 等）の画風・色彩・線画タッチに統一した**新規キャラクター立ち絵5種**（`seil-v1.png` / `luka-v1.png` / `grave-v1.png` / `gardran-v1.png` / `nephira-v1.png`）を透過PNG（`1024x1536`）として生成・[src/data/cast.ts](file:///c:/Users/kojil/Documents/Dev/github/monster-factory/src/data/cast.ts) に統合（シルエット仮立ち絵を全廃）
  - [x] 物語の重要局面を彩る**一枚絵（イベントスチル／CG）全10種**（`throne_puppet` / `maid_ring` / `world_map` / `cold_welcome` / `first_birth` / `gate_defense` / `broken_seal` / `white_flag` / `broken_horn_memory` / `pluru_crown`）を `public/assets/cg/*.png` として生成し、[src/ui/EventCg.tsx](file:///c:/Users/kojil/Documents/Dev/github/monster-factory/src/ui/EventCg.tsx) で表示
  - [x] [src/ui/Portrait.tsx](file:///c:/Users/kojil/Documents/Dev/github/monster-factory/src/ui/Portrait.tsx)・[src/ui/StoryPlayer.tsx](file:///c:/Users/kojil/Documents/Dev/github/monster-factory/src/ui/StoryPlayer.tsx)・[src/style.css](file:///c:/Users/kojil/Documents/Dev/github/monster-factory/src/style.css) に感情・ポーズ演出（`angry` / `cold` / `sad` / `surprised` / `smile` / `serious` による立ち絵の傾き・寄り引き・オーラ・感情エフェクト・名札タグ）を追加
- [x] **章構成と信頼獲得ペースの抜本的見直し（全6章構成）**
  - [x] **第1章「よそ者の工場長」（1〜5日目：模擬戦3戦）**：前任者の悪政によるリゼット・バルガスの激しい拒絶を描き、模擬戦に全勝してもまだ受け入れられないまま勇者軍包囲の急報で章末へ
  - [x] **第2章「孤立無援の防衛戦」（6〜8日目：前哨戦2戦＋本隊3連戦）**：補給途絶・外門鎖の故障・換気塔奇襲の大ピンチを主人公が泥だらけで救い、ここで初めてバルガスとリゼットが少し認める展開へ
  - [x] **第3章「王の部品」（9〜13日目）**：認めた矢先にヴェラと特別資材（先代の左角）が到着し、魔王の死と製造の密命を隠していたことが発覚して信頼が激しく揺らぎ、共同会議の規約と査定で再構築する展開へ
  - [x] **第4章「勇者の影」（14〜17日目）・第5章「先代の遺言」（18〜20日目）・終章「王を設計する」（21日目）**：青い硝子の指輪の伏線回収や灰冠平原の回想スチル（`broken_horn_memory`）、プルルの王命スチル（`pluru_crown`）を加えて重厚化
  - [x] 拠点の「仲間に相談」（`consultationReflection`）も第1章では冷淡・拒絶、第2章は非常時、第3章以降に段階的に軟化する5段階へ改稿
- [x] **テスト・ビルド検証**
  - [x] `npm test`（全37件成功）および `npm run build`（型検査・本番ビルド成功）を確認
