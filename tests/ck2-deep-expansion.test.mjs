import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import {
 createGame,
 advanceMonth,
 empireStats,
 recruitmentQuote,
 negotiate,
 snapshot,
 restoreGame
} from '../src/simulation.js';
import { buildHistoricalWorld, expandHistoricalWorld, densifyHistoricalWorld } from '../src/historical-world.js';
import { validatePortableSave } from '../src/portable-save.js';
import { tickPolitics, politicalRevenue, politicalLevy } from '../src/dynastic-politics.js';
import { councilVotes } from '../src/political-conflict.js';
import { courtLifeView } from '../src/royal-court.js';
import { faithCharterAction } from '../src/faith-institutions.js';
import { economyAction } from '../src/economy-systems.js';
import { heritageAction } from '../src/heritage-systems.js';
import {
 allianceTerms,
 nonAggressionTerms,
 initIndependentPolities,
 tickIndependentPolities,
 polityAction,
 independentPolityTradeIncome,
 ensureCharacterGenetics,
 setChildhoodFocus,
 completeChildEducation,
 characterGeneticModifiers,
 characterTraitOpinion,
 oweFavor,
 callInFavor,
 hasActiveFavor,
 getObligationLaws,
 setObligationLaw,
 grantViceroyalty,
 revertViceroyaltiesOnDeath,
 MINOR_TITLES,
 grantMinorTitle,
 revokeMinorTitle,
 getMoralAuthority,
 adjustMoralAuthority,
 promoteCardinal,
 appointAntipope,
 deposeAntipope,
 antipopeAction,
 declareCrusade,
 pledgeCrusade,
 crusadeSummary,
 resolveCrusadeIfReady,
 SOCIETIES,
 joinSociety,
 advanceSocietyRank,
 societyMission,
 societyModifiers,
 BLOODLINES,
 inheritBloodlines,
 forgeBloodlineAmbition,
 characterBloodlines,
 bloodlineModifiers,
 initSiegeForMarch,
 advanceProvinceSieges,
 assaultSiege,
 activeSiegeAt,
 getProvinceProsperity,
 adjustProvinceProsperity,
 buildTradePost,
 tradePostIncome,
 GREAT_WORK_KINDS,
 startGreatWork,
 upgradeGreatWork,
 greatWorkModifiers,
 applyCrossSystemChoice,
 deepSystemsView
} from '../src/ck2-deep-systems.js';

const readJson = name => JSON.parse(readFileSync(new URL('../data/' + name, import.meta.url)));
const baseWorld = readJson('world.json');
const polities1450 = readJson('historical-polities-1450.json');
const denseWorld = densifyHistoricalWorld(expandHistoricalWorld(buildHistoricalWorld(baseWorld, polities1450)));

