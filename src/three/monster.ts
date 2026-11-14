import * as THREE from 'three';
import { recipeFor, type Design } from '../domain/design';
import { materials, type MaterialId } from '../data/recipes';
import { ball, box, cone, cyl, glow, mesh, metal, std, torus, type V3 } from './kit';

export type Monster = { root: THREE.Group; body: THREE.Group; attack: THREE.Group; defense: THREE.Group; height: number; attackHandle: THREE.Vector3; defenseHandle: THREE.Vector3; tick: (t: number) => void; setAwake: (v: number) => void; strike: (p: number, special: boolean) => void; dispose: () => void };
export function disposeObject(root: THREE.Object3D) {
  root.traverse(o => { if (o instanceof THREE.Mesh) { o.geometry.dispose(); (Array.isArray(o.material) ? o.material : [o.material]).forEach(m => m.dispose()); } });
  root.removeFromParent();
}

/** レシピの素材を、槽の中でも識別できる立体として描く。 */
export function buildMaterial(id: MaterialId): THREE.Group {
  const g = new THREE.Group(), color = new THREE.Color(materials[id].color).getHex();
  if (id === 'iron') for (let i = 0; i < 5; i++) g.add(mesh(box(0.45, 0.12, 0.2), metal(color), [(i % 2 - 0.5) * 0.3, i * 0.13 - 0.3, 0], [i, i * 0.5, i * 0.7]));
  else if (id === 'seed') { g.add(mesh(new THREE.IcosahedronGeometry(0.3, 1), std(0x775334))); for (const x of [-1, 1]) g.add(mesh(ball(0.2), std(color), [x * 0.15, 0.35, 0], [0, 0, x * 0.6], [0.5, 1.4, 0.22])); }
  else if (id === 'glass') for (let i = 0; i < 3; i++) g.add(mesh(new THREE.OctahedronGeometry(0.4), std(color, { metalness: 0.5, roughness: 0.05 }), [(i - 1) * 0.22, 0, 0], [0, 0, (i - 1) * -0.35], [0.5, 1.4, 0.5]));
  else { g.add(mesh(ball(0.23), glow(color, 1.6))); g.add(mesh(torus(0.36, 0.025), glow(color), [0, 0, 0], [0.7, 0.3, 0])); if (id === 'ember') g.add(mesh(cone(0.2, 0.65), glow(0xffb35f), [0, 0.2, 0])); }
  return g;
}

