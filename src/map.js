/* Canvas cartography: bundled public-domain coastlines, original synthetic provinces. */
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
const bounds={minZoom:.65,maxZoom:12};
const pointRing=(x,y,ring)=>{let hit=false;for(let i=0,j=ring.length-1;i<ring.length;j=i++){const xi=ring[i][0],yi=ring[i][1],xj=ring[j][0],yj=ring[j][1];if((yi>y)!==(yj>y)&&x<(xj-xi)*(y-yi)/(yj-yi)+xi)hit=!hit;}return hit;};
const pointPolygon=(x,y,rings)=>pointRing(x,y,rings[0])&&!rings.slice(1).some(r=>pointRing(x,y,r));
function inside(x,y,geo){if(geo.type==='Polygon')return pointPolygon(x,y,geo.coordinates);if(geo.type==='MultiPolygon')return geo.coordinates.some(r=>pointPolygon(x,y,r));return false;}
export class CampaignMap{
 constructor(canvas,world,onProvince){this.canvas=canvas;this.ctx=canvas.getContext('2d');this.world=world;this.onProvince=onProvince;this.game=null;this.selected=null;this.hover=null;this.zoom=1.02;this.panX=0;this.panY=0;this.drag=null;this.frame=0;this.drawn=false;
  const obs=new ResizeObserver(()=>this.resize());obs.observe(canvas.parentElement);this.resize();
  canvas.addEventListener('pointerdown',e=>{if(e.button!==0)return;canvas.setPointerCapture(e.pointerId);this.drag={x:e.clientX,y:e.clientY,panX:this.panX,panY:this.panY,dist:0};});
  canvas.addEventListener('pointermove',e=>{if(this.drag){let dx=e.clientX-this.drag.x,dy=e.clientY-this.drag.y;this.drag.dist=Math.max(this.drag.dist,Math.hypot(dx,dy));if(this.drag.dist>4){this.panX=this.drag.panX+dx;this.panY=this.drag.panY+dy;this.render();}return;}
   const p=this.toGeo(e.offsetX,e.offsetY),found=this.pick(p[0],p[1]);if(found?.id!==this.hover?.id){this.hover=found;canvas.style.cursor=found?'crosshair':'grab';this.render();}});
  canvas.addEventListener('pointerup',e=>{if(this.drag?.dist<5){const loc=this.toGeo(e.offsetX,e.offsetY);const p=this.pick(...loc);if(p)this.onProvince(p.id);}this.drag=null;});
  canvas.addEventListener('wheel',e=>{e.preventDefault();let old=this.zoom;let next=clamp(old*Math.exp(-e.deltaY*.0012),bounds.minZoom,bounds.maxZoom);let ax=e.offsetX-this.canvas.clientWidth/2-this.panX,ay=e.offsetY-this.canvas.clientHeight/2-this.panY;this.panX-=ax*(next/old-1);this.panY-=ay*(next/old-1);this.zoom=next;this.render();},{passive:false});
 }
 resize(){const rect=this.canvas.getBoundingClientRect();this.w=Math.max(1,rect.width);this.h=Math.max(1,rect.height);this.dpr=Math.min(window.devicePixelRatio||1,2);this.canvas.width=Math.round(this.w*this.dpr);this.canvas.height=Math.round(this.h*this.dpr);this.render();}
 setGame(g){this.game=g;this.render();}
 select(p){this.selected=p;this.render();}
 focus(lon,lat,z=2.6){this.zoom=z;this.panX=-lon*this.scale();this.panY=lat*this.scale();this.render();}
 scale(){return Math.min(this.w/355,this.h/150)*this.zoom;}
 toScreen(lon,lat){const s=this.scale();return [this.w/2+this.panX+lon*s,this.h/2+this.panY-lat*s];}
 toGeo(x,y){const s=this.scale();return [(x-this.w/2-this.panX)/s,(this.h/2+this.panY-y)/s];}
 pick(x,y){for(let i=this.world.provinces.length-1;i>=0;i--){let p=this.world.provinces[i];if(inside(x,y,p.geometry))return p;}return null;}
 render(){if(!this.ctx||!this.w||!this.h)return;const c=this.ctx,w=this.w,h=this.h,s=this.scale();c.setTransform(this.dpr,0,0,this.dpr,0,0);c.clearRect(0,0,w,h);
  const bg=c.createLinearGradient(0,0,w,h);bg.addColorStop(0,'#0c2830');bg.addColorStop(.56,'#102c35');bg.addColorStop(1,'#091c25');c.fillStyle=bg;c.fillRect(0,0,w,h);
  c.strokeStyle='rgba(194,176,123,.075)';c.lineWidth=1;
  for(let lon=-180;lon<=180;lon+=15){const [x]=this.toScreen(lon,0);c.beginPath();c.moveTo(x,0);c.lineTo(x,h);c.stroke();}
  for(let lat=-75;lat<=75;lat+=15){const [,y]=this.toScreen(0,lat);c.beginPath();c.moveTo(0,y);c.lineTo(w,y);c.stroke();}
  c.save();c.translate(w/2+this.panX,h/2+this.panY);c.scale(s,-s);
  for(const p of this.world.provinces){let owner=this.game?.provinces[p.id]?.owner||p.owner;let color=this.game?.factions[owner]?.color||this.world.factions.find(f=>f.id===owner)?.color||'#646c68';c.beginPath();this.trace(c,p.geometry);
   c.fillStyle=color;c.globalAlpha=owner===this.game?.player ? .84 : .56;c.fill('evenodd');c.globalAlpha=1;
   c.strokeStyle='rgba(225,219,186,.25)';c.lineWidth=clamp(.8/s,.03,.42);c.stroke();
  }
  // Fortifications, capital settlements and army markers.
  for(const f of this.world.factions){let [x,y]=f.capital;if(s*this.zoom<0)continue;c.beginPath();c.arc(x,y,clamp(2.8/s,.3,1.2),0,Math.PI*2);c.fillStyle='#ead7ab';c.globalAlpha=.9;c.fill();c.globalAlpha=1;}
  const sel=this.world.provinces.find(p=>p.id===this.selected);if(sel){c.beginPath();this.trace(c,sel.geometry);c.fillStyle='rgba(244,197,106,.16)';c.fill('evenodd');c.lineWidth=2.5/s;c.strokeStyle='#ffe1a0';c.stroke();}
  const over=this.hover;if(over&&over.id!==this.selected){c.beginPath();this.trace(c,over.geometry);c.lineWidth=1.9/s;c.strokeStyle='rgba(255,236,185,.75)';c.stroke();}
  c.restore();
  // Macro regions and key states — labels adapt to map zoom.
  c.font=`${this.zoom>=2?600:500} ${Math.max(9,Math.min(14,10+this.zoom*.8))}px Georgia,serif`;c.textAlign='center';c.textBaseline='middle';
  const used=[];for(const f of this.world.factions){const [x,y]=this.toScreen(...f.capital);if(x<40||x>w-40||y<22||y>h-22)continue;
   if(this.zoom<1.4&&!['england','ottomans','france','ming','delhi','inca','mali','ashikaga','mexica','timurids','vijayanagara','ethiopia'].includes(f.id))continue;
   if(used.some(([px,py])=>Math.abs(px-x)<75&&Math.abs(py-y)<20))continue;
   used.push([x,y]);c.strokeStyle='rgba(11,23,24,.82)';c.lineWidth=3.2;c.strokeText(f.name,x,y+13);c.fillStyle='#eee3c4';c.fillText(f.name,x,y+13);
  }
  if(this.zoom<1.65){for(const [lon,lat,label] of [[-37,7,'ATLANTIC OCEAN'],[76,-31,'INDIAN OCEAN'],[-145,-1,'PACIFIC OCEAN']]){const [x,y]=this.toScreen(lon,lat);c.font='italic 12px Georgia,serif';c.fillStyle='rgba(146,192,191,.32)';c.fillText(label,x,y);}}
  // Scale and lower-left geo notation.
  c.font='11px ui-monospace,monospace';c.textAlign='left';c.fillStyle='rgba(216,213,190,.48)';c.fillText(`1450 · POLITICAL MAP · ${this.world.provinces.length} PROVINCES · EXPERIMENTAL BORDERS`,17,h-17);
  if(this.hover){const [x,y]=this.toScreen(...this.hover.centroid);const own=this.game?.provinces[this.hover.id]?.owner||this.hover.owner;const name=this.game?.factions[own]?.name||this.world.factions.find(f=>f.id===own)?.name||'Independent Polities';let label=`${this.hover.id.toUpperCase()} · ${name}`;c.font='12px sans-serif';const tx=clamp(x+14,10,w-c.measureText(label).width-30),ty=clamp(y-15,15,h-25);c.fillStyle='rgba(4,15,20,.87)';c.fillRect(tx-6,ty-12,c.measureText(label).width+15,24);c.fillStyle='#f4e3bb';c.fillText(label,tx,ty+3);}
 }
 trace(c,geo){const rings=geo.type==='Polygon'?[geo.coordinates]:geo.coordinates;for(const polygon of rings){for(const ring of polygon){if(!ring.length)continue;c.moveTo(ring[0][0],ring[0][1]);for(let i=1;i<ring.length;i++)c.lineTo(ring[i][0],ring[i][1]);c.closePath();}}}
}
