// Pillar 10: Random Emergent Chaos Events — deterministic, memorable, zero Math.random().
import {recordStoryFlag} from './chronicle-systems.js';
import {addStress} from './character-agency.js';
import {humanControlsRealm} from './player-career.js';

const cap = (n, a, b) => Math.max(a, Math.min(b, n));
const ok = msg => ({ ok: true, msg });
const no = msg => ({ ok: false, msg });
const hash = s => {
  let n = 2166136261;
  for (const c of String(s || '')) n = Math.imul(n ^ c.charCodeAt(0), 16777619);
  return n >>> 0;
};

export const CHAOS_EVENT_TEMPLATES = [
  {
    id: 'heir_enemy_romance',
    title: 'Forbidden Romance Across the Border',
    build(g) {
      const realm = g.player;
      const rState = g.politics?.realms?.[realm];
      const heir = g.politics?.people?.[rState?.heir];
      const rivalId = Object.keys(g.factions || {})
        .filter(id => id !== realm && id !== 'independent')
        .sort((a, b) => (g.factions[realm]?.relations?.[a] ?? 0) - (g.factions[realm]?.relations?.[b] ?? 0))[0];
      const rival = g.factions?.[rivalId];
      if (!heir?.alive || !rival) return null;
      return {
        id: 'heir_enemy_romance',
        realm,
        rivalId,
        heirId: heir.id,
        title: 'Forbidden Romance Across the Border',
        text: `Secret letters reveal your heir ${heir.name} has fallen deeply in love with a noble scion of ${rival.name}. Courtiers whisper of scandal—or an unexpected bridge to peace.`,
        choices: [
          { id: 'bless_union', label: `Bless the Match (+30 Relations with ${rival.name}, -10 Prestige, +15 Legitimacy)` },
          { id: 'forbid_love', label: `Forbid the Romance (+10 Prestige, ${heir.name} gains +35 Stress)` },
          { id: 'use_as_spy', label: `Exploit the Letters for Intrigue (+20 Intrigue Whisper, -15 Relations)` }
        ]
      };
    }
  },
  {
    id: 'star_general_defection',
    title: 'A Rival Marshal Offers His Sword',
    build(g) {
      const realm = g.player;
      const rivalId = Object.keys(g.factions || {})
        .filter(id => id !== realm && id !== 'independent')
        .sort((a, b) => a.localeCompare(b))[hash(`${realm}:${g.turn}:defector`) % Math.max(1, Object.keys(g.factions || {}).length - 2)];
      const rival = g.factions?.[rivalId];
      if (!rival) return null;
      const names = ['Captain Matteo d’Este', 'General Iskander Bey', 'Lord Konrad von Stein', 'Commander Arjun Rao'];
      const name = names[hash(`${realm}:${g.turn}:genname`) % names.length];
      return {
        id: 'star_general_defection',
        realm,
        rivalId,
        generalName: name,
        title: 'A Rival Marshal Offers His Sword',
        text: `${name}, a celebrated veteran commander disgraced at the court of ${rival.name}, arrives at your border offering his tactical manuals and sword in exchange for asylum and command.`,
        choices: [
          { id: 'welcome_general', label: `Grant Sanctuary & Command (Recruit Martial 16 General, -80g, -20 Relations with ${rival.name})` },
          { id: 'extradite', label: `Extradite Him to ${rival.name} (+25 Relations, +90g Bounty)` },
          { id: 'dismiss', label: `Turn Him Away Quietly (+5 Stability)` }
        ]
      };
    }
  },
  {
    id: 'comet_sighted',
    title: 'A Great Comet Blazes Across the Heavens',
    build(g) {
      const realm = g.player;
      return {
        id: 'comet_sighted',
        realm,
        title: 'A Great Comet Blazes Across the Heavens',
        text: 'For seven nights a fiery tailed star has split the sky above the capital. Peasants pray in the streets, astrologers warn of fallen crowns, and your scholars scramble for astrolabes.',
        choices: [
          { id: 'royal_omen', label: 'Proclaim It an Omen of Royal Triumph (+15 Prestige, -3 Stability)' },
          { id: 'fund_astronomers', label: 'Commission Astronomical Study (-45g, +20 Capital Knowledge)' },
          { id: 'fast_prayers', label: 'Declare a Day of Penitence (+6 Stability, +8 Legitimacy)' }
        ]
      };
    }
  },
  {
    id: 'foreign_scholar_asylum',
    title: 'Exiled Polymath Seeks Royal Patronage',
    build(g) {
      const realm = g.player;
      const scholars = ['Master Niccolò of Rhodes', 'Hakim al-Shirazi', 'Pandit Vishwanath', 'Doctor Erasmus of Basel'];
      const scholarName = scholars[hash(`${realm}:${g.turn}:sch`) % scholars.length];
      return {
        id: 'foreign_scholar_asylum',
        realm,
        scholarName,
        title: 'Exiled Polymath Seeks Royal Patronage',
        text: `${scholarName}, fleeing persecution abroad with chests of rare manuscripts and printing plates, petitions your court for patronage.`,
        choices: [
          { id: 'patronize_scholar', label: `Establish a Royal Chair (-60g, +25 Knowledge, Recruit Learning 16 Scholar)` },
          { id: 'buy_books', label: `Purchase Only the Manuscripts (-35g, +12 Knowledge, +5 Prestige)` },
          { id: 'decline', label: `Decline to Avoid Clerical Friction (+4 Stability)` }
        ]
      };
    }
  }
];

