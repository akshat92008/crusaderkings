import {test} from 'node:test';
import assert from 'node:assert/strict';
import {planMedievalBattlefield,seededBattleRandom,countBattlefieldPieces} from '../src/battlefield-layout.js';

test('medieval battlefield layouts are reproducible across launches',()=>{
 const a=planMedievalBattlefield(1450,'temperate',2);
 assert.deepEqual(a,planMedievalBattlefield(1450,'temperate',2));
 assert.notDeepEqual(a,planMedievalBattlefield(1451,'temperate',2));
});
test('medieval environment reserves the main army formation corridor',()=>{
 const scene=planMedievalBattlefield();
 assert.equal(scene.towers.length,2);
 assert.equal(scene.siegeEngines.length,2);
 assert.ok(scene.houses.length>=15);
 for(const house of scene.houses)assert.ok(house.z<-46&&Number.isFinite(house.x));
 for(const tent of scene.tents)assert.ok(Math.abs(tent.x)>=33&&tent.z>27);
 for(const tree of scene.trees)assert.ok(Math.abs(tree.x)>=50);
 assert.deepEqual(scene.gate,{x:0,z:-42,passageWidth:8});
});
test('environment allows desert biomes and clamps fortress levels',()=>{
 const desert=planMedievalBattlefield(1450,'desert',7);
 assert.equal(desert.biome,'desert');assert.equal(desert.fortLevel,4);
 assert.ok(desert.houses.every(h=>h.roof==='flat'));
 assert.ok(desert.trees.every(t=>t.kind==='palm'));
 const zero=planMedievalBattlefield(1450,'temperate',0);
 assert.equal(zero.fortLevel,0);assert.equal(zero.towers.length,2);
});
test('layout metadata and random generator never produce invalid positions',()=>{
 const r=seededBattleRandom(72);for(let i=0;i<100;i++){const x=r();assert.ok(x>=0&&x<1);}
 const layout=planMedievalBattlefield(72,'temperate',2),count=countBattlefieldPieces(layout);
 assert.equal(count.houses,layout.houses.length);
 assert.equal(count.tents,layout.tents.length);
 for(const kind of ['houses','trees','tents','rocks','crates'])for(const item of layout[kind])assert.ok(Number.isFinite(item.x)&&Number.isFinite(item.z));
});
