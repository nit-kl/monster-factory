import { create } from 'zustand';
import { calculate, initialDesign, overCapacity, unlocked, recipeFor, type Design } from '../domain/design';
import { addToHangar, makeUnit, type Unit } from '../domain/manufacture';
import { continueFromFactory, dayOf, initialProgress, manufactured, sceneFinished, sceneOf, startChapter2, type Progress } from '../domain/progress';
import { writeSave, type GameData } from '../domain/save';
import { resolveMoves, type Loadout } from '../data/skills';
import { previewMode } from './previewMode';

export type Sub = 'hub' | 'design' | 'manufacture';
type State = GameData & {
  started: boolean; sub: Sub;
  building: Design | null; lastBuilt: number | null;
  newGame: () => void; resume: (data: GameData) => void; toTitle: () => void;
  finishScene: (flags: readonly string[]) => void;
  continueStory: () => void;
  advanceChapter: () => void;
  setDesign: (change: Partial<Design>) => void; go: (sub: Sub) => void;
  startManufacture: () => void; completeManufacture: () => void;
  setUnitMoves: (unitId: number, moves: Loadout) => void;
  setUnitNickname: (unitId: number, nickname: string) => void;
};
const fresh = (): GameData => ({ progress: initialProgress, design: { ...initialDesign }, roster: [], nextId: 1, battles: 0, moved: 0, discovered: [] });
const transient = { sub: 'hub' as Sub, building: null, lastBuilt: null };

export const useGame = create<State>(set => ({
  ...fresh(), ...transient, started: false,
  newGame: () => set({ ...fresh(), ...transient, started: true }),
  resume: data => set({ ...data, ...transient, started: true }),
  toTitle: () => set({ started: false, ...transient }),
  finishScene: flags => set(s => {
    const leaving = sceneOf(s.progress);
    const progress = sceneFinished(s.progress, flags);
    let roster = s.roster;
    if (leaving === 'c5demand') {
      const vet = [...roster].sort((a, b) => b.wins - a.wins || a.id - b.id)[0];
      if (vet) roster = roster.map(u => (u.id === vet.id ? { ...u, away: true } : u));
    }
    if (leaving === 'c8command') roster = roster.map(u => (u.away ? { ...u, away: false } : u));
    return { progress, roster, sub: 'hub' };
  }),
  continueStory: () => set(s => s.roster.length ? { progress: continueFromFactory(s.progress) } : {}),
  advanceChapter: () => set(s => ({ progress: startChapter2(s.progress), sub: 'hub' })),
  setDesign: change => set(s => {
    const design = { ...s.design, ...change };
    if (change.first || change.second) delete design.moves;
    const recipe = recipeFor(design);
    if (design.moves && recipe) design.moves = resolveMoves(recipe.id, design.moves);
    return { design };
  }),
  setUnitMoves: (unitId, moves) => set(s => {
    if (s.building) return {};
    return { roster: s.roster.map(u => {
      if (u.id !== unitId) return u;
      const design = { ...u.design, moves: resolveMoves(recipeFor(u.design)!.id, moves) };
      return { ...u, design, stats: calculate(design) };
    }) };
  }),
  setUnitNickname: (unitId, nickname) => set(s => {
    if (s.building) return {};
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
