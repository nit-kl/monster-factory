import * as THREE from 'three';
import { buildIllustratedMonster } from './illustratedMonster';
import { recipeFor, type Design } from '../domain/design';
import { materials, type MaterialId } from '../data/recipes';
import { ball, box, cone, glow, mesh, metal, std, torus } from './kit';

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

export function buildMonster(d: Design): Monster { return buildIllustratedMonster(recipeFor(d)!.id); }
