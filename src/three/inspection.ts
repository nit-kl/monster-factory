import * as THREE from 'three';
import { buildIronworks } from './ironworks';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { Stage, ball, cone, box, glow, mesh, metal, std } from './kit';

export type Spot = 'overview' | 'desk' | 'switch' | 'lamp';
export class Inspection {
  private stage: Stage;
  private controls: OrbitControls;
  overview = false;
  near: Spot | null = null;
  onNear: (spot: Spot | null) => void = () => {};
  approach: (spot: Exclude<Spot,'overview'>) => void = () => {};
  private cleanup = () => {};
  readonly found = new Set<Spot>();
  low = false;
  shade = false;
  constructor(host: HTMLElement) {
    const stage = this.stage = new Stage(host,{background:0x423b43,bloom:.24});
    const works = buildIronworks();
    stage.scene.add(works.site);
    stage.camera.far=1500;
    stage.camera.updateProjectionMatrix();
    const controls=this.controls=new OrbitControls(stage.camera,stage.renderer.domElement);
    controls.target.set(0,4,-19);
    controls.enablePan=false;
    controls.maxPolarAngle=Math.PI*.47;
    controls.minDistance=32;
    controls.maxDistance=900;
    const overviewPosition=()=>{
      const distance=105/Math.tan(THREE.MathUtils.degToRad(stage.camera.fov/2))/Math.min(1,stage.camera.aspect);
      stage.camera.position.copy(controls.target).addScaledVector(new THREE.Vector3(.32,.69,.65).normalize(),distance);
      controls.update();
    };
    overviewPosition();
    const lamp = mesh(box(.56,.15,.32),glow(0xfff2b7,3),[5.55,1.25,1.68]);
    const hood = mesh(box(.69,.24,.28),metal(0x695846),[5.55,1.22,1.84]);
    const switchPlate = mesh(box(.48,.4,.12),metal(0xc59342),[5.6,.42,2.91]);
    const button = mesh(ball(.12),std(0xcb473c),[5.6,.42,3]);
    const hatchling = new THREE.Group();
    hatchling.add(mesh(ball(.22),std(0x8cdaba),[0,.16,0],[0,0,0],[1,.76,.92]));
    const eyes=[-.085,.085].map(x=>mesh(ball(.025),std(0x252c32),[x,.2,.174]));
    hatchling.add(...eyes);
    const equipment=new THREE.Group();
    equipment.position.set(1.45,.04,-9.45);
    equipment.add(lamp,hood,switchPlate,button,hatchling);
    stage.scene.add(equipment);
    const actor=new THREE.Group();
    const body=mesh(cone(.32,.8),std(0x785ba3),[0,.67,0]);
    actor.add(body,mesh(ball(.23),std(0xf0c8a1),[0,1.22,0]),mesh(cone(.34,.41),std(0x675086),[0,1.49,0]));
    const boots=[-.14,.14].map(x=>mesh(box(.16,.26,.24),metal(0x594335),[x,.16,0]));
    actor.add(...boots); actor.position.set(0,0,1);stage.scene.add(actor);
    const clues = [
      {id:'desk', x:-7,z:-4}, {id:'switch',x:1,z:-4}, {id:'lamp',x:7,z:-4}
    ] as const;
    button.position.set(-.45,.52,4.7);switchPlate.position.set(-.45,.52,4.57);
    equipment.add(mesh(box(.48,1.1,.42),metal(0x645749),[-.45,.55,4.42]));
    equipment.add(mesh(box(1.2,.85,.68),metal(0x58616b),[-8.45,.52,4.55]),mesh(box(.7,.035,.45),std(0xf0dfaa),[-8.45,.97,4.55]));
    const markers=clues.map(c=>{
      const mark=mesh(new THREE.OctahedronGeometry(.21),glow(0xffcf5b,2.6),[c.x,1.7,c.z-.65]);
      stage.scene.add(mark);return mark;
    });
    let path:{x:number;z:number}[]=[];
    this.approach=id=>{
      const c=clues.find(v=>v.id===id)!;
      this.overview=false;path=works.paths.route(actor.position.x,actor.position.z,c.x,c.z);
    };
    const keys=new Set<string>();
    const canvas=stage.renderer.domElement;
    canvas.tabIndex=0;canvas.setAttribute('aria-label','工場の歩行エリア');
    const key=(e:KeyboardEvent)=>{
      if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','KeyW','KeyA','KeyS','KeyD'].includes(e.code)||this.overview)return;
      e.preventDefault();if(e.type==='keydown')keys.add(e.code);else keys.delete(e.code);
    };
    const blur=()=>keys.clear();
    const tap=(e:PointerEvent)=>{
      if(this.overview)return;
      canvas.focus({preventScroll:true});
      const r=canvas.getBoundingClientRect(),ray=new THREE.Raycaster();
      ray.setFromCamera(new THREE.Vector2((e.clientX-r.left)/r.width*2-1,1-(e.clientY-r.top)/r.height*2),stage.camera);
      const hit=ray.intersectObjects(markers)[0];
      if(hit){this.approach(clues[markers.indexOf(hit.object as typeof markers[number])].id);return;}
      const ground=ray.ray.intersectPlane(new THREE.Plane(new THREE.Vector3(0,1,0)),new THREE.Vector3());
      if(ground)path=works.paths.route(actor.position.x,actor.position.z,ground.x,ground.z);
    };
    canvas.addEventListener('keydown',key);canvas.addEventListener('keyup',key);canvas.addEventListener('blur',blur);canvas.addEventListener('pointerdown',tap);
    canvas.focus({preventScroll:true});
    this.cleanup=()=>{canvas.removeEventListener('keydown',key);canvas.removeEventListener('keyup',key);canvas.removeEventListener('blur',blur);canvas.removeEventListener('pointerdown',tap);};
    let wasOverview=false,aspect=stage.camera.aspect;
    stage.onFrame=(dt,t)=>{
      const p=actor.position;
      works.animate(t,p);
      const x=5.55+Math.sin(t*1.25)*.95;
      hatchling.position.set(x,.4,1.9);
      eyes.forEach(eye=>eye.scale.y=!this.shade && Math.abs(x-5.55)<.46?.12:1);
      hood.visible=this.shade;
      markers.forEach((m,i)=>{
        m.rotation.y=t*1.6;m.position.y=1.7+.1*Math.sin(t*3+i);
        m.scale.setScalar(this.found.has(clues[i].id)?.52:1);
      });
      controls.enabled=this.overview;
      if(this.overview){
        if(!wasOverview||aspect!==stage.camera.aspect)overviewPosition();
        aspect=stage.camera.aspect;wasOverview=true;keys.clear();controls.update();return;
      }
      wasOverview=false;
      const down=(a:string,b:string)=>Number(keys.has(a)||keys.has(b));
      let dx=down('KeyD','ArrowRight')-down('KeyA','ArrowLeft'),dz=down('KeyS','ArrowDown')-down('KeyW','ArrowUp');
      let step=dt*5;
      if(dx||dz)path=[];
      else if(path.length){
        dx=path[0].x-p.x;dz=path[0].z-p.z;
        const distance=Math.hypot(dx,dz);step=Math.min(step,distance);
        if(distance<=dt*5)path.shift();
      }
      const length=Math.hypot(dx,dz);
      if(length){
        if(works.paths.open(p.x+dx/length*step,p.z))p.x+=dx/length*step;
        if(works.paths.open(p.x,p.z+dz/length*step))p.z+=dz/length*step;
        actor.rotation.y=Math.atan2(dx,dz);
      }
      boots.forEach((b,i)=>b.position.z=length?.12*Math.sin(12*t+i*Math.PI):0);
      const near=clues.find(c=>Math.hypot(p.x-c.x,p.z-c.z)<1.5)?.id??null;
      if(near!==this.near){this.low=false;this.near=near;this.onNear(near);}
      actor.visible=!this.low;
      if(this.low && near){
        const point=near==='lamp'?lamp:near==='switch'?button:markers[0];
        const target=point.getWorldPosition(new THREE.Vector3());
        stage.camera.position.copy(target).add(new THREE.Vector3(.25,-.1,2));stage.camera.lookAt(target);
      }else{
        stage.camera.position.set(p.x,3.5+Math.max(0,p.z-26)*.34,p.z+3.8);
        stage.camera.lookAt(p.x,.65+Math.max(0,p.z-26)*.34,p.z-1.4);
      }
    };    stage.start();
  }
  dispose(){this.cleanup();this.controls.dispose();this.stage.dispose();}
}
