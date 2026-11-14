import { describe, expect, it } from 'vitest';
import { enemies, type EnemyId } from '../data/enemies';
import { attacks, bodies, capacity, defenses, effects, processes } from '../data/parts';
import { diagnose, simulate } from './battle';
import { calculate, designNotes, initialDesign, overCapacity, unlocked, unitName, type Design } from './design';
import { addToHangar, hangarSize, lineAt, lineStages, makeUnit, stageDurations, totalDuration } from './manufacture';

const d = (change: Partial<Design> = {}): Design => ({ ...initialDesign, ...change });
const seeds = Array.from({ length: 30 }, (_, i) => (i + 1) * 7919);
const winRate = (design: Design, enemy: EnemyId) => seeds.filter(s => simulate(calculate(design), enemy, s).outcome === 'win').length / seeds.length;

describe('設計', () => {
  it('火炎袋は耐熱の備えがないと自傷し、石殻か高温培養で防げる', () => {
    expect(calculate(d()).selfBurn).toBe(effects.selfBurn);
    expect(calculate(d({ defense: 'shell' })).selfBurn).toBe(0);
    expect(calculate(d({ process: 'heated' })).selfBurn).toBe(0);
    expect(calculate(d({ attack: 'claws' })).selfBurn).toBe(0);
  });
  it('代償がある：石殻は遅く、高温培養は容量を使い冷気に弱い', () => {
    expect(calculate(d({ defense: 'shell' })).speed).toBeLessThan(calculate(d()).speed);
    expect(calculate(d({ process: 'heated' })).cost).toBeGreaterThan(calculate(d()).cost);
    expect(calculate(d({ process: 'heated' })).coldWeak).toBe(true);
  });
  it('全組み合わせで性能が下限を守り、同じ設計は同じ結果になる', () => {
    for (const body of Object.keys(bodies)) for (const attack of Object.keys(attacks)) for (const defense of Object.keys(defenses)) for (const process of Object.keys(processes)) {
      const x = { body, attack, defense, process } as Design, s = calculate(x);
      expect(s.hp).toBeGreaterThan(0); expect(s.speed).toBeGreaterThan(0); expect(s).toEqual(calculate({ ...x }));
    }
  });
  it('容量を超える設計と、未入荷の部品を使う設計を判定する', () => {
    const heavy = d({ body: 'golem', defense: 'shell' });
    expect(calculate(heavy).cost).toBeGreaterThan(capacity);
    expect(overCapacity(heavy)).toBe(true);
    expect(designNotes(heavy)[0].tone).toBe('warn');
    expect(unlocked(1, d())).toBe(true);
    expect(unlocked(1, d({ body: 'beast' }))).toBe(false);
    expect(unlocked(3, d({ body: 'beast' }))).toBe(true);
    expect(unlocked(3, d({ defense: 'regen' }))).toBe(false);
  });
  it('相性メモは自傷と耐熱を説明する', () => {
    expect(designNotes(d()).some(n => n.tone === 'warn' && n.text.includes('自分'))).toBe(true);
    expect(designNotes(d({ defense: 'shell' })).some(n => n.tone === 'good')).toBe(true);
    expect(unitName(d(), 7)).toBe('焔スライム 007号');
  });
});

