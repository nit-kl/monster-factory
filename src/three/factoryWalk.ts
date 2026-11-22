import { cast, type StaffId } from '../data/cast';
import { buildIronworks } from './ironworks';
import * as THREE from 'three';
import { ball, box, cone, cyl, glow, mesh, metal, std, type Stage } from './kit';

export const stops = { bench: -12, tank: -7, hangar: 10.4 };
export const crewPosts: Record<StaffId, readonly [number,number]> = {
  lisette:[1,20], vargas:[-14,17], orphen:[-12,-10], poyon:[-7,6], pluru:[11,6],
  mimi:[18,-10], arachnea:[-37,-32], gradius:[55,-53], vera:[31,-28], noah:[-55,-51]
};
const destinations = {
  bench:[stops.bench,3], tank:[stops.tank,3], hangar:[stops.hangar,3],
  mainHall:[0,5], forecourt:[0,16], west:[-65,-67], east:[65,-67], workshop:[-14,17], ...crewPosts
} satisfies Record<string,readonly [number,number]>;
export type Stop = keyof typeof destinations;

export class FactoryWalk {
  private walker = new THREE.Group();
  private furnishings = new THREE.Group();
  private target = new THREE.Vector3();
  private keys = new Set<string>();
  private active = false;
  private near: Stop | null = null;
  inspect = false;
  talking = false;
  private staff: readonly StaffId[] = [];
  private crew = new Map<StaffId,THREE.Sprite>();
  setStaff(ids: readonly StaffId[]) {
    this.staff=ids;
    for(const id of ids){
      if(this.crew.has(id)) continue;
      const [x,z]=crewPosts[id], info=cast[id];
      const texture=new THREE.TextureLoader().load(info.image!, loaded=>{
        const {width,height}=loaded.image;
        sprite.scale.x=sprite.scale.y*width/height;
      });
      texture.colorSpace=THREE.SRGBColorSpace;
      const sprite=new THREE.Sprite(new THREE.SpriteMaterial({map:texture,alphaTest:0.12}));
      sprite.scale.set(1.6,info.wide?1.7:2.3,1);sprite.center.set(0.5,0);
      sprite.position.set(x,0.04,z-1.35);
      this.furnishings.add(sprite);this.crew.set(id,sprite);
    }
    this.crew.forEach((sprite,id)=>{sprite.visible=ids.includes(id);});
  }
  onNear: (stop: Stop | null) => void = () => {};
  onLocation: (indoors:boolean)=>void = ()=>{};
  private indoors: boolean|null=null;
  private followPath=false;
  private arrivalFacing=false;
  turn(angle:number){
    if(this.talking || this.inspect) return;
    this.followPath=false;this.arrivalFacing=false;this.yaw+=angle;
    this.pitch=0;
  }

  private works?: ReturnType<typeof buildIronworks>;
  private route: THREE.Vector3[] = [];
  private time = 0;
  private yaw = 0;
  private pitch = 0.08;
  private pointer: { x: number; y: number; dragged: boolean } | null = null;
  private previousBloom = 0;
  private previousFog: THREE.Scene['fog'] = null;
  private previousSky: THREE.Scene['background'] = null;
  constructor(private stage: Stage, private hall: THREE.Group) {
    const brass = metal(0xd69c50), cloak = std(0x7451aa);
    this.walker.add(mesh(cone(0.42, 1, 12), cloak, [0, 0.55, 0]), mesh(ball(0.28), std(0xe4c8aa), [0, 1.23, 0]),
      mesh(cone(0.37, 0.54), cloak, [0, 1.58, 0]), mesh(ball(0.11), glow(0xffdf83), [0.39, 0.83, 0]));
    this.furnishings.add(mesh(box(2.8, 0.22, 1.5), brass, [stops.bench, 1, 0]));
    for (const dx of [-1, 1]) {
      this.furnishings.add(mesh(box(0.28, 1, 1), brass, [stops.bench + dx, 0.5, 0]),
        mesh(ball(0.27), glow(dx < 0 ? 0x68cbbb : 0xd789c6), [stops.bench + dx * 0.65, 1.35, 0]));
    }
    for (const dx of [-2, 0, 2]) this.furnishings.add(mesh(cyl(0.08, 0.12, 1), brass, [stops.hangar + dx, 0.5, 1.8]));
    this.furnishings.add(mesh(box(4.2, 0.08, 0.09), brass, [stops.hangar, 0.83, 1.8]));
    this.walker.position.set(0, 0, 48);
    this.target.copy(this.walker.position);
    stage.scene.add(this.walker, this.furnishings);
    this.walker.visible = this.furnishings.visible = false;
  }

