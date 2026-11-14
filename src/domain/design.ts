import { findRecipe, materials, type MaterialId, type RecipeId } from '../data/recipes';
export type Design = { first: MaterialId; second: MaterialId };
export type Stats = { hp: number; attack: number; speed: number; cost: number; selfBurn: number; heatProof: boolean; coldWeak: boolean; poison: boolean; regen: boolean; armor: number; bonus: number; recipe: RecipeId };
export type Note = { tone: 'warn' | 'good' | 'info'; text: string };
export const initialDesign: Design = { first: 'iron', second: 'spirit' };
export const recipeFor = (d: Design) => findRecipe(d.first, d.second);
export const unlocked = (day: number, d: Design) => !!recipeFor(d) && materials[d.first]?.day <= day && materials[d.second]?.day <= day;
export const overCapacity = (d: Design) => !recipeFor(d);
export function calculate(d: Design): Stats {
  const r = recipeFor(d);
  if (!r) throw Error('この材料の組み合わせは製造できません');
  return { hp: r.hp, attack: r.attack, speed: r.speed, cost: 0, selfBurn: 0, heatProof: !r.coldWeak, coldWeak: !!r.coldWeak, poison: !!r.poison, regen: !!r.regen, armor: r.armor, bonus: r.bonus, recipe: r.id };
}
export function designNotes(d: Design): Note[] {
  const r = recipeFor(d);
  if (!r) return [{ tone: 'warn', text: '生命反応がありません。別の材料を組み合わせてください。' }];
  return [{ tone: 'info', text: r.hint }, ...(r.coldWeak ? [{ tone: 'warn' as const, text: '竜の血の熱は、強い冷気に弱い反応を示しています。' }] : [])];
}
export const unitName = (d: Design, id: number) => `${recipeFor(d)!.name} ${String(id).padStart(3, '0')}号`;
