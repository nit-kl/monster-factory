import { bg, cg, choice, clear, fx, narr, opt, say, title, type Line } from '../../domain/story';

// 第7章「目の王」。隠していた左目で、先代と数時間だけ再会する。
type Scene = readonly Line[];

const c7d78: Scene = [
  bg('black'),
  title('第7章', '目の王'),
  bg('gate'),
  narr('七十八日目。納期まで残り二十二日。城の定時通信は、戻ってこなかった。'),
  say('vera', '空になった城の兵が、宰相の行方を探しています。盾が厚い。貫通か熔炉巨人で。', undefined, 'serious'),
];

const c7d78w: Scene = [
  bg('lab'),
  say('orphen', '喉と左目が、まだ出ておらぬ。部位は、ほかにもある。', undefined, 'serious'),
];

const c7d82: Scene = [
  bg('floor'),
  title('八十二日目', '冷える通信'),
  narr('納期まで残り十八日。'),
  say('lisette', '通信路を凍らせに来ました。星ガラスで受けてください。竜の血は出さないで。', undefined, 'serious'),
];

const c7d82w: Scene = [
  bg('exterior'),
  narr('夜、谷の入口に干し草の荷車が止まった。荷の下で、巨大な何かが息をしていた。'),
];

const c7arrive: Scene = [
  bg('floor'),
  title('八十五日目', '荷車'),
  narr('納期まで残り十五日。ネフィラが、泥の侍女服のまま扉を開けた。'),
  say('nephira', '第七工場、やっと着いたわ。荷車の中、見て。宰相閣下は、干し草がお嫌いよ。', undefined, 'angry'),
  fx('shake'),
  narr('老いた大蛇が、研究フロアに身を寄せた。天井のランプが、いくつもの目に映った。'),
  say('zelva', 'リゼット。辺境は、寒いか。', undefined, 'sad'),
  say('lisette', 'あなたが飛ばした辺境です。謝罪が下手なまま、来ないでください。', undefined, 'angry'),
  say('zelva', '……下手だ。それでも、左目はここ以外に置けぬ。', undefined, 'serious'),
];

const c7eye: Scene = [
  bg('lab'),
  clear,
  say('zelva', '喉と、左目だ。喉は、三年間ネフィラが先代の声を出すために使った。', undefined, 'serious'),
  say('vera', '左目は、失われた記録になっていました。', undefined, 'surprised'),
  say('zelva', '失わせておいた。この目には、停戦と、自ら死を選んだ記憶がある。知られれば、国が割れる。', undefined, 'sad'),
  say('nephira', '私の声は、もう喉の向こうよ。返してほしいけど……先代に、会わせてあげたいのも本当。', undefined, 'sad'),
];

const c7council: Scene = [
  bg('lab'),
  title('八十六日目', '会議'),
  narr('納期まで残り十四日。'),
  say('lisette', '陛下に、戻っていただきたいです。', undefined, 'sad'),
  say('mimi', '反対。また誰かを上書きするなら、私はラインの前に立つ。', undefined, 'angry'),
  say('poyon', '私も、反対です。', undefined, 'sad'),
  say('gradius', '反対じゃ。理由は、まだ言えぬ。', undefined, 'serious'),
  narr('票は割れた。プルルが、左目の箱に乗った。'),
  say('pluru', '……あいたい。', undefined, 'serious'),
  choice(
    opt('「プルルの一言で、決めます」', [
      say('lisette', '……議事録には、反対も残します。', undefined, 'serious'),
    ], 'c7_pluru'),
    opt('「数時間だけ。終わったら、新しい命として迎えます」', [
      say('mimi', 'その約束、忘れるなよ。', undefined, 'angry'),
    ], 'c7_hours'),
  ),
];

const c7made: Scene = [
  bg('floor'),
  title('八十七日目', '自分の声'),
  narr('ネフィラが喉を手放すと、製造槽の中の声が、先代のものに変わった。'),
  say('nephira', 'あ……これ、私の声だ。三年ぶり。', undefined, 'surprised'),
  say('maou', 'リゼットか。背が、伸びたな。', '目の王', 'smile'),
];

