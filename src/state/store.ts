import { create } from 'zustand';
import type { ScreenId } from '../data/screens';
import { initialDesign, type Design } from '../domain/monsters/design';
import { createJob,jobProgress,type Job,type ManufacturedUnit } from '../domain/factory/manufacture';
type State={screen:ScreenId;setScreen:(screen:ScreenId)=>void;design:Design;setDesign:(change:Partial<Design>)=>void;job:Job|null;latest:ManufacturedUnit|null;produced:number;startProduction:(now:number)=>void;finishProduction:(now:number)=>void};
export const useGameStore=create<State>((set)=>({
 screen:'factory',setScreen:(screen)=>set({screen}),design:{...initialDesign},setDesign:(change)=>set(state=>({design:{...state.design,...change}})),
 job:null,latest:null,produced:0,
 startProduction:(now)=>set(state=>state.job?{}:{job:createJob(state.design,state.produced+1,now),screen:'factory'}),
 finishProduction:(now)=>set(state=>state.job&&jobProgress(state.job,now).done?{latest:state.job.unit,job:null,produced:state.produced+1}:{}),
}));
