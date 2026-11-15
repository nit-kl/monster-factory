import { describe, expect, it } from 'vitest';
import { recipes } from '../data/recipes';
import { enemies, type EnemyId } from '../data/enemies';
import { actionSkill, enemySkills, movePools, type Loadout } from '../data/skills';
import { calculate, type Design } from './design';
import { diagnose, simulate } from './battle';
import { parseSave, toSave } from './save';
import { makeUnit, unitTitle, veteranBadge } from './manufacture';
import { useGame, snapshot } from '../state/store';
import { blueprintTraits, initialProgress } from './progress';
import { setSceneMood, soundEnabled, toggleSound } from '../three/sound';

describe('種族共通の姿と技構成', () => {
  it('全種族・技の全順列・全敵で技順と耐久計算が一致する', () => {
    for (const r of recipes) for (const a of movePools[r.id]) for (const b of movePools[r.id]) {
      if (a === b) continue;
      const stats = calculate({ first: r.pair[0], second: r.pair[1], moves: [a, b] });
      for (const enemy of Object.keys(enemies) as EnemyId[]) for (const seed of [1, 42, 7919]) {
        const result = simulate(stats, enemy, seed);
        let hp = stats.hp, foe = enemies[enemy].hp as number, action = 0, enemyAction = 0;
        for (const event of result.log) {
          if (event.actor === 'monster') {
            expect(event.skill).toBe(actionSkill(r.id, stats.moves, action++).id);
            foe -= event.damage; hp -= event.selfBurn;
          } else if (event.actor === 'enemy') {
            if (!event.extra) enemyAction++;
            expect(event.skill).toBe(enemySkills[enemy][(enemyAction - 1) % 3].id);
            hp -= event.damage;
          }
          hp += event.heal; foe -= event.poison;
          expect(event.monsterHp).toBe(hp); expect(event.enemyHp).toBe(foe);
          expect(hp).toBeGreaterThanOrEqual(0); expect(hp).toBeLessThanOrEqual(stats.hp); expect(foe).toBeGreaterThanOrEqual(0);
        }
        expect(result.monsterHp).toBe(hp); expect(result.enemyHp).toBe(foe);
      }
    }
  });
  it('守勢打は次の一撃だけ軽減し、貫通は防御を無視する', () => {
    const base = calculate({ first: 'iron', second: 'ember', moves: ['guard', 'strike'] });
    const result = simulate(base, 'archer', 42);
    const defended = result.log.findIndex(e => e.guard === 8);
    const hits = result.log.slice(defended + 1).filter(e => e.actor === 'enemy');
    expect(hits[0].absorbed).toBe(base.armor + 8);
    expect(hits[1].absorbed).toBe(base.armor);
    const pierce = simulate(calculate({ first: 'glass', second: 'moon', moves: ['pierce', 'strike'] }), 'swordsman', 42);
    expect(pierce.log.filter(e => e.skill === 'pierce').every(e => e.blocked === 0)).toBe(true);
  });
  it('回復・毒は実際に作用し、凍結中の回復は止まる', () => {
    const heal = calculate({ first: 'glass', second: 'spirit', moves: ['mend', 'guard'] });
    expect(simulate(heal, 'swordsman', 42).totals.heal).toBeGreaterThan(0);
    expect(simulate(heal, 'mage', 42).totals.heal).toBe(0);
    const poison = calculate({ first: 'seed', second: 'spirit', moves: ['venom', 'mend'] });
    poison.poison = false;
    expect(simulate(poison, 'swordsman', 42).totals.poison).toBeGreaterThan(0);
  });
  it('旧セーブは既定技、新しいセーブは選択技と戦績を維持する。不正な技は拒否する', () => {
    useGame.getState().newGame();
    const d: Design = { first: 'iron', second: 'ember', moves: ['guard', 'drain'] };
    const data = { ...snapshot(useGame.getState()), discovered: ['furnace' as const], design: d, roster: [{ ...makeUnit(d, 1), wins: 3 }], nextId: 2 };
    expect(parseSave(toSave(data))).toEqual(data);
    const old = { ...toSave(data), design: { first: 'iron', second: 'ember' }, roster: [{ id: 1, design: { first: 'iron', second: 'ember' }, wins: 3, losses: 0 }] };
    expect(parseSave(old).roster[0].stats.moves).toEqual(['bolt', 'strike']);
    for (const invalid of [['guard'], ['guard', 'guard'], ['guard', 'unknown'], ['guard', 'venom']]) {
      expect(() => parseSave({ ...toSave(data), design: { ...d, moves: invalid } })).toThrow('技構成');
    }
  });
  it('格納庫で再調整しても個体番号と戦績を失わず、戦闘中は変更できない', () => {
    const d: Design = { first: 'iron', second: 'ember' };
    useGame.getState().newGame();
    useGame.setState({ progress: initialProgress, roster: [{ ...makeUnit(d, 1), wins: 2 }], nextId: 2 });
    useGame.getState().setUnitMoves(1, ['guard', 'drain']);
    expect(useGame.getState().roster[0]).toMatchObject({ id: 1, wins: 2, stats: { moves: ['guard', 'drain'] } });
    useGame.getState().startBattle(1, 'swordsman');
    useGame.getState().setUnitMoves(1, ['bolt', 'strike']);
    expect(useGame.getState().roster[0].stats.moves).toEqual(['guard', 'drain']);
    useGame.getState().newGame();
  });
  it('戦後分析は凍結・盾軽減・追撃・冷気弱点と技構成の見直しを案内する', () => {
    const frozen = diagnose(simulate(calculate({ first: 'glass', second: 'spirit', moves: ['mend', 'guard'] }), 'mage', 42));
    expect(frozen.some(f => f.title.includes('冷気で封じられた'))).toBe(true);
    const rapid = diagnose(simulate(calculate({ first: 'iron', second: 'ember' }), 'archer', 42));
    expect(rapid.some(f => f.title.includes('追撃') && f.text.includes('格納庫'))).toBe(true);
    const cold = diagnose(simulate(calculate({ first: 'seed', second: 'ember' }), 'mage', 42));
    expect(cold.some(f => f.title.includes('冷気の弱点'))).toBe(true);
  });
  it('第1章〜終章の働きと発見数から王の設計図の資質を導出する', () => {
    expect(blueprintTraits(initialProgress, 0, 0)).toEqual([]);
    const cleared = { step: 23, queue: [], seen: ['victory', 'night'], flags: ['promisedLisette', 'satWithVargas'] };
    const traits = blueprintTraits(cleared, 6, 4);
    expect(traits.map(t => t.id)).toEqual(['guardian', 'wisdom-all', 'resolve', 'mercy']);
    expect(traits.find(t => t.id === 'resolve')?.note).toContain('いつか真実を話すと留保');
    const ch2Cleared = { step: 43, queue: [], seen: ['victory', 'night', 'ch2Audit3Win', 'ch2Victory'], flags: ['promisedLisette', 'ch2_sharedBlueprint', 'promisedMimi'] };
    expect(blueprintTraits(ch2Cleared, 6, 4).map(t => t.id)).toEqual(['guardian', 'wisdom-all', 'resolve', 'mercy', 'covenant', 'kinship']);
    const finaleCleared = {
      step: 77,
      queue: [],
      seen: ['victory', 'night', 'ch2Audit3Win', 'ch2Victory', 'ch3Victory', 'ch4Eve', 'ch5Epilogue'],
      flags: ['promisedLisette', 'ch2_sharedBlueprint', 'promisedMimi', 'welcomedNoah', 'ch4_councilHeld', 'ch5_yieldedSeat'],
    };
    expect(blueprintTraits(finaleCleared, 6, 4).map(t => t.id)).toEqual([
      'guardian',
      'wisdom-all',
      'resolve',
      'mercy',
      'covenant',
      'kinship',
      'bridge',
      'identity',
      'peace',
    ]);
  });
  it('個体の歴戦称号と愛称（名付け）を設定・保存・検証できる', () => {
    expect(veteranBadge({ wins: 0, losses: 0 })).toBeNull();
    expect(veteranBadge({ wins: 0, losses: 1 })?.title).toBe('生還個体');
    expect(veteranBadge({ wins: 1, losses: 0 })?.title).toBe('初陣の守り手');
    expect(veteranBadge({ wins: 3, losses: 0 })?.title).toBe('歴戦の勇士');
    expect(veteranBadge({ wins: 5, losses: 0 })?.title).toBe('第七工場の誇り');
    const d: Design = { first: 'iron', second: 'ember' };
    useGame.getState().newGame();
    useGame.setState({ progress: initialProgress, roster: [{ ...makeUnit(d, 1), wins: 3 }], nextId: 2 });
    useGame.getState().setUnitNickname(1, 'カマド');
    const unit = useGame.getState().roster[0];
    expect(unit.nickname).toBe('カマド');
    expect(unitTitle(unit)).toBe('カマド（熔炉巨人 001号）');
    const saved = toSave(snapshot(useGame.getState()));
    expect(parseSave(saved).roster[0].nickname).toBe('カマド');
    expect(() => parseSave({ ...saved, roster: [{ ...saved.roster[0], nickname: '   ' }] })).toThrow('愛称');
    useGame.getState().setUnitNickname(1, '');
    expect(useGame.getState().roster[0].nickname).toBeUndefined();
  });
  it('場面ごとのサウンド雰囲気切替が安全に動作する', () => {
    setSceneMood('hub');
    setSceneMood('battle');
    expect(soundEnabled()).toBe(false);
    // AudioContext未対応環境でも例外を投げない
    toggleSound();
    if (soundEnabled()) toggleSound();
    expect(soundEnabled()).toBe(false);
  });
});
