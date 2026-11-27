/**
 * Sovereign: 1450 — Flagship CK2 + All-DLC World & Court Pack
 * Covers Conclave (Council Favors, Regents, Childhood Guardians),
 * Way of Life (Carousing, Hunts, Theology, Seduction, Intrigue, Business),
 * The Republic (Patrician Feuds & Trade Posts), Horse Lords (Kurultai & Clans),
 * Jade Dragon (Imperial Kowtow & Silk Road), Sword of Islam (Furusiyya & Sufis),
 * and Rajas of India (Festival of Lights, Gurus & Temple Tanks).
 */
export const ck2WorldCourtEvents = (E, C) => {
 const out = [];
 const add = (id, cat, title, desc, trig, choices) => out.push(E(id, cat, title, desc, trig, choices));

 // =========================================================================
 // CONCLAVE — COUNCIL FAVORS, REGENCY AMBITIONS & GUARDIAN DEBATES
 // =========================================================================

 // 1. Council Favor — The Bribed Vote on War Levies (4 stages)
 add('ckw_council_favor', 'Court', 'A Crimson Favor Inside the Privy Door',
  'Before the morning muster vote, your Marshal slides an ivory tally-chit across the velvet table, reminding you smoothly that your house still owes him a royal favor from last autumn’s tax roll.',
  'councillor', [
   C('Honor the favor cleanly and grant him the frontier toll-farm he craves', 90, { opinion: 18, stability: 5, credit: -3 }, 'ckw_favor_whisper'),
   C('Buy out his ivory chit with a lump purse of silver before the clerk arrives', 145, { opinion: 10, legitimacy: 6 }, 'ckw_favor_whisper'),
   C('Snap the chit in council and dare him to vote against the banner', 0, { legitimacy: 8, opinion: -18, stress: 6 }, 'ckw_favor_backlash')
  ]);
 add('ckw_favor_whisper', 'Court', 'Other Chairs Watching the Scale',
  'Two lesser councillors lean together beside the hearth; if favors purchase lucrative toll-farms, every signature in the chamber suddenly carries an unspoken price.',
  'followup', [
   C('Publish clear salaried stipends so office fees replace private favors', 110, { credit: 8, legitimacy: 8, stability: 5 }, 'ckw_favor_audit'),
   C('Quietly slip matching hunting leases to the restless juniors', 75, { opinion: 12, stability: 4 }, 'ckw_favor_audit'),
   C('End the meeting early and let jealousy cool on its own', 0, { stress: 3, stability: 3 }, 'ckw_favor_audit')
  ]);
 add('ckw_favor_backlash', 'Court', 'Empty Inkwells at the Muster Table',
  'Your Marshal folds his arms in stony silence; half the chamber suddenly finds urgent coughs or unreadable clauses in the levy writ.',
  'followup', [
   C('Invite the offended lords to private wine and mend bruised honor', 85, { opinion: 16, stability: 6, stress: -4 }, 'ckw_favor_audit'),
   C('Sign the writ under bare royal prerogative and bypass the balking chairs', 0, { legitimacy: 7, prestige: 5, opinion: -10 }, 'ckw_favor_audit')
  ]);
 add('ckw_favor_audit', 'Court', 'Minutes Entered in Bold Hand',
  'Whether bought with silver, smoothed with wine, or forced by crown steel, the privy roll closes—leaving every councillor keenly aware who holds the pen.',
  'followup', [
   C('Keep secret tallies of every councillor’s private patrons', 55, { securityMonths: 9, legitimacy: 6 }),
   C('Lock the council chest and adjourn for vespers', 0, { stability: 5, stress: -3 })
  ]);

 // 2. Empowered Council — The Discontented Conclave Strike (3 stages)
 add('ckw_conclave_strike', 'Politics', 'Four Empty Velvet Chairs',
  'Protesting unconsulted frontier treaties, four great magnates skip the morning council altogether and gather noisily inside the cathedral cloister across the square.',
  'libertyFaction', [
   C('Cross the square personally with two clerks to hear their articles openly', 65, { factionPressure: -22, factionLoyalty: 9, legitimacy: 5 }, 'ckw_strike_articles'),
   C('Send armed bailiffs to summon them under pain of contumacy fines', 25, { legitimacy: 8, factionPressure: -10, factionLoyalty: -6 }, 'ckw_strike_articles'),
   C('Convene compliant minor stewards and transact crown business without them', 0, { stability: -3, factionPressure: 6, prestige: 4 })
  ]);
 add('ckw_strike_articles', 'Politics', 'Six Clauses on Parchment',
  'The magnates lay down demands: quarterly council audits, noble immunity from sudden arrest, and prior consent before foreign subsidies.',
  'followup', [
   C('Confirm fair due-process courts while guarding crown diplomatic prerogative', 90, { factionPressure: -20, legitimacy: 8, stability: 6 }, 'ckw_strike_pact'),
   C('Offer generous seasonal tax rebates to split moderate barons from hotheads', 125, { factionLoyalty: 12, factionPressure: -18 }, 'ckw_strike_pact'),
   C('Reject every clause flatly and adjourn the session', 0, { prestige: 6, factionPressure: 5, stability: -2 })
  ]);
 add('ckw_strike_pact', 'Politics', 'Velvet Chairs Filled Again',
  'By Friday spurs clink once more along the privy gallery; factions whisper quieter when the crown listens without kneeling.',
  'followup', [
   C('Record the balanced charter in triplicate across realm courts', 50, { legitimacy: 9, factionPressure: -10 }),
   C('Return swiftly to overdue realm ledgers', 0, { credit: 5, stability: 4 })
  ]);

 // 3. Childhood Focus — The Rowdy Ward’s Broken Nose (3 stages)
 add('ckw_ward_rowdy', 'Family', 'A Muddy Tunic in the Solar',
  'Your ward’s guardian drags the boy in by one ear—mud-streaked, nursing a bleeding nose after tackling the master-at-arms’ nephew into the fishpond over a wager.',
  'wardGuardian', [
   C('Channel the fierce energy into disciplined horsemanship and fencing tutors', 95, { education: 14, opinion: 10 }, 'ckw_ward_temper'),
   C('Keep him indoors copying Caesar’s Commentaries until his knuckles ache', 35, { education: 10, opinion: -6 }, 'ckw_ward_temper'),
   C('Laugh it off as princely spirit and toss both boys a honey cake', 0, { opinion: 8, education: 3, stress: -3 })
  ]);
 add('ckw_ward_temper', 'Family', 'Wooden Wasters Against Oak Shields',
  'Two months on, the guardian reports the child now knocks older pages flat—yet loses his temper whenever beaten at chess or Latin syntax.',
  'followup', [
   C('Hire a gentle veteran knight who teaches patience alongside sword-work', 80, { education: 14, opinion: 12, stress: -3 }, 'ckw_ward_growth'),
   C('Match him against sharp-tongued debate masters to teach self-command', 0, { education: 10, opinion: 5 }, 'ckw_ward_growth')
  ]);
 add('ckw_ward_growth', 'Family', 'Steel Tempered Slowly',
  'By winter solstice the child stands straighter at salute, fire still bright behind his eyes—yet harnessed to purpose instead of tantrums.',
  'followup', [
   C('Present a fitted steel dagger at the winter feast', 60, { education: 12, prestige: 6, opinion: 8 }),
   C('Praise the guardian’s steady hand in hall', 0, { opinion: 8, stability: 4 })
  ]);

 // 4. Childhood Focus — The Brooding / Curious Scholar-Child (3 stages)
 add('ckw_ward_curious', 'Family', 'Dissected Beetles on the Tapestry Table',
  'Court ladies shriek when your young ward spreads pressed herbs, beetle wings, and an astrolabe diagram across fine Flemish linen, insisting tutors explain why stars never fall.',
  'child', [
   C('Buy the child proper brass lenses, clean herbariums, and Greek tutors', 115, { education: 16, research: 8 }, 'ckw_curious_tower'),
   C('Steer bright curiosity gently toward statecraft maps and treasury tallies', 60, { education: 12, credit: 4 }, 'ckw_curious_tower'),
   C('Send the messy jars to the scullery and insist on proper prayer-books', 0, { piety: 5, education: 4, stress: 3 })
  ]);
 add('ckw_curious_tower', 'Family', 'Questions Without End at Bedtime',
  'The abbey schoolmaster warns the youngster peppers visiting monks with awkward riddles about eclipses and flood fossils, leaving greybeards blushing.',
  'followup', [
   C('Encourage fearless inquiry while teaching diplomatic tact toward elders', 50, { education: 14, research: 6, legitimacy: 4 }, 'ckw_curious_bloom'),
   C('Let the child shadow senior mint-assayers and glassblowers', 0, { education: 12, credit: 6, research: 5 }, 'ckw_curious_bloom')
  ]);
 add('ckw_curious_bloom', 'Family', 'Ink-Stained Fingers, Sharp Eyes',
  'Rather than yawning over court ceremony, the young dynast fills margins with bridge sketches and star-tables.',
  'followup', [
   C('Dedicate a bright sunlit study room beside the royal library', 70, { education: 14, research: 7 }),
   C('Reward quiet diligence with rare illuminated travelogues', 0, { education: 8, prestige: 4 })
  ]);

 // 5. Regency Council — The Ambitious Regent’s Nephew (3 stages)
 add('ckw_regent_nephew', 'Succession', 'New Coats of Arms on Gatehouse Stones',
  'During a delicate regency, watchful kitchen stewards notice masons chiseling your regent’s family crest beside—and slightly above—the royal shield on a newly repaired gate.',
  'regency', [
   C('Send royal heralds immediately to chisel down the presumptuous shield', 30, { legitimacy: 9, stability: 4, stress: 5 }, 'ckw_regent_reckoning'),
   C('Demand the regent pay for matching gilded royal banners across the gatehouse', 75, { legitimacy: 8, prestige: 7 }, 'ckw_regent_reckoning'),
   C('Pretend not to notice stone vanity while silently watching treasury keys', 0, { securityMonths: 8, stress: 6 })
  ]);
 add('ckw_regent_reckoning', 'Succession', 'Cold Tea in the Gatehouse Loft',
  'Caught red-handed, the regent blames overeager country masons—yet his smooth-faced nephew already commands half the palace courtyard watch.',
  'followup', [
   C('Rotate the nephew politely to a distant coastal customs post with full pay', 85, { securityMonths: 10, legitimacy: 8, stability: 5 }, 'ckw_regent_settle'),
   C('Keep the watch loyal by doubling palace serjeants’ winter rations', 0, { food: -25, legitimacy: 7, securityMonths: 7 }, 'ckw_regent_settle')
  ]);
 add('ckw_regent_settle', 'Succession', 'Chiseled Clean Before Frost',
  'A lone royal crest catches morning frost above the portcullis; whispered bets in the guardroom tilt firmly back toward the crown.',
  'followup', [
   C('Require monthly sealed watch-oaths from gate captains', 40, { securityMonths: 9, legitimacy: 6 }),
   C('Leave the gatehouse watch under steady rotation', 0, { stability: 5 })
  ]);

 // 6. Conclave — The Honest Chancellor’s Resignation Threat (3 stages)
 add('ckw_chancellor_quill', 'Court', 'Silver Inkhorn Set Down Slowly',
  'Your sharpest diplomat sets his seal-ring beside the candle, declaring he cannot in conscience draft another hollow border treaty while hawks prepare winter raids behind his back.',
  'councillor', [
   C('Confide the true border plan honestly and win his skilled pen back', 40, { opinion: 18, legitimacy: 7, securityMonths: 6 }, 'ckw_chancellor_draft'),
   C('Offer him a prestigious bishopric or frontier embassy to save face cleanly', 110, { prestige: 7, opinion: 10, stability: 5 }, 'ckw_chancellor_draft'),
   C('Accept his ring coldly; clerks who question royal policy have short careers', 0, { legitimacy: 6, opinion: -18, stress: 5 })
  ]);
 add('ckw_chancellor_draft', 'Court', 'Late Candlelight Over Border Maps',
  'Studying frontier passes beside cold mutton, the veteran minister sketches a smarter diplomatic clause that buys six months of quiet without bluster.',
  'followup', [
   C('Adopt his balanced draft and empower him to lead the frontier embassy', 75, { prestige: 9, opinion: 14, stability: 6 }, 'ckw_chancellor_end'),
   C('Keep the clean phrasing while retaining tight crown oversight', 0, { legitimacy: 6, opinion: 6 }, 'ckw_chancellor_end')
  ]);
 add('ckw_chancellor_end', 'Court', 'Wax Heated Over Steady Flame',
  'Honest counsel outlasts sycophancy—your chancery dispatches regain teeth foreign courts actually respect.',
  'followup', [
   C('Grant him permanent chambers beside the royal library', 60, { opinion: 12, research: 5 }),
   C('Thank him warmly and close the dispatch chest', 0, { stability: 5, stress: -4 })
  ]);

 // 7. Conclave — Abolishing Council War-Veto (3 stages)
 add('ckw_council_prerogative', 'Politics', 'The Great Charter Debate',
  'Flush with recent triumphs, crown jurists urge stripping the privy council of ancient veto rights over taxes and foreign war—while grey-haired earls warn of tyranny.',
  'taxFaction', [
   C('Bargain clean judicial protections in exchange for supreme crown tax writs', 120, { legitimacy: 10, factionPressure: -20, stability: 5 }, 'ckw_prerogative_floor'),
   C('Push the decree hard through loyalists while great earls stew', 40, { legitimacy: 9, factionPressure: 8, prestige: 6 }, 'ckw_prerogative_floor'),
   C('Preserve shared council consent to keep realm unity intact', 0, { factionLoyalty: 12, factionPressure: -18, stability: 5 })
  ]);
 add('ckw_prerogative_floor', 'Politics', 'Boot-Heels Echoing in the Great Hall',
  'During final reading, county knights and city burgesses demand clear written bounds so emergency war-taxes never become permanent peacetime shackles.',
  'followup', [
   C('Write explicit three-year sunset clauses into every extraordinary levy', 50, { factionPressure: -16, credit: 6, legitimacy: 7 }, 'ckw_prerogative_seal'),
   C('Stand on unadorned ancient crown dignity', 0, { prestige: 7, factionLoyalty: -4 }, 'ckw_prerogative_seal')
  ]);
 add('ckw_prerogative_seal', 'Politics', 'Signatures Beneath the Vault',
  'Heavy parchment drops into the iron statute chest—defining the delicate balance between crown speed and noble consent for a generation.',
  'followup', [
   C('Print clear summaries for shire judges across the realm', 65, { research: 6, legitimacy: 8 }),
   C('Adjourn the estates with spiced wine and quiet relief', 0, { factionPressure: -8, stability: 5 })
  ]);

 // 8. Conclave — The Ward’s Adolescent Rebellion (3 stages)
 add('ckw_adolescent_rebel', 'Family', 'A Scaled Window and Missing Geldings',
  'At fifteen your quick-tempered heir slips past drowsy stable-lads before dawn with two page-boys, bent on joining border tournaments under a borrowed shield.',
  'child', [
   C('Ride after him quietly yourself, break bread at a wayside inn, and talk honestly', 55, { education: 14, stress: -4, legitimacy: 4 }, 'ckw_rebel_inn'),
   C('Send stern household knights to haul him straight back to bread and Euclid', 25, { education: 8, stability: 5, stress: 5 }, 'ckw_rebel_inn'),
   C('Let his guardian handle the chase while you watch from the battlements', 0, { stress: 4, education: 5 })
  ]);
 add('ckw_rebel_inn', 'Family', 'Boots Drying Beside Hearth Embers',
  'Cornered half a day down the north road, the youngster admits suffocating under endless Latin verbs while peers win spurs on border skirmishes.',
  'followup', [
   C('Grant him supervised frontier riding duties alongside afternoon statecraft', 85, { education: 15, prestige: 6 }, 'ckw_rebel_home'),
   C('Channel restless pride into formal diplomacy and tournament heraldry', 0, { education: 12, legitimacy: 5 }, 'ckw_rebel_home')
  ]);
 add('ckw_rebel_home', 'Family', 'Returning Before Curfew',
  'Muddy and chastened yet taller in the saddle, the young heir stops sneaking over garden walls—having learned energy has lawful outlets.',
  'followup', [
   C('Reward honest candor with a spirited young palfrey', 65, { education: 10, prestige: 5 }),
   C('Return quietly to scheduled lessons', 0, { stability: 4, education: 5 })
  ]);

 // =========================================================================
 // WAY OF LIFE — CAROUSING, HUNTS, THEOLOGY, SEDUCTION, INTRIGUE, BUSINESS
 // =========================================================================

 // 9. Carousing Focus — The Midnight Goblet Pact (4 stages)
 add('ckw_carousing_feast', 'Lifestyle', 'Six Empty Casks Before Midnight',
  'Roaring logs light flushed faces around your oak table; you invited prickly lords and merchant mayors alike for roast boar and Malmsey—and the third toast is warming stiff necks.',
  'focus_diplomacy', [
   C('Uncask vintage Gascon claret and call lute-players to sing bawdy tavern rounds', 110, { focusXP: 24, stress: -14, prestige: 6 }, 'ckw_carousing_wager'),
   C('Steer the warm laughter gently toward settling an old river-toll quarrel', 50, { focusXP: 20, credit: 6, stability: 5 }, 'ckw_carousing_wager'),
   C('Call last cups early before drunken boastfulness draws steel', 0, { stability: 5, stress: -5 })
  ]);
 add('ckw_carousing_wager', 'Lifestyle', 'Spilled Wine on Velvet Sleeves',
  'By two in the morning a stout border baron challenges you to arm-wrestle over a salt-barge patent, while a silent councillor quietly slips beneath the bench asleep.',
  'followup', [
   C('Lock elbows laughing on the oak boards and turn the bet into shared charity', 40, { focusXP: 22, prestige: 8, stress: -10 }, 'ckw_carousing_dawn'),
   C('Pour cold pitcher water over sleepy heads and break out dice for silver pennies', 20, { focusXP: 18, stress: -12 }, 'ckw_carousing_dawn'),
   C('Carry the snoring councillor quietly to bed and end the round gracefully', 0, { stability: 6, stress: -6 }, 'ckw_carousing_dawn')
  ]);
 add('ckw_carousing_dawn', 'Lifestyle', 'Cold Vinegar and Honest Handshakes',
  'At noon pale guests blink across pickled herring and barley tea—half embarrassed, yet oddly bound together by last night’s foolishness.',
  'followup', [
   C('Seal yesterday’s cheerful frontier pledges while goodwill still lingers', 65, { focusXP: 24, legitimacy: 7, stability: 6 }, 'ckw_carousing_pack'),
   C('Send guests home with hair-of-the-dog spiced ale casks', 0, { prestige: 7, stress: -8 }, 'ckw_carousing_pack')
  ]);
 add('ckw_carousing_pack', 'Lifestyle', 'Brothers of the Cup',
  'For months afterward erstwhile strangers grin across council chambers whenever someone mentions that Gascon barrel.',
  'followup', [
   C('Make quarterly informal suppers a quiet tool of statecraft', 50, { focusXP: 18, stability: 6 }),
   C('Drink only cold spring water for a week and return to ledgers', 0, { stress: -4, credit: 4 })
  ]);

 // 10. Hunting Focus — The Savage Boar of the Oak Hollow (3 stages)
 add('ckw_boar_hunt', 'Lifestyle', 'Tusks Gleaming in Wet Fern',
  'Cornered inside a briar hollow, a scarred grey tusked boar kills two mastiffs with one upward slash and charges straight through scattered beaters toward your stirrup.',
  'focus_martial', [
   C('Set the broad boar-spear firm against your boot and meet his rush head-on', 30, { focusXP: 28, prestige: 12, stress: -8 }, 'ckw_boar_camp'),
   C('Wheel your horse cleanly aside and loose a heavy crossbow bolt into his flank', 45, { focusXP: 22, prestige: 8 }, 'ckw_boar_camp'),
   C('Sound retreat horns cleanly and shield wounded beaters first', 0, { stability: 5, focusXP: 14, stress: -4 })
  ]);
 add('ckw_boar_camp', 'Lifestyle', 'Roasted Chines Over Juniper Coals',
  'With the beast lashed across two poles beside smoky forest fires, foresters bandage torn hounds while captains brag over warm cider.',
  'followup', [
   C('Gift the tusked head to the loyal sergeant who shielded the beaters', 40, { focusXP: 20, prestige: 9, stability: 5 }, 'ckw_boar_return'),
   C('Present the cured boar-hide as a shield-cover for the royal guard', 0, { focusXP: 16, prestige: 7 }, 'ckw_boar_return')
  ]);
 add('ckw_boar_return', 'Lifestyle', 'Muddy Spurs at the Gatehouse',
  'Even stiff court clerks lean over railings admiring the scarred tusk-trophies carried across the bridge.',
  'followup', [
   C('Host a hunters’ venison-and-boar supper for town watchmen', 70, { focusXP: 16, prestige: 8, stability: 5 }),
   C('Clean your hunting spear and return to barracks inspections', 0, { focusXP: 10, stress: -5 })
  ]);

 // 11. Seduction / Courtly Love — Sonnets Under the Moonlit Arcade (3 stages)
 add('ckw_courtly_sonnet', 'Court', 'Rosewater Folded Inside Wax',
  'A witty, razor-tongued courtier slips gilded vellum verses under your napkin at twilight—sparking breathless glances across the gallery and jealous whispers behind fans.',
  'married', [
   C('Answer with clever innocent verses while guarding marriage vows firmly', 35, { prestige: 7, opinion: 8, stress: -10 }, 'ckw_sonnet_gossip'),
   C('Slip quietly into the cedar garden for moonlit conversation alone', 55, { stress: -14, opinion: -14, prestige: 4 }, 'ckw_sonnet_scandal'),
   C('Hand the fragrant verses playfully to your consort and laugh together', 0, { opinion: 18, stability: 5, stress: -6 })
  ]);
 add('ckw_sonnet_gossip', 'Court', 'Fans Fluttering Behind Tapestries',
  'Minstrels begin setting the coy rhyming exchange to lute tunes until half the palace waits eagerly for the next stanza.',
  'followup', [
   C('Turn the public poetry game into a formal Court of Love floral contest', 95, { prestige: 11, opinion: 8, stability: 5 }, 'ckw_sonnet_close'),
   C('Declare the poetic sport ended cleanly before tongues turn spiteful', 0, { legitimacy: 6, opinion: 6 }, 'ckw_sonnet_close')
  ]);
 add('ckw_sonnet_scandal', 'Court', 'Cold Pillow at Breakfast',
  'Sharp-eyed chamberlains notice garden dew on velvet slippers; by noon your consort greets your arrival with glacial silence and tightly folded hands.',
  'followup', [
   C('End the moonlit meetings outright and win back household trust patiently', 85, { opinion: 18, legitimacy: 6, stress: 5 }, 'ckw_sonnet_close'),
   C('Shower both gallery and consort with lavish jewels to hush chatter', 130, { prestige: 8, opinion: 8, stress: -4 }, 'ckw_sonnet_close'),
   C('Freeze gossip with icy royal dignity and ride out alone at dawn', 0, { legitimacy: 5, opinion: -6, stress: 4 }, 'ckw_sonnet_close')
  ]);
 add('ckw_sonnet_close', 'Court', 'Ink Dried on Gilded Edges',
  'Court ballads linger briefly in winter halls before new campaigns sweep velvet whispers out the gate.',
  'followup', [
   C('Patronize virtuous troubadours singing dynastic loyalty', 55, { prestige: 8, stability: 5 }),
   C('Lock old verse-books away quietly', 0, { stress: -6, legitimacy: 4 })
  ]);

 // 12. Theology Focus — The Disputation of Two Abbots (3 stages)
 add('ckw_theology_debate', 'Religion', 'Candles Burning Past Compline',
  'Two learned doctors argue fiercely in the chapel over free will and divine grace while monks scribble frantic notes; both sides appeal to your theological judgment.',
  'focus_learning', [
   C('Draft a subtle mediating Latin thesis citing early Fathers cleanly', 45, { focusXP: 28, piety: 10, faithAuthority: 7 }, 'ckw_theology_synod'),
   C('Endow salaried chairs for both schools so honest debate sharpens faith', 115, { focusXP: 22, research: 10, piety: 7 }, 'ckw_theology_synod'),
   C('Remind both doctors gently that charity outranks brittle syllogisms', 0, { piety: 9, focusXP: 14, stability: 4 })
  ]);
 add('ckw_theology_synod', 'Religion', 'Margins Crowded With Greek Glosses',
  'Printed copies—or briskly copied pamphlets—carry your court’s balanced formula to neighboring cathedral chapters, drawing praise and one prickly refutation.',
  'followup', [
   C('Host an open autumn colloquium welcoming foreign doctors safely', 90, { research: 11, focusXP: 24, prestige: 8 }, 'ckw_theology_peace'),
   C('Leave pamphlets cleanly in abbey hands and rest in quiet contemplation', 0, { piety: 8, stress: -8 }, 'ckw_theology_peace')
  ]);
 add('ckw_theology_peace', 'Religion', 'Stillness Beneath High Arches',
  'Incense settles peacefully across oak stalls; learning and devotion walk arm in arm without lighting faggots.',
  'followup', [
   C('Endow copies of the reconciled commentary for provincial schools', 65, { research: 8, faithAuthority: 7 }),
   C('Keep quiet evening vigils before returning to state papers', 0, { piety: 7, stress: -6 })
  ]);

 // 13. Rulership Focus — The Mountain of Unanswered Petitions (3 stages)
 add('ckw_rulership_desk', 'Lifestyle', 'Three Feet of Waxed Writs',
  'Snow piles along chamber sills while petitions stack chest-high: mill-weir lawsuits, widows’ dower claims, bridge tolls, and bruised pride from every shire.',
  'focus_stewardship', [
   C('Burn midnight oil clearing every dusty roll with streamlined standard writs', 65, { focusXP: 28, legitimacy: 9, stress: 7 }, 'ckw_rulership_system'),
   C('Delegate routine property claims to trained circuit justices under seal', 110, { focusXP: 22, credit: 8, stress: -6 }, 'ckw_rulership_system'),
   C('Prioritize urgent tax and defense writs and postpone boundary squabbles', 0, { credit: 4, focusXP: 12, stability: 3 })
  ]);
 add('ckw_rulership_system', 'Lifestyle', 'Clerks Racing Against Dawn',
  'Halfway through sorting county tallies you uncover three overlapping archaic offices collecting identical bridge-pennies for centuries.',
  'followup', [
   C('Abolish duplicate sinecures cleanly and redirect pennies to road repair', 45, { credit: 10, focusXP: 24, legitimacy: 7 }, 'ckw_rulership_dawn'),
   C('Buy out ancient hereditary wardens gently to avoid bitter lawsuits', 0, { stability: 8, focusXP: 18, credit: 6 }, 'ckw_rulership_dawn')
  ]);
 add('ckw_rulership_dawn', 'Lifestyle', 'Bare Oak Boards Under Sunlight',
  'For the first time in years the great table gleams clean—every county roll tied in fresh red tape and indexed by year.',
  'followup', [
   C('Establish permanent quarterly audit calendars for every bailiwick', 55, { credit: 9, focusXP: 16, legitimacy: 6 }),
   C('Stretch stiff shoulders and walk out to crisp morning air', 0, { stress: -10, stability: 4 })
  ]);

 // 14. Intrigue Focus — The Whispering Gallery Behind the Wainscot (3 stages)
 add('ckw_intrigue_gallery', 'Intrigue', 'Dust Disturbed Behind the Carved Cherub',
  'While inspecting damp palace masonry, your master carpenter taps a hollow pine panel revealing a narrow servants’ crawlway running straight behind the council hearth.',
  'focus_intrigue', [
   C('Seal the masonry invisibly—while installing one discreet peephole for crown ears', 85, { focusXP: 26, securityMonths: 12, stress: 4 }, 'ckw_gallery_ears'),
   C('Brick up every forgotten crawlway solidly and inspect all palace plans', 60, { securityMonths: 10, focusXP: 18, stability: 5 }, 'ckw_gallery_ears'),
   C('Leave the old tunnel dusty and set quiet flour-dust traps inside', 0, { focusXP: 16, securityMonths: 7 })
  ]);
 add('ckw_gallery_ears', 'Intrigue', 'Soft Footsteps After Midnight',
  'Three nights later flour-dust reveals small booted footprints slipping from the gallery toward the treasurer’s outer vestry.',
  'followup', [
   C('Plant falsified troop-count memos on the desk to bait the spy’s buyer', 50, { focusXP: 26, securityMonths: 11, prestige: 5 }, 'ckw_gallery_snare'),
   C('Catch the intruder calmly in the corridor and turn him into a double agent', 0, { focusXP: 22, securityMonths: 10 }, 'ckw_gallery_snare')
  ]);
 add('ckw_gallery_snare', 'Intrigue', 'The Rat Trap Snaps Shut',
  'Caught clutching forged wax impressions, the trembling clerk spills three foreign paymasters’ tavern drops before dawn.',
  'followup', [
   C('Feed false intelligence across borders for six months before sealing the tunnel', 40, { securityMonths: 12, focusXP: 18, prestige: 6 }),
   C('Lock the traitor in deep stone and brick the secret passage shut', 0, { stability: 6, securityMonths: 8 })
  ]);

 // 15. Business Focus — The Spice Factor’s Failed Venture (3 stages)
 add('ckw_business_factor', 'Economy & Trade', 'Salt-Stained Ledgers at the Wharf',
  'Your lively merchant partner bursts into hall soaked to the knees: the Levant spice galley broke its rudder off rocky shoals, leaving creditors hammering his shutters.',
  'focus_stewardship', [
   C('Buy out distressed creditors cheaply and salvage the wet cargo by lighter-boats', 135, { focusXP: 26, gold: 80, credit: 8 }, 'ckw_factor_salvage'),
   C('Extend him a sober crown credit guarantee to steady guild confidence', 80, { credit: 10, focusXP: 20, stability: 4 }, 'ckw_factor_salvage'),
   C('Write off the speculative share cleanly and protect treasury silver', 0, { stability: 4, credit: -2, focusXP: 10 })
  ]);
 add('ckw_factor_salvage', 'Economy & Trade', 'Pepper Drying Over Charcoal Pans',
  'Hauling soaked sacks into warm brick warehouses saves two-thirds of the cloves and cinnamon—though rivals cry the crown uses unfair salvage rights.',
  'followup', [
   C('Charter a shared maritime-insurance pool open to every honest shipper', 95, { credit: 11, focusXP: 24, legitimacy: 6 }, 'ckw_factor_guild'),
   C('Auction rescued spices smartly at the autumn fair', 0, { gold: 130, focusXP: 16, credit: 5 }, 'ckw_factor_guild')
  ]);
 add('ckw_factor_guild', 'Economy & Trade', 'Ships Insured Before Anchor Weighs',
  'Born from salt and near-ruin, shared sea-risk policies give cautious captains courage to sail wider waters next spring.',
  'followup', [
   C('Standardize marine insurance contracts under royal admiralty seals', 60, { credit: 10, research: 6 }),
   C('Pour salvaged spice profits quietly back into crown reserves', 0, { gold: 75, stability: 4 })
  ]);

 // 16. Court Friend — Midnight Chess & Old Campaign Stories (3 stages)
 add('ckw_friend_chess', 'Court', 'Carved Ivory Knights Beside Ember-Glow',
  'Rain drums on leaded glass as your closest confidant pours spiced cider and sets out chipped ivory chessmen—before quietly admitting dark doubts about an ambitious faction.',
  'courtFriend', [
   C('Keep him talking past midnight, share burdens openly, and toast unbroken faith', 45, { opinion: 18, stress: -18, stability: 4 }, 'ckw_friend_burden'),
   C('Compare notes sharply on suspected plotters and divide watch duties', 30, { opinion: 12, securityMonths: 9, stress: -8 }, 'ckw_friend_burden'),
   C('Play three quiet silent games and turn in early for sleep', 0, { stress: -12, opinion: 8 })
  ]);
 add('ckw_friend_burden', 'Court', 'An Unwelcome Rumor at Morning Chapel',
  'Next week a malicious gossiper whispers that your trusted companion took quiet gold from border merchants—an ugly lie, or an uncomfortable truth.',
  'followup', [
   C('Warn your friend candidly behind closed doors and audit the rumor together', 25, { opinion: 14, securityMonths: 8, legitimacy: 5 }, 'ckw_friend_bond'),
   C('Crush the slanderer publicly in hall without troubling your friend', 0, { opinion: 16, prestige: 6, stress: 3 }, 'ckw_friend_bond')
  ]);
 add('ckw_friend_bond', 'Court', 'Unshaken Beside the Dais',
  'In a throne room crowded with flatterers, one pair of eyes meets yours without calculation.',
  'followup', [
   C('Invest your companion with a ceremonial household honor', 65, { opinion: 16, prestige: 6, stability: 5 }),
   C('Keep the quiet friendship free of court envy', 0, { opinion: 10, stress: -8 })
  ]);

 // 17. Court Rival — The Poisoned Peach at Banquet (3 stages)
 add('ckw_rival_peach', 'Court', 'A Silver Knife Offered Too Smoothly',
  'Across the high table your bitterest court rival smiles brightly and sends a dish of early greenhouse peaches down by page-boy—just as your taster narrows his eyes at bruised skins.',
  'courtRival', [
   C('Smile back, feed half the fruit discreetly to a stray hound, and watch carefully', 40, { securityMonths: 10, opinion: -10, stress: 5 }, 'ckw_rival_hound'),
   C('Invite the rival cheerfully up to share the very first slice with you', 0, { prestige: 9, opinion: -14, stress: 6 }, 'ckw_rival_hound'),
   C('Wave the platter politely aside untouched and speak softly of other matters', 0, { stability: 4, opinion: -4, stress: 3 })
  ]);
 add('ckw_rival_hound', 'Court', 'Empty Bowls Behind the Scullery',
  'The kitchen hound trots away wagging its tail—yet guards catch a nervous pantry clerk wiping bitter-almond oil from a second hidden dish.',
  'followup', [
   C('Quietly lock the clerk in cellars and summon your rival to private reckoning', 55, { securityMonths: 12, legitimacy: 8, opinion: -16 }, 'ckw_rival_end'),
   C('Stage a dramatic royal pardon to shame your rival before assembled peers', 0, { prestige: 10, opinion: 12, stability: 5 }, 'ckw_rival_end')
  ]);
 add('ckw_rival_end', 'Court', 'Silver Tasters Watch Closer Now',
  'Every orchard fruit enters palace kitchens under sealed baskets; even bitter rivals learn crown tables bite back.',
  'followup', [
   C('Double household food-taster stipends and pantry locks', 60, { securityMonths: 12, stability: 5 }),
   C('Resume court banquets with cold watchful poise', 0, { prestige: 6, stress: -3 })
  ]);

 // 18. Falconry Focus — Lost Gyrfalcon Over Border Marshes (3 stages)
 add('ckw_lost_falcon', 'Lifestyle', 'Silver Bells Vanishing Into Mist',
  'Your prized white Norwegian gyrfalcon stoops after a heron across the border marsh—carrying engraved royal jesses straight toward a prickly neighbor’s watchtower.',
  'neighbor', [
   C('Send polite mounted falconers with fine Spanish wine to ask her safe return', 75, { relation: 10, prestige: 6 }, 'ckw_falcon_tower'),
   C('Ride straight to the border ford yourself with hunting horn and gloves', 30, { prestige: 8, relation: 6 }, 'ckw_falcon_tower'),
   C('Write off the bird rather than owe a prickly neighbor a single courtesy', 0, { prestige: -3, relation: -4 })
  ]);
 add('ckw_falcon_tower', 'Lifestyle', 'A Hooded Bird on a Rival Glove',
  'At the marsh watchtower the border castellan steps out smiling—holding the unharmed gyrfalcon perched neatly on buckskin leather.',
  'followup', [
   C('Trade hunting stories beside his hearth and gift him a spare spaniel pup', 55, { relation: 14, stability: 5 }, 'ckw_falcon_home'),
   C('Toss two silver crowns to his falconer, reclaim the bird, and ride briskly', 0, { prestige: 6, relation: 3 }, 'ckw_falcon_home')
  ]);
 add('ckw_falcon_home', 'Lifestyle', 'Jesses Hung in the Mews',
  'Small courtesies over bells and feathers sometimes melt border frost faster than solemn ambassadors.',
  'followup', [
   C('Invite the neighbor’s household to an autumn hawking meet', 65, { relation: 12, prestige: 7 }),
   C('Return the bird safely to her warm perch', 0, { stability: 4, relation: 4 })
  ]);

 // =========================================================================
 // THE REPUBLIC — PATRICIAN PALAZZO FEUDS, TRADE POSTS & DOGE ELECTIONS
 // =========================================================================

 // 19. Merchant Republic — Patrician Palazzo Feud in the Canal Square (4 stages)
 add('ckw_patrician_feud', 'Economy & Trade', 'Broken Marble Lions on the Riva',
  'Armed retainers of two great banking families clash with boat-hooks and rapiers beside the spice quay after a contested galley auction—blocking marble barges across the lagoon.',
  'gov_republic', [
   C('Summon both patriarchs to the Council Chamber and impose stiff peace-bonds', 55, { stability: 8, legitimacy: 8, credit: 6 }, 'ckw_palazzo_wedding'),
   C('Seize contested quay cranes temporarily under neutral state receivership', 85, { credit: 9, trust: 7, development: 1 }, 'ckw_palazzo_wedding'),
   C('Back the wealthier naval syndicate silently in exchange for fleet subsidies', 0, { gold: 130, credit: 5, unrest: 5 }, 'ckw_palazzo_arson')
  ]);
 add('ckw_palazzo_wedding', 'Economy & Trade', 'Gondolas Draped in Crimson Damask',
  'Forced to dine beneath gilded ceilings, elder matriarchs negotiate a cold truce—if only the younger hotheads stop writing insults on warehouse walls.',
  'followup', [
   C('Underwrite a joint Levant pepper convoy splitting shares cleanly between both houses', 120, { credit: 12, development: 1, stability: 6 }, 'ckw_palazzo_accord'),
   C('Ban private armed bravos inside city wards under heavy confiscation', 0, { securityMonths: 10, legitimacy: 7, unrest: -6 }, 'ckw_palazzo_accord')
  ]);
 add('ckw_palazzo_arson', 'Economy & Trade', 'Tar Barrels Burning Under Silk Beams',
  'At two in the morning pitch-soaked rags fly through a rival warehouse shutter; citizens form bucket lines as cinnamon smoke chokes three alleys.',
  'followup', [
   C('Compensate innocent guild tenants and hang caught arsonists from yardarms', 110, { stability: 7, legitimacy: 8, unrest: -7 }, 'ckw_palazzo_accord'),
   C('Buy out ruined quay lots cheaply for expanded municipal arsenals', 0, { development: 1, tools: 15, credit: 5 }, 'ckw_palazzo_accord')
  ]);
 add('ckw_palazzo_accord', 'Economy & Trade', 'Quiet Oars Under Lanterns',
  'Silk sails glide down the main channel uninterrupted; merchant republics thrive only while knives stay tucked inside ledgers.',
  'followup', [
   C('Establish permanent Harbor Arbiters elected across minor guilds', 75, { credit: 10, trust: 9 }),
   C('Collect quay customs cleanly and close the watch', 0, { gold: 90, stability: 4 })
  ]);

 // 20. Trade Post Seizure — Foreign Port Cancels Liberties (3 stages)
 add('ckw_tradepost_seized', 'Economy & Trade', 'Chains Bolted Across the Fondaco Gate',
  'Envious local guilds at a major foreign entrepot padlock your republic’s walled trade-house overnight, alleging short-weighted saffron and unpaid harbor dues.',
  'trade', [
   C('Dispatch smooth-tongued syndics with honest silver and revised fair tariffs', 135, { credit: 12, trust: 7, prestige: 6 }, 'ckw_fondaco_parley'),
   C('Freeze rival merchants’ warehouses in your own harbor as sharp leverage', 30, { credit: 5, securityMonths: 8, unrest: 3 }, 'ckw_fondaco_parley'),
   C('Divert summer galleys silently to rival down-coast anchorage coves', 0, { credit: -3, gold: 45, stability: 4 })
  ]);
 add('ckw_fondaco_parley', 'Economy & Trade', 'Counting Saffron Threads Beneath Lanterns',
  'Port magistrates produce two crooked scales seized from a reckless junior factor; your merchants clamor to protect whole trade privileges.',
  'followup', [
   C('Punish the crooked factor publicly and endow a joint stone weigh-house', 90, { credit: 12, legitimacy: 8, trust: 8 }, 'ckw_fondaco_open'),
   C('Pay a brisk settlement fee to unlock pepper vaults before sailing season closes', 110, { credit: 8, gold: 60 }, 'ckw_fondaco_open'),
   C('Withdraw factors cleanly to neighboring coves and starve the stubborn port of tolls', 0, { credit: 4, stability: 4 }, 'ckw_fondaco_open')
  ]);
 add('ckw_fondaco_open', 'Economy & Trade', 'Bales Swinging Over Clear Water',
  'Iron padlocks drop off timber doors; crates of ginger and alum swing back aboard cogs before autumn storms lock the straits.',
  'followup', [
   C('Establish strict guild consul inspections over overseas factors', 55, { credit: 9, securityMonths: 7 }),
   C('Resume normal convoy schedules', 0, { gold: 80, credit: 4 })
  ]);

 // 21. Arsenal Shipwright Strike — Caulk & Timber Shortage (3 stages)
 add('ckw_arsenal_strike', 'Economy & Trade', 'Silent Mallets Along the Great Basin',
  'Two hundred master caulkers and oar-wrights drop mallets across the naval arsenal, protesting debased copper wages paid on Friday docks.',
  'gov_republic', [
   C('Pay wages cleanly in full silver groats and improve dockyard wine-bread rations', 120, { credit: 10, trust: 11, tools: 18 }, 'ckw_arsenal_keel'),
   C('Offer piece-rate hull bonuses for early launch while disciplining ringleaders', 55, { tools: 15, stability: 5, credit: 5 }, 'ckw_arsenal_keel'),
   C('Hire outside river carpenters cleanly and bar the arsenal gates', 0, { unrest: 7, tools: 8, stability: -3 })
  ]);
 add('ckw_arsenal_keel', 'Economy & Trade', 'Boiling Pitch and Sawdust Again',
  'When honest silver rings on oak pay-boards, master builders reveal a clever jig-frame system that cuts galley assembly time in half.',
  'followup', [
   C('Patent the rapid assembly line inside covered stone slips', 100, { development: 1, research: 10, credit: 8 }, 'ckw_arsenal_launch'),
   C('Reward the foreman warmly and stick to stout proven ribs', 0, { trust: 8, tools: 12 }, 'ckw_arsenal_launch')
  ]);
 add('ckw_arsenal_launch', 'Economy & Trade', 'Ten Oared Hulls Sliding Down Grease',
  'Freshly pitched galleys hit green harbor water cleanly—reminding competitors why your shipyards outbuild kingdoms twice your land.',
  'followup', [
   C('Establish a permanent dockyard widow-and-injury guild fund', 65, { trust: 10, stability: 6 }),
   C('Commission merchant escort patrols immediately', 0, { credit: 8, securityMonths: 6 })
  ]);

 // 22. The Venetian / Genoese Banking Run (3 stages)
 add('ckw_bank_run', 'Economy & Trade', 'Crowds Hammering Walnut Teller Windows',
  'Rumors of sunken silver fleets abroad spark panic outside the city’s oldest private banking house; depositors scream for coin while clerks bolt oak shutters.',
  'inflation', [
   C('Backstop solvent vaults openly with a visible cart of stamped state bullion', 155, { credit: 15, inflation: -3, stability: 8 }, 'ckw_bank_ledger'),
   C('Declare a crisp three-day bank holiday while state auditors weigh reserves', 45, { credit: 8, legitimacy: 6, unrest: -4 }, 'ckw_bank_ledger'),
   C('Let reckless private lenders collapse and seize their pawned palaces', 0, { gold: 135, credit: -8, unrest: 7 })
  ]);
 add('ckw_bank_ledger', 'Economy & Trade', 'Candles Over Double-Entry Parchment',
  'Through a breathless night state auditors verify tallies: assets exceed liabilities, yet half the bank’s silver sits tied up in distant wool futures.',
  'followup', [
   C('Convert shaky private notes into guaranteed municipal treasury bonds', 95, { credit: 12, inflation: -2, trust: 9 }, 'ckw_bank_calm'),
   C('Require strict thirty-percent bullion reserves on every future banker’s bench', 0, { credit: 9, legitimacy: 7 }, 'ckw_bank_calm')
  ]);
 add('ckw_bank_calm', 'Economy & Trade', 'Calm Benches Under the Loggia',
  'By Thursday depositors carry small sacks away—and quietly deposit them back by Saturday once confidence holds.',
  'followup', [
   C('Charter a permanent Public Giro Bank under triple council keys', 90, { credit: 14, research: 6, development: 1 }),
   C('Return surplus state bullion cleanly to the vault', 0, { securityMonths: 7, credit: 5 })
  ]);

 // 23. Doge / Consul Election — The Secret Ballot Scandal (3 stages)
 add('ckw_ballot_box', 'Politics', 'Two Wax Balls Marked With Identical Scratches',
  'While shaking golden ballot-balls from the velvet urn during high magistrate elections, sharp-eyed tellers spot two balls weighted slightly heavier with lead shot.',
  'lowlegitimacy', [
   C('Halt the tally immediately, melt every ballot-ball, and recast clean bronze lots', 75, { legitimacy: 12, stability: 7, securityMonths: 8 }, 'ckw_ballot_inquiry'),
   C('Quietly discard the rigged balls and complete the vote without public panic', 25, { stability: 6, securityMonths: 6, legitimacy: 4 }, 'ckw_ballot_inquiry'),
   C('Seize the chamber doors and annul the whole election by emergency decree', 0, { legitimacy: -4, prestige: 5, securityMonths: 9 })
  ]);
 add('ckw_ballot_inquiry', 'Politics', 'Blindfolded Boys Drawing Bronze Lots',
  'A terrified goldsmith’s apprentice confesses a rival faction bribed him with twenty ducats to weight specific lots.',
  'followup', [
   C('Banish the bribing senators cleanly and adopt multi-round blind random draws', 50, { legitimacy: 11, research: 5, stability: 6 }, 'ckw_ballot_clean'),
   C('Levy quiet crushing fines on the guilty house to keep civic peace', 0, { gold: 130, securityMonths: 7, legitimacy: 5 }, 'ckw_ballot_clean')
  ]);
 add('ckw_ballot_clean', 'Politics', 'Honest Bells Over the Palazzo',
  'When the newly elected magistrate steps onto the marble balcony, citizens cheer cleanly—knowing coin did not steal the urn.',
  'followup', [
   C('Inscribe anti-bribery election statutes onto public bronze plaques', 55, { legitimacy: 9, trust: 7 }),
   C('Adjourn to the inaugural banquet', 0, { prestige: 7, stability: 4 })
  ]);

 // 24. Smuggler’s Cove & Pirate Letter of Marque (3 stages)
 add('ckw_letter_marque', 'Economy & Trade', 'Black Hulls Beneath Limestone Cliffs',
  'A scarred sea-wolf offers to hunt rival maritime raiders—and deliver twenty percent of captured silks—if only your Admiralty grants an inked parchment Letter of Marque.',
  'trade', [
   C('Issue a strictly bounded commission barring neutral shipping raids', 60, { credit: 9, gold: 80, securityMonths: 7 }, 'ckw_marque_prize'),
   C('Refuse corsairs outright and fund twin navy patrol cutters instead', 135, { credit: 10, trust: 9, legitimacy: 7 }, 'ckw_marque_patrol'),
   C('Give him quiet verbal nods without ink so the crown denies all blame', 0, { gold: 115, credit: -4, securityMonths: 5 })
  ]);
 add('ckw_marque_prize', 'Economy & Trade', 'Silk Bales Missing Their Bills of Lading',
  'Your licensed privateer sails back towing a rich carrack—yet an allied neutral envoy claims three chests of dyed wool belonged to peaceful weavers.',
  'followup', [
   C('Restitute the neutral wool promptly through Prize Court judges', 75, { legitimacy: 9, credit: 10, trust: 7 }, 'ckw_marque_end'),
   C('Split disputed bales quietly with the crew and ignore foreign groans', 0, { gold: 105, credit: -5 }, 'ckw_marque_end')
  ]);
 add('ckw_marque_patrol', 'Economy & Trade', 'Lantern Signals Along the Reef',
  'Swift patrol cutters flush three pirate nests out of misty coves, making sea-lanes safe for honest salt and cloth hulks alike.',
  'followup', [
   C('Hang captured pirates openly on channel beacons as warning', 35, { securityMonths: 10, credit: 9, stability: 5 }, 'ckw_marque_end'),
   C('Press repentant crews onto coastal lighthouses and buoy tenders', 0, { development: 1, trust: 7 }, 'ckw_marque_end')
  ]);
 add('ckw_marque_end', 'Economy & Trade', 'Clear Horizons Beyond the Mole',
  'Underwriters slash sea-risk rates by autumn; honest sails crowd the breakwater again.',
  'followup', [
   C('Charter a permanent Admiralty Prize & Salvage Court', 65, { credit: 10, legitimacy: 6 }),
   C('Log seasonal harbor clearances cleanly', 0, { credit: 6, stability: 4 })
  ]);

 // =========================================================================
 // HORSE LORDS — KURULTAI RACES, CLAN GRAZING FEUDS & STEPPE KHANATES
 // =========================================================================

 // 25. Great Kurultai Horse Race & Bow Contest (4 stages)
 add('ckw_kurultai_race', 'Martial & Court', 'Ten Thousand Mares Thunder Across the Steppe',
  'Beside felt white yurts crowned with yak-tail standards, rival clan chiefs assemble fifty leagues of grass for the great seasonal Kurultai—and wager summer pastures on the thirty-mile horse race.',
  'gov_steppe', [
   C('Sponsor rich silk prizes, roasted mare’s-milk feasts, and impartial finish judges', 140, { prestige: 12, stability: 8, trust: 8 }, 'ckw_kurultai_bow'),
   C('Mount your own fleetest steppe gelding to ride the brutal final stretch', 40, { prestige: 11, stability: 4, legitimacy: 7 }, 'ckw_kurultai_bow'),
   C('Keep the gathering lean and focus strictly on border raid muster rolls', 0, { stability: 5, food: 30, prestige: -2 })
  ]);
 add('ckw_kurultai_bow', 'Martial & Court', 'Horn Bows Drawn at Full Gallop',
  'During the mounted archery trial, a fiery junior khan’s arrow clips a painted gourd—yet his cousin claims the shaft bounced off turf first, reaching for horn-knife hilts.',
  'followup', [
   C('Order an immediate clean shoot-off at full gallop before every banner', 35, { legitimacy: 9, prestige: 8, stability: 5 }, 'ckw_kurultai_council'),
   C('Award twin silver quivers to honor both young riders’ fierce skill', 75, { trust: 9, stability: 7, prestige: 6 }, 'ckw_kurultai_council'),
   C('Silence quarrels sternly under Kurultai peace law', 0, { legitimacy: 7, securityMonths: 6 }, 'ckw_kurultai_council')
  ]);
 add('ckw_kurultai_council', 'Martial & Court', 'Kumis Bowls Passing Around the Fire',
  'Beneath wheeling Milky Way stars, shamans and elders pass silver kumis bowls while chiefs trace autumn winter-camp routes in ash.',
  'followup', [
   C('Seal clear winter pasture boundaries so clans never clash in snow', 60, { food: 65, stability: 8, trust: 9 }, 'ckw_kurultai_close'),
   C('Proclaim bold spring horse-raids along wealthy caravan borders', 0, { prestige: 9, gold: 65, unrest: 3 }, 'ckw_kurultai_close')
  ]);
 add('ckw_kurultai_close', 'Martial & Court', 'Yak-Tail Standards Unfurled Eastward',
  'Dawn frost sparkles across trampled grass as ten thousand riders wheel homeward—united by salt, speed, and clear command.',
  'followup', [
   C('Reward victorious horse-breeders with royal salt exemptions', 50, { food: 55, legitimacy: 6 }),
   C('Strike yurts and march cleanly before rain', 0, { stability: 5, prestige: 5 })
  ]);

 // 26. Clan Grazing Feud — Blood over the Salt Lick (3 stages)
 add('ckw_grazing_feud', 'Politics', 'Stolen Sheep Beside the Bitter Well',
  'Two proud border clans drive spear-points into muddy ground around the valley’s lone mineral salt-lick; twelve herders already lie dead beneath wool cloaks.',
  'unrest', [
   C('Arbitrate alternating seasonal salt-weeks and pay blood-silver from crown purses', 115, { unrest: -14, trust: 11, stability: 6 }, 'ckw_grazing_oath'),
   C('Declare the salt-lick neutral royal pasture open under mounted wardens', 55, { legitimacy: 8, unrest: -8, securityMonths: 7 }, 'ckw_grazing_oath'),
   C('Award the spring cleanly to the larger loyal clan and fine the losers horses', 0, { gold: 80, unrest: 7, trust: -6 })
  ]);
 add('ckw_grazing_oath', 'Politics', 'Two Horses Divided by Cold Iron',
  'Elders hesitate over blood-price tallies: one clan lost three young sons, the other lost sixty pregnant ewes on rocky slopes.',
  'followup', [
   C('Match breeding ewes from royal flocks to restore ruined herds swiftly', 75, { food: 55, trust: 10, unrest: -8 }, 'ckw_grazing_peace'),
   C('Bind both chiefs to foster each other’s younger sons for three winters', 0, { stability: 8, securityMonths: 9 }, 'ckw_grazing_peace')
  ]);
 add('ckw_grazing_peace', 'Politics', 'Shared Fire Smoke Above the Steppe',
  'Herds mingle quietly beside the bitter stones again; iron stays sheathed while lambs drop healthy in spring.',
  'followup', [
   C('Mark clear cairn boundaries along all valley salt-pans', 45, { trust: 8, food: 40 }),
   C('Ride back to winter quarters cleanly', 0, { stability: 5 })
  ]);

 // 27. Steppe Winter Dzud — Frozen Crust Over Grass (3 stages)
 add('ckw_winter_dzud', 'Crisis & Plague', 'Ice Sheet Sealing the Pasture',
  'Thaw followed by sudden arctic freeze encases three hundred leagues of grass under iron ice; ponies bleed at the fetlocks pawing for dry blades while lambs freeze upright.',
  'famine', [
   C('Break open southern valley hay-ricks and buy barley trains at double rate', 155, { food: 120, crisis: -20, trust: 11 }, 'ckw_dzud_yurts'),
   C('Order swift winter slaughter, smoke every carcass, and share tallow evenly', 55, { food: 75, crisis: -14, stability: 5 }, 'ckw_dzud_yurts'),
   C('Drive surviving herds toward warmer border river-reeds regardless of tolls', 0, { food: 45, unrest: 6, crisis: -6 })
  ]);
 add('ckw_dzud_yurts', 'Crisis & Plague', 'Huddled Around Dried Dung Braziers',
  'Blizzards howl for nine straight days; desperate herders boil leather bridles while shamans beat bone drums begging clear blue sky.',
  'followup', [
   C('Dispatch mounted sledges carrying brick tea, oats, and felt blankets', 95, { crisis: -16, trust: 11, food: 50 }, 'ckw_dzud_thaw'),
   C('Keep clan elders gathered around central fires sharing strict equal portions', 0, { stability: 7, crisis: -9 }, 'ckw_dzud_thaw')
  ]);
 add('ckw_dzud_thaw', 'Crisis & Plague', 'Green Shoots Along South Slopes',
  'When March chinook winds finally crack the ice crust, thinner herds rise shaking—remembering cleanly who hauled oats through whiteout storms.',
  'followup', [
   C('Establish stone-roofed winter hay-barns at major river crossings', 85, { development: 1, food: 70, crisis: -10 }),
   C('Forgive spring herd-tithes across frozen districts', 0, { trust: 9, unrest: -7 })
  ]);

 // 28. Wolf-Blooded Oath-Brothers — Anda Pact (3 stages)
 add('ckw_anda_oath', 'Diplomacy', 'Drops of Blood in the Horn Cup',
  'After saving each other in a frostbitten canyon ambush, a proud neighboring steppe warlord offers the ancient Anda oath of sworn brotherhood—exchanging belts and bows.',
  'friendly', [
   C('Cut palms cleanly over kumis, exchange gilded bows, and seal lasting concord', 95, { relation: 18, prestige: 10, stability: 5 }, 'ckw_anda_trial'),
   C('Honor his friendship warmly with rich sable cloaks without risky blood-vows', 60, { relation: 12, prestige: 6 }, 'ckw_anda_trial'),
   C('Keep diplomatic ties strictly formal beneath written seals', 0, { relation: 4, legitimacy: 4 })
  ]);
 add('ckw_anda_trial', 'Diplomacy', 'Horse-Thieves Testing the Pact',
  'Within two moons reckless younger raiders from his outer camp rustle forty pack-mules from your frontier salt-caravan.',
  'followup', [
   C('Send a lone rider carrying his own exchanged belt—demanding quiet brotherhood justice', 30, { relation: 12, legitimacy: 8, gold: 55 }, 'ckw_anda_end'),
   C('Track the thieves together in a joint punitive dawn gallop', 65, { relation: 14, prestige: 8, securityMonths: 7 }, 'ckw_anda_end'),
   C('Send calm riders asking his elders to settle the camp theft by custom', 0, { relation: 7, stability: 4 }, 'ckw_anda_end')
  ]);
 add('ckw_anda_end', 'Diplomacy', 'Mules Returned With Tied Thieves',
  'Bound raiders kneel beside returned salt-packs—proof an oath forged in frost still carries iron weight.',
  'followup', [
   C('Toast shared frontier safety beneath painted banners', 45, { relation: 10, prestige: 6 }),
   C('Secure the recovered caravan cleanly', 0, { credit: 6, stability: 4 })
  ]);

 // 29. The Yurt-Smiths’ Iron Wagon Foundry (3 stages)
 add('ckw_wagon_foundry', 'Military', 'Rolling Bellows Behind Ten Oxen',
  'Steppe blacksmiths mount twin leather bellows and charcoal clay-forges atop broad timber axles—enabling armies to repair arrowheads and horse-shoes right behind vanguard columns.',
  'army_supply', [
   C('Equip six rolling field-forges and recruit skilled ironwrights', 130, { supply: 22, morale: 9, experience: 0.06 }, 'ckw_foundry_march'),
   C('Trial two lightweight farrier wagons for elite cavalry scouts', 65, { supply: 14, fatigue: -8 }, 'ckw_foundry_march'),
   C('Stick to spare pack-bags of pre-forged nails and arrowheads', 0, { supply: 8, fatigue: -4 })
  ]);
 add('ckw_foundry_march', 'Military', 'Sparks Blowing Across Twilight Grass',
  'When rocky defiles snap forty wagon-tires and wear horse-shoes paper-thin, rolling bellows glow straight through midnight saving a whole campaign’s speed.',
  'followup', [
   C('Train mobile apprentice smiths attached to every hundred lances', 70, { experience: 0.08, supply: 16, morale: 8 }, 'ckw_foundry_end'),
   C('Pay double iron-rations to keep fires roaring till dawn', 0, { supply: 12, fatigue: -5 }, 'ckw_foundry_end')
  ]);
 add('ckw_foundry_end', 'Military', 'Unbroken Hooves on Stone',
  'Never again does a lost nail stall a charging banner three days from home.',
  'followup', [
   C('Standardize spare-axle sizes across the entire baggage train', 50, { supply: 15, research: 5 }),
   C('Roll the cooling forges back into winter park', 0, { fatigue: -8, morale: 5 })
  ]);

 // =========================================================================
 // JADE DRAGON — IMPERIAL KOWTOW EMBASSIES, SILK ROAD & EUNUCH SCHOLARS
 // =========================================================================

 // 30. Imperial Kowtow Embassy — Silk Tribute & Jade Seal (4 stages)
 add('ckw_jade_embassy', 'Diplomacy', 'The Vermilion Edict From the Celestial Court',
  'Imperial couriers draped in saffron silk ride up with brass tallies, inviting your envoys to perform the grand kowtow before the Dragon Throne—promising rich porcelain, silk bolts, and trade patents.',
  'crossroads_contact', [
   C('Dispatch a dazzling mission bearing fine horses, amber, and noble scholars', 165, { prestige: 12, credit: 12, research: 9 }, 'ckw_jade_kowtow'),
   C('Send cautious merchant syndics bearing polite gifts while guarding pride', 85, { credit: 9, legitimacy: 6 }, 'ckw_jade_kowtow'),
   C('Receive the couriers respectfully at border posts without bowing abroad', 0, { legitimacy: 8, prestige: 5, credit: -2 })
  ]);
 add('ckw_jade_kowtow', 'Diplomacy', 'Nine Prostrations on Cold Jade Flags',
  'Inside the cavernous audience hall, chamberlains bark ceremonial timing while your proud lead envoy hesitates—must sovereign equals knock foreheads against marble tiles?',
  'followup', [
   C('Follow court ritual smoothly to unlock unmatched imperial trade licenses', 65, { credit: 14, research: 8, prestige: -2 }, 'ckw_jade_return'),
   C('Negotiate a dignified three-bow greeting citing ancestral royal customs', 40, { legitimacy: 9, prestige: 8, credit: 7 }, 'ckw_jade_return'),
   C('Hold head high and accept icy dismissal from the chamberlains', 0, { prestige: 10, legitimacy: 7, credit: -4 })
  ]);
 add('ckw_jade_return', 'Diplomacy', 'Caravans Heavy With Celadon and Mulberry Paper',
  'Even months later camels groan under blue-and-white porcelain crates, silk damask, and printed medical woodblocks—sparking awe across capital markets.',
  'followup', [
   C('Establish a permanent Bureau of Foreign Translations and Porcelain Kilns', 105, { research: 12, development: 1, credit: 9 }, 'ckw_jade_seal'),
   C('Auction luxury imperial silks cleanly to pay off embassy chests twice over', 0, { gold: 155, credit: 6 }, 'ckw_jade_seal')
  ]);
 add('ckw_jade_seal', 'Diplomacy', 'The Red-Ink Patent Hung in Hall',
  'Whether prized for silver profit or scholar-craft, the vermilion-stamped trade patent reshapes eastern merchant routes for a decade.',
  'followup', [
   C('Grant safe-conduct roads to returning Silk Road factors', 60, { credit: 10, trust: 7 }),
   C('Lock the jade patent beside crown treaties', 0, { legitimacy: 7, prestige: 6 })
  ]);

 // 31. Silk Road Bandits — The Lost Jade Caravan (3 stages)
 add('ckw_silk_bandits', 'Economy & Trade', 'Burnt Camels in the Red Gorge',
  'Dusty survivors stagger into your frontier caravanserai crying that desert raiders ambushed a forty-camel tea-and-jade train—making off toward sandstone caves with priceless lacquer chests.',
  'trade', [
   C('Launch swift frontier cavalry with local trackers to recover stolen goods', 120, { credit: 11, securityMonths: 9, prestige: 7 }, 'ckw_bandits_gorge'),
   C('Hire rival oasis clan guides to ransom merchant hostages and chests quietly', 80, { credit: 8, trust: 7 }, 'ckw_bandits_gorge'),
   C('Tighten inner pass gates and warn future caravans to hire deeper guards', 0, { securityMonths: 6, credit: -4 })
  ]);
 add('ckw_bandits_gorge', 'Economy & Trade', 'Lanterns Flashing Inside Sandstone Arches',
  'Tracking mule dung up a narrow dry wash, riders corner the raiders watering stolen beasts beside an underground spring.',
  'followup', [
   C('Storm the cave mouth at dawn and hang captured bandit chiefs above the pass', 45, { securityMonths: 11, credit: 9, legitimacy: 6 }, 'ckw_bandits_stone'),
   C('Offer spared lives if the clan serves forever as salaried pass-guards', 75, { securityMonths: 9, trust: 8, acceptance: 6 }, 'ckw_bandits_stone'),
   C('Cut off the canyon water-hole until raiders surrender starved out', 0, { securityMonths: 8, credit: 5 }, 'ckw_bandits_stone')
  ]);
 add('ckw_bandits_stone', 'Economy & Trade', 'Stone Caravanserai Rebuilt',
  'Iron-studded gates rise around the oasis well; silver bells on camel necks jingle steadily through the gorge again.',
  'followup', [
   C('Build fortified brick cisterns and watchtowers every half-day’s march', 95, { development: 1, credit: 10 }),
   C('Return recovered lacquer chests to grateful merchant guilds', 0, { trust: 9, prestige: 6 })
  ]);

 // 32. The Scholar-Engineer From the Imperial Academy (3 stages)
 add('ckw_imperial_engineer', 'Learning & Occult', 'Bamboo Waterwheels and Saltpeter Tubes',
  'A disgraced palace hydraulic engineer fleeing factional purges offers his rolled ink-blueprints for geared chain-pumps, river locks, and paper-making vats.',
  'research', [
   C('Welcome him warmly with salaried assistants and timber model-shops', 140, { research: 13, development: 1, tools: 18 }, 'ckw_engineer_lock'),
   C('Focus strictly on his agricultural irrigation chain-pumps first', 75, { food: 75, research: 8, tools: 12 }, 'ckw_engineer_lock'),
   C('Keep the foreigner discreetly out of capital fortresses lest rivals complain', 0, { securityMonths: 6, research: 4 })
  ]);
 add('ckw_engineer_lock', 'Learning & Occult', 'Timber Sluices Lifting River Barges',
  'Local guild carpenters mock bamboo sketches until his test double-gate canal lock lifts a laden grain barge twelve feet in quiet minutes.',
  'followup', [
   C('Commission stone canal locks and hydraulic bellows along royal rivers', 110, { development: 1, credit: 10, research: 9 }, 'ckw_engineer_book'),
   C('Bind his diagrams into illustrated workshop manuals for town guilds', 0, { research: 10, tools: 16 }, 'ckw_engineer_book')
  ]);
 add('ckw_engineer_book', 'Learning & Occult', 'Clean Ink on Mulberry Paper',
  'Water lifts wheat and drives iron hammers where men once hauled buckets till midnight—the exile’s revenge written in turning wheels.',
  'followup', [
   C('Grant him native citizenship and headship of a Royal Craft Bureau', 70, { research: 10, legitimacy: 6 }),
   C('Reward him generously in silver and archive the blueprints', 0, { prestige: 7, credit: 5 })
  ]);

 // 33. The Eunuch Admiral’s Porcelain Fleet (3 stages)
 add('ckw_treasure_fleet', 'Economy & Trade', 'Nine-Masted Junks Off the Estuary',
  'Towering cedar hulls painted with fierce eyes drop iron anchors off your harbor shoals; saffron-robed envoys request fresh water, bullocks, and an audience to trade silk for silver.',
  'crossroads_contact', [
   C('Stage a grand wharf reception and open regulated state spice-silver booths', 145, { credit: 13, prestige: 10, research: 7 }, 'ckw_fleet_exchange'),
   C('Provision their water casks hospitably while keeping armed watch on shore', 65, { trust: 8, credit: 7, securityMonths: 7 }, 'ckw_fleet_exchange'),
   C('Trade strictly at outer reef lighters and bar foreign crews from inner walls', 0, { securityMonths: 9, gold: 55, credit: 3 })
  ]);
 add('ckw_fleet_exchange', 'Economy & Trade', 'Gilded Giraffes and Magnetic Needles',
  'Their navigators astound your harbor captains with wet-compass bowls, watertight hull bulkheads, and astronomical star-rulers.',
  'followup', [
   C('Purchase compass bowls and bulkhead plans for royal shipyards', 95, { research: 12, development: 1, credit: 8 }, 'ckw_fleet_sail'),
   C('Exchange local woolens, glassware, and horse-saddles for celadon wares', 0, { gold: 120, credit: 8, prestige: 6 }, 'ckw_fleet_sail')
  ]);
 add('ckw_fleet_sail', 'Economy & Trade', 'Silk Sails Dipping Below the Horizon',
  'When the towering fleet weighs anchor on monsoon winds, harbor shipwrights already chalk bulkheads onto fresh oak keels.',
  'followup', [
   C('Charter deep-water navigational schools along the port', 80, { research: 10, credit: 8 }),
   C('Record the historic anchorage cleanly in city chronicles', 0, { prestige: 8, legitimacy: 5 })
  ]);

 // 34. Jade Dragon — The Tribute Horse Inspection (3 stages)
 add('ckw_tribute_horses', 'Diplomacy', 'Veterinarians Counting Teeth at the Gate',
  'Strict border horse-commissioners reject half your diplomatic caravan’s mounts as spavined and thin—threatening to slash tea-and-silk allotments unless better stock arrives.',
  'neighbor', [
   C('Send finest limestone-bred chargers immediately to uphold royal honor', 120, { relation: 14, prestige: 9, credit: 6 }, 'ckw_horses_tea'),
   C('Inspect the commissioners’ own scales—suspect bribes lurk behind rejections', 45, { relation: 6, legitimacy: 7, securityMonths: 7 }, 'ckw_horses_tea'),
   C('Accept modest tea bales for ordinary pack-ponies and avoid extra silver', 0, { credit: 4, relation: -3 })
  ]);
 add('ckw_horses_tea', 'Diplomacy', 'Pressed Brick Tea and Rolled Damask',
  'Satisfied inspectors stamp parchment passes cleanly; yet border merchants whisper nomadic smugglers sell cheap wild ponies under the counter.',
  'followup', [
   C('Outbid smugglers legally by offering honest silver coin at state horse-marts', 85, { credit: 10, relation: 10 }, 'ckw_horses_peace'),
   C('Set mounted patrols along dry canyon smugglers’ trails', 0, { securityMonths: 9, relation: 6 }, 'ckw_horses_peace')
  ]);
 add('ckw_horses_peace', 'Diplomacy', 'Tea Boiling Along Frontier Watchtowers',
  'Honest horse-fairs stitch highland pastures and silk towns together in steady peace.',
  'followup', [
   C('Fix permanent annual horse-for-tea quotas across borders', 60, { relation: 12, credit: 8 }),
   C('Close the autumn trade ledger cleanly', 0, { stability: 5, relation: 4 })
  ]);

 // =========================================================================
 // SWORD OF ISLAM — FURUSIYYA, SUFI DERVISHES, DECADENCE & WAQFS
 // =========================================================================

 // 35. Furūsiyya Cavalry Trials — Lance, Mace & Horse-Archery (4 stages)
 add('ckw_furusiyya_trials', 'Martial & Court', 'Dust Rising Above the Hippodrome',
  'Under striped silk awnings along the sandy maydan, mamluk and sipahi horsemen challenge royal guards in the classical Furūsiyya—jousting with reed lances, cleaving clay jars at full gallop.',
  'faith_islamic', [
   C('Endow silver stirrups, gilded quivers, and three days of open trials', 150, { prestige: 13, legitimacy: 8, stability: 5 }, 'ckw_furusiyya_archery'),
   C('Keep trials strictly martial for frontier cavalry captains without circus pomp', 70, { legitimacy: 7, prestige: 6, research: 4 }, 'ckw_furusiyya_archery'),
   C('Convert the maydan budget into dry barley sacks for frontier outposts', 0, { food: 65, stability: 4, prestige: -2 })
  ]);
 add('ckw_furusiyya_archery', 'Martial & Court', 'Three Arrows Loosed Before the Post',
  'A young provincial emir’s son amazes the stands by turning backward in the saddle to shatter three brass gourds—then loudly mocks capital guards as soft silk-wearers.',
  'followup', [
   C('Praise his brilliant horsemanship and appoint him instructor of royal pages', 75, { prestige: 9, legitimacy: 8, stability: 6 }, 'ckw_furusiyya_treatise'),
   C('Step onto a swift chestnut mare yourself to answer his challenge cleanly', 25, { prestige: 12, stability: 4, legitimacy: 7 }, 'ckw_furusiyya_treatise'),
   C('Award him the silver lance silently and let captains sort bruised pride', 0, { prestige: 5, stability: 4 }, 'ckw_furusiyya_treatise')
  ]);
 add('ckw_furusiyya_treatise', 'Martial & Court', 'Ink Sketches of Stirrup and Rein',
  'Grey-bearded instructors urge binding the week’s drills—lance couching, veterinary poultices, and desert watering—into an illustrated Furūsiyya manual.',
  'followup', [
   C('Commission illuminated cavalry treatises for every garrison commander', 85, { research: 11, prestige: 8, legitimacy: 6 }, 'ckw_furusiyya_close'),
   C('Keep training oral on the sand field where riders learn by sweat', 0, { stability: 5, prestige: 4 }, 'ckw_furusiyya_close')
  ]);
 add('ckw_furusiyya_close', 'Martial & Court', 'Cooling Horses Under Cypresses',
  'Hooves drum homeward past stone fountains; both frontier provinces and palace stables carry sharper pride.',
  'followup', [
   C('Establish annual spring Furūsiyya games as an honored dynastic rite', 65, { prestige: 10, legitimacy: 7 }),
   C('Thank the grooms and retire cleanly', 0, { stability: 6, prestige: 4 })
  ]);

 // 36. Sufi Dervish Hospice & Ecstatic Poetry (3 stages)
 add('ckw_sufi_tekke', 'Religion', 'Reed Flutes Beyond the Market Mosque',
  'A beloved Sufi master draws bakers, soldiers, and scholars alike to candlelit dhikr vigils in a hillside tekke—provoking stiff jurists who demand the music-filled lodge be shuttered.',
  'faith_islamic', [
   C('Endow a permanent charitable soup-kitchen waqf at the tekke and defend peaceful devotion', 120, { piety: 12, trust: 11, acceptance: 8 }, 'ckw_sufi_debate'),
   C('Invite both the Sufi sheikh and stern legalists to respectful dialogue at court', 55, { faithAuthority: 8, piety: 7, stability: 5 }, 'ckw_sufi_debate'),
   C('Order reed-flutes silenced after curfew to placate stern mosque elders', 0, { faithAuthority: 8, trust: -5, unrest: 4 })
  ]);
 add('ckw_sufi_debate', 'Religion', 'Rosewater and Legal Glosses',
  'Before silent courtiers the gentle sheikh recites verses of divine mercy that leave even the sternest jurist blinking—before asking only bread-flour for widows.',
  'followup', [
   C('Match the sheikh’s charity with grain barges and a library of mysticism', 85, { piety: 11, food: 40, research: 7 }, 'ckw_sufi_peace'),
   C('Confirm peaceful neighborhood status without treasury stipends', 0, { piety: 6, acceptance: 6, stability: 5 }, 'ckw_sufi_peace')
  ]);
 add('ckw_sufi_peace', 'Religion', 'Lanterns Glow Along the Hillside',
  'Warm lentil soup ladled beside reed-flutes turns restless poor quarters into quiet gardens of loyalty.',
  'followup', [
   C('Protect traveler hospices along caravan routes under the same Sufi order', 70, { trust: 10, credit: 6, piety: 8 }),
   C('Attend Friday prayers quietly and return to statecraft', 0, { piety: 7, legitimacy: 5 })
  ]);

 // 37. The Ulema’s Remonstrance Against Palace Luxury (3 stages)
 add('ckw_ulema_remonstrance', 'Religion', 'Unbleached Wool Before Silk Cushions',
  'Senior qadis enter hall in plain undyed wool, presenting a grave scroll warning that gilded wine-ewers, unlawful market tolls, and pampered kin invite divine ruin—as befell softer dynasties.',
  'lowFaithAuthority', [
   C('Receive the rebuke humbly, abolish unlawful tolls, and endow a public hospital', 130, { piety: 13, faithAuthority: 12, legitimacy: 9 }, 'ckw_ulema_reform'),
   C('Trim ostentatious court banquets quietly while defending lawful treasury customs', 55, { faithAuthority: 8, inflation: -2, stability: 5 }, 'ckw_ulema_reform'),
   C('Dismiss sermonizing elders cleanly; empires stand on iron, not sackcloth', 0, { prestige: 6, faithAuthority: -6, unrest: 4 })
  ]);
 add('ckw_ulema_reform', 'Religion', 'Silver Plate Sent to the Mint',
  'Carts of redundant palace silver bowls roll out to pay frontier soldiers and repair aqueducts, silencing tavern satire overnight.',
  'followup', [
   C('Charter a great stone madrasa and legal college beside the Friday mosque', 110, { research: 10, faithAuthority: 10, development: 1 }, 'ckw_ulema_seal'),
   C('Publish austere household rules governing royal stipends', 0, { legitimacy: 8, inflation: -2, piety: 7 }, 'ckw_ulema_seal')
  ]);
 add('ckw_ulema_seal', 'Religion', 'Clean Scales in the Bazaar',
  'Friday sermons ring with genuine blessings for a ruler who chose steel clarity over velvet rot.',
  'followup', [
   C('Appoint upright market muhtasibs to inspect weights weekly', 55, { trust: 10, credit: 7 }),
   C('Keep simple fare on the royal table', 0, { piety: 8, stability: 5 })
  ]);

 // 38. The Astronomical Zij Observatory of Samarkand Style (3 stages)
 add('ckw_zij_observatory', 'Learning & Occult', 'A Marble Sextant Sunk Into Bedrock',
  'Learned court astronomers beg crown silver to excavate a monumental sixty-cubit marble meridian trench—promising lunar and planetary tables unmatched from Cordoba to Delhi.',
  'research', [
   C('Fund the marble sextant trench, brass rings, and salaried observers', 160, { research: 15, prestige: 11, development: 1 }, 'ckw_zij_lens'),
   C('Equip a modest rooftop brass armillary terrace above the madrasa', 75, { research: 9, prestige: 6 }, 'ckw_zij_lens'),
   C('Postpone stone monuments until granaries and garrisons overflow', 0, { food: 40, stability: 4 })
  ]);
 add('ckw_zij_lens', 'Learning & Occult', 'Sunlight Falling Through the Roof Aperture',
  'Every noon a blazing coin of sunlight marches across engraved marble degrees; mathematicians debate tiny fractional discrepancies with old Alexandrian tables.',
  'followup', [
   C('Sponsor ten years of unbroken star-logs and bind the royal Zij tables', 100, { research: 14, prestige: 10, legitimacy: 6 }, 'ckw_zij_legacy'),
   C('Apply improved solar calendar corrections immediately to tax & sowing rolls', 0, { credit: 8, food: 45, research: 7 }, 'ckw_zij_legacy')
  ]);
 add('ckw_zij_legacy', 'Learning & Occult', 'Stars Fixed on Gilded Brass',
  'Sailors, farmers, and mosque timekeepers alike adjust prayers and voyages by the realm’s luminous tables.',
  'followup', [
   C('Send bound copies as royal gifts to foreign academies', 60, { prestige: 11, research: 7 }),
   C('Keep astronomers working quietly atop the hill', 0, { research: 8, stability: 4 })
  ]);

 // =========================================================================
 // RAJAS OF INDIA — FESTIVAL OF LIGHTS, GURUS, TEMPLE TANKS & ELEPHANTS
 // =========================================================================

 // 39. Festival of Lights — Ten Thousand Clay Lamps (4 stages)
 add('ckw_diwali_lamps', 'Culture & Learning', 'Oil Boats Floating Down the River Steps',
  'On the moonless autumn eve of Diwali, temple priests and spice-guild elders ask the crown to underwrite ten thousand clay oil-lamps along ghats, forts, and bazaar roofs.',
  'faith_dharmic', [
   C('Light every battlement, bridge, and river ghat with saffron oil and music', 145, { trust: 12, prestige: 11, piety: 10 }, 'ckw_diwali_bazaar'),
   C('Sponsor modest neighborhood lamps while opening free sweet-rice kitchens', 75, { trust: 11, food: -20, unrest: -8 }, 'ckw_diwali_bazaar'),
   C('Keep palace torches lit strictly for security and spare oil levies', 0, { stability: 4, trust: -4 })
  ]);
 add('ckw_diwali_bazaar', 'Culture & Learning', 'Fireworks Sparkling Over Cloth Stalls',
  'Joyous crowds pack narrow spice lanes; amidst firecrackers and brass bells, a careless spark sets an awning ablaze near the cotton dealers’ row.',
  'followup', [
   C('Lead watchmen calmly with sand-carts and compensate any scorched booths', 65, { trust: 10, stability: 7, legitimacy: 6 }, 'ckw_diwali_ledgers'),
   C('Douse the awning swiftly with river buckets and clear narrow lanes', 0, { stability: 5, unrest: -4 }, 'ckw_diwali_ledgers')
  ]);
 add('ckw_diwali_ledgers', 'Culture & Learning', 'New Red Cloth Ledgers Opened at Dawn',
  'Next morning merchants open fresh saffron-blessed account books; guilds wait to hear royal customs terms for the coming commercial year.',
  'followup', [
   C('Trim nuisance bridge tolls to ignite winter river commerce', 55, { credit: 11, trust: 9, development: 1 }, 'ckw_diwali_close'),
   C('Bless the merchants’ scales cleanly and uphold steady rates', 0, { credit: 6, legitimacy: 6 }, 'ckw_diwali_close')
  ]);
 add('ckw_diwali_close', 'Culture & Learning', 'Ash Floating Past Dawn Prayers',
  'Warm marigold petals drift seaward while full markets hum—prosperity and sacred custom bound in warm light.',
  'followup', [
   C('Endow permanent stone ghat steps and bronze river lanterns', 85, { development: 1, piety: 8, prestige: 8 }),
   C('Retire quietly after festival duties', 0, { trust: 5, stability: 4 })
  ]);

 // 40. The Guru’s Philosophical Debate — Courtyard Banyan Tree (3 stages)
 add('ckw_guru_banyan', 'Religion', 'Silk Scholars and Barefoot Poets Beneath Roots',
  'Beneath an ancient banyan outside the royal temple, a renowned Advaita sage and an ardent Bhakti poet draw thousands to fierce yet courteous debate over ritual caste vs devotion of the heart.',
  'faith_dharmic', [
   C('Preside honorably, award silk shawls to both thinkers, and protect free assembly', 100, { acceptance: 12, research: 9, piety: 9 }, 'ckw_guru_crowd'),
   C('Patronize the inclusive poet’s vernacular hymns to bind common folk closer', 65, { trust: 11, unrest: -8, piety: 8 }, 'ckw_guru_crowd'),
   C('Uphold strict classical temple orthodoxy to reassure conservative lineages', 0, { faithAuthority: 9, legitimacy: 5, acceptance: -4 })
  ]);
 add('ckw_guru_crowd', 'Religion', 'Palm-Leaf Manuscripts Copied by Moonlight',
  'Local weavers and scribes copy vernacular couplets onto dried palm leaves; orthodox priests frown at unlettered villagers debating Sanskrit axioms.',
  'followup', [
   C('Establish a shared multilingual scriptorium translating classics into tongue of the street', 90, { research: 11, acceptance: 10, development: 1 }, 'ckw_guru_peace'),
   C('Encourage respectful concord between temple halls and village shrines', 0, { trust: 7, stability: 6 }, 'ckw_guru_peace')
  ]);
 add('ckw_guru_peace', 'Religion', 'Lamp-Wicks Lit Beside Both Doors',
  'Argument softens into song; scholars and villagers alike remember a throne spacious enough for both Sanskrit ink and open hearts.',
  'followup', [
   C('Endow public rest-pavements and water pots along pilgrim paths', 65, { piety: 9, trust: 9 }),
   C('Close the debate cleanly with garlands', 0, { acceptance: 6, stability: 4 })
  ]);

 // 41. Royal Stepwell & Temple Tank — Monsoon Water Engineering (4 stages)
 add('ckw_temple_stepwell', 'Economy & Trade', 'A Hundred Carved Steps Down to Cool Jade Water',
  'Before summer heat cracks plateau wells dry, royal stone-carvers propose excavating a vast geometrically stepped stone tank linked by underground channels to monsoon ridges.',
  'land', [
   C('Fund a grand seven-tier carved sandstone stepwell and shaded pavilions', 170, { development: 1, food: 80, trust: 12 }, 'ckw_stepwell_rock'),
   C('Dig practical unadorned stone reservoirs across three dry villages instead', 95, { food: 95, trust: 10, credit: 5 }, 'ckw_stepwell_rock'),
   C('Dredge existing earthen village ponds with ordinary corvee teams', 0, { food: 40, trust: 4, unrest: 2 })
  ]);
 add('ckw_stepwell_rock', 'Economy & Trade', 'Granite Struck Thirty Feet Below',
  'Iron chisels ring spark against unexpected blue basalt veins; master masons ask for tempered steel wedges and lamp-oil to cut deeper toward the aquifer.',
  'followup', [
   C('Supply tempered steel chisels and double shifts before monsoon rains hit', 105, { tools: 18, research: 7, development: 1 }, 'ckw_stepwell_monsoon'),
   C('Widen shallow upper catch-basins instead of blasting deeper rock', 0, { food: 45, stability: 4 }, 'ckw_stepwell_monsoon')
  ]);
 add('ckw_stepwell_monsoon', 'Economy & Trade', 'Rain Roaring Down Carved Channels',
  'When dark monsoon clouds break in July, turquoise water cascades down stepped reliefs, filling every lower gallery to the lotus frieze.',
  'followup', [
   C('Consecrate the tank with garlands and carve irrigation water-sharing rules', 55, { legitimacy: 8, trust: 10, piety: 8 }, 'ckw_stepwell_end'),
   C('Post clean well-wardens to guard drinking steps from cattle', 0, { trust: 7, stability: 5 }, 'ckw_stepwell_end')
  ]);
 add('ckw_stepwell_end', 'Economy & Trade', 'Cool Shade in May Noon',
  'Travelers descend thirty degrees cooler beneath carved pillars; drought holds fewer teeth over villages guarded by cut stone.',
  'followup', [
   C('Link outer canals cleanly to sugarcane and rice paddies', 75, { food: 85, credit: 8 }),
   C('Leave the gleaming reservoir to village elders’ care', 0, { trust: 6, legitimacy: 5 })
  ]);

 // 42. The Sacred White Elephant of the Border Forest (3 stages)
 add('ckw_white_elephant', 'Imperial & Heritage', 'Alabaster Tusks Behind Bamboo Mist',
  'Teak-loggers emerge trembling from misty hills swearing a rare pale-skinned tusker leads a wild herd near the frontier river—every priest cries an omen of sovereign dharma.',
  'faith_dharmic', [
   C('Send skilled mahouts with tame koonki elephants to capture and honor the royal beast', 145, { prestige: 14, legitimacy: 10, piety: 8 }, 'ckw_elephant_stables'),
   C('Dispatch heralds quietly so rival neighbors do not poach the forest omen', 65, { securityMonths: 8, prestige: 8 }, 'ckw_elephant_stables'),
   C('Leave wild forest kings free beneath teak canopy and bless the mountain', 0, { piety: 9, trust: 6 })
  ]);
 add('ckw_elephant_stables', 'Imperial & Heritage', 'Silk Umbrella Over Carved Ivory',
  'Guided gently between veteran females, the majestic pale tusker enters royal stables—yet daily sugar-cane, rice-balls, and gilded canopies cost a small fortress’s pay.',
  'followup', [
   C('Build a pavilion beside the palace temple and display him on high feast days', 95, { prestige: 12, trust: 9, piety: 8 }, 'ckw_elephant_march'),
   C('Keep feeding modest and assign veteran keepers to gentle calm care', 0, { legitimacy: 6, stability: 5 }, 'ckw_elephant_march')
  ]);
 add('ckw_elephant_march', 'Imperial & Heritage', 'Silver Bells Moving Through Crowds',
  'Foreign ambassadors gaze upward in silent awe as the pale tusker steps past silk banners—a living emblem of auspicious rule.',
  'followup', [
   C('Mint commemorative coins bearing the white elephant crest', 60, { prestige: 9, credit: 6 }),
   C('Bless the royal stables cleanly', 0, { piety: 7, legitimacy: 5 })
  ]);

 // =========================================================================
 // CONCLAVE, WAY OF LIFE, REPUBLIC, HORSE LORDS, JADE DRAGON, ISLAM, RAJAS
 // =========================================================================

 // 43. Conclave — The Regency Treasure Chest Audit (3 stages)
 add('ckw_regency_chest', 'Succession', 'Rusty Hinges on the Mint Ledger',
  'As minority council accounts close, sharp-eyed clerks notice three leather bullion sacks listed on parchment—yet missing beneath the regent’s triple-locked floorboard.',
  'regency', [
   C('Summon the regent privately to restore missing bullion before scandal breaks', 35, { legitimacy: 9, gold: 110, stress: 5 }, 'ckw_chest_reckon'),
   C('Open a public audit before estates regardless of bruised noble pride', 60, { legitimacy: 11, stability: 5, stress: 6 }, 'ckw_chest_reckon'),
   C('Seal the old discrepancies quietly to keep the fragile regency coalition intact', 0, { stability: 6, credit: -3, stress: 4 })
  ]);
 add('ckw_chest_reckon', 'Succession', 'A Stuttered Excuse About Frontier Roads',
  'Sweating beneath fur collars, the regent pleads he spent the silver secretly bribing unruly border riders—yet produces only half a stack of smudged tallies.',
  'followup', [
   C('Accept partial estate bonds as restitution and strip his treasury seal cleanly', 20, { legitimacy: 10, credit: 7, stability: 5 }, 'ckw_chest_close'),
   C('Confiscate his townhouse plate and appoint a sober guild auditor', 0, { gold: 120, securityMonths: 8, legitimacy: 7 }, 'ckw_chest_close')
  ]);
 add('ckw_chest_close', 'Succession', 'Three Fresh Locks on the Strongbox',
  'From this watch onward no single councillor carries all three vault keys across the threshold.',
  'followup', [
   C('Institute dual-signature crown warrants for all treasury outlays', 50, { credit: 9, legitimacy: 8 }),
   C('Lock the audited books cleanly', 0, { securityMonths: 7, stability: 4 })
  ]);

 // 44. Conclave — The Shy Ward’s First Audience (3 stages)
 add('ckw_ward_shy', 'Family', 'Trembling Boots on Marble',
  'Though brilliant with Latin histories, your adolescent ward freezes white-faced before noisy petitioners—stammering mid-sentence while mocking pages stifle grins behind pillars.',
  'wardGuardian', [
   C('Coach the youth gently in small evening supper speeches before loyal friends', 75, { education: 14, opinion: 12, stress: -4 }, 'ckw_shy_rehearsal'),
   C('Assign a stern rhetoric master and mandate daily public readings', 40, { education: 12, opinion: -4, stress: 4 }, 'ckw_shy_rehearsal'),
   C('Let the child work quietly behind clerks; quiet rulers often outlast loud ones', 0, { education: 7, opinion: 6, stability: 3 })
  ]);
 add('ckw_shy_rehearsal', 'Family', 'Finding Voice Beside the Hearth',
  'Two months of patient practice pay off: when provincial mayors present petitions on timber bridges, the young dynast answers clearly without dropping eyes.',
  'followup', [
   C('Entrust the youth with delivering the autumn harvest proclamation', 45, { education: 14, prestige: 7, opinion: 10 }, 'ckw_shy_bloom'),
   C('Praise steady composure warmly in private study', 0, { opinion: 10, education: 8 }, 'ckw_shy_bloom')
  ]);
 add('ckw_shy_bloom', 'Family', 'Respect Won Without Bluster',
  'Courtiers stop whispering behind pillars; thoughtful precision commands a room louder than shouted boasts.',
  'followup', [
   C('Present the heir a silver signet for provincial correspondence', 55, { education: 10, legitimacy: 6 }),
   C('Resume regular studies calmly', 0, { stability: 4, opinion: 5 })
  ]);

 // 45. Conclave — Levy Faction Ultimatum in the Shires (3 stages)
 add('ckw_levy_ultimatum', 'Politics', 'Empty Muster Fields Beyond the River',
  'Disgruntled county lords withhold winter pikemen behind bolted manor gates, insisting prolonged wars drained village plows past custom.',
  'levyFaction', [
   C('Meet faction spokesmen halfway: cap campaign days and pay cash boot-silver', 120, { factionPressure: -24, factionLoyalty: 10, stability: 5 }, 'ckw_levy_muster'),
   C('Serve royal distraint writs seizing two horses from every absent manor', 30, { legitimacy: 8, factionPressure: -12, factionLoyalty: -6 }, 'ckw_levy_muster'),
   C('Hire foreign crossbowmen quietly while bypassing stubborn lords', 145, { prestige: 5, factionPressure: -8, credit: -2 }),
   C('Hold frontier gates with loyal household banners and wait the barons out', 0, { stability: 4, factionPressure: -4 })
  ]);
 add('ckw_levy_muster', 'Politics', 'Spears Leaning Against Parish Walls',
  'Moderate knights urge compromise: clear rotational service lists would bring banners riding back without breaking spring sowing.',
  'followup', [
   C('Publish transparent rotating shire-muster rosters exempting harvest weeks', 65, { factionPressure: -18, factionLoyalty: 12, food: 35 }, 'ckw_levy_peace'),
   C('Demand immediate oath renewal from every captain present', 0, { legitimacy: 8, factionPressure: -8 }, 'ckw_levy_peace')
  ]);
 add('ckw_levy_peace', 'Politics', 'Banners Returning Under Discipline',
  'Measured service charters turn mutinous grumbling back into reliable steel along the frontier.',
  'followup', [
   C('Confirm veteran tax exemptions for three-campaign soldiers', 55, { factionLoyalty: 10, legitimacy: 6 }),
   C('Dismiss the faction envoys cleanly', 0, { factionPressure: -8, stability: 5 })
  ]);

 // 46. Conclave — Claimant Faction Whispering at Midnight (3 stages)
 add('ckw_claimant_whisper', 'Succession', 'Painted Cups at the Pretender’s Inn',
  'Informants report restless lords gathering inside a riverside tavern to toast a rival dynast’s birthright—waiting only for one bold spark.',
  'claimantFaction', [
   C('Invite wavering faction barons straight to council and heal real tax grievances', 110, { factionPressure: -24, factionLoyalty: 10, legitimacy: 6 }, 'ckw_claimant_table'),
   C('Split the faction cleanly by arresting its boldest recruiter before dawn', 50, { securityMonths: 11, factionPressure: -18, stability: 4 }, 'ckw_claimant_table'),
   C('Double watch-fires outside the palace and let tavern braggarts talk', 0, { securityMonths: 7, factionPressure: 4 })
  ]);
 add('ckw_claimant_table', 'Succession', 'Sullen Silence Around Roast Venison',
  'Face to face across the table, moderate barons confess they backed the claimant solely out of fear your treasury planned forced manor loans.',
  'followup', [
   C('Swear publicly to raise loans solely through open estate assemblies', 60, { factionPressure: -20, legitimacy: 9, credit: 6 }, 'ckw_claimant_end'),
   C('Hold gentle hostages from borderline houses as sureties of winter peace', 0, { securityMonths: 9, factionPressure: -12, factionLoyalty: -4 }, 'ckw_claimant_end')
  ]);
 add('ckw_claimant_end', 'Succession', 'Empty Booths at the Riverside Inn',
  'Within a fortnight the tavern returns to selling sour ale to carters; sedition cools when crown strength meets clear law.',
  'followup', [
   C('Grant steady loyalists fresh frontier wardships', 65, { factionLoyalty: 12, legitimacy: 6 }),
   C('Keep watchmen discreetly patrolling taverns', 0, { securityMonths: 8, stability: 4 })
  ]);

 // 47. Conclave — Independence Faction’s Border Congress (3 stages)
 add('ckw_border_congress', 'Politics', 'Strange Tongues Under Ancient Banners',
  'Magnates from a distant coastal march summon a separate estate diet in their own dialect, hinting they owe allegiance only to personal oaths, not distant capital clerks.',
  'independenceFaction', [
   C('Attend their regional diet in person wearing local dress and charter fair autonomy', 135, { factionPressure: -25, factionLoyalty: 12, legitimacy: 7 }, 'ckw_congress_seal'),
   C('Dispatch loyal commissioners offering customs relief while barring separate diets', 65, { factionPressure: -16, credit: 6, stability: 4 }, 'ckw_congress_seal'),
   C('Declare unlawful regional assemblies void and strengthen frontier citadels', 0, { legitimacy: 7, securityMonths: 9, factionLoyalty: -6 })
  ]);
 add('ckw_congress_seal', 'Politics', 'Two Seals Side by Side',
  'Proud coastal elders soften when treated as ancient partners rather than conquered tenants—yet demand bilingual judges in county halls.',
  'followup', [
   C('Guarantee bilingual courts and local toll-reinvestment charters', 80, { factionPressure: -20, factionLoyalty: 12, stability: 7 }, 'ckw_congress_peace'),
   C('Confirm customary border privileges under strict royal appellate courts', 0, { legitimacy: 8, factionPressure: -12 }, 'ckw_congress_peace')
  ]);
 add('ckw_congress_peace', 'Politics', 'One Realm With Breathing Room',
  'Harbor beacons burn peacefully along the coast—proof that elastic steel holds empires together better than brittle iron.',
  'followup', [
   C('Endow frontier roads binding the coastal march to capital fairs', 85, { credit: 8, factionLoyalty: 8 }),
   C('Ratify the concordat cleanly', 0, { legitimacy: 7, stability: 5 })
  ]);

 // 48. Way of Life — The Master Chef’s Grand Carousing Banquet (3 stages)
 add('ckw_swan_banquet', 'Lifestyle', 'Four-and-Twenty Larks Baked Under Crust',
  'To win over suspicious palace officers, you hire a celebrated Savoyard master cook to stage an unforgettable midnight feast of gilded swans, marzipan castles, and sweet hippocras.',
  'focus_diplomacy', [
   C('Spare no saffron or sugar; dazzle every noble guest into warm fellowship', 135, { focusXP: 28, prestige: 12, stress: -12 }, 'ckw_swan_toast'),
   C('Keep dishes hearty, honest, and plentiful without ridiculous gold leaf', 65, { focusXP: 22, stability: 6, stress: -10 }, 'ckw_swan_toast'),
   C('Serve plain mutton and ale; good soldiers despise sugared castles', 0, { focusXP: 12, stability: 4, stress: -4 })
  ]);
 add('ckw_swan_toast', 'Lifestyle', 'Laughter Breaking Stiff Collars',
  'When live doves flutter out of a pastry tower, even two bitter captains burst out laughing and clink goblets across the salt-cellar.',
  'followup', [
   C('Invite guests to sign a lighthearted fellowship pact beside the hearth', 45, { focusXP: 24, stability: 8, legitimacy: 6 }, 'ckw_swan_morning'),
   C('Send leftover roast platters straight out to gate-guards and beggars', 0, { piety: 8, focusXP: 16, prestige: 6 }, 'ckw_swan_morning')
  ]);
 add('ckw_swan_morning', 'Lifestyle', 'Warm Goodwill After Midnight',
  'Shared laughter lingers in council halls—smooth diplomacy often begins over well-spiced venison.',
  'followup', [
   C('Retain the clever Savoyard cook for visiting foreign embassies', 60, { prestige: 9, focusXP: 16 }),
   C('Return briskly to morning dispatches', 0, { stability: 5, stress: -4 })
  ]);

 // 49. Way of Life — The Tiger / Wolf Pack Hunt in Reed Brakes (3 stages)
 add('ckw_reed_tiger', 'Lifestyle', 'Stripes Moving Through Tall Elephant Grass',
  'Terrified reed-cutters flee river marshes after a man-eating predator drags off two oxen; local lords dare you to lead beaters on horseback into chest-high reeds.',
  'focus_martial', [
   C('Mount beaters with drums, crossbows, and iron-tipped lances at dawn', 95, { focusXP: 28, prestige: 11, stability: 5 }, 'ckw_reed_circle'),
   C('Send veteran trap-setters with baited pits while guarding village herds', 45, { focusXP: 20, stability: 6 }, 'ckw_reed_circle'),
   C('Burn a controlled firebreak through dry reeds to drive the beast out safely', 0, { focusXP: 16, prestige: 5, stress: -3 })
  ]);
 add('ckw_reed_circle', 'Lifestyle', 'Screaming Elephants and Snapping Bamboo',
  'As drums tighten the ring, yellow eyes flash ten yards ahead—your skittish horse rears just as the great cat launches from wet sedge.',
  'followup', [
   C('Roll cleanly aside and let veteran crossbows drop it safely', 25, { focusXP: 20, prestige: 8, stability: 5 }, 'ckw_reed_skin'),
   C('Hold stirrups firm and drive a clean spear-thrust through the leap', 0, { focusXP: 28, prestige: 14, stress: -6 }, 'ckw_reed_skin')
  ]);
 add('ckw_reed_skin', 'Lifestyle', 'Lanterns Around the Trophy Cart',
  'Villagers dance behind the cart bearing the striped hide; songs of steady royal nerves echo past every river landing.',
  'followup', [
   C('Pay silver rewards to bruised beaters and gift pelts to temple guardians', 55, { prestige: 9, piety: 6, focusXP: 14 }),
   C('Hang the hide above the guardhouse hearth', 0, { prestige: 8, stability: 4 })
  ]);

 // 50. Way of Life — Foreign Marriage Household Friction (3 stages)
 add('ckw_foreign_kitchen', 'Family', 'Spices, Language, and Homesick Tears',
  'Months after a grand dynastic match, your foreign consort’s native retinue clashes angrily with palace stewards over strange fasting calendars, loud chaplains, and homesick solitude.',
  'foreignMarriage', [
   C('Build a sunlit wing honoring your consort’s homeland dishes, music, and tongue', 120, { opinion: 20, relation: 12, stress: -6 }, 'ckw_foreign_garden'),
   C('Mediate clear household rules respecting both customs equally at table', 55, { opinion: 14, relation: 8, stability: 5 }, 'ckw_foreign_garden'),
   C('Insist foreign attendants adopt capital speech and dress without exception', 0, { legitimacy: 5, opinion: -14, relation: -8 })
  ]);
 add('ckw_foreign_garden', 'Family', 'Two Lutes Played in Harmony',
  'Invited to sample spiced almond sweets from your consort’s homeland, sceptical courtiers slowly warm to foreign melodies drifting across summer courtyards.',
  'followup', [
   C('Sponsor translated poetry and culinary exchanges between both courts', 70, { relation: 14, opinion: 14, research: 6 }, 'ckw_foreign_peace'),
   C('Keep quiet domestic kindnesses flowing away from gossips', 0, { opinion: 10, stress: -6 }, 'ckw_foreign_peace')
  ]);
 add('ckw_foreign_peace', 'Family', 'Letters Sent Homeward Full of Praise',
  'Warm dispatches crossing borders strengthen alliance ties tighter than dry parchment clauses.',
  'followup', [
   C('Host an annual heritage feast celebrating both lineages', 60, { relation: 12, opinion: 12, prestige: 6 }),
   C('Let quiet household harmony deepen', 0, { stability: 5, opinion: 6 })
  ]);

 // 51. Way of Life — The Adult Heir’s Reckless Tavern Debt (3 stages)
 add('ckw_heir_debt', 'Family', 'Dice Cups and Signed IOU Slips',
  'A discreet moneylender slides three wax-sealed IOUs across your council desk—signed by your adult heir after losing steep wagers on horse races and Venetian dice.',
  'adultHeir', [
   C('Settle the debt quietly, haul the heir into treasury audits for six months', 110, { education: 14, opinion: -6, legitimacy: 6 }, 'ckw_heir_audit'),
   C('Pay half immediately and force the heir to sell personal jewels for the rest', 55, { education: 15, credit: 5, opinion: -8 }, 'ckw_heir_audit'),
   C('Pay the lender cleanly with a warm hug—youth spends silver, wisdom comes later', 135, { opinion: 16, stress: -4, education: 4 }),
   C('Leave the prodigal to barter personal spurs with creditors cleanly', 0, { legitimacy: 5, opinion: -12, education: 6 })
  ]);
 add('ckw_heir_audit', 'Family', 'Stiff Backs Over Exchequer Tallies',
  'Chastened and ink-stained beside grey-haired auditors, the young royal actually catches a genuine contractor’s double-charge on lime mortar.',
  'followup', [
   C('Praise the sharp catch openly and entrust real mint oversight', 45, { education: 14, opinion: 14, credit: 7 }, 'ckw_heir_mature'),
   C('Keep the young royal steadily at daily ledgers till winter', 0, { education: 10, credit: 4 }, 'ckw_heir_mature')
  ]);
 add('ckw_heir_mature', 'Family', 'Dice Cups Put Away for Good',
  'Next spring the heir strides past race-booths smiling cleanly—having learned what coin costs when earned by sweat.',
  'followup', [
   C('Award a modest independent manor stewardship as a test', 60, { education: 12, legitimacy: 7 }),
   C('Close the old gambling roll cleanly', 0, { stability: 5, opinion: 6 })
  ]);

 // 52. Way of Life — Childless Monarch’s Succession Anxiety (3 stages)
 add('ckw_empty_cradle', 'Family', 'Quiet Corridors Beside the Nursery',
  'Years pass without a cradle rocking behind carved oak doors; whispers ripple along council benches whenever a winter cough lingers too long.',
  'childless', [
   C('Consult gentle physicians and endow orphanages in quiet hope of blessing', 115, { piety: 10, legitimacy: 7, stress: -8 }, 'ckw_cradle_counsel'),
   C('Draft crystal-clear collateral succession patents so barons fear no chaos', 60, { legitimacy: 11, stability: 8, stress: -5 }, 'ckw_cradle_counsel'),
   C('Silence succession gossip sternly and pour strength into lasting law', 0, { legitimacy: 6, securityMonths: 7, stress: 4 })
  ]);
 add('ckw_cradle_counsel', 'Family', 'Old Cousins Eyeing Heraldic Rolls',
  'Rumors of clean legal contingencies bring elder collateral cousins to court—eager to prove loyal steadiness rather than plot rash claims.',
  'followup', [
   C('Foster promising young cousins inside the palace school under royal eye', 80, { legitimacy: 9, stability: 7, stress: -6 }, 'ckw_cradle_calm'),
   C('Keep succession records sealed inside triple-locked treasury chests', 0, { securityMonths: 9, legitimacy: 6 }, 'ckw_cradle_calm')
  ]);
 add('ckw_cradle_calm', 'Family', 'A Throne Anchored Beyond Panic',
  'Whether providence later blesses the nursery or passes the crown cleanly by law, calm foresight steals fuel from civil war.',
  'followup', [
   C('Witness the succession charter publicly before cathedral prelates', 50, { legitimacy: 10, piety: 6 }),
   C('Rest easier knowing the realm stands secure', 0, { stress: -10, stability: 5 })
  ]);

 // 53. Republic — The Spice Galley Wrecked Off Stormy Shoals (3 stages)
 add('ckw_spice_wreck', 'Economy & Trade', 'Cloves Washing Ashore With Broken Oars',
  'Autumn gales dash the guild flagship onto jagged coastal reefs; salvagers haul sodden chests of nutmeg up cliffs while foreign wreckers eye stranded hull timbers.',
  'gov_republic', [
   C('Dispatch armed salvage barges and pay honest finder-shares to coastal villagers', 115, { credit: 10, trust: 11, gold: 85 }, 'ckw_wreck_salvage'),
   C('Guard the reef relentlessly with naval cutters and seize every crate by crown writ', 45, { gold: 130, securityMonths: 8, trust: -4 }, 'ckw_wreck_salvage'),
   C('Write off drowned freight cleanly and claim marine insurance payouts', 0, { credit: 5, stability: 4 })
  ]);
 add('ckw_wreck_salvage', 'Economy & Trade', 'Lanterns Over Wet Sand at Midnight',
  'Brave coastal divers rescue the captain’s bronze strongbox and eighty unbroken jars of camphor oil before morning tide breaks the keel.',
  'followup', [
   C('Build a stone lighthouse beacon atop the treacherous cape at once', 105, { development: 1, credit: 11, research: 6 }, 'ckw_wreck_beacon'),
   C('Reward the divers in silver and auction damp spices at half-rate', 0, { gold: 105, trust: 8 }, 'ckw_wreck_beacon')
  ]);
 add('ckw_wreck_beacon', 'Economy & Trade', 'Clean Flame Above White Spray',
  'Pitch braziers blaze nightly over the reef—turning a ship-graveyard into a steady landmark for merchant fleets.',
  'followup', [
   C('Levy a tiny penny light-due on passing hulls to keep oil burning forever', 40, { credit: 9, development: 1 }),
   C('Log the rescued strongbox cleanly in guild books', 0, { stability: 5, credit: 5 })
  ]);

 // 54. Republic — The Silk Loom Monopoly War (3 stages)
 add('ckw_silk_looms', 'Economy & Trade', 'Draw-Looms Smashed in Midnight Alleys',
  'Master velvet weavers strike when bold merchant contractors introduce water-powered silk-throwing mills outside city gates—slashing spinning time by fourfold.',
  'crossroads_finance', [
   C('Compensate old weavers with mill shares and charter modern water-powered sheds', 145, { development: 1, credit: 12, trust: 8 }, 'ckw_looms_accord'),
   C('Protect hand-weavers inside walls while permitting water-mills for export yarn only', 70, { trust: 9, tools: 18, credit: 7 }, 'ckw_looms_accord'),
   C('Smash unauthorized water-wheels to keep ancient guild peace intact', 0, { unrest: -6, stability: 5, credit: -5 })
  ]);
 add('ckw_looms_accord', 'Economy & Trade', 'Wooden Spindles Humming Beside Mill-Races',
  'When guild elders see bright thrown warp-threads double their own velvet output without starving families, sullen suspicion turns to curiosity.',
  'followup', [
   C('Open a municipal school teaching water-mill gear carpentry to guild sons', 85, { research: 10, tools: 20, credit: 8 }, 'ckw_looms_boom'),
   C('Standardize silk dye quality seals across both old and new shops', 0, { credit: 9, trust: 7 }, 'ckw_looms_boom')
  ]);
 add('ckw_looms_boom', 'Economy & Trade', 'Crimson Damask Bound for Northern Fairs',
  'Twice as many velvet bolts cross mountain passes at sharper profit—making your port the envy of rival wool towns.',
  'followup', [
   C('Reinvest silk customs into deep-water pier dredging', 80, { development: 1, credit: 10 }),
   C('Collect clean export duties at harbor gates', 0, { gold: 115, credit: 5 })
  ]);

 // 55. Horse Lords — The Rival Khan’s Falconry Challenge (3 stages)
 add('ckw_steppe_eagles', 'Diplomacy', 'Golden Eagles Hooded in Red Felt',
  'A proud neighboring steppe chieftain rides to your autumn hunt bearing chained golden eagles trained to pull down wolves—loudly wagering five hundred mares against your hunters.',
  'hostile', [
   C('Accept the bold wager cheerfully and feast his riders under bright yak-banners', 100, { relation: 15, prestige: 11, stability: 4 }, 'ckw_eagles_ridge'),
   C('Match his boast with a sober archery skill trial instead of reckless horse-bets', 45, { relation: 9, prestige: 8 }, 'ckw_eagles_ridge'),
   C('Turn away armed steppe strangers from royal winter pastures', 0, { securityMonths: 7, relation: -6 })
  ]);
 add('ckw_eagles_ridge', 'Diplomacy', 'Wind Howling Over Dry Sagebrush',
  'When his prized eagle stoops clean onto a grey wolf across frozen gravel, your own rider snaps a swift arrow saving his bruised bird from snapping jaws.',
  'followup', [
   C('Return the unharmed eagle smiling—forgiving half the mare wager as brotherly gift', 30, { relation: 16, prestige: 10 }, 'ckw_eagles_peace'),
   C('Claim the five hundred mares cleanly by steppe hunt-law', 0, { gold: 95, prestige: 9, relation: -4 }, 'ckw_eagles_peace')
  ]);
 add('ckw_eagles_peace', 'Diplomacy', 'Shared Salt Over Campfires',
  'Even fierce steppe rivals remember cleanly who saved their favorite eagle in winter grass.',
  'followup', [
   C('Exchange braided horsehair tokens sealing a winter non-aggression truce', 45, { relation: 12, stability: 6 }),
   C('Ride back home before snow squalls hit', 0, { relation: 5, prestige: 4 })
  ]);

 // 56. Horse Lords — Settled Peasants vs Nomadic Winter Camps (3 stages)
 add('ckw_plow_vs_hoof', 'Politics', 'Wooden Fences Cutting Across Old Trails',
  'Returning from summer high pastures, your clans find river-valley farmers plowing ancient horse-migration trails and digging thorn hedges across watering approaches.',
  'difference', [
   C('Survey wide fenced green-lanes between wheat fields for seasonal herd crossings', 110, { acceptance: 12, trust: 11, food: 55 }, 'ckw_hoof_fence'),
   C('Protect plow-villages sternly while assigning clans rich river-meadow reserves', 65, { development: 1, acceptance: 8, trust: 8 }, 'ckw_hoof_fence'),
   C('Tear down unauthorized hedges so cavalry horses roam unhindered', 0, { prestige: 6, acceptance: -8, unrest: 7 })
  ]);
 add('ckw_hoof_fence', 'Politics', 'Cheese and Barley Traded at Boundary Stones',
  'Once hooves stay off sprouting winter wheat, village bakers happily swap warm loaves and iron horseshoes for steppe wool and mares’ milk.',
  'followup', [
   C('Charter seasonal livestock-and-grain fairs right beside trail crossings', 75, { credit: 10, acceptance: 10, food: 50 }, 'ckw_hoof_peace'),
   C('Appoint mixed elders and bailiffs to settle stray-cattle fines cleanly', 0, { trust: 9, stability: 6 }, 'ckw_hoof_peace')
  ]);
 add('ckw_hoof_peace', 'Politics', 'Milk and Bread Sharing One Valley',
  'Horse-lord and plowman thrive side by side when fences leave room for both hoof and furrow.',
  'followup', [
   C('Carve trail-lane laws onto stone posts at valley mouths', 50, { legitimacy: 8, acceptance: 8 }),
   C('Collect clean fair tolls as herds pass north', 0, { gold: 80, credit: 5 })
  ]);

 // 57. Jade Dragon — The Porcelain Kiln Secrets (3 stages)
 add('ckw_kaolin_kiln', 'Economy & Trade', 'White Clay From Mountain Gullies',
  'Following silk envoys home, skilled potters discover translucent white kaolin clay along royal river bluffs—promising home-fired porcelain rivalling distant dragon kilns.',
  'land', [
   C('Build terraced climbing dragon-kilns and import cobalt blue mineral', 155, { development: 1, research: 10, credit: 11 }, 'ckw_kaolin_cobalt'),
   C('Fund sturdy glazed stoneware kilns for cheap clean household bowls first', 75, { trust: 9, tools: 16, credit: 6 }, 'ckw_kaolin_cobalt'),
   C('Sell raw white clay directly to foreign factors at the port', 0, { gold: 90, credit: 4 })
  ]);
 add('ckw_kaolin_cobalt', 'Economy & Trade', 'Cracked Saggars After Three Days of Pine-Fire',
  'Two early firings warp under uneven kiln drafts; potters beg patience and fresh pine-billets to tune flue vents.',
  'followup', [
   C('Bring master masonry engineers to perfect kiln flue arches cleanly', 85, { research: 10, development: 1, prestige: 8 }, 'ckw_kaolin_vase'),
   C('Keep firing smaller tea-cups while perfecting cobalt glaze chemistry', 0, { research: 7, credit: 6 }, 'ckw_kaolin_vase')
  ]);
 add('ckw_kaolin_vase', 'Economy & Trade', 'Ring Like Clear Jade When Tapped',
  'Thin blue-and-white bowls emerge glowing from white ash—commanding breathless silver prices at foreign merchant tables.',
  'followup', [
   C('Stamp every imperial-grade bowl with your royal reign mark', 60, { prestige: 11, credit: 9 }),
   C('Expand export barges cleanly along the coast', 0, { gold: 120, credit: 6 })
  ]);

 // 58. Jade Dragon — The Border Satrap’s Paper-Money Experiment (3 stages)
 add('ckw_mulberry_notes', 'Economy & Trade', 'Black Woodblock Bills in Place of Copper Strings',
  'Strangled by heavy copper strings on mountain caravans, border treasurers propose printing stamped mulberry-bark promissory notes backed by state salt vaults.',
  'crossroads_finance', [
   C('Issue strictly backed salt-redeemable notes with serial tallies and stiff forgery penalties', 130, { credit: 13, research: 9, inflation: -2 }, 'ckw_notes_market'),
   C('Trial paper bills solely among licensed wholesale salt and silk guilds', 65, { credit: 9, trust: 7 }, 'ckw_notes_market'),
   C('Stick strictly to weighed silver and copper strings; bark burns too easily', 0, { stability: 5, inflation: -1 })
  ]);
 add('ckw_notes_market', 'Economy & Trade', 'Tea-Brokers Folding Bills Inside Sleeves',
  'Long-distance caravan masters adore light paper packets—until forged woodblock notes turn up at two frontier tea-houses.',
  'followup', [
   C('Add secret red vermilion twin-seals and silk fiber threads inside the pulp', 75, { securityMonths: 10, credit: 11, research: 7 }, 'ckw_notes_vault'),
   C('Exchange dubious notes honestly once and hang caught forgers at market cross', 0, { trust: 9, legitimacy: 8 }, 'ckw_notes_vault')
  ]);
 add('ckw_notes_vault', 'Economy & Trade', 'Swift Commerce Across Mountain Passes',
  'Backed by real salt and iron-clad seals, paper credit speeds trade faster than twenty pack-mules.',
  'followup', [
   C('Publish clear monthly vault reserve statements to steady merchants', 50, { credit: 11, legitimacy: 7 }),
   C('Keep copper mints humming alongside paper bills', 0, { credit: 6, stability: 4 })
  ]);

 // 59. Sword of Islam — The Great Caravan of Mecca / Hajj Escort (3 stages)
 add('ckw_hajj_caravan', 'Religion', 'Green Silk Covers Bound for Desert Wells',
  'Pilgrims gather beneath city walls with waterskins and camels; tribal chiefs along rocky wadis demand stiff escort-gifts unless royal lances clear desert cisterns ahead.',
  'faith_islamic', [
   C('Fund armed mounted escorts, stone cistern repairs, and charitable camel-litters', 155, { piety: 14, prestige: 11, faithAuthority: 9 }, 'ckw_hajj_wells'),
   C('Negotiate safe-passage cloth gifts cleanly with oasis sheikhs ahead of departure', 90, { piety: 9, credit: 6, stability: 5 }, 'ckw_hajj_wells'),
   C('Advise pilgrims to join regional merchant trains without royal troops', 0, { piety: 3, trust: -5, faithAuthority: -4 })
  ]);
 add('ckw_hajj_wells', 'Religion', 'Flash Floods and Lanterns in the Wadi',
  'Halfway across gravel plains, desert raiders shadow stragglers at dusk while wells run muddy from sudden canyon rain.',
  'followup', [
   C('Clean sand-choked cisterns swiftly and drive raiders past the ridge by dawn', 65, { piety: 10, prestige: 9, legitimacy: 7 }, 'ckw_hajj_return'),
   C('Form tight camel-square camps and share royal dates generously', 0, { piety: 8, food: -20, trust: 8 }, 'ckw_hajj_return')
  ]);
 add('ckw_hajj_return', 'Religion', 'Palm Branches Waved at Returning Gates',
  'Sunburnt pilgrims riding homeward bless the sovereign’s name in every bazaar—moral authority gleaming brighter than crown jewels.',
  'followup', [
   C('Endow permanent desert mile-markers and shaded pilgrim wells', 85, { piety: 11, development: 1, prestige: 7 }),
   C('Welcome home the caravan commander with robes of honor', 0, { prestige: 8, legitimacy: 6 })
  ]);

 // 60. Sword of Islam — The Madrasa Waqf & Astrolabe Library (3 stages)
 add('ckw_madrasa_waqf', 'Learning & Occult', 'Stalactite Arches Over Cool Courtyard Water',
  'Retired palace judges offer half their date-palm orchards as an eternal charitable waqf to endow a magnificent four-iwan madrasa teaching law, optics, and healing.',
  'faith_islamic', [
   C('Match their orchard waqf with royal silver, gilded Qurans, and hospital wards', 160, { research: 13, piety: 12, development: 1 }, 'ckw_madrasa_books'),
   C('Grant permanent tax-immunities to the scholars’ endowment without heavy silver', 60, { faithAuthority: 9, research: 8, piety: 8 }, 'ckw_madrasa_books'),
   C('Keep orchard tax rolls intact and suggest modest neighborhood classrooms', 0, { gold: 60, faithAuthority: -3 })
  ]);
 add('ckw_madrasa_books', 'Learning & Occult', 'Scholars Debating Over Copper Astrolabes',
  'Students flock from three continents; soon paper-binders and brass engravers open bright workshops along the bazaar lane outside.',
  'followup', [
   C('Add an attached public eye-clinic and herbal dispensary beside the gate', 85, { trust: 11, research: 9, piety: 8 }, 'ckw_madrasa_dawn'),
   C('Endow student bread-and-lamp stipends for poor desert scholars', 0, { piety: 9, legitimacy: 6, research: 6 }, 'ckw_madrasa_dawn')
  ]);
 add('ckw_madrasa_dawn', 'Learning & Occult', 'Blue Tilework Catching Morning Sun',
  'Fountains murmur beneath carved cedar galleries—turning passing orchard wealth into centuries of ink and healing.',
  'followup', [
   C('Protect the waqf’s perpetual charters under royal stone tablets', 45, { legitimacy: 8, faithAuthority: 8 }),
   C('Attend Friday inaugural lecture quietly', 0, { piety: 8, prestige: 6 })
  ]);

 // 61. Rajas of India — The Caste Guilds’ Loom Charter (3 stages)
 add('ckw_weaver_charter', 'Economy & Trade', 'Indigo Hands Outside the Palace Courtyard',
  'Prosperous cotton-dyers and chintz-printers petition for formal guild-temple honors and stone bleaching vats—alarming landed aristocracy jealous of merchant wealth.',
  'faith_dharmic', [
   C('Grant the weavers honored palanquin charters and build stone indigo vats', 140, { development: 1, credit: 12, trust: 10 }, 'ckw_weaver_festival'),
   C('Grant commercial vat spaces quietly while upholding ancient court precedence', 75, { credit: 9, tools: 15, stability: 5 }, 'ckw_weaver_festival'),
   C('Reject upstart clothiers’ honors and keep artisanal crafts strictly taxed', 0, { gold: 80, unrest: 6, trust: -5 })
  ]);
 add('ckw_weaver_festival', 'Economy & Trade', 'Bright Chintz Hung Like Banners',
  'Export ships crowd coastal anchorages for fast-dyed floral cottons; jealous nobles still grumble until dyers endow temple lamps for the whole city.',
  'followup', [
   C('Invite guild masters and landholders alike to jointly govern port warehouses', 65, { credit: 10, stability: 7, acceptance: 7 }, 'ckw_weaver_boom'),
   C('Standardize dye-fastness stamps to guard international market renown', 0, { credit: 9, research: 6 }, 'ckw_weaver_boom')
  ]);
 add('ckw_weaver_boom', 'Economy & Trade', 'Indigo Sailing Across Monsoon Waters',
  'Bright printed cloth becomes gold across distant ports—anchoring treasury solvency in nimble looms.',
  'followup', [
   C('Dredge harbor lighters to speed summer cotton loading', 75, { development: 1, credit: 10 }),
   C('Collect steady clean loom-taxes', 0, { gold: 105, credit: 5 })
  ]);

 // 62. Rajas of India — The Jain / Buddhist Debate on Ahimsa (3 stages)
 add('ckw_ahimsa_edict', 'Religion', 'White Cloth Over Gentle Mouths',
  'Venerable ascetics petition the throne to halt seasonal royal slaughter-fairs and forbid bird-netting around sacred lotus lakes—promising merchant guild blessings in return.',
  'faith_dharmic', [
   C('Proclaim sacred sanctuaries at lotus lakes and restrict slaughter on holy days', 80, { piety: 13, acceptance: 11, trust: 9 }, 'ckw_ahimsa_butchers'),
   C('Protect temple tanks strictly while leaving outer countryside hunts free', 40, { piety: 8, stability: 6, acceptance: 6 }, 'ckw_ahimsa_butchers'),
   C('Keep royal hunts and garrison meat markets unrestricted', 0, { food: 40, prestige: 4, piety: -4 })
  ]);
 add('ckw_ahimsa_butchers', 'Religion', 'Tanners and Fowlers Seeking Bread',
  'Affected netters and meat-vendors gather worriedly at market stairs, asking how families eat during closed holy months.',
  'followup', [
   C('Rehire displaced netters as lake-wardens and pay modest guild stipends', 75, { trust: 11, unrest: -8, piety: 7 }, 'ckw_ahimsa_peace'),
   C('Grant free lentil and grain rations during fast weeks', 0, { food: -20, trust: 9, piety: 8 }, 'ckw_ahimsa_peace')
  ]);
 add('ckw_ahimsa_peace', 'Religion', 'Herons Nesting Unafraid Beside Steps',
  'Wealthy merchant bankers pour silver into state hospitals out of gratitude—harmony yielding unexpected coin.',
  'followup', [
   C('Carve the sanctuary pillar edicts cleanly beside lake steps', 55, { legitimacy: 8, piety: 9 }),
   C('Feed stray animals and return to council', 0, { piety: 7, trust: 5 })
  ]);

 // 63. Conclave — The Bribed Spymaster’s Cipher (3 stages)
 add('ckw_spymaster_cipher', 'Intrigue', 'Two Sets of Ink in the Shadow Ledger',
  'Comparing border courier receipts, you catch your own sharp-nosed council spymaster omitting three foreign bank drafts from his monthly intelligence report.',
  'councillor', [
   C('Confront him calmly behind locked oak doors and turn his greed back on foreign spies', 45, { securityMonths: 12, opinion: -10, legitimacy: 6 }, 'ckw_spymaster_web'),
   C('Strip his seal at full council and hand the keys to his silent deputy', 30, { legitimacy: 9, securityMonths: 10, opinion: -20 }, 'ckw_spymaster_web'),
   C('Keep silent while quietly copying his private mail-bags every week', 0, { securityMonths: 9, stress: 6 })
  ]);
 add('ckw_spymaster_web', 'Intrigue', 'Sweating Hands Over Wax Candles',
  'Cornered, he reveals foreign gold bought only silence on trade smuggling—yet admits enemy agents use a certain silversmith’s cellar to drop letters.',
  'followup', [
   C('Raid the silversmith’s cellar cleanly and seal the border leak for good', 55, { securityMonths: 12, stability: 6, gold: 80 }, 'ckw_spymaster_end'),
   C('Feed clever false military schedules through the cellar to mislead rivals', 0, { securityMonths: 11, prestige: 6 }, 'ckw_spymaster_end')
  ]);
 add('ckw_spymaster_end', 'Intrigue', 'Clean Locks on the Cipher Drawer',
  'Watchmen stand sharper along postern stairs; even shadows learn the crown counts every coin.',
  'followup', [
   C('Audit intelligence purses quarterly under royal eye', 45, { securityMonths: 10, legitimacy: 6 }),
   C('Close the secret file silently', 0, { stability: 5, stress: -4 })
  ]);

 // 64. Way of Life — The Merchant Fair Wager & Pepper Corner (3 stages)
 add('ckw_pepper_corner', 'Economy & Trade', 'Barrels Stacked High Behind Locked Doors',
  'Two clever spice factors boast over spiced wine they bought up every pepper sack ahead of winter—and offer the crown a quiet partnership before prices double.',
  'trade', [
   C('Smash the monopoly openly, cap winter spice rates, and fine both speculators', 35, { trust: 11, inflation: -2, legitimacy: 8 }, 'ckw_pepper_wharf'),
   C('Buy out their hoarded barrels for state reserves and release supplies steadily', 135, { credit: 10, food: 55, trust: 9 }, 'ckw_pepper_wharf'),
   C('Quietly collect a stiff crown customs cut and let market prices climb', 0, { gold: 130, inflation: 2, trust: -6 })
  ]);
 add('ckw_pepper_wharf', 'Economy & Trade', 'Angry Factors Pounding Guild Doors',
  'Outmaneuvered wholesalers whine about royal interference until smaller grocers cheer fair winter shelves.',
  'followup', [
   C('Charter transparent open-cry auction rings on the spice quay', 65, { credit: 11, trust: 9, development: 1 }, 'ckw_pepper_end'),
   C('Rebuke hoarding cleanly and return to ordinary harbor tolls', 0, { legitimacy: 7, stability: 5 }, 'ckw_pepper_end')
  ]);
 add('ckw_pepper_end', 'Economy & Trade', 'Honest Scales Under Lanterns',
  'Open auctions draw twice as many honest captains back next season—clean trade outlasts clever corners.',
  'followup', [
   C('Publish port price bulletins every market Friday', 45, { credit: 9, research: 5 }),
   C('Close the wharf court cleanly', 0, { trust: 6, stability: 4 })
  ]);

 // 65. Way of Life — Royal Stress & the Monastery Fishing Pond (3 stages)
 add('ckw_carp_pond', 'Lifestyle', 'Silent Willows Over Green Water',
  'Months of fractious petitions and sleepless nights leave your hands shaking over wine cups; an old monastery friend invites you alone for three days of silent carp-fishing.',
  'stress', [
   C('Slip away with plain linen coat and willow rod for three quiet days', 35, { stress: -22, piety: 5 }, 'ckw_carp_reed'),
   C('Bring two urgent treaty scrolls cleanly along to read under shade trees', 20, { stress: -14, legitimacy: 5 }, 'ckw_carp_reed'),
   C('Refuse rest; sovereigns sleep when the realm’s coffers balance', 0, { credit: 4, stress: 8 })
  ]);
 add('ckw_carp_reed', 'Lifestyle', 'Ripples Beneath Dragonflies',
  'All afternoon nothing rings louder than water lapping reed stems; by dusk the abbey prior brings warm barley bread and roasted trout without uttering one political word.',
  'followup', [
   C('Extend quiet contemplation one extra morning and leave generous alms', 55, { stress: -18, piety: 9 }, 'ckw_carp_return'),
   C('Thank the prior at sunrise and saddle up refreshed', 0, { stress: -12, stability: 4 }, 'ckw_carp_return')
  ]);
 add('ckw_carp_return', 'Lifestyle', 'Calm Eyes Behind the Dais',
  'Even sharp-tongued petitioners notice the sovereign’s voice rings steadier and unhurried when court resumes.',
  'followup', [
   C('Keep one quiet afternoon free each month away from dispatches', 25, { stress: -12, stability: 6 }),
   C('Dive cleanly back into work', 0, { legitimacy: 5, stress: -4 })
  ]);

 // 66. Conclave — The Rival Consort’s Dowry Castle (3 stages)
 add('ckw_dowry_keep', 'Family', 'Dusty Deeds Inside a Cedar Bridal Chest',
  'Your consort’s kinsmen arrive citing fine print in the marriage treaty—demanding revenue from a lush border river-toll they claim formed part of the bridal guarantee.',
  'married', [
   C('Compromise cleanly: pay a fixed annual silver dower-stipend while keeping crown tolls', 110, { opinion: 16, legitimacy: 7, credit: 5 }, 'ckw_dowry_audit'),
   C('Produce original notarized parchment proving border tolls never left crown hands', 35, { legitimacy: 9, opinion: -8, stability: 5 }, 'ckw_dowry_audit'),
   C('Yield the minor river-toll gracefully to keep domestic peace warm', 0, { opinion: 18, stability: 6 })
  ]);
 add('ckw_dowry_audit', 'Family', 'Quiet Words Behind Velvet Curtains',
  'Caught between royal pride and family loyalty, your consort privately whispers which uncle actually drives the greedy claim.',
  'followup', [
   C('Award your consort personal patronage over palace charity chests instead', 65, { opinion: 18, piety: 7, stability: 5 }, 'ckw_dowry_peace'),
   C('Settle the uncles calmly with honorable hunting gifts', 0, { prestige: 7, opinion: 8 }, 'ckw_dowry_peace')
  ]);
 add('ckw_dowry_peace', 'Family', 'A Hearth Without Cold Drafts',
  'Marriage treaties stay neat on shelf-pegs while shared breakfasts warm again.',
  'followup', [
   C('Commission a joint heraldic stained-glass window in the chapel', 70, { opinion: 14, prestige: 8, piety: 5 }),
   C('Lock the reconciled deed away cleanly', 0, { legitimacy: 6, stability: 4 })
  ]);

 // 67. Republic — The Doge’s / Burgomaster’s Masked Carnival (3 stages)
 add('ckw_carnival_masks', 'Culture & Learning', 'Paper Masks Along Moonlit Bridges',
  'During pre-Lenten carnival, disguised revelers hurl oranges and biting satirical rhymes at pompous magistrates—sparking nervous calls from council elders to ban masks outright.',
  'gov_republic', [
   C('Protect joyful masks as civic safety-valves while banning cudgels and blades', 85, { trust: 11, unrest: -10, stability: 6 }, 'ckw_carnival_play'),
   C('Sponsor grand masked barge processions funded cleanly by merchant guilds', 135, { prestige: 12, credit: 8, trust: 9 }, 'ckw_carnival_play'),
   C('Clamp down with iron curfews after sunset to guard sober public order', 0, { securityMonths: 8, unrest: 6, trust: -5 })
  ]);
 add('ckw_carnival_play', 'Culture & Learning', 'Torchlight Reflected on Canal Water',
  'One bold theater troupe stages a razor-sharp comedy mocking tax-evading shipowners—drawing thunderous laughter even from watchful guards.',
  'followup', [
   C('Toss gold coins onto the barge stage to prove the republic laughs at itself', 45, { prestige: 10, trust: 9, legitimacy: 6 }, 'ckw_carnival_ash'),
   C('Keep discreet watchmen along bridges until midnight bells', 0, { securityMonths: 7, stability: 5 }, 'ckw_carnival_ash')
  ]);
 add('ckw_carnival_ash', 'Culture & Learning', 'Ash Wednesday Bells Over Clean Cobbles',
  'Masks come off cleanly at dawn bells; citizens return to looms and oars remarkably content.',
  'followup', [
   C('Sweep canals cleanly and pay extra wages to dawn street-cleaners', 55, { trust: 9, development: 1 }),
   C('Resume sober Lenten council sessions', 0, { piety: 6, stability: 5 })
  ]);

 // 68. Horse Lords — The Captured Artisan Quarter (3 stages)
 add('ckw_artisan_yurts', 'Economy & Trade', 'Silk-Weavers and Armourers Beyond the River',
  'After border wars yield hundreds of skilled weavers, scribes, and ironwrights, steppe elders quarrel whether to resettle them in thriving oasis workshops or scatter them across pastures.',
  'gov_steppe', [
   C('Build a protected tax-free artisan quarter beside royal winter springs', 145, { development: 1, tools: 22, credit: 10 }, 'ckw_artisan_kilns'),
   C('Assign weapon-smiths directly to clan armories while freeing clerks to farm', 65, { tools: 18, food: 45, trust: 7 }, 'ckw_artisan_kilns'),
   C('Ransom wealthy urban captives quickly back to southern cities for silver', 0, { gold: 135, credit: 4 })
  ]);
 add('ckw_artisan_kilns', 'Economy & Trade', 'Brick Chimneys Rising Beside Felt Yurts',
  'Within two seasons lamplighters, paper-beaters, and bowyers turn muddy creek flats into humming workshops—stirring envy among proud mounted herdsmen.',
  'followup', [
   C('Tie artisan output directly to discounted felt-tent fittings and fine stirrups', 60, { trust: 10, tools: 15, acceptance: 8 }, 'ckw_artisan_boom'),
   C('Protect workshop alleys strictly under royal guard-banners', 0, { securityMonths: 8, legitimacy: 6 }, 'ckw_artisan_boom')
  ]);
 add('ckw_artisan_boom', 'Economy & Trade', 'Steel Forged Beneath Steppe Skies',
  'Swift horses married to sharp home-forged steel make the khanate doubly feared along caravan routes.',
  'followup', [
   C('Endow an oasis market hall open to every tribe and merchant', 80, { credit: 11, development: 1 }),
   C('Collect clean artisan craft-tributes', 0, { gold: 95, tools: 10 })
  ]);

 // 69. Jade Dragon — The Forbidden Library Fire & Rescued Scrolls (3 stages)
 add('ckw_jade_scrolls', 'Learning & Occult', 'Smoke Pouring From Cedar Archive Eaves',
  'A tipped brazier ignites priceless imperial history rolls and woodblock medical atlases inside the scholar pavilion; clerks dash blindly through choking ash.',
  'fire', [
   C('Lead water-buckets personally and pay gold bounties per rescued scroll-box', 130, { research: 12, crisis: -18, trust: 9 }, 'ckw_scrolls_ash'),
   C('Save medicinal and agricultural atlases first while sealing burning timber wings', 65, { research: 8, food: 45, crisis: -14 }, 'ckw_scrolls_ash'),
   C('Pull clerks safely clear and let blazing cedar beams collapse safely', 0, { crisis: -8, stability: 5, research: -3 })
  ]);
 add('ckw_scrolls_ash', 'Learning & Occult', 'Charred Edges Spread Across Silk Mats',
  'Hundreds of half-singed bamboo strips and paper leaves sit drying under tent roofs; scholars beg copyists before winter damp crumbles fragile ink.',
  'followup', [
   C('Hire fifty calligraphers at once to recopy every rescued fragment cleanly', 100, { research: 14, development: 1, prestige: 7 }, 'ckw_scrolls_vault'),
   C('Bind surviving sheets gently in oiled cedar boxes', 0, { research: 7, stability: 5 }, 'ckw_scrolls_vault')
  ]);
 add('ckw_scrolls_vault', 'Learning & Occult', 'Stone Archive Roofed in Clay Tile',
  'Out of charcoal and soot rises an unbroken stone library—no fire will catch ancient memory sleeping on wood rafters again.',
  'followup', [
   C('Build brick water-cisterns beside every public archive', 75, { development: 1, crisis: -10, research: 6 }),
   C('Archive copied volumes cleanly', 0, { research: 8, legitimacy: 5 })
  ]);

 // 70. Sword of Islam — The Water-Clock of the Royal Mosque (3 stages)
 add('ckw_water_clock', 'Culture & Learning', 'Copper Floats and Mechanical Falcons',
  'A Syrian clockwright offers to build a monumental water-driven clepsydra above the bazaar gate whose bronze falcons drop brass balls every hour onto resonant cymbals.',
  'crossroads_press', [
   C('Commission the grand mechanical water-clock and public plaza fountain', 150, { research: 13, prestige: 11, development: 1 }, 'ckw_clock_gears'),
   C('Fund a modest brass water-timer cleanly inside the mosque courtyard', 70, { piety: 9, research: 7, faithAuthority: 6 }, 'ckw_clock_gears'),
   C('Spend copper on clean water pipes rather than mechanical birds', 0, { trust: 6, development: 1 })
  ]);
 add('ckw_clock_gears', 'Culture & Learning', 'Silted Pipes After Winter Storm',
  'Muddy storm runoff clogs delicate brass orifices in December, silencing the bronze falcons just as foreign ambassadors arrive.',
  'followup', [
   C('Add double sand-settling filters and hire a salaried clock-engineer', 70, { research: 10, tools: 14, prestige: 8 }, 'ckw_clock_chime'),
   C('Clean orifices by hand and keep winter timing simple', 0, { stability: 5, research: 4 }, 'ckw_clock_chime')
  ]);
 add('ckw_clock_chime', 'Culture & Learning', 'Twelve Brass Notes Over Noon Market',
  'Every caravan captain sets his departure by the singing bronze falcons—civic wonder forged out of water and brass.',
  'followup', [
   C('Bind the clockwright’s gear treatises inside the royal library', 55, { research: 10, prestige: 7 }),
   C('Leave the fountain plaza humming cleanly', 0, { trust: 8, stability: 4 })
  ]);

 // 71. Rajas of India — The Monsoon Embankment Breach (3 stages)
 add('ckw_bund_breach', 'Crisis & Plague', 'Red Water Swallowing Green Paddy',
  'Relentless monsoon torrents undercut an ancient royal irrigation bund; farmers scramble with wicker baskets of red earth while downstream granary towns brace for ruin.',
  'flood', [
   C('Mobilize royal engineers, stone barges, and paid thousands to plug the breach', 160, { crisis: -22, food: 85, trust: 12 }, 'ckw_bund_stones'),
   C('Open emergency side-spillways to save town walls even if lower paddies flood', 65, { crisis: -15, trust: 6, stability: 5 }, 'ckw_bund_stones'),
   C('Let village elders organize local sandbagging while protecting treasury grain', 0, { food: 35, crisis: -6, trust: -7 })
  ]);
 add('ckw_bund_stones', 'Crisis & Plague', 'Torches Flickering Over Roaring Spillways',
  'Working waist-deep through lightning storms, stone-masons drop heavy granite blocks chained in iron nets straight into the boiling gap.',
  'followup', [
   C('Face the entire repaired bund in cut granite and widen sluice gates', 105, { development: 1, food: 75, crisis: -14 }, 'ckw_bund_harvest'),
   C('Pack clay cleanly and distribute warm rice-gruel to exhausted crews', 0, { trust: 10, food: -15, crisis: -10 }, 'ckw_bund_harvest')
  ]);
 add('ckw_bund_harvest', 'Crisis & Plague', 'Emerald Rice Stretching Unbroken',
  'Saved paddies ripple gold by November—songs credit swift royal masonry for full cooking pots.',
  'followup', [
   C('Charter a permanent Canal & Bund Guild funded by tiny harvest dues', 70, { food: 65, credit: 8, trust: 8 }),
   C('Inspect sluices cleanly before next summer', 0, { stability: 6, trust: 5 })
  ]);

 // 72. Conclave — The Honest Steward’s Tax-Farm Audit (3 stages)
 add('ckw_tax_farm', 'Politics', 'Two Coffers Beneath the Customs Bridge',
  'Your principled Steward brings proof that powerful aristocratic tax-farmers collect twice the royal assessment at river bridges—pocketing the difference in private coffers.',
  'taxFaction', [
   C('Abolish crooked private tax-farms and install salaried royal customs clerks', 120, { credit: 12, factionPressure: -18, legitimacy: 9 }, 'ckw_tax_revolt'),
   C('Fine the worst offenders heavily while letting compliant lords keep leases', 40, { gold: 125, factionPressure: -10, factionLoyalty: 5 }, 'ckw_tax_revolt'),
   C('Accept their customary gift and leave bridge collectors undisturbed', 0, { gold: 75, factionLoyalty: 8, credit: -4 })
  ]);
 add('ckw_tax_revolt', 'Politics', 'Shutters Pulled Down by Wealthy Contractors',
  'Stripped of easy windfalls, wealthy bridge-farmers delay salt shipments and mutter darkly inside noble faction meetings.',
  'followup', [
   C('Escort honest merchant barges with royal pickets and lower official rates slightly', 70, { credit: 11, factionPressure: -16, stability: 6 }, 'ckw_tax_clean'),
   C('Summon contractors to swear clean new receipts or forfeit licenses permanently', 0, { legitimacy: 9, factionPressure: -10 }, 'ckw_tax_clean')
  ]);
 add('ckw_tax_clean', 'Politics', 'Silver Flowing Clean to the Exchequer',
  'Lower official bridge tolls yet doubled crown revenue—honest ledgers beat private greed every season.',
  'followup', [
   C('Post carved stone toll tables cleanly at every river bridge', 50, { legitimacy: 9, credit: 8 }),
   C('Reward the honest Steward openly', 0, { stability: 6, credit: 5 })
  ]);

 // 73. Conclave — The Proud Commander’s Seat at Council (3 stages)
 add('ckw_marshal_chair', 'Court', 'Steel Spurs Scraping Velvet Carpets',
  'Having crushed a border rebellion, your blunt-spoken field commander barges straight into the privy council demanding a permanent voting chair beside grey-robed clerks.',
  'army', [
   C('Create a formal seat of Constable for him and bind his loyalty with silver stipends', 125, { morale: 10, legitimacy: 7, stability: 5 }, 'ckw_marshal_table'),
   C('Grant him ceremonial attendance on defense days while guarding civilian tax votes', 50, { legitimacy: 7, morale: 6 }, 'ckw_marshal_table'),
   C('Send him politely back to garrison forts; camps run on steel, councils on ink', 0, { legitimacy: 6, morale: -3, stability: 4 })
  ]);
 add('ckw_marshal_table', 'Court', 'Gilded Map Pins and Stubborn Fingers',
  'By the second session he slams leather gloves over salt-duty tallies, roaring that penny-pinching clerks starve border watchtowers of crossbow bolts.',
  'followup', [
   C('Broker a practical compromise: automated powder stipends from stable port tolls', 75, { supply: 16, morale: 9, credit: 5 }, 'ckw_marshal_end'),
   C('Remind him calmly that every bolt paid by taxes must be weighed by ledgers', 0, { legitimacy: 7, experience: 0.05 }, 'ckw_marshal_end')
  ]);
 add('ckw_marshal_end', 'Court', 'Sword and Quill Balanced',
  'Soldiers respect clerks who count fairly; clerks respect captains who bleed on frontier mud.',
  'followup', [
   C('Publish joint quarterly garrison supply tables', 50, { supply: 14, stability: 6 }),
   C('Adjourn the chamber cleanly', 0, { morale: 5, legitimacy: 4 })
  ]);

 // 74. Conclave — The Sibling Heirs’ Partition Quarrel (3 stages)
 add('ckw_heir_partition', 'Family', 'Two Wooden Castles on the Map Cloth',
  'Over winter supper your younger royal offspring accuses the elder heir of monopolizing royal cavalry captains and grooming frontier castellans behind closed doors.',
  'competingHeirs', [
   C('Call both siblings into private chapel, split honors fairly, and swear unity', 65, { opinion: 18, legitimacy: 8, stability: 6 }, 'ckw_partition_oath'),
   C('Assign the younger sibling a rich coastal admiralty far from land castles', 115, { opinion: 14, prestige: 8, credit: 5 }, 'ckw_partition_oath'),
   C('Rebuke sibling jealousy harshly; one dynasty speaks with one crown voice', 0, { legitimacy: 7, opinion: -10, stress: 5 })
  ]);
 add('ckw_partition_oath', 'Family', 'Cold Hands Warmed Over One Hearth',
  'Neither youth drops suspicion overnight, yet assigned clear realms of pride stops servants from taking partisan wagers in corridors.',
  'followup', [
   C('Send both siblings jointly on a ceremonial border bridge inspection', 70, { opinion: 14, education: 10, prestige: 6 }, 'ckw_partition_close'),
   C('Keep regular weekly family suppers without flatterers', 0, { opinion: 10, stress: -5 }, 'ckw_partition_close')
  ]);
 add('ckw_partition_close', 'Family', 'Banners Tied Beneath One Crest',
  'Households survive succession storms only when siblings learn to guard each other’s flanks.',
  'followup', [
   C('Record clear dynastic appanage stipends in writing', 45, { legitimacy: 8, stability: 5 }),
   C('Close the family council peacefully', 0, { opinion: 6, stress: -4 })
  ]);

 // 75. Way of Life — Intrigue Watch on a Known Secret (3 stages)
 add('ckw_secret_cipher', 'Intrigue', 'A Torn Wax Impression in Ash',
  'Holding an unexposed court secret in your iron drawer, you discover an unnamed clerk trying soft beeswax impressions on the keyhole during noon chapel.',
  'knownSecret', [
   C('Swap the inner chest quietly for a decoy diary and bait the thief’s patron', 75, { securityMonths: 12, prestige: 6, stress: 4 }, 'ckw_cipher_bait'),
   C('Double vault locks, burn duplicate papers, and shift the guard shift', 40, { securityMonths: 10, stability: 5 }, 'ckw_cipher_bait'),
   C('Expose the old secret openly on royal terms to rob blackmailers of fangs', 0, { legitimacy: 6, stress: -8, securityMonths: 5 })
  ]);
 add('ckw_cipher_bait', 'Intrigue', 'Moonlight on the Armory Stairs',
  'At midnight a hooded valet unlocks the decoy drawer—walking straight into lantern light and six quiet halberdiers.',
  'followup', [
   C('Compel the terrified spy to name his paymaster in exchange for exile', 30, { securityMonths: 12, legitimacy: 6 }, 'ckw_cipher_end'),
   C('Lock the valet in silent tower cells without warning his master', 0, { securityMonths: 9, stress: 3 }, 'ckw_cipher_end')
  ]);
 add('ckw_cipher_end', 'Intrigue', 'Silent Keys Hung on Your Belt',
  'Shadows scatter when iron teeth click cleanly inside the dark.',
  'followup', [
   C('Reward loyal night-watchmen with silver florins', 45, { securityMonths: 10, stability: 5 }),
   C('Seal the vault cleanly', 0, { legitimacy: 5, stress: -4 })
  ]);

 // 76. Way of Life — Seduction / Troubadour Ballad Scandal (3 stages)
 add('ckw_troubadour_lute', 'Court', 'Strings Plucked Beneath the Balcony',
  'A silver-voiced Gascon troubadour hired for winter court composes dazzling love ballads whose coded flower names gossiping maids instantly match to a great lord’s young spouse.',
  'focus_diplomacy', [
   C('Gift the singer a horse and steer his witty verses toward heroic battles instead', 75, { focusXP: 24, stability: 7, prestige: 7 }, 'ckw_lute_court'),
   C('Let harmless poetic games run while quietly calming jealous husbands with honors', 55, { focusXP: 20, prestige: 9, stress: -6 }, 'ckw_lute_court'),
   C('Banish the troubadour before lute strings draw steel in the courtyard', 0, { stability: 6, focusXP: 10, stress: 3 })
  ]);
 add('ckw_lute_court', 'Court', 'Daggers Hidden Inside Velvet Sleeves',
  'At dusk two furious kinsmen corner the poet beside the dovecote—insisting he sing out whose rose-garden inspired his third stanza.',
  'followup', [
   C('Step out laughing, claim the poetic riddle refers solely to ancient Troy, and buy round drinks', 40, { focusXP: 24, stability: 8, prestige: 8 }, 'ckw_lute_end'),
   C('Order guards to escort the singer swiftly to the city gate by morning', 0, { stability: 6, securityMonths: 6 }, 'ckw_lute_end')
  ]);
 add('ckw_lute_end', 'Court', 'Gentle Songs Without Blood',
  'By spring minstrels sing solely of silver rivers and white stags—keeping court wit sparkling safely.',
  'followup', [
   C('Sponsor a guild of royal chroniclers and ballad-singers', 60, { prestige: 9, focusXP: 16 }),
   C('Hang up the lute and open council doors', 0, { stability: 5, stress: -4 })
  ]);

 // 77. Republic — The Grain Galley Convoy Blockade (3 stages)
 add('ckw_grain_convoy', 'Economy & Trade', 'Sails Waiting Off the Sandbar',
  'Rival harbor leagues raise gun-towers along narrow straits, halting twelve wheat hulks bound for your republic’s hungry dockside bakeries unless triple transit tolls are paid.',
  'food', [
   C('Pay partial transit bullion once while rigging swift escort oared galleys for next month', 145, { food: 115, credit: 8, trust: 9 }, 'ckw_convoy_straits'),
   C('Buy overland mule-trains of rye through mountain valleys to bypass sea tolls', 110, { food: 95, trust: 10, credit: 5 }, 'ckw_convoy_straits'),
   C('Ration biscuit ovens sternly and dare rival leagues to blink first', 0, { food: 30, unrest: 6, credit: -3 })
  ]);
 add('ckw_convoy_straits', 'Economy & Trade', 'Lanterns Extinguished Past the Headland',
  'Under moonless clouds, nimble low-hulled brigantines slip flour sacks past snoring toll-keepers—yet coastal watch-fires flare behind them.',
  'followup', [
   C('Sign a balanced harbor grain-convention guaranteeing mutual free bread-ships', 85, { credit: 11, food: 75, stability: 6 }, 'ckw_convoy_quay'),
   C('Unpack rescued wheat rapidly along torchlit quays before dawn', 0, { food: 70, trust: 7 }, 'ckw_convoy_quay')
  ]);
 add('ckw_convoy_quay', 'Economy & Trade', 'Warm Loaves Outside Bakers’ Doors',
  'Flour dust coats wharf cobbles once more; steady ships and full ovens quiet hungry docks.',
  'followup', [
   C('Build brick sea-granaries atop the outer pier', 90, { development: 1, food: 80, credit: 6 }),
   C('Collect clean bakers’ tallies', 0, { trust: 6, stability: 4 })
  ]);

 // 78. Horse Lords — The Silk Road Oasis Well Collapse (3 stages)
 add('ckw_oasis_well', 'Crisis & Plague', 'Dry Sand Choking the Desert Spring',
  'An earth tremor collapses stone timbering inside the vital caravan oasis well; sixty thirsty camels bellow beside dry troughs while oasis clans fight over muddy puddles.',
  'drought', [
   C('Send desert well-diggers, cedar shoring, and skin water-trains from river forts', 140, { food: 75, crisis: -20, trust: 11 }, 'ckw_oasis_dig'),
   C('Enforce strict equal gourd rations for camels and travelers under mounted spears', 45, { crisis: -13, stability: 7, securityMonths: 6 }, 'ckw_oasis_dig'),
   C('Reroute caravans across longer northern grazing tracks', 0, { crisis: -6, credit: -4, trust: -4 })
  ]);
 add('ckw_oasis_dig', 'Crisis & Plague', 'Timber Props Forty Feet Down',
  'Descending by hemp rope into dark damp earth, diggers strike clear cold aquifer gravel—just before loose gravel threatens to bury three brave youths.',
  'followup', [
   C('Line the entire shaft smoothly in baked brick and pay heroes silver purses', 90, { development: 1, crisis: -15, trust: 11 }, 'ckw_oasis_flow'),
   C('Shore with tough tamarisk beams and haul clear water up by goat-skin', 0, { crisis: -10, food: 40 }, 'ckw_oasis_flow')
  ]);
 add('ckw_oasis_flow', 'Crisis & Plague', 'Clear Water Brimming Stone Troughs',
  'Bell-wethers drink deep under date palms; silver bells resume jingling along the caravan road.',
  'followup', [
   C('Post permanent oasis well-wardens along the desert track', 60, { credit: 8, trust: 9 }),
   C('Leave clean water flowing free to travelers', 0, { piety: 7, stability: 5 })
  ]);

 // 79. Jade Dragon — The Imperial Printing & Woodblock Atlas (3 stages)
 add('ckw_woodblock_atlas', 'Culture & Learning', 'Pearwood Blocks Carved by Candlelight',
  'Inspired by eastern imperial geographies, court cartographers offer to carve pearwood map plates showing every mountain pass, ford, and market town across the realm.',
  'crossroads_press', [
   C('Finance pearwood plates, pine-soot ink, and field surveyors across every shire', 150, { research: 13, development: 1, prestige: 9 }, 'ckw_atlas_border'),
   C('Restrict plates strictly to road tolls and granary towns; guard border passes secret', 75, { securityMonths: 9, research: 8, credit: 6 }, 'ckw_atlas_border'),
   C('Keep hand-drawn parchment charts locked in royal war chests', 0, { securityMonths: 7, stability: 4 })
  ]);
 add('ckw_atlas_border', 'Culture & Learning', 'Spies Eyeing Ink-Wet Proofs',
  'Before varnish dries on the frontier mountain sheet, clerks catch a visiting foreign merchant trying to buy misprinted proof-sheets from an apprentice.',
  'followup', [
   C('Lock border mountain plates securely while publishing clean civic road atlases', 60, { securityMonths: 10, research: 9, credit: 7 }, 'ckw_atlas_bound'),
   C('Publish the full open atlas boldly to announce undisputed royal sovereignty', 0, { prestige: 11, legitimacy: 8 }, 'ckw_atlas_bound')
  ]);
 add('ckw_atlas_bound', 'Culture & Learning', 'The Realm Unrolled on Crisp Paper',
  'Bailiffs, tax clerks, and caravan drivers alike steer cleanly by stamped maps instead of crooked local rumors.',
  'followup', [
   C('Distribute copies to every county court and naval harbor', 65, { credit: 9, research: 8 }),
   C('Bind the master atlas in crimson silk', 0, { prestige: 8, legitimacy: 5 })
  ]);

 // 80. Sword of Islam — The Carpet-Weavers’ Guild & Dye Tax (3 stages)
 add('ckw_carpet_dyes', 'Economy & Trade', 'Madder Root and Saffron Vats Boiling',
  'Master knotters weaving royal-medallion carpets threaten to pack looms for rival sultanates after overzealous port clerks double customs on imported cochineal and alum.',
  'gov_sultanate', [
   C('Slash dye-import customs cleanly and endow covered stone carpet-bazaars', 135, { credit: 12, development: 1, trust: 11 }, 'ckw_carpet_loom'),
   C('Rebate half of alum duties strictly for royal-seal export carpets', 65, { credit: 9, prestige: 7, tools: 12 }, 'ckw_carpet_loom'),
   C('Keep full port tariffs and dare master weavers to find richer patrons', 0, { gold: 80, credit: -5, unrest: 5 })
  ]);
 add('ckw_carpet_loom', 'Economy & Trade', 'Silk Knots Tied Four Hundred to the Inch',
  'Relieved masters unveil an astonishing sixteen-foot garden carpet shimmering like emerald tilework—asking permission to weave the sovereign’s calligraphy along its border.',
  'followup', [
   C('Accept proudly, display it in foreign audience halls, and fund dye-plant nurseries', 85, { prestige: 12, research: 7, credit: 8 }, 'ckw_carpet_bazaar'),
   C('Purchase the masterpiece cleanly and encourage steady apprentice hiring', 0, { trust: 9, credit: 7 }, 'ckw_carpet_bazaar')
  ]);
 add('ckw_carpet_bazaar', 'Economy & Trade', 'Caravans Loading Rolled Wool Treasures',
  'Foreign princes bid fiercely for signed royal-bazaar rugs—turning nimble fingers into lasting gold.',
  'followup', [
   C('Stamp authenticity lead-seals onto fine guild carpets', 50, { credit: 10, legitimacy: 6 }),
   C('Stroll the lively bazaar and close the ledger', 0, { trust: 6, stability: 4 })
  ]);

 // 81. Rajas of India — The Royal Observatory & Monsoon Almanac (3 stages)
 add('ckw_monsoon_almanac', 'Learning & Occult', 'Brass Sundials and Monsoon Winds',
  'Court jyotish astronomers and sea-pilots team up to chart precise lunar tides, monsoon wind reversals, and sowing dates on palm-leaf almanacs for every coastal and inland district.',
  'research', [
   C('Fund coastal tide-poles, brass dials, and vernacular almanac copies', 140, { research: 14, food: 70, credit: 9 }, 'ckw_almanac_tides'),
   C('Focus strictly on agricultural monsoon calendars for tax and planting officials', 70, { food: 75, research: 8, trust: 7 }, 'ckw_almanac_tides'),
   C('Leave planting dates to village grandmothers and seasoned fishermen', 0, { trust: 5, food: 30 })
  ]);
 add('ckw_almanac_tides', 'Learning & Occult', 'Late Rains Testing Royal Forecasts',
  'When monsoon winds stall ten days past traditional village dates, nervous farmers stare at empty skies—asking whether crown almanacs tricked them into early plowing.',
  'followup', [
   C('Advance emergency seed-grain loans while astronomers track coastal pressure shifts', 85, { food: 65, trust: 11, research: 7 }, 'ckw_almanac_rain'),
   C('Hold calm faith in steady observation and publish revised harbor tables', 0, { research: 9, legitimacy: 6 }, 'ckw_almanac_rain')
  ]);
 add('ckw_almanac_rain', 'Learning & Occult', 'Black Clouds Breaking Over Full Furrows',
  'Deluged paddies drink deep right on the revised almanac curve—winning stunned praise from dock-pilots and rice-planters alike.',
  'followup', [
   C('Establish annual printed or copied kingdom almanacs every spring', 60, { research: 11, food: 55 }),
   C('Reward the chief astronomer with a silver armillary', 0, { prestige: 8, research: 5 })
  ]);

 // 82. Conclave — The Regency Court’s Marriage Broker (3 stages)
 add('ckw_regency_match', 'Family', 'Four Parchment Portraits on Velvet',
  'Ambassadors from neighboring powers crowd the regency parlor bearing miniature portraits, dowry inventories, and veiled border alliances—each trying to steer the crown’s household.',
  'regency', [
   C('Weigh every parchment carefully and choose stable domestic harmony over flashy coin', 90, { legitimacy: 10, stability: 7, stress: -5 }, 'ckw_match_envoys'),
   C('Play rival suitors smoothly against each other to win steep frontier concessions', 45, { prestige: 9, credit: 8, stress: 4 }, 'ckw_match_envoys'),
   C('Defer all marriage bargains firmly until the crown rules in full majority', 0, { legitimacy: 8, stability: 4 })
  ]);
 add('ckw_match_envoys', 'Family', 'Whispering Matchmakers Behind Painted Screens',
  'One rejected embassy’s envoy grumbles loudly at dinner, hinting his master may rethink autumn wool shipments unless mollified.',
  'followup', [
   C('Send him home laden with polite hunting falcons and untouched trade passes', 65, { credit: 7, prestige: 7, stability: 5 }, 'ckw_match_close'),
   C('Remind him calmly that royal marriages are not wool auctions', 0, { legitimacy: 8, prestige: 6 }, 'ckw_match_close')
  ]);
 add('ckw_match_close', 'Family', 'Portraits Packed Back in Cedar Boxes',
  'Suitor caravans rattle homeward with clear signals: this throne bargains from calm strength, never panic.',
  'followup', [
   C('File alliance drafts cleanly inside the privy archive', 35, { legitimacy: 7, securityMonths: 6 }),
   C('Close the reception hall cleanly', 0, { stability: 5, stress: -4 })
  ]);

 // 83. Way of Life — The Midnight Library Thief (3 stages)
 add('ckw_library_thief', 'Learning & Occult', 'Cut Vellum Chains on the Oak Desk',
  'Arriving early at the palace library with a shaded lantern, you spot severed brass book-chains and a priceless Greek siege-treatise missing from its shelf.',
  'focus_learning', [
   C('Lock tower doors silently and trace candle-wax drippings toward guest quarters', 40, { focusXP: 24, securityMonths: 10, research: 6 }, 'ckw_thief_chest'),
   C('Offer quiet silver rewards across city bookbinders for anonymous return', 90, { focusXP: 18, research: 9, prestige: 5 }, 'ckw_thief_chest'),
   C('Seal the remaining folios doubly and move on with morning lessons', 0, { securityMonths: 6, focusXP: 10 })
  ]);
 add('ckw_thief_chest', 'Learning & Occult', 'Ink-Stained Fingers Inside a Travelling Case',
  'Watchmen catch a brilliant impoverished foreign student hiding the wrapped volume inside rolled laundry—weeping that he only longed to copy three geometry diagrams before sailing home.',
  'followup', [
   C('Grant him supervised scholar lodging to copy the diagrams cleanly and work as translator', 75, { focusXP: 26, research: 12, prestige: 6 }, 'ckw_thief_end'),
   C('Recover the folio sternly, ban him from the city, and punish sleepy porters', 0, { securityMonths: 9, legitimacy: 6 }, 'ckw_thief_end')
  ]);
 add('ckw_thief_end', 'Learning & Occult', 'Brass Clasps Polished Bright',
  'Rescued parchment rests safely once more—and curiosity finds lawful desks instead of bolt-cutters.',
  'followup', [
   C('Open a supervised scholar copying-room beside the main hall', 65, { research: 10, focusXP: 16 }),
   C('Mend the brass chain cleanly', 0, { securityMonths: 7, stability: 4 })
  ]);

 // 84. Way of Life — The Martial Guard’s Night Raid Drill (3 stages)
 add('ckw_night_drill', 'Military', 'Blackened Helms Beyond the Orchard Wall',
  'To test whether palace sentries truly watch after midnight, your marshal proposes staging a surprise silent escalade with muffled ladders and wooden swords.',
  'focus_martial', [
   C('Climb the damp orchard ladder yourself beside picked scouts at two in the morning', 35, { focusXP: 28, prestige: 9, securityMonths: 8 }, 'ckw_drill_bell'),
   C('Watch from the parapet shadow while captains test outer wall pickets', 55, { focusXP: 20, securityMonths: 10, legitimacy: 5 }, 'ckw_drill_bell'),
   C('Skip theatrical midnight alarms; honest daytime inspections keep men rested', 0, { focusXP: 10, stability: 5 })
  ]);
 add('ckw_drill_bell', 'Military', 'A Sleeping Sentry Caught Mid-Snore',
  'On the east bartizan your blackened scouts disarm a snoring pikeman before he blinks—yet two towers away an alert corporal blows alarm horns in three breaths.',
  'followup', [
   C('Promote the sharp-eyed corporal on the spot and drill the sleepy watch extra shifts', 45, { focusXP: 24, securityMonths: 11, prestige: 6 }, 'ckw_drill_dawn'),
   C('Fine the sleepy sergeant’s cup-money and buy hot spiced cider for alert towers', 0, { stability: 6, focusXP: 18, securityMonths: 8 }, 'ckw_drill_dawn')
  ]);
 add('ckw_drill_dawn', 'Military', 'Crisp Salutes Along the Curtain Wall',
  'From that night onward lantern shutters never wink lazily past curfew.',
  'followup', [
   C('Institute random monthly watch inspections with bonus pay', 55, { securityMonths: 12, focusXP: 16 }),
   C('Sheathe wooden practice blades cleanly', 0, { stability: 5, stress: -3 })
  ]);

 // 85. Republic — The Gunpowder Cargo Explosion at the Mole (3 stages)
 add('ckw_powder_barge', 'Crisis & Plague', 'White Smoke Roaring Off the Stone Jetty',
  'A careless pipe-ember aboard a moored powder-lighter blows its oak deck sky-high—shattering harbor windows, injuring sailors, and igniting tarred ropes along three warehouses.',
  'crossroads_gunpowder', [
   C('Rush bucket teams, compensate wounded dockers, and move powder magazines offshore', 145, { trust: 11, development: 1, credit: 7 }, 'ckw_powder_stone'),
   C('Seal damaged harbor gates fast and salvage intact saltpeter casks first', 70, { tools: 18, securityMonths: 8, stability: 5 }, 'ckw_powder_stone'),
   C('Fine the dead captain’s syndics to cover broken harbor masonry', 0, { gold: 90, trust: -5, unrest: 4 })
  ]);
 add('ckw_powder_stone', 'Crisis & Plague', 'Copper Nails Replacing Iron Spark-Hammers',
  'Ordnance masters warn iron tools scraping dry saltpeter barrels breed lightning—begging crown funds for non-sparking copper hoops and isolated brick reef-magazines.',
  'followup', [
   C('Build thick-walled reef powder magazines and mandate copper barrel tools', 105, { research: 10, development: 1, securityMonths: 9 }, 'ckw_powder_safe'),
   C('Ban all loose powder kegs inside city walls after sunset', 0, { stability: 7, trust: 7 }, 'ckw_powder_safe')
  ]);
 add('ckw_powder_safe', 'Crisis & Plague', 'Quiet Reef Towers',
  'No harbour roof rattles again; cautious craft keeps thunder locked safely behind brick.',
  'followup', [
   C('Train salaried harbor powder-wardens', 55, { securityMonths: 9, research: 6 }),
   C('Rebuild shattered pier lamps cleanly', 0, { credit: 6, trust: 5 })
  ]);

 // 86. Horse Lords — The Captured Falconer’s Bride-Price (3 stages)
 add('ckw_bride_price', 'Diplomacy', 'Forty Camels and Two Silver Bridles',
  'After a border clan raid leaves a noble frontier maiden stranded in honorable guest-quarters, her proud brother rides under white cloth bearing silk and camels—demanding respectful marriage terms or blood.',
  'hostile', [
   C('Receive him with roasted mutton, match gifts generously, and turn feud into kinship', 120, { relation: 18, prestige: 9, stability: 6 }, 'ckw_bride_tent'),
   C('Return the lady untouched with full honor gifts and demand three years’ truce', 65, { relation: 12, legitimacy: 8 }, 'ckw_bride_tent'),
   C('Refuse horse-trading over hostages and hold firm frontier pickets', 0, { securityMonths: 8, relation: -6 })
  ]);
 add('ckw_bride_tent', 'Diplomacy', 'Kumis Poured Beside Drawn Bows',
  'Young hotbloods mutter outside the felt pavilion while elders weigh silver bridles—one sneer could turn bridal silk back into red dust.',
  'followup', [
   C('Toast shared future pastures loudly and gift both brothers matching Damascus knives', 55, { relation: 15, prestige: 8 }, 'ckw_bride_peace'),
   C('Close negotiations briskly under witnessed tribal oaths', 0, { relation: 8, stability: 5 }, 'ckw_bride_peace')
  ]);
 add('ckw_bride_peace', 'Diplomacy', 'Lanterns Riding Eastward',
  'Wedding songs cross border hills where war-horns echoed last moon.',
  'followup', [
   C('Open seasonal sheep-and-cloth barter along the border ford', 50, { relation: 10, credit: 7 }),
   C('Lower watch-fires along the ridge', 0, { stability: 5, relation: 5 })
  ]);

 // 87. Jade Dragon — The Silk Road Nestorian / Foreign Shrine (3 stages)
 add('ckw_caravan_shrine', 'Religion', 'Strange Carved Crosses Beside Jade Lamps',
  'Silk Road merchants wintering in your capital ask land to rebuild an ancient weathered wayside shrine where eastern and western travelers alike pray for safe mountain passes.',
  'faithTension', [
   C('Grant an honored corner plot and proclaim peaceful sanctuary for caravan faiths', 95, { acceptance: 14, credit: 9, trust: 9 }, 'ckw_shrine_sermon'),
   C('Allow quiet private worship inside walled caravanserais without public bells', 40, { acceptance: 8, stability: 6, credit: 5 }, 'ckw_shrine_sermon'),
   C('Refuse foreign altars inside capital ditches to satisfy strict native clergy', 0, { faithAuthority: 8, acceptance: -6, credit: -3 })
  ]);
 add('ckw_shrine_sermon', 'Religion', 'Bilingual Translators Sharing Tea',
  'Sogdian, Persian, and local scholars sit cross-legged swapping herbal cures and mountain snow-reports beside warm clay braziers.',
  'followup', [
   C('Endow a multilingual hostel translating road-maps and medical manuals', 85, { research: 11, acceptance: 10, credit: 8 }, 'ckw_shrine_peace'),
   C('Keep regular city watchmen polite and protective around the hostel', 0, { trust: 8, stability: 6 }, 'ckw_shrine_peace')
  ]);
 add('ckw_shrine_peace', 'Religion', 'Caravan Bells at Sunrise',
  'Word spreads down ten oasis wells: merchants find fair scales and safe prayers inside your gates.',
  'followup', [
   C('Grant permanent safe-conduct plaques to returning merchant houses', 55, { credit: 10, acceptance: 8 }),
   C('Close the guild charter cleanly', 0, { trust: 6, stability: 4 })
  ]);

 // 88. Sword of Islam — The Hospitaler / Bimaristan of Flowing Water (3 stages)
 add('ckw_bimaristan_water', 'Crisis & Plague', 'Fountains Singing Inside Fever Wards',
  'Following famed Levantine bimaristan design, palace physicians propose a stone public hospital cooled by running canal water, separate contagious wings, and soft oud music to soothe melancholy.',
  'illness', [
   C('Fund running-water marble wards, free apothecaries, and salaried musicians', 155, { health: -28, research: 11, prestige: 9 }, 'ckw_bimaristan_ward'),
   C('Equip practical boiled-linen fever rooms and herbal dispensaries without marble', 80, { health: -20, research: 6, piety: 6 }, 'ckw_bimaristan_ward'),
   C('Send modest silver alms to existing parish infirmaries instead', 0, { piety: 6, health: -8 })
  ]);
 add('ckw_bimaristan_ward', 'Crisis & Plague', 'Musk, Rosewater, and Steady Pulses',
  'Rich and beggar alike receive clean cotton gowns and almond-barley broth; critics complain musicians waste charity silver until delirium eases in quiet wards.',
  'followup', [
   C('Endow permanent orchard rents so the hospital treats every soul free forever', 90, { piety: 11, health: -18, legitimacy: 7 }, 'ckw_bimaristan_end'),
   C('Train twenty young apprentice surgeons beside senior masters', 0, { research: 10, health: -12 }, 'ckw_bimaristan_end')
  ]);
 add('ckw_bimaristan_end', 'Crisis & Plague', 'Mercy Carved Above the Arch',
  'Cool water murmurs through arched wards long after winter fevers fade.',
  'followup', [
   C('Compile the hospital’s clinical casebooks for scholars', 60, { research: 11, prestige: 7 }),
   C('Walk the clean courtyard quietly', 0, { piety: 8, stress: -6 })
  ]);

 // 89. Rajas of India — The Temple Bronze Foundry & Nataraja Cast (3 stages)
 add('ckw_bronze_foundry', 'Culture & Learning', 'Beeswax Models Wrapped in River Clay',
  'Master sthapati bronze-casters prepare a towering lost-wax ceremonial statue for the great temple pavilion—requiring tons of pure copper, tin, and midnight prayers.',
  'faith_dharmic', [
   C('Supply pure copper ingots and endow a royal bronze-craft quarter', 150, { prestige: 13, piety: 11, tools: 18 }, 'ckw_bronze_pour'),
   C('Fund a modest household shrine figure and turn spare bronze to field bells', 70, { piety: 8, tools: 14, credit: 5 }, 'ckw_bronze_pour'),
   C('Keep copper strictly inside royal cannon and coin mints', 0, { tools: 12, stability: 4 })
  ]);
 add('ckw_bronze_pour', 'Culture & Learning', 'White-Hot Metal Glowing Through Clay',
  'At the auspicious midnight star, twelve crucibles tilt together into smoking clay molds—one slipped tong could ruin six months of beeswax carving.',
  'followup', [
   C('Keep priests chanting calm rhythm while pouring steady molten streams', 45, { piety: 10, prestige: 10, legitimacy: 6 }, 'ckw_bronze_unveil'),
   C('Stand vigil silently beside master smiths till clay cools at dawn', 0, { prestige: 8, stability: 5 }, 'ckw_bronze_unveil')
  ]);
 add('ckw_bronze_unveil', 'Culture & Learning', 'Four Arms Gleaming Like Living Flame',
  'When clay shells shatter away, flawless bronze catches saffron lamps—export guild artisans clamor to learn the lost-wax secret.',
  'followup', [
   C('Charter lost-wax guilds crafting export lamps and temple vessels', 75, { credit: 10, development: 1, research: 6 }),
   C('Process the gleaming figure to the inner sanctum', 0, { piety: 10, prestige: 7 })
  ]);

 // 90. Conclave — The Regency Guard’s Loyalty Oath (3 stages)
 add('ckw_regency_guard', 'Succession', 'Halberds Clicking Outside the Nursery Door',
  'Midway through tense council votes, the captain of the palace guard quietly seeks private audience—asking whether his blades answer solely to the royal blood or the regent’s seal.',
  'regency', [
   C('Bind the captain directly to your person with double winter silver and secret watchwords', 110, { securityMonths: 12, legitimacy: 9, stability: 5 }, 'ckw_guard_watch'),
   C('Order him politely to obey lawful majority council seals while watching for treason', 35, { legitimacy: 7, stability: 6 }, 'ckw_guard_watch'),
   C('Rotate suspicious guard officers quietly to distant border forts', 0, { securityMonths: 9, stress: 4 })
  ]);
 add('ckw_guard_watch', 'Succession', 'Boots Changing Shift at Midnight',
  'Two nights later a nervous regency clerk tries ordering extra guards onto the treasury stair without your countersign—halberds calmly block his lantern.',
  'followup', [
   C('Summon the clerk cleanly at dawn to clarify chain of command before all lords', 30, { legitimacy: 10, securityMonths: 10, stability: 6 }, 'ckw_guard_peace'),
   C('Replace the overbold clerk quietly and double inner watch lamps', 0, { securityMonths: 11, legitimacy: 6 }, 'ckw_guard_peace')
  ]);
 add('ckw_guard_peace', 'Succession', 'Steady Steel Beneath Tapestries',
  'Everyone in palace corridors hears the click of halberds and adjusts ambitions accordingly.',
  'followup', [
   C('Strike silver loyalty medals for faithful household serjeants', 60, { prestige: 8, securityMonths: 9 }),
   C('Return quietly to chamber business', 0, { stability: 5, stress: -4 })
  ]);

 // 91. Way of Life — The Rival’s Falconry Sabotage (3 stages)
 add('ckw_sabotaged_saddle', 'Intrigue', 'A Half-Cut Stirrup Leather in the Stable',
  'Before dawn hunting horns blow, your sharp-eyed groom notices the stitching on your favorite chestnut’s stirrup-strap sliced three-quarters through with a razor edge.',
  'activePlot', [
   C('Swap horses quietly without shouting, then watch who waits anxiously by the ravine', 45, { plotPreparation: 12, securityMonths: 11, stress: 5 }, 'ckw_saddle_ravine'),
   C('Lock stable doors immediately and interrogate night-grooms under watch', 65, { securityMonths: 12, legitimacy: 6, plotPreparation: 8 }, 'ckw_saddle_ravine'),
   C('Throw the ruined leather in the fire and ride an armored warhorse instead', 0, { securityMonths: 7, stability: 4 })
  ]);
 add('ckw_saddle_ravine', 'Intrigue', 'Pale Faces Along the Ridge',
  'When you gallop unscathed past the steep chalk drop, one overeager hanger-on visibly chokes on his wine flask—betraying his master’s hand.',
  'followup', [
   C('Corner the hanger-on smilingly behind oak trees and wring out the whole scheme', 30, { plotPreparation: 14, securityMonths: 10 }, 'ckw_saddle_end'),
   C('Keep silent notes and turn his terrified master’s own spies against him', 0, { securityMonths: 11, prestige: 5 }, 'ckw_saddle_end')
  ]);
 add('ckw_saddle_end', 'Intrigue', 'Double-Stitched Harness Leather',
  'Even silent woods hold eyes—now the crown sees deeper than hired blades.',
  'followup', [
   C('Reward the sharp-eyed groom with a lifetime stable-master cottage', 50, { securityMonths: 9, stability: 6 }),
   C('Check every girth yourself before mounting', 0, { securityMonths: 7, stress: -3 })
  ]);

 // 92. Republic — The Glass-Bottomed Salt Pan Monopoly (3 stages)
 add('ckw_salt_pans', 'Economy & Trade', 'White Pyramids Shimmering Beside Coastal Marshes',
  'Spring tides fill shallow clay evaporation pans with sparkling sea-salt; inland cattle barons beg fixed cheap salt prices while lagoon owners push to raise export tariffs.',
  'trade', [
   C('Buy out inner lagoon pans as state reserves, guaranteeing cheap salt for farmers', 145, { food: 95, credit: 10, trust: 11 }, 'ckw_salt_barges'),
   C('Tax luxury white table-salt exports heavily while exempting coarse pork-curing salt', 55, { credit: 11, food: 55, trust: 8 }, 'ckw_salt_barges'),
   C('Auction the entire seasonal salt harvest to highest merchant syndicate bidders', 0, { gold: 145, trust: -5, unrest: 4 })
  ]);
 add('ckw_salt_barges', 'Economy & Trade', 'Covered Barges Poling Through Reed Channels',
  'Rain squalls threaten uncovered salt heaps on open wharves; carters clamor for tiled sheds before grey drizzle melts fortunes back into mud.',
  'followup', [
   C('Build ventilated slate-roofed salt barns along the main barge basin', 95, { development: 1, food: 60, credit: 9 }, 'ckw_salt_winter'),
   C('Cover heaps fast with tarred sailcloth and hasten inland mule trains', 0, { food: 45, credit: 5 }, 'ckw_salt_winter')
  ]);
 add('ckw_salt_winter', 'Economy & Trade', 'Smoked Hams Hanging Through Frost',
  'Sweet cured pork and butter survive till April without rot—white salt proving steadier wealth than gold rings.',
  'followup', [
   C('Standardize dry bushel-weights across every inland salt-depot', 50, { credit: 9, trust: 8 }),
   C('Collect steady salt customs cleanly', 0, { gold: 95, credit: 5 })
  ]);

 // 93. Horse Lords — The Captured Chronicler in the Yurt (3 stages)
 add('ckw_steppe_scribe', 'Culture & Learning', 'A Silk-Robed Historian Beside Felt Walls',
  'After border skirmishes yield a celebrated southern court chronicler, steppe elders ask whether to ransom him for silver or keep his brush busy writing the Khanate’s true epic.',
  'gov_steppe', [
   C('Treat him honorably with warm sable robes and dictate an honest steppe chronicle', 95, { prestige: 12, research: 10, legitimacy: 8 }, 'ckw_scribe_scroll'),
   C('Set him to teach royal youths geography, accounting, and siege craft', 65, { research: 11, credit: 6, legitimacy: 6 }, 'ckw_scribe_scroll'),
   C('Trade him swiftly back to southern cities for twenty mules of tea and silver', 0, { gold: 125, prestige: 3 })
  ]);
 add('ckw_scribe_scroll', 'Culture & Learning', 'Ink Brushes Freezing Near Flap Doors',
  'Shivering over dried-dung coals, the scholar quietly asks whether to paint your grandfather’s ruthless conquests plain or polish them into dragon legends.',
  'followup', [
   C('Demand unvarnished truth—scars, blizzards, and victories alike', 35, { research: 10, legitimacy: 10, prestige: 7 }, 'ckw_scribe_book'),
   C('Weave grand poetic flourishes that awe foreign ambassadors', 0, { prestige: 13, legitimacy: 6 }, 'ckw_scribe_book')
  ]);
 add('ckw_scribe_book', 'Culture & Learning', 'Bound in Wolf-Hide and Silver Clasps',
  'Generations later strangers read the steppe’s own voice instead of only frightened city rumors.',
  'followup', [
   C('Order three copies kept in separate winter and summer camps', 50, { research: 8, legitimacy: 7 }),
   C('Reward the scribe with freedom and safe passage home', 0, { prestige: 9, piety: 6 })
  ]);

 // 94. Jade Dragon — The Border Fortress Tea-Horse Barter Fair (3 stages)
 add('ckw_tea_fair', 'Economy & Trade', 'Wicker Baskets of Pressed Tea Under Red Flags',
  'Highland riders bring shaggy mountain remounts down snowy valleys to swap for compressed brick tea and iron cooking pots—until crooked border soldiers shake down travelers at the gate.',
  'lowtrust', [
   C('Hang two corrupt gate-serjeants, post clear barter rates, and pave the fairground', 105, { trust: 13, credit: 10, unrest: -8 }, 'ckw_tea_scales'),
   C('Send imperial inspectors with brass weights to supervise every horse-and-tea swap', 55, { trust: 9, credit: 8, legitimacy: 6 }, 'ckw_tea_scales'),
   C('Let gate commanders collect customary handling pennies as long as horses arrive', 0, { gold: 75, trust: -6, unrest: 5 })
  ]);
 add('ckw_tea_scales', 'Economy & Trade', 'Steaming Kettles Inside Felt Booths',
  'Once gate shakedowns stop, twice as many mountain clans ride down with stout pack-ponies and medicinal rhubarb roots.',
  'followup', [
   C('Build heated stone winter stables and tea-warehouses inside the fair wall', 90, { development: 1, credit: 10, trust: 9 }, 'ckw_tea_peace'),
   C('Standardize tea-brick stamps so traders swap cleanly without counterfeit blocks', 0, { credit: 9, research: 5 }, 'ckw_tea_peace')
  ]);
 add('ckw_tea_peace', 'Economy & Trade', 'Hooves and Tea-Carts Crossing Peacefully',
  'Calm border markets turn old raiding clans into steady customers dependent on honest tea.',
  'followup', [
   C('Extend safe-conduct passports to distant valley chieftains', 55, { trust: 10, securityMonths: 7 }),
   C('Tally seasonal horse remounts cleanly', 0, { credit: 7, stability: 5 })
  ]);

 // 95. Sword of Islam — The Calligrapher’s Diwan & Mint Dies (3 stages)
 add('ckw_diwan_script', 'Culture & Learning', 'Reed Pens Sweeping Across Gilded Gold',
  'A master Baghdad-trained calligrapher offers to redesign royal coinage dies and chancery decrees in crisp monumental script—exposing clumsy forged tax tallies across provinces.',
  'inflation', [
   C('Commission matched steel coin-dies and train royal chancery scribes in secret ciphers', 135, { credit: 12, inflation: -3, legitimacy: 9 }, 'ckw_script_coin'),
   C('Adopt his majestic calligraphy purely for mosque plaques and imperial treaties', 75, { prestige: 11, piety: 8, research: 5 }, 'ckw_script_coin'),
   C('Stick to sturdy existing mint dies; merchants dislike unfamiliar coin faces', 0, { credit: 4, stability: 4 })
  ]);
 add('ckw_script_coin', 'Culture & Learning', 'Crisp Dinars Ringing Against Touchstones',
  'Within months bazaar money-changers spot counterfeit clipped coins effortlessly by hair-fine calligraphic flourishes along the rim.',
  'followup', [
   C('Recall worn clipped silver cleanly at honest bullion weight to steady markets', 85, { credit: 12, inflation: -3, trust: 9 }, 'ckw_script_end'),
   C('Print crisp watermarked seal-rules for provincial mint-masters', 0, { legitimacy: 8, securityMonths: 7 }, 'ckw_script_end')
  ]);
 add('ckw_script_end', 'Culture & Learning', 'Beauty Guarding Honest Weight',
  'Sharp art serves sharp silver—foreign caravans trust your stamp from harbor quay to desert pass.',
  'followup', [
   C('Endow a royal school of calligraphy and die-engraving', 70, { research: 9, prestige: 9 }),
   C('Lock master steel dies inside treasury safes', 0, { securityMonths: 8, credit: 5 })
  ]);

 // 96. Rajas of India — The Pepper Port’s Monsoon Fleet (3 stages)
 add('ckw_pepper_fleet', 'Economy & Trade', 'Black Pepper Piled Like Coal on Timber Wharves',
  'Arab dhows and Chinese junks crowd coastal anchorages racing monsoon winds for black Malabar pepper—while rival coastal rajas whisper offers to lure captains down-coast with lower harbor fees.',
  'crossroads_oceanic', [
   C('Dredge harbor channels, lower anchorage fees, and build stone spice-godowns', 155, { development: 1, credit: 13, prestige: 8 }, 'ckw_pepper_godown'),
   C('Guarantee strict royal protection for shipwrecked sailors’ cargo to win trust', 65, { credit: 10, trust: 11, legitimacy: 6 }, 'ckw_pepper_godown'),
   C('Raise customs sharply while monsoon winds trap departing hulls', 0, { gold: 135, credit: -6, trust: -5 })
  ]);
 add('ckw_pepper_godown', 'Economy & Trade', 'Saffron, Ivory, and Copper Ingots Swapped at Dawn',
  'Protected from beach wreckers by explicit royal decree, foreign captains pour gleaming Venetian ducats and Ming porcelain onto your shore.',
  'followup', [
   C('Establish multilingual harbor courts settling sailor disputes in twenty-four hours', 80, { credit: 12, acceptance: 9, legitimacy: 7 }, 'ckw_pepper_sail'),
   C('Tax only wholesale warehouse rents cleanly without touching small spice-boats', 0, { trust: 9, credit: 8 }, 'ckw_pepper_sail')
  ]);
 add('ckw_pepper_sail', 'Economy & Trade', 'Lateen Sails Riding Monsoon Gusts',
  'Word races across the Indian Ocean: your stone wharves yield honest weights, swift justice, and dry pepper sacks.',
  'followup', [
   C('Build coastal watch-lighthouses guiding night spice convoys', 75, { development: 1, credit: 10 }),
   C('Close seasonal harbor ledgers cleanly', 0, { gold: 100, credit: 5 })
  ]);

 // 97. Conclave — The Adolescent Heir’s First Field Command (3 stages)
 add('ckw_heir_command', 'Military', 'Polished Cuirass Hanging Loose on Narrow Shoulders',
  'Eager to prove manhood beside battle-scarred captains, your young adult heir begs command of the vanguard cavalry wing on spring maneuvers—despite nervous whispers from grey councillors.',
  'adultHeir', [
   C('Grant command paired with a crusty veteran sergeant-major at the bridle', 95, { education: 15, prestige: 9, opinion: 14 }, 'ckw_command_ford'),
   C('Assign the heir to oversee supply wagons and siege artillery engineering first', 60, { education: 13, credit: 5, opinion: 6 }, 'ckw_command_ford'),
   C('Keep the heir safely inside the capital council room until greybeards approve', 0, { stability: 5, opinion: -10, education: 4 })
  ]);
 add('ckw_command_ford', 'Military', 'Muddy Stirrups at the River Crossing',
  'During mock river-forcing exercises, reckless young nobles splash too fast into deep current—leaving the heir to decide between dashing glory and pulling drowning horses ashore.',
  'followup', [
   C('Shout orders to halt glory-charges and rescue tangled horsemen calmly', 25, { education: 15, legitimacy: 8, opinion: 12 }, 'ckw_command_home'),
   C('Press across the sandbar cleanly to prove iron resolve before veterans', 0, { prestige: 9, education: 10, stress: 4 }, 'ckw_command_home')
  ]);
 add('ckw_command_home', 'Military', 'Muddy Boots Beneath Banners',
  'Returning sunburnt and hoarse, the young royal carries genuine respect from iron-faced men who cannot be bribed by velvet.',
  'followup', [
   C('Commission a warhorse and gilded spurs for the young commander', 65, { prestige: 9, education: 10, opinion: 10 }),
   C('Rest horses and enter drill marks neatly', 0, { stability: 5, education: 5 })
  ]);

 // 98. Way of Life — High Stress & the Royal Falconry Retreat (3 stages)
 add('ckw_stress_moor', 'Lifestyle', 'Wind Over Purple Heather Wastes',
  'Tight chest pains and ringing ears follow you from council chamber to dark pillow; your physician warns one more frantic month of quarrels will snap heart or temper.',
  'highStress', [
   C('Ride out to moorland hunting lodges for seven silent days without couriers', 80, { stress: -26, prestige: 4 }, 'ckw_moor_hawk'),
   C('Cut half of ceremonial audiences cleanly and hand routine seals to trusted aides', 35, { stress: -18, legitimacy: 4 }, 'ckw_moor_hawk'),
   C('Grit teeth, swallow bitter sleeping drafts, and refuse to leave the desk', 0, { legitimacy: 5, stress: 8 })
  ]);
 add('ckw_moor_hawk', 'Lifestyle', 'Gulls Wheeling Above Salt Cliffs',
  'No herald shouts behind your chair on windy turf; watching merlins stoop across gorse slowly unknots clenched shoulders.',
  'followup', [
   C('Sleep ten hours nightly in plain wool and return steadily on horseback', 25, { stress: -18, stability: 5 }, 'ckw_moor_dawn'),
   C('Dictate three calm broad strategic memos from the cliffside porch', 0, { stress: -12, legitimacy: 6 }, 'ckw_moor_dawn')
  ]);
 add('ckw_moor_dawn', 'Lifestyle', 'Even Breath at Council Doors',
  'A rested mind spots traps three steps earlier than an exhausted hero.',
  'followup', [
   C('Establish standing deputy-seal days so work never suffocates the throne', 45, { stress: -10, stability: 6 }),
   C('Step calmly back into the hall', 0, { stress: -6, legitimacy: 4 })
  ]);

 // 99. Conclave — Discontented Vassal’s Marriage Petition (3 stages)
 add('ckw_vassal_ward', 'Politics', 'A Proud Baron’s Daughter Left Unwed',
  'Nursing sour grievances over lost forest courts, a powerful frontier vassal petitions the crown for leave to wed his eldest daughter to a rich foreign merchant duke across the river.',
  'disloyal', [
   C('Approve the honorable match warmly and attend with a royal wedding gift', 110, { loyalty: 16, stability: 6, prestige: 6 }, 'ckw_vassal_toast'),
   C('Match her instead to a loyal domestic house with sweet crown meadow dowries', 135, { loyalty: 14, legitimacy: 8, trust: 5 }, 'ckw_vassal_toast'),
   C('Veto the foreign match sternly under ancient feudal wardship rights', 0, { legitimacy: 7, loyalty: -10, leverage: 12 })
  ]);
 add('ckw_vassal_toast', 'Politics', 'Gold Goblets Raised Under Oak Beams',
  'At the wedding hall border knights watch whether old friction melts—or sharpens behind polite smiles.',
  'followup', [
   C('Confirm the baron’s local woodland hunting liberties cleanly at the feast', 45, { loyalty: 12, trust: 7, unrest: -5 }, 'ckw_vassal_peace'),
   C('Keep wedding courtesies brief and post sharp customs watchers on river ferries', 0, { securityMonths: 8, legitimacy: 5 }, 'ckw_vassal_peace')
  ]);
 add('ckw_vassal_peace', 'Politics', 'Banners Flying Quietly on the Ridge',
  'Border towers answer dispatches promptly again—small courtesies at wedding tables sometimes save fifty spears in winter.',
  'followup', [
   C('Exchange autumn hunting hounds to cement the mended bond', 50, { loyalty: 10, stability: 5 }),
   C('File the marriage license neatly', 0, { legitimacy: 5, stability: 4 })
  ]);

 // 100. Way of Life — The Master Gunpowder Founder’s Crack (3 stages)
 add('ckw_bombard_crack', 'Military', 'Hairline Split Inside the Bronze Barrel',
  'Preparing brass siege bombards for spring campaigns, master founders discover a casting bubble along the main breech ring—warning one full powder charge could blow gunners to splinters.',
  'crossroads_gunpowder', [
   C('Melt down the flawed bronze cleanly and cast twin stronger culverins with new vents', 155, { research: 11, tools: 18, prestige: 7 }, 'ckw_bombard_test'),
   C('Bind the breech tightly with shrunk wrought-iron hoops and cut powder charges', 65, { tools: 12, stability: 5, research: 5 }, 'ckw_bombard_test'),
   C('Scrap the heavy bronze monster and buy reliable iron trebuchet fittings', 0, { gold: 70, tools: 10, stability: 4 })
  ]);
 add('ckw_bombard_test', 'Military', 'Long Linstock Behind Earth Gabions',
  'On the lonely river gravel pit every gun-crew ducks behind oak hurdles as glowing match touches prime powder.',
  'followup', [
   C('Record exact copper-tin alloy ratios and test-fire five rounds cleanly', 70, { research: 11, tools: 14, prestige: 8 }, 'ckw_bombard_ready'),
   C('Celebrate one clean shot cleanly and haul guns straight to dry sheds', 0, { stability: 6, prestige: 6 }, 'ckw_bombard_ready')
  ]);
 add('ckw_bombard_ready', 'Military', 'Thunder Under Royal Control',
  'Artillery teams stand upright beside reliable bronze—no longer fearing their own fuses more than enemy walls.',
  'followup', [
   C('Endow a salaried Royal Foundry School beside the arsenal', 85, { research: 11, development: 1 }),
   C('Grease bronze muzzles cleanly for storage', 0, { tools: 10, stability: 5 })
  ]);

 // 101. Conclave — The Council’s Secret Ledger of Favors (3 stages)
 add('ckw_favor_ledger', 'Court', 'Marked Beans Inside the Velvet Bag',
  'Before a bitter frontier fortification vote, your loyal secretary uncovers a pact among three councillors trading mutual yes-votes for future wardships behind closed tapestries.',
  'councillor', [
   C('Buy out the swing councillor cleanly with an honored royal forest wardship', 120, { opinion: 16, legitimacy: 7, stability: 5 }, 'ckw_favor_vote'),
   C('Expose the logrolling ring quietly before vote-call so each man sweats alone', 45, { securityMonths: 10, legitimacy: 9, opinion: -10 }, 'ckw_favor_vote'),
   C('Let ordinary council politics run; favors always grease oak tables', 0, { stability: 4, opinion: 6, credit: -2 })
  ]);
 add('ckw_favor_vote', 'Court', 'Silence Around the Baize Table',
  'When the roll calls out the swing councillor’s name, every eye narrows across carved chairs—watching whether conscience or coin speaks.',
  'followup', [
   C('Praise public duty over faction bargains and seal the fort budget cleanly', 55, { legitimacy: 9, stability: 6, opinion: 8 }, 'ckw_favor_close'),
   C('Adjourn right after the vote and audit minor wardship fees', 0, { credit: 5, securityMonths: 7 }, 'ckw_favor_close')
  ]);
 add('ckw_favor_close', 'Court', 'Clean Parchment Minutes',
  'Every councillor remembers the crown reads more than inked signatures.',
  'followup', [
   C('Establish fixed published rules for granting royal wardships', 50, { legitimacy: 8, stability: 6 }),
   C('Close the council chamber cleanly', 0, { stability: 5, stress: -3 })
  ]);

 // 102. Way of Life — The Business Expedition’s Cinnamon Reef (3 stages)
 add('ckw_spice_charter', 'Economy & Trade', 'Salt-Crusted Portolans on Pine Tables',
  'Daring ship-captains seek a crown charter to round uncharted cape reefs straight toward southern cinnamon coves—promising triple spice returns if ships clear winter shoals.',
  'crossroads_oceanic', [
   C('Charter two stout carracks with brass astrolabes and honest surgeon chests', 160, { credit: 13, research: 10, prestige: 9 }, 'ckw_cape_squall'),
   C('Grant only nominal royal flags to private risk-takers for a tenth of profit', 45, { credit: 8, gold: 65 }, 'ckw_cape_squall'),
   C('Keep ships safe inside familiar coastal convoys', 0, { stability: 5, credit: 3 })
  ]);
 add('ckw_cape_squall', 'Economy & Trade', 'Broken Topmast Off Strange Headlands',
  'Six months out, only one battered carrack limps back past the harbor mole—hull crusted in barnacles, yet hold fragrant with wild cinnamon and strange woven mats.',
  'followup', [
   C('Pay survivors double shares, mend hulls, and map every shoal on brass plates', 85, { research: 11, credit: 11, trust: 9 }, 'ckw_cape_quay'),
   C('Auction the precious bark swiftly to pay off expedition bills', 0, { gold: 145, credit: 6 }, 'ckw_cape_quay')
  ]);
 add('ckw_cape_quay', 'Economy & Trade', 'New Stars Added to Harbor Charts',
  'Harbor pilots crowd the tavern copying southern headland soundings—trade horizons widen past old maps.',
  'followup', [
   C('Found a permanent Admiralty Chart-Room beside the customs gate', 75, { research: 11, credit: 9 }),
   C('Store remaining cinnamon in dry vaults', 0, { credit: 6, prestige: 5 })
  ]);

 // 103. Republic — The Guildhall Bell-Tower Clock Strike (3 stages)
 add('ckw_weaver_clock', 'Politics', 'Two Different Hours Rung Across the Square',
  'To squeeze extra cloth out of weary looms, wealthy wool merchants install a fast-running work-bell above the guildhall—provoking furious weavers who smash the bell-rope at dawn.',
  'unrest', [
   C('Smash partisan bells and erect one honest crown-regulated water-clock for all', 120, { trust: 12, unrest: -12, credit: 7 }, 'ckw_clock_shift'),
   C('Set clear daylight bell-hours mediating fair supper breaks for loom-workers', 55, { trust: 10, unrest: -8, stability: 5 }, 'ckw_clock_shift'),
   C('Fine rioting weavers heavily and restore merchant factory-bells', 0, { gold: 75, unrest: 9, trust: -8 })
  ]);
 add('ckw_clock_shift', 'Politics', 'Empty Looms Waiting Under Skylights',
  'Representatives from both camps eye brass pendulums suspiciously until royal inspectors test weights against clean noon sundials.',
  'followup', [
   C('Display the calibrated brass sundial openly beside market steps', 45, { research: 6, trust: 9, legitimacy: 7 }, 'ckw_clock_peace'),
   C('Guarantee fixed dawn-to-dusk summer hours cleanly in guild charters', 0, { stability: 7, unrest: -6 }, 'ckw_clock_peace')
  ]);
 add('ckw_clock_peace', 'Politics', 'Shuttles Flying to Honest Time',
  'Cloth bolts stack high again without broken doors—fair timekeeping turns bitterness into steady looms.',
  'followup', [
   C('Maintain salaried civic clock-wardens', 50, { trust: 8, credit: 6 }),
   C('Return watchmen to ordinary patrol', 0, { stability: 5 })
  ]);

 // 104. Horse Lords — The Captured Wolf-Cub & Steppe Scouts (3 stages)
 add('ckw_wolf_scouts', 'Military', 'Grey Cubs Howling Outside the Horse Lines',
  'Returning scouts bring half-tame grey wolf pups rescued from spring floods—claiming steppesmen of old trained silent pack-dogs to sniff night ambushes along canyons.',
  'army', [
   C('Endow frontier scout-kennels pairing tough steppe hounds with outriders', 105, { morale: 10, experience: 0.08, supply: 8 }, 'ckw_wolf_ambush'),
   C('Keep the sharp-eared scouts strictly on fast remounts without pack distraction', 45, { morale: 6, supply: 10 }, 'ckw_wolf_ambush'),
   C('Turn wild pups loose beyond the hills; wolves belong to open grass', 0, { morale: 4, stability: 4 })
  ]);
 add('ckw_wolf_ambush', 'Military', 'Hackles Raised in Dry Juniper Brush',
  'On misty autumn maneuvers, keen-nosed hounds freeze silently facing rocky gullies—betraying hidden mock-ambushers fifty yards before cavalry trots into range.',
  'followup', [
   C('Adopt trained scout-hounds across every border patrol banner', 70, { experience: 0.09, morale: 10, supply: 10 }, 'ckw_wolf_end'),
   C('Reward the bold kennel-master with silver horse-trappings', 0, { prestige: 7, morale: 6 }, 'ckw_wolf_end')
  ]);
 add('ckw_wolf_end', 'Military', 'Eyes in the Mist',
  'Border patrols sleep easier beside campfires knowing keen ears guard the dark perimeter.',
  'followup', [
   C('Grant steady hound-meat rations at frontier watch-posts', 45, { supply: 12, morale: 7 }),
   C('Break camp cleanly at sunrise', 0, { fatigue: -5, morale: 4 })
  ]);

 // 105. Jade Dragon — The Porcelain Tribute Vase Shattered in Hall (3 stages)
 add('ckw_broken_celadon', 'Diplomacy', 'Jade Shards Across Polished Slate',
  'While carrying a priceless imperial celadon dragon-vase across the audience floor, a nervous young page trips on velvet carpet—shattering the diplomatic gift before foreign envoys.',
  'friendly', [
   C('Laugh warmly, mend shards in pure gold lacquer kintsugi-style, and praise the boy’s grace', 90, { relation: 14, prestige: 10, stability: 5 }, 'ckw_celadon_mend'),
   C('Pay discreet master potters at once for an even finer twin pair before farewells', 135, { relation: 15, prestige: 8, credit: 4 }, 'ckw_celadon_mend'),
   C('Blame slippery floor wax, dismiss the clumsy boy, and present plain silver ewers', 0, { relation: 4, prestige: -2, stability: 4 })
  ]);
 add('ckw_celadon_mend', 'Diplomacy', 'Gold Veins Gleaming Across Cracks',
  'Foreign ambassadors stare astonished when the mended vase returns veined in pure gold lacquer—proclaiming a realm that turns accidents into finer art.',
  'followup', [
   C('Gift a twin gold-veined bowl back to the envoy’s sovereign as token of unbreakable ties', 60, { relation: 15, prestige: 9 }, 'ckw_celadon_close'),
   C('Display the golden-scarred vase proudly in the main gallery', 0, { prestige: 8, relation: 6 }, 'ckw_celadon_close')
  ]);
 add('ckw_celadon_close', 'Diplomacy', 'Polite Bows at Departure',
  'What threatened court humiliation becomes the favorite story whispered across distant tea-tables.',
  'followup', [
   C('Patronize lacquer-menders and fine ceramicists at court', 65, { prestige: 8, research: 6 }),
   C('Bid foreign envoys fair weather home', 0, { relation: 7, stability: 4 })
  ]);

 // 106. Sword of Islam — The Water-Wheel Norias of the River Valley (3 stages)
 add('ckw_river_norias', 'Economy & Trade', 'Groaning Cedar Wheels Lifting Silver Streams',
  'Master Syrian water-engineers propose raising giant thirty-foot cedar noria paddle-wheels along sluggish valley banks—lifting irrigation water effortlessly onto dry high terraces.',
  'food', [
   C('Fund limestone aqueduct piers and six towering cedar noria wheels', 160, { food: 120, development: 1, trust: 11 }, 'ckw_noria_groan'),
   C('Build two smaller community wheels and teach village carpenters upkeep', 80, { food: 80, tools: 15, trust: 8 }, 'ckw_noria_groan'),
   C('Stick to ox-driven leather buckets along shallow ditches', 0, { food: 35, stability: 4 })
  ]);
 add('ckw_noria_groan', 'Economy & Trade', 'Emerald Orchards Above Dry Chalk',
  'As wooden paddles creak steadily day and night, dry chalk ridges turn bright with figs, wheat, and clover—drawing thirsty herdsmen down to marvel.',
  'followup', [
   C('Charter water-sharing hour-clocks so upper and lower orchards share flows cleanly', 60, { trust: 11, food: 65, stability: 6 }, 'ckw_noria_bloom'),
   C('Let village elders turn sluices by traditional sunrise tallies', 0, { food: 40, trust: 6 }, 'ckw_noria_bloom')
  ]);
 add('ckw_noria_bloom', 'Economy & Trade', 'Singing Wheels Along Dusk',
  'Creaking cedar songs become the heartbeat of prosperous orchards that laugh at dry Julys.',
  'followup', [
   C('Exempt irrigated terrace grain from double frontier cart-tolls', 45, { credit: 8, trust: 9 }),
   C('Inspect limestone piers cleanly before floods', 0, { food: 45, stability: 5 })
  ]);

 // 107. Rajas of India — The Royal Chess & Chaturanga Match (3 stages)
 add('ckw_chaturanga_board', 'Court', 'Carved Sandalwood Elephants on Silk Squares',
  'Across a fragrant courtyard pavilion, your bitterest palace rival challenges you before foreign envoys to three games of Chaturanga—hinting bluntly that wits, not birth, prove sovereignty.',
  'courtRival', [
   C('Accept smiling over rose-sherbet and outthink his flashy queen-charges patiently', 40, { prestige: 10, opinion: -6, legitimacy: 8 }, 'ckw_chaturanga_mate'),
   C('Propose playing for shared realm charity: loser endows a public well', 95, { prestige: 11, opinion: 14, piety: 7 }, 'ckw_chaturanga_mate'),
   C('Decline parlor traps politely and attend urgent border treasury maps', 0, { legitimacy: 5, credit: 4, opinion: -4 })
  ]);
 add('ckw_chaturanga_mate', 'Court', 'Two Ivory Kings Cornered Under Torchlight',
  'By the third decisive game, every courtier leans breathless over carved elephants as your knight forks rook and king simultaneously.',
  'followup', [
   C('Tip your sandalwood knight gently smiling, and invite him to inspect border forts together', 35, { prestige: 9, opinion: 16, stability: 6 }, 'ckw_chaturanga_end'),
   C('Accept the applause coolly so rivals remember patience bites harder than pride', 0, { legitimacy: 9, prestige: 8, opinion: -10 }, 'ckw_chaturanga_end')
  ]);
 add('ckw_chaturanga_end', 'Court', 'Silence Over Sandalwood Squares',
  'Envoys whisper homeward that this throne calculates four moves deeper than court gossips guess.',
  'followup', [
   C('Endow a royal academy of mathematics and strategic games', 65, { research: 9, prestige: 8 }),
   C('Pack carved pieces back into velvet', 0, { stability: 5, stress: -4 })
  ]);

 // 108. Conclave — The Honest Bailiff’s Coin-Clipping Catch (3 stages)
 add('ckw_clipped_groats', 'Economy & Trade', 'Silver Shavings Hidden Under Cobbler’s Wax',
  'Country bailiffs drag in a ring of clever clippers who shave tiny silver slivers off every royal coin before passing lightened groats to soldiers and market women.',
  'lowstability', [
   C('Mint milled grooved-edge coins impossible to clip unseen and hang ring-leaders', 135, { credit: 13, inflation: -3, stability: 8 }, 'ckw_groats_mint'),
   C('Recall lightened groats cleanly at crown mints and issue honest weight scales', 85, { credit: 10, trust: 10, inflation: -2 }, 'ckw_groats_mint'),
   C('Fine clipped coins by weight at tax booths and let markets sort copper', 0, { gold: 75, trust: -5, stability: 3 })
  ]);
 add('ckw_groats_mint', 'Economy & Trade', 'Screws Pressing Crisp Reeded Rims',
  'Ingenious mint-smiths rig heavy horse-driven screw presses that stamp notched ridges around every coin edge—sparking amazement at market stalls.',
  'followup', [
   C('Standardize screw-milled silver across every provincial mint', 95, { research: 9, credit: 12, development: 1 }, 'ckw_groats_clean'),
   C('Circulate new milled coins first through garrison paymasters', 0, { credit: 8, stability: 6 }, 'ckw_groats_clean')
  ]);
 add('ckw_groats_clean', 'Economy & Trade', 'Full Weight Ringing on Stone Counters',
  'Merchants bite silver no longer; crisp grooved coins carry royal faith cleanly across borders.',
  'followup', [
   C('Reward the honest bailiff who caught the shavings with a manor lease', 55, { trust: 9, legitimacy: 7 }),
   C('Lock old hand-hammer dies away', 0, { credit: 6, stability: 5 })
  ]);

 return out;
};
