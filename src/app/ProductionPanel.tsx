import { processes } from '../data/processes';
import { useEffect,useState } from 'react';
import { useGameStore } from '../state/store';
import { jobProgress } from '../domain/factory/manufacture';
import { bodies,attacks,defenses } from '../domain/monsters/design';
export function ProductionPanel(){
 const {job,latest,produced,finishProduction,setScreen}=useGameStore();const [now,setNow]=useState(Date.now());
 useEffect(()=>{if(!job)return;const tick=()=>{const time=Date.now();setNow(time);finishProduction(time)};tick();const timer=setInterval(tick,100);return ()=>clearInterval(timer)},[job,finishProduction]);
 const progress=job?jobProgress(job,now):null;
 return <article className="production-panel"><h2>製造ライン</h2>{job&&progress?<><p role="status">{progress.stage} · 個体 No.{job.unit.id}</p><p>{processes[job.unit.design.process??"standard"].name} · 残り約{Math.ceil((1-progress.fraction)*job.duration/1000)}秒</p><progress aria-label="製造進捗" max={1} value={progress.fraction}/><p>{bodies[job.unit.design.body].name} / {attacks[job.unit.design.attack].name}</p></>:<p role="status">{latest?'製造完了':'設計待ち'}</p>}{latest&&<div><h3>完成個体 No.{latest.id}</h3><p>{bodies[latest.design.body].name} / {attacks[latest.design.attack].name} / {defenses[latest.design.defense].name}</p><p>製造工程：{processes[latest.design.process??"standard"].name}</p><p>耐久 {latest.stats.hp} · 攻撃 {latest.stats.attack} · 速度 {latest.stats.speed}</p><p>火炎自傷：{latest.stats.selfDamage}</p></div>}<p>累計製造 {produced}体</p><button onClick={()=>setScreen('design')}>設計を調整する</button><p className="note">試作運転：材料消費なし・完成後に手動保存</p></article>;
}


