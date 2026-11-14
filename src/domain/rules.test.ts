import { describe, expect, it } from 'vitest';
import { recipes, materials, type MaterialId, type RecipeId } from '../data/recipes';
import { calculate, initialDesign, recipeFor, unlocked, type Design } from './design';
import { simulate } from './battle';
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
describe('材料の性質と自動戦闘', () => {
  it('入力を変えず、同じシードで同じ記録を返す', () => {
    const s = calculate(initialDesign), original = { ...s };
    expect(simulate(s, 'swordsman', 42)).toEqual(simulate(s, 'swordsman', 42)); expect(s).toEqual(original);
  });
  it('固有技は味方の3回目ごとの攻撃でのみ発動し、盾を貫く', () => {
    const r = simulate(calculate(design('wraith')), 'swordsman', 42);
    const attacks = r.log.filter(e => e.actor === 'monster');
    expect(attacks.some(e => e.special)).toBe(true);
    attacks.forEach((e, i) => { expect(e.special).toBe((i + 1) % 3 === 0); if (e.special) expect(e.blocked).toBe(0); });
  });
  it('全六種・全敵・複数シードで耐久力と記録が整合する', () => {
    for (const r of recipes) for (const enemy of ['swordsman', 'archer', 'mage'] as const) for (const seed of [1, 42, 7919]) {
      const s = calculate(design(r.id)), result = simulate(s, enemy, seed);
      for (const e of result.log) { expect(e.monsterHp).toBeGreaterThanOrEqual(0); expect(e.monsterHp).toBeLessThanOrEqual(s.hp); expect(e.enemyHp).toBeGreaterThanOrEqual(0); }
      expect(result.log.at(-1)?.monsterHp).toBe(result.monsterHp);
    }
  });
  it('各日の材料だけで目標を攻略できる', () => {
    for (const [id, enemy, day] of [['furnace', 'swordsman', 1], ['bloom', 'archer', 3], ['bell', 'mage', 5]] as const) {
      expect(unlocked(day, design(id))).toBe(true);
      for (let seed = 1; seed <= 30; seed++) expect(simulate(calculate(design(id)), enemy, seed * 7919).outcome, `${id}/${seed}`).toBe('win');
    }
  });
  it('一種類で全敵を安定攻略できず、配合の使い分けがある', () => {
    for (const r of recipes) {
      const rates = (['swordsman', 'archer', 'mage'] as const).map(enemy => Array.from({ length: 30 }, (_, i) => simulate(calculate(design(r.id)), enemy, (i + 1) * 7919).outcome).filter(o => o === 'win').length / 30);
      expect(Math.min(...rates), r.id).toBeLessThan(0.9);
    }
  });
  it('材料の弱点があり、遅い個体は追撃、竜の血は冷気、亡霊の再生は凍結の影響を受ける', () => {
    expect(simulate(calculate(design('furnace')), 'archer', 42).totals.extraShots).toBeGreaterThan(0);
    expect(simulate(calculate(design('bloom')), 'mage', 42).totals.cold).toBeGreaterThan(0);
    expect(simulate(calculate(design('wraith')), 'mage', 42).totals.frozenRegen).toBe(true);
    expect(simulate(calculate(design('thorn')), 'swordsman', 42).totals.poison).toBeGreaterThan(0);
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
