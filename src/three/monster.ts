import * as THREE from 'three';
import type { Design } from '../domain/design';
import { ball, box, cone, cyl, glow, mesh, metal, std, torus, type V3 } from './kit';

// 設計から3Dモデルを組み立てる。身体・攻撃器官・防御器官・培養工程が、それぞれ見た目に出る。
// すべて独自の手続き型ジオメトリ（仮素材）。正面は +Z。
export type Monster = {
  root: THREE.Group; body: THREE.Group; attack: THREE.Group; defense: THREE.Group;
  height: number; attackHandle: THREE.Vector3; defenseHandle: THREE.Vector3;
  tick: (t: number) => void; setAwake: (open: number) => void;
};
type Rig = {
  height: number; back: V3; hands: readonly [V3, V3]; core: V3;
  ring: { pos: V3; r: number; rot: V3 };
  plates: readonly { pos: V3; s: V3; rot?: V3 }[];
  bands: readonly { pos: V3; r: number; rot: V3 }[];
  guards: readonly { pos: V3; s: V3; rot?: V3; round?: boolean }[];
};
const rigs: Record<Design['body'], Rig> = {
  slime: {
    height: 1.35, back: [0, 1.02, -0.42], hands: [[-0.78, 0.42, 0.42], [0.78, 0.42, 0.42]], core: [0, 0.6, 0],
    ring: { pos: [0, 0.6, 0], r: 0.98, rot: [Math.PI / 2, 0, 0] },
    plates: [{ pos: [0, 1.18, 0.05], s: [0.62, 0.2, 0.62] }, { pos: [-0.55, 0.95, -0.2], s: [0.42, 0.16, 0.46], rot: [0, 0, 0.7] }, { pos: [0.55, 0.95, -0.2], s: [0.42, 0.16, 0.46], rot: [0, 0, -0.7] }, { pos: [0, 0.9, -0.62], s: [0.5, 0.16, 0.4], rot: [-0.8, 0, 0] }, { pos: [0, 1.0, 0.6], s: [0.4, 0.14, 0.3], rot: [0.75, 0, 0] }],
    bands: [{ pos: [0, 0.34, 0], r: 0.86, rot: [Math.PI / 2, 0, 0] }],
    guards: [{ pos: [0, 1.12, 0.04], s: [0.46, 0.13, 0.46], round: true }],
  },
  beast: {
    height: 1.75, back: [0, 1.42, -0.2], hands: [[-0.3, 0.1, 0.72], [0.3, 0.1, 0.72]], core: [0, 1.45, 0.15],
    ring: { pos: [0, 0.98, 0.1], r: 0.62, rot: [0, 0, 0] },
    plates: [{ pos: [0, 1.46, 0.3], s: [0.46, 0.14, 0.4] }, { pos: [0, 1.48, -0.25], s: [0.5, 0.14, 0.42] }, { pos: [0, 1.4, -0.72], s: [0.4, 0.13, 0.34], rot: [-0.4, 0, 0] }, { pos: [-0.44, 1.12, 0.05], s: [0.14, 0.4, 0.6], rot: [0, 0, 0.2] }, { pos: [0.44, 1.12, 0.05], s: [0.14, 0.4, 0.6], rot: [0, 0, -0.2] }],
    bands: [{ pos: [0, 1.12, 0.62], r: 0.4, rot: [0.2, 0, 0] }],
    guards: [{ pos: [0, 1.44, 0], s: [0.5, 0.06, 0.8] }, { pos: [0, 1.52, 1.0], s: [0.3, 0.05, 0.26], rot: [0.3, 0, 0] }],
  },
  golem: {
    height: 2.35, back: [0, 1.72, -0.5], hands: [[-1.0, 0.5, 0.28], [1.0, 0.5, 0.28]], core: [0, 1.3, 0.44],
    ring: { pos: [0, 1.3, 0.47], r: 0.34, rot: [0, 0, 0] },
    plates: [{ pos: [-0.95, 1.72, 0], s: [0.5, 0.26, 0.56] }, { pos: [0.95, 1.72, 0], s: [0.5, 0.26, 0.56] }, { pos: [0, 1.35, -0.5], s: [0.8, 0.6, 0.2] }, { pos: [0, 2.32, 0.03], s: [0.44, 0.14, 0.42] }, { pos: [0, 1.0, 0.5], s: [0.6, 0.3, 0.16] }],
    bands: [{ pos: [0, 0.82, 0], r: 0.6, rot: [Math.PI / 2, 0, 0] }],
    guards: [{ pos: [-0.95, 1.78, 0], s: [0.46, 0.08, 0.5] }, { pos: [0.95, 1.78, 0], s: [0.46, 0.08, 0.5] }, { pos: [0, 1.5, 0.46], s: [0.7, 0.4, 0.05] }],
  },
};