test('1. Weighted CK2 alliance and NAP terms use transparent factors and gate negotiate', () => {
 const g = createGame(baseWorld, 'france');
 // Even if basic relation >= 35, an infidel / distant / high-threat realm declines alliance
 g.factions.france.relations.ming = 45;
 g.factions.ming.relations.france = 45;
 g.diplomacy.threat.france = 35;

 const remoteTerms = allianceTerms(g, 'france', 'ming', baseWorld);
 assert.equal(remoteTerms.accepted, false);
 assert.ok(Array.isArray(remoteTerms.factors) && remoteTerms.factors.length >= 4);
 assert.ok(Number.isFinite(remoteTerms.score) && Number.isFinite(remoteTerms.threshold));
 assert.ok(remoteTerms.factors.some(x => x.label.includes('Threat') && x.value < 0));
 assert.ok(remoteTerms.factors.some(x => x.label.includes('faith') && x.value < 0));

 const refused = negotiate(g, 'ming', 'alliance', baseWorld);
 assert.equal(refused.ok, false);
 assert.ok(refused.terms && refused.terms.accepted === false);

 // Compatible neighbor (same faith, low threat, marriage tie, good relations) accepts alliance
 g.diplomacy.threat.france = 0;
 g.factions.france.relations.castile = 55;
 g.factions.castile.relations.france = 55;
 g.factions.france.treaties.castile = 'marriage';
 g.factions.castile.treaties.france = 'marriage';
 const closeTerms = allianceTerms(g, 'france', 'castile', baseWorld);
 assert.equal(closeTerms.accepted, true);
 assert.ok(closeTerms.factors.some(x => x.label.includes('marriage') && x.value > 0));

 const sealed = negotiate(g, 'castile', 'alliance', baseWorld);
 assert.equal(sealed.ok, true);
 assert.equal(g.factions.france.treaties.castile, 'alliance');
 assert.equal(g.factions.castile.treaties.france, 'alliance');

 // Non-aggression terms evaluate hostile vs friendly courts
 g.factions.england.relations.france = -50;
 const hostileNap = nonAggressionTerms(g, 'france', 'england', baseWorld);
 assert.equal(hostileNap.accepted, false);
 assert.equal(negotiate(g, 'england', 'non_aggression', baseWorld).ok, false);

 g.factions.england.relations.france = 40;
 g.factions.france.relations.england = 40;
 g.factions.france.treasury = 500;
 const friendlyNap = nonAggressionTerms(g, 'france', 'england', baseWorld);
 assert.equal(friendlyNap.accepted, true);
 const pactRes = negotiate(g, 'england', 'non_aggression', baseWorld);
 assert.equal(pactRes.ok, true);
});

test('2. 316 living independent polities stay separate from politics.realms and support all polity actions', () => {
 const g = createGame(denseWorld, 'england');
 const indIds = Object.values(g.provinces).filter(p => p.owner === 'independent').map(p => p.id);
 assert.ok(indIds.length >= 316, `Expected >= 316 independent polities, got ${indIds.length}`);
 assert.equal(Object.keys(g.independentPolities).length, indIds.length);
 assert.equal(g.politics.realms.independent, undefined);

 // Hard invariant: independent provinces must never exist in politics.holdings or province titles
 for (const pid of indIds) {
  assert.equal(g.politics.holdings[pid], undefined);
  assert.equal(g.feudal.titles['c:' + pid], undefined);
  const pol = g.independentPolities[pid];
  assert.ok(pol.name && pol.ruler?.dynasty && pol.faith && pol.culture);
  assert.ok(['autonomous', 'tributary', 'threatened', 'hostile'].includes(pol.stance));
 }

 g.factions.england.treasury = 4000;
 g.factions.england.prestige = 400;

 // Trade compact
 const pTrade = indIds[0];
 const tradeRes = polityAction(g, pTrade, 'trade_compact');
 assert.equal(tradeRes.ok, true);
 assert.ok(independentPolityTradeIncome(g, 'england') > 0);
 assert.ok(empireStats(g, 'england').tradePosts >= independentPolityTradeIncome(g, 'england'));

 // Protectorate
 const pProt = indIds[1];
 const protRes = polityAction(g, pProt, 'protectorate', { force: true });
 assert.equal(protRes.ok, true);
 assert.equal(g.independentPolities[pProt].stance, 'tributary');
 assert.equal(g.independentPolities[pProt].suzerain, 'england');

 // Missionary conversion (different faith polity)
 const pMiss = indIds.find(id => g.independentPolities[id].faith !== g.civic.realms.england.faith) || indIds[2];
 const maBefore = getMoralAuthority(g, 'catholic');
 const missRes = polityAction(g, pMiss, 'missionary', { force: true });
 assert.equal(missRes.ok, true);
 assert.equal(missRes.converted, true);
 assert.equal(g.independentPolities[pMiss].faith, g.civic.realms.england.faith);
 assert.ok(getMoralAuthority(g, 'catholic') >= maBefore);

 // Raid
 const pRaid = indIds[3];
 const treasBeforeRaid = g.factions.england.treasury;
 const raidRes = polityAction(g, pRaid, 'raid', { force: true });
 assert.equal(raidRes.ok, true);
 assert.equal(g.independentPolities[pRaid].stance, 'hostile');
 assert.ok(g.factions.england.treasury >= treasBeforeRaid);

 // Tick autonomous polities cleanly
 g.turn = 12;
 tickIndependentPolities(g, denseWorld);
 assert.equal(g.politics.realms.independent, undefined);

 // Subjugate annexes territory and removes independentPolities entry while maintaining title/holding coherence
 const pSub = indIds[4];
 const subRes = polityAction(g, pSub, 'subjugate', { force: true });
 assert.equal(subRes.ok, true);
 assert.equal(g.provinces[pSub].owner, 'england');
 assert.equal(g.independentPolities[pSub], undefined);
 assert.equal(g.politics.holdings[pSub].realm, 'england');
 assert.equal(g.feudal.titles['c:' + pSub].realm, 'england');
});

