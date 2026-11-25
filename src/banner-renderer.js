import {cardRole,deploymentCells} from './simple-card-battle.js';
const cap=(v,a,b)=>Math.max(a,Math.min(b,v));
const TAU=Math.PI*2;
const hash=s=>[...String(s)].reduce((n,c)=>(Math.imul(n,31)+c.charCodeAt(0))>>>0,1450);
export function bannerViewport(w,h,top,bottom,home=1){
 const usable=Math.max(40,h-top-bottom);
 const s=Math.min(Math.max(40,w-24)/138,usable/78);
 return {w,h,home,s,sy:Math.min(usable/102,s*(w<h*.85?1.34:.72)),cx:w/2,cy:top+usable/2};
}
export const bannerProject=(v,x,z,y=0)=>[v.cx+x*v.s,v.cy+z*v.home*v.sy-y*v.s];
export const bannerUnproject=(v,x,y)=>[(x-v.cx)/v.s,0,(y-v.cy)/v.sy*v.home];
const colors={attacker:['#287fba','#8ed8ff','#133c68'],defender:['#b64837','#ffaf8d','#6b261f']};
const palette=terrain=>/desert|arid/.test(terrain)?['#c4a36b','#e5cb92','#9e8352']: /snow|tundra/.test(terrain)?['#a4b9b9','#dbe7df','#768c88']:['#7b9c56','#a9bc73','#536b3b'];
function ellipse(c,x,y,rx,ry,fill){c.beginPath();c.ellipse(x,y,rx,ry,0,0,TAU);c.fillStyle=fill;c.fill();}
function polygon(c,pts,fill,stroke=null){c.beginPath();pts.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.closePath();c.fillStyle=fill;c.fill();if(stroke){c.strokeStyle=stroke;c.lineWidth=1;c.stroke();}}
function line(c,x,y,xx,yy,color,w=1){c.strokeStyle=color;c.lineWidth=w;c.beginPath();c.moveTo(x,y);c.lineTo(xx,yy);c.stroke();}
function rounded(c,x,y,w,h,r,fill){c.beginPath();if(c.roundRect)c.roundRect(x,y,w,h,r);else c.rect(x,y,w,h);c.fillStyle=fill;c.fill();}
export function regimentCardIcon(g){
 const role=cardRole(g),id=g.specialistId||'',p=id==='elephants'?'M5 25 Q1 15 7 9 H21 Q28 10 27 18 L30 25 H26 L23 20 H20 V28 H16 V20 H10 V28 H6Z':role==='mounted'?'M7 28 L9 15 L16 7 L24 10 L28 18 L23 22 L18 16 L15 28Z':role==='ranged'?'M7 4 Q27 16 7 28 L12 16Z M3 16 H28 L23 12 M28 16 L23 20':id==='pikes'||id==='spearmen'?'M6 28 L23 7 L26 2 L28 8 L24 11 L9 30Z':'M6 7 L16 3 L26 7 V17 Q25 24 16 29 Q7 24 6 17Z M16 8 V24 M10 15 H22';
 return '<svg viewBox="0 0 32 32" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"><path d="'+p+'"/></svg>';
}
export class BannerRenderer{
 constructor(canvas,terrain='plains'){
  this.canvas=canvas;this.c=canvas.getContext('2d',{alpha:false});if(!this.c)throw Error('Canvas 2D unavailable');
  this.terrain=terrain;this.isBannerRenderer=true;this.cache=null;this.particles=[];this.seen=new Map();
 }
 viewport(b){
  const canvas=this.canvas,w=canvas.clientWidth||canvas.width||900,h=canvas.clientHeight||canvas.height||600;
  const screen=canvas.getBoundingClientRect?.(),doc=globalThis.document;
  const top=doc?.querySelector('.battle-top')?.getBoundingClientRect?.(),bottom=doc?.querySelector('.battle-bottom')?.getBoundingClientRect?.();
  const t=top&&screen?cap(top.bottom-screen.top,0,h*.32):78;
  const d=bottom&&screen?cap(screen.bottom-bottom.top,0,h*.42):128;
  return bannerViewport(w,h,t+8,d+5,b.descriptor.defenseMode?-1:1);
 }
 project(b,x,z,y=0){return bannerProject(this.viewport(b),x,z,y);}
 ground(b,x,y){return bannerUnproject(this.viewport(b),x,y);}
 drawGround(c,v){
  const [base,light,dark]=palette(this.terrain),{w,h}=v;
  const grad=c.createLinearGradient(0,0,0,h);grad.addColorStop(0,dark);grad.addColorStop(.46,base);grad.addColorStop(1,dark);c.fillStyle=grad;c.fillRect(0,0,w,h);
  const P=(x,z)=>bannerProject(v,x,z);
  const corners=[P(-67,-49),P(67,-49),P(67,49),P(-67,49)];
  polygon(c,corners,base,'#405234');
  let seed=hash(this.terrain),rnd=()=>((seed=(Math.imul(seed,1664525)+1013904223)>>>0)/4294967296);
  for(let i=0;i<180;i++){const x=(rnd()-.5)*130,z=(rnd()-.5)*94,[px,py]=P(x,z);ellipse(c,px,py,v.s*(1+rnd()*3),v.sy*(.4+rnd()*1.4),i%3===0?'#ffffff12':'#1d331115');}
  for(let i=0;i<64;i++){const x=(rnd()-.5)*128,z=(rnd()-.5)*92,[px,py]=P(x,z);line(c,px,py,px+v.s*.4,py-v.s*.6,'#e5d8a340',Math.max(.6,v.s*.1));}
  for(let i=0;i<22;i++){const side=i%2?1:-1,x=side*(68+rnd()*4),z=(rnd()-.5)*100,[px,py]=P(x,z),r=v.s*(2+rnd()*2);
   ellipse(c,px,py,r*1.25,r*.47,'#172d2140');
   if(/desert|arid/.test(this.terrain)){polygon(c,[[px-r,py],[px-r*.3,py-r],[px+r*.6,py-r*.7],[px+r,py]],dark,'#685238');}
   else{line(c,px,py,px,py-r,'#65472d',r*.3);ellipse(c,px,py-r,r,r*.8,dark);ellipse(c,px-r*.25,py-r*1.25,r*.72,r*.52,light);}
  }
  const a=P(-66,0),b=P(66,0);c.setLineDash([5,8]);line(c,...a,...b,'#f4e4ac77',1);c.setLineDash([]);
  const shade=c.createRadialGradient(v.cx,v.cy,Math.min(w,h)*.15,v.cx,v.cy,Math.max(w,h)*.68);shade.addColorStop(0,'#0000');shade.addColorStop(1,'#18251840');c.fillStyle=shade;c.fillRect(0,0,w,h);
 }
 soldier(c,x,y,s,g,index,time){
  const role=cardRole(g),id=g.specialistId||'',mounted=g.type==='cavalry',elephant=id==='elephants',col=colors[g.side]||colors.attacker;
  const stride=g.moving?Math.sin(time*12+index*1.9)*2:0,attack=(g.attackPulse||0)>0,hit=(g.hitFlash||0)>0;
  const dir=(g.facingX||0)<-.15?-1:1;
  c.save();c.translate(x,y);c.scale(s,s);
  ellipse(c,0,0,mounted?7:4.8,mounted?3:2.2,'#25302055');
  c.translate(0,-Math.abs(stride)*.5);
  if(mounted){
   const body=elephant?'#777e88':'#805038',shade=elephant?'#4f555f':'#523320';
   ellipse(c,0,-5,elephant?9:7,elephant?6:4.3,body);
   for(const xx of [-5,4])line(c,xx,-3,xx+stride*.6,1,shade,elephant?2.8:1.7);
   ellipse(c,dir*(elephant?7:6),-8,elephant?4.5:3,elephant?5:3.6,body);
   if(elephant){line(c,dir*10,-7,dir*12,0,shade,2);line(c,dir*9,-5,dir*13,-4,'#f2e0b6',1.5);}
   rounded(c,-4,-9,8,4,1,col[0]);c.translate(0,elephant?-10:-7);
  }
  line(c,-2,-4,-2+stride*.5,0,'#373633',1.8);line(c,2,-4,2-stride*.5,0,'#373633',1.8);
  polygon(c,[[-4,-10],[4,-10],[5,-3],[-4,-3]],hit?'#f4d0a7':col[0],col[2]);
  line(c,-3,-9,3,-9,col[1],1);
  ellipse(c,0,-12,3.2,3.2,'#d9ac78');
  polygon(c,[[-3.8,-12],[-3,-16],[1,-17],[4,-13],[3,-12]],'#d0d6d8','#596264');
  line(c,-2,-15,2,-15,'#f7e5b5',.8);
  const thrust=attack?3:0;
  if(role==='ranged'){
   c.strokeStyle='#533921';c.lineWidth=1.2;c.beginPath();c.arc(dir*3,-7,4,-1.3,1.3);c.stroke();line(c,dir*4,-11,dir*4,-3,'#d6c19b',.7);if(id==='handgun')line(c,dir*2,-8,dir*10,-8,'#292a2a',2);
  }else if(id==='pikes'||id==='spearmen'||g.formationId==='pike_square'){
   line(c,dir*3,-4,dir*(8+thrust),-20,'#6a492d',1.1);polygon(c,[[dir*(8+thrust),-23],[dir*(10+thrust),-19],[dir*(6+thrust),-19]],'#e3e8e7');
  }else{
   line(c,dir*3,-8,dir*(9+thrust),-12,'#dce3e2',1.8);line(c,dir*4,-7,dir*5,-10,'#d6ab61',1.3);
   if(!mounted){ellipse(c,-dir*3,-6,3,4,col[2]);ellipse(c,-dir*3,-6,2.1,3,col[1]);}
  }
  if(attack&&role!=='ranged'){c.strokeStyle='#fff0b9b0';c.lineWidth=1.2;c.beginPath();c.arc(dir*5,-7,7,-1.4,.4);c.stroke();}
  c.restore();
 }
 renderBattle(b){
  const c=this.c,v=this.viewport(b),dpr=Math.min(globalThis.devicePixelRatio||1,2),{w,h}=v;
  if(this.canvas.width!==Math.round(w*dpr)||this.canvas.height!==Math.round(h*dpr)){this.canvas.width=Math.round(w*dpr);this.canvas.height=Math.round(h*dpr);this.cache=null;}
  c.setTransform(dpr,0,0,dpr,0,0);
  const key=[w,h,v.cx,v.cy,v.s,dpr,this.terrain].join(':');
  if(this.cache?.key!==key){const layer=globalThis.document?.createElement?.('canvas');if(layer){layer.width=Math.round(w*dpr);layer.height=Math.round(h*dpr);const lc=layer.getContext('2d');lc.setTransform(dpr,0,0,dpr,0,0);this.drawGround(lc,v);this.cache={key,layer};}}
  if(this.cache)c.drawImage(this.cache.layer,0,0,w,h);else this.drawGround(c,v);
  const P=(x,z,y=0)=>bannerProject(v,x,z,y),home=v.home,selected=b.selectedGroup?.();
  if(b.deployment||selected?.reserve){
   polygon(c,[P(-65,9*home),P(65,9*home),P(65,43*home),P(-65,43*home)],'#3d9bd522','#b9e5ff88');
   for(const cell of deploymentCells(home)){const [x,y]=P(cell.x,cell.z);ellipse(c,x,y,Math.max(3,v.s*.8),Math.max(2,v.sy*.8),'#d7eeff88');}
  }
  const groups=b.groups.filter(g=>!g.reserve&&(!g.routed||(g.routAge||0)<2.5)&&g.life>0);
  const sprites=[],labels=[];
  for(const g of groups){
   const [x,y]=P(g.x,g.z),col=colors[g.side],s=cap(v.s*.55,.48,1.4),count=Math.max(1,Math.min(12,Math.ceil(Math.sqrt(g.troopCount)*.75*g.life/100)));
   const cols=g.formationId==='pike_square'?Math.ceil(Math.sqrt(count)):g.formationId==='volley_line'||g.formationId==='longbow_line'?6:4;
   if(g.deployFlash>0){c.strokeStyle='#e8f7ff';c.lineWidth=2;c.beginPath();c.ellipse(x,y,Math.max(8,v.s*5*(1-g.deployFlash/1.4)),Math.max(4,v.sy*4*(1-g.deployFlash/1.4)),0,0,TAU);c.stroke();}
   if(g===selected){ellipse(c,x,y,Math.max(13,v.s*4.2),Math.max(6,v.sy*3),'#ffe1a54a');c.strokeStyle='#ffe0a3';c.lineWidth=2;c.beginPath();c.ellipse(x,y,Math.max(13,v.s*4.2),Math.max(6,v.sy*3),0,0,TAU);c.stroke();}
   for(let i=0;i<count;i++){
    const row=Math.floor(i/cols),n=Math.min(cols,count-row*cols),xx=(i%cols-(n-1)/2)*2.3,zz=(row-(Math.ceil(count/cols)-1)/2)*2.4;
    const yaw=Math.atan2(g.facingX||0,g.facingZ||-home),rx=xx*Math.cos(yaw)+zz*Math.sin(yaw),rz=-xx*Math.sin(yaw)+zz*Math.cos(yaw),p=P(g.x+rx,g.z+rz);
    sprites.push({g,i,x:p[0],y:p[1],s});
   }
   labels.push({g,x,y:y-Math.max(19,v.s*5),col});
  }
  sprites.sort((a,b)=>a.y-b.y||a.x-b.x);for(const a of sprites)this.soldier(c,a.x,a.y,a.s,a.g,a.i,b.elapsed||0);
  for(const p of b.projectiles||[]){const t=cap(p.t,0,1),x=p.sx+(p.tx-p.sx)*t,z=p.sz+(p.tz-p.sz)*t,[px,py]=P(x,z,Math.sin(t*Math.PI)*4);line(c,px-3,py+2,px,py,'#fff4c1',1.5);ellipse(c,px,py,1.5,1.2,'#fff9db');}
  for(const e of b.effects||[]){const t=cap(e.age/e.duration,0,1),[x,y]=P(e.x,e.z);c.save();c.globalAlpha=1-t;for(let i=0;i<5;i++){const a=i*TAU/5;line(c,x+Math.cos(a)*3,y+Math.sin(a)*3,x+Math.cos(a)*(5+t*10),y+Math.sin(a)*(5+t*8),e.kind==='rout'?'#e2c195':'#ffe1a2',1.5);}c.restore();}
  for(const {g,x,y,col} of labels){
   const hp=cap(g.life/100,0,1),n=Math.round(g.troopCount*hp),label=g.routed?'ROUT':String(n),bw=Math.max(24,Math.min(52,17+label.length*7));
   rounded(c,x-bw/2,y-14,bw,15,4,'#192621dc');c.fillStyle='#f9f1df';c.font='bold 10px system-ui';c.textAlign='center';c.fillText(label,x,y-3);
   rounded(c,x-bw/2,y+2,bw,4,2,'#27302d');if(hp>0)rounded(c,x-bw/2,y+2,bw*hp,4,2,col[1]);
  }
 }
 dispose(){this.cache=null;}
}
