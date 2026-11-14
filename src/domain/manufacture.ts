import { calculate, unitName, type Design, type Stats } from './design';

export type Unit = { id: number; name: string; design: Design; stats: Stats; wins: number; losses: number };
export const makeUnit = (design: Design, id: number): Unit => ({ id, name: unitName(design, id), design: { ...design }, stats: calculate(design), wins: 0, losses: 0 });

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
