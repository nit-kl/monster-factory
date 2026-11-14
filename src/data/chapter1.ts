import type { EnemyId } from './enemies';

// 序章〜第1章の進行表。物語の場面と、設計・製造・戦闘で達成する目標を順に並べる。
export type Step =
  | { kind: 'story'; scene: string; day: number }
  | { kind: 'objective'; enemy: EnemyId; day: number; title: string; text: string; raid?: boolean }
  | { kind: 'end' };

export const steps: readonly Step[] = [
  { kind: 'story', scene: 'prologue', day: 0 },
  { kind: 'story', scene: 'arrival', day: 1 },
  { kind: 'story', scene: 'designIntro', day: 1 },
  { kind: 'objective', enemy: 'swordsman', day: 1, title: '剣士との模擬戦に勝つ', text: '材料を二つ選び、新しい魔物を製造して模擬戦へ。' },
  { kind: 'story', scene: 'swordWin', day: 1 },
  { kind: 'story', scene: 'eveningLisette', day: 1 },
  { kind: 'story', scene: 'archerBrief', day: 3 },
  { kind: 'objective', enemy: 'archer', day: 3, title: '弓兵との模擬戦に勝つ', text: '遅い個体は1巡に2回射られます。速度を見直しましょう。' },
  { kind: 'story', scene: 'archerWin', day: 3 },
  { kind: 'story', scene: 'eveningVargas', day: 3 },
  { kind: 'story', scene: 'mageBrief', day: 5 },
  { kind: 'objective', enemy: 'mage', day: 5, title: '魔法使いとの模擬戦に勝つ', text: '一撃が重く、冷気を使います。竜の血は冷気に弱い材料です。別の配合を考えましょう。' },
  { kind: 'story', scene: 'mageWin', day: 5 },
  { kind: 'story', scene: 'eveningOrphen', day: 5 },
  { kind: 'story', scene: 'eveningPoyon', day: 6 },
  { kind: 'story', scene: 'raidIntro', day: 7 },
  { kind: 'objective', enemy: 'swordsman', day: 7, title: '先遣隊を退ける（1人目：剣士）', text: '格納庫から、相手に合う個体を選んで出撃させましょう。', raid: true },
  { kind: 'story', scene: 'raid1', day: 7 },
  { kind: 'objective', enemy: 'archer', day: 7, title: '先遣隊を退ける（2人目：弓兵）', text: '相手ごとに個体を替えられます。', raid: true },
  { kind: 'story', scene: 'raid2', day: 7 },
  { kind: 'objective', enemy: 'mage', day: 7, title: '先遣隊を退ける（3人目：魔法使い）', text: '最後の一人です。', raid: true },
  { kind: 'story', scene: 'victory', day: 7 },
  { kind: 'story', scene: 'night', day: 7 },
  { kind: 'end' },
];

/** 一度だけ差し込まれる場面。 */
export const interludes = {
  birth: 'birth',
  loss: { swordsman: 'swordLoss', archer: 'archerLoss', mage: 'mageLoss' } as Record<EnemyId, string>,
  raidLoss: 'raidLoss',
} as const;
