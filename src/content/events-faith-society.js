/**
 * Sovereign: 1450 — Modular Content Pack: Faith, Scholarship, Intrigue & Dynasty Society
 * 65 multi-stage narrative chains (260 authored stages) covering monastic/temple endowments,
 * scholarly heresies, inquisitors, secret societies, royal physicians, astronomy & printing
 * debates, succession disputes, and courtly weddings & wards.
 */
export function faithSocietyEvents(E, C) {
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

 // === A. MONASTIC, TEMPLE & SANCTUARY ENDOWMENTS ===
 branch4('fs_mon_relic_shrine', 'Religion', 'institution',
  ['Cracked Roof Over the Pilgrim Shrine', 'Winter gales strip lead tiles off an ancient pilgrimage sanctuary; soaked frescoes peel while elders warn pious travelers away.', [
   ['Re-lead the vault, carve stone hostels, and pave pilgrim steps', 140, { piety: 13, faithAuthority: 9, trust: 9 }],
   ['Grant timber and slate from royal woods for modest local repairs', 65, { piety: 8, trust: 7, development: 1 }],
   ['Leave shrine upkeep to parish alms-boxes this season', 0, { piety: 3, faithAuthority: -3 }]
  ]],
  ['Miracle Rumors Fill the Courtyard', 'Dry vaulted arches reopen to cheering crowds; blind beggars claim spring fountain water clears dusty eyes.', [
   ['Appoint honest monastery stewards to log alms and healings calmly', 55, { piety: 10, legitimacy: 7, credit: 5 }],
   ['Build wide stone bread-ovens beside the fountain for poor pilgrims', 65, { food: 45, piety: 9, trust: 9 }],
   ['Keep celebrations orderly and dignified', 0, { stability: 5, piety: 5 }]
  ]],
  ['Pilgrims Quarrel Over Reliquary Offerings', 'Rival abbots dispute which altar chest receives wax and silver offerings from arriving caravans.', [
   ['Audit shrine ledgers cleanly and split revenue between roof and poor-kitchen', 55, { legitimacy: 8, faithAuthority: 7, trust: 7 }],
   ['Place the shrine under neutral crown visitor oversight', 30, { securityMonths: 7, faithAuthority: 5 }],
   ['Let elder clerics settle altar boundaries inside chapter hall', 0, { stability: 4, piety: 3 }]
  ]],
  ['Beacon of Living Devotion', 'Mended roofs and honest stewardship turn the sanctuary into a gentle anchor of civic charity.', [
   ['Endow a permanent sanctuary grammar school', 70, { research: 10, piety: 8 }],
   ['Receive blessed pilgrim medallions from the abbot', 25, { prestige: 7, piety: 6 }],
   ['Close the endowment roll', 0, { stability: 4 }]
  ]]
 );

 arc4('fs_mon_hospital_order', 'Religion', 'sanctuary',
  ['Lepers & Wanderers Outside the Sanctuary Gate', 'Sanctuary hospitallers shelter overflowing sick wanderers in leaky timber sheds, pleading for stone wards and clean linen.', [
   ['Build stone infirmary cloisters with clean cisterns and orchard beds', 145, { piety: 13, trust: 11, development: 1 }],
   ['Supply wool blankets, firewood, and regular grain carts', 75, { piety: 9, trust: 8, food: 30 }],
   ['Permit sanctuary alms collectors inside capital markets', 0, { piety: 5, credit: 3 }]
  ]],
  ['Novices Debate Medical Study vs Prayer', 'Younger monks copy Galenic herbals and pulse-charts, drawing scowls from austere elders insisting prayer alone belongs in cloisters.', [
   ['Patronize both reverent liturgy and careful empirical herbals', 65, { research: 10, piety: 8, faithAuthority: 6 }],
   ['Endow an abbey herbalist apothecary separated from chapel choir', 45, { research: 7, trust: 6 }],
   ['Keep cloister life centered strictly on prayer and bread doles', 0, { piety: 8, faithAuthority: 5 }]
  ]],
  ['Noble Ladies Volunteer Linen', 'Touched by royal charity, courtly women weave clean bandages and send preserved fruit jars to the sanctuary.', [
   ['Honor civic charity patrons at solemn winter court', 50, { prestige: 9, piety: 8, loyalty: 6 }],
   ['Match noble gifts with royal copper cooking cauldrons', 40, { trust: 8, tools: 12 }],
   ['Record donors cleanly in abbey memorial books', 0, { piety: 6 }]
  ]],
  ['Mercy Remembered Across Estates', 'Clean infirmary wards soften bitter class envy and lift crown standing among rich and poor alike.', [
   ['Confirm permanent sanctuary charter protections', 40, { legitimacy: 8, piety: 7 }],
   ['Plant healing willow avenues along sanctuary paths', 25, { trust: 6 }],
   ['Close the sanctuary grant', 0, { stability: 4 }]
  ]]
 );

 arc4('fs_mon_scriptorium', 'Religion', 'faith_christian',
  ['Mildew Threatens Ancient Parchment Vaults', 'Monastic librarians open damp oak chests and find priceless early chronicles and gospel leaves spotted with green mold.', [
   ['Build airy upper-floor scriptoria with glass windows and copyists', 130, { research: 12, piety: 10, prestige: 7 }],
   ['Supply dry cedar chests, quicklime, and bone scrapers immediately', 60, { research: 8, piety: 7 }],
   ['Move chests quietly beside dry abbey bakehouse chimneys', 0, { research: 4, piety: 4 }]
  ]],
  ['Young Scribes Discover Forgotten Land Deeds', 'While scraping palimpsests clean, copyists uncover ancient royal boundary charters buried under faded homilies.', [
   ['Present findings openly before county judges to clarify parish commons', 45, { legitimacy: 9, trust: 8 }],
   ['Reward the keen-eyed novices with fine ink-horns and vellum', 35, { research: 7, piety: 6 }],
   ['Seal sensitive old deeds safely inside chancery vaults', 0, { securityMonths: 7, legitimacy: 5 }]
  ]],
  ['Illumination vs Fast Printed Copies', 'Abbey elders debate buying a wooden printing press for parish missals versus preserving illuminated hand-calligraphy.', [
   ['Keep gold-leaf illumination for state codices while printing parish texts', 85, { research: 11, prestige: 9, piety: 7 }],
   ['Preserve traditional hand-copying strictly as sacred meditation', 30, { piety: 10, faithAuthority: 7 }],
   ['Allow university printers to copy non-liturgical abbey chronicles', 0, { research: 7, credit: 4 }]
  ]],
  ['Light Preserved From Forgotten Ages', 'Restored manuscripts fill dry oak shelves, drawing visiting scholars from distant kingdoms.', [
   ['Catalog the abbey library openly for royal tutors', 45, { research: 9, prestige: 6 }],
   ['Endow winter candle stipends for copyists', 30, { piety: 7 }],
   ['Seal the scriptorium ledgers', 0, { stability: 4 }]
  ]]
 );

 arc4('fs_mon_temple_pond', 'Religion', 'faith_dharmic',
  ['Silted Sacred Step-Tank Before Festival', 'Green algae and monsoon silt choke the granite steps of a revered temple reservoir weeks before ten thousand devotees arrive.', [
   ['Desilt the stone tank, mend carved pavilions, and feed crews cleanly', 135, { piety: 12, trust: 11, food: 55 }],
   ['Organize volunteer village guilds with royal iron baskets and spices', 65, { piety: 8, trust: 9, tools: 14 }],
   ['Clear main bathing steps immediately and fence muddy corners', 0, { piety: 5, stability: 4 }]
  ]],
  ['Poet-Saints Sing at the Ghat', 'Vernacular devotional singers gather nightly on the cleaned steps, drawing artisans and weavers away from rigid caste gates.', [
   ['Patronize vernacular devotional hymns alongside classical Sanskrit texts', 65, { acceptance: 10, piety: 9, prestige: 7 }],
   ['Host peaceful philosophical dialogues inside the outer mandapa', 40, { research: 8, acceptance: 7 }],
   ['Keep festival liturgy strictly within temple priestly custom', 0, { faithAuthority: 8, stability: 5 }]
  ]],
  ['Sacred Kitchens Feed Thousands', 'Steaming brass cauldrons of rice and lentils serve pilgrims regardless of coin, stretching temple granaries thin.', [
   ['Donate royal paddy-rice carts to fill the temple free kitchen', 80, { food: -25, piety: 11, trust: 11 }],
   ['Grant nearby irrigated garden plots tax-free to temple kitchens', 50, { food: 45, piety: 8, legitimacy: 6 }],
   ['Encourage wealthy merchant guilds to sponsor feast evenings', 0, { credit: 6, piety: 6 }]
  ]],
  ['Lanterns Reflected on Clear Water', 'Thousands of floating clay lamps shimmer across restored granite water, binding dynasty and devotion warmly.', [
   ['Carve royal donation inscriptions onto the pavilion pillar', 40, { legitimacy: 8, prestige: 8 }],
   ['Keep clean masonry maintenance crews year-round', 35, { development: 1, trust: 6 }],
   ['Close the festival endowment', 0, { stability: 4 }]
  ]]
 );

 arc4('fs_mon_waqf_madrasa', 'Religion', 'faith_islamic',
  ['Crumbling Courtyard of the Madrasa Waqf', 'Waqf endowments supporting a famed mosque-college dwindled after drought hit orchard rents, leaving geometry students without oil lamps.', [
   ['Endow fresh stone bazaar shops permanently into the charitable waqf', 145, { research: 12, piety: 12, development: 1 }],
   ['Grant direct silver stipends for jurists, astronomers, and poor scholars', 75, { research: 10, piety: 9, trust: 7 }],
   ['Repair leaking dome tiles first and trim scholar stipends slightly', 0, { piety: 6, stability: 4 }]
  ]],
  ['Disputed Waqf Orchard Boundaries', 'A neighboring landlord fences off irrigated fig trees belonging to the school endowment, citing lost deeds.', [
   ['Convene qadi judges openly to inspect old boundary markers fairly', 45, { legitimacy: 9, faithAuthority: 8, trust: 7 }],
   ['Purchase adjacent plots cleanly to end boundary friction forever', 80, { loyalty: 7, piety: 8, food: 30 }],
   ['Restore ancient waqf stone cairns by royal decree', 0, { legitimacy: 7, loyalty: -4 }]
  ]],
  ['Brass Astrolabes & Calligraphy', 'Revived lectures attract physicians and astronomers casting star-tables beside patient calligraphers.', [
   ['Commission accurate prayer-time and latitude tables for sea captains', 70, { research: 11, credit: 6 }],
   ['Host an open public debate on legal equity and market weights', 40, { trust: 8, legitimacy: 6 }],
   ['Collect finished manuscripts for the royal library', 0, { prestige: 7, research: 5 }]
  ]],
  ['Lamps Burning Through the Night', 'Restored waqf revenues anchor scholarship, charity, and legal integrity for generations.', [
   ['Confirm inviolable charitable waqf protections in royal registers', 40, { legitimacy: 8, piety: 8 }],
   ['Attend Friday sermons at the restored courtyard', 25, { prestige: 7, piety: 6 }],
   ['Close the waqf inquiry', 0, { stability: 4 }]
  ]]
 );

 arc4('fs_mon_sacred_grove', 'Religion', 'faith_traditions',
  ['Axes Near the Ancestral Spirit Grove', 'Timber contractors mark ancient sacred oaks and cedar groves for shipyard felling, sparking furious alarm among village elders and shamans.', [
   ['Forbid felling in ancestral groves permanently and plant timber plantations', 110, { piety: 12, trust: 11, acceptance: 9 }],
   ['Redirect shipwrights cleanly to storm-felled and upland pines', 55, { tools: 14, piety: 8, trust: 7 }],
   ['Permit harvesting only outer dry boundary limbs after elder rites', 0, { piety: 5, tools: 8, stability: 4 }]
  ]],
  ['Elders Offer Blessings at the Spring', 'Grateful ritual keepers invite royal envoys to share spring-water rites beneath towering mossy boughs.', [
   ['Present ceremonial bronze bowls and protect sacred springs by charter', 65, { piety: 10, legitimacy: 8, acceptance: 8 }],
   ['Record oral clan boundary lore respectfully into royal court annals', 40, { research: 7, trust: 8 }],
   ['Receive elder blessings quietly with salt and linen gifts', 0, { piety: 6, trust: 5 }]
  ]],
  ['Wild Herbs & Bees Thrive Under Canopy', 'Protected ancient groves shelter rare medicinal roots and wild honeycombs relied on by village midwives.', [
   ['Allow sustainable parish herb gathering under elder guardianship', 40, { food: 40, trust: 8, research: 5 }],
   ['Post forest wardens to shield groves from poachers', 35, { securityMonths: 7, piety: 5 }],
   ['Leave grove stewardship strictly to village keepers', 0, { acceptance: 6 }]
  ]],
  ['Living Roots of Peace', 'Honoring sacred landscapes turns distrustful border folk into steadfast guardians of realm peace.', [
   ['Inscribe Grove Sanctuary Boundaries in county maps', 40, { legitimacy: 7, trust: 7 }],
   ['Host an autumn forest thanksgiving feast', 30, { food: -15, trust: 8, prestige: 5 }],
   ['Close the forestry accord', 0, { stability: 4 }]
  ]]
 );

 // === B. SCHOLARLY HERESIES, TRANSLATIONS & SYNODS ===
 branch4('fs_her_vernacular_scripture', 'Religion', 'faithTension',
  ['Smuggled Vernacular Scripture Sheets', 'Town printers circulate beloved local-tongue translations of sacred texts; rigid clerics demand burning every sheet while artisans read eagerly by candlelight.', [
   ['License scholar-checked vernacular editions under royal & synod seal', 115, { acceptance: 12, research: 10, trust: 9 }],
   ['Permit licensed parish sermons in local tongue while keeping Latin/classical altars', 55, { acceptance: 8, stability: 7, faithAuthority: 4 }],
   ['Confiscate unlicensed translations cleanly to avert doctrinal schism', 0, { faithAuthority: 9, piety: 6, unrest: 4 }]
  ]],
  ['Crowds Fill Quiet Evening Readings', 'Shoemakers and mothers listen tearfully as clear native words replace half-understood chants.', [
   ['Print simple moral catechisms alongside village literacy primers', 70, { research: 10, trust: 9, piety: 7 }],
   ['Appoint respected moderate prelates to answer honest questions', 40, { faithAuthority: 7, stability: 6 }],
   ['Ensure licensed editions carry clear orthodox notes', 0, { legitimacy: 6, faithAuthority: 5 }]
  ]],
  ['Sermon Brawls Outside Abbey Doors', 'Zealous apprentices hurl cobbles at abbey steps, crying out against locked books and proud prelates.', [
   ['Convene a calm public synod hearing both guild readers and bishops', 80, { stability: 8, acceptance: 9, faithAuthority: 5 }],
   ['Post watchmen around churches and forbid street preaching brawls', 30, { securityMonths: 8, stability: 6 }],
   ['Arrest riot ringleaders regardless of creed', 0, { legitimacy: 6, unrest: -4 }]
  ]],
  ['Peaceful Devotion in Clear Tongues', 'Measured royal leadership averts bloody sectarianism while deepening popular faith and literacy.', [
   ['Publish a Charter of Orderly Devotion and Print', 50, { legitimacy: 8, acceptance: 8 }],
   ['Reward calm pastoral prelates', 25, { piety: 7, trust: 5 }],
   ['Close the synod session', 0, { stability: 4 }]
  ]]
 );

 arc4('fs_her_inquisitor_zeal', 'Religion', 'lowFaithAuthority',
  ['Overzealous Inquisitor Shakes Market Town', 'An austere wandering inquisitor accuses respected cloth merchants of secret heresy on thin tavern rumors, rattling bourses.', [
   ['Require open civil-magistrate witness and two sober accusers per charge', 95, { legitimacy: 9, trust: 10, credit: 7 }],
   ['Recall the fiery friar politely to cloister duties and send gentle scholars', 50, { stability: 8, acceptance: 8, faithAuthority: 5 }],
   ['Back the inquisitor firmly to shore up battered clerical authority', 0, { faithAuthority: 9, piety: 6, unrest: 5 }]
  ]],
  ['Confiscated Ledgers Reveal Land Grab', 'Magistrates uncover that three false accusations came straight from a cousin hoping to seize accused merchants’ wool looms.', [
   ['Punish false accusers publicly with the exact penalty they sought', 40, { legitimacy: 11, trust: 11, securityMonths: 7 }],
   ['Restore seized looms immediately and dismiss biased clerks', 35, { credit: 8, trust: 9 }],
   ['Seal the scandal quietly inside bishopric courts', 0, { faithAuthority: 5, stability: 4 }]
  ]],
  ['Prelates Debate Limits of Zeal', 'Responsible bishops thank the crown privately, admitting unchecked informers stain true faith.', [
   ['Publish clear Evidentiary Rules for Ecclesiastical Courts', 55, { legitimacy: 9, faithAuthority: 7, research: 5 }],
   ['Endow calm pastoral preaching fellowships in towns', 45, { piety: 9, acceptance: 7 }],
   ['Keep mixed clerical-royal oversight boards active', 0, { securityMonths: 7, stability: 5 }]
  ]],
  ['Justice Shields True Faith', 'Fair trials banish fear from market lanes while restoring clean moral respect to honest clergy.', [
   ['Confirm due-process statutes across province courts', 40, { legitimacy: 8, trust: 7 }],
   ['Hold a reconciling civic prayer service', 25, { piety: 7, stability: 5 }],
   ['Close the tribunal inquiry', 0, { stability: 4 }]
  ]]
 );

 arc4('fs_her_synod_calendar', 'Religion', 'faithDebate',
  ['Disputed Festival Dates Divide Clergy', 'Astronomers prove spring equinox drifted ten days from ancient lunar-solar tables, splitting traditionalists and calculators over holy feast dates.', [
   ['Convene royal astronomers and elders to reconcile tables gently', 105, { research: 10, faithAuthority: 7, prestige: 7 }],
   ['Respect local feast customs while adopting accurate tables for tax calendars', 45, { stability: 7, credit: 5 }],
   ['Uphold ancient liturgical tables strictly without alteration', 0, { faithAuthority: 8, piety: 6, stress: 2 }]
  ]],
  ['Rival Bells Ring a Week Apart', 'Neighboring parishes celebrate solemn fasting and joyful feasting on the same Tuesday, confusing market carters.', [
   ['Issue clear unified civic market calendars while synod deliberates', 50, { stability: 8, credit: 6 }],
   ['Sponsor open mathematical proofs inside the cathedral square', 45, { research: 9, prestige: 6 }],
   ['Urge rural priests quietly to follow capital cathedral bells', 0, { legitimacy: 6, faithAuthority: 5 }]
  ]],
  ['Compromise of the Brass Armillary', 'Elders and astronomers craft an elegant intercalary adjustment keeping sacred symbolism intact beside true stars.', [
   ['Print new unified liturgical-and-harvest almanacs nationwide', 70, { research: 9, legitimacy: 8, food: 30 }],
   ['Gift brass armillary spheres to cathedral observatories', 55, { prestige: 9, research: 8 }],
   ['Archive the synod compromise cleanly', 0, { faithAuthority: 6, stability: 5 }]
  ]],
  ['One Heaven, Shared Seasons', 'Restored calendar harmony aligns planting, fairs, and holy bells cleanly across the realm.', [
   ['Inscribe the reformed calendar stone in the main plaza', 40, { prestige: 8, legitimacy: 6 }],
   ['Thank elder scholars and clerics alike', 20, { piety: 6, stress: -5 }],
   ['Close the calendar synod', 0, { stability: 4 }]
  ]]
 );

 arc4('fs_her_minority_quarter', 'Religion', 'difference',
  ['Bells & Calls Above Shared Cobbles', 'Residents of a hillside quarter argue fiercely over festival processions crossing narrow streets beside another faith’s prayer hall.', [
   ['Mediate clear street-hour accords and shared civic festival guards', 90, { acceptance: 12, trust: 10, unrest: -8 }],
   ['Widen the central plaza cleanly so both processions pass without jostling', 110, { development: 1, acceptance: 10, trust: 8 }],
   ['Confirm majority procession precedence while guarding minority doors', 0, { securityMonths: 7, stability: 5, acceptance: -2 }]
  ]],
  ['Shared Well Runs Dry in Summer', 'Despite doctrinal arguments, both neighborhoods share one ancient hillside cistern that drops dangerously low in August.', [
   ['Build a twin stone cistern feeding both quarters cleanly', 95, { development: 1, food: 40, acceptance: 11 }],
   ['Install joint neighborhood water-stewards chosen by both elders', 35, { trust: 9, acceptance: 9 }],
   ['Enforce equal alternating draw-hours at existing gates', 0, { stability: 6, trust: 5 }]
  ]],
  ['Fire Breaks Out Near the Bakery', 'When sparks catch timber eaves near the border alley, youths from both faiths form a single frantic bucket brigade.', [
   ['Reward heroic neighbors jointly with bronze civic medals', 45, { acceptance: 11, prestige: 8, trust: 9 }],
   ['Rebuild burnt timber eaves in fireproof brick cleanly', 70, { development: 1, stability: 7 }],
   ['Praise shared civic courage in royal proclamation', 0, { trust: 7, acceptance: 6 }]
  ]],
  ['Neighborhood Pact of Peace', 'Shared danger and fresh spring water bind former strangers into watchful, courteous neighbors.', [
   ['Seal the Inter-Quarter Accord in city halls', 40, { legitimacy: 8, acceptance: 8 }],
   ['Host a shared harvest supper in the widened plaza', 35, { trust: 8, food: -15 }],
   ['Close the neighborhood commission', 0, { stability: 4 }]
  ]]
 );

 // === C. SECRET SOCIETIES, SPY RINGS & INTRIGUE ===
 branch4('fs_sec_hollow_key', 'Intrigue', 'activePlot',
  ['Wax Impression Under the Velvet Cushion', 'An agent brings a soft beeswax mold of a target chamberlain’s brass study key, lifted cleanly during a banquet toast.', [
   ['Cast a quiet duplicate key and place loyal listeners inside his study', 95, { plotPreparation: 12, securityMonths: 8 }],
   ['Trace who else has access to his private desk before acting', 45, { plotPreparation: 8, stress: 3 }],
   ['Burn the wax impression rather than risk deep palace scandal', 0, { stress: -5, legitimacy: 4 }]
  ]],
  ['Ciphered Ledger Inside the Desk', 'Midnight candle-inspection reveals coded payments to foreign factor houses hidden behind wine bills.', [
   ['Copy every cipher page cleanly without disturbing a single quill', 55, { plotPreparation: 12, securityMonths: 9 }],
   ['Plant a subtle false tally sheet to bait his next move', 25, { plotPreparation: 9, stress: 3 }],
   ['Lock the cabinet swiftly before the footman’s footsteps pass', 0, { securityMonths: 6, plotPreparation: 4 }]
  ]],
  ['Suspicious Locksmith Talks in Wine', 'Rumors reach your spymaster that the brass-smith who cut the blank key is bragging in an alley tavern.', [
   ['Pay him handsomely to take a quiet frontier fortress post immediately', 75, { securityMonths: 9, plotPreparation: 7 }],
   ['Buy out his whole workshop silence with steady palace locks', 40, { securityMonths: 8, stability: 4 }],
   ['Confine him quietly on trumped-up debt until the scheme closes', 0, { securityMonths: 7, stress: 4 }]
  ]],
  ['Invisible Hand on the Latch', 'Your network moves through locked chambers unseen, holding clean proof when the hour strikes.', [
   ['Archive copied ciphers inside the privy steel chest', 40, { plotPreparation: 10, securityMonths: 7 }],
   ['Reward silent operatives discreetly', 30, { prestige: 4, stress: -4 }],
   ['Seal the operational ledger', 0, { stability: 4 }]
  ]]
 );

 arc4('fs_sec_whisper_society', 'Intrigue', 'detectedPlot',
  ['Silver-Owl Rings on Noble Fingers', 'Counter-spies spot identical silver owl signets worn discreetly inside sleeves by minor lords and foreign couriers.', [
   ['Infiltrate the owl lodge with a trusted double-agent before arresting anyone', 105, { securityMonths: 11, stability: 6 }],
   ['Summon minor signet-holders individually to quiet loyal interviews', 50, { securityMonths: 8, legitimacy: 6 }],
   ['Outlaw secret oath-societies publicly across the capital', 0, { legitimacy: 7, securityMonths: 6, stress: 3 }]
  ]],
  ['Secret Lodge Below the Apothecary', 'Your double-agent descends stone cellar steps where masked figures swear blood-oaths over crossed daggers and tax maps.', [
   ['Map every masked voice and foreign patron cleanly before moving', 65, { securityMonths: 10, prestige: 6 }],
   ['Intercept their courier bags leaving town gates tonight', 30, { securityMonths: 8, gold: 45 }],
   ['Wait calmly till their own treasurer splits from greed', 0, { securityMonths: 6, stress: 3 }]
  ]],
  ['Ringleader Drops the Mask', 'Midnight torches surround the apothecary cellar, seizing chests of foreign gold and signed treason pledges.', [
   ['Execute only hardened foreign hirers and pardon misled youths quietly', 45, { legitimacy: 9, stability: 8, securityMonths: 9 }],
   ['Hold silent privy trials to protect royal dignity from open gossip', 25, { securityMonths: 9, prestige: 5 }],
   ['Parade traitors through market squares as stark warning', 0, { legitimacy: 8, prestige: 6 }]
  ]],
  ['Owls Scattered at Sunrise', 'Dissolved without bloody civil riot, the secret cabal’s foreign silver ends up safely inside crown coffers.', [
   ['Install permanent ciphered gate-watches at capital inns', 55, { securityMonths: 9 }],
   ['Promote the sharp double-agent quietly', 30, { stability: 5, stress: -5 }],
   ['Close the cabal dossier', 0, { legitimacy: 4 }]
  ]]
 );

 arc4('fs_sec_blackmail_scroll', 'Intrigue', 'knownSecret',
  ['Anonymous Note Under the Pillow', 'An ink-stained sheet slipped beneath a privy chamberlain’s pillow names a tightly held court secret—demanding five hundred florins at the bridge.', [
   ['Set a lantern trap at the bridge with silent royal guards', 85, { securityMonths: 11, stability: 6 }],
   ['Pay marked coins coated in walnut dye to trace the blackmailer’s lair', 60, { securityMonths: 10, prestige: 5 }],
   ['Pre-empt the blackmailer by managing a dignified controlled confession', 0, { legitimacy: 7, stress: -8, prestige: -2 }]
  ]],
  ['Footsteps on the Wet Cobbles', 'At midnight bells, a hooded clerk scoops up the leather purse—only to walk straight into silent halberdiers.', [
   ['Question him calmly to expose who leaked the palace paper', 45, { securityMonths: 10, stability: 6 }],
   ['Track his accomplice back to a crooked chancery copyist', 30, { securityMonths: 9, legitimacy: 6 }],
   ['Throw him straight into deep citadel cells', 0, { securityMonths: 7, stress: 2 }]
  ]],
  ['Traitorous Chancery Copyist Caught', 'Trembling, a junior scribe confesses copying discarded wax drafts from brazier ashes for tavern debts.', [
   ['Install iron document-burning stoves inside every privy office', 60, { securityMonths: 10, research: 5 }],
   ['Raise honest scribe stipends and audit tavern debts annually', 45, { legitimacy: 7, securityMonths: 7 }],
   ['Dismiss suspect clerks cleanly and tighten key rings', 0, { securityMonths: 6 }]
  ]],
  ['Sealed Lips & Iron Stoves', 'With burnt-draft security locked tight, secret statecraft stays inside trusted chambers.', [
   ['Issue new Privy Chancery Security Rules', 35, { legitimacy: 7, securityMonths: 7 }],
   ['Reward loyal guards quietly', 20, { stability: 5, stress: -4 }],
   ['Close the blackmail file', 0, { stability: 4 }]
  ]]
 );

 arc4('fs_sec_rival_lampoon', 'Intrigue', 'courtRival',
  ['Mocking Woodcuts Pasted on Palace Pillars', 'Dawn guards scrape scurrilous woodcut cartoons lampooning your court policies off cathedral doors—clearly funded by a smiling court rival.', [
   ['Outwit him with sharp royal wit and expose his unpaid tailor bills', 75, { prestige: 10, opinion: 8, stability: 5 }],
   ['Hire honest watchmen to trace the secret wooden press at midnight', 55, { securityMonths: 9, legitimacy: 6 }],
   ['Tear down sheets calmly and invite the rival to council face-to-face', 0, { opinion: 10, stress: -4, prestige: 4 }]
  ]],
  ['Laughter Turns Against the Joker', 'As court poets circulate clever counter-verses, your rival turns crimson at the royal supper table.', [
   ['Offer him a gracious toast inviting loyal service over petty ink', 50, { opinion: 15, stability: 7 }],
   ['Press the advantage with sharper satires until he apologizes', 25, { prestige: 9, opinion: -6 }],
   ['Turn conversation smoothly to frontier roads', 0, { stability: 5, stress: -4 }]
  ]],
  ['The Rival Extends an Olive Branch', 'Chastened—or wary of deeper exposure—your rival quietly offers to back an unpopular tax reform at tomorrow’s council.', [
   ['Welcome his support warmly and pair him onto useful public works', 55, { opinion: 14, stability: 7 }],
   ['Accept his vote coolly while keeping secret watchers sharp', 25, { securityMonths: 7, legitimacy: 6 }],
   ['Let deeds prove loyalty before granting favors', 0, { legitimacy: 5 }]
  ]],
  ['Ink Dried Without Blood', 'Turned from biting lampoons into working council compromise, court dignity holds steady.', [
   ['Sponsor open court theater honoring realm unity', 45, { prestige: 8, stability: 6 }],
   ['Reward loyal wits and poets', 25, { prestige: 6, stress: -5 }],
   ['Close the pamphlet incident', 0, { stability: 4 }]
  ]]
 );

 // === D. ROYAL PHYSICIANS, MEDICINE & WELLBEING ===
 branch4('fs_med_fever_chamber', 'Family', 'illness',
  ['Pale Shadows in the Sickroom', 'A sudden marsh-fever leaves an ailing royal kinsman shivering beneath fur coverlets while two schools of physicians argue beside the bed.', [
   ['Summon famed empirical physicians with clean broths and willow bark', 115, { health: -18, stress: -6, prestige: 5 }],
   ['Follow gentle rest, warm citrus infusions, and airy sunlit windows', 50, { health: -12, stress: -4 }],
   ['Trust traditional vigorous bloodletting and heavy bed-curtains', 0, { health: -4, piety: 4, stress: 3 }]
  ]],
  ['Pulse Steadies Before Dawn', 'Cooling vinegar cloths and bitter willow infusions break the burning fever cleanly by the third night.', [
   ['Endow the physician’s medical lectures and herbariums', 80, { research: 11, health: -10, prestige: 7 }],
   ['Keep calm quiet convalescence in sunny garden pavilions', 35, { health: -8, stress: -6 }],
   ['Reward the nurses with gold pieces', 0, { piety: 6, health: -5 }]
  ]],
  ['Relapse Sparks Kitchen Panic', 'Whispered panic blames damp palace drains or stale spiced wines for lingering weakness.', [
   ['Clean palace stone drains and boil all sickroom drinking water', 70, { health: -14, research: 6, stability: 5 }],
   ['Bring respected abbey infirmarians to tend round the clock', 45, { health: -10, piety: 8 }],
   ['Keep court visitors far from the quiet wing', 0, { securityMonths: 6, health: -6 }]
  ]],
  ['Walks in the Sunny Orchard', 'Lean yet smiling, the patient steps onto sunlit terrace gravel once more amid grateful court applause.', [
   ['Establish a permanent Salaried Court Physician Office', 60, { research: 8, health: -8, stability: 5 }],
   ['Offer thanksgiving alms at the palace chapel', 30, { piety: 9 }],
   ['Close the sickroom watch', 0, { stress: -6 }]
  ]]
 );

 arc4('fs_med_anatomy_debate', 'Culture & Learning', 'research',
  ['Secret Dissections in the Ice Cellar', 'Medical masters petition for formal royal license to dissect executed felons inside winter halls to map arteries and tendons.', [
   ['Grant licensed winter anatomy halls with respectful burial rites afterward', 115, { research: 15, prestige: 8, acceptance: 5 }],
   ['Limit anatomical study strictly to animal specimens and wound observation', 45, { research: 8, faithAuthority: 7 }],
   ['Forbid human dissections cleanly out of reverence for the dead', 0, { piety: 10, faithAuthority: 8 }]
  ]],
  ['Conservative Prelates Protest at Gate', 'Angry preachers denounce scalpels as desecration of sacred flesh, drawing crowds to university gates.', [
   ['Show reverent burial prayers and demonstrate life-saving hernia surgery', 65, { research: 10, piety: 6, trust: 7 }],
   ['Restrict anatomy lectures strictly to sworn senior surgeons', 35, { securityMonths: 7, research: 7 }],
   ['Pause public demonstrations while scholars compile wound drawings', 0, { stability: 6, faithAuthority: 5 }]
  ]],
  ['Engraved Copper Anatomical Plates', 'Surgeons collaborate with master woodcut artists to print crisp lifelike plates of bones and veins.', [
   ['Print clean surgical manuals for royal field army doctors', 80, { research: 12, prestige: 8 }],
   ['Deposit gilded copies in cathedral and university libraries', 40, { research: 8, prestige: 7 }],
   ['Sell numbered medical plates to foreign scholars', 0, { gold: 80, research: 5 }]
  ]],
  ['Healing Hands Guided by Sight', 'Accurate anatomical knowledge slashes clumsy field amputations and elevates native medicine across continents.', [
   ['Charter a Royal College of Surgeons and Physicians', 65, { research: 11, legitimacy: 7 }],
   ['Reward pioneering illustrators', 25, { prestige: 7 }],
   ['Close the medical charter inquiry', 0, { stability: 4 }]
  ]]
 );

 arc4('fs_med_stress_retreat', 'Family', 'highStress',
  ['Sleepless Nights Over Unending Petitions', 'Exhausted by endless ledgers, whispering courtiers, and grim frontier couriers, your temples throb beside guttering candles.', [
   ['Ride quietly to a lakeside hunting lodge for ten days of music and air', 100, { stress: -26, prestige: 4, stability: 4 }],
   ['Delegate routine minor warrants to trusted councillors for two weeks', 40, { stress: -18, legitimacy: 4 }],
   ['Drink bitter tonic infusions and push straight through the stack', 0, { stress: -6, research: 4 }]
  ]],
  ['Quiet Pine Trails & Falcon Bells', 'Far from clattering spurs, wind through pine needles and gentle river oars clears fog from tired judgment.', [
   ['Invite a few old companions for honest unguarded counsel by hearthfire', 55, { stress: -14, stability: 6 }],
   ['Spend mornings sketching birds and reading calm poetry alone', 20, { stress: -12, research: 5 }],
   ['Dictate crisp brief priorities for winter council', 0, { legitimacy: 6, stress: -6 }]
  ]],
  ['An Urgent Courier Trots Up the Lane', 'A mud-splashed rider arrives bearing minor border tax disputes that frightened clerks dared not decide alone.', [
   ['Empower local magistrates cleanly so every pebble skips the throne', 45, { legitimacy: 8, stress: -10, stability: 5 }],
   ['Sign crisp three-line rulings in ink and send him back at dawn', 20, { prestige: 5, stress: -6 }],
   ['Let the senior council steward handle routine tax appeals', 0, { stability: 5, stress: -8 }]
  ]],
  ['Clear Eyes Return to Council', 'Rested and decisive, you re-enter the Great Hall cutting cleanly through months of tangled business.', [
   ['Streamline daily audience hours cleanly for lasting health', 35, { stability: 7, stress: -10 }],
   ['Thank loyal stewards who held the fort', 20, { prestige: 6 }],
   ['Resume normal court sessions', 0, { legitimacy: 4 }]
  ]]
 );

 arc4('fs_med_bathhouse_hygiene', 'Society', 'epidemic',
  ['Steaming Bathhouses Divided Over Miasma', 'City doctors clash: half urge locking steam bathhouses against contagion, while clean-water advocates beg repairing hot stone tubs to scrub filth.', [
   ['Rebuild private-family clean water bathhouses with strict linen boiling', 135, { crisis: -19, development: 1, trust: 10 }],
   ['Close crowded public steam rooms briefly while distributing free soap', 70, { crisis: -13, trust: 9 }],
   ['Lock bathhouses strictly until frost ends the outbreak', 0, { crisis: -7, stability: 5 }]
  ]],
  ['Olive-Oil Soap Guilds Step Forward', 'Soap-boilers offer cheap blocks of potash-and-olive soap if granted tax-free oil and wood ash carts.', [
   ['Subsidize soap blocks for every poor parish and barracks washhouse', 85, { crisis: -13, trust: 11, credit: 6 }],
   ['Certify clean genuine olive-soap stamps against harsh caustic fakes', 35, { credit: 7, trust: 7 }],
   ['Encourage monasteries to boil tallow soap for hostels', 0, { piety: 7, crisis: -5 }]
  ]],
  ['Clean Linen Saves Sick Wards', 'Nurses boiling hospital sheets in lye report dramatic drops in secondary ward fevers.', [
   ['Mandate boiled-linen hygiene in every chartered hospital', 55, { research: 9, crisis: -10 }],
   ['Provide copper wash-boilers to city infirmaries', 50, { tools: 15, crisis: -8 }],
   ['Record ward recovery figures cleanly', 0, { research: 6 }]
  ]],
  ['Cleanliness Anchors Urban Health', 'Sparkling wash-houses and honest soap become daily habits shielding towns far beyond one outbreak.', [
   ['Endow public stone laundry basins beside clean springs', 60, { development: 1, trust: 9 }],
   ['Praise observant nurses and soap-boilers', 25, { trust: 6, prestige: 5 }],
   ['Close the civic hygiene board', 0, { stability: 4 }]
  ]]
 );

 // === E. ASTRONOMY, PRINTING PRESS & UNIVERSITY DEBATES ===
 branch4('fs_sch_comet_omen', 'Culture & Learning', 'crossroads_press',
  ['Hairy Star Blazes Above the Belfry', 'A brilliant tailed comet hangs over northern spires; street prophets print alarming doom sheets while astronomers measure parallax angles excitedly.', [
   ['Sponsor royal observatory measurements and publish calm scientific tracts', 110, { research: 14, stability: 8, prestige: 8 }],
   ['Pair calm cathedral prayers with reassuring printed astrological charts', 55, { piety: 7, stability: 7, research: 6 }],
   ['Ban wild apocalyptic pamphlets immediately to quiet market panic', 0, { securityMonths: 8, stability: 6, unrest: -4 }]
  ]],
  ['Brass Quadrants Measure the Sky', 'Scholars prove the comet glides higher than the moon—shattering ancient dogmas of immutable crystal spheres.', [
   ['Endow a permanent Royal Star-Tower with copper quadrants', 105, { research: 15, prestige: 10, development: 1 }],
   ['Print star-position tables useful to oceanic navigators', 55, { research: 10, credit: 7 }],
   ['Archive observations quietly inside university vaults', 0, { research: 7 }]
  ]],
  ['Prophets Rally Crowds at Crossroads', 'Frightened laborers hoard candles and abandon field ploughing, chanting that judgment bells strike Friday.', [
   ['Send respected moderate priests and astronomers together to calm parishes', 65, { trust: 10, stability: 8, unrest: -7 }],
   ['Keep market bells and granary carts running visibly as normal', 25, { stability: 6, food: 25 }],
   ['Disperse unlawful crossroads assemblies cleanly', 0, { securityMonths: 7, stability: 5 }]
  ]],
  ['Wonder Replaces Terror', 'When the comet fades harmlessly beyond dawn, printed star charts leave citizens proud of their realm’s learning.', [
   ['Award gold astrolabes to royal astronomers', 45, { prestige: 9, research: 7 }],
   ['Print affordable sky primers for grammar schools', 35, { research: 8, trust: 6 }],
   ['Close the comet chronicle', 0, { stability: 4 }]
  ]]
 );

 arc4('fs_sch_polyglot_bible', 'Culture & Learning', 'crossroads_press',
  ['The Polyglot Press Enterprise', 'Master typographers propose casting Latin, Greek, Hebrew, and Arabic metal fonts side-by-side to print monumental scholarly editions.', [
   ['Fund custom punch-cutters and water-powered paper mills for the press', 155, { research: 16, prestige: 12, acceptance: 8 }],
   ['Back a narrower bilingual grammar & law press first', 75, { research: 10, credit: 7, legitimacy: 6 }],
   ['Permit the workshop freely without treasury grants', 0, { research: 6, credit: 4 }]
  ]],
  ['Type-Founders Strike Over Lead Fumes', 'Punch-cutters breathing hot antimony-and-lead vapors collapse coughing over crucibles.', [
   ['Build hooded brick chimney flues and double pay for master founders', 75, { trust: 9, research: 8, tools: 12 }],
   ['Rotate casting hours outdoors in covered breeze sheds', 30, { trust: 7, stability: 5 }],
   ['Hire additional apprentices to shorten shifts', 0, { tools: 10, stability: 4 }]
  ]],
  ['University Orders Flood From Abroad', 'Foreign abbeys, royal libraries, and city halls send chests of silver to reserve numbered folio volumes.', [
   ['Export bound volumes under proud royal colophon stamps', 45, { gold: 110, prestige: 10, credit: 8 }],
   ['Donate presentation folios to allied courts as diplomacy gifts', 55, { prestige: 11, acceptance: 7 }],
   ['Reserve first editions inside national cathedral libraries', 0, { piety: 7, research: 6 }]
  ]],
  ['Monument of Ink & Metal', 'Your realm’s polyglot presses shine as a beacon of humanist rigor and artisan mastery.', [
   ['Charter a Royal University Press permanently', 60, { research: 11, legitimacy: 7 }],
   ['Award silver medals to punch-cutters', 25, { prestige: 7 }],
   ['Close the printing grant', 0, { stability: 4 }]
  ]]
 );

 arc4('fs_sch_language_court', 'Culture & Learning', 'languageStudent',
  ['Rare Dictionaries From Distant Coasts', 'Your language tutors unearth battered bilingual dictionaries compiled by coastal merchants—unlocking idioms never taught in palace grammars.', [
   ['Fund printed pocket lexicons for diplomats and royal interpreters', 100, { research: 11, prestige: 8, stress: -4 }],
   ['Invite native merchant storytellers to dine and sharpen spoken accent', 50, { prestige: 7, stress: -5, research: 6 }],
   ['Copy key court phrases cleanly into personal notebooks', 0, { research: 5, stress: -2 }]
  ]],
  ['Debate Over Court Poetry vs Trade Prose', 'Refined rhetoricians sneer at practical harbor grammar while pragmatic envoys praise clear everyday speech.', [
   ['Master both elevated ceremonial verse and crisp treaty prose', 65, { research: 10, prestige: 9, legitimacy: 5 }],
   ['Focus sharply on concise diplomatic and legal precision', 30, { legitimacy: 8, research: 6 }],
   ['Enjoy lively court verse evenings to ease work tension', 0, { stress: -8, prestige: 5 }]
  ]],
  ['First Audience Spoken Without Translators', 'Receiving foreign guests, you deliver a warm paragraph cleanly in their own tongue—bringing astonished smiles round the hall.', [
   ['Host an impromptu salon trading proverbs and manuscripts', 50, { prestige: 10, stress: -6 }],
   ['Gift the visiting guests annotated copies of local chronicles', 30, { research: 7, prestige: 6 }],
   ['Conclude the audience with poised royal dignity', 0, { legitimacy: 6, prestige: 5 }]
  ]],
  ['A Sovereign of Many Tongues', 'Fluency earns genuine warmth across borders and sharpens private reading of foreign dispatches.', [
   ['Endow permanent Palace Language Fellowships', 65, { research: 10, prestige: 7 }],
   ['Thank patient tutors publicly', 20, { prestige: 6, stress: -4 }],
   ['Close the study term', 0, { stability: 4 }]
  ]]
 );

 arc4('fs_sch_cultural_quarter', 'Society', 'culturalDistrict',
  ['Street Theater & Craft Fairs in the Minority Quarter', 'Artists and cooks in a distinct cultural district propose an annual three-day lantern street fair open to the entire capital.', [
   ['Co-sponsor colored lanterns, stage scaffolds, and shared civic guards', 110, { acceptance: 13, trust: 11, prestige: 8 }],
   ['License the fair cleanly with lowered stall dues and clean water booths', 50, { acceptance: 9, credit: 7, trust: 7 }],
   ['Allow quiet daytime craft markets while keeping evening curfew', 0, { acceptance: 5, stability: 5 }]
  ]],
  ['Traditionalists Grumble at Foreign Dances', 'A few austere aldermen petition to ban unfamiliar lute tunes and bright masks near cathedral lanes.', [
   ['Attend the opening evening in person to honor shared urban pride', 45, { acceptance: 12, prestige: 9, trust: 9 }],
   ['Keep stages respectfully clear of church porches while welcoming festivity', 25, { acceptance: 8, stability: 7 }],
   ['Require written songbooks vetted gently by town elders', 0, { securityMonths: 6, acceptance: 4 }]
  ]],
  ['Apprentices Swap Songs & Recipes', 'Capital youths flock to spiced flatbread stalls and join masked folk dances beneath string lamps.', [
   ['Publish a joyful illustrated chronicle of realm customs', 60, { research: 8, acceptance: 9, prestige: 7 }],
   ['Encourage mixed guild apprenticeships across neighborhoods', 40, { credit: 8, acceptance: 8 }],
   ['Sweep plazas clean smoothly after midnight bells', 0, { trust: 5, stability: 4 }]
  ]],
  ['Tapestry of One City', 'Annual lantern nights turn cultural variety from suspicion into proud civic color.', [
   ['Carve shared guild shields on the district fountain', 40, { prestige: 8, acceptance: 7 }],
   ['Thank neighborhood elders warmly', 20, { trust: 7 }],
   ['Close the festival ledger', 0, { stability: 4 }]
  ]]
 );

 // === F. SUCCESSION DISPUTES, CLAIMANTS & REGENCY ===
 branch4('fs_suc_coronation_oath', 'Succession', 'newReign',
  ['Old Seals Broken Before the High Altar', 'With the late sovereign’s signet broken by ceremonial hammer, great lords gather cautiously around your new throne awaiting the Coronation Charter.', [
   ['Proclaim balanced justice, audited taxes, and amnesty for petty debtors', 135, { legitimacy: 13, stability: 10, prestige: 8 }],
   ['Reaffirm ancestral customs firmly while keeping royal prerogatives intact', 65, { legitimacy: 9, stability: 7 }],
   ['Demand unconditional homage oaths first before hearing any petitions', 0, { legitimacy: 6, stress: 4, stability: -2 }]
  ]],
  ['Bells Ring From Estuary to Ridge', 'Relieved estates drop to one knee in unison, praising steady hands taking up the scepter.', [
   ['Mint crisp new-reign gold coins and distribute loaves at palace gates', 85, { prestige: 11, legitimacy: 9, food: -20 }],
   ['Confirm faithful council stewards in public parchment patents', 35, { stability: 8, legitimacy: 7 }],
   ['Retire calmly to review frontier dispatches', 0, { securityMonths: 7, stress: -4 }]
  ]],
  ['Muttered Grumbling on the Back Benches', 'Two proud provincial magnates linger near oak doors, whispering that new taxes will surely follow unyielding words.', [
   ['Invite hesitant lords to private hearth suppers to hear grievances candidly', 70, { stability: 9, legitimacy: 8 }],
   ['Remind the hall sternly that crown law shields smallholders from barons', 30, { legitimacy: 8, prestige: 6 }],
   ['Post alert household guards along gallery corridors', 0, { securityMonths: 8, stress: 3 }]
  ]],
  ['Firm Footing for a New Reign', 'Initial doubts settle into clear constitutional rhythm beneath your unbroken royal seal.', [
   ['Inscribe the New Reign Charter inside county courts', 45, { legitimacy: 9, stability: 6 }],
   ['Host foreign envoys bearing coronation congratulations', 40, { prestige: 9 }],
   ['Close the accession roll', 0, { stability: 4 }]
  ]]
 );

 arc4('fs_suc_claimant_herald', 'Succession', 'livingClaimant',
  ['Cousin’s Banner Unfurled at Abbey Fair', 'An ambitious living claimant attends a packed provincial abbey fair surrounded by fifty liveried retainers wearing suspiciously royal livery.', [
   ['Invite the cousin graciously to capital honor and audit his retinue size', 100, { opinion: 14, legitimacy: 8, securityMonths: 7 }],
   ['Dispatch royal heralds banning royal quarterings on private shields', 40, { legitimacy: 9, prestige: 6 }],
   ['Assign silent watchers to track every nobleman visiting his inn', 0, { securityMonths: 9, stress: 4 }]
  ]],
  ['Pamphlets Praise "True Elder Blood"', 'Ballad-singers at border taverns hint your cousin’s grandfather stood closer to an older line.', [
   ['Publish clean notarized royal genealogies across town crosses', 75, { legitimacy: 11, research: 5, prestige: 6 }],
   ['Offer the cousin a prestigious distant diplomatic or frontier dignity', 85, { opinion: 14, stability: 7 }],
   ['Fine tavern-keepers circulating seditious lineage verses', 0, { securityMonths: 7, legitimacy: 5 }]
  ]],
  ['Tears or Treason in the Gallery', 'Face to face inside a sunlit gallery, the claimant insists he seeks only honored birthright estates—not the crown.', [
   ['Confirm his rightful private manors publicly under solemn homage oath', 60, { opinion: 18, legitimacy: 9, stability: 7 }],
   ['Require two sworn council sureties binding his peaceful conduct', 25, { securityMonths: 8, legitimacy: 7 }],
   ['Keep cool courteous vigilance without conceding new lands', 0, { legitimacy: 6, stress: 2 }]
  ]],
  ['Dynastic Ranks Closed Cleanly', 'Publicly reconciled—or neatly boxed inside clear law—the dynasty faces rivals united.', [
   ['Witness the cousin’s homage oath in open parliament', 40, { legitimacy: 9, prestige: 6 }],
   ['Share a dignified family chapel service', 25, { piety: 7, opinion: 8 }],
   ['Close the succession heraldry file', 0, { stability: 4 }]
  ]]
 );

 arc4('fs_suc_regency_seal', 'Succession', 'regency',
  ['Quarreling Guardians Over the Privy Seal', 'During delicate regency governance, two senior councillors battle publicly over who holds custody of the Great Wax Seal overnight.', [
   ['Lock the Great Seal inside a triple-keyed coffer held jointly by three peers', 85, { legitimacy: 10, stability: 9 }],
   ['Vest temporary custody strictly in the high chancellor by written statute', 40, { legitimacy: 8, securityMonths: 7 }],
   ['Display the seal openly at daily council tables without favor', 0, { stability: 5, stress: 3 }]
  ]],
  ['Foreign Envoys Test Regency Resolve', 'Neighboring courts delay treaty ratifications, hinting a regency council lacks lasting royal authority.', [
   ['Present unified sealed decrees signed jointly by council and young sovereign', 65, { prestige: 10, legitimacy: 9 }],
   ['Stage crisp cavalry parades showing unbroken military readiness', 50, { prestige: 8, securityMonths: 7 }],
   ['Reply calmly that realm laws endure untouched across reigns', 0, { stability: 6, legitimacy: 5 }]
  ]],
  ['Steward Audits Regency Accounts', 'Gossip alleges regency favorites quietly carved timber grants out of crown parklands.', [
   ['Freeze all permanent crown land grants until full royal majority', 40, { legitimacy: 11, credit: 7, stability: 7 }],
   ['Audit park rolls publicly before independent urban aldermen', 35, { legitimacy: 9, stability: 6 }],
   ['Permit routine repairs only under triple signature', 0, { securityMonths: 7, stability: 4 }]
  ]],
  ['Crown Patrimony Guarded Intact', 'Disciplined regency safeguards hand down full royal estates unplundered and respected.', [
   ['Inscribe Regency Accountability Statutes in archives', 35, { legitimacy: 8 }],
   ['Thank steady non-partisan judges', 20, { stability: 6, stress: -5 }],
   ['Close the regency audit', 0, { stability: 4 }]
  ]]
 );

 arc4('fs_suc_brothers_quarrel', 'Family', 'competingHeirs',
  ['Two Princes & One Hunting Horn', 'After your younger adult child wins archery honors, bitter precedence quarrels erupt between elder and younger heirs at table.', [
   ['Assign distinct honorable realms of duty—law to elder, diplomacy to younger', 90, { opinion: 14, stability: 8, education: 8 }],
   ['Counsel both privately beside ancestral portraits on sibling unity', 40, { opinion: 11, legitimacy: 6, stress: -4 }],
   ['Reaffirm strict primogeniture publicly to halt endless rivalry', 0, { legitimacy: 8, opinion: -6 }]
  ]],
  ['Courtiers Form Quiet Camps', 'Flatterers whisper into the younger heir’s ear, praising bolder courage than the cautious elder.', [
   ['Ban factional flattery and send both heirs on a shared regional tour', 85, { opinion: 14, education: 9, prestige: 6 }],
   ['Rotate flatterers out to distant customs posts gently', 35, { securityMonths: 8, stability: 6 }],
   ['Order both youths to sit side by side at morning petitions', 0, { education: 5, legitimacy: 5 }]
  ]],
  ['Bridge Collapse Tests Sibling Mettle', 'When a timber gallery snaps during flood relief, the younger heir hauls the trapped elder clear of rushing mud.', [
   ['Celebrate their mutual courage openly with matched ceremonial swords', 65, { opinion: 18, prestige: 10, legitimacy: 8 }],
   ['Endow a modest bridge-chapel honoring brotherly devotion', 45, { piety: 8, opinion: 12 }],
   ['Praise their cool teamwork warmly at supper', 0, { opinion: 9, stress: -5 }]
  ]],
  ['Comrades of One House', 'Shared peril forges loyalty between heirs stronger than any court gossip.', [
   ['Record joint heir commissions in court annals', 35, { legitimacy: 7, prestige: 6 }],
   ['Grant both clear winter study tours', 40, { education: 8 }],
   ['Close the household dispute', 0, { stability: 4 }]
  ]]
 );

 arc4('fs_suc_adult_heir_audit', 'Family', 'adultHeir',
  ['The Heir Challenges Stale Treasury Clerks', 'Assigned to inspect revenue rolls, your grown heir bursts in waving yellowed parchments showing lazy clerks waiving noble arrears.', [
   ['Back the heir’s audit firmly and modernize treasury tallies together', 95, { legitimacy: 11, education: 11, credit: 8 }],
   ['Guide the heir tactfully on pairing firm law with noble courtesy', 45, { education: 9, opinion: 10, stability: 6 }],
   ['Caution against humiliating elder lords hastily before council', 0, { stability: 6, opinion: -3, legitimacy: 4 }]
  ]],
  ['Old Magnate Petitions Against "Youthful Zeal"', 'A grey-bearded duke complains your heir humiliated his steward over twenty-year-old pasture dues.', [
   ['Compromise gracefully—forgive ancient arrears while locking clean new rolls', 55, { stability: 8, opinion: 9, legitimacy: 7 }],
   ['Stand firmly behind exact accounting while hosting the duke warmly', 35, { legitimacy: 9, prestige: 6 }],
   ['Let the heir negotiate fair settlement terms firsthand', 0, { education: 10, opinion: 5 }]
  ]],
  ['Provincial Towns Cheer Young Justice', 'Ordinary magistrates hail the heir’s energy, sending petitions begging for road and bridge hearings.', [
   ['Send the heir on an official six-week provincial assize circuit', 85, { legitimacy: 10, education: 12, prestige: 8 }],
   ['Assign two seasoned judges to mentor the heir’s circuit bench', 45, { education: 9, stability: 7 }],
   ['Keep the heir busy drafting capital market reforms', 0, { credit: 7, education: 6 }]
  ]],
  ['A Sovereign Ready for the Crown', 'Seasoned in both account books and delicate pride, your heir wins broad confidence across estates.', [
   ['Confirm formal heir council precedence', 40, { legitimacy: 9, prestige: 7 }],
   ['Praise your heir’s balanced growth privately', 20, { opinion: 12, stress: -6 }],
   ['Close the circuit report', 0, { stability: 4 }]
  ]]
 );

 arc4('fs_suc_childless_adoption', 'Succession', 'childless',
  ['Silent Cradles & Whispered Prayers', 'Without living direct issue of the body, elders gently urge clarifying collateral inheritance rules before rival barons sharpen claims.', [
   ['Convene a solemn Family & Peers Pact naming clear collateral succession', 120, { legitimacy: 12, stability: 10, prestige: 6 }],
   ['Endow shrines and adopt promising collateral kin into royal schooling', 85, { piety: 10, legitimacy: 9, stress: -6 }],
   ['Keep succession calm under ancient realm law without hasty pledges', 0, { legitimacy: 6, stability: 5 }]
  ]],
  ['Cousins Ride Early to Court', 'Hearing rumors of succession councils, three distant cousins arrive bearing rich gifts and awkward eagerness.', [
   ['Test their character patiently through real administrative duties', 55, { legitimacy: 8, securityMonths: 7 }],
   ['Treat all collateral kin with scrupulous equal dignity', 30, { stability: 8, prestige: 6 }],
   ['Keep household watches alert against unseemly ambition', 0, { securityMonths: 8, stress: 2 }]
  ]],
  ['Chroniclers Trace Ancient Collateral Lines', 'Jurists verify uncontested precedents showing how previous childless reigns passed peacefully to worthy cousins.', [
   ['Deposit triple-sealed copies of the succession statute in cathedral vaults', 50, { legitimacy: 10, faithAuthority: 6 }],
   ['Host a solemn royal oath of unity among high peers', 45, { stability: 9, prestige: 7 }],
   ['Archive the jurists’ findings cleanly', 0, { research: 5, legitimacy: 5 }]
  ]],
  ['Dynastic Continuity Assured', 'Clarity stills anxious whispers across provinces, proving crowns endure through law as well as blood.', [
   ['Endow memorial chapels honoring ancestral continuity', 50, { piety: 9, prestige: 7 }],
   ['Thank loyal jurists and elder peers', 25, { stability: 6 }],
   ['Close the succession council', 0, { legitimacy: 5 }]
  ]]
 );

 // === G. COURTLY WEDDINGS, CONSORTS, WARDS & FRIENDS ===
 branch4('fs_fam_consort_patronage', 'Family', 'married',
  ['The Consort’s Music & Tapestry Salon', 'Your royal consort proposes turning dusty east gallery halls into a glittering salon for musicians, illuminators, and foreign poets.', [
   ['Sponsor the salon generously with Flemish weavers and lutenists', 120, { opinion: 16, prestige: 12, stress: -8 }],
   ['Grant modest stipends for native poets and choral scholars', 60, { opinion: 10, prestige: 7, research: 6 }],
   ['Reserve palace funds for roads while hosting quiet family music evenings', 0, { opinion: 5, stress: -4, stability: 4 }]
  ]],
  ['Harmonies Melt Court Tension', 'Even prickly council factions soften over polyphonic vespers and woven historical tapestries.', [
   ['Commission a grand tapestry series celebrating realm peace', 85, { prestige: 11, legitimacy: 7, opinion: 8 }],
   ['Encourage consort-led charity auctions for urban orphanages', 45, { piety: 9, opinion: 10 }],
   ['Enjoy peaceful candlelit recitals together', 0, { stress: -10, opinion: 8 }]
  ]],
  ['Austere Critics Mutiny Over Velvet Costs', 'Stern treasury clerks leak inflated figures on lute strings and silk thread, whispering of palace luxury.', [
   ['Show honest modest salon accounts and pair art with wool-guild prizes', 50, { legitimacy: 8, credit: 6, opinion: 7 }],
   ['Trim imported silk budgets while shielding native artists', 30, { stability: 6, prestige: 5 }],
   ['Remind critics cleanly that royal majesty commands diplomatic respect', 0, { prestige: 7, opinion: 6 }]
  ]],
  ['Grace Beside the Throne', 'Cultured hospitality softens diplomacy and makes the royal household a genuine source of peace.', [
   ['Endow a royal choral & tapestry fellowship', 55, { prestige: 9, research: 5 }],
   ['Gift your consort a carved ivory lute', 30, { opinion: 10, stress: -5 }],
   ['Close the cultural season', 0, { stability: 4 }]
  ]]
 );

 arc4('fs_fam_foreign_consort_embassy', 'Family', 'foreignMarriage',
  ['Homesick Retinue From Across Borders', 'Your foreign-born consort’s homeland envoys arrive bearing spiced pastries and family letters—yet suspicious courtiers watch every whispered greeting.', [
   ['Host a warm bilingual garden feast honoring both homelands equally', 110, { opinion: 14, relation: 13, prestige: 8 }],
   ['Receive the envoys courteously with formal treaty gifts', 55, { relation: 9, opinion: 8, stability: 5 }],
   ['Observe discreet protocol keeping foreign retainers clear of privy desks', 0, { securityMonths: 7, opinion: -4, relation: 3 }]
  ]],
  ['Consort’s Native Cooks Charm the Hall', 'Shared cinnamon pastries and almond cakes bridge stiff court accents, sparking lively culinary exchanges.', [
   ['Sponsor a joint cookbook & herb-garden exchange between realms', 55, { relation: 10, opinion: 10, research: 6 }],
   ['Grant honest trade passes to merchants from the consort’s homeland', 45, { credit: 7, relation: 9 }],
   ['Praise the consort’s gracious hospitality publicly', 0, { prestige: 7, opinion: 8 }]
  ]],
  ['Border Rumor Tests Married Trust', 'Malicious gossips claim the foreign retinue slipped boundary maps into a departing luggage chest.', [
   ['Stand firmly beside your consort and inspect bags openly together to clear names', 45, { opinion: 16, legitimacy: 8, securityMonths: 7 }],
   ['Quietly dismiss the rumor-monger while reviewing seal logs', 30, { securityMonths: 8, stability: 6 }],
   ['Reassure both courts calmly without public spectacle', 0, { relation: 6, stability: 5 }]
  ]],
  ['Living Bridge Between Crowns', 'Mutual trust turns a political match into genuine warmth anchoring peace across borders.', [
   ['Renew commercial and cultural exchanges with the consort’s homeland', 55, { relation: 12, credit: 7 }],
   ['Commission twin family portraits for both capitals', 40, { prestige: 9, opinion: 8 }],
   ['Close the family embassy visit', 0, { stability: 4 }]
  ]]
 );

 arc4('fs_fam_ward_astronomy', 'Family', 'wardGuardian',
  ['The Ward’s Midnight Star-Notebook', 'Your royal ward’s guardian reports the youth sneaks onto battlements nightly sketching constellations instead of sleeping before martial drills.', [
   ['Encourage structured astronomy & geometry lessons beside morning swordplay', 90, { education: 13, research: 8, opinion: 8 }],
   ['Buy a fine brass astrolabe as reward for finishing Latin and riding cleanly', 60, { education: 10, opinion: 10 }],
   ['Confiscate midnight candles so the youth sleeps soundly for drills', 0, { education: 4, stress: 2, opinion: -4 }]
  ]],
  ['Guardian Debates Discipline vs Curiosity', 'The seasoned guardian confesses admiration for the ward’s keen mind, asking how best to temper dreamy curiosity with command.', [
   ['Assign the ward to survey real castle fortification angles with engineers', 70, { education: 12, research: 7, opinion: 8 }],
   ['Pair the youth with river barge masters to study practical tides', 40, { education: 9, credit: 5 }],
   ['Keep daily balance of morning drills and afternoon maps', 0, { education: 6, stability: 4 }]
  ]],
  ['Ward Spots Error in Old Siege Chart', 'Comparing geometry angles against an old border survey, the ward quietly spots a mismeasured river bend.', [
   ['Praise the discovery warmly before court engineers and guardian', 45, { education: 11, prestige: 8, opinion: 11 }],
   ['Send updated sketches straight to royal cartographers', 25, { research: 8, education: 6 }],
   ['Encourage continued humility alongside sharp eyes', 0, { education: 7, legitimacy: 4 }]
  ]],
  ['Sharp Mind in Sound Armor', 'Balanced mentorship shapes an heir or noble ward equally fluent in camp discipline and precise mathematics.', [
   ['Reward the guardian generously for patient care', 45, { opinion: 12, prestige: 6 }],
   ['Bind the ward’s star-and-survey notebooks in leather', 25, { research: 5, education: 5 }],
   ['Close the seasonal tutoring review', 0, { stability: 4 }]
  ]]
 );

 arc4('fs_fam_child_compassion', 'Family', 'child',
  ['The Young Dynast’s Orphan Puppy & Baker Boy', 'Slipping past nursery tutors, your royal child befriends an orphaned apprentice baker, begging to buy warm boots for the street lads.', [
   ['Join the child incognito to endow a neighborhood shoe-and-bread chest', 95, { education: 11, piety: 9, stress: -5 }],
   ['Teach careful stewardship—letting the child fund boots from saved allowance', 40, { education: 12, credit: 4 }],
   ['Rebuke sneaking outside palace gates gently and send alms via stewards', 0, { education: 5, piety: 5, securityMonths: 4 }]
  ]],
  ['Courtiers Scoff at Common Friends', 'Haughty nursery pages tease the child about smelling of bakery flour and playing with street boys.', [
   ['Remind the nursery firmly that sovereigns rule townsfolk as well as earls', 35, { education: 10, legitimacy: 8 }],
   ['Invite clever guild children into royal grammar lessons for broad perspective', 65, { education: 11, research: 7 }],
   ['Counsel the child calmly on royal dignity without losing kind heart', 0, { education: 7, stress: -3 }]
  ]],
  ['Young Bakers Gift Pretzels at Festival', 'On guild feast day, grinning apprentices march to the palace gate bearing a giant braided wheat loaf honoring the young royal.', [
   ['Display the braided loaf proudly at high table and feast the guild', 55, { prestige: 8, education: 8, stability: 6 }],
   ['Share the giant loaf with abbey infirmaries together', 25, { piety: 9, education: 7 }],
   ['Thank the youths warmly with silver pennies', 0, { gold: -10, prestige: 6, education: 5 }]
  ]],
  ['Seeds of Humane Rule', 'Early compassion grounded in real street life seeds quiet wisdom that no dusty Latin primer alone can teach.', [
   ['Note the child’s generous heart in family chronicles', 25, { prestige: 7, legitimacy: 5 }],
   ['Endow an apprentice boot fund annually', 45, { piety: 8, stability: 5 }],
   ['Close the nursery journal', 0, { education: 4 }]
  ]]
 );

 arc4('fs_fam_friend_hunting', 'Court', 'courtFriend',
  ['A Trusted Companion’s Quiet Confession', 'Over autumn cider beside camp embers, your closest court friend confesses crippling family debts threaten forfeiture of their ancestral manor.', [
   ['Clear the debt cleanly with an honest royal loan and estate stewardship aid', 110, { opinion: 18, stability: 6, stress: -8 }],
   ['Grant a lucrative salaried customs post so they earn solvency honorably', 50, { opinion: 14, credit: 5 }],
   ['Offer warm counsel and introduce honest merchant lenders without treasury gold', 0, { opinion: 8, credit: 4, stress: -4 }]
  ]],
  ['Gossips Cry Favoritism at Council', 'Jealous rivals murmur that royal friendship buys easy rescues while lesser knights sweat.', [
   ['Ensure terms match strict audited schedules repaid in full', 45, { legitimacy: 9, opinion: 8, credit: 5 }],
   ['Open similar honest estate-restructuring loans to other loyal houses', 75, { stability: 8, credit: 7 }],
   ['Remind court calmly that loyal service merits honest help', 0, { prestige: 6, opinion: 6 }]
  ]],
  ['Friend Uncovers Silent Plot', 'Grateful and vigilant, your friend’s own bailiffs intercept treasonous whispers aimed at your border castles.', [
   ['Act quietly together to seal the leak before dawn', 55, { securityMonths: 10, opinion: 12 }],
   ['Honor your friend’s vigilance publicly before privy council', 30, { prestige: 8, stability: 6 }],
   ['Thank them privately over shared wine', 0, { stress: -8, opinion: 10 }]
  ]],
  ['Tested & Proven True', 'Friendship rooted in honorable help outlasts fair-weather flattery through stormiest winters.', [
   ['Celebrate shared anniversary at the hunting lodge', 40, { stress: -10, opinion: 10 }],
   ['Record loyal service in court patents', 25, { legitimacy: 6 }],
   ['Close the personal ledger', 0, { stability: 4 }]
  ]]
 );

 arc4('fs_fam_councillor_burnout', 'Court', 'councillor',
  ['Grey Hair & Shaking Quills at Council', 'Your hardest-working council minister collapses coughing at the ledger desk, refusing rest lest rivals seize his portfolio.', [
   ['Insist on paid three-week spa retreat and appoint loyal temporary clerks', 95, { opinion: 16, stability: 8, stress: -6 }],
   ['Hire two bright young university deputies to shoulder routine inkwork', 60, { research: 7, opinion: 12, stability: 6 }],
   ['Thank him deeply and trim weekly council hours for all ministers', 0, { opinion: 9, stress: -8, stability: 5 }]
  ]],
  ['Rival Deputies Circle the Empty Chair', 'Within two days of his absence, younger court climbers lobby boldly for permanent control of his seals.', [
   ['Reaffirm his locked commission publicly until he returns healthy', 35, { legitimacy: 9, stability: 8, opinion: 10 }],
   ['Test the ambitious clerks openly on tricky tax audits first', 25, { securityMonths: 7, research: 5 }],
   ['Keep decisions neatly centered under your own signet meanwhile', 0, { legitimacy: 6, stress: 3 }]
  ]],
  ['Refreshed Minister Returns With Reform Plan', 'Rested beside warm mineral baths, your councillor returns with brisk ideas to cut council red tape in half.', [
   ['Adopt his streamlined chancery filing rules cleanly', 55, { legitimacy: 9, credit: 7, opinion: 10 }],
   ['Reward his lifelong devotion with a modest manor honor', 65, { prestige: 8, opinion: 14 }],
   ['Put his streamlined schedules straight into practice', 0, { stability: 7 }]
  ]],
  ['Steady Pillars of the Crown', 'Caring for faithful servants builds an administrative corps that serves for decades rather than burning out.', [
   ['Establish permanent deputy fellowships across council desks', 50, { research: 6, stability: 7 }],
   ['Toast senior ministers warmly at seasonal supper', 25, { opinion: 9, stress: -5 }],
   ['Close the council personnel review', 0, { stability: 4 }]
  ]]
 );

 // === H. ADDITIONAL 44 CHAINS (176 STAGES) TO REACH 65 CHAINS = 260 STAGES ===
 // (Currently: A=6, B=4, C=4, D=4, E=4, F=6, G=6 -> 34 chains. Need 31 more chains = 124 stages!)
 arc4('fs_mon_bell_foundry', 'Religion', 'institution',
  ['Cracked Cathedral Great Bell', 'The bronze six-ton cathedral bell splits vertically during winter frost, casting gloom over parish festivals.', [
   ['Recast the bell cleanly in the cathedral yard with finest tin-copper', 140, { piety: 12, prestige: 10, trust: 9 }],
   ['Suspend a modest temporary chapel bell while melting scrap brass', 65, { piety: 8, trust: 7 }],
   ['Leave the cracked bell silent and use wooden clappers', 0, { piety: 3, faithAuthority: -2 }]
  ]],
  ['Founders & Prelates Debate Inscriptions', 'Master founders warn ornate raised lettering weakens bronze rim resonance unless kept spare and balanced.', [
   ['Favor clean deep-toned acoustics with simple pious royal date', 55, { research: 8, piety: 9, prestige: 7 }],
   ['Cast intricate heraldic reliefs despite heavier rim bronze', 75, { prestige: 10, piety: 7 }],
   ['Let cathedral wardens choose traditional Latin prayers', 0, { faithAuthority: 7, piety: 6 }]
  ]],
  ['Molten Glow at Midnight Pour', 'Hundreds gather silently round smoking clay pits as white-hot bronze streams into earth beneath prayers.', [
   ['Distribute warm honey-bread and spiced cider to night watchers', 55, { trust: 10, piety: 7, food: -15 }],
   ['Post calm wardens keeping curious youths clear of hot vents', 25, { securityMonths: 6, stability: 5 }],
   ['Watch the cooling pit quietly till dawn', 0, { piety: 6 }]
  ]],
  ['Deep Voice Rings Across Ten Leagues', 'Hoisted atop oak beams, the flawless bell pours warm bronze thunder across valleys at sunset.', [
   ['Record the foundry master’s alloy weights in abbey books', 35, { research: 7, legitimacy: 5 }],
   ['Bless the bell publicly with civic guilds', 30, { piety: 9, trust: 7 }],
   ['Close the cathedral bell fund', 0, { stability: 4 }]
  ]]
 );

 arc4('fs_her_witch_rumor', 'Religion', 'unrest',
  ['Hailstorms Blamed on Old Herbalist', 'After freak June hailstones flatten rye, panicked villagers drag a solitary widow herbalist before parish constables crying witchcraft.', [
   ['Intervene swiftly with royal judges dismissing baseless storm-magic charges', 85, { legitimacy: 11, trust: 10, unrest: -9 }],
   ['Send compassionate abbey scholars to educate villagers on hail clouds', 65, { research: 8, piety: 8, unrest: -7 }],
   ['Remove the widow quietly to safe capital hospital service', 0, { securityMonths: 7, piety: 6, unrest: -4 }]
  ]],
  ['Angry Bailiff Insists on Ordeal', 'A stubborn village bailiff protests that dismissing trials encourages dark curses against village cows.', [
   ['Enforce strict royal statutes outlawing water-ordeals and mob justice', 45, { legitimacy: 11, faithAuthority: 6, trust: 8 }],
   ['Treat sick cattle honestly with trained veterinary farriers', 55, { food: 40, research: 6, trust: 9 }],
   ['Hold a calm parish sermon condemning superstition and malice', 0, { piety: 8, stability: 6 }]
  ]],
  ['Herbalist Reveals Cow-Blight Cure', 'Safe inside royal protection, the elderly woman shows bailiffs the toxic meadow hemlock ruining village milk.', [
   ['Pay her modestly to clear hemlock patches and teach honest parish herbs', 55, { food: 45, research: 8, trust: 10 }],
   ['Establish parish midwife-and-herb allowances cleanly', 45, { trust: 9, piety: 6 }],
   ['Thank her warmly and clear her name at county cross', 0, { legitimacy: 8, trust: 7 }]
  ]],
  ['Reason & Mercy Over Panic', 'Firm law and real veterinary sense save innocent lives and turn frightened parishes back to calm labor.', [
   ['Publish a Crown Edict Against Mob Superstition Trials', 45, { legitimacy: 9, research: 5 }],
   ['Reward alert circuit judges', 20, { prestige: 6 }],
   ['Close the assize docket', 0, { stability: 4 }]
  ]]
 );

 arc4('fs_sch_map_printer', 'Culture & Learning', 'crossroads_press',
  ['Copperplate World Atlas Engraved', 'Skilled goldsmiths and geographers propose engraving sixty detailed copper map plates updating ancient Ptolemy tables with modern voyages.', [
   ['Patronize the Royal Atlas with university stipends and royal seal', 150, { research: 16, prestige: 12, credit: 7 }],
   ['Fund clean domestic regional and coastal navigation plates first', 80, { research: 11, credit: 8, securityMonths: 6 }],
   ['Purchase finished unbound sheets calmly for palace study rooms', 0, { research: 6, prestige: 5 }]
  ]],
  ['Border Lords Dispute Engraved Lines', 'Prickly border lords object that printed maps fix disputed marsh boundaries prematurely in public ink.', [
   ['Mark unsettled marshes tactfully with dotted neutral survey lines', 40, { stability: 8, trust: 6, legitimacy: 6 }],
   ['Verify true county bounds cleanly with royal surveyors first', 65, { legitimacy: 9, research: 7 }],
   ['Remind peers maps record rivers and hills, not private manor deeds', 0, { prestige: 6, stability: 4 }]
  ]],
  ['Hand-Colored Atlases Fetch Gold Abroad', 'Artisan workshops hire dozens of delicate brush-painters tinting sea lanes and compass roses bright crimson and gold.', [
   ['Gift gilded royal atlases to friendly foreign courts', 65, { prestige: 12, acceptance: 7 }],
   ['License open sales across capital bookstalls', 35, { gold: 95, credit: 7 }],
   ['Require royal security review before printing secret shoal soundings', 0, { securityMonths: 8, research: 5 }]
  ]],
  ['World Unfolded on Crisp Rag Paper', 'Your realm’s engraved atlases become the standard reference for captains, ministers, and scholars alike.', [
   ['Establish a permanent Royal Cartographic Archive', 55, { research: 10, legitimacy: 7 }],
   ['Award gold burins to master engravers', 25, { prestige: 7 }],
   ['Close the atlas commission', 0, { stability: 4 }]
  ]]
 );

 arc4('fs_med_apothecary_opium', 'Society', 'stress',
  ['Poppy Draughts & Sleeplessness', 'Overworked through crises, a court physician offers sweet poppy-and-henbane syrups promising instant deep dreamless sleep.', [
   ['Decline heavy narcotics and adopt strict evening walks and warm milk', 45, { stress: -18, legitimacy: 6, research: 5 }],
   ['Use mild chamomile and valerian herbals only under strict measure', 30, { stress: -14, research: 4 }],
   ['Accept a single measured dose tonight before tomorrow’s tense council', 0, { stress: -12, prestige: 2 }]
  ]],
  ['Courtiers Whisper About Poppy Shops', 'Soldiers returning from distant campaigns open smoky alley dens selling potent poppy cakes to weary weavers.', [
   ['Regulate poppy extracts strictly to licensed surgical hospitals only', 80, { legitimacy: 9, stability: 7, research: 6 }],
   ['Ban unprescribed street poppy sales while educating guilds cleanly', 45, { stability: 7, securityMonths: 7 }],
   ['Tax licensed apothecary stocks heavily to curb abuse', 0, { gold: 65, securityMonths: 5 }]
  ]],
  ['Surgeons Defend Necessary Pain Relief', 'Honest barber-surgeons beg you not to outlaw genuine poppy wine needed when sawing shattered soldiers’ limbs.', [
   ['Guarantee strict sealed surgical dispensaries for genuine wound care', 55, { research: 8, legitimacy: 7, stability: 6 }],
   ['Fund botanical trials seeking non-habituating willow & fever herbs', 75, { research: 12, prestige: 6 }],
   ['Keep military surgeon chests well-supplied under seal', 0, { securityMonths: 6, legitimacy: 5 }]
  ]],
  ['Clear Heads & Measured Mercy', 'Balanced medical statutes shield streets from addiction while preserving vital mercy inside operating wards.', [
   ['Publish a Royal Surgical Dispensary Ordinance', 40, { legitimacy: 8, research: 6 }],
   ['Maintain healthy evening garden walks yourself', 20, { stress: -10 }],
   ['Close the apothecary review', 0, { stability: 4 }]
  ]]
 );

 arc4('fs_sec_cipher_wheel', 'Intrigue', 'activePlot',
  ['Brass Polyalphabetic Cipher Disk', 'A clever court mathematician presents twin interlocking brass alphabet wheels capable of scrambling dispatches cleanly.', [
   ['Adopt the brass cipher disks across active agents immediately', 95, { plotPreparation: 13, securityMonths: 9, research: 6 }],
   ['Test the wheel against cryptanalysts first before trusting live schemes', 45, { plotPreparation: 9, research: 5 }],
   ['Stick to proven simple substitution books memorized by couriers', 0, { plotPreparation: 5, securityMonths: 4 }]
  ]],
  ['Courier Drops Spare Key Wheel', 'While changing horses in rain, an agent’s saddlebag rips—nearly exposing a brass wheel to curious ostlers.', [
   ['Shift cipher code-words immediately and house couriers at safe posts', 65, { plotPreparation: 10, securityMonths: 9 }],
   ['Engrave innocent calendar marks on wheels so they look like sundials', 40, { plotPreparation: 9, research: 5 }],
   ['Recall the clumsy courier and tighten saddle locks', 0, { securityMonths: 7, stress: 2 }]
  ]],
  ['Rival Clerks Stare Blankly at Captured Letters', 'Enemy agents who intercept one duplicate dispatch spend three futile weeks chasing nonsensical vowels.', [
   ['Use the breathing room to advance preparations cleanly ahead of schedule', 45, { plotPreparation: 12, stress: -4 }],
   ['Feed a second deliberately weak cipher to keep foes looking elsewhere', 25, { securityMonths: 9, plotPreparation: 7 }],
   ['Keep dispatches brief and sparse regardless', 0, { securityMonths: 6 }]
  ]],
  ['Unbroken Whisper Network', 'Mathematical ciphers elevate court intelligence from lucky guesswork into disciplined statecraft.', [
   ['Pay the mathematician a quiet lifetime palace pension', 50, { research: 8, securityMonths: 7 }],
   ['Lock master wheels inside the privy iron chest', 20, { legitimacy: 5 }],
   ['Close the cipher trial', 0, { stability: 4 }]
  ]]
 );

 arc4('fs_suc_dowager_court', 'Family', 'newReign',
  ['The Dowager’s Shadow at Court', 'Your formidable widowed dowager mother/aunt retains immense loyal retainers inside the east wing, drawing petitioners away from new royal seals.', [
   ['Honor her publicly with ceremonial precedence while centralizing all seals', 110, { legitimacy: 11, stability: 9, prestige: 8 }],
   ['Grant her an honorable provincial abbey & manor dower court peacefully', 75, { legitimacy: 9, stability: 7, credit: 5 }],
   ['Dismiss her partisan clerks firmly on day one', 0, { legitimacy: 8, stress: 5, stability: -2 }]
  ]],
  ['Dower Manor Accounts Disputed', 'Exchequer clerks find old verbal pensions promised by the late ruler without clean chancery seals.', [
   ['Honor modest charitable widow pensions while auditing bloated retainers', 70, { legitimacy: 9, credit: 7, stability: 6 }],
   ['Review every unsealed grant fairly before joint privy judges', 35, { legitimacy: 8, stability: 5 }],
   ['Cancel all unsealed verbal gifts cleanly', 0, { gold: 70, stress: 3 }]
  ]],
  ['Seasoned Advice Offered Quietly', 'Once pride settles, the dowager quietly warns you which smiling flatterers betrayed earlier truces.', [
   ['Listen gratefully and share private family tea weekly', 35, { securityMonths: 9, stress: -8, stability: 7 }],
   ['Cross-check her names gently through trusted guards', 25, { securityMonths: 8, legitimacy: 5 }],
   ['Thank her politely while keeping independent counsel', 0, { legitimacy: 5 }]
  ]],
  ['Harmony Across Generations', 'Respect paired with firm constitutional boundaries turns potential palace rivalry into quiet dynastic strength.', [
   ['Confirm clean dower charters in royal archives', 35, { legitimacy: 8, stability: 6 }],
   ['Commission a joint family chapel window', 40, { piety: 8, prestige: 7 }],
   ['Close the household settlement', 0, { stability: 4 }]
  ]]
 );

 arc4('fs_fam_ward_duel', 'Family', 'wardGuardian',
  ['Wooden Swords Turn Too Sharp', 'Your royal ward bruised a proud earl’s son severely in practice tilts; furious parents threaten withdrawing court friendship.', [
   ['Mediate candidly—make both boys share feast service and clean apology', 65, { opinion: 13, education: 10, stability: 6 }],
   ['Praise spirited vigor privately while teaching disciplined restraint publicly', 35, { education: 9, opinion: 8, prestige: 5 }],
   ['Assign stern extra Latin lines and blunt wooden staves only', 0, { education: 6, opinion: -3, stress: 2 }]
  ]],
  ['Guardian Blames Pampered Pages', 'The guardian protests noble playmates deliberately goaded your ward with cruel taunts about royal pressure.', [
   ['Audit nursery companions and pair honest, steady youths around the ward', 55, { education: 11, securityMonths: 7, opinion: 8 }],
   ['Teach your ward cool composure under teasing tongues', 25, { education: 10, stress: -4 }],
   ['Rotate nursery attendants cleanly', 0, { stability: 5, education: 5 }]
  ]],
  ['Rematch With Blunted Lances & Courtesy', 'Months later, both youths tilt cleanly under trumpets, clasping gauntlets warmly when lances splinter.', [
   ['Host a cheerful youths’ tournament banquet', 75, { prestige: 9, opinion: 12, education: 8 }],
   ['Gift matched leather gloves to both boys', 30, { opinion: 9, stability: 5 }],
   ['Commend improved poise calmly', 0, { education: 6 }]
  ]],
  ['Steel Tempered by Courtesy', 'Learning to master temper beside strength marks a future leader far more than winning boys’ tilts.', [
   ['Reward the patient guardian with hunting privileges', 30, { opinion: 10, prestige: 5 }],
   ['Record the ward’s progress in family rolls', 20, { legitimacy: 5 }],
   ['Close the nursery report', 0, { stability: 4 }]
  ]]
 );

 arc4('fs_mon_pilgrim_bridge', 'Religion', 'sanctuary',
  ['Rotting Ferry at the River Shrine', 'Hundreds of barefoot pilgrims crowd muddy banks waiting to cross toward an island sanctuary after autumn rains flood the ford.', [
   ['Build a sturdy arched stone pilgrim bridge with carved wayside chapels', 150, { piety: 13, development: 1, trust: 11 }],
   ['Fund safe flat-bottomed abbey barges manned by salaried oarsmen', 75, { piety: 9, trust: 9, credit: 5 }],
   ['Restrict crossing strictly to calm midday hours under wardens', 0, { piety: 5, stability: 5 }]
  ]],
  ['Toll-Keeper & Abbot Quarrel', 'Local manor bailiffs try charging pilgrim ferry pennies while monks insist sacred travelers cross free.', [
   ['Buy out the manor’s ancient ferry rights cleanly for free pilgrim passage', 85, { piety: 11, trust: 11, loyalty: 6 }],
   ['Allow pilgrims free while taxing commercial wool carts fairly', 35, { credit: 7, piety: 7, legitimacy: 6 }],
   ['Enforce ancient sanctuary immunity by writ', 0, { faithAuthority: 8, loyalty: -4 }]
  ]],
  ['Floods Test the New Stone Piers', 'Winter snowmelt surges round fresh mortar; master masons hold torches checking cutwater arches through the night.', [
   ['Reinforce upstream piers with heavy granite cutwaters cleanly', 65, { development: 1, piety: 7, trust: 8 }],
   ['Keep night watchmen clearing drifted logs with long hooks', 25, { stability: 6, securityMonths: 6 }],
   ['Offer prayers of gratitude as waters crest safely', 0, { piety: 7 }]
  ]],
  ['Bridge of Mercy Standing Fast', 'Carters, merchants, and barefoot pilgrims share the sunlit arches peacefully year-round.', [
   ['Carve pilgrim prayers and guild marks on the parapet', 35, { prestige: 8, piety: 7 }],
   ['Endow a winter lantern beside the chapel arch', 25, { trust: 7, securityMonths: 5 }],
   ['Close the sanctuary bridge works', 0, { stability: 4 }]
  ]]
 );

 arc4('fs_sch_music_notation', 'Culture & Learning', 'research',
  ['Printed Polyphonic Music Books', 'Chapel choir directors pioneer movable wood-and-metal musical type capable of printing four-part hymns and secular lute airs cleanly.', [
   ['Endow the royal music press and commission realm anthem collections', 130, { research: 13, prestige: 11, piety: 8 }],
   ['Print practical parish choir hymnals to standardize rural liturgy', 65, { piety: 9, research: 8, faithAuthority: 5 }],
   ['Collect crisp hand-copied choral folios for the palace chapel', 0, { piety: 6, prestige: 5 }]
  ]],
  ['Conservatives Fear Melodies Distract Prayer', 'Austere preachers complain intricate four-part harmony clouds plain sacred words in cathedral choirs.', [
   ['Commission clear stately harmonies where every sacred syllable rings crisp', 55, { piety: 9, faithAuthority: 7, prestige: 8 }],
   ['Keep austere plainchant for solemn fasts and rich polyphony for feasts', 30, { stability: 8, piety: 7 }],
   ['Let cathedral chapters set their own musical bounds', 0, { faithAuthority: 5, stability: 4 }]
  ]],
  ['Orphan Choir Schools Blossom', 'Printed sheet music spreads rapidly to town schools, training poor boys and girls in sight-singing and organ craft.', [
   ['Fund brass organ pipes and paid choirmasters in provincial towns', 80, { development: 1, trust: 9, prestige: 8 }],
   ['Distribute free songbooks to hospital and parish schools', 40, { research: 7, piety: 7 }],
   ['Host a spring capital choir gathering', 0, { prestige: 8, stability: 5 }]
  ]],
  ['Harmony Across Cathedral & Hall', 'Printed musical scores elevate native composers to fame across foreign courts.', [
   ['Name a salaried Royal Master of Music', 45, { prestige: 9, research: 6 }],
   ['Deposit master music plates in the library', 25, { research: 5 }],
   ['Close the music press grant', 0, { stability: 4 }]
  ]]
 );

 arc4('fs_sec_cipher_poison', 'Intrigue', 'knownSecret',
  ['Missing Vial From the Court Apothecary', 'Your apothecary reports two grains of odorless white arsenic missing from locked shelves—and only three chamber clerks held keys.', [
   ['Inspect clerk sleeves quietly, test table silver, and lock duplicate keys', 95, { securityMonths: 11, stability: 6 }],
   ['Keep discreet watch over all three suspects without tipping hand', 45, { securityMonths: 9, stress: 3 }],
   ['Throw out all open kitchen salts and change water barrels immediately', 0, { securityMonths: 7, food: -10, stress: 2 }]
  ]],
  ['Rat-Catcher’s Boy Confesses', 'Quiet inquiries reveal a scared kitchen lad took a pinch of arsenic mixed with tallow—not for lords, but for palace pantry rats!', [
   ['Verify his story in pantry floorboards and hire proper rat-catchers', 45, { securityMonths: 8, food: 30, stress: -8 }],
   ['Ban loose arsenic completely from kitchens and use lime traps instead', 30, { securityMonths: 9, stability: 6 }],
   ['Rebuke the careless apothecary’s open drawer gently', 0, { legitimacy: 6, stress: -4 }]
  ]],
  ['Wait—One Vial Still Unaccounted For?', 'Double-checking grain weights reveals half an ounce still missing beyond what the boy spread behind flour barrels.', [
   ['Trace the senior clerk’s gambling tavern debts silently', 65, { securityMonths: 11, legitimacy: 6 }],
   ['Rotate all privy pantry locks and silver tasters quietly', 40, { securityMonths: 10 }],
   ['Keep vigilant calm at court banquets', 0, { securityMonths: 6, stress: 3 }]
  ]],
  ['Quiet Locks & Clear Tables', 'Tightened apothecary ledgers and watchful tasters close every careless gap around royal tables.', [
   ['Enforce dual-key poison registers on every city apothecary', 45, { legitimacy: 8, securityMonths: 8 }],
   ['Thank alert cellar guards', 20, { stress: -6 }],
   ['Close the apothecary audit', 0, { stability: 4 }]
  ]]
 );

 arc4('fs_her_saint_cult', 'Religion', 'lowFaithAuthority',
  ['Unauthorized Hermit Preaches Near Frontier', 'A charismatic barefoot hermit gathers thousands beside a forest spring, blessing amulets and mocking tax-paying cathedral prelates.', [
   ['Send gentle learned abbots to test his piety and bring his flock inside parish care', 85, { piety: 10, trust: 9, faithAuthority: 7 }],
   ['Inspect the spring calmly for fraud while respecting honest folk devotion', 45, { legitimacy: 8, trust: 7, securityMonths: 6 }],
   ['Disperse unlawful forest crowds cleanly before tax unrest spreads', 0, { faithAuthority: 7, securityMonths: 7, unrest: 3 }]
  ]],
  ['Soldiers Find Genuine Charity Not Coin', 'Visitors find no hidden gold chests in his hut—only barley soup kettles feeding sixty poor woodcutters daily.', [
   ['Endow his forest kitchen properly under regular parish abbey oversight', 80, { piety: 12, trust: 11, food: 30 }],
   ['Invite the hermit humbly to bless the capital infirmary', 35, { piety: 10, legitimacy: 7 }],
   ['Leave his hut undisturbed while posting polite forest bailiffs', 0, { stability: 6, piety: 6 }]
  ]],
  ['Proud Bishops Object to Peasant Praise', 'A few haughty cathedral canons sniff that untutored forest mystics shame formal theology.', [
   ['Remind prelates gently that charity feeds faith better than silk robes', 35, { piety: 9, trust: 9, faithAuthority: 5 }],
   ['Pair a modest deacon alongside the hermit to keep liturgy sound', 40, { faithAuthority: 8, piety: 7 }],
   ['Balance cathedral dignity and humble forest piety gracefully', 0, { stability: 6 }]
  ]],
  ['Faith Renewed From Root to Spire', 'Honoring humble sincerity without losing orderly church governance deepens devotion across estates.', [
   ['Built a modest stone shelter chapel beside the spring', 55, { piety: 10, development: 1 }],
   ['Record the reconciliation in bishopric chronicles', 20, { legitimacy: 6 }],
   ['Close the frontier inquiry', 0, { stability: 4 }]
  ]]
 );

 arc4('fs_fam_married_garden', 'Family', 'married',
  ['Roses & Herbs in the Queen’s/Consort’s Court', 'Your consort begs to convert a neglected stone tilt-yard beside inner chambers into a quiet walled orchard and botanical garden.', [
   ['Fund marble basins, rare southern citrus trees, and glass winter frames', 115, { opinion: 16, stress: -10, prestige: 9 }],
   ['Plant useful culinary herbs, pear trees, and shaded stone benches', 55, { opinion: 11, stress: -7, food: 25 }],
   ['Permit modest flower beds tended by household pages', 0, { opinion: 6, stress: -4 }]
  ]],
  ['Grumpy Captains Miss the Tilt-Yard', 'Grizzled household knights grumble at hauling practice quintains out to outer meadow fields.', [
   ['Build spacious broader tilt-lists outside walls with grand spectator stands', 85, { prestige: 9, stability: 6, opinion: 8 }],
   ['Compensate captains with bright new saddlecloths and pavilion tents', 45, { prestige: 7, stability: 5 }],
   ['Remind knights outer meadows suit cavalry maneuvers far better', 0, { legitimacy: 5 }]
  ]],
  ['Botanical Cuttings Arrive From Embassies', 'Foreign visitors begin gifting exotic irises, saffron bulbs, and aromatic mints for the quiet palace orchard.', [
   ['Share dried medicinal cuttings freely with capital hospitals', 45, { research: 8, piety: 8, opinion: 9 }],
   ['Host quiet twilight walks for tired councillors and envoys', 30, { stress: -10, opinion: 10 }],
   ['Catalog every rare plant in painted vellum folios', 0, { research: 7, prestige: 6 }]
  ]],
  ['Sanctuary Behind Palace Walls', 'Whenever council storms roar outside, ten quiet minutes beneath pear blossoms steadies mind and marriage alike.', [
   ['Carve shared initials above the garden gate', 30, { prestige: 7, opinion: 9 }],
   ['Keep garden benches open on summer afternoons', 20, { stress: -6 }],
   ['Close the garden works', 0, { stability: 4 }]
  ]]
 );

 arc4('fs_suc_claimant_marriage', 'Succession', 'livingClaimant',
  ['Claimant Seeks a Powerful Foreign Bride', 'Secret scouts warn your living royal claimant opened marriage talks with an ambitious frontier duke’s daughter.', [
   ['Invite both houses cleanly to court and arrange a loyal domestic match instead', 115, { opinion: 14, legitimacy: 9, stability: 8 }],
   ['Grant the claimant honored realm estates tied to marriage consent', 65, { legitimacy: 8, opinion: 10, securityMonths: 7 }],
   ['Warn foreign dukes firmly against unauthorized dynastic compacts', 0, { legitimacy: 8, prestige: 6, stress: 3 }]
  ]],
  ['Duke’s Envoy Sounds Out Royal Mood', 'The frontier duke sends polite letters asking whether the crown blesses uniting ancient houses peacefully.', [
   ['Bless the union warmly on condition of solemn succession renunciation oaths', 75, { legitimacy: 11, opinion: 12, stability: 8 }],
   ['Host wedding talks directly inside the royal palace under close watch', 55, { securityMonths: 9, prestige: 8 }],
   ['Decline the foreign match firmly in favor of court unity', 0, { legitimacy: 7, opinion: -5 }]
  ]],
  ['Wedding Guests Crowd the Cathedral', 'With oaths signed and seals fixed, trumpets hail a festive marriage tying restless lines safely inside royal loyalty.', [
   ['Present matched silver goblets to the bride and claimant', 60, { prestige: 9, opinion: 14 }],
   ['Record signed renunciation parchments in three archives', 25, { legitimacy: 9, securityMonths: 7 }],
   ['Celebrate modestly and return to statecraft', 0, { stability: 6 }]
  ]],
  ['Thorn Turned Into Garland', 'Thoughtful dynastic statesmanship transforms a threatening foreign match into a loyal pillar.', [
   ['Attend the couple’s first manor feast', 35, { opinion: 10, stress: -4 }],
   ['Archive the marriage treaty cleanly', 20, { legitimacy: 6 }],
   ['Close the dynastic dossier', 0, { stability: 4 }]
  ]]
 );

 arc4('fs_sch_university_riot', 'Culture & Learning', 'unrest',
  ['Town & Gown Brawl Over Tavern Wine', 'Drunken university scholars clash with city cobblers after an unpaid wine score turns into club-swinging street chaos.', [
   ['Convene mixed rector-and-alderman courts to punish bullies on both sides fairly', 85, { legitimacy: 9, unrest: -10, trust: 9 }],
   ['Reimburse shattered cobbler stalls and enforce evening student curfews', 65, { unrest: -9, stability: 7, credit: 5 }],
   ['Confine scholars inside college gates while city watch clears alleys', 0, { securityMonths: 7, unrest: -5 }]
  ]],
  ['Masters Threaten Migrating to Rival City', 'Proud university doctors pack trunks, threatening to relocate their entire guild of scholars unless academic immunities hold.', [
   ['Confirm scholarly privileges cleanly while banning swords inside taverns', 55, { research: 10, legitimacy: 8, stability: 7 }],
   ['Endow clean stone student hostels with honest dining halls', 95, { development: 1, research: 9, trust: 8 }],
   ['Remind masters city peace shields books as much as bakers', 0, { legitimacy: 6, trust: 5 }]
  ]],
  ['Cobblers & Students Share Harvest Play', 'To mend raw nerves, university rhetoric students stage a lively comedic street play praising honest shoemakers and brewers.', [
   ['Attend the open play and toss silver pennies to actors and guildmen', 50, { trust: 10, prestige: 8, unrest: -6 }],
   ['Sponsor annual town-and-gown archery and rowing contests', 45, { trust: 8, acceptance: 7 }],
   ['Keep night lanterns burning down student lanes', 0, { securityMonths: 6, stability: 5 }]
  ]],
  ['Books & Cobblestones at Peace', 'Fair courts and better student halls keep bustling learning cities peaceful without stifling spirited youth.', [
   ['Inscribe the Town-and-Gown Peace Charter', 35, { legitimacy: 8, research: 5 }],
   ['Thank calm guild elders and college deans', 20, { trust: 6 }],
   ['Close the university inquiry', 0, { stability: 4 }]
  ]]
 );

 arc4('fs_mon_bell_heretic', 'Religion', 'faithDebate',
  ['Philosopher Questions Eternal Matter', 'A brilliant university lecturer circulates subtle theses questioning classical views on creation and soul—sparking fierce synod petitions.', [
   ['Protect calm academic debate inside Latin lecture halls while shielding faith', 85, { research: 12, prestige: 6, stability: 5 }],
   ['Require polite clarifying prefaces reconciling philosophy with creed', 40, { faithAuthority: 7, research: 7, legitimacy: 6 }],
   ['Censure the bold theses cleanly to keep doctrinal harmony', 0, { faithAuthority: 10, piety: 7, research: -2 }]
  ]],
  ['Students Crowd Lecture Benches', 'News of the debate fills timber halls with eager youths copying every syllable by candlelight.', [
   ['Endow a balanced Chair of Natural Philosophy alongside Theology', 95, { research: 13, prestige: 9 }],
   ['Hold an open disputation chaired calmly by respected bishops', 50, { faithAuthority: 7, research: 8 }],
   ['Confine debate strictly to graduate doctors behind closed doors', 0, { securityMonths: 7, stability: 5 }]
  ]],
  ['The Philosopher Answers Calmly', 'Speaking respectfully before prelates, the scholar clarifies his mathematical arguments without mocking sacred liturgy.', [
   ['Commend his reverence and archive both treatises side by side', 45, { research: 9, prestige: 8, faithAuthority: 5 }],
   ['Invite him onto royal calendar and optics committees', 40, { research: 10, legitimacy: 6 }],
   ['Accept his clarifying preface cleanly', 0, { stability: 6 }]
  ]],
  ['Mind & Altar Harmonized', 'Measured poise lets natural science flourish without tearing apart civic devotion.', [
   ['Grant the university fresh library ink grants', 45, { research: 8, prestige: 6 }],
   ['Thank wise prelates for restraint', 20, { piety: 6, stress: -4 }],
   ['Close the synod disputation', 0, { stability: 4 }]
  ]]
 );

 arc4('fs_sec_garden_spy', 'Intrigue', 'detectedPlot',
  ['Bribed Laundress in the Guardhouse', 'Counter-watch catches a foreign envoy’s servant slipping silver pennies into a royal guard’s linen bundle inside the courtyard.', [
   ['Turn the guard cleanly to feed false fortification strengths abroad', 80, { securityMonths: 11, prestige: 6 }],
   ['Interrogate quietly to uncover every other bribed servant in palace wings', 45, { securityMonths: 10, stability: 5 }],
   ['Dismiss the guard silently and tighten gate searches', 0, { securityMonths: 7, legitimacy: 4 }]
  ]],
  ['Fake Cipher Ledger Prepared', 'Your spymaster drafts convincing bogus supply figures showing phantom regiments guarding southern passes.', [
   ['Leak the bogus tally cleanly inside the laundered doublet lining', 40, { securityMonths: 10, prestige: 7 }],
   ['Double-check that no loyal commander mistakes fake sheets for real orders', 25, { legitimacy: 6, securityMonths: 7 }],
   ['Hold the decoy brief until next foreign envoy arrives', 0, { securityMonths: 6 }]
  ]],
  ['Foreign Garrison Shifts Away!', 'Weeks later, border scouts report rival forces marching north chasing shadows—leaving vital roads open.', [
   ['Quietly summon the double-guard to clear his name and retire safely', 55, { securityMonths: 9, stability: 7 }],
   ['Keep the decoy channel open with harmless minor trivia', 35, { securityMonths: 8, stress: -4 }],
   ['Sever the link cleanly now that deception succeeded', 0, { securityMonths: 7 }]
  ]],
  ['Shadow Victory', 'Not a single sword left its scabbard, yet cunning counter-espionage crippled rival plans cleanly.', [
   ['Reward silent counter-intelligence clerks', 40, { securityMonths: 8, stress: -5 }],
   ['Upgrade palace laundry and kitchen vetting rules', 25, { legitimacy: 6 }],
   ['Close the counter-watch file', 0, { stability: 4 }]
  ]]
 );

 arc4('fs_med_midwife_guild', 'Society', 'illness',
  ['Childbed Fever Alarms Noble & Peasant Alike', 'Seasoned mothers beg for trained midwives after clumsy untrained quacks cause tragic losses across town.', [
   ['Charter a salaried Guild of Midwives trained in clean hands and herbal care', 115, { health: -16, research: 9, prestige: 7 }],
   ['Print clear plain-language childbirth guides for rural parish women', 65, { health: -11, research: 8 }],
   ['Reserve top court midwives for palace chambers while advising parishes', 0, { health: -7, stability: 4 }]
  ]],
  ['Male Surgeons Jealous of Guild Charters', 'Barber-surgeons complain independent licensed midwives infringe their ancient monopoly on irons and poultices.', [
   ['Define clear harmonious domains—midwives for birth, surgeons for blades', 50, { legitimacy: 9, stability: 7, health: -8 }],
   ['Require both guilds to share clean hot-water and vinegar rules', 35, { research: 7, health: -6 }],
   ['Uphold royal midwife protection firmly against guild jealousy', 0, { legitimacy: 8, health: -6 }]
  ]],
  ['Clean Linen Saves Mothers', 'Warm washed hands, clean linen, and gentle herbals slash childbed deaths dramatically across wards.', [
   ['Endow dedicated lying-in wards inside civic hospitals', 85, { health: -12, piety: 9, prestige: 8 }],
   ['Award silver badges to veteran parish midwives', 35, { prestige: 7, health: -5 }],
   ['Keep training apprentices steadily', 0, { research: 6 }]
  ]],
  ['Stronger Cradles Across the Realm', 'Healthy births swell parishes and bring heartfelt gratitude toward thoughtful royal care.', [
   ['Establish annual midwife stipends in poor districts', 45, { piety: 8, health: -6 }],
   ['Archive survival tallies proudly', 20, { research: 5 }],
   ['Close the maternity guild charter', 0, { stability: 4 }]
  ]]
 );

 arc4('fs_fam_child_violin', 'Family', 'child',
  ['Broken Lute in the Nursery Closet', 'Tutors catch your young royal child secretly carving pinewood pegs trying to build a bowed fiddle instead of finishing sum-books.', [
   ['Hire a gentle master musician alongside firm afternoon math lessons', 85, { education: 12, prestige: 7, stress: -5 }],
   ['Allow music study strictly as weekend reward for finished ledgers', 35, { education: 10, stress: -3 }],
   ['Lock craft knives away until Latin primers finish cleanly', 0, { education: 5, stress: 2 }]
  ]],
  ['The Youth Designs a Cleaner Soundboard', 'Applying arithmetic ratios from geometry lessons, the child surprises carpenters with balanced fiddle bridge measurements.', [
   ['Praise how math and craft illuminate each other—fueling dual enthusiasm', 45, { education: 12, research: 7 }],
   ['Commission a fine maple fiddle from palace instrument makers', 65, { prestige: 8, education: 8 }],
   ['Encourage quiet evening practice after lessons', 0, { education: 6, stress: -4 }]
  ]],
  ['First Recital Before Foreign Envoys', 'During a stiff autumn banquet, the youth steps shyly forward and plays a crisp, bright court air without a single flinch.', [
   ['Applaud warmly and let guests praise the dynasty’s cultured poise', 50, { prestige: 11, education: 8 }],
   ['Keep the moment modest and family-focused', 25, { stress: -6, legitimacy: 5 }],
   ['Thank tutors quietly behind arras curtains', 0, { stability: 5 }]
  ]],
  ['Poise & Craft Combined', 'Encouraging curiosity alongside discipline raises an accomplished young dynast comfortable in both hall and study.', [
   ['Gift bound music and geometry primers together', 30, { education: 8, research: 5 }],
   ['Archive the recital memory', 20, { prestige: 5 }],
   ['Close the nursery progress note', 0, { stability: 4 }]
  ]]
 );

 arc4('fs_mon_icon_painter', 'Culture & Learning', 'faith_christian',
  ['Frescoes Peeling Above Abbey Choir', 'Damp plaster threatens medieval wall-paintings; master painters propose modern perspective oils over glowing lime.', [
   ['Commission living perspective frescoes honoring saints and royal deeds', 135, { prestige: 12, piety: 10, research: 7 }],
   ['Carefully preserve ancient revered frescoes with gentle wax sealing', 70, { piety: 10, faithAuthority: 7, prestige: 6 }],
   ['Whitewash flaking plaster cleanly for bright sunlit worship', 0, { piety: 5, stability: 4 }]
  ]],
  ['Painters Use Local Villagers as Models', 'Gossips gasp seeing familiar market mothers and blacksmiths painted into biblical harvest crowds.', [
   ['Praise honest native faces—faith lives inside daily parish labor', 45, { trust: 9, piety: 8, acceptance: 7 }],
   ['Keep sacred figures strictly stylized while painting real donors below', 30, { faithAuthority: 7, prestige: 7 }],
   ['Let the abbey prior guide artistic taste quietly', 0, { stability: 5 }]
  ]],
  ['Pigments & Linseed Oil Guilds Thrive', 'Demand for ultramarine lapis, ochre, and boiled linseed oil sparks lively apprentice workshops beside cathedral gates.', [
   ['Endow an Academy of Painting and Perspective beside the abbey', 85, { research: 11, prestige: 10, development: 1 }],
   ['Purchase gilded altarpieces for frontier chapels', 55, { piety: 9, prestige: 7 }],
   ['Inspect finished scaffolding safely before unveiling', 0, { stability: 5 }]
  ]],
  ['Color Shining From Vaulted Stone', 'Unveiled frescoes draw pilgrims and travelers across provinces, lending spiritual beauty to the realm.', [
   ['Reward master painters with royal heraldic crests', 40, { prestige: 9 }],
   ['Endow eternal candle lamps before the choir', 25, { piety: 7 }],
   ['Close the cathedral art commission', 0, { stability: 4 }]
  ]]
 );

 arc4('fs_soc_print_witch_almanac', 'Society', 'crossroads_press',
  ['Cheap Fortune-Telling Chapbooks Flood Fairs', 'Peddlers hawk wildly popular astrological chapbooks predicting royal misfortunes and crooked harvests for a single copper penny.', [
   ['Counter nonsense gently with crisp, entertaining printed farmer almanacs', 95, { research: 10, food: 40, trust: 8 }],
   ['Outlaw printed sedition predicting ruler deaths while ignoring harmless horoscopes', 35, { legitimacy: 8, securityMonths: 8 }],
   ['Confiscate hawkers’ baskets at town gates cleanly', 0, { securityMonths: 7, stability: 4 }]
  ]],
  ['Printers Grumble Over Lost Bread-and-Butter', 'Small alley printers plead that highbrow Latin law-books gather dust while fun penny chapbooks pay the rent.', [
   ['Commission lively popular ballads, maps, and recipes from small printers', 75, { credit: 8, research: 8, trust: 8 }],
   ['Grant tax-free paper reams for honest schoolbooks and calendars', 45, { research: 9, credit: 6 }],
   ['Remind printers sedition never qualifies as honest ink', 0, { legitimacy: 6 }]
  ]],
  ['Literacy Spreads Through Rural Barns', 'Farmhands sound out bright printed proverbs and planting rhymes beside winter hearths.', [
   ['Fund village evening reading circles in parish church porches', 70, { research: 10, trust: 9, piety: 6 }],
   ['Print simple clean weight-and-coin cheat sheets for market women', 35, { credit: 7, trust: 8 }],
   ['Let chapbooks circulate cleanly under imprint stamps', 0, { credit: 5, securityMonths: 5 }]
  ]],
  ['From Superstition to Curious Minds', 'Redirecting cheap print from fearmongering into practical almanacs raises rural literacy cleanly.', [
   ['Establish a Royal Imprint Stamp of Quality', 40, { legitimacy: 7, prestige: 6 }],
   ['Archive sample folk almanacs in the library', 20, { research: 5 }],
   ['Close the chapbook review', 0, { stability: 4 }]
  ]]
 );

 arc4('fs_suc_foreign_match_dowry', 'Family', 'foreignMarriage',
  ['Dowry Chests Locked in Customs Dispute', 'Border officers delay your foreign consort’s wedding-chest textiles under ordinary wool duties, offending proud in-law ambassadors.', [
   ['Grant sweeping royal immunity, feast the escort, and pay port fees yourself', 95, { relation: 15, opinion: 14, prestige: 9 }],
   ['Waive customs immediately by emergency signet letter', 35, { relation: 10, opinion: 10 }],
   ['Enforce strict search of non-personal merchant bales hiding inside the train', 0, { securityMonths: 7, credit: 4, relation: -4 }]
  ]],
  ['Hidden Merchant Silk Discovered?', 'Your consort laughs ruefully—two opportunistic border cousins slipped six bolts of trade velvet inside the luggage train!', [
   ['Donate the six velvet bolts jointly to capital orphanages to save all faces', 55, { piety: 10, opinion: 12, relation: 8 }],
   ['Tax only the merchant cousin quietly without shaming the marriage train', 30, { credit: 7, relation: 7, legitimacy: 6 }],
   ['Confiscate contraband bolts sternly to uphold customs honesty', 0, { gold: 75, legitimacy: 6, opinion: -5 }]
  ]],
  ['Warm Banquet Restores Bridal Joy', 'With chests opened in sunlit courtyard, exotic carpets and family miniatures delight courtiers.', [
   ['Display consort family crests warmly beside royal banners', 50, { prestige: 10, opinion: 12, relation: 9 }],
   ['Send return amber and wool gifts back with the escort', 60, { relation: 12, prestige: 8 }],
   ['Retire happily to quiet wedding feasts', 0, { stress: -8, opinion: 8 }]
  ]],
  ['Clean Skies Over Two Crowns', 'Graceful tact clears petty border dust and seals a warm, loyal household.', [
   ['Inscribe reciprocal marriage courier immunities', 35, { relation: 8, legitimacy: 6 }],
   ['Thank patient envoys', 20, { prestige: 5 }],
   ['Close the wedding customs file', 0, { stability: 4 }]
  ]]
 );

 arc4('fs_court_councillor_bribe', 'Court', 'councillor',
  ['Velvet Purse Left on the Steward’s Bench', 'An honest councillor brings an unmarked leather pouch of gold left anonymously beside his garden gate by timber contractors.', [
   ['Use the pouch as bait to trap crooked contractors in open court', 65, { legitimacy: 11, securityMonths: 9, opinion: 12 }],
   ['Praise his integrity publicly and double independent contract audits', 55, { opinion: 14, credit: 8, legitimacy: 8 }],
   ['Confiscate the pouch quietly for almshouses and blackball the contractors', 0, { gold: 75, piety: 7, opinion: 8 }]
  ]],
  ['Contractors Cry "Customary Gratitude"', 'Dragged before council, timber brokers protest that modest "ink-money" gifts to stewards are ancient custom everywhere.', [
   ['Outlaw all contractor gifts above a penny candle strictly by statute', 45, { legitimacy: 11, credit: 8, stability: 6 }],
   ['Raise official councillor salaries cleanly so honest men never need tips', 95, { opinion: 14, stability: 8, legitimacy: 8 }],
   ['Fine the brokers heavily and strip their licenses', 0, { gold: 90, securityMonths: 7 }]
  ]],
  ['Other Clerks Come Forward Nervous', 'Inspired—or frightened—three junior scribes confess accepting festival hams and wine casks from salt merchants.', [
   ['Grant clean amnesty for past holiday hams while enforcing zero gifts ahead', 35, { stability: 8, opinion: 9 }],
   ['Audit past salt contracts calmly to ensure zero crown loss', 45, { credit: 7, legitimacy: 7 }],
   ['Require annual signed conflict-of-interest oaths from all clerks', 0, { securityMonths: 8, legitimacy: 6 }]
  ]],
  ['Incorruptible Bench', 'Honoring one upright councillor anchors cleaner standards across the entire royal bureaucracy.', [
   ['Award the honest councillor a gold-chained Seal of Integrity', 40, { prestige: 9, opinion: 12 }],
   ['Publish clean Crown Procurement Rules', 30, { legitimacy: 8, credit: 5 }],
   ['Close the bribery inquiry', 0, { stability: 4 }]
  ]]
 );

 arc4('fs_mon_dharmic_debate', 'Religion', 'faith_dharmic',
  ['Philosophical Debate at the Royal Hall', 'Renowned monastic dialecticians of rival lineages challenge one another to a seven-day public logic disputation before the throne.', [
   ['Sponsor the grand debate with silver honors for both sides’ finest scholars', 115, { research: 14, prestige: 11, acceptance: 9 }],
   ['Ensure calm fair rules and publish verbatim debate summaries', 55, { research: 10, legitimacy: 7, acceptance: 7 }],
   ['Host quiet temple-hall sessions away from street crowds', 0, { piety: 7, stability: 5 }]
  ]],
  ['Heated Crowd Outside the Pillared Hall', 'Passionate disciples cheer favorite syllogisms along market steps, nearly coming to shoves over Sanskrit verses.', [
   ['Serve free cool rose-water and betel trays to all spectators in peace', 55, { trust: 10, acceptance: 9, unrest: -6 }],
   ['Post calm ceremonial mace-bearers keeping debates purely verbal', 25, { securityMonths: 7, stability: 6 }],
   ['Remind disciples true wisdom shows serenity under scrutiny', 0, { piety: 8, faithAuthority: 5 }]
  ]],
  ['Victory of Subtle Logic', 'Rather than humiliating losers, the winning elder bows respectfully and invites opponents to co-edit a joint logic treatise.', [
   ['Endow stone library chambers preserving both traditions side by side', 90, { research: 13, development: 1, piety: 9 }],
   ['Award silk shawls and land grants to both monastic schools', 65, { loyalty: 7, prestige: 9, trust: 8 }],
   ['Record the debate verdict in royal inscriptions', 0, { legitimacy: 7, prestige: 6 }]
  ]],
  ['Kingdom of Living Learning', 'Scholarly chivalry elevates your court into a celebrated center of dharmic inquiry.', [
   ['Make the annual Royal Logic Disputation a proud tradition', 45, { research: 9, prestige: 8 }],
   ['Feed temple pilgrims richly on closing day', 30, { piety: 8, food: -15 }],
   ['Close the assembly hall', 0, { stability: 4 }]
  ]]
 );

 arc4('fs_mon_islamic_observatory', 'Religion', 'faith_islamic',
  ['Great Masonry Sextant on the Hill', 'Astronomers propose sinking a giant marble sextant arc deep into bedrock outside the capital to measure solar noon to the second.', [
   ['Build the hill observatory, library tower, and scholars’ quarters', 155, { research: 16, prestige: 12, development: 1 }],
   ['Fund portable brass astrolabes and water-clocks for existing madrasas', 80, { research: 11, credit: 6, piety: 7 }],
   ['Grant hilltop land calmly while private patrons fund masonry', 0, { research: 6, prestige: 5 }]
  ]],
  ['Superstitious Whispers About Star-Gazing', 'A few literalist street preachers mutter that peering into heavenly secrets invites celestial wrath or astrology.', [
   ['Have pious astronomers show how exact tables guide prayer times and qibla', 55, { piety: 10, faithAuthority: 8, research: 8 }],
   ['Keep astrology horoscopes strictly barred while honoring pure geometry', 35, { legitimacy: 8, faithAuthority: 7 }],
   ['Invite respected muftis onto the observatory terrace to sight the crescent', 0, { piety: 9, acceptance: 7 }]
  ]],
  ['New Planetary Tables Compiled', 'Years of patient dawn sights produce crisp star tables correcting older ephemerides by whole degrees.', [
   ['Bind gilded Star Tables for friendly courts and sea admirals', 65, { prestige: 12, research: 10, credit: 6 }],
   ['Translate tables into Latin and Persian copies for broad exchange', 45, { research: 10, acceptance: 8 }],
   ['Store master brass arcs cleanly against wind and dust', 0, { securityMonths: 6, research: 5 }]
  ]],
  ['Crown of the Heavens', 'Monumental instruments earn timeless renown for precision, piety, and scientific courage.', [
   ['Endow permanent stipends for six resident astronomers', 60, { research: 11, prestige: 8 }],
   ['Stamp star-emblems onto commemorative silver coins', 30, { prestige: 8, credit: 5 }],
   ['Close the observatory dedication', 0, { stability: 4 }]
  ]]
 );

 arc4('fs_mon_tradition_epics', 'Religion', 'faith_traditions',
  ['Fading Memories of the Elder Bards', 'Aging oral historians warn young scribes forget complex ancestral lineage chants and seasonal star-lore once spoken round every hearth.', [
   ['Patronize elder bards to teach youths and record chants respectfully', 110, { research: 11, piety: 10, trust: 10 }],
   ['Host grand seasonal storytelling gatherings with food and robes', 65, { trust: 10, acceptance: 8, prestige: 8 }],
   ['Invite elders into royal council feasts to chant founding oaths', 0, { legitimacy: 8, piety: 6 }]
  ]],
  ['Debate Over Writing Sacred Chants', 'Some keepers fear ink freezes living spirit, while younger recorders dread losing entire clan histories to plague or age.', [
   ['Honor oral secrecy for sacred rites while writing public histories', 50, { acceptance: 10, piety: 9, legitimacy: 7 }],
   ['Endow lifelong hearth fellowships so pairs of young bards memorize whole', 75, { trust: 10, piety: 9, research: 7 }],
   ['Follow elders’ own wise counsel on what may be inscribed', 0, { trust: 8, acceptance: 7 }]
  ]],
  ['Painted Cloths & Carved Staffs', 'Artisans weave story-cloths and notch memory staffs alongside chanting schools, uniting eyes and ears.', [
   ['Display revered heritage cloths in civic meeting halls', 55, { prestige: 9, trust: 8, legitimacy: 6 }],
   ['Fund carving apprentices beside master keepers', 40, { tools: 12, acceptance: 7 }],
   ['Keep sacred staffs inside ancestral shrines', 0, { piety: 8 }]
  ]],
  ['Living Memory Preserved', 'Honored bards pass unbroken epics down to bright-eyed youths, anchoring identity across changing times.', [
   ['Establish an annual Heritage Recitation Feast', 45, { prestige: 8, trust: 8 }],
   ['Gift warm woven blankets to elder keepers', 25, { piety: 7, trust: 6 }],
   ['Close the cultural council', 0, { stability: 4 }]
  ]]
 );

 arc4('fs_soc_secret_ballot', 'Society', 'governmentDebate',
  ['Loud Intimidation at the Assembly Vote', 'Armed retainers crowd town council benches shouting down modest burghers during tax votes, turning debate into fearful silence.', [
   ['Enforce weapon-free council halls and introduce secret ceramic ballot tokens', 95, { legitimacy: 11, stability: 9, stress: -4 }],
   ['Post neutral royal sergeant guards barring retainers at the outer gate', 45, { securityMonths: 8, legitimacy: 8 }],
   ['Call roll calmly in written order under sovereign witness', 0, { legitimacy: 6, stability: 5 }]
  ]],
  ['Magnates Protest "Cowardly Hidden Beans"', 'Proud lords scoff that honorable gentlemen declare votes openly by sword and voice, not silent clay beans.', [
   ['Keep open voice for lords while protecting common delegates’ clay ballots', 50, { stability: 8, legitimacy: 8 }],
   ['Prove secret ballots cut violent tavern retaliations immediately', 30, { legitimacy: 9, stability: 6 }],
   ['Hold firm on weapon-free peaceful halls for all estates', 0, { securityMonths: 8, legitimacy: 7 }]
  ]],
  ['Fair Vote Breaks Deadlock Cleanly', 'Freed from intimidation, delegates swiftly approve overdue road and bridge levies by three-to-one.', [
   ['Thank delegates openly and speed road work immediately', 60, { prestige: 8, stability: 8 }],
   ['Publish clean transparent assembly minutes across counties', 35, { legitimacy: 8, research: 5 }],
   ['Adjourn the assembly in orderly harmony', 0, { stability: 6 }]
  ]],
  ['Voice Without Fear', 'Safe assembly rules turn shouting matches into durable, widely respected statutes.', [
   ['Carve Hall Peace Statutes above chamber doors', 35, { legitimacy: 8 }],
   ['Reward calm assembly clerks', 20, { stability: 5 }],
   ['Close the council chamber', 0, { stress: -4 }]
  ]]
 );

 arc4('fs_med_mental_melancholy', 'Family', 'stress',
  ['Heavy Fog Over the Privy Study', 'After bitter winter losses and endless council wrangling, joy drains out of palace halls; music sounds flat and every quill feels leaden.', [
   ['Open shutters to cold sun, invite honest friends, and walk river meadows', 65, { stress: -22, prestige: 3, stability: 5 }],
   ['Commission bright choral music and humorous mummers for winter nights', 80, { stress: -20, prestige: 8 }],
   ['Focus gently on one small honest garden or book task daily', 0, { stress: -12, research: 4 }]
  ]],
  ['Physicians Recommend Bleak Humors Purge', 'Stern doctors propose bitter black-hellebore purges to drain "black bile", making your stomach turn at the mere smell.', [
   ['Decline harsh purges kindly and choose warm spiced soup and riding', 45, { stress: -14, stability: 4 }],
   ['Listen politely to humane physicians favoring laughter, sleep, and lute song', 55, { stress: -16, research: 5 }],
   ['Take mild rosemary tea and excuse yourself early', 0, { stress: -10 }]
  ]],
  ['Unexpected Letter From Old Youth Tutor', 'An elderly tutor writes recalling how you once conquered impossible storms as a child—offering gentle steadying perspective.', [
   ['Invite the old tutor to dine warmly beside the hearth', 45, { stress: -14, legitimacy: 5 }],
   ['Write back gratefully and sponsor his parish school roof', 55, { piety: 8, research: 6, stress: -10 }],
   ['Keep the warm letter folded inside your ledger book', 0, { stress: -8 }]
  ]],
  ['Morning Sun Over Clear Desk', 'Quiet self-care lifts the winter fog, returning steady patience and humor to royal chambers.', [
   ['Keep one afternoon weekly inviolably free for riding or family', 25, { stress: -10, stability: 5 }],
   ['Thank loyal quiet household companions', 20, { prestige: 5 }],
   ['Close the winter ledger', 0, { stability: 4 }]
  ]]
 );

 arc4('fs_sec_poison_wine_cellar', 'Intrigue', 'detectedPlot',
  ['Bitter Almond Smell in the Gift Cask', 'Your royal cellar-master uncorks a gifted vintage cask from an unfriendly border lord and catches a sharp bitter-almond whiff.', [
   ['Feed a drop to stray cellar mice quietly and seal the cask in iron', 60, { securityMonths: 11, legitimacy: 6 }],
   ['Trace every wagoner and cooper who touched the barrel road-bill', 45, { securityMonths: 10, prestige: 5 }],
   ['Pour the suspect cask quietly down stone drains and double cellar locks', 0, { securityMonths: 8, stress: 2 }]
  ]],
  ['Coopers Reveal Mid-Journey Tampering', 'Cleanly questioned coopers point out fresh pitch around the bung-hole—applied at an inn ten leagues inside your own border!', [
   ['Raid the border inn swiftly before the tampering agent skips town', 70, { securityMonths: 11, prestige: 7 }],
   ['Have loyal guards impersonate drunken travelers at the inn to catch accomplices', 40, { securityMonths: 10 }],
   ['Alert frontier posts to watch all departing riders', 0, { securityMonths: 8 }]
  ]],
  ['Captured Tamperer Names Court Informant', 'Cornered inside haylofts, the poisoner drops a silver ring matching a disgruntled minor courtier’s crest.', [
   ['Arrest the courtier cleanly at dawn and confiscate estates to crown', 35, { gold: 95, legitimacy: 9, securityMonths: 9 }],
   ['Hold a calm open treason trial proving absolute fairness of proof', 45, { legitimacy: 11, stability: 7 }],
   ['Banish the traitor’s faction silently without panicking guests', 0, { securityMonths: 8, stability: 5 }]
  ]],
  ['Vigilance Protects the Throne', 'Sharp cellar-masters and swift highway justice dismantle a lethal conspiracy before a single drop touched royal lips.', [
   ['Reward the keen-nosed cellar-master with freehold vineyards', 55, { prestige: 8, food: 25 }],
   ['Require sealed wax straps over every gifted barrel bung', 25, { securityMonths: 8 }],
   ['Close the cellar security file', 0, { stability: 4 }]
  ]]
 );

 arc4('fs_fam_ward_orphan_noble', 'Family', 'wardGuardian',
  ['Tearful New Ward Arrives at Night', 'A young ward orphaned by frontier fever arrives clutching a battered wooden horse, terrified of strange marble halls and stern guards.', [
   ['Greet the child personally with warm spiced milk and gentle companions', 65, { opinion: 14, education: 10, stress: -5 }],
   ['Assign a famously kind elder matron and patient guardian together', 45, { opinion: 11, education: 11 }],
   ['Settle the ward cleanly inside bright sunny nursery quarters', 0, { education: 6, opinion: 6 }]
  ]],
  ['Uncle Disputes Ward’s Estate Guardianship', 'Two months later, a greedy uncle petitions to remove the child from palace schooling so he can "manage" orphaned timber estates.', [
   ['Keep royal guardianship intact and appoint honest independent estate stewards', 75, { legitimacy: 10, education: 9, opinion: 10 }],
   ['Require quarterly open court audits before letting the uncle visit', 35, { securityMonths: 8, legitimacy: 8 }],
   ['Rebuff the uncle firmly under ancient royal wardship law', 0, { legitimacy: 8, opinion: 6 }]
  ]],
  ['Brave Speech at First Poetry Day', 'Protected and thriving, the ward stands tall before tutors reciting clean heroic verse without a tremor.', [
   ['Gift the child a fine pony and embossed saddle', 60, { prestige: 8, opinion: 14, education: 8 }],
   ['Send warm letters praising growth to loyal kin back home', 25, { opinion: 9, stability: 6 }],
   ['Applaud warmly alongside the guardian', 0, { education: 6, stress: -4 }]
  ]],
  ['Loyal House Raised Under Crown Wing', 'Kindness in frightened childhood builds fierce lifelong devotion when the ward comes into wide border lands.', [
   ['Confirm the ward’s unplundered inheritance rolls cleanly', 35, { legitimacy: 9, opinion: 10 }],
   ['Thank the patient guardian', 20, { prestige: 5 }],
   ['Close the wardship journal', 0, { stability: 4 }]
  ]]
 );

 arc4('fs_soc_print_women_authors', 'Culture & Learning', 'crossroads_press',
  ['Poetess Prints Letters on Household Law', 'A learned noblewoman publishes witty printed dialogues questioning unfair widow-inheritance customs, selling out three press runs in a fortnight.', [
   ['Invite her dialogues into court legal reviews and protect her press', 95, { research: 12, legitimacy: 8, acceptance: 9 }],
   ['Welcome lively literary salons debating inheritance reform peacefully', 50, { research: 9, prestige: 8, stability: 5 }],
   ['Keep legal changes inside formal jurist councils while allowing book sales', 0, { research: 6, legitimacy: 5 }]
  ]],
  ['Grumbling Elders Call Ink "Unseemly"', 'Pomposity flares among stiff lawyers demanding printed pamphlets stick to housewifery rather than property statutes.', [
   ['Commission joint jurist-and-widow panels checking real county dower abuses', 65, { legitimacy: 10, trust: 9, research: 7 }],
   ['Defend courteous public letters freely within loyal law', 30, { acceptance: 8, prestige: 7 }],
   ['Keep debates civil and scholarly inside guild halls', 0, { stability: 6 }]
  ]],
  ['Fair Widow Dower Protections Drafted', 'Shocked by honest testimonies of cheated widows, parliament clerks draft crisp protections guarding hearth-rights.', [
   ['Enact clear Widow & Orphan Property Protections under crown seal', 55, { legitimacy: 11, trust: 11, stability: 7 }],
   ['Provide free county notary copies for modest households', 35, { trust: 8, credit: 5 }],
   ['Record the legal reform cleanly', 0, { legitimacy: 7 }]
  ]],
  ['Sharp Pens Mend Quiet Injustice', 'Printed wit turns polite parlor debates into concrete legal mercy across every parish.', [
   ['Endow scholarships open to daughters of loyal scholars', 65, { research: 10, acceptance: 9 }],
   ['Receive the author graciously at winter court', 25, { prestige: 8 }],
   ['Close the legal printing docket', 0, { stability: 4 }]
  ]]
 );

 arc4('fs_mon_island_hermitage', 'Religion', 'sanctuary',
  ['Storm Cuts Off Sea-Stack Hermitage', 'Winter gales smash the landing steps of an ancient sea-stack monastery housing revered coastal relics and storm-watch bells.', [
   ['Cut stone storm-steps, build bronze fog-bells, and stock dry grain', 140, { piety: 12, development: 1, trust: 10 }],
   ['Charter rugged coastal rescue-boats carrying food to the monks', 65, { piety: 9, trust: 8, food: 25 }],
   ['Evacuate elderly monks to mainland abbeys till spring calm', 0, { piety: 6, stability: 5 }]
  ]],
  ['Monks Spot Shipwrecked Mariners in Surf', 'Hearing shouts through fog, hardy monks haul three frozen foreign sailors up cliff ropes into warm chapel fires.', [
   ['Reward the abbey’s life-saving ropes and signal lanterns generously', 65, { piety: 11, prestige: 9, acceptance: 8 }],
   ['Establish the sea-stack officially as a coastal shipwreck shelter', 40, { trust: 9, credit: 6 }],
   ['Send warm wool cloaks for rescued mariners', 0, { piety: 7, trust: 6 }]
  ]],
  ['Pilgrims Row Out for Blessing of Sea', 'Fishermen and merchant skippers gather in bobbing boats each spring to hear hymns echoing down sea-cliffs.', [
   ['Sponsor an annual Blessing of the Fleets with bread and salt', 60, { piety: 10, food: 40, trust: 9 }],
   ['Mount a permanent oil beacon above the hermitage belfry', 55, { credit: 8, securityMonths: 7 }],
   ['Keep coastal boat blessings simple and devout', 0, { piety: 7 }]
  ]],
  ['Light Over Stormy Waters', 'Cloister charity and bright cliff beacons turn treacherous rocks into cherished coastal guardians.', [
   ['Confirm tax-free lighthouse wood for the hermitage', 35, { piety: 8, credit: 5 }],
   ['Archive shipwreck rescues in harbor books', 20, { prestige: 5 }],
   ['Close the coastal sanctuary grant', 0, { stability: 4 }]
  ]]
 );

 arc4('fs_suc_royal_chronicle', 'Succession', 'newReign',
  ['Official Annals of the New Reign', 'Court historians ask which tone should shape your reign’s opening chronicle—austere legal duty, martial glory, or peaceful prosperity.', [
   ['Commission candid honest chronicles honoring law, craft, and courage alike', 110, { legitimacy: 11, research: 10, prestige: 9 }],
   ['Celebrate ancestral continuity and pious temple patronage vividly', 65, { piety: 9, legitimacy: 9, prestige: 7 }],
   ['Keep simple terse chancery diaries letting deeds speak alone', 0, { legitimacy: 6, stability: 5 }]
  ]],
  ['Chroniclers Uncover Unflattering Precedent', 'Digging through old chests, historians uncover messy bribes paid during a great-grandfather’s disputed accession.', [
   ['Preserve honest full history inside locked scholar archives cleanly', 45, { research: 10, legitimacy: 8 }],
   ['Contextualize old turmoil calmly as proof why clear law matters now', 30, { legitimacy: 9, stability: 6 }],
   ['Leave dusty old personal scandals unprinted in public primers', 0, { prestige: 5, securityMonths: 6 }]
  ]],
  ['Vernacular Copies Sent to Grammar Halls', 'Clear lively royal histories inspire schoolboys and guild apprentices to learn reading through native tales.', [
   ['Print cheap illustrated school editions of realm history', 75, { research: 11, stability: 7, prestige: 7 }],
   ['Deposit illuminated presentation volumes in cathedral libraries', 50, { piety: 7, prestige: 9 }],
   ['Keep palace annals neatly bound in leather', 0, { legitimacy: 5 }]
  ]],
  ['Memory Anchors Sovereignty', 'A clear, unvarnished chronicle binds diverse regions into a shared story larger than any single faction.', [
   ['Appoint a salaried Historiographer Royal', 45, { research: 8, prestige: 7 }],
   ['Thank patient archive scribes', 20, { stability: 5 }],
   ['Close the chronicle commission', 0, { legitimacy: 4 }]
  ]]
 );

 arc4('fs_court_friend_wedding', 'Court', 'courtFriend',
  ['Trusted Friend’s Quiet Betrothal', 'Your loyal court companion humbly begs royal blessing to marry a modest frontier knight’s daughter—fearing proud lords will mock the small dowry.', [
   ['Attend their modest wedding personally and gift a royal silver service', 100, { opinion: 18, prestige: 9, stress: -8 }],
   ['Provide a generous crown bridal purse and host supper inside side halls', 55, { opinion: 14, stability: 6 }],
   ['Send warm signet-sealed blessing letters and fine wine casks', 0, { opinion: 9, stress: -4 }]
  ]],
  ['Snobbish Peers Raise Eyebrows', 'Two grandees exchange pointed smirks over the modest frontier bride’s plain wool gown.', [
   ['Lead the first ceremonial dance with the bride proudly to silence sneers', 35, { prestige: 11, opinion: 16, stability: 6 }],
   ['Remind guests gently that frontier blood guards every pearl on court velvet', 20, { legitimacy: 8, opinion: 10 }],
   ['Keep festivities warm, cheerful, and unpretentious', 0, { stress: -6, opinion: 8 }]
  ]],
  ['Frontier Bride Brings Honest Counsel', 'Quick-witted and candid, the bride whispers practical news about neglected frontier watchtowers and honest village bailiffs.', [
   ['Act on her frontier tips and reward neglected border watchers', 55, { securityMonths: 8, legitimacy: 7, opinion: 9 }],
   ['Welcome her warm candor gladly at informal family suppers', 25, { stress: -8, opinion: 10 }],
   ['Pass border notes calmly to marshals', 0, { stability: 5 }]
  ]],
  ['Bonds Stronger Than Gold', 'Honoring real affection over bloated dowries fills your inner circle with fearless loyalty.', [
   ['Stand godparent gently at their first child’s naming', 35, { piety: 7, opinion: 12 }],
   ['Celebrate warm fellowship across seasons', 20, { stress: -6 }],
   ['Close the household blessing', 0, { stability: 4 }]
  ]]
 );

 arc4('fs_soc_print_censorship', 'Society', 'governmentDebate',
  ['Scurrilous Broadsides Attack Tax Judges', 'Unnamed leaflets nailed to bridges mock named crown judges as bribed donkeys—splitting council between harsh press closures and calm replies.', [
   ['Audit accused judges openly while punishing only proven false libel', 85, { legitimacy: 11, securityMonths: 8, stress: -4 }],
   ['Require real printer names and street addresses on every printed sheet', 40, { legitimacy: 9, securityMonths: 9 }],
   ['Ban anonymous political sheets cleanly across capital presses', 0, { securityMonths: 8, stability: 5 }]
  ]],
  ['One Accused Judge Actually Took Bribes', 'To council’s red-faced shock, open inquiry confirms one minor bridge-magistrate really did pocket tavern bribes!', [
   ['Remove the corrupt judge publicly and thank honest printers for truth', 45, { legitimacy: 13, stability: 8, prestige: 7 }],
   ['Try him swiftly and refund cheated market carters', 55, { legitimacy: 11, credit: 5 }],
   ['Dismiss him quietly without fanning wider street chatter', 0, { securityMonths: 7, stability: 5 }]
  ]],
  ['Responsible Printers Draft Guild Rules', 'Grateful not to face blanket closures, master printers propose their own self-policing guild against blatant slander.', [
   ['Charter the Printers’ Guild under clear fair libel & imprint rules', 65, { research: 10, legitimacy: 9, credit: 6 }],
   ['Offer small royal contracts printing clean legal statutes', 45, { research: 8, legitimacy: 7 }],
   ['Monitor press colophons routinely through chancery clerks', 0, { securityMonths: 7 }]
  ]],
  ['Clean Judges & Free Honest Ink', 'Distinguishing real whistleblower truth from venomous slander strengthens both courts and civic trust.', [
   ['Publish clean judicial ethics oaths across districts', 35, { legitimacy: 8 }],
   ['Reward fair investigating clerks', 20, { stability: 5 }],
   ['Close the press & court debate', 0, { stability: 4 }]
  ]]
 );

 arc4('fs_med_spa_springs', 'Family', 'illness',
  ['Sulfurous Warm Springs in the Valley', 'Elders praise steaming mineral springs two days’ ride west for soothing aching joints, skin rashes, and winter lung coughs.', [
   ['Build stone bath pavilions, clean lodgings, and send the ailing patient', 130, { health: -19, prestige: 8, stress: -8 }],
   ['Escort the patient modestly to tented spring pools with physicians', 65, { health: -13, stress: -5 }],
   ['Bottle fresh mineral water jugs hauled daily back to palace beds', 0, { health: -7, stability: 3 }]
  ]],
  ['Local Villagers Fear Fence-Off', 'Rumors fly that royal builders will wall off healing springs solely for rich silk robes.', [
   ['Build twin clean public pools free for poor citizens beside royal baths', 80, { health: -8, prestige: 9, piety: 7 }],
   ['Guarantee open morning hours forever for valley villagers', 30, { stability: 7, legitimacy: 6 }],
   ['Confirm traditional valley bath access under royal seal', 0, { legitimacy: 5, stability: 4 }]
  ]],
  ['Clear Skin & Limber Step', 'Weeks of warm sulfur baths and gentle valley air bring vivid color back to pale cheeks.', [
   ['Fund physician notes comparing mineral waters on different ailments', 55, { research: 10, health: -6 }],
   ['Gift grateful offerings at the valley chapel', 30, { piety: 8, prestige: 6 }],
   ['Ride calmly back toward the capital', 0, { stress: -8, health: -5 }]
  ]],
  ['Healing Waters Open to All', 'Restored health at court pairs gracefully with clean mineral baths serving common folk for generations.', [
   ['Appoint salaried bathhouse keepers keeping pools clean', 40, { stability: 6, prestige: 6 }],
   ['Celebrate full recovery at palace supper', 25, { prestige: 8, stress: -6 }],
   ['Close the spring cure log', 0, { stability: 4 }]
  ]]
 );

 arc4('fs_suc_heir_knighting', 'Family', 'adultHeir',
  ['Vigil Before the Spur & Sword', 'Your adult heir asks to keep traditional all-night armor vigil before receiving royal spurs—yet modern aides dismiss knightly ceremony as dusty theater.', [
   ['Keep the noble all-night vigil honoring duty, law, and defense of weak', 110, { legitimacy: 11, prestige: 11, education: 10 }],
   ['Hold a crisp morning investiture pairing ancient spurs with council oath', 55, { legitimacy: 9, education: 8, stability: 6 }],
   ['Bestow sword quietly inside family chapel without banquet cost', 0, { piety: 7, opinion: 8, legitimacy: 5 }]
  ]],
  ['Heir Requests Tournament Without Blunted Fun', 'Full of vigor, the heir begs to run three real tilt courses against seasoned border knights rather than soft pageantry.', [
   ['Permit tightly marshaled tilts in heavy tourney plate under sworn judges', 65, { prestige: 10, education: 9, opinion: 9 }],
   ['Channel fiery spirit into coordinated cavalry mock-maneuvers instead', 45, { education: 9, stability: 6 }],
   ['Keep ceremonial lances light and unpointed for safety', 0, { securityMonths: 6, opinion: -2, stability: 5 }]
  ]],
  ['A Bruised Shoulder & Gracious Hand', 'Unhorsed cleanly on the second pass by a grey-bearded veteran, your heir rises grinning and clasps the old knight’s hand.', [
   ['Praise such rare grace in defeat—true mark of sovereign poise', 35, { prestige: 11, legitimacy: 9, opinion: 12 }],
   ['Reward the honest veteran knight with gilded spurs', 45, { prestige: 8, opinion: 9 }],
   ['Share evening spiced wine round campfires together', 0, { stress: -6, opinion: 8 }]
  ]],
  ['Spurs Earned in Spirit', 'Both old barons and young clerks leave amazed by an heir strong enough to laugh gracefully at a clean fall.', [
   ['Inscribe the investiture in household chronicles', 30, { legitimacy: 7, prestige: 6 }],
   ['Send modest alms to frontier widows', 35, { piety: 8 }],
   ['Close the tourney rolls', 0, { stability: 4 }]
  ]]
 );

 arc4('fs_mon_interfaith_hospital', 'Religion', 'faithTension',
  ['Sick Refused at Sectarian Gate', 'During winter coughs, bitter wardens bar feverish minority weavers from an endowed abbey infirmary, claiming beds belong strictly to one flock.', [
   ['Endow an open civic wing welcoming every creed under equal mercy', 130, { acceptance: 14, piety: 10, trust: 11 }],
   ['Remind abbots firmly that true charity asks fever, not creed, at the door', 45, { acceptance: 10, piety: 9, faithAuthority: 5 }],
   ['Order parish shelter barns opened quietly without treasury grants', 0, { acceptance: 6, stability: 5 }]
  ]],
  ['Donors Rally Behind Mercy', 'Moved by shared human distress, merchants of every faith contribute wool blankets and spice jars.', [
   ['Publish a proud civic plaque listing diverse donors side by side', 45, { acceptance: 11, prestige: 8, trust: 9 }],
   ['Provide clean royal broth cauldrons and firewood carts', 55, { food: 35, piety: 8, trust: 8 }],
   ['Keep wards warm and orderly day and night', 0, { stability: 6 }]
  ]],
  ['Preachers Debate Shared Compassion', 'Hotheads who wanted gates locked fall silent as doctors of two traditions consult calmly beside patient cots.', [
   ['Host respectful interfaith physician dialogues at the hospital hall', 50, { research: 9, acceptance: 10 }],
   ['Thank calm abbots publicly for opening hearts', 25, { piety: 8, faithAuthority: 6 }],
   ['Keep ward peace gently policed', 0, { securityMonths: 6, stability: 5 }]
  ]],
  ['Sanctuary Beyond Creed', 'Joint wards save lives and leave lasting moral warmth knitting divided neighborhoods together.', [
   ['Confirm permanent open-charity hospital charter', 40, { legitimacy: 9, acceptance: 9 }],
   ['Celebrate spring recovery bells', 25, { trust: 7, piety: 6 }],
   ['Close the hospital charter file', 0, { stability: 4 }]
  ]]
 );

 arc4('fs_sec_rival_letter_trap', 'Intrigue', 'courtRival',
  ['Forged Treason Letter Dropped in Hall', 'Guards hand you a mud-streaked parchment bearing your court rival’s apparent seal inviting foreign raiders—yet ink looks suspiciously fresh.', [
   ['Test ink-galls silently with archivists before condemning anyone', 65, { securityMonths: 10, legitimacy: 9, research: 5 }],
   ['Confront the rival calmly in private holding the paper beside his real seal', 30, { opinion: 10, securityMonths: 8, legitimacy: 7 }],
   ['Watch both the rival and the guard who "found" it discreetly', 0, { securityMonths: 9, stress: 3 }]
  ]],
  ['Real Forger Exposed Among Clerks', 'Archivists prove the wax impression came from an old broken seal stolen months earlier—planted by a third schemer!', [
   ['Arrest the true schemer and clear your stunned rival publicly', 45, { opinion: 18, legitimacy: 11, stability: 8 }],
   ['Trap the true schemer quietly using your grateful rival’s help', 35, { opinion: 16, securityMonths: 11 }],
   ['Dismiss the scheming clerk cleanly from palace bounds', 0, { securityMonths: 8, opinion: 8 }]
  ]],
  ['Rival Offers Honest Handshake', 'Shaken by how close false ink came to ruining his house, your rival drops petty court feuds.', [
   ['Toast true royal justice together before council', 40, { opinion: 15, stability: 8, prestige: 7 }],
   ['Appoint him onto a useful frontier audit committee', 35, { opinion: 10, legitimacy: 7 }],
   ['Keep steady courteous partnership going forward', 0, { opinion: 8, stress: -5 }]
  ]],
  ['Truth Shines Through Poisoned Ink', 'Refusing hasty panic turns a dangerous frame-up into rare reconciliation.', [
   ['Institute dual notary seal checks on serious treason charges', 35, { legitimacy: 9, securityMonths: 7 }],
   ['Reward sharp-eyed archivists', 20, { research: 5, prestige: 5 }],
   ['Close the forgery inquiry', 0, { stability: 4 }]
  ]]
 );

 arc4('fs_sch_translation_bureau', 'Culture & Learning', 'research',
  ['Lost Greek & Arabic Treatises Unpacked', 'Merchants deliver crates of dusty medical, hydraulic, and algebraic treatises rescued from distant burned libraries.', [
   ['Found a salaried Royal Translation Bureau uniting bilingual scholars', 145, { research: 16, acceptance: 9, prestige: 10 }],
   ['Sponsor selected hydraulic and surgical treatises immediately', 75, { research: 11, development: 1 }],
   ['Preserve delicate originals carefully inside dry university chests', 0, { research: 6, securityMonths: 5 }]
  ]],
  ['Translators Wrestle Over Technical Terms', 'Scholars invent crisp new native words for "zenith", "azimuth", and "algebra" where none existed before.', [
   ['Print an open Glossary of Sciences standardizing clear terms', 60, { research: 11, credit: 5, prestige: 7 }],
   ['Let university masters test terms in lively classroom lectures', 35, { research: 8, acceptance: 6 }],
   ['Keep marginal glosses alongside original scripts', 0, { research: 6 }]
  ]],
  ['Water-Screw & Pump Diagrams Tested', 'Carpenters reading translated hydraulic pages build geared Archimedian drainage screws clearing wet mine shafts.', [
   ['Fund trial pump installations in flooded royal quarries', 85, { tools: 20, development: 1, research: 9 }],
   ['Offer guild prizes for best practical workshop adaptations', 45, { research: 8, credit: 6 }],
   ['Circulate pump blueprints cleanly among town engineers', 0, { research: 6, tools: 10 }]
  ]],
  ['Ancient Wisdom Powers New Hands', 'Translated manuscripts spark practical miracles from flooded mines to hospital surgeries.', [
   ['Display working models beside translated books', 45, { prestige: 10, research: 7 }],
   ['Thank bilingual translators publicly', 25, { acceptance: 8, prestige: 6 }],
   ['Close the translation endowment', 0, { stability: 4 }]
  ]]
 );

 arc4('fs_fam_child_language', 'Family', 'child',
  ['Envoys’ Children Visit the Nursery', 'Visiting foreign diplomats bring children who speak zero local words; your young dynast stares shyly across wooden toys.', [
   ['Encourage shared games, picture primers, and joyful courtyard kites', 65, { education: 12, prestige: 7, stress: -5 }],
   ['Pair the children with playful bilingual nursery tutors', 45, { education: 11, research: 5 }],
   ['Keep formal short greetings before nursery lessons resume', 0, { education: 5, stability: 4 }]
  ]],
  ['Laughter Needs No Grammar Book', 'Within three afternoons, paper boats and chalk hopscotch conquer shyness, teaching dozens of foreign nouns effortlessly.', [
   ['Commission painted bilingual animal & star picture-cards', 50, { education: 11, research: 7 }],
   ['Host a cheerful garden cake picnic for nursery guests', 35, { prestige: 7, stress: -6 }],
   ['Praise eager young curiosity warmly', 0, { education: 7 }]
  ]],
  ['Young Dynast Translates a Nursery Gift', 'Before envoys depart, your child pipes up clearly in the guests’ own tongue wishing safe sea-winds home.', [
   ['Smile proudly as seasoned ambassadors blink in genuine delight', 30, { prestige: 11, education: 9 }],
   ['Gift matched wooden ship models to both children', 40, { prestige: 8, education: 6 }],
   ['Record the charming moment in family letters', 0, { stress: -5, legitimacy: 5 }]
  ]],
  ['Early Bridges Across Borders', 'Childhood ease with unfamiliar tongues plants quiet confidence for future royal diplomacy.', [
   ['Keep bilingual picture books inside royal nurseries', 30, { education: 8, research: 5 }],
   ['Thank patient nursery attendants', 20, { stress: -4 }],
   ['Close the nursery visit', 0, { stability: 4 }]
  ]]
 );

 arc4('fs_mon_faith_school', 'Religion', 'institutionUpgrade',
  ['Crowded Abbey Porch School', 'Children sit shivering on cold stone porch steps learning letters from one overworked deacon with a single slate board.', [
   ['Build a timber-and-brick parish schoolhouse with paid masters and slates', 135, { institutionLevel: 1, research: 11, trust: 11 }],
   ['Supply wooden hornbooks, charcoal, and warm winter braziers', 65, { institutionLevel: 1, piety: 8, trust: 8 }],
   ['Grant abbey candles and repair roof leaks modestly', 0, { piety: 6, trust: 5 }]
  ]],
  ['Farmers Grumble Harvest Hands Stay Indoors', 'Busy fathers protest book-learning steals boys away from bird-scaring and weeding during spring sowing.', [
   ['Schedule school terms cleanly round planting and harvest weeks', 45, { trust: 10, food: 35, stability: 7 }],
   ['Teach practical land-measuring, tallying, and orchard grafting too', 55, { research: 9, food: 30, trust: 8 }],
   ['Keep schooling purely voluntary for eager youths', 0, { stability: 5, piety: 4 }]
  ]],
  ['Girls & Boys Alike Read Market Tallies', 'Trained youths spot crooked merchant scales swiftly and keep honest parish farm books.', [
   ['Offer small silver prizes for cleanest parish farm-accounts', 40, { credit: 7, research: 7, trust: 7 }],
   ['Print simple clean arithmetic rhymes for rural cottages', 45, { research: 8, trust: 7 }],
   ['Inspect school roofs cleanly before autumn rains', 0, { stability: 5 }]
  ]],
  ['Light in Every Parish', 'Upgraded local schools raise honest clerks, skilled carpenters, and devout informed citizens.', [
   ['Endow modest permanent schoolmaster wheat stipends', 55, { piety: 8, research: 8, trust: 7 }],
   ['Visit the schoolhouse proudly on feast day', 25, { prestige: 7 }],
   ['Close the parish school grant', 0, { stability: 4 }]
  ]]
 );

 return out;
}
