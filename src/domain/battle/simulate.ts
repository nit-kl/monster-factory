import type { ManufacturedUnit } from '../factory/manufacture';
import { enemies,type EnemyId } from '../../data/enemies';
export type BattleEvent={turn:number;actor:'monster'|'enemy'|'effects';damage:number;selfDamage:number;poisonDamage:number;healing:number;coldBonus:number;monsterHp:number;enemyHp:number};
export const effectValues={poison:7,regeneration:6,coldWeakness:5};
export function simulateBattle(unit:ManufacturedUnit,seed:number,enemyId:EnemyId='swordsman'){
 const enemy=enemies[enemyId];
 let state=seed>>>0;const random=()=>{state=(Math.imul(state,1664525)+1013904223)>>>0;return state/4294967296};
 let monsterHp=unit.stats.hp,enemyHp:number=enemy.hp,poisoned=false;const log:BattleEvent[]=[];
 for(let turn=1;turn<=50&&monsterHp>0&&enemyHp>0;turn++){
  const order:('monster'|'enemy')[]=unit.stats.speed>=enemy.speed?['monster','enemy']:['enemy','monster'];
  for(const actor of order){
   if(monsterHp<=0||enemyHp<=0)break;
   const coldBonus=actor==='enemy'&&enemy.element==='cold'&&unit.design.process==='heated'?effectValues.coldWeakness:0;
   const damage=Math.max(1,(actor==='monster'?unit.stats.attack:enemy.attack)+Math.floor(random()*5)-2)+coldBonus;
   const selfDamage=actor==='monster'?Math.min(monsterHp,unit.stats.selfDamage):0;
   if(actor==='monster'){enemyHp=Math.max(0,enemyHp-damage);monsterHp=Math.max(0,monsterHp-selfDamage);if(unit.design.attack==='venom')poisoned=true}else monsterHp=Math.max(0,monsterHp-damage);
   log.push({turn,actor,damage,selfDamage,poisonDamage:0,healing:0,coldBonus,monsterHp,enemyHp});
  }
  if(monsterHp>0&&enemyHp>0){
   const poisonDamage=poisoned?Math.min(enemyHp,effectValues.poison):0;
   const healing=unit.design.defense==='regen'?Math.min(unit.stats.hp-monsterHp,effectValues.regeneration):0;
   enemyHp-=poisonDamage;monsterHp+=healing;
   if(poisonDamage||healing)log.push({turn,actor:'effects',damage:0,selfDamage:0,poisonDamage,healing,coldBonus:0,monsterHp,enemyHp});
  }
 }
 return {seed,enemyId,log,outcome:monsterHp>0&&enemyHp===0?'win':monsterHp===0?'loss':'draw',monsterHp,enemyHp,selfDamage:log.reduce((n,e)=>n+e.selfDamage,0),poisonDamage:log.reduce((n,e)=>n+e.poisonDamage,0),healing:log.reduce((n,e)=>n+e.healing,0),coldBonus:log.reduce((n,e)=>n+e.coldBonus,0)} as const;
}
export function describeEvent(e:BattleEvent,enemyName='剣士'){
 if(e.actor==='effects')return `${e.turn}巡目終了：${[e.poisonDamage?`毒ダメージ ${e.poisonDamage}`:'',e.healing?`再生回復 ${e.healing}`:''].filter(Boolean).join(' / ')}`;
 return `${e.turn}巡目：${e.actor==='monster'?'味方':enemyName}の攻撃 ${e.damage}${e.coldBonus?`（うち冷気弱点 +${e.coldBonus}）`:''}${e.selfDamage?` / 火炎自傷 ${e.selfDamage}`:''}`;
}
