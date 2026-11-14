# 画像制作プロンプト（参考画像に基づく美術提案）

最優先は 1 の背景です。その後 2 の5キャラクターを1枚ずつ生成してください。参考にした工場画面をChatGPTへ添付し、以下をコピーしてください。生成画像は美術案としてレビューするもので、キャラクターデザインの最終承認ではありません。

## 1. 工場背景 / factory-background.png

添付画像の美術方向を参考に、オリジナルの日本語ブラウザゲーム「モンスター製造課」の背景素材を制作してください。横長1536×1024。高密度で輪郭の明瞭なドット絵、横から見た断面型の魔王軍の工場。深い紫の石壁、古い真鍮の配管、金色の手すり、上階の渡り廊下、温かい琥珀色のランプ、下階の搬送ベルト、工具と木箱。中央に紫の魔力が淡く光る大型培養槽3基。培養槽は空にして、後から生物を重ねられるようにする。中央と下段には従業員を置ける空間を確保。薄暗いが仕事場として温かく、生命が生まれる期待感のあるファンタジー工場。奥行きはあるが床は横方向に連続し、ゲーム画面として読みやすい構図。画面の四隅に重要な物体を置かない。文字、ロゴ、数字、UI、ボタン、人物、モンスターを描かない。参考画像のキャラクターや文字を複製しない。背景は不透明、画面全体を描く。

## 2. キャラクター（各1枚、透明背景）

以下の共通文に、対象の個別文を1つだけ付けて生成してください。全員を一枚にまとめないでください。

共通文：添付の工場画面に調和する、オリジナルゲーム用の高密度ドット絵キャラクター素材。1024×1024、透明背景。1体だけ、全身、正面寄りの斜め向き。輪郭は明瞭、紫の弱い環境光と暖かい金色の縁取り光。頭・角・手足まで余白を確保し、切れないようにする。文字、枠、台座、背景、UI、床の影は不要。親しみと個性があり、工場で働く姿として使える。静止した自然な仕事中のポーズ。

- **vargas.png**：バルガス、完全な牛の頭を持つ巨大なミノタウロスの設備主任。人間の顔ではない。大きな左右の角、厚い茶色の毛、強靭な腕、作業用の革エプロン、重い手袋。大きな工具を持つ。無骨だが穏やかな目。横に広い重量感のあるシルエット。
- **orphen.png**：オルフェン、浮遊する骸骨のリッチの研究主任。顔は明確な頭蓋骨で、生身の人間の顔や肌はない。古い紫の研究ローブ、細い骨の手、開いた研究書、眼窩の小さな魔力光。恐怖一辺倒ではなく知的で風変わりな雰囲気。
- **poyon.png**：ポヨン、巨大な半透明のスライムの培養・品質管理担当。人型ではなく幅広いゼリー状の体。薄紫の透き通る体内に試薬容器が浮かび、優しい小さな目と口。滑らかな丸いシルエット。頭髪や服はない。
- **pluru.png**：プルル、小さな青いスライム。透き通る青い体の内部に小さな黄金色の核がある。好奇心のある表情。ポヨンと区別できる小さく簡潔なシルエット。服や手足はない。
- **lisette.png**：リゼット、副工場長の魔族女性。短い角、実務的な工場管理者の服、手に作業台帳。厳格で有能だが親しみも感じる表情。露出を抑えた仕事着。人型のシルエット。髪色や服の細部は提案として描く。

## 納品と組み込み

画像を生成したら、保存先のパスを会話で知らせてください。背景と各キャラクターを確認し、サイズ・透過・足元の位置を調整して組み込みます。最終配置先は `public/assets/factory/` を想定しています。まず背景だけでも進められます。

工場のUI、文字、スタッフ名、数値、ボタンはコードで描画します。画像全体を一枚の操作画面として貼り付けません。設備の個別画像とアニメーション用素材は、この最初のセットの見た目が合ってから追加します。

## 追加素材の生成記録（2026-11-08、内蔵 image_gen）

すべて transparent_background=true。外観は提案段階。生成結果を目視し、元ファイルを残してプロジェクトへコピー。

### public/assets/factory/lisette-v1.png

