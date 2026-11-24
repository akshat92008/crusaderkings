// Gameplay districts derived from Natural Earth coastlines and the bundled
// Cliopatria/Seshat 1450 reference layer (CC BY 4.0, see docs/ATLAS_1450.md).
// Districts are not historical counties and source coverage is incomplete.
export const MAP_VERSION='atlas-1450-v2';
const aliases={
 england:['Kingdom of England','(Kingdom of England)'],france:['Kingdom of France','(Kingdom of France)'],castile:['Crown of Castile'],portugal:['Kingdom of Portugal'],aragon:['Crown of Aragon'],burgundy:['Duchy of Burgundy'],imperial:['Holy Roman Empire Minor States','(Holy Roman Empire)','House of Habsburg','Electorate of Brandenburg','Electorate of Trier','Kingdom of Bohemia','(Kingdom of Bohemia)','Duchy of Bavaria','House of Ascania','Duchy of Styria'],poland:['House of Jagiellon'],muscovy:['Grand Principality of Moscow'],novgorod:['Novgorod Republic'],ottomans:['Ottoman Empire'],mamluks:['Mamluk Sultanate'],timurids:['Timurid Empire'],qara:['Qara Qoyunlu'],horde:['Golden Horde'],morocco:['Marinid Sultanate'],ethiopia:['Ethiopian Empire'],mali:['Mali Empire'],kongo:['Kingdom of Kongo'],vijayanagara:['Vijayanagara Empire'],bahmani:['Bahmani Sultanate'],delhi:['(Delhi Sultanate)','Sayyid Dynasty'],bengal:['Sultanate of Bengal'],ming:['Ming Dynasty'],joseon:['Joseon'],ashikaga:['Ashikaga Shogunate'],ayutthaya:['Ayutthaya Kingdom'], 'dai-viet':['Lê Dynasty'],majapahit:['Majapahit'],mexica:['Aztec Triple Alliance'],maya:['Later Mayan City-States'],haudenosaunee:['Haudenosaunee'],inca:['Inca Empire']};
