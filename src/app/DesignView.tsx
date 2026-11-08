import { processes,type ProcessId } from '../data/processes';
import { bodyImages } from '../data/bodyImages';
import { bodies, attacks, defenses, calculateDesign, type Design } from '../domain/monsters/design';
import { useGameStore } from '../state/store';
export function DesignView(){
 const {design,setDesign,startProduction,job}=useGameStore();const stats=calculateDesign(design);
 return <div className="designer"><p className="eyebrow">設計研究室 / 試作設計</p><h2>次の個体を設計する</h2><p>身体と器官を選び、性能と相性を確認してください。</p><div className="body-preview"><img src={bodyImages[design.body]} alt={bodies[design.body].name+"の身体プレビュー"}/><div><h3>{bodies[design.body].name}</h3><p>{attacks[design.attack].name} / {defenses[design.defense].name}</p><small>身体の外観案 · 器官の見た目は未反映</small></div></div>
 {([{key:'body',title:'01 身体',items:bodies},{key:'attack',title:'02 攻撃器官',items:attacks},{key:'defense',title:'03 防御器官',items:defenses}] as const).map(group=><fieldset key={group.key}><legend>{group.title}</legend><div className="design-options">{Object.entries(group.items).map(([id,value])=><button key={id} aria-pressed={design[group.key]===id} onClick={()=>setDesign({[group.key]:id} as Partial<Design>)}>{value.name}</button>)}</div></fieldset>)}
 <fieldset><legend>04 製造工程</legend><div className="design-options">{Object.entries(processes).map(([id,p])=><button key={id} aria-pressed={(design.process??"standard")===id} onClick={()=>setDesign({process:id as ProcessId})}>{p.name}</button>)}</div><p>{processes[design.process??"standard"].description}</p></fieldset><p>{attacks[design.attack].description}</p><p>{defenses[design.defense].description}</p>
 <div className="design-result" aria-live="polite"><h3>{bodies[design.body].name} / {attacks[design.attack].name} / {defenses[design.defense].name}</h3><dl><dt>製造時間</dt><dd>{processes[design.process??"standard"].duration/1000}秒</dd><dt>耐久力</dt><dd>{stats.hp}</dd><dt>攻撃力</dt><dd>{stats.attack}</dd><dt>速度</dt><dd>{stats.speed}</dd><dt>製造コスト（仮）</dt><dd>{stats.cost}</dd></dl><p className={stats.selfDamage?'compatibility warning':'compatibility'}>{stats.selfDamage?`耐熱対策なし：火炎攻撃ごとに自傷 ${stats.selfDamage}。石殻または高温培養で防げます。それぞれ速度・コスト・製造時間に影響します。`:design.attack==='fire'?(design.process==='heated'?'高温培養の耐熱効果で火炎袋の自傷を防ぎます。':'石殻の耐熱効果で火炎袋の自傷を防ぎます。'):'この組み合わせには火炎袋による自傷はありません。'}</p></div><button className="manufacture-action" disabled={!!job} onClick={()=>startProduction(Date.now())}>{job?"製造中です":"この設計で製造する"}</button><p className="note">数値は試作調整中。設計は画面移動で保持されます。終了前に上部の「保存」を押してください。</p></div>;
}




