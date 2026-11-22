import { bg, cg, choice, clear, fx, narr, opt, say, title, when, type Line } from '../../domain/story';

// 第1章「よそ者の工場長」（1〜5日目：模擬戦と現場の拒絶）および第2章「孤立無援の防衛戦」（6〜8日目：包囲網の危機と初めての承認）。
type Scene = readonly Line[];

const arrival: Scene = [
  bg('black'),
  title('第1章', 'よそ者の工場長'),
  bg('exterior'),
  narr('辺境の谷の底。三本そびえる煙突のうち二本は冷え切り、残る一本だけが頼りない煙を吐いていた。'),
  say('lisette', '……第七魔物製造工場です。副工場長のリゼット・クロウと申します。', undefined, 'cold'),
  say('lisette', '歓迎の挨拶は省きます。本社から派遣された管理官は、あなたで四人目ですので。', undefined, 'cold'),
  choice(
    opt('「工場の再建を命じられて来ました」', [
      say('lisette', 'ええ、前任の三名もまったく同じ台詞を口にされました。そして半年と経たずに逃げ帰られましたよ。', undefined, 'cold'),
    ]),
    opt('「閉鎖の通達を持ってきたわけではありません」', [
      say('lisette', '今は、でしょう？　赤字の責任を現場に押し付けて閉鎖の上申書を書くのが、第三書記室のお仕事ですから。', undefined, 'cold'),
    ]),
  ),
  bg('floor'),
  fx('shake'),
  narr('薄暗い製造フロアに足を踏み入れた途端、配管の奥から牛頭の巨漢が現れ、油まみれの真鍮レンチであなたの任命状を机に押さえつけた。'),
  cg('cold_welcome', '真鍮レンチで突き返された任命状と、氷のように冷たい現場の視線'),
  say('vargas', 'おい、本社の書記官サマよ。その綺麗な紙切れ一枚で、俺たちのラインに指図できると思うなよ！', undefined, 'angry'),
  say('vargas', '設備主任のバルガスだ。言っとくがな、お前の前任者は傷ついた魔物を『不良在庫』と呼んで廃棄炉に放り込もうとした。', undefined, 'angry'),
  say('vargas', '今度同じ真似をしてみろ。本社だろうが宰相府だろうが、俺がこの手で谷底へ放り投げてやる！', undefined, 'angry'),
  cg(null),
  say('lisette', 'バルガスさん、レンチは下ろしてください。……ですが工場長、彼の言葉がここの総意です。', undefined, 'cold'),
  say('lisette', '現在、稼働設備は三割。飼育係のミミと整備技師のアラクネアは本社に召喚されたまま戻っていません。', undefined, 'cold'),
  say('lisette', '人員と予算を削る通達と、生産数を倍にしろという通達が、同じ馬車で届くのが今の本社です。', undefined, 'angry'),
  say('vargas', 'で、本社から来たってことは、魔王城でヴォルグラム陛下のお顔を拝んだのか？', undefined, 'serious'),
  choice(
    opt('「帳越しに、お姿とお声だけ」', [
      say('vargas', '……ふん。三年前からずっと帳の奥か。現場の血も汗も、城の奥までは届かねえってわけだ。', undefined, 'cold'),
    ]),
    opt('「……お元気そうでした」', [
      say('vargas', '……そうかい。書記官ってのは、息を吐くように薄っぺらいお世辞が出るんだな。', undefined, 'cold'),
    ], 'liedToVargas'),
  ),
  say('vargas', '俺は仕事に戻る。白線の内側には一歩も入るなよ、素人が触れば機械がへそを曲げる。', undefined, 'angry'),
  narr('バルガスは吐き捨てるように背を向けた。そこへ天井近くから、骸骨の魔導士がふわりと降りてきた。'),
  say('orphen', 'ふむ、ずいぶんと手厳しい出迎えじゃのう。わしは研究主任のオルフェン・ノクスじゃ。', undefined, 'normal'),
  say('orphen', '六百年ほどこの谷で骨を休めておる。研究記録は見てよいが、現場の連中が心を許すとは思わんことじゃな。', undefined, 'serious'),
  say('poyon', 'あ、あの……培養と品質管理のポヨンです。よろしくお願いいたしますね。', undefined, 'sad'),
  narr('巨大な半透明のスライムが、申し訳なさそうに帽子を揺らした。その体の奥から、小さな青い個体がぽこんと飛び出した。'),
  say('pluru', 'ぷる？', undefined, 'surprised'),
  say('poyon', 'こら、プルル。……すみません、この子は試作体 No.000 です。私が世話を見ていますので、勝手に検査へ回さないでくださいね。', undefined, 'serious'),
  narr('ポヨンですら、プルルをあなたの前に隠すように抱え込んだ。だがプルルはすり抜けてあなたの靴に跳ね寄り、鞄にぴたりと貼りついた。'),
  cg('pluru_encounter'),
  fx('glow'),
  narr('プルルの体内の黄金の核が、鞄の中の『王の設計図』に反応してちかりと光った。慌てて鞄を引いた拍子に、書状の端から王家の封蝋が覗く。'),
  say('lisette', '……今の、王家の直轄封蝋ですね。', undefined, 'cold'),
  cg(null),
  choice(
    opt('「ただの引き継ぎ書類です」', [
      say('lisette', '第三書記室の監査官が、王家の封蝋を持つはずがありません。……まあいいでしょう。', undefined, 'cold'),
    ]),
    opt('「気のせいでしょう」', [
      say('lisette', '私は元・魔王城の侍従です。その紋章を見間違えることはありませんよ。', undefined, 'cold'),
    ]),
  ),
  say('lisette', 'あなたが本社の密偵として何を隠していようと構いません。ですが、ここで工場長を名乗るなら、現場の掟に従っていただきます。', undefined, 'serious'),
  say('lisette', '今日から五日間で、勇者軍の三兵種――剣士、弓兵、魔法使いを想定した模擬戦テストを三回行います。', undefined, 'serious'),
  say('lisette', '一つでも突破できなければ『現場指揮能力なし』として、私たちの連名で宰相府へ送還要求を出します。', undefined, 'cold'),
  say('lisette', 'あなたの寝床ですか？　宿舎の空き部屋は療養個体用です。一階の古い資料室に毛布を置いておきましたので、そちらを使ってください。', undefined, 'cold'),
  narr('誰もあなたの荷物を持とうとはしなかった。冷え切った工場の中で、プルルだけが不思議そうにあなたを見上げていた。'),
];

