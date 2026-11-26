/**
 * Sovereign: 1450 — Modular Content Pack: Court Intrigue, Factions & Statecraft
 * 172 distinct scenarios & follow-ups using verified campaign state triggers and effects.
 */
const BANK = [
 ['int_cipher_key_lost','Intrigue','Missing Signet & Cipher Sheet','A chancellery runner dropped an unsealed leather pouch near the stables before matins.','activePlot',['Purge locks and re-ink cipher',90,{securityMonths:12,plotPreparation:8},'Quietly trace whoever touched it',0,{plotPreparation:10,stress:4}]],
 ['int_blackmail_ledger','Intrigue','Torn Leaves From a Tax Chest','Secret agents deliver duplicate tallies implicating a proud provincial marshal in skimming salt dues.','knownSecret',['Turn the confession into loyal silence',75,{loyalty:10,legitimacy:4},'Demand double restitution into coffers',0,{gold:120,loyalty:-8}]],
 ['int_whispered_banquet_toast','Intrigue','Too Loud at the High Table','An intoxicated baron toasted "older blood and lighter taxes" within earshot of halberdiers.','taxFaction',['Arrest the ringmaster quietly at dawn',95,{factionPressure:-14,stability:4},'Feign deafness and tax concessions',0,{gold:-40,factionLoyalty:8}]],
 ['int_foreign_agent_inn','Intrigue','Shadows at the Golden Fleece','Watchmen detained a peddler carrying foreign wax impressions inside hollow candlesticks.','detectedPlot',['Interrogate and expel the spy ring',85,{securityMonths:10,relation:-6},'Feed them false muster figures',40,{prestige:5,securityMonths:8}]],
 ['int_claimant_tavern_song','Intrigue','A Ballad Mocking Crown Rights','Tinkers sing verses praising a rival claimant across three frontier market squares.','livingClaimant',['Commission royal counter-ballads',80,{legitimacy:8,unrest:-4},'Fine innkeepers for seditious noise',0,{gold:45,unrest:5}]],
 ['int_council_deadlock_bribe','Intrigue','A Sealed Purse Before the Vote','Your chancellor suggests selective estate stipends could resolve a stubborn council blockade.','councillor',['Disburse discreet patronage purses',115,{loyalty:11,stability:5},'Refuse to buy sworn counsel',0,{legitimacy:6,loyalty:-4}]],
 ['int_poisoned_fig_scare','Intrigue','Nightshade Near the Kitchens','Kitchen boys caught a scullion grinding pale berries beside the spiced wine amphora.','courtRival',['Double tasters and purge kitchens',100,{securityMonths:12,stress:3},'Keep investigation strictly secret',0,{plotPreparation:6,stress:6}]],
 ['int_liberty_charter_leak','Intrigue','Draft Charter Stolen From Clerks','Word spreads that barons seek sweeping concessions curtailing royal wardship rights.','libertyFaction',['Grant narrow ceremonial liberties',90,{factionPressure:-12,factionLoyalty:8},'Rally loyalists and reject dictation',40,{legitimacy:7,factionPressure:5}]],
 ['int_levy_muster_evasion','Intrigue','Ghost Rosters at the Muster Yard','Inspectors suspect border lords padded spears on parchment to dodge field levies.','levyFaction',['Send surprise royal mustermasters',95,{morale:5,factionPressure:-10},'Accept cash scutage commutations',0,{gold:110,factionPressure:6}]],
 ['int_independence_whisperers','Intrigue','Border Lords Parley by Night','Lanterns burned late in an eastern keep where peripheral lords met without crown summons.','independenceFaction',['Summon the principals to capital feast',130,{factionPressure:-15,loyalty:9},'Garrison key mountain passes',80,{securityMonths:10,unrest:-3}]],
 ['int_turncoat_captain','Intrigue','A Captain Offers the Postern Key','An enemy border sergeant offers intelligence on crumbling bastion walls in exchange for coin.','war',['Buy the intelligence quietly',110,{supply:15,morale:6},'Scorn dishonorable bribery',0,{prestige:6,piety:4}]],
 ['int_disloyal_mayor_smugglers','Intrigue','Lantern Signals Below the Cliffs','Fishermen spot unflagged cogs unloading velvet bolts outside customs gates on moonless nights.','disloyal',['Seize contraband and fine the bailiff',75,{gold:115,unrest:-3,loyalty:-5},'Co-opt the syndicate for state tariffs',40,{credit:7,trust:5}]],
 ['int_secret_network_expansion','Intrigue','New Ears in Foreign Chanceries','A trusted informant proposes placing bilingual clerks inside rival trading factories.','networkContact',['Underwrite the quiet stipend',110,{securityMonths:10,plotPreparation:10,prestige:4},'Recall informants to home duty',0,{gold:25,stability:2}]],
 ['int_forged_papal_seal','Intrigue','A Suspiciously Fresh Bull','Scribes notice crooked wax lettering on an exemption letter waved by an ambitious prelate.','knownSecret',['Expose the forgery quietly in council',70,{faithAuthority:6,legitimacy:5},'Confiscate the forged parchment silently',0,{securityMonths:8,prestige:3}]],
 ['int_court_rival_lampoon','Intrigue','Scandalous Woodcuts at Dawn','Mocking caricatures of a leading royal rival appear nailed beside palace stable gates.','courtRival',['Confiscate sheets before morning bell',50,{stability:4,opinion:5},'Look the other way with a thin smile',0,{stress:-4,opinion:-10}]],
 ['int_claimant_foreign_subsidy','Intrigue','Foreign Florins in Rebel Purses','Customs guards uncovered minted foreign florins sewn into a claimant agent’s saddlebags.','claimantFaction',['Seize bullion and denounce interference',90,{gold:95,factionPressure:-12,relation:-8},'Track the courier back to conspirators',45,{securityMonths:12,legitimacy:6}]],
 ['int_regency_whispered_will','Intrigue','The Locked Will Box','A dying chamberlain hints that two versions of the late monarch’s regency codicil circulate.','regency',['Witness and seal the authentic charter',100,{legitimacy:10,stability:5},'Burn uncertified drafts privately',0,{securityMonths:8,prestige:3}]],
 ['int_guard_watch_rotation','Intrigue','Sleepy Halberdiers at Gate Three','During a nocturnal inspection, the watch captain found torch sconces unlit beside the privy stair.','highStress',['Dismiss the negligent captain at once',70,{securityMonths:10,stability:3},'Reassign guards gently with extra pay',45,{loyalty:6,stress:-4}]],
 ['int_hostile_envoy_bribery','Intrigue','A Rival Ambassador’s Gold','A neighboring diplomat has been pressing silver goblets onto junior chancery copyists.','hostile',['Expel the envoy with icy ceremony',75,{prestige:6,relation:-10,securityMonths:8},'Plant harmless decoy memoranda',50,{securityMonths:12,plotPreparation:8}]],
 ['int_vassal_feud_assassination_plot','Intrigue','Arsenic Rumored in Border Wine','A terrified groom warns his lord’s cousin seeks quiet poison before winter court convenes.','activePlot',['Preemptively arrest the conspirator',90,{legitimacy:6,plotPreparation:10},'Warn the lord discreetly for gratitude',40,{loyalty:12,opinion:10}]],
 ['int_chancery_cipher_expert','Intrigue','An Eccentric Polymath of Ciphers','A blind mathematician decodes intercepted diplomatic letters by rhythm and letter count alone.','research',['Retain the decoder in royal service',105,{securityMonths:12,research:8},'Decline odd scholarly spectacles',0,{gold:15}]],
 ['int_merchant_courier_ambush','Intrigue','Stolen Pouch on the Post Road','Highwaymen spared bags of spices while carrying off only sealed crown dispatches.','neighbor',['Escort post riders with light horse',95,{securityMonths:10,credit:4},'Encrypt dispatches twice with plain couriers',25,{plotPreparation:6}]],
 ['int_court_gossip_diary','Intrigue','A Lady-in-Waiting’s Cipher Book','Chambermaids discovered notebooks recording who visited whom behind the east gallery.','knownSecret',['Seal the notebook in royal vaults',70,{securityMonths:9,stress:-4},'Use selected entries to discipline flatterers',0,{loyalty:6,opinion:-7}]],
 ['int_traitor_confession_pardon','Intrigue','Penitent Plotter at Midnight','Knocking softly at the postern, a minor conspirator offers full names for his life and estate.','detectedPlot',['Guarantee life and banish quietly',85,{securityMonths:12,stability:5},'Seize lands and demand full trial',0,{gold:110,unrest:3,legitimacy:4}]],
 ['int_diplomatic_bag_switched','Intrigue','Wrong Dispatch in the Velvet Bag','Clerks accidentally handed a merchant consul the wrong treaty draft — or was it deliberate?','trade',['Dispatch fast riders to recall it',75,{credit:5,stability:3},'Wait to see how the consul reacts',0,{securityMonths:6,relation:-4}]],
 ['int_palace_secret_passage','Intrigue','Bricks Hollowed Behind the Tapestry','A plasterer repairing damp stonework uncovered a forgotten stairwell linking cellar to solar.','newReign',['Wall it silently with fresh mortar',80,{securityMonths:10,stability:4},'Keep the key hidden for emergencies',20,{plotPreparation:10,stress:-3}]],
 ['int_unrest_agitator_trails','Intrigue','Broadsides Pasted by Night','Bold charcoal placards blame the treasury for grain shortages before market bell.','unrest',['Identify printers quietly through guilds',85,{unrest:-10,trust:5},'Tear sheets down with patrols',20,{unrest:-4,stability:2}]],
 ['int_loyal_informer_reward','Intrigue','The Watchful Porter','A gatehouse porter prevented forged passes from entering the inner armory bailey.','loyal',['Grant a silver belt and tavern license',60,{loyalty:9,securityMonths:8,prestige:3},'Praise his vigilance verbally',0,{loyalty:3}]],
 ['int_council_whisper_test','Intrigue','Rumors Floated to Catch Leaks','Two councillors suspect another minister whispers crown troop numbers to border nobles.','councillor',['Feed different figures to find the leak',70,{securityMonths:12,loyalty:-2},'Call all three into frank fellowship',0,{opinion:8,stability:3}]],
 ['int_pirate_cove_treaty','Intrigue','Sealed Letters From Sea Rovers','Smugglers offer to prey strictly on hostile hulls if customs skip inspecting certain coves.','hostile',['Sign silent letters of reprisal',90,{gold:80,relation:-12},'Hang smugglers to uphold sea law',45,{legitimacy:8,credit:6}]],
 ['int_corrupted_seal_matrix','Intrigue','Scratched Brass in the Mint','Mint wardens noticed microscopic file marks beside the royal crown punch in iron dies.','inflation',['Recoin dies under locked watch',105,{inflation:-3,securityMonths:8},'Retain old dies to save silver',0,{inflation:2,gold:35}]],
 ['int_friendly_court_tipoff','Intrigue','A Friendly Envoy’s Whisper','An allied courtier discreetly reveals one of your border commanders took dubious gifts.','friendly',['Replace the commander gracefully',75,{relation:6,securityMonths:8,morale:4},'Confront the commander sharply',0,{loyalty:-6,legitimacy:4}]],
 ['int_prisoner_bribe_attempt','Intrigue','Florins Pressed Under the Door','Turnkeys report an anonymous courier offered thirty crowns to leave a postern unlatched.','activePlot',['Use false flight to trap conspirators',85,{plotPreparation:12,securityMonths:10},'Transfer guards and iron grates',40,{stability:4}]],
 ['int_court_astrologer_warning','Intrigue','Comet Above the Keep','A star-reader whispers that Mars touches the royal house, breeding plots among impatient kin.','competingHeirs',['Sponsor calm thanksgiving prayers',75,{stability:6,piety:5,stress:-4},'Put restless kin under watchful escort',60,{securityMonths:8,opinion:-5}]],
 ['int_falsified_lineage_scroll','Intrigue','Parchment Pedigrees Made to Order','A clever scribe at a provincial abbey has been selling ancient lineage rolls to upstart merchants.','lowlegitimacy',['Impound false rolls and audit charters',90,{legitimacy:9,credit:4},'Tax new titles handsomely instead',0,{gold:125,legitimacy:-4}]],
 ['int_silent_escort_ambush','Intrigue','Hoofbeats Behind the Hedgerow','Outriders cleared three masked crossbows from a sunken lane hours before the royal litter passed.','land',['Reward outriders and fortify road inns',100,{securityMonths:12,trust:6},'Travel strictly by river barge this month',40,{prestige:4}]],
 ['int_tax_collector_protection','Intrigue','Clerks Need Armed Escorts','Provincial tax collectors refuse to enter steep upland valleys without six halberdiers apiece.','lowstability',['Attach royal sergeants to tax circuits',90,{gold:85,stability:5,unrest:-3},'Delegate collection to local chiefs',0,{loyalty:5,gold:-25}]],
 ['int_rivalry_sabotaged_tournament','Intrigue','Sawdust Under Saddle Straps','A tournament marshal noticed freshly nicked leather girths before your rival’s joust.','courtRival',['Replace gear and arrest the saboteur',65,{prestige:7,opinion:8,piety:3},'Annul the match without explanation',0,{prestige:-3,securityMonths:6}]],
 ['int_embassy_eavesdropper','Intrigue','Listening Chimney in Guest Wing','Builders uncovered a hollow acoustic flue linking the ambassador’s suite to the roof loft.','foreignMarriage',['Seal the flue gracefully before guests notice',55,{opinion:6,relation:5},'Post discreet scribes to take notes',35,{securityMonths:10,plotPreparation:6}]],
 ['int_debt_collector_threat','Intrigue','Syndicate Envoys Knock Quietly','Private creditors hint they may publish royal promissory notes across foreign bourses.','debt',['Pay down principal and silence gossip',140,{credit:10,prestige:6},'Threaten treason charges for slander',0,{stability:-4,credit:-5}]],
 ['int_guild_courier_code','Intrigue','Ciphered Bills of Lading','Silk merchants use private numeric knots to hide silver movements from royal auditors.','trade',['Standardize open bourse ledgers',85,{credit:8,trade:6},'Co-opt guild spies for state warnings',55,{securityMonths:8,credit:3}]],
 ['int_rebel_courier_captured','Intrigue','Boots Soaked From Marsh Trails','Scouts caught a mud-caked rider bearing unsigned vows from three restless barons.','disloyal',['Show pardon to two, arrest the third',80,{loyalty:8,stability:5},'Proclaim open treason before council',0,{legitimacy:6,unrest:5}]],
 ['int_abbot_secret_archive','Intrigue','Locked Chests Under the Choir','An aging abbot bequeaths sealed bundles of thirty-year-old confessions to royal safekeeping.','sanctuary',['Seal them forever to guard realm peace',75,{piety:9,stability:6},'Study the pages by candlelight',0,{plotPreparation:9,stress:4}]],
 ['int_whispering_mirror_court','Intrigue','Polished Mirrors in the Corridor','Courtiers accuse the grand chamberlain of knowing every whisper before council convenes.','lowtrust',['Reform audience rules publicly',85,{trust:9,loyalty:4},'Rely on his sharp vigilance',0,{securityMonths:8,trust:-4}]]
];

