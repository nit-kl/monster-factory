import { Dispatch } from './Dispatch';
import { Reading } from './Reading';
import { WalkControls } from './WalkControls';
import { useCallback, useEffect, useRef, useState } from 'react';
import { activeStaffIds, cast, type StaffId } from '../data/cast';
import { consultationReflection } from '../data/script';
import { hangarSize, nicknamePresets,  } from '../domain/manufacture';
import { chapterOf, chapterTitle, dayOf, stepOf } from '../domain/progress';
import { useGame } from '../state/store';
import { LineScene } from '../three/line';
import { soundEnabled, toggleSound } from '../three/sound';
import { Canvas3D, UnitCard } from './common';
import { resolveMood } from '../domain/story';
import { Portrait, Thumb } from './Portrait';
import { MoveEditor } from './MoveEditor';

function Consult({ onClose }: { onClose: () => void }) {
  const [who, setWho] = useState<StaffId>('lisette');
  const day = useGame(s => dayOf(s.progress));
  const members = activeStaffIds(day);
  const line = consultationReflection(who, day), c = cast[who];
  const mood = resolveMood({ t: 'say', who, text: line });
  useEffect(() => { const k = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); }; window.addEventListener('keydown', k); return () => window.removeEventListener('keydown', k); }, [onClose]);
  return (
    <div className="modal" role="dialog" aria-label="仲間に相談">
      <div className="consult">
        <Portrait id={who} mood={mood} key={who} className="consult-portrait speaking" />
        <div className="consult-main">
          <div className="consult-tabs">
            {members.map(id => <button key={id} aria-pressed={id === who} onClick={() => setWho(id)}><Thumb id={id} />{cast[id].name}</button>)}
          </div>
          <div className="textbox say static">
            <div className="nameplate" style={{ borderColor: c.color }}><strong>{c.name}</strong><small>{c.role}</small></div>
            <p><Reading text={line} /></p>
          </div>
          <div className="row end">
            <button onClick={onClose}>閉じる</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Hub() {
  const { progress, roster, lastBuilt, moved, go, continueStory, toTitle, setUnitMoves, setUnitNickname } = useGame();
  const step = stepOf(progress), objective = step.kind === 'objective' ? step : null;
  const chapter = chapterOf(progress);
  const [selected, setSelected] = useState<number | null>(lastBuilt ?? roster[roster.length - 1]?.id ?? null);
  const [consult, setConsult] = useState(false);
  const [sound, setSound] = useState(soundEnabled);
  const [walking, setWalking] = useState(false);
  const endWalk = useCallback(() => setWalking(false), []);
  const scene = useRef<LineScene | null>(null);
  const unit = roster.find(u => u.id === selected) ?? null;
  useEffect(() => { scene.current?.showIdle(unit?.design ?? null); }, [unit]);
  const ready = useCallback((s: LineScene | null) => { scene.current = s; s?.showIdle(unit?.design ?? null); }, []); // eslint-disable-line react-hooks/exhaustive-deps
  const [investigating, investigate] = useState(false);
  if (investigating) return <Dispatch close={() => investigate(false)} />;
  if (!objective) return null;
  return (
    <div className={walking ? "screen hub walking" : "screen hub"} data-testid="hub">
      <Canvas3D className="fill" create={h => new LineScene(h)} onReady={ready} />
      <div className="shade-top" /><div className="shade-bottom" />
      <header className="hud-top">
        <div className="chapter"><small>{chapterTitle(chapter)}</small><strong>{dayOf(progress)}日目</strong><em>約束の日まであと{Math.max(0, 100 - dayOf(progress))}日</em></div>
        <div className="objective panel">
          <small>目標</small>
          <h2><Reading text="工場での準備" /></h2>
          <p><Reading text={roster.length ? "準備ができたら物語を進めましょう。" : "配合台で最初の魔物を製造しましょう。"} /></p>
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
      <footer className="hud-bottom"><button className="big" onClick={() => investigate(true)}>現場調査へ</button><button className="big" onClick={() => setWalking(true)}>工場を歩く</button>
        <button className="big" onClick={() => go('design')} data-testid="go-design"><b>配合台へ</b><small>2F 研究フロア ／ 二つの材料から魔物をつくる</small></button>
        <button className="big primary" disabled={!roster.length} onClick={continueStory} data-testid="continue-story">物語を進める</button>
        <button className="big" onClick={() => setConsult(true)}><b>仲間に相談</b><small>工場の様子を聞く</small></button>
        <button className="ghost" onClick={() => setSound(toggleSound())} aria-pressed={sound}>サウンド：{sound ? '入' : '切'}<small>BGM・効果音</small></button>
        <button className="ghost" onClick={toTitle}>タイトルへ<small>進行は自動保存されます</small></button>
      </footer>
      {walking && <WalkControls scene={scene} close={endWalk} design={() => go('design')} hangar={() => { endWalk(); requestAnimationFrame(() => document.querySelector<HTMLElement>('.hangar')?.focus()); }} />}
      {consult && <Consult onClose={() => setConsult(false)} />}
    </div>
  );
}



