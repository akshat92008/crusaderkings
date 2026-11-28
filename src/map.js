import {realmArt} from './game-art.js';
import {pickArmyMarker} from './campaign-hud.js';
import {geographicIndex,seatSignature,frameCoalescer} from './render-performance.js';
import {capitalDistrict} from './historical-world.js';
import {occupation} from './campaign-war.js';
import {ReliefMap,computeMapPitchDeg} from './relief-map.js';
import {buildOrganicVisualWorld} from './map-organic-geo.js';
import {
 atlasPaper,atlasColor,buildDecorativeCounties,drawGeoPath,drawSea,drawLand,buildOccupationPattern,
 drawTopography,drawDivisions,drawRosette,atlasBorders,drawSettlement,drawOceanLettering,
 buildAtlasEdges,drawPoliticalEdges,politicalEdgeKind,atlasArmyGroups,drawCurvedRealmLabel,drawMarchArc
} from './atlas-art.js';

/** Crown of Nations — unified Three.js 3D CK2/CK3 tabletop atlas + adaptive low-end fallback. */
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n)),bounds={minZoom:.55,maxZoom:16};
const TAN_HALF_FOV=Math.tan(19*Math.PI/180);
function pointRing(x,y,ring){let hit=false;for(let i=0,j=ring.length-1;i<ring.length;j=i++){const xi=ring[i][0],yi=ring[i][1],xj=ring[j][0],yj=ring[j][1];if((yi>y)!==(yj>y)&&x<(xj-xi)*(y-yi)/(yj-yi)+xi)hit=!hit;}return hit;}
function pointPolygon(x,y,rings){return pointRing(x,y,rings[0])&&!rings.slice(1).some(r=>pointRing(x,y,r));}
export function inside(x,y,geo){if(geo?.type==='Polygon')return pointPolygon(x,y,geo.coordinates);if(geo?.type==='MultiPolygon')return geo.coordinates.some(r=>pointPolygon(x,y,r));return false;}

