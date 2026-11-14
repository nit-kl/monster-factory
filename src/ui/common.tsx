import { useEffect, useRef, type ReactNode } from 'react';
import { materials } from '../data/recipes';
import { recipeFor } from '../domain/design';
import type { Design, Stats } from '../domain/design';
import type { Unit } from '../domain/manufacture';
import { MonsterIcon } from './RecipeArt';

export const designLabel = (d: Design) => `${materials[d.first].name} × ${materials[d.second].name}`;

export function StatRow({ label, value, max, tone = '', note }: { label: string; value: number; max: number; tone?: string; note?: ReactNode }) {
  return (
    <div className={`stat ${tone}`}>
      <span>{label}</span>
      <div className="bar"><i style={{ width: `${Math.max(0, Math.min(100, (value / max) * 100))}%` }} /></div>
      <b>{value}</b>{note && <small>{note}</small>}
    </div>
  );
}
export function StatBlock({ stats }: { stats: Stats }) {
  return (
    <div className="statblock">
      <StatRow label="耐久力" value={stats.hp} max={130} tone="hp" />
      <StatRow label="攻撃力" value={stats.attack} max={40} tone="atk" />
      <StatRow label="速度" value={stats.speed} max={20} tone="spd" />
    </div>
  );
}
export function Tags({ stats }: { stats: Stats }) {
  const tags = [stats.armor ? ['good', `装甲 ${stats.armor}`] : null, stats.coldWeak ? ['warn', '冷気に弱い'] : null, stats.poison ? ['info', '毒'] : null, stats.regen ? ['info', '再生'] : null].filter(Boolean) as [string, string][];
  return tags.length ? <div className="tags">{tags.map(([tone, text]) => <span key={text} className={tone}>{text}</span>)}</div> : null;
}
export function UnitCard({ unit, selected, onSelect }: { unit: Unit; selected?: boolean; onSelect?: () => void }) {
  const body = (
    <>
      <header><MonsterIcon id={recipeFor(unit.design)!.id} /><strong>{unit.name}</strong><small>{unit.wins}勝 {unit.losses}敗</small></header>
      <p>{designLabel(unit.design)}</p>
      <div className="mini"><span>耐久 {unit.stats.hp}</span><span>攻撃 {unit.stats.attack}</span><span>速度 {unit.stats.speed}</span></div>
      <Tags stats={unit.stats} />
    </>
  );
  return onSelect ? <button className={`unit ${selected ? 'selected' : ''}`} onClick={onSelect} aria-pressed={selected}>{body}</button> : <div className="unit">{body}</div>;
}

/** 3D舞台をReactに載せる。作成に失敗した環境では案内を表示する。 */
export function Canvas3D<T extends { dispose: () => void }>({ create, onReady, className = '' }: { create: (host: HTMLElement) => T; onReady?: (scene: T | null) => void; className?: string }) {
  const host = useRef<HTMLDivElement>(null), made = useRef(create), ready = useRef(onReady);
  ready.current = onReady;
  useEffect(() => {
    const el = host.current;
    if (!el) return;
    let scene: T | null = null;
    try { scene = made.current(el); } catch (e) { console.error(e); el.dataset.failed = 'true'; }
    ready.current?.(scene);
    return () => { ready.current?.(null); scene?.dispose(); };
  }, []);
  return <div ref={host} className={`canvas3d ${className}`} data-testid="canvas3d"><p className="canvas-fallback">3D表示を開始できませんでした。ブラウザのハードウェアアクセラレーションを確認してください。</p></div>;
}
