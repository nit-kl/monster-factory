import type { StaffId } from './staff';
import type { ScreenId } from './screens';
type Conversation={title:string;lines:readonly string[];action:{label:string;screen:ScreenId}};
// Draft dialogue proposals. No new lore or story outcomes are established here.
export const conversations:Record<StaffId,Conversation>={
 lisette:{title:'最初の仕事',lines:['第七工場へようこそ。私は副工場長のリゼットです。まずは設計台で、身体と二つの器官を選んでください。','設計ができたら製造です。完成した個体を模擬戦に出して、何が起きたか記録を確認しましょう。','強い器官を載せるだけでは、うまくいきません。失敗した理由が分かれば、次の設計に生かせます。'],action:{label:'設計台へ向かう',screen:'design'}},
 vargas:{title:'丈夫さにも代償がある',lines:['設備主任のバルガスだ。機械のことなら任せろ。……角は触るなよ。工具を引っ掛ける場所じゃねえ。','火炎袋を積むなら、熱への備えを忘れるな。石殻なら自分の炎から身を守れる。','ただし重くなるし、材料も余計に要る。丈夫にするだけで全部解決、とはいかねえんだ。設計台で速さも見てこい。'],action:{label:'防御器官を見直す',screen:'design'}},
 orphen:{title:'組み合わせこそ研究',lines:['ほう、新しい設計か。研究主任のオルフェンじゃ。器官を並べる前に、その働きを考えてみたまえ。','毒腺はじわじわ効く。再生核は傷を埋める。長く戦える身体に組み合わせれば、働きが見えてくるじゃろう。','結果は必ず記録するのじゃぞ。うまくいった時も、うまくいかなかった時もな。'],action:{label:'器官を組み合わせる',screen:'design'}},
 poyon:{title:'生まれた個体を見届ける',lines:['培養と品質管理を担当するポヨンです。新しい個体ができたら、性能を一緒に確認しましょうね。','製造を始めた時の設計で、その子は育ちます。途中で設計図を直しても、変わるのは次に作る子からですよ。','試して、確かめて、少しずつ。急がなくても大丈夫です。'],action:{label:'製造ラインを見る',screen:'factory'}},
 pluru:{title:'小さな見学者',lines:['ぷる？','（小さな青い体が伸びて、あなたの設計図をのぞき込む。体の中で黄金の核が揺れた。）','ぷる、ぷる！'],action:{label:'プルルと工場へ戻る',screen:'factory'}},
};
