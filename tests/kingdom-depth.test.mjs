import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import test from 'node:test';
import {createGame,advanceMonth,empireStats,negotiate,snapshot,restoreGame} from '../src/simulation.js';
import {initializeKingdomSystems,currentCourt,courtDecision,royalDiplomacy,tradeIncome,currentRoyalEvent,resolveRoyalEvent,objectives,campaignStanding,tradePactCount,EVENTS} from '../src/kingdom-depth.js';
const world=JSON.parse(readFileSync(new URL('../data/world.json',import.meta.url)));

test('all 44 factions have distinct fictional rulers, heirs and generated royal houses',()=>{
 const g=createGame(world);const ids=world.factions.map(f=>f.id);
 assert.equal(Object.keys(g.kingdom.courts).length,44);
 for(const id of ids){const c=g.kingdom.courts[id];assert.ok(c.dynasty.startsWith('House of '));assert.ok(c.ruler.name.length>4);assert.ok(c.heir.age<30);}
 assert.equal(g.kingdom.version,1);
});
test('royal audience, stewardship and marshalship cost money and obey limits',()=>{
 const g=createGame(world),f=g.factions.ottomans,c=currentCourt(g);f.treasury=10000;
 const first=f.treasury;
 // Training is intentionally capped at five; select a trainable fixture.
 const council=g.politics.realms.ottomans.council,steward=g.politics.people[council.steward],marshal=g.politics.people[council.marshal];
 steward.skills.stewardship=3;marshal.skills.martial=3;c.steward=3;c.marshal=3;
 assert.ok(courtDecision(g,world,'audience').ok);
 assert.equal(courtDecision(g,world,'audience').ok,false);
 assert.ok(courtDecision(g,world,'steward').ok);
 assert.ok(courtDecision(g,world,'marshal').ok);
 assert.ok(f.treasury<first);
 assert.equal(c.steward,4);assert.equal(steward.skills.stewardship,4);assert.equal(marshal.skills.martial,4);
 assert.ok(courtDecision(g,world,'steward').ok);assert.equal(c.steward,5);const goldAtCap=f.treasury;assert.equal(courtDecision(g,world,'steward').ok,false);assert.equal(f.treasury,goldAtCap);
 assert.ok(courtDecision(g,world,'chronicle').ok);
 assert.ok(courtDecision(g,world,'succession').ok);
});
test('merchant treaty requires relations and creates measurable monthly trade income',()=>{
 const g=createGame(world);const f=g.factions.ottomans;f.treasury=10000;
 assert.equal(negotiate(g,'france','trade',world).ok,false);
 f.relations.france=25;
 assert.ok(negotiate(g,'france','trade',world).ok);
 assert.equal(tradePactCount(g),1);
 assert.ok(tradeIncome(g,'ottomans')>0);
 const before=empireStats(g,'ottomans');assert.equal(before.trade,tradeIncome(g,'ottomans'));
 const prev=f.treasury;advanceMonth(g,world);
 assert.ok(f.treasury>prev-250,'income should contribute to monthly treasury');
 assert.equal(negotiate(g,'france','trade',world).ok,false);
});
test('royal marriage creates a mutual court tie and is not an ordinary military alliance',()=>{
 const g=createGame(world);const f=g.factions.ottomans;f.treasury=10000;f.relations.france=35;
 assert.ok(royalDiplomacy(g,world,'france','marriage').ok);
 assert.equal(f.treaties.france,'marriage');
 assert.equal(g.factions.france.treaties.ottomans,'marriage');
 assert.equal(royalDiplomacy(g,world,'france','marriage').ok,false);
});
test('royal narrative event offers two meaningful choices and saves the decision',()=>{
 const g=createGame(world);g.factions.ottomans.treasury=12000;
 for(let i=0;i<9;i++)advanceMonth(g,world);
 const e=currentRoyalEvent(g);assert.ok(e?.title);assert.equal(e.choices.length,2);
 assert.ok(resolveRoyalEvent(g,world,0).ok);
 assert.equal(currentRoyalEvent(g),null);
 assert.equal(g.kingdom.eventsResolved,1);
 const saved=restoreGame(snapshot(g),world);
 assert.equal(saved.kingdom.eventsResolved,1);
 assert.equal(saved.kingdom.choices.length,1);
});
test('decision responses reject invalid costs and preserve pending events',()=>{
 const g=createGame(world);g.kingdom.pendingEvent={id:'festival',created:0};g.factions.ottomans.treasury=0;
 assert.equal(resolveRoyalEvent(g,world,0).ok,false);
 assert.ok(currentRoyalEvent(g));
 assert.equal(resolveRoyalEvent(g,world,1).ok,true);
 assert.equal(currentRoyalEvent(g),null);
 assert.equal(resolveRoyalEvent(g,world,3).ok,false);
});
test('campaign objectives and legacy score respond to actual realm progress',()=>{
 const g=createGame(world);
 const tasks=objectives(g);assert.equal(tasks.length,6);
 const before=campaignStanding(g).score;
 g.factions.ottomans.prestige+=120;g.factions.ottomans.treasury+=10000;g.factions.ottomans.tech=4;
 assert.ok(campaignStanding(g).score>before);
 g.year=1500;
 assert.equal(campaignStanding(g).ended,true);
});
test('existing version-one saves upgrade without losing the armies or court data',()=>{
 const g=createGame(world);const armyCount=Object.keys(g.armies).length;
 const legacy=JSON.parse(snapshot(g));delete legacy.kingdom;
 const restored=restoreGame(JSON.stringify(legacy),world);
 assert.equal(Object.keys(restored.armies).length,armyCount);
 assert.ok(currentCourt(restored)?.ruler);
});
test('AI and dynasty simulation remain deterministic and numerically stable for 200 turns',()=>{
 const a=createGame(world),b=createGame(world);
 for(let i=0;i<200;i++){advanceMonth(a,world);advanceMonth(b,world);}
 assert.equal(snapshot(a),snapshot(b));
 assert.equal(a.year,1466);
 for(const f of world.factions){
  assert.ok(Number.isFinite(a.factions[f.id].treasury));
  assert.ok(Number.isFinite(a.factions[f.id].stability));
  assert.ok(a.kingdom.courts[f.id].ruler.age>0);
 }
 assert.ok(Object.keys(a.kingdom.tradePacts).length>=1);
});
test('strategic AI does not unilaterally invade players with peaceful difficulty',()=>{
 const g=createGame(world);g.kingdom.difficulty='peaceful';
 for(let i=0;i<30;i++)advanceMonth(g,world);
 assert.equal(g.kingdom.threats.length,0);
});

