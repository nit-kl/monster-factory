import * as THREE from 'three';
import { canvasTexture, std } from './kit';
import { FactoryPaths, yardBounds } from './factoryPaths';

// Repeated steelwork shares geometry and draw calls across the entire works.
export function buildIronworks() {
  const site = new THREE.Group();
  const paths = new FactoryPaths();
  const wheels: THREE.Group[] = [];
  const shutters: THREE.Group[] = [];
  const shapes = {
    block: new THREE.BoxGeometry(1, 1, 1),
    round: new THREE.CylinderGeometry(0.5, 0.5, 1, 20),
    roof: new THREE.ConeGeometry(0.5, 1, 20),
    band: new THREE.TorusGeometry(0.5, 0.022, 6, 32),
    globe: new THREE.SphereGeometry(0.5,20,14),
    shard: new THREE.OctahedronGeometry(0.5),
  };
  const palette = {
    steel: std(0x54616a), iron: std(0x313342), rust: std(0x80503b), concrete: std(0x51525a),
    gold: std(0xb88754), asphalt: std(0x242832), stripe: std(0xc8a571),
    hot: new THREE.MeshBasicMaterial({ color: new THREE.Color(3.4, 1.2, 0.22) }),
    cool: new THREE.MeshBasicMaterial({ color: new THREE.Color(0.28, 1.6, 1.9) }),
    red: new THREE.MeshBasicMaterial({ color: new THREE.Color(3, 0.12, 0.025) }),
    enamel: std(0x837567,{metalness:0.28,roughness:0.57}),
    duct: std(0x85796c,{metalness:0.65,roughness:0.38}),
    safety: std(0xc6963d), machine: std(0x485456),
    whiteLamp:new THREE.MeshBasicMaterial({color:new THREE.Color(1.55,1.15,0.78)}),
  };
  type Surface = keyof typeof palette;
  const plates = canvasTexture(256,(g,n)=>{
    g.fillStyle='#99958d'; g.fillRect(0,0,n,n);
    let seed=91;
    const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
    for(let i=0;i<9200;i++){
      g.fillStyle=random()>0.5?'#89857f':'#a09a91';
      g.fillRect(random()*n,random()*n,random()*6+1,1);
    }
    for(let y=4;y<n;y+=8) for(let x=(y%16===4?4:0);x<n;x+=12){
      g.strokeStyle='#aba79d'; g.beginPath();g.moveTo(x,y);g.lineTo(x+4,y-2);g.stroke();
    }
    g.fillStyle='#424442';g.fillRect(0,0,2,n);g.fillRect(0,0,n,2);
    for(const x of [6,250]) for(const y of [6,250]){
      g.fillStyle='#474743';g.fillRect(x-2,y-2,5,5);g.fillStyle='#ccc4b3';g.fillRect(x-1,y-1,3,2);
    }
  },[80,63]);
  palette.asphalt.color.setHex(0x77726b);
  palette.asphalt.map=plates; palette.asphalt.bumpMap=plates; palette.asphalt.bumpScale=0.035;
  const bayFloor = canvasTexture(256,(g,n)=>{
    g.fillStyle='#64605a';g.fillRect(0,0,n,n);
    for(let x=0;x<=n;x+=32){
      g.fillStyle='#434341';g.fillRect(x,0,1,n);g.fillRect(0,x,n,1);
    }
    for(const y of [4,244]){
      g.fillStyle='#33312e';g.fillRect(3,y,250,7);g.fillStyle='#c89a42';
      for(let x=3;x<248;x+=12){
        g.beginPath();g.moveTo(x,y);g.lineTo(x+5,y);g.lineTo(x+11,y+7);g.lineTo(x+6,y+7);g.fill();
      }
    }
    const light=g.createRadialGradient(127,118,2,127,118,118);
    light.addColorStop(0,'rgba(245,199,128,.30)');light.addColorStop(1,'rgba(245,199,128,0)');
    g.fillStyle=light;g.fillRect(0,0,n,n);
  });
  const bayDeck=std(0xe1d8cb,{map:bayFloor,roughness:0.58,metalness:0.25});
  const floorTile=new THREE.PlaneGeometry(1,1);
  type Shape = keyof typeof shapes;
  const suspended: { object:THREE.Object3D; height:number; phase:number }[]=[];
  const batches = new Map<string, { shape: Shape; mat: Surface; matrices: THREE.Matrix4[] }>();
  const dummy = new THREE.Object3D();
  let collisions=false;
  function part(shape: Shape, mat: Surface, x: number, y: number, z: number, w: number, h: number, d: number, rz = 0, rx = 0) {
    dummy.position.set(x,y,z); dummy.rotation.set(rx,0,rz); dummy.scale.set(w,h,d); dummy.updateMatrix();
    const key = shape + mat;
    if(collisions && y-h/2<1.85 && y+h/2>0.3 && !rz && !rx)
      paths.block(x-w/2,x+w/2,z-d/2,z+d/2);
    if (!batches.has(key)) batches.set(key,{shape,mat,matrices:[]});
    batches.get(key)!.matrices.push(dummy.matrix.clone());
  }
  const beam = (x:number,y:number,z:number,dx:number,dy:number,r:number,mat:Surface='steel') =>
    part('block',mat,x,y,z,r,Math.hypot(dx,dy),r,-Math.atan2(dx,dy));
  const chimneys: THREE.Vector3[] = [];
  function stack(x:number,z:number,h:number,w:number) {
    part('round','rust',x,h/2,z,w,h,w);
    for (let y=2;y<h;y+=3.2) {
      part('round','iron',x,y,z,w*1.12,0.22,w*1.12);
      part('block','gold',x+w*0.5,y,z,0.12,3.2,0.12);
    }
    part('round','steel',x,h-0.8,z,w*1.14,1.6,w*1.14);
    part('round','red',x,h,z,w*0.99,0.12,w*0.99);
    chimneys.push(new THREE.Vector3(x,h,z));
  }
  function tower(x:number,z:number,h:number,w:number) {
    part('round','steel',x,h/2,z,w,h,w);
    part('roof','rust',x,h+0.65,z,w,1.3,w);
    for (let y=2;y<h;y+=3.4) {
      part('round','iron',x,y,z,w+1.5,0.26,w+1.5);
      part('band','gold',x,y+0.8,z,w+1.4,w+1.4,1,0,Math.PI/2);
      for(let i=0;i<8;i++){
        const a=i*Math.PI/4;
        part('block','gold',x+Math.cos(a)*(w+1.4)/2,y+0.42,z+Math.sin(a)*(w+1.4)/2,0.08,0.85,0.08);
      }
      part('block','hot',x,y-0.15,z+w/2+0.55,0.7,0.15,0.16);
    }
    for(const side of [-1,1]) part('round','rust',x+side*(w/2+0.24),h/2,z,0.36,h,0.36);
  }
  function hall(x:number,z:number,w:number,h:number,d:number) {
    const deck=new THREE.Mesh(floorTile,bayDeck);
    deck.rotation.x=-Math.PI/2;deck.scale.set(w,d,1);deck.position.set(x,0.018,z);site.add(deck);
    part('block','rust',x,h/2,z-d/2,w,h,0.22);
    for(const side of [-1,1]){
      for(const end of [-1,1]) part('block','steel',x+side*(w/2-0.2),h/2,z+end*(d/2-0.2),0.4,h,0.45);
      part('round','rust',x+side*(w/2-1),h-0.8,z,0.28,d,0.28,0,Math.PI/2);
    }
    part('block','hot',x,h-0.4,z,1.5,0.1,0.55);
    const wx=x-w*0.23, wy=Math.min(h*0.46,2.4), wz=z-0.7, r=wy*0.77;
    part('block','steel',wx,0.5,wz,2.3,1,1.1);
    part('round','rust',wx,wy,wz-0.5,r*1.5,1.4,r*1.5,0,Math.PI/2);
    paths.block(wx-r,wx+r,wz-1.3,wz+0.6);
    const wheel=new THREE.Group();wheel.position.set(wx,wy,wz+0.32);
    const rim=new THREE.Mesh(shapes.band,palette.gold);rim.scale.set(2*r,2*r,3);wheel.add(rim);
    const inner=rim.clone();inner.scale.multiplyScalar(0.79);wheel.add(inner);
    for(let bolt=0;bolt<12;bolt++){
      const angle=bolt*Math.PI/6;
      part('round','gold',wx+Math.cos(angle)*r*0.91,wy+Math.sin(angle)*r*0.91,wz+0.26,0.12,0.15,0.12,0,Math.PI/2);
    }
    for(let i=0;i<4;i++){
      const bar=new THREE.Mesh(shapes.block,palette.steel);bar.scale.set(0.13,r*2,0.15);
      bar.rotation.z=i*Math.PI/4;wheel.add(bar);
    }
    wheels.push(wheel);site.add(wheel);
    part('block','rust',x+w*0.28,0.65,z-1,1.3,1.3,0.85);
    for(const offset of [-0.31,0,0.31]) part('round','cool',x+w*0.28+offset,0.99,z-0.55,0.14,0.07,0.14,0,Math.PI/2);
    part('block','steel',x,h,z,w+0.6,0.4,d+0.6);
    for(let i=-w/2+0.6;i<w/2;i+=1.35){
      beam(x+i,h-0.45,z+d/2,1.2,0.74,0.1);
      part('block','hot',x+i,h-0.65,z-d/2+0.2,0.48,0.3,0.08);
    }
  }
  function bridge(x:number,z:number,w:number,y:number) {
    for(const side of [-1,1]){
      for(const level of [0,1.7]) part('block','iron',x,y+level,z+side,w,0.18,0.18);
      const bays=Math.ceil(w/3);
      for(let i=0;i<bays;i++) beam(x-w/2+(i+0.5)*w/bays,y+0.85,z+side,w/bays,i%2?1.7:-1.7,0.14);
    }
    for(const i of [-0.55,0.45]) part('round','rust',x,y+0.55,z+i,0.7,w,0.7,Math.PI/2);
    for(const side of [-1,1]) part('block','steel',x+side*(w/2-0.4),y/2,z,0.48,y,0.6);
  }

  function foundry(x:number,z:number){
    part('round','iron',x,2.7,z,8,5.4,8);
    part('roof','rust',x,7,z,8.4,3.6,8.4);
    stack(x,z,18,1.7);
    for(const y of [1,3.6,5.2]) part('round','steel',x,y,z,8.3,0.25,8.3);
    part('block','iron',x,2,z+3.7,4.1,3.5,1.3);
    part('block','hot',x,1.55,z+4.39,3,1.65,0.12);
    for(const dx of [-1,0,1]) part('block','iron',x+dx,1.55,z+4.5,0.15,1.65,0.15);
    for(let i=0;i<4;i++) {
      part('block','concrete',x+6,0.24,z+i*1.2,2,0.48,0.88);
      part('block','hot',x+6,0.49,z+i*1.2,1.45,0.05,0.48);
    }
  }
  function gantry(x:number,z:number){
    for(const dx of [-6,6]){
      part('block','steel',x+dx,5.2,z,0.8,10.4,1.4);
      part('block','iron',x+dx,0.25,z,1.3,0.5,5);
      beam(x+dx*0.78,8.5,z,dx*0.45,-3.5,0.32,'gold');
    }
    part('block','gold',x,10.5,z,16,1,1.4);
    part('block','rust',x-4.8,9.5,z+1.1,2.1,1.8,1.6);
    part('block','cool',x-4.8,9.7,z+1.95,1.5,0.68,0.12);
    const load=new THREE.Group();load.position.set(x+1,6,z);
    for(const dx of [-0.9,0.9]){
      const cable=new THREE.Mesh(shapes.round,palette.iron);cable.scale.set(0.07,5.5,0.07);
      cable.position.set(dx,2.3,0);load.add(cable);
    }
    const ladle=new THREE.Mesh(shapes.globe,palette.rust);ladle.scale.set(3,2.6,2.8);load.add(ladle);
    const lip=new THREE.Mesh(shapes.round,palette.hot);lip.scale.set(2.4,0.12,2.2);lip.position.y=0.64;load.add(lip);
    site.add(load);suspended.push({object:load,height:6,phase:x});
  }
  function nursery(x:number,z:number){
    for(const [dx,dz,size] of [[-3,0,2.6],[0,-2,4.2],[3,1,1.9]]){
      const cx=x+dx,cz=z+dz;
      part('round','steel',cx,0.55,cz,size+0.4,1.1,size+0.4);
      part('globe','cool',cx,1.1+size*0.46,cz,size,size*1.15,size);
      for(const y of [1.1,1.1+size*0.55]) part('round','gold',cx,y,cz,size*1.02,0.14,size*1.02);
      part('roof','iron',cx,1.2+size,cz,size*0.68,0.55,size*0.68);
    }
  }
  function mineralYard(x:number,z:number){
    for(const side of [-1,1]) part('block','steel',x+side,0.09,z,0.12,0.18,10);
    for(let i=-4;i<=4;i++) part('block','rust',x,0.04,z+i,2.8,0.08,0.28);
    for(const dz of [-2.3,1.7]){
      part('block','iron',x,0.8,z+dz,2.7,1.1,3);
      for(let i=0;i<5;i++) part('shard',i===2?'cool':'steel',x+Math.sin(i*2)*0.8,1.5,z+dz+Math.cos(i*2)*0.8,0.85,1+i*0.22,0.95,i*0.2);
    }
  }
  function condenser(x:number,z:number){
    part('round','concrete',x,0.7,z,6.4,1.4,6.4);
    part('globe','steel',x,4.1,z,7.2,6.6,7.2);
    part('round','rust',x,4.1,z,7.3,0.27,7.3);
    part('round','gold',x,7.6,z,1.15,0.65,1.15);
    part('round','rust',x+4.5,2.5,z,0.9,5,0.9);
    part('round','rust',x+2.2,4.7,z,0.9,4.8,0.9,Math.PI/2);
  }

  function productionHall(){
    const floorMap=canvasTexture(512,(g,n)=>{
      g.fillStyle='#a6a9a8';g.fillRect(0,0,n,n);
      for(let i=0;i<6000;i++){
        g.fillStyle=i%2?'rgba(72,81,82,.06)':'rgba(240,242,236,.07)';
        g.fillRect((i*143)%509,(i*271)%503,4+i%7,1);
      }
      g.strokeStyle='#888d8d';g.strokeRect(0,0,n,n);
    },[12,7]);
    const floor=new THREE.Mesh(floorTile,std(0x827b74,{map:floorMap,roughness:0.42,metalness:0.18}));
    floor.scale.set(42,22,1);floor.rotation.x=-Math.PI/2;floor.position.set(0,0.09,-2);site.add(floor);
    const stripe=(x:number,z:number,w:number,d:number)=>part('block','enamel',x,0.102,z,w,0.016,d);
    for(const side of [-1,1]){
      stripe(side*2.7,-2,0.13,21);
      for(let z=-11;z<7;z+=2) stripe(side*1.58,z,0.09,0.8);
      part('block','enamel',side*20.8,3.7,-2,0.26,7.4,22);
      for(const z of [-12.8,8.8]){
        part('block','enamel',side*12,3.6,z,17.2,7.2,0.25);
        part('block','machine',side*12,4.1,z-0.19,14,1.2,0.09);
        part('block','duct',side*12,0.65,z+0.18,17,1.1,0.09);
      }
    }
    for(let x=-2.2;x<=2.3;x+=0.75) stripe(x,7.7,0.36,1.4);
    part('block','steel',0,7.8,-2,42.4,0.28,22.5);
    for(let x=-20;x<=20;x+=5){
      for(const z of [-12,8]){
        if(x===0) continue;
        part('block','enamel',x,3.7,z,0.28,7.4,0.45);
        part('block','safety',x,0.65,z,0.32,1.3,0.48);
      }
      for(const y of [6.55,7.45]) part('block','enamel',x,y,-2,0.16,0.15,21);
      for(let z=-11;z<8;z+=2) part('block','enamel',x,7,z,0.12,2.15,0.12,0,z%4===-3?1.13:-1.13);
      for(const z of [-7,2]) part('block','whiteLamp',x,6.38,z,2.9,0.08,0.18);
    }
    for(const z of [-9,-3,4]){
      part('round','duct',0,6,z,0.68,40,0.68,Math.PI/2);
      for(let x=-19;x<20;x+=3.4) part('round','steel',x,6,z,0.72,0.09,0.72,Math.PI/2);
      for(const x of [-12,8]){
        part('round','duct',x,5.45,z,0.54,1.15,0.54);
        part('round','steel',x,4.86,z,0.79,0.13,0.79);
      }
    }
    for(const x of [-16,-8,7,15]){
      const z=-7;
      part('block','machine',x,0.6,z,3.2,1.2,2.3);
      part('block','enamel',x,1.25,z,3.3,0.16,2.4);
      for(const dx of [-1.45,1.45]) part('block','duct',x+dx,2,z,0.16,1.6,0.22);
      part('block','enamel',x,2.82,z,3.1,0.34,0.65);
      part('round','steel',x,2.22,z,0.38,1.05,0.38);
      part('block','enamel',x+2.1,1.2,z,0.85,2.4,1.25);
      part('block','cool',x+2.1,1.79,z+0.64,0.55,0.4,0.05);
      for(const dx of [-1.8,1.8]) part('round','safety',x+dx,0.62,z+1.75,0.13,1.2,0.13);
      for(const y of [0.55,1.16]) part('round','safety',x,y,z+1.75,0.12,3.6,0.12,Math.PI/2);
      paths.block(x-1.8,x+1.8,z+1.68,z+1.82);
    }
    for(const x of [-10,10]){
      const lamp=new THREE.PointLight(0xffcc94,38,19,1.8);
      lamp.position.set(x,5.8,-2);site.add(lamp);
    }
    // Keep the main aisle clear through both loading doors.
    const sign=canvasTexture(256,(g,n)=>{
      g.fillStyle='#27252b';g.fillRect(0,0,n,n);
      g.strokeStyle='#b08c58';g.lineWidth=6;g.strokeRect(4,6,n-8,n-12);
      g.fillStyle='#f3d49a';g.textAlign='center';g.textBaseline='middle';
      g.scale(1,2.7);g.font='bold 41px sans-serif';g.fillText('中央製造棟',128,48);
    });
    const plaque=new THREE.MeshBasicMaterial({map:sign});
    for(const z of [-12.8,8.8]){
      part('block','iron',0,6.35,z,7,1.7,0.46);
      for(const side of [-1,1]){
        const label=new THREE.Mesh(floorTile,plaque);label.scale.set(5,1.15,1);
        label.position.set(0,6.35,z+side*0.24);label.rotation.y=side<0?Math.PI:0;site.add(label);
        part('block','rust',side*3.46,2.85,z,0.22,5.7,0.42);
      }
      const door=new THREE.Group();door.position.z=z;
      for(let i=0;i<13;i++){
        const slat=new THREE.Mesh(shapes.block,i===2?palette.safety:palette.steel);
        slat.position.y=0.22+i*0.43;slat.scale.set(6.82,0.415,0.16);door.add(slat);
      }
      shutters.push(door);site.add(door);
    }
  }

  function perimeter(){
    const west=yardBounds.west-0.75, east=yardBounds.east+0.75;
    const north=yardBounds.north-0.75, south=yardBounds.south+0.75;
    const width=east-west, depth=south-north, cx=(east+west)/2, cz=(north+south)/2;
    part('block','asphalt',cx,-0.23,cz,width,0.45,depth);
    part('block','concrete',cx,-3.2,cz,width,6.2,depth);
    function wall(x:number,z:number,length:number,alongX:boolean,height:number){
      const span=(mat:Surface,y:number,h:number,thickness:number)=>{
        part('block',mat,x,y,z,alongX?length:thickness,h,alongX?thickness:length);
      };
      span('concrete',height/2,height,0.72);
      span('steel',height,0.25,0.94);
      span('iron',height*0.32,0.16,0.8);
      const bays=Math.ceil(length/7);
      for(let i=0;i<=bays;i++){
        const offset=length*(i/bays-0.5), px=x+(alongX?offset:0), pz=z+(alongX?0:offset);
        part('block','iron',px,height*0.5,pz,1.06,height+0.5,1.06);
        if(i%3===0) part('block','hot',px,height+0.35,pz,0.48,0.25,0.48);
      }
    }
    wall(cx,north,width,true,4.1);
    wall(west,cz,depth,false,3.6);wall(east,cz,depth,false,3.1);
    for(const end of [east,west]){
      const lip=Math.sign(end)*3.6;
      wall((end+lip)/2,south,Math.abs(end-lip),true,2.3);
    }
    for(const [x,z] of [[west-1.4,north-1.4],[east+1.4,north-1.4],[west-1.4,south+1.4],[east+1.4,south+1.4]]){
      part('block','concrete',x,3,z,3.8,6,3.8);
      part('block','iron',x,6.4,z,4.3,1,4.3);
      part('block','hot',x,6.4,z,4.33,0.19,4.33);
      part('roof','steel',x,7.8,z,6.5,2,6.5);
    }
    const gate=yardBounds.gate+1;
    for(const x of [-4.5,4.5]){
      part('block','concrete',x,6.7,gate+1,2.7,13.4,5);
      part('block','iron',x,13.55,gate+1,3,0.45,5.4);
      part('block','hot',x,10,gate-1.6,0.42,0.85,0.16);
    }
    part('block','steel',0,10.7,gate+0.4,6.8,5.3,0.55);
    for(let x=-3;x<=3;x+=0.65) part('block','iron',x,10.7,gate+0.08,0.12,5.3,0.12);
    part('block','rust',0,13.65,gate+0.5,11.8,0.8,4.8);
    for(const z of [32,40,47]) part('block','concrete',0,(z-26)*0.17-3,z,5.8,(z-26)*0.34+6,1);
    part('block','iron',0,-6.6,-5,330,0.8,290);
    for(let i=0;i<38;i++){
      const a=i*2*Math.PI/38, h=8+4*Math.sin(i*1.7)+3*Math.cos(i*0.8);
      part('shard','concrete',cx+Math.cos(a)*(width/2+35),-5,cz+Math.sin(a)*(depth/2+48),26+i%4*3,h*2,20+i%3*4,Math.sin(i)*0.2);
    }
  }
  perimeter();
  const slope=Math.atan(0.34), rampLength=24/Math.cos(slope);
  part('block','iron',0,4.08-0.14,38,6.6,0.28,rampLength,0,-slope);
  for(const side of [-1,1]){
    for(const height of [0.5,1.0]) part('block','gold',side*3.18,4.08+height,38,0.08,0.09,rampLength,0,-slope);
    for(let z=26;z<=50;z+=2) {
      part('block','steel',side*3.18,(z-26)*0.34+0.5,z,0.11,1,0.12);
      part('block','hot',side*3.06,(z-26)*0.34+0.22,z,0.08,0.06,0.22);
    }
  }
  for(const z of [6,23]) for(let x=-28;x<=28;x+=4) part('block','stripe',x,0.025,z,1.8,0.03,0.11);
  for(const x of [-27,-1,26]) for(let z=9;z<22;z+=4) part('block','stripe',x,0.025,z,0.11,0.03,1.8);
  // The two service blocks leave three cross streets between the avenues.
  collisions=true;
  hall(-14,14.5,16,4.4,7);
  gantry(16,13); mineralYard(17,17);
  foundry(-44,-23); mineralYard(-31,-18); gantry(-58,-26);
  stack(-65,-35,29,2.1); stack(-61,-37,21,1.6);
  bridge(-48,-33,22,8.3); foundry(-52,-59); mineralYard(-71,-48);
  hall(-23,-45,17,8,9); gantry(-4,-57);
  nursery(4,-18); nursery(-8,-35); condenser(15,-37);
  hall(33,-48,13,5.5,9); mineralYard(44,-23);
  condenser(45,-58); condenser(60,-42);
  tower(68,-52,25,4); tower(62,-59,17,2.8); bridge(56,-53,17,9);
  productionHall();
  tower(-7,-1,4.8,2.6); stack(-25,-4,23,1.8);
  for(const [x,z,h,w] of [
    [-72,-52,20,1.4],[-69,-61,26,1.2],[-59,-65,18,1.7],[-45,-66,30,1.5],
    [-41,-62,25,1.3],[-32,-57,16,1.7],[-28,-65,22,1.4],[-16,-61,27,1.3],
    [-13,-65,23,1.1],[5,-66,19,1.5],[17,-63,31,1.5],[21,-61,26,1.3],
    [37,-65,18,1.6],[54,-64,24,1.2],[73,-61,21,1.3]
  ]) stack(x,z,h,w);
  bridge(-14,14,19,7);
  for(const x of [-26,-15,-3,9,23]) for(const z of [26]){
    part('round','steel',x,2.5,z,0.16,5,0.16);
    part('block','iron',x,5,z+0.6,0.2,0.2,1.4);
    part('block','hot',x,4.86,z+1.15,0.7,0.14,0.46);
  }
  for(const z of [-67,-48,-28,-9,7,22]){
    for(let x=-70;x<74;x+=3){
      part('block','iron',x,0.018,z,2.96,0.028,0.42);
      for(let i=-1.35;i<1.4;i+=0.19) part('block','steel',x+i,0.042,z,0.055,0.024,0.4);
    }
  }
  for(const {shape,mat,matrices} of batches.values()){
    const batch = new THREE.InstancedMesh(shapes[shape],palette[mat],matrices.length);
    matrices.forEach((matrix,i)=>batch.setMatrixAt(i,matrix));
    site.add(batch);
  }
  const haze = canvasTexture(64,(g,n)=>{
    const grad=g.createRadialGradient(n/2,n/2,1,n/2,n/2,n/2);
    grad.addColorStop(0,'rgba(191,147,126,0.42)'); grad.addColorStop(0.55,'rgba(154,133,129,0.22)'); grad.addColorStop(1,'rgba(110,102,107,0)');
    g.fillStyle=grad; g.fillRect(0,0,n,n);
  });
  const smokeMaterial=new THREE.SpriteMaterial({map:haze,transparent:true,depthWrite:false});
  const clouds=chimneys.flatMap((origin,index)=>Array.from({length:9},(_,i)=>{
    const puff=new THREE.Sprite(smokeMaterial); site.add(puff);
    return {origin,puff,phase:i/9,seed:index*2.3};
  }));
  site.add(new THREE.HemisphereLight(0xa7b7cc,0x352b31,0.9));
  const moon=new THREE.DirectionalLight(0xffad73,2); moon.position.set(-30,40,-10); site.add(moon);
  return {site,paths,animate(time:number, visitor:THREE.Vector3){
    for(const door of shutters){
      const distance=Math.hypot(visitor.x,visitor.z-door.position.z);
      door.scale.y=0.97*THREE.MathUtils.smoothstep(distance,2.8,7.5)+0.03;
      door.position.y=5.59*(1-door.scale.y);
    }
    for(const load of suspended) load.object.position.y=load.height+Math.sin(time*0.48+load.phase)*0.65;
    for(const wheel of wheels) wheel.rotation.z=time*0.55;
    for(const {origin,puff,phase,seed} of clouds){
      const t=(phase+time*0.055)%1;
      puff.position.set(origin.x+t*7+Math.sin(seed+t*9)*t,origin.y+t*13,origin.z-t*3);
      puff.scale.setScalar((2+8*t)*Math.min(1,(1-t)*6,t*18));
    }
  }};
}





