import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createGame, restoreGame, snapshot} from '../src/simulation.js';
import {captureProvince, controller, settleOccupations, transferProvince} from '../src/campaign-war.js';
import {characterContext} from '../src/campaign-context.js';
import {politicsAction, removePoliticalCharacter, successionPreview} from '../src/dynastic-politics.js';
import {renderCharacter, renderProvinceConnections} from '../src/kingdom-ui.js';

const world = JSON.parse(readFileSync(new URL('../data/world.json', import.meta.url)));
const provinceOwnedBy = (game, realm) => Object.values(game.provinces).find(p => p.owner === realm).id;

test('military occupation preserves the title until peace transfers legal ownership', () => {
 const game = createGame(world, 'joseon');
 const province = provinceOwnedBy(game, 'ming');
 const titleId = 'c:' + province;
 const lord = game.politics.holdings[province].lord;
 const war = {id:'test-war', attacker:'joseon', defender:'ming', goal:province, status:'active'};
 assert.ok(captureProvince(game, war, 'joseon', province, provinceOwnedBy(game, 'joseon')));
 assert.equal(controller(game, province), 'joseon');
 assert.equal(game.feudal.titles[titleId].holder, lord);
 assert.equal(game.politics.holdings[province].realm, 'ming');

 assert.deepEqual(settleOccupations(game, war, 'claim enforced'), [province]);
 const title = game.feudal.titles[titleId];
 assert.equal(game.provinces[province].owner, 'joseon');
 assert.equal(title.realm, 'joseon');
 assert.equal(title.deJureRealm, 'ming');
 assert.equal(game.politics.people[title.holder].realm, 'joseon');
 assert.equal(game.politics.holdings[province].lord, title.holder);
 assert.equal(game.feudal.titles[title.parent].realm, 'joseon');
 assert.ok(!characterContext(game, lord).holdings.some(h => h.id === province));
 assert.match(renderCharacter(game, world, title.holder, String), /1450 campaign jurisdiction: Ming/);
 assert.match(renderProvinceConnections(game, world, province, String), /1450 campaign jurisdiction/);
 assert.deepEqual(settleOccupations(game, war, 'claim enforced'), []);
 assert.equal(game.feudal.titles[titleId].holder, title.holder);
});

test('independence clears the title immediately and a later annexation creates a new estate', () => {
 const game = createGame(world, 'ming');
 const province = provinceOwnedBy(game, 'ming');
 const titleId = 'c:' + province;
 const original = game.feudal.titles[titleId].holder;
 assert.ok(transferProvince(game, province, 'independent'));
 assert.equal(game.politics.holdings[province], undefined);
 assert.equal(game.feudal.titles[titleId], undefined);
 assert.ok(captureProvince(game, null, 'ming', province));
 assert.notEqual(game.feudal.titles[titleId].holder, original);
 assert.equal(game.feudal.titles[titleId].deJureRealm, 'ming');
});

test('restoring legacy title records reconciles ownership once using the original atlas', () => {
 const game = createGame(world, 'joseon');
 const province = provinceOwnedBy(game, 'ming');
 game.feudal.version = 1;
 for(const district of Object.values(game.feudal.districts))delete district.deJureRealm;
 game.provinces[province].owner = 'joseon';
 const restored = restoreGame(snapshot(game), world);
 const estate = restored.politics.holdings[province];
 assert.equal(estate.realm, 'joseon');
 assert.equal(restored.feudal.titles['c:' + province].deJureRealm, 'ming');
 const again = restoreGame(snapshot(restored), world);
 assert.equal(again.politics.holdings[province].lord, estate.lord);
 assert.equal(again.politics.next, restored.politics.next);
});

test('house seniority previews and installs the same eligible dynast', () => {
 const game = createGame(world, 'ming');
 const realm = game.politics.realms.ming;
 const ruler = game.politics.people[realm.ruler];
 const oldest = game.politics.people[ruler.parents[0]];
 assert.ok(oldest.age > ruler.age);
 game.factions.ming.legitimacy = 85;
 game.factions.ming.treasury = 1000;
 assert.ok(politicsAction(game, world, 'law', 'seniority').ok);
 assert.equal(successionPreview(game, 'ming').id, oldest.id);
 assert.ok(removePoliticalCharacter(game, world, ruler.id));
 assert.equal(realm.ruler, oldest.id);
 assert.equal(game.feudal.titles['k:ming'].holder, oldest.id);
 assert.ok(characterContext(game, oldest.id).titles.some(t => t.id === 'k:ming'));
});
