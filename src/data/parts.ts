// 部位・工程の定義。数値は試作バランス（提案）で、正式仕様ではない。
export const bodies = {
  slime: { name: 'スライム', hp: 60, attack: 8, speed: 12, cost: 10, day: 1, note: '軽くて速い。熱に弱い素体。' },
  beast: { name: '獣型', hp: 62, attack: 12, speed: 15, cost: 23, day: 3, note: '俊敏で攻撃的。先手を取りやすい。' },
  golem: { name: 'ゴーレム', hp: 110, attack: 12, speed: 5, cost: 24, day: 5, note: '頑丈で鈍重。容量を大きく使う。' },
} as const;
export const attacks = {
  fire: { name: '火炎袋', attack: 20, cost: 12, day: 1, note: '高火力。耐熱の備えがないと攻撃のたびに自分も焼ける。' },
  claws: { name: '爪', attack: 12, cost: 6, day: 1, note: '自傷のない、扱いやすい攻撃器官。' },
  venom: { name: '毒腺', attack: 6, cost: 10, day: 5, note: '攻撃で毒を与える。巡目の終わりに毒ダメージ。' },
} as const;
export const defenses = {
  light: { name: '軽装甲', hp: 5, speed: -1, cost: 4, day: 1, note: '安価で、速度への影響が小さい。' },
  shell: { name: '石殻', hp: 25, speed: -5, cost: 12, day: 1, note: '自分の炎から身を守る。丈夫だが重い。' },
  regen: { name: '再生核', hp: 10, speed: 0, cost: 10, day: 5, note: '巡目の終わりに耐久力を回復する。' },
} as const;
export const processes = {
  standard: { name: '標準培養', hp: 0, speed: 0, cost: 0, heatProof: false, cultureMs: 6000, day: 1, note: '補正なし。', fluid: 0x9b6bff },
  heated: { name: '高温培養', hp: 0, speed: 0, cost: 8, heatProof: true, cultureMs: 9000, day: 1, note: '熱に強く育つ。ただし冷気に弱くなる。', fluid: 0xff6a3d },
  rapid: { name: '急速培養', hp: -15, speed: 0, cost: -3, heatProof: false, cultureMs: 3000, day: 3, note: '容量を節約できるが、耐久力が下がる。', fluid: 0x6dffa8 },
  aged: { name: '熟成培養', hp: 0, speed: 3, cost: 6, heatProof: false, cultureMs: 8000, day: 5, note: '時間をかけて反応を磨く。速度が上がる。', fluid: 0x5fc8ff },
} as const;
export type BodyId = keyof typeof bodies;
export type AttackId = keyof typeof attacks;
export type DefenseId = keyof typeof defenses;
export type ProcessId = keyof typeof processes;
/** 培養槽の容量。これを超える設計は製造できない。 */
export const capacity = 40;
export const effects = { selfBurn: 8, poison: 7, regen: 5, coldWeakness: 10 } as const;
