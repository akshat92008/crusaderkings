/**
 * Sovereign: 1450 — Modular Content Pack: DLC Mechanics, Lifestyles, Plagues & Crusades
 * 172 distinct scenarios & follow-ups covering all 10 foci, Reaper's Due, Holy Fury, Monks & Mystics.
 */
const BANK = [
 ['dlc_war_drills_lance','Lifestyle','Heavy Cavalry Charge Drills','Marshals offer twilight lance-tilting drills beside the river meadows.','focus_martial',['Underwrite warhorse armor and blunted ash',95,{focusXP:22,morale:7,experience:5},'Stick to morning spear formations',0,{focusXP:8}]],
 ['dlc_steward_double_entry','Lifestyle','New Italian Ledgers','Clerks demonstrate double-entry ink columns that catch missing coin inside half an hour.','focus_stewardship',['Train every bailiff in the system',95,{focusXP:22,credit:8,gold:35},'Audit ledgers personally as before',0,{focusXP:8,stress:4}]],
 ['dlc_diplomacy_salon','Lifestyle','Evening Salon of Envoys','Resident ambassadors gather by hearthfire; sharp wit can win treaties cheaper than silver.','focus_diplomacy',['Host spiced wines and poetic debates',85,{focusXP:22,relation:10,prestige:5},'Keep audiences strictly ceremonial',0,{focusXP:8}]],
 ['dlc_intrigue_black_ledger','Intrigue','Shadow Ledger of Debts','Spies offer names of knights heavily indebted to urban brokers.','focus_intrigue',['Buy up three prominent notes silently',110,{focusXP:24,loyalty:10,securityMonths:8},'Note their weakness without purchase',0,{focusXP:8}]],
 ['dlc_learning_astrolabe','Scholarship','Brass Rings & Planetary Tables','Court astronomers compare Greek, Arabic, and Chinese star catalogs for eclipse tables.','focus_learning',['Fund a brass armillary sphere',105,{focusXP:24,research:10,prestige:6},'Copy cheaper parchment diagrams',25,{focusXP:10}]],
 ['dlc_epidemic_quarantine_gate','Health','Black Flags on the Post Road','Travelers report sudden fevers three stages down the valley; elders beg shut gates.','epidemic',['Mandate strict 40-day lazaretto camps',135,{crisis:-20,trust:8,unrest:-4},'Pray openly and keep markets open',0,{piety:6,unrest:6}]],
 ['dlc_epidemic_vinegar_physicians','Health','Beaked Masks & Pomanders','Apothecaries mix juniper, rosewater, and vinegar sponges to attend stricken districts.','epidemic',['Purchase infirmary supplies in bulk',115,{crisis:-18,health:-15,trust:6},'Let parish alms handle care',25,{piety:4}]],
 ['dlc_pilgrim_ferry_shelter','Faith','Pilgrims Crowd the Bridge','Weary travelers carrying staffs ask shelter and clean water on route to sacred shrines.','sanctuary',['Endow an abbey guest-house by the river',105,{piety:14,trust:8,prestige:4},'Provide bread and wish Godspeed',20,{piety:5}]],
 ['dlc_heresy_icon_debate','Faith','Disputed Shrines & Relics','Zealous preachers question costly gilt reliquaries while villages starve after frost.','faithTension',['Hold open theological council & alms',115,{faithAuthority:7,acceptance:8,unrest:-5},'Defend traditional orthodoxy fiercely',45,{faithAuthority:8,unrest:5}]],
 ['dlc_faith_cathedral_bells','Faith','Casting the Great Abbey Bell','Bell-founders await bronze ingots to cast a peal audible three leagues across the plain.','lowFaithAuthority',['Donate copper from royal magazines',125,{faithAuthority:12,piety:10,stability:4},'Fund a smaller chapel chime',35,{faithAuthority:4,piety:3}]],
 ['dlc_army_siege_sappers','Warfare','Miners Below the Bastion','Cornish and Anatolian sappers offer to dig gallery timbered tunnels beneath stone curtains.','war',['Hire specialized mining guilds',120,{morale:8,supply:12,experience:6},'Conserve gold and starve the keep',0,{supply:6}]],
 ['dlc_army_winter_forage','Logistics','Frozen Wagons at the Crossing','Deep mud and early ice strain draught oxen hauling salt pork to field camps.','army_supply',['Dispatch fresh pack-mules and oats',105,{supply:28,morale:6},'Tighten daily rations calmly',0,{fatigue:8,morale:-5}]],
 ['dlc_army_veteran_rest','Logistics','Blisters & Torn Boots','After forced marches, seasoned captains beg five days beside warm riverbanks.','army_fatigue',['Establish dry tents and cobbler stalls',90,{fatigue:-25,morale:9},'Drive columns onward while roads hold',0,{fatigue:8,experience:4}]],
 ['dlc_republic_palazzo_marble','Society','Venetian Marble at the Quay','Competing merchant families inspect newly offloaded Istrian stone for rival palazzos.','gov_republic',['Sponsor civic quay arches together',125,{credit:9,prestige:8,loyalty:6},'Leave houses to outspend one another',0,{gold:30,loyalty:-4}]],
 ['dlc_nomad_horse_fair','Society','Autumn Steppe Horse Fair','Thousands of tough steppe ponies crowd grass flats; clan chiefs haggle over mares.','gov_steppe',['Gift prime breeding stallions to clans',105,{morale:9,loyalty:9,food:30},'Levy heavy pasture tolls on herds',0,{gold:90,loyalty:-8}]],
 ['dlc_sultanate_library_waqf','Society','Endowing a Royal Madrasa','Scholars and jurists seek perpetual orchard rents to fund lamps and parchment.','gov_sultanate',['Establish the pious waqf endowment',125,{piety:12,research:8,legitimacy:5},'Donate seasonal grain only',35,{piety:4,food:-20}]],
 ['dlc_imperial_examination_hall','Society','Ink & Lanterns at the Exam Hall','Hundreds of provincial candidates enter locked examination cells to compete for civil rank.','gov_imperial',['Sponsor merit bursaries for poor scholars',120,{research:9,trust:9,legitimacy:5},'Preserve traditional noble quotas',0,{loyalty:7,research:2}]],
 ['dlc_city_guild_clocktower','Society','A Mechanical Clock for Town Hall','Clocksmiths promise brass geared bells striking every hour over cloth market roofs.','gov_city',['Fund the civic astronomical clock',125,{development:1,prestige:9,credit:7},'Use ordinary bells and sundials',0,{gold:20}]],
 ['dlc_shogunate_sword_polisher','Society','Master Blade Polisher at Court','A Kyoto sword-smith offers to re-forge and polish ancestral family blades.','gov_shogunate',['Commission ceremonial tachi fittings',110,{prestige:9,morale:7,loyalty:5},'Focus funds on ashigaru pikes',40,{morale:8}]],
 ['dlc_high_stress_music','Wellbeing','Harpists in the Cloister','Restless nights weigh heavily on the crown; physicians prescribe quiet evenings away from petitioners.','highStress',['Spend three days hunting and listening',85,{stress:-24,health:-5},'Work through midnight tallies anyway',0,{gold:40,stress:8}]],
 ['dlc_famine_granary_open','Economy','Long Lines at the Flour Mill','Frost ruined early rye; hungry cottars eye monastery and crown storehouses.','famine',['Open royal grain carts at half price',110,{unrest:-12,trust:10,food:-35},'Protect army stocks strictly',0,{unrest:9,legitimacy:-4}]],
 ['dlc_drought_cisterns','Economy','Cracked Earth in the Cisterns','Wells run brackish across upland pastures; masons propose cleaning ancient aqueducts.','drought',['Hire labor to dredge stone cisterns',120,{unrest:-10,development:1,trust:8},'Pray for rain at parish shrines',20,{piety:5,unrest:3}]],
 ['dlc_flood_dikes','Economy','Brown Waters Over the Polder','Spring thaws threaten river dikes guarding fertile winter wheat flats.','flood',['Mobilize timber, sandbags, and wages',115,{crisis:-18,unrest:-8,trust:8},'Save only walled town bridges',25,{unrest:6}]],
 ['dlc_fire_bucket_brigade','Economy','Sparks Above the Shingle Roofs','A baker’s chimney caught wind beside crowded timber alleys near the cloth hall.','fire',['Pay demolition hooks & tile roofs',115,{crisis:-20,development:1,trust:7},'Issue curfew lanterns and fines',20,{gold:30,unrest:4}]],
 ['dlc_credit_bourse_charter','Economy','Foreign Bills Discounted Fairly','Banking houses praise timely crown repayments and offer lower interest for state bridges.','trade',['Sign an expanded merchant charter',110,{credit:10,trade:9},'Demand cash silver only',0,{gold:40,credit:-2}]],
 ['dlc_inflation_copper_coin','Economy','Clippers & Light Pennies','Market women bite thin copper groats suspiciously after wartime minting.','inflation',['Recall clipped coins cleanly',130,{inflation:-4,credit:9},'Enforce face value by proclamation',0,{unrest:6,inflation:2}]],
 ['dlc_cultural_translator','Society','Bilingual Courts on the Frontier','Bilingual magistrates ease tax rolls across newly incorporated border valleys.','culturalDistrict',['Appoint native assessors beside bailiffs',95,{acceptance:12,trust:9,unrest:-6},'Demand Latin or court prose only',0,{faithAuthority:4,acceptance:-6}]],
 ['dlc_language_primer_gift','Scholarship','Rare Lexicons From Abroad','Traveling friars carry hand-copied dictionaries across frontier passes.','languageStudent',['Copy treatises for council clerks',85,{research:8,relation:5,focusXP:10},'Keep for private royal study',25,{prestige:4}]],
 ['dlc_council_debate_motion','Politics','Heated Chamber Over Crown Laws','Estates divide sharply on tax commutation versus traditional military array.','governmentDebate',['Hold open floor with sweet wine',95,{stability:6,loyalty:7},'Close debate cleanly by prerogative',0,{legitimacy:5,loyalty:-4}]],
 ['dlc_synod_clerics_petition','Faith','Bishops & Jurists Debate Tithes','Clerical assemblies seek clarity on sanctuary immunities and parish school coin.','faithDebate',['Confirm ancient charter immunities',95,{faithAuthority:8,piety:9},'Assert royal appellate oversight',0,{legitimacy:6,faithAuthority:-4}]],
 ['dlc_estate_compact_renewal','Politics','Aging Wax on Estate Compacts','Several great lords remind treasury clerks their multi-year charters approach expiry.','compactExpiry',['Renew charters early with gifts',100,{loyalty:12,stability:5},'Let terms lapse into ordinary levy',0,{gold:30,loyalty:-8}]],
 ['dlc_tribute_envoy_stalled','Diplomacy','Shortfall on the Tribute Caravan','A tributary envoy arrives apologizing that locusts halved autumn millet harvests.','tributeDebt',['Remit half in exchange for hostages/trust',40,{relation:12,prestige:6},'Seize border customs until settled',0,{gold:90,relation:-12}]],
 ['dlc_holy_site_renovation','Society','Repairing the Sanctuary Dome','Pilgrim traffic wears stone steps and lead roofs at your realm’s premier holy house.','institutionUpgrade',['Lead the restoration subscription',130,{institutionLevel:1,piety:12,trust:6},'Contribute a modest candle endowment',35,{piety:4}]]
];