/** 六つのレシピに固有のシルエット・可動部・大技の身体動作を与える。正面 +Z。 */
export function buildMonster(d: Design): Monster {
  const r = recipeFor(d)!;
  const root = new THREE.Group(), body = new THREE.Group(), attack = new THREE.Group(), defense = new THREE.Group();
  root.add(body, attack, defense);
  const color = new THREE.Color(r.color).getHex(), light = glow(color, 1.6), dark = metal(0x333c50, 0.38), gold = metal(0xba9053);
  const eyes: THREE.Object3D[] = [], moving: { object: THREE.Object3D; base: THREE.Vector3 }[] = [];
  const add = (geo: THREE.BufferGeometry, mat: THREE.Material, p: V3, s: V3 | number = 1, rot: V3 = [0, 0, 0]) => { const o = mesh(geo, mat, p, rot, s); body.add(o); return o; };
  const eye = (x: number, y: number, z: number, size = 0.07) => { const e = add(ball(size, 12, 8), light, [x, y, z]); eyes.push(e); };
  const mobile = (o: THREE.Object3D) => moving.push({ object: o, base: o.position.clone() });
  let height = 2.5;
  if (r.id === 'wraith') {
    // 分離した鎧の板。内部に身体はなく、霊火だけが浮遊する。
    add(new THREE.IcosahedronGeometry(0.28, 1), light, [0, 1.45, 0]);
    for (const x of [-1, 1]) {
      mobile(add(box(0.42, 0.65, 0.38), dark, [x * 0.3, 0.45, 0], 1, [0.1, 0, x * 0.08]));
      mobile(add(new THREE.OctahedronGeometry(0.42), dark, [x * 0.66, 1.8, 0], [1.1, 0.65, 1]));
      mobile(add(box(0.24, 0.58, 0.28), dark, [x * 0.83, 1.25, 0.12], 1, [0, 0, x * 0.15]));
      mobile(add(box(0.38, 0.75, 0.13), dark, [x * 0.25, 1.4, 0.36], 1, [0, x * -0.3, x * 0.1]));
    }
    mobile(add(cone(0.34, 0.65, 6), dark, [0, 2.17, 0], [1, 1, 1.2]));
    for (const x of [-0.12, 0.12]) eye(x, 2.12, 0.3);
    add(torus(0.38, 0.025), light, [0, 1.4, 0], 1, [Math.PI / 2, 0, 0]);
  } else if (r.id === 'furnace') {
    height = 2.6;
    add(box(1.35, 1.25, 0.85), dark, [0, 1.3, 0]);
    add(cyl(0.42, 0.42, 0.13, 24), glow(0xff761b, 2.4), [0, 1.3, 0.5], 1, [Math.PI / 2, 0, 0]);
    add(torus(0.43, 0.09), gold, [0, 1.3, 0.57]);
    for (const x of [-1, 1]) {
      add(box(0.48, 0.6, 0.6), dark, [x * 0.37, 0.3, 0.05]);
      mobile(add(box(0.52, 0.95, 0.6), dark, [x * 1.0, 1.2, 0]));
      add(cone(0.23, 0.42, 6), gold, [x * 0.85, 1.95, 0]);
      add(cyl(0.14, 0.19, 0.8), dark, [x * 0.45, 2.05, -0.3]);
      mobile(add(cone(0.16, 0.6, 10), light, [x * 0.45, 2.5, -0.3]));
    }
    add(box(0.6, 0.4, 0.5), gold, [0, 2.1, 0.1]);
    for (const x of [-0.15, 0.15]) eye(x, 2.12, 0.38);
  } else if (r.id === 'bloom' || r.id === 'prism') {
    height = 1.9;
    const prism = r.id === 'prism', skin = prism ? std(0xaccfff, { metalness: 0.6, roughness: 0.08, flatShading: true }) : std(0x465839, { roughness: 0.85 });
    add(new THREE.IcosahedronGeometry(0.7, 1), skin, [0, 0.85, 0], [0.62, 0.75, 1.4]);
    add(new THREE.OctahedronGeometry(0.46), skin, [0, 1.25, 0.86], [0.9, 0.85, 1.5]);
    add(cone(0.2, 0.5, 4), skin, [0, 1.12, 1.3], 1, [Math.PI / 2, 0, 0]);
    for (const x of [-1, 1]) {
      for (const z of [-0.55, 0.5]) mobile(add(cone(0.18, 0.75, 5), skin, [x * 0.35, 0.35, z], 1, [0.2, 0, x * -0.1]));
      add(cone(0.12, 0.4, 4), prism ? skin : gold, [x * 0.23, 1.65, 0.78], 1, [-0.3, 0, x * -0.35]);
      eye(x * 0.2, 1.3, 1.13, 0.06);
      for (let i = 0; i < 4; i++) mobile(add(prism ? new THREE.OctahedronGeometry(0.4) : ball(0.4, 16, 12), prism ? skin : std(i % 2 ? 0xff964f : 0xcb365b, { emissive: 0x8d1829, emissiveIntensity: 0.5 }), [x * (0.38 + i * 0.11), 1.05 + i * 0.12, 0.05 - i * 0.25], [0.18, 1.5, 0.65], [0.2, 0, x * -0.8]));
    }
    for (let i = 0; i < 5; i++) mobile(add(cone(0.16 - i * 0.02, 0.5, 5), prism ? light : gold, [0, 0.9 + i * 0.12, -0.8 - i * 0.18], 1, [-1.8, 0, 0]));
  } else if (r.id === 'thorn') {
    height = 2.7;
    const bark = std(0x61513c, { roughness: 1, flatShading: true });
    add(cyl(0.32, 0.7, 1.7, 7), bark, [0, 1.1, 0]);
    add(new THREE.DodecahedronGeometry(0.45), bark, [0, 2.05, 0]);
    for (const x of [-1, 1]) {
      eye(x * 0.14, 2.1, 0.4);
      mobile(add(cone(0.18, 1.3, 5), bark, [x * 0.75, 1.6, 0], 1, [0, 0, x * -0.9]));
      for (let i = 0; i < 3; i++) add(cone(0.09, 0.7, 4), bark, [x * (0.4 + i * 0.15), 2.2 + i * 0.1, -0.1], 1, [0.3, 0, x * -0.6]);
    }
    for (let i = 0; i < 7; i++) { const a = i * Math.PI * 2 / 7; mobile(add(cone(0.2, 1.2, 5), bark, [Math.cos(a) * 0.5, 0.25, Math.sin(a) * 0.5], 1, [Math.sin(a) * 1.1, 0, -Math.cos(a) * 1.1])); }
    add(new THREE.IcosahedronGeometry(0.22), light, [0, 1.2, 0.51]);
  } else {
    height = 2.4;
    const glass = new THREE.MeshPhysicalMaterial({ color: 0x91bddd, metalness: 0.25, roughness: 0.07, transparent: true, opacity: 0.65, side: THREE.DoubleSide });
    add(new THREE.SphereGeometry(0.9, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2), glass, [0, 1.55, 0], [1, 0.8, 1]);
    add(torus(0.89, 0.04), light, [0, 1.55, 0], 1, [Math.PI / 2, 0, 0]);
    add(new THREE.IcosahedronGeometry(0.25, 1), light, [0, 1.65, 0]);
    for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4; const pts = [0, 1, 2, 3].map(j => new THREE.Vector3(Math.cos(a + j * 0.12) * (0.6 + j * 0.07), 1.55 - j * 0.36, Math.sin(a + j * 0.12) * (0.6 + j * 0.07))); mobile(add(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 12, 0.035, 6, false), light, [0, 0, 0])); }
    for (const x of [-0.2, 0.2]) eye(x, 1.8, 0.65);
  }
  let action = 0, powerful = false;
  return { root, body, attack, defense, height, attackHandle: new THREE.Vector3(0, 1.5, 0), defenseHandle: new THREE.Vector3(0, height, 0),
    setAwake: v => eyes.forEach(e => e.scale.setScalar(Math.max(0.08, v))),
    strike: (p, special) => { action = Math.sin(p * Math.PI); powerful = special; },
    tick: t => {
      light.emissiveIntensity = 1.4 + Math.sin(t * 3) * 0.3 + action * 1.2;
      body.position.y = ['wraith', 'bell'].includes(r.id) ? Math.sin(t * 2) * 0.1 + 0.1 : Math.sin(t * 2.4) * 0.025;
      moving.forEach(({ object, base }, i) => {
        object.position.copy(base);
        if (r.id === 'wraith') { object.position.multiplyScalar(1 + action * (powerful ? 1.2 : 0.12)); object.position.y += Math.sin(t * 2 + i) * 0.04; object.rotation.y = action * (powerful ? 3 : 0.2); }
        else if (r.id === 'bell') object.rotation.y = Math.sin(t * 1.8 + i) * 0.12 + action * 0.5;
        else if (r.id === 'bloom' || r.id === 'prism') object.position.y += Math.sin(t * 3 + i) * 0.04 + action * 0.12;
        else object.rotation.z = Math.sin(t * 1.5 + i) * 0.025 + (i % 2 ? 1 : -1) * action * 0.22;
      });
    }, dispose: () => disposeObject(root),
  };
}
