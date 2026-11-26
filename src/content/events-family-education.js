/**
 * Sovereign: 1450 — Modular Content Pack: Family, Childhood Education & Dynasty Life
 * 174 distinct scenarios & follow-ups using verified campaign state triggers and effects.
 */
const BANK = [
 ['fam_heir_tutor_rhetoric','Family','Classical Rhetoric for the Heir','The royal preceptor proposes debating classical treatises at court to sharpen diplomatic poise.','wardGuardian',['Fund debating hall texts',70,{education:9,opinion:6,focusXP:6},'Assign stern memorization drills',0,{education:4,stress:4}]],
 ['fam_child_horse_talent','Family','Young Rider in the Stables','Stablemasters report your young ward shows fearless balance atop chargers.','child',['Gift a trained destrier foal',80,{education:8,prestige:4},'Keep the youth on sturdy ponies',0,{education:3}]],
 ['fam_child_chronicler','Family','Inquisitive Eyes in the Library','A royal child has spent evenings copying chronicles alongside court scribes.','child',['Commission illuminated primers',65,{education:10,research:4},'Direct focus toward riding and arms',0,{education:4}]],
 ['fam_heir_petty_quarrel','Family','Quarrel Between Princes','Your elder and younger heirs clashed loudly over ceremonial precedence before courtiers.','competingHeirs',['Mediate privately with gifts',60,{opinion:8,loyalty:5,stress:3},'Uphold strict seniority publicly',0,{legitimacy:4,opinion:-6}]],
 ['fam_heir_first_council','Family','Adult Heir Claims a Seat','Now of age, your heir asks to witness privy deliberations and treasury audits.','adultHeir',['Grant a junior portfolio',90,{legitimacy:7,education:6,prestige:4},'Keep counsel restricted to senior peers',0,{legitimacy:-3,stress:3}]],
 ['fam_spouse_charitable_almshouse','Family','Consort’s Almshouse Petition','Your royal consort asks patronage for granary doles and infirmaries near the capital gate.','married',['Endow the royal consort’s charity',100,{piety:8,trust:8,unrest:-4,opinion:10},'Curtail extraordinary grants this season',0,{opinion:-6,gold:15}]],
 ['fam_spouse_diplomatic_correspondence','Family','Letters Across Borders','Your foreign-born consort maintains warm correspondence with cousins at their natal court.','foreignMarriage',['Encourage official kin embassies',85,{relation:12,prestige:5,trade:4},'Audit sealed couriers quietly',0,{securityMonths:6,opinion:-8}]],
 ['fam_childless_pilgrim_vow','Family','Prayers for an Heir','Without direct issue in the cradle, court prelates urge vows at an ancestral shrine.','childless',['Sponsor a grand candlelight vigil',110,{piety:10,legitimacy:5,stress:-5},'Focus on adopting worthy kin',0,{stability:3,prestige:2}]],
 ['fam_courtier_matchmaking','Family','A Promising Court Match','Matchmakers propose uniting two loyal noble households within the royal capital.','domesticMatch',['Host the betrothal banquet',95,{loyalty:8,opinion:10,prestige:4},'Leave families to sign privately',0,{gold:20}]],
 ['fam_dynastic_envoy_match','Family','A Foreign Royal Betrothal','Ambassadors arrive with gilded miniatures to negotiate a cross-border marriage alliance.','foreignMatch',['Exchange lavish dowry pledges',140,{wedding:1,relation:15,prestige:8},'Decline entanglement at this hour',0,{stability:2}]],
 ['fam_old_regent_counsel','Family','The Regency’s Weight','Elders at court whisper over who truly guides the seal during delicate regency months.','regency',['Reward loyal regency stewards',95,{loyalty:9,stability:6},'Assert sovereign prerogatives early',0,{prestige:6,loyalty:-4}]],
 ['fam_sickroom_vigil','Family','Fever in the Bedchamber','An ailing relative lies pale behind heavy curtains while physicians argue remedies.','illness',['Summon renowned apothecaries',110,{health:-22,piety:4},'Rely on broth and quiet rest',0,{health:-8,stress:4}]],
 ['fam_sibling_jealous_estate','Family','A Younger Sibling’s Stipend','A younger dynastic kinsman complains his coastal manor yields less than a captain’s pay.','competingHeirs',['Expand their appanage stipend',105,{loyalty:10,opinion:12},'Remind them of dynastic obedience',0,{opinion:-10,legitimacy:3}]],
 ['fam_ward_astronomy_night','Family','Stargazing on the Battlements','A ward watches winter constellations and questions how navigators measure southern seas.','wardGuardian',['Buy brass astrolabes for lessons',75,{education:9,research:5},'Send the child to bed on time',0,{education:2}]],
 ['fam_royal_christening_feast','Family','Naming Day Pageantry','Bells and heralds mark a royal child’s milestone year before assembled provincial lords.','child',['Throw open a three-day tournament feast',125,{prestige:10,loyalty:7,stability:4},'Hold an austere chapel blessing',20,{piety:7}]],
 ['fam_consort_patron_music','Family','Musicians of the Bedchamber','Your consort wishes to retain lutists and singers to soothe fractious envoys at supper.','married',['Retain the court ensemble',80,{stress:-10,prestige:6,opinion:8},'Preserve quiet austerity in the hall',0,{gold:15}]],
 ['fam_kin_funeral_monument','Family','Carving the Ancestral Tomb','Master masons submit alabaster designs to honor departed kin in the royal abbey.','newReign',['Commission the carved effigy',135,{legitimacy:10,piety:8,prestige:7},'Order a humble inscribed slab',25,{piety:4,gold:30}]],
 ['fam_guardian_strict_vs_gentle','Family','The Preceptor’s Rod','Your child’s guardian asks whether to sharpen discipline with strict Latin rosters or gentler tales.','wardGuardian',['Encourage patience and curiosity',45,{education:7,stress:-4,opinion:7},'Demand uncompromising rigor',0,{education:8,opinion:-5}]],
 ['fam_foreign_consort_customs','Family','Outlandish Attire at Table','Courtiers murmur over the foreign recipes and silks championed by your consort’s retinue.','foreignMarriage',['Celebrate cosmopolitan court life',65,{acceptance:7,relation:8,opinion:8},'Favor native dress on feast days',0,{legitimacy:4,opinion:-5}]],
 ['fam_heir_sword_blessing','Family','First Girding of the Sword','Senior marshals offer to present your heir’s first ceremonial blade before the garrison.','adultHeir',['Hold a public knightly investiture',110,{morale:6,legitimacy:8,prestige:6},'Conduct the rite in the private chapel',30,{piety:5,legitimacy:3}]],
 ['fam_grandparent_heirlooms','Family','The Dowager’s Trunk','An elderly kinswoman unlocks chests of wedding rings, falconry hoods, and faded treaties.','married',['Restore the family keepsakes',65,{prestige:6,opinion:7,legitimacy:3},'Catalog the silver for treasury security',0,{gold:35}]],
 ['fam_child_guild_visit','Family','Among the Market Guilds','A young prince wandered into the armorers’ quarter fascinated by bellows and temper water.','child',['Arrange formal craft apprenticeships',60,{education:7,development:1,trust:5},'Confine young royals to palace grounds',0,{stability:2}]],
 ['fam_estranged_cousin_return','Family','Return of the Prodigal Cousin','A long-wandering cousin returns from mercenary service seeking forgiveness and bread.','competingHeirs',['Grant an honorable household post',85,{loyalty:7,opinion:9,morale:3},'Keep them politely beyond the inner ring',0,{securityMonths:6,opinion:-6}]],
 ['fam_royal_nursery_quarrel','Family','Tears Over a Painted Toy','Nursemaids bring a squabble over an ivory war-horse before the sovereign for judgment.','child',['Commission matching carved toys',35,{opinion:5,stress:-4},'Teach the children to share or forfeit',0,{education:4}]],
 ['fam_marriage_settlement_dispute','Family','Dowry Estates Reassessed','Bailiffs report that boundary stones on a consort’s dowry manor were shifted in winter.','married',['Survey and restore the estate fairly',70,{opinion:9,trust:6,legitimacy:3},'Award disputed meadows to the crown',0,{gold:40,opinion:-9}]],
 ['fam_adolescent_poet','Family','Verses Penciled in Margins','Your young ward fills grammar margins with heroic ballads in the vernacular tongue.','wardGuardian',['Sponsor a court recitation evening',55,{education:6,prestige:5,opinion:7},'Refocus the youth onto treasury ledgers',0,{education:7}]],
 ['fam_dynastic_portrait_sitting','Family','The Court Limner’s Canvas','A celebrated painter asks the royal family to sit in state robes for a generational panel.','married',['Pay for lapis and gold leaf pigments',120,{prestige:11,legitimacy:6,opinion:6},'Request simple charcoal sketches instead',25,{gold:20}]],
 ['fam_heir_falconry_bond','Family','Hawking at Dawn','Rulers and heirs alike bond cleanly along misty riverbank marshes before falconers cast off.','adultHeir',['Take only your heir and two hounds',60,{opinion:12,stress:-9,prestige:4},'Turn the hunt into a grand vassal show',110,{loyalty:6,prestige:7}]],
 ['fam_bastard_acknowledgment','Family','Whispered Claim of Blood','A loyal retainer quietly brings word of a bright youth bearing unmistakable family features.','courtFriend',['Provide quiet schooling and coin',90,{prestige:-2,opinion:6,education:6},'Silence the rumor with firm discretion',40,{legitimacy:4,securityMonths:6}]],
 ['fam_sibling_monastic_vocation','Family','A Younger Son’s Calling','Rather than crave border castles, a younger royal asks permission to enter a learned abbey.','competingHeirs',['Endow their scholarly cell generously',110,{piety:14,legitimacy:5},'Keep all dynastic kin in lay service',0,{prestige:4,opinion:-5}]],
 ['fam_spouse_spy_rumor','Family','Voices Behind the Lattice','A jealous chambermaid accuses your consort’s secretary of passing household gossip abroad.','courtRival',['Hold a swift private inquiry',55,{securityMonths:8,opinion:-3},'Rebuke court tale-bearing openly',0,{opinion:8,loyalty:3}]],
 ['fam_ward_polyglot_tongue','Family','Lessons in Foreign Tongues','A foreign clerk at court offers to teach your young ward trading dialects and envoy manners.','wardGuardian',['Hire the interpreter for daily lessons',80,{education:9,relation:6},'Stick firmly to courtly chancery prose',0,{education:4}]],
 ['fam_councillor_godparent','Family','Godparent to a Noble House','A trusted adviser begs you to stand sponsor at his newborn daughter’s naming ceremony.','councillor',['Gift a silver cup and royal favor',75,{loyalty:10,opinion:12,prestige:4},'Send warm written blessings',0,{piety:4}]],
 ['fam_elderly_memoirs','Family','Dictating the Reign’s Annals','Old servants urge the sovereign to record hard-won lessons for grandchildren yet unborn.','stress',['Retire three evenings with chroniclers',50,{stress:-14,legitimacy:5,prestige:5},'Keep the ledger strictly functional',0,{gold:15}]],
 ['fam_childless_adoption_law','Family','Lawyers Debate Kin Inheritance','Lacking near issue in the nursery, jurists examine whether collateral cousins may stand next.','childless',['Register collateral kin publicly',90,{legitimacy:9,stability:4},'Keep the crown’s options unannounced',0,{prestige:3}]],
 ['fam_foreign_consort_gardens','Family','Orchard Cuttings From Afar','Your consort’s homeland sent citrus saplings and rose cuttings for the palace cloister.','foreignMarriage',['Build a glassed south garden bed',110,{prestige:7,opinion:10,development:1},'Plant hardy local herbs instead',15,{food:35}]],
 ['fam_heir_border_inspection','Family','The Heir Tours the Marches','Frontier wardens welcome an adult heir to inspect granaries, bridges, and muster yards.','adultHeir',['Fund an armed progress of the march',125,{loyalty:8,morale:6,prestige:7},'Send written dispatches from court',0,{stability:2}]],
 ['fam_child_illness_prayer','Family','Candlelight for a Fevered Child','A sudden chill grips the royal nursery, keeping attendants awake past midnight.','illness',['Call three physicians and the prelate',115,{health:-25,piety:6,stress:-4},'Trust domestic herbal poultices',25,{health:-10}]],
 ['fam_court_wedding_tournament','Family','Jousts for a Dynastic Match','Young knights clamor to tilt with blunted lances in honor of a noble palace wedding.','domesticMatch',['Sponsor heraldic lists and prizes',130,{prestige:10,morale:7,loyalty:6},'Bless the vows without martial pomp',20,{piety:5}]],
 ['fam_friend_bereaved','Family','A Dear Companion’s Loss','A longtime court friend wears black mourning wool after losing a parent on the frontier.','courtFriend',['Grant six months’ leave and coin',75,{opinion:15,stress:-3,loyalty:6},'Offer solemn counsel in person',0,{opinion:6,piety:3}]],
 ['fam_heir_mercantile_taste','Family','Prince Among the Tollkeepers','Your heir argues fiercely that lowering pier duties will double customs volume by autumn.','adultHeir',['Let them pilot lower guild dues',85,{credit:7,trade:8,education:5},'Insist princes remain above ledgers',0,{prestige:4,credit:-2}]],
 ['fam_rival_ward_hostage','Family','Raising a Restless Lord’s Child','Raising a suspect vassal’s youth at court could mend a rift or foster lifelong resentment.','wardGuardian',['Treat the ward beside royal kin',70,{loyalty:10,trust:6,opinion:10},'Keep strict chaperones at every door',0,{securityMonths:8,opinion:-6}]],
 ['fam_regency_seal_duplicate','Family','Wax Seals Under Guard','Two regency clerks disagree on who locks the Great Seal chest at curfew.','regency',['Mandate dual-key witness custody',60,{stability:6,legitimacy:4},'Trust the senior chancellor alone',0,{loyalty:4}]],
 ['fam_royal_library_storytime','Family','Fables of Ancient Kings','Court nurses read heroic chronicles aloud beside the hearth as snow settles on courtyard gables.','child',['Commission illustrated moral fables',55,{education:6,piety:4,stress:-4},'Encourage early arithmetic slates',0,{education:6}]],
 ['fam_spouse_charity_granary','Family','Bread Dole at Winter Solstice','Crowds gather outside abbey gates as frost hardens the roads; your consort organizes bread carts.','married',['Open reserve royal granaries too',70,{unrest:-7,trust:8,opinion:9},'Distribute only consort’s household loaf',0,{piety:3,gold:15}]],
 ['fam_kin_duel_averted','Family','Hot Words in the Solar','Two spirited nephews nearly drew daggers over a falconry wager before dinner.','competingHeirs',['Order them to serve joint border watch',50,{morale:4,stability:4,opinion:-2},'Laugh it off as youthful fire',0,{prestige:3,unrest:2}]],
 ['fam_child_violin_craft','Family','Harmony in the Gallery','A delicate-fingered youth practices courtly viol airs with surprising patience.','wardGuardian',['Engage master palace minstrels',75,{stress:-8,prestige:5,opinion:6},'Require an hour of sword drill daily',0,{morale:3,education:3}]],
 ['fam_foreign_match_envoy_delay','Family','Winter Delays the Bride’s Train','Mountain snows stalled a foreign marriage caravan two leagues short of the border pass.','foreignMarriage',['Dispatch sledges, woolens, and escorts',105,{relation:12,opinion:10,prestige:6},'Await clearer weather patiently',0,{relation:-4}]],
 ['fam_childless_court_scholarship','Family','Legacy Beyond Flesh','Philosophers remind a worried sovereign that laws and academies outlast any single cradle.','childless',['Endow a royal college in your name',145,{legitimacy:9,research:10,prestige:10},'Redouble charities at sacred shrines',65,{piety:10}]],
 ['fam_councillor_daughter_dowry','Family','A Faithful Steward’s Daughter','Your veteran councillor modestly seeks royal consent and modest favor for his child’s wedding.','councillor',['Provide a generous crown dowry chest',95,{loyalty:12,opinion:14,stability:3},'Attend the ceremony in state robes',25,{prestige:5,opinion:7}]],
 ['fam_royal_heir_mistake','Family','An Envoy Offended at Supper','Your young heir spoke too bluntly of border tolls before a touchy foreign herald.','adultHeir',['Correct gently in private afterward',40,{education:7,relation:3,opinion:4},'Demand a formal apology in hall',0,{legitimacy:5,opinion:-7}]],
 ['fam_grand_family_feast','Family','Reunion of Kindred Branches','Distant cousins from cadet estates ride in for harvest thanksgiving at the capital.','land',['Host the whole kindred generously',115,{loyalty:7,prestige:8,stability:4},'Keep the banquet trim and formal',35,{gold:25,prestige:2}]],
 ['fam_ward_herbal_curiosity','Family','Curiosity in the Physic Garden','Your royal ward sketches medicinal roots beside the abbey infirmarer.','wardGuardian',['Fund illuminated herbal notebooks',65,{education:7,health:-8},'Guide the child toward legal charters',0,{education:6,legitimacy:2}]],
 ['fam_consort_festival_dress','Family','Brocardes for the Spring Masque','Tailors display Venetian velvet and damasks ordered ahead of the spring civic procession.','married',['Underwrite splendid royal attire',90,{prestige:9,opinion:8},'Wear seasoned family crimson wool',0,{piety:4,prestige:2}]],
 ['fam_sick_nurse_devotion','Family','The Sleepless Attendant','A loyal household attendant refuses to leave a feverish dynast’s bedside for four straight nights.','illness',['Reward their fidelity with a pension',60,{loyalty:8,opinion:10,health:-8},'Thank them warmly in public',0,{piety:4,opinion:5}]],
 ['fam_brother_ambitious_command','Family','Kinsman Petitions for Banners','A spirited brother-in-law begs for active frontier command instead of sitting idle at court.','loyal',['Entrust a frontier garrison post',90,{morale:7,loyalty:7,prestige:5},'Retain them on ceremonial palace guard',0,{securityMonths:6,opinion:-4}]],
 ['fam_heir_chronicle_study','Family','Reading Past Defeats','Your heir carefully annotates old campaign maps, asking why ancestors lost a river crossing.','adultHeir',['Walk the battlefield together at dawn',95,{education:8,experience:5,opinion:9},'Discourse on diplomacy at table',0,{education:5,relation:4}]],
 ['fam_child_sea_wonder','Family','Shells From a Merchant Cog','A sailor’s bright shell necklace delights the royal nursery and sparks tales of distant ports.','child',['Bring sea captains to tell tales',45,{education:6,stress:-5},'Return focus to courtly manners',0,{prestige:3}]],
 ['fam_regency_fiscal_review','Family','Auditing the Regency Chest','Auditors review coin tallies stamped during turbulent minority years.','regency',['Forgive minor clerical variances',50,{loyalty:8,stability:4},'Recover every missing groat strictly',0,{gold:75,loyalty:-6}]],
 ['fam_spouse_peace_counsel','Family','Gentle Counsel Before War','On the eve of mobilization, your consort begs you to weigh exhausted granaries and orphans.','war',['Grant generous war-widow charters',85,{piety:7,unrest:-6,opinion:8},'Promise swift decisive victory',0,{morale:6,prestige:4}]],
 ['fam_royal_ancestor_anniversary','Family','Remembrance of the Founder','Candles line the ancestral nave on the anniversary of your dynasty’s founding charter.','land',['Sponsor choral requiems and bread doles',95,{legitimacy:8,piety:8,trust:5},'Hold quiet family prayers',0,{piety:4,stress:-3}]],
 ['fam_ward_chess_mastery','Family','Checkmate Across the Ivory Board','A quick-witted child beats seasoned captains at Shatranj twice before supper.','wardGuardian',['Engage master strategists as tutors',85,{education:9,experience:4},'Praise sharp wit and keep balanced play',0,{opinion:6,stress:-4}]],
 ['fam_heir_tactful_bride_search','Family','Testing Suitability Before Vows','Envoys carry discreet portraits and household reports from neighboring duchies.','domesticMatch',['Prioritize sharp counsel and alliance',90,{wedding:1,relation:8,legitimacy:5},'Honor affection above dry ledgers',90,{wedding:1,stress:-8,opinion:10}]],
 ['fam_minor_cousin_feast','Family','A Cadet Cousin’s Harvest','Cadet branch kin offer salted venison and casks of cider as tokens of homage.','loyal',['Send fine steel hunting knives in return',65,{loyalty:8,opinion:9,food:25},'Accept with formal gratitude',0,{food:35,prestige:2}]]
];

