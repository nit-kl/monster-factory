import * as THREE from 'three';
import type { Design } from '../domain/design';
import { canvasTexture, cyl, glow, mesh, metal, Stage, std, torus } from './kit';
import { buildMonster, type Monster } from './monster';

/** 設計台の立体プレビュー。設計を変えるたびに作り直し、ドラッグで回せる。 */
export class Preview {
  private stage: Stage; private monster: Monster | null = null; private pivot = new THREE.Group();
  private angle = 0.5; private drag: number | null = null; private target = 1; private dist = 5.2;
  constructor(host: HTMLElement) {
    this.stage = new Stage(host, { bloom: 0.5, fov: 36, background: 0x0d0918 });
    const s = this.stage.scene;
    const grid = canvasTexture(512, (g, n) => {
      g.fillStyle = '#120c22'; g.fillRect(0, 0, n, n); g.strokeStyle = 'rgba(122,208,255,0.55)'; g.lineWidth = 1;
      for (let i = 0; i <= n; i += 32) { g.beginPath(); g.moveTo(i, 0); g.lineTo(i, n); g.moveTo(0, i); g.lineTo(n, i); g.stroke(); }
      g.lineWidth = 3; for (const r of [90, 170, 240]) { g.beginPath(); g.arc(n / 2, n / 2, r, 0, 7); g.stroke(); }
    });
    const floor = mesh(new THREE.CircleGeometry(7, 64), std(0xffffff, { map: grid, emissive: 0x2a5a8a, emissiveMap: grid, emissiveIntensity: 0.7, roughness: 0.6 }), [0, 0, 0], [-Math.PI / 2, 0, 0]);
    floor.castShadow = false;
    s.add(floor, mesh(cyl(1.5, 1.7, 0.24, 48), metal(0x2a2433, 0.5), [0, 0.12, 0]), mesh(torus(1.5, 0.05, 64), metal(0xc9983f), [0, 0.24, 0], [Math.PI / 2, 0, 0]), mesh(torus(1.1, 0.02, 64), glow(0x7ad0ff, 1.6), [0, 0.245, 0], [Math.PI / 2, 0, 0]));
    this.pivot.position.y = 0.24; s.add(this.pivot);
    s.add(new THREE.HemisphereLight(0xa898e0, 0x1a1020, 1.1));
    const key = new THREE.DirectionalLight(0xfff4e0, 2.2); key.position.set(3, 6, 5); key.castShadow = true; key.shadow.mapSize.set(1024, 1024);
    Object.assign(key.shadow.camera, { left: -3, right: 3, top: 4, bottom: -1 });
    const rim = new THREE.PointLight(0x9b6bff, 40, 12); rim.position.set(-3, 2.5, -3);
    s.add(key, rim);
    const el = this.stage.renderer.domElement;
    el.style.cursor = 'grab'; el.style.touchAction = 'none';
    el.addEventListener('pointerdown', e => { this.drag = e.clientX; el.setPointerCapture(e.pointerId); });
    el.addEventListener('pointermove', e => { if (this.drag !== null) { this.angle += (e.clientX - this.drag) * 0.012; this.drag = e.clientX; } });
    el.addEventListener('pointerup', () => { this.drag = null; });
    this.stage.onFrame = (dt, t) => {
      if (this.drag === null) this.angle += dt * 0.45;
      this.pivot.rotation.y = this.angle; this.monster?.tick(t);
      const cam = this.stage.camera, k = 1 - Math.exp(-dt * 4);
      cam.position.lerp(new THREE.Vector3(0, this.target + 0.9, this.dist), k); cam.lookAt(0, this.target, 0);
    };
    this.stage.camera.position.set(0, 2, 6);
    this.stage.start();
  }
  setDesign(d: Design) {
    if (this.monster) this.pivot.remove(this.monster.root);
    this.monster = buildMonster(d); this.monster.setAwake(1);
    this.pivot.add(this.monster.root);
    this.target = 0.1 + this.monster.height * 0.48; this.dist = 5.2 + this.monster.height * 1.7;
  }
  dispose() { this.stage.dispose(); }
}
