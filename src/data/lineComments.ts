import { recipeFor, type Design } from '../domain/design';
import { materials } from './recipes';
import type { LineStage } from '../domain/manufacture';
import type { StaffId } from './cast';
export function lineComments(d: Design): Partial<Record<LineStage, { who: StaffId; text: string }>> {
  const r = recipeFor(d)!;
  return {
    culture: { who: 'poyon', text: `${materials[d.first].name}と${materials[d.second].name}。二つの反応を合わせます。` },
    drain: { who: 'orphen', text: '共鳴したぞ。ここからは、材料が自分の姿を探し始める。' },
    graftAttack: { who: 'vargas', text: '形成輪、固定よし。生まれてくる奴の場所を空けろ。' },
    graftDefense: { who: 'orphen', text: r.birth },
    inspect: { who: 'lisette', text: '生命反応、安定。耐久力と戦闘特性を記録します。' },
    reveal: { who: 'poyon', text: 'はじめまして。あなたは、どんなふうに動くのでしょうね。' },
  };
}
