// Emergent CK2 narrative event chains and decisions.
// Distinct from expanded-content.js to preserve canonical catalog invariants.
import {humanControlsRealm} from './player-career.js';
import {controller} from './campaign-war.js';

const cap=(n,a,b)=>Math.max(a,Math.min(b,n)),ok=msg=>({ok:true,msg}),no=msg=>({ok:false,msg});
const rand=s=>s?((s.seed=((s.seed||1337)*1664525+1013904223)%4294967296)/4294967296):0.5;
const ruler=(g,r)=>g.politics?.people?.[g.politics?.realms?.[r]?.ruler];
const controlled=(g,r,p)=>p?.owner===r&&controller(g,p.id)===r;

const E=(id,category,title,description,trigger,choices)=>({id,category,title,description,trigger,choices});
const C=(label,cost,effects,next=null)=>({label,cost,effects,...(next?{next}:{})});

// 30 rich multi-stage CK2 narrative event chains (90 stages total)
export const EMERGENT_EVENTS=[
 // 1. Court Romance
 E('emergent_court_romance','Romance','A Secret Admirer at Court','A finely scented parchment arrives bearing heartfelt verse from a captivating court figure.','romance',[
  C('Indulge the secret correspondence',60,{prestige:5,stress:-8},'emergent_court_romance_pursued'),
  C('Politely discourage the admirer',0,{stress:2},'emergent_court_romance_spurned')
 ]),
 E('emergent_court_romance_pursued','Romance','Tryst in the Palace Garden','Your clandestine meetings blossom into a passionate romance behind the tapestry walls.','followup',[
  C('Declare your devotion and bestow a keepsake',80,{prestige:10,stress:-12}),
  C('Keep the affair strictly quiet and guarded',0,{stress:-4})
 ]),
 E('emergent_court_romance_spurned','Romance','The Lingering Melancholy','The rebuffed admirer vows dignified silence, though awkward glances echo through the corridors.','followup',[
  C('Offer a token gift of amends',40,{stress:-3}),
  C('Ignore the matter entirely',0,{stress:0})
 ]),

 // 2. Pretender in the Shadows
 E('emergent_pretender_shadow','Intrigue','Whispers of a Pretender','A distant cousin with royal blood is reported rallying disaffected nobles in border taverns.','pretender',[
  C('Dispatch agents to bribe their followers',120,{legitimacy:6,stability:4},'emergent_pretender_shadow_bribed'),
  C('Laugh off the upstart in public proclamation',0,{legitimacy:-4},'emergent_pretender_shadow_defiant')
 ]),
 E('emergent_pretender_shadow_bribed','Intrigue','The Pretender Discredited','Lacking gold, the claimant’s conspirators desert, leaving the pretender isolated.','followup',[
  C('Offer the pretender an estate pension in exchange for renouncing claims',100,{legitimacy:8,stability:5}),
  C('Banish the humbled pretender beyond realm frontiers',0,{prestige:4,legitimacy:2})
 ]),
 E('emergent_pretender_shadow_defiant','Intrigue','The Pretender’s Manifesto','Emboldened by crown inaction, the claimant issues a formal challenge to royal authority.','followup',[
  C('Put a crown bounty on their arrest',140,{legitimacy:6,stability:2}),
  C('Demand vassals reaffirm their oaths',0,{prestige:-5,legitimacy:1})
 ]),

 // 3. Heretical Preacher
 E('emergent_heretical_preacher','Faith','The Itinerant Reformer','An eloquent wandering ascetic denounces ecclesiastical greed to crowds in the marketplace.','heresy',[
  C('Invite the preacher to debate royal theologians',75,{piety:8,legitimacy:3},'emergent_heretical_preacher_debate'),
  C('Order the local bailiff to disperse the gathering',0,{unrest:3,piety:-4},'emergent_heretical_preacher_dispersed')
 ]),
 E('emergent_heretical_preacher_debate','Faith','The Theological Accord','The court scholars and preacher reach a moderate consensus, mollifying the pious commoners.','followup',[
  C('Endow a charitable hospice under joint supervision',110,{piety:15,legitimacy:6}),
  C('Record the discourse in royal archives',0,{piety:5})
 ]),
 E('emergent_heretical_preacher_dispersed','Faith','Underground Conventicles','Driven from squares, the movement gathers secretly in cellars and forests.','followup',[
  C('Fund inquisitorial investigators',90,{piety:6,unrest:-2}),
  C('Tolerate harmless private devotions',0,{acceptance:2})
 ]),

 // 4. Holy Campaign Zeal
 E('emergent_crusader_zeal','Faith','The Call to Holy Campaign','Legates arrive bearing sanctified banners, urging the realm to contribute to holy warfare.','holywar',[
  C('Pledge royal treasury and champion knights',180,{piety:20,prestige:15},'emergent_crusader_zeal_champion'),
  C('Offer prayers and diplomatic blessings without coin',0,{piety:-5,stress:3},'emergent_crusader_zeal_demur')
 ]),
 E('emergent_crusader_zeal_champion','Faith','The Crusader Host Departs','Your banners lead the expedition amid ringing bells and singing choristers.','followup',[
  C('Send periodic supply convoys to sustain glory',100,{prestige:12,piety:10}),
  C('Await news of victorious battle',0,{prestige:5})
 ]),
 E('emergent_crusader_zeal_demur','Faith','Pious Grumbling','Clergy lament the crown’s parsimony, whispering of worldly attachment.','followup',[
  C('Endow a cathedral altar to quiet criticism',120,{piety:12}),
  C('Remind bishops of crown defense duties',0,{stress:4})
 ]),

 // 5. Physician Elixir
 E('emergent_physician_elixir','Health','The Physician’s Radical Cure','A master leechcraft doctor proposes a potent elixir distilled from rare roots and mercury.','physician',[
  C('Authorize the expensive treatment',100,{health:-15,stress:-10},'emergent_physician_elixir_success'),
  C('Rely on prayer, bleedings, and ordinary herbs',0,{stress:5},'emergent_physician_elixir_prudence')
 ]),
 E('emergent_physician_elixir_success','Health','Vigor Restored','After a night of fever and sweats, the sovereign wakes with clear eyes and renewed vitality.','followup',[
  C('Reward the physician with a lifetime stipend',70,{prestige:6}),
  C('Praise divine mercy for the recovery',0,{piety:6})
 ]),
 E('emergent_physician_elixir_prudence','Health','A Slow Convalescence','The malady lingers, reminding the court of mortality and the frailty of life.','followup',[
  C('Take a prolonged retreat from court duties',50,{stress:-15}),
  C('Endure through duties with grim patience',0,{stress:6})
 ]),

 // 6. Blackmail Whispers
 E('emergent_blackmail_whispers','Intrigue','A Sealed Confession','A hooded messenger delivers a bundle of intercepted letters incriminating a powerful lord.','blackmail',[
  C('Extract political leverage and secret compliance',80,{loyalty:10,stability:4},'emergent_blackmail_whispers_hooked'),
  C('Burn the letters to maintain realm trust',0,{stress:-4,piety:4},'emergent_blackmail_whispers_honor')
 ]),
 E('emergent_blackmail_whispers_hooked','Intrigue','The Compliant Vassal','Bound by fear of disgrace, the noble votes unfailingly with the crown.','followup',[
  C('Demand a substantial fiscal contribution to the treasury',0,{gold:140,loyalty:-5}),
  C('Keep the hook held quietly in reserve',0,{stability:3})
 ]),
 E('emergent_blackmail_whispers_honor','Intrigue','The Noble’s Gratitude','Informed of your discretion, the vassal bows with heartfelt gratitude.','followup',[
  C('Form a warm personal pact of friendship',50,{loyalty:15,stress:-5}),
  C('Remind them of the crown’s magnanimity',0,{prestige:4})
 ]),

 // 7. Bastard Legitimacy
 E('emergent_bastard_legitimacy','Family','The Natural Child’s Plea','A capable adult child born out of wedlock kneels, requesting entry into the dynastic rolls.','bastard',[
  C('Petition religious authorities for full legitimization',150,{legitimacy:-5,prestige:8},'emergent_bastard_legitimacy_granted'),
  C('Grant a knightly fief without dynastic succession rights',70,{prestige:3},'emergent_bastard_legitimacy_cadet')
 ]),
 E('emergent_bastard_legitimacy_granted','Family','A New Dynastic Pillar','The newly legitimized scion proves an ardent and capable champion of your house.','followup',[
  C('Appoint them to a trusted command post',60,{prestige:6,morale:8}),
  C('Arrange an honorable dynastic marriage',80,{legitimacy:4})
 ]),
 E('emergent_bastard_legitimacy_cadet','Family','A Faithful Cadet Shield','Though barred from the throne, the child loyally defends the realm’s marchlands.','followup',[
  C('Support the construction of their fortified manor',90,{loyalty:12}),
  C('Commend their faithful watch',0,{prestige:3})
 ]),

 // 8. Vassal Boundary Duel
 E('emergent_boundary_duel','Politics','Trial by Combat Requested','Two proud castellans challenge each other to a duel to the death over water rights.','vassalDuel',[
  C('Intervene with royal arbitration and surveyors',90,{stability:6,loyalty:5},'emergent_boundary_duel_arbitrated'),
  C('Permit the duel under strict chivalric rites',0,{prestige:4,stability:-4},'emergent_boundary_duel_fought')
 ]),
 E('emergent_boundary_duel_arbitrated','Politics','The Surveyed Border','Crown surveyors set stone markers, dividing pasture fairly to both lords’ grudging respect.','followup',[
  C('Host a banquet of reconciliation',80,{loyalty:10,stress:-4}),
  C('Confirm the royal boundary charter',0,{stability:3})
 ]),
 E('emergent_boundary_duel_fought','Politics','Blood in the Lists','The challenger falls with a shattered lance, leaving grieving kin eager for vengeance.','followup',[
  C('Pay wergild compensation to appease the fallen lord’s house',100,{stability:4}),
  C('Rule the death an act of God and close the affair',0,{stress:4})
 ]),

 // 9. Witchcraft Rumors
 E('emergent_witchcraft_rumor','Faith','Accusations of Sorcery','Villagers blame an elderly midwife for curdled milk and unseasonal cattle sickness.','sorcery',[
  C('Send royal magistrates to protect due process and prevent lynching',60,{justice:6,acceptance:4},'emergent_witchcraft_rumor_cleared'),
  C('Leave the matter to parish elders and local custom',0,{piety:3,justice:-4},'emergent_witchcraft_rumor_condemned')
 ]),
 E('emergent_witchcraft_rumor_cleared','Faith','Reason Prevails Over Panic','The magistrate reveals tainted rye caused the hallucinations, exonerating the midwife.','followup',[
  C('Distribute clean royal grain to the hamlet',70,{trust:8,unrest:-3}),
  C('Admonish the villagers against foolish gossip',0,{legitimacy:3})
 ]),
 E('emergent_witchcraft_rumor_condemned','Faith','The Cleansing Pyre','The unfortunate herbalist is banished into the wilderness to placate superstitious fears.','followup',[
  C('Donate funds to reconsecrate the village shrine',50,{piety:6}),
  C('Move on from the tragic incident',0,{stress:3})
 ]),

 // 10. Peasant Outlaw Band
 E('emergent_peasant_outlaw','Politics','The Green-Wood Outlaws','Archers in the royal hunting grounds rob tax carts while sharing stolen flour with starving serfs.','outlaws',[
  C('Offer royal pardon and recruitment into realm archers',80,{levy:8,unrest:-5},'emergent_peasant_outlaw_pardoned'),
  C('Deploy cavalry to hunt down the bandit leaders',110,{stability:4,unrest:2},'emergent_peasant_outlaw_crushed')
 ]),
 E('emergent_peasant_outlaw_pardoned','Politics','The King’s Yeomen','The grateful woodsmen swear fealty, forming an elite corps of sharpshooters.','followup',[
  C('Equip them with fine yew bows and leather brigandines',75,{morale:10}),
  C('Assign them to frontier scout duty',0,{prestige:3})
 ]),
 E('emergent_peasant_outlaw_crushed','Politics','The Gibbet on the Crossroads','The outlaw chief is captured and hanged, though ballads of their daring linger.','followup',[
  C('Pardon the misled followers to restore calm',40,{acceptance:4}),
  C('Double bailiff patrols along trade highways',60,{trade:5})
 ]),

 // 11. Silk Road Caravan
 E('emergent_silk_caravan','Economy','Caravan from the Distant East','Merchants from Samarkand arrive with camels laden with fine damasks, jade, and saffron.','tradeCaravan',[
  C('Grant royal charter and market stall privileges',100,{trade:15,gold:80},'emergent_silk_caravan_fair'),
  C('Impose heavy tariffs and transit tolls',0,{gold:120,trade:-5},'emergent_silk_caravan_taxed')
 ]),
 E('emergent_silk_caravan_fair','Economy','The Great Autumn Fair','Traders flock from neighboring polities, filling town inns and enriching merchant guilds.','followup',[
  C('Purchase rare foreign manuscripts for the palace library',90,{research:12,prestige:6}),
  C('Collect prosperous market excise duties',0,{gold:100})
 ]),
 E('emergent_silk_caravan_taxed','Economy','The Taxed Passage','The caravan pays begrudgingly, vowing to take a coastal route next season.','followup',[
  C('Use the proceeds to pave royal turnpikes',100,{trade:8}),
  C('Deposit the silver into the royal vault',0,{prestige:2})
 ]),

 // 12. Monastic Vision
 E('emergent_monastic_vision','Faith','The Hermit’s Prophecy','An ascetic monk living in a mountain cave descends claiming an archangel foretold royal victory.','prophecy',[
  C('Endow a stone chapel at the mountain cave',120,{piety:18,morale:6},'emergent_monastic_vision_shrine'),
  C('Receive the blessing politely with modest alms',25,{piety:4},'emergent_monastic_vision_alms')
 ]),
 E('emergent_monastic_vision_shrine','Faith','Sanctuary of Miracles','Pilgrims flock to the newly consecrated shrine, reporting miraculous cures and divine favor.','followup',[
  C('Establish an annual festival of thanksgiving',70,{piety:10,trust:6}),
  C('Grant the abbey adjacent timberlands',0,{loyalty:5})
 ]),
 E('emergent_monastic_vision_alms','Faith','The Quiet Hermitage','The hermit returns to solitude, praying quietly for your reign and family.','followup',[
  C('Send winter provisions of flour and wool',40,{piety:6}),
  C('Keep faith in the sovereign’s own strength',0,{stress:0})
 ]),

 // 13. Grand Tournament
 E('emergent_grand_tournament','Chivalry','A Grand Joust Proclaimed','Nobles request a tournament of arms to celebrate peace and test knightly valor.','tournament',[
  C('Fund grand pavilions, feast tables, and gold prizes',220,{prestige:25,morale:12,loyalty:8},'emergent_grand_tournament_climax'),
  C('Host a modest provincial gathering of local squires',80,{prestige:8},'emergent_grand_tournament_modest')
 ]),
 E('emergent_grand_tournament_climax','Chivalry','The Champion’s Garland','The tournament draws world renown, culminating in a breathless duel of lances before cheers.','followup',[
  C('Knight the valiant champion into your household guard',60,{prestige:10,morale:6}),
  C('Bestow the golden laurel and conclude with a banquet',50,{stress:-10})
 ]),
 E('emergent_grand_tournament_modest','Chivalry','The Provincial Contest','Local knights display respectable skill, cementing ties among regional gentry.','followup',[
  C('Reward the top archer and horseman',30,{prestige:4}),
  C('Congratulate the marshals on smooth organization',0,{stress:-3})
 ]),

 // 14. Sacred Relic
 E('emergent_sacred_relic','Faith','The Reliquary of Saints','A traveling friar presents an ornate reliquary containing holy relics for royal purchase.','relic',[
  C('Acquire the reliquary for the palace chapel',160,{piety:22,legitimacy:10},'emergent_sacred_relic_chapel'),
  C('Subject the artifact to scholarly examination',50,{piety:4},'emergent_sacred_relic_tested')
 ]),
 E('emergent_sacred_relic_chapel','Faith','A Sanctuary of Reverence','Vassals and foreign envoys kneel before the altar, awed by your court’s spiritual stature.','followup',[
  C('Commission master goldsmiths to adorn the shrine',110,{prestige:12,piety:8}),
  C('Proclaim an annual day of holy veneration',0,{piety:6})
 ]),
 E('emergent_sacred_relic_tested','Faith','Verified Authenticity','Scholars confirm ancient seals and inscriptions, verifying its extraordinary provenance.','followup',[
  C('Conclude the purchase with generous gratitude',130,{piety:18,legitimacy:8}),
  C('Place it in the royal treasury vault',0,{prestige:4})
 ]),

 // 15. Poisoned Goblet
 E('emergent_poisoned_goblet','Intrigue','Venom in the Wine','During a feast, a servant drops a silver flagon; spilled wine sizzles on polished stone.','poison',[
  C('Interrogate the kitchen staff and wine stewards relentlessly',80,{stress:10,stability:4},'emergent_poisoned_goblet_unmasked'),
  C('Quietly replace all food tasters and bodyguards',100,{stress:-8,securityMonths:12},'emergent_poisoned_goblet_guarded')
 ]),
 E('emergent_poisoned_goblet_unmasked','Intrigue','The Hired Poisoner Confesses','Under duress, a scullion confesses to receiving foreign gold to poison the sovereign.','followup',[
  C('Publicly expose the treacherous foreign plot',0,{prestige:10,legitimacy:6}),
  C('Execute the conspirators and double watchmen',60,{stability:5})
 ]),
 E('emergent_poisoned_goblet_guarded','Intrigue','Unbroken Vigilance','Disciplined guards stand watch day and night; no assassin can pierce the royal circle.','followup',[
  C('Fund counter-espionage agents across capital taverns',90,{securityMonths:15}),
  C('Sleep soundly knowing the court is secured',0,{stress:-12})
 ]),

 // 16. Decadent Kinsman
 E('emergent_decadent_kinsman','Dynasty','A Royal Prince’s Brawls','A royal nephew incurs massive debts in gambling dens, drawing angry complaints from burghers.','kinsmanDebt',[
  C('Settle the debts from crown funds with a stern rebuke',110,{stress:4,acceptance:6},'emergent_decadent_kinsman_reformed'),
  C('Confine the reckless youth to a distant monastery',30,{piety:6,loyalty:-5},'emergent_decadent_kinsman_exiled')
 ]),
 E('emergent_decadent_kinsman_reformed','Dynasty','A Lesson in Duty','Humbled by the public settlement, the prince renounces dice and dedicates to military drill.','followup',[
  C('Grant them command of a frontier garrison',50,{morale:6}),
  C('Praise their renewed dignity before the court',0,{prestige:4})
 ]),
 E('emergent_decadent_kinsman_exiled','Dynasty','Contemplation Behind Stone Walls','The quiet monastery bells cool hot blood; the nephew devotes hours to manuscript copying.','followup',[
  C('Recall them once piety is proven',40,{piety:4}),
  C('Leave them in peaceful seclusion',0,{stress:-4})
 ]),

 // 17. Steppe Nomad Raid
 E('emergent_steppe_nomad_raid','Warfare','Smoke on the Horizon','Nomadic horse archers sweep across northern pastures, driving off cattle herds.','steppeRaid',[
  C('Mobilize horsemen and set an ambush at the river ford',130,{morale:10,prestige:12},'emergent_steppe_nomad_raid_victory'),
  C('Negotiate seasonal tribute to secure the frontier',100,{stability:4,prestige:-6},'emergent_steppe_nomad_raid_treaty')
 ]),
 E('emergent_steppe_nomad_raid_victory','Warfare','The Raiders Scattered','Caught mid-crossing, the nomads break; captured ponies and loot are returned to grateful herders.','followup',[
  C('Incorporate captured steppe warriors into mercenary horse archers',80,{levy:10}),
  C('Distribute recovered livestock to devastated homesteads',0,{trust:10,unrest:-4})
 ]),
 E('emergent_steppe_nomad_raid_treaty','Warfare','The Border Concordat','The nomad chieftain accepts silks and grain, promising to raid your rivals instead.','followup',[
  C('Open regulated border barter markets',60,{trade:8}),
  C('Keep scouts watching the frontier lines',0,{stress:2})
 ]),

 // 18. Corsair Ransom
 E('emergent_corsair_ransom','Maritime','Corsairs Seize Royal Merchant Fleet','Barbarous galleys hijack a convoy of spices, holding noble travelers for hefty ransom.','corsairs',[
  C('Pay the ransom to ensure safe return of subjects',140,{stress:-6,loyalty:8},'emergent_corsair_ransom_ransomed'),
  C('Dispatch the war fleet to hunt down pirate strongholds',160,{prestige:14,morale:10},'emergent_corsair_ransom_hunted')
 ]),
 E('emergent_corsair_ransom_ransomed','Maritime','The Captives Return','Freed merchants weep on palace docks, praising the sovereign’s fatherly protection.','followup',[
  C('Commission armed escort vessels for trade routes',110,{trade:12}),
  C('Thank Providence for their safe deliverance',0,{piety:4})
 ]),
 E('emergent_corsair_ransom_hunted','Maritime','The Corsair Den Burned','Royal galleys storm the coastal cove, freeing prisoners and hanging pirate captains.','followup',[
  C('Claim recovered contraband for the royal mint',0,{gold:130,prestige:8}),
  C('Fortify the harbor entrance with coastal batteries',90,{defense:6})
 ]),

 // 19. Guild Strike
 E('emergent_guild_walkout','Economy','Masons Down Chissels','Master stonecutters strike over unpaid subsidies, halting cathedral and wall construction.','guildStrike',[
  C('Grant guild concessions, fair wages, and new charter rites',90,{build:8,acceptance:6},'emergent_guild_walkout_settled'),
  C('Threaten to strip guild monopolies and bring outside labor',0,{unrest:6,stability:-4},'emergent_guild_walkout_confronted')
 ]),
 E('emergent_guild_walkout_settled','Economy','Rising Buttresses','Masons return with fervor; exquisite arches and formidable towers rise ahead of schedule.','followup',[
  C('Inspect the newly finished guildhall in state',40,{prestige:6}),
  C('Commission an expanded city aqueduct',100,{development:1})
 ]),
 E('emergent_guild_walkout_confronted','Economy','Simmering City Riots','Apprentices toss cobbles at guardsmen; trade grinds to an uneasy halt in the quarter.','followup',[
  C('Broker compromise through city aldermen',70,{unrest:-5}),
  C('Deploy garrison to enforce public order',50,{stability:3})
 ]),

 // 20. Celestial Eclipse
 E('emergent_celestial_eclipse','Faith','The Sun Devoured by Darkness','Midday turns to star-lit night; crows roost in terror while citizens wail of judgment day.','eclipse',[
  C('Lead public prayers from palace balcony with priests',60,{piety:14,legitimacy:8},'emergent_celestial_eclipse_prayer'),
  C('Summon court astronomers to explain natural cycles',50,{research:10,prestige:5},'emergent_celestial_eclipse_science')
 ]),
 E('emergent_celestial_eclipse_prayer','Faith','The Light Restored','As the golden rim emerges, cries of jubilation echo; your piety is praised as saving the realm.','followup',[
  C('Distribute loaves of bread to the rejoicing crowds',50,{trust:8,unrest:-4}),
  C('Light candles at every altar in the capital',30,{piety:6})
 ]),
 E('emergent_celestial_eclipse_science','Faith','Triumph of Reason','Courtiers marvel as diagrams precisely predict the shadow’s retreat, elevating scholarly prestige.','followup',[
  C('Endow an observatory turret in the castle keep',100,{research:16}),
  C('Publish findings in learned treatises',40,{prestige:6})
 ]),

 // 21. Spymaster Duplicity
 E('emergent_spymaster_duplicity','Intrigue','A Traitor in the Privy Council','Encrypted notes intercepted from an enemy camp bear the unmistakable wax seal of your spymaster.','spymasterBetrayal',[
  C('Spring a trap with false dispatches to feed bad intelligence',80,{scheme:12,stability:5},'emergent_spymaster_duplicity_trapped'),
  C('Have the spymaster arrested and seized in their bedchamber',60,{legitimacy:6,stability:2},'emergent_spymaster_duplicity_arrested')
 ]),
 E('emergent_spymaster_duplicity_trapped','Intrigue','The Enemy Deceived','Fed false plans, the hostile army marches into a swamp, delivering total tactical advantage.','followup',[
  C('Surround and capture the disgraced spymaster',40,{prestige:8}),
  C('Turn the double agent to spy permanently for you',0,{scheme:8})
 ]),
 E('emergent_spymaster_duplicity_arrested','Intrigue','Secrets in the Desk','A thorough search of their study uncovers maps, foreign coins, and a ledger of bribes.','followup',[
  C('Appoint an honest, loyal knight to head royal watch',50,{securityMonths:12}),
  C('Confiscate the traitor’s private wealth for the treasury',0,{gold:150})
 ]),

 // 22. Treasury Audit
 E('emergent_treasury_audit','Economy','Shortfall in the Mint','The annual tally reveals sixty thousand minted groschen missing from the high vaults.','mintTheft',[
  C('Bring in outside Florentine auditors for a ruthless ledger audit',70,{credit:8,stability:4},'emergent_treasury_audit_audited'),
  C('Impose an emergency bookkeeping surcharge on clerks',0,{stability:-3},'emergent_treasury_audit_surcharge')
 ]),
 E('emergent_treasury_audit_audited','Economy','Embezzlers Brought to Account','Corrupt coin-clippers are exposed and their ill-gotten estates seized by the crown.','followup',[
  C('Reform mint regulations with strict scales and balances',80,{inflation:-3,tax:5}),
  C('Deposit reclaimed silver directly into royal reserve',0,{gold:130})
 ]),
 E('emergent_treasury_audit_surcharge','Economy','Murmurs in the Treasury','Clerks grumble and work slows down, leaving state disbursements sluggish for months.','followup',[
  C('Streamline accounts with modern bookkeeping',50,{tax:3}),
  C('Forgive the minor balances and restore calm',30,{stress:-4})
 ]),

 // 23. Wandering Mercenaries
 E('emergent_wandering_mercenary','Warfare','The Free Company of St. George','A hardened mercenary captain with veterancy across twenty sieges offers their swords.','mercenaryOffer',[
  C('Hire the company on a two-year standing retainer',150,{levy:12,morale:8},'emergent_wandering_mercenary_hired'),
  C('Decline their service and escort them across the border',0,{stress:0},'emergent_wandering_mercenary_declined')
 ]),
 E('emergent_wandering_mercenary_hired','Warfare','The Steel Vanguard','Disciplined pikemen and crossbowmen bolster realm defenses against all threats.','followup',[
  C('Deploy them to drill royal peasant levies in tactics',60,{experience:0.1,morale:6}),
  C('Keep them stationed as an intimidating border garrison',40,{stability:4})
 ]),
 E('emergent_wandering_mercenary_declined','Warfare','The Company Departs','The mercenaries salute with clattering pikes and march toward an adjoining rival realm.','followup',[
  C('Alert border commanders to remain on high alert',40,{readiness:6}),
  C('Save crown coin for domestic fortifications',0,{gold:0})
 ]),

 // 24. Excommunication Threat
 E('emergent_excommunication_threat','Faith','The Papal Legate’s Denunciation','A cardinal arrives brandishing papal bulls threatening excommunication over ecclesiastical tax.','excommunicationThreat',[
  C('Negotiate a compromise with clerical tax exemptions',120,{piety:16,legitimacy:6},'emergent_excommunication_threat_appeased'),
  C('Defy the legate, asserting sovereign royal prerogatives',0,{prestige:12,piety:-15},'emergent_excommunication_threat_defied')
 ]),
 E('emergent_excommunication_threat_appeased','Faith','The Censure Averted','Bells peal as the legate bestows apostolic absolution upon the crown and realm.','followup',[
  C('Send an envoy with lavish offerings to the Holy See',90,{piety:10}),
  C('Reaffirm royal protectorate over churches',0,{legitimacy:4})
 ]),
 E('emergent_excommunication_threat_defied','Faith','The Sovereign Stands Firm','Courtiers admire your spine; royal sovereignty remains unbowed before foreign prelates.','followup',[
  C('Rally loyal domestic bishops in national synod',80,{legitimacy:10,stability:4}),
  C('Confiscate the defiant legate’s baggage',0,{gold:80})
 ]),

 // 25. Autocephaly Synod
 E('emergent_autocephaly_petition','Faith','Synod for Metropolitan Autonomy','Bishops gather petitioning for an independent patriarchate to lead realm spiritual life.','autocephalyPetition',[
  C('Endow and proclaim the National Patriarchate',180,{prestige:18,piety:15,legitimacy:10},'emergent_autocephaly_petition_proclaimed'),
  C('Maintain unity with the ancient ecumenical mother church',50,{piety:8},'emergent_autocephaly_petition_subservient')
 ]),
 E('emergent_autocephaly_petition_proclaimed','Faith','Anointed by the Metropolitan','The new Patriarch crowns the sovereign with chants that thunder through the stone dome.','followup',[
  C('Grant extensive monastic charters to celebrate independence',100,{piety:12,trust:8}),
  C('Confirm holy canons into royal law',0,{stability:6})
 ]),
 E('emergent_autocephaly_petition_subservient','Faith','Ties of Antiquity Preserved','The mother see commends your piety, sending blessed relics and patriarchal commendations.','followup',[
  C('Host patriarchal envoys with great honor',60,{prestige:6}),
  C('Quiet regional episcopal grumbling',30,{stress:-2})
 ]),

 // 26. Caliph’s Investiture
 E('emergent_caliph_investiture','Faith','The Shadow of God on Earth','An embassy from the Caliphate brings embroidered banners and a gold-threaded mantle.','caliphInvestiture',[
  C('Receive the investiture in a grand durbar with rich gifts',170,{piety:18,legitimacy:14,prestige:12},'emergent_caliph_investiture_received'),
  C('Accept the blessing with modest court ceremony',60,{piety:8,legitimacy:5},'emergent_caliph_investiture_simple')
 ]),
 E('emergent_caliph_investiture_received','Faith','Champion of the Faithful','The khutbah is read in your name as legitimate sultan and protector of holy places.','followup',[
  C('Endow madrasas and public fountains across the capital',100,{piety:12,development:1}),
  C('Reward the Caliph’s envoys with Arabian horses',50,{diplomacy:6})
 ]),
 E('emergent_caliph_investiture_simple','Faith','The Robe Bestowed','The mantle rests upon royal shoulders, confirming rightful rule before God and peers.','followup',[
  C('Distribute alms to dervishes and scholars',50,{piety:8}),
  C('Return attention to pressing state matters',0,{stress:0})
 ]),

 // 27. Dharma Monastic Patronage
 E('emergent_dharma_patronage','Faith','The Matha Manuscript Endowment','Eminent acharyas request funding to preserve palm-leaf sutras and temple architecture.','dharmaPatronage',[
  C('Fund a royal center of learning and manuscript preservation',140,{piety:16,research:14,prestige:8},'emergent_dharma_patronage_endowed'),
  C('Offer seasonal temple grain donations',40,{piety:6},'emergent_dharma_patronage_modest')
 ]),
 E('emergent_dharma_patronage_endowed','Faith','The Radiance of Knowledge','Scholars travel across rivers to debate philosophy in your magnificent library halls.','followup',[
  C('Commission a great bronze statue of the deity',90,{prestige:10,piety:8}),
  C('Inscribe royal decrees on copper plates',40,{legitimacy:5})
 ]),
 E('emergent_dharma_patronage_modest','Faith','The Quiet Monastery','The monks chant blessings for royal longevity as morning incense curls into the trees.','followup',[
  C('Repair the temple tank and bathing steps',60,{trust:6}),
  C('Receive holy ash and prasada in gratitude',0,{stress:-4})
 ]),

 // 28. Ancestral Sacred Grove
 E('emergent_ancestral_shrine','Faith','The Whispering Oaks','Shamanic elders report that ancestor spirits demand festival rites before autumn planting.','ancestralGrove',[
  C('Lead the sacred festival and make ceremonial animal offerings',80,{stability:8,harmony:12,piety:8},'emergent_ancestral_shrine_celebrated'),
  C('Discourage old pagan customs in favor of modern court ways',0,{acceptance:-4,stability:-2},'emergent_ancestral_shrine_modern')
 ]),
 E('emergent_ancestral_shrine_celebrated','Faith','The Ancestors’ Favor','Drums echo through hills; elders declare the harvest blessed and clan loyalty solidified.','followup',[
  C('Declare the sacred grove protected under crown charter',50,{loyalty:10,trust:8}),
  C('Dance and feast with clan chieftains till dawn',40,{stress:-10})
 ]),
 E('emergent_ancestral_shrine_modern','Faith','The Disenchanted Forest','Village youths turn away from ancient drums, though elders sit in sullen disapproval.','followup',[
  C('Build a secular marketplace to divert attention',80,{trade:6}),
  C('Allow time to heal traditional grievances',0,{stress:2})
 ]),

 // 29. Fosterage Hostage
 E('emergent_fosterage_hostage','Diplomacy','The Prince as Foster Son','A neighboring monarch offers their seven-year-old heir to be raised at your royal court.','fosterageBond',[
  C('Welcome the royal ward with royal tutors and honor',100,{diplomacy:12,relations:15},'emergent_fosterage_hostage_welcomed'),
  C('Decline the foreign child, citing crowded palace halls',0,{relations:-8},'emergent_fosterage_hostage_rejected')
 ]),
 E('emergent_fosterage_hostage_welcomed','Diplomacy','The Bond of Brotherhood','The young prince grows alongside your own children, forging an unbreakable bond.','followup',[
  C('Promise an eventual dynastic betrothal',60,{diplomacy:10,stability:4}),
  C('Train them as a peerless knight and statesman',40,{prestige:6})
 ]),
 E('emergent_fosterage_hostage_rejected','Diplomacy','A Frosty Distance','The slighted ruler recalls their envoys, interpreting refusal as treacherous intent.','followup',[
  C('Send polite gifts of horses and wine to soothe pride',70,{diplomacy:4}),
  C('Reinforce frontier watch posts against aggression',50,{readiness:4})
 ]),

 // 30. Blood Feud Reconciliation
 E('emergent_royal_feud','Politics','The Vendetta of Two Houses','A drunken brawl reignites a century-old blood feud between two foremost ducal clans.','bloodFeud',[
  C('Summon both dukes to the throne room and enforce peace',110,{stability:10,legitimacy:8},'emergent_royal_feud_enforced'),
  C('Let them exhaust their strength in private skirmishes',0,{stability:-8,prestige:-5},'emergent_royal_feud_neglected')
 ]),
 E('emergent_royal_feud_enforced','Politics','Swords Sheathed in Court','Before the high court, both dukes exchange kisses of peace and sign royal reconciliation compacts.','followup',[
  C('Arrange a marriage uniting the two rival houses',90,{stability:8,loyalty:12}),
  C('Demand heavy peace bonds deposited in crown vaults',0,{gold:100})
 ]),
 E('emergent_royal_feud_neglected','Politics','Burning Manors in the Night','Riders raid crops and burn barns; smoke hangs over neighboring valleys, impoverishing the realm.','followup',[
  C('Dispatch royal marshals to forcefully separate armies',120,{stability:4}),
  C('Confiscate lands from the most egregious offenders',0,{prestige:4,loyalty:-8})
 ])
];

