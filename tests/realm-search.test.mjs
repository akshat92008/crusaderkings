import assert from 'node:assert/strict';
import test from 'node:test';
import {searchRealms} from '../src/campaign-navigation.js';
const realms=[{id:'england',name:'England',continent:'Europe',government:'Monarchy'},{id:'ming',name:'Ming',continent:'Asia',government:'Empire'},{id:'maori',name:'Māori',continent:'Oceania',government:'Chiefdom'}];
test('realm search supports name, continent, multiple words and accents',()=>{assert.deepEqual(searchRealms(realms,'europe monarchy').map(f=>f.id),['england']);assert.deepEqual(searchRealms(realms,'maori').map(f=>f.id),['maori']);assert.deepEqual(searchRealms(realms,'unknown'),[]);assert.equal(searchRealms(realms,'').length,3);});
