import {occupation} from './campaign-war.js';
import {ReliefMap} from './relief-map.js';
import {
 atlasPaper,atlasColor,buildDecorativeCounties,drawGeoPath,drawSea,drawLand,
 drawTopography,drawDivisions,drawRosette,atlasBorders,drawSettlement,drawOceanLettering
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
  this.counties=buildDecorativeCounties(world);this.ownerColors=Object.fromEntries(world.factions.map(f=>[f.id,f.color]));this.paper=this.ctx?atlasPaper(this.ctx):null;
  this.dirty=true;
  const terrainCanvas=document.getElementById('terrain-map');this.terrain=terrainCanvas?new ReliefMap(terrainCanvas,()=>this.render(),world):null;
  const obs=new ResizeObserver(()=>this.resize());obs.observe(canvas.parentElement);this.resize();
  canvas.addEventListener('pointerdown',e=>{if(e.button!==0)return;canvas.setPointerCapture(e.pointerId);this.drag={x:e.clientX,y:e.clientY,px:this.panX,py:this.panY,distance:0};});
  canvas.addEventListener('pointermove',e=>{
   if(this.drag){let dx=e.clientX-this.drag.x,dy=e.clientY-this.drag.y;this.drag.distance=Math.max(this.drag.distance,Math.hypot(dx,dy));if(this.drag.distance>3){this.panX=this.drag.px+dx;this.panY=this.drag.py+dy;this.render();}return;}
   const p=this.toGeo(e.offsetX,e.offsetY),found=this.pick(...p),historical=this.mode==='historical'?this.pickHistorical(...p):null;
   if(found?.id!==this.hover?.id||historical?.properties?.name!==this.hoverHistorical?.properties?.name){this.hover=found;this.hoverHistorical=historical;canvas.style.cursor=found?'crosshair':'grab';this.render();}
  });
  canvas.addEventListener('pointerup',e=>{if(this.drag?.distance<5){const province=this.pick(...this.toGeo(e.offsetX,e.offsetY));if(province)this.onProvince(province.id);}this.drag=null;});
  canvas.addEventListener('pointercancel',()=>{this.drag=null;});
  canvas.addEventListener('wheel',e=>{e.preventDefault();const old=this.zoom,next=clamp(old*Math.exp(-e.deltaY*.00122),bounds.minZoom,bounds.maxZoom);
   const dx=e.offsetX-this.w/2-this.panX,dy=e.offsetY-this.h/2-this.panY;
   this.panX-=dx*(next/old-1);this.panY-=dy*(next/old-1);this.zoom=next;this.render();
  },{passive:false});
 }
 resize(){const r=this.canvas.getBoundingClientRect();this.w=Math.max(1,r.width);this.h=Math.max(1,r.height);this.dpr=Math.min(window.devicePixelRatio||1,2);this.canvas.width=Math.round(this.w*this.dpr);this.canvas.height=Math.round(this.h*this.dpr);this.render();}
 setGame(g){this.game=g;this.render();}
 setHistorical(data){this.history=data?.features?data:null;this.render();}
 setMode(mode){if(!['political','terrain','historical'].includes(mode))return;this.mode=mode;this.render();}
 setRelief(v){this.useRelief=Boolean(v);this.render();}
 get compression(){return this.useRelief&&this.terrain?.ready?0.82:1;}
 select(id){this.selected=id;this.render();}
 focus(lon,lat,z=2.6){this.zoom=clamp(z,bounds.minZoom,bounds.maxZoom);this.panX=-lon*this.scale();this.panY=lat*this.scale()*this.compression;this.render();}
 focusOldWorld(){this.focus(56,33,2.05);}
 scale(){return Math.min(this.w/355,this.h/150)*this.zoom;}
 toScreen(lon,lat){const s=this.scale();return [this.w/2+this.panX+lon*s,this.h/2+this.panY-lat*s*this.compression];}
 toGeo(x,y){const s=this.scale();return [(x-this.w/2-this.panX)/s,(this.h/2+this.panY-y)/(s*this.compression)];}
 pick(x,y){for(let i=this.world.provinces.length-1;i>=0;i--){let p=this.world.provinces[i];if(inside(x,y,p.geometry))return p;}return null;}
 pickHistorical(x,y){if(!this.history)return null;for(let i=this.history.features.length-1;i>=0;i--){const f=this.history.features[i];if(inside(x,y,f.geometry))return f;}return null;}
 trace(ctx,geo){drawGeoPath(ctx,geo);}
 _drawProvinceColors(c,s){
  c.save();c.lineJoin='round';for(const p of this.world.provinces){
   const owner=this.game?.provinces?.[p.id]?.owner??p.owner;
   c.beginPath();drawGeoPath(c,p.geometry);c.fillStyle=atlasColor(this.game?.factions?.[owner]?.color||this.ownerColors[owner]||'#b4b09a',.29);
   c.globalAlpha=owner===this.game?.player?0.87:0.77;c.fill('evenodd');c.globalAlpha=1;
   c.lineWidth=clamp(1.35/s,.05,.52);c.strokeStyle='rgba(54,43,31,.50)';c.stroke();
   const o=occupation(this.game||{},p.id);if(o){c.save();c.strokeStyle=this.game.factions[o.by]?.color||'#c18e48';c.lineWidth=clamp(3/s,.13,1.2);c.setLineDash([4/s,2/s]);c.stroke();c.restore();}
  }c.restore();
 }
 _drawHistorical(c,s){
  if(!this.history?.features?.length)return;
  c.save();c.lineJoin='round';
  for(let i=0;i<this.history.features.length;i++){const f=this.history.features[i];c.beginPath();drawGeoPath(c,f.geometry);c.fillStyle=polityColor(i);c.globalAlpha=.83;c.fill('evenodd');c.globalAlpha=1;c.strokeStyle='rgba(55,44,35,.75)';c.lineWidth=clamp(1.35/s,.06,.65);c.stroke();}
  c.restore();
 }
 _markArmy(c,a){const province=this.world.provinces.find(p=>p.id===a.province);if(!province)return;
  const [x,y]=this.toScreen(...province.centroid);if(x<20||y<32||x>this.w-25||y>this.h-30)return;
  const mine=a.owner===this.game?.player;
  c.save();c.translate(x,y-15);c.shadowColor='rgba(26,29,20,.58)';c.shadowBlur=5;c.fillStyle=mine?'#c9a04d':'#6c5c55';c.strokeStyle='#2e3430';c.lineWidth=1.3;
  c.beginPath();c.moveTo(-6,-12);c.lineTo(6,-12);c.lineTo(6,5);c.lineTo(0,11);c.lineTo(-6,5);c.closePath();c.fill();c.stroke();c.shadowBlur=0;
  c.fillStyle='#ede4c7';c.font='bold 10px Georgia';c.textAlign='center';c.textBaseline='middle';c.fillText('⚔',0,-2);c.restore();
 }
 _labels(c,s){
  c.save();c.textAlign='center';c.textBaseline='middle';const used=[];
  if(this.mode==='historical'&&this.history){
   const entries=this.history.features.map((f,i)=>({f,i,area:areaOf(f.geometry)})).filter(o=>o.area>1.8).sort((a,b)=>b.area-a.area);
   for(const {f,area} of entries){const pt=centerOf(f.geometry),[x,y]=this.toScreen(...pt);if(x<38||y<40||x>this.w-38||y>this.h-48)continue;
    const text=String(f.properties.name||'').toUpperCase(),font=clamp(10+Math.sqrt(area)*.48,11,17);c.font='600 '+font+'px Georgia';
    const width=c.measureText(text).width;if(used.some(v=>Math.abs(x-v[0])<Math.max(width,v[2])*.56&&Math.abs(y-v[1])<20))continue;
    c.lineWidth=3.2;c.strokeStyle='rgba(240,222,182,.84)';c.strokeText(text,x,y);c.fillStyle='rgba(45,49,40,.89)';c.fillText(text,x,y);used.push([x,y,width]);if(used.length>65)break;
   }
  }else if(this.mode==='political'){
   const factions=this.world.factions.slice();factions.sort((a,b)=>{const ca=this.world.provinces.filter(p=>(this.game?.provinces[p.id]?.owner??p.owner)===a.id).length,cb=this.world.provinces.filter(p=>(this.game?.provinces[p.id]?.owner??p.owner)===b.id).length;return cb-ca;});
   for(const f of factions){const [x,y]=this.toScreen(...f.capital);if(x<22||y<36||x>this.w-22||y>this.h-42)continue;
    if(this.zoom<1.6&&!['france','england','ottomans','ming','delhi','timurids','mali','inca','ashikaga','mexica','vijayanagara','ethiopia','mamluks'].includes(f.id))continue;
    const label=f.name.toUpperCase(),font=clamp(9+this.zoom*.83,10,16);c.font='bold '+font+'px Georgia,serif';
    const ww=c.measureText(label).width;if(used.some(([px,py,pw])=>Math.abs(x-px)<(ww+pw)*.52&&Math.abs(y-py)<21))continue;
    c.lineWidth=3.5;c.strokeStyle='rgba(227,215,182,.86)';c.strokeText(label,x,y+19);c.fillStyle='#283a34';c.fillText(label,x,y+19);used.push([x,y,ww]);
   }
  }
  c.restore();
 }
 _cityMarkers(c){c.save();for(const f of this.world.factions){const [x,y]=this.toScreen(...f.capital);if(x<18||y<25||x>this.w-18||y>this.h-35)continue;drawSettlement(c,x,y,this.game?.player===f.id);}c.restore();}
 _hoverTip(c){
  if(!this.hover)return;
  const [cx,cy]=this.toScreen(...this.hover.centroid),state=this.game?.provinces?.[this.hover.id],f=this.game?.factions?.[state?.owner]||this.world.factions.find(f=>f.id===this.hover.owner);
  const text=this.mode==='historical'&&this.hoverHistorical?'1450 SOURCE: '+this.hoverHistorical.properties.name:(this.hover.name+' · '+(f?.name||'Independent'));
  c.font='11px Georgia';const width=clamp(c.measureText(text).width+18,90,this.w-36),x=clamp(cx+13,20,this.w-width-20),y=clamp(cy-25,30,this.h-41);
  c.fillStyle='rgba(38,45,39,.96)';c.strokeStyle='#bc9c66';c.lineWidth=1;c.fillRect(x,y,width,24);c.strokeRect(x,y,width,24);c.fillStyle='#ecdcb9';c.textAlign='left';c.textBaseline='middle';c.fillText(text,x+9,y+12,width-16);
 }
 render(){
  if(!this.ctx||!this.w||!this.h)return;
  const c=this.ctx,w=this.w,h=this.h,s=this.scale(),view=(lon,lat)=>this.toScreen(lon,lat);
  const gpu=this.useRelief&&this.mode==='terrain'&&this.terrain?.render(w,h,this.dpr,this.zoom,this.panX,this.panY,this.compression);
  c.setTransform(this.dpr,0,0,this.dpr,0,0);c.clearRect(0,0,w,h);
  if(gpu){c.globalAlpha=.18;drawSea(c,w,h,this.paper);c.globalAlpha=1;}else drawSea(c,w,h,this.paper);
  // Geographic drawing in degrees, with exactly the same transform as picking.
  c.save();c.translate(w*.5+this.panX,h*.5+this.panY);c.scale(s,-s*this.compression);
  c.globalAlpha=gpu?.52:1;drawLand(c,this.world,s);c.globalAlpha=1;
  if(this.mode==='historical'){
   this._drawHistorical(c,s);
  }else{
   if(this.mode==='political')this._drawProvinceColors(c,s);
   if(this.mode==='terrain'){c.globalAlpha=.36;this._drawProvinceColors(c,s);c.globalAlpha=1;}
   if(this.mode==='political')drawDivisions(c,this.counties,s,this.zoom>.73);
  }
  if(this.mode!=='historical')drawTopography(c,this.world,s);
  // Borders of selected/hovered playable provinces always remain interactive.
  const selected=this.world.provinces.find(p=>p.id===this.selected);
  if(selected){c.beginPath();drawGeoPath(c,selected.geometry);c.fillStyle='rgba(255,217,126,.14)';c.fill('evenodd');c.lineWidth=clamp(3.4/s,.12,.95);c.strokeStyle='#fff0b7';c.stroke();}
  if(this.hover&&this.hover.id!==this.selected){c.beginPath();drawGeoPath(c,this.hover.geometry);c.lineWidth=clamp(2.5/s,.08,.7);c.strokeStyle='#f9e3ac';c.stroke();}
  c.restore();
  drawOceanLettering(c,view,w,h);
  if(this.mode!=='terrain')this._labels(c,s);
  this._cityMarkers(c);
  if(this.game){for(const a of Object.values(this.game.armies||{}))this._markArmy(c,a);}
  if(w>340&&h>280)drawRosette(c,75,h-108,24);
  // Atlas masthead is ink on translucent parchment; not part of geography.
  c.save();c.fillStyle='rgba(234,217,176,.87)';c.strokeStyle='rgba(102,84,53,.63)';c.lineWidth=1.1;
  const bx=w*.5-111; c.fillRect(bx,19,222,34);c.strokeRect(bx,19,222,34);
  c.font='bold 13px Georgia';c.textAlign='center';c.fillStyle='#51442f';c.fillText(this.mode==='historical'?'THE HISTORICAL ATLAS':this.mode==='terrain'?'RELIEF OF THE EARTH':'THE KINGDOMS OF 1450',w/2,40);
  c.restore();atlasBorders(c,w,h);
  c.font='10px Georgia';c.textAlign='left';c.textBaseline='alphabetic';c.fillStyle='rgba(47,48,38,.83)';
  c.fillText(this.mode==='historical'?'CLIOPATRIA / SESHAT · CC BY 4.0 · INCOMPLETE COVERAGE':this.mode==='terrain'?'TERRAIN VIEW · STYLIZED RELIEF':'POLITICAL MAP · DECORATIVE COUNTY LINES',25,h-24);
  this._hoverTip(c);
 }
}
