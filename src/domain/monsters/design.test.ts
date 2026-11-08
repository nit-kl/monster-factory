import { expect,test } from 'vitest';
import { attacks,bodies,defenses,calculateDesign,initialDesign } from './design';
test('石殻は自傷を防ぎ、速度とコストを犠牲にする',()=>{
 const vulnerable=calculateDesign(initialDesign);const protectedUnit=calculateDesign({...initialDesign,defense:'shell'});
 expect(vulnerable.selfDamage).toBe(8);expect(protectedUnit.selfDamage).toBe(0);
 expect(protectedUnit.speed).toBeLessThan(vulnerable.speed);expect(protectedUnit.cost).toBeGreaterThan(vulnerable.cost);
});
test('全27組み合わせは再現可能で性能の下限を保つ',()=>{
 for(const body of Object.keys(bodies) as (keyof typeof bodies)[])for(const attack of Object.keys(attacks) as (keyof typeof attacks)[])for(const defense of Object.keys(defenses) as (keyof typeof defenses)[]){
 const d={body,attack,defense},s=calculateDesign(d);expect(s).toEqual(calculateDesign(d));expect(s.speed).toBeGreaterThanOrEqual(1);expect(s.hp).toBeGreaterThan(0);if(attack!=='fire')expect(s.selfDamage).toBe(0);
 }
});
