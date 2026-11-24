import test from 'node:test';
import assert from 'node:assert/strict';
import {CampaignMusic,campaignMusicMode} from '../src/campaign-music.js';
test('region and crisis select campaign music',()=>{assert.equal(campaignMusicMode({player:'vijayanagara'}),'india');assert.equal(campaignMusicMode({player:'ming'}),'east');assert.equal(campaignMusicMode({kingdom:{threats:[{}]}}),'intrigue');});
test('music requires user gesture, switches safely, rotates, and honors mute',()=>{
 const created=[];const m=new CampaignMusic(()=>{const a={play:()=>Promise.resolve(),pause(){this.paused=true;}};created.push(a);return a;},null);
 m.select('battle');assert.equal(created.length,0);m.unlock();assert.ok(created[0].src.endsWith('warfare_1.mp3'));
 created[0].onended();assert.ok(created[0].paused);assert.ok(created[1].src.endsWith('warfare_2.mp3'));
 m.select('india');assert.ok(created[1].paused);assert.ok(created[2].src.endsWith('campaign_india.mp3'));
 m.setEnabled(false);assert.ok(created[2].paused);
});
test('missing assets fall back without retry loops',()=>{
 const created=[];const m=new CampaignMusic(()=>{const a={play:()=>Promise.resolve(),pause(){}};created.push(a);return a;},null);
 m.select('battle');m.unlock();created[0].onerror();created[1].onerror();assert.ok(created[2].src.endsWith('war%20theme.ogg'));created[2].onerror();assert.equal(created.length,3);
});
