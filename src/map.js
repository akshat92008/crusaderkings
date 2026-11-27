import {realmArt} from './game-art.js';
import {pickArmyMarker} from './campaign-hud.js';
import {geographicIndex,seatSignature,frameCoalescer} from './render-performance.js';
import {capitalDistrict} from './historical-world.js';
import {occupation} from './campaign-war.js';
import {ReliefMap,computeMapPitchDeg} from './relief-map.js';
import {
 atlasPaper,atlasColor,buildDecorativeCounties,drawGeoPath,drawSea,drawLand,buildOccupationPattern,
 drawTopography,drawDivisions,drawRosette,atlasBorders,drawSettlement,drawOceanLettering,
 buildAtlasEdges,drawPoliticalEdges,politicalEdgeKind,atlasArmyGroups,drawCurvedRealmLabel,drawMarchArc
} from './atlas-art.js';

/** Crown of Nations — adaptive 3D/2D CK2/CK3-inspired political atlas. */
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n)),bounds={minZoom:.55,maxZoom:16};
function pointRing(x,y,ring){let hit=false;for(let i=0,j=ring.length-1;i<ring.length;j=i++){const xi=ring[i][0],yi=ring[i][1],xj=ring[j][0],yj=ring[j][1];if((yi>y)!==(yj>y)&&x<(xj-xi)*(y-yi)/(yj-yi)+xi)hit=!hit;}return hit;}
function pointPolygon(x,y,rings){return pointRing(x,y,rings[0])&&!rings.slice(1).some(r=>pointRing(x,y,r));}
export function inside(x,y,geo){if(geo?.type==='Polygon')return pointPolygon(x,y,geo.coordinates);if(geo?.type==='MultiPolygon')return geo.coordinates.some(r=>pointPolygon(x,y,r));return false;}

/** Pure deterministic 3D perspective camera projection shared between ReliefMap & CampaignMap. */
export function buildMapCamera(w,h,zoom,panX,panY,compression,pitchDeg=0,reliefAmp=0){
 const safeW=Math.max(1,w),safeH=Math.max(1,h);
 const scale=Math.min(safeW/355,safeH/150)*zoom;
 const centerLon=-panX/scale;
 const centerLat=panY/(scale*compression);
 const rad=pitchDeg*Math.PI/180;
 const pitchSin=Math.sin(rad),pitchCos=Math.cos(rad);
 const camDist=Math.max(safeW,safeH)*1.35;
 return {w:safeW,h:safeH,zoom,panX,panY,compression,scale,centerLon,centerLat,pitchDeg,pitchSin,pitchCos,camDist,reliefAmp};
}

export function projectMapPoint(cam,lon,lat,elev=0){
 const dx=(lon-cam.centerLon)*cam.scale;
 const dy=(lat-cam.centerLat)*cam.scale*cam.compression;
 if(cam.pitchDeg<=0&&elev===0){
  return [cam.w*0.5+dx,cam.h*0.5-dy];
 }
 const dz=elev*cam.scale*cam.reliefAmp;
 const cy=dy*cam.pitchCos+dz*cam.pitchSin;
 const depth=Math.max(cam.camDist*0.18,cam.camDist+dy*cam.pitchSin-dz*cam.pitchCos);
 const persp=cam.camDist/depth;
 return [cam.w*0.5+dx*persp,cam.h*0.5-cy*persp];
}

