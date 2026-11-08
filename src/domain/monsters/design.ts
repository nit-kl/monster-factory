import { processes,type ProcessId } from '../../data/processes';
// Balance values are prototype proposals, not final game rules.
export const bodies = {
 slime: {name:'スライム',hp:60,attack:8,speed:12,cost:10},
 golem: {name:'ゴーレム',hp:110,attack:12,speed:5,cost:24},
 beast: {name:'獣型',hp:75,attack:14,speed:15,cost:18},
};
export const attacks = {
 fire: {name:'火炎袋',attack:20,cost:12,description:'高火力。ただし耐熱対策がないと攻撃ごとに自傷。'},
 claws: {name:'爪',attack:12,cost:6,description:'自傷のない、扱いやすい攻撃器官。'},
 venom: {name:'毒腺',attack:6,cost:10,description:'攻撃で毒を付与。両者が生存している巡目終了時に7ダメージ。重複なし。'},
};
export const defenses = {
 shell: {name:'石殻',hp:25,speed:-5,cost:12,description:'熱から身を守る。耐久力が増す代わりに遅くなる。'},
 regen: {name:'再生核',hp:10,speed:0,cost:10,description:'両者が生存している巡目終了時に耐久力を6回復。最大耐久力を超えない。'},
 light: {name:'軽装甲',hp:5,speed:-1,cost:4,description:'安価で、速度への影響が小さい。'},
};
export type Design={body:keyof typeof bodies;attack:keyof typeof attacks;defense:keyof typeof defenses;process?:ProcessId};
export const initialDesign:Design={body:'slime',attack:'fire',defense:'light',process:'standard'};
export function calculateDesign(d:Design){
 const b=bodies[d.body],a=attacks[d.attack],f=defenses[d.defense],p=processes[d.process??'standard'];
 return {hp:Math.max(1,b.hp+f.hp+p.hp),attack:b.attack+a.attack,speed:Math.max(1,b.speed+f.speed),cost:b.cost+a.cost+f.cost+p.cost,selfDamage:d.attack==='fire'&&d.defense!=='shell'&&!p.heatProtection?8:0};
}