Original game sprite concept for Lisette Crow, deputy manager of a fantasy monster factory. Adult humanoid demon woman, two SHORT horns, pointed ears, deep burgundy hair tied back for work, practical high-collared dark plum factory manager coat with restrained antique gold trim, long trousers and boots, holding a production ledger and pencil. Strict competent cost-conscious organizer with a quietly caring expression. Modest functional workwear, no crown, no military rank insignia. Detailed crisp pixel art matching a purple stone and brass isometric fantasy factory. Full body centered, three-quarter view facing slightly left, all horns and feet visible with generous margin. Transparent background, no floor, no shadows, no scenery, no lettering, no UI. Character only. This is a proposed character design.

### public/assets/battle/swordsman-v1.png

Original 2D game battle sprite, a generic adult human swordsman opponent in a fantasy monster factory game. Full body side three-quarter view facing LEFT, steel breastplate, simple helmet, muted blue tabard, brown boots, sword held ready and small round shield. Readable compact silhouette, detailed crisp pixel art, restrained heroic design not a named hero. Warm neutral highlights with subtle purple reflected light. Isolated single character centered with margin, genuinely transparent background, no floor no shadow no outer glow no text no UI. Suitable for 150 pixel tall combat display.

### public/assets/battle/slime-v1.png

Single original game battle sprite: a factory-grown generic slime monster, translucent emerald green jelly body, small determined eyes, simple mouth, squat rounded silhouette, facing RIGHT in three-quarter view. No golden core (this is NOT the blue mascot Pluru), no jars or objects inside, no clothes. Detailed crisp pixel art matching purple and gold fantasy factory game. Clear readable silhouette at 130px display size. Isolated entire character with margin, transparent background, no scenery no floor no shadow no text no UI no exterior glow. Base body without attached organs, organs are added by UI later.

### public/assets/battle/golem-v1.png

Single original game sprite of a factory-grown stone golem base body. Stocky massive gray stone creature, broad blocky shoulders, thick short legs, tiny amber eyes in stone head, seams between stone plates, neutral determined expression. No weapons, no clothing, no embedded fire or poison, no magical core visible. Full body three-quarter side view facing RIGHT. Detailed crisp pixel art matching a purple and brass fantasy factory game. Readable at 150px high. Transparent background, entire body with margin, no ground no shadow no scenery no text no UI. One creature only.

### public/assets/battle/beast-v1.png

Single original game sprite of a factory-grown beast base body, fully nonhuman quadrupedal wolf-like fantasy creature. Lean agile build, charcoal blue fur, thick mane, four paws, long tail, amber eyes, alert determined expression, no clothing no armor no weapon. Full body three-quarter side view facing RIGHT. Detailed crisp pixel art consistent with purple stone and brass fantasy factory game, readable at 150px. Transparent background, centered with margin around all paws ears tail, no floor no shadow no scene no text no UI. One creature only.

## 敵素材追加（内蔵 image_gen、2026-11-08）

いずれも transparent_background=true。外観案として保存。生成結果は目視確認。

### public/assets/battle/archer-v1.png

Single original fantasy game enemy sprite, adult human archer, full body three-quarter side view facing LEFT. Practical forest green hood and leather armor, brown boots, quiver, holds longbow ready. Neutral focused expression, no named hero identity. Crisp detailed pixel art matching a purple-and-brass monster factory game, clear silhouette for 150px tall display. Transparent background, full body centered with margin, no ground, no scene, no shadows, no text no UI. One character only.

### public/assets/battle/mage-v1.png

Single original fantasy game enemy sprite: adult human frost mage, full body three-quarter side view facing LEFT. Clearly living human face, NOT a lich, no skull. Pale blue layered robes with silver trim, blue hood, boots, holding wooden staff topped with small icy crystal, free hand conjuring tiny frost spark. Crisp detailed pixel art matching purple-and-brass fantasy monster factory game. Clear silhouette at 150px display size. Entire character centered with margin, transparent background, no ground no shadow no scenery no text no UI. One character only, generic opponent not a named hero.

## 2026-11-08 最新キャラクター資料
全10人の透過立ち絵v2の入力対応・最終プロンプトは [CHARACTER_ART_V2.md](CHARACTER_ART_V2.md) に記録。内蔵image_genで生成し、public/assets/factoryへ保存。
