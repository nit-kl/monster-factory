import { beforeEach, describe, expect, it, vi } from 'vitest';
import { activeStaffIds, allStaffIds, arrivedStaffIds, cast, chapter2StaffIds, staffIds } from '../data/cast';
import { interludes, steps } from '../data/chapter1';
import { advice, consultationReflection, scenes } from '../data/script';
import { useGame, snapshot } from '../state/store';
import { battleFinished, chapterOf, dayOf, initialProgress, knownEnemies, manufactured, sceneFinished, sceneOf, startChapter2, startNextChapter, stepOf, viewOf, type Progress } from './progress';
import { parseSave, toSave, writeSave } from './save';
import { advance, begin, choice, current, narr, opt, resolveMood, say, when, type Line } from './story';

/** 場面を最後まで読む。pick は選択肢の選び方。 */
function read(lines: readonly Line[], flags: string[], pick: (n: number) => number) {
  const set = new Set(flags), seen: Line[] = [];
  let c = begin(lines, set);
  for (let i = 0; i < 2000; i++) {
    const line = current(c);
    if (!line) return { seen, flags: [...set] };
    seen.push(line);
    const r = advance(c, set, line.t === 'choice' ? pick(line.options.length) : 0);
    if (r.flag) set.add(r.flag);
    c = r.cursor;
  }
  throw Error('場面が終わりません');
}

