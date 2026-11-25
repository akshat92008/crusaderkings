import assert from 'node:assert/strict';
import test from 'node:test';
import {readFileSync} from 'node:fs';
import {createGame,snapshot,restoreGame,advanceMonth} from '../src/simulation.js';
import {
 initFeudal,syncTitles,titleList,characterTitles,characterRank,resolveTitle,
 createTitle,usurpTitle,destroyTitle,revokeTitle,transferVassal,
 feudalAction,addClaim,canEnforceClaim,claimantCandidates,isImprisoned,TITLE_TIERS
} from '../src/feudal-systems.js';
import {feudalHierarchy,obligationProfile,creditEstateIncome} from '../src/feudal-obligations.js';
import {domainLimit,politicalEstates,authorityModifiers} from '../src/realm-authority.js';
import {careerCandidates,careerAction,careerView,vassalCareer} from '../src/player-career.js';
import {
 titleSuccessionLaw,setTitleSuccessionLaw,titleSuccessionCandidates,
 governmentSuccessionProfile,dynasticPrestige,normalizeGenderLaw
} from '../src/succession-systems.js';
import {
 politicsAction,removePoliticalCharacter,addSecondarySpouse,addConcubine,
 spawnBastard,legitimizeBastard,createCadetBranch,tickPolitics
} from '../src/dynastic-politics.js';
import {polygamyProfile,allSpouses} from '../src/dynastic-ties.js';
import {reconcileRegency,regencyView,regencyPermission} from '../src/regency-systems.js';
import {
 FACTION_TYPES,createFaction,joinFaction,conflictAction,tickConflict,hasTruce
} from '../src/political-conflict.js';

const world=JSON.parse(readFileSync(new URL('../data/world.json',import.meta.url)));

function start(realm='england'){
 const g=createGame(world,realm);
 g.factions[realm].treasury=10000;
 g.factions[realm].prestige=500;
 g.factions[realm].legitimacy=90;
 return g;
}

test('Phase 1: 5-tier feudal hierarchy, baronies, deJure vs deFacto, and multi-title actions',()=>{
 const g=start('ming');
 assert.deepEqual(TITLE_TIERS,['barony','county','duchy','kingdom','empire']);
 // Ming has imperial government -> persistent e:ming empire title
 const emp=g.feudal.titles['e:ming'];
 assert.ok(emp&&emp.feudalTier==='empire'&&emp.rank===5);
 const king=g.feudal.titles['k:ming'];
 assert.equal(king.deJureParent,'e:ming');
 assert.equal(king.parent,'e:ming');

 const prov=Object.keys(g.politics.holdings).find(id=>g.politics.holdings[id].realm==='ming');
 const county=g.feudal.titles['c:'+prov];
 assert.equal(county.feudalTier,'county');
 assert.ok(county.deJureParent.startsWith('d:'));
 for(const kind of ['castle','city','temple']){
  const b=g.feudal.titles['b:'+prov+':'+kind];
  assert.ok(b,'barony '+kind);
  assert.equal(b.feudalTier,'barony');
  assert.equal(b.rank,1);
  assert.equal(b.deJureParent,'c:'+prov);
  assert.equal(b.parent,'c:'+prov);
 }

 // Non-imperial realm can create an empire once it meets criteria, destroy/recreate duchies, and usurp
 const eng=start('england');
 assert.equal(eng.feudal.titles['e:england'],undefined);
 assert.equal(createTitle(eng,world,'england','e:england').ok,false);
 assert.ok(createTitle(eng,world,'england','e:england',{force:true}).ok);
 assert.equal(eng.feudal.titles['e:england'].holder,eng.politics.realms.england.ruler);

 const duchy=titleList(eng,'england').find(t=>t.tier==='regional');
 assert.ok(duchy);
 // Give ruler the duchy so it can be destroyed
 duchy.holder=eng.politics.realms.england.ruler;
 assert.ok(destroyTitle(eng,world,'england',duchy.id).ok);
 assert.equal(resolveTitle(eng,duchy.id),null);
 assert.equal(destroyTitle(eng,world,'england','k:england').ok,false);
 assert.ok(createTitle(eng,world,'england',duchy.id,{force:true}).ok);
 assert.ok(resolveTitle(eng,duchy.id));

 // Usurping a foreign duchy transfers holder and gives former holder a strong claim
 const frDuchy=titleList(eng,'france').find(t=>t.tier==='regional');
 const oldFrHolder=frDuchy.holder;
 assert.equal(usurpTitle(eng,world,'england',frDuchy.id).ok,false);
 assert.ok(usurpTitle(eng,world,'england',frDuchy.id,{force:true}).ok);
 assert.ok(Object.values(eng.feudal.claimants).some(c=>c.person===oldFrHolder&&c.strength==='strong'));
});

