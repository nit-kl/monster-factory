import { processes } from '../../data/processes';
import { calculateDesign,type Design } from '../monsters/design';

export const stages=['身体培養','器官接合','品質検査'] as const;
export type ManufacturedUnit={id:number;design:Design;stats:ReturnType<typeof calculateDesign>};
export type Job={unit:ManufacturedUnit;startedAt:number;duration:number};
export function createJob(design:Design,id:number,now:number):Job{
 const snapshot={...design};return {unit:{id,design:snapshot,stats:calculateDesign(snapshot)},startedAt:now,duration:processes[snapshot.process??'standard'].duration};
}
export function jobProgress(job:Job,now:number){
 const fraction=Math.max(0,Math.min(1,(now-job.startedAt)/job.duration));
 return {fraction,done:fraction===1,stage:stages[Math.min(2,Math.floor(fraction*3))]};
}