describe('台本', () => {
  it('選択肢と条件分岐をたどり、選んだ結果のフラグを返す', () => {
    const lines = [narr('a'), choice(opt('x', [say('lisette', 'x1')], 'fx'), opt('y', [say('vargas', 'y1')])), when('fx', [narr('had x')], [narr('no x')]), narr('end')];
    const text = (r: ReturnType<typeof read>) => r.seen.map(l => (l.t === 'say' || l.t === 'narr' ? l.text : l.t));
    expect(text(read(lines, [], () => 0))).toEqual(['a', 'choice', 'x1', 'had x', 'end']);
    expect(text(read(lines, [], () => 1))).toEqual(['a', 'choice', 'y1', 'no x', 'end']);
    expect(read(lines, [], () => 0).flags).toEqual(['fx']);
  });
  it('すべての場面が、どの選択肢でも最後まで読める。話者は登録済み', () => {
    for (const [id, lines] of Object.entries(scenes)) for (const pick of [() => 0, (n: number) => n - 1]) for (const flags of [[], ['lostFirst'], ['lostFirst', 'seenSelfBurn'], ['promisedLisette'], ['deniedToLisette']]) {
      const r = read(lines, flags, pick);
      expect(r.seen.length, id).toBeGreaterThan(0);
      r.seen.forEach(l => { if (l.t === 'say') { expect(cast[l.who], `${id}: ${l.who}`).toBeDefined(); expect(l.text.length).toBeGreaterThan(0); } });
    }
  });
  it('初夜の返答が第2章末（victory）に反映され、旧セーブでは通常の説明要求になる', () => {
    const dialogue = (lines: readonly Line[], flags: string[], pick: (n: number) => number = () => 0) => read(lines, flags, pick);
    const spoken = (flags: string[]) => dialogue(scenes.victory, flags).seen.flatMap(l => l.t === 'say' ? [l.text] : []).join('\n');
    const denied = dialogue(scenes.eveningLisette, [], () => 0).flags;
    const deferred = dialogue(scenes.eveningLisette, [], n => n - 1).flags;
    expect(denied).toContain('deniedToLisette');
    expect(deferred).toContain('promisedLisette');
    expect(spoken(denied)).toContain('『何も知らない』とおっしゃっていましたよね');
    expect(spoken(denied)).not.toContain('『今はまだ言えない』');
    expect(spoken(deferred)).toContain('『今はまだ言えない』');
    expect(spoken([])).toContain('隠し事はなさらないでくださいね');
  });
  it('進行表と差し込み場面が、すべて台本に存在する', () => {
    const ids = [...steps.flatMap(s => (s.kind === 'story' ? [s.scene] : [])), interludes.birth, interludes.raidLoss, ...Object.values(interludes.loss)];
    ids.forEach(id => expect(scenes[id], id).toBeDefined());
    expect(steps.at(-1)?.kind).toBe('end');
  });
  it('第1章の選択フラグが第3章の秘密発覚場面（c3secret）の台詞に反映される', () => {
    const spoken = (flags: string[]) => read(scenes.c3secret, flags, () => 0).seen.flatMap(l => (l.t === 'say' ? [l.text] : [])).join('\n');
    expect(spoken(['promisedLisette'])).toContain('あの夜、「今は言えない」とおっしゃったのは');
    expect(spoken(['deniedToLisette'])).toContain('「何も知らない」とおっしゃいましたね');
    expect(spoken(['liedToVargas'])).toContain('「お元気そうでした」');
  });
  it('各章の相談メンバー全員に、全敵への助言と進行別メッセージが定義されている', () => {
    expect(activeStaffIds(5)).toEqual(staffIds);
    expect(activeStaffIds(8)).toEqual(staffIds);
    expect(activeStaffIds(14)).toEqual(staffIds);
    expect(activeStaffIds(15)).toEqual(arrivedStaffIds);
    expect(activeStaffIds(19)).toEqual(chapter2StaffIds);
    expect(activeStaffIds(60)).toEqual(allStaffIds);
    for (const staff of allStaffIds) {
      for (const day of [1, 3, 6, 9, 14, 21]) expect(consultationReflection(staff, day).length).toBeGreaterThan(0);
      for (const enemy of ['swordsman', 'archer', 'mage'] as const) expect(advice[enemy][staff].length).toBeGreaterThan(0);
    }
  });
  it('序章に視覚的な影武者の手掛かり・道中の情勢解説・一枚絵演出が含まれ、感情推定が機能する', () => {
    const prologueLines = read(scenes.prologue, [], () => 0).seen;
    const cgs = prologueLines.flatMap(l => (l.t === 'cg' && l.cg ? [l.cg] : []));
    const bgs = prologueLines.flatMap(l => (l.t === 'bg' ? [l.bg] : []));
    expect(cgs).toEqual(['throne_puppet', 'maid_ring', 'world_map']);
    expect(bgs).toContain('road');
    expect(resolveMood({ t: 'say', who: 'vargas', text: '触るな！' })).toBe('angry');
    expect(resolveMood({ t: 'say', who: 'lisette', text: '結構です' })).toBe('cold');
    expect(resolveMood({ t: 'say', who: 'poyon', text: 'ありがとうございます！', mood: 'smile' })).toBe('smile');
  });
});

