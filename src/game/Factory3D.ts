import type { FloorId } from '../data/floors';
﻿import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

export function createFactory3D(host:HTMLDivElement,onSelect:(index:number)=>void,onFloor:(floor:FloorId)=>void){
 const scene=new THREE.Scene();scene.background=new THREE.Color('#100c20');scene.fog=new THREE.Fog('#100c20',38,75);
 const renderer=new THREE.WebGLRenderer({antialias:true,alpha:false});renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.45;host.appendChild(renderer.domElement);
 const camera=new THREE.PerspectiveCamera(40,1,.1,100);camera.position.set(23,25,29);
 const controls=new OrbitControls(camera,renderer.domElement);controls.target.set(0,1,0);controls.enableDamping=false;controls.enableRotate=true;controls.enableZoom=true;controls.enablePan=false;controls.minDistance=12;controls.maxDistance=52;controls.minPolarAngle=.4;controls.maxPolarAngle=1.35;
 scene.add(new THREE.HemisphereLight(0xc7b5ff,0x281828,2.1));const sun=new THREE.DirectionalLight(0xffd4a0,4);sun.position.set(8,20,12);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);sun.shadow.camera.left=-15;sun.shadow.camera.right=15;sun.shadow.camera.top=15;sun.shadow.camera.bottom=-15;sun.shadow.normalBias=.05;scene.add(sun);
 const production=new THREE.Group();scene.add(production);const research=new THREE.Group();research.position.y=11;scene.add(research);research.visible=false;let currentFloor:FloorId='production';
 const desiredPosition=camera.position.clone(),desiredTarget=controls.target.clone();let autoMoving=false;const manualStart=()=>{autoMoving=false};controls.addEventListener("start",manualStart);
 const materials:THREE.Material[]=[];const geometries:THREE.BufferGeometry[]=[];
 const mat=(color:number,metalness=.1,roughness=.65,emissive=0)=>{const m=new THREE.MeshStandardMaterial({color,metalness,roughness,emissive,emissiveIntensity:emissive?2:0});materials.push(m);return m};
 const stone=mat(0x40344e),dark=mat(0x191927,.65,.4),brass=mat(0xb58a37,.72,.28),trim=mat(0xe2b65b,.65,.3),violet=mat(0x9526d8,.15,.3,0x7925bf),amber=mat(0xffcb69,0,.35,0xff952e),wood=mat(0x674635);
 const mesh=(geometry:THREE.BufferGeometry,material:THREE.Material,x:number,y:number,z:number,parent:THREE.Object3D=production)=>{geometries.push(geometry);const m=new THREE.Mesh(geometry,material);m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m};
 const box=(x:number,y:number,z:number,w:number,h:number,d:number,m=stone,parent:THREE.Object3D=production)=>mesh(new THREE.BoxGeometry(w,h,d),m,x,y,z,parent);
 const cylinder=(x:number,y:number,z:number,r:number,h:number,m:THREE.Material,parent:THREE.Object3D=production)=>mesh(new THREE.CylinderGeometry(r,r,h,24),m,x,y,z,parent);
 const pipe=(a:THREE.Vector3,b:THREE.Vector3,r=.13,m=brass)=>{const delta=b.clone().sub(a);const obj=mesh(new THREE.CylinderGeometry(r,r,delta.length(),12),m,...a.clone().add(b).multiplyScalar(.5).toArray() as [number,number,number]);obj.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),delta.normalize());return obj};
 box(0,-.5,0,22,1,18,dark);
 for(let x=-10;x<=10;x+=1)for(let z=-8;z<=8;z+=1)box(x,0,z,.97,.12,.97,stone);
 for(let y=.55;y<7;y+=.8)for(let x=-10.5;x<11;x+=1.5){box(x+(Math.floor(y/.8)%2)*.35,y,-8.6,1.44,.75,.6,stone)}
 for(let y=.55;y<7;y+=.8)for(let z=-8;z<=7;z+=1.5)box(-10.8,y,z,.6,.75,1.44,stone);
 for(const x of [-9,-4,1,6,10]){box(x,3.7,-8.1,.48,7.4,.7,dark);box(x,7.3,-8.1,.8,.25,1,brass)}
 // Glowing windows and upper service gallery.
 for(const x of [-7,-2,3,8]){box(x,5.2,-8.2,1.55,2.3,.2,amber);box(x,5.2,-7.99,.12,2.5,.12,brass);box(x,5.2,-7.99,1.7,.12,.12,brass);const light=new THREE.PointLight(0xffa344,14,8);light.position.set(x,5,-7);scene.add(light)}
 box(0,3.45,-6.5,20,.35,2.3,dark);box(0,3.7,-5.35,20,.12,.16,brass);
 for(let x=-10;x<=10;x+=1.25)box(x,4.1,-5.35,.08,.9,.08,trim);
 box(0,4.55,-5.35,20,.1,.1,trim);
 for(let i=0;i<11;i++)box(-9.3,.16*(i+1),4.6-i*.95,1.6,.32*(i+1),.94,stone);
 pipe(new THREE.Vector3(-10.1,1.2,4.8),new THREE.Vector3(-10.1,4.7,-3.5),.07,trim);
 const labels:HTMLButtonElement[]=[];const anchors:THREE.Vector3[]=[];const selectable:THREE.Object3D[]=[];
 const equipment=(name:string,index:number,x:number,y:number,z:number)=>{const group=new THREE.Group();(index<4?production:research).add(group);group.userData.equipment=index;selectable.push(group);const label=document.createElement('button');label.className='three-label';label.textContent=name;label.setAttribute('aria-label',name+'を選択');label.addEventListener('click',()=>onSelect(index));host.appendChild(label);labels.push(label);anchors.push(new THREE.Vector3(x,y+(index<4?0:11),z));return group};
 const tanks=equipment('培養槽',0,-4.8,4.3,-2.4);
 const glass=new THREE.MeshPhysicalMaterial({color:0xcc9fff,transparent:true,opacity:.2,roughness:.12,metalness:.05,depthWrite:false,side:THREE.DoubleSide});materials.push(glass);
 const bubbles:{mesh:THREE.Mesh;base:number;phase:number}[]=[];
 for(let i=0;i<3;i++){
  const x=-7+i*2.2,z=-2.8;box(x,.35,z,1.9,.7,2.2,dark,tanks);cylinder(x,.85,z,.8,.22,brass,tanks);cylinder(x,2.05,z,.68,2.2,glass,tanks);cylinder(x,1.1,z,.62,.18,violet,tanks);cylinder(x,3.2,z,.8,.25,trim,tanks);cylinder(x,3.5,z,.5,.3,brass,tanks);
  for(const dx of [-.72,.72])box(x+dx,2,z,.1,2.5,.15,brass,tanks);
  pipe(new THREE.Vector3(x,3.65,z),new THREE.Vector3(x,3.65,-4.5));pipe(new THREE.Vector3(x,3.65,-4.5),new THREE.Vector3(x,.5,-4.5));
  for(let j=0;j<6;j++){const bubble=mesh(new THREE.SphereGeometry(.055+j*.006,8,6),violet,x+Math.sin(j*3)*.35,1.3+j*.25,z+Math.cos(j*2)*.3,tanks);bubbles.push({mesh:bubble,base:1.2,phase:j*.7+i})}
 }
 const assembly=equipment('器官接合機',1,-3,3,3);box(-3,.6,3,3.5,1.2,2.8,dark,assembly);box(-3,1.3,3,3.2,.3,2.6,brass,assembly);
 for(const x of [-4.2,-1.8]){box(x,2.2,3,.25,2,.3,trim,assembly);box(x,2.8,3,1.1,.25,.3,brass,assembly);cylinder(x,1.65,3,.3,.6,violet,assembly)}
 box(-3,2.1,3,1.3,1.4,1.5,stone,assembly);box(-3,2.25,3.78,.8,.65,.05,violet,assembly);
 const inspection=equipment('品質検査装置',2,2,2.9,4.5);
 for(const x of [.8,3.2]){box(x,1.25,4.5,.5,2.5,.7,stone,inspection);box(x,1.3,4.08,.12,1.7,.06,violet,inspection)}box(2,2.6,4.5,2.9,.5,.8,brass,inspection);
 const scanner=box(2,2.1,4.5,1.8,.05,.6,violet,inspection);
 const gate=equipment('出撃ゲート',3,7,4.4,1.2);
 for(const x of [5.5,8.5]){box(x,1.9,1.2,.7,3.8,1.1,stone,gate);cylinder(x,4,1.2,.33,.4,trim,gate)}box(7,3.8,1.2,3.8,.6,1.2,stone,gate);
 const portal=mesh(new THREE.TorusGeometry(1.27,.15,12,64),violet,7,2,1.1,gate);const portalInner=mesh(new THREE.CircleGeometry(1.22,48),mat(0x351251,0,.5,0x31064b),7,2,1.12,gate);
 box(7,.2,2.6,3.1,.4,2.1,dark,gate);for(let i=0;i<4;i++)box(7,.42,1.9+i*.4,2.5,.02,.08,violet,gate);
 // Conveyor circuit, small carriers, lamps and storage props.
 const path=[new THREE.Vector3(-6,.55,-.5),new THREE.Vector3(-6,.55,3),new THREE.Vector3(-3,.55,3),new THREE.Vector3(-.2,.55,3),new THREE.Vector3(-.2,.55,5.5),new THREE.Vector3(4.4,.55,5.5),new THREE.Vector3(4.4,.55,2),new THREE.Vector3(7,.55,2)];
 for(let i=1;i<path.length;i++){const a=path[i-1],b=path[i],length=a.distanceTo(b),mid=a.clone().add(b).multiplyScalar(.5),horizontal=Math.abs(a.x-b.x)>.1;box(mid.x,.4,mid.z,horizontal?length:1,.35,horizontal?1:length,dark);for(let p=0;p<length;p+=.35){const v=a.clone().lerp(b,p/length);const roller=cylinder(v.x,.62,v.z,.06,.85,brass);roller.rotation.z=horizontal?0:Math.PI/2;roller.rotation.x=horizontal?Math.PI/2:0}}
 const curve=new THREE.CurvePath<THREE.Vector3>();for(let i=1;i<path.length;i++)curve.add(new THREE.LineCurve3(path[i-1],path[i]));
 const carriers=Array.from({length:7},()=>box(0,.8,0,.5,.3,.5,brass));
 for(const [x,z] of [[8,6],[9,5],[-7,6],[8,-4]]){box(x,.5,z,1,1,1,wood);box(x,1.03,z,1.07,.1,1.07,brass);box(x,1.15,z,.35,.3,.35,violet)}
 for(const [x,z] of [[-8,6],[9,6],[9,-5]]){cylinder(x,1,z,.1,2,brass);box(x,2.2,z,.4,.6,.4,amber);const light=new THREE.PointLight(0xffaa50,10,6);light.position.set(x,2.5,z);scene.add(light)}

 box(0,-.5,0,22,1,18,dark,research);
 for(let x=-10;x<=10;x++)for(let z=-8;z<=8;z++)box(x,0,z,.97,.12,.97,stone,research);
 for(let y=.55;y<7;y+=.8)for(let x=-10.5;x<11;x+=1.5)box(x,y,-8.6,1.44,.75,.6,stone,research);
 for(let y=.55;y<7;y+=.8)for(let z=-8;z<8;z+=1.5)box(-10.8,y,z,.6,.75,1.44,stone,research);
 const books=[mat(0x6b284d),mat(0x273d64),mat(0x426755)];
 for(const x of [-7,-2,3,8]){
  box(x,2.5,-7.6,3.5,5,.8,wood,research);
  for(let shelf=0;shelf<4;shelf++){box(x,.7+shelf*1.1,-7,3.5,.12,1.1,brass,research);for(let b=0;b<9;b++)box(x-1.4+b*.34,1.05+shelf*1.1,-7,.23,.5+(b%3)*.12,.5,books[b%3],research)}
 }
 const desk=equipment('設計台',4,-2,2.8,2);
 box(-2,1.5,2,5,.3,3,wood,desk);for(const x of [-4,0])for(const z of [.8,3.2])box(x,.75,z,.3,1.5,.3,brass,desk);
 const paper=mat(0xd7c6a3);box(-2,1.68,2,2.8,.03,1.8,paper,desk);
 for(let i=0;i<4;i++)box(-2,1.71,1.5+i*.3,2,.01,.025,brass,desk);
 const ring=mesh(new THREE.TorusGeometry(.6,.035,8,32),violet,-2,2.4,2,desk);ring.rotation.x=Math.PI/2;
 const archive=equipment('器官標本庫',5,5,3.8,-1);
 box(5,.5,-1,4,1,2,wood,archive);
 for(let i=0;i<3;i++){const x=3.7+i*1.3;cylinder(x,1.8,-1,.45,2,glass,archive);cylinder(x,.9,-1,.5,.15,brass,archive);cylinder(x,2.85,-1,.5,.2,brass,archive);mesh(new THREE.OctahedronGeometry(.28),violet,x,1.8,-1,archive)}
 const researchLight=new THREE.PointLight(0xb98aff,25,16);researchLight.position.set(-2,6,2);research.add(researchLight);
 for(const x of [-8,8]){cylinder(x,1.3,5,.12,2.6,brass,research);box(x,2.8,5,.5,.7,.5,amber,research)}
 box(-8.5,.1,3,2,.15,3,brass,research);
 for(let i=0;i<5;i++)box(-8.5,.12*i,3-i*.4,1.5,.2,.35,stone,research);
 const stairsButton=document.createElement('button');stairsButton.className='three-label floor-stairs';host.appendChild(stairsButton);stairsButton.addEventListener('click',()=>onFloor(currentFloor==='production'?'research':'production'));
 const setFloor=(floor:FloorId)=>{autoMoving=true;currentFloor=floor;production.visible=floor==='production';research.visible=floor==='research';const y=floor==='research'?11:0;desiredPosition.set(23,25+y,29);desiredTarget.set(0,1+y,0);stairsButton.textContent=floor==='production'?'階段 → 研究フロア':'階段 → 製造フロア';host.dataset.floor=floor};
 setFloor('production');
 const selection=new THREE.Box3Helper(new THREE.Box3(),0xffdf84);scene.add(selection);let selected=0;
 const setSelected=(index:number,focus=true)=>{selected=index;const targetFloor=index<4?'production':'research';if(currentFloor!==targetFloor)setFloor(targetFloor);if(focus){autoMoving=true;desiredTarget.copy(anchors[index]).add(new THREE.Vector3(0,-1,0));desiredPosition.copy(desiredTarget).add(new THREE.Vector3(14,15,19));}selection.box.setFromObject(selectable[index]);labels.forEach((l,i)=>l.setAttribute('aria-pressed',String(i===index)))};setSelected(0,false);
 const raycaster=new THREE.Raycaster();let down={x:0,y:0};const pointerDown=(e:PointerEvent)=>{down={x:e.clientX,y:e.clientY}};const click=(e:PointerEvent)=>{if(Math.hypot(e.clientX-down.x,e.clientY-down.y)>5)return;const rect=renderer.domElement.getBoundingClientRect();raycaster.setFromCamera(new THREE.Vector2((e.clientX-rect.left)/rect.width*2-1,-(e.clientY-rect.top)/rect.height*2+1),camera);const hit=raycaster.intersectObjects(selectable.filter((_,i)=>(i<4)===(currentFloor==="production")),true)[0];if(hit){let o:THREE.Object3D|null=hit.object;while(o&&o.userData.equipment===undefined)o=o.parent;if(o)onSelect(o.userData.equipment)}};
 renderer.domElement.addEventListener('pointerdown',pointerDown);renderer.domElement.addEventListener('pointerup',click);
 const resize=()=>{const w=host.clientWidth,h=host.clientHeight;if(!w||!h)return;renderer.setSize(w,h);camera.aspect=w/h;camera.updateProjectionMatrix()};const observer=new ResizeObserver(resize);observer.observe(host);resize();
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');const start=performance.now();let frame=0;
 const animate=()=>{frame=requestAnimationFrame(animate);const t=reduced.matches?0:(performance.now()-start)/1000;if(autoMoving){camera.position.lerp(desiredPosition,reduced.matches?1:.085);controls.target.lerp(desiredTarget,reduced.matches?1:.085);if(camera.position.distanceToSquared(desiredPosition)+controls.target.distanceToSquared(desiredTarget)<.00001){camera.position.copy(desiredPosition);controls.target.copy(desiredTarget);autoMoving=false}}controls.update();bubbles.forEach(b=>{b.mesh.position.y=b.base+(t*.35+b.phase)%1.7});scanner.position.y=.6+(Math.sin(t*1.5)+1)*.8;portal.rotation.z=t*.15;portalInner.rotation.z=-t*.1;carriers.forEach((c,i)=>{c.position.copy(curve.getPoint((t*.025+i/7)%1));c.position.y=.85});selection.box.setFromObject(selectable[selected]);renderer.render(scene,camera);anchors.forEach((v,i)=>{const p=v.clone().project(camera);labels[i].style.left=((p.x+1)*host.clientWidth/2)+'px';labels[i].style.top=((-p.y+1)*host.clientHeight/2)+'px';labels[i].hidden=p.z>1||(i<4)!==(currentFloor==='production')});const sp=new THREE.Vector3(-9,3+(currentFloor==='research'?11:0),2).project(camera);stairsButton.style.left=Math.max(100,Math.min(host.clientWidth-100,(sp.x+1)*host.clientWidth/2))+'px';stairsButton.style.top=Math.max(80,Math.min(host.clientHeight-40,(-sp.y+1)*host.clientHeight/2))+'px'};animate();
 return {setSelected,setFloor,reset:()=>setFloor(currentFloor),dispose:()=>{cancelAnimationFrame(frame);observer.disconnect();controls.removeEventListener("start",manualStart);controls.dispose();renderer.domElement.removeEventListener('pointerdown',pointerDown);renderer.domElement.removeEventListener('pointerup',click);geometries.forEach(g=>g.dispose());materials.forEach(m=>m.dispose());selection.geometry.dispose();(selection.material as THREE.Material).dispose();renderer.dispose();renderer.domElement.remove();labels.forEach(l=>l.remove());stairsButton.remove()}};
}





