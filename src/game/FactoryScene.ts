import Phaser from 'phaser';
export class FactoryScene extends Phaser.Scene {
 constructor(){super('factory');}
 preload(){
  this.load.image('lisette','/assets/factory/lisette-v1.png');
  this.load.image('factory','/assets/factory/background-v2.png');
  this.load.image('vargas','/assets/factory/vargas-v1.png');
  this.load.image('orphen','/assets/factory/orphen-v1.png');
  this.load.image('poyon','/assets/factory/poyon-v1.png');
  this.load.image('pluru','/assets/factory/pluru-v1.png');
 }
 create(){
  this.add.image(0,0,'factory').setOrigin(0).setDisplaySize(1000,1000);
  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const lisette=this.add.image(350,845,'lisette').setOrigin(.5,1).setDisplaySize(90,135);
  const vargas=this.add.image(200,790,'vargas').setOrigin(.5,1).setDisplaySize(110,140);
  const orphen=this.add.image(560,340,'orphen').setOrigin(.5,1).setDisplaySize(85,125);
  const poyon=this.add.image(700,825,'poyon').setOrigin(.5,1).setDisplaySize(160,107);
  const pluru=this.add.image(480,835,'pluru').setOrigin(.5,1).setDisplaySize(70,64);
  if(!reduced){
   this.tweens.add({targets:lisette,scaleY:lisette.scaleY*1.01,duration:2000,yoyo:true,repeat:-1});
   this.tweens.add({targets:poyon,scaleY:poyon.scaleY*.96,scaleX:poyon.scaleX*1.025,duration:1500,yoyo:true,repeat:-1,ease:'Sine.easeInOut'});
   this.tweens.add({targets:pluru,y:829,duration:700,yoyo:true,repeat:-1,ease:'Sine.easeInOut'});
   this.tweens.add({targets:vargas,scaleY:vargas.scaleY*1.015,duration:1800,yoyo:true,repeat:-1});
   this.tweens.add({targets:orphen,y:330,duration:1700,yoyo:true,repeat:-1,ease:'Sine.easeInOut'});
  }
  for(let i=0;i<20;i++){
   const x=160+(i%4)*74, y=260+(i%5)*20;
   const bubble=this.add.circle(x,y,2+(i%3),0xf5b5ff,.65);
   if(!reduced)this.tweens.add({targets:bubble,y:y-45,alpha:0,duration:1800+i*70,delay:i*100,repeat:-1});
  }
  const glow=this.add.circle(845,665,31,0xd64bff,.13).setBlendMode(Phaser.BlendModes.ADD);
  if(!reduced)this.tweens.add({targets:glow,alpha:.5,scale:1.35,duration:1600,yoyo:true,repeat:-1});
 }
}

