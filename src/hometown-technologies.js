// Named subjects for the existing 20 ten-rank branches. Ranks share the
// branch's persistent modifier; they are not 200 distinct simulation algorithms.
export const TECHNOLOGY_NAMES={
 farming:['Field surveys','Seed selection','Iron ploughshares','Crop rotation','Drainage ditches','Fallow management','Tenant estates','Improved plough teams','Agricultural manuals','Estate consolidation'],
 irrigation:['Village wells','Lined wells','Water channels','Sluice gates','Cisterns','Water lifting','Canal maintenance','Reservoir surveys','Flood control','Regional irrigation'],
 milling:['Hand mills','Millwrights','Windmill gearing','Millstones','Grain drying','Mill races','Watermill gearing','Guild milling','Mill maintenance','Commercial milling'],
 forestry:['Woodcutters','Coppicing','Timber seasoning','Forest rights','Saw pits','Managed woodland','Timber roads','Sawmills','Forestry surveys','Royal forest estates'],
 masonry:['Stone cutting','Mortar mixing','Quarry drainage','Block lifting','Standard masonry','Stone arches','Vaulting','Crane workshops','Masonry guilds','Master builders'],
 mining:['Ore surveys','Mine drainage','Iron extraction','Ore sorting','Mine supports','Bellows','Haulage','Water-powered pumps','Ore processing','Mining administration'],
 metallurgy:['Forge tools','Steel edges','Plate fitting','Tempering','Weapon inspection','Armor fitting','Specialist smiths','Standard equipment','Foundry quality','Royal armories'],
 infantry:['Drill practice','Pike formations','Shield discipline','Household guard','Professional drill','Reserve training','March discipline','Officer schools','Regimental organization','Veteran instructors'],
 archery:['Bow maintenance','Specialist bowmen','Quiver logistics','Volley drill','Crossbow workshops','Range practice','Ranged coordination','Field defenses','Marksman training','Archery guilds'],
 cavalry:['Horse care','Lance training','Specialist mounted corps','Saddle improvements','Mounted formations','Remount stations','Farrier guilds','Mounted reserves','Officer training','Royal stud farms'],
 siege:['Battering rams','Mechanical siege engines','Engine maintenance','Timber requisition','Sapper training','Engineer corps','Field logistics','Siege supply','Fortification surveys','Master siege engineers'],
 gunpowder:['Handgun training','Bombard engineering','Powder storage','Casting workshops','Gun carriages','Foundry inspection','Gun crews','Artillery supply','Artillery drill','Royal ordnance'],
 trade:['Market weights','Market charters','Merchant registers','Trade protection','Warehousing','Trade agreements','Road patrols','Customs houses','Merchant guilds','Regional exchanges'],
 finance:['Account books','Treasury audit','Credit contracts','Royal receipts','Mint standards','Commercial accounting','Debt registers','Tax audits','Public accounts','Central treasury'],
 storage:['Granaries','Dry storage','Stock records','Reserve management','Covered storehouses','Transport planning','Preservation','Distribution routes','Regional depots','Royal reserves'],
 fortification:['Earthworks','Stone foundations','Gate defenses','Watch systems','Curtain walls','Ditch works','Reinforced gates','Bastions','Fort surveys','Integrated defenses'],
 medicine:['Clean wells','Herbal remedies','Apothecary guilds','Care houses','Hospital wards','Food inspection','Sanitation','Quarantine procedures','Physician training','Public health offices'],
 administration:['Court records','Provincial registers','Estate surveys','Royal clerks','Tax registers','Local magistrates','Regular reports','Census offices','Provincial audits','Central chancery'],
 education:['Writing schools','Manuscripts','Libraries','Scholarly circles','Teaching licenses','Translation','University charters','Research patronage','Scholarly networks','Royal academy'],
 engineering:['Surveying','Road foundations','Stone bridges','Water engineering','Workshop tools','Crane design','Public works','Engineering schools','Infrastructure inspection','Royal works office']
};
export function technologyName(branch,rank){return TECHNOLOGY_NAMES[branch]?.[rank-1]||'Research rank '+rank;}
export const EFFECT_TEXT={food:'Realm food output',wood:'Timber production',stone:'Stone production',iron:'Iron production',tax:'Tax income',recruit:'Recruitment strength',military:'Military readiness',siege:'Campaign siege power',order:'Monthly public order',storage:'Construction reserve capacity',research:'Construction cost and research time',defense:'Garrison defense'};
