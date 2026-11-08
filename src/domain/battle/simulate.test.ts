import { expect,test } from 'vitest';
import { createJob } from '../factory/manufacture';
import { initialDesign } from '../monsters/design';
import { simulateBattle } from './simulate';
test('同じシードで再現し、元の個体を変更しない',()=>{
 const unit=createJob(initialDesign,1,0).unit;const before=structuredClone(unit);expect(simulateBattle(unit,7)).toEqual(simulateBattle(unit,7));expect(unit).toEqual(before);
});
test('火炎自傷を石殻で防ぐと剣士に勝てる',()=>{
 const weak=simulateBattle(createJob(initialDesign,1,0).unit,7);const improved=simulateBattle(createJob({...initialDesign,defense:'shell'},2,0).unit,7);
 expect(weak.outcome).toBe('loss');expect(weak.selfDamage).toBeGreaterThan(0);expect(improved.outcome).toBe('win');expect(improved.selfDamage).toBe(0);
 for(const e of [...weak.log,...improved.log]){expect(e.monsterHp).toBeGreaterThanOrEqual(0);expect(e.enemyHp).toBeGreaterThanOrEqual(0)}
});
test('毒と再生は巡目末に発動し、集計とHPが一致する',()=>{
 const unit=createJob({body:'golem',attack:'venom',defense:'regen'},1,0).unit;
 const result=simulateBattle(unit,7);const effects=result.log.filter(e=>e.actor==='effects');
 expect(effects.length).toBeGreaterThan(0);expect(result.poisonDamage).toBeGreaterThan(0);expect(result.healing).toBeGreaterThan(0);
 result.log.forEach((e,i)=>{expect(e.monsterHp).toBeLessThanOrEqual(unit.stats.hp);expect(e.enemyHp).toBeGreaterThanOrEqual(0);if(e.actor==='effects'){const prev=result.log[i-1];expect(e.monsterHp).toBe(prev.monsterHp+e.healing);expect(e.enemyHp).toBe(prev.enemyHp-e.poisonDamage);expect(e.healing).toBeLessThanOrEqual(6);expect(e.poisonDamage).toBeLessThanOrEqual(7)}});
 expect(result.poisonDamage).toBe(effects.reduce((n,e)=>n+e.poisonDamage,0));
});
test('倒れた個体は再生で復活せず、非毒器官は毒を発生させない',()=>{
 const unit=createJob({body:'slime',attack:'claws',defense:'regen'},1,0).unit;unit.stats.hp=1;
 const result=simulateBattle(unit,7);expect(result.outcome).toBe('loss');expect(result.healing).toBe(0);expect(result.poisonDamage).toBe(0);expect(result.log.at(-1)?.actor).toBe('enemy');
});
test('弓兵の先攻と3種類の敵の再現性',()=>{
 const unit=createJob({...initialDesign,defense:'light'},1,0).unit;
 expect(simulateBattle(unit,7,'swordsman').log[0].actor).toBe('monster');
 expect(simulateBattle(unit,7,'archer').log[0].actor).toBe('enemy');
 for(const enemy of ['swordsman','archer','mage'] as const)expect(simulateBattle(unit,9,enemy)).toEqual(simulateBattle(unit,9,enemy));
});
test('高温培養は冷気だけに弱く、標準培養には追加ダメージがない',()=>{
 const standard=createJob({...initialDesign,attack:'claws'},1,0).unit;
 const heated=createJob({...initialDesign,attack:'claws',process:'heated'},2,0).unit;
 const normal=simulateBattle(standard,7,'mage'),weak=simulateBattle(heated,7,'mage');
 expect(normal.coldBonus).toBe(0);expect(weak.coldBonus).toBeGreaterThan(0);
 const first=(r:ReturnType<typeof simulateBattle>)=>r.log.find(e=>e.actor==='enemy')!;
 expect(first(weak).damage-first(normal).damage).toBe(5);
 expect(simulateBattle(heated,7,'archer').coldBonus).toBe(0);
 expect(weak.coldBonus).toBe(weak.log.reduce((n,e)=>n+e.coldBonus,0));
});
