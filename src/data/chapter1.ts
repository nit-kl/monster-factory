import type { EnemyId } from './enemies';

// 序章〜終章（全6章）の進行表。物語の場面と、設計・製造・戦闘で達成する目標を順に並べる。
export type ChapterNum = 1 | 2 | 3 | 4 | 5 | 6;

export type Step =
  | { kind: 'story'; scene: string; day: number; chapter?: ChapterNum }
  | { kind: 'objective'; enemy: EnemyId; day: number; title: string; text: string; raid?: boolean; chapter?: ChapterNum }
  | { kind: 'end'; day?: number; chapter?: ChapterNum };

export const steps: readonly Step[] = [
  // ---- 序章〜第1章「よそ者の工場長」（工場内の模擬戦まで：まだ受け入れられない主人公） ----
  { kind: 'story', scene: 'prologue', day: 0, chapter: 1 },
  { kind: 'story', scene: 'arrival', day: 1, chapter: 1 },
  { kind: 'story', scene: 'designIntro', day: 1, chapter: 1 },
  { kind: 'objective', enemy: 'swordsman', day: 1, chapter: 1, title: '適性試験・第一戦（対・剣士模擬戦）', text: 'リゼットたちに送還されないよう、材料を二つ選んで魔物を製造し模擬戦に勝ちましょう。' },
  { kind: 'story', scene: 'swordWin', day: 1, chapter: 1 },
  { kind: 'story', scene: 'eveningLisette', day: 1, chapter: 1 },
  { kind: 'story', scene: 'archerBrief', day: 3, chapter: 1 },
  { kind: 'objective', enemy: 'archer', day: 3, chapter: 1, title: '適性試験・第二戦（対・弓兵模擬戦）', text: '遅い個体は1巡に2回射られます。新しい材料で速度を見直しましょう。' },
  { kind: 'story', scene: 'archerWin', day: 3, chapter: 1 },
  { kind: 'story', scene: 'eveningVargas', day: 3, chapter: 1 },
  { kind: 'story', scene: 'mageBrief', day: 5, chapter: 1 },
  { kind: 'objective', enemy: 'mage', day: 5, chapter: 1, title: '適性試験・最終戦（対・魔法使い模擬戦）', text: '一撃が重く、冷気を使います。竜の血は冷気に弱いため、星硝子の配合を試しましょう。' },
  { kind: 'story', scene: 'mageWin', day: 5, chapter: 1 },
  { kind: 'story', scene: 'eveningOrphen', day: 5, chapter: 1 },
  { kind: 'end', day: 5, chapter: 1 },

  // ---- 第2章「孤立無援の防衛戦」（勇者軍の包囲網から工場を救い、初めて少し認められる） ----
  { kind: 'story', scene: 'ch2CrisisIntro', day: 6, chapter: 2 },
  { kind: 'objective', enemy: 'swordsman', day: 6, chapter: 2, title: '外門閉鎖までの時間稼ぎ（前衛剣士）', text: 'バルガスが外門の鎖を下ろすまで、正面の剣士を食い止めましょう。', raid: true },
  { kind: 'story', scene: 'ch2Skirmish1Win', day: 6, chapter: 2 },
  { kind: 'story', scene: 'ch2Skirmish2Brief', day: 7, chapter: 2 },
  { kind: 'objective', enemy: 'archer', day: 7, chapter: 2, title: '第二換気塔の防衛（奇襲弓兵）', text: '崖上から換気塔を狙う高速弓兵を、素早い個体で退けましょう。', raid: true },
  { kind: 'story', scene: 'eveningPoyon', day: 7, chapter: 2 },
  { kind: 'story', scene: 'raidIntro', day: 8, chapter: 2 },
  { kind: 'objective', enemy: 'swordsman', day: 8, chapter: 2, title: '先遣隊本隊を退ける（1人目：剣士）', text: '格納庫から、相手に合う個体を選んで出撃させましょう。', raid: true },
  { kind: 'story', scene: 'raid1', day: 8, chapter: 2 },
  { kind: 'objective', enemy: 'archer', day: 8, chapter: 2, title: '先遣隊本隊を退ける（2人目：弓兵）', text: '相手ごとに個体を替えられます。', raid: true },
  { kind: 'story', scene: 'raid2', day: 8, chapter: 2 },
  { kind: 'objective', enemy: 'mage', day: 8, chapter: 2, title: '先遣隊本隊を退ける（3人目：魔法使い）', text: '最後の一人です。ここをしのげば工場を守り抜けます。', raid: true },
  { kind: 'story', scene: 'victory', day: 8, chapter: 2 },
  { kind: 'story', scene: 'night', day: 8, chapter: 2 },
  { kind: 'end', day: 8, chapter: 2 },

  // ---- 第3章「王の部品」（認めた矢先に密命が発覚し、共同会議の規約で信頼を再構築する） ----
  { kind: 'story', scene: 'ch2Arrival', day: 9, chapter: 3 },
  { kind: 'story', scene: 'ch2Secret', day: 9, chapter: 3 },
  { kind: 'story', scene: 'ch2Audit1Brief', day: 10, chapter: 3 },
  { kind: 'objective', enemy: 'swordsman', day: 10, chapter: 3, title: '監察査定（第一試練：重装剣士）', text: 'ヴェラの査定演習です。アラクネアやミミにも相談し、通常技と配合を整えて臨みましょう。' },
  { kind: 'story', scene: 'ch2Audit1Win', day: 10, chapter: 3 },
  { kind: 'story', scene: 'ch2Audit2Brief', day: 11, chapter: 3 },
  { kind: 'objective', enemy: 'archer', day: 11, chapter: 3, title: '監察査定（第二試練：疾風弓兵）', text: '速度差と手数への対策が問われます。疾風撃・守勢打や素早い配合で突破しましょう。' },
  { kind: 'story', scene: 'ch2Audit2Win', day: 11, chapter: 3 },
  { kind: 'story', scene: 'ch2GradiusBrief', day: 12, chapter: 3 },
  { kind: 'objective', enemy: 'mage', day: 12, chapter: 3, title: '監察査定（最終試練：氷結魔導師）', text: '冷気と回復阻害への対策を示し、第七工場の自律稼働を証明しましょう。' },
  { kind: 'story', scene: 'ch2Audit3Win', day: 12, chapter: 3 },
  { kind: 'story', scene: 'ch2RaidIntro', day: 13, chapter: 3 },
  { kind: 'objective', enemy: 'swordsman', day: 13, chapter: 3, title: '第二調査隊を退ける（1人目：剣士）', text: '全員で守る工場です。格納庫の個体を選んで迎え撃ちましょう。', raid: true },
  { kind: 'story', scene: 'ch2Raid1', day: 13, chapter: 3 },
  { kind: 'objective', enemy: 'archer', day: 13, chapter: 3, title: '第二調査隊を退ける（2人目：弓兵）', text: 'アラクネアがラインを維持しています。次の個体を出撃させましょう。', raid: true },
  { kind: 'story', scene: 'ch2Raid2', day: 13, chapter: 3 },
  { kind: 'objective', enemy: 'mage', day: 13, chapter: 3, title: '第二調査隊を退ける（3人目：魔法使い）', text: '最後の一人です。みんなの工場を守り抜きましょう。', raid: true },
  { kind: 'story', scene: 'ch2Victory', day: 13, chapter: 3 },
  { kind: 'story', scene: 'ch2Night', day: 13, chapter: 3 },
  { kind: 'end', day: 13, chapter: 3 },

  // ---- 第4章「勇者の影」 ----
  { kind: 'story', scene: 'ch3Arrival', day: 14, chapter: 4 },
  { kind: 'story', scene: 'ch3Luka1Brief', day: 15, chapter: 4 },
  { kind: 'objective', enemy: 'swordsman', day: 15, chapter: 4, title: 'ルカの対策前衛（重装剣士）', text: 'ノアも相談に加わりました。ルカが送り込んだ対策剣士を退けましょう。' },
  { kind: 'story', scene: 'ch3Luka1Win', day: 15, chapter: 4 },
  { kind: 'story', scene: 'ch3SeilBrief', day: 16, chapter: 4 },
  { kind: 'objective', enemy: 'archer', day: 16, chapter: 4, title: 'ルカの高速射撃隊（疾風弓兵）', text: '旅の青年セイルが去った直後、第二波の弓兵部隊が迫ります。' },
  { kind: 'story', scene: 'ch3SeilWin', day: 16, chapter: 4 },
  { kind: 'story', scene: 'ch3FinalBrief', day: 17, chapter: 4 },
  { kind: 'objective', enemy: 'swordsman', day: 17, chapter: 4, title: 'ルカ本隊・最終テスト（1人目：剣士）', text: 'ノアが司令席の隣に立ちます。格納庫の個体で正門を守りましょう。', raid: true },
  { kind: 'story', scene: 'ch3Raid1', day: 17, chapter: 4 },
  { kind: 'objective', enemy: 'archer', day: 17, chapter: 4, title: 'ルカ本隊・最終テスト（2人目：弓兵）', text: '二波の射手部隊です。素早い個体か守勢打で対応しましょう。', raid: true },
  { kind: 'story', scene: 'ch3Raid2', day: 17, chapter: 4 },
  { kind: 'objective', enemy: 'mage', day: 17, chapter: 4, title: 'ルカ本隊・最終テスト（3人目：魔法使い）', text: '最後の魔導師です。冷気に耐えて勝利しましょう。', raid: true },
  { kind: 'story', scene: 'ch3Victory', day: 17, chapter: 4 },
  { kind: 'story', scene: 'ch3Night', day: 17, chapter: 4 },
  { kind: 'end', day: 17, chapter: 4 },

  // ---- 第5章「先代の遺言」 ----
  { kind: 'story', scene: 'ch4Arrival', day: 18, chapter: 5 },
  { kind: 'story', scene: 'ch4Truth', day: 18, chapter: 5 },
  { kind: 'story', scene: 'ch4Def1Brief', day: 19, chapter: 5 },
  { kind: 'objective', enemy: 'swordsman', day: 19, chapter: 5, title: '炎将ガルドランの先鋒（重装剣士）', text: '本社の強硬派ガルドランの先鋒を押し返しましょう。' },
  { kind: 'story', scene: 'ch4Def1Win', day: 19, chapter: 5 },
  { kind: 'story', scene: 'ch4Def2Brief', day: 20, chapter: 5 },
  { kind: 'objective', enemy: 'archer', day: 20, chapter: 5, title: '挟撃の谷・第一波（疾風弓兵）', text: '尾根から迫る狙撃部隊と魔導部隊の二連戦です。', raid: true },
  { kind: 'story', scene: 'ch4Def2Win', day: 20, chapter: 5 },
  { kind: 'objective', enemy: 'mage', day: 20, chapter: 5, title: '挟撃の谷・第二波（氷結魔導師）', text: '続けて接近する冷気の魔導師を退けましょう。', raid: true },
  { kind: 'story', scene: 'ch4Def3Win', day: 20, chapter: 5 },
  { kind: 'story', scene: 'ch4Eve', day: 20, chapter: 5 },
  { kind: 'end', day: 20, chapter: 5 },

  // ---- 終章「王を設計する」 ----
  { kind: 'story', scene: 'ch5DesignKing', day: 21, chapter: 6 },
  { kind: 'story', scene: 'ch5FinalIntro', day: 21, chapter: 6 },
  { kind: 'objective', enemy: 'swordsman', day: 21, chapter: 6, title: '最終防衛戦（第一波：重装前衛）', text: '玉座ではなく、みんなで帰る家を守る最後の戦いです。', raid: true },
  { kind: 'story', scene: 'ch5Raid1', day: 21, chapter: 6 },
  { kind: 'objective', enemy: 'archer', day: 21, chapter: 6, title: '最終防衛戦（第二波：疾風射手）', text: 'プルルが正門の演壇へ向かっています。道を開きましょう。', raid: true },
  { kind: 'story', scene: 'ch5Raid2', day: 21, chapter: 6 },
  { kind: 'objective', enemy: 'mage', day: 21, chapter: 6, title: '最終防衛戦（最終波：氷結術師）', text: '最後の敵です。王の最初で最後の王命を届けるために勝利しましょう！', raid: true },
  { kind: 'story', scene: 'ch5RoyalCommand', day: 21, chapter: 6 },
  { kind: 'story', scene: 'ch5Epilogue', day: 21, chapter: 6 },
  { kind: 'end', day: 21, chapter: 6 },
];

/** 一度だけ差し込まれる場面。 */
export const interludes = {
  birth: 'birth',
  loss: { swordsman: 'swordLoss', archer: 'archerLoss', mage: 'mageLoss' } as Record<EnemyId, string>,
  raidLoss: 'raidLoss',
} as const;
