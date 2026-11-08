import { useGameStore } from '../state/store';
import { bodies, attacks, defenses, calculateDesign } from '../domain/monsters/design';
import { processes } from '../data/processes';

export function EquipmentActions({ selected }: { selected: number }) {
 const { design, job, latest, startProduction, setScreen } = useGameStore();
 const stats = calculateDesign(design);
 if (selected === 0) return <div className="equipment-actions">
  <h3>培養する設計</h3><p>{bodies[design.body].name} / {attacks[design.attack].name} / {defenses[design.defense].name}</p>
  <p>{processes[design.process ?? 'standard'].name} · {processes[design.process ?? 'standard'].duration / 1000}秒</p>
  {stats.selfDamage > 0 && <p className="note">耐熱対策がないため、攻撃ごとに自傷 {stats.selfDamage} が発生します。</p>}
  <button disabled={!!job} onClick={() => startProduction(Date.now())}>{job ? '製造ライン稼働中' : '培養を開始する'}</button>
  <button onClick={() => setScreen('design')}>培養前に設計を確認</button>
 </div>;
 if (selected === 2) return <div className="equipment-actions"><h3>最新個体の検査結果</h3>{latest ? <>
  <p>個体 No.{latest.id} · {bodies[latest.design.body].name}</p>
  <p>耐久 {latest.stats.hp} / 攻撃 {latest.stats.attack} / 速度 {latest.stats.speed}</p>
  <p>火炎自傷：{latest.stats.selfDamage} · 工程：{processes[latest.design.process ?? 'standard'].name}</p>
  <button onClick={() => setScreen('design')}>検査結果をもとに改良する</button>
 </> : <p>まだ完成個体がありません。培養槽で製造を始めてください。</p>}</div>;
 if (selected === 3) return <div className="equipment-actions"><h3>出撃準備</h3><p>{latest ? `個体 No.${latest.id} を戦闘試験へ送ります。` : '出撃には完成個体が必要です。'}</p><button disabled={!latest} onClick={() => setScreen('battle')}>出撃する個体を確認</button></div>;
 return <div className="equipment-actions"><h3>{selected === 5 ? '器官の特性を調べる' : '設計を組み立てる'}</h3><p>身体・攻撃器官・防御器官と培養工程を選び、性能と相性を確認できます。</p><button onClick={() => setScreen('design')}>{selected === 5 ? '器官の特性と相性を見る' : selected === 1 ? '接合する器官を選ぶ' : '設計台で設計を開く'}</button></div>;
}
