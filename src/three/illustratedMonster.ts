import * as THREE from 'three';
import { monsterArt } from '../data/monsterArt';
import type { RecipeId } from '../data/recipes';
import type { Monster } from './monster';

/** Camera-facing painted creature, grounded in the existing manufacturing/battle stage. */
export function buildIllustratedMonster(id: RecipeId): Monster {
  const height = { furnace: 2.8, wraith: 2.9, bloom: 2.25, thorn: 2.8, prism: 2.1, bell: 2.6 }[id];
  return buildPaintedActor(monsterArt[id], height, 1);
}


function buildPaintedActor(path: string, height: number, initialAspect: number): Monster {
  const root = new THREE.Group(), body = new THREE.Group(), attack = new THREE.Group(), defense = new THREE.Group();
  root.add(body, attack, defense);
  let disposed = false, aspect = initialAspect, awake = 1, action = 0, powerful = false;
  const texture = new THREE.TextureLoader().load(path, loaded => {
    if (disposed) { loaded.dispose(); return; }
    aspect = loaded.image.width / loaded.image.height;
    sprite.scale.set(height * aspect, height, 1);
  });
  texture.colorSpace = THREE.SRGBColorSpace;
  const material = new THREE.SpriteMaterial({ map: texture, transparent: true, depthWrite: false, toneMapped: false, fog: false });
  const sprite = new THREE.Sprite(material);
  sprite.center.set(0.5, 0);
  sprite.scale.set(height * aspect, height, 1);
  body.add(sprite);
  const shadowGeometry = new THREE.CircleGeometry(height * 0.3, 48);
  const shadowMaterial = new THREE.MeshBasicMaterial({ color: 0x090510, transparent: true, opacity: 0.22, depthWrite: false });
  const shadow = new THREE.Mesh(shadowGeometry, shadowMaterial);
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.y = 0.015;
  root.add(shadow);
  // A flat illustration slumps and fades on defeat; a full 3D roll would bury it
  // in the floor and turn its ground shadow into a vertical disc.
  sprite.onBeforeRender = () => {
    const fall = Math.min(1, Math.abs(root.rotation.z) / 1.45);
    material.rotation = root.rotation.z * 0.4;
    material.opacity = 1 - fall * 0.45;
    shadow.visible = fall < 0.1;
  };
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  return {
    root, body, attack, defense, height,
    attackHandle: new THREE.Vector3(0, 1.4, 0), defenseHandle: new THREE.Vector3(0, height, 0),
    setAwake: value => { awake = THREE.MathUtils.clamp(value, 0, 1); },
    strike: (progress, special) => { action = Math.sin(THREE.MathUtils.clamp(progress, 0, 1) * Math.PI); powerful = special; },
    tick: time => {
      const breath = reduced ? 0 : Math.sin(time * 1.7) * 0.006;
      const recoil = reduced ? 0 : action * (powerful ? 0.035 : 0.015);
      sprite.scale.set(height * aspect * (1 - breath + recoil), height * (1 + breath - recoil), 1);
      // Dark iron coalesces first; the painted furnace becomes visible at inspection.
      const light = 0.18 + awake * 0.82;
      material.color.setRGB(light, light * (1 - action * 0.12), light * (1 - action * 0.2));
    },
    dispose: () => { disposed = true; texture.dispose(); material.dispose(); shadowGeometry.dispose(); shadowMaterial.dispose(); root.removeFromParent(); },
  };
}