  enable(value: boolean) {
    if (value === this.active) return;
    const scene = this.stage.scene;
    if (value) {
      if (!this.works) {
        this.works = buildIronworks();
        scene.add(this.works.site);
      }
      this.previousBloom = this.stage.bloomStrength;
      this.previousFog = scene.fog;
      this.previousSky = scene.background;
      scene.fog = new THREE.FogExp2(0x63483e, 0.012);
      scene.background = new THREE.Color(0x302c34);
    } else {
      this.stage.bloomStrength = this.previousBloom;
      scene.fog = this.previousFog;
      scene.background = this.previousSky;
    }
    this.works!.site.visible = value;
    this.hall.visible = !value;
    scene.children.forEach(child => { if (child instanceof THREE.Light) child.visible = !value; });
    this.route = [];
    this.indoors=null;this.followPath=false;this.arrivalFacing=false;
    this.pointer = null;
    this.active = this.walker.visible = this.furnishings.visible = value;
    this.inspect = false;
    this.near = null;
    this.talking = false;
    this.keys.clear();
    this.target.copy(this.walker.position);
    const method = value ? 'addEventListener' : 'removeEventListener';
    window[method]('keydown', this.key);
    window[method]('keyup', this.key);
    window[method]('blur', this.blur);
    const canvas = this.stage.renderer.domElement;
    canvas.style.touchAction = value ? 'none' : '';
    canvas[method]('pointerdown', this.press);
    canvas[method]('pointermove', this.drag);
    canvas[method]('pointerup', this.release);
    canvas[method]('pointercancel', this.cancel);
  }
  private blur = () => this.keys.clear();
  private key = (event: Event) => {
    const e = event as KeyboardEvent;
    if (e.target instanceof HTMLSelectElement || this.talking || !['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','KeyA','KeyD','KeyW','KeyS','KeyQ','KeyE'].includes(e.code) || e.ctrlKey || e.metaKey || e.altKey) return;
    e.preventDefault();
    if (e.type === 'keydown') this.keys.add(e.code);
    else this.keys.delete(e.code);
  };
  private press = (event: Event) => {
    const e = event as PointerEvent;
    if (this.talking || !e.isPrimary || e.button !== 0) return;
    this.pointer = { x:e.clientX, y:e.clientY, dragged:false };
    this.stage.renderer.domElement.setPointerCapture(e.pointerId);
  };
  private cancel = () => { this.pointer = null; };
  private drag = (event: Event) => {
    const e = event as PointerEvent, start = this.pointer;
    if (!start || !e.isPrimary || this.inspect) return;
    const dx=e.clientX-start.x, dy=e.clientY-start.y;
    if (!start.dragged && Math.hypot(dx,dy)<4) return;
    start.dragged=true; start.x=e.clientX; start.y=e.clientY;
    this.followPath=false;this.arrivalFacing=false;
    this.yaw -= dx*0.007;
    this.pitch = THREE.MathUtils.clamp(this.pitch+dy*0.005,-0.55,0.85);
  };
  private release = (event: Event) => {
    if (this.pointer && !this.pointer.dragged) this.tap(event);
    this.pointer=null;
  };
  private tap = (event: Event) => {
    if (this.inspect || this.talking) return;
    const e = event as PointerEvent, bounds = this.stage.renderer.domElement.getBoundingClientRect();
    const ray = new THREE.Raycaster();
    ray.setFromCamera(new THREE.Vector2((e.clientX - bounds.left) / bounds.width * 2 - 1, 1 - (e.clientY - bounds.top) / bounds.height * 2), this.stage.camera);
    const ramp = ray.ray.intersectPlane(new THREE.Plane(new THREE.Vector3(0,1,-0.34), 26*0.34),new THREE.Vector3());
    const point = ramp && ramp.z>26 && ramp.z<=49 && Math.abs(ramp.x)<=2.8 ? ramp :
      ray.ray.intersectPlane(new THREE.Plane(new THREE.Vector3(0,1,0), 0), new THREE.Vector3());
    if (point && this.walkable(point.x,point.z)) this.navigate(point);
  };
  private walkable(x:number,z:number) {
    return this.works?.paths.open(x,z) ?? false;
  }
  private navigate(goal:THREE.Vector3) {
    const p=this.walker.position;
    const path=this.works?.paths.route(p.x,p.z,goal.x,goal.z);
    if(!path?.length) return;
    this.followPath=true;this.arrivalFacing=false;
    this.route=path.map(point=>new THREE.Vector3(point.x,0,point.z));
    this.target.copy(this.route.shift()!);
  }
  visit(stop: Stop) {
    this.inspect=false; this.pitch=0;
    const [x,z]=destinations[stop]; this.navigate(new THREE.Vector3(x,0,z));
    this.arrivalFacing=this.staff.includes(stop as StaffId) || stop in stops;
  }

