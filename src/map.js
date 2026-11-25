import {realmArt} from './game-art.js';
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
const FAITH_COLORS={
 'Latin Christianity':'#c59b4f','Eastern Christianity':'#7c68a6','Ethiopian Christianity':'#9d77a8','Christian traditions':'#9c8d64',
 'Sunni Islam':'#579667','Islamic traditions':'#6ea36a','Islamic and local traditions':'#779e7c',
 'Hindu traditions':'#cf7d47','Hindu-Buddhist traditions':'#c4864f','Hindu-Buddhist and local traditions':'#b88959',
 'Theravada Buddhism':'#d4aa4c','Tibetan Buddhism':'#c98c53','Buddhist and kami traditions':'#c4786e','Buddhist and local traditions':'#c2985d',
 'Chinese ritual traditions':'#b86357','Confucian ritual traditions':'#9c6e85','Vietnamese ritual traditions':'#769682'
};
const CATEGORY_PALETTE=['#8da87d','#b8886e','#6e95a3','#b688a8','#c4a660','#749c88','#a87e76','#8588b3','#a69c6c','#6d9299','#bf7c7c','#84a373','#a98fb8','#c2935b'];
function hashStr(s){let h=2166136261;for(const ch of String(s||''))h=Math.imul(h^ch.charCodeAt(0),16777619);return h>>>0;}
function categoryColor(label,overrides=null){if(overrides&&Object.hasOwn(overrides,label))return overrides[label];return CATEGORY_PALETTE[hashStr(label)%CATEGORY_PALETTE.length];}
const TERRAIN_COLORS={highlands:'#8b7b59',forest:'#5d7c53',desert:'#d4b36f',plains:'#a7ab78'};
function areaOf(geo){if(!geo)return 0;const ring=geo.type==='Polygon'?geo.coordinates[0]:geo.type==='MultiPolygon'?geo.coordinates[0]?.[0]:null;if(!ring)return 0;let total=0;for(let j=0;j<ring.length;j++){const a=ring[j],b=ring[(j+1)%ring.length];total+=a[0]*b[1]-b[0]*a[1];}return Math.abs(total)/2;}
function centerOf(geo){const points=geo?.type==='Polygon'?geo.coordinates[0]:geo?.type==='MultiPolygon'?geo.coordinates[0]?.[0]:[];if(!points?.length)return [0,0];let x0=Infinity,x1=-Infinity,y0=Infinity,y1=-Infinity;for(const [x,y] of points){x0=Math.min(x0,x);x1=Math.max(x1,x);y0=Math.min(y0,y);y1=Math.max(y1,y);}return [(x0+x1)/2,(y0+y1)/2];}

