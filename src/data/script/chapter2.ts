import { bg, cg, choice, clear, fx, narr, opt, say, title, when, type Line } from '../../domain/story';

// 第3章「角の王」。右角だけで従う王を作り、門を開けて失敗する。
type Scene = readonly Line[];

const c3d09: Scene = [
  bg('black'),
  title('第3章', '角の王'),
  bg('gate'),
  narr('九日目。納期まで残り九十一日。先遣隊は退いたが、門の鎖はまだ歪んだままだった。'),
  say('lisette', '監察官の到着は、六日後と通達にあります。それまでに、街道を塞いでください。', undefined, 'serious'),
  say('vargas', '宰相は救援を出さなかった。なら、この門は俺たちのボルトで持たせる。', undefined, 'angry'),
  say('orphen', '斥候の剣士が、修理の音を嗅ぎつけておる。盾は軽い攻撃を弾くぞ。', undefined, 'serious'),
];

const c3d09w: Scene = [
  bg('workshop'),
  cg('quiet_repair'),
  say('vargas', 'よし、前衛は退いた。鎖の歪みは今夜中に直す。', undefined, 'smile'),
  say('pluru', 'こうじょう、ちょう。', undefined, 'smile'),
  narr('プルルは、油のついたあなたの手袋を真似して、小さな布をボルトに押し当てた。'),
  cg(null),
];

const c3d11: Scene = [
  bg('floor'),
  title('十一日目', '尾根'),
  narr('納期まで残り八十九日。'),
  say('lisette', '尾根に弓が見えます。遅い個体は、一日で蜂の巣です。', undefined, 'serious'),
  say('poyon', '焔花竜と月晶狼なら、矢より先に届きますよ。', undefined, 'normal'),
];

const c3d11w: Scene = [
  bg('roof'),
  say('lisette', '……工場長。通信符が、あなたの鞄の中で光っていました。', undefined, 'cold'),
  say('zelva', '進捗を書け。王の器は、まだ白紙か。残り八十九日だ。', undefined, 'cold'),
  choice(
    opt('「門を守っています。器は、まだ作れません」', [
      say('zelva', '門は手段だ。わしが買っているのは、王だ。', undefined, 'serious'),
    ]),
    opt('「現場の記録は、毎日残しています」', [
      say('zelva', '記録係の癖が出たな。数字を送れ。感想は要らぬ。', undefined, 'cold'),
    ]),
  ),
];

const c3d13: Scene = [
  bg('floor'),
  title('十三日目', '冷気'),
  narr('納期まで残り八十七日。谷の奥に、冷たい霧が降りていた。'),
  say('orphen', '冷気じゃ。竜の血の子を出すな。星ガラスで受けよ。', undefined, 'serious'),
  say('vargas', '監察官は、あさってだ。この霧の向こうに、黒塗りの馬車が見える。', undefined, 'serious'),
];

const c3d13w: Scene = [
  bg('exterior'),
  narr('霧の中で、あなたは右角という言葉を、まだ誰にも説明できずにいた。'),
  say('poyon', '工場長さん。プルルが、あなたの鞄の前で眠ろうとしません。', undefined, 'sad'),
];

const c3arrive: Scene = [
  bg('black'),
  title('十五日目', '右角'),
  bg('exterior'),
  narr('納期まで残り八十五日。黒塗りの荷馬車が、直したばかりの門をくぐった。'),
  say('mimi', 'ただいまーっ！　格納庫、ほったらかしじゃなかった？', undefined, 'smile'),
  say('arachnea', '計測針が狂ったわ。朝から騒がないで。', undefined, 'cold'),
  say('vargas', 'ミミ、アラクネア！　本社に食われたかと思ったぜ。', undefined, 'smile'),
  say('vera', '第七魔物製造工場の稼働、確認しました。監察官、ヴェラ・アークライトです。', undefined, 'serious'),
  say('vera', '特別資材を研究フロアへ。開封は、工場長の前で行います。', undefined, 'cold'),
];

