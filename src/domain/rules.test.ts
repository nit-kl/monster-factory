import { describe, expect, it } from 'vitest';
import { recipes, materials, type MaterialId, type RecipeId } from '../data/recipes';
import { calculate, initialDesign, recipeFor, unlocked, type Design } from './design';
import { addToHangar, hangarSize, makeUnit, lineAt, lineStages, stageDurations, totalDuration } from './manufacture';
const design = (id: RecipeId): Design => { const r = recipes.find(r => r.id === id)!; return { first: r.pair[0], second: r.pair[1] }; };
describe('二材料の配合', () => {
  it('全レシピは順不同で一意。六種類すべてを再現できる', () => {
    const keys = recipes.map(r => [...r.pair].sort().join('/'));
    expect(new Set(keys).size).toBe(6);
    for (const r of recipes) {
      const d = design(r.id), reverse = { first: d.second, second: d.first };
      expect(recipeFor(d)?.id).toBe(r.id); expect(calculate(reverse)).toEqual(calculate(d));
    }
  });
  it('未成立・同種の組み合わせは製造できず、未入荷材料も使えない', () => {
    for (const id of Object.keys(materials) as MaterialId[]) expect(unlocked(7, { first: id, second: id })).toBe(false);
    expect(recipeFor({ first: 'iron', second: 'moon' })).toBeUndefined();
    expect(unlocked(1, design('furnace'))).toBe(true);
    expect(unlocked(1, design('bloom'))).toBe(false);
    expect(unlocked(3, design('bloom'))).toBe(true);
    expect(unlocked(3, design('prism'))).toBe(false);
    expect(unlocked(5, design('prism'))).toBe(true);
  });
});
describe('誕生と格納庫', () => {
  it('全工程の境界とスキップ後の完成が一致する', () => {
    const durations = stageDurations(); let t = 0;
    for (const stage of lineStages) { expect(lineAt(t).stage).toBe(stage); t += durations[stage]; }
    expect(lineAt(totalDuration())).toMatchObject({ stage: 'reveal', done: true, overall: 1 });
  });
  it('製造時の配合を保持し、格納庫あふれは療養棟へ移す', () => {
    const d = { ...initialDesign }, unit = makeUnit(d, 1); d.second = 'ember'; expect(unit.design.second).toBe('spirit');
    const roster = Array.from({ length: hangarSize }, (_, i) => makeUnit(initialDesign, i + 1));
    const next = addToHangar(roster, makeUnit(initialDesign, 99)); expect(next.moved).toBe(1); expect(next.roster).toHaveLength(hangarSize);
  });
});
