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
 for (const [id, cat, title, desc, trig, cost, eff, cd] of MANDATE_TEMPLATES) {
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
