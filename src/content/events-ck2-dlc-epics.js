/**
 * Sovereign: 1450 — Flagship CK2 + All-DLC Literary Epics Pack
 * Covers Holy Fury (Coronations, Bloodlines, Warrior Lodges, Sainthood),
 * Monks & Mystics (Hermetic Opus, Secret Cults, Master Smiths, Monastic Relics),
 * and The Reaper's Due (Castle Seclusion, Court Physicians, Plagues, Prosperity).
 */
export const ck2DlcEpicEvents = (E, C) => {
 const out = [];
 const add = (id, cat, title, desc, trig, choices) => out.push(E(id, cat, title, desc, trig, choices));

 // =========================================================================
 // HOLY FURY — CORONATIONS, BLOODLINES, WARRIOR LODGES & SAINTHOOD
 // =========================================================================

 // 1. Papal / Patriarchal Coronation Bargain (4 stages)
 add('epc_coronation_summons', 'Succession', 'The Unanointed Crown',
  'Though heralds already cry your style across the courtyard, the marble choir sits empty: the Primate refuses to lift the chrism horn until crown bailiffs surrender jurisdiction over abbey courts.',
  'newReign', [
   C('Dispatch envoys with gilded chests to buy a grand cathedral anointing', 160, { legitimacy: 8, piety: 6, prestige: 6 }, 'epc_coronation_procession'),
   C('Demand the prelate attend under ancestral regalian law without bribes', 45, { legitimacy: 6, faithAuthority: -4, stress: 5 }, 'epc_coronation_standoff'),
   C('Crown yourself beside the high altar as armed barons rattle their scabbards', 0, { prestige: 8, piety: -8, stability: -3 }, 'epc_coronation_iron')
  ]);
 add('epc_coronation_procession', 'Succession', 'Incense Over the Nave',
  'Under a vault thick with myrrh and beeswax smoke, foreign ambassadors crowd the triforium while your treasurer murmurs that the choir’s velvet hangings cost a frontier fortress.',
  'followup', [
   C('Scatter silver largesse along the cobbles to dazzle watching envoys', 120, { prestige: 12, legitimacy: 8 }),
   C('Hold a sober vigil of prayer before taking the orb and sword', 35, { piety: 10, faithAuthority: 6 }, 'epc_coronation_oath'),
   C('Keep the liturgy brisk and dismiss the banquet early', 0, { stability: 4, stress: -4 })
  ]);
 add('epc_coronation_standoff', 'Succession', 'Locked Doors at the Chapterhouse',
  'The cathedral canons bolt the bronze doors at vespers, singing defiant psalms behind iron grilles while townsfolk gather with torches in the close.',
  'followup', [
   C('Confirm ancient parish alms charters in exchange for immediate ringing of bells', 95, { legitimacy: 7, piety: 5, stability: 4 }, 'epc_coronation_oath'),
   C('Summon a rival rural bishop to perform the unction by lantern light', 30, { legitimacy: 5, faithAuthority: -6, prestige: 3 }, 'epc_coronation_oath'),
   C('Order captains to clear the square and postpone formal unction', 0, { stability: 3, legitimacy: -4, stress: 6 })
  ]);
 add('epc_coronation_iron', 'Succession', 'Cold Gold on the Brow',
  'No hymn greets the heavy circlet as you lift it with bare hands; only the scrape of steel spurs on flagstones answers from the nave.',
  'followup', [
   C('Bind the witnessing captains with land-patents and silver torques', 110, { prestige: 8, stability: 5 }, 'epc_coronation_oath'),
   C('Send a penitential candle of beeswax to the cathedral shrine afterward', 0, { piety: 6, legitimacy: 3 })
  ]);
 add('epc_coronation_oath', 'Succession', 'The Coronation Charter Sealed',
  'The chrism dries upon your forehead as clerks warm crimson wax over tallow flames; every clause entered into the chronicle today will outlive your bones.',
  'followup', [
   C('Swear to uphold impartial assizes and shield widows’ freeholds', 70, { legitimacy: 10, stability: 6, piety: 4 }),
   C('Assert supreme crown prerogative over every toll, mint, and wardship', 30, { prestige: 9, credit: 5, stress: 4 }),
   C('Seal the customary roll quietly and retire to private chambers', 0, { stress: -6, stability: 4 })
  ]);

 // 2. Forging a Legendary Bloodline (4 stages)
 add('epc_bloodline_genealogy', 'Imperial & Heritage', 'The Antiquarian’s Dusty Chest',
  'In a damp turret behind the muniment room, a half-blind chronicler spreads charred vellum claiming your great-grandsire rode beside mythic paladins at a forgotten river crossing.',
  'lowlegitimacy', [
   C('Commission illuminated genealogies and marble effigies for the ancestor', 145, { prestige: 10, legitimacy: 8, trust: 4 }, 'epc_bloodline_bard'),
   C('Set skeptical legal clerks to verify every seal before speaking a word', 55, { research: 6, legitimacy: 5 }, 'epc_bloodline_audit'),
   C('Lock the dubious parchment away; living swords need no dead ghosts', 0, { stability: 4, prestige: -2 }, 'epc_bloodline_audit')
  ]);
 add('epc_bloodline_bard', 'Imperial & Heritage', 'Ballads in the Taproom',
  'Hired minstrels carry your forebear’s name from wine-cellar to frontier watchtower, though an elderly baron laughs into his sleeve that his own grandfather never saw that bridge.',
  'followup', [
   C('Endow a chantry chapel at the supposed battlefield to silence scoffers', 130, { piety: 8, legitimacy: 8, prestige: 7 }, 'epc_bloodline_monument'),
   C('Invite the mocking baron to tour the relic chest and share a roasted swan', 45, { stability: 5, prestige: 4 }, 'epc_bloodline_monument'),
   C('Let the ballads fade naturally rather than press the claim harder', 0, { stability: 3, trust: 2 })
  ]);
 add('epc_bloodline_audit', 'Imperial & Heritage', 'Ink, Wax, and Forged Provenance',
  'Your archivist brings a brass magnifier to the faded charter: the Latin script is genuine, yet three witness names belong to men buried forty years apart.',
  'followup', [
   C('Quietly rewrite the fair copy cleanly so future scholars never stumble', 85, { legitimacy: 7, securityMonths: 8 }, 'epc_bloodline_monument'),
   C('Publish the honest fragments as civic history without mythical embellishments', 25, { research: 8, trust: 7 }, 'epc_bloodline_monument'),
   C('Burn the tainted sheets cleanly in the brazier before dawn', 0, { piety: 5, stability: 4 })
  ]);
 add('epc_bloodline_monument', 'Imperial & Heritage', 'A Name Carved in Granite',
  'Master masons await final wording for the plinth rising outside the citadel gate—the epitaph that schoolboys and rival ambassadors will read for centuries.',
  'followup', [
   C('Inscribe a martial bloodline of unbroken frontier victory', 95, { prestige: 12, legitimacy: 8 }),
   C('Inscribe a pious dynasty of lawgivers and builders', 70, { trust: 8, development: 1, piety: 6 }),
   C('Keep the tablet brief: dates, arms, and plain royal style', 0, { stability: 5, credit: 3 })
  ]);

 // 3. Warrior Lodge Duel — Holmgang on the River Sandbar (3 stages)
 add('epc_lodge_challenge', 'Military', 'A Gauntlet in the Mead-Hall',
  'Beside spitting pine logs, a scarred veteran captain slams an iron-rimmed shield onto the oak trestle, accusing your marshal’s kin of cowardice at the last river crossing.',
  'army', [
   C('Step into the chalk ring yourself to defend the banner’s honor', 40, { prestige: 10, morale: 9, fatigue: 5 }, 'epc_lodge_duel'),
   C('Appoint your keenest blade-master as crown champion', 90, { morale: 7, experience: 0.06, prestige: 5 }, 'epc_lodge_duel'),
   C('Forbid bloodletting inside camp and assign both men to vanguard ditching', 0, { fatigue: 4, morale: -3, stability: 4 }, 'epc_lodge_aftermath')
  ]);
 add('epc_lodge_duel', 'Military', 'Steel Over Frost-Bitten Gravel',
  'At dawn mist clings to the sandbar; drums hush as blades ring twice against ash-wood rims and the challenger slips on wet shingle, his guard wide open.',
  'followup', [
   C('Stay the killing blow and haul the bruised captain upright by the wrist', 30, { morale: 11, prestige: 10, experience: 0.05 }, 'epc_lodge_aftermath'),
   C('Press the advantage cleanly to prove crown steel brooks no insolence', 0, { prestige: 8, morale: 5, fatigue: 4 }, 'epc_lodge_aftermath')
  ]);
 add('epc_lodge_aftermath', 'Military', 'Drinking Horn Around the Brazier',
  'By nightfall the regiment speaks of nothing else; veteran spears and green pikemen alike watch how you bind the camp back together.',
  'followup', [
   C('Host a lodge feast of smoked mutton and oath-rings for all captains', 85, { morale: 10, supply: 10, prestige: 7 }),
   C('Institute formal regimental fencing bouts to sharpen steel safely', 50, { experience: 0.08, morale: 6 }),
   C('Order lights out early and double perimeter sentries', 0, { supply: 6, fatigue: -5 })
  ]);

 // 4. Sainthood & Beatification Inquiry (4 stages)
 add('epc_saint_tomb', 'Religion', 'Sweet Myrrh Under the Abbey Flagstone',
  'When mason apprentices lift a cracked slab in the northern transept, an uncorrupted hand and a scent of wild thyme greet them—word spreads that your late forebear works miracles.',
  'faith_christian', [
   C('Petition the apostolic legate for an official beatification inquest', 140, { piety: 12, legitimacy: 8, faithAuthority: 6 }, 'epc_saint_inquest'),
   C('Send cautious chaplains to examine the crypt before crowds gather', 55, { research: 5, piety: 6, stability: 4 }, 'epc_saint_witnesses'),
   C('Seal the slab quietly; superstitious pilgrimages breed empty granaries', 0, { food: 30, trust: 3, piety: -4 })
  ]);
 add('epc_saint_inquest', 'Religion', 'The Devil’s Advocate in Red Wool',
  'A keen-eyed canonist from across the mountains arrives with inkhorns and hard questions, interviewing blind beggars and scrutinizing old tax rolls for your ancestor’s sins.',
  'followup', [
   C('Open every treasury ledger and pay for notarized miracle depositions', 120, { legitimacy: 8, piety: 10, prestige: 7 }, 'epc_saint_verdict'),
   C('Endow three cathedral orphanages in the late sovereign’s name', 90, { trust: 10, piety: 9, development: 1 }, 'epc_saint_verdict'),
   C('Leave the inquisitor to plain bread and unvarnished testimony', 0, { piety: 5, faithAuthority: 4 }, 'epc_saint_verdict')
  ]);
 add('epc_saint_witnesses', 'Religion', 'Crutches Hung by the Porch',
  'By Pentecost forty wooden crutches dangle from iron hooks above the abbey porch, yet an apothecary whispers that the spring water below contains soothing sulfur.',
  'followup', [
   C('Celebrate both natural healing and divine providence with a stone bathhouse', 100, { development: 1, trust: 9, piety: 6 }, 'epc_saint_verdict'),
   C('Forward only tested, inexplicable cures to the papal tribunal', 45, { faithAuthority: 8, research: 5 }, 'epc_saint_verdict'),
   C('Disperse the peddlers calmly and lock the side chapel at dusk', 0, { unrest: -5, stability: 5 })
  ]);
 add('epc_saint_verdict', 'Religion', 'Bells Across Seven Dioceses',
  'The bull of recognition unrolls beneath towering stained glass, gilding your house’s name with sacred memory—yet carrying heavy expectations for the living.',
  'followup', [
   C('Translate the bones to a gilded reliquary behind the high altar', 110, { prestige: 12, piety: 12, legitimacy: 8 }),
   C('Use the occasion to proclaim a realm-wide truce and debt-jubilee', 60, { unrest: -10, trust: 9, stability: 6 }),
   C('Keep devotion modest and distribute leftover wax to poor parishes', 0, { piety: 8, trust: 5 })
  ]);

 // 5. Mass Baptism of a Frontier Chieftain (3 stages)
 add('epc_frontier_baptism', 'Religion', 'Torches Beside the Frozen Ford',
  'A border warlord rides in under white ash-boughs, offering to break his ancestral idols and accept baptism if you stand godfather and guarantee his hill-pastures.',
  'faithTension', [
   C('Sponsor a lavish riverside baptism with white silk robes and silver gifts', 135, { acceptance: 12, trust: 10, piety: 8 }, 'epc_baptism_feast'),
   C('Require six months of catechism under abbey monks before sealing lands', 45, { faithAuthority: 8, piety: 6, unrest: -4 }, 'epc_baptism_catechism'),
   C('Accept his military tribute without meddling in his hearth-spirits', 0, { gold: 70, acceptance: 4, piety: -4 })
  ]);
 add('epc_baptism_feast', 'Religion', 'Salt and Honey on the Godfather’s Sleeve',
  'Chieftains and armored retainers watch suspiciously as old sacred oaks are spared or felled; one angry kinsman spits into the snow outside the tent.',
  'followup', [
   C('Carve crosses onto the ancient boundary oaks rather than felling them', 50, { acceptance: 10, unrest: -8, trust: 6 }, 'epc_baptism_parish'),
   C('Reward the newly baptized lord with gilded spurs and border patrol pay', 95, { prestige: 7, stability: 5 }, 'epc_baptism_parish'),
   C('Keep guards alert and conclude the rite swiftly', 0, { securityMonths: 6, stability: 3 })
  ]);
 add('epc_baptism_catechism', 'Religion', 'Psalms Spoken with a Mountain Accent',
  'Monks complain the chieftain memorizes scripture while keeping a wolf-tooth amulet inside his boot; still, raiding along the valley road ceases.',
  'followup', [
   C('Present him a vernacular prayer book painted in bright vermilion', 65, { research: 5, acceptance: 9, piety: 7 }, 'epc_baptism_parish'),
   C('Proceed directly to confirmation so his rivals do not mock delay', 0, { trust: 5, stability: 4 }, 'epc_baptism_parish')
  ]);
 add('epc_baptism_parish', 'Religion', 'Timber Chapel on the Ridge',
  'Where smoke once rose from horse-skulls, cedar shingles catch morning sun—a fragile bridge between highlands and crown.',
  'followup', [
   C('Endow a permanent mission school and bridge-toll exemption', 80, { development: 1, trust: 9, acceptance: 8 }),
   C('Appoint native-born deacons to keep customs gentle', 40, { unrest: -7, piety: 7 }),
   C('Leave the new parish to sustain itself from local tithes', 0, { credit: 4, piety: 3 })
  ]);

 // 6. Swaying a Frosty Neighbor Across the Table (3 stages)
 add('epc_sway_neighbor', 'Diplomacy', 'The Cold Envoy’s Empty Cup',
  'For three seasons your border counterpart has answered border dispatches with curt clerks’ stamps; now his widowed cousin arrives at court to buy winter falcons.',
  'hostile', [
   C('Lavish rare gyrfalcons and warm cedar-lined letters upon his house', 115, { relation: 12, prestige: 5 }, 'epc_sway_letters'),
   C('Send honest timber-merchants to settle mill-dam border disputes quietly', 55, { relation: 9, credit: 4 }, 'epc_sway_letters'),
   C('Show him polite ice and double border beacons along the ridge', 0, { securityMonths: 7, relation: -4 })
  ]);
 add('epc_sway_letters', 'Diplomacy', 'Ink Softened with Almond Oil',
  'A handwritten postscript returns—still prickly, yet asking after your mother’s health and offering safe-conduct for salt wagons.',
  'followup', [
   C('Propose a twilight hunting parley halfway between frontier towers', 85, { relation: 12, stability: 5 }, 'epc_sway_concord'),
   C('Reply with witty classical verses and a cask of spiced malmsey', 40, { relation: 8, prestige: 4 }, 'epc_sway_concord'),
   C('Acknowledge the salt pass briskly and stop there', 0, { credit: 3, relation: 3 })
  ]);
 add('epc_sway_concord', 'Diplomacy', 'Cloaks Shared Beside the Boundary Stone',
  'Over roasted capon in a windswept pavilion, old grudges shrink to mere clerks’ scribbles—if neither side blinks at the final toast.',
  'followup', [
   C('Sign a five-year courier and customs truce beneath shared seals', 60, { relation: 14, credit: 6, stability: 5 }),
   C('Exchange ornamental daggers as tokens of watchful respect', 30, { relation: 8, prestige: 6 }),
   C('Part cordially with cautious promises only', 0, { relation: 4, securityMonths: 4 })
  ]);

 // 7. Antagonizing a Rival Court — Satire & Poisoned Ink (3 stages)
 add('epc_antagonize_satire', 'Intrigue', 'The Lampooner’s Broadsheet',
  'A sharp-tongued satirist in your pay brings caricatures mocking a rival court’s swollen customs tolls and painted generals, begging silver to print five hundred sheets.',
  'neighbor', [
   C('Bankroll anonymous tavern pamphlets across three market towns', 85, { prestige: 8, relation: -12 }, 'epc_antagonize_duel'),
   C('Circulate only clever epigrams among foreign ambassadors at dinner', 40, { prestige: 6, relation: -7 }, 'epc_antagonize_duel'),
   C('Pay the poet to burn his woodblocks and write harmless pastorals', 0, { stability: 4, relation: 4 })
  ]);
 add('epc_antagonize_duel', 'Intrigue', 'Furious Couriers at Midnight',
  'Your neighbor’s envoy bursts into the torchlit gallery demanding the author’s ears, while watching courtiers suppress smiles behind gloved hands.',
  'followup', [
   C('Feign shock and offer an insultingly tiny fine of three copper pence', 20, { prestige: 9, relation: -10 }, 'epc_antagonize_fallout'),
   C('Escort the envoy politely to the gate and lock borders for three days', 0, { securityMonths: 8, relation: -6 }, 'epc_antagonize_fallout')
  ]);
 add('epc_antagonize_fallout', 'Diplomacy', 'The Sting That Outlives Laughter',
  'Laughter cools into cold dispatches; border captains now sleep in mail shirts while merchants grumble over stalled wool barges.',
  'followup', [
   C('Throw open royal wine vaults to soothe ruffled merchant guilds', 75, { credit: 7, stability: 5 }),
   C('Stand firm and let rival pride stew across the river', 0, { prestige: 6, legitimacy: 4, relation: -4 })
  ]);

 // 8. Crusading Tithe & Vow of the Cross (4 stages)
 add('epc_vow_cross', 'Religion', 'The Legate’s Scarlet Mantle',
  'A fiery legate nails parchment summons to the palace postern: take the sacred vow, levy a tenth across every hearth, or answer before Christendom.',
  'lowFaithAuthority', [
   C('Take the solemn vow openly and pledge crown silver to the fleet', 150, { piety: 14, faithAuthority: 12, prestige: 10 }, 'epc_vow_tithe'),
   C('Contribute war-horses and grain instead of risking your own person', 95, { piety: 8, faithAuthority: 7, food: -30 }, 'epc_vow_tithe'),
   C('Cite urgent domestic banditry to defer any foreign expedition', 0, { stability: 5, faithAuthority: -6, trust: 4 })
  ]);
 add('epc_vow_tithe', 'Religion', 'Counting Pennies in the Sacristy',
  'Collectors hauling ironbound chests meet bolted shutters in weavers’ lanes; city aldermen ask why wool looms must pay for distant galleys.',
  'followup', [
   C('Exempt poor cottagers and shift the burden onto luxury silk imports', 60, { trust: 8, unrest: -6, piety: 6 }, 'epc_vow_departure'),
   C('Enforce the flat tenth relentlessly to fill every war chest', 0, { gold: 135, unrest: 7, faithAuthority: 5 }, 'epc_vow_departure')
  ]);
 add('epc_vow_departure', 'Religion', 'Banners Blessed Beneath Cold Rain',
  'Knights assemble beside the harbor mole, horses steaming in damp salt wind as chaplains sprinkle blessed water across iron-shod lances.',
  'followup', [
   C('Lead a disciplined vanguard inspection and fund field surgeons', 100, { piety: 9, prestige: 9, legitimacy: 6 }, 'epc_vow_relics'),
   C('Bid the captains Godspeed from the quay and stay to guard the realm', 0, { stability: 6, legitimacy: 4 }, 'epc_vow_relics')
  ]);
 add('epc_vow_relics', 'Religion', 'Letters from the Eastern Shore',
  'Salt-stained dispatches finally arrive with silver incense spoons, scarred veterans, and an account of vows fulfilled.',
  'followup', [
   C('Raise a limestone hospice for returning maimed soldiers', 85, { piety: 10, trust: 9, development: 1 }),
   C('Hang captured standards in the nave with solemn thanksgiving', 40, { prestige: 10, faithAuthority: 8 }),
   C('Disband the levies quietly and audit leftover tithe chests', 0, { gold: 65, stability: 4 })
  ]);

 // 9. Great Tribal / Feudal Reform — Breaking Old Clan Customs (3 stages)
 add('epc_custom_reform', 'Politics', 'The Old Law-Speaker’s Staff',
  'Beside a stone assembly circle, grey-bearded elders thump hazel staffs against frozen turf, insisting unwritten custom forbids written tax-rolls or stone bailiffs.',
  'gov_feudal', [
   C('Bribe younger headmen with sealed manor charters to outvote the elders', 130, { legitimacy: 8, credit: 6, unrest: 4 }, 'epc_custom_codex'),
   C('Sit patiently through three days of oral law to weave crown writs inside custom', 50, { trust: 9, stability: 6 }, 'epc_custom_codex'),
   C('Honor the hazel staff and leave highland valleys to old ways', 0, { unrest: -6, trust: 5, credit: -3 })
  ]);
 add('epc_custom_codex', 'Politics', 'Ink Meets Oral Memory',
  'Scribes crouch beside peat fires translating cattle-fines and blood-prices into clean Latin and vernacular columns.',
  'followup', [
   C('Distribute bound vernacular copies to every market bailiff', 85, { development: 1, research: 7, trust: 6 }, 'epc_custom_assize'),
   C('Keep the new codex strictly in royal archive chests', 25, { legitimacy: 7, securityMonths: 6 }, 'epc_custom_assize'),
   C('Allow local elders one veto over pasture boundaries', 0, { unrest: -5, stability: 4 })
  ]);
 add('epc_custom_assize', 'Politics', 'First Assize Under Stone Roofs',
  'For the first time, litigants step beneath oak rafters rather than sleet to hear royal judgments read aloud.',
  'followup', [
   C('Abolish ordeal by hot iron in favor of sworn witness juries', 65, { research: 8, trust: 9, legitimacy: 6 }),
   C('Keep traditional trial by battle for noble honor disputes', 30, { prestige: 8, stability: 4 }),
   C('Adjourn the court swiftly once taxes are entered', 0, { gold: 50, stability: 3 })
  ]);

 // 10. Grand Tournament of the White Rose (4 stages)
 add('epc_tourney_lists', 'Martial & Court', 'Pine Lances Painted Gold',
  'Heralds unfurl crimson pavilions across the river meadow; knights from four duchies polish fluted breastplates while armorers double the price of rivets overnight.',
  'land', [
   C('Proclaim three days of jousting, melees, and crowned poets', 165, { prestige: 14, trust: 6, credit: 5 }, 'epc_tourney_joust'),
   C('Restrict entries to grim practical cavalry drills without silk prizes', 70, { legitimacy: 6, prestige: 5, tools: 10 }, 'epc_tourney_joust'),
   C('Cancel the tilt and turn the meadow timber into granary beams', 0, { food: 40, prestige: -4, stability: 3 })
  ]);
 add('epc_tourney_joust', 'Martial & Court', 'Splintered Ash in the Afternoon Sun',
  'Dust boils above the barrier rail as a landless hedge-knight unhorses your proudest duke—sending ladies gasping and the duke’s retainers reaching for daggers.',
  'followup', [
   C('Award the hedge-knight the golden falcon fair and square', 45, { legitimacy: 9, prestige: 8, trust: 6 }, 'epc_tourney_melee'),
   C('Declare a tie to spare the great house open humiliation', 20, { stability: 6, prestige: -3 }, 'epc_tourney_melee'),
   C('Call an immediate end to tilting before blood stains the turf', 0, { stability: 4, unrest: -3 }, 'epc_tourney_melee')
  ]);
 add('epc_tourney_melee', 'Martial & Court', 'Mud, Blunted Steel, and Broken Collarbones',
  'In the closing melee fifty horsemen wheel through ankle-deep mud; your treasury clerk whispers that three borrowed Flemish chargers just went lame.',
  'followup', [
   C('Compensate injured riders generously and endow field bone-setters', 90, { trust: 9, prestige: 7, development: 1 }, 'epc_tourney_toast'),
   C('Toast the bruises as glorious proof of martial vigor', 0, { prestige: 7, stability: 3 }, 'epc_tourney_toast')
  ]);
 add('epc_tourney_toast', 'Martial & Court', 'Lanterns Over the Pavilion',
  'When wax lanterns gutter along the meadow, former rivals clasp forearms over mulled claret—for tonight at least, banners hang together.',
  'followup', [
   C('Publish the heralds’ roll of arms as a permanent court register', 55, { legitimacy: 8, prestige: 8 }),
   C('Send merchants home with cleared road-tolls for festival week', 30, { credit: 7, trust: 6 }),
   C('Strike tents at dawn and tally the tavern bills', 0, { gold: 35, stability: 3 })
  ]);

 // 11. Legendary Gathering — Hunting the White Stag (3 stages)
 add('epc_white_stag', 'Lifestyle', 'Antlers Mistaken for Birch Boughs',
  'Foresters stumble into the hall boots caked in peat, swearing a snow-white hart tall as a destrier browses the royal brake.',
  'focus_martial', [
   C('Sound the horn and ride hard with hounds and courtiers', 100, { focusXP: 24, prestige: 8, stress: -8 }, 'epc_stag_chase'),
   C('Ride out quietly with two trackers at daybreak', 40, { focusXP: 18, stress: -10 }, 'epc_stag_chase'),
   C('Leave the beast untouched; folk say white stags belong to old saints', 0, { piety: 7, stress: -4 })
  ]);
 add('epc_stag_chase', 'Lifestyle', 'Bracken Torn by Iron Stirrups',
  'Half a day into wet pinewoods your horse pulls up lame beside a mossy ravine, while the white hart pauses calmly twenty paces away across a brook.',
  'followup', [
   C('Loose a clean arrow to claim the legendary trophy', 0, { prestige: 12, focusXP: 22, stress: -5 }, 'epc_stag_return'),
   C('Lower the bow and watch the phantom slip back into silver mist', 0, { piety: 10, focusXP: 16, stress: -15 }, 'epc_stag_return')
  ]);
 add('epc_stag_return', 'Lifestyle', 'Stories Told by the Hearth',
  'Whether antlers hang above the dais or only a hushed tale rides back on your cloak, the court measures your bearing in the saddle.',
  'followup', [
   C('Commission tapestries of the hunt for the winter gallery', 90, { prestige: 10, legitimacy: 6 }),
   C('Share roasted venison and cider with the foresters’ cottages', 35, { piety: 6, focusXP: 14, stability: 4 }),
   C('Dry your boots and return silently to council ledgers', 0, { stress: 2, legitimacy: 4 })
  ]);

 // 12. Warrior Lodge Initiation — Scarred Knuckles in Snow (3 stages)
 add('epc_lodge_initiation', 'Military', 'The Circle of Bare-Chested Veterans',
  'Behind the garrison smithy, grizzled serjeants form a torchlit ring in falling sleet and challenge your heir’s readiness to endure cold steel without flinching.',
  'adultHeir', [
   C('Command the heir to step inside and endure the veterans’ wooden staves', 50, { education: 10, prestige: 8, stress: 6 }, 'epc_lodge_trial_two'),
   C('Stand beside the heir and share the freezing vigil yourself', 75, { opinion: 14, prestige: 10, stress: 8 }, 'epc_lodge_trial_two'),
   C('Forbid reckless hazing and order proper armored drills instead', 0, { stability: 5, opinion: -6, education: 4 })
  ]);
 add('epc_lodge_trial_two', 'Military', 'Breath Frosting on Iron Rims',
  'Blue-lipped and bruised, the young royal holds a notched shield against three charging captains before collapsing onto packed snow—yet refuses to drop the ash-grip.',
  'followup', [
   C('Invest the heir with a scarred oak-leaf clasp before the whole regiment', 80, { prestige: 10, opinion: 12, legitimacy: 6 }, 'epc_lodge_trial_three'),
   C('Bind the ribs warmly and praise stubborn endurance over showmanship', 20, { opinion: 10, education: 8, stress: -4 }, 'epc_lodge_trial_three'),
   C('Send the lad straight to bed without ceremony', 0, { stability: 3, opinion: -4 })
  ]);
 add('epc_lodge_trial_three', 'Military', 'A Name Remembered by the Rank and File',
  'Next morning grey-haired pikemen salute the heir with genuine warmth instead of hollow court bows.',
  'followup', [
   C('Grant the heir a frontier patrol squadron to sharpen command', 70, { education: 12, legitimacy: 7 }),
   C('Pair the young dynast with a sober quartermaster tutor', 40, { education: 10, credit: 4 }),
   C('Return to ordinary court lessons', 0, { stability: 4, opinion: 4 })
  ]);

 // 13. Pagan / Ancestral Shrine — Sacred Grove Under Axe-Threat (3 stages)
 add('epc_sacred_grove', 'Religion', 'Oak Roots Above the Charcoal Pits',
  'Charcoal-burners eyeing fleet timber raise axes beside an ancient circle of moss-grown oaks revered by country folk as the dwelling of guardian spirits.',
  'faith_traditions', [
   C('Forbid axes cleanly and encircle the grove with carved boundary stones', 80, { piety: 12, faithAuthority: 10, trust: 9 }, 'epc_grove_vigil'),
   C('Allow selective pruning of fallen boughs for shipyard iron-smelters', 40, { tools: 18, credit: 5, piety: -3 }, 'epc_grove_vigil'),
   C('Fell the tallest oaks immediately for royal war-galleys', 0, { gold: 75, unrest: 8, piety: -10 })
  ]);
 add('epc_grove_vigil', 'Religion', 'Lanterns Hung from Wet Branches',
  'At the equinox villagers weave rye-garlands along the timber fence, asking whether the crown’s protection extends to ancestral shrines across the hills.',
  'followup', [
   C('Charter a council of hearth-keepers to tend sacred woods statewide', 110, { faithAuthority: 10, acceptance: 9, piety: 8 }, 'epc_grove_blessing'),
   C('Leave the single grove protected while taxing surrounding coppices', 0, { gold: 55, trust: 3 }, 'epc_grove_blessing')
  ]);
 add('epc_grove_blessing', 'Religion', 'Smoke of Juniper at Dusk',
  'Elders pour birch sap onto the boundary stone and pronounce the house’s fortunes rooted deep as winter heartwood.',
  'followup', [
   C('Sponsor seasonal harvest songs and granary alms at the grove', 65, { food: 45, trust: 8, piety: 7 }),
   C('Accept their blessing respectfully and ride back before dusk', 0, { legitimacy: 5, stability: 4 })
  ]);

 // 14. Rival Bloodline Claim — The Pretender’s Tapestry (3 stages)
 add('epc_rival_tapestry', 'Succession', 'Another Eagle Sewn in Scarlet Thread',
  'A living kinsman hangs an enormous Flemish tapestry in his manor hall depicting your common ancestor crowning his branch rather than yours.',
  'livingClaimant', [
   C('Buy out the Flemish weavers and commission an answering royal cycle', 130, { prestige: 10, legitimacy: 9, opinion: -6 }, 'epc_tapestry_summons'),
   C('Invite the kinsman to hang his cloth politely inside the public hall for debate', 50, { legitimacy: 6, opinion: 8, stability: 4 }, 'epc_tapestry_summons'),
   C('Mock the gaudy stitches publicly and tax his wool flocks', 0, { gold: 65, opinion: -14, prestige: 3 })
  ]);
 add('epc_tapestry_summons', 'Succession', 'Judges Before the Painted Linen',
  'Lords squint at sewn crowns andLatin mottoes; everyone knows the thread is merely a proxy for who commands loyalty if winter fever strikes the throne.',
  'followup', [
   C('Offer the kinsman an honored frontier stewardship in exchange for a public oath', 95, { opinion: 18, legitimacy: 8, stability: 6 }, 'epc_tapestry_settlement'),
   C('Compel him to unstitch the offending crown before witnesses', 20, { legitimacy: 9, opinion: -12, prestige: 5 }, 'epc_tapestry_settlement'),
   C('Adjourn the exhibition and leave barons guessing', 0, { securityMonths: 6, stress: 4 }, 'epc_tapestry_settlement')
  ]);
 add('epc_tapestry_settlement', 'Succession', 'Folded Wool in Cedar Chests',
  'The tapestry comes down from the stone wall; whether rolled in reconciliation or locked as forfeit evidence, the court reads the outcome closely.',
  'followup', [
   C('Donate the rich cloth to the cathedral nave to mark peace', 45, { piety: 9, opinion: 10, stability: 5 }),
   C('Keep it locked inside the treasury as a grim reminder', 0, { securityMonths: 8, legitimacy: 5 })
  ]);

 // 15. Crown Forges a Military Law Code — The Book of Banners (3 stages)
 add('epc_book_banners', 'Military', 'Blood-Soaked Parchment on the Drumhead',
  'Mercenary pikemen and feudal levies brawl over plundered baggage carts outside a surrendered town; captains demand one iron code binding every banner.',
  'army_fatigue', [
   C('Pay clerks and veteran captains to codify strict Articles of War', 110, { experience: 0.08, morale: 9, fatigue: -10 }, 'epc_banners_oath'),
   C('Enforce swift drumhead gallows for looters without new paperwork', 0, { morale: -4, fatigue: -6, stability: 5 }, 'epc_banners_oath'),
   C('Permit modest three-hour sack shares to keep hungry pikes content', 0, { gold: 70, morale: 6, piety: -6 }, 'epc_banners_oath')
  ]);
 add('epc_banners_oath', 'Military', 'Drums Rolled Along the Baggage Train',
  'Captains hesitate when asked to swear that even noblemen’s grooms will hang for stealing church chalices or burning peasant mills.',
  'followup', [
   C('Compensate disciplined companies with reliable silver boot-money', 105, { morale: 10, supply: 14, prestige: 6 }, 'epc_banners_legacy'),
   C('Demand every banner-bearer kiss the hilt of the royal sword unconditionally', 0, { legitimacy: 7, morale: 5, fatigue: 4 }, 'epc_banners_legacy')
  ]);
 add('epc_banners_legacy', 'Military', 'Order Along the March',
  'By the third week villages open gates to sell loaves instead of hiding cattle in marsh reed-beds—discipline proves sharper than terror.',
  'followup', [
   C('Establish permanent provost marshals attached to every field column', 70, { supply: 15, experience: 0.06, stability: 5 }),
   C('Let captains enforce the printed articles themselves', 0, { fatigue: -8, morale: 5 })
  ]);

 // 16. Duel of Honor Between Rival Councillors (3 stages)
 add('epc_council_duel', 'Court', 'Gloves Thrown Across the Green Baize',
  'Over tax assessments in the inner chamber, a proud councillor sweeps brass inkstands aside and slaps a peer across the cheek with a velvet glove.',
  'councillor', [
   C('Fine both hotheads heavily and lock them together until accounts balance', 35, { stability: 6, gold: 80, opinion: -8 }, 'epc_council_reconcile'),
   C('Sanction a controlled judicial duel with blunted rebated swords at dawn', 50, { prestige: 7, opinion: 6, stress: 5 }, 'epc_council_reconcile'),
   C('Dismiss the meeting immediately and examine both men’s ledgers in secret', 0, { securityMonths: 8, stress: 4 }, 'epc_council_reconcile')
  ]);
 add('epc_council_reconcile', 'Court', 'Bruised Pride at the Privy Door',
  'By midweek whispering clerks report the insulted minister refuses to sign treasury tallies unless the crown restores his precedence at chapel.',
  'followup', [
   C('Host a quiet supper in your private study to mend bruised dignity', 65, { opinion: 18, stability: 6, stress: -4 }, 'epc_council_pact'),
   C('Remind him coldly that council seats belong to the crown, not vanity', 0, { legitimacy: 7, opinion: -10, prestige: 4 }, 'epc_council_pact')
  ]);
 add('epc_council_pact', 'Court', 'Quiet Quills Again',
  'Scratching quills resume across parchment ledgers, though watchful glances linger whenever salt contracts pass the table.',
  'followup', [
   C('Reward diligent service with a small gilded seal-ring', 50, { opinion: 12, credit: 5 }),
   C('Keep strict written minutes of every council vote from this day', 0, { legitimacy: 6, securityMonths: 6 })
  ]);

 // 17. Holy Fury Crusade Prep — Shipbuilding Frenzy (3 stages)
 add('epc_crusade_keels', 'Economy & Trade', 'Pine Tar Boiling on the Slipways',
  'Word of an imminent sea-expedition turns river shipyards into fevered hives; oak prices triple while master shipwrights demand crown monopolies.',
  'crossroads_oceanic', [
   C('Charter standardized galley yards and import Baltic pitch cleanly', 140, { development: 1, credit: 8, prestige: 7 }, 'epc_crusade_impress'),
   C('Requisition merchant cogs at fixed crown rates for winter fitting', 40, { gold: 45, unrest: 5, legitimacy: 4 }, 'epc_crusade_impress'),
   C('Limit building to coastal defense cutters and spare inland forests', 0, { trust: 6, stability: 4 })
  ]);
 add('epc_crusade_impress', 'Economy & Trade', 'Press-Gangs Along the Rope-Walk',
  'Fishermen’s wives block the harbor bridge with oars and salting-tubs after naval bailiffs sweep unmarried apprentices off the fish quay.',
  'followup', [
   C('Pay honest advance wages and guarantee widows’ grain rations', 95, { trust: 11, unrest: -8, food: -20 }, 'epc_crusade_launch'),
   C('Swap impressed landsmen for pardoned debtors and coastal volunteers', 35, { credit: 5, unrest: -4, stability: 4 }, 'epc_crusade_launch'),
   C('Order watchmen to clear the bridge by baton before sunset', 0, { unrest: 7, securityMonths: 5 }, 'epc_crusade_launch')
  ]);
 add('epc_crusade_launch', 'Economy & Trade', 'Painted Sails Catching the Tide',
  'New oak hulls glide down greased ways amid cheering dockyards—a costly fleet that reshapes harbor trade long after banners fold.',
  'followup', [
   C('Convert surplus slipways into permanent merchant packet yards', 70, { credit: 9, development: 1, trust: 5 }),
   C('Lease half the new hulls to spice syndicates in peacetime', 0, { gold: 105, credit: 4 })
  ]);

 // 18. Bloodline of Builders — The Great Stone Bridge (4 stages)
 add('epc_great_bridge', 'Economy & Trade', 'Seven Arches Across the Swirling Flood',
  'Every spring melt sweeps away timber ferries at the kingdom’s widest crossing; an Italian master mason offers a seven-arch stone bridge bearing your dynasty’s shield.',
  'land', [
   C('Fund oak cofferdams, cut granite, and carved royal keystones', 175, { development: 1, prestige: 10, trust: 9 }, 'epc_bridge_piers'),
   C('Grant bridge-toll shares to town guilds to split construction risk', 85, { credit: 8, development: 1, trust: 5 }, 'epc_bridge_piers'),
   C('Repair only the rope-ferry stages and spare the treasury', 0, { credit: 3, stability: 3 })
  ]);
 add('epc_bridge_piers', 'Economy & Trade', 'Drowned Timber Inside the Cofferdam',
  'Autumn floods breach the third cofferdam overnight, burying two bronze pile-drivers in silt while superstitious boatmen mutter the river demands a sacrifice.',
  'followup', [
   C('Hire diver-teams and double timber shoring before winter frost', 120, { research: 6, trust: 8, development: 1 }, 'epc_bridge_keystone'),
   C('Have priests bless the pilings with bread and wine to calm laborers', 35, { piety: 7, unrest: -5, stability: 4 }, 'epc_bridge_keystone'),
   C('Halt work till spring and cover half-laid masonry with straw', 0, { stability: 3, prestige: -2 }, 'epc_bridge_keystone')
  ]);
 add('epc_bridge_keystone', 'Economy & Trade', 'The Final Wedge Driven Home',
  'Crowds line both banks as masons knock out wooden centering; arches hold without a hair’s crack, and cartwheels rumble where oars once strained.',
  'followup', [
   C('Declare three days of toll-free passage and carve your house motto deep', 60, { legitimacy: 9, prestige: 10, trust: 8 }, 'epc_bridge_legacy'),
   C('Set moderate wheel-tolls dedicated solely to road maintenance', 0, { gold: 90, credit: 6 }, 'epc_bridge_legacy')
  ]);
 add('epc_bridge_legacy', 'Imperial & Heritage', 'Wagons Rolling Past the Lions',
  'Decades hence travelers will still tell time by the year the stone arches spanned the flood—a bloodline written in mortar rather than ink.',
  'followup', [
   C('Erect twin stone customs houses and almshouses at the bridgehead', 85, { development: 1, piety: 7, credit: 6 }),
   C('Leave the clean granite parapet unadorned save the crown shield', 0, { prestige: 7, legitimacy: 5 })
  ]);

 // 19. Courtly Sway Turned Sour — Rejected Envoy at the Feast (3 stages)
 add('epc_diplomat_snub', 'Diplomacy', 'Seated Below the Salt',
  'At an allied wedding banquet, foreign stewards seat your senior ambassador behind minor horse-breeders—an unmistakable slight whispered down every table.',
  'friendly', [
   C('Instruct your envoy to laugh warmly and win the whole table with wit', 45, { relation: 10, prestige: 8 }, 'epc_snub_reply'),
   C('Demand immediate public correction of precedence or quit the hall', 0, { prestige: 7, relation: -10 }, 'epc_snub_reply'),
   C('Quietly pocket the insult and double-check border customs tariffs', 0, { credit: 5, relation: -3 }, 'epc_snub_reply')
  ]);
 add('epc_snub_reply', 'Diplomacy', 'Velvet Apologies at Breakfast',
  'Next morning the host duke’s chancellor arrives bearing a silver ewer, blaming an ignorant junior usher for the seating chart.',
  'followup', [
   C('Accept the silver ewer gracefully and invite him to inspect stud farms', 50, { relation: 12, prestige: 6 }, 'epc_snub_accord'),
   C('Accept stiffly while insisting formal protocol articles be written down', 20, { legitimacy: 6, relation: 4 }, 'epc_snub_accord'),
   C('Send the ewer straight to poorhouses without a return toast', 0, { piety: 6, prestige: 4, relation: -6 })
  ]);
 add('epc_snub_accord', 'Diplomacy', 'Sealed Precedence',
  'Clear rank articles cross the border by spring courier, ensuring future embassies dine without drawn eyebrows.',
  'followup', [
   C('Host a reciprocal autumn banquet with impeccable etiquette', 80, { relation: 12, prestige: 8 }),
   C('File the parchment cleanly in chancery', 0, { stability: 4, relation: 4 })
  ]);

 // 20. Excommunication Threat Over Royal Taxes (4 stages)
 add('epc_excomm_warning', 'Religion', 'Red Wax and Interdict Candles',
  'For taxing cathedral wool-staples during border war, an angry prelate threatens to extinguish altar candles across the capital and bar bells from ringing.',
  'faith_christian', [
   C('Offer discreet restitution and a pious chapel endowment to stay the bull', 145, { piety: 10, faithAuthority: 8, stability: 5 }, 'epc_excomm_penance'),
   C('Appeal directly to a general council of bishops over the prelate’s head', 65, { legitimacy: 8, research: 5, faithAuthority: -4 }, 'epc_excomm_council'),
   C('Seize diocesan bailiffs’ keys and dare him to silence the bells', 0, { gold: 110, piety: -10, unrest: 6 }, 'epc_excomm_defiance')
  ]);
 add('epc_excomm_penance', 'Religion', 'Barefoot Before the West Door',
  'Clad in plain undyed linen beneath drizzling eaves, you wait while canons debate whether royal contrition is gold-plated theater or true humility.',
  'followup', [
   C('Grant an additional almshouse charter for city beggars', 85, { trust: 10, piety: 11, stability: 6 }, 'epc_excomm_peace'),
   C('Keep the rite brief and step briskly back into warm furs', 0, { piety: 6, legitimacy: 4 }, 'epc_excomm_peace')
  ]);
 add('epc_excomm_council', 'Religion', 'Mitres Arguing Across Oak Benches',
  'University doctors and abbey priors trade barbed Latin citations while restless merchants wonder if Easter sacraments will proceed.',
  'followup', [
   C('Compromise on an annual fixed crown-gift replacing intrusive wool taxes', 90, { credit: 7, faithAuthority: 7, legitimacy: 6 }, 'epc_excomm_peace'),
   C('Publish legal tracts asserting temporal independence of the crown', 0, { research: 9, legitimacy: 9, piety: -5 }, 'epc_excomm_peace')
  ]);
 add('epc_excomm_defiance', 'Religion', 'Silent Steeples Over the Market',
  'No noon Angelus tolls across tiled roofs; superstitious bakers mutter over souring yeast while soldiers stand guard outside shuttered churches.',
  'followup', [
   C('Pay loyal parish priests directly from the exchequer to ring bells', 100, { unrest: -8, legitimacy: 6, piety: -4 }, 'epc_excomm_peace'),
   C('Release detained diocesan stewards in exchange for immediate lifting', 0, { stability: 7, faithAuthority: 5, gold: -40 }, 'epc_excomm_peace')
  ]);
 add('epc_excomm_peace', 'Religion', 'Bronze Tongues Ring Again',
  'When great bells finally boom across the river valley, merchants unbar stalls and clerks sigh with relief—crown and crozier know each other’s teeth.',
  'followup', [
   C('Record a clear concordat defining church and crown dues forever', 65, { legitimacy: 9, faithAuthority: 8, stability: 6 }),
   C('Let the truce stand unspoken', 0, { stability: 4, piety: 3 })
  ]);

 // 21. Forged Legend of the Ancestral Sword (3 stages)
 add('epc_ancestral_blade', 'Imperial & Heritage', 'Iron Pitted Beneath Altar Velvet',
  'A dying armorer swears the rusted broadsword behind your chapel crucifix once clove a usurper’s helm at the realm’s founding—and offers to re-hilt it in gold wire.',
  'reign_chapter', [
   C('Hire master goldsmiths to re-hilt the blade as a regalia sword', 135, { prestige: 12, legitimacy: 9 }, 'epc_blade_ceremony'),
   C('Test the steel quietly in the smithy before making bold claims', 40, { research: 5, legitimacy: 5 }, 'epc_blade_ceremony'),
   C('Leave the venerable iron hanging untouched beside prayer flags', 0, { piety: 7, stability: 4 })
  ]);
 add('epc_blade_ceremony', 'Imperial & Heritage', 'Swearing Upon Ancient Iron',
  'Young knights beg to kiss the newly gilded pommel before riding out, though an elderly bishop eyes the fresh silver rivets skeptically.',
  'followup', [
   C('Have knights swear oaths of chivalry and protection of travelers on the hilt', 55, { stability: 7, prestige: 9, piety: 5 }, 'epc_blade_chronicle'),
   C('Keep the blade strictly for state openings of court', 0, { legitimacy: 7, securityMonths: 6 }, 'epc_blade_chronicle')
  ]);
 add('epc_blade_chronicle', 'Imperial & Heritage', 'Steel Woven Into Memory',
  'Songs already rename the iron relic; what matters is whether the crown wields its myth with wisdom or vanity.',
  'followup', [
   C('Commission battle standards bearing the sword’s twin-wolf emblem', 70, { prestige: 10, legitimacy: 6 }),
   C('Lock the blade in velvet and let quiet justice speak louder', 0, { stability: 6, stress: -4 })
  ]);

 // 22. Battlefield Epiphany & Conversion of Heart (3 stages)
 add('epc_battle_epiphany', 'Military', 'A Broken Cross in Muddy Rut',
  'After a bitter skirmish in sleet, you pull a mud-caked bronze cross from beneath an overturned supply cart while wounded men groan around smoky fires.',
  'war', [
   C('Give your own fur cloak to wounded pikemen and endow a field chapel', 110, { piety: 12, morale: 10, stability: 5 }, 'epc_epiphany_vow'),
   C('Mount the bent cross on the vanguard standard to steel weary ranks', 30, { morale: 9, prestige: 7 }, 'epc_epiphany_vow'),
   C('Pocket the scrap quietly and shout for quartermasters to count arrows', 0, { supply: 12, fatigue: -4 })
  ]);
 add('epc_epiphany_vow', 'Military', 'Candles Inside Canvas Tents',
  'Veterans who swore foul oaths an hour ago now kneel in damp straw for confession before tomorrow’s march.',
  'followup', [
   C('Promise clean veteran hospitals once the campaign closes', 90, { morale: 10, piety: 8, prestige: 5, legitimacy: 5 }, 'epc_epiphany_peace'),
   C('Let chaplains preach steady courage without costly vows', 0, { morale: 6, piety: 5 }, 'epc_epiphany_peace')
  ]);
 add('epc_epiphany_peace', 'Military', 'Return of the Scarred Standard',
  'When the column limps homeward, that dented bronze cross draws more reverence than gilded captured drums.',
  'followup', [
   C('Set the cross above a permanent soldiers’ almshouse gate', 75, { piety: 11, legitimacy: 7, stability: 5 }),
   C('Hang it modestly beside regimental colors', 0, { prestige: 6, morale: 5 })
  ]);

 // 23. Noble Adoption / Legitimizing a Natural Son (3 stages)
 add('epc_natural_son', 'Family', 'A Familiar Chin Across the Tilt-Yard',
  'Your sharp-eyed natural son outrides two legitimate cousins at lance-practice; whispered comparisons ripple along the gallery rail.',
  'competingHeirs', [
   C('Legitimize the youth openly under royal seal despite whispering kin', 130, { opinion: -12, legitimacy: -4, prestige: 8 }, 'epc_natural_storm'),
   C('Grant him a rich frontier barony and command without altering succession', 85, { opinion: 10, stability: 5, legitimacy: 4 }, 'epc_natural_storm'),
   C('Keep him quietly in the guard ranks with generous private purse', 0, { opinion: -4, stability: 4, stress: 4 })
  ]);
 add('epc_natural_storm', 'Family', 'Tight-Lipped Suppers in the Solar',
  'Your legitimate heir pushes roasted venison untasted around a silver plate, demanding clear assurances about castles and dynastic precedence.',
  'followup', [
   C('Seat both youths together and assign complementary realms of duty', 60, { opinion: 16, education: 8, stability: 5 }, 'epc_natural_accord'),
   C('Rebuke petulance firmly and insist competence earns royal favor', 0, { legitimacy: 6, opinion: -8, stress: 5 }, 'epc_natural_accord')
  ]);
 add('epc_natural_accord', 'Family', 'Brothers Under One Roof',
  'Time will test whether shared banners hold or fracture, yet tonight both riders hang their spurs side by side.',
  'followup', [
   C('Commission twin steel breastplates stamped with the house crest', 75, { prestige: 8, opinion: 10 }),
   C('Leave the household in calm quiet', 0, { stability: 4, stress: -3 })
  ]);

 // 24. Warrior Lodge Raid & Ransom Negotiation (3 stages)
 add('epc_border_ransom', 'Diplomacy', 'Iron Chains and Velvet Purses',
  'Border captains haul a captured enemy baron—still reeking of marsh smoke—into the courtyard, arguing whether to ransom him rich or swap for thirty captive yeomanry.',
  'war', [
   C('Trade the proud baron directly for every captive soldier and peasant', 40, { morale: 11, relation: 8, legitimacy: 7 }, 'epc_ransom_parley'),
   C('Hold him honorably in tower quarters as leverage for peace talks', 60, { securityMonths: 8, relation: 4 }, 'epc_ransom_parley'),
   C('Demand steep silver ransom to replenish battered siege chests', 0, { gold: 150, relation: -6, prestige: 5 }, 'epc_ransom_parley')
  ]);
 add('epc_ransom_parley', 'Diplomacy', 'Carriages Beneath White Flags',
  'At the stone boundary bridge, rival stewards weigh silver ingots against frostbitten prisoners hobbling in ragged wool.',
  'followup', [
   C('Provide warm cloaks and mule carts for returning prisoners', 65, { morale: 9, prestige: 7, relation: 6 }, 'epc_ransom_end'),
   C('Close the exchange swiftly before cavalry patrols test the truce', 0, { stability: 5, supply: 8 }, 'epc_ransom_end')
  ]);
 add('epc_ransom_end', 'Diplomacy', 'Empty Irons in the Gatehouse',
  'The prisoner ledger closes cleanly, leaving frontier families either weeping with relief or counting newly minted siege coin.',
  'followup', [
   C('Record formal prisoner-exchange rules for future campaigns', 40, { research: 5, relation: 6, legitimacy: 5 }),
   C('Return captains immediately to garrison drill', 0, { experience: 0.05, morale: 4 })
  ]);

 // 25. Royal Pilgrimage of Atonement (4 stages)
 add('epc_atonement_walk', 'Religion', 'Gravel Beneath Bare Soles',
  'Haunted by years of harsh taxes and bloodied fields, you resolve—or are urged by confessors—to walk forty leagues to a mountain shrine in coarse sackcloth.',
  'highStress', [
   C('Set out humbly with only a chaplain, bread satchel, and hazel staff', 45, { stress: -14, piety: 12, legitimacy: 4 }, 'epc_atonement_inn'),
   C('Ride in grand penitential procession with alms wagons behind', 140, { prestige: 8, piety: 9, stress: -8 }, 'epc_atonement_inn'),
   C('Send a heavy golden candle instead and remain at the council desk', 90, { piety: 5, stress: 4 }),
   C('Offer quiet private prayers at dusk and stay at the council table', 0, { piety: 4, stability: 3 })
  ]);
 add('epc_atonement_inn', 'Religion', 'Rain-Soaked Straw at the Wayside Hospice',
  'Unrecognized beneath a wet hood at a roadside tavern, you hear carters curse your own bailiffs’ crooked grain measures over sour ale.',
  'followup', [
   C('Pay the tavern’s whole bread bill anonymously before slipping out at dawn', 55, { piety: 9, stress: -10 }, 'epc_atonement_shrine'),
   C('Listen silently and jot every corrupt bailiff’s name inside your psalter', 0, { legitimacy: 6, stress: 3, research: 4 }, 'epc_atonement_shrine')
  ]);
 add('epc_atonement_shrine', 'Religion', 'Steps Worn Hollow by Knees',
  'Mist parts around high limestone steps where candles flicker like fallen stars; for a quiet hour no dispatch rider knows where to find you.',
  'followup', [
   C('Keep all-night vigil before the damp stone altar', 25, { piety: 12, stress: -16 }, 'epc_atonement_return'),
   C('Confer with wise abbey elders on lightening realm burdens', 0, { faithAuthority: 7, stress: -10, legitimacy: 5 }, 'epc_atonement_return')
  ]);
 add('epc_atonement_return', 'Religion', 'Returning With Mud on the Hem',
  'Courtiers stare when you stride back into hall sunburnt and lean—and wait to see whether penitence brings mercy or sharper justice.',
  'followup', [
   C('Dismiss the crooked bailiffs named at the roadside inn', 30, { legitimacy: 10, stability: 6, stress: -6 }),
   C('Endow roadside pilgrim shelters along the stony pass', 95, { piety: 10, prestige: 6, credit: 4 }),
   C('Resume council business quietly with lighter spirits', 0, { stress: -8, stability: 4 })
  ]);

 // 26. Coronation Gift — Crown Jewel Recutting (3 stages)
 add('epc_crown_sapphire', 'Imperial & Heritage', 'Flaw Inside the Great Blue Stone',
  'A Bruges lapidary peering through rock crystal warns the dynasty’s centerpiece sapphire hides a hairline fracture—ready to shatter unless carefully recut.',
  'lowlegitimacy', [
   C('Entrust the sacred stone to the Bruges master under armed guard', 130, { prestige: 10, legitimacy: 6, research: 4 }, 'epc_sapphire_wheel'),
   C('Commission a twin crown set with new garnet cabochons instead', 95, { prestige: 8, credit: 4 }, 'epc_sapphire_wheel'),
   C('Leave the ancient uncut cabochon untouched; history outranks sparkle', 0, { legitimacy: 7, piety: 4 }, 'epc_sapphire_wheel')
  ]);
 add('epc_sapphire_wheel', 'Imperial & Heritage', 'Lead Wheels Spinning in Diamond Dust',
  'For seven tense nights court jewelers hold breath while olive oil and diamond paste grind beside tallow lamps.',
  'followup', [
   C('Set the gleaming faceted gem inside a fresh fleur-de-lys bezel', 75, { prestige: 12, legitimacy: 8 }, 'epc_sapphire_reveal'),
   C('Preserve the dust and mount the stone plainly on iron-backed silver', 0, { legitimacy: 6, stability: 4 }, 'epc_sapphire_reveal')
  ]);
 add('epc_sapphire_reveal', 'Imperial & Heritage', 'Blue Fire Under Throne Candlesticks',
  'When velvet lifts at Epiphany, the gem catches twenty candle flames at once, silencing whispers of an impoverished throne.',
  'followup', [
   C('Display the crown publicly before assembled burgesses and lords', 40, { trust: 8, legitimacy: 8, prestige: 6 }),
   C('Return the regalia cleanly to iron vault chests', 0, { securityMonths: 7, stability: 4 })
  ]);

 // 27. Knightly Order of the Dragon / Star (3 stages)
 add('epc_chivalric_order', 'Court', 'Twenty-Four Velvet Mantles',
  'To bind restless great magnates without yielding taxes, your chancellor proposes founding an exclusive chivalric collar restricted to twenty-four peers.',
  'vassal', [
   C('Strike gold-enameled collars and swear knights inside the palace chapel', 150, { loyalty: 12, prestige: 12, legitimacy: 7 }, 'epc_order_chapter'),
   C('Admit deserving border captains alongside old dukes', 90, { loyalty: 8, trust: 7, prestige: 6 }, 'epc_order_chapter'),
   C('Decline costly ribbons; honest pay keeps vassals steadier than badges', 0, { credit: 5, stability: 4 })
  ]);
 add('epc_order_chapter', 'Court', 'Bickering Over Stalls in Choir',
  'Within a month two earls nearly draw steel over whose painted helm crest hangs closer to the sovereign’s wooden stall.',
  'followup', [
   C('Set strict precedence strictly by seniority of faithful crown service', 35, { legitimacy: 8, loyalty: 8, stability: 4 }, 'epc_order_statutes'),
   C('Rotate stalls annually by lot so pride yields to brotherhood', 0, { stability: 6, loyalty: 6 }, 'epc_order_statutes')
  ]);
 add('epc_order_statutes', 'Court', 'Statutes Written on Purple Vellum',
  'The order’s annual chapter becomes an honored theater where slighted lords compete to serve rather than conspire.',
  'followup', [
   C('Require each knight to endow one rural hospital bed upon election', 65, { piety: 9, trust: 8, development: 1 }),
   C('Enforce solemn mutual-defense oaths against treason', 0, { securityMonths: 9, loyalty: 7 })
  ]);

 // 28. Martyr’s Reliquary Provenance Scandal (3 stages)
 add('epc_reliquary_scandal', 'Religion', 'Three Shrines Claim the Same Skull',
  'Cathedral deans blush furiously when an itinerary scholar points out three different abbeys within your realm all charge pilgrims to kiss the identical saint’s cranium.',
  'institution', [
   C('Summon a quiet clerical commission to retire obvious frauds with dignity', 75, { faithAuthority: 9, research: 6, piety: 5 }, 'epc_reliquary_inquest'),
   C('Protect the capital shrine’s claim and silence provincial murmurs', 40, { prestige: 6, legitimacy: 5, trust: -4 }, 'epc_reliquary_inquest'),
   C('Stay clear of clerical bones; tavern keepers love pilgrim silver', 0, { gold: 80, faithAuthority: -7, piety: -5 })
  ]);
 add('epc_reliquary_inquest', 'Religion', 'Lanterns Over Velvet Cushions',
  'Examining silk wrappings in secret, canons find Greek ink signatures on one skull, sheep-bone splices on a second, and genuine antiquity on the third.',
  'followup', [
   C('Verify the authentic relic openly and convert false shrines to parish schools', 90, { research: 8, trust: 9, faithAuthority: 8 }, 'epc_reliquary_closing'),
   C('Bury the dubious bones quietly in consecrated ground at night', 0, { piety: 8, stability: 5 }, 'epc_reliquary_closing')
  ]);
 add('epc_reliquary_closing', 'Religion', 'Clean Altars, Quiet Devotion',
  'Pilgrims still climb the worn flagstones, though scoffers find fewer jests at the market cross.',
  'followup', [
   C('Issue sealed certificates of authenticity for major abbey treasuries', 45, { faithAuthority: 8, legitimacy: 5 }),
   C('Close the inquiry and bless the honest monks', 0, { piety: 6, stability: 4 })
  ]);

 // =========================================================================
 // MONKS & MYSTICS — HERMETIC OPUS, SECRET CULTS, ARTIFACT SMITHS & RELICS
 // =========================================================================

 // 29. Hermetic Society — The Magnum Opus Laboratory (4 stages)
 add('epc_hermetic_opus', 'Learning & Occult', 'Alembics Glowing Under Lead Roofs',
  'Your Hermetic fellow scholars propose pooling rare quicksilver, furnace-clay, and translated Arabic codices to synthesize a universal restorative tincture—the Magnum Opus.',
  'research', [
   C('Finance the royal tower conservatory and Venetian glassware', 155, { research: 12, prestige: 7, stability: -2 }, 'epc_hermetic_retort'),
   C('Permit modest herbal distillations while barring forbidden celestial seals', 70, { research: 7, piety: 4 }, 'epc_hermetic_retort'),
   C('Confiscate the furnaces lest abbey watchers cry sorcery', 0, { faithAuthority: 6, stability: 4 })
  ]);
 add('epc_hermetic_retort', 'Learning & Occult', 'Cracked Crystal at the Third Watch',
  'At midnight a copper-bound retort bursts in a shower of blue sparks, singing your sleeve and filling the stairwell with bitter sulfur vapor.',
  'followup', [
   C('Calm the coughing apprentices and recalibrate furnace vents in brick', 90, { research: 11, development: 1, stability: 3 }, 'epc_hermetic_star'),
   C('Consult ancient Alexandrian diagrams to trace the pressure flaw', 40, { research: 9, prestige: 4 }, 'epc_hermetic_star'),
   C('Abandon fiery distillations and salvage the clean mineral notes', 0, { stability: 4, research: 4 })
  ]);
 add('epc_hermetic_star', 'Learning & Occult', 'Conjunction Beneath Winter Aldebaran',
  'When winter frost clears the sky, glass tubes turn bright ruby-red at last—the adepts press you to record the treatise under seal.',
  'followup', [
   C('Bind the Hermetic treatise in gilt calfskin for university masters', 110, { research: 14, prestige: 10, legitimacy: 5 }, 'epc_hermetic_legacy'),
   C('Reserve the ciphered manuscript strictly for sworn royal successors', 0, { securityMonths: 10, research: 9, legitimacy: 6 }, 'epc_hermetic_legacy')
  ]);
 add('epc_hermetic_legacy', 'Learning & Occult', 'The Ruby Phial on Velvet',
  'Doctors marvel at the concentrated mineral spirit, while cathedral scholars debate whether natural philosophy has crossed into forbidden pride.',
  'followup', [
   C('Share standardized apothecary remedies with city infirmaries', 75, { trust: 10, development: 1, research: 8 }),
   C('Seal the red glass vessel in the palace strongroom', 0, { prestige: 8, securityMonths: 8 })
  ]);

 // 30. Master Weaponsmith Commission — Damascus & Crucible Steel (4 stages)
 add('epc_smith_commission', 'Martial & Court', 'The Damascus Steelwright’s Caravan',
  'A master bladesmith expelled from wars abroad offers to forge a watered-steel sword or articulated harness worthy of a sovereign—if supplied charcoal, horn, and secret flux.',
  'land', [
   C('Commission a royal watered-steel sword and silver scabbard', 165, { prestige: 12, legitimacy: 7, tools: 10 }, 'epc_smith_forge'),
   C('Order fluted tournament-grade field armor for the crown bodyguard', 140, { prestige: 10, stability: 5, tools: 15 }, 'epc_smith_forge'),
   C('Hire the smith merely to train guild apprentices in tempering steel', 70, { development: 1, tools: 20, credit: 5 }),
   C('Turn the wanderer away; royal armories already overflow', 0, { credit: 3, stability: 3 })
  ]);
 add('epc_smith_forge', 'Martial & Court', 'Watered Ripples Inside the Crucible',
  'Six weeks in, the smith wakes you before cockcrow: his apprentice dropped damp tallow into the white-hot crucible, threatening to crack a rare billet of wootz cake.',
  'followup', [
   C('Import fresh Anatolian billets at express courier cost to save the work', 115, { prestige: 10, research: 5 }, 'epc_smith_quench'),
   C('Order the smith to fold the flawed billet patiently with native bog-iron', 40, { research: 6, tools: 8 }, 'epc_smith_quench'),
   C('Cut losses cleanly and accept a serviceable plain steel blade', 0, { stability: 4, tools: 5 })
  ]);
 add('epc_smith_quench', 'Martial & Court', 'Quenched in Oil and Goat’s Tallows',
  'Steam roars up to blackened rafters as glowing iron plunges into spiced oil; when acid etching clears the scale, silver-grey waves ripple along the fuller.',
  'followup', [
   C('Pay for rock-crystal pommel inlays and his guild master’s diploma', 85, { prestige: 12, legitimacy: 8, trust: 5 }, 'epc_smith_unveiling'),
   C('Reward him in gold coin and keep ornament austere and lethal', 0, { prestige: 8, stability: 4 }, 'epc_smith_unveiling')
  ]);
 add('epc_smith_unveiling', 'Martial & Court', 'Steel That Sings When Drawn',
  'At court assembly the blade slices a silk veil floating mid-air, drawing sharp intakes of breath from armored magnates.',
  'followup', [
   C('Grant the smith permanent royal armory quarters to train guildmasters', 75, { development: 1, tools: 18, credit: 6 }),
   C('Hang the ceremonial sword beside the throne dais', 0, { prestige: 9, legitimacy: 6 })
  ]);

 // 31. Secret Cult Purge — Masked Initiates Beneath the Abbey (4 stages)
 add('epc_secret_cult', 'Intrigue', 'Inverted Crosses in the Wine Cellar',
  'Watchmen chasing a cellar thief beneath a noble townhouse stumble upon black beeswax candles, goat-skin rolls, and seven silver masks bearing court emblems.',
  'knownSecret', [
   C('Seal the street quietly and interrogate the cellar-keeper by candlelight', 75, { securityMonths: 10, stress: 5 }, 'epc_cult_list'),
   C('Call cathedral inquisitors immediately to arrest every suspect at dawn', 50, { faithAuthority: 9, piety: 7, stability: -3 }, 'epc_cult_trial'),
   C('Burn the masks anonymously and pretend nothing happened to spare panic', 0, { stability: 4, stress: 8, securityMonths: -4 })
  ]);
 add('epc_cult_list', 'Intrigue', 'Ciphered Names in Beeswax',
  'Under quiet questioning the terrified steward points to a hollow bedpost holding ciphered dues—naming two treasury clerks and an influential border baroness.',
  'followup', [
   C('Confront the baroness privately and turn her network into crown informants', 65, { securityMonths: 12, legitimacy: 6, stress: 4 }, 'epc_cult_verdict'),
   C('Arrest the minor clerks openly while quietly fining the great lady', 0, { gold: 130, securityMonths: 8, faithAuthority: 4 }, 'epc_cult_verdict')
  ]);
 add('epc_cult_trial', 'Intrigue', 'Crowds Outside the Consistory',
  'Confessions wrung by fear spill onto market steps; frightened citizens begin accusing prosperous foreign weavers of casting hailstorms.',
  'followup', [
   C('Curb wild denunciations sharply and restrict charges to sworn evidence', 55, { legitimacy: 8, stability: 7, faithAuthority: 5 }, 'epc_cult_verdict'),
   C('Confiscate the convicted initiates’ town estates for the crown', 0, { gold: 160, piety: 5, stability: -4 }, 'epc_cult_verdict')
  ]);
 add('epc_cult_verdict', 'Intrigue', 'Ashes Swept From the Courtyard',
  'The brazier cools on the terrace; whether crushed in public or quietly blackmailed into loyalty, the shadowy lodge’s doors are barred.',
  'followup', [
   C('Endow watch-lanterns and discreet parish clerks to prevent future lodges', 80, { securityMonths: 12, piety: 6, stability: 5 }),
   C('Lock the seized cipher-books in your private study', 0, { securityMonths: 8, stress: 3 })
  ]);

 // 32. Monastic Relic Hunt — Into the Mountain Hermitage (3 stages)
 add('epc_monastic_hunt', 'Religion', 'The Blind Monk’s Map of Cedar Roots',
  'A dying anchorite bequeaths a tattered sheepskin sketch showing a collapsed cavern library where early martyrs hid silver gospel bindings before ancient invasions.',
  'institution', [
   C('Fit out mules, ropes, and pious friars to recover the forgotten library', 115, { piety: 10, research: 8, prestige: 5 }, 'epc_monastic_cavern'),
   C('Send armed surveyors first lest bandits lurk near the gorge', 65, { securityMonths: 7, research: 5 }, 'epc_monastic_cavern'),
   C('Leave mountain ruins undisturbed; saints rest best without pickaxes', 0, { piety: 6, stability: 3 })
  ]);
 add('epc_monastic_cavern', 'Religion', 'Beeswax Drops on Limestone',
  'Behind fallen scree your expedition breaks into a bone-dry niche holding three cedar chests—one crusted in silver, another stacked with Greek homilies, and a broken iron bell.',
  'followup', [
   C('Restore the manuscripts in the capital scriptorium and enshrine the bell', 95, { research: 10, piety: 9, development: 1 }, 'epc_monastic_return'),
   C('Leave half the relics with the local mountain priory to earn rural goodwill', 35, { trust: 10, piety: 8, acceptance: 5 }, 'epc_monastic_return'),
   C('Bring only the silver bindings back to crown vaults', 0, { gold: 90, piety: -5 }, 'epc_monastic_return')
  ]);
 add('epc_monastic_return', 'Religion', 'Hymns Across the Cloister',
  'Monks unwrap salted vellum under amber windows, tracing ink untouched for seven hundred winters.',
  'followup', [
   C('Establish annual scholarly pilgrimages to study the recovered texts', 60, { research: 9, faithAuthority: 6, prestige: 6 }),
   C('Place the cedar chest peacefully beneath the chapel floor', 0, { piety: 7, stability: 4 })
  ]);

 // 33. The Scrivener’s Poisoned Ink — Scriptorium Forgery (3 stages)
 add('epc_scriptorium_forgery', 'Learning & Occult', 'Erasures Beneath the Vellum Shine',
  'Holding an abbey property charter up to afternoon sunlight, your keen-eyed clerk spots scraped knife-marks where ancient ink was washed off and overwritten.',
  'research', [
   C('Summon paleographers to expose the whole ring of charter forgers', 85, { research: 10, legitimacy: 8, securityMonths: 6 }, 'epc_forgery_trial'),
   C('Quietly use the discovery as leverage over the ambitious abbot', 25, { gold: 80, securityMonths: 8, piety: -4 }, 'epc_forgery_trial'),
   C('Burn the dubious leaf silently to avoid shaming a pious house', 0, { piety: 6, stability: 4 })
  ]);
 add('epc_forgery_trial', 'Learning & Occult', 'Gall-Oak Ink and Scraped Calfskin',
  'Before stunned councilmen the chief scribe confesses to manufacturing three centuries of river-fishery claims using aged vinegar and soot.',
  'followup', [
   C('Issue standardized crown watermarked parchment for all future deeds', 100, { research: 9, development: 1, credit: 7 }, 'epc_forgery_reforms'),
   C('Pillory the scribe and return stolen fisheries to river villages', 0, { trust: 10, unrest: -6, legitimacy: 6 }, 'epc_forgery_reforms')
  ]);
 add('epc_forgery_reforms', 'Learning & Occult', 'Sealed Chancery Rolls',
  'Bailiffs along the estuary breathe easier knowing fake ink no longer steals nets and reeds overnight.',
  'followup', [
   C('Fund a royal school of paleography and charter law', 75, { research: 10, legitimacy: 7 }),
   C('File the forged skins cleanly as legal warnings', 0, { securityMonths: 6, stability: 4 })
  ]);

 // 34. Stargazing on the Battlements — Halley’s / Comet Omen (3 stages)
 add('epc_comet_omen', 'Learning & Occult', 'A Bearded Star Above the Bell-Tower',
  'For seven clear nights a pale broom-star drags its tail above the eastern gate; preachers cry plague and treason while Hermetic astrologers scramble for astrolabes.',
  'focus_learning', [
   C('Mount brass quadrants on the keep roof and chart its exact parallax', 95, { focusXP: 28, research: 11, prestige: 5 }, 'epc_comet_charts'),
   C('Order three days of calm fasting and bell-ringing to steady citizens', 45, { piety: 9, stability: 6, faithAuthority: 6 }, 'epc_comet_charts'),
   C('Laugh off superstitious fright and forbid street astrologers', 0, { legitimacy: 5, stress: -4 })
  ]);
 add('epc_comet_charts', 'Learning & Occult', 'Parallax and Pulpits',
  'Calculated tables suggest the star moves high above the moon’s sphere—contradicting old Aristotelian schoolbooks and thrilling young university clerks.',
  'followup', [
   C('Sponsor public astronomical disputations in the cathedral school', 80, { research: 12, focusXP: 22, prestige: 6 }, 'epc_comet_fade'),
   C('Keep radical star tables inside private Hermetic notebooks', 0, { securityMonths: 7, focusXP: 14, stability: 4 }, 'epc_comet_fade')
  ]);
 add('epc_comet_fade', 'Learning & Occult', 'Clear Dawn Without a Tail',
  'When the pale streak finally fades beyond the western marsh, the city stands unburned—leaving behind sharper lenses or steadier prayers.',
  'followup', [
   C('Endow permanent glass-grinders and brass instrument makers', 85, { research: 10, credit: 5, prestige: 6 }),
   C('Archive the sky-logs calmly and rest from midnight watches', 0, { stress: -8, focusXP: 10 })
  ]);

 // 35. The Possessed Chaplain’s Midnight Sermons (3 stages)
 add('epc_possessed_chaplain', 'Religion', 'Strange Tongues From the Belfry',
  'Your gentle court chaplain begins shouting ancient curses in cracked voices at matins, clawing stone pillars before collapsing foam-flecked on icy tiles.',
  'illness', [
   C('Summon both sober physicians and gentle abbey confessors to tend him', 95, { health: -20, piety: 8, stability: 5 }, 'epc_chaplain_vigil'),
   C('Order strict exorcism rites inside the locked choir by candle-light', 40, { piety: 10, faithAuthority: 7, health: -8 }, 'epc_chaplain_vigil'),
   C('Confine the poor man softly in a quiet garden infirmary', 0, { stability: 4, health: -5, stress: 3 })
  ]);
 add('epc_chaplain_vigil', 'Religion', 'Fever or Fiend in the Linen',
  'Between fits the trembling priest whispers of bruised ribs, sleepless fasting, and bitter rye bread—leaving doctors and friars glaring across the cot.',
  'followup', [
   C('Feed him warm mutton broth, clean water, and gentle sleep drafts', 60, { health: -25, stress: -5, research: 4 }, 'epc_chaplain_recovery'),
   C('Continue vigils of psalms and cold-water ablutions', 0, { piety: 8, health: -10, faithAuthority: 4 }, 'epc_chaplain_recovery')
  ]);
 add('epc_chaplain_recovery', 'Religion', 'Morning Bells Over Quiet Cloisters',
  'After twelve nights the pale priest sits upright blinking at winter sun, weak as a reed yet speaking gently in his own voice once more.',
  'followup', [
   C('Appoint a permanent infirmary almoner for overworked clergy', 70, { piety: 9, health: -10, stability: 5 }),
   C('Grant him three months’ quiet convalescence in hillside orchards', 0, { piety: 6, stress: -6 })
  ]);

 // 36. Master Goldsmith’s Crown Regalia — The Scepter of Lilies (3 stages)
 add('epc_goldsmith_scepter', 'Court', 'Silver Filigree and Borrowed Credit',
  'Your Nuremberg goldsmith unveils wax models for a twin-dove scepter and imperial orb—promising foreign creditors will judge the crown rich beyond measure.',
  'inflation', [
   C('Commission the masterpiece outright using clean treasury bullion', 155, { prestige: 13, legitimacy: 9, credit: 6 }, 'epc_scepter_debt'),
   C('Plate gilded copper cores with thin silver to fool distant galleries', 45, { prestige: 6, inflation: -1, credit: 3 }, 'epc_scepter_debt'),
   C('Melt cracked silver plate into honest coin and skip showy baubles', 0, { gold: 95, inflation: -2, stability: 4 })
  ]);
 add('epc_scepter_debt', 'Court', 'Merchants Peering Beneath Velvet',
  'While diplomats praise the dazzling filigree, Antwerp bill-brokers send polite inquiries asking when old cloth-loans will see honest silver.',
  'followup', [
   C('Pay down overdue interest promptly alongside the new regalia’s debut', 100, { credit: 10, inflation: -2, legitimacy: 6 }, 'epc_scepter_court'),
   C('Host bankers beneath the gleaming scepter to reassure them of royal solvency', 35, { credit: 6, prestige: 6 }, 'epc_scepter_court'),
   C('Keep creditors waiting at the ante-chamber door', 0, { credit: -5, gold: 40 })
  ]);
 add('epc_scepter_court', 'Court', 'Gleaming Authority',
  'Whether gilded show or solid gold, the regalia anchors palace ceremony while treasurers weigh every ounce against daily bread.',
  'followup', [
   C('Mint matched commemorative groats at full honest silver weight', 65, { credit: 8, inflation: -2, legitimacy: 6 }),
   C('Store the scepter under twin-key wardenship', 0, { securityMonths: 7, prestige: 5 })
  ]);

 // 37. The Alchemist’s Artificial Homunculus / Automaton Clock (3 stages)
 add('epc_brass_automaton', 'Learning & Occult', 'Clockwork Angels on the Mantle',
  'A monastic clockmaker brings a ticking brass sphere whose geared angels strike every canonical hour—prompting hushed whispers of forbidden automata.',
  'crossroads_press', [
   C('Patronize his gear-workshop and install a public tower clock on the guildhall', 140, { development: 1, research: 11, prestige: 8 }, 'epc_clock_tower'),
   C('Keep the wondrous mechanism inside the palace council chamber', 75, { research: 7, legitimacy: 6, prestige: 5 }, 'epc_clock_tower'),
   C('Dismiss brass toys and stick to honest sundials and hourglasses', 0, { stability: 4, trust: 3 })
  ]);
 add('epc_clock_tower', 'Learning & Occult', 'Iron Bells Measuring Merchant Hours',
  'Workmen argue over the chime: weavers welcome regular shift bells while night-watchmen complain brass gears jam whenever sleet freezes oil.',
  'followup', [
   C('Establish a salaried guild of civic clock-keepers and metal turners', 85, { tools: 18, development: 1, credit: 6 }, 'epc_clock_legacy'),
   C('Leave repairs to abbey sacristans in exchange for chapel dues', 0, { piety: 5, credit: 3 }, 'epc_clock_legacy')
  ]);
 add('epc_clock_legacy', 'Learning & Occult', 'Time Ticking Across the Square',
  'From dawn market openings to curfew gates, precision brass replaces guesswork—and scholars begin dreaming of ever finer gear-trains.',
  'followup', [
   C('Commission pocket astronomical dials for naval pilots', 70, { research: 10, credit: 6 }),
   C('Ring the great bell cleanly at noon and rest satisfied', 0, { trust: 6, stability: 4 })
  ]);

 // 38. Inquisitorial Book-Burning vs Cloistered Preservation (3 stages)
 add('epc_forbidden_folios', 'Learning & Occult', 'Charred Margins in the Cloister Cart',
  'Zealous mendicants haul three oxcarts of pagan poetry, Arabic optics, and suspect vernacular tracts into the square, calling for flint and faggots.',
  'faithTension', [
   C('Pay the friars generously for pious alms—and quietly move the books to royal shelves', 120, { research: 11, acceptance: 8, piety: 5 }, 'epc_folios_shelf'),
   C('Allow theological tracts to be debated openly under cathedral moderators', 60, { research: 7, trust: 7, faithAuthority: 5 }, 'epc_folios_shelf'),
   C('Let the bonfire roar to appease angry parish crowds', 0, { piety: 8, faithAuthority: 7, research: -5, unrest: -4 })
  ]);
 add('epc_folios_shelf', 'Learning & Occult', 'Locked Iron Grilles in the Upper Gallery',
  'Scholars line up for reading keys while suspicious prelates ask why heterodox geometry still sleeps beneath royal roof tiles.',
  'followup', [
   C('Publish clean mathematical diagrams while sealing controversial theology', 75, { research: 9, faithAuthority: 6, credit: 4 }, 'epc_folios_end'),
   C('Issue open scholar passes to vetted masters of every faith', 40, { acceptance: 10, trust: 8, research: 7 }, 'epc_folios_end'),
   C('Chain the volumes permanently to oak desks', 0, { securityMonths: 7, stability: 4 })
  ]);
 add('epc_folios_end', 'Learning & Occult', 'Quiet Lamps Above Parchment',
  'Decades later artisans cite those salvaged optics treatises when grinding spectacle lenses—proof that rescued ink outlives shouting crowds.',
  'followup', [
   C('Endow paper-mills and copyist stipends for the royal archive', 80, { development: 1, research: 10 }),
   C('Leave the rescued shelves under careful librarianship', 0, { legitimacy: 5, stability: 4 })
  ]);

 // 39. Secret Cult of the Star-Goat — Masquerade at the Winter Solstice (3 stages)
 add('epc_solstice_masks', 'Intrigue', 'Cloven Hooves Painted on Birch Bark',
  'During midwinter carnival, masked revelers slip past palace torchbearers and leave soot-drawn star sigils outside your consort’s bedchamber.',
  'activePlot', [
   C('Double inner corridor guards and trace the soot-recipe discreetly', 85, { securityMonths: 11, plotPreparation: 8, stress: 5 }, 'epc_masks_trail'),
   C('Laugh loudly at foolish mummers while sweeping every wardrobe quietly', 30, { stability: 5, securityMonths: 6 }, 'epc_masks_trail'),
   C('Lock every wing and cancel winter feasting outright', 0, { stability: -3, stress: 7, securityMonths: 8 })
  ]);
 add('epc_masks_trail', 'Intrigue', 'Wax Drippings Behind the Kitchen Stairs',
  'Guards trace rare bayberry wax to a minor page who confesses a disgruntled court faction paid him to rattle your household nerves.',
  'followup', [
   C('Feed false whispers back through the page to unmask his masters', 60, { plotPreparation: 12, securityMonths: 10 }, 'epc_masks_trap'),
   C('Dismiss the page with quiet lashes and seal the back stairs', 0, { securityMonths: 7, stability: 5 }, 'epc_masks_trap')
  ]);
 add('epc_masks_trap', 'Intrigue', 'Dawn Arrests in the Stableyard',
  'Cloaked conspirators expecting frightened silence walk straight into halberd shafts beside the horse trough.',
  'followup', [
   C('Make one sharp public example on the scaffold', 35, { legitimacy: 8, stability: 4, stress: -5 }),
   C('Confiscate their coin silently and bind them by secret confession', 0, { gold: 115, securityMonths: 9, legitimacy: 5 })
  ]);

 // 40. The Reliquary of the Blind Painter (3 stages)
 add('epc_blind_painter', 'Culture & Learning', 'Ultramarine Ground From Lapis Lazuli',
  'A half-blind Dominican friar offers to illuminate a monumental Chronicle of Kings in powdered lapis and beaten gold—if supplied rare Afghan blue stone.',
  'land', [
   C('Purchase genuine ultramarine and grant him a sunlit north studio', 145, { prestige: 12, piety: 8, research: 6 }, 'epc_painter_ink'),
   C('Substitute cheaper copper azurite and keep costs modest', 55, { prestige: 5, piety: 5, credit: 3 }, 'epc_painter_ink'),
   C('Order plain black-and-red iron-gall chronicles instead', 0, { research: 4, stability: 3 })
  ]);
 add('epc_painter_ink', 'Culture & Learning', 'Fading Sight on the Final Quire',
  'Halfway through the Coronation miniature the friar’s eyes cloud over; his young novice begs leave to finish the border vines from his master’s dictation.',
  'followup', [
   C('Hire spectacle-makers and rest the friar gently while guiding the novice', 75, { research: 8, trust: 7, piety: 6 }, 'epc_painter_book'),
   C('Let the novice finish briskly before winter light fails', 0, { prestige: 6, stability: 4 }, 'epc_painter_book')
  ]);
 add('epc_painter_book', 'Culture & Learning', 'Gold Leaf Turned Under Candles',
  'When the calfskin clasp snaps shut, foreign envoys lean over the lectern marveling at blue robes brighter than Mediterranean noon.',
  'followup', [
   C('Endow an abbey illumination workshop in the friar’s honor', 80, { piety: 9, development: 1, prestige: 8 }),
   C('Preserve the sole codex beside crown treaties', 0, { legitimacy: 7, prestige: 5 })
  ]);

 // 41. Hermetic Emerald Tablet Expedition (3 stages)
 add('epc_emerald_expedition', 'Learning & Occult', 'Levantine Portolans and Ciphered Brass',
  'A Venetian ship-captain brings word of a cracked Greek inscription copied from an Alexandrian cistern—claiming it bridges metallurgy and medicine.',
  'crossroads_contact', [
   C('Fund a discreet scholarly galley factor to copy every inscription cleanly', 135, { research: 12, credit: 6, prestige: 6 }, 'epc_emerald_crates'),
   C('Purchase only his existing sea-stained rubbings at harbor wharf', 55, { research: 7, credit: 4 }, 'epc_emerald_crates'),
   C('Leave antique port rumors to Venetian dreamers', 0, { credit: 3, stability: 3 })
  ]);
 add('epc_emerald_crates', 'Learning & Occult', 'Salt-Crusted Chests at Custom House',
  'Crates arrive reeking of cedar and brine; customs clerks suspect contraband silk until royal seals wave them untouched toward the library.',
  'followup', [
   C('Assemble bilingual translators of Greek, Arabic, and Latin at once', 90, { research: 12, acceptance: 7, trust: 5 }, 'epc_emerald_fruits'),
   C('Have royal metallurgists test the practical smelting recipes first', 0, { tools: 18, research: 7 }, 'epc_emerald_fruits')
  ]);
 add('epc_emerald_fruits', 'Learning & Occult', 'Brighter Brass and Finer Glass',
  'Out of cryptic axioms emerge remarkably clean glass-annealing ovens and acid-parting tricks that silver refiners praise.',
  'followup', [
   C('Apply the cleaner refining methods at the royal mint', 75, { credit: 10, inflation: -2, research: 6 }),
   C('Publish the philosophical commentary under royal imprint', 0, { prestige: 9, research: 8 })
  ]);

 // 42. Monastic Beer & Herb Garden Patent (3 stages)
 add('epc_abbey_brewhouse', 'Economy & Trade', 'Hops Growing Tall Along Cloister Walls',
  'Cistercian brewers perfect a crisp hopped ale that keeps six months at sea without souring—sparking furious petitions from traditional gruit-tax townsmen.',
  'trade', [
   C('Grant the abbey a royal shipping patent and standardize barrel measures', 110, { credit: 9, development: 1, piety: 6 }, 'epc_brewhouse_riot'),
   C('Split licenses evenly between monastic cellars and town brewers', 60, { trust: 9, credit: 6, unrest: -4 }, 'epc_brewhouse_riot'),
   C('Protect old town gruit-monopolies and tax abbey kettles', 0, { gold: 80, trust: -4, piety: -3 })
  ]);
 add('epc_brewhouse_riot', 'Economy & Trade', 'Smashed Casks on the Cobbles',
  'Angry tavern-wives overturn two monastic drays outside the gate; hops spill across muddy cobbles while abbey stewards demand restitution.',
  'followup', [
   C('Mediate fair market days and train town brewers in hop-kiln craft', 75, { trust: 10, unrest: -8, tools: 12 }, 'epc_brewhouse_boom'),
   C('Fine the ringleaders gently and indemnify the abbey cellar', 0, { legitimacy: 6, credit: 5, stability: 4 }, 'epc_brewhouse_boom')
  ]);
 add('epc_brewhouse_boom', 'Economy & Trade', 'Export Barrels Bound for Winter Fleets',
  'Sealed oak tuns roll onto merchant cogs, turning quiet cloister gardens into a steady fountain of harbor customs.',
  'followup', [
   C('Contract abbey ales directly for naval and garrison provisioning', 60, { food: 55, credit: 7, trust: 5 }),
   C('Collect ordinary barrel excise cleanly', 0, { gold: 75, credit: 4 })
  ]);

 // =========================================================================
 // THE REAPER'S DUE — SECLUSION, PHYSICIANS, PLAGUES & PROSPERITY BOOMS
 // =========================================================================

 // 43. Closing the Castle Gates — Seclusion Under Pestilence (4 stages)
 add('epc_seclusion_gates', 'Crisis & Plague', 'Black Crosses Chalked on Shutters',
  'Carts rattle over cobbles after curfew bearing silent bundles to lime pits; your court physician begs you to hoist the drawbridge, bar the postern, and seal the keep.',
  'epidemic', [
   C('Hoist the iron portcullis, salt the larder, and seal the court inside', 110, { crisis: -12, securityMonths: 8, trust: -6 }, 'epc_seclusion_cellar'),
   C('Keep gates open by day for relief carts while isolating sick wards', 145, { crisis: -16, trust: 10, unrest: -6 }, 'epc_seclusion_wards'),
   C('Ride with almoners straight through market parishes to rally courage', 80, { prestige: 10, trust: 12, crisis: -6 }, 'epc_seclusion_wards'),
   C('Retire quietly to a hillside hunting lodge with half the treasury', 0, { legitimacy: -8, stability: -4, trust: -10 })
  ]);
 add('epc_seclusion_cellar', 'Crisis & Plague', 'Scratching Behind Wainscot in Week Six',
  'Rain hammers shuttered arrow-slits; salted pork turns rancid, courtiers quarrel over dwindling claret, and a pale steward catches a kitchen boy hoarding smoked eels.',
  'followup', [
   C('Ration every lord and scullion alike and banish hoarding strictly', 40, { stability: 7, legitimacy: 7, food: 25 }, 'epc_seclusion_masque'),
   C('Crack open royal vintage cellars to stave off bitter claustrophobia', 0, { stability: 6, prestige: 4, trust: 2 }, 'epc_seclusion_masque'),
   C('Flog the thief publicly in the courtyard to terrify servants', 0, { unrest: 5, securityMonths: 5, legitimacy: -3 }, 'epc_seclusion_masque')
  ]);
 add('epc_seclusion_wards', 'Crisis & Plague', 'Vinegar Sponges and Lime-Washed Tents',
  'Outside the curtain wall, volunteer burghers and mendicant nurses scrub fever blankets in boiling lye while smoke from juniper braziers stings every eye.',
  'followup', [
   C('Fund permanent riverside pest-houses and pay double wages to carters', 130, { crisis: -20, trust: 12, development: 1 }, 'epc_seclusion_dawn'),
   C('Enforce strict forty-day harbor and road quarantines with armed pickets', 65, { crisis: -14, securityMonths: 8, unrest: 3 }, 'epc_seclusion_dawn'),
   C('Distribute herbs and vinegar rations from palace stores', 0, { food: -20, trust: 7, crisis: -8 }, 'epc_seclusion_dawn')
  ]);
 add('epc_seclusion_masque', 'Crisis & Plague', 'Laughter Too Loud in the Locked Hall',
  'Half-mad from damp limestone walls, young nobles propose a midnight masquerade of gilded skeletons to mock the pestilence outside.',
  'followup', [
   C('Forbid morbid revelry and lead sober prayers at the chapel steps', 25, { piety: 9, stability: 7 }, 'epc_seclusion_dawn'),
   C('Permit one brief masked supper so taut nerves do not snap', 0, { stability: 4, prestige: 4, piety: -4 }, 'epc_seclusion_dawn')
  ]);
 add('epc_seclusion_dawn', 'Crisis & Plague', 'Creaking Hinges After First Frost',
  'When hard December frost finally stills the miasma, iron bolts slide back; pale survivors squint at cold sun and count who still answers the roll.',
  'followup', [
   C('Burn infected bedding cleanly and charter a public memorial hospital', 105, { crisis: -15, trust: 12, piety: 8 }),
   C('Open granaries and remit hearth-taxes for devastated wards', 50, { food: 40, unrest: -10, legitimacy: 8 }),
   C('Wash the flagstones with vinegar and resume ordinary court business', 0, { stability: 5, credit: 4 })
  ]);

 // 44. Experimental Court Physician — The Mystic Cure (3 stages)
 add('epc_physician_mystic', 'Crisis & Plague', 'Sawbones, Leeches, or Moonlit Toads',
  'With a senior kinsman burning in septic fever, your learned Galenist shakes his head while a scarred Moorish empiric offers a daring trepanation—or bitter mold poultice.',
  'illness', [
   C('Authorize the bold empiric’s mold poultice and clean boiled linen', 95, { health: -28, research: 8, stress: 5 }, 'epc_physician_night'),
   C('Trust gentle conservative cooling baths, barley water, and prayer', 45, { health: -15, piety: 6 }, 'epc_physician_night'),
   C('Let the old Galenist bleed the patient twice before vespers', 0, { stability: 3, health: -5, stress: 4 }, 'epc_physician_night')
  ]);
 add('epc_physician_night', 'Crisis & Plague', 'Sweat Cooling at the Third Bell',
  'At midnight the chamber smells of camphor, roasted onions, and sweat; the patient’s pulse flutters wildly as physicians argue beside the copper basin.',
  'followup', [
   C('Pay for rare Venetian theriac and warm broth through dawn', 70, { health: -22, stress: -4 }, 'epc_physician_dawn'),
   C('Keep quiet watch yourself with damp cloths on the brow', 0, { health: -12, piety: 5 }, 'epc_physician_dawn')
  ]);
 add('epc_physician_dawn', 'Crisis & Plague', 'Open Eyes in Pale Sunlight',
  'The fever breaks with morning larks; court apothecaries rush to copy down every grain measured during the long watch.',
  'followup', [
   C('Appoint the bold healer salaried Court Physician and endow a herbarium', 90, { research: 10, health: -10, prestige: 6 }),
   C('Reward the bedside attendants cleanly in silver coin', 35, { stability: 6, piety: 5 }),
   C('Give quiet thanks and return to affairs of state', 0, { stress: -6 })
  ]);

 // 45. Plague Processions vs Quarantine Cordons (3 stages)
 add('epc_plague_procession', 'Crisis & Plague', 'Scourges and Banners Along the Causeway',
  'Hundreds of barefoot flagellants march toward the capital chanting dirges, certain that crowded penitential processions will appease wrathful heaven faster than doctors.',
  'epidemic', [
   C('Turn the dense crowd back gently outside the ditch with bread carts', 85, { crisis: -15, unrest: -5, food: -25 }, 'epc_plague_gates'),
   C('Permit a small ordered clergy procession while banning dense crowds', 45, { piety: 8, faithAuthority: 6, crisis: -8 }, 'epc_plague_gates'),
   C('Join the crowded march barefoot yourself to show fearless devotion', 0, { piety: 12, prestige: 7, crisis: 5, trust: 4 })
  ]);
 add('epc_plague_gates', 'Crisis & Plague', 'Campfires Outside the West Gate',
  'Barred from narrow alleys, exhausted pilgrims camp beside the brick kilns—hungry, shivering, and easily stirred by fiery prophets.',
  'followup', [
   C('Erect wind-shelters, boil clean well-water, and send friar nurses', 95, { crisis: -16, trust: 10, piety: 7 }, 'epc_plague_after'),
   C('Escort the column peacefully toward open countryside parishes', 0, { stability: 5, unrest: -4 }, 'epc_plague_after')
  ]);
 add('epc_plague_after', 'Crisis & Plague', 'Silence After the Chants Fade',
  'Strict cordons spare the crowded weavers’ quarter from the worst surge, though pious chroniclers debate whether prudence outranked zeal.',
  'followup', [
   C('Codify municipal health boards with authority over future cordons', 80, { development: 1, research: 8, trust: 7 }),
   C('Endow memorial prayers for every parish struck along the road', 0, { piety: 8, stability: 4 })
  ]);

 // 46. Wartime Devastation — Scorched Barns & Bandit Roads (4 stages)
 add('epc_war_devastation', 'Crisis & Plague', 'Black Chimneys Along the March',
  'Six months of foraging armies leave three river bailiwicks stripped of seed-corn and draft oxen; ragged plowmen hitch themselves to wooden harrows.',
  'famine', [
   C('Buy seed-wheat and plow-oxen from unaffected duchies at any cost', 165, { food: 110, crisis: -18, trust: 11 }, 'epc_devastation_seed'),
   C('Forgive three years of hearth-rents for families who stay and replant', 55, { trust: 10, unrest: -9, credit: -3 }, 'epc_devastation_seed'),
   C('Send armed bailiffs to gather whatever grain hides under thatch', 0, { food: 45, unrest: 10, trust: -10 }, 'epc_devastation_bandits')
  ]);
 add('epc_devastation_seed', 'Crisis & Plague', 'Green Shoots Through Ash',
  'By April emerald wheat spears break blackened loam, yet disbanded deserters prowl hedgerows stealing plough-horses by night.',
  'followup', [
   C('Post mounted road-patrols and hang captured horse-thieves at crossroads', 75, { securityMonths: 9, unrest: -7, trust: 6 }, 'epc_devastation_harvest'),
   C('Offer deserters amnesty and two acres of waste scrub if they turn sod', 0, { development: 1, stability: 6, food: 35 }, 'epc_devastation_harvest')
  ]);
 add('epc_devastation_bandits', 'Crisis & Plague', 'Smoke From the Bailiff’s Barn',
  'Starving cottagers burn two tax-collection barns and slip into beechwoods, turning desolate parishes into hollow outlaw country.',
  'followup', [
   C('Send emergency bread wagons and promise full pardon on surrender', 115, { food: 65, unrest: -11, trust: 7 }, 'epc_devastation_harvest'),
   C('Sweep the woods briskly with mounted crossbowmen', 0, { securityMonths: 8, unrest: -4, trust: -4 }, 'epc_devastation_harvest')
  ]);
 add('epc_devastation_harvest', 'Crisis & Plague', 'First Sheaves Bound in Twine',
  'Autumn wagons creak lighter than in fat years, yet smoke curls cleanly from mended roofs and bellies hold warm porridge.',
  'followup', [
   C('Build stone community seed-barns locked against future foraging', 90, { food: 75, development: 1, crisis: -10 }),
   C('Hold quiet harvest prayers and tally surviving hearths', 0, { piety: 6, stability: 5 })
  ]);

 // 47. Prosperity Boom — Chartering a New Market Borough (3 stages)
 add('epc_prosperity_borough', 'Economy & Trade', 'Crowded Stalls Beyond the Ditch',
  'Years of peace swell a riverside hamlet past its ancient palisade; wool-carders, dyers, and wainwrights petition for a royal market charter and stone bridge.',
  'land', [
   C('Grant full borough liberties, seal a weekly fair, and pave the main street', 145, { development: 1, credit: 10, trust: 10 }, 'epc_borough_guildhall'),
   C('Sell limited stall-franchises while keeping justice strictly in baron hands', 50, { gold: 95, credit: 5, loyalty: 4 }, 'epc_borough_guildhall'),
   C('Forbid unauthorized suburbs lest ancient chartered towns complain', 0, { stability: 5, credit: -3 })
  ]);
 add('epc_borough_guildhall', 'Economy & Trade', 'Limestone Quoins Rising Above Willows',
  'Within two summers red-tile roofs multiply, though elder guilds upstream complain the new borough steals barge traffic with lighter quay dues.',
  'followup', [
   C('Harmonize river tolls fairly and dredge shared barge channels', 85, { credit: 9, trust: 8, tools: 15 }, 'epc_borough_fair'),
   C('Back the energetic new borough fully as a showcase of crown growth', 0, { development: 1, prestige: 7, unrest: 3 }, 'epc_borough_fair')
  ]);
 add('epc_borough_fair', 'Economy & Trade', 'Silk Banners at Saint Martin’s Fair',
  'Flemish factors and mountain drovers crowd bright booths alike, leaving treasury chests heavier and the valley humming with looms.',
  'followup', [
   C('Establish a permanent silver assay office at the town market cross', 75, { credit: 10, inflation: -2, legitimacy: 6 }),
   C('Collect the inaugural fair customs cleanly', 0, { gold: 110, trust: 4 })
  ]);

 // 48. The Dancing Plague of the River Ward (3 stages)
 add('epc_dancing_mania', 'Crisis & Plague', 'Frenzied Feet on Hot Cobbles',
  'In mid-July heat a dozen weavers begin leaping uncontrollably outside Saint Vitus chapel; within four days sixty townsfolk dance till their shoes split bloody.',
  'unrest', [
   C('Clear the square gently, hire soft lute music, and feed exhausted dancers broth', 95, { unrest: -12, trust: 10, food: -20 }, 'epc_dancing_clinic'),
   C('Call cathedral priests to bless cold spring water and guide processions', 50, { piety: 9, faithAuthority: 7, unrest: -7 }, 'epc_dancing_clinic'),
   C('Lock guildhall doors and fine anyone drumming in the street', 0, { securityMonths: 6, unrest: 4, stability: -2 })
  ]);
 add('epc_dancing_clinic', 'Crisis & Plague', 'Ergot Dust in the Rye Loft',
  'While nurses bathe blistered ankles, a sharp-eyed apothecary notices purple spurs clinging to damp rye sacks from the flooded river flats.',
  'followup', [
   C('Burn spoiled rye cleanly and open royal wheat stores for every parish', 110, { food: 65, research: 8, trust: 11 }, 'epc_dancing_calm'),
   C('Order millers to sift grain twice and hang dry screens', 0, { research: 5, unrest: -6 }, 'epc_dancing_calm')
  ]);
 add('epc_dancing_calm', 'Crisis & Plague', 'Stillness Along the River Wall',
  'By August rain the frantic leaping ceases; exhausted weavers sleep three days straight while clerks add grain-blight inspections to market law.',
  'followup', [
   C('Endow permanent grain-inspector scales in every riverside market', 70, { trust: 9, development: 1, food: 35 }),
   C('Offer thanksgiving mass for restored sanity', 0, { piety: 7, stability: 5 })
  ]);

 // 49. Hospitaler Lazaretto & Leper Charter (3 stages)
 add('epc_lazaretto_charter', 'Crisis & Plague', 'Wooden Clappers Beyond the Orchard',
  'Outcast sufferers ringing wooden clappers gather beside warm lime springs north of town; wealthy burghers demand soldiers drive them deeper into barren fens.',
  'lowtrust', [
   C('Charter a walled hillside lazaretto with clean gardens and cisterns', 130, { trust: 12, piety: 10, development: 1 }, 'epc_lazaretto_nurses'),
   C('Place them under charitable abbey care far beyond market wells', 60, { piety: 8, trust: 6, unrest: -4 }, 'epc_lazaretto_nurses'),
   C('Enforce strict exclusion past the boundary ditch without expense', 0, { stability: 4, piety: -6, trust: -6 })
  ]);
 add('epc_lazaretto_nurses', 'Crisis & Plague', 'Clean Linen Beside Olive Groves',
  'Devoted nursing brothers tend sores with rosemary oil and fresh wool, yet neighbors worry market coins from the hillside spread contagion.',
  'followup', [
   C('Provide separate copper hospice tokens and boiled vinegar baths', 65, { research: 7, trust: 9, acceptance: 6 }, 'epc_lazaretto_peace'),
   C('Deliver weekly grain carts straight to the hospice postern', 0, { food: -20, piety: 7, trust: 6 }, 'epc_lazaretto_peace')
  ]);
 add('epc_lazaretto_peace', 'Crisis & Plague', 'Quiet Mercy at the City Edge',
  'Fear subsides into orderly charity; travelers remark that few realms treat misfortune with such steady hands.',
  'followup', [
   C('Grant the hospice permanent toll exemptions on orchard timber', 50, { piety: 9, legitimacy: 6, trust: 6 }),
   C('Leave the foundation to steady parish alms', 0, { stability: 4, piety: 4 })
  ]);

 // 50. Flooded Salt-Marshes & Prosperity Drain (3 stages)
 add('epc_salt_dykes', 'Crisis & Plague', 'Breached Sea-Walls Under Full Moon',
  'A howling equinox surge tears three gaps through coastal turf dykes, drowning pasture sheep and turning sweet wells brackish across two hundreds.',
  'flood', [
   C('Hire Dutch dyke-masters and dispatch timber faggots before next spring tide', 155, { crisis: -22, development: 1, trust: 11 }, 'epc_dykes_pumps'),
   C('Rally local levies with shovels and baskets under crown rations', 55, { crisis: -14, food: -25, trust: 6 }, 'epc_dykes_pumps'),
   C('Abandon outer salt flats and resettle villagers upland', 0, { unrest: 7, crisis: -6, food: -20 })
  ]);
 add('epc_dykes_pumps', 'Crisis & Plague', 'Windmills Lifting Brackish Surge',
  'Working waist-deep in freezing brine, laborers drive oak stakes while engineers sketch geared scoop-wheels to drain drowned meadows.',
  'followup', [
   C('Construct timber drainage windmills along the rescued polders', 110, { development: 1, research: 8, food: 60 }, 'epc_dykes_reclaimed'),
   C('Pack turf-clay firmly and restore standard sluice gates', 0, { crisis: -12, trust: 7 }, 'epc_dykes_reclaimed')
  ]);
 add('epc_dykes_reclaimed', 'Crisis & Plague', 'Clover Returning to Black Silt',
  'Rich marine silt yields heavier clover crops than before the flood, repaying daring masonry with fat cattle.',
  'followup', [
   C('Charter a permanent Marshland Dyke-Reeve Board to inspect walls monthly', 70, { credit: 7, trust: 8, stability: 5 }),
   C('Celebrate rescued pastures with lowered coastal wool tolls', 0, { credit: 5, legitimacy: 4 })
  ]);

 // 51. Crowded Graveyard & Ossuary Charnel House (3 stages)
 add('epc_ossuary_yard', 'Crisis & Plague', 'Sunken Earth Behind Saint Jude',
  'After two grim winters of fever, the old parish churchyard swells higher than surrounding lanes; rain washes bones into market gutters unless new ground opens.',
  'epidemic', [
   C('Purchase orchard land outside the walls and raise a dignified stone ossuary', 120, { crisis: -15, piety: 10, trust: 10 }, 'epc_ossuary_wall'),
   C('Stack skulls neatly beneath abbey arches and lime-pack trenches', 45, { crisis: -10, piety: 6, stability: 4 }, 'epc_ossuary_wall'),
   C('Leave burial plots to parish wardens with modest timber fences', 0, { trust: -5, unrest: 5, crisis: -3 })
  ]);
 add('epc_ossuary_wall', 'Crisis & Plague', 'Carved Hourglasses in Limestone',
  'Skilled carvers ask whether to adorn the new bone-chapel arches with grim Dance of Death frescoes or quiet resurrection lilies.',
  'followup', [
   C('Paint the sober Dance of Death reminding princes and beggars alike of mortality', 55, { piety: 9, prestige: 6, legitimacy: 5 }, 'epc_ossuary_peace'),
   C('Plant cypress trees and clean stone benches for grieving families', 0, { trust: 9, piety: 7 }, 'epc_ossuary_peace')
  ]);
 add('epc_ossuary_peace', 'Crisis & Plague', 'Clean Lanes After Rain',
  'Freshly paved drainage channels keep market wells sweet, proving reverence for the dead shields the living.',
  'followup', [
   C('Endow salaried grave-wardens and clean municipal drainage', 60, { development: 1, crisis: -8, trust: 6 }),
   C('Bless the ground and close the ledger', 0, { piety: 6, stability: 4 })
  ]);

 // 52. Plague Profiteers — The Vinegar & Garlic Syndicate (3 stages)
 add('epc_plague_profiteers', 'Economy & Trade', 'Four Silver Groats for a Clove of Garlic',
  'Fearful townsfolk crowd apothecary stalls where crooked wholesalers corner camphor, rosemary, and clean shrouds at tenfold prices.',
  'epidemic', [
   C('Break open hoarded warehouses, seize stock, and enforce fixed apothecary prices', 55, { crisis: -14, trust: 11, unrest: -9 }, 'epc_profiteers_trial'),
   C('Flood the market with cheap crown-imported herbs to undercut speculators', 110, { crisis: -15, credit: 6, trust: 9 }, 'epc_profiteers_trial'),
   C('Tax the windfall profits heavily without seizing private ledgers', 0, { gold: 120, unrest: 6, trust: -6 })
  ]);
 add('epc_profiteers_trial', 'Economy & Trade', 'Scales Smashed on the Market Cross',
  'Two arrested factors plead they merely insured perilous winter wagon runs, warning merchants will stop bringing spices altogether if prices are capped.',
  'followup', [
   C('Guarantee honest convoy protection while keeping strict anti-hoarding fines', 60, { credit: 7, trust: 8, stability: 5 }, 'epc_profiteers_end'),
   C('Pillory the boldest hoarder beside a sign reading "Flesh-Merchant"', 0, { unrest: -7, legitimacy: 6, credit: -3 }, 'epc_profiteers_end')
  ]);
 add('epc_profiteers_end', 'Economy & Trade', 'Honest Measures at Dusk',
  'Carters unload herbs under clear iron yardsticks once more, keeping panic from emptying alleys faster than fever.',
  'followup', [
   C('Publish an official Guild Pharmacopoeia with fair ceiling rates', 55, { research: 7, trust: 8 }),
   C('Close the market court and distribute surplus vinegar to wards', 0, { crisis: -8, piety: 5 })
  ]);

 // 53. Great Mortality Aftermath — Laborers Demand Double Wages (3 stages)
 add('epc_postplague_wages', 'Politics', 'Empty Cotts and Bold Plowmen',
  'With half the valley’s ditchers buried beneath fresh turf, surviving fieldhands refuse ancient pennies and walk straight to rival manors offering silver daily wages.',
  'unrest', [
   C('Freeze archaic labor-dues gently and commute serfdom into fair money rents', 100, { trust: 12, development: 1, unrest: -10 }, 'epc_wages_statute'),
   C('Proclaim a stern Ordinance of Laborers capping wages at pre-plague rates', 30, { gold: 70, unrest: 9, stability: -2, legitimacy: 4 }, 'epc_wages_statute'),
   C('Let landlords and cottagers bargain freely across county markets', 0, { credit: 7, unrest: -4, stability: 3 })
  ]);
 add('epc_wages_statute', 'Politics', 'Sickles Idle Against Barn Doors',
  'Great lords fume in council over silk-ribboned yeomen wearing fine broadcloth, yet wheat stands tall waiting for hands to cut it before storms break.',
  'followup', [
   C('Encourage horse-drawn plows and water-mills to multiply scarce hands', 115, { tools: 22, development: 1, food: 65 }, 'epc_wages_horizon'),
   C('Enforce harvest-week service strictly while sweetening ale rations', 0, { food: 45, stability: 4 }, 'epc_wages_horizon')
  ]);
 add('epc_wages_horizon', 'Politics', 'New Iron on Fewer Shoulders',
  'Fewer backs bend across the furrows, yet stronger tools and free rent contracts begin reshaping the countryside.',
  'followup', [
   C('Charter rural blacksmiths and wainwrights to supply labor-saving gear', 80, { tools: 20, credit: 6, trust: 6 }),
   C('Confirm the autumn harvest rolls cleanly', 0, { stability: 5, food: 30 })
  ]);

 // 54. The Physician’s Strange Cure — Frogs, Gold, or Clean Water (3 stages)
 add('epc_strange_cure', 'Crisis & Plague', 'Filings of Ducat Gold in Rosewater',
  'A silver-tongued physician convinces your stressed consort that drinking dissolved gold leaf cures melancholy—while emptying palace coffers ounce by ounce.',
  'stress', [
   C('Pay for sane restorative rest, mountain air, and music instead of swallowed coin', 85, { stress: -18, prestige: 4 }, 'epc_strange_garden'),
   C('Humor one modest gilded cordial while quietly testing his apothecary notes', 120, { stress: -12, research: 5 }, 'epc_strange_garden'),
   C('Bar the charlatan from the privy stairs cleanly', 0, { gold: 45, stress: 4, stability: 4 })
  ]);
 add('epc_strange_garden', 'Crisis & Plague', 'Lute Strings Under Fig Leaves',
  'Walking beside sunny espalier pears, pulse slows and insomnia lifts far better than heavy mineral drafts ever managed.',
  'followup', [
   C('Endow a permanent walled physic garden beside the palace chapel', 90, { stress: -14, research: 6, piety: 4 }, 'epc_strange_calm'),
   C('Keep quiet afternoon walks part of daily court discipline', 0, { stress: -10, stability: 4 }, 'epc_strange_calm')
  ]);
 add('epc_strange_calm', 'Crisis & Plague', 'A Clearer Mind at Dawn',
  'Restored sleep sharpens judgment at the council table—gold stays in the mint where it belongs.',
  'followup', [
   C('Bind the garden’s herbal recipes into a household regimen', 45, { research: 7, stress: -8 }),
   C('Return briskly to morning petitions', 0, { legitimacy: 5, stress: -4 })
  ]);

 // 55. Prosperity Boom — The Silversmiths’ Boom-Town (3 stages)
 add('epc_silver_boom', 'Economy & Trade', 'Lanterns Smoking Over New Adits',
  'Prospectors strike a rich vein of silver-lead ore in royal hills; overnight three thousand miners pitch plank shanties beside pine creeks.',
  'land', [
   C('Charter a clean mining town with timbered galleries, mint, and watchmen', 155, { development: 1, credit: 10, tools: 15 }, 'epc_silver_assay'),
   C('Lease digging rights directly to merchant syndicates for a flat tenth', 45, { gold: 135, credit: 6, unrest: 3 }, 'epc_silver_assay'),
   C('Restrict digging strictly to crown serfs to guard ore secrets', 0, { gold: 80, securityMonths: 6, unrest: 5 })
  ]);
 add('epc_silver_assay', 'Economy & Trade', 'Brawl Outside the Smelting Stamp',
  'Drunken claim-jumpers clash over creek water rights while slag-smoke blackens trout streams feeding downstream mills.',
  'followup', [
   C('Appoint a Mining Judge and brick settling-ponds to protect downstream farms', 95, { trust: 11, legitimacy: 7, development: 1 }, 'epc_silver_coin'),
   C('Station armed pikes at the smelting house and fine brawlers in silver dust', 0, { gold: 90, securityMonths: 7, trust: -3 }, 'epc_silver_coin')
  ]);
 add('epc_silver_coin', 'Economy & Trade', 'Broad Crowns Gleaming From the Dies',
  'Crisp new silver coins bearing your profile circulate from river ferry to foreign bourse, easing tight credit across the realm.',
  'followup', [
   C('Maintain strict pure-silver standards on every minted crown', 60, { credit: 11, inflation: -3, legitimacy: 7 }),
   C('Pour freshly minted coin straight into road repairs', 0, { development: 1, prestige: 6 })
  ]);

 // 56. Wildfire in the Shingled Suburb (3 stages)
 add('epc_shingle_fire', 'Crisis & Plague', 'Sparks Jumping From the Cooper’s Yard',
  'Dry August gusts whip embers off a pitch-kettle onto crowded cedar shingles; orange smoke roars toward the grain-wharf while citizens haul leather buckets.',
  'fire', [
   C('Pull down two timber lanes cleanly with iron hooks and compensate owners', 135, { crisis: -20, trust: 10, stability: 5 }, 'epc_fire_buckets'),
   C('Pay double silver to water-carters and breach garden walls to douse roofs', 85, { crisis: -16, credit: 4, trust: 8 }, 'epc_fire_buckets'),
   C('Hold the inner citadel gates closed and save royal granaries first', 0, { food: 35, crisis: -6, trust: -8, unrest: 6 })
  ]);
 add('epc_fire_buckets', 'Crisis & Plague', 'Smoldering Beams at Daybreak',
  'Sunrise reveals blackened brick chimneys standing amidst grey ash; homeless weavers huddle under bridge arches asking who will rebuild.',
  'followup', [
   C('Supply red clay roof-tiles and interest-free beams to mandate fireproof roofs', 120, { development: 1, trust: 12, crisis: -14 }, 'epc_fire_ordinance'),
   C('Open emergency bread kitchens and forgive burned hearth taxes', 0, { food: -25, trust: 9, unrest: -9 }, 'epc_fire_ordinance')
  ]);
 add('epc_fire_ordinance', 'Crisis & Plague', 'Brick Gables and Iron Hooks',
  'Out of bitter charcoal rises a safer street of tiled eaves, night-watch ladders, and stone party-walls.',
  'followup', [
   C('Charter a permanent neighborhood fire-watch guild with leather cisterns', 70, { stability: 7, development: 1, securityMonths: 6 }),
   C('Record the new building code cleanly in town rolls', 0, { legitimacy: 6, trust: 5 })
  ]);

 // 57. Drought & Cracked Cisterns — The Rain-Making Procession (3 stages)
 add('epc_drought_wells', 'Crisis & Plague', 'Dust Blowing Off Dry Furrows',
  'Ten weeks without cloud turn river flats into cracked clay plates; herdsmen fight with staves over muddy spring-holes while millwheels hang motionless.',
  'drought', [
   C('Dig deep community wells, subsidize barley imports, and ban grain export', 150, { food: 95, crisis: -18, trust: 11 }, 'epc_drought_millers'),
   C('Lead solemn penitential prayers for rain while rationing palace stables', 55, { piety: 9, crisis: -10, food: 35 }, 'epc_drought_millers'),
   C('Protect royal fishponds and forest streams with mounted wardens', 0, { securityMonths: 6, unrest: 7, trust: -6 })
  ]);
 add('epc_drought_millers', 'Crisis & Plague', 'Wind-Sails Turning Over Dry Creeks',
  'With waterwheels dead on gravel bars, bakers cannot grind even stored wheat without paying extortionate rates to hilltop windmills.',
  'followup', [
   C('Build temporary horse-driven quern mills inside the royal courtyard for all', 90, { food: 60, trust: 10, tools: 12 }, 'epc_drought_rain'),
   C('Cap grinding fees sternly and quarter grain wagons at parish churches', 0, { unrest: -7, legitimacy: 6 }, 'epc_drought_rain')
  ]);
 add('epc_drought_rain', 'Crisis & Plague', 'Thunderheads Over the Ridge',
  'When slate-blue clouds finally burst over parched tiles, gutters roar and farmers kneel laughing in warm mud.',
  'followup', [
   C('Line village ponds with clay and stone cisterns before next summer', 85, { development: 1, crisis: -12, food: 45 }),
   C('Distribute remaining emergency flour and give thanks', 0, { piety: 7, trust: 5 })
  ]);

 // 58. The Great Hunt of the Plague Year — Boccaccio’s Villa (3 stages)
 add('epc_villa_retreat', 'Lifestyle', 'Cypress Shades Above Sick Valleys',
  'While fever grips river towns, a circle of witty courtiers invites you to join ten days of storytelling, lute-songs, and crisp wine in a walled hillside villa.',
  'highStress', [
   C('Slip away for five restorative days while leaving trusted stewards in charge', 80, { stress: -22, prestige: 4, legitimacy: -2 }, 'epc_villa_tales'),
   C('Decline the retreat and hold modest poetry evenings in your own garden', 35, { stress: -14, legitimacy: 5 }, 'epc_villa_tales'),
   C('Rebuke idle escapism and sleep beside the council braziers', 0, { legitimacy: 7, stress: 6, piety: 4 })
  ]);
 add('epc_villa_tales', 'Lifestyle', 'Ten Tales Beneath Cedar Pergolas',
  'Each dusk guests spin sharp stories of foolish abbots, clever wives, and fickle fortune—laughter briefly loosening the iron band around your chest.',
  'followup', [
   C('Have court clerks bind the finest tales into a polished vernacular book', 65, { prestige: 9, research: 7, stress: -8 }, 'epc_villa_return'),
   C('Keep the gathering intimate and burn the sharper political satires', 0, { stress: -12, securityMonths: 5 }, 'epc_villa_return')
  ]);
 add('epc_villa_return', 'Lifestyle', 'Cool Morning Air Along the Return Road',
  'Clearer-eyed and calmer, you step back onto the cobblestones ready to face tallies and petitions anew.',
  'followup', [
   C('Send baskets of hillside fruit and wine to city hospital nurses', 50, { piety: 8, legitimacy: 6, stress: -5 }),
   C('Open the morning council promptly at dawn', 0, { stability: 5, stress: -3 })
  ]);

 // 59. The One-Eyed Veteran’s Prosthetic Hook (3 stages)
 add('epc_veteran_ironhand', 'Military', 'A Silver-Jointed Iron Gauntlet',
  'After losing his sword-hand at the breach, your bravest field captain broods by cold hearths—until an ingenious clockmaker sketches an articulated iron-and-leather hand.',
  'army', [
   C('Pay the clockmaker to forge a hinged iron gauntlet with spring-catches', 110, { morale: 10, prestige: 8, experience: 0.06 }, 'epc_ironhand_drill'),
   C('Award the veteran an honored desk as Castellan of the Capital Keep', 55, { morale: 6, legitimacy: 6, supply: 8 }, 'epc_ironhand_drill'),
   C('Pension him gently with an orchard cottage and clean silver', 0, { morale: 4, stability: 4 })
  ]);
 add('epc_ironhand_drill', 'Military', 'Sparks in the Tilt-Yard',
  'Clanking into the yard with leather straps buckled tight, the captain locks his iron fingers onto a shield-boss and batters two younger lieutenants across the turf.',
  'followup', [
   C('Name him Master of Siege Drills and raise a fund for maimed soldiers', 90, { morale: 12, experience: 0.08, prestige: 7 }, 'epc_ironhand_legend'),
   C('Toast his iron grit before the assembled camp banners', 0, { morale: 7, prestige: 6 }, 'epc_ironhand_legend')
  ]);
 add('epc_ironhand_legend', 'Military', 'Fearless Steel',
  'Recruits swear no wound can unseat a captain blessed by the crown; camp morale stiffens along every watchtower.',
  'followup', [
   C('Endow prosthetic workshops at the royal armory for wounded veterans', 75, { morale: 10, research: 5, supply: 8 }),
   C('Record his deeds in the regimental roll', 0, { prestige: 7, experience: 0.04 })
  ]);

 // 60. Quarantine Ships at the Harbor Chain (3 stages)
 add('epc_quarantine_chain', 'Economy & Trade', 'Yellow Pennants Off the Breakwater',
  'Three spice carracks arrive off the harbor chain flying fever flags; captains swear only two sailors died of sea-scurvy, while panicked aldermen demand the ships be towed to sea.',
  'trade', [
   C('Hold ships forty days at the outer island lazaretto with fresh water barges', 120, { trust: 11, credit: 6, stability: 5 }, 'epc_quarantine_cargo'),
   C('Unpack spices onto sunlit stone quays under sulfur smoke after ten days', 65, { credit: 9, gold: 50, trust: -4 }, 'epc_quarantine_cargo'),
   C('Bar the harbor chain completely until winter frosts clear the coast', 0, { stability: 6, credit: -7, unrest: -4 })
  ]);
 add('epc_quarantine_cargo', 'Economy & Trade', 'Smoldering Juniper Along the Mole',
  'For four tense weeks watch-boats row supplies to the anchored hulls while merchants nervously calculate daily interest charges.',
  'followup', [
   C('Rebate half of harbor anchorage dues for law-abiding captains', 55, { credit: 9, trust: 7, stability: 4 }, 'epc_quarantine_clear'),
   C('Inspect every silk bale by harbor surgeons before breaking seals', 0, { research: 5, securityMonths: 6, trust: 5 }, 'epc_quarantine_clear')
  ]);
 add('epc_quarantine_clear', 'Economy & Trade', 'Clean Bills of Health Sealed in Lead',
  'When healthy crews finally step ashore to cheered quays, the city earns a reputation across sea-lanes as both safe and fair to trade.',
  'followup', [
   C('Build permanent stone quarantine warehouses on the outer reef', 95, { development: 1, credit: 10, trust: 8 }),
   C('Collect normal spice customs cleanly', 0, { gold: 95, credit: 4 })
  ]);

 // 61. The Court Jester’s Bitter Truths (3 stages)
 add('epc_jester_barbs', 'Court', 'Bells Jingling Inside the Privy Chamber',
  'Under cover of motley wool and a wooden bauble, your clever court fool sings a ballad exposing real tax-bribes pocketed by senior lords—drawing icy stares around the table.',
  'courtRival', [
   C('Laugh heartily, toss the fool a gold florin, and demand ledgers at dawn', 50, { legitimacy: 8, opinion: -14, stress: -6 }, 'epc_jester_audit'),
   C('Pat the fool’s cheek and steer talk to harmless hunting dogs', 0, { stability: 5, opinion: 6, stress: 3 }, 'epc_jester_audit'),
   C('Strip the bells from his cap for insolence before noble peers', 0, { opinion: 10, prestige: -4, stress: 5 })
  ]);
 add('epc_jester_audit', 'Court', 'Whispering Behind Painted Screens',
  'Next morning a masked servant slips three crumpled customs receipts under your door—confirming the jester’s song hit closer than jest.',
  'followup', [
   C('Quietly replace crooked collectors and credit the crown purse', 60, { gold: 110, legitimacy: 8, stability: 4 }, 'epc_jester_evening'),
   C('Use the receipts privately to silence your rival’s loud factions', 0, { securityMonths: 9, opinion: -10, prestige: 5 }, 'epc_jester_evening')
  ]);
 add('epc_jester_evening', 'Court', 'Quiet Music After Supper',
  'The motley cap sits calmly beside the hearth; wise sovereigns keep sharper ears behind fools’ bells than behind armored doors.',
  'followup', [
   C('Grant the fool a modest lifetime cottage while keeping him sharp at court', 45, { stress: -10, legitimacy: 5 }),
   C('Let the chamber settle into cautious calm', 0, { stability: 5, stress: -4 })
  ]);

 // 62. The Poisoned Well of the Besieged Suburb (3 stages)
 add('epc_siege_well', 'Military', 'Dead Dogs Floating in the Town Cistern',
  'Scouts discover retreating enemy riders dumped carrion down the main limestone cistern outside your forward camp, threatening camp dysentery before battle.',
  'army_supply', [
   C('Dig deep fresh tube-wells and boil every kettle with vinegar and pine', 110, { supply: 20, morale: 9, fatigue: -8 }, 'epc_well_camp'),
   C('Divert baggage mules to haul clean spring casks three leagues from ridge', 55, { supply: 14, fatigue: 5, morale: 4 }, 'epc_well_camp'),
   C('Press straight on toward river bridges before thirst slows the column', 0, { fatigue: 10, morale: -5, supply: 4 }, 'epc_well_camp')
  ]);
 add('epc_well_camp', 'Military', 'Boiling Copper Kettles at Dusk',
  'Veteran quartermasters complain boiling water wastes firewood, yet within five days flux vanishes from the sick-tents while scouts report enemy camps retching.',
  'followup', [
   C('Make boiled water and clean latrine trenches permanent camp standing orders', 65, { experience: 0.08, supply: 16, morale: 9 }, 'epc_well_victory'),
   C('Break camp cleanly once casks are filled', 0, { fatigue: -6, morale: 5 }, 'epc_well_victory')
  ]);
 add('epc_well_victory', 'Military', 'Clear-Eyed Columns at Dawn',
  'Healthy troops outmarch twice their number of fever-weakened foes—proving clean kettles win campaigns.',
  'followup', [
   C('Reward camp surgeons and quartermasters with doubled shares', 55, { morale: 9, supply: 12 }),
   C('Record the sanitary ordinance in marshal rollbooks', 0, { research: 5, stability: 4 })
  ]);

 // 63. The Hermetic Mirror — Glassmakers of the Lagoon (3 stages)
 add('epc_crystal_mirror', 'Economy & Trade', 'Mercury and Tin-Foil Behind Crystal',
  'Runaway master glassblowers offer to establish secret crystal-mirror kilns inside your capital—promising dazzling palace galleries and rich export monopolies.',
  'trade', [
   C('Grant secret walled kilns, import soda-ash, and guard their guild rolls', 150, { development: 1, credit: 10, prestige: 9 }, 'epc_mirror_smoke'),
   C('Allow open glass-workshops without secret guild locks', 70, { tools: 18, credit: 6, trust: 6 }, 'epc_mirror_smoke'),
   C('Decline foreign runaways lest maritime republics retaliate on spice ships', 0, { stability: 5, credit: -2 })
  ]);
 add('epc_mirror_smoke', 'Economy & Trade', 'Masked Envoys Outside the Kiln Gate',
  'Foreign agents sniff around tavern doors offering silver pouches to lure the glassmasters back; one apprentice vanishes before dawn.',
  'followup', [
   C('Post royal watchmen at the kilns and grant the masters native estates', 85, { securityMonths: 10, trust: 8, credit: 7 }, 'epc_mirror_hall'),
   C('Accelerate native apprentice training so secret mixtures cannot be stolen', 0, { research: 8, tools: 15 }, 'epc_mirror_hall')
  ]);
 add('epc_mirror_hall', 'Economy & Trade', 'A Hall of Ten Thousand Candles',
  'Reflected candlelight doubles across silvered Venetian plate along your throne gallery, astonishing visiting envoys—while export wagons roll north.',
  'followup', [
   C('Commission astronomical lenses from the same crystal furnaces', 80, { research: 11, prestige: 8 }),
   C('Tax luxury mirror exports cleanly at the gate', 0, { gold: 110, credit: 5 })
  ]);

 // 64. The Canonization of a Humble Village Midwife (3 stages)
 add('epc_midwife_shrine', 'Religion', 'Wildflowers Over an Unmarked Grave',
  'Country women flock to a crooked hawthorn beside a village well where an old herbalist-midwife lies buried—swearing her prayers save mothers in labor.',
  'lowtrust', [
   C('Endow a clean parish lying-in house in her honor rather than fight devotion', 100, { trust: 12, piety: 9, development: 1 }, 'epc_midwife_clergy'),
   C('Send gentle friars to bless the well and record genuine testimonies', 45, { piety: 8, trust: 7, faithAuthority: 5 }, 'epc_midwife_clergy'),
   C('Forbid unsanctioned shrines and fence off the hawthorn tree', 0, { faithAuthority: 6, unrest: 7, trust: -8 })
  ]);
 add('epc_midwife_clergy', 'Religion', 'Cathedral Doctors Frown at Country Customs',
  'Stiff city theologians object to honoring an unlettered peasant woman alongside martyred bishops, threatening to tear down her wooden cross.',
  'followup', [
   C('Teach practical midwifery cleanly inside the new hospice under church blessing', 75, { research: 7, trust: 10, piety: 7 }, 'epc_midwife_legacy'),
   C('Keep devotion modest as a local mercy-chapel without loud titles', 0, { stability: 6, acceptance: 6 }, 'epc_midwife_legacy')
  ]);
 add('epc_midwife_legacy', 'Religion', 'Cradles Rocking Beside the Well',
  'Fewer infants perish through winter frost; villagers bless the crown whenever royal banners cross the bridge.',
  'followup', [
   C('Spread trained midwives to neighboring market towns', 85, { trust: 11, development: 1, piety: 6 }),
   C('Leave the quiet hillside chapel to parish care', 0, { piety: 6, stability: 4 })
  ]);

 // 65. Crown Jewel Pawned to Florentine Factors (3 stages)
 add('epc_pawned_crown', 'Economy & Trade', 'Empty Velvet in the Treasury Vault',
  'To pay urgent mercenary arrears before winter freeze, treasurers propose secretly pawning the great emerald coronal to Italian factors behind iron doors.',
  'debt', [
   C('Pawn the gem discreetly on short six-month terms to keep troops steady', 0, { gold: 175, credit: -4, securityMonths: 6 }, 'epc_pawned_rumor'),
   C('Issue transparent crown annuity bonds to domestic burghers instead', 45, { credit: 8, legitimacy: 5, gold: 90 }, 'epc_pawned_rumor'),
   C('Cut court banquet costs to the bone and spare the regalia', 0, { stability: 4, inflation: -2, prestige: -3 })
  ]);
 add('epc_pawned_rumor', 'Economy & Trade', 'Whispers at the Antwerp Exchange',
  'A drunken broker boasts in a tavern that your dynasty’s crown sits inside a wooden strongbox on the Arno—rattling bond confidence before spring taxes.',
  'followup', [
   C('Redeem the jewel promptly with fanfare and display it at Easter mass', 160, { legitimacy: 11, credit: 10, prestige: 9 }, 'epc_pawned_end'),
   C('Expose the loose-tongued factor and switch crown accounts to rivals', 0, { credit: 6, securityMonths: 8 }, 'epc_pawned_end')
  ]);
 add('epc_pawned_end', 'Economy & Trade', 'Ledgers Balanced Under Lock',
  'Whether redeemed in bright sunlight or replaced by steady domestic credit, the realm learns how swiftly silver speaks louder than velvet.',
  'followup', [
   C('Establish a permanent Sinking Fund to retire high-interest crown notes', 75, { credit: 10, inflation: -3 }),
   C('Lock the regalia chest under three council keys', 0, { legitimacy: 6, securityMonths: 7 })
  ]);

 // 66. The Hermit of the Plague Cave (3 stages)
 add('epc_plague_hermit', 'Crisis & Plague', 'A Wild Voice From the Limestone Gorge',
  'During the height of summer sickness, a ragged anchorite living on locusts and cave-water draws crowds by promising a clean herb-smoke wards off black swellings.',
  'epidemic', [
   C('Bring his wild mint and juniper smoke trials to city surgeons for testing', 75, { research: 8, crisis: -14, trust: 7 }, 'epc_hermit_smoke'),
   C('Bring him bread and clean woolen coats while gently dispersing crowds', 45, { piety: 8, crisis: -10, unrest: -5 }, 'epc_hermit_smoke'),
   C('Leave the old eccentric in his gorge', 0, { stability: 3, crisis: -2 })
  ]);
 add('epc_hermit_smoke', 'Crisis & Plague', 'Flea-Bites and Clean Swept Floors',
  'Physicians notice houses burned with his bitter bog-myrtle smoke and freshly whitewashed thresholds lose fewer souls—mostly because rats and fleas flee the stink.',
  'followup', [
   C('Issue town-wide whitewash lime and bog-myrtle bundles to every tenement', 100, { crisis: -20, trust: 11, development: 1 }, 'epc_hermit_peace'),
   C('Publish practical cleaning rules cleanly without mystic fables', 0, { research: 7, crisis: -12 }, 'epc_hermit_peace')
  ]);
 add('epc_hermit_peace', 'Crisis & Plague', 'Fresh Lime on Old Thresholds',
  'Whitewashed alleys catch morning sun cleanly; even skeptical physicians nod respectfully when passing the gorge.',
  'followup', [
   C('Endow an annual street-cleaning and rat-catching fund', 65, { crisis: -10, development: 1, trust: 7 }),
   C('Send a warm sheepskin cloak up the cliffs in winter', 0, { piety: 8, stability: 4 })
  ]);

 // 67. The Bloodline of Iron — Breaking a Rebel Fortress (3 stages)
 add('epc_iron_breach', 'Politics', 'Shattered Ashlar Above the Gorge',
  'After starved rebels lower their hawk-banner on a defiant hill-keep, commanders ask whether to sow its courtyard with salt or spare its masonry for frontier watch.',
  'disloyal', [
   C('Topple the rebel keep’s outer curtain and pardon common garrison soldiers', 60, { legitimacy: 9, loyalty: 10, unrest: -8 }, 'epc_breach_hall'),
   C('Spare the sturdy walls cleanly and convert it into a royal customs tower', 95, { development: 1, credit: 6, loyalty: 6 }, 'epc_breach_hall'),
   C('Hang ringleaders from the gatehouse and raze the hall to grass', 0, { prestige: 7, unrest: 6, loyalty: -8 })
  ]);
 add('epc_breach_hall', 'Politics', 'Dust Settling on Broken Shields',
  'Inside the stripped solar, clerks find chests of unpaid hearth-rents and frightened noble children clinging to tapestries.',
  'followup', [
   C('Educate the captive heirs honorably at court to bind the next generation', 70, { loyalty: 12, legitimacy: 7, trust: 6 }, 'epc_breach_peace'),
   C('Split the forfeited estate cleanly among loyal border knights', 0, { loyalty: 9, gold: 80, stability: 4 }, 'epc_breach_peace')
  ]);
 add('epc_breach_peace', 'Politics', 'Ploughs Turning Around Cold Ashlar',
  'Quiet shepherds graze sheep beneath scarred battlements, reminding passing barons that crown patience runs deep—until broken.',
  'followup', [
   C('Hold an open county assize forgiving minor coerced tenants', 45, { trust: 10, unrest: -9 }),
   C('Station a lean garrison and move on', 0, { securityMonths: 7, legitimacy: 5 })
  ]);

 // 68. Warrior Lodge Blood-Oath Before Siege (3 stages)
 add('epc_siege_oath', 'Military', 'Red Cord Bound Around Sword Hilts',
  'Facing formidable double walls before dawn, sixty storm-volunteers bind crimson wool cords around their wrists and demand you drink from the shared iron horn.',
  'war', [
   C('Drink deep beside them and pledge noble patents to first wall-climbers', 90, { morale: 14, prestige: 9, experience: 0.07 }, 'epc_siege_ladder'),
   C('Bless their courage solemnly while keeping reserve pikes strictly ordered', 40, { morale: 8, supply: 10, legitimacy: 5 }, 'epc_siege_ladder'),
   C('Order cautious sapper trenches instead of bloody escalade', 0, { fatigue: -6, morale: -2, supply: 8 })
  ]);
 add('epc_siege_ladder', 'Military', 'Grappling Irons Biting Wet Parapets',
  'Through boiling pitch and arrow-hail the crimson-cord company claws onto the corner bartizan, screaming your house war-cry above billowing smoke.',
  'followup', [
   C('Commit heavy vanguard banners immediately to widen the lodgment', 80, { morale: 12, prestige: 10, fatigue: 7 }, 'epc_siege_breach_end'),
   C('Throw timber shields and crossbowmen upward to hold the tower cleanly', 0, { morale: 8, experience: 0.06 }, 'epc_siege_breach_end')
  ]);
 add('epc_siege_breach_end', 'Military', 'Banners Floating Over the Gatehouse',
  'By vespers the battered horn blows over captured battlements; survivors unwind blood-soaked crimson cords to hang beside chapel candles.',
  'followup', [
   C('Honor every vow with gold spurs, land grants, and widows’ pensions', 110, { legitimacy: 10, morale: 11, prestige: 9 }),
   C('Grant modest campaign bonuses and set strict discipline inside town', 0, { stability: 6, gold: 65 })
  ]);

 // 69. Monastic Bee-Keeping & Wax Monopoly (3 stages)
 add('epc_wax_monopoly', 'Economy & Trade', 'Thousand Hives Along Heather Moors',
  'Cathedrals burn tons of pure beeswax while tallow candles choke poor huts; an enterprising abbot proposes standardizing heather-moor apiaries across crown wastes.',
  'institution', [
   C('Finance wicker skeps, winter shelters, and honest wax-scales', 115, { development: 1, piety: 8, credit: 8 }, 'epc_wax_market'),
   C('Lease moorland hives to freeholders for modest wax-rents', 45, { food: 45, trust: 7, credit: 5 }, 'epc_wax_market'),
   C('Leave heather wastes untouched for wild sheep', 0, { food: 25, stability: 3 })
  ]);
 add('epc_wax_market', 'Economy & Trade', 'Golden Cakes at the Chandler Guild',
  'Bright beeswax cakes flood city stalls, slashing abbey candle costs while honey casks sweeten winter porridge and mead vats.',
  'followup', [
   C('Export surplus clarified beeswax to distant cathedral towns', 65, { credit: 9, gold: 70 }, 'epc_wax_close'),
   C('Reserve surplus honey cleanly for winter garrison rations', 0, { food: 65, trust: 6 }, 'epc_wax_close')
  ]);
 add('epc_wax_close', 'Economy & Trade', 'Brighter Altars at Half the Coin',
  'Warm golden light fills parish chancels without draining village pockets—sweet profit from buzzing heather.',
  'followup', [
   C('Exempt small cottager hives from royal forest fees', 35, { trust: 9, piety: 6 }),
   C('Enter the new wax-rents neatly into the exchequer', 0, { credit: 6, stability: 4 })
  ]);

 // 70. The Astrologer’s Horoscope of the Heir (3 stages)
 add('epc_heir_horoscope', 'Family', 'Mars Rising in the Seventh House',
  'Casting your young heir’s nativity by brass astrolabe, a pale Hermetic master shuts his leather case hastily—whispering of a dangerous eclipse in the child’s twentieth year.',
  'child', [
   C('Dismiss fatalistic stars cleanly and double the child’s practical tutors', 85, { education: 14, research: 5, stress: -5 }, 'epc_horoscope_lessons'),
   C('Keep the chart secret and quietly train the child in caution and fencing', 55, { education: 10, securityMonths: 7, stress: 4 }, 'epc_horoscope_lessons'),
   C('Burn the dubious parchment quietly and forbid horoscopes inside the nursery', 0, { piety: 6, stability: 4 })
  ]);
 add('epc_horoscope_lessons', 'Family', 'Wooden Swords and Latin Verbs',
  'Too clever by half, the youngster catches whispers from gossiping maids and asks you squarely whether stars decide a prince’s courage.',
  'followup', [
   C('Tell the child plainly that stars incline, yet character commands destiny', 25, { education: 12, legitimacy: 5, stress: -4 }, 'epc_horoscope_close'),
   C('Turn the fear into keen curiosity about genuine astronomy', 0, { education: 10, research: 8 }, 'epc_horoscope_close')
  ]);
 add('epc_horoscope_close', 'Family', 'Clear Eyes Under Morning Frost',
  'Years later only dusty brass rings remember the dark omen; the young dynast steps forward unafraid.',
  'followup', [
   C('Present a silver compass at coming-of-age', 50, { education: 10, prestige: 6 }),
   C('Let steady habit speak for itself', 0, { stability: 5, stress: -4 })
  ]);

 // 71. Bloodline of the Lawgiver — Codifying Weight & Ell (3 stages)
 add('epc_weights_measures', 'Economy & Trade', 'Three Different Ell-Wands in One Shire',
  'Foreign cloth merchants threaten to boycott winter fairs because bailiffs measure wool by one yardstick when buying and a shorter stick when collecting customs.',
  'inflation', [
   C('Cast standard bronze yardsticks and iron weights chained to every market pillar', 130, { credit: 11, inflation: -3, trust: 10 }, 'epc_weights_revolt'),
   C('Allow town mayors to pick one regional standard while taxing discrepancies', 45, { credit: 6, trust: 5 }, 'epc_weights_revolt'),
   C('Keep traditional shire customs unchanged', 0, { stability: 4, credit: -4 })
  ]);
 add('epc_weights_revolt', 'Economy & Trade', 'Chiseling Off Cheating Scales',
  'Dishonest toll-farmers shriek ruin as royal inspectors smash weighted lead pans in public squares across three river counties.',
  'followup', [
   C('Compensate honest smallholders and print illustrated measure-tables', 70, { research: 7, trust: 9, inflation: -2 }, 'epc_weights_peace'),
   C('Auction clean municipal toll-leases under strict bronze audits', 0, { gold: 95, credit: 7 }, 'epc_weights_peace')
  ]);
 add('epc_weights_peace', 'Economy & Trade', 'One Measure Across the Kingdom',
  'Flemish barges return to the quay; honest iron weights become a quiet badge of royal sovereignty.',
  'followup', [
   C('Carve the royal bronze standards onto the palace gatehouse wall', 45, { legitimacy: 8, prestige: 7 }),
   C('Leave market wardens to monthly inspections', 0, { credit: 6, stability: 4 })
  ]);

 // 72. The Saintly Hermit’s Prophecy of the Crown (3 stages)
 add('epc_prophet_gate', 'Religion', 'Ash on the Forehead Before Matins',
  'An aged nun celebrated across five provinces walks barefoot through winter mud to warn your council of pride, unshriven blood, and coming tempests.',
  'faith_christian', [
   C('Hear her privately in the chapel and redress three harsh widows’ petitions', 75, { piety: 12, trust: 10, legitimacy: 6 }, 'epc_prophet_crowd'),
   C('Welcome her publicly at court to show pious humility before prelates', 40, { prestige: 6, piety: 9, faithAuthority: 6 }, 'epc_prophet_crowd'),
   C('Thank her gently at the gate with a warm loaf and coin', 0, { piety: 5, stability: 4 })
  ]);
 add('epc_prophet_crowd', 'Religion', 'Crowds Pressing Toward the Cloister Rail',
  'Word of her audience draws restless petitioners shouting grievances against corrupt tax-clerks beneath palace windows.',
  'followup', [
   C('Open an extraordinary royal petition box guarded by abbey elders', 60, { trust: 11, unrest: -8, legitimacy: 6 }, 'epc_prophet_calm'),
   C('Direct petitions strictly through regular shire courts', 0, { stability: 6, faithAuthority: 4 }, 'epc_prophet_calm')
  ]);
 add('epc_prophet_calm', 'Religion', 'Quiet Prayers Under Vaulted Stone',
  'When the frail sister slips back toward her hillside cell, citizens speak warmly of a sovereign willing to listen.',
  'followup', [
   C('Repair her leaking hillside abbey roof in cut slate', 75, { piety: 11, development: 1, trust: 6 }),
   C('Keep the opened petition chest running monthly', 0, { legitimacy: 7, stability: 5 })
  ]);

 // 73. The Reaper’s Due — Prosperity Boom’s Royal Gardens & Canals (3 stages)
 add('epc_royal_gardens', 'Economy & Trade', 'Mulberry Terraces and Stone Fishponds',
  'Flush with peaceful harvests, court architects propose draining stagnant palace ditches into terraced mulberry groves, silk-looms, and tiled carp ponds.',
  'land', [
   C('Fund terraced mulberry silk-works and clean gravity fountains', 160, { development: 1, credit: 9, prestige: 9 }, 'epc_gardens_silk'),
   C('Plant practical apple orchards and carp stews to feed palace tables', 80, { food: 75, trust: 6, stability: 4 }, 'epc_gardens_silk'),
   C('Keep meadows plain for grazing cavalry horses', 0, { food: 35, stability: 4 })
  ]);
 add('epc_gardens_silk', 'Economy & Trade', 'Boiling Cocoons Under Canvas Awnings',
  'Foreign silk-winders brought from Lucca teach village daughters to reel golden thread, drawing jealous complaints from traditional wool weavers.',
  'followup', [
   C('Charter mixed linen-and-silk guilds so local looms share the new wealth', 75, { credit: 9, tools: 15, trust: 9 }, 'epc_gardens_bloom'),
   C('Reserve mulberry silk strictly as a prestigious royal crown workshop', 0, { prestige: 10, gold: 65 }, 'epc_gardens_bloom')
  ]);
 add('epc_gardens_bloom', 'Economy & Trade', 'White Blossoms Above the City Wall',
  'In May fragrance drifts over tiled alleys—a living monument to peaceful harvests rather than scorched ditches.',
  'followup', [
   C('Throw open the terraced gardens on summer feast days', 40, { trust: 10, legitimacy: 6, prestige: 6 }),
   C('Sell surplus raw silk skeins to foreign factors', 0, { gold: 100, credit: 5 })
  ]);

 // 74. Monks & Mystics — Demon-Whispered Temptation in the Study (3 stages)
 add('epc_midnight_folio', 'Learning & Occult', 'Red Ink That Seems to Breathe',
  'Sleepless after three weeks of debt ledgers, you unlock a confiscated black-bound grimoire—its margins promise instant silver transmutation if only you pronounce names forbidden by church and law.',
  'stress', [
   C('Slam the clasps shut, bolt the chest, and summon fresh night air at the battlements', 0, { piety: 8, stress: -10, legitimacy: 4 }, 'epc_folio_dawn'),
   C('Copy out only practical metallurgy hints while burning the dark invocations', 35, { research: 7, stress: 5 }, 'epc_folio_dawn'),
   C('Read deeper by single tallow dip until wax burns your knuckles', 0, { stress: 12, research: 8, piety: -6 }, 'epc_folio_dawn')
  ]);
 add('epc_folio_dawn', 'Learning & Occult', 'Sparrows Chirping on Frosty Mullions',
  'At first bell a startled page finds you pale beside cold ashes, asking calmly whether the privy council still meets before noon.',
  'followup', [
   C('Hand the locked grimoire directly to trusted cathedral librarians', 20, { piety: 9, faithAuthority: 6, stress: -12 }, 'epc_folio_clean'),
   C('Take three days’ quiet sleep and ride through pine woods', 0, { stress: -18, stability: 4 }, 'epc_folio_clean')
  ]);
 add('epc_folio_clean', 'Learning & Occult', 'Steady Hands on Clean Parchment',
  'Whatever shadows haunted sleepless midnight recede before crisp daylight and honest ledger work.',
  'followup', [
   C('Endow warm tallow and rest hours for overworked palace clerks', 55, { stress: -8, stability: 6, credit: 4 }),
   C('Open shutters wide and return to council', 0, { legitimacy: 5, stress: -4 })
  ]);

 // 75. The Great War-Horse Stud of the Frontier (3 stages)
 add('epc_warhorse_stud', 'Military', 'Chestnut Colts Running Across Limestone Turf',
  'Cavalry losses leave knightly banners short of heavy chargers; a retired master-of-horse proposes importing Andalusian stallions to crossbreed limestone-bone warhorses.',
  'army_fatigue', [
   C('Fund limestone paddocks, Andalusian stallions, and salaried farriers', 145, { morale: 10, supply: 14, prestige: 8 }, 'epc_stud_foals'),
   C('Grant pastures to border squires in exchange for two colts every fifth year', 60, { supply: 12, morale: 6 }, 'epc_stud_foals'),
   C('Buy cheap Flemish cart-horses cleanly at autumn fairs', 0, { supply: 8, fatigue: -4 })
  ]);
 add('epc_stud_foals', 'Military', 'Glanders Fever in the West Barn',
  'Midway through the second winter two imported mares cough thick yellow mucus, threatening to wipe out thirty prized colts before spring.',
  'followup', [
   C('Burn infected stall bedding, isolate barns, and summon skilled farriers', 75, { morale: 8, supply: 12, experience: 0.05 }, 'epc_stud_banners'),
   C('Trust country tar-poultices and keep healthy colts outdoors in snow', 0, { supply: 6, fatigue: -4 }, 'epc_stud_banners')
  ]);
 add('epc_stud_banners', 'Military', 'Thunder Along the Review Field',
  'Three summers on, seventeen-hand bays stamp beneath silk caparisons—giving the realm home-bred shock cavalry independent of foreign horse-brokers.',
  'followup', [
   C('Mount the royal household guard uniformly on home-bred bays', 70, { prestige: 10, morale: 10, legitimacy: 5 }),
   C('Sell surplus bloodstock to allied captains', 0, { gold: 105, credit: 5 })
  ]);

 // 76. The Siege Surgeon’s Amputation Saw (3 stages)
 add('epc_field_surgeon', 'Military', 'Boiled Wine and Silk Ligatures',
  'Instead of plunging agonizing red-hot irons onto shattered limbs, a bold camp surgeon ties arteries with waxed silk thread and washes bone-stumps in warm spirits.',
  'war', [
   C('Equip three mobile surgical wagons and double his apprentice stipends', 120, { morale: 12, research: 8, supply: 10 }, 'epc_surgeon_camp'),
   C('Permit him to tend willing volunteers while elder barber-surgeons watch', 45, { morale: 7, research: 5 }, 'epc_surgeon_camp'),
   C('Stick strictly to traditional pitch cautery; soldiers trust old steel', 0, { stability: 3, morale: -2 })
  ]);
 add('epc_surgeon_camp', 'Military', 'Fewer Groans Behind the Baggage',
  'Wounded pikemen recover weeks faster without black cautery burns; captains whisper men charge harder when they trust the camp surgeons behind them.',
  'followup', [
   C('Print illustrated anatomical wound-charts for garrison infirmaries', 70, { research: 10, morale: 8, prestige: 5 }, 'epc_surgeon_end'),
   C('Thank the surgeon publicly and award him a silver lancet', 0, { morale: 7, prestige: 6 }, 'epc_surgeon_end')
  ]);
 add('epc_surgeon_end', 'Military', 'Quiet Hands Beneath Canvas',
  'Clean silk ligatures become camp doctrine—saving veterans who would once have bled out behind hedgerows.',
  'followup', [
   C('Found a permanent Royal Guild of Military Surgeons', 85, { research: 9, morale: 9, legitimacy: 5 }),
   C('Grant steady crown stipends to camp apothecaries', 0, { supply: 10, stability: 4 })
  ]);

 // 77. The Lost Crown Treaty — Secret Archive Raid (3 stages)
 add('epc_lost_treaty', 'Intrigue', 'Dusty Seals Inside an Alderman’s Trunk',
  'While inventorying an expired traitor’s town house, clerks uncover a parchment compact from forty years past waiving frontier tolls—signed by your own grandfather.',
  'knownSecret', [
   C('Bring the honest parchment before council and honor its lawful limits', 40, { legitimacy: 9, stability: 6, credit: -2 }, 'epc_treaty_rumor'),
   C('Invite affected border towns to renegotiate modern harbor terms', 75, { credit: 8, legitimacy: 6, stability: 4 }, 'epc_treaty_rumor'),
   C('Seal the inconvenient deed inside private treasury chests unseen', 0, { securityMonths: 10, gold: 65, stress: 5 }, 'epc_treaty_rumor')
  ]);
 add('epc_treaty_rumor', 'Intrigue', 'One Copy Survived in a Notary’s Attic',
  'Weeks later a town clerk whispers that a duplicate rough draft of the old grant still lies inside a retired notary’s chest across the river.',
  'followup', [
   C('Purchase the notary’s entire chest cleanly and pension the old man', 90, { securityMonths: 11, legitimacy: 6, stress: -4 }, 'epc_treaty_close'),
   C('Publish the reconciled compact openly to kill blackmail value', 0, { legitimacy: 8, credit: 5, stability: 5 }, 'epc_treaty_close')
  ]);
 add('epc_treaty_close', 'Intrigue', 'Clean Wax, Quiet Ledgers',
  'No ghost from forgotten ink rattles the treasury gates again.',
  'followup', [
   C('Index every ancient royal charter in double-locked vaults', 60, { research: 6, securityMonths: 8 }),
   C('File the parchment cleanly and move on', 0, { stability: 4 })
  ]);

 // 78. Holy Fury — The Warrior Queen’s / King’s Shield-Wall Vow (3 stages)
 add('epc_shieldwall_vow', 'Military', 'Raven Banners Along the Ridge',
  'Outnumbered along a misty ridge with wagon-horses exhausted, veteran huscarls interlock ash-shields and roar for you to raise the ancestral dragon banner.',
  'army', [
   C('Plant the royal standard deep in chalk and swear never to step back', 50, { morale: 14, prestige: 11, fatigue: 6 }, 'epc_shieldwall_noon'),
   C('Anchor the flanks behind sharpened baggage stakes and conserve arrows', 80, { supply: 14, morale: 9, experience: 0.06 }, 'epc_shieldwall_noon'),
   C('Feint withdrawal toward prepared marsh causeways to draw foes thin', 0, { experience: 0.07, morale: 6, fatigue: 4 }, 'epc_shieldwall_noon')
  ]);
 add('epc_shieldwall_noon', 'Military', 'Splintered Ash at Midday',
  'Three heavy charges crash against locked shields; sweat blinds half the front rank while horn-blowers watch your crest above the press.',
  'followup', [
   C('Sound the reserve trumpet and drive home a tight wedge downslope', 45, { morale: 12, experience: 0.07, prestige: 9 }, 'epc_shieldwall_dusk'),
   C('Hold the unbroken wall steady till enemy lances blow horses hollow', 0, { morale: 9, fatigue: -4, legitimacy: 6 }, 'epc_shieldwall_dusk')
  ]);
 add('epc_shieldwall_dusk', 'Military', 'Torches Counting the Living',
  'When dusk stills the ridge, dented shields lean against wagon wheels while bards already tune melodies around camp kettles.',
  'followup', [
   C('Raise a carved stone cross upon the ridge and double veterans’ pay', 95, { prestige: 12, morale: 10, piety: 7 }),
   C('Bind wounds cleanly and march before dawn', 0, { fatigue: -8, supply: 8 })
  ]);

 // 79. Monks & Mystics — The Abbey Scriptorium’s Mechanical Press Rumor (3 stages)
 add('epc_monastic_press', 'Learning & Occult', 'Lead Letters Cast in Olive Oil',
  'An ambitious prior returns from Rhineland fairs carrying steel punches and antimony-lead type—begging crown permission to print vernacular psalters inside the cloister.',
  'crossroads_press', [
   C('Sponsor the abbey press to print cheap school grammars and statutes', 145, { research: 13, development: 1, trust: 9 }, 'epc_press_scribes'),
   C('Permit strictly Latin liturgical books under bishopric proofreaders', 65, { faithAuthority: 8, research: 6, piety: 6 }, 'epc_press_scribes'),
   C('Forbid movable lead type; honest goose-quills guard orthodoxy', 0, { faithAuthority: 7, stability: 4 })
  ]);
 add('epc_press_scribes', 'Learning & Occult', 'Inked Aprons and Angry Calligraphers',
  'Town illuminators and guild scriveners picket the abbey gate waving broken quills, fearing machine-stamped sheets will starve their craft.',
  'followup', [
   C('Retrain calligraphers as woodcut engravers and gilded title-binders', 80, { tools: 18, trust: 9, research: 7 }, 'epc_press_shelf'),
   C('Reserve fine royal charters exclusively for hand-engrossed vellum', 0, { legitimacy: 7, stability: 5 }, 'epc_press_shelf')
  ]);
 add('epc_press_shelf', 'Learning & Occult', 'Crisp Black Letters on Rag Paper',
  'Within a year parish schoolboys clutch affordable grammars instead of sharing one chained calfskin leaf.',
  'followup', [
   C('Establish a royal deposit library receiving one sheet from every press', 60, { research: 11, legitimacy: 6 }),
   C('Collect modest paper-mill customs cleanly', 0, { credit: 7, gold: 60 })
  ]);

 // 80. The Reaper’s Due — The Widow’s Pest-House Bequest (3 stages)
 add('epc_widow_bequest', 'Crisis & Plague', 'Keys Tied in Black Silk',
  'A childless cloth-merchant’s widow leaves three brick warehouses to the crown—on strict condition they serve forever as clean fever wards rather than tax offices.',
  'crisis', [
   C('Honor every word of her testament and fit iron beds and cisterns', 110, { crisis: -18, trust: 11, piety: 9 }, 'epc_bequest_heirs'),
   C('Convert two houses into wards and lease the ground floor for upkeep', 45, { crisis: -12, credit: 6, trust: 6 }, 'epc_bequest_heirs'),
   C('Contest the will quietly and seize the brick warehouses for wool customs', 0, { gold: 130, trust: -9, piety: -6 })
  ]);
 add('epc_bequest_heirs', 'Crisis & Plague', 'Furious Distant Cousins at Probate',
  'Second cousins twice removed burst into chancery waving ancient marriage contracts, claiming the bereaved widow was addled by camphor fumes.',
  'followup', [
   C('Award cousins a modest silver keepsake while upholding the pious hospital', 60, { legitimacy: 8, trust: 8, crisis: -8 }, 'epc_bequest_ward'),
   C('Reject greedy claims sternly before assembled burghers', 0, { legitimacy: 9, prestige: 5, stability: 4 }, 'epc_bequest_ward')
  ]);
 add('epc_bequest_ward', 'Crisis & Plague', 'Lanterns Over Clean White Sheets',
  'Her stone plaque hangs above the arched gate, reminding citizens that mercy outlives merchant fortunes.',
  'followup', [
   C('Endow salaried matrons and herbal gardens for the hospital', 75, { crisis: -12, development: 1, piety: 7 }),
   C('Confirm tax-exempt status forever', 0, { trust: 7, stability: 5 })
  ]);

 // 81. Holy Fury — The Reluctant Regent’s Coronation Delay (3 stages)
 add('epc_regent_delay', 'Succession', 'A Cushion Too Comfortable for a Steward',
  'Months after the young sovereign comes of riding age, the smooth-tongued regent still finds fresh astrological or fiscal pretexts to postpone handing over the Great Seal.',
  'regency', [
   C('Stride into council unannounced with loyal household knights and demand the Seal', 40, { legitimacy: 11, prestige: 8, stress: 5 }, 'epc_regent_seal'),
   C('Audit every regency chest politely first so no ally cries tyranny', 95, { legitimacy: 8, credit: 6, stability: 5 }, 'epc_regent_seal'),
   C('Wait till Easter feast and invite the regent to step down with honors', 0, { stability: 6, legitimacy: 4, stress: 4 }, 'epc_regent_seal')
  ]);
 add('epc_regent_seal', 'Succession', 'Gold Chain Resting Between Two Hands',
  'Caught off-balance beneath watching councillors, the old regent weighs the heavy silver seal matrix—one word could split the hall.',
  'followup', [
   C('Grant him an honorable border pension and kiss both cheeks in peace', 85, { stability: 9, legitimacy: 8, stress: -5 }, 'epc_regent_dawn'),
   C('Confine him politely to his country manor until estate books clear', 0, { securityMonths: 9, legitimacy: 7 }, 'epc_regent_dawn')
  ]);
 add('epc_regent_dawn', 'Succession', 'Your Own Wax on the Parchment',
  'Warm crimson wax takes the new matrix cleanly; for the first time every clerk looks solely to your chair.',
  'followup', [
   C('Proclaim a general confirmation of honest municipal charters', 55, { legitimacy: 9, stability: 6 }),
   C('Seal the old regency chests and begin fresh ledgers', 0, { credit: 5, stress: -4 })
  ]);

 // 82. Monks & Mystics — The Relic Smuggler’s Barrel (3 stages)
 add('epc_relic_smuggler', 'Intrigue', 'Herring Brine Over a Gilded Arm',
  'Harbor gaugers probing a pickled-herring tun fish out a jeweled Byzantine arm-reliquary—smuggled from a sacked island monastery by a desperate captain.',
  'trade', [
   C('Buy out the captain’s crew and return the sacred arm honorably to church elders', 120, { piety: 12, faithAuthority: 7, prestige: 6 }, 'epc_smuggler_envoys'),
   C('Confiscate the smuggled gold cleanly for the royal chapel treasury', 35, { prestige: 8, piety: 4, securityMonths: 6 }, 'epc_smuggler_envoys'),
   C('Let the captain ransom his own contraband back quietly at night', 0, { gold: 125, piety: -7, credit: -2 })
  ]);
 add('epc_smuggler_envoys', 'Intrigue', 'Weeping Monks on the Wharf',
  'Eastern monks arrive breathless in salt-bleached habits, offering rare Greek botanical codices in gratitude if their saint’s reliquary returns whole.',
  'followup', [
   C('Escort the relic safely aboard a royal galley and copy their botanical scrolls', 85, { research: 10, piety: 10, trust: 7 }, 'epc_smuggler_close'),
   C('Keep the gilded arm on loan for capital pilgrimage festivals', 0, { prestige: 8, piety: 4, legitimacy: 5 }, 'epc_smuggler_close')
  ]);
 add('epc_smuggler_close', 'Intrigue', 'Salt Winds Clearing',
  'Harbor captains learn crown customs inspect deeper than herring staves—and pious scholars remember unexpected honor.',
  'followup', [
   C('Reward the sharp-eyed customs gaugers with honest shares', 40, { credit: 7, trust: 6 }),
   C('Log the seizure cleanly in port rolls', 0, { securityMonths: 6, stability: 4 })
  ]);

 // 83. Reaper’s Due — Winter Wolves at the Village Fold (3 stages)
 add('epc_winter_wolves', 'Crisis & Plague', 'Yellow Eyes Outside the Sheep-Pen',
  'Bitter frost drives gaunt wolf packs out of deep pinewoods into river hamlets; bold beasts drag lambs—and once a woodcutter’s child—from snowed doorways.',
  'food', [
   C('Organize royal wolf-hunts with mastiffs and pay silver bounties per pelt', 110, { food: 60, trust: 11, prestige: 6 }, 'epc_wolves_snow'),
   C('Issue iron-tipped spears and tallow torches to every village elder', 50, { food: 35, trust: 8, stability: 4 }, 'epc_wolves_snow'),
   C('Forbid peasants near royal deer coverts and blame bad winter luck', 0, { unrest: 7, trust: -8, food: -15 })
  ]);
 add('epc_wolves_snow', 'Crisis & Plague', 'Blood-Tracks Leading to a Fallen Timber Camp',
  'Trackers corner the huge grey alpha pack beneath frozen windfalls; snowdrifts swallow horses to the girth as horns echo through silence.',
  'followup', [
   C('Lead the final spear-line yourself and distribute wolf-pelts to poor huts', 45, { prestige: 9, trust: 10, stability: 5 }, 'epc_wolves_spring'),
   C('Leave experienced foresters to finish the drive safely with nets', 0, { food: 40, stability: 5 }, 'epc_wolves_spring')
  ]);
 add('epc_wolves_spring', 'Crisis & Plague', 'Safe Paths to the Spring Pastures',
  'Flocks lamb safely under warm March sun; shepherds nail dried pelts above barn doors in tribute to swift crown aid.',
  'followup', [
   C('Establish salaried parish wolf-wardens along deep forest borders', 60, { food: 55, trust: 8 }),
   C('Allow spring grazing with eased forest dues', 0, { trust: 6, food: 30 })
  ]);

 // 84. Holy Fury — The Blood-Feud Marriage Pact (3 stages)
 add('epc_feud_marriage', 'Diplomacy', 'Two Banners Tied at the Altar Rail',
  'Two border dynasties have burned each other’s hayricks for thirty years; exhausted widows now propose sealing eternal concord through your household’s match.',
  'foreignMarriage', [
   C('Host a magnificent border-bridge wedding to bury thirty years of knives', 145, { relation: 16, opinion: 14, stability: 7 }, 'epc_feud_toast'),
   C('Hold a sober chapel ceremony with strict mutual hostage-sureties', 60, { relation: 10, securityMonths: 8, opinion: 6 }, 'epc_feud_toast'),
   C('Keep ceremony strictly private inside palace walls', 0, { stability: 4, opinion: 4, relation: 4 })
  ]);
 add('epc_feud_toast', 'Diplomacy', 'Old Scars Beneath Wedding Silk',
  'Over spiced hipocras, an uncle from the rival border begins recounting an old ambush until every hand slides toward dagger hilts.',
  'followup', [
   C('Rise swiftly, shatter the brag with a thunderous toast to living grandchildren', 35, { prestige: 8, relation: 10, opinion: 10 }, 'epc_feud_morning'),
   C('Have household stewards smoothly call musicians forward to drown the noise', 0, { stability: 6, opinion: 6, stress: 3 }, 'epc_feud_morning')
  ]);
 add('epc_feud_morning', 'Diplomacy', 'Quiet Bells at Dawn',
  'Morning dew glistens over shared pavilions with zero corpses in the ditch—peace feels fragile as blown glass, yet holds.',
  'followup', [
   C('Open joint border wool-fairs celebrating the new amity', 70, { relation: 12, credit: 6, prestige: 6 }),
   C('Dispatch polite morning gifts and escort envoys home', 0, { relation: 6, opinion: 6 })
  ]);

 // 85. Monks & Mystics — The Blind Organ-Builder of the Cathedral (3 stages)
 add('epc_cathedral_organ', 'Religion', 'Lead Pipes Towering Into the Vault',
  'A blind Flemish master offers to construct a two-thousand-pipe wind organ whose thunderous bass shakes stained glass—requiring tin, bellows-leather, and oak chests.',
  'lowFaithAuthority', [
   C('Fund the monumental pipe-organ and salaried bellows-treaders', 150, { faithAuthority: 12, piety: 11, prestige: 10 }, 'epc_organ_bellows'),
   C('Commission a modest choir-organ for royal chapel vigils', 70, { piety: 8, faithAuthority: 7, prestige: 5 }, 'epc_organ_bellows'),
   C('Forbid mechanical pipes; unadorned human choir voices suffice', 0, { piety: 5, stability: 4 })
  ]);
 add('epc_organ_bellows', 'Religion', 'Rattling Lead Windows Under Thunder',
  'During final tuning, low reed-pipes rattle loose medieval mortar from a clerestory arch; fearful wardens wonder if the vault itself can bear the roar.',
  'followup', [
   C('Reinforce the stone gallery with iron tie-rods before dedication mass', 85, { development: 1, faithAuthority: 9, trust: 7 }, 'epc_organ_hymn'),
   C('Soften the lowest brass stops and keep harmony gentle', 0, { piety: 7, stability: 5 }, 'epc_organ_hymn')
  ]);
 add('epc_organ_hymn', 'Religion', 'Te Deum Rolling Across the River',
  'When full chords finally flood the nave at Pentecost, townsfolk outside weep in the street—sure heaven itself opened above the spires.',
  'followup', [
   C('Endow a permanent cathedral choir school for bright town boys', 75, { research: 7, faithAuthority: 9, trust: 8 }),
   C('Leave the blind master honored with a lifetime crown pension', 0, { piety: 9, prestige: 7 })
  ]);

 // 86. Holy Fury — The Coronation Banquet Peacock (3 stages)
 add('epc_coronation_banquet', 'Succession', 'Gilded Feathers on the High Table',
  'At the grand accession feast, cooks bear in a roasted peacock re-dressed in iridescent tail feathers while rival dukes eye whose dish arrives first from the carving board.',
  'newReign', [
   C('Serve the finest platters first to border defenders and elder stewards', 125, { legitimacy: 10, prestige: 8, stability: 5 }, 'epc_banquet_toasts'),
   C('Carve the bird personally and send plates to city almshouses outside', 80, { piety: 9, legitimacy: 8, stress: -4 }, 'epc_banquet_toasts'),
   C('Keep the feast brief and adjourn straight to treasury business', 0, { credit: 5, stability: 4 })
  ]);
 add('epc_banquet_toasts', 'Succession', 'Silver Ewers Ringing Beneath Torchlight',
  'By the third course drunken youths debate whose grandfathers rode farther at historic sieges, voices rising sharp above lute strings.',
  'followup', [
   C('Rise smiling and pledge shared honors to every house serving the realm', 45, { prestige: 9, legitimacy: 7, stability: 5 }, 'epc_banquet_dawn'),
   C('Dismiss minstrels cleanly and bid lords rest before morning council', 0, { stability: 6, stress: -5 }, 'epc_banquet_dawn')
  ]);
 add('epc_banquet_dawn', 'Succession', 'Swept Rushes at Daybreak',
  'Morning bells catch loyal lords waiting calmly in the ante-chamber—the new reign wears its salt and silver naturally.',
  'followup', [
   C('Issue generous accession pardons for petty forest debts', 55, { legitimacy: 9, stability: 6 }),
   C('Open the first royal assize promptly', 0, { legitimacy: 6, credit: 4 })
  ]);

 // 87. Holy Fury — The Herald’s Painted Roll of Arms (3 stages)
 add('epc_bloodline_herald', 'Imperial & Heritage', 'Sixty Shields Waiting for Gold Leaf',
  'King-of-Arms spreads clean linen across trestles to paint an authoritative Roll of Noble Houses—prompting half the realm’s gentry to offer purses for brighter quarterings.',
  'lowlegitimacy', [
   C('Refuse bribes sternly and verify every crest strictly by ancient charters', 80, { legitimacy: 12, prestige: 8, trust: 6 }, 'epc_herald_dispute'),
   C('Charge honest registration fees to standardize coats across counties', 35, { gold: 95, legitimacy: 7, credit: 5 }, 'epc_herald_dispute'),
   C('Leave barons to paint whatever lions please them on barn shields', 0, { stability: 4, prestige: -2 })
  ]);
 add('epc_herald_dispute', 'Imperial & Heritage', 'Two Barons Claiming the Identical Red Griffin',
  'Two prickly border houses discover both bear a rampant red griffin on gold—and threaten armed livery brawls at next month’s fair.',
  'followup', [
   C('Award the elder lineage the plain griffin and grant the younger a silver crest-crown', 55, { legitimacy: 9, stability: 7, prestige: 6 }, 'epc_herald_roll'),
   C('Settle the arms by formal heraldic trial before the Constable', 0, { legitimacy: 8, unrest: -4 }, 'epc_herald_roll')
  ]);
 add('epc_herald_roll', 'Imperial & Heritage', 'Crimson Wax Across the Armorial',
  'Bound in calfskin behind iron clasps, the royal Roll settles lineage pride without spilling a drop of noble blood.',
  'followup', [
   C('Display copies in cathedral libraries and royal chancery', 50, { prestige: 9, research: 5 }),
   C('Lock the master roll inside crown archives', 0, { legitimacy: 7, securityMonths: 6 })
  ]);

 // 88. Holy Fury — The Bear-Skin Champion’s Winter Trial (3 stages)
 add('epc_lodge_bear', 'Military', 'Claws Hung Over the Garrison Hearth',
  'Deep snow isolates forward pickets along the mountain pass; lodge veterans dare recruits to track a gaunt cave-bear through drifts armed solely with ash spears.',
  'army', [
   C('Lead a disciplined hunting ring with boar-spears and wolfhounds', 65, { morale: 11, prestige: 9, experience: 0.06 }, 'epc_bear_tracks'),
   C('Reward boldest scouts with extra salted beef and warm wool mittens', 45, { morale: 8, supply: 12 }, 'epc_bear_tracks'),
   C('Order winter sentries to keep timber fires roaring instead of risking frostbite', 0, { supply: 8, fatigue: -6, morale: 4 }, 'epc_bear_tracks')
  ]);
 add('epc_bear_tracks', 'Military', 'Red Snow Beneath Pine Boughs',
  'When the cornered beast rears taller than a cavalry lance, a rookie pikeman slips in icy crust—forcing instant choice between pride and discipline.',
  'followup', [
   C('Form tight shoulder-to-shoulder spear hedge and drop the beast cleanly', 25, { morale: 12, experience: 0.07, prestige: 7 }, 'epc_bear_feast'),
   C('Cover the boy’s retreat with flaming pine-knots before closing in', 0, { morale: 9, supply: 6 }, 'epc_bear_feast')
  ]);
 add('epc_bear_feast', 'Military', 'Greasy Steaks Around Pine Fires',
  'Shared peril welds green levies and scarred lodge-brothers tighter than six months of parade-ground drill.',
  'followup', [
   C('Sew the thick pelt into a winter cape for the bravest sergeant', 40, { morale: 10, prestige: 6 }),
   C('Return swiftly to valley guard stations', 0, { fatigue: -6, supply: 8 })
  ]);

 // 89. Holy Fury — Cracking of the Great Cathedral Bell (3 stages)
 add('epc_canon_bell', 'Religion', 'A Dull Clank Across the Valley',
  'During high feast vespers, a hairline frost-crack splits the cathedral’s four-ton tenor bell mid-swing—leaving the town silent and superstitious tongues wagging of evil omens.',
  'faith_christian', [
   C('Summon master bell-founders to recast the bronze right in the churchyard pit', 155, { faithAuthority: 11, piety: 10, prestige: 9 }, 'epc_bell_pit'),
   C('Hang a smaller chapel bell temporarily while collecting parish copper pennies', 60, { trust: 8, piety: 7, credit: 4 }, 'epc_bell_pit'),
   C('Ring the remaining smaller peals and dismiss frightened rumors', 0, { stability: 5, faithAuthority: -3 })
  ]);
 add('epc_bell_pit', 'Religion', 'Molten Tin and Copper Glowing at Dusk',
  'Citizens toss silver rings and old pewter spoons into the clay furnace beside chanting priests as molten bronze pours white-hot into buried loam.',
  'followup', [
   C('Cast your royal motto and a prayer for peace around the fresh bronze rim', 65, { legitimacy: 8, piety: 9, trust: 7 }, 'epc_bell_ring'),
   C('Focus purely on pure acoustic bronze without costly inscriptions', 0, { faithAuthority: 7, tools: 10 }, 'epc_bell_ring')
  ]);
 add('epc_bell_ring', 'Religion', 'Golden Thunder Over Tiled Roofs',
  'When ropes haul the gleaming colossus up the oak frame, one deep note rolls three leagues across river meadows—sweeping gloom away.',
  'followup', [
   C('Endow salaried ringers and distribute feast loaves at the west porch', 55, { trust: 9, piety: 8 }),
   C('Close the casting pit cleanly and bless the tower', 0, { faithAuthority: 6, stability: 4 })
  ]);

 // 90. Monks & Mystics — Grinding Spectacle Lenses by Candle (3 stages)
 add('epc_hermetic_lens', 'Learning & Occult', 'Clear Quartz Against Emery Powder',
  'Aged abbots squint blindly over tiny manuscripts; a Hermetic artisan demonstrates curved rock-crystal lenses mounted in horn frames that restore sharp sight to grey eyes.',
  'research', [
   C('Sponsor crystal lens-grinders and equip royal copyists and navigators', 130, { research: 13, development: 1, credit: 6 }, 'epc_lens_optic'),
   C('Supply reading spectacles strictly to treasury auditors and cathedral elders', 65, { research: 8, legitimacy: 6, piety: 4 }, 'epc_lens_optic'),
   C('Leave brass toys to Flemish peddlers', 0, { stability: 3, research: 3 })
  ]);
 add('epc_lens_optic', 'Learning & Occult', 'Two Lenses Aligned in Leather Tubes',
  'Cleaning two curved crystals inside a rolled parchment tube, an apprentice gasps: distant church spires leap three times nearer across the meadow.',
  'followup', [
   C('Fund systematic optical experiments for harbor watchtowers and star charts', 90, { research: 13, prestige: 8, securityMonths: 7 }, 'epc_lens_legacy'),
   C('Keep practical reading spectacles affordable for urban guild workshops', 0, { development: 1, trust: 9, credit: 5 }, 'epc_lens_legacy')
  ]);
 add('epc_lens_legacy', 'Learning & Occult', 'Grey Scholars Reading Late Again',
  'Old masters double their active years at writing desks—multiplying books, maps, and clean ledgers across the kingdom.',
  'followup', [
   C('Charter a glassmakers’ optical guild beside the university', 75, { research: 10, credit: 7 }),
   C('Archive the grinding ratios inside the palace library', 0, { research: 7, prestige: 5 })
  ]);

 // 91. Monks & Mystics — Forging a Ceremonial Parade Helm (3 stages)
 add('epc_smith_crown_helm', 'Martial & Court', 'Fluted Steel and Peacock Plumes',
  'Preparing a grand frontier review, your master armorer offers to hammer a single-piece fluted sallet chased with gold vines—matching royal grace to battlefield proof.',
  'army_supply', [
   C('Commission the masterwork helm and test a twin plate against crossbow quarrels', 140, { prestige: 11, morale: 9, experience: 0.06 }, 'epc_helm_anvil'),
   C('Order plain blackened steel helms for fifty vanguard serjeants instead', 95, { supply: 18, morale: 10, legitimacy: 5 }, 'epc_helm_anvil'),
   C('Polish existing armory iron cleanly with river sand and tallow', 0, { supply: 10, fatigue: -4 })
  ]);
 add('epc_helm_anvil', 'Martial & Court', 'Cold Hammers Ringing Over Horn',
  'When the test quarrel strikes the tempered brow-plate at twenty paces, it sparks harmlessly aside leaving only a bright silver dent.',
  'followup', [
   C('Adopt the same heat-tempering recipe across royal garrison smithies', 85, { supply: 16, experience: 0.08, research: 6 }, 'epc_helm_parade'),
   C('Reward the armorer with a silver belt and hang the proof-plate in hall', 0, { prestige: 9, morale: 6 }, 'epc_helm_parade')
  ]);
 add('epc_helm_parade', 'Martial & Court', 'Sunlight Along Visored Ranks',
  'When trumpets blow along the review line, steel gleams sharp enough to sober watching foreign envoys.',
  'followup', [
   C('Grant permanent coal-charter exemptions to military armorers', 60, { supply: 15, morale: 7 }),
   C('Return armor cleanly to greased oil-chests', 0, { supply: 8, stability: 4 })
  ]);

 // 92. Monks & Mystics — The Abbess’s Secret Ledger (3 stages)
 add('epc_cult_abbess', 'Intrigue', 'Ciphered Confessions Behind the Grille',
  'Your agents intercept a courier nun carrying hollow rosary beads stuffed with coded notes detailing a plot inside court chambers—sent straight from a wealthy noble convent.',
  'activePlot', [
   C('Exploit the intercepted code to weave your own scheme through her couriers', 80, { plotPreparation: 14, securityMonths: 9, stress: 5 }, 'epc_abbess_grille'),
   C('Visit the abbess unannounced at dawn and compel her quiet cooperation', 40, { securityMonths: 11, legitimacy: 6, plotPreparation: 8 }, 'epc_abbess_grille'),
   C('Burn the hollow beads silently and replace convent gatekeepers', 0, { securityMonths: 8, stability: 4 })
  ]);
 add('epc_abbess_grille', 'Intrigue', 'Almond Eyes Behind Iron Lattice',
  'Unflinching behind choir curtains, the aristocratic abbess admits she sells court whispers to protect her sisters’ disputed dowry meadows from greedy dukes.',
  'followup', [
   C('Confirm her convent’s meadows cleanly in exchange for permanent loyal eyes', 75, { securityMonths: 12, plotPreparation: 12, legitimacy: 5 }, 'epc_abbess_end'),
   C('Threaten visitation audits unless she surrenders every cipher key at once', 0, { securityMonths: 10, stress: 4 }, 'epc_abbess_end')
  ]);
 add('epc_abbess_end', 'Intrigue', 'Prayers and Quiet Ink',
  'Cloister bells ring calmly at matins; nobody at court guesses which silent corridor carries secrets straight to your desk.',
  'followup', [
   C('Endow a discreet convent scriptorium as cover for reliable dispatches', 65, { securityMonths: 10, piety: 5 }),
   C('Lock the broken cipher cleanly inside treasury drawers', 0, { securityMonths: 7, stability: 4 })
  ]);

 // 93. Monks & Mystics — Endowing a Great Scriptorium & Hospital (3 stages)
 add('epc_monastic_codex', 'Religion', 'Vellum Rolls Stacked Beneath Damp Leaks',
  'A local religious foundation bursting with novices begs crown aid to expand its timber infirmary and dry library vault—promising trained clerks and steady local peace.',
  'institutionUpgrade', [
   C('Finance stone library vaults, slate roofs, and an expanded infirmary wing', 165, { institutionLevel: 1, trust: 11, research: 8 }, 'epc_codex_vault'),
   C('Sponsor modest roof tiles and clerk benches while keeping endowments tight', 80, { trust: 8, piety: 7, development: 1 }, 'epc_codex_vault'),
   C('Encourage parish volunteers without opening the royal purse', 0, { piety: 5, stability: 4 })
  ]);
 add('epc_codex_vault', 'Religion', 'Lime Mortar Setting Before Autumn Rain',
  'Masons uncover old Roman brick foundations beneath the cloister cabbage patch, sparking friendly quarrels between antiquarians and impatient roofers.',
  'followup', [
   C('Preserve carved stones inside the new cloister arcade cleanly', 55, { prestige: 8, research: 7, trust: 6 }, 'epc_codex_open'),
   C('Keep masonry moving briskly so manuscripts sit dry before frost', 0, { development: 1, stability: 5 }, 'epc_codex_open')
  ]);
 add('epc_codex_open', 'Religion', 'Bells Blessing Stone Arches',
  'Scholars, nurses, and townsfolk gather under dry slate eaves—a lasting anchor of faith and learning in the province.',
  'followup', [
   C('Endow annual parchment and ink stipends for village scholars', 60, { research: 9, trust: 8 }),
   C('Sign the foundation charter and return to capital', 0, { legitimacy: 6, piety: 6 })
  ]);

 // 94. Reaper’s Due — Plague Ships Burned or Anchored (3 stages)
 add('epc_plague_dock', 'Crisis & Plague', 'Black Smoke Off the Outer Spit',
  'Panic grips waterfront alleys when fishermen pull ashore drifting bales from a ghost-ship whose crew died of spotted fever off the cape—now dockers demand torches.',
  'epidemic', [
   C('Cordon the spit with armed pickets, burn drifted cloth safely, and feed dockers', 120, { crisis: -18, trust: 11, food: -20 }, 'epc_dock_surgeons'),
   C('Pay brave divers to sink the drifting wreck cleanly in deep channel', 75, { crisis: -14, securityMonths: 7 }, 'epc_dock_surgeons'),
   C('Let coastal mobs torch stranded wreckage while sealing city water-gates', 0, { crisis: -8, unrest: 6, trust: -5 })
  ]);
 add('epc_dock_surgeons', 'Crisis & Plague', 'Rats Swimming From Split Planks',
  'Even after flames die, sharp-eyed watchmen spot wet ship-rats scrambling up timber wharf pilings toward grain warehouses.',
  'followup', [
   C('Issue penny bounties per rat-tail and wrap warehouse posts in tin collars', 75, { crisis: -16, research: 6, trust: 9 }, 'epc_dock_clear'),
   C('Scatter quicklime along wharves and flood alleys with sea-water buckets', 0, { crisis: -10, stability: 5 }, 'epc_dock_clear')
  ]);
 add('epc_dock_clear', 'Crisis & Plague', 'Clean Tides Washing the Quay',
  'Prompt harbor cordons spare the inner tenements—leaving dockside taverns grateful and tin-collared granaries standing dry.',
  'followup', [
   C('Make tin rat-collars mandatory on every port storehouse', 55, { development: 1, crisis: -8, credit: 6 }),
   C('Stand down extra pickets cleanly', 0, { stability: 5, trust: 4 })
  ]);

 // 95. Reaper’s Due — The Court Physician’s Trepanation Drill (3 stages)
 add('epc_physician_leeches', 'Crisis & Plague', 'A Silver Brace-and-Bit Beside the Pillow',
  'After a terrible tilting fall leaves a kinsman blind with pounding skull-pressure, your foreign physician unpacks a fine screw-drill to vent dark blood beneath bone.',
  'illness', [
   C('Trust his steady anatomical skill with boiled sponges and clean linen', 95, { health: -28, research: 8, stress: 6 }, 'epc_trepan_watch'),
   C('Forbid bone-drilling; prescribe quiet darkened rooms, ice cloths, and prayer', 35, { health: -14, piety: 7, stress: 3 }, 'epc_trepan_watch'),
   C('Summon three rival doctors to debate before touching a knife', 0, { stress: 5, health: -6, stability: 3 })
  ]);
 add('epc_trepan_watch', 'Crisis & Plague', 'Twelve Breaths in Candlelight',
  'For two endless nights courtiers tiptoe across felt rugs waiting outside the bedchamber while apothecaries grind willow-bark infusions.',
  'followup', [
   C('Keep the chamber warm, silent, and guarded against loud visitors', 45, { health: -18, stability: 5 }, 'epc_trepan_dawn'),
   C('Endow hospital candles so clergy pray quietly alongside physicians', 0, { piety: 8, health: -15 }, 'epc_trepan_dawn')
  ]);
 add('epc_trepan_dawn', 'Crisis & Plague', 'Asking for Warm Broth',
  'When the patient finally blinks cleanly at sunlight and asks for salted broth, awe ripples down palace stairs.',
  'followup', [
   C('Publish the physician’s surgical notes for university barber-surgeons', 75, { research: 11, prestige: 7 }),
   C('Pay his chest of silver quietly and thank providence', 0, { piety: 6, stability: 5 })
  ]);

 // 96. Reaper’s Due — Famine Granary Riot at the Abbey Gate (3 stages)
 add('epc_famine_seed', 'Crisis & Plague', 'Women Pounding Empty Cauldrons',
  'Thin winters drain peasant meal-chests while hungry crowds surround an abbey barn rumored to hoard wheat for high spring market prices.',
  'famine', [
   C('Purchase the abbey’s surplus at fair fixed silver and bake free daily loaves', 150, { food: 110, crisis: -20, trust: 12 }, 'epc_famine_ovens'),
   C('Commandeer half the hoard under royal emergency writ with promissory tallies', 40, { food: 80, crisis: -14, unrest: -6 }, 'epc_famine_ovens'),
   C('Send horsemen to disperse the crowd and guard abbey locks', 0, { securityMonths: 6, unrest: 9, trust: -10 })
  ]);
 add('epc_famine_ovens', 'Crisis & Plague', 'Brick Ovens Smoking Before Dawn',
  'As warm barley loaves pass down bread-lines, fainting children revive—yet exhausted bakers warn firewood stacks will run out by Friday.',
  'followup', [
   C('Open royal forest windfalls to fuel community ovens through winter', 60, { food: 55, crisis: -12, trust: 10 }, 'epc_famine_spring'),
   C('Ration mixed turnip-and-barley pottage cleanly to stretch fuel', 0, { food: 40, crisis: -8, stability: 4 }, 'epc_famine_spring')
  ]);
 add('epc_famine_spring', 'Crisis & Plague', 'Peas Sprouting in Thawed Loam',
  'Survival through lean February binds starving villages closer to the throne than any victory parade.',
  'followup', [
   C('Build parish stone seed-vaults guarded jointly by elders and bailiffs', 85, { development: 1, food: 75, crisis: -10 }),
   C('Distribute spring seed-peas and close emergency kitchens', 0, { food: 45, trust: 7 })
  ]);

 // 97. Reaper’s Due — Spring Ice-Jam Floods the Ferry Town (3 stages)
 add('epc_flood_ferry', 'Crisis & Plague', 'Oak Beams Smashing Against Bridge Piers',
  'Sudden thaw sends house-sized river ice floes slamming against bridge timber; foaming brown water surges into lower tanneries and bakers’ cellars.',
  'flood', [
   C('Break the ice-jam safely with gunpowder charges and rescue trapped families by skiff', 135, { crisis: -20, trust: 11, prestige: 6 }, 'epc_flood_boats'),
   C('Pay ferrymen silver bounties to evacuate rooftops and dry wool looms', 85, { crisis: -15, trust: 10, credit: 4 }, 'epc_flood_boats'),
   C('Sandbag royal custom warehouses and let riverside shanties ride out the crest', 0, { credit: 4, trust: -8, crisis: -5 })
  ]);
 add('epc_flood_boats', 'Crisis & Plague', 'Silt Drying Inside Brick Hearths',
  'When waters drop, thick brown mud coats ground floors and wells turn foul—fever threatens unless alleys clear before warm sun hits.',
  'followup', [
   C('Pay street-cleaning gangs, pump wells dry, and supply clean straw bedding', 95, { crisis: -16, development: 1, trust: 10 }, 'epc_flood_dyke'),
   C('Forgive half-year hearth taxes for flooded lower streets', 0, { unrest: -9, trust: 8 }, 'epc_flood_dyke')
  ]);
 add('epc_flood_dyke', 'Crisis & Plague', 'Cut Stone Breakwaters',
  'Angled limestone ice-breakers set upstream promise future spring thaws split cleanly before hitting town arches.',
  'followup', [
   C('Raise stone ice-breakers upstream of the bridge', 90, { development: 1, crisis: -10, stability: 6 }),
   C('Restore river ferry ropes cleanly', 0, { credit: 5, trust: 5 })
  ]);

 // 98. Reaper’s Due — Fire in the Royal Mint’s Coal Loft (3 stages)
 add('epc_fire_granary', 'Crisis & Plague', 'Melting Silver Spilling Across Flagstones',
  'Overheated cupellation hearths ignite roof timbers above the royal mint and adjacent malt-granary; glowing embers rain onto crowded narrow lanes.',
  'fire', [
   C('Form armored bucket chains, save bullion chests, and douse adjoining roofs', 120, { crisis: -18, credit: 9, trust: 8 }, 'epc_mint_ash'),
   C('Seal iron vault doors fast and pull down adjacent timber sheds to stop spread', 70, { crisis: -15, stability: 6, legitimacy: 5 }, 'epc_mint_ash'),
   C('Focus guards strictly on guarding spilled bullion from looters', 0, { gold: 75, crisis: -6, trust: -7 })
  ]);
 add('epc_mint_ash', 'Crisis & Plague', 'Sifting Charcoal for Molten Groats',
  'After smoke clears, blackened silver droplets glitter in cold ash while displaced neighbors shiver in church porches.',
  'followup', [
   C('Rebuild the mint in vaulted brick and house burned families in guild halls', 110, { development: 1, trust: 11, credit: 8 }, 'epc_mint_new'),
   C('Refine salvaged bullion immediately to keep soldiers’ Friday pay steady', 0, { credit: 8, stability: 6 }, 'epc_mint_new')
  ]);
 add('epc_mint_new', 'Crisis & Plague', 'Clean Chimneys Over Slate',
  'Vaulted stone arches protect future coining hammers—turning near-calamity into fireproof civic craft.',
  'followup', [
   C('Ban open thatch and timber chimneys inside inner city wards', 60, { development: 1, stability: 7 }),
   C('Resume minting crisp coin cleanly', 0, { credit: 7, inflation: -1 })
  ]);

 // 99. Reaper’s Due — Drought & the Bitter Canal Tolls (3 stages)
 add('epc_drought_canal', 'Crisis & Plague', 'Barges Grounded in Muddy Silt',
  'Shrinking summer snowmelt drops canal water below keel-depth; bargees hauling grain and salt maroon beside a proud baron’s private irrigation sluice.',
  'drought', [
   C('Buy temporary lock-openings and dredge shallow shoals for grain barges', 125, { food: 80, crisis: -17, credit: 7 }, 'epc_canal_sluice'),
   C('Transfer stalled grain onto requisitioned mule trains under royal escorts', 75, { food: 65, crisis: -13, trust: 7 }, 'epc_canal_sluice'),
   C('Wait for autumn rains while rationing palace flour bins', 0, { food: 25, crisis: -4, trust: -5 })
  ]);
 add('epc_canal_sluice', 'Crisis & Plague', 'Turned Sluices Under Moonlight',
  'Sharing scarce river water forces hard choices between riverside melon gardens and starving inland bakers.',
  'followup', [
   C('Establish rotating water-days compensating orchardists cleanly', 75, { trust: 10, food: 55, crisis: -10 }, 'epc_canal_clear'),
   C('Prioritize bread-grain barges strictly until crisis breaks', 0, { food: 45, unrest: -4, stability: 4 }, 'epc_canal_clear')
  ]);
 add('epc_canal_clear', 'Crisis & Plague', 'Oars Dipping Deep Again',
  'Once clear water rises past stone gauges, written canal-sharing compacts remain law through dry summers ahead.',
  'followup', [
   C('Install calibrated stone water-gauges along every lock', 65, { research: 6, credit: 8, development: 1 }),
   C('Lower emergency barge tolls cleanly', 0, { trust: 7, credit: 5 })
  ]);

 // 100. Holy Fury — The Pilgrimage Ferry Disaster (3 stages)
 add('epc_bone_relic', 'Religion', 'Lanterns Drifting Off the Foggy Shoal',
  'Overloaded by singing Easter pilgrims, a wooden river-ferry founders in thick dawn mist; brave fishermen haul thirty shivering souls onto gravel bars while bells toll alarm.',
  'faith_christian', [
   C('Fund a wide cut-stone pilgrim bridge and pension the rescuing fishermen', 155, { development: 1, piety: 11, trust: 12 }, 'epc_ferry_widows'),
   C('Establish licensed crown ferries with strict safety load-marks and life-skiffs', 75, { trust: 9, piety: 7, credit: 5 }, 'epc_ferry_widows'),
   C('Offer solemn requiem masses and fine the reckless ferry-master', 0, { piety: 7, stability: 4, trust: -3 })
  ]);
 add('epc_ferry_widows', 'Religion', 'Wet Cloaks Drying Beside Abbey Braziers',
  'Survivors and fishermen’s wives gather at the abbey porch; cathedral deans offer half their Easter shrine box if the crown matches stone.',
  'followup', [
   C('Match shrine silver cleanly and carve rescues into the bridge parapet', 85, { piety: 10, prestige: 9, trust: 9 }, 'epc_ferry_bridge'),
   C('Direct abbey alms straight to bereaved families first', 0, { piety: 8, stability: 5 }, 'epc_ferry_bridge')
  ]);
 add('epc_ferry_bridge', 'Religion', 'Dry Footsteps Across Dark Water',
  'Never again does spring fog swallow singing travelers at the crossing.',
  'followup', [
   C('Post lantern beacons at river bends every dusk', 45, { trust: 8, credit: 5 }),
   C('Dedicate the crossing in quiet prayer', 0, { piety: 7, legitimacy: 5 })
  ]);

 // 101. Holy Fury — Captured Banners Hung in Shame or Honor (3 stages)
 add('epc_crusade_banners', 'Military', 'Silk Eagles Torn From Broken Poles',
  'After routing a rival’s proud vanguard, your captains bring seventeen silk banners stained with mud and blood—asking whether to drag them behind horses or exchange them chivalrously.',
  'war', [
   C('Hang captured standards high in the cathedral nave as solemn trophies', 65, { prestige: 12, piety: 8, morale: 9 }, 'epc_banners_envoy'),
   C('Return personal family pennants honorably in ransom talks for captive knights', 40, { relation: 12, prestige: 8, morale: 6 }, 'epc_banners_envoy'),
   C('Let victorious regiments carry torn trophies straight through camp bonfires', 0, { morale: 10, prestige: 6, relation: -6 })
  ]);
 add('epc_banners_envoy', 'Military', 'Trumpeters Before the Camp Ditch',
  'Enemy heralds ride slowly under white cloth carrying chests of silver to buy back their regiment’s sacred embroidered eagle.',
  'followup', [
   C('Trade the sacred banner cleanly for release of every wounded prisoner', 20, { morale: 11, relation: 10, legitimacy: 7 }, 'epc_banners_end'),
   C('Decline gold; let torn silk hang where grandchildren remember your steel', 0, { prestige: 11, morale: 7 }, 'epc_banners_end')
  ]);
 add('epc_banners_end', 'Military', 'Honor Remembered Along Both Lines',
  'Even beaten veterans across the ditch speak of your discipline with grudging respect.',
  'followup', [
   C('Commission painted chronicle panels of the campaign', 70, { prestige: 10, legitimacy: 6 }),
   C('Sharpen spears and break camp before sunrise', 0, { experience: 0.05, supply: 8 })
  ]);

 // 102. Reaper’s Due — Seclusion Madness & the Loyal Hound (3 stages)
 add('epc_seclusion_rat', 'Crisis & Plague', 'Yellow Candlelight Behind Bolted Oak',
  'Weeks into disaster relief, sleepless stewards snap over spilled ink and barking dogs—tension thick as grease smoke inside sealed council chambers.',
  'crisis', [
   C('Order fresh herbs boiled, throw windows open to crisp wind, and share warm meals', 75, { crisis: -12, stability: 8, trust: 5 }, 'epc_seclusion_garden'),
   C('Lead a brisk inspection walk across hospital yards to shake off stale air', 40, { trust: 9, crisis: -10, prestige: 5 }, 'epc_seclusion_garden'),
   C('Keep doors bolted tight until clerks finish every disaster tally', 0, { credit: 4, stability: 3, crisis: -4 })
  ]);
 add('epc_seclusion_garden', 'Crisis & Plague', 'Sparrows Bathing in Frosty Stone Basins',
  'Stepping into cold courtyard air clears stagnant fear; even grim surgeons smile watching a scruffy hound chase falling oak leaves.',
  'followup', [
   C('Rotate exhausted clerks on staggered rest shifts so relief work stays sharp', 55, { crisis: -12, stability: 7, trust: 7 }, 'epc_seclusion_calm'),
   C('Serve hot spiced broth across guardhouses tonight', 0, { trust: 6, crisis: -8 }, 'epc_seclusion_calm')
  ]);
 add('epc_seclusion_calm', 'Crisis & Plague', 'Steady Voices Return',
  'Clearer heads guide relief wagons twice as fast as panicked shouting.',
  'followup', [
   C('Publish plain calm daily bulletins so rumors stop breeding fear', 40, { trust: 9, unrest: -6 }),
   C('Return steadily to council benches', 0, { stability: 7, trust: 4 })
  ]);

 // 103. Reaper’s Due — Prosperity Boom’s Windmill & Drained Fen (3 stages)
 add('epc_prosperity_windmill', 'Economy & Trade', 'Canvas Sails Turning Above Peat Marshes',
  'Peaceful harvests swell town grain bins; an energetic manor reeve proposes draining six hundred acres of rushy fenland using timber post-windmills and limestone sluices.',
  'land', [
   C('Underwrite the fen drainage scheme and grant freeholder plots to newcomers', 160, { development: 1, food: 95, trust: 11 }, 'epc_windmill_fen'),
   C('Co-invest fifty-fifty with town millers in return for permanent mill-tolls', 85, { credit: 9, food: 65, development: 1 }, 'epc_windmill_fen'),
   C('Leave the reeds wild; eel-fishermen and wildfowlers rely on wet marshes', 0, { food: 40, trust: 6 })
  ]);
 add('epc_windmill_fen', 'Economy & Trade', 'Eel-Catchers Grumbling by the Sluice',
  'As black peat dries into rich barley earth, angry eel-trappers complain their ancient willow weirs lie dry above mud.',
  'followup', [
   C('Reserve deep outer reed-channels cleanly for eel-weirs and duck decoys', 55, { trust: 10, food: 50, acceptance: 6 }, 'epc_windmill_harvest'),
   C('Compensate trappers with dry plow-strips along the new polder', 0, { loyalty: 6, unrest: -6, trust: 6 }, 'epc_windmill_harvest')
  ]);
 add('epc_windmill_harvest', 'Economy & Trade', 'Golden Barley Where Bitterns Nested',
  'Heavy grain wagons roll off reclaimed black earth—fueling bakeries and town population growth for decades.',
  'followup', [
   C('Charter a new rural parish beside the largest windmill', 75, { development: 1, piety: 6, trust: 8 }),
   C('Enter new polder rents neatly in royal rolls', 0, { gold: 90, credit: 6 })
  ]);

 // 104. Holy Fury — The Claimant’s Trial by Combat Demand (3 stages)
 add('epc_claimant_duel', 'Succession', 'A Gauntlet Clattering Beside the Throne',
  'Stung by whispering courtiers, an ambitious adult claimant drops a steel gauntlet at the dais foot, challenging your right before God and iron—offering to stake his claim on single combat.',
  'livingClaimant', [
   C('Accept coldly: appoint the kingdom’s fiercest champion or step down yourself', 60, { prestige: 12, legitimacy: 10, stress: 6 }, 'epc_claimant_lists'),
   C('Refuse barbaric blood-sports and summon peers to judge his claim by law', 75, { legitimacy: 10, stability: 7, opinion: -10 }, 'epc_claimant_lists'),
   C('Laugh him out of hall and double household guards', 0, { prestige: 5, securityMonths: 8, opinion: -12 })
  ]);
 add('epc_claimant_lists', 'Succession', 'Sand Sprinkled Over Frozen Turf',
  'Whether blades ring behind barriers or jurists unroll parchment rolls, the whole court watches how firmly the crown answers public defiance.',
  'followup', [
   C('Spare the humbled claimant after victory and bind him by solemn fealty', 40, { legitimacy: 10, opinion: 14, stability: 6 }, 'epc_claimant_close'),
   C('Banish his immediate retainers cleanly to distant coastal towers', 0, { securityMonths: 10, legitimacy: 8, opinion: -10 }, 'epc_claimant_close')
  ]);
 add('epc_claimant_close', 'Succession', 'Quiet Steps Along the Dais',
  'Whispered succession bets vanish before winter; authority proved once rarely needs proving twice.',
  'followup', [
   C('Reward loyal household knights and judges openly', 65, { prestige: 9, stability: 6 }),
   C('Return the gauntlet calmly to the armory', 0, { legitimacy: 6, stress: -4 })
  ]);

 // 105. Monks & Mystics — The Abbey Herbal Distillery (3 stages)
 add('epc_herbal_distillery', 'Learning & Occult', 'Copper Coils Cooled in Mountain Brook',
  'Monastic apothecaries refine clear aqua vitae infused with juniper, angelica, and gentian—creating an antiseptic tonic prized by surgeons and rich merchants alike.',
  'focus_learning', [
   C('Endow clean glass condensers and document medicinal dosing cleanly', 120, { focusXP: 28, research: 11, credit: 7 }, 'epc_distillery_fire'),
   C('Grant them modest cellar stills strictly for infirmary work', 55, { focusXP: 20, research: 6, piety: 5 }, 'epc_distillery_fire'),
   C('Tax strong spirits sternly at parish gates lest taverns grow unruly', 0, { gold: 75, focusXP: 10, stability: 4 })
  ]);
 add('epc_distillery_fire', 'Learning & Occult', 'Blue Flame Floating Over Porcelain',
  'During purity trials a dropped candle sets condensed spirit ablaze—nearly burning the herb-loft before novices smother flames with wet wool.',
  'followup', [
   C('Move stills into stone outbuildings beside cold running streams', 70, { research: 9, focusXP: 22, prestige: 5 }, 'epc_distillery_end'),
   C('Limit batches strictly to daylight hours under senior masters', 0, { focusXP: 14, stability: 5 }, 'epc_distillery_end')
  ]);
 add('epc_distillery_end', 'Learning & Occult', 'Green Glass Bottles Bound in Straw',
  'Camp surgeons carry sealed cordial flasks across marches while abbey infirmaries mend winter fevers cleanly.',
  'followup', [
   C('Supply royal army medical chests directly from the abbey', 65, { research: 8, focusXP: 18, legitimacy: 5 }),
   C('Leave the monks to quiet herb craft', 0, { piety: 7, stress: -5 })
  ]);

 // 106. Holy Fury — The Vassal Who Built a Shrine Above His Station (3 stages)
 add('epc_abbey_sanctuary', 'Politics', 'Gold Spires Outshining the Capital Chapel',
  'Flush with wool rents, an ambitious regional vassal raises an opulent collegiate shrine crowned with gilded angels—openly boasting his ancestor lies holier than yours.',
  'vassal', [
   C('Attend his dedication smiling, endow the high altar, and assert royal patronage', 135, { loyalty: 14, legitimacy: 8, piety: 8 }, 'epc_sanctuary_bell'),
   C('Audit his unchartered market tolls politely the morning after dedication', 40, { leverage: 16, gold: 80, loyalty: -6 }, 'epc_sanctuary_bell'),
   C('Ignore provincial peacockry and keep treasury coin in capital walls', 0, { stability: 4, prestige: -2 })
  ]);
 add('epc_sanctuary_bell', 'Politics', 'Incense Over Rival Coats of Arms',
  'Stone masons ask politely where to chisel the paramount donor shield above the west portal—beside the vassal’s hawk or beneath the royal crown.',
  'followup', [
   C('Place the royal shield paramount above paired subordinate lineage arms', 55, { legitimacy: 9, loyalty: 9, prestige: 7 }, 'epc_sanctuary_peace'),
   C('Let the vassal keep his portal modest while binding him to frontier defense', 0, { loyalty: 8, stability: 5 }, 'epc_sanctuary_peace')
  ]);
 add('epc_sanctuary_peace', 'Politics', 'One Canopy Over Both Houses',
  'Choir hymns float cleanly above shared heraldry—pride harnessed quietly to crown grandeur.',
  'followup', [
   C('Confirm the shrine’s modest alms exemptions', 45, { trust: 8, piety: 6 }),
   C('Ride homeward with loyal escorts', 0, { stability: 5, legitimacy: 4 })
  ]);

 // 107. Reaper’s Due — The Exhausted Vanguard’s Winter Billet (3 stages)
 add('epc_scarred_veterans', 'Military', 'Frostbitten Toes Wrapped in Burlap',
  'After six brutal weeks on muddy roads, your lead column limps into a walled borough with split boots, empty powder horns, and muttering serjeants.',
  'army_fatigue', [
   C('Buy out local cobblers’ leather, hot cider vats, and warm straw billets', 130, { fatigue: -22, morale: 12, supply: 14 }, 'epc_billet_hearth'),
   C('Quarter soldiers gently across burgher lofts with strict crown meal-tallies', 55, { fatigue: -14, supply: 10, morale: 6 }, 'epc_billet_hearth'),
   C('Order brief forty-eight-hour rest beside campfires and push forward', 0, { fatigue: -6, morale: -2, supply: 4 })
  ]);
 add('epc_billet_hearth', 'Military', 'Grease-Rubbed Boots Drying by Coals',
  'Warm wool socks and hot mutton stew work wonders—though drunken pikemen break two tavern shutters on the second night.',
  'followup', [
   C('Pay the tavern-keeper cleanly and drill offenders round the courtyard in frost', 45, { morale: 9, legitimacy: 7, fatigue: -6 }, 'epc_billet_march'),
   C('Post strict curfews at dusk and confine billets to inner barracks', 0, { fatigue: -8, stability: 5 }, 'epc_billet_march')
  ]);
 add('epc_billet_march', 'Military', 'Brisk Bugles at Crisp Dawn',
  'Re-shod, fed, and dry, the vanguard steps out along frozen ruts twice the force that stumbled in.',
  'followup', [
   C('Establish standing winter cobbler and ration depots on key roads', 75, { supply: 16, experience: 0.06 }),
   C('Sound the march cleanly', 0, { morale: 6, fatigue: -5 })
  ]);

 return out;
};
