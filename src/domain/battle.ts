import { enemies, type EnemyId } from '../data/enemies';
import { effects } from '../data/parts';
import type { Stats } from './design';

export type BattleEvent = {
  turn: number;
  actor: 'monster' | 'enemy' | 'effects';
  damage: number; blocked: number; selfBurn: number; cold: number; poison: number; heal: number; extra: boolean;
  monsterHp: number; enemyHp: number;
};
export type BattleResult = {
  enemy: EnemyId; seed: number; outcome: 'win' | 'loss' | 'draw'; turns: number; log: BattleEvent[];
  monsterHp: number; enemyHp: number; maxHp: number; enemyFirst: boolean;
  totals: { dealt: number; taken: number; selfBurn: number; cold: number; poison: number; heal: number; extraShots: number; blocked: number; frozenRegen: boolean };
};

/** シードを注入する決定的な1対1の自動戦闘。同じ入力からは必ず同じ結果になる。 */
export function simulate(stats: Stats, enemyId: EnemyId, seed: number): BattleResult {
  const enemy = enemies[enemyId];
  let rng = seed >>> 0;
  const roll = () => { rng = (Math.imul(rng, 1664525) + 1013904223) >>> 0; return Math.floor((rng / 4294967296) * 5) - 2; };
  let monsterHp = stats.hp, enemyHp: number = enemy.hp, poisoned = false, turn = 0;
  const log: BattleEvent[] = [];
  const enemyFirst = enemy.speed > stats.speed;
  const enemyShots = enemy.rapidFire > 0 && enemy.speed - stats.speed >= enemy.rapidFire ? 2 : 1;
  const push = (e: Partial<BattleEvent> & Pick<BattleEvent, 'actor'>) =>
    log.push({ turn, damage: 0, blocked: 0, selfBurn: 0, cold: 0, poison: 0, heal: 0, extra: false, ...e, monsterHp, enemyHp });
  const monsterAct = () => {
    const raw = Math.max(1, stats.attack + roll());
    const damage = Math.min(enemyHp, Math.max(1, raw - enemy.armor));
    enemyHp -= damage;
    const selfBurn = Math.min(monsterHp, stats.selfBurn);
    monsterHp -= selfBurn;
    if (stats.poison) poisoned = true;
    push({ actor: 'monster', damage, selfBurn, blocked: Math.min(enemy.armor, raw - 1) });
  };
  const enemyAct = () => {
    for (let shot = 0; shot < enemyShots && monsterHp > 0; shot++) {
      const cold = enemy.element === 'cold' && stats.coldWeak ? effects.coldWeakness : 0;
      const damage = Math.min(monsterHp, Math.max(1, enemy.attack + roll()) + cold);
      monsterHp -= damage;
      push({ actor: 'enemy', damage, cold: Math.min(cold, damage), extra: shot > 0 });
    }
  };
  for (turn = 1; turn <= 40 && monsterHp > 0 && enemyHp > 0; turn++) {
    for (const act of enemyFirst ? [enemyAct, monsterAct] : [monsterAct, enemyAct]) if (monsterHp > 0 && enemyHp > 0) act();
    if (monsterHp > 0 && enemyHp > 0) {
      const poison = poisoned ? Math.min(enemyHp, effects.poison) : 0;
      const heal = stats.regen && !enemy.freeze ? Math.min(stats.hp - monsterHp, effects.regen) : 0;
      enemyHp -= poison; monsterHp += heal;
      if (poison || heal) push({ actor: 'effects', poison, heal });
    }
  }
  const sum = (f: (e: BattleEvent) => number) => log.reduce((n, e) => n + f(e), 0);
  return {
    enemy: enemyId, seed, log, monsterHp, enemyHp, maxHp: stats.hp, enemyFirst,
    turns: log.length ? log[log.length - 1].turn : 0,
    // 相打ち（自分の炎で倒れた場合など）は敗北として扱う。
    outcome: monsterHp <= 0 ? 'loss' : enemyHp <= 0 ? 'win' : 'draw',
    totals: {
      dealt: sum(e => (e.actor === 'monster' ? e.damage : 0)), taken: sum(e => (e.actor === 'enemy' ? e.damage : 0)),
      selfBurn: sum(e => e.selfBurn), cold: sum(e => e.cold), poison: sum(e => e.poison), heal: sum(e => e.heal),
      extraShots: sum(e => (e.extra ? 1 : 0)), blocked: sum(e => e.blocked), frozenRegen: stats.regen && enemy.freeze,
    },
  };
}

export function describe(e: BattleEvent, enemyName: string): string {
  if (e.actor === 'effects') return [e.poison ? `毒が回り、${enemyName}に ${e.poison}` : '', e.heal ? `再生核が ${e.heal} 回復` : ''].filter(Boolean).join(' ／ ');
  if (e.actor === 'monster') return `味方の攻撃 ${e.damage}${e.selfBurn ? ` ／ 自分の炎で ${e.selfBurn}` : ''}`;
  return `${enemyName}の${e.extra ? '追撃' : '攻撃'} ${e.damage}${e.cold ? `（冷気の弱点 +${e.cold}）` : ''}`;
}

export type Finding = { who: 'lisette' | 'vargas' | 'orphen' | 'poyon'; title: string; text: string };
/** 戦闘記録から、敗因と次の改良の手がかりを取り出す。 */
export function diagnose(r: BattleResult): Finding[] {
  const out: Finding[] = [], t = r.totals, lost = r.outcome !== 'win', hurt = t.taken + t.selfBurn;
  if (t.selfBurn > 0) {
    const pct = Math.round((t.selfBurn / Math.max(1, hurt)) * 100);
    out.push({ who: 'lisette', title: `受けた損害の ${pct}% が自分の炎`, text: lost ? '火炎袋の熱を防ぐ手立てが必要です。石殻で包むか、高温培養で熱に強く育ててください。' : '勝ちましたが、自分の炎で削られています。耐熱の備えがあれば、もっと余裕が出ます。' });
  }
  if (t.extraShots > 0) out.push({ who: 'vargas', title: `追撃を ${t.extraShots} 回受けた`, text: '足が遅すぎて、1巡に2回射られてる。重い殻を外すか速い身体に替えて、速度の差を6未満にしろ。' });
  if (t.cold > 0) out.push({ who: 'poyon', title: `冷気の弱点で ${t.cold} の追加損害`, text: '高温で育てた子は寒さに弱いんです。別の培養工程にして、熱は石殻で防ぐ手もありますよ。' });
  if (lost && r.enemyFirst && !t.extraShots) out.push({ who: 'orphen', title: '毎巡、先手を取られた', text: '相手より遅いと、先に殴られ続けるのじゃ。速度を上げるか、耐久力で受け切るか、どちらかを選びたまえ。' });
  if (lost && r.enemyHp > 0 && !out.length) out.push({ who: 'orphen', title: `相手の耐久力が ${r.enemyHp} 残った`, text: '純粋に火力か耐久力が足りておらん。攻めの器官か身体を見直すのじゃ。' });
  if (r.outcome === 'draw') out.push({ who: 'lisette', title: '決着がつかなかった', text: '40巡かけても倒しきれませんでした。攻撃力を上げてください。' });
  if (!lost && !out.length) out.push({ who: 'lisette', title: `耐久力を ${r.monsterHp} 残して勝利`, text: '設計の狙いどおりです。記録しておきます。' });
  return out;
}
