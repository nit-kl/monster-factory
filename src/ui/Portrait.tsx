import { cast } from '../data/cast';
import type { CastId } from '../domain/story';

// 立ち絵。絵のない人物は影絵（仮素材）で表示する。
function Shade({ kind, color }: { kind: 'serpent' | 'figure'; color: string }) {
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
  return (
    <svg viewBox="0 0 400 720" className="shade" aria-hidden="true">
      <path d="M200 70 q62 0 62 70 q0 60 -62 70 q-62 -10 -62 -70 q0 -70 62 -70Z" fill="#0e0a16" />
      <path d="M110 720 q-10 -330 40 -470 q50 -40 100 0 q50 140 40 470Z" fill="#0e0a16" />
      <path d="M150 250 q50 34 100 0" stroke={color} strokeWidth="4" fill="none" opacity="0.7" />
      <circle cx="180" cy="140" r="5" fill={color} opacity="0.8" /><circle cx="220" cy="140" r="5" fill={color} opacity="0.8" />
    </svg>
  );
}

export function Portrait({ id, className = '' }: { id: CastId; className?: string }) {
  const c = cast[id];
  if (c.shade === 'none') return null;
  return (
    <div className={`portrait ${c.wide ? 'wide' : ''} portrait-${id} ${className}`}>
      {c.image ? <img src={c.image} alt={c.name} draggable={false} /> : <Shade kind={c.shade ?? 'figure'} color={c.color} />}
    </div>
  );
}
export function Thumb({ id }: { id: CastId }) {
  const c = cast[id];
  return <span className={`thumb thumb-${id} ${c.wide ? 'thumb-wide' : ''}`} style={{ borderColor: c.color }} aria-hidden="true">{c.image ? <img src={c.image} alt="" draggable={false} /> : <span className="thumb-fallback">◆</span>}</span>;
}