test('3. Character genetics, deterministic DNA/congenital inheritance, childhood focus and age-16 education', () => {
 const g = createGame(baseWorld, 'france');
 const rId = g.politics.realms.france.ruler;
 const ruler = g.politics.people[rId];
 ruler.congenital = ['genius', 'strong'];
 const spouse = g.politics.people[ruler.spouse] || Object.values(g.politics.people).find(p => p.alive && p.realm === 'france' && p.id !== rId);
 spouse.congenital = ['genius', 'attractive'];

 // Child born deterministically inherits DNA & congenital traits
 const childId = 'child_gen_1';
 const child = {
  id: childId,
  realm: 'france',
  house: ruler.house,
  name: 'Louis Test',
  age: 14,
  alive: true,
  sex: 'male',
  parents: [ruler.id, spouse.id],
  children: [],
  spouse: null,
  spouses: [],
  concubines: [],
  traits: ['diligent'],
  skills: { diplomacy: 1, martial: 1, stewardship: 1, intrigue: 1, learning: 1 },
  wealth: 10,
  prestige: 5,
  piety: 2
 };
 g.politics.people[childId] = child;
 ensureCharacterGenetics(child, [ruler, spouse], 'fixed-genetics-seed-1');
 assert.equal(child.dna.length, 16);
 assert.equal(child.educationTrait, null);
 assert.ok(child.congenital.includes('genius') || child.congenital.includes('quick'));

 // Set guardian with high martial and struggle focus
 ruler.skills.martial = 5;
 ruler.traits = [...new Set([...(ruler.traits || []), 'diligent'])];
 const focusRes = setChildhoodFocus(g, childId, 'struggle', ruler.id);
 assert.equal(focusRes.ok, true);
 assert.equal(child.childhoodFocus, 'struggle');
 assert.equal(child.guardianId, ruler.id);

 // Advance child to 15, then trigger annual tickPolitics at age 16 graduation
 child.age = 15;
 const martialBefore = child.skills.martial;
 g.turn = 12;
 g.politics.lastTick = 11;
 tickPolitics(g, baseWorld);
 assert.equal(child.age, 16);
 assert.ok(['misguided_warrior', 'tough_soldier', 'skilled_tactician', 'brilliant_strategist'].includes(child.educationTrait));
 assert.ok(child.skills.martial > martialBefore);

 const gMod = characterGeneticModifiers(child);
 assert.ok(gMod.prestigeMonthly > 0);
 assert.ok(characterTraitOpinion(ruler, child) > 0);
});

