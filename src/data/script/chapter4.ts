import { bg, cg, choice, clear, fx, narr, opt, say, title, type Line } from '../../domain/story';

// 第5章「腕の王」。古参を素体に、止まらない王を作ってしまう。
type Scene = readonly Line[];

const c5d42: Scene = [
  bg('black'),
  title('第5章', '腕の王'),
  bg('gate'),
  narr('四十二日目。納期まで残り五十八日。牙の王は、谷の外で一人、退かずに待っていた。'),
  say('lisette', '別働の牙獣が、門の横へ回り込みます。ここは速度で止めてください。', undefined, 'serious'),
  say('mimi', '牙の王の名前、まだ呼んでる。届いてないみたい。', undefined, 'sad'),
];

const c5d42w: Scene = [
  bg('floor'),
  say('vargas', '本隊はまだ先だ。だが、槌の音が街道に混じり始めた。', undefined, 'serious'),
];

const c5d44: Scene = [
  bg('gate'),
  title('四十四日目', '槌'),
  narr('納期まで残り五十六日。'),
  say('arachnea', '攻城の槌よ。装甲を殴っても無駄。貫通か、熔炉の固有技。', undefined, 'serious'),
];

const c5d44w: Scene = [
  bg('workshop'),
  say('vargas', '門のボルトを増やした。炎将が来ても、簡単には渡さねえ。', undefined, 'serious'),
];

const c5d46: Scene = [
  bg('floor'),
  title('四十六日目', '測距'),
  narr('納期まで残り五十四日。'),
  say('luka', '記録、更新したわ。あなたたちがよく出す配合、射角に入れてある。遅い子からお願いね。', undefined, 'smile'),
  say('orphen', '名前を特定してはおらぬ。だが、遅い個体は的じゃ。速度で上回れ。', undefined, 'serious'),
];

const c5d46w: Scene = [
  bg('lab'),
  say('vera', '炎将の直轄軍が、本隊の側面に動いています。救援か、接収か。', undefined, 'cold'),
];

const c5d50: Scene = [
  bg('gate'),
  title('五十日目', '厚み'),
  narr('納期まで残り五十日。'),
  say('gradius', '本隊の盾は厚い。割れぬ拳で、時間を潰すな。', undefined, 'serious'),
  say('lisette', '貫通撃か熔炉巨人です。格納庫の勝数が一番多い子は、温存しても構いません。', undefined, 'normal'),
];

const c5d50w: Scene = [
  bg('workshop'),
  narr('その夜、バルガスは小さな兜を磨かなかった。勝数の札を、一つずつ数えていた。'),
];

const c5d54: Scene = [
  bg('gate'),
  title('五十四日目', '先触れ'),
  narr('納期まで残り四十六日。白い外套の騎士が、十字を掲げて距離を測っていた。'),
  say('lisette', '教会の先触れです。均整の取れた重装。守勢で受けるか、月晶狼で先に削ってください。', undefined, 'serious'),
];

const c5d54w: Scene = [
  bg('roof'),
  say('gradius', '明日、本隊が着く。牙の王は、まだ外にいる。', undefined, 'sad'),
];

const c5siege: Scene = [
  bg('gate'),
  title('五十五日目', '見切られた'),
  narr('納期まで残り四十五日。'),
  fx('shake'),
  say('luka', '射角、固定！　遅い記録から崩すわよ、第七工場！', undefined, 'smile'),
  say('lisette', '狙撃手です。速度で上回ってください。牙の王は、支援を拒んだまま前に出ています！', undefined, 'surprised'),
];

const c5fall: Scene = [
  bg('gate'),
  say('mimi', '牙の王が、崩れた！　手当てを、まだ拒んでる！', undefined, 'angry'),
  say('vargas', '門の手前まで押されてる。このままじゃ、製造フロアだ！', undefined, 'angry'),
];

const c5rescue: Scene = [
  bg('gate'),
  fx('shake'),
  narr('側面の尾根が割れ、溶岩の肌を持つ巨人が直轄軍を率いて現れた。'),
  say('gardran', '炎将ガルドランである！　第七工場の門は、今日は渡さぬ！', undefined, 'angry'),
  narr('敵の射線が崩れ、谷に夜が戻った。炎将は負傷した魔物を、自分の腕で療養棟まで運んだ。'),
  say('gardran', '死者の名を読む。聞き漏らすな。', undefined, 'serious'),
  narr('バルガスは兜を膝に置き、元上官と、名前のリストを最後まで聞いた。'),
];