const designIntro: Scene = [
  bg('lab'),
  say('orphen', 'では、最低限の手順だけ教えておこう。魔物を造るには、二つの材料を共鳴させるのじゃ。', undefined, 'serious'),
  say('vargas', '材料庫で今使えるのは、鉄くず、亡霊の灯、竜の血の三つだ。無駄遣いするんじゃねえぞ。', undefined, 'cold'),
  say('orphen', '鉄と亡霊なら粘り強い鎧、鉄と竜の血なら重い一撃を持つ巨人が生まれる。剣士の盾を割るなら後者が向くじゃろうな。', undefined, 'normal'),
  say('lisette', '配合台で材料を二つ選び、製造ラインへ流してください。完成したら格納庫から模擬戦へ出撃させます。', undefined, 'cold'),
  say('vargas', '反応しねえ組み合わせを無理に流して形成輪を傷つけたら、即座に手を引いてもらうからな。', undefined, 'angry'),
  say('orphen', '固有技は三回目の行動で放たれる。また、通常技の順番も格納庫で組み替えられるぞ。……では、お手並み拝見といこうか。', undefined, 'normal'),
];

const birth: Scene = [
  bg('floor'),
  narr('培養槽の薬液が排出され、生まれたばかりの個体がガラスの向こうで小さく震えながら目を開けた。'),
  cg('first_birth', '培養槽から現れた最初の命と、思わず差し出した乾いた布'),
  narr('足元がおぼつかない個体が搬出口で膝をつきかけた瞬間、あなたは考えるより先に駆け寄り、備え付けの乾いた布でその肩を支えていた。'),
  say('poyon', 'あ……！　ありがとうございます、まだ体温が安定していなくて……。', undefined, 'surprised'),
  say('pluru', 'ぷるぷる！', undefined, 'smile'),
  cg(null),
  say('vargas', '……おい、何やってんだ書記官。撫でた程度でいい上司ぶるんじゃねえよ。', undefined, 'cold'),
  say('vargas', '形成輪の数値は正常だ。お前がベタベタ触ると調整が狂う、さっさと格納庫へ回せ。', undefined, 'cold'),
  say('lisette', '個体の登録を済ませました。準備ができ次第、模擬戦を開始してください。', undefined, 'cold'),
];

