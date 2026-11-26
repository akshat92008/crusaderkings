import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {buildHistoricalWorld,expandHistoricalWorld,densifyHistoricalWorld} from '../src/historical-world.js';
import {inside} from '../src/map.js';
import {geographicIndex} from '../src/render-performance.js';
const read=name=>JSON.parse(readFileSync(new URL('../data/'+name,import.meta.url)));
test('dense atlas indexed selection matches exact reverse-order polygon selection across the globe',()=>{const world=densifyHistoricalWorld(expandHistoricalWorld(buildHistoricalWorld(read('world.json'),read('historical-polities-1450.json'))));assert.ok(world.provinces.length>=700);const index=geographicIndex(world.provinces);let points=0,fullChecks=0,indexChecks=0;for(let lon=-177;lon<180;lon+=5.5)for(let lat=-58;lat<84;lat+=4.8){let expected=null;for(let j=world.provinces.length-1;j>=0;j--){fullChecks++;if(inside(lon,lat,world.provinces[j].geometry)){expected=world.provinces[j];break;}}const actual=index.pick(lon,lat,(x,y,geo)=>{indexChecks++;return inside(x,y,geo);});assert.equal(actual?.id,expected?.id);points++;}assert.equal(points,1950);assert.ok(indexChecks<fullChecks/100);});
