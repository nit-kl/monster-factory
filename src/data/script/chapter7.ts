import { bg, cg, choice, clear, fx, narr, opt, say, title, type Line } from '../../domain/story';

// 終章「王を設計する」。プルルが核だけで自分を設計し、百日目を閉じる。
type Scene = readonly Line[];

const c8d94: Scene = [
  bg('black'),
  title('終章', '王を設計する'),
  bg('gate'),
  narr('九十四日目。納期まで残り六日。諸部族の篝火と、十字軍の灯が、谷の両方に並んだ。'),
  say('lisette', '斥候の剣です。戴冠の日まで、門のボルトを残してください。', undefined, 'serious'),
];

const c8d94w: Scene = [
  bg('roof'),
  say('vera', '炎将は、腕の王を先頭に、百日目をこの谷で行うと布告しました。', undefined, 'serious'),
];

const c8d96: Scene = [
  bg('gate'),
  title('九十六日目', '測距'),
  narr('納期まで残り四日。'),
  say('luka', '距離、測らせて。射つつもりはないの。あなたたちが、どこで止まるか知りたいだけ。', undefined, 'smile'),
  say('orphen', '遅い個体は、それでも的じゃ。速度で上回れ。', undefined, 'serious'),
];

const c8d96w: Scene = [
  bg('lab'),
  say('nephira', '喉は、私が持ってる。プルルの声を通すとき、使うから。', undefined, 'serious'),
];

const c8d97: Scene = [
  bg('gate'),
  title('九十七日目', '先触れ'),
  narr('納期まで残り三日。'),
  say('rouga', '従わされてはおらぬ。先の牙だけ、止めよ。百日目に、王を見る。', undefined, 'serious'),
  say('lisette', '牙獣です。速度で先手を取ってください。', undefined, 'serious'),
];

const c8d97w: Scene = [
  bg('lab'),
  narr('設計台の材料枠も、部位の枠も、空のままだった。'),
  say('pluru', 'あした。', undefined, 'serious'),
];

const c8yield: Scene = [
  bg('lab'),
  title('九十九日目', '空席'),
  narr('納期まで残り一日。初日、あなたはこの席に任命状を置いた。'),
  choice(
    opt('設計台の席を、プルルに譲る', [
      narr('あなたが椅子を引くと、プルルは小さく一礼して、台の上へ登った。'),
    ], 'c8_yielded'),
    opt('「あり方は、プルルが決めていい」と席を譲る', [
      narr('黄金の核が、一度だけ温かく脈打った。プルルは自分の足で中央へ登った。'),
    ], 'c8_yielded'),
  ),
  say('orphen', '武器の欄を、自分で消しておる。部位は、一つも使わぬ。', undefined, 'surprised'),
  cg('empty_design'),
  say('arachnea', '空の配合台を整備したの、初めてよ。……悪くない。', undefined, 'smile'),
];

const c8dawn: Scene = [
  bg('gate'),
  title('百日目', '戴冠'),
  narr('完成まで、一晩かかる。そのあいだ、門を持たなければならない。'),
  say('gardran', '開門せよ！　腕の王を、諸部族の前に戴く！', undefined, 'angry'),
  say('rouga', '俺は、跪きに来たのではない。見るために来た。', undefined, 'serious'),
  say('iris', '核がまだある。新しい王が生まれる前に、断つ。', undefined, 'serious'),
  say('nephira', '喉は、ここ。声が通るまで、私が持つ。', undefined, 'serious'),
];

const c8horn: Scene = [
  bg('gate'),
  say('lisette', '角の王に、「誰も通すな」と頼んでください。敵は、門を開けと叫ぶはずです。', undefined, 'serious'),
  say('mimi', '装甲が増してる。厚い盾は、貫通か熔炉で割って！', undefined, 'smile'),
  narr('敵兵が「門を開けよ」と叫んだ。角の王は、初めて自分の言葉で答えた。「……いやだ。」'),
];

const c8fang: Scene = [
  bg('gate'),
  say('gradius', '牙の王が、また一人で崩れかける。', undefined, 'serious'),
  narr('牙の王は、誰にも聞かなかった声で、初めて言った。「……たのむ。」'),
  say('vargas', '横に、速い子を出せ！　今度は、一人じゃねえ！', undefined, 'angry'),
];

