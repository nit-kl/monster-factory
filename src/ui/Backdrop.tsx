import type { ReactNode } from 'react';
import type { BgId } from '../domain/story';

// 会話劇の背景。すべて独自に描いた仮の絵（SVG）と、既存の工場画像。
const Glow = ({ x, y, r, c, o = 0.5 }: { x: number; y: number; r: number; c: string; o?: number }) => (
  <circle cx={x} cy={y} r={r} fill={c} opacity={o} style={{ filter: `blur(${r * 0.35}px)` }} />
);
const Candle = ({ x, y }: { x: number; y: number }) => (
  <g className="flicker">
    <Glow x={x} y={y - 20} r={90} c="#ffb45a" o={0.35} />
    <rect x={x - 6} y={y} width={12} height={46} fill="#e9dcc0" />
    <path d={`M${x} ${y - 34} q14 20 0 34 q-14 -14 0 -34`} fill="#ffd27a" />
  </g>
);
const Stars = ({ n, h }: { n: number; h: number }) => (
  <>{Array.from({ length: n }, (_, i) => <circle key={i} cx={(i * 739) % 1600} cy={(i * 317) % h} r={1 + (i % 3) * 0.6} fill="#fff" opacity={0.3 + (i % 5) * 0.14} />)}</>
);

const scenes: Record<Exclude<BgId, 'floor' | 'tank' | 'black'>, ReactNode> = {
  throne: (
    <>
      <rect width="1600" height="900" fill="url(#g-throne)" />
      <path d="M0 900 L420 620 L1180 620 L1600 900Z" fill="#1c0f26" />
      <path d="M620 900 L720 620 L880 620 L980 900Z" fill="#5a1430" opacity="0.8" />
      {[120, 330, 1270, 1480].map((x, i) => <g key={x}><rect x={x - 40} y={0} width={80} height={i % 3 ? 700 : 820} fill="#241432" /><rect x={x - 52} y={(i % 3 ? 700 : 820) - 30} width={104} height={30} fill="#c9983f" /></g>)}
      <path d="M430 60 h740 v580 q-370 40 -740 0Z" fill="#521436" />
      <Glow x={800} y={330} r={300} c="#a8344a" o={0.3} />
      <g opacity="0.62">
        <path d="M800 150 q-150 -110 -210 -20 q70 0 120 80 q-60 40 -70 150 q-110 60 -130 280 h580 q-20 -220 -130 -280 q-10 -110 -70 -150 q50 -80 120 -80 q-60 -90 -210 20Z" fill="#0c0410" />
        <path d="M740 152 l20 -50 l20 34 l20 -44 l20 44 l20 -34 l20 50Z" fill="#0c0410" />
      </g>
      <Glow x={770} y={235} r={9} c="#ff5a3a" o={0.85} /><Glow x={830} y={235} r={9} c="#ff5a3a" o={0.85} />
      {Array.from({ length: 13 }, (_, i) => <rect key={i} x={440 + i * 57} y={60} width={22} height={590} fill="#1c0414" opacity={0.3} />)}
      <rect x="410" y="40" width="780" height="34" fill="#c9983f" />
      <Candle x={250} y={560} /><Candle x={1350} y={560} /><Candle x={520} y={640} /><Candle x={1080} y={640} />
    </>
  ),
  study: (
    <>
      <rect width="1600" height="900" fill="url(#g-study)" />
      <rect x="1040" y="90" width="330" height="480" rx="165" fill="#12203a" /><circle cx="1240" cy="230" r="62" fill="#e8f0d8" opacity="0.9" /><Glow x={1240} y={230} r={150} c="#bfe0c8" o={0.25} />
      <path d="M1205 90 v480 M1040 330 h330" stroke="#0b0a12" strokeWidth="12" />
      {[60, 330, 600].map(x => <g key={x}><rect x={x} y={80} width={230} height={620} fill="#150f1c" />{Array.from({ length: 5 }, (_, r) => Array.from({ length: 9 }, (_, c) => <rect key={`${r}-${c}`} x={x + 14 + c * 23} y={100 + r * 118 + ((c * 7 + r) % 4) * 6} width={17} height={92 - ((c * 7 + r) % 4) * 6} fill={['#4a2f3a', '#2f4a3c', '#3a3a5a', '#5a4a2a'][(c + r) % 4]} />))}</g>)}
      <path d="M0 900 L0 720 H1600 V900Z" fill="#0c0810" />
      <rect x="380" y="640" width="840" height="50" fill="#3a2418" /><rect x="420" y="690" width="40" height="210" fill="#2a1a12" /><rect x="1140" y="690" width="40" height="210" fill="#2a1a12" />
      {[470, 560, 980].map((x, i) => <rect key={x} x={x} y={640 - 30 - i * 22} width={110} height={30 + i * 22} fill="#d8ceb0" opacity={0.85} />)}
      <rect x="760" y="596" width="96" height="44" fill="#e8dcc0" /><circle cx="808" cy="618" r="13" fill="#a8242c" />
      <Candle x={690} y={594} />
    </>
  ),
  corridor: (
    <>
      <rect width="1600" height="900" fill="#0b0712" />
      {[0, 1, 2, 3, 4, 5].map(i => { const k = 1 - i * 0.15, w = 1500 * k, h = 1000 * k, x = 800 - w / 2, y = 470 - h / 2; return <path key={i} d={`M${x} ${y + h} V${y + h * 0.35} Q${800} ${y - h * 0.15} ${x + w} ${y + h * 0.35} V${y + h}Z`} fill={`rgb(${22 + i * 9},${14 + i * 5},${34 + i * 10})`} stroke="#c9983f" strokeOpacity={0.25} strokeWidth={3} />; })}
      <path d="M560 900 L745 560 H855 L1040 900Z" fill="#5a1430" opacity="0.75" />
      <Glow x={800} y={470} r={130} c="#ffcf8a" o={0.25} />
      <Candle x={300} y={420} /><Candle x={1300} y={420} /><Candle x={520} y={470} /><Candle x={1080} y={470} />
    </>
  ),
  road: (
    <>
      <rect width="1600" height="900" fill="url(#g-dusk)" />
      <Stars n={55} h={340} />
      <circle cx="1280" cy="210" r="68" fill="#f5e6c4" opacity="0.82" />
      <Glow x={1280} y={210} r={190} c="#ffcf8a" o={0.24} />
      <path d="M0 580 L210 350 L430 510 L690 260 L960 490 L1220 310 L1600 540 V900 H0Z" fill="#231734" />
      <path d="M0 660 L320 490 L610 610 L940 470 L1320 600 L1600 520 V900 H0Z" fill="#181026" />
      {/* 陥落した旧工場・監視塔の廃墟シルエット */}
      <g fill="#100a1a" opacity="0.9">
        <rect x="330" y="395" width="38" height="120" />
        <path d="M324 395 L349 360 L374 395Z" />
        <rect x="920" y="360" width="48" height="130" />
        <path d="M920 360 L945 385 L968 368 V390 H920Z" />
      </g>
      {/* 崖沿いの街道と荷馬車 */}
      <path d="M0 760 Q520 660 980 710 T1600 680 V900 H0Z" fill="#0d0814" />
      <path d="M120 900 Q580 700 1120 695 L1360 705 Q920 760 460 900Z" fill="#2b2038" opacity="0.85" />
      <g transform="translate(560, 560)">
        <rect x="40" y="36" width="230" height="118" rx="22" fill="#26182c" stroke="#c9983f" strokeWidth="3" strokeOpacity="0.65" />
        <path d="M55 36 Q155 -10 255 36" fill="#3b2644" stroke="#c9983f" strokeWidth="2" strokeOpacity="0.5" />
        <rect x="125" y="62" width="60" height="42" rx="6" fill="#ffb45a" opacity="0.78" />
        <Glow x={155} y={82} r={95} c="#ffb45a" o={0.28} />
        <circle cx="95" cy="162" r="36" fill="#120c18" stroke="#c9983f" strokeWidth="5" />
        <circle cx="220" cy="162" r="36" fill="#120c18" stroke="#c9983f" strokeWidth="5" />
        <Candle x={282} y={92} />
      </g>
    </>
  ),
  exterior: (
    <>
      <rect width="1600" height="900" fill="url(#g-dusk)" />
      <Stars n={40} h={300} />
      <path d="M0 620 L260 330 L470 560 L700 280 L980 600 L1230 360 L1600 640 V900 H0Z" fill="#2a1c3c" />
      <path d="M0 700 L340 520 L640 690 L1000 540 L1600 720 V900 H0Z" fill="#1c1228" />
      <g fill="#0f0a18">
        <rect x="520" y="470" width="620" height="330" /><path d="M520 470 l70 -70 h480 l70 70Z" />
        <rect x="610" y="190" width="70" height="230" /><rect x="770" y="230" width="70" height="190" /><rect x="930" y="170" width="70" height="250" />
        <rect x="400" y="600" width="160" height="200" /><rect x="1100" y="560" width="200" height="240" />
      </g>
      {[[640, 180, 46], [668, 120, 62], [716, 54, 84]].map(([x, y, r], i) => <circle key={i} className="smoke" cx={x} cy={y} r={r} fill="#8a7a9c" opacity={0.4 - i * 0.09} />)}
      {[[580, 540], [700, 540], [820, 540], [580, 650], [1040, 650], [1160, 620]].map(([x, y], i) => <rect key={i} x={x} y={y} width={44} height={62} fill={i % 2 ? '#ffb45a' : '#3a2a4c'} opacity={0.9} />)}
      <rect x="780" y="660" width="100" height="140" fill="#ffb45a" opacity="0.85" /><Glow x={830} y={730} r={160} c="#ffb45a" o={0.22} />
      <path d="M0 800 H1600 V900 H0Z" fill="#0a0710" /><path d="M700 900 L800 800 H860 L960 900Z" fill="#241a30" />
    </>
  ),
  lab: (
    <>
      <rect width="1600" height="900" fill="url(#g-lab)" />
      {[70, 1250].map(x => <g key={x}><rect x={x} y={90} width={280} height={560} fill="#150f22" stroke="#c9983f" strokeOpacity={0.4} strokeWidth={4} />{Array.from({ length: 4 }, (_, r) => Array.from({ length: 3 }, (_, c) => <g key={`${r}${c}`}><rect x={x + 26 + c * 82} y={110 + r * 136} width={62} height={104} rx={12} fill={['#7af0ff', '#b58cff', '#7dffb0', '#ff9ad0'][(r + c) % 4]} opacity={0.3} /><circle cx={x + 57 + c * 82} cy={175 + r * 136} r={15 + ((r * 3 + c) % 3) * 4} fill={['#7af0ff', '#b58cff', '#7dffb0', '#ff9ad0'][(r + c) % 4]} opacity={0.75} /></g>))}</g>)}
      <rect x="560" y="120" width="480" height="330" fill="#102038" stroke="#7ad0ff" strokeOpacity={0.6} strokeWidth={4} />
      {Array.from({ length: 9 }, (_, i) => <path key={i} d={`M${560 + i * 60} 120 V450 M560 ${120 + i * 41} H1040`} stroke="#7ad0ff" strokeOpacity={0.18} />)}
      <circle cx="800" cy="285" r="92" fill="none" stroke="#7ad0ff" strokeWidth="3" opacity="0.8" /><circle cx="800" cy="285" r="46" fill="none" stroke="#7ad0ff" strokeWidth="2" opacity="0.6" /><path d="M690 285 H910 M800 175 V395" stroke="#7ad0ff" opacity="0.5" />
      <path d="M0 900 V700 H1600 V900Z" fill="#0c0814" />
      <path d="M430 700 L520 610 H1080 L1170 700Z" fill="#3a2a4a" /><rect x="430" y="700" width="740" height="40" fill="#241832" />
      <rect x="640" y="622" width="320" height="60" fill="#e8dcc0" opacity="0.9" transform="skewX(-12)" /><Glow x={800} y={640} r={220} c="#7ad0ff" o={0.16} />
      <Candle x={1010} y={566} />
    </>
  ),
  roof: (
    <>
      <rect width="1600" height="900" fill="url(#g-night)" />
      <Stars n={90} h={620} />
      <circle cx="1180" cy="210" r="86" fill="#f4eedc" /><Glow x={1180} y={210} r={220} c="#cfd8ff" o={0.22} />
      <path d="M0 700 L300 560 L620 690 L980 590 L1600 710 V900 H0Z" fill="#120c1e" />
      <rect x="1010" y="120" width="96" height="620" fill="#0a0612" /><rect x="994" y="120" width="128" height="26" fill="#0a0612" />
      {[[1058, 86, 50], [1090, 20, 76]].map(([x, y, r], i) => <circle key={i} className="smoke" cx={x} cy={y} r={r} fill="#9a8cb0" opacity={0.3 - i * 0.08} />)}
      <rect x="0" y="740" width="1600" height="160" fill="#0a0612" />
      <rect x="0" y="640" width="1600" height="14" fill="#2a2038" />{Array.from({ length: 21 }, (_, i) => <rect key={i} x={i * 80} y={640} width={10} height={104} fill="#2a2038" />)}
      <Glow x={260} y={720} r={140} c="#ffb45a" o={0.18} />
    </>
  ),
  workshop: (
    <>
      <rect width="1600" height="900" fill="url(#g-forge)" />
      <rect x="90" y="110" width="620" height="330" fill="#1c1418" stroke="#c9983f" strokeOpacity={0.35} strokeWidth={4} />
      {[150, 240, 330, 420, 510, 600].map((x, i) => <g key={x}><rect x={x - 5} y={150} width={10} height={170 + (i % 3) * 30} fill="#8a8c98" /><rect x={x - 22} y={150 + 170 + (i % 3) * 30} width={44} height={i % 2 ? 26 : 50} rx={i % 2 ? 13 : 4} fill="#6a5a48" /></g>)}
      <path d="M1040 900 V380 Q1250 240 1460 380 V900Z" fill="#120a0c" /><path d="M1100 900 V470 Q1250 380 1400 470 V900Z" fill="#ff7a2c" opacity="0.75" /><Glow x={1250} y={640} r={320} c="#ff8a3c" o={0.3} />
      <path d="M0 900 V720 H1600 V900Z" fill="#0c0808" />
      <rect x="200" y="620" width="700" height="46" fill="#4a3020" /><rect x="240" y="666" width="46" height="234" fill="#34200f" /><rect x="820" y="666" width="46" height="234" fill="#34200f" />
      <path d="M470 620 q0 -74 74 -74 q74 0 74 74Z" fill="#9aa2b4" /><rect x="486" y="532" width="20" height="26" fill="#9aa2b4" /><rect x="582" y="532" width="20" height="26" fill="#9aa2b4" />
      <Candle x={360} y={574} />
    </>
  ),
  gate: (
    <>
      <rect width="1600" height="900" fill="url(#g-day)" />
      <path d="M0 560 L300 300 L560 520 L820 240 L1120 540 L1380 330 L1600 560 V900 H0Z" fill="#4a4470" opacity="0.8" />
      <path d="M0 640 L420 500 L800 650 L1200 520 L1600 660 V900 H0Z" fill="#2c2848" />
      <g fill="#171226"><rect x="0" y="300" width="330" height="600" /><rect x="1270" y="300" width="330" height="600" /><rect x="0" y="240" width="1600" height="90" />
        {Array.from({ length: 14 }, (_, i) => <rect key={i} x={i * 122} y={196} width={70} height={50} />)}</g>
      {Array.from({ length: 6 }, (_, i) => <rect key={i} x={350 + i * 180} y={330} width={12} height={110} fill="#c9983f" opacity="0.6" />)}
      <rect x="120" y="380" width="90" height="230" fill="#4a1f7a" /><rect x="1390" y="380" width="90" height="230" fill="#4a1f7a" />
      <path d="M0 900 V760 H1600 V900Z" fill="#141020" /><path d="M560 900 L740 650 H860 L1040 900Z" fill="#3a3456" />
      {[[760, 610], [800, 600], [840, 610]].map(([x, y], i) => <g key={i} fill="#0c0a14"><circle cx={x} cy={y} r={9} /><rect x={x - 7} y={y + 8} width={14} height={30} /></g>)}
    </>
  ),
};

export function Backdrop({ bg }: { bg: BgId }) {
  if (bg === 'black') return <div className="backdrop backdrop-black" />;
  if (bg === 'floor' || bg === 'tank') return <div className={`backdrop backdrop-image backdrop-${bg}`} />;
  return (
    <svg className="backdrop" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        {([['g-throne', '#0a0512', '#2c1238'], ['g-study', '#0c1418', '#1c2a26'], ['g-dusk', '#241a4a', '#e0784a'], ['g-lab', '#0e0a1c', '#241a40'], ['g-night', '#070510', '#1c1a40'], ['g-forge', '#120a0c', '#3a1c16'], ['g-day', '#6a8ad0', '#e8d0c0']] as const).map(([id, a, b]) => (
          <linearGradient key={id} id={id} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={a} /><stop offset="1" stopColor={b} /></linearGradient>
        ))}
      </defs>
      {scenes[bg]}
    </svg>
  );
}