const swordLoss: Scene = [
  bg('floor'),
  say('vargas', '……戻ってきたぞ！　ほら見ろ、机の上の計算だけで生き物を戦わせるからこうなるんだ！', undefined, 'angry'),
  say('lisette', '剣士の盾は通常攻撃を軽減します。盾を貫く火力か、固有技まで耐える構成が必要です。', undefined, 'cold'),
  narr('あなたは無言で報告書を受け取ると、『製造・指揮責任者』の欄に現場職人の名ではなく自分の名前だけを書いた。'),
  choice(
    opt('「私の設計ミスです。先にこの子の手当てをお願いします」', [
      say('poyon', '……はい。すぐ療養槽へ運びますね。', undefined, 'sad'),
    ]),
    opt('「被弾箇所の記録をすべて残します。次は必ず直します」', [
      say('orphen', 'ほう、自分の失態を消さずに書き残すか。鉄くずと竜の血の配合も試してみたまえ。', undefined, 'serious'),
    ]),
  ),
  narr('あなたが傷ついた個体の担架の片側を持ち上げると、バルガスは忌々しそうに舌打ちしながらも反対側を持ち上げた。'),
  say('vargas', '……勘違いするなよ。こいつが重いから手伝うだけだ。お前を許したわけじゃねえ。', undefined, 'cold'),
];

const swordWin: Scene = [
  bg('floor'),
  say('vargas', '……戻ってきたか。', undefined, 'normal'),
  when('lostFirst', [
    say('orphen', '前回の敗因を記録から直しおったな。理に適った改修じゃ。', undefined, 'smile'),
    say('vargas', 'ふん、一度負けた尻拭いをしただけだろうが。', undefined, 'cold'),
  ], [
    say('orphen', 'ほほう、初戦から剣士の盾を割りおったか。', undefined, 'surprised'),
    say('vargas', 'まぐれで訓練人形に一度勝ったくらいで、鼻を高くするんじゃねえぞ。材料を揃えたのは俺たちだ。', undefined, 'cold'),
  ]),
  narr('あなたは勝利の報告欄だけでなく、個体が盾に弾かれた回数と関節の摩耗箇所を細かく記入してリゼットへ提出した。'),
  say('lisette', '……第一試験の通過を確認しました。', undefined, 'cold'),
  say('lisette', '勝ったのに損耗箇所まで細かく書かれるのですね。前任の方々は合格印を押させて終わりでしたが。', undefined, 'serious'),
  say('lisette', 'もっとも、これしきのことで私たちがあなたを信用したとは思わないでください。作業会議も、私たちだけで行います。', undefined, 'cold'),
];

const eveningLisette: Scene = [
  bg('roof'),
  clear,
  narr('一日目の夜。宿舎の部屋を与えられなかったあなたは、暖房のない資料室の隅で毛布を被る前に、外の空気を吸おうと屋上へ上がった。'),
  narr('そこには、一人で帳簿を検算していたリゼットの姿があった。彼女はあなたに気づくと、すっと表情を消した。'),
  say('lisette', '……資料室は寒かったですか。あいにく、本社の監査官をおもてなしする予算はありませんので。', undefined, 'cold'),
  say('lisette', '今日の報告書、現場の責任にしなかったことだけは記録しておきます。……ですが、一つだけ聞かせてください。', undefined, 'serious'),
  say('lisette', '私は三年前まで魔王城の侍従でした。灰冠平原の会戦の後、陛下への拝謁を何度も願い出て……翌日にこの辺境へ飛ばされました。', undefined, 'sad'),
  say('lisette', '昼間、あなたの鞄から見えた王家の封蝋。宰相府の第三書記室にいたあなたなら、城の奥で何が起きているか知っているはずです。', undefined, 'serious'),
  choice(
    opt('「……何も知りません」', [
      say('lisette', '……そうですか。目を逸らさずに嘘をつけるのは、立派な官僚の資質ですね。', undefined, 'cold'),
    ], 'deniedToLisette'),
    opt('「……今はまだ、言えません」', [
      say('lisette', '知らないのではなく、私たちには言えない、と。……結構です、少なくとも正直な拒絶ですね。', undefined, 'cold'),
    ], 'promisedLisette'),
  ),
  say('lisette', '覚えておいてください。あなたが本社の秘密を抱えたままこの工場を踏み台にするつもりなら、私は全力であなたを追い出します。', undefined, 'angry'),
  narr('リゼットは帳簿を抱え、足音だけを響かせて階段を降りていった。'),
];

