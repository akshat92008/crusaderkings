import assert from 'node:assert/strict';
import test from 'node:test';
import {readFileSync} from 'node:fs';
import {buildHistoricalWorld,expandHistoricalWorld,EXPANDED_MAP_VERSION,worldForSave,densifyHistoricalWorld,DENSE_MAP_VERSION} from '../src/historical-world.js';
import {createGame,advanceMonth,snapshot,restoreGame,empireStats} from '../src/simulation.js';
import {militaryDoctrine} from '../src/military-doctrines.js';
const legacy=JSON.parse(readFileSync(new URL('../data/world.json',import.meta.url)));
const reference=JSON.parse(readFileSync(new URL('../data/historical-polities-1450.json',import.meta.url)));
const atlas=buildHistoricalWorld(legacy,reference),world=expandHistoricalWorld(atlas);
test('all added realms have initialized courts, armies, civic profiles and economy',()=>{const g=createGame(world,'scotland');assert.equal(Object.keys(g.politics.realms).length,56);for(const id of world.meta.addedProfiles){const f=world.factions.find(f=>f.id===id);assert.ok(g.politics.people[g.politics.realms[id].ruler]);assert.equal(g.civic.realms[id].government,f.civicProfile[0]);assert.equal(militaryDoctrine(f).id,f.doctrineProfile);assert.ok(Object.values(g.armies).some(a=>a.owner===id&&g.provinces[a.province].owner===id));assert.ok(Number.isFinite(empireStats(g,id).taxIncome));assert.ok(g.royalCourt.realms[id]);assert.ok(g.expanded.realms[id]);}for(const id of ['scotland','genoa','venice','cyprus','sunda'])assert.ok(Object.keys(g.naval.ports).some(p=>g.provinces[p].owner===id));});
test('expanded atlas campaigns advance and restore in the correct map version',{timeout:120000},()=>{let g=createGame(world,'lanxang');for(let i=0;i<12;i++)advanceMonth(g,world);assert.equal(g.turn,12);const raw=snapshot(g);assert.equal(worldForSave(raw,legacy,atlas,world),world);g=restoreGame(raw,world);assert.equal(g.mapVersion,EXPANDED_MAP_VERSION);assert.equal(g.player,'lanxang');assert.equal(g.turn,12);assert.ok(Number.isFinite(g.factions.lanxang.treasury));assert.throws(()=>restoreGame(raw,atlas));});

test('denser atlas initializes every district and runs a saved campaign',{timeout:120000},()=>{const dense=densifyHistoricalWorld(world);let g=createGame(dense,'england');assert.equal(Object.keys(g.provinces).length,dense.provinces.length);for(const p of dense.provinces){assert.ok(g.civic.provinces[p.id]);assert.ok(g.economy.provinces[p.id]);}for(let i=0;i<6;i++)advanceMonth(g,dense);g=restoreGame(snapshot(g),dense);assert.equal(g.mapVersion,DENSE_MAP_VERSION);assert.equal(g.turn,6);assert.ok(Number.isFinite(empireStats(g,'england').taxIncome));});