describe('戦闘', () => {
  it('同じ個体・相手・シードなら同じ記録になり、入力を書き換えない', () => {
    const stats = calculate(d()), copy = { ...stats };
    expect(simulate(stats, 'swordsman', 42)).toEqual(simulate(stats, 'swordsman', 42));
    expect(stats).toEqual(copy);
  });
  it('耐久力は0未満にも最大値超えにもならない', () => {
    for (const enemy of Object.keys(enemies) as EnemyId[]) for (const x of [d(), d({ defense: 'regen', attack: 'venom' }), d({ body: 'golem', attack: 'claws' })]) {
      const r = simulate(calculate(x), enemy, 99);
      for (const e of r.log) { expect(e.monsterHp).toBeGreaterThanOrEqual(0); expect(e.monsterHp).toBeLessThanOrEqual(r.maxHp); expect(e.enemyHp).toBeGreaterThanOrEqual(0); }
    }
  });
  it('1日目：初期設計は自分の炎で剣士に負け、石殻か高温培養に直すと勝てる', () => {
    expect(winRate(d(), 'swordsman')).toBe(0);
    const loss = simulate(calculate(d()), 'swordsman', 7919);
    expect(loss.totals.selfBurn).toBeGreaterThan(0);
    expect(diagnose(loss)[0].title).toContain('自分の炎');
    expect(winRate(d({ defense: 'shell' }), 'swordsman')).toBe(1);
    expect(winRate(d({ process: 'heated' }), 'swordsman')).toBeGreaterThan(0.85);
  });
  it('3日目：石殻のスライムは遅くて弓兵に2回射られ、速い設計なら勝てる', () => {
    const slow = simulate(calculate(d({ defense: 'shell' })), 'archer', 7919);
    expect(slow.outcome).toBe('loss'); expect(slow.totals.extraShots).toBeGreaterThan(0);
    expect(diagnose(slow).some(f => f.title.includes('追撃'))).toBe(true);
    expect(winRate(d({ defense: 'shell' }), 'archer')).toBe(0);
    expect(winRate(d({ process: 'heated' }), 'archer')).toBe(1);
    expect(winRate(d({ body: 'beast', attack: 'claws' }), 'archer')).toBe(1);
  });
  it('5日目：高温培養は冷気に弱く魔法使いに負け、石殻なら勝てる', () => {
    const cold = simulate(calculate(d({ process: 'heated' })), 'mage', 7919);
    expect(cold.totals.cold).toBeGreaterThan(0);
    expect(diagnose(cold).some(f => f.title.includes('冷気'))).toBe(true);
    expect(winRate(d({ process: 'heated' }), 'mage')).toBeLessThan(0.15);
    expect(winRate(d({ defense: 'shell' }), 'mage')).toBe(1);
  });
  it('3日目までの部品には、3人すべてに勝てる万能の設計がない', () => {
    for (const body of Object.keys(bodies)) for (const attack of Object.keys(attacks)) for (const defense of Object.keys(defenses)) for (const process of Object.keys(processes)) {
      const x = { body, attack, defense, process } as Design;
      if (!unlocked(3, x) || overCapacity(x)) continue;
      expect(Math.min(winRate(x, 'swordsman'), winRate(x, 'archer'), winRate(x, 'mage')), JSON.stringify(x)).toBeLessThan(0.9);
    }
  });
  it('毒は盾を無視して巡目の終わりに効き、再生核は冷気で凍る', () => {
    const venom = simulate(calculate(d({ body: 'golem', attack: 'venom' })), 'swordsman', 5);
    expect(venom.totals.poison).toBeGreaterThan(0); expect(venom.totals.blocked).toBeGreaterThan(0);
    const regen = calculate(d({ attack: 'claws', defense: 'regen' }));
    expect(simulate(regen, 'swordsman', 5).totals.heal).toBeGreaterThan(0);
    const frozen = simulate(regen, 'mage', 5);
    expect(frozen.totals.heal).toBe(0); expect(frozen.totals.frozenRegen).toBe(true);
  });
  it('勝ったときも分析が1件以上ある', () => {
    const win = simulate(calculate(d({ defense: 'shell' })), 'swordsman', 7919);
    expect(win.outcome).toBe('win'); expect(diagnose(win).length).toBeGreaterThan(0);
  });
});

describe('製造', () => {
  it('時間表は段階の境界で切り替わり、最後に完了する', () => {
    const dur = stageDurations('standard'), total = totalDuration('standard');
    expect(lineAt('standard', 0)).toMatchObject({ stage: 'culture', local: 0, done: false });
    expect(lineAt('standard', dur.culture - 1).stage).toBe('culture');
    expect(lineAt('standard', dur.culture).stage).toBe('drain');
    expect(lineAt('standard', total - 1).stage).toBe('reveal');
    expect(lineAt('standard', total)).toMatchObject({ done: true, local: 1, overall: 1 });
    expect(lineAt('standard', -50).stage).toBe('culture');
    let t = 0; for (const s of lineStages) { expect(lineAt('standard', t).stage).toBe(s); t += dur[s]; }
  });
  it('培養工程で培養の長さが変わる', () => {
    expect(totalDuration('rapid')).toBeLessThan(totalDuration('standard'));
    expect(totalDuration('heated')).toBeGreaterThan(totalDuration('standard'));
  });
  it('個体は製造時の設計を写し取り、格納庫があふれたら古い個体を療養棟へ移す', () => {
    const design = d(), unit = makeUnit(design, 1);
    design.defense = 'shell';
    expect(unit.design.defense).toBe('light'); expect(unit.stats.selfBurn).toBeGreaterThan(0);
    let roster = Array.from({ length: hangarSize }, (_, i) => makeUnit(d(), i + 1));
    const next = addToHangar(roster, makeUnit(d(), 99));
    roster = next.roster;
    expect(next.moved).toBe(1); expect(roster).toHaveLength(hangarSize); expect(roster[0].id).toBe(2); expect(roster.at(-1)?.id).toBe(99);
  });
});
