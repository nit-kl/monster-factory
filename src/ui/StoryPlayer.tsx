import { Reading } from './Reading';
import { useCallback, useEffect, useRef, useState } from 'react';
import { cast } from '../data/cast';
import { scenes } from '../data/script';
import { advance, begin, current, resolveMood, type BgId, type CastId, type CgId, type Cursor, type Fx, type Mood, type MapStep } from '../domain/story';
import { useGame } from '../state/store';
import { Backdrop } from './Backdrop';
import { EventCg } from './EventCg';
import { Portrait } from './Portrait';

type LogEntry = { name?: string; text: string };
type View = {
  cursor: Cursor;
  bg: BgId;
  cg: { id: CgId; caption?: string; mapStep?: MapStep } | null;
  left: CastId | null;
  right: CastId | null;
  leftMood: Mood;
  rightMood: Mood;
  pulse: number;
  last: CastId | null;
  fx: { kind: Fx; n: number } | null;
  flags: string[];
  log: LogEntry[];
};


/** 背景・演出・一枚絵・立ち位置など、表示を伴わない行をまとめて処理する。 */
function settle(v: View): View {
  let next = v;
  for (;;) {
    const line = current(next.cursor);
    if (!line) return next;
    const step = () => advance(next.cursor, new Set(next.flags)).cursor;
    if (line.t === 'bg') next = { ...next, bg: line.bg, cg: null, cursor: step() };
    else if (line.t === 'cg') next = { ...next, cg: line.cg ? { id: line.cg, caption: line.caption, mapStep: line.mapStep } : null, cursor: step() };
    else if (line.t === 'fx') next = { ...next, fx: { kind: line.fx, n: (next.fx?.n ?? 0) + 1 }, cursor: step() };
    else if (line.t === 'clear') next = { ...next, cg: null, left: null, right: null, leftMood: 'normal', rightMood: 'normal', last: null, cursor: step() };
    else {
      if (line.t === 'say') {
        const mood = resolveMood(line);
        if (cast[line.who].shade !== 'none' && line.who !== next.left && line.who !== next.right) {
          if (!next.left) next = { ...next, left: line.who, leftMood: mood };
          else if (!next.right) next = { ...next, right: line.who, rightMood: mood };
          else if (next.last === next.left) next = { ...next, right: line.who, rightMood: mood };
          else next = { ...next, left: line.who, leftMood: mood };
        } else if (line.who === next.left) {
          next = { ...next, leftMood: mood };
        } else if (line.who === next.right) {
          next = { ...next, rightMood: mood };
        }
        return { ...next, last: line.who, pulse: next.pulse + 1 };
      }
      return next;
    }
  }
}
function proceed(v: View, choiceIndex = 0): View {
  const line = current(v.cursor);
  if (!line) return v;
  const entry: LogEntry | null = line.t === 'say' ? { name: line.as ?? cast[line.who].name, text: line.text }
    : line.t === 'narr' ? { text: line.text } : line.t === 'choice' ? { name: 'あなた', text: line.options[choiceIndex].label } : null;
  const { cursor, flag } = advance(v.cursor, new Set(v.flags), choiceIndex);
  return settle({ ...v, cursor, flags: flag ? [...v.flags, flag] : v.flags, log: entry ? [...v.log, entry] : v.log });
}

