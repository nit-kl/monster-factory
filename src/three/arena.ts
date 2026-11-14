import * as THREE from 'three';
import type { EnemyId } from '../data/enemies';
import type { BattleEvent } from '../domain/battle';
import type { Design } from '../domain/design';
import { ball, box, canvasTexture, cone, cyl, glow, mesh, metal, Particles, Stage, std, torus } from './kit';
import { buildHero } from './heroes';
import { buildMonster, type Monster } from './monster';

type Tween = { t: number; dur: number; step: (p: number) => void; done?: () => void };
const MX = -2.4, EX = 2.4;

/** 模擬戦の3D舞台。計算済みの戦闘記録を1件ずつ受け取って演出する。 */
export class Arena {
  private stage: Stage; private monster: Monster; private hero: ReturnType<typeof buildHero>;
  private tweens: Tween[] = []; private shot: THREE.Mesh; private shotMat: THREE.MeshStandardMaterial;
  private sparks = new Particles(300, 0xffffff, 0.12); private shake = 0;
  constructor(host: HTMLElement, private design: Design, private enemy: EnemyId) {
    this.stage = new Stage(host, { bloom: 0.4, fov: 38, background: 0x0c0816 });
    const s = this.stage.scene;
    const tex = canvasTexture(512, (g, n) => {
      g.fillStyle = '#231c30'; g.fillRect(0, 0, n, n); g.strokeStyle = 'rgba(201,152,63,0.7)'; g.lineWidth = 6;
      for (const r of [236, 150]) { g.beginPath(); g.arc(n / 2, n / 2, r, 0, 7); g.stroke(); }
      g.lineWidth = 2; for (let i = 0; i < 12; i++) { const a = (i / 12) * Math.PI * 2; g.beginPath(); g.moveTo(n / 2 + Math.cos(a) * 150, n / 2 + Math.sin(a) * 150); g.lineTo(n / 2 + Math.cos(a) * 236, n / 2 + Math.sin(a) * 236); g.stroke(); }
    });
    const floor = mesh(new THREE.CircleGeometry(7.5, 64), std(0xffffff, { map: tex, roughness: 0.7 }), [0, 0, 0], [-Math.PI / 2, 0, 0]); floor.castShadow = false;
    const ground = mesh(new THREE.CircleGeometry(40, 48), std(0x120d1c, { roughness: 1 }), [0, -0.02, 0], [-Math.PI / 2, 0, 0]); ground.castShadow = false;
    s.add(floor, ground, mesh(torus(7.5, 0.12, 96), metal(0xc9983f), [0, 0.06, 0], [Math.PI / 2, 0, 0]));
    for (let i = 0; i < 9; i++) {
      const a = Math.PI + (i / 8) * Math.PI, x = Math.cos(a) * 8.6, z = Math.sin(a) * 8.6 - 0.5;
      s.add(mesh(cyl(0.45, 0.55, 5.4, 12), metal(0x2a2433, 0.7), [x, 2.7, z]), mesh(box(1.2, 0.3, 1.2), metal(0xc9983f), [x, 5.5, z]));
      if (i % 2 === 0) { s.add(mesh(cone(0.2, 0.5, 10), glow(0xffa64a, 1.3), [x * 0.95, 3.6, z * 0.95 + 0.4])); }
    }
    for (const x of [-5.5, 5.5]) { const l = new THREE.PointLight(0xffc8a0, 36, 18, 1.8); l.position.set(x, 4, -5); s.add(l); }
    const rim = new THREE.DirectionalLight(0x8a7cff, 1.4); rim.position.set(2, 5, -8); s.add(rim);
    s.add(new THREE.HemisphereLight(0x9c8cd8, 0x1a1020, 1.0));
    const key = new THREE.DirectionalLight(0xfff0e0, 2.0); key.position.set(-3, 9, 7); key.castShadow = true; key.shadow.mapSize.set(2048, 2048);
    Object.assign(key.shadow.camera, { left: -8, right: 8, top: 8, bottom: -4 }); s.add(key);
    this.monster = buildMonster(design); this.monster.setAwake(1);
    this.hero = buildHero(enemy); this.hero.root.scale.setScalar(1.3);
    this.shotMat = glow(0xffa64a, 3); this.shot = mesh(ball(0.2, 14, 10), this.shotMat); this.shot.visible = false; this.shot.castShadow = false;
    s.add(this.monster.root, this.hero.root, this.shot, this.sparks.points);
    this.reset();
    this.stage.camera.position.set(0, 2.7, 9.2);
    this.stage.onFrame = (dt, t) => {
      this.monster.tick(t); this.hero.tick(t); this.sparks.update(dt);
      this.tweens = this.tweens.filter(w => { w.t += dt; const p = Math.min(1, w.t / w.dur); w.step(p); if (p >= 1) w.done?.(); return p < 1; });
      this.shake = Math.max(0, this.shake - dt * 3);
      const cam = this.stage.camera;
      cam.position.set(Math.sin(t * 0.25) * 0.6 + (Math.random() - 0.5) * this.shake * 0.3, 2.7 + (Math.random() - 0.5) * this.shake * 0.3, 9.2);
      cam.lookAt(0, 1.15, 0);
    };
    this.stage.start();
  }
  reset() {
    this.tweens = []; this.shot.visible = false;
    this.monster.root.position.set(MX, 0, 0); this.monster.root.rotation.set(0, Math.PI / 2 - 0.25, 0);
    this.hero.root.position.set(EX, 0, 0); this.hero.root.rotation.set(0, -Math.PI / 2 + 0.25, 0);
  }
  private add(dur: number, step: (p: number) => void, done?: () => void) { this.tweens.push({ t: 0, dur, step, done }); }
  private hit(side: 'monster' | 'enemy', color: number, n = 26) {
    const root = side === 'monster' ? this.monster.root : this.hero.root, home = side === 'monster' ? MX : EX, dir = side === 'monster' ? -1 : 1;
    (this.sparks.points.material as THREE.PointsMaterial).color.setHex(color);
    this.sparks.burst(new THREE.Vector3(home, 1.0, 0.2), n, 3.6);
    this.shake = 0.5;
    this.add(0.28, p => { root.position.x = home + dir * Math.sin(p * Math.PI) * 0.35; });
  }
  private lunge(from: 'monster' | 'enemy', color: number) {
    const root = from === 'monster' ? this.monster.root : this.hero.root, home = from === 'monster' ? MX : EX, reach = from === 'monster' ? 3.0 : -3.0;
    let struck = false;
    this.add(0.46, p => {
      root.position.x = home + Math.sin(p * Math.PI) * reach; root.position.y = Math.sin(p * Math.PI) * 0.25;
      if (p > 0.5 && !struck) { struck = true; this.hit(from === 'monster' ? 'enemy' : 'monster', color); }
    }, () => { root.position.set(home, 0, 0); });
  }
  private fire(from: 'monster' | 'enemy', color: number, scale: V3) {
    const a = from === 'monster' ? MX + 0.8 : EX - 0.6, b = from === 'monster' ? EX : MX;
    this.shotMat.color.setHex(color); this.shotMat.emissive.setHex(color); this.shot.scale.set(...scale); this.shot.visible = true;
    this.add(0.3, p => { this.shot.position.set(a + (b - a) * p, 1.25 + Math.sin(p * Math.PI) * 0.4, 0.1); }, () => { this.shot.visible = false; this.hit(from === 'monster' ? 'enemy' : 'monster', color); });
  }
  play(e: BattleEvent) {
    if (e.actor === 'effects') {
      if (e.poison) this.hit('enemy', 0x8dff5c, 16);
      if (e.heal) { (this.sparks.points.material as THREE.PointsMaterial).color.setHex(0xff9adf); this.sparks.burst(new THREE.Vector3(MX, 0.6, 0.2), 22, 1.6, 1.6); }
      return;
    }
    if (e.actor === 'monster') {
      if (this.design.attack === 'claws') this.lunge('monster', 0xfff2d8);
      else this.fire('monster', this.design.attack === 'fire' ? 0xff8a2c : 0x8dff5c, [1.2, 1.2, 1.2]);
      if (e.selfBurn) this.add(0.12, () => {}, () => { (this.sparks.points.material as THREE.PointsMaterial).color.setHex(0xff5a1c); this.sparks.burst(new THREE.Vector3(MX, 1.1, 0.2), 34, 2.6, 1.2); this.shake = 0.35; });
      return;
    }
    if (this.enemy === 'swordsman') this.lunge('enemy', 0xdfe8ff);
    else if (this.enemy === 'archer') this.fire('enemy', 0xf0e0b0, [2.6, 0.18, 0.18]);
    else this.fire('enemy', 0x7fe6ff, [1.4, 0.9, 0.9]);
  }
  finish(outcome: 'win' | 'loss' | 'draw') {
    const loser = outcome === 'win' ? this.hero.root : outcome === 'loss' ? this.monster.root : null;
    const winner = outcome === 'win' ? this.monster.root : outcome === 'loss' ? this.hero.root : null;
    if (loser) this.add(0.7, p => { loser.rotation.z = (loser === this.hero.root ? -1 : 1) * p * 1.45; loser.position.y = -p * 0.1; });
    if (winner) this.add(1.2, p => { winner.position.y = Math.abs(Math.sin(p * Math.PI * 3)) * 0.35; });
  }
  dispose() { this.stage.dispose(); }
}
type V3 = [number, number, number];