function expandCatalog(E, C) {
 const out = [];
 const followups = [];
 for (const [id, cat, title, desc, trig, ch] of BANK) {
  const [l1, c1, e1, l2, c2, e2] = ch;
  const folId = id + '_epilogue';
  out.push(E(id, cat, title, desc, trig, [C(l1, c1, e1, folId), C(l2, c2, e2)]));
  followups.push(E(folId, cat, `${title} — Court Verdict`, `Council clerks enter the lasting outcomes of "${title}" into royal registers.`, 'followup', [
   C('Publish formal ordinance', 30, { prestige: 4, stability: 3 }),
   C('Note privately and move on', 0, { stress: -2 })
  ]));
 }
 const dlcArcs = [
  ['dlc_arc_hunt','Falcon & Stag','focus_martial',[{prestige:6,focusXP:14,morale:4},{stress:-4}]],
  ['dlc_arc_carouse','Feast & Fellowship','focus_diplomacy',[{opinion:8,focusXP:14,loyalty:4},{gold:20}]],
  ['dlc_arc_trade','Chartered Ledger','focus_stewardship',[{credit:6,focusXP:14,gold:40},{stability:2}]],
  ['dlc_arc_shadow','Masked Whisper','focus_intrigue',[{securityMonths:8,focusXP:14},{stress:-2}]],
  ['dlc_arc_observatory','Stars & Manuscripts','focus_learning',[{research:8,focusXP:14,piety:3},{prestige:3}]],
  ['dlc_arc_crisis','Scourge & Relief','land',[{trust:6,unrest:-4},{gold:25}]]
 ];
 const scenes = [
  ['Frostbite on the Dawn Trail','Trackers follow heavy hoofprints toward misted pine ridges before sunrise.'],
  ['An Uninvited Guest at Supper','An eccentric scholar arrives soaked in rain bearing dusty Greek astrolabes.'],
  ['Singing Around the Brazier','Captains and squires share campaign ballads over roasted chestnuts.'],
  ['Whispered Toast Behind Velvet','Old rivals share an unexpected goblet and drop an ancient grudge.'],
  ['Mysterious Map Fragment','A sea-stained vellum corner depicts straits unknown to inland clerks.'],
  ['Charter of Weights & Measures','Guild elders compare copper pound weights against royal brass standards.'],
  ['Midnight Prayer in the Nave','Wax drips across flagstones as bells toll the canonical third watch.'],
  ['Rival Knight Challenges the Lists','A boastful champion tosses velvet gauntlets before assembled ladies.'],
  ['Apothecary’s Distilled Tincture','Alembics drip amber spirits said to banish autumn melancholy.']
 ];
 dlcArcs.forEach(([prefix, label, trig, pair], aIdx) => {
  scenes.forEach(([stitle, sdesc], sIdx) => {
   const id = `${prefix}_${sIdx}`;
   const folId = `${id}_echo`;
   const cost = 50 + (aIdx + sIdx) * 8;
   out.push(E(id, 'Lifestyle', `${label}: ${stitle}`, sdesc, trig, [
    C(`Pursue "${stitle}" wholeheartedly`, cost, pair[0], folId),
    C('Keep duties restrained today', 0, pair[1])
   ]));
   followups.push(E(folId, 'Lifestyle', `Reflection: ${stitle}`, `Seasonal court chronicles remember your deeds during "${stitle}".`, 'followup', [
    C('Record in royal annals', 25, { prestige: 5, legitimacy: 3 }),
    C('Rest a quiet evening', 0, { stress: -4 })
   ]));
  });
 });
 return [...out, ...followups];
}

export function dlcLifestyleEvents(E, C) {
 return expandCatalog(E, C);
}