const MAP_MODES=['political','vassals','diplomacy','opinion','revolt','economy','epidemics','terrain','culture','religion','dejure','historical'];
function opinionColor(score){
 const t=clamp((Number(score)||0)/100,-1,1);
 if(t>=0){const r=Math.round(168-89*t),g=Math.round(158+30*t),b=Math.round(125-25*t);return `rgb(${r},${g},${b})`;}
 const k=-t,r=Math.round(168+28*k),g=Math.round(158-85*k),b=Math.round(125-60*k);return `rgb(${r},${g},${b})`;
}
function heatColor(ratio,lowRgb,highRgb){
 const t=clamp(ratio,0,1),r=Math.round(lowRgb[0]+(highRgb[0]-lowRgb[0])*t),g=Math.round(lowRgb[1]+(highRgb[1]-lowRgb[1])*t),b=Math.round(lowRgb[2]+(highRgb[2]-lowRgb[2])*t);
 return `rgb(${r},${g},${b})`;
}
function polityColor(i){const palette=['#a7b6a0','#bc9eaa','#d7b778','#b2a6ce','#b3b18e','#9eb9ba','#caa19a','#a7c0a0','#d7b99f','#b6a7bf','#ccb18c','#a6b0a3','#d3a4a5','#bfcca0'];return palette[(i*7+Math.floor(i/7))%palette.length];}
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
  canvas.addEventListener('contextmenu',e=>{if(!this.onContextMenu)return;e.preventDefault();const [x,y]=local(e);const province=this.pick(...this.toGeo(x,y));if(province)this.onContextMenu(province.id,e.clientX,e.clientY);});
  canvas.addEventListener('wheel',e=>{e.preventDefault();this.zoomAt(e.offsetX,e.offsetY,Math.exp(-e.deltaY*.00122));},{passive:false});
 }
 pinchState(){const [a,b]=[...this.pointers.values()];return {x:(a[0]+b[0])/2,y:(a[1]+b[1])/2,distance:Math.hypot(a[0]-b[0],a[1]-b[1])};}
 zoomAt(x,y,factor){const old=this.zoom,next=clamp(old*factor,bounds.minZoom,bounds.maxZoom);const dx=x-this.w/2-this.panX,dy=y-this.h/2-this.panY;this.panX-=dx*(next/old-1);this.panY-=dy*(next/old-1);this.zoom=next;this.render();}
 resize(){const r=this.canvas.getBoundingClientRect();this.w=Math.max(1,r.width);this.h=Math.max(1,r.height);this.dpr=Math.min(window.devicePixelRatio||1,window.matchMedia?.('(pointer: coarse)').matches?1.5:2);const width=Math.round(this.w*this.dpr),height=Math.round(this.h*this.dpr);if(this.canvas.width!==width||this.canvas.height!==height){this.canvas.width=width;this.canvas.height=height;}this.render();}
 setWorld(world){this.world=world;this.geoIndex=geographicIndex(world.provinces);this.seatCache=null;this.game=null;this.selected=null;this.hover=null;this.hoverHistorical=null;this.counties=buildDecorativeCounties(world);this.edges=buildAtlasEdges(world);this.provinceIndex=new Map(world.provinces.map(p=>[p.id,p]));this.ownerColors=Object.fromEntries(world.factions.map(f=>[f.id,f.color]));this.countyIndex=new Map(this.counties.map(c=>[c.id,c]));if(this.terrain)this.terrain.world=world;this.render();}
 setGame(g){this.game=g;this.render();}
 setHistorical(data){this.history=data?.features?data:null;this.historyIndex=this.history?geographicIndex(this.history.features):null;this.historyLabels=this.history?.features.map((f,i)=>({f,i,area:areaOf(f.geometry),point:centerOf(f.geometry)})).filter(o=>o.area>1.8).sort((a,b)=>b.area-a.area)||[];this.render();}
 setMode(mode){if(!MAP_MODES.includes(mode))return;this.mode=mode;this.render();}
 _diplomacyStatus(owner){
  const g=this.game,p=g?.player;
  if(!g||!owner||owner==='independent')return 'independent';
  if(owner===p)return 'self';
  const f=g.factions?.[p];
  if(f?.atWarWith?.includes(owner))return 'war';
  const treaty=f?.treaties?.[owner];
  if(treaty==='alliance')return 'alliance';
  if(treaty==='non_aggression'||treaty==='betrothal')return 'pact';
  if(f?.truces?.[owner]>0)return 'truce';
  if(g.diplomacy?.tributaries?.[owner]===p||g.diplomacy?.tributes?.[owner])return 'tributary';
  if(treaty==='trade')return 'trade';
  return 'neutral';
 }
 _provinceOpinion(p){
  const g=this.game,state=g?.provinces?.[p.id],owner=state?.owner??p.owner;
  if(!g)return 0;
  if(owner==='independent')return g.independentPolities?.[p.id]?.opinion??0;
  if(owner===g.player){
   const holderId=g.feudal?.titles?.['c:'+p.id]?.holderId;
   const vassal=holderId&&g.politics?.people?.[holderId];
   return vassal?vassal.opinion??15:40;
  }
  return g.factions?.[owner]?.relation??0;
 }
 _provinceRevoltRisk(p){
  const g=this.game,state=g?.provinces?.[p.id];
  if(!g||!state)return 0;
  let risk=Math.max(0,(state.unrest||0)*12);
  if(state.occupation||state.siege?.progress>0)risk+=35;
  const prosperity=state.prosperity??1;
  if(prosperity===0)risk+=15;
  const f=g.factions?.[state.owner];
  if(state.owner===g.player&&f?.stability<55)risk+=(55-f.stability)*0.8;
  return clamp(Math.round(risk),0,100);
 }
 provinceCategory(p){
  if(this.mode==='culture')return this.game?.civic?.provinces?.[p.id]?.culture||p.culture||'Local culture';
  if(this.mode==='religion')return this.game?.civic?.provinces?.[p.id]?.faith||p.faith||'Local traditions';
  if(this.mode==='dejure'){
   const djRealm=this.game?.feudal?.titles?.['c:'+p.id]?.deJureRealm;
   return (djRealm&&this.game?.factions?.[djRealm]?.name)||p.deJureKingdom||this.game?.factions?.[p.owner]?.name||'Independent';
  }
  if(this.mode==='terrain')return (p.terrain||'plains').toUpperCase();
  if(this.mode==='vassals'){
   const owner=this.game?.provinces?.[p.id]?.owner??p.owner;
   if(owner==='independent')return this.game?.independentPolities?.[p.id]?.rulerName||'Local Chiefdom';
   const holderId=this.game?.feudal?.titles?.['c:'+p.id]?.holderId;
   const holder=holderId&&this.game?.politics?.people?.[holderId];
   return holder?`${holder.name} (${this.game?.factions?.[owner]?.name||owner})`:(this.game?.factions?.[owner]?.name||owner);
  }
  if(this.mode==='diplomacy')return this._diplomacyStatus(this.game?.provinces?.[p.id]?.owner??p.owner).toUpperCase();
  if(this.mode==='opinion')return `OPINION ${this._provinceOpinion(p)>=0?'+':''}${this._provinceOpinion(p)}`;
  if(this.mode==='revolt')return `UNREST ${this._provinceRevoltRisk(p)}%`;
  if(this.mode==='economy'){const st=this.game?.provinces?.[p.id];return `DEV ${st?.development??p.development??1} · PROSPERITY ${st?.prosperity??1}`;}
  if(this.mode==='epidemics'){const epi=this.game?.heritage?.epidemics?.[p.id]||this.game?.provinces?.[p.id]?.epidemic;return epi?epi.name||'OUTBREAK':'HEALTHY';}
  const owner=this.game?.provinces?.[p.id]?.owner??p.owner;
  return this.game?.factions?.[owner]?.name||this.game?.independentPolities?.[p.id]?.name||'Independent';
 }
 provinceColor(p){
  if(this.mode==='culture')return atlasColor(categoryColor(this.provinceCategory(p)),.16);
  if(this.mode==='religion')return atlasColor(categoryColor(this.provinceCategory(p),FAITH_COLORS),.14);
  if(this.mode==='dejure'){
   const djRealm=this.game?.feudal?.titles?.['c:'+p.id]?.deJureRealm;
   const hex=(djRealm&&this.ownerColors[djRealm])||categoryColor(this.provinceCategory(p));
   return atlasColor(hex,.16);
  }
  if(this.mode==='terrain')return atlasColor(TERRAIN_COLORS[p.terrain]||TERRAIN_COLORS.plains,.14);
  if(this.mode==='vassals'){
   const owner=this.game?.provinces?.[p.id]?.owner??p.owner;
   if(owner==='independent')return atlasColor('#9e9a87',.18);
   const holderId=this.game?.feudal?.titles?.['c:'+p.id]?.holderId;
   const base=owner===this.game?.player&&holderId&&holderId!==this.game?.factions?.[owner]?.rulerId
    ?categoryColor('vassal:'+holderId)
    :(this.game?.factions?.[owner]?.color||this.ownerColors[owner]||'#b4b09a');
   return atlasColor(base,owner===this.game?.player?.08:.2);
  }
  if(this.mode==='diplomacy'){
   const st=this._diplomacyStatus(this.game?.provinces?.[p.id]?.owner??p.owner);
   const colors={self:'#68a675',war:'#c9544c',alliance:'#558ec4',pact:'#7cb3d8',truce:'#8e7dc2',tributary:'#d2a853',trade:'#92b285',neutral:'#8f9489',independent:'#a6a18f'};
   return atlasColor(colors[st]||'#8f9489',.12);
  }
  if(this.mode==='opinion')return opinionColor(this._provinceOpinion(p));
  if(this.mode==='revolt')return heatColor(this._provinceRevoltRisk(p)/100,[102,145,112],[204,76,66]);
  if(this.mode==='economy'){
   const st=this.game?.provinces?.[p.id];
   const score=((st?.development??p.development??1)*0.6+(st?.prosperity??1)*3)/14;
   return heatColor(score,[112,98,82],[236,196,88]);
  }
  if(this.mode==='epidemics'){
   const epi=this.game?.heritage?.epidemics?.[p.id]||this.game?.provinces?.[p.id]?.epidemic;
   return epi?'#b84863':heatColor((this.game?.provinces?.[p.id]?.unrest||0)/6,[111,141,123],[164,116,96]);
  }
  const owner=this.game?.provinces?.[p.id]?.owner??p.owner;
  return atlasColor(this.game?.factions?.[owner]?.color||this.ownerColors[owner]||'#b4b09a',owner===this.game?.player?.toString()?.10:.23);
 }
 modeLegend(){
  if(this.mode==='historical')return {title:'1450 Reference Layer',items:[{label:'Approximate 1450 polities',color:'#bc9eaa'},{label:'Incomplete source coverage',color:'#a7b6a0'}]};
  if(this.mode==='terrain')return {title:'Terrain',items:Object.entries(TERRAIN_COLORS).map(([k,color])=>({label:k.charAt(0).toUpperCase()+k.slice(1),color}))};
  if(this.mode==='political')return {title:'Kingdoms',items:[{label:'Your realm',color:this.game?.factions?.[this.game?.player]?.color||'#d8b777'},{label:'Foreign realms',color:'#bc746c'},{label:'Independent polities',color:'#b4b09a'}]};
  if(this.mode==='vassals')return {title:'Vassals & Lords',items:[{label:'Crown Demesne',color:this.game?.factions?.[this.game?.player]?.color||'#d8b777'},{label:'Vassal Lordship',color:'#8da87d'},{label:'Local Polities',color:'#9e9a87'}]};
  if(this.mode==='diplomacy')return {title:'Diplomatic Stance',items:[{label:'Your Realm',color:'#68a675'},{label:'Alliance',color:'#558ec4'},{label:'NAP / Marriage',color:'#7cb3d8'},{label:'At War',color:'#c9544c'},{label:'Truce',color:'#8e7dc2'},{label:'Tributary',color:'#d2a853'}]};
  if(this.mode==='opinion')return {title:'Ruler Opinion',items:[{label:'Loyal (+75)',color:'#4f9c64'},{label:'Neutral (0)',color:'#a89e7d'},{label:'Hostile (-75)',color:'#c44943'}]};
  if(this.mode==='revolt')return {title:'Unrest & Revolt Risk',items:[{label:'Calm',color:'#669170'},{label:'Restive',color:'#cc964b'},{label:'Rebellious',color:'#cc4c42'}]};
  if(this.mode==='economy')return {title:'Prosperity & Trade',items:[{label:'Devastated',color:'#706252'},{label:'Steady',color:'#b0a168'},{label:'Booming',color:'#ecc458'}]};
  if(this.mode==='epidemics')return {title:'Pestilence & Health',items:[{label:'Healthy',color:'#6f8d7b'},{label:'Outbreak',color:'#b84863'}]};
  const counts=new Map();
  for(const p of this.world.provinces){const cat=this.provinceCategory(p);counts.set(cat,(counts.get(cat)||0)+1);}
  const top=[...counts.entries()].sort((a,b)=>b[1]-a[1]||a[0].localeCompare(b[0])).slice(0,6);
  return {
   title:this.mode==='culture'?'Cultures':this.mode==='religion'?'Religions':'De Jure Kingdoms',
   items:top.map(([label])=>({label,color:this.mode==='religion'?categoryColor(label,FAITH_COLORS):this.mode==='dejure'?(this.ownerColors[this.world.factions.find(f=>f.name===label)?.id]||categoryColor(label)):categoryColor(label)}))
  };
 }
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
   c.beginPath();drawGeoPath(c,p.geometry);c.fillStyle=this.provinceColor(p);
   c.globalAlpha=this.mode==='political'?(owner===this.game?.player?0.96:0.84):0.88;c.fill('evenodd');c.globalAlpha=1;
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
  c.fillStyle='#ede4c7';c.font='bold 10px Georgia';c.textAlign='center';c.textBaseline='middle';const art=realmArt(a.owner);this.realmArtCache??=new Map();let icon=art&&this.realmArtCache.get(art);if(art&&!icon){icon=new Image();icon.onload=()=>this.render();icon.src=art;this.realmArtCache.set(art,icon);}if(icon?.complete&&icon.naturalWidth)c.drawImage(icon,-9,-11,18,18);else c.fillText('⚔',0,-2);if(this.zoom>=2.1||mine){const text=a.troops>=1000?(a.troops/1000).toFixed(1).replace(/\.0$/,'')+'k':String(a.troops);c.font='bold 10px system-ui';const w=c.measureText(text).width+10;marker.halfWidth=Math.max(11,w/2);marker.bottom=29;c.fillStyle=mine?'#423820':'#3b3834';c.fillRect(-w/2,13,w,15);c.fillStyle='#fff0c8';c.fillText(text,0,20);}c.restore();
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
 _cityMarkers(c,seats){c.save();for(const {f,point} of seats){const [x,y]=this.toScreen(...point);if(x<18||y<25||x>this.w-18||y>this.h-35)continue;drawSettlement(c,x,y,this.game?.player===f.id);}
  if(this.zoom>=2.2){
   c.font='bold 10px Georgia';c.textAlign='center';c.textBaseline='middle';
   for(const p of this.world.provinces){if(!p.tradeCenter)continue;const [x,y]=this.toScreen(...p.centroid);if(x<24||y<30||x>this.w-24||y>this.h-38)continue;c.fillStyle='rgba(36,28,18,.8)';c.beginPath();c.arc(x+9,y-6,6,0,Math.PI*2);c.fill();c.fillStyle='#f0cf7b';c.fillText('◈',x+9,y-5.5);}
  }
  c.restore();}
 _hoverTip(c){
  if(!this.hover)return;
  const [cx,cy]=this.toScreen(...this.hover.centroid),state=this.game?.provinces?.[this.hover.id],f=this.game?.factions?.[state?.owner]||this.world.factions.find(f=>f.id===this.hover.owner);
  let detail='';
  if(this.mode==='culture')detail=' · '+(this.game?.civic?.provinces?.[this.hover.id]?.culture||this.hover.culture||'Local');
  else if(this.mode==='religion')detail=' · '+(this.game?.civic?.provinces?.[this.hover.id]?.faith||this.hover.faith||'Local');
  else if(this.mode==='dejure')detail=' · '+(this.hover.deJureDuchy||this.hover.deJureKingdom||'Realm');
  else if(this.mode==='terrain')detail=' · '+(this.hover.terrain||'plains').toUpperCase()+(this.hover.tradeCenter?' · ◈ Trade':'');
  else if(this.mode==='vassals'||this.mode==='diplomacy'||this.mode==='opinion'||this.mode==='revolt'||this.mode==='economy'||this.mode==='epidemics')detail=' · '+this.provinceCategory(this.hover);
  else if(state){const pol=this.game?.independentPolities?.[this.hover.id];detail=' · Pop '+Math.round(state.population)+'k · Dev '+state.development+(pol?` · Ruler ${pol.rulerName}`:'')+(this.hover.tradeCenter?' · ◈':'');}
  const rulerLabel=f?.name||this.game?.independentPolities?.[this.hover.id]?.name||'Independent';
  const text=this.mode==='historical'&&this.hoverHistorical?'1450 SOURCE: '+this.hoverHistorical.properties.name:(this.hover.name+' · '+rulerLabel+detail);
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
   if(this.mode==='terrain'){c.globalAlpha=.36;this._drawProvinceColors(c,s,visible);c.globalAlpha=1;}
   else this._drawProvinceColors(c,s,visible);
   if(['political','vassals','diplomacy','opinion','revolt','economy','epidemics','culture','religion','dejure'].includes(this.mode)){
    drawDivisions(c,visible.map(p=>this.countyIndex.get(p.id)).filter(Boolean),s,this.zoom>=4.5&&this.w>=700);
    const ea=this.toGeo(0,h),eb=this.toGeo(w,0);
    const edgeKeyFn=this.mode==='dejure'
     ?(id=>this.game?.feudal?.titles?.['c:'+id]?.deJureRealm||this.provinceIndex.get(id)?.deJureKingdom||this.provinceIndex.get(id)?.owner)
     :this.mode==='culture'?(id=>this.game?.civic?.provinces?.[id]?.culture||this.provinceIndex.get(id)?.culture||id)
     :this.mode==='religion'?(id=>this.game?.civic?.provinces?.[id]?.faith||this.provinceIndex.get(id)?.faith||id)
     :this.mode==='vassals'?(id=>this.game?.feudal?.titles?.['c:'+id]?.holderId||this.game?.provinces?.[id]?.owner||id)
     :(id=>this.game?.provinces?.[id]?.owner??this.provinceIndex.get(id)?.owner);
    drawPoliticalEdges(c,this.edges,edgeKeyFn,s,[ea[0],ea[1],eb[0],eb[1]]);
   }
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
  this.armyMarkers=[];if(this.game){
   const groups=atlasArmyGroups(this.game.armies,this.game.naval?.voyages),counts=new Map(),placedForeign=[];
   const compactMobile=this.w<680&&this.zoom<1.9;
   for(const a of groups){
    const mine=a.owner===this.game.player,enemyWar=this.game.factions?.[this.game.player]?.atWarWith?.includes(a.owner);
    if(compactMobile&&!mine&&!enemyWar){
     const prov=this.provinceIndex.get(a.province);
     if(prov){const [ax,ay]=this.toScreen(...prov.centroid);if(placedForeign.some(([px,py])=>Math.hypot(ax-px,ay-py)<26))continue;placedForeign.push([ax,ay]);}
    }
    const n=counts.get(a.province)||0;counts.set(a.province,n+1);this._markArmy(c,a,n*17);
   }
  }
  if(w>700&&h>350)drawRosette(c,55,h-75,20);
  // Atlas masthead is ink on translucent parchment; not part of geography.
  c.save();c.fillStyle='rgba(234,217,176,.87)';c.strokeStyle='rgba(102,84,53,.63)';c.lineWidth=1.1;
  const mastheadMap={historical:'THE HISTORICAL ATLAS',terrain:'RELIEF OF THE EARTH',culture:'CULTURES OF 1450',religion:'FAITHS OF 1450',dejure:'DE JURE REALMS OF 1450',vassals:'FEUDAL VASSALS',diplomacy:'DIPLOMATIC WEB',opinion:'REALM OPINIONS',revolt:'REVOLT & UNREST',economy:'PROSPERITY & WEALTH',epidemics:'PESTILENCE & HEALTH'};
  const masthead=mastheadMap[this.mode]||'THE KINGDOMS OF 1450';
  const bx=w*.5-111; if(w>=700){c.fillRect(bx,19,222,34);c.strokeRect(bx,19,222,34);
  c.font='bold 13px Georgia';c.textAlign='center';c.fillStyle='#51442f';c.fillText(masthead,w/2,40);}
  c.restore();if(w>=700)atlasBorders(c,w,h);
  c.font='10px Georgia';c.textAlign='left';c.textBaseline='alphabetic';c.fillStyle='rgba(47,48,38,.83)';
  if(w>=700)c.fillText(this.mode==='historical'?'CLIOPATRIA / SESHAT · CC BY 4.0 · INCOMPLETE COVERAGE':`${masthead} · 1450 CAMPAIGN ATLAS`,25,h-24);
  this._hoverTip(c);
 }
}
