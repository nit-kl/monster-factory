import type { StaffId } from './staff';
export type FloorId='production'|'research';
export const floors:Record<FloorId,{name:string;staff:StaffId;staffName:string;description:string}>={
 production:{name:'1F 製造フロア',staff:'vargas',staffName:'バルガス',description:'培養・接合・検査・出撃。設備をクリックして近くへ移動。'},
 research:{name:'2F 研究フロア',staff:'orphen',staffName:'オルフェン',description:'設計台と器官標本庫。担当者に研究内容を相談できます。'},
};