const c7wave: Scene = [
  bg('gate'),
  narr('納期まで残り十三日。炎将の先鋒が、王の気配を嗅いで門に着いた。'),
  say('lisette', '一戦ごとに、話す時間が得られます。負けた戦闘は、やり直してください。記憶は、取り逃させません。', undefined, 'serious'),
  say('vargas', '最初の相手は槌だ。硬いえ。貫通で割れ。', undefined, 'angry'),
];

const c7talk1: Scene = [
  bg('lab'),
  say('vargas', '陛下。迷宮で死んだ部下の名を、読みます。', undefined, 'sad'),
  say('maou', '覚えておる。数に、するな。', '目の王', 'serious'),
  say('vargas', '……はい。', undefined, 'sad'),
  say('lisette', '次は重騎士です。もう一戦、時間を買ってください。', undefined, 'serious'),
];

const c7talk2: Scene = [
  bg('lab'),
  say('maou', 'グラディウス。まだ、話しておらなんだか。', '目の王', 'serious'),
  say('gradius', '……停戦の盟約を、三年、隠し通した。', undefined, 'sad'),
  cg('broken_horn_memory'),
  say('zelva', '左目も、わしが隠した。国を保つためで、ございました。', undefined, 'sad'),
  say('maou', '保ったな。そして、リゼットを辺境へやった。罰でもあり、この核のそばに置く配置でもあった。', '目の王', 'serious'),
  say('lisette', '守るための左遷まで、嘘だったのですね。', undefined, 'angry'),
  cg(null),
  say('maou', '恨め。次の戦が、最後の時間じゃ。', '目の王', 'sad'),
];

const c7talk3: Scene = [
  bg('lab'),
  say('poyon', 'この声です。「この子を頼む」と、言った声。', undefined, 'surprised'),
  say('maou', 'ポヨン。覚えていてくれたか。', '目の王', 'smile'),
  say('lisette', '陛下、戻ってください。百日目の王は、あなたでなければ。', undefined, 'sad'),
  say('maou', 'わしが止めよと言えば、止まる。それでは、何も変わらぬ。', '目の王', 'serious'),
  say('maou', 'プルル。お前は、わしではない。', '目の王', 'smile'),
  say('pluru', '……しってる。', undefined, 'serious'),
];

const c7vigil: Scene = [
  bg('lab'),
  title('八十九日目', '看取り'),
  cg('last_vigil'),
  narr('記憶が、灯のように薄くなっていった。'),
  say('lisette', '侍従として、最後の世話をします。工場長は、記録を。', undefined, 'sad'),
  say('maou', '書いたか。', '目の王', 'serious'),
  choice(
    opt('「書きました」', [
      say('maou', 'ならば、よい。', '目の王', 'smile'),
    ]),
    opt('ペンを置いたまま、先代の手に触れる', [
      say('maou', '記録係が、言葉を残せぬほどか。……それも、よい。', '目の王', 'smile'),
    ]),
  ),
];

const c7morning: Scene = [
  bg('floor'),
  title('九十日目', '新しい朝'),
  narr('同じ体が、何も覚えていない目で朝を見た。'),
  say('mimi', '名前、付ける。陛下とは呼ばない。あたらしい子だから。', undefined, 'smile'),
  say('lisette', '……おはよう。', undefined, 'sad'),
  say('mimi', '角の王、どっちがいい？　窓か、暖炉か。', undefined, 'normal'),
  narr('角の王は、初めて自分で、窓を指した。'),
];

const c7eve: Scene = [
  bg('roof'),
  title('九十二日目', '前夜の前'),
  narr('納期まで残り八日。谷の両側に、灯が増えていた。'),
  say('pluru', 'あした、ぷるるが、つくる。', undefined, 'serious'),
  say('orphen', '部位は、もう残っておらぬ。残るは、その核だけじゃ。', undefined, 'serious'),
  bg('black'),
  title('第7章', '完'),
];

export const chapter6 = {
  c7d78, c7d78w, c7d82, c7d82w, c7arrive, c7eye, c7council, c7made,
  c7wave, c7talk1, c7talk2, c7talk3, c7vigil, c7morning, c7eve,
} as const;