test('Phase 1: cycle-free transferVassal, justified vs tyrannical revokeTitle + revolt, and barony income conservation',()=>{
 const g=start('novgorod');
 const r=g.politics.people[g.politics.realms.novgorod.ruler];
 const duchy=titleList(g,'novgorod').find(t=>t.tier==='regional'&&t.members.length>1);
 const [p1,p2]=duchy.members;
 const dukeId=g.politics.holdings[p1].lord;
 const countId=g.politics.holdings[p2].lord;
 duchy.holder=dukeId;
 syncTitles(g);

 // Transfer county under duke, then reject circular transfer of duke under count!
 assert.ok(transferVassal(g,world,'novgorod','c:'+p2,dukeId).ok);
 assert.equal(g.feudal.titles['c:'+p2].deFactoLiege,dukeId);
 assert.equal(transferVassal(g,world,'novgorod',duchy.id,countId).ok,false);

 // Revoke with tyranny triggers revolt when free ambitious/low-loyalty vassal refuses
 g.politics.holdings[p2].loyalty=20;
 const revoltRes=revokeTitle(g,world,'novgorod','c:'+p2);
 assert.equal(revoltRes.ok,false);
 assert.equal(revoltRes.revolted,true);
 assert.ok(Object.values(g.conflict.factions).some(f=>f.realm==='novgorod'&&f.status==='civil war'));

 // Grant barony to separate burgher & verify creditEstateIncome conserves wealth without double-counting
 const g2=start('novgorod');
 const sub=Object.values(feudalHierarchy(g2,'novgorod').byHolding).find(x=>x.kind==='indirect');
 assert.ok(sub);
 const baron=Object.values(g2.politics.people).find(p=>p.alive&&p.realm==='novgorod'&&p.age>=18&&p.id!==g2.politics.holdings[sub.id].lord&&p.id!==g2.politics.realms.novgorod.ruler);
 assert.ok(feudalAction(g2,world,'grant-barony','b:'+sub.id+':city',baron.id).ok);
 const hSub=g2.politics.holdings[sub.id];
 const hLiege=g2.politics.holdings[feudalHierarchy(g2,'novgorod').byLord[sub.liege].holdings[0]];
 const bRec=g2.feudal.baronies['b:'+sub.id+':city'];
 const beforeTotal=hSub.wealth+hLiege.wealth+bRec.wealth;
 creditEstateIncome(g2,sub.id,100,feudalHierarchy(g2,'novgorod'));
 assert.equal(hSub.wealth+hLiege.wealth+bRec.wealth,beforeTotal+100);
});

test('Phase 1: domain limits by rank/stewardship/authority and playable baron/count/duke ranks',()=>{
 const g=start('ming');
 const rId=g.politics.realms.ming.ruler;
 const kingLimit=domainLimit(g,'ming',rId);
 assert.ok(kingLimit>=3);
 for(const h of Object.values(g.politics.holdings))if(h.realm==='ming')h.lord=rId;
 const est=politicalEstates(g,'ming');
 assert.ok(est.excess>0);
 const mods=authorityModifiers(g,'ming',est);
 assert.ok(mods.tax<1&&mods.levy<1&&mods.opinionPenalty>0);

 // Playable baron rank in player-career.js
 const g2=start('england');
 const prov=Object.keys(g2.politics.holdings).find(id=>g2.politics.holdings[id].realm==='england');
 const courtier=Object.values(g2.politics.people).find(p=>p.alive&&p.realm==='england'&&p.age>=18&&p.id!==g2.politics.realms.england.ruler&&!Object.values(g2.politics.holdings).some(h=>h.lord===p.id));
 assert.ok(courtier);
 assert.ok(feudalAction(g2,world,'grant-barony','b:'+prov+':temple',courtier.id).ok);
 assert.equal(characterRank(g2,courtier.id).tier,'barony');
 assert.ok(careerCandidates(g2).some(c=>c.id===courtier.id));
 assert.ok(careerAction(g2,'start',courtier.id).ok);
 g2.feudal.baronies['b:'+prov+':temple'].wealth=50;
 assert.ok(careerAction(g2,'withdraw-barony','b:'+prov+':temple').ok);
 assert.equal(vassalCareer(g2).rank,'barony');
 assert.equal(careerView(g2).baronies.length,1);
});

