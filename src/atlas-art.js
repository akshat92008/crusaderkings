/**
 * Crown of Nations — CK2/CK3-inspired illustrated cartography & 2.5D atlas overlay.
 * Preserves exact province geometry and hit-testing compatibility while providing
 * tiered visual richness (shaded ridges, double-pass realm borders, diagonal war
 * occupation stripes, 2.5D holdings/sieges, curved spine labels, and army standees).
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

/**
 * Draw GeoJSON Polygon/MultiPolygon either in direct geo coordinates (when project=null)
 * or projected cleanly into 3D perspective screen space via project(lon, lat).
 */
export function drawGeoPath(ctx,geo,project=null){
 if(!geo?.coordinates)return;
 const polys=geo.type==='Polygon'?[geo.coordinates]:geo.type==='MultiPolygon'?geo.coordinates:[];
 for(const poly of polys)for(const ring of poly){
  if(!ring.length)continue;
  if(project){
   const p0=project(ring[0][0],ring[0][1]);
   ctx.moveTo(p0[0],p0[1]);
   for(let i=1;i<ring.length;i++){const pi=project(ring[i][0],ring[i][1]);ctx.lineTo(pi[0],pi[1]);}
  }else{
   ctx.moveTo(ring[0][0],ring[0][1]);
   for(let i=1;i<ring.length;i++)ctx.lineTo(ring[i][0],ring[i][1]);
  }
  ctx.closePath();
 }
}

export function atlasPaper(canvas){
 const pattern=document.createElement('canvas');pattern.width=256;pattern.height=256;const c=pattern.getContext('2d'),random=rng('papyrus-1450');
 c.fillStyle='#d2c6a6';c.fillRect(0,0,256,256);
 for(let i=0;i<5600;i++){const x=random()*256,y=random()*256,sz=random()*.9+.16;c.fillStyle=random()<.54?'rgba(54,53,35,.052)':'rgba(255,244,202,.085)';c.fillRect(x,y,sz,sz);}
 for(let i=0;i<30;i++){const x=random()*256,y=random()*256;c.beginPath();c.ellipse(x,y,random()*20+3,random()*5+1,random()*Math.PI,0,Math.PI*2);c.fillStyle='rgba(110,94,57,.013)';c.fill();}
 return canvas.createPattern(pattern,'repeat');
}

export function buildOccupationPattern(ctx,color='#c9544c'){
 const tile=document.createElement('canvas');tile.width=14;tile.height=14;const t=tile.getContext('2d');
 t.strokeStyle=color;t.lineWidth=3.2;t.globalAlpha=.46;
 t.beginPath();t.moveTo(-2,14);t.lineTo(14,-2);t.moveTo(0,16);t.lineTo(16,0);t.stroke();
 t.strokeStyle='rgba(25,20,14,.32)';t.lineWidth=1;
 t.beginPath();t.moveTo(-2,14);t.lineTo(14,-2);t.moveTo(0,16);t.lineTo(16,0);t.stroke();
 return ctx.createPattern(tile,'repeat');
}

export function drawSea(ctx,w,h,pattern){
 const g=ctx.createRadialGradient(w*.5,h*.45,Math.min(w,h)*.15,w*.5,h*.5,Math.max(w,h)*.78);
 g.addColorStop(0,'#4f6e72');g.addColorStop(.55,'#355359');g.addColorStop(1,'#21383e');
 ctx.fillStyle=g;ctx.fillRect(0,0,w,h);
 if(pattern){ctx.save();ctx.globalAlpha=.14;ctx.fillStyle=pattern;ctx.fillRect(0,0,w,h);ctx.restore();}
 // Subtle portolan rhumb lines + etched waves.
 ctx.save();ctx.strokeStyle='rgba(232,219,180,.06)';ctx.lineWidth=.8;
 for(let a=0;a<12;a++){const ang=a*Math.PI/6;ctx.beginPath();ctx.moveTo(w*.5,h*.5);ctx.lineTo(w*.5+Math.cos(ang)*w,h*.5+Math.sin(ang)*w);ctx.stroke();}
 ctx.strokeStyle='rgba(241,233,194,.08)';ctx.lineWidth=1;
 for(let y=28;y<h;y+=34){ctx.beginPath();for(let x=0;x<w;x+=36){ctx.moveTo(x+(y%42),y);ctx.quadraticCurveTo(x+12+(y%42),y-3,x+24+(y%42),y);}ctx.stroke();}
 ctx.restore();
 const top=ctx.createLinearGradient(0,0,0,h);top.addColorStop(0,'rgba(18,24,26,.28)');top.addColorStop(.16,'transparent');top.addColorStop(.84,'transparent');top.addColorStop(1,'rgba(24,20,14,.38)');ctx.fillStyle=top;ctx.fillRect(0,0,w,h);
}

