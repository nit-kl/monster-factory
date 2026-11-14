import * as THREE from 'three';
import { recipeFor, type Design } from '../domain/design';
import { lineAt, totalDuration, type LineStage } from '../domain/manufacture';
import { ball, box, canvasTexture, cone, cyl, ease, glow, lerp, mesh, metal, Particles, span, Stage, std, torus } from './kit';
import { buildMonster, buildMaterial, disposeObject, type Monster } from './monster';

// 製造ラインの3D舞台。培養槽 → 器官接合機 → 検査門 → 出撃台。
// 時間表（domain/manufacture）の経過ミリ秒だけを見て、全体の状態を毎フレーム組み立てる。
const TANK = -7, GRAFT = 0, GATE = 5.6, PAD = 10.4, DECK = 0.36;
const BRASS = 0xc9983f, IRON = 0x2a2433, PURPLE = 0x4a2f7a;

type Arm = { carriage: THREE.Mesh; piston: THREE.Mesh; head: THREE.Group; railX: number; tray: THREE.Vector3 };

export class LineScene {
  readonly stage: Stage;
  speed = 1;
  onTick: (ms: number) => void = () => {};
  private ms = 0; private running = false; private idle = true; private snap = true; private lastStage: LineStage | 'idle' = 'idle';
  private design: Design | null = null; private monster: Monster | null = null;
  private samples = new THREE.Group();
  private cart = new THREE.Group(); private glass!: THREE.Mesh; private fluid!: THREE.Mesh; private fluidMat!: THREE.MeshStandardMaterial;
  private tankLight!: THREE.PointLight; private bubbles!: THREE.InstancedMesh; private bubbleSeed: number[] = [];
  private arms: Arm[] = []; private ring!: THREE.Mesh; private curtain!: THREE.Mesh; private lamps: THREE.MeshStandardMaterial[] = [];
  private padRing!: THREE.MeshStandardMaterial; private padLight!: THREE.SpotLight; private gears: THREE.Object3D[] = [];
  private sparks = new Particles(260, 0xffd27a, 0.09); private motes = new Particles(160, 0x9dffd0, 0.07, 1.2);
  private look = new THREE.Vector3(0, 2, 0); private lift = [0.4, 0.4]; private dummy = new THREE.Object3D();

  constructor(host: HTMLElement) {
    this.stage = new Stage(host, { bloom: 0.42 });
    this.buildHall(); this.buildTank(); this.buildGraft(); this.buildGate(); this.buildPad();
    this.stage.scene.add(this.cart, this.sparks.points, this.motes.points, this.samples);
    this.buildCart();
    this.stage.onFrame = (dt, t, real) => this.frame(dt, t, real);
    this.stage.start();
  }

  /** 待機表示。個体があれば出撃台に立たせる。 */
  showIdle(design: Design | null) {
    this.setMonster(design); this.idle = true; this.running = false; this.snap = true;
  }
  run(design: Design) {
    this.setMonster(design); this.idle = false; this.running = true; this.ms = 0; this.snap = true; this.lastStage = 'idle';
  }
  skip() { if (this.design) { this.ms = totalDuration(); this.snap = true; } }
  dispose() { this.stage.dispose(); }

  private setMonster(design: Design | null) {
    this.monster?.dispose();
    [...this.samples.children].forEach(disposeObject);
    if (design) [design.first, design.second].forEach(id => this.samples.add(buildMaterial(id)));
    this.design = design; this.monster = design ? buildMonster(design) : null;
    if (this.monster) {
      const m = this.monster;
      // 器官が置き台にめり込まないよう、持ち手から底までの高さを測っておく。
      this.lift = [0.4, 0.4];
      this.stage.scene.add(m.root);
    }
  }