const archerBrief: Scene = [
  bg('floor'),
  title('三日目', '二人目の試験'),
  say('lisette', '三日目の模擬戦テストを開始します。相手は弓兵。速度が6以上遅い個体は、1巡に2回射られます。', undefined, 'cold'),
  say('vargas', '定期便で『古樹の種』と『月光の雫』が届いた。言っとくが、材料棚を勝手に引っ掻き回すなよ。使う分だけ申請しろ。', undefined, 'cold'),
  say('orphen', '重い鉄の身体では矢の雨に追いつけん。古樹の種と竜の血を共鳴させれば、軽やかに跳ねる獣が生まれるじゃろう。', undefined, 'normal'),
  say('poyon', '種と亡霊の灯でも新しい子が誕生しますが、そちらは持久戦向けで足は速くありません。相手に合わせて選んであげてくださいね。', undefined, 'normal'),
  say('vargas', '……ふん、頭でっかちの書記官がどこまで対応できるか、見物だな。', undefined, 'cold'),
];

const archerLoss: Scene = [
  bg('floor'),
  say('vargas', '言わんこっちゃねえ！　鈍重な個体をそのまま出して蜂の巣にしやがって！', undefined, 'angry'),
  say('orphen', '弓兵の速度は14じゃ。こちらの速度が9以上あれば追撃は防げる。古樹の種と竜の血を試すか、疾風撃・守勢打を組み込むのじゃ。', undefined, 'serious'),
  say('vargas', '傷ついた奴の手当てが先だ。どけ、洗浄槽へ運ぶぞ！', undefined, 'angry'),
];

const archerWin: Scene = [
  bg('floor'),
  say('lisette', '……第二試験、突破を確認しました。速度差による二連射を封じた判断は妥当です。', undefined, 'cold'),
  say('vargas', 'ふん、オルフェンの助言どおりに材料を混ぜただけだろうが。', undefined, 'cold'),
  say('vargas', '格納庫に二体並んだからって、工場長気取りで歩き回るなよ。まだ試験は一つ残ってるんだ。', undefined, 'cold'),
];

const eveningVargas: Scene = [
  bg('workshop'),
  clear,
  narr('三日目の深夜。昼間の模擬戦で個体の装甲に生じた微細な歪みの測定表を届けようと、あなたは作業場の扉を叩いた。'),
  narr('中では、バルガスが炉の残り火に照らされながら、角の穴が二つ空いた小さな古い兜を布で磨いていた。'),
  say('vargas', '……おい！　誰が作業場に入っていいと言った！', undefined, 'angry'),
  fx('shake'),
  say('vargas', 'ここは俺たち職人の場所だ！　本社の人間が夜中に嗅ぎ回るんじゃねえ、さっさと出ていけ！', undefined, 'angry'),
  narr('怒鳴り声に足を止めながらも、あなたは手にしていた『帰還個体の関節負荷と装甲摩耗の計測記録』を作業台の端に置いた。'),
  say('vargas', '……なんだその紙は。嫌がらせの監査書類か？', undefined, 'cold'),
  say('vargas', '……待て。これ、今日戦った個体の傷の角度を、一箇所ずつ手で測ったのか？　お前が一人で？', undefined, 'surprised'),
  narr('バルガスは紙を睨みつけたまま、しばらく黙り込んだ。それから、磨いていた小さな兜へ視線を落とした。'),
  say('vargas', '……三年前の会戦で、俺の部下だった若いミノタウロスが被ってた兜だ。', undefined, 'sad'),
  say('vargas', '本社の書類じゃ、あいつらの死は『損耗数・一』の数字だけで片付けられた。名前すら載らなかった。', undefined, 'sad'),
  say('vargas', '名前を一人ずつ読み上げたのは、炎将ガルドランだけだ。あいつは、まだ戦場にいる。', undefined, 'serious'),
  choice(
    opt('「私の記録には、戦った子たちの傷も名前もすべて残します」', [
      say('vargas', '……口だけならなんとでも言えるぜ。本番の戦場が来たとき、お前がその言葉を貫けるか見てやるよ。', undefined, 'serious'),
    ]),
    opt('黙って一礼し、作業場を後にする', [
      say('vargas', '……ちっ。妙な書記官だ。……置いた紙は、あとで読んどいてやる。', undefined, 'serious'),
    ], 'satWithVargas'),
  ),
];

const mageBrief: Scene = [
  bg('floor'),
  title('五日目', '最終試験'),
  say('lisette', '本日が最終試験です。相手は冷気を操る魔法使い。一撃が重く、熱を持つ個体に特効を持ちます。', undefined, 'cold'),
  say('poyon', '竜の血を使った子は、冷気を浴びると10も余計に傷ついてしまいます。それに、亡霊の灯の再生や回復技も凍りついて止まってしまいます……。', undefined, 'sad'),
  say('vargas', '最後の入荷分、『星ガラス』を出しておいた。これをどう使うかが、お前の最後の試験だ。', undefined, 'serious'),
  say('orphen', '星ガラスと亡霊の灯なら冷気に耐える浮遊体、星ガラスと月光の雫なら氷の詠唱より速く懐へ飛び込む狼が生まれるぞ。', undefined, 'normal'),
  say('lisette', 'これに勝てば送還要求は取り下げます。……ですが、負ければ明日の朝には荷馬車に乗っていただきます。', undefined, 'cold'),
];