export function drawLand(ctx,world,s,project=null){
 ctx.save();
 ctx.lineJoin='round';ctx.lineCap='round';
 // Shallow coastal turquoise shelf glow in 2D fallback (WebGL handles full bathymetry in 3D).
 if(project){
  ctx.beginPath();for(const p of world.provinces)drawGeoPath(ctx,p.geometry,project);
  ctx.lineWidth=clamp(7+s*.12,4,12);ctx.strokeStyle='rgba(92,148,144,.22)';ctx.stroke();
  ctx.lineWidth=clamp(3.2,2,5);ctx.strokeStyle='rgba(28,34,29,.45)';ctx.stroke();
  ctx.lineWidth=clamp(1.1,.8,2);ctx.strokeStyle='rgba(244,224,176,.52)';ctx.stroke();
 }else{
  for(const p of world.provinces){const bg=p.terrain==='highlands'?'#a99a76':p.terrain==='forest'?'#8b9a7b':p.terrain==='desert'?'#d2bc89':p.terrain==='plains'?'#baaf87':'#b7ac88';ctx.beginPath();drawGeoPath(ctx,p.geometry);ctx.fillStyle=bg;ctx.fill('evenodd');}
  for(const p of world.provinces){ctx.beginPath();drawGeoPath(ctx,p.geometry);ctx.lineWidth=clamp(2.7/s,.14,2.2);ctx.strokeStyle='rgba(65,72,61,.39)';ctx.stroke();}
  for(const p of world.provinces){ctx.beginPath();drawGeoPath(ctx,p.geometry);ctx.lineWidth=clamp(.85/s,.1,.5);ctx.strokeStyle='rgba(244,219,169,.53)';ctx.stroke();}
 }
 ctx.restore();
}

function shadedMountain(ctx,x,y,r,random){
 // Left lit slope + right shadow slope for authentic 2.5D tabletop mountain look.
 const h=r*(0.85+random()*0.4);
 ctx.beginPath();ctx.moveTo(x-r,y+r*.25);ctx.lineTo(x-r*.12,y-h);ctx.lineTo(x,y+r*.32);ctx.closePath();
 ctx.fillStyle='rgba(222,211,182,.32)';ctx.fill();
 ctx.beginPath();ctx.moveTo(x-r*.12,y-h);ctx.lineTo(x+r,y+r*.28);ctx.lineTo(x,y+r*.32);ctx.closePath();
 ctx.fillStyle='rgba(44,39,30,.36)';ctx.fill();
 ctx.beginPath();ctx.moveTo(x-r,y+r*.25);ctx.lineTo(x-r*.12,y-h);ctx.lineTo(x+r,y+r*.28);
 ctx.strokeStyle='rgba(52,44,32,.48)';ctx.stroke();
}
function lushTree(ctx,x,y,r){
 ctx.beginPath();ctx.arc(x+r*.12,y+r*.14,r*.58,0,Math.PI*2);ctx.fillStyle='rgba(20,38,24,.24)';ctx.fill();
 ctx.beginPath();ctx.arc(x,y,r*.55,0,Math.PI*2);ctx.fillStyle='rgba(54,88,46,.34)';ctx.fill();
 ctx.beginPath();ctx.arc(x-r*.18,y-r*.16,r*.35,0,Math.PI*2);ctx.fillStyle='rgba(116,148,84,.28)';ctx.fill();
}
function desertDune(ctx,x,y,r){
 ctx.beginPath();ctx.moveTo(x-r,y+r*.1);ctx.quadraticCurveTo(x,y-r*.45,x+r,y+r*.15);
 ctx.strokeStyle='rgba(138,104,54,.26)';ctx.stroke();
}

