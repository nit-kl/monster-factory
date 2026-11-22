export const yardBounds = { west:-75, east:78, north:-70, south:26, gate:49, rampHalfWidth:2.8 } as const;

export class FactoryPaths {
  private barriers = new Set<number>();
  private id(x:number,z:number) { return (z+76)*161+x+80; }
  block(left:number,right:number,back:number,front:number) {
    for(let x=Math.ceil(left-0.35);x<=right+0.35;x++)
      for(let z=Math.ceil(back-0.35);z<=front+0.35;z++) this.barriers.add(this.id(x,z));
  }
  open(x:number,z:number) {
    if(z>yardBounds.south) return z<=yardBounds.gate && Math.abs(x)<=yardBounds.rampHalfWidth;
    return x>=yardBounds.west && x<=yardBounds.east && z>=yardBounds.north && !this.barriers.has(this.id(Math.round(x),Math.round(z)));
  }
  route(x:number,z:number,gx:number,gz:number) {
    const sx=Math.round(x), sz=Math.round(z), tx=Math.round(gx), tz=Math.round(gz);
    if(!this.open(gx,gz) || !this.open(tx,tz)) return [];
    const start=this.id(sx,sz), end=this.id(tx,tz);
    const parents=new Map<number,number>([[start,start]]);
    const queue=[start];
    for(let i=0;i<queue.length && !parents.has(end);i++){
      const id=queue[i], cx=id%161-80, cz=Math.floor(id/161)-76;
      for(const [dx,dz] of [[0,-1],[1,0],[-1,0],[0,1]]){
        const nx=cx+dx,nz=cz+dz,next=this.id(nx,nz);
        if(!parents.has(next) && this.open(nx,nz)){parents.set(next,id);queue.push(next);}
      }
    }
    if(!parents.has(end)) return [];
    const points=[{x:gx,z:gz}];
    let dx=0,dz=0;
    for(let id=end;id!==start;){
      const prev=parents.get(id)!, cx=id%161-80, cz=Math.floor(id/161)-76;
      const nx=id%161-prev%161,nz=Math.floor(id/161)-Math.floor(prev/161);
      if(nx!==dx || nz!==dz) points.push({x:cx,z:cz});
      dx=nx;dz=nz;id=prev;
    }
    points.push({x:sx,z:sz});
    return points.reverse();
  }
}

