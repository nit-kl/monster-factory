import { interludes, steps, type Step } from '../data/chapter1';
import type { EnemyId } from '../data/enemies';

/** 章の進行状況。すべて保存対象。 */
export type Progress = { step: number; queue: string[]; seen: string[]; flags: string[] };
export const initialProgress: Progress = { step: 0, queue: [], seen: [], flags: [] };

export const stepOf = (p: Progress): Step => steps[Math.min(p.step, steps.length - 1)];
export const dayOf = (p: Progress) => { const s = stepOf(p); return s.kind === 'end' ? 7 : s.day; };
/** いま再生すべき場面。なければ null。 */
export function sceneOf(p: Progress): string | null {
  if (p.queue.length) return p.queue[0];
  const s = stepOf(p);
  return s.kind === 'story' ? s.scene : null;
}
export function viewOf(p: Progress): 'story' | 'hub' | 'end' {
  if (sceneOf(p)) return 'story';
  return stepOf(p).kind === 'end' ? 'end' : 'hub';
}
/** これまでに相手として登場した敵（模擬戦で選べる相手）。 */
export function knownEnemies(p: Progress): EnemyId[] {
  const out: EnemyId[] = [];
  steps.slice(0, p.step + 1).forEach(s => { if (s.kind === 'objective' && !out.includes(s.enemy)) out.push(s.enemy); });
  return out;
}

const once = (p: Progress, scene: string): Progress =>
  p.seen.includes(scene) || p.queue.includes(scene) ? p : { ...p, queue: [...p.queue, scene] };

export function sceneFinished(p: Progress, newFlags: readonly string[] = []): Progress {
  const flags = [...new Set([...p.flags, ...newFlags])];
  const scene = sceneOf(p);
  if (!scene) return { ...p, flags };
  const seen = p.seen.includes(scene) ? p.seen : [...p.seen, scene];
  if (p.queue.length) return { ...p, flags, seen, queue: p.queue.slice(1) };
  return { ...p, flags, seen, step: p.step + 1 };
}
export const manufactured = (p: Progress): Progress => once(p, interludes.birth);

export function battleFinished(p: Progress, enemy: EnemyId, outcome: 'win' | 'loss' | 'draw', selfBurned = false): Progress {
  const s = stepOf(p);
  if (s.kind !== 'objective' || s.enemy !== enemy) return p; // 練習試合は進行に影響しない
  if (outcome === 'win') return { ...p, step: p.step + 1 };
  const add = enemy === 'swordsman' && !s.raid ? ['lostFirst', ...(selfBurned ? ['seenSelfBurn'] : [])] : [];
  const flags = [...new Set([...p.flags, ...add])];
  return once({ ...p, flags }, s.raid ? interludes.raidLoss : interludes.loss[enemy]);
}
