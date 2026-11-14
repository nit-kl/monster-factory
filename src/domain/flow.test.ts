import { beforeEach, describe, expect, it } from 'vitest';
import { cast } from '../data/cast';
import { interludes, steps } from '../data/chapter1';
import { scenes } from '../data/script';
import { useGame, snapshot } from '../state/store';
import { battleFinished, dayOf, initialProgress, knownEnemies, manufactured, sceneFinished, sceneOf, stepOf, viewOf, type Progress } from './progress';
import { parseSave, toSave } from './save';
import { advance, begin, choice, current, narr, opt, say, when, type Line } from './story';

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
    for (const [id, lines] of Object.entries(scenes)) for (const pick of [() => 0, (n: number) => n - 1]) for (const flags of [[], ['lostFirst', 'seenSelfBurn']]) {
      const r = read(lines, flags, pick);
      expect(r.seen.length, id).toBeGreaterThan(0);
      r.seen.forEach(l => { if (l.t === 'say') { expect(cast[l.who], `${id}: ${l.who}`).toBeDefined(); expect(l.text.length).toBeGreaterThan(0); } });
    }
  });
  it('進行表と差し込み場面が、すべて台本に存在する', () => {
    const ids = [...steps.flatMap(s => (s.kind === 'story' ? [s.scene] : [])), interludes.birth, interludes.raidLoss, ...Object.values(interludes.loss)];
    ids.forEach(id => expect(scenes[id], id).toBeDefined());
    expect(steps.at(-1)?.kind).toBe('end');
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
  it('勝ち進むと日付と相手が進み、先遣隊を退けて章末に着く', () => {
    let p = playScenes(initialProgress);
    const days: number[] = [], foes: string[] = [];
    for (let guard = 0; guard < 20 && viewOf(p) !== 'end'; guard++) {
      const s = stepOf(p);
      if (s.kind !== 'objective') throw Error('目標ではありません');
      days.push(dayOf(p)); foes.push(s.enemy);
      p = playScenes(battleFinished(p, s.enemy, 'win'));
    }
    expect(viewOf(p)).toBe('end');
    expect(foes).toEqual(['swordsman', 'archer', 'mage', 'swordsman', 'archer', 'mage']);
    expect(days).toEqual([1, 3, 5, 7, 7, 7]);
    expect(knownEnemies(p)).toEqual(['swordsman', 'archer', 'mage']);
    expect(p.seen).toContain('night');
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
    game().setDesign({ defense: 'shell' }); game().startManufacture(); game().completeManufacture();
    expect(sceneOf(game().progress)).toBe('birth'); game().finishScene([]);
    game().startBattle(1, 'swordsman'); expect(game().battle?.result.outcome).toBe('win'); game().concludeBattle();
    expect(game().roster[0]).toMatchObject({ id: 1, wins: 1, losses: 0 });
    const data = snapshot(game()), back = parseSave(JSON.parse(JSON.stringify(toSave(data))));
    expect(back).toEqual(data);
  });
  it('容量超過の設計は製造を始めない。二重の製造開始もしない', () => {
    while (viewOf(game().progress) === 'story') game().finishScene([]);
    game().setDesign({ process: 'heated', defense: 'shell' });
    game().startManufacture(); expect(game().building).toBeNull();
    game().setDesign({ process: 'standard' }); game().startManufacture(); game().setDesign({ defense: 'light' }); game().startManufacture(); game().completeManufacture(); game().completeManufacture();
    expect(game().roster).toHaveLength(1); expect(game().roster[0].design.defense).toBe('shell');
  });
  it('壊れたデータや未対応の版は拒否する', () => {
    const ok = toSave(snapshot(game()));
    expect(() => parseSave({ ...ok, version: 1 })).toThrow('対応していません');
    expect(() => parseSave({ ...ok, design: { ...ok.design, body: 'dragon' } })).toThrow('設計');
    expect(() => parseSave({ ...ok, progress: { ...ok.progress, step: 999 } })).toThrow('進行位置');
    expect(() => parseSave({ ...ok, roster: [{ id: 5, design: ok.design, wins: 0, losses: 0 }] })).toThrow('個体番号');
    expect(() => parseSave(null)).toThrow();
  });
});