// Explicit limited fallback regions for starting profiles missing from the extract.
// These rectangular ranges are search constraints, not political boundary polygons.
const fallback={
 songhai:[-4,3,12,18],kilwa:[36,42,-12,-4],gujarat:[68,74,19,25],malacca:[99,105,0,6],pueblo:[-113,-103,31,38],muisca:[-76,-71,3,7],tupi:[-49,-34,-24,1],mapuche:[-75,-69,-43,-34],maori:[166,179,-48,-34],fiji:[176,180,-20,-15],aboriginal:[112,154,-44,-10]
};
const capitals={england:[-.1276,51.5072],france:[2.3522,48.8566],castile:[-4.7245,41.6523],portugal:[-9.1393,38.7223],aragon:[-.8891,41.6488],burgundy:[5.0415,47.322],imperial:[11.0767,49.4521],poland:[19.945,50.0647],muscovy:[37.6173,55.7558],novgorod:[31.2758,58.5228],ottomans:[26.5557,41.6771],mamluks:[31.2357,30.0444],timurids:[62.2031,34.3529],qara:[46.2919,38.0800],morocco:[-4.999,34.033],songhai:[-.0447,16.2666],kilwa:[39.522,-8.956],vijayanagara:[76.460,15.335],bahmani:[77.52,17.91],delhi:[77.21,28.61],bengal:[88.14,24.86],gujarat:[72.58,23.02],ming:[116.4074,39.9042],joseon:[126.978,37.5665],ashikaga:[135.768,35.012],ayutthaya:[100.568,14.353], 'dai-viet':[105.834,21.028],majapahit:[112.38,-7.54],malacca:[102.25,2.19],mexica:[-99.13,19.43],inca:[-71.97,-13.52],maori:[175.6,-38.1],fiji:[178.0,-17.8]};
const rings=g=>g.type==='Polygon'?[g.coordinates]:g.type==='MultiPolygon'?g.coordinates:[];
function inRing(x,y,ring){let hit=false;for(let i=0,j=ring.length-1;i<ring.length;j=i++){const a=ring[i],b=ring[j];if((a[1]>y)!==(b[1]>y)&&x<(b[0]-a[0])*(y-a[1])/(b[1]-a[1])+a[0])hit=!hit;}return hit;}
function inPoly(x,y,p){return inRing(x,y,p[0])&&!p.slice(1).some(h=>inRing(x,y,h));}
function bounds(p){const a=p[0];return a.reduce((b,[x,y])=>[Math.min(b[0],x),Math.max(b[1],x),Math.min(b[2],y),Math.max(b[3],y)],[Infinity,-Infinity,Infinity,-Infinity]);}
function insideBox([x,y],b){return x>=b[0]&&x<=b[1]&&y>=b[2]&&y<=b[3];}
function samples(p){const b=bounds(p),out=[];for(let i=0;i<7;i++)for(let j=0;j<7;j++){const x=b[0]+(i+.5)*(b[1]-b[0])/7,y=b[2]+(j+.5)*(b[3]-b[2])/7;if(inPoly(x,y,p))out.push([x,y]);}if(!out.length){const a=p[0];for(let i=1;i<a.length-1;i++){const q=[(a[0][0]+a[i][0]+a[i+1][0])/3,(a[0][1]+a[i][1]+a[i+1][1])/3];if(inPoly(...q,p)){out.push(q);break;}}}return out;}
function area(p){let sum=0;const a=p[0];for(let i=1;i<a.length;i++)sum+=a[i-1][0]*a[i][1]-a[i][0]*a[i-1][1];return Math.abs(sum)/2;}
function distance(a,b){const dx=Math.min(Math.abs(a[0]-b[0]),360-Math.abs(a[0]-b[0]))*Math.cos((a[1]+b[1])*Math.PI/360);return Math.hypot(dx,a[1]-b[1]);}
function center(p,pts){if(!pts.length)return p[0][0];const mean=pts.reduce((a,x)=>[a[0]+x[0]/pts.length,a[1]+x[1]/pts.length],[0,0]);return pts.slice().sort((a,b)=>distance(a,mean)-distance(b,mean))[0].map(x=>+x.toFixed(5));}
function region([x,y]){if(y<-10&&x>=110)return 'Oceania';if(x<-25)return y<12?'South America':'North America';if(x<45&&y<35&&x>=-20)return 'Africa';if(x<45&&y>=35&&x>=-25)return 'Europe';return 'Asia';}
const edgeKey=(a,b)=>{const k=p=>p.map(v=>v.toFixed(3)).join(',');return [k(a),k(b)].sort().join('|');};
// Split the large original Moscow–lower Volga district into two gameplay
// districts; the simplified dividing line is not a historical boundary.
function clipLatitude(ring,latitude,north){const out=[],inside=p=>north?p[1]>=latitude:p[1]<=latitude;let a=ring[ring.length-2];for(const b of ring.slice(0,-1)){if(inside(a)!==inside(b)){const t=(latitude-a[1])/(b[1]-a[1]);out.push([+(a[0]+t*(b[0]-a[0])).toFixed(6),latitude]);}if(inside(b))out.push(b);a=b;}if(out.length)out.push(out[0]);return out;}
function overlapEdge(a,b,c,d){const dx=b[0]-a[0],dy=b[1]-a[1],len=Math.hypot(dx,dy);if(len<.005)return false;const off=p=>Math.abs(dx*(p[1]-a[1])-dy*(p[0]-a[0]))/len;if(off(c)>.0012||off(d)>.0012)return false;const t=p=>((p[0]-a[0])*dx+(p[1]-a[1])*dy)/len;const x=t(c),y=t(d);return Math.min(len,Math.max(x,y))-Math.max(0,Math.min(x,y))>.008;}
function overlaps(a,b){for(const x of a.geometry.coordinates)for(const y of b.geometry.coordinates)for(let i=1;i<x.length;i++)for(let j=1;j<y.length;j++)if(overlapEdge(x[i-1],x[i],y[j-1],y[j]))return true;return false;}
export function rebuildNeighbors(ps){const edges=new Map(),links=new Map(ps.map(p=>[p.id,new Set()]));for(const p of ps){for(const ring of p.geometry.coordinates){for(let i=1;i<ring.length;i++){const a=ring[i-1],b=ring[i];if(distance(a,b)<.002)continue;const k=edgeKey(a,b);if(!edges.has(k))edges.set(k,[]);edges.get(k).push(p.id);}}}for(const ids of edges.values())for(const a of ids)for(const b of ids)if(a!==b)links.get(a).add(b);
 const boxes=ps.map(p=>bounds(p.geometry.coordinates));for(let i=0;i<ps.length;i++)for(let j=i+1;j<ps.length;j++){const a=boxes[i],b=boxes[j];if(links.get(ps[i].id).has(ps[j].id)||a[0]>b[1]+.002||b[0]>a[1]+.002||a[2]>b[3]+.002||b[2]>a[3]+.002)continue;if(overlaps(ps[i],ps[j])){links.get(ps[i].id).add(ps[j].id);links.get(ps[j].id).add(ps[i].id);}}
 for(const p of ps)p.neighbors=[...links.get(p.id)].sort();return ps;}
