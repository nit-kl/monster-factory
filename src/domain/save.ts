import { steps } from '../data/chapter1';
import { attacks, bodies, defenses, processes } from '../data/parts';
import { materials, recipes, recipeById, type RecipeId } from '../data/recipes';
import { recipeFor } from './design';
import type { Design } from './design';
import { makeUnit, hangarSize, type Unit } from './manufacture';
import type { Progress } from './progress';
import { movePools, type Loadout } from '../data/skills';

/** 保存形式 v3。v2 の個体を配合へ移行し、性能は読込時に再計算する。 */
export type SaveData = {
  version: 3;
  discovered: RecipeId[];
  progress: Progress;
  design: Design;
  roster: { id: number; design: Design; wins: number; losses: number; nickname?: string }[];
  nextId: number; battles: number; moved: number;
};
export type GameData = { progress: Progress; design: Design; roster: Unit[]; nextId: number; battles: number; moved: number; discovered: RecipeId[] };

const isObject = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null;
const count = (v: unknown, label: string): number => {
  if (!Number.isSafeInteger(v) || (v as number) < 0) throw Error(`${label}が不正です`);
  return v as number;
};
const strings = (v: unknown, label: string): string[] => {
  if (!Array.isArray(v) || v.some(x => typeof x !== 'string')) throw Error(`${label}が不正です`);
  return [...v] as string[];
};
function legacyDesign(v: unknown): Design {
  if (!isObject(v) || typeof v.body !== 'string' || !Object.hasOwn(bodies, v.body) || typeof v.attack !== 'string' || !Object.hasOwn(attacks, v.attack)
    || typeof v.defense !== 'string' || !Object.hasOwn(defenses, v.defense) || typeof v.process !== 'string' || !Object.hasOwn(processes, v.process)) throw Error('設計データが不正です');
  const id: RecipeId = v.body === 'beast' ? 'bloom' : v.attack === 'venom' ? 'thorn' : v.attack === 'fire' ? 'furnace' : 'wraith';
  const r = recipeById(id); return { first: r.pair[0], second: r.pair[1] };
}
function design(v: unknown): Design {
  if (!isObject(v) || typeof v.first !== 'string' || typeof v.second !== 'string' || !Object.hasOwn(materials, v.first) || !Object.hasOwn(materials, v.second)) throw Error('設計データが不正です');
  const d = { first: v.first, second: v.second } as Design;
  if (v.moves !== undefined) {
    const r = recipeFor(d), selected = strings(v.moves, '技構成');
    if (!r || selected.length !== 2 || selected[0] === selected[1] || selected.some(m => !movePools[r.id].includes(m as Loadout[number]))) throw Error('技構成が不正です');
    d.moves = [selected[0], selected[1]] as Loadout;
  }
  return d;
}

export function toSave(g: GameData): SaveData {
  return { version: 3, discovered: [...g.discovered], progress: g.progress, design: g.design, nextId: g.nextId, battles: g.battles, moved: g.moved, roster: g.roster.map(u => ({ id: u.id, design: u.design, wins: u.wins, losses: u.losses, ...(u.nickname ? { nickname: u.nickname } : {}) })) };
}
export function parseSave(v: unknown): GameData {
  if (!isObject(v) || (v.version !== 2 && v.version !== 3)) throw Error('この保存形式には対応していません');
  const parseDesign = v.version === 2 ? legacyDesign : design;
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
    const d = parseDesign(r.design);
    if (!recipeFor(d)) throw Error('個体の配合が不正です');
    let nickname: string | undefined;
    if (r.nickname !== undefined) {
      if (typeof r.nickname !== 'string' || !r.nickname.trim() || r.nickname.trim().length > 20) throw Error('個体の愛称が不正です');
      nickname = r.nickname.trim();
    }
    return { ...makeUnit(d, id), ...(nickname ? { nickname } : {}), wins: count(r.wins, '戦績'), losses: count(r.losses, '戦績') };
  });
  const discovered = v.version === 2 ? [] : strings(v.discovered, '発見の記録');
  if (discovered.some(id => !recipes.some(r => r.id === id))) throw Error('発見の記録が不正です');
  return { progress, design: parseDesign(v.design), roster, discovered: [...new Set([...discovered as RecipeId[], ...roster.map(u => recipeFor(u.design)!.id)])], nextId: Math.max(1, nextId), battles: count(v.battles, '戦闘回数'), moved: count(v.moved, '療養棟の記録') };
}

const key = 'monster-factory/save';
export function writeSave(g: GameData): boolean {
  try {
    const old = localStorage.getItem(key);
    if (old && JSON.parse(old).version === 2 && !localStorage.getItem(`${key}/v2-backup`)) localStorage.setItem(`${key}/v2-backup`, old);
    localStorage.setItem(key, JSON.stringify(toSave(g))); return true;
  } catch { return false; }
}
/** 保存がなければ null。壊れている場合は例外。 */
export function readSave(): GameData | null {
  let raw: string | null;
  try { raw = localStorage.getItem(key); } catch { return null; }
  if (raw === null) return null;
  return parseSave(JSON.parse(raw));
}
export function clearSave() { try { localStorage.removeItem(key); } catch { /* 保存領域が使えない環境では何もしない */ } }