test('4. Conclave favors, granular obligation laws, viceroyalties, and minor titles work end-to-end', () => {
 const g = createGame(baseWorld, 'england');
 const rId = g.politics.realms.england.ruler;
 const s = g.politics.realms.england;
 g.conflict.council.england = 'binding';

 // Make steward hostile so they vote NO without a favor
 const stewardId = s.council.steward;
 const steward = g.politics.people[stewardId];
 g.factions.england.legitimacy = 35;
 g.factions.england.stability = 35;
 steward.traits = ['ambitious', 'just'];
 const beforeVotes = councilVotes(g, 'england', 'revoke');
 const stewardBefore = beforeVotes.find(v => v.id === stewardId);
 assert.equal(stewardBefore.yes, false);

 // Owe and call in favor -> sways vote to YES
 assert.ok(oweFavor(g, rId, stewardId, 'estate debt').ok);
 assert.ok(hasActiveFavor(g, rId, stewardId));
 assert.ok(callInFavor(g, rId, stewardId, 'council_vote').ok);
 const afterVotes = councilVotes(g, 'england', 'revoke');
 const stewardAfter = afterVotes.find(v => v.id === stewardId);
 assert.equal(stewardAfter.favor, true);
 assert.equal(stewardAfter.yes, true);

 // Diplomatic favor boost on allianceTerms
 const frRulerId = g.politics.realms.france.ruler;
 g.factions.england.relations.france = 10;
 g.factions.france.relations.england = 10;
 const baseAli = allianceTerms(g, 'england', 'france', baseWorld).score;
 assert.ok(oweFavor(g, rId, frRulerId, 'crown accord').ok);
 assert.ok(callInFavor(g, rId, frRulerId, 'alliance', 'france').ok);
 const boostedAli = allianceTerms(g, 'england', 'france', baseWorld).score;
 assert.equal(boostedAli, baseAli + 25);

 // Granular Obligation Laws directly alter tax revenue vs levy contribution
 const revBal = politicalRevenue(g, 'england');
 const levBal = politicalLevy(g, 'england');
 assert.ok(setObligationLaw(g, 'feudal', 'tax', 'england').ok);
 assert.ok(setObligationLaw(g, 'city', 'tax', 'england').ok);
 assert.equal(getObligationLaws(g, 'england').feudalObligations, 'tax');
 assert.ok(politicalRevenue(g, 'england') > revBal);
 assert.ok(politicalLevy(g, 'england') < levBal);
 assert.ok(setObligationLaw(g, 'feudal', 'levy', 'england').ok);
 assert.ok(setObligationLaw(g, 'city', 'levy', 'england').ok);
 assert.ok(politicalLevy(g, 'england') > levBal);

 // Viceroyalty reverts cleanly to crown on death instead of passing to vassal's heir
 const ownProv = Object.keys(g.politics.holdings).find(id => g.politics.holdings[id].realm === 'england');
 const vassalId = Object.values(g.politics.people).find(p => p.alive && p.realm === 'england' && p.id !== rId && p.age >= 18).id;
 assert.ok(grantViceroyalty(g, ownProv, vassalId, 'england').ok);
 assert.equal(g.politics.holdings[ownProv].lord, vassalId);
 assert.equal(g.feudal.titles['c:' + ownProv].viceroyalty, true);

 const vassal = g.politics.people[vassalId];
 vassal.alive = false;
 const reverted = revertViceroyaltiesOnDeath(g, vassal);
 assert.ok(reverted.length >= 1);
 assert.equal(g.politics.holdings[ownProv].lord, rId);
 assert.equal(g.feudal.titles['c:' + ownProv].holder, rId);
 assert.equal(g.feudal.titles['c:' + ownProv].viceroyalty, undefined);

 // Minor titles grant prestige, opinion, and courtLifeView bonus
 assert.ok(MINOR_TITLES.seneschal && MINOR_TITLES.designated_regent);
 const targetCourtier = Object.values(g.politics.people).find(p => p.alive && p.realm === 'england' && p.id !== rId && p.age >= 18);
 const mtRes = grantMinorTitle(g, targetCourtier.id, 'seneschal', 'england');
 assert.equal(mtRes.ok, true);
 const view = courtLifeView(g, 'england');
 assert.ok(view.components.some(c => c.name === 'Minor court titles' && c.value > 0));
 assert.ok(revokeMinorTitle(g, 'seneschal', 'england').ok);
});

