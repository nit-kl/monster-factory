import { cast, type ShadeKind } from '../data/cast';
import type { CastId, Mood } from '../domain/story';

// 立ち絵。絵のない人物は影絵（仮素材）で表示する。
function Shade({ kind, color }: { kind: Exclude<ShadeKind, 'none'>; color: string }) {
  if (kind === 'serpent') return (
    <svg viewBox="0 0 400 720" className="shade" aria-hidden="true">
      <path d="M210 710 C40 660 30 540 200 510 C360 482 360 380 210 356 C80 336 96 226 186 196" fill="none" stroke="#101c16" strokeWidth="86" strokeLinecap="round" />
      <path d="M210 710 C40 660 30 540 200 510 C360 482 360 380 210 356 C80 336 96 226 186 196" fill="none" stroke="#1c3226" strokeWidth="50" strokeLinecap="round" strokeDasharray="6 22" />
      <path d="M110 150 Q200 -20 290 150 Q300 250 200 262 Q100 250 110 150Z" fill="#0c1610" />
      <path d="M150 232 q50 26 100 0" stroke={color} strokeWidth="3" fill="none" opacity="0.5" />
      {[[158, 130, 13], [242, 130, 13], [200, 92, 9], [136, 176, 8], [264, 176, 8], [180, 170, 6], [220, 170, 6], [200, 136, 7], [150, 420, 6], [250, 440, 6], [120, 600, 6]].map(([x, y, r], i) => (
        <g key={i} className="blink" style={{ animationDelay: `${(i * 0.7) % 4}s` }}><circle cx={x} cy={y} r={r + 6} fill={color} opacity="0.25" /><ellipse cx={x} cy={y} rx={r} ry={r * 0.7} fill={color} /><ellipse cx={x} cy={y} rx={r * 0.22} ry={r * 0.66} fill="#06100a" /></g>
      ))}
    </svg>
  );
  if (kind === 'general') return (
    <svg viewBox="0 0 400 720" className="shade" aria-hidden="true">
      <path d="M60 720 L90 260 L150 200 L250 200 L310 260 L340 720Z" fill="#180a08" stroke={color} strokeWidth="3" strokeOpacity="0.45" />
      <path d="M135 200 Q110 70 65 40 Q125 95 160 150 L200 130 L240 150 Q275 95 335 40 Q290 70 265 200Z" fill="#180a08" stroke={color} strokeWidth="3" strokeOpacity="0.6" />
      <circle cx="176" cy="168" r="7" fill={color} /><circle cx="224" cy="168" r="7" fill={color} />
    </svg>
  );
  if (kind === 'knight') return (
    <svg viewBox="0 0 400 720" className="shade" aria-hidden="true">
      <path d="M85 720 L110 250 L160 210 L240 210 L290 250 L315 720Z" fill="#0d1320" stroke={color} strokeWidth="3" strokeOpacity="0.45" />
      <path d="M145 210 V120 Q200 70 255 120 V210Z" fill="#0d1320" stroke={color} strokeWidth="3" strokeOpacity="0.55" />
      <path d="M165 155 H235" stroke={color} strokeWidth="5" opacity="0.85" />
    </svg>
  );
  return (
    <svg viewBox="0 0 400 720" className="shade" aria-hidden="true">
      <path d="M200 70 q62 0 62 70 q0 60 -62 70 q-62 -10 -62 -70 q0 -70 62 -70Z" fill="#0e0a16" />
      <path d="M110 720 q-10 -330 40 -470 q50 -40 100 0 q50 140 40 470Z" fill="#0e0a16" />
      <path d="M150 250 q50 34 100 0" stroke={color} strokeWidth="4" fill="none" opacity="0.7" />
      <circle cx="180" cy="140" r="5" fill={color} opacity="0.8" /><circle cx="220" cy="140" r="5" fill={color} opacity="0.8" />
    </svg>
  );
}

function EmotionOverlay({ mood }: { mood: Mood }) {
  if (mood === 'normal') return null;
  return (
    <svg viewBox="0 0 120 120" className={`emotion-mark emotion-${mood}`} aria-hidden="true">
      {mood === 'angry' && (
        <g stroke="#ff5252" strokeWidth="5" fill="none" strokeLinecap="round">
          <path d="M35 20 Q52 45 25 55" /><path d="M65 20 Q48 45 75 55" />
          <path d="M25 75 Q52 55 35 90" /><path d="M75 75 Q48 55 65 90" />
        </g>
      )}
      {mood === 'surprised' && (
        <g fill="#ffe066" stroke="#1c1026" strokeWidth="2">
          <polygon points="56,12 68,12 64,68 58,68" />
          <circle cx="61" cy="84" r="7" />
          <path d="M22 30 L40 45 M98 30 L80 45 M20 65 L38 65 M100 65 L82 65" stroke="#ffe066" strokeWidth="4" strokeLinecap="round" />
        </g>
      )}
      {mood === 'cold' && (
        <g stroke="#7ad0ff" strokeWidth="3.5" strokeLinecap="round" opacity="0.9">
          <line x1="30" y1="22" x2="30" y2="78" /><line x1="50" y1="16" x2="50" y2="86" />
          <line x1="70" y1="20" x2="70" y2="80" /><line x1="90" y1="28" x2="90" y2="70" />
        </g>
      )}
      {mood === 'sad' && (
        <path d="M62 18 C62 18 38 56 38 74 A24 24 0 0 0 86 74 C86 56 62 18 62 18Z" fill="#7ec8ff" stroke="#182b49" strokeWidth="3" opacity="0.9" />
      )}
      {mood === 'smile' && (
        <g fill="#ffd97a">
          <path d="M60 14 L67 38 L91 45 L67 52 L60 76 L53 52 L29 45 L53 38Z" />
          <circle cx="28" cy="24" r="5" /><circle cx="90" cy="76" r="6" />
        </g>
      )}
      {mood === 'serious' && (
        <g stroke="#f0d48a" strokeWidth="3" fill="none" opacity="0.85">
          <circle cx="60" cy="60" r="34" strokeDasharray="10 8" />
          <circle cx="60" cy="60" r="6" fill="#f0d48a" />
        </g>
      )}
    </svg>
  );
}

export function Portrait({ id, mood = 'normal', pulseKey = 0, className = '' }: { id: CastId; mood?: Mood; pulseKey?: number; className?: string }) {
  const c = cast[id];
  if (c.shade === 'none') return null;
  return (
    <div className={`portrait ${c.wide ? 'wide' : ''} portrait-${id} mood-${mood} ${className}`}>
      <div key={pulseKey} className="portrait-inner">
        {c.image ? <img src={c.image} alt={c.name} draggable={false} /> : <Shade kind={c.shade ?? 'figure'} color={c.color} />}
        <EmotionOverlay mood={mood} />
      </div>
    </div>
  );
}
export function Thumb({ id }: { id: CastId }) {
  const c = cast[id];
  return <span className={`thumb thumb-${id} ${c.wide ? 'thumb-wide' : ''}`} style={{ borderColor: c.color }} aria-hidden="true">{c.image ? <img src={c.image} alt="" draggable={false} /> : <span className="thumb-fallback">◆</span>}</span>;
}