const tint = (base: number, process: Design['process']) => {
  const c = new THREE.Color(base);
  if (process === 'heated') c.lerp(new THREE.Color(0xff7a3c), 0.42);
  if (process === 'rapid') c.lerp(new THREE.Color(0xe8f4e0), 0.45);
  if (process === 'aged') c.offsetHSL(-0.03, 0.12, -0.08);
  return c.getHex();
};

type Parts = { group: THREE.Group; eyes: THREE.Object3D[]; tick: (t: number) => void; gel?: THREE.Material };

function eye(r: number, color = 0x140c1c) {
  const g = new THREE.Group();
  g.add(mesh(ball(r, 16, 12), std(color, { roughness: 0.15 })), mesh(ball(r * 0.34, 8, 8), glow(0xffffff, 1.2), [r * 0.3, r * 0.35, r * 0.72]));
  return g;
}

function slimeBody(process: Design['process']): Parts {
  const group = new THREE.Group();
  const geo = ball(0.9, 44, 32), p = geo.attributes.position;
  for (let i = 0; i < p.count; i++) if (p.getY(i) < -0.52) p.setY(i, -0.52);
  geo.computeVertexNormals();
  const gel = new THREE.MeshPhysicalMaterial({ color: tint(0x49cdb9, process), transparent: true, opacity: 0.74, roughness: 0.12, clearcoat: 1, clearcoatRoughness: 0.1, emissive: tint(0x1c6a70, process), emissiveIntensity: 0.25 });
  const blob = mesh(geo, gel, [0, 0.44, 0], [0, 0, 0], [1, 0.84, 1]);
  const nucleus = mesh(ball(0.15, 16, 12), glow(0xdffcff, 1.6), [0.08, 0.52, -0.05]);
  const bubbles = [[-0.3, 0.3, 0.2, 0.07], [0.34, 0.72, -0.2, 0.05], [0.1, 0.9, 0.2, 0.04], [-0.4, 0.7, -0.3, 0.06]].map(([x, y, z, r]) => mesh(ball(r, 10, 8), std(0xffffff, { transparent: true, opacity: 0.35, roughness: 0.1 }), [x, y, z]));
  const eyes = [eye(0.11), eye(0.11)];
  eyes[0].position.set(-0.27, 0.72, 0.74); eyes[1].position.set(0.27, 0.72, 0.74);
  const mouth = mesh(torus(0.09, 0.018, 16, Math.PI), std(0x140c1c), [0, 0.54, 0.86], [0, 0, Math.PI]);
  group.add(nucleus, ...bubbles, blob, ...eyes, mouth);
  blob.renderOrder = 2;
  return { group, eyes, gel, tick: t => { const s = Math.sin(t * 2.4) * 0.035; blob.scale.set(1 - s, 0.84 + s * 1.4, 1 - s); nucleus.position.y = 0.52 + Math.sin(t * 1.7) * 0.05; } };
}

