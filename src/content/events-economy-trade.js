/**
 * Sovereign: 1450 — Modular Content Pack: Economy, Trade, Coinage & Granaries
 * 65 multi-stage narrative chains (260 authored stages) covering merchant guild monopolies,
 * currency debasement & minting, grain granaries, mining strikes, Silk Road & Spice Strait
 * tariffs, banking charters, and plague quarantine vs market fairs.
 */
export function economyTradeEvents(E, C) {
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

 // === A. MERCHANT GUILD MONOPOLIES & STAPLE CHARTERS ===
 branch4('et_guild_wool_staple', 'Economy & Trade', 'trade',
  ['The Clothiers’ Locked Looms', 'Master drapers petition to bar rural weavers from selling broadcloth at city fairs, insisting only guild seals guarantee export quality.', [
   ['Break the closed monopoly and license inspected rural looms openly', 95, { credit: 9, trust: 9, development: 1 }],
   ['Confirm guild export seals while leaving domestic village looms free', 45, { credit: 6, acceptance: 6, stability: 4 }],
   ['Uphold strict city guild monopoly for royal charter fees', 0, { gold: 90, unrest: 5, trust: -4 }]
  ]],
  ['Booming Looms Along the Brook', 'Freed village dyers hang indigo and madder skeins across sunny meadows, doubling regional yardage.', [
   ['Build fulling water-mills and standardized brass yard-rods', 105, { development: 1, tools: 18, credit: 8 }],
   ['Sponsor an autumn regional broadcloth fair outside the gate', 45, { credit: 8, trust: 7 }],
   ['Collect modest yardage stamps cleanly', 0, { gold: 70, credit: 4 }]
  ]],
  ['Journeymen Walk Out of the Hall', 'Barred from master status, skilled weavers smash guild seal-presses and picket the cloth hall doors.', [
   ['Reduce mastership entrance fees and hear journeyman stewards', 75, { unrest: -9, trust: 8, stability: 6 }],
   ['Open a crown arbitration court balancing wages and piece-rates', 35, { legitimacy: 7, unrest: -5 }],
   ['Send city watchmen to clear the hall steps', 0, { stability: 4, unrest: 5 }]
  ]],
  ['Broadcloth Trusted Across Seas', 'Honest royal inspection stamps give merchants brisk credit from port exchanges inland.', [
   ['Establish permanent royal cloth-sealers at export quays', 60, { credit: 10, legitimacy: 6 }],
   ['Gift fine dyed bolts to urban almshouses', 30, { piety: 7, trust: 6 }],
   ['Close the guild charter review', 0, { stability: 4 }]
  ]]
 );

 arc4('et_guild_spice_ring', 'Economy & Trade', 'trade',
  ['Hoarded Pepper in the Spice Hall', 'Three wealthy wholesale brothers buy up every incoming clove and pepper chest, tripling apothecary prices before winter.', [
   ['Break the corner by opening crown-backed free spice auctions', 110, { credit: 9, trust: 10, inflation: -2 }],
   ['Fine forestallers sharply and cap winter retail spice tariffs', 40, { legitimacy: 8, unrest: -6, gold: 45 }],
   ['Tax their windfall profits silently for treasury relief', 0, { gold: 120, inflation: 2, trust: -4 }]
  ]],
  ['Brokers Whisper of Capital Flight', 'Cornered wholesalers threaten to divert future spice galleys to rival harbors down the coast.', [
   ['Guarantee fair harbor clearing rules to independent captains', 75, { credit: 10, development: 1 }],
   ['Reconcile modest brokers with transparent warehouse rents', 35, { credit: 6, trust: 6 }],
   ['Remind them royal sea-lanes protect their hulls', 0, { legitimacy: 6 }]
  ]],
  ['New Entrants Crowd the Wharf', 'Smaller merchant partnerships pool silver to import cinnamon and ginger directly without middlemen.', [
   ['Grant them crown marine insurance tallies and pier sheds', 85, { credit: 11, trust: 7 }],
   ['Inspect cargo purity fairly with sworn royal assayers', 30, { legitimacy: 7, credit: 5 }],
   ['Let competing brokers bid openly on the stone quay', 0, { credit: 6, gold: 45 }]
  ]],
  ['Vibrant Spice Bazaars', 'With monopolies broken, apothecaries and cooks buy clean aromatic spices at honest market weights.', [
   ['Publish a Permanent Anti-Forestalling Market Code', 50, { legitimacy: 8, trust: 8 }],
   ['Collect boosted volume customs cleanly', 20, { gold: 85, credit: 5 }],
   ['Archive the spice guild ledgers', 0, { stability: 4 }]
  ]]
 );

 arc4('et_guild_mason_strike', 'Economy & Trade', 'land',
  ['Chisels Laid Down at the Custom House', 'Master stonemasons halt work on the new harbor custom house, protesting imported cheaper sandstone and uncertified apprentices.', [
   ['Raise stone quality standards and endow a royal masons’ lodge', 115, { development: 1, trust: 9, prestige: 7 }],
   ['Mediate clear wages while welcoming skilled outside cutters', 55, { acceptance: 8, tools: 14, stability: 5 }],
   ['Hire unguilded quarrymen to finish the walls briskly', 0, { development: 1, unrest: 6, trust: -4 }]
  ]],
  ['Secret Lodge Oaths Rumored', 'Town aldermen worry masons use secret handshakes and chalk marks to fix wages across every building yard.', [
   ['Require public wage boards while respecting craft secrets', 50, { legitimacy: 7, trust: 7 }],
   ['Inspect lodge charity chests to confirm innocent mutual aid', 25, { securityMonths: 7, stability: 5 }],
   ['Ban night meetings inside unfinished vaults', 0, { securityMonths: 6, unrest: 3 }]
  ]],
  ['Vault Arch Keyed Before Frost', 'Once terms settle, skilled setters lock the ribbed custom-house vault smoothly before autumn storms.', [
   ['Commission carved royal arms and artisan crests above the door', 55, { prestige: 9, trust: 7 }],
   ['Host a traditional roof-wetting ale supper for crews', 30, { trust: 8, stability: 5 }],
   ['Open the ground-floor weighing stalls immediately', 0, { credit: 6 }]
  ]],
  ['Built to Outlast Centuries', 'Dry limestone halls keep customs parchment and silk bales safe from damp sea air.', [
   ['Appoint an honest chief weighmaster with sealed brass scales', 45, { credit: 8, legitimacy: 6 }],
   ['Archive architectural drawings in the chancery', 25, { research: 6 }],
   ['Close the building account', 0, { stability: 4 }]
  ]]
 );

 arc4('et_guild_salt_barge', 'Economy & Trade', 'lowtrust',
  ['Short Bushels at the Salt Quay', 'Fish-curers complain crown salt-measurers shave wooden strike-boards thin, cheating rural buyers out of every tenth pound.', [
   ['Smash false measures publicly and cast stamped brass bushels', 105, { trust: 13, legitimacy: 8, unrest: -6 }],
   ['Rotate salt clerks randomly across ports every six months', 45, { securityMonths: 8, trust: 7 }],
   ['Reprimand head clerks privately and settle arrears in grain', 0, { food: -15, trust: 4 }]
  ]],
  ['Corrupt Weighmaster Flees by Night', 'Exposed by brass standards, the chief weighmaster boards a smuggler’s lugger leaving counterfeit tallies behind.', [
   ['Auction his seized townhouses to repay cheated fishwives', 30, { trust: 12, legitimacy: 7, gold: 45 }],
   ['Send swift cutters to intercept him off the sandbar', 55, { securityMonths: 8, prestige: 6 }],
   ['Audit every tally-stick issued over the past year', 0, { credit: 5, legitimacy: 5 }]
  ]],
  ['Guild Elders Witness the Standard', 'Market mothers, monks, and bailiffs witness new iron-bound bushel tubs locked inside the town hall.', [
   ['Chain official comparison weights outside every market gate', 60, { trust: 10, credit: 7 }],
   ['Print simple visual weight charts for unlettered carters', 35, { trust: 8, research: 4 }],
   ['Require two guild witnesses at every salt unloading', 0, { stability: 6 }]
  ]],
  ['Honest Measure Restored', 'Fish-curers fill brine casks confidently once more, praising crown justice across coastal villages.', [
   ['Extend uniform brass measures to wine and grain markets', 65, { credit: 9, trust: 8 }],
   ['Reward the whistleblowing fisherwoman with a silver medal', 25, { prestige: 7, trust: 6 }],
   ['Close the weights commission', 0, { legitimacy: 4 }]
  ]]
 );

 // === B. CURRENCY DEBASEMENT, MINTING & BULLION ===
 branch4('et_mint_clipped_groats', 'Economy & Trade', 'inflation',
  ['Shaved Edges on Silver Coin', 'Bakers bite coins and refuse worn groats clipped thin round the rim; market prices jump twenty percent in a week.', [
   ['Recall clipped coin at the mint and strike heavy milled silver', 155, { inflation: -5, credit: 12, trust: 9 }],
   ['Stamp countermarks on sound coins and weigh light ones by bullion', 65, { inflation: -3, credit: 6 }],
   ['Order merchants by proclamation to accept all royal stamps at par', 0, { inflation: 2, unrest: 6, credit: -5 }]
  ]],
  ['Crisp Milled Edges Gleam', 'New collar-struck coins ring true on slate counters; shopkeepers swiftly lower bread prices back to normal.', [
   ['Establish county exchange booths trading old coin without penalty', 75, { trust: 11, inflation: -2, stability: 6 }],
   ['Publish engraved coin-identification sheets for parish bailiffs', 30, { research: 6, legitimacy: 6 }],
   ['Send clippers’ iron shears to be melted at the royal forge', 0, { securityMonths: 7, tools: 10 }]
  ]],
  ['Black Market in Pure Bullion', 'Shopkeepers hoard heavy old silver in floorboards while passing only shaved pennies across stalls.', [
   ['Pay royal soldiers strictly in sound silver to restart circulation', 95, { inflation: -3, credit: 8, stability: 5 }],
   ['Raid clandestine melting-pots in alley basements', 35, { securityMonths: 9, gold: 65 }],
   ['Levy double taxes on anyone refusing lawful tender', 0, { legitimacy: 4, unrest: 4 }]
  ]],
  ['Sound Coinage Restored', 'With milled silver circulating cleanly, bills of exchange settle calmly across borders.', [
   ['Charter permanent Royal Assay Masters with public trial-plates', 65, { credit: 10, legitimacy: 8 }],
   ['Strike gold sovereigns honoring realm prosperity', 55, { prestige: 10, credit: 5 }],
   ['Close the recoinage chests', 0, { stability: 4 }]
  ]]
 );

 arc4('et_mint_copper_tokens', 'Economy & Trade', 'debt',
  ['Shortage of Small Change', 'Silver groats are too valuable for buying a loaf or turnip; laborers accept stamped lead tavern tokens instead.', [
   ['Mint regulated pure copper pennies redeemable at tax desks', 110, { credit: 9, trust: 9, inflation: -2 }],
   ['License honest municipal brass farthings for city markets', 55, { credit: 6, development: 1 }],
   ['Issue cheap base-billon coin rapidly to fill treasury gaps', 0, { gold: 105, inflation: 4, trust: -4 }]
  ]],
  ['Counterfeit Dies in the Tin Shop', 'Constables seize crude wooden molds churning out fake copper pennies behind a tinker’s shed.', [
   ['Equip the royal mint with screw-presses impossible to mimic by hand', 95, { research: 9, securityMonths: 8, credit: 7 }],
   ['Pay modest silver bounties for turned-in counterfeit molds', 35, { securityMonths: 7, trust: 5 }],
   ['Prosecute the tinker harshly under coining treason statutes', 0, { legitimacy: 6, stability: 4 }]
  ]],
  ['Bakers & Brewers Cheer Small Coin', 'Wage earners spend copper pence smoothly at daily stalls without losing pennies to moneychangers’ fees.', [
   ['Open crown change windows inside provincial market squares', 55, { trust: 9, credit: 7 }],
   ['Allow copper pence for up to half of minor court fines', 25, { trust: 7, unrest: -5 }],
   ['Keep copper minting strictly capped to prevent glut', 0, { inflation: -2, stability: 5 }]
  ]],
  ['Circulating Wealth Down to the Village', 'Small change lubricates rural markets, bringing fresh eggs, linen, and iron nails into town.', [
   ['Audit mint bullion reserves semi-annually', 45, { credit: 8, legitimacy: 6 }],
   ['Reward master die-engravers cleanly', 25, { prestige: 7 }],
   ['Close the mint ledger', 0, { stability: 4 }]
  ]]
 );

 arc4('et_mint_silver_discovery', 'Economy & Trade', 'land',
  ['Glittering Vein in the Slate Creek', 'Prospectors panning cold highland streams pull heavy silver-bearing galena nodules from mossy fissures.', [
   ['Fund royal adit drainage tunnels and water-powered stamp mills', 150, { gold: 130, development: 1, credit: 8 }],
   ['Charter experienced Saxon/mining guilds for a fifth-share royalty', 65, { gold: 85, tools: 18, research: 6 }],
   ['Auction surface digging claims briskly to highest bidders', 0, { gold: 110, unrest: 3 }]
  ]],
  ['Smelting Fumes Over Valley Pastures', 'Lead and sulfur smoke drifts across sheep meadows, killing lambs and sparking bitter farmer protests.', [
   ['Build tall masonry condensing flues and compensate pastures', 85, { trust: 10, development: 1, unrest: -7 }],
   ['Shift smelters downstream into rocky uninhabited gorges', 50, { trust: 7, food: 25 }],
   ['Declare royal mining priority over common grazing', 0, { gold: 60, unrest: 6, loyalty: -4 }]
  ]],
  ['Highwaymen Eye Bullion Wagons', 'Word of fresh silver bars draws armed rogues toward wooded crossings along the valley road.', [
   ['Guard silver ingots inside iron-strapped wagons with mounted escort', 70, { securityMonths: 9, credit: 6 }],
   ['Smelt ingots into hidden royal mark stamps hard to fence', 30, { securityMonths: 7, legitimacy: 5 }],
   ['Send decoy empty carts on alternate nights', 0, { prestige: 4, securityMonths: 5 }]
  ]],
  ['Stream of Pure Bullion', 'Pure mountain ingots fortify treasury reserves and anchor your coin across regional fairs.', [
   ['Mint a commemorative mountain-silver crown piece', 45, { prestige: 10, credit: 8 }],
   ['Endow miners’ widows and chapel infirmary', 40, { piety: 7, trust: 8 }],
   ['Log seasonal bullion output', 0, { gold: 75 }]
  ]]
 );

 arc4('et_mint_gold_flight', 'Economy & Trade', 'inflation',
  ['Gold Florins Vanishing Abroad', 'Foreign merchants sell silk for heavy royal gold coins while paying local debts in lighter silver, draining pure bullion out.', [
   ['Align mint gold-to-silver ratios cleanly with neighboring bourses', 105, { inflation: -4, credit: 10, stability: 6 }],
   ['Require foreign merchants to spend half their proceeds on native goods', 45, { credit: 8, tools: 14 }],
   ['Forbid bullion exports at harbor gates under heavy search', 0, { securityMonths: 7, credit: -4, gold: 55 }]
  ]],
  ['Smugglers’ Hollow Oars', 'Customs searchers crack open hollow ship oars stuffed with stacked foreign ducats.', [
   ['Reward sharp searchers with a quarter-share of seized gold', 25, { gold: 85, securityMonths: 8 }],
   ['Encourage bills of exchange to replace risky physical coin sacks', 70, { credit: 10, research: 6 }],
   ['Confiscate contraband cleanly into mint chests', 0, { gold: 95, legitimacy: 5 }]
  ]],
  ['Wool & Tin Exporters Rally', 'Native wool and metal merchants flourish once adjusted mint rates make exports briskly competitive.', [
   ['Reduce export customs briefly on finished cloth and pewter', 60, { development: 1, credit: 9 }],
   ['Guarantee honest harbor exchange tables posted in stone', 30, { trust: 8, credit: 5 }],
   ['Collect balanced customs duties cleanly', 0, { gold: 75 }]
  ]],
  ['Steady Scales at the Mint', 'With bullion parity restored, gold stays home circulating alongside busy native workshops.', [
   ['Publish quarterly foreign exchange rate tables', 45, { credit: 9, research: 5 }],
   ['Feast the mint wardens and guildmasters', 25, { prestige: 6, trust: 5 }],
   ['Close the bullion inquiry', 0, { stability: 4 }]
  ]]
 );

 // === C. GRAIN GRANARIES, FAMINE RESERVES & AGRICULTURE ===
 branch4('et_grain_empty_barns', 'Economy & Trade', 'food',
  ['Mouse-Eaten Royal Granaries', 'Inspectors breaking wax seals on emergency wheat bins find wet rot, damp sacks, and falsified bushel tallies.', [
   ['Purchase dry grain urgently and build raised stone-pillar granaries', 145, { food: 120, grain: 25, trust: 9 }],
   ['Buy hardy rye and oats regionally while airing salvaged bins', 75, { food: 75, grain: 15, stability: 5 }],
   ['Release remaining sound wheat carefully to baking guilds', 0, { food: 35, unrest: 2 }]
  ]],
  ['Golden Grain Pours Into Dry Bins', 'Elevated slate-roofed stores keep grain bone-dry above stone mouse-guards.', [
   ['Establish rotating three-year grain turnover contracts', 60, { food: 55, credit: 6, stability: 6 }],
   ['Hire sworn grain-turners to shovel and air bins weekly', 30, { grain: 15, trust: 7 }],
   ['Lock duplicate keys with town aldermen and crown stewards', 0, { legitimacy: 6, securityMonths: 6 }]
  ]],
  ['Bread Riots Outside the Mill', 'Rumor of empty barns drives panicked crowds to block grain carts at town gates.', [
   ['Bake subsidized coarse rye loaves at abbey ovens immediately', 85, { food: 55, unrest: -10, trust: 9 }],
   ['Post watchmen at mills and cap flour prices strictly', 30, { stability: 6, unrest: -6 }],
   ['Promise foreign grain ships arriving within ten days', 0, { trust: -3, unrest: 3 }]
  ]],
  ['Full Bins Before Winter', 'Sound stone granaries protect the realm cleanly through lean harvests ahead.', [
   ['Extend raised granary plans to every border town', 70, { development: 1, food: 45, trust: 7 }],
   ['Reward honest millers and carters', 25, { trust: 6, prestige: 4 }],
   ['Seal the winter reserve ledgers', 0, { stability: 4 }]
  ]]
 );

 arc4('et_grain_drought_wells', 'Disaster', 'drought',
  ['Cracked Mud in the Irrigation Tanks', 'Months without rain leave paddy fields and barley ridges baking white; village wells turn muddy.', [
   ['Fund deep stone-lined wells, Persian water-wheels, and grain relief', 140, { crisis: -18, food: 65, trust: 11 }],
   ['Release royal storehouse millet and organize water-ration boards', 70, { crisis: -11, food: 45, stability: 6 }],
   ['Order prayers for rain and waive autumn water-dues', 0, { piety: 8, crisis: -5, trust: 4 }]
  ]],
  ['Dispute Over Upstream Sluices', 'Upland millers dam the dwindling creek to turn flour stones while downstream orchards wither.', [
   ['Enforce alternating night-day sluice gates favoring thirsty crops', 55, { trust: 10, crisis: -10, legitimacy: 6 }],
   ['Pay millers to switch temporarily to hand-querns and wind-mills', 75, { tools: 15, food: 35, trust: 8 }],
   ['Send bailiffs to open sluices by royal decree', 0, { legitimacy: 5, unrest: -3, loyalty: -3 }]
  ]],
  ['Withered Seed-Corn Threatens Next Year', 'Desperate farmers start grinding next spring’s precious seed wheat just to feed crying children.', [
   ['Advance interest-free royal seed-grain chests locked till sowing', 90, { grain: 24, food: 40, trust: 11 }],
   ['Import drought-hardy millet and lentil seed from southern ports', 65, { food: 50, research: 6 }],
   ['Distribute emergency monastery soup rations', 0, { piety: 7, food: 20 }]
  ]],
  ['Clouds Gather Over Living Fields', 'When storms finally break, saved seed and deeper wells carry villages cleanly into green spring.', [
   ['Dredge silted village ponds permanently', 65, { development: 1, trust: 9, food: 40 }],
   ['Forgive drought-year land arrears cleanly', 35, { trust: 9, loyalty: 6 }],
   ['Archive the water-sharing accords', 0, { legitimacy: 5 }]
  ]]
 );

 arc4('et_grain_famine_profiteer', 'Disaster', 'famine',
  ['Barges Sneaking Wheat Downstream', 'While starving parishes boil nettles, smugglers load scarce wheat sacks onto night barges bound for richer foreign ports.', [
   ['Seize contraband grain barges and sell loaves at half-price', 85, { crisis: -16, food: 75, trust: 12 }],
   ['Buy back the cargo at fixed crown rates and ban grain export', 120, { crisis: -18, food: 90, legitimacy: 7 }],
   ['Confiscate the wheat outright and jail the skippers', 0, { food: 60, crisis: -10, unrest: -4 }]
  ]],
  ['Soup Cauldrons in Abbey Courtyards', 'Monks and civic ladies set up copper kettles along town squares, yet flour sacks run low by noon.', [
   ['Fund public bakeries and import salted fish from coastal ports', 110, { crisis: -15, food: 70, piety: 7 }],
   ['Direct rich noble houses to open private manor granaries', 40, { food: 45, loyalty: -3, trust: 8 }],
   ['Ration bread cleanly by parish household tallies', 0, { crisis: -7, stability: 6 }]
  ]],
  ['Sickly Strangers Crowd the Gates', 'Hungry wanderers from parched hills camp outside city ditches, sparking fears of theft and fever.', [
   ['Open wooden shelter sheds and employ able hands on road-ditching', 85, { development: 1, crisis: -12, trust: 9 }],
   ['Set up soup tents outside the gate with clean water barrels', 45, { piety: 8, crisis: -8 }],
   ['Keep city gates guarded while sending bread carts outside', 0, { securityMonths: 6, crisis: -5 }]
  ]],
  ['Harvest Hymns After Hunger', 'New barley sways golden across fields saved by timely relief and honest distribution.', [
   ['Endow permanent municipal famine chests', 75, { stability: 8, food: 50, credit: 6 }],
   ['Host a solemn harvest thanksgiving feast', 35, { piety: 9, trust: 8 }],
   ['Lift emergency grain export bans cleanly', 0, { credit: 5 }]
  ]]
 );

 arc4('et_grain_flood_dikes', 'Disaster', 'flood',
  ['Broken Sea-Dike at Spring Tide', 'Storm-driven surges tear a thirty-yard breach in coastal turf dikes, flooding rich wheat polders in salt water.', [
   ['Mobilize timber piles, willow fascines, and royal dike-engineers', 145, { crisis: -20, development: 1, trust: 10 }],
   ['Dispatch river barges carrying bread, dry clothes, and pitch torches', 75, { crisis: -13, food: 40, trust: 8 }],
   ['Order adjacent parishes to form bucket-and-spade brigades', 0, { crisis: -6, trust: 4, unrest: 2 }]
  ]],
  ['Salt-Spoiled Fields Face Ruin', 'Survivors weep over white crusted soil, fearing pastures will stay barren for three springs.', [
   ['Cut deep freshwater drainage ditches to flush salt swiftly', 90, { crisis: -14, tools: 16, trust: 9 }],
   ['Supply salt-tolerant barley seed and duck flocks', 45, { food: 45, crisis: -8 }],
   ['Exempt flooded parishes from all hearth taxes for five years', 0, { trust: 10, legitimacy: 6 }]
  ]],
  ['Quarrel Over Mill-Dam Heights', 'Inland landowners blame a downstream lord’s high fish-weir for backing up floodwaters across meadows.', [
   ['Order lower flood-gates installed on every river weir cleanly', 60, { legitimacy: 8, trust: 8, stability: 5 }],
   ['Compensate the lord partially to demolish the old weir', 75, { loyalty: 7, trust: 8 }],
   ['Hold a county dike-jury trial to settle damages', 0, { legitimacy: 6 }]
  ]],
  ['Higher Stone-Faced Sea-Walls', 'Reinforced granite-faced dikes stand tall against autumn gales, shielding reclaimed meadowland.', [
   ['Establish a permanent Guild of Dike-Reeves', 65, { credit: 7, stability: 7, development: 1 }],
   ['Plant willow groves along embankments for future fascines', 30, { tools: 12, trust: 6 }],
   ['Close the flood relief ledgers', 0, { stability: 4 }]
  ]]
 );

 // === D. MINING STRIKES, SMELTING & ROYAL ROYALTIES ===
 branch4('et_mine_copper_strike', 'Economy & Trade', 'unrest',
  ['Miners Barricade the Copper Adit', 'Deep-shaft miners block timbered shafts, protesting damp air, broken hoist-ropes, and rising company-store bread prices.', [
   ['Install ventilation air-shafts, hemp safety ropes, and honest pay', 120, { unrest: -11, tools: 20, trust: 10 }],
   ['Mediate fair piece-rates and open independent valley bread stalls', 60, { unrest: -7, food: 30, credit: 5 }],
   ['Send sheriff halberdiers to clear the minehead immediately', 0, { stability: 4, unrest: 6, gold: 45 }]
  ]],
  ['Clean Air & Ringing Picks', 'Wooden fan-wheels spin briskly over fresh air shafts; cheering miners haul bright chalcopyrite ore upward.', [
   ['Gift iron lamps and leather knee-guards to veteran crews', 55, { tools: 18, trust: 8 }],
   ['Grant a small guild hospital fund from copper tenths', 40, { trust: 9, piety: 5 }],
   ['Resume normal smelter shifts briskly', 0, { gold: 65, credit: 4 }]
  ]],
  ['Flooded Sump Below the Fifth Level', 'With pumps idle during the dispute, groundwater rises fast inside rich lower galleries.', [
   ['Hire master water-wheelwrights to build horse-powered rag-pumps', 90, { development: 1, tools: 18, research: 6 }],
   ['Pay double hazard wages to bailers working night relays', 45, { unrest: -5, tools: 12 }],
   ['Abandon the deepest gallery and work upper veins', 0, { gold: 30, tools: 6 }]
  ]],
  ['Copper Ingots for Cannon & Coin', 'Harmonious mining courts yield steady bronze ore for foundries and honest pennies alike.', [
   ['Codify a Royal Mining Charter protecting safety and crown tenths', 60, { legitimacy: 8, credit: 7 }],
   ['Stock reserve copper plates in capital arsenals', 40, { tools: 16, securityMonths: 5 }],
   ['Close the mining dispute', 0, { stability: 4 }]
  ]]
 );

 arc4('et_mine_iron_charcoal', 'Economy & Trade', 'land',
  ['Blast Furnace Hunger for Timber', 'Tall iron furnaces swallow oak coppices whole, alarmingly driving up firewood prices for urban bakers and widows.', [
   ['Mandate coppice replanting rotations and license pit-coal trials', 115, { development: 1, research: 9, trust: 8 }],
   ['Reserve nearby woods for hearth firewood while smelting farther upstream', 55, { trust: 8, credit: 5 }],
   ['Favor ironmasters whose blades equip royal armies', 0, { tools: 18, unrest: 4 }]
  ]],
  ['Water-Hammer Forges Beat Rhythmically', 'River-driven tilt hammers pound glowing blooms into clean bar-iron at half the charcoal waste.', [
   ['Advance guild loans to build three new water-hammer mills', 95, { development: 1, tools: 22, credit: 8 }],
   ['Offer royal prize purses for coal-smelting experiments', 50, { research: 10, prestige: 5 }],
   ['Collect standard hammer-mill stream licenses', 0, { gold: 70 }]
  ]],
  ['Ploughshares Before Swords', 'Country smiths beg for cheaper bar-iron before spring ploughing rather than exporting every ingot abroad.', [
   ['Reserve a third of forge bars for domestic ploughs and wagon tires', 55, { food: 45, trust: 9, tools: 12 }],
   ['Cut internal road tolls on agricultural ironware', 30, { credit: 7, trust: 6 }],
   ['Leave iron sales strictly to highest export bidders', 0, { gold: 85, unrest: 3 }]
  ]],
  ['Forges Glowing in Balance', 'Managed oak coppices and brisk water-hammers keep both hearths warm and anvils ringing.', [
   ['Establish Royal Forest & Forge Wardens', 50, { legitimacy: 7, stability: 6 }],
   ['Display prized native ironwork at the capital fair', 30, { prestige: 7, credit: 5 }],
   ['Archive the forestry rolls', 0, { stability: 4 }]
  ]]
 );

 arc4('et_mine_salt_spring', 'Economy & Trade', 'vassal',
  ['Brine Wells Beneath the Abbey Meadow', 'Boilers tap deeper salty springs whose rich brine cuts wood costs in half—prompting an abbot and baron to fight over royal patent.', [
   ['Mediate a three-way brine consortium sharing pipes and crown dues', 95, { loyalty: 9, piety: 7, credit: 8 }],
   ['Declare deep mineral springs regalian crown domain cleanly', 45, { legitimacy: 9, gold: 85, loyalty: -5 }],
   ['Confirm whichever old parchment seals predate the other', 0, { legitimacy: 6, loyalty: -3 }]
  ]],
  ['Wooden Lead-lined Brine Pipes', 'To carry clear brine down to river coal barges, boilers propose laying hollowed larch pipes across baronial pastures.', [
   ['Pay fair pasture easements and fund leak-proof iron collars', 80, { development: 1, loyalty: 8, credit: 7 }],
   ['Route pipes along existing public road ditches', 35, { trust: 6, credit: 5 }],
   ['Require daily barrel-carts instead of fixed pipes', 0, { stability: 4, tools: 8 }]
  ]],
  ['White Crystals in the Pan-House', 'Snowy coarse salt piles high in oak barrels, prized by dairymaids and coastal herring curers alike.', [
   ['Fix steady winter salt prices for rural parish stores', 50, { food: 45, trust: 9 }],
   ['Stamp crown purity seals on export casks', 30, { credit: 8, prestige: 5 }],
   ['Collect traditional brine-pan royalties', 0, { gold: 90 }]
  ]],
  ['Salt of the Kingdom', 'Shared pipelines turn bitter manor litigation into steady revenue for crown, abbey, and estate.', [
   ['Endow a brine-boilers’ infirmary against steam scalds', 45, { piety: 7, trust: 8 }],
   ['Record the brine-pipe charter in county books', 20, { legitimacy: 6 }],
   ['Close the salt commission', 0, { stability: 4 }]
  ]]
 );

 arc4('et_mine_alum_monopoly', 'Economy & Trade', 'trade',
  ['White Alum Cliffs Along the Coast', 'Quarrymen uncover rich pale alum rock—vital for fixing bright cloth dyes—ending costly foreign dye-salt imports.', [
   ['Back a native alum boiling works with royal patent and port pier', 145, { development: 1, credit: 11, research: 7 }],
   ['Invite skilled foreign alum boilers to train native apprentices', 80, { research: 9, acceptance: 7, credit: 7 }],
   ['Lease cliff quarries rapidly to merchant speculators', 0, { gold: 120, credit: 4 }]
  ]],
  ['Rival Agents Try Poaching Craftsmen', 'Foreign guilds used to holding alum monopolies offer triple silver to lure away key kiln-masters.', [
   ['Grant master boilers noble freehold cottages and loyal stipends', 85, { loyalty: 8, credit: 7, securityMonths: 7 }],
   ['Bind apprentices with clean royal craft charters', 35, { legitimacy: 7, securityMonths: 6 }],
   ['Post watchmen around the boiling pans', 0, { securityMonths: 6, unrest: 2 }]
  ]],
  ['Scarlet & Cobalt Cloth Blooms', 'Native wool weavers rejoice at affordable alum, churning out vivid crimson broadcloths.', [
   ['Subsidize dye-vats for urban textile guilds', 70, { credit: 9, tools: 15, prestige: 6 }],
   ['Host a showcase textile market for foreign buyers', 40, { credit: 8, prestige: 7 }],
   ['Tax exported dyed cloth moderately', 0, { gold: 85 }]
  ]],
  ['Self-Reliant Dye-Works', 'Breaking an external monopoly keeps gold at home and lifts cloth quality across every market town.', [
   ['Patent the coastal alum boiling process cleanly', 50, { research: 7, legitimacy: 6 }],
   ['Inspect harbor weights at the quarry pier', 25, { credit: 6 }],
   ['Close the quarry ledger', 0, { stability: 4 }]
  ]]
 );

 // === E. SILK ROAD & SPICE STRAIT TARIFFS ===
 arc4('et_silk_caravanserai', 'Economy & Trade', 'cont_asia',
  ['Snowbound Caravans at the Pass Gate', 'Camels laden with raw silk and rhubarb freeze outside crowded mud caravanserais while local gatekeepers extort double fodder fees.', [
   ['Build vaulted stone caravanserais with fixed fodder & guard tariffs', 140, { credit: 11, development: 1, trust: 9 }],
   ['Post royal translators and price plaques outside existing inns', 60, { acceptance: 8, credit: 7, trust: 6 }],
   ['Allow innkeepers seasonal winter pricing while waiving gate tax', 0, { gold: 45, credit: 4, unrest: 2 }]
  ]],
  ['Sogdian & Persian Brokers Petition', 'Long-distance caravan elders offer regular silk deliveries if allowed a permanent bonded warehouse courtyard.', [
   ['Grant a chartered Silk Yard with fair dispute magistrates', 85, { credit: 11, acceptance: 9, prestige: 6 }],
   ['Rent royal depot vaults on seasonal contracts', 40, { gold: 65, credit: 6 }],
   ['Require sales strictly at open municipal stalls', 0, { trust: 5, legitimacy: 5 }]
  ]],
  ['Bandit Scouts Shadow the Pass', 'Mountain brigands probe outlying camel corrals hoping to slice silk bales in moonless fog.', [
   ['Station mounted patrol lamps and beacon huts along stages', 75, { securityMonths: 9, credit: 6 }],
   ['Hire armed caravan-leader militias with tax rebates', 35, { securityMonths: 7, trust: 6 }],
   ['Order caravans to travel strictly in armed weekly convoys', 0, { stability: 5 }]
  ]],
  ['Silks & Porcelain Flow Smoothly', 'Reliable safe caravanserais turn barren mountain stages into humming arteries of bullion and news.', [
   ['Mint recognized silver trade coins honored along the road', 65, { credit: 10, prestige: 8 }],
   ['Endow clean cisterns beside every caravanserai gate', 40, { piety: 7, trust: 8 }],
   ['Archive caravan customs tallies', 0, { gold: 60 }]
  ]]
 );

 arc4('et_silk_saharan_gold', 'Economy & Trade', 'cont_africa',
  ['Dusty Gold Dust & Salt Slabs', 'Desert guides bring heavy reed-wrapped salt slabs from northern pans seeking alluvial gold dust and kola nuts along river ports.', [
   ['Charter clean silent-trade weighing houses with royal brass scales', 120, { credit: 11, trust: 10, legitimacy: 6 }],
   ['Dig stone-lined caravan wells and shade groves along the approach', 75, { food: 45, development: 1, trust: 8 }],
   ['Levy standard salt-slab customs at the river gate', 0, { gold: 95, credit: 4 }]
  ]],
  ['Quarrel Over Sand-Filled Dust', 'An angry river broker accuses desert drovers of mixing fine river quartz grit into gold dust pouches.', [
   ['Install royal touchstone assayers at the weighing bench', 55, { credit: 9, legitimacy: 8, trust: 7 }],
   ['Require sealed leather assay pouches stamped by clan elders', 30, { acceptance: 8, stability: 5 }],
   ['Impound suspect gold until melted in open crucible', 0, { securityMonths: 7, gold: 45 }]
  ]],
  ['Scholarly Books Ride With Salt', 'Alongside salt slabs, desert merchants unpack ink-horns, paper reams, and astronomy treatises bound in red goat-leather.', [
   ['Buy scholarly paper reams and books for court academies', 80, { research: 11, prestige: 8 }],
   ['Grant book-carrying caravans half-price customs tolls', 35, { research: 7, acceptance: 7 }],
   ['Inspect manuscripts politely before taxing bindings', 0, { credit: 5, securityMonths: 5 }]
  ]],
  ['Golden River Quay', 'Honest scales and cool wells bind oasis and river towns in thriving reciprocal trade.', [
   ['Reward loyal caravan guides with embroidered robes', 45, { prestige: 8, trust: 8 }],
   ['Pave stone landing ramps down to river canoes', 55, { development: 1, credit: 7 }],
   ['Close the seasonal caravan rolls', 0, { gold: 65 }]
  ]]
 );

 arc4('et_silk_strait_lighthouse', 'Economy & Trade', 'crossroads_oceanic',
  ['Wrecked Pepper Carracks on the Reef', 'Sudden monsoon squalls smash two richly laden merchantmen onto unmarked coral reefs outside the main strait harbor.', [
   ['Erect a granite coastal lighthouse tower and buoy channel', 155, { development: 1, credit: 11, prestige: 9 }],
   ['Hire local skiffs to salvage pepper chests and station pilot canoes', 65, { credit: 8, trust: 8 }],
   ['Claim traditional royal flotsam rights on washed-up chests', 0, { gold: 105, trust: -5, credit: -3 }]
  ]],
  ['Dispute Over Wreckage Salvage', 'Foreign shipmasters protest shore bailiffs seizing dried nutmeg barrels saved by fishermen.', [
   ['Pass clear humane Wreck Law returning salvaged cargo for ten-percent finder fee', 55, { credit: 10, acceptance: 9, legitimacy: 7 }],
   ['Split rescued goods cleanly through admiralty arbiters', 30, { trust: 7, credit: 5 }],
   ['Uphold ancient shore customs firmly', 0, { gold: 55, acceptance: -4 }]
  ]],
  ['Oil Lamps & Parabolic Mirrors', 'Master brass-founders craft polished copper reflectors to project lighthouse flames miles across midnight swells.', [
   ['Fund permanent whale-oil lamp reserves and keeper cottages', 75, { research: 8, securityMonths: 8, credit: 7 }],
   ['Require modest light-pennies per anchored tonnage to sustain fuel', 30, { credit: 6, gold: 45 }],
   ['Staff the tower with harbor garrison shifts', 0, { securityMonths: 6 }]
  ]],
  ['Beacon Over the Strait', 'Ships from distant ports steer boldly toward your gleaming headland light, swelling port duties year-round.', [
   ['Print updated strait reef charts for incoming captains', 50, { research: 9, credit: 8 }],
   ['Bless the lighthouse keeper guild', 25, { piety: 6, trust: 6 }],
   ['Log steady customs gains', 0, { gold: 80 }]
  ]]
 );

 arc4('et_silk_customs_tariff', 'Economy & Trade', 'trade',
  ['Double Tolls on the Silk Road', 'Provincial toll-farmers stack three separate bridge and gate fees within twenty miles, driving silk caravans onto neighboring detours.', [
   ['Consolidate fragmented tolls into one clean border customs receipt', 100, { credit: 12, trust: 10, development: 1 }],
   ['Buy out two private noble bridge-tolls outright', 135, { credit: 10, loyalty: 7, trust: 9 }],
   ['Warn toll-collectors sharply against unlawful surcharges', 0, { legitimacy: 6, credit: 4, loyalty: -3 }]
  ]],
  ['Toll-Farmers Lobby Council Peers', 'Angry tax-lessees claim unified receipts ruin their honest investments and threaten to withhold advance rents.', [
   ['Refund fair unexpired lease balances and employ them as salaried clerks', 80, { legitimacy: 8, stability: 6, credit: 6 }],
   ['Grant them customs-warehouse concessions instead of road barriers', 40, { credit: 8, loyalty: 5 }],
   ['Audit their old chests to prove massive over-collection', 0, { gold: 75, legitimacy: 6 }]
  ]],
  ['Caravans Swing Back Through Your Gate', 'Hearing of one single clear toll, foreign camel-trains return down the valley road in long gleaming files.', [
   ['Pave stone wheel-tracks along muddy bazaar approaches', 75, { development: 1, credit: 8 }],
   ['Open multilingual exchange desks beside the gatehouse', 40, { acceptance: 8, credit: 6 }],
   ['Collect steady brisk single-gate tolls', 0, { gold: 95 }]
  ]],
  ['Artery of Commerce', 'Streamlined customs turn stagnant border trails into the busiest trading highway in the region.', [
   ['Inscribe uniform toll tables in stone beside every city gate', 45, { legitimacy: 8, trust: 8 }],
   ['Endow shaded caravan watering troughs', 35, { piety: 6, trust: 7 }],
   ['Archive the customs reform', 0, { stability: 4 }]
  ]]
 );

 // === F. BANKING CHARTERS & BILLS OF EXCHANGE ===
 branch4('et_bank_bourse_charter', 'Economy & Trade', 'crossroads_finance',
  ['Merchants Seek a Public Bourse', 'Bankers and wool factors petition to erect a stone Exchange Courtyard where bills of exchange clear daily under royal seal.', [
   ['Charter the Sovereign Exchange with public clearing courts', 150, { credit: 14, development: 1, prestige: 9 }],
   ['Rent guildhall arcades for trial clearing afternoons twice weekly', 65, { credit: 9, trust: 7 }],
   ['Forbid speculative bill trading lest usury rumors stir unrest', 0, { piety: 7, faithAuthority: 5, credit: -4 }]
  ]],
  ['Bills Circling Without Heavy Chests', 'Merchants settle spice and timber debts across three kingdoms with crisp ink notes rather than hauling mule-trains of silver.', [
   ['Require audited reserve books from every clearing house', 65, { credit: 10, inflation: -2, legitimacy: 7 }],
   ['Issue short-term royal treasury notes at modest discount', 45, { gold: 95, credit: 6 }],
   ['Appoint two respected aldermen as exchange wardens', 0, { stability: 6, trust: 6 }]
  ]],
  ['Curbside Rumor Sparks Panic', 'Street-corner gossips whisper that a foreign syndicate defaulted, sending bill-holders crowding the oak shutters.', [
   ['Inspect the syndicate’s vaults openly and back solvent paper', 90, { credit: 11, stability: 7 }],
   ['Suspend panicked curbside trading for forty-eight hours of calm audit', 30, { securityMonths: 7, stability: 5 }],
   ['Let weak speculators fail while shielding municipal deposits', 0, { legitimacy: 6, credit: -3 }]
  ]],
  ['Capital of Reliable Credit', 'Clear clearing courts lower interest rates for shipbuilders, farmers, and crown loans alike.', [
   ['Publish standardized mercantile law digests from the bourse', 60, { research: 9, legitimacy: 7 }],
   ['Display gilded merchant clocks above the courtyard', 35, { prestige: 8 }],
   ['Close the bourse charter docket', 0, { credit: 5 }]
  ]]
 );

 arc4('et_bank_pawn_montes', 'Economy & Trade', 'debt',
  ['Predatory Moneylenders in the Quarters', 'Desperate artisans pawn winter tools to crooked lenders charging fifty percent a quarter, fueling bitter street resentment.', [
   ['Endow a civic charitable Monte di Pietà lending at fair tiny fees', 135, { trust: 13, credit: 9, unrest: -9 }],
   ['Cap legal interest rates strictly and open guild emergency loan chests', 65, { legitimacy: 8, unrest: -6, credit: 6 }],
   ['Expel notorious loan-sharks and annul unlawful compound pledges', 0, { unrest: -5, prestige: 4, credit: -3 }]
  ]],
  ['Clergy Debate Charitable Interest', 'Traditional preachers question whether even five-percent administrative fees on civic pawns skirt sacred usury bans.', [
   ['Frame fees strictly as clerk wages blessed by bishopric visitors', 50, { piety: 9, faithAuthority: 7, legitimacy: 6 }],
   ['Allow pious donations to cover clerk wages for zero-interest loans', 80, { piety: 12, trust: 10 }],
   ['Keep secular town magistrates running the pawn registry cleanly', 0, { legitimacy: 6, stability: 4 }]
  ]],
  ['Redeemed Looms & Saddles', 'Artisans reclaim pledged iron tools before spring fairs, roaring back into steady tax-paying production.', [
   ['Pair small loans with free guild bookkeeping lessons', 55, { research: 7, credit: 7, trust: 7 }],
   ['Expand pawn vaults to store pledged grain sacks safely', 45, { food: 40, development: 1 }],
   ['Audit monthly pledge books cleanly', 0, { stability: 5 }]
  ]],
  ['Credit Without Ruin', 'Honest civic lending rescues thousands of households from debt slavery and stabilizes urban peace.', [
   ['Charter sister civic loan-houses in two provincial towns', 75, { development: 1, credit: 9, trust: 8 }],
   ['Publish annual transparent ledger plaques', 25, { legitimacy: 7 }],
   ['Close the civic lending review', 0, { stability: 4 }]
  ]]
 );

 arc4('et_bank_foreign_syndicate', 'Economy & Trade', 'debt',
  ['Foreign Bankers Demand Crown Customs Pledge', 'Lombard or Hanseatic creditors press to collect harbor duties directly at your piers until old crown war-loans clear.', [
   ['Refinancing via native merchant syndicate keeps customs in crown hands', 130, { credit: 11, legitimacy: 9, stability: 6 }],
   ['Accept brief joint customs audits without surrendering pier keys', 55, { credit: 8, securityMonths: 6 }],
   ['Grant them temporary wharf booths until principal drops', 0, { gold: 75, legitimacy: -5, credit: 4 }]
  ]],
  ['Native Merchants Step Forward', 'Domestic syndicates rally proudly, offering silver if granted saltpeter and wool export preferences.', [
   ['Grant balanced export privileges tied to transparent bookkeeping', 70, { credit: 10, trust: 8, loyalty: 6 }],
   ['Issue stamped royal annuity bonds paying reliable harvest silver', 45, { credit: 9, stability: 5 }],
   ['Thank them and pay foreign creditors cleanly in bullion', 0, { credit: 6, prestige: 6 }]
  ]],
  ['Disputed Exchange Agio', 'Bankers argue fiercely over currency conversion rates on maturity day, threatening sudden penalty fees.', [
   ['Appoint neutral jurists and assay masters to lock exact bullion weight', 50, { legitimacy: 8, credit: 8 }],
   ['Settle half early in commodities like tin and timber', 35, { credit: 6, tools: 12 }],
   ['Hold bankers strictly to original parchment terms', 0, { legitimacy: 6 }]
  ]],
  ['Keys Stay With the Crown', 'Clearing debt through native partnerships strengthens both sovereignty and royal creditworthiness.', [
   ['Publish an annual Crown Debt & Revenue Ledger', 50, { credit: 10, legitimacy: 8 }],
   ['Host grateful native syndicates at palace banquet', 35, { prestige: 7, trust: 6 }],
   ['Seal the retired loan parchments', 0, { stability: 4 }]
  ]]
 );

 arc4('et_bank_marine_insurance', 'Economy & Trade', 'crossroads_finance',
  ['Storm Losses Ruin Bold Captains', 'After three winter wrecks bankrupt honest coastal families, skippers refuse sailing past autumn equinoxes without insurance.', [
   ['Charter a royal-backed Marine Insurance Chamber pooling hull risks', 135, { credit: 13, development: 1, research: 7 }],
   ['Back mutual guild wreck-chests with modest customs rebates', 65, { credit: 9, trust: 8 }],
   ['Encourage private merchant syndicates to underwrite policies', 0, { credit: 6, prestige: 4 }]
  ]],
  ['Suspicious Wreck Off Rocky Point', 'Underwriters refuse paying out on a scuttled old hulk whose cargo barrels floated suspiciously light—filled with sawdust.', [
   ['Hold swift admiralty fraud trials and reward honest sailors who spoke up', 55, { legitimacy: 9, securityMonths: 8, credit: 7 }],
   ['Require pre-voyage royal cargo inspections before sealing policies', 40, { credit: 8, securityMonths: 7 }],
   ['Let chamber arbiters settle the claim quietly', 0, { stability: 5, credit: 3 }]
  ]],
  ['Winter Convoy Sails Confidently', 'With honest insurance backing seaworthy hulls, grain and wool keep moving straight through stormy months.', [
   ['Build coastal storm-flag stations warning captains of falling barometers', 75, { research: 8, development: 1, trust: 7 }],
   ['Standardize printed sea-policy forms across every port', 40, { research: 7, credit: 7 }],
   ['Collect steady winter harbor customs', 0, { gold: 90 }]
  ]],
  ['Shield Against the Sea', 'Marine underwriting spreads risk across scores of merchants, transforming coastal enterprise.', [
   ['Extend insurance models to overland spice caravans', 65, { credit: 10, research: 6 }],
   ['Archive the admiralty insurance rulings', 25, { legitimacy: 6 }],
   ['Close the maritime chamber review', 0, { stability: 4 }]
  ]]
 );

 // === G. PLAGUE QUARANTINE VS MARKET FAIRS ===
 branch4('et_plag_harbor_lazaretto', 'Disaster', 'epidemic',
  ['Black Flags on the Spice Carrack', 'A spice ship drops anchor flying yellow fever-flags after losing six deckhands at sea; merchants clamor to unload silk bales before the fair.', [
   ['Enforce forty-day island quarantine and build a stone lazaretto', 145, { crisis: -20, trust: 10, securityMonths: 8 }],
   ['Unload and air silk bales in vinegar-smoked sheds outside walls', 75, { crisis: -12, credit: 6, trust: 6 }],
   ['Let healthy sailors land quietly after quick barber inspection', 0, { gold: 65, crisis: 5, unrest: 4 }]
  ]],
  ['Forty Days Behind White Stones', 'Doctors in waxed linen cloaks inspect quarantined sailors daily while skiffs ferry fresh citrus and mutton out.', [
   ['Fund clean cisterns and paid hospital nurses at the lazaretto', 80, { crisis: -14, piety: 7, trust: 9 }],
   ['Compensate detained captains modestly for perished fresh fruit', 45, { credit: 7, acceptance: 6 }],
   ['Hold armed harbor cutters circling the island strictly', 0, { securityMonths: 8, crisis: -6 }]
  ]],
  ['Frightened Rumors Inside Town', 'Despite outer locks, tavern panic breaks out over two feverish tailors near the cloth lane.', [
   ['Cordone the lane cleanly with royal doctors, food baskets, and lime', 90, { crisis: -14, trust: 9, unrest: -6 }],
   ['Ban crowded tavern wakes temporarily while keeping markets open outdoors', 35, { crisis: -8, stability: 5 }],
   ['Allow wealthy citizens to ride to country estates quietly', 0, { unrest: 5, stability: -3 }]
  ]],
  ['Clean Bill of Health Raised', 'With zero wider outbreak inside city walls, foreign ports hail your harbor’s disciplined quarantine.', [
   ['Establish a permanent Board of Harbor Health', 65, { research: 9, credit: 9, crisis: -6 }],
   ['Hold a solemn cathedral thanksgiving service', 30, { piety: 9, trust: 7 }],
   ['Reopen full market gates cleanly', 0, { credit: 6 }]
  ]]
 );

 arc4('et_plag_autumn_fair', 'Disaster', 'crisis',
  ['Cancel the Great Autumn Fair?', 'Fever haunts neighboring river towns days before your capital’s biggest annual wool and cattle fair draws thousands of peddlers.', [
   ['Postpone the fair and reimburse local innkeepers’ preparations', 135, { crisis: -18, trust: 11, unrest: -6 }],
   ['Shift booths outside city walls onto breezy riverside meadows with doctors', 75, { crisis: -10, credit: 7, trust: 6 }],
   ['Hold the fair normally lest canceled rents ruin town coffers', 0, { gold: 95, crisis: 4, unrest: 4 }]
  ]],
  ['Merchants Camp at the Turnpike', 'Turned-away drovers camp across muddy fields, begging to sell perishable cheeses and hides without entering walls.', [
   ['Set up fenced open-air exchange barriers with vinegar coin-bowls', 65, { credit: 8, crisis: -10, food: 35 }],
   ['Buy surplus perishable butter and meat directly for royal stores', 75, { food: 60, crisis: -8 }],
   ['Escort foreign drovers gently back down the main road', 0, { securityMonths: 7, crisis: -5 }]
  ]],
  ['Physicians Urge Street Cleansing', 'Town doctors warn piled butcher offal and stagnant gutters breed summer miasma.', [
   ['Hire night scavengers, pave gutter drains, and flush market squares', 95, { development: 1, crisis: -14, trust: 9 }],
   ['Fine tanners and butchers dumping waste above town wells', 30, { legitimacy: 7, crisis: -7 }],
   ['Burn aromatic juniper and pine tar braziers at crossroads', 0, { crisis: -4, piety: 4 }]
  ]],
  ['Healthy Bells Over Clean Cobbles', 'Crisp frost clears lingering sickness; paved market drains stay clean for decades afterward.', [
   ['Keep permanent street-scavenger guilds on civic rolls', 55, { development: 1, trust: 8 }],
   ['Reschedule a triumphant Spring Cloth Fair', 40, { credit: 9, prestige: 6 }],
   ['Close the crisis health board', 0, { stability: 4 }]
  ]]
 );

 arc4('et_plag_fire_insurance', 'Disaster', 'fire',
  ['Blaze in the Tallow & Hemp Quarter', 'An overturned cauldron of pitch sends flames leaping across wooden shingle roofs toward crowded spice warehouses.', [
   ['Pull down firebreak houses cleanly and compensate owners immediately', 145, { crisis: -19, trust: 11, stability: 7 }],
   ['Equip parish fire-hooks, leather buckets, and stone water cisterns', 80, { crisis: -13, development: 1, trust: 8 }],
   ['Rally guild apprentices in wet-blanket bucket chains', 0, { crisis: -7, trust: 5 }]
  ]],
  ['Timber Shingles Banned on New Roofs', 'Fire wardens urge outlawing thatch and split pine shingles inside dense inner parishes.', [
   ['Subsidize clay roof tiles and brick party-walls for poor artisans', 105, { development: 1, crisis: -14, trust: 10 }],
   ['Mandate slate or tile strictly on new workshops and inns', 40, { legitimacy: 7, crisis: -7 }],
   ['Require every household to keep two filled water barrels by doors', 0, { crisis: -5, stability: 4 }]
  ]],
  ['Looters Caught Among Smoking Beams', 'Constables catch opportunists hauling scorched velvet bolts out of collapsed merchant cellars.', [
   ['Post night soldiers over ruins and open fair lost-property booths', 55, { securityMonths: 9, trust: 9 }],
   ['Execute hardened arsonists while pardoning hungry bread-snatchers', 25, { legitimacy: 7, stability: 5 }],
   ['Store salvaged goods inside town hall vaults', 0, { securityMonths: 6, credit: 4 }]
  ]],
  ['Brick & Slate Rise From Ashes', 'Broadened stone streets and tiled gables leave the merchant quarter safer and handsomer than before.', [
   ['Charter a salaried Civic Fire Watch with brass trumpets', 60, { securityMonths: 8, trust: 8 }],
   ['Print fire-safety ordinances for neighboring towns', 30, { research: 6, prestige: 5 }],
   ['Close the fire recovery fund', 0, { stability: 4 }]
  ]]
 );

 // === H. ADDITIONAL 45 ECONOMY & TRADE ARCS (180 STAGES) TO HIT 65 CHAINS = 260 STAGES ===
 arc4('et_econ_canal_lock', 'Economy & Trade', 'land',
  ['Barges Dragged Over Gravel Shoals', 'Dry summers turn river shallows impassable; ox teams charge ruinous fees hauling wool sacks past sandbars.', [
   ['Cut a stone-lined bypass canal with twin oak pound-locks', 165, { development: 1, credit: 12, food: 40 }],
   ['Dredge gravel bars and build wooden wing-dams to deepen channel', 80, { credit: 8, tools: 15, trust: 6 }],
   ['Maintain ox-portage tracks along the riverbank', 0, { credit: 4, trust: 4 }]
  ]],
  ['Water-Millers Fear Lost Head', 'Downstream grain millers protest that canal locks will steal river water needed to turn heavy millstones.', [
   ['Pair canal sluices with modern overshot millwheels for affected mills', 85, { tools: 18, trust: 10, food: 35 }],
   ['Schedule lock-openings strictly during morning and evening hours', 35, { legitimacy: 7, trust: 6 }],
   ['Refer mill-head disputes to county water assizes without treasury grants', 0, { stability: 5, legitimacy: 4 }]
  ]],
  ['Toll Barges Test the First Lock', 'Citizens crowd embankments cheering as twin oak gates seal tight and float a thirty-ton grain keel uphill.', [
   ['Keep lock tolls low for food, coal, and building stone', 50, { food: 45, credit: 9, trust: 8 }],
   ['Lease lock maintenance cleanly to the boatmen’s guild', 30, { credit: 7, loyalty: 5 }],
   ['Collect royal lock tolls from day one', 0, { gold: 90, credit: 4 }]
  ]],
  ['Inland Harbor Unlocked', 'Cheap barge haulage slashes timber and grain prices across inland towns overnight.', [
   ['Build covered brick wharf warehouses at the upper basin', 70, { development: 1, credit: 9 }],
   ['Record hydraulic lock designs in royal engineering rolls', 35, { research: 8, prestige: 6 }],
   ['Close the canal commission', 0, { stability: 4 }]
  ]]
 );

 arc4('et_econ_paper_mill', 'Economy & Trade', 'land',
  ['Rags Turned to Crisp Parchment', 'Master papermakers seek riverside water rights to pound linen rags into smooth white sheets cheaper than calfskin vellum.', [
   ['Grant clean upstream water rights and fund stamper water-wheels', 130, { development: 1, research: 11, credit: 8 }],
   ['Charter the mill if linen rag collectors stay licensed locally', 55, { credit: 7, research: 7 }],
   ['Protect traditional monastery vellum-parchment makers first', 0, { piety: 7, faithAuthority: 5 }]
  ]],
  ['Old Rags Become Valuable Trade', 'Rag-and-bone peddlers comb whole counties trading copper pins for worn linen shirts.', [
   ['Exempt domestic linen rag carts from road tolls', 45, { credit: 7, research: 6, trust: 5 }],
   ['Ban exporting clean linen rags abroad to feed native mills', 25, { tools: 12, credit: 5 }],
   ['Let scrap dealers bargain freely', 0, { gold: 35, credit: 3 }]
  ]],
  ['Watermarked Crown Chancery Paper', 'Crisp watermarked sheets drop clerk expenses by half across courts, bourses, and town schools.', [
   ['Order uniform watermarked paper for all tax and court rolls', 55, { legitimacy: 8, securityMonths: 8, research: 6 }],
   ['Supply cheap paper reams to parish grammar schools', 45, { research: 9, trust: 7 }],
   ['Sell surplus reams to foreign printing houses', 0, { gold: 90, credit: 5 }]
  ]],
  ['White Sheets Across the Realm', 'Cheap, crisp domestic paper fuels literacy, commerce, and reliable record-keeping.', [
   ['Establish a permanent Royal Paper Mill Guild', 50, { credit: 8, prestige: 6 }],
   ['Inspect downstream fish-weirs to keep bleaching lime clear', 30, { trust: 7, food: 25 }],
   ['Close the water-rights charter', 0, { stability: 4 }]
  ]]
 );

 arc4('et_econ_glass_guild', 'Economy & Trade', 'trade',
  ['Secret Sand-Furnaces of the Lagoon', 'Venetian-trained glassblowers offer to build crystal mirror and spectacle kilns if granted fuel wood and strict trade secrecy.', [
   ['Build a brick glasshouse island and patent spectacle lenses', 140, { research: 12, prestige: 10, credit: 9 }],
   ['Fund clear window-panes and apothecary phials for city halls', 75, { development: 1, credit: 7, trust: 6 }],
   ['Tax foreign luxury mirror imports heavily instead', 0, { gold: 95, credit: 3 }]
  ]],
  ['Reading Lenses Astonish Elder Clerks', 'Grey-bearded treasury auditors trying convex spectacles gasp as blurred ledger ink snaps sharp.', [
   ['Order spectacles for every aging court judge and chancery scribe', 65, { research: 9, legitimacy: 8 }],
   ['Sponsor ground-glass experiments for coastal spyglasses', 55, { research: 10, securityMonths: 6 }],
   ['Market spectacles briskly at capital bookshops', 0, { gold: 80, credit: 6 }]
  ]],
  ['Night Watch Catches Kiln Spy', 'Rival agents try bribing apprentice blowers to steal potash and manganese crystal ratios.', [
   ['Grant guild blowers citizen privileges and guard furnace gates', 65, { securityMonths: 9, trust: 8 }],
   ['Require sealed oath books from every furnace master', 25, { legitimacy: 6, securityMonths: 6 }],
   ['Expel suspicious foreign peddlers cleanly', 0, { securityMonths: 7 }]
  ]],
  ['Light Through Clear Crown Glass', 'Glazed hall windows and crystal lenses elevate native craft into Europe’s and Asia’s finest fairs.', [
   ['Commission stained-glass windows for the capital guildhall', 60, { prestige: 10, piety: 6 }],
   ['Export crystal ware under royal seal', 30, { gold: 95, credit: 7 }],
   ['Close the glasshouse patent', 0, { stability: 4 }]
  ]]
 );

 arc4('et_econ_herring_coop', 'Economy & Trade', 'food',
  ['Gale Strands Fishing Crews Ashore', 'Uncharted sandbars and rotted harbour pilings trap fifty herring boats ashore just as autumn shoals surge past.', [
   ['Dredge the harbor mouth and fund sturdy timber oak slipways', 135, { food: 90, development: 1, trust: 10 }],
   ['Advance salt-barrel loans and hemp nets to fishing families', 70, { food: 65, credit: 6, trust: 8 }],
   ['Waive landing fish-tithes for the stormy season', 0, { food: 35, trust: 6 }]
  ]],
  ['Dispute Over Brine Barrels', 'Coopers demand monopoly fees on every herring barrel, threatening to leave catches rotting on shingle beaches.', [
   ['Import seasoned oak staves and break restrictive cooper caps', 75, { food: 55, credit: 8, tools: 12 }],
   ['Fix fair barrel prices jointly between coopers and fishermen', 30, { trust: 8, stability: 5 }],
   ['Permit temporary dry-salting in stone vats', 0, { food: 35, credit: 3 }]
  ]],
  ['Smoke-Houses Along the Spit', 'Brisk fires cure thousands of plump red herrings packed neatly for winter wagon routes inland.', [
   ['Contract royal army and hospital fish rations directly from the spit', 70, { food: 50, credit: 7, loyalty: 5 }],
   ['Inspect barrel grades with a royal crown-and-anchor brand', 30, { credit: 8, prestige: 5 }],
   ['Open Saturday harbor fish auctions cleanly', 0, { gold: 65, food: 30 }]
  ]],
  ['Silver From the Sea', 'Well-equipped fishing fleets feed inland winters while filling coastal cottages with honest wages.', [
   ['Build a small stone lifeboat house on the headland', 55, { trust: 9, prestige: 6 }],
   ['Endow mariners’ widows’ alms', 35, { piety: 7, trust: 7 }],
   ['Close the fishery ledger', 0, { stability: 4 }]
  ]]
 );

 arc4('et_econ_wool_enclosure', 'Economy & Trade', 'unrest',
  ['Hedges Around Common Pasture', 'Wealthy landlords fence off common village grazing meadows for booming wool sheep, leaving cottagers without milk cows.', [
   ['Tear down unlawful fences and protect common tillage by statute', 95, { unrest: -12, trust: 12, food: 40 }],
   ['Require fenced sheep-walks to reserve ample arable strips and dairies', 50, { unrest: -7, stability: 6, credit: 5 }],
   ['Permit enclosures so long as landlords pay higher wool-export tax', 0, { gold: 95, credit: 5, unrest: 6 }]
  ]],
  ['Petitions Packed Outside County Court', 'Displaced ploughmen march quietly carrying broken spades and ancient village charter rolls.', [
   ['Appoint impartial royal enclosure commissioners to walk boundary hedges', 75, { legitimacy: 9, unrest: -8, trust: 9 }],
   ['Resettle landless families onto drained fenland crown plots', 85, { development: 1, food: 55, trust: 8 }],
   ['Promise fair hearing at the next spring assizes', 0, { stability: 4, unrest: 2 }]
  ]],
  ['Clothiers Warn Against Lost Fleeces', 'Urban wool-staplers fret that banning sheep runs outright will starve looms and shrink port customs.', [
   ['Balance uplands for hardy sheep flocks and rich valleys for wheat', 65, { food: 45, credit: 8, trust: 7 }],
   ['Tax uncultivated wasteland enclosures heavily to fund granaries', 30, { food: 40, legitimacy: 6 }],
   ['Keep open meadows regulated by parish manor courts', 0, { stability: 5, loyalty: 4 }]
  ]],
  ['Green Corn & White Fleeces Together', 'Balanced agrarian statutes preserve both village bread and booming loom exports.', [
   ['Publish the Royal Commons & Husbandry Statute', 45, { legitimacy: 8, trust: 8 }],
   ['Distribute iron-shod ploughs to restored village holdings', 55, { tools: 18, food: 35 }],
   ['Close the land commission', 0, { stability: 4 }]
  ]]
 );

 arc4('et_econ_printing_almanac', 'Economy & Trade', 'crossroads_finance',
  ['Printed Market Price Broadsheets', 'Enterprising printers offer weekly broadsheets listing grain, wool, and currency exchange rates across twelve cities.', [
   ['Sponsor reliable weekly commercial price sheets under royal stamp', 110, { credit: 12, research: 10, trust: 7 }],
   ['License private guild newsletters subject to anti-rumor fines', 45, { credit: 8, securityMonths: 6 }],
   ['Forbid rapid price printing lest speculators corner rural grain', 0, { stability: 5, trust: 5, credit: -3 }]
  ]],
  ['Counterfeit Price Rumors', 'Unscrupulous brokers print fake harvest-blight sheets to panic barley prices upward before market dawn.', [
   ['Require signed municipal clerk seals on every published price table', 55, { legitimacy: 9, inflation: -2, credit: 8 }],
   ['Arrest fake broadsheet hawkers and burn fraudulent sheets', 25, { securityMonths: 8, stability: 5 }],
   ['Post official town-criers at bells to announce real prices', 0, { trust: 7, stability: 4 }]
  ]],
  ['Farmers Consult Harvest Calendars', 'Cheap printed almanacs carry crop-rotation notes, dike-repair dates, and honest bushel tables into parish inns.', [
   ['Distribute free royal husbandry pamphlets to village curates', 70, { food: 55, research: 8, trust: 9 }],
   ['Add verified road-distance and toll charts to every almanac', 40, { credit: 8, research: 5 }],
   ['Allow printers to sell almanacs freely at country fairs', 0, { credit: 5, gold: 40 }]
  ]],
  ['Clear Signals Across Markets', 'Transparent pricing shrinks wild regional gluts and famines, knitting provinces into one lively market.', [
   ['Establish a permanent Royal Statistical Registry', 60, { research: 9, legitimacy: 7, credit: 7 }],
   ['Thank guild printers with brass crown stamps', 25, { prestige: 6 }],
   ['Close the almanac review', 0, { stability: 4 }]
  ]]
 );

 arc4('et_econ_guild_apprentice', 'Economy & Trade', 'lowtrust',
  ['Cruel Masters & Fleeing Apprentices', 'Runaway metalworking lads flood royal courts with bruised ribs, alleging masters starve youths for seven years without teaching trade secrets.', [
   ['Enforce clear five-year apprentice charters with humane magistrates', 90, { trust: 11, acceptance: 7, tools: 12 }],
   ['Require guild examiners to test youths cleanly at year four', 45, { research: 7, trust: 7, credit: 5 }],
   ['Uphold strict paternal guild authority while fining cruel beatings', 0, { legitimacy: 5, stability: 4 }]
  ]],
  ['Masters Threaten Closed Workshops', 'Stubborn elders grumble that coddled youths will ruin traditional craft discipline and leave looms idle.', [
   ['Pair humane rules with modest state tool-grants upon graduation', 85, { tools: 18, credit: 8, trust: 8 }],
   ['Compensate honest masters for training poor orphans', 60, { piety: 7, trust: 8 }],
   ['Remind elders that skilled youths build their city’s fame', 0, { prestige: 6, stability: 4 }]
  ]],
  ['Free Journeyman Halls Open', 'Newly certified smiths and weavers open nimble workshops in outer suburbs, sparking fresh tool designs.', [
   ['Grant suburban newcomers fair stall access at city fairs', 55, { credit: 9, development: 1 }],
   ['Sponsor an annual Craft Prize for finest clock, blade, or cloth', 65, { prestige: 10, research: 8 }],
   ['Collect modest license stamps cleanly', 0, { gold: 70 }]
  ]],
  ['Pride of the Workbench', 'Fair apprentice laws double skilled workshop hands across the realm within half a decade.', [
   ['Publish a Model Guild Apprenticeship Charter', 45, { legitimacy: 7, credit: 6 }],
   ['Endow an evening literacy school for young smiths', 50, { research: 9, trust: 7 }],
   ['Close the craft inquiry', 0, { stability: 4 }]
  ]]
 );

 arc4('et_econ_windmills', 'Economy & Trade', 'food',
  ['Still Brooks Freeze Water-Mills', 'Winter frost locks waterwheels fast in river ice, stalling flour grinding across three inland districts.', [
   ['Subsidize tall brick post-windmills on windy chalk ridges', 140, { development: 1, food: 75, tools: 16 }],
   ['Distribute heavy stone hand-querns and horse-mills to parishes', 70, { food: 50, trust: 8 }],
   ['Employ laborers with iron crowbars breaking ice off wheel-paddles', 0, { food: 25, unrest: -3 }]
  ]],
  ['Wind-Rights Feud With Neighboring Lords', 'Noblemen sue millers claiming tall windmill sails frighten hunting hawks and steal wind across manor boundaries.', [
   ['Rule firmly in crown court that wind belongs freely to God and realm', 45, { legitimacy: 9, trust: 10, food: 35 }],
   ['Pay modest hillside ground-rents to settle noble pride peacefully', 60, { loyalty: 8, trust: 6 }],
   ['Site royal mills exclusively on high crown heathland', 0, { stability: 5, food: 25 }]
  ]],
  ['Sailcloth Canvas & Rotating Caps', 'Clever millwrights add rotating wooden turrets so sails catch shifting gusts effortlessly.', [
   ['Award a royal patent and publish windmill blueprints nationwide', 75, { research: 11, credit: 7, prestige: 6 }],
   ['Exempt sailcloth weavers from guild fees for mills', 35, { credit: 6, food: 30 }],
   ['Build two more crown ridge-mills before spring', 0, { development: 1, food: 35 }]
  ]],
  ['Turning Sails Against Every Famine', 'Even when winter freezes every stream solid, flour sacks pour briskly down from windy hills.', [
   ['Stock spare millstones at central county depots', 45, { tools: 15, food: 30 }],
   ['Host a spring bakers’ bread-festival on the ridge', 25, { trust: 8, prestige: 5 }],
   ['Close the milling project', 0, { stability: 4 }]
  ]]
 );

 arc4('et_econ_river_smugglers', 'Economy & Trade', 'trade',
  ['Moonless Skiffs Below the Toll Chain', 'Customs ledgers drop sharply while cheap foreign wine floods river taverns untaxed—betraying night smugglers.', [
   ['Deploy swift customs galleys and simplify overly complex tariffs', 110, { credit: 10, securityMonths: 9, gold: 65 }],
   ['Lower wine duties slightly to undercut smugglers’ profit margins', 45, { credit: 8, trust: 7, gold: 45 }],
   ['Double watch patrols and seize suspicious riverside cellars', 0, { securityMonths: 8, gold: 75, unrest: 3 }]
  ]],
  ['Fishermen Caught Between Knives', 'Honest boatmen confess smugglers threaten to burn their nets unless they ferry silk bundles through fog.', [
   ['Protect coastal families with garrison beacons and reward tips', 70, { securityMonths: 9, trust: 9 }],
   ['Offer generous amnesty for smugglers turning informant cleanly', 25, { securityMonths: 7, stability: 5 }],
   ['Enforce strict evening landing curfews on small craft', 0, { legitimacy: 5, unrest: 2 }]
  ]],
  ['Bribed Customs Clerk Exposed', 'Ledgers reveal an underpaid harbor clerk selling official wax customs passes at midnight.', [
   ['Raise honest clerk stipends and rotate gate keys weekly', 75, { legitimacy: 8, securityMonths: 9, credit: 6 }],
   ['Make an example of the clerk publicly at the quay pillory', 25, { legitimacy: 7, securityMonths: 6 }],
   ['Install dual lockboxes requiring alderman and royal keys', 0, { securityMonths: 7, stability: 4 }]
  ]],
  ['Clean Customs, Full Coffers', 'Lower honest rates and vigilant cutters bring trade back through sunlit main gates.', [
   ['Audit port customs registers quarterly', 45, { credit: 8, legitimacy: 6 }],
   ['Reward loyal customs crews', 25, { trust: 6, prestige: 5 }],
   ['Close the river patrol inquiry', 0, { gold: 60 }]
  ]]
 );

 arc4('et_econ_debt_jubilee', 'Economy & Trade', 'debt',
  ['Crushing Harvest Arrears on Smallholders', 'Three consecutive hail-damaged autumns leave peasant villages drowned in compounding manor arrears and tax seizures.', [
   ['Proclaim a selective Royal Arrears Jubilee and buy out bad village debt', 150, { trust: 14, unrest: -12, stability: 8 }],
   ['Restructure overdue dues into ten-year grain installments', 60, { trust: 9, food: 35, stability: 5 }],
   ['Collect partial silver and confiscate stray sheep only', 0, { gold: 75, unrest: 6, trust: -5 }]
  ]],
  ['Tax-Gatherers Warn of Shrunk Chests', 'Exchequer clerks complain debt forgiveness slashes short-term cash needed for castle roof repairs.', [
   ['Bridge shortfalls cleanly through low-interest merchant guild bonds', 75, { credit: 9, stability: 6 }],
   ['Trim palace banquet waste and luxury silk purchases for a year', 25, { legitimacy: 8, credit: 5 }],
   ['Collect voluntary noble benevolence gifts for frontier works', 0, { prestige: 5, loyalty: -3 }]
  ]],
  ['Peasants Return to Abandoned Ploughs', 'Relieved of bailiff dread, runaway families return from woodland huts to clear weeds and plant rye.', [
   ['Supply community seed barley and shared iron harrows', 80, { food: 70, grain: 20, trust: 9 }],
   ['Protect cottage plough-oxen permanently from debt seizure by law', 35, { legitimacy: 9, trust: 8 }],
   ['Record fresh parish hearth rolls cleanly', 0, { stability: 6 }]
  ]],
  ['Prosperous Villages Pay Steadily', 'Recovered fields yield twice as much regular tithe and market tax as crushed villages ever could.', [
   ['Carve the Plough-Protection Statute on courthouse doors', 45, { legitimacy: 8, prestige: 6 }],
   ['Inspect overflowing parish barns at harvest', 25, { food: 40, trust: 5 }],
   ['Close the agrarian relief docket', 0, { stability: 4 }]
  ]]
 );

 arc4('et_econ_silk_weavers', 'Economy & Trade', 'difference',
  ['Refugee Silk-Throwers at the Gate', 'Skilled minority silk-weavers fleeing distant civil wars seek permission to settle in an abandoned abbey quarter with their looms.', [
   ['Grant quarter autonomy, loom loans, and firm crown protection', 120, { acceptance: 13, development: 1, credit: 10 }],
   ['Settle families cleanly across three towns to blend skills widely', 65, { acceptance: 10, research: 7, credit: 7 }],
   ['Admit master weavers strictly on steep foreigner license fees', 0, { gold: 80, acceptance: -3, credit: 4 }]
  ]],
  ['Native Guilds Mutiny at Strange Tongues', 'Suspicious local wool-workers picket the new silk lane, whispering that foreign weavers undercut bread wages.', [
   ['Hold bilingual guild feasts and pair native apprentices onto silk looms', 75, { acceptance: 11, trust: 8, research: 6 }],
   ['Guarantee wool guilds untouched broadcloth rights while freeing silk', 35, { stability: 7, acceptance: 7 }],
   ['Post town watchmen along the quarter gate', 0, { securityMonths: 7, unrest: -4 }]
  ]],
  ['Mulberry Saplings Along Sunny Walls', 'Refugee elders offer white mulberry cuttings so the realm can raise its own raw cocoons rather than importing thread.', [
   ['Plant royal mulberry avenues along southern valley terraces', 85, { development: 1, credit: 9, food: 25 }],
   ['Distribute saplings freely to monastery gardens', 35, { piety: 7, acceptance: 7 }],
   ['Purchase raw silk thread meanwhile via port brokers', 0, { credit: 5 }]
  ]],
  ['Velvet & Brocade Woven at Home', 'Within years, gleaming native damasks rival imported luxuries, enriching both native apprentices and welcomed newcomers.', [
   ['Wear native brocade robes at state audiences', 50, { prestige: 10, acceptance: 8 }],
   ['Establish dual-language guild court benches', 35, { legitimacy: 7, trust: 7 }],
   ['Close the settlement charter', 0, { stability: 4 }]
  ]]
 );

 arc4('et_econ_tin_pewter', 'Economy & Trade', 'land',
  ['Waterlogged Tin Pits in the Moor', 'Deep moorland tin lodes yield brilliant pewter ore, yet spring seepage floods pits waist-high before noon.', [
   ['Fund water-wheel adit pumps and royal pewter assay halls', 140, { development: 1, tools: 22, credit: 9 }],
   ['Grant tinners’ court privileges and advance pump timber', 65, { tools: 15, trust: 8, loyalty: 5 }],
   ['Collect traditional moorland coin-stamp taxes on dry diggings', 0, { gold: 75, tools: 6 }]
  ]],
  ['Quarrel Over Stream Silt', 'Downstream salmon fishers accuse tin-washers of choking clear gravel pools with reddish mine mud.', [
   ['Dig settling mud-ponds between tin-stamps and salmon rivers', 75, { food: 45, trust: 9, development: 1 }],
   ['Restrict tin-washing strictly to winter flood months', 30, { trust: 6, legitimacy: 5 }],
   ['Order parish ditch-reeves to inspect gravel pools cleanly', 0, { stability: 5, trust: 4 }]
  ]],
  ['Pewter Plates Replace Wooden Trenchers', 'Sturdy stamped domestic pewter tankards and platters sweep inland markets, lifting inn hygiene.', [
   ['Stamp royal rose-and-crown purity marks onto pewterware', 45, { credit: 9, prestige: 7 }],
   ['Exempt domestic pewter carts from bridge tolls', 30, { credit: 6, trust: 6 }],
   ['Tax exported tin blocks cleanly at harbor scales', 0, { gold: 85 }]
  ]],
  ['Gleaming Moorland Stannaries', 'Clean settling ponds and honest pewter halls turn wet moors into thriving crown jewels.', [
   ['Confirm ancient Stannary Parliament rights under royal seal', 50, { legitimacy: 8, loyalty: 7 }],
   ['Reward mine pumpwrights', 25, { research: 6, prestige: 5 }],
   ['Archive the tin assay books', 0, { stability: 4 }]
  ]]
 );

 // 5 more distinct chains (15 so far in section H? Let's count carefully! Section A:4, B:4, C:4, D:4, E:4, F:4, G:3, H:12 = 39 so far; let's add 26 more chains to reach 65 chains = 260 stages!)
 arc4('et_econ_shipyard_timber', 'Economy & Trade', 'crossroads_oceanic',
  ['Crooked Oak Knees Disappearing', 'Navy and merchant shipwrights quarrel bitterly over scarce curved oak timbers needed for ocean caravel ribs.', [
   ['Plant royal ship-timber groves and import Baltic pine masts', 140, { development: 1, credit: 10, research: 7 }],
   ['Reserve curved hedgerow oaks strictly for keel-wrights by charter', 55, { tools: 16, legitimacy: 7 }],
   ['Allow highest harbor bidders to buy timber stocks freely', 0, { gold: 95, credit: 3 }]
  ]],
  ['Ropewalks & Hemp Fields', 'Rigging masters warn imported hemp cordage doubles ship costs unless inland farmers sow hemp strips.', [
   ['Offer seed hemp and tax rebates to wet-meadow parishes', 75, { tools: 16, credit: 7, trust: 8 }],
   ['Build covered brick tar-and-rope walks beside the dockyard', 85, { development: 1, credit: 8 }],
   ['Keep purchasing Riga hemp bales via merchant guilds', 0, { credit: 4 }]
  ]],
  ['Sawyers’ Strike Over Water-Saws', 'Hand-sawyers threaten to smash a foreign water-powered timber sawmill capable of slicing planks in minutes.', [
   ['Buy the water-saw for heavy keels while guaranteeing hand-sawyers trim work', 80, { development: 1, trust: 8, unrest: -6 }],
   ['Retrain displaced sawyers as paid dockyard caulkers and joiners', 60, { trust: 9, research: 6 }],
   ['Enforce workshop peace with harbor constables', 0, { securityMonths: 7, unrest: 3 }]
  ]],
  ['Keels Laid on Schedule', 'Abundant cured oak, strong hemp cordage, and humming sawmills launch sleek merchant hulls.', [
   ['Charter a royal Maritime Timber Board', 50, { legitimacy: 7, credit: 7 }],
   ['Celebrate triple hull launchings at high tide', 35, { prestige: 9, trust: 6 }],
   ['Close dockyard timber accounts', 0, { stability: 4 }]
  ]]
 );

 arc4('et_econ_tax_cadaster', 'Economy & Trade', 'lowstability',
  ['Outdated Domesday Rolls Stir Fury', 'Tax collectors use century-old manor assessments that spare booming noble wine estates while crushing shrunken river hamlets.', [
   ['Commission an impartial sworn Land & Hearth Cadaster survey', 135, { legitimacy: 11, stability: 9, trust: 9 }],
   ['Cut assessments immediately on visibly shrunken hamlets', 65, { trust: 10, unrest: -8, stability: 5 }],
   ['Keep old rolls intact to avoid rousing noble tax objections', 0, { loyalty: 5, unrest: 5, legitimacy: -3 }]
  ]],
  ['Surveyors Met With Closed Shutters', 'Suspicious landlords hide flock tallies inside haylofts and warn clerks off estate lanes.', [
   ['Seat elected parish elders beside royal surveyors for honest witness', 60, { trust: 10, legitimacy: 8, stability: 6 }],
   ['Offer partial grace on newly uncovered acreage declared willingly', 35, { stability: 7, credit: 6 }],
   ['Enforce survey fines under exchequer warrant', 0, { legitimacy: 6, gold: 65, loyalty: -4 }]
  ]],
  ['Vellum Cadaster Bound in Brass', 'Freshly bound parish maps clarify water-mills, vineyards, and wasteland fairly for every taxpayer.', [
   ['Deposit duplicate cadaster copies inside county town halls for openness', 55, { trust: 9, legitimacy: 8 }],
   ['Use exact acreage to plan new rural roads and bridges', 50, { development: 1, credit: 7 }],
   ['Lock originals inside treasury vaults', 0, { securityMonths: 7, stability: 5 }]
  ]],
  ['Fair Taxes Calm the Countryside', 'Honest assessments spread burdens evenly, boosting both revenues and citizen peace.', [
   ['Schedule calm ten-year cadaster revisions cleanly', 45, { legitimacy: 7, credit: 7 }],
   ['Praise diligent clerks before council', 20, { prestige: 5, stability: 5 }],
   ['Close the survey commission', 0, { stability: 4 }]
  ]]
 );

 arc4('et_econ_coffee_tea', 'Economy & Trade', 'cont_asia',
  ['Steaming Porcelain Cups in Market Booths', 'Caravan traders introduce roasted leaf and berry infusions inside lively market pavilions where clerks debate trade and politics late.', [
   ['License clean tea and coffee houses as regulated centers of civility', 95, { credit: 9, acceptance: 8, research: 6 }],
   ['Levy modest kettle taxes while welcoming foreign leaf caravans', 45, { gold: 75, credit: 6 }],
   ['Curb late-night street pavilions over tavern guild protests', 0, { stability: 5, unrest: -3, credit: -2 }]
  ]],
  ['Ale Brewers Cry Unfair Rivalry', 'Innkeepers complain sober clerks sip hot leaf bowls for hours instead of buying taxed barley ale.', [
   ['Tax leaf houses and taverns equally while funding clean city wells', 65, { trust: 8, credit: 7, development: 1 }],
   ['Encourage brewers to roast malts and serve hot herbals too', 35, { credit: 6, acceptance: 6 }],
   ['Protect traditional alehouse festival charters quietly', 0, { loyalty: 5, stability: 4 }]
  ]],
  ['Pamphlets & Chess Inside the Pavilion', 'Merchants exchange shipping news over chessboards, speeding commercial contracts cleanly.', [
   ['Post official royal harbor arrival boards inside main pavilions', 50, { credit: 9, trust: 7 }],
   ['Keep discreet ears open against seditious rumors', 30, { securityMonths: 8 }],
   ['Let merchants gather freely until midnight curfew', 0, { credit: 5, stability: 4 }]
  ]],
  ['Sober Halls of Commerce', 'Warm pavilions mature into respected mercantile exchanges buzzing with sober deals.', [
   ['Charter a Brokers’ Hall beside the central pavilion', 60, { credit: 10, prestige: 6 }],
   ['Gift porcelain tea sets to visiting factors', 30, { acceptance: 7, prestige: 5 }],
   ['Close the market licensing review', 0, { stability: 4 }]
  ]]
 );

 arc4('et_econ_grain_monopoly', 'Economy & Trade', 'food',
  ['The Millers’ Ring Raises Grist Fees', 'Every water-miller along the basin agrees secretly to double flour-grinding tolls, squeezing village bakers.', [
   ['Build competing royal wind and horse mills open at penny tolls', 135, { food: 75, trust: 11, development: 1 }],
   ['Enforce strict ancient grist-fraction statutes with sealed iron scoops', 50, { legitimacy: 8, trust: 9, food: 35 }],
   ['Levy fines on proven price-fixing rings', 0, { gold: 80, trust: 5, unrest: -4 }]
  ]],
  ['Millers Sabotage Fish-Ladders', 'Angry millers drop tree trunks across rival millraces overnight, backing muddy water into meadows.', [
   ['Send county engineers to clear logs and guard crown millraces', 65, { securityMonths: 8, food: 40, trust: 7 }],
   ['Compel guilty millers to repair embankments at their own cost', 25, { legitimacy: 7, tools: 10 }],
   ['Mediate fair district grinding territories calmly', 0, { stability: 6, trust: 5 }]
  ]],
  ['Honest Flour Weights at the Gate', 'Town bakers display clear brass-weighed penny loaves stamped with honest daily weights.', [
   ['Institute the Assize of Bread & Ale tying loaf weight to wheat price', 60, { legitimacy: 9, trust: 10, inflation: -2 }],
   ['Reward honest bakers with hearth firewood stipends', 40, { food: 35, trust: 7 }],
   ['Inspect bakery scales weekly at random', 0, { securityMonths: 6, stability: 5 }]
  ]],
  ['Cheap, Honest Daily Bread', 'Broken mill rings and clear bread laws keep working families fed without market unrest.', [
   ['Carve the Assize Bread Scale on market pillars', 35, { legitimacy: 7, trust: 7 }],
   ['Store reserve flour sacks in abbey cellars', 45, { food: 45, piety: 5 }],
   ['Close the bread assize inquiry', 0, { stability: 4 }]
  ]]
 );

 arc4('et_econ_spice_customs', 'Economy & Trade', 'cont_africa',
  ['Dhows Crowding the Coral Breakwater', 'Swahili and Gujarati dhows ride southwest winds bringing cottons, beads, and ivory—awaiting swift customs clearance before monsoon reversal.', [
   ['Expand stone customs sheds and hire multilingual weighmasters', 130, { credit: 12, development: 1, acceptance: 9 }],
   ['Streamline anchorage tallies for returning seasonal captains', 60, { credit: 8, trust: 7 }],
   ['Raise port anchorage dues modestly to fill coastal chests', 0, { gold: 105, credit: 3 }]
  ]],
  ['Shortage of Fresh Water Casks', 'Hundreds of visiting mariners drain harbor wells dry, threatening angry queues beside municipal cisterns.', [
   ['Build covered coral-stone rainwater cisterns and aqueduct pipes', 95, { development: 1, food: 45, trust: 10 }],
   ['Hire river canoe trains hauling fresh spring water downstream', 45, { trust: 7, credit: 5 }],
   ['Ration cistern hours strictly for town households first', 0, { stability: 5, acceptance: -3 }]
  ]],
  ['Ivory & Cotton Brokers Form a Guild', 'Inland porters and sea captains propose fixed silver-cowrie-gold conversion weights at the customs gate.', [
   ['Publish fair tri-metallic exchange stones in the harbor plaza', 60, { credit: 10, legitimacy: 7, acceptance: 7 }],
   ['Witness brokerage contracts cleanly through port judges', 30, { trust: 8, credit: 6 }],
   ['Leave currency conversion to bazaar changers', 0, { gold: 50, credit: 3 }]
  ]],
  ['Jewel of the Monsoon Coast', 'Fast turnaround and fresh cistern water earn your harbor renown across the entire Indian Ocean rim.', [
   ['Raise a whitewashed beacon tower above the outer reef', 65, { prestige: 9, credit: 8 }],
   ['Feast departing captains before monsoon wind shift', 30, { acceptance: 8, prestige: 6 }],
   ['Seal the monsoon customs roll', 0, { gold: 70 }]
  ]]
 );

 arc4('et_econ_bank_ledger', 'Economy & Trade', 'inflation',
  ['Double-Entry Clerks Revolutionize Bourses', 'Venetian-schooled bookkeepers demonstrate twin-column credit-and-debit ledgers that spot embezzlement in minutes.', [
   ['Mandate double-entry accounting across royal mints, customs, and granaries', 115, { credit: 12, inflation: -3, research: 9 }],
   ['Fund a public academy of commercial arithmetic for guild clerks', 75, { research: 10, credit: 9, trust: 6 }],
   ['Pilot the method quietly inside the treasury chamber first', 0, { research: 5, legitimacy: 5 }]
  ]],
  ['Old Tally-Notchers Resist Ink Books', 'Traditional hazelwood tally-stick cutters warn ink books can be scraped and forged unlike split wooden notches.', [
   ['Pair ink ledgers with duplicate sealed tally-chests for three years', 50, { legitimacy: 8, securityMonths: 8, trust: 6 }],
   ['Retrain aging tally clerks onto salaried audit desks', 65, { trust: 8, credit: 6 }],
   ['Dismiss backward clerks cleanly with modest pensions', 0, { legitimacy: 6, stability: 4 }]
  ]],
  ['Hidden Treasury Leak Uncovered', 'First month’s twin-column trial instantly catches three thousand florins misrouted through stale regional suspense accounts.', [
   ['Recover missing crown silver and tighten quarterly audit locks', 35, { gold: 115, legitimacy: 9, securityMonths: 8 }],
   ['Reform regional suspense rules without shaming honest elders', 20, { loyalty: 7, credit: 6 }],
   ['Deposit recovered funds straight into debt reduction', 0, { inflation: -2, credit: 7 }]
  ]],
  ['Glass-Clear Crown Accounts', 'Unmatched fiscal clarity cuts borrowing costs and lets merchants trust every royal promissory note.', [
   ['Publish printed primer tables of commercial bookkeeping', 50, { research: 9, prestige: 7 }],
   ['Award gold quills to the founding auditors', 25, { prestige: 6, trust: 5 }],
   ['Archive the annual balanced ledger', 0, { credit: 6 }]
  ]]
 );

 arc4('et_econ_quarantine_wool', 'Economy & Trade', 'epidemic',
  ['Tainted Fleece in the Cloth Hall', 'Whispers link a sudden fever outbreak among weavers to unwashed wool packs landed from an infected foreign port.', [
   ['Quarantine suspect bales, burn damp sacking, and compensate weavers', 140, { crisis: -19, trust: 11, unrest: -7 }],
   ['Wash all imported wool in boiling lye and sulfur steam outside walls', 75, { crisis: -12, tools: 12, credit: 6 }],
   ['Seal the cloth hall briefly until city doctors inspect workers', 0, { crisis: -6, stability: 5 }]
  ]],
  ['Panic Shuts Country Looms', 'Rural spinners refuse carting yarn into town, starving loyal artisans of daily bread.', [
   ['Set up clean riverside yarn drop-stations run by city stewards', 75, { crisis: -11, trust: 9, credit: 6 }],
   ['Issue emergency bread doles to quarantined weaver cottages', 65, { food: -25, crisis: -10, trust: 10 }],
   ['Guarantee safe harbor-road patrols for honest carters', 0, { securityMonths: 7, stability: 4 }]
  ]],
  ['Herb-Doctors & Barber-Surgeons Clash', 'University physicians and practical barber-surgeons quarrel loudly over bleeding versus clean vinegar washes.', [
   ['Back clean linen, open windows, and boiled vinegar hygiene rules', 60, { research: 9, crisis: -12 }],
   ['Convene both guilds to share honest fever survival records', 40, { research: 7, acceptance: 6 }],
   ['Leave medical practice to licensed civic doctors', 0, { stability: 5, crisis: -5 }]
  ]],
  ['Looms Clatter Cleanly Again', 'Measured hygiene halts fever cleanly while keeping the realm’s vital wool trade alive.', [
   ['Publish permanent Civic Quarantine & Wool-Wash Rules', 45, { research: 7, legitimacy: 7 }],
   ['Thank brave weaver stewards and nurses', 25, { trust: 8, piety: 5 }],
   ['Reopen the grand cloth hall', 0, { credit: 7 }]
  ]]
 );

 arc4('et_econ_horse_fair', 'Economy & Trade', 'trade',
  ['The Great Horse & Ox Fair', 'Thousands of horse-traders, wheelwrights, and drovers converge outside town walls, yet muddy fairgrounds breed broken wagons and horse-theft.', [
   ['Cobble fairground lanes, build wooden stock pens, and post clerks', 135, { development: 1, credit: 11, trust: 9 }],
   ['Lay gravel drains and license official brand-inspectors', 65, { credit: 8, securityMonths: 7 }],
   ['Collect customary hoof-tolls on the open meadow', 0, { gold: 90, credit: 3 }]
  ]],
  ['Ring of Tooth-Filing Horse-Cheats', 'Angry farmers expose dealers painting grey spots off old nags and filing teeth to pass ancient mares as four-year-olds.', [
   ['Establish a sworn Fair Court annulling crooked sales on the spot', 45, { legitimacy: 9, trust: 10 }],
   ['Require written branded warranties on every warhorse and ox team', 30, { credit: 7, securityMonths: 7 }],
   ['Duck caught cheats in the horse-pond and confiscate fines', 0, { gold: 50, trust: 6 }]
  ]],
  ['Foreign Cavalry Buyers Arrive', 'Envoys from neighboring duchies arrive carrying gold purses seeking heavy draught horses.', [
   ['Allow excess gelding sales while reserving prime mares for home farms', 55, { credit: 9, food: 35, gold: 45 }],
   ['Auction surplus chargers publicly under crown stamp', 30, { gold: 85, prestige: 6 }],
   ['Cap foreign horse exports until domestic plough teams fill', 0, { food: 45, trust: 7 }]
  ]],
  ['Pride of the Autumn Fair', 'Clean cobbled pens and honest warranty courts make your fair the benchmark for livestock across leagues.', [
   ['Erect a bronze market cross marking fair boundaries', 45, { prestige: 8, legitimacy: 6 }],
   ['Feed drovers a closing harvest roast', 30, { trust: 8, food: -15 }],
   ['Close the fairground rolls', 0, { credit: 5 }]
  ]]
 );

 arc4('et_econ_olive_vine', 'Economy & Trade', 'drought',
  ['Sun-Scorched Olive & Vine Terraces', 'Prolonged summer heat cracks stone terrace walls and wilts young olive shoots along sunlit hillsides.', [
   ['Fund terrace retaining-wall repairs and clay water-jar cisterns', 135, { crisis: -18, development: 1, trust: 10 }],
   ['Issue tax grace and ship cheap grain to oil-dependent hill towns', 75, { crisis: -12, food: 55, trust: 8 }],
   ['Encourage hardy fig and almond grafts on dry slopes', 0, { food: 30, crisis: -5 }]
  ]],
  ['Oil Pressers Dilute Virgin Pressings', 'Shortages tempt shady pressers to mix rancid seed oil into export amphorae bound for northern ports.', [
   ['Appoint royal oil tasters and smash adulterated jars publicly', 55, { credit: 9, legitimacy: 8, trust: 8 }],
   ['Seal genuine first-press jars with lead crown badges', 35, { credit: 7, prestige: 5 }],
   ['Issue warning fines across village presses', 0, { gold: 45, credit: -2 }]
  ]],
  ['Terrace Farmers Borrow Against Roots', 'Lenders squeeze hillside smallholders at harsh rates before next autumn’s oil harvest.', [
   ['Offer low-interest crown oil-advance chests repaid in lamp oil', 80, { credit: 9, trust: 10, crisis: -10 }],
   ['Freeze land foreclosures on drought-stricken terraces for two years', 25, { stability: 8, trust: 9 }],
   ['Direct monasteries to share press-houses rent-free', 0, { piety: 7, trust: 6 }]
  ]],
  ['Green Silver Leaves Return', 'Mended stone terraces hold winter rains cleanly, restoring golden oil and wine exports.', [
   ['Export sealed royal-brand oil jars to northern fairs', 45, { credit: 9, gold: 75 }],
   ['Plant stone-walled hillside cisterns as permanent custom', 55, { development: 1, food: 35 }],
   ['Close the terrace relief docket', 0, { stability: 4 }]
  ]]
 );

 arc4('et_econ_forest_glass', 'Economy & Trade', 'land',
  ['Potash Burners Clear Ancient Beechwoods', 'Crown foresters report wandering glass-kilns burning whole acres of prime beech timber solely for wood-ash.', [
   ['Regulate beech coppicing and pilot kelp/seaweed soda ash imports', 110, { development: 1, research: 8, trust: 8 }],
   ['Confine potash kilns strictly to storm-felled deadwood', 45, { stability: 6, credit: 5, tools: 12 }],
   ['Charge stiff ash-royalties per barrel to slow felling', 0, { gold: 80, trust: 4 }]
  ]],
  ['Venison Poachers & Charcoal Squabbles', 'Displaced woodlanders clash with gamekeepers after tightened timber rules cut winter cash.', [
   ['Hire displaced woodmen onto paid forest-replanting crews', 75, { trust: 10, unrest: -7, development: 1 }],
   ['Allow free dead-branch gathering every Saturday for cottagers', 25, { trust: 9, piety: 4 }],
   ['Enforce game statutes politely through local forest courts', 0, { legitimacy: 6, stability: 4 }]
  ]],
  ['Coastal Kelp Ash Proves Superior', 'Seaweed-ash imported from coastal villages yields clearer, greener window glass than inland wood-ash.', [
   ['Grant coastal kelp-gatherers tax-free wagon passes inland', 60, { credit: 9, trust: 8 }],
   ['Build dual coastal-inland trade depots at the river mouth', 55, { development: 1, credit: 7 }],
   ['Purchase kelp ash cleanly for royal windows', 0, { prestige: 6, tools: 10 }]
  ]],
  ['Living Canopy & Clear Glass', 'Sustainable beech woods regrow tall while coastal villages earn steady winter coin from kelp.', [
   ['Enact the Royal Woodland Renewal Ordinance', 45, { legitimacy: 8, stability: 6 }],
   ['Inspect thrifty young beech saplings', 20, { trust: 5 }],
   ['Close the forest inquiry', 0, { stability: 4 }]
  ]]
 );

 arc4('et_econ_customs_bridge', 'Economy & Trade', 'lowtrust',
  ['Rotten Ferry Cables Delay Market Dawn', 'Hundreds of egg and butter carts queue in mud waiting for one leaky rope-ferry whose lord refuses lowering fares.', [
   ['Fund a wide public stone causeway and regulate fair passage fees', 150, { development: 1, trust: 12, credit: 10 }],
   ['Lease two extra flat-barges and cap ferry pennies by decree', 65, { trust: 9, credit: 6 }],
   ['Order the ferry lord sternly to mend frayed hemp cables', 0, { legitimacy: 6, trust: 4 }]
  ]],
  ['Innkeepers Lose Idle Cart Traffic', 'Roadside taverners who thrived on stalled ferry queues complain swift crossings cut beer sales.', [
   ['Site bustling market stalls right at the new bridgehead', 65, { credit: 9, trust: 8 }],
   ['License honest wayside stables along the faster highway', 35, { credit: 6, stability: 5 }],
   ['Remind taverners brisk trade enriches the whole valley', 0, { legitimacy: 5 }]
  ]],
  ['Milk & Greens Reach Market Fresh', 'Farmers arrive two hours earlier at market bells, selling crisp greens and sweet butter before noon.', [
   ['Waive stall fees briefly for fresh dairy and orchard carts', 45, { food: 55, trust: 9 }],
   ['Build covered stone butter-cross sheds in the square', 60, { development: 1, credit: 7 }],
   ['Collect steady brisk morning stall pennies', 0, { gold: 70 }]
  ]],
  ['Unclogged Valley Trade', 'One reliable crossing doubles weekly rural attendance at capital fairs.', [
   ['Carve distance milestones every league from the bridgehead', 45, { development: 1, prestige: 6 }],
   ['Reward honest bridge wardens', 20, { trust: 6 }],
   ['Close the crossing ledger', 0, { stability: 4 }]
  ]]
 );

 arc4('et_econ_spice_credit', 'Economy & Trade', 'crossroads_finance',
  ['Joint-Stock Spice Voyage Proposed', 'Fifty widows, guildmasters, and knights offer small shares to fit out two ocean spice vessels—splitting risk fairly instead of betting one fortune.', [
   ['Charter the Joint-Stock Spice Company with audited share books', 145, { credit: 14, research: 8, prestige: 9 }],
   ['Back a cautious single-voyage guild syndicate with crown customs rebate', 75, { credit: 9, trust: 7 }],
   ['Keep ocean patents reserved strictly for proven royal merchants', 0, { legitimacy: 6, credit: 4 }]
  ]],
  ['Share Certificates Trade on Alley Steps', 'Small share parchments begin changing hands daily before the ships even clear the outer cape.', [
   ['Establish official transfer registries inside the Exchange Hall', 60, { credit: 10, legitimacy: 8, inflation: -1 }],
   ['Ban wild margin bets on ships not yet sighted off port', 30, { stability: 7, securityMonths: 6 }],
   ['Tax share transfers lightly for harbor defense', 0, { gold: 75, credit: 4 }]
  ]],
  ['Sails Sighted Off the Headland!', 'Both hulls limp home salt-crusted yet crammed to deck beams with nutmeg, porcelain, and pepper.', [
   ['Audit cargo cleanly in open court before paying honest dividends', 55, { credit: 12, trust: 10, gold: 80 }],
   ['Reinvest royal dividend shares straight into shipyard docks', 65, { development: 1, prestige: 9 }],
   ['Collect crisp import customs and celebrate at dockside', 0, { gold: 130, credit: 6 }]
  ]],
  ['Birth of Shared Enterprise', 'Small savers and great houses alike share profits, unlocking capital for grander ventures.', [
   ['Codify Limited Liability Share Rules cleanly', 60, { research: 9, credit: 10, legitimacy: 7 }],
   ['Strike commemorative spice-voyage medallions', 35, { prestige: 8 }],
   ['Close the company books', 0, { stability: 4 }]
  ]]
 );

 arc4('et_econ_flood_granary', 'Economy & Trade', 'flood',
  ['Submerged Wharf Cellars', 'Flash river floods inundate low-lying merchant warehouses, soaking stored salt, dried cod, and winter barley.', [
   ['Mobilize drying kilns, pump barges, and emergency food relief', 140, { crisis: -19, food: 65, credit: 7 }],
   ['Move salvageable sacks into high abbey lofts immediately', 65, { crisis: -11, food: 40, piety: 5 }],
   ['Auction damp grain briskly to brewers and livestock pens', 0, { gold: 55, crisis: -6, food: 15 }]
  ]],
  ['Merchants Beg Tax Moratorium', 'Soaked clothiers and grocers cannot pay quarterly customs bills without liquidating tools.', [
   ['Grant a six-month crown tax grace and low-rate rebuild loans', 90, { credit: 10, trust: 11, crisis: -10 }],
   ['Accept salvaged timber and repair labor in lieu of cash dues', 35, { development: 1, trust: 8 }],
   ['Defer only penalties while keeping principal due at winter', 0, { credit: 4, stability: 4 }]
  ]],
  ['Raising the Quay Wall Two Yards', 'Engineers propose lifting the entire river quay with dressed granite blocks above flood marks.', [
   ['Build the elevated stone embankment and arched warehouse vaults', 120, { development: 1, crisis: -12, credit: 9 }],
   ['Install stout timber flood-boards along existing alley gates', 45, { crisis: -7, tools: 14 }],
   ['Mark high-water stones visibly for future builders', 0, { research: 5, stability: 4 }]
  ]],
  ['Dry Vaults Above High Water', 'Never again does spring snowmelt spoil winter bread or guild goods along the quay.', [
   ['Charter permanent River Wharf Wardens', 45, { securityMonths: 7, credit: 7 }],
   ['Thank barge rescues publicly', 25, { trust: 8, prestige: 5 }],
   ['Close the flood warehouse fund', 0, { stability: 4 }]
  ]]
 );

 arc4('et_econ_dye_indigo', 'Economy & Trade', 'trade',
  ['Blue Woad Growers vs Imported Indigo', 'Inland woad-cake farmers demand banning brilliant deep-blue imported indigo, calling it "devil’s dye" ruining country parishes.', [
   ['Permit blended indigo-woad vats while guiding farmers into madder & hops', 105, { credit: 10, acceptance: 8, trust: 7 }],
   ['Protect domestic woad gently with narrow luxury tariffs on pure indigo', 45, { trust: 7, gold: 55, stability: 5 }],
   ['Ban imported indigo temporarily to shield rural parishes', 0, { trust: 8, loyalty: 5, credit: -4 }]
  ]],
  ['Dyers Test Vibrant Blended Blues', 'Master dyers prove indigo paired with native woad produces deep midnight blues that never fade in sun.', [
   ['Endow public dye-chemistry trials at the textile guildhall', 70, { research: 10, credit: 9 }],
   ['Certify fast-color midnight wool under a proud royal seal', 35, { prestige: 8, credit: 7 }],
   ['Let clothiers mix dyes freely without state decree', 0, { credit: 6 }]
  ]],
  ['Woad Parishes Replant Rich Hops', 'Displaced woad acres shift into high-demand brewing hops and rapeseed oil crops.', [
   ['Advance hop-pole loans and seed cakes to converting farms', 75, { food: 55, credit: 8, trust: 8 }],
   ['Exempt transitional farms from land dues for two autumns', 30, { trust: 8, stability: 5 }],
   ['Collect normal parish land rolls cleanly', 0, { gold: 55 }]
  ]],
  ['Rich Colors & Thriving Farms', 'Adaptable policy saves rural livelihoods while letting urban clothiers capture luxury export markets.', [
   ['Display royal midnight-blue tapestries at court', 45, { prestige: 9, credit: 5 }],
   ['Print crop-diversification pamphlets for rural stewards', 30, { research: 6, food: 25 }],
   ['Close the dye-works dispute', 0, { stability: 4 }]
  ]]
 );

 arc4('et_econ_fire_baker', 'Economy & Trade', 'fire',
  ['Bakeries Ablaze Before Dawn', 'Flaring oven flues ignite timber flour-lofts along Bakers’ Row, threatening both bread ovens and neighboring granaries.', [
   ['Contain flames with brick fire-breaks and fund stone communal ovens', 135, { crisis: -19, food: 55, development: 1 }],
   ['Issue emergency abbey loaves while clearing charred rafters', 70, { crisis: -12, food: 40, piety: 6 }],
   ['Deploy garrison sappers to pull down burning roofs', 0, { crisis: -8, stability: 5 }]
  ]],
  ['Flour Speculators Circle Ruined Stalls', 'With half the ovens blackened, speculative mealmen hike flour bags overnight.', [
   ['Open royal emergency flour barrels at pre-fire prices', 75, { food: 60, crisis: -11, trust: 11 }],
   ['Fix temporary bread tariffs and fine profiteers', 30, { legitimacy: 8, unrest: -7 }],
   ['Share intact monastery ovens day and night by shift', 0, { piety: 7, food: 30 }]
  ]],
  ['Brick Chimneys & Ash-Pits Mandated', 'Rebuilding wardens urge lining every bakehouse chimney with clay tile and stone ash-vaults.', [
   ['Offer tile loans to rebuild every bakehouse fireproof', 85, { development: 1, credit: 8, crisis: -10 }],
   ['Inspect rebuilt chimneys strictly before relighting fires', 30, { securityMonths: 7, trust: 7 }],
   ['Grant bakers modest charcoal rebates during rebuild', 0, { trust: 6 }]
  ]],
  ['Warm Loaves Over Brick Hearths', 'Fireproof bakeries turn out crisp loaves safely, shielding city bread from future sparks.', [
   ['Reward heroic bucket-chain apprentices', 35, { trust: 8, prestige: 5 }],
   ['Keep emergency flour chests topped off', 40, { food: 45 }],
   ['Close the bakehouse relief ledger', 0, { stability: 4 }]
  ]]
 );

 arc4('et_econ_famine_seed', 'Economy & Trade', 'famine',
  ['Empty Furrows After Harsh Frost', 'Late black frost kills winter wheat shoots across four provinces; hungry villagers stare at brown fields.', [
   ['Rush fast-sprouting spring barley seed and dried peas immediately', 150, { crisis: -20, food: 95, grain: 28 }],
   ['Open crown larders and organize ditch-draining work-for-bread', 80, { crisis: -13, food: 65, development: 1 }],
   ['Release castle garrison biscuit reserves locally', 0, { food: 45, crisis: -7, trust: 6 }]
  ]],
  ['Weak Plough-Oxen Collapse', 'Starving beasts lack strength to pull heavy mouldboard ploughs through stiff spring clay.', [
   ['Dispatch royal remount mules and oats to village ploughing teams', 90, { crisis: -13, food: 50, trust: 10 }],
   ['Issue lighter iron spade-hoes and communal seed drills', 55, { tools: 18, crisis: -9, research: 5 }],
   ['Coordinate shared village ox-teams across neighboring parishes', 0, { trust: 8, stability: 5 }]
  ]],
  ['Wild Root & Acorn Flour', 'Parish herbalists teach villagers how to leach bitterness from acorns and wild roots safely without stomach sickness.', [
   ['Print simple illustrated safe-foraging sheets for rural priests', 45, { research: 7, crisis: -9, piety: 6 }],
   ['Supply salt and iron kettles to parish soup kitchens', 50, { food: 40, trust: 8 }],
   ['Praise parish resilience and guard seed sacks closely', 0, { securityMonths: 7, crisis: -5 }]
  ]],
  ['Green Barley Waves in June', 'Fast spring barley ripens cleanly, turning back famine before summer solstice.', [
   ['Keep permanent spring seed-banks in every county seat', 65, { grain: 22, stability: 8 }],
   ['Hold heartfelt harvest prayers', 25, { piety: 9, trust: 7 }],
   ['Close the famine relief books', 0, { stability: 4 }]
  ]]
 );

 arc4('et_econ_mint_assay', 'Economy & Trade', 'inflation',
  ['Rumor Haunts the Royal Silver Stamp', 'Foreign moneychangers discount your realm’s silver coins by eight percent at border fairs, muttering of hidden copper adulteration.', [
   ['Hold a public Trial of the Pyx melting random coins before ambassadors', 100, { credit: 13, inflation: -4, prestige: 9 }],
   ['Mint a fresh pure-silver trade crown with distinct deep milling', 135, { credit: 12, inflation: -4, legitimacy: 7 }],
   ['Issue stern proclamations affirming mint purity', 0, { legitimacy: 5, credit: 2, inflation: -1 }]
  ]],
  ['Touchstones & Crucibles Glow', 'Before packed guildmasters and foreign envoys, sworn assayers melt sealed sample coins in white-hot bone-ash cupels.', [
   ['Test coins from every provincial mint openly in turn', 55, { legitimacy: 9, credit: 8, trust: 8 }],
   ['Expose one slightly light provincial die and punish its master cleanly', 35, { securityMonths: 8, legitimacy: 8, credit: 6 }],
   ['Weigh silver buttons publicly on brass scales', 0, { credit: 6, prestige: 5 }]
  ]],
  ['Foreign Bourses Adjust Quotations', 'Proven fineness triggers rapid demand for your coins across regional grain and wool markets.', [
   ['Sign reciprocal coin-acceptance treaties with trading cities', 60, { credit: 11, acceptance: 7 }],
   ['Stamp pure-silver trade bars for wholesale bank transfers', 45, { credit: 8, gold: 55 }],
   ['Resume normal mint output cleanly', 0, { inflation: -2, credit: 5 }]
  ]],
  ['Word as Sound as Silver', 'Public transparency silences border discounting and anchors royal credit for a reign.', [
   ['Institute annual public Trials of the Pyx by law', 45, { legitimacy: 8, credit: 8 }],
   ['Award ceremonial silver balances to honest assayers', 25, { prestige: 7 }],
   ['Close the assay inquiry', 0, { stability: 4 }]
  ]]
 );

 arc4('et_econ_glass_lenses', 'Economy & Trade', 'research',
  ['Florentine Glassmakers Seek Patronage', 'Lens-grinders arriving from abroad demonstrate concave and convex rock-crystal glasses that sharpen distant sails and tiny script.', [
   ['Endow a Royal Optical & Instrument Workshop', 135, { research: 15, prestige: 10, credit: 7 }],
   ['Commission sea-glasses for admirals and reading lenses for clerks', 75, { research: 10, credit: 6 }],
   ['Purchase a dozen finest lenses for palace libraries', 0, { research: 6, prestige: 5 }]
  ]],
  ['Grinding Brass Wheels & Emery Dust', 'Apprentices spend dusty weeks polishing brass molds with fine emery sand, begging better water-wheels.', [
   ['Attach precision water-driven polishing lathes beside the millrace', 80, { development: 1, research: 11, tools: 14 }],
   ['Import fine Aegean emery stone for master grinders', 45, { research: 8, credit: 5 }],
   ['Support steady hand-grinding in sunlit attic studios', 0, { research: 5, stability: 4 }]
  ]],
  ['Astrolabe & Cross-Staff Upgrades', 'Adding clear sighting glasses to brass cross-staffs slashes navigation error on overcast crossings.', [
   ['Issue improved optical sea-staffs to licensed port pilots', 75, { research: 10, credit: 9 }],
   ['Present matched pairs to university astronomers', 40, { research: 9, prestige: 7 }],
   ['Store prototype instruments in royal cabinets', 0, { prestige: 6 }]
  ]],
  ['Clear Sight Across Sea and Page', 'Optical crafts spark parallel leaps in navigation, astronomy, and scholarly manuscript precision.', [
   ['Publish engraved treatises on lens curvature', 50, { research: 10, prestige: 7 }],
   ['Charter the Instrument Makers’ Guild', 35, { credit: 8, tools: 10 }],
   ['Close the workshop grant', 0, { stability: 4 }]
  ]]
 );

 arc4('et_econ_clock_guild', 'Economy & Trade', 'land',
  ['Mechanical Clock on the Belfry', 'Burghers petition to replace noisy sandglasses with a brass weight-driven striking clock regulating market bells and curfew.', [
   ['Fund a grand astronomical town clock showing moons and tides', 140, { prestige: 11, research: 10, development: 1 }],
   ['Install a sturdy iron striking movement for crisp market hours', 75, { credit: 8, trust: 8, research: 6 }],
   ['Leave traditional church bell-ringers keeping solar hours', 0, { piety: 5, stability: 5 }]
  ]],
  ['Clockmaker’s Apprentices Unionize', 'Skilled gear-cutters demand exemption from blacksmiths’ rough guild rules to form an independent clockmakers’ craft.', [
   ['Charter a proud Guild of Horologists and Fine Instrument Makers', 65, { research: 9, credit: 8, trust: 7 }],
   ['Create a specialized fine-brass division inside the smiths’ hall', 35, { stability: 6, tools: 14 }],
   ['Keep all iron-workers under traditional guild elders', 0, { loyalty: 5, stability: 4 }]
  ]],
  ['Workshops Shift to Measured Hours', 'Uniform striking chimes synchronize canal locks, bakery shifts, and harbor customs desks cleanly.', [
   ['Set standardized shift bells across royal dockyards and mints', 55, { credit: 9, legitimacy: 7 }],
   ['Donate smaller portable spring-clocks to university halls', 45, { research: 8, prestige: 6 }],
   ['Maintain steady belfry chimes daily', 0, { trust: 5 }]
  ]],
  ['Realm Kept in Rhythm', 'Precision gearwork spreads from belfries into mills, presses, and nautical calculators.', [
   ['Appoint a salaried Royal Keeper of Clocks', 40, { research: 7, prestige: 6 }],
   ['Display brass escapement models openly', 20, { research: 5 }],
   ['Close the belfry clock accounts', 0, { stability: 4 }]
  ]]
 );

 arc4('et_econ_pearl_fishery', 'Economy & Trade', 'cont_asia',
  ['Disputed Oyster Banks Off the Shoal', 'Divers from rival coastal villages clash over rich spring pearl-oyster banks guarded only by bamboo stakes.', [
   ['Organize licensed seasonal diving guilds with conservation rest-years', 115, { credit: 11, trust: 9, legitimacy: 7 }],
   ['Station royal patrol cutters and share pearl auctions fairly', 65, { credit: 8, securityMonths: 7, gold: 45 }],
   ['Auction sole fishing rights to the highest merchant bidder', 0, { gold: 120, unrest: 4 }]
  ]],
  ['Shark-Charmers & Dive-Weights', 'Veteran divers refuse descending without seasoned boat-tenders and proper heavy stone sinkers.', [
   ['Guarantee honest boat-shares and rescue pensions for injured divers', 65, { trust: 10, credit: 6, acceptance: 6 }],
   ['Provide brass diving-goggles and fresh lime fruit aboard boats', 45, { research: 6, trust: 7 }],
   ['Let village headmen organize traditional boat crews', 0, { acceptance: 6, stability: 4 }]
  ]],
  ['Pearl Buyers Crowd the Beach', 'Jewelers from distant capitals pitch striped tents along the dunes to bid on matched cream-colored pearls.', [
   ['Erect guarded stone weighing stalls ensuring honest silver assays', 60, { credit: 9, securityMonths: 7, gold: 55 }],
   ['Reserve matched drops for royal diplomatic gifts cleanly', 35, { prestige: 10 }],
   ['Collect crisp ten-percent customs at beach gates', 0, { gold: 95 }]
  ]],
  ['Living Reefs Preserved', 'Rotating rest-years prevent oyster exhaustion, turning fleeting windfalls into enduring coastal wealth.', [
   ['Inscribe oyster conservation limits into coastal law', 40, { legitimacy: 7, credit: 6 }],
   ['Endow clean freshwater wells along the fishing dunes', 45, { trust: 9, food: 30 }],
   ['Close the pearl fleet season', 0, { stability: 4 }]
  ]]
 );

 arc4('et_econ_road_bandits', 'Economy & Trade', 'lowstability',
  ['Toll-Booths Torched on the King’s Road', 'Desperate highwaymen ambush wool caravans inside thick oak woods, stalling inland merchants behind town walls.', [
   ['Clear roadside undergrowth sixty paces wide and build guard blockhouses', 135, { securityMonths: 11, credit: 10, stability: 8 }],
   ['Mount swift sheriff posses and grant convoy escorts on market days', 70, { securityMonths: 8, trust: 8, stability: 6 }],
   ['Offer pardon to highwaymen who enlist in frontier garrisons', 0, { stability: 5, securityMonths: 5 }]
  ]],
  ['Corrupt Innkeeper Feeds Spies', 'Caught scouts confess a popular crossroads innkeeper tips off robbers whenever heavy silver chests sleep upstairs.', [
   ['Seize the crooked inn, convert it to a royal post-station, and try him', 55, { securityMonths: 9, legitimacy: 8, development: 1 }],
   ['Require licensed innkeepers to log armed guests nightly', 25, { securityMonths: 7, legitimacy: 6 }],
   ['Fine the innkeeper heavily and post watchmen outside', 0, { gold: 65, securityMonths: 5 }]
  ]],
  ['Armed Merchant Convoys Roll Again', 'Cleared forest sightlines let sunlit wagons roll between fortified post-inns without fear.', [
   ['Standardize stone milestones and refuge bells every two leagues', 70, { development: 1, credit: 8, trust: 8 }],
   ['Grant convoy leaders small arms licenses on royal highways', 30, { trust: 6, securityMonths: 6 }],
   ['Patrol key crossings regularly', 0, { stability: 5 }]
  ]],
  ['Safe Passage Under Royal Peace', 'Confidence surges along inland roads, cutting haulage fees for grain, salt, and cloth alike.', [
   ['Confirm the King’s Highway Peace Statute in county courts', 45, { legitimacy: 8, credit: 7 }],
   ['Reward sharp county sheriffs', 25, { prestige: 6, stability: 5 }],
   ['Close the highway inquiry', 0, { stability: 4 }]
  ]]
 );

 arc4('et_econ_apothecary_spices', 'Economy & Trade', 'epidemic',
  ['Charlatans Selling Colored Chalk Pills', 'As sickness lingers in river alleys, street quacks peddle crushed brick and chalk as costly foreign plague-cure.', [
   ['Outlaw unlicensed street nostrums and license honest apothecary halls', 110, { crisis: -17, legitimacy: 8, trust: 10 }],
   ['Fund free parish herbal dispensaries distributing genuine willow & sage', 85, { crisis: -15, food: 25, trust: 11 }],
   ['Inspect spice shops briefly and confiscate spoiled jars', 0, { crisis: -6, securityMonths: 6 }]
  ]],
  ['Botanical Physic Garden Proposed', 'Learned apothecaries beg an acre behind the abbey wall to cultivate healing herbs cleanly year-round.', [
   ['Endow a walled Royal Physic Garden with glass cold-frames', 100, { research: 12, crisis: -11, development: 1 }],
   ['Set aside abbey cloister beds for fever-herbs and poultice flax', 50, { piety: 7, crisis: -8, research: 6 }],
   ['Import dried Mediterranean herbs cleanly through port brokers', 0, { credit: 5, crisis: -5 }]
  ]],
  ['Printed Pharmacopoeia for Country Midwives', 'Physicians compile a clear, honest manual of dosages and wound washes free of superstition.', [
   ['Print cheap copies for every parish priest and midwife', 60, { research: 9, trust: 9, crisis: -8 }],
   ['Store reference copies inside city guildhalls', 30, { research: 6, legitimacy: 5 }],
   ['Circulate handwritten copies through hospital chapels', 0, { piety: 6, crisis: -4 }]
  ]],
  ['True Craft Replaces Quackery', 'Honest apothecary standards safeguard citizens and spark lasting botanical study.', [
   ['Charter the Society of Royal Apothecaries', 50, { credit: 7, research: 8, prestige: 6 }],
   ['Thank hospital sisters and doctors', 25, { piety: 7, trust: 7 }],
   ['Close the medical market inquiry', 0, { stability: 4 }]
  ]]
 );

 arc4('et_econ_rice_terraces', 'Economy & Trade', 'cont_asia',
  ['Landslides Scar Mountain Rice Terraces', 'Heavy monsoon downpours wash away clay-packed terrace bunds across steep valleys, draining half a county’s seedlings.', [
   ['Mobilize paid village work-crews with stone bunds and bamboo flumes', 140, { food: 105, development: 1, trust: 11 }],
   ['Distribute early-maturing hill rice seed and grain rations', 75, { food: 75, grain: 20, trust: 8 }],
   ['Grant tax exemptions while elders rally terrace repairs', 0, { trust: 7, food: 30 }]
  ]],
  ['Upstream Loggers Blamed for Mudslides', 'Village elders trace deadly mud torrents to reckless hillside timber clearing directly above the terraces.', [
   ['Ban clear-cutting above terraced watersheds and replant bamboo groves', 70, { stability: 8, trust: 10, food: 40 }],
   ['Force timber merchants to build stone check-dams across gullies', 35, { legitimacy: 7, tools: 14 }],
   ['Confine logging strictly to gentle lower valleys', 0, { stability: 5, loyalty: 4 }]
  ]],
  ['Duck-and-Carp Rice Paddies', 'Agronomists show how raising ducks and carp inside flooded paddies eats weeds and doubles village protein.', [
   ['Advance breeding ducklings and carp fry to restored terraces', 75, { food: 75, research: 8, trust: 9 }],
   ['Demonstrate the method on royal domain terraces first', 40, { research: 7, food: 45 }],
   ['Share farmer pamphlets at autumn fairs', 0, { research: 5, food: 25 }]
  ]],
  ['Emerald Steps Down the Mountainside', 'Reinforced stone bunds gleam full of water, yielding bumper double harvests.', [
   ['Record terrace water-sharing customs in stone tablets', 40, { legitimacy: 8, prestige: 6 }],
   ['Replenish district rice granaries cleanly', 45, { food: 60, grain: 16 }],
   ['Close the valley relief accounts', 0, { stability: 4 }]
  ]]
 );

 arc4('et_econ_fur_trappers', 'Economy & Trade', 'land',
  ['Over-Trapped Beaver & Sable Streams', 'Northern fur factors report sharp drops in prime winter pelts as rival trapping bands strip every creek clean.', [
   ['Enact alternating three-year creek trapping seasons and fair depots', 105, { credit: 10, trust: 9, legitimacy: 7 }],
   ['License honest trading posts guaranteeing fair ironware for pelts', 55, { credit: 8, tools: 12, trust: 7 }],
   ['Let competing factors bid freely while stocks hold', 0, { gold: 95, credit: 3 }]
  ]],
  ['Cheated Trappers Torch Trading Shack', 'Enraged trappers burn a factor’s log post after discovering false brass scales and watered spirits.', [
   ['Ban spirits at fur depots and install crown-sealed scales', 60, { trust: 11, legitimacy: 8, unrest: -7 }],
   ['Compensate cheated trappers in wool blankets and iron axes', 65, { tools: 16, trust: 9 }],
   ['Post garrison rangers to keep peace at river forks', 0, { securityMonths: 7, stability: 5 }]
  ]],
  ['Prime Winter Pelts Reach Capital Fairs', 'By spring thaw, regulated trapping yields thicker, finer pelts fetching top coin from foreign buyers.', [
   ['Auction graded royal pelt lots cleanly at the capital exchange', 45, { gold: 105, credit: 8 }],
   ['Gift fur-trimmed robes to honored councilors and ambassadors', 40, { prestige: 9, loyalty: 6 }],
   ['Store reserve pelts for winter army coats', 0, { stability: 5, credit: 4 }]
  ]],
  ['Sustained Northern Harvest', 'Rested creeks teem once more, securing steady pelt wealth without frontier strife.', [
   ['Charter permanent Northern Trading Post Rangers', 50, { securityMonths: 8, credit: 6 }],
   ['Archive seasonal pelt grades cleanly', 20, { legitimacy: 5 }],
   ['Close the northern ledger', 0, { stability: 4 }]
  ]]
 );

 arc4('et_econ_harbor_dredge', 'Economy & Trade', 'trade',
  ['Silt Bar Traps Deep Ocean Carracks', 'Spring river mud silts up the outer harbor channel; heavy merchantmen risk grounding and unload at rival towns instead.', [
   ['Build horse-powered mud-dredger barges and stone training jetties', 155, { development: 1, credit: 12, prestige: 8 }],
   ['Hire tidal rake-boats to scour the main bar daily', 70, { credit: 8, trust: 7 }],
   ['Station lighters outside the bar to shuttle cargo ashore by oar', 0, { credit: 5, gold: 40 }]
  ]],
  ['Sand-Bargemen Clash Over Dumping', 'Fishing villages protest mud-barges dumping river silt straight onto shallow shrimp and mussel beds.', [
   ['Dump dredged silt cleanly behind new sea-wall reclamation dikes', 85, { development: 1, food: 40, trust: 10 }],
   ['Pay barges to haul mud three miles out to deep tidal currents', 45, { trust: 8, credit: 6 }],
   ['Restrict dumping strictly to ebb-tide channels', 0, { stability: 5, trust: 4 }]
  ]],
  ['Deep Channel Rings With Sails', 'Within months, deep-draft ocean carracks glide straight up to stone warehouses at any tide.', [
   ['Install dry-dock careening slips alongside the deep basin', 95, { development: 1, credit: 10, research: 6 }],
   ['Set clear harbor pilotage flags and honest buoy dues', 35, { credit: 8, securityMonths: 6 }],
   ['Collect brisk boosted port customs', 0, { gold: 110 }]
  ]],
  ['Gateway of Ocean Commerce', 'Reclaimed sea-wall land becomes a bustling warehouse quarter anchoring regional trade.', [
   ['Erect a stone Harbormaster Clocktower on the jetty', 55, { prestige: 10, credit: 6 }],
   ['Reward ingenious dredge engineers', 30, { research: 7 }],
   ['Close the harbor works book', 0, { stability: 4 }]
  ]]
 );

 arc4('et_econ_grain_hoard_noble', 'Economy & Trade', 'vassal',
  ['Baronial Granaries Locked Against Towns', 'While city bread prices soar, inspectors learn three lowland lords hold bursting private grain barns waiting for winter famine highs.', [
   ['Compel fair-price market release while compensating honest storage costs', 95, { food: 80, trust: 10, loyalty: 4 }],
   ['Buy their stored grain directly for royal famine depots at fair mid-autumn rates', 130, { food: 110, loyalty: 8, credit: 6 }],
   ['Confiscate hoarded grain under emergency public necessity writ', 0, { food: 85, trust: 9, loyalty: -8 }]
  ]],
  ['Lords Protest Crown Meddling', 'Landed peers mutter at council that grain speculation is their traditional hedge against lean years.', [
   ['Guarantee minimum floor prices in glut years if lords sell fairly in dearth', 65, { loyalty: 9, credit: 8, stability: 7 }],
   ['Offer royal knighthoods and precedence to generous grain-donors', 40, { loyalty: 7, prestige: 6 }],
   ['Remind peers that starving towns breed peasant burnings for all', 0, { legitimacy: 7, stability: 5 }]
  ]],
  ['Wagon Trains Roll Through City Gates', 'Opened barn doors release hundreds of wheat and rye sacks onto city squares within three days.', [
   ['Sell half directly at penny tables and reserve half for spring seed', 55, { food: 60, grain: 16, trust: 8 }],
   ['Post honest scale clerks at every market cross', 25, { legitimacy: 6, trust: 7 }],
   ['Distribute warm porridge at abbey gates', 0, { piety: 7, trust: 6 }]
  ]],
  ['Balanced Kingdom Food Compact', 'Floor-price pledges in good harvests and price caps in lean years forge rare trust between town and manor.', [
   ['Inscribe the Food Compact in parliament rolls', 40, { legitimacy: 8, stability: 6 }],
   ['Inspect county barn roofs before rain', 30, { food: 35 }],
   ['Close the grain compact dossier', 0, { stability: 4 }]
  ]]
 );

 arc4('et_econ_carpet_loom', 'Economy & Trade', 'cont_asia',
  ['Knotters of the Caravan Bazaar', 'Renowned highland carpet weavers offer to set up sixty broad upright looms in the capital if supplied fine wool and vegetable dyes.', [
   ['Build a sunlit Royal Carpet Hall and buy fine madder and saffron dyes', 135, { development: 1, credit: 11, prestige: 10 }],
   ['Grant weavers guild quarters and modest silver loom advances', 70, { credit: 8, acceptance: 8, trust: 7 }],
   ['Tax incoming foreign carpets lightly while letting weavers settle freely', 0, { gold: 70, acceptance: 5 }]
  ]],
  ['Young Women & Orphans Trained', 'Master weavers train orphaned girls and widows in tight knotwork, bringing clean winter wages to poorer alleys.', [
   ['Protect women weavers’ wages by royal guild charter', 55, { trust: 11, acceptance: 9, credit: 6 }],
   ['Endow bright oil lamps and wool-carding sheds for winter work', 50, { development: 1, tools: 14 }],
   ['Inspect finished knot density monthly for export quality', 0, { credit: 6, prestige: 5 }]
  ]],
  ['Embassies Covet Royal Medallion Carpets', 'Foreign ambassadors marvel at intricate floral medallion rugs gleaming across palace stone.', [
   ['Reserve one great ceremonial loom for royal diplomatic gifts', 65, { prestige: 11, credit: 6 }],
   ['License export stalls to ship graded carpets down caravan roads', 35, { gold: 95, credit: 8 }],
   ['Display prized carpets during religious feast processions', 0, { piety: 7, prestige: 7 }]
  ]],
  ['Woven Wealth of the Realm', 'Fine textiles turn raw pasture wool into coveted exports worth ten times their weight in silver.', [
   ['Establish permanent dye-garden plots beside the Carpet Hall', 50, { credit: 8, development: 1 }],
   ['Award silver shuttles to master designers', 25, { prestige: 7 }],
   ['Close the weaving hall accounts', 0, { stability: 4 }]
  ]]
 );

 arc4('et_econ_debt_taxfarm', 'Economy & Trade', 'debt',
  ['Tax-Farmers Squeeze Rural Parishes', 'Private tax-lessees hired during lean wars seize spinning wheels and copper pots for petty arrears, driving angry farmers to flee to woods.', [
   ['Buy out private tax-farms and restore salaried royal bailiffs', 145, { trust: 13, legitimacy: 10, unrest: -10 }],
   ['Impose strict crown court limits outlawing seizure of tools or oxen', 60, { legitimacy: 9, trust: 9, unrest: -6 }],
   ['Audit tax-farm chests and fine abusive collectors heavily', 0, { gold: 90, trust: 6, unrest: -4 }]
  ]],
  ['Angry Financiers Threaten Loan Freeze', 'Displaced tax-lessees sit on banking boards and warn councilors that breaking contracts spooks future credit.', [
   ['Honor fair buyout terms in clear scheduled treasury bonds', 85, { credit: 10, stability: 7, legitimacy: 7 }],
   ['Offer displaced financiers honest state bond brokerages instead', 40, { credit: 8, loyalty: 5 }],
   ['Stand firmly on proof of illegal peasant extortion', 0, { legitimacy: 8, trust: 7 }]
  ]],
  ['Runaways Return From Forest Camps', 'Word of fair salaried bailiffs and protected tools draws dozens of families back to overgrown homesteads.', [
   ['Grant two-year resettlement seed and hearth rebates', 75, { food: 60, trust: 10, development: 1 }],
   ['Verify honest county tax books openly at parish crosses', 30, { legitimacy: 7, trust: 7 }],
   ['Close minor war-tax arrears quietly', 0, { unrest: -5, stability: 5 }]
  ]],
  ['Steadier Treasury Without Cruelty', 'Salaried collection cuts middleman graft, delivering both cleaner coin to the crown and peace to villages.', [
   ['Publish a Charter of Honest Bailiffs', 45, { legitimacy: 8, credit: 7 }],
   ['Celebrate peaceful harvest collections', 25, { trust: 6, prestige: 5 }],
   ['Close the tax-farm reform', 0, { stability: 4 }]
  ]]
 );

 arc4('et_econ_spice_sugar', 'Economy & Trade', 'trade',
  ['Water-Powered Sugar Cane Mills', 'Southern estate stewards introduce heavy iron-roller water-mills crushing cane stalks cleanly for crystalline white loaf-sugar.', [
   ['Finance stone aqueducts and copper boiling houses for export sugar', 145, { development: 1, credit: 12, food: 45 }],
   ['Grant modest tooling loans while forbidding forced peasant corvee', 80, { tools: 18, trust: 9, credit: 8 }],
   ['Tax existing sugar-boiling pans moderately', 0, { gold: 95, credit: 4 }]
  ]],
  ['Sweet Smugglers & Honey Beekeepers', 'Inland monastery beekeepers worry cheap cane sugar loaves will ruin ancient candlewax and honey tithes.', [
   ['Protect beeswax candle monopolies for churches while exporting sugar', 55, { piety: 8, credit: 8, legitimacy: 6 }],
   ['Promote spiced honey-and-sugar confections for urban guilds', 35, { credit: 7, trust: 6 }],
   ['Keep sugar taxed strictly as an imported-style luxury', 0, { gold: 65, piety: 5 }]
  ]],
  ['Fuel Scarcity Near Boiling Houses', 'Copper sugar cauldrons burn mountain brushwood rapidly, threatening hillside erosion.', [
   ['Burn dried crushed cane bagasse cleverly under cauldrons instead', 55, { research: 10, credit: 7, tools: 12 }],
   ['Require two willow saplings planted per boiling season', 30, { trust: 7, stability: 5 }],
   ['Limit boiling months strictly to dry winter weeks', 0, { stability: 5 }]
  ]],
  ['White Cones Bound for Northern Tables', 'Clever bagasse fuel and clean export cones turn sunny valleys into jewel-boxes of crown revenue.', [
   ['Stamp royal crown marks on fine white sugar cones', 40, { prestige: 8, credit: 8 }],
   ['Endow village clinics near hot boiling houses', 45, { trust: 9, piety: 5 }],
   ['Close the sugar mill accounts', 0, { stability: 4 }]
  ]]
 );

 arc4('et_econ_crossroads_bourse_crash', 'Economy & Trade', 'crossroads_finance',
  ['Tulip, Pepper, or Bill Speculation Fever', 'Feverish crowds at the market square trade promissory options on future spice cargoes at triple face value, draining real workshop investment.', [
   ['Require real silver collateral on all futures contracts cleanly', 95, { inflation: -4, credit: 12, stability: 8 }],
   ['Cool frenzy calmly by publishing true incoming fleet manifests', 45, { research: 7, credit: 9, trust: 7 }],
   ['Tax every paper option transfer heavily for public granaries', 0, { gold: 105, food: 35, inflation: -1 }]
  ]],
  ['Paper Fortunes Burst at Noon', 'When an overdue spice fleet drops anchor carrying double ordinary supply, paper option prices halve in an hour.', [
   ['Maintain calm bourse doors and enforce orderly debt settlements', 75, { credit: 11, legitimacy: 9, stability: 7 }],
   ['Provide modest emergency liquidity to honest cloth workshops caught short', 85, { credit: 9, trust: 9, tools: 12 }],
   ['Let reckless speculators settle their own paper losses in civil court', 0, { legitimacy: 6, stability: 4 }]
  ]],
  ['Guilds Return Capital to Real Looms', 'Sobered investors pull bullion out of paper bets and back solid dockyards, looms, and flour mills.', [
   ['Offer small tax holidays on new brick workshops and water-mills', 80, { development: 1, credit: 10, tools: 16 }],
   ['Require annual open audits from licensed merchant banks', 40, { credit: 8, legitimacy: 7 }],
   ['Collect normal steady harbor customs', 0, { gold: 80 }]
  ]],
  ['Steady Ground Beneath the Bourse', 'Measured rules curb mania without crushing legitimate credit—an enduring shield for future booms.', [
   ['Publish a clear Ordinance Against Empty Paper Bets', 45, { legitimacy: 8, inflation: -2 }],
   ['Praise steady guildmasters at council', 25, { prestige: 6, trust: 6 }],
   ['Close the bourse stability inquiry', 0, { stability: 4 }]
  ]]
 );

 arc4('et_econ_flood_mill', 'Economy & Trade', 'land',
  ['Logjam Smashes the County Weir', 'Spring timber rafts tearing loose upstream smash through the stone county mill-weir, leaving three valley towns short of flour.', [
   ['Rebuild a stronger angled stone weir with log-chutes and floodgates', 145, { development: 1, food: 75, trust: 10 }],
   ['Set up horse-driven emergency millstones while mending timber cribs', 70, { food: 50, tools: 14, trust: 7 }],
   ['Fine reckless timber-rafters to pay basic repairs', 0, { gold: 70, food: 20, legitimacy: 5 }]
  ]],
  ['Log-Drivers Demand Free River Chutes', 'Upland foresters warn banning spring log-drives cuts shipyard and housebeam timber across the entire capital.', [
   ['Build wide sloped timber sluice-slides beside every river dam', 80, { development: 1, credit: 9, tools: 14 }],
   ['Schedule log-driving strictly for five marked spring days', 30, { legitimacy: 7, stability: 6 }],
   ['Collect per-log damage bonds at upstream bridges', 0, { gold: 55, securityMonths: 6 }]
  ]],
  ['Bakers & Boatmen Share the River', 'Clear sluice bells and stout weir stones let both flour-grinding and timber-rafting thrive side by side.', [
   ['Appoint salaried river-weir wardens at major bends', 50, { stability: 7, credit: 6 }],
   ['Restock flour chests at valley parishes', 40, { food: 50, trust: 7 }],
   ['Inspect millstones cleanly', 0, { tools: 8 }]
  ]],
  ['Harnessed Current', 'Angled stone weirs outlast decades of snowmelt, powering both mills and downstream trade.', [
   ['Record river-chute standards in royal engineering books', 40, { research: 7, legitimacy: 6 }],
   ['Host a riverside blessing of the new mill', 25, { piety: 7, trust: 6 }],
   ['Close the river weir docket', 0, { stability: 4 }]
  ]]
 );

 arc4('et_econ_customs_silk_embargo', 'Economy & Trade', 'difference',
  ['Foreign Minority Merchants Targeted by Riot', 'Blaming hard times on foreign quarters, angry apprentices smash shutters along the spice and linen street.', [
   ['Restore street peace swiftly, pay damages, and affirm shared fair laws', 110, { acceptance: 13, trust: 10, unrest: -10 }],
   ['Station mixed watchmen and host joint guild reconciliation feasts', 70, { acceptance: 10, stability: 7, unrest: -7 }],
   ['Close the quarter briefly while magistrates investigate rumors', 0, { securityMonths: 7, unrest: -4, acceptance: -3 }]
  ]],
  ['Ringleaders Caught With Stolen Velvet', 'Magistrates prove troublemakers were hired thugs paid by a bankrupt native rival hoping to erase debts.', [
   ['Try the scheming rival openly in guild court to clear newcomers’ names', 45, { legitimacy: 10, acceptance: 9, trust: 8 }],
   ['Require transparent bilingual debt-ledgers in every bazaar', 35, { credit: 8, acceptance: 7 }],
   ['Fine conspirators and return recovered bolts', 0, { gold: 70, acceptance: 6 }]
  ]],
  ['Foreign Factors Offer Civic Gift', 'Relieved and grateful, the foreign merchant colony offers to fund a stone harbor fountain and free grammar chairs.', [
   ['Accept warmly and co-sponsor a bilingual civic school', 75, { research: 10, acceptance: 10, development: 1 }],
   ['Inscribe both communities’ emblems on the new market fountain', 45, { prestige: 9, acceptance: 9 }],
   ['Thank them graciously while keeping harbor taxes fair', 0, { credit: 7, acceptance: 6 }]
  ]],
  ['Harmony of the Bazaar', 'Firm justice during dark hours wins fierce loyalty from every trading quarter.', [
   ['Confirm equal Merchant Safe-Conduct Charters', 40, { legitimacy: 8, credit: 8 }],
   ['Celebrate shared summer market days', 25, { acceptance: 8, trust: 6 }],
   ['Close the market peace commission', 0, { stability: 4 }]
  ]]
 );

 arc4('et_econ_grain_pest', 'Economy & Trade', 'drought',
  ['Locust Swarms Blacken the Southern Sky', 'Rattling clouds of migratory locusts drop onto ripening barley fields, stripping green stalks bare within hours.', [
   ['Mobilize trench-beaters, fowl flocks, and emergency granary wagons', 145, { crisis: -19, food: 75, trust: 11 }],
   ['Buy unaffected northern rye immediately and distribute seed peas', 85, { crisis: -13, food: 60, grain: 18 }],
   ['Pay copper bounties per bushel of collected locust eggs', 0, { gold: -15, crisis: -8, trust: 6 }]
  ]],
  ['Ploughing Egg-Beds Before Frost', 'Agronomists urge deep winter ploughing across dry banks to expose buried locust egg-pods to birds and frost.', [
   ['Advance iron ploughshares and ox-fodder to afflicted villages', 85, { tools: 18, food: 45, crisis: -11 }],
   ['Employ hungry cottagers turning soil banks for bread wages', 55, { food: 40, crisis: -9, trust: 8 }],
   ['Publish village parish alerts mapping egg-laying ridges', 0, { research: 6, crisis: -5 }]
  ]],
  ['Herds Starve Without Straw', 'With stubble stripped bare, shepherds threaten to slaughter breeding ewes before winter.', [
   ['Ship compressed meadow-hay barges downriver at crown expense', 85, { food: 55, credit: 6, trust: 9 }],
   ['Permit temporary winter grazing inside royal oak forests', 25, { trust: 9, crisis: -7 }],
   ['Salt surplus meat cleanly into parish winter barrels', 0, { food: 40 }]
  ]],
  ['Breeding Flocks Saved', 'Timely winter ploughing and shipped hay carry breeding herds and seed-corn safely into green spring.', [
   ['Stock permanent emergency hay-barns beside river ports', 55, { food: 50, stability: 7 }],
   ['Thank rural parishes for swift trench mobilization', 25, { trust: 8, prestige: 5 }],
   ['Close the locust emergency file', 0, { stability: 4 }]
  ]]
 );

 arc4('et_econ_mint_goldsmith', 'Economy & Trade', 'debt',
  ['Goldsmiths Issuing Receipt Notes', 'Wealthy citizens leave heavy silver chests inside goldsmiths’ brick vaults, paying debts with signed goldsmith deposit-notes.', [
   ['Regulate licensed deposit bankers with clear reserve ratios and courts', 110, { credit: 13, research: 8, legitimacy: 7 }],
   ['Partner crown treasury deposits with trusted civic goldsmith halls', 65, { credit: 10, gold: 75 }],
   ['Restrict paper deposit-notes strictly to wholesale guild bills', 0, { stability: 6, inflation: -2 }]
  ]],
  ['Run on a Reckless Goldsmith’s Vault', 'One flashy goldsmith lent too much coin to gambling lords; depositors hammer his iron shutters at dawn.', [
   ['Audit his chest openly and guarantee honest tradesmen’s savings', 95, { credit: 11, stability: 8, trust: 9 }],
   ['Seize his pledged manor bonds to pay depositors ninety pence on the pound', 35, { legitimacy: 8, credit: 7 }],
   ['Close his counter cleanly under bankruptcy wardens', 0, { stability: 5, credit: -2 }]
  ]],
  ['Bankers Propose Standardized Checks', 'Honest vaults propose uniform watermarked bearer orders redeemable across provincial branches.', [
   ['License royal-chartered branch clearing houses cleanly', 75, { credit: 11, development: 1, research: 6 }],
   ['Require dual signatures and public quarterly balance oaths', 30, { legitimacy: 8, securityMonths: 7 }],
   ['Keep branch transfers within capital guild control', 0, { credit: 5, stability: 4 }]
  ]],
  ['Vaults of Quiet Confidence', 'Sound goldsmith regulation turns idle hoarded silver into brisk working capital for farms and ships.', [
   ['Publish clear Royal Banking Reserve Statutes', 45, { legitimacy: 8, credit: 8 }],
   ['Mint crisp gold pieces backing vault trust', 40, { prestige: 8, credit: 6 }],
   ['Close the goldsmith commission', 0, { stability: 4 }]
  ]]
 );

 // 10 more chains to reach exact 65 chains = 260 stages! Let's count carefully:
 // Sections A..G = 4+4+4+4+4+4+3 = 27. Section H so far = 17. 27 + 17 = 44. We need 21 more chains to hit 65! Let's check:
 // Let's write 21 rich, crisp 4-stage chains below (making exact 65 chains = 260 stages).
 arc4('et_econ_silk_weir', 'Economy & Trade', 'land',
  ['Stolen Water Along the Irrigation Ditch', 'Orchardists upstream cut unauthorized side-channels, leaving lower vegetable gardens parched before midsummer.', [
   ['Build masonry water-dividers and appoint sworn ditch-wardens', 120, { food: 65, trust: 11, development: 1 }],
   ['Measure timed wooden sluice-gates supervised by parish elders', 55, { food: 45, trust: 8, legitimacy: 6 }],
   ['Fine illegal notch-cutters and restore old ditch markers', 0, { gold: 50, legitimacy: 6 }]
  ]],
  ['Feud Over Night-Watering Hours', 'Smaller cottagers complain wealthy orchards monopolize bright daylight turns and leave widows watering at midnight.', [
   ['Assign fair rotating day-and-night schedules by lottery each moon', 45, { trust: 11, unrest: -7 }],
   ['Dig a shared community holding pond beside lower plots', 75, { development: 1, food: 45, trust: 8 }],
   ['Split remaining flow cleanly down center stones', 0, { stability: 6, trust: 4 }]
  ]],
  ['Silted Feeder Canal Needs Clearing', 'Summer weeds and mud halve flow across the main intake arch.', [
   ['Pay village youths cleanly to clear reeds and line banks with stone', 65, { food: 45, trust: 8, development: 1 }],
   ['Organize annual spring ditch-cleaning festival days with ale & roast', 35, { trust: 9, food: 25 }],
   ['Assign customary parish corvee along each landowner’s frontage', 0, { stability: 5, trust: 3 }]
  ]],
  ['Orchards & Gardens Bloom Together', 'Fair water-dividers turn bitter neighbors into thriving market-garden partners.', [
   ['Inscribe the Water-Turn Table in brass at the weir', 35, { legitimacy: 7, prestige: 5 }],
   ['Endow clean stone washing-steps beside the pond', 30, { trust: 7, piety: 4 }],
   ['Close the irrigation roll', 0, { stability: 4 }]
  ]]
 );

 arc4('et_econ_copper_roof', 'Economy & Trade', 'lowstability',
  ['Leaking Roofs Over the Royal Warehouse', 'Cheap warped tiles let autumn squalls soak stored saltpeter, wool, and archive chests inside capital storehouses.', [
   ['Sheathe roofs in hammered copper sheets and clean stone gutters', 145, { development: 1, stability: 9, credit: 7 }],
   ['Re-lay thick interlocking clay pantiles and oak rafters', 75, { stability: 7, tools: 15, trust: 6 }],
   ['Patch worst rafters temporarily with tarred canvas', 0, { stability: 3, tools: 5 }]
  ]],
  ['Suspicion Over Missing Lead Gutters', 'Auditors find ancient lead roof-flashing vanished—quietly sold off by a lazy storehouse keeper.', [
   ['Try the keeper and appoint honest guild surveyors over works', 45, { legitimacy: 9, securityMonths: 8, stability: 6 }],
   ['Compel the keeper’s bondsmen to replace missing metal cleanly', 25, { tools: 16, legitimacy: 6 }],
   ['Dismiss him silently and lock roof hatches', 0, { securityMonths: 6 }]
  ]],
  ['Dry Vaults Attract Merchant Rentals', 'Impressed by bone-dry stone bays, foreign spice brokers offer prime rents for spare ground vaults.', [
   ['Rent spare bays cleanly to boost customs stability', 40, { gold: 95, credit: 8 }],
   ['Reserve spare space for emergency municipal grain sacks', 50, { food: 65, stability: 7 }],
   ['Store royal cloth and ordnance safely inside', 0, { securityMonths: 7, tools: 10 }]
  ]],
  ['Green Patina Over Steady Stores', 'Weatherproofed copper gables guard crown goods cleanly against decades of storms.', [
   ['Establish annual pre-autumn roof inspections across crown halls', 35, { stability: 6, securityMonths: 6 }],
   ['Praise loyal roofers and plumbers', 20, { trust: 6, prestige: 4 }],
   ['Close the works ledger', 0, { stability: 4 }]
  ]]
 );

 arc4('et_econ_wool_smuggle', 'Economy & Trade', 'trade',
  ['Midnight Wool Boats Slip the Estuary', 'To dodge wool export duties, estate bailiffs load raw fleece onto foreign smuggler hoys in tidal creeks, starving native looms.', [
   ['Cut raw-wool export clogs gently while rewarding domestic broadcloth weavers', 110, { credit: 10, tools: 14, development: 1 }],
   ['Patrol tidal creeks with revenue sloops and tighten staple port checks', 65, { securityMonths: 9, gold: 80, credit: 6 }],
   ['Raise raw-wool confiscation penalties in coastal courts', 0, { legitimacy: 6, gold: 65, securityMonths: 5 }]
  ]],
  ['Staple Towns Clamor for Support', 'Inland weaving towns complain untaxed raw fleece gives foreign weavers unfair cloth-price edges.', [
   ['Grant domestic weavers cheap wool-washing mills and credit', 85, { development: 1, credit: 9, trust: 8 }],
   ['Require foreign buyers to purchase finished cloth alongside raw bales', 40, { credit: 8, tools: 12 }],
   ['Hold staple wool auctions strictly inside walled royal towns', 0, { legitimacy: 7, credit: 5 }]
  ]],
  ['Coastal Farmers Protest Lost Buyers', 'Sheep farmers grumble that blocking foreign wool hoys leaves shearing sheds packed unsold.', [
   ['Guarantee royal cloth-hall cash purchases of honest domestic clip', 90, { trust: 10, credit: 8, loyalty: 6 }],
   ['Allow graded surplus raw wool exports once home looms are filled', 35, { credit: 8, trust: 7 }],
   ['Encourage conversion of surplus fleeces into warm army blankets', 0, { stability: 6, food: 20 }]
  ]],
  ['Finished Broadcloth Leads the Market', 'Gradual encouragement turns raw fleece exporters into proud producers of finished high-margin cloth.', [
   ['Publish a Permanent Staple & Broadcloth Charter', 45, { legitimacy: 8, credit: 8 }],
   ['Host an autumn cloth showcase at the port', 35, { prestige: 9, credit: 6 }],
   ['Close the wool trade inquiry', 0, { stability: 4 }]
  ]]
 );

 arc4('et_econ_salt_tax_riot', 'Economy & Trade', 'unrest',
  ['Smashed Salt-Tax Barrels in the Square', 'Outraged by steep salt excise pennies, market women overturn collector tables and scatter rock-salt across the cobbles.', [
   ['Lower salt excise on household pots and shift revenue to luxury silks', 105, { unrest: -13, trust: 12, credit: 6 }],
   ['Suspend salt collectors’ harsh house-searches and hear town petitions', 45, { unrest: -8, legitimacy: 8, trust: 7 }],
   ['Send town halberdiers to restore market order cleanly', 0, { stability: 5, unrest: 4 }]
  ]],
  ['Fishwives & Dairymaids Lead Talks', 'Bold market elders enter the town hall showing how expensive salt spoils summer butter and winter bacon.', [
   ['Guarantee tax-free coarse curing salt for rural dairies and fishers', 75, { food: 65, trust: 11, unrest: -8 }],
   ['Fix transparent county salt price ceilings posted on church doors', 35, { legitimacy: 8, trust: 8 }],
   ['Promise gradual tax reductions once war loans ease', 0, { stability: 5, trust: 4 }]
  ]],
  ['Exchequer Balances Luxury Tariffs', 'Silk velvet, exotic wines, and gilt plate easily absorb the modest luxury customs replacing harsh salt pennies.', [
   ['Inspect port luxury docks cleanly to prevent velvet smuggling', 55, { gold: 90, securityMonths: 7, credit: 6 }],
   ['Simplify overall excise tables into three plain brackets', 35, { research: 6, legitimacy: 7 }],
   ['Keep luxury levies moderate so trade stays brisk', 0, { credit: 7 }]
  ]],
  ['Peaceful Butter-Crosses', 'Cheaper curing salt fills winter larders with sweet butter and cured pork, healing urban resentment.', [
   ['Carve balanced tax vows into the market cross plinth', 35, { legitimacy: 7, prestige: 6 }],
   ['Feast parish elders modestly', 20, { trust: 7 }],
   ['Close the excise commission', 0, { stability: 4 }]
  ]]
 );

 arc4('et_econ_river_ice_jam', 'Economy & Trade', 'crisis',
  ['Frozen River Halts Mill & Ferry', 'An uncommonly bitter freeze locks barges midstream and piles jagged ice dams against stone bridge piers.', [
   ['Deploy pioneers with powder charges and timber rams to save piers', 135, { crisis: -19, development: 1, trust: 9 }],
   ['Organize overland grain sleighs and distribute firewood bundles', 80, { crisis: -14, food: 55, trust: 10 }],
   ['Warn low river wards to evacuate cellars before thaw', 0, { crisis: -7, stability: 5, trust: 5 }]
  ]],
  ['Firewood Scarcity Grips River Wards', 'With coal and timber barges frozen tight, charcoal prices triple inside poorer river alleys.', [
   ['Open royal park windfall timber and sell bundles at cost', 85, { crisis: -13, trust: 11, unrest: -7 }],
   ['Light large communal iron braziers in market squares and churches', 45, { piety: 7, crisis: -8, trust: 7 }],
   ['Forbid firewood hoarding by innkeepers', 0, { legitimacy: 6, crisis: -5 }]
  ]],
  ['Thaw Floods Test the Cleared Piers', 'Sudden warm rain cracks the ice floes; thanks to cleared channels, surging meltwater shoots cleanly under arches.', [
   ['Keep watchmen with boat-hooks guiding drifting logs clear', 45, { crisis: -9, securityMonths: 6 }],
   ['Inspect bridge footings immediately once water drops', 30, { development: 1, stability: 5 }],
   ['Open temporary ferry skiffs while bridges dry', 0, { credit: 5 }]
  ]],
  ['Cleared Arches, Warm Hearths', 'Swift action saves both stone piers and poor households from ruinous winter frost.', [
   ['Build pointed stone ice-breakers upstream of bridge piers', 65, { development: 1, crisis: -6 }],
   ['Replenish municipal fuel yards for future freezes', 40, { stability: 6, tools: 10 }],
   ['Close the winter freeze docket', 0, { stability: 4 }]
  ]]
 );

 arc4('et_econ_pearl_millet', 'Economy & Trade', 'cont_africa',
  ['Granary Towers of Clay & Millet', 'Savanna villagers showcase elevated woven-clay granaries sealed with wood-ash that keep sorghum and millet pest-free for years.', [
   ['Fund district clay granary belts and drought seed exchanges', 130, { food: 100, development: 1, trust: 10 }],
   ['Buy surplus harvest millet directly into regional royal reserves', 75, { food: 75, grain: 22, credit: 6 }],
   ['Honor traditional village granary elders with salt gifts', 0, { trust: 7, acceptance: 6 }]
  ]],
  ['Locusts & Quelea Birds Threaten Heads', 'Clouds of seed-eating birds descend on ripening fields right before harvest moon.', [
   ['Organize coordinated parish watch-drums, slings, and early harvesting', 55, { food: 50, trust: 8 }],
   ['Reward village youths guarding communal threshing floors', 30, { trust: 7, stability: 5 }],
   ['Harvest slightly early and dry grain cleanly on flat stone', 0, { food: 35, grain: 10 }]
  ]],
  ['Caravan Drovers Trade Salt for Millet', 'Filled clay towers become bustling rural exchange points drawing Saharan salt bars south.', [
   ['Set honest brass weighing measures beneath shade trees', 50, { credit: 9, trust: 8 }],
   ['Station light mounted escorts along market trails', 40, { securityMonths: 7, credit: 5 }],
   ['Collect modest market grain tenths', 0, { food: 40, gold: 45 }]
  ]],
  ['Abundance Across Dry Seasons', 'Sealed ash-granaries ensure hunger stays far from valley hearths even when rains come late.', [
   ['Train northern bailiffs in sealed wood-ash storage craft', 45, { research: 8, food: 35 }],
   ['Celebrate harvest drums openly', 25, { prestige: 6, trust: 7 }],
   ['Close the savanna harvest roll', 0, { stability: 4 }]
  ]]
 );

 arc4('et_econ_chinampa_canals', 'Economy & Trade', 'cont_americas',
  ['Silt Chokes Lake Garden Canals', 'Heavy ash and reeds clog boat channels threading fertile raised-bed gardens, slowing canoe deliveries to urban markets.', [
   ['Mobilize paid canoe dredgers and weave fresh willow-stake borders', 125, { food: 95, development: 1, trust: 10 }],
   ['Issue copper digging spades and coordinate neighborhood channel days', 65, { tools: 18, food: 65, trust: 8 }],
   ['Clear main market boat lanes first cleanly', 0, { food: 40, credit: 4 }]
  ]],
  ['Floating Nurseries Bloom With Maize', 'Cleared canals bring rich black muck straight onto willow beds, boosting maize, squash, and chili yields.', [
   ['Seed experimental terraced plots with hardy highland beans too', 65, { food: 55, research: 8 }],
   ['Organize covered canoe-landing sheds at the main plaza', 55, { development: 1, credit: 8 }],
   ['Let gardeners sell surplus flowers and herbs freely', 0, { credit: 6, trust: 6 }]
  ]],
  ['Sluice Gate Dispute After Cloudburst', 'Brackish lake surges threaten freshwater garden channels after heavy mountain storms.', [
   ['Reinforce stone causeway sluice-gates separating salt from sweet water', 95, { development: 1, food: 60, stability: 7 }],
   ['Post night dike-watchers with conch horns along the causeway', 30, { securityMonths: 7, trust: 6 }],
   ['Open spillway ditches gently into reed marshes', 0, { food: 30, stability: 4 }]
  ]],
  ['Emerald Gardens on Sweet Water', 'Maintained sluices and rich canal silt sustain dense, bustling city markets year-round.', [
   ['Record dike and canal schedules in tribute codices', 40, { legitimacy: 7, research: 5 }],
   ['Feast canoe crews and gardeners at market bells', 25, { trust: 8, prestige: 5 }],
   ['Close the lake works ledger', 0, { stability: 4 }]
  ]]
 );

 arc4('et_econ_mint_copper_mine', 'Economy & Trade', 'debt',
  ['Debased War-Pennies Refuse to Clear', 'Merchants reject thin wartime copper-washed pennies, demanding three times face value for salt pork and wool.', [
   ['Retire bad war-pennies at full face value and mint pure standard coin', 155, { inflation: -5, credit: 13, trust: 11 }],
   ['Accept bad pennies strictly at tax desks to retire them gradually', 60, { inflation: -3, credit: 7, trust: 7 }],
   ['Order open markets to honor stamped coin until autumn harvest', 0, { inflation: 2, unrest: 5, legitimacy: 3 }]
  ]],
  ['Moneychangers Gouge Poor Soldiers', 'Veterans paid in wartime copper lose half their wages to alley moneychangers before buying boots.', [
   ['Open crown exchange tables trading soldier coin at fair par', 85, { trust: 11, credit: 8, unrest: -8 }],
   ['Hang fair official exchange rate boards outside town gates', 30, { legitimacy: 7, trust: 6 }],
   ['Fine crooked street changers in municipal court', 0, { gold: 55, trust: 5 }]
  ]],
  ['Confidence Steadies Bread & Cloth', 'As bad base coin vanishes into melting pots, genuine silver and heavy copper restore swift daily trade.', [
   ['Stamp honest weight numerals openly on every new coin face', 45, { credit: 9, research: 5 }],
   ['Pay royal contractors strictly in sound new issues', 55, { credit: 8, stability: 6 }],
   ['Close old war-mint dies publicly at town hall', 0, { prestige: 7, legitimacy: 6 }]
  ]],
  ['Trusted Stamp Across Realms', 'Retiring bad coin cleanly at crown cost cements lifelong market faith in your realm’s currency.', [
   ['Charter permanent Royal Mint Assay Guilds', 50, { credit: 9, legitimacy: 7 }],
   ['Display broken war-dies in the treasury hall', 20, { prestige: 6 }],
   ['Close the currency reform ledger', 0, { stability: 4 }]
  ]]
 );

 arc4('et_econ_printing_contracts', 'Economy & Trade', 'crossroads_press',
  ['Printed Guild Forms & Bills of Lading', 'Forward-looking merchants adopt printed standardized bills of lading and shipping receipts, cutting port delays by half.', [
   ['Standardize royal printed bills of lading and harbor customs receipts', 110, { credit: 12, research: 10, legitimacy: 7 }],
   ['License guild printers to sell uniform account books freely', 50, { credit: 8, research: 7 }],
   ['Require handwritten notary attestations alongside printed blanks', 0, { securityMonths: 7, stability: 5 }]
  ]],
  ['Notaries Fear Lost Ink Fees', 'Old parchment scriveners picket the guildhall, crying that printed forms steal honest quill livelihoods.', [
   ['Retrain scriveners as salaried customs registrars and archive clerks', 75, { trust: 9, legitimacy: 7, unrest: -6 }],
   ['Reserve wills, land deeds, and noble treaties strictly for hand parchment', 35, { stability: 6, trust: 7 }],
   ['Let market speed decide between press and quill', 0, { credit: 6, unrest: 2 }]
  ]],
  ['Forged Printed Stamps Appear', 'Smugglers replicate simple woodcut customs stamps to pass untaxed wine casks.', [
   ['Introduce intricate copperplate engravings and secret watermarks', 80, { research: 10, securityMonths: 10, credit: 6 }],
   ['Pair printed forms with wax signet seals held by port wardens', 35, { securityMonths: 8, legitimacy: 6 }],
   ['Inspect wine casks manually at every inner gate', 0, { securityMonths: 6 }]
  ]],
  ['Speed Without Fraud', 'Watermarked printed receipts move ship cargoes cleanly while protecting treasury customs.', [
   ['Supply printed tax tables to county sheriffs', 45, { legitimacy: 7, research: 6 }],
   ['Award royal printer privileges cleanly', 30, { prestige: 7, credit: 5 }],
   ['Close the printing reform', 0, { stability: 4 }]
  ]]
 );

 arc4('et_econ_glass_bead_trade', 'Economy & Trade', 'trade',
  ['Venetian-Style Trade Beads & Brass', 'Artisans master wound polychrome glass beads and fine brass wire coils highly prized along distant coastal and river markets.', [
   ['Fund clean furnace workshops and charter overseas trade factors', 135, { credit: 12, development: 1, tools: 14 }],
   ['Partner native glassmakers with experienced foreign factors', 70, { credit: 9, acceptance: 8, research: 6 }],
   ['Collect modest workshop fees while buyers export independently', 0, { gold: 90, credit: 4 }]
  ]],
  ['Rival Factors Cut Quality', 'Greedy captains dilute cargo chests with cracked, dull beads, tarnishing your ports’ prized reputation.', [
   ['Enforce strict port assay chests inspecting bead brightness before sail', 55, { credit: 10, legitimacy: 8, prestige: 6 }],
   ['Print branded cloth wraps identifying certified guild glass', 35, { credit: 7, prestige: 6 }],
   ['Let honest buyers reject shoddy chests at auction', 0, { credit: 4 }]
  ]],
  ['Returning Cargoes of Gold, Gum & Ivory', 'Trusted bright beads buy steady gold dust, beeswax, and aromatic gum arabic at coastal factories.', [
   ['Build cool stone spice-and-wax warehouses along the pier', 85, { development: 1, credit: 10 }],
   ['Expand royal apothecary stocks with imported gum and resins', 45, { research: 8, trust: 6 }],
   ['Collect brisk customs cleanly on return hulls', 0, { gold: 105 }]
  ]],
  ['Craft Powers Distant Trade', 'High-value native glass and brassware keep silver flowing steadily homeward.', [
   ['Endow a Design School for glass and metalwork apprentices', 60, { research: 9, prestige: 7 }],
   ['Celebrate returning merchant captains', 25, { credit: 6, prestige: 5 }],
   ['Close the craft export ledger', 0, { stability: 4 }]
  ]]
 );

 arc4('et_econ_granary_rats', 'Economy & Trade', 'food',
  ['Rats & Weevil Heat in the Tithe Barn', 'Warm damp autumn traps heat inside overflowing wooden grain barns; bailiffs smell sour fermenting rye.', [
   ['Build ventilated brick drying kilns and brick-pillar stone bins', 135, { food: 95, development: 1, trust: 8 }],
   ['Hire parish threshers to spread and turn grain on sunny canvas', 65, { food: 65, trust: 7 }],
   ['Distribute damp rye rapidly to breweries and pig-keepers before rot spreads', 0, { food: 35, gold: 45 }]
  ]],
  ['Lime-Wash & Bay-Leaf Storage', 'Old abbey cellarmen demonstrate rubbing oak bin walls with limewash and dried bay leaves to repel weevils.', [
   ['Fund limewash crews across every district public granary', 55, { food: 55, grain: 16, research: 5 }],
   ['Keep lean nimble terrier-cats and owls inside storehouses', 20, { food: 35, trust: 5 }],
   ['Adopt the abbey method cleanly at low cost', 0, { food: 30, piety: 4 }]
  ]],
  ['Clean Dry Meal Commands Top Market Coin', 'Dry sweet-smelling flour brings baker buyers from three neighboring counties.', [
   ['Hold back thirty percent in royal winter reserve before selling surplus', 45, { food: 55, stability: 7 }],
   ['Sell surplus cleanly to finance new stone barns', 30, { gold: 80, credit: 6 }],
   ['Distribute modest loaves to town almshouses', 0, { piety: 7, trust: 7 }]
  ]],
  ['Zero Wasted Bushels', 'Ventilated kilns and clean bins stretch every good harvest cleanly across lean years.', [
   ['Publish illustrated grain-storage guides for manor stewards', 40, { research: 7, food: 30 }],
   ['Reward sharp-nosed granary clerks', 20, { trust: 5, legitimacy: 4 }],
   ['Seal the clean granary books', 0, { stability: 4 }]
  ]]
 );

 arc4('et_econ_guild_bank_failure', 'Economy & Trade', 'crossroads_finance',
  ['Default in the Mediterranean Wool Fleet', 'News arrives that storms and war sank three galleys insured by a major banking house, rattling confidence in their paper.', [
   ['Back healthy domestic depositors while restructuring failed shares cleanly', 135, { credit: 12, stability: 8, trust: 8 }],
   ['Hold an orderly three-day bank holiday to audit true vault coin', 55, { credit: 8, securityMonths: 7, stability: 6 }],
   ['Freeze only foreign dividend payouts until ships settle', 0, { legitimacy: 6, credit: 3 }]
  ]],
  ['Frightened Widows Queue at Dawn', 'Ordinary artisans and widows clutching small deposit receipts weep outside locked iron doors.', [
   ['Pay out all small household deposits first from crown relief funds', 95, { trust: 13, unrest: -9, credit: 8 }],
   ['Guarantee small receipts fully against future municipal salt taxes', 45, { trust: 9, credit: 6 }],
   ['Post calm aldermen explaining exact asset schedules', 0, { stability: 5, trust: 4 }]
  ]],
  ['Solvent Guild Banks Pool Support', 'Reassured by swift royal poise, four rival solvent banks step in to absorb sound wool bills.', [
   ['Charter a cooperative clearing reserve shared across all city banks', 75, { credit: 11, legitimacy: 7 }],
   ['Require minimum liquid silver vaults by public statute', 35, { inflation: -2, credit: 8 }],
   ['Record the rescue compact cleanly', 0, { stability: 5 }]
  ]],
  ['Panic Quelled Before Dusk', 'Decisive protection of ordinary savers turns a looming crash into lasting faith in royal supervision.', [
   ['Publish a Charter of Depositor Protections', 45, { legitimacy: 8, credit: 8 }],
   ['Thank steady city aldermen', 25, { prestige: 6, trust: 6 }],
   ['Close the banking crisis file', 0, { stability: 4 }]
  ]]
 );

 arc4('et_econ_quarantine_salt', 'Economy & Trade', 'crisis',
  ['Tainted Well-Water in the Tannery Lane', 'Leather-soaking vats seep into shallow street wells, sickening dozens of apprentices in cramped river alleys.', [
   ['Seal tainted wells, pipe fresh upland spring water, and move tanners downstream', 145, { crisis: -20, development: 1, trust: 11 }],
   ['Dig deep stone cisterns and supply boiled herbal broth daily', 80, { crisis: -14, food: 35, trust: 9 }],
   ['Close alley wells and cart river water from upstream bridges', 0, { crisis: -7, trust: 5 }]
  ]],
  ['Tanners Fight Relocation Costs', 'Master tanners protest that moving oak bark pits downstream ruins decades of sunken brick vats.', [
   ['Pay fair relocation grants and build clean riverside stone pits', 95, { development: 1, credit: 8, trust: 9 }],
   ['Grant tax-free bark carts if tanners adopt leak-proof clay linings', 45, { trust: 7, credit: 6 }],
   ['Enforce water-safety decrees sternly over guild complaints', 0, { legitimacy: 7, crisis: -6 }]
  ]],
  ['Fountains Flowing Clear', 'Stone lion-spouts pour cold upland spring water into neighborhood basins cleanly day and night.', [
   ['Assign civic water-wardens to guard aqueduct joints from tampering', 45, { securityMonths: 8, trust: 7 }],
   ['Open free public bathhouses beside the clean conduit', 60, { crisis: -9, trust: 9, prestige: 6 }],
   ['Bless the new street fountains openly', 0, { piety: 7, stability: 4 }]
  ]],
  ['Healthy Springs, Clean Workshops', 'Fresh conduits banish alley fever while downstream stone tanneries turn out brisk supple leather.', [
   ['Carve municipal water-purity rules into fountain stonework', 35, { legitimacy: 7, prestige: 5 }],
   ['Reward honest physicians who traced the tainted wells', 30, { research: 7, trust: 6 }],
   ['Close the sanitation works roll', 0, { stability: 4 }]
  ]]
 );

 arc4('et_econ_spice_barge', 'Economy & Trade', 'cont_asia',
  ['Teak Barges Crowd the River Delta', 'Teak logs, lacquered ware, and jasmine rice choke narrow delta canals while rival port masters levy unpredictable anchorage gifts.', [
   ['Dredge delta forks and post transparent bilingual brass toll plaques', 135, { credit: 12, development: 1, acceptance: 9 }],
   ['Build wooden bamboo-and-teak mooring piers with royal wardens', 65, { credit: 8, trust: 8 }],
   ['Maintain customary harbor gifts while capping sudden surcharges', 0, { gold: 75, credit: 4 }]
  ]],
  ['Silt-Bars Trap Heavy Rice Barges', 'Falling dry-season rivers strand loaded rice keels twenty leagues short of capital granaries.', [
   ['Hire shallow-draft flat-punts to lighter grain cleanly to stone quays', 85, { food: 75, credit: 7, trust: 8 }],
   ['Open temporary upland ox-cart trails bypassing the dry bend', 45, { food: 45, trust: 6 }],
   ['Await next tidal bore while posting guard boats over stranded sacks', 0, { securityMonths: 6, food: 20 }]
  ]],
  ['Delta Potters & Lacquerers Bloom', 'Steady barge traffic sparks bustling riverside kiln villages firing blue-and-white export jars.', [
   ['Sponsor royal kiln marks and wood-ash glaze trials', 80, { research: 10, credit: 9, prestige: 8 }],
   ['Lower river tolls on fired porcelain crates', 35, { credit: 7, acceptance: 6 }],
   ['Collect crisp export ceramic duties', 0, { gold: 90 }]
  ]],
  ['Delta of Golden Keels', 'Clear water lanes and fair toll plaques turn muddy estuaries into humming centers of grain and craft.', [
   ['Establish a permanent Delta Conservancy Board', 50, { legitimacy: 7, credit: 7 }],
   ['Celebrate the river-boat lantern festival', 30, { prestige: 8, trust: 7 }],
   ['Close the delta tariff book', 0, { stability: 4 }]
  ]]
 );

 arc4('et_econ_flax_linen', 'Economy & Trade', 'land',
  ['Bleach-Greens Along the Sunny Meadow', 'Flax farmers and linen weavers propose turning marshy river flats into broad sunlit bleach-greens for crisp white export linen.', [
   ['Drain river meadows, build sour-milk bleach vats, and fund looms', 135, { development: 1, credit: 11, tools: 16 }],
   ['Supply fine Riga flax seed and license guild linen sealers', 65, { credit: 8, trust: 8, research: 5 }],
   ['Allow weavers to stake linen sheets on common riverside turf', 0, { credit: 5, trust: 5 }]
  ]],
  ['Thieves Prowl Night Bleach-Greens', 'Valuable bleached cloth pegged across wide meadows tempts nocturnal raiders carrying sharp knives.', [
   ['Build watch-huts with mastiffs and oil lamps along meadow borders', 65, { securityMonths: 9, trust: 8 }],
   ['Form rotating parish watchmen paid out of small yardage stamps', 30, { securityMonths: 7, stability: 5 }],
   ['Order cloth rolled indoors each evening at sunset horn', 0, { stability: 4, credit: 2 }]
  ]],
  ['Fine Damask Napery Fits Royal Tables', 'Skilled weavers turn fine bleached flax into snow-white patterned table linen prized by embassies.', [
   ['Order crown banquet napery and grant royal purveyor crests', 60, { prestige: 10, credit: 7 }],
   ['Export certified white linen bolts to northern merchant halls', 35, { gold: 90, credit: 7 }],
   ['Supply crisp linen bandages freely to abbey hospitals', 0, { piety: 7, trust: 7 }]
  ]],
  ['Snow-White Meadows of Prosperity', 'Marshy flats now shine white with drying cloth, bringing steady silver into rural cottages.', [
   ['Charter a Guild of Fine Linen Bleachers', 45, { credit: 8, legitimacy: 6 }],
   ['Plant windbreak willows bordering meadows', 25, { tools: 10, trust: 5 }],
   ['Close the flax works roll', 0, { stability: 4 }]
  ]]
 );

 arc4('et_econ_debt_royal_plate', 'Economy & Trade', 'debt',
  ['Crown Silver Plate Pledged to Brokers', 'During lean months, stewards pledged ancestral gilded salt-cellars and goblets to merchant brokers; redemption date looms tomorrow.', [
   ['Raise prompt domestic tax-anticipation bonds and redeem the royal plate', 135, { prestige: 12, legitimacy: 9, credit: 9 }],
   ['Renegotiate a graceful six-month extension using customs receipts', 55, { credit: 7, stability: 5 }],
   ['Forfeit duplicate banquet chargers quietly to clear principal outright', 0, { gold: 95, credit: 4, prestige: -4 }]
  ]],
  ['Gossip Questions Crown Solvency', 'Chancery whispers mock that the sovereign sups off pewter while city merchants lock away royal silver.', [
   ['Host an open guildhall banquet displaying redeemed glittering plate', 80, { prestige: 12, credit: 9, trust: 7 }],
   ['Publish clear royal household budget trims saving thousands yearly', 35, { legitimacy: 8, credit: 8 }],
   ['Ignore shallow court rumors and focus on customs receipts', 0, { stability: 5 }]
  ]],
  ['Master Goldsmiths Inspect Ancestral Stamps', 'Returned silver vessels show every gem intact, prompting jewelers to offer low-rate bullion stabilization funds.', [
   ['Create an audited Royal Sinking Fund for emergency crown debts', 75, { credit: 11, inflation: -2, legitimacy: 7 }],
   ['Thank loyal brokers with steady saltpeter contracts', 40, { credit: 7, securityMonths: 6 }],
   ['Lock the restored plate securely inside the Tower vault', 0, { securityMonths: 7, stability: 4 }]
  ]],
  ['Dignity & Credit Both Intact', 'Prompt redemption turns near-embarrassment into proof of disciplined crown stewardship.', [
   ['Inventory all crown jewels cleanly in dual registers', 35, { legitimacy: 7, securityMonths: 6 }],
   ['Celebrate steady treasury balance', 20, { prestige: 6 }],
   ['Close the plate redemption docket', 0, { stability: 4 }]
  ]]
 );

 arc4('et_econ_quarantine_fair_port', 'Economy & Trade', 'epidemic',
  ['Fever Ship Off the Spice Jetty', 'Lookouts spot a foreign carrack trailing sick sailors just as foreign merchants crowd piers for the annual spice auction.', [
   ['Anchor the carrack off quarantine spit and keep healthy piers open', 120, { crisis: -18, credit: 8, trust: 9 }],
   ['Delay the spice auction ten days while city doctors inspect all hulls', 75, { crisis: -14, trust: 8, legitimacy: 6 }],
   ['Unload non-cloth spice chests cleanly onto barge lighters', 0, { credit: 6, crisis: -5, gold: 45 }]
  ]],
  ['Impatient Foreign Captains Threaten Sail', 'Healthy shipmasters moored outside fume at inspection delays while salted fish spoils in holds.', [
   ['Expedite brisk harbor doctor boats and open fresh ice-coolers', 70, { credit: 9, crisis: -10, acceptance: 7 }],
   ['Waive anchorage dues for ships patiently cleared by harbor physicians', 40, { credit: 7, trust: 8 }],
   ['Hold firm: public life outweighs hasty profit', 0, { legitimacy: 8, crisis: -8 }]
  ]],
  ['Sick Sailors Recovered on Fresh Oranges', 'Fresh citrus, clean water, and airy pine barracks mend the stricken crew without spreading contagion ashore.', [
   ['Stock permanent citrus and clean linen chests at harbor lazarettos', 65, { crisis: -11, food: 30, trust: 8 }],
   ['Trade medical notes with the foreign ship’s barber-surgeon', 30, { research: 8, acceptance: 6 }],
   ['Grant the recovered ship clean clearance papers', 0, { credit: 6, stability: 4 }]
  ]],
  ['Safe Harbor Without Ruin', 'Calm surgical triage shields the town while keeping lucrative spice auctions humming.', [
   ['Publish harbor triage protocols for coastal ports', 45, { research: 8, legitimacy: 7 }],
   ['Thank port physicians openly', 25, { trust: 7, prestige: 5 }],
   ['Close the port health log', 0, { stability: 4 }]
  ]]
 );

 arc4('et_econ_wine_press', 'Economy & Trade', 'trade',
  ['Sour Vintage Threatens Export Repute', 'Cold wet August rains leave hillside grapes thin and tart; greedy shippers spike casks with boiled lead-sugar to fake sweetness.', [
   ['Outlaw lead-sweetening strictly and certify honest dry vintage marks', 95, { legitimacy: 9, credit: 10, trust: 10 }],
   ['Distill thin sour wine cleanly into aged medicinal brandy spirits', 75, { credit: 9, research: 7, tools: 12 }],
   ['Let merchants market cheap table vinegar and cider openly', 0, { gold: 60, credit: 4, trust: 4 }]
  ]],
  ['Cellarmasters Reveal Copper Stills', 'Skilled distillers demonstrate goose-neck copper alembics turning tart wine into fiery clear spirit prized by surgeons and sailors.', [
   ['Patent safe copper distillery sheds with clean tax stamps', 85, { development: 1, credit: 10, research: 7 }],
   ['Supply royal naval ships cleanly with spirit rations to sweeten foul water', 45, { credit: 7, trust: 6 }],
   ['License monastery infirmary stills cleanly', 0, { piety: 7, research: 5 }]
  ]],
  ['Vineyard Workers Plant Frost-Hardy Vines', 'To prevent future sour summers, growers seek southern cuttings suited to steep stony slopes.', [
   ['Import hardy early-ripening vine cuttings for cooperative hills', 70, { food: 40, credit: 8, trust: 8 }],
   ['Share stone terrace heat-wall blueprints openly', 35, { development: 1, research: 6 }],
   ['Leave vine selection to parish growers', 0, { stability: 4 }]
  ]],
  ['Honest Cellars & Fiery Spirits', 'Banning toxic shortcuts preserves export trust while new distilleries open lively winter trade.', [
   ['Carve Wine Purity Statutes on harbor gates', 40, { legitimacy: 8, prestige: 6 }],
   ['Host an honest autumn vintage tasting', 30, { prestige: 7, trust: 6 }],
   ['Close the vintage commission', 0, { stability: 4 }]
  ]]
 );

 arc4('et_econ_market_fire', 'Economy & Trade', 'fire',
  ['Spark Hits the Wooden Cloth Market', 'Midday wind whips blacksmith sparks across canvas booth awnings, sending panicked shoppers fleeing through narrow lanes.', [
   ['Rebuild the market as vaulted brick arcades with wide cobble lanes', 160, { development: 1, crisis: -20, credit: 11 }],
   ['Fund wide timber-clear fire lanes and copper market water-pumps', 85, { crisis: -14, tools: 16, trust: 9 }],
   ['Clear charred stalls quickly and erect temporary plank booths', 0, { crisis: -7, credit: 4, stability: 4 }]
  ]],
  ['Bankrupt Peddlers Beg Booth Grace', 'Forty small ribbon, spice, and shoe sellers lost every penny of stock in the afternoon blaze.', [
   ['Advance zero-interest crown restocking loans and waive stall rents', 95, { trust: 13, credit: 9, crisis: -10 }],
   ['Organize a civic guild relief chest matched coin-for-coin by the crown', 55, { trust: 10, stability: 7 }],
   ['Hold an open charity auction at the palace courtyard', 0, { prestige: 7, trust: 7 }]
  ]],
  ['Arches Rise Bright With Stone Stalls', 'Airy brick vaulted arcades shield bolts of wool and linen neatly from rain, sun, and sparks alike.', [
   ['Install standardized iron yard-bars and brass scales on arcade pillars', 50, { credit: 9, legitimacy: 7 }],
   ['Hang night patrol lanterns down every market aisle', 35, { securityMonths: 8, trust: 6 }],
   ['Inaugurate the arcade on fair-day morning', 0, { prestige: 8, credit: 5 }]
  ]],
  ['The Great Covered Exchange', 'Reborn in brick and slate, the safer covered market draws twice the merchants of the old wooden square.', [
   ['Publish urban fire-lane rules for all chartered towns', 45, { legitimacy: 7, research: 5 }],
   ['Feast masons and market elders beneath the new vaults', 30, { trust: 8, prestige: 6 }],
   ['Close the market rebuild account', 0, { stability: 4 }]
  ]]
 );

 arc4('et_econ_tin_coin_short', 'Economy & Trade', 'inflation',
  ['Barley Tallies Replace Coin in Rural Fairs', 'So little silver reaches remote uplands that villagers barter directly in barley sacks and notched oak sticks—stalling tax collection.', [
   ['Establish quarterly upland market mint exchanges and road links', 130, { credit: 11, inflation: -3, trust: 10 }],
   ['Accept cleanly graded wool and grain at fixed crown depots for taxes', 55, { food: 65, trust: 8, credit: 6 }],
   ['Issue stamped leather and copper district tokens', 0, { credit: 5, inflation: 1, stability: 4 }]
  ]],
  ['Upland Peddlers Hoard Good Pennies', 'Whenever royal silver pennies arrive by mule, farmers bury them in hearth crocks rather than spending them locally.', [
   ['Build steady rural hardware & salt stores giving coin real daily use', 85, { development: 1, tools: 16, credit: 8 }],
   ['Offer slight silver rebates when taxes settle early in coin', 35, { credit: 7, gold: 45 }],
   ['Ensure peddlers carry honest copper half-pennies upward', 0, { trust: 6, credit: 4 }]
  ]],
  ['Mountain Wool & Cheese Flow Downhill', 'With steady change and honest roadside depots, mountain cheeses and wool socks reach capital markets swiftly.', [
   ['Maintain winter snow-posts along mountain market tracks', 60, { development: 1, food: 40, trust: 7 }],
   ['Reward loyal upland bailiffs cleanly', 25, { loyalty: 6, trust: 6 }],
   ['Collect crisp silver hearth assessments', 0, { gold: 75 }]
  ]],
  ['One Coin Across Valley & Peak', 'Connected mountain fairs join the realm’s wider commercial pulse without hardship.', [
   ['Archive mountain customs & currency registers', 35, { legitimacy: 6, credit: 6 }],
   ['Praise upland parish stewards', 20, { trust: 6 }],
   ['Close the upland currency project', 0, { stability: 4 }]
  ]]
 );

 arc4('et_econ_spice_quarrel', 'Economy & Trade', 'lowtrust',
  ['Adulterated Saffron & Pepper Dust', 'Foreign buyers threaten boycotts after discovering crimson safflower petals and ground nutshells mixed into certified export sacks.', [
   ['Create sworn Royal Spice Garblers to sieve and seal export bales', 105, { credit: 12, trust: 11, legitimacy: 8 }],
   ['Try fraudulent spice packers openly and smash false sieves', 40, { legitimacy: 9, securityMonths: 7, trust: 7 }],
   ['Require packer guild marks burned onto every wooden chest', 0, { credit: 6, legitimacy: 5 }]
  ]],
  ['Garblers Uncover Dockside Warehouse', 'Armed with fine brass sieves, newly sworn spice garblers uncover sacks already salted with floor-sweepings.', [
   ['Burn adulterated floor-sweepings publicly and fine owners heavily', 35, { gold: 80, trust: 10, prestige: 7 }],
   ['Sieve out clean whole peppercorns and sell graded seconds honestly', 25, { credit: 7, food: 25 }],
   ['Seal the shady warehouse pending full guild audit', 0, { securityMonths: 8, legitimacy: 5 }]
  ]],
  ['Clean Crown-Garbled Seals Shine', 'Overseas factors gladly pay fifteen percent premiums for royal-garbled chests sealed intact.', [
   ['Extend garbling inspections cleanly to wax, flax, and dried fruit', 60, { credit: 10, trust: 8 }],
   ['Pay garblers strictly by salary rather than confiscation share', 45, { legitimacy: 8, securityMonths: 7 }],
   ['Print bilingual purity certificates inside export crates', 0, { acceptance: 7, credit: 6 }]
  ]],
  ['Gold-Standard Export Purity', 'A single honest seal restores foreign buyers’ confidence overnight and lifts prices across port markets.', [
   ['Charter permanent Guild of Spice Garblers', 45, { credit: 8, prestige: 6 }],
   ['Reward sharp-eyed inspectors', 25, { trust: 6 }],
   ['Close the spice purity commission', 0, { stability: 4 }]
  ]]
 );

 arc4('et_econ_grain_windmill_guild', 'Economy & Trade', 'drought',
  ['Dry Streams Idle Valley Flour Wheels', 'Low summer rivers drop below wooden mill-races, forcing women to grind porridge barley slowly by stone hand-quern.', [
   ['Erect high-capacity horse-mills and hilltop wind-towers rapidly', 135, { crisis: -18, food: 75, development: 1 }],
   ['Ship pre-ground rye meal barges from wet northern estuaries', 80, { crisis: -14, food: 65, credit: 5 }],
   ['Distribute shared cast-iron hand-mills to needy hamlets', 0, { tools: 14, crisis: -7, trust: 6 }]
  ]],
  ['Horse-Mill Contractors Seek Grazing', 'Teams turning heavy mill gears round the clock demand extra meadow oats during dry pasture weeks.', [
   ['Supply oat barges and shaded stable sheds beside municipal mills', 65, { food: 45, crisis: -9, trust: 8 }],
   ['Rotate oxen and farm horses fairly by parish shift', 30, { trust: 7, stability: 5 }],
   ['Cut grain-grinding tolls to keep bread cheap', 0, { trust: 8, crisis: -5 }]
  ]],
  ['Engineers Test Tidal Sea-Mills', 'Along coastal inlets, an ingenious carpenter traps rising sea tides inside brick ponds to turn millstones cleanly twice a day.', [
   ['Fund a stone tidal mill dam serving coastal ports reliably', 110, { development: 1, research: 11, food: 65 }],
   ['Award the carpenter a royal patent and silver chain', 45, { research: 8, prestige: 8 }],
   ['Record tidal mill sketches inside treasury archives', 0, { research: 6 }]
  ]],
  ['Flour Flows Despite Dry Skies', 'Wind, horse, and tidal mills break dependence on fickle summer rain forever.', [
   ['Inspect grain depots before autumn rains', 35, { food: 40, stability: 5 }],
   ['Thank inventive millwrights publicly', 20, { prestige: 6, trust: 6 }],
   ['Close the drought milling ledger', 0, { stability: 4 }]
  ]]
 );

 arc4('et_econ_banking_notary', 'Economy & Trade', 'debt',
  ['Forged Debt Bonds Shake Merchant Court', 'Clever forgers imitate notary flourishes on parchment bonds, making honest merchants afraid to lend against land or cargo.', [
   ['Create sealed Royal Notary Registries with embossed lead seals', 115, { credit: 13, securityMonths: 10, legitimacy: 8 }],
   ['Require two public witnesses and guild registration for big loans', 50, { credit: 9, trust: 8 }],
   ['Crack down harshly on unlicensed ink-scriveners in back lanes', 0, { securityMonths: 7, legitimacy: 5 }]
  ]],
  ['Exposed Forger Hides Behind Noble Kin', 'Evidence links the cleverest counterfeit bonds to a debt-ridden younger cousin of a prominent court house.', [
   ['Try the culprit cleanly under equal commercial law regardless of crest', 55, { legitimacy: 11, credit: 10, loyalty: -3 }],
   ['Compel his house quietly to make honest merchants whole plus exile', 40, { credit: 8, loyalty: 6, trust: 7 }],
   ['Hold private council hearing to settle victims cleanly', 0, { stability: 6, credit: 5 }]
  ]],
  ['Public Registry Speeds Honest Mortgages', 'Once buyers can verify clear land titles at one desk, credit loosens swiftly for farm drainage and ship repairs.', [
   ['Open clean provincial notary desks in market towns', 75, { development: 1, credit: 10, legitimacy: 7 }],
   ['Keep registry copy-fees low so small freeholders afford them', 30, { trust: 9, credit: 6 }],
   ['Archive old county parchment deeds inside fireproof chests', 0, { securityMonths: 7, stability: 5 }]
  ]],
  ['Parchment Worth Its Seal', 'Reliable title registries turn stagnant land wealth into active fuel for realm improvements.', [
   ['Publish uniform Notary Seal Standards', 40, { legitimacy: 8, research: 5 }],
   ['Reward diligent court notaries', 25, { prestige: 6, trust: 5 }],
   ['Close the notary inquiry', 0, { stability: 4 }]
  ]]
 );

 return out;
}
