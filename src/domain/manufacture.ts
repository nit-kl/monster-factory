import { calculate, unitName, type Design, type Stats } from './design';
import type { RecipeId } from '../data/recipes';

export type Unit = { id: number; name: string; nickname?: string; design: Design; stats: Stats; wins: number; losses: number };
export const makeUnit = (design: Design, id: number): Unit => ({ id, name: unitName(design, id), design: { ...design, ...(design.moves ? { moves: [...design.moves] as const } : {}) }, stats: calculate(design), wins: 0, losses: 0 });

export const nicknamePresets: Record<RecipeId, readonly string[]> = {
  wraith: ['クロガネ', 'ヨロイマル', '灯守'],
  furnace: ['カマド', 'アカガネ', '焔心'],
  bloom: ['ヒバナ', 'ベニバネ', '咲火'],
  thorn: ['ネッコ', 'モリバン', '朽葉'],
  prism: ['ツキカゲ', '蒼月', '硝子牙'],
  bell: ['スズネ', 'ミナモ', '宵鐘'],
};

export function veteranBadge(u: Pick<Unit, 'wins' | 'losses'>): { title: string; tone: 'good' | 'info' } | null {
  if (u.wins >= 5) return { title: '第七工場の誇り', tone: 'good' };
  if (u.wins >= 3) return { title: '歴戦の勇士', tone: 'good' };
  if (u.wins >= 1) return { title: '初陣の守り手', tone: 'info' };
  if (u.losses >= 1) return { title: '生還個体', tone: 'info' };
  return null;
}

export const unitTitle = (u: Pick<Unit, 'name' | 'nickname'>) => (u.nickname ? `${u.nickname}（${u.name}）` : u.name);

/** 格納庫に置ける数。あふれた古い個体は療養棟へ移す（破棄しない）。 */
export const hangarSize = 5;
export function addToHangar(roster: Unit[], unit: Unit): { roster: Unit[]; moved: number } {
  const next = [...roster, unit];
  const moved = Math.max(0, next.length - hangarSize);
  return { roster: next.slice(moved), moved };
}

/** 製造ラインの段階。演出はこの時間表だけを見て動く。 */
export const lineStages = ['culture', 'drain', 'toGraft', 'graftAttack', 'graftDefense', 'toInspect', 'inspect', 'toPad', 'reveal'] as const;
export type LineStage = (typeof lineStages)[number];
export const stageGroup: Record<LineStage, 0 | 1 | 2 | 3> = { culture: 0, drain: 0, toGraft: 1, graftAttack: 1, graftDefense: 1, toInspect: 2, inspect: 2, toPad: 3, reveal: 3 };
export const groupNames = ['材料共鳴', '生命形成', '能力測定', '誕生'] as const;

export function stageDurations(): Record<LineStage, number> {
  return { culture: 4200, drain: 1000, toGraft: 1200, graftAttack: 2000, graftDefense: 2000, toInspect: 1000, inspect: 1800, toPad: 1000, reveal: 2600 };
}
export function totalDuration() {
  return Object.values(stageDurations()).reduce((a, b) => a + b, 0);
}
export function lineAt(ms: number): { stage: LineStage; index: number; local: number; done: boolean; overall: number } {
  const d = stageDurations(), total = totalDuration();
  let t = Math.max(0, ms);
  for (let index = 0; index < lineStages.length; index++) {
    const stage = lineStages[index];
    if (t < d[stage]) return { stage, index, local: t / d[stage], done: false, overall: Math.min(1, ms / total) };
    t -= d[stage];
  }
  return { stage: 'reveal', index: lineStages.length - 1, local: 1, done: true, overall: 1 };
}
