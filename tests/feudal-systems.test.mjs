import assert from 'node:assert/strict';
import test from 'node:test';
import {readFileSync} from 'node:fs';
import {createGame,snapshot,restoreGame,concludeBattle} from '../src/simulation.js';
import {politicsAction,tickPolitics} from '../src/dynastic-politics.js';
import {councilVotes,conflictAction,tickConflict} from '../src/political-conflict.js';
import {militaryAction} from '../src/military-systems.js';
import {titleList,syncTitles,feudalAction,regionalLoyalty,partitionInheritance,claimantCandidates,isImprisoned,captureCommander,capturePrisoner,prisonerExchangeOptions,tickFeudal,regionalTitleCandidates} from '../src/feudal-systems.js';
import {renderFeudal} from '../src/kingdom-ui.js';
const world=JSON.parse(readFileSync(new URL('../data/world.json',import.meta.url)));
const start=(realm='ming')=>{const g=createGame(world,realm);g.factions[realm].treasury=10000;g.factions[realm].legitimacy=85;return g;};
const holdings=g=>Object.entries(g.politics.holdings).filter(([id,h])=>h.realm===g.player);
const sovereign=g=>g.politics.people[g.politics.realms[g.player].ruler];
test('every provincial title belongs to a regional title beneath its crown',()=>{const g=start();for(const [id,h] of Object.entries(g.politics.holdings)){const t=g.feudal.titles['c:'+id],d=g.feudal.titles[t.parent];assert.equal(t.holder,h.lord);assert.equal(d.tier,'regional');assert.equal(g.feudal.titles[d.parent].tier,'crown');assert.ok(d.members.includes(id));}assert.ok(titleList(g,'ming').length>3);});
test('provincial titles can be reclaimed with evidence and granted without annexing land',()=>{const g=start(),r=sovereign(g),[id,h]=holdings(g)[0],old=h.lord;assert.equal(feudalAction(g,world,'reclaim','c:'+id).ok,false);h.leverageUntil=20;assert.ok(feudalAction(g,world,'reclaim','c:'+id).ok);assert.equal(h.lord,r.id);assert.equal(h.loyalty,100);assert.ok(feudalAction(g,world,'grant','c:'+id,old).ok);assert.equal(h.lord,old);assert.equal(g.provinces[id].owner,'ming');assert.equal(g.feudal.titles['c:'+id].holder,old);});
test('regional appointment changes subordinate political loyalty',()=>{const g=start(),d=titleList(g,'ming').find(t=>t.tier==='regional'&&t.members.length>1);assert.ok(d);const chosen=d.members.map(id=>g.politics.holdings[id]).find(h=>h.lord!==d.holder);chosen.loyalty=90;assert.ok(feudalAction(g,world,'regional',d.id,chosen.lord).ok);assert.equal(g.feudal.titles[d.id].holder,chosen.lord);assert.ok(regionalLoyalty(g,d.members[0])>0);syncTitles(g);assert.equal(g.feudal.titles[d.id].holder,chosen.lord);});
test('partition distributes direct domain to surviving children while crown passes to eldest',()=>{const g=start(),r=sovereign(g),s=g.politics.realms.ming,kids=r.children.map(id=>g.politics.people[id]).sort((a,b)=>b.age-a.age);kids[0].age=30;kids[1].age=25;const selected=holdings(g).slice(0,3).sort(([a],[b])=>a.localeCompare(b));assert.ok(selected.length>=2);for(const [,h] of selected)h.lord=r.id;assert.ok(politicsAction(g,world,'law','partition').ok);r.age=95;g.turn=12;tickPolitics(g,world);assert.equal(s.ruler,kids[0].id);assert.equal(selected[0][1].lord,kids[0].id);assert.ok(selected.some(([,h])=>h.lord===kids[1].id));assert.ok(claimantCandidates(g,'ming').some(x=>x.person===kids[1].id));});
test('a claimant faction can install its adult candidate on accepting demands',()=>{const g=start(),r=sovereign(g),c=g.politics.people[r.children[0]];c.age=30;g.feudal.claimants['ming:'+c.id]={realm:'ming',person:c.id,from:r.id,created:0};g.factions.ming.legitimacy=30;for(const [,h] of holdings(g))h.loyalty=10;g.turn=3;tickConflict(g,world);const faction=Object.values(g.conflict.factions).find(x=>x.realm==='ming');assert.equal(faction.kind,'claimant');assert.equal(faction.claimant,c.id);assert.ok(conflictAction(g,world,'accept',faction.id).ok);assert.equal(g.politics.realms.ming.ruler,c.id);assert.equal(g.feudal.titles['k:ming'].holder,c.id);});
test('arrest requires evidence and ransom transfers actual personal funds',()=>{const g=start(),[id,h]=holdings(g)[0],person=g.politics.people[h.lord],f=g.factions.ming;assert.equal(feudalAction(g,world,'arrest',person.id).ok,false);h.leverageUntil=24;assert.ok(feudalAction(g,world,'arrest',person.id).ok);assert.ok(isImprisoned(g,person.id));const cash=f.treasury,wealth=person.wealth;assert.ok(feudalAction(g,world,'ransom',person.id).ok);assert.equal(f.treasury,cash+100);assert.equal(person.wealth,wealth-100);assert.equal(isImprisoned(g,person.id),false);});
test('defeated army commanders can be captured and cannot vote or command',()=>{const g=start(),a=Object.values(g.armies).find(a=>a.owner==='ming'),id=g.politics.realms.ming.council.marshal;assert.ok(militaryAction(g,world,'commander',a.id,id).ok);assert.ok(captureCommander(g,'joseon',a));assert.ok(isImprisoned(g,id));assert.equal(g.military.armies[a.id].commander,null);assert.equal(militaryAction(g,world,'commander',a.id,id).ok,false);assert.equal(councilVotes(g,'ming').some(v=>v.id===id),false);const copy=restoreGame(snapshot(g),world);assert.ok(isImprisoned(copy,id));});
test('older saves migrate title records and UI exposes hierarchy and prisoners',()=>{const g=start();delete g.feudal;const copy=restoreGame(snapshot(g),world);assert.ok(copy.feudal.titles['k:ming']);const html=renderFeudal(copy,world,String);assert.ok(html.includes('TITLE HIERARCHY'));assert.ok(html.includes('PRISONERS AND RANSOM'));});


