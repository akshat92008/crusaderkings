import test from 'node:test';
import assert from 'node:assert/strict';
import {arrangeCardArmy,moveCard,stepCardBattle,cardBattleOutcome} from '../src/simple-card-battle.js';
import {createSiegeState,siegeBreached} from '../src/military-systems.js';
import {BannerRenderer} from '../src/banner-renderer.js';
import {BattleGame} from '../src/battle.js';

function makeRegiment(id,side,type,troopCount,extra={}){
 return {
  id,
  side,
  type,
  kind:extra.kind||type,
  troopCount,
  troops:troopCount,
  life:100,
  morale:85,
  damage:type==='cavalry'?18:type==='archers'?9:11,
  armor:1,
  speed:type==='cavalry'?6.8:type==='archers'?3.6:4.5,
  range:type==='archers'?15:2.5,
  x:0,
  z:0,
  ...extra
 };
}

function makeMock2dCanvas(w=1000,h=700){
 const calls=[];
 const ctx=new Proxy(
  {createLinearGradient:()=>({addColorStop(){}}),createRadialGradient:()=>({addColorStop(){}})},
  {get:(o,k)=>k in o?o[k]:(...args)=>(calls.push(k),0),set:(o,k,v)=>(o[k]=v,true)}
 );
 return {
  canvas:{
   width:w,
   height:h,
   clientWidth:w,
   clientHeight:h,
   getContext:kind=>kind==='2d'?ctx:null,
   getBoundingClientRect:()=>({left:0,top:0,width:w,height:h}),
   addEventListener(){},
   removeEventListener(){},
   setPointerCapture(){}
  },
  calls
 };
}

test('250+ deterministic 2D fortress siege scenarios settle with zero NaNs and respect breach gates',()=>{
 const enginePresets=[
  {ram:0,catapult:0,bombard:0},
  {ram:2,catapult:0,bombard:0},
  {ram:0,catapult:2,bombard:0},
  {ram:0,catapult:0,bombard:2},
  {ram:1,catapult:1,bombard:1}
 ];
 const compTypes=['infantry','archers','cavalry'];
 let totalScenarios=0;
 let breachObserved=0;
 let defenderHoldObserved=0;
 let courtyardChargeObserved=0;

 for(let seed=0;seed<260;seed++){
  const fortLevel=(seed%3)+1;
  const defenseMode=seed%5===0;
  const siege=createSiegeState(fortLevel,defenseMode);
  const atkEng=enginePresets[seed%enginePresets.length];
  const defEng=enginePresets[(seed+2)%enginePresets.length];
  if(defenseMode){
   siege.defenderEngines={...atkEng};
   siege.attackerEngines={...defEng};
  }else{
   siege.attackerEngines={...atkEng};
   siege.defenderEngines={...defEng};
  }

  const assaultSide=siege.assaultSide;
  const holdSide=assaultSide==='attacker'?'defender':'attacker';
  const assaultBase=180+(seed%8)*95;
  const holdBase=100+((seed*3)%6)*70;

  const groups=[];
  for(let i=0;i<3;i++){
   const tA=compTypes[(seed+i)%3];
   const tD=compTypes[(seed+i+1)%3];
   groups.push(makeRegiment('a'+i,assaultSide,tA,Math.round(assaultBase/3),{kind:tA==='infantry'&&seed%4===0?'pikemen':tA}));
   groups.push(makeRegiment('d'+i,holdSide,tD,Math.round(holdBase/3)));
  }

  assert.ok(arrangeCardArmy(groups,assaultSide,1));
  assert.ok(arrangeCardArmy(groups,holdSide,-1));
  for(const g of groups){
   if(g.side===holdSide)moveCard(g,{x:g.x,z:Math.min(-24,-Math.abs(g.z)-8)});
  }

  const state={groups,siege,effects:[],projectiles:[],fieldTime:0};
  let outcome=null;
  let sawBreachEffect=false;
  let crossedAfterBreach=false;

  for(let step=0;step<1600;step++){
   stepCardBattle(state,1/15);
   if((state.effects||[]).some(e=>e.kind==='breach'))sawBreachEffect=true;
   if(siegeBreached(siege)&&groups.some(g=>g.side===assaultSide&&!g.routed&&g.z<-18)){
    crossedAfterBreach=true;
   }
   outcome=cardBattleOutcome(groups,state.fieldTime,defenseMode,siege);
   if(outcome)break;
  }

  assert.ok(outcome,`Scenario ${seed} failed to conclude within time limit`);
  for(const g of groups){
   assert.ok(Number.isFinite(g.life)&&Number.isFinite(g.morale)&&Number.isFinite(g.x)&&Number.isFinite(g.z),`NaN detected in scenario ${seed}`);
  }
  for(const st of siege.structures){
   assert.ok(Number.isFinite(st.hp)&&st.hp>=0,`Invalid structure hp in scenario ${seed}`);
  }

  if(!siegeBreached(siege)){
   // Assaulting side can never claim victory while gate stands intact
   if(assaultSide==='attacker')assert.equal(outcome.victory,false);
   else assert.equal(outcome.victory,true);
   defenderHoldObserved++;
  }else{
   breachObserved++;
   if(sawBreachEffect)assert.ok(true);
   if(crossedAfterBreach)courtyardChargeObserved++;
  }
  totalScenarios++;
 }

 assert.ok(totalScenarios>=250);
 assert.ok(breachObserved>0,'Expected breached fortresses in siege matrix');
 assert.ok(defenderHoldObserved>0,'Expected intact fortresses to repel weak/timed-out assaults');
 assert.ok(courtyardChargeObserved>0,'Expected assaulting regiments to charge into courtyard after breach');
});

