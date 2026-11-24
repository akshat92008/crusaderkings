import assert from 'node:assert/strict';
import test from 'node:test';
import {readFileSync} from 'node:fs';
import {createGame,restoreGame,snapshot} from '../src/simulation.js';
import {removePoliticalCharacter,successionPreview} from '../src/dynastic-politics.js';
import {feudalAction,syncTitles,tickFeudal} from '../src/feudal-systems.js';
import {estateCharterTerms,estateLaw,estateSuccession} from '../src/estate-succession.js';
import {renderProvinceLord} from '../src/kingdom-ui.js';

const world=JSON.parse(readFileSync(new URL('../data/world.json',import.meta.url)));
const change=(g,id,law)=>feudalAction(g,world,'estate-law','c:'+id,law);
const realm='ming';
function fixture(player=realm){
 const g=createGame(world,player);
 const ruler=g.politics.realms[realm].ruler;
 const ids=Object.keys(g.politics.holdings).filter(id=>g.politics.holdings[id].realm===realm);
 const id=ids.find(id=>g.feudal.titles[g.feudal.titles['c:'+id].parent].members.length>=2);
 assert.ok(id);
 const holder=g.politics.people[g.politics.holdings[id].lord];
 const child=g.politics.people[holder.children[0]];
 child.age=23;
 g.factions[realm].treasury=2500;
 g.factions[realm].legitimacy=85;
 return {g,id,holder,child,ruler,ids};
}

test('a separate estate charter survives save/load and keeps personal and crown inheritance independent',()=>{
 const {g,id,holder,child,ruler,ids}=fixture();
 const second=ids.find(x=>x!==id);
 g.politics.holdings[second].lord=holder.id;
 syncTitles(g);
 const crownHeir=successionPreview(g,realm).id;
 const cash=g.factions[realm].treasury;
 assert.equal(estateLaw(g,id),'customary');
 assert.match(renderProvinceLord(g,world,id,String),/Amend succession/);
 assert.ok(change(g,id,'reversion').ok);
 assert.equal(g.factions[realm].treasury,cash-75);
 assert.equal(change(g,id,'seniority').ok,false);
 assert.equal(estateSuccession(g,id).heir.id,ruler);
 const copy=restoreGame(snapshot(g),world);
 assert.equal(estateLaw(copy,id),'reversion');
 const personal=copy.politics.people[child.id].wealth;
 assert.ok(removePoliticalCharacter(copy,world,holder.id));
 assert.equal(copy.feudal.titles['c:'+id].holder,ruler);
 assert.equal(copy.politics.holdings[second].lord,child.id);
 assert.equal(copy.politics.people[child.id].wealth,personal+holder.wealth);
 assert.equal(successionPreview(copy,realm).id,crownHeir);
});

test('district elections preview and transfer the title using the same ballots',()=>{
 const {g,id,holder,child}=fixture();
 const district=g.feudal.titles[g.feudal.titles['c:'+id].parent];
 const other=district.members.find(i=>i!==id);
 const peer=g.politics.people[g.politics.holdings[other].lord];
 peer.skills.stewardship=6;
 child.skills.stewardship=1;
 assert.ok(change(g,id,'elective').ok);
 const before=estateSuccession(g,id);
 assert.ok(before.ballots.length>=2);
 assert.equal(estateSuccession(g,id).heir.id,before.heir.id);
 assert.match(renderProvinceLord(g,world,id,String),/would vote for/);
 assert.ok(removePoliticalCharacter(g,world,holder.id));
 assert.equal(g.feudal.titles['c:'+id].holder,before.heir.id);
});

test('house seniority ignores imprisoned candidates and uses the oldest eligible house member',()=>{
 const {g,id,holder,child}=fixture();
 const elder=g.politics.people[g.politics.realms[realm].council.steward];
 elder.house=holder.house;
 elder.age=62;
 assert.ok(change(g,id,'seniority').ok);
 assert.equal(estateSuccession(g,id).heir.id,elder.id);
 g.feudal.prisoners[elder.id]={status:'held'};
 assert.equal(estateSuccession(g,id).heir.id,child.id);
 assert.ok(removePoliticalCharacter(g,world,holder.id));
 assert.equal(g.politics.holdings[id].lord,child.id);
});

test('the AI obtains reversion only under a qualified ruler with leverage',()=>{
 const {g,id,ruler}=fixture('joseon');
 const holder=g.politics.holdings[id];
 g.authority.realms[realm].level=2;
 g.politics.people[ruler].traits=['ambitious'];
 holder.loyalty=40;
 g.turn=12;
 tickFeudal(g,world);
 assert.equal(estateLaw(g,id),'customary');
 holder.leverageUntil=60;
 g.turn=24;
 g.campaignWar.occupations[id]={by:'joseon'};
 assert.equal(estateCharterTerms(g,realm,id),null);
 tickFeudal(g,world);
 assert.equal(estateLaw(g,id),'customary');
 delete g.campaignWar.occupations[id];
 g.turn=36;
 tickFeudal(g,world);
 assert.equal(estateLaw(g,id),'reversion');
});
