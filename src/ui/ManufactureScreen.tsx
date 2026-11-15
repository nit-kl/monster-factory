import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { cast } from '../data/cast';
import { lineComments } from '../data/lineComments';
import { calculate, unitName, recipeFor } from '../domain/design';
import { MonsterIcon, MaterialIcon } from './RecipeArt';
import { groupNames, lineAt, lineStages, stageGroup, totalDuration } from '../domain/manufacture';
import { useGame } from '../state/store';
import { LineScene } from '../three/line';
import { chimeSound } from '../three/sound';
import { Canvas3D, designLabel, StatBlock, Tags } from './common';
import { Thumb } from './Portrait';
import { MoveSummary } from './MoveEditor';

export function ManufactureScreen() {
  const building = useGame(s => s.building), nextId = useGame(s => s.nextId), complete = useGame(s => s.completeManufacture);
  const [ms, setMs] = useState(0), [fast, setFast] = useState(false);
  const scene = useRef<LineScene | null>(null), last = useRef(0);
  const comments = useMemo(() => (building ? lineComments(building) : {}), [building]);
  const ready = useCallback((s: LineScene | null) => {
    scene.current = s;
    const d = useGame.getState().building;
    if (!s || !d) return;
    s.onTick = t => { if (t - last.current > 80 || t >= totalDuration()) { last.current = t; setMs(t); } };
    s.run(d);
  }, []);
  if (!building) return null;
  const total = totalDuration(), at = lineAt(ms), group = stageGroup[at.stage], stats = calculate(building);
  useEffect(() => { if (at.done) chimeSound('birth'); }, [at.done]);
  const comment = [...lineStages.slice(0, at.index + 1)].reverse().map(s => comments[s]).find(Boolean);
  const measured = at.index >= 6;
  const recipe = recipeFor(building)!;
  return (
    <div className="screen manufacture" data-testid="manufacture-screen" data-done={at.done}>
      <Canvas3D className="fill" create={h => new LineScene(h)} onReady={ready} />
      <div className="shade-top" /><div className="shade-bottom" />
      <header className="hud-top">
        <div className="chapter"><small>1F 製造フロア</small><strong>製造ライン</strong></div>
        <ol className="stepper" aria-label="製造の進行">
          {groupNames.map((n, i) => <li key={n} className={i < group || at.done ? 'done' : i === group ? 'now' : ''}><span>{i + 1}</span>{n}</li>)}
          <div className="progress"><i style={{ width: `${(ms / total) * 100}%` }} /></div>
        </ol>
      </header>
      {!at.done && (
        <aside className="spec panel">
          <small>製造中の設計</small>
          <h2>{measured ? unitName(building, nextId) : '新しい命を形成中'}</h2>
          <div className="material-pair"><MaterialIcon id={building.first} /><span>×</span><MaterialIcon id={building.second} /></div>
          <p>{designLabel(building)}</p>
          <MoveSummary recipe={recipe.id} selected={building.moves} />
          {measured ? <><StatBlock stats={stats} /><Tags stats={stats} /></> : <p className="note">性能は品質検査で測定します。</p>}
        </aside>
      )}
      {comment && !at.done && (
        <div className="toast" key={comment.text}>
          <Thumb id={comment.who} />
          <div><strong style={{ color: cast[comment.who].color }}>{cast[comment.who].name}</strong><p>{comment.text}</p></div>
        </div>
      )}
      {at.done ? (
        <div className="modal result-modal">
          <div className="finished panel">
            <MonsterIcon id={recipe.id} />
            <small>完成</small>
            <h2>{unitName(building, nextId)}</h2>
            <p>{recipe.epithet}</p>
            <strong>{recipe.skill}</strong>
            <p>{recipe.skillNote}</p>
            <StatBlock stats={stats} />
            <Tags stats={stats} />
            <button className="big primary" onClick={complete} data-testid="to-hangar"><b>格納庫へ</b><small>個体を受け取る</small></button>
          </div>
        </div>
      ) : (
        <footer className="hud-bottom right">
          <button onClick={() => { const f = !fast; setFast(f); if (scene.current) scene.current.speed = f ? 2.5 : 1; }} aria-pressed={fast}>早送り{fast ? '：入' : ''}</button>
          <button onClick={() => { scene.current?.skip(); setMs(total); }} data-testid="skip-line">完成まで飛ばす</button>
        </footer>
      )}
    </div>
  );
}
