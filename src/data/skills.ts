import { recipeById, type RecipeId } from './recipes';

export type MoveId = 'strike' | 'bolt' | 'guard' | 'mend' | 'venom' | 'drain' | 'pierce' | 'rush';
export type Loadout = readonly [MoveId, MoveId];
export type Skill = { id: string; name: string; note: string; fx: string; color: string; power: number; guard?: number; heal?: number; poison?: boolean; pierce?: boolean };
export const moves: Record<MoveId, Skill> = {
  strike: { id: 'strike', name: '強打', note: '威力100%。衝撃を伴う近接攻撃。', fx: 'slash', color: '#ffe2b4', power: 1 },
  bolt: { id: 'bolt', name: '魔力弾', note: '威力100%。魔力を飛び道具にして放つ。', fx: 'bolt', color: '#ff9860', power: 1 },
  guard: { id: 'guard', name: '守勢打', note: '威力65%。次に受ける一撃を8軽減。重複せず更新。', fx: 'guard', color: '#8dcaff', power: 0.65, guard: 8 },
  mend: { id: 'mend', name: '再生波', note: '威力50%。耐久を10回復。凍結中は回復不可。', fx: 'heal', color: '#8df0bd', power: 0.5, heal: 10 },
  venom: { id: 'venom', name: '侵蝕弾', note: '威力70%。毒を付与し、毎巡7ダメージ。毒は重複しない。', fx: 'poison', color: '#b2e66c', power: 0.7, poison: true },
  drain: { id: 'drain', name: '生命吸収', note: '威力75%。与えたダメージを上限に6回復。凍結中は回復不可。', fx: 'drain', color: '#d49cff', power: 0.75, heal: 6 },
  pierce: { id: 'pierce', name: '貫通撃', note: '威力85%。装甲と一時防御を無視する。', fx: 'pierce', color: '#d3e5ff', power: 0.85, pierce: true },
  rush: { id: 'rush', name: '疾風撃', note: '威力85%。素早く離脱し、次に受ける一撃を4軽減。', fx: 'rush', color: '#b7c4ff', power: 0.85, guard: 4 },
};
export const movePools: Record<RecipeId, readonly MoveId[]> = {
  wraith: ['strike', 'bolt', 'guard', 'drain'], furnace: ['bolt', 'strike', 'guard', 'drain'],
  bloom: ['strike', 'bolt', 'rush', 'mend'], thorn: ['venom', 'strike', 'bolt', 'mend'],
  prism: ['strike', 'bolt', 'pierce', 'rush'], bell: ['bolt', 'strike', 'guard', 'mend'],
};
export function resolveMoves(id: RecipeId, selected?: Loadout): Loadout {
  const pool = movePools[id];
  return selected && selected[0] !== selected[1] && selected.every(m => pool.includes(m)) ? [...selected] : [pool[0], pool[1]];
}
export function signature(id: RecipeId): Skill {
  const r = recipeById(id);
  return { id: `signature-${id}`, name: r.skill, note: '3行動目に自動発動。装甲と一時防御を貫通。', fx: id, color: r.color, power: 1, pierce: true, poison: id === 'thorn' };
}