export function StoryPlayer({ sceneId }: { sceneId: string }) {
  const finishScene = useGame(s => s.finishScene), saved = useGame(s => s.progress.flags);
  const [view, setView] = useState<View>(() => settle({
    cursor: begin(scenes[sceneId] ?? [], new Set(saved)),
    bg: 'black',
    cg: null,
    left: null,
    right: null,
    leftMood: 'normal',
    rightMood: 'normal',
    pulse: 0,
    last: null,
    fx: null,
    flags: [...saved],
    log: [],
  }));
  const [chars, setChars] = useState(0), [auto, setAuto] = useState(false), [showLog, setShowLog] = useState(false);
  const line = current(view.cursor);
  const text = line && (line.t === 'say' || line.t === 'narr') ? line.text : '';
  const typing = chars < text.length;
  const done = useRef(false);

  useEffect(() => { setChars(0); }, [view.cursor]);
  useEffect(() => {
    if (!typing) return;
    const id = window.setInterval(() => setChars(c => c + 1), 26);
    return () => window.clearInterval(id);
  }, [typing, view.cursor]);
  useEffect(() => {
    if (!line && !done.current) { done.current = true; finishScene(view.flags.filter(f => !saved.includes(f))); }
  }, [line, finishScene, view.flags, saved]);

  const next = useCallback(() => {
    if (!line || line.t === 'choice' || showLog) return;
    if (typing) setChars(text.length); else setView(v => proceed(v));
  }, [line, typing, text.length, showLog]);
  const skip = useCallback(() => setView(v => { let n = v; for (let i = 0; i < 500; i++) { const l = current(n.cursor); if (!l || l.t === 'choice') break; n = proceed(n); } return n; }), []);

  useEffect(() => {
    const wait = line?.t === 'title' ? 2600 : auto && !typing && line && line.t !== 'choice' ? 1500 + text.length * 45 : 0;
    if (!wait || showLog) return;
    const id = window.setTimeout(() => setView(v => proceed(v)), wait);
    return () => window.clearTimeout(id);
  }, [auto, typing, line, text.length, showLog]);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); next(); }
      else if (e.key === 'Escape') setShowLog(false);
      else if (line?.t === 'choice' && /^[1-9]$/.test(e.key) && Number(e.key) <= line.options.length) setView(v => proceed(v, Number(e.key) - 1));
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [next, line]);

  const speaker = line?.t === 'say' ? line.who : null;
  const speakerMood = line?.t === 'say' ? resolveMood(line) : 'normal';
  const name = line?.t === 'say' ? line.as ?? cast[line.who].name : null;
  return (
    <div className={`screen story ${view.cg ? 'has-cg' : ''} ${view.fx?.kind === 'shake' ? `shake-${view.fx.n % 2}` : ''}`} data-testid="story" data-scene={sceneId}>
      <Backdrop bg={view.bg} />
      <div className="story-vignette" />
      {view.fx && view.fx.kind !== 'shake' && <div key={view.fx.n} className={`story-${view.fx.kind}`} />}
      <div className="portraits">
        {view.left && <Portrait key={view.left} id={view.left} mood={view.leftMood} pulseKey={speaker === view.left ? view.pulse : 0} className={`left ${speaker === view.left ? 'speaking' : 'dim'}`} />}
        {view.right && <Portrait key={view.right} id={view.right} mood={view.rightMood} pulseKey={speaker === view.right ? view.pulse : 0} className={`right ${speaker === view.right ? 'speaking' : 'dim'}`} />}
      </div>
      {view.cg && <EventCg key={view.cg.id} id={view.cg.id} caption={view.cg.caption} mapStep={view.cg.mapStep} />}
      <div className="story-click" onClick={next} aria-hidden="true" />
      {line?.t === 'title' && (
        <div className="titlecard" onClick={next}><span>{line.over}</span><strong><Reading text={line.main} /></strong></div>
      )}
      {line?.t === 'choice' && (
        <div className="choices" role="group" aria-label="選択肢">
          {line.options.map((o, i) => <button key={o.label} onClick={() => setView(v => proceed(v, i))}><kbd>{i + 1}</kbd><Reading text={o.label} /></button>)}
        </div>
      )}
      {(line?.t === 'say' || line?.t === 'narr') && (
        <div className={`textbox ${line.t} mood-box-${speakerMood}`} onClick={next}>
          {name && (
            <div className="nameplate" style={{ borderColor: speaker ? cast[speaker].color : undefined }}>
              <strong><Reading text={name} /></strong>
              {speaker && <small><Reading text={cast[speaker].role} /></small>}
            </div>
          )}
          <p aria-live="polite"><span><Reading text={text.slice(0, chars)} /></span><span className="ghost"><Reading text={text.slice(chars)} /></span></p>
          {!typing && <i className="more" aria-hidden="true">▼</i>}
        </div>
      )}
      <div className="story-controls">
        <button onClick={() => setAuto(a => !a)} aria-pressed={auto}>オート{auto ? '：入' : ''}</button>
        <button onClick={skip}>スキップ</button>
        <button onClick={() => setShowLog(true)}>ログ</button>
      </div>
      {showLog && (
        <div className="log" role="dialog" aria-label="会話のログ">
          <header><h2>ログ</h2><button onClick={() => setShowLog(false)}>閉じる</button></header>
          <div className="log-body">
            {view.log.length ? view.log.map((l, i) => <p key={i}>{l.name && <strong>{l.name}</strong>}<Reading text={l.text} /></p>) : <p>まだ記録がありません。</p>}
          </div>
        </div>
      )}
    </div>
  );
}