function beastBody(process: Design['process']): Parts {
  const group = new THREE.Group();
  const fur = std(tint(0x8b5a3a, process), { roughness: 0.95 }), dark = std(tint(0x4a2e22, process), { roughness: 0.95 }), pale = std(0xe6d3b8, { roughness: 0.9 });
  group.add(mesh(new THREE.CapsuleGeometry(0.42, 0.95, 8, 20), fur, [0, 0.98, 0], [Math.PI / 2, 0, 0]));
  group.add(mesh(ball(0.5, 20, 16), dark, [0, 1.08, 0.5], [0, 0, 0], [1, 1.02, 0.85])); // 胸のたてがみ
  group.add(mesh(ball(0.36, 20, 16), fur, [0, 1.32, 0.98]));
  group.add(mesh(box(0.3, 0.22, 0.4), pale, [0, 1.22, 1.3]), mesh(ball(0.07, 10, 8), std(0x1a1014), [0, 1.3, 1.5]));
  for (const x of [-0.2, 0.2]) group.add(mesh(cone(0.11, 0.3, 4), dark, [x, 1.7, 0.9], [-0.2, 0, x * -0.9]));
  const tail = mesh(cone(0.13, 0.9, 10), dark, [0, 1.25, -0.95], [-2.0, 0, 0]);
  group.add(tail);
  const legs = [[-0.3, 0.5], [0.3, 0.5], [-0.3, -0.5], [0.3, -0.5]].map(([x, z]) => {
    const leg = new THREE.Group();
    leg.add(mesh(cyl(0.15, 0.1, 0.78, 12), fur, [0, -0.38, 0]), mesh(ball(0.14, 12, 10), dark, [0, -0.78, 0.05], [0, 0, 0], [1, 0.6, 1.3]));
    leg.position.set(x, 0.86, z); group.add(leg);
    return leg;
  });
  const eyes = [-0.16, 0.16].map(x => { const e = mesh(ball(0.055, 10, 8), glow(0xffd84a, 2.2), [x, 1.4, 1.27]); group.add(e); return e; });
  return { group, eyes, tick: t => { tail.rotation.z = Math.sin(t * 3) * 0.35; legs.forEach((l, i) => (l.rotation.x = Math.sin(t * 1.6 + i) * 0.03)); } };
}

function golemBody(process: Design['process']): Parts {
  const group = new THREE.Group();
  const stone = std(tint(0x787489, process), { roughness: 0.95, flatShading: true }), darker = std(tint(0x55516a, process), { roughness: 1, flatShading: true });
  const rune = glow(process === 'heated' ? 0xff8a3c : 0x7af0ff, 2.4);
  const rock = (r: number) => new THREE.DodecahedronGeometry(r, 0);
  group.add(mesh(box(1.3, 1.0, 0.86), stone, [0, 1.3, 0]), mesh(rock(0.62), stone, [0, 1.62, -0.05], [0.3, 0.4, 0], [1.25, 0.7, 0.9]), mesh(box(0.9, 0.36, 0.7), darker, [0, 0.66, 0]));
  for (const x of [-1, 1]) {
    group.add(mesh(box(0.42, 0.56, 0.5), stone, [x * 0.34, 0.28, 0]), mesh(box(0.5, 0.14, 0.62), darker, [x * 0.34, 0.07, 0.06]));
    group.add(mesh(rock(0.34), stone, [x * 0.9, 1.66, 0], [0.3, x, 0]), mesh(box(0.36, 0.7, 0.4), darker, [x * 0.98, 1.14, 0]), mesh(rock(0.33), stone, [x * 1.0, 0.62, 0.06], [x, 0.4, 0]));
  }
  group.add(mesh(box(0.62, 0.5, 0.56), stone, [0, 2.06, 0.04]));
  const eyes = [-0.15, 0.15].map(x => { const e = mesh(box(0.14, 0.07, 0.04), rune, [x, 2.1, 0.33]); group.add(e); return e; });
  const lines = [mesh(box(0.05, 0.5, 0.02), rune, [0, 1.3, 0.44]), mesh(box(0.4, 0.05, 0.02), rune, [0, 1.45, 0.44]), mesh(box(0.24, 0.05, 0.02), rune, [0, 1.12, 0.44])];
  group.add(...lines);
  return { group, eyes, tick: t => { rune.emissiveIntensity = 1.8 + Math.sin(t * 2) * 0.8; } };
}