test('5. Moral authority, College of Cardinals, Antipopes, and Crusades / Great Holy Wars', () => {
 const g = createGame(baseWorld, 'france');
 g.factions.france.treasury = 2500;
 g.factions.england.treasury = 2500;
 const rId = g.politics.realms.france.ruler;
 const bishop = Object.values(g.politics.people).find(p => p.alive && p.realm === 'france' && p.id !== rId && p.age >= 18);

 // Promote Cardinal
 const cardRes = faithCharterAction(g, 'france', 'faith-promote-cardinal', bishop.id, 180);
 assert.equal(cardRes.ok, true);
 assert.equal(cardRes.elevated, true);
 assert.ok(deepSystemsView(g, 'france').cardinals.seats.some(s => s.personId === bishop.id));

 // Appoint & use Antipope -> lowers moral authority and foreign Catholic relations
 const maBefore = getMoralAuthority(g, 'catholic');
 const engRelBefore = g.factions.england.relations.france || 0;
 const antiRes = appointAntipope(g, bishop.id, 'france');
 assert.equal(antiRes.ok, true);
 assert.ok(getMoralAuthority(g, 'catholic') <= maBefore - 10);
 assert.ok(g.factions.england.relations.france < engRelBefore);

 const taxRes = antipopeAction(g, 'tax', null, 'france');
 assert.equal(taxRes.ok, true);
 assert.ok(taxRes.gold > 0);
 assert.ok(antipopeAction(g, 'excommunicate', 'england', 'france').ok);
 assert.equal(g.identity.realms.england.faithSystem.excommunicated, true);
 if (g.politics.people[rId].spouse) {
  assert.ok(antipopeAction(g, 'divorce', null, 'france').ok);
  assert.equal(g.politics.people[rId].spouse, null);
 }

 // Depose Antipope restores moral authority & relations
 assert.ok(deposeAntipope(g, 'france', 'france').ok);
 assert.ok(getMoralAuthority(g, 'catholic') > maBefore - 10);

 // Crusade / Great Holy War declaration, pledge, warchest & victory rewards
 const cruRes = declareCrusade(g, 'ottomans', 'france');
 assert.equal(cruRes.ok, true);
 assert.ok(pledgeCrusade(g, 'england').ok);
 const sum = crusadeSummary(g);
 assert.equal(sum.active, true);
 assert.ok(sum.participants.includes('france') && sum.participants.includes('england'));
 assert.ok(sum.warChest > 350);

 const engTreas = g.factions.england.treasury;
 const engPiety = g.politics.people[g.politics.realms.england.ruler].piety;
 const resolved = resolveCrusadeIfReady(g, true);
 assert.equal(resolved.status, 'victory');
 assert.ok(g.factions.england.treasury > engTreas);
 assert.ok(g.politics.people[g.politics.realms.england.ruler].piety > engPiety);
});

