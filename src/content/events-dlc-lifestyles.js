/**
 * Sovereign: 1450 — Deep Narrative & DLC Pack (3-4 Choices per Event, Zero Filler)
 * Covers Alchemist Immortality Quests, Hermetic Lodges, Secret Cults & Trials,
 * Crusades & Relics, Courtly Love/Rivalry/Duels, Plague Physicians, and Lifestyle Mastery.
 */
function buildDlcStories(E, C) {
 const out = [];
 const add = (id, cat, title, desc, trig, choices) => out.push(E(id, cat, title, desc, trig, choices));

 // === 1. ALCHEMIST IMMORTALITY & ELIXIR MULTI-STAGE ARC ===
 add('dlc_immortal_rumor', 'Occult & Learning', 'The Wandering Alchemist of Toledo',
  'A silver-bearded sage wrapped in soot-stained wool seeks private audience, claiming ancient Arab and Greek scrolls hold the secret to arresting mortal decay — if the crown funds rare cinnabar, mercury, and quiet furnaces.',
  'land', [
   C('Grant an undisclosed wing and 130g for furnaces', 130, { research: 10, prestige: 4, stress: 5 }, 'dlc_immortal_crucible'),
   C('Demand open demonstration before the Royal Physicians first', 55, { credit: 5, legitimacy: 4 }, 'dlc_immortal_trial'),
   C('Hand his heretical notebooks to abbey inquisitors', 0, { piety: 10, faithAuthority: 6, unrest: -2 }),
   C('Banish the charlatan before gossips mock the court', 0, { stability: 4, prestige: -2 })
  ]);

 add('dlc_immortal_crucible', 'Occult & Learning', 'Fumes of Mercury and Moon-Dew',
  'Three months into his labor, emerald smoke drifts across the garden tower. The sage insists one final distillation of pulverized pearls and alpine snow could produce a draft of golden vitality — or turn lethal.',
  'followup', [
   C('Purchase crushed pearls and rare glassware', 150, { research: 12, stress: 4 }, 'dlc_immortal_elixir'),
   C('Order cautious testing on stray hounds first', 60, { research: 5, legitimacy: 3 }, 'dlc_immortal_elixir'),
   C('Douse the dangerous alembics and seize the scholar’s journals', 0, { stability: 6, prestige: 3, research: 4 })
  ]);

 add('dlc_immortal_trial', 'Occult & Learning', 'Debate Before the Medical Guild',
  'Senior physicians interrogate the sage over silver bowls and Galenic charts. Surprisingly, his cures for winter gout confound three skeptics, leaving the assembly divided between awe and suspicion.',
  'followup', [
   C('Charter a discreet crown laboratory under dual oversight', 110, { research: 11, trust: 5 }, 'dlc_immortal_elixir'),
   C('Commission medicinal tonics for palace infirmaries instead', 70, { trust: 8, health: -15, development: 1 }),
   C('Thank the sage politely and seal his notes in archives', 0, { legitimacy: 5, prestige: 3 })
  ]);

 add('dlc_immortal_elixir', 'Occult & Learning', 'The Phial of Dawn’s Amber',
  'At midnight, the alchemist sets a glowing amber phial upon velvet. A single sip promises sharpened vigor; yet the palace chaplain warns from the doorway against tempting Providence.',
  'followup', [
   C('Drink deeply of the distilled elixir yourself', 50, { prestige: 15, legitimacy: 10, stress: -18, piety: -6 }),
   C('Share drops strictly as a restorative medicine for the realm', 80, { trust: 10, piety: 6, acceptance: 6, research: 8 }),
   C('Smash the vessel upon hearthstones and burn the formula', 0, { piety: 15, faithAuthority: 8, stability: 5 }),
   C('Lock the phial in royal vaults for future desperate hours', 25, { securityMonths: 10, prestige: 6 })
  ]);

 // === 2. HERMETIC ACADEMY & SECRET CULT ARC ===
 add('dlc_hermetic_cipher', 'Societies', 'Stars Painted Behind the Tapestry',
  'Court masons repairing an ancient library flue uncover copper astrolabe plates engraved with celestial covenants signed by forgotten royal councillors.',
  'research', [
   C('Reconvene learned astronomers to decipher the brass rings', 115, { research: 12, prestige: 6 }, 'dlc_hermetic_lodge'),
   C('Notify cathedral elders quietly to examine for heresy', 45, { piety: 8, faithAuthority: 6 }, 'dlc_cult_tribunal'),
   C('Melt down the pagan brass for royal cannon founders', 0, { gold: 75, morale: 4 }),
   C('Seal the alcove untouched behind oak paneling', 0, { stability: 4, stress: -3 })
  ]);

 add('dlc_hermetic_lodge', 'Societies', 'Midnight Conclave at the Tower',
  'Scholars gather at midnight with brass quadrants and olive-oil lamps. Debates quickly turn volatile over whether natural philosophy should circulate beyond noble circles.',
  'followup', [
   C('Publish translated star tables for navigators and merchants', 120, { research: 14, credit: 8, development: 1 }),
   C('Keep the Hermetic circle strictly sworn to the Crown', 80, { securityMonths: 12, legitimacy: 7, prestige: 6 }),
   C('Endow salaried chairs of mathematics inside cathedral schools', 100, { piety: 6, research: 9, trust: 6 })
  ]);

 add('dlc_cult_tribunal', 'Societies', 'The Secret Covenant of Ash',
  'Inquisitors raid a riverside granary cellar and seize masked initiates clutching dual-crested rings — several belonging to prominent tax bailiffs and border knights.',
  'followup', [
   C('Offer quiet pardon in exchange for naming higher patrons', 60, { securityMonths: 12, legitimacy: 6, unrest: -4 }),
   C('Stage an austere public trial and seize conspirators’ coin', 40, { gold: 140, faithAuthority: 10, unrest: 6 }),
   C('Dissolve proceedings quietly to spare loyal lineages scandal', 0, { stability: 6, trust: 4, piety: -4 })
  ]);

 // === 3. INQUISITION, WITCHCRAFT PANIC & MORAL CONSCIENCE ===
 add('dlc_witch_panic', 'Faith & Society', 'Mummers and Night-Fires in the Shire',
  'Bailiffs drag an elderly herb-wife and two village carters into court, accused by fearful neighbors of blighting sheep flocks with winter frost charms.',
  'unrest', [
   C('Send royal physicians to test pasture water and calm fear', 95, { unrest: -12, trust: 9, research: 5 }, 'dlc_witch_aftermath_reason'),
   C('Submit the suspects to diocesan judges under strict proof', 60, { faithAuthority: 8, piety: 6, stability: 3 }, 'dlc_witch_aftermath_law'),
   C('Fine the ringleaders of the mob for vigilante riot', 25, { legitimacy: 7, unrest: -6, gold: 45 }),
   C('Permit swift local punishments to placate frightened parishes', 0, { unrest: -5, trust: -8, piety: 4 })
  ]);

 add('dlc_witch_aftermath_reason', 'Faith & Society', 'Tainted Wells Beneath the Fold',
  'Apothecaries trace the livestock blight not to sorcery, but stagnant copper seepage beside ruined mine shafts above the village.',
  'followup', [
   C('Re-line village wells in cut stone at crown expense', 110, { development: 1, trust: 10, food: 45 }),
   C('Broadcast the findings from every parish pulpit', 35, { acceptance: 8, unrest: -8, research: 4 }),
   C('Collect customary land taxes without further outlay', 0, { gold: 55, trust: -3 })
  ]);

 add('dlc_witch_aftermath_law', 'Faith & Society', 'Evidence by Candlelight',
  'Cathedral assessors find no genuine maleficium — only bitter boundary jealousy over grazing commons between neighboring freeholders.',
  'followup', [
   C('Settle meadow boundaries formally and clear the accused', 75, { legitimacy: 8, trust: 8, acceptance: 6 }),
   C('Impose light church penance on all quarreling parties', 20, { piety: 7, stability: 5 }),
   C('Confiscate disputed pasturelands to the royal demesne', 0, { gold: 90, unrest: 5 })
  ]);

 // === 4. CRUSADES, PILGRIMAGE & HOLY RELICS ===
 add('dlc_relic_dispute', 'Religion', 'The Silver Casket From Beyond the Sea',
  'Returning veterans bear a battered silver reliquary claimed to hold a martyr’s bone — yet two rival cathedrals produce ancient charters demanding custody.',
  'land', [
   C('Enshrine the relic in the capital chapel with choral solemnity', 140, { piety: 14, prestige: 10, legitimacy: 7 }, 'dlc_relic_pilgrims'),
   C('Award custody to the border abbey to strengthen frontier faith', 85, { trust: 10, unrest: -8, piety: 8 }, 'dlc_relic_pilgrims'),
   C('Submit the seals to learned abbots for scholarly authentication', 50, { research: 7, faithAuthority: 6 }),
   C('Sell exhibition charters to pious merchant confraternities', 0, { gold: 130, piety: -6, credit: 5 })
  ]);

 add('dlc_relic_pilgrims', 'Religion', 'Crowds Along the Pilgrim Causeway',
  'Word of miracles draws thousands of barefoot travelers. Innkeepers prosper, though marshals warn overloaded ferries and pickpockets breed chaos near shrine gates.',
  'followup', [
   C('Build stone pilgrim hostels and patrol road bridges', 115, { development: 1, trust: 10, piety: 8 }),
   C('Levy a modest bridge toll to enrich crown almshouses', 35, { gold: 110, piety: 4, unrest: -2 }),
   C('Order mendicant friars to disperse excessive crowds calmly', 0, { stability: 6, faithAuthority: 4 })
  ]);

 add('dlc_antipope_envoys', 'Religion', 'Two Seals claiming Apostolic Right',
  'Envoys from rival clerical factions arrive within the same week, each brandishing anathemas against the other and promising generous tithe exemptions for royal recognition.',
  'faith_christian', [
   C('Summon a national synod of bishops to weigh canon precedent', 120, { faithAuthority: 10, legitimacy: 8, stability: 4 }, 'dlc_synod_verdict'),
   C('Back the reformist legate in return for reduced church dues', 60, { gold: 150, piety: -4, credit: 6 }),
   C('Declare royal neutrality while guarding domestic abbey autonomy', 40, { acceptance: 8, trust: 6, prestige: 4 }),
   C('Pledge devout obedience to the established see outright', 90, { piety: 14, faithAuthority: 9 })
  ]);

 add('dlc_synod_verdict', 'Religion', 'Canons Drafted Under Lanterns',
  'After ten days of Latin disputation, the prelates deliver a pragmatic concordat preserving domestic clerical courts while mending external ties.',
  'followup', [
   C('Sign the Pragmatic Concordat with grand cathedral bells', 75, { legitimacy: 10, faithAuthority: 10, stability: 6 }),
   C('Reserve crown veto over major bishopric appointments', 40, { legitimacy: 8, piety: -3, credit: 5 }),
   C('Publish the assembly decrees without ceremony', 0, { stability: 4, trust: 4 })
  ]);

 // === 5. COURTLY LOVE, RIVALRY, DUELS & BANQUETS ===
 add('dlc_winter_masque', 'Court & Romance', 'Velvet Masks at the Solstice Masque',
  'Lantern-lit barges glide below palace balustrades as disguised nobles whisper epigrams, marriage rumors, and sharp political jabs behind painted silk.',
  'courtFriend', [
   C('Toast loyal companions and stage a grand tournament pageant', 125, { prestige: 11, opinion: 14, stress: -10 }, 'dlc_masque_afterglow'),
   C('Slip quietly into an alcove for frank political alliances', 45, { securityMonths: 8, stability: 5, opinion: 8 }),
   C('Call minstrels to soothe tense courtiers with polyphony', 70, { stress: -12, trust: 4, prestige: 5 }),
   C('End revelry early to inspect morning treasury rosters', 0, { gold: 50, stress: 5, opinion: -5 })
  ]);

 add('dlc_masque_afterglow', 'Court & Romance', 'Morning After the Lanterns',
  'Gilded confetti still dusts the courtyard cobbles when heralds deliver sealed tokens of gratitude — alongside one sharp challenge from a slighted knight.',
  'followup', [
   C('Host breakfast reconciliations to cement newfound friendships', 55, { opinion: 10, stability: 6, stress: -5 }),
   C('Settle the knight’s slight with honorable royal arbitration', 30, { legitimacy: 6, prestige: 5 }),
   C('Return swiftly to council dispatches', 0, { stability: 3 })
  ]);

 add('dlc_gloves_at_dawn', 'Court & Romance', 'Iron Gauntlets Upon the Stair',
  'Two proud commanders have exchanged bitter insults over last autumn’s retreat, demanding royal leave for a duel of honor with sharp swords by misty willow banks.',
  'courtRival', [
   C('Preside strictly over blunted tournament combat to settle pride', 85, { morale: 7, prestige: 8, stability: 4 }, 'dlc_duel_verdict'),
   C('Forbid private bloodshed and assign both to joint frontier watch', 40, { legitimacy: 8, morale: 4, opinion: -6 }),
   C('Champion your ally’s honor publicly in open hall', 60, { prestige: 9, opinion: -12, loyalty: 5 }),
   C('Levy steep peace-bonds from both hotheaded houses', 0, { gold: 110, unrest: -3, opinion: -5 })
  ]);

 add('dlc_duel_verdict', 'Court & Romance', 'Clatter of Steel on Frost',
  'Three clean passes leave both men breathless, bruised, and bound by chivalric witnesses to drop further vendettas.',
  'followup', [
   C('Wine both rivals at the royal table afterward', 50, { opinion: 10, morale: 6, stability: 5 }),
   C('Award a silver spur to the swifter blade', 35, { prestige: 7, morale: 5 }),
   C('Dismiss retainers back to border garrisons', 0, { stability: 3 })
  ]);

 // === 6. BLACK PESTILENCE, QUARANTINE & PHYSICIANS ===
 add('dlc_quarantine_gates', 'Health & Realm', 'Rattles & Vinegar at the Harbor Gate',
  'Spotted sailors stumble from an inbound salt barge. Guild elders beg the crown not to halt market fairs, while apothecaries plead for immediate forty-day quarantine.',
  'land', [
   C('Enforce strict forty-day quarantine and pay stranded crews', 135, { trust: 10, stability: 7, health: -20 }, 'dlc_quarantine_report'),
   C('Seal only the harbor quarter and burn tar braziers nightly', 75, { unrest: -4, trust: 4, development: 0 }, 'dlc_quarantine_report'),
   C('Keep market gates open under brisk customs inspections', 0, { gold: 95, credit: 5, unrest: 6 }),
   C('Withdraw the royal court cleanly to upland hunting lodges', 90, { stress: -10, prestige: -4, trust: -5 })
  ]);

 add('dlc_quarantine_report', 'Health & Realm', 'Smoke Clears Above the Wharves',
  'Forty days pass without fever reaching upland parishes. Mariners cheer from ship rails as harbor bells finally announce clean bills of health.',
  'followup', [
   C('Charter permanent port infirmaries from customs dues', 110, { development: 1, credit: 8, trust: 9 }),
   C('Thank parish surgeons and reopen autumn trade fairs', 40, { gold: 65, stability: 5, prestige: 6 }),
   C('Tighten permanent maritime manifests against contraband', 25, { securityMonths: 8, credit: 5 })
  ]);

 // === 7. DEEP BESPOKE LIFESTYLE EVENTS (NO GENERIC "Reflection:" BOILERPLATE) ===
 const lifestyleEvents = [
  ['dlc_dip_silver_tongue', 'Lifestyle', 'Treaty Drafted Over Malmsey',
   'Foreign delegates deadlock over three adjectives in an anchorage clause while courtiers grow restless.',
   'focus_diplomacy',
   [
    C('Host an informal candlelit supper and craft graceful compromises', 85, { focusXP: 24, prestige: 7, stress: -4 }, 'dlc_dip_silver_tongue_fol'),
    C('Cite centuries of maritime precedent firmly in open audience', 40, { focusXP: 16, legitimacy: 6 }),
    C('Offer bilateral tariff concessions to thaw frozen pride', 110, { focusXP: 22, credit: 8, trust: 4 }),
    C('Adjourn talks until ambassadors consult home principals', 0, { focusXP: 8, stability: 3 })
   ],
   'dlc_dip_silver_tongue_fol', 'The Embossed Parchment Compact',
   'Secretaries stitch silk cords through wax seals as envoys praise your court’s diplomatic poise across three capitals.',
   [
    C('Send illustrated treaty copies to allied courts', 45, { prestige: 8, legitimacy: 5 }),
    C('Translate terms into local vernaculars for merchants', 25, { credit: 6, trust: 5 }),
    C('Retire quietly to study tomorrow’s dispatches', 0, { stress: -5 })
   ]
  ],
  ['dlc_mar_siege_trench', 'Lifestyle', 'Mud, Fascines & Siegecraft',
   'Engineers test angled gabion baskets and sloping sapper trenches on damp training slopes outside capital walls.',
   'focus_martial',
   [
    C('Lead a mock night assault through slick rainwater ditches yourself', 90, { focusXP: 25, morale: 8, prestige: 6 }, 'dlc_mar_siege_trench_fol'),
    C('Endow salaried artillery carpenters and oak gabion yards', 120, { focusXP: 22, development: 1, experience: 0.08 }),
    C('Drill pikemen in tight square counters against flanking horse', 45, { focusXP: 16, morale: 6 }),
    C('Review written diagrams by hearthfire with field marshals', 0, { focusXP: 10, stress: -3 })
   ],
   'dlc_mar_siege_trench_fol', 'Veterans Praise the New Manual',
   'Serjeants chalk angle diagrams across tavern benches, sharpening siege readiness throughout every provincial garrison.',
   [
    C('Publish illustrated drill manuals for shire captains', 50, { morale: 7, research: 5 }),
    C('Award double salt rations to top sapper companies', 35, { trust: 6, morale: 5 }),
    C('Fold exercises back into autumn musters', 0, { stability: 3 })
   ]
  ],
  ['dlc_stw_mint_assay', 'Lifestyle', 'Fire-Assay at the Royal Mint',
   'Mint wardens heat silver clippings in bone-ash cupels, revealing subtle debasement creeping through border markets.',
   'focus_stewardship',
   [
    C('Recall clipped coin quietly at fair crown exchange rates', 125, { focusXP: 24, inflation: -3, credit: 10 }, 'dlc_stw_mint_assay_fol'),
    C('Standardize milled silver dies and double smelter audits', 85, { focusXP: 20, credit: 7, securityMonths: 8 }),
    C('Impose steep fines on fraudulent moneychangers', 20, { focusXP: 14, gold: 105, unrest: 3 }),
    C('Accept current circulation to spare merchant panic', 0, { focusXP: 7, inflation: 1, stability: 2 })
   ],
   'dlc_stw_mint_assay_fol', 'Clear Ring of True Silver',
   'Bankers in three port towns weigh newly stamped groats with quiet relief, easing royal borrowing rates.',
   [
    C('Charter a permanent Treasury Board of Weights & Coin', 60, { credit: 9, development: 1 }),
    C('Send assayers to provincial fair towns', 35, { trust: 6, credit: 5 }),
    C('Seal the mint ledger under treasury locks', 0, { legitimacy: 4 })
   ]
  ],
  ['dlc_int_cipher_wheel', 'Lifestyle', 'Double-Ringed Brass Ciphers',
   'A Venetian clockmaker demonstrates nested rotating brass alphabets capable of scrambling field dispatches cleanly on horseback.',
   'focus_intrigue',
   [
    C('Retain him exclusively and issue wheels to frontier couriers', 110, { focusXP: 24, securityMonths: 12 }, 'dlc_int_cipher_wheel_fol'),
    C('Test his cipher secretly against captured hostile mail', 55, { focusXP: 20, research: 6, securityMonths: 8 }),
    C('Purchase two prototype dials for inner-cabinet eyes alone', 35, { focusXP: 14, prestige: 4 }),
    C('Dismiss mechanical curiosities in favor of trusted riders', 0, { focusXP: 8, loyalty: 3 })
   ],
   'dlc_int_cipher_wheel_fol', 'Secrets Sealed in Clockwork',
   'Intercepted foreign copies reveal rival clerks spending weeks baffled by your rotating key shifts.',
   [
    C('Train six bilingual chancery cryptographers', 50, { securityMonths: 10, research: 6 }),
    C('Keep cipher tables strictly memorized by sworn clerks', 20, { stability: 4, legitimacy: 4 }),
    C('Reward the clockmaker and dismiss curiosity-seekers', 0, { stress: -4 })
   ]
  ],
  ['dlc_lrn_botanical_herbarium', 'Lifestyle', 'Pressed Leaves From Three Continents',
   'Apothecaries and caravan botanists gather around long oak tables pressing unknown roots, indigo pods, and fever-bark.',
   'focus_learning',
   [
    C('Endow a walled Royal Physic Garden with glassed cold-frames', 120, { focusXP: 25, research: 11, development: 1 }, 'dlc_lrn_botanical_fol'),
    C('Compile a vernacular herbal for parish midwives and surgeons', 75, { focusXP: 20, trust: 9, health: -10 }),
    C('Dispatch botanists alongside spice merchants for rarer seeds', 90, { focusXP: 22, credit: 7, prestige: 5 }),
    C('Catalog dried specimens inside palace cabinets cleanly', 0, { focusXP: 10, prestige: 3 })
   ],
   'dlc_lrn_botanical_fol', 'Green Shoots Through Frost',
   'Patients recover swiftly from winter coughs as apothecaries share tested tinctures across market towns.',
   [
    C('Open botanical lectures to apprentice surgeons', 45, { research: 8, trust: 6 }),
    C('Trade surplus medicinal roots for foreign gold', 0, { gold: 80, credit: 5 }),
    C('Tend the quiet cloister beds personally at dusk', 0, { stress: -10 })
   ]
  ],
  ['dlc_bloodline_monument', 'Lifestyle', 'Granite Plinth in the Cathedral Close',
   'Master sculptors unveil wax maquettes commemorating your lineage’s defining trials for generations yet to come.',
   'land',
   [
    C('Carve heroic reliefs flanked by provincial shields', 135, { prestige: 14, legitimacy: 9 }, 'dlc_bloodline_monument_fol'),
    C('Raise a functional civic fountain & almshouse bearing your arms', 120, { trust: 11, development: 1, piety: 7 }),
    C('Commission modest memorial tablets alongside ancestral graves', 45, { piety: 7, legitimacy: 4 }),
    C('Defer stone monuments while frontier walls need mortar', 0, { morale: 5, gold: 35 })
   ],
   'dlc_bloodline_monument_fol', 'Voices Beneath the Unveiled Arches',
   'Townsfolk, guild masters, and poets gather below polished granite to debate the reign’s rising legacy.',
   [
    C('Strike silver commemorative medals for civic elders', 50, { trust: 7, prestige: 6 }),
    C('Open granary distributions beside the square', 40, { unrest: -7, piety: 5 }),
    C('Receive blessings quietly and return to court', 0, { stress: -4 })
   ]
  ],
  ['dlc_chivalry_tournament', 'Military & Chivalry', 'Banners Along the River Meadow',
   'Heralds pitch silk pavilions outside the capital gate as ambitious young nobles clamor to win royal favor upon the jousting tilt.',
   'gov_feudal',
   [
    C('Sponsor lavish royal prizes and three days of feasting', 135, { prestige: 12, morale: 9, loyalty: 7 }, 'dlc_chivalry_tourney_fol'),
    C('Convert lists into practical cavalry formation drills', 80, { morale: 10, experience: 0.08 }),
    C('Preside purely as honorable arbiter of chivalric law', 35, { legitimacy: 8, stability: 5 }),
    C('Restrict jousts cleanly to reduce shattered lances and debt', 0, { gold: 40, stress: -4 })
   ],
   'dlc_chivalry_tourney_fol', 'Broken Lances and Sworn Oaths',
   'Young knights ride home bearing bruised ribs, gilded favors, and fresh confidence in royal leadership.',
   [
    C('Admit tournament champions to the household guard', 55, { morale: 7, securityMonths: 6 }),
    C('Reward crippled warhorses with pensioned abbey meadows', 25, { piety: 5, prestige: 4 }),
    C('Close the lists cleanly before dusk', 0, { stability: 3 })
   ]
  ],
  ['dlc_sultan_prince_governor', 'Succession & Statecraft', 'A Young Prince’s Border Command',
   'Viziers propose entrusting a spirited royal heir with a turbulent frontier province to prove statesmanship — though rivals fear either failure or impatience.',
   'gov_sultanate',
   [
    C('Dispatch the prince with veteran household tutors and gold', 125, { legitimacy: 9, morale: 7, education: 8 }, 'dlc_sultan_prince_fol'),
    C('Keep the prince close to the Imperial Divan and treasury desks', 45, { stability: 6, legitimacy: 5, securityMonths: 6 }),
    C('Pair rival dynastic cousins in joint administrative inspections', 70, { loyalty: 8, credit: 5 }),
    C('Assign cautious elder governors instead of untried youth', 0, { stability: 5, trust: 3 })
   ],
   'dlc_sultan_prince_fol', 'Dispatches From the Frontier Divan',
   'Couriers bring tax tallies and muster scrolls sealed in the young governor’s neat hand.',
   [
    C('Praise provincial fairness and confirm their seal', 40, { legitimacy: 8, loyalty: 6 }),
    C('Audit garrison rosters briskly from the capital', 25, { securityMonths: 8, credit: 4 }),
    C('Send paternal counsel and gilded robes', 0, { prestige: 5 })
   ]
  ]
 ];

 for (const [id, cat, title, desc, trig, choices, folId, folTitle, folDesc, folChoices] of lifestyleEvents) {
  add(id, cat, title, desc, trig, choices);
  add(folId, cat, folTitle, folDesc, 'followup', folChoices);
 }

 // === 8. DEEP THEMATIC SCENES WITH 3 CHOICES & DISTINCT NON-BOILERPLATE FOLLOWUPS ===
 const deepVignettes = [
  ['dlc_conclave_whisper', 'Intrigue & Court', 'Cold Wine in the Privy Gallery', 'Three senior ministers linger after vespers speaking softly of succession rumors and unpaid muster bills.', 'councillor',
   [C('Invite frank grievances openly beside the hearth', 55, { loyalty: 9, opinion: 8, stability: 4 }, 'dlc_conclave_fol'),
    C('Place loyal household clerks at every treasury lock', 75, { securityMonths: 10, legitimacy: 5 }),
    C('Send them home cleanly with silver tokens and firm smiles', 20, { opinion: 4, stress: -3 })],
   'dlc_conclave_fol', 'Tensions Eased Behind Council Doors', 'Ministers return to morning deliberations aligned behind clear royal priorities.',
   [C('Ratify shared provincial reform decrees', 40, { stability: 6, trust: 5 }), C('Record agreed minutes cleanly', 0, { legitimacy: 4 }), C('Reward faithful secretaries', 15, { opinion: 5 })]],

  ['dlc_monastic_scriptorium', 'Faith & Learning', 'Gold Leaf in the Cloister', 'Abbey copyists rescue water-stained classical histories from rotting cellar chests, begging parchment and lapis ink.', 'institution',
   [C('Underwrite an illuminated royal compendium', 110, { research: 10, piety: 9, prestige: 6 }, 'dlc_scriptorium_fol'),
    C('Convert spare vellum strictly to parish law digests', 65, { legitimacy: 7, trust: 7 }),
    C('Order monks to copy prayers rather than pagan rhetoric', 0, { faithAuthority: 7, piety: 6 })],
   'dlc_scriptorium_fol', 'Completed Codex Laid Upon the Altar', 'Velvet-bound volumes draw admiring scholars from across neighboring dioceses.',
   [C('Endow permanent abbey scriptorium stipends', 45, { research: 8, piety: 6 }), C('Lend copies politely to cathedral schools', 20, { trust: 5, acceptance: 4 }), C('Lock the master codex in royal treasury', 0, { prestige: 5 })]],

  ['dlc_silk_embassy', 'Diplomacy & Prestige', 'Brocade and Porcelain From Afar', 'Envoys bearing lacquered boxes and jade seals seek tariff parity and safe hostelries for overland spice merchants.', 'trade',
   [C('Open tax-free diplomatic bazaars inside capital walls', 115, { credit: 10, acceptance: 9, prestige: 7 }, 'dlc_silk_embassy_fol'),
    C('Negotiate balanced reciprocal customs stamps', 55, { credit: 7, gold: 45, stability: 4 }),
    C('Confine foreign traders cleanly to guarded river wharves', 0, { securityMonths: 8, loyalty: 4 })],
   'dlc_silk_embassy_fol', 'Caravans Unpack Below Palace Walls', 'Fine tea, rhubarb root, and silk thread lower domestic prices while customs collectors smile.',
   [C('Charter a permanent guild of multilingual interpreters', 50, { credit: 8, research: 5 }), C('Collect crisp seasonal stamp duties', 0, { gold: 95 }), C('Host farewell banquets for departing factors', 30, { prestige: 6, acceptance: 5 })]],

  ['dlc_republic_canal_strike', 'Republic & Trade', 'Barge Guilds Block the Custom Quay', 'Lightermen chain iron barges across harbor mouths, protesting newly raised mooring tolls on salt and wool.', 'gov_republic',
   [C('Arbitrate fair quay fees with both syndics and captains', 85, { credit: 9, unrest: -9, trust: 8 }, 'dlc_canal_strike_fol'),
    C('Hire armed escort galleys to break chains at dawn', 65, { morale: 5, unrest: 6, legitimacy: 6 }),
    C('Temporarily suspend harbor duties until harvest freight clears', 0, { gold: -35, credit: 5, stability: 5 })],
   'dlc_canal_strike_fol', 'Oars Dip Again at Harbor Bell', 'Cleared channels set sixty laden cogs drifting smoothly back toward Baltic and Levant sea lanes.',
   [C('Standardize permanent posted wharf rates in brass', 45, { credit: 8, development: 1 }), C('Compensate punctual skippers modestly', 25, { trust: 6 }), C('Post watchmen at custom sluices', 0, { securityMonths: 6 })]],

  ['dlc_nomad_wolf_omen', 'Steppe & Clans', 'White Wolf Above the Winter Camp', 'Horsemen mutter excitedly as a pale steppe wolf stalks snowdrifts outside the khan’s felt pavilion ahead of spring raiding.', 'gov_steppe',
   [C('Feast clan noyans and proclaim a blessed sky-banner muster', 95, { morale: 11, loyalty: 10, prestige: 8 }, 'dlc_nomad_wolf_fol'),
    C('Scatter grain and salted mutton for outlying poor tents', 65, { trust: 9, food: 25, loyalty: 6 }),
    C('Order horse-archers sharply back to bowyers and remount drills', 0, { morale: 6, experience: 0.05 })],
   'dlc_nomad_wolf_fol', 'Hooves Thunder Across Thawing Grass', 'Freshly greased composite bows and eager clan banners assemble cleanly along the river ford.',
   [C('Bless banners with shamans and elder poets', 35, { piety: 7, morale: 6 }), C('Dispatch swift outriders to scout grazing pastures', 20, { supply: 10, food: 35 }), C('Hold strict march discipline', 0, { stability: 4 })]],

  ['dlc_shogun_tea_tea', 'Shogunate & Honor', 'Cracked Tea Bowl in Kyoto', 'Two rival daimyo freeze over a priceless celadon bowl dropped accidentally by an anxious page during winter peace talks.', 'gov_shogunate',
   [C('Mend the bowl with powdered gold — praising scars of loyalty', 90, { prestige: 10, loyalty: 11, stress: -7 }, 'dlc_shogun_tea_fol'),
    C('Quietly gift both houses matching master blades', 120, { loyalty: 12, morale: 6 }),
    C('Dismiss the page sternly while upholding strict court etiquette', 0, { legitimacy: 6, stability: 4, opinion: -4 })],
   'dlc_shogun_tea_fol', 'Gold-Laced Celadon Admired by Retainers', 'Kintsugi seams become the talk of provincial castles, softening rigid clan pride across the hall.',
   [C('Retain the artisan as salaried castle lacquerer', 45, { prestige: 7, development: 1 }), C('Exchange quiet poem scrolls with vassal houses', 15, { loyalty: 6, stress: -4 }), C('Return to military inspection rosters', 0, { morale: 4 })]]
 ];

 for (const [id, cat, title, desc, trig, ch, fid, ftitle, fdesc, fch] of deepVignettes) {
  add(id, cat, title, desc, trig, ch);
  add(fid, cat, ftitle, fdesc, 'followup', fch);
 }

 return out;
}

export function dlcLifestyleEvents(E, C) {
 return buildDlcStories(E, C);
}