function attackOrgan(d: Design, rig: Rig, gel?: THREE.Material): { group: THREE.Group; handle: V3; tick: (t: number) => void } {
  const group = new THREE.Group(), k = d.body === 'slime' ? 0.9 : d.body === 'golem' ? 1.15 : 0.85;
  if (d.attack === 'fire') {
    const g = new THREE.Group(); g.position.set(...rig.back); g.scale.setScalar(k);
    const sacMat = glow(0xff6a1c, 1.6), flameMat = new THREE.MeshBasicMaterial({ color: 0xffc14a, transparent: true, opacity: 0.85, blending: THREE.AdditiveBlending, depthWrite: false });
    g.add(mesh(ball(0.34, 20, 16), sacMat, [0, 0.12, 0], [0, 0, 0], [1, 1.12, 1]), mesh(torus(0.3, 0.06, 24), metal(0x5a3a22), [0, -0.08, 0], [Math.PI / 2, 0, 0]));
    const flames = [-1, 1].map(x => {
      g.add(mesh(cyl(0.07, 0.09, 0.34, 10), metal(0x3a2a20), [x * 0.3, 0.28, -0.08], [0.3, 0, x * -0.5]));
      const f = mesh(cone(0.09, 0.36, 10), flameMat, [x * 0.4, 0.56, -0.14], [0.3, 0, x * -0.5]); f.castShadow = false; g.add(f); return f;
    });
    group.add(g);
    return { group, handle: [rig.back[0], rig.back[1] + 0.5 * k, rig.back[2]], tick: t => { sacMat.emissiveIntensity = 1.4 + Math.sin(t * 5) * 0.5; flames.forEach((f, i) => f.scale.set(1, 0.8 + Math.sin(t * 13 + i * 2) * 0.3, 1)); } };
  }
  if (d.attack === 'claws') {
    const ivory = std(0xf2ead8, { roughness: 0.3 });
    rig.hands.forEach((h, i) => {
      const side = i ? 1 : -1, g = new THREE.Group(); g.position.set(...h); g.scale.setScalar(k);
      if (gel) { const arm = mesh(ball(0.26, 16, 12), gel, [side * -0.16, 0.06, -0.14], [0, 0, 0], [1.3, 0.8, 1.4]); arm.castShadow = false; g.add(arm); }
      else g.add(mesh(ball(0.13, 12, 10), metal(0x6a5a48), [0, 0.06, 0]));
      for (let c = -1; c <= 1; c++) g.add(mesh(cone(0.055, 0.42, 8), ivory, [c * 0.11, 0.02, 0.24], [Math.PI / 2 + 0.25, 0, c * -0.22]));
      group.add(g);
    });
    return { group, handle: [0, rig.hands[0][1] + 0.3, rig.hands[0][2]], tick: () => {} };
  }
  const g = new THREE.Group(); g.position.set(...rig.back); g.scale.setScalar(k);
  const sac = new THREE.MeshStandardMaterial({ color: 0x7dff5c, emissive: 0x3fd42a, emissiveIntensity: 1.3, transparent: true, opacity: 0.85, roughness: 0.2 });
  [[0, 0.1, 0, 0.24], [-0.24, 0.02, 0.06, 0.16], [0.24, 0.02, 0.06, 0.16]].forEach(([x, y, z, r]) => g.add(mesh(ball(r, 16, 12), sac, [x, y, z])));
  const tailMat = std(0x3d2a4a, { roughness: 0.5 });
  const pts = [[0, 0.3, -0.12], [0, 0.6, -0.2], [0, 0.88, -0.08], [0, 1.0, 0.18], [0, 0.94, 0.42]];
  pts.forEach(([x, y, z], i) => g.add(mesh(ball(0.12 - i * 0.012, 12, 10), tailMat, [x, y, z])));
  g.add(mesh(cone(0.07, 0.34, 10), glow(0xa8ff6a, 1.8), [0, 0.8, 0.6], [2.2, 0, 0]));
  group.add(g);
  return { group, handle: [rig.back[0], rig.back[1] + 1.05 * k, rig.back[2]], tick: t => { sac.emissiveIntensity = 1.0 + Math.sin(t * 3) * 0.5; } };
}

