import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createGame,snapshot,restoreGame} from '../src/simulation.js';
import {transferProvince} from '../src/campaign-war.js';
import {landlessAction,landlessView,tickLandless,renderLandless} from '../src/landless-systems.js';
const world=JSON.parse(readFileSync(new URL('../data/world.json',import.meta.url)));
function fixture(){
 const g=createGame(world,'ottomans'),host='qara',realm=g.player,p=g.politics.people[g.politics.realms[realm].ruler];
 for(const pr of Object.values(g.provinces).filter(q=>q.owner===realm))assert.ok(transferProvince(g,pr.id,host));
 g.factions[host].treasury=10000;g.factions[host].relations[realm]=0;
 Object.assign(p.skills,{stewardship:5,martial:5,diplomacy:5});
 assert.ok(landlessAction(g,world,'asylum',host).ok);
 return {g,p,host};
}
test('estate commission completes after three months, transfers real wages and affects target unrest',()=>{
 const {g,p,host}=fixture(),pr=Object.values(g.provinces).find(q=>q.owner===host);pr.unrest=35;
 const options=landlessView(g,world).contracts;
 const c=options.find(x=>x.kind==='administration');assert.ok(c);
 const q=g.provinces[c.target],unrest=q.unrest,wealth=p.wealth,treasury=g.factions[host].treasury;
 assert.ok(landlessAction(g,world,'contract',c.kind+'|'+c.target).ok);
 assert.equal(landlessAction(g,world,'service').ok,false);
 assert.equal(landlessAction(g,world,'contract',c.kind+'|'+c.target).ok,false);
 g.turn=2;tickLandless(g,world);assert.equal(p.wealth,wealth);assert.equal(q.unrest,unrest);
 const restored=restoreGame(snapshot(g),world);assert.match(renderLandless(restored,world,String),/Commission:/);
 restored.turn=3;tickLandless(restored,world);
 assert.equal(restored.provinces[c.target].unrest,Math.max(0,unrest-12));
 assert.equal(restored.politics.people[p.id].wealth,wealth+65);assert.equal(restored.factions[host].treasury,treasury-65);
 assert.equal(landlessView(restored,world).lastContract.status,'completed');
 assert.equal(landlessView(restored,world).support,18);assert.equal(landlessView(restored,world).contract,null);
 tickLandless(restored,world);assert.equal(restored.politics.people[p.id].wealth,wealth+65);
});
test('army commission modifies actual host army readiness and no new soldiers',()=>{
 const {g,p,host}=fixture(),a=Object.values(g.armies).find(q=>q.owner===host);
 a.experience=.1;a.morale=60;const troops=[a.infantry,a.archers,a.cavalry],wealth=p.wealth;
 assert.ok(landlessAction(g,world,'contract','drill|'+a.id).ok);
 g.turn=3;tickLandless(g,world);
 assert.ok(Math.abs(a.experience-.15)<1e-9);assert.equal(a.morale,66);
 assert.deepEqual([a.infantry,a.archers,a.cavalry],troops);assert.equal(p.wealth,wealth+70);
});
test('diplomatic commission improves actual bilateral relations without signing a treaty',()=>{
 const {g,p,host}=fixture();const c=landlessView(g,world).contracts.find(x=>x.kind==='embassy');assert.ok(c);
 const before=g.factions[host].relations[c.target]??0,reverse=g.factions[c.target].relations[host]??0,wealth=p.wealth;
 const treaty=g.factions[host].treaties[c.target];
 assert.ok(landlessAction(g,world,'contract','embassy|'+c.target).ok);
 g.turn=4;tickLandless(g,world);
 assert.equal(g.factions[host].relations[c.target],Math.min(100,before+12));assert.equal(g.factions[c.target].relations[host],Math.min(100,reverse+6));
 assert.equal(g.factions[host].treaties[c.target],treaty);assert.equal(p.wealth,wealth+80);
});
test('lost patron or missing target cancels a commission without paying wages',()=>{
 const {g,p,host}=fixture(),a=Object.values(g.armies).find(q=>q.owner===host);
 a.experience=.1;a.morale=60;
 assert.ok(landlessAction(g,world,'contract','drill|'+a.id).ok);
 const wealth=p.wealth,treasury=g.factions[host].treasury;
 delete g.armies[a.id];g.turn=3;tickLandless(g,world);
 assert.equal(landlessView(g,world).lastContract.status,'cancelled');assert.equal(p.wealth,wealth);assert.equal(g.factions[host].treasury,treasury);
});
