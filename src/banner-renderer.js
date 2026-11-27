import {cardRole} from './simple-card-battle.js';
import {spriteCultureGroup} from './game-art.js';
import {terrainForestCovers} from './field-tactics.js';

const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));

export function bannerViewport(w,h,top,bottom,home=1,zoom=1,panX=0,panY=0){
 const aw=Math.max(260,w-24),ah=Math.max(200,h-top-bottom-16);
 const s=Math.min(aw/126,ah/56)*clamp(zoom,.65,1.9);
 return {w,h,top,bottom,home,zoom:clamp(zoom,.65,1.9),s,sy:s*.58,cx:w/2+panX,cy:top+ah/2+panY};
}
export const bannerProject=(v,x,z,y=0)=>[v.cx+x*v.s,v.cy+z*v.home*v.sy-y*v.s];
export const bannerUnproject=(v,x,y)=>[(x-v.cx)/v.s,0,(y-v.cy)/v.sy*v.home];

function roleIcon(g){
 const role=cardRole(g),k=g?.kind||g?.specialistId||'';
 if(k==='elephants'||g?.specialistId==='elephants')return {tag:'elephants',sym:'ELE',color:'#b87c38'};
 if(k==='gunpowder'||g?.specialistId==='handgun')return {tag:'gunpowder',sym:'GUN',color:'#8d5c48'};
 if(g?.specialistId==='horsebow')return {tag:'horsebow',sym:'HSB',color:'#b8893c'};
 if(role==='ranged')return {tag:'archers',sym:'BOW',color:'#4e8b5b'};
 if(role==='mounted')return {tag:'cavalry',sym:'CAV',color:'#b8893c'};
 if(k==='pikemen'||k==='spearmen'||g?.specialistId==='pikes')return {tag:'pikemen',sym:'PIK',color:'#4c7a96'};
 if(g?.specialistId==='guard'||k==='heavy_infantry')return {tag:'heavy_infantry',sym:'GRD',color:'#984a40'};
 return {tag:'infantry',sym:'INF',color:'#a84b3e'};
}

export function unitCultureKey(g){
 return spriteCultureGroup(g?.realmId||g?.realm||g?.profile?.realm)||null;
}

export function regimentCardIcon(g){
 const info=roleIcon(g);
 const cult=unitCultureKey(g);
 const url=cult?'assets/battle/sprites/cultures/'+cult+'-'+(info.tag==='horsebow'&&cult!=='steppe'?'archers':info.tag==='elephants'&&!['southindia','northindia','southeast'].includes(cult)?'cavalry':info.tag)+'.webp':'assets/battle/sprites/'+(info.tag==='horsebow'?'cavalry':info.tag)+'.webp';
 const spriteOverlay='<span class="regiment-sprite-thumb" style="background-image:url(\''+url+'\')" aria-hidden="true"></span>';
 if(info.tag==='elephants')return spriteOverlay+'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 14c0-4 3-7 7-7h4c3 0 5 2 5 5v4h-2v3h-3v-3H9v3H6v-3H5zm13-2c1 1 2 2 2 4" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><rect x="8" y="4" width="6" height="4" rx="1" fill="currentColor" opacity=".8"/></svg>';
 if(info.tag==='gunpowder')return spriteOverlay+'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 14h14l4-2v4l-4-2H3zm2-5l5 3" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><circle cx="19" cy="11" r="2" fill="currentColor"/></svg>';
 if(info.tag==='archers')return spriteOverlay+'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 4c5 3 5 13 0 16M5 12h13m-3-3l3 3-3 3" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';
 if(info.tag==='cavalry'||info.tag==='horsebow')return spriteOverlay+'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 19l4-10 4-3 4 2-2 4h3l-2 7M8 14h8" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
 if(info.tag==='pikemen')return spriteOverlay+'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 20L19 4M15 4h4v4M7 18l-2 2" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><circle cx="11" cy="13" r="3.5" fill="none" stroke="currentColor" stroke-width="1.8"/></svg>';
 return spriteOverlay+'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 5h12v6c0 5-6 9-6 9s-6-4-6-9z" fill="currentColor" opacity=".25" stroke="currentColor" stroke-width="2"/></svg>';
}

