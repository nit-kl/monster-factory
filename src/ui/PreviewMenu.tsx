import { useState } from 'react';
import { steps } from '../data/chapter1';
import { recipes } from '../data/recipes';
import { scenes } from '../data/script';
import { unlocked } from '../domain/design';
import { hangarSize, makeUnit } from '../domain/manufacture';
import { chapterTitle, initialProgress } from '../domain/progress';
import { useGame } from '../state/store';
import './preview-menu.css';

const objectives = steps.flatMap((step, index) => step.kind === 'objective' ? [index] : []);
const firstObjective = objectives[0];
const scheduledScenes = new Set(steps.flatMap(step => step.kind === 'story' ? [step.scene] : []));
const extraScenes = Object.keys(scenes).filter(id => !scheduledScenes.has(id));
const chapterGroups = [...new Set(steps.map(step => step.chapter ?? 1))];

function stepLabel(index: number) {
  const step = steps[index];
  if (step.kind === 'end') return `${step.day}日目 · 章の結果`;
  if (step.kind === 'objective') return `${step.day}日目 · 工場での準備`;
  const title = scenes[step.scene]?.find(line => line.t === 'title');
  return `${step.day}日目 · 会話 · ${title ? `${title.main} · ` : ''}${step.scene}`;
}

export function PreviewMenu({ onJump }: { onJump: () => void }) {
  const [open, setOpen] = useState(true);
  const [target, setTarget] = useState('0');
  const [recipeId, setRecipeId] = useState(recipes[0].id);
  const [objective, setObjective] = useState(firstObjective);
  const isScreen = ['hub', 'design', 'manufacture'].includes(target);
  const isExtra = target.startsWith('scene:');
  const stepIndex = isScreen || isExtra ? objective : Number(target);
  const step = steps[stepIndex];
  const available = recipes.filter(({ pair }) => unlocked(step.day ?? 0, { first: pair[0], second: pair[1] }));
  const recipe = available.find(item => item.id === recipeId) ?? available[0];
  const needsRecipe = target === 'manufacture';

  function jump() {
    const prepared = isScreen || stepIndex >= firstObjective
      ? [...new Set([...(recipe ? [recipe] : []), ...available])].slice(0, hangarSize)
      : [];
    const roster = prepared.map(({ pair }, index) => makeUnit({ first: pair[0], second: pair[1] }, index + 1));
    const design = roster[0]?.design ?? { first: 'iron', second: 'spirit' };
    const progress = { ...initialProgress, step: stepIndex, queue: isExtra ? [target.slice(6)] : [] };

    const game = useGame.getState();
    game.resume({ progress, design, roster, nextId: roster.length + 1, battles: 0, moved: 0, discovered: prepared.map(item => item.id) });
    if (target === 'design') game.go('design');
    if (target === 'manufacture') game.startManufacture();
    onJump();
    setOpen(false);
  }

  return <aside className="preview-menu" aria-label="開発プレビュー">
    <button type="button" aria-expanded={open} onClick={() => setOpen(!open)}>開発プレビュー</button>
    {open && <div className="preview-fields">
      <small>確認用の状態から開始します。進行は保存されません。</small>
      <label>開始地点
        <select value={target} onChange={event => setTarget(event.target.value)}>
          <optgroup label="ゲーム画面">
            <option value="hub">工場・格納庫</option>
            <option value="design">配合台</option>
            <option value="manufacture">製造演出</option>
          </optgroup>
          {chapterGroups.map(chapter => <optgroup key={chapter} label={chapterTitle(chapter)}>
            {steps.map((item, index) => (item.chapter ?? 1) === chapter && <option key={index} value={index}>{stepLabel(index)}</option>)}
          </optgroup>)}
          <optgroup label="差し込み会話">
            {extraScenes.map(id => <option key={id} value={`scene:${id}`}>{id}</option>)}
          </optgroup>
        </select>
      </label>
      {(isScreen || isExtra) && <label>進行時点
        <select value={objective} onChange={event => setObjective(Number(event.target.value))}>
          {objectives.map(index => <option key={index} value={index}>{stepLabel(index)}</option>)}
        </select>
      </label>}
      {needsRecipe && <label>個体
        <select value={recipe?.id ?? ''} onChange={event => setRecipeId(event.target.value as typeof recipeId)}>
          {available.map(item => <option key={item.id} value={item.id}>{item.name}</option>)}
        </select>
      </label>}
      <button type="button" className="primary" disabled={needsRecipe && !recipe} onClick={jump}>この地点から開始</button>
    </div>}
  </aside>;
}
