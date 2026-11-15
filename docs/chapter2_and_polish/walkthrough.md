# 修正内容の確認（Walkthrough）：フィードバック反映（序章・道中・視覚演出・全6章構成への再編）

## 1. 魔王の影武者に気づく描写の改善（視覚的・記録係らしい手掛かり）
- **変更箇所**：[src/data/script/prologue.ts](file:///c:/Users/kojil/Documents/Dev/github/monster-factory/src/data/script/prologue.ts)、[src/ui/EventCg.tsx](file:///c:/Users/kojil/Documents/Dev/github/monster-factory/src/ui/EventCg.tsx)、[src/data/script/chapter4.ts](file:///c:/Users/kojil/Documents/Dev/github/monster-factory/src/data/script/chapter4.ts)
- **内容**：
  - 従来の「声の裏返り・咳払い」を廃止し、記録係である主人公が**①「公式戦記では三年前の会戦で根元から折れたはずの魔王の左角が、帳の影には左右対称の二本角として映っている矛盾」**と、**②「隙間風でめくれた帳の裾から見えた、巨影を操るからくり糸と【青い硝子の指輪】をはめた白い指先」**の2点から偽物だと看破する描写＋専用一枚絵（`throne_puppet`）に変更しました。
  - 直後の回廊ですれ違う侍女の袖に「玉座の香炉と同じ黒煤」と「青い硝子の指輪」がある一枚絵（`maid_ring`）を表示し、第5章でネフィラが工場へ駆け込んだ際にもこの指輪と張り子の角の伏線を回収します。

## 2. 宰相ゼルヴァとの会話の締めくくりと、工場までの「道中パート」の追加
- **変更箇所**：[src/data/script/prologue.ts](file:///c:/Users/kojil/Documents/Dev/github/monster-factory/src/data/script/prologue.ts)、[src/ui/Backdrop.tsx](file:///c:/Users/kojil/Documents/Dev/github/monster-factory/src/ui/Backdrop.tsx)
- **内容**：
  - ゼルヴァの執務室での会話の最後に、黒鉄の通行証の授与、裏門に待機させた定期資材馬車の案内、城内の武闘派（炎将ガルドラン派）への警戒と送り出しの台詞を追加し、自然な場面転換にしました。
  - 魔王城を出た後、魔導荷馬車で三日かけて辺境へ向かう**道中シーン（新規背景 `road` ＋ 勢力図一枚絵 `world_map`）**を追加しました。
    - 北の「聖剣連合王国（勇者軍）」と南の「魔王領」の三百年戦争と、三年前の「灰冠平原の会戦」以降の膠着状態。
    - 魔王軍の組織体制（宰相府「本社」の官僚統制、前線の「四天王」との軋轢、第一〜第六魔物製造工場の陥落・閉鎖と最後の「第七工場」）。
    - 閉鎖された第六工場から撤退してくる傷病兵たちとのすれ違い。

## 3. 会話シーンの視覚演出強化（全キャラ立ち絵イラスト＆一枚絵スチル10種の画像生成・表情変化）
- **変更箇所**：[src/data/cast.ts](file:///c:/Users/kojil/Documents/Dev/github/monster-factory/src/data/cast.ts)、[src/ui/EventCg.tsx](file:///c:/Users/kojil/Documents/Dev/github/monster-factory/src/ui/EventCg.tsx)、[src/ui/Portrait.tsx](file:///c:/Users/kojil/Documents/Dev/github/monster-factory/src/ui/Portrait.tsx)、[src/ui/StoryPlayer.tsx](file:///c:/Users/kojil/Documents/Dev/github/monster-factory/src/ui/StoryPlayer.tsx)、[src/style.css](file:///c:/Users/kojil/Documents/Dev/github/monster-factory/src/style.css)
- **内容**：
  - **未実装だった全キャラクター立ち絵の生成・透過PNG化（5種）**：
    - 既存立ち絵（`noah-v2.png`・`vera-v2.png`・`maid-v1.png`・`captain-v1.png` 等）のセピア線画・水彩厚塗り・真鍮装飾の画風に合わせて以下5名の立ち絵を生成し、`1024x1536` アルファ透過PNGとして `public/assets/factory/` に配置しました（影絵シルエットを完全撤廃）：
      - [seil-v1.png](file:///c:/Users/kojil/Documents/Dev/github/monster-factory/public/assets/factory/seil-v1.png)：セイル（旅の青年・先代勇者）
      - [luka-v1.png](file:///c:/Users/kojil/Documents/Dev/github/monster-factory/public/assets/factory/luka-v1.png)：ルカ（勇者軍・魔導技師）
      - [grave-v1.png](file:///c:/Users/kojil/Documents/Dev/github/monster-factory/public/assets/factory/grave-v1.png)：グレイヴ（勇者軍・騎士団長）
      - [gardran-v1.png](file:///c:/Users/kojil/Documents/Dev/github/monster-factory/public/assets/factory/gardran-v1.png)：ガルドラン（魔王軍・四天王『炎将』）
      - [nephira-v1.png](file:///c:/Users/kojil/Documents/Dev/github/monster-factory/public/assets/factory/nephira-v1.png)：ネフィラ（魔王の影武者・角と青い硝子の指輪・操り糸差分）
  - **一枚絵（イベントCG／カットイン）全10種の生成・実装**：
    - `public/assets/cg/` に以下の10枚のワイドスクリーン一枚絵（`1376x768` PNG）を生成・配置し、[src/ui/EventCg.tsx](file:///c:/Users/kojil/Documents/Dev/github/monster-factory/src/ui/EventCg.tsx) で表示します：
      1. [throne_puppet.png](file:///c:/Users/kojil/Documents/Dev/github/monster-factory/public/assets/cg/throne_puppet.png)（御簾の二本角の巨影と、青い硝子の指輪をはめた指が引くからくり糸）
      2. [maid_ring.png](file:///c:/Users/kojil/Documents/Dev/github/monster-factory/public/assets/cg/maid_ring.png)（回廊の侍女の煤けた袖口と、薬指に光る青い硝子の指輪）
      3. [world_map.png](file:///c:/Users/kojil/Documents/Dev/github/monster-factory/public/assets/cg/world_map.png)（荷馬車の中で広げた三百年戦争の勢力図と、×印の第一〜第六工場・黄金歯車の第七工場）
      4. [cold_welcome.png](file:///c:/Users/kojil/Documents/Dev/github/monster-factory/public/assets/cg/cold_welcome.png)（バルガスが真鍮レンチを叩きつけた任命状と、冷たい視線で見下ろすリゼット）
      5. [first_birth.png](file:///c:/Users/kojil/Documents/Dev/github/monster-factory/public/assets/cg/first_birth.png)（培養槽の光から誕生した最初の魔物と、寄り添うプルル）
      6. [gate_defense.png](file:///c:/Users/kojil/Documents/Dev/github/monster-factory/public/assets/cg/gate_defense.png)（豪雨の谷門で勇者軍先遣隊を迎え撃つ炉心ゴーレムと焔華竜）
      7. [broken_seal.png](file:///c:/Users/kojil/Documents/Dev/github/monster-factory/public/assets/cg/broken_seal.png)（鉛の小箱に収められた先代魔王の折れた左角と、割れた封蝋の白紙の勅令）
      8. [white_flag.png](file:///c:/Users/kojil/Documents/Dev/github/monster-factory/public/assets/cg/white_flag.png)（朝霧の谷門に突き立てられた白布の騎士剣と、丸腰で立つノア）
      9. [broken_horn_memory.png](file:///c:/Users/kojil/Documents/Dev/github/monster-factory/public/assets/cg/broken_horn_memory.png)（夕暮れの灰冠平原で折れた左角を差し出す先代魔王と、剣を地に下ろした勇者セイル）
      10. [pluru_crown.png](file:///c:/Users/kojil/Documents/Dev/github/monster-factory/public/assets/cg/pluru_crown.png)（門の上で黄金の王核を輝かせ、谷全体へ共鳴の波を広げるプルル）
  - **立ち絵の表情・ポーズ変化**：台詞ごとにキャラクターの感情状態（`angry`: 苛立ち、`cold`: 冷淡、`sad`: 憂い、`surprised`: 動揺、`smile`: 柔和、`serious`: 真剣）が切り替わり、立ち絵の傾き・寄り引き・ライティング・感情アイコン（怒りマーク、冷気線、驚きバースト、汗・涙、輝き等）および名札の感情タグがリアルタイムに変化します。拠点の「仲間に相談」でも同様に立ち絵が変化します。

## 4. 仲間と仲良くなるペースの改善 ＆ 全6章への章構成再編
- **変更箇所**：[src/data/chapter1.ts](file:///c:/Users/kojil/Documents/Dev/github/monster-factory/src/data/chapter1.ts)、[src/data/script/chapter1.ts](file:///c:/Users/kojil/Documents/Dev/github/monster-factory/src/data/script/chapter1.ts)、[src/data/script/chapter2.ts](file:///c:/Users/kojil/Documents/Dev/github/monster-factory/src/data/script/chapter2.ts)、[src/data/script/index.ts](file:///c:/Users/kojil/Documents/Dev/github/monster-factory/src/data/script/index.ts)、[src/domain/progress.ts](file:///c:/Users/kojil/Documents/Dev/github/monster-factory/src/domain/progress.ts)
- **内容**：
  - **第1章「よそ者の工場長」（1〜5日目：工場内の模擬戦まで）**：
    - 過去3人の管理官が魔物を「不良在庫」として廃棄し逃げ帰った経緯から、バルガスとリゼットは主人公を激しく拒絶します（任命状をレンチで突き返す一枚絵 `cold_welcome`、宿舎ではなく暖房のない資料室への押し込め）。
    - 剣士・弓兵・魔法使いの模擬戦テストに全勝しても「模擬戦は所詮、安全装置付きの試験だ。あんたを工場長と認めたわけじゃねえ」と線を引かれたまま、5日目夜に勇者軍包囲の非常鐘が鳴り響いて第1章が幕を閉じます。
  - **第2章「孤立無援の防衛戦」（6〜8日目：工場の大ピンチと初めての承認）**：
    - 補給路が断たれ、外門の昇降鎖の故障でバルガスが負傷し、さらに第二換気塔へ奇襲を受ける大ピンチが発生します。
    - 裏山から逃げ出すと思われていた主人公が、手に血豆を作って蒸気弁を回し、資料室で読み込んだ旧配管図で換気塔を救い、先遣隊本隊との3連戦でも個体を一匹も使い捨てずに勝利します。
    - ここで初めてバルガスが新品の点検用革手袋を渡して謝罪し、リゼットが工場長室を用意して主人公を少し認めます。プルルが初めて「……こうじょう、ちょう」と呟きます。
  - **第3章「王の部品」（9〜13日目：認めた矢先の密命発覚と再構築）**：
    - 第2章でようやく認められた直後にヴェラが到着し、「先代魔王の崩御」と「新たな王の製造命令」を最初から隠していたことが暴かれます（「昨日、手袋を渡して頭まで下げたのに隠してたのかよ！」と激しい怒りと失望を受けます）。
    - 主人公は白紙の『王の設計図』を全員に開示し、「共同会議の規約」と監察査定・第二調査隊迎撃を通じて、一度砕けた信頼を本物の絆へと再構築します。
  - **第4章「勇者の影」（14〜17日目）→ 第5章「先代の遺言」（18〜20日目）→ 終章「王を設計する」（21日目）**：
    - 全体を通して駆け足にならないよう、全6章構成でじっくりと物語が展開します。
    - 拠点での「仲間に相談」の末尾台詞も、第1章では冷淡・拒絶、第2章では非常時の緊張、第3章以降に段階的に軟化する5段階に改めました。

## 5. 検証結果
- `npm test`：3ファイル・**37件すべて成功**（全シーン・全選択肢の読了検証、序章の一枚絵・道中検証、感情推定検証、全6章の通し進行検証を含む）。
- `npm run build`：TypeScript型検査およびVite本番ビルド成功（エラー・警告ゼロ）。