const TERRAIN_THEMES={
 plains:{sky:'#243227',top:'#3c5234',mid:'#4a643d',bot:'#2d3e27',grid:'rgba(241,226,184,.12)',cover:'#324929',ridge:'rgba(86,112,68,.38)',track:'rgba(128,108,74,.34)',accent:'#6c8754'},
 forest:{sky:'#1a2a1e',top:'#283d27',mid:'#344e31',bot:'#1e2d1d',grid:'rgba(205,224,185,.10)',cover:'#1f371d',ridge:'rgba(46,74,43,.45)',track:'rgba(104,88,60,.36)',accent:'#3f6a39'},
 hills:{sky:'#2e3326',top:'#52583a',mid:'#646a47',bot:'#3b402a',grid:'rgba(240,225,180,.13)',cover:'#494d35',ridge:'rgba(122,126,86,.44)',track:'rgba(132,114,82,.36)',accent:'#7e825a'},
 highlands:{sky:'#2b2c2a',top:'#4c4a3d',mid:'#5f5c4a',bot:'#353329',grid:'rgba(232,220,192,.13)',cover:'#4a473a',ridge:'rgba(118,112,92,.46)',track:'rgba(122,110,88,.34)',accent:'#7f7a66'},
 mountain:{sky:'#272b30',top:'#484c50',mid:'#5b5e5d',bot:'#323537',grid:'rgba(226,226,232,.12)',cover:'#474b4d',ridge:'rgba(136,140,144,.48)',track:'rgba(116,112,102,.32)',accent:'#8d9296'},
 mountains:{sky:'#272b30',top:'#484c50',mid:'#5b5e5d',bot:'#323537',grid:'rgba(226,226,232,.12)',cover:'#474b4d',ridge:'rgba(136,140,144,.48)',track:'rgba(116,112,102,.32)',accent:'#8d9296'},
 desert:{sky:'#3d2f22',top:'#806540',mid:'#997b4f',bot:'#614c30',grid:'rgba(252,234,186,.14)',cover:'#725734',ridge:'rgba(196,154,92,.42)',track:'rgba(164,132,84,.38)',accent:'#b88c52'},
 steppe:{sky:'#343825',top:'#5f653b',mid:'#747847',bot:'#484c2c',grid:'rgba(241,232,175,.13)',cover:'#585b34',ridge:'rgba(146,144,82,.38)',track:'rgba(140,124,78,.36)',accent:'#939453'},
 coast:{sky:'#1f3134',top:'#325049',mid:'#416357',bot:'#233934',grid:'rgba(215,238,225,.13)',cover:'#2c4a42',ridge:'rgba(76,114,102,.38)',track:'rgba(144,132,102,.34)',accent:'#4f7e72'},
 coastal:{sky:'#1f3134',top:'#325049',mid:'#416357',bot:'#233934',grid:'rgba(215,238,225,.13)',cover:'#2c4a42',ridge:'rgba(76,114,102,.38)',track:'rgba(144,132,102,.34)',accent:'#4f7e72'},
 marsh:{sky:'#1d2b26',top:'#2d4239',mid:'#385247',bot:'#203029',grid:'rgba(195,222,205,.11)',cover:'#263c33',ridge:'rgba(62,92,78,.38)',track:'rgba(92,88,68,.35)',accent:'#456b5c'}
};

const SPRITE_STATE={manifest:null,loading:false,images:new Map(),queued:new Set(),loaded:0,total:0};

function loadSpriteUrl(key,url,countTowardReady=true){
 if(SPRITE_STATE.queued.has(key)||!url)return;
 SPRITE_STATE.queued.add(key);
 if(countTowardReady)SPRITE_STATE.total++;
 const img=new Image();
 img.onload=()=>{if(countTowardReady)SPRITE_STATE.loaded++;SPRITE_STATE.images.set(key,img);};
 img.onerror=()=>{if(countTowardReady)SPRITE_STATE.loaded++;};
 img.src=url;
}

function ensureSprites(groups=null){
 if(typeof fetch!=='function'||typeof Image==='undefined')return;
 if(!SPRITE_STATE.loading&&!SPRITE_STATE.manifest){
  SPRITE_STATE.loading=true;
  fetch('assets/battle/sprites/manifest.json').then(r=>r.ok?r.json():null).then(m=>{
   if(!m)return;
   SPRITE_STATE.manifest=m;
   for(const [k,v] of Object.entries(m.units||{}))loadSpriteUrl(k,v.url,true);
   for(const [k,u] of Object.entries(m.extras||{}))loadSpriteUrl(k,u,true);
   for(const [cult,mp] of Object.entries(m.cultures||{})){
    for(const [uk,v] of Object.entries(mp||{}))loadSpriteUrl(cult+':'+uk,v.url,false);
   }
  }).catch(()=>{});
 }
 if(SPRITE_STATE.manifest?.cultures&&Array.isArray(groups)){
  for(const g of groups){
   const cult=unitCultureKey(g);
   if(!cult)continue;
   const mp=SPRITE_STATE.manifest.cultures[cult];
   if(!mp)continue;
   for(const [uk,v] of Object.entries(mp))loadSpriteUrl(cult+':'+uk,v.url,false);
  }
 }
}

function unitSheetKey(g){
 const role=cardRole(g),k=g?.kind||g?.specialistId||'';
 if(k==='elephants'||g?.specialistId==='elephants')return 'elephants';
 if(k==='gunpowder'||g?.specialistId==='handgun')return 'gunpowder';
 if(g?.specialistId==='horsebow')return 'horsebow';
 if(role==='ranged')return (g?.specialistId==='crossbow'||k==='crossbow')?'crossbow':'archers';
 if(role==='mounted')return 'cavalry';
 if(k==='pikemen'||k==='spearmen'||g?.specialistId==='pikes')return 'pikemen';
 if(g?.specialistId==='guard'||k==='heavy_infantry')return 'heavy_infantry';
 return 'infantry';
}