function defenseOrgan(d: Design, rig: Rig): { group: THREE.Group; handle: V3; tick: (t: number) => void } {
  const group = new THREE.Group();
  if (d.defense === 'shell') {
    const stone = std(0x8d8676, { roughness: 1, flatShading: true }), moss = std(0x6c7a52, { roughness: 1, flatShading: true });
    rig.plates.forEach((p, i) => group.add(mesh(new THREE.DodecahedronGeometry(1, 0), i % 3 === 2 ? moss : stone, p.pos, p.rot ?? [0, i * 0.7, 0], p.s)));
    return { group, handle: [0, rig.height + 0.12, 0], tick: () => {} };
  }
  if (d.defense === 'regen') {
    const mat = glow(0xff7ad0, 1.1), ring = mesh(torus(rig.ring.r, 0.03, 64), mat, rig.ring.pos, rig.ring.rot);
    const core = mesh(new THREE.IcosahedronGeometry(0.15, 0), mat, rig.core);
    const orbs = [0, 1, 2].map(() => mesh(ball(0.05, 10, 8), glow(0xffd0f0, 1.4)));
    ring.castShadow = false; group.add(ring, core, ...orbs);
    const c = new THREE.Vector3(...rig.ring.pos), e = new THREE.Euler(...rig.ring.rot);
    return {
      group, handle: [rig.core[0], Math.max(rig.core[1], rig.ring.pos[1]) + 0.3, rig.core[2]],
      tick: t => {
        core.rotation.set(t, t * 1.3, 0); mat.emissiveIntensity = 1.0 + Math.sin(t * 2.5) * 0.35;
        orbs.forEach((o, i) => { const a = t * 1.5 + (i * Math.PI * 2) / 3; o.position.set(Math.cos(a) * rig.ring.r, Math.sin(a) * rig.ring.r, 0).applyEuler(e).add(c); });
      },
    };
  }
  const bronze = metal(0xc79a4e, 0.4), rivet = metal(0xf0d48a, 0.3);
  rig.bands.forEach(b => group.add(mesh(torus(b.r, 0.045, 48), bronze, b.pos, b.rot)));
  rig.guards.forEach(gd => {
    group.add(mesh(gd.round ? ball(1, 24, 16) : box(1, 1, 1), bronze, gd.pos, gd.rot ?? [0, 0, 0], gd.s));
    if (!gd.round) for (const sx of [-1, 1]) group.add(mesh(ball(0.035, 8, 6), rivet, [gd.pos[0] + sx * gd.s[0] * 0.38, gd.pos[1] + gd.s[1] * 0.5, gd.pos[2] + gd.s[2] * 0.3]));
  });
  return { group, handle: [0, rig.height + 0.05, 0], tick: () => {} };
}

export function buildMonster(d: Design): Monster {
  const rig = rigs[d.body];
  const parts = d.body === 'slime' ? slimeBody(d.process) : d.body === 'beast' ? beastBody(d.process) : golemBody(d.process);
  const a = attackOrgan(d, rig, parts.gel), f = defenseOrgan(d, rig);
  const root = new THREE.Group();
  root.add(parts.group, a.group, f.group);
  if (d.process === 'rapid') root.scale.setScalar(0.93);
  return {
    root, body: parts.group, attack: a.group, defense: f.group, height: rig.height,
    attackHandle: new THREE.Vector3(...a.handle), defenseHandle: new THREE.Vector3(...f.handle),
    tick: t => { parts.tick(t); a.tick(t); f.tick(t); },
    setAwake: open => parts.eyes.forEach(e => (e.scale.y = Math.max(0.08, open))),
  };
}
