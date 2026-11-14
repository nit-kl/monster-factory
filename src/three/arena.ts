import * as THREE from 'three';
import type { EnemyId } from '../data/enemies';
import type { BattleEvent } from '../domain/battle';
import { recipeFor, type Design } from '../domain/design';
import { impactSound } from './sound';
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
  private effects: THREE.Mesh[] = [];
  private echoes: THREE.Group[] = [];
  private shock: THREE.Mesh;
  private attackTime = 0; private attackSpecial = false;
  paused = false; speed = 1;
  private reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
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
    if (recipeFor(design)!.id === 'prism') {
      for (let i = 0; i < 4; i++) {
        const echo = this.monster.root.clone(true);
        const mat = new THREE.MeshBasicMaterial({ color: 0xb7c4ff, transparent: true, opacity: 0.3, depthWrite: false, blending: THREE.AdditiveBlending });
        echo.traverse(o => { if (o instanceof THREE.Mesh) { o.material = mat; o.castShadow = false; } });
        echo.visible = false; s.add(echo); this.echoes.push(echo);
      }
    }
    this.hero = buildHero(enemy); this.hero.root.scale.setScalar(1.3);
    this.shotMat = glow(0xffa64a, 3); this.shot = mesh(ball(0.2, 14, 10), this.shotMat); this.shot.visible = false; this.shot.castShadow = false;
    this.shock = mesh(torus(1, 0.04), new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending }), [EX, 0.1, 0], [Math.PI / 2, 0, 0]); s.add(this.shock);
    for (let i = 0; i < 16; i++) {
      const geometry = recipeFor(design)!.id === 'bell' ? torus(0.7, 0.025) : new THREE.OctahedronGeometry(0.22);
      const fx = mesh(geometry, glow(0xffffff, 2)); fx.visible = false; fx.castShadow = false; this.effects.push(fx); s.add(fx);
    }
    s.add(this.monster.root, this.hero.root, this.shot, this.sparks.points);
    this.reset();
    this.stage.camera.position.set(0, 2.7, 9.2);
    this.stage.onFrame = (_dt, t, real) => {
      if (this.paused) return;
      // 戦闘ログと同じ実時間で進め、低FPSでも技の途中で次の攻撃に移らない。
      const dt = real * this.speed;
      this.attackTime = Math.max(0, this.attackTime - dt);
      this.monster.strike(this.attackTime > 0 ? 1 - this.attackTime / (this.attackSpecial ? 1.4 : 0.65) : 0, this.attackSpecial);
      this.monster.tick(t); this.hero.tick(t); this.sparks.update(dt);
      const active = this.tweens; this.tweens = [];
      active.forEach(w => { w.t += dt; const p = Math.min(1, w.t / w.dur); w.step(p); if (p >= 1) w.done?.(); else this.tweens.push(w); });
      this.shake = Math.max(0, this.shake - dt * 3);
      const cam = this.stage.camera;
      const zoom = this.attackSpecial && this.attackTime > 0 && !this.reduced ? Math.sin(Math.min(1, this.attackTime / 1.4) * Math.PI) * 0.9 : 0;
      const shake = this.reduced ? 0 : this.shake;
      cam.position.set(Math.sin(t * 0.25) * 0.6 + (Math.random() - 0.5) * shake * 0.3, 2.7 + (Math.random() - 0.5) * shake * 0.3, 9.2 - zoom);
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
      this.signature(e.special);
      return;
    }
    if (this.enemy === 'swordsman') this.lunge('enemy', 0xdfe8ff);
    else if (this.enemy === 'archer') this.fire('enemy', 0xf0e0b0, [2.6, 0.18, 0.18]);
    else this.fire('enemy', 0x7fe6ff, [1.4, 0.9, 0.9]);
  }
  private signature(special: boolean) {
    const r = recipeFor(this.design)!, color = new THREE.Color(r.color).getHex();
    this.attackSpecial = special; this.attackTime = special ? 1.4 : 0.65;
    impactSound(special, r.id === 'bell' ? 740 : r.id === 'furnace' ? 110 : 280);
    if (!special) {
      if (r.id === 'bloom' || r.id === 'prism' || r.id === 'thorn') this.lunge('monster', color);
      else this.fire('monster', color, r.id === 'furnace' ? [1.8, 1.8, 1.8] : [0.8, 1.6, 0.8]);
      return;
    }
    let struck = false;
    this.effects.forEach(o => { const mat = o.material as THREE.MeshStandardMaterial; mat.color.setHex(color); mat.emissive.setHex(color); o.visible = true; });
    this.add(1.4, p => {
      const release = Math.max(0, Math.min(1, (p - 0.28) / 0.42));
      this.echoes.forEach((echo, i) => {
        const a = i * Math.PI / 2 + Math.PI / 4;
        const distance = 3.5 * (1 - release);
        echo.position.set(EX + Math.cos(a) * distance, Math.sin(release * Math.PI) * 0.55, Math.sin(a) * distance);
        echo.rotation.y = -a - Math.PI / 2;
        echo.visible = p > 0.16 && p < 0.72;
      });
      this.effects.forEach((o, i) => {
        const a = i / 16 * Math.PI * 2;
        o.rotation.set(p * 5, a + p * 8, a);
        if (r.id === 'wraith') {
          o.scale.set(0.5, 2.2, 0.5);
          o.position.set(MX + (EX - MX) * release + Math.cos(a) * (1 - release) * 1.7, 1.2 + Math.sin(a) * (1 - release) * 1.6, Math.sin(a * 2) * (1 - release));
        } else if (r.id === 'furnace') {
          o.scale.set(2.8, 1.5 + Math.sin(a) * 0.3, 1.5);
          o.position.set(MX + 0.6 + i / 15 * (EX - MX) * release, 1.3 + Math.sin(a + p * 20) * 0.18, Math.cos(a + p * 20) * 0.18);
        } else if (r.id === 'bloom') {
          const rise = Math.sin(Math.max(0, Math.min(1, release * 1.5 - i / 32)) * Math.PI);
          o.scale.set(0.8, 1 + rise * 7, 0.8); o.position.set(EX + Math.cos(a) * 1.2, rise * 0.7, Math.sin(a) * 1.2);
          this.monster.root.position.x = MX + Math.sin(release * Math.PI) * 4.4;
        } else if (r.id === 'thorn') {
          o.scale.set(0.5, 1 + release * 7, 0.5); o.position.set(EX + Math.cos(a) * (1.8 - release), release * 0.7, Math.sin(a) * (1.8 - release)); o.rotation.z = -Math.cos(a) * 0.7;
        } else if (r.id === 'prism') {
          o.scale.set(0.45, 0.45, 3); o.position.set(EX + Math.cos(a) * (1 - release) * 3, 0.6 + i % 3 * 0.35, Math.sin(a) * (1 - release) * 3);
          this.monster.root.position.set(MX + Math.sin(release * Math.PI) * 4, Math.sin(release * Math.PI) * 0.7, 0);
        } else {
          const wave = Math.max(0, Math.min(1, release * 1.4 - i * 0.12));
          o.rotation.set(0, Math.PI / 2, 0); o.scale.setScalar(0.5 + wave * 1.8);
          o.position.set(MX + (EX - MX) * wave, 1.3, 0);
        }
        o.visible = p < 0.82 && (r.id !== 'bell' || i < 4);
      });
      if (p >= 0.64 && !struck) { struck = true; this.hit('enemy', color, 110); this.shake = 1; impactSound(true, 90); }
      const blast = Math.max(0, (p - 0.64) / 0.36);
      this.shock.scale.setScalar(0.3 + blast * 3.5); const mat = this.shock.material as THREE.MeshBasicMaterial; mat.color.setHex(color); mat.opacity = blast > 0 ? (1 - blast) * 0.8 : 0;
    }, () => { this.effects.forEach(o => o.visible = false); this.echoes.forEach(o => o.visible = false); this.monster.root.position.set(MX, 0, 0); (this.shock.material as THREE.MeshBasicMaterial).opacity = 0; });
  }
  finish(outcome: 'win' | 'loss' | 'draw') {
    this.reset(); this.effects.forEach(o => o.visible = false); this.echoes.forEach(o => o.visible = false); this.attackTime = 0; this.monster.strike(0, false); (this.shock.material as THREE.MeshBasicMaterial).opacity = 0;
    const loser = outcome === 'win' ? this.hero.root : outcome === 'loss' ? this.monster.root : null;
    const winner = outcome === 'win' ? this.monster.root : outcome === 'loss' ? this.hero.root : null;
    if (loser) this.add(0.7, p => { loser.rotation.z = (loser === this.hero.root ? -1 : 1) * p * 1.45; loser.position.y = -p * 0.1; });
    if (winner) this.add(1.2, p => { winner.position.y = Math.abs(Math.sin(p * Math.PI * 3)) * 0.35; });
  }
  dispose() { this.stage.dispose(); }
}
type V3 = [number, number, number];
