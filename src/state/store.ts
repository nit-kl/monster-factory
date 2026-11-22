import { create } from 'zustand';
import type { EnemyId } from '../data/enemies';
import { simulate, type BattleMods, type BattleResult } from '../domain/battle';
import { calculate, initialDesign, overCapacity, unlocked, recipeFor, type Design } from '../domain/design';
import { addToHangar, makeUnit, type Unit } from '../domain/manufacture';
import { battleFinished, dayOf, initialProgress, manufactured, sceneFinished, sceneOf, startChapter2, stepOf, type Progress } from '../domain/progress';
import { writeSave, type GameData } from '../domain/save';
import { resolveMoves, type Loadout } from '../data/skills';
import { previewMode } from './previewMode';
import { deployTower, defendTower, type Order, type TowerBattle } from '../domain/towerBattle';

export type Sub = 'hub' | 'design' | 'manufacture' | 'battle';
export type ActiveBattle = { unit: Unit; enemy: EnemyId; result: BattleResult };
type State = GameData & {
  started: boolean; sub: Sub;
  towerBattle: TowerBattle | null;
  orderTower: (actor: number, order: Order) => void;
  building: Design | null; lastBuilt: number | null; battle: ActiveBattle | null;
  newGame: () => void; resume: (data: GameData) => void; toTitle: () => void;
  finishScene: (flags: readonly string[]) => void;
  advanceChapter: () => void;
  setDesign: (change: Partial<Design>) => void; go: (sub: Sub) => void;
  startManufacture: () => void; completeManufacture: () => void;
  startBattle: (unitId: number, enemy: EnemyId) => void; concludeBattle: () => void;
  setUnitMoves: (unitId: number, moves: Loadout) => void;
  setUnitNickname: (unitId: number, nickname: string) => void;
};
const fresh = (): GameData => ({ progress: initialProgress, design: { ...initialDesign }, roster: [], nextId: 1, battles: 0, moved: 0, discovered: [] });
const transient = { sub: 'hub' as Sub, building: null, lastBuilt: null, battle: null, towerBattle: null };

export const useGame = create<State>((set, get) => ({
  ...fresh(), ...transient, started: false,
  newGame: () => set({ ...fresh(), ...transient, started: true }),
  resume: data => set({ ...data, ...transient, started: true }),
  toTitle: () => set({ started: false, ...transient }),
  finishScene: flags => set(s => {
    const leaving = sceneOf(s.progress);
    let progress = sceneFinished(s.progress, flags);
    let roster = s.roster;
    if (leaving === 'c5demand') {
      const vet = [...roster].sort((a, b) => b.wins - a.wins || a.id - b.id)[0];
      if (vet) roster = roster.map(u => (u.id === vet.id ? { ...u, away: true } : u));
    }
    if (leaving === 'c8command') roster = roster.map(u => (u.away ? { ...u, away: false } : u));
    const step = stepOf(progress);
    if (step.kind === 'objective' && step.fresh) progress = { ...progress, cohort: s.nextId };
    return { progress, roster, sub: 'hub' };
  }),
  advanceChapter: () => set(s => ({ progress: startChapter2(s.progress), sub: 'hub' })),
  setDesign: change => set(s => {
    const design = { ...s.design, ...change };
    if (change.first || change.second) delete design.moves;
    const recipe = recipeFor(design);
    if (design.moves && recipe) design.moves = resolveMoves(recipe.id, design.moves);
    return { design };
  }),
  setUnitMoves: (unitId, moves) => set(s => {
    if (s.battle || s.building) return {};
    return { roster: s.roster.map(u => {
      if (u.id !== unitId) return u;
      const design = { ...u.design, moves: resolveMoves(recipeFor(u.design)!.id, moves) };
      return { ...u, design, stats: calculate(design) };
    }) };
  }),
  setUnitNickname: (unitId, nickname) => set(s => {
    if (s.battle || s.building) return {};
    const trimmed = nickname.trim().slice(0, 20);
    return {
      roster: s.roster.map(u => {
        if (u.id !== unitId) return u;
        const next: Unit = { ...u };
        if (trimmed) next.nickname = trimmed;
        else delete next.nickname;
        return next;
      }),
    };
  }),
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
    if (!unit || s.battle || s.towerBattle || unit.away) return;
    const step = stepOf(s.progress);
    const onObjective = step.kind === 'objective' && step.enemy === enemy;
    if (onObjective && step.fresh && unit.id < (s.progress.cohort ?? 1)) return;
    const mods: BattleMods | undefined = onObjective ? step.mods : undefined;
    const battles = s.battles + 1;
    if (onObjective && step.towerDefense) {
      const team = [unit, ...s.roster.filter(u => !u.away && u.id !== unitId)].slice(0, 2);
      set({ battles, sub: 'battle', towerBattle: deployTower(team) });
      return;
    }
    set({ battles, sub: 'battle', battle: { unit, enemy, result: simulate(unit.stats, enemy, battles * 7919, mods) } });
  },
  orderTower: (actor, order) => set(s => s.towerBattle ? { towerBattle: defendTower(s.towerBattle, actor, order) } : {}),
  concludeBattle: () => set(s => {
    if (s.towerBattle) {
      const { allies, outcome } = s.towerBattle;
      if (!outcome) return {};
      return { towerBattle: null, sub: 'hub', lastBuilt: allies[0].unit.id,
        roster: s.roster.map(u => allies.some(a => a.unit.id === u.id) ? { ...u, wins: u.wins + Number(outcome === 'win'), losses: u.losses + Number(outcome === 'loss') } : u),
        progress: battleFinished(s.progress, 'archer', outcome) };
    }
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
    if (previewMode || !s.started) return;
    if (s.progress !== prev.progress || s.design !== prev.design || s.roster !== prev.roster || s.battles !== prev.battles || !prev.started) writeSave(snapshot(s));
  });
}
export type { Progress };