describe('章の進行', () => {
  const playScenes = (p: Progress) => { let q = p; while (viewOf(q) === 'story') q = sceneFinished(q); return q; };
  it('序章から始まり、場面を読み終えると最初の目標（剣士）になる', () => {
    expect(sceneOf(initialProgress)).toBe('prologue');
    const p = playScenes(initialProgress), s = stepOf(p);
    expect(viewOf(p)).toBe('hub'); expect(s.kind === 'objective' && s.enemy).toBe('swordsman'); expect(dayOf(p)).toBe(1);
    expect(p.seen).toEqual(['prologue', 'arrival', 'designIntro']);
  });
  it('最初の製造と最初の敗北で、一度だけ場面が差し込まれる', () => {
    let p = playScenes(initialProgress);
    p = manufactured(p); expect(sceneOf(p)).toBe('birth');
    p = playScenes(p); expect(manufactured(p)).toBe(p);
    const step = p.step;
    p = battleFinished(p, 'swordsman', 'loss', true);
    expect(sceneOf(p)).toBe('swordLoss'); expect(p.flags).toEqual(['lostFirst', 'seenSelfBurn']); expect(p.step).toBe(step);
    p = playScenes(p);
    expect(viewOf(battleFinished(p, 'swordsman', 'loss', true))).toBe('hub');
  });
  it('目標以外の相手との練習試合は進行に影響しない', () => {
    const p = playScenes(initialProgress);
    expect(battleFinished(p, 'archer', 'win')).toBe(p);
  });
  it('第1章（模擬戦3戦）→第2章（包囲防衛戦5戦）→第3章（王の部品）〜終章まで連続進行できる', () => {
    let p = playScenes(initialProgress);
    const days: number[] = [], foes: string[] = [];
    for (let guard = 0; guard < 20 && viewOf(p) !== 'end'; guard++) {
      const s = stepOf(p);
      if (s.kind !== 'objective') throw Error('目標ではありません');
      days.push(dayOf(p)); foes.push(s.enemy);
      p = playScenes(battleFinished(p, s.enemy, 'win'));
    }
    expect(viewOf(p)).toBe('end');
    expect(chapterOf(p)).toBe(1);
    expect(dayOf(p)).toBe(5);
    expect(foes).toEqual(['swordsman', 'archer', 'mage']);
    expect(days).toEqual([1, 3, 5]);
    expect(knownEnemies(p)).toEqual(['swordsman', 'archer', 'mage']);
    expect(p.seen).toContain('eveningOrphen');

    // 第2章「孤立無援の防衛戦」：前哨戦2戦＋先遣隊本隊3連戦を経て初めて認められる
    p = playScenes(startChapter2(p));
    expect(chapterOf(p)).toBe(2);
    const ch2Days: number[] = [], ch2Foes: string[] = [];
    for (let guard = 0; guard < 20 && viewOf(p) !== 'end'; guard++) {
      const s = stepOf(p);
      if (s.kind !== 'objective') throw Error('目標ではありません');
      ch2Days.push(dayOf(p)); ch2Foes.push(s.enemy);
      p = playScenes(battleFinished(p, s.enemy, 'win'));
    }
    expect(viewOf(p)).toBe('end');
    expect(chapterOf(p)).toBe(2);
    expect(dayOf(p)).toBe(8);
    expect(ch2Foes).toEqual(['swordsman', 'archer', 'swordsman', 'archer', 'mage']);
    expect(ch2Days).toEqual([6, 7, 8, 8, 8]);
    expect(p.seen).toContain('victory');
    expect(p.seen).toContain('night');

    // 第3章「角の王」から終章まで。百日目に完結する。
    expect(steps.filter(s => s.kind === 'objective').length).toBeGreaterThanOrEqual(40);
    for (const expectedChapter of [3, 4, 5, 6, 7, 8] as const) {
      p = playScenes(startNextChapter(p));
      expect(chapterOf(p)).toBe(expectedChapter);
      for (let guard = 0; guard < 40 && viewOf(p) !== 'end'; guard++) {
        const s = stepOf(p);
        if (s.kind !== 'objective') throw Error('目標ではありません');
        p = playScenes(battleFinished(p, s.enemy, 'win'));
      }
      expect(viewOf(p)).toBe('end');
      expect(chapterOf(p)).toBe(expectedChapter);
    }
    expect(dayOf(p)).toBe(100);
    expect(p.seen).toContain('c3night');
    expect(p.seen).toContain('c4leave');
    expect(p.seen).toContain('c5chain');
    expect(p.seen).toContain('c6plea');
    expect(p.seen).toContain('c7eve');
    expect(p.seen).toContain('c8epilogue');
  });
  it('場面で選んだ選択肢のフラグを記録する', () => {
    expect(sceneFinished(initialProgress, ['p_sharp']).flags).toEqual(['p_sharp']);
  });
});

