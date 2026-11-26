/**
 * Sovereign: 1450 — Original Identity Pillar 2: Monarch Reign Chapters & Legacy Epithets
 * Tracks 3 concrete per-monarch Reign Objectives, milestone progress, chronicled
 * epithets, and a Dynasty Legacy Summary across reigns. Deterministic, zero Math.random().
 */
import { hashStr } from './ck2-deep-systems.js';

const clamp = (n, a, b) => Math.max(a, Math.min(b, n));
const num = n => (Number.isFinite(n) ? n : 0);
const ok = (msg, extra = {}) => ({ ok: true, msg, ...extra });
const no = (msg, extra = {}) => ({ ok: false, msg, ...extra });

export const REIGN_OBJECTIVE_TEMPLATES = Object.freeze([
 {
  id: 'obj_border_consolidator',
  title: 'Consolidate the Realm',
  desc: 'Expand royal holdings by at least +2 provinces beyond accession.',
  epithet: 'the Conqueror',
  reward: { prestige: 22, legitimacy: 8, stability: 4 },
  check: (g, realm, ch) => {
   const cur = Object.values(g.provinces || {}).filter(p => p.owner === realm).length;
   return { progress: Math.max(0, cur - ch.startProvinces), target: 2 };
  }
 },
 {
  id: 'obj_crown_coffers',
  title: 'Golden Treasury of State',
  desc: 'Accumulate at least 750 gold in the royal coffers.',
  epithet: 'the Golden',
  reward: { prestige: 18, stability: 5 },
  check: (g, realm) => {
   const tr = Math.round(num(g.factions?.[realm]?.treasury));
   return { progress: tr, target: 750 };
  }
 },
 {
  id: 'obj_civic_harmony',
  title: 'Pillar of Crown Order',
  desc: 'Achieve Stability 85% and Legitimacy 78% concurrently.',
  epithet: 'the Lawgiver',
  reward: { prestige: 20, legitimacy: 8 },
  check: (g, realm) => {
   const f = g.factions?.[realm];
   const met = (f?.stability >= 85 && f?.legitimacy >= 78) ? 100 : Math.min(99, Math.round(((f?.stability || 0) / 85 + (f?.legitimacy || 0) / 78) * 50));
   return { progress: met, target: 100 };
  }
 },
 {
  id: 'obj_sacred_patron',
  title: 'Defender of Sacred Learning',
  desc: 'Reach 45 personal Piety or found a temple/sanctuary endowment.',
  epithet: 'the Pious',
  reward: { piety: 20, legitimacy: 6, prestige: 14 },
  check: (g, realm, ch, ruler) => {
   const p = Math.round(num(ruler?.piety));
   return { progress: p, target: 45 };
  }
 },
 {
  id: 'obj_grand_diplomat',
  title: 'Architect of Concord',
  desc: 'Maintain at least 2 foreign treaties/alliances or reach Prestige 65.',
  epithet: 'the Magnanimous',
  reward: { prestige: 20, stability: 4 },
  check: (g, realm) => {
   const f = g.factions?.[realm];
   const allies = Object.values(f?.treaties || {}).filter(t => ['alliance', 'nonaggression', 'trade'].includes(t)).length;
   const score = Math.min(100, allies * 45 + Math.round(num(f?.prestige)));
   return { progress: score, target: 65 };
  }
 },
 {
  id: 'obj_secure_succession',
  title: 'Secure the Royal House',
  desc: 'Raise at least two living dynastic children or govern for 8 years.',
  epithet: 'the Steadfast',
  reward: { legitimacy: 10, prestige: 15 },
  check: (g, realm, ch, ruler) => {
   const kids = (ruler?.children || []).filter(cid => g.politics?.people?.[cid]?.alive).length;
   const years = Math.max(0, (g.year || 1450) - ch.startYear);
   return { progress: Math.max(kids * 50, years * 13), target: 100 };
  }
 }
]);

function assignChapterForRuler(g, realm, ruler) {
 const owned = Object.values(g.provinces || {}).filter(p => p.owner === realm).length;
 const baseIdx = hashStr(`chapter:${realm}:${ruler.id}:${g.year || 1450}`) % REIGN_OBJECTIVE_TEMPLATES.length;
 const chosen = [0, 2, 4].map(off => REIGN_OBJECTIVE_TEMPLATES[(baseIdx + off) % REIGN_OBJECTIVE_TEMPLATES.length]);
 return {
  rulerId: ruler.id,
  rulerName: ruler.name,
  house: ruler.house,
  startYear: g.year || 1450,
  startTurn: g.turn || 0,
  startProvinces: owned,
  epithet: ruler.epithet || null,
  objectives: chosen.map(tpl => ({
   id: tpl.id,
   title: tpl.title,
   desc: tpl.desc,
   epithet: tpl.epithet,
   completed: false,
   completedTurn: null,
   claimed: false
  }))
 };
}

