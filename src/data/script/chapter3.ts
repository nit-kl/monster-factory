import { bg, choice, clear, fx, narr, opt, say, title, type Line } from '../../domain/story';

// 第4章「牙の王」。誰にも従わず、退けない王。
type Scene = readonly Line[];

const c4d24: Scene = [
  bg('black'),
  title('第4章', '牙の王'),
  bg('gate'),
  narr('二十四日目。納期まで残り七十六日。角の王は、言われた場所に立ち続けていた。'),
  say('mimi', '「そこにいて」って言ったら、一日中そこなんだよ。', undefined, 'sad'),
  say('lisette', '谷の外に牙獣です。噂を嗅いでいます。速い相手です。', undefined, 'serious'),
];

const c4d24w: Scene = [
  bg('floor'),
  say('pluru', 'あそんで、っていったら、おどる。', undefined, 'normal'),
  say('orphen', '言葉が終われば、踊りも終わる。覚えておけ。', undefined, 'serious'),
];

const c4d26: Scene = [
  bg('gate'),
  title('二十六日目', '厚い盾'),
  narr('納期まで残り七十四日。'),
  say('vera', '重騎士です。角の加護は、もう使いません。盾は貫通で割りなさい。', undefined, 'cold'),
  say('vargas', '熔炉巨人の一撃でも割れる。軽い連打は弾かれるぞ。', undefined, 'serious'),
];

const c4d26w: Scene = [
  bg('workshop'),
  say('arachnea', '接合面は綺麗よ。角の王の膝が、命令待ちで震えてるのが気に入らないだけ。', undefined, 'cold'),
];

const c4d28: Scene = [
  bg('floor'),
  title('二十八日目', '記録'),
  narr('納期まで残り七十二日。'),
  say('luka', '第七工場、聞こえる？　戦闘記録、ずいぶん丁寧ね。遅い子から射抜くわ。', undefined, 'smile'),
  narr('声はそれだけで切れた。リゼットが、魔導技師ルカの特徴だと欄外に書いた。'),
  say('lisette', '速度が8以上遅い個体は、二連射です。月晶狼か焔花竜を。', undefined, 'serious'),
];

const c4d28w: Scene = [
  bg('lab'),
  say('vera', '本社へは、こう報告します。王の形は不安定。核は未使用。', undefined, 'cold'),
  say('zelva', '……ロウガが動いた。嘘を嫌う狼に、膝を折る王を見せるな。', undefined, 'serious'),
  narr('通信は、それだけで切れた。'),
];

const c4d32: Scene = [
  bg('gate'),
  title('三十二日目', '槌'),
  narr('納期まで残り六十八日。'),
  say('vargas', '重装の槌だ。装甲が厚すぎて、通常の拳じゃ届かねえ。', undefined, 'angry'),
  say('orphen', '貫通撃か、熔炉巨人の固有技じゃ。装甲を無視できる。', undefined, 'serious'),
];

const c4d32w: Scene = [
  bg('roof'),
  say('gradius', '明日、ロウガが来る。王の死を、隠すな。核の在りかは、隠せよ。', undefined, 'serious'),
];

const c4rouga: Scene = [
  bg('gate'),
  title('三十五日目', '謁見'),
  narr('納期まで残り六十五日。白銀の巨狼が、子狼を連れて門に立った。'),
  say('rouga', '王に会わせろ。帳の外で、この目で見る。', undefined, 'serious'),
  narr('角の王は、子狼の「お座り」に座った。'),
  fx('shake'),
  say('rouga', 'これは王ではない。命令の残響だ。ヴォルグラムは、どこだ。', undefined, 'angry'),
  say('lisette', '……三年前に、崩御されています。', undefined, 'sad'),
  say('rouga', '死を隠して、角を歩かせたか。獣の部族は、嘘には跪かぬ。', undefined, 'angry'),
];

const c4fang: Scene = [
  bg('lab'),
  clear,
  narr('ロウガは、先代から預かった牙を設計台に置いた。'),
  say('rouga', 'これは誓いの牙だ。百日目に、膝を折らぬ王を見せろ。いなければ、部族は散る。', undefined, 'serious'),
  say('zelva', 'なぜ話した。牙まで渡したのか、記録係。', undefined, 'angry'),
  choice(
    opt('「隠せる嘘ではありませんでした」', [
      say('zelva', '……時間は、まだある。百日目まで、狼を待たせよ。', undefined, 'cold'),
    ]),
    opt('「核の場所は、話していません」', [
      say('zelva', 'それだけが、わしの残りだ。守ってみせろ。', undefined, 'serious'),
    ]),
  ),
  narr('通信は切れた。ロウガは、答えを待たずに裏山へ視線を向けた。'),
];

const c4made: Scene = [
  bg('floor'),
  title('三十六日目', '退けない体'),
  narr('納期まで残り六十四日。'),
  say('orphen', '牙は誇りじゃ。従わせる回路は、入らぬ。回復も、交代も、受け付けぬ体になる。', undefined, 'serious'),
  say('mimi', '名前は付ける。廃棄はしない。それが、この工場の条件だよ。', undefined, 'serious'),
  say('lisette', '力試しには、今から製造する個体だけを出してください。速い体で、退かずに勝ち切る必要があります。', undefined, 'serious'),
  say('arachnea', '材料は二つ。あなたが選びなさい。私は牙を、正確に埋める。', undefined, 'normal'),
];

const c4trial: Scene = [
  bg('gate'),
  say('rouga', '勝ったな。だが、傷を見せて手当てを拒んでおる。', undefined, 'serious'),
  say('rouga', '誇りはある。民がおらぬ。百日目に、もう一度見る。', undefined, 'cold'),
  narr('巨狼は牙を置いたまま、群れを連れて谷を出た。'),
];

const c4home: Scene = [
  bg('floor'),
  title('三十八日目', '噛み合わない'),
  narr('角の王は何でも聞き、牙の王は何も聞かなかった。'),
  say('mimi', '角の王、「牙の王のそばにいて」。', undefined, 'normal'),
  narr('角の王は、一日中そこへ立った。牙の王は、一度も見なかった。'),
  say('pluru', 'なまえ、おぼえた。', undefined, 'smile'),
  say('poyon', 'ふたつの失敗を、この子は捨てずに見ています。', undefined, 'sad'),
];

const c4leave: Scene = [
  bg('gate'),
  title('四十日目', '一人で'),
  narr('納期まで残り六十日。勇者軍本隊の狼煙が、街道の向こうに上がった。'),
  say('lisette', '本隊です。牙の王を、門の内側へ！', undefined, 'surprised'),
  narr('牙の王は止めようとする手を振り払い、門を出ていった。'),
  say('mimi', '名前、呼んでるのに！　待って！', undefined, 'angry'),
  say('gradius', '退けぬ者を、命令では戻せぬ。次に会うとき、あれは倒れている。', undefined, 'sad'),
  bg('black'),
  title('第4章', '完'),
];

export const chapter3 = {
  c4d24, c4d24w, c4d26, c4d26w, c4d28, c4d28w, c4d32, c4d32w,
  c4rouga, c4fang, c4made, c4trial, c4home, c4leave,
} as const;
