/**
 * Sovereign: 1450 — Modular Content Pack: Grand Chronicles, Empires, Faiths & Diplomacy
 * High-craft multi-choice narrative arcs & world scenarios (3-4 distinct choices each).
 */
export function grandChronicleEvents(E, C) {
 const out = [];
 const add = (id, cat, title, desc, trig, choices) => out.push(E(id, cat, title, desc, trig, choices));

 // === 1. IMPERIAL RESTORATIONS & CROWN CORONATION ARCS ===
 add('gc_imperial_eagle', 'Imperial & Heritage', 'Shattered Marble Eagle Beneath the Aqueduct',
  'Masons digging cistern footings unearth a gilt bronze Roman-era standard wrapped in rotting purple silk.',
  'land', [
   C('Parade the eagle before garrison banners and claim ancient heritage', 120, { prestige: 12, legitimacy: 10, morale: 5 }, 'gc_imperial_eagle_fol'),
   C('Donate the relic respectfully to the cathedral chapter museum', 40, { piety: 9, trust: 7, research: 5 }, 'gc_imperial_eagle_fol'),
   C('Melt worn gilt scraps cleanly for frontier silver coin', 0, { gold: 95, prestige: -2 }),
   C('Seal the dig silently lest rival princes mock imperial vanity', 0, { stability: 4, securityMonths: 6 })
  ]);
 add('gc_imperial_eagle_fol', 'Imperial & Heritage', 'Chroniclers Debate Ancient Bloodlines',
  'Poets and jurists present competing parchment genealogies linking your throne to storied empire-builders.',
  'followup', [
   C('Sponsor public chronicles praising constitutional continuity', 55, { legitimacy: 8, trust: 6 }),
   C('Commission classical victory medallions for loyal officers', 40, { prestige: 7, morale: 5 }),
   C('Keep ceremony dignified and restrained', 0, { stability: 4 })
  ]);

 add('gc_charlemagne_crown', 'Imperial & Heritage', 'The Iron Diadem Petition',
  'Archbishops discover an iron-ringed gold circlet forged inside a dusty abbey chest, inspiring barons to petition for solemn anointing.',
  'cont_europe', [
   C('Hold an extraordinary Cathedral Coronation before estates', 150, { legitimacy: 14, piety: 10, prestige: 11 }, 'gc_charlemagne_crown_fol'),
   C('Display the diadem politely beside ancestral relics without fanfare', 55, { prestige: 6, faithAuthority: 6 }),
   C('Audit abbey deeds first to ensure no forged tribute claims lurk inside', 35, { securityMonths: 9, legitimacy: 5 }),
   C('Leave ancient treasures peacefully inside abbey custody', 0, { trust: 5, piety: 4 })
  ]);
 add('gc_charlemagne_crown_fol', 'Imperial & Heritage', 'Tribute Envoys Gather Beneath Cathedral Vaults',
  'Foreign heralds whisper anxiously as cathedral bells toll acclaim across three river counties.',
  'followup', [
   C('Proclaim sweeping judicial amnesty on feudal arrears', 45, { loyalty: 10, unrest: -6 }),
   C('Enforce strict knightly muster rolls while prestige runs warm', 25, { morale: 7, legitimacy: 5 }),
   C('Receive estate oaths calmly in hall', 0, { stability: 4 })
  ]);

 add('gc_byzantine_refugee_scholars', 'Culture & Learning', 'Chest of Greek Manuscripts at the Gate',
  'Exiled Constantinopolitan calligraphers disembark carrying Plato commentaries, siege manuals, and purple-dyed gospel leaves.',
  'land', [
   C('Grant cushioned library quarters and salaried lecture chairs', 130, { research: 14, prestige: 9, acceptance: 7 }, 'gc_byzantine_refugee_fol'),
   C('Purchase only fortification & artillery treatises outright', 75, { morale: 6, experience: 0.07, research: 6 }),
   C('House clerks quietly inside cathedral guest hostels', 35, { piety: 7, trust: 5 }),
   C('Inspect unfamiliar scrolls strictly before admission', 0, { securityMonths: 6, faithAuthority: 4 })
  ]);
 add('gc_byzantine_refugee_fol', 'Culture & Learning', 'Students Crowd the New Grammar Hall',
  'Native apprentices copy Greek geometry diagrams alongside grey-bearded refugees, sparking sudden civic pride.',
  'followup', [
   C('Publish translated geometry tables cleanly for guild builders', 55, { development: 1, research: 8 }),
   C('Establish permanent translation fellowships', 40, { research: 7, prestige: 6 }),
   C('Thank elders and preserve originals in treasury vaults', 0, { legitimacy: 4 })
  ]);

 // === 2. HOLY ORDERS, FAITH COUNCILS & SCHISM DRAMA ===
 add('gc_militant_order_charter', 'Religion', 'Armored Hospitallers Request a Fortress',
  'A veteran religious knightly order offers to garrison mountain passes at bare bread-cost in return for toll immunity on road estates.',
  'land', [
   C('Grant mountain watchtowers and charitable hostel exemptions', 110, { morale: 9, piety: 10, unrest: -5 }, 'gc_order_charter_fol'),
   C('Attach native captains beside the knights under crown command', 60, { securityMonths: 9, morale: 6, legitimacy: 5 }),
   C('Limit knights purely to pilgrim infirmary work inside cities', 30, { trust: 8, health: -10, piety: 6 }),
   C('Decline autonomous armed orders inside royal borders', 0, { legitimacy: 7, stability: 4 })
  ]);
 add('gc_order_charter_fol', 'Religion', 'Pilgrims Pass Safely Through the Gorges',
  'White-crossed pennants flutter above misty crags as highway bandits scatter away from valley toll booths.',
  'followup', [
   C('Expand mountain grain depots serving both monks and drovers', 50, { food: 55, trust: 7 }),
   C('Honor the commander politely with silver spurs', 30, { prestige: 6, piety: 5 }),
   C('Audit frontier pass tolls quietly', 0, { credit: 5 })
  ]);

 add('gc_monastery_land_audit', 'Religion', 'Tax-Exempt Abbey Vineyards Spread Wide',
  'Provincial bailiffs complain rich wine villages deeded to pious houses last generation no longer pay royal road levies.',
  'institution', [
   C('Negotiate respectful voluntary defense contributions with abbots', 55, { gold: 95, piety: 4, legitimacy: 6 }, 'gc_abbey_audit_fol'),
   C('Reaffirm ancestral abbey charters in exchange for school stipends', 70, { research: 8, trust: 8, piety: 7 }),
   C('Rescind late unsealed exemptions cleanly through exchequer', 0, { gold: 135, faithAuthority: -4, loyalty: 4 }),
   C('Honor sacred immunities fully without disturbing prelates', 0, { piety: 11, faithAuthority: 7 })
  ]);
 add('gc_abbey_audit_fol', 'Religion', 'Cellar Keys and Parchment Tallies Aligned',
  'Monastic stewards welcome orderly audits that replace bitter parish gossip with clear mutual ledgers.',
  'followup', [
   C('Endow winter wine-rations for frontier infirmaries', 35, { trust: 7, morale: 4 }),
   C('Stamp new dual-seal immunity rolls cleanly', 20, { legitimacy: 5, faithAuthority: 4 }),
   C('Dismiss tax assessors swiftly', 0, { stability: 3 })
  ]);

 add('gc_mystic_preacher_crowd', 'Religion', 'Barefoot Preacher at the Market Cross',
  'An austere wandering ascetic draws thousands weeping at noon, denouncing silk robes, moneylenders, and lazy governors alike.',
  'unrest', [
   C('Meet the preacher humbly, adopt modest court dress, and clean corruption', 75, { unrest: -13, piety: 11, trust: 9 }, 'gc_mystic_fol'),
   C('Invite cathedral theologians to debate him politely in open porch', 40, { faithAuthority: 7, acceptance: 6, unrest: -5 }),
   C('Provide charitable bread carts while escorting crowds outside walls', 65, { food: -20, trust: 7, stability: 5 }),
   C('Detain fiery agitators silently before riots flare', 0, { securityMonths: 8, unrest: -4, piety: -4 })
  ]);
 add('gc_mystic_fol', 'Religion', 'Ashes Washed Clean After Rain',
  'Crowds disperse peacefully bearing plain barley loaves and singing hymns instead of eyeing merchant stalls.',
  'followup', [
   C('Fund honest town grain scales quietly', 45, { trust: 8, credit: 5 }),
   C('Confirm parish relief almoners', 25, { piety: 7, stability: 4 }),
   C('Maintain ordinary watch patrols', 0, { stability: 3 })
  ]);

 // === 3. DIPLOMATIC CRISES, HOSTAGES, MARRIAGES & ESPIONAGE ===
 add('gc_border_hostage_escape', 'Diplomacy', 'A Noble Hostage Bolts at Dawn',
  'An allied neighboring lord’s young son slipped past sleepy grooms overnight toward river ferries — crying mistreatment at home.',
  'friendly', [
   C('Ride personally to calm him and escort home honorably with gifts', 105, { relation: 15, prestige: 8, opinion: 8 }, 'gc_hostage_fol'),
   C('Notify his father discreetly before rumors spark border panic', 40, { relation: 9, securityMonths: 7 }),
   C('Offer the youth honorable sanctuary inside palace guard quarters', 70, { loyalty: 7, relation: -6, prestige: 5 }),
   C('Tighten stable locks and summon border marshals quietly', 0, { securityMonths: 9, relation: -4 })
  ]);
 add('gc_hostage_fol', 'Diplomacy', 'Letters Sealed Across the Frontier',
  'Allied envoys ride back praising royal restraint and mutual good faith between ruling houses.',
  'followup', [
   C('Exchange fine falcons to celebrate steady concord', 45, { relation: 8, prestige: 5 }),
   C('Review mutual highway escort pacts', 25, { credit: 6, stability: 4 }),
   C('Resume routine diplomatic seals', 0, { stability: 3 })
  ]);

 add('gc_merchant_caravan_plundered', 'Diplomacy', 'Burned Silk Carts Along the Border Ford',
  'Armed riders crossed out of rival hills during mist, scattering pepper sacks and cutting wagon traces before vanishing.',
  'hostile', [
   C('Demand swift silver compensation under frontier truce arbitration', 55, { relation: -4, gold: 90, legitimacy: 6 }, 'gc_caravan_fol'),
   C('Pay merchants from royal treasury while strengthening horse patrols', 110, { credit: 9, morale: 6, securityMonths: 8 }, 'gc_caravan_fol'),
   C('Issue sharp diplomatic letters threatening trade embargo', 0, { relation: -12, prestige: 6 }),
   C('Urge carters quietly to travel solely via coastal hulls', 0, { credit: 3, stability: 2 })
  ]);
 add('gc_caravan_fol', 'Diplomacy', 'Frontier Passes Cleared by Dusk',
  'Border outposts count double patrols along birch groves as freight mules resume cautious crossings.',
  'followup', [
   C('Erect a small stone toll-blockhouse cleanly at the ford', 75, { development: 1, securityMonths: 8 }),
   C('Compensate widow carters gently', 30, { trust: 8, piety: 4 }),
   C('Dismiss militia scouts cleanly', 0, { morale: 3 })
  ]);

 add('gc_shipwreck_treasure_claim', 'Diplomacy', 'Splintered Carrack Upon Foreign Shoals',
  'Winter gales drove an ally’s spice ship onto home sands; coastal villagers recovered chestloads of cloves and gilt mirrors.',
  'neighbor', [
   C('Return every salvaged chest cleanly, winning lasting gratitude', 65, { relation: 16, prestige: 10, credit: 6 }, 'gc_shipwreck_fol'),
   C('Award salvage fees to brave fishermen while returning spices', 35, { trust: 8, relation: 10 }),
   C('Claim royal wreck rights rigidly under ancient sea law', 0, { gold: 135, relation: -10 }),
   C('Leave unclaimed driftwood quietly to battered fishing hamlets', 0, { food: 35, unrest: -6, relation: -4 })
  ]);
 add('gc_shipwreck_fol', 'Diplomacy', 'Mariners Toast Honest Shores',
  'Port guildmasters abroad cite your fair salvage edict across Mediterranean and Baltic counting houses.',
  'followup', [
   C('Sign reciprocal lighthouse & salvage treaties cleanly', 45, { credit: 9, relation: 7 }),
   C('Reward courageous coastal rescue crews', 25, { trust: 7, morale: 4 }),
   C('Record admiralty statutes nicely', 0, { legitimacy: 4 })
  ]);

 // === 4. NATURAL WONDERS, DISASTERS & FAMINE ===
 add('gc_great_comet_sky', 'Wonders & Omens', 'Blazing Hair Across the Midnight Zenith',
  'A jagged golden comet cleaves winter constellations for twelve nights straight; astrologers quarrel furiously over whether it foretells conquest or blight.',
  'land', [
   C('Direct court astronomers to plot precise angular tables peacefully', 90, { research: 11, stability: 5, stress: -4 }, 'gc_comet_fol'),
   C('Lead pious processions blessing granaries and frontier harvests', 75, { piety: 11, trust: 8, unrest: -6 }, 'gc_comet_fol'),
   C('Proclaim the star an unmistakable sign of martial destiny', 40, { morale: 9, prestige: 8 }),
   C('Forbid street prophesying calmly before panic upsets markets', 0, { stability: 6, credit: 4 })
  ]);
 add('gc_comet_fol', 'Wonders & Omens', 'Clear Skies After the Tail Fades',
  'Chroniclers illuminate pale comet tails cleanly beside eclipse records without dread gripping farms.',
  'followup', [
   C('Bind sky-charts inside the capital library', 35, { research: 7, prestige: 5 }),
   C('Share winter bread doles calmly with poor widows', 30, { trust: 7, piety: 5 }),
   C('Return swiftly to spring ploughing schedules', 0, { food: 35 })
  ]);

 add('gc_great_frost_rivers', 'Disaster & Relief', 'Barge Channels Frozen Three Feet Deep',
  'Bitter January freezes lock grain rivers under solid grey ice, stranding timber carts and driving firewood prices sharply skyward.',
  'food', [
   C('Break ice barges cleanly and subsidize public woodyards & gruel', 120, { food: 95, unrest: -10, trust: 11 }, 'gc_frost_fol'),
   C('Open royal forest windfalls evenly for peasant fuel sledges', 45, { trust: 9, food: 40, development: 0 }),
   C('Cap urban coal and bread prices harshly by marshal edict', 0, { unrest: -5, credit: -4, legitimacy: 5 }),
   C('Ration palace hearths austerely to inspire quiet thrift', 0, { piety: 6, prestige: 4, stress: 3 })
  ]);
 add('gc_frost_fol', 'Disaster & Relief', 'Spring Thaw Splits the Ice Floes',
  'Roaring thaw sweeps jammed slabs downstream without breaching bridges, reopening timber barges to hungry suburbs.',
  'followup', [
   C('Inspect bridge piers promptly for ice scarring', 50, { development: 1, stability: 5 }),
   C('Restock municipal famine cellars cleanly', 60, { food: 80, trust: 6 }),
   C('Hold parish thanksgivings happily', 0, { piety: 5 })
  ]);

 add('gc_silver_vein_strike', 'Economy & Guilds', 'Bright Ore Beneath Old Granite',
  'Miners clearing collapsed drainage adits strike a startlingly clean seam of galena rich with silver.',
  'land', [
   C('Charter skilled guild engineers and share modest royalties', 110, { development: 1, credit: 10, gold: 130 }, 'gc_silver_fol'),
   C('Reserve the entire drift strictly under Royal Mint guards', 80, { gold: 165, securityMonths: 8, loyalty: -3 }),
   C('Invest first payouts directly into dry sluices and pit props', 65, { development: 1, trust: 8, inflation: -1 }),
   C('Auction seasonal extraction leases to foreign bankers', 0, { gold: 145, credit: 5, trust: -4 })
  ]);
 add('gc_silver_fol', 'Economy & Guilds', 'Smelters Glow Past Sunset',
  'Crisp silver ingots stamp briskly at mint houses, funding border repairs without raising rural hearth levies.',
  'followup', [
   C('Mint clean fractional market groats for petty trade', 45, { credit: 9, unrest: -5 }),
   C('Raise modest mountain watchtowers beside smelting works', 35, { securityMonths: 7, morale: 4 }),
   C('Store bullion cleanly against winter contingencies', 0, { stability: 5 })
  ]);

 // === 5. RICH HANDCRAFTED REALM, VASSAL, MILITARY & CHARACTER VIGNETTES (48+ FULL 3-CHOICE CHAINS) ===
 const vignettes = [
  ['gc_vassal_bridge_toll','Politics','Baron Levies Illegal River Chains','A provincial noble stretched iron chains beneath an old stone span, extracting heavy corn tolls from river barges.','disloyal',
   [C('Order marshals to smash chains and restore free passage',85,{trust:11,credit:7,loyalty:-4},'gc_vassal_bridge_fol'),
    C('Split legal bridge tolls conditionally for road upkeep',45,{loyalty:7,development:1,trust:4}),
    C('Fine the lord silently inside exchequer rolls',0,{gold:90,loyalty:-3})],
   'gc_vassal_bridge_fol','Flatboats Glide Unchecked Again','River boatmen hail royal bailiffs joyfully as flour barrels return cleanly to urban bakeries.',
   [C('Maintain river beacons under crown fees',40,{credit:6,trust:6}),C('Inspect nearby wharves',15,{securityMonths:5}),C('Seal decree cleanly',0,{legitimacy:4})]],

  ['gc_army_camp_fever','Military','Damp Straw in the Autumn Lines','Camp dysentery thins sentry watches as autumn rains turn siege approaches into ankle-deep mire.','army_supply',
   [C('Buy dry pine timber floors, clean boilers, and herbal vinegar',105,{supply:28,fatigue:-20,morale:8},'gc_camp_fever_fol'),
    C('Rotate fresh shire companies forward while resting sick men',55,{fatigue:-14,morale:5}),
    C('Order strict ditch drainage with cold rations',0,{morale:-2,supply:8})],
   'gc_camp_fever_fol','Dry Hearths Restore Soldier Spirits','Warm broth pots and raised tent-planks curb chills before winter campaigns freeze dirt roads.',
   [C('Issue wool socks & dry leather boots cleanly',50,{morale:8,supply:14}),C('Praise diligent field surgeons',20,{trust:6,prestige:4}),C('Resume march drills calmly',0,{experience:0.04})]],

  ['gc_military_veteran_pensions','Military','Crippled Bowmen Outside Gatehouse','Maimed veterans from border sieges show tattered commendation parchments beside empty bread bags.','war',
   [C('Charter permanent abbey infirmaries and fair veteran pensions',115,{morale:11,trust:10,piety:7},'gc_veteran_fol'),
    C('Grant rent-free forest cottage plots along quiet highways',65,{development:1,unrest:-6,morale:6}),
    C('Offer one modest silver dole at gate',0,{gold:-25,morale:2})],
   'gc_veteran_fol','Old Soldiers Bless Crown Banners','Recruits enlist more steadily seeing steadfast service honored cleanly in lean years.',
   [C('Employ seasoned veterans cleanly as town gatekeepers',40,{securityMonths:9,morale:6}),C('Record heroic muster names in chapel',20,{prestige:6,piety:4}),C('Keep rolls orderly',0,{stability:4})]],

  ['gc_guild_master_insurrection','Economy','Shoemakers Strike Against Grain Excise','Journeymen lock leather workshops along cobbled alleys protesting high bread-assize fees.','unrest',
   [C('Trim bread duties cleanly and meet guild masters beside fountain',85,{unrest:-12,trust:10,credit:5},'gc_guild_strike_fol'),
    C('Arrest stubborn strike captains while sparing hungry apprentices',45,{stability:6,unrest:-6,securityMonths:6}),
    C('Summon urban watchmen to clear alleys swiftly',0,{unrest:-3,trust:-6,legitimacy:4})],
   'gc_guild_strike_fol','Hammers Tap Once More on Cobblers Row','Apprentices hang blue guild banners back over shutters once fair loaf weights stabilize.',
   [C('Charter a permanent mixed guild-bailiff wage council',45,{credit:7,stability:6}),C('Fund free midday loaves during peak cold',35,{food:-20,trust:8}),C('Post watch cleanly',0,{securityMonths:5})]],

  ['gc_foreign_marriage_music','Family','Songs From Another Shore','Homesick maids sing lullabies from across distant seas, moving both consort and elders at evening dusk.','foreignMarriage',
   [C('Commission mixed bilingual chansonniers celebrating both realms',75,{opinion:12,acceptance:9,prestige:6},'gc_marriage_music_fol'),
    C('Invite visiting merchants from their homeland for autumn spice fairs',55,{relation:10,credit:7,opinion:8}),
    C('Send warm personal thank-yous quietly afterward',0,{opinion:5,stress:-4})],
   'gc_marriage_music_fol','Lutes Blossoming Across Galleries','Courtiers admire unfamiliar melodies woven harmoniously beside ancestral court airs.',
   [C('Retain visiting lutists for festive winter feasts',35,{stress:-7,prestige:6}),C('Gift silk sleeves cleanly',20,{opinion:6}),C('Retire calmly beside fire',0,{stress:-3})]],

  ['gc_low_trust_bailiff','Society','The Bribed Tollhouse Clerk','Villagers deliver carved tally-sticks proving a district bailiff demanded twin measures of oats while keeping spare bags.','lowtrust',
   [C('Dismiss the thief publicly, restore grain, and install honest elders',95,{trust:13,unrest:-9,legitimacy:7},'gc_bailiff_fol'),
    C('Force triple restitution into county emergency barns',35,{food:65,trust:8}),
    C('Quietly transfer him out of view to avoid embarassing his kin',0,{loyalty:5,trust:-6})],
   'gc_bailiff_fol','True Bushel Measures Mounted on Stone','Market bailiffs nail stamped iron measures beside the market cross where farmers read plainly.',
   [C('Send roving crown auditors unannounced twice yearly',45,{trust:8,credit:6}),C('Compensate cheated widows directly',25,{piety:6,trust:6}),C('Close district court cleanly',0,{stability:4})]],

  ['gc_scholar_lunar_eclipse','Research','Shadow Across the Harvest Moon','Astronomers predict a copper eclipse weeks ahead, letting the court prepare startled villagers calmly.','research',
   [C('Publish broadside skies explanations across parish squares',80,{research:10,trust:9,unrest:-5},'gc_eclipse_fol'),
    C('Stage solemn bells & prayers turning awe toward unity',55,{piety:9,stability:7}),
    C('Observe silently through smoked glass atop battlements',0,{research:5,stress:-4})],
   'gc_eclipse_fol','Awe Turns Safely to Quiet Wonder','Citizens crane necks calmly through oiled parchment as copper darkness yields swiftly to silver moonlight.',
   [C('Endow observatory brass quadrants',50,{research:9,prestige:6}),C('Reward parish teachers',25,{trust:6}),C('Resume ledger work',0,{stability:3})]],

  ['gc_ward_river_rescue','Family','Brave Dive Into Swollen Rapids','During a hunting picnic, your spirited ward leaped cleanly into icy shallows to pull a slipping page ashore.','wardGuardian',
   [C('Praise rare courage and present a tailored dagger of honor',65,{education:9,prestige:8,opinion:10},'gc_rescue_fol'),
    C('Reward both youth and guardian with calm praise & dry cloaks',30,{education:6,stress:-6,opinion:7}),
    C('Warn sternly against reckless unguarded plunges',0,{education:5,legitimacy:3})],
   'gc_rescue_fol','Grooms Whisper With Honest Pride','Young pages emulate steady nerve as word of the rescue warms winter halls.',
   [C('Fund swimming and horsemanship tutors safely',45,{education:7,morale:5}),C('Gift dry woolens cleanly to attendants',20,{trust:5}),C('Toast health at evening',0,{stress:-4})]],

  ['gc_cultural_festival_exchange','Culture','Masks and Lanterns in the Mixed Quarter','Border districts ask royal permission to blend ancestral harvest dances alongside capital guild processions.','difference',
   [C('Sponsor shared feast tables under unified realm banners',90,{acceptance:13,trust:10,unrest:-8},'gc_culture_fol'),
    C('Permit festivities quietly while boosting market patrols',35,{acceptance:7,securityMonths:6}),
    C('Encourage traditional capital parades without special grants',0,{legitimacy:5,acceptance:-2})],
   'gc_culture_fol','Lanterns Glow Across Divided Wards','Artisans swap dyes, sweet cakes, and tunes long after midnight bells sound cleanly.',
   [C('Reserve annual stall exemptions for cross-ward apprentices',40,{acceptance:8,credit:6}),C('Grant safe-conducts for itinerant players',20,{trust:6}),C('Tidy squares warmly',0,{stability:4})]],

  ['gc_steppe_wild_stallions','Steppe & Clans','Wild Tarpan Herd Near Winter Salt','Outriders spot three hundred sleek wild mares milling around salty springs along outer steppe marches.','gov_steppe',
   [C('Coordinate clan riders cleanly to rope remounts equitably',85,{morale:10,loyalty:10,supply:15},'gc_tarpan_fol'),
    C('Claim prime colts solely for the khan’s courier relay',40,{securityMonths:9,prestige:8,loyalty:-2}),
    C('Protect winter grazing marshes cleanly until foals strengthen',0,{food:45,trust:7})],
   'gc_tarpan_fol','Thundering Remounts Branded Beneath Clear Skies','Clan youths grin proudly astride wiry tireless mounts prized across steppe trails.',
   [C('Host gentle endurance races across river grass',45,{morale:8,loyalty:7}),C('Trade excess geldings to southern caravans',0,{gold:105,credit:5}),C('Return cleanly to winter camps',0,{food:30})]],

  ['gc_imperial_ink_leak','Imperial Court','Forged Examination Scrolls Caught at Gate','Proctors seize sleeve-lined silk handkerchiefs scribbled with tiny classical essays outside civil-service cubicles.','gov_imperial',
   [C('Purge corrupt proctors, retest candidates cleanly, and uphold merit',90,{legitimacy:12,research:9,trust:8},'gc_ink_leak_fol'),
    C('Confiscate cribbed silks silently while tightening gate searches',45,{securityMonths:10,stability:5}),
    C('Fine wealthy bribers steeply to repair frontier dikes',0,{gold:140,development:1})],
   'gc_ink_leak_fol','Honest Brushes Scratch Before Dawn','Provincial scholars praise clean impartial grading throughout county academies.',
   [C('Publish model essays transparently in courtyard arches',45,{research:7,trust:7}),C('Improve heating braziers inside study stalls',25,{piety:4,stability:5}),C('Close examination records cleanly',0,{legitimacy:5})]],

  ['gc_republic_shipyard_fire','Republic & Trade','Sparks in the Rope-Walk & Tar Shed','Tar cauldrons boiled fiercely at dusk near naval slips, threatening three freshly ribbed hull frames.','gov_republic',
   [C('Rush paid bucket gangs cleanly and charter stone fire-walls',115,{development:1,credit:9,morale:7},'gc_shipyard_fol'),
    C('Save prized oak hulls first while clearing workers safely',55,{trust:8,morale:5}),
    C('Claim guild insurance deposits sharply to cover timber loss',0,{gold:90,credit:-4})],
   'gc_shipyard_fol','Fresh Oak Keels Gleam Along Slips','Shipwrights cheer as repaired slips launch sleek merchant galleys right before spring tides.',
   [C('Station permanent night fire-watch boats',45,{securityMonths:8,credit:6}),C('Grant bonus salt rations to heroes',25,{trust:7}),C('Resume spice rigging cleanly',0,{credit:4})]],

  ['gc_shogun_swordsmith_duel','Shogunate','Two Master Smiths Forge Rival Blades','Famed provincial swordsmiths send wrapped uchigatana blades begging the shogun to judge true steel temper.','gov_shogunate',
   [C('Honor both masters cleanly and retain one beside castle forges',105,{prestige:11,morale:9,loyalty:7},'gc_smith_fol'),
    C('Test both blades strictly on iron helmets before retainers',55,{morale:8,experience:0.06}),
    C('Donate both pristine blades quietly to mountain shrines',0,{piety:10,trust:6})],
   'gc_smith_fol','Rings of Folded Steel Echo','Samurai retainers compete keenly for crisp castle-forged armor and lance heads.',
   [C('Standardize quality seals on provincial forges',45,{credit:7,morale:5}),C('Commission ceremonial scabbards cleanly',30,{prestige:7}),C('Store prize blades cleanly',0,{legitimacy:4})]],

  ['gc_confed_winter_treaty','Confederation','Wampum Runners Before First Snow','Outer longhouse speakers bring white-shell collars warning neighboring timber camps are running thin on dried squash.','gov_confederation',
   [C('Open shared confederate corn pits cleanly across member villages',85,{food:-30,loyalty:12,trust:11},'gc_confed_fol'),
    C('Organize escorted winter deer-hunting drives cleanly',45,{food:60,morale:6}),
    C('Host elder councils to settle spring clearing plots evenly',0,{stability:7,legitimacy:5})],
   'gc_confed_fol','Smoke Rises Peacefully Above Longhouses','Strong kinship trust tightens mutual frontier defense far better than palisade logs alone.',
   [C('Share carved hunting tallies warmly',30,{loyalty:7,trust:6}),C('Repair shared snowshoe trails',25,{supply:12,stability:4}),C('Record wampum talks plainly',0,{prestige:5})]],

  ['gc_city_water_conduit','City-State','Lead Pipes & Public Fountain Petition','Stonecutters propose tapping pure upland limestone springs through covered arches directly into crowded market squares.','gov_city',
   [C('Fund stone aqueduct arches and brass public spouts cleanly',125,{development:1,trust:12,unrest:-9},'gc_conduit_fol'),
    C('Split conduit costs neatly between cloth and tavern guilds',65,{credit:8,trust:7}),
    C('Repair existing brick market wells modestly instead',20,{stability:4,trust:3})],
   'gc_conduit_fol','Clear Cold Water Flows at Dusk','Bakers, brewers, and mothers celebrate clean fountains curbing summer stomach fevers.',
   [C('Assign salaried fountain wardens cleanly',35,{trust:7,health:-8}),C('Inscribe civic builder names nicely in marble',25,{prestige:6}),C('Enjoy crisp morning bread',0,{stability:4})]],

  ['gc_regional_temple_fair','Regional Realm','Chariots & Silk Outside Temple Walls','Ten thousand country pilgrims gather ahead of seasonal market fairs, jamming narrow ferry crossings below sanctuary steps.','gov_regional',
   [C('Throw pontoon river bridges and bless charity food kitchens',110,{food:-20,trust:11,piety:9,credit:7},'gc_temple_fair_fol'),
    C('Post marshals politely at ferry slips to guard fair stalls',55,{securityMonths:8,credit:6}),
    C('Collect ordinary festival stall dues briskly',0,{gold:105,unrest:2})],
   'gc_temple_fair_fol','Lanterns Drift Down Warm Currents','Merchants, weavers, and farmers head home praising royal peace across busy river crossings.',
   [C('Pave temple steps cleanly in cut stone',45,{development:1,piety:7}),C('Audit honest brass trade weights',25,{credit:6}),C('Close autumn fair accounts cleanly',0,{stability:4})]],

  ['gc_debt_merchant_league','Economy','Genoese-Style Factors Demand Collateral','Creditors politely threaten halting saltpeter and wool credit lines unless overdue royal bills see steady backing.','debt',
   [C('Pledge clear customs surpluses honestly to calm bankers',120,{credit:14,inflation:-2,legitimacy:6},'gc_debt_fol'),
    C('Refinance short loans calmly into orderly silver annuities',75,{credit:9,stability:5}),
    C('Rally domestic merchant syndics to buy out foreign paper',55,{loyalty:8,credit:7,gold:40})],
   'gc_debt_fol','Promissory Paper Honors Cleanly','Bourse factors drop discount rates, easing war chest liquidity across European and Mediterranean piers.',
   [C('Publish transparent treasury debt tallies cleanly',40,{credit:8,trust:6}),C('Mint sterling customs tokens',25,{inflation:-1,credit:5}),C('Return to balanced ledgers',0,{stability:4})]],

  ['gc_inflation_grain_hoarding','Economy','Cornered Flour Barge Syndicates','Speculators rent river warehouses quietly hoping to force winter barley prices doubly high before spring.','inflation',
   [C('Seize hoarded bins cleanly at fair crown rates for public stalls',95,{inflation:-3,unrest:-11,trust:10},'gc_hoarding_fol'),
    C('Flood city markets loudly with royal reserve grain first',115,{food:-30,inflation:-3,credit:6}),
    C('Tax idle granary holdings sharply to force quick sales',0,{gold:110,inflation:-2})],
   'gc_hoarding_fol','Millstones Turn Briskly Once More','Cheap warm loaves steady guild tempers and puncture speculative price fevers.',
   [C('Maintain honest public granary reserve stocks',45,{food:60,stability:5}),C('Ban undisclosed grain warehousing contracts',20,{legitimacy:6}),C('Keep price watches alert',0,{trust:5})]],

  ['gc_regency_rival_tutor','Family','Who Whispers Behind the Boy-King’s Desk?','Competing noble uncles quarrel openly over which chaplain and riding master attend the young sovereign’s morning hours.','regency',
   [C('Appoint balanced non-partisan scholars & loyal veteran knights',85,{legitimacy:10,education:8,stability:6},'gc_regency_tutor_fol'),
    C('Split ceremonial honors fairly to cool rival noble vanity',50,{loyalty:8,opinion:6}),
    C('Keep strictly sworn royal household attendants beside the throne',0,{securityMonths:9,prestige:4})],
   'gc_regency_tutor_fol','Steady Lessons Despite Factional Winds','The young sovereign studies statecraft calmly while uncles sign shared council minutes.',
   [C('Hold regular public council audiences',40,{legitimacy:7,trust:5}),C('Reward patient tutors generously',25,{education:6}),C('Keep council minutes locked',0,{securityMonths:5})]],

  ['gc_adult_heir_diplomat','Family','Heir Proposes Bold Foreign Marriage Parley','Your poised adult heir submits detailed maps and trade concessions arguing for bold rapprochement across historic border rivalries.','adultHeir',
   [C('Entrust your heir politely with formal envoy credentials',105,{education:9,prestige:9,credit:6},'gc_heir_dip_fol'),
    C('Let your heir accompany seasoned senior ambassadors first',55,{education:6,stability:5,opinion:7}),
    C('Keep border policy strictly within senior privy council',0,{legitimacy:5,opinion:-5})],
   'gc_heir_dip_fol','Envoys Return Bearing Respect','Neighboring marshals take sharper measure of your dynasty’s capable next generation.',
   [C('Publish balanced frontier trade treaties',45,{credit:8,prestige:6}),C('Host courtly banquets honoring diplomats',35,{opinion:8,stress:-5}),C('Record lessons cleanly',0,{legitimacy:4})]],

  ['gc_sickness_abbey_remedy','Health','Bitter Willow-Bark Tea & Fever Wards','A learned monastery infirmarer boils willow bark and dried rosemary, claiming cool drafts break stubborn joint fevers.','illness',
   [C('Underwrite clean monastery infirmary beds across the capital',95,{health:-22,trust:9,piety:7},'gc_remedy_fol'),
    C('Stock palace apothecary chests cleanly for royal kin',45,{health:-16,stress:-4}),
    C('Permit modest clinical trials strictly at volunteers’ choice',0,{research:6,health:-8})],
   'gc_remedy_fol','Steady Breathing Returns Beside Windows','Warm compresses and willow infusions earn grateful hymns from recovered courtiers and commoners.',
   [C('Copy herbal dosages clearly for rural priests',40,{trust:8,research:5}),C('Endow clean linen stores permanently',30,{piety:6,health:-6}),C('Give thanks quietly',0,{stress:-5})]],

  ['gc_stress_mountain_hermit','Wellbeing','A Quiet Lantern Upon Granite Ridges','Overwhelmed by sealing scores of quarrels daily, your mind craves forest silence away from velvet hangers-on.','highStress',
   [C('Ride quietly for a week’s hunting & silence among mountain pines',75,{stress:-25,prestige:4},'gc_hermit_fol'),
    C('Delegate dull petition audits temporarily to loyal councillors',40,{stress:-18,loyalty:7}),
    C('Clear three more midnight chests briskly on bitter coffee & tea',0,{legitimacy:6,stress:5})],
   'gc_hermit_fol','Clear Thought Returns With Pine Scent','Returning tanned and crisp-eyed, you slice cleanly through tangled council knots.',
   [C('Keep evening walks sacred away from hangers-on',25,{stress:-10,stability:4}),C('Reward steady interim stewards generously',35,{loyalty:7}),C('Plunge briskly back into dispatches',0,{prestige:4})]]
 ];

 for (const [id, cat, title, desc, trig, ch, fid, ftitle, fdesc, fch] of vignettes) {
  add(id, cat, title, desc, trig, ch);
  add(fid, cat, ftitle, fdesc, 'followup', fch);
 }

 return out;
}