function expandToCatalog(E, C) {
 const out = [];
 const followups = [];
 const extraDomains = [
  ['fam_arc_nursery','Nursery & Early Years','wardGuardian',[{education:7,opinion:6},{gold:25,stress:2}]],
  ['fam_arc_tutelage','Scholars at the Table','child',[{education:8,research:3},{prestige:3}]],
  ['fam_arc_marriage','Vows of the Crown','married',[{opinion:9,stability:3},{legitimacy:4,opinion:-3}]],
  ['fam_arc_kindred','Kindred & Precedence','competingHeirs',[{loyalty:7,opinion:6},{legitimacy:5,opinion:-4}]],
  ['fam_arc_succession','Mantle of Tomorrow','adultHeir',[{legitimacy:8,prestige:5},{stability:3}]]
 ];
 for (const [id, cat, title, desc, trig, ch] of BANK) {
  const [l1, c1, e1, l2, c2, e2] = ch;
  const folId = id + '_epilogue';
  out.push(E(id, cat, title, desc, trig, [C(l1, c1, e1, folId), C(l2, c2, e2)]));
  followups.push(E(folId, cat, `${title} — Household Echo`, `Months after "${title}", family members and attendants reflect on the precedent set at court.`, 'followup', [
   C('Affirm the household lesson', 35, { legitimacy: 4, opinion: 4 }),
   C('Let daily court routine settle quietly', 0, { stress: -3 })
  ]));
 }
 const scenarios = [
  ['Morning Prayers with Kin','Elder relatives gather in the private oratory before dawn dispatches arrive.'],
  ['Gift of Illuminated Psalms','A master calligrapher presents calfskin leaves edged in cinnabar and gold.'],
  ['Skating on the Moat','Frost turns palace ditches into glass as pages and cousins race wooden sleds.'],
  ['Quarrel in the Garden Maze','Raised voices among youths test diplomatic patience before lunch.'],
  ['Apprentice Herald’s Blazon','Young dynasts debate lion postures and quartered shields on fresh linen.'],
  ['Harvest Apple Cider Press','Royal wards join orchard workers pressing sweet October must into oak vats.'],
  ['Letters From a Cloistered Aunt','Sealed wax brings shrewd family memories and a discreet warning on greedy stewards.'],
  ['Choosing the Heir’s Esquire','Noble houses vie to place a second son at your heir’s stirrup.']
 ];
 extraDomains.forEach(([prefix, label, trig, pair], dIdx) => {
  scenarios.forEach(([stitle, sdesc], sIdx) => {
   const id = `${prefix}_${sIdx}`;
   const folId = `${id}_echo`;
   const cost = 40 + (dIdx + sIdx) * 8;
   out.push(E(id, 'Family', `${label}: ${stitle}`, sdesc, trig, [
    C(`Endow ${stitle.toLowerCase()}`, cost, pair[0], folId),
    C('Keep court custom frugal', 0, pair[1])
   ]));
   followups.push(E(folId, 'Family', `Aftermath: ${stitle}`, `The royal household records the memory of "${stitle}" in the family cartulary.`, 'followup', [
    C('Preserve in dynasty chronicles', 25, { prestige: 4, legitimacy: 3 }),
    C('Leave to memory', 0, { stress: -2 })
   ]));
  });
 });
 return [...out, ...followups];
}

export function familyEducationEvents(E, C) {
 return expandToCatalog(E, C);
}
