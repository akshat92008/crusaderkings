import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';import {createGame,snapshot,restoreGame} from '../src/simulation.js';import {feudalHierarchy,obligationProfile,creditEstateIncome} from '../src/feudal-obligations.js';import {politicsAction,politicalRevenue,tickPolitics} from '../src/dynastic-politics.js';
const world=JSON.parse(readFileSync(new URL('../data/world.json',import.meta.url)));
test('subordinate estates pay a regional lord from generated estate income without duplicating gold',()=>{const g=createGame(world,'ming'),r=g.player,h=feudalHierarchy(g,r),sub=Object.values(h.byHolding).find(x=>x.kind==='indirect');assert.ok(sub);const recipient=h.byLord[sub.liege].holdings[0],a=g.politics.holdings[sub.id],b=g.politics.holdings[recipient],total=a.wealth+b.wealth,treasury=g.factions[r].treasury;const amount=100,share=creditEstateIncome(g,sub.id,amount,h);assert.ok(share>0);assert.equal(a.wealth+b.wealth,total+amount);assert.equal(g.factions[r].treasury,treasury);assert.ok(obligationProfile(g,r,h).indirectShare>0);});
test('contract changes still affect crown revenue under hierarchical obligations',()=>{const g=createGame(world,'ming'),r=g.player,h=Object.values(feudalHierarchy(g,r).byHolding).find(x=>x.kind!=='domain'),before=politicalRevenue(g,r);assert.ok(politicsAction(g,world,'tax',h.id,0).ok);assert.ok(politicalRevenue(g,r)<before);});

test('tax and levy exemptions change separate obligations, survive saves, and require consent to revoke',()=>{
 const g=createGame(world,'ming'),realm=g.player;
 const hierarchy=feudalHierarchy(g,realm);
 const row=Object.values(hierarchy.byHolding).find(x=>x.kind==='indirect');
 const id=row.id,holding=g.politics.holdings[id];
 holding.loyalty=75;
 const before=obligationProfile(g,realm,hierarchy);
 assert.ok(politicsAction(g,world,'charter-grant',id,'tax').ok);
 assert.ok(obligationProfile(g,realm,hierarchy).tax<before.tax);
 assert.equal(creditEstateIncome(g,id,100,hierarchy),0);
 assert.equal(politicsAction(g,world,'tax',id,2).ok,false);
 assert.equal(politicsAction(g,world,'charter-grant',id,'levy').ok,false);

 const copy=restoreGame(snapshot(g),world);
 const saved=copy.politics.holdings[id];
 assert.equal(saved.exemptions.tax,true);
 saved.loyalty=100;
 copy.turn=24;
 const beforeLevy=obligationProfile(copy,realm);
 assert.ok(politicsAction(copy,world,'charter-grant',id,'levy').ok);
 const afterLevy=obligationProfile(copy,realm);
 assert.ok(afterLevy.levy<beforeLevy.levy);
 assert.equal(afterLevy.tax,beforeLevy.tax);

 copy.turn=48;
 copy.factions[realm].legitimacy=59;
 assert.equal(politicsAction(copy,world,'charter-revoke',id,'levy').ok,false);
 copy.factions[realm].legitimacy=80;
 assert.ok(politicsAction(copy,world,'charter-revoke',id,'levy').ok);
 assert.equal(copy.factions[realm].legitimacy,70);
 assert.equal(saved.loyalty,75);
 assert.equal(saved.exemptions.levy,undefined);
});

test('a cash-poor AI ruler can exchange a levy exemption for relief from an estate crisis',()=>{
 const g=createGame(world,'joseon'),realm='ming';
 const [,estate]=Object.entries(g.politics.holdings).find(([,h])=>h.realm===realm);
 estate.loyalty=2;
 estate.autonomy=2;
 g.factions[realm].treasury=100;
 g.turn=3;
 tickPolitics(g,world);
 assert.equal(estate.exemptions.levy,true);
 assert.ok(estate.loyalty>20);
 assert.equal(g.factions[realm].treasury,100);
});