test('6. Societies and historical + forged dynastic bloodlines', () => {
 const g = createGame(baseWorld, 'ottomans');
 const rId = g.politics.realms.ottomans.ruler;
 const ruler = g.politics.people[rId];

 // Historical bloodline seeded on Ottomans
 const starterBls = characterBloodlines(g, rId);
 assert.ok(starterBls.length >= 1);
 assert.ok(BLOODLINES.bloodline_osman);

 // Join society, run missions, advance rank
 assert.ok(Object.keys(SOCIETIES).length === 4);
 const joinRes = heritageAction(g, 'ottomans', 'join-society', 'hermetic_society');
 assert.equal(joinRes.ok, true);
 const learningBefore = ruler.skills.learning;
 const misRes = heritageAction(g, 'ottomans', 'society-mission');
 assert.equal(misRes.ok, true);
 assert.ok(misRes.devotion >= 80);
 const rankRes = heritageAction(g, 'ottomans', 'advance-society');
 assert.equal(rankRes.ok, true);
 assert.equal(rankRes.membership.rank, 2);
 assert.ok(ruler.skills.learning >= learningBefore + 1);
 assert.ok(societyModifiers(g, 'ottomans').researchBonus > 0);

 // Forge bloodline at >= 150 prestige and verify descendant inheritance
 g.factions.ottomans.prestige = 220;
 const forgeRes = forgeBloodlineAmbition(g, 'conqueror', rId);
 assert.equal(forgeRes.ok, true);
 const blCountBefore = characterBloodlines(g, rId).length;
 assert.ok(blCountBefore >= 2);
 assert.ok(bloodlineModifiers(g, 'ottomans').vassalOpinion > 0);

 // Child created after forging inherits the forged bloodline
 const spouseId = ruler.spouse;
 const heirBaby = {
  id: 'ottoman_heir_bl',
  realm: 'ottomans',
  house: ruler.house,
  name: 'Bayezid Test',
  age: 0,
  alive: true,
  sex: 'male',
  parents: [rId, ...(spouseId ? [spouseId] : [])],
  children: [],
  skills: { diplomacy: 2, martial: 2, stewardship: 2, intrigue: 2, learning: 2 }
 };
 g.politics.people[heirBaby.id] = heirBaby;
 // Inherit forged bloodline directly via inheritBloodlines
 inheritBloodlines(g, heirBaby, [ruler]);
 assert.equal(characterBloodlines(g, heirBaby.id).length, blCountBefore);
});

test('7. Strategic county sieges, province prosperity, trade posts, and Great Works', () => {
 const g = createGame(baseWorld, 'ottomans');
 g.factions.ottomans.treasury = 5000;
 const ownProv = Object.keys(g.provinces).find(id => g.provinces[id].owner === 'ottomans');
 const wp = baseWorld.provinces.find(p => p.id === ownProv);
 const targetProv = (wp.neighbors || []).find(nid => g.provinces[nid]?.owner && g.provinces[nid].owner !== 'ottomans')
  || Object.keys(g.provinces).find(id => g.provinces[id].owner !== 'ottomans' && g.provinces[id].owner !== 'independent');
 const army = Object.values(g.armies).find(a => a.owner === 'ottomans');
 army.province = ownProv;
 army.infantry = 450;

 // Trade post + Great Work in home province
 const tp1 = economyAction(g, 'ottomans', 'trade-post', ownProv);
 assert.equal(tp1.ok, true);
 assert.ok(tradePostIncome(g, 'ottomans') > 0);
 assert.ok(empireStats(g, 'ottomans').tradePosts >= tradePostIncome(g, 'ottomans'));

 const gwStart = startGreatWork(g, ownProv, 'royal_palace', 'ottomans');
 assert.equal(gwStart.ok, true);
 assert.equal(GREAT_WORK_KINDS.royal_palace.id, 'royal_palace');
 const gwUp = upgradeGreatWork(g, ownProv, 'ottomans');
 assert.equal(gwUp.ok, true);
 assert.ok(greatWorkModifiers(g, 'ottomans').vassalOpinion > 0);

 // Prosperity modifies tax & levy quotes
 adjustProvinceProsperity(g, ownProv, 220);
 const prosTier = getProvinceProsperity(g, ownProv);
 assert.ok(prosTier >= 2);
 const qHigh = recruitmentQuote(g, ownProv, 'infantry').count;
 adjustProvinceProsperity(g, ownProv, -300);
 assert.equal(getProvinceProsperity(g, ownProv), 0);
 const qLow = recruitmentQuote(g, ownProv, 'infantry').count;
 assert.ok(qHigh > qLow);

 // Siege & assault against enemy province during war
 const defender = g.provinces[targetProv].owner;
 const warId = 'w_siege_test';
 g.conflict.wars[warId] = { id: warId, attacker: 'ottomans', defender, cb: 'county_claim', goal: targetProv, started: 0, status: 'active', score: 0 };
 const siegeRes = initSiegeForMarch(g, ownProv, targetProv, [army.id], { attacker: 'ottomans' });
 assert.equal(siegeRes.ok, true);
 const marchId = siegeRes.marchId;
 assert.ok(activeSiegeAt(g, targetProv));

 advanceProvinceSieges(g, baseWorld);
 const midSiege = activeSiegeAt(g, targetProv);
 assert.ok(midSiege.progress > 0 && midSiege.breach > 0);

 // Press assault until captured
 for (let step = 0; step < 5 && activeSiegeAt(g, targetProv); step++) {
  assaultSiege(g, marchId);
 }
 assert.equal(activeSiegeAt(g, targetProv), null);
 assert.equal(g.campaignWar.occupations[targetProv]?.by, 'ottomans');
 assert.ok(g.conflict.wars[warId].score >= 65);
});

