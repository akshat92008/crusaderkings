import test from 'node:test';
import assert from 'node:assert/strict';
import {buildDecorativeCounties,drawGeoPath,atlasColor,hexRgb,extractOuterRings,buildAtlasEdges,politicalEdgeKind,atlasArmyGroups} from '../src/atlas-art.js';
import {inside} from '../src/map.js';
const square={type:'Polygon',coordinates:[[[0,0],[10,0],[10,10],[0,10],[0,0]]]};
test('decorative atlas county outlines do not modify playable province geometry',()=>{
 const world={provinces:[{id:'test',geometry:structuredClone(square),terrain:'plains'}]};
 const before=JSON.stringify(world);
 const a=buildDecorativeCounties(world);
 assert.equal(JSON.stringify(world),before);
 assert.equal(a.length,1);
 assert.ok(a[0].cells.length>=2);
 for(const poly of a[0].cells)for(const pair of poly)assert.ok(pair.every(Number.isFinite));
});
test('real province hit-testing still uses original polygons',()=>{
 assert.equal(inside(5,5,square),true);
 assert.equal(inside(20,20,square),false);
 assert.equal(extractOuterRings(square).length,1);
});
test('parchment realm colors are stable and distinct',()=>{
 assert.deepEqual(hexRgb('#c65b56'),[198,91,86]);
 assert.equal(atlasColor('#336699'),atlasColor('#336699'));
 assert.notEqual(atlasColor('#336699'),atlasColor('#993366'));
});
test('atlas draws GeoJSON polygon rings without external textures',()=>{
 const calls=[];const c={moveTo:(...a)=>calls.push(['m',...a]),lineTo:(...a)=>calls.push(['l',...a]),closePath:()=>calls.push(['z'])};
 drawGeoPath(c,square);assert.equal(calls.filter(q=>q[0]==='m').length,1);assert.equal(calls.filter(q=>q[0]==='z').length,1);
});

test('actual shared polygon edges become frontiers only between different owners',()=>{const world={provinces:[{id:'a',geometry:square},{id:'b',geometry:{type:'Polygon',coordinates:[[[10,0],[20,0],[20,10],[10,10],[10,0]]]}}]};const edges=buildAtlasEdges(world),e=edges.find(e=>e.ids.length===2);assert.ok(e);assert.equal(politicalEdgeKind(e,()=>1),'district');assert.equal(politicalEdgeKind(e,id=>id),'frontier');assert.equal(edges.length,7);});
test('army markers group friendly stationed units without counting embarked armies',()=>{const a=atlasArmyGroups({a:{id:'a',owner:'r',province:'p',infantry:50},b:{id:'b',owner:'r',province:'p',cavalry:20},c:{id:'c',owner:'r',province:'p',infantry:100},d:{id:'d',owner:'s',province:'p',archers:40}},{c:{}});assert.equal(a.length,2);assert.deepEqual(a[0],{province:'p',owner:'r',troops:70,armies:2});});
