import { materials, recipeById, type MaterialId, type RecipeId } from '../data/recipes';
export function MaterialIcon({ id }: { id: MaterialId }) {
  const m = materials[id]; return <span className="material-icon" style={{ color: m.color }} aria-hidden="true">{m.symbol}</span>;
}
const shapes: Record<RecipeId, string> = {
  wraith: 'M32 5 45 16 42 27 48 30 52 48 44 46 42 34 38 36 39 57 31 53 25 57 25 36 20 34 18 46 10 48 16 30 22 27 19 16Z M25 20 29 22 M35 22 39 20 M29 34 32 40 35 34',
  furnace: 'M18 17 18 5 24 5 24 17 40 17 40 5 46 5 46 17 52 21 58 44 47 46 44 37 44 58 34 58 32 47 29 58 19 58 19 37 15 46 5 44 11 21Z M25 29 32 24 40 29 40 39 32 44 25 39Z',
  bloom: 'M7 36 16 28 20 14 29 25 35 12 40 26 48 19 55 24 60 34 49 37 44 46 41 57 35 54 34 44 23 44 18 56 12 53 16 39Z M25 31 20 4 35 17 40 8 41 30',
  thorn: 'M28 18 20 10 18 2 26 8 32 3 38 10 47 3 44 16 38 23 40 31 54 22 59 27 46 39 42 51 56 57 40 58 32 51 24 59 8 57 22 49 23 38 7 28 12 22 25 30Z M27 25 30 27 M35 27 38 25',
  prism: 'M5 30 18 24 34 27 42 11 46 5 50 16 61 25 49 31 44 43 43 58 36 55 34 42 23 40 15 56 10 52 15 35Z M17 25 8 9 23 20 M26 25 23 9 35 24 M45 21 49 22',
  bell: 'M5 30 Q5 5 32 5 Q59 5 59 30 Q32 40 5 30Z M14 35 Q8 45 18 57 M25 37 Q20 50 28 61 M39 37 Q46 49 37 59 M50 35 Q59 45 49 56 M24 23 25 25 M39 23 38 25',
};
export function MonsterIcon({ id, hidden = false }: { id: RecipeId; hidden?: boolean }) {
  const r = recipeById(id);
  return <span className="monster-icon" style={{ color: hidden ? '#81758e' : r.color }} aria-hidden="true">{hidden ? '?' : <svg viewBox="0 0 64 64"><path d={shapes[id]} fill="currentColor" fillOpacity="0.18" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" /></svg>}</span>;
}
