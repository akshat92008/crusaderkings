/**
 * Sovereign: 1450 — Modular Content Pack: World Civilizations, Governments & Crossroads
 * 68 multi-stage narrative chains (272 authored stages) spanning regional realms
 * (Vijayanagara, Ottomans, Ming, Joseon, Ashikaga/Japan, Timurids, France, England,
 * Imperial, Poland, Muscovy, Mamluks, Mali, Ethiopia, Mexica, Inca, Majapahit, Venice,
 * Horde, and more), all government types (gov_*), and Crossroads Eras (crossroads_*).
 */
export function culturesWorldEvents(E, C) {
 const out = [];
 const add = (id, cat, title, desc, trig, choices) => out.push(E(id, cat, title, desc, trig, choices));
 const arc4 = (p, cat, trig, s1, s2, s3, s4) => {
  add(`${p}_1`, cat, s1[0], s1[1], trig, s1[2].map(([l, c, e], i) => C(l, c, e, i < 2 ? `${p}_2` : null)));
  add(`${p}_2`, cat, s2[0], s2[1], 'followup', s2[2].map(([l, c, e], i) => C(l, c, e, i < 2 ? `${p}_3` : null)));
  add(`${p}_3`, cat, s3[0], s3[1], 'followup', s3[2].map(([l, c, e], i) => C(l, c, e, i < 2 ? `${p}_4` : null)));
  add(`${p}_4`, cat, s4[0], s4[1], 'followup', s4[2].map(([l, c, e]) => C(l, c, e)));
 };
 const branch4 = (p, cat, trig, s1, s2a, s2b, s3) => {
  add(`${p}_1`, cat, s1[0], s1[1], trig, [
   C(s1[2][0][0], s1[2][0][1], s1[2][0][2], `${p}_2a`),
   C(s1[2][1][0], s1[2][1][1], s1[2][1][2], `${p}_2b`),
   C(s1[2][2][0], s1[2][2][1], s1[2][2][2], `${p}_2b`)
  ]);
  add(`${p}_2a`, cat, s2a[0], s2a[1], 'followup', s2a[2].map(([l, c, e], i) => C(l, c, e, i < 2 ? `${p}_3` : null)));
  add(`${p}_2b`, cat, s2b[0], s2b[1], 'followup', s2b[2].map(([l, c, e], i) => C(l, c, e, i < 2 ? `${p}_3` : null)));
  add(`${p}_3`, cat, s3[0], s3[1], 'followup', s3[2].map(([l, c, e]) => C(l, c, e)));
 };

 // === A. NAMED REGIONAL REALM ARCS (19 MAJOR + ADDITIONAL REGIONS) ===
 arc4('cw_reg_vijaya_anicut', 'Regional', 'region_vijayanagara',
  ['Tungabhadra Granite Weir Sluices', 'Vijayanagara hydraulic masters propose raising a granite anicut dam across river rapids to feed terraced canals right up to the royal capital.', [
   ['Fund massive granite blocks, copper tools, and temple tank links', 155, { food: 105, development: 1, trust: 10 }],
   ['Repair older stone channels first with village mirasi elders', 75, { food: 65, trust: 9, tools: 15 }],
   ['Organize seasonal brushwood bunds after monsoon crests', 0, { food: 35, credit: 4 }]
  ]],
  ['Nayaka Lords Dispute Canal Shares', 'Provincial nayaka captains demand broader irrigation cuts for cavalry pasture estates before city rice gardens.', [
   ['Fix transparent brass water-gauges balancing paddy and cavalry fields', 65, { loyalty: 9, trust: 9, legitimacy: 7 }],
   ['Grant royal cavalry stud-pastures separate upland tanks', 80, { loyalty: 10, food: 40 }],
   ['Enforce ancient crown canal precedence cleanly', 0, { legitimacy: 7, loyalty: -4 }]
  ]],
  ['Arabian Horse Traders Ride Into Hampi Bazaar', 'Brimming grain wealth draws Ormuz merchants leading blooded Arab stallions into stone-pillared capital bazaars.', [
   ['Charter clean royal horse-fairs with honest assay silver', 90, { credit: 11, prestige: 10, securityMonths: 7 }],
   ['Exempt grain-fed cavalry remounts from gate tolls', 40, { loyalty: 7, credit: 6 }],
   ['Collect crisp bazaar customs cleanly', 0, { gold: 95 }]
  ]],
  ['Emerald Fields Around Granite Crags', 'Turned river waters paint dry boulder valleys bright green, anchoring empire strength.', [
   ['Inscribe royal hydraulic verses on temple granite', 45, { prestige: 9, piety: 8 }],
   ['Stock reserve paddy inside fort granaries', 40, { food: 55, grain: 16 }],
   ['Close the irrigation roll', 0, { stability: 4 }]
  ]]
 );

 arc4('cw_reg_ottoman_timar', 'Regional', 'region_ottomans',
  ['Tahrir Defter Survey of the Rumeli Sanjak', 'Imperial scribes carry iron-bound registers across mountain valleys to verify timar cavalry estates, bridge-guards, and Christian-Muslim village hearths.', [
   ['Conduct calm fair cadaster audits protecting peasants from illegal levies', 135, { legitimacy: 11, acceptance: 10, stability: 8 }],
   ['Reward loyal frontier sipahis with freshly surveyed waste-land grants', 75, { loyalty: 10, development: 1, food: 40 }],
   ['Confirm existing provincial register books briskly', 0, { legitimacy: 6, credit: 4 }]
  ]],
  ['Bridge-Guard Villages Petition for Exemption', 'Mountain derbentci villages guarding snowy caravan passes ask exemption from cash taxes in return for unbroken road watch.', [
   ['Confirm traditional bridge-guard charters and issue iron pass-drums', 55, { securityMonths: 10, trust: 10, credit: 6 }],
   ['Pair pass-guards with royal caravanserai grain allowances', 65, { food: 45, acceptance: 8 }],
   ['Keep narrow road exemptions strictly for armed watchmen', 0, { securityMonths: 7, stability: 5 }]
  ]],
  ['Brass Foundry Smoke at the Golden Horn', 'Master founders test twin mobile field cannon batteries cast cleanly beside imperial dockyards.', [
   ['Expand naval arsenal slips and gunpowder storage vaults', 95, { development: 1, research: 10, securityMonths: 8 }],
   ['Hold disciplined matchlock and cannon drills for palace corps', 50, { prestige: 9, stability: 6 }],
   ['Stock spare copper and tin ingots in imperial vaults', 0, { tools: 18 }]
  ]],
  ['Lawful Order Across Passes & Sea', 'Clean tahrir books and guarded mountain roads keep silver and troops moving briskly under the Sultan’s seal.', [
   ['Deposit sealed provincial defters in the Topkapi archive', 40, { legitimacy: 9, securityMonths: 7 }],
   ['Endow a wayside fountain for pass travelers', 35, { piety: 8, trust: 7 }],
   ['Close the imperial survey', 0, { stability: 4 }]
  ]]
 );

 arc4('cw_reg_ming_canal', 'Regional', 'region_ming',
  ['Yellow River Silt Threatens Grand Canal Locks', 'Provincial water commissioners warn summer flood silt rises fast near Huaiyin lock-gates, threatening northern grain fleets.', [
   ['Mobilize paid peasant engineers with willow fascines and stone sluices', 155, { food: 110, development: 1, stability: 9 }],
   ['Divert southern tribute rice briefly onto sea-going junks round Shandong', 80, { food: 75, credit: 8, research: 6 }],
   ['Organize local county dredging teams under strict imperial censors', 0, { food: 45, legitimacy: 5 }]
  ]],
  ['Censors Expose Corrupt River Bribes', 'Imperial censors uncover regional clerks skimming silver meant for stone riprap and paying laborers in chalk-mixed rice.', [
   ['Try guilty clerks publicly and distribute seized grain to canal diggers', 45, { legitimacy: 12, trust: 12, unrest: -8 }],
   ['Install double-checked porcelain tally-stamps at every canal lock', 35, { securityMonths: 9, credit: 6 }],
   ['Replace corrupt river overseers swiftly with top examination graduates', 0, { legitimacy: 8, research: 5 }]
  ]],
  ['Porcelain & Silk Barges Glide North', 'Restored lock-gates lift heavy grain junks cleanly alongside Jingdezhen blue-and-white export porcelain chests.', [
   ['Charter clean canal courier inns and honest silver scales', 70, { credit: 10, trust: 8 }],
   ['Stock imperial reserve granaries along northern frontier passes', 60, { food: 65, securityMonths: 7 }],
   ['Collect orderly tribute-barge tolls', 0, { gold: 95 }]
  ]],
  ['Lifeline of the Empire Clear', 'Unbroken canal waters bind southern rice bowls firmly to northern capitals and garrisons.', [
   ['Inscribe hydraulic lessons into the imperial engineering treatise', 45, { research: 9, prestige: 8 }],
   ['Honor honest censors before court', 25, { legitimacy: 7 }],
   ['Close the river works report', 0, { stability: 4 }]
  ]]
 );

 arc4('cw_reg_joseon_hangul', 'Regional', 'region_joseon',
  ['Vernacular Script Primers for Rural Bailiffs', 'Hall of Worthies scholars debate printing simple phonetic vernacular primers alongside classical Hanja so village elders read tax and farming rules.', [
   ['Print bilingual agricultural and legal primers across counties', 115, { research: 14, trust: 12, food: 40 }],
   ['Back vernacular medical and rain-gauge manuals quietly while keeping Hanja court rolls', 60, { research: 10, trust: 8, stability: 6 }],
   ['Reserve classical script strictly for civil examinations and state edicts', 0, { legitimacy: 7, faithAuthority: 6 }]
  ]],
  ['Conservative Scholars Protest at Palace Gate', 'Senior yangban literati kneel outside palace doors warning easy letters dilute timeless classical Confucian learning.', [
   ['Reassure literati calmly: classical exams endure while peasants gain honest laws', 45, { stability: 9, legitimacy: 9, research: 6 }],
   ['Invite critics to co-author clear ethical farming almanacs', 55, { acceptance: 8, trust: 8, research: 7 }],
   ['Maintain firm sovereign support for practical public enlightenment', 0, { legitimacy: 8, prestige: 6 }]
  ]],
  ['Copper Rain-Gauges & Movable Metal Type', 'Royal artisans pair brass rain-gauges in every county yard with swift cast-metal movable type.', [
   ['Deploy brass rain-gauges nationwide to forecast drought relief early', 85, { research: 12, food: 65, development: 1 }],
   ['Publish clean medical herbals for rural women', 45, { research: 9, trust: 9 }],
   ['Archive rain measurements carefully in court chronicles', 0, { research: 6, legitimacy: 5 }]
  ]],
  ['Enlightened Governance', 'Phonetic literacy, rain science, and classical ethics blend harmoniously across mountain provinces.', [
   ['Award silk robes to the Hall of Worthies', 40, { prestige: 9, research: 7 }],
   ['Inspect county granaries with new gauges', 30, { food: 40 }],
   ['Close the court academy term', 0, { stability: 4 }]
  ]]
 );

 arc4('cw_reg_japan_tea_sword', 'Regional', 'region_ashikaga',
  ['Sengoku Castle-Towns & Merchant Guilds', 'Proud shugo governors fortify stone hilltop keeps while ambitious port guilds in Sakai ask autonomy to run overseas bronze-coin and sword trade.', [
   ['Grant port guilds self-policing charters in return for regular silver levies', 115, { credit: 12, loyalty: 7, development: 1 }],
   ['Mediate clear bounds keeping warrior houses dominant over road tolls', 55, { loyalty: 10, stability: 7 }],
   ['Enforce strict shogunal inspections on every coastal cargo junk', 0, { legitimacy: 8, securityMonths: 7, loyalty: -3 }]
  ]],
  ['Quiet Tea-Pavilion Diplomacy', 'Inside bamboo-screened tea rooms, rivals lay down long katanas outside low doors to bargain alliances over stoneware bowls.', [
   ['Sponsor renowned tea masters to reconcile feuding provincial houses', 85, { loyalty: 12, prestige: 10, stability: 7 }],
   ['Commission exquisite folded-steel blades as ceremonial peace gifts', 60, { prestige: 9, loyalty: 8, tools: 12 }],
   ['Keep warrior retinues strictly balanced at Kyoto ceremonies', 0, { securityMonths: 7, legitimacy: 5 }]
  ]],
  ['Copper Cash Shortages Hit Markets', 'Imported coin strains leave local rice markets short; town brokers circulate rough private copper tokens.', [
   ['Certify honest guild money-scales and regulate copper exchange rates', 65, { credit: 10, inflation: -3, trust: 8 }],
   ['Accept cleanly weighed rice bales alongside copper for tax dues', 30, { food: 60, stability: 6 }],
   ['Ban clipped private tokens inside shogunal market wards', 0, { legitimacy: 7, credit: 4 }]
  ]],
  ['Blossom & Steel in Balance', 'Measured charters curb castle-town feuds while skilled smiths and merchants keep coastal harbors humming.', [
   ['Inscribe house-mediation laws in shogunal codes', 40, { legitimacy: 8, loyalty: 6 }],
   ['Patronize Noh theater honoring ancestral valor', 35, { prestige: 9 }],
   ['Close the Kyoto audience', 0, { stability: 4 }]
  ]]
 );

 arc4('cw_reg_timurids_samarkand', 'Regional', 'region_timurids',
  ['Cracked Turquoise Ribs of the Great Dome', 'Frost heaves loosen brilliant lapis tilework high above a famed madrasa portal, threatening both scholars beneath and dynastic splendor.', [
   ['Summon master tilemakers and architects to restore glittering domes cleanly', 145, { prestige: 14, piety: 10, research: 9 }],
   ['Fund sturdy scaffold bracing and waterproof glazed bricks first', 75, { development: 1, piety: 7, stability: 6 }],
   ['Seal outer arches gently until dry summer heat permits mortar', 0, { stability: 5, prestige: 3 }]
  ]],
  ['Miniature Painters & Poets Vie for Stipends', 'Exquisite Persian illuminators and Chagatai verse masters crowd courtyard gardens seeking royal workshop commissions.', [
   ['Endow a glittering Royal Kitabkhana uniting calligraphers and painters', 100, { research: 13, prestige: 13, acceptance: 7 }],
   ['Commission illustrated historical chronicles honoring dynastic heritage', 60, { legitimacy: 9, prestige: 9 }],
   ['Award modest robe honors to finest poets at spring Navruz', 0, { prestige: 6, loyalty: 5 }]
  ]],
  ['Irrigation Qanats Silted Beyond Oasis', 'Beneath steppe winds, underground stone water-channels carrying snowmelt toward oasis gardens risk collapse.', [
   ['Hire skilled muqanni well-diggers to clear qanat tunnels cleanly', 95, { food: 80, development: 1, trust: 10 }],
   ['Organize oasis clan work-crews with grain stipends', 45, { food: 50, loyalty: 6 }],
   ['Protect open cisterns carefully through summer heat', 0, { food: 25, stability: 4 }]
  ]],
  ['Jewel of Silk & Cobalt', 'Gleaming turquoise domes and flowing oasis qanats announce enduring cultural radiance across Eurasia.', [
   ['Host foreign scholars beside the restored portal', 45, { prestige: 10, acceptance: 8 }],
   ['Archive hydraulic qanat maps', 25, { research: 6 }],
   ['Close the Samarkand works', 0, { stability: 4 }]
  ]]
 );

 arc4('cw_reg_france_parlement', 'Regional', 'region_france',
  ['Stone Halls of Provincial Parlements', 'Proud regional judges insist royal tax edicts lack force until solemnly registered inside provincial parlement parchment rolls.', [
   ['Respect ceremonial remonstrance while clarifying swift crown justice', 95, { legitimacy: 11, stability: 8, trust: 7 }],
   ['Negotiate clean provincial road & bridge budgets directly with estates', 120, { development: 1, loyalty: 9, credit: 7 }],
   ['Issue brisk royal lit de justice writs compelling immediate registration', 0, { legitimacy: 8, loyalty: -5, prestige: 5 }]
  ]],
  ['Artillery Train Rolls Over Muddy Bridges', 'Royal ordinance gunners test cast-bronze carriages able to cross country timber bridges without sinking.', [
   ['Fund stone bridge arches along main royal post-roads', 110, { development: 1, credit: 9, securityMonths: 7 }],
   ['Station royal artillery magazines securely inside walled towns', 55, { securityMonths: 8, tools: 15 }],
   ['Restrict heavy carriage movements to dry summer tracks', 0, { stability: 5 }]
  ]],
  ['Silk Looms of Lyon Challenge Imports', 'Urban merchants beg royal guild charters and mulberry trees to weave damask inside the kingdom instead of draining gold.', [
   ['Charter Lyon silk fairs with tax holidays for incoming master weavers', 85, { credit: 11, acceptance: 8, development: 1 }],
   ['Exempt raw silk cocoons from internal river customs', 40, { credit: 8, trust: 6 }],
   ['Tax imported foreign brocades mildly to fund native workshops', 0, { gold: 80, credit: 4 }]
  ]],
  ['Crown Justice & Rising Cities', 'Measured parlements, stone highways, and booming silk fairs knit provinces tightly round the fleur-de-lis.', [
   ['Codify clear provincial customary laws cleanly in French prose', 50, { legitimacy: 9, research: 7 }],
   ['Thank loyal marshals and magistrates', 25, { prestige: 6, stability: 5 }],
   ['Close the parlement session', 0, { stability: 4 }]
  ]]
 );

 arc4('cw_reg_england_wool_parliament', 'Regional', 'region_england',
  ['Petition of the Commons & Wool Staplers', 'Shire knights and town burgesses assemble requesting fairer wool-custom audits and swift coastal piracy patrols before voting subsidies.', [
   ['Hear Commons petitions candidly and fund coastal patrol sloops', 120, { legitimacy: 11, credit: 10, trust: 10 }],
   ['Balance noble lords and town merchants cleanly inside joint committees', 55, { stability: 8, loyalty: 8 }],
   ['Stand firmly on ancient royal prerogative over customs books', 0, { legitimacy: 7, loyalty: -3, credit: 3 }]
  ]],
  ['Justices of the Peace Check Manor Weights', 'Unpaid country squires serving as county justices keep sturdy order—yet some wink at friends’ fenced sheep-runs.', [
   ['Audit county justices calmly through traveling royal assize judges', 65, { legitimacy: 10, trust: 9, unrest: -6 }],
   ['Print uniform Statute Books so rural justices apply one clean law', 50, { research: 8, legitimacy: 8 }],
   ['Praise diligent shire justices at seasonal court', 0, { loyalty: 7, stability: 5 }]
  ]],
  ['Broadcloth Ships Clear the Channel', 'Merchant Adventurers hoist sail carrying dyed native broadcloth rather than raw fleece, multiplying port profits.', [
   ['Expand river warehouse cranes and sound English coin standards', 85, { development: 1, credit: 10, inflation: -2 }],
   ['Grant safe-conduct treaties for cloth fleets in northern ports', 40, { credit: 8, acceptance: 6 }],
   ['Collect crisp cloth-pack export duties', 0, { gold: 95 }]
  ]],
  ['Realm Anchored in Law & Cloth', 'Harmonious parliaments and booming cloth ships steady the crown through turbulent seas.', [
   ['Inscribe approved statutes cleanly on parliament parchment', 35, { legitimacy: 8 }],
   ['Feast county knights and London aldermen', 30, { trust: 7, prestige: 7 }],
   ['Close the parliament roll', 0, { stability: 4 }]
  ]]
 );

 arc4('cw_reg_imperial_diet', 'Regional', 'region_imperial',
  ['Gilded Coaches Arrive at the Imperial Diet', 'Prince-electors, free imperial cities, and prelates pack timber halls to debate public land-peace, coinage chaos, and feuding barons.', [
   ['Proclaim Eternal Land-Peace forbidding private noble feuds cleanly', 120, { legitimacy: 12, stability: 10, unrest: -8 }],
   ['Set up a central Imperial Chamber Court to arbitrate boundary suits', 85, { legitimacy: 10, trust: 9, credit: 6 }],
   ['Mediate individual elector grievances quietly behind arras hangings', 0, { loyalty: 8, stability: 5 }]
  ]],
  ['Free Cities Clamor Over Robber Barons', 'Nuremberg and Augsburg factors present burned wagon spokes from mountain passes guarded by arrogant castle knights.', [
   ['Back circle-militias uniting burghers and lawful lords against highway knights', 95, { securityMonths: 10, credit: 10, trust: 9 }],
   ['Compel offending knights to swear court peace or forfeit toll rights', 40, { legitimacy: 9, stability: 6 }],
   ['Offer safe royal imperial escort charters to fair caravans', 0, { credit: 6, securityMonths: 6 }]
  ]],
  ['Confusion of Fifty Tiny Mint Stamps', 'Merchants groan carrying balance scales to sort eighty conflicting bishopric and ducal silver pennies.', [
   ['Propose uniform imperial silver thaler weight standards across circles', 85, { credit: 12, inflation: -4, research: 6 }],
   ['Recognize sound free-city silver stamps along main river highways', 35, { credit: 8, stability: 5 }],
   ['Leave local mints intact while testing weights at imperial fairs', 0, { credit: 4, legitimacy: 4 }]
  ]],
  ['Order Across a Patchwork Crown', 'A high peace court and sound trade thalers turn fractious estates into thriving common prosperity.', [
   ['Deposit the Land-Peace Accord inside imperial archives', 40, { legitimacy: 9, prestige: 7 }],
   ['Toast electors and free-city mayors jointly', 30, { loyalty: 8, trust: 7 }],
   ['Close the Diet recess', 0, { stability: 4 }]
  ]]
 );

 arc4('cw_reg_poland_sejm', 'Regional', 'region_poland',
  ['Szlachta Banners Gather at the Sejm Field', 'Mounted noble deputies pitch colorful tents on open plains to weigh grain exports down river barges and border defense.', [
   ['Respect noble liberties while binding frontier militia obligations clearly', 110, { loyalty: 11, legitimacy: 9, stability: 7 }],
   ['Channel grain-barge wealth into paved river ports at Danzig/Vistula', 120, { credit: 11, development: 1, food: 55 }],
   ['Listen politely to provincial sejmiki petitions before issuing writs', 0, { loyalty: 7, trust: 6 }]
  ]],
  ['Baltic Wheat Barges Crowd River Quays', 'Flat-bottomed Vistula rafts piled high with golden rye glide past castle customs toward hungry western ships.', [
   ['Build dry brick granaries and honest brass measures at the river mouth', 90, { food: 75, credit: 10, development: 1 }],
   ['Exempt noble harvest rafts once frontier watch-levies settle cleanly', 40, { loyalty: 9, credit: 6 }],
   ['Collect crisp river export customs cleanly', 0, { gold: 105 }]
  ]],
  ['Tolerance Debate Across Diverse Parishes', 'Catholic, Orthodox, Jewish, and Protestant townsfolk seek firm royal confirmation of peaceful neighborhood charters.', [
   ['Confirm sweeping religious peace protecting every worship hall cleanly', 75, { acceptance: 14, stability: 9, trust: 10 }],
   ['Mediate city guild shares fairly between native and newcomer artisans', 45, { acceptance: 10, credit: 7 }],
   ['Enforce strict civic peace banning street polemics', 0, { securityMonths: 8, stability: 6 }]
  ]],
  ['Granary & Commonwealth in Peace', 'Harmonious river ports and broad civic tolerance anchor vast plains in brisk prosperity.', [
   ['Record Sejm accords under crown & noble seals', 40, { legitimacy: 9, loyalty: 7 }],
   ['Host harvest riders at the royal hall', 25, { prestige: 7 }],
   ['Close the Sejm session', 0, { stability: 4 }]
  ]]
 );

 arc4('cw_reg_muscovy_kremlin', 'Regional', 'region_muscovy',
  ['Timber Walls Around the River Citadel', 'Winter frost splits old oak palisades around the sovereign citadel; foreign Italian and native masons propose towering red-brick walls.', [
   ['Build mighty red-brick swallowtail battlements and vaulted armories', 160, { development: 1, securityMonths: 11, prestige: 11 }],
   ['Erect stone gatehouses and broad earthen ditches first', 80, { securityMonths: 9, stability: 7 }],
   ['Replace rotted oak logs promptly with seasoned northern pine', 0, { securityMonths: 6, tools: 12 }]
  ]],
  ['Service Nobles Request Pomestie Lands', 'Rising mounted horsemen serving the central court ask for conditional frontier estates rather than hereditary princely fiefs.', [
   ['Grant conditional service estates tied strictly to loyal muster', 85, { legitimacy: 10, loyalty: 10, securityMonths: 7 }],
   ['Organize clean regional muster books balancing old boyars and new horse', 45, { stability: 8, legitimacy: 8 }],
   ['Confirm ancestral boyar charters alongside modest horse stipends', 0, { loyalty: 7, prestige: 5 }]
  ]],
  ['Sleigh Post Stations Across Frozen Forests', 'Thick snow shuts mud tracks—yet crisp yam-post sleigh relays move royal couriers two hundred versts in two days.', [
   ['Standardize warm post-inns and spare horses along northern trade roads', 85, { development: 1, credit: 9, securityMonths: 8 }],
   ['Protect fur-and-wax sleigh convoys with forest pickets', 45, { credit: 8, trust: 7 }],
   ['Issue copper yam-bells to official dispatch sleds', 0, { legitimacy: 6, securityMonths: 5 }]
  ]],
  ['Red Brick Above White Snow', 'Imposing brick towers and swift forest relays bind scattered river principalities around one firm throne.', [
   ['Bless the completed cathedral & citadel square', 45, { piety: 10, prestige: 9 }],
   ['Archive provincial pomestie rolls cleanly', 25, { legitimacy: 7 }],
   ['Close the citadel works', 0, { stability: 4 }]
  ]]
 );

 arc4('cw_reg_mamluk_spice', 'Regional', 'region_mamluks',
  ['Venetian & Alexandrian Spice Scales', 'Red Sea pepper barges unload pungent sacks at Suez caravans; European galleys await fair anchorage in Cairo and Alexandria.', [
   ['Stabilize honest royal spice customs and protect Red Sea pilgrim routes', 135, { credit: 12, piety: 9, acceptance: 8 }],
   ['Invest in paved desert caravan cisterns between Red Sea and Nile', 90, { development: 1, credit: 10, food: 40 }],
   ['Collect crisp royal spice-monopoly levies cleanly', 0, { gold: 120, credit: 3 }]
  ]],
  ['Amirs Dispute Horse-Archery vs Matchlocks', 'Proud armored furusiyya horsemen disdain smoky brass arquebuses even as coastal raiders test harbor forts.', [
   ['Build coastal bastion gun-batteries alongside proud elite horsemanship', 110, { securityMonths: 10, research: 8, loyalty: 7 }],
   ['Equip harbor garrison regiments with matchlocks without shaming horsemen', 60, { securityMonths: 8, loyalty: 8 }],
   ['Honor classical lance-and-bow tournaments in the Hippodrome', 0, { prestige: 8, loyalty: 7 }]
  ]],
  ['Nilometer Rising at Roda Island', 'Crowds watch anxious water marks on the marble Nilometer pillar as August floods swell slowly.', [
   ['Inspect Nile embankment dikes and clean feeder canals immediately', 85, { food: 90, trust: 11, development: 1 }],
   ['Hold back reserve Upper Egypt grain barges until flood crest confirms', 40, { food: 65, stability: 7 }],
   ['Proclaim joyous Wafa al-Nil festival once waters top sixteen cubits', 0, { prestige: 8, trust: 8 }]
  ]],
  ['Crossroads of Nile & Spice', 'Managed Nile floods, honest Alexandria docks, and sturdy coastal forts guard timeless wealth.', [
   ['Endow a madrasa hospital beside the Nilometer', 55, { piety: 10, research: 7 }],
   ['Feast returning Red Sea captains', 30, { credit: 7, prestige: 6 }],
   ['Close the Nile & customs roll', 0, { stability: 4 }]
  ]]
 );

 arc4('cw_reg_mali_niger', 'Regional', 'region_mali',
  ['Gold-Dust Caravans & Niger Canoe Fleets', 'As Saharan salt bars descend onto river wharves, griots sing royal lineage praises while guild chiefs demand safe canoe channels.', [
   ['Pave stone river landings and guard northern salt-oasis wells', 130, { credit: 12, development: 1, trust: 10 }],
   ['Charter clean gold-assay scales shared by Wangara and desert brokers', 65, { credit: 10, acceptance: 9 }],
   ['Collect standard royal gold-nugget customs cleanly', 0, { gold: 110, credit: 4 }]
  ]],
  ['Scholars of Sankore Petition for Paper', 'Renowned jurists and astronomers in mud-brick libraries plead for crisp Egyptian paper reams and ink to preserve thousands of texts.', [
   ['Grant caravan tax exemptions on paper, books, and scholarly ink', 75, { research: 14, piety: 10, acceptance: 7 }],
   ['Endow clay-plaster library roofs and copyist bread stipends', 85, { research: 12, development: 1, piety: 9 }],
   ['Purchase fine illuminated legal codices for the palace', 0, { prestige: 8, research: 6 }]
  ]],
  ['Kola & Cotton Weavers Along Inland Trails', 'Southern forest trails deliver scarlet kola nuts and cotton strips eager for Niger loom towns.', [
   ['Build shaded wayside market wells along southern forest tracks', 70, { food: 45, credit: 9, trust: 9 }],
   ['Standardize cotton-strip cloth currency measures fairly', 35, { credit: 8, stability: 6 }],
   ['Welcome forest merchants cleanly at open markets', 0, { acceptance: 7, credit: 5 }]
  ]],
  ['Golden Arc of the Niger', 'Anchored by salt, gold dust, canoes, and ink, the savanna empire shines across Africa and beyond.', [
   ['Host griot chronicle recitations at the court feast', 40, { prestige: 10, legitimacy: 8 }],
   ['Inspect seasonal river grain reserves', 30, { food: 50 }],
   ['Close the Niger trade roll', 0, { stability: 4 }]
  ]]
 );

 arc4('cw_reg_ethiopia_highlands', 'Regional', 'region_ethiopia',
  ['Carved Stone Steps Through Highland Passes', 'Mule trains bearing salt amole bars, coffee, and frankincense scramble up steep basalt escarpments isolating fertile plateaus.', [
   ['Hew stone stair-roads and build guarded stone pass gates', 135, { development: 1, credit: 10, securityMonths: 9 }],
   ['Establish royal mule relay depots and valley bridge ropes', 70, { credit: 8, food: 40, trust: 8 }],
   ['Collect customary salt-bar pass tolls cleanly', 0, { gold: 80, credit: 4 }]
  ]],
  ['Monastic Chroniclers Paint Ge’ez Gospels', 'Highland abbey painters request lapis pigment, parchment, and royal protection for remote cliff monasteries.', [
   ['Endow monastery scriptoria and shield highland abbey estates', 95, { piety: 13, research: 10, faithAuthority: 8 }],
   ['Sponsor royal translations of foreign medical and law texts into Ge’ez', 65, { research: 11, prestige: 8 }],
   ['Send beeswax candles and linen vestments to cliff abbeys', 0, { piety: 8, trust: 6 }]
  ]],
  ['Envoys Seeking Artisans From Afar', 'Highland builders seek master stone-vaulting masons and metalworkers from distant Christian and Mediterranean courts.', [
   ['Welcome skilled foreign artisans warmly into royal workshops', 85, { research: 11, acceptance: 9, tools: 18 }],
   ['Trade highland civet musk and gold cleanly for fine armor and books', 50, { credit: 8, prestige: 8 }],
   ['Preserve distinct native stone-carving guilds proudly', 0, { piety: 6, legitimacy: 6 }]
  ]],
  ['Citadel Above the Clouds', 'Connected mountain passes and vibrant Ge’ez scholarship preserve highland sovereignty intact.', [
   ['Confirm provincial governors’ highland tribute rolls', 40, { legitimacy: 8, loyalty: 7 }],
   ['Celebrate Timkat waters at highland springs', 30, { piety: 10, trust: 7 }],
   ['Close the highland road ledger', 0, { stability: 4 }]
  ]]
 );

 arc4('cw_reg_mexica_tribute', 'Regional', 'region_mexica',
  ['Jade, Cacao & Eagle-Feather Tribute Rolls', 'Painted amate-paper tribute codices reveal outer provinces slipping behind on obsidian blades, cotton mantas, and golden maize.', [
   ['Dispatch poised calpixque stewards balancing fair quotas with open trade', 95, { loyalty: 9, credit: 10, legitimacy: 8 }],
   ['Expand lakeside market canoes so distant towns earn tribute peacefully', 110, { development: 1, credit: 11, food: 50 }],
   ['Send stern warrior inspectors demanding full seasonal bales', 0, { prestige: 7, loyalty: -5, gold: 85 }]
  ]],
  ['Flood Surge Over Causeway Bridges', 'Heavy autumn valley rains lift lake levels dangerously near low-lying island neighborhoods.', [
   ['Raise stone-and-earth flood dikes with removable timber canoe sluices', 140, { development: 1, food: 80, trust: 11 }],
   ['Clear clogged drainage ditches with paid urban neighborhood teams', 65, { food: 45, trust: 8 }],
   ['Guard low-lying adobe shrines with sand-filled reed mats', 0, { piety: 6, stability: 5 }]
  ]],
  ['Pochteca Merchants Bring Strange Rumors', 'Long-distance merchant guilds return from southern jungles carrying quetzal plumes, cacao beans, and keen copper bells.', [
   ['Honor pochteca elders inside royal halls for loyal intelligence', 65, { securityMonths: 10, credit: 9, prestige: 8 }],
   ['Charter regulated cacao-bean exchange standards at the grand market', 45, { credit: 9, trust: 8 }],
   ['Collect crisp luxury feather customs at the causeway gate', 0, { gold: 95 }]
  ]],
  ['Island Metropolis Shining on Water', 'Steadied dikes, booming markets, and fair tribute stewards anchor the valley’s thriving capital.', [
   ['Inscribe clean tribute maps on fresh amate bark', 35, { legitimacy: 8, research: 5 }],
   ['Host the joyful flower-and-song market feast', 30, { prestige: 9, trust: 7 }],
   ['Close the valley tribute book', 0, { stability: 4 }]
  ]]
 );

 arc4('cw_reg_inca_qhapaq_nan', 'Regional', 'region_inca',
  ['Frayed Rope Bridge Over the Canyon', 'Swaying woven-grass cables spanning a dizzying Andean gorge fray dangerously, threatening royal runner chasquis and llama trains.', [
   ['Weave thick fresh ichu-grass hawser cables in ceremonial bridge-festival', 120, { development: 1, trust: 12, stability: 9 }],
   ['Reinforce stone bridge abutments and stock spare coiled cables', 70, { tools: 18, securityMonths: 8, credit: 6 }],
   ['Reroute llama caravans briefly along upper rocky trails', 0, { stability: 5, food: -10 }]
  ]],
  ['Quipu Keepers Audit Mountain Qollqa Barns', 'Master knotted-cord accountants inspect highland freeze-dried chuño potato storehouses after early frost.', [
   ['Open state qollqa stores generously to frost-hit valley ayllus', 75, { food: 95, trust: 12, legitimacy: 8 }],
   ['Cross-audit quipu knots to ensure provincial governors kept honest counts', 40, { legitimacy: 9, securityMonths: 7 }],
   ['Restock dried llama jerky and salt alongside potatoes', 0, { food: 55, grain: 14 }]
  ]],
  ['Stone Terrace Steps Climb Steep Slopes', 'Engineers propose carving fresh granite agricultural terraces warmed by stone retaining walls to grow high-altitude maize.', [
   ['Build irrigated stone andenes terraces cleanly up valley slopes', 135, { development: 1, food: 95, trust: 9 }],
   ['Supply copper crowbars and stone wedges to local work-crews', 55, { tools: 18, food: 50 }],
   ['Maintain existing sunny terraces carefully', 0, { food: 35, stability: 5 }]
  ]],
  ['Roads Knitted Across Sky & Crag', 'Fresh grass cables, stocked qollqas, and stone terraces keep mountain realms fed and swiftly linked.', [
   ['Reward fleet-footed chasqui runners with woven tunics', 35, { prestige: 8, securityMonths: 6 }],
   ['Record terrace yields cleanly in knotted quipus', 25, { legitimacy: 7 }],
   ['Close the highland works ledger', 0, { stability: 4 }]
  ]]
 );

 arc4('cw_reg_majapahit_spice', 'Regional', 'region_majapahit',
  ['Spice Ships & Bronze Gongs Across Archipelago', 'Outrigger merchant fleets arrive from eastern clove islands seeking fair rice trades and royal protection against straits pirates.', [
   ['Dispatch armed escort jongs and charter clean port rice-for-clove depots', 135, { credit: 12, food: 65, acceptance: 9 }],
   ['Hold an archipelago council reconciling island harbor chiefs peacefully', 70, { loyalty: 11, credit: 8, stability: 7 }],
   ['Levy standard spice customs at the delta river mouth', 0, { gold: 105, credit: 4 }]
  ]],
  ['Brackish Tides Threaten Delta Rice Polders', 'Spring ocean tides seep over muddy coastal bunds unless stone sluice-gates block salt water at high tide.', [
   ['Build brick-and-laterite tidal sluices protecting green rice fields', 120, { food: 90, development: 1, trust: 10 }],
   ['Mobilize village canal-crews with bamboo mats and clay', 55, { food: 55, trust: 8 }],
   ['Plant salt-tolerant mangrove belts along outer mudflats', 0, { food: 30, stability: 6 }]
  ]],
  ['Shadow-Puppet Poets & Bronze Gamelan', 'Town squares pack nightly around oil-lit screens where wayang masters weave royal statecraft into ancient epics.', [
   ['Patronize master gamelan smiths and puppet storytellers cleanly', 75, { prestige: 11, trust: 10, piety: 7 }],
   ['Sponsor bright port festivals welcoming foreign captains warmly', 45, { acceptance: 9, credit: 7 }],
   ['Let village guilds organize seasonal performances freely', 0, { trust: 6, stability: 4 }]
  ]],
  ['Harmony of Rice & Spice Islands', 'Protected sea lanes, rich irrigated paddies, and vibrant arts bind far-flung islands under golden banners.', [
   ['Charter coastal lighthouse beacons on outer capes', 50, { credit: 9, securityMonths: 7 }],
   ['Honor loyal island regents', 25, { loyalty: 8 }],
   ['Close the island council roll', 0, { stability: 4 }]
  ]]
 );

 arc4('cw_reg_venice_arsenal', 'Regional', 'region_venice',
  ['Assembly Line Inside the Arsenal Walls', 'Master shipwrights organize moving canal-side slips where standardized pre-cut ribs and rigged masts assemble a full war-galley in days.', [
   ['Expand Arsenal ropewalks, timber sheds, and standardized brass fittings', 155, { development: 1, research: 12, credit: 11 }],
   ['Stock seasoned Adriatic oak and hemp tar inside dry covered sheds', 80, { tools: 20, credit: 9, securityMonths: 7 }],
   ['Keep steady traditional shipwright stalls turning cleanly', 0, { credit: 6, stability: 5 }]
  ]],
  ['Lagoon Silt Threatens Trade Channels', 'Rushing alpine rivers dump mud into the shallow lagoon, threatening to ground spice galleys or breed summer marsh fever.', [
   ['Divert silt-heavy river mouths cleanly out beyond coastal sandbars', 135, { development: 1, stability: 8, trust: 9 }],
   ['Hire mud-barge dredgers to keep main ship canals deep', 65, { credit: 8, trust: 7 }],
   ['Post strict depth markers and harbor pilot skiffs', 0, { securityMonths: 7, credit: 4 }]
  ]],
  ['Council of Ten Watches Whispering Masks', 'During vibrant carnival weeks, masked gossips drop anonymous denunciation slips inside stone Lion’s Mouth boxes.', [
   ['Require signed verifiable witnesses before investigating any slip', 45, { legitimacy: 10, trust: 9, securityMonths: 7 }],
   ['Track only serious foreign treason tips discreetly while ignoring petty spite', 30, { securityMonths: 9, stability: 6 }],
   ['Use anonymous boxes firmly to deter oligarchic cabals', 0, { securityMonths: 9, loyalty: -3 }]
  ]],
  ['Queen of the Lagoon Waters', 'Unmatched Arsenal efficiency and preserved lagoon waters keep galleys gliding cleanly from Alexandria to Flanders.', [
   ['Launch gilded ceremonial barge for Ascension Day vows', 50, { prestige: 12, piety: 6 }],
   ['Publish clean galley assembly timetables', 25, { research: 6 }],
   ['Close the Arsenal board', 0, { stability: 4 }]
  ]]
 );

 arc4('cw_reg_horde_kurultai', 'Regional', 'region_horde',
  ['Winter Camp & Silk Tribute Crossroads', 'Clan elders ride across frozen grass bringing felt tents and horse herds to weigh winter pasture borders and caravan safety.', [
   ['Host a grand kurultai feast, settle winter meadows, and guarantee caravan passes', 120, { loyalty: 12, food: 65, credit: 9 }],
   ['Charter safe river-crossing ferry towns where steppe herds trade hides for grain', 75, { credit: 9, food: 50, acceptance: 8 }],
   ['Confirm traditional seasonal grazing trails by Khan’s golden paiza', 0, { legitimacy: 8, loyalty: 6 }]
  ]],
  ['Settled Towns Beg Lower Grazing Encroachment', 'Plowland farmers near river margins complain stray winter cavalry horses trample winter wheat shoots.', [
   ['Mark clear hedged pasture corridors paying modest compensation to towns', 65, { trust: 11, food: 50, loyalty: 6 }],
   ['Reward obedient horse-herders with silk belts for keeping clear of wheat', 35, { food: 40, loyalty: 7 }],
   ['Remind townsfolk cavalry hooves shield every valley from raiders', 0, { loyalty: 6, legitimacy: 4 }]
  ]],
  ['Golden Paiza Safe-Conduct Tested', 'A merchant caravan carrying a gilded royal paiza tablet is robbed by rogue young horsemen from an outer banner.', [
   ['Hunt down the rogues swiftly, restore goods, and uphold sacred paiza law', 60, { legitimacy: 12, credit: 10, securityMonths: 9 }],
   ['Make the banner chief pay double silver restitution to merchants', 25, { credit: 8, legitimacy: 8, loyalty: -3 }],
   ['Order clan elders to punish culprits inside banner court', 0, { loyalty: 6, securityMonths: 6 }]
  ]],
  ['Sky-Blessed Steppe & Bustling Bazaars', 'Iron discipline along caravan roads blends nomadic horse-might smoothly with wealthy trading towns.', [
   ['Mint crisp bilingual silver dirhams honoring Khan’s peace', 45, { credit: 9, prestige: 8 }],
   ['Restock dried meat and horse-millet stores', 30, { food: 45 }],
   ['Close the seasonal kurultai', 0, { stability: 4 }]
  ]]
 );

 // === B. ADDITIONAL REGIONS + ALL 13 GOVERNMENT TYPES (gov_*) + ALL 5 CROSSROADS (crossroads_*) ===
 arc4('cw_reg_portugal_sagres', 'Regional', 'region_portugal',
  ['Caravel Shipwrights at the Cape', 'Pilots and cartographers gather on wind-swept southern cliffs testing triangular lateen sails built to tack against fierce Atlantic winds.', [
   ['Endow pilot academies, brass astrolabes, and spice-ship yards', 145, { research: 14, credit: 11, prestige: 10 }],
   ['Offer royal customs patents for honest island timber & sugar colonies', 75, { credit: 10, development: 1, food: 40 }],
   ['Keep coastal fishing and Lisbon salt fleets well protected', 0, { food: 45, stability: 5 }]
  ]],
  ['Cross-Staff Readings Under Southern Stars', 'Returning captains report polar stars sinking low while unknown constellations guide midnight watches.', [
   ['Compile solar declination tables freeing sailors from Polaris alone', 70, { research: 12, credit: 8 }],
   ['Equip captains with lead sounding-lines and fresh lemon casks', 45, { research: 8, trust: 7 }],
   ['Lock ocean rutters safely inside royal archive vaults', 0, { securityMonths: 8, legitimacy: 6 }]
  ]],
  ['Spice & Malagueta Pepper Reach Lisbon Piers', 'Weather-beaten caravels glide up the Tagus laden with ivory carvings, pepper, and West African gold.', [
   ['Build spacious stone India House customs warehouses', 95, { development: 1, credit: 12, prestige: 8 }],
   ['Host foreign mapmakers and honest Antwerp silver brokers', 50, { credit: 10, acceptance: 7 }],
   ['Collect crisp royal fifth duties cleanly', 0, { gold: 115 }]
  ]],
  ['Window Upon Vast Oceans', 'Bold navigation science turns a small Atlantic kingdom into an oceanic hub.', [
   ['Strike pure-gold cruzados gleaming across fairs', 45, { credit: 9, prestige: 9 }],
   ['Endow mariners’ coastal chapel', 30, { piety: 8, trust: 6 }],
   ['Close the navigation board', 0, { stability: 4 }]
  ]]
 );

 arc4('cw_reg_castile_mesta', 'Regional', 'region_castile',
  ['Flocks of the Honored Mesta Council', 'Two million fine merino sheep march north down ancient drove roads, sparking fierce disputes with town wheat farmers over nibbled hedges.', [
   ['Mark clear stone-walled sheep-walks protecting town wheat strips equally', 105, { food: 65, credit: 10, trust: 9 }],
   ['Promote brisk wool-washing houses while capping Mesta toll abuses', 65, { credit: 9, legitimacy: 7, development: 1 }],
   ['Uphold royal Mesta drove privileges smoothly for export revenue', 0, { gold: 95, credit: 5, loyalty: 4 }]
  ]],
  ['Hermandad Roads Patrol Countryside', 'Urban brotherhood militias patrol dusty meseta tracks hunting highway bandits cleanly without noble interference.', [
   ['Charter cooperative town brotherhoods under royal judges', 75, { securityMonths: 10, trust: 10, legitimacy: 8 }],
   ['Build stone watch-inns along bleak upland crossings', 55, { development: 1, securityMonths: 8 }],
   ['Reward loyal county constables cleanly', 0, { stability: 6 }]
  ]],
  ['Fine Merino Fleece Charms Antwerp Looms', 'Silky white merino wool sails from northern ports, financing soaring stone cathedrals and scholars.', [
   ['Support native Castilian wool-weaving workshops alongside raw export', 85, { development: 1, tools: 18, credit: 9 }],
   ['Standardize honest port wool-bale weights', 35, { credit: 8, legitimacy: 6 }],
   ['Collect crisp wool port customs', 0, { gold: 95 }]
  ]],
  ['Meseta Highways Safe & Prosperous', 'Balanced grazing trails and town brotherhood courts unite pastoral lords and wheat cities peacefully.', [
   ['Inscribe Mesta & Farmer Boundary Laws', 35, { legitimacy: 8, trust: 6 }],
   ['Host seasonal wool fairs cleanly', 25, { credit: 6 }],
   ['Close the Mesta council', 0, { stability: 4 }]
  ]]
 );

 arc4('cw_reg_delhi_canals', 'Regional', 'region_delhi',
  ['Silt in the Jamuna Royal Canals', 'Old sultanate irrigation canals feeding orchards and millet fields near the capital choke with reeds and broken brickwork.', [
   ['Dredge stone canal beds, mend sluices, and plant mango avenues', 145, { food: 105, development: 1, trust: 11 }],
   ['Employ hungry seasonal villagers clearing silt for grain stipends', 70, { food: 70, trust: 9, unrest: -6 }],
   ['Repair key garden sluices swiftly before dry summer', 0, { food: 40, stability: 5 }]
  ]],
  ['Iqta Governors Delay Cavalry Musters', 'Provincial commanders hold revenue villages yet drag boots delivering inspected horses and silver arrears.', [
   ['Brand imperial cavalry remounts cleanly (dagh) and audit iqta rolls', 65, { legitimacy: 10, securityMonths: 8, loyalty: 5 }],
   ['Hear local village elders openly against predatory tax-collectors', 45, { trust: 11, legitimacy: 8 }],
   ['Confirm loyal veteran commanders firmly in key forts', 0, { loyalty: 8, stability: 5 }]
  ]],
  ['Sufi Hospices & Vernacular Poets', 'Caravans and weavers pack peaceful khanqah hospices where gentle poets sing unity across traditions.', [
   ['Endow public hospice soup-kitchens serving every traveler', 75, { piety: 11, acceptance: 12, trust: 9 }],
   ['Patronize bilingual Indo-Persian music and historical manuscripts', 55, { research: 10, prestige: 9, acceptance: 8 }],
   ['Protect pilgrim caravanserais cleanly along highway stages', 0, { securityMonths: 7, credit: 6 }]
  ]],
  ['Flowering Doab & Ordered Road', 'Restored Jamuna canals, honest branded musters, and welcoming hospices bind fertile plains cleanly.', [
   ['Stock reserve grain in fortified sarai depots', 45, { food: 55, stability: 6 }],
   ['Honor fair revenue officers', 20, { legitimacy: 6 }],
   ['Close the Doab roll', 0, { stability: 4 }]
  ]]
 );

 arc4('cw_reg_gujarat_cloth', 'Regional', 'region_gujarat',
  ['Block-Printed Cotton Charters at Surat', 'Master block-printers and Gujarati indigo dyers produce vivid wash-fast chintz textiles coveted from Cairo to Malacca.', [
   ['Expand dyeing vats, step-wells, and bonded merchant quays', 145, { development: 1, credit: 13, tools: 18 }],
   ['Lower harbor duties on incoming raw silk and madder root', 65, { credit: 10, acceptance: 8 }],
   ['Collect steady port customs on departing cotton bales', 0, { gold: 115, credit: 4 }]
  ]],
  ['Carved Stone Step-Wells Run Low', 'Dense weaving villages drain ancient five-story step-wells low ahead of late monsoon clouds.', [
   ['Deepen carved stone vav basins and clear upland catchment channels', 95, { food: 65, development: 1, trust: 10 }],
   ['Hire water-bullock teams hauling spring water into dye-yards', 45, { trust: 7, tools: 12 }],
   ['Ration non-drinking dye-vat water fairly till rains break', 0, { stability: 6 }]
  ]],
  ['Jain, Bohra & Hindu Guilds Co-Sign Bills', 'Diverse port merchant houses pool reliable hundi bills of exchange trusted across every monsoon port.', [
   ['Give hundi bills swift crown court backing against default', 55, { credit: 12, acceptance: 10, legitimacy: 8 }],
   ['Build a grand covered textile exchange bazaar beside the dock', 75, { development: 1, credit: 9 }],
   ['Host multi-faith port elders at seasonal banquet', 0, { acceptance: 9, prestige: 7 }]
  ]],
  ['Looms of the Arabian Sea', 'Clean step-wells and ironclad hundi credit keep vibrant cottons sailing across oceans.', [
   ['Stamp pure royal dye-marks on prime cloth', 40, { prestige: 9, credit: 7 }],
   ['Inspect harbor lighthouse lamps', 25, { securityMonths: 6 }],
   ['Close the port guild roll', 0, { stability: 4 }]
  ]]
 );

 arc4('cw_reg_malacca_shahbandar', 'Regional', 'region_malacca',
  ['Four Shahbandar Harbormasters at the Quay', 'Ships from China, Gujarat, Java, and Ryukyu drop anchor together, crowding narrow wooden piers waiting for fair port brokers.', [
   ['Appoint dedicated bilingual shahbandar wardens and build stone godowns', 135, { credit: 13, acceptance: 12, development: 1 }],
   ['Standardize honest tin-ingot and gold-dust harbour scales', 65, { credit: 10, legitimacy: 8 }],
   ['Collect crisp royal customs duties cleanly by ship flag', 0, { gold: 115, credit: 4 }]
  ]],
  ['Undang-Undang Laut Sea-Code Drafted', 'Veteran sea captains gather to codify clear rules covering mutiny, jettisoned spice cargo, and shipwreck rescue.', [
   ['Promulgate the Malacca Maritime Code in gleaming royal decrees', 65, { legitimacy: 11, credit: 10, research: 8 }],
   ['Print palm-leaf and paper copies for every shipmaster clearing bar', 40, { research: 8, acceptance: 8 }],
   ['Confirm existing harbor custom laws cleanly', 0, { legitimacy: 7, stability: 5 }]
  ]],
  ['Orang Laut Sea-Scouts Spot Raiders', 'Loyal sea-nomad boatmen spot hidden pirate proas lurking behind mangrove islands along the narrow strait.', [
   ['Reward loyal sea-scouts with rice, cloth, and patrol flags', 70, { securityMonths: 11, trust: 10, acceptance: 8 }],
   ['Mount bronze swivel-guns on fast harbor escort boats', 65, { securityMonths: 9, tools: 15 }],
   ['Alert incoming merchant fleets via headland smoke signals', 0, { securityMonths: 7, stability: 5 }]
  ]],
  ['Emporium Where All Winds Meet', 'Clear sea law, safe warehouses, and faithful sea-scouts crown the strait as Asia’s fairest market.', [
   ['Endow clean freshwater wells on harbor piers', 40, { trust: 8, food: 30 }],
   ['Host departing monsoon captains cleanly', 25, { prestige: 8, acceptance: 7 }],
   ['Close the strait port register', 0, { stability: 4 }]
  ]]
 );

 // === ALL 13 GOVERNMENT TYPE ARCS (gov_*) ===
 arc4('cw_gov_feudal', 'Politics', 'gov_feudal',
  ['Scutage vs Knight-Service at County Court', 'Lesser feudal barons petition to commute forty-day personal lance service into fixed silver scutage payments during peacetime.', [
   ['Allow clean scutage commutation to fund disciplined crown companies', 95, { credit: 9, legitimacy: 8, loyalty: 7 }],
   ['Keep personal knightly homage vows intact while modernizing arms rolls', 50, { loyalty: 9, prestige: 7 }],
   ['Compel traditional personal armor musters twice yearly', 0, { loyalty: 5, legitimacy: 6 }]
  ]],
  ['Sub-Vassals Complain of Double Fines', 'Knights holding tiny manors under great earls protest being fined twice—once by their earl and again by royal bailiffs.', [
   ['Clarify clean feudal appeal rights straight to royal circuit courts', 55, { legitimacy: 10, trust: 9, loyalty: 4 }],
   ['Settle overlapping jurisdictions calmly at a great peers’ council', 45, { loyalty: 8, stability: 7 }],
   ['Respect intermediate lordship courts on petty manor disputes', 0, { loyalty: 7, stability: 4 }]
  ]],
  ['Tournament & Assize of Arms', 'Spring meadow tournaments blend chivalric display with strict inspection of honest steel harnesses and parish bows.', [
   ['Host grand royal lists rewarding true practical armor over gilded feathers', 90, { prestige: 10, loyalty: 8, tools: 14 }],
   ['Open county archery butts alongside knightly jousts', 45, { trust: 8, stability: 6 }],
   ['Inspect county armories briskly without banquet expense', 0, { securityMonths: 6, legitimacy: 5 }]
  ]],
  ['Oaths Kept Clean in Iron & Ink', 'Clear feudal reciprocity binds crown, earls, and humble village freeholders without tangled exploitation.', [
   ['Archive updated Knight-Fee Registers in the Tower', 35, { legitimacy: 8 }],
   ['Thank loyal bannermen', 20, { loyalty: 6 }],
   ['Close the feudal inquest', 0, { stability: 4 }]
  ]]
 );

 arc4('cw_gov_republic', 'Politics', 'gov_republic',
  ['Lottery Balls vs Factional Guild Slates', 'Wealthy merchant families try packing civic magistracies by buying votes inside artisan guilds ahead of biennial elections.', [
   ['Enforce blind lottery selection from vetted citizen eligibility purses', 90, { legitimacy: 11, trust: 11, stability: 8 }],
   ['Expand council seats slightly to balance great bankers with craft guilds', 65, { acceptance: 9, trust: 9, credit: 6 }],
   ['Confirm incumbent syndics briefly to keep harbor credit steady', 0, { credit: 7, unrest: 3 }]
  ]],
  ['Foreign Princes Whisper to Disgruntled Patricians', 'A defeated banking family privately hints at seeking outside princely backing unless granted customs privileges.', [
   ['Rotate suspect magistrates out cleanly and guard harbor gates tightly', 55, { securityMonths: 10, legitimacy: 9 }],
   ['Reconcile proud houses by pairing them onto prestigious hospital boards', 45, { stability: 8, piety: 6 }],
   ['Publish clear treason bans against private foreign pensions', 0, { legitimacy: 8, securityMonths: 7 }]
  ]],
  ['Civic Palace Frescoes Celebrate Concord', 'Commissioned courtroom murals remind sitting magistrates daily that faction ruins cities while concord builds ships.', [
   ['Endow public civic schools teaching rhetoric and honest bookkeeping', 80, { research: 10, trust: 9, credit: 7 }],
   ['Open quarterly public treasury audits in the main loggia', 40, { credit: 9, legitimacy: 8 }],
   ['Display gilded liberty statutes above city gates', 0, { prestige: 8, stability: 5 }]
  ]],
  ['The Republic Stands Unbought', 'Fair lotteries and open loggia audits protect civic liberty from both oligarchs and foreign intrigue.', [
   ['Seal updated electoral purses inside cathedral safes', 35, { legitimacy: 8, securityMonths: 6 }],
   ['Feast outgoing and incoming priors together', 25, { trust: 7, stability: 5 }],
   ['Close the civic election docket', 0, { stability: 4 }]
  ]]
 );

 arc4('cw_gov_imperial', 'Politics', 'gov_imperial',
  ['Anonymous Examination Scrolls Leaked', 'Rumors sweep the capital examination compound that corrupt proctors slipped essay topics inside wax pastry cakes for rich sons.', [
   ['Reseal all exam papers with blind recopied numbers and punish cheats harshly', 95, { legitimacy: 12, research: 8, trust: 10 }],
   ['Hold a swift surprise re-examination supervised personally by censors', 65, { legitimacy: 10, stability: 7 }],
   ['Investigate quietly to preserve examination prestige without public riot', 0, { securityMonths: 8, legitimacy: 5 }]
  ]],
  ['Provincial Scholars Protest Regional Quotas', 'Southern provinces sweep ninety percent of top seats, leaving rugged frontier provinces feeling shut out of imperial ministry.', [
   ['Introduce balanced northern-and-southern regional quotas protecting merit', 65, { acceptance: 11, stability: 9, legitimacy: 8 }],
   ['Fund free frontier county libraries and paper stipends to lift rural scores', 95, { research: 11, development: 1, trust: 9 }],
   ['Maintain strict single empire-wide grading purely by ink', 0, { research: 7, prestige: 5, unrest: 2 }]
  ]],
  ['Successful Candidates Parade Through Crimson Gates', 'New jinshi/imperial graduates ride beneath silk banners, eager to prove integrity in distant magistrate posts.', [
   ['Assign top practical graduates to irrigation and granary offices first', 50, { food: 55, legitimacy: 8 }],
   ['Print model examination essays nationwide for village schools', 45, { research: 9, prestige: 7 }],
   ['Host the grand imperial garden banquet for new scholars', 0, { prestige: 9, stability: 5 }]
  ]],
  ['Integrity of the Ink-Brush', 'Fair regional quotas and unbought exams renew trust in imperial meritocracy.', [
   ['Inscribe clean proctor rules on stone steles outside exam halls', 35, { legitimacy: 8 }],
   ['Thank honest censors', 20, { prestige: 5 }],
   ['Close the examination cycle', 0, { stability: 4 }]
  ]]
 );

 arc4('cw_gov_regional', 'Politics', 'gov_regional',
  ['Provincial Governors Demand Customary Autonomy', 'Distant regional lords petition to retain half of county customs locally for road repairs rather than carting every penny to capital vaults.', [
   ['Grant audited local infrastructure shares verified by annual crown stewards', 95, { loyalty: 11, development: 1, trust: 9 }],
   ['Negotiate clear multi-year regional compacts matching troops to roads', 55, { loyalty: 9, legitimacy: 8 }],
   ['Require full central treasury remittance before approving local works', 0, { legitimacy: 7, loyalty: -5, credit: 4 }]
  ]],
  ['Feud Over Provincial Chancery Language', 'Local nobles ask to submit manor appeals in their native regional dialect rather than stiff capital chancery prose.', [
   ['Accept bilingual appeals cheerfully while keeping uniform law codes', 60, { acceptance: 12, trust: 9, loyalty: 7 }],
   ['Supply salaried bilingual clerks at provincial courthouses', 50, { legitimacy: 8, acceptance: 9 }],
   ['Keep official statutes uniform while letting lawyers speak native tongue', 0, { stability: 6, acceptance: 5 }]
  ]],
  ['Regional Fair Draws Capital Buyers', 'Thriving local roads turn regional autonomy into genuine shared prosperity rather than sleepy isolation.', [
   ['Send royal patronage gifts to regional craft guilds', 55, { credit: 8, prestige: 7, loyalty: 6 }],
   ['Standardize regional grain weights cleanly with capital bushels', 30, { credit: 7, legitimacy: 6 }],
   ['Inspect county bridges cordially', 0, { trust: 5 }]
  ]],
  ['Unity Through Respect', 'Practical regional flexibility keeps outer provinces warmly bound to the crown without friction.', [
   ['Renew regional compacts publicly', 40, { loyalty: 8, legitimacy: 7 }],
   ['Praise cooperative governors', 20, { stability: 5 }],
   ['Close the regional council', 0, { stability: 4 }]
  ]]
 );

 arc4('cw_gov_sultanate', 'Politics', 'gov_sultanate',
  ['Qadi Justice & Frontier Commanders Clash', 'A fearless city qadi locks up a powerful provincial commander’s tax-agent for seizing poor widows’ spinning yarn illegally.', [
   ['Back the qadi’s impartial Sharia & Kanun justice firmly before court', 75, { legitimacy: 12, trust: 11, faithAuthority: 7 }],
   ['Mediate restitution cleanly while rotating the commander’s stewards', 45, { loyalty: 7, stability: 7, trust: 8 }],
   ['Transfer the dispute gently to the Grand Vizier’s imperial divan', 0, { legitimacy: 7, stability: 5 }]
  ]],
  ['Bazaar Guilds Cheer Honest Divan Doors', 'Touched by impartial hearings, urban artisans swarm the public divan courtyard praising the ruler’s Circle of Justice.', [
   ['Hold twice-weekly open petitioner audiences beneath palace arches', 55, { trust: 11, legitimacy: 9, unrest: -7 }],
   ['Fund public soup-kitchens (imaret) beside main mosques cleanly', 80, { piety: 11, food: 40, trust: 10 }],
   ['Post clear kanun tax plaques on bazaar gates', 0, { credit: 6, legitimacy: 6 }]
  ]],
  ['Minority Millet Elders Petition', 'Christian and Jewish community elders request calm renewal of autonomous family-court and synagogue/church repair charters.', [
   ['Confirm millet community charters warmly under royal protection', 55, { acceptance: 13, trust: 9, credit: 7 }],
   ['Grant fair timber permits for aging neighborhood roofs', 40, { acceptance: 10, stability: 6 }],
   ['Uphold established legal protections cleanly', 0, { legitimacy: 7, acceptance: 6 }]
  ]],
  ['The Circle of Justice Turns Smoothly', 'Impartial qadis shield peasants and guilds, feeding the prosperity that sustains the realm’s armies and mosques.', [
   ['Inscribe the Circle of Justice maxim in golden divan calligraphy', 35, { prestige: 9, legitimacy: 7 }],
   ['Thank upright qadis and viziers', 20, { faithAuthority: 6 }],
   ['Close the divan docket', 0, { stability: 4 }]
  ]]
 );

 arc4('cw_gov_shogunate', 'Politics', 'gov_shogunate',
  ['Border Boundary Stone Feud Between Houses', 'Two proud military houses mobilize bamboo spears over a half-mile strip of river reed-beds between neighboring manors.', [
   ['Summon both heads to Kyoto mediation and split reeds cleanly by old maps', 85, { loyalty: 11, stability: 9, legitimacy: 8 }],
   ['Assign a respected neutral zen abbot to adjudicate the stream channel', 45, { piety: 7, loyalty: 8, stability: 7 }],
   ['Order both houses sharply to stand down under threat of estate forfeit', 0, { legitimacy: 8, loyalty: -4, securityMonths: 6 }]
  ]],
  ['Retainers Seek Stipend Security', 'Foot-soldiers and minor samurai complain rice-stipend prices swing wildly whenever speculators corner Osaka boats.', [
   ['Establish regulated rice-stipend exchange brokers with fair seasonal floors', 85, { credit: 9, loyalty: 9, food: 55 }],
   ['Store emergency shogunal rice inside castle keep vaults', 65, { food: 65, securityMonths: 7 }],
   ['Enforce strict anti-hoarding edicts on rice boatmen', 0, { legitimacy: 6, trust: 6 }]
  ]],
  ['Shogunal Poetry & Swords', 'At peace, military houses vie warmly in archery from horseback, calligraphy, and garden rockery.', [
   ['Host an imperial-shogunal archery festival honoring discipline', 75, { prestige: 11, loyalty: 9 }],
   ['Patronize lacquerware and sword-furniture guilds cleanly', 45, { credit: 8, tools: 12 }],
   ['Encourage quiet manor stewardship across provinces', 0, { food: 30, stability: 5 }]
  ]],
  ['Harmony Under Dual Law & Blade', 'Firm shogunal mediation turns petty reed-bed feuds into stable house obedience.', [
   ['Seal updated House Codes cleanly', 35, { legitimacy: 8, loyalty: 6 }],
   ['Thank patient zen mediators', 20, { piety: 6 }],
   ['Close the house mediation file', 0, { stability: 4 }]
  ]]
 );

 arc4('cw_gov_steppe', 'Politics', 'gov_steppe',
  ['Late Blizzard Traps Winter Herds', 'Three days of freezing sleet glaze steppe grass in solid iron ice (dzud), threatening sheep and pony foals across outer pastures.', [
   ['Open royal hay reserves, slaughter weak stock cleanly, and share smoked meat', 130, { food: 85, loyalty: 12, trust: 11 }],
   ['Guide clans swiftly down sheltered river-reed valleys for dry browse', 55, { food: 50, loyalty: 8, stability: 6 }],
   ['Send swift outriders trading frontier salt and millet for wool felts', 0, { food: 40, credit: 5, loyalty: 5 }]
  ]],
  ['Outer Banner Demands Pasture Reallocation', 'Hard-hit outer clans ask to winter inside lush royal river meadows usually saved for palace horse studs.', [
   ['Share the outer half of royal meadows cleanly till green spring', 55, { loyalty: 13, trust: 10, food: 35 }],
   ['Supply oat sacks from river barges instead to protect royal stud grass', 75, { food: 55, loyalty: 8 }],
   ['Assign fair rotating weekly grazing strips under banner stewards', 0, { stability: 6, loyalty: 6 }]
  ]],
  ['Spring Green Brings Foals & Felt', 'Saved by swift winter solidarity, surviving mares drop sturdy foals across emerald hills.', [
   ['Host mounted archery and wrestling games uniting all banners', 70, { prestige: 10, loyalty: 11 }],
   ['Trade surplus spring wool and cheeses at border river markets', 30, { gold: 80, credit: 7 }],
   ['Bless the herds under open sky', 0, { piety: 8, loyalty: 6 }]
  ]],
  ['Stronger Together Across Frost', 'True nomadic sovereignty shines brightest when hardship strikes—binding every banner tightly to the Khan’s tent.', [
   ['Replenish dried hay stacks beside winter rivers', 45, { food: 50, stability: 6 }],
   ['Gift silver belt plaques to loyal banner elders', 30, { loyalty: 8, prestige: 6 }],
   ['Close the winter pasture council', 0, { stability: 4 }]
  ]]
 );

 arc4('cw_gov_centralized', 'Politics', 'gov_centralized',
  ['Intendants Clash With Provincial Nobles', 'Salaried royal intendants dispatched from the capital expose messy local manor tax arrears—rousing aristocratic outcry over "clerk tyranny."', [
   ['Back honest intendants firmly while welcoming noble petitions at crown council', 95, { legitimacy: 11, credit: 8, loyalty: 4 }],
   ['Pair each intendant quietly with two respected local gentry assessors', 55, { trust: 9, loyalty: 7, legitimacy: 7 }],
   ['Recall overly rigid clerks and set clear gentle audit timelines', 0, { loyalty: 8, stability: 5 }]
  ]],
  ['Uniform Road & Postal Bureaus', 'Central administrators propose linking every county seat with paved post-stages and uniform royal mile markers.', [
   ['Fund the national royal post-road network cleanly', 140, { development: 1, credit: 11, securityMonths: 9 }],
   ['Build key trunk routes between capital, ports, and border passes first', 80, { development: 1, credit: 8 }],
   ['Upgrade post-horse stables smoothly along dirt tracks', 0, { credit: 5, securityMonths: 5 }]
  ]],
  ['Standardized Royal Law Digest', 'Confusion over fifty conflicting county weights and customs ends as jurists draft one crisp Realm Law Code.', [
   ['Print and distribute the Uniform Law Digest to every county judge', 70, { legitimacy: 12, research: 8, trust: 9 }],
   ['Preserve harmless local wedding and harvest customs within the code', 35, { acceptance: 9, stability: 7 }],
   ['Require quarterly written court reports back to capital', 0, { securityMonths: 8, legitimacy: 6 }]
  ]],
  ['Clockwork Kingdom', 'Clean roads, fair uniform justice, and loyal intendants make central administration swift and trusted.', [
   ['Hold an annual Conference of Intendants', 40, { legitimacy: 8, research: 5 }],
   ['Reward spotless provincial accounts', 25, { credit: 6, prestige: 5 }],
   ['Close the administrative review', 0, { stability: 4 }]
  ]]
 );

 arc4('cw_gov_confederation', 'Politics', 'gov_confederation',
  ['Canton Delegates Deadlocked at the Assembly', 'Member communities split down the middle over funding shared frontier watchtowers, threatening to stall spring works.', [
   ['Host generous council feasts and match local pledges coin-for-coin', 115, { trust: 11, stability: 9, loyalty: 8 }],
   ['Propose weighted fair contributions scaled cleanly to hearth counts', 50, { legitimacy: 9, stability: 8, credit: 5 }],
   ['Allow reluctant valleys to contribute timber and grain instead of silver', 0, { food: 40, tools: 14, trust: 7 }]
  ]],
  ['Disputed Trade Toll Between Member Valleys', 'One valley council erected a timber bridge barrier taxing neighboring member herds driving toward autumn fairs.', [
   ['Mediate free internal trade across all confederation members cleanly', 55, { credit: 10, trust: 10, stability: 8 }],
   ['Cap internal bridge pennies strictly to real plank repair costs', 30, { credit: 7, trust: 7 }],
   ['Remind elders shared leagues wither when brothers tax brothers', 0, { legitimacy: 7, trust: 5 }]
  ]],
  ['Joint Militia Muster Shows Strength', 'United under braided confederate standards, valley militias drill together seamlessly on the high meadow.', [
   ['Endow shared powder and dry-grain barns at central crossroads', 75, { securityMonths: 9, food: 45, stability: 7 }],
   ['Hold friendly marksmanship contests with silver cups', 45, { prestige: 8, trust: 8 }],
   ['Renew mutual defense vows beside the boundary stone', 0, { legitimacy: 8, stability: 6 }]
  ]],
  ['Strength Through Consent', 'Voluntary consensus takes patient talk, yet holds firmest when foreign storms test the valleys.', [
   ['Inscribe the Renewed League Pact in every town hall', 35, { legitimacy: 8, trust: 7 }],
   ['Share concluding council bread and cheese', 20, { trust: 6 }],
   ['Close the confederate diet', 0, { stability: 4 }]
  ]]
 );

 arc4('cw_gov_military', 'Politics', 'gov_military',
  ['Garrison Elders Question Civilian Guilds', 'Veteran frontier commanders running provincial administration complain urban bakers and weavers hoard silver instead of supporting fort works.', [
   ['Seat merchant masters beside commanders on joint municipal supply boards', 90, { trust: 10, credit: 8, stability: 8 }],
   ['Ensure army bread contracts pay fair prompt coin to town guilds', 70, { credit: 8, trust: 9, food: 35 }],
   ['Maintain firm martial priority over rampart zones while freeing inner stalls', 0, { securityMonths: 8, legitimacy: 6 }]
  ]],
  ['Soldiers’ Sons Seek Trade Apprenticeships', 'Aging garrison pikemen beg guildmasters to admit veterans’ sons and maimed men into peaceful leather and cobbler trades.', [
   ['Grant veteran families free guild entry fees in exchange for watch service', 65, { trust: 11, tools: 14, stability: 7 }],
   ['Endow veteran garrison workshops producing boots and harness for the state', 85, { development: 1, credit: 8, loyalty: 8 }],
   ['Settle retired soldiers onto cleared border farmland cleanly', 0, { food: 55, trust: 7 }]
  ]],
  ['Parade Inspection & Fair Assizes', 'Clean uniforms, honest grain scales, and clear civil courts quiet urban fears of arbitrary barracks rule.', [
   ['Publish a strict Charter Separating Barracks Discipline from Civil Courts', 45, { legitimacy: 10, trust: 10 }],
   ['Sponsor mixed civilian-garrison athletic games', 35, { prestige: 8, stability: 7 }],
   ['Inspect citadel granaries cleanly', 0, { food: 35, securityMonths: 6 }]
  ]],
  ['Shield & Plow in Accord', 'Disciplined soldier-governance protects frontiers while respecting the bustling workshops that feed them.', [
   ['Record updated garrison-town statutes', 35, { legitimacy: 7 }],
   ['Reward cooperative commanders and aldermen', 25, { loyalty: 7, trust: 6 }],
   ['Close the martial council', 0, { stability: 4 }]
  ]]
 );

 arc4('cw_gov_city', 'Politics', 'gov_city',
  ['Wall Expansion Beyond Crowded Gates', 'Overflowing artisan suburbs sprawl outside old medieval stone walls, begging for fresh fortified enclosures, sewers, and fountain conduits.', [
   ['Trace wide bastion walls enclosing suburbs with straight broad streets', 165, { development: 1, trust: 11, securityMonths: 10 }],
   ['Fund brick street drains, clean cisterns, and watch-gates first', 90, { development: 1, credit: 9, trust: 9 }],
   ['Grant suburban guilds equal citizen voting rights promptly', 0, { trust: 10, acceptance: 8, credit: 6 }]
  ]],
  ['Suburban Tanners & Dyers Clamor for Voice', 'Wealthy suburban wool-dyers refuse paying wall taxes unless admitted onto the city’s inner council.', [
   ['Expand city hall seats fairly to match growing suburban workshops', 55, { legitimacy: 10, stability: 8, trust: 9 }],
   ['Create a joint Municipal Works Board mixing old and new wards', 40, { credit: 7, trust: 8 }],
   ['Cap suburban wall-rates politely for five years as compromise', 0, { trust: 7, credit: 4 }]
  ]],
  ['Clocktower & Civic Library Opened', 'Citizens cheer beneath soaring brick arcades as public reading tables and clean fountains open together.', [
   ['Endow public arithmetic and navigation classes above the market hall', 80, { research: 11, credit: 8 }],
   ['Display gilded city charters in clear public brass frames', 35, { legitimacy: 8, prestige: 8 }],
   ['Light evening patrol lanterns down new suburban avenues', 0, { securityMonths: 8, trust: 6 }]
  ]],
  ['Proud Urban Commonwealth', 'Broad walls, clean conduits, and inclusive guild seats make the city-state agile, rich, and fiercely defended.', [
   ['Audit civic treasury books publicly in the loggia', 35, { credit: 8, legitimacy: 7 }],
   ['Host neighboring envoys at city festival', 30, { prestige: 8 }],
   ['Close the municipal assembly', 0, { stability: 4 }]
  ]]
 );

 arc4('cw_gov_kinship', 'Politics', 'gov_kinship',
  ['Inter-Clan Feast Over Hunting Grounds', 'Two neighboring lineages dispute berry groves and winter deer valleys; elders call a formal potlatch/kinship feast to mend balance without spears.', [
   ['Supply generous feast stores and witness reciprocal gift exchanges cleanly', 105, { trust: 12, loyalty: 11, stability: 9 }],
   ['Establish alternating seasonal harvest protocols blessed by clan mothers', 50, { food: 45, trust: 10, legitimacy: 7 }],
   ['Gather both lineages at the central hearth to speak openly till concord', 0, { trust: 8, acceptance: 7, stability: 5 }]
  ]],
  ['Youths Demand Role Beyond Old Lineages', 'Bold young hunters and weavers push for merit voice in valley councils rather than waiting silently behind grey-bearded elders.', [
   ['Pair young scout leaders beside wise elders in seasonal assemblies', 45, { trust: 10, stability: 8, research: 5 }],
   ['Grant brave youth bands responsibility guarding distant trail caches', 40, { securityMonths: 8, loyalty: 8 }],
   ['Counsel patience and mutual respect between youth vigor and elder memory', 0, { legitimacy: 6, trust: 6 }]
  ]],
  ['Abundant Salmon & Smoked Venison Shared', 'United camps haul plentiful autumn runs, smoking racks full for winter snows.', [
   ['Fill communal cedar-bark caches across every lineage lodge', 65, { food: 80, trust: 10 }],
   ['Trade surplus cured hides peacefully with river neighbors', 35, { credit: 8, acceptance: 7 }],
   ['Celebrate unbroken valley kinship in song', 0, { prestige: 8, piety: 6 }]
  ]],
  ['Circles Kept Whole', 'Generous reciprocity and shared council voices turn potential feuds into durable lineage strength.', [
   ['Carve peace crests onto central boundary posts', 35, { legitimacy: 7, prestige: 6 }],
   ['Thank wise clan elders warmly', 20, { trust: 7 }],
   ['Close the seasonal gathering', 0, { stability: 4 }]
  ]]
 );

 arc4('cw_gov_tributary', 'Politics', 'gov_tributary',
  ['Outer Chiefdoms Weigh Imperial Gifts', 'Envoy canoes and pack-trains from peripheral tributary districts arrive bearing woven mats, copper ingots, and subtle pleas for lower grain levies.', [
   ['Return lavish silk/iron counter-gifts exceeding tribute value to bind hearts', 130, { loyalty: 12, prestige: 11, legitimacy: 8 }],
   ['Trim grain quotas cleanly on flood-hit districts while praising prompt towns', 65, { trust: 11, food: 35, loyalty: 9 }],
   ['Receive standard tribute formally with clear boundary honors', 0, { gold: 75, legitimacy: 6, loyalty: 4 }]
  ]],
  ['Border Chiefs Request Iron Tools & Medics', 'Outer elders plead for iron axes, ploughshares, and skilled fever-herbalists rather than hollow ceremonial spears.', [
   ['Dispatch royal smiths and healers on seasonal circuit among outer villages', 95, { tools: 18, trust: 12, acceptance: 9 }],
   ['Train bright youths from tributary houses inside capital workshops', 65, { research: 9, loyalty: 9, acceptance: 9 }],
   ['Gift fine steel tools selectively to steadfast allies', 0, { tools: 12, loyalty: 7 }]
  ]],
  ['Rival Court Sends Quiet Temptations', 'Outer stewards faithfully report foreign messengers whispering promises of tax-free independence.', [
   ['Guarantee swift armed shield whenever loyal tributaries face raids', 70, { securityMonths: 10, loyalty: 10, stability: 7 }],
   ['Lower transit market fees so outer districts prosper inside your orbit', 45, { credit: 9, trust: 8 }],
   ['Honor loyal chiefs publicly before the entire court', 0, { prestige: 9, legitimacy: 7 }]
  ]],
  ['Orbit of Generous Majesty', 'Tributary bonds anchored in real trade, iron tools, and swift protection hold firmer than any bare garrison.', [
   ['Inscribe renewed tributary oaths in golden registers', 35, { legitimacy: 8 }],
   ['Feast departing outer delegations', 25, { prestige: 7, trust: 6 }],
   ['Close the tributary audience', 0, { stability: 4 }]
  ]]
 );

 // === C. ALL 5 CROSSROADS ERAS (crossroads_*) + CONTINENTS (cont_*) ===
 arc4('cw_xr_gunpowder_wall', 'Crossroads', 'crossroads_gunpowder',
  ['Low Earthen Bastions Replace High Towers', 'Artillery masters urge tearing down lofty medieval crenellations that shower defenders in stone splinters, replacing them with thick brick-faced earth ramparts.', [
   ['Rebuild key gatehouses into sloped trace-italienne ravelins', 165, { development: 1, securityMonths: 11, research: 9 }],
   ['Bank packed turf ramparts and gabions directly against old stone', 80, { stability: 7, securityMonths: 8, tools: 14 }],
   ['Clear outer field-of-fire orchards while keeping stone towers', 0, { securityMonths: 6, food: -10, stability: 4 }]
  ]],
  ['Suburban Orchardists Mourn Felled Trees', 'Building clean cannon glacis means clearing cottages and pear orchards within musket range of outer ditches.', [
   ['Pay generous silver buyouts and grant bright new suburban garden plots', 95, { trust: 11, unrest: -8, development: 1 }],
   ['Preserve winter vegetable plots while felling tall screening trees only', 40, { trust: 7, food: 30 }],
   ['Enforce ancient royal fortification clearance law cleanly', 0, { legitimacy: 6, unrest: 4 }]
  ]],
  ['Standardized Shot Calibers', 'Inspectors find six incompatible iron ball sizes cluttering arsenals; founders urge casting strict iron ring-gauges.', [
   ['Standardize three royal cannon calibers across every foundry and wall', 85, { research: 11, credit: 7, tools: 16 }],
   ['Color-code powder casks and shot bins cleanly by size', 35, { securityMonths: 7, stability: 6 }],
   ['Cast spare lead musket shot for garrison chests', 0, { tools: 12 }]
  ]],
  ['Shields of Earth & Bronze', 'Standardized shot and sloped brick ravelins modernize realm defense cleanly into the gunpowder age.', [
   ['Print artillery range tables for fortress commanders', 45, { research: 8, prestige: 7 }],
   ['Inspect new dry magazine vaults', 25, { securityMonths: 6 }],
   ['Close the ordnance reform', 0, { stability: 4 }]
  ]]
 );

 arc4('cw_xr_oceanic_scurvy', 'Crossroads', 'crossroads_oceanic',
  ['Bleeding Gums on Hundred-Day Crossings', 'Returning ocean crews limp ashore with loosened teeth and swollen joints after three months on salt beef and stale biscuit.', [
   ['Stock pickled cabbage, dried citrus, and fresh water-stills on every ship', 115, { research: 11, trust: 10, credit: 8 }],
   ['Fund clean port mariners’ hospitals testing herbal & fruit diets', 75, { research: 10, prestige: 7, trust: 8 }],
   ['Rotate shorter coastal supply relays before crossing open ocean', 0, { credit: 6, stability: 5 }]
  ]],
  ['Ship Doctors Notice Citrus Miracles', 'Captains who loaded bitter Seville oranges and lemons off southern capes report zero scurvy deaths across entire crossings.', [
   ['Mandate citrus juice casks inside royal Admiralty provisioning lists', 55, { research: 10, legitimacy: 8, credit: 7 }],
   ['Plant royal citrus orchards in warm coastal provinces for navy supply', 85, { development: 1, food: 50, credit: 7 }],
   ['Share the discovery freely in printed mariners’ almanacs', 0, { research: 8, prestige: 7 }]
  ]],
  ['Copper Rain-Catchers & Ventilation', 'Ingenious shipwrights fit canvas wind-scoops airing damp lower decks and copper stills boiling sweet dew from seawater.', [
   ['Equip ocean survey squadrons with copper seawater stills', 75, { research: 11, prestige: 8 }],
   ['Inspect ship biscuit barrels for watertight oak cooperage', 35, { credit: 7, tools: 10 }],
   ['Praise observant ships’ barbers cleanly', 0, { trust: 6 }]
  ]],
  ['Healthy Crews Cross Vast Waters', 'Solved diet and clean ship air cut ocean voyage deaths sharply, giving your mariners unmatched endurance.', [
   ['Charter permanent Royal Naval Provisioning Yards', 55, { credit: 9, development: 1 }],
   ['Bless healthy departing caravels', 25, { piety: 7, prestige: 6 }],
   ['Close the admiralty health docket', 0, { stability: 4 }]
  ]]
 );

 arc4('cw_xr_press_libraries', 'Crossroads', 'crossroads_press',
  ['Chained Folios vs Lending Bookshops', 'Cathedral librarians still chain precious manuscripts to oak desks, while urban printers open lively paper lending stalls for artisans.', [
   ['Endow bright public municipal reading rooms stocked with printed books', 135, { research: 14, trust: 10, development: 1 }],
   ['Back affordable vernacular grammar, law, and workshop manuals', 70, { research: 11, credit: 7 }],
   ['Protect priceless chained abbey originals while letting printers sell cheap sheets', 0, { piety: 6, research: 6 }]
  ]],
  ['Bookbinders & Type-Casters Boom', 'Printing alleys hum with paper-folders, brass-clasp makers, and copper illustrators turning words into brisk industry.', [
   ['Establish fair guild copyright patents shielding honest printers for ten years', 65, { credit: 10, legitimacy: 8, research: 8 }],
   ['Exempt domestic paper and rag carts from city gate tolls', 40, { credit: 8, tools: 10 }],
   ['Inspect print-shop chimneys cleanly against candle fires', 0, { securityMonths: 7, stability: 5 }]
  ]],
  ['Rural Parish Book-Boxes Circulate', 'Pack-mules carry locked oak chests of twenty practical books between village schools every quarter.', [
   ['Fund sixty rotating rural parish book-boxes statewide', 85, { research: 12, trust: 11, food: 25 }],
   ['Include clean farm grafting, carpentry, and midwifery primers', 45, { research: 9, trust: 8 }],
   ['Let county schoolmasters swap chests at market fairs', 0, { research: 6, stability: 4 }]
  ]],
  ['A Literate Public Sphere', 'Printed pages travel from oak stalls straight to village hearths, awakening practical skill across every class.', [
   ['Publish an annual Realm Book Catalog', 35, { research: 7, prestige: 7 }],
   ['Honor pioneering printers at court', 25, { prestige: 7 }],
   ['Close the library endowment', 0, { stability: 4 }]
  ]]
 );

 arc4('cw_xr_finance_annuities', 'Crossroads', 'crossroads_finance',
  ['Perpetual Civic Bonds vs Costly War Loans', 'Finance ministers propose issuing transparent low-interest public annuities backed by salt and customs revenues, escaping ruinous short-term war usury.', [
   ['Launch audited perpetual civic annuities open to ordinary savers', 135, { credit: 14, inflation: -3, legitimacy: 9 }],
   ['Back modest municipal bridge-bonds first to prove clean timely payouts', 70, { credit: 10, development: 1, trust: 8 }],
   ['Pay down existing high-rate banker debts patiently before new issues', 0, { inflation: -2, credit: 7, stability: 5 }]
  ]],
  ['Widows & Guilds Queue to Buy Bonds', 'Reliable five-percent royal interest backed by public salt ledgers draws buried silver out of floorboard crocks.', [
   ['Ring-fence dedicated salt-excise chests exclusively for bond interest', 55, { credit: 11, legitimacy: 9, trust: 9 }],
   ['Issue small-denomination bonds so master artisans invest safely', 40, { trust: 9, credit: 8 }],
   ['Print crisp engraved bond coupons with watermarked seals', 0, { securityMonths: 8, research: 5 }]
  ]],
  ['Foreign Bankers Drop Crown Rates', 'Seeing native households buy royal bonds eagerly, foreign syndicates cut loan interest in half to win back business.', [
   ['Refinance remaining costly foreign debts smoothly on lower terms', 50, { credit: 11, inflation: -3, gold: 80 }],
   ['Channel cheap fresh capital straight into harbor dredging and mills', 85, { development: 1, credit: 9 }],
   ['Keep sovereign borrowing disciplined and lean', 0, { stability: 7, legitimacy: 6 }]
  ]],
  ['Credit Built on Citizen Trust', 'Transparent sinking funds transform public debt from royal nightmare into civic partnership.', [
   ['Publish annual open Bond & Sinking Fund statements', 35, { legitimacy: 9, credit: 8 }],
   ['Thank steady treasury clerks', 20, { prestige: 5 }],
   ['Close the bond charter', 0, { stability: 4 }]
  ]]
 );

 arc4('cw_xr_contact_crops', 'Crossroads', 'crossroads_contact',
  ['Strange Tubers & Golden Maize Ears', 'Returning oceanic captains unpack dried golden maize kernels, hardy mountain potatoes, and bright scarlet peppers from across distant seas.', [
   ['Trial new crops carefully on royal experimental gardens and print guides', 120, { food: 95, research: 12, development: 1 }],
   ['Distribute seed kernels directly to hillside farmers struggling with stony soils', 70, { food: 75, trust: 10, grain: 18 }],
   ['Cultivate curiosities politely inside palace botanical beds first', 0, { research: 7, prestige: 6 }]
  ]],
  ['Suspicious Villagers Fear "Devil Roots"', 'Superstitious peasants refuse eating bumpy underground tubers, muttering crops unlisted in ancient scriptures breed leprosy.', [
   ['Plant guarded royal plots openly—tempting villagers to steal and try them!', 55, { food: 65, trust: 8, prestige: 6 }],
   ['Serve roasted buttered tubers and golden cornbread proudly at royal feast', 65, { food: 55, prestige: 9, trust: 9 }],
   ['Let monastery gardens prove wholesome nourishing stews first', 0, { piety: 7, food: 40 }]
  ]],
  ['Bumper Yields on Marginal Sand & Hills', 'Hardy tubers yield thrice the calories per acre of rye on cold sandy slopes where wheat used to fail.', [
   ['Pair maize and bean intercropping for rich soil nitrogen balance', 60, { food: 75, research: 9, grain: 16 }],
   ['Build cool stone root-cellars preserving winter tubers cleanly', 75, { development: 1, food: 65 }],
   ['Exempt new root-crop acreage from tithes for three springs', 0, { trust: 9, food: 45 }]
  ]],
  ['Famine Recedes Across Continents', 'Adopted across stony hills and poor soils, transoceanic crops spark soaring harvests and population vigor.', [
   ['Publish illustrated Columbian Husbandry Manuals', 45, { research: 8, food: 35 }],
   ['Gift golden maize wreaths at harvest feast', 25, { trust: 7, prestige: 6 }],
   ['Close the agricultural exchange', 0, { stability: 4 }]
  ]]
 );

 // === D. 36 MORE REGIONAL, CONTINENTAL & GOVERNANCE CHAINS (144 STAGES) -> TOTAL 68 CHAINS = 272 STAGES! ===
 // Wait: let's check current count in this file:
 // A: 14 chains (vijaya, ottoman, ming, joseon, japan, timurid, france, england, imperial, poland, muscovy, mamluk, mali, ethiopia, mexica, inca, majapahit, venice, horde -> wait that's 19 chains!)
 // B: portugal, castile, delhi, gujarat, malacca (5) + 13 gov_* = 18 chains!
 // C: 5 crossroads_* = 5 chains!
 // Total so far = 19 + 18 + 5 = 42 chains!
 // We need 26 more chains (26 × 4 = 104 stages) to reach 68 chains = 272 stages!
 // Let's cover additional distinct regions + cont_* + faith_* + crossroads_* + gov_*!

 arc4('cw_reg_aragon_consul', 'Regional', 'region_aragon',
  ['Consulate of the Sea Registers', 'Barcelona and Valencia sea judges maintain respected Mediterranean maritime law—yet Neapolitan and Catalan captains quarrel over harbor dues.', [
   ['Update the Book of the Consulate of the Sea under royal seal', 110, { credit: 12, legitimacy: 10, prestige: 8 }],
   ['Balance Catalan, Aragonese, and island estates calmly in joint Cortes', 65, { loyalty: 10, stability: 8 }],
   ['Protect merchant galley convoys cleanly with royal harbor patrols', 0, { securityMonths: 7, credit: 6 }]
  ]],
  ['Dispute Over Irrigated Huerta Canals', 'Valencian orchardists guard ancient water-tribunal decrees fiercely against inland wool lords.', [
   ['Honor the open-air Water Tribunal at cathedral doors unchanged', 45, { trust: 11, food: 55, legitimacy: 8 }],
   ['Repair stone intake aqueducts serving dry coastal citrus groves', 85, { development: 1, food: 65 }],
   ['Keep peace between shepherds and orchardists cleanly', 0, { stability: 6, loyalty: 5 }]
  ]],
  ['Coral Fishermen & Clothiers Prosper', 'Polished Mediterranean red coral jewelry and dyed woolens bring brisk bills from Alexandria to Genoa.', [
   ['Charter coastal coral-diving guilds with clean weight stamps', 65, { credit: 9, trust: 7 }],
   ['Expand Barcelona sea-wall shipyards cleanly', 80, { development: 1, credit: 9 }],
   ['Collect crisp maritime customs', 0, { gold: 95 }]
  ]],
  ['Crown of Seas & Charters', 'Respected sea law and protected irrigation tribunals knit coastal cities and inland kingdoms smoothly.', [
   ['Archive Mediterranean trade accords cleanly', 35, { legitimacy: 7, credit: 6 }],
   ['Celebrate maritime patron feasts', 25, { piety: 7, prestige: 6 }],
   ['Close the Cortes maritime dossier', 0, { stability: 4 }]
  ]]
 );

 arc4('cw_reg_burgundy_tapestries', 'Regional', 'region_burgundy',
  ['Looms of Arras & Brussels Bankers', 'Flemish cities brim with silk looms, oil painters, and Bruges clearing houses—yet jealous towns clash over river tolls and duke’s subsidies.', [
   ['Host glittering Order of the Golden Fleece chapter mediating city prides', 135, { prestige: 13, loyalty: 10, credit: 9 }],
   ['Standardize Flemish canal tolls and honest silver stivers', 75, { credit: 12, development: 1, inflation: -2 }],
   ['Respect proud city belfry charters while collecting steady hearth aides', 0, { legitimacy: 7, gold: 80 }]
  ]],
  ['Flemish Oil Masters Test Linseed Glazes', 'Master painters blend luminous linseed oils capturing velvet sheen and distant Alpine skies on oak panels.', [
   ['Patronize court panel painters and illuminated manuscript ateliers', 95, { prestige: 13, research: 10 }],
   ['Export royal-stamped Arras mythological tapestries across European halls', 55, { credit: 9, prestige: 10 }],
   ['Decorate city guildhalls with proud civic portraits', 0, { trust: 7, prestige: 6 }]
  ]],
  ['Sluice Silt Threatens Bruges Harbor', 'Silted Zwin estuary mud chokes deep spice carracks, threatening Bruges factors to shift downstream toward Antwerp.', [
   ['Dredge Zwin channels cleanly and upgrade Antwerp-Bruges road ferries', 110, { development: 1, credit: 11, trust: 8 }],
   ['Lower Antwerp harbor crane fees to keep trade inside crown lands', 45, { credit: 10, stability: 6 }],
   ['Build sturdy stone canal dikes along low polders', 0, { food: 40, stability: 5 }]
  ]],
  ['Splendor of the Low Countries', 'Unmatched cloth, luminous paint, and rich bourses turn crowded polders into Europe’s envy.', [
   ['Hold grand polyphonic choir vespers at court', 40, { piety: 8, prestige: 9 }],
   ['Audit regional stiver mints cleanly', 25, { credit: 7 }],
   ['Close the Flemish estates roll', 0, { stability: 4 }]
  ]]
 );

 arc4('cw_reg_novgorod_veche', 'Regional', 'region_novgorod',
  ['The Great Bell of the Veche Assembly', 'River boatmen, fur boyars, and German Hof factors gather beneath ringing assembly bells over winter grain shortages and Baltic customs.', [
   ['Balance Hanseatic warehouse accords with open native merchant booths', 105, { credit: 12, trust: 9, acceptance: 8 }],
   ['Import southern river rye barges swiftly before ice locks Lake Ilmen', 120, { food: 95, trust: 11, stability: 7 }],
   ['Mediate calmly between boyar factions inside St. Sophia’s yard', 0, { stability: 7, legitimacy: 6 }]
  ]],
  ['Birchbark Letters Reveal Rural Grievances', 'Villagers scratch urgent petitions onto pale birchbark strips begging protection from winter fur-collectors’ arbitrary sled levies.', [
   ['Establish clean written sled-post tariffs protecting forest villages', 55, { trust: 11, legitimacy: 9, unrest: -7 }],
   ['Train village scribes at cathedral porches on birchbark and paper', 45, { research: 9, trust: 8 }],
   ['Discipline abusive tax riders openly in town square', 0, { legitimacy: 8, stability: 5 }]
  ]],
  ['Sable & Beeswax Barges Glide Toward Sea', 'Clear river channels carry gleaming winter sable bundles and yellow beeswax cakes past Baltic booms.', [
   ['Build covered brick wharf sheds along the Volkhov bank', 85, { development: 1, credit: 10 }],
   ['Mint crisp heavy silver dengas honored across Hanseatic tables', 45, { credit: 9, inflation: -2 }],
   ['Collect orderly river customs cleanly', 0, { gold: 95 }]
  ]],
  ['Free River Republic at Peace', 'Fair assembly hearings and thriving Baltic fur wharves guard northern prosperity.', [
   ['Archive birchbark laws in cathedral chests', 35, { research: 6, legitimacy: 6 }],
   ['Ring evening concord bells across both banks', 20, { prestige: 7, trust: 6 }],
   ['Close the Veche docket', 0, { stability: 4 }]
  ]]
 );

 arc4('cw_reg_bengal_muslin', 'Regional', 'region_bengal',
  ['Fine Dhaka Muslin & Delta Shipyards', 'River weavers spin cotton threads fine as mist while timber shipwrights craft swift ocean dhows along booming mangrove creeks.', [
   ['Sponsor royal muslin karkhanas and stone river-port piers', 145, { development: 1, credit: 13, prestige: 10 }],
   ['Grant orchard & paddy clearing charters to pioneer delta settlements', 80, { food: 90, trust: 10, acceptance: 8 }],
   ['Collect crisp river customs on outgoing fine muslin bales', 0, { gold: 115, credit: 4 }]
  ]],
  ['Cyclone Surge Hits Low Delta Char Lands', 'Sudden Bay storms wash salt tides over newly cleared mud islands, snapping bamboo houses.', [
   ['Rush boat-loads of dry paddy, bamboo poles, and clean drinking jars', 110, { food: 70, trust: 12, stability: 8 }],
   ['Raise earthen cyclone refuge mounds topped with brick shrines', 85, { development: 1, trust: 10, piety: 7 }],
   ['Waive land dues cleanly across storm-swept delta tracts', 0, { trust: 9, food: 35 }]
  ]],
  ['Persian Poets & Bengali Chronicles Bloom', 'Court patronage blends Arabic, Persian, and Bengali verse into luminous illuminated manuscripts.', [
   ['Endow multilingual court translation halls and mosques/temples', 75, { research: 11, acceptance: 11, prestige: 9 }],
   ['Commission poetic epics celebrating river prosperity', 40, { prestige: 9, piety: 6 }],
   ['Distribute scholarly paper cleanly to provincial schools', 0, { research: 7 }]
  ]],
  ['Golden Delta of Looms & Sails', 'Cyclone mounds, thriving river looms, and poetic tolerance turn lush marshes into jewel provinces.', [
   ['Stamp pure royal silk-and-muslin marks', 35, { credit: 8, prestige: 7 }],
   ['Stock reserve paddy boats before monsoon', 30, { food: 45 }],
   ['Close the delta council', 0, { stability: 4 }]
  ]]
 );

 arc4('cw_reg_ayutthaya_canal', 'Regional', 'region_ayutthaya',
  ['Floating Markets & Royal River Barges', 'Hundreds of wooden sampans jam city moat canals carrying pomelos, dried fish, and Chinese porcelain—slowing royal state boats.', [
   ['Dig wider parallel ring-canals and paved riverside brick landings', 140, { development: 1, credit: 11, food: 65 }],
   ['Organize dawn floating market hours separating spice and timber craft', 55, { credit: 9, trust: 9, stability: 6 }],
   ['Post bamboo river-wardens guiding busy intersections cleanly', 0, { securityMonths: 7, credit: 5 }]
  ]],
  ['Phrai Labor Rolls & Noble Sakdina Ranks', 'Provincial nobles try registering free royal subjects onto private estate rolls to dodge public canal corvee.', [
   ['Conduct fair palm-leaf census audits balancing royal and noble rosters', 70, { legitimacy: 11, loyalty: 6, stability: 7 }],
   ['Allow modest seasonal silver commutation in place of heavy canal labor', 45, { trust: 10, credit: 7 }],
   ['Confirm sacred temple and senior noble exemptions tactfully', 0, { piety: 7, loyalty: 8 }]
  ]],
  ['Japanese, Persian & Portuguese Factors Arrive', 'Word of orderly canal markets draws diverse foreign quarters eager to trade deerskins, tin, and sappanwood.', [
   ['Charter neat walled riverside trading quarters under royal port judges', 80, { acceptance: 12, credit: 11, prestige: 8 }],
   ['Build royal porcelain-and-tin inspection warehouses cleanly', 55, { credit: 9, securityMonths: 7 }],
   ['Collect crisp port anchorage gifts cleanly', 0, { gold: 105 }]
  ]],
  ['Venice of the East on Calm Waters', 'Clear canals, fair labor rolls, and cosmopolitan quarters crown the island capital in prosperity.', [
   ['Lead ceremonial gilded royal barge procession', 45, { prestige: 11, piety: 8 }],
   ['Archive river port customs cleanly', 25, { legitimacy: 6 }],
   ['Close the canal assembly', 0, { stability: 4 }]
  ]]
 );

 arc4('cw_reg_dai_viet_dikes', 'Regional', 'region_dai-viet',
  ['Red River Dikes Groan Under Summer Silt', 'High monsoon crests press against towering earthen levees guarding northern rice deltas; village drum-signals call out watchmen.', [
   ['Reinforce stone dike revetments and build flood-relief spillway sluices', 145, { food: 100, development: 1, trust: 11 }],
   ['Mobilize paid village dike-crews with bamboo gabions and pine stakes', 70, { food: 65, trust: 9, tools: 15 }],
   ['Post alert watchmen along weak curves with signal gongs', 0, { securityMonths: 7, food: 35 }]
  ]],
  ['Village Registers & Communal Rice Plots', 'Rural communes petition royal mandarins to safeguard ancient public village fields (cong dien) from creeping landlord seizure.', [
   ['Protect communal village rice plots firmly by royal Hong Duc statute', 60, { legitimacy: 11, trust: 12, food: 50 }],
   ['Hold fair county land surveys dividing wasteland cleanly among landless', 80, { food: 65, development: 1, unrest: -8 }],
   ['Balance landlord taxes cleanly alongside protected peasant shares', 0, { stability: 7, trust: 7 }]
  ]],
  ['Temple of Literature Examination Banners', 'Bright provincial youths study poetry, law, and irrigation mathematics hoping to see names carved on stone turtle steles.', [
   ['Expand provincial schools and carve honest graduate steles in stone', 85, { research: 13, prestige: 10, legitimacy: 8 }],
   ['Print practical legal & moral verses in Nom vernacular alongside script', 50, { research: 10, trust: 8 }],
   ['Hold solemn palace court exams cleanly', 0, { legitimacy: 8, research: 6 }]
  ]],
  ['Steadfast Villages Behind Strong Dikes', 'Guarded levees, protected village fields, and upright scholar-officials keep deltas fertile and unbroken.', [
   ['Inspect county dike stones before next monsoon', 35, { food: 40, stability: 6 }],
   ['Honor loyal village elders', 25, { trust: 8 }],
   ['Close the delta mandarin roll', 0, { stability: 4 }]
  ]]
 );

 arc4('cw_reg_morocco_qanat', 'Regional', 'region_morocco',
  ['Khettara Channels Beneath the Atlas Foothills', 'Dry winds choke ancient stone-lined underground aqueducts feeding date palms and wheat plains around imperial oasis cities.', [
   ['Clean khettara shafts, line cisterns, and plant shade groves cleanly', 140, { food: 90, development: 1, trust: 10 }],
   ['Fund leather water-buckets and paid well-crews across tribal valleys', 70, { food: 60, loyalty: 8, trust: 8 }],
   ['Coordinate oasis elder water-clock turns carefully', 0, { food: 35, legitimacy: 6 }]
  ]],
  ['Portuguese & Castilian Sails Test Atlantic Forts', 'Armed coastal caravels probe estuary towns, alarming fishermen and inland sugar mills.', [
   ['Fortify coastal estuary towers with bronze cannon and beacon riders', 120, { securityMonths: 11, development: 1, prestige: 8 }],
   ['Rally regional ribat volunteers and coastal cavalry watches cleanly', 55, { loyalty: 9, piety: 8, securityMonths: 8 }],
   ['Shift high-value caravan sugar and gold inland along fortified tracks', 0, { credit: 6, securityMonths: 6 }]
  ]],
  ['Fez & Marrakesh Tanneries Boom', 'Supple goat leather dyed crimson with pomegranate rind and saffron fetches prized silver across Mediterranean bazaars.', [
   ['Upgrade clean stone dye-vats and stamp genuine Moroccan leather seals', 75, { credit: 11, tools: 15, prestige: 8 }],
   ['Endow scholarly madrasa libraries beside main city gates', 65, { research: 10, piety: 9 }],
   ['Collect crisp leather and wax export duties', 0, { gold: 95 }]
  ]],
  ['Oasis Towers & Crimson Leather', 'Flowing khettara springs, watchful coastal bastions, and proud crafts sustain caravan sovereignty.', [
   ['Archive water-clock turns in mosque registers', 35, { legitimacy: 7, piety: 6 }],
   ['Feast loyal oasis elders', 25, { loyalty: 7 }],
   ['Close the Atlas valley report', 0, { stability: 4 }]
  ]]
 );

 arc4('cw_reg_songhai_niger', 'Regional', 'region_songhai',
  ['Sorko Canoe Navy Controls Middle Niger', 'Flat-bottomed war and grain canoes patrol river bends around Gao and Timbuktu, demanding clear dockyards and dry oar-sheds.', [
   ['Build covered riverboat yards and standardize grain canoe fleets', 135, { development: 1, credit: 11, food: 65 }],
   ['Reward loyal Sorko boatmasters with salt shares and brass emblems', 65, { loyalty: 10, securityMonths: 8, trust: 8 }],
   ['Maintain steady river customs barges at main islands', 0, { gold: 90, securityMonths: 6 }]
  ]],
  ['Royal Granaries Feed Scholar Cities', 'Brimming state millet estates feed bustling artisan quarters and hundreds of mosque scholars smoothly.', [
   ['Open royal canal feeder channels to expand flood-recession rice flats', 95, { food: 95, development: 1, trust: 10 }],
   ['Endow paper, ink, and student bread across Timbuktu & Jenne', 70, { research: 12, piety: 10 }],
   ['Keep reserve dry millet inside riverside clay granaries', 0, { food: 50, stability: 6 }]
  ]],
  ['Uniform Weights Across Caravan Gates', 'Inspectors catch mismatched bronze weights inside bustling Gao cattle and copper markets.', [
   ['Establish royal-stamped brass weights and honest market judges (muhtasib)', 65, { legitimacy: 10, credit: 10, trust: 9 }],
   ['Print bilingual price-and-measure guides for caravan leaders', 35, { research: 7, credit: 6 }],
   ['Fine crooked stallholders cleanly', 0, { gold: 65, legitimacy: 6 }]
  ]],
  ['Sovereign of River & Caravan', 'Disciplined canoe fleets, lush rice bends, and scholarly lamps make the river corridor shine.', [
   ['Hold grand river canoe reviews at dawn', 40, { prestige: 10, trust: 6 }],
   ['Archive honest market weights', 20, { legitimacy: 6 }],
   ['Close the river assembly', 0, { stability: 4 }]
  ]]
 );

 arc4('cw_reg_kongo_copper', 'Regional', 'region_kongo',
  ['Copper Mines & Raffia-Cloth Tribute', 'Provincial mani lords bring lustrous copper ingots and fine patterned palm-raffia textiles to the hilltop capital Mbanza.', [
   ['Expand copper smelting furnaces and royal raffia-cloth looms', 130, { development: 1, tools: 20, credit: 10 }],
   ['Reward loyal provincial governors with coral beads and iron insignia', 60, { loyalty: 11, prestige: 8 }],
   ['Confirm standardized raffia-square currency values across markets', 0, { credit: 8, stability: 6 }]
  ]],
  ['Strange Caravels Sighted at River Mouth', 'Coastal fishermen report towering white-sailed ships dropping anchor at the broad estuary seeking ivory, copper, and diplomatic letters.', [
   ['Receive foreign envoys with regal dignity, seeking carpenters & printers', 95, { research: 12, acceptance: 10, prestige: 9 }],
   ['Restrict foreign landing strictly to supervised royal estuary ports', 45, { securityMonths: 9, credit: 8, legitimacy: 7 }],
   ['Send cautious trusted court elders to observe intentions first', 0, { securityMonths: 7, stability: 5 }]
  ]],
  ['Royal Youths Study Letters & Statecraft', 'Ambitious princes and scribes seize foreign paper and Latin primers eagerly to strengthen royal chancery correspondence.', [
   ['Establish a bilingual royal chancery school at Mbanza', 80, { research: 13, legitimacy: 9 }],
   ['Trade copper and ivory strictly for tools, books, and skilled masons', 45, { tools: 18, credit: 8 }],
   ['Preserve traditional oral council courts alongside written rolls', 0, { trust: 8, acceptance: 7 }]
  ]],
  ['Hilltop Capital Unbowed', 'Strong native crafts, selective foreign learning, and sovereign estuary control guard realm dignity.', [
   ['Inscribe provincial governor patents cleanly', 35, { legitimacy: 8, loyalty: 6 }],
   ['Host coastal and inland elders together', 25, { trust: 8 }],
   ['Close the Mbanza council', 0, { stability: 4 }]
  ]]
 );

 arc4('cw_reg_kilwa_dhow', 'Regional', 'region_kilwa',
  ['Coral-Stone Palaces & Sofala Gold', 'Monsoon winds bring Arab and Indian Ocean captains seeking inland Sofala gold and ivory in exchange for Ming porcelain and Gujarat cottons.', [
   ['Build grand coral-stone quay warehouses and fair port assay scales', 140, { development: 1, credit: 13, prestige: 10 }],
   ['Strengthen coastal dhow patrols shielding southern gold-port lanes', 70, { securityMonths: 9, credit: 9 }],
   ['Collect crisp royal customs duties on landed porcelain and cloth', 0, { gold: 115, credit: 4 }]
  ]],
  ['Inland Gold Traders Protest Coastal Middlemen', 'Interior traders bringing ivory tusks beg direct fair weights inside Kilwa markets without extortion by petty port brokers.', [
   ['Open transparent Swahili-bilingual royal weighing benches openly', 60, { trust: 11, credit: 10, acceptance: 9 }],
   ['Treat inland elders with honored banquet gifts to keep gold flowing', 45, { acceptance: 10, credit: 7 }],
   ['Cap port broker commissions firmly by sultanic decree', 0, { legitimacy: 8, credit: 6 }]
  ]],
  ['Porcelain Bowls Set Into Mosque Domes', 'Gleaming green celadon and blue-and-white dishes decorate coral arches as visible proof of oceanic reach.', [
   ['Endow coral-stone water cisterns and scholar quarters for island folk', 80, { development: 1, piety: 10, research: 8 }],
   ['Mint local copper and silver coins stamped with proud island emblems', 45, { credit: 9, prestige: 8 }],
   ['Welcome visiting scholars and navigators warmly', 0, { acceptance: 8, research: 5 }]
  ]],
  ['Jewel of the Swahili Coast', 'Fair scales, fresh cisterns, and bright porcelain domes keep Indian Ocean dhows tacking home.', [
   ['Confirm coastal harbor light beacons', 35, { securityMonths: 7, credit: 6 }],
   ['Feast monsoon shipmasters', 25, { prestige: 7 }],
   ['Close the coastal ledger', 0, { stability: 4 }]
  ]]
 );

 arc4('cw_reg_bahmani_deccan', 'Regional', 'region_bahmani',
  ['Deccani & Afaqi Nobles Clash at Bidar', 'Native Deccani lords and newly arrived Persian/Central Asian administrators feud sharply over prime court offices and fort commands.', [
   ['Seat wise impartial ministers balancing both factions by merit & deed', 95, { loyalty: 11, stability: 9, acceptance: 9 }],
   ['Pair mixed Deccani-Afaqi deputies jointly over frontier provinces', 55, { securityMonths: 8, loyalty: 8, legitimacy: 7 }],
   ['Honor native heritage stewards firmly while calming newcomers politely', 0, { trust: 8, stability: 5 }]
  ]],
  ['Grand Madrasa Library Rises in Glazed Tile', 'A learned vizier erects a towering three-story college clad in dazzling blue mosaic housing three thousand manuscripts.', [
   ['Endow salaried chairs welcoming scholars from India, Persia, and Arabia', 120, { research: 14, prestige: 12, acceptance: 9 }],
   ['Supply paper mills and local translation scribes inside college halls', 65, { research: 10, credit: 6 }],
   ['Open free student kitchens beside mosque portals', 0, { piety: 9, trust: 8 }]
  ]],
  ['Hilltop Forts Guard Black-Soil Cotton Plains', 'Rich plateau black soil yields lush cotton and sorghum once dry hillside forts store rainwater cisterns.', [
   ['Carve deep rock-cut fort reservoirs and village irrigation bunds', 95, { food: 75, development: 1, securityMonths: 8 }],
   ['Encourage bustling cotton textile markets below fort walls', 45, { credit: 9, trust: 7 }],
   ['Inspect plateau granary stocks cleanly', 0, { food: 40 }]
  ]],
  ['Bridge of Cultures on the Plateau', 'Balanced offices and soaring blue-tiled colleges turn fierce rivalry into shared brilliance.', [
   ['Inscribe fair administrative rules cleanly', 35, { legitimacy: 8 }],
   ['Host court poets singing in Marathi, Kannada, and Persian', 30, { acceptance: 10, prestige: 8 }],
   ['Close the Bidar divan', 0, { stability: 4 }]
  ]]
 );

 arc4('cw_reg_qara_highlands', 'Regional', 'region_qara',
  ['Mountain Summer Pastures & Caravan Towns', 'Turcoman pastoral clans driving vast flocks up snowy summer yaylaks clash with settled Armenian and Persian town orchards along valley streams.', [
   ['Mark clear seasonal migration lanes protecting both pasture and vines', 105, { loyalty: 10, acceptance: 10, food: 55 }],
   ['Compensate valley towns cleanly from royal wool customs for winter forage', 75, { trust: 9, credit: 8, acceptance: 8 }],
   ['Summon clan chiefs and town elders jointly to settle disputes under oath', 0, { stability: 7, legitimacy: 6 }]
  ]],
  ['Blue Mosque Tilework Shines in Winter Sun', 'Master bricklayers unveil intricate dark-blue and gold mosaic calligraphy inside the capital sanctuary.', [
   ['Patronize mosaic guilds, carpet workshops, and caravan inns', 110, { prestige: 12, piety: 10, credit: 8 }],
   ['Grant tax grace to wounded silk-towns along trade trails', 55, { credit: 9, trust: 9 }],
   ['Protect pilgrim shrines across mountain valleys cleanly', 0, { piety: 8, acceptance: 7 }]
  ]],
  ['Rival Raiders Probe Frontier Passes', 'Mounted scouts spot dust clouds near western limestone passes.', [
   ['Reward loyal highland clan scouts with gilded belts and dry depots', 75, { securityMonths: 10, loyalty: 10 }],
   ['Station fast relay posts linking plateau passes to capital horse', 45, { securityMonths: 8, stability: 6 }],
   ['Hold pass towers alert till winter snows', 0, { securityMonths: 6 }]
  ]],
  ['Crown of Pastures & Bazaars', 'Disciplined migration corridors unite mountain horsemen and ancient orchard cities smoothly.', [
   ['Archive shared valley accords cleanly', 35, { legitimacy: 7 }],
   ['Celebrate seasonal herd return', 25, { food: 35, loyalty: 6 }],
   ['Close the highland assembly', 0, { stability: 4 }]
  ]]
 );

 arc4('cw_reg_scotland_clans', 'Regional', 'region_scotland',
  ['Border Reivers & Highland Tacksmen', 'Midnight cattle-raids across misty southern marches and disputed Highland grazing charters strain royal sheriffs’ patience.', [
   ['Convene border march wardens and enforce fair blood-money courts', 95, { legitimacy: 10, securityMonths: 9, trust: 8 }],
   ['Endow stone universities at coastal towns to draw gentry sons to law', 110, { research: 12, prestige: 9, loyalty: 7 }],
   ['Hold swift royal justice circuits riding straight into troubled glens', 0, { legitimacy: 8, stability: 6 }]
  ]],
  ['Firth Herring & Salted Salmon Fleets', 'Busy east-coast burghs salt plump North Sea herring and river salmon bound for Baltic and Flemish ports.', [
   ['Charter coastal royal burgh piers and honest barrel standards', 85, { credit: 11, food: 65, development: 1 }],
   ['Protect fishing smacks cleanly from foreign cruisers', 50, { securityMonths: 8, trust: 8 }],
   ['Collect crisp port customs cleanly', 0, { gold: 85 }]
  ]],
  ['Poets & Gunsmiths at Stirling Hall', 'Renowned Scots makars compose sharp court verse while royal founders cast heavy brass cannon.', [
   ['Patronize both lively court poetry and royal artillery smithies', 85, { prestige: 10, research: 9, tools: 14 }],
   ['Print vernacular legal statutes cleanly for sheriff courts', 40, { research: 8, legitimacy: 7 }],
   ['Host festive winter gatherings uniting Highland and Lowland peers', 0, { loyalty: 9, stability: 6 }]
  ]],
  ['Thistle Unbroken in Storm', 'Firm march courts, thriving fish burghs, and proud learning bind Highlands and Lowlands together.', [
   ['Confirm burgh charters cleanly', 35, { credit: 7, legitimacy: 6 }],
   ['Thank loyal clan and burgh stewards', 20, { loyalty: 6 }],
   ['Close the Edinburgh parliament', 0, { stability: 4 }]
  ]]
 );

 arc4('cw_reg_genoa_bank', 'Regional', 'region_genoa',
  ['House of Saint George Manages Public Debt', 'Genoese bankers inside the Casa di San Giorgio propose pooling customs shares to retire costly fleet debts and fund Aegean/western trade.', [
   ['Partner transparently with Saint George shares while guarding sovereign veto', 120, { credit: 13, inflation: -3, legitimacy: 8 }],
   ['Audit every customs farm cleanly to stop noble tax-dodging', 55, { legitimacy: 10, credit: 9 }],
   ['Keep public debt repayments strictly tied to annual port receipts', 0, { credit: 7, stability: 5 }]
  ]],
  ['Black Sea & Western Spice Carracks', 'Broad round-bellied Genoese carracks haul heavy alum, wool, and sugar between eastern straits and Atlantic ports.', [
   ['Build deeper breakwater moles and dry-dock slips at harbor mouth', 135, { development: 1, credit: 12, prestige: 8 }],
   ['Standardize marine insurance tables in city notary stalls', 55, { credit: 10, research: 7 }],
   ['Escort rich alum convoys with armed crossbow galleys', 0, { securityMonths: 8, credit: 6 }]
  ]],
  ['Velvet Weavers & Sea Cartographers', 'Silky crimson Genoa velvet and crisp portolan compass charts command top coin at Antwerp and Seville.', [
   ['Endow portolan chartmakers’ workshops beside harbor towers', 75, { research: 12, prestige: 9 }],
   ['Protect master velvet-dyers’ secret alum recipes tightly', 40, { securityMonths: 8, credit: 7 }],
   ['Collect brisk harbor duties cleanly', 0, { gold: 105 }]
  ]],
  ['Marble Palaces Above Deep Water', 'Shrewd public finance and unmatched carracks keep the maritime republic agile across turbulent seas.', [
   ['Seal annual House of Saint George ledgers', 35, { credit: 8, legitimacy: 6 }],
   ['Celebrate harbor patron feasts', 25, { piety: 7, prestige: 6 }],
   ['Close the Doge’s assembly', 0, { stability: 4 }]
  ]]
 );

 arc4('cw_reg_kalmar_sound', 'Regional', 'region_kalmar',
  ['Toll-Booths Beside the Narrow Sound', 'Hundreds of Baltic grain, timber, and herring ships pass narrow straits daily under fortress guns—spurring merchants to haggle toll rates fiercely.', [
   ['Fix fair transparent Sound Dues in silver and build beacon lighthouses', 125, { credit: 12, gold: 80, legitimacy: 8 }],
   ['Offer Baltic Hansa and Dutch skippers fast clearing lanes for honest manifests', 65, { credit: 10, acceptance: 8 }],
   ['Enforce strict cannon-enforced customs stops on every passing sail', 0, { gold: 115, securityMonths: 7 }]
  ]],
  ['Three Crowns Debate Shared Council Seats', 'Norwegian, Swedish, and Danish estate lords demand balanced respect for local mining and farming laws inside union councils.', [
   ['Confirm distinct national law books while uniting foreign defense cleanly', 75, { loyalty: 11, legitimacy: 10, stability: 8 }],
   ['Invest copper-mine profits equally into Baltic port docks', 85, { development: 1, tools: 18, credit: 8 }],
   ['Hold rotating seasonal councils across all three kingdoms warmly', 0, { loyalty: 9, trust: 7 }]
  ]],
  ['Great Copper Mountain Stays Dry', 'Deep Falun copper shafts pump water out by clever horse-and-waterwheel chains, supplying brass cannon and coin alike.', [
   ['Modernize mine drainage wheels and miner safety codes', 90, { tools: 22, research: 9, credit: 8 }],
   ['Mint crisp heavy northern silver and copper coins', 45, { credit: 9, inflation: -2 }],
   ['Reserve copper ingots neatly in royal arsenals', 0, { tools: 15 }]
  ]],
  ['Harmony Across Northern Straits', 'Fair Sound Dues, respected provincial laws, and rich mines bind northern seas smoothly.', [
   ['Publish uniform maritime buoy maps', 40, { research: 7, credit: 7 }],
   ['Feast estate delegates warmly', 25, { loyalty: 7 }],
   ['Close the Nordic council', 0, { stability: 4 }]
  ]]
 );

 arc4('cw_reg_tibet_monastery', 'Regional', 'region_tibet',
  ['Tea-Horse Caravans Through Snowy Passes', 'Sturdy plateau ponies trade sleek royal wool and salt cakes for pressed Sichuan brick-tea along icy mountain trails.', [
   ['Maintain stone yak-bridges, refuge huts, and monastery trade fairs', 130, { credit: 11, food: 55, trust: 10 }],
   ['Charter fair tea-for-horse weighing benches supervised by monks', 65, { credit: 9, piety: 8, loyalty: 7 }],
   ['Protect caravan trail passes with loyal plateau horsemen', 0, { securityMonths: 8, credit: 5 }]
  ]],
  ['Woodblock Printing at the Great Monastery', 'Monastic printers carve thousands of pearwood blocks preserving medicine, astronomy, and sacred commentaries in crisp ink.', [
   ['Endow monastery print-houses and medical herbal colleges', 110, { research: 13, piety: 12, prestige: 9 }],
   ['Supply fine paper pulp and carved yak-butter lamps cleanly', 55, { piety: 9, research: 8 }],
   ['Receive blessed printed medical treatises at palace shrines', 0, { research: 6, piety: 7 }]
  ]],
  ['Dry Highland Barley Stores Tested by Frost', 'Early autumn snow threatens bare barley heads on terraced plateau valleys.', [
   ['Open monastery grain-vaults early and share roasted tsampa flour', 70, { food: 75, piety: 9, trust: 11 }],
   ['Repair stone glacial melt-channels feeding terrace plots', 60, { food: 55, development: 1 }],
   ['Organize communal valley threshing barns', 0, { food: 35, trust: 6 }]
  ]],
  ['Calm Peaks & Living Dharma', 'Maintained trails, woodblock scholarship, and full monastery granaries steady the Roof of the World.', [
   ['Inscribe mountain trail protections cleanly', 35, { legitimacy: 7, piety: 7 }],
   ['Celebrate butter-lamp festivals cleanly', 25, { prestige: 8, piety: 8 }],
   ['Close the plateau council', 0, { stability: 4 }]
  ]]
 );

 // === E. CONTINENTAL & FAITH-WIDE WORLD ARCS (14 MORE CHAINS = 56 STAGES -> EXACT 68 CHAINS = 272 STAGES!) ===
 arc4('cw_cont_europe_guild', 'Regional', 'cont_europe',
  ['Town Belfry Bells & Chartered Liberties', 'Sworn burghers erect proud stone belfries holding city seals, demanding firm royal charters confirming freedom from arbitrary manor tolls.', [
   ['Grant clear chartered town liberties in return for reliable hearth taxes', 105, { credit: 11, trust: 10, legitimacy: 8 }],
   ['Mediate fair border compacts between town burghers and rural abbots', 55, { stability: 8, loyalty: 7 }],
   ['Confirm traditional market rights while keeping royal bailiffs inside gates', 0, { legitimacy: 7, securityMonths: 6 }]
  ]],
  ['Traveling Clockmakers & Organ Builders', 'Master German and Flemish craftsmen cross provinces installing gleaming chime clocks and brass water-pumps.', [
   ['Sponsor public workshops pairing foreign masters with local youths', 85, { research: 11, tools: 16, acceptance: 7 }],
   ['Hire master pump-makers for deep civic wells and mines', 65, { development: 1, research: 8 }],
   ['Purchase fine clocks for palace and cathedral towers', 0, { prestige: 8 }]
  ]],
  ['Hanseatic & Southern Factors Trade Wool', 'Northern herring barrels meet southern olive oil and alum at brisk seasonal champagne-style overland fairs.', [
   ['Provide armed fair-peace judges settling disputes in twenty-four hours', 65, { credit: 11, legitimacy: 8 }],
   ['Cobble main fairground rows and build dry slate stalls', 75, { development: 1, credit: 9 }],
   ['Collect crisp fair booth dues cleanly', 0, { gold: 90 }]
  ]],
  ['Humming Market Towns', 'Chartered boroughs and fast fair courts lift trade, craft, and royal revenues together.', [
   ['Archive renewed town charters in the chancery', 35, { legitimacy: 7 }],
   ['Toast city mayors and guild elders', 25, { trust: 7, prestige: 5 }],
   ['Close the urban charter review', 0, { stability: 4 }]
  ]]
 );

 arc4('cw_cont_asia_porcelain', 'Regional', 'cont_asia',
  ['Blue-and-White Kilns Blaze All Night', 'Master potters pack hillside dragon-kilns with delicate translucent bowls painted in imported Persian cobalt.', [
   ['Sponsor royal kiln grades and clean river clay-washing pits', 135, { credit: 12, prestige: 11, development: 1 }],
   ['Lower transit tolls on cobalt pigment and firewood barges', 65, { credit: 9, tools: 14 }],
   ['Collect crisp porcelain crate customs at coastal wharves', 0, { gold: 110, credit: 4 }]
  ]],
  ['Kiln-Workers Demand Rice & Charcoal Parity', 'Stokers sweating before 1,300-degree brick arches strike over dusty rice rations and cracked lungs.', [
   ['Improve kiln shade roofs, clean water buckets, and rice wages', 80, { trust: 11, unrest: -8, food: 35 }],
   ['Provide honest guild clinic herbs for heat exhaustion', 45, { trust: 8, research: 6 }],
   ['Settle wage tables calmly with kiln masters', 0, { stability: 6, credit: 4 }]
  ]],
  ['Export Cargo Packed in Straw & Tea', 'Clever packers nest porcelain stacks inside damp-proof chests cushioned with dried tea leaves and straw—yielding double value at destination.', [
   ['Standardize sturdy export crate sizes for monsoon shipping', 55, { credit: 10, research: 6 }],
   ['Gift flawless imperial dragon bowls to foreign embassies', 45, { prestige: 11, acceptance: 7 }],
   ['Auction seconds and chipped bowls cleanly in local towns', 0, { gold: 65, trust: 5 }]
  ]],
  ['White Gold of the Kilns', 'Skilled clay-hands and fair kiln conditions turn river earth into coveted global treasure.', [
   ['Stamp crisp royal reign-marks on kiln bases', 35, { legitimacy: 7, prestige: 8 }],
   ['Inspect river transport barges', 20, { credit: 5 }],
   ['Close the kiln works ledger', 0, { stability: 4 }]
  ]]
 );

 arc4('cw_cont_africa_iron', 'Regional', 'cont_africa',
  ['Tall Clay Blast-Smelters of the Savanna', 'Master blacksmith guilds raise towering clay natural-draft furnaces turning red laterite ore into tough high-carbon steel for hoes and spears.', [
   ['Endow guild ironworks, charcoal coppices, and royal tool depots', 135, { tools: 24, development: 1, credit: 10 }],
   ['Trade royal salt and cloth cleanly for finished farm hoes and axes', 70, { tools: 18, food: 45, trust: 9 }],
   ['Honor traditional smith-clan shrine protections along valley roads', 0, { piety: 7, acceptance: 8, loyalty: 6 }]
  ]],
  ['Farmers Beg Iron Ploughs & Weeding Hoes', 'Heavy spring rains soften deep valley clay—yet too many villages still dig with fire-hardened wooden sticks.', [
   ['Distribute iron-bladed hoes and machetes across rural parishes', 85, { food: 85, tools: 18, trust: 11 }],
   ['Train itinerant village bellows-men to repair cracked blades locally', 50, { tools: 14, research: 7 }],
   ['Reserve spare steel bars in district stores', 0, { tools: 10, stability: 5 }]
  ]],
  ['Brass Casters Craft Court Plaques', 'Court brass-founders use lost-wax clay molds to cast luminous bronze plaques chronicling royal victories and trade treaties.', [
   ['Commission historic bronze wall plaques for the palace courtyard', 85, { prestige: 12, legitimacy: 9 }],
   ['Sponsor young apprentices in lost-wax brass and copper craft', 45, { research: 8, tools: 12 }],
   ['Trade surplus brass bracelets along river markets', 0, { credit: 8, gold: 55 }]
  ]],
  ['Forged in Red Earth', 'Master iron smelting feeds lush harvests while lost-wax bronzes preserve living history in gleaming metal.', [
   ['Protect sacred smithing groves cleanly', 30, { piety: 6, trust: 6 }],
   ['Celebrate harvest with new iron hoes', 25, { food: 35 }],
   ['Close the smithing guild roll', 0, { stability: 4 }]
  ]]
 );

 arc4('cw_cont_americas_cacao', 'Regional', 'cont_americas',
  ['Obsidian Blades & Golden Maize Fairs', 'Canals and mountain trails hum with merchants exchanging bright macaw feathers, volcanic obsidian cores, dried squash, and roasted cacao.', [
   ['Pave stone market plazas with honest judges checking cacao-bean counts', 130, { credit: 11, legitimacy: 9, trust: 10 }],
   ['Stock regional stone storehouses with dried maize and salted beans', 75, { food: 85, grain: 20, stability: 7 }],
   ['Protect long-distance merchant paths with border watchmen', 0, { securityMonths: 8, credit: 6 }]
  ]],
  ['Counterfeit Clay Cacao Beans Spotted', 'Sharp-eyed market mothers catch cheats mixing clay-baked husks painted brown into genuine cacao-bean pouches.', [
   ['Post honest bean-assayers at market gates and smash fake husks publicly', 45, { legitimacy: 10, trust: 11, credit: 8 }],
   ['Introduce stamped copper axe-money blades alongside cacao for larger deals', 65, { credit: 10, tools: 14, research: 6 }],
   ['Fine fraudulent vendors in open plaza courts', 0, { trust: 7, legitimacy: 6 }]
  ]],
  ['Astronomers Align Temple & Planting Markers', 'Priests and sky-watchers sight sunrise notches along stone horizon pillars to call exact spring rain-planting days.', [
   ['Carve accurate public horizon calendars for farming communities', 65, { food: 65, research: 10, piety: 8 }],
   ['Hold joyful spring seed-blessing dances uniting town and countryside', 45, { trust: 10, prestige: 8 }],
   ['Record solar alignments cleanly on painted bark codices', 0, { research: 7, piety: 6 }]
  ]],
  ['Abundance Beneath Measured Skies', 'Honest markets, accurate sky calendars, and full maize barns anchor flourishing valley civilizations.', [
   ['Replenish seed reserves across villages', 35, { food: 45, grain: 14 }],
   ['Thank wise market elders', 20, { trust: 6 }],
   ['Close the seasonal market codex', 0, { stability: 4 }]
  ]]
 );

 arc4('cw_cont_oceania_waka', 'Regional', 'cont_oceania',
  ['Twin-Hulled Voyaging Canoes on the Reef', 'Master navigators read ocean swell echoes, migrating seabirds, and star-paths to link outer islands across hundreds of leagues of open blue water.', [
   ['Sponsor twin-hulled ocean canoes carved from ancient ridge timber', 130, { prestige: 11, research: 11, credit: 9 }],
   ['Build sheltered reef stone fish-traps and sweet-potato storage pits', 80, { food: 85, development: 1, trust: 10 }],
   ['Honor traditional navigator elders at coastal shell-horn assemblies', 0, { piety: 8, trust: 8, legitimacy: 6 }]
  ]],
  ['Rivalry Between Outer Atoll & High Valley', 'High-island taro farmers and outer coral-atoll fishermen quarrel over shell-bead exchange rates and reef rights.', [
   ['Host a great coastal exchange feast trading taro, smoked fish, and mats', 75, { trust: 12, food: 55, acceptance: 10 }],
   ['Confirm sacred seasonal rahui reef bans letting fish stocks rebound', 40, { food: 50, piety: 8, legitimacy: 8 }],
   ['Mediate fair reef channels peacefully among island chiefs', 0, { loyalty: 9, stability: 7 }]
  ]],
  ['Star-Compass Schools Teach Youths', 'Navigators lay out pebble star-rings on smooth beach sand, teaching young islanders to steer blindfolded by wave pitch.', [
   ['Endow permanent navigator huts and woven chart sticks', 65, { research: 12, prestige: 9, trust: 8 }],
   ['Exchange sturdy obsidian and basalt adzes across islands cleanly', 45, { tools: 18, credit: 8 }],
   ['Hold safe daylight sailing trials inside the lagoon', 0, { research: 6, stability: 5 }]
  ]],
  ['Pathways Written in Swell & Star', 'Protected reefs, full taro stores, and fearless star-navigators unite scattered islands across endless sea.', [
   ['Carve proud canoe prows for royal festivals', 40, { prestige: 10 }],
   ['Inspect stone fish-weirs cleanly', 25, { food: 40 }],
   ['Close the island assembly', 0, { stability: 4 }]
  ]]
 );

 arc4('cw_reg_oireats_steppe', 'Regional', 'region_oirats',
  ['Caravan Escorts & Steppe Falconry', 'Four Oirat clan elders ride past dry lakes weighing caravan tolls on Chinese tea and Central Asian horses.', [
   ['Guarantee strict banner protection along steppe caravan tracks', 105, { credit: 10, loyalty: 10, securityMonths: 8 }],
   ['Trade prime hardy steppe ponies calmly for silk, tea, and iron kettles', 55, { food: 45, tools: 16, credit: 8 }],
   ['Confirm clan pasture boundaries cleanly before winter frost', 0, { loyalty: 8, stability: 6 }]
  ]],
  ['Iron Kettles & Tea Bricks Short in Winter', 'Snowstorms delay southern tea-brick convoys, leaving winter felt camps restless without hot salted tea.', [
   ['Open royal reserve tea and dried-milk stores cleanly across clans', 75, { loyalty: 12, food: 55, trust: 10 }],
   ['Send fast riders with silver to buy emergency tea at oasis fairs', 65, { food: 45, credit: 6 }],
   ['Share smoked mutton stews generously across camp hearths', 0, { food: 35, loyalty: 7 }]
  ]],
  ['Armorer Clans Forge Lamellar Scales', 'Skilled steppe smiths hammer overlapping iron lamellar plates strapped cleanly with rawhide.', [
   ['Supply coal and bog-iron to mobile camp armories', 75, { tools: 20, loyalty: 8, securityMonths: 7 }],
   ['Hold grand autumn mounted archery contests', 45, { prestige: 10, loyalty: 8 }],
   ['Inspect winter bow-stave stores cleanly', 0, { securityMonths: 6 }]
  ]],
  ['Wind-Hardened Banners', 'Full tea chests, respected pastures, and fine lamellar smiths bind the confederation tight.', [
   ['Bless banner standards under open sky', 30, { piety: 8, prestige: 7 }],
   ['Confirm spring migration signals', 20, { stability: 5 }],
   ['Close the clan council', 0, { loyalty: 5 }]
  ]]
 );

 arc4('cw_reg_cyprus_sugar', 'Regional', 'region_cyprus',
  ['Venetian Sugar Kettles & Copper Mines', 'Sun-drenched island valleys boil sweet cane juice in huge copper cauldrons while coastal ports eye passing crusader and spice fleets.', [
   ['Upgrade water-driven sugar mills and stone coastal cisterns', 135, { development: 1, credit: 12, food: 45 }],
   ['Grant fair harbor warehousing equally to Venetian, Genoese, and native ships', 65, { credit: 10, acceptance: 9 }],
   ['Collect steady island sugar and salt-lake duties cleanly', 0, { gold: 105 }]
  ]],
  ['Greek & Latin Parishes Seek Calm Equity', 'Rural Greek villagers and Latin town lords dispute tithe vineyards and mountain abbey forest rights.', [
   ['Confirm bilingual fair village courts protecting peasant vineyards', 65, { acceptance: 12, trust: 11, legitimacy: 8 }],
   ['Endow shared island hospital beds and monastery roof timber', 60, { piety: 9, acceptance: 9 }],
   ['Hold calm island estates assemblies hearing both traditions', 0, { stability: 7, loyalty: 6 }]
  ]],
  ['Corsair Galleys Lurk Behind Headlands', 'Barbary and Aegean rovers probe salt-lake flats by night.', [
   ['Raise coastal stone watchtowers with beacon fires', 80, { securityMonths: 10, development: 1 }],
   ['Arm swift island patrol brigantines cleanly', 60, { securityMonths: 9, credit: 6 }],
   ['Keep coastal villagers alert behind castle walls', 0, { securityMonths: 6 }]
  ]],
  ['Island Crossroads Secure', 'Balanced parish justice, bright salt pans, and strong watchtowers keep the Mediterranean isle flourishing.', [
   ['Mint crisp island silver groats', 40, { credit: 8, prestige: 7 }],
   ['Inspect sugar aqueducts cleanly', 25, { food: 30 }],
   ['Close the island council', 0, { stability: 4 }]
  ]]
 );

 arc4('cw_reg_brittany_sail', 'Regional', 'region_brittany',
  ['Granite Ports & Canvas Sail-Looms', 'Breton weavers turn valley hemp into tough cream-colored sailcloth prized by Atlantic caravels across Europe.', [
   ['Expand rural canvas looms and stone breakwater jetties', 135, { development: 1, credit: 12, tools: 16 }],
   ['Charter Breton coastal salt-and-wine convoys with escort cutters', 70, { credit: 9, securityMonths: 8 }],
   ['Protect ancient ducal coastal admiralty charters cleanly', 0, { legitimacy: 8, loyalty: 7 }]
  ]],
  ['Shipwreck Salvage Bells Along Rocky Reefs', 'Treacherous granite skerries smash foreign wool hulks in fog—tempting coastal villagers toward old wreck-plundering.', [
   ['Pay generous coastal lifeboat rescue bounties replacing wreck-looting', 75, { trust: 10, credit: 9, acceptance: 8 }],
   ['Build stone harbor beacons on stormy western headlands', 85, { development: 1, securityMonths: 8 }],
   ['Enforce humane admiralty wreck laws strictly', 0, { legitimacy: 8, credit: 5 }]
  ]],
  ['Estates Guard Ducal Salt Tax Freedom', 'Proud Breton estates defend exemption from harsh mainland gabelle salt monopolies.', [
   ['Confirm regional salt exemptions clearly in return for coastal fleet dues', 55, { loyalty: 11, stability: 8 }],
   ['Promote brisk sea-salt evaporation pans cleanly along southern bays', 45, { food: 50, credit: 8 }],
   ['Receive estate homage cleanly at Vannes or Nantes', 0, { legitimacy: 8, loyalty: 6 }]
  ]],
  ['Sails Woven of Granite Grit', 'Safe beacons, honest lifeboats, and booming sail-looms keep Breton ports thriving.', [
   ['Print bilingual Breton-French sea laws', 35, { research: 6, acceptance: 7 }],
   ['Bless fishing fleets at spring tide', 25, { piety: 7, trust: 6 }],
   ['Close the ducal estates', 0, { stability: 4 }]
  ]]
 );

 arc4('cw_reg_maya_cenote', 'Regional', 'region_maya',
  ['Limestone Cenotes & Forest Gardens', 'Tropical downpours wash ash off steep limestone terraces while forest cities trade bright jade, cotton cloth, salt, and honey along coastal canoes.', [
   ['Build stone-rimmed rain cisterns and shaded cacao-and-maize forest gardens', 125, { food: 90, development: 1, trust: 10 }],
   ['Expand coastal log-canoe salt pans and cotton weaving markets', 75, { credit: 10, food: 45, tools: 12 }],
   ['Honor traditional town council elders maintaining water shrines', 0, { piety: 8, trust: 7 }]
  ]],
  ['Rival City-States Clash Over Salt Beds', 'Neighboring coastal lords dispute shallow lagoon salt-evaporation pans crucial for preserving meat and fish.', [
   ['Negotiate shared seasonal salt-pan shares witnessed by priesthoods', 55, { stability: 9, acceptance: 9, food: 45 }],
   ['Post joint canoe watches protecting salt flats from corsairs', 45, { securityMonths: 8, loyalty: 7 }],
   ['Confirm ancient boundary markers cleanly', 0, { legitimacy: 7, stability: 5 }]
  ]],
  ['Astronomers & Scribes Paint Bark Books', 'Master scribes paint vivid astronomical and agricultural almanacs onto lime-coated fig-bark accordions.', [
   ['Patronize astronomy houses and medical herb codices', 80, { research: 13, prestige: 10, piety: 7 }],
   ['Train noble youths in carved glyph-stone history and arithmetic', 50, { research: 9, legitimacy: 8 }],
   ['Guard sacred codex chests safely inside dry limestone vaults', 0, { securityMonths: 7, piety: 6 }]
  ]],
  ['Living Canopy & Carved Stone', 'Rain cisterns, shared salt pans, and thriving bark libraries preserve timeless forest city vigor.', [
   ['Celebrate seasonal planting calendars openly', 35, { trust: 8, food: 30 }],
   ['Reward master scribes and weavers', 25, { prestige: 7 }],
   ['Close the city council', 0, { stability: 4 }]
  ]]
 );

 arc4('cw_reg_haudenosaunee_longhouse', 'Regional', 'region_haudenosaunee',
  ['Smoke Rises Over the Great Council Fire', 'Clan mothers and sachem speakers from five/allied nations gather inside longhouses to renew the Great Law of Peace and settle hunting disputes.', [
   ['Present gleaming wampum belts and feast delegations generously', 105, { loyalty: 12, trust: 12, stability: 9 }],
   ['Coordinate shared winter deer and beaver grounds cleanly across nations', 50, { food: 60, acceptance: 10, legitimacy: 8 }],
   ['Hear every nation’s voice patiently till unanimous concord forms', 0, { stability: 8, trust: 8 }]
  ]],
  ['Three Sisters Harvests Fill Bark Pits', 'Maize, climbing beans, and squash planted together yield bursting autumn ears needing deep dry storage.', [
   ['Dig lined bark-and-grass winter cache pits and build shared longhouses', 85, { food: 90, development: 1, trust: 10 }],
   ['Trade surplus cornmeal peacefully for coastal shells and copper', 45, { credit: 9, tools: 14 }],
   ['Hold joyful Green Corn thanksgiving dances across villages', 0, { piety: 9, trust: 8 }]
  ]],
  ['Runners Bring Word of Distant Strangers', 'Swift trail-runners report unfamiliar iron axes and glass beads entering river trade along eastern trails.', [
   ['Regulate ironware trade cleanly through central sachem councils', 55, { tools: 18, securityMonths: 9, legitimacy: 8 }],
   ['Train smith-menders to rework scrap iron into fine arrowheads and hoes', 45, { tools: 16, research: 8 }],
   ['Keep alert watchmen along outer river portages', 0, { securityMonths: 8, stability: 5 }]
  ]],
  ['One Mind Beneath the White Pine', 'Unbroken consensus and overflowing Three Sisters caches uphold peace from lake to river.', [
   ['Weave new wampum belts recording renewed accords', 35, { prestige: 8, legitimacy: 8 }],
   ['Honor wise clan mothers openly', 20, { trust: 8 }],
   ['Close the council fire cleanly', 0, { stability: 4 }]
  ]]
 );

 arc4('cw_reg_zayyanid_tlemcen', 'Regional', 'region_zayyanid',
  ['Tlemcen Looms & Saharan Caravan Gates', 'Mountain wool-carpets, gilded brass lamps, and Saharan gold-dust caravans cross Tlemcen’s broad arches toward Mediterranean ports.', [
   ['Upgrade desert caravan wells, bazaar vaults, and Andalusi looms', 135, { development: 1, credit: 12, prestige: 9 }],
   ['Lower transit tariffs gently to lure Mediterranean factors back uphill', 60, { credit: 10, acceptance: 8 }],
   ['Protect mountain pass forts cleanly with loyal cavalry watches', 0, { securityMonths: 8, loyalty: 6 }]
  ]],
  ['Andalusi Scholars & Artisans Arrive', 'Skilled poets, orchardists, and hydraulic builders fleeing northern strife seek peaceful refuge inside valley towns.', [
   ['Welcome refugees warmly with orchard land and madrasa stipends', 90, { research: 12, acceptance: 12, food: 45 }],
   ['Pair refugee hydraulic masters onto aging city water conduits', 55, { development: 1, food: 50 }],
   ['Offer fair workshop stalls inside outer bazaars', 0, { credit: 7, acceptance: 7 }]
  ]],
  ['Coastal Ports Request Defense Barges', 'Foreign corsairs and rival galleys threaten coastal port anchors.', [
   ['Fortify port towers with cannon and alert beacon riders', 85, { securityMonths: 10, tools: 14 }],
   ['Coordinate coastal defense treaties with neighboring harbor towns', 40, { securityMonths: 8, acceptance: 6 }],
   ['Guard inland mountain roads sharply', 0, { securityMonths: 7 }]
  ]],
  ['Oasis of Craft & Learning', 'Welcomed artisans and thriving caravan roads keep Tlemcen radiant between desert and sea.', [
   ['Endow a fine mosque courtyard fountain', 45, { piety: 9, prestige: 7 }],
   ['Audit honest bazaar scales', 20, { credit: 6 }],
   ['Close the Tlemcen divan', 0, { stability: 4 }]
  ]]
 );

 arc4('cw_reg_miao_maori', 'Regional', 'region_maori',
  ['Terraced Pā Forts & Kumara Pits', 'Clan builders carve steep terraced earthen embankments atop volcanic hills while guarding sweet kumara tubers against damp winter frost.', [
   ['Line warm underground kumara storage pits and strengthen hill palisades', 120, { food: 85, development: 1, securityMonths: 9 }],
   ['Organize shared coastal netting expeditions for dried winter fish', 65, { food: 65, trust: 9 }],
   ['Confirm sacred tapu conservation rules over shellfish beds', 0, { piety: 8, food: 40, legitimacy: 6 }]
  ]],
  ['Greenstone Pounamu Trail Across Passes', 'Southern river expeditions bring prized translucent greenstone jade prized for ceremonial adzes and peace gifts.', [
   ['Sponsor peaceful greenstone-for-obsidian trade trails between valleys', 75, { credit: 10, tools: 18, acceptance: 9 }],
   ['Commission master carvers to craft heirloom peace-meres', 55, { prestige: 11, legitimacy: 8 }],
   ['Guard alpine pass camps with warm woven flax cloaks', 0, { loyalty: 7, stability: 5 }]
  ]],
  ['Carved Meeting House Raises Ancestral Pillars', 'Skilled tohunga carvers chisel spiral patterns into totara heartwood honoring shared lineage.', [
   ['Host neighboring chiefs cleanly at the carved house opening feast', 70, { prestige: 11, trust: 11, loyalty: 9 }],
   ['Teach young weavers fine flax-cloak dyeing craft', 40, { research: 7, trust: 8 }],
   ['Preserve sacred chants cleanly inside evening assemblies', 0, { piety: 8 }]
  ]],
  ['Mana of Land & Sea', 'Full winter food pits, carved meeting houses, and honored peace exchanges uphold dignity across bays.', [
   ['Replenish dried fern-root and kumara stores', 35, { food: 45 }],
   ['Honor wise elders and weavers', 25, { trust: 7, prestige: 6 }],
   ['Close the seasonal hui', 0, { stability: 4 }]
  ]]
 );

 arc4('cw_reg_sunda_spice', 'Regional', 'region_sunda',
  ['Black Pepper Hills & Sunda Strait Ports', 'Hillside farmers harvest fragrant black pepper vines while port harbormasters greet junks and western ships rounding volcanic capes.', [
   ['Expand paved pepper warehouses and honest tin-weight port scales', 135, { credit: 12, development: 1, trust: 9 }],
   ['Advance dry rice and copper machetes to upland pepper smallholders', 70, { food: 55, tools: 16, trust: 9 }],
   ['Collect crisp anchorage pepper tenths at harbor gates', 0, { gold: 110 }]
  ]],
  ['Volcanic Ash Enriches Upland Rice', 'Warm mountain ash makes fertile soil, yet sudden lahars threaten valley wooden bridges after storms.', [
   ['Build sturdy bamboo-and-stone suspension bridges above flood gorges', 85, { development: 1, credit: 9, trust: 8 }],
   ['Stock emergency dry rice barns on high ridge spurs', 50, { food: 65, stability: 7 }],
   ['Post horn-watchers above crater rivers', 0, { securityMonths: 7, trust: 5 }]
  ]],
  ['Foreign Captains Seek Permanent Stone Factories', 'Ambitious overseas traders request fortified waterfront stone compounds.', [
   ['Permit unarmed stone warehouses strictly under local royal judges', 55, { credit: 11, legitimacy: 8, acceptance: 8 }],
   ['Keep gunned harbor towers exclusively in native crown hands', 40, { securityMonths: 10, legitimacy: 8 }],
   ['Trade cleanly at open harbor piers without walled compounds', 0, { credit: 7, stability: 6 }]
  ]],
  ['Fragrant Hills, Sovereign Piers', 'Careful port sovereignty lets booming pepper wealth enrich inland villages safely.', [
   ['Inscribe fair port weight treaties', 35, { legitimacy: 7, credit: 6 }],
   ['Celebrate harvest dances cleanly', 25, { prestige: 7, trust: 7 }],
   ['Close the port assembly', 0, { stability: 4 }]
  ]]
 );

 arc4('cw_xr_gunpowder_saltpeter', 'Crossroads', 'crossroads_gunpowder',
  ['Saltpeter Diggers Inside Parish Stables', 'Royal saltpeter-men armed with warrants dig up earth floors inside private stables and dove-cotes, infuriating farmers.', [
   ['Build dedicated covered state nitre-beds of compost & lime instead', 135, { research: 11, trust: 11, development: 1 }],
   ['Pay generous cash compensation and re-lay stone barn floors cleanly', 80, { trust: 9, stability: 6, tools: 14 }],
   ['Restrict private floor digging strictly to unoccupied ruins', 0, { legitimacy: 7, unrest: -4 }]
  ]],
  ['Chemist Proves Controlled Nitre Plantations', 'Using layered manure, wood-ash, and urine watered under thatched sheds, chemists harvest purer white crystals than barn floors.', [
   ['Charter regional nitre-plantations freeing farms forever', 75, { research: 11, credit: 8, trust: 9 }],
   ['Train county apprentices in pure potash-and-nitre leaching', 45, { research: 8, tools: 12 }],
   ['Keep stable compensation funds open meanwhile', 0, { stability: 5 }]
  ]],
  ['Drying Houses & Brass Proof Mortars', 'Standardized brass eprouvette testers measure exact powder kick before barrels leave arsenals.', [
   ['Equip every garrison arsenal with brass powder testers', 65, { securityMonths: 9, research: 8 }],
   ['Seal tested dry casks with stamped date rings', 30, { legitimacy: 7, credit: 5 }],
   ['Store surplus sulfur safely in stone vaults', 0, { securityMonths: 6 }]
  ]],
  ['Clean Supply Without Farmer Fury', 'Artificial nitre beds end hated stable raids while giving arsenals twice the powder reliability.', [
   ['Print clean nitre-bed manuals for county stewards', 35, { research: 7 }],
   ['Burn old hated digging warrants publicly', 25, { trust: 10, prestige: 6 }],
   ['Close the ordnance supply inquiry', 0, { stability: 4 }]
  ]]
 );

 return out;
}
