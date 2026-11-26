/**
 * Sovereign: 1450 — Modular Content Pack: Court Intrigue, Factions & Statecraft
 * Rich 3-choice spycraft, council conspiracies, blackmail, and treason arcs.
 */
const BANK = [
 ['int_cipher_key_lost','Intrigue','Missing Signet & Cipher Sheet','A chancellery runner dropped an unsealed leather pouch near the stables before matins.','activePlot',[
  ['Purge locks, burn old rosters, and re-ink ciphers',90,{securityMonths:12,plotPreparation:8}],
  ['Use decoy scrolls quietly to trap whoever handles it',45,{plotPreparation:10,securityMonths:8}],
  ['Quietly trace whoever touched it without panic',0,{plotPreparation:6,stress:4}]
 ]],
 ['int_blackmail_ledger','Intrigue','Torn Leaves From a Tax Chest','Secret agents deliver duplicate tallies implicating a proud provincial marshal in skimming salt dues.','knownSecret',[
  ['Turn the confession into quiet loyal service',75,{loyalty:11,legitimacy:5}],
  ['Hold private sealed evidence for future council leverage',35,{securityMonths:10,stability:3}],
  ['Demand double restitution openly into coffers',0,{gold:125,loyalty:-7}]
 ]],
 ['int_whispered_banquet_toast','Intrigue','Too Loud at the High Table','An intoxicated baron toasted "older blood and lighter taxes" within earshot of halberdiers.','taxFaction',[
  ['Arrest the ringmaster quietly at dawn',95,{factionPressure:-15,stability:5}],
  ['Humiliate him with witty counter-toasts and tax review',35,{factionPressure:-8,prestige:6}],
  ['Feign deafness and negotiate modest salt exemptions',0,{gold:-35,factionLoyalty:8}]
 ]],
 ['int_foreign_agent_inn','Intrigue','Shadows at the Golden Fleece','Watchmen detained a peddler carrying foreign wax impressions inside hollow candlesticks.','detectedPlot',[
  ['Interrogate cleanly and expel the spy ring publicly',85,{securityMonths:11,legitimacy:5}],
  ['Feed them inflated false muster figures before release',45,{prestige:6,securityMonths:9}],
  ['Confiscate bullion silently and drop patrols',0,{gold:75,stress:3}]
 ]],
 ['int_claimant_tavern_song','Intrigue','A Ballad Mocking Crown Rights','Tinkers sing verses praising a rival claimant across three frontier market squares.','livingClaimant',[
  ['Commission lively loyalist ballads and tavern ale',85,{legitimacy:9,unrest:-5}],
  ['Invite the claimant formally to clear air at council',55,{opinion:8,legitimacy:5}],
  ['Fine noisy innkeepers for seditious tavern brawls',0,{gold:55,unrest:4}]
 ]],
 ['int_council_deadlock_bribe','Intrigue','A Sealed Purse Before the Vote','Your chancellor suggests selective estate stipends could resolve a stubborn council blockade.','councillor',[
  ['Disburse discreet patronage purses for unity',115,{loyalty:11,stability:6}],
  ['Trade narrow judicial honors rather than coin',40,{opinion:8,legitimacy:4}],
  ['Refuse openly to buy sworn royal counsel',0,{legitimacy:7,loyalty:-4}]
 ]],
 ['int_poisoned_fig_scare','Intrigue','Nightshade Near the Kitchens','Kitchen boys caught a scullion grinding pale berries beside the spiced wine amphora.','courtRival',[
  ['Double silver tasters and purge kitchen hires',100,{securityMonths:12,stress:3}],
  ['Keep inquiry strictly confidential to trap hirers',45,{securityMonths:10,stress:4}],
  ['Dismiss suspects discreetly without panic',0,{stability:3,stress:5}]
 ]],
 ['int_liberty_charter_leak','Intrigue','Draft Charter Stolen From Clerks','Word spreads that barons seek sweeping concessions curtailing royal wardship rights.','libertyFaction',[
  ['Grant narrow ceremonial liberties preserving core taxes',95,{factionPressure:-13,factionLoyalty:8}],
  ['Divide signatories privately with county honors',55,{factionPressure:-10,stability:4}],
  ['Rally loyalists openly and reject dictated terms',0,{legitimacy:8,factionPressure:5}]
 ]],
 ['int_levy_muster_evasion','Intrigue','Ghost Rosters at the Muster Yard','Inspectors suspect border lords padded spears on parchment to dodge field levies.','levyFaction',[
  ['Send surprise royal mustermasters to count shields',95,{morale:6,factionPressure:-11}],
  ['Offer quiet amnesty if lords supply dry wagon rations',35,{supply:14,factionLoyalty:5}],
  ['Accept silver scutage commutations briskly instead',0,{gold:115,factionPressure:6}]
 ]],
 ['int_independence_whisperers','Intrigue','Border Lords Parley by Night','Lanterns burned late in an eastern keep where peripheral lords met without crown summons.','independenceFaction',[
  ['Summon principals politely to a grand capital feast',130,{factionPressure:-16,loyalty:9}],
  ['Garrison strategic mountain passes with royal scouts',80,{securityMonths:11,unrest:-4}],
  ['Dispatch royal circuit judges to divide grievances',35,{trust:6,factionPressure:-7}]
 ]],
 ['int_turncoat_captain','Intrigue','A Captain Offers the Postern Key','An enemy border sergeant offers intelligence on crumbling bastion walls in exchange for coin.','war',[
  ['Buy accurate sketches and guard rotation rosters',110,{supply:16,morale:7}],
  ['Cross-check intelligence via scout patrols first',45,{morale:5,experience:0.04}],
  ['Scorn dishonorable bribery and press open siege',0,{prestige:7,piety:5}]
 ]],
 ['int_disloyal_mayor_smugglers','Intrigue','Lantern Signals Below the Cliffs','Fishermen spot unflagged cogs unloading velvet bolts outside customs gates on moonless nights.','disloyal',[
  ['Seize contraband and fine the conniving bailiff',75,{gold:120,unrest:-3,loyalty:-5}],
  ['Lower harbor tariffs cleanly and co-opt coastal skippers',45,{credit:8,trust:6}],
  ['Post revenue cutters without antagonizing burgesses',0,{securityMonths:7,gold:35}]
 ]],
 ['int_secret_network_expansion','Intrigue','New Ears in Foreign Chanceries','A trusted informant proposes placing bilingual clerks inside rival trading factories.','networkContact',[
  ['Underwrite the bilingual intelligence stipends cleanly',110,{securityMonths:12,prestige:5}],
  ['Split stipends strictly for trade & naval warnings',55,{credit:6,securityMonths:8}],
  ['Recall foreign agents gently to domestic watch',0,{gold:30,stability:3}]
 ]],
 ['int_forged_papal_seal','Intrigue','A Suspiciously Fresh Bull','Scribes notice crooked wax lettering on an exemption letter waved by an ambitious prelate.','knownSecret',[
  ['Expose the forgery quietly inside closed council',70,{faithAuthority:7,legitimacy:6}],
  ['Fine the abbey privately for "clerical error" restitution',25,{gold:100,faithAuthority:4}],
  ['Confiscate the forged parchment cleanly in silence',0,{securityMonths:9,prestige:4}]
 ]],
 ['int_court_rival_lampoon','Intrigue','Scandalous Woodcuts at Dawn','Mocking caricatures of a leading royal rival appear nailed beside palace stable gates.','courtRival',[
  ['Confiscate broadsides calmly before the morning bell',55,{stability:5,opinion:6}],
  ['Commission clever dignified verses mocking idle gossip',30,{prestige:6,stress:-4}],
  ['Ignore coarse ink with a calm thin smile',0,{stress:-4,opinion:-9}]
 ]],
 ['int_claimant_foreign_subsidy','Intrigue','Foreign Florins in Rebel Purses','Customs guards uncovered minted foreign florins sewn into a claimant agent’s saddlebags.','claimantFaction',[
  ['Seize bullion and denounce outside meddling cleanly',95,{gold:100,factionPressure:-13,legitimacy:5}],
  ['Follow the courier silently to unmask domestic contacts',50,{securityMonths:13,factionPressure:-9}],
  ['Pardon frightened riders who surrender names',0,{stability:5,factionLoyalty:5}]
 ]],
 ['int_regency_whispered_will','Intrigue','The Locked Will Box','A dying chamberlain hints that two versions of the late monarch’s regency codicil circulate.','regency',[
  ['Witness, verify, and publicly seal the authentic charter',100,{legitimacy:11,stability:6}],
  ['Place all wills under locked triple-key abbey custody',40,{securityMonths:9,stability:4}],
  ['Burn uncertified forged drafts privately',0,{prestige:4,securityMonths:7}]
 ]],
 ['int_hostile_envoy_bribery','Intrigue','A Rival Ambassador’s Gold','A neighboring diplomat has been pressing silver goblets onto junior chancery copyists.','hostile',[
  ['Expel the envoy swiftly with icy diplomatic ceremony',75,{prestige:7,relation:-10,securityMonths:8}],
  ['Plant harmless bloated treasury tables for him to buy',45,{securityMonths:13,credit:4}],
  ['Rotate clerks quietly without sparking border rumors',0,{stability:4,relation:2}]
 ]],
 ['int_chancery_cipher_expert','Intrigue','An Eccentric Polymath of Ciphers','A blind mathematician decodes intercepted diplomatic letters by rhythm and letter count alone.','research',[
  ['Retain the decoder in royal service with generous rooms',105,{securityMonths:13,research:9}],
  ['Ask him to train four bright young treasury clerks',55,{research:6,securityMonths:8}],
  ['Decline odd scholarly spectacles politely',0,{gold:20}]
 ]],
 ['int_unrest_agitator_trails','Intrigue','Broadsides Pasted by Night','Bold charcoal placards blame the treasury for grain shortages before market bell.','unrest',[
  ['Identify printers discreetly while cutting grain tolls',90,{unrest:-12,trust:6}],
  ['Patrol market gates cleanly at night without arrests',30,{unrest:-5,stability:3}],
  ['Flood market squares with loyal guild bread wagons',110,{unrest:-11,food:30,trust:7}]
 ]],
 ['int_pirate_cove_treaty','Intrigue','Sealed Letters From Sea Rovers','Smugglers offer to prey strictly on hostile hulls if customs skip inspecting certain coves.','hostile',[
  ['Grant silent privateer letters of reprisal',90,{gold:90,relation:-12,morale:4}],
  ['Press coastal smugglers cleanly into regular navy crews',60,{morale:7,credit:4}],
  ['Hang unrepentant corsairs to uphold maritime law',30,{legitimacy:9,credit:7}]
 ]],
 ['int_corrupted_seal_matrix','Intrigue','Scratched Brass in the Mint','Mint wardens noticed microscopic file marks beside the royal crown punch in iron dies.','inflation',[
  ['Recoin steel dies under locked double watch',105,{inflation:-3,securityMonths:9}],
  ['Trace underweight groats back through moneychangers',45,{inflation:-2,credit:5}],
  ['Retain current dies until autumn tax collection finishes',0,{gold:40,inflation:2}]
 ]],
 ['int_abbot_secret_archive','Intrigue','Locked Chests Under the Choir','An aging abbot bequeaths sealed bundles of thirty-year-old confessions to royal safekeeping.','sanctuary',[
  ['Seal them forever to guard realm peace and mercy',75,{piety:10,stability:7}],
  ['Examine old treason titles discreetly by candlelight',30,{securityMonths:10,legitimacy:5}],
  ['Leave the chests inside abbey custody under crown seal',0,{trust:5,piety:5}]
 ]]
];

