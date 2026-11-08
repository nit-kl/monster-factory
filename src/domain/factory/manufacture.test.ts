import { expect,test } from 'vitest';
import { createJob,jobProgress } from './manufacture';
import { initialDesign } from '../monsters/design';
import { useGameStore } from '../../state/store';
test('設計をコピーし、工程の境界と完了を判定する',()=>{
 const design={...initialDesign};const job=createJob(design,1,1000);design.defense='shell';
 expect(job.unit.design.defense).toBe('light');expect(jobProgress(job,0).fraction).toBe(0);
 expect(jobProgress(job,2999).stage).toBe('身体培養');expect(jobProgress(job,3000).stage).toBe('器官接合');expect(jobProgress(job,5000).stage).toBe('品質検査');expect(jobProgress(job,6999).done).toBe(false);expect(jobProgress(job,7000).done).toBe(true);
});
test('二重開始と二重完了で個体が増えない',()=>{
 useGameStore.setState({job:null,latest:null,produced:0,design:{...initialDesign}});
 useGameStore.getState().startProduction(0);useGameStore.getState().startProduction(1000);useGameStore.getState().setDesign({defense:'shell'});
 useGameStore.getState().finishProduction(5999);expect(useGameStore.getState().produced).toBe(0);
 useGameStore.getState().finishProduction(6000);useGameStore.getState().finishProduction(7000);
 expect(useGameStore.getState().produced).toBe(1);expect(useGameStore.getState().latest?.design.defense).toBe('light');
});
test('製造工程の時間と耐熱・耐久のトレードオフ',()=>{
 const normal=createJob(initialDesign,1,0),rapid=createJob({...initialDesign,process:'rapid'},2,0),heated=createJob({...initialDesign,process:'heated'},3,0);
 expect(rapid.duration).toBe(3000);expect(heated.duration).toBe(9000);expect(rapid.unit.stats.hp).toBe(normal.unit.stats.hp-15);
 expect(heated.unit.stats.selfDamage).toBe(0);expect(heated.unit.stats.speed).toBe(normal.unit.stats.speed);expect(heated.unit.stats.cost).toBe(normal.unit.stats.cost+8);
 expect(jobProgress(rapid,2999).done).toBe(false);expect(jobProgress(rapid,3000).done).toBe(true);expect(jobProgress(heated,8999).done).toBe(false);expect(jobProgress(heated,9000).done).toBe(true);
});