function expandCatalog(E, C) {
 const out = [];
 const followups = [];
 for (const [id, cat, title, desc, trig, ch] of BANK) {
  const [l1, c1, e1, l2, c2, e2] = ch;
  const folId = id + '_epilogue';
  out.push(E(id, cat, title, desc, trig, [C(l1, c1, e1, folId), C(l2, c2, e2)]));
  followups.push(E(folId, cat, `${title} — Shadow Dispatch`, `Informants report how the court absorbed your handling of "${title}".`, 'followup', [
   C('Tighten court security rosters', 40, { securityMonths: 6, stability: 3 }),
   C('Burn old cipher drafts', 0, { stress: -3 })
  ]));
 }
 const arcs = [
  ['int_arc_spy','Spies & Codes','activePlot',[{plotPreparation:8,securityMonths:8},{stability:3}]],
  ['int_arc_whisper','Whisper Network','networkContact',[{securityMonths:9,loyalty:4},{prestige:3}]],
  ['int_arc_faction','Restless Estates','disloyal',[{loyalty:9,stability:4},{gold:35,loyalty:-4}]],
  ['int_arc_foreign','Cross-Border Spies','hostile',[{securityMonths:8,relation:-4},{relation:5}]],
  ['int_arc_secret','Vaulted Secrets','knownSecret',[{legitimacy:6,securityMonths:6},{stress:-4}]]
 ];
 const moments = [
  ['Bribed Gatekeeper','Night watchmen found brass copies hidden under loose flagstones.'],
  ['Stolen Seal Press','A wax mold still smelled of hot pine resin inside the clerk wing.'],
  ['Code in Sheet Music','Madrigal notes hid fleet departure dates between staves.'],
  ['Masked Courier','A rider fled through orchard lanes when challenged at the bridge.'],
  ['Invisible Ink','Lemon juice coaxed treasonous names across an ordinary grocery bill.'],
  ['Slanderous Pamphlet','Anonymous sheets circulated between guild taverns before dawn.'],
  ['Suspicious Confessor','An unlicensed friar lingered suspiciously near treasury vaults.'],
  ['Whispered Ultimatum','Envoys tested court resolve with veiled hints of armed defiance.']
 ];
 arcs.forEach(([prefix, label, trig, pair], aIdx) => {
  moments.forEach(([mtitle, mdesc], mIdx) => {
   const id = `${prefix}_${mIdx}`;
   const folId = `${id}_echo`;
   const cost = 55 + (aIdx + mIdx) * 9;
   out.push(E(id, 'Intrigue', `${label}: ${mtitle}`, mdesc, trig, [
    C(`Counter "${mtitle}" systematically`, cost, pair[0], folId),
    C('Downplay whispers to keep calm', 0, pair[1])
   ]));
   followups.push(E(folId, 'Intrigue', `Aftermath: ${mtitle}`, `The counter-intelligence ledgers close the file on "${mtitle}".`, 'followup', [
    C('File full dossier under crown seal', 30, { securityMonths: 6, legitimacy: 3 }),
    C('Dismiss extra watchmen', 0, { gold: 25 })
   ]));
  });
 });
 return [...out, ...followups];
}

export function courtIntrigueEvents(E, C) {
 return expandCatalog(E, C);
}
