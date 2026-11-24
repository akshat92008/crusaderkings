import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createGame,snapshot,restoreGame} from '../src/simulation.js';
import {transferProvince} from '../src/campaign-war.js';
import {landlessAction,landlessView,tickLandless,renderLandless} from '../src/landless-systems.js';
const world=JSON.parse(readFileSync(new URL('../data/world.json',import.meta.url)));
function exile(player='ottomans'){
 const g=createGame(world,player),realm='ottomans',host='qara',ruler=g.politics.realms[realm].ruler;
 const domain=Object.values(g.provinces).filter(p=>p.owner===realm).map(p=>p.id);
 assert.ok(domain.length);for(const id of domain)assert.ok(transferProvince(g,id,host));
 g.factions[host].treasury=10000;g.factions[host].relations[realm]=0;
 return {g,realm,host,ruler,domain};
}
test('landless continuation uses canonical ruler and exact gold transfers, then restores a real title',()=>{
 const {g,realm,host,ruler,domain}=exile(),p=g.politics.people[ruler];
 const start=p.wealth,treasury=g.factions[host].treasury;
 assert.ok(landlessView(g,world).hosts.some(x=>x.id===host));
 assert.match(renderLandless(g,world,String),/COURT IN EXILE/);
 assert.equal(landlessAction(g,world,'asylum',host).ok,true);
 assert.equal(landlessAction(g,world,'restore',domain[0]).ok,false);
 for(let i=0;i<6;i++){g.turn=i*3;assert.equal(landlessAction(g,world,'service').ok,true);assert.equal(landlessAction(g,world,'service').ok,false);}
 assert.equal(p.wealth,start+240);assert.equal(g.factions[host].treasury,treasury-240);
 assert.ok(landlessView(g,world).support>=60);
 const restored=restoreGame(snapshot(g),world);
 assert.equal(restored.landless.realms[realm].host,host);
 assert.equal(restored.landless.realms[realm].support,g.landless.realms[realm].support);
 assert.equal(landlessAction(restored,world,'restore',domain[0]).ok,true);
 assert.equal(restored.provinces[domain[0]].owner,realm);
 assert.equal(restored.politics.holdings[domain[0]].realm,realm);
 assert.equal(restored.feudal.titles['c:'+domain[0]].realm,realm);
 assert.equal(restored.politics.realms[realm].ruler,ruler);
 assert.equal(restored.politics.people[ruler].wealth,start+120);
 assert.equal(restored.factions[host].treasury,treasury-120);
 assert.equal(landlessView(restored,world),null);
});
test('landed rulers cannot collect exile service wages',()=>{
 const g=createGame(world);const before=snapshot(g);
 assert.equal(landlessAction(g,world,'asylum','qara').ok,false);
 assert.equal(landlessAction(g,world,'service').ok,false);
 assert.equal(snapshot(g),before);
});
test('foreign patron must be willing and free; a lost court cannot be exploited',()=>{
 const {g,realm,host}=exile();g.factions[host].relations[realm]=-10;
 assert.equal(landlessAction(g,world,'asylum',host).ok,false);
 g.factions[host].relations[realm]=0;
 assert.equal(landlessAction(g,world,'asylum',host).ok,true);
 g.factions[host].treasury=39;
 assert.equal(landlessAction(g,world,'service').ok,false);
 g.factions[host].relations[realm]=-5;g.turn++;
 tickLandless(g,world);
 assert.equal(g.landless.realms[realm].host,null);
});
test('AI landless rulers autonomously seek patrons and can restore land',()=>{
 const {g,realm,host,domain}=exile('england');
 for(let month=3;month<=30;month+=3){g.turn=month;tickLandless(g,world);}
 assert.ok(domain.some(id=>g.provinces[id].owner===realm));
 assert.ok(g.landless.history.some(x=>x.realm===realm&&x.text.includes('negotiated restoration')));
});
test('legacy save without exile metadata gets initialized',()=>{
 const {g,realm,domain}=exile();delete g.landless;
 const restored=restoreGame(snapshot(g),world);
 assert.ok(restored.landless.realms[realm].lastDomain.includes(domain[0]));
 assert.ok(landlessView(restored,world));
});