// Select a playable seat without treating a nearest district as a verified capital.
export function capitalDistrict(world,realm,state=null){const f=world.factions.find(f=>f.id===realm);if(!f)return null;const owns=p=>(state?state[p.id]?.owner:p.owner)===realm,owned=world.provinces.filter(owns);if(!owned.length)return null;
 const matches=owned.filter(p=>rings(p.geometry).some(poly=>inPoly(...f.capital,poly)));const candidates=matches.length?matches:owned;const district=candidates.slice().sort((a,b)=>distance(a.centroid,f.capital)-distance(b.centroid,f.capital)||a.id.localeCompare(b.id))[0];return {id:district.id,method:matches.length?'contains reference center':'nearest owned district'};}
// Connected components use actual playable land links. Never infer a land bridge from proximity.
export function landComponents(world){const byId=new Map(world.provinces.map(p=>[p.id,p])),seen=new Set(),components=[];for(const p of world.provinces){if(seen.has(p.id))continue;const queue=[p.id];seen.add(p.id);for(let i=0;i<queue.length;i++)for(const n of byId.get(queue[i]).neighbors||[])if(byId.has(n)&&!seen.has(n)){seen.add(n);queue.push(n);}components.push(queue.sort());}return components.sort((a,b)=>b.length-a.length||a[0].localeCompare(b[0]));}
export function realmGeography(world,realm,state=null){const owner=p=>(state?state[p.id]?.owner:p.owner),owned=world.provinces.filter(p=>owner(p)===realm),local=new Set(owned.map(p=>p.id)),components=landComponents({provinces:owned.map(p=>({...p,neighbors:p.neighbors.filter(n=>local.has(n))}))});return {districts:owned.length,components:components.length,largest:components[0]?.length||0,isolated:owned.filter(p=>p.neighbors.length===0).length};}
export function historicalPolityIndex(world){const index=new Map();for(const p of world.provinces){if(!p.historicalPolity)continue;const row=index.get(p.historicalPolity)||{name:p.historicalPolity,districts:[],owners:{},unassigned:0};row.districts.push(p.id);row.owners[p.owner]=(row.owners[p.owner]||0)+1;if(p.owner==='independent')row.unassigned++;index.set(row.name,row);}return [...index.values()].sort((a,b)=>a.name.localeCompare(b.name));}
export function atlasCoverage(world){const result={reference:0,'regional approximation':0,'playability approximation':0,unassigned:0,legacy:0,referencePolities:0,unmappedPolities:0,isolated:0};const named=new Set(),unmapped=new Set();for(const p of world.provinces){const k=p.ownershipSource||'legacy';if(Object.hasOwn(result,k))result[k]++;if(p.historicalPolity){named.add(p.historicalPolity);if(p.owner==='independent')unmapped.add(p.historicalPolity);}if(!p.neighbors.length)result.isolated++;}result.referencePolities=named.size;result.unmappedPolities=unmapped.size;return result;}
export function buildHistoricalWorld(legacy,history){if(!history?.features?.length)return legacy;
 const factions=legacy.factions.map(f=>({...f,capital:capitals[f.id]||f.capital.slice()})),byName=new Map(Object.entries(aliases).flatMap(([id,names])=>names.map(n=>[n,id]))),byId=new Map(factions.map(f=>[f.id,f]));
 const refs=history.features.filter(f=>f.geometry&&f.properties?.name).flatMap(f=>rings(f.geometry).map(poly=>({name:f.properties.name,owner:byName.get(f.properties.name)||'independent',poly,b:bounds(poly),area:area(poly)}))).sort((a,b)=>a.area-b.area);
 const ps=[];for(const src of legacy.provinces){const parts=rings(src.geometry).slice().sort((a,b)=>area(b)-area(a));for(let i=0;i<parts.length;i++){const poly=parts[i];if(area(poly)<=1e-8)continue;const pts=samples(poly),c=center(poly,pts),votes=new Map();for(const point of pts){const ref=refs.find(f=>insideBox(point,f.b)&&inPoly(...point,f.poly));const name=ref?.name||'';votes.set(name,(votes.get(name)||0)+1);}
 const voted=[...votes].filter(([n])=>n).sort((a,b)=>b[1]-a[1]||a[0].localeCompare(b[0]))[0],ref=voted&&voted[1]>=Math.max(1,Math.ceil(pts.length*.25))?voted[0]:'',historicalOwner=byName.get(ref)||'independent';let owner=historicalOwner,source=owner==='independent'?'unassigned':'reference';
 if(!ref){const candidates=Object.keys(fallback).filter(id=>insideBox(c,fallback[id])).sort((a,b)=>distance(c,byId.get(a).capital)-distance(c,byId.get(b).capital));if(candidates.length){owner=candidates[0];source='regional approximation';}}
 ps.push({...src,id:i?src.id+'-'+i:src.id,owner,centroid:c,continent:region(c),geometry:{type:'Polygon',coordinates:poly},neighbors:[],historicalPolity:ref||null,referenceSamples:pts.length,referenceMatches:voted?.[1]||0,ownershipSource:source,legacyId:src.id,population:i?Math.max(4,Math.round(src.population*.2)):src.population,development:i?1:src.development,fort:i?false:src.fort});}}
 // Ensure all starting playable profiles retain one district. Prefer a local
 // district from their reference/fallback region; never silently consume another
 // realm's last district. This is an explicit playability approximation.
 const count=id=>ps.filter(p=>p.owner===id).length;
 const volga=ps.find(p=>p.id==='p19'&&p.geometry.coordinates.length===1);if(volga&&!count('muscovy')&&volga.owner==='horde'){const south=[clipLatitude(volga.geometry.coordinates[0],54.5,false)],north=[clipLatitude(volga.geometry.coordinates[0],54.5,true)];if(south[0].length>=4&&north[0].length>=4){const original=volga.population,base={...volga};volga.geometry={type:'Polygon',coordinates:south};volga.centroid=center(south,samples(south));volga.population=Math.max(4,Math.round(original*.55));volga.ownershipSource='regional approximation';volga.referenceSamples=null;volga.referenceMatches=null;ps.push({...base,id:'p19-north',owner:'muscovy',geometry:{type:'Polygon',coordinates:north},centroid:center(north,samples(north)),population:Math.max(4,original-volga.population),historicalPolity:'Grand Principality of Moscow',referenceSamples:null,referenceMatches:null,ownershipSource:'regional approximation',neighbors:[]});}}
 for(const f of factions){if(count(f.id))continue;const options=ps.filter(p=>p.owner==='independent'||count(p.owner)>1).filter(p=>distance(p.centroid,f.capital)<12).sort((a,b)=>{const score=p=>distance(p.centroid,f.capital)+(p.owner==='independent'?0:4)-(inPoly(...f.capital,p.geometry.coordinates)?20:0)-(byName.get(p.historicalPolity)===f.id?12:0);return score(a)-score(b)||a.id.localeCompare(b.id);});const p=options[0];if(p){p.owner=f.id;p.ownershipSource='playability approximation';}}
 const labels={};for(const p of ps){const label=p.owner==='independent'?(p.historicalPolity||p.continent+' independent'):byId.get(p.owner)?.name||p.owner;const n=(labels[label]||0)+1;labels[label]=n;p.name=label+' · District '+n;}
 rebuildNeighbors(ps);
 const geography={factions,provinces:ps},components=landComponents(geography);for(const [i,ids] of components.entries())for(const id of ids){const p=ps.find(p=>p.id===id);p.landComponent=i+1;p.landComponentSize=ids.length;}for(const f of factions){f.startingSeat=capitalDistrict(geography,f.id);f.startingGeography=realmGeography(geography,f.id);}
 return {meta:{...legacy.meta,coverage:atlasCoverage(geography),landConnectivity:{components:components.length,largest:components[0]?.length||0},title:'Crown of Nations 1450 — Historical Atlas',mapVersion:MAP_VERSION,provinceCount:ps.length,caveat:'Synthetic gameplay districts aligned approximately to incomplete 1450 polity references; aggregated realms and fallback regions are not verified historical boundaries.',mapSource:'Natural Earth public domain; Cliopatria/Seshat CC BY 4.0, adapted'},factions,provinces:ps};
}
// Version 3 adds reference-based starting profiles without altering version 2.
export const EXPANDED_MAP_VERSION='atlas-1450-v3';
export const ATLAS_ADDITIONS=[
 {
  "id": "scotland",
  "name": "Kingdom of Scotland",
  "continent": "Europe",
  "capital": [
   -3.19,
   55.95
  ],
  "government": "Monarchy",
  "color": "#476d96",
  "specialty": "highland",
  "doctrineProfile": "highland",
  "civicProfile": [
   "feudal",
   "Scottish",
   "Latin Christianity"
  ],
  "referenceNames": [
   "Kingdom of Scotland"
  ],
  "initialTreasury": 1000,
  "initialPrestige": 12
 },
 {
  "id": "brittany",
  "name": "Duchy of Brittany",
  "continent": "Europe",
  "capital": [
   -1.55,
   47.22
  ],
  "government": "Duchy",
  "color": "#a89b81",
  "specialty": "chivalry",
  "doctrineProfile": "chivalry",
  "civicProfile": [
   "feudal",
   "Breton",
   "Latin Christianity"
  ],
  "referenceNames": [
   "Duchy of Brittany"
  ],
  "initialTreasury": 1000,
  "initialPrestige": 12
 },
 {
  "id": "kalmar",
  "name": "Kalmar Union",
  "continent": "Europe",
  "capital": [
   12.57,
   55.68
  ],
  "government": "Union monarchy",
  "color": "#b6a25c",
  "specialty": "maritime",
  "doctrineProfile": "maritime",
  "civicProfile": [
   "feudal",
   "Scandinavian",
   "Latin Christianity"
  ],
  "referenceNames": [
   "Kalmar Union",
   "(Kalmar Union)"
  ],
  "initialTreasury": 1000,
  "initialPrestige": 12
 },
 {
  "id": "genoa",
  "name": "Republic of Genoa",
  "continent": "Europe",
  "capital": [
   8.93,
   44.41
  ],
  "government": "Merchant republic",
  "color": "#97485e",
  "specialty": "maritime",
  "doctrineProfile": "maritime",
  "civicProfile": [
   "republic",
   "Ligurian",
   "Latin Christianity"
  ],
  "referenceNames": [
   "Republic of Genoa"
  ],
  "initialTreasury": 1000,
  "initialPrestige": 12
 },
 {
  "id": "venice",
  "name": "Republic of Venice",
  "continent": "Europe",
  "capital": [
   12.33,
   45.44
  ],
  "government": "Merchant republic",
  "color": "#985a35",
  "specialty": "maritime",
  "doctrineProfile": "maritime",
  "civicProfile": [
   "republic",
   "Venetian",
   "Latin Christianity"
  ],
  "referenceNames": [
   "Republic of Venice"
  ],
  "initialTreasury": 1000,
  "initialPrestige": 12
 },
 {
  "id": "cyprus",
  "name": "Kingdom of Cyprus",
  "continent": "Asia",
  "capital": [
   33.36,
   35.17
  ],
  "government": "Monarchy",
  "color": "#8c83ac",
  "specialty": "chivalry",
  "doctrineProfile": "chivalry",
  "civicProfile": [
   "feudal",
   "Cypriot",
   "Christian traditions"
  ],
  "referenceNames": [
   "Kingdom of Cyprus"
  ],
  "initialTreasury": 1000,
  "initialPrestige": 12
 },
 {
  "id": "oirats",
  "name": "Four Oirats",
  "continent": "Asia",
  "capital": [
   96,
   47
  ],
  "government": "Confederation",
  "color": "#9a785a",
  "specialty": "steppe",
  "doctrineProfile": "steppe",
  "civicProfile": [
   "steppe",
   "Oirat",
   "Buddhist and local traditions"
  ],
  "referenceNames": [
   "Four Oirats"
  ],
  "initialTreasury": 1000,
  "initialPrestige": 12
 },
 {
  "id": "chagatai",
  "name": "Chagatai Khanate",
  "continent": "Asia",
  "capital": [
   81.3,
   43.9
  ],
  "government": "Khanate",
  "color": "#727ca1",
  "specialty": "steppe",
  "doctrineProfile": "steppe",
  "civicProfile": [
   "steppe",
   "Chagatai",
   "Islamic and local traditions"
  ],
  "referenceNames": [
   "Chagatai Khanate"
  ],
  "initialTreasury": 1000,
  "initialPrestige": 12
 },
 {
  "id": "tibet",
  "name": "Tibetan polities",
  "continent": "Asia",
  "capital": [
   91.13,
   29.65
  ],
  "government": "Regional polities",
  "color": "#9d8447",
  "specialty": "highland",
  "doctrineProfile": "highland",
  "civicProfile": [
   "regional",
   "Tibetan",
   "Tibetan Buddhism"
  ],
  "referenceNames": [
   "Tibet"
  ],
  "initialTreasury": 1000,
  "initialPrestige": 12
 },
 {
  "id": "lanxang",
  "name": "Lan Xang",
  "continent": "Asia",
  "capital": [
   102.14,
   19.89
  ],
  "government": "Monarchy",
  "color": "#739753",
  "specialty": "elephant",
  "doctrineProfile": "elephant",
  "civicProfile": [
   "tributary",
   "Lao",
   "Theravada Buddhism"
  ],
  "referenceNames": [
   "Lan Xang"
  ],
  "initialTreasury": 1000,
  "initialPrestige": 12
 },
 {
  "id": "sunda",
  "name": "Sunda Kingdom",
  "continent": "Asia",
  "capital": [
   106.8,
   -6.6
  ],
  "government": "Monarchy",
  "color": "#478b83",
  "specialty": "river",
  "doctrineProfile": "river",
  "civicProfile": [
   "regional",
   "Sundanese",
   "Hindu-Buddhist and local traditions"
  ],
  "referenceNames": [
   "Sunda Kingdom"
  ],
  "initialTreasury": 1000,
  "initialPrestige": 12
 },
 {
  "id": "zayyanid",
  "name": "Zayyanid realm",
  "continent": "Africa",
  "capital": [
   -1.32,
   34.88
  ],
  "government": "Sultanate",
  "color": "#a97153",
  "specialty": "chivalry",
  "doctrineProfile": "chivalry",
  "civicProfile": [
   "sultanate",
   "Maghrebi",
   "Sunni Islam"
  ],
  "referenceNames": [
   "Zayyanid dynasty"
  ],
  "initialTreasury": 1000,
  "initialPrestige": 12
 }
];
export function expandHistoricalWorld(atlas){
 if(atlas.meta?.mapVersion!==MAP_VERSION)return atlas;
 const world=JSON.parse(JSON.stringify(atlas)),added=[];
 for(const profile of ATLAS_ADDITIONS){const districts=world.provinces.filter(p=>p.owner==='independent'&&profile.referenceNames.includes(p.historicalPolity)&&Number.isFinite(p.referenceSamples)&&p.referenceSamples>0&&p.referenceMatches/p.referenceSamples>=.5);if(!districts.length)continue;
 const {referenceNames,...f}=JSON.parse(JSON.stringify(profile));f.initialTreasury=1000+Math.min(600,districts.length*50);f.referenceNames=referenceNames;f.referenceProfile=true;world.factions.push(f);added.push(f.id);
 for(const [i,p] of districts.entries()){p.owner=f.id;p.ownershipSource='reference';p.name=f.name+' · District '+(i+1);}}
 for(const f of world.factions){f.startingSeat=capitalDistrict(world,f.id);f.startingGeography=realmGeography(world,f.id);}
 world.meta={...world.meta,mapVersion:EXPANDED_MAP_VERSION,coverage:atlasCoverage(world),addedProfiles:added,caveat:'Synthetic districts aligned approximately to incomplete 1450 polity references. Additional playable profiles and political-center coordinates are gameplay abstractions; borders are not verified.'};return world;
}
// v4 refines large gameplay polygons. These subdivisions are not historical counties.
export const DENSE_MAP_VERSION='atlas-1450-v4';
function splitRing(ring,axis,line,high){const inside=p=>high?p[axis]>=line:p[axis]<=line,out=[];let a=ring[ring.length-2];for(const b of ring.slice(0,-1)){if(inside(a)!==inside(b)){const t=(line-a[axis])/(b[axis]-a[axis]),q=[a[0]+t*(b[0]-a[0]),a[1]+t*(b[1]-a[1])];q[axis]=line;out.push(q);}if(inside(b))out.push(b.slice());a=b;}if(out.length)out.push(out[0].slice());return out;}
function splitDistrict(p){const poly=p.geometry.coordinates;if(poly.length!==1||p.population<8||area(poly)<1)return null;const b=bounds(poly);if(b[1]-b[0]>180)return null;const order=(b[1]-b[0])*Math.cos(p.centroid[1]*Math.PI/180)>b[3]-b[2]?[0,1]:[1,0],ring=poly[0],total=area(poly);
 for(const axis of order)for(const fraction of [.5,.4,.6]){const line=b[axis*2]+(b[axis*2+1]-b[axis*2])*fraction;if(ring.some(q=>Math.abs(q[axis]-line)<1e-7))continue;let crossings=0;for(let i=1;i<ring.length;i++)if((ring[i-1][axis]<line)!==(ring[i][axis]<line))crossings++;if(crossings!==2)continue;
 const parts=[[splitRing(ring,axis,line,false)],[splitRing(ring,axis,line,true)]],areas=parts.map(area);if(parts.some(q=>q[0].length<4)||areas.some(a=>a<total*.23)||Math.abs(areas[0]+areas[1]-total)>1e-6*Math.max(1,total))continue;
 const pts=parts.map(samples);if(pts.some(a=>!a.length))continue;const centers=parts.map((q,i)=>center(q,pts[i]));if(centers.some((q,i)=>!inPoly(...q,parts[i])))continue;
 const primary=inPoly(...p.centroid,parts[1])?1:0,minor=1-primary,majorPop=Math.max(4,Math.min(p.population-4,Math.round(p.population*areas[primary]/total))),make=(i,id,pop,fort)=>({...p,id,geometry:{type:'Polygon',coordinates:parts[i]},centroid:centers[i],population:pop,fort,neighbors:[],parentDistrict:p.id,subdivision:true,referenceSamples:null,referenceMatches:null,referenceInherited:true});return [make(primary,p.id,majorPop,p.fort),make(minor,p.id+'-sub',p.population-majorPop,false)];}
 return null;}