  // ---- 建屋 ----
  private buildHall() {
    const s = this.stage.scene;
    const floorTex = canvasTexture(512, (g, n) => {
      g.fillStyle = '#1a1424'; g.fillRect(0, 0, n, n);
      for (let y = 0; y < 4; y++) for (let x = 0; x < 4; x++) {
        const v = 22 + ((x * 7 + y * 13) % 5) * 3; g.fillStyle = `rgb(${v + 6},${v},${v + 14})`; g.fillRect(x * 128 + 3, y * 128 + 3, 122, 122);
      }
      g.strokeStyle = 'rgba(201,152,63,0.5)'; g.lineWidth = 3; g.strokeRect(1, 1, n - 2, n - 2);
    }, [11, 5]);
    const floor = mesh(new THREE.PlaneGeometry(48, 22), std(0xffffff, { map: floorTex, roughness: 0.55, metalness: 0.25 }), [1.5, 0, 0], [-Math.PI / 2, 0, 0]);
    floor.castShadow = false; s.add(floor);
    const wallTex = canvasTexture(512, (g, n) => {
      g.fillStyle = '#231a33'; g.fillRect(0, 0, n, n);
      g.fillStyle = '#2c2140'; g.fillRect(12, 12, n - 24, n - 24);
      g.fillStyle = '#c9983f'; for (const [x, y] of [[26, 26], [n - 26, 26], [26, n - 26], [n - 26, n - 26]]) { g.beginPath(); g.arc(x, y, 7, 0, 7); g.fill(); }
      g.strokeStyle = 'rgba(0,0,0,0.5)'; g.lineWidth = 6; g.strokeRect(0, 0, n, n);
    }, [12, 3]);
    const wall = mesh(new THREE.PlaneGeometry(48, 11), std(0xffffff, { map: wallTex, roughness: 0.8 }), [1.5, 5.5, -6.2]);
    wall.castShadow = false; s.add(wall);
    const iron = metal(IRON, 0.6), brass = metal(BRASS, 0.35);
    for (let x = -21; x <= 24; x += 5.6) s.add(mesh(box(0.7, 11, 0.7), iron, [x, 5.5, -5.9]), mesh(box(0.9, 0.3, 0.9), brass, [x, 0.15, -5.9]), mesh(box(0.9, 0.3, 0.9), brass, [x, 7.8, -5.9]));
    for (const y of [6.3, 6.9]) s.add(mesh(cyl(0.16, 0.16, 46, 12), brass, [1.5, y, -5.6], [0, 0, Math.PI / 2]));
    s.add(mesh(cyl(0.3, 0.3, 46, 14), iron, [1.5, 1.1, -5.5], [0, 0, Math.PI / 2]));
    for (let x = -20; x <= 23; x += 4.3) s.add(mesh(torus(0.34, 0.07, 20), brass, [x, 1.1, -5.5], [0, Math.PI / 2, 0]));
    for (let x = -22; x <= 25; x += 5.6) s.add(mesh(box(0.5, 0.5, 15), iron, [x, 9.6, 0]));
    // 壁の歯車
    for (const [x, y, r] of [[-3.4, 4.6, 1.3], [-1.5, 3.6, 0.8], [8.2, 4.4, 1.1]] as const) {
      const g = new THREE.Group();
      g.add(mesh(cyl(r, r, 0.22, 28), brass, [0, 0, 0], [Math.PI / 2, 0, 0]), mesh(cyl(r * 0.3, r * 0.3, 0.34, 16), iron, [0, 0, 0], [Math.PI / 2, 0, 0]));
      for (let i = 0; i < 12; i++) { const a = (i / 12) * Math.PI * 2; g.add(mesh(box(r * 0.2, r * 0.24, 0.2), brass, [Math.cos(a) * r * 1.05, Math.sin(a) * r * 1.05, 0], [0, 0, a + Math.PI / 2])); }
      g.position.set(x, y, -5.85); s.add(g); this.gears.push(g);
    }
    // 魔王軍の旗
    const flag = canvasTexture(256, (g, n) => {
      g.fillStyle = '#3a1f66'; g.fillRect(0, 0, n, n); g.strokeStyle = '#c9983f'; g.lineWidth = 10; g.strokeRect(10, 10, n - 20, n - 20);
      g.fillStyle = '#e8c15a'; g.beginPath(); g.arc(n / 2, n * 0.52, 44, 0, 7); g.fill();
      for (const sx of [-1, 1]) { g.beginPath(); g.moveTo(n / 2 + sx * 30, n * 0.42); g.quadraticCurveTo(n / 2 + sx * 96, n * 0.3, n / 2 + sx * 70, n * 0.14); g.quadraticCurveTo(n / 2 + sx * 62, n * 0.3, n / 2 + sx * 14, n * 0.38); g.fill(); }
      g.fillStyle = '#3a1f66'; g.beginPath(); g.arc(n / 2 - 16, n * 0.5, 8, 0, 7); g.arc(n / 2 + 16, n * 0.5, 8, 0, 7); g.fill();
    });
    for (const x of [-11.2, 3.2, 13.6]) { const b = mesh(new THREE.PlaneGeometry(1.9, 3.2), std(0xffffff, { map: flag, roughness: 0.9 }), [x, 5.2, -5.5]); b.castShadow = false; s.add(b); }
    // 吊り照明
    for (const x of [-12, -3.5, 5, 13.5]) {
      s.add(mesh(cyl(0.02, 0.02, 2.4, 6), iron, [x, 8.2, 2.2]), mesh(cone(0.5, 0.36, 16), brass, [x, 7.1, 2.2]), mesh(ball(0.16, 12, 10), glow(0xffd9a0, 1.5), [x, 6.92, 2.2]));
      const l = new THREE.PointLight(0xffc98a, 46, 22, 1.8); l.position.set(x, 6.7, 2.2); s.add(l);
    }
    // 奥に並ぶ予備槽と資材
    for (const x of [-17.5, -14.6, 17, 19.6]) {
      s.add(mesh(cyl(1.0, 1.0, 3.6, 20), std(0x6a4aa8, { transparent: true, opacity: 0.3, roughness: 0.1, emissive: 0x4a2f8a, emissiveIntensity: 0.6 }), [x, 2.2, -4]), mesh(cyl(1.15, 1.2, 0.5, 20), iron, [x, 0.25, -4]), mesh(cyl(1.15, 1.1, 0.5, 20), brass, [x, 4.2, -4]));
    }
    for (const [x, z, k] of [[-13, 4.6, 1], [-12, 5.3, 0.8], [15.5, 4.8, 1], [16.6, 4.2, 0.7]] as const) s.add(mesh(box(1.1 * k, 1.1 * k, 1.1 * k), std(0x5a4030, { roughness: 0.95 }), [x, 0.55 * k, z], [0, x, 0]));
    // レール
    for (const z of [-0.62, 0.62]) s.add(mesh(box(26, 0.08, 0.1), brass, [1.5, 0.05, z]));
    for (let x = -11; x <= 14; x += 0.9) s.add(mesh(box(0.22, 0.04, 1.6), iron, [x, 0.02, 0]));
    s.add(new THREE.HemisphereLight(0x8a78c8, 0x1a1020, 0.9));
    const key = new THREE.DirectionalLight(0xdcd0ff, 1.5);
    key.position.set(-6, 14, 12); key.castShadow = true; key.shadow.mapSize.set(2048, 2048);
    Object.assign(key.shadow.camera, { left: -16, right: 18, top: 12, bottom: -10, near: 1, far: 40 }); key.shadow.bias = -0.0005;
    s.add(key);
  }