export function unprojectScreenPoint(cam,px,py,sampleHeight=null){
 const sx=px-cam.w*0.5,sy=cam.h*0.5-py;
 if(cam.pitchDeg<=0){
  return [cam.centerLon+sx/cam.scale,cam.centerLat+sy/(cam.scale*cam.compression)];
 }
 const denom=Math.max(1e-3,cam.camDist*cam.pitchCos-sy*cam.pitchSin);
 let dy=(sy*cam.camDist)/denom;
 let dx=sx*(cam.camDist+dy*cam.pitchSin)/cam.camDist;
 if(sampleHeight&&cam.reliefAmp>0){
  for(let step=0;step<3;step++){
   const lon=cam.centerLon+dx/cam.scale;
   const lat=cam.centerLat+dy/(cam.scale*cam.compression);
   const dz=sampleHeight(lon,lat)*cam.scale*cam.reliefAmp;
   dy=(sy*(cam.camDist-dz*cam.pitchCos)-dz*cam.pitchSin*cam.camDist)/denom;
   dx=sx*(cam.camDist+dy*cam.pitchSin-dz*cam.pitchCos)/cam.camDist;
  }
 }
 return [cam.centerLon+dx/cam.scale,cam.centerLat+dy/(cam.scale*cam.compression)];
}

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
  this.counties=buildDecorativeCounties(world);this.edges=buildAtlasEdges(world);this.provinceIndex=new Map(world.provinces.map(p=>[p.id,p]));this.ownerColors=Object.fromEntries(world.factions.map(f=>[f.id,f.color]));
  this.paper=this.ctx?atlasPaper(this.ctx):null;
  this.occPatterns=new Map();
  this.dirty=true;this.geoIndex=geographicIndex(world.provinces);this.countyIndex=new Map(this.counties.map(c=>[c.id,c]));
  this.requestDraw=frameCoalescer(cb=>requestAnimationFrame(cb),()=>this.drawFrame());
  this.ambientTimer=null;this.lastAmbientMs=0;
  const terrainCanvas=document.getElementById('terrain-map');
  this.terrain=terrainCanvas?new ReliefMap(terrainCanvas,()=>this.render(),world):null;
  const obs=new ResizeObserver(()=>this.resize());obs.observe(canvas.parentElement);this.resize();
  this.pointers=new Map();this.pinching=false;
  const local=e=>{const r=canvas.getBoundingClientRect();return [e.clientX-r.left,e.clientY-r.top];};
  canvas.addEventListener('pointerdown',e=>{if(e.button!==0)return;canvas.setPointerCapture(e.pointerId);this.pointers.set(e.pointerId,local(e));if(this.pointers.size===1){this.pinching=false;this.drag={x:e.clientX,y:e.clientY,px:this.panX,py:this.panY,distance:0};}else{this.pinching=true;this.drag=null;this.pinch=this.pinchState();}});
  canvas.addEventListener('pointermove',e=>{
   if(this.pointers.has(e.pointerId))this.pointers.set(e.pointerId,local(e));
   if(this.pointers.size>=2){const next=this.pinchState();if(this.pinch&&next.distance>0){this.panX+=next.x-this.pinch.x;this.panY+=next.y-this.pinch.y;this.zoomAt(next.x,next.y,next.distance/Math.max(1,this.pinch.distance));}this.pinch=next;return;}
   if(this.pinching)return;
   if(this.drag){const dx=e.clientX-this.drag.x,dy=e.clientY-this.drag.y;this.drag.distance=Math.max(this.drag.distance,Math.hypot(dx,dy));if(this.drag.distance>3){this.panX=this.drag.px+dx;this.panY=this.drag.py+dy;this.render();}return;}
   if(e.pointerType==='touch')return;
   const p=this.toGeo(...local(e)),found=this.pick(...p),historical=this.mode==='historical'?this.pickHistorical(...p):null;
   if(found?.id!==this.hover?.id||historical?.properties?.name!==this.hoverHistorical?.properties?.name){this.hover=found;this.hoverHistorical=historical;canvas.style.cursor=found?'crosshair':'grab';this.render();}
  });
  const end=(e,cancel=false)=>{
   if(!cancel&&!this.pinching&&this.drag?.distance<5){
    const [x,y]=local(e),marker=!this.marchOrigin&&pickArmyMarker(this.armyMarkers||[],x,y);
    if(marker&&this.onArmy)this.onArmy(marker);
    else{const province=this.pick(...this.toGeo(x,y));if(province)this.onProvince(province.id);}
   }
   this.pointers.delete(e.pointerId);this.drag=null;this.pinch=null;if(!this.pointers.size)this.pinching=false;
  };
  canvas.addEventListener('pointerup',e=>end(e));canvas.addEventListener('pointercancel',e=>end(e,true));
  canvas.addEventListener('contextmenu',e=>{if(!this.onContextMenu)return;e.preventDefault();const [x,y]=local(e);const province=this.pick(...this.toGeo(x,y));if(province)this.onContextMenu(province.id,e.clientX,e.clientY);});
  canvas.addEventListener('wheel',e=>{e.preventDefault();this.zoomAt(e.offsetX,e.offsetY,Math.exp(-e.deltaY*.00122));},{passive:false});
 }

 _activeTier(){
  return this.terrain?.effectiveTier?.()||{id:'low',maxDpr:1,maxPitchDeg:0,animateWater:false,treeBudget:0,castleBudget:48,sampleHeight:false};
 }

 _camera(){
  const tier=this._activeTier();
  const use3d=this.useRelief&&this.terrain?.ready;
  const comp=this.compression;
  const pitch=use3d?computeMapPitchDeg(this.zoom,tier.maxPitchDeg,true):0;
  const reliefAmp=(use3d&&comp<1)?5.6:0;
  return buildMapCamera(this.w||800,this.h||600,this.zoom,this.panX,this.panY,comp,pitch,reliefAmp);
 }

 pinchState(){const [a,b]=[...this.pointers.values()];return {x:(a[0]+b[0])/2,y:(a[1]+b[1])/2,distance:Math.hypot(a[0]-b[0],a[1]-b[1])};}

 zoomAt(x,y,factor){
  const old=this.zoom,next=clamp(old*factor,bounds.minZoom,bounds.maxZoom);
  if(Math.abs(next-old)<1e-6)return;
  const [lon,lat]=this.toGeo(x,y);
  this.zoom=next;
  const tier=this._activeTier();
  const use3d=this.useRelief&&this.terrain?.ready;
  const pitch=use3d?computeMapPitchDeg(next,tier.maxPitchDeg,true):0;
  const nextCam=buildMapCamera(this.w,this.h,next,0,0,this.compression,pitch,0);
  const sx=x-nextCam.w*0.5,sy=nextCam.h*0.5-y;
  const denom=Math.max(1e-3,nextCam.camDist*nextCam.pitchCos-sy*nextCam.pitchSin);
  const dy=(sy*nextCam.camDist)/denom;
  const dx=sx*(nextCam.camDist+dy*nextCam.pitchSin)/nextCam.camDist;
  const cLon=lon-dx/nextCam.scale;
  const cLat=lat-dy/(nextCam.scale*nextCam.compression);
  this.panX=-cLon*nextCam.scale;
  this.panY=cLat*nextCam.scale*nextCam.compression;
  this.render();
 }

 resize(){
  const r=this.canvas.getBoundingClientRect();this.w=Math.max(1,r.width);this.h=Math.max(1,r.height);
  const tierDpr=this._activeTier().maxDpr||2;
  this.dpr=Math.min(window.devicePixelRatio||1,window.matchMedia?.('(pointer: coarse)').matches?1.5:tierDpr);
  const width=Math.round(this.w*this.dpr),height=Math.round(this.h*this.dpr);
  if(this.canvas.width!==width||this.canvas.height!==height){this.canvas.width=width;this.canvas.height=height;}
  this.render();
 }

 setWorld(world){
  this.world=world;this.geoIndex=geographicIndex(world.provinces);this.seatCache=null;this.game=null;this.selected=null;this.hover=null;this.hoverHistorical=null;
  this.counties=buildDecorativeCounties(world);this.edges=buildAtlasEdges(world);this.provinceIndex=new Map(world.provinces.map(p=>[p.id,p]));
  this.ownerColors=Object.fromEntries(world.factions.map(f=>[f.id,f.color]));this.countyIndex=new Map(this.counties.map(c=>[c.id,c]));
  if(this.terrain)this.terrain.rebuildTextures(world);
  this.render();
 }
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
 _rawBaseColor(p){
  if(this.mode==='culture')return categoryColor(this.provinceCategory(p));
  if(this.mode==='religion')return categoryColor(this.provinceCategory(p),FAITH_COLORS);
  if(this.mode==='dejure'){
   const djRealm=this.game?.feudal?.titles?.['c:'+p.id]?.deJureRealm;
   return (djRealm&&this.ownerColors[djRealm])||categoryColor(this.provinceCategory(p));
  }
  if(this.mode==='terrain')return TERRAIN_COLORS[p.terrain]||TERRAIN_COLORS.plains;
  if(this.mode==='vassals'){
   const owner=this.game?.provinces?.[p.id]?.owner??p.owner;
   if(owner==='independent')return '#9e9a87';
   const holderId=this.game?.feudal?.titles?.['c:'+p.id]?.holderId;
   return owner===this.game?.player&&holderId&&holderId!==this.game?.factions?.[owner]?.rulerId
    ?categoryColor('vassal:'+holderId)
    :(this.game?.factions?.[owner]?.color||this.ownerColors[owner]||'#b4b09a');
  }
  if(this.mode==='diplomacy'){
   const st=this._diplomacyStatus(this.game?.provinces?.[p.id]?.owner??p.owner);
   return {self:'#68a675',war:'#c9544c',alliance:'#558ec4',pact:'#7cb3d8',truce:'#8e7dc2',tributary:'#d2a853',trade:'#92b285',neutral:'#8f9489',independent:'#a6a18f'}[st]||'#8f9489';
  }
  if(this.mode==='opinion')return opinionColor(this._provinceOpinion(p));
  if(this.mode==='revolt')return heatColor(this._provinceRevoltRisk(p)/100,[102,145,112],[204,76,66]);
  if(this.mode==='economy'){
   const st=this.game?.provinces?.[p.id];
   return heatColor(((st?.development??p.development??1)*0.6+(st?.prosperity??1)*3)/14,[112,98,82],[236,196,88]);
  }
  if(this.mode==='epidemics'){
   const epi=this.game?.heritage?.epidemics?.[p.id]||this.game?.provinces?.[p.id]?.epidemic;
   return epi?'#b84863':heatColor((this.game?.provinces?.[p.id]?.unrest||0)/6,[111,141,123],[164,116,96]);
  }
  const owner=this.game?.provinces?.[p.id]?.owner??p.owner;
  return this.game?.factions?.[owner]?.color||this.ownerColors[owner]||'#b4b09a';
 }
 provinceColor(p){
  const hex=this._rawBaseColor(p);
  if(hex.startsWith('rgb'))return hex;
  const owner=this.game?.provinces?.[p.id]?.owner??p.owner;
  const light=this.mode==='political'?(owner===this.game?.player?.10:.22):.15;
  return atlasColor(hex,light);
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

 setRelief(v){
  this.useRelief=Boolean(v);
  if(!this.useRelief&&this.terrain?.gl){
   const gl=this.terrain.gl;gl.clearColor(.11,.22,.28,1);gl.clear(gl.COLOR_BUFFER_BIT);
  }
  this.render();
 }
 get compression(){return this.useRelief&&this.terrain?.ready?0.82:1;}
 select(id){this.selected=id;this.render();}
 setMarchOrigin(id){this.marchOrigin=id;this.render();}
 focus(lon,lat,z=2.6){this.zoom=clamp(z,bounds.minZoom,bounds.maxZoom);this.panX=-lon*this.scale();this.panY=lat*this.scale()*this.compression;this.render();}
 focusOldWorld(){this.focus(56,33,2.05);}
 scale(){return Math.min(this.w/355,this.h/150)*this.zoom;}

 _sampleHeight(lon,lat){
  const tier=this._activeTier();
  if(!tier.sampleHeight||!this.useRelief||!this.terrain?.ready)return 0;
  return this.terrain.sampleHeight?.(lon,lat)||0;
 }
 toScreen(lon,lat,withHeight=false){
  const cam=this._camera();
  const h=withHeight?this._sampleHeight(lon,lat):0;
  return projectMapPoint(cam,lon,lat,h);
 }
 toGeo(x,y){
  const cam=this._camera();
  return unprojectScreenPoint(cam,x,y,this._activeTier().sampleHeight?(lo,la)=>this._sampleHeight(lo,la):null);
 }
 pick(x,y){return this.geoIndex.pick(x,y,inside);}
 pickHistorical(x,y){return this.historyIndex?.pick(x,y,inside)||null;}
 trace(ctx,geo){drawGeoPath(ctx,geo);}

 _occupationPattern(color){
  if(!this.occPatterns.has(color)&&this.ctx){
   this.occPatterns.set(color,buildOccupationPattern(this.ctx,color));
  }
  return this.occPatterns.get(color);
 }

 _edgeKeyFn(){
  if(this.mode==='dejure')return id=>this.game?.feudal?.titles?.['c:'+id]?.deJureRealm||this.provinceIndex.get(id)?.deJureKingdom||this.provinceIndex.get(id)?.owner;
  if(this.mode==='culture')return id=>this.game?.civic?.provinces?.[id]?.culture||this.provinceIndex.get(id)?.culture||id;
  if(this.mode==='religion')return id=>this.game?.civic?.provinces?.[id]?.faith||this.provinceIndex.get(id)?.faith||id;
  if(this.mode==='vassals')return id=>this.game?.feudal?.titles?.['c:'+id]?.holderId||this.game?.provinces?.[id]?.owner||id;
  return id=>this.game?.provinces?.[id]?.owner??this.provinceIndex.get(id)?.owner;
 }

 _drawProvinceColors(c,s,provinces,project,viewport,gpu){
  const tier=this._activeTier();
  const useInnerGlow=gpu&&tier.id!=='low'&&['political','vassals','diplomacy','dejure'].includes(this.mode);
  const edgeKeyFn=this._edgeKeyFn();
  const grouped=new Map();

  c.save();c.lineJoin='round';
  for(const p of provinces){
   const owner=this.game?.provinces?.[p.id]?.owner??p.owner;
   c.beginPath();drawGeoPath(c,p.geometry,project);
   c.fillStyle=this.provinceColor(p);
   // Over WebGL2 3D terrain, keep fills translucent so mountains, valleys & shadows breathe through.
   c.globalAlpha=gpu
    ?(this.mode==='terrain'?0.26:this.mode==='political'?(owner===this.game?.player?0.56:0.46):0.54)
    :(this.mode==='political'?(owner===this.game?.player?0.96:0.84):0.88);
   c.fill('evenodd');

   // Diagonal war occupation stripes (CK2/CK3 style).
   const occ=occupation(this.game||{},p.id);
   if(occ){
    const occColor=this.game.factions[occ.by]?.color||'#c9544c';
    const pat=this._occupationPattern(occColor);
    if(pat){c.globalAlpha=0.82;c.fillStyle=pat;c.fill('evenodd');}
    c.globalAlpha=1;
    c.strokeStyle=occColor;c.lineWidth=project?1.8:clamp(3/s,.13,1.2);
    c.setLineDash(project?[6,4]:[4/s,2/s]);c.stroke();c.setLineDash([]);
   }else if(!project){
    c.globalAlpha=1;
    c.lineWidth=clamp(.72/s,.025,.32);c.strokeStyle='rgba(54,43,31,.28)';c.stroke();
   }

   if(useInnerGlow){
    const gKey=edgeKeyFn(p.id);
    if(!grouped.has(gKey))grouped.set(gKey,{provinces:[],ids:new Set(),color:this._rawBaseColor(p)});
    const entry=grouped.get(gKey);
    entry.provinces.push(p);entry.ids.add(p.id);
   }
  }

  // Signature CK3 inner-border gradient ribbon strictly along foreign frontiers (skipped on low tier).
  if(useInnerGlow&&this.zoom>=1.1){
   const glowWidth=clamp(5.2+this.zoom*1.15,4.5,11);
   for(const [gKey,entry] of grouped){
    if(gKey==='independent'||!entry.provinces.length)continue;
    c.save();
    c.beginPath();
    for(const p of entry.provinces)drawGeoPath(c,p.geometry,project);
    c.clip('evenodd');
    c.beginPath();
    for(const e of this.edges){
     if(viewport&&(Math.max(e.a[0],e.b[0])<viewport[0]||Math.min(e.a[0],e.b[0])>viewport[2]||Math.max(e.a[1],e.b[1])<viewport[1]||Math.min(e.a[1],e.b[1])>viewport[3]))continue;
     if(!e.ids.some(id=>entry.ids.has(id)))continue;
     if(politicalEdgeKind(e,edgeKeyFn)==='district')continue;
     const p0=project(e.a[0],e.a[1]),p1=project(e.b[0],e.b[1]);
     c.moveTo(p0[0],p0[1]);c.lineTo(p1[0],p1[1]);
    }
    c.lineWidth=glowWidth;
    c.strokeStyle=entry.color.startsWith('rgb')?entry.color:atlasColor(entry.color,0);
    c.globalAlpha=0.38;
    c.stroke();
    c.restore();
   }
  }
  c.restore();
 }

 _drawHistorical(c,s,viewport,project){
  if(!this.history?.features?.length)return;
  c.save();c.lineJoin='round';
  const candidates=new Set(this.historyIndex.query(viewport));
  for(let i=0;i<this.history.features.length;i++){
   const f=this.history.features[i];if(!candidates.has(f))continue;
   c.beginPath();drawGeoPath(c,f.geometry,project);
   c.fillStyle=polityColor(i);c.globalAlpha=project?.56:.83;c.fill('evenodd');
   c.globalAlpha=1;c.strokeStyle='rgba(45,35,25,.75)';c.lineWidth=project?1.2:clamp(1.35/s,.06,.65);c.stroke();
  }
  c.restore();
 }

 _markArmy(c,a,offset=0,project){
  const province=this.provinceIndex.get(a.province);if(!province)return;
  const [x,y]=project(...province.centroid);if(x<20||y<32||x>this.w-25||y>this.h-30)return;
  const mine=a.owner===this.game?.player;
  const enemyWar=this.game?.factions?.[this.game?.player]?.atWarWith?.includes(a.owner);
  this.armyMarkers??=[];const marker={province:a.province,owner:a.owner,troops:a.troops,x:x+offset,y:y-16,halfWidth:13,bottom:14};this.armyMarkers.push(marker);

  c.save();c.translate(x+offset,y-16);
  // Ground standee drop shadow for tabletop 3D presence.
  c.fillStyle='rgba(16,18,14,.42)';c.beginPath();c.ellipse(0,13,9,3.4,0,0,Math.PI*2);c.fill();
  // Standee pole & shield crest.
  c.fillStyle='#d9c17a';c.fillRect(-1,-3,2,16);
  c.shadowColor='rgba(18,20,16,.55)';c.shadowBlur=5;
  c.fillStyle=mine?'#cfa247':enemyWar?'#9c3f37':'#5d564e';
  c.strokeStyle=mine?'#f6e19b':enemyWar?'#f4a498':'#2d2a24';c.lineWidth=1.5;
  c.beginPath();c.moveTo(-7,-13);c.lineTo(7,-13);c.lineTo(7,4);c.lineTo(0,11);c.lineTo(-7,4);c.closePath();
  c.fill();c.stroke();c.shadowBlur=0;
  c.fillStyle='#ede4c7';c.font='bold 10px Georgia';c.textAlign='center';c.textBaseline='middle';
  const art=realmArt(a.owner);this.realmArtCache??=new Map();let icon=art&&this.realmArtCache.get(art);
  if(art&&!icon){icon=new Image();icon.onload=()=>this.render();icon.src=art;this.realmArtCache.set(art,icon);}
  if(icon?.complete&&icon.naturalWidth)c.drawImage(icon,-9,-12,18,18);else c.fillText('⚔',0,-3);

  if(this.zoom>=1.9||mine||enemyWar){
   const text=a.troops>=1000?(a.troops/1000).toFixed(1).replace(/\.0$/,'')+'k':String(a.troops);
   c.font='bold 10px system-ui';const w=c.measureText(text).width+11;
   marker.halfWidth=Math.max(12,w/2);marker.bottom=30;
   c.fillStyle=mine?'#3b3019':enemyWar?'#4c1d1a':'#2f2d2a';
   c.strokeStyle=mine?'#cfa247':enemyWar?'#c76054':'#787066';c.lineWidth=1;
   c.fillRect(-w/2,13,w,15);c.strokeRect(-w/2,13,w,15);
   c.fillStyle='#fff2cf';c.fillText(text,0,20.5);
  }
  c.restore();
 }

 _realmSeats(){
  const key=seatSignature(this.world,this.game);
  if(this.seatCache?.key===key)return this.seatCache.value;
  const factions=this.game?Object.values(this.game.factions).filter(f=>f.id!=='independent'&&f.capital):this.world.factions;
  const states=this.game?.provinces,world={...this.world,factions},by=new Map(world.provinces.map(p=>[p.id,p]));
  const ownedMap=new Map();
  for(const p of world.provinces){
   const o=states?states[p.id]?.owner:p.owner;
   if(!ownedMap.has(o))ownedMap.set(o,[]);
   ownedMap.get(o).push(p.centroid);
  }
  const value=factions.map(f=>{
   const seat=capitalDistrict(world,f.id,states);
   const points=ownedMap.get(f.id)||[];
   return seat?{f,seatId:seat.id,point:by.get(seat.id).centroid,points,count:points.length}:null;
  }).filter(Boolean).sort((a,b)=>b.count-a.count||a.f.id.localeCompare(b.f.id));
  this.seatCache={key,value};
  return value;
 }

 _labels(c,s,seats,project){
  c.save();c.textAlign='center';c.textBaseline='middle';const used=[];
  // Reserve screen space occupied by army standees & capitals so labels never collide with shields/numbers.
  for(const m of this.armyMarkers||[])used.push([m.x,m.y+6,m.halfWidth*2.2,46]);
  for(const {point} of seats){const [sx,sy]=project(...point);used.push([sx,sy,24,22]);}
  if(this.mode==='historical'&&this.history){
   const entries=this.historyLabels;
   for(const {f,area,point} of entries){
    const [x,y]=project(...point);if(x<38||y<40||x>this.w-38||y>this.h-48)continue;
    const text=String(f.properties.name||'').toUpperCase(),font=clamp(10+Math.sqrt(area)*.48,11,17);c.font='600 '+font+'px Georgia';
    const width=c.measureText(text).width;if(used.some(v=>Math.abs(x-v[0])<Math.max(width,v[2])*.56&&Math.abs(y-v[1])<20))continue;
    c.lineWidth=3.2;c.strokeStyle='rgba(240,222,182,.84)';c.strokeText(text,x,y);c.fillStyle='rgba(45,49,40,.89)';c.fillText(text,x,y);used.push([x,y,width]);if(used.length>65)break;
   }
  }else if(this.mode==='political'){
   for(const {f,point,points} of seats){
    if(this.zoom<1.55&&!['france','england','ottomans','ming','delhi','timurids','mali','inca','ashikaga','mexica','vijayanagara','ethiopia','mamluks'].includes(f.id))continue;
    const label=f.name.toUpperCase();
    // Use CK2/CK3 curved realm spine typography (translucent watermark above county labels at close zoom).
    if(points.length>=2&&this.zoom<5.8){
     const prevAlpha=c.globalAlpha;
     if(this.zoom>=4.2)c.globalAlpha=0.58;
     const box=drawCurvedRealmLabel(c,label,points,project,this.w,this.h,this.zoom,used);
     c.globalAlpha=prevAlpha;
     if(box){used.push(box);continue;}
    }
    const [x,y]=project(...point);if(x<22||y<36||x>this.w-22||y>this.h-42)continue;
    const font=clamp(9+this.zoom*.83,10,16);c.font='bold '+font+'px Georgia,serif';
    const ww=c.measureText(label).width;if(used.some(([px,py,pw,ph=22])=>Math.abs(x-px)<(ww+pw)*.50&&Math.abs((y+22)-py)<(font+ph)*0.55))continue;
    c.lineWidth=3.5;c.strokeStyle='rgba(232,218,182,.88)';c.strokeText(label,x,y+22);c.fillStyle='#242c27';c.fillText(label,x,y+22);used.push([x,y+22,ww,font+6]);
   }
   if(this.zoom>=4.0&&this.world.meta?.mapVersion==='atlas-1450-v4'){
    c.font='11px Georgia';
    for(const p of this.world.provinces){
     const [x,y]=project(...p.centroid);if(x<38||y<58||x>this.w-38||y>this.h-40)continue;
     const label=p.name,ww=c.measureText(label).width;
     if(used.some(([px,py,pw])=>Math.abs(x-px)<(ww+pw)*.53&&Math.abs(y-py)<25))continue;
     c.lineWidth=2.5;c.strokeStyle='rgba(235,219,185,.88)';c.strokeText(label,x,y);c.fillStyle='#313932';c.fillText(label,x,y);
     used.push([x,y,ww]);if(used.length>=90)break;
    }
   }
  }
  c.restore();
 }

 _cityMarkers(c,seats,project,nowMs){
  const tier=this._activeTier();
  const seatSet=new Set(seats.map(s=>s.seatId));
  let drawn=0;const capBudget=tier.castleBudget||96;
  c.save();
  for(const {f,seatId,point} of seats){
   if(drawn>=capBudget)break;
   const [x,y]=project(...point);if(x<18||y<25||x>this.w-18||y>this.h-35)continue;
   const st=this.game?.provinces?.[seatId];
   drawSettlement(c,x,y,{
    major:this.game?.player===f.id,
    fort:st?.fort||0,
    siege:(st?.siege?.progress||0)>0,
    tradeCenter:!!this.provinceIndex.get(seatId)?.tradeCenter,
    color:f.color,
    zoom:this.zoom,
    timeMs:nowMs
   });
   drawn++;
  }
  if(this.zoom>=2.0){
   for(const p of this.world.provinces){
    if(drawn>=capBudget)break;
    if(seatSet.has(p.id))continue;
    const st=this.game?.provinces?.[p.id];
    const hasSiege=(st?.siege?.progress||0)>0;
    if(!p.tradeCenter&&!hasSiege&&(st?.fort||0)<2)continue;
    const [x,y]=project(...p.centroid);if(x<24||y<30||x>this.w-24||y>this.h-38)continue;
    drawSettlement(c,x,y,{major:false,fort:st?.fort||0,siege:hasSiege,tradeCenter:!!p.tradeCenter,zoom:this.zoom,timeMs:nowMs});
    drawn++;
   }
  }
  c.restore();
 }

 _hoverTip(c){
  if(!this.hover)return;
  const [cx,cy]=this.toScreen(...this.hover.centroid,true),state=this.game?.provinces?.[this.hover.id],f=this.game?.factions?.[state?.owner]||this.world.factions.find(f=>f.id===this.hover.owner);
  let detail='';
  if(this.mode==='culture')detail=' · '+(this.game?.civic?.provinces?.[this.hover.id]?.culture||this.hover.culture||'Local');
  else if(this.mode==='religion')detail=' · '+(this.game?.civic?.provinces?.[this.hover.id]?.faith||this.hover.faith||'Local');
  else if(this.mode==='dejure')detail=' · '+(this.hover.deJureDuchy||this.hover.deJureKingdom||'Realm');
  else if(this.mode==='terrain')detail=' · '+(this.hover.terrain||'plains').toUpperCase()+(this.hover.tradeCenter?' · ⚓ Trade':'');
  else if(this.mode==='vassals'||this.mode==='diplomacy'||this.mode==='opinion'||this.mode==='revolt'||this.mode==='economy'||this.mode==='epidemics')detail=' · '+this.provinceCategory(this.hover);
  else if(state){const pol=this.game?.independentPolities?.[this.hover.id];detail=' · Pop '+Math.round(state.population)+'k · Dev '+state.development+(pol?` · Ruler ${pol.rulerName}`:'')+(this.hover.tradeCenter?' · ⚓':'');}
  const rulerLabel=f?.name||this.game?.independentPolities?.[this.hover.id]?.name||'Independent';
  const text=this.mode==='historical'&&this.hoverHistorical?'1450 SOURCE: '+this.hoverHistorical.properties.name:(this.hover.name+' · '+rulerLabel+detail);
  c.font='11px Georgia';const width=clamp(c.measureText(text).width+18,90,this.w-36),x=clamp(cx+13,20,this.w-width-20),y=clamp(cy-25,30,this.h-41);
  c.fillStyle='rgba(33,38,34,.96)';c.strokeStyle='#c49a45';c.lineWidth=1;c.fillRect(x,y,width,24);c.strokeRect(x,y,width,24);c.fillStyle='#ecdcb9';c.textAlign='left';c.textBaseline='middle';c.fillText(text,x+9,y+12,width-16);
 }

 _scheduleAmbient(){
  const tier=this._activeTier();
  const inBattle=typeof document!=='undefined'&&(document.hidden||document.body?.classList?.contains('in-battle')||!document.getElementById('hometown-screen')?.hidden);
  if(!tier.animateWater||!this.useRelief||!this.terrain?.ready||inBattle||!this.game){
   if(this.ambientTimer){clearTimeout(this.ambientTimer);this.ambientTimer=null;}
   return;
  }
  if(this.ambientTimer)return;
  this.ambientTimer=setTimeout(()=>{this.ambientTimer=null;this.render();},65);
 }

 render(){this.requestDraw?.();}

 drawFrame(){
  if(!this.ctx||!this.w||!this.h)return;
  const t0=typeof performance!=='undefined'?performance.now():0;
  const nowMs=Date.now();
  const c=this.ctx,w=this.w,h=this.h,cam=this._camera(),s=cam.scale;
  const tier=this._activeTier();
  const project=(lon,lat)=>projectMapPoint(cam,lon,lat,tier.sampleHeight?this._sampleHeight(lon,lat):0);

  // Frustum-safe viewport query over all 4 padded corners (accounts for 3D tilt widening near top horizon).
  const pad=50;
  const corners=[this.toGeo(-pad,-pad),this.toGeo(w+pad,-pad),this.toGeo(-pad,h+pad),this.toGeo(w+pad,h+pad)];
  const viewport=[
   Math.min(...corners.map(k=>k[0])),
   Math.min(...corners.map(k=>k[1])),
   Math.max(...corners.map(k=>k[0])),
   Math.max(...corners.map(k=>k[1]))
  ];
  const visible=this.geoIndex.query(viewport),visibleWorld={...this.world,provinces:visible};

  // Run WebGL2 3D perspective terrain across ALL map modes whenever relief is enabled.
  const gpu=this.useRelief&&this.terrain?.render(w,h,this.dpr,this.zoom,this.panX,this.panY,this.compression,{
   pitchDeg:cam.pitchDeg,
   camDist:cam.camDist,
   reliefAmp:cam.reliefAmp,
   timeMs:nowMs
  });

  c.setTransform(this.dpr,0,0,this.dpr,0,0);
  c.clearRect(0,0,w,h);
  if(!gpu)drawSea(c,w,h,this.paper);

  // Screen-space projected layers stay pixel-locked to WebGL2 heightfield & mouse picking.
  const geoProject=gpu?project:null;
  if(!gpu){
   c.save();c.translate(w*.5+this.panX,h*.5+this.panY);c.scale(s,-s*this.compression);
  }
  drawLand(c,visibleWorld,s,geoProject);
  if(this.mode==='historical'){
   this._drawHistorical(c,s,viewport,geoProject);
  }else{
   this._drawProvinceColors(c,s,visible,geoProject,viewport,gpu);
   if(['political','vassals','diplomacy','opinion','revolt','economy','epidemics','culture','religion','dejure'].includes(this.mode)){
    drawDivisions(c,visible.map(p=>this.countyIndex.get(p.id)).filter(Boolean),s,this.zoom>=4.4&&this.w>=700,geoProject);
    drawPoliticalEdges(c,this.edges,this._edgeKeyFn(),s,viewport,geoProject);
   }
  }
  if(this.mode!=='historical')drawTopography(c,visibleWorld,s,geoProject,tier.treeBudget??200);

  if(this.marchOrigin&&this.game){
   const originP=this.provinceIndex.get(this.marchOrigin);
   const originPx=originP?project(...originP.centroid):null;
   for(const id of originP?.neighbors||[]){
    const dest=this.provinceIndex.get(id);if(!dest)continue;
    const friendly=this.game.provinces[id]?.owner===this.game.player;
    c.beginPath();drawGeoPath(c,dest.geometry,geoProject);
    c.fillStyle=friendly?'rgba(105,190,149,.26)':'rgba(222,126,83,.30)';c.fill('evenodd');
    c.strokeStyle=friendly?'#c2f0b8':'#ffd0a1';c.lineWidth=geoProject?2.4:clamp(2.6/s,.08,.8);c.stroke();
    if(this.hover?.id===id&&originPx&&geoProject){
     drawMarchArc(c,originPx,project(...dest.centroid),friendly);
    }
   }
  }
  const selected=this.world.provinces.find(p=>p.id===this.selected);
  if(selected){
   c.beginPath();drawGeoPath(c,selected.geometry,geoProject);
   c.fillStyle='rgba(255,217,126,.16)';c.fill('evenodd');
   c.lineWidth=geoProject?2.8:clamp(3.4/s,.12,.95);c.strokeStyle='#fff0b7';c.stroke();
  }
  if(this.hover&&this.hover.id!==this.selected){
   c.beginPath();drawGeoPath(c,this.hover.geometry,geoProject);
   c.lineWidth=geoProject?2.1:clamp(2.5/s,.08,.7);c.strokeStyle='#f9e3ac';c.stroke();
  }
  if(!gpu)c.restore();

  drawOceanLettering(c,project,w,h);
  const seats=this._realmSeats();
  this._cityMarkers(c,seats,project,nowMs);

  this.armyMarkers=[];
  if(this.game){
   const groups=atlasArmyGroups(this.game.armies,this.game.naval?.voyages),counts=new Map(),placedForeign=[];
   const compactMobile=this.w<680&&this.zoom<1.9;
   for(const a of groups){
    const mine=a.owner===this.game.player,enemyWar=this.game.factions?.[this.game.player]?.atWarWith?.includes(a.owner);
    if(compactMobile&&!mine&&!enemyWar){
     const prov=this.provinceIndex.get(a.province);
     if(prov){const [ax,ay]=project(...prov.centroid);if(placedForeign.some(([px,py])=>Math.hypot(ax-px,ay-py)<26))continue;placedForeign.push([ax,ay]);}
    }
    const n=counts.get(a.province)||0;counts.set(a.province,n+1);this._markArmy(c,a,n*17,project);
   }
  }
  if(this.mode!=='terrain')this._labels(c,s,seats,project);

  if(w>700&&h>350)drawRosette(c,55,h-75,20);
  c.save();c.fillStyle='rgba(234,217,176,.88)';c.strokeStyle='rgba(102,84,53,.66)';c.lineWidth=1.1;
  const mastheadMap={historical:'THE HISTORICAL ATLAS',terrain:'RELIEF OF THE EARTH',culture:'CULTURES OF 1450',religion:'FAITHS OF 1450',dejure:'DE JURE REALMS OF 1450',vassals:'FEUDAL VASSALS',diplomacy:'DIPLOMATIC WEB',opinion:'REALM OPINIONS',revolt:'REVOLT & UNREST',economy:'PROSPERITY & WEALTH',epidemics:'PESTILENCE & HEALTH'};
  const masthead=mastheadMap[this.mode]||'THE KINGDOMS OF 1450';
  const bx=w*.5-111;
  if(w>=700){c.fillRect(bx,19,222,34);c.strokeRect(bx,19,222,34);c.font='bold 13px Georgia';c.textAlign='center';c.fillStyle='#463925';c.fillText(masthead,w/2,40);}
  c.restore();
  if(w>=700)atlasBorders(c,w,h);
  c.font='10px Georgia';c.textAlign='left';c.textBaseline='alphabetic';c.fillStyle='rgba(232,220,188,.76)';
  if(w>=700)c.fillText(this.mode==='historical'?'CLIOPATRIA / SESHAT · CC BY 4.0 · INCOMPLETE COVERAGE':`${masthead} · 1450 CAMPAIGN ATLAS`,25,h-24);
  this._hoverTip(c);

  if(gpu&&t0>0&&this.terrain?.governor){
   const downgraded=this.terrain.governor.recordFrame(performance.now()-t0);
   if(downgraded)this.dpr=Math.min(this.dpr,this._activeTier().maxDpr);
  }
  this._scheduleAmbient();
 }
}
