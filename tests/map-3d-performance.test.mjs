import test from 'node:test';
import assert from 'node:assert/strict';
import {buildMapCamera,projectMapPoint,unprojectScreenPoint,CampaignMap} from '../src/map.js';
import {computeMapPitchDeg} from '../src/relief-map.js';
import {detectMapQualityTier,MapPerformanceGovernor,buildTerrainBuffers} from '../src/map-terrain-data.js';
import {buildOrganicVisualWorld} from '../src/map-organic-geo.js';
import {drawGeoPath,drawSettlement,drawCurvedRealmLabel} from '../src/atlas-art.js';

test('3D perspective projection and inverse raycast round-trip accurately with pitch and elevation',()=>{
 const elevFn=(lon,lat)=>Math.max(0,Math.min(1,(lon-40)*0.02+(lat-20)*0.02));
 for(const pitch of [0,15,28]){
  const cam=buildMapCamera(1440,900,3.2,-120,85,0.82,pitch,6.2);
  for(const [lon,lat] of [[12,48],[77,15],[30,41],[115,35]]){
   const h=pitch>0?elevFn(lon,lat):0;
   const [sx,sy]=projectMapPoint(cam,lon,lat,h);
   const [uLon,uLat]=unprojectScreenPoint(cam,sx,sy,pitch>0?elevFn:null);
   assert.ok(Math.abs(uLon-lon)<0.02,`lon mismatch at pitch ${pitch}: ${uLon} vs ${lon}`);
   assert.ok(Math.abs(uLat-lat)<0.02,`lat mismatch at pitch ${pitch}: ${uLat} vs ${lat}`);
  }
 }
});

test('pitch curve stays flat at world overview and tilts smoothly zoomed in when enabled',()=>{
 assert.equal(computeMapPitchDeg(1.02,28,true),0);
 assert.equal(computeMapPitchDeg(4.0,28,false),0);
 assert.equal(computeMapPitchDeg(4.0,0,true),0);
 const mid=computeMapPitchDeg(2.4,28,true),full=computeMapPitchDeg(4.0,28,true);
 assert.ok(mid>5&&mid<full);
 assert.equal(full,28);
});

test('quality tier detection and adaptive governor protect low-end PCs without stalling',()=>{
 const sw=detectMapQualityTier({getParameter:()=>'ANGLE (Google, Vulkan 1.3.0 (SwiftShader Device (Subzero)))'});
 assert.equal(sw.id,'low');
 assert.equal(sw.maxPitchDeg,0);
 assert.equal(sw.animateWater,false);

 const apple=detectMapQualityTier({getParameter:()=>'Apple M3'},{cores:8,memory:8,coarsePointer:false,reducedMotion:false});
 assert.equal(apple.id,'high');
 assert.ok(apple.maxPitchDeg>=25);

 const gov=new MapPerformanceGovernor(apple);
 let changed=false;
 for(let i=0;i<25;i++)if(gov.recordFrame(65))changed=true;
 assert.equal(changed,true);
 assert.notEqual(gov.tier.id,'high');
});

test('terrain buffer generator produces bounded elevation, bathymetry, and zero NaN values',()=>{
 const world={provinces:[{id:'p1',terrain:'highlands',geometry:{type:'Polygon',coordinates:[[[70,25],[85,25],[85,35],[70,35],[70,25]]]}}]};
 const res=buildTerrainBuffers(world,128,64);
 assert.equal(res.colorData.length,128*64*4);
 assert.equal(res.heightRgba.length,128*64*4);
 assert.ok(Number.isFinite(res.sampleHeight(77,30)));
 assert.equal(res.sampleHeight(0,0),0);
});