function resolveUnitSprite(g,manifest){
 const baseKey=unitSheetKey(g);
 const cult=unitCultureKey(g);
 const cultMap=cult&&manifest?.cultures?.[cult];
 if(cultMap){
  const altKey=baseKey==='crossbow'&&!cultMap.crossbow?'archers':baseKey==='horsebow'&&!cultMap.horsebow?'cavalry':baseKey;
  if(cultMap[altKey]){
   const img=SPRITE_STATE.images.get(cult+':'+altKey);
   if(img)return {img,meta:cultMap[altKey],key:cult+':'+altKey};
  }
 }
 if((g?.specialistId==='spearmen'||g?.kind==='spearmen')&&SPRITE_STATE.images.get('bronze_spear')){
  return {img:SPRITE_STATE.images.get('bronze_spear'),meta:{frames:4,frameW:96,frameH:96},key:'bronze_spear'};
 }
 if((g?.specialistId==='guard'||g?.kind==='heavy_infantry')&&SPRITE_STATE.images.get('knight_elite')){
  return {img:SPRITE_STATE.images.get('knight_elite'),meta:{frames:4,frameW:96,frameH:96},key:'knight_elite'};
 }
 const fallbackKey=baseKey==='horsebow'?'cavalry':baseKey==='crossbow'?'archers':baseKey;
 const meta=manifest?.units?.[fallbackKey]||manifest?.units?.infantry;
 const img=SPRITE_STATE.images.get(fallbackKey)||SPRITE_STATE.images.get('infantry');
 return {img,meta,key:fallbackKey};
}

function resolveCommanderSprite(g,manifest){
 const cult=unitCultureKey(g);
 const cultCmd=cult&&manifest?.cultures?.[cult]?.commander;
 if(cultCmd){
  const img=SPRITE_STATE.images.get(cult+':commander');
  if(img)return {img,meta:cultCmd};
 }
 return {img:SPRITE_STATE.images.get('commander'),meta:manifest?.units?.commander};
}

function unitPoseFrame(g,elapsed,idx){
 if(g.routed||(g.hitFlash||0)>0)return 3;
 if((g.attackPulse||0)>0)return 2;
 if(g.moving)return ((Math.floor(elapsed*7+idx))%2===0)?1:0;
 return 0;
}

function soldierOffsets(g,count){
 const form=g?.formationId||'shield_wall';
 const out=[];
 if(form==='cavalry_wedge'){
  for(let i=0;i<count;i++){
   const row=Math.floor((-1+Math.sqrt(1+8*i))/2);
   const start=row*(row+1)/2;
   const pos=i-start;
   out.push([(pos-row/2)*3.1,row*2.9-2.2]);
  }
  return out;
 }
 const cols=form==='volley_line'?Math.min(count,5):form==='pike_square'?Math.min(count,4):Math.min(count,4);
 const rows=Math.max(1,Math.ceil(count/cols));
 const sx=form==='volley_line'?3.1:2.6;
 const sz=form==='pike_square'?2.2:2.4;
 for(let i=0;i<count;i++){
  const col=i%cols,row=Math.floor(i/cols);
  out.push([(col-(cols-1)/2)*sx,(row-(rows-1)/2)*sz]);
 }
 return out;
}

export class BannerRenderer{
 constructor(canvas,terrainType='plains'){
  this.canvas=canvas;
  this.terrainType=terrainType||'plains';
  this.isBannerRenderer=true;
  this.zoom=1;
  this.panX=0;
  this.panY=0;
  ensureSprites();
 }

 get spritesReady(){return SPRITE_STATE.total>0&&SPRITE_STATE.loaded>=SPRITE_STATE.total;}
 get loadedSpriteCount(){return SPRITE_STATE.loaded;}

 setZoom(z){this.zoom=clamp(Number(z)||1,.65,1.9);return this.zoom;}
 panBy(dx,dy){this.panX=clamp(this.panX+dx,-280,280);this.panY=clamp(this.panY+dy,-190,190);}
 resetView(){this.zoom=1;this.panX=0;this.panY=0;}

 viewport(b){
  const w=this.canvas.clientWidth||this.canvas.width||960,h=this.canvas.clientHeight||this.canvas.height||620;
  const doc=this.canvas?.ownerDocument||globalThis.document;
  const r=this.canvas?.getBoundingClientRect?.();
  const topEl=doc?.querySelector?.('.battle-top')?.getBoundingClientRect?.();
  const botEl=doc?.querySelector?.('.battle-bottom')?.getBoundingClientRect?.();
  const t=r&&topEl?Math.min(h*.32,Math.max(0,topEl.bottom-r.top)):(b?.descriptor?.topPad??92);
  const d=r&&botEl?Math.min(h*.42,Math.max(0,r.bottom-botEl.top)):(b?.descriptor?.bottomPad??150);
  return bannerViewport(w,h,t+8,d+5,b?.descriptor?.defenseMode?-1:1,this.zoom,this.panX,this.panY);
 }
 project(b,x,z,y=0){return bannerProject(this.viewport(b),x,z,y);}
 ground(b,x,y){return bannerUnproject(this.viewport(b),x,y);}

 resize(){
  const dpr=Math.min(globalThis.devicePixelRatio||1,2);
  const w=this.canvas.clientWidth||this.canvas.width||960,h=this.canvas.clientHeight||this.canvas.height||620;
  if(this.canvas.width!==Math.round(w*dpr)||this.canvas.height!==Math.round(h*dpr)){
   this.canvas.width=Math.round(w*dpr);
   this.canvas.height=Math.round(h*dpr);
  }
  const c=this.canvas.getContext('2d');
  c?.setTransform?.(dpr,0,0,dpr,0,0);
  return {w,h,c};
 }

