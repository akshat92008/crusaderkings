/**
 * Sovereign: 1450 — Modular Content Pack: 148 Sovereign Mandates & Decisions
 * Gives rulers crisp, cooldown-bounded campaign levers across Politics, Economy,
 * Military, Faith, Family, Diplomacy, Society, Regions & Crossroads Eras.
 */
const MANDATE_TEMPLATES = [
 ['mnd_audit_salt_monopoly','Economy','Audit Royal Salt Magazines','Audit regional salt pans and standard storage bushels.','land',120,{gold:55,credit:4},24],
 ['mnd_road_milestones','Economy','Erect Stone Milestones & Waystations','Pave post junctions for swifter couriers and wagon teams.','land',150,{development:1,trust:5},36],
 ['mnd_royal_mint_standards','Economy','Certify Silver Fineness Punch','Stamp verified sterling dies across market mints.','inflation',165,{inflation:-3,credit:6},30],
 ['mnd_granary_seal_inspection','Economy','Inspect Emergency Reserve Granaries','Rotational airing and limewash protect grain from damp.','food',115,{food:65,unrest:-4},24],
 ['mnd_guild_weights_charter','Economy','Standardize Brass Market Weights','Quiet disputes between rural wool sellers and urban brokers.','trade',135,{credit:7,trust:6},24],
 ['mnd_harbor_dredge_gangs','Economy','Dredge Silted Harbour Bars','Keep shallow port channels open for deep spice carracks.','cont_europe',170,{development:1,credit:6},36],
 ['mnd_asian_canal_sluices','Economy','Repair River Lock & Canal Sluices','Keep southern grain barges moving swiftly before autumn frost.','cont_asia',165,{food:80,development:1},36],
 ['mnd_caravan_well_garrison','Economy','Patrol Trans-Saharan Wells','Station light camelry at vital caravan watering holes.','cont_africa',145,{trade:8,trust:5},30],
 ['mnd_terrace_waterworks','Economy','Maintain Mountain Terrace Canals','Protect steep high-altitude harvests from dry winds.','cont_americas',140,{food:75,development:1},30],
 ['mnd_cannon_powder_mill','Crossroads','Charter Royal Saltpeter Mill','Ensure reliable dry black powder barrels for artillery trains.','crossroads_gunpowder',175,{morale:8,experience:5},36],
 ['mnd_star_charts_bureau','Crossroads','Fund Bureau of Marine Charts','Collect pilot rutters and compass variations in one registry.','crossroads_oceanic',165,{research:10,credit:5},36],
 ['mnd_chancery_printing_press','Crossroads','Commission Royal Chancery Press','Print uniform edicts, tax rolls, and heraldic notices.','crossroads_press',170,{legitimacy:8,research:8},36],
 ['mnd_bourse_bill_clearing','Crossroads','Charter Sovereign Clearing House','Support foreign bills of exchange and reduce fiscal volatility.','crossroads_finance',190,{credit:10,inflation:-2},42],
 ['mnd_interpreter_college','Crossroads','Endow Global Embassy Interpreters','Prepare fluent translators for transoceanic and Eurasian envoys.','crossroads_contact',165,{relation:10,acceptance:8},36],
 ['mnd_reign_statue_square','Politics','Proclaim Reign Charter Tablet','Inscribe dynamic dynasty goals in public market arches.','reign_chapter',150,{legitimacy:7,prestige:8},36],
 ['mnd_patronize_chroniclers','Politics','Commission Realm Historical Annals','Ensure future generations recall your lineage’s achievements cleanly.','land',130,{prestige:7,legitimacy:5},30],
 ['mnd_heraldic_visitation','Politics','Hold Heraldic Visitation Court','Verify arms, genealogies, and knightly tenures across provinces.','land',140,{legitimacy:8,stability:3},36],
 ['mnd_circuit_justices','Politics','Dispatch Royal Circuit Magistrates','Bring impartial assizes directly to distant county courts.','lowstability',155,{stability:8,unrest:-7},24],
 ['mnd_vassal_fealty_banquet','Politics','Convene Vassal Fealty Supper','Share salt and wine personally with uneasy border barons.','disloyal',145,{loyalty:10,opinion:6},24],
 ['mnd_royal_pardon_amnesty','Politics','Issue Selective Autumn Amnesty','Clear minor poaching fines to ease bitter local unrest.','unrest',125,{unrest:-11,trust:7},24],
 ['mnd_privy_counter_spy','Intrigue','Rotate Palace Cipher Clerks','Freshen dispatch seals and test loyalty among messengers.','land',130,{securityMonths:9},24],
 ['mnd_intercept_mail_post','Intrigue','Audit Border Post Stations','Check courier sacks on sensitive strategic mountain roads.','activePlot',120,{plotPreparation:9,securityMonths:8},18],
 ['mnd_secret_ward_guards','Intrigue','Double Personal Chamber Guards','Quietly vet night watches inside the royal residential wing.','detectedPlot',135,{securityMonths:12,stability:3},24],
 ['mnd_counter_libel_press','Intrigue','Suppress Seditious Broadsides','Disrupt underground printers funded by restless claimants.','claimantFaction',140,{factionPressure:-10,legitimacy:5},24],
 ['mnd_vet_councillor_ledgers','Intrigue','Audit Council Retainers’ Purse','Prevent rival powers from quietly buying ministerial clerks.','councillor',125,{loyalty:6,securityMonths:8},24],
 ['mnd_scout_forage_wagons','Military','Issue Spare Iron Wagon Axles','Cut breakdowns along muddy siege supply routes.','army_supply',130,{supply:28,morale:4},18],
 ['mnd_winter_cloak_issue','Military','Distribute Heavy Felt Army Cloaks','Guard frontier pickets against damp autumn chills and fever.','army_fatigue',135,{fatigue:-22,morale:7},18],
 ['mnd_drill_archery_butts','Military','Mandate Parish Archery Sundays','Sharpen draw-weight and volley discipline across levies.','army',145,{morale:7,experience:7},24],
 ['mnd_veteran_hospital_camp','Military','Erect Field Infirmary Tents','Keep wounded men-at-arms fit instead of scattering to villages.','war',150,{morale:8,supply:14},24],
 ['mnd_border_signal_beacons','Military','Stock Pitch Fire-Beacons on Ridges','Warn shire musters hours earlier upon hostile raids.','hostile',125,{securityMonths:8,morale:5},24],
 ['mnd_endow_cathedral_choir','Faith','Endow Royal Chapel Choir','Elevate sacred liturgy and bind prelates to crown favor.','land',130,{piety:9,faithAuthority:5},30],
 ['mnd_repair_abbey_roof','Faith','Provide Lead for Sanctuary Roofs','Preserve damp cloister libraries from winter gales.','institutionUpgrade',155,{institutionLevel:1,piety:8},36],
 ['mnd_toleration_edicts','Faith','Publish Pluralist Neighborhood Charter','Soothe mixed-faith guild quarters after market disputes.','difference',135,{acceptance:10,unrest:-7},24],
 ['mnd_pilgrim_hostel_wells','Faith','Build Wells on Pilgrim Roads','Earn grateful blessings across every faith tradition.','sanctuary',140,{piety:11,trust:7},30],
 ['mnd_heir_tactical_tour','Family','Send Heir on Garrison Circuit','Let your successor inspect forts alongside seasoned captains.','adultHeir',145,{education:7,legitimacy:6,morale:4},30],
 ['mnd_ward_scholarly_stipend','Family','Hire Master Tutor for Nursery','Invest in languages, rhetoric, and statecraft primers early.','wardGuardian',120,{education:10,research:4},24],
 ['mnd_consort_patronage_fund','Family','Back Consort’s Cultural Salon','Turn domestic harmony into diplomatic charm and art.','married',130,{opinion:10,prestige:6,stress:-5},24],
 ['mnd_infirmary_apothecary','Family','Stock Fresh Distilled Medicines','Aid sickly kin and nobles cleanly during damp winters.','illness',125,{health:-22,trust:4},18],
 ['mnd_quiet_falcon_retreat','Family','Arrange Three-Day River Retreat','Restore clarity when council pressures build intolerably.','highStress',100,{stress:-24},18],
 ['mnd_ambassador_gift_horses','Diplomacy','Send Thoroughbreds to Allies','Keep foreign bonds vibrant with proud equestrian diplomacy.','friendly',150,{relation:14,prestige:6},24],
 ['mnd_border_commission_peace','Diplomacy','Convene Boundary Stone Parley','Defuse grazing and river toll frictions cleanly before swords draw.','neighbor',135,{relation:11,trust:5},24],
 ['mnd_truce_prisoner_exchange','Diplomacy','Smooth Noble Ransom Tariffs','Ease diplomatic thaw across battered frontier marches.','hostile',140,{relation:10,prestige:5},24]
];

