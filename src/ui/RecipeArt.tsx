import { materials, recipeById, type MaterialId, type RecipeId } from '../data/recipes';
import { monsterArt } from '../data/monsterArt';
export function MaterialIcon({ id }: { id: MaterialId }) {
  const m = materials[id]; return <span className="material-icon" style={{ color: m.color }} aria-hidden="true">{m.symbol}</span>;
}
export function MonsterIcon({ id, hidden = false }: { id: RecipeId; hidden?: boolean }) {
  const r = recipeById(id);
  if (!hidden) return <span className="monster-icon" style={{ color: r.color }} aria-hidden="true"><img src={monsterArt[id]} alt="" /></span>;
  return <span className="monster-icon" style={{ color: '#81758e' }} aria-hidden="true">?</span>;
}
