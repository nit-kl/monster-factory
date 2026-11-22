import { moves } from '../data/skills';
import { unitTitle, type Unit } from './manufacture';
import { recipeById } from '../data/recipes';

export type Order = 'cover' | 'intercept' | 'focus';
export function deployTower(units: Unit[]) {
  return { allies: units.map(unit => ({ unit, hp: unit.stats.hp })), guard: 72, archer: 62, tower: 3,
    round: 0, log: [] as string[], outcome: null as 'win' | 'loss' | null };
}
export type TowerBattle = ReturnType<typeof deployTower>;

export function defendTower(state: TowerBattle, actor: number, order: Order): TowerBattle {
  if (state.outcome || !state.allies.some(a => a.unit.id === actor && a.hp > 0)) return state;
  const allies = state.allies.map(a => ({ ...a }));
  const leader = allies.find(a => a.unit.id === actor)!;
  const log: string[] = [];
  let { guard, archer, tower } = state;
  const round = state.round + 1;
  const exposed = round % 2 === 0;
  for (const ally of allies.filter(a => a.hp > 0)) {
    const stats = ally.unit.stats;
    const move = moves[stats.moves[state.round % 2]];
    const flank = ally === leader && order === 'focus';
    const aimArcher = archer > 0 && (guard <= 0 || flank);
    const armor = aimArcher ? (guard > 0 && !exposed ? 8 : 0) : 3;
    const signature = round === 3;
    const damage = signature ? stats.attack + stats.bonus : Math.max(1, Math.round(stats.attack * move.power) - (move.pierce ? 0 : armor));
    if (aimArcher) archer = Math.max(0, archer - damage);
    else guard = Math.max(0, guard - damage);
    ally.hp = Math.min(stats.hp, ally.hp + (move.heal ?? 0));
    log.push(unitTitle(ally.unit) + 'の' + (signature ? recipeById(stats.recipe).skill : move.name) + ' → ' + (aimArcher ? '弓兵' : '護衛') + ' −' + damage);
    if (!archer && !guard) break;
  }
  if (archer > 0) {
    if (order === 'cover') {
      leader.hp = Math.max(0, leader.hp - Math.max(2, 13 - leader.unit.stats.armor));
      log.push(unitTitle(leader.unit) + 'が射線に入り、塔を守った');
    } else if (order === 'intercept' && (exposed || leader.unit.stats.speed >= 14)) {
      log.push(unitTitle(leader.unit) + 'が弓兵の射撃を中断');
    } else { tower--; log.push('焼夷矢が換気塔に命中'); }
  }
  const front = allies.find(a => a.hp > 0);
  if (guard > 0 && front) {
    const move = moves[front.unit.stats.moves[state.round % 2]];
    front.hp = Math.max(0, front.hp - Math.max(1, 13 - front.unit.stats.armor - (move.guard ?? 0)));
    log.push('護衛剣士が' + unitTitle(front.unit) + 'に反撃');
  }
  const outcome = tower <= 0 || allies.every(a => !a.hp) ? 'loss' : (!guard && !archer) || round === 5 ? 'win' : null;
  return { allies, guard, archer, tower, round, log, outcome };
}
