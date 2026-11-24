import assert from 'node:assert/strict';
import test from 'node:test';
import {readFileSync} from 'node:fs';
import {createGame,snapshot,restoreGame,empireStats} from '../src/simulation.js';
import {identityAction,identityModifiers,researchOptions,tickIdentity,TRADITIONS,INNOVATIONS,localIdentities} from '../src/identity-systems.js';
import {renderIdentity} from '../src/kingdom-ui.js';
const world=JSON.parse(readFileSync(new URL('../data/world.json',import.meta.url)));
const start=(realm='ming')=>{const g=createGame(world,realm);g.factions[realm].treasury=10000;g.factions[realm].prestige=100;return g;};
const province=g=>Object.values(g.provinces).find(p=>p.owner===g.player);
test('identity content initializes all realms and provinces and eight traditions and twelve innovations',()=>{const g=start();assert.equal(Object.keys(g.identity.realms).length,44);assert.equal(Object.keys(g.identity.institutions).length,299);assert.equal(Object.keys(TRADITIONS).length,8);assert.equal(Object.keys(INNOVATIONS).length,12);assert.equal(g.identity.realms.ming.traditions.length,2);});
test('traditions change actual fiscal yields and respect time and slot restrictions',()=>{const g=start(),before=empireStats(g,'ming').taxIncome;assert.ok(identityAction(g,world,'tradition','agrarian_stewardship').ok);assert.ok(empireStats(g,'ming').taxIncome>before);assert.equal(identityAction(g,world,'tradition','craft_guilds').ok,false);g.turn=60;assert.ok(identityAction(g,world,'tradition','craft_guilds').ok);g.turn=120;assert.equal(identityAction(g,world,'tradition','merchant_networks').ok,false);});
test('research advances with learning and unlocks prerequisites only on completion',()=>{const g=start(),s=g.identity.realms.ming;assert.equal(identityAction(g,world,'research','courts').ok,false);assert.ok(identityAction(g,world,'research','records').ok);assert.equal(identityAction(g,world,'research','logistics').ok,false);for(let t=3;t<=90;t+=3){g.turn=t;tickIdentity(g,world);}assert.ok(s.innovations.includes('records'));assert.ok(researchOptions(g,'ming').includes('courts'));assert.ok(identityModifiers(g,'ming').tax>1);});
test('local institutions strengthen trust without replacing local faith',()=>{const g=start(),p=province(g),l=g.civic.provinces[p.id];l.faith='Local test tradition';l.localTrust=60;const cash=g.factions.ming.treasury;assert.ok(identityAction(g,world,'institution',p.id).ok);assert.equal(g.factions.ming.treasury,cash-180);g.turn=3;tickIdentity(g,world);assert.ok(l.localTrust>60);assert.equal(l.faith,'Local test tradition');assert.equal(g.identity.institutions[p.id].faith,l.faith);});
test('voluntary dialogue requires trust and time, and cancels if land is lost',()=>{const g=start(),p=province(g),l=g.civic.provinces[p.id];l.faith='Local test tradition';l.acceptance=40;assert.equal(identityAction(g,world,'dialogue',p.id,'faith').ok,false);l.acceptance=90;l.localTrust=90;assert.ok(identityAction(g,world,'dialogue',p.id,'faith').ok);assert.equal(l.faith,'Local test tradition');g.turn=3;tickIdentity(g,world);assert.ok(g.identity.projects[p.id].progress>0);p.owner='joseon';g.turn=6;tickIdentity(g,world);assert.equal(g.identity.projects[p.id],undefined);assert.equal(l.faith,'Local test tradition');});
test('dialogue completes only after sustained acceptance and preserves other identity',()=>{const g=start(),p=province(g),l=g.civic.provinces[p.id];l.faith='Local test tradition';l.acceptance=90;l.localTrust=90;const culture=l.culture;assert.ok(identityAction(g,world,'dialogue',p.id,'faith').ok);for(let t=3;t<=33;t+=3){g.turn=t;tickIdentity(g,world);}assert.equal(l.faith,g.civic.realms.ming.faith);assert.equal(l.culture,culture);assert.equal(g.identity.projects[p.id],undefined);});
test('ruler faith change preserves provincial identities and old saves migrate',()=>{const g=start(),p=province(g),l=g.civic.provinces[p.id];l.faith='Local test tradition';assert.ok(localIdentities(g,'ming').faith.includes(l.faith));assert.ok(identityAction(g,world,'adopt-faith',l.faith).ok);assert.equal(g.civic.realms.ming.faith,l.faith);const copy=restoreGame(snapshot(g),world);assert.equal(copy.identity.realms.ming.lastFaith,0);assert.ok(renderIdentity(copy,world,String).includes('INNOVATION TREE'));delete g.identity;assert.ok(restoreGame(snapshot(g),world).identity);});

import {cultureProfile,cultureView,knownLanguages,courtLanguage,cultureLeadership} from '../src/culture-systems.js';
test('culture actions integrate with real campaign modifiers, UI and save restoration',()=>{
 const g=start('england'),p=province(g),l=g.civic.provinces[p.id],r=g.politics.people[g.politics.realms.england.ruler];
 r.age=35;r.civic.culture='English';g.civic.realms.england.culture='English';l.culture='French';l.acceptance=90;l.localTrust=90;
 const patron=Object.values(g.politics.people).find(x=>x.realm==='england'&&x.alive&&x.age>=18&&x.id!==r.id&&x.skills.learning>=2);assert.ok(patron);g.living.realms.england.culturePatron=patron.id;
 const before=identityModifiers(g,'england').diplomacy;assert.ok(identityAction(g,world,'culture-study','French').ok);
 g.turn=15;tickIdentity(g,world);assert.ok(knownLanguages(g,r).includes('French'));assert.equal(identityModifiers(g,'england').diplomacy,before+2);
 assert.ok(identityAction(g,world,'culture-language','French').ok);assert.ok(identityAction(g,world,'culture-hybrid','River Culture','French').ok);
 assert.equal(l.culture,'French');assert.equal(cultureLeadership(g,'River Culture').realm,'england');
 const copy=restoreGame(snapshot(g),world);assert.equal(courtLanguage(copy,'england'),'French');assert.deepEqual(cultureProfile(copy,'River Culture').parents,['English','French']);
 assert.ok(renderIdentity(copy,world,String).includes('CULTURE AND LANGUAGES'));assert.ok(cultureView(copy,'england').known.includes('French'));
});
test('tradition replacement preserves the existing tradition slots and enforces cultural leadership',()=>{
 const g=start('ming'),s=g.identity.realms.ming,old=s.traditions[0],next=Object.keys(TRADITIONS).find(x=>!s.traditions.includes(x)),count=s.traditions.length;
 assert.equal(cultureLeadership(g,g.civic.realms.ming.culture).realm,'ming');
 assert.ok(identityAction(g,world,'culture-replace-tradition',next,old).ok);assert.equal(s.traditions.length,count);assert.ok(s.traditions.includes(next));assert.ok(!s.traditions.includes(old));
 assert.equal(identityAction(g,world,'culture-replace-tradition',old,next).ok,false);
});
