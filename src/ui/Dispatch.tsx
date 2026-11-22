import { useRef, useState } from 'react';
import { Inspection, type Spot } from '../three/inspection';
import { Canvas3D } from './common';
import './dispatch.css';

const locations: Record<Spot,string>={overview:'工場全景',desk:'検品ゲート',switch:'柱の根元',lamp:'検品灯'};
export function Dispatch({close}:{close:()=>void}){
  const scene=useRef<Inspection|null>(null);
  const [spot,go]=useState<Spot|null>(null),[low,crawl]=useState(false);
  const [overview,showOverview]=useState(false);
  const [marks,record]=useState<string[]>([]);
  const [text,say]=useState('夜勤班長「三回とも、止まったのは幼体が通るときだ。朝までに理由を調べてくれるか」');
  const [ending,end]=useState('');
  const [shade,cover]=useState(false);
  function inspect(){
    const evidence=spot==='switch' && low?'switch':spot==='lamp' && low?'eyes':spot==='desk'?'log':'';
    if(evidence && !marks.includes(evidence)) {record([...marks,evidence]);if(spot)scene.current?.found.add(spot);}
    say(evidence==='log'?'記録紙には三つの手動停止。どれも同じ検品ゲート。故障を示す印字は一つもない。':evidence==='switch'?'プルルが柱の隙間にするりと入る。低い停止ボタンには、小さな掌の油跡が幾重にも重なっている。':evidence==='eyes'?'灯りの真下でだけ幼体の目が細く閉じる。プルルの高さからは、検品灯の裸電球が真正面に見えた。':spot==='switch'?'柱の裏に赤いものが見える。手を伸ばしても、その奥までは届かない。':'上から見ると、明るさは他の検品台と同じに見える。');
  }
  return <main className="dispatch"><header><button onClick={close}>戻る</button><h1>誰も押していない停止ボタン</h1></header><section>
    {ending?<><img className="incident-art" src="/assets/cg/factory_morning.png" alt="朝の工場"/><h2>翌朝の申し送り</h2><p>{ending}</p><button className="primary" onClick={close}>調査を終える</button></>:<>
    <h2>{overview?'工場全景':spot?locations[spot]:'検品棟を歩く'}</h2>
    <p>{overview?'ドラッグで回転、スクロールで拡大。':'床をタップするか、現場をクリックして矢印キー・WASDで歩きます。金色に光る印が調査地点です。'}</p>
    <Canvas3D className="workline-view" create={host=>new Inspection(host)} onReady={s=>{scene.current=s;if(s)s.onNear=id=>{go(id);crawl(false);};}}/>
    <nav aria-label="現場の移動"><button onClick={()=>{showOverview(!overview);if(scene.current)scene.current.overview=!overview;}}>{overview?'歩行に戻る':'工場全景'}</button>
    {(['desk','switch','lamp'] as const).map(id=><button key={id} onClick={()=>{showOverview(false);crawl(false);if(scene.current)scene.current.low=false;scene.current?.approach(id);say(locations[id]+'へ向かう。');}}>{locations[id]}まで歩く</button>)}</nav>    {spot && !overview && <div className="dispatch-controls"><button aria-pressed={low} onClick={()=>{crawl(!low);if(scene.current)scene.current.low=!low;say(low?'立ち上がってラインを見渡した。':'プルルが体を薄くして潜り込む。床すれすれの景色が広がった。');}}>{low?'作業員の目線へ':'プルルと潜る'}</button><button className="primary" onClick={inspect}>ここを調べる</button></div>}
    <p role="status">{text}</p><small>調査手帳　{marks.map(m=>({log:'手動停止の記録',switch:'ボタンの掌跡',eyes:'灯りの下で閉じる目'})[m]).join(' ／ ')||'まだ白紙'}</small>
    {marks.length===3 && <div><h3>現場で確かめる</h3><button onClick={()=>say('搬送速度を落としても、灯りの下で幼体はぎゅっと目を閉じた。班長が速度を元に戻す。')}>搬送速度を落とす</button> <button onClick={()=>{cover(true);if(scene.current){scene.current.shade=true;scene.current.low=spot==='lamp';}crawl(spot==='lamp');say('班長の帽子をひさしにすると、幼体が目を開けたまま通った。「そうか。あの子が目を開けるまで、誰かが止めてくれてたんだな」');}}>検品灯にひさしを付ける</button></div>}
    {shade && <div><h3>朝の班に何を残す？</h3><button onClick={()=>end('図面に「幼体の目の高さ」を書き込んだ。朝番の工具箱から、帽子と同じ角度に曲げた真鍮板がのぞいている。')}>ひさしの図面を残す</button> <button onClick={()=>end('朝番を一人ずつプルルの横に案内した。昼過ぎには隣のラインでも、背の高い作業員が膝をついて灯りを確かめていた。')}>朝番をプルルの目線に案内する</button></div>}
    </>}</section></main>;
}
