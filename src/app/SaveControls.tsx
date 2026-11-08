import { useState } from 'react';
import { useGameStore } from '../state/store';
import { parseSave,saveSlot } from '../persistence/save';
export function SaveControls(){
 const job=useGameStore(s=>s.job);const [busy,setBusy]=useState(false),[message,setMessage]=useState('手動保存');
 async function run(load:boolean){
  if(busy||useGameStore.getState().job)return;setBusy(true);
  try{
   if(load){const raw=await saveSlot();if(raw===undefined){setMessage('保存データがありません');return}const data=parseSave(raw);if(useGameStore.getState().job)throw Error("製造中");useGameStore.setState({design:data.design,latest:data.latest,produced:data.produced,job:null,screen:'factory'});setMessage('読み込みました')}
   else{const {design,latest,produced}=useGameStore.getState();await saveSlot(parseSave({version:1,design,latest,produced}));setMessage('このブラウザに保存しました')}
  }catch{setMessage(load?'読み込みできませんでした。現在の進行は保持しています。':'保存できませんでした。ブラウザの保存設定を確認してください。')}finally{setBusy(false)}
 }
 return <div className="save-controls"><div><button disabled={busy||!!job} onClick={()=>void run(false)}>保存</button><button disabled={busy||!!job} onClick={()=>{if(window.confirm('現在の進行を保存データに置き換えますか？'))void run(true)}}>読込</button></div><small role="status">{job?'製造完了後に保存できます':busy?'処理中…':message}</small><small>このブラウザのみ。データ消去で失われます。</small></div>;
}