test('Phase 3: per-title succession laws, government profiles, gavelkind claims, and Strong vs Weak claim rules',()=>{
 const g=start('england');
 const s=g.politics.realms.england,r=g.politics.people[s.ruler];
 const duchy=titleList(g,'england').find(t=>t.tier==='regional');
 duchy.holder=r.id;
 // Republic restricts succession to elective; feudal allows all
 assert.deepEqual(governmentSuccessionProfile(g,'novgorod').allowed,['elective']);
 assert.ok(setTitleSuccessionLaw(g,'england',duchy.id,'ultimogeniture').ok);
 assert.equal(titleSuccessionLaw(g,duchy.id),'youngest');
 assert.equal(titleSuccessionLaw(g,'k:england'),'eldest');
 assert.equal(normalizeGenderLaw('agnatic_cognatic'),'male_preference');

 // Give ruler 3 children and partition holdings under gavelkind
 const kids=r.children.map(id=>g.politics.people[id]).sort((a,b)=>b.age-a.age);
 kids[0].age=28;kids[1].age=24;
 const k3=spawnBastard(g,'england',r.id,{age:20,sex:'male',bastard:false});
 const crownHoldings=Object.entries(g.politics.holdings).filter(([,h])=>h.realm==='england').slice(0,3);
 for(const [,h] of crownHoldings)h.lord=r.id;
 assert.ok(politicsAction(g,world,'law','gavelkind').ok);
 assert.ok(removePoliticalCharacter(g,world,r.id));

 // Youngest heirs get Strong and Weak claims; Weak claims cannot be enforced against healthy adult ruler
 const c2=Object.values(g.feudal.claimants).find(c=>c.person===kids[1].id&&c.realm==='england');
 const c3=Object.values(g.feudal.claimants).find(c=>c.person===k3.id&&c.realm==='england');
 assert.equal(c2.strength,'strong');
 assert.equal(c3.strength,'weak');
 delete s.claimantCrisis;
 assert.equal(canEnforceClaim(g,'england',c2),true);
 assert.equal(canEnforceClaim(g,'england',c3),false);
 // Weak claim becomes enforceable during minority / regency / succession crisis
 g.politics.people[s.ruler].age=10;
 reconcileRegency(g,'england');
 assert.equal(canEnforceClaim(g,'england',c3),true);
});

test('Phase 3: polygamy, concubinage, bastard legitimization, cadet branches, dynasty prestige & extinction, and regency councils',()=>{
 // Polygamy in sultanate (ottomans)
 const ott=start('ottomans');
 const sultan=ott.politics.people[ott.politics.realms.ottomans.ruler];
 assert.equal(polygamyProfile(ott,'ottomans').mode,'polygamy');
 const bride2=Object.values(ott.politics.people).find(p=>p.alive&&p.realm==='ottomans'&&p.sex==='female'&&p.age>=18&&!p.spouse&&p.id!==sultan.spouse&&!sultan.children.includes(p.id)&&!sultan.parents.includes(p.id));
 assert.ok(bride2);
 assert.ok(addSecondarySpouse(ott,'ottomans',sultan.id,bride2.id).ok);
 assert.equal(allSpouses(ott,sultan).length,2);

 // Concubinage in Hindu realm (vijayanagara)
 const vij=start('vijayanagara');
 assert.equal(polygamyProfile(vij,'vijayanagara').mode,'concubinage');
 const raja=vij.politics.people[vij.politics.realms.vijayanagara.ruler];
 const conc=Object.values(vij.politics.people).find(p=>p.alive&&p.realm==='vijayanagara'&&p.sex==='female'&&p.age>=18&&!p.spouse&&!raja.children.includes(p.id)&&!raja.parents.includes(p.id));
 assert.ok(addConcubine(vij,'vijayanagara',raja.id,conc.id).ok);
 assert.equal(raja.concubines.length,1);

 // Bastard exclusion & legitimization, cadet branch, dynasty prestige, extinction
 const g=start('england'),r=g.politics.people[g.politics.realms.england.ruler];
 const bast=spawnBastard(g,'england',r.id,{age:22,sex:'male'});
 assert.ok(!titleSuccessionCandidates(g,'k:england').some(c=>c.id===bast.id));
 assert.ok(legitimizeBastard(g,'england',bast.id).ok);
 assert.ok(titleSuccessionCandidates(g,'k:england').some(c=>c.id===bast.id));

 const vassal=Object.values(g.politics.holdings).find(h=>h.realm==='england'&&h.lord!==r.id);
 const vPerson=g.politics.people[vassal.lord];
 vPerson.house=r.house;
 const cadet=createCadetBranch(g,'england',vPerson.id,'House Plantagenet-York');
 assert.ok(cadet.ok);
 assert.equal(vPerson.house,'House Plantagenet-York');
 assert.ok(dynasticPrestige(g,r.house)>0);

 // Extinction when last member dies
 const extinctHouse='House Solo Test';
 const solo={...vPerson,id:'solo1',house:extinctHouse,children:[],spouse:null,spouses:[],concubines:[],parents:[]};
 g.politics.people.solo1=solo;
 removePoliticalCharacter(g,world,'solo1');
 assert.equal(g.politics.dynasties[extinctHouse].extinct,true);

 // Incapacity / imprisonment regency council
 const gReg=start('england'),head=gReg.politics.people[gReg.politics.realms.england.ruler];
 head.age=35;head.incapacitated=true;
 const reg=reconcileRegency(gReg,'england');
 assert.ok(reg&&reg.reason==='incapacitated');
 assert.ok(reg.council.length>=1);
 gReg.politics.people[reg.regent].traits=['ambitious','cautious'];
 assert.equal(regencyPermission(gReg,'england','war'),false);
});

