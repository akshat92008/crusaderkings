/**
 * Sovereign: 1450 — Modular Content Pack: Global Regions, Civilizations & Faith Traditions
 * 212 distinct regional events across Europe, Mediterranean/Islamic World, India, East Asia,
 * Steppe, Sub-Saharan Africa, the Americas, and Oceania.
 */
const BANK = [
 ['reg_eur_hansa_salt','Regional','Baltic Salt Fleet Charter','Hanseatic masters negotiate winter warehousing rights for preserved herring barrels.','cont_europe',['Grant quay booths for fair customs tolls',110,{trade:9,credit:7,food:25},'Favor native coastal skippers exclusively',0,{loyalty:5,unrest:-3}]],
 ['reg_eur_university_disputation','Regional','Scholastic Disputation at the Abbey','Masters in theology and canon law request royal license to print commentary theses.','cont_europe',['Endow chairs of rhetoric and law',125,{research:10,prestige:7,piety:5},'Restrict lectures to approved glosses',0,{faithAuthority:6,research:2}]],
 ['reg_eur_tournaments_heralds','Regional','Spring Pas d’Armes on the Meadow','Knights gather with painted pavilions to test armor and lineage heraldry.','gov_feudal',['Present silver spurs to the victor',120,{morale:8,prestige:9,loyalty:6},'Inspect musters without banquet cost',0,{morale:4}]],
 ['reg_eur_alpine_pass_toll','Regional','Snow-Cleared Wagon Road','Carters beg funds for timber snow-sheds and stone milestones across mountain passes.','cont_europe',['Pave the pass for bullion wagons',115,{trade:8,development:1,trust:6},'Collect normal pack-mule tolls',0,{gold:55}]],
 ['reg_asia_samarkand_tilework','Regional','Cobalt Glaze at the Madrasa','Persian tilemakers unveil luminous lapis domes honoring geometric astronomy.','faith_islamic',['Sponsor royal observatory commissions',130,{prestige:10,research:10,piety:6},'Reserve turquoise kiln funds calmly',25,{gold:30,piety:4}]],
 ['reg_asia_janissary_foundry','Regional','Bronze Culverts & Corps Drill','Veteran infantry commanders demonstrate disciplined salvo drills with heavy matchlocks.','gov_sultanate',['Fund enlarged corps arsenals',135,{morale:9,experience:8,prestige:6},'Hold ranks to traditional bows and sabers',0,{stability:4,loyalty:4}]],
 ['reg_asia_grand_canal_barges','Regional','Grain Barges on the Imperial Canal','Regional intendants report lock-gates jammed with silt below southern rice granaries.','gov_imperial',['Dredge locks with corvee stipends',125,{food:80,development:1,trust:8},'Divert barges by smaller creeks',20,{food:25,unrest:3}]],
 ['reg_asia_monsoon_tank_irrigation','Regional','Stone Reservoirs Before the Rains','Village elders petition for sluice repairs to catch southwest monsoon torrents before June.','faith_dharmic',['Rebuild granite anicut dams and channels',125,{food:75,development:1,trust:9},'Leave channel upkeep to local headmen',0,{unrest:4,gold:20}]],
 ['reg_asia_spice_entrept_duties','Regional','Junks and Dhows Crowd the Strait','Multilingual harbormasters request wider timber wharves for cloves, camphor, and pepper.','cont_asia',['Build stone godowns and lighthouse fires',130,{trade:11,credit:8,development:1},'Raise anchorage duties calmly',0,{gold:90,trade:-2}]],
 ['reg_asia_zen_tea_gathering','Regional','Porcelain Bowls & Quiet Tea','Military retainers debate alliance feuds over stoneware bowls inside bamboo pavilions.','gov_shogunate',['Patronize tea masters to calm rivals',100,{loyalty:10,stress:-9,prestige:6},'Keep retainers strictly at garrison drill',0,{morale:6}]],
 ['reg_steppe_kurultai_feast','Regional','Felt Yurts Raised for the Kurultai','Clan noyans ride three weeks with spare horses to weigh autumn grazing and raid routes.','gov_steppe',['Roast whole mares and settle grazing',120,{loyalty:12,morale:8,stability:5},'Exact tribute hostages quietly',20,{prestige:6,loyalty:-6}]],
 ['reg_afr_trans_saharan_well','Regional','Wells Along the Salt Trail','Tuareg guides warn that drifting dunes choked two crucial watering stages north of Taghaza.','cont_africa',['Pay stone-linings and armed well guards',120,{trade:10,credit:7,food:25},'Route caravans by longer eastern pans',0,{gold:40,unrest:3}]],
 ['reg_afr_timbuktu_manuscripts','Regional','Leather Cases of Gold & Ink','Scholars arrive along Niger floodwaters trading Moroccan salt for illuminated legal codices.','cont_africa',['Fund copyists and public mosque schools',115,{research:9,piety:9,prestige:7},'Tax scholarly caravan baggage briskly',0,{gold:80,research:2}]],
 ['reg_afr_swahili_coral_mosque','Regional','Coral Stone Wharves & Dhows','Monsoon winds swing northeast, crowding stone piers with Indian cottons and Sofala gold.','cont_africa',['Expand coral harbor piers and beacons',125,{trade:11,development:1,prestige:7},'Raise standard port tariffs',0,{gold:75}]],
 ['reg_afr_solomonic_rock_church','Regional','Monolithic Chapels in Highland Tufa','Deacons carve chanting chapels directly from red volcanic stone cliffs to shelter sacred relics.','faith_christian',['Sponsor stonecutters and liturgical chants',115,{piety:12,faithAuthority:9,legitimacy:5},'Keep parish churches to humble timber',25,{piety:4}]],
 ['reg_amer_chinampa_harvest','Regional','Floating Gardens on Lake Shallows','Engineered willow-and-silt beds yield triple harvests of maize, squash, and amaranth.','cont_americas',['Expand canal sluices & chinampa plots',115,{food:85,development:1,trust:8},'Direct canoe labor to palace stonework',20,{prestige:7,food:-10}]],
 ['reg_amer_quipu_storehouse','Regional','Knotted Cords at the Qollqa','Quipucamayoc keepers audit mountain freeze-dried potato stores with dyed cotton knots.','cont_americas',['Stock highland emergency qollqas',110,{food:70,stability:7,trust:7},'Transport grain directly to armies',20,{supply:18}]],
 ['reg_amer_confed_wampum_belt','Regional','Woven Belts Beneath the Pine','Longhouse speakers present fresh shell belts affirming mutual defense and border truces.','gov_confederation',['Confirm reciprocal hospitality belts',95,{loyalty:10,stability:6,relation:8},'Press harsher tribute terms',0,{prestige:6,loyalty:-6}]],
 ['reg_oce_outrigger_star_compass','Regional','Woven Mat Star Compass','Master navigators teach youths swell-patterns and zenith stars across deep blue lagoons.','cont_oceania',['Commission double-hulled ocean canoes',105,{trade:8,research:7,morale:7},'Keep fleets inside reef fishing banks',0,{food:40}]],
 ['reg_india_vijayanagara_pageant','Regional','Ten-Day Royal Autumn Festival','Provincial nayakas parade caparisoned elephants and dancers before glowing pavilion steps.','faith_dharmic',['Patronize poets, temples, and musters',140,{prestige:11,loyalty:10,piety:8},'Trim spectacle funds for border forts',30,{morale:6}]],
 ['reg_islam_caravanserai_arch','Regional','Stone Arches One Day’s March Apart','Caravan masters request fortified overnight khans with stables, baths, and fresh cisterns.','faith_islamic',['Charter chain of royal caravanserais',125,{trade:10,credit:7,trust:6},'Leave road inns to private merchants',0,{gold:30}]],
 ['reg_trad_sacred_grove_keepers','Regional','Keepers of the Ancestral Grove','Elders invoke rain ancestors beneath ancient fig boughs ahead of spring planting.','faith_traditions',['Gift sacred bronze vessels and cattle',95,{piety:10,trust:9,food:30},'Observe rites modestly with kin',15,{piety:4}]],
 ['reg_rep_customs_galley','Regional','Armed Galleys Against Corsairs','Merchant syndics offer half the timber if state arsenals fit bronze rams for spice convoys.','gov_republic',['Commission joint escort galleys',130,{trade:11,morale:7,credit:5},'Bid captains sail in larger seasonal groups',0,{trade:3,gold:20}]],
 ['reg_trib_silk_envoy_horses','Regional','Tribute Horses & Imperial Silk','Outlying frontier envoys present spotted steeds hoping to depart clad in patterned damask bolts.','gov_tributary',['Return double value in royal silk',120,{relation:14,prestige:9,loyalty:7},'Measure tribute strictly penny-for-penny',0,{gold:60,relation:-6}]],
 ['reg_city_dyer_guild_canal','Regional','Madder Vats Along the Town Mill','Clothiers dispute clean upstream water with tanners and leather curriers below town bridges.','gov_city',['Zone upstream basins and waste sluices',110,{development:1,trust:8,unrest:-6},'Fine both guilds equally for disorder',0,{gold:75,unrest:4}]],
 ['reg_reg_samanta_waterwheel','Regional','Persian Wheel on the River Terrace','Local grant-holders ask modest silver advances to erect geared ox-driven irrigation wheels.','gov_regional',['Co-fund rural waterworks cleanly',105,{food:60,loyalty:9,trust:7},'Maintain traditional rain-fed tax rolls',0,{gold:25}]]
];

