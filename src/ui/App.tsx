import { useMemo, useState } from 'react';
import { clearSave, readSave } from '../domain/save';
import { dayOf, sceneOf, viewOf } from '../domain/progress';
import type { GameData } from '../domain/save';
import { useGame } from '../state/store';
import { Backdrop } from './Backdrop';
import { BattleScreen } from './BattleScreen';
import { DesignScreen } from './DesignScreen';
import { Hub } from './Hub';
import { ManufactureScreen } from './ManufactureScreen';
import { StoryPlayer } from './StoryPlayer';

function Title() {
  const newGame = useGame(s => s.newGame), resume = useGame(s => s.resume);
  const [confirm, setConfirm] = useState(false);
  const save = useMemo<{ data: GameData | null; error: string | null }>(() => {
    try { return { data: readSave(), error: null }; } catch (e) { return { data: null, error: e instanceof Error ? e.message : '保存データを読み込めませんでした' }; }
  }, []);
  const start = () => { clearSave(); newGame(); };
  return (
    <div className="screen title" data-testid="title">
      <Backdrop bg="exterior" />
      <div className="story-vignette" />
      <div className="title-body">
        <small>魔王軍 第七魔物製造工場</small>
        <h1>モンスター製造課</h1>
        <p className="subtitle">～ 魔王軍最後の工場 ～</p>
        <div className="title-menu">
          {save.data && <button className="big primary" onClick={() => resume(save.data!)} data-testid="continue"><b>つづきから</b><small>{viewOf(save.data.progress) === 'end' ? '第1章 完' : `第1章 ${Math.max(1, dayOf(save.data.progress))}日目`} ／ 格納庫 {save.data.roster.length}体</small></button>}
          {confirm ? (
            <div className="panel confirm">
              <p>保存されている進行を消して、最初から始めます。</p>
              <div className="row"><button className="primary" onClick={start} data-testid="confirm-new">はじめから始める</button><button onClick={() => setConfirm(false)}>やめる</button></div>
            </div>
          ) : (
            <button className={`big ${save.data ? '' : 'primary'}`} onClick={() => (save.data ? setConfirm(true) : start())} data-testid="new-game"><b>はじめから</b><small>序章「特命」</small></button>
          )}
        </div>
        {save.error && <p className="note warn">保存データを読み込めませんでした（{save.error}）。</p>}
        <p className="note">体験版：序章〜第1章。進行はこのブラウザに自動保存されます。ブラウザのデータを消すと失われます。</p>
        <p className="note">二つの材料から、ひとつの命。6種類の魔物と、それぞれの固有技を発見してください。</p>
      </div>
    </div>
  );
}

function Ending() {
  const { nextId, battles, roster, toTitle } = useGame();
  return (
    <div className="screen ending" data-testid="ending">
      <Backdrop bg="lab" />
      <div className="story-vignette" />
      <div className="ending-body">
        <small>第1章　最後の工場</small>
        <h1>完</h1>
        <div className="blueprint" aria-label="王の設計図">
          <strong>王の設計図</strong>
          <p>まだ、何も書かれていない。</p>
        </div>
        <p className="tally">製造した個体 {nextId - 1}体 ／ 戦闘 {battles}回 ／ 格納庫 {roster.length}体</p>
        <p className="next">次章「王の部品」　――　制作中</p>
        <button className="big primary" onClick={toTitle} data-testid="to-title"><b>タイトルへ戻る</b></button>
      </div>
    </div>
  );
}

export function App() {
  const started = useGame(s => s.started), progress = useGame(s => s.progress), sub = useGame(s => s.sub);
  if (!started) return <Title />;
  const view = viewOf(progress), scene = sceneOf(progress);
  if (sub === 'battle') return <BattleScreen />;
  if (sub === 'manufacture') return <ManufactureScreen />;
  if (view === 'story' && scene) return <StoryPlayer key={`${scene}-${progress.step}-${progress.seen.length}`} sceneId={scene} />;
  if (view === 'end') return <Ending />;
  return sub === 'design' ? <DesignScreen /> : <Hub />;
}
