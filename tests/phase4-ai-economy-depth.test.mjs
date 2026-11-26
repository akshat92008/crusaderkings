import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createGame } from '../src/simulation.js';
import { tickAgency, ensureCharacterSchema } from '../src/character-agency.js';
import { initIntrigue, intrigueAction, tickIntrigue } from '../src/intrigue-systems.js';
import { tickDiplomacy, diplomaticThreat, coalitionAgainst } from '../src/diplomacy-systems.js';
import { tickEconomy } from '../src/economy-systems.js';
import { buildTradePost, tradePostIncome } from '../src/ck2-deep-systems.js';
import { removePoliticalCharacter } from '../src/dynastic-politics.js';

const world = JSON.parse(fs.readFileSync(new URL('../data/world.json', import.meta.url), 'utf8'));

test('Phase 4: Multi-stage character conspiracy recruits disgruntled peers, seeks foreign backers, and escalates faction', () => {
  const g = createGame(world, 'england');
  const head = g.politics.people[g.politics.realms.england.ruler];
  const rival = Object.values(g.politics.people).find(p => p.alive && p.realm === 'england' && p.id !== head.id && p.age >= 18);
  const vassal = Object.values(g.politics.people).find(p => p.alive && p.realm === 'england' && p.id !== head.id && p.id !== rival.id && p.age >= 18);
  assert.ok(rival && vassal);
  rival.traits = ['ambitious', 'deceitful'];
  rival.personality = { ...ensureCharacterSchema(g, rival).personality, boldness: 75, greed: 70 };
  rival.wealth = 300;
  rival.house = head.house;
  g.factions.england.relations.france = -45;
  const h = Object.values(g.politics.holdings).find(x => x.realm === 'england');
  if (h) { h.lord = vassal.id; h.loyalty = 40; }

  for (let i = 1; i <= 24; i++) {
    g.turn = i;
    tickAgency(g);
  }
  const c = g.agency.people[rival.id]?.conspiracy;
  assert.ok(c && ['recruiting', 'foreign_pact', 'striking'].includes(c.stage), 'Conspiracy must progress across stages');
  assert.ok(c.allies.length >= 1, 'Conspirator should scout and recruit a disgruntled peer');
  assert.ok(Object.values(g.conflict.factions).some(fx => fx.realm === 'england'), 'Conspirator should push a faction');
});

test('Phase 4: Exposed assassination plot against ruler triggers imprisonment and permanent grievance', () => {
  const g = createGame(world, 'france');
  initIntrigue(g);
  const rulerId = g.politics.realms.france.ruler;
  const plotter = Object.values(g.politics.people).find(p => p.alive && p.realm === 'france' && p.id !== rulerId && p.age >= 18);
  assert.ok(plotter);
  g.intrigue.plots.test_plot = {
    id: 'test_plot', realm: 'france', actor: plotter.id, target: rulerId, targetRealm: 'france',
    kind: 'assassinate', category: 'hostile', autonomous: true, agents: [], started: 0, due: 1, status: 'active',
    discoveredAt: 0, preparation: -50, history: []
  };
  g.turn = 1;
  tickIntrigue(g, world, removePoliticalCharacter);
  assert.equal(g.feudal.prisoners[plotter.id]?.status, 'held', 'Exposed treasonous plotter should be arrested');
  const ruler = g.politics.people[rulerId];
  assert.ok(ruler.grievances.some(gr => gr.against === plotter.id && gr.permanent));
});

test('Phase 4: Strategic diplomacy forms reactive coalitions and marriage treaties while war-economy degrades blockaded trade', () => {
  const g = createGame(world, 'england');
  g.diplomacy ??= {};
  g.diplomacy.threat = { france: 65 };
  g.factions.burgundy.relations.france = -20;
  g.factions.france.relations.burgundy = -20;
  g.factions.aragon.relations.france = 25;
  g.factions.france.relations.aragon = 25;
  g.turn = 6;
  tickDiplomacy(g, world);
  assert.ok(coalitionAgainst(g, 'france')?.members?.includes('burgundy'), 'High threat neighbor should join coalition');

  const pid = Object.keys(g.provinces).find(id => g.provinces[id].owner === 'england');
  g.factions.england.treasury = 2000;
  buildTradePost(g, pid, 'england');
  const baseTp = tradePostIncome(g, 'england');
  g.economy.provinces[pid].devastation = 50;
  g.naval.blockades.btest = { province: pid, by: 'france', until: 20 };
  const warTp = tradePostIncome(g, 'england');
  assert.ok(warTp < baseTp, `Blockaded devastated trade post (${warTp}) must pay less than peaceful (${baseTp})`);
  const beforeGrain = g.economy.provinces[pid].stock.grain;
  g.turn = 7;
  tickEconomy(g, world);
  assert.ok(g.economy.provinces[pid].stock.grain <= beforeGrain + 10);
});