// 10 Distinct CK2 Flavor Decisions
export const EMERGENT_DECISIONS=[
 {id:'emergent_grand_tournament_proclaim',category:'Chivalry',title:'Proclaim a Grand Tournament',cost:180,cooldown:60,desc:'Gather the finest knights of the realm for jousts, feasts, and prestige.',effects:{prestige:20,morale:10,stress:-15}},
 {id:'emergent_commission_relic',category:'Faith',title:'Commission Holy Reliquary',cost:150,cooldown:72,desc:'Employ master goldsmiths to house sacred relics in the royal chapel.',effects:{piety:18,legitimacy:8}},
 {id:'emergent_feast_reconciliation',category:'Court',title:'Host Feast of Reconciliation',cost:120,cooldown:36,desc:'Gather disgruntled vassals for roast meats, fine wine, and renewed oaths.',effects:{loyalty:12,stability:6,stress:-10}},
 {id:'emergent_alchemist_search',category:'Learning',title:'Hire Learned Alchemist-Physician',cost:100,cooldown:48,desc:'Invite scholars of herbs, metals, and celestial stars to advise the court.',effects:{research:10,health:-10}},
 {id:'emergent_burgher_charter',category:'Economy',title:'Grant Charter to City Burghers',cost:90,cooldown:48,desc:'Confer municipal self-governance in exchange for guaranteed tax revenues.',effects:{gold:140,trade:8,unrest:-3}},
 {id:'emergent_secret_inquest',category:'Intrigue',title:'Order Secret Palace Inquest',cost:80,cooldown:36,desc:'Direct the spymaster to vet every servant, guard, and courtier for foreign hooks.',effects:{securityMonths:15,scheme:6}},
 {id:'emergent_found_scriptorium',category:'Learning',title:'Found Royal Scriptorium',cost:160,cooldown:84,desc:'Endow scribes to copy ancient manuscripts, maps, and administrative rolls.',effects:{research:15,prestige:10}},
 {id:'emergent_vow_chastity_or_penance',category:'Faith',title:'Make Solemn Vow of Penance',cost:40,cooldown:60,desc:'Fast and pray in sackcloth to purge sins and demonstrate royal humility.',effects:{piety:25,stress:5,legitimacy:5}},
 {id:'emergent_mercenary_retinue_contract',category:'Warfare',title:'Contract Veteran Mercenary Retinue',cost:160,cooldown:48,desc:'Hire seasoned foreign captains to stand guard around the royal family.',effects:{levy:10,morale:8,stability:4}},
 {id:'emergent_frontier_colonization',category:'Realm',title:'Sponsor Frontier Forest Clearing',cost:130,cooldown:60,desc:'Provide seed grain and axes to settle wild borderlands with free yeomen.',effects:{development:1,tax:6,unrest:-4}}
];