test('extended atlas drawing helpers handle projected geometry, settlements, and curved labels cleanly',()=>{
 const ops=[];
 const fakeCtx={
  save:()=>{},restore:()=>{},beginPath:()=>{},closePath:()=>{},clip:()=>{},stroke:()=>{},fill:()=>{},
  fillRect:()=>{},strokeRect:()=>{},arc:()=>{},ellipse:()=>{},translate:()=>{},scale:()=>{},rotate:()=>{},
  moveTo:(x,y)=>ops.push(['m',x,y]),lineTo:(x,y)=>ops.push(['l',x,y]),
  measureText:(t)=>({width:String(t).length*7}),strokeText:(t)=>ops.push(['st',t]),fillText:(t)=>ops.push(['ft',t]),
  setLineDash:()=>{},quadraticCurveTo:()=>{}
 };
 const poly={type:'Polygon',coordinates:[[[0,0],[10,0],[10,10],[0,10],[0,0]]]};
 drawGeoPath(fakeCtx,poly,(lon,lat)=>[lon*10+100,lat*10+100]);
 assert.deepEqual(ops[0],['m',100,100]);
 drawSettlement(fakeCtx,200,200,{major:true,fort:3,siege:true,tradeCenter:true,zoom:2.5,timeMs:1000});
 const box=drawCurvedRealmLabel(fakeCtx,'VIJAYANAGARA',[[76,14],[78,16],[77,15]],(lo,la)=>[lo*5,la*5],1200,800,2.2,[]);
 assert.ok(Array.isArray(box)&&box.length===4);
 const blocked=drawCurvedRealmLabel(fakeCtx,'VIJAYANAGARA',[[76,14],[78,16],[77,15]],(lo,la)=>[lo*5,la*5],1200,800,2.2,[[385,75,200,30],[385,101,200,30]]);
 assert.equal(blocked,null);
});

test('organic border fractalization replaces straight shared cuts seamlessly without mutating source world',()=>{
 const a={id:'a',geometry:{type:'Polygon',coordinates:[[[0,0],[10,0],[10,10],[0,10],[0,0]]]}};
 const b={id:'b',geometry:{type:'Polygon',coordinates:[[[10,0],[20,0],[20,10],[10,10],[10,0]]]}};
 const world={provinces:[a,b],factions:[]};
 const snap=JSON.stringify(world);
 const org=buildOrganicVisualWorld(world);
 assert.equal(JSON.stringify(world),snap);
 assert.ok(org.provinces[0].geometry.coordinates[0].length>5);
 // Shared internal edge vertices (strictly between y=0 and y=10) must match in exact reverse order
 const segA=org.provinces[0].geometry.coordinates[0].filter(p=>Math.abs(p[0]-10)<1&&p[1]>0&&p[1]<10);
 const segB=org.provinces[1].geometry.coordinates[0].filter(p=>Math.abs(p[0]-10)<1&&p[1]>0&&p[1]<10);
 assert.ok(segA.length>=10);
 assert.equal(segA.length,segB.length);
 assert.deepEqual(segA,[...segB].reverse());
});