const mageLoss: Scene = [
  bg('floor'),
  say('poyon', 'あぁ、冷気で体が凍りついて……！　早く温かい薬液をかけてあげないと！', undefined, 'surprised'),
  say('orphen', '竜の血の熱は冷気と相性が悪く、再生も封じられる。星ガラスと亡霊の灯、あるいは星ガラスと月光の雫で冷気対策を組むのじゃ。', undefined, 'serious'),
];

const mageWin: Scene = [
  bg('floor'),
  say('poyon', 'よかった……冷気に負けずに帰ってきてくれましたね！', undefined, 'smile'),
  say('lisette', '……三つの模擬戦テスト、すべて合格です。約束は守ります、宰相府への送還申請は破棄しましょう。', undefined, 'serious'),
  say('vargas', 'だがな、勘違いするんじゃねえぞ。', undefined, 'cold'),
  say('vargas', '模擬戦は所詮、安全装置付きの試験だ。俺たちはまだ、あんたを俺たちの『工場長』だと認めたわけじゃねえ。', undefined, 'cold'),
  say('lisette', 'ええ。あなたが本社の方を向いて仕事をしているうちは、私たちは一線を引かせていただきます。', undefined, 'cold'),
  narr('三つの試験をすべて突破しても、二人の壁は依然として高かった。'),
];

const eveningOrphen: Scene = [
  bg('lab'),
  clear,
  narr('五日目の夜。誰もいない研究フロアで記録を整理していると、オルフェンとポヨン、そしてプルルが入ってきた。'),
  say('poyon', '工場長さん、お疲れさまです。……あの、初日は警戒してしまってごめんなさい。', undefined, 'sad'),
  say('poyon', '前の管理官さんたちは、模擬戦で傷ついた子をすぐ廃棄しようとなさったので……あなたが毎回、搬出口で布を持って待っていてくださるのを見て、少しだけ安心したんです。', undefined, 'smile'),
  say('orphen', 'リゼットもバルガスも、これまで本社に散々裏切られてきたからのう。口先では絶対に動かん連中じゃ。', undefined, 'serious'),
  say('orphen', '……ところで工場長。お前さんが初日から肌身離さず抱えておるその鞄、プルルが妙に懐いておるな。', undefined, 'normal'),
  say('pluru', 'ぷる……。（プルルはあなたの鞄に頬を寄せている。）', undefined, 'normal'),
  choice(
    opt('「ただの業務書類です」', [
      say('orphen', 'ふむ。まだわしらにも明かせぬか。まあよい、無理にとは言わん。', undefined, 'normal'),
    ]),
    opt('「……いつか、みんなに話せる日が来たら聞いてください」', [
      say('orphen', 'ほほう。その日が来るまで、この工場が生き残っておればよいがな。', undefined, 'serious'),
    ], 'askedOrphen'),
  ),
  fx('shake'),
  narr('その時――谷全体を劈くような非常鐘が乱打された！'),
  bg('floor'),
  fx('shake'),
  say('lisette', '緊急事態です！！　渓谷の見張り台から狼煙が上がりました！', undefined, 'surprised'),
  say('vargas', 'なんだと！？　勇者軍の先遣隊は、あと二日は来ないはずだっただろうが！', undefined, 'angry'),
  say('lisette', '騎士団長グレイヴ・ハルト麾下の先遣部隊が、強行軍で谷の街道を封鎖しました！　本社からの補給馬車はすべて追い返され、通信路も断たれています！', undefined, 'surprised'),
  say('vargas', 'くそっ、外門の補強もまだ終わってねえのに、完全な孤立無援じゃねえか！', undefined, 'angry'),
  say('vargas', 'おい書記官！　逃げるなら今のうちに裏山の獣道から一人で逃げろ！　ここから先は、書類仕事じゃ済まねえ本物の戦場だ！', undefined, 'angry'),
  narr('まだ誰にも認められていないよそ者の工場長に、最大の試練が牙を剥いた。'),
  bg('black'),
  title('第1章', '完'),
];

// ---- 第2章「孤立無援の防衛戦」（6〜8日目） ----