export const REACTIVE_EMERGENT_EVENTS=[
 E('em_kin_vendetta','Vendetta','Whispered Vows of Kin Vendetta','Aggrieved noble kinsfolk assemble by torchlight, swearing retribution against the crown over harsh justice.','kinVendetta',[
  C('Offer formal honors and blood-price compensation',110,{stability:6,legitimacy:4,loyalty:10}),
  C('Expand household guards and reject their demands',40,{securityMonths:12,prestige:6})
 ]),
 E('em_plague_gates','Pestilence','The Pestilence at the Gates','Quarantine lanterns flicker across stricken parishes as magistrates plead for isolation or aid.','plagueGates',[
  C('Quarantine districts and endow emergency infirmaries',120,{stability:5,health:-12,trust:6}),
  C('Seal the royal court gates and restrict court travel',40,{legitimacy:-2,health:-18})
 ]),
 E('em_war_exhaustion_petition','Warfare','Petition of the Exhausted Estates','Depleted levies and rising tax arrears drive estates to beg for respite from prolonged campaigning.','warExhaustion',[
  C('Remit emergency war taxes to pacify the countryside',100,{stability:8,legitimacy:4,loyalty:8}),
  C('Invoke martial duty and tighten campaign discipline',0,{prestige:8,stress:6,morale:6})
 ]),
 E('em_merchant_monopoly','Government','Charter Dispute in the Signoria','Syndicate patricians lobby the Doge’s council for exclusive sea-lane privileges along major ports.','merchantMonopoly',[
  C('Confirm the maritime guild monopoly charter',90,{trade:10,prestige:6}),
  C('Keep harbor tolls open to competing houses',0,{gold:120,stability:-3})
 ]),
 E('em_horde_kurultai','Government','Great Kurultai of the Steppe Banners','Steppe noyons converge with remounted herds, demanding a raiding banner or richer pastures.','hordeKurultai',[
  C('Host the kurultai feast and equip steppe cavalry',80,{prestige:12,morale:8}),
  C('Exact customary pasture tribute from rival clans',0,{gold:110,stability:-4})
 ]),
 E('em_imperial_censor','Government','Censorate Memorial on Provincial Graft','Censors present sealed ledgers accusing circuit governors of skimming imperial grain and silver.','imperialCensor',[
  C('Empower the censors to purge corrupt offices',80,{legitimacy:10,stability:4}),
  C('Accept quiet restitution directly into the treasury',0,{gold:130,legitimacy:-4})
 ])
];

