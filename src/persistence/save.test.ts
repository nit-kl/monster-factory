import { expect,test } from 'vitest';
import { parseSave } from './save';
import { initialDesign } from '../domain/monsters/design';
import { createJob } from '../domain/factory/manufacture';
const empty={version:1,design:initialDesign,latest:null,produced:0};
test('初期状態と完成個体を往復し、能力値は定義から再計算',()=>{
 expect(parseSave(JSON.parse(JSON.stringify(empty)))).toEqual(empty);
 const unit=createJob(initialDesign,1,0).unit;expect(parseSave({...empty,latest:{...unit,stats:{hp:99999}},produced:1}).latest).toEqual(unit);
});
test('破損・未対応バージョン・不正な器官・不整合を拒否',()=>{
 for(const value of [null,{}, {...empty,version:2},{...empty,design:{...initialDesign,body:'toString'}},{...empty,produced:-1},{...empty,produced:1}])expect(()=>parseSave(value)).toThrow();
});
test('工程なしの旧保存を標準扱いし、新しい工程を保持する',()=>{
 const oldDesign={body:'slime',attack:'fire',defense:'light'};
 const old=parseSave({...empty,design:oldDesign});expect(createJob(old.design,1,0).duration).toBe(6000);
 const heated=parseSave({...empty,design:{...initialDesign,process:'heated'}});expect(heated.design.process).toBe('heated');
 expect(()=>parseSave({...empty,design:{...initialDesign,process:'unknown'}})).toThrow();
});
