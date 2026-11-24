import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {armySize,concludeBattle,createGame,restoreGame,snapshot,startMarch} from '../src/simulation.js';
import {aidStrength,diplomacyAction,fieldAidOptions,fieldContingentsAt,tickDiplomacy} from '../src/diplomacy-systems.js';
import {participatingArmies} from '../src/field-forces.js';
import {resolveInvasion} from '../src/invasions.js';
import {conflictAction} from '../src/political-conflict.js';
import {renderDiplomaticAgreements} from '../src/kingdom-ui.js';

const world=JSON.parse(readFileSync(new URL('../data/world.json',import.meta.url)));
const realm='ming',donor='joseon',enemy='ashikaga',origin='p141',front='p137',target='p142';
const owned=(g,r)=>Object.values(g.armies).find(a=>a.owner===r&&!a.contingent);
const force=g=>Object.values(g.armies).find(a=>a.contingent);
function setup(defending=false){
 const g=createGame(world,realm);
 const source=owned(g,donor);
 Object.assign(source,{province:origin,infantry:267,archers:92,cavalry:27});
 owned(g,realm).province=front;
 g.factions[donor].treasury=1200;
 g.factions[donor].treaties[realm]='alliance';
 g.factions[realm].treaties[donor]='alliance';
 g.factions[donor].relations[realm]=75;
 const war={id:'test-war',attacker:defending?enemy:realm,defender:defending?realm:enemy,goal:defending?front:target,score:0,battles:0,started:0,status:'active'};
 g.conflict.wars[war.id]=war;
 return {g,war,source};
}
const dispatch=(g,war)=>diplomacyAction(g,world,'field-aid',war.id,donor);
function advanceDiplomacy(g,turn){
 g.turn=turn;
 tickDiplomacy(g,world);
}

test('dispatch transfers existing troops and joins tactical deployment only after arrival',()=>{
 const {g,war,source}=setup(),original=armySize(source),native=armySize(owned(g,realm));
 const [offer]=fieldAidOptions(g,world,realm,war);
 assert.equal(offer.count,115);
 assert.deepEqual(offer.route,[front]);
 assert.match(renderDiplomaticAgreements(g,donor,String,world),/Call field contingent/);
 assert.ok(dispatch(g,war).ok);
 const guest=force(g);
 assert.equal(guest.owner,donor);
 assert.equal(guest.province,origin);
 assert.equal(armySize(source)+armySize(guest),original);
 assert.equal(aidStrength(g,realm,enemy),0);
 assert.equal(dispatch(g,war).ok,false);
 assert.deepEqual(fieldContingentsAt(g,realm,front,enemy),[]);
 assert.equal(startMarch(g,world,front,target).attackTroops,native);

 const copy=restoreGame(snapshot(g),world);
 advanceDiplomacy(copy,1);
 const battle=startMarch(copy,world,front,target);
 assert.equal(battle.alliedTroops,115);
 assert.equal(battle.attackTroops,native+115);
 assert.equal(participatingArmies(copy,[guest.id],realm,front,enemy)[0].id,guest.id);
 assert.deepEqual(participatingArmies(copy,[guest.id],realm,front,'dai-viet'),[]);
 assert.match(renderDiplomaticAgreements(copy,donor,String,world),/115 field troops · Stationed at p137/);
});

test('allied march, battle casualties and peace recall preserve the surviving donor army',()=>{
 const {g,war}=setup();
 assert.ok(dispatch(g,war).ok);
 const guest=force(g),before=armySize(guest);
 advanceDiplomacy(g,1);
 assert.equal(startMarch(g,world,front,'p134').type,'move');
 assert.equal(guest.province,'p134');
 const battle=startMarch(g,world,'p134',target);
 assert.equal(battle.alliedTroops,before);
 battle.fieldBattle=true;
 concludeBattle(g,battle,{fieldBattle:true,victory:true,attackerRemaining:.55,enemyRemaining:.5},world);
 const survivors=armySize(guest);
 assert.ok(survivors>0&&survivors<before);
 assert.equal(guest.province,target);
 assert.ok(conflictAction(g,world,'peace',war.id,'enforce').ok);
 assert.equal(g.armies[guest.id],guest);
 assert.equal(guest.owner,donor);
 assert.equal(guest.province,origin);
 assert.equal(armySize(guest),survivors);
 assert.equal(guest.contingent,undefined);
});

test('allied defenders take campaign casualties while defending a host province',()=>{
 const {g,war}=setup(true);
 const attacker=owned(g,enemy);
 attacker.province=target;
 assert.ok(dispatch(g,war).ok);
 advanceDiplomacy(g,1);
 const guest=force(g),before=armySize(guest);
 const threat={army:attacker.id,by:enemy,province:front,staging:target,status:'ready'};
 g.kingdom.threats=[threat];
 const result=resolveInvasion(g,world,threat,{fieldBattle:true,victory:true,attackerRemaining:.60,enemyRemaining:.50});
 assert.equal(result.defended,true);
 assert.ok(g.armies[guest.id]);
 assert.ok(armySize(guest)<before);
 assert.equal(guest.owner,donor);
 assert.equal(guest.province,front);
});

test('an expedition reroutes around a lost border district and recalls on broken alliance',()=>{
 const {g,war}=setup();
 assert.ok(dispatch(g,war).ok);
 const guest=force(g);
 g.campaignWar.occupations[front]={by:enemy};
 advanceDiplomacy(g,1);
 assert.notEqual(guest.province,front);
 assert.notEqual(guest.province,origin);
 delete g.factions[donor].treaties[realm];
 advanceDiplomacy(g,2);
 assert.equal(guest.province,origin);
 assert.equal(guest.contingent,undefined);
 assert.equal(armySize(guest),115);
});

test('strategic courts request field contingents where an overland march is possible',()=>{
 const {g}=setup();
 g.player='england';
 advanceDiplomacy(g,6);
 const guest=force(g);
 assert.ok(guest);
 assert.equal(guest.owner,donor);
 assert.equal(guest.province,origin);
 advanceDiplomacy(g,7);
 assert.equal(guest.province,front);
});


test('automatic diplomacy does not commit the player’s gold or soldiers',()=>{
 const {g,source}=setup();
 g.player=donor;
 const cash=g.factions[donor].treasury,headcount=armySize(source);
 advanceDiplomacy(g,6);
 assert.equal(force(g),undefined);
 assert.equal(g.factions[donor].treasury,cash);
 assert.equal(armySize(source),headcount);
});
