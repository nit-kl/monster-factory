import { ConversationDialog } from './ConversationDialog';
import { EquipmentActions } from './EquipmentActions';
import { floors,type FloorId } from '../data/floors';
﻿import { StoryView } from './StoryView';
import { SaveControls } from './SaveControls';
import { BattleView } from './BattleView';
import { ProductionPanel } from './ProductionPanel';
import { DesignView } from './DesignView';
import { FactoryView } from './FactoryView';
import { useState } from 'react';
import { screens } from '../data/screens';
import { staff,type StaffId } from '../data/staff';
import { useGameStore } from '../state/store';
const equipment = [

 {name:'培養槽',icon:'⚗',role:'身体培養',description:'モンスターの身体を育てる設備。培養工程の違いが、完成する個体の性質に影響します。',worker:'ポヨン',x:28,y:20},
 {name:'器官接合機',icon:'⚒',role:'器官接合',description:'身体に攻撃器官と防御器官を組み合わせる設備。相性を確かめながら設計を形にします。',worker:'バルガス',x:39,y:43},
 {name:'品質検査装置',icon:'⌕',role:'品質検査',description:'出荷前の個体を検査する設備。設計と製造の結果を確認します。',worker:'ポヨン',x:49,y:62},
 {name:'出撃ゲート',icon:'⚔',role:'出撃準備',description:'製造した個体を戦場へ送り出す場所。戦闘結果を分析して、次の改良につなげます。',worker:'リゼット',x:85,y:54},
 {name:'設計台',icon:'▤',role:'個体設計',description:'身体と器官の組み合わせを検討する作業台。設計画面で性能を確認できます。',worker:'オルフェン',x:0,y:0},
 {name:'器官標本庫',icon:'◇',role:'器官研究',description:'攻撃・防御器官の特性を調べる標本庫。研究主任に相性を相談できます。',worker:'オルフェン',x:0,y:0},
];
export function App(){
 const {screen,setScreen}=useGameStore(); const [selected,setSelected]=useState(0); const item=equipment[selected];const floor:FloorId=selected<4?'production':'research';const moveFloor=(id:FloorId)=>{setSelected(id==='production'?0:4);setScreen('factory')};
 const [selectedStaff,setSelectedStaff]=useState<StaffId>('lisette');
 const [consulting,setConsulting]=useState<StaffId|null>(null);
 const talk=(id:StaffId)=>{setSelectedStaff(id);setScreen('story')};
 return <main className="factory-app"><header><div><p className="eyebrow">～ 魔王軍最後の工場 ～</p><h1>モンスター製造課</h1></div><div className="resource">魔王軍 第七工場<strong>{floors[floor].name}</strong></div><div className="resource">◆ 工場の仲間<strong>5名</strong></div><div className="resource">⚙ 稼働状態<strong>{useGameStore(state=>state.job)?'製造中':'待機中'}</strong></div><SaveControls/></header>
 <div className="workplace"><aside className="left"><article><h2>フロア・設備</h2><div className="floor-links"><button onClick={()=>moveFloor("production")}>1F 製造フロアへ</button><button onClick={()=>moveFloor("research")}>2F 研究フロアへ</button></div><div className="equipment-list">{equipment.map((e,i)=>(i<4)===(floor==='production')&&<button key={e.name} aria-pressed={selected===i} onClick={()=>{setSelected(i);setScreen('factory')}}><span>{e.icon}</span>{e.name}</button>)}</div></article><article className="equipment-detail"><h2>{item.icon} {item.name}</h2><div className="equipment-symbol" aria-hidden="true">{item.icon}</div><p>{item.description}</p><dl><dt>工程</dt><dd>{item.role}</dd><dt>担当</dt><dd>{item.worker}</dd></dl><p className="note">設備の配置・建設は準備中</p></article></aside>
 <section className="center" aria-label={screens.find(s=>s.id===screen)!.label}>{screen==='factory'?<div className="factory-art" role="group" aria-label="魔王軍工場の設備を選択"><FactoryView selected={selected} onSelect={setSelected} floor={floor} onFloor={moveFloor} onTalk={setConsulting}/><span className="art-label">クリックで移動 · 担当者は相談時に立ち絵で登場</span></div>:<article className="inner"><h2>{screens.find(s=>s.id===screen)!.label}</h2>{screen==='design'?<DesignView/>:screen==='story'?<StoryView selected={selectedStaff} onSelect={setSelectedStaff}/>:<BattleView/>}<button onClick={()=>setScreen('factory')}>工場へ戻る</button></article>}</section>
 <aside className="right"><ProductionPanel/><article><h2>設備情報</h2><p className="eyebrow">選択中の設備</p><h3>{item.icon} {item.name}</h3><p>{item.description}</p><EquipmentActions selected={selected}/><button onClick={()=>setConsulting(selected===0||selected===2?"poyon":selected===1?"vargas":selected===3?"lisette":"orphen")}>担当者に相談</button><h3>製造の流れ</h3>{equipment.slice(0,4).map((e,i)=><button className={'flow-row '+(selected===i?'active':'')} key={e.name} onClick={()=>{setSelected(i);setScreen('factory')}}><span>0{i+1}</span>{e.role}<b>›</b></button>)}<button className="design-action" onClick={()=>setScreen('design')}>▤ モンスター設計へ</button></article><article><h2>工場の仲間</h2>{staff.map((s,i)=><button className="staff staff-button" key={s.name} onClick={()=>talk(s.id)} aria-label={s.name+"の会話を開く"}><span className={'staff-icon staff-'+i}>{['♜','♉','☠','●','◆'][i]}</span><div><strong>{s.name}</strong><small>{s.role}</small></div></button>)}</article></aside></div>
 <nav aria-label="メイン画面">{screens.map((s,i)=><button key={s.id} aria-current={screen===s.id?'page':undefined} onClick={()=>setScreen(s.id)}><span>{['♜','▤','⚔','▧'][i]}</span><div>{s.label}<small>{['生産・設備','身体・器官','出撃・分析','仲間・記録'][i]}</small></div></button>)}</nav>{consulting&&<ConversationDialog selected={consulting} onClose={()=>setConsulting(null)}/>}</main>;
}








