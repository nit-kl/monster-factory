# 実装計画（Implementation Plan）：序章〜全6章の構成再編・信頼構築ペース改善・一枚絵＆立ち絵感情演出

## 背景と課題（ユーザーフィードバック）
1. **魔王の影武者の気づき方**：フルボイスではないため「声の裏返り・咳払い」では気づきにくい。記録係ならではの視覚的・記録的な矛盾で気づくようにする。
2. **ゼルヴァとの会話の終わり方**：執務室の会話が唐突に終わるため、通行証の授与や裏門の馬車の手配など自然な締めくくりを入れる。
3. **魔王城から工場までの道中描写**：道中シーンを追加し、魔王軍の組織体制（宰相府・四天王・第一〜第六工場の陥落）や三百年戦争の世界情勢を解説する。
4. **会話シーンの視覚的変化**：文字量だけに頼らず、一枚絵（イベントCG／カットイン）や各キャラの立ち絵の表情・ポーズ変化を入れる。
5. **仲間と仲良くなる速度と章構成の見直し**：
   - 第1章はバルガスとリゼットの拒絶をより激しくし、工場内の模擬戦（1〜5日目）だけではまだ主人公を受け入れない。
   - 第2章で勇者軍の包囲網による工場の大ピンチ（6〜8日目）を主人公が救い、そこで初めて少し認める。
   - 第3章で「認めたばかりなのに魔王の死と製造の密命を隠していたこと」が発覚し、共同会議と監察査定を通じて信頼を再構築する。
   - 以降の章も第4章「勇者の影」、第5章「先代の遺言」、終章「王を設計する」の全6章構成として丁寧に描く。

## 変更内容
- `src/domain/story.ts`: `Mood`（感情・ポーズ）と `CgId`（一枚絵カットイン）、および文脈からの感情自動推定 `resolveMood()` を追加。
- `src/ui/EventCg.tsx`: 10種類のイベントスチル（`throne_puppet`, `maid_ring`, `world_map`, `cold_welcome`, `first_birth`, `gate_defense`, `broken_seal`, `white_flag`, `broken_horn_memory`, `pluru_crown`）を描画するコンポーネントを新設。
- `src/ui/Backdrop.tsx`: 辺境への街道と資材馬車を描く背景 `road` を追加。
- `src/ui/Portrait.tsx`, `src/ui/StoryPlayer.tsx`, `src/style.css`: 台詞ごとの立ち絵感情エフェクト・モーション・名札感情タグ・一枚絵表示を実装。
- `src/data/script/prologue.ts`, `src/data/script/chapter1.ts`, `src/data/script/chapter2.ts`, `src/data/script/chapter3.ts`, `src/data/script/chapter4.ts`, `src/data/script/chapter5.ts`, `src/data/script/index.ts`, `src/data/chapter1.ts`, `src/domain/progress.ts`, `src/ui/App.tsx`, `src/ui/Hub.tsx`: 全6章構成への再編と台詞・進行の改稿。
