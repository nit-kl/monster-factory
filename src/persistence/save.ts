import { processes } from '../data/processes';
import { bodies,attacks,defenses,calculateDesign,type Design } from '../domain/monsters/design';
import type { ManufacturedUnit } from '../domain/factory/manufacture';
export type SaveData={version:1;design:Design;latest:ManufacturedUnit|null;produced:number};
function object(v:unknown):v is Record<string,unknown>{return typeof v==='object'&&v!==null}
function design(v:unknown):Design{
 if(!object(v)||typeof v.body!=='string'||!Object.hasOwn(bodies,v.body)||typeof v.attack!=='string'||!Object.hasOwn(attacks,v.attack)||typeof v.defense!=='string'||!Object.hasOwn(defenses,v.defense))throw Error('設計データが不正です');
 if(v.process!==undefined&&(typeof v.process!=='string'||!Object.hasOwn(processes,v.process)))throw Error('製造工程が不正です');
 return {body:v.body,attack:v.attack,defense:v.defense,...(v.process!==undefined?{process:v.process}:{})} as Design;
}
export function parseSave(v:unknown):SaveData{
 if(!object(v)||v.version!==1)throw Error('この保存形式には対応していません');
 if(!Number.isSafeInteger(v.produced)||(v.produced as number)<0)throw Error('製造数が不正です');
 const d=design(v.design);let latest:ManufacturedUnit|null=null;
 if(v.latest!==null){if(!object(v.latest)||!Number.isSafeInteger(v.latest.id)||v.latest.id!==v.produced||(v.latest.id as number)<1)throw Error('個体番号が不正です');const unitDesign=design(v.latest.design);latest={id:v.latest.id as number,design:unitDesign,stats:calculateDesign(unitDesign)}}
 if((v.produced===0)!==(latest===null))throw Error('個体と製造数が一致しません');
 return {version:1,design:d,latest,produced:v.produced as number};
}
export async function saveSlot(value?:SaveData):Promise<unknown>{
 const db=await new Promise<IDBDatabase>((resolve,reject)=>{const request=indexedDB.open('monster-factory',1);request.onupgradeneeded=()=>request.result.createObjectStore('saves');request.onsuccess=()=>resolve(request.result);request.onerror=()=>reject(request.error);request.onblocked=()=>reject(Error('別のタブを閉じて再試行してください'))});
 try{return await new Promise((resolve,reject)=>{const tx=db.transaction('saves',value?'readwrite':'readonly');const store=tx.objectStore('saves');const request=value?store.put(value,'main'):store.get('main');let result:unknown;request.onsuccess=()=>{result=request.result};tx.oncomplete=()=>resolve(result);tx.onerror=()=>reject(tx.error);tx.onabort=()=>reject(tx.error??Error('保存処理が中断されました'))})}finally{db.close()}
}

