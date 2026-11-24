import assert from 'node:assert/strict';
import test from 'node:test';
import {CampaignMap} from '../src/map.js';
const geo=(x,y)=>({type:'Polygon',coordinates:[[[x,y],[x+2,y],[x+2,y+2],[x,y+2],[x,y]]]});
test('realm map seats move to owned districts and eliminated realms disappear',()=>{const m=Object.create(CampaignMap.prototype);m.world={factions:[{id:'a',capital:[1,1]},{id:'b',capital:[5,1]}],provinces:[{id:'p',owner:'a',centroid:[1,1],geometry:geo(0,0)},{id:'q',owner:'a',centroid:[3,1],geometry:geo(2,0)},{id:'r',owner:'b',centroid:[5,1],geometry:geo(4,0)}]};assert.deepEqual(m._realmSeats().find(x=>x.f.id==='a').point,[1,1]);m.game={factions:{a:m.world.factions[0],b:m.world.factions[1]},provinces:{p:{owner:'b'},q:{owner:'a'},r:{owner:'b'}}};assert.deepEqual(m._realmSeats().find(x=>x.f.id==='a').point,[3,1]);m.game.provinces.q.owner='b';assert.equal(m._realmSeats().length,1);});
