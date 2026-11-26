/**
 * Sovereign: 1450 — Modular Content Pack: Global Regions, Civilizations & Faith Traditions
 * Deep 3-choice historical events across Europe, Islamic World, India, East Asia,
 * Steppe, Sub-Saharan Africa, Americas, and Oceania — zero boilerplate filler.
 */
const BANK = [
 ['reg_eur_hansa_salt','Regional','Baltic Salt Fleet Charter','Hanseatic masters negotiate winter warehousing rights for preserved herring barrels.','cont_europe',[
  ['Grant quay booths for fair customs tolls and lighthouse dues',110,{credit:9,food:35,development:1}],
  ['Split wharf access jointly between native guilds and Hansa skippers',55,{trust:6,credit:6}],
  ['Favor native coastal boats exclusively inside home basins',0,{loyalty:6,unrest:-3}]
 ]],
 ['reg_eur_university_disputation','Regional','Scholastic Disputation at the Abbey','Masters in theology and canon law request royal license to debate printed commentary theses.','cont_europe',[
  ['Endow chairs of civil law, medicine, and rhetoric',125,{research:11,prestige:8,piety:5}],
  ['Permit open scholarly debate under discreet bishop supervision',45,{research:6,acceptance:5}],
  ['Restrict lectures cleanly to approved orthodox glosses',0,{faithAuthority:7,stability:3}]
 ]],
 ['reg_eur_tournaments_heralds','Regional','Spring Pas d’Armes on the Meadow','Knights gather with painted pavilions to test armor and lineage heraldry.','gov_feudal',[
  ['Present silver spurs and lavish feast tables to victors',120,{morale:9,prestige:9,loyalty:7}],
  ['Hold disciplined cavalry squadron exercises without banquet debt',40,{morale:7,experience:0.05}],
  ['Audit shire muster scrolls briskly instead',0,{morale:4,gold:35}]
 ]],
 ['reg_eur_alpine_pass_toll','Regional','Snow-Cleared Wagon Road','Carters beg funds for timber snow-sheds and stone milestones across mountain passes.','cont_europe',[
  ['Pave stone approaches and timber avalanche galleries cleanly',115,{credit:9,development:1,trust:7}],
  ['Hire seasonal village snow-clearers for modest salt pay',40,{food:20,trust:5,credit:4}],
  ['Collect customary pack-mule tolls',0,{gold:60}]
 ]],
 ['reg_asia_samarkand_tilework','Regional','Cobalt Glaze at the Madrasa','Persian tilemakers unveil luminous lapis domes honoring geometric astronomy.','faith_islamic',[
  ['Sponsor royal observatory commissions alongside mosaicists',130,{prestige:11,research:11,piety:7}],
  ['Endow student stipends in geometry and calligraphy',60,{research:7,trust:6,piety:5}],
  ['Reserve turquoise kiln funds for market cisterns calmly',0,{gold:35,piety:4}]
 ]],
 ['reg_asia_janissary_foundry','Regional','Bronze Culverts & Corps Drill','Veteran infantry commanders demonstrate disciplined salvo drills with heavy matchlocks.','gov_sultanate',[
  ['Fund enlarged corps arsenals and bronze cannon foundries',135,{morale:10,experience:0.08,prestige:7}],
  ['Pair matchlock companies with seasoned horse-archers in joint drills',65,{morale:8,supply:12}],
  ['Hold ranks to classical composite bows and sabers',0,{stability:5,loyalty:5}]
 ]],
 ['reg_asia_grand_canal_barges','Regional','Grain Barges on the Imperial Canal','Regional intendants report lock-gates jammed with silt below southern rice granaries.','gov_imperial',[
  ['Dredge stone lock-gates with paid corvee rice stipends',125,{food:90,development:1,trust:8}],
  ['Charter private junk lighters to carry grain cleanly round bends',55,{food:45,credit:6}],
  ['Divert coastal skiffs temporarily via deeper tides',0,{food:25,unrest:3}]
 ]],
 ['reg_asia_monsoon_tank_irrigation','Regional','Stone Reservoirs Before the Rains','Village elders petition for sluice repairs to catch southwest monsoon torrents before June.','faith_dharmic',[
  ['Rebuild granite anicut dams and temple tank steps',125,{food:85,development:1,trust:10}],
  ['Advance copper tools to village tank assemblies calmly',55,{food:50,trust:6,credit:3}],
  ['Leave channel upkeep cleanly to local mirasi headmen',0,{unrest:3,gold:25}]
 ]],
 ['reg_asia_spice_entrepot_duties','Regional','Junks and Dhows Crowd the Strait','Multilingual harbormasters request wider timber wharves for cloves, camphor, and pepper.','cont_asia',[
  ['Build stone godowns, beacons, and honest scale houses',130,{credit:11,development:1,trust:6}],
  ['Assign bilingual shahbandar brokers to speed clearance',60,{credit:8,acceptance:6}],
  ['Raise standard anchorage duties cleanly',0,{gold:95}]
 ]],
 ['reg_asia_zen_tea_gathering','Regional','Porcelain Bowls & Quiet Tea','Military retainers debate alliance feuds over stoneware bowls inside bamboo pavilions.','gov_shogunate',[
  ['Patronize tea masters and peaceful retainer poetry',100,{loyalty:11,stress:-10,prestige:6}],
  ['Hold calm hearth arbitration over boundary disputes',45,{loyalty:7,stability:5}],
  ['Keep retainers strictly at border castle drills',0,{morale:6}]
 ]],
 ['reg_steppe_kurultai_feast','Regional','Felt Yurts Raised for the Kurultai','Clan noyans ride three weeks with spare horses to weigh autumn grazing and raid routes.','gov_steppe',[
  ['Roast whole mares, settle pastures, and gift silk belts',120,{loyalty:12,morale:9,stability:6}],
  ['Arrange fair winter valley boundaries by cast lots',45,{loyalty:7,food:35}],
  ['Exact respected clan hostages quietly for harmony',0,{prestige:7,loyalty:-4}]
 ]],
 ['reg_afr_trans_saharan_well','Regional','Wells Along the Salt Trail','Tuareg guides warn that drifting dunes choked two crucial watering stages north of Taghaza.','cont_africa',[
  ['Fund stone well-linings and armed camelry escorts',120,{credit:10,food:30,trust:7}],
  ['Retain desert guides calmly at oasis checkpoints',50,{credit:6,securityMonths:6}],
  ['Route caravans swiftly by longer eastern salt pans',0,{gold:45,unrest:3}]
 ]],
 ['reg_afr_timbuktu_manuscripts','Regional','Leather Cases of Gold & Ink','Scholars arrive along Niger floodwaters trading Moroccan salt for illuminated legal codices.','cont_africa',[
  ['Fund guild copyists and public mosque scholars',115,{research:10,piety:9,prestige:8}],
  ['Exchange royal protection charters for rare law books',50,{legitimacy:7,research:6}],
  ['Levy orderly customs tolls on luxury caravan goods',0,{gold:85,credit:3}]
 ]],
 ['reg_afr_swahili_coral_mosque','Regional','Coral Stone Wharves & Dhows','Monsoon winds swing northeast, crowding stone piers with Indian cottons and Sofala gold.','cont_africa',[
  ['Expand coral stone harbor piers and harbor beacons',125,{credit:11,development:1,prestige:7}],
  ['Host Arab, Gujarati, and coastal shipmasters fairly',55,{acceptance:7,credit:7}],
  ['Collect brisk harbor anchorages cleanly',0,{gold:80}]
 ]],
 ['reg_afr_solomonic_rock_church','Regional','Monolithic Chapels in Highland Tufa','Deacons carve chanting chapels directly from red volcanic stone cliffs to shelter sacred relics.','faith_christian',[
  ['Sponsor master stonecutters and abbey choral schools',115,{piety:13,faithAuthority:9,legitimacy:6}],
  ['Protect pilgrimage valleys calmly with highland scouts',45,{trust:7,piety:6,securityMonths:6}],
  ['Keep rural churches to dignified timber and thatch',0,{piety:4,gold:25}]
 ]],
 ['reg_amer_chinampa_harvest','Regional','Floating Gardens on Lake Shallows','Engineered willow-and-silt beds yield triple harvests of maize, squash, and amaranth.','cont_americas',[
  ['Expand sluice causeways & floating willow beds cleanly',115,{food:90,development:1,trust:8}],
  ['Train highland clans in raised reed-bed planting',50,{food:55,trust:6,acceptance:4}],
  ['Direct canoe crews toward stone market causeways',0,{prestige:7,credit:4}]
 ]],
 ['reg_amer_quipu_storehouse','Regional','Knotted Cords at the Qollqa','Quipucamayoc keepers audit mountain freeze-dried potato stores with dyed cotton knots.','cont_americas',[
  ['Replenish highland emergency qollqa granaries',110,{food:75,stability:7,trust:8}],
  ['Cross-audit regional knot strings for exact tax equity',40,{legitimacy:7,credit:5}],
  ['Issue surplus dry rations directly to border guards',0,{supply:18,morale:4}]
 ]],
 ['reg_amer_confed_wampum_belt','Regional','Woven Belts Beneath the Pine','Longhouse speakers present fresh shell belts affirming mutual defense and border truces.','gov_confederation',[
  ['Confirm reciprocal hospitality belts cleanly in council',95,{loyalty:10,stability:7,trust:6}],
  ['Exchange prized copper and dried venison gifts',45,{loyalty:7,food:35,prestige:4}],
  ['Assert strict frontier tribute precedence',0,{prestige:7,loyalty:-5}]
 ]],
 ['reg_oce_outrigger_star_compass','Regional','Woven Mat Star Compass','Master navigators teach youths swell-patterns and zenith stars across deep blue lagoons.','cont_oceania',[
  ['Commission double-hulled ocean voyaging canoes',105,{credit:9,research:8,morale:7}],
  ['Sponsor seasonal swell-schooling inside outer reefs',45,{education:5,trust:7,research:4}],
  ['Concentrate fleets calmly along fertile lagoon banks',0,{food:45,stability:3}]
 ]],
 ['reg_india_vijayanagara_pageant','Regional','Ten-Day Royal Autumn Festival','Provincial nayakas parade caparisoned elephants and dancers before glowing pavilion steps.','faith_dharmic',[
  ['Patronize poets, temples, and musters in splendor',140,{prestige:12,loyalty:10,piety:8}],
  ['Focus pageant grants onto temple kitchens & grain relief',65,{food:50,trust:9,piety:7}],
  ['Trim festival purses cleanly toward frontier fortresses',0,{morale:7,gold:35}]
 ]],
 ['reg_islam_caravanserai_arch','Regional','Stone Arches One Day’s March Apart','Caravan masters request fortified overnight khans with stables, baths, and fresh cisterns.','faith_islamic',[
  ['Charter stone caravanserais cleanly along highway stages',125,{credit:11,trust:7,development:1}],
  ['Attach small mounted road watches at dry mountain inns',55,{securityMonths:9,credit:6}],
  ['Leave road hostelries to pious merchant endowments',0,{piety:4,gold:30}]
 ]],
 ['reg_trad_sacred_grove_keepers','Regional','Keepers of the Ancestral Grove','Elders invoke rain ancestors beneath ancient fig boughs ahead of spring planting.','faith_traditions',[
  ['Gift sacred bronze vessels, honey, and communal grain',95,{piety:10,trust:10,food:35}],
  ['Attend seasonal grove prayers humbly beside elders',30,{piety:7,stability:5}],
  ['Keep traditional offerings modest across households',0,{piety:4,food:15}]
 ]],
 ['reg_rep_customs_galley','Regional','Armed Galleys Against Corsairs','Merchant syndics offer half the timber if state arsenals fit bronze rams for spice convoys.','gov_republic',[
  ['Commission joint armed convoy galleys cleanly',130,{credit:11,morale:8,development:1}],
  ['Hire swift coastal cutters to patrol island narrows',55,{securityMonths:8,credit:6}],
  ['Bid skippers sail together in larger seasonal groups',0,{credit:3,gold:25}]
 ]],
 ['reg_trib_silk_envoy_horses','Regional','Tribute Horses & Imperial Silk','Outlying frontier envoys present spotted steeds hoping to depart clad in patterned damask bolts.','gov_tributary',[
  ['Return rich royal brocade and honorable court seals',120,{prestige:10,loyalty:8,acceptance:6}],
  ['Exchange prized warhorses fairly for steel harness gear',50,{morale:6,loyalty:5}],
  ['Measure tributary values strictly penny-for-penny',0,{gold:65,loyalty:-4}]
 ]],
 ['reg_city_dyer_guild_canal','Regional','Madder Vats Along the Town Mill','Clothiers dispute clean upstream water with tanners and leather curriers below town bridges.','gov_city',[
  ['Zone upstream stone sluices and waste drains cleanly',110,{development:1,trust:9,unrest:-7}],
  ['Mediate alternating river draw days between both guilds',40,{stability:6,credit:5,unrest:-3}],
  ['Fine both guilds cleanly for disorderly brawls',0,{gold:80,unrest:3}]
 ]],
 ['reg_reg_samanta_waterwheel','Regional','Persian Wheel on the River Terrace','Local grant-holders ask modest silver advances to erect geared ox-driven irrigation wheels.','gov_regional',[
  ['Co-fund rural waterworks with village elders',105,{food:65,loyalty:9,trust:8}],
  ['Supply wrought iron axles cleanly from royal smithies',45,{food:40,development:1}],
  ['Maintain traditional rain-fed revenue schedules',0,{gold:30}]
 ]]
];

