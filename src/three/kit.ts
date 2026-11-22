import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

export type V3 = readonly [number, number, number];
export const std = (color: number, o: Partial<THREE.MeshStandardMaterialParameters> = {}) => new THREE.MeshStandardMaterial({ color, roughness: 0.7, metalness: 0.1, ...o });
export const metal = (color: number, roughness = 0.35) => std(color, { metalness: 0.85, roughness });
export const glow = (color: number, intensity = 2) => new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: intensity, roughness: 0.4 });
export function mesh(geo: THREE.BufferGeometry, mat: THREE.Material, pos: V3 = [0, 0, 0], rot: V3 = [0, 0, 0], scale: V3 | number = 1) {
  const m = new THREE.Mesh(geo, mat);
  m.position.set(...pos); m.rotation.set(...rot);
  if (typeof scale === 'number') m.scale.setScalar(scale); else m.scale.set(...scale);
  m.castShadow = true; m.receiveShadow = true;
  return m;
}
export const box = (w: number, h: number, d: number) => new THREE.BoxGeometry(w, h, d);
export const cyl = (rt: number, rb: number, h: number, seg = 24, open = false) => new THREE.CylinderGeometry(rt, rb, h, seg, 1, open);
export const ball = (r: number, w = 28, h = 20) => new THREE.SphereGeometry(r, w, h);
export const cone = (r: number, h: number, seg = 16) => new THREE.ConeGeometry(r, h, seg);
export const torus = (r: number, tube: number, seg = 48, arc = Math.PI * 2) => new THREE.TorusGeometry(r, tube, 12, seg, arc);

export const ease = (t: number) => { const x = Math.max(0, Math.min(1, t)); return x * x * (3 - 2 * x); };
export const clamp01 = (t: number) => Math.max(0, Math.min(1, t));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
/** 0..1 の進行のうち from〜to の区間を 0..1 に引き伸ばす。 */
export const span = (t: number, from: number, to: number) => clamp01((t - from) / (to - from));

/** 絵を描いて作るテクスチャ。 */
export function canvasTexture(size: number, draw: (g: CanvasRenderingContext2D, size: number) => void, repeat?: [number, number]) {
  const c = document.createElement('canvas'); c.width = c.height = size;
  const g = c.getContext('2d');
  if (g) draw(g, size);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8;
  if (repeat) { t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(...repeat); }
  return t;
}

/** 火花・泡などの小さな粒。寿命つきで使い回す。 */
export class Particles {
  readonly points: THREE.Points;
  private pos: Float32Array; private vel: Float32Array; private life: Float32Array; private next = 0;
  constructor(private count: number, color: number, size: number, private gravity = -6) {
    this.pos = new Float32Array(count * 3).fill(-999); this.vel = new Float32Array(count * 3); this.life = new Float32Array(count);
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(this.pos, 3));
    this.points = new THREE.Points(geo, new THREE.PointsMaterial({ color, size, transparent: true, opacity: 0.95, blending: THREE.AdditiveBlending, depthWrite: false }));
    this.points.frustumCulled = false;
  }
  burst(at: THREE.Vector3, n: number, speed: number, up = 0.6) {
    for (let k = 0; k < n; k++) {
      const i = this.next; this.next = (this.next + 1) % this.count;
      const a = Math.random() * Math.PI * 2, s = speed * (0.4 + Math.random() * 0.6);
      this.pos.set([at.x, at.y, at.z], i * 3);
      this.vel.set([Math.cos(a) * s, (Math.random() * 1.2 - 0.2 + up) * s, Math.sin(a) * s], i * 3);
      this.life[i] = 0.5 + Math.random() * 0.5;
    }
  }
  update(dt: number) {
    for (let i = 0; i < this.count; i++) {
      if (this.life[i] <= 0) continue;
      this.life[i] -= dt;
      if (this.life[i] <= 0) { this.pos[i * 3 + 1] = -999; continue; }
      this.vel[i * 3 + 1] += this.gravity * dt;
      for (let a = 0; a < 3; a++) this.pos[i * 3 + a] += this.vel[i * 3 + a] * dt;
    }
    this.points.geometry.attributes.position.needsUpdate = true;
  }
}

/** 描画ループ・リサイズ・後始末をまとめた3D舞台。 */
export class Stage {
  readonly scene = new THREE.Scene();
  readonly camera: THREE.PerspectiveCamera;
  readonly renderer: THREE.WebGLRenderer;
  /** dt は演出用（上限つき）、real は実時間の経過秒。 */
  onFrame: (dt: number, t: number, real: number) => void = () => {};
  private composer: EffectComposer; private bloom: UnrealBloomPass;
  private raf = 0; private last = 0; private time = 0; private observer: ResizeObserver; private disposed = false;
  constructor(private host: HTMLElement, o: { fov?: number; bloom?: number; background?: number } = {}) {
    this.renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    this.renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
    this.renderer.shadowMap.enabled = true; this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping; this.renderer.toneMappingExposure = 1.15;
    this.scene.background = new THREE.Color(o.background ?? 0x0b0714);
    // 金属の映り込み用の簡易環境光。
    const pmrem = new THREE.PMREMGenerator(this.renderer);
    this.scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture; this.scene.environmentIntensity = 0.32;
    pmrem.dispose();
    this.camera = new THREE.PerspectiveCamera(o.fov ?? 42, 1, 0.1, 200);
    this.composer = new EffectComposer(this.renderer);
    this.composer.addPass(new RenderPass(this.scene, this.camera));
    this.bloom = new UnrealBloomPass(new THREE.Vector2(256, 256), o.bloom ?? 0.55, 0.7, 0.82);
    this.composer.addPass(this.bloom);
    this.composer.addPass(new OutputPass());
    host.appendChild(this.renderer.domElement);
    this.observer = new ResizeObserver(() => this.resize());
    this.observer.observe(host);
    this.resize();
  }
  get bloomStrength() { return this.bloom.strength; }
  set bloomStrength(value: number) { this.bloom.strength = value; }
  private resize() {
    const w = Math.max(1, this.host.clientWidth), h = Math.max(1, this.host.clientHeight);
    this.renderer.setSize(w, h); this.composer.setSize(w, h);
    this.camera.aspect = w / h; this.camera.updateProjectionMatrix();
  }
  start() {
    const loop = (now: number) => {
      if (this.disposed) return;
      this.raf = requestAnimationFrame(loop);
      const real = Math.min(0.5, (now - (this.last || now)) / 1000), dt = Math.min(0.05, real);
      this.last = now; this.time += dt;
      this.onFrame(dt, this.time, real);
      this.composer.render();
    };
    this.raf = requestAnimationFrame(loop);
  }
  dispose() {
    this.disposed = true;
    cancelAnimationFrame(this.raf); this.observer.disconnect();
    this.scene.traverse(o => {
      const m = o as THREE.Mesh;
      m.geometry?.dispose();
      const mats = Array.isArray(m.material) ? m.material : m.material ? [m.material] : [];
      mats.forEach(mat => { Object.values(mat).forEach(v => { if (v instanceof THREE.Texture) v.dispose(); }); mat.dispose(); });
    });
    this.scene.environment?.dispose();
    this.composer.dispose(); this.renderer.dispose();
    this.renderer.domElement.remove();
  }
}