const c3secret: Scene = [
  bg('lab'),
  clear,
  narr('鉛の箱が開くと、先代の右角が、折れていない側のまま光っていた。'),
  cg('broken_seal'),
  fx('flash'),
  say('vera', '先代魔王ヴォルグラムは、三年前に崩御されています。玉座の帳の奥は、影武者です。', undefined, 'cold'),
  say('vera', 'この右角は、威光の部位です。百日目の大集会までに、これで王の形を見せていただきます。', undefined, 'serious'),
  say('vera', '三日以内に試作がなければ、No.000 を本社の器として回収します。', undefined, 'cold'),
  say('lisette', '……回収、ですか。', undefined, 'surprised'),
  cg(null),
  when('promisedLisette', [
    say('lisette', 'あの夜、「今は言えない」とおっしゃったのは、このことだったんですか。', undefined, 'sad'),
  ], [
    when('deniedToLisette', [
      say('lisette', '……「何も知らない」とおっしゃいましたね。', undefined, 'cold'),
    ], [
      say('lisette', '最初から、その鞄の中にあったのですね。', undefined, 'angry'),
    ]),
  ]),
  when('liedToVargas', [
    say('vargas', '「お元気そうでした」……よくも、俺の目を見て言えたな。', undefined, 'angry'),
  ]),
  say('vargas', '主君の角を、部品にして運んできやがった。', undefined, 'angry'),
  say('orphen', '……だからプルルの核が、あの声で鳴ったのか。', undefined, 'serious'),
  say('vera', 'No.000 の核は、先代が遺した王核のかけらです。角は威、核は意志。本社の仕様では、両方を一つの器に接合します。', undefined, 'serious'),
  say('mimi', 'ちょっと待って！　そしたら今のプルルは、どこへ行くの！', undefined, 'angry'),
  say('poyon', 'この子は部品じゃありません。', undefined, 'sad'),
  say('vera', '仕様書は宰相閣下の直筆です。拒めば、別の監督官が来ます。', undefined, 'cold'),
];

const c3council: Scene = [
  bg('lab'),
  title('十五日目', '夜の会議'),
  say('orphen', '核に触らず、角だけで器を作ることはできる。威はある。心は、無い。', undefined, 'serious'),
  say('vargas', '主君の角を削る仕事は、職人の仕事じゃねえ。', undefined, 'angry'),
  say('mimi', '身代わりを作るのも嫌。作るなら、名前を付けて。失敗しても、廃棄炉は禁止。', undefined, 'serious'),
  say('arachnea', '接合できるのは私だけよ。拒めば、軍の魔導師が乱暴にやるわ。', undefined, 'serious'),
  choice(
    opt('「プルルは渡さない。右角だけで、王の形を見せます」', [
      say('lisette', '……反対は、議事録に残します。実行は、その条件で。', undefined, 'serious'),
    ], 'c3_refuseCore'),
    opt('「設計図を机に出します。核には、誰も触らない」', [
      say('orphen', '白紙を、現場の机に置いたか。', undefined, 'surprised'),
      say('mimi', 'その言葉、お尻に噛みつくからね。', undefined, 'angry'),
    ], 'c3_share'),
  ),
  say('vera', '条件は聞きました。明日、査定を始めます。角の王が戦力になるか、数字で示しなさい。', undefined, 'cold'),
];

const c3made: Scene = [
  bg('floor'),
  title('十六日目', '角の王'),
  narr('納期まで残り八十四日。配合台の端に、右角を置く枠が一つ増えていた。'),
  say('arachnea', '材料は二つ、あなたが選びなさい。角は、私が接合する。', undefined, 'serious'),
  say('poyon', '生まれた子に布を差し出すと……動きません。', undefined, 'sad'),
  say('mimi', '「立って」って言ってごらん。', undefined, 'normal'),
  narr('あなたがそう言うと、角の王は初めて立った。名前は、ミミがあなたに尋ね、あなたが付けた。'),
  say('pluru', 'あそんで！', undefined, 'smile'),
  narr('角の王は、プルルの言葉で手足を動かした。'),
  say('mimi', '……それは、遊んでるんじゃないよ。', undefined, 'sad'),
];

const c3a1: Scene = [
  bg('floor'),
  title('十七日目', '査定'),
  say('vera', '第一査定。剣士です。角の王を後方に置きなさい。味方の装甲が厚くなります。', undefined, 'serious'),
  say('lisette', '厚くなっても、盾そのものは割れません。熔炉巨人か貫通撃を。', undefined, 'serious'),
];

const c3a1w: Scene = [
  bg('floor'),
  say('vera', '装甲の増加、確認しました。損耗は許容範囲です。', undefined, 'cold'),
  say('mimi', 'えらかったね。……角の王には、まだ名前で呼ぶと、びくってする。', undefined, 'smile'),
];

const c3a2: Scene = [
  bg('floor'),
  title('十八日目', '矢'),
  say('vera', '第二査定は弓です。加護があっても、遅ければ二連射です。', undefined, 'serious'),
  say('arachnea', '足の遅い子を、角の後ろに隠すのはやめなさい。', undefined, 'cold'),
];

const c3a2w: Scene = [
  bg('tank'),
  narr('その夜、角の王はプルルの「あそんで」で踊り、言葉が終わると止まった。'),
  say('orphen', '命令が途切れると、意志も途切れる。これは王ではない。角が歩いておるだけじゃ。', undefined, 'serious'),
];

