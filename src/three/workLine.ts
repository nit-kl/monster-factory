import * as THREE from 'three';
import { Stage, ball, box, cyl, mesh, metal, std, glow, torus } from './kit';

export type Cargo = 'soup' | 'ice' | 'egg';
export type Crew = 'furnace' | 'bell';
export const orders: Record<Cargo,{label:string; target:number}> = {
  soup:{label:'夜勤のスープ',target:2}, ice:{label:'炉番の氷菓',target:-2}, egg:{label:'孵化直前の卵',target:0}
};
export class WorkLine {
  private stage: Stage;
  private workers: THREE.Group[] = [];
  private carriers: THREE.Group[] = [];
  private rollers: THREE.Mesh[] = [];
  private heat = 0;
  private elapsed = 0;
  private processed = 0;
  private active = false;
  private cargo: Cargo = 'soup';
  crew: Crew[] = ['furnace','bell'];
  onStation = (_heat:number,_station:number) => {};
  onFinish = (_success:boolean) => {};
  constructor(host:HTMLElement) {
    this.stage = new Stage(host,{background:0x18242a,bloom:.22});
    const scene = this.stage.scene;
    scene.add(new THREE.HemisphereLight(0xffead2,0x85989f,2));
    const light = new THREE.DirectionalLight(0xffe3bd,3); light.position.set(-3,8,5); scene.add(light);
    const steel=metal(0x526876), brass=metal(0xd99d52), dark=std(0x223238);
    scene.add(mesh(box(30,.2,20),dark,[0,-.12,0]),mesh(box(11,.35,1.65),steel,[0,.86,0]));
    for(let x=-5;x<=5;x+=2) scene.add(mesh(box(.23,.8,1.4),brass,[x,.4,0]));
    for(let i=0;i<38;i++){
      const roller=mesh(cyl(.135,.135,1.52,12),i%2?steel:brass,[-5.18+i*.28,1.13,0],[Math.PI/2,0,0]);
      this.rollers.push(roller);scene.add(roller);
    }
    for(const x of [-2,2]){
      const station=new THREE.Group();station.position.set(x,1.24,-1.15);scene.add(station);
      scene.add(mesh(cyl(.85,.95,1.25),steel,[x,.62,-1.18]));
      this.workers.push(station);
    }
    for(const kind of ['soup','ice','egg'] as const){
      const cart=new THREE.Group();
      cart.add(mesh(box(.98,.14,.88),brass));
      if(kind==='egg') cart.add(mesh(ball(.39),std(0xffe2af),[0,.52,0],[0,0,0],[.85,1.2,.85]));
      else if(kind==='ice') cart.add(mesh(box(.65,.66,.65),std(0x86e8ff),[0,.42,0],[0,.2,0]));
      else cart.add(mesh(cyl(.44,.32,.4),steel,[0,.29,0]),mesh(cyl(.39,.39,.03),std(0xf2a049),[0,.50,0]));
      this.carriers.push(cart);scene.add(cart);
    }
    this.setCrew(0,'furnace');this.setCrew(1,'bell');this.prepare('soup');
    this.stage.onFrame=(dt,t)=>{
      if(this.active){
        this.elapsed=Math.min(8,this.elapsed+dt);
        const x=-5+this.elapsed*1.25;
        this.carriers.forEach(c=>c.position.x=x);
        this.rollers.forEach(r=>r.rotation.y+=dt*5);
        if(this.processed<2 && x>=[-2,2][this.processed]){
          this.heat+=this.crew[this.processed]==='furnace'?1:-1;
          this.onStation(this.heat,++this.processed);
        }
        if(this.elapsed>=8){this.active=false;this.onFinish(this.heat===orders[this.cargo].target);}
      }
      this.workers.forEach((w,i)=>{
        const reach=this.active?Math.max(0,1-Math.abs(this.carriers[0].position.x-w.position.x)):0;
        w.rotation.x=.62*reach;
        w.position.y=1.24+Math.sin(t*3+i)*.05;
      });
      const cam=this.stage.camera;
      const zoom=Math.max(1,1.95/cam.aspect);
      cam.position.set(2*zoom,5.3*zoom,8.3*zoom);cam.lookAt(0,1.15,0);
    };
    this.stage.start();
  }
  setCrew(index:number,kind:Crew){
    this.crew[index]=kind;
    const group=this.workers[index];
    // Keep both models mounted so swapping crews also works while the belt runs.
    if(!group.children.length){
      const giant=new THREE.Group(), jelly=new THREE.Group();
      const iron=metal(0x666067), fire=glow(0xff670e), blue=std(0x80d7ed);
      giant.add(mesh(box(.94,.98,.63),iron,[0,.92,0]),mesh(box(.49,.46,.42),iron,[0,1.63,0]),mesh(torus(.25,.065),fire,[0,1,.34]));
      for(const side of [-1,1]) giant.add(mesh(box(.32,.55,.44),iron,[side*.27,.28,0]),mesh(ball(.29),iron,[side*.59,.92,.17]));
      jelly.add(mesh(ball(.62),blue,[0,1.45,0],[0,0,0],[1,.7,1]));
      for(let i=0;i<7;i++) jelly.add(mesh(cyl(.066,.034,.78),blue,[Math.cos(i)*.36,.91,Math.sin(i)*.36],[.18,0,Math.sin(i)*.22]));
      for(const side of [-1,1]) jelly.add(mesh(ball(.055),metal(0x172938),[side*.18,1.44,.56]));
      group.add(giant,jelly);
    }
    group.children[0].visible=kind==='furnace';group.children[1].visible=kind==='bell';
  }
  prepare(cargo:Cargo){
    this.active=false;this.elapsed=0;this.heat=0;this.processed=0;this.cargo=cargo;
    this.carriers.forEach((c,i)=>{c.visible=i===['soup','ice','egg'].indexOf(cargo);c.position.set(-5,1.37,0);});
  }
  start(){this.active=true;}
  dispose(){this.stage.dispose();}
}
