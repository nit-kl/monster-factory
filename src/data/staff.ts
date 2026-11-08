export const staff = [
  { id:'lisette', name:'リゼット', role:'副工場長', form:'短い角を持つ魔族', image:'/assets/factory/lisette-v1.png', position:{x:35,y:85} },
  { id:'vargas', name:'バルガス', role:'設備主任', form:'牛頭のミノタウロス', image:'/assets/factory/vargas-v1.png', position:{x:20,y:80.1} },
  { id:'orphen', name:'オルフェン', role:'研究主任', form:'浮遊する骸骨のリッチ', image:'/assets/factory/orphen-v1.png', position:{x:56,y:35.1} },
  { id:'poyon', name:'ポヨン', role:'培養・品質管理', form:'巨大な半透明スライム', image:'/assets/factory/poyon-v1.png', position:{x:70,y:82.6} },
  { id:'pluru', name:'プルル', role:'試作体 No.000', form:'黄金の核を持つ小さな青いスライム', image:'/assets/factory/pluru-v1.png', position:{x:48,y:83.6} },
] as const;
export type StaffId=typeof staff[number]['id'];