test('CK2 map modes support dynamic diplomacy claims, worldwide vassals, dynasties, duchies, governments, and baron control',()=>{
 const pEng={id:'london',name:'London',owner:'england',terrain:'plains',development:5,tradeCenter:true,centroid:[0,51.5]};
 const pFra={id:'paris',name:'Paris',owner:'france',terrain:'plains',development:6,centroid:[2.3,48.8]};
 const pFraVassal={id:'normandy',name:'Normandy',owner:'france',terrain:'plains',development:3,centroid:[-0.3,49.1]};
 const pOtt={id:'edirne',name:'Edirne',owner:'ottomans',terrain:'plains',development:4,centroid:[26.5,41.6]};
 const game={
  turn:1,
  player:'england',
  provinces:{
   london:{owner:'england',development:5,prosperity:2,fort:2,unrest:0},
   paris:{owner:'france',development:6,prosperity:2,fort:2,unrest:0},
   normandy:{owner:'france',development:3,prosperity:1,fort:1,unrest:0},
   edirne:{owner:'ottomans',development:4,prosperity:1,fort:2,unrest:0}
  },
  factions:{
   england:{id:'england',name:'England',color:'#c44d47',treaties:{france:'alliance'},atWarWith:['ottomans'],truces:{},relations:{}},
   france:{id:'france',name:'France',color:'#4f79b8',treaties:{england:'alliance'},atWarWith:[],truces:{},relations:{}},
   ottomans:{id:'ottomans',name:'Ottoman Sultanate',color:'#4c8f62',treaties:{},atWarWith:['england'],truces:{},relations:{}}
  },
  politics:{
   realms:{england:{ruler:'c1'},france:{ruler:'c2'},ottomans:{ruler:'c3'}},
   people:{
    c1:{id:'c1',name:'Henry VI',house:'Lancaster',realm:'england',alive:true,opinion:50},
    c2:{id:'c2',name:'Charles VII',house:'Valois',realm:'france',alive:true,opinion:30},
    c2v:{id:'c2v',name:'Duke Jean',house:'Valois',realm:'france',alive:true,opinion:12},
    c3:{id:'c3',name:'Mehmed II',house:'Osmanoglu',realm:'ottomans',alive:true,opinion:-80}
   },
   holdings:{
    london:{lord:'c1',realm:'england',subholdings:{castle:{level:2,holder:'c1b'},city:{level:1,holder:null},temple:{level:1,holder:null}}}
   }
  },
  feudal:{
   districts:{d_norm:{id:'d_norm',name:'Normandy',members:['normandy']}},
   titles:{
    'c:london':{holder:'c1',deJureRealm:'england'},
    'c:paris':{holder:'c2',deJureRealm:'france'},
    'c:normandy':{holder:'c2v',deJureRealm:'england'},
    'c:edirne':{holder:'c3',deJureRealm:'ottomans'}
   },
   baronies:{},
   claimants:{}
  },
  civic:{realms:{england:{government:'feudal'},france:{government:'centralized'},ottomans:{government:'sultanate'}},provinces:{}},
  conflict:{claims:{},wars:{},truces:{}},
  diplomacy:{pacts:{},tributes:{},tributaries:{}},
  naval:{ports:{london:true},blockades:{}},
  campaignWar:{occupations:{}}
 };
 const world={provinces:[pEng,pFra,pFraVassal,pOtt],factions:[game.factions.england,game.factions.france,game.factions.ottomans]};
 const map=Object.create(CampaignMap.prototype);
 map.world=world;map.visualWorld=world;map.game=game;map.selected=null;
 map.ownerColors={england:'#c44d47',france:'#4f79b8',ottomans:'#4c8f62'};
 map.provinceIndex=new Map(world.provinces.map(p=>[p.id,p]));

 map.mode='diplomacy';
 assert.equal(map._diplomacyStatus('england','london'),'self');
 assert.equal(map._diplomacyStatus('france','paris'),'alliance');
 assert.equal(map._diplomacyStatus('ottomans','edirne'),'war');
 map.selected='paris';
 assert.equal(map._diplomacyFocusOwner(),'france');
 assert.equal(map._diplomacyStatus('france','paris'),'self');
 assert.equal(map._diplomacyStatus('england','london'),'alliance');
 map.selected='london';
 game.conflict.claims['england:paris']={realm:'england',province:'paris',expires:50};
 game.factions.england.treaties={};
 assert.equal(map._diplomacyStatus('france','paris'),'claim');
 assert.equal(map._diplomacyStatus('france','normandy'),'claim');
 assert.match(map.modeLegend().title,/Diplomacy · England/);

 map.mode='vassals';
 assert.match(map.provinceCategory(pFraVassal),/Duke Jean · Vassal/);
 assert.notEqual(map._rawBaseColor(pFraVassal),map._rawBaseColor(pFra));

 map.mode='dynasty';
 assert.equal(map.provinceCategory(pFra),'Valois');
 assert.equal(map.provinceCategory(pOtt),'Osmanoglu');

 map.mode='duchies';
 assert.equal(map.provinceCategory(pFraVassal),'Normandy');

 map.mode='government';
 assert.equal(map.provinceCategory(pOtt),'Sultanate');

 map.mode='control';
 assert.match(map.provinceCategory(pEng),/C2·Ci1·T1 · 1\/3 barons · Fort 2/);

 map.mode='trade';
 assert.match(map.provinceCategory(pEng),/TRADE HUB/);
});
