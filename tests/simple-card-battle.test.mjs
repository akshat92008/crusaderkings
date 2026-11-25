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
