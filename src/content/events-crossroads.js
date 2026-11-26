/**
 * Sovereign: 1450 — Modular Content Pack: Crossroads Eras & Reign Chapters
 * 124 distinct scenarios & follow-ups tied directly to Original Identity Pillars.
 */
const BANK = [
 ['xr_gunpowder_saltpeter','Crossroads','Saltpeter Harvest & Pigeon Lofts','Alchemists propose royal nitrate collection barns beside sheep-folds and pigeon towers.','crossroads_gunpowder',['Establish crown saltpeter monopolies',125,{morale:8,research:7,experience:5},'Buy imported powder selectively',40,{morale:4}]],
 ['xr_gunpowder_trace_italienne','Crossroads','Sloped Earthwork Bastions','Military engineers sketch thick star-angled ramparts able to deflect heavy bronze shot.','crossroads_gunpowder',['Refit key border citadels with earthworks',145,{stability:6,morale:7,development:1},'Strengthen high curtain battlements alone',35,{loyalty:4}]],
 ['xr_gunpowder_burst_boiler','Crossroads','Cracked Bronze at the Foundry','Master founders narrowly escaped when a defective bombards mold spat slag onto oak rafters.','crossroads_gunpowder',['Hire Flemish & Ottoman master casters',120,{research:9,experience:6,prestige:5},'Slow casting rhythms for careful inspection',0,{stability:4,legitimacy:3}]],
 ['xr_ocean_caravel_lateen','Crossroads','Lateen Rigging vs Square Sail','Shipwrights blend triangular lateen mizzen yards with sturdy ocean hulls for tacking close to wind.','crossroads_oceanic',['Underwrite prototype ocean caravels',135,{trade:11,research:8,prestige:6},'Focus on reliable coastal carracks',25,{trade:4}]],
 ['xr_ocean_magnetic_variation','Crossroads','Compass Needle Pulls True North?','Pilots returning from high western latitudes report needles drifting two degrees off pole stars.','crossroads_oceanic',['Commission systematic ocean logs',110,{research:10,trade:6,prestige:5},'Discard strange travelers’ whispers',0,{prestige:2}]],
 ['xr_ocean_scurvy_citrus','Crossroads','Lemons Stowed Below Decks','A Mediterranean surgeon insists pickled citrus juice prevents sailors’ gums from rotting offshore.','crossroads_oceanic',['Order citrus casks onto long-voyage crews',95,{trade:8,trust:6,health:-10},'Stick to salted beef and hardtack',0,{gold:25}]],
 ['xr_press_pamphlet_satire','Crossroads','Cheap Pamphlets Flood Taverns','Movable lead type lets satirists circulate biting broadsides across guildhalls within a single night.','crossroads_press',['Establish royal gazettes and open debate',105,{research:9,trust:6,unrest:-3},'License presses under chancery censor',45,{legitimacy:7,securityMonths:8}]],
 ['xr_press_law_codes_printed','Crossroads','Printed Statutes for Every Bailiff','Chancery printers bind identical pocket statute books replacing varied handwritten provincial customs.','crossroads_press',['Distribute uniform royal codes widely',125,{legitimacy:9,stability:7,credit:5},'Limit printing to abbey Latin editions',30,{piety:7,faithAuthority:4}]],
 ['xr_finance_exchange_fair','Crossroads','Four-Season Exchange Bourse','Bankers settle cross-continental debt bundles purely via paper endorsements without hauling silver chests.','crossroads_finance',['Charter an official crown bourse hall',140,{credit:12,trade:12,inflation:-2},'Tax paper endorsements conservatively',0,{gold:90}]],
 ['xr_finance_joint_stock_fleet','Crossroads','Shares Sold Across Three Estates','Widows, knights, and grocers subscribe tiny coin shares to split risks on spice voyages.','crossroads_finance',['Back royal joint-stock ocean charters',135,{trade:12,credit:9,prestige:6},'Reserve trade charters for high nobles',0,{loyalty:7,trade:3}]],
 ['xr_contact_botanical_gifts','Crossroads','Maize, Chillies & Cacao Pods','Returning vessels unload scarlet peppers, golden grain ears, and strange bitter beans for royal cooks.','crossroads_contact',['Test new crops on crown estates',115,{food:85,development:1,research:6},'Display dried curiosities in cabinet',20,{prestige:7}]],
 ['xr_contact_diplomatic_interpreter','Crossroads','The Translators’ Seminary','Languages across hemispheres demand careful lexicons if envoys hope to avoid bloody misunderstandings.','crossroads_contact',['Fund multilingual embassy academies',120,{relation:12,research:9,acceptance:8},'Rely on merchant ship pilots piecemeal',0,{gold:25}]],
 ['xr_reign_epithet_bard','Crossroads','Chroniclers Debate Your Reign’s Title','Poets and abbots weigh whether future ballads remember your reign for law, sword, gold, or faith.','reign_chapter',['Commission an honest grand royal chronicle',110,{prestige:11,legitimacy:8},'Let deeds stand louder than paid verses',0,{piety:6,stress:-4}]],
 ['xr_reign_milestone_monument','Crossroads','Founding the Reign’s Legacy Stone','Architects propose carving your dynasty’s completed chapter victories into a gilded plaza obelisk.','reign_chapter',['Erect the commemorative arch',135,{prestige:12,legitimacy:9,trust:5},'Pour silver into granaries instead',40,{food:60,unrest:-6}]]
];

