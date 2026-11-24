import {pickArmyMarker} from './campaign-hud.js';
import {geographicIndex,seatSignature,frameCoalescer} from './render-performance.js';
import {capitalDistrict} from './historical-world.js';
import {occupation} from './campaign-war.js';
import {ReliefMap} from './relief-map.js';
import {
 atlasPaper,atlasColor,buildDecorativeCounties,drawGeoPath,drawSea,drawLand,
 drawTopography,drawDivisions,drawRosette,atlasBorders,drawSettlement,drawOceanLettering,buildAtlasEdges,drawPoliticalEdges,atlasArmyGroups
} from './atlas-art.js';

/** Crown of Nations — living political atlas over the existing campaign game. */
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n)),bounds={minZoom:.55,maxZoom:16};
function pointRing(x,y,ring){let hit=false;for(let i=0,j=ring.length-1;i<ring.length;j=i++){const xi=ring[i][0],yi=ring[i][1],xj=ring[j][0],yj=ring[j][1];if((yi>y)!==(yj>y)&&x<(xj-xi)*(y-yi)/(yj-yi)+xi)hit=!hit;}return hit;}
function pointPolygon(x,y,rings){return pointRing(x,y,rings[0])&&!rings.slice(1).some(r=>pointRing(x,y,r));}
export function inside(x,y,geo){if(geo?.type==='Polygon')return pointPolygon(x,y,geo.coordinates);if(geo?.type==='MultiPolygon')return geo.coordinates.some(r=>pointPolygon(x,y,r));return false;}
function polityColor(i){const palette=['#a7b6a0','#bc9eaa','#d7b778','#b2a6ce','#b3b18e','#9eb9ba','#caa19a','#a7c0a0','#d7b99f','#b6a7bf','#ccb18c','#a6b0a3','#d3a4a5','#bfcca0'];return palette[(i*7+Math.floor(i/7))%palette.length];}
function areaOf(geo){if(!geo)return 0;const ring=geo.type==='Polygon'?geo.coordinates[0]:geo.type==='MultiPolygon'?geo.coordinates[0]?.[0]:null;if(!ring)return 0;let total=0;for(let j=0;j<ring.length;j++){const a=ring[j],b=ring[(j+1)%ring.length];total+=a[0]*b[1]-b[0]*a[1];}return Math.abs(total)/2;}
function centerOf(geo){const points=geo?.type==='Polygon'?geo.coordinates[0]:geo?.type==='MultiPolygon'?geo.coordinates[0]?.[0]:[];if(!points?.length)return [0,0];let x0=Infinity,x1=-Infinity,y0=Infinity,y1=-Infinity;for(const [x,y] of points){x0=Math.min(x0,x);x1=Math.max(x1,x);y0=Math.min(y0,y);y1=Math.max(y1,y);}return [(x0+x1)/2,(y0+y1)/2];}

