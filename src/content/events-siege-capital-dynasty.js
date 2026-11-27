/**
 * Sovereign: 1450 — Modular Content Pack: Siege, Capital Development, Dynasty & Early-Modern Crossroads
 * 16 interconnected multi-stage CK2-style narrative chains (69 authored stages) spanning
 * 1450-1600: Capital Development, Sieges & Commanders, Dynasty Succession, Trade Guilds,
 * Regional Turning Points (Vijayanagara, Ottomans, Ming), and Early-Modern Crossroads.
 *
 * Every trigger and effect key matches src/expanded-content.js directly (zero silent no-ops).
 */
export function siegeCapitalDynastyEvents(E, C) {
 const out = [];
 const add = (id, cat, title, desc, trig, choices) => out.push(E(id, cat, title, desc, trig, choices));

 // === 1. THE VICTORIOUS GENERAL'S AMBITION (4-stage branching arc, trigger: 'army') ===
 add('scd_victorious_general', 'Military', "The Victorious General's Ambition",
  'Fresh from breaking an enemy vanguard, your field commander parades captured standards before camp bonfires and quietly sounds out captains for hereditary marshalcy.',
  'army', [
   C('Grant a formal triumph and invest him with frontier command', 140, { morale: 10, prestige: 10, experience: 0.06 }, 'scd_general_triumph'),
   C('Audit his muster rolls and rotate lieutenants into capital garrisons', 65, { securityMonths: 10, legitimacy: 6, morale: -3 }, 'scd_general_grudge'),
   C('Reward the rank-and-file with double rations while summoning him to council', 0, { food: -25, morale: 6, stability: 4 }, 'scd_general_triumph')
  ]);

 add('scd_general_triumph', 'Military', 'Banners Along the Triumphal Way',
  'Cheered by battle-hardened companies, the general petitions for an autonomous military charter and an honored place beside the royal heir.',
  'followup', [
   C('Bind him by solemn marshal oath and a generous crown pension', 120, { legitimacy: 8, morale: 7, stability: 5 }, 'scd_general_oath'),
   C('Curtail his personal retinue before his guard overshadows the palace', 55, { securityMonths: 9, legitimacy: 7, prestige: 4 }, 'scd_general_reckoning'),
   C('Toast his victories and dispatch his regiments to distant watch-forts', 0, { prestige: 6, fatigue: 6, stability: 4 })
  ]);

 add('scd_general_grudge', 'Military', 'Locked Gates at the Camp Perimeter',
  'Stung by the treasury audit, the commander delays disbanding veteran companies and circulates pointed grievances among border captains.',
  'followup', [
   C('Meet the captains personally and settle overdue campaign pay honorably', 130, { morale: 9, stability: 7, credit: 4 }, 'scd_general_oath'),
   C('Dispatch royal heralds demanding immediate submission under banner law', 40, { legitimacy: 8, securityMonths: 8 }, 'scd_general_reckoning'),
   C('Quietly promote loyal junior serjeants to isolate the commander', 0, { securityMonths: 7, experience: 0.04, morale: -2 })
  ]);

 add('scd_general_oath', 'Succession', "The Marshal's Steel & Royal Seal",
  'Kneeling beneath tattered regimental flags, the commander swears fealty to the dynasty — yet veteran officers press for lasting institutional reform.',
  'followup', [
   C('Charter a permanent War College led by loyal field veterans', 125, { experience: 0.08, research: 9, prestige: 8 }, 'scd_general_legacy'),
   C('Seal the oath publicly and order the army into winter quarters', 0, { stability: 6, fatigue: -12, legitimacy: 5 })
  ]);

 add('scd_general_reckoning', 'Military', 'Stand-Off Beneath the Capital Bastion',
  'Loyalist halberdiers and the general’s hardened pikemen face each other across frost-rimmed ditches along the main approach road.',
  'followup', [
   C('Offer honorable retirement and amnesty to every enlisted soldier', 95, { stability: 8, morale: 5, legitimacy: 6 }, 'scd_general_legacy'),
   C('Break the stand-off decisively with a stern proclamation of crown law', 0, { legitimacy: 9, prestige: 6, morale: -4 })
  ]);

 add('scd_general_legacy', 'Military', 'A Disciplined Officer Corps',
  'Whether bound by solemn oath or tempered by firm crown justice, the realm’s field command adopts written muster books and clear succession of rank.',
  'followup', [
   C('Standardize officer commissions and quartermaster audits', 85, { supply: 18, experience: 0.06, legitimacy: 6 }),
   C('Endow frontier garrison infirmaries and veteran stipends', 60, { morale: 9, fatigue: -10, prestige: 5 }),
   C('Archive the new field ordinances in the royal chancery', 0, { stability: 5, research: 4 })
  ]);

 // === 2. THE BESIEGED BORDER CITADEL (4-stage branching arc, trigger: 'war') ===
 add('scd_border_citadel', 'Military', 'The Besieged Border Citadel',
  'Enemy sappers drive timbered galleries toward the outer hornwork of a strategic frontier citadel while trapped defenders signal by shuttered lantern from the keep.',
  'war', [
   C('Fund night couriers and coordinate a sally with reserve powder kegs', 135, { prestige: 8, morale: 8, stability: 4 }, 'scd_citadel_sally'),
   C('Conserve coin for a field relief column and order the castellan to hold', 70, { legitimacy: 6, supply: 12, stability: 3 }, 'scd_citadel_breach'),
   C('Promise double campaign honors to volunteers riding to the citadel ridge', 0, { morale: 6, prestige: 5, fatigue: 5 }, 'scd_citadel_breach')
  ]);

 add('scd_citadel_sally', 'Military', "Fire-Pots Along the Sappers' Trench",
  'Defenders burst through the postern gate before moonrise, torching wicker gabions and spiking two siege culverins in the smoke.',
  'followup', [
   C('Launch a mounted vanguard across the ford to lift the siege', 120, { morale: 10, prestige: 10, experience: 0.06 }, 'scd_citadel_relief'),
   C('Offer prisoner exchanges and a local parley while besiegers reel', 0, { relation: 8, stability: 5, prestige: 4 }, 'scd_citadel_parley')
  ]);

 add('scd_citadel_breach', 'Military', 'Rubble in the Outer Curtain',
  'Sustained bombard fire brings down thirty yards of ashlar masonry; the garrison packs flour barrels and oak beams across the smoking breach.',
  'followup', [
   C('Force-march a relief train packed with sappers and fresh powder', 145, { supply: 16, morale: 9, fatigue: 6 }, 'scd_citadel_relief'),
   C('Instruct the castellan to gain days through formal parley flags', 0, { securityMonths: 7, stability: 4, relation: 4 }, 'scd_citadel_parley')
  ]);

 add('scd_citadel_relief', 'Military', 'Banners on the Ridge at Dawn',
  'Horns echo across misty scrubland as royal relief squadrons strike the siege camp flanks, forcing enemy artillery teams to abandon their trenches.',
  'followup', [
   C('Rebuild the shattered wall into a low earthen artillery bastion', 115, { legitimacy: 8, research: 7, prestige: 7 }, 'scd_citadel_bastion'),
   C('Grant battle citations to the castellan and resume the march', 0, { morale: 8, prestige: 6 })
  ]);

 add('scd_citadel_parley', 'Diplomacy', 'White Pennants Across the Ditch',
  'Envoys meet between cratered earthworks to settle wounded exchanges and frontier truce terms before winter rains flood the trenches.',
  'followup', [
   C('Secure a bounded truce to reinforce outer frontier forts', 85, { relation: 12, stability: 7, securityMonths: 6 }, 'scd_citadel_bastion'),
   C('Reject steep ransom demands and rally the realm for spring', 0, { legitimacy: 7, prestige: 6, morale: 5 })
  ]);

 add('scd_citadel_bastion', 'Military', 'Lessons of the Frontier Siege',
  'Crown engineers compile siege journals into permanent fortification doctrine covering counter-mining, powder storage, and bastion angles.',
  'followup', [
   C('Publish the frontier siege manual for all royal castellans', 75, { research: 10, experience: 0.05, securityMonths: 8 }),
   C('Establish standing powder magazines and dry biscuit depots', 60, { supply: 20, credit: 4, stability: 4 }),
   C('Record the defense honors in the realm chronicle', 0, { prestige: 7, legitimacy: 4 })
  ]);

 // === 3. THE BUILDER KING'S AQUEDUCT & CHARTER (4-stage branching arc, trigger: 'land') ===
 add('scd_aqueduct_charter', 'Economy & Trade', "The Builder King's Aqueduct & Charter",
  'Master stonecutters, millers, and capital burgesses petition the crown to raise a limestone aqueduct paired with a municipal guild charter.',
  'land', [
   C('Underwrite stone arches, settling basins, and public conduits', 150, { development: 1, trust: 10, prestige: 7 }, 'scd_aqueduct_masonry'),
   C('Grant the charter if merchant guilds bear half the masonry cost', 80, { credit: 9, trust: 7, development: 1 }, 'scd_aqueduct_toll'),
   C('Charter water-rights tolls first before laying a single stone', 0, { gold: 65, credit: 4, unrest: 3 }, 'scd_aqueduct_toll')
  ]);

 add('scd_aqueduct_masonry', 'Economy & Trade', 'Lime Kilns & Survey Stakes Across the Valley',
  'Quarrymen strike a cold upland spring that could double aqueduct flow, yet estate holders along the ridge demand right-of-way compensation.',
  'followup', [
   C('Compensate landowners fairly and tap the deep upland spring', 110, { trust: 10, food: 45, development: 1 }, 'scd_aqueduct_fountain'),
   C('Invoke royal road-and-water prerogatives cleanly for public benefit', 0, { legitimacy: 6, unrest: -4, loyalty: -4 }, 'scd_aqueduct_fountain')
  ]);

 add('scd_aqueduct_toll', 'Economy & Trade', 'Dispute Over the Conduit Tolls',
  'Tanners and dyers quarrel sharply with millers and bakers over sluice hours, guild assessments, and clean water priorities.',
  'followup', [
   C('Establish an impartial Guild Water Board under the crown charter', 95, { trust: 9, credit: 8, unrest: -6 }, 'scd_aqueduct_fountain'),
   C('Levy fixed municipal water dues and close the petitions', 0, { gold: 75, stability: 4, trust: -3 })
  ]);

 add('scd_aqueduct_fountain', 'Economy & Trade', 'Clear Water in the Capital Square',
  'Brass spouts pour clear spring water into carved stone basins, driving fulling mills, lowering summer fevers, and brightening market stalls.',
  'followup', [
   C('Extend masonry culverts into artisan lanes and smithy workshops', 110, { tools: 20, development: 1, credit: 7 }, 'scd_aqueduct_guildhall'),
   C('Inscribe the royal building charter cleanly above the fountain arch', 0, { prestige: 8, legitimacy: 6, trust: 5 })
  ]);

 add('scd_aqueduct_guildhall', 'Economy & Trade', "The Capital's New Guild Quarter",
  'Abundant water and predictable municipal law draw master weavers, paper-makers, and armorers from across the region into the capital.',
  'followup', [
   C('Charter permanent apprentice halls and honest market weights', 85, { credit: 10, trust: 8, unrest: -6 }),
   C('Stock municipal grain mills along the lower aqueduct sluices', 70, { food: 80, grain: 16, stability: 5 }),
   C('Collect modest guildhall charter fees cleanly', 0, { gold: 95, legitimacy: 4 })
  ]);

 // === 4. VIJAYANAGARA MAHANAVAMI CAVALRY & ELEPHANT LEVY (3-stage arc, trigger: 'region_vijayanagara') ===
 add('scd_vijayanagara_mahanavami', 'Regional', 'Mahanavami Cavalry & Elephant Levy',
  'As monsoon clouds clear above the Tungabhadra, provincial nayakas assemble before the carved Mahanavami Dibba with caparisoned war-elephants and Ormuz horse merchants.',
  'region_vijayanagara', [
   C('Purchase Arab and Persian chargers and inspect nayaka elephant lines', 150, { prestige: 11, loyalty: 9, tools: 12 }, 'scd_mahanavami_cavalry'),
   C('Enforce strict muster tallies and collect Mahanavami silver dues', 60, { legitimacy: 8, gold: 80, loyalty: -3 }, 'scd_mahanavami_tribute'),
   C('Honor temple processions while deferring costly horse contracts', 0, { piety: 8, trust: 6, stability: 3 }, 'scd_mahanavami_tribute')
  ]);

 add('scd_mahanavami_cavalry', 'Regional', 'The Ormuz Horse Bargain at the Pavilion',
  'Coastal brokers offer three hundred conditioned chargers for pepper bills and stamped pagodas, promising swifter cavalry wings across the Raichur frontier.',
  'followup', [
   C('Seal the remount contract and equip royal stables with forged stirrups', 120, { tools: 18, prestige: 8, credit: 7 }, 'scd_mahanavami_parade'),
   C('Select prime breeding stock for crown paddocks alone', 0, { development: 1, stability: 5, legitimacy: 4 }, 'scd_mahanavami_parade')
  ]);

 add('scd_mahanavami_tribute', 'Regional', 'Nayaka Petitions Beneath the Stone Platform',
  'Southern chieftains argue that dry reservoirs left villages hard-pressed to feed cavalry remounts alongside full Mahanavami tribute.',
  'followup', [
   C('Pair tribute leniency with granite irrigation tank repairs', 110, { food: 75, loyalty: 11, trust: 9 }, 'scd_mahanavami_parade'),
   C('Uphold traditional Mahanavami obligations without exception', 0, { gold: 95, legitimacy: 6, loyalty: -5 })
  ]);

 add('scd_mahanavami_parade', 'Regional', 'Nine Nights of Lamps & Armored Tusks',
  'Torchlight parades of war-elephants, archers, and armored cavalry thunder past temple pavilions, proclaiming royal vitality across southern India.',
  'followup', [
   C('Endow permanent royal stables and elephant-keeper villages', 90, { food: 65, loyalty: 10, development: 1 }),
   C('Patronize Telugu and Sanskrit court poets celebrating the levy', 55, { prestige: 10, legitimacy: 6, piety: 5 }),
   C('Close the festival muster rolls cleanly', 0, { stability: 6, trust: 4 })
  ]);

 // === 5. OTTOMAN FOUNDRY & BOMBARD REFORM (3-stage arc, trigger: 'region_ottomans') ===
 add('scd_ottoman_foundry', 'Regional', 'The Imperial Foundry & Great Bombard',
  'Master bronze-founders at the imperial cannon works propose casting heavy double-chambered siege bombards alongside standardized Janissary matchlocks.',
  'region_ottomans', [
   C('Fund copper-tin ingots, water-bellows, and master artillery founders', 155, { tools: 24, research: 9, prestige: 9 }, 'scd_ottoman_bronze_cast'),
   C('Consult provincial timariot cavalry before redirecting treasury silver', 70, { loyalty: 9, stability: 5, legitimacy: 4 }, 'scd_ottoman_sipahi_dispute'),
   C('Maintain steady foundry output while inspecting saltpeter depots', 0, { securityMonths: 8, credit: 4, tools: 8 }, 'scd_ottoman_sipahi_dispute')
  ]);

 add('scd_ottoman_bronze_cast', 'Regional', 'Glow of the Tophane Furnaces',
  'Molten bronze pours cleanly into reinforced clay molds as gunners test dry granulated powder charges designed to survive damp river campaigns.',
  'followup', [
   C('Establish salaried artillery barracks and dedicated ox-haulage trains', 120, { development: 1, tools: 20, legitimacy: 7 }, 'scd_ottoman_imperial_train'),
   C('Reserve the heaviest siege tubes strictly for imperial border campaigns', 0, { securityMonths: 9, prestige: 7, research: 5 }, 'scd_ottoman_imperial_train')
  ]);

 add('scd_ottoman_sipahi_dispute', 'Regional', 'Rumblings Among the Timar Banners',
  'Provincial cavalry commanders worry that salaried gunpowder corps and central foundries will erode ancient timar land privileges.',
  'followup', [
   C('Guarantee timar registers while pairing horse banners with light field guns', 105, { loyalty: 12, stability: 7, trust: 6 }, 'scd_ottoman_imperial_train'),
   C('Reaffirm the Sultan’s supreme prerogative over both horse and foundry', 0, { legitimacy: 8, prestige: 6, loyalty: -4 })
  ]);

 add('scd_ottoman_imperial_train', 'Regional', 'Thunder Before the Bastions',
  'Disciplined bombard trains, standardized copper bores, and state saltpeter works elevate imperial siegecraft from the Danube to Anatolia.',
  'followup', [
   C('Charter a permanent guild of military engineers and sappers', 95, { research: 11, development: 1, prestige: 8 }),
   C('Stock border magazines with surplus tools and corned powder', 60, { tools: 22, securityMonths: 8, stability: 4 }),
   C('Audit foundry accounts and reward master smiths', 0, { credit: 7, legitimacy: 5 })
  ]);

 // === 6. MING GRAND EXAMINATION & MARITIME TRIBUTE (3-stage arc, trigger: 'region_ming') ===
 add('scd_ming_grand_exam', 'Regional', 'Grand Examination & Maritime Tribute',
  'As triennial metropolitan examination lists post before the Meridian Gate, coastal prefects report tribute junks awaiting imperial seals at Ningbo and Quanzhou.',
  'region_ming', [
   C('Endow Hanlin hall stipends and licensed coastal tribute warehouses', 145, { research: 10, legitimacy: 8, credit: 8 }, 'scd_ming_tribute_fleet'),
   C('Dispatch Censorate auditors to inspect coastal silver before issuing tallies', 65, { securityMonths: 10, trust: 7, stability: 4 }, 'scd_ming_censor_audit'),
   C('Keep tribute embassies strictly ceremonial under traditional tally rules', 0, { legitimacy: 6, piety: 5, stability: 4 }, 'scd_ming_censor_audit')
  ]);

 add('scd_ming_tribute_fleet', 'Regional', 'Tallies of Vermilion & Sea-Charts',
  'Newly ranked jinshi graduates draft coherent port customs statutes balancing lawful silk tribute exchanges with coastal anti-piracy patrols.',
  'followup', [
   C('Promulgate the revised Maritime & Examination Statutes cleanly', 110, { credit: 10, development: 1, legitimacy: 7 }, 'scd_ming_sealed_canon'),
   C('Confine deep-water anchorages to official tribute fleets alone', 0, { securityMonths: 9, stability: 6, trust: 4 }, 'scd_ming_sealed_canon')
  ]);

 add('scd_ming_censor_audit', 'Regional', 'Smuggled Porcelain & Bribed Examiners',
  'Censors intercept unregistered merchant junks wearing borrowed tribute banners while uncovering a bribed provincial examination clerk.',
  'followup', [
   C('Purge corrupt clerks and elevate austere merit-tested jinshi scholars', 100, { legitimacy: 11, trust: 10, research: 8 }, 'scd_ming_sealed_canon'),
   C('Confiscate contraband silver and reinforce coastal beacon towers', 0, { gold: 120, securityMonths: 8, unrest: -3 })
  ]);

 add('scd_ming_sealed_canon', 'Regional', 'Hall of Preserved Learning & Ordered Seas',
  'Impartial scholar-officials and disciplined harbor tallies bind capital examination halls firmly to coastal commerce and frontier peace.',
  'followup', [
   C('Print model examination essays and harbor tables for prefectural schools', 85, { research: 10, trust: 8, acceptance: 5 }),
   C('Repair Grand Canal lock-gates supplying coastal tribute depots', 75, { food: 85, development: 1 }),
   C('Seal the Censorate registers in the imperial archive', 0, { legitimacy: 7, stability: 5 })
  ]);

 // === 7. RENAISSANCE PRINTING & SUCCESSION (3-stage arc, trigger: 'crossroads_press') ===
 add('scd_renaissance_printing', 'Succession', 'Movable Type & the Succession Manifesto',
  'Rival pamphleteers operate newly imported screw-presses at night, flooding market squares with competing royal genealogies and tax tracts.',
  'crossroads_press', [
   C('Sponsor an authoritative Crown Press printing verified dynasty chronicles', 140, { legitimacy: 10, research: 10, prestige: 7 }, 'scd_printing_genealogy'),
   C('Seize unlicensed woodcuts and summon master printers before magistrates', 60, { securityMonths: 9, stability: 5, unrest: -3 }, 'scd_printing_pamphlet_trial'),
   C('Levy steep paper stamps while letting censored almanacs circulate', 0, { gold: 80, credit: 4, unrest: 3 }, 'scd_printing_pamphlet_trial')
  ]);

 add('scd_printing_genealogy', 'Succession', 'Crisp Folio Leaves of the Ruling House',
  'Humanist editors prepare clear Latin and vernacular succession histories adorned with royal coats of arms and statutory oaths.',
  'followup', [
   C('Distribute bound legal and dynastic folios to every county court', 105, { legitimacy: 11, trust: 8, research: 7 }, 'scd_printing_crown_edition'),
   C('Sell popular guild editions to help fund municipal grammar schools', 0, { gold: 70, research: 6, credit: 5 }, 'scd_printing_crown_edition')
  ]);

 add('scd_printing_pamphlet_trial', 'Succession', 'Ink-Stained Printers Before the Bench',
  'Master printers warn that harsh confiscations will drive skilled punch-cutters and paper-makers across the border into rival cities.',
  'followup', [
   C('Convert seized presses into licensed municipal chanceries under crown seal', 95, { legitimacy: 8, credit: 7, stability: 6 }, 'scd_printing_crown_edition'),
   C('Banish stubborn agitators and tighten bookshop customs', 0, { securityMonths: 10, stability: 5, research: -2 })
  ]);

 add('scd_printing_crown_edition', 'Succession', 'The Printed Mandate of the Crown',
  'Uniform printed statutes, tax rolls, and dynastic records anchor royal legitimacy in an era transformed by movable lead and cheap paper.',
  'followup', [
   C('Establish a permanent Royal Library & Imprint Registry', 90, { research: 12, prestige: 8, development: 1 }),
   C('Issue standardized bilingual market and law primers for provinces', 65, { acceptance: 9, trust: 8, legitimacy: 5 }),
   C('Archive master brass matrices inside the treasury vault', 0, { securityMonths: 8, stability: 5 })
  ]);

 // === 8. THE GUILDHALL MASTER'S COINAGE & CREDIT (3-stage arc, trigger: 'trade') ===
 add('scd_guild_coinage', 'Economy & Trade', "The Guildhall Master's Coinage & Credit",
  'Merchants at the cloth hall complain clipped foreign silver groats are driving honest coin out of circulation and stalling long-distance trade bills.',
  'trade', [
   C('Recall clipped coin at fair crown rates and issue high-fineness groats', 145, { credit: 12, inflation: -3, trust: 8 }, 'scd_guild_assay'),
   C('Empower guild assay masters to stamp and police market scales', 60, { credit: 7, trust: 6, stability: 4 }, 'scd_guild_boycott'),
   C('Collect customary seigniorage without recoining worn silver', 0, { gold: 85, inflation: 2, credit: -4 }, 'scd_guild_boycott')
  ]);

 add('scd_guild_assay', 'Economy & Trade', 'The Goldsmiths’ Assay Furnace',
  'Sworn mint wardens test silver bars beside public scales while foreign factors bid for reliable bills drawn on the capital exchange.',
  'followup', [
   C('Charter a permanent Capital Assay Guild with public ledger oversight', 100, { credit: 11, development: 1, inflation: -2 }, 'scd_guild_exchange_charter'),
   C('Limit recoinage strictly to major port and border customshouses', 0, { credit: 6, gold: 45 }, 'scd_guild_exchange_charter')
  ]);

 add('scd_guild_boycott', 'Economy & Trade', 'Shuttered Counting Houses Along Lombard Row',
  'Merchant syndics lock their strongboxes in protest over unreliable coin, slowing timber, salt, and wool deliveries into capital markets.',
  'followup', [
   C('Mediate an honest bullion settlement and restore guild assay guarantees', 125, { credit: 12, trust: 9, unrest: -6 }, 'scd_guild_exchange_charter'),
   C('Compel markets open by marshal decree and fine hoarding brokers', 0, { gold: 90, stability: -3, unrest: 5 })
  ]);

 add('scd_guild_exchange_charter', 'Economy & Trade', 'The Capital Exchange Charter',
  'Reliable silver fineness and enforceable merchant bills turn the capital guildhall into a trusted clearinghouse for regional trade.',
  'followup', [
   C('Endow stone guild warehouses and honest port cranes', 95, { development: 1, credit: 9, tools: 14 }),
   C('Publish standardized weights and commercial contract law', 55, { legitimacy: 6, trust: 8, stability: 4 }),
   C('Collect modest royal seal dues on foreign bills', 0, { gold: 80, credit: 4 })
  ]);

 // === 9. THE REGENT'S CITADEL & YOUNG HEIR'S OATH (3-stage arc, trigger: 'regency') ===
 add('scd_regent_citadel', 'Succession', "The Regent's Citadel & Young Heir's Oath",
  'During the royal minority, rival factions vie for custody of the capital citadel keep and the ceremonial regency seal.',
  'regency', [
   C('Place the citadel under a sworn mixed council of magistrates and knights', 120, { legitimacy: 9, stability: 8, stress: -6 }, 'scd_regent_loyal_ward'),
   C('Concentrate citadel keys inside the inner household guard', 55, { securityMonths: 10, prestige: 5, stress: 4 }, 'scd_regent_palace_lock'),
   C('Delay council changes until seasonal estates assemble', 0, { stability: -3, stress: 6, legitimacy: -3 }, 'scd_regent_palace_lock')
  ]);

 add('scd_regent_loyal_ward', 'Succession', 'Lessons on the Keep Battlements',
  'Escorted by veteran wardens and royal tutors, the young sovereign reviews garrison watches and hears civic petitions calmly.',
  'followup', [
   C('Sponsor thorough instruction in governance, finance, and drill', 95, { education: 12, legitimacy: 7, stress: -5 }, 'scd_regent_coronation_oath'),
   C('Keep public audiences ceremonial while tutors guide lessons', 0, { education: 6, stability: 5 }, 'scd_regent_coronation_oath')
  ]);

 add('scd_regent_palace_lock', 'Succession', 'Whispers Behind the Postern Gate',
  'Excluded magnates complain the citadel guard acts like a closed faction, threatening to withhold provincial taxes until oaths are renewed.',
  'followup', [
   C('Open a witnessed regency audit before senior judges and peers', 115, { legitimacy: 10, stability: 7, stress: -6 }, 'scd_regent_coronation_oath'),
   C('Double night watches and silence rumors by decree', 0, { securityMonths: 9, legitimacy: -4, stress: 5 })
  ]);

 add('scd_regent_coronation_oath', 'Succession', 'The Citadel Keys Restored',
  'Before assembled banners and abbey prelates, the regency affirms inviolable succession rights and hands back clean treasury ledgers.',
  'followup', [
   C('Commission a gilded regency charter honoring loyal stewards', 75, { legitimacy: 10, prestige: 8, stability: 5 }),
   C('Endow scholarships for pages trained beside the young sovereign', 50, { education: 8, research: 5, stress: -4 }),
   C('Seal the regency minutes cleanly in royal archives', 0, { stability: 6, legitimacy: 4 })
  ]);

 // === 10. THE COMPETING HEIRS' SIEGE COMMAND (3-stage arc, trigger: 'competingHeirs') ===
 add('scd_heirs_command', 'Family', "The Competing Heirs' Vanguard Dispute",
  'Two royal siblings claim the right to lead the household vanguard and inspect frontier fortresses, each backed by jealous court retainers.',
  'competingHeirs', [
   C('Assign both siblings complementary commands — siege train and supply', 115, { opinion: 12, education: 8, legitimacy: 6 }, 'scd_heirs_joint_banner'),
   C('Award sole vanguard precedence strictly to the elder heir', 45, { legitimacy: 7, opinion: -10, prestige: 5 }, 'scd_heirs_duel_challenge'),
   C('Keep both youths at capital court audits instead of the frontier', 0, { stability: 4, opinion: -6, stress: 4 }, 'scd_heirs_duel_challenge')
  ]);

 add('scd_heirs_joint_banner', 'Family', 'Shared Campfires on the March',
  'Working side by side over siege maps and supply tallies, the siblings discover that discipline relies on mutual trust rather than bravado.',
  'followup', [
   C('Reward their cooperation with matched silver spurs and estate charters', 90, { opinion: 14, prestige: 7, stability: 5 }, 'scd_heirs_succession_pact'),
   C('Praise their diligence quietly in household council', 0, { opinion: 7, education: 5 }, 'scd_heirs_succession_pact')
  ]);

 add('scd_heirs_duel_challenge', 'Family', 'Gauntlets Thrown in the Armory Yard',
  'Bitter whispers escalate when household retainers trade insults over armor precedence, forcing the sovereign to step in before blades are drawn.',
  'followup', [
   C('Host a formal reconciliation banquet and clarify dynastic duties', 120, { opinion: 16, stability: 6, stress: -6 }, 'scd_heirs_succession_pact'),
   C('Send the younger sibling on a distant diplomatic mission to cool tempers', 0, { prestige: 4, opinion: -8, securityMonths: 6 })
  ]);

 add('scd_heirs_succession_pact', 'Succession', 'Two Pillars of One House',
  'With duties clearly inscribed in the household roll, senior commanders rally confidently behind a united dynastic succession.',
  'followup', [
   C('Have both heirs witness the royal succession charter publicly', 80, { legitimacy: 11, opinion: 10, stability: 6 }),
   C('Fund advanced tutoring in statecraft and logistics for both', 60, { education: 10, research: 6, stress: -4 }),
   C('Conclude household deliberations calmly', 0, { stability: 5, prestige: 4 })
  ]);

 // === 11. THE OCEANIC SPICE CHARTER & DOCKYARD ARSENAL (3-stage arc, trigger: 'crossroads_oceanic') ===
 add('scd_oceanic_arsenal', 'Crossroads', 'The Oceanic Spice Charter & Dockyard Arsenal',
  'Port guildmasters and veteran navigators propose building deep-water caravel drydocks alongside a chartered long-distance spice syndicate.',
  'crossroads_oceanic', [
   C('Fund timber slipways, pitch kilns, and brass astrolabe workshops', 155, { development: 1, credit: 10, research: 9 }, 'scd_oceanic_caravel_convoy'),
   C('Grant an exclusive spice monopoly in return for upfront customs loans', 60, { gold: 110, credit: 7, trust: -3 }, 'scd_oceanic_guild_monopoly'),
   C('Restrict oceanic charters until coastal lighthouses are repaired', 0, { stability: 5, trust: 6, credit: 3 }, 'scd_oceanic_guild_monopoly')
  ]);

 add('scd_oceanic_caravel_convoy', 'Crossroads', 'Lateen Sails Clear the Breakwater',
  'Armed merchant caravels sail in formation with calibrated rutters, returning months later with cloves, hardwood, and clean longitude notes.',
  'followup', [
   C('Establish a permanent Hydrographic School & Marine Arsenal', 110, { research: 11, credit: 9, tools: 15 }, 'scd_oceanic_spice_customs'),
   C('Auction surplus spice cargoes to finance further dockyard piers', 0, { gold: 130, credit: 6 }, 'scd_oceanic_spice_customs')
  ]);

 add('scd_oceanic_guild_monopoly', 'Economy & Trade', 'Smugglers Outside the Staple Port',
  'Excluded coastal captains bypass royal staple wharves, sparking sharp disputes over customs seals and harbour pilotage.',
  'followup', [
   C('Open bounded share subscriptions to smaller port guilds', 100, { credit: 10, trust: 9, unrest: -6 }, 'scd_oceanic_spice_customs'),
   C('Deploy armed customs cutters to enforce the harbor monopoly', 0, { gold: 90, securityMonths: 8, unrest: 4 })
  ]);

 add('scd_oceanic_spice_customs', 'Economy & Trade', 'The Maritime Customshouse Ledger',
  'Orderly customs tallies, drydock timber stocks, and trained pilots anchor oceanic trade firmly inside the capital fiscal system.',
  'followup', [
   C('Build stone spice godowns and public port scales', 90, { development: 1, credit: 10, trust: 7 }),
   C('Commission updated portolan atlases for every crown captain', 60, { research: 10, prestige: 8 }),
   C('Seal the annual Admiralty customs accounts', 0, { legitimacy: 6, gold: 65 })
  ]);

 // === 12. THE CHARTERED EXCHANGE & WAR BOND SYNDICATE (3-stage arc, trigger: 'crossroads_finance') ===
 add('scd_chartered_bourse', 'Economy & Trade', 'The Chartered Exchange & War Bond Syndicate',
  'Urban financiers offer to underwrite long-term crown annuities backed by customs revenues, promising swift liquidity for capital works and frontier garrisons.',
  'crossroads_finance', [
   C('Charter a regulated Sovereign Bourse with transparent customs backing', 135, { credit: 14, inflation: -2, legitimacy: 7 }, 'scd_bourse_annuities'),
   C('Borrow short-term silver notes quietly without public scrutiny', 50, { gold: 120, credit: -3, inflation: 2 }, 'scd_bourse_default_panic'),
   C('Reject bonded debt and rely strictly on ordinary hearth revenue', 0, { stability: 5, legitimacy: 4, credit: 3 }, 'scd_bourse_default_panic')
  ]);

 add('scd_bourse_annuities', 'Economy & Trade', 'Annuity Parchments on the Bourse Floor',
  'Guild widows, town councils, and foreign factors bid briskly for stamped royal annuities, lowering interest discounts across the realm.',
  'followup', [
   C('Channel bond proceeds into capital roads, mints, and granaries', 100, { development: 1, food: 65, credit: 8 }, 'scd_bourse_treasury_reform'),
   C('Retire older high-interest loans early cleanly', 0, { credit: 10, inflation: -2, stability: 5 }, 'scd_bourse_treasury_reform')
  ]);

 add('scd_bourse_default_panic', 'Economy & Trade', 'Rumors of Treasury Arrears',
  'Merchants tighten credit after rumors of unpaid short-term notes sweep the market square, driving up grain and tool prices.',
  'followup', [
   C('Publish audited customs surpluses and honor every maturing bill', 130, { credit: 13, inflation: -3, trust: 8 }, 'scd_bourse_treasury_reform'),
   C('Freeze bullion exports temporarily until coffers recover', 0, { gold: 75, credit: -5, unrest: 4 })
  ]);

 add('scd_bourse_treasury_reform', 'Economy & Trade', 'Balanced Tallies in the Exchequer',
  'Audited sinking funds and honored promissory bills cement early-modern financial discipline at the heart of royal statecraft.',
  'followup', [
   C('Establish quarterly printed exchequer balances for the estates', 75, { credit: 10, trust: 8, research: 5 }),
   C('Build reserve silver vaults beneath the treasury tower', 60, { securityMonths: 9, stability: 6 }),
   C('Confirm the exchequer statutes cleanly', 0, { legitimacy: 6, inflation: -1 })
  ]);

 // === 13. THE STAR FORT ENGINEERS & BASTION TRACE (3-stage arc, trigger: 'crossroads_gunpowder') ===
 add('scd_star_fort_survey', 'Crossroads', 'Angular Bastions & Earthwork Surveys',
  'Military architects return from Italian siege wars with brass sighting compasses, urging low sloped earthworks capable of deflecting iron cannonballs.',
  'crossroads_gunpowder', [
   C('Commission star-shaped angular bastions and wide dry ditches', 160, { development: 1, tools: 20, research: 9 }, 'scd_star_fort_earthworks'),
   C('Reinforce medieval curtain walls with timber-and-earth boulevards', 85, { development: 1, tools: 12, stability: 4 }, 'scd_star_fort_tax_revolt'),
   C('Keep traditional high stone towers and repair gate portcullises', 0, { gold: 40, trust: 3, research: -2 }, 'scd_star_fort_tax_revolt')
  ]);

 add('scd_star_fort_earthworks', 'Crossroads', 'Bricks, Gabions & Sighting Lines',
  'Surveyors align interlocking firing angles across the glacis so no enemy battery can approach without crossing enfilade fire.',
  'followup', [
   C('Train native master masons and gunners in bastion geometry', 100, { research: 10, tools: 16, prestige: 7 }, 'scd_star_fort_citadel'),
   C('Stock casemates with surplus grain and hand-tools', 0, { food: 60, tools: 12, stability: 4 }, 'scd_star_fort_citadel')
  ]);

 add('scd_star_fort_tax_revolt', 'Politics', 'Corvée Grievances Along the Ditch',
  'Suburban parishes protest forced ditch-digging and demolished orchard walls outside the new fortification perimeter.',
  'followup', [
   C('Pay fair silver wages to laborers and compensate cleared orchards', 115, { unrest: -11, trust: 11, development: 1 }, 'scd_star_fort_citadel'),
   C('Enforce labor duties strictly through town marshals', 0, { unrest: 6, securityMonths: 7, legitimacy: 4 })
  ]);

 add('scd_star_fort_citadel', 'Crossroads', 'The Bastioned Frontier Citadel',
  'Low brick-faced bastions, clear fields of fire, and dry vaulted magazines stand ready to blunt the gunpowder siege revolution.',
  'followup', [
   C('Establish a permanent Corps of Royal Fortification Engineers', 95, { research: 11, development: 1, prestige: 8 }),
   C('Inscribe bastion supply tables cleanly for provincial governors', 50, { legitimacy: 6, stability: 6 }),
   C('Inspect completed casemates and dismiss labor crews', 0, { trust: 5, tools: 10 })
  ]);

 // === 14. THE FOREIGN CONSORT'S FOUNDRY & TRADE GUILD (3-stage arc, trigger: 'foreignMarriage') ===
 add('scd_consort_artisan_guild', 'Diplomacy', "The Foreign Consort's Artisan Guild",
  'Skilled bronze-casters, silk-weavers, and glassmakers arriving in your consort’s retinue seek royal letters patent to open workshops in the capital.',
  'foreignMarriage', [
   C('Grant workshop letters patent and joint ceremonial patronage', 120, { opinion: 14, relation: 12, credit: 8 }, 'scd_consort_diplomatic_fair'),
   C('Confine foreign masters strictly to palace household commissions', 50, { opinion: 5, prestige: 5, securityMonths: 7 }, 'scd_consort_court_friction'),
   C('Require foreign artisans to join native guilds under heavy entry fees', 0, { gold: 75, opinion: -8, relation: -6 }, 'scd_consort_court_friction')
  ]);

 add('scd_consort_diplomatic_fair', 'Diplomacy', 'Joint Guild Banners at the Seasonal Fair',
  'Envoys from your consort’s homeland attend the capital trade fair, praising shared craftsmanship and proposing reciprocal merchant safe-conducts.',
  'followup', [
   C('Sign reciprocal merchant exemptions and exchange royal honors', 95, { relation: 14, credit: 9, prestige: 7 }, 'scd_consort_treaty_charter'),
   C('Host a warm household banquet celebrating both realms', 0, { opinion: 10, stress: -6, relation: 5 }, 'scd_consort_treaty_charter')
  ]);

 add('scd_consort_court_friction', 'Diplomacy', 'Petitions From Native & Foreign Masters',
  'Native guild wardens grumble over foreign tax exemptions while your consort’s household laments chilly treatment at court.',
  'followup', [
   C('Broker an apprenticeship compact binding native and foreign masters', 110, { opinion: 15, relation: 10, stability: 5 }, 'scd_consort_treaty_charter'),
   C('Uphold native guild monopolies quietly in private council', 0, { legitimacy: 5, opinion: -10, relation: -8 })
  ]);

 add('scd_consort_treaty_charter', 'Diplomacy', 'Two Houses, Shared Commerce',
  'Dynastic marriage ties bear tangible fruit in thriving craft quarters, steadier borders, and warm diplomatic correspondence.',
  'followup', [
   C('Endow a bilingual Chancery & Merchant Registry', 80, { research: 8, credit: 8, relation: 8 }),
   C('Commission commemorative medals honoring both dynasties', 50, { prestige: 8, opinion: 10, stress: -5 }),
   C('Confirm the joint trade charter calmly', 0, { stability: 5, relation: 4 })
  ]);

 // === 15. THE DISLOYAL CASTELLAN'S SALTPETER TOLL (3-stage arc, trigger: 'disloyal') ===
 add('scd_castellan_saltpeter', 'Politics', "The Disloyal Castellan's Saltpeter Toll",
  'A restless provincial castellan has begun impounding crown saltpeter wagons at a river bridge, claiming ancient baronial transit dues.',
  'disloyal', [
   C('Dispatch royal auditors and buy out the disputed toll rights cleanly', 120, { loyalty: 13, tools: 15, trust: 7 }, 'scd_castellan_inspection'),
   C('Issue a stern writ demanding immediate free passage for crown munitions', 45, { leverage: 24, legitimacy: 7, loyalty: -6 }, 'scd_castellan_defiance'),
   C('Reroute powder convoys over back roads to avoid an open breach', 0, { stability: 3, loyalty: -4, credit: -3 }, 'scd_castellan_defiance')
  ]);

 add('scd_castellan_inspection', 'Politics', 'Open Ledgers at the River Keep',
  'Auditors verify the castellan’s arrears while local carters testify to fair bridge repairs and orderly toll stamps.',
  'followup', [
   C('Confirm lawful bridge upkeep stipends in exchange for sworn fealty', 85, { loyalty: 12, development: 1, unrest: -6 }, 'scd_castellan_crown_keep'),
   C('Record the settlement cleanly and claim modest crown transit shares', 0, { gold: 65, loyalty: 5 }, 'scd_castellan_crown_keep')
  ]);

 add('scd_castellan_defiance', 'Politics', 'Barricaded Chains Above the River Arch',
  'Emboldened retainers stretch iron chains beneath the gatehouse, threatening to halt every merchant barge unless concessions are sealed.',
  'followup', [
   C('Send marshals with a final compromise charter and stern backing', 135, { loyalty: 14, unrest: -8, legitimacy: 6 }, 'scd_castellan_crown_keep'),
   C('Smash the river chains by royal warrant and seize toll fines', 0, { gold: 105, trust: 8, loyalty: -12 })
  ]);

 add('scd_castellan_crown_keep', 'Politics', 'Order Restored Along the King’s Road',
  'Saltpeter wagons, timber drays, and grain carts roll unhindered once more beneath sealed royal way-markers.',
  'followup', [
   C('Station loyal royal quartermasters at the bridge magazine', 75, { tools: 18, securityMonths: 9, stability: 5 }),
   C('Repair local market cobbles and roadside milestones', 55, { trust: 8, development: 1 }),
   C('Close the provincial exchequer dossier cleanly', 0, { legitimacy: 6, loyalty: 4 })
  ]);

 // === 16. THE ADULT HEIR'S GRAND TOUR & CAPITAL WORKS (3-stage arc, trigger: 'adultHeir') ===
 add('scd_heir_capital_works', 'Succession', "The Adult Heir's Capital Inspection",
  'Your adult heir returns from inspecting frontier roads and capital granaries with a detailed slate of guild, mint, and fortification reforms.',
  'adultHeir', [
   C('Entrust your heir with supervising the capital public-works commission', 130, { education: 12, opinion: 14, legitimacy: 8 }, 'scd_heir_guild_audit'),
   C('Allow limited oversight under senior treasury councillors', 55, { education: 7, stability: 5, opinion: 4 }, 'scd_heir_factions_clash'),
   C('Shelve ambitious drafts until the next reign begins', 0, { stability: 3, opinion: -10, stress: 4 }, 'scd_heir_factions_clash')
  ]);

 add('scd_heir_guild_audit', 'Succession', 'The Heir Before the Guild Wardens',
  'Master masons, mint-keepers, and grain bailiffs debate waste and patronage openly before your heir’s watchful clerks.',
  'followup', [
   C('Back your heir’s clean audit and reward diligent guild stewards', 95, { credit: 9, legitimacy: 8, opinion: 10 }, 'scd_heir_mandate_sealed'),
   C('Balance reforms quietly to spare veteran court favourites', 0, { stability: 6, opinion: 4 }, 'scd_heir_mandate_sealed')
  ]);

 add('scd_heir_factions_clash', 'Succession', 'Courtiers Divide Around the Throne',
  'Senior councillors dismiss the heir’s memoranda as youthful impatience, prompting younger knights to rally loudly around the prince’s banner.',
  'followup', [
   C('Convene a joint household-and-council conference to bridge generations', 110, { opinion: 15, stability: 7, legitimacy: 6 }, 'scd_heir_mandate_sealed'),
   C('Demand strict silence from all court factions immediately', 0, { legitimacy: 5, opinion: -8, stress: 5 })
  ]);

 add('scd_heir_mandate_sealed', 'Succession', 'Continuity of Crown & Capital',
  'Having mastered treasury rolls, guild petitions, and garrison duties, your heir stands visibly prepared to shoulder the sovereign’s seal.',
  'followup', [
   C('Publish the joint royal works charter before the capital estates', 85, { legitimacy: 11, prestige: 9, stability: 5 }),
   C('Endow permanent training stipends for young court administrators', 60, { research: 8, education: 8, stress: -4 }),
   C('Enter the completed commission into the dynastic chronicle', 0, { prestige: 6, legitimacy: 5 })
  ]);

 return out;
}