const c8arm: Scene = [
  bg('gate'),
  say('gardran', '腕の王、前へ。札の名前ごと、門を割れ。', undefined, 'angry'),
  say('lisette', '8巡です。耐えれば、プルルの設計が終わります。守勢と再生で持ちこたえてください。', undefined, 'serious'),
  say('poyon', '製造ラインにいた子の枠が、まだ空いています。名前は、残っています。', undefined, 'sad'),
];

const c8command: Scene = [
  bg('gate'),
  clear,
  fx('flash'),
  fx('glow'),
  cg('pluru_crown', '部位を使わず、核だけで立った小さな王'),
  narr('ネフィラが喉を掲げた。プルルの声は、右角、牙、右腕、左角、左目を通って、谷に届いた。'),
  say('pluru', '――たたかうのを、やめて。', '魔王プルル', 'serious'),
  cg(null),
  narr('腕の王の膝が折れた。目が、古参のときの色に戻った。格納庫の札に、名前が戻った。'),
  say('mimi', 'おかえり！　名前、呼ぶからね！', undefined, 'smile'),
];

const c8still: Scene = [
  bg('gate'),
  say('rouga', '命令ではなかった。願いだった。兵を、下げる。', undefined, 'serious'),
  say('gardran', '俺は、最初から自分の意志で戦っている。願いでは、止まらぬ。', undefined, 'angry'),
  narr('バルガスが、磨いていた兜を胸に抱えて前に出た。炎将は答えず、北へ歩いて去った。'),
  say('iris', '核が残っている。浄化は、終わっていない。', undefined, 'angry'),
  say('seil', 'イリス。俺は、ヴォルグラムを討ってはいない。', undefined, 'sad'),
  say('seil', '左角は、戦いの戦利品じゃない。もう戦わぬ、という誓いだ。', undefined, 'serious'),
  say('grave', 'ノアの届けた写しを、読んだ。全軍、剣を収めよ。', undefined, 'serious'),
  say('noah', '団長……！', undefined, 'smile'),
];

const c8receipt: Scene = [
  bg('gate'),
  title('百日目', '受領'),
  say('zelva', '諸部族の長よ。発注した魔王、一体。確かに、受領する。', undefined, 'serious'),
  say('zelva', '以後、この核に命令の力はない。従うかどうかは、各々が決めよ。', undefined, 'cold'),
  say('eleanor', '王国第一王女エレオノーラです。停戦の条を、読み上げます。和解ではありません。火を、止める条です。', undefined, 'serious'),
  say('eleanor', '折れた左角は、戦わなかった王とともに、この工場へ残します。', undefined, 'serious'),
  say('luka', '……記録、持ち帰る。兵器の欄は、今日で閉じとく。', undefined, 'smile'),
];

const c8epilogue: Scene = [
  bg('floor'),
  title('エピローグ', '最初の朝礼'),
  narr('一ヶ月後。暖房のない資料室には、隠居した宰相の毛布があった。初日にあなたが寝た場所だった。'),
  say('zelva', '……ここは、寒いな。', undefined, 'sad'),
  say('lisette', '予算は、ありません。お茶なら、あります。', undefined, 'normal'),
  bg('floor'),
  say('mimi', '点呼！　角の王、窓の係。牙の王、門の外は禁止。古参、おかえり。折れ角の王、真ん中。新しい子、名前で。', undefined, 'smile'),
  say('pluru', '玉座は、空のままでいい。', undefined, 'smile'),
  cg('factory_morning'),
  say('pluru', 'ぷるる、ここで、みんなとはたらく。', undefined, 'smile'),
  say('lisette', '工場長。今日の設計図の確認を。百日の納期は、終わりました。仕事は、続きます。', undefined, 'smile'),
  bg('black'),
  title('モンスター製造課', '～魔王軍最後の工場～　完'),
];

export const chapter7 = {
  c8d94, c8d94w, c8d96, c8d96w, c8d97, c8d97w,
  c8yield, c8dawn, c8horn, c8fang, c8arm, c8command, c8still, c8receipt, c8epilogue,
} as const;