 renderBattle(b){
  const {w,h,c}=this.resize();if(!c)return;
  const v=this.viewport(b),P=(x,z,y=0)=>bannerProject(v,x,z,y),home=v.home,selected=b.selectedGroup?.(),t=b.elapsed||0;
  const kind=String(this.terrainType||'plains').toLowerCase();
  const theme=TERRAIN_THEMES[kind]||TERRAIN_THEMES.plains;

  // 1. Atmospheric terrain wash, layered elevation ridges & biome landscape
  const sky=c.createLinearGradient(0,0,0,h);
  sky.addColorStop(0,theme.sky||'#222c24');sky.addColorStop(.18,theme.top);sky.addColorStop(.62,theme.mid);sky.addColorStop(1,theme.bot);
  c.fillStyle=sky;c.fillRect(0,0,w,h);

  // Layered elevation ridges along horizon & flanks
  c.save();
  for(let layer=0;layer<3;layer++){
   const yBase=v.top+layer*14-6;
   c.beginPath();
   c.moveTo(0,yBase+28);
   for(let x=0;x<=w;x+=Math.max(48,Math.round(w/8))){
    const ridgeAmp=(kind==='hills'||kind==='highlands'||kind==='mountain'||kind==='mountains')?16:kind==='desert'?11:7;
    const ry=yBase+Math.sin(x*0.012+layer*1.9)*ridgeAmp-layer*4;
    c.lineTo(x,ry);
   }
   c.lineTo(w,yBase+40);c.lineTo(0,yBase+40);c.closePath();
   c.fillStyle=theme.ridge;c.fill();
  }
  c.restore();

  const ridge=c.createRadialGradient(v.cx,v.cy-20*v.sy,12,v.cx,v.cy,85*v.s);
  ridge.addColorStop(0,'rgba(250,235,180,.09)');ridge.addColorStop(1,'rgba(0,0,0,0)');
  c.fillStyle=ridge;c.fillRect(0,0,w,h);

  // Coast / coastal shoreline & animated surf waves
  if(kind==='coast'||kind==='coastal'){
   c.save();
   const [sx0,sy0]=P(32,-44),[sx1,sy1]=P(68,-44),[sx2,sy2]=P(68,44),[sx3,sy3]=P(36,44);
   c.beginPath();c.moveTo(sx0,sy0);c.lineTo(sx1,sy1);c.lineTo(sx2,sy2);c.lineTo(sx3,sy3);c.closePath();
   c.fillStyle='rgba(44,98,118,.52)';c.fill();
   c.strokeStyle='rgba(222,238,220,.42)';c.lineWidth=clamp(v.s*.7,2,6);
   c.beginPath();c.moveTo(sx0,sy0);c.quadraticCurveTo(P(38,0)[0],P(38,0)[1],sx3,sy3);c.stroke();
   for(let wv=-32;wv<=32;wv+=16){
    const phase=Math.sin(t*2.1+wv)*1.4;
    const [wx0,wy0]=P(43+phase,wv-5),[wx1,wy1]=P(48+phase,wv+5);
    c.strokeStyle='rgba(205,240,248,.34)';c.lineWidth=1.5;
    c.beginPath();c.moveTo(wx0,wy0);c.lineTo(wx1,wy1);c.stroke();
   }
   c.restore();
  }

  // Battlefield diamond perimeter
  const corners=[P(-64,-42),P(64,-42),P(64,42),P(-64,42)];
  c.save();
  c.beginPath();c.moveTo(...corners[0]);for(let i=1;i<4;i++)c.lineTo(...corners[i]);c.closePath();
  c.strokeStyle='rgba(235,214,154,.24)';c.lineWidth=1.5;c.stroke();
  c.restore();

  // Textured dirt / cobbled road track linking deployment baselines
  c.save();
  const [r0x,r0y]=P(0,40),[r1x,r1y]=P(-6,12),[r2x,r2y]=P(5,-10),[r3x,r3y]=P(0,-40);
  c.strokeStyle=b.siege?'rgba(138,132,118,.38)':theme.track;
  c.lineWidth=clamp(v.s*5.2,10,32);c.lineCap='round';
  c.beginPath();c.moveTo(r0x,r0y);c.quadraticCurveTo(r1x,r1y,r2x,r2y);c.lineTo(r3x,r3y);c.stroke();
  if(b.siege){
   c.strokeStyle='rgba(72,68,60,.36)';c.lineWidth=1.2;
   for(let z=-36;z<=36;z+=6){
    const [cx,cy]=P((z%12===0?1:-1)*1.2,z);
    c.beginPath();c.ellipse(cx,cy,clamp(v.s*1.2,3,8),clamp(v.sy*.8,2,5),0,0,Math.PI*2);c.stroke();
   }
  }
  c.restore();

  // Isometric grid
  c.strokeStyle=theme.grid;c.lineWidth=1;
  for(let x=-54;x<=54;x+=18){c.beginPath();c.moveTo(...P(x,-42));c.lineTo(...P(x,42));c.stroke();}
  for(let z=-36;z<=36;z+=12){c.beginPath();c.moveTo(...P(-62,z));c.lineTo(...P(62,z));c.stroke();}

  // Biome-specific crags, dunes, marsh pools & woodland canopy pockets
  c.save();
  if(kind==='desert'){
   for(const [cx,cz,cw,ch] of [[-40,-16,10,6],[42,14,11,7],[-34,22,8,5],[36,-24,9,5]]){
    const [px,py]=P(cx,cz);
    c.fillStyle='#966d3e';
    c.beginPath();c.moveTo(px-cw*v.s*.4,py);c.lineTo(px-cw*v.s*.18,py-ch*v.s*.65);c.lineTo(px+cw*v.s*.2,py-ch*v.s*.55);c.lineTo(px+cw*v.s*.42,py);c.closePath();c.fill();
    c.fillStyle='rgba(235,196,132,.35)';c.fillRect(px-cw*v.s*.16,py-ch*v.s*.62,cw*v.s*.32,2);
   }
  }else if(kind==='hills'||kind==='highlands'||kind==='mountain'||kind==='mountains'){
   for(const [rx,rz,rad] of [[-22,-10,5.5],[24,8,5.5],[0,-28,6.5]]){
    const [px,py]=P(rx,rz);
    c.strokeStyle='rgba(236,222,184,.18)';c.lineWidth=1.4;
    c.beginPath();c.ellipse(px,py,rad*v.s*1.3,rad*v.sy*.95,0,0,Math.PI*2);c.stroke();
    c.fillStyle='rgba(92,90,82,.55)';
    c.beginPath();c.moveTo(px-v.s*2,py);c.lineTo(px,py-v.s*2.4);c.lineTo(px+v.s*2.2,py);c.closePath();c.fill();
   }
  }else if(kind==='marsh'){
   for(const [mx,mz,rx,rz] of [[-26,12,8,4],[24,-10,9,4.5],[4,4,6,3]]){
    const [px,py]=P(mx,mz);
    c.fillStyle='rgba(36,74,68,.55)';
    c.beginPath();c.ellipse(px,py,rx*v.s*.8,rz*v.sy*.8,0,0,Math.PI*2);c.fill();
   }
  }
  const covers=terrainForestCovers(kind);
  for(const cov of covers){
   const [px,py]=P(cov.x,cov.z);
   c.fillStyle=kind==='forest'?'rgba(24,52,22,.46)':'rgba(32,54,28,.28)';
   c.beginPath();c.ellipse(px,py,cov.radius*v.s*.85,cov.radius*v.sy*.75,0,0,Math.PI*2);c.fill();
   if(kind==='forest'){
    for(const [ox,oz] of [[-3,-1],[2,-2],[0,2]]){
     const [tx,ty]=P(cov.x+ox,cov.z+oz);
     c.fillStyle='#244222';c.beginPath();c.ellipse(tx,ty-v.s*1.3,v.s*1.8,v.s*1.4,0,0,Math.PI*2);c.fill();
     c.fillStyle='#345d2f';c.beginPath();c.ellipse(tx-v.s*.4,ty-v.s*1.7,v.s*1.1,v.s*.9,0,0,Math.PI*2);c.fill();
    }
   }
  }
  c.restore();

  // Environmental trees & rocks along battlefield flanks
  const props=b.terrain||[];
  c.save();
  for(let i=0;i<props.length;i+=2){
   const tr=props[i];
   if(!tr)continue;
   const [px,py]=P(tr.x,tr.z);
   c.fillStyle=theme.cover;
   c.beginPath();c.ellipse(px,py,Math.max(4,v.s*1.8),Math.max(2,v.sy*1.1),0,0,Math.PI*2);c.fill();
   if(tr.type==='tree'&&kind!=='desert'){
    c.fillStyle=theme.accent||'#2a4324';
    c.beginPath();c.moveTo(px,py-v.s*3.2);c.lineTo(px-v.s*1.4,py);c.lineTo(px+v.s*1.4,py);c.closePath();c.fill();
   }
  }
  c.restore();

  // Deployment zones & drop points
  if(b.deployment){
   const allyA=P(-60,12*home),allyB=P(60,40*home);
   c.fillStyle='rgba(214,179,101,.09)';
   c.fillRect(Math.min(allyA[0],allyB[0]),Math.min(allyA[1],allyB[1]),Math.abs(allyB[0]-allyA[0]),Math.abs(allyB[1]-allyA[1]));
   const cells=[-36,0,36].flatMap(x=>[18,32].map(z=>[x,z*home]));
   for(const [cx,cz] of cells){
    const [sx,sy]=P(cx,cz);
    c.beginPath();c.ellipse(sx,sy,clamp(v.s*4.2,9,18),clamp(v.sy*3.2,5,11),0,0,Math.PI*2);
    c.fillStyle='rgba(241,217,138,.18)';c.fill();
    c.strokeStyle='rgba(241,217,138,.42)';c.stroke();
   }
  }

  // Ground shadow pass for every regiment (guaranteed ellipse call even in headless mock!)
  const live=(b.groups||[]).filter(g=>g.life>0||g.routed);
  const drawList=live.map(g=>{
   const [sx,sy]=P(g.x,g.z);
   return {g,sx,sy};
  }).sort((a,z)=>a.sy-z.sy);

  for(const {g,sx,sy} of drawList){
   const isSel=selected&&selected.id===g.id;
   const rx=clamp(v.s*4.8,14,34),ry=clamp(v.sy*3.2,7,18);
   c.beginPath();c.ellipse(sx,sy+2,rx,ry,0,0,Math.PI*2);
   c.fillStyle=isSel?'rgba(244,210,125,.28)':'rgba(10,16,12,.32)';c.fill();
   if(isSel){
    c.strokeStyle='#f7dc8d';c.lineWidth=2;c.stroke();
   }
  }

  // Movement order indicators
  for(const {g,sx,sy} of drawList){
   if(g.routed||g.targetX===undefined||g.targetZ===undefined)continue;
   if(Math.hypot((g.targetX-g.x),(g.targetZ-g.z))<2)continue;
   const [tx,ty]=P(g.targetX,g.targetZ);
   c.save();c.setLineDash([4,4]);c.strokeStyle=g.side==='attacker'?'rgba(245,214,128,.75)':'rgba(218,104,88,.6)';c.lineWidth=1.8;
   c.beginPath();c.moveTo(sx,sy);c.lineTo(tx,ty);c.stroke();
   c.beginPath();c.arc(tx,ty,3.5,0,Math.PI*2);c.fillStyle=c.strokeStyle;c.fill();c.restore();
  }

  // Soldier-level Y-sorted 2D isometric sprite rendering
  ensureSprites(drawList.map(d=>d.g));
  const soldierDraws=[];

  for(const {g} of drawList){
   const n=g.routed?2:clamp(Math.ceil((g.troops||g.troopCount||30)/28),3,9);
   const offs=soldierOffsets(g,n);
   const {img,meta,key:sheetKey}=resolveUnitSprite(g,SPRITE_STATE.manifest);
   const cmd=resolveCommanderSprite(g,SPRITE_STATE.manifest);
   for(let i=0;i<offs.length;i++){
    const wx=g.x+offs[i][0],wz=g.z+offs[i][1];
    const [px,py]=P(wx,wz);
    const frame=unitPoseFrame(g,t,i);
    soldierDraws.push({g,px,py,frame,img,meta,sheetKey,cmdImg:cmd.img,cmdMeta:cmd.meta,isCmd:i===0&&!g.routed,idx:i});
   }
  }
  soldierDraws.sort((a,b)=>a.py-b.py||a.px-b.px);

  const spriteScale=clamp(v.s/8.2,.48,1.38);

  // Fortress curtain walls, flanking towers, main gate & siege engines (when b.siege is active)
  if(b.siege){
   const wallImg=SPRITE_STATE.images.get('siege_wall');
   const towerImg=SPRITE_STATE.images.get('siege_tower');
   const gateImg=SPRITE_STATE.images.get('siege_gate');
   const breachedImg=SPRITE_STATE.images.get('siege_gate_breached');
   const ramImg=SPRITE_STATE.images.get('siege_ram');
   const catImg=SPRITE_STATE.images.get('siege_catapult');
   const bombImg=SPRITE_STATE.images.get('siege_bombard');
   const structs=b.siege.structures||[];
   const gate=structs[0]||{id:'gate',name:'Gate',x:0,z:-18,hp:100,max:100};
   const leftT=structs[1]||{id:'left',name:'West tower',x:-24,z:-18,hp:65,max:65};
   const rightT=structs[2]||{id:'right',name:'East tower',x:24,z:-18,hp:65,max:65};

   // Stone rampart curtain wall spanning across z = -18
   c.save();
   const [wlx,wly]=P(-56,-18),[wrx,wry]=P(56,-18);
   const wallH=clamp(v.s*3.0,14,34);
   c.fillStyle='#4a4842';
   c.fillRect(Math.min(wlx,wrx),wly-wallH,Math.abs(wrx-wlx),wallH);
   c.fillStyle='#676359';
   c.fillRect(Math.min(wlx,wrx),wly-wallH,Math.abs(wrx-wlx),wallH*.35);
   // Crenellated merlons
   const stepX=Math.max(10,Math.round(v.s*1.9));
   for(let mx=Math.min(wlx,wrx);mx<Math.max(wlx,wrx)-stepX*.5;mx+=stepX){
    if(Math.abs(mx-P(0,-18)[0])<v.s*5.5)continue;
    c.fillStyle='#787366';
    c.fillRect(mx,wly-wallH-5*spriteScale,stepX*.55,5*spriteScale);
   }
   if(wallImg){
    for(const wx of [-46,-36,-12,12,36,46]){
     const [px,py]=P(wx,-18);
     const sz=46*spriteScale;
     c.drawImage(wallImg,px-sz/2,py-sz+6*spriteScale,sz,sz);
    }
   }
   c.restore();

   // Render Gate & Flanking Towers with intact / cracked / breached visuals + HP bars
   for(const st of [leftT,rightT,gate]){
    const [sx,sy]=P(st.x,st.z);
    const frac=clamp((st.hp||0)/Math.max(1,st.max||100),0,1);
    const isGate=st.id==='gate';
    const breached=frac<=0;
    const cracked=!breached&&frac<=0.55;
    c.save();
    c.beginPath();c.ellipse(sx,sy+2,clamp(v.s*(isGate?6:4.5),14,42),clamp(v.sy*2.6,6,18),0,0,Math.PI*2);
    c.fillStyle='rgba(10,14,12,.45)';c.fill();
    const img=isGate?(breached?breachedImg:gateImg):breached?breachedImg:towerImg;
    if(img){
     const sz=(isGate?68:62)*spriteScale;
     c.drawImage(img,sx-sz/2,sy-sz+8*spriteScale,sz,sz);
    }else{
     const bw=clamp(v.s*(isGate?9:6.4),22,58),bh=breached?clamp(v.s*1.2,6,14):clamp(v.s*(isGate?4.6:5.2),18,48);
     c.fillStyle=breached?'#5c5246':isGate?'#6f685c':'#767166';
     c.fillRect(sx-bw/2,sy-bh,bw,bh);
     if(isGate&&!breached){
      c.fillStyle='#3c2a1a';c.fillRect(sx-bw*.26,sy-bh*.66,bw*.52,bh*.66);
      c.strokeStyle='#8c7e6a';c.lineWidth=1.5;c.strokeRect(sx-bw*.26,sy-bh*.66,bw*.52,bh*.66);
     }
    }
    if(cracked){
     c.strokeStyle='#241b16';c.lineWidth=2;
     c.beginPath();c.moveTo(sx-6*spriteScale,sy-26*spriteScale);c.lineTo(sx+2*spriteScale,sy-16*spriteScale);c.lineTo(sx-4*spriteScale,sy-6*spriteScale);c.stroke();
    }
    if(breached){
     c.fillStyle='rgba(92,82,68,.75)';
     for(const [rx,ry,rr] of [[-10,2,4],[6,4,5],[0,-1,3.5]]){
      c.beginPath();c.arc(sx+rx*spriteScale,sy+ry*spriteScale,rr*spriteScale,0,Math.PI*2);c.fill();
     }
    }
    // Structure HP bar
    const barW=clamp(v.s*6.4,34,58),by=sy-(isGate?56:54)*spriteScale;
    c.fillStyle='rgba(14,20,18,.86)';c.fillRect(sx-barW/2-1,by-1,barW+2,7);
    c.fillStyle=breached?'#7e6c5c':frac>0.5?'#d8b358':'#d96248';
    c.fillRect(sx-barW/2,by,barW*frac,5);
    c.font='700 '+clamp(Math.round(9*spriteScale),8,12)+'px system-ui,sans-serif';
    c.textAlign='center';c.fillStyle='#f6ead0';
    c.fillText((st.name||st.id).toUpperCase()+(breached?' (BREACHED)':' '+Math.round(frac*100)+'%'),sx,by-4);
    c.restore();
   }

   // Siege Engines along assault vanguard & artillery battery
   const assaultSide=b.siege.assaultSide||'attacker';
   const engMap=assaultSide==='attacker'?(b.siege.attackerEngines||{}):(b.siege.defenderEngines||{});
   const breachDone=gate.hp<=0;
   const ramZ=breachDone?-16:b.deployment?10:-6;
   const engineSlots=[];
   for(let i=0;i<Math.min(3,engMap.ram||0);i++)engineSlots.push({kind:'ram',img:ramImg,x:(i-(Math.min(3,engMap.ram||0)-1)/2)*11,z:ramZ});
   for(let i=0;i<Math.min(3,engMap.catapult||0);i++)engineSlots.push({kind:'catapult',img:catImg,x:-24+i*10,z:18});
   for(let i=0;i<Math.min(3,engMap.bombard||0);i++)engineSlots.push({kind:'bombard',img:bombImg,x:14+i*10,z:20});
   for(const es of engineSlots){
    const [ex,ey]=P(es.x,es.z);
    c.save();
    c.beginPath();c.ellipse(ex,ey+2,11*spriteScale,5*spriteScale,0,0,Math.PI*2);
    c.fillStyle='rgba(12,16,12,.4)';c.fill();
    if(es.img){
     const sz=42*spriteScale;
     c.drawImage(es.img,ex-sz/2,ey-sz+6*spriteScale,sz,sz);
    }else{
     c.fillStyle=es.kind==='bombard'?'#42464e':'#7c542e';
     c.fillRect(ex-10*spriteScale,ey-12*spriteScale,20*spriteScale,12*spriteScale);
    }
    c.restore();
   }
  }

  for(const s of soldierDraws){
   const sideTint=s.g.side==='attacker'?'#d9a84c':'#c45749';
   const drawW=(s.meta?.frameW||64)*spriteScale*.58;
   const drawH=(s.meta?.frameH||64)*spriteScale*.58;
   const flip=s.g.side==='defender'?-1:1;

   c.save();
   if(s.g.routed)c.globalAlpha=.45;
   else if((s.g.hitFlash||0)>0)c.filter='brightness(1.45)';
   c.translate(s.px,s.py);
   if(s.img&&s.meta){
    c.scale(flip,1);
    c.drawImage(s.img,s.frame*s.meta.frameW,0,s.meta.frameW,s.meta.frameH,-drawW/2,-drawH+5*spriteScale,drawW,drawH);
   }else{
    // Synchronous painted vector fallback so headless & initial frame look crisp immediately.
    c.fillStyle='rgba(12,16,14,.38)';c.beginPath();c.ellipse(0,0,7*spriteScale,3*spriteScale,0,0,Math.PI*2);c.fill();
    c.fillStyle=s.g.side==='attacker'?'#4e7fb8':'#b84f44';
    c.fillRect(-4*spriteScale,-14*spriteScale,8*spriteScale,12*spriteScale);
    c.fillStyle='#e4c798';c.beginPath();c.arc(0,-17*spriteScale,3.5*spriteScale,0,Math.PI*2);c.fill();
   }
   c.restore();

   if(s.isCmd&&s.cmdImg&&s.cmdMeta&&s.img){
    c.save();c.translate(s.px+9*spriteScale,s.py-4*spriteScale);
    const cw=s.cmdMeta.frameW*spriteScale*.54,ch=s.cmdMeta.frameH*spriteScale*.54;
    if(s.g.side==='defender')c.scale(-1,1);
    c.drawImage(s.cmdImg,(s.g.moving?1:0)*s.cmdMeta.frameW,0,s.cmdMeta.frameW,s.cmdMeta.frameH,-cw/2,-ch,cw,ch);
    c.restore();
   }
   if(s.isCmd){
    // Heraldic standard pole & colored team pennon
    c.fillStyle=sideTint;
    c.fillRect(s.px-1,s.py-28*spriteScale,2,26*spriteScale);
    c.beginPath();c.moveTo(s.px+1,s.py-28*spriteScale);c.lineTo(s.px+14*spriteScale,s.py-24*spriteScale);c.lineTo(s.px+1,s.py-20*spriteScale);c.closePath();c.fill();
   }
  }

  // Regiment banners, HP/Morale pips & labels
  c.font='600 '+clamp(Math.round(9.5*spriteScale),9,13)+'px system-ui,sans-serif';
  c.textAlign='center';
  for(const {g,sx,sy} of drawList){
   const barW=clamp(v.s*6.2,34,56),by=sy-44*spriteScale;
   const life=clamp((g.life||0)/100,0,1),morale=clamp((g.morale||0)/100,0,1);
   c.fillStyle='rgba(14,20,18,.82)';c.fillRect(sx-barW/2-1,by-1,barW+2,8);
   c.fillStyle=g.routed?'#6f685a':g.side==='attacker'?'#7ab874':'#d46958';c.fillRect(sx-barW/2,by,barW*life,4);
   c.fillStyle='#e5c15d';c.fillRect(sx-barW/2,by+4.5,barW*morale,2.5);
   const label=(g.profile?.name||g.type)+' · '+Math.max(0,Math.round(g.troops||0));
   c.fillStyle='rgba(16,22,19,.75)';
   const tw=clamp((c.measureText?.(label)?.width||label.length*5.4)+8,34,135);
   c.fillRect(sx-tw/2,sy+5,tw,14);
   c.fillStyle=g.routed?'#b3ab96':'#f6ead0';
   c.fillText(label,sx,sy+15);
  }

  // Projectiles & Battle FX sprites
  const fxImpact=SPRITE_STATE.images.get('fx_impact')||SPRITE_STATE.images.get('fx_spark');
  const fxDust=SPRITE_STATE.images.get('fx_dust')||SPRITE_STATE.images.get('fx_smoke');
  const fxSlash=SPRITE_STATE.images.get('fx_slash');
  for(const p of b.projectiles||[]){
   const u=clamp(p.t||0,0,1),x=p.sx+(p.tx-p.sx)*u,z=p.sz+(p.tz-p.sz)*u,arc=Math.sin(u*Math.PI)*9;
   const [px,py]=P(x,z,arc),[px0,py0]=P(p.sx,p.sz,0);
   c.strokeStyle=p.kind==='shot'?'#ffe49c':'#efe1b2';c.lineWidth=p.kind==='shot'?2:1.5;
   c.beginPath();c.moveTo(px-(px-px0)*.08,py-(py-py0)*.08+2);c.lineTo(px,py);c.stroke();
  }
  for(const ef of b.effects||[]){
   const u=clamp((ef.age||0)/(ef.duration||.4),0,1);
   const [ex,ey]=P(ef.x,ef.z);
   c.save();c.globalAlpha=1-u;
   if(ef.kind==='breach'){
    const rad=(12+u*32)*spriteScale;
    c.beginPath();c.arc(ex,ey,rad,0,Math.PI*2);
    c.strokeStyle='rgba(245,196,112,.92)';c.lineWidth=3;c.stroke();
    if(fxDust){const sz=(38+u*36)*spriteScale;c.drawImage(fxDust,ex-sz/2,ey-sz/2,sz,sz);}
    for(let k=0;k<6;k++){
     const ang=k*Math.PI/3+u*0.8,dist=(6+u*24)*spriteScale;
     c.fillStyle='#8c7c66';c.fillRect(ex+Math.cos(ang)*dist-2,ey+Math.sin(ang)*dist-2,4*spriteScale,4*spriteScale);
    }
   }else{
    const sprite=ef.kind==='rout'?fxDust:ef.kind==='slash'&&fxSlash?fxSlash:fxImpact;
    if(sprite){
     const sz=(20+u*18)*spriteScale;
     c.drawImage(sprite,ex-sz/2,ey-sz/2,sz,sz);
    }else{
     c.beginPath();c.arc(ex,ey,(4+u*10)*spriteScale,0,Math.PI*2);
     c.strokeStyle=ef.kind==='rout'?'rgba(210,196,158,.7)':'rgba(255,208,108,.85)';c.lineWidth=2;c.stroke();
    }
   }
   c.restore();
  }
 }
}
