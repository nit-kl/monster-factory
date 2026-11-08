import { enemies } from '../data/enemies';
import { bodyImages } from '../data/bodyImages';
import { useEffect,useState } from 'react';
import type { ManufacturedUnit } from '../domain/factory/manufacture';
import { simulateBattle,describeEvent } from '../domain/battle/simulate';
import { bodies } from '../domain/monsters/design';
type Props={unit:ManufacturedUnit;result:ReturnType<typeof simulateBattle>};
export function BattleReplay({unit,result}:Props){
 const enemy=enemies[result.enemyId];const [step,setStep]=useState(0),[playing,setPlaying]=useState(true);
 const done=step===result.log.length,event=step?result.log[step-1]:null;
 useEffect(()=>{if(!playing||done)return;const timer=setTimeout(()=>setStep(n=>Math.min(n+1,result.log.length)),800);return ()=>clearTimeout(timer)},[step,playing,done,result]);
 const hp=event?.monsterHp??unit.stats.hp,enemyHp=event?.enemyHp??enemy.hp;
 return <section className="battle-result"><h3>{done?(result.outcome==='win'?'勝利':result.outcome==='loss'?'敗北':'引き分け'):'戦闘中'} · 個体 No.{unit.id}</h3>
 <div className="battle-stage"><div className="combatant" key={'ally'+step}><span className={event?.actor==='monster'?'battle-token attacking':'battle-token'}><img className="battle-sprite" src={bodyImages[unit.design.body]} alt={bodies[unit.design.body].name}/></span><strong>{bodies[unit.design.body].name}</strong><progress aria-label="味方の耐久力" max={unit.stats.hp} value={hp}/><span>HP {hp} / {unit.stats.hp}</span>{event&&<b className="damage">{event.healing?('回復 +'+event.healing):event.actor==='effects'?'':event.actor==='enemy'?`−${event.damage}`:event.selfDamage?`自傷 −${event.selfDamage}`:'攻撃'}</b>}</div><span className="versus">VS</span><div className="combatant enemy" key={'enemy'+step}><span className={event?.actor==='enemy'?'battle-token attacking':'battle-token'}><img className="battle-sprite" src={enemy.image} alt={enemy.name}/></span><strong>{enemy.name}</strong><progress aria-label={enemy.name+"の耐久力"} max={enemy.hp} value={enemyHp}/><span>HP {enemyHp} / {enemy.hp}</span>{event?.poisonDamage?<b className="damage poison">毒 −{event.poisonDamage}</b>:event?.actor==='monster'&&<b className="damage">−{event.damage}</b>}</div></div>
 <p role="status">{event?describeEvent(event,enemy.name):"両者が戦闘態勢に入った。"}</p>
 <div className="replay-controls"><button disabled={done} onClick={()=>setPlaying(p=>!p)}>{playing?'一時停止':'再開'}</button><button disabled={done} onClick={()=>{setStep(result.log.length);setPlaying(false)}}>結果までスキップ</button><button onClick={()=>{setStep(0);setPlaying(true)}}>最初から再生</button></div>
 {done&&<div className="battle-analysis"><p>冷気弱点による追加ダメージ合計：{result.coldBonus}</p>{result.coldBonus>0&&<p>高温培養の弱点を突かれました。標準培養に戻すか、火炎袋を使う場合は石殻で耐熱性を確保する方法もあります。</p>}<p>火炎自傷の合計：{result.selfDamage}</p><p>毒ダメージ合計：{result.poisonDamage} / 再生回復合計：{result.healing}</p><p>{result.selfDamage>0?'火炎袋の自傷で耐久力を失いました。石殻または高温培養で再製造すると、自傷を防げます。':result.outcome==='win'?'この設計で相手を撃退できました。別の器官による性能差も試せます。':'自傷は発生していません。耐久力・攻撃力・行動順を確認して設計を調整してください。'}</p></div>}
 <details><summary>戦闘ログ {step} / {result.log.length}</summary><ol>{result.log.slice(0,step).map((e,i)=><li key={i}>{describeEvent(e,enemy.name)} — 味方HP {e.monsterHp} / 敵HP {e.enemyHp}</li>)}</ol></details></section>;
}