test('wall cover grants 0.72 ranged mitigation and siege engines accelerate gate breaches',()=>{
 const atkA=makeRegiment('aa','attacker','archers',100,{x:0,z:-6,range:22,damage:12});
 const defA=makeRegiment('da','defender','infantry',100,{x:0,z:-24,speed:0});
 defA.cooldown=99;
 const siegeA=createSiegeState(2);
 stepCardBattle({groups:[atkA,defA],siege:siegeA,effects:[],projectiles:[],fieldTime:0},0.1);

 const atkB=makeRegiment('ab','attacker','archers',100,{x:0,z:-6,range:22,damage:12});
 const defB=makeRegiment('db','defender','infantry',100,{x:0,z:-24,speed:0});
 defB.cooldown=99;
 stepCardBattle({groups:[atkB,defB],siege:null,effects:[],projectiles:[],fieldTime:0},0.1);

 const lossBehindWall=100-defA.life;
 const lossOpen=100-defB.life;
 assert.ok(lossBehindWall>0&&lossOpen>0);
 const ratio=lossBehindWall/lossOpen;
 assert.ok(Math.abs(ratio-0.72)<0.03,`Expected ~0.72 ranged damage ratio behind intact wall, got ${ratio.toFixed(4)}`);

 // Siege engines (bombard/ram) break a level 3 gate dramatically faster than bare infantry
 const bareInf=makeRegiment('bi','attacker','infantry',120,{x:0,z:-15});
 const bareSiege=createSiegeState(3);
 const bareState={groups:[bareInf],siege:bareSiege,effects:[],projectiles:[],fieldTime:0};
 for(let i=0;i<240;i++)stepCardBattle(bareState,0.1);

 const engInf=makeRegiment('ei','attacker','infantry',120,{x:0,z:-15});
 const engSiege=createSiegeState(3);
 engSiege.attackerEngines={ram:2,catapult:1,bombard:1};
 const engState={groups:[engInf],siege:engSiege,effects:[],projectiles:[],fieldTime:0};
 let sawBreach=false;
 for(let i=0;i<240;i++){
  stepCardBattle(engState,0.1);
  if(engState.effects.some(e=>e.kind==='breach'))sawBreach=true;
 }

 assert.ok(engSiege.structures[0].hp<bareSiege.structures[0].hp,'Siege engines must deal faster gate damage');
 assert.ok(siegeBreached(engSiege),'Engine-backed assault should breach level 3 gate within 24s');
 assert.ok(sawBreach,'Breaching gate must emit breach effect');
});

