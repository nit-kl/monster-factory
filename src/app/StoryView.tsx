import { useEffect,useRef,useState } from 'react';
import { staff,type StaffId } from '../data/staff';
import { conversations } from '../data/dialogue';
import { useGameStore } from '../state/store';
export function StoryView({selected,onSelect}:{selected:StaffId;onSelect:(id:StaffId)=>void}){
 return <div className="story-view"><p className="eyebrow">工場休憩室 / 会話試作</p><h2>仲間と話す</h2><div className="story-tabs" aria-label="話す相手">{staff.map(s=><button key={s.id} aria-pressed={selected===s.id} onClick={()=>onSelect(s.id)}>{s.name}</button>)}</div><Conversation key={selected} selected={selected}/></div>;
}
export function Conversation({selected,onNavigate}:{selected:StaffId;onNavigate?:()=>void}){
 const person=staff.find(s=>s.id===selected)!;const story=conversations[selected];const [line,setLine]=useState(0);const setScreen=useGameStore(s=>s.setScreen);const heading=useRef<HTMLHeadingElement>(null);
 useEffect(()=>{heading.current?.focus()},[]);
 return <><div className="conversation-stage">{person.image?<img src={person.image} alt={person.form}/>:<div className="portrait-placeholder" aria-label="リゼットの立ち絵は準備中">♜<small>立ち絵準備中</small></div>}<div className="conversation-card"><p className="eyebrow">{person.role}</p><h3 ref={heading} tabIndex={-1}>{person.name}</h3><p className="conversation-title">{story.title}</p><p className="dialogue-line" aria-live="polite">{story.lines[line]}</p><span className="line-count">{line+1} / {story.lines.length}</span><div className="dialogue-actions"><button disabled={line===0} onClick={()=>setLine(n=>n-1)}>前へ</button>{line<story.lines.length-1?<button onClick={()=>setLine(n=>n+1)}>次へ</button>:<button onClick={()=>{onNavigate?.();setScreen(story.action.screen)}}>{story.action.label}</button>}</div></div></div><p className="note">台詞は試作案です。いつでも他の仲間や画面へ移動できます。</p></>;
}