function expandCatalog(E, C) {
 const out = [];
 const followups = [];
 for (const [id, cat, title, desc, trig, ch] of BANK) {
  const [l1, c1, e1, l2, c2, e2] = ch;
  const folId = id + '_epilogue';
  out.push(E(id, cat, title, desc, trig, [C(l1, c1, e1, folId), C(l2, c2, e2)]));
  followups.push(E(folId, cat, `${title} — Era Impact`, `Contemporaries weigh how "${title}" altered your kingdom’s place in the 1450 world.`, 'followup', [
   C('Standardize the innovation cleanly', 40, { prestige: 5, research: 5 }),
   C('Consolidate gains without upheaval', 0, { stability: 3 })
  ]));
 }
 const packs = [
  ['xr_p_gun','Age of Powder','crossroads_gunpowder',[{morale:7,research:6,experience:4},{gold:30}]],
  ['xr_p_sea','Blue-Water Charts','crossroads_oceanic',[{trade:9,prestige:6,research:4},{gold:25}]],
  ['xr_p_prs','Print & Pamphlet','crossroads_press',[{research:8,legitimacy:5,trust:4},{stability:2}]],
  ['xr_p_fin','Bourse & Credit','crossroads_finance',[{credit:9,trade:8,inflation:-1},{gold:40}]],
  ['xr_p_cnt','First Contact','crossroads_contact',[{relation:9,acceptance:7,research:5},{prestige:4}]],
  ['xr_p_rgn','Chapter Milestones','reign_chapter',[{prestige:8,legitimacy:6,stability:3},{stress:-4}]]
 ];
 const vignettes = [
  ['Guild Apprentices Adapt Quickly','Workshops bustle past curfew as young masters test bright imported tools.'],
  ['Conservatives Petition Crown Court','Elderly prelates and traditionalists worry fast changes unsettle ancient degrees.'],
  ['Foreign Observers Take Notes','Embassy attaches sketch royal workshops carefully for dispatch home.'],
  ['Merchants Offer New Taxes','Syndics offer voluntary customs boosts if charters hold firm five winters.'],
  ['Royal Artisans Show Prototypes','Master craftsmen unveil gleaming brass instruments upon velvet cushions.'],
  ['Border Wardens Demand Training','Frontier garrisons beg instructors to travel out along rugged mountain roads.'],
  ['Chroniclers Mark Turning Tide','Court historians open a fresh parchment volume declaring an unmistakable new era.'],
  ['Townsfolk Gather in Curiosity','Market crowds marvel as royal heralds demonstrate the new apparatus by town fountain.']
 ];
 packs.forEach(([prefix, label, trig, pair], pIdx) => {
  vignettes.forEach(([vtitle, vdesc], vIdx) => {
   const id = `${prefix}_${vIdx}`;
   const folId = `${id}_echo`;
   const cost = 65 + (pIdx + vIdx) * 8;
   out.push(E(id, 'Crossroads', `${label}: ${vtitle}`, vdesc, trig, [
    C(`Champion "${vtitle}"`, cost, pair[0], folId),
    C('Proceed cautiously this quarter', 0, pair[1])
   ]));
   followups.push(E(folId, 'Crossroads', `Era Echo: ${vtitle}`, `Dispatches record "${vtitle}" as a signature turning point of the Crossroads age.`, 'followup', [
    C('Publish royal charter celebrating progress', 30, { prestige: 5, credit: 4 }),
    C('Fold smoothly into ordinary law', 0, { stability: 3 })
   ]));
  });
 });
 return [...out, ...followups];
}

export function crossroadsEvents(E, C) {
 return expandCatalog(E, C);
}