test('all 23 court narratives can be resolved even if treasury is empty',()=>{
 assert.equal(EVENTS.length,23);
 assert.equal(new Set(EVENTS.map(e=>e.id)).size,EVENTS.length);
 for(const event of EVENTS){
  assert.ok(event.title&&event.description);
  assert.equal(event.choices.length,2);
  assert.ok(event.choices.some(choice=>!choice.cost),event.id);
  const g=createGame(world);g.factions.ottomans.treasury=0;g.kingdom.pendingEvent={id:event.id,created:g.turn};
  const ix=event.choices.findIndex(choice=>!choice.cost);
  assert.equal(resolveRoyalEvent(g,world,ix).ok,true,event.id);
  assert.equal(g.kingdom.eventsResolved,1);
 }
});
test('rival invasion alerts remain visible for three actual monthly ticks',()=>{
 const g=createGame(world);g.kingdom.difficulty='peaceful';
 const enemy=Object.values(g.armies).find(a=>a.owner==='france');
 const province=world.provinces.find(p=>p.owner==='ottomans');
 g.kingdom.threats=[{by:'france',army:enemy.id,province:province.id,eta:3}];
 advanceMonth(g,world);assert.equal(g.kingdom.threats[0].eta,2);
 advanceMonth(g,world);assert.equal(g.kingdom.threats[0].eta,1);
 advanceMonth(g,world);assert.equal(g.kingdom.threats.length,0);
});