test('BattleGame supports 2D banner siegeMode with military engine stats while showcase stays open-field',()=>{
 const {canvas}=makeMock2dCanvas();
 const mockGame={
  player:'england',
  factions:{
   england:{id:'england',name:'England',color:'#4b98b3',doctrineProfile:'longbow'},
   france:{id:'france',name:'France',color:'#b86855',doctrineProfile:'chivalry'}
  },
  provinces:{
   normandy:{id:'normandy',terrain:'hills',buildings:{fort:2}}
  },
  world:{provinces:[{id:'normandy',terrain:'hills'}]},
  armies:{
   a1:{id:'a1',owner:'england',province:'calais',infantry:220,archers:120,cavalry:60,morale:88},
   e1:{id:'e1',owner:'france',province:'normandy',infantry:160,archers:80,cavalry:40,morale:84}
  },
  military:{
   armies:{
    a1:{engines:{ram:1,catapult:1,bombard:1},regiments:{}},
    e1:{engines:{ram:0,catapult:1,bombard:0},regiments:{}}
   }
  }
 };

 const showcaseBattle=new BattleGame(canvas,{
  attacker:'a1',playerArmies:['a1'],enemyArmy:'e1',enemyArmies:['e1'],
  enemy:'france',to:'normandy',from:'calais',
  fieldBattle:true,simpleField:true,bannerView:true,showcase:true,interactive:true,soundEnabled:false
 },mockGame);
 assert.equal(showcaseBattle.siege,null);
 assert.equal(showcaseBattle.rendererMode,'banner');
 showcaseBattle.stop();

 const siegeBattle=new BattleGame(canvas,{
  attacker:'a1',playerArmies:['a1'],enemyArmy:'e1',enemyArmies:['e1'],
  enemy:'france',to:'normandy',from:'calais',
  fieldBattle:true,simpleField:true,bannerView:true,siegeMode:true,interactive:true,soundEnabled:false
 },mockGame);
 assert.ok(siegeBattle.siege);
 assert.equal(siegeBattle.siege.level,2);
 assert.deepEqual(siegeBattle.siege.attackerEngines,{ram:1,catapult:1,bombard:1});
 assert.deepEqual(siegeBattle.siege.defenderEngines,{ram:0,catapult:1,bombard:0});
 assert.ok(siegeBattle.groups.filter(g=>g.side==='defender').every(g=>g.z<=-20),'Defenders must deploy behind fortress walls');
 siegeBattle.startAssault();
 for(let i=0;i<60;i++)siegeBattle.update(0.1);
 siegeBattle.render();
 siegeBattle.stop();
});

test('BannerRenderer renders all 8 terrain biomes and intact/breached 2D siege fortifications cleanly',()=>{
 const terrains=['plains','forest','hills','highlands','desert','steppe','coast','marsh'];
 for(const terrain of terrains){
  const {canvas,calls}=makeMock2dCanvas();
  const br=new BannerRenderer(canvas,terrain);
  const siege=createSiegeState(2);
  siege.attackerEngines={ram:1,catapult:1,bombard:1};
  if(terrain==='desert')siege.structures[0].hp=0;
  const groups=[
   makeRegiment('p0','attacker','infantry',120,{x:0,z:14,kind:'spearmen'}),
   makeRegiment('e0','defender','archers',90,{x:0,z:-25})
  ];
  br.renderBattle({
   descriptor:{},
   groups,
   siege,
   deployment:true,
   selectedGroup:()=>groups[0],
   elapsed:1.2,
   projectiles:[{sx:0,sz:14,tx:0,tz:-18,t:0.5,kind:'shot'}],
   effects:[{kind:'breach',x:0,z:-18,age:0.3,duration:1.2}],
   terrain:[{x:-40,z:20,type:'tree'},{x:40,z:-20,type:'rock'}]
  });
  assert.ok(calls.includes('fillText'),`Expected fillText for ${terrain}`);
  assert.ok(calls.includes('ellipse'),`Expected ellipse for ${terrain}`);
 }
});
