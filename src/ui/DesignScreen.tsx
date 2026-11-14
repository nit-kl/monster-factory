import { useCallback, useEffect, useRef, useState } from 'react';
import { materials, recipes, type MaterialId } from '../data/recipes';
import { calculate, recipeFor, unlocked } from '../domain/design';
import { dayOf } from '../domain/progress';
import { useGame } from '../state/store';
import { Preview } from '../three/preview';
import { Canvas3D, StatBlock } from './common';
import { MaterialIcon, MonsterIcon } from './RecipeArt';

export function DesignScreen() {
  const { design, progress, discovered, go, setDesign, startManufacture } = useGame();
  const [slot, setSlot] = useState<'first' | 'second'>('first');
  const day = dayOf(progress), recipe = recipeFor(design), known = !!recipe && discovered.includes(recipe.id);
  const preview = useRef<Preview | null>(null);
  const ready = useCallback((p: Preview | null) => { preview.current = p; const s = useGame.getState(), r = recipeFor(s.design); p?.setDesign(s.design, !!r && s.discovered.includes(r.id)); }, []);
  useEffect(() => { preview.current?.setDesign(design, known); }, [design, known]);
  return <div className="screen design" data-testid="design">
    <header className="bar-top"><div><small>2F 配合研究室</small><h1>二つの材料から、ひとつの命。</h1></div><button onClick={() => go('hub')}>工場へ戻る</button></header>
    <div className="synthesis-grid">
      <aside className="material-shelf panel">
        <h2>材料庫 <small>第{day}日</small></h2><p className="note">投入先を選び、材料を選択。順番は自由です。</p>
        <div className="mix-slots">{(['first', 'second'] as const).map((key, i) => <button key={key} aria-pressed={slot === key} onClick={() => setSlot(key)} data-testid={`slot-${key}`}><small>材料 {i + 1}</small><MaterialIcon id={design[key]} /><strong>{materials[design[key]].name}</strong></button>)}</div>
        <div className="material-list">{Object.entries(materials).map(([id, m]) => <button key={id} disabled={m.day > day} aria-pressed={design[slot] === id} onClick={() => { setDesign({ [slot]: id }); setSlot(slot === 'first' ? 'second' : 'first'); }} data-testid={`material-${id}`}><MaterialIcon id={id as MaterialId} /><span><strong>{m.name}</strong><small>{m.day > day ? `${m.day}日目に届く` : m.note}</small></span></button>)}</div>
      </aside>
      <div className="synthesis-center"><div className="design-preview"><Canvas3D className="fill" create={h => new Preview(h)} onReady={ready} /><div className="specimen-label"><small>{known ? '記録済みの生命' : '共鳴観測'}</small><h2>{known ? recipe!.name : recipe ? '未知の生命反応' : '反応なし'}</h2></div><p className="hint">ドラッグで回転 · {known ? '再現可能なレシピ' : '完成した姿は、誕生のときに'}</p></div>
        <div className="reaction panel" aria-live="polite"><strong>{recipe ? '共鳴を確認' : 'この配合は成立しません'}</strong><p>{recipe?.hint ?? '生命を結ぶ反応がありません。材料を替えてみてください。同じ材料同士も反応しません。'}</p></div>
      </div>
      <aside className="recipe-notes panel"><h2>{known ? recipe!.epithet : '製造ノート'}</h2>
        {known ? <><p>{recipe!.lore}</p><StatBlock stats={calculate(design)} /><div className="skill-note"><small>固有技 · 3回目の攻撃で発動</small><h3>{recipe!.skill}</h3><p>{recipe!.skillNote}</p></div></> : <p>材料の性質が、姿と戦い方になります。最初の一体を製造すると、この配合と能力が記録されます。</p>}
        <button className="big primary" disabled={!unlocked(day, design)} onClick={startManufacture} data-testid="manufacture"><b>{known ? 'この魔物をもう一度つくる' : 'この配合で命をつくる'}</b><small>{recipe ? `${materials[design.first].name} × ${materials[design.second].name}` : '別の材料を選んでください'}</small></button>
        <h3>発見したレシピ <span data-testid="discovery-count">{discovered.length} / {recipes.length}</span></h3>
        <div className="recipe-book">{recipes.map(r => { const seen = discovered.includes(r.id); return <button key={r.id} disabled={!seen || r.pair.some(m => materials[m].day > day)} onClick={() => setDesign({ first: r.pair[0], second: r.pair[1] })} data-testid={`recipe-${r.id}`}><MonsterIcon id={r.id} hidden={!seen} /><span>{seen ? r.name : '未発見'}<small>{seen ? r.pair.map(m => materials[m].name).join(' × ') : r.pair.some(m => materials[m].day > day) ? '未入荷の材料が必要' : r.hint}</small></span></button>; })}</div>
      </aside>
    </div>
  </div>;
}