  camera(dt: number) {
    if (!this.active) return false;
    this.time += dt;
    const p = this.walker.position;
    const down = (a: string, b: string) => Number(this.keys.has(a) || this.keys.has(b));
    const direction = new THREE.Vector3(down('KeyD','ArrowRight') - down('KeyA','ArrowLeft'), 0, down('KeyS','ArrowDown') - down('KeyW','ArrowUp'));
    if (!this.inspect && !this.talking) {
      const rotation=Number(this.keys.has('KeyQ'))-Number(this.keys.has('KeyE'));
      if(rotation) this.turn(rotation*Math.min(dt,0.1)*2.3);
      if (direction.lengthSq()) {
        this.followPath=false;this.arrivalFacing=false;
        this.route=[];
        direction.normalize().applyAxisAngle(new THREE.Vector3(0,1,0),this.yaw);
        const step=Math.min(dt,0.1)*8;
        if(this.walkable(p.x+direction.x*step,p.z)) p.x+=direction.x*step;
        if(this.walkable(p.x,p.z+direction.z*step)) p.z+=direction.z*step;
        this.target.copy(p);
      } else {
        direction.subVectors(this.target,p);
        const distance = direction.length();
        if(this.followPath && (distance>0.01 || this.arrivalFacing)){
          const heading=distance>0.01?Math.atan2(-direction.x,-direction.z):0;
          const delta=Math.atan2(Math.sin(heading-this.yaw),Math.cos(heading-this.yaw));
          this.yaw+=delta*(1-Math.exp(-dt*7));
        }
        p.addScaledVector(direction.normalize(), Math.min(distance, dt * 8));
        if (p.distanceToSquared(this.target)<0.0001 && this.route.length) this.target.copy(this.route.shift()!);
      }
      if (direction.lengthSq()) this.walker.rotation.y = Math.atan2(direction.x, direction.z);
    }
    const choices: Stop[]=[...this.staff,'bench','tank','hangar'];
    let closest=1.8, near: Stop | null=null;
    for(const stop of choices){
      const [x,z]=destinations[stop], distance=Math.hypot(x-p.x,z-p.z);
      if(distance<closest){near=stop;closest=distance;}
    }
    if (near !== this.near) { this.near = near; this.onNear(near); }
    this.works?.animate(this.time,p);
    const indoors=Math.abs(p.x)<21 && p.z>-12.8 && p.z<8.8;
    if(this.indoors!==indoors){this.indoors=indoors;this.onLocation(indoors);}
    this.stage.bloomStrength = indoors ? 0.07 : this.previousBloom;
    const camera=this.stage.camera;
    if(this.inspect) {
      camera.position.set(stops.tank+1.5,2.4,5.2);
      camera.lookAt(stops.tank,3.4,-1);
    } else {
      const eye = 1.75 + Math.max(0,p.z-26)*0.34;
      camera.position.set(p.x,eye,p.z);
      camera.lookAt(p.x-Math.sin(this.yaw)*Math.cos(this.pitch),eye+Math.sin(this.pitch),p.z-Math.cos(this.yaw)*Math.cos(this.pitch));
    }
    this.walker.visible=false;
    return true;
  }
}






