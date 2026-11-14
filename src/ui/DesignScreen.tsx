import { useCallback, useEffect, useRef } from 'react';
import { enemies } from '../data/enemies';
import { attacks, bodies, capacity, defenses, processes } from '../data/parts';
import { calculate, designNotes, overCapacity, unlocked, type Design } from '../domain/design';
import { dayOf, stepOf } from '../domain/progress';
import { useGame } from '../state/store';
import { Preview } from '../three/preview';
import { Canvas3D, StatRow, Tags } from './common';

const signed = (n: number) => (n > 0 ? `+${n}` : `${n}`);
type Part = { name: string; note: string; day: number; cost: number; hp?: number; attack?: number; speed?: number };

function Group<K extends keyof Design>({ title, slot, table, day }: { title: string; slot: K; table: Record<string, Part>; day: number }) {
  const design = useGame(s => s.design), setDesign = useGame(s => s.setDesign);
  return (
    <section className="partgroup">
      <h3>{title}</h3>
      <div className="parts">
        {Object.entries(table).map(([id, p]) => {
          const locked = p.day > day;
          const deltas = [p.hp ? `耐久${slot === 'body' ? ' ' + p.hp : signed(p.hp)}` : '', p.attack ? `攻撃${slot === 'body' ? ' ' + p.attack : signed(p.attack)}` : '', p.speed ? `速度${slot === 'body' ? ' ' + p.speed : signed(p.speed)}` : ''].filter(Boolean);
          return (
            <button key={id} className="part" disabled={locked} aria-pressed={design[slot] === id} onClick={() => setDesign({ [slot]: id } as Partial<Design>)} data-testid={`part-${slot}-${id}`}>
              <header><strong>{p.name}</strong><span className="cost">容量 {slot === 'process' ? signed(p.cost) : p.cost}</span></header>
              {locked ? <p className="locked">{p.day}日目に入荷</p> : <><p className="deltas">{deltas.join('　') || '補正なし'}</p><p>{p.note}</p></>}
            </button>
          );
        })}
      </div>
    </section>
  );
}

export function DesignScreen() {
  const { design, progress, go, startManufacture } = useGame();
  const day = dayOf(progress), stats = calculate(design), notes = designNotes(design), step = stepOf(progress);
  const enemy = step.kind === 'objective' ? enemies[step.enemy] : null;
  const preview = useRef<Preview | null>(null);
  useEffect(() => { preview.current?.setDesign(design); }, [design]);
  const ready = useCallback((p: Preview | null) => { preview.current = p; p?.setDesign(useGame.getState().design); }, []);
  const blocked = overCapacity(design) || !unlocked(day, design);
  return (
    <div className="screen design" data-testid="design">
      <header className="bar-top"><div><small>2F 研究フロア</small><h1>設計台</h1></div><button onClick={() => go('hub')}>工場へ戻る</button></header>
      <div className="design-grid">
        <div className="design-parts">
          <Group title="身体" slot="body" table={bodies} day={day} />
          <Group title="攻めの器官" slot="attack" table={attacks} day={day} />
          <Group title="守りの器官" slot="defense" table={defenses} day={day} />
          <Group title="培養工程" slot="process" table={processes} day={day} />
        </div>
        <div className="design-preview">
          <Canvas3D className="fill" create={h => new Preview(h)} onReady={ready} />
          <p className="hint">ドラッグで回転</p>
        </div>
        <aside className="design-side panel">
          <h2>設計の性能</h2>
          <StatRow label="耐久力" value={stats.hp} max={130} tone="hp" note={enemy ? `相手の攻撃 ${enemy.attack}` : undefined} />
          <StatRow label="攻撃力" value={stats.attack} max={40} tone="atk" note={enemy ? `相手の耐久 ${enemy.hp}` : undefined} />
          <StatRow label="速度" value={stats.speed} max={20} tone="spd" note={enemy ? `相手の速度 ${enemy.speed}` : undefined} />
          <StatRow label="容量" value={stats.cost} max={capacity} tone={stats.cost > capacity ? 'over' : 'cap'} note={`上限 ${capacity}`} />
          <Tags stats={stats} />
          <h3>相性メモ</h3>
          <ul className="notes">
            {notes.length ? notes.map(n => <li key={n.text} className={n.tone}>{n.text}</li>) : <li className="info">特別な相性はありません。</li>}
          </ul>
          <button className="big primary" disabled={blocked} onClick={startManufacture} data-testid="manufacture"><b>この設計で製造する</b><small>{blocked ? '容量を超えています' : '1F 製造ラインへ送る'}</small></button>
        </aside>
      </div>
    </div>
  );
}