export function drawTopography(ctx,world,s,project=null,budget=240){
 if(budget<=0)return;
 ctx.save();ctx.lineJoin='round';ctx.lineCap='round';
 const perProvLimit=clamp(Math.floor(budget/Math.max(8,world.provinces.length)),2,24);
 for(const p of world.provinces){
  if(!['forest','highlands','desert'].includes(p.terrain))continue;
  const random=rng('landmarks:'+p.id);
  ctx.save();ctx.beginPath();drawGeoPath(ctx,p.geometry,project);ctx.clip('evenodd');
  ctx.lineWidth=project?clamp(0.85+s*.015,0.7,1.4):clamp(.65/s,.018,.2);
  for(const ring of extractOuterRings(p.geometry)){
   const b=bounds(ring);if(b[2]-b[0]>80)continue;
   const area=shoelace(ring);const count=clamp(Math.floor(area*1.6),1,perProvLimit);
   for(let i=0;i<count;i++){
    const gx=b[0]+random()*(b[2]-b[0]),gy=b[1]+random()*(b[3]-b[1]);
    if(!ringInside(gx,gy,ring))continue;
    if(project){
     const [px,py]=project(gx,gy);
     const sz=clamp((3.5+random()*4.2)*clamp(s/5,.7,1.7),3,11);
     if(p.terrain==='highlands')shadedMountain(ctx,px,py,sz*1.15,random);
     else if(p.terrain==='forest')lushTree(ctx,px,py,sz);
     else desertDune(ctx,px,py,sz);
    }else{
     const r=(.28+random()*.75);
     if(p.terrain==='highlands'){ctx.beginPath();ctx.moveTo(gx-r,gy-r*.4);ctx.lineTo(gx-r*.2,gy+r*.6);ctx.lineTo(gx+r,gy-r*.3);ctx.strokeStyle='rgba(66,63,47,.45)';ctx.stroke();}
     else if(p.terrain==='forest'){ctx.beginPath();ctx.moveTo(gx,gy-r*.6);ctx.lineTo(gx,gy+r*.35);ctx.moveTo(gx-r*.4,gy-r*.1);ctx.lineTo(gx,gy+r*.5);ctx.lineTo(gx+r*.4,gy-r*.1);ctx.strokeStyle='rgba(32,71,46,.34)';ctx.stroke();}
    }
   }
  }
  ctx.restore();
 }
 ctx.restore();
}

export function drawDivisions(ctx,details,s,enabled=true,project=null){
 if(!enabled)return;
 ctx.save();ctx.lineWidth=project?0.55:clamp(.63/s,.012,.24);ctx.lineJoin='round';ctx.strokeStyle='rgba(46,40,30,.12)';
 if(project)ctx.setLineDash([3,3]);
 for(const row of details){ctx.save();ctx.beginPath();drawGeoPath(ctx,row.geo,project);ctx.clip('evenodd');
  for(const poly of row.cells){
   ctx.beginPath();
   if(project){const p0=project(poly[0][0],poly[0][1]);ctx.moveTo(p0[0],p0[1]);for(let i=1;i<poly.length;i++){const pi=project(poly[i][0],poly[i][1]);ctx.lineTo(pi[0],pi[1]);}}
   else{ctx.moveTo(poly[0][0],poly[0][1]);for(let i=1;i<poly.length;i++)ctx.lineTo(poly[i][0],poly[i][1]);}
   ctx.closePath();ctx.stroke();
  }
  ctx.restore();
 }
 ctx.restore();
}

