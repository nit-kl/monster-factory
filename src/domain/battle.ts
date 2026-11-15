import { enemies, type EnemyId } from '../data/enemies';
import type { Stats } from './design';
import { actionSkill, enemySkills, moves } from '../data/skills';
const effects = { coldWeakness: 10, poison: 7, regen: 5 };

export type BattleEvent = {
  turn: number;
  actor: 'monster' | 'enemy' | 'effects';
  damage: number; blocked: number; selfBurn: number; cold: number; poison: number; heal: number; extra: boolean;
  monsterHp: number; enemyHp: number;
  special: boolean; absorbed: number;
  skill: string; skillName: string; fx: string; color: string; guard: number;
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
  let monsterHp = stats.hp, enemyHp: number = enemy.hp, poisoned = false, turn = 0, attacks = 0, enemyActions = 0;
  let monsterGuard = 0, enemyGuard = 0;
  const log: BattleEvent[] = [];
  const enemyFirst = enemy.speed > stats.speed;
  const enemyShots = enemy.rapidFire > 0 && enemy.speed - stats.speed >= enemy.rapidFire ? 2 : 1;
  const push = (e: Partial<BattleEvent> & Pick<BattleEvent, 'actor'>) =>
    log.push({ turn, damage: 0, blocked: 0, selfBurn: 0, cold: 0, poison: 0, heal: 0, extra: false, special: false, absorbed: 0, skill: '', skillName: '', fx: '', color: '#ffffff', guard: 0, ...e, monsterHp, enemyHp });
  const monsterAct = () => {
    const skill = actionSkill(stats.recipe, stats.moves, attacks++), special = attacks % 3 === 0;
    const raw = Math.max(1, Math.round(stats.attack * skill.power) + roll() + (special ? stats.bonus : 0));
    const armor = skill.pierce ? 0 : enemy.armor + enemyGuard;
    enemyGuard = 0;
    const damage = Math.min(enemyHp, Math.max(1, raw - armor));
    enemyHp -= damage;
    const selfBurn = Math.min(monsterHp, stats.selfBurn);
    monsterHp -= selfBurn;
    if (skill.poison) poisoned = true;
    const heal = monsterHp > 0 && !enemy.freeze ? Math.min(stats.hp - monsterHp, skill.heal ?? 0, skill.fx === 'drain' ? damage : Infinity) : 0;
    monsterHp += heal;
    if (skill.guard) monsterGuard = skill.guard;
    push({ actor: 'monster', damage, selfBurn, heal, special, blocked: Math.min(armor, raw - 1), skill: skill.id, skillName: skill.name, fx: skill.fx, color: skill.color, guard: skill.guard ?? 0 });
  };
  const enemyAct = () => {
    const skill = enemySkills[enemyId][enemyActions++ % 3], special = enemyActions % 3 === 0;
    if (skill.guard) enemyGuard = skill.guard;
    for (let shot = 0; shot < enemyShots && monsterHp > 0; shot++) {
      const cold = enemy.element === 'cold' && stats.coldWeak ? effects.coldWeakness : 0;
      const raw = Math.max(1, Math.round(enemy.attack * skill.power) + roll());
      const absorbed = skill.pierce ? 0 : Math.min(stats.armor + monsterGuard, raw - 1);
      monsterGuard = 0;
      const damage = Math.min(monsterHp, raw - absorbed + cold);
      monsterHp -= damage;
      push({ actor: 'enemy', damage, absorbed, cold: Math.min(cold, damage), extra: shot > 0, special, skill: skill.id, skillName: skill.name, fx: skill.fx, color: skill.color, guard: shot === 0 ? skill.guard ?? 0 : 0 });
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
      extraShots: sum(e => (e.extra ? 1 : 0)), blocked: sum(e => e.blocked), frozenRegen: (stats.regen || stats.moves.some(m => moves[m].heal)) && enemy.freeze,
    },
  };
}

export function describe(e: BattleEvent, enemyName: string): string {
  if (e.actor === 'effects') return [e.poison ? `毒が回り、${enemyName}に ${e.poison}` : '', e.heal ? `生命の再生で ${e.heal} 回復` : ''].filter(Boolean).join(' ／ ');
  const who = e.actor === 'monster' ? '味方' : enemyName;
  return `${who}：${e.skillName}${e.extra ? '（追撃）' : ''} ${e.damage}${e.guard ? ` ／ 次の一撃を${e.guard}軽減` : ''}${e.heal ? ` ／ ${e.heal}回復` : ''}${e.cold ? ` ／ 冷気 +${e.cold}` : ''}`;
}

export type Finding = { who: 'lisette' | 'vargas' | 'orphen' | 'poyon'; title: string; text: string };
/** 戦闘記録から、敗因と次の改良の手がかりを取り出す。 */
export function diagnose(r: BattleResult): Finding[] {
  const out: Finding[] = [], t = r.totals, lost = r.outcome !== 'win';
  if (t.extraShots > 0) out.push({ who: 'vargas', title: `追撃を ${t.extraShots} 回受けた`, text: '重い鉄の身体は弓兵に追いつけねえ。古樹の種と竜の血、または星硝子と月光なら速度9以上で追撃を受けねえ。格納庫で疾風撃や守勢打に組み替える手もあるぞ。' });
  if (t.cold > 0) out.push({ who: 'poyon', title: `冷気の弱点で ${t.cold} の追加損害`, text: '竜の血を使った子は、冷気で余計に傷つきます。亡霊の灯と星硝子なら、冷たい環境にも強い子が生まれますよ。' });
  if (t.frozenRegen) out.push({ who: 'orphen', title: '再生と回復技が冷気で封じられた', text: '魔法使いの冷気は再生能力だけでなく、再生波や生命吸収の回復も止めてしまう。格納庫で守勢打や攻撃技に組み替えるとよいぞ。' });
  if (lost && t.blocked >= 6) out.push({ who: 'lisette', title: `盾と防御に ${t.blocked} 防がれた`, text: '通常攻撃が相手の盾や守勢に阻まれています。鉄くずと竜の血の一撃や貫通撃を選ぶか、守勢打・生命吸収で3行動目の固有技まで耐えましょう。' });
  if (lost && r.enemyFirst && !t.extraShots) out.push({ who: 'orphen', title: '毎巡、先手を取られた', text: '相手より遅いと先に削られる。格納庫で通常技を守勢打や再生波に組み替えて固有技まで耐えるか、素早い配合を試したまえ。' });
  if (lost && r.enemyHp > 0 && !out.length) out.push({ who: 'orphen', title: `相手の耐久力が ${r.enemyHp} 残った`, text: '格納庫で通常技の組み合わせを見直すか、別の配合を試そう。剣士には鉄くずと竜の血の一撃が有効じゃ。固有技は3回目の攻撃で盾を貫くぞ。' });
  if (r.outcome === 'draw') out.push({ who: 'lisette', title: '決着がつかなかった', text: '40巡かけても倒しきれませんでした。攻撃技や侵蝕弾・貫通撃へ組み替えて火力を上げてください。' });
  if (!lost && !out.length) out.push({ who: 'lisette', title: `耐久力を ${r.monsterHp} 残して勝利`, text: '配合と技構成の狙いどおりです。記録しておきます。' });
  return out;
}
