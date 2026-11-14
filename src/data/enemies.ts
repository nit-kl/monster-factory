// 敵の定義。数値は試作バランス（提案）。
export const enemies = {
  swordsman: { name: '剣士', hp: 105, attack: 15, speed: 8, element: 'physical', rapidFire: 0, armor: 3, freeze: false, note: '盾で1発ごとに3軽減する。軽い攻撃は通りにくい。' },
  archer: { name: '弓兵', hp: 100, attack: 14, speed: 14, element: 'physical', rapidFire: 6, armor: 0, freeze: false, note: '速度が6以上遅い相手には、1巡に2回射る。' },
  mage: { name: '魔法使い', hp: 86, attack: 23, speed: 6, element: 'cold', rapidFire: 0, armor: 0, freeze: true, note: '冷気で攻撃する。竜の血を使った個体は大きく傷つき、再生能力は凍って働かない。' },
} as const;
export type EnemyId = keyof typeof enemies;