export function drawRosette(ctx,x,y,r){
 ctx.save();ctx.translate(x,y);
 ctx.fillStyle='rgba(30,26,20,.32)';ctx.beginPath();ctx.arc(2,2,r*1.04,0,Math.PI*2);ctx.fill();
 ctx.strokeStyle='rgba(196,154,69,.78)';ctx.fillStyle='rgba(245,230,182,.26)';ctx.lineWidth=1.1;
 ctx.beginPath();ctx.arc(0,0,r,0,Math.PI*2);ctx.fill();ctx.stroke();
 ctx.beginPath();ctx.arc(0,0,r*.72,0,Math.PI*2);ctx.stroke();
 for(let i=0;i<16;i++){const a=i*Math.PI/8,rr=i%2===0?r*.9:r*.55;ctx.beginPath();ctx.moveTo(Math.cos(a)*r*.28,Math.sin(a)*r*.28);ctx.lineTo(Math.cos(a)*rr,Math.sin(a)*rr);ctx.stroke();}
 ctx.beginPath();ctx.moveTo(0,-r*.92);ctx.lineTo(r*.14,0);ctx.lineTo(0,r*.92);ctx.lineTo(-r*.14,0);ctx.closePath();ctx.fillStyle='#d4b166';ctx.fill();ctx.strokeStyle='#3c311f';ctx.stroke();
 ctx.fillStyle='#ecd8a6';ctx.font='bold '+Math.floor(r*.24)+'px Georgia';ctx.textAlign='center';for(const [a,t] of [[-Math.PI/2,'N'],[0,'E'],[Math.PI/2,'S'],[Math.PI,'W']])ctx.fillText(t,Math.cos(a)*r*1.2,Math.sin(a)*r*1.2+3);ctx.restore();
}

export function atlasBorders(ctx,w,h){
 ctx.save();ctx.lineWidth=4;ctx.strokeStyle='rgba(74,55,31,.62)';ctx.strokeRect(8,8,w-16,h-16);
 ctx.lineWidth=1.4;ctx.strokeStyle='rgba(232,199,131,.76)';ctx.strokeRect(14,14,w-28,h-28);
 for(const [x,y,sx,sy] of [[22,22,1,1],[w-22,22,-1,1],[22,h-22,1,-1],[w-22,h-22,-1,-1]]){ctx.save();ctx.translate(x,y);ctx.scale(sx,sy);ctx.strokeStyle='rgba(231,202,137,.88)';ctx.lineWidth=1.3;ctx.beginPath();ctx.moveTo(0,26);ctx.quadraticCurveTo(2,7,26,0);ctx.moveTo(0,16);ctx.lineTo(6,11);ctx.lineTo(11,6);ctx.lineTo(16,0);ctx.stroke();ctx.restore();}
 ctx.restore();
}

/**
 * 2.5D Citadel / Settlement / Fort / Siege marker.
 * Accepts boolean (backward-compatible) or rich options object.
 */
