import type { CgId } from '../domain/story';

const cgTitles: Record<CgId, string> = {
  throne_puppet: '記録の矛盾 ―― 二本角の巨影とからくり糸',
  maid_ring: '回廊の証拠 ―― 青い硝子の指輪と灯油の煤',
  world_map: '三百年戦争の勢力図と最後の第七工場',
  cold_welcome: '冷たい出迎え ―― 突き返された任命状',
  first_birth: '培養槽の産声と乾いた布',
  gate_defense: '孤立無援の谷門 ―― 先遣部隊の包囲網',
  broken_seal: '暴かれた王家の封蝋と先代魔王の左角',
  white_flag: '白布の投降騎士と敵陣からの魔導通信',
  broken_horn_memory: '三年前の真実 ―― 灰冠平原の停戦盟約',
  pluru_crown: '戦わない王の誕生 ―― 谷へ広がる黄金の共鳴',
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