export function tickChaosEvents(g, world) {
  if (!g || !humanControlsRealm(g, g.player)) return;
  const root = g.chronicles ??= { version: 1, relationships: {}, memories: {}, storyFlags: [], history: [], lastTick: -1 };
  if (root.pendingChaosEvent) return;
  const last = root.lastChaosTurn ?? -12;
  if (g.turn < 10 || (g.turn - last) < 15) return;
  const roll = hash(`${g.player}:${g.turn}:chaos`) % 100;
  if (roll >= 38) return;
  const idx = hash(`${g.player}:${g.turn}:chaos_pick`) % CHAOS_EVENT_TEMPLATES.length;
  const ev = CHAOS_EVENT_TEMPLATES[idx].build(g, world);
  if (!ev) return;
  root.lastChaosTurn = g.turn;
  root.pendingChaosEvent = { ...ev, turn: g.turn };
}

export function currentChaosEvent(g) {
  const ev = g?.chronicles?.pendingChaosEvent;
  return ev && ev.realm === g.player ? ev : null;
}

export function resolveChaosEvent(g, choiceId) {
  const ev = currentChaosEvent(g);
  if (!ev) return no('No active chaos event.');
  const realm = g.player;
  const f = g.factions?.[realm];
  const rival = ev.rivalId ? g.factions?.[ev.rivalId] : null;

  if (ev.id === 'heir_enemy_romance') {
    if (choiceId === 'bless_union') {
      if (f && rival) {
        f.relations[ev.rivalId] = cap((f.relations[ev.rivalId] || 0) + 30, -100, 100);
        rival.relations[realm] = cap((rival.relations[realm] || 0) + 30, -100, 100);
        f.prestige = Math.max(0, (f.prestige || 0) - 10);
        f.legitimacy = cap((f.legitimacy || 50) + 15, 0, 100);
      }
      recordStoryFlag(g, realm, 'cross_border_romance', `Blessed a forbidden romance with ${rival?.name || 'a rival house'}`, { rivalId: ev.rivalId });
    } else if (choiceId === 'forbid_love') {
      if (f) f.prestige = (f.prestige || 0) + 10;
      if (ev.heirId) addStress(g, ev.heirId, 35, 'forbidden romance');
    } else {
      if (f && rival) f.relations[ev.rivalId] = cap((f.relations[ev.rivalId] || 0) - 15, -100, 100);
      if (f) f.prestige = (f.prestige || 0) + 5;
    }
  } else if (ev.id === 'star_general_defection') {
    if (choiceId === 'welcome_general') {
      if (f) f.treasury = Math.round((f.treasury || 0) - 80);
      if (f && rival) {
        f.relations[ev.rivalId] = cap((f.relations[ev.rivalId] || 0) - 20, -100, 100);
        rival.relations[realm] = cap((rival.relations[realm] || 0) - 20, -100, 100);
      }
      if (g.politics?.people) {
        const pid = 'p' + (g.politics.nextPerson || Object.keys(g.politics.people).length + 20);
        if (Number.isFinite(g.politics.nextPerson)) g.politics.nextPerson++;
        g.politics.people[pid] = {
          id: pid, name: ev.generalName, realm, house: 'Exiled Marshal', alive: true, age: 36, sex: 'male',
          skills: { diplomacy: 7, martial: 16, stewardship: 8, intrigue: 9, learning: 8 },
          traits: ['brave', 'brilliant_strategist'], loyalty: 82, prestige: 40, wealth: 30,
          civic: { culture: g.civic?.realms?.[realm]?.culture || 'Local', faith: g.civic?.realms?.[realm]?.faith || 'Local', stress: 0 }
        };
      }
      recordStoryFlag(g, realm, 'harbored_defector', `Harbored rival marshal ${ev.generalName}`, { rivalId: ev.rivalId });
    } else if (choiceId === 'extradite') {
      if (f) f.treasury = Math.round((f.treasury || 0) + 90);
      if (f && rival) {
        f.relations[ev.rivalId] = cap((f.relations[ev.rivalId] || 0) + 25, -100, 100);
        rival.relations[realm] = cap((rival.relations[realm] || 0) + 25, -100, 100);
      }
    } else {
      if (f) f.stability = cap((f.stability || 50) + 5, 0, 100);
    }
  } else if (ev.id === 'comet_sighted') {
    if (choiceId === 'royal_omen') {
      if (f) { f.prestige = (f.prestige || 0) + 15; f.stability = cap((f.stability || 50) - 3, 0, 100); }
    } else if (choiceId === 'fund_astronomers') {
      if (f) f.treasury = Math.round((f.treasury || 0) - 45);
      const h = g.hometown?.realms?.[realm];
      if (h) h.knowledge = Number(((h.knowledge || 0) + 20).toFixed(1));
    } else {
      if (f) { f.stability = cap((f.stability || 50) + 6, 0, 100); f.legitimacy = cap((f.legitimacy || 50) + 8, 0, 100); }
    }
  } else if (ev.id === 'foreign_scholar_asylum') {
    if (choiceId === 'patronize_scholar') {
      if (f) f.treasury = Math.round((f.treasury || 0) - 60);
      const h = g.hometown?.realms?.[realm];
      if (h) h.knowledge = Number(((h.knowledge || 0) + 25).toFixed(1));
      if (g.politics?.people) {
        const pid = 'p' + (g.politics.nextPerson || Object.keys(g.politics.people).length + 25);
        if (Number.isFinite(g.politics.nextPerson)) g.politics.nextPerson++;
        g.politics.people[pid] = {
          id: pid, name: ev.scholarName, realm, house: 'Royal Academy', alive: true, age: 41, sex: 'male',
          skills: { diplomacy: 10, martial: 4, stewardship: 9, intrigue: 7, learning: 16 },
          traits: ['scholar', 'polyglot'], loyalty: 85, prestige: 30, wealth: 15,
          civic: { culture: g.civic?.realms?.[realm]?.culture || 'Local', faith: g.civic?.realms?.[realm]?.faith || 'Local', stress: 0 }
        };
      }
      recordStoryFlag(g, realm, 'patronized_polymath', `Granted royal asylum to ${ev.scholarName}`);
    } else if (choiceId === 'buy_books') {
      if (f) { f.treasury = Math.round((f.treasury || 0) - 35); f.prestige = (f.prestige || 0) + 5; }
      const h = g.hometown?.realms?.[realm];
      if (h) h.knowledge = Number(((h.knowledge || 0) + 12).toFixed(1));
    } else {
      if (f) f.stability = cap((f.stability || 50) + 4, 0, 100);
    }
  }

  delete g.chronicles.pendingChaosEvent;
  if (g.log) {
    g.log.unshift({ date: `${g.year} · month ${g.month + 1}`, text: `${ev.title} resolved.` });
    g.log = g.log.slice(0, 45);
  }
  return ok(`${ev.title} resolved.`);
}