test('8. Cross-system consequence engine, delayed followups, and save/load compatibility', () => {
 const g = createGame(baseWorld, 'france');
 const rId = g.politics.realms.france.ruler;
 const goldBefore = g.factions.france.treasury;
 const engRelBefore = g.factions.france.relations.england || 0;
 const maBefore = getMoralAuthority(g, 'catholic');

 const badges = applyCrossSystemChoice(g, {
  gold: -120,
  prestige: 35,
  piety: 20,
  legitimacy: 6,
  stability: 4,
  threat: 5,
  moralAuthority: 4,
  vassalOpinion: 8,
  factionRelation: { england: -15 },
  courtLoyalty: 10,
  addTrait: 'strong',
  prosperityDelta: 1,
  followup: {
   id: 'fu_test_bundle',
   delayTurns: 2,
   label: 'Royal Charter Dividends',
   effectSpec: { gold: 90, stability: 2 }
  }
 });

 assert.ok(Array.isArray(badges) && badges.length >= 10);
 assert.equal(g.factions.france.treasury, goldBefore - 120);
 assert.equal(g.factions.france.relations.england, engRelBefore - 15);
 assert.equal(getMoralAuthority(g, 'catholic'), maBefore + 4);
 assert.ok(g.politics.people[rId].congenital.includes('strong'));

 // Advance 2 months so scheduled cross-system followup fires
 advanceMonth(g, baseWorld);
 advanceMonth(g, baseWorld);
 assert.equal(g.deepSystems.followups.length, 0);

 // Save/load round-trip + portable save check
 const rawSave = snapshot(g);
 assert.ok(validatePortableSave(rawSave).version === 1);
 const restored = restoreGame(rawSave, baseWorld);
 assert.equal(restored.deepSystems.version, 1);
 assert.equal(Object.keys(restored.independentPolities).length, 59);

 // Lazy initialization of legacy saves missing deepSystems & independentPolities
 const legacyObj = JSON.parse(rawSave);
 delete legacyObj.deepSystems;
 delete legacyObj.independentPolities;
 const migrated = restoreGame(JSON.stringify(legacyObj), baseWorld);
 assert.ok(migrated.deepSystems && migrated.deepSystems.version === 1);
 assert.equal(Object.keys(migrated.independentPolities).length, 59);

 // Also verify dense 1450 atlas lazy migration retains all independent polities
 const gDense = createGame(denseWorld, 'england');
 const denseIndCount = Object.values(gDense.provinces).filter(p => p.owner === 'independent').length;
 const rawDense = snapshot(gDense);
 const legacyDense = JSON.parse(rawDense);
 delete legacyDense.deepSystems;
 delete legacyDense.independentPolities;
 const migratedDense = restoreGame(JSON.stringify(legacyDense), denseWorld);
 assert.equal(Object.keys(migratedDense.independentPolities).length, denseIndCount);
});
