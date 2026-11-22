import { useEffect, useMemo, useState } from 'react';
import { clearSave, readSave } from '../domain/save';
import { blueprintTraits, chapterOf, chapterTitle, dayOf, sceneOf, viewOf, type ChapterNum } from '../domain/progress';
import type { GameData } from '../domain/save';
import { useGame } from '../state/store';
import { previewMode } from '../state/previewMode';
import { PreviewMenu } from './PreviewMenu';
import { setSceneMood } from '../three/sound';
import { Backdrop } from './Backdrop';
import { DesignScreen } from './DesignScreen';
import { Hub } from './Hub';
import { ManufactureScreen } from './ManufactureScreen';
import { StoryPlayer } from './StoryPlayer';

import { Dispatch } from './Dispatch';

function Title() {
  const [dispatch, setDispatch] = useState(false);
  const newGame = useGame(s => s.newGame), resume = useGame(s => s.resume);
  const [confirm, setConfirm] = useState(false);
  const save = useMemo<{ data: GameData | null; error: string | null }>(() => {
    try { return { data: readSave(), error: null }; } catch (e) { return { data: null, error: e instanceof Error ? e.message : '保存データを読み込めませんでした' }; }
  }, []);
  if (dispatch) return <Dispatch close={() => setDispatch(false)} />;
  const start = () => { if (!previewMode) clearSave(); newGame(); };
  return (
    <div className="screen title" data-testid="title">
      <Backdrop bg="exterior" />
      <div className="story-vignette" />
      <div className="title-body">
        <small>魔王軍 第七魔物製造工場</small>
        <h1>モンスター製造課</h1>
        <p className="subtitle">～ 魔王軍最後の工場 ～</p>
        <div className="title-menu"><button className="big primary" onClick={() => setDispatch(true)}><b>現場調査へ</b><small>短編「誰も押していない停止ボタン」</small></button>
          {save.data && <button className="big primary" onClick={() => resume(save.data!)} data-testid="continue"><b>つづきから</b><small>{viewOf(save.data.progress) === 'end' ? `第${chapterOf(save.data.progress)}章 完` : `第${chapterOf(save.data.progress)}章 ${Math.max(1, dayOf(save.data.progress))}日目`} ／ 格納庫 {save.data.roster.length}体</small></button>}
          {confirm ? (
            <div className="panel confirm">
              <p>保存されている進行を消して、最初から始めます。</p>
              <div className="row"><button className="primary" onClick={start} data-testid="confirm-new">はじめから始める</button><button onClick={() => setConfirm(false)}>やめる</button></div>
            </div>
          ) : (
            <button className={`big ${save.data ? '' : 'primary'}`} onClick={() => (save.data && !previewMode ? setConfirm(true) : start())} data-testid="new-game"><b>はじめから</b><small>序章「特命」</small></button>
          )}
        </div>
        {save.error && <p className="note warn">保存データを読み込めませんでした（{save.error}）。</p>}
        <p className="note">全8章、百日目まで。工場で魔物を育みながら、物語を読み進めます。進行はこのブラウザに自動保存されます。</p>
        <p className="note">二つの材料から、ひとつの命。6種類の魔物と、それぞれの固有技を発見してください。</p>
      </div>
    </div>
  );
}

const nextChapterButtonLabel: Partial<Record<ChapterNum, { title: string; sub: string; testId: string }>> = {
  1: { title: '第2章「孤立無援の防衛戦」へ進む', sub: '包囲された谷門と先遣隊の総攻撃', testId: 'start-chapter2' },
  2: { title: '第3章「角の王」へ進む', sub: '納期まで残り九十一日。右角が届く', testId: 'start-chapter3' },
  3: { title: '第4章「牙の王」へ進む', sub: '従うだけの王と、獣王ロウガ', testId: 'start-chapter4' },
  4: { title: '第5章「腕の王」へ進む', sub: '勇者軍本隊と、炎将の右腕', testId: 'start-chapter5' },
  5: { title: '第6章「折れ角の王」へ進む', sub: '人間が作った、戦わない王', testId: 'start-chapter6' },
  6: { title: '第7章「目の王」へ進む', sub: '宰相が隠していた左目', testId: 'start-chapter7' },
  7: { title: '終章「王を設計する」へ進む', sub: '百日目。席をプルルに譲る', testId: 'start-chapter8' },
};

function Ending() {
  const { progress, discovered, nextId, roster, advanceChapter, toTitle } = useGame();
  const chapter = chapterOf(progress);
  const traits = blueprintTraits(progress, discovered.length, nextId - 1);
  const nextBtn = nextChapterButtonLabel[chapter] ?? null;
  return (
    <div className="screen ending" data-testid="ending">
      <Backdrop bg="lab" />
      <div className="story-vignette" />
      <div className="ending-body">
        <small>{chapterTitle(chapter)}</small>
        <h1>{chapter === 8 ? '大団円' : '完'}</h1>
        <div className="blueprint" aria-label="王の設計図">
          <strong>王の設計図</strong>
          <p>{traits.length ? (chapter === 8 ? '白紙だった設計図には、百日の失敗と、プルルが自分で消した武器の欄が残っている。' : `白紙だった紙の端に、${chapterTitle(chapter)}までの働きが淡く浮かび上がっている。`) : 'まだ、何も書かれていない。'}</p>
          {traits.length > 0 && (
            <ul className="blueprint-traits" data-testid="blueprint-traits">
              {traits.map(t => <li key={t.id}><b>{t.title}</b><span>{t.note}</span></li>)}
            </ul>
          )}
        </div>
        <p className="tally">製造した個体 {nextId - 1}体 ／ 発見した配合 {discovered.length}種 ／ 格納庫 {roster.length}体</p>
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

function GameScreen() {
  const started = useGame(s => s.started), progress = useGame(s => s.progress), sub = useGame(s => s.sub);
  const view = viewOf(progress), scene = sceneOf(progress);
  useEffect(() => {
    if (!started) setSceneMood('title');
    else if (sub === 'manufacture') setSceneMood('manufacture');
    else if (view === 'story' && scene) setSceneMood('story');
    else if (view === 'end') setSceneMood('ending');
    else if (sub === 'design') setSceneMood('design');
    else setSceneMood('hub');
  }, [started, sub, view, scene]);
  if (!started) return <Title />;
  if (sub === 'manufacture') return <ManufactureScreen />;
  if (view === 'story' && scene) return <StoryPlayer key={`${scene}-${progress.step}-${progress.seen.length}`} sceneId={scene} />;
  if (view === 'end') return <Ending />;
  return sub === 'design' ? <DesignScreen /> : <Hub />;
}

export function App() {
  const [previewRun, setPreviewRun] = useState(0);
  return <>
    <GameScreen key={previewRun} />
    {previewMode && <PreviewMenu onJump={() => setPreviewRun(run => run + 1)} />}
  </>;
}