/** Perspective camera projection matched bit-for-bit with ThreeMapScene's 38° PerspectiveCamera. */
export function buildMapCamera(w,h,zoom,panX,panY,compression,pitchDeg=0,reliefAmp=0){
 const safeW=Math.max(1,w),safeH=Math.max(1,h);
 const scale=Math.min(safeW/355,safeH/150)*zoom;
 const centerLon=-panX/scale;
 const centerLat=panY/(scale*compression);
 const rad=pitchDeg*Math.PI/180;
 const pitchSin=Math.sin(rad),pitchCos=Math.cos(rad);
 const camDist=(safeH*0.5)/TAN_HALF_FOV;
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
 const depth=Math.max(cam.camDist*0.12,cam.camDist+dy*cam.pitchSin-dz*cam.pitchCos);
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
  for(let step=0;step<8;step++){
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

const MAP_MODES=['political','vassals','diplomacy','dynasty','duchies','dejure','government','opinion','revolt','economy','control','trade','epidemics','terrain','culture','religion','historical'];
const GOVERNMENT_COLORS={
 feudal:'#4f7bb5',centralized:'#6a62ad',imperial:'#d6a742',sultanate:'#499665',
 republic:'#bf4b4b',steppe:'#ba8444',military:'#5b7180',shogunate:'#c7633e',
 tributary:'#4c918d',regional:'#7e9658',city:'#985678',confederation:'#c29952',kinship:'#889979'
};
const GOVERNMENT_LABELS={
 feudal:'Feudal',centralized:'Centralized Crown',imperial:'Imperial Bureaucracy',sultanate:'Sultanate',
 republic:'Commercial Republic',steppe:'Steppe Khanate',military:'Military Oligarchy',shogunate:'Shogunate',
 tributary:'Tributary Network',regional:'Regional Land Grants',city:'Urban League',confederation:'Confederation',kinship:'Kinship'
};
const DIPLO_COLORS={self:'#58a868',war:'#cc4b43',alliance:'#4682c4',pact:'#72afd9',claim:'#e3b43c',truce:'#8e78c4',tributary:'#c98c44',trade:'#6ea89c',neutral:'#8a8d82',independent:'#a8a28e'};
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
  this.canvas=canvas;this.ctx=canvas.getContext('2d');
  this.world=world;
  this.visualWorld=buildOrganicVisualWorld(world);
  this.onProvince=onProvince;
  this.game=null;this.selected=null;this.hover=null;this.hoverHistorical=null;
  this.zoom=1.02;this.panX=0;this.panY=0;this.drag=null;this.mode='political';this.history=null;this.useRelief=true;
  this.counties=buildDecorativeCounties(this.visualWorld);
  this.edges=buildAtlasEdges(this.visualWorld);
  this.provinceIndex=new Map(this.visualWorld.provinces.map(p=>[p.id,p]));
  this.ownerColors=Object.fromEntries(world.factions.map(f=>[f.id,f.color]));
  this.paper=this.ctx?atlasPaper(this.ctx):null;
  this.occPatterns=new Map();
  this.geoIndex=geographicIndex(this.visualWorld.provinces);
  this.countyIndex=new Map(this.counties.map(c=>[c.id,c]));
  this.requestDraw=frameCoalescer(cb=>requestAnimationFrame(cb),()=>this.drawFrame());
  this.ambientTimer=null;this.lastGpuStateSig='';

  const terrainCanvas=document.getElementById('terrain-map');
  this.terrain=terrainCanvas?new ReliefMap(terrainCanvas,()=>this.render(),this.visualWorld):null;

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
  const reliefAmp=(use3d&&comp<1)?6.2:0;
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
  this.world=world;
  this.visualWorld=buildOrganicVisualWorld(world);
  this.geoIndex=geographicIndex(this.visualWorld.provinces);
  this.seatCache=null;this.game=null;this.selected=null;this.hover=null;this.hoverHistorical=null;this.lastGpuStateSig='';
  this.counties=buildDecorativeCounties(this.visualWorld);
  this.edges=buildAtlasEdges(this.visualWorld);
  this.provinceIndex=new Map(this.visualWorld.provinces.map(p=>[p.id,p]));
  this.ownerColors=Object.fromEntries(world.factions.map(f=>[f.id,f.color]));
  this.countyIndex=new Map(this.counties.map(c=>[c.id,c]));
  if(this.terrain)this.terrain.rebuildTextures(this.visualWorld);
  this.render();
 }
 setGame(g){this.game=g;this.lastGpuStateSig='';this.render();}
 setHistorical(data){this.history=data?.features?data:null;this.historyIndex=this.history?geographicIndex(this.history.features):null;this.historyLabels=this.history?.features.map((f,i)=>({f,i,area:areaOf(f.geometry),point:centerOf(f.geometry)})).filter(o=>o.area>1.8).sort((a,b)=>b.area-a.area)||[];this.render();}
 setMode(mode){if(!MAP_MODES.includes(mode))return;this.mode=mode;this.lastGpuStateSig='';this.render();}

 _diplomacyFocusOwner(){
  const g=this.game;if(!g)return null;
  const selOwner=this.selected&&g.provinces?.[this.selected]?.owner;
  if(selOwner&&selOwner!=='independent'&&g.factions?.[selOwner])return selOwner;
  return g.player;
 }
 _diplomacyClaimCache(focus){
  const g=this.game;if(!g||!focus)return {provs:new Set(),realms:new Set()};
  const key=(g.turn??-1)+'|'+focus+'|'+Object.keys(g.conflict?.claims||{}).length+'|'+Object.keys(g.feudal?.claimants||{}).length;
  if(this._claimCache?.key===key)return this._claimCache;
  const provs=new Set(),realms=new Set(),districts=g.feudal?.districts||{};
  for(const cl of Object.values(g.conflict?.claims||{})){
   if(!cl||cl.realm!==focus||(cl.expires!=null&&cl.expires<=g.turn))continue;
   if(cl.province)provs.add(cl.province);
   if(cl.tier==='duchy'&&cl.titleId&&districts[cl.titleId]?.members){for(const mid of districts[cl.titleId].members)provs.add(mid);}
   if(cl.tier==='kingdom'&&cl.foreign)realms.add(cl.foreign);
  }
  for(const c of Object.values(g.feudal?.claimants||{})){
   if(!c||!c.realm)continue;
   const person=g.politics?.people?.[c.person];
   if(person?.alive&&person.realm===focus)realms.add(c.realm);
  }
  for(const person of Object.values(g.politics?.people||{})){
   if(!person?.alive||person.realm!==focus||!person.claims?.length)continue;
   for(const target of person.claims){
    if(typeof target!=='string')continue;
    if(target.startsWith('c:'))provs.add(target.slice(2));
    else realms.add(target.replace(/^k:/,''));
   }
  }
  return (this._claimCache={key,provs,realms});
 }
 _diplomacyStatus(owner,provId=null){
  const g=this.game,p=this._diplomacyFocusOwner();
  if(!g||!owner||owner==='independent')return 'independent';
  if(owner===p)return 'self';
  const f=g.factions?.[p],pairKey=[p,owner].sort().join('|');
  if(f?.atWarWith?.includes(owner)||Object.values(g.conflict?.wars||{}).some(w=>w.status==='active'&&((w.attacker===p&&w.defender===owner)||(w.defender===p&&w.attacker===owner))))return 'war';
  const treaty=f?.treaties?.[owner];
  if(treaty==='alliance')return 'alliance';
  if(treaty==='non_aggression'||treaty==='betrothal'||treaty==='marriage'||(g.diplomacy?.pacts?.[pairKey]?.until||0)>g.turn)return 'pact';
  if((f?.truces?.[owner]||0)>0||(g.conflict?.truces?.[pairKey]||0)>g.turn)return 'truce';
  if(g.diplomacy?.tributaries?.[owner]===p||g.diplomacy?.tributes?.[owner]?.suzerain===p||g.diplomacy?.tributes?.[p]?.suzerain===owner)return 'tributary';
  if(provId){
   const claims=this._diplomacyClaimCache(p);
   const djRealm=g.feudal?.titles?.['c:'+provId]?.deJureRealm;
   if(claims.provs.has(provId)||claims.realms.has(owner)||(djRealm&&djRealm===p))return 'claim';
  }
  if(treaty==='trade')return 'trade';
  return 'neutral';
 }
 _titleHolder(provId){
  const g=this.game;if(!g)return null;
  const t=g.feudal?.titles?.['c:'+provId];
  return t?.holder||t?.holderId||g.politics?.holdings?.[provId]?.lord||null;
 }
 _realmRuler(owner){
  const g=this.game;if(!g||!owner||owner==='independent')return null;
  return g.politics?.realms?.[owner]?.ruler||g.factions?.[owner]?.rulerId||null;
 }
 _dynastyHouse(owner,provId){
  const g=this.game;
  if(!owner||owner==='independent')return g?.independentPolities?.[provId]?.rulerName||'Local Chiefdom';
  const rulerId=this._realmRuler(owner),person=rulerId&&g?.politics?.people?.[rulerId];
  return person?.house||g?.kingdom?.courts?.[owner]?.dynasty||(g?.factions?.[owner]?.name||owner)+' House';
 }
 _duchyInfo(p){
  const g=this.game,key=(g?.turn??-1);
  if(this._duchyByProvKey!==key){
   this._duchyByProv=new Map();
   for(const d of Object.values(g?.feudal?.districts||{})){
    for(const mid of d.members||[])this._duchyByProv.set(mid,d);
   }
   this._duchyByProvKey=key;
  }
  const d=this._duchyByProv?.get(p.id);
  if(d)return {id:d.id,name:d.name||d.id};
  const fallback=p.deJureDuchy||p.deJureKingdom||p.region||p.continent;
  return {id:'dj:'+fallback,name:fallback};
 }
 _baronControlInfo(p){
  const g=this.game,st=g?.provinces?.[p.id],h=g?.politics?.holdings?.[p.id];
  if(!h)return {score:0,built:0,delegated:0,fort:st?.fort||0,label:'Unorganized Frontier'};
  const subs=h.subholdings||{};
  const kinds=['castle','city','temple'];
  let built=0,delegated=0,lv=0;
  for(const k of kinds){
   const row=subs[k],bRec=g.feudal?.baronies?.['b:'+p.id+':'+k];
   const l=(row?.level||0);if(l>0){built++;lv+=l;}
   const holder=row?.holder||(bRec?.granted?bRec?.holder:null);
   if(l>0&&holder&&holder!==h.lord)delegated++;
  }
  const occ=occupation(g,p.id),sieged=(st?.siege?.progress||0)>0,fort=st?.fort||0;
  const raw=lv*1.2+delegated*0.9+fort*1.4-(occ?3.5:0)-(sieged?4:0);
  const label=`C${subs.castle?.level||0}·Ci${subs.city?.level||0}·T${subs.temple?.level||0} · ${delegated}/${built} barons · Fort ${fort}`;
  return {score:clamp(raw/12,0,1),built,delegated,fort,sieged:Boolean(occ||sieged),label};
 }
 _tradeInfo(p){
  const g=this.game,st=g?.provinces?.[p.id],owner=st?.owner??p.owner;
  const isPort=Boolean(g?.naval?.ports?.[p.id]),blocked=Boolean(isPort&&g?.naval?.blockades?.[p.id]);
  const tradePartner=Boolean(owner&&owner!==g?.player&&g?.factions?.[g?.player]?.treaties?.[owner]==='trade');
  const dev=st?.development??p.development??1,prosp=st?.prosperity??1;
  const ratio=clamp((dev*0.75+prosp*2.4+(p.tradeCenter?5:0)+(isPort?2.2:0)+(tradePartner?2.5:0)-(blocked?5:0))/14,0,1);
  return {ratio,isPort,blocked,tradePartner,tradeCenter:Boolean(p.tradeCenter)};
 }
 _provinceOpinion(p){
  const g=this.game,state=g?.provinces?.[p.id],owner=state?.owner??p.owner;
  if(!g)return 0;
  if(owner==='independent')return g.independentPolities?.[p.id]?.opinion??0;
  const focus=this._diplomacyFocusOwner()||g.player;
  if(owner===focus){
   const holderId=this._titleHolder(p.id),sovereignId=this._realmRuler(owner);
   if(holderId&&holderId!==sovereignId){
    const vassal=g.politics?.people?.[holderId];
    return vassal?.opinion??15;
   }
   return 55;
  }
  return g.factions?.[owner]?.relations?.[focus]??g.factions?.[owner]?.relation??0;
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
  const g=this.game,owner=g?.provinces?.[p.id]?.owner??p.owner;
  if(this.mode==='culture')return g?.civic?.provinces?.[p.id]?.culture||p.culture||'Local culture';
  if(this.mode==='religion')return g?.civic?.provinces?.[p.id]?.faith||p.faith||'Local traditions';
  if(this.mode==='dejure'){
   const djRealm=g?.feudal?.titles?.['c:'+p.id]?.deJureRealm;
   return (djRealm&&g?.factions?.[djRealm]?.name)||p.deJureKingdom||g?.factions?.[p.owner]?.name||'Independent';
  }
  if(this.mode==='duchies')return this._duchyInfo(p).name;
  if(this.mode==='dynasty')return this._dynastyHouse(owner,p.id);
  if(this.mode==='government'){
   const gov=owner==='independent'?'kinship':(g?.civic?.realms?.[owner]?.government||'feudal');
   return GOVERNMENT_LABELS[gov]||gov.toUpperCase();
  }
  if(this.mode==='terrain')return (p.terrain||'plains').toUpperCase();
  if(this.mode==='vassals'){
   if(owner==='independent')return g?.independentPolities?.[p.id]?.rulerName||'Local Chiefdom';
   const holderId=this._titleHolder(p.id),sovereignId=this._realmRuler(owner);
   const holder=holderId&&g?.politics?.people?.[holderId];
   const realmName=g?.factions?.[owner]?.name||owner;
   if(holder&&holderId!==sovereignId)return `${holder.name} · Vassal (${realmName})`;
   return `Crown Demesne · ${realmName}`;
  }
  if(this.mode==='diplomacy'){
   const st=this._diplomacyStatus(owner,p.id);
   return st==='claim'?'CLAIM / CASUS BELLI':st.toUpperCase();
  }
  if(this.mode==='opinion')return `OPINION ${this._provinceOpinion(p)>=0?'+':''}${this._provinceOpinion(p)}`;
  if(this.mode==='revolt')return `UNREST ${this._provinceRevoltRisk(p)}%`;
  if(this.mode==='economy'){const st=g?.provinces?.[p.id];return `DEV ${st?.development??p.development??1} · PROSPERITY ${st?.prosperity??1}`;}
  if(this.mode==='control')return this._baronControlInfo(p).label;
  if(this.mode==='trade'){
   const ti=this._tradeInfo(p);
   return (ti.blocked?'BLOCKADED PORT':ti.tradeCenter?'TRADE HUB':ti.isPort?'SEA PORT':'INLAND')+(ti.tradePartner?' · TREATY':'');
  }
  if(this.mode==='epidemics'){const epi=g?.heritage?.epidemics?.[p.id]||g?.provinces?.[p.id]?.epidemic;return epi?epi.name||'OUTBREAK':'HEALTHY';}
  return g?.factions?.[owner]?.name||g?.independentPolities?.[p.id]?.name||'Independent';
 }
 _rawBaseColor(p){
  const g=this.game,owner=g?.provinces?.[p.id]?.owner??p.owner;
  if(this.mode==='culture')return categoryColor(this.provinceCategory(p));
  if(this.mode==='religion')return categoryColor(this.provinceCategory(p),FAITH_COLORS);
  if(this.mode==='dejure'){
   const djRealm=g?.feudal?.titles?.['c:'+p.id]?.deJureRealm;
   return (djRealm&&this.ownerColors[djRealm])||categoryColor(this.provinceCategory(p));
  }
  if(this.mode==='duchies')return categoryColor('duchy:'+this._duchyInfo(p).id);
  if(this.mode==='dynasty')return owner==='independent'?'#9b9583':categoryColor('house:'+this._dynastyHouse(owner,p.id));
  if(this.mode==='government'){
   const gov=owner==='independent'?'kinship':(g?.civic?.realms?.[owner]?.government||'feudal');
   return GOVERNMENT_COLORS[gov]||categoryColor(gov);
  }
  if(this.mode==='terrain')return TERRAIN_COLORS[p.terrain]||TERRAIN_COLORS.plains;
  if(this.mode==='vassals'){
   if(owner==='independent')return '#9e9a87';
   const holderId=this._titleHolder(p.id),sovereignId=this._realmRuler(owner);
   if(holderId&&holderId!==sovereignId)return categoryColor('vassal:'+holderId);
   return g?.factions?.[owner]?.color||this.ownerColors[owner]||'#b4b09a';
  }
  if(this.mode==='diplomacy')return DIPLO_COLORS[this._diplomacyStatus(owner,p.id)]||'#8a8d82';
  if(this.mode==='opinion')return opinionColor(this._provinceOpinion(p));
  if(this.mode==='revolt')return heatColor(this._provinceRevoltRisk(p)/100,[102,145,112],[204,76,66]);
  if(this.mode==='economy'){
   const st=g?.provinces?.[p.id];
   return heatColor(((st?.development??p.development??1)*0.6+(st?.prosperity??1)*3)/14,[112,98,82],[236,196,88]);
  }
  if(this.mode==='control'){
   const ci=this._baronControlInfo(p);
   if(ci.sieged)return '#b84b44';
   return heatColor(ci.score,[142,102,80],[61,152,148]);
  }
  if(this.mode==='trade'){
   const ti=this._tradeInfo(p);
   if(ti.blocked)return '#b84949';
   if(ti.tradeCenter)return '#eab848';
   return heatColor(ti.ratio,[104,96,84],[54,158,142]);
  }
  if(this.mode==='epidemics'){
   const epi=g?.heritage?.epidemics?.[p.id]||g?.provinces?.[p.id]?.epidemic;
   return epi?'#b84863':heatColor((g?.provinces?.[p.id]?.unrest||0)/6,[111,141,123],[164,116,96]);
  }
  return g?.factions?.[owner]?.color||this.ownerColors[owner]||'#b4b09a';
 }
 provinceColor(p){
  const hex=this._rawBaseColor(p);
  if(hex.startsWith('rgb'))return hex;
  const owner=this.game?.provinces?.[p.id]?.owner??p.owner;
  const light=this.mode==='political'?(owner===this.game?.player?.04:.14):.12;
  return atlasColor(hex,light);
 }
 modeLegend(){
  if(this.mode==='historical')return {title:'1450 Reference Layer',items:[{label:'Approximate 1450 polities',color:'#bc9eaa'},{label:'Incomplete source coverage',color:'#a7b6a0'}]};
  if(this.mode==='terrain')return {title:'Terrain',items:Object.entries(TERRAIN_COLORS).map(([k,color])=>({label:k.charAt(0).toUpperCase()+k.slice(1),color}))};
  if(this.mode==='political')return {title:'Kingdoms',items:[{label:'Your realm',color:this.game?.factions?.[this.game?.player]?.color||'#d8b777'},{label:'Foreign realms',color:'#bc746c'},{label:'Independent polities',color:'#b4b09a'}]};
  if(this.mode==='vassals')return {title:'Vassals & Lords (Global)',items:[{label:'Crown Demesne',color:this.game?.factions?.[this.game?.player]?.color||'#d8b777'},{label:'Direct Vassal Lord',color:'#8da87d'},{label:'Duke / Count Seat',color:'#6e95a3'},{label:'Local Polities',color:'#9e9a87'}]};
  if(this.mode==='diplomacy'){
   const focus=this._diplomacyFocusOwner(),focusName=this.game?.factions?.[focus]?.name||'Your Realm';
   return {title:`Diplomacy · ${focusName}`,items:[{label:focusName,color:DIPLO_COLORS.self},{label:'Alliance',color:DIPLO_COLORS.alliance},{label:'NAP / Marriage',color:DIPLO_COLORS.pact},{label:'Claims & CBs',color:DIPLO_COLORS.claim},{label:'At War',color:DIPLO_COLORS.war},{label:'Truce',color:DIPLO_COLORS.truce},{label:'Tributary',color:DIPLO_COLORS.tributary}]};
  }
  if(this.mode==='opinion'){
   const focus=this._diplomacyFocusOwner(),focusName=this.game?.factions?.[focus]?.name||'Ruler';
   return {title:`Opinion of ${focusName}`,items:[{label:'Loyal (+75)',color:'#4f9c64'},{label:'Neutral (0)',color:'#a89e7d'},{label:'Hostile (-75)',color:'#c44943'}]};
  }
  if(this.mode==='revolt')return {title:'Unrest & Revolt Risk',items:[{label:'Calm',color:'#669170'},{label:'Restive',color:'#cc964b'},{label:'Rebellious',color:'#cc4c42'}]};
  if(this.mode==='economy')return {title:'Prosperity & Dev',items:[{label:'Devastated',color:'#706252'},{label:'Steady',color:'#b0a168'},{label:'Booming',color:'#ecc458'}]};
  if(this.mode==='control')return {title:'Baron Seats & Fortifications',items:[{label:'Stronghold & Barons',color:'#3d9894'},{label:'Organized County',color:'#789c78'},{label:'Lightly Held',color:'#8e6650'},{label:'Sieged / Occupied',color:'#b84b44'}]};
  if(this.mode==='trade')return {title:'Trade & Maritime Network',items:[{label:'Major Trade Hub',color:'#eab848'},{label:'Prosperous / Port',color:'#369e8e'},{label:'Hinterland',color:'#686054'},{label:'Blockaded Port',color:'#b84949'}]};
  if(this.mode==='epidemics')return {title:'Pestilence & Health',items:[{label:'Healthy',color:'#6f8d7b'},{label:'Outbreak',color:'#b84863'}]};
  const counts=new Map();
  for(const p of this.world.provinces){const cat=this.provinceCategory(p);counts.set(cat,(counts.get(cat)||0)+1);}
  const top=[...counts.entries()].sort((a,b)=>b[1]-a[1]||a[0].localeCompare(b[0])).slice(0,6);
  const titleMap={culture:'Cultures',religion:'Religions',dejure:'De Jure Kingdoms',duchies:'De Jure Duchies',dynasty:'Ruling Dynasties',government:'Government Types'};
  return {
   title:titleMap[this.mode]||'Atlas Layers',
   items:top.map(([label])=>{
    let color=categoryColor(label);
    if(this.mode==='religion')color=categoryColor(label,FAITH_COLORS);
    else if(this.mode==='dejure')color=this.ownerColors[this.world.factions.find(f=>f.name===label)?.id]||categoryColor(label);
    else if(this.mode==='dynasty')color=categoryColor('house:'+label);
    else if(this.mode==='government'){const gk=Object.entries(GOVERNMENT_LABELS).find(([,v])=>v===label)?.[0];color=GOVERNMENT_COLORS[gk]||categoryColor(gk||label);}
    else if(this.mode==='duchies'){const dp=this.world.provinces.find(p=>this._duchyInfo(p).name===label);color=dp?categoryColor('duchy:'+this._duchyInfo(dp).id):categoryColor(label);}
    return {label,color};
   })
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
 select(id){
  this.selected=id;
  if(this.mode==='diplomacy'||this.mode==='opinion')this.lastGpuStateSig='';
  this.render();
 }
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
  if(this.mode==='duchies')return id=>{const p=this.provinceIndex.get(id);return p?this._duchyInfo(p).id:id;};
  if(this.mode==='dynasty')return id=>{const owner=this.game?.provinces?.[id]?.owner??this.provinceIndex.get(id)?.owner;return owner==='independent'?('ind:'+id):('dyn:'+this._dynastyHouse(owner,id));};
  if(this.mode==='government')return id=>{const owner=this.game?.provinces?.[id]?.owner??this.provinceIndex.get(id)?.owner;return owner==='independent'?'kinship':(this.game?.civic?.realms?.[owner]?.government||'feudal');};
  if(this.mode==='culture')return id=>this.game?.civic?.provinces?.[id]?.culture||this.provinceIndex.get(id)?.culture||id;
  if(this.mode==='religion')return id=>this.game?.civic?.provinces?.[id]?.faith||this.provinceIndex.get(id)?.faith||id;
  if(this.mode==='vassals')return id=>this._titleHolder(id)||this.game?.provinces?.[id]?.owner||id;
  return id=>this.game?.provinces?.[id]?.owner??this.provinceIndex.get(id)?.owner;
 }

 _syncGpuState(){
  if(!this.terrain?.ready)return;
  const focusKey=(this.mode==='diplomacy'||this.mode==='opinion')?('|'+this._diplomacyFocusOwner()):'';
  const sig=this.mode+'|'+(this.game?.turn??-1)+focusKey+'|'+seatSignature(this.world,this.game)+'|'+Object.keys(this.game?.campaignWar?.occupations||{}).length;
  if(this.lastGpuStateSig===sig)return;
  this.lastGpuStateSig=sig;
  const edgeKeyFn=this._edgeKeyFn();
  this.terrain.updateProvinceStates(
   this.visualWorld.provinces,
   p=>this._rawBaseColor(p),
   edgeKeyFn,
   id=>{const o=occupation(this.game||{},id);return o?(this.game.factions[o.by]?.color||'#c9544c'):null;}
  );
 }

 _drawProvinceColors2DFallback(c,s,provinces,project,viewport){
  const edgeKeyFn=this._edgeKeyFn();
  const grouped=new Map();

  c.save();c.lineJoin='round';
  for(const p of provinces){
   const owner=this.game?.provinces?.[p.id]?.owner??p.owner;
   c.beginPath();drawGeoPath(c,p.geometry,project);
   c.fillStyle=this.provinceColor(p);
   c.globalAlpha=this.mode==='political'?(owner===this.game?.player?0.94:0.86):0.88;
   c.fill('evenodd');

   const occ=occupation(this.game||{},p.id);
   if(occ){
    const occColor=this.game.factions[occ.by]?.color||'#c9544c';
    const pat=this._occupationPattern(occColor);
    if(pat){c.globalAlpha=0.82;c.fillStyle=pat;c.fill('evenodd');}
    c.globalAlpha=1;
    c.strokeStyle=occColor;c.lineWidth=clamp(3/s,.13,1.2);c.setLineDash([4/s,2/s]);c.stroke();c.setLineDash([]);
   }
   const gKey=edgeKeyFn(p.id);
   if(!grouped.has(gKey))grouped.set(gKey,{provinces:[],ids:new Set(),color:this._rawBaseColor(p)});
   const entry=grouped.get(gKey);
   entry.provinces.push(p);entry.ids.add(p.id);
  }

  // Inner-border glow in 2D Cartographic Mode
  const tier=this._activeTier();
  if(tier.id!=='low'&&this.zoom>=1.1&&['political','vassals','diplomacy','dynasty','duchies','dejure','government'].includes(this.mode)){
   const glowWidth=clamp((5.2+this.zoom*1.15)/s,0.12,1.6);
   for(const [gKey,entry] of grouped){
    if(gKey==='independent'||!entry.provinces.length)continue;
    c.save();c.beginPath();for(const p of entry.provinces)drawGeoPath(c,p.geometry,project);c.clip('evenodd');
    c.beginPath();
    for(const e of this.edges){
     if(viewport&&(Math.max(e.a[0],e.b[0])<viewport[0]||Math.min(e.a[0],e.b[0])>viewport[2]||Math.max(e.a[1],e.b[1])<viewport[1]||Math.min(e.a[1],e.b[1])>viewport[3]))continue;
     if(!e.ids.some(id=>entry.ids.has(id))||politicalEdgeKind(e,edgeKeyFn)==='district')continue;
     c.moveTo(...e.a);c.lineTo(...e.b);
    }
    c.lineWidth=glowWidth;c.strokeStyle=entry.color.startsWith('rgb')?entry.color:atlasColor(entry.color,0);c.globalAlpha=0.38;c.stroke();c.restore();
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

 _markArmy(c,a,offset=0,project,gpu=false){
  const province=this.provinceIndex.get(a.province);if(!province)return;
  const [x,y]=project(...province.centroid);if(x<20||y<32||x>this.w-25||y>this.h-30)return;
  const mine=a.owner===this.game?.player;
  const enemyWar=this.game?.factions?.[this.game?.player]?.atWarWith?.includes(a.owner);
  const tier=this._activeTier();
  const has3dPawn=gpu&&tier.id!=='low'&&this.zoom>1.35;

  this.armyMarkers??=[];
  const baseY=has3dPawn?(y-22):(y-16);
  const marker={province:a.province,owner:a.owner,troops:a.troops,x:x+offset,y:baseY,halfWidth:13,bottom:14};
  this.armyMarkers.push(marker);

  c.save();c.translate(x+offset,baseY);
  if(!has3dPawn){
   c.fillStyle='rgba(16,18,14,.42)';c.beginPath();c.ellipse(0,13,9,3.4,0,0,Math.PI*2);c.fill();
   c.fillStyle='#d9c17a';c.fillRect(-1,-3,2,16);
   c.fillStyle=mine?'#cfa247':enemyWar?'#9c3f37':'#5d564e';
   c.strokeStyle=mine?'#f6e19b':enemyWar?'#f4a498':'#2d2a24';c.lineWidth=1.5;
   c.beginPath();c.moveTo(-7,-13);c.lineTo(7,-13);c.lineTo(7,4);c.lineTo(0,11);c.lineTo(-7,4);c.closePath();
   c.fill();c.stroke();
   c.fillStyle='#ede4c7';c.font='bold 10px Georgia';c.textAlign='center';c.textBaseline='middle';
   const art=realmArt(a.owner);this.realmArtCache??=new Map();let icon=art&&this.realmArtCache.get(art);
   if(art&&!icon){icon=new Image();icon.onload=()=>this.render();icon.src=art;this.realmArtCache.set(art,icon);}
   if(icon?.complete&&icon.naturalWidth)c.drawImage(icon,-9,-12,18,18);else c.fillText('⚔',0,-3);
  }

  if(this.zoom>=1.75||mine||enemyWar||has3dPawn){
   const text=a.troops>=1000?(a.troops/1000).toFixed(1).replace(/\.0$/,'')+'k':String(a.troops);
   c.font='bold 10px system-ui';const w=c.measureText(text).width+12;
   const py=has3dPawn?0:13;
   marker.halfWidth=Math.max(12,w/2);marker.bottom=py+17;
   c.fillStyle=mine?'rgba(56,43,19,.94)':enemyWar?'rgba(78,26,22,.94)':'rgba(36,34,30,.90)';
   c.strokeStyle=mine?'#e2b85b':enemyWar?'#e06e62':'#857c70';c.lineWidth=1.1;
   c.fillRect(-w/2,py,w,15);c.strokeRect(-w/2,py,w,15);
   c.fillStyle='#fff2cf';c.textAlign='center';c.textBaseline='middle';
   c.fillText(text,0,py+7.5);
  }
  c.restore();
 }

 _realmSeats(){
  const key=seatSignature(this.world,this.game);
  if(this.seatCache?.key===key)return this.seatCache.value;
  const srcWorld=this.visualWorld||this.world;
  const factions=this.game?Object.values(this.game.factions).filter(f=>f.id!=='independent'&&f.capital):srcWorld.factions;
  const states=this.game?.provinces,world={...srcWorld,factions},by=new Map(world.provinces.map(p=>[p.id,p]));
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
  }else if(['political','diplomacy','government','trade'].includes(this.mode)){
   const focusRealm=this.mode==='diplomacy'?this._diplomacyFocusOwner():null;
   for(const {f,point,points} of seats){
    if(this.zoom<1.55&&f.id!==focusRealm&&!['france','england','ottomans','ming','delhi','timurids','mali','inca','ashikaga','mexica','vijayanagara','ethiopia','mamluks'].includes(f.id))continue;
    const label=f.name.toUpperCase();
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
  }else if(['dynasty','duchies','dejure','culture','religion','vassals'].includes(this.mode)){
   const edgeKey=this._edgeKeyFn();
   const groups=new Map();
   for(const p of this.visualWorld.provinces){
    const owner=this.game?.provinces?.[p.id]?.owner??p.owner;
    if(owner==='independent'&&(this.mode==='dynasty'||this.mode==='vassals'))continue;
    const key=edgeKey(p.id);
    if(!groups.has(key)){
     let lbl=this.provinceCategory(p);
     if(this.mode==='vassals')lbl=lbl.replace(/\s*\([^)]*\)$/,'').replace(/^Crown Demesne · /,'');
     groups.set(key,{label:lbl.toUpperCase(),points:[]});
    }
    groups.get(key).points.push(p.centroid);
   }
   const minCount=this.mode==='duchies'||this.mode==='vassals'?(this.zoom>=2.4?1:2):2;
   const ranked=[...groups.values()].filter(g=>g.points.length>=minCount).sort((a,b)=>b.points.length-a.points.length).slice(0,48);
   for(const {label,points} of ranked){
    if(points.length>=2&&this.zoom<5.8){
     const box=drawCurvedRealmLabel(c,label,points,project,this.w,this.h,this.zoom,used);
     if(box){used.push(box);continue;}
    }
    const cx=points.reduce((s,pt)=>s+pt[0],0)/points.length,cy=points.reduce((s,pt)=>s+pt[1],0)/points.length;
    const [x,y]=project(cx,cy);if(x<24||y<36||x>this.w-24||y>this.h-42)continue;
    const font=clamp(8.5+this.zoom*.75,9.5,14.5);c.font='bold '+font+'px Georgia,serif';
    const ww=c.measureText(label).width;if(used.some(([px,py,pw,ph=20])=>Math.abs(x-px)<(ww+pw)*.52&&Math.abs(y-py)<(font+ph)*0.55))continue;
    c.lineWidth=3.2;c.strokeStyle='rgba(232,218,182,.88)';c.strokeText(label,x,y);c.fillStyle='#242c27';c.fillText(label,x,y);used.push([x,y,ww,font+6]);
   }
  }
  if(this.mode!=='historical'&&this.zoom>=4.0&&this.world.meta?.mapVersion==='atlas-1450-v4'){
   c.font='11px Georgia';
   for(const p of this.visualWorld.provinces){
    const [x,y]=project(...p.centroid);if(x<38||y<58||x>this.w-38||y>this.h-40)continue;
    const label=p.name,ww=c.measureText(label).width;
    if(used.some(([px,py,pw])=>Math.abs(x-px)<(ww+pw)*.53&&Math.abs(y-py)<25))continue;
    c.lineWidth=2.5;c.strokeStyle='rgba(235,219,185,.88)';c.strokeText(label,x,y);c.fillStyle='#313932';c.fillText(label,x,y);
    used.push([x,y,ww]);if(used.length>=90)break;
   }
  }
  c.restore();
 }

 _cityMarkers(c,seats,project,nowMs,gpu){
  const tier=this._activeTier();
  // On high/balanced zoomed-in Three.js mode, 3D Kenney keeps already stand directly on capitals!
  if(gpu&&tier.id!=='low'&&this.zoom>1.35)return;
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
   for(const p of this.visualWorld.provinces){
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
  if(this.mode==='terrain')detail=' · '+(this.hover.terrain||'plains').toUpperCase()+(this.hover.tradeCenter?' · ⚓ Trade':'');
  else if(this.mode!=='political'&&this.mode!=='historical')detail=' · '+this.provinceCategory(this.hover);
  else if(state){const pol=this.game?.independentPolities?.[this.hover.id],ci=this._baronControlInfo(this.hover);detail=' · Pop '+Math.round(state.population)+'k · Dev '+state.development+(ci.built?` · ${ci.delegated}/${ci.built} barons`:'')+(pol?` · Ruler ${pol.rulerName}`:'')+(this.hover.tradeCenter?' · ⚓':'');}
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

  const pad=50;
  const corners=[this.toGeo(-pad,-pad),this.toGeo(w+pad,-pad),this.toGeo(-pad,h+pad),this.toGeo(w+pad,h+pad)];
  const viewport=[
   Math.min(...corners.map(k=>k[0])),
   Math.min(...corners.map(k=>k[1])),
   Math.max(...corners.map(k=>k[0])),
   Math.max(...corners.map(k=>k[1]))
  ];
  const visible=this.geoIndex.query(viewport),visibleWorld={...this.visualWorld,provinces:visible};
  const seats=this._realmSeats();
  const groups=this.game?atlasArmyGroups(this.game.armies,this.game.naval?.voyages):[];

  // Sync GPU political state palette & 3D dynamic props before Three.js renders
  if(this.useRelief&&this.terrain?.ready){
   this._syncGpuState();
   this.terrain.syncDynamicUnits(seats,groups,this.game,this.provinceIndex);
  }

  const gpu=this.useRelief&&this.terrain?.render(w,h,this.dpr,this.zoom,this.panX,this.panY,this.compression,{
   pitchDeg:cam.pitchDeg,
   timeMs:nowMs,
   showPolitical:this.mode!=='historical'&&this.mode!=='terrain',
   hoverId:this.hover?.id,
   selectedId:this.selected
  });

  c.setTransform(this.dpr,0,0,this.dpr,0,0);
  c.clearRect(0,0,w,h);

  if(!gpu){
   // Crisp 2D Cartographic Fallback (Low-End / 3D OFF / Software-only headless)
   drawSea(c,w,h,this.paper);
   c.save();c.translate(w*.5+this.panX,h*.5+this.panY);c.scale(s,-s*this.compression);
   drawLand(c,visibleWorld,s,null);
   if(this.mode==='historical'){
    this._drawHistorical(c,s,viewport,null);
   }else{
    this._drawProvinceColors2DFallback(c,s,visible,null,viewport);
    if(this.mode!=='terrain'){
     drawDivisions(c,visible.map(p=>this.countyIndex.get(p.id)).filter(Boolean),s,this.zoom>=4.2&&this.w>=700,null);
     drawPoliticalEdges(c,this.edges,this._edgeKeyFn(),s,viewport,null);
    }
   }
   if(this.mode!=='historical')drawTopography(c,visibleWorld,s,null,tier.treeBudget??120);
   c.restore();
  }else if(this.mode==='historical'){
   this._drawHistorical(c,s,viewport,project);
  }

  // Razor-sharp anti-aliased vector outer realm ink frontiers & selected/hover rings (zero stair-stepping!)
  if(gpu&&this.mode!=='terrain'&&this.mode!=='historical'){
   drawPoliticalEdges(c,this.edges,this._edgeKeyFn(),s,viewport,project,{showDistricts:this.zoom>=4.2});
  }
  const selected=this.visualWorld.provinces.find(p=>p.id===this.selected);
  if(selected){c.beginPath();drawGeoPath(c,selected.geometry,project);c.lineWidth=2.6;c.strokeStyle='#ffe79e';c.stroke();}
  if(this.hover&&this.hover.id!==this.selected){c.beginPath();drawGeoPath(c,this.hover.geometry,project);c.lineWidth=1.8;c.strokeStyle='rgba(255,232,168,.82)';c.stroke();}

  // Interactive march range & curved arrows always drawn cleanly on top
  if(this.marchOrigin&&this.game){
   const originP=this.provinceIndex.get(this.marchOrigin);
   const originPx=originP?project(...originP.centroid):null;
   for(const id of originP?.neighbors||[]){
    const dest=this.provinceIndex.get(id);if(!dest)continue;
    const friendly=this.game.provinces[id]?.owner===this.game.player;
    c.beginPath();drawGeoPath(c,dest.geometry,project);
    c.fillStyle=friendly?'rgba(105,190,149,.26)':'rgba(222,126,83,.30)';c.fill('evenodd');
    c.strokeStyle=friendly?'#c2f0b8':'#ffd0a1';c.lineWidth=2.4;c.stroke();
    if(this.hover?.id===id&&originPx){
     drawMarchArc(c,originPx,project(...dest.centroid),friendly);
    }
   }
  }

  drawOceanLettering(c,project,w,h);
  this._cityMarkers(c,seats,project,nowMs,gpu);

  this.armyMarkers=[];
  if(this.game){
   const counts=new Map(),placedForeign=[];
   const compactMobile=this.w<680&&this.zoom<1.9;
   for(const a of groups){
    const mine=a.owner===this.game.player,enemyWar=this.game.factions?.[this.game.player]?.atWarWith?.includes(a.owner);
    if(compactMobile&&!mine&&!enemyWar){
     const prov=this.provinceIndex.get(a.province);
     if(prov){const [ax,ay]=project(...prov.centroid);if(placedForeign.some(([px,py])=>Math.hypot(ax-px,ay-py)<26))continue;placedForeign.push([ax,ay]);}
    }
    const n=counts.get(a.province)||0;counts.set(a.province,n+1);this._markArmy(c,a,n*17,project,gpu);
   }
  }

  if(this.mode!=='terrain')this._labels(c,s,seats,project);
  if(w>700&&h>350)drawRosette(c,55,h-75,20);
  if(w>=700)atlasBorders(c,w,h);
  this._hoverTip(c);

  if(gpu&&t0>0&&this.terrain?.governor){
   const downgraded=this.terrain.governor.recordFrame(performance.now()-t0);
   if(downgraded)this.dpr=Math.min(this.dpr,this._activeTier().maxDpr);
  }
  this._scheduleAmbient();
 }
}
