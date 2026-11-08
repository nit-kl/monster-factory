import { useState } from 'react';
import { useGameStore } from '../state/store';
import { simulateBattle } from '../domain/battle/simulate';
import { bodies,attacks,defenses } from '../domain/monsters/design';
import { enemies,type EnemyId } from '../data/enemies';
import type { ManufacturedUnit } from '../domain/factory/manufacture';
import { BattleReplay } from './BattleReplay';
export function BattleView(){
 const {latest,setScreen}=useGameStore();const [enemyId,setEnemyId]=useState<EnemyId>('swordsman');const enemy=enemies[enemyId];
 const [record,setRecord]=useState<{unit:ManufacturedUnit;result:ReturnType<typeof simulateBattle>;run:number}|null>(null);
 return <div className="designer"><p className="eyebrow">試験戦闘 / シード 7</p><h2>対戦相手を選ぶ</h2><div className="enemy-options">{Object.entries(enemies).map(([id,e])=><button key={id} aria-pressed={enemyId===id} onClick={()=>{setEnemyId(id as EnemyId);setRecord(null)}}><img src={e.image} alt=""/>{e.name}</button>)}</div><h3>{enemy.name}との模擬戦</h3><p>敵：耐久力{enemy.hp}・攻撃力{enemy.attack}・速度{enemy.speed}。速度が高い側から攻撃します。同速なら製造個体が先攻です。</p><p>{enemy.description}</p>{latest?<><h3>出撃個体 No.{latest.id} — {bodies[latest.design.body].name}</h3><p>{attacks[latest.design.attack].name} / {defenses[latest.design.defense].name}</p>{enemy.element==='cold'&&latest.design.process==='heated'&&<p className="compatibility warning">高温培養の冷気弱点：この相手から受ける攻撃は毎回+5ダメージになります。</p>}<button className="manufacture-action" onClick={()=>setRecord(old=>({unit:latest,result:simulateBattle(latest,7,enemyId),run:(old?.run??0)+1}))}>自動戦闘を実行</button></>:<p>まず設計画面から個体を製造してください。</p>}
 {record&&<BattleReplay key={record.run} unit={record.unit} result={record.result}/>}<button onClick={()=>setScreen('design')}>設計を改良する</button><p className="note">試作用の戦闘数値・キャラクター外観です。毒・再生は巡目終了時に発動します。再戦では個体の耐久力を全回復します。</p></div>;
}