export class CampaignMap{
 constructor(canvas,world,onProvince){
  this.canvas=canvas;this.ctx=canvas.getContext('2d');this.world=world;this.onProvince=onProvince;
  this.game=null;this.selected=null;this.hover=null;this.hoverHistorical=null;
  this.zoom=1.02;this.panX=0;this.panY=0;this.drag=null;this.mode='political';this.history=null;this.useRelief=true;
  this.counties=buildDecorativeCounties(world);this.edges=buildAtlasEdges(world);this.provinceIndex=new Map(world.provinces.map(p=>[p.id,p]));this.ownerColors=Object.fromEntries(world.factions.map(f=>[f.id,f.color]));this.paper=this.ctx?atlasPaper(this.ctx):null;
  this.dirty=true;this.geoIndex=geographicIndex(world.provinces);this.countyIndex=new Map(this.counties.map(c=>[c.id,c]));this.requestDraw=frameCoalescer(cb=>requestAnimationFrame(cb),()=>this.drawFrame());
  const terrainCanvas=document.getElementById('terrain-map');this.terrain=terrainCanvas?new ReliefMap(terrainCanvas,()=>this.render(),world):null;
  const obs=new ResizeObserver(()=>this.resize());obs.observe(canvas.parentElement);this.resize();
  this.pointers=new Map();this.pinching=false;const local=e=>{const r=canvas.getBoundingClientRect();return [e.clientX-r.left,e.clientY-r.top];};
  canvas.addEventListener('pointerdown',e=>{if(e.button!==0)return;canvas.setPointerCapture(e.pointerId);this.pointers.set(e.pointerId,local(e));if(this.pointers.size===1){this.pinching=false;this.drag={x:e.clientX,y:e.clientY,px:this.panX,py:this.panY,distance:0};}else{this.pinching=true;this.drag=null;this.pinch=this.pinchState();}});
  canvas.addEventListener('pointermove',e=>{if(this.pointers.has(e.pointerId))this.pointers.set(e.pointerId,local(e));if(this.pointers.size>=2){const next=this.pinchState();if(this.pinch&&next.distance>0){this.panX+=next.x-this.pinch.x;this.panY+=next.y-this.pinch.y;this.zoomAt(next.x,next.y,next.distance/Math.max(1,this.pinch.distance));}this.pinch=next;return;}if(this.pinching)return;
   if(this.drag){const dx=e.clientX-this.drag.x,dy=e.clientY-this.drag.y;this.drag.distance=Math.max(this.drag.distance,Math.hypot(dx,dy));if(this.drag.distance>3){this.panX=this.drag.px+dx;this.panY=this.drag.py+dy;this.render();}return;}if(e.pointerType==='touch')return;
   const p=this.toGeo(...local(e)),found=this.pick(...p),historical=this.mode==='historical'?this.pickHistorical(...p):null;if(found?.id!==this.hover?.id||historical?.properties?.name!==this.hoverHistorical?.properties?.name){this.hover=found;this.hoverHistorical=historical;canvas.style.cursor=found?'crosshair':'grab';this.render();}});
  const end=(e,cancel=false)=>{if(!cancel&&!this.pinching&&this.drag?.distance<5){const [x,y]=local(e),marker=!this.marchOrigin&&pickArmyMarker(this.armyMarkers||[],x,y);if(marker&&this.onArmy)this.onArmy(marker);else{const province=this.pick(...this.toGeo(x,y));if(province)this.onProvince(province.id);}}this.pointers.delete(e.pointerId);this.drag=null;this.pinch=null;if(!this.pointers.size)this.pinching=false;};
  canvas.addEventListener('pointerup',e=>end(e));canvas.addEventListener('pointercancel',e=>end(e,true));
  canvas.addEventListener('wheel',e=>{e.preventDefault();this.zoomAt(e.offsetX,e.offsetY,Math.exp(-e.deltaY*.00122));},{passive:false});
 }
 pinchState(){const [a,b]=[...this.pointers.values()];return {x:(a[0]+b[0])/2,y:(a[1]+b[1])/2,distance:Math.hypot(a[0]-b[0],a[1]-b[1])};}
 zoomAt(x,y,factor){const old=this.zoom,next=clamp(old*factor,bounds.minZoom,bounds.maxZoom);const dx=x-this.w/2-this.panX,dy=y-this.h/2-this.panY;this.panX-=dx*(next/old-1);this.panY-=dy*(next/old-1);this.zoom=next;this.render();}
 resize(){const r=this.canvas.getBoundingClientRect();this.w=Math.max(1,r.width);this.h=Math.max(1,r.height);this.dpr=Math.min(window.devicePixelRatio||1,window.matchMedia?.('(pointer: coarse)').matches?1.5:2);const width=Math.round(this.w*this.dpr),height=Math.round(this.h*this.dpr);if(this.canvas.width!==width||this.canvas.height!==height){this.canvas.width=width;this.canvas.height=height;}this.render();}
 setWorld(world){this.world=world;this.geoIndex=geographicIndex(world.provinces);this.seatCache=null;this.game=null;this.selected=null;this.hover=null;this.hoverHistorical=null;this.counties=buildDecorativeCounties(world);this.edges=buildAtlasEdges(world);this.provinceIndex=new Map(world.provinces.map(p=>[p.id,p]));this.ownerColors=Object.fromEntries(world.factions.map(f=>[f.id,f.color]));this.countyIndex=new Map(this.counties.map(c=>[c.id,c]));if(this.terrain)this.terrain.world=world;this.render();}
 setGame(g){this.game=g;this.render();}
 setHistorical(data){this.history=data?.features?data:null;this.historyIndex=this.history?geographicIndex(this.history.features):null;this.historyLabels=this.history?.features.map((f,i)=>({f,i,area:areaOf(f.geometry),point:centerOf(f.geometry)})).filter(o=>o.area>1.8).sort((a,b)=>b.area-a.area)||[];this.render();}
 setMode(mode){if(!['political','terrain','historical'].includes(mode))return;this.mode=mode;this.render();}
 setRelief(v){this.useRelief=Boolean(v);this.render();}
 get compression(){return this.useRelief&&this.terrain?.ready?0.82:1;}
 select(id){this.selected=id;this.render();}
 setMarchOrigin(id){this.marchOrigin=id;this.render();}
 focus(lon,lat,z=2.6){this.zoom=clamp(z,bounds.minZoom,bounds.maxZoom);this.panX=-lon*this.scale();this.panY=lat*this.scale()*this.compression;this.render();}
 focusOldWorld(){this.focus(56,33,2.05);}
 scale(){return Math.min(this.w/355,this.h/150)*this.zoom;}
 toScreen(lon,lat){const s=this.scale();return [this.w/2+this.panX+lon*s,this.h/2+this.panY-lat*s*this.compression];}
 toGeo(x,y){const s=this.scale();return [(x-this.w/2-this.panX)/s,(this.h/2+this.panY-y)/(s*this.compression)];}
 pick(x,y){return this.geoIndex.pick(x,y,inside);}
 pickHistorical(x,y){return this.historyIndex?.pick(x,y,inside)||null;}
 trace(ctx,geo){drawGeoPath(ctx,geo);}
 _drawProvinceColors(c,s,provinces=this.world.provinces){
  c.save();c.lineJoin='round';for(const p of provinces){
   const owner=this.game?.provinces?.[p.id]?.owner??p.owner;
   c.beginPath();drawGeoPath(c,p.geometry);c.fillStyle=atlasColor(this.game?.factions?.[owner]?.color||this.ownerColors[owner]||'#b4b09a',owner===this.game?.player?.toString()? .10:.23);
   c.globalAlpha=owner===this.game?.player?0.96:0.84;c.fill('evenodd');c.globalAlpha=1;
   c.lineWidth=clamp(.72/s,.025,.32);c.strokeStyle='rgba(54,43,31,.30)';c.stroke();
   const o=occupation(this.game||{},p.id);if(o){c.save();c.strokeStyle=this.game.factions[o.by]?.color||'#c18e48';c.lineWidth=clamp(3/s,.13,1.2);c.setLineDash([4/s,2/s]);c.stroke();c.restore();}
  }c.restore();
 }
 _drawHistorical(c,s,viewport){
  if(!this.history?.features?.length)return;
  c.save();c.lineJoin='round';
  const candidates=new Set(this.historyIndex.query(viewport));for(let i=0;i<this.history.features.length;i++){const f=this.history.features[i];if(!candidates.has(f))continue;c.beginPath();drawGeoPath(c,f.geometry);c.fillStyle=polityColor(i);c.globalAlpha=.83;c.fill('evenodd');c.globalAlpha=1;c.strokeStyle='rgba(55,44,35,.75)';c.lineWidth=clamp(1.35/s,.06,.65);c.stroke();}
  c.restore();
 }
 _markArmy(c,a,offset=0){const province=this.provinceIndex.get(a.province);if(!province)return;
  const [x,y]=this.toScreen(...province.centroid);if(x<20||y<32||x>this.w-25||y>this.h-30)return;
  const mine=a.owner===this.game?.player;
  this.armyMarkers??=[];const marker={province:a.province,owner:a.owner,troops:a.troops,x:x+offset,y:y-15,halfWidth:11,bottom:12};this.armyMarkers.push(marker);
  c.save();c.translate(x+offset,y-15);c.shadowColor='rgba(26,29,20,.58)';c.shadowBlur=5;c.fillStyle=mine?'#c9a04d':'#6c5c55';c.strokeStyle='#2e3430';c.lineWidth=1.3;
  c.beginPath();c.moveTo(-6,-12);c.lineTo(6,-12);c.lineTo(6,5);c.lineTo(0,11);c.lineTo(-6,5);c.closePath();c.fill();c.stroke();c.shadowBlur=0;
  c.fillStyle='#ede4c7';c.font='bold 10px Georgia';c.textAlign='center';c.textBaseline='middle';c.fillText('⚔',0,-2);if(this.zoom>=2.1||mine){const text=a.troops>=1000?(a.troops/1000).toFixed(1).replace(/\.0$/,'')+'k':String(a.troops);c.font='bold 10px system-ui';const w=c.measureText(text).width+10;marker.halfWidth=Math.max(11,w/2);marker.bottom=29;c.fillStyle=mine?'#423820':'#3b3834';c.fillRect(-w/2,13,w,15);c.fillStyle='#fff0c8';c.fillText(text,0,20);}c.restore();
 }
 _realmSeats(){const key=seatSignature(this.world,this.game);if(this.seatCache?.key===key)return this.seatCache.value;const factions=this.game?Object.values(this.game.factions).filter(f=>f.id!=='independent'&&f.capital):this.world.factions;const states=this.game?.provinces,world={...this.world,factions},by=new Map(world.provinces.map(p=>[p.id,p]));const value=factions.map(f=>{const seat=capitalDistrict(world,f.id,states);return seat?{f,point:by.get(seat.id).centroid,count:world.provinces.filter(p=>(states?states[p.id]?.owner:p.owner)===f.id).length}:null;}).filter(Boolean).sort((a,b)=>b.count-a.count||a.f.id.localeCompare(b.f.id));this.seatCache={key,value};return value;}
 _labels(c,s,seats){
  c.save();c.textAlign='center';c.textBaseline='middle';const used=[];
  if(this.mode==='historical'&&this.history){
   const entries=this.historyLabels;
   for(const {f,area,point} of entries){const [x,y]=this.toScreen(...point);if(x<38||y<40||x>this.w-38||y>this.h-48)continue;
    const text=String(f.properties.name||'').toUpperCase(),font=clamp(10+Math.sqrt(area)*.48,11,17);c.font='600 '+font+'px Georgia';
    const width=c.measureText(text).width;if(used.some(v=>Math.abs(x-v[0])<Math.max(width,v[2])*.56&&Math.abs(y-v[1])<20))continue;
    c.lineWidth=3.2;c.strokeStyle='rgba(240,222,182,.84)';c.strokeText(text,x,y);c.fillStyle='rgba(45,49,40,.89)';c.fillText(text,x,y);used.push([x,y,width]);if(used.length>65)break;
   }
  }else if(this.mode==='political'){
   for(const {f,point} of seats){const [x,y]=this.toScreen(...point);if(x<22||y<36||x>this.w-22||y>this.h-42)continue;
    if(this.zoom<1.6&&!['france','england','ottomans','ming','delhi','timurids','mali','inca','ashikaga','mexica','vijayanagara','ethiopia','mamluks'].includes(f.id))continue;
    const label=f.name.toUpperCase(),font=clamp(9+this.zoom*.83,10,16);c.font='bold '+font+'px Georgia,serif';
    const ww=c.measureText(label).width;if(used.some(([px,py,pw])=>Math.abs(x-px)<(ww+pw)*.52&&Math.abs(y-py)<21))continue;
    c.lineWidth=3.5;c.strokeStyle='rgba(227,215,182,.86)';c.strokeText(label,x,y+19);c.fillStyle='#283a34';c.fillText(label,x,y+19);used.push([x,y,ww]);
   }
   if(this.zoom>=5&&this.world.meta?.mapVersion==='atlas-1450-v4'){c.font='11px Georgia';for(const p of this.world.provinces){const [x,y]=this.toScreen(...p.centroid);if(x<38||y<58||x>this.w-38||y>this.h-40)continue;const label=p.name,ww=c.measureText(label).width;if(used.some(([px,py,pw])=>Math.abs(x-px)<(ww+pw)*.53&&Math.abs(y-py)<25))continue;c.lineWidth=2.5;c.strokeStyle='rgba(235,219,185,.85)';c.strokeText(label,x,y);c.fillStyle='#384139';c.fillText(label,x,y);used.push([x,y,ww]);if(used.length>=90)break;}}
  }
  c.restore();
 }
 _cityMarkers(c,seats){c.save();for(const {f,point} of seats){const [x,y]=this.toScreen(...point);if(x<18||y<25||x>this.w-18||y>this.h-35)continue;drawSettlement(c,x,y,this.game?.player===f.id);}c.restore();}
 _hoverTip(c){
  if(!this.hover)return;
  const [cx,cy]=this.toScreen(...this.hover.centroid),state=this.game?.provinces?.[this.hover.id],f=this.game?.factions?.[state?.owner]||this.world.factions.find(f=>f.id===this.hover.owner);
  const text=this.mode==='historical'&&this.hoverHistorical?'1450 SOURCE: '+this.hoverHistorical.properties.name:(this.hover.name+' · '+(f?.name||'Independent'));
  c.font='11px Georgia';const width=clamp(c.measureText(text).width+18,90,this.w-36),x=clamp(cx+13,20,this.w-width-20),y=clamp(cy-25,30,this.h-41);
  c.fillStyle='rgba(38,45,39,.96)';c.strokeStyle='#bc9c66';c.lineWidth=1;c.fillRect(x,y,width,24);c.strokeRect(x,y,width,24);c.fillStyle='#ecdcb9';c.textAlign='left';c.textBaseline='middle';c.fillText(text,x+9,y+12,width-16);
 }
 render(){this.requestDraw?.();}
 drawFrame(){
  if(!this.ctx||!this.w||!this.h)return;
  const c=this.ctx,w=this.w,h=this.h,s=this.scale(),view=(lon,lat)=>this.toScreen(lon,lat),a=this.toGeo(-12,h+12),b=this.toGeo(w+12,-12),viewport=[a[0],a[1],b[0],b[1]],visible=this.geoIndex.query(viewport),visibleWorld={...this.world,provinces:visible};
  const gpu=this.useRelief&&this.mode==='terrain'&&this.terrain?.render(w,h,this.dpr,this.zoom,this.panX,this.panY,this.compression);
  c.setTransform(this.dpr,0,0,this.dpr,0,0);c.clearRect(0,0,w,h);
  if(gpu){c.globalAlpha=.18;drawSea(c,w,h,this.paper);c.globalAlpha=1;}else drawSea(c,w,h,this.paper);
  // Geographic drawing in degrees, with exactly the same transform as picking.
  c.save();c.translate(w*.5+this.panX,h*.5+this.panY);c.scale(s,-s*this.compression);
  c.globalAlpha=gpu?.52:1;drawLand(c,visibleWorld,s);c.globalAlpha=1;
  if(this.mode==='historical'){
   this._drawHistorical(c,s,viewport);
  }else{
   if(this.mode==='political')this._drawProvinceColors(c,s,visible);
   if(this.mode==='terrain'){c.globalAlpha=.36;this._drawProvinceColors(c,s,visible);c.globalAlpha=1;}
   if(this.mode==='political'){drawDivisions(c,visible.map(p=>this.countyIndex.get(p.id)).filter(Boolean),s,this.zoom>=4.5&&this.w>=700);const a=this.toGeo(0,h),b=this.toGeo(w,0);drawPoliticalEdges(c,this.edges,id=>this.game?.provinces?.[id]?.owner??this.provinceIndex.get(id)?.owner,s,[a[0],a[1],b[0],b[1]]);}
  }
  if(this.mode!=='historical')drawTopography(c,visibleWorld,s);
  if(this.marchOrigin&&this.game){const p=this.provinceIndex.get(this.marchOrigin);for(const id of p?.neighbors||[]){const dest=this.provinceIndex.get(id);if(!dest)continue;const friendly=this.game.provinces[id]?.owner===this.game.player;c.beginPath();drawGeoPath(c,dest.geometry);c.fillStyle=friendly?'rgba(105,190,149,.24)':'rgba(222,126,83,.28)';c.fill('evenodd');c.strokeStyle=friendly?'#c2f0b8':'#ffd0a1';c.lineWidth=clamp(2.6/s,.08,.8);c.stroke();}}
  // Borders of selected/hovered playable provinces always remain interactive.
  const selected=this.world.provinces.find(p=>p.id===this.selected);
  if(selected){c.beginPath();drawGeoPath(c,selected.geometry);c.fillStyle='rgba(255,217,126,.14)';c.fill('evenodd');c.lineWidth=clamp(3.4/s,.12,.95);c.strokeStyle='#fff0b7';c.stroke();}
  if(this.hover&&this.hover.id!==this.selected){c.beginPath();drawGeoPath(c,this.hover.geometry);c.lineWidth=clamp(2.5/s,.08,.7);c.strokeStyle='#f9e3ac';c.stroke();}
  c.restore();
  drawOceanLettering(c,view,w,h);
  const seats=this._realmSeats();if(this.mode!=='terrain')this._labels(c,s,seats);
  this._cityMarkers(c,seats);
  this.armyMarkers=[];if(this.game){const groups=atlasArmyGroups(this.game.armies,this.game.naval?.voyages),counts=new Map();for(const a of groups){const n=counts.get(a.province)||0;counts.set(a.province,n+1);this._markArmy(c,a,n*17);}}
  if(w>700&&h>350)drawRosette(c,55,h-75,20);
  // Atlas masthead is ink on translucent parchment; not part of geography.
  c.save();c.fillStyle='rgba(234,217,176,.87)';c.strokeStyle='rgba(102,84,53,.63)';c.lineWidth=1.1;
  const bx=w*.5-111; if(w>=700){c.fillRect(bx,19,222,34);c.strokeRect(bx,19,222,34);
  c.font='bold 13px Georgia';c.textAlign='center';c.fillStyle='#51442f';c.fillText(this.mode==='historical'?'THE HISTORICAL ATLAS':this.mode==='terrain'?'RELIEF OF THE EARTH':'THE KINGDOMS OF 1450',w/2,40);}
  c.restore();if(w>=700)atlasBorders(c,w,h);
  c.font='10px Georgia';c.textAlign='left';c.textBaseline='alphabetic';c.fillStyle='rgba(47,48,38,.83)';
  if(w>=700)c.fillText(this.mode==='historical'?'CLIOPATRIA / SESHAT · CC BY 4.0 · INCOMPLETE COVERAGE':this.mode==='terrain'?'TERRAIN VIEW · STYLIZED RELIEF':'POLITICAL MAP · APPROXIMATE HISTORICAL DISTRICTS',25,h-24);
  this._hoverTip(c);
 }
}