const c3dragon: Scene = [
  bg('exterior'),
  title('十九日目', '裏山'),
  fx('shake'),
  narr('納期まで残り八十一日。裏山から、四足の古竜が降りた。'),
  say('gradius', '角が歩いておる、と思えば、小役人が王の形を作ったか。', undefined, 'serious'),
  say('lisette', 'グラディウスさん、屋根の上は禁止です。', undefined, 'angry'),
  say('gradius', 'ヴォルグラムの右角だ。心はどこじゃ。', undefined, 'serious'),
  choice(
    opt('「核には触っていません。プルルは、ここです」', [
      say('gradius', '……隠さなんだか。少しは、見込みがある。', undefined, 'normal'),
    ]),
    opt('「威光だけでは、門が開くと分かりました」', [
      say('gradius', '開く前に気づけ。遅ければ、国が割れる。', undefined, 'serious'),
    ]),
  ),
  say('vera', '査定は合格とします。ですが、勇者軍の第二調査隊が谷口にいます。', undefined, 'cold'),
];

const c3raid: Scene = [
  bg('gate'),
  title('二十日目', '門を開けよ'),
  narr('納期まで残り八十日。'),
  say('captain', '第七工場に、王がいると聞いた！　騎士団の名において、確認する！', undefined, 'angry'),
  say('vera', '角の王を門の上へ。加護があるうちに、前衛を割りなさい。', undefined, 'serious'),
];

const c3open: Scene = [
  bg('gate'),
  fx('shake'),
  say('captain', '魔導技師ルカ・フェンの書簡を読む！　「王よ、門を開けよ」！', undefined, 'angry'),
  narr('角の王は、呼ばれたとおりに門の錠を抜いた。'),
  say('mimi', 'だめ、それは命令だよ！　工場長、止めて！', undefined, 'surprised'),
  say('lisette', '加護が消えました。射手は、素早い個体で！', undefined, 'serious'),
];

const c3mid: Scene = [
  bg('gate'),
  say('vargas', '弓は退けた。残るは冷気だ。門が開いたままじゃ、工場が死ぬ！', undefined, 'angry'),
  say('orphen', '星ガラスで受けよ。そして、閉じて、と角の王に言え。', undefined, 'serious'),
];

const c3close: Scene = [
  bg('gate'),
  say('captain', '……王を、見た。命令一つで門を開ける王を。', undefined, 'surprised'),
  choice(
    opt('「閉じて」', [
      narr('角の王は、開けたときと同じ顔で、門を閉じた。'),
    ]),
    opt('「もう、誰の言葉も聞かないで」', [
      narr('角の王は首を傾げ、それからあなたの「閉じて」を待った。あなたは、その言葉を足した。'),
    ]),
  ),
  say('captain', '退け！　この谷に、王の角がある。本隊と、炎将に伝わらずには済まぬ！', undefined, 'angry'),
];

const c3castle: Scene = [
  bg('throne'),
  title('二十一日目', '帳の前'),
  narr('同じ時刻、魔王城。帳の奥で、ネフィラは糸を握ったまま動けずにいた。'),
  say('gardran', '辺境に王がいると、調査隊が報告した。宰相、説明しろ。', undefined, 'angry'),
  say('zelva', '失敗作だ。威光だけで、命令に従う。現場に置いておけ。', undefined, 'cold'),
  say('gardran', '失敗だと？　王の形を隠して百日を待つ気か。計画は、今日から俺が預かる。', undefined, 'serious'),
  say('nephira', '（帳の中で、誰も助けを求められない。声は、先代のものだから。）', 'ネフィラ', 'sad'),
  say('zelva', '……好きにしろ。右角は、もう戻らぬ。', undefined, 'sad'),
];

const c3night: Scene = [
  bg('lab'),
  title('二十二日目', '威だけ'),
  narr('納期まで残り七十八日。'),
  say('orphen', '角にあるのは威だけじゃ。心は核にある。核に触れた瞬間、プルルはいなくなる。', undefined, 'serious'),
  say('mimi', '角の王を責めないで。言われたことをしただけだもん。', undefined, 'sad'),
  say('gradius', '次に来るのは、嘘を嫌う者だ。ロウガは、膝を折る王を許さぬ。', undefined, 'serious'),
  say('pluru', '……みんなで、きめる。', undefined, 'serious'),
  bg('black'),
  title('第3章', '完'),
];

export const chapter2 = {
  c3d09, c3d09w, c3d11, c3d11w, c3d13, c3d13w,
  c3arrive, c3secret, c3council, c3made, c3a1, c3a1w, c3a2, c3a2w, c3dragon,
  c3raid, c3open, c3mid, c3close, c3castle, c3night,
} as const;
