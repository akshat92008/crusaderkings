/**
 * Sovereign: 1450 — Modular Content Pack: 1450 Crossroads Era Shocks (3-4 Choices per Event)
 * Covers Gutenberg Printing Press, Gunpowder Bombard Siege Revolution, Oceanic Caravels,
 * Global Banking & Bills of Exchange, First Contact Embassies, and Columbian Agronomy.
 */
function buildCrossroadsStories(E, C) {
 const out = [];
 const add = (id, cat, title, desc, trig, choices) => out.push(E(id, cat, title, desc, trig, choices));

 // === 1. PRINTING PRESS & FORBIDDEN BROADSIDES ===
 add('xr_press_seditious_sheet', 'Crossroads', 'Movable Lead in the Back Alley',
  'City watchmen seize an oak screw-press turning out hundreds of cheap vernacular pamphlets questioning noble tax exemptions overnight.',
  'crossroads_press', [
   C('License printers cleanly in exchange for crown edicts & primers', 110, { research: 12, credit: 7, unrest: -4 }, 'xr_press_verdict'),
   C('Buy out the master printer to establish a Royal Chancery Press', 150, { legitimacy: 11, research: 10, prestige: 6 }, 'xr_press_verdict'),
   C('Confiscate the lead type and burn unlicensed sheets', 30, { faithAuthority: 7, stability: 5, research: -2 }),
   C('Levy steep paper stamps to quietly refill royal coffers', 0, { gold: 95, unrest: 4 })
  ]);

 add('xr_press_verdict', 'Crossroads', 'Ink-Stained Fingers at Market Square',
  'Printed law tables, sea rutters, and harvest almanacs now circulate from county judges down to parish schoolmasters.',
  'followup', [
   C('Fund free vernacular agricultural and navigation pamphlets', 65, { development: 1, food: 45, research: 8 }),
   C('Enforce strict royal imprint seals on every press', 40, { legitimacy: 7, securityMonths: 8 }),
   C('Tax bookbinders modestly while encouraging trade', 0, { gold: 70, credit: 5 })
  ]);

 // === 2. GUNPOWDER SIEGE REVOLUTION ===
 add('xr_gunpowder_wall_test', 'Crossroads', 'Shattered Ashlar Before Sundown',
  'Master founders fire wrought-iron bombards against an old curtain wall; thick medieval masonry splits within four salvos, alarming traditional castellans.',
  'crossroads_gunpowder', [
   C('Rebuild frontier bastions with low earthen trace-italienne ramparts', 155, { development: 1, morale: 8, prestige: 6 }, 'xr_gunpowder_doctrine'),
   C('Cast mobile bronze culverins for the crown field train', 135, { morale: 10, experience: 0.09, prestige: 7 }, 'xr_gunpowder_doctrine'),
   C('Restrict private noble ownership of saltpeter & cannons by decree', 60, { legitimacy: 9, securityMonths: 10, loyalty: -3 }),
   C('Rely on disciplined archers and seasoned shock horse', 0, { morale: 4, gold: 45 })
  ]);

 add('xr_gunpowder_doctrine', 'Crossroads', 'Sappers and Chemists in the Foundry',
  'Artillery captains refine dry granulated corned powder that survives damp sea campaigns without misfiring.',
  'followup', [
   C('Establish salaried state saltpeter sheds cleanly', 75, { morale: 7, experience: 0.06, credit: 4 }),
    C('Publish range-finder tables for fortress gunners', 45, { research: 7, legitimacy: 5 }),
    C('Reserve spare barrels strictly for royal arsenals', 0, { securityMonths: 6, stability: 4 })
  ]);

 // === 3. OCEANIC NAVIGATION & CARAVEL EXPEDITIONS ===
 add('xr_oceanic_caravel_mutiny', 'Crossroads', 'Forty Days Beyond Sight of Land',
  'Returned pilots confess their crew nearly mutinied below strange southern stars before spotting dark currents rich with ambergris and unknown coastlines.',
  'crossroads_oceanic', [
   C('Back a larger three-ship squadron with brass astrolabes & citrus casks', 150, { credit: 11, prestige: 11, research: 9 }, 'xr_oceanic_harbor'),
   C('Charter shared crown-merchant voyages splitting hazard & profit', 100, { credit: 9, gold: 75, trust: 5 }, 'xr_oceanic_harbor'),
   C('Honor fallen mariners and fund safer coastal chart surveys', 50, { trust: 8, stability: 5, food: 30 }),
   C('Revoke reckless oceanic patents to safeguard native crews', 0, { piety: 6, stability: 4 })
  ]);

 add('xr_oceanic_harbor', 'Crossroads', 'Unknown Spices Unloaded at Dawn',
  'Sails torn by tropical squalls glide back inside the breakwater carrying strange timbers, bright plumage, and clean latitude logs.',
  'followup', [
   C('Found a permanent Royal Hydrographic Registry for all captains', 70, { research: 11, credit: 9, prestige: 6 }),
   C('Auction exotic cargoes to finance shipyard drydocks', 25, { gold: 145, development: 1 }),
   C('Share pilot charts strictly with sworn crown admirals', 0, { securityMonths: 10, morale: 5 })
  ]);

 // === 4. CHARTERED FINANCE, BANKING & BILLS OF EXCHANGE ===
 add('xr_finance_bank_run', 'Crossroads', 'Crowds Outside the Counting House',
  'Rumors of a defaulted Mediterranean galley fleet spark panic outside leading merchant banks; depositors hammer oak shutters demanding silver.',
  'crossroads_finance', [
   C('Back bills of exchange cleanly with temporary crown bullion guarantees', 140, { credit: 14, stability: 8, prestige: 6 }, 'xr_finance_aftermath'),
   C('Audit syndicate ledgers publicly and rescue solvent houses only', 80, { credit: 9, inflation: -2, legitimacy: 6 }, 'xr_finance_aftermath'),
   C('Freeze bullion exports and mint emergency fractional coin', 35, { stability: 5, inflation: 2, gold: 60 }),
   C('Seize forfeited foreign vaults to offset royal war debts', 0, { gold: 165, credit: -8, unrest: 4 })
  ]);

 add('xr_finance_aftermath', 'Crossroads', 'Clearance Day on the Rialto & Square',
  'Notaries tally promissory paper swiftly in ink as confident grain and textile merchants resume long-distance bills.',
  'followup', [
   C('Charter a permanent Sovereign Clearing House for public debt', 75, { credit: 12, inflation: -2, development: 1 }),
   C('Require quarterly reserve inspections across banking guilds', 35, { stability: 6, trust: 6 }),
   C('Claim modest royal stamp fees on future bills', 0, { gold: 90 })
  ]);

 // === 5. FIRST GLOBAL CONTACT, EMBASSIES & COLUMBIAN CROPS ===
 add('xr_contact_diplomat_fleet', 'Crossroads', 'Strange Envoys Bearing Featherwork and Astrolabes',
  'Multilingual interpreters escort ambassadors from across distant oceans carrying botanical cuttings, gilded maps, and formal trade proposals.',
  'crossroads_contact', [
   C('Grant embassy mansions and establish a College of Tongues', 145, { acceptance: 12, research: 10, prestige: 10 }, 'xr_contact_exchange'),
   C('Trial hardy foreign root and grain crops on royal demesne plots', 95, { food: 95, development: 1, trust: 7 }, 'xr_contact_exchange'),
   C('Sign bounded customs treaties confined to coastal staple ports', 45, { credit: 8, securityMonths: 6 }),
   C('Maintain distant formal courtesy without altering old trade laws', 0, { legitimacy: 5, stability: 4 })
  ]);

 add('xr_contact_exchange', 'Crossroads', 'Terraces and Libraries Transformed',
  'Hardy new tubers sprout alongside ancestral barley while bilingual dictionaries align calendar tables between distant hemispheres.',
  'followup', [
   C('Distribute seed tubers cleanly to mountain & dryland parishes', 60, { food: 110, trust: 9, unrest: -6 }),
   C('Compile a multilingual world atlas in royal halls', 80, { research: 12, prestige: 9 }),
   C('Reserve imported curiosities strictly for court collections', 0, { prestige: 6, gold: 40 })
  ]);

 // === 6. EARLY MODERN CRISES & SOCIAL SHIFTS (BESPOKE 3-4 CHOICE ARCS) ===
 const bespokeCrossroads = [
  ['xr_enclosure_commons', 'Crossroads', 'Hedges Across Ancient Sheep-Walks',
   'Ambitious wool magnates fence off traditional village commons for Merino pastures, driving displaced cottars onto highway crossroads.',
   'land',
   [
    C('Protect customary villager commons and cap wool enclosures', 85, { unrest: -10, trust: 11, food: 35 }, 'xr_enclosure_after'),
    C('Tax enclosed sheepwalks cleanly to fund urban craft apprenticeships', 55, { gold: 95, development: 1, credit: 5 }),
    C('Resettle landless families onto drained fenland royal plots', 110, { food: 75, development: 1, legitimacy: 6 }),
    C('Uphold landlords’ private deeds firmly at sheriff assizes', 0, { loyalty: 7, gold: 60, unrest: 6 })
   ],
   'xr_enclosure_after', 'Ploughshares and Looms Rebalanced',
   'Bailiffs note clearer rents alongside thriving weavers’ cottages inside market parishes.',
   [
    C('Publish standardized tenancy contracts cleanly', 35, { trust: 7, stability: 5 }),
    C('Fund village spinning wheels before autumn', 45, { credit: 6, food: 25 }),
    C('File assize judgments cleanly', 0, { legitimacy: 4 })
   ]
  ],
  ['xr_guild_mechanical_clock', 'Crossroads', 'Iron Escapements Above the Belfry',
   'Tower smiths offer to install a striking weight-driven brass clock visible across the city square, regulating market bells and curfew watches.',
   'land',
   [
    C('Commission the great town clock with gilded lunar dials', 120, { prestige: 9, research: 8, development: 1 }, 'xr_clock_after'),
    C('Split cost equally between textile, baker, and smith guilds', 60, { trust: 7, credit: 6 }),
    C('Install simpler sandglasses at tax booths and garrison gates', 25, { securityMonths: 6, credit: 3 }),
    C('Preserve traditional monastic bell hours', 0, { piety: 5, stability: 3 })
   ],
   'xr_clock_after', 'Bronze Chimes Govern Market Hours',
   'Carpenters, clerks, and carters adjust shifts swiftly to crisp quarter-hour chimes.',
   [
    C('Appoint an annual horologist custodian', 30, { research: 5, development: 1 }),
    C('Synchronize river ferry schedules by the bell', 20, { credit: 5, trust: 4 }),
    C('Let guild elders maintain the tower weights', 0, { stability: 3 })
   ]
  ],
  ['xr_mercenary_pike_companies', 'Crossroads', 'Free Companies Seeking Crown Retainers',
   'Dismissed veteran pikemen and handgunners from distant wars offer disciplined banner service for steady silver pay — or else threaten roadside tolls.',
   'army',
   [
    C('Hire veteran serjeants to drill native royal levies in pike squares', 130, { morale: 10, experience: 0.09, stability: 4 }, 'xr_pike_after'),
    C('Grant waste frontier steadings if captains disband peaceably', 85, { development: 1, unrest: -5, trust: 6 }),
    C('Pay modest safe-conduct coin to escort companies beyond borders', 50, { securityMonths: 8, stability: 4 }),
    C('Mobilize shire horse swiftly to disarm wandering bands', 0, { morale: 4, legitimacy: 6, unrest: 4 })
   ],
   'xr_pike_after', 'Hedgehogs of Ashwood & Steel',
   'Native levies march with brisk drumbeat cadence, turning hesitant militia into steady line battalions.',
   [
    C('Establish winter arsenal storage for eighteen-foot pikes', 50, { morale: 7, supply: 12 }),
    C('Award silver paymaster tokens to steadfast officers', 30, { loyalty: 6, experience: 0.04 }),
    C('Rotate drills onto frontier borders', 0, { stability: 4 })
   ]
  ],
  ['xr_quarantine_postal_relay', 'Crossroads', 'Post-Horns Along the Highway',
   'Merchants propose chaining fresh post-horses every twelve leagues so royal seals and market letters cross the entire realm in four days.',
   'trade',
   [
    C('Charter a Royal Post open to both seals and paid guild letters', 125, { credit: 11, securityMonths: 10, prestige: 6 }, 'xr_postal_after'),
    C('Fund strictly military and diplomatic relay stables', 80, { securityMonths: 12, morale: 5 }),
    C('Lease roadside inn monopolies to private courier guilds', 25, { gold: 70, credit: 5 }),
    C('Preserve traditional seasonal messenger bags', 0, { stability: 3 })
   ],
   'xr_postal_after', 'Dust Behind the Post-Riders',
   'News of bumper harvests, pirate sightings, and treaty signatures reaches council tables weeks ahead of rivals.',
   [
    C('Standardize brass relay badges and wax seal checks', 35, { securityMonths: 8, legitimacy: 5 }),
    C('Attach small coin carts under post escort', 45, { credit: 7, gold: 50 }),
    C('Thank innkeepers along the post road', 0, { trust: 4 })
   ]
  ],
  ['xr_cartography_portolan', 'Crossroads', 'Calfskin Charts and Magnetic Declination',
   'Catalan and Levantine chartmakers present vivid vellum portolans correcting hazardous shoals, claiming royal sponsorship will double safe tonnage.',
   'land',
   [
    C('Endow a permanent Master Pilot’s Chart Office', 120, { research: 11, credit: 9, prestige: 7 }, 'xr_portolan_after'),
    C('Commission copper-plate coastal maps for provincial captains', 70, { credit: 6, morale: 5 }),
    C('Purchase exclusive secret copies for royal fleets alone', 55, { securityMonths: 10, prestige: 4 }),
    C('Leave navigation craft to local harbor brotherhoods', 0, { gold: 30, trust: 2 })
   ],
   'xr_portolan_after', 'Shoals Marked Clearly in Vermilion',
   'Wreckage claims drop cleanly along rocky headlands as skippers steer confidently into fog.',
   [
    C('Erect stone daymarks and lantern towers on key capes', 65, { development: 1, credit: 8 }),
    C('Exchange harmless coastal charts with friendly courts', 25, { acceptance: 6, prestige: 5 }),
    C('Seal deep-sea soundings in treasury safes', 0, { securityMonths: 6 })
   ]
  ],
  ['xr_reign_statute_codex', 'Reign Chapters', 'Carving the Reign’s Living Law',
   'Judges gather centuries of contradictory manor customs alongside your reign chapter mandates, seeking authority to compile one clear sovereign code.',
   'reign_chapter',
   [
    C('Promulgate a clear, uniform Realm Codex across every circuit', 135, { legitimacy: 13, stability: 9, trust: 7 }, 'xr_statute_after'),
    C('Preserve local charters while codifying criminal & tax appeals', 80, { loyalty: 9, legitimacy: 7, acceptance: 5 }),
    C('Inscribe crown prerogatives firmly above provincial custom', 45, { legitimacy: 9, prestige: 6, loyalty: -4 }),
    C('Leave county assizes to seasoned elder custom', 0, { loyalty: 5, stability: 3 })
   ],
   'xr_statute_after', 'Judges Sworn Beneath the Sovereign Codex',
   'Litigants cease endless venue disputes as county courts cite uniform royal chapters.',
   [
    C('Bind pocket editions for traveling bailiffs', 40, { trust: 7, research: 4 }),
    C('Inscribe opening articles inside market arches', 30, { prestige: 7, legitimacy: 5 }),
    C('Seal master rolls inside chancery chests', 0, { stability: 4 })
   ]
  ]
 ];

 for (const [id, cat, title, desc, trig, ch, fid, ftitle, fdesc, fch] of bespokeCrossroads) {
  add(id, cat, title, desc, trig, ch);
  add(fid, cat, ftitle, fdesc, 'followup', fch);
 }

 return out;
}

export function crossroadsEvents(E, C) {
 return buildCrossroadsStories(E, C);
}
