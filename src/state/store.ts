import { create } from 'zustand';
import type { EnemyId } from '../data/enemies';
import { simulate, type BattleResult } from '../domain/battle';
import { initialDesign, overCapacity, unlocked, recipeFor, type Design } from '../domain/design';
import { addToHangar, makeUnit, type Unit } from '../domain/manufacture';
import { battleFinished, dayOf, initialProgress, manufactured, sceneFinished, type Progress } from '../domain/progress';
import { writeSave, type GameData } from '../domain/save';

export type Sub = 'hub' | 'design' | 'manufacture' | 'battle';
export type ActiveBattle = { unit: Unit; enemy: EnemyId; result: BattleResult };
type State = GameData & {
  started: boolean; sub: Sub;
  building: Design | null; lastBuilt: number | null; battle: ActiveBattle | null;
  newGame: () => void; resume: (data: GameData) => void; toTitle: () => void;
  finishScene: (flags: readonly string[]) => void;
  setDesign: (change: Partial<Design>) => void; go: (sub: Sub) => void;
  startManufacture: () => void; completeManufacture: () => void;
  startBattle: (unitId: number, enemy: EnemyId) => void; concludeBattle: () => void;
};
const fresh = (): GameData => ({ progress: initialProgress, design: { ...initialDesign }, roster: [], nextId: 1, battles: 0, moved: 0, discovered: [] });
const transient = { sub: 'hub' as Sub, building: null, lastBuilt: null, battle: null };

export const useGame = create<State>((set, get) => ({
  ...fresh(), ...transient, started: false,
  newGame: () => set({ ...fresh(), ...transient, started: true }),
  resume: data => set({ ...data, ...transient, started: true }),
  toTitle: () => set({ started: false, ...transient }),
  finishScene: flags => set(s => ({ progress: sceneFinished(s.progress, flags), sub: 'hub' })),
  setDesign: change => set(s => ({ design: { ...s.design, ...change } })),
  go: sub => set({ sub }),
  startManufacture: () => set(s => (s.building || overCapacity(s.design) || !unlocked(dayOf(s.progress), s.design) ? {} : { building: { ...s.design }, sub: 'manufacture' })),
  completeManufacture: () => set(s => {
    if (!s.building) return {};
    const unit = makeUnit(s.building, s.nextId);
    const { roster, moved } = addToHangar(s.roster, unit);
    return { roster, discovered: [...new Set([...s.discovered, recipeFor(s.building)!.id])], moved: s.moved + moved, nextId: s.nextId + 1, lastBuilt: unit.id, building: null, sub: 'hub', progress: manufactured(s.progress) };
  }),
  startBattle: (unitId, enemy) => {
    const s = get(), unit = s.roster.find(u => u.id === unitId);
    if (!unit || s.battle) return;
    const battles = s.battles + 1;
    set({ battles, sub: 'battle', battle: { unit, enemy, result: simulate(unit.stats, enemy, battles * 7919) } });
  },
  concludeBattle: () => set(s => {
    if (!s.battle) return {};
    const { unit, enemy, result } = s.battle, won = result.outcome === 'win';
    return {
      battle: null, sub: 'hub', lastBuilt: unit.id,
      roster: s.roster.map(u => (u.id === unit.id ? { ...u, wins: u.wins + (won ? 1 : 0), losses: u.losses + (won ? 0 : 1) } : u)),
      progress: battleFinished(s.progress, enemy, result.outcome, result.totals.selfBurn > 0),
    };
  }),
}));

export const snapshot = (s: GameData): GameData => ({ progress: s.progress, design: s.design, roster: s.roster, nextId: s.nextId, battles: s.battles, moved: s.moved, discovered: s.discovered });
/** 進行が変わるたびに自動保存する。 */
export function enableAutosave() {
  return useGame.subscribe((s, prev) => {
    if (!s.started) return;
    if (s.progress !== prev.progress || s.design !== prev.design || s.roster !== prev.roster || s.battles !== prev.battles || !prev.started) writeSave(snapshot(s));
  });
}
export type { Progress };