export const EXTENDED_EMERGENT_EVENTS=[
 // 31. Secret Hermetic Tome
 E('em_ext_society_invite','Societies','The Ciphered Grimoire','A hooded courier leaves a Latin treatise sealed with alchemical wax on your reading desk.','societyInvite',[
  C('Break the wax seal and convene a midnight study circle',60,{prestige:6,piety:-4,research:8},'em_ext_society_invite_circle'),
  C('Summon your chaplain to lock it in the cathedral archives',20,{piety:10,stability:2},'em_ext_society_invite_burn')
 ]),
 E('em_ext_society_invite_circle','Societies','Lanterns of the Inner Sanctum','Under secret vows, scholars demonstrate celestial astrolabes and botanical distillations.','followup',[
  C('Fund a discreet laboratory beneath the tower',110,{research:14,health:-10}),
  C('Keep to open natural philosophy without secrecy',0,{prestige:8,piety:4})
 ]),
 E('em_ext_society_invite_burn','Societies','Gratitude of the Prelates','Cathedral canons applaud the sovereign’s orthodoxy and gift an illuminated psalter.','followup',[
  C('Display the psalter during high feast days',30,{piety:8,legitimacy:5}),
  C('Sell duplicate Latin manuscripts to monastic libraries',0,{gold:75})
 ]),

 // 32. Great Monument Quarry
 E('em_ext_great_work_mason','Realm','The Master Stonemason’s Plan','An itinerant master builder unrolls parchment blueprints for vaulted arches and granite bastions.','greatWork',[
  C('Commission marble quarries and skilled guildwrights',180,{prestige:16,development:1},'em_ext_great_work_mason_spire'),
  C('Direct him toward practical frontier stonework',80,{stability:4},'em_ext_great_work_mason_keep')
 ]),
 E('em_ext_great_work_mason_spire','Realm','Scaffolding to the Clouds','Chisels ring across the capital as visiting envoys marvel at the rising limestone facade.','followup',[
  C('Inscribe your dynasty’s chronicle along the lintel',90,{prestige:15,legitimacy:8}),
  C('Speed completion with extra silver for shifts',80,{stability:6,development:1})
 ]),
 E('em_ext_great_work_mason_keep','Realm','Bulwark of Dressed Stone','Sturdy gatehouses and barbicans bolster confidence along exposed marcher roads.','followup',[
  C('Garrison the gatehouses with veteran halberdiers',70,{morale:8,unrest:-3}),
  C('Station customs clerks by the new stone bridge',0,{gold:100})
 ]),

 // 33. Silk Road Oasis
 E('em_ext_silk_oasis','Trade','Brigands Along the Caravan Trail','Spiced silk caravans report armed horsemen demanding illegal transit tolls at desert wells.','silkOasis',[
  C('Dispatch cavalry outriders to crush the bandits',110,{prestige:10,trade:10},'em_ext_silk_oasis_cleared'),
  C('Negotiate a licensed escort charter with oasis elders',70,{trade:6,loyalty:5},'em_ext_silk_oasis_charter')
 ]),
 E('em_ext_silk_oasis_cleared','Trade','Banner Over the Cistern','The brigands scatter into the dunes, leaving camels and Baltic amber crates at your vanguard.','followup',[
  C('Erect a brick caravanserai beside the spring',100,{gold:150,development:1}),
  C('Return salvaged wares to merchant syndicates for goodwill',0,{prestige:12,trust:8})
 ]),
 E('em_ext_silk_oasis_charter','Trade','The Desert Compact','Oasis sheikhs swear allegiance as wardens of the trade road in exchange for silk exemptions.','followup',[
  C('Grant their sons junior posts in the palace guard',40,{morale:6,loyalty:6}),
  C('Collect standard customs weights at the city gate',0,{gold:120})
 ]),

 // 34. Eastern Imperial Embassy
 E('em_ext_china_embassy','Diplomacy','The Silk-Bound Embassy','Ambassadors bearing jade seals and porcelains request formal audience from distant eastern courts.','chinaEmbassy',[
  C('Receive them with golden banners and scholarly honors',150,{prestige:18,legitimacy:6},'em_ext_china_embassy_feast'),
  C('Conduct a brisk commercial exchange of tariffs',40,{gold:110},'em_ext_china_embassy_trade')
 ]),
 E('em_ext_china_embassy_feast','Diplomacy','Gifts of Celadon and Bronze','In return for thoroughbred chargers, the envoys present treatises on siegecraft and gunpowder.','followup',[
  C('Order arsenal masters to copy the bronze bombard drawings',110,{morale:10,research:10}),
  C('Present the porcelain vessels to royal cathedral treasuries',0,{prestige:12,piety:6})
 ]),
 E('em_ext_china_embassy_trade','Diplomacy','Bills of Caravan Exchange','Silver ingots cross borders swiftly, filling customs vaults along every river wharf.','followup',[
  C('Charter a permanent Eastern Guildhall in the capital',90,{trade:12}),
  C('Invest surplus bullion into coinage reserves',0,{gold:130})
 ]),

 // 35. Witchcraft Panics
 E('em_ext_witch_trial','Intrigue','Whispers of Night-Covens','Villagers drag an herbalist widow before county judges, blaming blight and stillborn calves on sorcery.','witchHunt',[
  C('Dispatch learned royal inquisitors to examine evidence carefully',90,{stability:6,piety:5},'em_ext_witch_trial_law'),
  C('Permit local magistrates to stage exemplary public burnings',20,{piety:8,unrest:6},'em_ext_witch_trial_pyre')
 ]),
 E('em_ext_witch_trial_law','Intrigue','Reason Over Superstition','Your judges uncover poisoned grain wells planted by a greedy bailiff rather than diabolism.','followup',[
  C('Hang the corrupt bailiff and pension the widow',40,{legitimacy:10,trust:10}),
  C('Distribute treatises on veterinary crop blight',70,{research:8,food:25})
 ]),
 E('em_ext_witch_trial_pyre','Intrigue','Ashes in the Market Square','A fearful hush settles over the shire, though murmurs linger among bereaved kinsmen.','followup',[
  C('Send traveling preachers to calm the terrified villages',50,{piety:6,unrest:-4}),
  C('Levy penance fines on unruly parish elders',0,{gold:85})
 ]),

 // 36. Papal Legate & Simony
 E('em_ext_papal_legate','Faith','The Legate’s Ledger','A sharp-eyed religious legate audits diocesan accounts, accusing wealthy abbeys of simony.','legateAudit',[
  C('Back the legate’s reform of clerical offices',80,{piety:16,legitimacy:6},'em_ext_papal_legate_reform'),
  C('Shield loyal aristocratic prelates behind crown privilege',100,{loyalty:10,piety:-8},'em_ext_papal_legate_shield')
 ]),
 E('em_ext_papal_legate_reform','Faith','The Clean Abbeys','Disgraced simoniacs surrender ill-gotten plate, strengthening moral authority and royal piety.','followup',[
  C('Devote confiscated silver to parish almshouses',60,{piety:12,unrest:-5}),
  C('Apply ecclesiastical fines to crown defense budgets',0,{gold:140})
 ]),
 E('em_ext_papal_legate_shield','Faith','Baronial Gratitude','Powerful clerical families pledge loyal knights and unwavering counsel at royal diets.','followup',[
  C('Name a prelate’s nephew to the Privy Seal',0,{loyalty:8,prestige:6}),
  C('Collect discreet loyalty gifts from cathedral chapters',0,{gold:110})
 ]),

 // 37. Regency Ambition
 E('em_ext_regent_ambition','Politics','The Seal Behind the Throne','Whispers warn that an ambitious court steward is issuing land patents under the royal signet.','regentPlot',[
  C('Seize the signet ring in an unannounced night council',70,{legitimacy:10,securityMonths:10},'em_ext_regent_ambition_seized'),
  C('Demand quiet accounting of every crown patent',0,{stability:4},'em_ext_regent_ambition_audit')
 ]),
 E('em_ext_regent_ambition_seized','Politics','Treason Unmasked','Shocked councilors kneel as forged charters are flung across the oak table.','followup',[
  C('Strip the steward’s estates and scatter conspirators',0,{gold:150,loyalty:-4,legitimacy:8}),
  C('Impose heavy ransoms for treasonous pardons',0,{gold:210,prestige:5})
 ]),
 E('em_ext_regent_ambition_audit','Politics','The Balanced Rolls','Auditors rectify the rent rolls, plugging silent leaks without triggering noble panic.','followup',[
  C('Standardize double-entry royal parchment seals',80,{tax:8,stability:6}),
  C('Accept the steward’s humble resignation',0,{prestige:6})
 ]),

 // 38. Trial by Combat
 E('em_ext_trial_combat','Chivalry','Gauntlet Flung in the Hall','Two frontier barons throw mailed gauntlets before the dais, each swearing the other forged border deeds.','trialCombat',[
  C('Sanction a solemn judicial duel under royal marshals',100,{prestige:16,morale:6},'em_ext_trial_combat_duel'),
  C('Compel both houses to accept royal boundary arbitration',60,{stability:8,loyalty:4},'em_ext_trial_combat_arbitrate')
 ]),
 E('em_ext_trial_combat_duel','Chivalry','Steel Decides Before God','At dawn the challenger’s pollaxe shatters his foe’s shield; the hall erupts as truth is proclaimed.','followup',[
  C('Award the victor knightly spurs and border command',50,{morale:8,prestige:8}),
  C('Heal the fallen baron’s wounds to prevent blood vendetta',60,{loyalty:8,piety:5})
 ]),
 E('em_ext_trial_combat_arbitrate','Chivalry','Surveyors at the Milestone','Crowned surveyors drive iron boundary stakes along disputed hills without bloodshed.','followup',[
  C('Levy equal court fees from both border baronies',0,{gold:95}),
  C('Confirm ancient charters for future generations',0,{legitimacy:8})
 ]),

 // 39. Underground Cult
 E('em_ext_secret_cult','Faith','Ciphers in the Sacristy','Watchmen uncover carved cellar altars and coded hymnals hidden beneath respected guild houses.','secretCult',[
  C('Infiltrate the secret society with spymaster agents',110,{securityMonths:14,stress:4},'em_ext_secret_cult_exposed'),
  C('Issue quiet royal pardon for voluntary recantation',50,{stability:8,piety:4},'em_ext_secret_cult_reconcile')
 ]),
 E('em_ext_secret_cult_exposed','Faith','The Masked Deacons Confess','Before dawn, agents arrest ringleaders holding foreign cipher keys and hidden bullion.','followup',[
  C('Confiscate the cellar hoard for cathedral works',0,{gold:170,piety:10}),
  C('Turn double agents to watch neighboring courts',80,{securityMonths:18})
 ]),
 E('em_ext_secret_cult_reconcile','Faith','Return to the Open Fold','Scores of penitent burghers burn their cipher books in public repentance, thanking royal mercy.','followup',[
  C('Host a civic sermon of unity and concord',40,{unrest:-6,trust:8}),
  C('Appoint faithful wardens over guild assemblies',0,{stability:5})
 ]),

 // 40. The White Stag
 E('em_ext_white_stag','Court','Tracks of the White Stag','Royal foresters gallop into camp: an albino stag of legendary size grazes in mist-wreathed oaks.','whiteStag',[
  C('Ride hard with horn and hound to claim the trophy',90,{prestige:14,stress:-12},'em_ext_white_stag_trophy'),
  C('Watch silently in reverence and forbid the chase',0,{piety:14,stress:-8},'em_ext_white_stag_omen')
 ]),
 E('em_ext_white_stag_trophy','Court','Horns Mounted in the Great Hall','At dusk the royal spear strikes true; poets weave ballads comparing your prowess to ancient kings.','followup',[
  C('Feast the hunting retinue with spiced venison',70,{loyalty:8,morale:6}),
  C('Send gilded antler horns to allied rulers',40,{prestige:12})
 ]),
 E('em_ext_white_stag_omen','Court','The Sacred Clearing','Bards sing that heaven spared the white hart to bless a just and merciful dynasty.','followup',[
  C('Declare the oak glade a protected royal sanctuary',60,{piety:12,legitimacy:6}),
  C('Open forest pannage to needy villagers in winter',0,{trust:10,unrest:-4})
 ]),

 // 41. Legendary Bloodline Chronicler
 E('em_ext_bloodline_chronicle','Dynasty','Genealogist of Forgotten Kings','A wandering chronicler claims ancient parchment fragments link your dynasty to heroic founders.','bloodlineEpic',[
  C('Commission an illustrated royal codex across the realm',170,{prestige:22,legitimacy:12},'em_ext_bloodline_chronicle_codex'),
  C('Reward him modestly and verify only sober charters',50,{legitimacy:5},'em_ext_bloodline_chronicle_sober')
 ]),
 E('em_ext_bloodline_chronicle_codex','Dynasty','Recited in Every Shire','Heralds proclaim the gilded genealogy at tournaments; vassals speak your lineage with newfound awe.','followup',[
  C('Place gilded copies in cathedral and university libraries',80,{prestige:12,research:8}),
  C('Strike commemorative silver groats',0,{trade:8,legitimacy:5})
 ]),
 E('em_ext_bloodline_chronicle_sober','Dynasty','Verified Deeds Above Fables','Courts praise the ruler’s grounded dignity and honest respect for attested legal precedent.','followup',[
  C('Archive the charters cleanly in the chancery',40,{stability:6}),
  C('Honor living heroes of recent campaigns',0,{morale:6})
 ]),

 // 42. Great Comet
 E('em_ext_great_comet','Realm','Blazing Star Over the Citadel','A crimson-tailed comet slices night skies; astrologers and preachers fiercely debate its omen.','greatComet',[
  C('Proclaim it heaven’s torch lighting royal destiny',100,{morale:12,legitimacy:8},'em_ext_great_comet_destiny'),
  C('Order royal astronomers to chart its celestial arc',80,{research:12,stress:-6},'em_ext_great_comet_science')
 ]),
 E('em_ext_great_comet_destiny','Realm','Zeal Beneath Starlit Banners','Soldiers polish lances and sing hymns under the fiery tail, convinced victory is ordained.','followup',[
  C('Muster frontier garrisons for a grand review',70,{morale:10,prestige:8}),
  C('Lead barefoot prayers of thanksgiving at dawn',0,{piety:14})
 ]),
 E('em_ext_great_comet_science','Realm','Tables of Celestial Motion','Exact copper-ring measurements refute panic and earn acclaim from scholars abroad.','followup',[
  C('Endow an observatory dome atop the citadel',110,{research:14,prestige:10}),
  C('Calm markets with royal pamphlets explaining the stars',0,{stability:8,unrest:-4})
 ]),

 // 43. Marshal’s Ransom
 E('em_ext_marshal_ransom','Warfare','Letters from a Captive Veteran','A scarred frontier commander long presumed slain sends ring-sealed word from a mountain keep.','marshalRansom',[
  C('Pay the full silver ransom to bring him home',150,{morale:12,prestige:10},'em_ext_marshal_ransom_paid'),
  C('Send covert rescuers to scale the keep by night',90,{prestige:8,securityMonths:8},'em_ext_marshal_ransom_raid')
 ]),
 E('em_ext_marshal_ransom_paid','Warfare','Return of the Old Lion','Troops roar with joy as the scarred veteran rides through the gate ready to drill recruits.','followup',[
  C('Appoint him Inspector of Royal Arsenals',60,{morale:10,experience:8}),
  C('Hold a feast in honor of unbroken loyalty',40,{loyalty:8})
 ]),
 E('em_ext_marshal_ransom_raid','Warfare','Dagger and Rope by Moonlight','Climbers lower the commander safely over mossy battlements, humiliating arrogant border wardens.','followup',[
  C('Reward the night scouts with gilded daggers',40,{prestige:10,securityMonths:10}),
  C('Strike back along the unguarded pass',0,{morale:8})
 ]),

 // 44. University Disputation
 E('em_ext_university_debate','Learning','Disputation of Crown and Canon','University doctors clash over whether civil statutes override ancient diocesan immunities.','uniDebate',[
  C('Sponsor open royal disputation and publish conclusions',100,{research:12,legitimacy:6},'em_ext_uni_debate_published'),
  C('Uphold traditional jurisdiction to soothe prelates',20,{piety:10,loyalty:4},'em_ext_uni_debate_tradition')
 ]),
 E('em_ext_uni_debate_published','Learning','Jurists of the New Realm','Young legists flock to crown service, drafting clearer writs and fairer municipal charters.','followup',[
  C('Appoint top doctors as circuit assize judges',80,{stability:8,tax:6}),
  C('Grant printing privileges to the university press',40,{research:10})
 ]),
 E('em_ext_uni_debate_tradition','Learning','Bells of Concord','Bishops ring cathedral bells praising pious restraint, cementing pulpit support across shires.','followup',[
  C('Accept monastic petitions for charity exemptions',0,{piety:10,trust:6}),
  C('Invite learned abbots onto the royal council',0,{loyalty:8})
 ]),

 // 45. Narrow Sea Smugglers
 E('em_ext_sea_smugglers','Economy','Lanterns on the Foggy Cove','Revenue cutters corner notorious smugglers unloading velvet bolts and French brandy beneath chalk cliffs.','seaSmugglers',[
  C('Seize ships and auction contraband publicly',70,{gold:160,stability:4},'em_ext_sea_smugglers_seized'),
  C('Recruit the captains as licensed privateers',90,{trade:8,morale:6},'em_ext_sea_smugglers_letter')
 ]),
 E('em_ext_sea_smugglers_seized','Economy','The Cliffside Hoard','Auctioned silks enrich harbor coffers and warn coastal villages against dodging royal customs.','followup',[
  C('Build timber lighthouses at dangerous shoals',100,{trade:10,development:1}),
  C('Raise customs bailiff patrols along creeks',0,{gold:90})
 ]),
 E('em_ext_sea_smugglers_letter','Economy','Hawks of the Crown','Reformed smugglers turn razor-sharp seamanship against hostile shipping lanes.','followup',[
  C('Demand a quarter share of every prize captured',0,{gold:150}),
  C('Assign them to patrol pirate anchorages',60,{trade:12,prestige:6})
 ]),

 // 46. Royal Falconry Hunt
 E('em_ext_royal_falcon','Court','The Gyrfalcon of the North','Northern envoys present a snow-white gyrfalcon trained to stoop higher than any hawk in Europe.','royalFalcon',[
  C('Train daily on windswept moors with master falconers',80,{stress:-14,prestige:10},'em_ext_royal_falcon_bond'),
  C('Gift the prized bird to seal a noble vassal’s devotion',0,{loyalty:14,prestige:6},'em_ext_royal_falcon_gift')
 ]),
 E('em_ext_royal_falcon_bond','Court','Wings Over the Heath','Watching the gyrfalcon soar clears courtly melancholy and steels your judgment in council.','followup',[
  C('Invite foreign ambassadors to a grand hawking meet',80,{prestige:12,stress:-8}),
  C('Compose verses on kingship and nature',0,{piety:6,stress:-6})
 ]),
 E('em_ext_royal_falcon_gift','Court','Fealty Sworn on the Gauntlet','Deeply moved by the priceless gift, the noble lord pledges banners and loyal heirs to the crown.','followup',[
  C('Confirm his hereditary wardenship of the forests',0,{loyalty:10,stability:4}),
  C('Enjoy lavish hospitality at his mountain castle',0,{stress:-10})
 ]),

 // 47. Contested Inheritance Will
 E('em_ext_contested_will','Dynasty','Parchment Under Three Seals','On his deathbed, a childless count leaves rival wills favoring his nephew, the church, and the crown.','contestedWill',[
  C('Uphold escheat rights and fold the county into crown lands',90,{gold:160,loyalty:-6},'em_ext_contested_will_crown'),
  C('Honor the pious bequest while negotiating wardship dues',40,{piety:12,loyalty:8},'em_ext_contested_will_piety')
 ]),
 E('em_ext_contested_will_crown','Dynasty','Royal Bailiffs Enter the Keep','Crown stewards take inventory of granaries and silver plate, bolstering central domain revenues.','followup',[
  C('Charter the town market under crown protection',70,{tax:8,trust:6}),
  C('Compensate the disappointed nephew with a court post',60,{loyalty:6})
 ]),
 E('em_ext_contested_will_piety','Dynasty','Prayers and Wardship Gold','Priests chant perpetual masses for your house while noble houses applaud royal respect for custom.','followup',[
  C('Host the young heir at court as a royal ward',40,{loyalty:10}),
  C('Collect traditional relief dues at Michaelmas',0,{gold:110})
 ]),

 // 48. Peasant Mystic
 E('em_ext_peasant_mystic','Faith','The Shepherdess of Signs','Thousands gather at a hillside well where a young shepherdess preaches repentance and peace.','peasantMystic',[
  C('Send courteous theologians to question and bless her',70,{piety:12,unrest:-6},'em_ext_peasant_mystic_blessed'),
  C('Disperse unauthorized crowds gently before harvests rot',50,{stability:6,food:20},'em_ext_peasant_mystic_disperse')
 ]),
 E('em_ext_peasant_mystic_blessed','Faith','Hymns at Harvesttide','Vindicated by clerics, the movement turns peaceful fervor toward rebuilding parish churches.','followup',[
  C('Donate royal timber for the new chapel roof',80,{piety:12,trust:10}),
  C('Enlist devout pilgrims into highway repair crews',0,{development:1})
 ]),
 E('em_ext_peasant_mystic_disperse','Faith','Orderly Fields and Full Barns','Workers return to scythes and plows cleanly; full granaries guard the realm against winter famine.','followup',[
  C('Buy surplus grain for army depots',80,{food:40,morale:6}),
  C('Grant a modest harvest ale feast',30,{unrest:-5})
 ]),

 // 49. Condottiere Ultimatum
 E('em_ext_condottiere_demand','Warfare','Captains at the Counting Table','Grizzled mercenary captains rattle scabbards, demanding double winter quarters before renewing banners.','condottiereDemand',[
  C('Meet their silver terms and bind them with iron oaths',160,{morale:10,prestige:4},'em_ext_condottiere_demand_paid'),
  C('Surround their camp with household knights and arrest ringleaders',90,{prestige:12,morale:-4},'em_ext_condottiere_demand_crush')
 ]),
 E('em_ext_condottiere_demand_paid','Warfare','Steel Bought and Bound','Satisfied veterans sharpen pikes and drill raw levies through icy fogs with deadly precision.','followup',[
  C('Deploy them immediately to shield exposed borders',40,{morale:8,stability:4}),
  C('Have royal scribes register every captain’s hostages',0,{securityMonths:10})
 ]),
 E('em_ext_condottiere_demand_crush','Warfare','Discipline Restored by Dawn','Seeing armored royal banners ring the ridge, mutineers throw down pikes and accept regular pay.','followup',[
  C('Confiscate the mutinous war-chest',0,{gold:140,stability:6}),
  C('Fold contrite veterans into crown regiments',50,{morale:6})
 ]),

 // 50. Crown Regalia
 E('em_ext_crown_regalia','Court','The Goldsmith’s Masterpiece','Famed jewelers present rough rubies and enamelled filigree fit to reforge the coronation crown.','crownRegalia',[
  C('Commission a gleaming new royal diadem and scepter',200,{legitimacy:14,prestige:20},'em_ext_crown_regalia_forged'),
  C('Purchase gemstones discreetly for sovereign credit',90,{gold:120},'em_ext_crown_regalia_vault')
 ]),
 E('em_ext_crown_regalia_forged','Court','Majesty Enthroned','Beneath vaulted candlelight, ambassadors bow low before the jewel-encrusted regalia of your dynasty.','followup',[
  C('Receive foreign oaths in solemn majesty',0,{legitimacy:10,prestige:10}),
  C('Have chroniclers paint the coronation regalia',60,{stress:-8,prestige:8})
 ]),
 E('em_ext_crown_regalia_vault','Court','Silent Reserves of the Crown','Merchant bankers lower interest rates at the mere rumor of rubies locked within royal coffers.','followup',[
  C('Expand guild credit lines across market towns',50,{trade:10}),
  C('Keep emergency war reserves sealed',0,{stability:6})
 ])
];