const ch2CrisisIntro: Scene = [
  bg('black'),
  title('第2章', '孤立無援の防衛戦'),
  bg('gate'),
  fx('shake'),
  cg('gate_defense', '退路を断たれた渓谷の門と、雨の中を進軍する勇者軍先遣部隊'),
  narr('六日目の未明。激しい雨が叩きつける中、谷の入口には勇者軍の蒼い軍旗がずらりと並んでいた。'),
  say('lisette', '本社からの救援は望めません。外門が破られれば、製造フロアまで一気に押し込まれます……！', undefined, 'surprised'),
  fx('flash'),
  say('zelva', '救援は出さぬ。兵を動かせば、ガルドランに知れる。門を死守せよ、記録係。', undefined, 'cold'),
  say('vargas', '……今の声、宰相閣下か。俺たちの門が燃えても、城は動かねえってわけだ。', undefined, 'angry'),
  say('vargas', 'ちくしょう、外門の昇降鎖が錆びついて途中で引っかかってやがる！　俺が外へ出て手動でカンヌキを落とす！', undefined, 'angry'),
  say('lisette', '無茶ですバルガスさん！　すでに敵の前衛剣士が門のすぐ下まで迫っています！', undefined, 'surprised'),
  cg(null),
  narr('誰もが動転する中、あなたは裏山へ逃げるどころか、雨合羽も羽織らずに正門の司令席へと駆け上がった。'),
  choice(
    opt('「バルガスさんが鎖を外すまでの時間を、私の個体で稼ぎます！」', [
      say('vargas', 'なっ……お前、逃げなかったのか！？', undefined, 'surprised'),
    ]),
    opt('「一匹も使い捨てません。門も、工場のみんなも私が守ります！」', [
      say('lisette', '工場長……！？　本気ですか、相手は実戦の騎士です！', undefined, 'surprised'),
    ]),
  ),
  say('orphen', 'ほほう、逃げ出すどころか一番危ない門の上に立つとはな。気に入ったぞ！', undefined, 'smile'),
  say('lisette', '……分かりました！　正面の剣士を食い止めてください、その隙に外門の鎖を落とします！', undefined, 'serious'),
];

const ch2Skirmish1Win: Scene = [
  bg('gate'),
  fx('shake'),
  narr('あなたの個体が前衛の剣士を弾き飛ばした瞬間、バルガスが渾身の力で大鎖を引き抜き、外門の鉄格子が轟音とともに降りた！'),
  say('vargas', 'ぐあああっ……！　よし、門は閉まったぞ！', undefined, 'angry'),
  say('poyon', 'バルガスさん、右肩から血が……！　鎖の反動で傷が開いています！', undefined, 'surprised'),
  bg('workshop'),
  narr('その夜。右肩を痛めたバルガスに代わって、あなたは蒸気弁の固定ハンドルを握り、油と泥にまみれながら夜通し圧力調整を手伝った。'),
  say('vargas', '……おい、書記官。お前の手、慣れねえ工具を握りすぎて血豆が潰れてるぞ。', undefined, 'surprised'),
  say('vargas', '本社の連中はな、現場が危なくなると真っ先に書類だけ抱えて馬車で逃げたんだ。……なんでお前は残って泥をかぶってやがる。', undefined, 'serious'),
  choice(
    opt('「ここの工場長に任命されたのは、私ですから」', [
      say('vargas', '……ふん。変なところで意地を張る奴だ。……包帯、そこの棚にあるから巻いとけ。', undefined, 'normal'),
    ]),
    opt('「生まれたばかりの子たちを置いて、逃げられるわけがありません」', [
      say('vargas', '……そうかよ。……少しだけ、見直したぜ。ほんの少しだがな。', undefined, 'smile'),
    ]),
  ),
];

const ch2Skirmish2Brief: Scene = [
  bg('floor'),
  title('七日目', '換気塔の死闘'),
  fx('shake'),
  say('lisette', '大変です！　正門を閉ざされた敵の高速弓兵部隊が、崖の上を回り込んで『第二換気塔』を狙っています！', undefined, 'surprised'),
  say('vargas', 'くそっ、換気塔を射抜かれたら培養槽の温度が暴走しちまう！　だが俺の肩じゃ、今から屋根へ登っても間に合わねえ……！', undefined, 'angry'),
  narr('その時、あなたは資料室で寝泊まりしていた間に読み込んだ『八十年前の旧配管図』を広げた。'),
  say('orphen', 'おお、それは創設時の旧図面じゃな！　……そうか、第三隔壁を閉じれば煙突の熱気を逸らし、迎撃用の足場を作れる！', undefined, 'surprised'),
  say('lisette', '資料室に押し込められていた間に、古い図面をすべて頭に入れていたのですか……！？', undefined, 'surprised'),
  say('lisette', '隔壁の操作は私がやります！　工場長、格納庫から素早い個体を選んで弓兵を迎え撃ってください！', undefined, 'serious'),
];