export function initReignChapters(g) {
 if (!g || typeof g !== 'object') return null;
 const rc = (g.reignChapters ??= { version: 1, lastTick: -1, active: {}, legacyLog: [] });
 rc.active ??= {};
 rc.legacyLog ??= [];

 for (const [realm, rs] of Object.entries(g.politics?.realms || {})) {
  const ruler = rs?.ruler ? g.politics?.people?.[rs.ruler] : null;
  if (!ruler?.alive) continue;
  const cur = rc.active[realm];
  if (!cur || cur.rulerId !== ruler.id) {
   if (cur && cur.rulerId) {
    const doneCount = (cur.objectives || []).filter(o => o.completed).length;
    rc.legacyLog.unshift({
     realm,
     rulerId: cur.rulerId,
     rulerName: cur.rulerName,
     epithet: cur.epithet || (doneCount >= 2 ? 'the Diligent' : null),
     startYear: cur.startYear,
     endYear: g.year || 1450,
     objectivesCompleted: doneCount,
     score: doneCount * 150 + Math.max(1, (g.year || 1450) - cur.startYear) * 15
    });
    if (rc.legacyLog.length > 60) rc.legacyLog.length = 60;
   }
   rc.active[realm] = assignChapterForRuler(g, realm, ruler);
  } else {
   for (const o of cur.objectives || []) {
    if (!o.title) {
     const tpl = REIGN_OBJECTIVE_TEMPLATES.find(t => t.id === o.id);
     if (tpl) { o.title = tpl.title; o.desc = tpl.desc; o.epithet = tpl.epithet; }
    }
   }
  }
 }
 return rc;
}

export function tickReignChapters(g) {
 const rc = initReignChapters(g);
 if (!rc || rc.lastTick === g.turn) return;
 rc.lastTick = g.turn;

 for (const [realm, ch] of Object.entries(rc.active)) {
  const ruler = g.politics?.people?.[ch.rulerId];
  const f = g.factions?.[realm];
  if (!ruler?.alive || !f) continue;

  for (const obj of ch.objectives) {
   if (obj.completed) continue;
   const tpl = REIGN_OBJECTIVE_TEMPLATES.find(t => t.id === obj.id);
   if (!tpl) continue;
   const res = tpl.check(g, realm, ch, ruler);
   if (res.progress >= res.target) {
    obj.completed = true;
    obj.completedTurn = g.turn || 0;
    obj.claimed = true;
    if (tpl.reward.prestige) {
     f.prestige = num(f.prestige) + tpl.reward.prestige;
     ruler.prestige = num(ruler.prestige) + tpl.reward.prestige;
    }
    if (tpl.reward.piety) {
     f.piety = num(f.piety) + tpl.reward.piety;
     ruler.piety = num(ruler.piety) + tpl.reward.piety;
    }
    if (tpl.reward.legitimacy) f.legitimacy = clamp(num(f.legitimacy) + tpl.reward.legitimacy, 0, 100);
    if (tpl.reward.stability) f.stability = clamp(num(f.stability) + tpl.reward.stability, 0, 100);
    if (!ch.epithet) {
     ch.epithet = obj.epithet;
     ruler.epithet = obj.epithet;
    }
    if (realm === g.player && Array.isArray(g.log)) {
     g.log.unshift({
      date: `${g.year || 1450} · month ${(g.month || 0) + 1}`,
      text: `Reign Chapter Fulfilled: ${obj.title}! ${ruler.name} earned "${obj.epithet}".`
     });
     if (g.log.length > 45) g.log.length = 45;
    }
   }
  }
 }
}

export function reignChaptersView(g, realm = g?.player) {
 const rc = initReignChapters(g);
 if (!rc || !realm) return null;
 const ch = rc.active[realm];
 const ruler = ch ? g.politics?.people?.[ch.rulerId] : null;
 const objectives = (ch?.objectives || []).map(obj => {
  const tpl = REIGN_OBJECTIVE_TEMPLATES.find(t => t.id === obj.id);
  const res = tpl && ruler ? tpl.check(g, realm, ch, ruler) : { progress: 0, target: 1 };
  return { ...obj, progress: res.progress, target: res.target };
 });
 return {
  chapter: ch ? { ...ch, objectives } : null,
  legacyLog: rc.legacyLog.filter(x => x.realm === realm).slice(0, 12)
 };
}

export function generateLegacySummary(g, realm = g?.player) {
 const v = reignChaptersView(g, realm);
 if (!v) return { totalScore: 0, reigns: [], currentEpithet: null };
 const completedCur = (v.chapter?.objectives || []).filter(o => o.completed).length;
 const curScore = completedCur * 150 + Math.max(0, (g.year || 1450) - (v.chapter?.startYear || 1450)) * 15;
 const pastScore = v.legacyLog.reduce((s, r) => s + (r.score || 0), 0);
 return {
  totalScore: curScore + pastScore,
  currentEpithet: v.chapter?.epithet || null,
  completedCurrent: completedCur,
  reigns: v.legacyLog
 };
}

export function reignAction(g, world, type, id = '') {
 const rc = initReignChapters(g);
 const realm = g?.player;
 const ch = rc?.active?.[realm];
 if (!ch) return no('No active Reign Chapter.');
 if (type === 'refresh-objective') {
  const idx = ch.objectives.findIndex(o => o.id === id && !o.completed);
  if (idx < 0) return no('Select an uncompleted Reign Objective to swap.');
  const used = new Set(ch.objectives.map(o => o.id));
  const alt = REIGN_OBJECTIVE_TEMPLATES.find(t => !used.has(t.id));
  if (!alt) return no('No alternate Reign Objective available.');
  ch.objectives[idx] = { id: alt.id, title: alt.title, desc: alt.desc, epithet: alt.epithet, completed: false, completedTurn: null, claimed: false };
  return ok(`Reign Objective revised to "${alt.title}".`);
 }
 return no('Unknown Reign Chapter action.');
}