export const EXTENDED_REACTIVE_EVENTS=[
 E('em_ext_react_society','Societies','Gathering of the Secret Chapter','Fellow society initiates invite you to share discoveries and advance your standing in secret arts.','reactSociety',[
  C('Donate rare manuscripts and sponsor initiates',90,{research:10,prestige:10}),
  C('Share prudent counsel without emptying crown coffers',0,{prestige:6,stress:-4})
 ]),
 E('em_ext_react_great_work','Realm','Festival at the Great Monument','Pilgrims, masons, and foreign poets gather beneath your monument’s arches, boosting civic pride.','reactGreatWork',[
  C('Host public banquets beneath the colonnades',100,{legitimacy:10,prestige:12,unrest:-4}),
  C('Collect visitor tolls for monument maintenance',0,{gold:120,prestige:4})
 ]),
 E('em_ext_react_heresy','Faith','Travelling Heretics Debate in the Square','Heterodox preachers draw restless crowds outside parish doors, challenging clerical authority.','reactHeresy',[
  C('Send royal scholars for public theological debate',80,{piety:10,trust:6}),
  C('Authorize parish bailiffs to silence illicit assemblies',40,{stability:6,unrest:3})
 ]),
 E('em_ext_react_antipope','Faith','Schism Bulls Nailed to Cathedral Doors','Rival papal envoys post conflicting encyclicals in market squares, troubling pious lords.','reactAntipope',[
  C('Declare steadfast loyalty to canonical order',60,{piety:14,legitimacy:6}),
  C('Exploit clerical confusion to assert royal prerogative',0,{gold:110,piety:-6})
 ]),
 E('em_ext_react_crusade','Faith','Banner of the Sacred Campaign','Pilgrims sew crosses and vows onto cloaks along high roads as sacred armies muster abroad.','reactCrusade',[
  C('Contribute silver provisions to the holy war chest',130,{piety:18,prestige:12}),
  C('Dispatch veteran sergeants to keep order along pilgrim roads',50,{morale:8,stability:4})
 ]),
 E('em_ext_react_silk_road','Trade','Caravanserai Overflowing with Spices','Camel trains along overland trade corridors bring lacquered chests, indigo, and brisk tariffs.','reactSilkRoad',[
  C('Invest in fortified waystations and well houses',110,{trade:12,development:1}),
  C('Auction royal spice monopolies at court',0,{gold:160})
 ]),
 E('em_ext_react_stressed_ruler','Personal','Sleepless Nights in the Candlelit Study','Endless petitions and parchment ledgers leave hands trembling as councilors watch anxiously.','reactStress',[
  C('Retire to countryside gardens for ten days of rest',70,{stress:-22,health:-6}),
  C('Call trusted physicians and endure through sheer duty',40,{stress:-10,legitimacy:4})
 ]),
 E('em_ext_react_council_divide','Politics','Sharp Quarrel at the Privy Table','Senior councilors trade bitter accusations over taxation and frontier troop deployments.','reactCouncil',[
  C('Mediate patiently and restore collegial unity',80,{loyalty:10,stability:6,stress:4}),
  C('Rebuke both factions and rule by sovereign decree',0,{legitimacy:8,loyalty:-4})
 ]),
 E('em_ext_react_minor_title','Court','Pride Among Court Officeholders','Holders of ceremonial court offices vie elegantly in masques, heraldry, and civic patronage.','reactMinorTitle',[
  C('Sponsor a courtly masque celebrating loyal servants',90,{prestige:12,loyalty:8,stress:-8}),
  C('Charge gentle fees for sealing noble heraldic patents',0,{gold:95,prestige:4})
 ]),
 E('em_ext_react_truces_broker','Diplomacy','Envoys Test the Fragile Truce','Border wardens report cavalry patrols probing mountain passes despite sealed peace treaties.','reactTruce',[
  C('Exchange hostages and reaffirm truce oaths publicly',70,{stability:8,prestige:6}),
  C('Quietly reinforce frontier castles just in case',80,{morale:8,securityMonths:8})
 ])
];

