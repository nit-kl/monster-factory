import { calculate, type Design } from '../domain/design';
import type { LineStage } from '../domain/manufacture';
import type { StaffId } from './cast';

/** 製造ラインの各段階で、担当者がかける一言。設計の内容で変わる。 */
export function lineComments(d: Design): Partial<Record<LineStage, { who: StaffId; text: string }>> {
  const s = calculate(d);
  return {
    culture: { who: 'poyon', text: { standard: '培養槽、温度よし。設計図、受け取りました。', heated: '高温培養です。槽を温めています。熱に強い子に育ちますよ。', rapid: '急速培養です。少し急がせてしまいますね……。', aged: '熟成培養。じっくり、ゆっくり育てましょう。' }[d.process] },
    drain: { who: 'poyon', text: '培養液を抜きます。……生まれますよ。' },
    graftAttack: {
      who: 'vargas',
      text: d.attack === 'fire' ? (s.selfBurn ? '火炎袋、接合よし。……おい、この組み合わせ、熱の逃げ場がねえぞ。' : '火炎袋、接合よし。熱への備えもできてる。') : d.attack === 'claws' ? '爪、接合よし。素直でいい器官だ。' : '毒腺、接合よし。漏らすなよ。',
    },
    graftDefense: d.defense === 'regen' ? { who: 'orphen', text: '再生核、定着したのう。美しい脈動じゃ。' } : { who: 'vargas', text: d.defense === 'shell' ? '石殻、圧着よし。重いが、頼りになる。' : '軽装甲、固定よし。' },
    inspect: { who: 'lisette', text: `品質検査です。コスト ${s.cost}、容量の範囲内。性能を測定します。` },
    reveal: { who: 'lisette', text: '検査合格。完成です。' },
  };
}
