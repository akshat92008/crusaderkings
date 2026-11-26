import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createGame } from '../src/simulation.js';
import { expandedDecisions } from '../src/expanded-content.js';
import { exportModTemplate, validateModPack, applyModPack } from '../src/mod-loader.js';

const world = JSON.parse(fs.readFileSync(new URL('../data/world.json', import.meta.url), 'utf8'));

test('Mod Loader validates, rejects unsafe payloads, and applies custom scenarios/decisions', () => {
 const tmpl = exportModTemplate();
 assert.equal(validateModPack(tmpl).id, tmpl.id);
 assert.throws(() => validateModPack('{"__proto__":{},"id":"bad","name":"Bad"}'), /Unsafe mod key/);
 assert.throws(() => validateModPack({ name: 'Missing id' }), /non-empty string id/);

 const g = createGame(world, 'england');
 const res = applyModPack(g, world, tmpl);
 assert.equal(res.ok, true);
 assert.equal(g.factions.england.name, 'Angevin Crown');
 assert.ok(expandedDecisions(g, world, 'england').some(d => d.id === 'mod_royal_charter'));
});
