import test from 'node:test';
import assert from 'node:assert/strict';
import {initializeFieldGroup,stepField,issueFieldOrder} from '../src/field-tactics.js';
const unit=(id,side,type,x,z,troopCount,extra={})=>initializeFieldGroup({id,side,type,x,z,troopCount,morale:80,damage:10,armor:1,speed:4,range:type==='archers'?14:2.5,cooldown:0,...extra});
test('card battle: archers engage instead of automatically running away',()=>{
 const a=unit('a','attacker','archers',0,0,100),b=unit('b','defender','infantry',0,4,100);
 issueFieldOrder(b,'hold');stepField({simpleField:true,groups:[a,b]},.1);
 assert.equal(a.skirmishing,false);assert.equal(a.z,0);assert.ok(a.attackPulse>0);
});
test('card battle: healthy regiments do not instantly rout at low morale',()=>{
 const a=unit('a','attacker','infantry',0,0,100,{morale:1}),b=unit('b','defender','infantry',0,1,100);
 stepField({simpleField:true,groups:[a,b]},.1);assert.equal(!!a.routed,false);
});
test('card battle: 6000 equal-quality infantry decisively defeat 300',()=>{
 const a=unit('a','attacker','infantry',0,0,6000),b=unit('b','defender','infantry',0,1,300);
 const s={simpleField:true,groups:[a,b],fieldSeed:12};
 for(let i=0;i<1000&&!b.routed;i++)stepField(s,.05);
 assert.ok(b.routed);assert.ok(!a.routed);assert.ok(a.life>90);
});

import {packSpecialistRegiments} from '../src/field-forces.js';
test('specialist cards preserve the exact campaign roster and do not create soldiers',()=>{
 const a={id:'a',infantry:120,archers:50,cavalry:30},defs={pikes:{type:'infantry',name:'Pikes',damage:1,armor:1,speed:1,range:1,counter:2},bowmen:{type:'archers',name:'Bowmen',damage:1,armor:1,speed:1,range:1,counter:1}};
 const cards=packSpecialistRegiments(a,[a],{a:{regiments:{pikes:60,bowmen:25}}},defs,12);
 assert.equal(cards.length,12);
 for(const type of ['infantry','archers','cavalry'])assert.equal(cards.filter(c=>c.type===type).reduce((n,c)=>n+c.troops,0),a[type]);
 assert.equal(cards.filter(c=>c.specialistId==='pikes').reduce((n,c)=>n+c.troops,0),60);
 assert.ok(cards.some(c=>c.profile.name==='Bowmen'));
});

test('card battle: shield_wall reduces incoming ranged damage and morale shock',()=>{
 const a1=unit('a1','attacker','archers',0,0,200),dPlain=unit('d1','defender','infantry',0,10,200);
 const a2=unit('a2','attacker','archers',0,0,200),dWall=unit('d2','defender','infantry',0,10,200,{formationId:'shield_wall'});
 stepField({simpleField:true,groups:[a1,dPlain]},.1);
 stepField({simpleField:true,groups:[a2,dWall]},.1);
 assert.ok(dWall.life>dPlain.life&&dWall.morale>dPlain.morale);
});

test('card battle: pike_square reflects counter-shock onto charging cavalry',()=>{
 const cav1=unit('c1','attacker','cavalry',0,0,120,{formationId:'cavalry_wedge'}),inf1=unit('i1','defender','infantry',0,2,120);
 const cav2=unit('c2','attacker','cavalry',0,0,120,{formationId:'cavalry_wedge'}),pike=unit('p1','defender','infantry',0,2,120,{formationId:'pike_square',kind:'pikemen'});
 stepField({simpleField:true,groups:[cav1,inf1]},.1);
 stepField({simpleField:true,groups:[cav2,pike]},.1);
 assert.ok(cav2.life<cav1.life&&pike.statusFlags.includes('BRACED'));
});

test('card battle: flank bonus multiplies strikes against pinned enemies',()=>{
 const pin=unit('a0','attacker','infantry',0,0,150),solo=unit('a1','attacker','cavalry',1.5,1.5,100),dSolo=unit('d1','defender','infantry',0,2,150);
 const flanker=unit('a2','attacker','cavalry',1.5,1.5,100,{formationId:'flank'}),dPinned=unit('d2','defender','infantry',0,2,150);
 stepField({simpleField:true,groups:[solo,dSolo]},.1);
 stepField({simpleField:true,groups:[pin,flanker,dPinned]},.1);
 assert.ok(flanker.statusFlags.includes('FLANK'));
 assert.ok(dPinned.life<dSolo.life);
});

test('card battle: ambush gains forest cover bonus and skirmish kites rushing foot',()=>{
 const amb=unit('a','attacker','infantry',0,0,120,{formationId:'ambush'}),plain=unit('p','attacker','infantry',0,0,120);
 const d1=unit('d1','defender','infantry',0,2,120),d2=unit('d2','defender','infantry',0,2,120);
 stepField({simpleField:true,terrainType:'forest',groups:[amb,d1]},.1);
 stepField({simpleField:true,terrainType:'plains',groups:[plain,d2]},.1);
 assert.ok(d1.life<d2.life);
 const kiter=unit('k','attacker','archers',0,0,100,{formationId:'skirmish'}),rusher=unit('r','defender','infantry',0,3,100);
 stepField({simpleField:true,groups:[kiter,rusher]},.1);
 assert.equal(kiter.skirmishing,true);assert.ok(kiter.z<0);
});

test('card battle: higher commanderMartial wins an equal mirror match',()=>{
 const strong=unit('a','attacker','infantry',0,0,200,{commanderMartial:18});
 const weak=unit('b','defender','infantry',0,2,200,{commanderMartial:2});
 const s={simpleField:true,groups:[strong,weak]};
 for(let i=0;i<600&&!weak.routed&&!strong.routed;i++)stepField(s,.05);
 assert.ok(weak.routed&&!strong.routed);
});

test('card battle executes hold, a ground move, and a designated charge target',()=>{
 const a=unit('a','attacker','cavalry',0,0,120);
 const front=unit('front','defender','infantry',0,-15,120);
 const rear=unit('rear','defender','archers',20,-20,120);
 const state={simpleField:true,groups:[a,front,rear]};
 issueFieldOrder(a,'hold');
 stepField(state,0.1);
 assert.equal(a.z,0);
 assert.equal(a.moving,false);

 issueFieldOrder(a,'move',[10,0]);
 stepField(state,0.1);
 assert.ok(a.x>0);
 assert.equal(a.z,0);

 issueFieldOrder(a,'charge');
 a.focusTargetId=rear.id;
 stepField(state,0.1);
 assert.equal(a.cardTargetId,rear.id);
 assert.ok(a.z<0);

 issueFieldOrder(a,'fallback');
 const before=a.z;
 stepField(state,0.1);
 assert.ok(a.z>before);
});
