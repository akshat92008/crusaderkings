import test from 'node:test';
import assert from 'node:assert/strict';
import {buildMapCamera,projectMapPoint,unprojectScreenPoint} from '../src/map.js';
import {computeMapPitchDeg} from '../src/relief-map.js';
import {detectMapQualityTier,MapPerformanceGovernor,buildTerrainBuffers} from '../src/map-terrain-data.js';
import {drawGeoPath,drawSettlement,drawCurvedRealmLabel} from '../src/atlas-art.js';

test('3D perspective projection and inverse raycast round-trip accurately with pitch and elevation',()=>{
 const elevFn=(lon,lat)=>Math.max(0,Math.min(1,(lon-40)*0.02+(lat-20)*0.02));
 for(const pitch of [0,15,28]){
  const cam=buildMapCamera(1440,900,3.2,-120,85,0.82,pitch,5.6);
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
