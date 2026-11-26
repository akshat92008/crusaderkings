/**
 * Mobile-first Monthly Crown Dispatch: distills grand-strategy state into
 * 3-6 crisp actionable priority cards with direct tab/action links.
 */
const num = n => (Number.isFinite(n) ? n : 0);

export function buildMonthlyDispatch(g, world, opts = {}) {
 if (!g || !g.factions?.[g.player]) return [];
 const realm = g.player;
 const f = g.factions[realm];
 const pol = g.politics?.realms?.[realm];
 const people = g.politics?.people || {};
 const ruler = pol ? people[pol.ruler] : null;
 const cards = [];

 // 1. Incoming invasions or active wars
 const threats = g.kingdom?.threats || [];
 if (threats.length) {
  const t = threats[0];
  const opp = g.factions[t.by]?.name || t.by;
  cards.push({
   id: 'dispatch-invasion',
   level: 'urgent',
   category: 'WAR & BORDER',
   title: `${opp} approaches ${t.province}`,
   detail: t.status === 'ready' ? 'Enemy host at the border — deploy or auto-resolve now.' : `${t.eta} month(s) until enemy reaches your district.`,
   tab: 'military',
   cta: 'Review Forces'
  });
 }
 const activeWars = Object.values(g.conflict?.wars || {}).filter(w => w.status === 'active' && [w.attacker, w.defender].includes(realm));
 if (activeWars.length) {
  const w = activeWars[0];
  const other = w.attacker === realm ? w.defender : w.attacker;
  cards.push({
   id: 'dispatch-war-' + w.id,
   level: 'high',
   category: 'CAMPAIGN',
   title: `Active War vs ${g.factions[other]?.name || other}`,
   detail: `War score ${Math.round(num(w.score))} · Monitor armies, war exhaustion, and peace terms.`,
   tab: 'political',
   cta: 'War Desk'
  });
 }

 // 2. Pending Events or Personal Dilemmas
 const pendingEvents = num(opts.pendingEvents);
 if (pendingEvents > 0) {
  cards.push({
   id: 'dispatch-events',
   level: 'urgent',
   category: 'COURT AUDIENCE',
   title: `${pendingEvents} Urgent Court Matter${pendingEvents > 1 ? 's' : ''}`,
   detail: 'Envoys, lords, and advisors await your sovereign ruling.',
   tab: 'stories',
   cta: 'Answer Now'
  });
 }

 // 3. Succession, Marriage & Claimants
 if (pol && !pol.heir) {
  cards.push({
   id: 'dispatch-heir',
   level: 'urgent',
   category: 'LINEAGE',
   title: 'Succession Vulnerable — No Designated Heir',
   detail: 'Arrange a royal marriage or designate an eligible successor.',
   tab: 'dynasty',
   cta: 'Open Dynasty'
  });
 }
 if (pol?.claimantCrisis?.active) {
  cards.push({
   id: 'dispatch-claimant',
   level: 'urgent',
   category: 'SUCCESSION CRISIS',
   title: 'Claimant Contests the Throne',
   detail: 'Rival kin are rallying dissatisfied lords; secure loyalty or detain plotters.',
   tab: 'vassals',
   cta: 'Manage Vassals'
  });
 } else if (ruler && !ruler.spouse && ruler.age >= 18) {
  cards.push({
   id: 'dispatch-marriage',
   level: 'medium',
   category: 'ALLIANCES',
   title: `${ruler.name} Is Unwed`,
   detail: 'Forge a dynastic marriage to gain allies and secure your line.',
   tab: 'diplomacy',
   cta: 'Seek Match'
  });
 }

 // 4. Treasury, Food & Epidemics
 if (f.food < 20) {
  cards.push({
   id: 'dispatch-famine',
   level: 'urgent',
   category: 'GRANARY',
   title: 'Granary Reserves Critically Low',
   detail: `Food stock at ${Math.round(f.food)} — import grain or upgrade farms to avoid unrest.`,
   tab: 'economy',
   cta: 'Open Treasury'
  });
 } else if (f.treasury >= 350 && !g.dlcSystems?.focuses?.[ruler?.id]) {
  cards.push({
   id: 'dispatch-focus',
   level: 'low',
   category: 'RULER DISCIPLINE',
   title: 'Select a Sovereign Discipline',
   detail: 'Direct your ruler toward War, Commerce, Intrigue, Scholarship, or Statecraft.',
   tab: 'society',
   cta: 'Choose Focus'
  });
 }

 // 5. Epidemics in Realm
 const ownPlagues = Object.values(g.economy?.crises || {}).filter(c => c?.kind === 'epidemic' && g.provinces[c.province]?.owner === realm);
 if (ownPlagues.length) {
  cards.push({
   id: 'dispatch-plague',
   level: 'high',
   category: 'PESTILENCE',
   title: `Outbreak in ${ownPlagues.length} District${ownPlagues.length > 1 ? 's' : ''}`,
   detail: 'Summon a Court Physician or isolate the court to protect your dynasty.',
   tab: 'society',
   cta: 'Health & Court'
  });
 }

 // 6. Crossroads Eras & Reign Chapters
 const xrReady = (g.crossroads?.globalUnlocked || []).find(id => !(g.crossroads?.realms?.[realm]?.adopted || []).includes(id));
 if (xrReady && cards.length < 6) {
  cards.push({
   id: 'dispatch-crossroads',
   level: 'medium',
   category: 'CROSSROADS ERA',
   title: 'Global Innovation Ready to Charter',
   detail: 'Adopt new 1450–1600 era institutions in Society & Crossroads to reshape your realm.',
   tab: 'society',
   cta: 'Crossroads'
  });
 }

 // Fallback steady-state card so Dispatch is always useful
 if (!cards.length) {
  cards.push({
   id: 'dispatch-calm',
   level: 'low',
   category: 'REALM ORDER',
   title: `${f.name} Holds Steady`,
   detail: 'Inspect provinces, expand trade posts, arrange marriages, or advance the month.',
   tab: 'realm',
   cta: 'Realm Ledger'
  });
 }

 return cards.slice(0, 6);
}

export function renderCrownDispatch(g, world, esc, opts = {}) {
 const cards = buildMonthlyDispatch(g, world, opts);
 return '<div class="dispatch-deck" id="crown-dispatch">'
  + '<div class="dispatch-head"><span>✦ THE CROWN DISPATCH</span><small>' + cards.length + ' PRIORITIES</small></div>'
  + cards.map(c => '<div class="dispatch-card level-' + esc(c.level) + '">'
   + '<div class="dispatch-cat">' + esc(c.category) + '</div>'
   + '<b>' + esc(c.title) + '</b>'
   + '<p>' + esc(c.detail) + '</p>'
   + '<button type="button" class="rowbtn" data-priority-tab="' + esc(c.tab) + '">' + esc(c.cta) + ' ›</button>'
   + '</div>').join('')
  + '</div>';
}
