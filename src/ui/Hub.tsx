import { Reading } from './Reading';
import { WalkControls } from './WalkControls';
import { useCallback, useEffect, useRef, useState } from 'react';
import { activeStaffIds, cast, type StaffId } from '../data/cast';
import { enemies, type EnemyId } from '../data/enemies';
import { advice, consultationReflection } from '../data/script';
import { hangarSize, nicknamePresets, unitTitle } from '../domain/manufacture';
import { chapterOf, chapterTitle, dayOf, knownEnemies, stepOf } from '../domain/progress';
import { useGame } from '../state/store';
import { LineScene } from '../three/line';
import { soundEnabled, toggleSound } from '../three/sound';
import { Canvas3D, UnitCard } from './common';
import { resolveMood } from '../domain/story';
import { Portrait, Thumb } from './Portrait';
import { CreatureArt } from './CreatureArt';
import { MoveEditor } from './MoveEditor';
import { enemySkills } from '../data/skills';

export function EnemyInfo({ id }: { id: EnemyId }) {
  const e = enemies[id];
  return (
    <div className="enemy-info">
      <CreatureArt id={id} />
      <strong>{e.name}</strong>
      <span>耐久 {e.hp}</span><span>攻撃 {e.attack}</span><span>速度 {e.speed}</span>
      <p>{e.note}</p>
      <p className="move-summary">{enemySkills[id].map(s => s.name).join(' → ')}</p>
    </div>
  );
}

