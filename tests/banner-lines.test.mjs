import test from 'node:test';
import assert from 'node:assert/strict';
import {arrangeCardArmy,freeDeploymentCell,stepCardBattle,cardBattleOutcome,cardCounter,cardRole,cardFormationChoices,cardRoleHint} from '../src/simple-card-battle.js';
const unit=(id,side,type,n)=>({id,side,type,kind:type,troopCount:n,life:100,morale:75,damage:type==='cavalry'?18:type==='archers'?9:11,armor:1,speed:type==='cavalry'?6.8:type==='archers'?3.6:4.5,range:type==='archers'?15:2.5,x:0,z:0});
function run(n,m,ta,tb){const groups=[];for(const [side,num,type,home] of [['attacker',n,ta,1],['defender',m,tb,-1]]){const count=Math.min(12,Math.ceil(num/100));for(let i=0;i<count;i++)groups.push(unit(side+i,side,type,Math.floor(num/count)+(i<num%count?1:0)));assert.ok(arrangeCardArmy(groups,side,home));}const s={groups};let result;for(let i=0;i<3001;i++){stepCardBattle(s,1/30);result=cardBattleOutcome(groups,s.fieldTime);if(result)break;}assert.ok(result);return result;}
test('deployment cells do not overlap and cannot cross the battle line',()=>{const g=Array.from({length:17},(_,i)=>unit('a'+i,'attacker',i%3===0?'archers':'infantry',100));assert.ok(arrangeCardArmy(g,'attacker',1));assert.equal(new Set(g.map(x=>x.x+':'+x.z)).size,17);assert.equal(freeDeploymentCell(g,g[0],0,-25,1),null);assert.ok(arrangeCardArmy(g,'attacker',-1,'flanks'));assert.ok(g.every(x=>x.z<0));});
test('large forces win in a multi-regiment engagement',()=>{assert.equal(run(6000,300,'infantry','infantry').victory,true);assert.equal(run(6000,300,'infantry','archers').victory,true);assert.equal(run(2000,1000,'infantry','infantry').victory,true);});
test('mounted archers have ranged role; cavalry counters archers; pikes counter cavalry',()=>{const c=unit('c','attacker','cavalry',100),a=unit('a','defender','archers',100),p=unit('p','defender','infantry',100);p.kind='pikemen';assert.ok(cardCounter(c,a)>1);assert.ok(cardCounter(p,c)>1);assert.equal(cardRole({...c,specialistId:'horsebow'}),'ranged');assert.equal(run(1000,1000,'cavalry','archers').victory,true);assert.equal(run(1000,1000,'archers','cavalry').victory,false);});
test('deadlock is explicit and does not grant victory to an invading army',()=>{const groups=[unit('a','attacker','infantry',100),unit('b','defender','infantry',100)];assert.equal(cardBattleOutcome(groups,99),null);assert.equal(cardBattleOutcome(groups,100).reason,'deadlock');assert.equal(cardBattleOutcome(groups,100,false).victory,false);assert.equal(cardBattleOutcome(groups,100,true).victory,true);});
test('deterministic result for identical armies',()=>assert.deepEqual(run(1000,1000,'archers','archers'),run(1000,1000,'archers','archers')));

test('formation choices are role-appropriate',()=>{const choices=['shield_wall','pike_square','volley_line','cavalry_wedge'].map(id=>({id}));assert.deepEqual(cardFormationChoices(unit('a','attacker','archers',100),choices).map(x=>x.id),['volley_line']);assert.deepEqual(cardFormationChoices(unit('b','attacker','infantry',100),choices).map(x=>x.id),['shield_wall','pike_square']);assert.ok(cardRoleHint(unit('c','attacker','cavalry',100)).includes('ranged'));});
test('1000 deterministic tactical matchups settle cleanly without NaN or infinite deadlock',()=>{
 const types=['infantry','archers','cavalry'];
 let resolved=0,pikesVsCav=0,cavVsArch=0;
 for(let seed=0;seed<1000;seed++){
  const ta=types[seed%3],tb=types[(seed+1+(seed%2))%3];
  const a=unit('a'+seed,'attacker',ta,180+(seed%7)*35),b=unit('b'+seed,'defender',tb,180+((seed*3)%7)*35);
  if(seed%5===0&&ta==='infantry')a.kind='pikemen';
  if(seed%7===0&&tb==='cavalry')b.specialistId='elephants';
  arrangeCardArmy([a],'attacker',1);arrangeCardArmy([b],'defender',-1);
  const s={groups:[a,b],fieldTime:0};
  let out=null;
  for(let step=0;step<900;step++){stepCardBattle(s,1/15);out=cardBattleOutcome([a,b],s.fieldTime);if(out)break;}
  assert.ok(out&&Number.isFinite(a.life)&&Number.isFinite(b.life));
  resolved++;
  if(a.kind==='pikemen'&&tb==='cavalry'&&a.troopCount>=b.troopCount&&out.victory)pikesVsCav++;
  if(ta==='cavalry'&&tb==='archers'&&a.troopCount>=b.troopCount&&out.victory)cavVsArch++;
 }
 assert.equal(resolved,1000);assert.ok(pikesVsCav>0&&cavVsArch>0);
});