const eveningPoyon: Scene = [
  bg('tank'),
  clear,
  narr('七日目の夜。換気塔への奇襲を退けたあと、あなたは培養フロアに残り、傷ついた個体たちの洗浄と手当てを遅くまで手伝っていた。'),
  narr('そこへ、リゼットが湯気の立つマグカップを二つ持って静かに歩み寄ってきた。'),
  say('lisette', '……温かい薬草茶です。少しは休んでください、目の下に隈ができていますよ。', undefined, 'normal'),
  say('lisette', '……初日に『どうせ逃げ帰る』と言ったこと、謝罪します。あなたは少なくとも、現場を見捨てる方ではありませんでした。', undefined, 'sad'),
  say('poyon', 'ふふ、リゼットさんが本社の人に自分からお茶を淹れるなんて、初めて見ましたよ。', undefined, 'smile'),
  say('lisette', 'ポヨン、余計なことは言わなくてよろしい。……明日の朝、敵の本隊が正門へ最後の総攻撃を仕掛けてきます。どうかよろしくお願いしますね。', undefined, 'serious'),
  clear,
  narr('リゼットが去った後、ポヨンが眠っているプルルを優しく撫でながらつぶやいた。'),
  say('poyon', 'ときどき、夢の中で知らない声を思い出すんです。低くて、大きくて、少し寂しそうな声で……『この子を頼む』って。', undefined, 'sad'),
  say('poyon', 'あなたがこの子や生まれた子たちを大事にしてくださるのを見ていると、あの声の約束が守られている気がするんです。……おやすみなさい、工場長さん。', undefined, 'smile'),
];

const raidIntro: Scene = [
  bg('black'),
  title('八日目', '総攻撃'),
  bg('gate'),
  fx('shake'),
  say('captain', '魔物工場の者に告ぐ！　騎士団長グレイヴ・ハルトの名において、これより正門を突破し谷を制圧する！', undefined, 'angry'),
  say('vargas', '剣士、弓兵、魔法使いの精鋭が三段構えで押し寄せてきやがった！　外門が持つのもあとわずかだ！', undefined, 'angry'),
  say('vargas', 'おい、昨日までのよそ者扱いは今日で終わりだ。正門の指揮はあんたに全部預ける！', undefined, 'serious'),
  say('lisette', '補給路の遮断も、換気塔の危機も、あなたの判断で乗り越えました。最後の一戦も、あなたの采配に従います！', undefined, 'serious'),
  say('orphen', '相手は一人ずつ順番に出てくる。格納庫から相手に合わせた個体を選んで送り出すのじゃ！', undefined, 'serious'),
];

const raid1: Scene = [
  bg('gate'),
  say('vargas', 'よし、先鋒の剣士を吹っ飛ばしたぞ！　あんたの図面どおりだ！', undefined, 'smile'),
  say('lisette', '続けて二番手、高速弓兵が出ます！　格納庫から個体を選び直してください！', undefined, 'serious'),
];

const raid2: Scene = [
  bg('gate'),
  say('lisette', '二人目も突破！　こちらの個体はまだ一匹も欠けていません！', undefined, 'smile'),
  say('orphen', '残るは隊長直属の氷結魔導師のみじゃ。冷気に耐える個体で止めを刺すぞ！', undefined, 'serious'),
];

const raidLoss: Scene = [
  bg('gate'),
  say('lisette', 'まだ門は持ちます！　一度個体を引かせましょう、設計と技構成を見直してください！', undefined, 'serious'),
  say('vargas', '作り直す時間くらい、俺が蒸気槌を振り回してでも稼いでやる！　諦めるんじゃねえぞ！', undefined, 'angry'),
];

