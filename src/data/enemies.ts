// Prototype opponents. Values are playtest proposals.
export const enemies={
 swordsman:{name:'剣士',hp:105,attack:15,speed:8,element:'physical',image:'/assets/battle/swordsman-v1.png',description:'標準的な相手。火炎自傷への対策を確かめる模擬戦。'},
 archer:{name:'弓兵',hp:80,attack:13,speed:14,element:'physical',image:'/assets/battle/archer-v1.png',description:'速さを生かして先攻する。石殻の重さと身体の速度を見直そう。'},
 mage:{name:'魔法使い',hp:90,attack:16,speed:6,element:'cold',image:'/assets/battle/mage-v1.png',description:'冷気で攻撃する。高温培養の個体には各攻撃で追加5ダメージ。'},
} as const;
export type EnemyId=keyof typeof enemies;
