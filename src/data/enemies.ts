// 敵の定義。数値は試作バランス。sprite は戦闘画像のファイル名（拡張子の前）。
export const enemies = {
  swordsman: { name: '剣士', sprite: 'swordsman', hp: 105, attack: 15, speed: 8, element: 'physical', rapidFire: 0, armor: 3, freeze: false, endure: 0, note: '盾で1発ごとに3軽減する。軽い攻撃は通りにくい。' },
  archer: { name: '弓兵', sprite: 'archer', hp: 100, attack: 14, speed: 14, element: 'physical', rapidFire: 6, armor: 0, freeze: false, endure: 0, note: '速度が6以上遅い相手には、1巡に2回射る。' },
  mage: { name: '魔法使い', sprite: 'mage', hp: 86, attack: 23, speed: 6, element: 'cold', rapidFire: 0, armor: 0, freeze: true, endure: 0, note: '冷気で攻撃する。竜の血を使った個体は大きく傷つき、再生能力は凍って働かない。' },
  beast: { name: '牙獣', sprite: 'beast', hp: 74, attack: 18, speed: 16, element: 'physical', rapidFire: 0, armor: 0, freeze: false, endure: 0, note: '速いが脆い。速度で上回れば、先手で押し切れる。' },
  knight: { name: '重騎士', sprite: 'swordsman', hp: 104, attack: 13, speed: 8, element: 'physical', rapidFire: 0, armor: 6, freeze: false, endure: 0, note: '盾が厚い。軽い連打は通らない。貫通か、一撃の重い個体で割る。' },
  sniper: { name: '狙撃手', sprite: 'archer', hp: 78, attack: 16, speed: 18, element: 'physical', rapidFire: 8, armor: 0, freeze: false, endure: 0, note: '速度が8以上遅い相手には、1巡に2回射る。月晶狼か焔花竜で先手を取る。' },
  golem: { name: '重装ゴーレム', sprite: 'golem', hp: 168, attack: 12, speed: 4, element: 'physical', rapidFire: 0, armor: 6, freeze: false, endure: 0, note: '非常に硬い。貫通撃か、熔炉巨人の固有技で装甲を無視する。' },
  alpha: { name: '群れの長', sprite: 'beast', hp: 86, attack: 16, speed: 15, element: 'physical', rapidFire: 0, armor: 1, freeze: false, endure: 0, note: '牙の王の力試し。速く、一撃が重い。退かずに勝ち切れる体が要る。' },
  crusader: { name: '十字軍騎士', sprite: 'swordsman', hp: 100, attack: 14, speed: 10, element: 'physical', rapidFire: 0, armor: 4, freeze: false, endure: 0, note: '均整のとれた重装。守勢で受けるか、速度で先に削る。' },
  armking: { name: '腕の王', sprite: 'golem', hp: 210, attack: 18, speed: 8, element: 'physical', rapidFire: 0, armor: 3, freeze: false, endure: 8, note: '8巡生き延びれば成功。倒しても成功。守勢と再生が生きる。' },
  oath: { name: '跪きの結界', sprite: 'golem', hp: 170, attack: 24, speed: 7, element: 'physical', rapidFire: 0, armor: 2, freeze: false, endure: 8, note: '角の誓いで味方が跪き、攻撃が鈍る。8巡守るか、毒で時間を稼ぐ。' },
} as const;
export type EnemyId = keyof typeof enemies;
