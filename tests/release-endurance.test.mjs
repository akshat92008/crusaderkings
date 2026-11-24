import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {buildHistoricalWorld, expandHistoricalWorld, densifyHistoricalWorld} from '../src/historical-world.js';
import {createGame, advanceMonth, snapshot, restoreGame, empireStats} from '../src/simulation.js';
import {validatePortableSave} from '../src/portable-save.js';

const read = name => JSON.parse(readFileSync(new URL('../data/' + name, import.meta.url)));
const world = densifyHistoricalWorld(expandHistoricalWorld(buildHistoricalWorld(read('world.json'), read('historical-polities-1450.json'))));
const months = Number(process.env.CROWN_ENDURANCE_MONTHS ?? 60);
assert.ok(Number.isInteger(months) && months >= 12 && months <= 3600,
 'CROWN_ENDURANCE_MONTHS must be a whole number between 12 and 3600.');

// Annual checks cover canonical crown, occupation, diplomacy and character records.
function assertCampaignLinks(game){
 for(const [realm,state] of Object.entries(game.politics.realms)){
  assert.equal(game.politics.people[state.ruler]?.alive,true,'Living ruler: '+realm);
  assert.equal(game.feudal.titles['k:'+realm]?.holder,state.ruler,'Crown holder: '+realm);
 }
 for(const [id,o] of Object.entries(game.campaignWar?.occupations||{})){
  assert.ok(game.provinces[id],'Occupation province: '+id);
  assert.equal(game.provinces[id].owner,o.owner,'Occupation legal owner: '+id);
  assert.ok(game.factions[o.by],'Occupying realm: '+id);
  assert.equal(game.conflict.wars[o.war]?.status,'active','Occupation war: '+id);
 }
 for(const p of Object.values(game.politics.people)){
  if(p.alive)assert.ok(Number.isFinite(p.wealth)&&p.wealth>=0,'Personal wealth: '+p.id);
 }
 for(const u of Object.values(game.personalUnions?.unions||{})){
  assert.equal(game.politics.realms[u.senior]?.ruler,u.monarch,'Union senior');
  assert.equal(game.politics.realms[u.junior]?.ruler,u.monarch,'Union junior');
 }
}
function assertTitles(game){
 for(const province of Object.values(game.provinces)){
  const holding = game.politics.holdings[province.id];
  const title = game.feudal.titles['c:' + province.id];
  if(!game.politics.realms[province.owner]){
   assert.equal(holding,undefined,province.id);
   assert.equal(title,undefined,province.id);
   continue;
  }
  assert.equal(holding?.realm,province.owner,province.id);
  assert.equal(title?.holder,holding.lord,province.id);
  assert.equal(game.politics.people[holding.lord]?.alive,true,province.id);
  assert.equal(game.feudal.titles[title.parent]?.realm,province.owner,province.id);
 }
}

for(const [realm,difficulty] of [['england','normal'],['vijayanagara','hard']]){
 test('Release endurance on dense atlas: ' + realm,{timeout:Math.max(240_000,months*900)},()=>{
  let game = createGame(world,realm);
  game.kingdom.difficulty = difficulty;
  for(let i=0;i<months;i++){
   advanceMonth(game,world);
   assert.equal(game.turn,i+1);
   for(const faction of Object.values(game.factions)){
    assert.ok([faction.treasury,faction.food,faction.stability].every(Number.isFinite));
   }
   for(const army of Object.values(game.armies)){
    assert.ok(game.provinces[army.province]);
    assert.ok(['infantry','archers','cavalry'].every(type=>Number.isInteger(army[type])&&army[type]>=0));
   }
   if(i%12===11){
    assertTitles(game);
    assertCampaignLinks(game);
    const raw = snapshot(game);
    validatePortableSave(raw);
    game = restoreGame(raw,world);
    assert.equal(game.turn,i+1);
    assertTitles(game);
    assertCampaignLinks(game);
   }
  }
  assert.ok(Number.isFinite(empireStats(game,realm).balance));
 });
}
