import * as THREE from 'three';
import type { EnemyId } from '../data/enemies';
import { ball, box, cone, cyl, glow, mesh, metal, std, torus } from './kit';

// 勇者軍の兵士（仮の手続き型モデル）。正面は +Z。
export function buildHero(kind: EnemyId): { root: THREE.Group; height: number; tick: (t: number) => void } {
  const root = new THREE.Group(), skin = std(0xf0c8a0), boots = std(0x3a2a22);
  for (const x of [-0.14, 0.14]) root.add(mesh(cyl(0.1, 0.12, 0.72, 10), boots, [x, 0.36, 0]));
  root.add(mesh(ball(0.19, 18, 14), skin, [0, 1.54, 0]));
  let tick: (t: number) => void = () => {};
  if (kind === 'swordsman') {
    const steel = metal(0xb4bed2, 0.3), blue = std(0x2f4fa8), gold = metal(0xe8c15a, 0.3);
    root.add(mesh(cyl(0.24, 0.28, 0.66, 14), steel, [0, 1.02, 0]));
    for (const x of [-1, 1]) root.add(mesh(ball(0.14, 12, 10), steel, [x * 0.32, 1.28, 0]), mesh(cyl(0.07, 0.07, 0.5, 8), steel, [x * 0.36, 1.0, 0.06], [0.3, 0, 0]));
    root.add(mesh(new THREE.SphereGeometry(0.22, 18, 12, 0, Math.PI * 2, 0, Math.PI * 0.6), steel, [0, 1.56, 0]), mesh(box(0.3, 0.05, 0.1), metal(0x30364a), [0, 1.55, 0.18]), mesh(cone(0.05, 0.3, 8), std(0xc8323c), [0, 1.86, -0.04]));
    root.add(mesh(box(0.5, 0.86, 0.04), blue, [0, 0.95, -0.24], [0.12, 0, 0]));
    root.add(mesh(cyl(0.36, 0.36, 0.06, 24), blue, [-0.44, 1.02, 0.24], [Math.PI / 2, 0, 0]), mesh(ball(0.09, 12, 10), gold, [-0.44, 1.02, 0.28]), mesh(torus(0.35, 0.03, 32), gold, [-0.44, 1.02, 0.26]));
    const sword = new THREE.Group();
    sword.add(mesh(box(0.07, 0.95, 0.02), metal(0xe6ecf8, 0.15), [0, 0.6, 0]), mesh(box(0.28, 0.05, 0.06), gold, [0, 0.12, 0]), mesh(cyl(0.03, 0.03, 0.2, 8), boots, [0, 0, 0]));
    sword.position.set(0.42, 0.86, 0.3); sword.rotation.set(0.5, 0, -0.15); root.add(sword);
    tick = t => { sword.rotation.x = 0.5 + Math.sin(t * 2) * 0.06; };
  } else if (kind === 'archer') {
    const green = std(0x4c7a4a, { roughness: 0.9 }), leather = std(0x7a5636, { roughness: 0.9 });
    root.add(mesh(cyl(0.21, 0.25, 0.66, 14), leather, [0, 1.02, 0]), mesh(cone(0.27, 0.42, 14), green, [0, 1.74, -0.03]), mesh(cone(0.44, 0.9, 14, ), green, [0, 1.0, -0.16], [0.16, 0, 0]));
    for (const x of [-1, 1]) root.add(mesh(cyl(0.065, 0.065, 0.5, 8), green, [x * 0.33, 1.02, 0.1], [0.5, 0, 0]));
    const bow = new THREE.Group();
    bow.add(mesh(torus(0.56, 0.025, 32, Math.PI), std(0x5a3a22), [0, 0, 0], [0, 0, -Math.PI / 2]), mesh(cyl(0.006, 0.006, 1.12, 4), std(0xeeeeee), [0, 0, 0]));
    bow.position.set(-0.4, 1.1, 0.34); bow.rotation.set(0, Math.PI / 2, 0); root.add(bow);
    root.add(mesh(cyl(0.09, 0.08, 0.5, 10), leather, [0.16, 1.2, -0.3], [0.3, 0, -0.3]));
    for (let i = 0; i < 3; i++) root.add(mesh(cone(0.03, 0.1, 6), std(0xc8323c), [0.2 + i * 0.04, 1.5, -0.4 + i * 0.03]));
    tick = t => { bow.rotation.z = Math.sin(t * 1.5) * 0.05; };
  } else {
    const robe = std(0x35469c, { roughness: 0.85 }), trim = metal(0xe8c15a, 0.3), orbMat = glow(0x7fe6ff, 2.6);
    root.add(mesh(cone(0.46, 1.36, 18), robe, [0, 0.72, 0]), mesh(cyl(0.2, 0.24, 0.4, 14), robe, [0, 1.2, 0]), mesh(torus(0.24, 0.03, 24), trim, [0, 1.36, 0], [Math.PI / 2, 0, 0]));
    for (const x of [-1, 1]) root.add(mesh(cone(0.12, 0.56, 10), robe, [x * 0.32, 1.06, 0.1], [0.5, 0, x * 0.25]));
    root.add(mesh(cyl(0.44, 0.44, 0.03, 24), robe, [0, 1.7, 0]), mesh(cone(0.26, 0.62, 16), robe, [0, 2.0, -0.02], [-0.12, 0, 0]), mesh(torus(0.25, 0.025, 24), trim, [0, 1.73, 0], [Math.PI / 2, 0, 0]));
    const orb = mesh(ball(0.12, 16, 12), orbMat, [0.42, 1.92, 0.24]);
    root.add(mesh(cyl(0.028, 0.028, 1.8, 8), std(0x5a3a22), [0.42, 0.92, 0.24]), mesh(torus(0.15, 0.02, 20), trim, [0.42, 1.92, 0.24]), orb);
    tick = t => { orbMat.emissiveIntensity = 2.2 + Math.sin(t * 3) * 0.8; orb.position.y = 1.92 + Math.sin(t * 2) * 0.02; };
  }
  return { root, height: kind === 'mage' ? 2.3 : 1.9, tick };
}