const EXTRA_MANDATE_TEMPLATES = [
 // Government-specific royal mandates (13)
 ['mnd_c_gov_feudal_assize','Politics','Hold County Assize of Arms','Standardize knight-service rolls and scutage commutations cleanly.','gov_feudal',145,{loyalty:9,legitimacy:6},30],
 ['mnd_c_gov_republic_audit','Politics','Publish Loggia Treasury Audit','Open quarterly municipal receipts inside the civic arcade.','gov_republic',135,{credit:9,trust:8},30],
 ['mnd_c_gov_imperial_censors','Politics','Dispatch Touring Imperial Censors','Review provincial granary tallies and magistrate fairness directly.','gov_imperial',155,{legitimacy:9,securityMonths:8},30],
 ['mnd_c_gov_regional_compact','Politics','Confirm Provincial Charter Roll','Reaffirm regional custom rights alongside clear frontier duties.','gov_regional',140,{loyalty:10,stability:5},30],
 ['mnd_c_gov_sultanate_divan','Politics','Open Public Divan Petitions','Hear merchant and peasant grievances directly beneath palace arches.','gov_sultanate',135,{trust:10,legitimacy:6},30],
 ['mnd_c_gov_shogunate_tea','Politics','Host Retainer Tea Mediation','Cool rivalries between proud military houses over formal bowls.','gov_shogunate',140,{loyalty:10,stability:6},30],
 ['mnd_c_gov_steppe_kurultai','Politics','Convene Seasonal Banner Pasture Council','Allot winter valleys and horse relays fairly across clans.','gov_steppe',135,{loyalty:10,food:50},30],
 ['mnd_c_gov_centralized_post','Politics','Maintain Royal Relay Post-Inns','Keep salaried couriers riding briskly down paved trunk roads.','gov_centralized',150,{securityMonths:9,credit:7},30],
 ['mnd_c_gov_confed_diet','Politics','Host Confederated Canton Diet','Coordinate shared frontier militia funds and road tolls peacefully.','gov_confederation',135,{trust:9,stability:7},30],
 ['mnd_c_gov_military_barracks','Politics','Separate Garrison & Civic Courts','Preserve martial discipline without bruising urban artisan guilds.','gov_military',140,{trust:9,legitimacy:7},30],
 ['mnd_c_gov_city_conduit','Economy','Flush Urban Stone Water Conduits','Keep dense artisan alleys supplied with clean upland spring water.','gov_city',145,{development:1,trust:9},36],
 ['mnd_c_gov_kinship_potlatch','Society','Sponsor Inter-Lineage Gift Feast','Renew harmony across allied lineages with food and shared honors.','gov_kinship',130,{trust:10,loyalty:9},30],
 ['mnd_c_gov_tributary_gifts','Diplomacy','Send Imperial Counter-Gifts','Bind outer tributary houses closely through silk, tools, and honor.','gov_tributary',155,{loyalty:10,prestige:8},30],

 // Regional cultural & infrastructural mandates (25)
 ['mnd_c_reg_vijaya_tanks','Economy','Repair Granite Anicut Sluices','Dredge sacred reservoirs and irrigation cuts feeding royal valleys.','region_vijayanagara',155,{food:85,trust:9},36],
 ['mnd_c_reg_ottoman_defter','Politics','Update Rumeli & Anatolian Tahrir Rolls','Verify timar cavalry obligations and protect peasant tax ceilings.','region_ottomans',150,{legitimacy:9,loyalty:7},36],
 ['mnd_c_reg_ming_locks','Economy','Dredge Grand Canal Lock-Gates','Keep southern rice tribute junks gliding cleanly past silt bars.','region_ming',160,{food:90,development:1},36],
 ['mnd_c_reg_joseon_rain','Society','Inspect County Brass Rain-Gauges','Log rainfall tallies early to stage famine grain ahead of drought.','region_joseon',140,{research:9,food:55},30],
 ['mnd_c_reg_japan_sakai','Economy','Charter Sakai & Harbor Guild Scales','Regulate bronze coin conversions and coastal warehouse safety.','region_ashikaga',145,{credit:9,loyalty:6},30],
 ['mnd_c_reg_timurid_qanat','Economy','Clear Oasis Qanat Underground Channels','Preserve snowmelt stone conduits feeding Silk Road orchards.','region_timurids',150,{food:75,prestige:7},36],
 ['mnd_c_reg_france_bridges','Economy','Pave Royal Post-Road Stone Arches','Support heavy artillery trains and silk merchants across rivers.','region_france',155,{development:1,credit:8},36],
 ['mnd_c_reg_england_cloth','Economy','Seal Broadcloth Export Standards','Inspect dyed English woolens to fetch top prices in Antwerp.','region_england',145,{credit:9,trust:7},30],
 ['mnd_c_reg_imperial_peace','Politics','Enforce Imperial Land-Peace Courts','Curb robber-baron road tolls and protect free-city caravans.','region_imperial',155,{securityMonths:9,credit:8},36],
 ['mnd_c_reg_poland_vistula','Economy','Dredge Vistula Grain Barges','Keep rye rafts moving smoothly downriver toward Baltic ports.','region_poland',150,{food:75,credit:8},36],
 ['mnd_c_reg_muscovy_yam','Politics','Stock Winter Yam Sleigh Stations','Ensure fresh relay horses and dry hay along forest post-roads.','region_muscovy',145,{securityMonths:9,credit:7},30],
 ['mnd_c_reg_mamluk_nilometer','Economy','Maintain Roda Nilometer & Dikes','Prepare canal embankments cleanly ahead of annual Nile floods.','region_mamluks',155,{food:85,trust:8},36],
 ['mnd_c_reg_mali_salt','Economy','Guard Niger Salt-for-Gold Landings','Keep trans-Saharan salt bars and Wangara gold scales honest.','region_mali',145,{credit:10,trust:8},30],
 ['mnd_c_reg_ethiopia_stairs','Economy','Maintain Highland Stone Pass Steps','Keep salt-bar and frankincense mule trails clear across escarpments.','region_ethiopia',140,{credit:8,securityMonths:8},30],
 ['mnd_c_reg_mexica_dike','Economy','Inspect Lake Causeway Flood Sluices','Guard island gardens from seasonal storms while keeping canoes moving.','region_mexica',150,{food:80,development:1},36],
 ['mnd_c_reg_inca_quipu','Economy','Audit Mountain Qollqa Quipu Cords','Balance highland chuño potato reserves cleanly across ayllus.','region_inca',145,{food:85,legitimacy:7},30],
 ['mnd_c_reg_majapahit_jong','Military','Equip Strait Spice Escort Jongs','Shield archipelago rice and clove boats from strait rovers.','region_majapahit',155,{credit:10,securityMonths:8},36],
 ['mnd_c_reg_venice_arsenal','Economy','Stock Venetian Arsenal Timber Sheds','Cure Adriatic oak and hemp cordage for rapid galley assembly.','region_venice',160,{development:1,credit:10},36],
 ['mnd_c_reg_horde_paiza','Politics','Issue Golden Paiza Caravan Seals','Guarantee safe pasture crossings for long-distance silk caravans.','region_horde',145,{credit:9,loyalty:8},30],
 ['mnd_c_reg_portugal_astrolabe','Society','Standardize Solar Declination Tables','Guide oceanic caravels cleanly below equatorial stars.','region_portugal',150,{research:10,credit:9},36],
 ['mnd_c_reg_castile_mesta','Economy','Boundary-Mark Mesta Sheep Walks','Protect village wheat strips while keeping fine merino flocks moving.','region_castile',140,{food:55,credit:8},30],
 ['mnd_c_reg_delhi_sarai','Economy','Repair Highway Sarai Caravan Inns','Maintain clean wells and brick stables along Doab trunk roads.','region_delhi',145,{credit:9,trust:8},30],
 ['mnd_c_reg_gujarat_vav','Economy','Desilt Carved Stone Step-Wells','Secure cool water reserves for coastal dyeing villages and travelers.','region_gujarat',150,{food:70,trust:9},36],
 ['mnd_c_reg_malacca_code','Economy','Post Bilingual Strait Maritime Codes','Keep harbor anchorage weights and salvage laws transparent.','region_malacca',145,{credit:10,acceptance:9},30],
 ['mnd_c_reg_aragon_huerta','Economy','Support Valencian Water Tribunal','Preserve swift open-air orchard canal justice at cathedral doors.','region_aragon',140,{food:65,trust:9},30],

 // Faith, Scholarship & Society mandates (14)
 ['mnd_c_faith_dharmic_tank','Faith','Endow Temple Free-Kitchen Grain','Feed pilgrims and weavers alike at sacred step-tank commons.','faith_dharmic',135,{piety:10,trust:9},30],
 ['mnd_c_faith_islamic_waqf','Faith','Audit Charitable Madrasa Waqfs','Protect endowed bazaar shops funding jurists and hospitals.','faith_islamic',140,{piety:9,research:8},30],
 ['mnd_c_faith_christ_script','Faith','Preserve Damp Abbey Scriptoria','Supply dry cedar chests and copyist lamps for ancient chronicles.','faith_christian',140,{piety:9,research:8},30],
 ['mnd_c_faith_trad_groves','Faith','Protect Ancestral Sacred Groves','Shield old-growth groves and medicinal springs from clear-cutting.','faith_traditions',125,{piety:10,acceptance:8},30],
 ['mnd_c_soc_midwife_guild','Society','Charter Parish Midwife Training','Spread boiled-linen hygiene and herbal birth manuals across wards.','epidemic',135,{crisis:-16,research:7},24],
 ['mnd_c_soc_fire_hooks','Society','Equip Parish Fire-Hooks & Cisterns','Keep brick fire-lanes and leather water buckets ready at bells.','fire',130,{crisis:-16,trust:8},24],
 ['mnd_c_soc_flood_fascines','Society','Stock Willow Dike-Repair Fascines','Prepare emergency turf and timber mats before spring tides crest.','flood',135,{crisis:-16,food:40},24],
 ['mnd_c_soc_drought_seed','Society','Advance Hardy Millet Seed Chests','Protect next season sowing when early rains arrive late.','drought',140,{crisis:-16,grain:18},24],
 ['mnd_c_soc_famine_ovens','Society','Open Subsidized Abbey Bread Ovens','Keep honest penny loaves warm for hungry rural laborers.','famine',150,{crisis:-18,food:75},24],
 ['mnd_c_soc_plague_soap','Society','Distribute Free Olive-Potash Soap','Support clean hospital linen and street sanitation during outbreaks.','crisis',130,{crisis:-15,trust:8},24],
 ['mnd_c_soc_urban_drains','Society','Flush Market Cobble Gutters','Hire night scavengers and clear brick street drains cleanly.','lowtrust',135,{trust:11,development:1},36],
 ['mnd_c_soc_civic_school','Society','Fund Parish Grammar & Slate Grants','Teach honest arithmetic and clear reading to artisan youths.','research',145,{research:12,trust:7},30],
 ['mnd_c_soc_interfaith_well','Society','Build Shared District Cisterns','Bind diverse neighborhoods together through shared clean water.','difference',135,{acceptance:11,trust:9},30],
 ['mnd_c_soc_print_almanac','Crossroads','Sponsor Printed Farming Almanacs','Share verified planting dates, market weights, and tide charts.','crossroads_press',140,{research:10,food:50},30],

 // Economy, Minting & Banking mandates (12)
 ['mnd_c_econ_trial_pyx','Economy','Hold Public Trial of the Pyx','Test random minted coins in open court to anchor silver confidence.','inflation',145,{inflation:-4,credit:9},30],
 ['mnd_c_econ_charity_pawn','Economy','Endow Civic Low-Fee Loan Chest','Rescue artisan tools from predatory alley loan-sharks cleanly.','debt',150,{credit:10,trust:9},30],
 ['mnd_c_econ_double_entry','Economy','Train Exchequer Double-Entry Clerks','Adopt twin-column accounting across customs and mint desks.','trade',145,{credit:10,research:7},36],
 ['mnd_c_econ_spice_garble','Economy','Swear Royal Spice Garblers','Sieve export pepper and saffron chests to protect port premiums.','trade',135,{credit:9,trust:8},30],
 ['mnd_c_econ_paper_mill','Economy','License Water-Driven Paper Mills','Produce crisp watermarked rag paper for courts and schools.','land',155,{development:1,research:8},36],
 ['mnd_c_econ_wind_mill','Economy','Erect Ridge-Top Post Windmills','Keep flour grinding smoothly even when winter ice locks brooks.','food',150,{food:80,tools:14},36],
 ['mnd_c_econ_canal_lock','Economy','Maintain Inland Pound-Locks','Cut haulage costs for heavy coal, stone, and grain barges.','land',160,{development:1,credit:9},36],
 ['mnd_c_econ_mine_pumps','Economy','Upgrade Copper & Tin Adit Pumps','Keep rich lower ore galleries dry through wet winters.','land',155,{tools:22,development:1},36],
 ['mnd_c_econ_marine_ins','Crossroads','Underwrite Marine Cargo Policies','Spread storm risks cleanly so winter fleets keep sailing.','crossroads_finance',160,{credit:12,research:7},36],
 ['mnd_c_econ_columbian_crop','Crossroads','Establish Experimental Crop Gardens','Trial hardy maize and tuber crops across sandy and hill parishes.','crossroads_contact',145,{food:85,research:9},36],
 ['mnd_c_econ_harbor_light','Crossroads','Maintain Headland Reef Lighthouses','Keep whale-oil lamps and copper reflectors shining past shoals.','crossroads_oceanic',155,{credit:10,securityMonths:8},36],
 ['mnd_c_econ_nitre_sheds','Crossroads','Build Covered State Nitre-Beds','Produce clean saltpeter without digging up farmers’ stable floors.','crossroads_gunpowder',155,{research:9,trust:8},36],

 // Military, Logistics & Diplomacy mandates (16)
 ['mnd_c_mil_mobile_ovens','Military','Deploy Brick Field-Bakery Wagons','Keep warm dry biscuit loaves moving behind vanguard banners.','army_supply',135,{supply:28,morale:6},24],
 ['mnd_c_mil_saltpeter_dry','Military','Issue Copper-Lined Powder Chests','Guard corned black powder from damp rain during long marches.','army_supply',140,{supply:26,experience:0.06},24],
 ['mnd_c_mil_clean_wells','Military','Enforce Camp Latrine & Well Rules','Keep bivouac springs pure to stop bloody flux before battles.','army_fatigue',130,{fatigue:-22,morale:7},24],
 ['mnd_c_mil_farrier_team','Military','Attach Master Farrier Wagons','Protect cavalry hooves and check saddle sores nightly on march.','army_fatigue',135,{fatigue:-20,supply:14},24],
 ['mnd_c_mil_pike_drill','Military','Drill Combined Pike-and-Shot Squares','Coordinate ash pikes cleanly alongside matchlock and crossbow volleys.','army',150,{experience:0.09,morale:8},30],
 ['mnd_c_mil_sapper_corps','Military','Train Royal Counter-Mine Sappers','Equip pioneers with listening basins and timber gallery frames.','army',145,{experience:0.08,securityMonths:6},30],
 ['mnd_c_mil_veteran_hall','Military','Grant Veteran Gatekeeper Stipends','Honor scarred bowmen and pikemen so recruits trust the banner.','war',145,{morale:10,prestige:8},30],
 ['mnd_c_mil_prisoner_cartel','Diplomacy','Sign Humane Prisoner Cartel','Settle fair rank-for-rank captive exchanges across borders.','war',135,{relation:12,stability:6},30],
 ['mnd_c_dip_boundary_stone','Diplomacy','Sponsor Joint Boundary Survey','Settle disputed watershed cairns peacefully with brass chains.','neighbor',140,{relation:12,legitimacy:6},30],
 ['mnd_c_dip_herring_peace','Diplomacy','Confirm Shared Coastal Fishery Pact','Prevent net-boat clashes across seasonal herring banks.','neighbor',135,{relation:11,food:45},30],
 ['mnd_c_dip_courier_escort','Diplomacy','Guarantee Foreign Envoy Passports','Ensure unbroken wax seals and safe post-roads for neighbor heralds.','hostile',135,{relation:13,securityMonths:7},30],
 ['mnd_c_dip_ransom_broker','Diplomacy','Fund Cross-Border Ransom Clearing','Return captive yeomen cleanly once hostilities cool.','hostile',145,{relation:12,prestige:7},30],
 ['mnd_c_dip_scholar_exchange','Diplomacy','Host Friendly Observatory Exchange','Share star charts and clockwork gifts with allied capitals.','friendly',150,{relation:14,research:8},36],
 ['mnd_c_dip_tribute_restruct','Diplomacy','Restructure Tribute in Grain & Timber','Ease temporary frontier hardship without surrendering suzerainty.','tributeDebt',130,{relation:13,food:45},30],
 ['mnd_c_fam_consort_garden','Family','Cultivate Royal Herbal & Rose Court','Provide a peaceful walled garden retreat inside palace wings.','married',130,{opinion:14,stress:-12},30],
 ['mnd_c_fam_heir_circuit','Family','Send Adult Heir on Assize Circuit','Season your successor in real county ledgers and humble justice.','adultHeir',145,{education:12,legitimacy:7},30]
];