function Consult({ enemy, onClose }: { enemy: EnemyId; onClose: () => void }) {
  const [who, setWho] = useState<StaffId>('lisette'), [i, setI] = useState(0);
  const day = useGame(s => dayOf(s.progress));
  const members = activeStaffIds(day);
  const lines = [...advice[enemy][who], consultationReflection(who, day)], c = cast[who];
  const mood = resolveMood({ t: 'say', who, text: lines[i] });
  useEffect(() => { const k = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); }; window.addEventListener('keydown', k); return () => window.removeEventListener('keydown', k); }, [onClose]);
  return (
    <div className="modal" role="dialog" aria-label="仲間に相談">
      <div className="consult">
        <Portrait id={who} mood={mood} pulseKey={i} className="consult-portrait speaking" />
        <div className="consult-main">
          <div className="consult-tabs">
            {members.map(id => <button key={id} aria-pressed={id === who} onClick={() => { setWho(id); setI(0); }}><Thumb id={id} />{cast[id].name}</button>)}
          </div>
          <div className="textbox say static">
            <div className="nameplate" style={{ borderColor: c.color }}><strong>{c.name}</strong><small>{c.role}</small></div>
            <p><Reading text={lines[i]} /></p>
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
  const { progress, roster, lastBuilt, moved, go, startBattle, toTitle, setUnitMoves, setUnitNickname } = useGame();
  const step = stepOf(progress), objective = step.kind === 'objective' ? step : null;
  const chapter = chapterOf(progress);
  const known = knownEnemies(progress);
  const [selected, setSelected] = useState<number | null>(lastBuilt ?? roster[roster.length - 1]?.id ?? null);
  const [enemy, setEnemy] = useState<EnemyId>(objective?.enemy ?? 'swordsman');
  const [consult, setConsult] = useState(false);
  const [sound, setSound] = useState(soundEnabled);
  const [walking, setWalking] = useState(false);
  const endWalk = useCallback(() => setWalking(false), []);
  const scene = useRef<LineScene | null>(null);
  const unit = roster.find(u => u.id === selected) ?? null;
  useEffect(() => { scene.current?.showIdle(unit?.design ?? null); }, [unit]);
  const ready = useCallback((s: LineScene | null) => { scene.current = s; s?.showIdle(unit?.design ?? null); }, []); // eslint-disable-line react-hooks/exhaustive-deps
  if (!objective) return null;
  const practice = enemy !== objective.enemy;
  return (
    <div className={walking ? "screen hub walking" : "screen hub"} data-testid="hub">
      <Canvas3D className="fill" create={h => new LineScene(h)} onReady={ready} />
      <div className="shade-top" /><div className="shade-bottom" />
      <header className="hud-top">
        <div className="chapter"><small>{chapterTitle(chapter)}</small><strong>{dayOf(progress)}日目</strong><em>約束の日まであと{Math.max(0, 100 - dayOf(progress))}日</em>{objective.raid && <em>迎撃</em>}</div>
        <div className="objective panel">
          <small>{objective.raid ? '迎撃' : '目標'}</small>
          <h2><Reading text={objective.title} /></h2>
          <p><Reading text={objective.text} /></p>
          <EnemyInfo id={objective.enemy} />
        </div>
      </header>
      <aside className="hangar panel" tabIndex={-1}>
        <h2><Reading text="格納庫" /> <small>{roster.length} / {hangarSize}</small></h2>
        {roster.length === 0 && <p className="empty">まだ魔物がいません。配合台で材料を選んで、最初の命をつくりましょう。</p>}
        {[...roster].reverse().map(u => <UnitCard key={u.id} unit={u} selected={u.id === selected} onSelect={() => setSelected(u.id)} />)}
        {unit && (
          <>
            <MoveEditor recipe={unit.stats.recipe} selected={unit.stats.moves} onChange={moves => setUnitMoves(unit.id, moves)} />
            <section className="nickname-editor" aria-label="個体の愛称">
              <h3>愛称（名付け）</h3>
              <input
                type="text"
                aria-label="愛称入力"
                maxLength={20}
                placeholder={unit.name}
                value={unit.nickname ?? ''}
                onChange={e => setUnitNickname(unit.id, e.target.value)}
              />
              <div className="nickname-presets">
                {nicknamePresets[unit.stats.recipe].map(preset => (
                  <button key={preset} type="button" onClick={() => setUnitNickname(unit.id, preset)}>{preset}</button>
                ))}
                {unit.nickname && <button type="button" onClick={() => setUnitNickname(unit.id, '')}>戻す</button>}
              </div>
            </section>
          </>
        )}
        {moved > 0 && <p className="note">療養棟で休んでいる個体：{moved}体</p>}
      </aside>
      <footer className="hud-bottom"><button className="big" onClick={() => setWalking(true)}>工場を歩く</button>
        <button className="big" onClick={() => go('design')} data-testid="go-design"><b>配合台へ</b><small>2F 研究フロア ／ 二つの材料から魔物をつくる</small></button>
        <div className="sortie">
          {known.length > 1 && (
            <div className="segmented" role="group" aria-label="相手">
              {known.map(id => <button key={id} aria-pressed={id === enemy} onClick={() => setEnemy(id)}>{enemies[id].name}{id === objective.enemy ? '（目標）' : ''}</button>)}
            </div>
          )}
          <button className="big primary" disabled={!unit || !!unit.away || (!!objective.fresh && !practice && unit.id < (progress.cohort ?? 1))} onClick={() => unit && startBattle(unit.id, enemy)} data-testid="go-battle">
            <b>{practice ? '練習試合' : objective.raid ? '敵をむかえうつ' : '練習戦に出す'}</b>
            <small>{unit?.away ? 'この子は製造ラインの中です' : objective.fresh && !practice && unit && unit.id < (progress.cohort ?? 1) ? 'この目標が出たあとに作った魔物を選んでください' : unit ? `${unitTitle(unit)} ／ 相手：${enemies[enemy].name}` : '格納庫から魔物を選んでください'}</small>
          </button>
        </div>
        <button className="big" onClick={() => setConsult(true)}><b>仲間に相談</b><small>いまの相手について聞く</small></button>
        <button className="ghost" onClick={() => setSound(toggleSound())} aria-pressed={sound}>サウンド：{sound ? '入' : '切'}<small>BGM・効果音</small></button>
        <button className="ghost" onClick={toTitle}>タイトルへ<small>進行は自動保存されます</small></button>
      </footer>
      {walking && <WalkControls scene={scene} close={endWalk} design={() => go('design')} hangar={() => { endWalk(); requestAnimationFrame(() => document.querySelector<HTMLElement>('.hangar')?.focus()); }} />}
      {consult && <Consult enemy={objective.enemy} onClose={() => setConsult(false)} />}
    </div>
  );
}