const c5demand: Scene = [
  bg('lab'),
  title('五十六日目', '右腕'),
  narr('納期まで残り四十四日。炎将は、戦場から持ち帰った右腕を設計台に置いた。'),
  say('gardran', '牙の王は誇っていた。足りぬのは力だ。この腕で、二体目を作れ。', undefined, 'serious'),
  say('gardran', '素体は、格納庫で一番勝っている子だ。戦いを知っている体が要る。', undefined, 'serious'),
  choice(
    opt('「その子は渡しません」', [
      say('gardran', 'ならば、スライムの核を使う。プルル、と呼んでいたな。', undefined, 'angry'),
    ], 'c5_refused'),
    opt('「自分で選ばせてください」', [
      say('mimi', '選ばせるって、そんなの……！', undefined, 'angry'),
    ], 'c5_asked'),
  ),
  narr('古参の個体は、誰の結論も待たず、製造ラインへ歩いていった。扉の前で、一度だけ振り返った。'),
  say('vargas', '……勝て、って教えてやったのは、俺だ。', undefined, 'sad'),
  say('mimi', '誰も身代わりにしないって、約束したのに。', undefined, 'sad'),
];

const c5made: Scene = [
  bg('floor'),
  title('五十七日目', '名前が消える'),
  narr('格納庫の枠には、名前の札だけが残った。勝っていた子の配合と技は、素体として固定された。'),
  say('arachnea', '右腕は埋めた。呼んでも、反応しないわ。', undefined, 'cold'),
  say('poyon', '札の前で、プルルが聞いています。「かえってくる？」って。', undefined, 'sad'),
];

const c5watch: Scene = [
  bg('gate'),
  title('五十八日目', '止まらない'),
  narr('納期まで残り四十二日。'),
  say('gardran', '腕の王に命ずる。敵を倒せ。', undefined, 'angry'),
  narr('一体が、ルカの射線を砕いた。敵が退いても、追った。止めに入った仲間を、敵とみなした。'),
  say('lisette', '止めてください、工場長！　8巡持ちこたえても、倒しても、門の前で膝をつかせれば成功です！', undefined, 'surprised'),
  say('orphen', '守勢と再生じゃ。製造ラインに入った子は、もう出せぬ。残った手で止めよ。', undefined, 'serious'),
];

const c5chain: Scene = [
  bg('gate'),
  narr('腕の王の膝が、門の石に着いた。目は、古参のときの色に戻らなかった。'),
  say('gardran', '止まらぬなら、鎖をかければよい。戦は、これで終わる。', undefined, 'serious'),
  say('vargas', 'その子は、俺たちの格納庫の子だ！', undefined, 'angry'),
  say('gardran', 'お前の部下を死なせた戦を、俺が終わらせる。札は、返さん。', undefined, 'cold'),
  narr('鎖をかけた腕の王は、炎将の軍とともに北へ去った。'),
];

const c5noah: Scene = [
  bg('tank'),
  title('六十日目', '残された騎士'),
  cg('white_flag'),
  narr('納期まで残り四十日。撤退の最後尾に、若い騎士が倒れていた。'),
  say('poyon', '敵の人です。でも、息があります。療養棟へ運ばせてください。', undefined, 'sad'),
  say('noah', '……ノア、です。最後尾を、守っていました。', undefined, 'sad'),
  cg(null),
  say('mimi', '角の王、「看病して」。', undefined, 'normal'),
  narr('角の王は、崩れた牙の王のそばを離れなかった。'),
  say('pluru', '……かえってくる？', undefined, 'sad'),
  bg('black'),
  title('第5章', '完'),
];

export const chapter4 = {
  c5d42, c5d42w, c5d44, c5d44w, c5d46, c5d46w, c5d50, c5d50w, c5d54, c5d54w,
  c5siege, c5fall, c5rescue, c5demand, c5made, c5watch, c5chain, c5noah,
} as const;
