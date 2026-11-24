import assert from 'node:assert/strict';
import test from 'node:test';
import {readFileSync} from 'node:fs';
import {createGame,advanceMonth,snapshot,restoreGame,startMarch,concludeBattle} from '../src/simulation.js';
import {politicsAction} from '../src/dynastic-politics.js';
import {initConflict,councilVotes,councilPermission,conflictAction,tickConflict,availableClaims,activeWar,hasTruce,civilWarForces} from '../src/political-conflict.js';
import {renderConflict} from '../src/kingdom-ui.js';
const world=JSON.parse(readFileSync(new URL('../data/world.json',import.meta.url)));
const start=()=>{const g=createGame(world,'england');g.factions.england.treasury=10000;g.factions.england.legitimacy=80;return g;};
const owned=g=>Object.values(g.provinces).find(p=>p.owner===g.player).id;
const foreign=g=>Object.values(g.provinces).find(p=>p.owner!==g.player&&g.politics.realms[p.owner]).id;
test('council authority, binding votes and paid favors',()=>{const g=start(),f=g.factions.england;assert.ok(conflictAction(g,world,'council','binding').ok);f.legitimacy=10;f.stability=10;assert.equal(councilPermission(g,g.player,'law'),false);assert.equal(politicsAction(g,world,'law','youngest').ok,false);for(const v of councilVotes(g,g.player))assert.ok(conflictAction(g,world,'favor',v.id).ok);assert.ok(councilPermission(g,g.player,'law'));});
test('schemes finish on schedule and establish persistent claims',()=>{const g=start(),id=foreign(g);assert.ok(conflictAction(g,world,'scheme','fabricate',id).ok);assert.equal(conflictAction(g,world,'scheme','sway',owned(g)).ok,false);g.conflict.seed=0;g.turn=9;tickConflict(g,world);assert.ok(availableClaims(g,g.player).some(x=>x.province===id));assert.ok(availableClaims(restoreGame(snapshot(g),world),g.player).some(x=>x.province===id));});
test('claims declare formal wars, battle victory allows peace and truce',()=>{const g=start(),id=foreign(g),other=g.provinces[id].owner;g.conflict.claims[g.player+':'+id]={realm:g.player,province:id,expires:120};assert.ok(conflictAction(g,world,'declare',id).ok);let w=activeWar(g,g.player,other);assert.ok(w);assert.equal(conflictAction(g,world,'peace',w.id,'enforce').ok,false);const a=Object.values(g.armies).find(x=>x.owner===g.player);concludeBattle(g,{attacker:a.id,to:id},{victory:true,attackerRemaining:.8});assert.ok(w.score>=65);assert.ok(conflictAction(g,world,'peace',w.id,'enforce').ok);assert.ok(hasTruce(g,g.player,other));assert.equal(activeWar(g,g.player,other),undefined);});
test('vassal opposition escalates to ultimatum, then civil war and a negotiated settlement',()=>{const g=start();for(const [id,v] of Object.entries(g.politics.holdings))if(v.realm===g.player){v.loyalty=10;v.tax=2;}for(let i=3;i<=45;i+=3){g.turn=i;tickConflict(g,world);if(Object.values(g.conflict.factions).some(x=>x.realm===g.player&&x.status==='ultimatum'))break;}const x=Object.values(g.conflict.factions).find(x=>x.realm===g.player);assert.equal(x.status,'ultimatum');assert.ok(conflictAction(g,world,'refuse',x.id).ok);assert.equal(x.status,'civil war');assert.ok(conflictAction(g,world,'mobilize',x.id).ok);assert.equal(conflictAction(g,world,'mobilize',x.id).ok,false);assert.ok(conflictAction(g,world,'accept',x.id).ok);assert.equal(x.status,'concessions');for(const id of x.members)assert.equal(g.politics.holdings[id].tax,0);});
test('old saves initialize conflict state and politics screen exposes working controls',()=>{const g=start();delete g.conflict;const restored=restoreGame(snapshot(g),world);assert.ok(restored.conflict);const html=renderConflict(restored,world,s=>String(s));assert.ok(html.includes('COUNCIL AUTHORITY'));assert.ok(html.includes('TERRITORIAL CLAIMS'));assert.ok(html.includes('data-action="conflict"'));});
test('AI and faction simulation remain serializable over 30 years',()=>{const g=start();for(let i=0;i<360;i++)advanceMonth(g,world);assert.ok(Number.isFinite(g.factions.england.treasury));assert.ok(g.conflict.history.length>0);assert.equal(restoreGame(snapshot(g),world).turn,360);});

test('civil war only uses local non-embarked armies and never damages distant troops',()=>{
 const g=start(),a=Object.values(g.armies).find(a=>a.owner===g.player),id=a.province;
 const remote=Object.values(g.provinces).find(p=>p.owner!==g.player).id;
 g.armies.remote={...a,id:'remote',province:remote,infantry:6000};g.armies.atsea={...a,id:'atsea',infantry:6000};
 g.naval.voyages.atsea={army:'atsea'};
 const x={id:'test',realm:g.player,kind:'liberty',status:'civil war',members:[id],rebels:300,score:0,months:0,pressure:100};g.conflict.factions.test=x;
 const nearby=civilWarForces(g,x,world);assert.ok(nearby.forces.some(v=>v.id===a.id));assert.ok(!nearby.forces.some(v=>['remote','atsea'].includes(v.id)));
 assert.ok(conflictAction(g,world,'mobilize',x.id).ok);assert.equal(g.armies.remote.infantry,6000);assert.equal(g.armies.atsea.infantry,6000);assert.equal(x.lastRound,g.turn);
 assert.equal(conflictAction(g,world,'mobilize',x.id).ok,false);
});
test('rebels cannot suffer imaginary casualties from a royal army that is absent',()=>{
 const g=start(),a=Object.values(g.armies).find(a=>a.owner===g.player),id=a.province,remote=Object.values(g.provinces).find(p=>p.owner!==g.player).id;
 for(const army of Object.values(g.armies))if(army.owner===g.player)army.province=remote;
 const x={id:'test',realm:g.player,kind:'liberty',status:'civil war',members:[id],rebels:300,score:0,months:0,pressure:100};g.conflict.factions.test=x;
 assert.equal(civilWarForces(g,x,world).troops,0);assert.ok(conflictAction(g,world,'mobilize',x.id).ok);assert.equal(x.rebels,300);assert.equal(x.score,-20);
});
