import assert from 'node:assert/strict';
import test from 'node:test';
import {readFileSync} from 'node:fs';
import {createGame,recruit,recruitmentQuote} from '../src/simulation.js';
const world=JSON.parse(readFileSync(new URL('../data/world.json',import.meta.url)));
test('displayed recruitment quote exactly matches gold and troops charged',()=>{const g=createGame(world,'ottomans'),p=Object.values(g.provinces).find(p=>p.owner===g.player);g.factions[g.player].treasury=10000;for(const t of ['infantry','archers','cavalry']){const before=g.factions[g.player].treasury,count=Object.values(g.armies).filter(a=>a.owner===g.player).reduce((n,a)=>n+a[t],0),q=recruitmentQuote(g,p.id,t);assert.ok(recruit(g,p.id,t).ok);assert.equal(before-g.factions[g.player].treasury,q.cost);assert.equal(Object.values(g.armies).filter(a=>a.owner===g.player).reduce((n,a)=>n+a[t],0)-count,q.count);}});
