import { steps } from '../data/chapter1';
import { attacks, bodies, defenses, processes } from '../data/parts';
import type { Design } from './design';
import { makeUnit, hangarSize, type Unit } from './manufacture';
import type { Progress } from './progress';

/** 保存形式 v2。個体の性能は保存せず、読込時に設計から再計算する。 */
export type SaveData = {
  version: 2;
  progress: Progress;
  design: Design;
  roster: { id: number; design: Design; wins: number; losses: number }[];
  nextId: number; battles: number; moved: number;
};
export type GameData = { progress: Progress; design: Design; roster: Unit[]; nextId: number; battles: number; moved: number };

const isObject = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null;
const count = (v: unknown, label: string): number => {
  if (!Number.isSafeInteger(v) || (v as number) < 0) throw Error(`${label}が不正です`);
  return v as number;
};
const strings = (v: unknown, label: string): string[] => {
  if (!Array.isArray(v) || v.some(x => typeof x !== 'string')) throw Error(`${label}が不正です`);
  return [...v] as string[];
};
function design(v: unknown): Design {
  if (!isObject(v) || typeof v.body !== 'string' || !Object.hasOwn(bodies, v.body) || typeof v.attack !== 'string' || !Object.hasOwn(attacks, v.attack)
    || typeof v.defense !== 'string' || !Object.hasOwn(defenses, v.defense) || typeof v.process !== 'string' || !Object.hasOwn(processes, v.process)) throw Error('設計データが不正です');
  return { body: v.body, attack: v.attack, defense: v.defense, process: v.process } as Design;
}

export function toSave(g: GameData): SaveData {
  return { version: 2, progress: g.progress, design: g.design, nextId: g.nextId, battles: g.battles, moved: g.moved, roster: g.roster.map(u => ({ id: u.id, design: u.design, wins: u.wins, losses: u.losses })) };
}
export function parseSave(v: unknown): GameData {
  if (!isObject(v) || v.version !== 2) throw Error('この保存形式には対応していません');
  const p = v.progress;
  if (!isObject(p)) throw Error('進行データが不正です');
  const step = count(p.step, '進行位置');
  if (step >= steps.length) throw Error('進行位置が不正です');
  const progress: Progress = { step, queue: strings(p.queue, '場面の予約'), seen: strings(p.seen, '既読の記録'), flags: strings(p.flags, '選択の記録') };
  const nextId = count(v.nextId, '個体番号');
  if (!Array.isArray(v.roster) || v.roster.length > hangarSize) throw Error('格納庫のデータが不正です');
  const ids = new Set<number>();
  const roster = v.roster.map((r: unknown) => {
    if (!isObject(r)) throw Error('個体データが不正です');
    const id = count(r.id, '個体番号');
    if (id < 1 || id >= nextId || ids.has(id)) throw Error('個体番号が不正です');
    ids.add(id);
    return { ...makeUnit(design(r.design), id), wins: count(r.wins, '戦績'), losses: count(r.losses, '戦績') };
  });
  return { progress, design: design(v.design), roster, nextId: Math.max(1, nextId), battles: count(v.battles, '戦闘回数'), moved: count(v.moved, '療養棟の記録') };
}

const key = 'monster-factory/save';
export function writeSave(g: GameData): boolean {
  try { localStorage.setItem(key, JSON.stringify(toSave(g))); return true; } catch { return false; }
}
/** 保存がなければ null。壊れている場合は例外。 */
export function readSave(): GameData | null {
  let raw: string | null;
  try { raw = localStorage.getItem(key); } catch { return null; }
  if (raw === null) return null;
  return parseSave(JSON.parse(raw));
}
export function clearSave() { try { localStorage.removeItem(key); } catch { /* 保存領域が使えない環境では何もしない */ } }
