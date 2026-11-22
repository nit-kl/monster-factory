import { Reading } from './Reading';
import { activeStaffIds, cast, type StaffId } from '../data/cast';
import { consultationReflection } from '../data/script';
import { dayOf } from '../domain/progress';
import { useGame } from '../state/store';
import { Thumb } from './Portrait';
import { useEffect, useState, type RefObject } from 'react';
import { type LineScene } from '../three/line';
import { type Stop } from '../three/factoryWalk';

const names = { bench: '配合台', tank: '培養槽', hangar: '格納庫' };

export function WalkControls({ scene, close, design, hangar }: {
  scene: RefObject<LineScene | null>; close: () => void; design?: () => void; hangar?: () => void;
}) {
  const [near, setNear] = useState<Stop | null>(null);
  const [inspect, setInspect] = useState(false);
  const [indoors,setIndoors]=useState(false);
  const day=useGame(s=>dayOf(s.progress));
  const staff=activeStaffIds(day);
  const [talk,setTalk]=useState<StaffId|null>(null);
  const [reply,setReply]=useState(false);
  const [destination,setDestination]=useState<Stop>('mainHall');
  const nearby=staff.find(id=>id===near);
  useEffect(() => {
    const walk = scene.current?.walk;
    if (!walk) return;
    walk.onNear = setNear;
    walk.onLocation=setIndoors;
    walk.setStaff(staff); walk.enable(true);
    const exit = (e: KeyboardEvent) => { if (e.key === 'Escape') { if(walk.talking){walk.talking=false;setTalk(null);} else close(); } };
    window.addEventListener('keydown', exit);
    return () => { walk.enable(false); walk.onNear = () => {}; walk.onLocation=()=>{}; window.removeEventListener('keydown', exit); };
  }, [scene, close, staff]);
  if(talk) return <section className="walk-controls panel" role="dialog" aria-label={cast[talk].name+'との会話'}>
    <Thumb id={talk}/><strong>{cast[talk].name}　<small>{cast[talk].role}</small></strong>
    <p><Reading text={reply ? consultationReflection(talk,day) : greetings[talk]} /></p>
    {!reply && <button onClick={()=>setReply(true)}>最近のことを聞く</button>}
    <button onClick={()=>{if(scene.current) scene.current.walk.talking=false;setTalk(null);}}>会話を終える</button>
  </section>;
  return <div className="walk-controls panel">
    <strong>{indoors?'中央製造棟・屋内':'魔王城・屋外工区'}</strong>
    <small>WASD・矢印で歩く ／ Q・Eまたはドラッグで見回す</small>
    <div role="group" aria-label="視点操作" hidden={inspect}>
      <button onClick={()=>scene.current?.walk.turn(Math.PI/4)}>左を向く</button>
      <button onClick={()=>scene.current?.walk.turn(Math.PI)}>振り返る</button>
      <button onClick={()=>scene.current?.walk.turn(-Math.PI/4)}>右を向く</button>
    </div>
    <nav aria-label="設備まで歩く">{(Object.keys(names) as (keyof typeof names)[]).map(stop =>
      <button key={stop} onClick={() => { setInspect(false); scene.current?.walk.visit(stop); }}><Reading text={names[stop]} />へ歩く</button>)}</nav>
    <div><select aria-label="工場の行き先" value={destination} onChange={e=>setDestination(e.target.value as Stop)}>
      <optgroup label="工区"><option value="mainHall">中央製造棟・中央の通路</option><option value="workshop">機械の整備室</option><option value="west">西の煙突</option><option value="east">東の蒸留塔（じょうりゅうとう）</option></optgroup>
      <optgroup label="働いている仲間">{staff.map(id=><option key={id} value={id}>{cast[id].name}（{cast[id].role}）</option>)}</optgroup>
    </select><button onClick={()=>{setInspect(false);scene.current?.walk.visit(destination);}}>そこまで歩く</button></div>
    {nearby && <button className="primary" onClick={()=>{if(scene.current) scene.current.walk.talking=true;setTalk(nearby);setReply(false);}}>{cast[nearby].name}と話す</button>}
    {near === 'tank' && <button className="primary" onClick={() => { if (scene.current) scene.current.walk.inspect = !inspect; setInspect(!inspect); }}>{inspect ? '通路の視点へ' : '培養槽をのぞく'}</button>}
    {near === 'bench' && design && <button className="primary" onClick={design}>材料を配合する</button>}
    {near === 'hangar' && hangar && <button className="primary" onClick={hangar}>格納庫を開く</button>}
    <button onClick={()=>{setInspect(false);scene.current?.walk.visit(indoors?'forecourt':'mainHall');}}>{indoors?'屋外に出る':'中央製造棟に入る'}</button>
    <button onClick={close}>探索を終える</button>
  </div>;
}


const greetings: Record<StaffId,string> = {
  lisette:'巡回ですか。排水溝の蓋が浮いていたら、場所を私に教えてください。',
  vargas:'この弾み車を見てくれ。回転がぶれなくなるまで、軸受けを何度も削り直したんだ。',
  orphen:'ここの配管だけ冷たいでしょう。培養液が槽へ戻る直前に熱を逃がしているんです。',
  poyon:'ぽよ。……ぽよよ！　培養槽の泡に合わせて、体を弾ませている。',
  pluru:'……こつ、こつ。プルルが格子の上を跳ねて、こちらの足音をまねた。',
  mimi:'床が鳴るところ、あの子たちは上手によけるんですよ。毎日歩いて覚えたみたい。',
  arachnea:'ちょっと耳を貸して。この軸だけ、一回転に一度、小さく鳴るの。',
  gradius:'ここから眺めておると、小さな歯車ひとつにも持ち場があるとわかる。',
  vera:'交代時刻と圧力計の値を照合しています。現場でしか拾えない数字もありますから。',
  noah:'この通路なら担架が曲がれます。夜勤のうちに搬送経路を歩いておきたくて。'
};




