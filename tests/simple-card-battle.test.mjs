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
