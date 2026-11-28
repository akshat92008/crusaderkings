// Conservative geographic bounds index: candidate filtering only, never replaces exact polygon picking.
export function geometryBounds(geo){let minX=Infinity,minY=Infinity,maxX=-Infinity,maxY=-Infinity;const polys=geo?.type==='Polygon'?[geo.coordinates]:geo?.type==='MultiPolygon'?geo.coordinates:[];for(const poly of polys)for(const ring of poly)for(const [x,y] of ring){minX=Math.min(minX,x);minY=Math.min(minY,y);maxX=Math.max(maxX,x);maxY=Math.max(maxY,y);}return [minX,minY,maxX,maxY];}
export function boundsOverlap(a,b){return a[0]<=b[2]&&a[2]>=b[0]&&a[1]<=b[3]&&a[3]>=b[1];}
export function geographicIndex(items){const rows=items.map((item,i)=>({item,i,b:geometryBounds(item.geometry)}));return {query(box){return rows.filter(r=>boundsOverlap(r.b,box)).map(r=>r.item);},pick(x,y,inside){for(let i=rows.length-1;i>=0;i--){const r=rows[i];if(x>=r.b[0]&&x<=r.b[2]&&y>=r.b[1]&&y<=r.b[3]&&inside(x,y,r.item.geometry))return r.item;}return null;}};}
export function seatSignature(world,game){const factions=game?Object.values(game.factions):world.factions;return JSON.stringify([world.provinces.map(p=>game?.provinces?.[p.id]?.owner??p.owner),factions.map(f=>[f.id,f.name,f.capital,f.color])]);}
export function frameCoalescer(schedule,draw){let queued=false;return ()=>{if(queued)return;queued=true;schedule(()=>{queued=false;draw();});};}
export function fieldFrameSteps(remainder,seconds,active,step=1/30){if(!active)return {steps:0,remainder:0};const total=Math.max(0,remainder||0)+Math.min(.2,Math.max(0,seconds||0));const steps=Math.min(6,Math.floor((total+1e-9)/step));return {steps,remainder:Math.max(0,total-steps*step)};}
export function renderInterval(software,mobile){return software?90:mobile?1000/30:1000/60;}

// Phase 17: Sampled visual soldier budgets, animation LOD intervals, frame telemetry, and safe GPU disposal.
export function sampledSoldierBudget(troopCount,type='infantry',quality='medium',isSoftwareGl=false,isElephant=false){
 const troops=Math.max(0,Number(troopCount)||0);
 if(isElephant)return isSoftwareGl||quality==='low'?2:quality==='high'?4:3;
 const q=isSoftwareGl?'low':quality;
 const base=type==='archers'?8:type==='cavalry'?6:11;
 const sizeFactor=troops>=350?1.25:troops>=180?1.08:troops<=45?0.72:1.0;
 const qMul=q==='low'?0.60:q==='high'?1.25:1.0;
 const maxCap=q==='low'?(type==='cavalry'?4:7):q==='high'?(type==='cavalry'?9:14):(type==='cavalry'?7:11);
 const minCap=type==='cavalry'?3:4;
 return Math.max(minCap,Math.min(maxCap,Math.round(base*sizeFactor*qMul)));
}

export function mixerLodInterval(distance,quality='medium',isSoftwareGl=false){
 const d=Number.isFinite(distance)?Math.max(0,distance):0;
 if(isSoftwareGl||quality==='low'){
  if(d>75)return 1/10;
  if(d>42)return 1/18;
  return 1/30;
 }
 if(quality==='high'){
  if(d>95)return 1/20;
  if(d>60)return 1/30;
  return 0;
 }
 if(d>82)return 1/15;
 if(d>48)return 1/24;
 return 0;
}

export function createFrameBudgetMonitor(windowSize=60){
 const capSize=Math.max(8,Math.floor(windowSize));
 const buf=new Float64Array(capSize);
 let cursor=0,filled=0,total=0;
 return {
  record(frameMs){
   const ms=Math.max(0,Number(frameMs)||0);
   if(filled<capSize){buf[cursor]=ms;total+=ms;filled++;}
   else{total+=ms-buf[cursor];buf[cursor]=ms;}
   cursor=(cursor+1)%capSize;
  },
  samples(){return filled;},
  averageMs(){return filled?total/filled:0;},
  fps(){const avg=filled?total/filled:0;return avg>0.001?1000/avg:0;},
  p95Ms(){
   if(!filled)return 0;
   const copy=Array.from(buf.subarray(0,filled)).sort((a,b)=>a-b);
   return copy[Math.min(copy.length-1,Math.floor(copy.length*0.95))];
  },
  sample(frameMs){return this.record(frameMs);},
  snapshot(){return {samples:this.samples(),avgMs:this.averageMs(),fps:this.fps(),p95Ms:this.p95Ms()};},
  overBudgetRatio(budgetMs=16.7){
   if(!filled)return 0;
   let over=0;
   for(let i=0;i<filled;i++)if(buf[i]>budgetMs)over++;
   return over/filled;
  },
  reset(){buf.fill(0);cursor=0;filled=0;total=0;}
 };
}

const TEXTURE_SLOTS=['map','normalMap','roughnessMap','metalnessMap','emissiveMap','aoMap','alphaMap','bumpMap','specularMap'];
export function disposeThreeObject(root,sharedSet=null){
 if(!root)return {geometries:0,materials:0,textures:0};
 const seenGeo=new Set(),seenMat=new Set(),seenTex=new Set();
 const disposeMat=m=>{
  if(!m||seenMat.has(m)||sharedSet?.has(m))return;
  seenMat.add(m);
  for(const slot of TEXTURE_SLOTS){
   const tex=m[slot];
   if(tex&&!seenTex.has(tex)&&!sharedSet?.has(tex)){seenTex.add(tex);tex.dispose?.();}
  }
  m.dispose?.();
 };
 const visit=node=>{
  if(!node)return;
  if(node.geometry&&!seenGeo.has(node.geometry)&&!sharedSet?.has(node.geometry)){
   seenGeo.add(node.geometry);
   node.geometry.dispose?.();
  }
  if(node.material){
   if(Array.isArray(node.material))for(const m of node.material)disposeMat(m);
   else disposeMat(node.material);
  }
  if(Array.isArray(node.children))for(const c of node.children)visit(c);
 };
 if(typeof root.traverse==='function')root.traverse(visit);
 else visit(root);
 return {geometries:seenGeo.size,materials:seenMat.size,textures:seenTex.size};
}
