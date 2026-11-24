/**
 * Crown of Nations — illustrated atlas renderer.
 * Drawn directly from the existing world/province shapes and procedural ornaments.
 * The fine "county" strokes are GRAPHIC DETAIL ONLY. They do NOT claim to be
 * actual historical administrative borders, and are never used by game logic.
 */
const clamp=(v,a,b)=>Math.min(b,Math.max(a,v));
function seedNumber(s){let h=2166136261;for(let i=0;i<s.length;i++)h=Math.imul(h^s.charCodeAt(i),16777619);return h>>>0;}
function rng(s){let state=seedNumber(String(s))||1;return()=>{state^=state<<13;state^=state>>>17;state^=state<<5;return (state>>>0)/4294967296;};}
export function hexRgb(v){if(!/^#[\da-f]{6}$/i.test(v||''))return [153,144,112];return [1,3,5].map(i=>parseInt(v.slice(i,i+2),16));}
export function atlasColor(hex,light=.38){const [r,g,b]=hexRgb(hex);const faded=([r,g,b]).map((x,i)=>Math.round(x*(1-light)+[233,217,180][i]*light));return 'rgb('+faded.join(',')+')';}
export function extractOuterRings(geo){if(!geo?.coordinates)return [];return (geo.type==='Polygon'?[geo.coordinates]:geo.type==='MultiPolygon'?geo.coordinates:[]).map(p=>p[0]).filter(r=>r&&r.length>=4);}
function bounds(ring){let x0=Infinity,y0=Infinity,x1=-Infinity,y1=-Infinity;for(const [x,y] of ring){x0=Math.min(x0,x);y0=Math.min(y0,y);x1=Math.max(x1,x);y1=Math.max(y1,y);}return [x0,y0,x1,y1];}
function shoelace(ring){let sum=0;for(let j=0;j<ring.length;j++){const a=ring[j],b=ring[(j+1)%ring.length];sum+=a[0]*b[1]-b[0]*a[1];}return Math.abs(sum)*.5;}
function ringInside(x,y,ring){let hit=false;for(let i=0,j=ring.length-1;i<ring.length;j=i++){const a=ring[i],b=ring[j];if((a[1]>y)!==(b[1]>y)&&x<(b[0]-a[0])*(y-a[1])/(b[1]-a[1])+a[0])hit=!hit;}return hit;}
function cutPolygon(poly,ax,ay,rhs){if(!poly.length)return [];const result=[];for(let i=0;i<poly.length;i++){const a=poly[i],b=poly[(i+1)%poly.length];const da=a[0]*ax+a[1]*ay-rhs,db=b[0]*ax+b[1]*ay-rhs,ina=da<=1e-9,inb=db<=1e-9;if(ina)result.push(a);if(ina!==inb){const t=da/(da-db);result.push([a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t]);}}return result;}
export function buildDecorativeCounties(world,maxPerRing=15){
 const result=[];for(const p of world.provinces){const cells=[];const random=rng('county:'+p.id);
  for(const ring of extractOuterRings(p.geometry)){const bb=bounds(ring),area=shoelace(ring),width=bb[2]-bb[0],height=bb[3]-bb[1];if(area<.23||width<.15||height<.15)continue;
   const wanted=clamp(Math.round(2+Math.sqrt(area)*.8),2,maxPerRing),seed=[];let tries=0;
   while(seed.length<wanted&&tries++<wanted*28){const x=bb[0]+random()*width,y=bb[1]+random()*height;if(ringInside(x,y,ring))seed.push([x,y]);}
   if(seed.length<2)continue;
   for(let i=0;i<seed.length;i++){const a=seed[i];let poly=[[bb[0],bb[1]],[bb[2],bb[1]],[bb[2],bb[3]],[bb[0],bb[3]]];
    for(let j=0;j<seed.length;j++){if(i===j)continue;const b=seed[j];poly=cutPolygon(poly,b[0]-a[0],b[1]-a[1],(b[0]*b[0]+b[1]*b[1]-a[0]*a[0]-a[1]*a[1])/2);if(poly.length<3)break;}
    if(poly.length>=3)cells.push(poly);
   }
  }
  if(cells.length)result.push({id:p.id,geo:p.geometry,cells});
 }
 return result;
}
export function drawGeoPath(ctx,geo){
 if(!geo?.coordinates)return;const polys=geo.type==='Polygon'?[geo.coordinates]:geo.type==='MultiPolygon'?geo.coordinates:[];
 for(const poly of polys)for(const ring of poly){if(!ring.length)continue;ctx.moveTo(ring[0][0],ring[0][1]);for(let i=1;i<ring.length;i++)ctx.lineTo(ring[i][0],ring[i][1]);ctx.closePath();}
}
export function atlasPaper(canvas){
 const pattern=document.createElement('canvas');pattern.width=256;pattern.height=256;const c=pattern.getContext('2d'),random=rng('papyrus-1450');
 c.fillStyle='#d2c6a6';c.fillRect(0,0,256,256);
 for(let i=0;i<5600;i++){const x=random()*256,y=random()*256,sz=random()*.9+.16;c.fillStyle=random()<.54?'rgba(54,53,35,.052)':'rgba(255,244,202,.085)';c.fillRect(x,y,sz,sz);}
 for(let i=0;i<30;i++){const x=random()*256,y=random()*256;c.beginPath();c.ellipse(x,y,random()*20+3,random()*5+1,random()*Math.PI,0,Math.PI*2);c.fillStyle='rgba(110,94,57,.013)';c.fill();}
 return canvas.createPattern(pattern,'repeat');
}
export function drawSea(ctx,w,h,pattern){
 const g=ctx.createLinearGradient(0,0,w,h);g.addColorStop(0,'#788e83');g.addColorStop(.48,'#95a8a1');g.addColorStop(1,'#6a817f');ctx.fillStyle=g;ctx.fillRect(0,0,w,h);
 ctx.save();ctx.globalAlpha=.2;ctx.fillStyle=pattern;ctx.fillRect(0,0,w,h);ctx.restore();
 ctx.save();ctx.strokeStyle='rgba(241,233,194,.1)';ctx.lineWidth=1;for(let y=25;y<h;y+=31){ctx.beginPath();for(let x=0;x<w;x+=31){ctx.moveTo(x+(y%40),y);ctx.quadraticCurveTo(x+11+(y%40),y-3,x+20+(y%40),y);}ctx.stroke();}ctx.restore();
 const top=ctx.createLinearGradient(0,0,0,h);top.addColorStop(0,'rgba(24,35,36,.22)');top.addColorStop(.20,'transparent');top.addColorStop(.82,'transparent');top.addColorStop(1,'rgba(38,33,24,.35)');ctx.fillStyle=top;ctx.fillRect(0,0,w,h);
}
export function drawLand(ctx,world,s){
 ctx.save();
 // Terrain undercoat, slightly different according to province geography.
 for(const p of world.provinces){const bg=p.terrain==='highlands'?'#a99a76':p.terrain==='forest'?'#8b9a7b':p.terrain==='desert'?'#d2bc89':p.terrain==='plains'?'#baaf87':'#b7ac88';ctx.beginPath();drawGeoPath(ctx,p.geometry);ctx.fillStyle=bg;ctx.fill('evenodd');}
 // Dark coastline shadow and pale coastline rim.
 ctx.lineJoin='round';ctx.lineCap='round';
 for(const p of world.provinces){ctx.beginPath();drawGeoPath(ctx,p.geometry);ctx.lineWidth=clamp(2.7/s,.14,2.2);ctx.strokeStyle='rgba(65,72,61,.39)';ctx.stroke();}
 for(const p of world.provinces){ctx.beginPath();drawGeoPath(ctx,p.geometry);ctx.lineWidth=clamp(.85/s,.1,.5);ctx.strokeStyle='rgba(244,219,169,.53)';ctx.stroke();}
 ctx.restore();
}
function mountain(ctx,x,y,r,random){ctx.beginPath();ctx.moveTo(x-r,y-r*.4);ctx.lineTo(x-r*.22,y+r*.66);ctx.lineTo(x+r*.18,y+r*.05);ctx.lineTo(x+r*.82,y+r*.52);ctx.lineTo(x+r,y-r*.3);ctx.stroke();ctx.beginPath();ctx.moveTo(x-r*.22,y+r*.66);ctx.lineTo(x-r*.1,y+r*.18);ctx.lineTo(x+r*.18,y+r*.05);ctx.stroke();if(random()>.55){ctx.beginPath();ctx.moveTo(x-r*.22,y+r*.66);ctx.lineTo(x-r*.02,y+r*.35);ctx.lineTo(x+r*.15,y+r*.30);ctx.stroke();}}
function tree(ctx,x,y,r){ctx.beginPath();ctx.moveTo(x,y-r*.6);ctx.lineTo(x,y+r*.35);ctx.moveTo(x-r*.42,y-r*.1);ctx.lineTo(x,y+r*.50);ctx.lineTo(x+r*.42,y-r*.1);ctx.stroke();}
export function drawTopography(ctx,world,s){
 ctx.save();ctx.lineJoin='round';ctx.lineCap='round';
 for(const p of world.provinces){if(!['forest','highlands'].includes(p.terrain))continue;const random=rng('landmarks:'+p.id);
  ctx.save();ctx.beginPath();drawGeoPath(ctx,p.geometry);ctx.clip('evenodd');
  ctx.strokeStyle=p.terrain==='highlands'?'rgba(66,63,47,.45)':'rgba(32,71,46,.34)';ctx.lineWidth=clamp(.65/s,.018,.2);
  for(const ring of extractOuterRings(p.geometry)){const b=bounds(ring);if(b[2]-b[0]>80)continue;const area=shoelace(ring);const count=clamp(Math.floor(area*2.1),2,75);
   for(let i=0;i<count;i++){const x=b[0]+random()*(b[2]-b[0]),y=b[1]+random()*(b[3]-b[1]);if(!ringInside(x,y,ring))continue;
    if(p.terrain==='highlands')mountain(ctx,x,y,.35+random()*.95,random);else tree(ctx,x,y,.26+random()*.7);
   }
  }
  ctx.restore();
 }ctx.restore();
}
export function drawDivisions(ctx,details,s,enabled=true){
 if(!enabled)return;
 ctx.save();ctx.lineWidth=clamp(.63/s,.012,.24);ctx.lineJoin='round';ctx.strokeStyle='rgba(52,48,37,.29)';
 for(const row of details){ctx.save();ctx.beginPath();drawGeoPath(ctx,row.geo);ctx.clip('evenodd');
  for(const poly of row.cells){ctx.beginPath();ctx.moveTo(poly[0][0],poly[0][1]);for(let i=1;i<poly.length;i++)ctx.lineTo(poly[i][0],poly[i][1]);ctx.closePath();ctx.stroke();}
  ctx.restore();
 }ctx.restore();
}
export function drawRosette(ctx,x,y,r){
 ctx.save();ctx.translate(x,y);ctx.strokeStyle='rgba(49,65,64,.53)';ctx.fillStyle='rgba(245,230,182,.30)';ctx.lineWidth=.9;
 ctx.beginPath();ctx.arc(0,0,r,0,Math.PI*2);ctx.arc(0,0,r*.72,0,Math.PI*2);ctx.stroke();
 for(let i=0;i<16;i++){const a=i*Math.PI/8,rr=i%2===0?r*.9:r*.55;ctx.beginPath();ctx.moveTo(Math.cos(a)*r*.3,Math.sin(a)*r*.3);ctx.lineTo(Math.cos(a)*rr,Math.sin(a)*rr);ctx.stroke();}
 ctx.beginPath();ctx.moveTo(0,-r*.92);ctx.lineTo(r*.12,0);ctx.lineTo(0,r*.92);ctx.lineTo(-r*.12,0);ctx.closePath();ctx.fill();ctx.stroke();
 ctx.fillStyle='#435b59';ctx.font='bold '+Math.floor(r*.23)+'px Georgia';ctx.textAlign='center';for(const [a,t] of [[-Math.PI/2,'N'],[0,'E'],[Math.PI/2,'S'],[Math.PI,'W']])ctx.fillText(t,Math.cos(a)*r*1.18,Math.sin(a)*r*1.18+3);ctx.restore();
}
export function atlasBorders(ctx,w,h){
 ctx.save();ctx.lineWidth=4;ctx.strokeStyle='rgba(83,63,37,.58)';ctx.strokeRect(8,8,w-16,h-16);
 ctx.lineWidth=1.5;ctx.strokeStyle='rgba(236,208,145,.74)';ctx.strokeRect(15,15,w-30,h-30);
 for(const [x,y,sx,sy] of [[23,23,1,1],[w-23,23,-1,1],[23,h-23,1,-1],[w-23,h-23,-1,-1]]){ctx.save();ctx.translate(x,y);ctx.scale(sx,sy);ctx.strokeStyle='rgba(231,202,137,.87)';ctx.lineWidth=1.2;ctx.beginPath();ctx.moveTo(0,27);ctx.quadraticCurveTo(2,7,27,0);ctx.moveTo(0,17);ctx.lineTo(6,12);ctx.lineTo(12,6);ctx.lineTo(17,0);ctx.stroke();ctx.restore();}
 ctx.restore();
}
export function drawSettlement(ctx,x,y,major=false){
 const k=major?1.1:.8;ctx.save();ctx.translate(x,y);ctx.scale(k,k);ctx.lineJoin='round';ctx.fillStyle='#ebd8ae';ctx.strokeStyle='#3e4136';ctx.lineWidth=1.1;ctx.fillRect(-3,0,6,5);ctx.strokeRect(-3,0,6,5);ctx.beginPath();ctx.moveTo(-5,0);ctx.lineTo(0,-5);ctx.lineTo(5,0);ctx.closePath();ctx.fillStyle=major?'#854844':'#806c53';ctx.fill();ctx.stroke();if(major){ctx.fillStyle='#e9d39c';ctx.fillRect(4,-7,2,10);ctx.beginPath();ctx.moveTo(6,-7);ctx.lineTo(14,-5);ctx.lineTo(6,-3);ctx.closePath();ctx.fillStyle='#b5523d';ctx.fill();}ctx.restore();
}
export function drawOceanLettering(ctx,toScreen,w,h){
 ctx.save();ctx.font='italic 13px Georgia,serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillStyle='rgba(29,63,69,.58)';
 for(const [lon,lat,label] of [[-36,17,'A T L A N T I C   O C E A N'],[71,-37,'I N D I A N   O C E A N'],[-151,-4,'T H E   P A C I F I C'],[23,36,'M E D I T E R R A N E A N   S E A'],[62,18,'A R A B I A N   S E A']]){const [x,y]=toScreen(lon,lat);if(x>60&&y>45&&x<w-60&&y<h-50)ctx.fillText(label,x,y);}ctx.restore();
}

// Real polygon edges, separate from decorative subdivisions. Unmatched edges
// are conservatively treated as outlines; no adjacency is inferred here.
export function buildAtlasEdges(world){const edges=new Map(),key=p=>p.map(n=>Math.round(n*10000)).join(',');for(const p of world.provinces){for(const ring of extractOuterRings(p.geometry))for(let i=1;i<ring.length;i++){const a=ring[i-1],b=ring[i],ka=key(a),kb=key(b);if(ka===kb)continue;const k=ka<kb?ka+'|'+kb:kb+'|'+ka;let e=edges.get(k);if(!e){e={a,b,ids:[]};edges.set(k,e);}if(!e.ids.includes(p.id))e.ids.push(p.id);}}return [...edges.values()];}
export function politicalEdgeKind(edge,owner){if(edge.ids.length===1)return 'outline';return new Set(edge.ids.map(owner)).size>1?'frontier':'district';}
export function drawPoliticalEdges(c,edges,owner,s,viewport){c.save();c.lineJoin='round';c.lineCap='round';for(const [kind,width,color] of [['outline',.82,'rgba(58,53,38,.56)'],['frontier',2.15,'rgba(43,39,31,.86)']]){c.beginPath();for(const e of edges){if(viewport&&(Math.max(e.a[0],e.b[0])<viewport[0]||Math.min(e.a[0],e.b[0])>viewport[2]||Math.max(e.a[1],e.b[1])<viewport[1]||Math.min(e.a[1],e.b[1])>viewport[3]))continue;if(politicalEdgeKind(e,owner)!==kind)continue;c.moveTo(...e.a);c.lineTo(...e.b);}c.lineWidth=clamp(width/s,.025,1.4);c.strokeStyle=color;c.stroke();}c.restore();}
export function atlasArmyGroups(armies,voyages={}){const groups=new Map();for(const a of Object.values(armies||{})){if(voyages[a.id])continue;const troops=['infantry','archers','cavalry'].reduce((n,t)=>n+Math.max(0,a[t]||0),0);if(!troops)continue;const key=a.province+'|'+a.owner,group=groups.get(key)||{province:a.province,owner:a.owner,troops:0,armies:0};group.troops+=troops;group.armies++;groups.set(key,group);}return [...groups.values()].sort((a,b)=>a.province.localeCompare(b.province)||a.owner.localeCompare(b.owner));}
