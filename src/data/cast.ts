import type { CastId } from '../domain/story';

// 登場人物の表示情報。立ち絵のない人物は影絵（仮素材）で表示する。
export type CastInfo = { name: string; role: string; color: string; image?: string; shade?: 'serpent' | 'figure' | 'none'; wide?: boolean };
export const cast: Record<CastId, CastInfo> = {
  lisette: { name: 'リゼット', role: '副工場長', color: '#e06a8c', image: '/assets/factory/lisette-v2.png' },
  vargas: { name: 'バルガス', role: '設備主任', color: '#d9a15a', image: '/assets/factory/vargas-v2.png' },
  orphen: { name: 'オルフェン', role: '研究主任', color: '#b48cff', image: '/assets/factory/orphen-v2.png' },
  poyon: { name: 'ポヨン', role: '培養・品質管理', color: '#c9a8ff', image: '/assets/factory/poyon-v2.png', wide: true },
  pluru: { name: 'プルル', role: '試作体 No.000', color: '#6fc3ff', image: '/assets/factory/pluru-v2.png', wide: true },
  zelva: { name: '宰相ゼルヴァ', role: '魔王軍本社・宰相', color: '#8fe0a0', image: '/assets/factory/zelva-v1.png' },
  maou: { name: '魔王', role: '帳の奥', color: '#ff7a5c', shade: 'none' },
  maid: { name: '侍女', role: '魔王城', color: '#d8d0e8', image: '/assets/factory/maid-v1.png' },
  captain: { name: '先遣隊長', role: '勇者軍・剣士', color: '#8fb6ff', image: '/assets/factory/captain-v1.png' },
};
/** 工場で相談できる相手（第1章）。 */
export const staffIds = ['lisette', 'vargas', 'orphen', 'poyon', 'pluru'] as const;
export type StaffId = (typeof staffIds)[number];
