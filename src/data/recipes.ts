export const materials = {
  iron: { name: '鉄くず', symbol: 'Fe', color: '#b4c4d5', day: 1, note: '重さと硬さ。姿を保つための器。' },
  spirit: { name: '亡霊の灯', symbol: '魂', color: '#77f5d6', day: 1, note: '身体を持たない、冷たい生命の火。' },
  ember: { name: '竜の血', symbol: '焔', color: '#ff9860', day: 1, note: '脈打つ熱。内側から力を解き放つ。' },
  seed: { name: '古樹の種', symbol: '芽', color: '#b6e88a', day: 3, note: '伸びる、根付く、再び芽吹く。' },
  moon: { name: '月光の雫', symbol: '月', color: '#c3b5ff', day: 3, note: '重さをほどき、光の残像を残す。' },
  glass: { name: '星ガラス', symbol: '晶', color: '#8ddfff', day: 5, note: '鋭い結晶。光と音を内に閉じ込める。' },
} as const;
export type MaterialId = keyof typeof materials;
export type RecipeId = 'wraith' | 'furnace' | 'bloom' | 'thorn' | 'prism' | 'bell';
export type Recipe = { id: RecipeId; pair: readonly [MaterialId, MaterialId]; name: string; epithet: string; hint: string; lore: string; skill: string; skillNote: string; color: string; hp: number; attack: number; speed: number; armor: number; bonus: number; poison?: boolean; regen?: boolean; coldWeak?: boolean; birth: string };
export const recipes: readonly Recipe[] = [
  { id: 'wraith', pair: ['iron', 'spirit'], name: '鉄霊騎士', epithet: '空洞の守り手', hint: '鉄片を冷たい灯がつなぐ。重く、粘り強い生命の反応。', lore: '誰も着ていない鎧。亡霊の灯が、離れた鉄片を一つの身体につなぎ留める。', skill: '葬送の鉄雨', skillNote: '3回目の攻撃で鎧を解体。鉄片が盾を貫く。', color: '#79f5d7', hp: 90, attack: 14, speed: 6, armor: 2, bonus: 24, regen: true, birth: '鉄片の隙間に霊火が宿り、空の鎧が立ち上がる。' },
  { id: 'furnace', pair: ['iron', 'ember'], name: '熔炉巨人', epithet: '歩く溶鉱炉', hint: '鉄が熱を抱え込む。鈍重だが、一撃の重い生命の反応。', lore: '鉄の身体に竜の血が巡る。胸の炉で蓄えた熱を、一条の砲火に変える。', skill: '竜炉砲', skillNote: '3回目の攻撃で胸の炉を解放。高威力の貫通砲撃。', color: '#ff9d4f', hp: 64, attack: 25, speed: 5, armor: 2, bonus: 32, coldWeak: true, birth: '鉄が赤熱し、胸の空洞で竜の血が炉心になる。' },
  { id: 'bloom', pair: ['seed', 'ember'], name: '焔花竜', epithet: '駆ける火の花', hint: '根が熱を追って伸びる。素早く跳ねる生命の反応。', lore: '古樹の根を脚に、燃える花弁を翼にした小さな竜。駆けた跡から炎が咲く。', skill: '百花炎走', skillNote: '3回目の攻撃で駆け抜け、敵の足元に火柱を咲かせる。', color: '#ff7376', hp: 60, attack: 23, speed: 17, armor: 0, bonus: 20, coldWeak: true, birth: '芽が竜の血を吸い上げ、赤い花弁が翼のように開く。' },
  { id: 'thorn', pair: ['seed', 'spirit'], name: '冥樹の番人', epithet: '眠らない森', hint: '種の奥から脈動。毒と再生を宿す、根深い生命の反応。', lore: '枯れ木の身体に亡霊が住む。振り下ろす枝と地中の根で、侵入者を捕らえる。', skill: '冥界樹海', skillNote: '3回目の攻撃で巨大な根が敵を囲む。毒は毎巡続く。', color: '#b2e66c', hp: 104, attack: 12, speed: 7, armor: 1, bonus: 18, poison: true, regen: true, birth: '根の間を霊火が巡り、幹の空洞に二つの眼が灯る。' },
  { id: 'prism', pair: ['glass', 'moon'], name: '月晶狼', epithet: '月を裂く残像', hint: 'ガラスが月光を屈折する。姿が幾重にも揺れる、俊敏な反応。', lore: '月光を骨格にした透明な狼。結晶の尾が光を分け、残像が獲物を追い詰める。', skill: '月影連牙', skillNote: '3回目の攻撃で光の分身が四方から襲いかかる。', color: '#b7c4ff', hp: 44, attack: 25, speed: 20, armor: 0, bonus: 26, birth: '結晶が月光の筋をたどり、四つの脚と鋭い尾を結ぶ。' },
  { id: 'bell', pair: ['glass', 'spirit'], name: '幽鐘クラゲ', epithet: '宙に響く弔鐘', hint: 'ガラスの中で灯が震える。冷気に強い、浮遊する生命の反応。', lore: 'ガラスの傘に亡霊の灯を閉じ込めた浮遊生物。透き通る触手が空気を震わせる。', skill: '幽響共鳴', skillNote: '3回目の攻撃で共鳴の輪を放ち、盾を越えて響く。', color: '#82dfff', hp: 102, attack: 18, speed: 8, armor: 3, bonus: 28, birth: 'ガラスが薄い傘に広がり、霊火の鼓動から触手が生まれる。' },
];
export const recipeById = (id: RecipeId) => recipes.find(r => r.id === id)!;
export const findRecipe = (a: MaterialId, b: MaterialId) => recipes.find(r => (r.pair[0] === a && r.pair[1] === b) || (r.pair[0] === b && r.pair[1] === a));
