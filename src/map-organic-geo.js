/**
 * Deterministic organic border fractalization for campaign provinces.
 * Replaces straight geometric Voronoi cuts between adjacent districts with
 * natural winding contours shared identically by neighboring polygons,
 * while preserving original world data and keeping coastlines crisp.
 */
import {extractOuterRings} from './atlas-art.js';

const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const ptKey=p=>`${Math.round(p[0]*10000)},${Math.round(p[1]*10000)}`;

function hashEdge(str){
 let h=2166136261;
 for(let i=0;i<str.length;i++)h=Math.imul(h^str.charCodeAt(i),16777619);
 return h>>>0;
}

function subdivideSharedEdge(a,b,canonicalKey){
 const dx=b[0]-a[0],dy=b[1]-a[1],len=Math.hypot(dx,dy);
 if(len<=0.38)return [a,b];
 // Determine canonical orientation so neighbor A->B and neighbor B->A match vertex-for-vertex.
 const ka=ptKey(a),kb=ptKey(b);
 const forward=ka<=kb;
 const p0=forward?a:b,p1=forward?b:a;
 const vx=p1[0]-p0[0],vy=p1[1]-p0[1];
 const nx=-vy/len,ny=vx/len;
 const steps=clamp(Math.ceil(len/0.55),2,14);
 const seed=hashEdge(canonicalKey);
 const p1Phase=((seed&1023)/1023)*Math.PI*2;
 const p2Phase=(((seed>>>10)&1023)/1023)*Math.PI*2;
 const p3Phase=(((seed>>>20)&1023)/1023)*Math.PI*2;
 const maxAmp=Math.min(0.24,len*0.12);

 const pts=[p0];
 for(let i=1;i<steps;i++){
  const t=i/steps;
  // Taper to exact 0 at vertices so triple-junction corners never tear.
  const env=Math.sin(t*Math.PI);
  const w=(Math.sin(t*Math.PI*2+p1Phase)*0.58+Math.sin(t*Math.PI*5+p2Phase)*0.30+Math.sin(t*Math.PI*9+p3Phase)*0.12)*maxAmp*env;
  pts.push([p0[0]+vx*t+nx*w,p0[1]+vy*t+ny*w]);
 }
 pts.push(p1);
 return forward?pts:pts.reverse();
}

export function buildOrganicVisualWorld(world){
 if(!world?.provinces?.length)return world;
 // Count how many provinces touch each boundary segment so coastlines stay sharp and internal cuts become organic.
 const edgeRefs=new Map();
 for(const p of world.provinces){
  for(const ring of extractOuterRings(p.geometry)){
   for(let i=1;i<ring.length;i++){
    const ka=ptKey(ring[i-1]),kb=ptKey(ring[i]);
    if(ka===kb)continue;
    const k=ka<kb?`${ka}|${kb}`:`${kb}|${ka}`;
    let set=edgeRefs.get(k);
    if(!set){set=new Set();edgeRefs.set(k,set);}
    set.add(p.id);
   }
  }
 }

 const cache=new Map();
 const transformRing=ring=>{
  if(ring.length<3)return ring;
  const out=[ring[0]];
  for(let i=1;i<ring.length;i++){
   const a=ring[i-1],b=ring[i];
   const ka=ptKey(a),kb=ptKey(b);
   if(ka===kb)continue;
   const k=ka<kb?`${ka}|${kb}`:`${kb}|${ka}`;
   if((edgeRefs.get(k)?.size||0)<2){
    out.push(b);
    continue;
   }
   let seg=cache.get(k);
   if(!seg){
    const canonical=ka<=kb?subdivideSharedEdge(a,b,k):subdivideSharedEdge(b,a,k);
    seg=canonical;
    cache.set(k,seg);
   }
   const isForward=ptKey(seg[0])===ka;
   if(isForward){for(let j=1;j<seg.length;j++)out.push(seg[j]);}
   else{for(let j=seg.length-2;j>=0;j--)out.push(seg[j]);}
  }
  return out;
 };

 const mapGeo=geo=>{
  if(!geo?.coordinates)return geo;
  if(geo.type==='Polygon')return {type:'Polygon',coordinates:geo.coordinates.map(transformRing)};
  if(geo.type==='MultiPolygon')return {type:'MultiPolygon',coordinates:geo.coordinates.map(poly=>poly.map(transformRing))};
  return geo;
 };

 return {
  ...world,
  provinces:world.provinces.map(p=>({...p,geometry:mapGeo(p.geometry)}))
 };
}
