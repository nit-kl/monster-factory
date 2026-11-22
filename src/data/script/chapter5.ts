import { bg, clear, narr, say, title, type Line } from '../../domain/story';

// 第6章「折れ角の王」。人間が、戦わない王を作ってしまう。
type Scene = readonly Line[];

const c6d64: Scene = [
  bg('black'),
  title('第6章', '折れ角の王'),
  bg('tank'),
  narr('六十四日目。納期まで残り三十六日。療養棟では、角の王が牙の王のそばを離れなかった。'),
  say('poyon', '「看病して」の一言が、まだ続いています。', undefined, 'normal'),
  say('lisette', '十字軍の斥候です。守勢で受けるか、速い個体で先に削ってください。', undefined, 'serious'),
];

const c6d64w: Scene = [
  bg('tank'),
  say('mimi', '牙の王、目は開いたよ。まだ、誰の言葉も聞かない。', undefined, 'smile'),
  say('noah', '……魔物が、敵の騎士を運んだ。僕は、それを見ていました。', undefined, 'serious'),
];

const c6d66: Scene = [
  bg('gate'),
  title('六十六日目', '戻ってきた牙'),
  narr('納期まで残り三十四日。'),
  say('vargas', '腕の王の通り道から、牙獣が零れてきた。速い。先手を取れ。', undefined, 'angry'),
];

const c6d66w: Scene = [
  bg('floor'),
  say('gradius', '北で、炎将が勝っておる。大集会を待たず、人間領へ入った。', undefined, 'serious'),
];

const c6d68: Scene = [
  bg('gate'),
  title('六十八日目', '残された槌'),
  narr('納期まで残り三十二日。'),
  say('arachnea', '置き土産のゴーレムよ。硬い。貫通か熔炉。感情で殴らないで。', undefined, 'cold'),
];

const c6d68w: Scene = [
  bg('lab'),
  say('vera', '城からの定時通信が、途絶えました。宰相閣下が、応答しません。', undefined, 'surprised'),
];

const c6news: Scene = [
  bg('lab'),
  title('七十日目', '聖遺物'),
  narr('納期まで残り三十日。奪った記録の端に、教会の目録があった。'),
  say('orphen', '「折れた左角。灰冠平原の聖遺物」。先代が自ら折った、あの角じゃ。', undefined, 'surprised'),
  say('lisette', '聖女イリスが、それを祭壇から出し、ルカに王を作らせたとあります。', undefined, 'serious'),
  say('vera', '目的は、魔物を跪かせ、王核を断つこと。谷へ向かっています。', undefined, 'cold'),
];

const c6brief: Scene = [
  bg('gate'),
  title('七十二日目', '跪き'),
  narr('納期まで残り二十八日。折れ角を頭に載せた王が、門の前に立った。格納庫の魔物が、武器を置いた。'),
  say('iris', '製造された命よ、跪きなさい。浄化は、その後です。', undefined, 'serious'),
  say('mimi', 'やだ、うちの子たち、立って！', undefined, 'angry'),
  say('orphen', '牙の王だけが立っておる。従わぬ回路じゃ。ほかの子の攻撃は、半分以下まで鈍る。', undefined, 'serious'),
  say('lisette', '8巡守り切るか、冥樹の番人の毒で削ってください。正面から殴り合っては、時間が足りません。', undefined, 'serious'),
];

const c6after: Scene = [
  bg('gate'),
  say('iris', '……なぜ、製造された王が、私の剣の前に立つ。', undefined, 'surprised'),
  narr('折れ角の王は、跪いた魔物と十字軍のあいだに、動かず立っていた。'),
];

const c6iris: Scene = [
  bg('gate'),
  title('七十三日目', '浄化せよ'),
  say('iris', '折れ角の王に命ずる。この工場を、浄化せよ。', undefined, 'angry'),
  narr('王は動かなかった。角に残っていたのは、先代の「もう戦わぬ」という誓いだけだった。'),
  say('iris', '聖遺物が、命令を拒む……。ルカ。解体しなさい。', undefined, 'sad'),
  say('luka', '……今の接合を、壊すの。', undefined, 'sad'),
  narr('十字軍は、いったん尾根へ引いた。'),
];

const c6luka: Scene = [
  bg('workshop'),
  title('七十四日目', 'できなかった'),
  narr('夜、ルカが折れ角の王を連れて、門を叩いた。'),
  say('luka', '解体、できなかった。この子、戦おうとしないの。魔物の前に立つだけ。', undefined, 'sad'),
  say('orphen', '角を見せよ。……やはり、戦いの傷がない。灰冠平原は、静かだったのじゃ。', undefined, 'serious'),
  say('luka', '勇者様が討ったって、記録にはあるのに。', undefined, 'surprised'),
  say('vera', '交戦の痕跡が、ほとんど無い戦場です。私も、そこまでしか掴めていません。', undefined, 'serious'),
];

const c6letter: Scene = [
  bg('tank'),
  title('七十五日目', '写し'),
  say('noah', '歩けるようになりました。調査の写しを、グレイヴ団長へ届けます。', undefined, 'serious'),
  say('vargas', '敵の騎士に、工場の記録を渡すのか。', undefined, 'angry'),
  say('lisette', '……行かせましょう。信じきってはいません。それでも、門の外に真実を置く人は要ります。', undefined, 'serious'),
  say('noah', '魔物が、自分たちの王と戦って、僕の隊を救った。それだけは、僕の目で見ました。', undefined, 'smile'),
];

const c6plea: Scene = [
  bg('roof'),
  title('七十六日目', '頼みだ'),
  narr('納期まで残り二十四日。通信符が、ごく小さく光った。'),
  say('zelva', '王核だけは、渡すな。', undefined, 'sad'),
  say('zelva', '命令ではない。頼みだ。', undefined, 'sad'),
  narr('声は、途中で途切れた。'),
  say('lisette', '……宰相閣下が、頼み、と言いました。', undefined, 'surprised'),
  bg('black'),
  title('第6章', '完'),
];

export const chapter5 = {
  c6d64, c6d64w, c6d66, c6d66w, c6d68, c6d68w,
  c6news, c6brief, c6after, c6iris, c6luka, c6letter, c6plea,
} as const;