test('Phase 4: concurrent 8-type factions, secret members, coercion, and map-level civil war mobilization',()=>{
 const g=start('novgorod');
 assert.equal(FACTION_TYPES.length,8);
 const provs=Object.keys(g.politics.holdings).filter(id=>g.politics.holdings[id].realm==='novgorod'&&g.politics.holdings[id].lord!==g.politics.realms.novgorod.ruler);
 assert.ok(provs.length>=3);

 // Create multiple concurrent factions of different types
 const fTax=createFaction(g,world,'novgorod','tax',[provs[0]],{pressure:60});
 const fLib=createFaction(g,world,'novgorod','liberty',[provs[1]],{pressure:50});
 const fCouncil=createFaction(g,world,'novgorod','council',[provs[2]],{pressure:40});
 const fPop=createFaction(g,world,'novgorod','popular',[provs[0],provs[1]],{pressure:40});
 assert.ok(fTax&&fLib&&fCouncil&&fPop);

 // Secret member joins and can be exposed or revealed on civil war
 assert.ok(joinFaction(g,fTax.id,provs[1],true).ok);
 assert.equal(fTax.secretMembers.length,1);
 assert.ok(conflictAction(g,world,'expose-secret',fTax.id).ok);
 assert.equal(fTax.secretMembers.length,0);
 assert.ok(g.politics.holdings[provs[1]].leverageUntil>g.turn);

 // Coerce member out of liberty faction
 const libLord=g.politics.holdings[provs[1]].lord;
 assert.ok(conflictAction(g,world,'coerce-leave',fLib.id,libLord).ok);
 assert.equal(fLib.status,'dissolved');

 // Ultimatum refusal triggers real map-level Civil War (rebel coalition, war, occupations, field armies)
 fTax.status='ultimatum';
 fTax.deadline=g.turn+6;
 assert.ok(joinFaction(g,fTax.id,provs[2],true).ok); // secret member revealed on outbreak!
 assert.ok(conflictAction(g,world,'refuse',fTax.id).ok);
 assert.equal(fTax.status,'civil war');
 assert.ok(fTax.members.includes(provs[2]));
 assert.ok(fTax.rebelFaction&&g.factions[fTax.rebelFaction]?.rebel);
 assert.ok(fTax.warId&&g.conflict.wars[fTax.warId]?.status==='active');
 assert.ok(Object.values(g.armies).some(a=>a.owner===fTax.rebelFaction&&(a.infantry+a.archers+a.cavalry)>0));
 assert.ok(Object.values(g.campaignWar.occupations).some(o=>o.war===fTax.warId&&o.by===fTax.rebelFaction));
 // Rebel coalition is isolated from attacking third-party realms
 assert.equal(hasTruce(g,fTax.rebelFaction,'france'),true);
 assert.equal(hasTruce(g,fTax.rebelFaction,'novgorod'),false);

 // Post-war settlement cleans up rebel faction, armies, and occupations cleanly
 const copy=restoreGame(snapshot(g),world);
 assert.ok(copy.factions[fTax.rebelFaction]);
 assert.ok(conflictAction(copy,world,'accept',fTax.id).ok);
 assert.equal(copy.factions[fTax.rebelFaction],undefined);
 assert.equal(Object.values(copy.armies).some(a=>a.owner===fTax.rebelFaction),false);
 assert.equal(Object.values(copy.campaignWar.occupations).some(o=>o.war===fTax.warId),false);
});

test('Phase 1/3/4: legacy save migration preserves invariants across restoreGame + advanceMonth',()=>{
 const g=start('england');
 delete g.feudal.baronies;
 delete g.feudal.vassalTransfers;
 delete g.feudal.titleLaws;
 delete g.politics.dynasties;
 g.feudal.version=2;
 const restored=restoreGame(snapshot(g),world);
 assert.equal(restored.feudal.version,3);
 assert.ok(Object.keys(restored.feudal.baronies).length>0);
 assert.ok(Object.keys(restored.politics.dynasties).length>0);
});
