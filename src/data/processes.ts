// Prototype manufacturing choices; values are proposals for playtesting.
export const processes={
 standard:{name:'標準培養',duration:6000,hp:0,cost:0,heatProtection:false,description:'6秒で製造。性能への追加補正なし。'},
 rapid:{name:'急速培養',duration:3000,hp:-15,cost:0,heatProtection:false,description:'3秒で製造。ただし完成個体の耐久力が15下がる。'},
 heated:{name:'高温培養',duration:9000,hp:0,cost:8,heatProtection:true,description:'9秒かけて耐熱性を付与し、火炎自傷を防ぐ。製造コスト見積もり+8。冷気攻撃の被ダメージ+5。'},
} as const;
export type ProcessId=keyof typeof processes;

