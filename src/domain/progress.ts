import { interludes, steps, type ChapterNum, type Step } from '../data/chapter1';
export type { ChapterNum };

/** 章の進行状況。すべて保存対象。 */
export type Progress = { step: number; queue: string[]; seen: string[]; flags: string[]; cohort?: number };
export const initialProgress: Progress = { step: 0, queue: [], seen: [], flags: [], cohort: 1 };

export const stepOf = (p: Progress): Step => steps[Math.min(p.step, steps.length - 1)];
export const dayOf = (p: Progress) => { const s = stepOf(p); return s.kind === 'end' ? (s.day ?? 7) : s.day; };
export const chapterOf = (p: Progress): ChapterNum => stepOf(p).chapter ?? 1;
export const chapterTitle = (ch: ChapterNum): string => {
  switch (ch) {
    case 1: return '第1章　よそ者の工場長';
    case 2: return '第2章　孤立無援の防衛戦';
    case 3: return '第3章　角の王';
    case 4: return '第4章　牙の王';
    case 5: return '第5章　腕の王';
    case 6: return '第6章　折れ角の王';
    case 7: return '第7章　目の王';
    case 8: return '終章　王を設計する';
  }
};
export function startNextChapter(p: Progress): Progress {
  const s = stepOf(p);
  if (s.kind === 'end' && p.step + 1 < steps.length) {
    return { ...p, step: p.step + 1 };
  }
  return p;
}
export const startChapter2 = startNextChapter;
/** いま再生すべき場面。なければ null。 */
export function sceneOf(p: Progress): string | null {
  if (p.queue.length) return p.queue[0];
  const s = stepOf(p);
  return s.kind === 'story' ? s.scene : null;
}
export function viewOf(p: Progress): 'story' | 'hub' | 'end' {
  if (sceneOf(p)) return 'story';
  return stepOf(p).kind === 'end' ? 'end' : 'hub';
}
const once = (p: Progress, scene: string): Progress =>
  p.seen.includes(scene) || p.queue.includes(scene) ? p : { ...p, queue: [...p.queue, scene] };

export function sceneFinished(p: Progress, newFlags: readonly string[] = []): Progress {
  const flags = [...new Set([...p.flags, ...newFlags])];
  const scene = sceneOf(p);
  if (!scene) return { ...p, flags };
  const seen = p.seen.includes(scene) ? p.seen : [...p.seen, scene];
  if (p.queue.length) return { ...p, flags, seen, queue: p.queue.slice(1) };
  return { ...p, flags, seen, step: p.step + 1 };
}
export function continueFromFactory(p: Progress): Progress {
  return viewOf(p) === 'hub' ? { ...p, step: p.step + 1 } : p;
}

export const manufactured = (p: Progress): Progress => once(p, interludes.birth);


export type BlueprintTrait = { id: string; title: string; note: string };

/** 第1章〜終章の働きと選択から「王の設計図」に刻まれる資質を導出する。 */
export function blueprintTraits(p: Progress, discoveredCount: number, manufacturedCount: number): BlueprintTrait[] {
  const traits: BlueprintTrait[] = [];
  const cleared = viewOf(p) === 'end' || p.seen.includes('victory');
  if (cleared || p.flags.includes('satWithVargas')) {
    traits.push({ id: 'guardian', title: '守護の輪郭', note: '帰還した個体の傷まで記録し、先遣隊から工場を守り抜いた。' });
  }
  if (discoveredCount >= 6) {
    traits.push({ id: 'wisdom-all', title: '叡智の記録（全配合解明）', note: '六つすべての生命反応を解き明かし、配合の理を図鑑に刻んだ。' });
  } else if (cleared || p.flags.includes('lostFirst') || p.flags.includes('askedOrphen')) {
    traits.push({ id: 'wisdom', title: '叡智の記録', note: '不都合な結果も隠さず記録し、次の配合と技構成へつなげた。' });
  }
  if (cleared || p.flags.includes('promisedLisette') || p.flags.includes('deniedToLisette')) {
    traits.push({
      id: 'resolve',
      title: '責任の署名',
      note: p.flags.includes('promisedLisette')
        ? '製造の責任を自ら引き受け、いつか真実を話すと留保した。'
        : '現場の不手際にせず、自らの判断として報告書に署名した。',
    });
  }
  if (manufacturedCount >= 3) {
    traits.push({ id: 'mercy', title: '慈愛のぬくもり', note: '生まれたばかりの命を搬出口で待ち、帰還する場所を整えた。' });
  }
  if (p.seen.includes('ch2Audit3Win') || p.seen.includes('ch2Victory') || p.seen.includes('c3night') || p.flags.includes('ch2_sharedBlueprint') || p.flags.includes('ch2_refusedVessel') || p.flags.includes('c3_share') || p.flags.includes('c3_refuseCore')) {
    traits.push({ id: 'covenant', title: '合意の掟', note: 'プルルの核には触らず、右角だけで王の形を試すと、全員の前で決めた。' });
  }
  if (p.seen.includes('ch2Victory') || p.seen.includes('c4leave') || p.flags.includes('promisedMimi') || p.flags.includes('alliedArtisans')) {
    traits.push({ id: 'kinship', title: '己の言葉の芽生え', note: '従うだけの王と、退けない王を工場に置き、プルルが自分の言葉で名前を呼ぶ場所を守った。' });
  }
  if (p.seen.includes('c5chain')) {
    traits.push({ id: 'cost', title: '止めた最高傑作', note: '一番勝たせてきた子を素体にした腕の王を、残った手持ちで門の前に跪かせた。' });
  }
  if (p.seen.includes('ch3Victory') || p.seen.includes('c6luka') || p.flags.includes('welcomedNoah') || p.flags.includes('ch3_testedNoah')) {
    traits.push({ id: 'bridge', title: '境界を越える対話', note: '人間の側が作った折れ角の王と、その設計者を、門の内側で受けた。' });
  }
  if (p.seen.includes('ch4Eve') || p.seen.includes('c7eve') || p.flags.includes('ch4_councilHeld')) {
    traits.push({ id: 'identity', title: '先代の遺言の継承', note: '左目に残った先代と数時間だけ再会し、王に戻ることを断る言葉を記録した。' });
  }
  if (p.seen.includes('ch5Epilogue') || p.seen.includes('c8epilogue') || p.flags.includes('ch5_yieldedSeat') || p.flags.includes('c8_yielded')) {
    traits.push({ id: 'peace', title: '戦わない王の王命', note: '設計台の席をプルルに譲り、「たたかうのを、やめて」という一度きりの王命で百日目を閉じた。' });
  }
  return traits;
}
