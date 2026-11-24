import test from 'node:test';
import assert from 'node:assert/strict';
import {validReadyInvasion,progressEnemyInvasions,resolveInvasion,autoResolveInvasion,invasionRecovery,recordInvasionRecovery,planEnemyInvasion} from '../src/invasions.js';

const world={provinces:[{id:'stage',neighbors:['target']},{id:'target',neighbors:['stage']},{id:'remote',neighbors:[]}]};
function fixture(){
 const threat={army:'a',by:'rival',province:'target',staging:'stage',status:'ready',readyTurn:5};
 const game={player:'player',turn:5,factions:{player:{treaties:{}},rival:{treaties:{}}},provinces:{stage:{id:'stage',owner:'rival'},target:{id:'target',owner:'player'},remote:{id:'remote',owner:'rival'}},armies:{a:{id:'a',owner:'rival',province:'stage',infantry:100,archers:20,cavalry:5}},kingdom:{threats:[threat]},conflict:{truces:{}}};
 return {game,threat};
}
test('ready adjacent invasion is retained until the next turn',()=>{
 const {game,threat}=fixture();
 assert.equal(validReadyInvasion(game,world,threat),true);
 assert.equal(progressEnemyInvasions(game,world),threat);
 assert.equal(game.kingdom.threats.length,1);
});
const invalid=[
 ['army moved away',g=>g.armies.a.province='remote'],
 ['army changed allegiance',g=>g.armies.a.owner='player'],
 ['army was destroyed',g=>Object.assign(g.armies.a,{infantry:0,archers:0,cavalry:0})],
 ['army embarked',g=>g.naval={voyages:{a:{}}}],
 ['army is a contingent',g=>g.armies.a.contingent=true],
 ['staging occupied',g=>g.campaignWar={occupations:{stage:{by:'player'}}}],
 ['staging lost',g=>g.provinces.stage.owner='player'],
 ['target occupied',g=>g.campaignWar={occupations:{target:{by:'rival'}}}],
 ['alliance signed',g=>g.factions.rival.treaties.player='alliance'],
 ['truce signed',g=>g.conflict.truces['player|rival']=12],
 ['not adjacent',g=>{g.armies.a.province='remote';g.kingdom.threats[0].staging='remote';}]
];
for(const [name,change] of invalid)test('invalid invasion cannot resolve: '+name,()=>{
 const {game,threat}=fixture();
 change(game);
 const before=JSON.stringify(game);
 assert.equal(validReadyInvasion(game,world,threat),false);
 assert.equal(resolveInvasion(game,world,threat,{victory:false}).ok,false);
 assert.equal(autoResolveInvasion(game,world,threat).ok,false);
 assert.equal(JSON.stringify(game),before);
 assert.equal(progressEnemyInvasions(game,world),null);
 assert.equal(game.kingdom.threats.length,0);
});
test('an alert absent from the canonical queue cannot be resolved',()=>{
 const {game,threat}=fixture();game.kingdom.threats=[];
 assert.equal(autoResolveInvasion(game,world,threat).ok,false);
 assert.equal(resolveInvasion(game,world,threat,{victory:false}).ok,false);
});

test('invasion recovery blocks mobilization across all enemies for six months and defeated rival for twelve',()=>{
 const {game}=fixture();game.kingdom.threats=[];game.kingdom.difficulty='normal';
 recordInvasionRecovery(game,'rival',true);assert.equal(invasionRecovery(game),6);assert.equal(invasionRecovery(game,'rival'),12);
 assert.equal(planEnemyInvasion(game,world),null);
 game.turn+=6;assert.equal(invasionRecovery(game),0);assert.equal(invasionRecovery(game,'rival'),6);
 game.turn+=6;assert.equal(invasionRecovery(game,'rival'),0);
});
test('hard mode still provides four months of recovery; legacy saves need no migration',()=>{
 const {game}=fixture();game.kingdom.difficulty='hard';assert.equal(invasionRecovery(game),0);
 recordInvasionRecovery(game,'rival',false);assert.equal(invasionRecovery(game),4);assert.equal(invasionRecovery(game,'rival'),6);
});