export const EXTENDED_EMERGENT_DECISIONS=[
 {id:'em_ext_dec_coronation_progress',category:'Dynasty',title:'Royal Progress Through Provinces',cost:160,cooldown:60,desc:'Tour provincial towns with banners and judges to affirm legitimacy and reduce unrest.',effects:{legitimacy:12,prestige:14,unrest:-6}},
 {id:'em_ext_dec_war_games',category:'Warfare',title:'Stage Grand Field Maneuvers',cost:140,cooldown:48,desc:'Drill infantry, archers, and heavy cavalry together on royal heathlands.',effects:{morale:14,prestige:10}},
 {id:'em_ext_dec_silk_bazaar',category:'Economy',title:'Charter Grand Silk & Spice Fair',cost:150,cooldown:60,desc:'Guarantee safe-conduct passes for foreign caravans and maritime factors.',effects:{gold:190,trade:12,development:1}},
 {id:'em_ext_dec_dynastic_chronicle',category:'Dynasty',title:'Commission Dynastic History',cost:120,cooldown:72,desc:'Employ court poets and archivists to glorify your bloodline for posterity.',effects:{prestige:22,legitimacy:6}},
 {id:'em_ext_dec_hospital_infirmary',category:'Realm',title:'Endow Plague & Fever Ward',cost:130,cooldown:60,desc:'Establish isolated stone infirmaries and herbal apothecaries to check outbreaks.',effects:{health:-14,stability:6,trust:8}},
 {id:'em_ext_dec_counterspy_ring',category:'Intrigue',title:'Expand Counter-Espionage Network',cost:110,cooldown:48,desc:'Plant loyal informants across ports, taverns, and foreign embassies.',effects:{securityMonths:24,stability:4}}
];