function expandCatalog(E, C) {
 const out = [];
 const followups = [];
 for (const [id, cat, title, desc, trig, ch] of BANK) {
  const [l1, c1, e1, l2, c2, e2] = ch;
  const folId = id + '_epilogue';
  out.push(E(id, cat, title, desc, trig, [C(l1, c1, e1, folId), C(l2, c2, e2)]));
  followups.push(E(folId, cat, `${title} — Regional Report`, `Provincial governors confirm lasting effects from your decree on "${title}".`, 'followup', [
   C('Extend royal charter statewide', 45, { trust: 5, legitimacy: 4 }),
   C('Maintain local oversight', 0, { stability: 2 })
  ]));
 }
 const zones = [
  ['reg_zone_eur','Atlantic & Baltic','cont_europe',[{trade:6,prestige:5,development:1},{gold:30}]],
  ['reg_zone_med','Mediterranean Sea','cont_europe',[{trade:7,credit:5,morale:3},{gold:25}]],
  ['reg_zone_ind','Indian Ocean Rim','faith_dharmic',[{food:45,trust:6,piety:4},{gold:25}]],
  ['reg_zone_chn','East Asian Courts','cont_asia',[{research:6,legitimacy:5,trust:4},{gold:30}]],
  ['reg_zone_afr','African Gold & Nile','cont_africa',[{trade:7,prestige:6,piety:4},{food:30}]],
  ['reg_zone_amer','Highlands & Lagoons','cont_americas',[{food:55,loyalty:6,trust:5},{stability:3}]],
  ['reg_zone_stp','Eurasian Steppe','gov_steppe',[{morale:7,loyalty:7,food:25},{gold:35}]],
  ['reg_zone_isl','House of Wisdom','faith_islamic',[{research:7,piety:6,credit:4},{prestige:3}]]
 ];
 const flavors = [
  ['Monsoon & Tide Tables','Port masters update seasonal wind logs guiding richly laden merchant hulls.'],
  ['Caravan Inn Inspection','Road stewards repair stone cisterns and milestone pillars before dusty dry seasons.'],
  ['Provincial Bridge Charter','Timber and cut-granite tolls spark debate among carters and urban burgesses.'],
  ['Harvest Shrine Procession','Villagers weave marigold garlands and barley sheaves requesting royal grain blessings.'],
  ['Metallurgy at the Royal Forge','Smiths test high-carbon ore imports to temper crisp helm plates and plowshares.'],
  ['Civic Granary Accounting','Inspectors stamp moisture seals onto autumn grain bins to forestall winter blight.'],
  ['Scholarly Translation Circle','Bilingual scribes turn foreign astronomy and medicine rolls into clear court prose.'],
  ['Market Weights Dispute','Bakers and cloth-merchants bring rival bronze yardsticks before the municipal bailiff.'],
  ['Frontier Ferry Guard','Armed flatboats secure crossing stations against autumn brigands and toll cheats.'],
  ['Regional Fair Licensing','Minstrels, tinkers, and horse-dealers gather under three-day royal fair banners.']
 ];
 zones.forEach(([prefix, label, trig, pair], zIdx) => {
  flavors.forEach(([ftitle, fdesc], fIdx) => {
   const id = `${prefix}_${fIdx}`;
   const folId = `${id}_echo`;
   const cost = 60 + (zIdx + fIdx) * 7;
   out.push(E(id, 'Regional', `${label} — ${ftitle}`, fdesc, trig, [
    C(`Sponsor ${ftitle.toLowerCase()}`, cost, pair[0], folId),
    C('Leave custom to local elders', 0, pair[1])
   ]));
   followups.push(E(folId, 'Regional', `Provincial Gazette: ${ftitle}`, `Townsfolk and bailiffs celebrate the settled terms of "${ftitle}".`, 'followup', [
    C('Publish tax & guild immunity', 35, { trust: 5, credit: 4 }),
    C('File with district registry', 0, { stability: 3 })
   ]));
  });
 });
 return [...out, ...followups];
}

export function regionalGlobalEvents(E, C) {
 return expandCatalog(E, C);
}
