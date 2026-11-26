import {cardRole} from './simple-card-battle.js';

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
 if(role==='ranged')return {tag:'archers',sym:'BOW',color:'#4e8b5b'};
 if(role==='mounted')return {tag:'cavalry',sym:'CAV',color:'#b8893c'};
 if(k==='pikemen'||k==='spearmen'||g?.specialistId==='pikes')return {tag:'pikemen',sym:'PIK',color:'#4c7a96'};
 if(g?.specialistId==='guard'||k==='heavy_infantry')return {tag:'heavy_infantry',sym:'GRD',color:'#984a40'};
 return {tag:'infantry',sym:'INF',color:'#a84b3e'};
}

export function regimentCardIcon(g){
 const info=roleIcon(g);
 if(info.tag==='elephants')return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 14c0-4 3-7 7-7h4c3 0 5 2 5 5v4h-2v3h-3v-3H9v3H6v-3H5zm13-2c1 1 2 2 2 4" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><rect x="8" y="4" width="6" height="4" rx="1" fill="currentColor" opacity=".8"/></svg>';
 if(info.tag==='gunpowder')return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 14h14l4-2v4l-4-2H3zm2-5l5 3" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><circle cx="19" cy="11" r="2" fill="currentColor"/></svg>';
 if(info.tag==='archers')return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 4c5 3 5 13 0 16M5 12h13m-3-3l3 3-3 3" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';
 if(info.tag==='cavalry')return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 19l4-10 4-3 4 2-2 4h3l-2 7M8 14h8" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
 if(info.tag==='pikemen')return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 20L19 4M15 4h4v4M7 18l-2 2" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><circle cx="11" cy="13" r="3.5" fill="none" stroke="currentColor" stroke-width="1.8"/></svg>';
 return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 5h12v6c0 5-6 9-6 9s-6-4-6-9z" fill="currentColor" opacity=".25" stroke="currentColor" stroke-width="2"/></svg>';
}

const TERRAIN_THEMES={
 plains:{top:'#3c5234',mid:'#4a643d',bot:'#2d3e27',grid:'rgba(241,226,184,.13)',cover:'#324929'},
 forest:{top:'#2b4029',mid:'#375133',bot:'#21301f',grid:'rgba(205,224,185,.12)',cover:'#233b20'},
 hills:{top:'#515739',mid:'#636846',bot:'#3d422d',grid:'rgba(240,225,180,.14)',cover:'#494d35'},
 highlands:{top:'#4f4c3d',mid:'#615c4a',bot:'#39372c',grid:'rgba(232,220,192,.14)',cover:'#4d4a3d'},
 desert:{top:'#7e6440',mid:'#96794d',bot:'#614c30',grid:'rgba(252,234,186,.16)',cover:'#725734'},
 steppe:{top:'#5f653b',mid:'#747847',bot:'#484c2c',grid:'rgba(241,232,175,.14)',cover:'#585b34'},
 coast:{top:'#345149',mid:'#436559',bot:'#253c36',grid:'rgba(215,238,225,.14)',cover:'#2e4c44'}
};

const SPRITE_STATE={manifest:null,loading:false,images:new Map(),loaded:0,total:0};

function ensureSprites(){
 if(SPRITE_STATE.loading||SPRITE_STATE.manifest)return;
 if(typeof fetch!=='function'||typeof Image!=='undefined'===false)return;
 SPRITE_STATE.loading=true;
 fetch('assets/battle/sprites/manifest.json').then(r=>r.ok?r.json():null).then(m=>{
  if(!m)return;
  SPRITE_STATE.manifest=m;
  const urls=[];
  for(const [k,v] of Object.entries(m.units||{}))urls.push([k,v.url]);
  for(const [k,u] of Object.entries(m.extras||{}))urls.push([k,u]);
  SPRITE_STATE.total=urls.length;
  for(const [k,url] of urls){
   const img=new Image();
   img.onload=()=>{SPRITE_STATE.loaded++;SPRITE_STATE.images.set(k,img);};
   img.src=url;
  }
 }).catch(()=>{});
}

