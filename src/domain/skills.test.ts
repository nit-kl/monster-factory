import { describe, expect, it } from 'vitest';
import { calculate, type Design } from './design';
import { parseSave, toSave } from './save';
import { makeUnit, unitTitle, veteranBadge } from './manufacture';
import { useGame, snapshot } from '../state/store';
import { blueprintTraits, initialProgress } from './progress';
import { setSceneMood, soundEnabled, toggleSound } from '../three/sound';

describe('種族共通の姿と技構成', () => {
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
  it('格納庫で再調整しても個体番号と戦績を保持する', () => {
    const d: Design = { first: 'iron', second: 'ember' };
    useGame.getState().newGame();
    useGame.setState({ progress: initialProgress, roster: [{ ...makeUnit(d, 1), wins: 2 }], nextId: 2 });
    useGame.getState().setUnitMoves(1, ['guard', 'drain']);
    expect(useGame.getState().roster[0]).toMatchObject({ id: 1, wins: 2, stats: { moves: ['guard', 'drain'] } });
    useGame.getState().newGame();
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
    expect(soundEnabled()).toBe(false);
    // AudioContext未対応環境でも例外を投げない
    toggleSound();
    if (soundEnabled()) toggleSound();
    expect(soundEnabled()).toBe(false);
  });
});