test('foreign prisoner exchanges release both captives and settle unequal ranks once',()=>{
 const g=start(),ourRealm=g.player,foreignRealm='joseon';
 const marshal=g.politics.realms[ourRealm].council.marshal;
 const foreigner=Object.values(g.politics.people).find(p=>p.realm===foreignRealm&&p.age>=18&&p.id!==g.politics.realms[foreignRealm].ruler&&
  !Object.values(g.politics.realms[foreignRealm].council).includes(p.id)&&!Object.values(g.politics.holdings).some(h=>h.lord===p.id));
 assert.ok(capturePrisoner(g,ourRealm,foreigner.id));
 assert.ok(capturePrisoner(g,foreignRealm,marshal));
 assert.deepEqual(prisonerExchangeOptions(g,ourRealm,foreigner.id),[{id:marshal,partner:foreignRealm,gold:35}]);
 assert.match(renderFeudal(g,world,String),/Exchange prisoners/);

 const copy=restoreGame(snapshot(g),world),f=copy.factions[ourRealm],other=copy.factions[foreignRealm];
 f.treasury=34;
 const before=other.treasury;
 assert.equal(feudalAction(copy,world,'exchange',foreigner.id,marshal).ok,false);
 assert.ok(isImprisoned(copy,marshal)&&isImprisoned(copy,foreigner.id));
 f.treasury=100;
 assert.ok(feudalAction(copy,world,'exchange',foreigner.id,marshal).ok);
 assert.equal(f.treasury,65);
 assert.equal(other.treasury,before+35);
 assert.ok(!isImprisoned(copy,marshal)&&!isImprisoned(copy,foreigner.id));
 assert.equal(feudalAction(copy,world,'exchange',foreigner.id,marshal).ok,false);
 assert.equal(other.treasury,before+35);
});

test('transferring a provincial title does not transfer evidence of its former holder\'s misconduct',()=>{
 const g=start(),r=sovereign(g),[id,h]=holdings(g)[0],old=h.lord;
 h.leverageUntil=48;assert.ok(feudalAction(g,world,'reclaim','c:'+id).ok);
 assert.equal(h.leverageUntil,undefined);
 assert.ok(feudalAction(g,world,'grant','c:'+id,old).ok);
 assert.equal(feudalAction(g,world,'reclaim','c:'+id).ok,false);
 assert.equal(feudalAction(g,world,'arrest',old).ok,false);
 const copy=restoreGame(snapshot(g),world);
 assert.equal(copy.politics.holdings[id].leverageUntil,undefined);
});
test('regional appointments only offer different free adults with controlled district estates',()=>{
 const g=start(),t=titleList(g,g.player).find(t=>t.tier==='regional'&&regionalTitleCandidates(g,g.player,t.id).length);
 assert.ok(t);
 const chosen=regionalTitleCandidates(g,g.player,t.id)[0],cash=g.factions[g.player].treasury;
 assert.ok(!regionalTitleCandidates(g,g.player,t.id).some(p=>p.id===t.holder));
 assert.ok(feudalAction(g,world,'regional',t.id,chosen.id).ok);
 assert.equal(g.factions[g.player].treasury,cash-120);
 assert.equal(feudalAction(g,world,'regional',t.id,chosen.id).ok,false);
 assert.equal(g.factions[g.player].treasury,cash-120);
});