const SERIES_TOPICS = [
 ['Fiscal & Market Charters','Economy','land',[{credit:5,gold:40},{trust:4}],'Commission local charter'],
 ['Frontier & Levy Logistics','Military','army',[{morale:6,experience:4},{supply:15}],'Authorize drill & stores'],
 ['Privy Security & Diplomacy','Politics','land',[{stability:5,legitimacy:4},{securityMonths:6}],'Publish sovereign writ'],
 ['Scholarship, Guilds & Faith','Society','land',[{research:5,piety:5},{acceptance:5}],'Patronize civic circle'],
 ['Dynasty, Focus & Wellbeing','Family','land',[{prestige:5,stress:-6},{trust:4}],'Hold household observance']
];

const SUFFIXES = [
 'Weights Audit','Bridge Tolls','Chartered Fairs','Millstone Tariffs','Timber Reserves',
 'Iron Forges','Salt Storehouses','Wax Seal Custody','Courier Relays','Archive Indexing',
 'Winter Clothing','Dry Rations','Saddle Inspection','Wagon Repairs','Signal Fires',
 'Bailiff Assizes','Parish Almshouses','Guild Apprenticeships','Quay Lighting','Water Conduits',
 'Heraldic Rolls','Court Etiquette','Observatory Lenses','Herbal Gardens','Copyist Stalls'
];

export function expandedMandates(D) {
 const out = [];
 const seen = new Set();
 for (const [id, cat, title, desc, trig, cost, eff, cd] of [...MANDATE_TEMPLATES, ...EXTRA_MANDATE_TEMPLATES]) {
  seen.add(id);
  out.push(D(id, cat, title, desc, trig, cost, eff, cd));
 }
 // Generate 110+ distinct structured regional/institutional mandates cleanly without duplicates
 SERIES_TOPICS.forEach(([group, cat, trig, effs, verb], gIdx) => {
  SUFFIXES.forEach((suf, sIdx) => {
   const id = `mnd_s_${gIdx}_${sIdx}`;
   if (seen.has(id)) return;
   seen.add(id);
   const cost = 95 + ((gIdx * 7 + sIdx * 11) % 85);
   const cd = 24 + ((sIdx % 3) * 6);
   const eff = sIdx % 2 === 0 ? effs[0] : effs[1];
   out.push(D(id, cat, `${verb}: ${suf}`, `${group} mandate focusing royal administration on ${suf.toLowerCase()}.`, trig, cost, eff, cd));
  });
 });
 return out;
}
