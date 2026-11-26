/**
 * Sovereign: 1450 — Modular Content Pack: Family, Childhood Education & Dynasty Life
 * Deep multi-choice domestic, succession, education, friendship, and marriage events.
 */
const BANK = [
 ['fam_heir_tutor_rhetoric','Family','Classical Rhetoric for the Heir','The royal preceptor proposes debating classical treatises at court to sharpen diplomatic poise.','wardGuardian',[
  ['Fund debating hall texts',70,{education:9,opinion:6}],
  ['Invite foreign envoys to judge lively student dispatches',105,{education:12,prestige:6,research:4}],
  ['Assign stern memorization drills',0,{education:4,stress:4}]
 ]],
 ['fam_child_horse_talent','Family','Young Rider in the Stables','Stablemasters report your young ward shows fearless balance atop chargers.','child',[
  ['Gift a trained destrier foal and master riding tutor',90,{education:9,prestige:5,morale:4}],
  ['Keep the youth on sturdy ponies with measured endurance drills',25,{education:6,stress:-3}],
  ['Direct energetic focus toward palace books instead',0,{education:3}]
 ]],
 ['fam_child_chronicler','Family','Inquisitive Eyes in the Library','A royal child has spent evenings copying chronicles alongside court scribes.','child',[
  ['Commission illuminated primers and astrolabe charts',75,{education:10,research:5}],
  ['Pair the child with elder judges on afternoon petitions',30,{education:8,legitimacy:4}],
  ['Direct focus toward riding and arms',0,{education:4}]
 ]],
 ['fam_heir_petty_quarrel','Family','Quarrel Between Princes','Your elder and younger heirs clashed loudly over ceremonial precedence before courtiers.','competingHeirs',[
  ['Mediate privately with matched gifts and clear duties',60,{opinion:10,loyalty:6,stress:2}],
  ['Send the younger sibling on an honorable border commission',85,{morale:5,stability:5,opinion:5}],
  ['Uphold strict seniority publicly in open court',0,{legitimacy:5,opinion:-6}]
 ]],
 ['fam_heir_first_council','Family','Adult Heir Claims a Seat','Now of age, your heir asks to witness privy deliberations and treasury audits.','adultHeir',[
  ['Grant a junior treasury portfolio and full desk',90,{legitimacy:8,education:7,prestige:4}],
  ['Let your heir observe silent council sessions first',30,{legitimacy:4,stability:4,education:4}],
  ['Keep counsel restricted to senior sworn peers',0,{legitimacy:-3,stress:3}]
 ]],
 ['fam_spouse_charitable_almshouse','Family','Consort’s Almshouse Petition','Your royal consort asks patronage for granary doles and infirmaries near the capital gate.','married',[
  ['Endow a stone almshouse in joint royal names',110,{piety:9,trust:9,unrest:-5,opinion:12}],
  ['Release reserve granary loaves for winter shelter',40,{food:-20,piety:6,trust:6,opinion:6}],
  ['Curtail extraordinary grants this lean season',0,{opinion:-6,gold:20}]
 ]],
 ['fam_spouse_diplomatic_correspondence','Family','Letters Across Borders','Your foreign-born consort maintains warm correspondence with cousins at their natal court.','foreignMarriage',[
  ['Encourage official kin embassies and silk gifts',85,{relation:12,prestige:5,credit:5}],
  ['Invite their family envoys openly to seasonal festivals',55,{relation:8,opinion:8,acceptance:4}],
  ['Audit sealed couriers quietly through chancery clerks',0,{securityMonths:7,opinion:-7}]
 ]],
 ['fam_childless_pilgrim_vow','Family','Prayers for an Heir','Without direct issue in the cradle, court prelates urge vows at an ancestral shrine.','childless',[
  ['Sponsor a grand candlelight vigil and abbey dole',110,{piety:11,legitimacy:6,stress:-6}],
  ['Summon famed physicians to attend both royal chambers',95,{trust:4,legitimacy:4,health:-10}],
  ['Register worthy collateral kin calmly before council',0,{stability:4,legitimacy:3}]
 ]],
 ['fam_courtier_matchmaking','Family','A Promising Court Match','Matchmakers propose uniting two loyal noble households within the royal capital.','domesticMatch',[
  ['Host a three-day betrothal banquet under royal seals',95,{loyalty:9,opinion:11,prestige:5}],
  ['Send modest silver goblets and royal blessing letters',35,{opinion:7,loyalty:5}],
  ['Leave families to sign private household settlements',0,{gold:20}]
 ]],
 ['fam_dynastic_envoy_match','Family','A Foreign Royal Betrothal','Ambassadors arrive with gilded miniatures to negotiate a cross-border marriage alliance.','foreignMatch',[
  ['Exchange lavish dowry pledges and celebrate treaty vows',140,{wedding:1,relation:16,prestige:9}],
  ['Host ambassadors warmly while keeping options unpledged',40,{relation:6,prestige:4}],
  ['Decline binding entanglement at this uncertain hour',0,{stability:3}]
 ]],
 ['fam_old_regent_counsel','Family','The Regency’s Weight','Elders at court whisper over who truly guides the seal during delicate regency months.','regency',[
  ['Reward loyal regency stewards and share public audiences',95,{loyalty:9,stability:7,trust:4}],
  ['Bring respected urban magistrates onto the regency council',55,{trust:7,legitimacy:5}],
  ['Assert sovereign prerogatives early without ceremony',0,{prestige:6,loyalty:-4}]
 ]],
 ['fam_sickroom_vigil','Family','Fever in the Bedchamber','An ailing relative lies pale behind heavy curtains while physicians argue remedies.','illness',[
  ['Summon renowned apothecaries and heated herbal baths',110,{health:-22,piety:5,trust:4}],
  ['Order calm isolation, clean linen, and light broth',30,{health:-12,stress:-2}],
  ['Rely on prayers and quiet bedside rest',0,{health:-7,piety:5,stress:3}]
 ]],
 ['fam_sibling_jealous_estate','Family','A Younger Sibling’s Stipend','A younger dynastic kinsman complains his coastal manor yields less than a captain’s pay.','competingHeirs',[
  ['Expand their appanage stipend and wardship honors',105,{loyalty:10,opinion:12}],
  ['Offer a lucrative diplomatic envoy commission abroad',55,{opinion:7,prestige:4,credit:3}],
  ['Remind them sharply of dynastic obedience',0,{opinion:-9,legitimacy:4}]
 ]],
 ['fam_ward_astronomy_night','Family','Stargazing on the Battlements','A ward watches winter constellations and questions how navigators measure southern seas.','wardGuardian',[
  ['Buy brass astrolabes and illustrated star atlases',80,{education:10,research:6}],
  ['Summon veteran ship-masters to spin sea tales at dusk',35,{education:7,credit:3}],
  ['Send the child back to Latin declensions on time',0,{education:3}]
 ]],
 ['fam_royal_christening_feast','Family','Naming Day Pageantry','Bells and heralds mark a royal child’s milestone year before assembled provincial lords.','child',[
  ['Throw open a three-day tournament and wine-fountain feast',125,{prestige:11,loyalty:8,stability:4}],
  ['Sponsor cathedral bells and charitable loaves for guilds',55,{piety:8,trust:7,prestige:4}],
  ['Hold a serene private chapel blessing',0,{piety:6,stress:-3}]
 ]],
 ['fam_consort_patron_music','Family','Musicians of the Bedchamber','Your consort wishes to retain lutists and singers to soothe fractious envoys at supper.','married',[
  ['Retain the permanent royal ensemble in crimson livery',85,{stress:-11,prestige:7,opinion:9}],
  ['Hire traveling minstrels for key feast nights alone',35,{stress:-5,opinion:5,credit:2}],
  ['Preserve quiet monastic austerity in hall',0,{piety:4,gold:15}]
 ]],
 ['fam_kin_funeral_monument','Family','Carving the Ancestral Tomb','Master masons submit alabaster designs to honor departed kin in the royal abbey.','newReign',[
  ['Commission the carved alabaster effigy and requiem choir',135,{legitimacy:11,piety:9,prestige:8}],
  ['Order clean engraved brass plaques and annual bread doles',50,{legitimacy:6,trust:6,piety:5}],
  ['Order a humble limestone slab cleanly carved',0,{piety:5,gold:30}]
 ]],
 ['fam_guardian_strict_vs_gentle','Family','The Preceptor’s Rod','Your child’s guardian asks whether to sharpen discipline with strict Latin rosters or gentler tales.','wardGuardian',[
  ['Encourage curiosity, debate, and patient mentorship',55,{education:8,stress:-5,opinion:8}],
  ['Balance morning drills cleanly with afternoon archery',25,{education:6,morale:4}],
  ['Demand uncompromising scholarly rigor every dawn',0,{education:9,opinion:-5}]
 ]],
 ['fam_foreign_consort_customs','Family','Outlandish Attire at Table','Courtiers murmur over the foreign recipes and silks championed by your consort’s retinue.','foreignMarriage',[
  ['Celebrate cosmopolitan court life with shared feasts',70,{acceptance:8,relation:8,opinion:9}],
  ['Blend native woolens cleanly with foreign silverwork',30,{acceptance:4,opinion:5,prestige:4}],
  ['Favor ancestral realm dress on formal state days',0,{legitimacy:5,opinion:-4}]
 ]],
 ['fam_heir_sword_blessing','Family','First Girding of the Sword','Senior marshals offer to present your heir’s first ceremonial blade before the garrison.','adultHeir',[
  ['Hold a grand knightly investiture before provincial banners',115,{morale:7,legitimacy:9,prestige:7}],
  ['Bless the sword quietly in the ancestral chapel with marshals',40,{piety:6,legitimacy:5,morale:3}],
  ['Skip ceremony and send your heir directly to levy inspection',0,{morale:4,stability:2}]
 ]],
 ['fam_grandparent_heirlooms','Family','The Dowager’s Trunk','An elderly kinswoman unlocks chests of wedding rings, falconry hoods, and faded treaties.','married',[
  ['Restore the family keepsakes and display them in hall',65,{prestige:7,opinion:8,legitimacy:4}],
  ['Catalog forgotten title deeds gently with chancery clerks',30,{legitimacy:6,securityMonths:5}],
  ['Send tarnished duplicate silver to the royal mint',0,{gold:45}]
 ]],
 ['fam_child_guild_visit','Family','Among the Market Guilds','A young prince wandered into the armorers’ quarter fascinated by bellows and temper water.','child',[
  ['Arrange respectful craft apprenticeships with guild masters',65,{education:7,development:1,trust:7}],
  ['Commission a small workshop bench inside palace yards',30,{education:5,prestige:3}],
  ['Keep young royals strictly inside inner garden walls',0,{stability:3}]
 ]],
 ['fam_estranged_cousin_return','Family','Return of the Prodigal Cousin','A long-wandering cousin returns from mercenary service seeking forgiveness and bread.','competingHeirs',[
  ['Grant an honorable frontier bailiff post and warm seat',85,{loyalty:8,opinion:10,morale:4}],
  ['Award modest pensioned quarters under discreet watch',35,{securityMonths:7,opinion:4}],
  ['Deny inner access and bid them settle far upland',0,{securityMonths:6,opinion:-7}]
 ]],
 ['fam_royal_nursery_quarrel','Family','Tears Over a Painted Toy','Nursemaids bring a squabble over an ivory war-horse before the sovereign for judgment.','child',[
  ['Commission matching carved destriers from guild woodworkers',40,{opinion:6,stress:-5,trust:2}],
  ['Settle the dispute patiently and teach fair turns',0,{education:5,stress:-2}],
  ['Confiscate the toy until lessons finish cleanly',0,{education:3,legitimacy:2}]
 ]],
 ['fam_marriage_settlement_dispute','Family','Dowry Estates Reassessed','Bailiffs report that boundary stones on a consort’s dowry manor were shifted in winter.','married',[
  ['Survey and restore the estate boundaries fairly',75,{opinion:10,trust:7,legitimacy:4}],
  ['Split disputed meadow rents peacefully with village elders',30,{trust:5,opinion:5,food:20}],
  ['Award disputed pastures outright to crown bailiffs',0,{gold:50,opinion:-8}]
 ]],
 ['fam_adolescent_poet','Family','Verses Penciled in Margins','Your young ward fills grammar margins with heroic ballads in the vernacular tongue.','wardGuardian',[
  ['Sponsor an evening of poetry and harp accompaniment',60,{education:7,prestige:6,opinion:8}],
  ['Have chroniclers bind the verses politely beside Latin notes',20,{education:5,research:3}],
  ['Refocus the youth strictly onto treasury ledgers',0,{education:7,credit:2}]
 ]],
 ['fam_dynastic_portrait_sitting','Family','The Court Limner’s Canvas','A celebrated painter asks the royal family to sit in state robes for a generational panel.','married',[
  ['Pay for genuine lapis lazuli and beaten gold leaf',125,{prestige:12,legitimacy:7,opinion:7}],
  ['Commission crisp ink-and-tempera family miniatures',45,{prestige:6,opinion:5}],
  ['Decline vanity sittings while granaries require timber',0,{food:35,trust:3}]
 ]],
 ['fam_heir_falconry_bond','Family','Hawking at Dawn','Rulers and heirs bond cleanly along misty riverbank marshes before falconers cast off hoods.','adultHeir',[
  ['Ride out quietly with your heir and two trusted hounds',60,{opinion:12,stress:-10,prestige:5}],
  ['Turn the hunt into a grand spectacle for border lords',115,{loyalty:7,prestige:8,morale:4}],
  ['Send your heir ahead while clearing morning dispatches',0,{stability:3,opinion:-2}]
 ]],
 ['fam_bastard_acknowledgment','Family','Whispered Claim of Blood','A loyal retainer quietly brings word of a bright youth bearing unmistakable family features.','courtFriend',[
  ['Provide quiet abbey schooling and honest household name',90,{prestige:-2,opinion:7,education:7}],
  ['Endow a distant farmstead silently with silver coin',55,{trust:3,piety:3}],
  ['Silence rumors firmly with loyal discretion',0,{legitimacy:5,securityMonths:6}]
 ]],
 ['fam_sibling_monastic_vocation','Family','A Younger Son’s Calling','Rather than crave border castles, a younger royal asks permission to enter a learned abbey.','competingHeirs',[
  ['Endow their scholarly cell and cloister library generously',115,{piety:15,legitimacy:6,research:4}],
  ['Support modest abbey vows while retaining family affection',45,{piety:9,opinion:6}],
  ['Keep all dynastic kin in lay administrative service',0,{prestige:5,opinion:-5}]
 ]]
];