  private buildCart() {
    const brass = metal(BRASS, 0.35), iron = metal(IRON, 0.5);
    this.cart.add(mesh(cyl(1.25, 1.35, 0.2, 32), iron, [0, DECK - 0.1, 0]), mesh(torus(1.25, 0.05, 48), brass, [0, DECK, 0], [Math.PI / 2, 0, 0]), mesh(torus(0.8, 0.025, 48), glow(0xb58cff, 1.6), [0, DECK + 0.005, 0], [Math.PI / 2, 0, 0]));
    for (const x of [-0.8, 0.8]) for (const z of [-0.62, 0.62]) this.cart.add(mesh(cyl(0.14, 0.14, 0.1, 14), brass, [x, 0.14, z], [Math.PI / 2, 0, 0]));
  }

  private buildTank() {
    const s = this.stage.scene, brass = metal(BRASS, 0.35), iron = metal(IRON, 0.5);
    s.add(mesh(cyl(2.1, 2.3, 0.3, 36), iron, [TANK, 0.15, 0]), mesh(torus(2.05, 0.08, 48), brass, [TANK, 0.3, 0], [Math.PI / 2, 0, 0]));
    s.add(mesh(cyl(1.9, 1.9, 5.2, 36), iron, [TANK, 7.1, 0]), mesh(cyl(2.05, 1.9, 0.5, 36), brass, [TANK, 4.6, 0]), mesh(torus(1.95, 0.07, 48), brass, [TANK, 5.6, 0], [Math.PI / 2, 0, 0]));
    for (const z of [-2.2, 2.2]) s.add(mesh(cyl(0.16, 0.2, 4.5, 12), brass, [TANK - 1.2, 2.3, z * 0.82]), mesh(cyl(0.16, 0.2, 4.5, 12), brass, [TANK + 1.2, 2.3, z * 0.82]));
    for (const [dx, h] of [[-2.6, 3.2], [-3.1, 2.4]] as const) s.add(mesh(cyl(0.14, 0.14, h, 10), brass, [TANK + dx, h / 2, -1.2]), mesh(ball(0.2, 12, 10), brass, [TANK + dx, h, -1.2]));
    // 操作盤
    s.add(mesh(box(1.1, 1.2, 0.6), iron, [TANK + 2.9, 0.6, 1.6], [0, -0.5, 0]), mesh(box(0.9, 0.5, 0.06), glow(0x4ab8d0, 0.5), [TANK + 2.78, 1.05, 1.86], [-0.5, -0.5, 0]));
    this.glass = mesh(cyl(1.7, 1.7, 3.9, 40, true), new THREE.MeshPhysicalMaterial({ color: 0xbfe8ff, transparent: true, opacity: 0.16, roughness: 0.05, metalness: 0.1, side: THREE.DoubleSide, depthWrite: false }), [TANK, 2.35, 0]);
    this.glass.castShadow = false; this.glass.renderOrder = 5;
    this.fluidMat = new THREE.MeshStandardMaterial({ color: 0x9b6bff, emissive: 0x9b6bff, emissiveIntensity: 0.55, transparent: true, opacity: 0.34, roughness: 0.2, depthWrite: false });
    const geo = cyl(1.62, 1.62, 3.7, 40); geo.translate(0, 1.85, 0);
    this.fluid = mesh(geo, this.fluidMat, [TANK, 0.42, 0]); this.fluid.castShadow = false; this.fluid.renderOrder = 4;
    this.bubbles = new THREE.InstancedMesh(ball(0.06, 8, 6), new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.55 }), 56);
    this.bubbles.frustumCulled = false; this.bubbles.renderOrder = 3;
    for (let i = 0; i < 56; i++) this.bubbleSeed.push(Math.random(), Math.random(), Math.random(), Math.random());
    this.tankLight = new THREE.PointLight(0x9b6bff, 60, 12, 1.6); this.tankLight.position.set(TANK, 2.4, 0.4);
    s.add(this.bubbles, this.fluid, this.glass, this.tankLight);
  }

  private buildGraft() {
    const s = this.stage.scene, brass = metal(BRASS, 0.35), iron = metal(IRON, 0.5);
    s.add(mesh(box(5.4, 5.6, 1.6), iron, [GRAFT, 2.8, -4.2]), mesh(box(5.6, 0.3, 1.8), brass, [GRAFT, 5.6, -4.2]), mesh(box(5.6, 0.3, 1.8), brass, [GRAFT, 0.15, -4.2]));
    for (const x of [-1.9, 0, 1.9]) s.add(mesh(box(0.9, 0.5, 0.05), glow(x ? 0xd08a30 : 0x4ab8d0, 0.6), [GRAFT + x, 3.6, -3.38]));
    for (const x of [-2.2, 2.2]) s.add(mesh(cyl(0.2, 0.2, 2.2, 12), brass, [GRAFT + x, 6.8, -4.2]));
    [-1, 1].forEach(side => {
      const railX = GRAFT + side * 0.95, tray = new THREE.Vector3(GRAFT + side * 1.75, 1.22, -2.6);
      s.add(mesh(box(0.3, 0.3, 5.6), iron, [railX, 5.0, -1.2]), mesh(box(0.12, 0.08, 5.6), brass, [railX, 4.82, -1.2]));
      s.add(mesh(cyl(0.75, 0.9, 1.0, 20), iron, [tray.x, 0.5, tray.z]), mesh(cyl(0.8, 0.8, 0.08, 24), brass, [tray.x, 1.04, tray.z]), mesh(torus(0.55, 0.025, 32), glow(side < 0 ? 0xff9a4a : 0x7ad0ff, 1.8), [tray.x, 1.09, tray.z], [Math.PI / 2, 0, 0]));
      const carriage = mesh(box(0.6, 0.36, 0.7), brass, [railX, 4.66, -2.6]);
      const pg = cyl(0.07, 0.07, 1, 10); pg.translate(0, 0.5, 0);
      const piston = mesh(pg, metal(0xd8dce8, 0.2));
      const head = new THREE.Group();
      head.add(mesh(cyl(0.16, 0.12, 0.16, 12), iron, [0, 0.08, 0]), mesh(torus(0.17, 0.025, 20), glow(side < 0 ? 0xff9a4a : 0x7ad0ff, 2), [0, 0.02, 0], [Math.PI / 2, 0, 0]));
      for (let i = 0; i < 3; i++) { const a = (i / 3) * Math.PI * 2; head.add(mesh(box(0.05, 0.3, 0.05), brass, [Math.cos(a) * 0.17, -0.12, Math.sin(a) * 0.17], [Math.sin(a) * 0.35, 0, -Math.cos(a) * 0.35])); }
      s.add(carriage, piston, head);
      this.arms.push({ carriage, piston, head, railX, tray });
    });
  }

  private buildGate() {
    const s = this.stage.scene, brass = metal(BRASS, 0.35), iron = metal(IRON, 0.5);
    // 奥の柱から梁を張り出す。手前は低い発光柱だけにして、個体が隠れないようにする。
    s.add(mesh(box(0.6, 5.0, 0.6), iron, [GATE, 2.5, -2.6]), mesh(box(0.8, 0.3, 0.8), brass, [GATE, 0.15, -2.6]), mesh(box(0.14, 3.6, 0.06), glow(0x7dffb0, 1.2), [GATE, 2.3, -2.28]));
    s.add(mesh(box(0.5, 0.9, 0.5), iron, [GATE, 0.45, 2.6]), mesh(box(0.7, 0.16, 0.7), brass, [GATE, 0.92, 2.6]), mesh(ball(0.16, 12, 10), glow(0x7dffb0, 1.6), [GATE, 1.12, 2.6]));
    s.add(mesh(box(0.7, 0.5, 4.4), iron, [GATE, 4.85, -0.7]), mesh(box(0.8, 0.12, 4.6), brass, [GATE, 5.15, -0.7]), mesh(box(0.2, 0.2, 2.4), brass, [GATE, 4.0, -1.8], [0.75, 0, 0]));
    for (const z of [-0.8, 0, 0.8]) { const m = glow(0xffb347, 2); this.lamps.push(m); s.add(mesh(ball(0.15, 12, 10), m, [GATE + 0.38, 4.85, z])); }
    this.ring = mesh(torus(1.75, 0.04, 64), new THREE.MeshBasicMaterial({ color: 0x7dffb0, transparent: true, opacity: 0.9, blending: THREE.AdditiveBlending, depthWrite: false }), [GATE, 1, 0], [Math.PI / 2, 0, 0]);
    this.curtain = mesh(new THREE.PlaneGeometry(4.6, 4.2), new THREE.MeshBasicMaterial({ color: 0x7dffb0, transparent: true, opacity: 0.12, side: THREE.DoubleSide, blending: THREE.AdditiveBlending, depthWrite: false }), [GATE, 2.4, 0], [0, Math.PI / 2, 0]);
    this.ring.castShadow = this.curtain.castShadow = false; this.ring.visible = this.curtain.visible = false;
    s.add(this.ring, this.curtain);
  }

  private buildPad() {
    const s = this.stage.scene, brass = metal(BRASS, 0.35), iron = metal(IRON, 0.5);
    this.padRing = glow(0xffd27a, 1.2);
    s.add(mesh(cyl(2.3, 2.5, 0.16, 40), iron, [PAD, 0.08, 0]), mesh(torus(2.25, 0.06, 64), brass, [PAD, 0.17, 0], [Math.PI / 2, 0, 0]), mesh(torus(1.7, 0.035, 64), this.padRing, [PAD, 0.17, 0], [Math.PI / 2, 0, 0]));
    // 出撃門
    for (const z of [-2.6, 2.6]) s.add(mesh(box(0.8, 6.4, 0.8), iron, [PAD + 3.4, 3.2, z]), mesh(box(1.0, 0.4, 1.0), brass, [PAD + 3.4, 6.2, z]));
    s.add(mesh(box(1.0, 0.9, 6.2), iron, [PAD + 3.4, 6.85, 0]), mesh(box(0.2, 5.8, 4.4), std(PURPLE, { emissive: 0x2a1650, emissiveIntensity: 0.8, roughness: 0.6 }), [PAD + 3.6, 3.1, 0]));
    for (const z of [-1.1, 0, 1.1]) s.add(mesh(box(0.06, 5.6, 0.08), brass, [PAD + 3.48, 3.1, z]));
    this.padLight = new THREE.SpotLight(0xfff0d0, 0, 16, 0.5, 0.5, 1.2);
    this.padLight.position.set(PAD - 1.5, 9, 3); this.padLight.target.position.set(PAD, 0.8, 0); this.padLight.castShadow = true;
    s.add(this.padLight, this.padLight.target);
  }

  // ---- 毎フレーム ----
  private frame(dt: number, t: number, real: number) {
    if (this.running && this.design) {
      const total = totalDuration();
      this.ms = Math.min(total, this.ms + real * 1000 * this.speed); // 実時間で進め、描画が遅い環境でも所要時間を保つ
      this.onTick(this.ms);
      if (this.ms >= total) this.running = false;
    }
    this.gears.forEach((g, i) => (g.rotation.z += dt * (i % 2 ? -0.5 : 0.35)));
    this.sparks.update(dt); this.motes.update(dt);
    this.monster?.tick(t);
    if (this.idle || !this.design || !this.monster) this.applyIdle(real, t); else this.apply(dt, real, t);
    this.snap = false;
  }

  private setTank(level: number, lift: number, color: number, t: number, rate: number) {
    this.fluid.scale.y = Math.max(0.001, level); this.fluid.visible = level > 0.01;
    this.fluidMat.color.setHex(color); this.fluidMat.emissive.setHex(color);
    this.glass.position.y = 2.35 + lift * 3.7;
    this.tankLight.color.setHex(color); this.tankLight.intensity = 20 + level * 70 + Math.sin(t * 3) * 6 * level;
    const top = level * 3.7;
    for (let i = 0; i < 56; i++) {
      const [a, r, ph, sp] = this.bubbleSeed.slice(i * 4, i * 4 + 4);
      const y = ((ph + t * rate * (0.25 + sp * 0.35)) % 1) * 3.7, ang = a * Math.PI * 2 + t * 0.4;
      this.dummy.position.set(TANK + Math.cos(ang) * r * 1.45, 0.42 + y, Math.sin(ang) * r * 1.45);
      this.dummy.scale.setScalar(y < top - 0.05 ? 0.5 + sp : 0); this.dummy.updateMatrix();
      this.bubbles.setMatrixAt(i, this.dummy.matrix);
    }
    this.bubbles.instanceMatrix.needsUpdate = true;
  }

  private setArm(arm: Arm, target: THREE.Vector3 | null) {
    const rest = new THREE.Vector3(arm.railX, 3.9, -2.6), tip = target ?? rest;
    arm.carriage.position.set(arm.railX, 4.66, Math.max(-3.2, Math.min(1.2, tip.z)));
    const from = arm.carriage.position.clone().add(new THREE.Vector3(0, -0.18, 0)), dir = tip.clone().add(new THREE.Vector3(0, 0.16, 0)).sub(from);
    arm.piston.position.copy(from); arm.piston.scale.set(1, dir.length(), 1);
    arm.piston.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.clone().normalize());
    arm.head.position.copy(tip);
  }

  private camera(pos: THREE.Vector3, look: THREE.Vector3, dt: number) {
    const k = this.snap ? 1 : 1 - Math.exp(-dt * 2.6), cam = this.stage.camera;
    cam.position.lerp(pos, k); this.look.lerp(look, k); cam.lookAt(this.look);
  }

  private applyIdle(dt: number, t: number) {
    this.samples.visible = false;
    this.setTank(1, 0, 0x9b6bff, t, 0.5);
    this.arms.forEach(a => this.setArm(a, null));
    this.ring.visible = this.curtain.visible = false;
    this.lamps.forEach(m => { m.color.setHex(0x7dffb0); m.emissive.setHex(0x7dffb0); });
    this.cart.position.set(PAD, 0, 0);
    this.padRing.emissiveIntensity = 1.2 + Math.sin(t * 2) * 0.4; this.padLight.intensity = this.monster ? 70 : 0;
    const m = this.monster;
    if (m) {
      m.root.add(m.attack, m.defense); m.attack.position.set(0, 0, 0); m.defense.position.set(0, 0, 0); m.attack.scale.setScalar(1); m.defense.scale.setScalar(1);
      m.attack.visible = m.defense.visible = true;
      const k = 1;
      m.root.scale.setScalar(k); m.root.position.set(PAD, DECK, 0); m.root.rotation.y = 0.2 + Math.sin(t * 0.4) * 0.25; m.setAwake(1);
    }
    // 出撃台の個体を手前に、ライン全体を奥に収める。右側は格納庫の欄に隠れるので、被写体は中央より左に置く。
    const a = Math.sin(t * 0.11);
    this.camera(new THREE.Vector3(PAD + 2.4 + a * 0.9, 3.3 + a * 0.15, 9.8), new THREE.Vector3(PAD - 2, 1.5, 0), dt);
  }

  private apply(dt: number, real: number, t: number) {
    const d = this.design!, m = this.monster!, r = recipeFor(d)!;
    const { stage, index, local } = lineAt(this.ms), e = ease(local);
    const color = new THREE.Color(r.color).getHex();
    const entered = stage !== this.lastStage; this.lastStage = stage;
    const cartX = index <= 1 ? TANK : stage === 'toGraft' ? lerp(TANK, GRAFT, e) : index <= 4 ? GRAFT : stage === 'toInspect' ? lerp(GRAFT, GATE, e) : stage === 'inspect' ? GATE : stage === 'toPad' ? lerp(GATE, PAD, e) : PAD;
    this.cart.position.set(cartX, 0, 0);
    this.setTank(index === 0 ? 0.8 : index === 1 ? 0.8 * (1 - e) : 0, index === 1 ? e : index === 2 ? 1 : 0, color, t, 0.8);
    // 二材料が渦を巻き、融合してから身体が結晶化する。選択操作は不要。
    this.samples.visible = index < 4;
    this.samples.children.forEach((g, i) => {
      const phase = t * 1.8 + i * Math.PI, radius = index < 3 ? 1.05 : 1.05 * (1 - e);
      g.position.set(cartX + Math.cos(phase) * radius, 1.5 + Math.sin(phase * 1.6) * 0.22, Math.sin(phase) * radius);
      g.rotation.set(t * 0.3, t, 0); g.scale.setScalar(index === 3 ? 1 - e * 0.98 : 1);
    });
    const growth = index < 3 ? 0 : index === 3 ? e * 0.5 : index === 4 ? 0.5 + e * 0.5 : 1;
    m.root.visible = growth > 0.01;
    m.root.scale.setScalar(Math.max(0.01, growth));
    m.root.position.set(cartX, DECK, 0); m.root.rotation.y = index <= 4 ? t * 0.45 : stage === 'reveal' ? Math.sin(e * Math.PI) * 0.4 : 0;
    this.arms.forEach(a => this.setArm(a, index === 3 || index === 4 ? new THREE.Vector3(a.railX, 2.6, 0) : null));
    const forming = index === 3 || index === 4;
    this.ring.visible = forming || stage === 'inspect'; this.curtain.visible = stage === 'inspect';
    this.ring.position.set(cartX, 0.6 + (Math.sin(t * 3) * 0.5 + 0.5) * (m.height + 0.3), 0);
    (this.ring.material as THREE.MeshBasicMaterial).color.setHex(forming ? color : 0x7dffb0);
    this.curtain.position.x = GATE + Math.sin(t * 2) * 1.1;
    if (forming && Math.random() < dt * 18) {
      (this.motes.points.material as THREE.PointsMaterial).color.setHex(color);
      this.motes.burst(new THREE.Vector3(cartX, 1.1, 0), 7, 1.7, 0.4);
    }
    this.lamps.forEach(l => { const c = index > 6 ? 0x7dffb0 : 0xffb347; l.color.setHex(c); l.emissive.setHex(c); });
    m.setAwake(index >= 6 ? 1 : 0.08);
    m.strike(stage === 'reveal' ? local : 0, true);
    this.padLight.intensity = stage === 'reveal' ? 80 : 0;
    this.padRing.emissive.setHex(color);
    if (stage === 'reveal' && entered) { (this.sparks.points.material as THREE.PointsMaterial).color.setHex(color); this.sparks.burst(new THREE.Vector3(PAD, 0.5, 0), 100, 3, 1.2); }
    const distance = stage === 'reveal' ? 6.8 : 8;
    const a = stage === 'culture' ? -0.4 + local * 0.8 : stage === 'reveal' ? -0.65 + local * 0.9 : 0.3;
    this.camera(new THREE.Vector3(cartX + Math.sin(a) * distance, 2.7, Math.cos(a) * distance), new THREE.Vector3(cartX, 1.5, 0), real);
  }
}
