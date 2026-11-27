/**
 * Sovereign: 1450 — Modular Content Pack: War, Logistics, Sieges & Diplomacy
 * 66 multi-stage narrative chains (264 authored stages) covering campaign logistics,
 * naval blockades, hostage exchanges, frontier fortresses, mercenary mutinies,
 * truce embassies, siege engineers, battle aftermath, and coalition talks.
 */
export function warDiplomacyEvents(E, C) {
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

 // === A. CAMPAIGN LOGISTICS & SUPPLY TRAINS ===
 arc4('wd_log_oxen', 'Military', 'army_supply',
  ['Broken Axles on the Muddy Road', 'Autumn rains have turned the baggage track into mire; forty ox-carts sit hub-deep short of the vanguard camp.', [
   ['Hire local wheelwrights and double draught oxen teams', 120, { supply: 26, morale: 6 }],
   ['Transfer powder casks to pack-mules and leave salt pork behind', 45, { supply: 14, fatigue: 5 }],
   ['Order infantry companies to haul the limbers by rope', 0, { supply: 8, fatigue: 9, morale: -5 }]
  ]],
  ['Foragers Clash at the Mill Weir', 'Half-starved outriders seize flour sacks from a riverside mill, triggering angry protests from district bailiffs.', [
   ['Reimburse the millers in silver and post provosts at the ford', 85, { supply: 14, stability: 4, morale: 4 }],
   ['Issue stamped crown tally-sticks redeemable after harvest', 25, { supply: 10, credit: 3 }],
   ['Look away so long as the vanguard bellies stay full', 0, { supply: 8, prestige: -4, morale: -2 }]
  ]],
  ['Dry Biscuit & Salted Herring Depot', 'Quartermasters locate a stone barn fit for a forward magazine midway between camp and river.', [
   ['Roof the barn with slate and garrison twenty pikemen', 75, { supply: 18, securityMonths: 5 }],
   ['Rotate wagon convoys nightly under lantern escort', 30, { supply: 12, experience: 0.04 }],
   ['Use open canvas tarpaulins until the march resumes', 0, { supply: 6, fatigue: 3 }]
  ]],
  ['Clear Roads Behind the Banner', 'With steady convoys rolling again, the column regains its stride and wagons arrive ahead of dusk.', [
   ['Reward the chief wagon-master with a silver badge', 45, { morale: 8, prestige: 5, supply: 10 }],
   ['Standardize axle gauges across all royal baggage carts', 65, { experience: 0.06, supply: 14 }],
   ['File the quartermaster tallies and press on', 0, { stability: 3, morale: 4 }]
  ]]
 );

 branch4('wd_log_winter_camp', 'Military', 'army_fatigue',
  ['Frost in the Canvas Lines', 'Early sleet coats the pike racks; wet firewood smokes inside crowded tents as coughs spread down the rows.', [
   ['Contract timber merchants for dry pine boards and wool blankets', 130, { fatigue: -22, morale: 9 }],
   ['Rotate half the regiments into nearby walled barns', 50, { fatigue: -14, stability: 3 }],
   ['Double watch fires and issue hot barley gruel only', 0, { fatigue: -6, food: -20, morale: -3 }]
  ]],
  ['Warm Hearths & Mended Boots', 'Cobblers and armorers set up dry benches beside stone hearths, restoring briskness to the morning drum.', [
   ['Supply fresh tallow and waxed leather soles for every squad', 70, { fatigue: -12, supply: 14 }],
   ['Hold dry-ground pike drills to keep blood moving', 20, { experience: 0.05, morale: 5 }],
   ['Let the veterans rest quietly through the thaw', 0, { fatigue: -8 }]
  ]],
  ['Grumbling Around Cold Braziers', 'Sodden sentries desert picket posts for village taverns, forcing sergeants to patrol in icy rain.', [
   ['Clear arrears in hot spiced wine and dry straw', 95, { fatigue: -14, morale: 7 }],
   ['Enforce strict camp roll-calls with provost marshals', 25, { securityMonths: 6, morale: -3 }],
   ['Promise double booty at the spring campaign opening', 0, { morale: 4, fatigue: 4 }]
  ]],
  ['Spring Muster Fit for the Field', 'When the snowline retreats up the hills, the regiments step onto the parade meadow hardened and whole.', [
   ['Inspect the lines personally in burnished harness', 55, { prestige: 8, morale: 8 }],
   ['Issue spare horseshoes and oiled bowstrings before march', 40, { supply: 16, experience: 0.04 }],
   ['Sound the trumpets and break winter quarters', 0, { morale: 5 }]
  ]]
 );

 arc4('wd_log_river_pontoon', 'Military', 'army',
  ['Swollen Ford Before the Vanguard', 'Melting highland snow turns a shallow stone ford into a churning brown torrent barring the supply train.', [
   ['Commission forty flat-bottomed oak punts and iron chains', 125, { supply: 18, experience: 0.06, morale: 6 }],
   ['Impress local ferry barges and lash timber gangways', 55, { supply: 12, fatigue: 4 }],
   ['Send cavalry swimming upstream to test narrow bends', 0, { experience: 0.03, fatigue: 8, morale: -4 }]
  ]],
  ['Rope Ferry Under Dusk Mist', 'Pioneers anchor hawser cables across midstream boulders while enemy scouts watch from the opposite alders.', [
   ['Post crossbows in willow blinds to cover the engineers', 65, { morale: 7, securityMonths: 5 }],
   ['Float decoy lanterns downstream to draw enemy scouts off', 25, { experience: 0.05, supply: 8 }],
   ['Cross heavy wagons silently after midnight', 0, { fatigue: 5, supply: 6 }]
  ]],
  ['Bridgehead on the Far Bank', 'Half the foot crosses before sunrise and digs a crescent trench studded with sharpened stakes.', [
   ['Bring over light falconets to command the gravel bar', 80, { morale: 9, prestige: 5 }],
   ['Hurry dried peas and powder kegs across first', 30, { supply: 18 }],
   ['Hold the timber trestles with pikes until dusk', 0, { experience: 0.04, fatigue: 4 }]
  ]],
  ['Master Pontoniers of the Crown', 'The crossing holds against probing horsemen, earning your pioneers lasting fame across the realm.', [
   ['Enlist the master bridgewrights into permanent royal pay', 75, { research: 8, experience: 0.06 }],
   ['Dismantle the boats cleanly for future river campaigns', 20, { supply: 12, stability: 3 }],
   ['March onward while the far road lies open', 0, { morale: 6 }]
  ]]
 );

 arc4('wd_log_saltpeter_convoy', 'Military', 'army_supply',
  ['Damp Barrels in the Powder Train', 'Quartermasters opening powder casks after a week of drizzle find caked saltpeter crusts useless for priming.', [
   ['Dispatch sealed copper-lined powder wagons from the arsenal', 135, { supply: 24, morale: 8 }],
   ['Set up heated drying pans under canvas with charcoal', 55, { supply: 14, fatigue: 4 }],
   ['Ration dry priming flasks solely to crack matchlockmen', 0, { supply: 6, morale: -3 }]
  ]],
  ['The Charcoal Burner’s Bargain', 'Foresters offer alder charcoal of fine grain if the army protects their kilns from bandits.', [
   ['Assign mounted escorts and buy three seasons of alder coal', 75, { supply: 16, stability: 4 }],
   ['Purchase their current sacks at fair market rate', 35, { supply: 10, credit: 3 }],
   ['Requisition half their kilns under war prerogative', 0, { supply: 12, prestige: -3 }]
  ]],
  ['Testing Corned Grain at the Butts', 'Gunners sieve fresh corned powder that snaps briskly in wet air without fouling touchholes.', [
   ['Run live salvo trials across all artillery batteries', 60, { experience: 0.07, morale: 7 }],
   ['Pack spare waterproofed leather flasks for scouts', 25, { supply: 12 }],
   ['Seal the remaining casks with tallow and pitch', 0, { stability: 3, supply: 6 }]
  ]],
  ['Thunder Stored Dry', 'Every company enters the line with crisp priming horns and reliable iron shot.', [
   ['Establish permanent county powder inspection clerks', 55, { legitimacy: 6, securityMonths: 6 }],
   ['Reward the chief artificer with gold chain and title', 40, { prestige: 7, morale: 5 }],
   ['Log the saved barrels in the ordnance roll', 0, { credit: 3, supply: 5 }]
  ]]
 );

 branch4('wd_log_horse_remounts', 'Military', 'army',
  ['Sore-Backed Chargers', 'Forced marches over flint roads have lamed a third of the heavy cavalry’s mounts.', [
   ['Buy hardy remounts from royal stud farms and county fairs', 135, { morale: 9, supply: 14, prestige: 5 }],
   ['Rest the squadrons and hire veteran farriers', 55, { fatigue: -14, morale: 5 }],
   ['Reassign unhorsed troopers to guard the baggage train', 0, { supply: 8, morale: -5 }]
  ]],
  ['Thoroughbreds in the Paddock', 'Sleek four-year-olds arrive with iron shoes, spare girths, and oat sacks piled high.', [
   ['Drill wheeling charges across the stubble fields', 65, { experience: 0.07, morale: 8 }],
   ['Issue spare saddle blankets and liniment jars', 25, { fatigue: -10, supply: 10 }],
   ['Inspect the brands and assign them by seniority', 0, { legitimacy: 4, morale: 4 }]
  ]],
  ['Empty Saddles and Bitter Riders', 'Proud men-at-arms chafe at marching beside ox-wagons while light horsemen take the glory.', [
   ['Promise first choice of captured mounts on the next raid', 45, { morale: 6, experience: 0.04 }],
   ['Pay full cavalry stipends despite lost horses', 80, { morale: 9, stability: 3 }],
   ['Remind the knights that obedience precedes rank', 0, { legitimacy: 5, morale: -4 }]
  ]],
  ['Iron Hooves Along the Ridge', 'Remounted and newly shod, the squadron patrols the flanks cleanly from dawn to dusk.', [
   ['Charter permanent royal horse-breeding pastures', 70, { credit: 5, prestige: 6, supply: 10 }],
   ['Issue brass stirrups to the finest riders', 30, { morale: 7 }],
   ['Return the troopers to full vanguard duty', 0, { experience: 0.04 }]
  ]]
 );

 arc4('wd_log_biscuit_ovens', 'Military', 'army_supply',
  ['Mold in the Hardtack Chests', 'Weevil-riddled biscuit crates force camp cooks to discard half the week’s iron rations.', [
   ['Erect mobile brick field ovens along the march road', 115, { supply: 24, food: 35, morale: 7 }],
   ['Buy fresh rye loaves and smoked cheese from nearby abbeys', 60, { supply: 16, piety: 3 }],
   ['Cut daily bread allowances until the next depot', 0, { supply: 8, morale: -6 }]
  ]],
  ['Smoke Over the Brick Kilns', 'Bakers working round the clock turn out crisp twice-baked loaves that keep dry in saddlebags.', [
   ['Pay double baker bonuses for a seven-day reserve bake', 65, { supply: 18, morale: 5 }],
   ['Guard the flour sacks with trusted sergeant pickets', 20, { securityMonths: 5, supply: 8 }],
   ['Load the warm loaves directly onto packhorses', 0, { supply: 10, fatigue: 2 }]
  ]],
  ['River Millers Offer Grist', 'Upstream millers offer stone-ground barley at steady prices if granted road toll exemptions.', [
   ['Seal toll-free grain passes for army contractors', 45, { credit: 5, supply: 14 }],
   ['Pay cash bonuses for early morning mill deliveries', 70, { supply: 20, stability: 3 }],
   ['Hold millers to standard wartime requisition rates', 0, { gold: 25, supply: 6 }]
  ]],
  ['Full Haversacks on the March', 'Troops step out singing with full bread-bags and dry cheese slung beside their flasks.', [
   ['Record the mobile oven blueprints in army manuals', 50, { research: 7, experience: 0.04 }],
   ['Feast the cooks and wagoners at camp', 25, { morale: 8 }],
   ['Keep the ovens rolling behind the main body', 0, { supply: 8 }]
  ]]
 );

 arc4('wd_log_scout_pigeons', 'Military', 'army',
  ['Cut Off From the Dispatch Road', 'Enemy light horse burns two post-inns along the ridge, blinding headquarters for four anxious days.', [
   ['Equip scouts with carrier pigeons and ciphered brass tubes', 105, { securityMonths: 9, morale: 7, experience: 0.05 }],
   ['Mount light relay riders on swift moorland ponies', 60, { supply: 12, morale: 5 }],
   ['Send duplicate letters by peasant peddlers on foot', 0, { securityMonths: 4, morale: -2 }]
  ]],
  ['Wings Above the Smoke', 'Doves drop onto wooden lofts above the royal pavilion bearing tiny parchment slips naming enemy ford crossings.', [
   ['Strike swiftly along the unguarded eastern causeway', 70, { morale: 10, experience: 0.07 }],
   ['Set ambush pickets along the enemy’s own courier track', 35, { securityMonths: 7, prestige: 5 }],
   ['Verify the report with a cautious patrol first', 0, { stability: 4, supply: 6 }]
  ]],
  ['Captured Enemy Dispatch Bag', 'Outriders bring in a leather pouch stuffed with false muster numbers intended to mislead your scouts.', [
   ['Cross-examine the prisoner gently to crack his code key', 55, { securityMonths: 8, experience: 0.05 }],
   ['Send forged counter-orders back along their road', 30, { prestige: 7, morale: 5 }],
   ['Burn the suspect papers and keep tight formation', 0, { stability: 4 }]
  ]],
  ['Eyes Across the Horizon', 'With unbroken signals between camp and capital, no flanking column can surprise the main battle.', [
   ['Found a permanent Corps of Royal Messengers', 80, { legitimacy: 7, securityMonths: 9 }],
   ['Reward the bird-keepers and outriders with silver', 35, { morale: 8, prestige: 4 }],
   ['Maintain alert night watches across the perimeter', 0, { experience: 0.04 }]
  ]]
 );

 // === B. NAVAL BLOCKADES & MARITIME WARFARE ===
 branch4('wd_nav_harbor_chain', 'Military', 'war',
  ['Iron Boom Across the Estuary', 'Enemy carracks drop anchor outside the river bar while captains debate stretching a massive iron harbor chain.', [
   ['Forge linked oak-and-iron booms flanked by shore batteries', 145, { stability: 7, morale: 8, prestige: 6 }],
   ['Sink ballast hulks in the side channel and patrol by oar', 65, { securityMonths: 8, morale: 5 }],
   ['Keep merchants anchored inside and wait out the gale', 0, { credit: -4, prestige: -2, stability: 3 }]
  ]],
  ['Gunfire Beneath the Headland', 'Two blockade sloops probe the narrows at high tide, trading broadsides with shore culverins through driving spray.', [
   ['Send fire-boats riding the ebb tide into their anchorage', 90, { morale: 10, prestige: 9, experience: 0.06 }],
   ['Concentrate red-hot shot on their lead carrack’s rigging', 45, { morale: 7, experience: 0.04 }],
   ['Hold fire until they foul the timber boom', 0, { supply: 10, stability: 4 }]
  ]],
  ['Leaking Hulls and Low Water', 'Gales batter the outer squadron, forcing merchant masters to beg for escort out through the western shoals.', [
   ['Hire local fishing pilots to guide a midnight convoy out', 75, { credit: 7, supply: 14 }],
   ['Impose strict harbor rationing until the blockade lifts', 20, { stability: 5, food: 25 }],
   ['Requisition merchant sailors to man the shore guns', 0, { morale: 4, credit: -5 }]
  ]],
  ['Open Sea Lane at Dawn', 'Broken spars drift along the shingle as the enemy squadron hauls anchor toward deeper water.', [
   ['Reward the harbor gunners and rebuild lighthouse beacons', 65, { credit: 8, prestige: 8 }],
   ['Exchange captured sailors cleanly under cartel flag', 25, { relation: 9, prestige: 4 }],
   ['Clear the boom and reopen customs wharves', 0, { gold: 70, stability: 4 }]
  ]]
 );

 arc4('wd_nav_privateers', 'Diplomacy', 'crossroads_oceanic',
  ['Letters of Marque on the Narrow Sea', 'Daring captains offer to fit out fast caravels at their own risk if granted royal seals to raid hostile shipping.', [
   ['Issue tightly bonded royal privateer patents with prize courts', 110, { credit: 8, gold: 80, prestige: 6 }],
   ['Hire the swiftest hulls directly into the crown squadron', 140, { prestige: 10, securityMonths: 8, research: 6 }],
   ['Forbid privateering lest neutral convoys suffer', 0, { trust: 8, acceptance: 5, credit: 3 }]
  ]],
  ['Disputed Prize in Neutral Port', 'A privateer drags in a richly laden spice hulk flying a friendly flag, sparking loud protests from foreign factors.', [
   ['Restitute neutral cargo promptly through admiralty judges', 75, { trust: 9, credit: 7, legitimacy: 6 }],
   ['Split the disputed bales into escrow while lawyers argue', 30, { gold: 45, stability: 3 }],
   ['Award the cargo to the captain and brave foreign anger', 0, { gold: 120, credit: -6, unrest: 3 }]
  ]],
  ['Sea-Beggars Along the Shoals', 'Rival corsairs retaliate by snapping up salt-fishers off coastal villages, driving mariners into town halls.', [
   ['Escort coastal fleets with armed galley-foists', 95, { trust: 8, development: 1, securityMonths: 6 }],
   ['Offer bounties for every corsair pennant brought ashore', 50, { prestige: 7, credit: 4 }],
   ['Order coastal villages to haul boats above the tide line', 0, { unrest: 3, food: -20, stability: 3 }]
  ]],
  ['Law of the Sea & Admiralty Seal', 'Published prize ordinances curb rogue captains and restore orderly insurance rates along coastal quays.', [
   ['Codify admiralty courts and sea-lane charts permanently', 80, { research: 9, credit: 9, legitimacy: 7 }],
   ['Pension wounded mariners from prize-court tenths', 45, { trust: 9, prestige: 5 }],
   ['Close the seasonal cruise with balanced ledgers', 0, { gold: 65, stability: 4 }]
  ]]
 );

 arc4('wd_nav_galley_arsenal', 'Economy & Trade', 'cont_europe',
  ['Dry-Rot in the Galley Sheds', 'Master shipwrights tap pine ribs along the slipways and discover green timber rotting in twelve war-galleys.', [
   ['Import seasoned oak knees and Stockholm pitch immediately', 135, { development: 1, credit: 7, prestige: 8 }],
   ['Strip half the hulks to refit six seaworthy patrol craft', 55, { tools: 15, stability: 4 }],
   ['Caulk the seams hastily with hemp and tallow', 0, { gold: 30, unrest: 3 }]
  ]],
  ['Oarsmen Strike at the Rope-Walk', 'Rigging weavers and oarsmen lay down mallets over debased coin and unpaid biscuit tallies.', [
   ['Pay full silver arrears and establish a dockyard guild chest', 95, { trust: 10, unrest: -6, credit: 5 }],
   ['Offer generous salt-fish rations and winter firewood', 45, { food: -25, loyalty: 6, trust: 5 }],
   ['March harbor guards down the quay to break the picket', 0, { stability: 4, unrest: 6, loyalty: -5 }]
  ]],
  ['The New Rudder Design', 'An immigrant shipwright sketches a pintle-and-gudgeon sternpost rudder with steep triangular lateen sails.', [
   ['Fund a full-scale prototype caravel on Slipway Three', 105, { research: 12, prestige: 8, development: 1 }],
   ['Adopt the iron rudder pintles on coastal barges only', 45, { tools: 12, research: 5 }],
   ['Stick to proven Mediterranean oars and steering sweeps', 0, { stability: 4, credit: 2 }]
  ]],
  ['Banners Launched on High Tide', 'Freshly tarred hulls glide down greased skids to cheering dockside crowds.', [
   ['Charter a royal Guild of Shipwrights and Caulkers', 75, { development: 1, credit: 8, legitimacy: 6 }],
   ['Bless the prows in solemn waterfront procession', 30, { piety: 7, prestige: 6 }],
   ['Assign the new vessels to harbor customs patrols', 0, { gold: 65, securityMonths: 6 }]
  ]]
 );

 arc4('wd_nav_island_blockade', 'Military', 'war',
  ['Starving Out the Island Keep', 'Friendly sloops circle a rocky offshore fortress whose defenders signal desperately across moonlight ripples.', [
   ['Tighten the ring with chained row-barges and mortar skiffs', 120, { morale: 8, prestige: 7, experience: 0.06 }],
   ['Offer honorable boat-evacuation if the garrison lowers its flag', 45, { relation: 10, stability: 5 }],
   ['Wait silently for brackish cisterns to break their nerve', 0, { fatigue: 4, supply: 6, stability: 3 }]
  ]],
  ['Night Skiffs Through the Fog', 'Fishermen slipped past the outer sloops carrying salted mutton and fresh flintlock horns.', [
   ['Hang harbor chains across the kelp reefs at dusk', 70, { securityMonths: 8, morale: 6 }],
   ['Bribe island fishermen to turn their skiffs back', 50, { gold: -10, stability: 4, prestige: 3 }],
   ['Double lantern patrols along the northern lee', 0, { fatigue: 5, experience: 0.04 }]
  ]],
  ['White Cloth on the Sea-Wall', 'Half-starved defenders lower a white shirt from the lighthouse tower as surf booms below.', [
   ['Allow officers sidearms and march the garrison out cleanly', 60, { prestige: 10, relation: 8, legitimacy: 5 }],
   ['Demand unconditional surrender and confiscate all brass guns', 25, { supply: 18, morale: 7 }],
   ['Accept quick terms to release ships before autumn squalls', 0, { stability: 6, supply: 10 }]
  ]],
  ['Watchtower Over the Narrows', 'With the island lighthouse flying your colors, coastal shipping passes untouched beneath the cliffs.', [
   ['Install a permanent revolving lantern and customs post', 75, { credit: 8, prestige: 7, securityMonths: 6 }],
   ['Repair the shattered cisterns for the new garrison', 40, { supply: 16, stability: 4 }],
   ['Sail the main squadron back to home moorings', 0, { fatigue: -10, morale: 5 }]
  ]]
 );

 branch4('wd_nav_monsoon_fleet', 'Economy & Trade', 'cont_asia',
  ['Stalled Junks Before the Strait', 'Armed patrol proas blockade the strait approaches, stranding spice fleets waiting for the seasonal wind shift.', [
   ['Assemble a royal escort fleet with swivel-guns and charts', 135, { credit: 11, prestige: 9, development: 1 }],
   ['Negotiate safe-conduct dues with strait harbor chiefs', 65, { credit: 7, acceptance: 7 }],
   ['Divert high-value silk cargoes onto overland pack-trails', 0, { gold: 45, credit: 3, unrest: 2 }]
  ]],
  ['Swivel-Guns Clear the Shoals', 'Thunderous bronze lantakas scatter the blockading proas into mangrove channels before midday.', [
   ['Burn their hidden timber stockades along the mudflats', 75, { securityMonths: 8, prestige: 8 }],
   ['Offer amnesty to local pilots who mark safe sandbars', 35, { trust: 8, acceptance: 6 }],
   ['Escort the spice fleet briskly past the headland', 0, { credit: 8, gold: 55 }]
  ]],
  ['Portage Across the Isthmus', 'Porters haul pepper bales over limestone ridges while merchants grumble at rising coolie wages.', [
   ['Build paved rest-sheds and cisterns along the portage path', 85, { development: 1, trust: 8, food: 35 }],
   ['Cut port customs fees to offset caravan expenses', 35, { credit: 7, loyalty: 5 }],
   ['Leave merchants to bargain their own pack-rates', 0, { gold: 50, unrest: 3 }]
  ]],
  ['The Monsoon Convoy Drops Anchor', 'Laden junks and dhows crowd the home basin, flooding warehouses with cloves, camphor, and porcelain.', [
   ['Charter a Guild of Strait Pilots with royal pennants', 70, { credit: 10, research: 7, prestige: 6 }],
   ['Collect orderly harbor tenths and feast the captains', 25, { gold: 105, trust: 5 }],
   ['Store surplus grain from returning rice barges', 0, { food: 75, grain: 14 }]
  ]]
 );

 // === C. HOSTAGE EXCHANGES & NOBLE RANSOMS ===
 arc4('wd_hos_marshal_son', 'Diplomacy', 'war',
  ['A Captured Heir in the Tent', 'After a sharp skirmish at dusk, scouts bring in the enemy commander’s nineteen-year-old son, bruised but unbowed.', [
   ['Lodge him honorably in silk quarters and send word to his kin', 80, { prestige: 10, relation: 12, legitimacy: 5 }],
   ['Hold him under strict iron guard as leverage for frontier forts', 30, { securityMonths: 7, morale: 5 }],
   ['Demand an immediate silver ransom before winter', 0, { gold: 125, relation: -6 }]
  ]],
  ['Letters Under White Truce', 'An elderly herald arrives bearing sealed letters from the youth’s mother alongside a chest of stamped coin.', [
   ['Exchange him freely for twenty captive royal yeomen', 50, { morale: 9, relation: 14, stability: 6 }],
   ['Accept half-ransom plus a pledge of castle neutrality', 20, { gold: 75, stability: 6 }],
   ['Keep the young lord until the formal peace treaty', 0, { securityMonths: 6, relation: -5 }]
  ]],
  ['Sword-Brother Across the Lines', 'Having dined beside your officers, the young noble begs leave to carry an honest truce proposal home.', [
   ['Entrust him with fair boundary terms sealed in red wax', 45, { relation: 12, prestige: 8 }],
   ['Require two sworn sureties from his house before departure', 20, { legitimacy: 6, securityMonths: 5 }],
   ['Dismiss the proposal and return him under escort', 0, { relation: 4, morale: 4 }]
  ]],
  ['Honor Remembered Beyond Battle', 'Even across divided banners, bards praise the courtly restraint shown inside your camp.', [
   ['Host a solemn frontier prisoner-exchange at the river stone', 60, { prestige: 10, relation: 10, stability: 5 }],
   ['Release remaining sick captives with travel loaves', 25, { piety: 8, morale: 5 }],
   ['Close the exchange rolls cleanly', 0, { legitimacy: 5 }]
  ]]
 );

 branch4('wd_hos_royal_ward', 'Diplomacy', 'hostile',
  ['Pledge of the Border Lords', 'To guarantee an uneasy border armistice, a rival prince offers two highborn youths as court hostages for three years.', [
   ['Welcome them to the royal schoolroom with tutors and hawks', 110, { relation: 14, prestige: 8, legitimacy: 6 }],
   ['Keep them discreetly inside a fortified river abbey', 45, { securityMonths: 9, piety: 5 }],
   ['Refuse hostages and insist on demolished border earthworks', 0, { legitimacy: 7, relation: -6 }]
  ]],
  ['Scholars and Falcons', 'The youths quickly outshine local pages in rhetoric and horsemanship, forging quiet ties with your court.', [
   ['Send warm portrait miniatures and Latin primers to their parents', 55, { relation: 12, prestige: 6 }],
   ['Invite their kinsmen to hunt together in autumn', 35, { relation: 8, stability: 4 }],
   ['Maintain polite distance befitting state pledges', 0, { securityMonths: 5 }]
  ]],
  ['Rumors of Escape in the Mist', 'Abbey gates stand unbarred after vespers; guards claim passing pilgrims nearly slipped notes to the youths.', [
   ['Clarify terms calmly with the rival court without shaming the boys', 50, { relation: 8, stability: 5 }],
   ['Tighten tower watches and inspect every basket of fruit', 25, { securityMonths: 8, relation: -4 }],
   ['Threaten immediate forfeiture of border villages', 0, { prestige: 5, relation: -9 }]
  ]],
  ['Return Under Silver Pennants', 'When the three-year term closes, the youths ride home fluent in your court’s tongue and law.', [
   ['Gift them matched chargers and illuminated law codices', 70, { relation: 14, prestige: 9 }],
   ['Renew the border peace for seven more winters', 30, { stability: 8, relation: 8 }],
   ['Conduct the farewell cleanly at the border cairn', 0, { legitimacy: 5 }]
  ]]
 );

 arc4('wd_hos_pirate_captives', 'Diplomacy', 'neighbor',
  ['Fishermen Dragged Into Foreign Irons', 'Corsairs based out of a neighbor’s cove seize twelve coastal fishing smacks, chaining crews in harbor cellars.', [
   ['Send a royal ransom galley with silver and stern protest', 125, { relation: 8, prestige: 8, stability: 5 }],
   ['Arrest matching foreign factors in port until crews return', 35, { securityMonths: 7, relation: -6 }],
   ['Appeal calmly to the neighboring sovereign’s admiralty court', 0, { relation: 5, legitimacy: 4 }]
  ]],
  ['The Admiralty Hearing', 'Foreign magistrates admit local port wardens took bribes to look away while corsairs fitted out.', [
   ['Co-fund joint sea patrols to sweep the narrow straits', 90, { relation: 12, credit: 6, securityMonths: 6 }],
   ['Demand public punishment of the corrupt wardens', 25, { legitimacy: 7, prestige: 5 }],
   ['Accept partial silver restitution for the widows', 0, { gold: 75, relation: 4 }]
  ]],
  ['Chains Struck Off at the Quay', 'Sunburnt fishermen step onto home cobbles amid weeping kin and ringing parish bells.', [
   ['Grant boat-building timber from royal forests to rebuild smacks', 75, { food: 45, prestige: 7, stability: 5 }],
   ['Host a thanksgiving service at the harbor chapel', 25, { piety: 8, stability: 4 }],
   ['Record their testimony for the sea-treaty archive', 0, { legitimacy: 5 }]
  ]],
  ['Signed Sea-Peace Treaty', 'Both courts nail brass harbor ordinances to customs pillars guaranteeing safe refuge during storms.', [
   ['Seal reciprocal anti-piracy warrants across all ports', 55, { relation: 12, credit: 7 }],
   ['Establish a shared lighthouse fund on the outer reef', 45, { prestige: 7, stability: 5 }],
   ['Dismiss the envoys with honors', 0, { relation: 5 }]
  ]]
 );

 arc4('wd_hos_ransom_broker', 'Diplomacy', 'friendly',
  ['The Ransom Broker’s Ledger', 'An aged Jewish-Genoese factor arrives carrying lists of sixty captive soldiers languishing across regional dungeons.', [
   ['Advance full crown ransom purses to bring veterans home', 140, { prestige: 12, stability: 8, relation: 9 }],
   ['Co-sign bills of credit with merchant guilds to share the cost', 65, { credit: 8, prestige: 7, relation: 6 }],
   ['Ransom only noble officers and skilled gunners first', 0, { gold: -10, legitimacy: -3, relation: 3 }]
  ]],
  ['Caravans of the Redeemed', 'Wagons carrying freed veterans rattle over the border bridge as bells ring in market towns.', [
   ['Settle wounded soldiers on tax-free crown wasteland plots', 75, { food: 40, stability: 8, legitimacy: 6 }],
   ['Hold a modest muster and back-pay settlement', 45, { prestige: 7, stability: 4 }],
   ['Return men cleanly to their home parishes', 0, { stability: 5 }]
  ]],
  ['Gratitude of Neighboring Houses', 'Because the broker freed foreign captives alongside yours, allied nobles write warm letters of thanks.', [
   ['Grant the broker a permanent royal safe-conduct seal', 40, { credit: 7, relation: 10 }],
   ['Commission a joint border memorial chapel', 55, { piety: 8, relation: 8 }],
   ['Archive the signed release parchments', 0, { legitimacy: 5 }]
  ]],
  ['A Custom of Mercy', 'Your realm’s fair ransom scales become the benchmark across regional campaigns.', [
   ['Publish a formal Code of Captive Treatment', 50, { prestige: 9, legitimacy: 7 }],
   ['Thank allied lords for reciprocal clemency', 20, { relation: 8 }],
   ['Close the commission accounts', 0, { credit: 4 }]
  ]]
 );

 // === D. FRONTIER FORTRESSES & MARCHER WARDENS ===
 arc4('wd_fort_star_bastion', 'Military', 'crossroads_gunpowder',
  ['Cracks in the Square Keep', 'Artillery trials expose how tall medieval corners shatter under iron balls; engineers urge sloped earth-backed bastions.', [
   ['Excavate deep ditch glacis and brick angle-bastions', 165, { development: 1, securityMonths: 10, prestige: 9 }],
   ['Pack thick timber-and-earth bulwarks behind existing walls', 75, { stability: 6, tools: 15, securityMonths: 7 }],
   ['Patch the mortar cracks with river lime and wait', 0, { stability: 3, unrest: 2 }]
  ]],
  ['Strike at the Quarry Face', 'Stonemasons protest double winter shifts on wet scaffolding while border lords grumble at cartage corvee.', [
   ['Pay bonus silver wages and issue hot mutton stew', 90, { trust: 9, stability: 6, development: 1 }],
   ['Rotate village labor teams weekly by parish lot', 35, { trust: 5, unrest: -4 }],
   ['Invoke emergency frontier fortification writ', 0, { legitimacy: 5, unrest: 5, trust: -3 }]
  ]],
  ['Casemates & Flanking Fire', 'Gunners roll brass sakers into vaulted brick casemates capable of sweeping every yard of the ditch.', [
   ['Stock dry biscuit and 200 powder barrels inside the vaults', 80, { securityMonths: 9, grain: 18 }],
   ['Train local burgher militia on the new rampart guns', 40, { trust: 7, stability: 5 }],
   ['Mount timber shutters and lock the magazine keys', 0, { securityMonths: 5 }]
  ]],
  ['Bastion of the March', 'Visiting foreign envoys eye the low jagged trace-italienne angles in sober silence.', [
   ['Print engraved fortification surveys for provincial governors', 65, { research: 10, prestige: 8 }],
   ['Hold a formal dedication with border captains', 30, { prestige: 7, legitimacy: 6 }],
   ['Turn over the keys to the marcher warden', 0, { stability: 5 }]
  ]]
 );

 branch4('wd_fort_marcher_warden', 'Politics', 'disloyal',
  ['The Warden’s Private Tolls', 'The frontier marcher lord collects unauthorized cattle duties from passing drovers to pay his own castle guard.', [
   ['Audit his garrison rolls and replace private tolls with crown pay', 120, { loyalty: 9, trust: 9, legitimacy: 7 }],
   ['Summon him to council to negotiate bounded frontier dues', 55, { loyalty: 7, stability: 4, credit: 4 }],
   ['Order him immediately to tear down the toll-gates by writ', 0, { legitimacy: 6, loyalty: -8, unrest: 4 }]
  ]],
  ['Loyal Banner on the Pass', 'Relieved of desperate arrears, the warden clears bandit nests from the limestone defiles and swears open fealty.', [
   ['Invest him with the silver spurs of Border Marshal', 60, { loyalty: 10, prestige: 8 }],
   ['Fix paved milestones and royal toll plaques at the gate', 40, { development: 1, credit: 6 }],
   ['Thank him and confirm his charter for ten years', 0, { legitimacy: 5, loyalty: 5 }]
  ]],
  ['Locked Portcullis at Dusk', 'Proud kinsmen slam the oak bridge shut before royal bailiffs, muttering that soft palace clerks starve border men.', [
   ['Send respected elder peers to broker an honorable settlement', 85, { loyalty: 10, stability: 6 }],
   ['Divert merchant convoys onto a lower valley road to starve his gate', 25, { leverage: 15, credit: 4 }],
   ['Threaten confiscation of his lowland manors at next court', 0, { legitimacy: 7, loyalty: -6, unrest: 3 }]
  ]],
  ['Order Along the Frontier March', 'With clear boundary stones and salaried watchtowers, caravans pass freely beneath royal banners.', [
   ['Establish quarterly circuit audits of all border keeps', 55, { securityMonths: 8, legitimacy: 6 }],
   ['Repair the pass watch-beacons cleanly', 30, { stability: 5, trust: 5 }],
   ['Close the marcher commission', 0, { loyalty: 4 }]
  ]]
 );

 arc4('wd_fort_beacon_chain', 'Politics', 'land',
  ['Cold Ashes on the Ridge', 'Inspectors riding frontier ridges find half the pitch-beacon towers unguarded and wet brushwood stacked beside them.', [
   ['Build stone beacon cressets with salaried watchmen', 110, { securityMonths: 10, trust: 8, stability: 5 }],
   ['Assign parish rotation watches rewarded with salt exemptions', 45, { trust: 6, unrest: -4 }],
   ['Fine negligent villages and demand dry faggots', 0, { gold: 45, unrest: 5 }]
  ]],
  ['False Alarm in the Fog', 'A nervous lookout lights coastal pitch pots after mistaking fishing torches for raider sails, panicking three valleys.', [
   ['Establish two-beacon confirmation codes and horn signals', 60, { securityMonths: 8, stability: 6 }],
   ['Calm frightened villagers with grain doles and clear drills', 40, { food: -20, trust: 8 }],
   ['Discipline the lookout publicly at the crossroad', 0, { legitimacy: 4, trust: -4 }]
  ]],
  ['Swift Relay to the Capital', 'During a test drill at twilight, fire leaps twenty leagues across five ridges in less than two hours.', [
   ['Pair the beacon chain with fresh relay horse-posts', 75, { securityMonths: 9, development: 1 }],
   ['Publish beacon drill pamphlets for county sheriffs', 30, { research: 5, legitimacy: 5 }],
   ['Record the relay timing in royal registers', 0, { stability: 4 }]
  ]],
  ['Watchful Ridges', 'Border folk sleep sounder knowing warning light travels faster than any raiding squadron.', [
   ['Exempt beacon wardens from ordinary road corvee', 35, { trust: 8, loyalty: 5 }],
   ['Stock spare iron grates and tar barrels for winter', 45, { tools: 12, securityMonths: 5 }],
   ['Keep quarterly inspection rides running', 0, { stability: 4 }]
  ]]
 );

 arc4('wd_fort_river_lock_keep', 'Politics', 'vassal',
  ['Toll-Chain Across the River Gate', 'A noble castellan stretches a heavy chain beneath his river keep, delaying grain barges until skippers pay double anchorage.', [
   ['Buy out his hereditary toll charter for the crown treasury', 135, { credit: 10, trust: 9, loyalty: 7 }],
   ['Fix an official brass tariff plaque witnessed by burghers', 55, { legitimacy: 7, credit: 5, loyalty: 4 }],
   ['Send royal bailiffs to cut the chain at high water', 0, { trust: 7, loyalty: -9, prestige: 4 }]
  ]],
  ['Skippers Rally at the Guildhall', 'River captains bring out old parchment charters exempting royal corn barges from castle chains.', [
   ['Confirm guild immunities and repair the stone towpath', 70, { development: 1, trust: 9, grain: 14 }],
   ['Compromise on modest bridge-upkeep pennies per keel', 25, { credit: 6, loyalty: 5 }],
   ['Leave the dispute to county assizes next quarter', 0, { unrest: 3, stability: 2 }]
  ]],
  ['Floodwaters Test the Pier', 'Spring ice jams against the castle pier, threatening both the noble’s bridge and the guild’s grain boats.', [
   ['Send royal engineers with iron ice-breakers to save both', 85, { development: 1, loyalty: 9, trust: 8 }],
   ['Hire local boatmen to pole clear the drifting floes', 35, { trust: 6, food: 25 }],
   ['Order the castellan to clear his own bridge pilings', 0, { loyalty: -4, stability: 3 }]
  ]],
  ['Smooth Waters Past the Keep', 'Barges glide steadily downstream while the reconciled castellan watches over safe river trade.', [
   ['Grant the noble a royal customs share in exchange for patrols', 55, { loyalty: 8, securityMonths: 7 }],
   ['Dredge the shallow shoal below the bridge', 45, { credit: 7, development: 1 }],
   ['Log the new river statute', 0, { legitimacy: 5 }]
  ]]
 );

 // === E. MERCENARY MUTINIES & FREE COMPANIES ===
 branch4('wd_merc_arrears', 'Military', 'army',
  ['Pikes Grounded Outside the Pay-Tent', 'Swiss and German pikemen slam halberd butts into the turf, refusing to form column until three months’ silver arrears are counted.', [
   ['Raise immediate bullion from camp chests and settle every penny', 150, { morale: 12, stability: 6, prestige: 6 }],
   ['Pay one month now and pledge crown plate as bond for the rest', 65, { morale: 6, credit: -3, legitimacy: 4 }],
   ['Surround the mutinous squares with loyal native horse', 0, { morale: -6, experience: 0.04, stability: -4 }]
  ]],
  ['Drums Beat for the Crown', 'Silver clinks onto oak tables; veteran pikemen lift their caps and fall cleanly back into brisk column.', [
   ['Inspect their pike-tips and promote steady captains', 60, { experience: 0.07, morale: 8 }],
   ['Pair the mercenaries with native handgunners in joint drill', 40, { morale: 6, supply: 12 }],
   ['Assign them the vanguard road immediately', 0, { morale: 4, fatigue: 4 }]
  ]],
  ['Stand-Off by Torchlight', 'Sullen captains barter openly with camp sutlers, threatening to march off toward rival paymasters by dawn.', [
   ['Arrest only the two loudest ringleaders and pay the rank-and-file', 95, { morale: 8, securityMonths: 7 }],
   ['Grant them safe-conduct out of the realm before they loot villages', 30, { stability: 5, morale: -4 }],
   ['Cut their camp rations until they surrender their standards', 0, { morale: -8, supply: 10 }]
  ]],
  ['Contracts Written in Ink and Steel', 'Clear muster rolls and sealed biweekly pay chests prevent future camp tumults.', [
   ['Create a dedicated War Paymaster Office with sealed ledgers', 75, { credit: 6, legitimacy: 7, morale: 6 }],
   ['Reward loyal native sergeants who kept camp discipline', 35, { morale: 9, prestige: 5 }],
   ['Close the campaign pay inquiry', 0, { stability: 4 }]
  ]]
 );

 arc4('wd_merc_free_company', 'Military', 'unrest',
  ['The Unemployed Free Company', 'Disbanded foreign lancers roam river villages, demanding "bread money" from terrified bailiffs.', [
   ['Hire the disciplined banners onto frontier patrol wages', 125, { unrest: -10, securityMonths: 8, stability: 6 }],
   ['Buy off their captains with silver travel passes to the border', 75, { unrest: -7, trust: 6 }],
   ['Call out county shire levies to hunt them down', 0, { unrest: 4, legitimacy: 6, prestige: 5 }]
  ]],
  ['Barn Fires on the Heath', 'Stragglers from the company torch two tithe barns after peasants barricade the bridge.', [
   ['Dispatch fast cavalry provosts to corner them at the abbey ford', 85, { securityMonths: 9, trust: 8, unrest: -6 }],
   ['Compensate burned villagers with royal seed grain', 60, { food: -25, trust: 10, unrest: -5 }],
   ['Proclaim free pardon for riders who turn in their captains', 0, { stability: 5, legitimacy: 4 }]
  ]],
  ['Trial Beneath the Market Cross', 'Captured freebooters stand shackled before royal circuit judges while crowds pack the square.', [
   ['Execute notorious captains and press able horsemen into frontier service', 45, { legitimacy: 8, securityMonths: 7 }],
   ['Sentence them to rebuild the burned bridges under guard', 30, { development: 1, trust: 7 }],
   ['Expel the survivors under oath never to cross the river again', 0, { stability: 5, unrest: -4 }]
  ]],
  ['Quiet Lanes in the Shire', 'With roads cleared and burned granaries re-roofed, market carts roll freely at sunrise.', [
   ['Establish mounted shire road-watches permanently', 70, { securityMonths: 8, credit: 5, trust: 6 }],
   ['Audit muster clerks to prevent sudden unguided disbandments', 35, { legitimacy: 6, stability: 4 }],
   ['Return the provosts to garrison', 0, { stability: 3 }]
  ]]
 );

 arc4('wd_merc_condottiere_oath', 'Military', 'debt',
  ['A Condottiere Bargains for Castle Pledge', 'An ambitious mercenary captain demands a mortgaged border town as collateral for his company’s winter wages.', [
   ['Refuse town pledges and settle wages via merchant bills of exchange', 115, { credit: 8, legitimacy: 8, stability: 5 }],
   ['Grant customs revenue shares only, retaining royal castle keys', 55, { credit: 5, securityMonths: 6 }],
   ['Sign the temporary castle pledge to keep his lances in the field', 0, { gold: 45, legitimacy: -6, stability: 3 }]
  ]],
  ['Gossip of Secret Letters', 'Camp scouts intercept polite ciphered verses exchanged between the condottiere and an enemy duke.', [
   ['Confront him privately with proof and raise loyal guards nearby', 65, { securityMonths: 9, stability: 5 }],
   ['Offer a handsome victory bonus tied strictly to battle banners', 90, { prestige: 7, loyalty: 6 }],
   ['Keep quiet watch on his pavilion gates', 0, { securityMonths: 5, prestige: -2 }]
  ]],
  ['The Skirmish Test', 'Ordered to storm a contested stone bridge, the condottiere hesitates, preserving his costly armored chargers.', [
   ['Lead royal household horse beside them to force the charge', 70, { prestige: 10, legitimacy: 6 }],
   ['Pay per-banner assault bounties on the bridgehead itself', 85, { prestige: 7, stability: 4 }],
   ['Dismiss his company cleanly at sundown without bonus', 0, { legitimacy: 7, credit: 3 }]
  ]],
  ['Native Yeomen & Crown Standards', 'The episode persuades councilors to invest steadily in homegrown trained bands rather than fickle hirelings.', [
   ['Endow parish target grounds and armor chests for native militias', 95, { development: 1, trust: 8, legitimacy: 7 }],
   ['Retain only trusted artillery specialists on fixed retainer', 45, { research: 7, securityMonths: 6 }],
   ['Archive the ended mercenary contract', 0, { stability: 4 }]
  ]]
 );

 arc4('wd_merc_artillery_guild', 'Military', 'army_fatigue',
  ['Founders Refuse Night Bombardment', 'Master gunners from abroad threaten to spike their own brass pieces unless paid traditional "breach-wall" hazard gold.', [
   ['Honor customary breach bounties and double powder rations', 120, { morale: 10, supply: 14, prestige: 6 }],
   ['Train native sappers directly at the carriages to replace them', 65, { experience: 0.08, morale: 5 }],
   ['Arrest the spokesman and order captains to sight the guns', 0, { morale: -5, legitimacy: 5, fatigue: 4 }]
  ]],
  ['Cracked Trunnion on the Culverin', 'A heavy piece overheats and splits its carriage axle mid-salvo, pinning two gunners underneath.', [
   ['Dispatch royal surgeons and spare oak carriages immediately', 75, { morale: 8, fatigue: -10, supply: 10 }],
   ['Lash the barrel to a timber sled to keep firing', 25, { experience: 0.05, fatigue: 5 }],
   ['Cool the pieces and rest the crews until twilight', 0, { fatigue: -6, morale: 3 }]
  ]],
  ['Salvo in the Grey Dawn', 'Steadied crews align four guns simultaneously, punching clean rubble gaps through the outer parapet.', [
   ['Press the assault with fresh storming ladders', 65, { morale: 10, experience: 0.07 }],
   ['Keep pounding flanking towers to save infantry lives', 35, { supply: 8, fatigue: -6 }],
   ['Demand parley before ordering the storm', 0, { prestige: 6, stability: 4 }]
  ]],
  ['Royal College of Cannoneers', 'The siege teaches the crown never again to rely wholly on foreign artillery guilds.', [
   ['Found an indigenous royal gunnery school with pensions', 90, { research: 11, experience: 0.07, legitimacy: 6 }],
   ['Award silver gun-badges to loyal native gunners', 35, { morale: 8, prestige: 5 }],
   ['Dismantle the siege batteries cleanly', 0, { supply: 10 }]
  ]]
 );

 // === F. TRUCE EMBASSIES & BORDER COMMISSIONS ===
 branch4('wd_truce_river_island', 'Diplomacy', 'hostile',
  ['Pavilion on the Neutral Sandbar', 'Warring heralds pitch striped pavilions on a mid-river island to weigh a winter ceasefire.', [
   ['Send senior chancellors armed with wine casks and clear border maps', 120, { relation: 15, prestige: 8, stability: 6 }],
   ['Dispatch cautious jurists instructed to stall until spring', 45, { securityMonths: 7, relation: 5 }],
   ['Demand unilateral withdrawal before any chair is set', 0, { prestige: 6, relation: -7 }]
  ]],
  ['Maps Unrolled Over Mulled Wine', 'Cartographers trace river bends in red ink, finding room to trade two swampy hamlets for secure hill forts.', [
   ['Seal a five-year truce guaranteeing merchant river passage', 80, { relation: 16, credit: 8, stability: 7 }],
   ['Sign a six-month harvest armistice only', 30, { relation: 9, food: 35 }],
   ['Hold out for one additional toll bridge', 0, { prestige: 5, relation: -3 }]
  ]],
  ['Shouting Across the Charter Table', 'Envoys slam wooden tallies over burned border mills, threatening to row back to opposing banks.', [
   ['Offer mutual church reconstruction gifts to cool tempers', 85, { relation: 12, piety: 7, stability: 5 }],
   ['Propose neutral arbitration by an honored neighboring prelate', 35, { relation: 8, legitimacy: 5 }],
   ['Break off talks proudly and alert the river watches', 0, { prestige: 7, relation: -8 }]
  ]],
  ['Boundary Stones Set in Frost', 'Masons sink carved limestone markers along the agreed watershed as farmers return to winter ploughing.', [
   ['Exchange permanent resident consuls to prevent border sparks', 65, { relation: 12, credit: 6 }],
   ['Host a shared bonfire feast on the river bank', 35, { relation: 9, prestige: 5 }],
   ['Archive the signed truce in the chancery vault', 0, { legitimacy: 6 }]
  ]]
 );

 arc4('wd_truce_grazing_march', 'Diplomacy', 'neighbor',
  ['Shepherds Clash on the High Meadow', 'Border shepherds from both realms drive flocks onto the same summer pasture, sparking fatal cudgel brawls.', [
   ['Convene a mixed border commission of elders from both crowns', 95, { relation: 12, stability: 6, legitimacy: 5 }],
   ['Split the meadow along the ridge stream by painted posts', 45, { relation: 7, food: 30 }],
   ['Send light horse to drive foreign flocks below the pass', 0, { prestige: 5, relation: -9 }]
  ]],
  ['Ancient Pasture Rolls Produced', 'Monks bring out hundred-year-old sheep-tally parchments showing both valleys shared the spring wells peacefully.', [
   ['Restore ancient alternating-month grazing rights publicly', 55, { relation: 11, legitimacy: 6, food: 35 }],
   ['Levy a modest joint well-upkeep penny on all flocks', 25, { credit: 5, relation: 6 }],
   ['Confirm strict boundary line irrespective of old parchment', 0, { stability: 4, relation: -4 }]
  ]],
  ['Wool Merchants Back the Peace', 'Clothiers from both sides petition for wool-pack fairs right below the mountain pass.', [
   ['Charter a seasonal cross-border wool fair with joint guards', 80, { credit: 9, relation: 11, prestige: 5 }],
   ['Permit unarmed shepherd trade on saints’ days only', 30, { relation: 6, piety: 4 }],
   ['Keep market trade restricted to walled towns', 0, { securityMonths: 6, credit: 3 }]
  ]],
  ['Peaceful Bells on the Uplands', 'Sheep bells chime peacefully along the limestone ridge under joint watchmen.', [
   ['Ratify a formal Border Customary Accord', 50, { relation: 10, legitimacy: 6 }],
   ['Gift fine wool cloaks to the neighbor’s envoys', 30, { relation: 8, prestige: 5 }],
   ['Close the grazing inquiry', 0, { stability: 4 }]
  ]]
 );

 arc4('wd_truce_herald_insult', 'Diplomacy', 'hostile',
  ['Torn Tabard at the Gate', 'A hot-headed border captain tore the royal heraldic tabard from a neighbor’s envoy over a petty toll dispute.', [
   ['Disavow the insult, punish the captain, and gift velvet robes', 105, { relation: 14, legitimacy: 7, prestige: 5 }],
   ['Offer private compensation while upholding border search rights', 45, { relation: 7, securityMonths: 6 }],
   ['Defend the captain’s zeal and expel the envoy', 0, { prestige: 6, relation: -12 }]
  ]],
  ['The Envoy’s Demand for Redress', 'Your neighbor’s council demands public apologies before reopening grain roads.', [
   ['Host a solemn ceremony restoring the herald’s baton at court', 70, { relation: 13, prestige: 8 }],
   ['Send an equal-ranked royal marshal to exchange formal greetings', 40, { relation: 9, stability: 5 }],
   ['Reply coldly that border inspections remain royal law', 0, { legitimacy: 6, relation: -6 }]
  ]],
  ['Quiet Merchants Lobby for Calm', 'Border bakers and wine carters from both realms beg ministers not to let pride starve winter markets.', [
   ['Open temporary safe-conduct grain wagons during talks', 60, { food: 40, relation: 8, credit: 5 }],
   ['Reduce border customs stamps for one season', 30, { credit: 6, relation: 6 }],
   ['Maintain firm customs checkpoints', 0, { securityMonths: 6 }]
  ]],
  ['Mended Seals, Open Gates', 'When dust settles, written herald immunity rules spare future envoys from reckless guards.', [
   ['Publish clear heraldic immunity letters to all castellans', 50, { legitimacy: 7, relation: 9 }],
   ['Rotate reckless officers away from sensitive crossings', 25, { stability: 6, securityMonths: 6 }],
   ['Resume regular border dispatches', 0, { relation: 5 }]
  ]]
 );

 arc4('wd_truce_marriage_envoy', 'Diplomacy', 'friendly',
  ['Procession of the Golden Coaches', 'A friendly realm dispatches silver-trimmed carriages proposing closer dynastic and commercial amity.', [
   ['Stage a three-day tourney, feast, and mutual tariff pact', 145, { relation: 16, prestige: 11, credit: 7 }],
   ['Receive the embassy warmly with scholar exchanges and gifts', 75, { relation: 11, research: 7, prestige: 6 }],
   ['Keep hospitality dignified yet frugal', 0, { relation: 5, stability: 4 }]
  ]],
  ['Toasts in the Painted Hall', 'Over roast swan and Rhenish wine, foreign ministers sound out mutual defense guarantees against restless neighbors.', [
   ['Sign a formal defensive treaty of mutual border warning', 85, { relation: 14, securityMonths: 8, stability: 6 }],
   ['Pledge commercial preferences and harbor shelter only', 40, { credit: 9, relation: 9 }],
   ['Promise warm friendship without binding war clauses', 0, { relation: 5, legitimacy: 4 }]
  ]],
  ['Artists & Armorers Trade Craft', 'Master armorers in the envoy’s train offer fluted steel templates in exchange for fine wool dyes.', [
   ['Sponsor a six-month artisan exchange between capitals', 80, { research: 10, prestige: 8, relation: 7 }],
   ['Purchase their finest breastplate patterns outright', 45, { prestige: 7, credit: 4 }],
   ['Thank them graciously with royal signet rings', 0, { relation: 5 }]
  ]],
  ['Lasting Cordiality', 'Cheering crowds line the road as the ambassadors ride home bearing sealed parchment treaties.', [
   ['Inscribe the alliance treaty inside the realm annals', 40, { legitimacy: 7, prestige: 6 }],
   ['Establish permanent diplomatic post-riders between capitals', 55, { relation: 10, securityMonths: 6 }],
   ['Close the festive season', 0, { stability: 5 }]
  ]]
 );

 // === G. SIEGE ENGINEERS, SAPPERS & ARTILLERY ===
 arc4('wd_sieg_countermine', 'Military', 'war',
  ['Hollow Knocking Beneath the Cellar', 'Garrison bakers pressing ears to flagstone floors hear faint pickaxe strokes chewing toward the tower foundations.', [
   ['Sink deep counter-mine shafts with iron listening basins', 120, { morale: 9, securityMonths: 8, experience: 0.06 }],
   ['Flood lower dry-moat ditches to drown shallow galleries', 55, { stability: 5, morale: 5 }],
   ['Pack earth-filled wine casks behind the threatened wall', 0, { supply: -5, morale: 4, stability: 3 }]
  ]],
  ['Lantern Clash in the Clay', 'Your sappers break straight into an enemy timbered tunnel lit by tallow dips; swords flash in choking dust.', [
   ['Roll smoked sulfur pots and storm the tunnel with bucklers', 70, { morale: 10, experience: 0.08, prestige: 6 }],
   ['Collapse the junction timbers with black powder charges', 45, { supply: -5, securityMonths: 7, morale: 7 }],
   ['Plug the breach with lime sacks and retreat up the shaft', 0, { stability: 4, fatigue: 5 }]
  ]],
  ['Crumbled Parapet Above', 'Enemy culverins target the weakened masonry above, showering defenders with limestone splinters.', [
   ['Raise woven gabion baskets packed with wet sand overnight', 65, { morale: 8, supply: 12 }],
   ['Mount counter-battery falconets on the inner keep roof', 45, { prestige: 6, experience: 0.05 }],
   ['Pull sentries back to the inner retrenchment wall', 0, { fatigue: -5, morale: -3 }]
  ]],
  ['Engineers Saved the Keep', 'When enemy relief falters, the ruined gallery becomes proof of your sappers’ nerve.', [
   ['Promote the lead miner to Master of Royal Sappers', 60, { experience: 0.07, research: 8, morale: 7 }],
   ['Rebuild the outer bastion with vaulted counter-mine galleries', 80, { prestige: 7, securityMonths: 8 }],
   ['Clear the rubble and toast the defenders', 0, { morale: 6 }]
  ]]
 );

 branch4('wd_sieg_great_bombard', 'Military', 'crossroads_gunpowder',
  ['The Great Bronze Culverin', 'Master founders propose casting a colossal twenty-foot bombard capable of shattering the thickest castle gate in three days.', [
   ['Melt spare church bells and fund the master foundry pit', 165, { prestige: 12, research: 9, legitimacy: 5 }],
   ['Cast four nimble field demi-culverins instead of one monster', 110, { research: 8, tools: 18, credit: 5 }],
   ['Hold to proven iron rib-guns and catapult trebuchets', 0, { stability: 5, gold: 40 }]
  ]],
  ['Molten Bronze Pours Clean', 'Glowing rivers of copper-tin alloy fill the clay mold beneath prayers and drumrolls; the barrel cools without a single hairline pit.', [
   ['Build a forty-oxen timber cradle to haul it toward the border', 90, { prestige: 10, development: 1 }],
   ['Test charges gently with measured stone balls on the heath', 45, { research: 8, credit: 4 }],
   ['Mount it proudly atop the capital citadel bastion', 0, { securityMonths: 9, legitimacy: 6 }]
  ]],
  ['Crack in the Clay Mold', 'Gas bubbles scar the breech; founders urge recasting before a live charge bursts among the crew.', [
   ['Pay to re-melt and cast an improved thick-walled breech', 95, { research: 9, prestige: 6, trust: 5 }],
   ['Salvage the bronze into light wall-swivel muskets', 35, { tools: 20, credit: 5 }],
   ['Leave the flawed barrel as a monument at the foundry gate', 0, { prestige: 4, stability: 3 }]
  ]],
  ['Age of Stone Walls Transformed', 'Word of your royal artillery parks reshapes diplomacy across every neighboring court.', [
   ['Charter a royal Guild of Bronze Founders with fixed salaries', 75, { development: 1, research: 9, credit: 6 }],
   ['Record exact tin-to-copper ratios in sealed arsenal books', 30, { securityMonths: 8, legitimacy: 5 }],
   ['Stow the carriages under dry tarred sheds', 0, { stability: 4 }]
  ]]
 );

 arc4('wd_sieg_floating_battery', 'Military', 'army',
  ['Marsh Siege Across Reeds', 'An enemy riverside town sits ringed by flooded meadows too soft for heavy cannon wheels.', [
   ['Lash twin barges into oak-planked floating gun-rafts', 130, { morale: 9, experience: 0.07, prestige: 7 }],
   ['Lay miles of woven willow hurdles over mud for light carts', 65, { supply: 14, fatigue: 5 }],
   ['Tighten landward blockade posts and starve the causeways', 0, { supply: 8, fatigue: 4, morale: 3 }]
  ]],
  ['Mist Drift at High Water', 'Gun-rafts pole silently through reed beds before dawn, anchoring within pistol shot of the water-gate.', [
   ['Open coordinated broadsides against the wooden gatehouse', 75, { morale: 10, prestige: 8 }],
   ['Land pioneer squads onto the wharf under smoke pots', 40, { experience: 0.06, morale: 6 }],
   ['Shell the inner warehouse roofs to force quick parley', 0, { supply: 10, prestige: 4 }]
  ]],
  ['Fire-Arrows From the Belfry', 'Town defenders rain burning pitch onto the reed-bound rafts, scorching sailcloth canopies.', [
   ['Douse decks with wet hides and return steady grape-shot', 55, { morale: 8, experience: 0.05 }],
   ['Cut anchor lines and drift back out of bow range cleanly', 20, { fatigue: -5, supply: 8 }],
   ['Signal shore pikemen to rush the distracted land gate', 0, { morale: 6, fatigue: 5 }]
  ]],
  ['Water-Gate Lowered', 'Town elders row out in skiffs bearing the brass harbor keys.', [
   ['Spare merchant halls and secure the grain docks intact', 55, { supply: 20, prestige: 8, stability: 5 }],
   ['Reward the barge crews with double campaign prize', 35, { morale: 10 }],
   ['Garrison the water-gate and reform the column', 0, { experience: 0.04 }]
  ]]
 );

 arc4('wd_sieg_tunnel_water', 'Military', 'land',
  ['The Hidden Cistern Aqueduct', 'An elderly stonemason reveals a forgotten Roman water-conduit passing straight beneath a stubborn border town’s outer wall.', [
   ['Fund waterproof lanterns and stealthy pioneer ladders', 110, { securityMonths: 8, prestige: 8, trust: 5 }],
   ['Divert the upland stream to dry out the town’s wells first', 65, { development: 1, stability: 5 }],
   ['Seal the rumor quietly lest spies lay a trap inside', 0, { securityMonths: 7, stability: 4 }]
  ]],
  ['Wading Through Cold Dark Stone', 'Selected volunteers creep waist-deep in icy water beneath sleeping sentries.', [
   ['Equip them with silenced crossbows and oil-soaked wedges', 60, { prestige: 7, securityMonths: 7 }],
   ['Coordinate trumpet feints at the opposite gate', 30, { trust: 5, stability: 5 }],
   ['Have scouts map the grating and withdraw before daybreak', 0, { research: 6, securityMonths: 4 }]
  ]],
  ['Grating Forced Before Dawn', 'Iron bars groan apart; the postern opens cleanly without battering a single house.', [
   ['Forbid street pillage strictly to win quick burgher calm', 55, { trust: 11, unrest: -8, prestige: 7 }],
   ['Secure municipal granaries and tax rolls immediately', 25, { grain: 16, legitimacy: 6 }],
   ['Hold the town square until elders swear fealty', 0, { stability: 6 }]
  ]],
  ['Bloodless Surrender Celebrated', 'Preserved markets open within two days, turning a bitter siege into an orderly submission.', [
   ['Confirm old town market charters under crown seal', 50, { credit: 8, trust: 9, loyalty: 7 }],
   ['Pension the elderly mason generously for life', 30, { prestige: 8, stability: 4 }],
   ['Repair the conduit grating for future defense', 0, { securityMonths: 6 }]
  ]]
 );

 // === H. BATTLE AFTERMATH & VETERAN CARE ===
 arc4('wd_aft_field_hospital', 'Military', 'army_fatigue',
  ['Straw Cots After the Clash', 'Victory came at steep blood-price; groaning wounded pack monastery cloisters while camp fever threatens fresh companies.', [
   ['Summon royal surgeons with clean linen, vinegar, and wine', 130, { fatigue: -22, morale: 11, prestige: 6 }],
   ['Organize orderly wagon trains moving wounded back to towns', 65, { fatigue: -14, supply: 10 }],
   ['Leave regimental barbers to tend cuts with boiled pitch', 0, { fatigue: -5, morale: -5 }]
  ]],
  ['Herbalists & Abbey Sisters', 'Local nuns and apothecaries strip clean sheets and boil willow bark beside smoking braziers.', [
   ['Endow the abbey infirmary with permanent royal corn rents', 80, { piety: 9, fatigue: -12, stability: 5 }],
   ['Purchase their entire stock of dried fever-herbs and salves', 40, { supply: 14, morale: 6 }],
   ['Thank the sisters and post guards against camp thieves', 0, { securityMonths: 5, morale: 3 }]
  ]],
  ['Maimed Bowmen Beg Leave', 'One-eyed veterans unfit for pike squares ask for honorable discharge notes and travel loaves.', [
   ['Grant copper pension badges and gatekeeper posts', 75, { morale: 11, legitimacy: 7, prestige: 6 }],
   ['Issue full campaign back-pay plus spare pack-mules', 45, { morale: 8, fatigue: -6 }],
   ['Give honorable discharge parchments cleanly', 0, { legitimacy: 4, morale: 3 }]
  ]],
  ['Soldiers Know They Will Not Be Forgotten', 'Word spreads through every tavern that this crown never abandons bleeding men on the field.', [
   ['Establish a permanent Royal Veterans’ Guildhall', 85, { prestige: 10, morale: 10, legitimacy: 6 }],
   ['Record every fallen yeoman’s name on brass parish rolls', 35, { piety: 7, stability: 6 }],
   ['Reform the healed regiments for garrison duty', 0, { experience: 0.05 }]
  ]]
 );

 branch4('wd_aft_captured_banners', 'Military', 'army',
  ['Standards Stacked Before the Tent', 'Captains lay forty blood-stained enemy guidons across drumheads while rival regiments quarrel over who broke the center.', [
   ['Praise all wings jointly and hang banners in the capital cathedral', 100, { morale: 11, prestige: 11, piety: 6 }],
   ['Convene a marshals’ court to weigh sworn witness accounts fairly', 45, { experience: 0.06, legitimacy: 7 }],
   ['Award the richest silk flags to your own household guard', 0, { prestige: 6, morale: -5 }]
  ]],
  ['Chorus Under Vaulted Stone', 'Cheering ranks watch captured pennants hoisted high beside ancient royal shields.', [
   ['Commission a victory tapestry and feast the rank-and-file', 85, { prestige: 10, morale: 9 }],
   ['Strike silver campaign medals for wounded flag-bearers', 45, { morale: 8, experience: 0.05 }],
   ['Grant a three-day rest before breaking camp', 0, { fatigue: -12, morale: 5 }]
  ]],
  ['Dueling Serjeants in the Horse-Lines', 'Bruised vanity erupts into sword brawls behind the sutler wagons until provosts blow whistles.', [
   ['Settle rival captains publicly at your own table over salt', 55, { morale: 8, stability: 6 }],
   ['Rotate quarreling companies onto separate flank marches', 20, { securityMonths: 6, morale: 4 }],
   ['Flog brawl starters regardless of prior valor', 0, { legitimacy: 5, morale: -6 }]
  ]],
  ['Discipline Restored After Triumph', 'A clear battle-honors roll records each regiment’s part without lingering camp bitterness.', [
   ['Inscribe regimental battle honors on painted standards', 55, { morale: 9, prestige: 7 }],
   ['Send modest victory purses home to soldiers’ parishes', 65, { stability: 7, prestige: 6 }],
   ['Close the campaign honors inquiry', 0, { legitimacy: 4 }]
  ]]
 );

 arc4('wd_aft_tainted_wells', 'Military', 'army_supply',
  ['Fever Along the Truce Line', 'Rotting horse carcasses choke village brooks near the battleground, spreading bloody flux through picket tents.', [
   ['Move camp uphill immediately and dig deep lime-pit wells', 110, { fatigue: -16, supply: 16, morale: 7 }],
   ['Boil all drinking water with vinegar and issue dry rye', 50, { supply: 12, fatigue: -8 }],
   ['Press forward briskly away from the valley', 0, { fatigue: 6, supply: -4, morale: -4 }]
  ]],
  ['Burial Truce Across the Ridge', 'Enemy commanders suffer the same fever and send a trumpeter begging a forty-eight-hour burial ceasefire.', [
   ['Grant humane burial teams and shared lime carts', 55, { piety: 9, prestige: 8, morale: 5 }],
   ['Allow strictly supervised burial parties under watch', 20, { securityMonths: 6, stability: 4 }],
   ['Refuse pause and hold high ground securely', 0, { experience: 0.04, morale: -2 }]
  ]],
  ['Surgeons’ New Camp Rules', 'Regimental doctors urge permanent latrine trenches downwind of kitchen fires on every future halt.', [
   ['Enforce strict camp sanitation ordinances across all banners', 60, { research: 7, fatigue: -12, morale: 6 }],
   ['Issue copper boiling kettles to every ten-man mess', 45, { supply: 14, morale: 5 }],
   ['Leave camp layout to veteran sergeants', 0, { experience: 0.03 }]
  ]],
  ['Healthy Columns Return', 'Fever breaks cleanly within ten days; clean water ordinances spare hundreds across later campaigns.', [
   ['Publish camp hygiene tables for royal quartermasters', 45, { research: 7, legitimacy: 5 }],
   ['Thank surgeons and pioneers before parade', 20, { morale: 7, prestige: 4 }],
   ['Resume normal field watches', 0, { stability: 3 }]
  ]]
 );

 arc4('wd_aft_ravaged_province', 'Politics', 'land',
  ['Burned Hedges After the Raid', 'Returning farmers find charred threshing barns, stolen plough-oxen, and unburied ditches after passing armies.', [
   ['Distribute seed grain, iron ploughshares, and three-year tax grace', 145, { food: 60, grain: 20, tools: 18, trust: 12, unrest: -10 }],
   ['Hire soldiers to rebuild cottages and stone bridges for bread pay', 75, { development: 1, trust: 8, unrest: -6 }],
   ['Suspend only extraordinary war levies for one season', 0, { trust: 4, unrest: -3, legitimacy: 3 }]
  ]],
  ['Disputed Loot in Market Stalls', 'Soldiers hawking brass candlesticks meet weeping villagers recognizing their own parish altarware.', [
   ['Buy back stolen church plate and return it publicly', 70, { piety: 10, trust: 9, legitimacy: 6 }],
   ['Confiscate proven stolen goods through provost courts', 25, { legitimacy: 7, securityMonths: 6 }],
   ['Prohibit soldiers from entering civilian fairs armed', 0, { unrest: -4, stability: 4 }]
  ]],
  ['The Widows’ Loom Collective', 'Bereaved women organize linen spinning houses to keep winter coin circulating in burned hamlets.', [
   ['Grant them royal flax loans and guild protection', 65, { credit: 8, trust: 9, tools: 10 }],
   ['Buy their rough linen straight for army shirt stocks', 45, { credit: 5, loyalty: 5 }],
   ['Exempt widows’ cottages from hearth taxes', 0, { trust: 6, unrest: -4 }]
  ]],
  ['Green Shoots Over Ashes', 'By next harvest, freshly limewashed barns gleam along the valley road.', [
   ['Erect a stone memorial cross honoring valley endurance', 45, { piety: 7, prestige: 6, trust: 5 }],
   ['Inspect restored bridges and grain mills', 30, { development: 1, credit: 4 }],
   ['Return the district to standard county rolls', 0, { stability: 4 }]
  ]]
 );

 // === I. COALITION TALKS & ALLIANCE DIPLOMACY ===
 branch4('wd_coal_league_summit', 'Diplomacy', 'neighbor',
  ['Secret Letters From Four Capitals', 'Uneasy neighbors propose a joint defensive league to restrain an aggressive regional power.', [
   ['Host the secret summit inside a fortified hunting lodge', 135, { relation: 16, prestige: 9, securityMonths: 8 }],
   ['Send trusted plenipotentiaries to sound out firm commitments first', 65, { relation: 10, stability: 5 }],
   ['Stay aloof and preserve freedom of action', 0, { legitimacy: 5, relation: -4 }]
  ]],
  ['Wax Seals on the Defensive League', 'Four chancellors agree on clear troop quotas and shared warning couriers should any member’s border burn.', [
   ['Ratify a formal Mutual Defense Pact with joint treasury pledges', 95, { relation: 15, legitimacy: 8, credit: 6 }],
   ['Keep defense pledges strictly reactive and narrow', 35, { relation: 9, stability: 6 }],
   ['Insist on royal supreme command if armies unite', 0, { prestige: 8, relation: -4 }]
  ]],
  ['Quarrel Over Command & Tolls', 'Petty jealousy flares when junior princes demand precedence over veteran marshals and lower river tariffs.', [
   ['Offer generous commercial customs concessions to smooth pride', 85, { relation: 12, credit: 6 }],
   ['Propose rotating field command every lunar month', 30, { relation: 8, stability: 5 }],
   ['Warn delegates frankly that disunity invites conquest', 0, { prestige: 6, legitimacy: 5 }]
  ]],
  ['Deterrence Across Borders', 'News of the united league forces rival warlords to pause winter preparations.', [
   ['Exchange permanent military attachés with league capitals', 55, { relation: 11, securityMonths: 8 }],
   ['Hold coordinated spring frontier maneuvers', 65, { prestige: 9, relation: 8 }],
   ['Close the summit and guard home borders', 0, { stability: 5 }]
  ]]
 );

 arc4('wd_coal_tribute_arrears', 'Diplomacy', 'tributeDebt',
  ['Empty Saddles at the Tribute Gate', 'A tributary border court is two quarters behind in agreed silver and horse deliveries, pleading ruined harvests.', [
   ['Accept half in winter grain & timber and restructure arrears cleanly', 60, { relation: 12, food: 45, legitimacy: 6 }],
   ['Send stern fiscal commissioners to audit their customs houses', 35, { credit: 7, securityMonths: 6, relation: -4 }],
   ['Demand full silver payment within thirty days under threat of arms', 0, { prestige: 7, relation: -11 }]
  ]],
  ['Envoys Carrying Timber Tallies', 'Their grey-bearded treasurer kneels in hall offering cedar beams, salt cakes, and pledged merchant sureties.', [
   ['Confirm the generous restructured schedule in golden ink', 45, { relation: 12, stability: 7 }],
   ['Take two noble pages as polite guarantee of winter terms', 20, { securityMonths: 7, legitimacy: 5 }],
   ['Collect available silver coin and demand the rest by solstice', 0, { gold: 95, relation: -5 }]
  ]],
  ['Rival Tempts the Tributary', 'Agents report a hostile neighbor whispering promises of lower tribute if the border court defects.', [
   ['Promise armed protection and shared market rights in return for loyalty', 95, { relation: 14, credit: 7, securityMonths: 6 }],
   ['Reinforce royal frontier beacons overlooking their road', 40, { securityMonths: 8, legitimacy: 5 }],
   ['Remind their court plainly of ancient sworn oaths', 0, { prestige: 6, stability: 4 }]
  ]],
  ['Sworn Bond Renewed', 'Freshly painted tribute banners ride quietly through the gate, binding the borderland peacefully.', [
   ['Bestow ceremonial robes of honor on their emissaries', 55, { relation: 12, prestige: 8 }],
   ['Record the revised pact in the grand diplomatic register', 20, { legitimacy: 6 }],
   ['Escort the embassy cleanly back to the border', 0, { stability: 4 }]
  ]]
 );

 arc4('wd_coal_neutral_corridor', 'Diplomacy', 'friendly',
  ['Appeal for Neutral Passage', 'An allied neighbor at war begs transit rights across two upland valleys to relieve a besieged kinsman.', [
   ['Grant supervised road passage with royal escorts and paid forage', 85, { relation: 14, credit: 6, stability: 4 }],
   ['Permit unarmed supply wagons only along marked river tracks', 35, { relation: 8, securityMonths: 6 }],
   ['Decline military passage cleanly to shield border villages', 0, { stability: 7, relation: -6 }]
  ]],
  ['Forage Discipline Tested', 'Allied troopers bivouac outside a quiet abbey; bailiffs watch anxiously over sheepfolds and orchards.', [
   ['Station royal stewards with silver to pay every loaf on the spot', 65, { relation: 10, stability: 7 }],
   ['Enforce strict curfew horns keeping allied troops in fenced fields', 25, { securityMonths: 7, legitimacy: 5 }],
   ['Hurry the column across the border in double marches', 0, { relation: 4, stability: 3 }]
  ]],
  ['Hostile Protest at Court', 'Envoys from your ally’s enemy lodge angry complaints calling transit aid an act of hidden war.', [
   ['Cite ancient imperial transit law and offer equal courier rights', 45, { legitimacy: 8, stability: 6 }],
   ['Send calming gifts and clarify the strict temporary limits', 60, { relation: 8, prestige: 5 }],
   ['Stand firmly by your friendly neighbor’s sovereign dignity', 0, { prestige: 7, relation: -4 }]
  ]],
  ['Gratitude Across the Pass', 'Once the valley clears, your ally sends captured standards and warm pledges of enduring friendship.', [
   ['Sign a permanent commercial customs favor with the ally', 55, { relation: 12, credit: 8 }],
   ['Repair any rutted bridges jointly with allied engineers', 40, { relation: 8, prestige: 5 }],
   ['Archive the transit journals cleanly', 0, { legitimacy: 5 }]
  ]]
 );

 arc4('wd_coal_trade_embargo', 'Diplomacy', 'hostile',
  ['Stalled Salt Barges at the Boom', 'A hostile court closes river customs to your salt merchants, leaving fifty loaded barges swinging at anchor.', [
   ['Dispatch sharp diplomatic envoys backed by reciprocal port tariffs', 90, { relation: 7, credit: 7, prestige: 7 }],
   ['Route salt wagons overland via friendly mountain passes', 65, { food: 40, credit: 5 }],
   ['Slap matching embargoes on their wine and wool immediately', 0, { legitimacy: 6, relation: -8 }]
  ]],
  ['Merchants Meet in Smugglers’ Taverns', 'On both banks, guildmasters fret over rotting herrings and unpaid boatmen, pressing ministers for compromise.', [
   ['Sponsor a neutral guild conference at a border abbey', 70, { relation: 12, credit: 8, stability: 5 }],
   ['Issue temporary crown credit notes to keep domestic salt cheap', 50, { food: 45, credit: 4 }],
   ['Wait firmly for rival wine growers to break first', 0, { prestige: 5, relation: -3 }]
  ]],
  ['The Customs Parity Draft', 'Negotiators draft a clear reciprocal rate card capping river tolls at three silver groats per keel.', [
   ['Sign the balanced customs parity treaty for ten years', 60, { relation: 14, credit: 10, stability: 6 }],
   ['Approve a one-year trial with quarterly joint inspections', 25, { relation: 8, securityMonths: 6 }],
   ['Insist on royal salt priority before signing', 0, { legitimacy: 6, relation: -3 }]
  ]],
  ['Sails Hoisted on the River', 'Anchored barges haul ropes singing as river customs bars rise once more.', [
   ['Appoint permanent joint river toll wardens', 50, { relation: 9, credit: 8 }],
   ['Feast returning barge skippers at the salt quay', 25, { prestige: 6, stability: 4 }],
   ['Resume regular tariff collections', 0, { gold: 75 }]
  ]]
 );

 // === J. ADDITIONAL HIGH-CRAFT WAR & DIPLOMACY ARCS ===
 arc4('wd_war_scout_ambush', 'Military', 'war',
  ['Lanterns in the Pine Gorge', 'Outriders spot hostile vanguard wagons rattling unescorted down a narrow slate gorge three leagues ahead.', [
   ['Spring a coordinated pincer ambush with light horse and crossbows', 110, { morale: 11, supply: 18, experience: 0.08 }],
   ['Snatch only the powder mules and burn spare limbers', 45, { morale: 7, supply: 12 }],
   ['Observe their strength silently and report back to camp', 0, { experience: 0.05, securityMonths: 5 }]
  ]],
  ['Spoils Along the Slate Track', 'Captured chests yield silver campaign coin alongside coded marching tables.', [
   ['Share captured silver fairly among the raiding squadrons', 35, { morale: 10, experience: 0.05 }],
   ['Send the coded tables immediately to royal cryptographers', 50, { securityMonths: 9, research: 6 }],
   ['Roll the captured powder into royal artillery wagons', 0, { supply: 16, gold: 45 }]
  ]],
  ['Enemy Dragoons Seek Revenge', 'Stung by the loss, rival light horse sweeps round the flank to burn isolated supply barns.', [
   ['Lay false campfire rings to trap their counter-raid', 65, { morale: 9, experience: 0.06 }],
   ['Pull outlying forage teams behind hedged camp lines', 25, { supply: 10, stability: 4 }],
   ['Ride hard to hold the bridgehead in force', 0, { fatigue: 5, morale: 5 }]
  ]],
  ['Eyes and Teeth of the Army', 'Bold reconnaissance breaks enemy confidence along the entire road.', [
   ['Raise the scout captain to knight banneret on parade', 55, { prestige: 9, morale: 8 }],
   ['Issue swift-loading carbines to outrider platoons', 75, { experience: 0.07, supply: 10 }],
   ['Log the gorge skirmish cleanly', 0, { prestige: 4 }]
  ]]
 );

 arc4('wd_war_night_sortie', 'Military', 'army',
  ['Sleet Before the Midnight Sally', 'Captains propose a silent midnight sortie in white linen shirts over armor to spike enemy siege guns.', [
   ['Issue white camisia shirts, horn lanterns, and iron spikes', 105, { morale: 11, experience: 0.08, prestige: 7 }],
   ['Support a smaller diversionary probe along the riverbank', 45, { morale: 6, experience: 0.04 }],
   ['Hold men dry behind stone battlements until morning', 0, { fatigue: -8, supply: 6 }]
  ]],
  ['Spikes Driven Into Touchholes', 'Half the battery guards scatter in panic as iron wedges hammer straight into bronze vents.', [
   ['Haul two light falconets cleanly back inside the gate', 60, { prestige: 9, supply: 14, morale: 8 }],
   ['Torch gabion baskets and withdraw under horn cover', 25, { morale: 7, experience: 0.05 }],
   ['Sound quick recall before reserve horse arrives', 0, { fatigue: 3, morale: 4 }]
  ]],
  ['Morning Counter-Battery Rage', 'Infuriated besiegers muster dense storming columns at noon despite shattered gun carriages.', [
   ['Pour boiling lime and crossfire from flanking towers', 65, { morale: 9, experience: 0.06 }],
   ['Rally citizens to haul rubble baskets onto damaged steps', 30, { stability: 5, morale: 6 }],
   ['Hold pike blocks tightly behind the gatehouse', 0, { fatigue: 5, morale: 4 }]
  ]],
  ['Banners Hold Fast', 'The repulsed assault leaves enemy trenches sullen and waterlogged.', [
   ['Award double winter pay to the white-shirted raiders', 70, { morale: 11, prestige: 7 }],
   ['Repair the postern hinges with forged iron bands', 35, { supply: 10, securityMonths: 6 }],
   ['Mount captured ramrods in the hall', 0, { prestige: 5 }]
  ]]
 );

 arc4('wd_war_vanguard_duel', 'Military', 'war',
  ['Trumpets Before the Battle Line', 'An arrogant enemy champion rides between opposing pike hedges shouting formal challenges to single combat.', [
   ['Send your finest household knight cleanly mounted in royal colors', 85, { prestige: 12, morale: 10 }],
   ['Let a cool-headed veteran captain meet him with lance and mace', 40, { morale: 8, experience: 0.05 }],
   ['Answer chivalry with disciplined crossbow volleys across the turf', 0, { experience: 0.04, morale: 4, relation: -4 }]
  ]],
  ['Broken Lances in the Turf', 'Ash splinters fly across frost-hardened clover as both riders wheel back with battered shields and drawn swords.', [
   ['Sound trumpets to cheer your champion’s steady footwork', 35, { morale: 9, prestige: 6 }],
   ['Hold flanking squadrons poised lest enemy horse cheat', 50, { securityMonths: 7, experience: 0.05 }],
   ['Watch silently behind lowered visors', 0, { stability: 4 }]
  ]],
  ['Honor Yielded Beneath Steel', 'Your champion unhorses his foe cleanly at the third pass, holding the dagger tip poised above the visor.', [
   ['Spare his life publicly for fair ransom and courtesy', 45, { prestige: 11, relation: 10, piety: 5 }],
   ['Accept his sword and horse as lawful trophy of arms', 20, { morale: 8, gold: 45 }],
   ['Demand he swear never to bear arms against your banner', 0, { legitimacy: 6, morale: 6 }]
  ]],
  ['Moral Ascendancy Won', 'A roar shakes the royal lines as trumpets sound the general advance.', [
   ['Present the champion with gilt spurs and royal mantle', 60, { prestige: 10, morale: 9 }],
   ['Send polite word praising the foe’s courage to his herald', 25, { relation: 8 }],
   ['Press the battlefield advantage smoothly', 0, { experience: 0.05 }]
  ]]
 );

 arc4('wd_dip_consul_quarrel', 'Diplomacy', 'trade',
  ['Venetian and Local Consuls Clash', 'Foreign merchant consuls demand extraterritorial immunity inside their quarter after a night tavern stabbing.', [
   ['Establish a mixed magistrate bench honoring local crown law', 95, { legitimacy: 8, credit: 8, trust: 7 }],
   ['Respect consul courts on civil debt while trying felonies royally', 45, { acceptance: 7, credit: 6, stability: 4 }],
   ['Abolish foreign quarter locks and enforce uniform city watch', 0, { legitimacy: 7, unrest: -4, credit: -5 }]
  ]],
  ['Shipmasters Threaten to Weigh Anchor', 'Angry captains threaten to shift silk and alum cargoes to rival harbors unless customs guarantees hold.', [
   ['Seal a bilingual Port Equity Charter guaranteeing honest weights', 80, { credit: 10, acceptance: 8, trust: 6 }],
   ['Host foreign factors at guildhall dinner to settle terms', 40, { prestige: 6, credit: 6 }],
   ['Remind captains that your harbor holds the deepest anchorage', 0, { legitimacy: 5, credit: -3 }]
  ]],
  ['Warehouse Fire on the Quay', 'Sparks leap from an olive-oil loft, uniting local porters and foreign sailors in desperate bucket chains.', [
   ['Fund stone fire-walls and reward heroic foreign and local crews', 85, { development: 1, trust: 9, acceptance: 8 }],
   ['Advance emergency timber loans to burnt warehouses', 45, { credit: 7, stability: 5 }],
   ['Post harbor guards to protect salvaged cargo bales', 0, { securityMonths: 7, trust: 4 }]
  ]],
  ['Bustling Bilingual Quays', 'Shared peril and fair benches turn suspicious quarters into thriving commercial partners.', [
   ['Charter a permanent Maritime Exchange Hall', 75, { credit: 10, development: 1, prestige: 6 }],
   ['Print harbor fire-and-trade ordinances in three tongues', 35, { research: 6, acceptance: 6 }],
   ['Close the consular docket cleanly', 0, { stability: 4 }]
  ]]
 );

 arc4('wd_dip_border_priest', 'Diplomacy', 'neighbor',
  ['Disputed Parish Along the Watershed', 'A border village’s stone church sits inside your neighbor’s tax roll while its graveyard and tithe barn lie on yours.', [
   ['Negotiate a clean land-swap trading outlying woodland for parish unity', 80, { relation: 12, stability: 6, piety: 6 }],
   ['Share feast-day alms and let villagers choose their own chapel', 35, { relation: 7, piety: 5, legitimacy: 4 }],
   ['Insist on old medieval survey stones regardless of fences', 0, { legitimacy: 5, relation: -6 }]
  ]],
  ['Competing Tithe Collectors Meet', 'Two rival collectors arrive at the churchyard stile on the same morning with iron-bound strongboxes.', [
   ['Place the parish under temporary crown escrow while envoys settle', 55, { stability: 7, relation: 8 }],
   ['Divide summer grain and autumn wine tithes fifty-fifty', 25, { relation: 6, credit: 4 }],
   ['Back your bailiff’s claim firmly', 0, { gold: 40, relation: -5 }]
  ]],
  ['The Elder’s Map', 'An aged verger opens a chest revealing an undisputed royal boundary parchment signed eighty years earlier.', [
   ['Honor the old parchment publicly and compensate lost acreage fairly', 65, { relation: 13, legitimacy: 8, prestige: 6 }],
   ['Use the parchment to settle shared pasture rights smoothly', 30, { relation: 8, stability: 5 }],
   ['Archive the roll cleanly for future boundary talks', 0, { legitimacy: 5 }]
  ]],
  ['Bells Ring Over One Parish', 'Both realms ratify the boundary line with stone cairns carved with twin crosses.', [
   ['Endow a joint wayside well beside the cairn', 45, { relation: 10, piety: 7 }],
   ['Host village elders at the border tavern', 20, { relation: 6, stability: 4 }],
   ['Record the new border coordinates', 0, { legitimacy: 4 }]
  ]]
 );

 arc4('wd_dip_alliance_dowry', 'Diplomacy', 'friendly',
  ['Unpaid Treaty Subsidies', 'An ally fighting distant raiders sends urgent envoys requesting the second installment of promised treaty silver.', [
   ['Dispatch full bullion wagons under swift escort immediately', 135, { relation: 16, prestige: 9, legitimacy: 6 }],
   ['Send half in silver and half in fine saltpeter & steel arms', 75, { relation: 11, credit: 5, prestige: 5 }],
   ['Plead domestic road repairs and defer the draft until autumn', 0, { stability: 4, relation: -8 }]
  ]],
  ['Gratitude From the Allied Front', 'Your ally’s marshal breaks the raid and captures banners bearing unfamiliar eastern emblems.', [
   ['Host a joint victory thanksgiving and display shared banners', 60, { prestige: 10, relation: 10, piety: 5 }],
   ['Send surgeons and winter blankets to their field camps', 45, { relation: 9, stability: 4 }],
   ['Request copies of their scout maps against future raids', 0, { research: 6, securityMonths: 5 }]
  ]],
  ['Allied Merchants Seek Port Favors', 'Warm diplomatic ties encourage allied spice and wool syndicates to ask for lowered warehouse dues.', [
   ['Grant reciprocal customs reductions in key staple ports', 70, { credit: 9, relation: 10 }],
   ['Offer trial exemptions for one harvest year', 30, { credit: 5, relation: 6 }],
   ['Keep standard harbor tariffs intact', 0, { gold: 60, relation: -2 }]
  ]],
  ['An Unbroken Alliance', 'Across every neighboring court, your crown’s word is prized as good as stamped gold.', [
   ['Renew the alliance parchment for another generation', 50, { relation: 12, legitimacy: 7 }],
   ['Mint commemorative friendship medallions', 40, { prestige: 8 }],
   ['Close the embassy ledgers', 0, { credit: 4 }]
  ]]
 );

 arc4('wd_fort_coastal_martello', 'Politics', 'cont_europe',
  ['Corsair Sails Off the Salt Marshes', 'Fast lateen galleys raid salt-pans at dawn, snatching villagers before inland knights can saddle up.', [
   ['Raise round stone watchtowers mounting swivel-guns every two leagues', 145, { securityMonths: 11, development: 1, trust: 9 }],
   ['Mount volunteer coastal light horse on marsh ponies', 65, { trust: 7, unrest: -5, securityMonths: 6 }],
   ['Order salt workers to shelter behind abbey walls by night', 0, { stability: 3, food: -15, unrest: 3 }]
  ]],
  ['Signal Horns Through Sea-Fog', 'Watchmen catch a pirate landing boat probing a creek before sunrise.', [
   ['Equip towers with speaking-trumpets and flare rockets', 60, { securityMonths: 8, research: 6 }],
   ['Dig hidden stake-pits across landing beaches', 30, { trust: 6, securityMonths: 5 }],
   ['Sound parish church bells when unknown sails tack close', 0, { stability: 4 }]
  ]],
  ['Captured Corsair Pilot', 'Villagers haul a soaked navigator ashore who offers hidden cove charts for his neck.', [
   ['Map his anchorage and launch a dawn surprise strike', 75, { prestige: 9, securityMonths: 9, credit: 5 }],
   ['Hand him cleanly to admiralty judges for fair trial', 25, { legitimacy: 7, trust: 5 }],
   ['Hold him chained for prisoner exchange', 0, { securityMonths: 6 }]
  ]],
  ['Safe Shores Along the Salt Flats', 'Whitewashed round towers gleam along the headlands, keeping fishing villages secure.', [
   ['Charter coastal watchmen with modest salt-tax exemptions', 50, { trust: 9, credit: 6 }],
   ['Install dry powder vaults under each watchtower', 45, { securityMonths: 7, tools: 12 }],
   ['Archive the coastal defense chart', 0, { legitimacy: 4 }]
  ]]
 );

 arc4('wd_army_pike_reform', 'Military', 'army',
  ['Heavy Knights Meet Long Pikes', 'Veteran captains warn that heavy lances alone falter against eighteen-foot ash pike squares backed by crossbows.', [
   ['Adopt combined pike-and-shot squares with ash staves and halberds', 135, { experience: 0.09, morale: 9, research: 7 }],
   ['Drill dismounted knights alongside peasant archers in hedges', 65, { morale: 7, experience: 0.06 }],
   ['Preserve noble heavy cavalry shock tactics unchanged', 0, { prestige: 5, morale: 3 }]
  ]],
  ['Complaints From the Jousting Yard', 'Young nobles scoff at marching on foot beside village pikemen carrying heavy timber shafts.', [
   ['Lead a muddy practice march yourself carrying a pike', 45, { morale: 11, prestige: 9, legitimacy: 6 }],
   ['Grant higher officer stipends to noble pike-captains', 75, { morale: 8, stability: 4 }],
   ['Assign proud knights strictly to flanking horse squadrons', 0, { experience: 0.04, morale: 4 }]
  ]],
  ['Mock Battle on the Heath', 'Two half-armies test the new hedge of pikes against thunderous mock cavalry charges.', [
   ['Issue iron breastplates to front-rank pikemen', 85, { supply: 16, morale: 9, experience: 0.06 }],
   ['Refine drum signals for swift square wheeling', 30, { experience: 0.06, morale: 5 }],
   ['Conclude drills cleanly before dark', 0, { fatigue: -5, morale: 4 }]
  ]],
  ['Hedge of Steel', 'When banners unfurl next spring, your infantry stands steady against the fiercest charge.', [
   ['Publish illustrated pike-and-shot drill manuals', 55, { research: 9, legitimacy: 6 }],
   ['Feast the reformed companies with roast beef and ale', 35, { morale: 9, food: -20 }],
   ['Return troops to regular garrison rotation', 0, { stability: 4 }]
  ]]
 );

 arc4('wd_army_camp_discipline', 'Military', 'army_fatigue',
  ['Card-Sharps and Sutlers’ Gin', 'Exhausted regiments gamble away boots and powder flasks inside unauthorized camp taverns.', [
   ['License honest camp sutlers and ban crooked dice tables', 85, { morale: 8, fatigue: -14, securityMonths: 7 }],
   ['Organize archery and wrestling contests with modest silver prizes', 55, { morale: 9, experience: 0.05, fatigue: -8 }],
   ['Whip caught gamblers and smash illicit barrels', 0, { legitimacy: 5, morale: -5, fatigue: -4 }]
  ]],
  ['Stolen Boots in the Horse Lines', 'With gambling debts mounting, three baggage drivers are caught selling cavalry bridles to peddlers.', [
   ['Pay off honest soldiers’ arrears and audit sutler ledgers', 75, { morale: 9, supply: 14 }],
   ['Enforce fixed prices on bread, ale, and tallow candles', 30, { morale: 6, stability: 5 }],
   ['Hang the ringleader at the camp crossroad', 0, { securityMonths: 6, morale: -4 }]
  ]],
  ['Chaplains & Camp Ballads', 'Camp chaplains and pipers lift weary spirits around evening fires with clean songs and hot pottage.', [
   ['Fund travelling chaplains and winter spice rations', 60, { piety: 8, morale: 9, fatigue: -10 }],
   ['Issue fresh wool socks and clean straw bedding', 40, { fatigue: -14, supply: 10 }],
   ['Keep lights out at the second watch horn', 0, { fatigue: -6 }]
  ]],
  ['Sober Ranks at Dawn', 'Clear camp ordinances banish sharpers and restore pride to the morning muster.', [
   ['Codify Articles of Camp Discipline under royal seal', 50, { legitimacy: 7, morale: 7 }],
   ['Reward loyal provost sergeants', 25, { securityMonths: 6, prestige: 4 }],
   ['Break camp cleanly on schedule', 0, { supply: 8 }]
  ]]
 );

 arc4('wd_dip_border_spy', 'Diplomacy', 'hostile',
  ['Double Agent at the Frontier Inn', 'A clerk from a hostile chancellery slips across the border offering troop deployment rosters for sanctuary.', [
   ['House him under quiet guard and verify every roster twice', 105, { securityMonths: 10, prestige: 5, relation: -2 }],
   ['Pay modestly for border bridge reports and send him onward', 45, { securityMonths: 7, credit: 4 }],
   ['Hand him back across the river as a gesture of royal good faith', 0, { relation: 12, prestige: 6 }]
  ]],
  ['Trap or True Tidings?', 'His sketch correctly predicts two enemy supply convoys, yet leaves out a third bridge crossing.', [
   ['Cross-check his map with midnight cavalry scouts', 60, { securityMonths: 8, research: 5 }],
   ['Feed him tailored rumors to test if he reports back', 35, { securityMonths: 9, stability: 4 }],
   ['Keep him sealed inside a quiet monastery guest room', 0, { stability: 5 }]
  ]],
  ['Hostile Envoys Demand Extradition', 'Angry neighbors accuse your court of harboring a traitorous thief of state seals.', [
   ['Refuse surrender while offering strict border truce guarantees', 55, { legitimacy: 8, prestige: 7 }],
   ['Negotiate quiet third-party exile in exchange for border calm', 30, { relation: 9, stability: 5 }],
   ['Hold firm behind sovereign asylum custom', 0, { prestige: 6, relation: -5 }]
  ]],
  ['Intelligence Sealed in Vaults', 'Whether used for counter-watch or diplomatic bargaining, the episode sharpens border vigilance.', [
   ['Fund cipher clerks permanently at frontier posts', 70, { securityMonths: 10, research: 6 }],
   ['Send reassuring commercial letters across the river', 35, { relation: 8, credit: 5 }],
   ['Close the dossier cleanly', 0, { stability: 4 }]
  ]]
 );

 arc4('wd_war_mountain_pass', 'Military', 'war',
  ['Snow-Blocked Mountain Defile', 'Hostile mountaineers roll boulders down a narrow gorge, trapping half your baggage train below the pass.', [
   ['Send nimble light archers up goat-paths to clear the heights', 110, { morale: 10, experience: 0.08, supply: 12 }],
   ['Hire local highland guides to lead wagons along a hidden salt-track', 75, { supply: 16, fatigue: -6 }],
   ['Dismantle heavy carts and pack supplies on foot', 0, { fatigue: 8, supply: 6, morale: -3 }]
  ]],
  ['Ambush Above the Timberline', 'Arrows hiss through swirling pine-mist as flankers seize the boulder ledges above the road.', [
   ['Push stone cairns onto enemy pickets and hold the crest', 55, { morale: 9, prestige: 7 }],
   ['Offer clan chiefs fair silver for free passage down the valley', 65, { relation: 8, supply: 12, stability: 4 }],
   ['Escort the wagons swiftly while archers hold the ridge', 0, { fatigue: 4, morale: 5 }]
  ]],
  ['Avalanche Danger at Noon', 'Warm sun loosens snowdrifts hanging directly above the choked road.', [
   ['Fire light falconets into high drifts to clear snow safely', 60, { research: 6, supply: 10, fatigue: -8 }],
   ['Move columns strictly before dawn while crust stays frozen', 25, { experience: 0.05, fatigue: 3 }],
   ['Post horn-watchers on opposite crags', 0, { securityMonths: 6, morale: 4 }]
  ]],
  ['Down Into the Warm Valley', 'All banners descend intact onto sunlit meadows beyond the divide.', [
   ['Reward highland scouts and build stone refuge huts on the pass', 75, { prestige: 8, supply: 14, stability: 5 }],
   ['Rest horses two days beside clear mountain streams', 25, { fatigue: -14, morale: 6 }],
   ['Form vanguard for the valley march', 0, { morale: 5 }]
  ]]
 );

 arc4('wd_dip_trade_league_war', 'Diplomacy', 'neighbor',
  ['Quarrel Over Herring Shoals', 'Fishing fleets from both kingdoms clash with boathooks and net-knives over rich autumn herring banks.', [
   ['Draw clear seasonal fishing zones and joint admiralty cutters', 100, { relation: 12, food: 50, credit: 7 }],
   ['Set up neutral port markets where both fleets land catches freely', 55, { relation: 9, food: 35, credit: 5 }],
   ['Send armed sloops to reserve the home bank exclusively', 0, { food: 30, prestige: 5, relation: -9 }]
  ]],
  ['Salted Barrels at the Wharf', 'Cooperative salt-curers point out that unified barrel stamps raise prices across inland fairs for both realms.', [
   ['Standardize brine barrels and crown quality brands together', 70, { credit: 10, relation: 10, food: 30 }],
   ['License shared winter drying sheds along the spit', 35, { credit: 6, relation: 6 }],
   ['Keep domestic guild marks strictly separate', 0, { legitimacy: 5, credit: 3 }]
  ]],
  ['Storm Wrecks Both Fleets', 'An October gale drives twenty boats onto sandbars, uniting crews of both flags in desperate surf rescues.', [
   ['Open royal coastal beacons and pay rescue bounties for all sailors', 75, { relation: 14, prestige: 9, piety: 6 }],
   ['Provide dry loaves and warm ale to shipwrecked crews', 30, { relation: 9, food: -15, stability: 4 }],
   ['Guard stranded hulls against wreckers until owners arrive', 0, { securityMonths: 6, relation: 6 }]
  ]],
  ['Brotherhood of the Herring Banks', 'Shared peril turns bitter net-rivals into dependable sea-neighbors.', [
   ['Sign a ten-year Coastal Fishery Peace', 50, { relation: 12, credit: 7 }],
   ['Build a twin-funded chapel lighthouse on the point', 55, { piety: 8, relation: 9, prestige: 6 }],
   ['Resume seasonal customs logs', 0, { credit: 4 }]
  ]]
 );

 arc4('wd_fort_citadel_arsenal', 'Military', 'disloyal',
  ['Dusty Powder Keys in Baron’s Keep', 'Inspectors find a restless baron hoarding thirty barrels of royal siege powder inside his private gatehouse.', [
   ['Buy back the barrels cleanly and store them in crown magazines', 110, { loyalty: 9, securityMonths: 9, legitimacy: 6 }],
   ['Leave half for border defense while registering royal tally seals', 45, { loyalty: 6, securityMonths: 6 }],
   ['Confiscate the entire magazine immediately under treason law', 0, { legitimacy: 7, securityMonths: 8, loyalty: -9 }]
  ]],
  ['Grumbling Among Border Retainers', 'His men-at-arms complain that royal commissioners treat loyal frontier defenders like common brigands.', [
   ['Invite the baron to head a frontier fortification council', 65, { loyalty: 11, prestige: 6, stability: 5 }],
   ['Confirm his hereditary watch-fees in sealed parchment', 30, { loyalty: 7, legitimacy: 4 }],
   ['Rotate two royal sergeants into his gatehouse watch', 0, { securityMonths: 7, loyalty: -4 }]
  ]],
  ['Raiders Test the Keep at Dusk', 'Opportunistic border horse probes the valley mills, putting royal-baronial coordination immediately on trial.', [
   ['Rush crown crossbow reinforcements to fight beside his garrison', 80, { loyalty: 12, stability: 7, trust: 7 }],
   ['Supply fresh iron bolts and biscuit carts from the district depot', 40, { loyalty: 8, grain: 14 }],
   ['Let the baron’s men hold their own walls first', 0, { prestige: 4, loyalty: -5 }]
  ]],
  ['Shared Bastions, Restored Trust', 'Fighting shoulder to shoulder buries old grievances beneath proud frontier comradeship.', [
   ['Grant the keep fresh royal repair stipends', 60, { development: 1, loyalty: 10 }],
   ['Record the baron’s service in court chronicles', 25, { prestige: 7, legitimacy: 5 }],
   ['Seal the joint muster rolls', 0, { stability: 4 }]
  ]]
 );

 arc4('wd_war_desertion_winter', 'Military', 'army_supply',
  ['Footprints Heading Home', 'Hungry levies slip past night pickets in twos and threes toward harvest cottages ten leagues away.', [
   ['Send double bread wagons and offer harvest furlough passes', 115, { morale: 10, supply: 20, stability: 5 }],
   ['Pay modest silver bonuses to men staying through frost', 70, { morale: 8, experience: 0.04 }],
   ['Post cavalry patrols to arrest stragglers on the road', 0, { securityMonths: 6, morale: -5 }]
  ]],
  ['Parish Priests Urge Steadiness', 'Village curates send warm wool socks and letters begging sons to keep honor until campaign close.', [
   ['Match parish sock gifts with salted beef rations', 60, { morale: 9, supply: 14, piety: 4 }],
   ['Grant tax grace to cottages whose sons stay under banners', 40, { stability: 7, legitimacy: 5 }],
   ['Read royal loyalty proclamations at evening muster', 0, { legitimacy: 4, morale: 3 }]
  ]],
  ['The Ring of Runaways', 'Patrols corner twelve shivering lads hiding in an abandoned lime-kiln.', [
   ['Offer pardon if they rejoin pioneer trenches cleanly', 35, { morale: 6, supply: 8, stability: 4 }],
   ['Make an example of the instigator while sparing young boys', 20, { legitimacy: 6, securityMonths: 5 }],
   ['Return them to their sergeants for camp labor', 0, { supply: 6, morale: -2 }]
  ]],
  ['Orderly Demobilization Charter', 'Clear seasonal rotation schedules ensure levies never face hunger without notice again.', [
   ['Establish rotating thirty-day levy relief shifts', 70, { morale: 10, experience: 0.06, legitimacy: 6 }],
   ['Keep dry winter depots stocked along return roads', 45, { supply: 16 }],
   ['Close the muster inquiry', 0, { stability: 4 }]
  ]]
 );

 arc4('wd_dip_pope_legate', 'Diplomacy', 'cont_europe',
  ['Envoys of Peace Under Crossed Keys', 'Travelling papal or patriarchal mediators arrive offering solemn moral backing for a regional truce.', [
   ['Receive the legates with grand cathedral honors and open petitions', 120, { piety: 11, prestige: 10, acceptance: 9 }],
   ['Consult them privately on prisoner exchanges and abbey protection', 55, { piety: 8, trust: 7, stability: 5 }],
   ['Keep spiritual legates politely clear of secular border talks', 0, { legitimacy: 7, faithAuthority: -3 }]
  ]],
  ['Sanctuary for War Orphans', 'Legates inspect crowded abbey hostels sheltering displaced border families.', [
   ['Endow joint sanctuary kitchens and orphan apprenticeships', 85, { piety: 10, trust: 9, food: 35 }],
   ['Release surplus tithe grain to frontier parishes', 40, { piety: 7, food: 40 }],
   ['Commend the hostels to bishopric alms', 0, { piety: 4, stability: 3 }]
  ]],
  ['Draft of the Lenten Truce', 'Mediators propose banning hostilities on holy feast days and protecting grain mills year-round.', [
   ['Sign the Truce of God ordinances publicly before altars', 60, { piety: 9, acceptance: 9, stability: 7 }],
   ['Bind armies to spare mills and churches in future orders', 30, { legitimacy: 7, piety: 6 }],
   ['Reserve military discretion while honoring church bells', 0, { trust: 4, prestige: 4 }]
  ]],
  ['Blessed Peacemakers', 'Word of your pious restraint wins moral authority across neighboring courts.', [
   ['Gift illuminated gospels to the departing legates', 50, { prestige: 9, piety: 8, acceptance: 7 }],
   ['Record the peace ordinances in chancery rolls', 20, { legitimacy: 6 }],
   ['Bid the legates safe journey', 0, { stability: 4 }]
  ]]
 );

 arc4('wd_war_siege_ladder', 'Military', 'army',
  ['Scaling Ladders at the Ditch', 'Pioneers test hinged ash scaling ladders against a practice wall, yet iron hooks bend under armored men.', [
   ['Forge tempered steel grapple-hooks and padded rope rungs', 110, { experience: 0.08, morale: 9, supply: 12 }],
   ['Build covered rolling timber mantlets to shield sappers', 75, { morale: 8, fatigue: -6 }],
   ['Keep ordinary pegged pine ladders and double numbers', 0, { supply: 6, morale: 3 }]
  ]],
  ['Rivalry for the Forlorn Hope', 'Young captains quarrel furiously over who earns the perilous honor of leading the first ladder wave.', [
   ['Draw fair lots before the banner and promise knighthoods', 65, { morale: 11, prestige: 8 }],
   ['Assign seasoned veterans to steady the young hotheads', 30, { experience: 0.06, morale: 6 }],
   ['Forbid reckless boasts until batteries breach the parapet', 0, { stability: 5, legitimacy: 4 }]
  ]],
  ['Drums in the Trench at Dawn', 'Archers pin wall sentries behind merlons while mantlets roll steadily toward the dry ditch.', [
   ['Supply flaming pitch arrows to clear wooden hoardings', 55, { morale: 8, experience: 0.06 }],
   ['Hold reserve stormers fresh behind earthen traverses', 25, { fatigue: -8, morale: 5 }],
   ['Sound the steady advance across the rubble', 0, { experience: 0.04 }]
  ]],
  ['Standards Raised on the Parapet', 'The disciplined storm carries the outer wall cleanly with far lighter loss than feared.', [
   ['Honor survivors of the first wave with silver medallions', 55, { prestige: 10, morale: 10 }],
   ['Repair the captured parapet before nightfall', 35, { securityMonths: 7, supply: 10 }],
   ['Consolidate the captured sector', 0, { stability: 4 }]
  ]]
 );

 arc4('wd_dip_spice_treaty', 'Diplomacy', 'cont_asia',
  ['Envoys of the Monsoon Ports', 'Silk-robed harbor ambassadors dock carrying sandalwood chests to negotiate mutual anti-piracy escort treaties.', [
   ['Host lavish port banquets and fund shared patrol junks', 135, { acceptance: 12, credit: 10, prestige: 9 }],
   ['Sign reciprocal safe-harbor pledges for storm-damaged hulls', 60, { trust: 9, credit: 6 }],
   ['Welcome ambassadors politely without naval outlays', 0, { acceptance: 5, stability: 4 }]
  ]],
  ['Translators Draft the Maritime Code', 'Jurists align port anchorage fees, shipwreck salvage shares, and lighthouse signals across three languages.', [
   ['Print trilingual harbor tablets for every major jetty', 75, { research: 9, credit: 8, acceptance: 7 }],
   ['Establish joint merchant arbitration boards at sea-gates', 40, { trust: 8, acceptance: 8 }],
   ['Keep customs settlements under native port wardens', 0, { legitimacy: 6, credit: 3 }]
  ]],
  ['Pirate Junk Sighted Off the Point', 'Patrol bells clang as an armed squadron corners a notorious raider hiding behind coral islets.', [
   ['Coordinate joint boarding launches under twin flags', 70, { trust: 9, prestige: 9, securityMonths: 8 }],
   ['Seal the cove exit and starve out the raiders', 30, { securityMonths: 7, stability: 5 }],
   ['Drive them out into deep water', 0, { prestige: 5, trust: 4 }]
  ]],
  ['Calm Horizon Across the Strait', 'Silver-inlaid treaties lock in steady pepper and silk customs for a decade.', [
   ['Gift bronze compasses to allied harbor captains', 50, { acceptance: 9, research: 6 }],
   ['Collect boosted customs windfalls cleanly', 20, { gold: 95, credit: 6 }],
   ['Close the maritime embassy', 0, { stability: 4 }]
  ]]
 );

 arc4('wd_war_winter_forage', 'Military', 'army_supply',
  ['Frozen Turnips in the Ditch', 'Early snow locks the countryside white; cavalry scouts return empty-handed from stripped hamlets.', [
   ['Purchase emergency oats and dried beans from neutral barges', 130, { supply: 26, food: 40, morale: 8 }],
   ['Boil horse-mash with chopped straw and march toward river depots', 55, { supply: 14, fatigue: 5 }],
   ['Quarter companies across loyal villages under strict chits', 0, { supply: 10, stability: -3, morale: -2 }]
  ]],
  ['Poachers in the Royal Chase', 'Hungry archers snare two fat stags inside a noble’s fenced deer park, sparking furious bailiff protests.', [
   ['Compensate the park keeper quietly and feed the sick tents', 65, { morale: 8, legitimacy: 5, fatigue: -8 }],
   ['Permit soldiers to hunt hares only outside castle paling', 25, { supply: 10, stability: 4 }],
   ['Flog the poachers and hang the venison in officer kitchens', 0, { prestige: 4, morale: -6 }]
  ]],
  ['Ice Barges Break Through', 'Iron-prowed river skiffs smash thin shore ice to bring salted beef barrels straight to camp.', [
   ['Reward the fearless boatmen with double silver', 50, { morale: 8, supply: 18 }],
   ['Guard the landing stage with torches all night', 20, { securityMonths: 6, supply: 8 }],
   ['Unload immediately by torchlight', 0, { supply: 10, fatigue: 4 }]
  ]],
  ['Surviving the Leanest Moon', 'Not a single banner breaks during the freeze, proving the resilience of your supply clerks.', [
   ['Promote the lead quartermaster to the royal council board', 60, { legitimacy: 7, supply: 12, credit: 5 }],
   ['Issue warm sheepskin vests for spring scouts', 45, { fatigue: -10, morale: 7 }],
   ['Close the winter ration ledgers', 0, { stability: 4 }]
  ]]
 );

 arc4('wd_dip_border_map', 'Diplomacy', 'neighbor',
  ['Mismatched Maps at the Chancery', 'A neighboring cartographer brings royal surveys showing an entire forested ridge lying fifty furlongs further west than yours.', [
   ['Dispatch joint surveyors with brass chains and astrolabes', 95, { relation: 11, research: 8, legitimacy: 6 }],
   ['Accept river courses as practical boundaries ignoring ridge lines', 40, { relation: 8, stability: 5 }],
   ['Reject foreign sketches and post royal foresters on the crest', 0, { legitimacy: 6, relation: -8 }]
  ]],
  ['Timbermen Caught Between Claims', 'Charcoal burners caught felling oaks on the disputed slope beg to know whose sheriff takes their fines.', [
   ['Place ridge timber revenues in neutral escrow during survey', 50, { relation: 8, credit: 5, stability: 5 }],
   ['Grant villagers free fallen-branch firewood meanwhile', 25, { stability: 6, relation: 5 }],
   ['Impound felled logs under royal mark', 0, { gold: 45, relation: -5 }]
  ]],
  ['The Brass Theodolite Verdict', 'Careful triangulation settles the watershed true line cleanly down the middle saddle.', [
   ['Carve joint limestone boundary obelisks along the saddle', 70, { relation: 12, prestige: 7, legitimacy: 6 }],
   ['Split the disputed timber equally between both crowns', 35, { relation: 9, credit: 5 }],
   ['Sign the survey parchment quietly at border camp', 0, { relation: 6 }]
  ]],
  ['Accurate Charts for Both Realms', 'Surveyors trade lens-grinding secrets, enriching cartography in both capitals.', [
   ['Print the corrected frontier atlas for crown administrators', 60, { research: 10, legitimacy: 6 }],
   ['Thank the neighboring astronomers warmly', 25, { relation: 9, prestige: 5 }],
   ['Archive the copper survey plates', 0, { stability: 4 }]
  ]]
 );

 arc4('wd_war_scout_dogs', 'Military', 'army',
  ['Fog Over the Picket Line', 'Thick river mist blinds sentries every dawn, letting enemy knife-raiders slip silently between camp fires.', [
   ['Train sharp-eared mastiffs and wire trip-bells along approaches', 90, { securityMonths: 9, morale: 8, experience: 0.05 }],
   ['Double overlapping horn pickets and clear scrub brush', 40, { experience: 0.05, supply: 8 }],
   ['Pull outlying pickets tight round the wagon laager', 0, { fatigue: 4, stability: 3 }]
  ]],
  ['Barking in the Alder Brake', 'Midnight alarms erupt as dogs bay at crawling scouts carrying fire-pots toward the powder carts.', [
   ['Capture prisoners cleanly to interrogate their raid plan', 55, { securityMonths: 8, morale: 7 }],
   ['Drive raiders into ditch stakes with quick musket volleys', 25, { experience: 0.06, morale: 6 }],
   ['Hold tight ranks till dawn reveals their tracks', 0, { stability: 4 }]
  ]],
  ['Rival Raiders Switch Tactics', 'Foiled at night, enemies try bribing camp sutlers to smuggle damp match into fodder stacks.', [
   ['Seal the wagon park and search every incoming cart', 60, { securityMonths: 9, supply: 10 }],
   ['Plant loyal scouts inside sutler lines to catch traitors', 35, { securityMonths: 8, experience: 0.04 }],
   ['Move powder casks inside stone abbey vaults nearby', 0, { stability: 5 }]
  ]],
  ['Impenetrable Camp Perimeter', 'The army sleeps deep and wakes sharp, untouched by sabotage or mist raids.', [
   ['Establish permanent camp-security manuals for field officers', 50, { research: 7, experience: 0.06 }],
   ['Reward alert sentries and dog-handlers', 25, { morale: 8 }],
   ['Resume normal march watches', 0, { stability: 4 }]
  ]]
 );

 arc4('wd_dip_prisoner_cartel', 'Diplomacy', 'war',
  ['Overflowing Castle Dungeons', 'Captured enemy soldiers crowd damp gatehouses, straining wardens’ bread budgets and risking gaol fever.', [
   ['Negotiate a clean head-for-head exchange cartel with enemy heralds', 95, { relation: 13, stability: 7, morale: 6 }],
   ['House sick prisoners in airy barn hospitals under parole oaths', 50, { piety: 8, relation: 8 }],
   ['Put healthy captives to work mending royal highways', 0, { prestige: 4, supply: 8, relation: -4 }]
  ]],
  ['Disputed Rank Equivalencies', 'Enemy marshals demand three yeomen for one mounted sergeant; clerks argue bitterly over parchment scales.', [
   ['Settle a clean published tariff of ranks for all future wars', 55, { legitimacy: 8, relation: 10, prestige: 6 }],
   ['Include wounded non-combatants freely on both sides', 30, { piety: 9, relation: 9 }],
   ['Trade equal numbers rank-by-rank only', 0, { legitimacy: 5, relation: 4 }]
  ]],
  ['Parole Oath Broken?', 'Rumors fly that a released enemy captain rejoined field garrisons before his ransom cleared.', [
   ['Lodge calm formal proof with enemy herald masters', 45, { prestige: 8, relation: 6, legitimacy: 6 }],
   ['Hold his two remaining comrades until his house makes good', 20, { securityMonths: 7, relation: -3 }],
   ['Publish his broken oath across neighboring courts', 0, { prestige: 7, relation: -6 }]
  ]],
  ['Cleared Dungeons, Honored Laws', 'Chivalric rules endure even through fierce campaigns, easing later peace negotiations.', [
   ['Archive the signed cartel in the royal chancery', 40, { legitimacy: 7, stability: 5 }],
   ['Host returning exchanged veterans at the palace gate', 45, { morale: 10, prestige: 7 }],
   ['Close the warden rolls', 0, { stability: 4 }]
  ]]
 );

 arc4('wd_war_bridge_fort', 'Military', 'land',
  ['The Wooden Toll Bridge Burns', 'Lightning—or hidden saboteurs—torches the main oak trestle linking capital arsenals to eastern marches.', [
   ['Span the river with broad stone arches and twin gatehouses', 160, { development: 1, credit: 9, securityMonths: 9 }],
   ['Erect a sturdy timber truss bridge guarded by palisade blockhouses', 80, { tools: 18, trust: 7, securityMonths: 6 }],
   ['Press local flat-ferries into temporary shuttle service', 0, { credit: 3, trust: 3, unrest: 2 }]
  ]],
  ['Quarrymen Float Ashlar Downstream', 'Stone barges crowd the quay, yet bridge carpenters demand guard posts against nighttime arsonists.', [
   ['Light tarred pitch lamps along cofferdams with night halberdiers', 65, { securityMonths: 8, trust: 7 }],
   ['Offer generous rewards for any information on the fire-starters', 35, { securityMonths: 7, stability: 4 }],
   ['Hurry timber centering before autumn floods', 0, { development: 1, unrest: -2 }]
  ]],
  ['Toll-Free Crown Supply Lane', 'Burghers worry heavy bridge tolls will choke wool carts once arches lock into place.', [
   ['Cap tolls low for grain and cloth while crowning royal couriers free', 55, { credit: 9, trust: 10, unrest: -5 }],
   ['Lease toll booths cleanly to the bridge builders’ guild', 30, { credit: 7, loyalty: 5 }],
   ['Collect standard royal passage pennies', 0, { gold: 80, unrest: 2 }]
  ]],
  ['The Great Stone Crossing', 'Masons strike away the timber scaffolding; loaded war wagons and grain carts roll cleanly side by side.', [
   ['Carve royal arms and builders’ marks onto the keystone', 45, { prestige: 9, legitimacy: 6 }],
   ['Establish a permanent bridge-upkeep endowment', 55, { development: 1, credit: 6 }],
   ['Open the bridge with morning trumpets', 0, { stability: 5 }]
  ]]
 );

 arc4('wd_dip_envoy_gift', 'Diplomacy', 'friendly',
  ['Menagerie & Clockwork at Court', 'A friendly sovereign sends a gilded brass striking-clock and rare falcons escorted by learned astronomers.', [
   ['Reciprocate with fine wool tapestries, armor, and university fellowships', 135, { relation: 16, prestige: 12, research: 8 }],
   ['Display the clock publicly in the town square and gift thoroughbreds', 75, { relation: 11, prestige: 9 }],
   ['Receive the gifts graciously with sealed parchment thanks', 0, { relation: 6, prestige: 4 }]
  ]],
  ['Clockmakers Debate Gear Teeth', 'Native blacksmiths gather intently around the brass escapement, eager to learn wheel-cutting.', [
   ['Fund a joint royal horology workshop under the visiting master', 85, { research: 12, credit: 6, relation: 7 }],
   ['Commission two tower clocks for cathedral and town hall', 50, { prestige: 8, research: 6 }],
   ['Preserve the intricate mechanism inside the palace gallery', 0, { prestige: 5 }]
  ]],
  ['Hawking Across Autumn Downs', 'Mounted nobles ride out with the foreign falcons, turning stiff diplomacy into easy camaraderie.', [
   ['Stage a grand riverside pavilion hunt for visiting envoys', 70, { relation: 12, prestige: 8 }],
   ['Gift matched silver falcon bells to the embassy', 35, { relation: 8, prestige: 5 }],
   ['Return quietly to council tables', 0, { stability: 5 }]
  ]],
  ['Timepieces & Amity', 'Every chime of the square clock reminds townsfolk and ambassadors alike of your realm’s golden standing.', [
   ['Sponsor annual scholar exchanges between both courts', 60, { research: 9, relation: 10 }],
   ['Issue a friendly commercial tariff decree', 30, { credit: 8, relation: 7 }],
   ['Close the embassy visit warmly', 0, { relation: 5 }]
  ]]
 );

 arc4('wd_war_coastal_raid', 'Military', 'army_fatigue',
  ['Smoke Over the Fishing Cove', 'Enemy galleys burned three coastal hamlets before vanishing into morning mist; weary militia clamor for vengeance.', [
   ['Organize swift amphibious reprisal against their corsair haven', 130, { morale: 11, prestige: 10, experience: 0.08 }],
   ['Station mounted watch patrols along cliffs and rebuild coves', 65, { fatigue: -14, morale: 7, stability: 5 }],
   ['Rest exhausted levies and tighten watchtowers first', 0, { fatigue: -10, morale: 3 }]
  ]],
  ['Oars Muffled With Linen', 'Under moonless skies, royal cutters glide inside the enemy’s outer breakwater.', [
   ['Cut anchor cables and fire moored raid-galleys', 70, { morale: 10, prestige: 9, experience: 0.06 }],
   ['Seize naval charts and brass swivel-guns from the quay', 40, { supply: 16, research: 6 }],
   ['Free captured coastal fishermen cleanly and pull oars', 0, { morale: 9, piety: 5 }]
  ]],
  ['Pursuit Through Tidal Shallows', 'Enemy watch-boats give chase across booming surf until morning squalls hide your cutters.', [
   ['Hold tight line-abreast formation firing stern chasers', 45, { experience: 0.07, morale: 7 }],
   ['Slip across shallow sandbars only local pilots know', 25, { supply: 10, fatigue: -5 }],
   ['Row straight through mist toward home beacons', 0, { fatigue: 5, morale: 4 }]
  ]],
  ['Safe Beaches & High Spirits', 'Returning cutters beach amid cheering coastal crowds carrying recovered village bells.', [
   ['Reward the boatmen with silver prize shares', 55, { morale: 10, prestige: 8 }],
   ['Rebuild burned coastal cottages cleanly', 60, { stability: 7, food: 35 }],
   ['Resume regular sea-watches', 0, { securityMonths: 6 }]
  ]]
 );

 arc4('wd_dip_envoy_passport', 'Diplomacy', 'neighbor',
  ['Pilgrim Passes Torn at the Border', 'Tense border sheriffs detained fifty pious pilgrims from a neighboring realm, suspecting spies in wool robes.', [
   ['Release innocent pilgrims with fresh bread and copper-sealed passes', 75, { relation: 12, piety: 9, prestige: 6 }],
   ['Establish joint shrine check-in books to vet strangers politely', 35, { relation: 7, securityMonths: 7 }],
   ['Confirm strict border questioning while letting elders pass', 0, { securityMonths: 6, relation: -3 }]
  ]],
  ['The Real Spy Inside the Choir', 'Amid apologies, sheriffs spot one pilgrim wearing clean spur-scars beneath dusty sandals and carrying hollow staves.', [
   ['Quietly detain only the disguised scout while shielding pilgrims', 55, { securityMonths: 9, legitimacy: 6 }],
   ['Present the captured ciphers calmly to the neighbor’s envoy', 30, { prestige: 7, relation: 5 }],
   ['Escort the suspect cleanly back across the bridge', 0, { stability: 5, relation: 4 }]
  ]],
  ['Abbots Back Open Roads', 'Grateful monasteries on both sides offer to verify honest pilgrim letters with wax parish stamps.', [
   ['Charter monastic pilgrim-pass registries jointly', 60, { piety: 9, relation: 10, credit: 4 }],
   ['Fund wayside pilgrim fountains along the border road', 45, { piety: 8, relation: 7 }],
   ['Accept the abbots’ offer gratefully', 0, { stability: 5 }]
  ]],
  ['Faithful Travelers Pass Unharmed', 'Clean travel letters preserve border security without trampling sacred custom.', [
   ['Publish reciprocal safe-conduct edicts for pilgrims & scholars', 45, { relation: 10, research: 5, piety: 5 }],
   ['Gift brass relay bells to border abbeys', 25, { piety: 6, stability: 4 }],
   ['Close the border pass docket', 0, { legitimacy: 4 }]
  ]]
 );

 // Add 20 more 4-stage chains (80 stages) to reach 66 chains = 264 stages!
 arc4('wd_war_scout_tower', 'Military', 'army',
  ['Timber Watchtower on the Ridge', 'Engineers propose erecting a forty-foot timber belfry overlooking enemy supply roads beyond the river.', [
   ['Raise a bolted oak tower manned by falconet gunners', 120, { morale: 9, experience: 0.07, securityMonths: 7 }],
   ['Build a hidden earth-and-pine lookout screened by oaks', 50, { securityMonths: 7, supply: 10 }],
   ['Use mounted hill pickets rotated every watch', 0, { fatigue: 4, experience: 0.04 }]
  ]],
  ['Enemy Sappers Creep Through Scrub', 'Lookouts spot crawling fascine-bearers aiming to fire the timber stilts.', [
   ['Rain iron caltrops and lantern-guided bolts from the gallery', 55, { morale: 8, experience: 0.06 }],
   ['Send cavalry swooping around the ridge base', 40, { morale: 7, prestige: 5 }],
   ['Douse the lower timbers in wet mud and clay', 0, { supply: 6, stability: 3 }]
  ]],
  ['Long-Glass Glimpses Far Dust', 'Watchers trace enemy baggage dust shifting toward an unguarded southern ford.', [
   ['Force-march flanking companies to seize the ford first', 65, { morale: 10, experience: 0.07 }],
   ['Warn nearby valley forts by signal flare', 25, { securityMonths: 7, stability: 4 }],
   ['Verify the dust column with fast riders', 0, { supply: 6 }]
  ]],
  ['Commanding the Valley Floor', 'Your foresight denies the enemy every river crossing before a single battle forms.', [
   ['Record ridge-watch tactics in royal field manuals', 45, { research: 8, experience: 0.05 }],
   ['Reward keen-eyed archers with silver rings', 30, { morale: 8, prestige: 5 }],
   ['Dismantle the timber frame cleanly when advancing', 0, { supply: 10 }]
  ]]
 );

 arc4('wd_war_armorer_guild', 'Military', 'army_supply',
  ['Brittle Steel in the Baggage Train', 'Pikes snap cleanly against iron targets; smiths discover cheap cold-short iron crept into arsenal shipments.', [
   ['Recall flawed heads and forge tempered steel pikes and corselets', 135, { supply: 24, morale: 10, experience: 0.06 }],
   ['Stamp genuine arsenal proof-marks on tested blades only', 60, { supply: 14, securityMonths: 6 }],
   ['Regrind salvaged heads for garrison duty only', 0, { supply: 8, morale: -3 }]
  ]],
  ['The Fraudulent Contractor', 'Auditors trace the brittle iron back to a smug provincial ironmaster cutting corners on charcoal.', [
   ['Seize his defective ingots and fine him double for royal coffers', 25, { gold: 95, legitimacy: 7, morale: 5 }],
   ['Force him to re-forge every blade at his own expense under guard', 40, { supply: 18, securityMonths: 6 }],
   ['Cancel his royal patent quietly and blacklist his forge', 0, { legitimacy: 5, credit: 4 }]
  ]],
  ['Armorer Wagons Roll With the Column', 'Travelling anvils clink beside camp fires nightly, mending bent halberds and dented sallets.', [
   ['Add extra portable bellows and whetstones to every battalion', 65, { supply: 18, fatigue: -8 }],
   ['Train two soldiers per company in cold-riveting harness', 35, { experience: 0.06, morale: 5 }],
   ['Keep smiths stationed at the main supply park', 0, { supply: 8 }]
  ]],
  ['Ring of True Steel', 'Every blade passing proof-marks gives rankers quiet confidence in close press.', [
   ['Charter a royal Armory Proof-House at the capital', 80, { research: 8, prestige: 7, supply: 12 }],
   ['Pay skilled camp smiths permanent retainers', 45, { morale: 8 }],
   ['Archive the proof-inspection rolls', 0, { legitimacy: 4 }]
  ]]
 );

 arc4('wd_dip_ransom_lady', 'Diplomacy', 'war',
  ['Countess Trapped in the Border Tower', 'After a frontier tower yields, your marshals discover a highborn allied countess of the enemy king stranded inside.', [
   ['Escort her under silk canopy back to her kin with untouched jewels', 85, { prestige: 12, relation: 15, legitimacy: 6 }],
   ['Grant honorable abbey custody pending polite truce talks', 40, { piety: 7, relation: 9 }],
   ['Hold her courteously for formal diplomatic ransom', 0, { gold: 110, relation: -4 }]
  ]],
  ['Songs of Royal Courtesy', 'Trouvères on both sides compose verses praising your camp’s chivalry amid bitter war.', [
   ['Host a solemn frontier dinner returning her household', 65, { relation: 12, prestige: 10 }],
   ['Exchange three wounded royal captains cleanly in gratitude', 25, { morale: 8, relation: 8 }],
   ['Send sealed safe-conduct papers cleanly', 0, { stability: 5 }]
  ]],
  ['Quiet Channel Opens', 'Her grateful brother sends a private sealed letter sounding out honorable terms to end border bloodletting.', [
   ['Open discreet truce talks at a woodland priory', 70, { relation: 13, stability: 7 }],
   ['Agree to spare undefended market towns on both sides', 30, { relation: 9, piety: 6 }],
   ['Reply politely while keeping troops vigilant', 0, { securityMonths: 6, prestige: 4 }]
  ]],
  ['Honor Above Iron', 'Even seasoned foes concede your crown fights like sovereigns rather than brigands.', [
   ['Seal formal rules shielding non-combatants in wartime', 55, { legitimacy: 8, relation: 9, piety: 5 }],
   ['Accept gifted hunting hounds graciously', 20, { prestige: 7, relation: 6 }],
   ['Close the correspondence cleanly', 0, { stability: 4 }]
  ]]
 );

 arc4('wd_dip_embassy_quarrel', 'Diplomacy', 'hostile',
  ['Precedence at the Foreign Banquet', 'An arrogant rival ambassador pushes past your envoy at a third court’s banquet, sparking hand-on-hilt shouting.', [
   ['Instruct envoys to outshine them through wit, gifts, and steady dignity', 95, { prestige: 11, relation: 8, legitimacy: 5 }],
   ['Lodge a crisp written protest through the host chancellor', 35, { legitimacy: 7, relation: 4 }],
   ['Demand a formal apology before your embassy sits again', 0, { prestige: 6, relation: -7 }]
  ]],
  ['Whispered Rumors in the Gallery', 'Rival agents spread mocking pamphlets claiming your treasury runs on empty chests and borrowed pewter.', [
   ['Settle diplomatic bills in fresh heavy gold coins publicly', 105, { credit: 9, prestige: 10 }],
   ['Counter with crisp courtly satires praising solid crown law', 40, { prestige: 7, stability: 5 }],
   ['Ignore petty tavern chatter beneath royal notice', 0, { legitimacy: 4 }]
  ]],
  ['The Host Sovereign Mediates', 'Eager to keep peace in his capital, the host king offers alternating precedence at solemn chapels.', [
   ['Accept equal alternating seats graciously', 40, { relation: 11, stability: 6 }],
   ['Secure trade concessions in exchange for quiet concession', 25, { credit: 7, relation: 6 }],
   ['Insist on ancient treaty roll seniority', 0, { prestige: 6, relation: -4 }]
  ]],
  ['Dignity Preserved Abroad', 'Your embassy wins respect for poise under provocation, opening new commercial doors.', [
   ['Establish permanent diplomatic stipends for fluent envoys', 65, { relation: 10, research: 6 }],
   ['Recall the envoy briefly for royal praise', 25, { prestige: 7 }],
   ['Close the dispatch folder', 0, { stability: 4 }]
  ]]
 );

 arc4('wd_war_river_ice', 'Military', 'army_fatigue',
  ['Cracking Ice Under the Vanguard', 'Early winter crust tempts scouts to cross a frozen river bend rather than march twelve leagues to the stone bridge.', [
   ['Lay thick straw and splashed water-ice tracks for safe crossing', 95, { supply: 14, morale: 8, experience: 0.06 }],
   ['Cross only light infantry in spaced files with rope lifelines', 40, { experience: 0.05, fatigue: -6 }],
   ['March the longer dry road to the stone bridge cleanly', 0, { fatigue: 6, stability: 4 }]
  ]],
  ['Wagon Wheel Breaks Through', 'One powder sled cracks near midstream, dragging two drivers into waist-deep icy current.', [
   ['Send hardy pioneers in rope harnesses to haul sled and men clear', 55, { morale: 10, supply: 10, fatigue: -8 }],
   ['Save the drivers first and cut loose the sunken sled', 20, { morale: 8, piety: 4 }],
   ['Hurry remaining sleds ashore before cracks widen', 0, { supply: 6, morale: -3 }]
  ]],
  ['Bonfires on the Far Willow Bank', 'Shivering crossing parties huddle round crackling driftwood fires as hot spiced cider passes round.', [
   ['Issue spare wool blankets and dry stockings from reserve carts', 70, { fatigue: -16, morale: 9 }],
   ['Order vigorous dry drills and warm porridge bowls', 25, { fatigue: -8, morale: 5 }],
   ['Post cold pickets against rival scouts', 0, { securityMonths: 6, fatigue: 3 }]
  ]],
  ['Surprise on the Unwatched Shore', 'Because foes trusted river ice to stop you, the entire far valley lies open.', [
   ['Reward pioneers who laid the straw road', 45, { morale: 9, prestige: 7 }],
   ['Secure captured hay barns immediately for horses', 30, { supply: 18 }],
   ['Advance briskly while fog holds', 0, { experience: 0.05 }]
  ]]
 );

 arc4('wd_fort_spy_postern', 'Politics', 'vassal',
  ['Unwalled Postern Behind the Mill', 'Border surveyors discover an unrecorded sally-port cut quietly beneath an old border manor’s millhouse.', [
   ['Wall the secret gate with solid ashlar and reward the surveyor', 95, { securityMonths: 10, legitimacy: 7, loyalty: 4 }],
   ['Install a royal iron portcullis with crown-held keys', 55, { securityMonths: 8, leverage: 12 }],
   ['Summon the manor lord sternly to explain the hidden passage', 0, { legitimacy: 6, loyalty: -6 }]
  ]],
  ['The Miller’s Confession', 'Terrified, the miller confesses smugglers paid him three silver groats nightly to roll wool bales out untaxed.', [
   ['Pardon the miller in return for naming the smuggling ring', 35, { credit: 7, securityMonths: 8, trust: 6 }],
   ['Seize smugglers’ hidden river skiffs for royal customs', 20, { gold: 75, securityMonths: 6 }],
   ['Fine the manor heavily for lax watchkeeping', 0, { gold: 85, loyalty: -5 }]
  ]],
  ['Smugglers Strike the Toll Barn', 'Cornered night-runners try firing the customs barn to mask their flight downstream.', [
   ['Post armed customs cutters along both banks', 65, { securityMonths: 9, credit: 6 }],
   ['Compensate honest millers and tighten guild weights', 40, { trust: 8, credit: 5 }],
   ['Rally village bailiffs to douse flames and watch roads', 0, { stability: 5 }]
  ]],
  ['Sealed Border Passage', 'With hidden posterns blocked and customs patrols active, leakages vanish.', [
   ['Inspect all frontier mill-sluices cleanly once a year', 50, { securityMonths: 8, credit: 6 }],
   ['Reward the vigilant surveyor with crown land', 35, { prestige: 7, loyalty: 5 }],
   ['File the frontier inspection roll', 0, { legitimacy: 4 }]
  ]]
 );

 arc4('wd_dip_grain_corridor', 'Diplomacy', 'food',
  ['Frozen Granary Barges Across the Border', 'Your realm’s harvest fell short while a friendly neighbor holds brimming river granaries thirty leagues upstream.', [
   ['Dispatch silver bullion and negotiate an urgent crown grain fleet', 140, { food: 120, trust: 10, stability: 7 }],
   ['Trade royal salt and iron tools for emergency rye shipments', 70, { food: 80, credit: 7 }],
   ['Appeal cleanly to old neighborly treaties for modest aid', 0, { food: 40, trust: 4 }]
  ]],
  ['Ice Jams Delay the Convoy', 'Barges halt twenty miles short of the border as stubborn pack ice blocks the narrows.', [
   ['Hire hundreds of sleigh-drivers to haul sacks overland', 85, { food: 70, credit: 4, stability: 5 }],
   ['Send ice-breakers and timber sleds with army pioneers', 45, { food: 55, legitimacy: 4 }],
   ['Wait two days for warmer southern wind to crack the jam', 0, { food: 25, unrest: 2 }]
  ]],
  ['Hoarders Outside the Market Gate', 'Word of incoming grain sparks panicky speculation among urban corn-brokers trying to corner sacks.', [
   ['Open royal distribution stalls fixing honest penny loaves', 60, { food: 45, stability: 8, trust: 8 }],
   ['Inspect private granaries and compel fair market release', 25, { legitimacy: 7, unrest: -6 }],
   ['Guard the arriving wagons straight to abbey kitchens', 0, { piety: 6, stability: 5 }]
  ]],
  ['Bread on Every Table', 'Timely foreign grain averts winter hunger and cements lasting gratitude between neighboring peoples.', [
   ['Sign a standing Mutual Famine Aid Compact', 55, { credit: 9, stability: 7 }],
   ['Send fine craft gifts back to the neighbor’s stewards', 35, { trust: 8, prestige: 6 }],
   ['Store remaining surplus in dry royal granaries', 0, { food: 35 }]
  ]]
 );

 arc4('wd_war_flag_bearer', 'Military', 'army',
  ['Fallen Standard in the Mud', 'During a chaotic bog skirmish, an enemy thrust killed the royal standard-bearer, yet an unnamed yeoman snatched the silk up.', [
   ['Raise the yeoman to gentleman-at-arms and award a silver shield', 85, { morale: 12, prestige: 10, legitimacy: 5 }],
   ['Gift him a generous purse and sergeant’s halberd', 40, { morale: 9, experience: 0.05 }],
   ['Praise his courage before the line and restore the banner to a knight', 0, { prestige: 5, morale: 3 }]
  ]],
  ['Envious Whispers Among Wellborn Pages', 'Haughty squires grumble in tent corners that lowborn hands clutched the sovereign’s lion banner.', [
   ['Rebuke snobbery publicly: valor ennobles blood, not silk alone', 35, { morale: 10, legitimacy: 8 }],
   ['Pair the new yeoman-ensign with an honored elder marshal', 50, { experience: 0.06, stability: 5 }],
   ['Keep camp duties brisk so envy finds no idle hours', 0, { experience: 0.04, morale: 4 }]
  ]],
  ['Banner Tested Again at the Ford', 'In the next skirmish, every commoner watches the newly minted ensign hold the ford knee-deep in water.', [
   ['Rush household horse to anchor his stubborn stand', 65, { morale: 11, experience: 0.07 }],
   ['Signal archers to rain covering shafts around the banner', 25, { morale: 7, supply: 8 }],
   ['Let the infantry rally organically around the high silk', 0, { morale: 6 }]
  ]],
  ['Legend of the Ford', 'Recruits flock to your standards, knowing merit shines brighter than lineage on your battlefields.', [
   ['Commission a heraldic crest honoring the yeoman’s deed', 45, { prestige: 9, morale: 8 }],
   ['Issue double rations across all infantry companies', 35, { food: -20, morale: 8 }],
   ['Record the victory in regimental rolls', 0, { legitimacy: 5 }]
  ]]
 );

 arc4('wd_dip_cipher_envoy', 'Diplomacy', 'neighbor',
  ['Stolen Pouch on the Post Road', 'Highwaymen plundered a neighboring ambassador’s diplomatic pouch inside your borders—leaving sensitive royal letters scattered.', [
   ['Mobilize sheriffs immediately to recover sealed letters unread', 105, { relation: 14, securityMonths: 9, legitimacy: 6 }],
   ['Send armed escort to replace his horses and hunt the thieves', 55, { relation: 9, stability: 5 }],
   ['Express deep regret and promise swift county court action', 0, { relation: 4, stability: 3 }]
  ]],
  ['The Tavern Fence’s Offer', 'An innkeeper quietly admits a bandit sold him the brass dispatch case—still wax-sealed—for five shillings.', [
   ['Buy back the intact seal immediately and arrest the thieves', 65, { relation: 12, securityMonths: 8 }],
   ['Seize the pouch under crown warrant and verify unbroken seals', 25, { legitimacy: 7, relation: 8 }],
   ['Interrogate the innkeeper until the whole gang names themselves', 0, { securityMonths: 7, relation: 5 }]
  ]],
  ['Sealed Pouch Returned Intact', 'Tears of relief shine in the ambassador’s eyes as his own unbroken family signet glints under candlelight.', [
   ['Host a reassuring dinner guaranteeing armed highway escorts', 55, { relation: 12, prestige: 8 }],
   ['Publish stern royal edicts protecting all foreign couriers', 25, { legitimacy: 7, relation: 7 }],
   ['Escort his carriage personally to the border post', 0, { relation: 8, prestige: 5 }]
  ]],
  ['Trust Along the Post Roads', 'Unbroken honor in delicate intrigue earns deeper candor in every future negotiation.', [
   ['Establish joint anti-bandit patrols along international roads', 60, { securityMonths: 9, relation: 10 }],
   ['Reward honest sheriffs with silver badges', 25, { stability: 5, prestige: 4 }],
   ['Close the highway inquiry', 0, { legitimacy: 4 }]
  ]]
 );

 arc4('wd_war_horse_plague', 'Military', 'army_fatigue',
  ['Glanders in the Cavalry Paddock', 'Runny noses and swollen glands appear among baggage horses; farriers warn contagion could cripple every squadron.', [
   ['Quarantine sick animals, burn infected straw, and buy healthy mules', 135, { supply: 20, fatigue: -14, morale: 7 }],
   ['Isolate stricken teams downstream and wash harnesses in lye', 60, { supply: 12, fatigue: -8 }],
   ['Keep moving briskly to outrun damp stable air', 0, { fatigue: 6, supply: -4, morale: -4 }]
  ]],
  ['Stubborn Captain Refuses to Cull', 'A proud knight refuses to let farriers put down his scarred favorite charger despite open sores.', [
   ['Compensate him generously with a royal stud horse immediately', 80, { morale: 9, prestige: 6, stability: 4 }],
   ['Confine his horse strictly to an isolated stone paddock', 30, { securityMonths: 6, stability: 4 }],
   ['Enforce quarantine orders cleanly over personal grief', 0, { legitimacy: 6, morale: -4 }]
  ]],
  ['Clean Oats & Vinegar Wash', 'Healthy pickets graze high dry pastures while vets scrub wooden mangers with lime and vinegar.', [
   ['Hire master farriers to write veterinary rules for camp', 55, { research: 8, supply: 12 }],
   ['Issue clean copper watering buckets per troop', 40, { fatigue: -10, supply: 10 }],
   ['Wait ten clear days before reuniting squadrons', 0, { fatigue: -6 }]
  ]],
  ['The Squadrons Ride Clean', 'Swift quarantine saves ninety percent of the cavalry train for summer maneuvers.', [
   ['Establish royal stud veterinary inspections', 60, { credit: 5, supply: 12, prestige: 5 }],
   ['Reward keen-eyed farriers', 25, { morale: 7 }],
   ['Lift stable quarantine cleanly', 0, { stability: 4 }]
  ]]
 );

 arc4('wd_dip_border_wedding_escort', 'Diplomacy', 'friendly',
  ['Bride’s Caravan Through the Passes', 'An allied noble bride rides toward your realm with chests of silver plate, drawing covetous eyes along bandit passes.', [
   ['Dispatch royal household knights in burnished steel to line the pass', 120, { relation: 14, prestige: 11, securityMonths: 8 }],
   ['Alert border sheriffs and light hillside watch-beacons', 55, { relation: 9, securityMonths: 7 }],
   ['Trust her father’s own large armed retinue', 0, { relation: 4, stability: 3 }]
  ]],
  ['Rockfall Above the Silver Chests', 'Loose shale tumbles across the narrow road; twenty masked riders whistle from stunted oaks.', [
   ['Charge up the slope with royal crossbows and horn signals', 60, { prestige: 10, relation: 10, stability: 5 }],
   ['Form an iron wagon-ring until county cavalry arrives', 30, { securityMonths: 7, relation: 7 }],
   ['Parley briefly while wagons back down to open meadow', 0, { stability: 4, relation: 3 }]
  ]],
  ['Festival Lanterns at the Capital Gate', 'Cheering citizens shower rose-water and ribbon favors as the unscathed procession glides beneath banners.', [
   ['Host three days of open-air music and fountain wine', 95, { prestige: 11, relation: 12, stability: 7 }],
   ['Hold a dignified cathedral blessing and noble supper', 45, { piety: 8, relation: 8 }],
   ['Receive the bride warmly inside the palace hall', 0, { relation: 6, prestige: 5 }]
  ]],
  ['Songs of Two Allied Houses', 'Minstrels weave the safe journey into wedding ballads sung across both kingdoms.', [
   ['Mint silver bridal keepsakes for both courts', 50, { prestige: 9, relation: 9 }],
   ['Clear the bandit pass permanently with a stone watchpost', 65, { securityMonths: 9, credit: 5 }],
   ['Close the celebratory week', 0, { stability: 4 }]
  ]]
 );

 arc4('wd_war_gunpowder_accident', 'Military', 'crossroads_gunpowder',
  ['Sparks Beside the Powder Mill', 'A careless apprentice drops an iron lantern inside the drying shed; roof tiles explode skyward in thunderous white smoke.', [
   ['Rebuild with banked earth blast-walls and copper tools', 140, { development: 1, research: 9, trust: 8 }],
   ['Move powder drying huts two miles outside town walls', 65, { trust: 9, securityMonths: 8, unrest: -6 }],
   ['Patch the shed roof and forbid iron lanterns after dusk', 0, { stability: 4, unrest: 2 }]
  ]],
  ['Neighbors Demand Mill Relocation', 'Terrified townsfolk gather outside guildhalls demanding all saltpeter vats leave city limits immediately.', [
   ['Compensate guild smiths and fund isolated riverside water-mills', 95, { development: 1, trust: 10, credit: 6 }],
   ['Build thick brick containment vaults and wet-hide shutters', 50, { research: 7, trust: 6 }],
   ['Reassure burghers while keeping royal arsenals guarded', 0, { securityMonths: 7, unrest: 3 }]
  ]],
  ['Safer Granulation Formula', 'A surviving master chemist develops wet-cake pressing that cuts friction sparks dramatically.', [
   ['Sponsor his royal patent and publish safety rules for every foundry', 75, { research: 12, prestige: 8, credit: 5 }],
   ['Adopt wet-pressing cleanly inside crown powder houses', 35, { securityMonths: 8, tools: 14 }],
   ['Reward the chemist quietly with silver', 0, { prestige: 5, research: 4 }]
  ]],
  ['Safe Powder, Quiet Neighborhoods', 'New earthen-bermed water-mills double output without frightening a single street.', [
   ['Inspect every county powder vault twice yearly', 45, { securityMonths: 9, legitimacy: 6 }],
   ['Pension families hurt in the old blast', 40, { trust: 9, piety: 5 }],
   ['Archive the safety ordinances', 0, { stability: 4 }]
  ]]
 );

 arc4('wd_dip_map_ambassador', 'Diplomacy', 'crossroads_oceanic',
  ['Stolen Sea-Rutter Charts', 'Harbor guards catch a foreign clerk paying tavern gold to copy secret coastal shoal charts from a royal pilot’s chest.', [
   ['Arrest the clerk quietly and issue altered decoy soundings', 85, { securityMonths: 10, prestige: 6 }],
   ['Expel the foreign clerk publicly and tighten pilot-house locks', 40, { legitimacy: 7, securityMonths: 8 }],
   ['Publish accurate charts boldly to invite open merchant trade', 0, { credit: 9, acceptance: 6, prestige: 5 }]
  ]],
  ['Diplomatic Furor Over Arrest', 'The foreign ambassador storms the palace demanding his clerk’s release under sacred embassy privilege.', [
   ['Hand over his clerk at the quay while banning him for life', 40, { legitimacy: 7, securityMonths: 7, credit: 4 }],
   ['Negotiate quiet exchange for imprisoned native sailors abroad', 55, { prestige: 8, trust: 6 }],
   ['Hold firm that espionage voids diplomatic courtesy', 0, { legitimacy: 8, prestige: 5 }]
  ]],
  ['Pilots’ Brotherhood Cleans House', 'Shaken by the leak, senior harbor pilots propose swearing secret oaths and locking original rutters in bronze chests.', [
   ['Charter an official Hydrographic Vault with dual royal-guild keys', 80, { research: 10, securityMonths: 9, credit: 6 }],
   ['Reward the vigilant tavern guard who tipped off wardens', 30, { trust: 7, securityMonths: 6 }],
   ['Order routine quarterly chest audits', 0, { legitimacy: 5 }]
  ]],
  ['Mastery of the Soundings', 'Your realm’s coastal charts remain prized secrets—and reliable anchors for safe commerce.', [
   ['Fund brass dividers and lead-lines for pilot apprentices', 55, { research: 8, development: 1 }],
   ['Thank loyal mariners at the admiralty hall', 25, { prestige: 7 }],
   ['Close the admiralty security docket', 0, { stability: 4 }]
  ]]
 );

 arc4('wd_war_levy_shields', 'Military', 'vassal',
  ['Painted Shields & Muster Delays', 'Summoned county lords arrive three weeks late with rusty pikes and mismatched farm boys instead of armored men-at-arms.', [
   ['Accept silver scutage commutations and hire drilled professionals', 110, { credit: 7, legitimacy: 7, loyalty: 6 }],
   ['Hold a stern month-long field camp to drill their levies proper', 65, { loyalty: 5, stability: 5, tools: 14 }],
   ['Fine tardy barons sharply in open muster court', 0, { gold: 95, legitimacy: 6, loyalty: -7 }]
  ]],
  ['Quarrel Over Baggage Precedence', 'Proud county knights refuse to ride behind urban crossbowmen on the narrow approach road.', [
   ['Assign noble horse vanguard scouts and crossbowmen center guards', 45, { loyalty: 8, stability: 5 }],
   ['Clarify written order-of-march laws under royal marshal seal', 30, { legitimacy: 7, loyalty: 5 }],
   ['Order the column forward strictly by arrival hour', 0, { legitimacy: 5, loyalty: -3 }]
  ]],
  ['Skirmish Proves the Urban Crossbows', 'When brigands probe the flank, steady urban crossbow volleys drop six riders before nobles even level lances.', [
   ['Praise both urban companies and knightly horse publicly', 50, { prestige: 8, trust: 8, loyalty: 6 }],
   ['Award silver-tipped bolts to the crossbow guild', 35, { credit: 5, trust: 7 }],
   ['Note the lesson quietly for army reform', 0, { research: 6 }]
  ]],
  ['Unified Muster Ordinances', 'Clear crown muster rules blend aristocratic horse and urban shot without petty rank feuds.', [
   ['Publish unified Shire Muster Rolls for all estates', 60, { legitimacy: 8, loyalty: 7 }],
   ['Endow parish target grounds cleanly', 45, { development: 1, trust: 6 }],
   ['Dismiss the muster review', 0, { stability: 4 }]
  ]]
 );

 arc4('wd_dip_tribute_salt', 'Diplomacy', 'tributeDebt',
  ['Salt Caravans Halted at the Oasis', 'A desert tributary chief withholds agreed camel remounts, complaining raiders looted his outer wells without crown aid.', [
   ['Send light camelry escorts and silver well-lining funds', 120, { relation: 15, securityMonths: 8, stability: 6 }],
   ['Forgive this quarter’s remounts so he can hire local scouts', 45, { relation: 11, legitimacy: 4 }],
   ['Insist on half the remounts immediately under treaty oath', 0, { prestige: 6, relation: -6 }]
  ]],
  ['Well-Water Runs Clear Again', 'Cleaned desert cisterns draw grateful clans back to peaceful watering troughs.', [
   ['Sponsor a shared truce feast beneath oasis palms', 65, { relation: 12, food: 35, prestige: 6 }],
   ['Station two permanent courier tents at the oasis', 35, { securityMonths: 7, relation: 6 }],
   ['Collect overdue camel tallies quietly', 0, { credit: 5, relation: 4 }]
  ]],
  ['Raider Envoy Captured', 'Oasis scouts deliver a rival agitator caught gifting iron spears to break the caravan peace.', [
   ['Send formal protests and proof across rival borders', 40, { prestige: 8, legitimacy: 7 }],
   ['Reward the loyal oasis chief with gilded robes', 55, { relation: 11, prestige: 7 }],
   ['Hold the agitator in frontier custody', 0, { securityMonths: 7 }]
  ]],
  ['Safe Caravan Bells', 'Silver bells chime across the dunes once more as tribute camels file through your southern gate.', [
   ['Confirm lower customs tolls for oasis dates and salt', 45, { credit: 8, relation: 9 }],
   ['Record the renewed oasis treaty', 20, { legitimacy: 5 }],
   ['Close the desert tribute file', 0, { stability: 4 }]
  ]]
 );

 arc4('wd_war_navy_pressgang', 'Military', 'unrest',
  ['Press-Gangs on the Tavern Steps', 'Desperate harbor captains snatch dockworkers out of taverns to man war-carracks, sparking stone-throwing riots along the fish market.', [
   ['End street impressment and offer fair signing bounties & pensions', 125, { unrest: -11, trust: 10, credit: 6 }],
   ['Establish orderly parish maritime ballots run by guildmasters', 55, { unrest: -6, legitimacy: 7, trust: 5 }],
   ['Send city pikemen to restore wharf quiet immediately', 0, { stability: 5, unrest: 5 }]
  ]],
  ['Guildmasters Offer Volunteer Crews', 'Relieved of blind press-gangs, merchant skippers offer one trained mariner per ten coastal boats.', [
   ['Accept the guild quota gratefully and waive harbor anchorage dues', 65, { trust: 9, credit: 8, unrest: -6 }],
   ['Guarantee wounded mariners care inside port hospitals', 45, { trust: 8, piety: 5 }],
   ['Register the volunteer rolls cleanly at customs', 0, { legitimacy: 6, stability: 4 }]
  ]],
  ['Mutinous Spark on the Flagship', 'Two pressed youths urge deckhands to refuse weighing anchor until ashore debts clear.', [
   ['Pay modest family allotment chits directly to wives ashore', 75, { trust: 10, stability: 7 }],
   ['Hear grievances calmly on the quarterdeck', 25, { legitimacy: 6, unrest: -4 }],
   ['Put ringleaders in irons and sail on the ebb', 0, { securityMonths: 6, unrest: 3 }]
  ]],
  ['Willing Hands at the Capstan', 'Chanting sailors haul anchor smoothly, knowing families ashore eat safely under royal allotment.', [
   ['Publish permanent Mariner Allotment Ordinances', 55, { legitimacy: 7, credit: 6, trust: 7 }],
   ['Bless the departing fleet from the pier', 25, { piety: 7, prestige: 5 }],
   ['Return wharf watches to normal', 0, { stability: 4 }]
  ]]
 );

 arc4('wd_dip_scholar_asylum', 'Diplomacy', 'hostile',
  ['Fugitive Chronicler at the Gate', 'A famous historian flees a hostile neighbor’s court carrying unpublished annals exposing uncomfortable succession secrets.', [
   ['Grant dignified royal asylum while forbidding provocative pamphlets', 85, { research: 10, prestige: 7, securityMonths: 7 }],
   ['House him discreetly in a university town without public fanfare', 45, { research: 8, stability: 5 }],
   ['Return him politely to avoid worsening border hostility', 0, { relation: 11, legitimacy: -3 }]
  ]],
  ['Angry Demands for His Trunk', 'Hostile envoys arrive demanding the chronicler’s leather trunk of state genealogies back under seal.', [
   ['Keep private letters sealed in neutral custody while sparing his life', 50, { legitimacy: 7, relation: 6, prestige: 6 }],
   ['Copy scholarly history openly and return purely private deeds', 35, { research: 7, relation: 8 }],
   ['Refuse foreign seizures on sovereign royal soil', 0, { prestige: 8, relation: -7 }]
  ]],
  ['University Lectures Crowd the Hall', 'Students flock to hear his lectures on statecraft and ancient treaties.', [
   ['Endow a permanent Chair of Diplomacy and History', 90, { research: 12, prestige: 9 }],
   ['Commission cleaned, balanced annals omitting inflammatory gossip', 40, { legitimacy: 8, stability: 5 }],
   ['Keep lectures restricted to senior clerks', 0, { securityMonths: 6 }]
  ]],
  ['Pen Mightier Than Rumor', 'Handled with restraint, the episode enriches your archives without sparking needless war.', [
   ['Bind the completed chronicles in gilded vellum', 40, { prestige: 8, legitimacy: 6 }],
   ['Send reassuring commercial letters across the border', 30, { relation: 7, credit: 4 }],
   ['Close the asylum dossier', 0, { stability: 4 }]
  ]]
 );

 arc4('wd_war_bastion_sally', 'Military', 'lowstability',
  ['Garrison Pay Riots in the Border Town', 'Unpaid fortress troops lock arms inside the market square, threatening to bar royal tax collectors from the citadel.', [
   ['Rush silver pay-chests and audit corrupt garrison captains', 130, { stability: 10, securityMonths: 8, trust: 8 }],
   ['Issue royal treasury bonds backed by upcoming salt revenues', 55, { stability: 6, credit: 5, legitimacy: 5 }],
   ['Order neighboring county levies to surround the square', 0, { legitimacy: 5, stability: -4, unrest: 4 }]
  ]],
  ['The Captain’s Double-Books', 'Auditors uncover fake names padded on pay rolls while common pikemen lived on moldy beans.', [
   ['Strip the corrupt captain and distribute his hoarded coin to ranks', 35, { stability: 8, trust: 9, legitimacy: 7 }],
   ['Try him publicly at the market cross before soldiers and burghers', 25, { legitimacy: 8, prestige: 6 }],
   ['Replace him quietly to avoid alarming border foes', 0, { securityMonths: 7, stability: 4 }]
  ]],
  ['Burghers Demand Market Guards', 'Shopkeepers rattled by soldier unrest ask for clear night curfews separating barracks from stalls.', [
   ['Build proper stone barracks kitchens inside the citadel walls', 85, { development: 1, stability: 8, trust: 7 }],
   ['Post mixed soldier-burgher night watches cleanly', 35, { stability: 6, securityMonths: 6 }],
   ['Enforce strict sundown horn curfews', 0, { stability: 5 }]
  ]],
  ['Discipline Returns to the Citadel', 'Regular pay and honest muster clerks restore calm pride along the ramparts.', [
   ['Establish quarterly independent pay inspections', 55, { legitimacy: 8, securityMonths: 8 }],
   ['Grant burghers modest compensation for broken stalls', 40, { trust: 8, unrest: -5 }],
   ['Close the garrison inquiry', 0, { stability: 4 }]
  ]]
 );

 arc4('wd_dip_coalition_grain', 'Diplomacy', 'friendly',
  ['Shared Fleet Against Corsair Havens', 'Two friendly maritime courts propose pooling twelve war-galleys to burn a notorious pirate base harassing all three flags.', [
   ['Commit four royal galleys and lead the joint expedition', 145, { relation: 16, prestige: 12, credit: 8 }],
   ['Supply salted rations, pitch, and gunners while allies steer', 75, { relation: 11, credit: 6 }],
   ['Protect home straits closely while cheering their sail', 0, { securityMonths: 7, relation: 3 }]
  ]],
  ['Arguments Over Admiralcy Pennant', 'Allied captains squabble inside the rendezvous bay over who leads the main column through the reef.', [
   ['Host captains aboard your flagship and agree on clear signal flags', 55, { relation: 10, prestige: 9, research: 5 }],
   ['Split the haven into three equal shore-assault sectors', 30, { relation: 8, stability: 5 }],
   ['Defer tactfully to the oldest sea-veteran present', 0, { relation: 9, prestige: 4 }]
  ]],
  ['Smoke Above the Corsair Mole', 'Synchronized broadsides shatter the harbor tower; freed merchant hulks hoist colors inside the bay.', [
   ['Divide rescued hulls fairly by flag of registry', 45, { relation: 12, credit: 9, prestige: 7 }],
   ['Burn remaining pirate slips to leave zero refuge', 25, { securityMonths: 9, prestige: 6 }],
   ['Rescue captive rowers immediately with wine and clothes', 0, { piety: 9, relation: 8 }]
  ]],
  ['Safe Sea-Lanes Celebrated', 'Insurance rates drop sharply across three kingdoms as fleets return laden with liberated wool and spice.', [
   ['Sign a permanent Tripartite Sea-Lane League', 65, { relation: 13, credit: 10 }],
   ['Hold a joint naval review off the capital harbor', 50, { prestige: 10, relation: 8 }],
   ['Archive the expedition logs', 0, { stability: 4 }]
  ]]
 );

 return out;
}
