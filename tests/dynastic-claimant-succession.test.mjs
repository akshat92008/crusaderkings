import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createGame } from '../src/simulation.js';
import { installRulerOnThrone } from '../src/campaign-war.js';
import { removePoliticalCharacter } from '../src/dynastic-politics.js';

const world = JSON.parse(readFileSync(new URL('../data/world.json', import.meta.url), 'utf8'));

test('pressing a foreign kingdom claim as a ruling sovereign preserves both crowns through death and succession', () => {
 const g = createGame(world, 'england', { aiAggression: 'normal' });
 const vijRulerId = g.politics.realms.vijayanagara.ruler;
 const vijRuler = g.politics.people[vijRulerId];
 assert.ok(vijRuler?.alive);
 assert.equal(vijRuler.realm, 'vijayanagara');

 // Install Vijayanagara's sovereign onto another crown, then depose him from that second crown.
 const bahmaniFaction = g.politics.realms.bahmani ? 'bahmani' : Object.keys(g.politics.realms).find(r => r !== 'vijayanagara' && r !== 'england');
 assert.ok(installRulerOnThrone(g, bahmaniFaction, vijRulerId, 'kingdom_claim'));
 assert.equal(vijRuler.realm, 'vijayanagara', 'home realm should stay attached to primary sovereign');

 const replacement = Object.values(g.politics.people).find(p => p.alive && p.realm === bahmaniFaction && p.age >= 18 && p.id !== vijRulerId);
 assert.ok(replacement);
 assert.ok(installRulerOnThrone(g, bahmaniFaction, replacement.id, 'deposition'));

 // Even if a save had realm mismatch manually, death must still succeed every ruled crown cleanly.
 vijRuler.realm = bahmaniFaction;
 assert.equal(removePoliticalCharacter(g, world, vijRulerId), true);
 assert.equal(g.politics.people[vijRulerId].alive, false);

 const newVijRuler = g.politics.people[g.politics.realms.vijayanagara.ruler];
 assert.ok(newVijRuler?.alive, 'vijayanagara must receive a living successor');
 assert.notEqual(newVijRuler.id, vijRulerId);
 assert.equal(g.feudal.titles['k:vijayanagara']?.holder, newVijRuler.id);
});