function buildRegionalStories(E, C) {
 const out = [];
 const followups = [];
 for (const [id, cat, title, desc, trig, rawChoices] of BANK) {
  const folId = id + '_epilogue';
  const mapped = rawChoices.map((rc, idx) => C(rc[0], rc[1], rc[2], idx === 0 ? folId : null));
  out.push(E(id, cat, title, desc, trig, mapped));
  followups.push(E(folId, cat, `${title} — Provincial Echo`, `Governors and guild elders send word of lasting stability following "${title}".`, 'followup', [
   C('Extend protective crown charter statewide', 45, { trust: 6, legitimacy: 4, credit: 3 }),
   C('Reward diligent provincial bailiffs', 15, { loyalty: 5, stability: 4 }),
   C('File results calmly with district clerks', 0, { stability: 3 })
  ]));
 }

 // === BESPOKE CIVILIZATIONAL ARCS ACROSS ALL 8 CONTINENTS/TRADITIONS (3-4 CHOICES EACH) ===
 const civilizationalArcs = [
  ['reg_arc_eur_guild_hall', 'Regional', 'The Cloth-Weavers’ Bell Tower',
   'Prosperous Flemish-style townsmen petition for autonomous municipal courts to settle commercial credit swiftly without slow manor delays.',
   'cont_europe',
   [
    C('Grant chartered commercial courts with royal appellate seals', 120, { credit: 11, development: 1, legitimacy: 5 }, 'reg_arc_eur_fol'),
    C('Confirm guild arbitration cleanly inside fixed customs bounds', 55, { credit: 7, trust: 7 }),
    C('Retain traditional county baronial courts cleanly', 0, { loyalty: 7, unrest: 3 }),
    C('Sell temporary judicial exemptions for ready coin', 0, { gold: 105, trust: -4 })
   ],
   'reg_arc_eur_fol', 'Marble Steps Beneath the Guild Clock',
   'Cloth carts roll punctually past clear customs stamps while merchants invest surplus coin inside town walls.',
   [
    C('Endow civic granaries alongside guild warehouses', 50, { food: 45, trust: 7 }),
    C('Standardize brass weights at market gates', 25, { credit: 6 }),
    C('Collect annual charter fees cleanly', 0, { gold: 75 })
   ]
  ],
  ['reg_arc_islam_astrolabe', 'Regional', 'Tables of the Moving Stars',
   'Mathematicians in Cairo and Samarkand dispute tiny discrepancies in prayer-hour ephemerides, requesting fine brass astrolabes.',
   'faith_islamic',
   [
    C('Endow a joint Madrasa Astronomical Table project', 125, { research: 12, piety: 9, prestige: 8 }, 'reg_arc_islam_fol'),
    C('Purchase brass astrolabes cleanly for sea pilots and caravans', 65, { credit: 8, research: 6 }),
    C('Keep established calendar prayers politely unchanged', 0, { faithAuthority: 6, stability: 4 }),
    C('Tax foreign scholar caravans moderately', 0, { gold: 65 })
   ],
   'reg_arc_islam_fol', 'Inscribed Zij Spreads Along Caravans',
   'Travellers carry accurate tables linking longitude across oasis cities and Indian Ocean dhows alike.',
   [
    C('Present gilded copies to friendly courts', 40, { prestige: 8, acceptance: 5 }),
    C('Fund public timekeepers at main mosques', 30, { piety: 7, trust: 6 }),
    C('Deposit originals inside capital libraries', 0, { research: 5 })
   ]
  ],
  ['reg_arc_ind_spice_guild', 'Regional', 'Guilds of the Malabar Anchorages',
   'Nanadesi spice syndics propose building stone drydocks if the crown guarantees safe river barges from pepper hills to sea piers.',
   'faith_dharmic',
   [
    C('Dig river locks and issue gilded safe-conduct copper plates', 130, { credit: 12, development: 1, trust: 8 }, 'reg_arc_ind_fol'),
    C('Escort upland pack-ox trains cleanly with garrison scouts', 65, { credit: 7, morale: 5 }),
    C('Raise flat export tariffs cleanly at port customs', 0, { gold: 110, credit: -2 }),
    C('Reserve spice monopolies strictly for palace agents', 30, { legitimacy: 5, unrest: 4 })
   ],
   'reg_arc_ind_fol', 'Copper-Plate Grants Honored Along the Coast',
   'Arab, Chinese, and local ships ride gently beside busy stone wharves before seasonal monsoons turn.',
   [
    C('Endow freshwater wells for visiting crews', 35, { trust: 8, acceptance: 6 }),
    C('Mint clean fractional silver trade coin', 45, { credit: 8, inflation: -1 }),
    C('Inspect custom accounts quarterly', 0, { stability: 4 })
   ]
  ],
  ['reg_arc_chn_flood_dike', 'Regional', 'Yellow Silt Rising Against the Dikes',
   'County magistrates report swollen summer floodwaters nibbling earthen levees guarding forty thousand mu of irrigated paddies.',
   'cont_asia',
   [
    C('Mobilize paid stone-masons, willow fascines, and grain carts', 135, { food: 95, development: 1, trust: 11 }, 'reg_arc_chn_fol'),
    C('Coordinate corvee village repairs fairly with tax remissions', 60, { food: 55, unrest: -6, trust: 7 }),
    C('Order emergency evacuation to higher temple terraces', 15, { unrest: -3, stability: 5 }),
    C('Leave river dikes to provincial governors’ budgets', 0, { unrest: 8, food: -25 })
   ],
   'reg_arc_chn_fol', 'Green Shoots Survive the High Water',
   'Reinforced stone groynes hold steady through August squalls, sparing granaries and earning heartfelt villagers’ praise.',
   [
    C('Carve flood-gauge markers into bridge piers', 35, { research: 5, trust: 6 }),
    C('Stock nearby charity rice barns', 40, { food: 60, stability: 5 }),
    C('Promote diligent levee magistrates', 0, { legitimacy: 6 })
   ]
  ],
  ['reg_arc_afr_gold_weights', 'Regional', 'Brass Weights Shaped Like Lions',
   'Akan and Saharan traders disagree on standard bronze dust-weights at busy forest edge exchanges.',
   'cont_africa',
   [
    C('Cast uniform royal brass weights stamped with sovereign crests', 110, { credit: 12, legitimacy: 8, trust: 7 }, 'reg_arc_afr_fol'),
    C('Recognize balanced elders’ scales from both caravan parties', 45, { acceptance: 9, credit: 6 }),
    C('Require customs clerks to assay every bar personally', 25, { securityMonths: 7, gold: 50 }),
    C('Impose royal scale fees without altering weights', 0, { gold: 75 })
   ],
   'reg_arc_afr_fol', 'Clear Dust-Scales Beneath Baobab Shade',
   'Forest weavers, smiths, and desert salt guides conclude swifter trades without bitter weigh-house quarrels.',
   [
    C('Expand shaded timber market stalls', 40, { development: 1, trust: 6 }),
    C('Train apprentice scale keepers', 25, { credit: 6, research: 3 }),
    C('Verify winter caravan ledgers', 0, { stability: 4 })
   ]
  ],
  ['reg_arc_amer_terrace_frost', 'Regional', 'White Frost Above the Maize Terraces',
   'Early mountain winds threaten tender shoots on high-altitude terraces unless communal smoke-braziers and stone windbreaks go up tonight.',
   'cont_americas',
   [
    C('Mobilize communal mita labor with abundant chicha and maize', 100, { food: 85, trust: 10, loyalty: 7 }, 'reg_arc_amer_fol'),
    C('Open lower-valley reserve stores early to spare anxiety', 55, { food: 40, unrest: -7, stability: 5 }),
    C('Rely on hardy freeze-dried chuno processing right after frost', 0, { food: 50, trust: 4 }),
    C('Hold ceremonial dawn chants honoring mountain spirits', 20, { piety: 8, stability: 4 })
   ],
   'reg_arc_amer_fol', 'Stone Terraces Bask in Returning Sun',
   'Insulated stone retaining walls radiate gentle warmth overnight, saving seed corn for spring planting.',
   [
    C('Extend dry-stone terracing into adjacent ravines', 55, { development: 1, food: 60 }),
    C('Gift woven wool cloaks to diligent builders', 25, { trust: 6, loyalty: 5 }),
    C('Update knotted storehouse counts cleanly', 0, { legitimacy: 4 })
   ]
  ],
  ['reg_arc_oce_lagoon_pact', 'Regional', 'Conch Horns Across the Reef Passage',
   'Rival island houses dispute net-fishing rights inside deep coral channels ahead of seasonal bonito runs.',
   'cont_oceania',
   [
    C('Host a joint bonito feast and rotate reef sanctuaries cleanly', 85, { food: 65, loyalty: 10, trust: 9 }, 'reg_arc_oce_fol'),
    C('Chart fair boundary stakes separating outer & inner traps', 35, { stability: 7, food: 35 }),
    C('Award chief houses ceremonial precedence on opening dawn', 0, { prestige: 7, loyalty: 4 }),
    C('Maintain strict sacred tapu closures until elders signal', 0, { piety: 8, trust: 5 })
   ],
   'reg_arc_oce_fol', 'Full Canoes Return Before Sunset',
   'Preserved reef spawning beds yield glistening baskets cleanly distributed across every coastal village.',
   [
    C('Salt and smoke surplus catch for dry months', 30, { food: 55, stability: 4 }),
    C('Carve commemorative canoe prows cleanly', 25, { prestige: 6 }),
    C('Bless returning navigators humbly', 0, { piety: 5 })
   ]
  ]
 ];

 for (const [id, cat, title, desc, trig, ch, fid, ftitle, fdesc, fch] of civilizationalArcs) {
  out.push(E(id, cat, title, desc, trig, ch));
  followups.push(E(fid, cat, ftitle, fdesc, 'followup', fch));
 }

 return [...out, ...followups];
}

export function regionalGlobalEvents(E, C) {
 return buildRegionalStories(E, C);
}
