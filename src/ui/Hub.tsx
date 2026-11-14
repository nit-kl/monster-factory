import { useCallback, useEffect, useRef, useState } from 'react';
import { cast, staffIds, type StaffId } from '../data/cast';
import { enemies, type EnemyId } from '../data/enemies';
import { advice } from '../data/script';
import { hangarSize } from '../domain/manufacture';
import { dayOf, knownEnemies, stepOf } from '../domain/progress';
import { useGame } from '../state/store';
import { LineScene } from '../three/line';
import { Canvas3D, UnitCard } from './common';
import { Portrait, Thumb } from './Portrait';
import { CreatureArt } from './CreatureArt';

export function EnemyInfo({ id }: { id: EnemyId }) {
  const e = enemies[id];
  return (
    <div className="enemy-info">
      <CreatureArt id={id} />
      <strong>{e.name}</strong>
      <span>耐久 {e.hp}</span><span>攻撃 {e.attack}</span><span>速度 {e.speed}</span>
      <p>{e.note}</p>
    </div>
  );
}

function Consult({ enemy, onClose }: { enemy: EnemyId; onClose: () => void }) {
  const [who, setWho] = useState<StaffId>('lisette'), [i, setI] = useState(0);
  const lines = advice[enemy][who], c = cast[who];
  useEffect(() => { const k = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); }; window.addEventListener('keydown', k); return () => window.removeEventListener('keydown', k); }, [onClose]);
  return (
    <div className="modal" role="dialog" aria-label="仲間に相談">
      <div className="consult">
        <Portrait id={who} className="consult-portrait speaking" />
        <div className="consult-main">
          <div className="consult-tabs">
            {staffIds.map(id => <button key={id} aria-pressed={id === who} onClick={() => { setWho(id); setI(0); }}><Thumb id={id} />{cast[id].name}</button>)}
          </div>
          <div className="textbox say static">
            <div className="nameplate" style={{ borderColor: c.color }}><strong>{c.name}</strong><small>{c.role}</small></div>
            <p>{lines[i]}</p>
          </div>
          <div className="row end">
            {i < lines.length - 1 ? <button className="primary" onClick={() => setI(i + 1)}>続きを聞く</button> : <button className="primary" onClick={onClose}>ありがとう</button>}
            <button onClick={onClose}>閉じる</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Hub() {
  const { progress, roster, lastBuilt, moved, go, startBattle, toTitle } = useGame();
  const step = stepOf(progress), objective = step.kind === 'objective' ? step : null;
  const known = knownEnemies(progress);
  const [selected, setSelected] = useState<number | null>(lastBuilt ?? roster[roster.length - 1]?.id ?? null);
  const [enemy, setEnemy] = useState<EnemyId>(objective?.enemy ?? 'swordsman');
  const [consult, setConsult] = useState(false);
  const scene = useRef<LineScene | null>(null);
  const unit = roster.find(u => u.id === selected) ?? null;
  useEffect(() => { scene.current?.showIdle(unit?.design ?? null); }, [unit]);
  const ready = useCallback((s: LineScene | null) => { scene.current = s; s?.showIdle(unit?.design ?? null); }, []); // eslint-disable-line react-hooks/exhaustive-deps
  if (!objective) return null;
  const practice = enemy !== objective.enemy;
  return (
    <div className="screen hub" data-testid="hub">
      <Canvas3D className="fill" create={h => new LineScene(h)} onReady={ready} />
      <div className="shade-top" /><div className="shade-bottom" />
      <header className="hud-top">
        <div className="chapter"><small>第1章　最後の工場</small><strong>{dayOf(progress)}日目</strong>{objective.raid && <em>先遣隊 襲来</em>}</div>
        <div className="objective panel">
          <small>{objective.raid ? '迎撃' : '目標'}</small>
          <h2>{objective.title}</h2>
          <p>{objective.text}</p>
          <EnemyInfo id={objective.enemy} />
        </div>
      </header>
      <aside className="hangar panel">
        <h2>格納庫 <small>{roster.length} / {hangarSize}</small></h2>
        {roster.length === 0 && <p className="empty">まだ個体がいません。設計台で最初の個体を設計しましょう。</p>}
        {[...roster].reverse().map(u => <UnitCard key={u.id} unit={u} selected={u.id === selected} onSelect={() => setSelected(u.id)} />)}
        {moved > 0 && <p className="note">療養棟で休んでいる個体：{moved}体</p>}
      </aside>
      <footer className="hud-bottom">
        <button className="big" onClick={() => go('design')} data-testid="go-design"><b>設計台へ</b><small>2F 研究フロア ／ 設計して製造する</small></button>
        <div className="sortie">
          {known.length > 1 && (
            <div className="segmented" role="group" aria-label="相手">
              {known.map(id => <button key={id} aria-pressed={id === enemy} onClick={() => setEnemy(id)}>{enemies[id].name}{id === objective.enemy ? '（目標）' : ''}</button>)}
            </div>
          )}
          <button className="big primary" disabled={!unit} onClick={() => unit && startBattle(unit.id, enemy)} data-testid="go-battle">
            <b>{practice ? '練習試合' : objective.raid ? '迎撃に出す' : '模擬戦に出す'}</b>
            <small>{unit ? `${unit.name} ／ 相手：${enemies[enemy].name}` : '格納庫の個体を選んでください'}</small>
          </button>
        </div>
        <button className="big" onClick={() => setConsult(true)}><b>仲間に相談</b><small>いまの相手について聞く</small></button>
        <button className="ghost" onClick={toTitle}>タイトルへ<small>進行は自動保存されます</small></button>
      </footer>
      {consult && <Consult enemy={objective.enemy} onClose={() => setConsult(false)} />}
    </div>
  );
}
