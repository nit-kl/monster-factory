import type { CgId } from '../domain/story';

const cgTitles: Record<CgId, string> = {
  throne_puppet: '記録の矛盾 ―― 二本角の巨影とからくり糸',
  maid_ring: '回廊の証拠 ―― 青いガラスの指輪と油のすす',
  world_map: '三百年戦争の勢力図と最後の第七工場',
  cold_welcome: '冷たい出迎え ―― 突き返された任命状',
  first_birth: '培養槽の産声と乾いた布',
  gate_defense: '孤立無援の谷門 ―― 先遣部隊の包囲網',
  broken_seal: '鉛の箱に収められた先代魔王の右角',
  white_flag: '撤退の最後尾に残された騎士',
  broken_horn_memory: '三年前の真実 ―― 灰冠平原の停戦盟約',
  pluru_crown: '戦わない王の誕生 ―― 谷へ広がる黄金の共鳴',
  pluru_encounter: '鞄に寄り添うプルルと黄金の核',
  quiet_repair: '小さな布で手伝う夜の修理',
  last_vigil: '灯のように薄れていく、最後の時間',
  empty_design: '空の設計台で、自分のあり方を選ぶ',
  factory_morning: '玉座よりも、みんなと働く朝',
};

const cgPaths: Record<CgId, string> = {
  throne_puppet: '/assets/cg/throne_puppet.png',
  maid_ring: '/assets/cg/maid_ring.png',
  world_map: '/assets/cg/world_map.png',
  cold_welcome: '/assets/cg/cold_welcome.png',
  first_birth: '/assets/cg/first_birth.png',
  gate_defense: '/assets/cg/gate_defense.png',
  broken_seal: '/assets/cg/broken_seal.png',
  white_flag: '/assets/cg/white_flag.png',
  broken_horn_memory: '/assets/cg/broken_horn_memory.png',
  pluru_crown: '/assets/cg/pluru_crown.png',
  pluru_encounter: '/assets/cg/pluru_encounter.png',
  quiet_repair: '/assets/cg/quiet_repair.png',
  last_vigil: '/assets/cg/last_vigil.png',
  empty_design: '/assets/cg/empty_design.png',
  factory_morning: '/assets/cg/factory_morning.png',
};

export function EventCg({ id, caption }: { id: CgId; caption?: string }) {
  return (
    <figure className="event-cg" data-testid={`cg-${id}`}>
      <div className="event-cg-frame">
        <img src={cgPaths[id]} alt={cgTitles[id]} draggable={false} />
      </div>
      <figcaption>{caption ?? cgTitles[id]}</figcaption>
    </figure>
  );
}
