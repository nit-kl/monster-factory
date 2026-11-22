import type { CgId, MapStep } from '../domain/story';

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
  throne_puppet: '/assets/cg/throne_puppet-v3.png',
  maid_ring: '/assets/cg/maid_ring.png',
  world_map: '/assets/cg/world_map-v2.png',
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

function MapMarks({ step }: { step: MapStep }) {
  const factories = [[168,280],[270,319],[145,396],[625,279],[700,325],[646,396]];
  return <svg className="event-map-marks" viewBox="0 0 800 450" role="img"
    aria-label={step === 'closed' ? '第一から第六工場にバツ印' : step === 'destination' ? '南の谷の第七工場に丸印' : '地図上の軍の位置'}>
    {step === 'war' && <>
      <text x="400" y="49">北の勇者軍</text><text x="400" y="244">南の魔王軍</text>
    </>}
    {step === 'castle' && <>
      <ellipse cx="403" cy="192" rx="53" ry="42" stroke="#ffe2a0" /><text x="403" y="249">本社・魔王城</text>
    </>}
    {(step === 'closed' || step === 'destination') && factories.map(([x,y],i) => (
      <g key={i} className="map-factory-mark" transform={`translate(${x} ${y})`}>
        <path d="M-16 10V-4l11-7v8l11-8v5h4v-14h6v30Z" fill="#352422" stroke="#e7b998" />
        <path d="M-21-20 21 15M21-20-21 15" fill="none" stroke="#ff7863" strokeWidth="4" />
        <text y="29">第{i+1}工場</text>
      </g>
    ))}
    {step === 'destination' && <>
      <ellipse cx="398" cy="352" rx="54" ry="44" stroke="#ffe2a0" /><text x="398" y="415">第七工場</text>
    </>}
  </svg>;
}

export function EventCg({ id, caption, mapStep }: { id: CgId; caption?: string; mapStep?: MapStep }) {
  return (
    <figure className="event-cg" data-testid={`cg-${id}`}>
      <div className={`event-cg-frame${id === 'world_map' ? ' event-map-frame' : ''}`}>
        <img src={cgPaths[id]} alt={cgTitles[id]} draggable={false} />
        {id === 'world_map' && mapStep && <MapMarks key={mapStep} step={mapStep} />}
      </div>
      <figcaption>{caption ?? cgTitles[id]}</figcaption>
    </figure>
  );
}