function buildIntrigueStories(E, C) {
 const out = [];
 const followups = [];
 for (const [id, cat, title, desc, trig, rawChoices] of BANK) {
  const folId = id + '_epilogue';
  const mapped = rawChoices.map((rc, idx) => C(rc[0], rc[1], rc[2], idx === 0 ? folId : null));
  out.push(E(id, cat, title, desc, trig, mapped));
  followups.push(E(folId, cat, `${title} — Shadow Dispatch`, `Chancery spymasters close the parchment dossier on "${title}", noting which courtiers breathed easier — and who flinched.`, 'followup', [
   C('Tighten night watchmen rosters quietly', 40, { securityMonths: 8, stability: 4 }),
   C('Reward faithful informants out of hand', 20, { trust: 5, legitimacy: 3 }),
   C('Burn spare cipher drafts in the brazier', 0, { stress: -4 })
  ]));
 }

 // === DEEP BESPOKE MULTI-STAGE ESPIONAGE & FACTION CONSPIRACY ARCS (3-4 CHOICES) ===
 const deepIntrigue = [
  ['int_arc_double_agent', 'Intrigue', 'The Double-Faced Courier of Calais',
   'Guards intercept a courier carrying identical wine bills from both your spymaster and an adversarial foreign minister.',
   'networkContact',
   [
    C('Turn him silently with double pay to poison foreign intelligence', 110, { securityMonths: 14, prestige: 6 }, 'int_arc_double_fol'),
    C('Stage a false leak to uncover domestic accomplices', 65, { securityMonths: 12, stability: 4 }, 'int_arc_double_fol'),
    C('Try and hang the traitor swiftly at castle gate', 20, { legitimacy: 7, morale: 4 }),
    C('Expel him quietly without rattling merchant routes', 0, { credit: 5, trust: 3 })
   ],
   'int_arc_double_fol', 'Foreign Fleet Sails Into Empty Fog',
   'Your decoy intelligence lures rival interceptors weeks off-course while border forts stay unmolested.',
   [
    C('Promote your silent counter-intelligence clerks', 45, { securityMonths: 10, legitimacy: 5 }),
    C('Freeze border customs for twenty days to net lingerers', 25, { gold: 80, securityMonths: 6 }),
    C('Burn the operational logs cleanly', 0, { stress: -4 })
   ]
  ],
  ['int_arc_poison_cup', 'Intrigue', 'Bitter Almonds in the Spiced Claret',
   'A royal page tumbles convulsing after sipping leftover claret from the sovereign’s silver ewer before council.',
   'highStress',
   [
    C('Barricade palace gates cleanly and interrogate wine stewards', 105, { securityMonths: 14, legitimacy: 6, stress: 4 }, 'int_arc_poison_fol'),
    C('Rely strictly on loyal apothecaries and calm private inquiries', 60, { health: -15, trust: 6, securityMonths: 9 }, 'int_arc_poison_fol'),
    C('Blame tainted pewter politely to deny plotters triumph', 20, { stability: 6, stress: -4 }),
    C('Switch chambers secretly while retaining loyal bodyguards', 0, { securityMonths: 8, prestige: -2 })
   ],
   'int_arc_poison_fol', 'Confession Below Candlelit Arches',
   'Apothecaries stabilize the surviving boy as investigators identify a bribed wine factor fleeing toward port.',
   [
    C('Seize conspirator properties into crown custody', 30, { gold: 130, securityMonths: 8 }),
    C('Pension the brave surviving page cleanly', 45, { piety: 7, trust: 8, stress: -6 }),
    C('Rotate all palace household keys permanently', 0, { securityMonths: 9 })
   ]
  ],
  ['int_arc_baron_syndicate', 'Intrigue', 'Wax Seals Broken Beneath the Oak',
   'Outriders intercept seven sealed parchment oaths uniting restless country squires against royal tax assessors.',
   'disloyal',
   [
    C('Summon ringleaders individually — pardon early turncoats, isolate holdouts', 95, { loyalty: 11, stability: 7 }, 'int_arc_baron_fol'),
    C('Dispatch seasoned circuit justices with fair tax audits', 70, { trust: 9, legitimacy: 7 }, 'int_arc_baron_fol'),
    C('Deploy royal banners briskly across crossroad castles', 110, { morale: 7, loyalty: 6, unrest: -4 }),
    C('Hold the letters quietly in reserve for leverage', 0, { securityMonths: 9, prestige: 3 })
   ],
   'int_arc_baron_fol', 'Fractured Conspiracy Before Autumn',
   'Deprived of mutual trust, reluctant squires ride quietly to court bringing overdue hearth taxes.',
   [
    C('Confirm ancient local pasture rights as gracious amnesty', 45, { trust: 8, unrest: -6 }),
    C('Collect fair fines cleanly for frontier roads', 0, { gold: 95, development: 1 }),
    C('Seal written pardons under chancery locks', 0, { legitimacy: 5 })
   ]
  ],
  ['int_arc_mint_clippers', 'Intrigue', 'Silver Shavings in the Goldsmiths’ Alley',
   'Watchmen seize leather sacks brimming with clipped crown pennies behind three respectable moneychangers’ stalls.',
   'trade',
   [
    C('Execute mint-die audits cleanly and charter honest bullion brokers', 115, { credit: 11, inflation: -3, securityMonths: 7 }, 'int_arc_mint_fol'),
    C('Accept heavy sterling restitution quietly from implicated houses', 25, { gold: 145, stability: 4 }, 'int_arc_mint_fol'),
    C('Hold public scales beside market fountains for commoners', 55, { trust: 10, unrest: -6 }),
    C('Issue warnings before next quarter’s fair', 0, { credit: 3 })
   ],
   'int_arc_mint_fol', 'True Pennies Ring on Countertops',
   'Bakers and carters drop distrust of copper change as honest weights restore smooth autumn trade.',
   [
    C('Strike clean milled borders on new silver issues', 50, { credit: 8, research: 4 }),
    C('Fine careless port bailiffs', 0, { gold: 65 }),
    C('Close treasury inquiries gracefully', 0, { stability: 4 })
   ]
  ],
  ['int_arc_silent_regent', 'Intrigue', 'Two Keys to the Chancery Chest',
   'Junior clerks report unauthorized candlewax drippings beside locked succession charters during late night council hours.',
   'lowlegitimacy',
   [
    C('Establish dual-signet custody requiring council witness', 90, { legitimacy: 11, securityMonths: 10 }, 'int_arc_silent_fol'),
    C('Stake quiet watchmen in loft galleries for three nights', 55, { securityMonths: 12, stability: 5 }, 'int_arc_silent_fol'),
    C('Call every senior clerk to renew loyalty oaths publicly', 30, { loyalty: 6, prestige: 4 }),
    C('Move key treaties privately inside your sleeping quarters', 0, { securityMonths: 7, stress: 4 })
   ],
   'int_arc_silent_fol', 'Seal Chests Secured in Iron',
   'Whispered succession doubts settle cleanly as councillors witness intact unbroken state patents.',
   [
    C('Publish certified copies of settled succession customs', 45, { legitimacy: 9, trust: 5 }),
    C('Reward vigilant night watchmen', 20, { morale: 4, securityMonths: 6 }),
    C('File reports discreetly', 0, { stability: 3 })
   ]
  ]
 ];

 for (const [id, cat, title, desc, trig, ch, fid, ftitle, fdesc, fch] of deepIntrigue) {
  out.push(E(id, cat, title, desc, trig, ch));
  followups.push(E(fid, cat, ftitle, fdesc, 'followup', fch));
 }

 return [...out, ...followups];
}

export function courtIntrigueEvents(E, C) {
 return buildIntrigueStories(E, C);
}