const findEmergentDef=id=>EMERGENT_EVENTS.find(e=>e.id===id)||REACTIVE_EMERGENT_EVENTS.find(e=>e.id===id)||EXTENDED_EMERGENT_EVENTS.find(e=>e.id===id)||EXTENDED_REACTIVE_EVENTS.find(e=>e.id===id)||null;

export function extendedEmergentDecisions(g,world,r=g.player){
 const s=initEmergent(g);
 const rs=s.realms[r];
 if(!rs)return [];
 return EXTENDED_EMERGENT_DECISIONS.map(d=>{
  const last=rs.decisions[d.id]??-1000;
  const remaining=Math.max(0,last+d.cooldown-g.turn);
  const affordable=(g.factions?.[r]?.treasury??0)>=d.cost;
  const ready=remaining===0&&affordable;
  const reason=remaining>0?`Cooldown: ${remaining} months`:(affordable?'':'Insufficient gold');
  return {...d,remaining,ready,reason};
 });
}

export function reactiveEmergentCandidates(g,r){
 const f=g.factions?.[r];
 if(!f)return [];
 const rs=g.emergent?.realms?.[r];
 const recent=rs?.recentReactive||{};
 const eligible=ev=>(g.turn-(recent[ev.id]??-120))>=24;
 const out=[];
 const people=Object.values(g.politics?.people||{});
 const hasVendetta=people.some(p=>p?.alive&&p.realm===r&&(p.grievances||[]).some(gr=>gr.severity>=45));
 if(hasVendetta)out.push(REACTIVE_EMERGENT_EVENTS[0]);
 const hasEpidemic=Object.values(g.economy?.crises||{}).some(c=>c?.kind==='epidemic'&&g.provinces?.[c.province]?.owner===r)||Object.keys(g.heritage?.epidemics||{}).some(pid=>g.provinces?.[pid]?.owner===r);
 if(hasEpidemic)out.push(REACTIVE_EMERGENT_EVENTS[1]);
 const longWar=Object.values(g.conflict?.wars||{}).some(w=>w.status==='active'&&[w.attacker,w.defender].includes(r)&&(g.turn-(w.started||0))>=18);
 if(longWar)out.push(REACTIVE_EMERGENT_EVENTS[2]);
 const gov=g.civic?.realms?.[r]?.government;
 if(['republic','city'].includes(gov))out.push(REACTIVE_EMERGENT_EVENTS[3]);
 else if(gov==='steppe')out.push(REACTIVE_EMERGENT_EVENTS[4]);
 else if(['imperial','centralized'].includes(gov))out.push(REACTIVE_EMERGENT_EVENTS[5]);

 // Deep CK2 reactive triggers
 const rId=g.politics?.realms?.[r]?.ruler;
 const head=rId?g.politics?.people?.[rId]:null;
 if(rId&&g.deepSystems?.societies?.memberships?.[rId])out.push(EXTENDED_REACTIVE_EVENTS[0]);
 if(Object.values(g.deepSystems?.greatWorks||{}).some(w=>g.provinces?.[w.provinceId]?.owner===r))out.push(EXTENDED_REACTIVE_EVENTS[1]);
 if(Object.values(g.identity?.heresies||g.deepSystems?.heresies||{}).some(h=>g.provinces?.[h.province]?.owner===r))out.push(EXTENDED_REACTIVE_EVENTS[2]);
 const faithLower=String(g.civic?.realms?.[r]?.faith||f.religion||'').toLowerCase();
 if((faithLower.includes('catholic')||faithLower.includes('latin'))&&Object.values(g.deepSystems?.antipopes||{}).some(a=>a?.active))out.push(EXTENDED_REACTIVE_EVENTS[3]);
 if(g.deepSystems?.crusade?.status==='active')out.push(EXTENDED_REACTIVE_EVENTS[4]);
 if(Object.values(g.deepSystems?.tradePosts||{}).some(tp=>tp.owner===r)||['Asia','Africa'].includes(f.continent)&&(g.economy?.realms?.[r]?.tradeNet||0)>=5)out.push(EXTENDED_REACTIVE_EVENTS[5]);
 if((head?.civic?.stress||0)>=55)out.push(EXTENDED_REACTIVE_EVENTS[6]);
 const council=Object.values(g.politics?.realms?.[r]?.council||{});
 if(council.some(cid=>people.some(p=>p.id===cid&&(p.grievances?.length||0)>0)))out.push(EXTENDED_REACTIVE_EVENTS[7]);
 if(Object.keys(g.deepSystems?.minorTitles?.[r]||{}).length>0)out.push(EXTENDED_REACTIVE_EVENTS[8]);
 if(Object.keys(g.conflict?.truces||{}).some(k=>k.split('|').includes(r)&&g.conflict.truces[k]>g.turn))out.push(EXTENDED_REACTIVE_EVENTS[9]);

 return out.filter(eligible);
}