function buildFollowups(E, C) {
 const out = [];
 const followups = [];
 for (const [id, cat, title, desc, trig, rawChoices] of BANK) {
  const folId = id + '_epilogue';
  const mapped = rawChoices.map((rc, idx) => {
   const [lbl, cost, eff] = rc;
   return C(lbl, cost, eff, idx === 0 ? folId : null);
  });
  out.push(E(id, cat, title, desc, trig, mapped));
  followups.push(E(folId, cat, `${title} — Family Precedent`, `Seasons after "${title}", your household and court remember the tone set within royal chambers.`, 'followup', [
   C('Inscribe the lesson in royal household statutes', 40, { legitimacy: 6, opinion: 6, prestige: 3 }),
   C('Celebrate warmly with kin over quiet supper', 15, { opinion: 5, stress: -6 }),
   C('Keep daily palace duties running smoothly', 0, { stability: 3 })
  ]));
 }

 // === DEEP MULTI-STAGE DYNASTIC STORY ARCS (3-4 CHOICES EACH, NO "Aftermath:" FILLER) ===
 const bespokeArcs = [
  ['fam_arc_wayward_heir', 'Family', 'A Prince Caught in Tavern Debt',
   'Night bailiffs whisper your heir pledged a royal signet ring to cover dice losses inside a gilded wine cellar.',
   'adultHeir',
   [
    C('Redeem the ring discreetly and summon them for blunt stern counsel', 100, { legitimacy: 6, opinion: -4, education: 8 }, 'fam_arc_wayward_fol'),
    C('Make them settle every florin from personal estate allowance', 25, { stability: 5, credit: 5, opinion: -7 }, 'fam_arc_wayward_fol'),
    C('Pay off debts quietly while dismissing reckless companions', 135, { opinion: 9, securityMonths: 8 }),
    C('Ignore youthful follies to preserve public cheer', 0, { stress: -3, legitimacy: -4 })
   ],
   'fam_arc_wayward_fol', 'The Prince Returns to Sober Counsel',
   'Chastened and steadier, your heir joins treasury clerks before sunrise to reconcile grain contracts.',
   [
    C('Entrust real frontier provisioning duties', 55, { education: 8, legitimacy: 6, morale: 4 }),
    C('Keep watchful mentors beside their desk', 25, { securityMonths: 7, stability: 4 }),
    C('Offer quiet paternal forgiveness', 0, { opinion: 8, stress: -5 })
   ]
  ],
  ['fam_arc_dowager_will', 'Family', 'The Dowager’s Secret Casket',
   'Upon sorting a late dowager’s cedar chest, stewards find pearls meant for younger kin — and bitter letters naming dishonest chamberlains.',
   'newReign',
   [
    C('Distribute jewels fairly and open a clean treasury inquiry', 80, { legitimacy: 9, securityMonths: 9, trust: 5 }, 'fam_arc_dowager_fol'),
    C('Honor the pearls silently and burn inflammatory letters', 30, { stability: 7, prestige: 4 }, 'fam_arc_dowager_fol'),
    C('Claim unclaimed gems for frontier fortress pay', 0, { gold: 120, unrest: -2 }),
    C('Gift the pearls publicly to cathedral almshouses', 20, { piety: 11, trust: 7 })
   ],
   'fam_arc_dowager_fol', 'Kindred Reconciled Beneath the Candlelight',
   'Family branches settle old suspicions cleanly as the abbey bells ring memorial prayers.',
   [
    C('Confirm dynastic stipends across every branch', 65, { loyalty: 9, legitimacy: 5 }),
    C('Bind family deeds cleanly in royal vaults', 20, { securityMonths: 6, stability: 4 }),
    C('Dismiss retainers back to autumn estates', 0, { gold: 30 })
   ]
  ],
  ['fam_arc_companion_exile', 'Family', 'A Childhood Friend Under Suspicion',
   'Informants accuse your dearest childhood friend’s brother of forging border passes; both loyalty and justice pull harshly at your sleeve.',
   'courtFriend',
   [
    C('Grant a fair public hearing before unbribed judges', 70, { legitimacy: 8, trust: 6, opinion: -4 }, 'fam_arc_companion_fol'),
    C('Shield your friend’s house quietly with banishment rather than axe', 90, { opinion: 14, stability: 4, legitimacy: -3 }, 'fam_arc_companion_fol'),
    C('Recuse yourself entirely and let royal marshals decide', 0, { legitimacy: 7, opinion: -10 }),
    C('Accept heavy surety gold and watch their border estate', 0, { gold: 110, securityMonths: 8, opinion: -5 })
   ],
   'fam_arc_companion_fol', 'Letters After the Verdict',
   'Your companion returns to audience wearing dark wool, thanking you gravely — or mourning a fractured bond.',
   [
    C('Renew friendship beside private hearthfire', 40, { opinion: 12, stress: -8 }),
    C('Assign distant border command to cool gossip', 25, { stability: 5, morale: 4 }),
    C('Keep counsel formal for the season', 0, { legitimacy: 4 })
   ]
  ],
  ['fam_arc_child_miracle', 'Family', 'Winter Survival of a Fragile Infant',
   'After three anxious nights beside a cradle wracked by winter croup, dawn breaks over steady breathing and cheering maids.',
   'child',
   [
    C('Endow parish foundling wards in joyful thanksgiving', 105, { piety: 12, trust: 10, unrest: -5 }, 'fam_arc_miracle_fol'),
    C('Pension the tireless nursemaids and palace apothecary', 60, { opinion: 10, prestige: 5, stress: -10 }, 'fam_arc_miracle_fol'),
    C('Hold quiet family prayers in the private chapel', 15, { piety: 6, stress: -7 }),
    C('Ring all city bells and remit winter hearth dues', 0, { legitimacy: 7, unrest: -6 })
   ],
   'fam_arc_miracle_fol', 'Spring Blossoms in the Nursery Garden',
   'Robust laughter echoes again across palace cloisters while elders toast your dynasty’s continuity.',
   [
    C('Plant memorial oaks along the avenue', 35, { prestige: 6, development: 1 }),
    C('Sponsor learned tutors early', 45, { education: 7, research: 4 }),
    C('Rest a rare quiet afternoon beside kin', 0, { stress: -6 })
   ]
  ],
  ['fam_arc_consort_embassy', 'Family', 'Your Consort Leads Peace Parleys',
   'With border tensions simmering, your fluent consort offers to ride personally to parley with estranged foreign kin.',
   'foreignMarriage',
   [
    C('Approve full diplomatic credentials and silver escorts', 120, { relation: 16, opinion: 12, prestige: 9 }, 'fam_arc_consort_fol'),
    C('Permit informal kin visits under seasoned chancery clerks', 65, { relation: 9, securityMonths: 6, opinion: 6 }, 'fam_arc_consort_fol'),
    C('Send formal written seals instead of risking the royal household', 25, { stability: 4, opinion: -4 }),
    C('Refuse foreign mediation and tighten march garrisons', 0, { morale: 5, relation: -5, opinion: -8 })
   ],
   'fam_arc_consort_fol', 'Return From the Border Abbey',
   'White-draped wagons roll home bearing salted almonds, border grazing maps, and signed truces.',
   [
    C('Ratify the border customs pact immediately', 50, { credit: 9, relation: 8, trust: 5 }),
    C('Host celebratory feasts praising your consort’s wit', 45, { opinion: 12, prestige: 7 }),
    C('Archive signed copies neatly', 0, { legitimacy: 5 })
   ]
  ]
 ];

 for (const [id, cat, title, desc, trig, ch, fid, ftitle, fdesc, fch] of bespokeArcs) {
  out.push(E(id, cat, title, desc, trig, ch));
  followups.push(E(fid, cat, ftitle, fdesc, 'followup', fch));
 }

 return [...out, ...followups];
}

export function familyEducationEvents(E, C) {
 return buildFollowups(E, C);
}
