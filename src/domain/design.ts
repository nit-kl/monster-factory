import { attacks, bodies, capacity, defenses, effects, processes, type AttackId, type BodyId, type DefenseId, type ProcessId } from '../data/parts';

export type Design = { body: BodyId; attack: AttackId; defense: DefenseId; process: ProcessId };
export type Stats = { hp: number; attack: number; speed: number; cost: number; selfBurn: number; heatProof: boolean; coldWeak: boolean; poison: boolean; regen: boolean };
export type Note = { tone: 'warn' | 'good' | 'info'; text: string };
export const initialDesign: Design = { body: 'slime', attack: 'fire', defense: 'light', process: 'standard' };

export function calculate(d: Design): Stats {
  const b = bodies[d.body], a = attacks[d.attack], f = defenses[d.defense], p = processes[d.process];
  const heatProof = d.defense === 'shell' || p.heatProof;
  return {
    hp: Math.max(1, b.hp + f.hp + p.hp),
    attack: b.attack + a.attack,
    speed: Math.max(1, b.speed + f.speed + p.speed),
    cost: b.cost + a.cost + f.cost + p.cost,
    selfBurn: d.attack === 'fire' && !heatProof ? effects.selfBurn : 0,
    heatProof,
    coldWeak: d.process === 'heated',
    poison: d.attack === 'venom',
    regen: d.defense === 'regen',
  };
}
export const overCapacity = (d: Design) => calculate(d).cost > capacity;

/** その日までに解禁されている選択肢だけで組まれた設計か。 */
export function unlocked(day: number, d: Design) {
  return bodies[d.body].day <= day && attacks[d.attack].day <= day && defenses[d.defense].day <= day && processes[d.process].day <= day;
}

/** 設計台に表示する相性メモ。性能計算と同じ値から作る。 */
export function designNotes(d: Design): Note[] {
  const s = calculate(d), notes: Note[] = [];
  if (s.cost > capacity) notes.push({ tone: 'warn', text: `培養槽の容量を ${s.cost - capacity} 超えています。このままでは製造できません。` });
  if (s.selfBurn) notes.push({ tone: 'warn', text: `火炎袋の熱が逃げません。攻撃のたびに自分も ${s.selfBurn} 傷つきます。` });
  if (d.attack === 'fire' && s.heatProof) notes.push({ tone: 'good', text: d.defense === 'shell' ? '石殻が自分の炎を防ぎます。' : '高温培養で熱に強く育ちます。自傷はありません。' });
  if (s.coldWeak) notes.push({ tone: 'warn', text: `冷気の攻撃を受けると、追加で ${effects.coldWeakness} 傷つきます。` });
  if (s.poison) notes.push({ tone: 'info', text: `攻撃が当たると相手は毒を受け、巡目の終わりに ${effects.poison} 傷つきます。` });
  if (s.regen) notes.push({ tone: 'info', text: `巡目の終わりに耐久力を ${effects.regen} 回復します。` });
  if (d.defense === 'shell') notes.push({ tone: 'info', text: '石殻は重く、速度が大きく下がります。' });
  return notes;
}

export function unitName(d: Design, id: number) {
  const prefix = { fire: '焔', claws: '爪', venom: '毒' }[d.attack];
  return `${prefix}${bodies[d.body].name} ${String(id).padStart(3, '0')}号`;
}
