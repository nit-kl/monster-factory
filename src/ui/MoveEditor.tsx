import { movePools, moves, resolveMoves, signature, type Loadout } from '../data/skills';
import type { RecipeId } from '../data/recipes';

export function MoveEditor({ recipe, selected, onChange }: { recipe: RecipeId; selected?: Loadout; onChange: (moves: Loadout) => void }) {
  const chosen = resolveMoves(recipe, selected), special = signature(recipe);
  return <section className="move-editor" aria-label="技構成">
    <h3>技構成</h3><p className="note">通常技1 → 通常技2 → 固有技の順で繰り返します。姿は種族共通です。</p>
    {([0, 1] as const).map(slot => <label key={slot}>
      <span>通常技 {slot + 1}</span>
      <select aria-label={`通常技 ${slot + 1}`} value={chosen[slot]} onChange={event => {
        const next: [Loadout[0], Loadout[1]] = [...chosen]; next[slot] = event.target.value as Loadout[0]; onChange(next);
      }}>{movePools[recipe].map(id => <option key={id} value={id} disabled={id === chosen[1 - slot]}>{moves[id].name}</option>)}</select>
      <small>{moves[chosen[slot]].note}</small>
    </label>)}
    <div className="fixed-skill"><small>種族固有技</small><strong>{special.name}</strong><small>{special.note}</small></div>
  </section>;
}

export function MoveSummary({ recipe, selected }: { recipe: RecipeId; selected?: Loadout }) {
  const chosen = resolveMoves(recipe, selected);
  return <p className="move-summary">{moves[chosen[0]].name} → {moves[chosen[1]].name} → <strong>{signature(recipe).name}</strong></p>;
}