function unitSheetKey(g){
 const role=cardRole(g),k=g?.kind||g?.specialistId||'';
 if(k==='elephants'||g?.specialistId==='elephants')return 'elephants';
 if(k==='gunpowder'||g?.specialistId==='handgun')return 'gunpowder';
 if(role==='ranged')return 'archers';
 if(role==='mounted')return 'cavalry';
 if(k==='pikemen'||k==='spearmen'||g?.specialistId==='pikes')return 'pikemen';
 if(g?.specialistId==='guard'||k==='heavy_infantry')return 'heavy_infantry';
 return 'infantry';
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
  const theme=TERRAIN_THEMES[this.terrainType]||TERRAIN_THEMES.plains;

  // 1. Atmospheric terrain wash & field relief
  const sky=c.createLinearGradient(0,0,0,h);
  sky.addColorStop(0,'#222c24');sky.addColorStop(.18,theme.top);sky.addColorStop(.62,theme.mid);sky.addColorStop(1,theme.bot);
  c.fillStyle=sky;c.fillRect(0,0,w,h);

  // Subtle ridge & river contours
  const ridge=c.createRadialGradient(v.cx,v.cy-20*v.sy,12,v.cx,v.cy,85*v.s);
  ridge.addColorStop(0,'rgba(250,235,180,.08)');ridge.addColorStop(1,'rgba(0,0,0,0)');
  c.fillStyle=ridge;c.fillRect(0,0,w,h);

  // Battlefield diamond perimeter
  const corners=[P(-64,-42),P(64,-42),P(64,42),P(-64,42)];
  c.save();
  c.beginPath();c.moveTo(...corners[0]);for(let i=1;i<4;i++)c.lineTo(...corners[i]);c.closePath();
  c.strokeStyle='rgba(235,214,154,.24)';c.lineWidth=1.5;c.stroke();
  c.restore();

  // Isometric grid
  c.strokeStyle=theme.grid;c.lineWidth=1;
  for(let x=-54;x<=54;x+=18){c.beginPath();c.moveTo(...P(x,-42));c.lineTo(...P(x,42));c.stroke();}
  for(let z=-36;z<=36;z+=12){c.beginPath();c.moveTo(...P(-62,z));c.lineTo(...P(62,z));c.stroke();}

  // Environmental trees & rocks along battlefield flanks
  const props=b.terrain||[];
  c.save();
  for(let i=0;i<props.length;i+=2){
   const tr=props[i];
   if(!tr)continue;
   const [px,py]=P(tr.x,tr.z);
   c.fillStyle=theme.cover;
   c.beginPath();c.ellipse(px,py,Math.max(4,v.s*1.8),Math.max(2,v.sy*1.1),0,0,Math.PI*2);c.fill();
   if(tr.type==='tree'){
    c.fillStyle='#2a4324';
    c.beginPath();c.moveTo(px,py-v.s*3.4);c.lineTo(px-v.s*1.5,py);c.lineTo(px+v.s*1.5,py);c.closePath();c.fill();
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
  const soldierDraws=[];
  const manifestUnits=SPRITE_STATE.manifest?.units||{};
  const cmdImg=SPRITE_STATE.images.get('commander'),cmdMeta=manifestUnits.commander;

  for(const {g} of drawList){
   const n=g.routed?2:clamp(Math.ceil((g.troops||g.troopCount||30)/28),3,9);
   const offs=soldierOffsets(g,n);
   const sheetKey=unitSheetKey(g);
   const img=SPRITE_STATE.images.get(sheetKey);
   const meta=manifestUnits[sheetKey];
   for(let i=0;i<offs.length;i++){
    const wx=g.x+offs[i][0],wz=g.z+offs[i][1];
    const [px,py]=P(wx,wz);
    const frame=unitPoseFrame(g,t,i);
    soldierDraws.push({g,px,py,frame,img,meta,sheetKey,isCmd:i===0&&!g.routed,idx:i});
   }
  }
  soldierDraws.sort((a,b)=>a.py-b.py||a.px-b.px);

  const spriteScale=clamp(v.s/8.2,.48,1.38);
  for(const s of soldierDraws){
   const sideTint=s.g.side==='attacker'?'#d9a84c':'#c45749';
   const drawW=(s.meta?.frameW||64)*spriteScale*.68;
   const drawH=(s.meta?.frameH||64)*spriteScale*.68;
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

   if(s.isCmd&&cmdImg&&cmdMeta&&s.img){
    c.save();c.translate(s.px+9*spriteScale,s.py-4*spriteScale);
    const cw=cmdMeta.frameW*spriteScale*.62,ch=cmdMeta.frameH*spriteScale*.62;
    c.drawImage(cmdImg,(s.g.moving?1:0)*cmdMeta.frameW,0,cmdMeta.frameW,cmdMeta.frameH,-cw/2,-ch,cw,ch);
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
  const fxSpark=SPRITE_STATE.images.get('fx_spark'),fxSmoke=SPRITE_STATE.images.get('fx_smoke');
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
   const sprite=ef.kind==='rout'?fxSmoke:fxSpark;
   if(sprite){
    const sz=(18+u*16)*spriteScale;
    c.drawImage(sprite,ex-sz/2,ey-sz/2,sz,sz);
   }else{
    c.beginPath();c.arc(ex,ey,(4+u*10)*spriteScale,0,Math.PI*2);
    c.strokeStyle=ef.kind==='rout'?'rgba(210,196,158,.7)':'rgba(255,208,108,.85)';c.lineWidth=2;c.stroke();
   }
   c.restore();
  }
 }
}