const victory: Scene = [
  bg('gate'),
  say('poyon', '三人とも退けました……！　それに、出撃した子たちも全員無事に帰ってきましたよ！', undefined, 'smile'),
  say('captain', 'くっ……退け、全軍撤退だ！　第七工場は死んでなどいない、手強い指揮官と新型の魔物が揃っていると本隊へ報告する！', undefined, 'surprised'),
  clear,
  narr('勇者軍の先遣部隊は、谷の外へと完全に引き上げていった。'),
  bg('floor'),
  narr('歓声が静まった製造フロアで、バルガスが歩み寄り、新品の点検用革手袋をあなたの胸にドンと押しつけた。'),
  say('vargas', '……悪かったな。初日から『本社の書記官』だの『紙切れ』だの、散々悪態をついてよ。', undefined, 'sad'),
  say('vargas', 'あんたが血豆を作ってまでラインを守り、一匹も使い捨てずに戦い抜いたのはこの目で見た。……明日からの設備点検も立ち会えよ、工場長。', undefined, 'smile'),
  narr('バルガスは初めて、あなたを『工場長』と呼んだ。'),
  say('lisette', '……私も、初日の言葉を撤回させてください。資料室ではなく、今日から二階の工場長室を使っていただいて構いません。', undefined, 'smile'),
  say('lisette', 'まだすべてを打ち明けてくださったわけではありませんが……あなたがこの工場の味方であることだけは、疑いませんから。', undefined, 'smile'),
  say('pluru', 'ぷるっ！', undefined, 'smile'),
  narr('プルルがあなたの足元で嬉しそうに跳ね、小さな体を精一杯伸ばした。'),
  say('pluru', '……こうじょう、ちょう。', undefined, 'smile'),
  fx('shake'),
  say('vargas', 'おい、今プルルがしゃべったか！？', undefined, 'surprised'),
  say('poyon', 'まあ……！　この子が誰かの言葉を真似したの、生まれて初めてです！', undefined, 'smile'),
  clear,
  narr('初めて工場に温かい笑いが広がった――その時だった。封鎖が解けた街道から、本社の急使の伝書鳩が飛び込んできた。'),
  say('lisette', '……本社からの緊急通達です。読み上げます。', undefined, 'serious'),
  say('lisette', '「第七工場の防衛成功を確認。追って、本社監察官ヴェラ・アークライトを派遣する」', undefined, 'serious'),
  say('lisette', '「ならびに、極秘計画に伴う『特別資材』、先代の右角を送付する。納期まで残り九十二日。受領および開封は、工場長本人に限る」', undefined, 'cold'),
  narr('せっかく和らいだフロアの空気が、一瞬にして凍りついた。リゼットとバルガスの視線が、あなたの鞄に落ちる。'),
  when('promisedLisette', [
    say('lisette', '……工場長。初日の夜、『今はまだ言えない』とおっしゃいましたね。ようやくあなたを信じられた今なら、この特別資材が何なのか話してくださいますよね？', undefined, 'serious'),
  ], [
    when('deniedToLisette', [
      say('lisette', '……『何も知らない』とおっしゃっていましたよね、工場長。極秘計画の特別資材が、なぜあなた宛てに届くのですか。', undefined, 'cold'),
    ], [
      say('lisette', '……工場長。ようやく私たちの仲間になってくださったのですから、隠し事はなさらないでくださいね。', undefined, 'serious'),
    ]),
  ]),
];

const night: Scene = [
  bg('lab'),
  clear,
  narr('八日目の深夜。静まり返った研究フロアで、あなたは初めて宰相ゼルヴァの封書を開いた。'),
  narr('机の端には、バルガスがくれた新品の革手袋と、リゼットが淹れてくれた茶器の跡がある。その隣に広げられたのは、一枚の白紙。'),
  narr('――表題にだけ『王の設計図』と記された遺品だった。'),
  narr('気配がして顔を上げると、プルルが設計台の上に登ってきていた。白紙の設計図に触れた瞬間、体内の黄金の核が強く脈打つ。'),
  fx('glow'),
  say('pluru', '……玉座は、空のままで　いい。', undefined, 'sad'),
  narr('低く、大きく、どこか寂しげな声だった。'),
  narr('三年前に崩御した先代魔王ヴォルグラム本人の声が、プルルの核に録音されていたのだ。'),
  say('orphen', '……今、誰がしゃべったのじゃ。', undefined, 'surprised'),
  narr('振り返ると、扉の影にオルフェンが立っていた。そして明日の朝には、本社の監察官ヴェラが『特別資材』を持ってこの谷へやってくる。'),
  narr('せっかく得たばかりの仲間たちの信頼が、最大の嵐に晒されようとしていた。'),
  bg('black'),
  title('第2章', '完'),
];

export const chapter1 = {
  arrival,
  designIntro,
  birth,
  swordLoss,
  swordWin,
  eveningLisette,
  archerBrief,
  archerLoss,
  archerWin,
  eveningVargas,
  mageBrief,
  mageLoss,
  mageWin,
  eveningOrphen,
  ch2CrisisIntro,
  ch2Skirmish1Win,
  ch2Skirmish2Brief,
  eveningPoyon,
  raidIntro,
  raid1,
  raid2,
  raidLoss,
  victory,
  night,
} as const;
