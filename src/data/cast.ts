import type { CastId } from '../domain/story';

// 登場人物の表示情報。立ち絵のない人物は影絵（仮素材）で表示する。
export type ShadeKind = 'serpent' | 'figure' | 'knight' | 'general' | 'none';
export type CastInfo = { name: string; role: string; color: string; image?: string; shade?: ShadeKind; wide?: boolean };
export const cast: Record<CastId, CastInfo> = {
  lisette: { name: 'リゼット', role: '副工場長', color: '#e06a8c', image: '/assets/factory/lisette-v2.png' },
  vargas: { name: 'バルガス', role: '設備主任', color: '#d9a15a', image: '/assets/factory/vargas-v2.png' },
  orphen: { name: 'オルフェン', role: '研究主任', color: '#b48cff', image: '/assets/factory/orphen-v2.png' },
  poyon: { name: 'ポヨン', role: '培養・品質管理', color: '#c9a8ff', image: '/assets/factory/poyon-v2.png', wide: true },
  pluru: { name: 'プルル', role: '試作体 No.000', color: '#6fc3ff', image: '/assets/factory/pluru-v2.png', wide: true },
  mimi: { name: 'ミミ', role: '飼育・育成係', color: '#ffb06a', image: '/assets/factory/mimi-v2.png' },
  arachnea: { name: 'アラクネア', role: '精密整備技師', color: '#d68cff', image: '/assets/factory/arachnea-v2.png' },
  gradius: { name: 'グラディウス', role: '元将軍・古竜', color: '#e8c15a', image: '/assets/factory/gradius-v2.png', wide: true },
  vera: { name: 'ヴェラ', role: '本社監察官', color: '#9ac4ff', image: '/assets/factory/vera-v2.png' },
  noah: { name: 'ノア', role: '戦術分析官・元騎士', color: '#7ad0ff', image: '/assets/factory/noah-v2.png' },
  zelva: { name: '宰相ゼルヴァ', role: '魔王軍本社・宰相', color: '#8fe0a0', image: '/assets/factory/zelva-v1.png' },
  maou: { name: '魔王', role: '帳の奥', color: '#ff7a5c', shade: 'none' },
  maid: { name: '侍女', role: '魔王城', color: '#d8d0e8', image: '/assets/factory/maid-v1.png' },
  captain: { name: '先遣隊長', role: '勇者軍・剣士', color: '#8fb6ff', image: '/assets/factory/captain-v1.png' },
  nephira: { name: 'ネフィラ', role: '魔王の影武者', color: '#d49cff', image: '/assets/factory/nephira-v1.png' },
  seil: { name: 'セイル', role: '旅の青年・先代勇者', color: '#ffe2a0', image: '/assets/factory/seil-v1.png' },
  luka: { name: 'ルカ', role: '勇者軍・魔導技師', color: '#7fe6ff', image: '/assets/factory/luka-v1.png' },
  grave: { name: 'グレイヴ', role: '勇者軍・騎士団長', color: '#9ab8e8', image: '/assets/factory/grave-v1.png' },
  gardran: { name: 'ガルドラン', role: '魔王軍・炎将', color: '#ff6a3d', image: '/assets/factory/gardran-v1.png' },
};
/** 工場で相談できる相手（第1章・第2章）。 */
export const staffIds = ['lisette', 'vargas', 'orphen', 'poyon', 'pluru'] as const;
/** 第3章「王の部品」で合流する仲間を含めた相談相手。 */
export const chapter2StaffIds = ['lisette', 'vargas', 'orphen', 'poyon', 'pluru', 'mimi', 'arachnea', 'gradius', 'vera'] as const;
/** 第4章以降（全10名）の相談相手。 */
export const allStaffIds = ['lisette', 'vargas', 'orphen', 'poyon', 'pluru', 'mimi', 'arachnea', 'gradius', 'vera', 'noah'] as const;
export type StaffId = (typeof allStaffIds)[number];
export const activeStaffIds = (day: number): readonly StaffId[] => (day >= 14 ? allStaffIds : day >= 9 ? chapter2StaffIds : staffIds);