export function drawSettlement(ctx,x,y,opts=false){
 const o=typeof opts==='boolean'?{major:opts}:(opts||{});
 const major=!!o.major,fort=o.fort||0,siege=!!o.siege,tradeCenter=!!o.tradeCenter,zoom=o.zoom||2,color=o.color||'#b5523d',timeMs=o.timeMs||0;
 const scale=(major?1.18:fort>=2?0.95:0.78)*clamp(0.85+zoom*0.06,0.82,1.25);
 ctx.save();ctx.translate(x,y);ctx.scale(scale,scale);ctx.lineJoin='round';

 // Ambient ground shadow.
 ctx.fillStyle='rgba(20,18,14,.38)';ctx.beginPath();ctx.ellipse(1.5,5.5,9.5,3.6,0,0,Math.PI*2);ctx.fill();

 // Fortified ring wall on high-fort settlements or capitals.
 if(major||fort>=2){
  ctx.fillStyle='#c9be9e';ctx.strokeStyle='#2f2a21';ctx.lineWidth=1;
  ctx.beginPath();ctx.ellipse(0,3.5,8.2,3.4,0,0,Math.PI*2);ctx.fill();ctx.stroke();
 }

 // Main stone keep & pitched crimson/slate roof.
 ctx.fillStyle='#ebe0be';ctx.strokeStyle='#2c261c';ctx.lineWidth=1.1;
 ctx.fillRect(-4.2,-2,8.4,7);ctx.strokeRect(-4.2,-2,8.4,7);
 if(major){
  // Flanking turrets for royal capital seats.
  ctx.fillStyle='#dfd1aa';
  ctx.fillRect(-7,-1,3,6);ctx.strokeRect(-7,-1,3,6);
  ctx.fillRect(4,-1,3,6);ctx.strokeRect(4,-1,3,6);
  ctx.fillStyle='#7f3c33';
  ctx.beginPath();ctx.moveTo(-8,-1);ctx.lineTo(-5.5,-5.2);ctx.lineTo(-3,-1);ctx.closePath();ctx.fill();ctx.stroke();
  ctx.beginPath();ctx.moveTo(3,-1);ctx.lineTo(5.5,-5.2);ctx.lineTo(8,-1);ctx.closePath();ctx.fill();ctx.stroke();
 }
 ctx.beginPath();ctx.moveTo(-5.5,-2);ctx.lineTo(0,-8);ctx.lineTo(5.5,-2);ctx.closePath();
 ctx.fillStyle=major?'#8c3833':fort>=2?'#5d646b':'#7d674c';
 ctx.fill();ctx.stroke();

 // Capital banner or harbor gold emblem.
 if(major){
  ctx.fillStyle='#e8cf86';ctx.fillRect(5.2,-11,1.6,12);
  ctx.beginPath();ctx.moveTo(6.8,-11);ctx.lineTo(15.5,-8.5);ctx.lineTo(6.8,-6);ctx.closePath();
  ctx.fillStyle=color;ctx.fill();ctx.strokeStyle='#2c2418';ctx.lineWidth=.8;ctx.stroke();
 }else if(tradeCenter){
  ctx.fillStyle='rgba(36,28,18,.86)';ctx.beginPath();ctx.arc(8,-4,4.2,0,Math.PI*2);ctx.fill();
  ctx.fillStyle='#f2d079';ctx.font='bold 7px Georgia';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText('⚓',8,-3.7);
 }

 // Active siege ring + subtle rising embers/smoke.
 if(siege){
  const pulse=0.72+0.28*Math.sin(timeMs*0.005);
  ctx.strokeStyle=`rgba(218,74,52,${0.88*pulse})`;ctx.lineWidth=1.8;
  ctx.beginPath();ctx.ellipse(0,3.5,11.5,5,0,0,Math.PI*2);ctx.stroke();
  ctx.fillStyle='rgba(240,126,52,.85)';
  ctx.beginPath();ctx.arc(-4,-8-pulse*2,2.1,0,Math.PI*2);ctx.arc(2,-10+pulse*1.5,1.6,0,Math.PI*2);ctx.fill();
 }
 ctx.restore();
}

export function drawOceanLettering(ctx,toScreen,w,h){
 ctx.save();ctx.font='italic 600 13px Georgia,serif';ctx.textAlign='center';ctx.textBaseline='middle';
 for(const [lon,lat,label] of [[-36,17,'A T L A N T I C   O C E A N'],[71,-37,'I N D I A N   O C E A N'],[-151,-4,'T H E   P A C I F I C'],[23,36,'M E D I T E R R A N E A N   S E A'],[62,18,'A R A B I A N   S E A']]){
  const [x,y]=toScreen(lon,lat);
  if(x>60&&y>45&&x<w-60&&y<h-50){
   ctx.lineWidth=2.5;ctx.strokeStyle='rgba(17,32,37,.45)';ctx.strokeText(label,x,y);
   ctx.fillStyle='rgba(220,224,204,.58)';ctx.fillText(label,x,y);
  }
 }
 ctx.restore();
}

