import { recipeById, type RecipeId } from './recipes';
import type { EnemyId } from './enemies';

export type MoveId = 'strike' | 'bolt' | 'guard' | 'mend' | 'venom' | 'drain' | 'pierce' | 'rush';
export type Loadout = readonly [MoveId, MoveId];
export type Skill = { id: string; name: string; note: string; fx: string; color: string; power: number; guard?: number; heal?: number; poison?: boolean; pierce?: boolean };
export const moves: Record<MoveId, Skill> = {
  strike: { id: 'strike', name: '強打', note: '威力100%。衝撃を伴う近接攻撃。', fx: 'slash', color: '#ffe2b4', power: 1 },
  bolt: { id: 'bolt', name: '魔力弾', note: '威力100%。魔力を飛び道具にして放つ。', fx: 'bolt', color: '#ff9860', power: 1 },
  guard: { id: 'guard', name: '守勢打', note: '威力65%。次に受ける一撃を8軽減。重複せず更新。', fx: 'guard', color: '#8dcaff', power: 0.65, guard: 8 },
  mend: { id: 'mend', name: '再生波', note: '威力50%。耐久を10回復。凍結中は回復不可。', fx: 'heal', color: '#8df0bd', power: 0.5, heal: 10 },
  venom: { id: 'venom', name: '侵蝕弾', note: '威力70%。毒を付与し、毎巡7ダメージ。毒は重複しない。', fx: 'poison', color: '#b2e66c', power: 0.7, poison: true },
  drain: { id: 'drain', name: '生命吸収', note: '威力75%。与えたダメージを上限に6回復。凍結中は回復不可。', fx: 'drain', color: '#d49cff', power: 0.75, heal: 6 },
  pierce: { id: 'pierce', name: '貫通撃', note: '威力85%。装甲と一時防御を無視する。', fx: 'pierce', color: '#d3e5ff', power: 0.85, pierce: true },
  rush: { id: 'rush', name: '疾風撃', note: '威力85%。素早く離脱し、次に受ける一撃を4軽減。', fx: 'rush', color: '#b7c4ff', power: 0.85, guard: 4 },
};
export const movePools: Record<RecipeId, readonly MoveId[]> = {
  wraith: ['strike', 'bolt', 'guard', 'drain'], furnace: ['bolt', 'strike', 'guard', 'drain'],
  bloom: ['strike', 'bolt', 'rush', 'mend'], thorn: ['venom', 'strike', 'bolt', 'mend'],
  prism: ['strike', 'bolt', 'pierce', 'rush'], bell: ['bolt', 'strike', 'guard', 'mend'],
};
export function resolveMoves(id: RecipeId, selected?: Loadout): Loadout {
  const pool = movePools[id];
  return selected && selected[0] !== selected[1] && selected.every(m => pool.includes(m)) ? [...selected] : [pool[0], pool[1]];
}
export function signature(id: RecipeId): Skill {
  const r = recipeById(id);
  return { id: `signature-${id}`, name: r.skill, note: '3行動目に自動発動。装甲と一時防御を貫通。', fx: id, color: r.color, power: 1, pierce: true, poison: id === 'thorn' };
}
export const enemySkills: Record<EnemyId, readonly [Skill, Skill, Skill]> = {
  swordsman: [
    { ...moves.strike, id: 'sword-cut', name: '斬り込み' },
    { ...moves.guard, id: 'shield-bash', name: '盾打ち', guard: 4, power: 0.8, note: '攻撃し、次の一撃を4軽減。' },
    { ...moves.pierce, id: 'sword-break', name: '破城斬', fx: 'sword', power: 1.2, note: '3行動目。装甲と一時防御を貫く斬撃。' },
  ],
  archer: [
    { ...moves.pierce, id: 'arrow-shot', name: '狙い射ち', power: 1, pierce: false, note: '矢による通常攻撃。' },
    { ...moves.rush, id: 'arrow-step', name: '退き射ち', power: 0.9, guard: 2, note: '射撃し、次の一撃を2軽減。' },
    { ...moves.bolt, id: 'arrow-rain', name: '流星連射', fx: 'arrows', power: 1.2, color: '#ffe2a0', note: '3行動目。矢の雨を放つ。' },
  ],
  mage: [
    { ...moves.bolt, id: 'ice-bolt', name: '氷弾', color: '#7fe6ff', note: '冷気の弾を放つ。' },
    { ...moves.guard, id: 'ice-ward', name: '氷壁の矢', color: '#7fe6ff', guard: 3, power: 0.8, note: '冷気で攻撃し、次の一撃を3軽減。' },
    { ...moves.bolt, id: 'ice-storm', name: '絶零嵐', fx: 'ice', color: '#7fe6ff', power: 1.15, note: '3行動目。冷気の嵐を放つ。' },
  ],
  beast: [
    { ...moves.strike, id: 'beast-bite', name: '噛みつき', power: 1.05, note: '速い牙。' },
    { ...moves.rush, id: 'beast-rush', name: '突進', power: 0.9, note: '体当たりし、次の一撃を4軽減。' },
    { ...moves.pierce, id: 'beast-fang', name: '裂牙', fx: 'slash', power: 1.2, note: '3行動目。装甲を裂く。' },
  ],
  knight: [
    { ...moves.strike, id: 'knight-cut', name: '重斬', power: 0.95, note: '重い斬撃。' },
    { ...moves.guard, id: 'knight-wall', name: '大盾', guard: 6, power: 0.7, note: '盾で受け、次の一撃を6軽減。' },
    { ...moves.pierce, id: 'knight-break', name: '盾砕き', fx: 'sword', power: 1.15, note: '3行動目。装甲を貫く。' },
  ],
  sniper: [
    { ...moves.pierce, id: 'snipe-shot', name: '精密射撃', power: 1, pierce: false, note: '遠い矢。' },
    { ...moves.rush, id: 'snipe-step', name: '移動射撃', power: 0.85, guard: 3, note: '射って距離を取る。' },
    { ...moves.pierce, id: 'snipe-heart', name: '射貫き', fx: 'arrows', power: 1.25, color: '#ffe2a0', note: '3行動目。急所を射抜く。' },
  ],
  golem: [
    { ...moves.strike, id: 'golem-slam', name: '岩拳', power: 0.9, note: '遅い拳。' },
    { ...moves.guard, id: 'golem-shell', name: '岩殻', guard: 8, power: 0.55, note: '殻を閉じ、次の一撃を8軽減。' },
    { ...moves.pierce, id: 'golem-quake', name: '地鳴り', fx: 'slash', power: 1.1, note: '3行動目。足元を割る。' },
  ],
  alpha: [
    { ...moves.strike, id: 'alpha-bite', name: '王牙', power: 1.1, note: '群れの長の牙。' },
    { ...moves.rush, id: 'alpha-rush', name: '踏み込み', power: 0.95, guard: 2, note: '退かない突進。' },
    { ...moves.pierce, id: 'alpha-howl', name: '咆哮咬', fx: 'slash', power: 1.25, note: '3行動目。喉を狙う。' },
  ],
  crusader: [
    { ...moves.strike, id: 'cross-smite', name: '断罪', power: 1, note: '十字軍の剣。' },
    { ...moves.guard, id: 'cross-ward', name: '聖壁', guard: 5, power: 0.75, note: '壁を作り、次の一撃を5軽減。' },
    { ...moves.pierce, id: 'cross-judgement', name: '裁決', fx: 'sword', power: 1.15, note: '3行動目。装甲を割る。' },
  ],
  armking: [
    { ...moves.strike, id: 'arm-crush', name: '圧砕', power: 1.05, note: '右腕の拳。' },
    { ...moves.guard, id: 'arm-brace', name: '鉄の構え', guard: 5, power: 0.8, note: '構え、次の一撃を5軽減。' },
    { ...moves.pierce, id: 'arm-cannon', name: '王腕砲', fx: 'furnace', power: 1.3, color: '#ff9d4f', note: '3行動目。止まらない砲撃。' },
  ],
  oath: [
    { ...moves.bolt, id: 'oath-pulse', name: '誓いの脈', power: 0.8, note: '角が震える。' },
    { ...moves.guard, id: 'oath-still', name: '立ち止まる', guard: 6, power: 0.5, note: '動かず、次の一撃を6軽減。' },
    { ...moves.bolt, id: 'oath-ring', name: '跪かせる輪', fx: 'bell', power: 0.9, color: '#e8c15a', note: '3行動目。武器を下ろさせる波。' },
  ],
};
export function actionSkill(id: RecipeId, loadout: Loadout, action: number): Skill {
  const slot = action % 3;
  return slot === 2 ? signature(id) : moves[loadout[slot]];
}