describe('保存', () => {
  beforeEach(() => useGame.getState().newGame());
  const game = () => useGame.getState();
  it('製造して戦った状態を保存形式にし、読み戻すと同じ進行になる', () => {
    while (viewOf(game().progress) === 'story') game().finishScene([]);
    game().setDesign({ first: 'iron', second: 'ember' }); game().startManufacture(); game().completeManufacture();
    expect(sceneOf(game().progress)).toBe('birth'); game().finishScene([]);
    game().startBattle(1, 'swordsman'); expect(game().battle?.result.outcome).toBe('win'); game().concludeBattle();
    expect(game().roster[0]).toMatchObject({ id: 1, wins: 1, losses: 0 });
    const data = snapshot(game()), back = parseSave(JSON.parse(JSON.stringify(toSave(data))));
    expect(back).toEqual(data);
  });
  it('未成立の配合は製造を始めない。二重の製造開始もしない', () => {
    while (viewOf(game().progress) === 'story') game().finishScene([]);
    game().setDesign({ first: 'iron', second: 'iron' });
    game().startManufacture(); expect(game().building).toBeNull();
    game().setDesign({ second: 'ember' }); game().startManufacture(); game().setDesign({ second: 'spirit' }); game().startManufacture(); game().completeManufacture(); game().completeManufacture();
    expect(game().roster).toHaveLength(1); expect(game().roster[0].design.second).toBe('ember'); expect(game().discovered).toContain('furnace');
  });
  it('壊れたデータや未対応の版は拒否する', () => {
    const ok = toSave(snapshot(game()));
    expect(() => parseSave({ ...ok, version: 1 })).toThrow('対応していません');
    expect(() => parseSave({ ...ok, design: { ...ok.design, first: 'dragon' } })).toThrow('設計');
    expect(() => parseSave({ ...ok, progress: { ...ok.progress, step: 999 } })).toThrow('進行位置');
    expect(() => parseSave({ ...ok, roster: [{ id: 5, design: ok.design, wins: 0, losses: 0 }] })).toThrow('個体番号');
    expect(() => parseSave(null)).toThrow();
  });
  it('旧v2は進行と個体番号・戦績を保ち、二材料へ移行する', () => {
    const base = snapshot(game());
    const d = { body: 'slime', attack: 'fire', defense: 'shell', process: 'standard' };
    const migrated = parseSave({ ...base, version: 2, design: d, roster: [{ id: 1, design: d, wins: 2, losses: 1 }], nextId: 2 });
    expect(migrated.progress).toEqual(base.progress);
    expect(migrated.roster[0]).toMatchObject({ id: 1, wins: 2, losses: 1, design: { first: 'iron', second: 'ember' } });
    expect(migrated.discovered).toContain('furnace');
    expect(toSave(migrated).version).toBe(3);
  });
  it('未成立の編集中配合は保存可能だが、個体には認めない。発見は格納庫と別に残る', () => {
    const base = { ...snapshot(game()), design: { first: 'iron' as const, second: 'iron' as const }, discovered: ['furnace' as const] };
    expect(parseSave(toSave(base))).toEqual(base);
    expect(() => parseSave({ ...toSave(base), nextId: 2, roster: [{ id: 1, design: base.design, wins: 0, losses: 0 }] })).toThrow('配合');
  });
  it('v3の保存前に旧v2原本を退避し、以後の保存でバックアップを書き換えない', () => {
    const key = 'monster-factory/save', raw = JSON.stringify({ version: 2, original: '旧データの原本' });
    const values = new Map([[key, raw]]);
    vi.stubGlobal('localStorage', { getItem: (k: string) => values.get(k) ?? null, setItem: (k: string, value: string) => values.set(k, value) });
    try {
      expect(writeSave(snapshot(game()))).toBe(true);
      expect(values.get(`${key}/v2-backup`)).toBe(raw);
      expect(JSON.parse(values.get(key)!).version).toBe(3);
      values.set(key, JSON.stringify({ version: 2, original: '別データ' }));
      expect(writeSave(snapshot(game()))).toBe(true);
      expect(values.get(`${key}/v2-backup`)).toBe(raw);
    } finally { vi.unstubAllGlobals(); }
  });
});
