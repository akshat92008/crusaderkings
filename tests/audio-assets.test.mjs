import test from 'node:test';
import assert from 'node:assert/strict';
import {statSync,readFileSync} from 'node:fs';
import {SOUNDTRACK,soundtrackPaths} from '../src/soundtrack.js';
import {SAMPLE_FILES,samplePath} from '../src/sample-audio.js';
test('all runtime soundtrack and effect files are actual nonempty MP3 assets',()=>{const paths=new Set([...Object.keys(SOUNDTRACK).flatMap(soundtrackPaths),...Object.values(SAMPLE_FILES).flat().map(samplePath)]);assert.equal(paths.size,17);for(const path of paths){const url=new URL('../'+path,import.meta.url);assert.ok(statSync(url).size>512,path);const b=readFileSync(url);assert.ok(b.subarray(0,3).toString()==='ID3'||(b[0]===255&&(b[1]&224)===224),path+' not MP3');}});