export function buildAtlasEdges(world){const edges=new Map(),key=p=>p.map(n=>Math.round(n*10000)).join(',');for(const p of world.provinces){for(const ring of extractOuterRings(p.geometry))for(let i=1;i<ring.length;i++){const a=ring[i-1],b=ring[i],ka=key(a),kb=key(b);if(ka===kb)continue;const k=ka<kb?ka+'|'+kb:kb+'|'+ka;let e=edges.get(k);if(!e){e={a,b,ids:[]};edges.set(k,e);}if(!e.ids.includes(p.id))e.ids.push(p.id);}}return [...edges.values()];}
export function politicalEdgeKind(edge,owner){if(edge.ids.length===1)return 'outline';return new Set(edge.ids.map(owner)).size>1?'frontier':'district';}

export function drawPoliticalEdges(c,edges,owner,s,viewport,project=null){
 c.save();c.lineJoin='round';c.lineCap='round';
 const passes=project
  ?[['outline',1.0,'rgba(44,38,28,.62)'],['district',0.55,'rgba(48,41,31,.24)'],['frontier',4.2,'rgba(24,18,12,.36)'],['frontier',1.9,'rgba(42,31,19,.92)']]
  :[['outline',.82,'rgba(58,53,38,.56)'],['frontier',2.15,'rgba(43,39,31,.86)']];
 for(const [kind,width,color] of passes){
  c.beginPath();
  for(const e of edges){
   if(viewport&&(Math.max(e.a[0],e.b[0])<viewport[0]||Math.min(e.a[0],e.b[0])>viewport[2]||Math.max(e.a[1],e.b[1])<viewport[1]||Math.min(e.a[1],e.b[1])>viewport[3]))continue;
   if(politicalEdgeKind(e,owner)!==kind)continue;
   if(project){const p0=project(e.a[0],e.a[1]),p1=project(e.b[0],e.b[1]);c.moveTo(p0[0],p0[1]);c.lineTo(p1[0],p1[1]);}
   else{c.moveTo(...e.a);c.lineTo(...e.b);}
  }
  c.lineWidth=project?width:clamp(width/s,.025,1.4);
  c.strokeStyle=color;c.stroke();
 }
 c.restore();
}

/**
 * Compute and render a CK2/CK3-style sweeping curved label across a realm's geographic axis.
 */