export function densifyHistoricalWorld(expanded){if(expanded.meta?.mapVersion!==EXPANDED_MAP_VERSION)return expanded;const world=JSON.parse(JSON.stringify(expanded)),parents=new Map(),ordered=world.provinces.filter(p=>p.owner!=='independent').sort((a,b)=>area(b.geometry.coordinates)*Math.cos(b.centroid[1]*Math.PI/180)-area(a.geometry.coordinates)*Math.cos(a.centroid[1]*Math.PI/180)||a.id.localeCompare(b.id));
 for(const p of ordered){if(parents.size>=90)break;const parts=splitDistrict(p);if(parts)parents.set(p.id,parts);}
 world.provinces=world.provinces.flatMap(p=>parents.get(p.id)||[p]);rebuildNeighbors(world.provinces);
 // Reject a split if either the internal link or a preexisting external land edge disappeared.
 const oldBy=new Map(expanded.provinces.map(p=>[p.id,p])),find=new Map(world.provinces.map(p=>[p.id,p])),invalid=new Set();
 for(const [id,parts] of parents){if(!find.get(id).neighbors.includes(parts[1].id)){invalid.add(id);continue;}for(const n of oldBy.get(id).neighbors){const other=parents.get(n)?.map(p=>p.id)||[n];if(!parts.some(p=>find.get(p.id).neighbors.some(x=>other.includes(x)))){invalid.add(id);if(parents.has(n))invalid.add(n);}}}
 if(invalid.size){for(const id of invalid)parents.delete(id);world.provinces=JSON.parse(JSON.stringify(expanded.provinces)).flatMap(p=>parents.get(p.id)||[p]);rebuildNeighbors(world.provinces);}
 const components=landComponents(world),byId=new Map(world.provinces.map(p=>[p.id,p])),labels={};for(const [i,ids] of components.entries())for(const id of ids){const p=byId.get(id);p.landComponent=i+1;p.landComponentSize=ids.length;}
 for(const p of world.provinces){if(p.owner==='independent')continue;const f=world.factions.find(f=>f.id===p.owner),n=(labels[p.owner]||0)+1;labels[p.owner]=n;p.name=f.name+' · District '+n;}
 for(const f of world.factions){f.startingSeat=capitalDistrict(world,f.id);f.startingGeography=realmGeography(world,f.id);}
 world.meta={...world.meta,mapVersion:DENSE_MAP_VERSION,provinceCount:world.provinces.length,subdividedParents:parents.size,coverage:atlasCoverage(world),landConnectivity:{components:components.length,largest:components[0]?.length||0},caveat:'Reference-informed starting realms with synthetic internal gameplay subdivisions. Inherited ownership is not fresh historical evidence; boundaries and district populations are approximate.'};return world;}
export function worldForSave(raw,legacy,atlas,expanded=atlas,dense=expanded){const version=JSON.parse(raw).mapVersion||'legacy';if(version==='legacy')return legacy;if(version===MAP_VERSION&&atlas.meta.mapVersion===MAP_VERSION)return atlas;if(version===EXPANDED_MAP_VERSION&&expanded.meta.mapVersion===EXPANDED_MAP_VERSION)return expanded;if(version===DENSE_MAP_VERSION&&dense.meta.mapVersion===DENSE_MAP_VERSION)return dense;throw Error('Saved map version is unavailable');}
