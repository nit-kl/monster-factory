import { useEffect,useRef,useState } from 'react';
import { createFactory3D } from '../game/Factory3D';
import { floors,type FloorId } from '../data/floors';
import type { StaffId } from '../data/staff';
export function FactoryView({selected,onSelect,floor,onFloor,onTalk}:{selected:number;onSelect:(index:number)=>void;floor:FloorId;onFloor:(floor:FloorId)=>void;onTalk:(id:StaffId)=>void}){
 const host=useRef<HTMLDivElement>(null),scene=useRef<ReturnType<typeof createFactory3D>|null>(null),callback=useRef({onSelect,onFloor});callback.current={onSelect,onFloor};const [error,setError]=useState(false);const previousFloor=useRef(floor);
 useEffect(()=>{if(!host.current)return;try{scene.current=createFactory3D(host.current,i=>{callback.current.onSelect(i);scene.current?.setSelected(i)},f=>callback.current.onFloor(f))}catch{setError(true)}return ()=>{scene.current?.dispose();scene.current=null}},[]);
 useEffect(()=>{const changed=previousFloor.current!==floor;scene.current?.setFloor(floor);scene.current?.setSelected(selected,!changed);previousFloor.current=floor},[floor,selected]);
 return <><div className="floor-toolbar"><div aria-label="フロア選択">{Object.entries(floors).map(([id,f])=><button key={id} aria-pressed={floor===id} onClick={()=>onFloor(id as FloorId)}>{f.name}</button>)}</div><p>{floors[floor].description}</p><button onClick={()=>onTalk(floors[floor].staff)}>担当者に相談：{floors[floor].staffName}</button></div><div className="three-viewport"><div ref={host} className="factory factory-three" role="group" aria-label="ドラッグで見渡し、クリックで移動する立体工場">{error&&<p role="alert">3D表示を開始できませんでした。WebGL対応ブラウザで開いてください。</p>}</div><div className="camera-controls"><span>ドラッグ：見渡す / ホイール：拡大 / クリック：移動</span><button onClick={()=>scene.current?.reset()}>視点を戻す</button></div></div></>;
}

