import { useEffect, useMemo, useState } from 'react';
import { clearSave, readSave } from '../domain/save';
import { blueprintTraits, chapterOf, chapterTitle, dayOf, sceneOf, viewOf } from '../domain/progress';
import type { GameData } from '../domain/save';
import { useGame } from '../state/store';
import { setSceneMood } from '../three/sound';
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
          {save.data && <button className="big primary" onClick={() => resume(save.data!)} data-testid="continue"><b>つづきから</b><small>{viewOf(save.data.progress) === 'end' ? `第${chapterOf(save.data.progress)}章 完` : `第${chapterOf(save.data.progress)}章 ${Math.max(1, dayOf(save.data.progress))}日目`} ／ 格納庫 {save.data.roster.length}体</small></button>}
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
        <p className="note">全6章（序章〜終章「王を設計する」）収録。進行はこのブラウザに自動保存されます。</p>
        <p className="note">二つの材料から、ひとつの命。6種類の魔物と、それぞれの固有技を発見してください。</p>
      </div>
    </div>
  );
}

const nextChapterButtonLabel: Record<1 | 2 | 3 | 4 | 5, { title: string; sub: string; testId: string }> = {
  1: { title: '第2章「孤立無援の防衛戦」へ進む', sub: '包囲された谷門と先遣隊の総攻撃', testId: 'start-chapter2' },
  2: { title: '第3章「王の部品」へ進む', sub: '特別資材の到着と暴かれる密命', testId: 'start-chapter3' },
  3: { title: '第4章「勇者の影」へ進む', sub: '白布の騎士ノアと魔導技師ルカ', testId: 'start-chapter4' },
  4: { title: '第5章「先代の遺言」へ進む', sub: '青い硝子の指輪の侍女と三年前の真実', testId: 'start-chapter5' },
  5: { title: '終章「王を設計する」へ進む', sub: '設計台の空席と戦わない王の王命', testId: 'start-chapter6' },
};

function Ending() {
  const { progress, discovered, nextId, battles, roster, advanceChapter, toTitle } = useGame();
  const chapter = chapterOf(progress);
  const traits = blueprintTraits(progress, discovered.length, nextId - 1);
  const nextBtn = chapter !== 6 ? nextChapterButtonLabel[chapter] : null;
  return (
    <div className="screen ending" data-testid="ending">
      <Backdrop bg="lab" />
      <div className="story-vignette" />
      <div className="ending-body">
        <small>{chapterTitle(chapter)}</small>
        <h1>{chapter === 6 ? '大団円' : '完'}</h1>
        <div className="blueprint" aria-label="王の設計図">
          <strong>王の設計図</strong>
          <p>{traits.length ? (chapter === 6 ? '白紙だった設計図には、あなたと仲間たちが積み重ねたすべての記録が刻まれている。' : `白紙だった紙の端に、${chapterTitle(chapter)}までの働きが淡く浮かび上がっている。`) : 'まだ、何も書かれていない。'}</p>
          {traits.length > 0 && (
            <ul className="blueprint-traits" data-testid="blueprint-traits">
              {traits.map(t => <li key={t.id}><b>{t.title}</b><span>{t.note}</span></li>)}
            </ul>
          )}
        </div>
        <p className="tally">製造した個体 {nextId - 1}体 ／ 発見した配合 {discovered.length}種 ／ 戦闘 {battles}回 ／ 格納庫 {roster.length}体</p>
        {nextBtn ? (
          <div className="row">
            <button className="big primary" onClick={advanceChapter} data-testid={nextBtn.testId}><b>{nextBtn.title}</b><small>{nextBtn.sub}</small></button>
            <button className="big" onClick={toTitle} data-testid="to-title"><b>タイトルへ戻る</b><small>進行は保存されています</small></button>
          </div>
        ) : (
          <>
            <p className="next">『モンスター製造課 ～ 魔王軍最後の工場 ～』　全章完結。プレイしていただきありがとうございました！</p>
            <button className="big primary" onClick={toTitle} data-testid="to-title"><b>タイトルへ戻る</b></button>
          </>
        )}
      </div>
    </div>
  );
}

export function App() {
  const started = useGame(s => s.started), progress = useGame(s => s.progress), sub = useGame(s => s.sub);
  const view = viewOf(progress), scene = sceneOf(progress);
  useEffect(() => {
    if (!started) setSceneMood('title');
    else if (sub === 'battle') setSceneMood('battle');
    else if (sub === 'manufacture') setSceneMood('manufacture');
    else if (view === 'story' && scene) setSceneMood('story');
    else if (view === 'end') setSceneMood('ending');
    else if (sub === 'design') setSceneMood('design');
    else setSceneMood('hub');
  }, [started, sub, view, scene]);
  if (!started) return <Title />;
  if (sub === 'battle') return <BattleScreen />;
  if (sub === 'manufacture') return <ManufactureScreen />;
  if (view === 'story' && scene) return <StoryPlayer key={`${scene}-${progress.step}-${progress.seen.length}`} sceneId={scene} />;
  if (view === 'end') return <Ending />;
  return sub === 'design' ? <DesignScreen /> : <Hub />;
}
