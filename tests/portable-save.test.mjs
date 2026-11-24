import test from 'node:test';
import assert from 'node:assert/strict';
import {validatePortableSave,saveFilename,persistCampaign,SAVE_KEY} from '../src/portable-save.js';
const valid=()=>({version:1,turn:0,year:1450,month:0,player:'a',factions:{a:{id:'a',treasury:100,food:20,stability:75,policies:{}}},provinces:{p:{id:'p',owner:'a',population:100,development:1,unrest:0,buildings:{}}},armies:{a1:{id:'a1',owner:'a',province:'p',infantry:1,archers:0,cavalry:0}}});
test('portable save accepts a valid campaign and names backup',()=>{const g=valid();assert.deepEqual(validatePortableSave(JSON.stringify(g)),g);assert.equal(saveFilename(g),'crown-of-nations-a-1450-01.json');let saved;persistCampaign({setItem(k,v){saved=[k,v];}},JSON.stringify(g));assert.equal(saved[0],SAVE_KEY);});
test('portable save rejects unknown owners, malformed dates and negative troop counts',()=>{for(const alter of [g=>g.provinces.p.owner='missing',g=>g.month=13,g=>g.armies.a1.cavalry=-1]){const g=valid();alter(g);assert.throws(()=>validatePortableSave(JSON.stringify(g)));}});