export function drawCurvedRealmLabel(c,text,points,toScreen,w,h,zoom,used=null){
 if(!points?.length||!text)return null;
 let mx=0,my=0;for(const [lon,lat] of points){mx+=lon;my+=lat;}
 mx/=points.length;my/=points.length;
 let sxx=0,syy=0,sxy=0;
 for(const [lon,lat] of points){const dx=lon-mx,dy=lat-my;sxx+=dx*dx;syy+=dy*dy;sxy+=dx*dy;}
 const angle=points.length>=2?0.5*Math.atan2(2*sxy,sxx-syy):0;
 let rot=-angle;
 if(rot>Math.PI*0.42||rot<-Math.PI*0.42)rot=0;
 rot=clamp(rot,-0.55,0.55);

 const [baseX,baseY]=toScreen(mx,my);
 if(baseX<28||baseY<36||baseX>w-28||baseY>h-42)return null;
 let sMinX=Infinity,sMaxX=-Infinity,sMinY=Infinity,sMaxY=-Infinity;
 for(const [lon,lat] of points){
  const [px,py]=toScreen(lon,lat);
  sMinX=Math.min(sMinX,px);sMaxX=Math.max(sMaxX,px);
  sMinY=Math.min(sMinY,py);sMaxY=Math.max(sMaxY,py);
 }
 const realmPxSpan=Math.max(58,Math.hypot(sMaxX-sMinX,sMaxY-sMinY));
 const spaced=text.length<=12?text.split('').join(' '):text;
 const rawFont=clamp(9.5+Math.sqrt(points.length)*1.2+zoom*0.95,10,18);
 const estWidth=spaced.length*rawFont*0.62;
 const fitScale=clamp((realmPxSpan*0.85)/Math.max(1,estWidth),0.58,1.0);
 const fontSize=clamp(rawFont*fitScale,9,17);
 c.save();
 c.font=`700 ${fontSize.toFixed(1)}px Georgia,serif`;
 c.textAlign='center';c.textBaseline='middle';
 const width=c.measureText(spaced).width;

 // Check collision against existing markers/labels before drawing; nudge down once if hitting a unit/capital.
 let cx=baseX,cy=baseY;
 const hits=(tx,ty)=>used&&used.some(([px,py,pw,ph=22])=>Math.abs(tx-px)<(width+pw)*0.48&&Math.abs(ty-py)<(fontSize+ph)*0.55);
 if(hits(cx,cy))cy+=26;
 if(hits(cx,cy)){c.restore();return null;}

 const arcLift=Math.min(width*0.09,11+realmPxSpan*0.04)*(rot>=0?1:-1);
 const chars=[...spaced];
 const adv=[];let totalW=0;
 for(const ch of chars){const cw=c.measureText(ch).width;adv.push(cw);totalW+=cw;}
 c.lineWidth=3.6;c.strokeStyle='rgba(232,217,181,.88)';c.fillStyle='#242b26';
 let cur=-totalW/2;
 for(let i=0;i<chars.length;i++){
  const u=totalW>0?(cur+adv[i]*0.5)/(totalW*0.5):0;
  const lx=cur+adv[i]*0.5;
  const ly=arcLift*(1-u*u)*-0.45;
  const tangent=rot+((u*arcLift*0.9)/Math.max(30,totalW*0.5));
  const rx=cx+lx*Math.cos(rot)-ly*Math.sin(rot);
  const ry=cy+lx*Math.sin(rot)+ly*Math.cos(rot);
  c.save();c.translate(rx,ry);c.rotate(tangent);
  c.strokeText(chars[i],0,0);c.fillText(chars[i],0,0);
  c.restore();
  cur+=adv[i];
 }
 c.restore();
 return [cx,cy,width,fontSize+6];
}

export function drawMarchArc(c,fromPx,toPx,friendly=true){
 if(!fromPx||!toPx)return;
 const dx=toPx[0]-fromPx[0],dy=toPx[1]-fromPx[1],dist=Math.hypot(dx,dy);
 if(dist<8)return;
 const mx=(fromPx[0]+toPx[0])*0.5,my=(fromPx[1]+toPx[1])*0.5-Math.min(26,dist*0.24);
 c.save();
 c.strokeStyle=friendly?'rgba(76,184,128,.88)':'rgba(218,92,72,.88)';
 c.lineWidth=2.6;c.setLineDash([6,4]);
 c.beginPath();c.moveTo(fromPx[0],fromPx[1]);c.quadraticCurveTo(mx,my,toPx[0],toPx[1]);c.stroke();
 c.setLineDash([]);
 const ang=Math.atan2(toPx[1]-my,toPx[0]-mx);
 c.translate(toPx[0],toPx[1]);c.rotate(ang);
 c.fillStyle=friendly?'#7ee0a8':'#ff967d';
 c.beginPath();c.moveTo(4,0);c.lineTo(-7,-4.5);c.lineTo(-5,0);c.lineTo(-7,4.5);c.closePath();c.fill();
 c.restore();
}

export function atlasArmyGroups(armies,voyages={}){const groups=new Map();for(const a of Object.values(armies||{})){if(voyages[a.id])continue;const troops=['infantry','archers','cavalry'].reduce((n,t)=>n+Math.max(0,a[t]||0),0);if(!troops)continue;const key=a.province+'|'+a.owner,group=groups.get(key)||{province:a.province,owner:a.owner,troops:0,armies:0};group.troops+=troops;group.armies++;groups.set(key,group);}return [...groups.values()].sort((a,b)=>a.province.localeCompare(b.province)||a.owner.localeCompare(b.owner));}
