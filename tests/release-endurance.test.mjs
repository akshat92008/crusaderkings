import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {buildHistoricalWorld,expandHistoricalWorld,densifyHistoricalWorld} from '../src/historical-world.js';
import {createGame,advanceMonth,snapshot,restoreGame,empireStats} from '../src/simulation.js';
import {validatePortableSave} from '../src/portable-save.js';
const read=n=>JSON.parse(readFileSync(new URL('../data/'+n,import.meta.url)));
const world=densifyHistoricalWorld(expandHistoricalWorld(buildHistoricalWorld(read('world.json'),read('historical-polities-1450.json'))));
for(const [realm,difficulty] of [['england','normal'],['vijayanagara','hard']])test('Release endurance on dense atlas: '+realm,{timeout:240000},()=>{let g=createGame(world,realm);g.kingdom.difficulty=difficulty;for(let i=0;i<60;i++){advanceMonth(g,world);assert.equal(g.turn,i+1);for(const f of Object.values(g.factions)){assert.ok(Number.isFinite(f.treasury)&&Number.isFinite(f.food)&&Number.isFinite(f.stability));}for(const a of Object.values(g.armies)){assert.ok(g.provinces[a.province]);assert.ok(['infantry','archers','cavalry'].every(t=>Number.isInteger(a[t])&&a[t]>=0));}if(i%12===11){const raw=snapshot(g);validatePortableSave(raw);g=restoreGame(raw,world);assert.equal(g.turn,i+1);}}assert.ok(Number.isFinite(empireStats(g,realm).balance));});
