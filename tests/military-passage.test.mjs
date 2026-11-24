import assert from 'node:assert/strict';
import test from 'node:test';
import {readFileSync} from 'node:fs';
import {createGame,restoreGame,snapshot,startMarch} from '../src/simulation.js';
import {diplomacyAction,militaryAccess,tickDiplomacy} from '../src/diplomacy-systems.js';
import {renderDiplomaticAgreements} from '../src/kingdom-ui.js';

const world=JSON.parse(readFileSync(new URL('../data/world.json',import.meta.url)));
const home='p119',border='p141',inland='p139',thirdParty='p142';
function setup(){
 const g=createGame(world,'ming');
 const army=Object.values(g.armies).find(a=>a.owner==='ming');
 army.province=home;
 g.factions.ming.treasury=1000;
 g.factions.joseon.relations.ming=25;
 return {g,army};
}
const request=g=>diplomacyAction(g,world,'access','joseon');
const march=(g,a,b)=>startMarch(g,world,a,b);

test('military passage is directional and crossing preserves foreign ownership',()=>{
 const {g,army}=setup(),hostGold=g.factions.joseon.treasury;
 assert.match(renderDiplomaticAgreements(g,'joseon',String),/Request military passage/);
 assert.ok(request(g).ok);
 assert.equal(g.factions.ming.treasury,910);
 assert.equal(g.factions.joseon.treasury,hostGold+90);
 assert.equal(request(g).ok,false);
 assert.equal(militaryAccess(g,'joseon','ming'),null);
 assert.equal(march(g,home,border).type,'move');
 assert.equal(army.province,border);
 assert.equal(g.provinces[border].owner,'joseon');
 assert.equal(march(g,border,thirdParty).ok,false);
 assert.ok(!g.campaignWar.occupations[thirdParty]);
 assert.equal(march(g,border,inland).type,'move');
 assert.equal(army.passage.home,home);
});

test('an expired passage returns a saved army to its entry province without losing troops',()=>{
 const {g,army}=setup();
 assert.ok(request(g).ok);
 march(g,home,border);
 march(g,border,inland);
 const copy=restoreGame(snapshot(g),world);
 const stationed=copy.armies[army.id];
 assert.equal(militaryAccess(copy,'ming','joseon').until,24);
 assert.equal(stationed.province,inland);
 copy.turn=24;
 tickDiplomacy(copy,world);
 assert.equal(stationed.province,home);
 assert.equal(stationed.passage,undefined);
 assert.equal(stationed.infantry,army.infantry);
 assert.equal(militaryAccess(copy,'ming','joseon'),null);
});

test('hostile occupation blocks transit and a new formal war cancels access',()=>{
 const {g,army}=setup();
 g.factions.joseon.relations.ming=10;
 assert.equal(request(g).ok,false);
 assert.equal(g.factions.ming.treasury,1000);
 g.factions.joseon.relations.ming=35;
 assert.ok(request(g).ok);
 g.campaignWar.occupations[border]={by:'ashikaga'};
 assert.equal(march(g,home,border).ok,false);
 delete g.campaignWar.occupations[border];
 assert.equal(march(g,home,border).type,'move');
 g.conflict.wars.test={id:'test',status:'active',attacker:'joseon',defender:'ming'};
 assert.equal(militaryAccess(g,'ming','joseon'),null);
 g.turn=1;
 tickDiplomacy(g,world);
 assert.equal(army.province,home);
});