export function allEmergentEventCount(){return EMERGENT_EVENTS.length;}
export function allEmergentDecisionCount(){return EMERGENT_DECISIONS.length;}

export function initEmergent(g){
 if(g.emergent?.version===1)return g.emergent;
 const s=g.emergent={version:1,seed:42069,realms:{},history:[],lastTick:-1};
 for(const r of Object.keys(g.politics?.realms||{})){
  s.realms[r]={active:null,decisions:{},lastEvent:-100,lastDecision:-100,history:[]};
 }
 return s;
}

export function currentEmergentEvent(g,r=g.player){
 const s=initEmergent(g);
 const active=s.realms[r]?.active;
 if(!active||g.turn>=active.expires)return null;
 const def=findEmergentDef(active.id);
 if(!def)return null;
 return {...def,...active};
}

export function emergentDecisions(g,world,r=g.player){
 const s=initEmergent(g);
 const rs=s.realms[r];
 if(!rs)return [];
 return EMERGENT_DECISIONS.map(d=>{
  const last=rs.decisions[d.id]??-1000;
  const remaining=Math.max(0,last+d.cooldown-g.turn);
  const affordable=(g.factions?.[r]?.treasury??0)>=d.cost;
  const ready=remaining===0&&affordable;
  const reason=remaining>0?`Cooldown: ${remaining} months`:(affordable?'':'Insufficient gold');
  return {...d,remaining,ready,reason};
 });
}

function applyEmergentEffects(g,r,effects){
 if(!effects)return;
 const f=g.factions?.[r];
 const head=ruler(g,r);
 for(const [k,v] of Object.entries(effects)){
  if(k==='gold'&&f)f.treasury+=v;
  else if(k==='food'&&f)f.food=Math.max(0,(f.food||0)+v);
  else if(k==='prestige'&&f)f.prestige=Math.max(0,(f.prestige||0)+v);
  else if(k==='piety'&&f)f.piety=Math.max(0,(f.piety||0)+v);
  else if(k==='legitimacy'&&f)f.legitimacy=cap((f.legitimacy||0)+v,0,100);
  else if(k==='stability'&&f)f.stability=cap((f.stability||0)+v,0,100);
  else if(k==='stress'&&head?.civic)head.civic.stress=cap((head.civic.stress||0)+v,0,100);
  else if(k==='health'&&head&&g.living?.health?.[head.id]){
   g.living.health[head.id].severity=cap((g.living.health[head.id].severity||0)+v,0,100);
  }
  else if(k==='securityMonths'&&g.intrigue?.security){
   g.intrigue.security[r]={level:2,until:g.turn+v};
  }
  else if(k==='research'&&g.identity?.realms?.[r]?.research){
   g.identity.realms[r].research.progress+=v;
  }
  else if(k==='trade'&&g.economy?.realms?.[r]){
   g.economy.realms[r].tradeNet=(g.economy.realms[r].tradeNet||0)+v;
  }
  else if(k==='tax'&&f){
   f.treasury+=Math.max(10,Math.round(v*8));
  }
  else if(k==='unrest'){
   for(const p of Object.values(g.provinces||{}))if(p.owner===r)p.unrest=cap((p.unrest||0)+v,0,100);
  }
  else if(k==='trust'){
   for(const p of Object.values(g.provinces||{}))if(p.owner===r&&g.civic?.provinces?.[p.id])g.civic.provinces[p.id].localTrust=cap((g.civic.provinces[p.id].localTrust||50)+v,0,100);
  }
  else if(k==='development'){
   for(const p of Object.values(g.provinces||{}))if(p.owner===r){p.development=cap((p.development||1)+v,1,20);break;}
  }
  else if(k==='experience'){
   for(const a of Object.values(g.armies||{}))if(a.owner===r)a.experience=cap((a.experience||0)+v*0.01,0,1);
  }
  else if(k==='loyalty'){
   const rId=g.politics?.realms?.[r]?.ruler;
   for(const [pid,h] of Object.entries(g.politics?.holdings||{})){
    if(h.realm===r&&h.lord!==rId&&g.provinces?.[pid]?.owner===r)h.loyalty=cap((h.loyalty||50)+v,0,100);
   }
  }
  else if(k==='morale'){
   for(const a of Object.values(g.armies||{}))if(a.owner===r)a.morale=cap((a.morale||75)+v,0,100);
  }
 }
}

export function emergentAction(g,world,action,id,extra){
 const s=initEmergent(g);
 const r=g.player;
 const rs=s.realms[r]??(s.realms[r]={active:null,decisions:{},lastEvent:-100,lastDecision:-100,history:[]});
 const f=g.factions?.[r];

 if(action==='resolve'){
  const active=currentEmergentEvent(g,r);
  if(!active)return no('No active emergent event.');
  const rawIdx=String(id).includes(':')?String(id).split(':').pop():id;
  const idx=Number(rawIdx);
  const choice=Number.isInteger(idx)?active.choices?.[idx]:null;
  if(!choice)return no('Invalid choice index.');
  if(f&&(f.treasury||0)<choice.cost)return no('Requires '+choice.cost+' gold.');
  if(f&&choice.cost)f.treasury-=choice.cost;
  applyEmergentEffects(g,r,choice.effects);
  let follow=null;
  if(choice.next){
   const nextDef=findEmergentDef(choice.next);
   if(nextDef){
    follow={id:nextDef.id,started:g.turn,availableAt:g.turn+3,expires:g.turn+12};
   }
  }
  rs.active=follow;
  rs.lastEvent=g.turn;
  const msg=`${active.title}: ${choice.label}`;
  s.history.unshift({turn:g.turn,realm:r,text:msg});
  if(r===g.player&&g.log){g.log.unshift({date:`${g.year} · month ${g.month+1}`,text:msg});}
  return ok(follow?'Choice made. Situation develops.':'Event resolved.');
 }

 if(action==='decision'){
  const dec=EMERGENT_DECISIONS.find(d=>d.id===id)||EXTENDED_EMERGENT_DECISIONS.find(d=>d.id===id);
  if(!dec)return no('Unknown decision.');
  const last=rs.decisions[id]??-1000;
  if(g.turn-last<dec.cooldown)return no('Decision is on cooldown.');
  if(f&&(f.treasury||0)<dec.cost)return no('Insufficient treasury gold.');
  if(f&&dec.cost)f.treasury-=dec.cost;
  applyEmergentEffects(g,r,dec.effects);
  rs.decisions[id]=g.turn;
  rs.lastDecision=g.turn;
  const msg=`Decision enacted: ${dec.title}`;
  s.history.unshift({turn:g.turn,realm:r,text:msg});
  if(r===g.player&&g.log){g.log.unshift({date:`${g.year} · month ${g.month+1}`,text:msg});}
  return ok('Decision enacted.');
 }

 return no('Unknown emergent action.');
}

export function tickEmergent(g,world){
 const s=initEmergent(g);
 if(s.lastTick===g.turn)return;
 s.lastTick=g.turn;
 if(g.turn%3!==0)return;

 for(const [r,rs] of Object.entries(s.realms)){
  const f=g.factions?.[r];
  if(!f)continue;
  if(rs.active){
   if(g.turn>=rs.active.expires){
    rs.active=null;
    rs.lastEvent=g.turn;
   }else if(!humanControlsRealm(g,r)&&g.turn>=(rs.active.availableAt??rs.active.started)){
    const ev=findEmergentDef(rs.active.id);
    if(ev){
     const affordable=ev.choices.map((c,i)=>({i,c})).filter(x=>(f.treasury||0)>=x.c.cost);
     const pick=affordable.length?affordable[0]:{i:1,c:ev.choices[1]};
     if(pick.c.cost&&f.treasury>=pick.c.cost)f.treasury-=pick.c.cost;
     applyEmergentEffects(g,r,pick.c.effects);
     let follow=null;
     if(pick.c.next){
      const nextDef=findEmergentDef(pick.c.next);
      if(nextDef)follow={id:nextDef.id,started:g.turn,availableAt:g.turn+3,expires:g.turn+12};
     }
     rs.active=follow;
     rs.lastEvent=g.turn;
    }
   }
  }else if(g.turn-rs.lastEvent>=12){
   const reactive=reactiveEmergentCandidates(g,r);
   let root=null;
   if(reactive.length){
    root=reactive[Math.floor(rand(s)*reactive.length)];
    rs.recentReactive??={};
    rs.recentReactive[root.id]=g.turn;
   }else{
    const roots=[...EMERGENT_EVENTS,...EXTENDED_EMERGENT_EVENTS].filter(e=>e.trigger!=='followup');
    root=roots[Math.floor(rand(s)*roots.length)];
   }
   if(root){
    rs.active={id:root.id,started:g.turn,availableAt:g.turn,expires:g.turn+9};
    rs.lastEvent=g.turn;
    if(r===g.player&&g.log){
     g.log.unshift({date:`${g.year} · month ${g.month+1}`,text:`New storyline: ${root.title}`});
    }
   }
  }
 }
}
