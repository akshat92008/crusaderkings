var cg=Object.freeze({genius:{id:"genius",name:"Genius",group:"intellect",positive:!0,stats:{diplomacy:2,martial:2,stewardship:2,intrigue:2,learning:2},prestigeMonthly:.5,pietyMonthly:.1,opinionMod:5},quick:{id:"quick",name:"Quick",group:"intellect",positive:!0,stats:{diplomacy:1,martial:1,stewardship:1,intrigue:1,learning:1},prestigeMonthly:.25,pietyMonthly:0,opinionMod:3},imbecile:{id:"imbecile",name:"Imbecile",group:"intellect",positive:!1,stats:{diplomacy:-2,martial:-2,stewardship:-2,intrigue:-2,learning:-2},prestigeMonthly:-.3,pietyMonthly:0,opinionMod:-15},strong:{id:"strong",name:"Strong",group:"physique",positive:!0,stats:{martial:2,diplomacy:1},prestigeMonthly:.3,pietyMonthly:0,opinionMod:5},weak:{id:"weak",name:"Weak",group:"physique",positive:!1,stats:{martial:-1},prestigeMonthly:-.1,pietyMonthly:0,opinionMod:-5},attractive:{id:"attractive",name:"Attractive",group:"beauty",positive:!0,stats:{diplomacy:2,intrigue:1},prestigeMonthly:.3,pietyMonthly:0,opinionMod:10},ugly:{id:"ugly",name:"Ugly",group:"beauty",positive:!1,stats:{diplomacy:-1},prestigeMonthly:-.1,pietyMonthly:0,opinionMod:-10},clubfooted:{id:"clubfooted",name:"Clubfooted",group:"limb",positive:!1,stats:{martial:-1},prestigeMonthly:-.05,pietyMonthly:0,opinionMod:-5},lisp:{id:"lisp",name:"Lisp",group:"speech",positive:!1,stats:{diplomacy:-1},prestigeMonthly:0,pietyMonthly:0,opinionMod:-5}}),ug=Object.freeze({struggle:{id:"struggle",name:"Struggle",skill:"martial",desc:"Martial drills, resilience, and tactical training."},thrift:{id:"thrift",name:"Thrift",skill:"stewardship",desc:"Estate accounts, commerce, and prudent administration."},humility:{id:"humility",name:"Humility",skill:"intrigue",desc:"Discretion, patience, and court observation."},etiquette:{id:"etiquette",name:"Etiquette",skill:"diplomacy",desc:"Court grace, persuasion, and noble bearing."},faith:{id:"faith",name:"Faith",skill:"learning",desc:"Scripture, scholarship, and moral discipline."}}),dg=Object.freeze({misguided_warrior:{id:"misguided_warrior",name:"Misguided Warrior",track:"martial",tier:1,stats:{martial:1},prestigeMonthly:.1,pietyMonthly:0,opinionMod:0},tough_soldier:{id:"tough_soldier",name:"Tough Soldier",track:"martial",tier:2,stats:{martial:2},prestigeMonthly:.2,pietyMonthly:0,opinionMod:2},skilled_tactician:{id:"skilled_tactician",name:"Skilled Tactician",track:"martial",tier:3,stats:{martial:3,diplomacy:1},prestigeMonthly:.35,pietyMonthly:0,opinionMod:4},brilliant_strategist:{id:"brilliant_strategist",name:"Brilliant Strategist",track:"martial",tier:4,stats:{martial:4,stewardship:1},prestigeMonthly:.6,pietyMonthly:0,opinionMod:6},indulgent_wastrel:{id:"indulgent_wastrel",name:"Indulgent Wastrel",track:"stewardship",tier:1,stats:{stewardship:1},prestigeMonthly:.05,pietyMonthly:0,opinionMod:0},thrifty_clerk:{id:"thrifty_clerk",name:"Thrifty Clerk",track:"stewardship",tier:2,stats:{stewardship:2},prestigeMonthly:.15,pietyMonthly:0,opinionMod:2},fortune_builder:{id:"fortune_builder",name:"Fortune Builder",track:"stewardship",tier:3,stats:{stewardship:3,diplomacy:1},prestigeMonthly:.3,pietyMonthly:0,opinionMod:4},midas_touched:{id:"midas_touched",name:"Midas Touched",track:"stewardship",tier:4,stats:{stewardship:4,learning:1},prestigeMonthly:.5,pietyMonthly:0,opinionMod:6},naive_appeaser:{id:"naive_appeaser",name:"Naive Appeaser",track:"diplomacy",tier:1,stats:{diplomacy:1},prestigeMonthly:.1,pietyMonthly:0,opinionMod:2},underhanded_rogue:{id:"underhanded_rogue",name:"Underhanded Rogue",track:"diplomacy",tier:2,stats:{diplomacy:2,intrigue:1},prestigeMonthly:.2,pietyMonthly:0,opinionMod:4},charismatic_negotiator:{id:"charismatic_negotiator",name:"Charismatic Negotiator",track:"diplomacy",tier:3,stats:{diplomacy:3},prestigeMonthly:.35,pietyMonthly:0,opinionMod:6},grey_eminence:{id:"grey_eminence",name:"Grey Eminence",track:"diplomacy",tier:4,stats:{diplomacy:4,intrigue:1},prestigeMonthly:.55,pietyMonthly:0,opinionMod:10},amateurish_plotter:{id:"amateurish_plotter",name:"Amateurish Plotter",track:"intrigue",tier:1,stats:{intrigue:1},prestigeMonthly:0,pietyMonthly:0,opinionMod:-2},flamboyant_schemer:{id:"flamboyant_schemer",name:"Flamboyant Schemer",track:"intrigue",tier:2,stats:{intrigue:2},prestigeMonthly:.1,pietyMonthly:0,opinionMod:0},intricate_webweaver:{id:"intricate_webweaver",name:"Intricate Webweaver",track:"intrigue",tier:3,stats:{intrigue:3,diplomacy:1},prestigeMonthly:.25,pietyMonthly:0,opinionMod:2},elusive_shadow:{id:"elusive_shadow",name:"Elusive Shadow",track:"intrigue",tier:4,stats:{intrigue:4,martial:1},prestigeMonthly:.4,pietyMonthly:0,opinionMod:4},detached_priest:{id:"detached_priest",name:"Detached Priest",track:"learning",tier:1,stats:{learning:1},prestigeMonthly:.05,pietyMonthly:.2,opinionMod:1},dutiful_cleric:{id:"dutiful_cleric",name:"Dutiful Cleric",track:"learning",tier:2,stats:{learning:2},prestigeMonthly:.1,pietyMonthly:.4,opinionMod:3},scholarly_theologian:{id:"scholarly_theologian",name:"Scholarly Theologian",track:"learning",tier:3,stats:{learning:3,diplomacy:1},prestigeMonthly:.2,pietyMonthly:.6,opinionMod:5},mastermind_theologian:{id:"mastermind_theologian",name:"Mastermind Theologian",track:"learning",tier:4,stats:{learning:4,stewardship:1},prestigeMonthly:.35,pietyMonthly:.9,opinionMod:8}});var hg=Object.freeze({tax:{name:"Tax-focused",tax:1.18,levy:.86,opinion:-4},balanced:{name:"Balanced",tax:1,levy:1,opinion:0},levy:{name:"Levy-focused",tax:.86,levy:1.18,opinion:-4}}),fg=Object.freeze({feudal:"feudalObligations",feudalObligations:"feudalObligations",city:"cityObligations",cityObligations:"cityObligations",temple:"templeObligations",templeObligations:"templeObligations"});var Uh=Object.freeze({seneschal:{id:"seneschal",name:"High Seneschal",prestigeMonthly:.4,opinionBonus:15,stewardshipBonus:1,desc:"Oversees the royal household and steward accounts."},cupbearer:{id:"cupbearer",name:"Royal Cupbearer",prestigeMonthly:.25,opinionBonus:12,diplomacyBonus:1,desc:"Trusted attendant at the sovereign table."},master_of_horse:{id:"master_of_horse",name:"Master of the Horse",prestigeMonthly:.35,opinionBonus:12,martialBonus:1,desc:"Commands the royal stables and cavalry retinue."},court_poet:{id:"court_poet",name:"Court Poet",prestigeMonthly:.5,opinionBonus:10,learningBonus:1,desc:"Celebrates the dynasty in verse and chronicle."},designated_regent:{id:"designated_regent",name:"Designated Regent",prestigeMonthly:.3,opinionBonus:18,regentPriority:!0,desc:"Named guardian of the realm during royal minority or incapacity."}});var pg=Object.freeze({hermetic_society:{id:"hermetic_society",name:"Hermetic Society",focus:"learning",ranks:["Neophyte","Mystic","Adept","Magus"],perks:{learning:2,stewardship:1,researchBonus:3},missions:["transmute_manuscript","celestial_horoscope"],desc:"Natural philosophers, alchemists, and astronomers advancing esoteric scholarship."},monastic_order:{id:"monastic_order",name:"Monastic Order",focus:"piety",ranks:["Oblate","Novice","Devoted Brother","Abbot Lay-Patron"],perks:{learning:1,diplomacy:1,pietyMonthly:1.5,vassalOpinion:6},missions:["copy_scripture","monastic_charity"],desc:"Pious spiritual brotherhood cultivating devotion, humility, and clerical goodwill."},warrior_lodge:{id:"warrior_lodge",name:"Warrior Lodge",focus:"martial",ranks:["Fledgling","Shieldbearer","Champion","Hero of the Lodge"],perks:{martial:2,combatPower:.12,moraleBonus:8,prestigeMonthly:1},missions:["lodge_duel","warband_drill"],desc:"Brotherhood of commanders sharpening martial prowess and battlefield valor."},assassins_order:{id:"assassins_order",name:"Order of Shadows",focus:"intrigue",ranks:["Initiate","Operative","Master of Daggers","Grandmaster"],perks:{intrigue:2,schemeBonus:12,discoveryAvoidance:8},missions:["shadow_network","covert_blackmail"],desc:"Clandestine society mastering espionage, covert networks, and silent elimination."}});var mg=Object.freeze({bloodline_charlemagne:{id:"bloodline_charlemagne",name:"Carolingian Legacy",realms:["france","burgundy","imperial"],historical:!0,prestigeMonthly:.5,pietyMonthly:.2,vassalOpinion:6,levyMod:.05,taxMod:.03},bloodline_plantagenet:{id:"bloodline_plantagenet",name:"Angevin Lionheart Line",realms:["england","scotland"],historical:!0,prestigeMonthly:.5,pietyMonthly:.1,vassalOpinion:5,levyMod:.06,taxMod:.02},bloodline_osman:{id:"bloodline_osman",name:"Gazi House of Osman",realms:["ottomans"],historical:!0,prestigeMonthly:.6,pietyMonthly:.3,vassalOpinion:7,levyMod:.08,taxMod:.03},bloodline_rurik:{id:"bloodline_rurik",name:"Varangian Line of Rurik",realms:["muscovy"],historical:!0,prestigeMonthly:.5,pietyMonthly:.1,vassalOpinion:6,levyMod:.04,taxMod:.05},bloodline_timur:{id:"bloodline_timur",name:"Timurid Conqueror Line",realms:["timurids"],historical:!0,prestigeMonthly:.6,pietyMonthly:.1,vassalOpinion:4,levyMod:.1,taxMod:0},bloodline_ming:{id:"bloodline_ming",name:"Mandate of Hongwu",realms:["ming"],historical:!0,prestigeMonthly:.5,pietyMonthly:.2,vassalOpinion:6,levyMod:.02,taxMod:.07},bloodline_solomon:{id:"bloodline_solomon",name:"Solomonic Dynasty",realms:["ethiopia"],historical:!0,prestigeMonthly:.4,pietyMonthly:.5,vassalOpinion:7,levyMod:.04,taxMod:.03},bloodline_inti:{id:"bloodline_inti",name:"Children of Inti",realms:["inca"],historical:!0,prestigeMonthly:.5,pietyMonthly:.4,vassalOpinion:7,levyMod:.05,taxMod:.04},bloodline_sangama:{id:"bloodline_sangama",name:"Vijayanagara Dharma Line",realms:["vijayanagara"],historical:!0,prestigeMonthly:.5,pietyMonthly:.3,vassalOpinion:6,levyMod:.04,taxMod:.05},bloodline_trastamara:{id:"bloodline_trastamara",name:"Reconquista Crown",realms:["castile","aragon"],historical:!0,prestigeMonthly:.45,pietyMonthly:.3,vassalOpinion:5,levyMod:.05,taxMod:.03},conqueror:{id:"conqueror",name:"Conqueror Bloodline",historical:!1,prestigeMonthly:.6,pietyMonthly:.1,vassalOpinion:5,levyMod:.08,taxMod:.02},architect:{id:"architect",name:"Great Builder Bloodline",historical:!1,prestigeMonthly:.45,pietyMonthly:.1,vassalOpinion:5,levyMod:.02,taxMod:.08},saint:{id:"saint",name:"Blessed Saintly Bloodline",historical:!1,prestigeMonthly:.35,pietyMonthly:.7,vassalOpinion:8,levyMod:.02,taxMod:.03},diplomat:{id:"diplomat",name:"Peaceweaver Bloodline",historical:!1,prestigeMonthly:.5,pietyMonthly:.2,vassalOpinion:10,levyMod:.02,taxMod:.04},philosopher:{id:"philosopher",name:"Scholarly Patron Bloodline",historical:!1,prestigeMonthly:.45,pietyMonthly:.3,vassalOpinion:6,levyMod:0,taxMod:.06}});var yg=Object.freeze({cathedral:{id:"cathedral",name:"Grand Cathedral",cost:400,stageCost:300,monthsPerStage:12,pietyMonthly:1,moralAuthority:4,unrest:-2,taxBonus:.05},grand_fortress:{id:"grand_fortress",name:"Grand Fortress",cost:420,stageCost:320,monthsPerStage:12,fortBonus:2,defenseBonus:.25,levyBonus:.12},university:{id:"university",name:"Great University",cost:400,stageCost:300,monthsPerStage:12,researchBonus:4,taxBonus:.06},royal_palace:{id:"royal_palace",name:"Royal Palace",cost:450,stageCost:350,monthsPerStage:12,prestigeMonthly:1.2,vassalOpinion:8,legitimacyMonthly:.3,taxBonus:.05}});var zh=Object.freeze({ashari:{id:"ashari",name:"Ash'ari Theology",system:"islamic",families:["Islam"],tax:0,levy:.04,morale:6,research:1,pietyMonthly:.25,desc:"Orthodox synthesis strengthening clerical authority and martial morale."},mutazili:{id:"mutazili",name:"Mu'tazili Rationalism",system:"islamic",families:["Islam"],tax:.06,levy:0,morale:0,research:4,pietyMonthly:.1,desc:"Rationalist scholarship boosting tax efficiency and research."},thomistic:{id:"thomistic",name:"Thomistic Scholasticism",system:"catholic",families:["Christianity"],tax:.05,levy:0,morale:2,research:3,pietyMonthly:.2,desc:"Scholastic theology elevating administration and scholarship."},franciscan:{id:"franciscan",name:"Franciscan Devotion",system:"catholic",families:["Christianity"],tax:0,levy:.04,morale:5,research:1,pietyMonthly:.35,desc:"Mendicant humility raising piety, trust, and army morale."},theravada:{id:"theravada",name:"Theravada Sangha",system:"dharmic",families:["Buddhism","Hindu traditions"],tax:.03,levy:.02,morale:4,research:2,pietyMonthly:.3,desc:"Monastic discipline sustaining realm harmony and scholarship."},mahayana:{id:"mahayana",name:"Mahayana Bodhisattva",system:"dharmic",families:["Buddhism","Hindu traditions","East Asian ritual traditions"],tax:.05,levy:.03,morale:3,research:3,pietyMonthly:.25,desc:"Universal merit elevating civic culture and trade."},advaita:{id:"advaita",name:"Advaita Vedanta",system:"dharmic",families:["Hindu traditions"],tax:.04,levy:0,morale:2,research:4,pietyMonthly:.25,desc:"Non-dual philosophy accelerating learning and patronage."},bhakti:{id:"bhakti",name:"Bhakti Devotion",system:"dharmic",families:["Hindu traditions","Buddhism"],tax:.02,levy:.06,morale:6,research:1,pietyMonthly:.3,desc:"Popular devotional movement strengthening levies and morale."}});var n1=Object.freeze(["assassinate","abduct","blackmail","fabricate_claim","seduce","sabotage","discredit","recruit_agent","support_claimant","gather_info","expose_corruption","counterespionage","protect_ruler","break_alliance"]);var Yh={england:"longbow",france:"chivalry",castile:"chivalry",burgundy:"chivalry",poland:"chivalry",imperial:"pike"};Object.assign(Yh,{ottomans:"janissary",mamluks:"chivalry",timurids:"steppe",qara:"steppe",horde:"steppe",ming:"gunpowder",joseon:"archery",ashikaga:"samurai",vijayanagara:"elephant",ayutthaya:"elephant",ethiopia:"highland",inca:"highland",pueblo:"highland",maori:"highland",mexica:"warrior",maya:"archery",muisca:"highland",mapuche:"warrior",tupi:"woodland",haudenosaunee:"woodland",aboriginal:"woodland",dai_viet:"river",bengal:"river",kilwa:"maritime",majapahit:"maritime",malacca:"maritime",portugal:"maritime",aragon:"maritime",novgorod:"maritime",gujarat:"maritime",fiji:"maritime",mali:"river",songhai:"river",kongo:"warrior",bahmani:"chivalry",delhi:"pike",morocco:"chivalry",muscovy:"pike",tunis:"maritime"});var j1=Object.freeze({feudal:{name:"Estate consent charter",desc:"Concede local autonomy for stronger levy obligations.",skill:"diplomacy",interest:"autonomy",cost:130,tax:.94,levy:1.1,trade:1},centralized:{name:"Royal inspection ordinance",desc:"Strengthen royal audits at the expense of local autonomy.",skill:"stewardship",interest:"central",cost:150,tax:1.1,levy:.97,trade:1},sultanate:{name:"Scholarly patronage covenant",desc:"Support scholarly and court institutions instead of military expenditure.",skill:"learning",interest:"court",cost:160,tax:.96,levy:1,trade:1.07},military:{name:"Service household charter",desc:"Bind elite households to military service with fiscal concessions.",skill:"martial",interest:"service",cost:145,tax:.93,levy:1.12,trade:1},imperial:{name:"Merit appointment ordinance",desc:"Reward qualified officeholders; reduce the influence of entrenched landed elites.",skill:"stewardship",interest:"merit",cost:170,tax:1.12,levy:.95,trade:1},republic:{name:"Merchant assembly charter",desc:"Give commercial households a stronger voice in return for trade investment.",skill:"stewardship",interest:"wealth",cost:175,tax:.96,levy:.96,trade:1.15},steppe:{name:"Seasonal grazing agreement",desc:"Reserve pasture for clan households and prioritize mobilization over tax collection.",skill:"martial",interest:"autonomy",cost:100,tax:.9,levy:1.12,trade:1},regional:{name:"Regional land-grant compact",desc:"Secure cooperation from local chiefs through durable land privileges.",skill:"diplomacy",interest:"autonomy",cost:140,tax:.95,levy:1.08,trade:1},shogunate:{name:"House service covenant",desc:"Exchange privileges for loyalty and military service from regional houses.",skill:"martial",interest:"service",cost:150,tax:.95,levy:1.12,trade:.98},tributary:{name:"Tribute arbitration charter",desc:"Favor negotiated external obligations and trade over direct mobilization.",skill:"diplomacy",interest:"court",cost:120,tax:1.03,levy:.95,trade:1.09},confederation:{name:"Member consent compact",desc:"Protect member autonomy in exchange for coordinated defense.",skill:"diplomacy",interest:"autonomy",cost:120,tax:.92,levy:1.1,trade:1},city:{name:"Guild representation ordinance",desc:"Give affluent urban households representation to encourage commercial growth.",skill:"stewardship",interest:"wealth",cost:135,tax:.97,levy:.96,trade:1.12},kinship:{name:"Communal stewardship pact",desc:"Favor collective reserves and local cooperation over direct revenue.",skill:"diplomacy",interest:"autonomy",cost:90,tax:.94,levy:1.07,trade:1}});var aw=Object.freeze(["catholic","orthodox","islamic","dharmic","traditional"]),ow=Object.freeze({latium:{name:"Apostolic See of Rome",faith:"Latin Christianity"},jerusalem:{name:"Holy City of Jerusalem",faith:"Latin Christianity"},thrace:{name:"Imperial Cathedral of Constantinople",faith:"Eastern Christianity"},hejaz:{name:"Sacred Sanctuary of Mecca",faith:"Sunni Islam"},benares:{name:"Sacred Ghats of Varanasi",faith:"Hindu traditions"},kyoto:{name:"Sacred Shrines of Kyoto",faith:"Buddhist and kami traditions"},cusco:{name:"Temple of the Sun at Cusco",faith:"Andean spiritual traditions"},lhasa:{name:"Potala Monastic Sanctuary",faith:"Tibetan Buddhism"}});var lw=Object.freeze({forced:{id:"forced",name:"Forced Inquisition",unrest:2,acceptance:-2,authority:2},tolerant:{id:"tolerant",name:"Regulated Tolerance",unrest:0,acceptance:1,authority:1},coexistence:{id:"coexistence",name:"Plural Coexistence",unrest:-1,acceptance:3,authority:0}});var sf={English:["Northwestern Europe","English"],Scottish:["Northwestern Europe","Scots","Scottish Gaelic"],Breton:["Northwestern Europe","Breton","French"],French:["Western Europe","French"],Burgundian:["Western Europe","French","Dutch"],Castilian:["Iberia","Castilian"],Portuguese:["Iberia","Portuguese"],"Aragonese-Catalan":["Iberia","Catalan","Aragonese"],"Central European":["Central Europe","German","Czech"],Scandinavian:["Northern Europe","Scandinavian languages"],Polish:["Central Europe","Polish"],Muscovite:["Eastern Europe","East Slavic languages"],Novgorodian:["Eastern Europe","East Slavic languages"],Ligurian:["Italian regions","Ligurian"],Venetian:["Italian regions","Venetian"],Cypriot:["Eastern Mediterranean","Greek"],Ottoman:["Anatolia","Ottoman Turkish"],"Mamluk-Egyptian":["Eastern Mediterranean","Arabic"],Timurid:["Central Asia","Persian","Chagatai"],Turkmen:["Central Asia","Turkic languages"],"Golden Horde":["Eurasian steppe","Turkic languages"],Chagatai:["Central Asia","Chagatai","Persian"],Oirat:["Inner Asia","Mongolic languages"],Maghrebi:["North Africa","Arabic","Amazigh languages"],Ethiopian:["Horn of Africa","Ethiopian regional languages"],Mande:["West Africa","Mande languages"],Songhai:["West Africa","Songhay languages"],Kongo:["Central Africa","Kongo languages"],Swahili:["East African coast","Swahili"],"South Indian":["South Asia","South Indian regional languages","Telugu","Kannada","Tamil"],Deccani:["South Asia","Deccan regional languages","Persian"],"North Indian":["South Asia","North Indian regional languages","Persian"],Bengali:["South Asia","Bengali"],Gujarati:["South Asia","Gujarati"],"Ming Chinese":["East Asia","Chinese languages"],Korean:["East Asia","Korean"],Japanese:["East Asia","Japanese"],Tibetan:["Himalayan regions","Tibetan"],Siamese:["Mainland Southeast Asia","Thai"],Lao:["Mainland Southeast Asia","Lao"],Vietnamese:["Mainland Southeast Asia","Vietnamese"],Javanese:["Maritime Southeast Asia","Javanese"],Malay:["Maritime Southeast Asia","Malay"],Sundanese:["Maritime Southeast Asia","Sundanese"],Nahua:["Mesoamerica","Nahuatl"],Maya:["Mesoamerica","Mayan languages"],"Pueblo communities":["North America","Pueblo regional languages"],Haudenosaunee:["North America","Iroquoian languages"],Andean:["Andean regions","Andean regional languages","Quechua","Aymara"],Muisca:["Northern Andes","Muysccubun"],"Tup\xED communities":["South America","Tupian languages"],Mapuche:["Southern Andes","Mapudungun"],M\u0101ori:["Polynesia","M\u0101ori"],Fijian:["Oceania","Fijian languages"],"Australian First Nations communities":["Australia","Local Australian languages"]},fw=Object.freeze(sf);var pw=Object.freeze({"Western Europe":[{id:"heavy_lancers",name:"Heavy Cavalry Lancers",desc:"Shock cavalry barding and lance drills.",cost:150,prestige:15,mod:{cavalryBonus:.15,levyMod:1.05}},{id:"cathedral_guilds",name:"Cathedral & Mason Guilds",desc:"Master stonecutters raise tax & prestige.",cost:150,prestige:15,mod:{taxMod:1.08,prestigeMonthly:.4}},{id:"chivalric_courts",name:"Chivalric Tournaments",desc:"Court pageantry steadies vassal loyalty.",cost:140,prestige:12,mod:{diplomacy:2,unrestReduction:2}}],"Anatolia / Mediterranean":[{id:"janissary_corps",name:"Elite Standing Infantry",desc:"Disciplined gunpowder-era guard regiments.",cost:160,prestige:15,mod:{levyMod:1.1,cavalryBonus:.06}},{id:"caravanserai_web",name:"Caravanserai Networks",desc:"Fortified road inns multiply caravan revenue.",cost:150,prestige:12,mod:{tradeMod:1.15,taxMod:1.05}},{id:"madrasa_astronomy",name:"Observatory & Madrasa Chairs",desc:"Endowed academies accelerate tech breakthroughs.",cost:140,prestige:12,mod:{researchBonus:2,diplomacy:1}}],"East Asia":[{id:"imperial_exams",name:"Imperial Civil Examinations",desc:"Meritocratic officials boost administration.",cost:150,prestige:15,mod:{taxMod:1.1,researchBonus:1}},{id:"gunpowder_rockets",name:"Fire-Lance & Rocket Batteries",desc:"Ordnance corps strengthen sieges and levies.",cost:160,prestige:15,mod:{levyMod:1.08,cavalryBonus:.08}},{id:"grand_canal",name:"Grand Canal Logistics",desc:"Barge networks enrich trade and calm provinces.",cost:150,prestige:12,mod:{tradeMod:1.14,unrestReduction:2}}],"South Asia":[{id:"monsoon_guilds",name:"Monsoon Merchant Guilds",desc:"Maritime syndicates dominate Indian Ocean trade.",cost:150,prestige:15,mod:{tradeMod:1.16,taxMod:1.06}},{id:"war_elephants",name:"Royal War Elephant Corps",desc:"Armored vanguard breaks enemy infantry lines.",cost:160,prestige:15,mod:{cavalryBonus:.16,levyMod:1.06}},{id:"temple_banking",name:"Temple Credit & Granaries",desc:"Endowed storehouses steady treasury and trust.",cost:140,prestige:12,mod:{taxMod:1.08,unrestReduction:2}}],"Central Asia / Steppe":[{id:"composite_bows",name:"Composite Bow Mastery",desc:"Horse archers strike with unmatched mobility.",cost:150,prestige:15,mod:{cavalryBonus:.2,levyMod:1.05}},{id:"yam_postal",name:"Yam Relay Postal Network",desc:"Fast imperial couriers speed diplomacy & tax.",cost:140,prestige:12,mod:{diplomacy:2,taxMod:1.06}},{id:"silk_escorts",name:"Steppe Caravan Escorts",desc:"Mounted guards protect trans-Eurasian trade.",cost:150,prestige:12,mod:{tradeMod:1.15}}],"Global Regional":[{id:"caravan_mastery",name:"Regional Caravan Mastery",desc:"Merchant networks thrive across arid and coastal routes.",cost:140,prestige:12,mod:{tradeMod:1.14,taxMod:1.05}},{id:"terrace_agronomy",name:"Terrace & Irrigation Works",desc:"High-yield terraces stabilize local harvests.",cost:140,prestige:12,mod:{taxMod:1.07,unrestReduction:3}},{id:"oral_chronicles",name:"Royal Herald & Chronicle Orders",desc:"Preserved lineages bolster diplomacy and prestige.",cost:140,prestige:12,mod:{diplomacy:2,researchBonus:1}}]});var af=Object.freeze({military_org:{name:"Military organization",desc:"Improves regional levy mobilization and army readiness."},construction:{name:"Construction techniques",desc:"Reduces building costs and speeds peacetime reconstruction."},agriculture:{name:"Agricultural practices",desc:"Improves rural grain yields and famine resilience."},trade:{name:"Commercial organization",desc:"Expands regional trade income and market turnover."},legal_admin:{name:"Legal administration",desc:"Strengthens tax collection and local order."},cultural_dev:{name:"Cultural development",desc:"Accelerates scholarship and community integration."},naval_tech:{name:"Maritime & naval craft",desc:"Improves coastal trade, ports and naval logistics."}}),Iw=Object.keys(af);var mf=[["granary_network","Economy","Secure the grain stores","Build two additional granary levels in districts controlled when the ambition begins.","granary",2,18],["irrigation_patron","Economy","Patron of irrigation","Build two additional irrigation levels in districts controlled when the ambition begins.","irrigation",2,18],["metalworking","Economy","Develop metalworking","Build two additional smithy levels in your starting controlled districts.","smithy",2,18],["textile_patron","Economy","Patron of weavers","Build two additional weaving workshop levels in your starting controlled districts.","loom",2,16],["medical_endowment","Economy","Improve public care","Build two additional infirmary levels in your starting controlled districts.","infirmary",2,18],["storage_network","Economy","Expand public storage","Build two additional warehouse levels in your starting controlled districts.","warehouse",2,16],["merchant_routes","Economy","Establish merchant routes","Maintain two more active merchant routes than at the start.","routes",2,18],["market_credit","Economy","Restore commercial confidence","Improve credit by 15, up to 100, while holding no outstanding debt.","credit",15,20],["repay_debt","Economy","Free the treasury from debt","Settle all active loans and defaulted arrears while holding 300 gold.","debt",0,20],["new_alliance","Diplomacy","Build an alliance network","Maintain two additional mutual alliances with living realms.","alliances",2,22],["peace_agreements","Diplomacy","Secure written peace","Maintain two additional active non-aggression agreements.","pacts",2,18],["protect_neighbors","Diplomacy","Become a regional guarantor","Maintain two additional active guarantees of other realms.","guarantees",2,20],["commercial_diplomacy","Diplomacy","Cultivate commercial diplomacy","Maintain two additional active bilateral trade pacts.","tradePacts",2,18],["trusted_neighbors","Diplomacy","Earn foreign confidence","Gain two additional foreign courts with mutual relations at least +60.","trusted",2,20],["end_wars","Diplomacy","Restore peace","End all current wars and regain at least 65 stability.","wars",0,22],["royal_audience","Court","Become an attentive sovereign","Improve court reputation by 15, up to 100.","reputation",15,18],["household_staff","Court","Build a capable household","Retain three additional qualified, salaried household officers.","offices",3,18],["court_collection","Court","Become a cultural patron","Complete two new cultural patronage projects.","collection",2,20],["artifact_treasury","Court","Create a royal treasury","Possess two additional intact artifacts.","artifacts",2,20],["court_splendor","Court","Establish a splendid household","Reach 65 court grandeur and increase it by at least 10.","grandeur",10,20],["dynastic_heritage","Family","Strengthen dynastic heritage","Unlock two additional dynasty legacy levels.","legacies",2,22],["mentor_children","Family","Educate the next generation","Improve the combined skills of children who were eligible at the start by four.","childSkills",4,20],["feast_host","Activities","Host a memorable feast","Complete a royal feast during this ambition with quality at least 55.","feast",1,14],["tournament_host","Activities","Host a renowned tournament","Complete a tournament with quality at least 65.","tournament",1,18],["pilgrim_ruler","Activities","Complete a sacred journey","Complete a pilgrimage during this ambition.","pilgrimage",1,16],["provincial_tour","Activities","Visit the provinces","Complete a provincial tour during this ambition.","tour",1,16],["summit_host","Activities","Receive a foreign delegation","Complete a diplomatic summit during this ambition.","summit",1,18],["scholar_gathering","Activities","Gather scholars","Complete a scholarly gathering during this ambition.","symposium",1,16],["religious_host","Activities","Convene religious institutions","Complete a religious assembly during this ambition.","assembly",1,16],["high_legitimacy","Government","Restore confidence in the crown","Increase legitimacy by 15, up to 100, and reach 70 stability.","legitimacy",15,20],["reduce_unrest","Government","Restore provincial order","Reduce average unrest by ten points while preserving controlled land.","unrest",10,18],["local_stewardship","Government","Strengthen local institutions","Raise average local trust by 15 points, up to 100.","trust",15,18],["estate_consent","Government","Reconcile landed estates","Raise average loyalty by 15 points, up to 100, while preserving landed estates.","loyalty",15,18],["regional_settlement","Government","Negotiate a regional settlement","Participate in a newly negotiated settlement of an active regional situation.","settlement",1,22],["counterintelligence","Intrigue","Expose a hostile network","Disrupt two discovered foreign schemes during this ambition.","disruptions",2,18]],iu=Object.fromEntries(mf.map(([r,e,t,i,n,s,a])=>[r,{category:e,name:t,desc:i,metric:n,amount:s,reward:a}]));var h_={...iu,linguist:{name:"Become multilingual",desc:"Learn two additional languages during this ambition.",reward:18},specialist:{name:"Master a specialization",desc:"Unlock three specialization ranks in any discipline.",reward:20},patron:{name:"Patron of the arts and ceremonies",desc:"Complete three additional royal activities during this ambition.",reward:22},sanctuaries:{name:"Support sacred institutions",desc:"Recognize two additional sanctuaries in controlled provinces.",reward:20},confidants:{name:"Establish an intelligence network",desc:"Retain three additional active intelligence contacts.",reward:17},prosperity:{name:"Prosperous reign",desc:"Accumulate 1500 gold and increase total development by 3.",reward:18},unity:{name:"United realm",desc:"Reach 75 stability and 70 average vassal loyalty.",reward:15},mastery:{name:"Master a discipline",desc:"Earn three lifestyle perks in one focus.",reward:14},legacy:{name:"Build a family legacy",desc:"Complete two royal activities during this reign.",reward:16},security:{name:"Secure the borders",desc:"Raise total fortification levels by two.",reward:16},friendship:{name:"Build trusted friendships",desc:"Gain two new adult court friendships during this ambition.",reward:18},innovation:{name:"Advance scholarship",desc:"Complete two new cultural innovations.",reward:20},reconciliation:{name:"Reconcile the realm",desc:"Raise average local acceptance by 10 points (up to 100) and reach 75 average local trust.",reward:18},institutions:{name:"Build institutions",desc:"Increase the total level of controlled religious institutions by three.",reward:18},resilience:{name:"Recover from hardship",desc:"Reduce ruler stress by at least 25 points and reach 70 stability. Requires at least 35 stress to begin.",reward:15}};var yf={europe:"england france castile portugal aragon burgundy imperial poland muscovy novgorod scotland brittany kalmar genoa venice cyprus",africa_asia:"ottomans mamluks timurids qara horde morocco ethiopia mali songhai kongo kilwa zayyanid oirats chagatai",eastern:"vijayanagara bahmani delhi bengal gujarat ming joseon ashikaga ayutthaya dai-viet majapahit malacca tibet lanxang sunda",americas:"mexica maya pueblo haudenosaunee inca muisca tupi mapuche maori fiji aboriginal"},bf={western:"england france castile portugal aragon burgundy imperial scotland brittany kalmar genoa venice",eastern:"poland muscovy novgorod cyprus",steppe:"horde oirats chagatai",ottoman:"ottomans mamluks morocco zayyanid",persian:"timurids qara",southindia:"vijayanagara bahmani",northindia:"delhi bengal gujarat",ming:"ming tibet",japan:"ashikaga joseon",southeast:"ayutthaya dai-viet majapahit malacca lanxang sunda",eastafrica:"ethiopia kilwa",westafrica:"mali songhai kongo",mesoamerica:"mexica maya",andean:"inca muisca"},b_=Object.fromEntries(Object.entries(yf).flatMap(([r,e])=>e.split(" ").map((t,i)=>[t,[r,i]]))),v_=Object.fromEntries(Object.entries(bf).flatMap(([r,e])=>e.split(" ").map(t=>[t,r])));var tu={castle:{name:"Castle",title:"Barony",role:"Baron",cost:140,skill:"martial",icon:"\u265C",description:"Each level above the county seat adds 5% to local levy contribution."},city:{name:"City",title:"Mayoralty",role:"Mayor",cost:180,skill:"stewardship",icon:"\u2696",description:"Each level adds 6% to local taxable contribution."},temple:{name:"Temple",title:"Bishopric",role:"Bishop",cost:160,skill:"learning",icon:"\u2726",description:"Each level strengthens community trust and local religious institutions."}};var R_=Object.keys(tu);var TS=Object.freeze(["boldness","compassion","greed","honor","zeal","sociability","diligence"]),AS=Object.freeze(["landed","commander","merchant","clergy","courtier"]),kS=Object.freeze(["personality","born","health","acquired","faith","culture"]),ES=Object.freeze({brave:{id:"brave",name:"Brave",category:"personality",opposite:"cautious",summary:"Leads from the front; gains stress when retreating.",mods:{martial:2,combat:12,opinion:4}},cautious:{id:"cautious",name:"Cautious",category:"personality",opposite:"brave",summary:"Avoids reckless risks; prefers fortified patience.",mods:{intrigue:1,stewardship:1,combat:-4}},coward:{id:"coward",name:"Coward",category:"personality",opposite:"brave",summary:"Fears the melee; suffers morale shock unless hardened by survival.",mods:{martial:-2,combat:-14,opinion:-6}},ambitious:{id:"ambitious",name:"Ambitious",category:"personality",opposite:"content",summary:"Restlessly seeks higher crowns, titles, and leverage.",mods:{diplomacy:1,martial:1,intrigue:1,opinion:-8}},content:{id:"content",name:"Content",category:"personality",opposite:"ambitious",summary:"Loyal and steady; resists sedition and faction schemes.",mods:{stewardship:1,opinion:10,stressMult:.8}},cruel:{id:"cruel",name:"Cruel",category:"personality",opposite:"kind",summary:"Rules by fear and harsh punishments; thrives on dread.",mods:{intrigue:2,martial:1,opinion:-14}},kind:{id:"kind",name:"Kind",category:"personality",opposite:"cruel",summary:"Merciful and beloved; gains heavy stress from executions or cruelty.",mods:{diplomacy:2,opinion:12}},paranoid:{id:"paranoid",name:"Paranoid",category:"personality",opposite:"trusting",summary:"Hard to assassinate, quick to suspect plots everywhere.",mods:{intrigue:2,opinion:-8,stressMult:1.25}},trusting:{id:"trusting",name:"Trusting",category:"personality",opposite:"paranoid",summary:"Wins goodwill easily, but vulnerable to court betrayal.",mods:{diplomacy:2,intrigue:-2,opinion:8}},lustful:{id:"lustful",name:"Lustful",category:"personality",opposite:"chaste",summary:"Higher fertility and court romance, higher scandal risk.",mods:{intrigue:1,opinion:-2}},chaste:{id:"chaste",name:"Chaste",category:"personality",opposite:"lustful",summary:"Respected by clergy; disciplined against court temptations.",mods:{learning:1,opinion:4}},gluttonous:{id:"gluttonous",name:"Gluttonous",category:"personality",opposite:"temperate",summary:"Indulges lavish banquets; relieves stress through feasts.",mods:{stewardship:-1,opinion:-4}},temperate:{id:"temperate",name:"Temperate",category:"personality",opposite:"gluttonous",summary:"Frugal and clear-headed in administration and health.",mods:{stewardship:2,learning:1,opinion:5}},proud:{id:"proud",name:"Proud",category:"personality",opposite:"humble",summary:"Commands royal aura; deeply offended by slights.",mods:{diplomacy:1,martial:1,opinion:-4}},humble:{id:"humble",name:"Humble",category:"personality",opposite:"proud",summary:"Wins devotion from clergy and commoners alike.",mods:{learning:1,opinion:8,stressMult:.85}},just:{id:"just",name:"Just",category:"personality",opposite:"arbitrary",summary:"Upholds law and charters; suffers stress from tyranny or bribery.",mods:{stewardship:2,diplomacy:1,opinion:10}},arbitrary:{id:"arbitrary",name:"Arbitrary",category:"personality",opposite:"just",summary:"Bends law to personal whim without losing sleep.",mods:{intrigue:2,opinion:-10}},generous:{id:"generous",name:"Generous",category:"personality",opposite:"greedy",summary:"Beloved patron; gains stress when imposing harsh taxes.",mods:{diplomacy:2,stewardship:-1,opinion:12}},greedy:{id:"greedy",name:"Greedy",category:"personality",opposite:"generous",summary:"Extracts maximum gold from estates and customs.",mods:{stewardship:2,opinion:-8}},honest:{id:"honest",name:"Honest",category:"personality",opposite:"deceitful",summary:"Trusted in treaties; stressed by schemes and blackmail.",mods:{diplomacy:2,intrigue:-2,opinion:8}},deceitful:{id:"deceitful",name:"Deceitful",category:"personality",opposite:"honest",summary:"Natural conspirator with strong scheme power.",mods:{intrigue:3,diplomacy:-1,opinion:-8}},patient:{id:"patient",name:"Patient",category:"personality",opposite:"wrathful",summary:"Measured strategist who endures long sieges and crises.",mods:{learning:1,stewardship:1,stressMult:.8}},wrathful:{id:"wrathful",name:"Wrathful",category:"personality",opposite:"patient",summary:"Fierce in battle, quick to retaliate against insults.",mods:{martial:2,combat:8,opinion:-8}},diligent:{id:"diligent",name:"Diligent",category:"personality",opposite:"indolent",summary:"Tireless administrator who develops provinces rapidly.",mods:{stewardship:2,learning:1,stressMult:1.15}},indolent:{id:"indolent",name:"Indolent",category:"personality",opposite:"diligent",summary:"Avoids strain and stress, at the cost of royal efficiency.",mods:{stewardship:-1,stressMult:.7}},gregarious:{id:"gregarious",name:"Gregarious",category:"personality",opposite:"reserved",summary:"Charms vassals and foreign envoys effortlessly.",mods:{diplomacy:2,opinion:10}},reserved:{id:"reserved",name:"Reserved",category:"personality",opposite:"gregarious",summary:"Guarded and private; shields secrets from court gossips.",mods:{intrigue:1,learning:1,opinion:-3}},genius:{id:"genius",name:"Genius",category:"born",opposite:"slow",summary:"Rare generational intellect excelling across every craft of rule.",mods:{diplomacy:3,martial:3,stewardship:3,intrigue:3,learning:3,opinion:6}},quick:{id:"quick",name:"Quick",category:"born",opposite:"slow",summary:"Sharp mind that masters administration and rhetoric rapidly.",mods:{diplomacy:2,stewardship:2,learning:2}},slow:{id:"slow",name:"Slow",category:"born",opposite:"genius",summary:"Struggles with complex statecraft and intrigues.",mods:{diplomacy:-2,stewardship:-2,learning:-2}},strong:{id:"strong",name:"Strong",category:"born",opposite:"weak",summary:"Mighty constitution in battle and illness.",mods:{martial:2,combat:12,opinion:4}},weak:{id:"weak",name:"Weak",category:"born",opposite:"strong",summary:"Frail frame; vulnerable to wounds and camp fevers.",mods:{martial:-2,combat:-10}},beautiful:{id:"beautiful",name:"Beautiful",category:"born",opposite:"ugly",summary:"Commanding presence that sways courts and suitors.",mods:{diplomacy:3,opinion:10}},ugly:{id:"ugly",name:"Ugly",category:"born",opposite:"beautiful",summary:"Faces unfair court prejudice, yet often sharpens resolve.",mods:{diplomacy:-1,opinion:-8}},giant:{id:"giant",name:"Giant",category:"born",opposite:"dwarf",summary:"Towering stature inspiring dread on the battlefield.",mods:{martial:3,combat:15,opinion:-2}},dwarf:{id:"dwarf",name:"Dwarf",category:"born",opposite:"giant",summary:"Short stature often underestimated by rival lords.",mods:{intrigue:1,learning:1,opinion:-4}},ill:{id:"ill",name:"Ill",category:"health",summary:"Weakened by fever or sickness; reduced court vigor.",mods:{martial:-1,stewardship:-1,combat:-8}},drunkard:{id:"drunkard",name:"Drunkard",category:"health",summary:"Coping mechanism from stress; dulls judgment and stewardship.",mods:{stewardship:-2,diplomacy:-1,stressMult:.85}},insomniac:{id:"insomniac",name:"Insomniac",category:"health",summary:"Haunted nights slow recovery and sharpen paranoia.",mods:{learning:1,stewardship:-1,stressMult:1.2}},robust:{id:"robust",name:"Robust",category:"health",summary:"Hearty vitality that shrugs off campaigns and winter.",mods:{martial:1,combat:6}},infirm:{id:"infirm",name:"Infirm",category:"health",summary:"Age and frailty limit personal command; invites regency.",mods:{martial:-3,diplomacy:-1,stewardship:-2}},"one-eyed":{id:"one-eyed",name:"One-Eyed",category:"health",summary:"Lost an eye in war; feared and respected by veterans.",mods:{martial:1,intrigue:1,combat:4}},wounded:{id:"wounded",name:"Wounded",category:"health",summary:"Carries a serious battle wound impairing martial command for months.",mods:{martial:-2,combat:-14}},"plague-scarred":{id:"plague-scarred",name:"Plague-Scarred",category:"health",summary:"Survived pestilence with hardened immunity and grim resolve.",mods:{learning:1,opinion:-2}},scarred:{id:"scarred",name:"Scarred",category:"acquired",summary:"Bears honorable marks of past battles.",mods:{martial:1,opinion:4,combat:5}},"battle-hardened":{id:"battle-hardened",name:"Battle-Hardened",category:"acquired",summary:"Forged in real combat; immune to panic on the field.",mods:{martial:2,combat:14,stressMult:.85}},inspired:{id:"inspired",name:"Inspired",category:"acquired",summary:"Seized by visionary clarity in statecraft and culture.",mods:{learning:2,diplomacy:2,stewardship:1}},broken:{id:"broken",name:"Broken",category:"acquired",summary:"Shattered by extreme stress; struggles to project royal authority.",mods:{diplomacy:-2,martial:-2,stewardship:-2,opinion:-10}},reclusive:{id:"reclusive",name:"Reclusive",category:"acquired",summary:"Withdrew from court crowds to cope with pressure.",mods:{diplomacy:-2,learning:1,stressMult:.8}},flagellant:{id:"flagellant",name:"Flagellant",category:"acquired",summary:"Endures harsh penance to purge stress and sin.",mods:{learning:1,opinion:2,stressMult:.8}},strategist:{id:"strategist",name:"Strategist",category:"acquired",summary:"Master of flank timing, supply lines, and decisive terrain.",mods:{martial:3,combat:15}},duelist:{id:"duelist",name:"Duelist",category:"acquired",summary:"Deadly in personal combat and tourney lists.",mods:{martial:2,combat:12}},architect:{id:"architect",name:"Architect",category:"acquired",summary:"Transforms provincial capitals and fortifications.",mods:{stewardship:3}},poet:{id:"poet",name:"Poet",category:"acquired",summary:"Composes verses remembered across royal courts.",mods:{diplomacy:2,learning:1,opinion:6}},"master-schemer":{id:"master-schemer",name:"Master Schemer",category:"acquired",summary:"Weaves webs of hooks, informants, and blackmail.",mods:{intrigue:3}},zealous:{id:"zealous",name:"Zealous",category:"faith",opposite:"cynical",summary:"Fiercely defends orthodoxy; demands holy wars and conversion.",mods:{martial:1,learning:1,opinion:4}},cynical:{id:"cynical",name:"Cynical",category:"faith",opposite:"zealous",summary:"Questions clerical authority; favors pragmatic intrigue.",mods:{intrigue:2,learning:1,opinion:-4}},devoted:{id:"devoted",name:"Devoted",category:"faith",summary:"Known for pious charity and shrine patronage.",mods:{learning:2,opinion:8}},heretical:{id:"heretical",name:"Heretical",category:"faith",summary:"Embraces heterodox teachings rejected by the orthodoxy.",mods:{learning:1,opinion:-16}},excommunicated:{id:"excommunicated",name:"Excommunicated",category:"faith",summary:"Cast out by religious authorities; rival realms gain holy CB.",mods:{diplomacy:-3,opinion:-25}},"pillar-of-faith":{id:"pillar-of-faith",name:"Pillar of Faith",category:"faith",summary:"Revered champion of temples, pilgrimages, and sacred sites.",mods:{diplomacy:2,learning:2,opinion:12}},cultured:{id:"cultured",name:"Cultured",category:"culture",summary:"Patron of manuscripts, music, and courtly refinement.",mods:{diplomacy:2,learning:1,opinion:6}},polyglot:{id:"polyglot",name:"Polyglot",category:"culture",summary:"Speaks multiple court languages; excels at foreign diplomacy.",mods:{diplomacy:3,opinion:8}},cosmopolitan:{id:"cosmopolitan",name:"Cosmopolitan",category:"culture",summary:"Welcomes diverse traditions and accelerates cultural fusion.",mods:{diplomacy:2,stewardship:1,opinion:6}},traditionalist:{id:"traditionalist",name:"Traditionalist",category:"culture",summary:"Guards ancestral customs; boosts native vassal loyalty.",mods:{stewardship:1,opinion:4}},francophile:{id:"francophile",name:"Culture-Admirer",category:"culture",summary:"Fascinated by foreign court etiquette and arts.",mods:{diplomacy:1,learning:1,opinion:4}},"scholar-king":{id:"scholar-king",name:"Scholar-King",category:"culture",summary:"Unites royal rule with deep classical learning.",mods:{learning:3,stewardship:1,opinion:8}}});var CS=Object.freeze({old_age:"Died of old age",battle:"Fell in battle",assassinated:"Assassinated",plague:"Died of plague",executed:"Executed by decree",stress_collapse:"Collapsed from severe stress",illness:"Died of grave illness"});var Ef=[["farm","Farmstead",1,180,"food","farmhouse_barn"],["house","Housing",1,100,"food","thatched_cottage"],["well","Well",1,80,"food","stone_well"],["lumber","Lumber camp",1,120,"wood","lumber_shed"],["granary","Granary",2,140,"storage","granary_staddle"],["quarry","Stone quarry",2,150,"stone","lumber_shed"],["market","Market hall",2,260,"tax","market_stall"],["bakery","Bakery",2,140,"food","bakery"],["barracks","Barracks",3,320,"recruit","barracks"],["iron","Iron mine",3,210,"iron","blacksmith_forge"],["forge","Blacksmith",3,220,"military","blacksmith"],["chapel","Community sanctuary",3,160,"order","stone_chapel"],["archery","Archery range",4,280,"military","archery_range"],["mill","Windmill",4,210,"food","windmill"],["tavern","Tavern",4,140,"order","tavern_inn"],["warehouse","Warehouse",4,200,"storage","granary_staddle"],["stable","Stable",5,300,"recruit","stable"],["fort","Fortification",1,440,"defense","castle"],["watchtower","Watchtower",5,220,"defense","watchtower"],["gatehouse","Gatehouse",5,280,"defense","gatehouse"],["watermill","Watermill",6,280,"food","watermill"],["goldmine","Gold mine",6,360,"tax","blacksmith_forge"],["tradehall","Trade hall",6,340,"tax","market_stall"],["apothecary","Apothecary",6,240,"order","apothecary"],["workshop","Siege workshop",7,420,"siege","blacksmith_forge"],["school","School",7,280,"research","longhouse"],["library","Library",7,330,"research","timber_frame_house"],["university","University",7,480,"research","longhouse"],["academy","Military academy",8,500,"recruit","barracks"],["foundry","Foundry",8,480,"iron","blacksmith"],["armory","Armory",8,390,"military","barracks"],["palace","Royal palace",8,650,"tax","castle"],["bank","Counting house",9,600,"tax","timber_frame_house"],["hospital","Hospital",9,450,"order","apothecary"],["guild","Guild hall",9,430,"tax","longhouse"],["reservoir","Reservoir",9,440,"food","stone_well"],["arsenal","Royal arsenal",10,720,"siege","barracks"],["mint","Royal mint",10,700,"tax","blacksmith"],["citadel","Citadel",10,850,"defense","castle"],["archives","Royal archives",10,620,"research","longhouse"]],ST=Object.fromEntries(Ef.map(([r,e,t,i,n,s])=>[r,{id:r,name:e,unlock:t,cost:i,effect:n,art:s}]));var Cf=[["farming","Agriculture","farm","food"],["irrigation","Irrigation","well","food"],["milling","Food processing","mill","food"],["forestry","Forestry","lumber","wood"],["masonry","Masonry","quarry","stone"],["mining","Iron extraction","iron","iron"],["metallurgy","Metalworking","forge","military"],["infantry","Infantry doctrine","barracks","recruit"],["archery","Archery training","archery","military"],["cavalry","Mounted warfare","stable","recruit"],["siege","Siege engineering","workshop","siege"],["gunpowder","Gunpowder engineering","foundry","military"],["trade","Commerce","market","tax"],["finance","Royal finance","tradehall","tax"],["storage","Storage logistics","granary","storage"],["fortification","Defensive engineering","fort","defense"],["medicine","Medicine","apothecary","order"],["administration","Administration","palace","tax"],["education","Scholarship","school","research"],["engineering","Civil engineering","watermill","research"]],TT=Object.fromEntries(Cf.map(([r,e,t,i])=>[r,{id:r,name:e,building:t,effect:i}]));var Rf=(r,e,t)=>Math.max(e,Math.min(t,r));function nu(r){let e=String(r||"plains").toLowerCase();return e==="highlands"?"hills":e==="mountains"?"mountain":e}function ai(r,e,t="plains"){if(!Number.isFinite(r)||!Number.isFinite(e))return 0;let i=nu(t);if(i==="hills"){let n=2.15*Math.exp(-((r-18)**2/340+(e+8)**2/260)),s=1.9*Math.exp(-((r+20)**2/360+(e-6)**2/280)),a=1.4*Math.exp(-(r**2/460+(e+20)**2/220));return n+s+a+.42*Math.sin(r*.055)*Math.cos(e*.055)}if(i==="mountain"){let n=3.65*Math.exp(-((r-22)**2/320+(e+6)**2/260)),s=3.45*Math.exp(-((r+22)**2/320+(e-6)**2/260)),a=2.25*Math.exp(-(r**2/380+(e+22)**2/240));return n+s+a+.72*Math.sin(r*.07)*Math.cos(e*.06)}if(i==="forest"){let n=.55*Math.exp(-(((r+25)**2+(e-2)**2)/360)),s=.5*Math.exp(-(((r-25)**2+(e+2)**2)/360));return n+s+.48*Math.sin(r*.05)*Math.cos(e*.05)}if(i==="desert"){let n=.85*Math.sin(r*.065+e*.035)+.45*Math.cos(e*.055-r*.025),s=.95*Math.exp(-(((r-24)**2+(e+10)**2)/400));return n+s}if(i==="coastal"){let n=1.65*Math.exp(-((r+18)**2/420+(e+8)**2/420)),s=Rf((14-r)*.032,-.35,1.4);return n+s+.24*Math.sin(r*.06)*Math.cos(e*.06)}if(i==="marsh")return .18*Math.sin(r*.08)*Math.cos(e*.08)-.1;if(i==="river"){let n=Math.min(1,Math.abs(e)/8);return(Math.abs(e)<4.5?-.42*Math.cos(e/4.5*(Math.PI/2)):0)+n*.48+.16*Math.sin(r*.05)*Math.cos(e*.05)}return .28*Math.sin(r*.045)*Math.cos(e*.055)+.14*Math.cos((r-e)*.03)}function Nr(r="plains"){let e=nu(r);return e==="forest"?[{id:"west_woods",x:-25,z:2,radius:10.5,density:1,label:"Western Woods"},{id:"east_woods",x:25,z:-2,radius:10.5,density:1,label:"Eastern Woods"},{id:"north_copse",x:-14,z:-16,radius:8.5,density:.9,label:"Northern Copse"},{id:"south_copse",x:14,z:16,radius:8.5,density:.9,label:"Southern Copse"},{id:"central_thicket",x:0,z:0,radius:7.5,density:.85,label:"Heartwood Thicket"}]:e==="hills"?[{id:"west_copse",x:-28,z:8,radius:8.5,density:.8,label:"Highland Copse"},{id:"east_copse",x:28,z:-8,radius:8.5,density:.8,label:"Ridge Wood"},{id:"glen_wood",x:-10,z:-18,radius:7,density:.75,label:"Glen Wood"}]:e==="mountain"?[{id:"alpine_west",x:-30,z:10,radius:7.5,density:.7,label:"Alpine Pines"},{id:"alpine_east",x:32,z:-10,radius:7.5,density:.7,label:"Crag Pines"}]:e==="coastal"?[{id:"dune_pines",x:-26,z:-6,radius:7.5,density:.75,label:"Coastal Pines"},{id:"cove_wood",x:22,z:12,radius:7,density:.75,label:"Cove Wood"}]:e==="desert"?[{id:"oasis_palms",x:-28,z:8,radius:6.8,density:.65,label:"Oasis Grove"}]:e==="marsh"?[{id:"fen_willows_w",x:-22,z:-4,radius:8,density:.8,label:"Fen Willows"},{id:"fen_willows_e",x:22,z:6,radius:8,density:.8,label:"Reed Thicket"},{id:"bog_grove",x:0,z:12,radius:6.5,density:.7,label:"Bog Copse"}]:e==="river"?[{id:"river_willows_w",x:-30,z:-12,radius:7.5,density:.78,label:"Riverbank Willows"},{id:"river_willows_e",x:30,z:12,radius:7.5,density:.78,label:"Fordside Alders"}]:[{id:"flank_west",x:-34,z:4,radius:7.5,density:.75,label:"West Copse"},{id:"flank_east",x:34,z:-4,radius:7.5,density:.75,label:"East Copse"}]}var ru={india:{friendly:10212060,enemy:14586218,cavalry:[.93,.66,.24],archers:[.85,.71,.42],infantry:[.76,.66,.52]},east_asia:{friendly:9421784,enemy:14056552,cavalry:[.88,.56,.3],archers:[.78,.74,.48],infantry:[.64,.72,.68]},persia:{friendly:8833214,enemy:14457448,cavalry:[.8,.72,.36],archers:[.72,.78,.6],infantry:[.58,.72,.7]},europe:{friendly:9226201,enemy:14260094,cavalry:[.86,.68,.34],archers:[.81,.75,.57],infantry:[.68,.72,.73]}};function If(r,e,t="europe"){let i=r==="attacker",n=ru[t]||ru.europe;return{tint:i?n.friendly:n.enemy,cloth:i?[.24,.56,.7]:[.65,.27,.2],banner:i?[.3,.65,.85]:[.88,.36,.24],accent:e==="cavalry"?n.cavalry:e==="archers"?n.archers:n.infantry}}function su(r,e){let t=r.groups.get(e.id);if(!t)return;r.fieldMaterials??=new Map;let i=e.regionalFamily||"europe",n=If(e.side,e.type,i),s=e.side+":"+e.type+":"+i;r.fieldMaterials.has(s)||r.fieldMaterials.set(s,new Map);let a=r.fieldMaterials.get(s),o=l=>{if(!l?.clone||!l.color)return l;if(a.has(l))return a.get(l);let c=l.clone();if(c.color?.clone&&c.color?.lerp){let d=c.color.clone().setHex(n.tint);c.color.lerp(d,.3)}return a.set(l,c),c};for(let l of t)if(!l.fieldStyled&&(l.fieldStyled=!0,l.rig?.traverse?.(c=>{c.isMesh&&c.material&&(c.material=Array.isArray(c.material)?c.material.map(o):o(c.material))}),l.current&&Number.isFinite(l.current.time)&&l.current.getClip)){let c=l.current.getClip().duration;c>0&&(l.current.time=(l.phase||0)%c)}}function au(r){for(let e of r.fieldMaterials?.values()||[])for(let t of e.values())t.dispose?.();r.fieldMaterials?.clear()}function ou(r,e,t){let i=t?13:8,n=t?.57:.32,s=r*i+e;return{bob:Math.abs(Math.sin(s))*(t?.09:.045),legs:[0,Math.PI,Math.PI*.7,Math.PI*1.7].map(a=>Math.sin(s+a)*n)}}function lu(r){let e=r?.group;if(!e)return!1;for(let t of e.children||[])t.name!=="Illustrated battlefield ground"&&(t.visible=!1);return!0}var Ls={desert:{sky:13153434,fog:.005,exposure:1.2,hemiSky:16770236,hemiGround:7887931,sun:16766625,sunIntensity:2.15,hemiIntensity:1.65},steppe:{sky:12893346,fog:.0044,exposure:1.18,hemiSky:16050377,hemiGround:6970429,sun:16769710,sunIntensity:2.1,hemiIntensity:1.62},forest:{sky:9018514,fog:.0052,exposure:1.14,hemiSky:13623510,hemiGround:3885361,sun:16243876,sunIntensity:1.95,hemiIntensity:1.7},hills:{sky:10267050,fog:.0044,exposure:1.18,hemiSky:14345963,hemiGround:5330756,sun:16770232,sunIntensity:2.12,hemiIntensity:1.65},mountain:{sky:10924728,fog:.0054,exposure:1.16,hemiSky:14937330,hemiGround:5592915,sun:16772040,sunIntensity:2.15,hemiIntensity:1.68},coastal:{sky:10072509,fog:.004,exposure:1.2,hemiSky:14676215,hemiGround:5004620,sun:16770488,sunIntensity:2.15,hemiIntensity:1.66},marsh:{sky:8950922,fog:.0062,exposure:1.1,hemiSky:13161674,hemiGround:3949364,sun:15456170,sunIntensity:1.85,hemiIntensity:1.62},plains:{sky:10201505,fog:.0042,exposure:1.18,hemiSky:14280420,hemiGround:5067833,sun:16768937,sunIntensity:2.1,hemiIntensity:1.65}};function Pf(r){let e=String(r||"plains").toLowerCase();return Ls[e]||(e==="highlands"?Ls.hills:e==="mountains"?Ls.mountain:Ls.plains)}function cu(r,e,t){let i=Pf(t);r.background?.setHex(i.sky),r.fog&&(r.fog.color?.setHex(i.sky),r.fog.density=i.fog),e.toneMappingExposure=i.exposure;for(let n of r.children||[])n.isHemisphereLight?(n.color.setHex(i.hemiSky),n.groundColor.setHex(i.hemiGround),n.intensity=i.hemiIntensity):n.isDirectionalLight&&(n.color.setHex(i.sun),n.intensity=i.sunIntensity);return i}function uu(r,e="infantry",t="medium",i=!1,n=!1){let s=Math.max(0,Number(r)||0);if(n)return i||t==="low"?2:t==="high"?4:3;let a=i?"low":t,o=e==="archers"?8:e==="cavalry"?6:11,l=s>=350?1.25:s>=180?1.08:s<=45?.72:1,c=a==="low"?.6:a==="high"?1.25:1;return Math.max(e==="cavalry"?3:4,Math.min(a==="low"?e==="cavalry"?4:7:a==="high"?e==="cavalry"?9:14:e==="cavalry"?7:11,Math.round(o*l*c)))}function du(r,e="medium",t=!1){let i=Number.isFinite(r)?Math.max(0,r):0;return t||e==="low"?i>75?1/10:i>42?1/18:1/30:e==="high"?i>95?1/20:i>60?1/30:0:i>82?1/15:i>48?1/24:0}function hu(r=60){let e=Math.max(8,Math.floor(r)),t=new Float64Array(e),i=0,n=0,s=0;return{record(a){let o=Math.max(0,Number(a)||0);n<e?(t[i]=o,s+=o,n++):(s+=o-t[i],t[i]=o),i=(i+1)%e},samples(){return n},averageMs(){return n?s/n:0},fps(){let a=n?s/n:0;return a>.001?1e3/a:0},p95Ms(){if(!n)return 0;let a=Array.from(t.subarray(0,n)).sort((o,l)=>o-l);return a[Math.min(a.length-1,Math.floor(a.length*.95))]},sample(a){return this.record(a)},snapshot(){return{samples:this.samples(),avgMs:this.averageMs(),fps:this.fps(),p95Ms:this.p95Ms()}},overBudgetRatio(a=16.7){if(!n)return 0;let o=0;for(let l=0;l<n;l++)t[l]>a&&o++;return o/n},reset(){t.fill(0),i=0,n=0,s=0}}}var Of=["map","normalMap","roughnessMap","metalnessMap","emissiveMap","aoMap","alphaMap","bumpMap","specularMap"];function vi(r,e=null){if(!r)return{geometries:0,materials:0,textures:0};let t=new Set,i=new Set,n=new Set,s=o=>{if(!(!o||i.has(o)||e?.has(o))){i.add(o);for(let l of Of){let c=o[l];c&&!n.has(c)&&!e?.has(c)&&(n.add(c),c.dispose?.())}o.dispose?.()}},a=o=>{if(o){if(o.geometry&&!t.has(o.geometry)&&!e?.has(o.geometry)&&(t.add(o.geometry),o.geometry.dispose?.()),o.material)if(Array.isArray(o.material))for(let l of o.material)s(l);else s(o.material);if(Array.isArray(o.children))for(let l of o.children)a(l)}};return typeof r.traverse=="function"?r.traverse(a):a(r),{geometries:t.size,materials:i.size,textures:n.size}}var fu=(r,e,t)=>Math.max(e,Math.min(t,r));function Lf(r,e,t="infantry"){let i=Math.max(0,Math.floor(r)),n=t==="cavalry"?1.65:t==="archers"?1.12:.94,s=[],a=e==="pike_square"||e==="square"?Math.ceil(Math.sqrt(i)):Math.min(e==="shield_wall"?7:e==="longbow_line"||e==="volley_line"||e==="line"?9:e==="column"?3:e==="skirmish"||e==="loose"?5:6,i);for(let l=0;l<i;l++){let c=0,d=0;if(e==="cavalry_wedge"||e==="elephant_push"){let u=Math.floor(Math.sqrt(l)),h=u*u;c=(l-h-u)*n,d=-u*n*1.15}else if(e==="encirclement"||e==="ambush"){let u=(l/Math.max(1,i-1)-.5)*Math.PI*1.15;c=Math.sin(u)*n*Math.max(2,i/5),d=Math.cos(u)*n*2.1}else if(e==="flank"){let u=l%2?1:-1,h=Math.floor(l/2);c=u*n*(2+h%2),d=-Math.floor(h/2)*n}else{let u=Math.floor(l/Math.max(1,a)),h=l%Math.max(1,a),m=Math.min(a,i-u*a);c=(h-(m-1)/2)*n*(e==="skirmish"||e==="loose"?1.5:1),d=-u*n*(e==="shield_wall"?.76:e==="skirmish"||e==="loose"?1.45:e==="column"?1.25:1)}s.push([c,d])}if(!i)return s;let o=s.reduce((l,c)=>[l[0]+c[0]/i,l[1]+c[1]/i],[0,0]);return s.map(l=>[l[0]-o[0],l[1]-o[1]])}function Nf(r){let e=r.facingX??0,t=r.facingZ??(r.side==="attacker"?-1:1);return Math.atan2(e,t)}function Ff(r,e,t=null){let i=Nf(r),n=Math.cos(i),s=Math.sin(i),a=r.routed?Math.min(5,r.routAge||0)*2.4:0,o=r.x+e[0]*n+e[1]*s-(r.homeDirection?0:Math.sin(i)*a),l=r.z-e[0]*s+e[1]*n+(r.homeDirection?r.homeDirection*a:-Math.cos(i)*a),c=t?ai(o,l,t):0;return{x:o,y:c,z:l,yaw:r.routed?r.homeDirection?r.homeDirection>0?0:Math.PI:i+Math.PI:i}}function Df(r){return r.routed?"walk":(r.attackPulse||0)>0?"attack":r.moving?"walk":"idle"}function Uo(r){return r?(r.life??100)<=0&&!r.routed?"death":(r.rallyBuffTimer||0)>6.5&&!r.moving&&(r.attackPulse||0)<=0?"rally":(r.attackPulse||0)>0?"attack":r.routed||r.fieldOrder==="charge"||r.status==="charging"||(r.chargeMomentum||0)>=.45?"run":r.moving?"walk":"idle":"idle"}function Bf(r,e){if(r.routed&&(r.routAge||0)>=3||r.life<=0||r.troopCount===0)return 0;let t=Number.isFinite(r.troopCount)?Math.min(e,Math.max(0,Math.ceil(r.troopCount))):e;return Math.min(t,Math.max(1,Math.ceil(t*fu(r.life/Math.max(1,r.initialLife||100),0,1))))}function Uf(r,e,t){return r+Math.atan2(Math.sin(e-r),Math.cos(e-r))*t}function pu(r,e,t){if(!r.modelsReady)return;let i=r.terrainType||e?.[0]?.terrainType||null,n=r.camera?.position||null;for(let s of e||[]){if(s.troopCount===0||s.routed&&(s.routAge||0)>=3){for(let b of r.groups.get(s.id)||[])b.root.visible=!1;continue}r.prepareSquad(s),su(r,s);let a=r.groups.get(s.id);if(!a)continue;let o=Bf(s,a.length),l=o+":"+s.formationId+":"+s.type;s.visualLayout?.key!==l&&(s.visualLayout={key:l,offsets:Lf(o,s.formationId,s.type)});let c=s.visualLayout.offsets,d=Df(s),u=Uo(s),h=1-Math.exp(-Math.max(0,t)*14),m=n?Math.hypot((s.x||0)-n.x,(s.z||0)-n.z):0,y=du(m,r.graphicsQuality||"medium",!!r.isSoftwareGl);for(let b=0;b<a.length;b++){let p=a[b];if(b>=o){if(p.wasAlive&&!s.routed&&p.actions?.death&&(p.dyingTimer||0)<1.15){p.root.visible=!0,p.dyingStarted||(p.dyingStarted=!0,p.dyingTimer=0,p.actions.death.reset().fadeIn(.08).play(),p.current&&p.current!==p.actions.death&&p.current.fadeOut(.08),p.current=p.actions.death,p.clipState="death"),p.dyingTimer=(p.dyingTimer||0)+Math.max(0,t),t>0&&p.mixer.update(t);continue}p.root.visible=!1;continue}p.wasAlive=!0,p.dyingStarted=!1,p.dyingTimer=0,p.root.visible=!0;let f=Ff(s,c[b],i);!p.fieldReady||p.fieldRevision!==s.deploymentRevision?(p.root.position.set(f.x,f.y,f.z),p.root.rotation.y=f.yaw,p.fieldReady=!0,p.fieldRevision=s.deploymentRevision):(p.root.position.set(p.root.position.x+(f.x-p.root.position.x)*h,f.y,p.root.position.z+(f.z-p.root.position.z)*h),p.root.rotation.y=Uf(p.root.rotation.y,f.yaw,h));let x=u==="run";if(p.mount){let g=ou(p.mixer.time,p.phase||0,x||s.fieldOrder==="charge");for(let v=0;v<p.mount.legs.length;v++)p.mount.legs[v].rotation.x=d==="walk"||x?g.legs[v%4]:0;p.root.position.y=f.y+(d==="walk"||x?g.bob:0)}if(u!==p.clipState||d!==p.mode||d==="attack"&&p.attackSerial!==s.attackSerial){let g=p.actions[u]||(u==="run"?p.actions.walk:null)||(u==="rally"?p.actions.idle:null)||p.actions[d]||(p.regionalModel&&d==="attack"?p.actions.idle:null)||p.actions.walk||p.actions.idle;g&&(g!==p.current||d==="attack")&&(g.reset().fadeIn(.1).play(),p.current!==g&&p.current?.fadeOut(.12),p.current=g,d==="attack"&&g.getClip&&(g.time=Math.min(.08,(p.phase||0)*.02))),p.mode=d,p.clipState=u,p.attackSerial=s.attackSerial}if(p.current&&x)p.current.timeScale=p.actions.run?1.15:1.38;else if(p.current&&d==="walk")p.current.timeScale=s.fieldOrder==="charge"?1.25:1;else if(p.current&&d==="attack"&&p.current.getClip){let g=p.current.getClip().duration;p.current.timeScale=Math.max(.7,Math.min(3,g/(s.type==="archers"?.45:.3)))}else p.current&&(p.current.timeScale=1);if(t>0&&(y<=0?p.mixer.update(t):(p.lodAccum=(p.lodAccum||0)+t,p.lodAccum>=y&&(p.mixer.update(p.lodAccum),p.lodAccum=0))),p.rig&&p.restZ!==void 0&&p.restYaw!==void 0){let g=p.regionalModel&&!p.actions.attack&&d==="attack"?Math.sin(Math.PI*fu((s.attackPulse||0)/.3,0,1)):0,v=(s.hitFlash||0)>0?Math.sin(s.hitFlash/.18*Math.PI)*.14:0;p.rig.position.z=p.restZ+.25*g-v,p.rig.rotation.y=p.restYaw+.18*g}}}}/**
 * @license
 * Copyright 2010-2025 Three.js Authors
 * SPDX-License-Identifier: MIT
 */var Ju=0,wl=1,Zu=2;var Ml=1,Qu=2,Pi=3,fi=0,Vt=1,bt=2,Xi=0,wn=1,_l=2,Sl=3,Tl=4,ed=5,sn=100,td=101,id=102,nd=103,rd=104,sd=200,ad=201,od=202,ld=203,aa=204,oa=205,cd=206,ud=207,dd=208,hd=209,fd=210,pd=211,md=212,yd=213,bd=214,Ta=0,Aa=1,ka=2,Mn=3,Ea=4,Ca=5,Ra=6,Ia=7,Pa=0,vd=1,gd=2,Ki=0,xd=1,wd=2,Md=3,Oa=4,_d=5,Sd=6,Td=7,fl="attached",Ad="detached",Al=300,On=301,Ln=302,La=303,Na=304,Ss=306,Mi=1e3,xi=1001,ar=1002,It=1003,Fa=1004;var Nn=1005;var zt=1006,wr=1007;var mi=1008;var yi=1009,kl=1010,El=1011,Mr=1012,Da=1013,cn=1014,ri=1015,_r=1016,Ba=1017,Ua=1018,Sr=1020,Cl=35902,Rl=35899,Il=1021,Pl=1022,Qt=1023,or=1026,Tr=1027,za=1028,Ha=1029,Ol=1030,ja=1031;var Ga=1033,Ts=33776,As=33777,ks=33778,Es=33779,Va=35840,Wa=35841,qa=35842,$a=35843,Xa=36196,Ka=37492,Ya=37496,Ja=37808,Za=37809,Qa=37810,eo=37811,to=37812,io=37813,no=37814,ro=37815,so=37816,ao=37817,oo=37818,lo=37819,co=37820,uo=37821,ho=36492,fo=36494,po=36495,mo=36283,yo=36284,bo=36285,vo=36286,go=2200,xo=2201,kd=2202,_n=2300,Sn=2301,sa=2302,gn=2400,xn=2401,qr=2402,wo=2500,Ed=2501,Ll=0,Cs=1,Ar=2,Cd=3200,Rd=3201;var Mo=0,Id=1,Yi="",ft="srgb",_t="srgb-linear",$r="linear",Qe="srgb";var vn=7680;var pl=519,Pd=512,Od=513,Ld=514,Nl=515,Nd=516,Fd=517,Dd=518,Bd=519,lr=35044,Fl=35048;var Dl="300 es",di=2e3,Xr=2001;var _i=class{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});let i=this._listeners;i[e]===void 0&&(i[e]=[]),i[e].indexOf(t)===-1&&i[e].push(t)}hasEventListener(e,t){let i=this._listeners;return i===void 0?!1:i[e]!==void 0&&i[e].indexOf(t)!==-1}removeEventListener(e,t){let i=this._listeners;if(i===void 0)return;let n=i[e];if(n!==void 0){let s=n.indexOf(t);s!==-1&&n.splice(s,1)}}dispatchEvent(e){let t=this._listeners;if(t===void 0)return;let i=t[e.type];if(i!==void 0){e.target=this;let n=i.slice(0);for(let s=0,a=n.length;s<a;s++)n[s].call(this,e);e.target=null}}},Lt=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],mu=1234567,Vr=Math.PI/180,Tn=180/Math.PI;function hi(){let r=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,i=Math.random()*4294967295|0;return(Lt[r&255]+Lt[r>>8&255]+Lt[r>>16&255]+Lt[r>>24&255]+"-"+Lt[e&255]+Lt[e>>8&255]+"-"+Lt[e>>16&15|64]+Lt[e>>24&255]+"-"+Lt[t&63|128]+Lt[t>>8&255]+"-"+Lt[t>>16&255]+Lt[t>>24&255]+Lt[i&255]+Lt[i>>8&255]+Lt[i>>16&255]+Lt[i>>24&255]).toLowerCase()}function He(r,e,t){return Math.max(e,Math.min(t,r))}function Bl(r,e){return(r%e+e)%e}function zf(r,e,t,i,n){return i+(r-e)*(n-i)/(t-e)}function Hf(r,e,t){return r!==e?(t-r)/(e-r):0}function Wr(r,e,t){return(1-t)*r+t*e}function jf(r,e,t,i){return Wr(r,e,1-Math.exp(-t*i))}function Gf(r,e=1){return e-Math.abs(Bl(r,e*2)-e)}function Vf(r,e,t){return r<=e?0:r>=t?1:(r=(r-e)/(t-e),r*r*(3-2*r))}function Wf(r,e,t){return r<=e?0:r>=t?1:(r=(r-e)/(t-e),r*r*r*(r*(r*6-15)+10))}function qf(r,e){return r+Math.floor(Math.random()*(e-r+1))}function $f(r,e){return r+Math.random()*(e-r)}function Xf(r){return r*(.5-Math.random())}function Kf(r){r!==void 0&&(mu=r);let e=mu+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}function Yf(r){return r*Vr}function Jf(r){return r*Tn}function Zf(r){return(r&r-1)===0&&r!==0}function Qf(r){return Math.pow(2,Math.ceil(Math.log(r)/Math.LN2))}function ep(r){return Math.pow(2,Math.floor(Math.log(r)/Math.LN2))}function tp(r,e,t,i,n){let s=Math.cos,a=Math.sin,o=s(t/2),l=a(t/2),c=s((e+i)/2),d=a((e+i)/2),u=s((e-i)/2),h=a((e-i)/2),m=s((i-e)/2),y=a((i-e)/2);switch(n){case"XYX":r.set(o*d,l*u,l*h,o*c);break;case"YZY":r.set(l*h,o*d,l*u,o*c);break;case"ZXZ":r.set(l*u,l*h,o*d,o*c);break;case"XZX":r.set(o*d,l*y,l*m,o*c);break;case"YXY":r.set(l*m,o*d,l*y,o*c);break;case"ZYZ":r.set(l*y,l*m,o*d,o*c);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+n)}}function ui(r,e){switch(e.constructor){case Float32Array:return r;case Uint32Array:return r/4294967295;case Uint16Array:return r/65535;case Uint8Array:return r/255;case Int32Array:return Math.max(r/2147483647,-1);case Int16Array:return Math.max(r/32767,-1);case Int8Array:return Math.max(r/127,-1);default:throw new Error("Invalid component type.")}}function Ze(r,e){switch(e.constructor){case Float32Array:return r;case Uint32Array:return Math.round(r*4294967295);case Uint16Array:return Math.round(r*65535);case Uint8Array:return Math.round(r*255);case Int32Array:return Math.round(r*2147483647);case Int16Array:return Math.round(r*32767);case Int8Array:return Math.round(r*127);default:throw new Error("Invalid component type.")}}var Ul={DEG2RAD:Vr,RAD2DEG:Tn,generateUUID:hi,clamp:He,euclideanModulo:Bl,mapLinear:zf,inverseLerp:Hf,lerp:Wr,damp:jf,pingpong:Gf,smoothstep:Vf,smootherstep:Wf,randInt:qf,randFloat:$f,randFloatSpread:Xf,seededRandom:Kf,degToRad:Yf,radToDeg:Jf,isPowerOfTwo:Zf,ceilPowerOfTwo:Qf,floorPowerOfTwo:ep,setQuaternionFromProperEuler:tp,normalize:Ze,denormalize:ui},Oe=class r{constructor(e=0,t=0){r.prototype.isVector2=!0,this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){let t=this.x,i=this.y,n=e.elements;return this.x=n[0]*t+n[3]*i+n[6],this.y=n[1]*t+n[4]*i+n[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=He(this.x,e.x,t.x),this.y=He(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=He(this.x,e,t),this.y=He(this.y,e,t),this}clampLength(e,t){let i=this.length();return this.divideScalar(i||1).multiplyScalar(He(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let i=this.dot(e)/t;return Math.acos(He(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,i=this.y-e.y;return t*t+i*i}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){let i=Math.cos(t),n=Math.sin(t),s=this.x-e.x,a=this.y-e.y;return this.x=s*i-a*n+e.x,this.y=s*n+a*i+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}},Ut=class{constructor(e=0,t=0,i=0,n=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=i,this._w=n}static slerpFlat(e,t,i,n,s,a,o){let l=i[n+0],c=i[n+1],d=i[n+2],u=i[n+3],h=s[a+0],m=s[a+1],y=s[a+2],b=s[a+3];if(o===0){e[t+0]=l,e[t+1]=c,e[t+2]=d,e[t+3]=u;return}if(o===1){e[t+0]=h,e[t+1]=m,e[t+2]=y,e[t+3]=b;return}if(u!==b||l!==h||c!==m||d!==y){let p=1-o,f=l*h+c*m+d*y+u*b,x=f>=0?1:-1,g=1-f*f;if(g>Number.EPSILON){let T=Math.sqrt(g),A=Math.atan2(T,f*x);p=Math.sin(p*A)/T,o=Math.sin(o*A)/T}let v=o*x;if(l=l*p+h*v,c=c*p+m*v,d=d*p+y*v,u=u*p+b*v,p===1-o){let T=1/Math.sqrt(l*l+c*c+d*d+u*u);l*=T,c*=T,d*=T,u*=T}}e[t]=l,e[t+1]=c,e[t+2]=d,e[t+3]=u}static multiplyQuaternionsFlat(e,t,i,n,s,a){let o=i[n],l=i[n+1],c=i[n+2],d=i[n+3],u=s[a],h=s[a+1],m=s[a+2],y=s[a+3];return e[t]=o*y+d*u+l*m-c*h,e[t+1]=l*y+d*h+c*u-o*m,e[t+2]=c*y+d*m+o*h-l*u,e[t+3]=d*y-o*u-l*h-c*m,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,i,n){return this._x=e,this._y=t,this._z=i,this._w=n,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){let i=e._x,n=e._y,s=e._z,a=e._order,o=Math.cos,l=Math.sin,c=o(i/2),d=o(n/2),u=o(s/2),h=l(i/2),m=l(n/2),y=l(s/2);switch(a){case"XYZ":this._x=h*d*u+c*m*y,this._y=c*m*u-h*d*y,this._z=c*d*y+h*m*u,this._w=c*d*u-h*m*y;break;case"YXZ":this._x=h*d*u+c*m*y,this._y=c*m*u-h*d*y,this._z=c*d*y-h*m*u,this._w=c*d*u+h*m*y;break;case"ZXY":this._x=h*d*u-c*m*y,this._y=c*m*u+h*d*y,this._z=c*d*y+h*m*u,this._w=c*d*u-h*m*y;break;case"ZYX":this._x=h*d*u-c*m*y,this._y=c*m*u+h*d*y,this._z=c*d*y-h*m*u,this._w=c*d*u+h*m*y;break;case"YZX":this._x=h*d*u+c*m*y,this._y=c*m*u+h*d*y,this._z=c*d*y-h*m*u,this._w=c*d*u-h*m*y;break;case"XZY":this._x=h*d*u-c*m*y,this._y=c*m*u-h*d*y,this._z=c*d*y+h*m*u,this._w=c*d*u+h*m*y;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+a)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){let i=t/2,n=Math.sin(i);return this._x=e.x*n,this._y=e.y*n,this._z=e.z*n,this._w=Math.cos(i),this._onChangeCallback(),this}setFromRotationMatrix(e){let t=e.elements,i=t[0],n=t[4],s=t[8],a=t[1],o=t[5],l=t[9],c=t[2],d=t[6],u=t[10],h=i+o+u;if(h>0){let m=.5/Math.sqrt(h+1);this._w=.25/m,this._x=(d-l)*m,this._y=(s-c)*m,this._z=(a-n)*m}else if(i>o&&i>u){let m=2*Math.sqrt(1+i-o-u);this._w=(d-l)/m,this._x=.25*m,this._y=(n+a)/m,this._z=(s+c)/m}else if(o>u){let m=2*Math.sqrt(1+o-i-u);this._w=(s-c)/m,this._x=(n+a)/m,this._y=.25*m,this._z=(l+d)/m}else{let m=2*Math.sqrt(1+u-i-o);this._w=(a-n)/m,this._x=(s+c)/m,this._y=(l+d)/m,this._z=.25*m}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let i=e.dot(t)+1;return i<1e-8?(i=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=i):(this._x=0,this._y=-e.z,this._z=e.y,this._w=i)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=i),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(He(this.dot(e),-1,1)))}rotateTowards(e,t){let i=this.angleTo(e);if(i===0)return this;let n=Math.min(1,t/i);return this.slerp(e,n),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){let i=e._x,n=e._y,s=e._z,a=e._w,o=t._x,l=t._y,c=t._z,d=t._w;return this._x=i*d+a*o+n*c-s*l,this._y=n*d+a*l+s*o-i*c,this._z=s*d+a*c+i*l-n*o,this._w=a*d-i*o-n*l-s*c,this._onChangeCallback(),this}slerp(e,t){if(t===0)return this;if(t===1)return this.copy(e);let i=this._x,n=this._y,s=this._z,a=this._w,o=a*e._w+i*e._x+n*e._y+s*e._z;if(o<0?(this._w=-e._w,this._x=-e._x,this._y=-e._y,this._z=-e._z,o=-o):this.copy(e),o>=1)return this._w=a,this._x=i,this._y=n,this._z=s,this;let l=1-o*o;if(l<=Number.EPSILON){let m=1-t;return this._w=m*a+t*this._w,this._x=m*i+t*this._x,this._y=m*n+t*this._y,this._z=m*s+t*this._z,this.normalize(),this}let c=Math.sqrt(l),d=Math.atan2(c,o),u=Math.sin((1-t)*d)/c,h=Math.sin(t*d)/c;return this._w=a*u+this._w*h,this._x=i*u+this._x*h,this._y=n*u+this._y*h,this._z=s*u+this._z*h,this._onChangeCallback(),this}slerpQuaternions(e,t,i){return this.copy(e).slerp(t,i)}random(){let e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),i=Math.random(),n=Math.sqrt(1-i),s=Math.sqrt(i);return this.set(n*Math.sin(e),n*Math.cos(e),s*Math.sin(t),s*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}},L=class r{constructor(e=0,t=0,i=0){r.prototype.isVector3=!0,this.x=e,this.y=t,this.z=i}set(e,t,i){return i===void 0&&(i=this.z),this.x=e,this.y=t,this.z=i,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(yu.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(yu.setFromAxisAngle(e,t))}applyMatrix3(e){let t=this.x,i=this.y,n=this.z,s=e.elements;return this.x=s[0]*t+s[3]*i+s[6]*n,this.y=s[1]*t+s[4]*i+s[7]*n,this.z=s[2]*t+s[5]*i+s[8]*n,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){let t=this.x,i=this.y,n=this.z,s=e.elements,a=1/(s[3]*t+s[7]*i+s[11]*n+s[15]);return this.x=(s[0]*t+s[4]*i+s[8]*n+s[12])*a,this.y=(s[1]*t+s[5]*i+s[9]*n+s[13])*a,this.z=(s[2]*t+s[6]*i+s[10]*n+s[14])*a,this}applyQuaternion(e){let t=this.x,i=this.y,n=this.z,s=e.x,a=e.y,o=e.z,l=e.w,c=2*(a*n-o*i),d=2*(o*t-s*n),u=2*(s*i-a*t);return this.x=t+l*c+a*u-o*d,this.y=i+l*d+o*c-s*u,this.z=n+l*u+s*d-a*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){let t=this.x,i=this.y,n=this.z,s=e.elements;return this.x=s[0]*t+s[4]*i+s[8]*n,this.y=s[1]*t+s[5]*i+s[9]*n,this.z=s[2]*t+s[6]*i+s[10]*n,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=He(this.x,e.x,t.x),this.y=He(this.y,e.y,t.y),this.z=He(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=He(this.x,e,t),this.y=He(this.y,e,t),this.z=He(this.z,e,t),this}clampLength(e,t){let i=this.length();return this.divideScalar(i||1).multiplyScalar(He(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this.z=e.z+(t.z-e.z)*i,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){let i=e.x,n=e.y,s=e.z,a=t.x,o=t.y,l=t.z;return this.x=n*l-s*o,this.y=s*a-i*l,this.z=i*o-n*a,this}projectOnVector(e){let t=e.lengthSq();if(t===0)return this.set(0,0,0);let i=e.dot(this)/t;return this.copy(e).multiplyScalar(i)}projectOnPlane(e){return zo.copy(this).projectOnVector(e),this.sub(zo)}reflect(e){return this.sub(zo.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let i=this.dot(e)/t;return Math.acos(He(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,i=this.y-e.y,n=this.z-e.z;return t*t+i*i+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,i){let n=Math.sin(t)*e;return this.x=n*Math.sin(i),this.y=Math.cos(t)*e,this.z=n*Math.cos(i),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,i){return this.x=e*Math.sin(t),this.y=i,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){let t=this.setFromMatrixColumn(e,0).length(),i=this.setFromMatrixColumn(e,1).length(),n=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=i,this.z=n,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let e=Math.random()*Math.PI*2,t=Math.random()*2-1,i=Math.sqrt(1-t*t);return this.x=i*Math.cos(e),this.y=t,this.z=i*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}},zo=new L,yu=new Ut,Fe=class r{constructor(e,t,i,n,s,a,o,l,c){r.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,i,n,s,a,o,l,c)}set(e,t,i,n,s,a,o,l,c){let d=this.elements;return d[0]=e,d[1]=n,d[2]=o,d[3]=t,d[4]=s,d[5]=l,d[6]=i,d[7]=a,d[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){let t=this.elements,i=e.elements;return t[0]=i[0],t[1]=i[1],t[2]=i[2],t[3]=i[3],t[4]=i[4],t[5]=i[5],t[6]=i[6],t[7]=i[7],t[8]=i[8],this}extractBasis(e,t,i){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),i.setFromMatrix3Column(this,2),this}setFromMatrix4(e){let t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let i=e.elements,n=t.elements,s=this.elements,a=i[0],o=i[3],l=i[6],c=i[1],d=i[4],u=i[7],h=i[2],m=i[5],y=i[8],b=n[0],p=n[3],f=n[6],x=n[1],g=n[4],v=n[7],T=n[2],A=n[5],E=n[8];return s[0]=a*b+o*x+l*T,s[3]=a*p+o*g+l*A,s[6]=a*f+o*v+l*E,s[1]=c*b+d*x+u*T,s[4]=c*p+d*g+u*A,s[7]=c*f+d*v+u*E,s[2]=h*b+m*x+y*T,s[5]=h*p+m*g+y*A,s[8]=h*f+m*v+y*E,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){let e=this.elements,t=e[0],i=e[1],n=e[2],s=e[3],a=e[4],o=e[5],l=e[6],c=e[7],d=e[8];return t*a*d-t*o*c-i*s*d+i*o*l+n*s*c-n*a*l}invert(){let e=this.elements,t=e[0],i=e[1],n=e[2],s=e[3],a=e[4],o=e[5],l=e[6],c=e[7],d=e[8],u=d*a-o*c,h=o*l-d*s,m=c*s-a*l,y=t*u+i*h+n*m;if(y===0)return this.set(0,0,0,0,0,0,0,0,0);let b=1/y;return e[0]=u*b,e[1]=(n*c-d*i)*b,e[2]=(o*i-n*a)*b,e[3]=h*b,e[4]=(d*t-n*l)*b,e[5]=(n*s-o*t)*b,e[6]=m*b,e[7]=(i*l-c*t)*b,e[8]=(a*t-i*s)*b,this}transpose(){let e,t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){let t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,i,n,s,a,o){let l=Math.cos(s),c=Math.sin(s);return this.set(i*l,i*c,-i*(l*a+c*o)+a+e,-n*c,n*l,-n*(-c*a+l*o)+o+t,0,0,1),this}scale(e,t){return this.premultiply(Ho.makeScale(e,t)),this}rotate(e){return this.premultiply(Ho.makeRotation(-e)),this}translate(e,t){return this.premultiply(Ho.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){let t=Math.cos(e),i=Math.sin(e);return this.set(t,-i,0,i,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){let t=this.elements,i=e.elements;for(let n=0;n<9;n++)if(t[n]!==i[n])return!1;return!0}fromArray(e,t=0){for(let i=0;i<9;i++)this.elements[i]=e[i+t];return this}toArray(e=[],t=0){let i=this.elements;return e[t]=i[0],e[t+1]=i[1],e[t+2]=i[2],e[t+3]=i[3],e[t+4]=i[4],e[t+5]=i[5],e[t+6]=i[6],e[t+7]=i[7],e[t+8]=i[8],e}clone(){return new this.constructor().fromArray(this.elements)}},Ho=new Fe;function zl(r){for(let e=r.length-1;e>=0;--e)if(r[e]>=65535)return!0;return!1}function cr(r){return document.createElementNS("http://www.w3.org/1999/xhtml",r)}function Ud(){let r=cr("canvas");return r.style.display="block",r}var bu={};function ur(r){r in bu||(bu[r]=!0,console.warn(r))}function zd(r,e,t){return new Promise(function(i,n){function s(){switch(r.clientWaitSync(e,r.SYNC_FLUSH_COMMANDS_BIT,0)){case r.WAIT_FAILED:n();break;case r.TIMEOUT_EXPIRED:setTimeout(s,t);break;default:i()}}setTimeout(s,t)})}var vu=new Fe().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),gu=new Fe().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function ip(){let r={enabled:!0,workingColorSpace:_t,spaces:{},convert:function(n,s,a){return this.enabled===!1||s===a||!s||!a||(this.spaces[s].transfer===Qe&&(n.r=ji(n.r),n.g=ji(n.g),n.b=ji(n.b)),this.spaces[s].primaries!==this.spaces[a].primaries&&(n.applyMatrix3(this.spaces[s].toXYZ),n.applyMatrix3(this.spaces[a].fromXYZ)),this.spaces[a].transfer===Qe&&(n.r=sr(n.r),n.g=sr(n.g),n.b=sr(n.b))),n},workingToColorSpace:function(n,s){return this.convert(n,this.workingColorSpace,s)},colorSpaceToWorking:function(n,s){return this.convert(n,s,this.workingColorSpace)},getPrimaries:function(n){return this.spaces[n].primaries},getTransfer:function(n){return n===Yi?$r:this.spaces[n].transfer},getToneMappingMode:function(n){return this.spaces[n].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(n,s=this.workingColorSpace){return n.fromArray(this.spaces[s].luminanceCoefficients)},define:function(n){Object.assign(this.spaces,n)},_getMatrix:function(n,s,a){return n.copy(this.spaces[s].toXYZ).multiply(this.spaces[a].fromXYZ)},_getDrawingBufferColorSpace:function(n){return this.spaces[n].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(n=this.workingColorSpace){return this.spaces[n].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(n,s){return ur("THREE.ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),r.workingToColorSpace(n,s)},toWorkingColorSpace:function(n,s){return ur("THREE.ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),r.colorSpaceToWorking(n,s)}},e=[.64,.33,.3,.6,.15,.06],t=[.2126,.7152,.0722],i=[.3127,.329];return r.define({[_t]:{primaries:e,whitePoint:i,transfer:$r,toXYZ:vu,fromXYZ:gu,luminanceCoefficients:t,workingColorSpaceConfig:{unpackColorSpace:ft},outputColorSpaceConfig:{drawingBufferColorSpace:ft}},[ft]:{primaries:e,whitePoint:i,transfer:Qe,toXYZ:vu,fromXYZ:gu,luminanceCoefficients:t,outputColorSpaceConfig:{drawingBufferColorSpace:ft}}}),r}var Ve=ip();function ji(r){return r<.04045?r*.0773993808:Math.pow(r*.9478672986+.0521327014,2.4)}function sr(r){return r<.0031308?r*12.92:1.055*Math.pow(r,.41666)-.055}var Wn,la=class{static getDataURL(e,t="image/png"){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let i;if(e instanceof HTMLCanvasElement)i=e;else{Wn===void 0&&(Wn=cr("canvas")),Wn.width=e.width,Wn.height=e.height;let n=Wn.getContext("2d");e instanceof ImageData?n.putImageData(e,0,0):n.drawImage(e,0,0,e.width,e.height),i=Wn}return i.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){let t=cr("canvas");t.width=e.width,t.height=e.height;let i=t.getContext("2d");i.drawImage(e,0,0,e.width,e.height);let n=i.getImageData(0,0,e.width,e.height),s=n.data;for(let a=0;a<s.length;a++)s[a]=ji(s[a]/255)*255;return i.putImageData(n,0,0),t}else if(e.data){let t=e.data.slice(0);for(let i=0;i<t.length;i++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[i]=Math.floor(ji(t[i]/255)*255):t[i]=ji(t[i]);return{data:t,width:e.width,height:e.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}},np=0,dr=class{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:np++}),this.uuid=hi(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){let t=this.data;return typeof HTMLVideoElement<"u"&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):t instanceof VideoFrame?e.set(t.displayHeight,t.displayWidth,0):t!==null?e.set(t.width,t.height,t.depth||0):e.set(0,0,0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){let t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];let i={uuid:this.uuid,url:""},n=this.data;if(n!==null){let s;if(Array.isArray(n)){s=[];for(let a=0,o=n.length;a<o;a++)n[a].isDataTexture?s.push(jo(n[a].image)):s.push(jo(n[a]))}else s=jo(n);i.url=s}return t||(e.images[this.uuid]=i),i}};function jo(r){return typeof HTMLImageElement<"u"&&r instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&r instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&r instanceof ImageBitmap?la.getDataURL(r):r.data?{data:Array.from(r.data),width:r.width,height:r.height,type:r.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}var rp=0,Go=new L,St=class r extends _i{constructor(e=r.DEFAULT_IMAGE,t=r.DEFAULT_MAPPING,i=xi,n=xi,s=zt,a=mi,o=Qt,l=yi,c=r.DEFAULT_ANISOTROPY,d=Yi){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:rp++}),this.uuid=hi(),this.name="",this.source=new dr(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=i,this.wrapT=n,this.magFilter=s,this.minFilter=a,this.anisotropy=c,this.format=o,this.internalFormat=null,this.type=l,this.offset=new Oe(0,0),this.repeat=new Oe(1,1),this.center=new Oe(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Fe,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=d,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(e&&e.depth&&e.depth>1),this.pmremVersion=0}get width(){return this.source.getSize(Go).x}get height(){return this.source.getSize(Go).y}get depth(){return this.source.getSize(Go).z}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(let t in e){let i=e[t];if(i===void 0){console.warn(`THREE.Texture.setValues(): parameter '${t}' has value of undefined.`);continue}let n=this[t];if(n===void 0){console.warn(`THREE.Texture.setValues(): property '${t}' does not exist.`);continue}n&&i&&n.isVector2&&i.isVector2||n&&i&&n.isVector3&&i.isVector3||n&&i&&n.isMatrix3&&i.isMatrix3?n.copy(i):this[t]=i}}toJSON(e){let t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];let i={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(i.userData=this.userData),t||(e.textures[this.uuid]=i),i}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==Al)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case Mi:e.x=e.x-Math.floor(e.x);break;case xi:e.x=e.x<0?0:1;break;case ar:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case Mi:e.y=e.y-Math.floor(e.y);break;case xi:e.y=e.y<0?0:1;break;case ar:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}};St.DEFAULT_IMAGE=null;St.DEFAULT_MAPPING=Al;St.DEFAULT_ANISOTROPY=1;var Ye=class r{constructor(e=0,t=0,i=0,n=1){r.prototype.isVector4=!0,this.x=e,this.y=t,this.z=i,this.w=n}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,i,n){return this.x=e,this.y=t,this.z=i,this.w=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){let t=this.x,i=this.y,n=this.z,s=this.w,a=e.elements;return this.x=a[0]*t+a[4]*i+a[8]*n+a[12]*s,this.y=a[1]*t+a[5]*i+a[9]*n+a[13]*s,this.z=a[2]*t+a[6]*i+a[10]*n+a[14]*s,this.w=a[3]*t+a[7]*i+a[11]*n+a[15]*s,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);let t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,i,n,s,l=e.elements,c=l[0],d=l[4],u=l[8],h=l[1],m=l[5],y=l[9],b=l[2],p=l[6],f=l[10];if(Math.abs(d-h)<.01&&Math.abs(u-b)<.01&&Math.abs(y-p)<.01){if(Math.abs(d+h)<.1&&Math.abs(u+b)<.1&&Math.abs(y+p)<.1&&Math.abs(c+m+f-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;let g=(c+1)/2,v=(m+1)/2,T=(f+1)/2,A=(d+h)/4,E=(u+b)/4,P=(y+p)/4;return g>v&&g>T?g<.01?(i=0,n=.707106781,s=.707106781):(i=Math.sqrt(g),n=A/i,s=E/i):v>T?v<.01?(i=.707106781,n=0,s=.707106781):(n=Math.sqrt(v),i=A/n,s=P/n):T<.01?(i=.707106781,n=.707106781,s=0):(s=Math.sqrt(T),i=E/s,n=P/s),this.set(i,n,s,t),this}let x=Math.sqrt((p-y)*(p-y)+(u-b)*(u-b)+(h-d)*(h-d));return Math.abs(x)<.001&&(x=1),this.x=(p-y)/x,this.y=(u-b)/x,this.z=(h-d)/x,this.w=Math.acos((c+m+f-1)/2),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=He(this.x,e.x,t.x),this.y=He(this.y,e.y,t.y),this.z=He(this.z,e.z,t.z),this.w=He(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=He(this.x,e,t),this.y=He(this.y,e,t),this.z=He(this.z,e,t),this.w=He(this.w,e,t),this}clampLength(e,t){let i=this.length();return this.divideScalar(i||1).multiplyScalar(He(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this.z=e.z+(t.z-e.z)*i,this.w=e.w+(t.w-e.w)*i,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}},ca=class extends _i{constructor(e=1,t=1,i={}){super(),i=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:zt,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1},i),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=i.depth,this.scissor=new Ye(0,0,e,t),this.scissorTest=!1,this.viewport=new Ye(0,0,e,t);let n={width:e,height:t,depth:i.depth},s=new St(n);this.textures=[];let a=i.count;for(let o=0;o<a;o++)this.textures[o]=s.clone(),this.textures[o].isRenderTargetTexture=!0,this.textures[o].renderTarget=this;this._setTextureOptions(i),this.depthBuffer=i.depthBuffer,this.stencilBuffer=i.stencilBuffer,this.resolveDepthBuffer=i.resolveDepthBuffer,this.resolveStencilBuffer=i.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=i.depthTexture,this.samples=i.samples,this.multiview=i.multiview}_setTextureOptions(e={}){let t={minFilter:zt,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let i=0;i<this.textures.length;i++)this.textures[i].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),e!==null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,i=1){if(this.width!==e||this.height!==t||this.depth!==i){this.width=e,this.height=t,this.depth=i;for(let n=0,s=this.textures.length;n<s;n++)this.textures[n].image.width=e,this.textures[n].image.height=t,this.textures[n].image.depth=i,this.textures[n].isArrayTexture=this.textures[n].image.depth>1;this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,i=e.textures.length;t<i;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;let n=Object.assign({},e.textures[t].image);this.textures[t].source=new dr(n)}return this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}},Si=class extends ca{constructor(e=1,t=1,i={}){super(e,t,i),this.isWebGLRenderTarget=!0}},Kr=class extends St{constructor(e=null,t=1,i=1,n=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:i,depth:n},this.magFilter=It,this.minFilter=It,this.wrapR=xi,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}};var ua=class extends St{constructor(e=null,t=1,i=1,n=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:i,depth:n},this.magFilter=It,this.minFilter=It,this.wrapR=xi,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}};var Pt=class{constructor(e=new L(1/0,1/0,1/0),t=new L(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t+=3)this.expandByPoint(oi.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,i=e.count;t<i;t++)this.expandByPoint(oi.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){let i=oi.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(i),this.max.copy(e).add(i),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);let i=e.geometry;if(i!==void 0){let s=i.getAttribute("position");if(t===!0&&s!==void 0&&e.isInstancedMesh!==!0)for(let a=0,o=s.count;a<o;a++)e.isMesh===!0?e.getVertexPosition(a,oi):oi.fromBufferAttribute(s,a),oi.applyMatrix4(e.matrixWorld),this.expandByPoint(oi);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),Ns.copy(e.boundingBox)):(i.boundingBox===null&&i.computeBoundingBox(),Ns.copy(i.boundingBox)),Ns.applyMatrix4(e.matrixWorld),this.union(Ns)}let n=e.children;for(let s=0,a=n.length;s<a;s++)this.expandByObject(n[s],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,oi),oi.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,i;return e.normal.x>0?(t=e.normal.x*this.min.x,i=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,i=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,i+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,i+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,i+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,i+=e.normal.z*this.min.z),t<=-e.constant&&i>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(Fr),Fs.subVectors(this.max,Fr),qn.subVectors(e.a,Fr),$n.subVectors(e.b,Fr),Xn.subVectors(e.c,Fr),Ji.subVectors($n,qn),Zi.subVectors(Xn,$n),pn.subVectors(qn,Xn);let t=[0,-Ji.z,Ji.y,0,-Zi.z,Zi.y,0,-pn.z,pn.y,Ji.z,0,-Ji.x,Zi.z,0,-Zi.x,pn.z,0,-pn.x,-Ji.y,Ji.x,0,-Zi.y,Zi.x,0,-pn.y,pn.x,0];return!Vo(t,qn,$n,Xn,Fs)||(t=[1,0,0,0,1,0,0,0,1],!Vo(t,qn,$n,Xn,Fs))?!1:(Ds.crossVectors(Ji,Zi),t=[Ds.x,Ds.y,Ds.z],Vo(t,qn,$n,Xn,Fs))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,oi).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(oi).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(Fi[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),Fi[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),Fi[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),Fi[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),Fi[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),Fi[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),Fi[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),Fi[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(Fi),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}},Fi=[new L,new L,new L,new L,new L,new L,new L,new L],oi=new L,Ns=new Pt,qn=new L,$n=new L,Xn=new L,Ji=new L,Zi=new L,pn=new L,Fr=new L,Fs=new L,Ds=new L,mn=new L;function Vo(r,e,t,i,n){for(let s=0,a=r.length-3;s<=a;s+=3){mn.fromArray(r,s);let o=n.x*Math.abs(mn.x)+n.y*Math.abs(mn.y)+n.z*Math.abs(mn.z),l=e.dot(mn),c=t.dot(mn),d=i.dot(mn);if(Math.max(-Math.max(l,c,d),Math.min(l,c,d))>o)return!1}return!0}var sp=new Pt,Dr=new L,Wo=new L,qt=class{constructor(e=new L,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){let i=this.center;t!==void 0?i.copy(t):sp.setFromPoints(e).getCenter(i);let n=0;for(let s=0,a=e.length;s<a;s++)n=Math.max(n,i.distanceToSquared(e[s]));return this.radius=Math.sqrt(n),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){let t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){let i=this.center.distanceToSquared(e);return t.copy(e),i>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;Dr.subVectors(e,this.center);let t=Dr.lengthSq();if(t>this.radius*this.radius){let i=Math.sqrt(t),n=(i-this.radius)*.5;this.center.addScaledVector(Dr,n/i),this.radius+=n}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(Wo.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(Dr.copy(e.center).add(Wo)),this.expandByPoint(Dr.copy(e.center).sub(Wo))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}},Di=new L,qo=new L,Bs=new L,Qi=new L,$o=new L,Us=new L,Xo=new L,An=class{constructor(e=new L,t=new L(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,Di)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);let i=t.dot(this.direction);return i<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,i)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){let t=Di.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(Di.copy(this.origin).addScaledVector(this.direction,t),Di.distanceToSquared(e))}distanceSqToSegment(e,t,i,n){qo.copy(e).add(t).multiplyScalar(.5),Bs.copy(t).sub(e).normalize(),Qi.copy(this.origin).sub(qo);let s=e.distanceTo(t)*.5,a=-this.direction.dot(Bs),o=Qi.dot(this.direction),l=-Qi.dot(Bs),c=Qi.lengthSq(),d=Math.abs(1-a*a),u,h,m,y;if(d>0)if(u=a*l-o,h=a*o-l,y=s*d,u>=0)if(h>=-y)if(h<=y){let b=1/d;u*=b,h*=b,m=u*(u+a*h+2*o)+h*(a*u+h+2*l)+c}else h=s,u=Math.max(0,-(a*h+o)),m=-u*u+h*(h+2*l)+c;else h=-s,u=Math.max(0,-(a*h+o)),m=-u*u+h*(h+2*l)+c;else h<=-y?(u=Math.max(0,-(-a*s+o)),h=u>0?-s:Math.min(Math.max(-s,-l),s),m=-u*u+h*(h+2*l)+c):h<=y?(u=0,h=Math.min(Math.max(-s,-l),s),m=h*(h+2*l)+c):(u=Math.max(0,-(a*s+o)),h=u>0?s:Math.min(Math.max(-s,-l),s),m=-u*u+h*(h+2*l)+c);else h=a>0?-s:s,u=Math.max(0,-(a*h+o)),m=-u*u+h*(h+2*l)+c;return i&&i.copy(this.origin).addScaledVector(this.direction,u),n&&n.copy(qo).addScaledVector(Bs,h),m}intersectSphere(e,t){Di.subVectors(e.center,this.origin);let i=Di.dot(this.direction),n=Di.dot(Di)-i*i,s=e.radius*e.radius;if(n>s)return null;let a=Math.sqrt(s-n),o=i-a,l=i+a;return l<0?null:o<0?this.at(l,t):this.at(o,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){let t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;let i=-(this.origin.dot(e.normal)+e.constant)/t;return i>=0?i:null}intersectPlane(e,t){let i=this.distanceToPlane(e);return i===null?null:this.at(i,t)}intersectsPlane(e){let t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let i,n,s,a,o,l,c=1/this.direction.x,d=1/this.direction.y,u=1/this.direction.z,h=this.origin;return c>=0?(i=(e.min.x-h.x)*c,n=(e.max.x-h.x)*c):(i=(e.max.x-h.x)*c,n=(e.min.x-h.x)*c),d>=0?(s=(e.min.y-h.y)*d,a=(e.max.y-h.y)*d):(s=(e.max.y-h.y)*d,a=(e.min.y-h.y)*d),i>a||s>n||((s>i||isNaN(i))&&(i=s),(a<n||isNaN(n))&&(n=a),u>=0?(o=(e.min.z-h.z)*u,l=(e.max.z-h.z)*u):(o=(e.max.z-h.z)*u,l=(e.min.z-h.z)*u),i>l||o>n)||((o>i||i!==i)&&(i=o),(l<n||n!==n)&&(n=l),n<0)?null:this.at(i>=0?i:n,t)}intersectsBox(e){return this.intersectBox(e,Di)!==null}intersectTriangle(e,t,i,n,s){$o.subVectors(t,e),Us.subVectors(i,e),Xo.crossVectors($o,Us);let a=this.direction.dot(Xo),o;if(a>0){if(n)return null;o=1}else if(a<0)o=-1,a=-a;else return null;Qi.subVectors(this.origin,e);let l=o*this.direction.dot(Us.crossVectors(Qi,Us));if(l<0)return null;let c=o*this.direction.dot($o.cross(Qi));if(c<0||l+c>a)return null;let d=-o*Qi.dot(Xo);return d<0?null:this.at(d/a,s)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},Be=class r{constructor(e,t,i,n,s,a,o,l,c,d,u,h,m,y,b,p){r.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,i,n,s,a,o,l,c,d,u,h,m,y,b,p)}set(e,t,i,n,s,a,o,l,c,d,u,h,m,y,b,p){let f=this.elements;return f[0]=e,f[4]=t,f[8]=i,f[12]=n,f[1]=s,f[5]=a,f[9]=o,f[13]=l,f[2]=c,f[6]=d,f[10]=u,f[14]=h,f[3]=m,f[7]=y,f[11]=b,f[15]=p,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new r().fromArray(this.elements)}copy(e){let t=this.elements,i=e.elements;return t[0]=i[0],t[1]=i[1],t[2]=i[2],t[3]=i[3],t[4]=i[4],t[5]=i[5],t[6]=i[6],t[7]=i[7],t[8]=i[8],t[9]=i[9],t[10]=i[10],t[11]=i[11],t[12]=i[12],t[13]=i[13],t[14]=i[14],t[15]=i[15],this}copyPosition(e){let t=this.elements,i=e.elements;return t[12]=i[12],t[13]=i[13],t[14]=i[14],this}setFromMatrix3(e){let t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,i){return e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),i.setFromMatrixColumn(this,2),this}makeBasis(e,t,i){return this.set(e.x,t.x,i.x,0,e.y,t.y,i.y,0,e.z,t.z,i.z,0,0,0,0,1),this}extractRotation(e){let t=this.elements,i=e.elements,n=1/Kn.setFromMatrixColumn(e,0).length(),s=1/Kn.setFromMatrixColumn(e,1).length(),a=1/Kn.setFromMatrixColumn(e,2).length();return t[0]=i[0]*n,t[1]=i[1]*n,t[2]=i[2]*n,t[3]=0,t[4]=i[4]*s,t[5]=i[5]*s,t[6]=i[6]*s,t[7]=0,t[8]=i[8]*a,t[9]=i[9]*a,t[10]=i[10]*a,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){let t=this.elements,i=e.x,n=e.y,s=e.z,a=Math.cos(i),o=Math.sin(i),l=Math.cos(n),c=Math.sin(n),d=Math.cos(s),u=Math.sin(s);if(e.order==="XYZ"){let h=a*d,m=a*u,y=o*d,b=o*u;t[0]=l*d,t[4]=-l*u,t[8]=c,t[1]=m+y*c,t[5]=h-b*c,t[9]=-o*l,t[2]=b-h*c,t[6]=y+m*c,t[10]=a*l}else if(e.order==="YXZ"){let h=l*d,m=l*u,y=c*d,b=c*u;t[0]=h+b*o,t[4]=y*o-m,t[8]=a*c,t[1]=a*u,t[5]=a*d,t[9]=-o,t[2]=m*o-y,t[6]=b+h*o,t[10]=a*l}else if(e.order==="ZXY"){let h=l*d,m=l*u,y=c*d,b=c*u;t[0]=h-b*o,t[4]=-a*u,t[8]=y+m*o,t[1]=m+y*o,t[5]=a*d,t[9]=b-h*o,t[2]=-a*c,t[6]=o,t[10]=a*l}else if(e.order==="ZYX"){let h=a*d,m=a*u,y=o*d,b=o*u;t[0]=l*d,t[4]=y*c-m,t[8]=h*c+b,t[1]=l*u,t[5]=b*c+h,t[9]=m*c-y,t[2]=-c,t[6]=o*l,t[10]=a*l}else if(e.order==="YZX"){let h=a*l,m=a*c,y=o*l,b=o*c;t[0]=l*d,t[4]=b-h*u,t[8]=y*u+m,t[1]=u,t[5]=a*d,t[9]=-o*d,t[2]=-c*d,t[6]=m*u+y,t[10]=h-b*u}else if(e.order==="XZY"){let h=a*l,m=a*c,y=o*l,b=o*c;t[0]=l*d,t[4]=-u,t[8]=c*d,t[1]=h*u+b,t[5]=a*d,t[9]=m*u-y,t[2]=y*u-m,t[6]=o*d,t[10]=b*u+h}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(ap,e,op)}lookAt(e,t,i){let n=this.elements;return Jt.subVectors(e,t),Jt.lengthSq()===0&&(Jt.z=1),Jt.normalize(),en.crossVectors(i,Jt),en.lengthSq()===0&&(Math.abs(i.z)===1?Jt.x+=1e-4:Jt.z+=1e-4,Jt.normalize(),en.crossVectors(i,Jt)),en.normalize(),zs.crossVectors(Jt,en),n[0]=en.x,n[4]=zs.x,n[8]=Jt.x,n[1]=en.y,n[5]=zs.y,n[9]=Jt.y,n[2]=en.z,n[6]=zs.z,n[10]=Jt.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let i=e.elements,n=t.elements,s=this.elements,a=i[0],o=i[4],l=i[8],c=i[12],d=i[1],u=i[5],h=i[9],m=i[13],y=i[2],b=i[6],p=i[10],f=i[14],x=i[3],g=i[7],v=i[11],T=i[15],A=n[0],E=n[4],P=n[8],_=n[12],M=n[1],R=n[5],F=n[9],j=n[13],W=n[2],K=n[6],C=n[10],U=n[14],O=n[3],z=n[7],Y=n[11],re=n[15];return s[0]=a*A+o*M+l*W+c*O,s[4]=a*E+o*R+l*K+c*z,s[8]=a*P+o*F+l*C+c*Y,s[12]=a*_+o*j+l*U+c*re,s[1]=d*A+u*M+h*W+m*O,s[5]=d*E+u*R+h*K+m*z,s[9]=d*P+u*F+h*C+m*Y,s[13]=d*_+u*j+h*U+m*re,s[2]=y*A+b*M+p*W+f*O,s[6]=y*E+b*R+p*K+f*z,s[10]=y*P+b*F+p*C+f*Y,s[14]=y*_+b*j+p*U+f*re,s[3]=x*A+g*M+v*W+T*O,s[7]=x*E+g*R+v*K+T*z,s[11]=x*P+g*F+v*C+T*Y,s[15]=x*_+g*j+v*U+T*re,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){let e=this.elements,t=e[0],i=e[4],n=e[8],s=e[12],a=e[1],o=e[5],l=e[9],c=e[13],d=e[2],u=e[6],h=e[10],m=e[14],y=e[3],b=e[7],p=e[11],f=e[15];return y*(+s*l*u-n*c*u-s*o*h+i*c*h+n*o*m-i*l*m)+b*(+t*l*m-t*c*h+s*a*h-n*a*m+n*c*d-s*l*d)+p*(+t*c*u-t*o*m-s*a*u+i*a*m+s*o*d-i*c*d)+f*(-n*o*d-t*l*u+t*o*h+n*a*u-i*a*h+i*l*d)}transpose(){let e=this.elements,t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,i){let n=this.elements;return e.isVector3?(n[12]=e.x,n[13]=e.y,n[14]=e.z):(n[12]=e,n[13]=t,n[14]=i),this}invert(){let e=this.elements,t=e[0],i=e[1],n=e[2],s=e[3],a=e[4],o=e[5],l=e[6],c=e[7],d=e[8],u=e[9],h=e[10],m=e[11],y=e[12],b=e[13],p=e[14],f=e[15],x=u*p*c-b*h*c+b*l*m-o*p*m-u*l*f+o*h*f,g=y*h*c-d*p*c-y*l*m+a*p*m+d*l*f-a*h*f,v=d*b*c-y*u*c+y*o*m-a*b*m-d*o*f+a*u*f,T=y*u*l-d*b*l-y*o*h+a*b*h+d*o*p-a*u*p,A=t*x+i*g+n*v+s*T;if(A===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let E=1/A;return e[0]=x*E,e[1]=(b*h*s-u*p*s-b*n*m+i*p*m+u*n*f-i*h*f)*E,e[2]=(o*p*s-b*l*s+b*n*c-i*p*c-o*n*f+i*l*f)*E,e[3]=(u*l*s-o*h*s-u*n*c+i*h*c+o*n*m-i*l*m)*E,e[4]=g*E,e[5]=(d*p*s-y*h*s+y*n*m-t*p*m-d*n*f+t*h*f)*E,e[6]=(y*l*s-a*p*s-y*n*c+t*p*c+a*n*f-t*l*f)*E,e[7]=(a*h*s-d*l*s+d*n*c-t*h*c-a*n*m+t*l*m)*E,e[8]=v*E,e[9]=(y*u*s-d*b*s-y*i*m+t*b*m+d*i*f-t*u*f)*E,e[10]=(a*b*s-y*o*s+y*i*c-t*b*c-a*i*f+t*o*f)*E,e[11]=(d*o*s-a*u*s-d*i*c+t*u*c+a*i*m-t*o*m)*E,e[12]=T*E,e[13]=(d*b*n-y*u*n+y*i*h-t*b*h-d*i*p+t*u*p)*E,e[14]=(y*o*n-a*b*n-y*i*l+t*b*l+a*i*p-t*o*p)*E,e[15]=(a*u*n-d*o*n+d*i*l-t*u*l-a*i*h+t*o*h)*E,this}scale(e){let t=this.elements,i=e.x,n=e.y,s=e.z;return t[0]*=i,t[4]*=n,t[8]*=s,t[1]*=i,t[5]*=n,t[9]*=s,t[2]*=i,t[6]*=n,t[10]*=s,t[3]*=i,t[7]*=n,t[11]*=s,this}getMaxScaleOnAxis(){let e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],i=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],n=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,i,n))}makeTranslation(e,t,i){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,i,0,0,0,1),this}makeRotationX(e){let t=Math.cos(e),i=Math.sin(e);return this.set(1,0,0,0,0,t,-i,0,0,i,t,0,0,0,0,1),this}makeRotationY(e){let t=Math.cos(e),i=Math.sin(e);return this.set(t,0,i,0,0,1,0,0,-i,0,t,0,0,0,0,1),this}makeRotationZ(e){let t=Math.cos(e),i=Math.sin(e);return this.set(t,-i,0,0,i,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){let i=Math.cos(t),n=Math.sin(t),s=1-i,a=e.x,o=e.y,l=e.z,c=s*a,d=s*o;return this.set(c*a+i,c*o-n*l,c*l+n*o,0,c*o+n*l,d*o+i,d*l-n*a,0,c*l-n*o,d*l+n*a,s*l*l+i,0,0,0,0,1),this}makeScale(e,t,i){return this.set(e,0,0,0,0,t,0,0,0,0,i,0,0,0,0,1),this}makeShear(e,t,i,n,s,a){return this.set(1,i,s,0,e,1,a,0,t,n,1,0,0,0,0,1),this}compose(e,t,i){let n=this.elements,s=t._x,a=t._y,o=t._z,l=t._w,c=s+s,d=a+a,u=o+o,h=s*c,m=s*d,y=s*u,b=a*d,p=a*u,f=o*u,x=l*c,g=l*d,v=l*u,T=i.x,A=i.y,E=i.z;return n[0]=(1-(b+f))*T,n[1]=(m+v)*T,n[2]=(y-g)*T,n[3]=0,n[4]=(m-v)*A,n[5]=(1-(h+f))*A,n[6]=(p+x)*A,n[7]=0,n[8]=(y+g)*E,n[9]=(p-x)*E,n[10]=(1-(h+b))*E,n[11]=0,n[12]=e.x,n[13]=e.y,n[14]=e.z,n[15]=1,this}decompose(e,t,i){let n=this.elements,s=Kn.set(n[0],n[1],n[2]).length(),a=Kn.set(n[4],n[5],n[6]).length(),o=Kn.set(n[8],n[9],n[10]).length();this.determinant()<0&&(s=-s),e.x=n[12],e.y=n[13],e.z=n[14],li.copy(this);let c=1/s,d=1/a,u=1/o;return li.elements[0]*=c,li.elements[1]*=c,li.elements[2]*=c,li.elements[4]*=d,li.elements[5]*=d,li.elements[6]*=d,li.elements[8]*=u,li.elements[9]*=u,li.elements[10]*=u,t.setFromRotationMatrix(li),i.x=s,i.y=a,i.z=o,this}makePerspective(e,t,i,n,s,a,o=di,l=!1){let c=this.elements,d=2*s/(t-e),u=2*s/(i-n),h=(t+e)/(t-e),m=(i+n)/(i-n),y,b;if(l)y=s/(a-s),b=a*s/(a-s);else if(o===di)y=-(a+s)/(a-s),b=-2*a*s/(a-s);else if(o===Xr)y=-a/(a-s),b=-a*s/(a-s);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return c[0]=d,c[4]=0,c[8]=h,c[12]=0,c[1]=0,c[5]=u,c[9]=m,c[13]=0,c[2]=0,c[6]=0,c[10]=y,c[14]=b,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(e,t,i,n,s,a,o=di,l=!1){let c=this.elements,d=2/(t-e),u=2/(i-n),h=-(t+e)/(t-e),m=-(i+n)/(i-n),y,b;if(l)y=1/(a-s),b=a/(a-s);else if(o===di)y=-2/(a-s),b=-(a+s)/(a-s);else if(o===Xr)y=-1/(a-s),b=-s/(a-s);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return c[0]=d,c[4]=0,c[8]=0,c[12]=h,c[1]=0,c[5]=u,c[9]=0,c[13]=m,c[2]=0,c[6]=0,c[10]=y,c[14]=b,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(e){let t=this.elements,i=e.elements;for(let n=0;n<16;n++)if(t[n]!==i[n])return!1;return!0}fromArray(e,t=0){for(let i=0;i<16;i++)this.elements[i]=e[i+t];return this}toArray(e=[],t=0){let i=this.elements;return e[t]=i[0],e[t+1]=i[1],e[t+2]=i[2],e[t+3]=i[3],e[t+4]=i[4],e[t+5]=i[5],e[t+6]=i[6],e[t+7]=i[7],e[t+8]=i[8],e[t+9]=i[9],e[t+10]=i[10],e[t+11]=i[11],e[t+12]=i[12],e[t+13]=i[13],e[t+14]=i[14],e[t+15]=i[15],e}},Kn=new L,li=new Be,ap=new L(0,0,0),op=new L(1,1,1),en=new L,zs=new L,Jt=new L,xu=new Be,wu=new Ut,ni=class r{constructor(e=0,t=0,i=0,n=r.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=i,this._order=n}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,i,n=this._order){return this._x=e,this._y=t,this._z=i,this._order=n,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,i=!0){let n=e.elements,s=n[0],a=n[4],o=n[8],l=n[1],c=n[5],d=n[9],u=n[2],h=n[6],m=n[10];switch(t){case"XYZ":this._y=Math.asin(He(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-d,m),this._z=Math.atan2(-a,s)):(this._x=Math.atan2(h,c),this._z=0);break;case"YXZ":this._x=Math.asin(-He(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(o,m),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-u,s),this._z=0);break;case"ZXY":this._x=Math.asin(He(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(-u,m),this._z=Math.atan2(-a,c)):(this._y=0,this._z=Math.atan2(l,s));break;case"ZYX":this._y=Math.asin(-He(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(h,m),this._z=Math.atan2(l,s)):(this._x=0,this._z=Math.atan2(-a,c));break;case"YZX":this._z=Math.asin(He(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-d,c),this._y=Math.atan2(-u,s)):(this._x=0,this._y=Math.atan2(o,m));break;case"XZY":this._z=Math.asin(-He(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(h,c),this._y=Math.atan2(o,s)):(this._x=Math.atan2(-d,m),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,i===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,i){return xu.makeRotationFromQuaternion(e),this.setFromRotationMatrix(xu,t,i)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return wu.setFromEuler(this),this.setFromQuaternion(wu,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};ni.DEFAULT_ORDER="XYZ";var Yr=class{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}},lp=0,Mu=new L,Yn=new Ut,Bi=new Be,Hs=new L,Br=new L,cp=new L,up=new Ut,_u=new L(1,0,0),Su=new L(0,1,0),Tu=new L(0,0,1),Au={type:"added"},dp={type:"removed"},Jn={type:"childadded",child:null},Ko={type:"childremoved",child:null},rt=class r extends _i{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:lp++}),this.uuid=hi(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=r.DEFAULT_UP.clone();let e=new L,t=new ni,i=new Ut,n=new L(1,1,1);function s(){i.setFromEuler(t,!1)}function a(){t.setFromQuaternion(i,void 0,!1)}t._onChange(s),i._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:i},scale:{configurable:!0,enumerable:!0,value:n},modelViewMatrix:{value:new Be},normalMatrix:{value:new Fe}}),this.matrix=new Be,this.matrixWorld=new Be,this.matrixAutoUpdate=r.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=r.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Yr,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return Yn.setFromAxisAngle(e,t),this.quaternion.multiply(Yn),this}rotateOnWorldAxis(e,t){return Yn.setFromAxisAngle(e,t),this.quaternion.premultiply(Yn),this}rotateX(e){return this.rotateOnAxis(_u,e)}rotateY(e){return this.rotateOnAxis(Su,e)}rotateZ(e){return this.rotateOnAxis(Tu,e)}translateOnAxis(e,t){return Mu.copy(e).applyQuaternion(this.quaternion),this.position.add(Mu.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(_u,e)}translateY(e){return this.translateOnAxis(Su,e)}translateZ(e){return this.translateOnAxis(Tu,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(Bi.copy(this.matrixWorld).invert())}lookAt(e,t,i){e.isVector3?Hs.copy(e):Hs.set(e,t,i);let n=this.parent;this.updateWorldMatrix(!0,!1),Br.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Bi.lookAt(Br,Hs,this.up):Bi.lookAt(Hs,Br,this.up),this.quaternion.setFromRotationMatrix(Bi),n&&(Bi.extractRotation(n.matrixWorld),Yn.setFromRotationMatrix(Bi),this.quaternion.premultiply(Yn.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(Au),Jn.child=e,this.dispatchEvent(Jn),Jn.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.remove(arguments[i]);return this}let t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(dp),Ko.child=e,this.dispatchEvent(Ko),Ko.child=null),this}removeFromParent(){let e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),Bi.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),Bi.multiply(e.parent.matrixWorld)),e.applyMatrix4(Bi),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(Au),Jn.child=e,this.dispatchEvent(Jn),Jn.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let i=0,n=this.children.length;i<n;i++){let a=this.children[i].getObjectByProperty(e,t);if(a!==void 0)return a}}getObjectsByProperty(e,t,i=[]){this[e]===t&&i.push(this);let n=this.children;for(let s=0,a=n.length;s<a;s++)n[s].getObjectsByProperty(e,t,i);return i}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Br,e,cp),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Br,up,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);let t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);let t=this.children;for(let i=0,n=t.length;i<n;i++)t[i].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);let t=this.children;for(let i=0,n=t.length;i<n;i++)t[i].traverseVisible(e)}traverseAncestors(e){let t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);let t=this.children;for(let i=0,n=t.length;i<n;i++)t[i].updateMatrixWorld(e)}updateWorldMatrix(e,t){let i=this.parent;if(e===!0&&i!==null&&i.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),t===!0){let n=this.children;for(let s=0,a=n.length;s<a;s++)n[s].updateWorldMatrix(!1,!0)}}toJSON(e){let t=e===void 0||typeof e=="string",i={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},i.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});let n={};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.castShadow===!0&&(n.castShadow=!0),this.receiveShadow===!0&&(n.receiveShadow=!0),this.visible===!1&&(n.visible=!1),this.frustumCulled===!1&&(n.frustumCulled=!1),this.renderOrder!==0&&(n.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(n.userData=this.userData),n.layers=this.layers.mask,n.matrix=this.matrix.toArray(),n.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(n.matrixAutoUpdate=!1),this.isInstancedMesh&&(n.type="InstancedMesh",n.count=this.count,n.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(n.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(n.type="BatchedMesh",n.perObjectFrustumCulled=this.perObjectFrustumCulled,n.sortObjects=this.sortObjects,n.drawRanges=this._drawRanges,n.reservedRanges=this._reservedRanges,n.geometryInfo=this._geometryInfo.map(o=>({...o,boundingBox:o.boundingBox?o.boundingBox.toJSON():void 0,boundingSphere:o.boundingSphere?o.boundingSphere.toJSON():void 0})),n.instanceInfo=this._instanceInfo.map(o=>({...o})),n.availableInstanceIds=this._availableInstanceIds.slice(),n.availableGeometryIds=this._availableGeometryIds.slice(),n.nextIndexStart=this._nextIndexStart,n.nextVertexStart=this._nextVertexStart,n.geometryCount=this._geometryCount,n.maxInstanceCount=this._maxInstanceCount,n.maxVertexCount=this._maxVertexCount,n.maxIndexCount=this._maxIndexCount,n.geometryInitialized=this._geometryInitialized,n.matricesTexture=this._matricesTexture.toJSON(e),n.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(n.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(n.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(n.boundingBox=this.boundingBox.toJSON()));function s(o,l){return o[l.uuid]===void 0&&(o[l.uuid]=l.toJSON(e)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?n.background=this.background.toJSON():this.background.isTexture&&(n.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(n.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){n.geometry=s(e.geometries,this.geometry);let o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){let l=o.shapes;if(Array.isArray(l))for(let c=0,d=l.length;c<d;c++){let u=l[c];s(e.shapes,u)}else s(e.shapes,l)}}if(this.isSkinnedMesh&&(n.bindMode=this.bindMode,n.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(s(e.skeletons,this.skeleton),n.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){let o=[];for(let l=0,c=this.material.length;l<c;l++)o.push(s(e.materials,this.material[l]));n.material=o}else n.material=s(e.materials,this.material);if(this.children.length>0){n.children=[];for(let o=0;o<this.children.length;o++)n.children.push(this.children[o].toJSON(e).object)}if(this.animations.length>0){n.animations=[];for(let o=0;o<this.animations.length;o++){let l=this.animations[o];n.animations.push(s(e.animations,l))}}if(t){let o=a(e.geometries),l=a(e.materials),c=a(e.textures),d=a(e.images),u=a(e.shapes),h=a(e.skeletons),m=a(e.animations),y=a(e.nodes);o.length>0&&(i.geometries=o),l.length>0&&(i.materials=l),c.length>0&&(i.textures=c),d.length>0&&(i.images=d),u.length>0&&(i.shapes=u),h.length>0&&(i.skeletons=h),m.length>0&&(i.animations=m),y.length>0&&(i.nodes=y)}return i.object=n,i;function a(o){let l=[];for(let c in o){let d=o[c];delete d.metadata,l.push(d)}return l}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let i=0;i<e.children.length;i++){let n=e.children[i];this.add(n.clone())}return this}};rt.DEFAULT_UP=new L(0,1,0);rt.DEFAULT_MATRIX_AUTO_UPDATE=!0;rt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;var ci=new L,Ui=new L,Yo=new L,zi=new L,Zn=new L,Qn=new L,ku=new L,Jo=new L,Zo=new L,Qo=new L,el=new Ye,tl=new Ye,il=new Ye,rn=class r{constructor(e=new L,t=new L,i=new L){this.a=e,this.b=t,this.c=i}static getNormal(e,t,i,n){n.subVectors(i,t),ci.subVectors(e,t),n.cross(ci);let s=n.lengthSq();return s>0?n.multiplyScalar(1/Math.sqrt(s)):n.set(0,0,0)}static getBarycoord(e,t,i,n,s){ci.subVectors(n,t),Ui.subVectors(i,t),Yo.subVectors(e,t);let a=ci.dot(ci),o=ci.dot(Ui),l=ci.dot(Yo),c=Ui.dot(Ui),d=Ui.dot(Yo),u=a*c-o*o;if(u===0)return s.set(0,0,0),null;let h=1/u,m=(c*l-o*d)*h,y=(a*d-o*l)*h;return s.set(1-m-y,y,m)}static containsPoint(e,t,i,n){return this.getBarycoord(e,t,i,n,zi)===null?!1:zi.x>=0&&zi.y>=0&&zi.x+zi.y<=1}static getInterpolation(e,t,i,n,s,a,o,l){return this.getBarycoord(e,t,i,n,zi)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(s,zi.x),l.addScaledVector(a,zi.y),l.addScaledVector(o,zi.z),l)}static getInterpolatedAttribute(e,t,i,n,s,a){return el.setScalar(0),tl.setScalar(0),il.setScalar(0),el.fromBufferAttribute(e,t),tl.fromBufferAttribute(e,i),il.fromBufferAttribute(e,n),a.setScalar(0),a.addScaledVector(el,s.x),a.addScaledVector(tl,s.y),a.addScaledVector(il,s.z),a}static isFrontFacing(e,t,i,n){return ci.subVectors(i,t),Ui.subVectors(e,t),ci.cross(Ui).dot(n)<0}set(e,t,i){return this.a.copy(e),this.b.copy(t),this.c.copy(i),this}setFromPointsAndIndices(e,t,i,n){return this.a.copy(e[t]),this.b.copy(e[i]),this.c.copy(e[n]),this}setFromAttributeAndIndices(e,t,i,n){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,i),this.c.fromBufferAttribute(e,n),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return ci.subVectors(this.c,this.b),Ui.subVectors(this.a,this.b),ci.cross(Ui).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return r.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return r.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,i,n,s){return r.getInterpolation(e,this.a,this.b,this.c,t,i,n,s)}containsPoint(e){return r.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return r.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){let i=this.a,n=this.b,s=this.c,a,o;Zn.subVectors(n,i),Qn.subVectors(s,i),Jo.subVectors(e,i);let l=Zn.dot(Jo),c=Qn.dot(Jo);if(l<=0&&c<=0)return t.copy(i);Zo.subVectors(e,n);let d=Zn.dot(Zo),u=Qn.dot(Zo);if(d>=0&&u<=d)return t.copy(n);let h=l*u-d*c;if(h<=0&&l>=0&&d<=0)return a=l/(l-d),t.copy(i).addScaledVector(Zn,a);Qo.subVectors(e,s);let m=Zn.dot(Qo),y=Qn.dot(Qo);if(y>=0&&m<=y)return t.copy(s);let b=m*c-l*y;if(b<=0&&c>=0&&y<=0)return o=c/(c-y),t.copy(i).addScaledVector(Qn,o);let p=d*y-m*u;if(p<=0&&u-d>=0&&m-y>=0)return ku.subVectors(s,n),o=(u-d)/(u-d+(m-y)),t.copy(n).addScaledVector(ku,o);let f=1/(p+b+h);return a=b*f,o=h*f,t.copy(i).addScaledVector(Zn,a).addScaledVector(Qn,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}},Hd={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},tn={h:0,s:0,l:0},js={h:0,s:0,l:0};function nl(r,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?r+(e-r)*6*t:t<1/2?e:t<2/3?r+(e-r)*6*(2/3-t):r}var Me=class{constructor(e,t,i){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,i)}set(e,t,i){if(t===void 0&&i===void 0){let n=e;n&&n.isColor?this.copy(n):typeof n=="number"?this.setHex(n):typeof n=="string"&&this.setStyle(n)}else this.setRGB(e,t,i);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=ft){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,Ve.colorSpaceToWorking(this,t),this}setRGB(e,t,i,n=Ve.workingColorSpace){return this.r=e,this.g=t,this.b=i,Ve.colorSpaceToWorking(this,n),this}setHSL(e,t,i,n=Ve.workingColorSpace){if(e=Bl(e,1),t=He(t,0,1),i=He(i,0,1),t===0)this.r=this.g=this.b=i;else{let s=i<=.5?i*(1+t):i+t-i*t,a=2*i-s;this.r=nl(a,s,e+1/3),this.g=nl(a,s,e),this.b=nl(a,s,e-1/3)}return Ve.colorSpaceToWorking(this,n),this}setStyle(e,t=ft){function i(s){s!==void 0&&parseFloat(s)<1&&console.warn("THREE.Color: Alpha component of "+e+" will be ignored.")}let n;if(n=/^(\w+)\(([^\)]*)\)/.exec(e)){let s,a=n[1],o=n[2];switch(a){case"rgb":case"rgba":if(s=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(s[4]),this.setRGB(Math.min(255,parseInt(s[1],10))/255,Math.min(255,parseInt(s[2],10))/255,Math.min(255,parseInt(s[3],10))/255,t);if(s=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(s[4]),this.setRGB(Math.min(100,parseInt(s[1],10))/100,Math.min(100,parseInt(s[2],10))/100,Math.min(100,parseInt(s[3],10))/100,t);break;case"hsl":case"hsla":if(s=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(s[4]),this.setHSL(parseFloat(s[1])/360,parseFloat(s[2])/100,parseFloat(s[3])/100,t);break;default:console.warn("THREE.Color: Unknown color model "+e)}}else if(n=/^\#([A-Fa-f\d]+)$/.exec(e)){let s=n[1],a=s.length;if(a===3)return this.setRGB(parseInt(s.charAt(0),16)/15,parseInt(s.charAt(1),16)/15,parseInt(s.charAt(2),16)/15,t);if(a===6)return this.setHex(parseInt(s,16),t);console.warn("THREE.Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=ft){let i=Hd[e.toLowerCase()];return i!==void 0?this.setHex(i,t):console.warn("THREE.Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=ji(e.r),this.g=ji(e.g),this.b=ji(e.b),this}copyLinearToSRGB(e){return this.r=sr(e.r),this.g=sr(e.g),this.b=sr(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=ft){return Ve.workingToColorSpace(Nt.copy(this),e),Math.round(He(Nt.r*255,0,255))*65536+Math.round(He(Nt.g*255,0,255))*256+Math.round(He(Nt.b*255,0,255))}getHexString(e=ft){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=Ve.workingColorSpace){Ve.workingToColorSpace(Nt.copy(this),t);let i=Nt.r,n=Nt.g,s=Nt.b,a=Math.max(i,n,s),o=Math.min(i,n,s),l,c,d=(o+a)/2;if(o===a)l=0,c=0;else{let u=a-o;switch(c=d<=.5?u/(a+o):u/(2-a-o),a){case i:l=(n-s)/u+(n<s?6:0);break;case n:l=(s-i)/u+2;break;case s:l=(i-n)/u+4;break}l/=6}return e.h=l,e.s=c,e.l=d,e}getRGB(e,t=Ve.workingColorSpace){return Ve.workingToColorSpace(Nt.copy(this),t),e.r=Nt.r,e.g=Nt.g,e.b=Nt.b,e}getStyle(e=ft){Ve.workingToColorSpace(Nt.copy(this),e);let t=Nt.r,i=Nt.g,n=Nt.b;return e!==ft?`color(${e} ${t.toFixed(3)} ${i.toFixed(3)} ${n.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(i*255)},${Math.round(n*255)})`}offsetHSL(e,t,i){return this.getHSL(tn),this.setHSL(tn.h+e,tn.s+t,tn.l+i)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,i){return this.r=e.r+(t.r-e.r)*i,this.g=e.g+(t.g-e.g)*i,this.b=e.b+(t.b-e.b)*i,this}lerpHSL(e,t){this.getHSL(tn),e.getHSL(js);let i=Wr(tn.h,js.h,t),n=Wr(tn.s,js.s,t),s=Wr(tn.l,js.l,t);return this.setHSL(i,n,s),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){let t=this.r,i=this.g,n=this.b,s=e.elements;return this.r=s[0]*t+s[3]*i+s[6]*n,this.g=s[1]*t+s[4]*i+s[7]*n,this.b=s[2]*t+s[5]*i+s[8]*n,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}},Nt=new Me;Me.NAMES=Hd;var hp=0,Ht=class extends _i{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:hp++}),this.uuid=hi(),this.name="",this.type="Material",this.blending=wn,this.side=fi,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=aa,this.blendDst=oa,this.blendEquation=sn,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Me(0,0,0),this.blendAlpha=0,this.depthFunc=Mn,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=pl,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=vn,this.stencilZFail=vn,this.stencilZPass=vn,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(let t in e){let i=e[t];if(i===void 0){console.warn(`THREE.Material: parameter '${t}' has value of undefined.`);continue}let n=this[t];if(n===void 0){console.warn(`THREE.Material: '${t}' is not a property of THREE.${this.type}.`);continue}n&&n.isColor?n.set(i):n&&n.isVector3&&i&&i.isVector3?n.copy(i):this[t]=i}}toJSON(e){let t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});let i={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.color&&this.color.isColor&&(i.color=this.color.getHex()),this.roughness!==void 0&&(i.roughness=this.roughness),this.metalness!==void 0&&(i.metalness=this.metalness),this.sheen!==void 0&&(i.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(i.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(i.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(i.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(i.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(i.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(i.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(i.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(i.shininess=this.shininess),this.clearcoat!==void 0&&(i.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(i.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(i.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(i.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,i.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(i.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(i.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(i.dispersion=this.dispersion),this.iridescence!==void 0&&(i.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(i.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(i.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(i.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(i.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(i.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(i.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(i.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(i.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(i.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(i.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(i.lightMap=this.lightMap.toJSON(e).uuid,i.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(i.aoMap=this.aoMap.toJSON(e).uuid,i.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(i.bumpMap=this.bumpMap.toJSON(e).uuid,i.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(i.normalMap=this.normalMap.toJSON(e).uuid,i.normalMapType=this.normalMapType,i.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(i.displacementMap=this.displacementMap.toJSON(e).uuid,i.displacementScale=this.displacementScale,i.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(i.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(i.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(i.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(i.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(i.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(i.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(i.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(i.combine=this.combine)),this.envMapRotation!==void 0&&(i.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(i.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(i.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(i.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(i.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(i.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(i.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(i.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(i.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(i.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(i.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(i.size=this.size),this.shadowSide!==null&&(i.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(i.sizeAttenuation=this.sizeAttenuation),this.blending!==wn&&(i.blending=this.blending),this.side!==fi&&(i.side=this.side),this.vertexColors===!0&&(i.vertexColors=!0),this.opacity<1&&(i.opacity=this.opacity),this.transparent===!0&&(i.transparent=!0),this.blendSrc!==aa&&(i.blendSrc=this.blendSrc),this.blendDst!==oa&&(i.blendDst=this.blendDst),this.blendEquation!==sn&&(i.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(i.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(i.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(i.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(i.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(i.blendAlpha=this.blendAlpha),this.depthFunc!==Mn&&(i.depthFunc=this.depthFunc),this.depthTest===!1&&(i.depthTest=this.depthTest),this.depthWrite===!1&&(i.depthWrite=this.depthWrite),this.colorWrite===!1&&(i.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(i.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==pl&&(i.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(i.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(i.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==vn&&(i.stencilFail=this.stencilFail),this.stencilZFail!==vn&&(i.stencilZFail=this.stencilZFail),this.stencilZPass!==vn&&(i.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(i.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(i.rotation=this.rotation),this.polygonOffset===!0&&(i.polygonOffset=!0),this.polygonOffsetFactor!==0&&(i.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(i.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(i.linewidth=this.linewidth),this.dashSize!==void 0&&(i.dashSize=this.dashSize),this.gapSize!==void 0&&(i.gapSize=this.gapSize),this.scale!==void 0&&(i.scale=this.scale),this.dithering===!0&&(i.dithering=!0),this.alphaTest>0&&(i.alphaTest=this.alphaTest),this.alphaHash===!0&&(i.alphaHash=!0),this.alphaToCoverage===!0&&(i.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(i.premultipliedAlpha=!0),this.forceSinglePass===!0&&(i.forceSinglePass=!0),this.wireframe===!0&&(i.wireframe=!0),this.wireframeLinewidth>1&&(i.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(i.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(i.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(i.flatShading=!0),this.visible===!1&&(i.visible=!1),this.toneMapped===!1&&(i.toneMapped=!1),this.fog===!1&&(i.fog=!1),Object.keys(this.userData).length>0&&(i.userData=this.userData);function n(s){let a=[];for(let o in s){let l=s[o];delete l.metadata,a.push(l)}return a}if(t){let s=n(e.textures),a=n(e.images);s.length>0&&(i.textures=s),a.length>0&&(i.images=a)}return i}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;let t=e.clippingPlanes,i=null;if(t!==null){let n=t.length;i=new Array(n);for(let s=0;s!==n;++s)i[s]=t[s].clone()}return this.clippingPlanes=i,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}},jt=class extends Ht{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Me(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new ni,this.combine=Pa,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}};var gt=new L,Gs=new Oe,fp=0,wt=class{constructor(e,t,i=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:fp++}),this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=i,this.usage=lr,this.updateRanges=[],this.gpuType=ri,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,i){e*=this.itemSize,i*=t.itemSize;for(let n=0,s=this.itemSize;n<s;n++)this.array[e+n]=t.array[i+n];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,i=this.count;t<i;t++)Gs.fromBufferAttribute(this,t),Gs.applyMatrix3(e),this.setXY(t,Gs.x,Gs.y);else if(this.itemSize===3)for(let t=0,i=this.count;t<i;t++)gt.fromBufferAttribute(this,t),gt.applyMatrix3(e),this.setXYZ(t,gt.x,gt.y,gt.z);return this}applyMatrix4(e){for(let t=0,i=this.count;t<i;t++)gt.fromBufferAttribute(this,t),gt.applyMatrix4(e),this.setXYZ(t,gt.x,gt.y,gt.z);return this}applyNormalMatrix(e){for(let t=0,i=this.count;t<i;t++)gt.fromBufferAttribute(this,t),gt.applyNormalMatrix(e),this.setXYZ(t,gt.x,gt.y,gt.z);return this}transformDirection(e){for(let t=0,i=this.count;t<i;t++)gt.fromBufferAttribute(this,t),gt.transformDirection(e),this.setXYZ(t,gt.x,gt.y,gt.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let i=this.array[e*this.itemSize+t];return this.normalized&&(i=ui(i,this.array)),i}setComponent(e,t,i){return this.normalized&&(i=Ze(i,this.array)),this.array[e*this.itemSize+t]=i,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=ui(t,this.array)),t}setX(e,t){return this.normalized&&(t=Ze(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=ui(t,this.array)),t}setY(e,t){return this.normalized&&(t=Ze(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=ui(t,this.array)),t}setZ(e,t){return this.normalized&&(t=Ze(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=ui(t,this.array)),t}setW(e,t){return this.normalized&&(t=Ze(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,i){return e*=this.itemSize,this.normalized&&(t=Ze(t,this.array),i=Ze(i,this.array)),this.array[e+0]=t,this.array[e+1]=i,this}setXYZ(e,t,i,n){return e*=this.itemSize,this.normalized&&(t=Ze(t,this.array),i=Ze(i,this.array),n=Ze(n,this.array)),this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=n,this}setXYZW(e,t,i,n,s){return e*=this.itemSize,this.normalized&&(t=Ze(t,this.array),i=Ze(i,this.array),n=Ze(n,this.array),s=Ze(s,this.array)),this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=n,this.array[e+3]=s,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==lr&&(e.usage=this.usage),e}};var Jr=class extends wt{constructor(e,t,i){super(new Uint16Array(e),t,i)}};var Zr=class extends wt{constructor(e,t,i){super(new Uint32Array(e),t,i)}};var nt=class extends wt{constructor(e,t,i){super(new Float32Array(e),t,i)}},pp=0,ii=new Be,rl=new rt,er=new L,Zt=new Pt,Ur=new Pt,Et=new L,Ct=class r extends _i{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:pp++}),this.uuid=hi(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(zl(e)?Zr:Jr)(e,1):this.index=e,this}setIndirect(e){return this.indirect=e,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,i=0){this.groups.push({start:e,count:t,materialIndex:i})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){let t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);let i=this.attributes.normal;if(i!==void 0){let s=new Fe().getNormalMatrix(e);i.applyNormalMatrix(s),i.needsUpdate=!0}let n=this.attributes.tangent;return n!==void 0&&(n.transformDirection(e),n.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return ii.makeRotationFromQuaternion(e),this.applyMatrix4(ii),this}rotateX(e){return ii.makeRotationX(e),this.applyMatrix4(ii),this}rotateY(e){return ii.makeRotationY(e),this.applyMatrix4(ii),this}rotateZ(e){return ii.makeRotationZ(e),this.applyMatrix4(ii),this}translate(e,t,i){return ii.makeTranslation(e,t,i),this.applyMatrix4(ii),this}scale(e,t,i){return ii.makeScale(e,t,i),this.applyMatrix4(ii),this}lookAt(e){return rl.lookAt(e),rl.updateMatrix(),this.applyMatrix4(rl.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(er).negate(),this.translate(er.x,er.y,er.z),this}setFromPoints(e){let t=this.getAttribute("position");if(t===void 0){let i=[];for(let n=0,s=e.length;n<s;n++){let a=e[n];i.push(a.x,a.y,a.z||0)}this.setAttribute("position",new nt(i,3))}else{let i=Math.min(e.length,t.count);for(let n=0;n<i;n++){let s=e[n];t.setXYZ(n,s.x,s.y,s.z||0)}e.length>t.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Pt);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new L(-1/0,-1/0,-1/0),new L(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let i=0,n=t.length;i<n;i++){let s=t[i];Zt.setFromBufferAttribute(s),this.morphTargetsRelative?(Et.addVectors(this.boundingBox.min,Zt.min),this.boundingBox.expandByPoint(Et),Et.addVectors(this.boundingBox.max,Zt.max),this.boundingBox.expandByPoint(Et)):(this.boundingBox.expandByPoint(Zt.min),this.boundingBox.expandByPoint(Zt.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new qt);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new L,1/0);return}if(e){let i=this.boundingSphere.center;if(Zt.setFromBufferAttribute(e),t)for(let s=0,a=t.length;s<a;s++){let o=t[s];Ur.setFromBufferAttribute(o),this.morphTargetsRelative?(Et.addVectors(Zt.min,Ur.min),Zt.expandByPoint(Et),Et.addVectors(Zt.max,Ur.max),Zt.expandByPoint(Et)):(Zt.expandByPoint(Ur.min),Zt.expandByPoint(Ur.max))}Zt.getCenter(i);let n=0;for(let s=0,a=e.count;s<a;s++)Et.fromBufferAttribute(e,s),n=Math.max(n,i.distanceToSquared(Et));if(t)for(let s=0,a=t.length;s<a;s++){let o=t[s],l=this.morphTargetsRelative;for(let c=0,d=o.count;c<d;c++)Et.fromBufferAttribute(o,c),l&&(er.fromBufferAttribute(e,c),Et.add(er)),n=Math.max(n,i.distanceToSquared(Et))}this.boundingSphere.radius=Math.sqrt(n),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){let e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}let i=t.position,n=t.normal,s=t.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new wt(new Float32Array(4*i.count),4));let a=this.getAttribute("tangent"),o=[],l=[];for(let P=0;P<i.count;P++)o[P]=new L,l[P]=new L;let c=new L,d=new L,u=new L,h=new Oe,m=new Oe,y=new Oe,b=new L,p=new L;function f(P,_,M){c.fromBufferAttribute(i,P),d.fromBufferAttribute(i,_),u.fromBufferAttribute(i,M),h.fromBufferAttribute(s,P),m.fromBufferAttribute(s,_),y.fromBufferAttribute(s,M),d.sub(c),u.sub(c),m.sub(h),y.sub(h);let R=1/(m.x*y.y-y.x*m.y);isFinite(R)&&(b.copy(d).multiplyScalar(y.y).addScaledVector(u,-m.y).multiplyScalar(R),p.copy(u).multiplyScalar(m.x).addScaledVector(d,-y.x).multiplyScalar(R),o[P].add(b),o[_].add(b),o[M].add(b),l[P].add(p),l[_].add(p),l[M].add(p))}let x=this.groups;x.length===0&&(x=[{start:0,count:e.count}]);for(let P=0,_=x.length;P<_;++P){let M=x[P],R=M.start,F=M.count;for(let j=R,W=R+F;j<W;j+=3)f(e.getX(j+0),e.getX(j+1),e.getX(j+2))}let g=new L,v=new L,T=new L,A=new L;function E(P){T.fromBufferAttribute(n,P),A.copy(T);let _=o[P];g.copy(_),g.sub(T.multiplyScalar(T.dot(_))).normalize(),v.crossVectors(A,_);let R=v.dot(l[P])<0?-1:1;a.setXYZW(P,g.x,g.y,g.z,R)}for(let P=0,_=x.length;P<_;++P){let M=x[P],R=M.start,F=M.count;for(let j=R,W=R+F;j<W;j+=3)E(e.getX(j+0)),E(e.getX(j+1)),E(e.getX(j+2))}}computeVertexNormals(){let e=this.index,t=this.getAttribute("position");if(t!==void 0){let i=this.getAttribute("normal");if(i===void 0)i=new wt(new Float32Array(t.count*3),3),this.setAttribute("normal",i);else for(let h=0,m=i.count;h<m;h++)i.setXYZ(h,0,0,0);let n=new L,s=new L,a=new L,o=new L,l=new L,c=new L,d=new L,u=new L;if(e)for(let h=0,m=e.count;h<m;h+=3){let y=e.getX(h+0),b=e.getX(h+1),p=e.getX(h+2);n.fromBufferAttribute(t,y),s.fromBufferAttribute(t,b),a.fromBufferAttribute(t,p),d.subVectors(a,s),u.subVectors(n,s),d.cross(u),o.fromBufferAttribute(i,y),l.fromBufferAttribute(i,b),c.fromBufferAttribute(i,p),o.add(d),l.add(d),c.add(d),i.setXYZ(y,o.x,o.y,o.z),i.setXYZ(b,l.x,l.y,l.z),i.setXYZ(p,c.x,c.y,c.z)}else for(let h=0,m=t.count;h<m;h+=3)n.fromBufferAttribute(t,h+0),s.fromBufferAttribute(t,h+1),a.fromBufferAttribute(t,h+2),d.subVectors(a,s),u.subVectors(n,s),d.cross(u),i.setXYZ(h+0,d.x,d.y,d.z),i.setXYZ(h+1,d.x,d.y,d.z),i.setXYZ(h+2,d.x,d.y,d.z);this.normalizeNormals(),i.needsUpdate=!0}}normalizeNormals(){let e=this.attributes.normal;for(let t=0,i=e.count;t<i;t++)Et.fromBufferAttribute(e,t),Et.normalize(),e.setXYZ(t,Et.x,Et.y,Et.z)}toNonIndexed(){function e(o,l){let c=o.array,d=o.itemSize,u=o.normalized,h=new c.constructor(l.length*d),m=0,y=0;for(let b=0,p=l.length;b<p;b++){o.isInterleavedBufferAttribute?m=l[b]*o.data.stride+o.offset:m=l[b]*d;for(let f=0;f<d;f++)h[y++]=c[m++]}return new wt(h,d,u)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;let t=new r,i=this.index.array,n=this.attributes;for(let o in n){let l=n[o],c=e(l,i);t.setAttribute(o,c)}let s=this.morphAttributes;for(let o in s){let l=[],c=s[o];for(let d=0,u=c.length;d<u;d++){let h=c[d],m=e(h,i);l.push(m)}t.morphAttributes[o]=l}t.morphTargetsRelative=this.morphTargetsRelative;let a=this.groups;for(let o=0,l=a.length;o<l;o++){let c=a[o];t.addGroup(c.start,c.count,c.materialIndex)}return t}toJSON(){let e={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){let l=this.parameters;for(let c in l)l[c]!==void 0&&(e[c]=l[c]);return e}e.data={attributes:{}};let t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});let i=this.attributes;for(let l in i){let c=i[l];e.data.attributes[l]=c.toJSON(e.data)}let n={},s=!1;for(let l in this.morphAttributes){let c=this.morphAttributes[l],d=[];for(let u=0,h=c.length;u<h;u++){let m=c[u];d.push(m.toJSON(e.data))}d.length>0&&(n[l]=d,s=!0)}s&&(e.data.morphAttributes=n,e.data.morphTargetsRelative=this.morphTargetsRelative);let a=this.groups;a.length>0&&(e.data.groups=JSON.parse(JSON.stringify(a)));let o=this.boundingSphere;return o!==null&&(e.data.boundingSphere=o.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let t={};this.name=e.name;let i=e.index;i!==null&&this.setIndex(i.clone());let n=e.attributes;for(let c in n){let d=n[c];this.setAttribute(c,d.clone(t))}let s=e.morphAttributes;for(let c in s){let d=[],u=s[c];for(let h=0,m=u.length;h<m;h++)d.push(u[h].clone(t));this.morphAttributes[c]=d}this.morphTargetsRelative=e.morphTargetsRelative;let a=e.groups;for(let c=0,d=a.length;c<d;c++){let u=a[c];this.addGroup(u.start,u.count,u.materialIndex)}let o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());let l=e.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}},Eu=new Be,yn=new An,Vs=new qt,Cu=new L,Ws=new L,qs=new L,$s=new L,sl=new L,Xs=new L,Ru=new L,Ks=new L,We=class extends rt{constructor(e=new Ct,t=new jt){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){let t=this.geometry.morphAttributes,i=Object.keys(t);if(i.length>0){let n=t[i[0]];if(n!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,a=n.length;s<a;s++){let o=n[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=s}}}}getVertexPosition(e,t){let i=this.geometry,n=i.attributes.position,s=i.morphAttributes.position,a=i.morphTargetsRelative;t.fromBufferAttribute(n,e);let o=this.morphTargetInfluences;if(s&&o){Xs.set(0,0,0);for(let l=0,c=s.length;l<c;l++){let d=o[l],u=s[l];d!==0&&(sl.fromBufferAttribute(u,e),a?Xs.addScaledVector(sl,d):Xs.addScaledVector(sl.sub(t),d))}t.add(Xs)}return t}raycast(e,t){let i=this.geometry,n=this.material,s=this.matrixWorld;n!==void 0&&(i.boundingSphere===null&&i.computeBoundingSphere(),Vs.copy(i.boundingSphere),Vs.applyMatrix4(s),yn.copy(e.ray).recast(e.near),!(Vs.containsPoint(yn.origin)===!1&&(yn.intersectSphere(Vs,Cu)===null||yn.origin.distanceToSquared(Cu)>(e.far-e.near)**2))&&(Eu.copy(s).invert(),yn.copy(e.ray).applyMatrix4(Eu),!(i.boundingBox!==null&&yn.intersectsBox(i.boundingBox)===!1)&&this._computeIntersections(e,t,yn)))}_computeIntersections(e,t,i){let n,s=this.geometry,a=this.material,o=s.index,l=s.attributes.position,c=s.attributes.uv,d=s.attributes.uv1,u=s.attributes.normal,h=s.groups,m=s.drawRange;if(o!==null)if(Array.isArray(a))for(let y=0,b=h.length;y<b;y++){let p=h[y],f=a[p.materialIndex],x=Math.max(p.start,m.start),g=Math.min(o.count,Math.min(p.start+p.count,m.start+m.count));for(let v=x,T=g;v<T;v+=3){let A=o.getX(v),E=o.getX(v+1),P=o.getX(v+2);n=Ys(this,f,e,i,c,d,u,A,E,P),n&&(n.faceIndex=Math.floor(v/3),n.face.materialIndex=p.materialIndex,t.push(n))}}else{let y=Math.max(0,m.start),b=Math.min(o.count,m.start+m.count);for(let p=y,f=b;p<f;p+=3){let x=o.getX(p),g=o.getX(p+1),v=o.getX(p+2);n=Ys(this,a,e,i,c,d,u,x,g,v),n&&(n.faceIndex=Math.floor(p/3),t.push(n))}}else if(l!==void 0)if(Array.isArray(a))for(let y=0,b=h.length;y<b;y++){let p=h[y],f=a[p.materialIndex],x=Math.max(p.start,m.start),g=Math.min(l.count,Math.min(p.start+p.count,m.start+m.count));for(let v=x,T=g;v<T;v+=3){let A=v,E=v+1,P=v+2;n=Ys(this,f,e,i,c,d,u,A,E,P),n&&(n.faceIndex=Math.floor(v/3),n.face.materialIndex=p.materialIndex,t.push(n))}}else{let y=Math.max(0,m.start),b=Math.min(l.count,m.start+m.count);for(let p=y,f=b;p<f;p+=3){let x=p,g=p+1,v=p+2;n=Ys(this,a,e,i,c,d,u,x,g,v),n&&(n.faceIndex=Math.floor(p/3),t.push(n))}}}};function mp(r,e,t,i,n,s,a,o){let l;if(e.side===Vt?l=i.intersectTriangle(a,s,n,!0,o):l=i.intersectTriangle(n,s,a,e.side===fi,o),l===null)return null;Ks.copy(o),Ks.applyMatrix4(r.matrixWorld);let c=t.ray.origin.distanceTo(Ks);return c<t.near||c>t.far?null:{distance:c,point:Ks.clone(),object:r}}function Ys(r,e,t,i,n,s,a,o,l,c){r.getVertexPosition(o,Ws),r.getVertexPosition(l,qs),r.getVertexPosition(c,$s);let d=mp(r,e,t,i,Ws,qs,$s,Ru);if(d){let u=new L;rn.getBarycoord(Ru,Ws,qs,$s,u),n&&(d.uv=rn.getInterpolatedAttribute(n,o,l,c,u,new Oe)),s&&(d.uv1=rn.getInterpolatedAttribute(s,o,l,c,u,new Oe)),a&&(d.normal=rn.getInterpolatedAttribute(a,o,l,c,u,new L),d.normal.dot(i.direction)>0&&d.normal.multiplyScalar(-1));let h={a:o,b:l,c,normal:new L,materialIndex:0};rn.getNormal(Ws,qs,$s,h.normal),d.face=h,d.barycoord=u}return d}var Gt=class r extends Ct{constructor(e=1,t=1,i=1,n=1,s=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:i,widthSegments:n,heightSegments:s,depthSegments:a};let o=this;n=Math.floor(n),s=Math.floor(s),a=Math.floor(a);let l=[],c=[],d=[],u=[],h=0,m=0;y("z","y","x",-1,-1,i,t,e,a,s,0),y("z","y","x",1,-1,i,t,-e,a,s,1),y("x","z","y",1,1,e,i,t,n,a,2),y("x","z","y",1,-1,e,i,-t,n,a,3),y("x","y","z",1,-1,e,t,i,n,s,4),y("x","y","z",-1,-1,e,t,-i,n,s,5),this.setIndex(l),this.setAttribute("position",new nt(c,3)),this.setAttribute("normal",new nt(d,3)),this.setAttribute("uv",new nt(u,2));function y(b,p,f,x,g,v,T,A,E,P,_){let M=v/E,R=T/P,F=v/2,j=T/2,W=A/2,K=E+1,C=P+1,U=0,O=0,z=new L;for(let Y=0;Y<C;Y++){let re=Y*R-j;for(let Te=0;Te<K;Te++){let qe=Te*M-F;z[b]=qe*x,z[p]=re*g,z[f]=W,c.push(z.x,z.y,z.z),z[b]=0,z[p]=0,z[f]=A>0?1:-1,d.push(z.x,z.y,z.z),u.push(Te/E),u.push(1-Y/P),U+=1}}for(let Y=0;Y<P;Y++)for(let re=0;re<E;re++){let Te=h+re+K*Y,qe=h+re+K*(Y+1),Le=h+(re+1)+K*(Y+1),Xe=h+(re+1)+K*Y;l.push(Te,qe,Xe),l.push(qe,Le,Xe),O+=6}o.addGroup(m,O,_),m+=O,h+=U}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new r(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}};function Fn(r){let e={};for(let t in r){e[t]={};for(let i in r[t]){let n=r[t][i];n&&(n.isColor||n.isMatrix3||n.isMatrix4||n.isVector2||n.isVector3||n.isVector4||n.isTexture||n.isQuaternion)?n.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][i]=null):e[t][i]=n.clone():Array.isArray(n)?e[t][i]=n.slice():e[t][i]=n}}return e}function Ft(r){let e={};for(let t=0;t<r.length;t++){let i=Fn(r[t]);for(let n in i)e[n]=i[n]}return e}function yp(r){let e=[];for(let t=0;t<r.length;t++)e.push(r[t].clone());return e}function Hl(r){let e=r.getRenderTarget();return e===null?r.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:Ve.workingColorSpace}var jd={clone:Fn,merge:Ft},bp=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,vp=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,pi=class extends Ht{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=bp,this.fragmentShader=vp,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=Fn(e.uniforms),this.uniformsGroups=yp(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){let t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(let n in this.uniforms){let a=this.uniforms[n].value;a&&a.isTexture?t.uniforms[n]={type:"t",value:a.toJSON(e).uuid}:a&&a.isColor?t.uniforms[n]={type:"c",value:a.getHex()}:a&&a.isVector2?t.uniforms[n]={type:"v2",value:a.toArray()}:a&&a.isVector3?t.uniforms[n]={type:"v3",value:a.toArray()}:a&&a.isVector4?t.uniforms[n]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?t.uniforms[n]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?t.uniforms[n]={type:"m4",value:a.toArray()}:t.uniforms[n]={value:a}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;let i={};for(let n in this.extensions)this.extensions[n]===!0&&(i[n]=!0);return Object.keys(i).length>0&&(t.extensions=i),t}},Qr=class extends rt{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new Be,this.projectionMatrix=new Be,this.projectionMatrixInverse=new Be,this.coordinateSystem=di,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}},nn=new L,Iu=new Oe,Pu=new Oe,xt=class extends Qr{constructor(e=50,t=1,i=.1,n=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=i,this.far=n,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){let t=.5*this.getFilmHeight()/e;this.fov=Tn*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){let e=Math.tan(Vr*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return Tn*2*Math.atan(Math.tan(Vr*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,i){nn.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(nn.x,nn.y).multiplyScalar(-e/nn.z),nn.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),i.set(nn.x,nn.y).multiplyScalar(-e/nn.z)}getViewSize(e,t){return this.getViewBounds(e,Iu,Pu),t.subVectors(Pu,Iu)}setViewOffset(e,t,i,n,s,a){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=i,this.view.offsetY=n,this.view.width=s,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=this.near,t=e*Math.tan(Vr*.5*this.fov)/this.zoom,i=2*t,n=this.aspect*i,s=-.5*n,a=this.view;if(this.view!==null&&this.view.enabled){let l=a.fullWidth,c=a.fullHeight;s+=a.offsetX*n/l,t-=a.offsetY*i/c,n*=a.width/l,i*=a.height/c}let o=this.filmOffset;o!==0&&(s+=e*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(s,s+n,t,t-i,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}},tr=-90,ir=1,da=class extends rt{constructor(e,t,i){super(),this.type="CubeCamera",this.renderTarget=i,this.coordinateSystem=null,this.activeMipmapLevel=0;let n=new xt(tr,ir,e,t);n.layers=this.layers,this.add(n);let s=new xt(tr,ir,e,t);s.layers=this.layers,this.add(s);let a=new xt(tr,ir,e,t);a.layers=this.layers,this.add(a);let o=new xt(tr,ir,e,t);o.layers=this.layers,this.add(o);let l=new xt(tr,ir,e,t);l.layers=this.layers,this.add(l);let c=new xt(tr,ir,e,t);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){let e=this.coordinateSystem,t=this.children.concat(),[i,n,s,a,o,l]=t;for(let c of t)this.remove(c);if(e===di)i.up.set(0,1,0),i.lookAt(1,0,0),n.up.set(0,1,0),n.lookAt(-1,0,0),s.up.set(0,0,-1),s.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(e===Xr)i.up.set(0,-1,0),i.lookAt(-1,0,0),n.up.set(0,-1,0),n.lookAt(1,0,0),s.up.set(0,0,1),s.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(let c of t)this.add(c),c.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();let{renderTarget:i,activeMipmapLevel:n}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());let[s,a,o,l,c,d]=this.children,u=e.getRenderTarget(),h=e.getActiveCubeFace(),m=e.getActiveMipmapLevel(),y=e.xr.enabled;e.xr.enabled=!1;let b=i.texture.generateMipmaps;i.texture.generateMipmaps=!1,e.setRenderTarget(i,0,n),e.render(t,s),e.setRenderTarget(i,1,n),e.render(t,a),e.setRenderTarget(i,2,n),e.render(t,o),e.setRenderTarget(i,3,n),e.render(t,l),e.setRenderTarget(i,4,n),e.render(t,c),i.texture.generateMipmaps=b,e.setRenderTarget(i,5,n),e.render(t,d),e.setRenderTarget(u,h,m),e.xr.enabled=y,i.texture.needsPMREMUpdate=!0}},es=class extends St{constructor(e=[],t=On,i,n,s,a,o,l,c,d){super(e,t,i,n,s,a,o,l,c,d),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}},ha=class extends Si{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;let i={width:e,height:e,depth:1},n=[i,i,i,i,i,i];this.texture=new es(n),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;let i={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},n=new Gt(5,5,5),s=new pi({name:"CubemapFromEquirect",uniforms:Fn(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:Vt,blending:Xi});s.uniforms.tEquirect.value=t;let a=new We(n,s),o=t.minFilter;return t.minFilter===mi&&(t.minFilter=zt),new da(1,10,this).update(e,a),t.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(e,t=!0,i=!0,n=!0){let s=e.getRenderTarget();for(let a=0;a<6;a++)e.setRenderTarget(this,a),e.clear(t,i,n);e.setRenderTarget(s)}},pt=class extends rt{constructor(){super(),this.isGroup=!0,this.type="Group"}},gp={type:"move"},hr=class{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new pt,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new pt,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new L,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new L),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new pt,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new L,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new L),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){let t=this._hand;if(t)for(let i of e.hand.values())this._getHandJoint(t,i)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,i){let n=null,s=null,a=null,o=this._targetRay,l=this._grip,c=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(c&&e.hand){a=!0;for(let b of e.hand.values()){let p=t.getJointPose(b,i),f=this._getHandJoint(c,b);p!==null&&(f.matrix.fromArray(p.transform.matrix),f.matrix.decompose(f.position,f.rotation,f.scale),f.matrixWorldNeedsUpdate=!0,f.jointRadius=p.radius),f.visible=p!==null}let d=c.joints["index-finger-tip"],u=c.joints["thumb-tip"],h=d.position.distanceTo(u.position),m=.02,y=.005;c.inputState.pinching&&h>m+y?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!c.inputState.pinching&&h<=m-y&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else l!==null&&e.gripSpace&&(s=t.getPose(e.gripSpace,i),s!==null&&(l.matrix.fromArray(s.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,s.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(s.linearVelocity)):l.hasLinearVelocity=!1,s.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(s.angularVelocity)):l.hasAngularVelocity=!1));o!==null&&(n=t.getPose(e.targetRaySpace,i),n===null&&s!==null&&(n=s),n!==null&&(o.matrix.fromArray(n.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,n.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(n.linearVelocity)):o.hasLinearVelocity=!1,n.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(n.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(gp)))}return o!==null&&(o.visible=n!==null),l!==null&&(l.visible=s!==null),c!==null&&(c.visible=a!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){let i=new pt;i.matrixAutoUpdate=!1,i.visible=!1,e.joints[t.jointName]=i,e.add(i)}return e.joints[t.jointName]}},ts=class r{constructor(e,t=25e-5){this.isFogExp2=!0,this.name="",this.color=new Me(e),this.density=t}clone(){return new r(this.color,this.density)}toJSON(){return{type:"FogExp2",name:this.name,color:this.color.getHex(),density:this.density}}};var is=class extends rt{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new ni,this.environmentIntensity=1,this.environmentRotation=new ni,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){let t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}},fr=class{constructor(e,t){this.isInterleavedBuffer=!0,this.array=e,this.stride=t,this.count=e!==void 0?e.length/t:0,this.usage=lr,this.updateRanges=[],this.version=0,this.uuid=hi()}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.array=new e.array.constructor(e.array),this.count=e.count,this.stride=e.stride,this.usage=e.usage,this}copyAt(e,t,i){e*=this.stride,i*=t.stride;for(let n=0,s=this.stride;n<s;n++)this.array[e+n]=t.array[i+n];return this}set(e,t=0){return this.array.set(e,t),this}clone(e){e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=hi()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);let t=new this.array.constructor(e.arrayBuffers[this.array.buffer._uuid]),i=new this.constructor(t,this.stride);return i.setUsage(this.usage),i}onUpload(e){return this.onUploadCallback=e,this}toJSON(e){return e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=hi()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer))),{uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride}}},Bt=new L,pr=class r{constructor(e,t,i,n=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=e,this.itemSize=t,this.offset=i,this.normalized=n}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(e){this.data.needsUpdate=e}applyMatrix4(e){for(let t=0,i=this.data.count;t<i;t++)Bt.fromBufferAttribute(this,t),Bt.applyMatrix4(e),this.setXYZ(t,Bt.x,Bt.y,Bt.z);return this}applyNormalMatrix(e){for(let t=0,i=this.count;t<i;t++)Bt.fromBufferAttribute(this,t),Bt.applyNormalMatrix(e),this.setXYZ(t,Bt.x,Bt.y,Bt.z);return this}transformDirection(e){for(let t=0,i=this.count;t<i;t++)Bt.fromBufferAttribute(this,t),Bt.transformDirection(e),this.setXYZ(t,Bt.x,Bt.y,Bt.z);return this}getComponent(e,t){let i=this.array[e*this.data.stride+this.offset+t];return this.normalized&&(i=ui(i,this.array)),i}setComponent(e,t,i){return this.normalized&&(i=Ze(i,this.array)),this.data.array[e*this.data.stride+this.offset+t]=i,this}setX(e,t){return this.normalized&&(t=Ze(t,this.array)),this.data.array[e*this.data.stride+this.offset]=t,this}setY(e,t){return this.normalized&&(t=Ze(t,this.array)),this.data.array[e*this.data.stride+this.offset+1]=t,this}setZ(e,t){return this.normalized&&(t=Ze(t,this.array)),this.data.array[e*this.data.stride+this.offset+2]=t,this}setW(e,t){return this.normalized&&(t=Ze(t,this.array)),this.data.array[e*this.data.stride+this.offset+3]=t,this}getX(e){let t=this.data.array[e*this.data.stride+this.offset];return this.normalized&&(t=ui(t,this.array)),t}getY(e){let t=this.data.array[e*this.data.stride+this.offset+1];return this.normalized&&(t=ui(t,this.array)),t}getZ(e){let t=this.data.array[e*this.data.stride+this.offset+2];return this.normalized&&(t=ui(t,this.array)),t}getW(e){let t=this.data.array[e*this.data.stride+this.offset+3];return this.normalized&&(t=ui(t,this.array)),t}setXY(e,t,i){return e=e*this.data.stride+this.offset,this.normalized&&(t=Ze(t,this.array),i=Ze(i,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=i,this}setXYZ(e,t,i,n){return e=e*this.data.stride+this.offset,this.normalized&&(t=Ze(t,this.array),i=Ze(i,this.array),n=Ze(n,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=i,this.data.array[e+2]=n,this}setXYZW(e,t,i,n,s){return e=e*this.data.stride+this.offset,this.normalized&&(t=Ze(t,this.array),i=Ze(i,this.array),n=Ze(n,this.array),s=Ze(s,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=i,this.data.array[e+2]=n,this.data.array[e+3]=s,this}clone(e){if(e===void 0){console.log("THREE.InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");let t=[];for(let i=0;i<this.count;i++){let n=i*this.data.stride+this.offset;for(let s=0;s<this.itemSize;s++)t.push(this.data.array[n+s])}return new wt(new this.array.constructor(t),this.itemSize,this.normalized)}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.clone(e)),new r(e.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(e){if(e===void 0){console.log("THREE.InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");let t=[];for(let i=0;i<this.count;i++){let n=i*this.data.stride+this.offset;for(let s=0;s<this.itemSize;s++)t.push(this.data.array[n+s])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:t,normalized:this.normalized}}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.toJSON(e)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}};var Ou=new L,Lu=new Ye,Nu=new Ye,xp=new L,Fu=new Be,Js=new L,al=new qt,Du=new Be,ol=new An,ns=class extends We{constructor(e,t){super(e,t),this.isSkinnedMesh=!0,this.type="SkinnedMesh",this.bindMode=fl,this.bindMatrix=new Be,this.bindMatrixInverse=new Be,this.boundingBox=null,this.boundingSphere=null}computeBoundingBox(){let e=this.geometry;this.boundingBox===null&&(this.boundingBox=new Pt),this.boundingBox.makeEmpty();let t=e.getAttribute("position");for(let i=0;i<t.count;i++)this.getVertexPosition(i,Js),this.boundingBox.expandByPoint(Js)}computeBoundingSphere(){let e=this.geometry;this.boundingSphere===null&&(this.boundingSphere=new qt),this.boundingSphere.makeEmpty();let t=e.getAttribute("position");for(let i=0;i<t.count;i++)this.getVertexPosition(i,Js),this.boundingSphere.expandByPoint(Js)}copy(e,t){return super.copy(e,t),this.bindMode=e.bindMode,this.bindMatrix.copy(e.bindMatrix),this.bindMatrixInverse.copy(e.bindMatrixInverse),this.skeleton=e.skeleton,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}raycast(e,t){let i=this.material,n=this.matrixWorld;i!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),al.copy(this.boundingSphere),al.applyMatrix4(n),e.ray.intersectsSphere(al)!==!1&&(Du.copy(n).invert(),ol.copy(e.ray).applyMatrix4(Du),!(this.boundingBox!==null&&ol.intersectsBox(this.boundingBox)===!1)&&this._computeIntersections(e,t,ol)))}getVertexPosition(e,t){return super.getVertexPosition(e,t),this.applyBoneTransform(e,t),t}bind(e,t){this.skeleton=e,t===void 0&&(this.updateMatrixWorld(!0),this.skeleton.calculateInverses(),t=this.matrixWorld),this.bindMatrix.copy(t),this.bindMatrixInverse.copy(t).invert()}pose(){this.skeleton.pose()}normalizeSkinWeights(){let e=new Ye,t=this.geometry.attributes.skinWeight;for(let i=0,n=t.count;i<n;i++){e.fromBufferAttribute(t,i);let s=1/e.manhattanLength();s!==1/0?e.multiplyScalar(s):e.set(1,0,0,0),t.setXYZW(i,e.x,e.y,e.z,e.w)}}updateMatrixWorld(e){super.updateMatrixWorld(e),this.bindMode===fl?this.bindMatrixInverse.copy(this.matrixWorld).invert():this.bindMode===Ad?this.bindMatrixInverse.copy(this.bindMatrix).invert():console.warn("THREE.SkinnedMesh: Unrecognized bindMode: "+this.bindMode)}applyBoneTransform(e,t){let i=this.skeleton,n=this.geometry;Lu.fromBufferAttribute(n.attributes.skinIndex,e),Nu.fromBufferAttribute(n.attributes.skinWeight,e),Ou.copy(t).applyMatrix4(this.bindMatrix),t.set(0,0,0);for(let s=0;s<4;s++){let a=Nu.getComponent(s);if(a!==0){let o=Lu.getComponent(s);Fu.multiplyMatrices(i.bones[o].matrixWorld,i.boneInverses[o]),t.addScaledVector(xp.copy(Ou).applyMatrix4(Fu),a)}}return t.applyMatrix4(this.bindMatrixInverse)}},mr=class extends rt{constructor(){super(),this.isBone=!0,this.type="Bone"}},rs=class extends St{constructor(e=null,t=1,i=1,n,s,a,o,l,c=It,d=It,u,h){super(null,a,o,l,c,d,n,s,u,h),this.isDataTexture=!0,this.image={data:e,width:t,height:i},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}},Bu=new Be,wp=new Be,ss=class r{constructor(e=[],t=[]){this.uuid=hi(),this.bones=e.slice(0),this.boneInverses=t,this.boneMatrices=null,this.boneTexture=null,this.init()}init(){let e=this.bones,t=this.boneInverses;if(this.boneMatrices=new Float32Array(e.length*16),t.length===0)this.calculateInverses();else if(e.length!==t.length){console.warn("THREE.Skeleton: Number of inverse bone matrices does not match amount of bones."),this.boneInverses=[];for(let i=0,n=this.bones.length;i<n;i++)this.boneInverses.push(new Be)}}calculateInverses(){this.boneInverses.length=0;for(let e=0,t=this.bones.length;e<t;e++){let i=new Be;this.bones[e]&&i.copy(this.bones[e].matrixWorld).invert(),this.boneInverses.push(i)}}pose(){for(let e=0,t=this.bones.length;e<t;e++){let i=this.bones[e];i&&i.matrixWorld.copy(this.boneInverses[e]).invert()}for(let e=0,t=this.bones.length;e<t;e++){let i=this.bones[e];i&&(i.parent&&i.parent.isBone?(i.matrix.copy(i.parent.matrixWorld).invert(),i.matrix.multiply(i.matrixWorld)):i.matrix.copy(i.matrixWorld),i.matrix.decompose(i.position,i.quaternion,i.scale))}}update(){let e=this.bones,t=this.boneInverses,i=this.boneMatrices,n=this.boneTexture;for(let s=0,a=e.length;s<a;s++){let o=e[s]?e[s].matrixWorld:wp;Bu.multiplyMatrices(o,t[s]),Bu.toArray(i,s*16)}n!==null&&(n.needsUpdate=!0)}clone(){return new r(this.bones,this.boneInverses)}computeBoneTexture(){let e=Math.sqrt(this.bones.length*4);e=Math.ceil(e/4)*4,e=Math.max(e,4);let t=new Float32Array(e*e*4);t.set(this.boneMatrices);let i=new rs(t,e,e,Qt,ri);return i.needsUpdate=!0,this.boneMatrices=t,this.boneTexture=i,this}getBoneByName(e){for(let t=0,i=this.bones.length;t<i;t++){let n=this.bones[t];if(n.name===e)return n}}dispose(){this.boneTexture!==null&&(this.boneTexture.dispose(),this.boneTexture=null)}fromJSON(e,t){this.uuid=e.uuid;for(let i=0,n=e.bones.length;i<n;i++){let s=e.bones[i],a=t[s];a===void 0&&(console.warn("THREE.Skeleton: No bone found with UUID:",s),a=new mr),this.bones.push(a),this.boneInverses.push(new Be().fromArray(e.boneInverses[i]))}return this.init(),this}toJSON(){let e={metadata:{version:4.7,type:"Skeleton",generator:"Skeleton.toJSON"},bones:[],boneInverses:[]};e.uuid=this.uuid;let t=this.bones,i=this.boneInverses;for(let n=0,s=t.length;n<s;n++){let a=t[n];e.bones.push(a.uuid);let o=i[n];e.boneInverses.push(o.toArray())}return e}},an=class extends wt{constructor(e,t,i,n=1){super(e,t,i),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=n}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}toJSON(){let e=super.toJSON();return e.meshPerAttribute=this.meshPerAttribute,e.isInstancedBufferAttribute=!0,e}},nr=new Be,Uu=new Be,Zs=[],zu=new Pt,Mp=new Be,zr=new We,Hr=new qt,Gi=class extends We{constructor(e,t,i){super(e,t),this.isInstancedMesh=!0,this.instanceMatrix=new an(new Float32Array(i*16),16),this.instanceColor=null,this.morphTexture=null,this.count=i,this.boundingBox=null,this.boundingSphere=null;for(let n=0;n<i;n++)this.setMatrixAt(n,Mp)}computeBoundingBox(){let e=this.geometry,t=this.count;this.boundingBox===null&&(this.boundingBox=new Pt),e.boundingBox===null&&e.computeBoundingBox(),this.boundingBox.makeEmpty();for(let i=0;i<t;i++)this.getMatrixAt(i,nr),zu.copy(e.boundingBox).applyMatrix4(nr),this.boundingBox.union(zu)}computeBoundingSphere(){let e=this.geometry,t=this.count;this.boundingSphere===null&&(this.boundingSphere=new qt),e.boundingSphere===null&&e.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let i=0;i<t;i++)this.getMatrixAt(i,nr),Hr.copy(e.boundingSphere).applyMatrix4(nr),this.boundingSphere.union(Hr)}copy(e,t){return super.copy(e,t),this.instanceMatrix.copy(e.instanceMatrix),e.morphTexture!==null&&(this.morphTexture=e.morphTexture.clone()),e.instanceColor!==null&&(this.instanceColor=e.instanceColor.clone()),this.count=e.count,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}getColorAt(e,t){t.fromArray(this.instanceColor.array,e*3)}getMatrixAt(e,t){t.fromArray(this.instanceMatrix.array,e*16)}getMorphAt(e,t){let i=t.morphTargetInfluences,n=this.morphTexture.source.data.data,s=i.length+1,a=e*s+1;for(let o=0;o<i.length;o++)i[o]=n[a+o]}raycast(e,t){let i=this.matrixWorld,n=this.count;if(zr.geometry=this.geometry,zr.material=this.material,zr.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),Hr.copy(this.boundingSphere),Hr.applyMatrix4(i),e.ray.intersectsSphere(Hr)!==!1))for(let s=0;s<n;s++){this.getMatrixAt(s,nr),Uu.multiplyMatrices(i,nr),zr.matrixWorld=Uu,zr.raycast(e,Zs);for(let a=0,o=Zs.length;a<o;a++){let l=Zs[a];l.instanceId=s,l.object=this,t.push(l)}Zs.length=0}}setColorAt(e,t){this.instanceColor===null&&(this.instanceColor=new an(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),t.toArray(this.instanceColor.array,e*3)}setMatrixAt(e,t){t.toArray(this.instanceMatrix.array,e*16)}setMorphAt(e,t){let i=t.morphTargetInfluences,n=i.length+1;this.morphTexture===null&&(this.morphTexture=new rs(new Float32Array(n*this.count),n,this.count,za,ri));let s=this.morphTexture.source.data.data,a=0;for(let c=0;c<i.length;c++)a+=i[c];let o=this.geometry.morphTargetsRelative?1:1-a,l=n*e;s[l]=o,s.set(i,l+1)}updateMorphTargets(){}dispose(){this.dispatchEvent({type:"dispose"}),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null)}},ll=new L,_p=new L,Sp=new Fe,gi=class{constructor(e=new L(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,i,n){return this.normal.set(e,t,i),this.constant=n,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,i){let n=ll.subVectors(i,t).cross(_p.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(n,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){let e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t){let i=e.delta(ll),n=this.normal.dot(i);if(n===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;let s=-(e.start.dot(this.normal)+this.constant)/n;return s<0||s>1?null:t.copy(e.start).addScaledVector(i,s)}intersectsLine(e){let t=this.distanceToPoint(e.start),i=this.distanceToPoint(e.end);return t<0&&i>0||i<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){let i=t||Sp.getNormalMatrix(e),n=this.coplanarPoint(ll).applyMatrix4(e),s=this.normal.applyMatrix3(i).normalize();return this.constant=-n.dot(s),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}},bn=new qt,Tp=new Oe(.5,.5),Qs=new L,yr=class{constructor(e=new gi,t=new gi,i=new gi,n=new gi,s=new gi,a=new gi){this.planes=[e,t,i,n,s,a]}set(e,t,i,n,s,a){let o=this.planes;return o[0].copy(e),o[1].copy(t),o[2].copy(i),o[3].copy(n),o[4].copy(s),o[5].copy(a),this}copy(e){let t=this.planes;for(let i=0;i<6;i++)t[i].copy(e.planes[i]);return this}setFromProjectionMatrix(e,t=di,i=!1){let n=this.planes,s=e.elements,a=s[0],o=s[1],l=s[2],c=s[3],d=s[4],u=s[5],h=s[6],m=s[7],y=s[8],b=s[9],p=s[10],f=s[11],x=s[12],g=s[13],v=s[14],T=s[15];if(n[0].setComponents(c-a,m-d,f-y,T-x).normalize(),n[1].setComponents(c+a,m+d,f+y,T+x).normalize(),n[2].setComponents(c+o,m+u,f+b,T+g).normalize(),n[3].setComponents(c-o,m-u,f-b,T-g).normalize(),i)n[4].setComponents(l,h,p,v).normalize(),n[5].setComponents(c-l,m-h,f-p,T-v).normalize();else if(n[4].setComponents(c-l,m-h,f-p,T-v).normalize(),t===di)n[5].setComponents(c+l,m+h,f+p,T+v).normalize();else if(t===Xr)n[5].setComponents(l,h,p,v).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),bn.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{let t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),bn.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(bn)}intersectsSprite(e){bn.center.set(0,0,0);let t=Tp.distanceTo(e.center);return bn.radius=.7071067811865476+t,bn.applyMatrix4(e.matrixWorld),this.intersectsSphere(bn)}intersectsSphere(e){let t=this.planes,i=e.center,n=-e.radius;for(let s=0;s<6;s++)if(t[s].distanceToPoint(i)<n)return!1;return!0}intersectsBox(e){let t=this.planes;for(let i=0;i<6;i++){let n=t[i];if(Qs.x=n.normal.x>0?e.max.x:e.min.x,Qs.y=n.normal.y>0?e.max.y:e.min.y,Qs.z=n.normal.z>0?e.max.z:e.min.z,n.distanceToPoint(Qs)<0)return!1}return!0}containsPoint(e){let t=this.planes;for(let i=0;i<6;i++)if(t[i].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}};var br=class extends Ht{constructor(e){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new Me(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}},fa=new L,pa=new L,Hu=new Be,jr=new An,ea=new qt,cl=new L,ju=new L,kn=class extends rt{constructor(e=new Ct,t=new br){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){let e=this.geometry;if(e.index===null){let t=e.attributes.position,i=[0];for(let n=1,s=t.count;n<s;n++)fa.fromBufferAttribute(t,n-1),pa.fromBufferAttribute(t,n),i[n]=i[n-1],i[n]+=fa.distanceTo(pa);e.setAttribute("lineDistance",new nt(i,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(e,t){let i=this.geometry,n=this.matrixWorld,s=e.params.Line.threshold,a=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),ea.copy(i.boundingSphere),ea.applyMatrix4(n),ea.radius+=s,e.ray.intersectsSphere(ea)===!1)return;Hu.copy(n).invert(),jr.copy(e.ray).applyMatrix4(Hu);let o=s/((this.scale.x+this.scale.y+this.scale.z)/3),l=o*o,c=this.isLineSegments?2:1,d=i.index,h=i.attributes.position;if(d!==null){let m=Math.max(0,a.start),y=Math.min(d.count,a.start+a.count);for(let b=m,p=y-1;b<p;b+=c){let f=d.getX(b),x=d.getX(b+1),g=ta(this,e,jr,l,f,x,b);g&&t.push(g)}if(this.isLineLoop){let b=d.getX(y-1),p=d.getX(m),f=ta(this,e,jr,l,b,p,y-1);f&&t.push(f)}}else{let m=Math.max(0,a.start),y=Math.min(h.count,a.start+a.count);for(let b=m,p=y-1;b<p;b+=c){let f=ta(this,e,jr,l,b,b+1,b);f&&t.push(f)}if(this.isLineLoop){let b=ta(this,e,jr,l,y-1,m,y-1);b&&t.push(b)}}}updateMorphTargets(){let t=this.geometry.morphAttributes,i=Object.keys(t);if(i.length>0){let n=t[i[0]];if(n!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,a=n.length;s<a;s++){let o=n[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=s}}}}};function ta(r,e,t,i,n,s,a){let o=r.geometry.attributes.position;if(fa.fromBufferAttribute(o,n),pa.fromBufferAttribute(o,s),t.distanceSqToSegment(fa,pa,cl,ju)>i)return;cl.applyMatrix4(r.matrixWorld);let c=e.ray.origin.distanceTo(cl);if(!(c<e.near||c>e.far))return{distance:c,point:ju.clone().applyMatrix4(r.matrixWorld),index:a,face:null,faceIndex:null,barycoord:null,object:r}}var Gu=new L,Vu=new L,as=class extends kn{constructor(e,t){super(e,t),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){let e=this.geometry;if(e.index===null){let t=e.attributes.position,i=[];for(let n=0,s=t.count;n<s;n+=2)Gu.fromBufferAttribute(t,n),Vu.fromBufferAttribute(t,n+1),i[n]=n===0?0:i[n-1],i[n+1]=i[n]+Gu.distanceTo(Vu);e.setAttribute("lineDistance",new nt(i,1))}else console.warn("THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}},os=class extends kn{constructor(e,t){super(e,t),this.isLineLoop=!0,this.type="LineLoop"}},vr=class extends Ht{constructor(e){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new Me(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.size=e.size,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}},Wu=new Be,ml=new An,ia=new qt,na=new L,ls=class extends rt{constructor(e=new Ct,t=new vr){super(),this.isPoints=!0,this.type="Points",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}raycast(e,t){let i=this.geometry,n=this.matrixWorld,s=e.params.Points.threshold,a=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),ia.copy(i.boundingSphere),ia.applyMatrix4(n),ia.radius+=s,e.ray.intersectsSphere(ia)===!1)return;Wu.copy(n).invert(),ml.copy(e.ray).applyMatrix4(Wu);let o=s/((this.scale.x+this.scale.y+this.scale.z)/3),l=o*o,c=i.index,u=i.attributes.position;if(c!==null){let h=Math.max(0,a.start),m=Math.min(c.count,a.start+a.count);for(let y=h,b=m;y<b;y++){let p=c.getX(y);na.fromBufferAttribute(u,p),qu(na,p,l,n,e,t,this)}}else{let h=Math.max(0,a.start),m=Math.min(u.count,a.start+a.count);for(let y=h,b=m;y<b;y++)na.fromBufferAttribute(u,y),qu(na,y,l,n,e,t,this)}}updateMorphTargets(){let t=this.geometry.morphAttributes,i=Object.keys(t);if(i.length>0){let n=t[i[0]];if(n!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,a=n.length;s<a;s++){let o=n[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=s}}}}};function qu(r,e,t,i,n,s,a){let o=ml.distanceSqToPoint(r);if(o<t){let l=new L;ml.closestPointToPoint(r,l),l.applyMatrix4(i);let c=n.ray.origin.distanceTo(l);if(c<n.near||c>n.far)return;s.push({distance:c,distanceToRay:Math.sqrt(o),point:l,index:e,face:null,faceIndex:null,barycoord:null,object:a})}}var cs=class extends St{constructor(e,t,i,n,s,a,o,l,c){super(e,t,i,n,s,a,o,l,c),this.isCanvasTexture=!0,this.needsUpdate=!0}},us=class extends St{constructor(e,t,i=cn,n,s,a,o=It,l=It,c,d=or,u=1){if(d!==or&&d!==Tr)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");let h={width:e,height:t,depth:u};super(h,n,s,a,o,l,d,i,c),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new dr(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){let t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}},ds=class extends St{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}};var Ti=class r extends Ct{constructor(e=1,t=1,i=1,n=32,s=1,a=!1,o=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:t,height:i,radialSegments:n,heightSegments:s,openEnded:a,thetaStart:o,thetaLength:l};let c=this;n=Math.floor(n),s=Math.floor(s);let d=[],u=[],h=[],m=[],y=0,b=[],p=i/2,f=0;x(),a===!1&&(e>0&&g(!0),t>0&&g(!1)),this.setIndex(d),this.setAttribute("position",new nt(u,3)),this.setAttribute("normal",new nt(h,3)),this.setAttribute("uv",new nt(m,2));function x(){let v=new L,T=new L,A=0,E=(t-e)/i;for(let P=0;P<=s;P++){let _=[],M=P/s,R=M*(t-e)+e;for(let F=0;F<=n;F++){let j=F/n,W=j*l+o,K=Math.sin(W),C=Math.cos(W);T.x=R*K,T.y=-M*i+p,T.z=R*C,u.push(T.x,T.y,T.z),v.set(K,E,C).normalize(),h.push(v.x,v.y,v.z),m.push(j,1-M),_.push(y++)}b.push(_)}for(let P=0;P<n;P++)for(let _=0;_<s;_++){let M=b[_][P],R=b[_+1][P],F=b[_+1][P+1],j=b[_][P+1];(e>0||_!==0)&&(d.push(M,R,j),A+=3),(t>0||_!==s-1)&&(d.push(R,F,j),A+=3)}c.addGroup(f,A,0),f+=A}function g(v){let T=y,A=new Oe,E=new L,P=0,_=v===!0?e:t,M=v===!0?1:-1;for(let F=1;F<=n;F++)u.push(0,p*M,0),h.push(0,M,0),m.push(.5,.5),y++;let R=y;for(let F=0;F<=n;F++){let W=F/n*l+o,K=Math.cos(W),C=Math.sin(W);E.x=_*C,E.y=p*M,E.z=_*K,u.push(E.x,E.y,E.z),h.push(0,M,0),A.x=K*.5+.5,A.y=C*.5*M+.5,m.push(A.x,A.y),y++}for(let F=0;F<n;F++){let j=T+F,W=R+F;v===!0?d.push(W,W+1,j):d.push(W+1,W,j),P+=3}c.addGroup(f,P,v===!0?1:2),f+=P}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new r(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}},Ai=class r extends Ti{constructor(e=1,t=1,i=32,n=1,s=!1,a=0,o=Math.PI*2){super(0,e,t,i,n,s,a,o),this.type="ConeGeometry",this.parameters={radius:e,height:t,radialSegments:i,heightSegments:n,openEnded:s,thetaStart:a,thetaLength:o}}static fromJSON(e){return new r(e.radius,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}},hs=class r extends Ct{constructor(e=[],t=[],i=1,n=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:e,indices:t,radius:i,detail:n};let s=[],a=[];o(n),c(i),d(),this.setAttribute("position",new nt(s,3)),this.setAttribute("normal",new nt(s.slice(),3)),this.setAttribute("uv",new nt(a,2)),n===0?this.computeVertexNormals():this.normalizeNormals();function o(x){let g=new L,v=new L,T=new L;for(let A=0;A<t.length;A+=3)m(t[A+0],g),m(t[A+1],v),m(t[A+2],T),l(g,v,T,x)}function l(x,g,v,T){let A=T+1,E=[];for(let P=0;P<=A;P++){E[P]=[];let _=x.clone().lerp(v,P/A),M=g.clone().lerp(v,P/A),R=A-P;for(let F=0;F<=R;F++)F===0&&P===A?E[P][F]=_:E[P][F]=_.clone().lerp(M,F/R)}for(let P=0;P<A;P++)for(let _=0;_<2*(A-P)-1;_++){let M=Math.floor(_/2);_%2===0?(h(E[P][M+1]),h(E[P+1][M]),h(E[P][M])):(h(E[P][M+1]),h(E[P+1][M+1]),h(E[P+1][M]))}}function c(x){let g=new L;for(let v=0;v<s.length;v+=3)g.x=s[v+0],g.y=s[v+1],g.z=s[v+2],g.normalize().multiplyScalar(x),s[v+0]=g.x,s[v+1]=g.y,s[v+2]=g.z}function d(){let x=new L;for(let g=0;g<s.length;g+=3){x.x=s[g+0],x.y=s[g+1],x.z=s[g+2];let v=p(x)/2/Math.PI+.5,T=f(x)/Math.PI+.5;a.push(v,1-T)}y(),u()}function u(){for(let x=0;x<a.length;x+=6){let g=a[x+0],v=a[x+2],T=a[x+4],A=Math.max(g,v,T),E=Math.min(g,v,T);A>.9&&E<.1&&(g<.2&&(a[x+0]+=1),v<.2&&(a[x+2]+=1),T<.2&&(a[x+4]+=1))}}function h(x){s.push(x.x,x.y,x.z)}function m(x,g){let v=x*3;g.x=e[v+0],g.y=e[v+1],g.z=e[v+2]}function y(){let x=new L,g=new L,v=new L,T=new L,A=new Oe,E=new Oe,P=new Oe;for(let _=0,M=0;_<s.length;_+=9,M+=6){x.set(s[_+0],s[_+1],s[_+2]),g.set(s[_+3],s[_+4],s[_+5]),v.set(s[_+6],s[_+7],s[_+8]),A.set(a[M+0],a[M+1]),E.set(a[M+2],a[M+3]),P.set(a[M+4],a[M+5]),T.copy(x).add(g).add(v).divideScalar(3);let R=p(T);b(A,M+0,x,R),b(E,M+2,g,R),b(P,M+4,v,R)}}function b(x,g,v,T){T<0&&x.x===1&&(a[g]=x.x-1),v.x===0&&v.z===0&&(a[g]=T/2/Math.PI+.5)}function p(x){return Math.atan2(x.z,-x.x)}function f(x){return Math.atan2(-x.y,Math.sqrt(x.x*x.x+x.z*x.z))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new r(e.vertices,e.indices,e.radius,e.details)}},fs=class r extends hs{constructor(e=1,t=0){let i=(1+Math.sqrt(5))/2,n=1/i,s=[-1,-1,-1,-1,-1,1,-1,1,-1,-1,1,1,1,-1,-1,1,-1,1,1,1,-1,1,1,1,0,-n,-i,0,-n,i,0,n,-i,0,n,i,-n,-i,0,-n,i,0,n,-i,0,n,i,0,-i,0,-n,i,0,-n,-i,0,n,i,0,n],a=[3,11,7,3,7,15,3,15,13,7,19,17,7,17,6,7,6,15,17,4,8,17,8,10,17,10,6,8,0,16,8,16,2,8,2,10,0,12,1,0,1,18,0,18,16,6,10,2,6,2,13,6,13,15,2,16,18,2,18,3,2,3,13,18,1,9,18,9,11,18,11,3,4,14,12,4,12,0,4,0,8,11,9,5,11,5,19,11,19,7,19,5,14,19,14,4,19,4,17,1,12,14,1,14,5,1,5,9];super(s,a,e,t),this.type="DodecahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new r(e.radius,e.detail)}};var ps=class r extends hs{constructor(e=1,t=0){let i=[1,0,0,-1,0,0,0,1,0,0,-1,0,0,0,1,0,0,-1],n=[0,2,4,0,4,3,0,3,5,0,5,2,1,2,5,1,5,3,1,3,4,1,4,2];super(i,n,e,t),this.type="OctahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new r(e.radius,e.detail)}},ki=class r extends Ct{constructor(e=1,t=1,i=1,n=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:i,heightSegments:n};let s=e/2,a=t/2,o=Math.floor(i),l=Math.floor(n),c=o+1,d=l+1,u=e/o,h=t/l,m=[],y=[],b=[],p=[];for(let f=0;f<d;f++){let x=f*h-a;for(let g=0;g<c;g++){let v=g*u-s;y.push(v,-x,0),b.push(0,0,1),p.push(g/o),p.push(1-f/l)}}for(let f=0;f<l;f++)for(let x=0;x<o;x++){let g=x+c*f,v=x+c*(f+1),T=x+1+c*(f+1),A=x+1+c*f;m.push(g,v,A),m.push(v,T,A)}this.setIndex(m),this.setAttribute("position",new nt(y,3)),this.setAttribute("normal",new nt(b,3)),this.setAttribute("uv",new nt(p,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new r(e.width,e.height,e.widthSegments,e.heightSegments)}},gr=class r extends Ct{constructor(e=.5,t=1,i=32,n=1,s=0,a=Math.PI*2){super(),this.type="RingGeometry",this.parameters={innerRadius:e,outerRadius:t,thetaSegments:i,phiSegments:n,thetaStart:s,thetaLength:a},i=Math.max(3,i),n=Math.max(1,n);let o=[],l=[],c=[],d=[],u=e,h=(t-e)/n,m=new L,y=new Oe;for(let b=0;b<=n;b++){for(let p=0;p<=i;p++){let f=s+p/i*a;m.x=u*Math.cos(f),m.y=u*Math.sin(f),l.push(m.x,m.y,m.z),c.push(0,0,1),y.x=(m.x/t+1)/2,y.y=(m.y/t+1)/2,d.push(y.x,y.y)}u+=h}for(let b=0;b<n;b++){let p=b*(i+1);for(let f=0;f<i;f++){let x=f+p,g=x,v=x+i+1,T=x+i+2,A=x+1;o.push(g,v,A),o.push(v,T,A)}}this.setIndex(o),this.setAttribute("position",new nt(l,3)),this.setAttribute("normal",new nt(c,3)),this.setAttribute("uv",new nt(d,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new r(e.innerRadius,e.outerRadius,e.thetaSegments,e.phiSegments,e.thetaStart,e.thetaLength)}};var on=class r extends Ct{constructor(e=1,t=32,i=16,n=0,s=Math.PI*2,a=0,o=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:t,heightSegments:i,phiStart:n,phiLength:s,thetaStart:a,thetaLength:o},t=Math.max(3,Math.floor(t)),i=Math.max(2,Math.floor(i));let l=Math.min(a+o,Math.PI),c=0,d=[],u=new L,h=new L,m=[],y=[],b=[],p=[];for(let f=0;f<=i;f++){let x=[],g=f/i,v=0;f===0&&a===0?v=.5/t:f===i&&l===Math.PI&&(v=-.5/t);for(let T=0;T<=t;T++){let A=T/t;u.x=-e*Math.cos(n+A*s)*Math.sin(a+g*o),u.y=e*Math.cos(a+g*o),u.z=e*Math.sin(n+A*s)*Math.sin(a+g*o),y.push(u.x,u.y,u.z),h.copy(u).normalize(),b.push(h.x,h.y,h.z),p.push(A+v,1-g),x.push(c++)}d.push(x)}for(let f=0;f<i;f++)for(let x=0;x<t;x++){let g=d[f][x+1],v=d[f][x],T=d[f+1][x],A=d[f+1][x+1];(f!==0||a>0)&&m.push(g,v,A),(f!==i-1||l<Math.PI)&&m.push(v,T,A)}this.setIndex(m),this.setAttribute("position",new nt(y,3)),this.setAttribute("normal",new nt(b,3)),this.setAttribute("uv",new nt(p,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new r(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}};var ms=class r extends Ct{constructor(e=1,t=.4,i=12,n=48,s=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:e,tube:t,radialSegments:i,tubularSegments:n,arc:s},i=Math.floor(i),n=Math.floor(n);let a=[],o=[],l=[],c=[],d=new L,u=new L,h=new L;for(let m=0;m<=i;m++)for(let y=0;y<=n;y++){let b=y/n*s,p=m/i*Math.PI*2;u.x=(e+t*Math.cos(p))*Math.cos(b),u.y=(e+t*Math.cos(p))*Math.sin(b),u.z=t*Math.sin(p),o.push(u.x,u.y,u.z),d.x=e*Math.cos(b),d.y=e*Math.sin(b),h.subVectors(u,d).normalize(),l.push(h.x,h.y,h.z),c.push(y/n),c.push(m/i)}for(let m=1;m<=i;m++)for(let y=1;y<=n;y++){let b=(n+1)*m+y-1,p=(n+1)*(m-1)+y-1,f=(n+1)*(m-1)+y,x=(n+1)*m+y;a.push(b,p,x),a.push(p,f,x)}this.setIndex(a),this.setAttribute("position",new nt(o,3)),this.setAttribute("normal",new nt(l,3)),this.setAttribute("uv",new nt(c,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new r(e.radius,e.tube,e.radialSegments,e.tubularSegments,e.arc)}};var En=class extends Ht{constructor(e){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new Me(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Me(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Mo,this.normalScale=new Oe(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new ni,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}},$t=class extends En{constructor(e){super(),this.isMeshPhysicalMaterial=!0,this.defines={STANDARD:"",PHYSICAL:""},this.type="MeshPhysicalMaterial",this.anisotropyRotation=0,this.anisotropyMap=null,this.clearcoatMap=null,this.clearcoatRoughness=0,this.clearcoatRoughnessMap=null,this.clearcoatNormalScale=new Oe(1,1),this.clearcoatNormalMap=null,this.ior=1.5,Object.defineProperty(this,"reflectivity",{get:function(){return He(2.5*(this.ior-1)/(this.ior+1),0,1)},set:function(t){this.ior=(1+.4*t)/(1-.4*t)}}),this.iridescenceMap=null,this.iridescenceIOR=1.3,this.iridescenceThicknessRange=[100,400],this.iridescenceThicknessMap=null,this.sheenColor=new Me(0),this.sheenColorMap=null,this.sheenRoughness=1,this.sheenRoughnessMap=null,this.transmissionMap=null,this.thickness=0,this.thicknessMap=null,this.attenuationDistance=1/0,this.attenuationColor=new Me(1,1,1),this.specularIntensity=1,this.specularIntensityMap=null,this.specularColor=new Me(1,1,1),this.specularColorMap=null,this._anisotropy=0,this._clearcoat=0,this._dispersion=0,this._iridescence=0,this._sheen=0,this._transmission=0,this.setValues(e)}get anisotropy(){return this._anisotropy}set anisotropy(e){this._anisotropy>0!=e>0&&this.version++,this._anisotropy=e}get clearcoat(){return this._clearcoat}set clearcoat(e){this._clearcoat>0!=e>0&&this.version++,this._clearcoat=e}get iridescence(){return this._iridescence}set iridescence(e){this._iridescence>0!=e>0&&this.version++,this._iridescence=e}get dispersion(){return this._dispersion}set dispersion(e){this._dispersion>0!=e>0&&this.version++,this._dispersion=e}get sheen(){return this._sheen}set sheen(e){this._sheen>0!=e>0&&this.version++,this._sheen=e}get transmission(){return this._transmission}set transmission(e){this._transmission>0!=e>0&&this.version++,this._transmission=e}copy(e){return super.copy(e),this.defines={STANDARD:"",PHYSICAL:""},this.anisotropy=e.anisotropy,this.anisotropyRotation=e.anisotropyRotation,this.anisotropyMap=e.anisotropyMap,this.clearcoat=e.clearcoat,this.clearcoatMap=e.clearcoatMap,this.clearcoatRoughness=e.clearcoatRoughness,this.clearcoatRoughnessMap=e.clearcoatRoughnessMap,this.clearcoatNormalMap=e.clearcoatNormalMap,this.clearcoatNormalScale.copy(e.clearcoatNormalScale),this.dispersion=e.dispersion,this.ior=e.ior,this.iridescence=e.iridescence,this.iridescenceMap=e.iridescenceMap,this.iridescenceIOR=e.iridescenceIOR,this.iridescenceThicknessRange=[...e.iridescenceThicknessRange],this.iridescenceThicknessMap=e.iridescenceThicknessMap,this.sheen=e.sheen,this.sheenColor.copy(e.sheenColor),this.sheenColorMap=e.sheenColorMap,this.sheenRoughness=e.sheenRoughness,this.sheenRoughnessMap=e.sheenRoughnessMap,this.transmission=e.transmission,this.transmissionMap=e.transmissionMap,this.thickness=e.thickness,this.thicknessMap=e.thicknessMap,this.attenuationDistance=e.attenuationDistance,this.attenuationColor.copy(e.attenuationColor),this.specularIntensity=e.specularIntensity,this.specularIntensityMap=e.specularIntensityMap,this.specularColor.copy(e.specularColor),this.specularColorMap=e.specularColorMap,this}};var Rt=class extends Ht{constructor(e){super(),this.isMeshLambertMaterial=!0,this.type="MeshLambertMaterial",this.color=new Me(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Me(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Mo,this.normalScale=new Oe(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new ni,this.combine=Pa,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}},ma=class extends Ht{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=Cd,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}},ya=class extends Ht{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}};function ra(r,e){return!r||r.constructor===e?r:typeof e.BYTES_PER_ELEMENT=="number"?new e(r):Array.prototype.slice.call(r)}function Ap(r){return ArrayBuffer.isView(r)&&!(r instanceof DataView)}function kp(r){function e(n,s){return r[n]-r[s]}let t=r.length,i=new Array(t);for(let n=0;n!==t;++n)i[n]=n;return i.sort(e),i}function $u(r,e,t){let i=r.length,n=new r.constructor(i);for(let s=0,a=0;a!==i;++s){let o=t[s]*e;for(let l=0;l!==e;++l)n[a++]=r[o+l]}return n}function Gd(r,e,t,i){let n=1,s=r[0];for(;s!==void 0&&s[i]===void 0;)s=r[n++];if(s===void 0)return;let a=s[i];if(a!==void 0)if(Array.isArray(a))do a=s[i],a!==void 0&&(e.push(s.time),t.push(...a)),s=r[n++];while(s!==void 0);else if(a.toArray!==void 0)do a=s[i],a!==void 0&&(e.push(s.time),a.toArray(t,t.length)),s=r[n++];while(s!==void 0);else do a=s[i],a!==void 0&&(e.push(s.time),t.push(a)),s=r[n++];while(s!==void 0)}var Vi=class{constructor(e,t,i,n){this.parameterPositions=e,this._cachedIndex=0,this.resultBuffer=n!==void 0?n:new t.constructor(i),this.sampleValues=t,this.valueSize=i,this.settings=null,this.DefaultSettings_={}}evaluate(e){let t=this.parameterPositions,i=this._cachedIndex,n=t[i],s=t[i-1];e:{t:{let a;i:{n:if(!(e<n)){for(let o=i+2;;){if(n===void 0){if(e<s)break n;return i=t.length,this._cachedIndex=i,this.copySampleValue_(i-1)}if(i===o)break;if(s=n,n=t[++i],e<n)break t}a=t.length;break i}if(!(e>=s)){let o=t[1];e<o&&(i=2,s=o);for(let l=i-2;;){if(s===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(i===l)break;if(n=s,s=t[--i-1],e>=s)break t}a=i,i=0;break i}break e}for(;i<a;){let o=i+a>>>1;e<t[o]?a=o:i=o+1}if(n=t[i],s=t[i-1],s===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===void 0)return i=t.length,this._cachedIndex=i,this.copySampleValue_(i-1)}this._cachedIndex=i,this.intervalChanged_(i,s,n)}return this.interpolate_(i,s,e,n)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(e){let t=this.resultBuffer,i=this.sampleValues,n=this.valueSize,s=e*n;for(let a=0;a!==n;++a)t[a]=i[s+a];return t}interpolate_(){throw new Error("call to abstract method")}intervalChanged_(){}},ba=class extends Vi{constructor(e,t,i,n){super(e,t,i,n),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:gn,endingEnd:gn}}intervalChanged_(e,t,i){let n=this.parameterPositions,s=e-2,a=e+1,o=n[s],l=n[a];if(o===void 0)switch(this.getSettings_().endingStart){case xn:s=e,o=2*t-i;break;case qr:s=n.length-2,o=t+n[s]-n[s+1];break;default:s=e,o=i}if(l===void 0)switch(this.getSettings_().endingEnd){case xn:a=e,l=2*i-t;break;case qr:a=1,l=i+n[1]-n[0];break;default:a=e-1,l=t}let c=(i-t)*.5,d=this.valueSize;this._weightPrev=c/(t-o),this._weightNext=c/(l-i),this._offsetPrev=s*d,this._offsetNext=a*d}interpolate_(e,t,i,n){let s=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=e*o,c=l-o,d=this._offsetPrev,u=this._offsetNext,h=this._weightPrev,m=this._weightNext,y=(i-t)/(n-t),b=y*y,p=b*y,f=-h*p+2*h*b-h*y,x=(1+h)*p+(-1.5-2*h)*b+(-.5+h)*y+1,g=(-1-m)*p+(1.5+m)*b+.5*y,v=m*p-m*b;for(let T=0;T!==o;++T)s[T]=f*a[d+T]+x*a[c+T]+g*a[l+T]+v*a[u+T];return s}},ys=class extends Vi{constructor(e,t,i,n){super(e,t,i,n)}interpolate_(e,t,i,n){let s=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=e*o,c=l-o,d=(i-t)/(n-t),u=1-d;for(let h=0;h!==o;++h)s[h]=a[c+h]*u+a[l+h]*d;return s}},va=class extends Vi{constructor(e,t,i,n){super(e,t,i,n)}interpolate_(e){return this.copySampleValue_(e-1)}},Xt=class{constructor(e,t,i,n){if(e===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(t===void 0||t.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+e);this.name=e,this.times=ra(t,this.TimeBufferType),this.values=ra(i,this.ValueBufferType),this.setInterpolation(n||this.DefaultInterpolation)}static toJSON(e){let t=e.constructor,i;if(t.toJSON!==this.toJSON)i=t.toJSON(e);else{i={name:e.name,times:ra(e.times,Array),values:ra(e.values,Array)};let n=e.getInterpolation();n!==e.DefaultInterpolation&&(i.interpolation=n)}return i.type=e.ValueTypeName,i}InterpolantFactoryMethodDiscrete(e){return new va(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodLinear(e){return new ys(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodSmooth(e){return new ba(this.times,this.values,this.getValueSize(),e)}setInterpolation(e){let t;switch(e){case _n:t=this.InterpolantFactoryMethodDiscrete;break;case Sn:t=this.InterpolantFactoryMethodLinear;break;case sa:t=this.InterpolantFactoryMethodSmooth;break}if(t===void 0){let i="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(e!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(i);return console.warn("THREE.KeyframeTrack:",i),this}return this.createInterpolant=t,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return _n;case this.InterpolantFactoryMethodLinear:return Sn;case this.InterpolantFactoryMethodSmooth:return sa}}getValueSize(){return this.values.length/this.times.length}shift(e){if(e!==0){let t=this.times;for(let i=0,n=t.length;i!==n;++i)t[i]+=e}return this}scale(e){if(e!==1){let t=this.times;for(let i=0,n=t.length;i!==n;++i)t[i]*=e}return this}trim(e,t){let i=this.times,n=i.length,s=0,a=n-1;for(;s!==n&&i[s]<e;)++s;for(;a!==-1&&i[a]>t;)--a;if(++a,s!==0||a!==n){s>=a&&(a=Math.max(a,1),s=a-1);let o=this.getValueSize();this.times=i.slice(s,a),this.values=this.values.slice(s*o,a*o)}return this}validate(){let e=!0,t=this.getValueSize();t-Math.floor(t)!==0&&(console.error("THREE.KeyframeTrack: Invalid value size in track.",this),e=!1);let i=this.times,n=this.values,s=i.length;s===0&&(console.error("THREE.KeyframeTrack: Track is empty.",this),e=!1);let a=null;for(let o=0;o!==s;o++){let l=i[o];if(typeof l=="number"&&isNaN(l)){console.error("THREE.KeyframeTrack: Time is not a valid number.",this,o,l),e=!1;break}if(a!==null&&a>l){console.error("THREE.KeyframeTrack: Out of order keys.",this,o,l,a),e=!1;break}a=l}if(n!==void 0&&Ap(n))for(let o=0,l=n.length;o!==l;++o){let c=n[o];if(isNaN(c)){console.error("THREE.KeyframeTrack: Value is not a valid number.",this,o,c),e=!1;break}}return e}optimize(){let e=this.times.slice(),t=this.values.slice(),i=this.getValueSize(),n=this.getInterpolation()===sa,s=e.length-1,a=1;for(let o=1;o<s;++o){let l=!1,c=e[o],d=e[o+1];if(c!==d&&(o!==1||c!==e[0]))if(n)l=!0;else{let u=o*i,h=u-i,m=u+i;for(let y=0;y!==i;++y){let b=t[u+y];if(b!==t[h+y]||b!==t[m+y]){l=!0;break}}}if(l){if(o!==a){e[a]=e[o];let u=o*i,h=a*i;for(let m=0;m!==i;++m)t[h+m]=t[u+m]}++a}}if(s>0){e[a]=e[s];for(let o=s*i,l=a*i,c=0;c!==i;++c)t[l+c]=t[o+c];++a}return a!==e.length?(this.times=e.slice(0,a),this.values=t.slice(0,a*i)):(this.times=e,this.values=t),this}clone(){let e=this.times.slice(),t=this.values.slice(),i=this.constructor,n=new i(this.name,e,t);return n.createInterpolant=this.createInterpolant,n}};Xt.prototype.ValueTypeName="";Xt.prototype.TimeBufferType=Float32Array;Xt.prototype.ValueBufferType=Float32Array;Xt.prototype.DefaultInterpolation=Sn;var Wi=class extends Xt{constructor(e,t,i){super(e,t,i)}};Wi.prototype.ValueTypeName="bool";Wi.prototype.ValueBufferType=Array;Wi.prototype.DefaultInterpolation=_n;Wi.prototype.InterpolantFactoryMethodLinear=void 0;Wi.prototype.InterpolantFactoryMethodSmooth=void 0;var bs=class extends Xt{constructor(e,t,i,n){super(e,t,i,n)}};bs.prototype.ValueTypeName="color";var Ei=class extends Xt{constructor(e,t,i,n){super(e,t,i,n)}};Ei.prototype.ValueTypeName="number";var ga=class extends Vi{constructor(e,t,i,n){super(e,t,i,n)}interpolate_(e,t,i,n){let s=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=(i-t)/(n-t),c=e*o;for(let d=c+o;c!==d;c+=4)Ut.slerpFlat(s,0,a,c-o,a,c,l);return s}},Ci=class extends Xt{constructor(e,t,i,n){super(e,t,i,n)}InterpolantFactoryMethodLinear(e){return new ga(this.times,this.values,this.getValueSize(),e)}};Ci.prototype.ValueTypeName="quaternion";Ci.prototype.InterpolantFactoryMethodSmooth=void 0;var qi=class extends Xt{constructor(e,t,i){super(e,t,i)}};qi.prototype.ValueTypeName="string";qi.prototype.ValueBufferType=Array;qi.prototype.DefaultInterpolation=_n;qi.prototype.InterpolantFactoryMethodLinear=void 0;qi.prototype.InterpolantFactoryMethodSmooth=void 0;var Ri=class extends Xt{constructor(e,t,i,n){super(e,t,i,n)}};Ri.prototype.ValueTypeName="vector";var Cn=class{constructor(e="",t=-1,i=[],n=wo){this.name=e,this.tracks=i,this.duration=t,this.blendMode=n,this.uuid=hi(),this.userData={},this.duration<0&&this.resetDuration()}static parse(e){let t=[],i=e.tracks,n=1/(e.fps||1);for(let a=0,o=i.length;a!==o;++a)t.push(Cp(i[a]).scale(n));let s=new this(e.name,e.duration,t,e.blendMode);return s.uuid=e.uuid,s.userData=JSON.parse(e.userData||"{}"),s}static toJSON(e){let t=[],i=e.tracks,n={name:e.name,duration:e.duration,tracks:t,uuid:e.uuid,blendMode:e.blendMode,userData:JSON.stringify(e.userData)};for(let s=0,a=i.length;s!==a;++s)t.push(Xt.toJSON(i[s]));return n}static CreateFromMorphTargetSequence(e,t,i,n){let s=t.length,a=[];for(let o=0;o<s;o++){let l=[],c=[];l.push((o+s-1)%s,o,(o+1)%s),c.push(0,1,0);let d=kp(l);l=$u(l,1,d),c=$u(c,1,d),!n&&l[0]===0&&(l.push(s),c.push(c[0])),a.push(new Ei(".morphTargetInfluences["+t[o].name+"]",l,c).scale(1/i))}return new this(e,-1,a)}static findByName(e,t){let i=e;if(!Array.isArray(e)){let n=e;i=n.geometry&&n.geometry.animations||n.animations}for(let n=0;n<i.length;n++)if(i[n].name===t)return i[n];return null}static CreateClipsFromMorphTargetSequences(e,t,i){let n={},s=/^([\w-]*?)([\d]+)$/;for(let o=0,l=e.length;o<l;o++){let c=e[o],d=c.name.match(s);if(d&&d.length>1){let u=d[1],h=n[u];h||(n[u]=h=[]),h.push(c)}}let a=[];for(let o in n)a.push(this.CreateFromMorphTargetSequence(o,n[o],t,i));return a}static parseAnimation(e,t){if(console.warn("THREE.AnimationClip: parseAnimation() is deprecated and will be removed with r185"),!e)return console.error("THREE.AnimationClip: No animation in JSONLoader data."),null;let i=function(u,h,m,y,b){if(m.length!==0){let p=[],f=[];Gd(m,p,f,y),p.length!==0&&b.push(new u(h,p,f))}},n=[],s=e.name||"default",a=e.fps||30,o=e.blendMode,l=e.length||-1,c=e.hierarchy||[];for(let u=0;u<c.length;u++){let h=c[u].keys;if(!(!h||h.length===0))if(h[0].morphTargets){let m={},y;for(y=0;y<h.length;y++)if(h[y].morphTargets)for(let b=0;b<h[y].morphTargets.length;b++)m[h[y].morphTargets[b]]=-1;for(let b in m){let p=[],f=[];for(let x=0;x!==h[y].morphTargets.length;++x){let g=h[y];p.push(g.time),f.push(g.morphTarget===b?1:0)}n.push(new Ei(".morphTargetInfluence["+b+"]",p,f))}l=m.length*a}else{let m=".bones["+t[u].name+"]";i(Ri,m+".position",h,"pos",n),i(Ci,m+".quaternion",h,"rot",n),i(Ri,m+".scale",h,"scl",n)}}return n.length===0?null:new this(s,l,n,o)}resetDuration(){let e=this.tracks,t=0;for(let i=0,n=e.length;i!==n;++i){let s=this.tracks[i];t=Math.max(t,s.times[s.times.length-1])}return this.duration=t,this}trim(){for(let e=0;e<this.tracks.length;e++)this.tracks[e].trim(0,this.duration);return this}validate(){let e=!0;for(let t=0;t<this.tracks.length;t++)e=e&&this.tracks[t].validate();return e}optimize(){for(let e=0;e<this.tracks.length;e++)this.tracks[e].optimize();return this}clone(){let e=[];for(let i=0;i<this.tracks.length;i++)e.push(this.tracks[i].clone());let t=new this.constructor(this.name,this.duration,e,this.blendMode);return t.userData=JSON.parse(JSON.stringify(this.userData)),t}toJSON(){return this.constructor.toJSON(this)}};function Ep(r){switch(r.toLowerCase()){case"scalar":case"double":case"float":case"number":case"integer":return Ei;case"vector":case"vector2":case"vector3":case"vector4":return Ri;case"color":return bs;case"quaternion":return Ci;case"bool":case"boolean":return Wi;case"string":return qi}throw new Error("THREE.KeyframeTrack: Unsupported typeName: "+r)}function Cp(r){if(r.type===void 0)throw new Error("THREE.KeyframeTrack: track type undefined, can not parse");let e=Ep(r.type);if(r.times===void 0){let t=[],i=[];Gd(r.keys,t,i,"value"),r.times=t,r.values=i}return e.parse!==void 0?e.parse(r):new e(r.name,r.times,r.values,r.interpolation)}var wi={enabled:!1,files:{},add:function(r,e){this.enabled!==!1&&(this.files[r]=e)},get:function(r){if(this.enabled!==!1)return this.files[r]},remove:function(r){delete this.files[r]},clear:function(){this.files={}}},xa=class{constructor(e,t,i){let n=this,s=!1,a=0,o=0,l,c=[];this.onStart=void 0,this.onLoad=e,this.onProgress=t,this.onError=i,this.abortController=new AbortController,this.itemStart=function(d){o++,s===!1&&n.onStart!==void 0&&n.onStart(d,a,o),s=!0},this.itemEnd=function(d){a++,n.onProgress!==void 0&&n.onProgress(d,a,o),a===o&&(s=!1,n.onLoad!==void 0&&n.onLoad())},this.itemError=function(d){n.onError!==void 0&&n.onError(d)},this.resolveURL=function(d){return l?l(d):d},this.setURLModifier=function(d){return l=d,this},this.addHandler=function(d,u){return c.push(d,u),this},this.removeHandler=function(d){let u=c.indexOf(d);return u!==-1&&c.splice(u,2),this},this.getHandler=function(d){for(let u=0,h=c.length;u<h;u+=2){let m=c[u],y=c[u+1];if(m.global&&(m.lastIndex=0),m.test(d))return y}return null},this.abort=function(){return this.abortController.abort(),this.abortController=new AbortController,this}}},Vd=new xa,Ii=class{constructor(e){this.manager=e!==void 0?e:Vd,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={}}load(){}loadAsync(e,t){let i=this;return new Promise(function(n,s){i.load(e,n,t,s)})}parse(){}setCrossOrigin(e){return this.crossOrigin=e,this}setWithCredentials(e){return this.withCredentials=e,this}setPath(e){return this.path=e,this}setResourcePath(e){return this.resourcePath=e,this}setRequestHeader(e){return this.requestHeader=e,this}abort(){return this}};Ii.DEFAULT_MATERIAL_NAME="__DEFAULT";var Hi={},yl=class extends Error{constructor(e,t){super(e),this.response=t}},xr=class extends Ii{constructor(e){super(e),this.mimeType="",this.responseType="",this._abortController=new AbortController}load(e,t,i,n){e===void 0&&(e=""),this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);let s=wi.get(`file:${e}`);if(s!==void 0)return this.manager.itemStart(e),setTimeout(()=>{t&&t(s),this.manager.itemEnd(e)},0),s;if(Hi[e]!==void 0){Hi[e].push({onLoad:t,onProgress:i,onError:n});return}Hi[e]=[],Hi[e].push({onLoad:t,onProgress:i,onError:n});let a=new Request(e,{headers:new Headers(this.requestHeader),credentials:this.withCredentials?"include":"same-origin",signal:typeof AbortSignal.any=="function"?AbortSignal.any([this._abortController.signal,this.manager.abortController.signal]):this._abortController.signal}),o=this.mimeType,l=this.responseType;fetch(a).then(c=>{if(c.status===200||c.status===0){if(c.status===0&&console.warn("THREE.FileLoader: HTTP Status 0 received."),typeof ReadableStream>"u"||c.body===void 0||c.body.getReader===void 0)return c;let d=Hi[e],u=c.body.getReader(),h=c.headers.get("X-File-Size")||c.headers.get("Content-Length"),m=h?parseInt(h):0,y=m!==0,b=0,p=new ReadableStream({start(f){x();function x(){u.read().then(({done:g,value:v})=>{if(g)f.close();else{b+=v.byteLength;let T=new ProgressEvent("progress",{lengthComputable:y,loaded:b,total:m});for(let A=0,E=d.length;A<E;A++){let P=d[A];P.onProgress&&P.onProgress(T)}f.enqueue(v),x()}},g=>{f.error(g)})}}});return new Response(p)}else throw new yl(`fetch for "${c.url}" responded with ${c.status}: ${c.statusText}`,c)}).then(c=>{switch(l){case"arraybuffer":return c.arrayBuffer();case"blob":return c.blob();case"document":return c.text().then(d=>new DOMParser().parseFromString(d,o));case"json":return c.json();default:if(o==="")return c.text();{let u=/charset="?([^;"\s]*)"?/i.exec(o),h=u&&u[1]?u[1].toLowerCase():void 0,m=new TextDecoder(h);return c.arrayBuffer().then(y=>m.decode(y))}}}).then(c=>{wi.add(`file:${e}`,c);let d=Hi[e];delete Hi[e];for(let u=0,h=d.length;u<h;u++){let m=d[u];m.onLoad&&m.onLoad(c)}}).catch(c=>{let d=Hi[e];if(d===void 0)throw this.manager.itemError(e),c;delete Hi[e];for(let u=0,h=d.length;u<h;u++){let m=d[u];m.onError&&m.onError(c)}this.manager.itemError(e)}).finally(()=>{this.manager.itemEnd(e)}),this.manager.itemStart(e)}setResponseType(e){return this.responseType=e,this}setMimeType(e){return this.mimeType=e,this}abort(){return this._abortController.abort(),this._abortController=new AbortController,this}};var rr=new WeakMap,wa=class extends Ii{constructor(e){super(e)}load(e,t,i,n){this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);let s=this,a=wi.get(`image:${e}`);if(a!==void 0){if(a.complete===!0)s.manager.itemStart(e),setTimeout(function(){t&&t(a),s.manager.itemEnd(e)},0);else{let u=rr.get(a);u===void 0&&(u=[],rr.set(a,u)),u.push({onLoad:t,onError:n})}return a}let o=cr("img");function l(){d(),t&&t(this);let u=rr.get(this)||[];for(let h=0;h<u.length;h++){let m=u[h];m.onLoad&&m.onLoad(this)}rr.delete(this),s.manager.itemEnd(e)}function c(u){d(),n&&n(u),wi.remove(`image:${e}`);let h=rr.get(this)||[];for(let m=0;m<h.length;m++){let y=h[m];y.onError&&y.onError(u)}rr.delete(this),s.manager.itemError(e),s.manager.itemEnd(e)}function d(){o.removeEventListener("load",l,!1),o.removeEventListener("error",c,!1)}return o.addEventListener("load",l,!1),o.addEventListener("error",c,!1),e.slice(0,5)!=="data:"&&this.crossOrigin!==void 0&&(o.crossOrigin=this.crossOrigin),wi.add(`image:${e}`,o),s.manager.itemStart(e),o.src=e,o}};var vs=class extends Ii{constructor(e){super(e)}load(e,t,i,n){let s=new St,a=new wa(this.manager);return a.setCrossOrigin(this.crossOrigin),a.setPath(this.path),a.load(e,function(o){s.image=o,s.needsUpdate=!0,t!==void 0&&t(s)},i,n),s}},Rn=class extends rt{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new Me(e),this.intensity=t}dispose(){}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){let t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,this.groundColor!==void 0&&(t.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(t.object.distance=this.distance),this.angle!==void 0&&(t.object.angle=this.angle),this.decay!==void 0&&(t.object.decay=this.decay),this.penumbra!==void 0&&(t.object.penumbra=this.penumbra),this.shadow!==void 0&&(t.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(t.object.target=this.target.uuid),t}},gs=class extends Rn{constructor(e,t,i){super(e,i),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(rt.DEFAULT_UP),this.updateMatrix(),this.groundColor=new Me(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}},ul=new Be,Xu=new L,Ku=new L,xs=class{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new Oe(512,512),this.mapType=yi,this.map=null,this.mapPass=null,this.matrix=new Be,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new yr,this._frameExtents=new Oe(1,1),this._viewportCount=1,this._viewports=[new Ye(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){let t=this.camera,i=this.matrix;Xu.setFromMatrixPosition(e.matrixWorld),t.position.copy(Xu),Ku.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(Ku),t.updateMatrixWorld(),ul.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(ul,t.coordinateSystem,t.reversedDepth),t.reversedDepth?i.set(.5,0,0,.5,0,.5,0,.5,0,0,1,0,0,0,0,1):i.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),i.multiply(ul)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.autoUpdate=e.autoUpdate,this.needsUpdate=e.needsUpdate,this.normalBias=e.normalBias,this.blurSamples=e.blurSamples,this.mapSize.copy(e.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){let e={};return this.intensity!==1&&(e.intensity=this.intensity),this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}},bl=class extends xs{constructor(){super(new xt(50,1,.5,500)),this.isSpotLightShadow=!0,this.focus=1,this.aspect=1}updateMatrices(e){let t=this.camera,i=Tn*2*e.angle*this.focus,n=this.mapSize.width/this.mapSize.height*this.aspect,s=e.distance||t.far;(i!==t.fov||n!==t.aspect||s!==t.far)&&(t.fov=i,t.aspect=n,t.far=s,t.updateProjectionMatrix()),super.updateMatrices(e)}copy(e){return super.copy(e),this.focus=e.focus,this}},ws=class extends Rn{constructor(e,t,i=0,n=Math.PI/3,s=0,a=2){super(e,t),this.isSpotLight=!0,this.type="SpotLight",this.position.copy(rt.DEFAULT_UP),this.updateMatrix(),this.target=new rt,this.distance=i,this.angle=n,this.penumbra=s,this.decay=a,this.map=null,this.shadow=new bl}get power(){return this.intensity*Math.PI}set power(e){this.intensity=e/Math.PI}dispose(){this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.angle=e.angle,this.penumbra=e.penumbra,this.decay=e.decay,this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}},Yu=new Be,Gr=new L,dl=new L,vl=class extends xs{constructor(){super(new xt(90,1,.5,500)),this.isPointLightShadow=!0,this._frameExtents=new Oe(4,2),this._viewportCount=6,this._viewports=[new Ye(2,1,1,1),new Ye(0,1,1,1),new Ye(3,1,1,1),new Ye(1,1,1,1),new Ye(3,0,1,1),new Ye(1,0,1,1)],this._cubeDirections=[new L(1,0,0),new L(-1,0,0),new L(0,0,1),new L(0,0,-1),new L(0,1,0),new L(0,-1,0)],this._cubeUps=[new L(0,1,0),new L(0,1,0),new L(0,1,0),new L(0,1,0),new L(0,0,1),new L(0,0,-1)]}updateMatrices(e,t=0){let i=this.camera,n=this.matrix,s=e.distance||i.far;s!==i.far&&(i.far=s,i.updateProjectionMatrix()),Gr.setFromMatrixPosition(e.matrixWorld),i.position.copy(Gr),dl.copy(i.position),dl.add(this._cubeDirections[t]),i.up.copy(this._cubeUps[t]),i.lookAt(dl),i.updateMatrixWorld(),n.makeTranslation(-Gr.x,-Gr.y,-Gr.z),Yu.multiplyMatrices(i.projectionMatrix,i.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Yu,i.coordinateSystem,i.reversedDepth)}},In=class extends Rn{constructor(e,t,i=0,n=2){super(e,t),this.isPointLight=!0,this.type="PointLight",this.distance=i,this.decay=n,this.shadow=new vl}get power(){return this.intensity*4*Math.PI}set power(e){this.intensity=e/(4*Math.PI)}dispose(){this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.decay=e.decay,this.shadow=e.shadow.clone(),this}},Pn=class extends Qr{constructor(e=-1,t=1,i=1,n=-1,s=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=i,this.bottom=n,this.near=s,this.far=a,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,i,n,s,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=i,this.view.offsetY=n,this.view.width=s,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),i=(this.right+this.left)/2,n=(this.top+this.bottom)/2,s=i-e,a=i+e,o=n+t,l=n-t;if(this.view!==null&&this.view.enabled){let c=(this.right-this.left)/this.view.fullWidth/this.zoom,d=(this.top-this.bottom)/this.view.fullHeight/this.zoom;s+=c*this.view.offsetX,a=s+c*this.view.width,o-=d*this.view.offsetY,l=o-d*this.view.height}this.projectionMatrix.makeOrthographic(s,a,o,l,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}},gl=class extends xs{constructor(){super(new Pn(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}},ln=class extends Rn{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(rt.DEFAULT_UP),this.updateMatrix(),this.target=new rt,this.shadow=new gl}dispose(){this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}};var $i=class{static extractUrlBase(e){let t=e.lastIndexOf("/");return t===-1?"./":e.slice(0,t+1)}static resolveURL(e,t){return typeof e!="string"||e===""?"":(/^https?:\/\//i.test(t)&&/^\//.test(e)&&(t=t.replace(/(^https?:\/\/[^\/]+).*/i,"$1")),/^(https?:)?\/\//i.test(e)||/^data:.*,.*$/i.test(e)||/^blob:.*$/i.test(e)?e:t+e)}};var hl=new WeakMap,Ms=class extends Ii{constructor(e){super(e),this.isImageBitmapLoader=!0,typeof createImageBitmap>"u"&&console.warn("THREE.ImageBitmapLoader: createImageBitmap() not supported."),typeof fetch>"u"&&console.warn("THREE.ImageBitmapLoader: fetch() not supported."),this.options={premultiplyAlpha:"none"},this._abortController=new AbortController}setOptions(e){return this.options=e,this}load(e,t,i,n){e===void 0&&(e=""),this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);let s=this,a=wi.get(`image-bitmap:${e}`);if(a!==void 0){if(s.manager.itemStart(e),a.then){a.then(c=>{if(hl.has(a)===!0)n&&n(hl.get(a)),s.manager.itemError(e),s.manager.itemEnd(e);else return t&&t(c),s.manager.itemEnd(e),c});return}return setTimeout(function(){t&&t(a),s.manager.itemEnd(e)},0),a}let o={};o.credentials=this.crossOrigin==="anonymous"?"same-origin":"include",o.headers=this.requestHeader,o.signal=typeof AbortSignal.any=="function"?AbortSignal.any([this._abortController.signal,this.manager.abortController.signal]):this._abortController.signal;let l=fetch(e,o).then(function(c){return c.blob()}).then(function(c){return createImageBitmap(c,Object.assign(s.options,{colorSpaceConversion:"none"}))}).then(function(c){return wi.add(`image-bitmap:${e}`,c),t&&t(c),s.manager.itemEnd(e),c}).catch(function(c){n&&n(c),hl.set(l,c),wi.remove(`image-bitmap:${e}`),s.manager.itemError(e),s.manager.itemEnd(e)});wi.add(`image-bitmap:${e}`,l),s.manager.itemStart(e)}abort(){return this._abortController.abort(),this._abortController=new AbortController,this}};var Ma=class extends xt{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e}};var _a=class{constructor(e,t,i){this.binding=e,this.valueSize=i;let n,s,a;switch(t){case"quaternion":n=this._slerp,s=this._slerpAdditive,a=this._setAdditiveIdentityQuaternion,this.buffer=new Float64Array(i*6),this._workIndex=5;break;case"string":case"bool":n=this._select,s=this._select,a=this._setAdditiveIdentityOther,this.buffer=new Array(i*5);break;default:n=this._lerp,s=this._lerpAdditive,a=this._setAdditiveIdentityNumeric,this.buffer=new Float64Array(i*5)}this._mixBufferRegion=n,this._mixBufferRegionAdditive=s,this._setIdentity=a,this._origIndex=3,this._addIndex=4,this.cumulativeWeight=0,this.cumulativeWeightAdditive=0,this.useCount=0,this.referenceCount=0}accumulate(e,t){let i=this.buffer,n=this.valueSize,s=e*n+n,a=this.cumulativeWeight;if(a===0){for(let o=0;o!==n;++o)i[s+o]=i[o];a=t}else{a+=t;let o=t/a;this._mixBufferRegion(i,s,0,o,n)}this.cumulativeWeight=a}accumulateAdditive(e){let t=this.buffer,i=this.valueSize,n=i*this._addIndex;this.cumulativeWeightAdditive===0&&this._setIdentity(),this._mixBufferRegionAdditive(t,n,0,e,i),this.cumulativeWeightAdditive+=e}apply(e){let t=this.valueSize,i=this.buffer,n=e*t+t,s=this.cumulativeWeight,a=this.cumulativeWeightAdditive,o=this.binding;if(this.cumulativeWeight=0,this.cumulativeWeightAdditive=0,s<1){let l=t*this._origIndex;this._mixBufferRegion(i,n,l,1-s,t)}a>0&&this._mixBufferRegionAdditive(i,n,this._addIndex*t,1,t);for(let l=t,c=t+t;l!==c;++l)if(i[l]!==i[l+t]){o.setValue(i,n);break}}saveOriginalState(){let e=this.binding,t=this.buffer,i=this.valueSize,n=i*this._origIndex;e.getValue(t,n);for(let s=i,a=n;s!==a;++s)t[s]=t[n+s%i];this._setIdentity(),this.cumulativeWeight=0,this.cumulativeWeightAdditive=0}restoreOriginalState(){let e=this.valueSize*3;this.binding.setValue(this.buffer,e)}_setAdditiveIdentityNumeric(){let e=this._addIndex*this.valueSize,t=e+this.valueSize;for(let i=e;i<t;i++)this.buffer[i]=0}_setAdditiveIdentityQuaternion(){this._setAdditiveIdentityNumeric(),this.buffer[this._addIndex*this.valueSize+3]=1}_setAdditiveIdentityOther(){let e=this._origIndex*this.valueSize,t=this._addIndex*this.valueSize;for(let i=0;i<this.valueSize;i++)this.buffer[t+i]=this.buffer[e+i]}_select(e,t,i,n,s){if(n>=.5)for(let a=0;a!==s;++a)e[t+a]=e[i+a]}_slerp(e,t,i,n){Ut.slerpFlat(e,t,e,t,e,i,n)}_slerpAdditive(e,t,i,n,s){let a=this._workIndex*s;Ut.multiplyQuaternionsFlat(e,a,e,t,e,i),Ut.slerpFlat(e,t,e,t,e,a,n)}_lerp(e,t,i,n,s){let a=1-n;for(let o=0;o!==s;++o){let l=t+o;e[l]=e[l]*a+e[i+o]*n}}_lerpAdditive(e,t,i,n,s){for(let a=0;a!==s;++a){let o=t+a;e[o]=e[o]+e[i+a]*n}}},jl="\\[\\]\\.:\\/",Rp=new RegExp("["+jl+"]","g"),Gl="[^"+jl+"]",Ip="[^"+jl.replace("\\.","")+"]",Pp=/((?:WC+[\/:])*)/.source.replace("WC",Gl),Op=/(WCOD+)?/.source.replace("WCOD",Ip),Lp=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",Gl),Np=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",Gl),Fp=new RegExp("^"+Pp+Op+Lp+Np+"$"),Dp=["material","materials","bones","map"],xl=class{constructor(e,t,i){let n=i||it.parseTrackName(t);this._targetGroup=e,this._bindings=e.subscribe_(t,n)}getValue(e,t){this.bind();let i=this._targetGroup.nCachedObjects_,n=this._bindings[i];n!==void 0&&n.getValue(e,t)}setValue(e,t){let i=this._bindings;for(let n=this._targetGroup.nCachedObjects_,s=i.length;n!==s;++n)i[n].setValue(e,t)}bind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,i=e.length;t!==i;++t)e[t].bind()}unbind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,i=e.length;t!==i;++t)e[t].unbind()}},it=class r{constructor(e,t,i){this.path=t,this.parsedPath=i||r.parseTrackName(t),this.node=r.findNode(e,this.parsedPath.nodeName),this.rootNode=e,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(e,t,i){return e&&e.isAnimationObjectGroup?new r.Composite(e,t,i):new r(e,t,i)}static sanitizeNodeName(e){return e.replace(/\s/g,"_").replace(Rp,"")}static parseTrackName(e){let t=Fp.exec(e);if(t===null)throw new Error("PropertyBinding: Cannot parse trackName: "+e);let i={nodeName:t[2],objectName:t[3],objectIndex:t[4],propertyName:t[5],propertyIndex:t[6]},n=i.nodeName&&i.nodeName.lastIndexOf(".");if(n!==void 0&&n!==-1){let s=i.nodeName.substring(n+1);Dp.indexOf(s)!==-1&&(i.nodeName=i.nodeName.substring(0,n),i.objectName=s)}if(i.propertyName===null||i.propertyName.length===0)throw new Error("PropertyBinding: can not parse propertyName from trackName: "+e);return i}static findNode(e,t){if(t===void 0||t===""||t==="."||t===-1||t===e.name||t===e.uuid)return e;if(e.skeleton){let i=e.skeleton.getBoneByName(t);if(i!==void 0)return i}if(e.children){let i=function(s){for(let a=0;a<s.length;a++){let o=s[a];if(o.name===t||o.uuid===t)return o;let l=i(o.children);if(l)return l}return null},n=i(e.children);if(n)return n}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(e,t){e[t]=this.targetObject[this.propertyName]}_getValue_array(e,t){let i=this.resolvedProperty;for(let n=0,s=i.length;n!==s;++n)e[t++]=i[n]}_getValue_arrayElement(e,t){e[t]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(e,t){this.resolvedProperty.toArray(e,t)}_setValue_direct(e,t){this.targetObject[this.propertyName]=e[t]}_setValue_direct_setNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(e,t){let i=this.resolvedProperty;for(let n=0,s=i.length;n!==s;++n)i[n]=e[t++]}_setValue_array_setNeedsUpdate(e,t){let i=this.resolvedProperty;for(let n=0,s=i.length;n!==s;++n)i[n]=e[t++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(e,t){let i=this.resolvedProperty;for(let n=0,s=i.length;n!==s;++n)i[n]=e[t++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(e,t){this.resolvedProperty[this.propertyIndex]=e[t]}_setValue_arrayElement_setNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(e,t){this.resolvedProperty.fromArray(e,t)}_setValue_fromArray_setNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(e,t){this.bind(),this.getValue(e,t)}_setValue_unbound(e,t){this.bind(),this.setValue(e,t)}bind(){let e=this.node,t=this.parsedPath,i=t.objectName,n=t.propertyName,s=t.propertyIndex;if(e||(e=r.findNode(this.rootNode,t.nodeName),this.node=e),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!e){console.warn("THREE.PropertyBinding: No target node found for track: "+this.path+".");return}if(i){let c=t.objectIndex;switch(i){case"materials":if(!e.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.materials){console.error("THREE.PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}e=e.material.materials;break;case"bones":if(!e.skeleton){console.error("THREE.PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}e=e.skeleton.bones;for(let d=0;d<e.length;d++)if(e[d].name===c){c=d;break}break;case"map":if("map"in e){e=e.map;break}if(!e.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.map){console.error("THREE.PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}e=e.material.map;break;default:if(e[i]===void 0){console.error("THREE.PropertyBinding: Can not bind to objectName of node undefined.",this);return}e=e[i]}if(c!==void 0){if(e[c]===void 0){console.error("THREE.PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,e);return}e=e[c]}}let a=e[n];if(a===void 0){let c=t.nodeName;console.error("THREE.PropertyBinding: Trying to update property for track: "+c+"."+n+" but it wasn't found.",e);return}let o=this.Versioning.None;this.targetObject=e,e.isMaterial===!0?o=this.Versioning.NeedsUpdate:e.isObject3D===!0&&(o=this.Versioning.MatrixWorldNeedsUpdate);let l=this.BindingType.Direct;if(s!==void 0){if(n==="morphTargetInfluences"){if(!e.geometry){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!e.geometry.morphAttributes){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}e.morphTargetDictionary[s]!==void 0&&(s=e.morphTargetDictionary[s])}l=this.BindingType.ArrayElement,this.resolvedProperty=a,this.propertyIndex=s}else a.fromArray!==void 0&&a.toArray!==void 0?(l=this.BindingType.HasFromToArray,this.resolvedProperty=a):Array.isArray(a)?(l=this.BindingType.EntireArray,this.resolvedProperty=a):this.propertyName=n;this.getValue=this.GetterByBindingType[l],this.setValue=this.SetterByBindingTypeAndVersioning[l][o]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};it.Composite=xl;it.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};it.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};it.prototype.GetterByBindingType=[it.prototype._getValue_direct,it.prototype._getValue_array,it.prototype._getValue_arrayElement,it.prototype._getValue_toArray];it.prototype.SetterByBindingTypeAndVersioning=[[it.prototype._setValue_direct,it.prototype._setValue_direct_setNeedsUpdate,it.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[it.prototype._setValue_array,it.prototype._setValue_array_setNeedsUpdate,it.prototype._setValue_array_setMatrixWorldNeedsUpdate],[it.prototype._setValue_arrayElement,it.prototype._setValue_arrayElement_setNeedsUpdate,it.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[it.prototype._setValue_fromArray,it.prototype._setValue_fromArray_setNeedsUpdate,it.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];var Sa=class{constructor(e,t,i=null,n=t.blendMode){this._mixer=e,this._clip=t,this._localRoot=i,this.blendMode=n;let s=t.tracks,a=s.length,o=new Array(a),l={endingStart:gn,endingEnd:gn};for(let c=0;c!==a;++c){let d=s[c].createInterpolant(null);o[c]=d,d.settings=l}this._interpolantSettings=l,this._interpolants=o,this._propertyBindings=new Array(a),this._cacheIndex=null,this._byClipCacheIndex=null,this._timeScaleInterpolant=null,this._weightInterpolant=null,this.loop=xo,this._loopCount=-1,this._startTime=null,this.time=0,this.timeScale=1,this._effectiveTimeScale=1,this.weight=1,this._effectiveWeight=1,this.repetitions=1/0,this.paused=!1,this.enabled=!0,this.clampWhenFinished=!1,this.zeroSlopeAtStart=!0,this.zeroSlopeAtEnd=!0}play(){return this._mixer._activateAction(this),this}stop(){return this._mixer._deactivateAction(this),this.reset()}reset(){return this.paused=!1,this.enabled=!0,this.time=0,this._loopCount=-1,this._startTime=null,this.stopFading().stopWarping()}isRunning(){return this.enabled&&!this.paused&&this.timeScale!==0&&this._startTime===null&&this._mixer._isActiveAction(this)}isScheduled(){return this._mixer._isActiveAction(this)}startAt(e){return this._startTime=e,this}setLoop(e,t){return this.loop=e,this.repetitions=t,this}setEffectiveWeight(e){return this.weight=e,this._effectiveWeight=this.enabled?e:0,this.stopFading()}getEffectiveWeight(){return this._effectiveWeight}fadeIn(e){return this._scheduleFading(e,0,1)}fadeOut(e){return this._scheduleFading(e,1,0)}crossFadeFrom(e,t,i=!1){if(e.fadeOut(t),this.fadeIn(t),i===!0){let n=this._clip.duration,s=e._clip.duration,a=s/n,o=n/s;e.warp(1,a,t),this.warp(o,1,t)}return this}crossFadeTo(e,t,i=!1){return e.crossFadeFrom(this,t,i)}stopFading(){let e=this._weightInterpolant;return e!==null&&(this._weightInterpolant=null,this._mixer._takeBackControlInterpolant(e)),this}setEffectiveTimeScale(e){return this.timeScale=e,this._effectiveTimeScale=this.paused?0:e,this.stopWarping()}getEffectiveTimeScale(){return this._effectiveTimeScale}setDuration(e){return this.timeScale=this._clip.duration/e,this.stopWarping()}syncWith(e){return this.time=e.time,this.timeScale=e.timeScale,this.stopWarping()}halt(e){return this.warp(this._effectiveTimeScale,0,e)}warp(e,t,i){let n=this._mixer,s=n.time,a=this.timeScale,o=this._timeScaleInterpolant;o===null&&(o=n._lendControlInterpolant(),this._timeScaleInterpolant=o);let l=o.parameterPositions,c=o.sampleValues;return l[0]=s,l[1]=s+i,c[0]=e/a,c[1]=t/a,this}stopWarping(){let e=this._timeScaleInterpolant;return e!==null&&(this._timeScaleInterpolant=null,this._mixer._takeBackControlInterpolant(e)),this}getMixer(){return this._mixer}getClip(){return this._clip}getRoot(){return this._localRoot||this._mixer._root}_update(e,t,i,n){if(!this.enabled){this._updateWeight(e);return}let s=this._startTime;if(s!==null){let l=(e-s)*i;l<0||i===0?t=0:(this._startTime=null,t=i*l)}t*=this._updateTimeScale(e);let a=this._updateTime(t),o=this._updateWeight(e);if(o>0){let l=this._interpolants,c=this._propertyBindings;switch(this.blendMode){case Ed:for(let d=0,u=l.length;d!==u;++d)l[d].evaluate(a),c[d].accumulateAdditive(o);break;case wo:default:for(let d=0,u=l.length;d!==u;++d)l[d].evaluate(a),c[d].accumulate(n,o)}}}_updateWeight(e){let t=0;if(this.enabled){t=this.weight;let i=this._weightInterpolant;if(i!==null){let n=i.evaluate(e)[0];t*=n,e>i.parameterPositions[1]&&(this.stopFading(),n===0&&(this.enabled=!1))}}return this._effectiveWeight=t,t}_updateTimeScale(e){let t=0;if(!this.paused){t=this.timeScale;let i=this._timeScaleInterpolant;if(i!==null){let n=i.evaluate(e)[0];t*=n,e>i.parameterPositions[1]&&(this.stopWarping(),t===0?this.paused=!0:this.timeScale=t)}}return this._effectiveTimeScale=t,t}_updateTime(e){let t=this._clip.duration,i=this.loop,n=this.time+e,s=this._loopCount,a=i===kd;if(e===0)return s===-1?n:a&&(s&1)===1?t-n:n;if(i===go){s===-1&&(this._loopCount=0,this._setEndings(!0,!0,!1));e:{if(n>=t)n=t;else if(n<0)n=0;else{this.time=n;break e}this.clampWhenFinished?this.paused=!0:this.enabled=!1,this.time=n,this._mixer.dispatchEvent({type:"finished",action:this,direction:e<0?-1:1})}}else{if(s===-1&&(e>=0?(s=0,this._setEndings(!0,this.repetitions===0,a)):this._setEndings(this.repetitions===0,!0,a)),n>=t||n<0){let o=Math.floor(n/t);n-=t*o,s+=Math.abs(o);let l=this.repetitions-s;if(l<=0)this.clampWhenFinished?this.paused=!0:this.enabled=!1,n=e>0?t:0,this.time=n,this._mixer.dispatchEvent({type:"finished",action:this,direction:e>0?1:-1});else{if(l===1){let c=e<0;this._setEndings(c,!c,a)}else this._setEndings(!1,!1,a);this._loopCount=s,this.time=n,this._mixer.dispatchEvent({type:"loop",action:this,loopDelta:o})}}else this.time=n;if(a&&(s&1)===1)return t-n}return n}_setEndings(e,t,i){let n=this._interpolantSettings;i?(n.endingStart=xn,n.endingEnd=xn):(e?n.endingStart=this.zeroSlopeAtStart?xn:gn:n.endingStart=qr,t?n.endingEnd=this.zeroSlopeAtEnd?xn:gn:n.endingEnd=qr)}_scheduleFading(e,t,i){let n=this._mixer,s=n.time,a=this._weightInterpolant;a===null&&(a=n._lendControlInterpolant(),this._weightInterpolant=a);let o=a.parameterPositions,l=a.sampleValues;return o[0]=s,l[0]=t,o[1]=s+e,l[1]=i,this}},Bp=new Float32Array(1),_s=class extends _i{constructor(e){super(),this._root=e,this._initMemoryManager(),this._accuIndex=0,this.time=0,this.timeScale=1}_bindAction(e,t){let i=e._localRoot||this._root,n=e._clip.tracks,s=n.length,a=e._propertyBindings,o=e._interpolants,l=i.uuid,c=this._bindingsByRootAndName,d=c[l];d===void 0&&(d={},c[l]=d);for(let u=0;u!==s;++u){let h=n[u],m=h.name,y=d[m];if(y!==void 0)++y.referenceCount,a[u]=y;else{if(y=a[u],y!==void 0){y._cacheIndex===null&&(++y.referenceCount,this._addInactiveBinding(y,l,m));continue}let b=t&&t._propertyBindings[u].binding.parsedPath;y=new _a(it.create(i,m,b),h.ValueTypeName,h.getValueSize()),++y.referenceCount,this._addInactiveBinding(y,l,m),a[u]=y}o[u].resultBuffer=y.buffer}}_activateAction(e){if(!this._isActiveAction(e)){if(e._cacheIndex===null){let i=(e._localRoot||this._root).uuid,n=e._clip.uuid,s=this._actionsByClip[n];this._bindAction(e,s&&s.knownActions[0]),this._addInactiveAction(e,n,i)}let t=e._propertyBindings;for(let i=0,n=t.length;i!==n;++i){let s=t[i];s.useCount++===0&&(this._lendBinding(s),s.saveOriginalState())}this._lendAction(e)}}_deactivateAction(e){if(this._isActiveAction(e)){let t=e._propertyBindings;for(let i=0,n=t.length;i!==n;++i){let s=t[i];--s.useCount===0&&(s.restoreOriginalState(),this._takeBackBinding(s))}this._takeBackAction(e)}}_initMemoryManager(){this._actions=[],this._nActiveActions=0,this._actionsByClip={},this._bindings=[],this._nActiveBindings=0,this._bindingsByRootAndName={},this._controlInterpolants=[],this._nActiveControlInterpolants=0;let e=this;this.stats={actions:{get total(){return e._actions.length},get inUse(){return e._nActiveActions}},bindings:{get total(){return e._bindings.length},get inUse(){return e._nActiveBindings}},controlInterpolants:{get total(){return e._controlInterpolants.length},get inUse(){return e._nActiveControlInterpolants}}}}_isActiveAction(e){let t=e._cacheIndex;return t!==null&&t<this._nActiveActions}_addInactiveAction(e,t,i){let n=this._actions,s=this._actionsByClip,a=s[t];if(a===void 0)a={knownActions:[e],actionByRoot:{}},e._byClipCacheIndex=0,s[t]=a;else{let o=a.knownActions;e._byClipCacheIndex=o.length,o.push(e)}e._cacheIndex=n.length,n.push(e),a.actionByRoot[i]=e}_removeInactiveAction(e){let t=this._actions,i=t[t.length-1],n=e._cacheIndex;i._cacheIndex=n,t[n]=i,t.pop(),e._cacheIndex=null;let s=e._clip.uuid,a=this._actionsByClip,o=a[s],l=o.knownActions,c=l[l.length-1],d=e._byClipCacheIndex;c._byClipCacheIndex=d,l[d]=c,l.pop(),e._byClipCacheIndex=null;let u=o.actionByRoot,h=(e._localRoot||this._root).uuid;delete u[h],l.length===0&&delete a[s],this._removeInactiveBindingsForAction(e)}_removeInactiveBindingsForAction(e){let t=e._propertyBindings;for(let i=0,n=t.length;i!==n;++i){let s=t[i];--s.referenceCount===0&&this._removeInactiveBinding(s)}}_lendAction(e){let t=this._actions,i=e._cacheIndex,n=this._nActiveActions++,s=t[n];e._cacheIndex=n,t[n]=e,s._cacheIndex=i,t[i]=s}_takeBackAction(e){let t=this._actions,i=e._cacheIndex,n=--this._nActiveActions,s=t[n];e._cacheIndex=n,t[n]=e,s._cacheIndex=i,t[i]=s}_addInactiveBinding(e,t,i){let n=this._bindingsByRootAndName,s=this._bindings,a=n[t];a===void 0&&(a={},n[t]=a),a[i]=e,e._cacheIndex=s.length,s.push(e)}_removeInactiveBinding(e){let t=this._bindings,i=e.binding,n=i.rootNode.uuid,s=i.path,a=this._bindingsByRootAndName,o=a[n],l=t[t.length-1],c=e._cacheIndex;l._cacheIndex=c,t[c]=l,t.pop(),delete o[s],Object.keys(o).length===0&&delete a[n]}_lendBinding(e){let t=this._bindings,i=e._cacheIndex,n=this._nActiveBindings++,s=t[n];e._cacheIndex=n,t[n]=e,s._cacheIndex=i,t[i]=s}_takeBackBinding(e){let t=this._bindings,i=e._cacheIndex,n=--this._nActiveBindings,s=t[n];e._cacheIndex=n,t[n]=e,s._cacheIndex=i,t[i]=s}_lendControlInterpolant(){let e=this._controlInterpolants,t=this._nActiveControlInterpolants++,i=e[t];return i===void 0&&(i=new ys(new Float32Array(2),new Float32Array(2),1,Bp),i.__cacheIndex=t,e[t]=i),i}_takeBackControlInterpolant(e){let t=this._controlInterpolants,i=e.__cacheIndex,n=--this._nActiveControlInterpolants,s=t[n];e.__cacheIndex=n,t[n]=e,s.__cacheIndex=i,t[i]=s}clipAction(e,t,i){let n=t||this._root,s=n.uuid,a=typeof e=="string"?Cn.findByName(n,e):e,o=a!==null?a.uuid:e,l=this._actionsByClip[o],c=null;if(i===void 0&&(a!==null?i=a.blendMode:i=wo),l!==void 0){let u=l.actionByRoot[s];if(u!==void 0&&u.blendMode===i)return u;c=l.knownActions[0],a===null&&(a=c._clip)}if(a===null)return null;let d=new Sa(this,a,t,i);return this._bindAction(d,c),this._addInactiveAction(d,o,s),d}existingAction(e,t){let i=t||this._root,n=i.uuid,s=typeof e=="string"?Cn.findByName(i,e):e,a=s?s.uuid:e,o=this._actionsByClip[a];return o!==void 0&&o.actionByRoot[n]||null}stopAllAction(){let e=this._actions,t=this._nActiveActions;for(let i=t-1;i>=0;--i)e[i].stop();return this}update(e){e*=this.timeScale;let t=this._actions,i=this._nActiveActions,n=this.time+=e,s=Math.sign(e),a=this._accuIndex^=1;for(let c=0;c!==i;++c)t[c]._update(n,e,s,a);let o=this._bindings,l=this._nActiveBindings;for(let c=0;c!==l;++c)o[c].apply(a);return this}setTime(e){this.time=0;for(let t=0;t<this._actions.length;t++)this._actions[t].time=0;return this.update(e)}getRoot(){return this._root}uncacheClip(e){let t=this._actions,i=e.uuid,n=this._actionsByClip,s=n[i];if(s!==void 0){let a=s.knownActions;for(let o=0,l=a.length;o!==l;++o){let c=a[o];this._deactivateAction(c);let d=c._cacheIndex,u=t[t.length-1];c._cacheIndex=null,c._byClipCacheIndex=null,u._cacheIndex=d,t[d]=u,t.pop(),this._removeInactiveBindingsForAction(c)}delete n[i]}}uncacheRoot(e){let t=e.uuid,i=this._actionsByClip;for(let a in i){let o=i[a].actionByRoot,l=o[t];l!==void 0&&(this._deactivateAction(l),this._removeInactiveAction(l))}let n=this._bindingsByRootAndName,s=n[t];if(s!==void 0)for(let a in s){let o=s[a];o.restoreOriginalState(),this._removeInactiveBinding(o)}}uncacheAction(e,t){let i=this.existingAction(e,t);i!==null&&(this._deactivateAction(i),this._removeInactiveAction(i))}};function Vl(r,e,t,i){let n=Up(i);switch(t){case Il:return r*e;case za:return r*e/n.components*n.byteLength;case Ha:return r*e/n.components*n.byteLength;case Ol:return r*e*2/n.components*n.byteLength;case ja:return r*e*2/n.components*n.byteLength;case Pl:return r*e*3/n.components*n.byteLength;case Qt:return r*e*4/n.components*n.byteLength;case Ga:return r*e*4/n.components*n.byteLength;case Ts:case As:return Math.floor((r+3)/4)*Math.floor((e+3)/4)*8;case ks:case Es:return Math.floor((r+3)/4)*Math.floor((e+3)/4)*16;case Wa:case $a:return Math.max(r,16)*Math.max(e,8)/4;case Va:case qa:return Math.max(r,8)*Math.max(e,8)/2;case Xa:case Ka:return Math.floor((r+3)/4)*Math.floor((e+3)/4)*8;case Ya:return Math.floor((r+3)/4)*Math.floor((e+3)/4)*16;case Ja:return Math.floor((r+3)/4)*Math.floor((e+3)/4)*16;case Za:return Math.floor((r+4)/5)*Math.floor((e+3)/4)*16;case Qa:return Math.floor((r+4)/5)*Math.floor((e+4)/5)*16;case eo:return Math.floor((r+5)/6)*Math.floor((e+4)/5)*16;case to:return Math.floor((r+5)/6)*Math.floor((e+5)/6)*16;case io:return Math.floor((r+7)/8)*Math.floor((e+4)/5)*16;case no:return Math.floor((r+7)/8)*Math.floor((e+5)/6)*16;case ro:return Math.floor((r+7)/8)*Math.floor((e+7)/8)*16;case so:return Math.floor((r+9)/10)*Math.floor((e+4)/5)*16;case ao:return Math.floor((r+9)/10)*Math.floor((e+5)/6)*16;case oo:return Math.floor((r+9)/10)*Math.floor((e+7)/8)*16;case lo:return Math.floor((r+9)/10)*Math.floor((e+9)/10)*16;case co:return Math.floor((r+11)/12)*Math.floor((e+9)/10)*16;case uo:return Math.floor((r+11)/12)*Math.floor((e+11)/12)*16;case ho:case fo:case po:return Math.ceil(r/4)*Math.ceil(e/4)*16;case mo:case yo:return Math.ceil(r/4)*Math.ceil(e/4)*8;case bo:case vo:return Math.ceil(r/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function Up(r){switch(r){case yi:case kl:return{byteLength:1,components:1};case Mr:case El:case _r:return{byteLength:2,components:1};case Ba:case Ua:return{byteLength:2,components:4};case cn:case Da:case ri:return{byteLength:4,components:1};case Cl:case Rl:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${r}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:"180"}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__="180");/**
 * @license
 * Copyright 2010-2025 Three.js Authors
 * SPDX-License-Identifier: MIT
 */function ph(){let r=null,e=!1,t=null,i=null;function n(s,a){t(s,a),i=r.requestAnimationFrame(n)}return{start:function(){e!==!0&&t!==null&&(i=r.requestAnimationFrame(n),e=!0)},stop:function(){r.cancelAnimationFrame(i),e=!1},setAnimationLoop:function(s){t=s},setContext:function(s){r=s}}}function Hp(r){let e=new WeakMap;function t(o,l){let c=o.array,d=o.usage,u=c.byteLength,h=r.createBuffer();r.bindBuffer(l,h),r.bufferData(l,c,d),o.onUploadCallback();let m;if(c instanceof Float32Array)m=r.FLOAT;else if(typeof Float16Array<"u"&&c instanceof Float16Array)m=r.HALF_FLOAT;else if(c instanceof Uint16Array)o.isFloat16BufferAttribute?m=r.HALF_FLOAT:m=r.UNSIGNED_SHORT;else if(c instanceof Int16Array)m=r.SHORT;else if(c instanceof Uint32Array)m=r.UNSIGNED_INT;else if(c instanceof Int32Array)m=r.INT;else if(c instanceof Int8Array)m=r.BYTE;else if(c instanceof Uint8Array)m=r.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)m=r.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:h,type:m,bytesPerElement:c.BYTES_PER_ELEMENT,version:o.version,size:u}}function i(o,l,c){let d=l.array,u=l.updateRanges;if(r.bindBuffer(c,o),u.length===0)r.bufferSubData(c,0,d);else{u.sort((m,y)=>m.start-y.start);let h=0;for(let m=1;m<u.length;m++){let y=u[h],b=u[m];b.start<=y.start+y.count+1?y.count=Math.max(y.count,b.start+b.count-y.start):(++h,u[h]=b)}u.length=h+1;for(let m=0,y=u.length;m<y;m++){let b=u[m];r.bufferSubData(c,b.start*d.BYTES_PER_ELEMENT,d,b.start,b.count)}l.clearUpdateRanges()}l.onUploadCallback()}function n(o){return o.isInterleavedBufferAttribute&&(o=o.data),e.get(o)}function s(o){o.isInterleavedBufferAttribute&&(o=o.data);let l=e.get(o);l&&(r.deleteBuffer(l.buffer),e.delete(o))}function a(o,l){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){let d=e.get(o);(!d||d.version<o.version)&&e.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}let c=e.get(o);if(c===void 0)e.set(o,t(o,l));else if(c.version<o.version){if(c.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");i(c.buffer,o,l),c.version=o.version}}return{get:n,remove:s,update:a}}var jp=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,Gp=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,Vp=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,Wp=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,qp=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,$p=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,Xp=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,Kp=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,Yp=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec3 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 ).rgb;
	}
#endif`,Jp=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,Zp=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Qp=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,em=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,tm=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,im=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,nm=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,rm=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,sm=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,am=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,om=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,lm=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,cm=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,um=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif
#ifdef USE_BATCHING_COLOR
	vec3 batchingColor = getBatchingColor( getIndirectIndex( gl_DrawID ) );
	vColor.xyz *= batchingColor.xyz;
#endif`,dm=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
mat3 transposeMat3( const in mat3 m ) {
	mat3 tmp;
	tmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );
	tmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );
	tmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );
	return tmp;
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,hm=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,fm=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,pm=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,mm=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,ym=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,bm=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,vm="gl_FragColor = linearToOutputTexel( gl_FragColor );",gm=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,xm=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
	#else
		vec4 envColor = vec4( 0.0 );
	#endif
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif`,wm=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,Mm=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,_m=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Sm=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,Tm=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,Am=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,km=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,Em=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,Cm=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,Rm=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,Im=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,Pm=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,Om=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`,Lm=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, roughness * roughness) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,Nm=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,Fm=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,Dm=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,Bm=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,Um=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = mix( min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = mix( vec3( 0.04 ), diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.07, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,zm=`struct PhysicalMaterial {
	vec3 diffuseColor;
	float roughness;
	vec3 specularColor;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		float v = 0.5 / ( gv + gl );
		return saturate(v);
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColor;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transposeMat3( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float a = roughness < 0.25 ? -339.2 * r2 + 161.4 * roughness - 25.9 : -8.48 * r2 + 14.3 * roughness - 9.95;
	float b = roughness < 0.25 ? 44.0 * r2 - 23.7 * roughness + 3.26 : 1.97 * r2 - 3.27 * roughness + 0.72;
	float DG = exp( a * dotNV + b ) + ( roughness < 0.25 ? 0.0 : 0.1 * ( roughness - 0.25 ) );
	return saturate( DG * RECIPROCAL_PI );
}
vec2 DFGApprox( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );
	const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );
	vec4 r = roughness * c0 + c1;
	float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;
	vec2 fab = vec2( - 1.04, 1.04 ) * a004 + r.zw;
	return fab;
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColor * t2.x + ( vec3( 1.0 ) - material.specularColor ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseColor * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
	#endif
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnel, material.roughness, singleScattering, multiScattering );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScattering, multiScattering );
	#endif
	vec3 totalScattering = singleScattering + multiScattering;
	vec3 diffuse = material.diffuseColor * ( 1.0 - max( max( totalScattering.r, totalScattering.g ), totalScattering.b ) );
	reflectedLight.indirectSpecular += radiance * singleScattering;
	reflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;
	reflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,Hm=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnel = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,jm=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getIBLIrradiance( geometryNormal );
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,Gm=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,Vm=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,Wm=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,qm=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,$m=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,Xm=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,Km=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,Ym=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,Jm=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Zm=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,Qm=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,e0=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,t0=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,i0=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,n0=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,r0=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,s0=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,a0=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,o0=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,l0=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,c0=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,u0=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,d0=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,h0=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,f0=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,p0=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,m0=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,y0=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return depth * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * depth - far );
}`,b0=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,v0=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,g0=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,x0=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,w0=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,M0=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,_0=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform sampler2D pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {
		float depth = unpackRGBAToDepth( texture2D( depths, uv ) );
		#ifdef USE_REVERSED_DEPTH_BUFFER
			return step( depth, compare );
		#else
			return step( compare, depth );
		#endif
	}
	vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {
		return unpackRGBATo2Half( texture2D( shadow, uv ) );
	}
	float VSMShadow( sampler2D shadow, vec2 uv, float compare ) {
		float occlusion = 1.0;
		vec2 distribution = texture2DDistribution( shadow, uv );
		#ifdef USE_REVERSED_DEPTH_BUFFER
			float hard_shadow = step( distribution.x, compare );
		#else
			float hard_shadow = step( compare, distribution.x );
		#endif
		if ( hard_shadow != 1.0 ) {
			float distance = compare - distribution.x;
			float variance = max( 0.00000, distribution.y * distribution.y );
			float softness_probability = variance / (variance + distance * distance );			softness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 );			occlusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );
		}
		return occlusion;
	}
	float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
		float shadow = 1.0;
		shadowCoord.xyz /= shadowCoord.w;
		shadowCoord.z += shadowBias;
		bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
		bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
		if ( frustumTest ) {
		#if defined( SHADOWMAP_TYPE_PCF )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx0 = - texelSize.x * shadowRadius;
			float dy0 = - texelSize.y * shadowRadius;
			float dx1 = + texelSize.x * shadowRadius;
			float dy1 = + texelSize.y * shadowRadius;
			float dx2 = dx0 / 2.0;
			float dy2 = dy0 / 2.0;
			float dx3 = dx1 / 2.0;
			float dy3 = dy1 / 2.0;
			shadow = (
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )
			) * ( 1.0 / 17.0 );
		#elif defined( SHADOWMAP_TYPE_PCF_SOFT )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx = texelSize.x;
			float dy = texelSize.y;
			vec2 uv = shadowCoord.xy;
			vec2 f = fract( uv * shadowMapSize + 0.5 );
			uv -= f * texelSize;
			shadow = (
				texture2DCompare( shadowMap, uv, shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( dx, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( 0.0, dy ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + texelSize, shadowCoord.z ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, 0.0 ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 0.0 ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, dy ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( 0.0, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 0.0, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( texture2DCompare( shadowMap, uv + vec2( dx, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( dx, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( mix( texture2DCompare( shadowMap, uv + vec2( -dx, -dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, -dy ), shadowCoord.z ),
						  f.x ),
					 mix( texture2DCompare( shadowMap, uv + vec2( -dx, 2.0 * dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 2.0 * dy ), shadowCoord.z ),
						  f.x ),
					 f.y )
			) * ( 1.0 / 9.0 );
		#elif defined( SHADOWMAP_TYPE_VSM )
			shadow = VSMShadow( shadowMap, shadowCoord.xy, shadowCoord.z );
		#else
			shadow = texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );
		#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	vec2 cubeToUV( vec3 v, float texelSizeY ) {
		vec3 absV = abs( v );
		float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );
		absV *= scaleToCube;
		v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );
		vec2 planar = v.xy;
		float almostATexel = 1.5 * texelSizeY;
		float almostOne = 1.0 - almostATexel;
		if ( absV.z >= almostOne ) {
			if ( v.z > 0.0 )
				planar.x = 4.0 - v.x;
		} else if ( absV.x >= almostOne ) {
			float signX = sign( v.x );
			planar.x = v.z * signX + 2.0 * signX;
		} else if ( absV.y >= almostOne ) {
			float signY = sign( v.y );
			planar.x = v.x + 2.0 * signY + 2.0;
			planar.y = v.z * signY - 2.0;
		}
		return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );
	}
	float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		
		float lightToPositionLength = length( lightToPosition );
		if ( lightToPositionLength - shadowCameraFar <= 0.0 && lightToPositionLength - shadowCameraNear >= 0.0 ) {
			float dp = ( lightToPositionLength - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear );			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );
			#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT ) || defined( SHADOWMAP_TYPE_VSM )
				vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;
				shadow = (
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )
				) * ( 1.0 / 9.0 );
			#else
				shadow = texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );
			#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
#endif`,S0=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,T0=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,A0=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,k0=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,E0=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,C0=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,R0=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,I0=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,P0=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,O0=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,L0=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,N0=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,F0=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,D0=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,B0=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,U0=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,z0=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,H0=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,j0=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,G0=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,V0=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,W0=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,q0=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,$0=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,X0=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,K0=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,Y0=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = packDepthToRGBA( dist );
}`,J0=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,Z0=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Q0=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,ey=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,ty=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,iy=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,ny=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,ry=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,sy=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,ay=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,oy=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,ly=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <packing>
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( packNormalToRGB( normal ), diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,cy=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,uy=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,dy=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,hy=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
		float sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );
		outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecularDirect + sheenSpecularIndirect;
	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,fy=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,py=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,my=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,yy=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,by=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,vy=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <packing>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,gy=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,xy=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,ze={alphahash_fragment:jp,alphahash_pars_fragment:Gp,alphamap_fragment:Vp,alphamap_pars_fragment:Wp,alphatest_fragment:qp,alphatest_pars_fragment:$p,aomap_fragment:Xp,aomap_pars_fragment:Kp,batching_pars_vertex:Yp,batching_vertex:Jp,begin_vertex:Zp,beginnormal_vertex:Qp,bsdfs:em,iridescence_fragment:tm,bumpmap_pars_fragment:im,clipping_planes_fragment:nm,clipping_planes_pars_fragment:rm,clipping_planes_pars_vertex:sm,clipping_planes_vertex:am,color_fragment:om,color_pars_fragment:lm,color_pars_vertex:cm,color_vertex:um,common:dm,cube_uv_reflection_fragment:hm,defaultnormal_vertex:fm,displacementmap_pars_vertex:pm,displacementmap_vertex:mm,emissivemap_fragment:ym,emissivemap_pars_fragment:bm,colorspace_fragment:vm,colorspace_pars_fragment:gm,envmap_fragment:xm,envmap_common_pars_fragment:wm,envmap_pars_fragment:Mm,envmap_pars_vertex:_m,envmap_physical_pars_fragment:Lm,envmap_vertex:Sm,fog_vertex:Tm,fog_pars_vertex:Am,fog_fragment:km,fog_pars_fragment:Em,gradientmap_pars_fragment:Cm,lightmap_pars_fragment:Rm,lights_lambert_fragment:Im,lights_lambert_pars_fragment:Pm,lights_pars_begin:Om,lights_toon_fragment:Nm,lights_toon_pars_fragment:Fm,lights_phong_fragment:Dm,lights_phong_pars_fragment:Bm,lights_physical_fragment:Um,lights_physical_pars_fragment:zm,lights_fragment_begin:Hm,lights_fragment_maps:jm,lights_fragment_end:Gm,logdepthbuf_fragment:Vm,logdepthbuf_pars_fragment:Wm,logdepthbuf_pars_vertex:qm,logdepthbuf_vertex:$m,map_fragment:Xm,map_pars_fragment:Km,map_particle_fragment:Ym,map_particle_pars_fragment:Jm,metalnessmap_fragment:Zm,metalnessmap_pars_fragment:Qm,morphinstance_vertex:e0,morphcolor_vertex:t0,morphnormal_vertex:i0,morphtarget_pars_vertex:n0,morphtarget_vertex:r0,normal_fragment_begin:s0,normal_fragment_maps:a0,normal_pars_fragment:o0,normal_pars_vertex:l0,normal_vertex:c0,normalmap_pars_fragment:u0,clearcoat_normal_fragment_begin:d0,clearcoat_normal_fragment_maps:h0,clearcoat_pars_fragment:f0,iridescence_pars_fragment:p0,opaque_fragment:m0,packing:y0,premultiplied_alpha_fragment:b0,project_vertex:v0,dithering_fragment:g0,dithering_pars_fragment:x0,roughnessmap_fragment:w0,roughnessmap_pars_fragment:M0,shadowmap_pars_fragment:_0,shadowmap_pars_vertex:S0,shadowmap_vertex:T0,shadowmask_pars_fragment:A0,skinbase_vertex:k0,skinning_pars_vertex:E0,skinning_vertex:C0,skinnormal_vertex:R0,specularmap_fragment:I0,specularmap_pars_fragment:P0,tonemapping_fragment:O0,tonemapping_pars_fragment:L0,transmission_fragment:N0,transmission_pars_fragment:F0,uv_pars_fragment:D0,uv_pars_vertex:B0,uv_vertex:U0,worldpos_vertex:z0,background_vert:H0,background_frag:j0,backgroundCube_vert:G0,backgroundCube_frag:V0,cube_vert:W0,cube_frag:q0,depth_vert:$0,depth_frag:X0,distanceRGBA_vert:K0,distanceRGBA_frag:Y0,equirect_vert:J0,equirect_frag:Z0,linedashed_vert:Q0,linedashed_frag:ey,meshbasic_vert:ty,meshbasic_frag:iy,meshlambert_vert:ny,meshlambert_frag:ry,meshmatcap_vert:sy,meshmatcap_frag:ay,meshnormal_vert:oy,meshnormal_frag:ly,meshphong_vert:cy,meshphong_frag:uy,meshphysical_vert:dy,meshphysical_frag:hy,meshtoon_vert:fy,meshtoon_frag:py,points_vert:my,points_frag:yy,shadow_vert:by,shadow_frag:vy,sprite_vert:gy,sprite_frag:xy},oe={common:{diffuse:{value:new Me(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Fe},alphaMap:{value:null},alphaMapTransform:{value:new Fe},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Fe}},envmap:{envMap:{value:null},envMapRotation:{value:new Fe},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Fe}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Fe}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Fe},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Fe},normalScale:{value:new Oe(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Fe},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Fe}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Fe}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Fe}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Me(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Me(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Fe},alphaTest:{value:0},uvTransform:{value:new Fe}},sprite:{diffuse:{value:new Me(16777215)},opacity:{value:1},center:{value:new Oe(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Fe},alphaMap:{value:null},alphaMapTransform:{value:new Fe},alphaTest:{value:0}}},Oi={basic:{uniforms:Ft([oe.common,oe.specularmap,oe.envmap,oe.aomap,oe.lightmap,oe.fog]),vertexShader:ze.meshbasic_vert,fragmentShader:ze.meshbasic_frag},lambert:{uniforms:Ft([oe.common,oe.specularmap,oe.envmap,oe.aomap,oe.lightmap,oe.emissivemap,oe.bumpmap,oe.normalmap,oe.displacementmap,oe.fog,oe.lights,{emissive:{value:new Me(0)}}]),vertexShader:ze.meshlambert_vert,fragmentShader:ze.meshlambert_frag},phong:{uniforms:Ft([oe.common,oe.specularmap,oe.envmap,oe.aomap,oe.lightmap,oe.emissivemap,oe.bumpmap,oe.normalmap,oe.displacementmap,oe.fog,oe.lights,{emissive:{value:new Me(0)},specular:{value:new Me(1118481)},shininess:{value:30}}]),vertexShader:ze.meshphong_vert,fragmentShader:ze.meshphong_frag},standard:{uniforms:Ft([oe.common,oe.envmap,oe.aomap,oe.lightmap,oe.emissivemap,oe.bumpmap,oe.normalmap,oe.displacementmap,oe.roughnessmap,oe.metalnessmap,oe.fog,oe.lights,{emissive:{value:new Me(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:ze.meshphysical_vert,fragmentShader:ze.meshphysical_frag},toon:{uniforms:Ft([oe.common,oe.aomap,oe.lightmap,oe.emissivemap,oe.bumpmap,oe.normalmap,oe.displacementmap,oe.gradientmap,oe.fog,oe.lights,{emissive:{value:new Me(0)}}]),vertexShader:ze.meshtoon_vert,fragmentShader:ze.meshtoon_frag},matcap:{uniforms:Ft([oe.common,oe.bumpmap,oe.normalmap,oe.displacementmap,oe.fog,{matcap:{value:null}}]),vertexShader:ze.meshmatcap_vert,fragmentShader:ze.meshmatcap_frag},points:{uniforms:Ft([oe.points,oe.fog]),vertexShader:ze.points_vert,fragmentShader:ze.points_frag},dashed:{uniforms:Ft([oe.common,oe.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:ze.linedashed_vert,fragmentShader:ze.linedashed_frag},depth:{uniforms:Ft([oe.common,oe.displacementmap]),vertexShader:ze.depth_vert,fragmentShader:ze.depth_frag},normal:{uniforms:Ft([oe.common,oe.bumpmap,oe.normalmap,oe.displacementmap,{opacity:{value:1}}]),vertexShader:ze.meshnormal_vert,fragmentShader:ze.meshnormal_frag},sprite:{uniforms:Ft([oe.sprite,oe.fog]),vertexShader:ze.sprite_vert,fragmentShader:ze.sprite_frag},background:{uniforms:{uvTransform:{value:new Fe},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:ze.background_vert,fragmentShader:ze.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Fe}},vertexShader:ze.backgroundCube_vert,fragmentShader:ze.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:ze.cube_vert,fragmentShader:ze.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:ze.equirect_vert,fragmentShader:ze.equirect_frag},distanceRGBA:{uniforms:Ft([oe.common,oe.displacementmap,{referencePosition:{value:new L},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:ze.distanceRGBA_vert,fragmentShader:ze.distanceRGBA_frag},shadow:{uniforms:Ft([oe.lights,oe.fog,{color:{value:new Me(0)},opacity:{value:1}}]),vertexShader:ze.shadow_vert,fragmentShader:ze.shadow_frag}};Oi.physical={uniforms:Ft([Oi.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Fe},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Fe},clearcoatNormalScale:{value:new Oe(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Fe},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Fe},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Fe},sheen:{value:0},sheenColor:{value:new Me(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Fe},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Fe},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Fe},transmissionSamplerSize:{value:new Oe},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Fe},attenuationDistance:{value:0},attenuationColor:{value:new Me(0)},specularColor:{value:new Me(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Fe},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Fe},anisotropyVector:{value:new Oe},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Fe}}]),vertexShader:ze.meshphysical_vert,fragmentShader:ze.meshphysical_frag};var _o={r:0,b:0,g:0},Dn=new ni,wy=new Be;function My(r,e,t,i,n,s,a){let o=new Me(0),l=s===!0?0:1,c,d,u=null,h=0,m=null;function y(g){let v=g.isScene===!0?g.background:null;return v&&v.isTexture&&(v=(g.backgroundBlurriness>0?t:e).get(v)),v}function b(g){let v=!1,T=y(g);T===null?f(o,l):T&&T.isColor&&(f(T,1),v=!0);let A=r.xr.getEnvironmentBlendMode();A==="additive"?i.buffers.color.setClear(0,0,0,1,a):A==="alpha-blend"&&i.buffers.color.setClear(0,0,0,0,a),(r.autoClear||v)&&(i.buffers.depth.setTest(!0),i.buffers.depth.setMask(!0),i.buffers.color.setMask(!0),r.clear(r.autoClearColor,r.autoClearDepth,r.autoClearStencil))}function p(g,v){let T=y(v);T&&(T.isCubeTexture||T.mapping===Ss)?(d===void 0&&(d=new We(new Gt(1,1,1),new pi({name:"BackgroundCubeMaterial",uniforms:Fn(Oi.backgroundCube.uniforms),vertexShader:Oi.backgroundCube.vertexShader,fragmentShader:Oi.backgroundCube.fragmentShader,side:Vt,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),d.geometry.deleteAttribute("normal"),d.geometry.deleteAttribute("uv"),d.onBeforeRender=function(A,E,P){this.matrixWorld.copyPosition(P.matrixWorld)},Object.defineProperty(d.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),n.update(d)),Dn.copy(v.backgroundRotation),Dn.x*=-1,Dn.y*=-1,Dn.z*=-1,T.isCubeTexture&&T.isRenderTargetTexture===!1&&(Dn.y*=-1,Dn.z*=-1),d.material.uniforms.envMap.value=T,d.material.uniforms.flipEnvMap.value=T.isCubeTexture&&T.isRenderTargetTexture===!1?-1:1,d.material.uniforms.backgroundBlurriness.value=v.backgroundBlurriness,d.material.uniforms.backgroundIntensity.value=v.backgroundIntensity,d.material.uniforms.backgroundRotation.value.setFromMatrix4(wy.makeRotationFromEuler(Dn)),d.material.toneMapped=Ve.getTransfer(T.colorSpace)!==Qe,(u!==T||h!==T.version||m!==r.toneMapping)&&(d.material.needsUpdate=!0,u=T,h=T.version,m=r.toneMapping),d.layers.enableAll(),g.unshift(d,d.geometry,d.material,0,0,null)):T&&T.isTexture&&(c===void 0&&(c=new We(new ki(2,2),new pi({name:"BackgroundMaterial",uniforms:Fn(Oi.background.uniforms),vertexShader:Oi.background.vertexShader,fragmentShader:Oi.background.fragmentShader,side:fi,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),n.update(c)),c.material.uniforms.t2D.value=T,c.material.uniforms.backgroundIntensity.value=v.backgroundIntensity,c.material.toneMapped=Ve.getTransfer(T.colorSpace)!==Qe,T.matrixAutoUpdate===!0&&T.updateMatrix(),c.material.uniforms.uvTransform.value.copy(T.matrix),(u!==T||h!==T.version||m!==r.toneMapping)&&(c.material.needsUpdate=!0,u=T,h=T.version,m=r.toneMapping),c.layers.enableAll(),g.unshift(c,c.geometry,c.material,0,0,null))}function f(g,v){g.getRGB(_o,Hl(r)),i.buffers.color.setClear(_o.r,_o.g,_o.b,v,a)}function x(){d!==void 0&&(d.geometry.dispose(),d.material.dispose(),d=void 0),c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0)}return{getClearColor:function(){return o},setClearColor:function(g,v=1){o.set(g),l=v,f(o,l)},getClearAlpha:function(){return l},setClearAlpha:function(g){l=g,f(o,l)},render:b,addToRenderList:p,dispose:x}}function _y(r,e){let t=r.getParameter(r.MAX_VERTEX_ATTRIBS),i={},n=h(null),s=n,a=!1;function o(M,R,F,j,W){let K=!1,C=u(j,F,R);s!==C&&(s=C,c(s.object)),K=m(M,j,F,W),K&&y(M,j,F,W),W!==null&&e.update(W,r.ELEMENT_ARRAY_BUFFER),(K||a)&&(a=!1,v(M,R,F,j),W!==null&&r.bindBuffer(r.ELEMENT_ARRAY_BUFFER,e.get(W).buffer))}function l(){return r.createVertexArray()}function c(M){return r.bindVertexArray(M)}function d(M){return r.deleteVertexArray(M)}function u(M,R,F){let j=F.wireframe===!0,W=i[M.id];W===void 0&&(W={},i[M.id]=W);let K=W[R.id];K===void 0&&(K={},W[R.id]=K);let C=K[j];return C===void 0&&(C=h(l()),K[j]=C),C}function h(M){let R=[],F=[],j=[];for(let W=0;W<t;W++)R[W]=0,F[W]=0,j[W]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:R,enabledAttributes:F,attributeDivisors:j,object:M,attributes:{},index:null}}function m(M,R,F,j){let W=s.attributes,K=R.attributes,C=0,U=F.getAttributes();for(let O in U)if(U[O].location>=0){let Y=W[O],re=K[O];if(re===void 0&&(O==="instanceMatrix"&&M.instanceMatrix&&(re=M.instanceMatrix),O==="instanceColor"&&M.instanceColor&&(re=M.instanceColor)),Y===void 0||Y.attribute!==re||re&&Y.data!==re.data)return!0;C++}return s.attributesNum!==C||s.index!==j}function y(M,R,F,j){let W={},K=R.attributes,C=0,U=F.getAttributes();for(let O in U)if(U[O].location>=0){let Y=K[O];Y===void 0&&(O==="instanceMatrix"&&M.instanceMatrix&&(Y=M.instanceMatrix),O==="instanceColor"&&M.instanceColor&&(Y=M.instanceColor));let re={};re.attribute=Y,Y&&Y.data&&(re.data=Y.data),W[O]=re,C++}s.attributes=W,s.attributesNum=C,s.index=j}function b(){let M=s.newAttributes;for(let R=0,F=M.length;R<F;R++)M[R]=0}function p(M){f(M,0)}function f(M,R){let F=s.newAttributes,j=s.enabledAttributes,W=s.attributeDivisors;F[M]=1,j[M]===0&&(r.enableVertexAttribArray(M),j[M]=1),W[M]!==R&&(r.vertexAttribDivisor(M,R),W[M]=R)}function x(){let M=s.newAttributes,R=s.enabledAttributes;for(let F=0,j=R.length;F<j;F++)R[F]!==M[F]&&(r.disableVertexAttribArray(F),R[F]=0)}function g(M,R,F,j,W,K,C){C===!0?r.vertexAttribIPointer(M,R,F,W,K):r.vertexAttribPointer(M,R,F,j,W,K)}function v(M,R,F,j){b();let W=j.attributes,K=F.getAttributes(),C=R.defaultAttributeValues;for(let U in K){let O=K[U];if(O.location>=0){let z=W[U];if(z===void 0&&(U==="instanceMatrix"&&M.instanceMatrix&&(z=M.instanceMatrix),U==="instanceColor"&&M.instanceColor&&(z=M.instanceColor)),z!==void 0){let Y=z.normalized,re=z.itemSize,Te=e.get(z);if(Te===void 0)continue;let qe=Te.buffer,Le=Te.type,Xe=Te.bytesPerElement,$=Le===r.INT||Le===r.UNSIGNED_INT||z.gpuType===Da;if(z.isInterleavedBufferAttribute){let Z=z.data,he=Z.stride,Ie=z.offset;if(Z.isInstancedInterleavedBuffer){for(let _e=0;_e<O.locationSize;_e++)f(O.location+_e,Z.meshPerAttribute);M.isInstancedMesh!==!0&&j._maxInstanceCount===void 0&&(j._maxInstanceCount=Z.meshPerAttribute*Z.count)}else for(let _e=0;_e<O.locationSize;_e++)p(O.location+_e);r.bindBuffer(r.ARRAY_BUFFER,qe);for(let _e=0;_e<O.locationSize;_e++)g(O.location+_e,re/O.locationSize,Le,Y,he*Xe,(Ie+re/O.locationSize*_e)*Xe,$)}else{if(z.isInstancedBufferAttribute){for(let Z=0;Z<O.locationSize;Z++)f(O.location+Z,z.meshPerAttribute);M.isInstancedMesh!==!0&&j._maxInstanceCount===void 0&&(j._maxInstanceCount=z.meshPerAttribute*z.count)}else for(let Z=0;Z<O.locationSize;Z++)p(O.location+Z);r.bindBuffer(r.ARRAY_BUFFER,qe);for(let Z=0;Z<O.locationSize;Z++)g(O.location+Z,re/O.locationSize,Le,Y,re*Xe,re/O.locationSize*Z*Xe,$)}}else if(C!==void 0){let Y=C[U];if(Y!==void 0)switch(Y.length){case 2:r.vertexAttrib2fv(O.location,Y);break;case 3:r.vertexAttrib3fv(O.location,Y);break;case 4:r.vertexAttrib4fv(O.location,Y);break;default:r.vertexAttrib1fv(O.location,Y)}}}}x()}function T(){P();for(let M in i){let R=i[M];for(let F in R){let j=R[F];for(let W in j)d(j[W].object),delete j[W];delete R[F]}delete i[M]}}function A(M){if(i[M.id]===void 0)return;let R=i[M.id];for(let F in R){let j=R[F];for(let W in j)d(j[W].object),delete j[W];delete R[F]}delete i[M.id]}function E(M){for(let R in i){let F=i[R];if(F[M.id]===void 0)continue;let j=F[M.id];for(let W in j)d(j[W].object),delete j[W];delete F[M.id]}}function P(){_(),a=!0,s!==n&&(s=n,c(s.object))}function _(){n.geometry=null,n.program=null,n.wireframe=!1}return{setup:o,reset:P,resetDefaultState:_,dispose:T,releaseStatesOfGeometry:A,releaseStatesOfProgram:E,initAttributes:b,enableAttribute:p,disableUnusedAttributes:x}}function Sy(r,e,t){let i;function n(c){i=c}function s(c,d){r.drawArrays(i,c,d),t.update(d,i,1)}function a(c,d,u){u!==0&&(r.drawArraysInstanced(i,c,d,u),t.update(d,i,u))}function o(c,d,u){if(u===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(i,c,0,d,0,u);let m=0;for(let y=0;y<u;y++)m+=d[y];t.update(m,i,1)}function l(c,d,u,h){if(u===0)return;let m=e.get("WEBGL_multi_draw");if(m===null)for(let y=0;y<c.length;y++)a(c[y],d[y],h[y]);else{m.multiDrawArraysInstancedWEBGL(i,c,0,d,0,h,0,u);let y=0;for(let b=0;b<u;b++)y+=d[b]*h[b];t.update(y,i,1)}}this.setMode=n,this.render=s,this.renderInstances=a,this.renderMultiDraw=o,this.renderMultiDrawInstances=l}function Ty(r,e,t,i){let n;function s(){if(n!==void 0)return n;if(e.has("EXT_texture_filter_anisotropic")===!0){let E=e.get("EXT_texture_filter_anisotropic");n=r.getParameter(E.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else n=0;return n}function a(E){return!(E!==Qt&&i.convert(E)!==r.getParameter(r.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(E){let P=E===_r&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(E!==yi&&i.convert(E)!==r.getParameter(r.IMPLEMENTATION_COLOR_READ_TYPE)&&E!==ri&&!P)}function l(E){if(E==="highp"){if(r.getShaderPrecisionFormat(r.VERTEX_SHADER,r.HIGH_FLOAT).precision>0&&r.getShaderPrecisionFormat(r.FRAGMENT_SHADER,r.HIGH_FLOAT).precision>0)return"highp";E="mediump"}return E==="mediump"&&r.getShaderPrecisionFormat(r.VERTEX_SHADER,r.MEDIUM_FLOAT).precision>0&&r.getShaderPrecisionFormat(r.FRAGMENT_SHADER,r.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=t.precision!==void 0?t.precision:"highp",d=l(c);d!==c&&(console.warn("THREE.WebGLRenderer:",c,"not supported, using",d,"instead."),c=d);let u=t.logarithmicDepthBuffer===!0,h=t.reversedDepthBuffer===!0&&e.has("EXT_clip_control"),m=r.getParameter(r.MAX_TEXTURE_IMAGE_UNITS),y=r.getParameter(r.MAX_VERTEX_TEXTURE_IMAGE_UNITS),b=r.getParameter(r.MAX_TEXTURE_SIZE),p=r.getParameter(r.MAX_CUBE_MAP_TEXTURE_SIZE),f=r.getParameter(r.MAX_VERTEX_ATTRIBS),x=r.getParameter(r.MAX_VERTEX_UNIFORM_VECTORS),g=r.getParameter(r.MAX_VARYING_VECTORS),v=r.getParameter(r.MAX_FRAGMENT_UNIFORM_VECTORS),T=y>0,A=r.getParameter(r.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:s,getMaxPrecision:l,textureFormatReadable:a,textureTypeReadable:o,precision:c,logarithmicDepthBuffer:u,reversedDepthBuffer:h,maxTextures:m,maxVertexTextures:y,maxTextureSize:b,maxCubemapSize:p,maxAttributes:f,maxVertexUniforms:x,maxVaryings:g,maxFragmentUniforms:v,vertexTextures:T,maxSamples:A}}function Ay(r){let e=this,t=null,i=0,n=!1,s=!1,a=new gi,o=new Fe,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(u,h){let m=u.length!==0||h||i!==0||n;return n=h,i=u.length,m},this.beginShadows=function(){s=!0,d(null)},this.endShadows=function(){s=!1},this.setGlobalState=function(u,h){t=d(u,h,0)},this.setState=function(u,h,m){let y=u.clippingPlanes,b=u.clipIntersection,p=u.clipShadows,f=r.get(u);if(!n||y===null||y.length===0||s&&!p)s?d(null):c();else{let x=s?0:i,g=x*4,v=f.clippingState||null;l.value=v,v=d(y,h,g,m);for(let T=0;T!==g;++T)v[T]=t[T];f.clippingState=v,this.numIntersection=b?this.numPlanes:0,this.numPlanes+=x}};function c(){l.value!==t&&(l.value=t,l.needsUpdate=i>0),e.numPlanes=i,e.numIntersection=0}function d(u,h,m,y){let b=u!==null?u.length:0,p=null;if(b!==0){if(p=l.value,y!==!0||p===null){let f=m+b*4,x=h.matrixWorldInverse;o.getNormalMatrix(x),(p===null||p.length<f)&&(p=new Float32Array(f));for(let g=0,v=m;g!==b;++g,v+=4)a.copy(u[g]).applyMatrix4(x,o),a.normal.toArray(p,v),p[v+3]=a.constant}l.value=p,l.needsUpdate=!0}return e.numPlanes=b,e.numIntersection=0,p}}function ky(r){let e=new WeakMap;function t(a,o){return o===La?a.mapping=On:o===Na&&(a.mapping=Ln),a}function i(a){if(a&&a.isTexture){let o=a.mapping;if(o===La||o===Na)if(e.has(a)){let l=e.get(a).texture;return t(l,a.mapping)}else{let l=a.image;if(l&&l.height>0){let c=new ha(l.height);return c.fromEquirectangularTexture(r,a),e.set(a,c),a.addEventListener("dispose",n),t(c.texture,a.mapping)}else return null}}return a}function n(a){let o=a.target;o.removeEventListener("dispose",n);let l=e.get(o);l!==void 0&&(e.delete(o),l.dispose())}function s(){e=new WeakMap}return{get:i,dispose:s}}var Er=4,Wd=[.125,.215,.35,.446,.526,.582],zn=20,Wl=new Pn,qd=new Me,ql=null,$l=0,Xl=0,Kl=!1,Un=(1+Math.sqrt(5))/2,kr=1/Un,$d=[new L(-Un,kr,0),new L(Un,kr,0),new L(-kr,0,Un),new L(kr,0,Un),new L(0,Un,-kr),new L(0,Un,kr),new L(-1,1,-1),new L(1,1,-1),new L(-1,1,1),new L(1,1,1)],Ey=new L,Ao=class{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(e,t=0,i=.1,n=100,s={}){let{size:a=256,position:o=Ey}=s;ql=this._renderer.getRenderTarget(),$l=this._renderer.getActiveCubeFace(),Xl=this._renderer.getActiveMipmapLevel(),Kl=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(a);let l=this._allocateTargets();return l.depthBuffer=!0,this._sceneToCubeUV(e,i,n,l,o),t>0&&this._blur(l,0,0,t),this._applyPMREM(l),this._cleanup(l),l}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Yd(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Kd(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodPlanes.length;e++)this._lodPlanes[e].dispose()}_cleanup(e){this._renderer.setRenderTarget(ql,$l,Xl),this._renderer.xr.enabled=Kl,e.scissorTest=!1,So(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===On||e.mapping===Ln?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),ql=this._renderer.getRenderTarget(),$l=this._renderer.getActiveCubeFace(),Xl=this._renderer.getActiveMipmapLevel(),Kl=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;let i=t||this._allocateTargets();return this._textureToCubeUV(e,i),this._applyPMREM(i),this._cleanup(i),i}_allocateTargets(){let e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,i={magFilter:zt,minFilter:zt,generateMipmaps:!1,type:_r,format:Qt,colorSpace:_t,depthBuffer:!1},n=Xd(e,t,i);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Xd(e,t,i);let{_lodMax:s}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=Cy(s)),this._blurMaterial=Ry(s,e,t)}return n}_compileMaterial(e){let t=new We(this._lodPlanes[0],e);this._renderer.compile(t,Wl)}_sceneToCubeUV(e,t,i,n,s){let l=new xt(90,1,t,i),c=[1,-1,1,1,1,1],d=[1,1,1,-1,-1,-1],u=this._renderer,h=u.autoClear,m=u.toneMapping;u.getClearColor(qd),u.toneMapping=Ki,u.autoClear=!1,u.state.buffers.depth.getReversed()&&(u.setRenderTarget(n),u.clearDepth(),u.setRenderTarget(null));let b=new jt({name:"PMREM.Background",side:Vt,depthWrite:!1,depthTest:!1}),p=new We(new Gt,b),f=!1,x=e.background;x?x.isColor&&(b.color.copy(x),e.background=null,f=!0):(b.color.copy(qd),f=!0);for(let g=0;g<6;g++){let v=g%3;v===0?(l.up.set(0,c[g],0),l.position.set(s.x,s.y,s.z),l.lookAt(s.x+d[g],s.y,s.z)):v===1?(l.up.set(0,0,c[g]),l.position.set(s.x,s.y,s.z),l.lookAt(s.x,s.y+d[g],s.z)):(l.up.set(0,c[g],0),l.position.set(s.x,s.y,s.z),l.lookAt(s.x,s.y,s.z+d[g]));let T=this._cubeSize;So(n,v*T,g>2?T:0,T,T),u.setRenderTarget(n),f&&u.render(p,l),u.render(e,l)}p.geometry.dispose(),p.material.dispose(),u.toneMapping=m,u.autoClear=h,e.background=x}_textureToCubeUV(e,t){let i=this._renderer,n=e.mapping===On||e.mapping===Ln;n?(this._cubemapMaterial===null&&(this._cubemapMaterial=Yd()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Kd());let s=n?this._cubemapMaterial:this._equirectMaterial,a=new We(this._lodPlanes[0],s),o=s.uniforms;o.envMap.value=e;let l=this._cubeSize;So(t,0,0,3*l,2*l),i.setRenderTarget(t),i.render(a,Wl)}_applyPMREM(e){let t=this._renderer,i=t.autoClear;t.autoClear=!1;let n=this._lodPlanes.length;for(let s=1;s<n;s++){let a=Math.sqrt(this._sigmas[s]*this._sigmas[s]-this._sigmas[s-1]*this._sigmas[s-1]),o=$d[(n-s-1)%$d.length];this._blur(e,s-1,s,a,o)}t.autoClear=i}_blur(e,t,i,n,s){let a=this._pingPongRenderTarget;this._halfBlur(e,a,t,i,n,"latitudinal",s),this._halfBlur(a,e,i,i,n,"longitudinal",s)}_halfBlur(e,t,i,n,s,a,o){let l=this._renderer,c=this._blurMaterial;a!=="latitudinal"&&a!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");let d=3,u=new We(this._lodPlanes[n],c),h=c.uniforms,m=this._sizeLods[i]-1,y=isFinite(s)?Math.PI/(2*m):2*Math.PI/(2*zn-1),b=s/y,p=isFinite(s)?1+Math.floor(d*b):zn;p>zn&&console.warn(`sigmaRadians, ${s}, is too large and will clip, as it requested ${p} samples when the maximum is set to ${zn}`);let f=[],x=0;for(let E=0;E<zn;++E){let P=E/b,_=Math.exp(-P*P/2);f.push(_),E===0?x+=_:E<p&&(x+=2*_)}for(let E=0;E<f.length;E++)f[E]=f[E]/x;h.envMap.value=e.texture,h.samples.value=p,h.weights.value=f,h.latitudinal.value=a==="latitudinal",o&&(h.poleAxis.value=o);let{_lodMax:g}=this;h.dTheta.value=y,h.mipInt.value=g-i;let v=this._sizeLods[n],T=3*v*(n>g-Er?n-g+Er:0),A=4*(this._cubeSize-v);So(t,T,A,3*v,2*v),l.setRenderTarget(t),l.render(u,Wl)}};function Cy(r){let e=[],t=[],i=[],n=r,s=r-Er+1+Wd.length;for(let a=0;a<s;a++){let o=Math.pow(2,n);t.push(o);let l=1/o;a>r-Er?l=Wd[a-r+Er-1]:a===0&&(l=0),i.push(l);let c=1/(o-2),d=-c,u=1+c,h=[d,d,u,d,u,u,d,d,u,u,d,u],m=6,y=6,b=3,p=2,f=1,x=new Float32Array(b*y*m),g=new Float32Array(p*y*m),v=new Float32Array(f*y*m);for(let A=0;A<m;A++){let E=A%3*2/3-1,P=A>2?0:-1,_=[E,P,0,E+2/3,P,0,E+2/3,P+1,0,E,P,0,E+2/3,P+1,0,E,P+1,0];x.set(_,b*y*A),g.set(h,p*y*A);let M=[A,A,A,A,A,A];v.set(M,f*y*A)}let T=new Ct;T.setAttribute("position",new wt(x,b)),T.setAttribute("uv",new wt(g,p)),T.setAttribute("faceIndex",new wt(v,f)),e.push(T),n>Er&&n--}return{lodPlanes:e,sizeLods:t,sigmas:i}}function Xd(r,e,t){let i=new Si(r,e,t);return i.texture.mapping=Ss,i.texture.name="PMREM.cubeUv",i.scissorTest=!0,i}function So(r,e,t,i,n){r.viewport.set(e,t,i,n),r.scissor.set(e,t,i,n)}function Ry(r,e,t){let i=new Float32Array(zn),n=new L(0,1,0);return new pi({name:"SphericalGaussianBlur",defines:{n:zn,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${r}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:i},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:n}},vertexShader:sc(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:Xi,depthTest:!1,depthWrite:!1})}function Kd(){return new pi({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:sc(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:Xi,depthTest:!1,depthWrite:!1})}function Yd(){return new pi({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:sc(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Xi,depthTest:!1,depthWrite:!1})}function sc(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}function Iy(r){let e=new WeakMap,t=null;function i(o){if(o&&o.isTexture){let l=o.mapping,c=l===La||l===Na,d=l===On||l===Ln;if(c||d){let u=e.get(o),h=u!==void 0?u.texture.pmremVersion:0;if(o.isRenderTargetTexture&&o.pmremVersion!==h)return t===null&&(t=new Ao(r)),u=c?t.fromEquirectangular(o,u):t.fromCubemap(o,u),u.texture.pmremVersion=o.pmremVersion,e.set(o,u),u.texture;if(u!==void 0)return u.texture;{let m=o.image;return c&&m&&m.height>0||d&&m&&n(m)?(t===null&&(t=new Ao(r)),u=c?t.fromEquirectangular(o):t.fromCubemap(o),u.texture.pmremVersion=o.pmremVersion,e.set(o,u),o.addEventListener("dispose",s),u.texture):null}}}return o}function n(o){let l=0,c=6;for(let d=0;d<c;d++)o[d]!==void 0&&l++;return l===c}function s(o){let l=o.target;l.removeEventListener("dispose",s);let c=e.get(l);c!==void 0&&(e.delete(l),c.dispose())}function a(){e=new WeakMap,t!==null&&(t.dispose(),t=null)}return{get:i,dispose:a}}function Py(r){let e={};function t(i){if(e[i]!==void 0)return e[i];let n;switch(i){case"WEBGL_depth_texture":n=r.getExtension("WEBGL_depth_texture")||r.getExtension("MOZ_WEBGL_depth_texture")||r.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":n=r.getExtension("EXT_texture_filter_anisotropic")||r.getExtension("MOZ_EXT_texture_filter_anisotropic")||r.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":n=r.getExtension("WEBGL_compressed_texture_s3tc")||r.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||r.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":n=r.getExtension("WEBGL_compressed_texture_pvrtc")||r.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:n=r.getExtension(i)}return e[i]=n,n}return{has:function(i){return t(i)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(i){let n=t(i);return n===null&&ur("THREE.WebGLRenderer: "+i+" extension not supported."),n}}}function Oy(r,e,t,i){let n={},s=new WeakMap;function a(u){let h=u.target;h.index!==null&&e.remove(h.index);for(let y in h.attributes)e.remove(h.attributes[y]);h.removeEventListener("dispose",a),delete n[h.id];let m=s.get(h);m&&(e.remove(m),s.delete(h)),i.releaseStatesOfGeometry(h),h.isInstancedBufferGeometry===!0&&delete h._maxInstanceCount,t.memory.geometries--}function o(u,h){return n[h.id]===!0||(h.addEventListener("dispose",a),n[h.id]=!0,t.memory.geometries++),h}function l(u){let h=u.attributes;for(let m in h)e.update(h[m],r.ARRAY_BUFFER)}function c(u){let h=[],m=u.index,y=u.attributes.position,b=0;if(m!==null){let x=m.array;b=m.version;for(let g=0,v=x.length;g<v;g+=3){let T=x[g+0],A=x[g+1],E=x[g+2];h.push(T,A,A,E,E,T)}}else if(y!==void 0){let x=y.array;b=y.version;for(let g=0,v=x.length/3-1;g<v;g+=3){let T=g+0,A=g+1,E=g+2;h.push(T,A,A,E,E,T)}}else return;let p=new(zl(h)?Zr:Jr)(h,1);p.version=b;let f=s.get(u);f&&e.remove(f),s.set(u,p)}function d(u){let h=s.get(u);if(h){let m=u.index;m!==null&&h.version<m.version&&c(u)}else c(u);return s.get(u)}return{get:o,update:l,getWireframeAttribute:d}}function Ly(r,e,t){let i;function n(h){i=h}let s,a;function o(h){s=h.type,a=h.bytesPerElement}function l(h,m){r.drawElements(i,m,s,h*a),t.update(m,i,1)}function c(h,m,y){y!==0&&(r.drawElementsInstanced(i,m,s,h*a,y),t.update(m,i,y))}function d(h,m,y){if(y===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(i,m,0,s,h,0,y);let p=0;for(let f=0;f<y;f++)p+=m[f];t.update(p,i,1)}function u(h,m,y,b){if(y===0)return;let p=e.get("WEBGL_multi_draw");if(p===null)for(let f=0;f<h.length;f++)c(h[f]/a,m[f],b[f]);else{p.multiDrawElementsInstancedWEBGL(i,m,0,s,h,0,b,0,y);let f=0;for(let x=0;x<y;x++)f+=m[x]*b[x];t.update(f,i,1)}}this.setMode=n,this.setIndex=o,this.render=l,this.renderInstances=c,this.renderMultiDraw=d,this.renderMultiDrawInstances=u}function Ny(r){let e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function i(s,a,o){switch(t.calls++,a){case r.TRIANGLES:t.triangles+=o*(s/3);break;case r.LINES:t.lines+=o*(s/2);break;case r.LINE_STRIP:t.lines+=o*(s-1);break;case r.LINE_LOOP:t.lines+=o*s;break;case r.POINTS:t.points+=o*s;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",a);break}}function n(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:n,update:i}}function Fy(r,e,t){let i=new WeakMap,n=new Ye;function s(a,o,l){let c=a.morphTargetInfluences,d=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,u=d!==void 0?d.length:0,h=i.get(o);if(h===void 0||h.count!==u){let _=function(){E.dispose(),i.delete(o),o.removeEventListener("dispose",_)};h!==void 0&&h.texture.dispose();let m=o.morphAttributes.position!==void 0,y=o.morphAttributes.normal!==void 0,b=o.morphAttributes.color!==void 0,p=o.morphAttributes.position||[],f=o.morphAttributes.normal||[],x=o.morphAttributes.color||[],g=0;m===!0&&(g=1),y===!0&&(g=2),b===!0&&(g=3);let v=o.attributes.position.count*g,T=1;v>e.maxTextureSize&&(T=Math.ceil(v/e.maxTextureSize),v=e.maxTextureSize);let A=new Float32Array(v*T*4*u),E=new Kr(A,v,T,u);E.type=ri,E.needsUpdate=!0;let P=g*4;for(let M=0;M<u;M++){let R=p[M],F=f[M],j=x[M],W=v*T*4*M;for(let K=0;K<R.count;K++){let C=K*P;m===!0&&(n.fromBufferAttribute(R,K),A[W+C+0]=n.x,A[W+C+1]=n.y,A[W+C+2]=n.z,A[W+C+3]=0),y===!0&&(n.fromBufferAttribute(F,K),A[W+C+4]=n.x,A[W+C+5]=n.y,A[W+C+6]=n.z,A[W+C+7]=0),b===!0&&(n.fromBufferAttribute(j,K),A[W+C+8]=n.x,A[W+C+9]=n.y,A[W+C+10]=n.z,A[W+C+11]=j.itemSize===4?n.w:1)}}h={count:u,texture:E,size:new Oe(v,T)},i.set(o,h),o.addEventListener("dispose",_)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)l.getUniforms().setValue(r,"morphTexture",a.morphTexture,t);else{let m=0;for(let b=0;b<c.length;b++)m+=c[b];let y=o.morphTargetsRelative?1:1-m;l.getUniforms().setValue(r,"morphTargetBaseInfluence",y),l.getUniforms().setValue(r,"morphTargetInfluences",c)}l.getUniforms().setValue(r,"morphTargetsTexture",h.texture,t),l.getUniforms().setValue(r,"morphTargetsTextureSize",h.size)}return{update:s}}function Dy(r,e,t,i){let n=new WeakMap;function s(l){let c=i.render.frame,d=l.geometry,u=e.get(l,d);if(n.get(u)!==c&&(e.update(u),n.set(u,c)),l.isInstancedMesh&&(l.hasEventListener("dispose",o)===!1&&l.addEventListener("dispose",o),n.get(l)!==c&&(t.update(l.instanceMatrix,r.ARRAY_BUFFER),l.instanceColor!==null&&t.update(l.instanceColor,r.ARRAY_BUFFER),n.set(l,c))),l.isSkinnedMesh){let h=l.skeleton;n.get(h)!==c&&(h.update(),n.set(h,c))}return u}function a(){n=new WeakMap}function o(l){let c=l.target;c.removeEventListener("dispose",o),t.remove(c.instanceMatrix),c.instanceColor!==null&&t.remove(c.instanceColor)}return{update:s,dispose:a}}var mh=new St,Jd=new us(1,1),yh=new Kr,bh=new ua,vh=new es,Zd=[],Qd=[],eh=new Float32Array(16),th=new Float32Array(9),ih=new Float32Array(4);function Rr(r,e,t){let i=r[0];if(i<=0||i>0)return r;let n=e*t,s=Zd[n];if(s===void 0&&(s=new Float32Array(n),Zd[n]=s),e!==0){i.toArray(s,0);for(let a=1,o=0;a!==e;++a)o+=t,r[a].toArray(s,o)}return s}function Tt(r,e){if(r.length!==e.length)return!1;for(let t=0,i=r.length;t<i;t++)if(r[t]!==e[t])return!1;return!0}function At(r,e){for(let t=0,i=e.length;t<i;t++)r[t]=e[t]}function Eo(r,e){let t=Qd[e];t===void 0&&(t=new Int32Array(e),Qd[e]=t);for(let i=0;i!==e;++i)t[i]=r.allocateTextureUnit();return t}function By(r,e){let t=this.cache;t[0]!==e&&(r.uniform1f(this.addr,e),t[0]=e)}function Uy(r,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(r.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Tt(t,e))return;r.uniform2fv(this.addr,e),At(t,e)}}function zy(r,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(r.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(r.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(Tt(t,e))return;r.uniform3fv(this.addr,e),At(t,e)}}function Hy(r,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(r.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Tt(t,e))return;r.uniform4fv(this.addr,e),At(t,e)}}function jy(r,e){let t=this.cache,i=e.elements;if(i===void 0){if(Tt(t,e))return;r.uniformMatrix2fv(this.addr,!1,e),At(t,e)}else{if(Tt(t,i))return;ih.set(i),r.uniformMatrix2fv(this.addr,!1,ih),At(t,i)}}function Gy(r,e){let t=this.cache,i=e.elements;if(i===void 0){if(Tt(t,e))return;r.uniformMatrix3fv(this.addr,!1,e),At(t,e)}else{if(Tt(t,i))return;th.set(i),r.uniformMatrix3fv(this.addr,!1,th),At(t,i)}}function Vy(r,e){let t=this.cache,i=e.elements;if(i===void 0){if(Tt(t,e))return;r.uniformMatrix4fv(this.addr,!1,e),At(t,e)}else{if(Tt(t,i))return;eh.set(i),r.uniformMatrix4fv(this.addr,!1,eh),At(t,i)}}function Wy(r,e){let t=this.cache;t[0]!==e&&(r.uniform1i(this.addr,e),t[0]=e)}function qy(r,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(r.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Tt(t,e))return;r.uniform2iv(this.addr,e),At(t,e)}}function $y(r,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(r.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Tt(t,e))return;r.uniform3iv(this.addr,e),At(t,e)}}function Xy(r,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(r.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Tt(t,e))return;r.uniform4iv(this.addr,e),At(t,e)}}function Ky(r,e){let t=this.cache;t[0]!==e&&(r.uniform1ui(this.addr,e),t[0]=e)}function Yy(r,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(r.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Tt(t,e))return;r.uniform2uiv(this.addr,e),At(t,e)}}function Jy(r,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(r.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Tt(t,e))return;r.uniform3uiv(this.addr,e),At(t,e)}}function Zy(r,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(r.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Tt(t,e))return;r.uniform4uiv(this.addr,e),At(t,e)}}function Qy(r,e,t){let i=this.cache,n=t.allocateTextureUnit();i[0]!==n&&(r.uniform1i(this.addr,n),i[0]=n);let s;this.type===r.SAMPLER_2D_SHADOW?(Jd.compareFunction=Nl,s=Jd):s=mh,t.setTexture2D(e||s,n)}function eb(r,e,t){let i=this.cache,n=t.allocateTextureUnit();i[0]!==n&&(r.uniform1i(this.addr,n),i[0]=n),t.setTexture3D(e||bh,n)}function tb(r,e,t){let i=this.cache,n=t.allocateTextureUnit();i[0]!==n&&(r.uniform1i(this.addr,n),i[0]=n),t.setTextureCube(e||vh,n)}function ib(r,e,t){let i=this.cache,n=t.allocateTextureUnit();i[0]!==n&&(r.uniform1i(this.addr,n),i[0]=n),t.setTexture2DArray(e||yh,n)}function nb(r){switch(r){case 5126:return By;case 35664:return Uy;case 35665:return zy;case 35666:return Hy;case 35674:return jy;case 35675:return Gy;case 35676:return Vy;case 5124:case 35670:return Wy;case 35667:case 35671:return qy;case 35668:case 35672:return $y;case 35669:case 35673:return Xy;case 5125:return Ky;case 36294:return Yy;case 36295:return Jy;case 36296:return Zy;case 35678:case 36198:case 36298:case 36306:case 35682:return Qy;case 35679:case 36299:case 36307:return eb;case 35680:case 36300:case 36308:case 36293:return tb;case 36289:case 36303:case 36311:case 36292:return ib}}function rb(r,e){r.uniform1fv(this.addr,e)}function sb(r,e){let t=Rr(e,this.size,2);r.uniform2fv(this.addr,t)}function ab(r,e){let t=Rr(e,this.size,3);r.uniform3fv(this.addr,t)}function ob(r,e){let t=Rr(e,this.size,4);r.uniform4fv(this.addr,t)}function lb(r,e){let t=Rr(e,this.size,4);r.uniformMatrix2fv(this.addr,!1,t)}function cb(r,e){let t=Rr(e,this.size,9);r.uniformMatrix3fv(this.addr,!1,t)}function ub(r,e){let t=Rr(e,this.size,16);r.uniformMatrix4fv(this.addr,!1,t)}function db(r,e){r.uniform1iv(this.addr,e)}function hb(r,e){r.uniform2iv(this.addr,e)}function fb(r,e){r.uniform3iv(this.addr,e)}function pb(r,e){r.uniform4iv(this.addr,e)}function mb(r,e){r.uniform1uiv(this.addr,e)}function yb(r,e){r.uniform2uiv(this.addr,e)}function bb(r,e){r.uniform3uiv(this.addr,e)}function vb(r,e){r.uniform4uiv(this.addr,e)}function gb(r,e,t){let i=this.cache,n=e.length,s=Eo(t,n);Tt(i,s)||(r.uniform1iv(this.addr,s),At(i,s));for(let a=0;a!==n;++a)t.setTexture2D(e[a]||mh,s[a])}function xb(r,e,t){let i=this.cache,n=e.length,s=Eo(t,n);Tt(i,s)||(r.uniform1iv(this.addr,s),At(i,s));for(let a=0;a!==n;++a)t.setTexture3D(e[a]||bh,s[a])}function wb(r,e,t){let i=this.cache,n=e.length,s=Eo(t,n);Tt(i,s)||(r.uniform1iv(this.addr,s),At(i,s));for(let a=0;a!==n;++a)t.setTextureCube(e[a]||vh,s[a])}function Mb(r,e,t){let i=this.cache,n=e.length,s=Eo(t,n);Tt(i,s)||(r.uniform1iv(this.addr,s),At(i,s));for(let a=0;a!==n;++a)t.setTexture2DArray(e[a]||yh,s[a])}function _b(r){switch(r){case 5126:return rb;case 35664:return sb;case 35665:return ab;case 35666:return ob;case 35674:return lb;case 35675:return cb;case 35676:return ub;case 5124:case 35670:return db;case 35667:case 35671:return hb;case 35668:case 35672:return fb;case 35669:case 35673:return pb;case 5125:return mb;case 36294:return yb;case 36295:return bb;case 36296:return vb;case 35678:case 36198:case 36298:case 36306:case 35682:return gb;case 35679:case 36299:case 36307:return xb;case 35680:case 36300:case 36308:case 36293:return wb;case 36289:case 36303:case 36311:case 36292:return Mb}}var Jl=class{constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.type=t.type,this.setValue=nb(t.type)}},Zl=class{constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=_b(t.type)}},Ql=class{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,i){let n=this.seq;for(let s=0,a=n.length;s!==a;++s){let o=n[s];o.setValue(e,t[o.id],i)}}},Yl=/(\w+)(\])?(\[|\.)?/g;function nh(r,e){r.seq.push(e),r.map[e.id]=e}function Sb(r,e,t){let i=r.name,n=i.length;for(Yl.lastIndex=0;;){let s=Yl.exec(i),a=Yl.lastIndex,o=s[1],l=s[2]==="]",c=s[3];if(l&&(o=o|0),c===void 0||c==="["&&a+2===n){nh(t,c===void 0?new Jl(o,r,e):new Zl(o,r,e));break}else{let u=t.map[o];u===void 0&&(u=new Ql(o),nh(t,u)),t=u}}}var Cr=class{constructor(e,t){this.seq=[],this.map={};let i=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let n=0;n<i;++n){let s=e.getActiveUniform(t,n),a=e.getUniformLocation(t,s.name);Sb(s,a,this)}}setValue(e,t,i,n){let s=this.map[t];s!==void 0&&s.setValue(e,i,n)}setOptional(e,t,i){let n=t[i];n!==void 0&&this.setValue(e,i,n)}static upload(e,t,i,n){for(let s=0,a=t.length;s!==a;++s){let o=t[s],l=i[o.id];l.needsUpdate!==!1&&o.setValue(e,l.value,n)}}static seqWithValue(e,t){let i=[];for(let n=0,s=e.length;n!==s;++n){let a=e[n];a.id in t&&i.push(a)}return i}};function rh(r,e,t){let i=r.createShader(e);return r.shaderSource(i,t),r.compileShader(i),i}var Tb=37297,Ab=0;function kb(r,e){let t=r.split(`
`),i=[],n=Math.max(e-6,0),s=Math.min(e+6,t.length);for(let a=n;a<s;a++){let o=a+1;i.push(`${o===e?">":" "} ${o}: ${t[a]}`)}return i.join(`
`)}var sh=new Fe;function Eb(r){Ve._getMatrix(sh,Ve.workingColorSpace,r);let e=`mat3( ${sh.elements.map(t=>t.toFixed(4))} )`;switch(Ve.getTransfer(r)){case $r:return[e,"LinearTransferOETF"];case Qe:return[e,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",r),[e,"LinearTransferOETF"]}}function ah(r,e,t){let i=r.getShaderParameter(e,r.COMPILE_STATUS),s=(r.getShaderInfoLog(e)||"").trim();if(i&&s==="")return"";let a=/ERROR: 0:(\d+)/.exec(s);if(a){let o=parseInt(a[1]);return t.toUpperCase()+`

`+s+`

`+kb(r.getShaderSource(e),o)}else return s}function Cb(r,e){let t=Eb(e);return[`vec4 ${r}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}function Rb(r,e){let t;switch(e){case xd:t="Linear";break;case wd:t="Reinhard";break;case Md:t="Cineon";break;case Oa:t="ACESFilmic";break;case Sd:t="AgX";break;case Td:t="Neutral";break;case _d:t="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",e),t="Linear"}return"vec3 "+r+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}var To=new L;function Ib(){Ve.getLuminanceCoefficients(To);let r=To.x.toFixed(4),e=To.y.toFixed(4),t=To.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${r}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function Pb(r){return[r.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",r.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Rs).join(`
`)}function Ob(r){let e=[];for(let t in r){let i=r[t];i!==!1&&e.push("#define "+t+" "+i)}return e.join(`
`)}function Lb(r,e){let t={},i=r.getProgramParameter(e,r.ACTIVE_ATTRIBUTES);for(let n=0;n<i;n++){let s=r.getActiveAttrib(e,n),a=s.name,o=1;s.type===r.FLOAT_MAT2&&(o=2),s.type===r.FLOAT_MAT3&&(o=3),s.type===r.FLOAT_MAT4&&(o=4),t[a]={type:s.type,location:r.getAttribLocation(e,a),locationSize:o}}return t}function Rs(r){return r!==""}function oh(r,e){let t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return r.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function lh(r,e){return r.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}var Nb=/^[ \t]*#include +<([\w\d./]+)>/gm;function ec(r){return r.replace(Nb,Db)}var Fb=new Map;function Db(r,e){let t=ze[e];if(t===void 0){let i=Fb.get(e);if(i!==void 0)t=ze[i],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,i);else throw new Error("Can not resolve #include <"+e+">")}return ec(t)}var Bb=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function ch(r){return r.replace(Bb,Ub)}function Ub(r,e,t,i){let n="";for(let s=parseInt(e);s<parseInt(t);s++)n+=i.replace(/\[\s*i\s*\]/g,"[ "+s+" ]").replace(/UNROLLED_LOOP_INDEX/g,s);return n}function uh(r){let e=`precision ${r.precision} float;
	precision ${r.precision} int;
	precision ${r.precision} sampler2D;
	precision ${r.precision} samplerCube;
	precision ${r.precision} sampler3D;
	precision ${r.precision} sampler2DArray;
	precision ${r.precision} sampler2DShadow;
	precision ${r.precision} samplerCubeShadow;
	precision ${r.precision} sampler2DArrayShadow;
	precision ${r.precision} isampler2D;
	precision ${r.precision} isampler3D;
	precision ${r.precision} isamplerCube;
	precision ${r.precision} isampler2DArray;
	precision ${r.precision} usampler2D;
	precision ${r.precision} usampler3D;
	precision ${r.precision} usamplerCube;
	precision ${r.precision} usampler2DArray;
	`;return r.precision==="highp"?e+=`
#define HIGH_PRECISION`:r.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:r.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}function zb(r){let e="SHADOWMAP_TYPE_BASIC";return r.shadowMapType===Ml?e="SHADOWMAP_TYPE_PCF":r.shadowMapType===Qu?e="SHADOWMAP_TYPE_PCF_SOFT":r.shadowMapType===Pi&&(e="SHADOWMAP_TYPE_VSM"),e}function Hb(r){let e="ENVMAP_TYPE_CUBE";if(r.envMap)switch(r.envMapMode){case On:case Ln:e="ENVMAP_TYPE_CUBE";break;case Ss:e="ENVMAP_TYPE_CUBE_UV";break}return e}function jb(r){let e="ENVMAP_MODE_REFLECTION";if(r.envMap)switch(r.envMapMode){case Ln:e="ENVMAP_MODE_REFRACTION";break}return e}function Gb(r){let e="ENVMAP_BLENDING_NONE";if(r.envMap)switch(r.combine){case Pa:e="ENVMAP_BLENDING_MULTIPLY";break;case vd:e="ENVMAP_BLENDING_MIX";break;case gd:e="ENVMAP_BLENDING_ADD";break}return e}function Vb(r){let e=r.envMapCubeUVHeight;if(e===null)return null;let t=Math.log2(e)-2,i=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),112)),texelHeight:i,maxMip:t}}function Wb(r,e,t,i){let n=r.getContext(),s=t.defines,a=t.vertexShader,o=t.fragmentShader,l=zb(t),c=Hb(t),d=jb(t),u=Gb(t),h=Vb(t),m=Pb(t),y=Ob(s),b=n.createProgram(),p,f,x=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(p=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,y].filter(Rs).join(`
`),p.length>0&&(p+=`
`),f=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,y].filter(Rs).join(`
`),f.length>0&&(f+=`
`)):(p=[uh(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,y,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+d:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Rs).join(`
`),f=[uh(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,y,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+c:"",t.envMap?"#define "+d:"",t.envMap?"#define "+u:"",h?"#define CUBEUV_TEXEL_WIDTH "+h.texelWidth:"",h?"#define CUBEUV_TEXEL_HEIGHT "+h.texelHeight:"",h?"#define CUBEUV_MAX_MIP "+h.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor||t.batchingColor?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==Ki?"#define TONE_MAPPING":"",t.toneMapping!==Ki?ze.tonemapping_pars_fragment:"",t.toneMapping!==Ki?Rb("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",ze.colorspace_pars_fragment,Cb("linearToOutputTexel",t.outputColorSpace),Ib(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(Rs).join(`
`)),a=ec(a),a=oh(a,t),a=lh(a,t),o=ec(o),o=oh(o,t),o=lh(o,t),a=ch(a),o=ch(o),t.isRawShaderMaterial!==!0&&(x=`#version 300 es
`,p=[m,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+p,f=["#define varying in",t.glslVersion===Dl?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===Dl?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+f);let g=x+p+a,v=x+f+o,T=rh(n,n.VERTEX_SHADER,g),A=rh(n,n.FRAGMENT_SHADER,v);n.attachShader(b,T),n.attachShader(b,A),t.index0AttributeName!==void 0?n.bindAttribLocation(b,0,t.index0AttributeName):t.morphTargets===!0&&n.bindAttribLocation(b,0,"position"),n.linkProgram(b);function E(R){if(r.debug.checkShaderErrors){let F=n.getProgramInfoLog(b)||"",j=n.getShaderInfoLog(T)||"",W=n.getShaderInfoLog(A)||"",K=F.trim(),C=j.trim(),U=W.trim(),O=!0,z=!0;if(n.getProgramParameter(b,n.LINK_STATUS)===!1)if(O=!1,typeof r.debug.onShaderError=="function")r.debug.onShaderError(n,b,T,A);else{let Y=ah(n,T,"vertex"),re=ah(n,A,"fragment");console.error("THREE.WebGLProgram: Shader Error "+n.getError()+" - VALIDATE_STATUS "+n.getProgramParameter(b,n.VALIDATE_STATUS)+`

Material Name: `+R.name+`
Material Type: `+R.type+`

Program Info Log: `+K+`
`+Y+`
`+re)}else K!==""?console.warn("THREE.WebGLProgram: Program Info Log:",K):(C===""||U==="")&&(z=!1);z&&(R.diagnostics={runnable:O,programLog:K,vertexShader:{log:C,prefix:p},fragmentShader:{log:U,prefix:f}})}n.deleteShader(T),n.deleteShader(A),P=new Cr(n,b),_=Lb(n,b)}let P;this.getUniforms=function(){return P===void 0&&E(this),P};let _;this.getAttributes=function(){return _===void 0&&E(this),_};let M=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return M===!1&&(M=n.getProgramParameter(b,Tb)),M},this.destroy=function(){i.releaseStatesOfProgram(this),n.deleteProgram(b),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=Ab++,this.cacheKey=e,this.usedTimes=1,this.program=b,this.vertexShader=T,this.fragmentShader=A,this}var qb=0,tc=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){let t=e.vertexShader,i=e.fragmentShader,n=this._getShaderStage(t),s=this._getShaderStage(i),a=this._getShaderCacheForMaterial(e);return a.has(n)===!1&&(a.add(n),n.usedTimes++),a.has(s)===!1&&(a.add(s),s.usedTimes++),this}remove(e){let t=this.materialCache.get(e);for(let i of t)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){let t=this.materialCache,i=t.get(e);return i===void 0&&(i=new Set,t.set(e,i)),i}_getShaderStage(e){let t=this.shaderCache,i=t.get(e);return i===void 0&&(i=new ic(e),t.set(e,i)),i}},ic=class{constructor(e){this.id=qb++,this.code=e,this.usedTimes=0}};function $b(r,e,t,i,n,s,a){let o=new Yr,l=new tc,c=new Set,d=[],u=n.logarithmicDepthBuffer,h=n.vertexTextures,m=n.precision,y={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function b(_){return c.add(_),_===0?"uv":`uv${_}`}function p(_,M,R,F,j){let W=F.fog,K=j.geometry,C=_.isMeshStandardMaterial?F.environment:null,U=(_.isMeshStandardMaterial?t:e).get(_.envMap||C),O=U&&U.mapping===Ss?U.image.height:null,z=y[_.type];_.precision!==null&&(m=n.getMaxPrecision(_.precision),m!==_.precision&&console.warn("THREE.WebGLProgram.getParameters:",_.precision,"not supported, using",m,"instead."));let Y=K.morphAttributes.position||K.morphAttributes.normal||K.morphAttributes.color,re=Y!==void 0?Y.length:0,Te=0;K.morphAttributes.position!==void 0&&(Te=1),K.morphAttributes.normal!==void 0&&(Te=2),K.morphAttributes.color!==void 0&&(Te=3);let qe,Le,Xe,$;if(z){let Je=Oi[z];qe=Je.vertexShader,Le=Je.fragmentShader}else qe=_.vertexShader,Le=_.fragmentShader,l.update(_),Xe=l.getVertexShaderID(_),$=l.getFragmentShaderID(_);let Z=r.getRenderTarget(),he=r.state.buffers.depth.getReversed(),Ie=j.isInstancedMesh===!0,_e=j.isBatchedMesh===!0,$e=!!_.map,Ot=!!_.matcap,I=!!U,ct=!!_.aoMap,Ne=!!_.lightMap,Ce=!!_.bumpMap,ye=!!_.normalMap,ut=!!_.displacementMap,be=!!_.emissiveMap,Ue=!!_.metalnessMap,kt=!!_.roughnessMap,yt=_.anisotropy>0,k=_.clearcoat>0,w=_.dispersion>0,H=_.iridescence>0,X=_.sheen>0,Q=_.transmission>0,q=yt&&!!_.anisotropyMap,we=k&&!!_.clearcoatMap,se=k&&!!_.clearcoatNormalMap,ve=k&&!!_.clearcoatRoughnessMap,ge=H&&!!_.iridescenceMap,ie=H&&!!_.iridescenceThicknessMap,ue=X&&!!_.sheenColorMap,Ee=X&&!!_.sheenRoughnessMap,xe=!!_.specularMap,le=!!_.specularColorMap,De=!!_.specularIntensityMap,N=Q&&!!_.transmissionMap,ne=Q&&!!_.thicknessMap,ae=!!_.gradientMap,fe=!!_.alphaMap,ee=_.alphaTest>0,J=!!_.alphaHash,me=!!_.extensions,Pe=Ki;_.toneMapped&&(Z===null||Z.isXRRenderTarget===!0)&&(Pe=r.toneMapping);let at={shaderID:z,shaderType:_.type,shaderName:_.name,vertexShader:qe,fragmentShader:Le,defines:_.defines,customVertexShaderID:Xe,customFragmentShaderID:$,isRawShaderMaterial:_.isRawShaderMaterial===!0,glslVersion:_.glslVersion,precision:m,batching:_e,batchingColor:_e&&j._colorsTexture!==null,instancing:Ie,instancingColor:Ie&&j.instanceColor!==null,instancingMorph:Ie&&j.morphTexture!==null,supportsVertexTextures:h,outputColorSpace:Z===null?r.outputColorSpace:Z.isXRRenderTarget===!0?Z.texture.colorSpace:_t,alphaToCoverage:!!_.alphaToCoverage,map:$e,matcap:Ot,envMap:I,envMapMode:I&&U.mapping,envMapCubeUVHeight:O,aoMap:ct,lightMap:Ne,bumpMap:Ce,normalMap:ye,displacementMap:h&&ut,emissiveMap:be,normalMapObjectSpace:ye&&_.normalMapType===Id,normalMapTangentSpace:ye&&_.normalMapType===Mo,metalnessMap:Ue,roughnessMap:kt,anisotropy:yt,anisotropyMap:q,clearcoat:k,clearcoatMap:we,clearcoatNormalMap:se,clearcoatRoughnessMap:ve,dispersion:w,iridescence:H,iridescenceMap:ge,iridescenceThicknessMap:ie,sheen:X,sheenColorMap:ue,sheenRoughnessMap:Ee,specularMap:xe,specularColorMap:le,specularIntensityMap:De,transmission:Q,transmissionMap:N,thicknessMap:ne,gradientMap:ae,opaque:_.transparent===!1&&_.blending===wn&&_.alphaToCoverage===!1,alphaMap:fe,alphaTest:ee,alphaHash:J,combine:_.combine,mapUv:$e&&b(_.map.channel),aoMapUv:ct&&b(_.aoMap.channel),lightMapUv:Ne&&b(_.lightMap.channel),bumpMapUv:Ce&&b(_.bumpMap.channel),normalMapUv:ye&&b(_.normalMap.channel),displacementMapUv:ut&&b(_.displacementMap.channel),emissiveMapUv:be&&b(_.emissiveMap.channel),metalnessMapUv:Ue&&b(_.metalnessMap.channel),roughnessMapUv:kt&&b(_.roughnessMap.channel),anisotropyMapUv:q&&b(_.anisotropyMap.channel),clearcoatMapUv:we&&b(_.clearcoatMap.channel),clearcoatNormalMapUv:se&&b(_.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:ve&&b(_.clearcoatRoughnessMap.channel),iridescenceMapUv:ge&&b(_.iridescenceMap.channel),iridescenceThicknessMapUv:ie&&b(_.iridescenceThicknessMap.channel),sheenColorMapUv:ue&&b(_.sheenColorMap.channel),sheenRoughnessMapUv:Ee&&b(_.sheenRoughnessMap.channel),specularMapUv:xe&&b(_.specularMap.channel),specularColorMapUv:le&&b(_.specularColorMap.channel),specularIntensityMapUv:De&&b(_.specularIntensityMap.channel),transmissionMapUv:N&&b(_.transmissionMap.channel),thicknessMapUv:ne&&b(_.thicknessMap.channel),alphaMapUv:fe&&b(_.alphaMap.channel),vertexTangents:!!K.attributes.tangent&&(ye||yt),vertexColors:_.vertexColors,vertexAlphas:_.vertexColors===!0&&!!K.attributes.color&&K.attributes.color.itemSize===4,pointsUvs:j.isPoints===!0&&!!K.attributes.uv&&($e||fe),fog:!!W,useFog:_.fog===!0,fogExp2:!!W&&W.isFogExp2,flatShading:_.flatShading===!0&&_.wireframe===!1,sizeAttenuation:_.sizeAttenuation===!0,logarithmicDepthBuffer:u,reversedDepthBuffer:he,skinning:j.isSkinnedMesh===!0,morphTargets:K.morphAttributes.position!==void 0,morphNormals:K.morphAttributes.normal!==void 0,morphColors:K.morphAttributes.color!==void 0,morphTargetsCount:re,morphTextureStride:Te,numDirLights:M.directional.length,numPointLights:M.point.length,numSpotLights:M.spot.length,numSpotLightMaps:M.spotLightMap.length,numRectAreaLights:M.rectArea.length,numHemiLights:M.hemi.length,numDirLightShadows:M.directionalShadowMap.length,numPointLightShadows:M.pointShadowMap.length,numSpotLightShadows:M.spotShadowMap.length,numSpotLightShadowsWithMaps:M.numSpotLightShadowsWithMaps,numLightProbes:M.numLightProbes,numClippingPlanes:a.numPlanes,numClipIntersection:a.numIntersection,dithering:_.dithering,shadowMapEnabled:r.shadowMap.enabled&&R.length>0,shadowMapType:r.shadowMap.type,toneMapping:Pe,decodeVideoTexture:$e&&_.map.isVideoTexture===!0&&Ve.getTransfer(_.map.colorSpace)===Qe,decodeVideoTextureEmissive:be&&_.emissiveMap.isVideoTexture===!0&&Ve.getTransfer(_.emissiveMap.colorSpace)===Qe,premultipliedAlpha:_.premultipliedAlpha,doubleSided:_.side===bt,flipSided:_.side===Vt,useDepthPacking:_.depthPacking>=0,depthPacking:_.depthPacking||0,index0AttributeName:_.index0AttributeName,extensionClipCullDistance:me&&_.extensions.clipCullDistance===!0&&i.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(me&&_.extensions.multiDraw===!0||_e)&&i.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:i.has("KHR_parallel_shader_compile"),customProgramCacheKey:_.customProgramCacheKey()};return at.vertexUv1s=c.has(1),at.vertexUv2s=c.has(2),at.vertexUv3s=c.has(3),c.clear(),at}function f(_){let M=[];if(_.shaderID?M.push(_.shaderID):(M.push(_.customVertexShaderID),M.push(_.customFragmentShaderID)),_.defines!==void 0)for(let R in _.defines)M.push(R),M.push(_.defines[R]);return _.isRawShaderMaterial===!1&&(x(M,_),g(M,_),M.push(r.outputColorSpace)),M.push(_.customProgramCacheKey),M.join()}function x(_,M){_.push(M.precision),_.push(M.outputColorSpace),_.push(M.envMapMode),_.push(M.envMapCubeUVHeight),_.push(M.mapUv),_.push(M.alphaMapUv),_.push(M.lightMapUv),_.push(M.aoMapUv),_.push(M.bumpMapUv),_.push(M.normalMapUv),_.push(M.displacementMapUv),_.push(M.emissiveMapUv),_.push(M.metalnessMapUv),_.push(M.roughnessMapUv),_.push(M.anisotropyMapUv),_.push(M.clearcoatMapUv),_.push(M.clearcoatNormalMapUv),_.push(M.clearcoatRoughnessMapUv),_.push(M.iridescenceMapUv),_.push(M.iridescenceThicknessMapUv),_.push(M.sheenColorMapUv),_.push(M.sheenRoughnessMapUv),_.push(M.specularMapUv),_.push(M.specularColorMapUv),_.push(M.specularIntensityMapUv),_.push(M.transmissionMapUv),_.push(M.thicknessMapUv),_.push(M.combine),_.push(M.fogExp2),_.push(M.sizeAttenuation),_.push(M.morphTargetsCount),_.push(M.morphAttributeCount),_.push(M.numDirLights),_.push(M.numPointLights),_.push(M.numSpotLights),_.push(M.numSpotLightMaps),_.push(M.numHemiLights),_.push(M.numRectAreaLights),_.push(M.numDirLightShadows),_.push(M.numPointLightShadows),_.push(M.numSpotLightShadows),_.push(M.numSpotLightShadowsWithMaps),_.push(M.numLightProbes),_.push(M.shadowMapType),_.push(M.toneMapping),_.push(M.numClippingPlanes),_.push(M.numClipIntersection),_.push(M.depthPacking)}function g(_,M){o.disableAll(),M.supportsVertexTextures&&o.enable(0),M.instancing&&o.enable(1),M.instancingColor&&o.enable(2),M.instancingMorph&&o.enable(3),M.matcap&&o.enable(4),M.envMap&&o.enable(5),M.normalMapObjectSpace&&o.enable(6),M.normalMapTangentSpace&&o.enable(7),M.clearcoat&&o.enable(8),M.iridescence&&o.enable(9),M.alphaTest&&o.enable(10),M.vertexColors&&o.enable(11),M.vertexAlphas&&o.enable(12),M.vertexUv1s&&o.enable(13),M.vertexUv2s&&o.enable(14),M.vertexUv3s&&o.enable(15),M.vertexTangents&&o.enable(16),M.anisotropy&&o.enable(17),M.alphaHash&&o.enable(18),M.batching&&o.enable(19),M.dispersion&&o.enable(20),M.batchingColor&&o.enable(21),M.gradientMap&&o.enable(22),_.push(o.mask),o.disableAll(),M.fog&&o.enable(0),M.useFog&&o.enable(1),M.flatShading&&o.enable(2),M.logarithmicDepthBuffer&&o.enable(3),M.reversedDepthBuffer&&o.enable(4),M.skinning&&o.enable(5),M.morphTargets&&o.enable(6),M.morphNormals&&o.enable(7),M.morphColors&&o.enable(8),M.premultipliedAlpha&&o.enable(9),M.shadowMapEnabled&&o.enable(10),M.doubleSided&&o.enable(11),M.flipSided&&o.enable(12),M.useDepthPacking&&o.enable(13),M.dithering&&o.enable(14),M.transmission&&o.enable(15),M.sheen&&o.enable(16),M.opaque&&o.enable(17),M.pointsUvs&&o.enable(18),M.decodeVideoTexture&&o.enable(19),M.decodeVideoTextureEmissive&&o.enable(20),M.alphaToCoverage&&o.enable(21),_.push(o.mask)}function v(_){let M=y[_.type],R;if(M){let F=Oi[M];R=jd.clone(F.uniforms)}else R=_.uniforms;return R}function T(_,M){let R;for(let F=0,j=d.length;F<j;F++){let W=d[F];if(W.cacheKey===M){R=W,++R.usedTimes;break}}return R===void 0&&(R=new Wb(r,M,_,s),d.push(R)),R}function A(_){if(--_.usedTimes===0){let M=d.indexOf(_);d[M]=d[d.length-1],d.pop(),_.destroy()}}function E(_){l.remove(_)}function P(){l.dispose()}return{getParameters:p,getProgramCacheKey:f,getUniforms:v,acquireProgram:T,releaseProgram:A,releaseShaderCache:E,programs:d,dispose:P}}function Xb(){let r=new WeakMap;function e(a){return r.has(a)}function t(a){let o=r.get(a);return o===void 0&&(o={},r.set(a,o)),o}function i(a){r.delete(a)}function n(a,o,l){r.get(a)[o]=l}function s(){r=new WeakMap}return{has:e,get:t,remove:i,update:n,dispose:s}}function Kb(r,e){return r.groupOrder!==e.groupOrder?r.groupOrder-e.groupOrder:r.renderOrder!==e.renderOrder?r.renderOrder-e.renderOrder:r.material.id!==e.material.id?r.material.id-e.material.id:r.z!==e.z?r.z-e.z:r.id-e.id}function dh(r,e){return r.groupOrder!==e.groupOrder?r.groupOrder-e.groupOrder:r.renderOrder!==e.renderOrder?r.renderOrder-e.renderOrder:r.z!==e.z?e.z-r.z:r.id-e.id}function hh(){let r=[],e=0,t=[],i=[],n=[];function s(){e=0,t.length=0,i.length=0,n.length=0}function a(u,h,m,y,b,p){let f=r[e];return f===void 0?(f={id:u.id,object:u,geometry:h,material:m,groupOrder:y,renderOrder:u.renderOrder,z:b,group:p},r[e]=f):(f.id=u.id,f.object=u,f.geometry=h,f.material=m,f.groupOrder=y,f.renderOrder=u.renderOrder,f.z=b,f.group=p),e++,f}function o(u,h,m,y,b,p){let f=a(u,h,m,y,b,p);m.transmission>0?i.push(f):m.transparent===!0?n.push(f):t.push(f)}function l(u,h,m,y,b,p){let f=a(u,h,m,y,b,p);m.transmission>0?i.unshift(f):m.transparent===!0?n.unshift(f):t.unshift(f)}function c(u,h){t.length>1&&t.sort(u||Kb),i.length>1&&i.sort(h||dh),n.length>1&&n.sort(h||dh)}function d(){for(let u=e,h=r.length;u<h;u++){let m=r[u];if(m.id===null)break;m.id=null,m.object=null,m.geometry=null,m.material=null,m.group=null}}return{opaque:t,transmissive:i,transparent:n,init:s,push:o,unshift:l,finish:d,sort:c}}function Yb(){let r=new WeakMap;function e(i,n){let s=r.get(i),a;return s===void 0?(a=new hh,r.set(i,[a])):n>=s.length?(a=new hh,s.push(a)):a=s[n],a}function t(){r=new WeakMap}return{get:e,dispose:t}}function Jb(){let r={};return{get:function(e){if(r[e.id]!==void 0)return r[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new L,color:new Me};break;case"SpotLight":t={position:new L,direction:new L,color:new Me,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new L,color:new Me,distance:0,decay:0};break;case"HemisphereLight":t={direction:new L,skyColor:new Me,groundColor:new Me};break;case"RectAreaLight":t={color:new Me,position:new L,halfWidth:new L,halfHeight:new L};break}return r[e.id]=t,t}}}function Zb(){let r={};return{get:function(e){if(r[e.id]!==void 0)return r[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Oe};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Oe};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Oe,shadowCameraNear:1,shadowCameraFar:1e3};break}return r[e.id]=t,t}}}var Qb=0;function ev(r,e){return(e.castShadow?2:0)-(r.castShadow?2:0)+(e.map?1:0)-(r.map?1:0)}function tv(r){let e=new Jb,t=Zb(),i={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)i.probe.push(new L);let n=new L,s=new Be,a=new Be;function o(c){let d=0,u=0,h=0;for(let _=0;_<9;_++)i.probe[_].set(0,0,0);let m=0,y=0,b=0,p=0,f=0,x=0,g=0,v=0,T=0,A=0,E=0;c.sort(ev);for(let _=0,M=c.length;_<M;_++){let R=c[_],F=R.color,j=R.intensity,W=R.distance,K=R.shadow&&R.shadow.map?R.shadow.map.texture:null;if(R.isAmbientLight)d+=F.r*j,u+=F.g*j,h+=F.b*j;else if(R.isLightProbe){for(let C=0;C<9;C++)i.probe[C].addScaledVector(R.sh.coefficients[C],j);E++}else if(R.isDirectionalLight){let C=e.get(R);if(C.color.copy(R.color).multiplyScalar(R.intensity),R.castShadow){let U=R.shadow,O=t.get(R);O.shadowIntensity=U.intensity,O.shadowBias=U.bias,O.shadowNormalBias=U.normalBias,O.shadowRadius=U.radius,O.shadowMapSize=U.mapSize,i.directionalShadow[m]=O,i.directionalShadowMap[m]=K,i.directionalShadowMatrix[m]=R.shadow.matrix,x++}i.directional[m]=C,m++}else if(R.isSpotLight){let C=e.get(R);C.position.setFromMatrixPosition(R.matrixWorld),C.color.copy(F).multiplyScalar(j),C.distance=W,C.coneCos=Math.cos(R.angle),C.penumbraCos=Math.cos(R.angle*(1-R.penumbra)),C.decay=R.decay,i.spot[b]=C;let U=R.shadow;if(R.map&&(i.spotLightMap[T]=R.map,T++,U.updateMatrices(R),R.castShadow&&A++),i.spotLightMatrix[b]=U.matrix,R.castShadow){let O=t.get(R);O.shadowIntensity=U.intensity,O.shadowBias=U.bias,O.shadowNormalBias=U.normalBias,O.shadowRadius=U.radius,O.shadowMapSize=U.mapSize,i.spotShadow[b]=O,i.spotShadowMap[b]=K,v++}b++}else if(R.isRectAreaLight){let C=e.get(R);C.color.copy(F).multiplyScalar(j),C.halfWidth.set(R.width*.5,0,0),C.halfHeight.set(0,R.height*.5,0),i.rectArea[p]=C,p++}else if(R.isPointLight){let C=e.get(R);if(C.color.copy(R.color).multiplyScalar(R.intensity),C.distance=R.distance,C.decay=R.decay,R.castShadow){let U=R.shadow,O=t.get(R);O.shadowIntensity=U.intensity,O.shadowBias=U.bias,O.shadowNormalBias=U.normalBias,O.shadowRadius=U.radius,O.shadowMapSize=U.mapSize,O.shadowCameraNear=U.camera.near,O.shadowCameraFar=U.camera.far,i.pointShadow[y]=O,i.pointShadowMap[y]=K,i.pointShadowMatrix[y]=R.shadow.matrix,g++}i.point[y]=C,y++}else if(R.isHemisphereLight){let C=e.get(R);C.skyColor.copy(R.color).multiplyScalar(j),C.groundColor.copy(R.groundColor).multiplyScalar(j),i.hemi[f]=C,f++}}p>0&&(r.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=oe.LTC_FLOAT_1,i.rectAreaLTC2=oe.LTC_FLOAT_2):(i.rectAreaLTC1=oe.LTC_HALF_1,i.rectAreaLTC2=oe.LTC_HALF_2)),i.ambient[0]=d,i.ambient[1]=u,i.ambient[2]=h;let P=i.hash;(P.directionalLength!==m||P.pointLength!==y||P.spotLength!==b||P.rectAreaLength!==p||P.hemiLength!==f||P.numDirectionalShadows!==x||P.numPointShadows!==g||P.numSpotShadows!==v||P.numSpotMaps!==T||P.numLightProbes!==E)&&(i.directional.length=m,i.spot.length=b,i.rectArea.length=p,i.point.length=y,i.hemi.length=f,i.directionalShadow.length=x,i.directionalShadowMap.length=x,i.pointShadow.length=g,i.pointShadowMap.length=g,i.spotShadow.length=v,i.spotShadowMap.length=v,i.directionalShadowMatrix.length=x,i.pointShadowMatrix.length=g,i.spotLightMatrix.length=v+T-A,i.spotLightMap.length=T,i.numSpotLightShadowsWithMaps=A,i.numLightProbes=E,P.directionalLength=m,P.pointLength=y,P.spotLength=b,P.rectAreaLength=p,P.hemiLength=f,P.numDirectionalShadows=x,P.numPointShadows=g,P.numSpotShadows=v,P.numSpotMaps=T,P.numLightProbes=E,i.version=Qb++)}function l(c,d){let u=0,h=0,m=0,y=0,b=0,p=d.matrixWorldInverse;for(let f=0,x=c.length;f<x;f++){let g=c[f];if(g.isDirectionalLight){let v=i.directional[u];v.direction.setFromMatrixPosition(g.matrixWorld),n.setFromMatrixPosition(g.target.matrixWorld),v.direction.sub(n),v.direction.transformDirection(p),u++}else if(g.isSpotLight){let v=i.spot[m];v.position.setFromMatrixPosition(g.matrixWorld),v.position.applyMatrix4(p),v.direction.setFromMatrixPosition(g.matrixWorld),n.setFromMatrixPosition(g.target.matrixWorld),v.direction.sub(n),v.direction.transformDirection(p),m++}else if(g.isRectAreaLight){let v=i.rectArea[y];v.position.setFromMatrixPosition(g.matrixWorld),v.position.applyMatrix4(p),a.identity(),s.copy(g.matrixWorld),s.premultiply(p),a.extractRotation(s),v.halfWidth.set(g.width*.5,0,0),v.halfHeight.set(0,g.height*.5,0),v.halfWidth.applyMatrix4(a),v.halfHeight.applyMatrix4(a),y++}else if(g.isPointLight){let v=i.point[h];v.position.setFromMatrixPosition(g.matrixWorld),v.position.applyMatrix4(p),h++}else if(g.isHemisphereLight){let v=i.hemi[b];v.direction.setFromMatrixPosition(g.matrixWorld),v.direction.transformDirection(p),b++}}}return{setup:o,setupView:l,state:i}}function fh(r){let e=new tv(r),t=[],i=[];function n(d){c.camera=d,t.length=0,i.length=0}function s(d){t.push(d)}function a(d){i.push(d)}function o(){e.setup(t)}function l(d){e.setupView(t,d)}let c={lightsArray:t,shadowsArray:i,camera:null,lights:e,transmissionRenderTarget:{}};return{init:n,state:c,setupLights:o,setupLightsView:l,pushLight:s,pushShadow:a}}function iv(r){let e=new WeakMap;function t(n,s=0){let a=e.get(n),o;return a===void 0?(o=new fh(r),e.set(n,[o])):s>=a.length?(o=new fh(r),a.push(o)):o=a[s],o}function i(){e=new WeakMap}return{get:t,dispose:i}}var nv=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,rv=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
#include <packing>
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = unpackRGBATo2Half( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ) );
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = unpackRGBAToDepth( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ) );
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( squared_mean - mean * mean );
	gl_FragColor = pack2HalfToRGBA( vec2( mean, std_dev ) );
}`;function sv(r,e,t){let i=new yr,n=new Oe,s=new Oe,a=new Ye,o=new ma({depthPacking:Rd}),l=new ya,c={},d=t.maxTextureSize,u={[fi]:Vt,[Vt]:fi,[bt]:bt},h=new pi({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Oe},radius:{value:4}},vertexShader:nv,fragmentShader:rv}),m=h.clone();m.defines.HORIZONTAL_PASS=1;let y=new Ct;y.setAttribute("position",new wt(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let b=new We(y,h),p=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Ml;let f=this.type;this.render=function(A,E,P){if(p.enabled===!1||p.autoUpdate===!1&&p.needsUpdate===!1||A.length===0)return;let _=r.getRenderTarget(),M=r.getActiveCubeFace(),R=r.getActiveMipmapLevel(),F=r.state;F.setBlending(Xi),F.buffers.depth.getReversed()===!0?F.buffers.color.setClear(0,0,0,0):F.buffers.color.setClear(1,1,1,1),F.buffers.depth.setTest(!0),F.setScissorTest(!1);let j=f!==Pi&&this.type===Pi,W=f===Pi&&this.type!==Pi;for(let K=0,C=A.length;K<C;K++){let U=A[K],O=U.shadow;if(O===void 0){console.warn("THREE.WebGLShadowMap:",U,"has no shadow.");continue}if(O.autoUpdate===!1&&O.needsUpdate===!1)continue;n.copy(O.mapSize);let z=O.getFrameExtents();if(n.multiply(z),s.copy(O.mapSize),(n.x>d||n.y>d)&&(n.x>d&&(s.x=Math.floor(d/z.x),n.x=s.x*z.x,O.mapSize.x=s.x),n.y>d&&(s.y=Math.floor(d/z.y),n.y=s.y*z.y,O.mapSize.y=s.y)),O.map===null||j===!0||W===!0){let re=this.type!==Pi?{minFilter:It,magFilter:It}:{};O.map!==null&&O.map.dispose(),O.map=new Si(n.x,n.y,re),O.map.texture.name=U.name+".shadowMap",O.camera.updateProjectionMatrix()}r.setRenderTarget(O.map),r.clear();let Y=O.getViewportCount();for(let re=0;re<Y;re++){let Te=O.getViewport(re);a.set(s.x*Te.x,s.y*Te.y,s.x*Te.z,s.y*Te.w),F.viewport(a),O.updateMatrices(U,re),i=O.getFrustum(),v(E,P,O.camera,U,this.type)}O.isPointLightShadow!==!0&&this.type===Pi&&x(O,P),O.needsUpdate=!1}f=this.type,p.needsUpdate=!1,r.setRenderTarget(_,M,R)};function x(A,E){let P=e.update(b);h.defines.VSM_SAMPLES!==A.blurSamples&&(h.defines.VSM_SAMPLES=A.blurSamples,m.defines.VSM_SAMPLES=A.blurSamples,h.needsUpdate=!0,m.needsUpdate=!0),A.mapPass===null&&(A.mapPass=new Si(n.x,n.y)),h.uniforms.shadow_pass.value=A.map.texture,h.uniforms.resolution.value=A.mapSize,h.uniforms.radius.value=A.radius,r.setRenderTarget(A.mapPass),r.clear(),r.renderBufferDirect(E,null,P,h,b,null),m.uniforms.shadow_pass.value=A.mapPass.texture,m.uniforms.resolution.value=A.mapSize,m.uniforms.radius.value=A.radius,r.setRenderTarget(A.map),r.clear(),r.renderBufferDirect(E,null,P,m,b,null)}function g(A,E,P,_){let M=null,R=P.isPointLight===!0?A.customDistanceMaterial:A.customDepthMaterial;if(R!==void 0)M=R;else if(M=P.isPointLight===!0?l:o,r.localClippingEnabled&&E.clipShadows===!0&&Array.isArray(E.clippingPlanes)&&E.clippingPlanes.length!==0||E.displacementMap&&E.displacementScale!==0||E.alphaMap&&E.alphaTest>0||E.map&&E.alphaTest>0||E.alphaToCoverage===!0){let F=M.uuid,j=E.uuid,W=c[F];W===void 0&&(W={},c[F]=W);let K=W[j];K===void 0&&(K=M.clone(),W[j]=K,E.addEventListener("dispose",T)),M=K}if(M.visible=E.visible,M.wireframe=E.wireframe,_===Pi?M.side=E.shadowSide!==null?E.shadowSide:E.side:M.side=E.shadowSide!==null?E.shadowSide:u[E.side],M.alphaMap=E.alphaMap,M.alphaTest=E.alphaToCoverage===!0?.5:E.alphaTest,M.map=E.map,M.clipShadows=E.clipShadows,M.clippingPlanes=E.clippingPlanes,M.clipIntersection=E.clipIntersection,M.displacementMap=E.displacementMap,M.displacementScale=E.displacementScale,M.displacementBias=E.displacementBias,M.wireframeLinewidth=E.wireframeLinewidth,M.linewidth=E.linewidth,P.isPointLight===!0&&M.isMeshDistanceMaterial===!0){let F=r.properties.get(M);F.light=P}return M}function v(A,E,P,_,M){if(A.visible===!1)return;if(A.layers.test(E.layers)&&(A.isMesh||A.isLine||A.isPoints)&&(A.castShadow||A.receiveShadow&&M===Pi)&&(!A.frustumCulled||i.intersectsObject(A))){A.modelViewMatrix.multiplyMatrices(P.matrixWorldInverse,A.matrixWorld);let j=e.update(A),W=A.material;if(Array.isArray(W)){let K=j.groups;for(let C=0,U=K.length;C<U;C++){let O=K[C],z=W[O.materialIndex];if(z&&z.visible){let Y=g(A,z,_,M);A.onBeforeShadow(r,A,E,P,j,Y,O),r.renderBufferDirect(P,null,j,Y,A,O),A.onAfterShadow(r,A,E,P,j,Y,O)}}}else if(W.visible){let K=g(A,W,_,M);A.onBeforeShadow(r,A,E,P,j,K,null),r.renderBufferDirect(P,null,j,K,A,null),A.onAfterShadow(r,A,E,P,j,K,null)}}let F=A.children;for(let j=0,W=F.length;j<W;j++)v(F[j],E,P,_,M)}function T(A){A.target.removeEventListener("dispose",T);for(let P in c){let _=c[P],M=A.target.uuid;M in _&&(_[M].dispose(),delete _[M])}}}var av={[Ta]:Aa,[ka]:Ra,[Ea]:Ia,[Mn]:Ca,[Aa]:Ta,[Ra]:ka,[Ia]:Ea,[Ca]:Mn};function ov(r,e){function t(){let N=!1,ne=new Ye,ae=null,fe=new Ye(0,0,0,0);return{setMask:function(ee){ae!==ee&&!N&&(r.colorMask(ee,ee,ee,ee),ae=ee)},setLocked:function(ee){N=ee},setClear:function(ee,J,me,Pe,at){at===!0&&(ee*=Pe,J*=Pe,me*=Pe),ne.set(ee,J,me,Pe),fe.equals(ne)===!1&&(r.clearColor(ee,J,me,Pe),fe.copy(ne))},reset:function(){N=!1,ae=null,fe.set(-1,0,0,0)}}}function i(){let N=!1,ne=!1,ae=null,fe=null,ee=null;return{setReversed:function(J){if(ne!==J){let me=e.get("EXT_clip_control");J?me.clipControlEXT(me.LOWER_LEFT_EXT,me.ZERO_TO_ONE_EXT):me.clipControlEXT(me.LOWER_LEFT_EXT,me.NEGATIVE_ONE_TO_ONE_EXT),ne=J;let Pe=ee;ee=null,this.setClear(Pe)}},getReversed:function(){return ne},setTest:function(J){J?Z(r.DEPTH_TEST):he(r.DEPTH_TEST)},setMask:function(J){ae!==J&&!N&&(r.depthMask(J),ae=J)},setFunc:function(J){if(ne&&(J=av[J]),fe!==J){switch(J){case Ta:r.depthFunc(r.NEVER);break;case Aa:r.depthFunc(r.ALWAYS);break;case ka:r.depthFunc(r.LESS);break;case Mn:r.depthFunc(r.LEQUAL);break;case Ea:r.depthFunc(r.EQUAL);break;case Ca:r.depthFunc(r.GEQUAL);break;case Ra:r.depthFunc(r.GREATER);break;case Ia:r.depthFunc(r.NOTEQUAL);break;default:r.depthFunc(r.LEQUAL)}fe=J}},setLocked:function(J){N=J},setClear:function(J){ee!==J&&(ne&&(J=1-J),r.clearDepth(J),ee=J)},reset:function(){N=!1,ae=null,fe=null,ee=null,ne=!1}}}function n(){let N=!1,ne=null,ae=null,fe=null,ee=null,J=null,me=null,Pe=null,at=null;return{setTest:function(Je){N||(Je?Z(r.STENCIL_TEST):he(r.STENCIL_TEST))},setMask:function(Je){ne!==Je&&!N&&(r.stencilMask(Je),ne=Je)},setFunc:function(Je,Ni,bi){(ae!==Je||fe!==Ni||ee!==bi)&&(r.stencilFunc(Je,Ni,bi),ae=Je,fe=Ni,ee=bi)},setOp:function(Je,Ni,bi){(J!==Je||me!==Ni||Pe!==bi)&&(r.stencilOp(Je,Ni,bi),J=Je,me=Ni,Pe=bi)},setLocked:function(Je){N=Je},setClear:function(Je){at!==Je&&(r.clearStencil(Je),at=Je)},reset:function(){N=!1,ne=null,ae=null,fe=null,ee=null,J=null,me=null,Pe=null,at=null}}}let s=new t,a=new i,o=new n,l=new WeakMap,c=new WeakMap,d={},u={},h=new WeakMap,m=[],y=null,b=!1,p=null,f=null,x=null,g=null,v=null,T=null,A=null,E=new Me(0,0,0),P=0,_=!1,M=null,R=null,F=null,j=null,W=null,K=r.getParameter(r.MAX_COMBINED_TEXTURE_IMAGE_UNITS),C=!1,U=0,O=r.getParameter(r.VERSION);O.indexOf("WebGL")!==-1?(U=parseFloat(/^WebGL (\d)/.exec(O)[1]),C=U>=1):O.indexOf("OpenGL ES")!==-1&&(U=parseFloat(/^OpenGL ES (\d)/.exec(O)[1]),C=U>=2);let z=null,Y={},re=r.getParameter(r.SCISSOR_BOX),Te=r.getParameter(r.VIEWPORT),qe=new Ye().fromArray(re),Le=new Ye().fromArray(Te);function Xe(N,ne,ae,fe){let ee=new Uint8Array(4),J=r.createTexture();r.bindTexture(N,J),r.texParameteri(N,r.TEXTURE_MIN_FILTER,r.NEAREST),r.texParameteri(N,r.TEXTURE_MAG_FILTER,r.NEAREST);for(let me=0;me<ae;me++)N===r.TEXTURE_3D||N===r.TEXTURE_2D_ARRAY?r.texImage3D(ne,0,r.RGBA,1,1,fe,0,r.RGBA,r.UNSIGNED_BYTE,ee):r.texImage2D(ne+me,0,r.RGBA,1,1,0,r.RGBA,r.UNSIGNED_BYTE,ee);return J}let $={};$[r.TEXTURE_2D]=Xe(r.TEXTURE_2D,r.TEXTURE_2D,1),$[r.TEXTURE_CUBE_MAP]=Xe(r.TEXTURE_CUBE_MAP,r.TEXTURE_CUBE_MAP_POSITIVE_X,6),$[r.TEXTURE_2D_ARRAY]=Xe(r.TEXTURE_2D_ARRAY,r.TEXTURE_2D_ARRAY,1,1),$[r.TEXTURE_3D]=Xe(r.TEXTURE_3D,r.TEXTURE_3D,1,1),s.setClear(0,0,0,1),a.setClear(1),o.setClear(0),Z(r.DEPTH_TEST),a.setFunc(Mn),Ce(!1),ye(wl),Z(r.CULL_FACE),ct(Xi);function Z(N){d[N]!==!0&&(r.enable(N),d[N]=!0)}function he(N){d[N]!==!1&&(r.disable(N),d[N]=!1)}function Ie(N,ne){return u[N]!==ne?(r.bindFramebuffer(N,ne),u[N]=ne,N===r.DRAW_FRAMEBUFFER&&(u[r.FRAMEBUFFER]=ne),N===r.FRAMEBUFFER&&(u[r.DRAW_FRAMEBUFFER]=ne),!0):!1}function _e(N,ne){let ae=m,fe=!1;if(N){ae=h.get(ne),ae===void 0&&(ae=[],h.set(ne,ae));let ee=N.textures;if(ae.length!==ee.length||ae[0]!==r.COLOR_ATTACHMENT0){for(let J=0,me=ee.length;J<me;J++)ae[J]=r.COLOR_ATTACHMENT0+J;ae.length=ee.length,fe=!0}}else ae[0]!==r.BACK&&(ae[0]=r.BACK,fe=!0);fe&&r.drawBuffers(ae)}function $e(N){return y!==N?(r.useProgram(N),y=N,!0):!1}let Ot={[sn]:r.FUNC_ADD,[td]:r.FUNC_SUBTRACT,[id]:r.FUNC_REVERSE_SUBTRACT};Ot[nd]=r.MIN,Ot[rd]=r.MAX;let I={[sd]:r.ZERO,[ad]:r.ONE,[od]:r.SRC_COLOR,[aa]:r.SRC_ALPHA,[fd]:r.SRC_ALPHA_SATURATE,[dd]:r.DST_COLOR,[cd]:r.DST_ALPHA,[ld]:r.ONE_MINUS_SRC_COLOR,[oa]:r.ONE_MINUS_SRC_ALPHA,[hd]:r.ONE_MINUS_DST_COLOR,[ud]:r.ONE_MINUS_DST_ALPHA,[pd]:r.CONSTANT_COLOR,[md]:r.ONE_MINUS_CONSTANT_COLOR,[yd]:r.CONSTANT_ALPHA,[bd]:r.ONE_MINUS_CONSTANT_ALPHA};function ct(N,ne,ae,fe,ee,J,me,Pe,at,Je){if(N===Xi){b===!0&&(he(r.BLEND),b=!1);return}if(b===!1&&(Z(r.BLEND),b=!0),N!==ed){if(N!==p||Je!==_){if((f!==sn||v!==sn)&&(r.blendEquation(r.FUNC_ADD),f=sn,v=sn),Je)switch(N){case wn:r.blendFuncSeparate(r.ONE,r.ONE_MINUS_SRC_ALPHA,r.ONE,r.ONE_MINUS_SRC_ALPHA);break;case _l:r.blendFunc(r.ONE,r.ONE);break;case Sl:r.blendFuncSeparate(r.ZERO,r.ONE_MINUS_SRC_COLOR,r.ZERO,r.ONE);break;case Tl:r.blendFuncSeparate(r.DST_COLOR,r.ONE_MINUS_SRC_ALPHA,r.ZERO,r.ONE);break;default:console.error("THREE.WebGLState: Invalid blending: ",N);break}else switch(N){case wn:r.blendFuncSeparate(r.SRC_ALPHA,r.ONE_MINUS_SRC_ALPHA,r.ONE,r.ONE_MINUS_SRC_ALPHA);break;case _l:r.blendFuncSeparate(r.SRC_ALPHA,r.ONE,r.ONE,r.ONE);break;case Sl:console.error("THREE.WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case Tl:console.error("THREE.WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:console.error("THREE.WebGLState: Invalid blending: ",N);break}x=null,g=null,T=null,A=null,E.set(0,0,0),P=0,p=N,_=Je}return}ee=ee||ne,J=J||ae,me=me||fe,(ne!==f||ee!==v)&&(r.blendEquationSeparate(Ot[ne],Ot[ee]),f=ne,v=ee),(ae!==x||fe!==g||J!==T||me!==A)&&(r.blendFuncSeparate(I[ae],I[fe],I[J],I[me]),x=ae,g=fe,T=J,A=me),(Pe.equals(E)===!1||at!==P)&&(r.blendColor(Pe.r,Pe.g,Pe.b,at),E.copy(Pe),P=at),p=N,_=!1}function Ne(N,ne){N.side===bt?he(r.CULL_FACE):Z(r.CULL_FACE);let ae=N.side===Vt;ne&&(ae=!ae),Ce(ae),N.blending===wn&&N.transparent===!1?ct(Xi):ct(N.blending,N.blendEquation,N.blendSrc,N.blendDst,N.blendEquationAlpha,N.blendSrcAlpha,N.blendDstAlpha,N.blendColor,N.blendAlpha,N.premultipliedAlpha),a.setFunc(N.depthFunc),a.setTest(N.depthTest),a.setMask(N.depthWrite),s.setMask(N.colorWrite);let fe=N.stencilWrite;o.setTest(fe),fe&&(o.setMask(N.stencilWriteMask),o.setFunc(N.stencilFunc,N.stencilRef,N.stencilFuncMask),o.setOp(N.stencilFail,N.stencilZFail,N.stencilZPass)),be(N.polygonOffset,N.polygonOffsetFactor,N.polygonOffsetUnits),N.alphaToCoverage===!0?Z(r.SAMPLE_ALPHA_TO_COVERAGE):he(r.SAMPLE_ALPHA_TO_COVERAGE)}function Ce(N){M!==N&&(N?r.frontFace(r.CW):r.frontFace(r.CCW),M=N)}function ye(N){N!==Ju?(Z(r.CULL_FACE),N!==R&&(N===wl?r.cullFace(r.BACK):N===Zu?r.cullFace(r.FRONT):r.cullFace(r.FRONT_AND_BACK))):he(r.CULL_FACE),R=N}function ut(N){N!==F&&(C&&r.lineWidth(N),F=N)}function be(N,ne,ae){N?(Z(r.POLYGON_OFFSET_FILL),(j!==ne||W!==ae)&&(r.polygonOffset(ne,ae),j=ne,W=ae)):he(r.POLYGON_OFFSET_FILL)}function Ue(N){N?Z(r.SCISSOR_TEST):he(r.SCISSOR_TEST)}function kt(N){N===void 0&&(N=r.TEXTURE0+K-1),z!==N&&(r.activeTexture(N),z=N)}function yt(N,ne,ae){ae===void 0&&(z===null?ae=r.TEXTURE0+K-1:ae=z);let fe=Y[ae];fe===void 0&&(fe={type:void 0,texture:void 0},Y[ae]=fe),(fe.type!==N||fe.texture!==ne)&&(z!==ae&&(r.activeTexture(ae),z=ae),r.bindTexture(N,ne||$[N]),fe.type=N,fe.texture=ne)}function k(){let N=Y[z];N!==void 0&&N.type!==void 0&&(r.bindTexture(N.type,null),N.type=void 0,N.texture=void 0)}function w(){try{r.compressedTexImage2D(...arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function H(){try{r.compressedTexImage3D(...arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function X(){try{r.texSubImage2D(...arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function Q(){try{r.texSubImage3D(...arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function q(){try{r.compressedTexSubImage2D(...arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function we(){try{r.compressedTexSubImage3D(...arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function se(){try{r.texStorage2D(...arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function ve(){try{r.texStorage3D(...arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function ge(){try{r.texImage2D(...arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function ie(){try{r.texImage3D(...arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function ue(N){qe.equals(N)===!1&&(r.scissor(N.x,N.y,N.z,N.w),qe.copy(N))}function Ee(N){Le.equals(N)===!1&&(r.viewport(N.x,N.y,N.z,N.w),Le.copy(N))}function xe(N,ne){let ae=c.get(ne);ae===void 0&&(ae=new WeakMap,c.set(ne,ae));let fe=ae.get(N);fe===void 0&&(fe=r.getUniformBlockIndex(ne,N.name),ae.set(N,fe))}function le(N,ne){let fe=c.get(ne).get(N);l.get(ne)!==fe&&(r.uniformBlockBinding(ne,fe,N.__bindingPointIndex),l.set(ne,fe))}function De(){r.disable(r.BLEND),r.disable(r.CULL_FACE),r.disable(r.DEPTH_TEST),r.disable(r.POLYGON_OFFSET_FILL),r.disable(r.SCISSOR_TEST),r.disable(r.STENCIL_TEST),r.disable(r.SAMPLE_ALPHA_TO_COVERAGE),r.blendEquation(r.FUNC_ADD),r.blendFunc(r.ONE,r.ZERO),r.blendFuncSeparate(r.ONE,r.ZERO,r.ONE,r.ZERO),r.blendColor(0,0,0,0),r.colorMask(!0,!0,!0,!0),r.clearColor(0,0,0,0),r.depthMask(!0),r.depthFunc(r.LESS),a.setReversed(!1),r.clearDepth(1),r.stencilMask(4294967295),r.stencilFunc(r.ALWAYS,0,4294967295),r.stencilOp(r.KEEP,r.KEEP,r.KEEP),r.clearStencil(0),r.cullFace(r.BACK),r.frontFace(r.CCW),r.polygonOffset(0,0),r.activeTexture(r.TEXTURE0),r.bindFramebuffer(r.FRAMEBUFFER,null),r.bindFramebuffer(r.DRAW_FRAMEBUFFER,null),r.bindFramebuffer(r.READ_FRAMEBUFFER,null),r.useProgram(null),r.lineWidth(1),r.scissor(0,0,r.canvas.width,r.canvas.height),r.viewport(0,0,r.canvas.width,r.canvas.height),d={},z=null,Y={},u={},h=new WeakMap,m=[],y=null,b=!1,p=null,f=null,x=null,g=null,v=null,T=null,A=null,E=new Me(0,0,0),P=0,_=!1,M=null,R=null,F=null,j=null,W=null,qe.set(0,0,r.canvas.width,r.canvas.height),Le.set(0,0,r.canvas.width,r.canvas.height),s.reset(),a.reset(),o.reset()}return{buffers:{color:s,depth:a,stencil:o},enable:Z,disable:he,bindFramebuffer:Ie,drawBuffers:_e,useProgram:$e,setBlending:ct,setMaterial:Ne,setFlipSided:Ce,setCullFace:ye,setLineWidth:ut,setPolygonOffset:be,setScissorTest:Ue,activeTexture:kt,bindTexture:yt,unbindTexture:k,compressedTexImage2D:w,compressedTexImage3D:H,texImage2D:ge,texImage3D:ie,updateUBOMapping:xe,uniformBlockBinding:le,texStorage2D:se,texStorage3D:ve,texSubImage2D:X,texSubImage3D:Q,compressedTexSubImage2D:q,compressedTexSubImage3D:we,scissor:ue,viewport:Ee,reset:De}}function lv(r,e,t,i,n,s,a){let o=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new Oe,d=new WeakMap,u,h=new WeakMap,m=!1;try{m=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function y(k,w){return m?new OffscreenCanvas(k,w):cr("canvas")}function b(k,w,H){let X=1,Q=yt(k);if((Q.width>H||Q.height>H)&&(X=H/Math.max(Q.width,Q.height)),X<1)if(typeof HTMLImageElement<"u"&&k instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&k instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&k instanceof ImageBitmap||typeof VideoFrame<"u"&&k instanceof VideoFrame){let q=Math.floor(X*Q.width),we=Math.floor(X*Q.height);u===void 0&&(u=y(q,we));let se=w?y(q,we):u;return se.width=q,se.height=we,se.getContext("2d").drawImage(k,0,0,q,we),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+Q.width+"x"+Q.height+") to ("+q+"x"+we+")."),se}else return"data"in k&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+Q.width+"x"+Q.height+")."),k;return k}function p(k){return k.generateMipmaps}function f(k){r.generateMipmap(k)}function x(k){return k.isWebGLCubeRenderTarget?r.TEXTURE_CUBE_MAP:k.isWebGL3DRenderTarget?r.TEXTURE_3D:k.isWebGLArrayRenderTarget||k.isCompressedArrayTexture?r.TEXTURE_2D_ARRAY:r.TEXTURE_2D}function g(k,w,H,X,Q=!1){if(k!==null){if(r[k]!==void 0)return r[k];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+k+"'")}let q=w;if(w===r.RED&&(H===r.FLOAT&&(q=r.R32F),H===r.HALF_FLOAT&&(q=r.R16F),H===r.UNSIGNED_BYTE&&(q=r.R8)),w===r.RED_INTEGER&&(H===r.UNSIGNED_BYTE&&(q=r.R8UI),H===r.UNSIGNED_SHORT&&(q=r.R16UI),H===r.UNSIGNED_INT&&(q=r.R32UI),H===r.BYTE&&(q=r.R8I),H===r.SHORT&&(q=r.R16I),H===r.INT&&(q=r.R32I)),w===r.RG&&(H===r.FLOAT&&(q=r.RG32F),H===r.HALF_FLOAT&&(q=r.RG16F),H===r.UNSIGNED_BYTE&&(q=r.RG8)),w===r.RG_INTEGER&&(H===r.UNSIGNED_BYTE&&(q=r.RG8UI),H===r.UNSIGNED_SHORT&&(q=r.RG16UI),H===r.UNSIGNED_INT&&(q=r.RG32UI),H===r.BYTE&&(q=r.RG8I),H===r.SHORT&&(q=r.RG16I),H===r.INT&&(q=r.RG32I)),w===r.RGB_INTEGER&&(H===r.UNSIGNED_BYTE&&(q=r.RGB8UI),H===r.UNSIGNED_SHORT&&(q=r.RGB16UI),H===r.UNSIGNED_INT&&(q=r.RGB32UI),H===r.BYTE&&(q=r.RGB8I),H===r.SHORT&&(q=r.RGB16I),H===r.INT&&(q=r.RGB32I)),w===r.RGBA_INTEGER&&(H===r.UNSIGNED_BYTE&&(q=r.RGBA8UI),H===r.UNSIGNED_SHORT&&(q=r.RGBA16UI),H===r.UNSIGNED_INT&&(q=r.RGBA32UI),H===r.BYTE&&(q=r.RGBA8I),H===r.SHORT&&(q=r.RGBA16I),H===r.INT&&(q=r.RGBA32I)),w===r.RGB&&(H===r.UNSIGNED_INT_5_9_9_9_REV&&(q=r.RGB9_E5),H===r.UNSIGNED_INT_10F_11F_11F_REV&&(q=r.R11F_G11F_B10F)),w===r.RGBA){let we=Q?$r:Ve.getTransfer(X);H===r.FLOAT&&(q=r.RGBA32F),H===r.HALF_FLOAT&&(q=r.RGBA16F),H===r.UNSIGNED_BYTE&&(q=we===Qe?r.SRGB8_ALPHA8:r.RGBA8),H===r.UNSIGNED_SHORT_4_4_4_4&&(q=r.RGBA4),H===r.UNSIGNED_SHORT_5_5_5_1&&(q=r.RGB5_A1)}return(q===r.R16F||q===r.R32F||q===r.RG16F||q===r.RG32F||q===r.RGBA16F||q===r.RGBA32F)&&e.get("EXT_color_buffer_float"),q}function v(k,w){let H;return k?w===null||w===cn||w===Sr?H=r.DEPTH24_STENCIL8:w===ri?H=r.DEPTH32F_STENCIL8:w===Mr&&(H=r.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):w===null||w===cn||w===Sr?H=r.DEPTH_COMPONENT24:w===ri?H=r.DEPTH_COMPONENT32F:w===Mr&&(H=r.DEPTH_COMPONENT16),H}function T(k,w){return p(k)===!0||k.isFramebufferTexture&&k.minFilter!==It&&k.minFilter!==zt?Math.log2(Math.max(w.width,w.height))+1:k.mipmaps!==void 0&&k.mipmaps.length>0?k.mipmaps.length:k.isCompressedTexture&&Array.isArray(k.image)?w.mipmaps.length:1}function A(k){let w=k.target;w.removeEventListener("dispose",A),P(w),w.isVideoTexture&&d.delete(w)}function E(k){let w=k.target;w.removeEventListener("dispose",E),M(w)}function P(k){let w=i.get(k);if(w.__webglInit===void 0)return;let H=k.source,X=h.get(H);if(X){let Q=X[w.__cacheKey];Q.usedTimes--,Q.usedTimes===0&&_(k),Object.keys(X).length===0&&h.delete(H)}i.remove(k)}function _(k){let w=i.get(k);r.deleteTexture(w.__webglTexture);let H=k.source,X=h.get(H);delete X[w.__cacheKey],a.memory.textures--}function M(k){let w=i.get(k);if(k.depthTexture&&(k.depthTexture.dispose(),i.remove(k.depthTexture)),k.isWebGLCubeRenderTarget)for(let X=0;X<6;X++){if(Array.isArray(w.__webglFramebuffer[X]))for(let Q=0;Q<w.__webglFramebuffer[X].length;Q++)r.deleteFramebuffer(w.__webglFramebuffer[X][Q]);else r.deleteFramebuffer(w.__webglFramebuffer[X]);w.__webglDepthbuffer&&r.deleteRenderbuffer(w.__webglDepthbuffer[X])}else{if(Array.isArray(w.__webglFramebuffer))for(let X=0;X<w.__webglFramebuffer.length;X++)r.deleteFramebuffer(w.__webglFramebuffer[X]);else r.deleteFramebuffer(w.__webglFramebuffer);if(w.__webglDepthbuffer&&r.deleteRenderbuffer(w.__webglDepthbuffer),w.__webglMultisampledFramebuffer&&r.deleteFramebuffer(w.__webglMultisampledFramebuffer),w.__webglColorRenderbuffer)for(let X=0;X<w.__webglColorRenderbuffer.length;X++)w.__webglColorRenderbuffer[X]&&r.deleteRenderbuffer(w.__webglColorRenderbuffer[X]);w.__webglDepthRenderbuffer&&r.deleteRenderbuffer(w.__webglDepthRenderbuffer)}let H=k.textures;for(let X=0,Q=H.length;X<Q;X++){let q=i.get(H[X]);q.__webglTexture&&(r.deleteTexture(q.__webglTexture),a.memory.textures--),i.remove(H[X])}i.remove(k)}let R=0;function F(){R=0}function j(){let k=R;return k>=n.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+k+" texture units while this GPU supports only "+n.maxTextures),R+=1,k}function W(k){let w=[];return w.push(k.wrapS),w.push(k.wrapT),w.push(k.wrapR||0),w.push(k.magFilter),w.push(k.minFilter),w.push(k.anisotropy),w.push(k.internalFormat),w.push(k.format),w.push(k.type),w.push(k.generateMipmaps),w.push(k.premultiplyAlpha),w.push(k.flipY),w.push(k.unpackAlignment),w.push(k.colorSpace),w.join()}function K(k,w){let H=i.get(k);if(k.isVideoTexture&&Ue(k),k.isRenderTargetTexture===!1&&k.isExternalTexture!==!0&&k.version>0&&H.__version!==k.version){let X=k.image;if(X===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(X.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{$(H,k,w);return}}else k.isExternalTexture&&(H.__webglTexture=k.sourceTexture?k.sourceTexture:null);t.bindTexture(r.TEXTURE_2D,H.__webglTexture,r.TEXTURE0+w)}function C(k,w){let H=i.get(k);if(k.isRenderTargetTexture===!1&&k.version>0&&H.__version!==k.version){$(H,k,w);return}t.bindTexture(r.TEXTURE_2D_ARRAY,H.__webglTexture,r.TEXTURE0+w)}function U(k,w){let H=i.get(k);if(k.isRenderTargetTexture===!1&&k.version>0&&H.__version!==k.version){$(H,k,w);return}t.bindTexture(r.TEXTURE_3D,H.__webglTexture,r.TEXTURE0+w)}function O(k,w){let H=i.get(k);if(k.version>0&&H.__version!==k.version){Z(H,k,w);return}t.bindTexture(r.TEXTURE_CUBE_MAP,H.__webglTexture,r.TEXTURE0+w)}let z={[Mi]:r.REPEAT,[xi]:r.CLAMP_TO_EDGE,[ar]:r.MIRRORED_REPEAT},Y={[It]:r.NEAREST,[Fa]:r.NEAREST_MIPMAP_NEAREST,[Nn]:r.NEAREST_MIPMAP_LINEAR,[zt]:r.LINEAR,[wr]:r.LINEAR_MIPMAP_NEAREST,[mi]:r.LINEAR_MIPMAP_LINEAR},re={[Pd]:r.NEVER,[Bd]:r.ALWAYS,[Od]:r.LESS,[Nl]:r.LEQUAL,[Ld]:r.EQUAL,[Dd]:r.GEQUAL,[Nd]:r.GREATER,[Fd]:r.NOTEQUAL};function Te(k,w){if(w.type===ri&&e.has("OES_texture_float_linear")===!1&&(w.magFilter===zt||w.magFilter===wr||w.magFilter===Nn||w.magFilter===mi||w.minFilter===zt||w.minFilter===wr||w.minFilter===Nn||w.minFilter===mi)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),r.texParameteri(k,r.TEXTURE_WRAP_S,z[w.wrapS]),r.texParameteri(k,r.TEXTURE_WRAP_T,z[w.wrapT]),(k===r.TEXTURE_3D||k===r.TEXTURE_2D_ARRAY)&&r.texParameteri(k,r.TEXTURE_WRAP_R,z[w.wrapR]),r.texParameteri(k,r.TEXTURE_MAG_FILTER,Y[w.magFilter]),r.texParameteri(k,r.TEXTURE_MIN_FILTER,Y[w.minFilter]),w.compareFunction&&(r.texParameteri(k,r.TEXTURE_COMPARE_MODE,r.COMPARE_REF_TO_TEXTURE),r.texParameteri(k,r.TEXTURE_COMPARE_FUNC,re[w.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(w.magFilter===It||w.minFilter!==Nn&&w.minFilter!==mi||w.type===ri&&e.has("OES_texture_float_linear")===!1)return;if(w.anisotropy>1||i.get(w).__currentAnisotropy){let H=e.get("EXT_texture_filter_anisotropic");r.texParameterf(k,H.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(w.anisotropy,n.getMaxAnisotropy())),i.get(w).__currentAnisotropy=w.anisotropy}}}function qe(k,w){let H=!1;k.__webglInit===void 0&&(k.__webglInit=!0,w.addEventListener("dispose",A));let X=w.source,Q=h.get(X);Q===void 0&&(Q={},h.set(X,Q));let q=W(w);if(q!==k.__cacheKey){Q[q]===void 0&&(Q[q]={texture:r.createTexture(),usedTimes:0},a.memory.textures++,H=!0),Q[q].usedTimes++;let we=Q[k.__cacheKey];we!==void 0&&(Q[k.__cacheKey].usedTimes--,we.usedTimes===0&&_(w)),k.__cacheKey=q,k.__webglTexture=Q[q].texture}return H}function Le(k,w,H){return Math.floor(Math.floor(k/H)/w)}function Xe(k,w,H,X){let q=k.updateRanges;if(q.length===0)t.texSubImage2D(r.TEXTURE_2D,0,0,0,w.width,w.height,H,X,w.data);else{q.sort((ie,ue)=>ie.start-ue.start);let we=0;for(let ie=1;ie<q.length;ie++){let ue=q[we],Ee=q[ie],xe=ue.start+ue.count,le=Le(Ee.start,w.width,4),De=Le(ue.start,w.width,4);Ee.start<=xe+1&&le===De&&Le(Ee.start+Ee.count-1,w.width,4)===le?ue.count=Math.max(ue.count,Ee.start+Ee.count-ue.start):(++we,q[we]=Ee)}q.length=we+1;let se=r.getParameter(r.UNPACK_ROW_LENGTH),ve=r.getParameter(r.UNPACK_SKIP_PIXELS),ge=r.getParameter(r.UNPACK_SKIP_ROWS);r.pixelStorei(r.UNPACK_ROW_LENGTH,w.width);for(let ie=0,ue=q.length;ie<ue;ie++){let Ee=q[ie],xe=Math.floor(Ee.start/4),le=Math.ceil(Ee.count/4),De=xe%w.width,N=Math.floor(xe/w.width),ne=le,ae=1;r.pixelStorei(r.UNPACK_SKIP_PIXELS,De),r.pixelStorei(r.UNPACK_SKIP_ROWS,N),t.texSubImage2D(r.TEXTURE_2D,0,De,N,ne,ae,H,X,w.data)}k.clearUpdateRanges(),r.pixelStorei(r.UNPACK_ROW_LENGTH,se),r.pixelStorei(r.UNPACK_SKIP_PIXELS,ve),r.pixelStorei(r.UNPACK_SKIP_ROWS,ge)}}function $(k,w,H){let X=r.TEXTURE_2D;(w.isDataArrayTexture||w.isCompressedArrayTexture)&&(X=r.TEXTURE_2D_ARRAY),w.isData3DTexture&&(X=r.TEXTURE_3D);let Q=qe(k,w),q=w.source;t.bindTexture(X,k.__webglTexture,r.TEXTURE0+H);let we=i.get(q);if(q.version!==we.__version||Q===!0){t.activeTexture(r.TEXTURE0+H);let se=Ve.getPrimaries(Ve.workingColorSpace),ve=w.colorSpace===Yi?null:Ve.getPrimaries(w.colorSpace),ge=w.colorSpace===Yi||se===ve?r.NONE:r.BROWSER_DEFAULT_WEBGL;r.pixelStorei(r.UNPACK_FLIP_Y_WEBGL,w.flipY),r.pixelStorei(r.UNPACK_PREMULTIPLY_ALPHA_WEBGL,w.premultiplyAlpha),r.pixelStorei(r.UNPACK_ALIGNMENT,w.unpackAlignment),r.pixelStorei(r.UNPACK_COLORSPACE_CONVERSION_WEBGL,ge);let ie=b(w.image,!1,n.maxTextureSize);ie=kt(w,ie);let ue=s.convert(w.format,w.colorSpace),Ee=s.convert(w.type),xe=g(w.internalFormat,ue,Ee,w.colorSpace,w.isVideoTexture);Te(X,w);let le,De=w.mipmaps,N=w.isVideoTexture!==!0,ne=we.__version===void 0||Q===!0,ae=q.dataReady,fe=T(w,ie);if(w.isDepthTexture)xe=v(w.format===Tr,w.type),ne&&(N?t.texStorage2D(r.TEXTURE_2D,1,xe,ie.width,ie.height):t.texImage2D(r.TEXTURE_2D,0,xe,ie.width,ie.height,0,ue,Ee,null));else if(w.isDataTexture)if(De.length>0){N&&ne&&t.texStorage2D(r.TEXTURE_2D,fe,xe,De[0].width,De[0].height);for(let ee=0,J=De.length;ee<J;ee++)le=De[ee],N?ae&&t.texSubImage2D(r.TEXTURE_2D,ee,0,0,le.width,le.height,ue,Ee,le.data):t.texImage2D(r.TEXTURE_2D,ee,xe,le.width,le.height,0,ue,Ee,le.data);w.generateMipmaps=!1}else N?(ne&&t.texStorage2D(r.TEXTURE_2D,fe,xe,ie.width,ie.height),ae&&Xe(w,ie,ue,Ee)):t.texImage2D(r.TEXTURE_2D,0,xe,ie.width,ie.height,0,ue,Ee,ie.data);else if(w.isCompressedTexture)if(w.isCompressedArrayTexture){N&&ne&&t.texStorage3D(r.TEXTURE_2D_ARRAY,fe,xe,De[0].width,De[0].height,ie.depth);for(let ee=0,J=De.length;ee<J;ee++)if(le=De[ee],w.format!==Qt)if(ue!==null)if(N){if(ae)if(w.layerUpdates.size>0){let me=Vl(le.width,le.height,w.format,w.type);for(let Pe of w.layerUpdates){let at=le.data.subarray(Pe*me/le.data.BYTES_PER_ELEMENT,(Pe+1)*me/le.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(r.TEXTURE_2D_ARRAY,ee,0,0,Pe,le.width,le.height,1,ue,at)}w.clearLayerUpdates()}else t.compressedTexSubImage3D(r.TEXTURE_2D_ARRAY,ee,0,0,0,le.width,le.height,ie.depth,ue,le.data)}else t.compressedTexImage3D(r.TEXTURE_2D_ARRAY,ee,xe,le.width,le.height,ie.depth,0,le.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else N?ae&&t.texSubImage3D(r.TEXTURE_2D_ARRAY,ee,0,0,0,le.width,le.height,ie.depth,ue,Ee,le.data):t.texImage3D(r.TEXTURE_2D_ARRAY,ee,xe,le.width,le.height,ie.depth,0,ue,Ee,le.data)}else{N&&ne&&t.texStorage2D(r.TEXTURE_2D,fe,xe,De[0].width,De[0].height);for(let ee=0,J=De.length;ee<J;ee++)le=De[ee],w.format!==Qt?ue!==null?N?ae&&t.compressedTexSubImage2D(r.TEXTURE_2D,ee,0,0,le.width,le.height,ue,le.data):t.compressedTexImage2D(r.TEXTURE_2D,ee,xe,le.width,le.height,0,le.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):N?ae&&t.texSubImage2D(r.TEXTURE_2D,ee,0,0,le.width,le.height,ue,Ee,le.data):t.texImage2D(r.TEXTURE_2D,ee,xe,le.width,le.height,0,ue,Ee,le.data)}else if(w.isDataArrayTexture)if(N){if(ne&&t.texStorage3D(r.TEXTURE_2D_ARRAY,fe,xe,ie.width,ie.height,ie.depth),ae)if(w.layerUpdates.size>0){let ee=Vl(ie.width,ie.height,w.format,w.type);for(let J of w.layerUpdates){let me=ie.data.subarray(J*ee/ie.data.BYTES_PER_ELEMENT,(J+1)*ee/ie.data.BYTES_PER_ELEMENT);t.texSubImage3D(r.TEXTURE_2D_ARRAY,0,0,0,J,ie.width,ie.height,1,ue,Ee,me)}w.clearLayerUpdates()}else t.texSubImage3D(r.TEXTURE_2D_ARRAY,0,0,0,0,ie.width,ie.height,ie.depth,ue,Ee,ie.data)}else t.texImage3D(r.TEXTURE_2D_ARRAY,0,xe,ie.width,ie.height,ie.depth,0,ue,Ee,ie.data);else if(w.isData3DTexture)N?(ne&&t.texStorage3D(r.TEXTURE_3D,fe,xe,ie.width,ie.height,ie.depth),ae&&t.texSubImage3D(r.TEXTURE_3D,0,0,0,0,ie.width,ie.height,ie.depth,ue,Ee,ie.data)):t.texImage3D(r.TEXTURE_3D,0,xe,ie.width,ie.height,ie.depth,0,ue,Ee,ie.data);else if(w.isFramebufferTexture){if(ne)if(N)t.texStorage2D(r.TEXTURE_2D,fe,xe,ie.width,ie.height);else{let ee=ie.width,J=ie.height;for(let me=0;me<fe;me++)t.texImage2D(r.TEXTURE_2D,me,xe,ee,J,0,ue,Ee,null),ee>>=1,J>>=1}}else if(De.length>0){if(N&&ne){let ee=yt(De[0]);t.texStorage2D(r.TEXTURE_2D,fe,xe,ee.width,ee.height)}for(let ee=0,J=De.length;ee<J;ee++)le=De[ee],N?ae&&t.texSubImage2D(r.TEXTURE_2D,ee,0,0,ue,Ee,le):t.texImage2D(r.TEXTURE_2D,ee,xe,ue,Ee,le);w.generateMipmaps=!1}else if(N){if(ne){let ee=yt(ie);t.texStorage2D(r.TEXTURE_2D,fe,xe,ee.width,ee.height)}ae&&t.texSubImage2D(r.TEXTURE_2D,0,0,0,ue,Ee,ie)}else t.texImage2D(r.TEXTURE_2D,0,xe,ue,Ee,ie);p(w)&&f(X),we.__version=q.version,w.onUpdate&&w.onUpdate(w)}k.__version=w.version}function Z(k,w,H){if(w.image.length!==6)return;let X=qe(k,w),Q=w.source;t.bindTexture(r.TEXTURE_CUBE_MAP,k.__webglTexture,r.TEXTURE0+H);let q=i.get(Q);if(Q.version!==q.__version||X===!0){t.activeTexture(r.TEXTURE0+H);let we=Ve.getPrimaries(Ve.workingColorSpace),se=w.colorSpace===Yi?null:Ve.getPrimaries(w.colorSpace),ve=w.colorSpace===Yi||we===se?r.NONE:r.BROWSER_DEFAULT_WEBGL;r.pixelStorei(r.UNPACK_FLIP_Y_WEBGL,w.flipY),r.pixelStorei(r.UNPACK_PREMULTIPLY_ALPHA_WEBGL,w.premultiplyAlpha),r.pixelStorei(r.UNPACK_ALIGNMENT,w.unpackAlignment),r.pixelStorei(r.UNPACK_COLORSPACE_CONVERSION_WEBGL,ve);let ge=w.isCompressedTexture||w.image[0].isCompressedTexture,ie=w.image[0]&&w.image[0].isDataTexture,ue=[];for(let J=0;J<6;J++)!ge&&!ie?ue[J]=b(w.image[J],!0,n.maxCubemapSize):ue[J]=ie?w.image[J].image:w.image[J],ue[J]=kt(w,ue[J]);let Ee=ue[0],xe=s.convert(w.format,w.colorSpace),le=s.convert(w.type),De=g(w.internalFormat,xe,le,w.colorSpace),N=w.isVideoTexture!==!0,ne=q.__version===void 0||X===!0,ae=Q.dataReady,fe=T(w,Ee);Te(r.TEXTURE_CUBE_MAP,w);let ee;if(ge){N&&ne&&t.texStorage2D(r.TEXTURE_CUBE_MAP,fe,De,Ee.width,Ee.height);for(let J=0;J<6;J++){ee=ue[J].mipmaps;for(let me=0;me<ee.length;me++){let Pe=ee[me];w.format!==Qt?xe!==null?N?ae&&t.compressedTexSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+J,me,0,0,Pe.width,Pe.height,xe,Pe.data):t.compressedTexImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+J,me,De,Pe.width,Pe.height,0,Pe.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):N?ae&&t.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+J,me,0,0,Pe.width,Pe.height,xe,le,Pe.data):t.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+J,me,De,Pe.width,Pe.height,0,xe,le,Pe.data)}}}else{if(ee=w.mipmaps,N&&ne){ee.length>0&&fe++;let J=yt(ue[0]);t.texStorage2D(r.TEXTURE_CUBE_MAP,fe,De,J.width,J.height)}for(let J=0;J<6;J++)if(ie){N?ae&&t.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+J,0,0,0,ue[J].width,ue[J].height,xe,le,ue[J].data):t.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+J,0,De,ue[J].width,ue[J].height,0,xe,le,ue[J].data);for(let me=0;me<ee.length;me++){let at=ee[me].image[J].image;N?ae&&t.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+J,me+1,0,0,at.width,at.height,xe,le,at.data):t.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+J,me+1,De,at.width,at.height,0,xe,le,at.data)}}else{N?ae&&t.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+J,0,0,0,xe,le,ue[J]):t.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+J,0,De,xe,le,ue[J]);for(let me=0;me<ee.length;me++){let Pe=ee[me];N?ae&&t.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+J,me+1,0,0,xe,le,Pe.image[J]):t.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+J,me+1,De,xe,le,Pe.image[J])}}}p(w)&&f(r.TEXTURE_CUBE_MAP),q.__version=Q.version,w.onUpdate&&w.onUpdate(w)}k.__version=w.version}function he(k,w,H,X,Q,q){let we=s.convert(H.format,H.colorSpace),se=s.convert(H.type),ve=g(H.internalFormat,we,se,H.colorSpace),ge=i.get(w),ie=i.get(H);if(ie.__renderTarget=w,!ge.__hasExternalTextures){let ue=Math.max(1,w.width>>q),Ee=Math.max(1,w.height>>q);Q===r.TEXTURE_3D||Q===r.TEXTURE_2D_ARRAY?t.texImage3D(Q,q,ve,ue,Ee,w.depth,0,we,se,null):t.texImage2D(Q,q,ve,ue,Ee,0,we,se,null)}t.bindFramebuffer(r.FRAMEBUFFER,k),be(w)?o.framebufferTexture2DMultisampleEXT(r.FRAMEBUFFER,X,Q,ie.__webglTexture,0,ut(w)):(Q===r.TEXTURE_2D||Q>=r.TEXTURE_CUBE_MAP_POSITIVE_X&&Q<=r.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&r.framebufferTexture2D(r.FRAMEBUFFER,X,Q,ie.__webglTexture,q),t.bindFramebuffer(r.FRAMEBUFFER,null)}function Ie(k,w,H){if(r.bindRenderbuffer(r.RENDERBUFFER,k),w.depthBuffer){let X=w.depthTexture,Q=X&&X.isDepthTexture?X.type:null,q=v(w.stencilBuffer,Q),we=w.stencilBuffer?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT,se=ut(w);be(w)?o.renderbufferStorageMultisampleEXT(r.RENDERBUFFER,se,q,w.width,w.height):H?r.renderbufferStorageMultisample(r.RENDERBUFFER,se,q,w.width,w.height):r.renderbufferStorage(r.RENDERBUFFER,q,w.width,w.height),r.framebufferRenderbuffer(r.FRAMEBUFFER,we,r.RENDERBUFFER,k)}else{let X=w.textures;for(let Q=0;Q<X.length;Q++){let q=X[Q],we=s.convert(q.format,q.colorSpace),se=s.convert(q.type),ve=g(q.internalFormat,we,se,q.colorSpace),ge=ut(w);H&&be(w)===!1?r.renderbufferStorageMultisample(r.RENDERBUFFER,ge,ve,w.width,w.height):be(w)?o.renderbufferStorageMultisampleEXT(r.RENDERBUFFER,ge,ve,w.width,w.height):r.renderbufferStorage(r.RENDERBUFFER,ve,w.width,w.height)}}r.bindRenderbuffer(r.RENDERBUFFER,null)}function _e(k,w){if(w&&w.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(t.bindFramebuffer(r.FRAMEBUFFER,k),!(w.depthTexture&&w.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");let X=i.get(w.depthTexture);X.__renderTarget=w,(!X.__webglTexture||w.depthTexture.image.width!==w.width||w.depthTexture.image.height!==w.height)&&(w.depthTexture.image.width=w.width,w.depthTexture.image.height=w.height,w.depthTexture.needsUpdate=!0),K(w.depthTexture,0);let Q=X.__webglTexture,q=ut(w);if(w.depthTexture.format===or)be(w)?o.framebufferTexture2DMultisampleEXT(r.FRAMEBUFFER,r.DEPTH_ATTACHMENT,r.TEXTURE_2D,Q,0,q):r.framebufferTexture2D(r.FRAMEBUFFER,r.DEPTH_ATTACHMENT,r.TEXTURE_2D,Q,0);else if(w.depthTexture.format===Tr)be(w)?o.framebufferTexture2DMultisampleEXT(r.FRAMEBUFFER,r.DEPTH_STENCIL_ATTACHMENT,r.TEXTURE_2D,Q,0,q):r.framebufferTexture2D(r.FRAMEBUFFER,r.DEPTH_STENCIL_ATTACHMENT,r.TEXTURE_2D,Q,0);else throw new Error("Unknown depthTexture format")}function $e(k){let w=i.get(k),H=k.isWebGLCubeRenderTarget===!0;if(w.__boundDepthTexture!==k.depthTexture){let X=k.depthTexture;if(w.__depthDisposeCallback&&w.__depthDisposeCallback(),X){let Q=()=>{delete w.__boundDepthTexture,delete w.__depthDisposeCallback,X.removeEventListener("dispose",Q)};X.addEventListener("dispose",Q),w.__depthDisposeCallback=Q}w.__boundDepthTexture=X}if(k.depthTexture&&!w.__autoAllocateDepthBuffer){if(H)throw new Error("target.depthTexture not supported in Cube render targets");let X=k.texture.mipmaps;X&&X.length>0?_e(w.__webglFramebuffer[0],k):_e(w.__webglFramebuffer,k)}else if(H){w.__webglDepthbuffer=[];for(let X=0;X<6;X++)if(t.bindFramebuffer(r.FRAMEBUFFER,w.__webglFramebuffer[X]),w.__webglDepthbuffer[X]===void 0)w.__webglDepthbuffer[X]=r.createRenderbuffer(),Ie(w.__webglDepthbuffer[X],k,!1);else{let Q=k.stencilBuffer?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT,q=w.__webglDepthbuffer[X];r.bindRenderbuffer(r.RENDERBUFFER,q),r.framebufferRenderbuffer(r.FRAMEBUFFER,Q,r.RENDERBUFFER,q)}}else{let X=k.texture.mipmaps;if(X&&X.length>0?t.bindFramebuffer(r.FRAMEBUFFER,w.__webglFramebuffer[0]):t.bindFramebuffer(r.FRAMEBUFFER,w.__webglFramebuffer),w.__webglDepthbuffer===void 0)w.__webglDepthbuffer=r.createRenderbuffer(),Ie(w.__webglDepthbuffer,k,!1);else{let Q=k.stencilBuffer?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT,q=w.__webglDepthbuffer;r.bindRenderbuffer(r.RENDERBUFFER,q),r.framebufferRenderbuffer(r.FRAMEBUFFER,Q,r.RENDERBUFFER,q)}}t.bindFramebuffer(r.FRAMEBUFFER,null)}function Ot(k,w,H){let X=i.get(k);w!==void 0&&he(X.__webglFramebuffer,k,k.texture,r.COLOR_ATTACHMENT0,r.TEXTURE_2D,0),H!==void 0&&$e(k)}function I(k){let w=k.texture,H=i.get(k),X=i.get(w);k.addEventListener("dispose",E);let Q=k.textures,q=k.isWebGLCubeRenderTarget===!0,we=Q.length>1;if(we||(X.__webglTexture===void 0&&(X.__webglTexture=r.createTexture()),X.__version=w.version,a.memory.textures++),q){H.__webglFramebuffer=[];for(let se=0;se<6;se++)if(w.mipmaps&&w.mipmaps.length>0){H.__webglFramebuffer[se]=[];for(let ve=0;ve<w.mipmaps.length;ve++)H.__webglFramebuffer[se][ve]=r.createFramebuffer()}else H.__webglFramebuffer[se]=r.createFramebuffer()}else{if(w.mipmaps&&w.mipmaps.length>0){H.__webglFramebuffer=[];for(let se=0;se<w.mipmaps.length;se++)H.__webglFramebuffer[se]=r.createFramebuffer()}else H.__webglFramebuffer=r.createFramebuffer();if(we)for(let se=0,ve=Q.length;se<ve;se++){let ge=i.get(Q[se]);ge.__webglTexture===void 0&&(ge.__webglTexture=r.createTexture(),a.memory.textures++)}if(k.samples>0&&be(k)===!1){H.__webglMultisampledFramebuffer=r.createFramebuffer(),H.__webglColorRenderbuffer=[],t.bindFramebuffer(r.FRAMEBUFFER,H.__webglMultisampledFramebuffer);for(let se=0;se<Q.length;se++){let ve=Q[se];H.__webglColorRenderbuffer[se]=r.createRenderbuffer(),r.bindRenderbuffer(r.RENDERBUFFER,H.__webglColorRenderbuffer[se]);let ge=s.convert(ve.format,ve.colorSpace),ie=s.convert(ve.type),ue=g(ve.internalFormat,ge,ie,ve.colorSpace,k.isXRRenderTarget===!0),Ee=ut(k);r.renderbufferStorageMultisample(r.RENDERBUFFER,Ee,ue,k.width,k.height),r.framebufferRenderbuffer(r.FRAMEBUFFER,r.COLOR_ATTACHMENT0+se,r.RENDERBUFFER,H.__webglColorRenderbuffer[se])}r.bindRenderbuffer(r.RENDERBUFFER,null),k.depthBuffer&&(H.__webglDepthRenderbuffer=r.createRenderbuffer(),Ie(H.__webglDepthRenderbuffer,k,!0)),t.bindFramebuffer(r.FRAMEBUFFER,null)}}if(q){t.bindTexture(r.TEXTURE_CUBE_MAP,X.__webglTexture),Te(r.TEXTURE_CUBE_MAP,w);for(let se=0;se<6;se++)if(w.mipmaps&&w.mipmaps.length>0)for(let ve=0;ve<w.mipmaps.length;ve++)he(H.__webglFramebuffer[se][ve],k,w,r.COLOR_ATTACHMENT0,r.TEXTURE_CUBE_MAP_POSITIVE_X+se,ve);else he(H.__webglFramebuffer[se],k,w,r.COLOR_ATTACHMENT0,r.TEXTURE_CUBE_MAP_POSITIVE_X+se,0);p(w)&&f(r.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(we){for(let se=0,ve=Q.length;se<ve;se++){let ge=Q[se],ie=i.get(ge),ue=r.TEXTURE_2D;(k.isWebGL3DRenderTarget||k.isWebGLArrayRenderTarget)&&(ue=k.isWebGL3DRenderTarget?r.TEXTURE_3D:r.TEXTURE_2D_ARRAY),t.bindTexture(ue,ie.__webglTexture),Te(ue,ge),he(H.__webglFramebuffer,k,ge,r.COLOR_ATTACHMENT0+se,ue,0),p(ge)&&f(ue)}t.unbindTexture()}else{let se=r.TEXTURE_2D;if((k.isWebGL3DRenderTarget||k.isWebGLArrayRenderTarget)&&(se=k.isWebGL3DRenderTarget?r.TEXTURE_3D:r.TEXTURE_2D_ARRAY),t.bindTexture(se,X.__webglTexture),Te(se,w),w.mipmaps&&w.mipmaps.length>0)for(let ve=0;ve<w.mipmaps.length;ve++)he(H.__webglFramebuffer[ve],k,w,r.COLOR_ATTACHMENT0,se,ve);else he(H.__webglFramebuffer,k,w,r.COLOR_ATTACHMENT0,se,0);p(w)&&f(se),t.unbindTexture()}k.depthBuffer&&$e(k)}function ct(k){let w=k.textures;for(let H=0,X=w.length;H<X;H++){let Q=w[H];if(p(Q)){let q=x(k),we=i.get(Q).__webglTexture;t.bindTexture(q,we),f(q),t.unbindTexture()}}}let Ne=[],Ce=[];function ye(k){if(k.samples>0){if(be(k)===!1){let w=k.textures,H=k.width,X=k.height,Q=r.COLOR_BUFFER_BIT,q=k.stencilBuffer?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT,we=i.get(k),se=w.length>1;if(se)for(let ge=0;ge<w.length;ge++)t.bindFramebuffer(r.FRAMEBUFFER,we.__webglMultisampledFramebuffer),r.framebufferRenderbuffer(r.FRAMEBUFFER,r.COLOR_ATTACHMENT0+ge,r.RENDERBUFFER,null),t.bindFramebuffer(r.FRAMEBUFFER,we.__webglFramebuffer),r.framebufferTexture2D(r.DRAW_FRAMEBUFFER,r.COLOR_ATTACHMENT0+ge,r.TEXTURE_2D,null,0);t.bindFramebuffer(r.READ_FRAMEBUFFER,we.__webglMultisampledFramebuffer);let ve=k.texture.mipmaps;ve&&ve.length>0?t.bindFramebuffer(r.DRAW_FRAMEBUFFER,we.__webglFramebuffer[0]):t.bindFramebuffer(r.DRAW_FRAMEBUFFER,we.__webglFramebuffer);for(let ge=0;ge<w.length;ge++){if(k.resolveDepthBuffer&&(k.depthBuffer&&(Q|=r.DEPTH_BUFFER_BIT),k.stencilBuffer&&k.resolveStencilBuffer&&(Q|=r.STENCIL_BUFFER_BIT)),se){r.framebufferRenderbuffer(r.READ_FRAMEBUFFER,r.COLOR_ATTACHMENT0,r.RENDERBUFFER,we.__webglColorRenderbuffer[ge]);let ie=i.get(w[ge]).__webglTexture;r.framebufferTexture2D(r.DRAW_FRAMEBUFFER,r.COLOR_ATTACHMENT0,r.TEXTURE_2D,ie,0)}r.blitFramebuffer(0,0,H,X,0,0,H,X,Q,r.NEAREST),l===!0&&(Ne.length=0,Ce.length=0,Ne.push(r.COLOR_ATTACHMENT0+ge),k.depthBuffer&&k.resolveDepthBuffer===!1&&(Ne.push(q),Ce.push(q),r.invalidateFramebuffer(r.DRAW_FRAMEBUFFER,Ce)),r.invalidateFramebuffer(r.READ_FRAMEBUFFER,Ne))}if(t.bindFramebuffer(r.READ_FRAMEBUFFER,null),t.bindFramebuffer(r.DRAW_FRAMEBUFFER,null),se)for(let ge=0;ge<w.length;ge++){t.bindFramebuffer(r.FRAMEBUFFER,we.__webglMultisampledFramebuffer),r.framebufferRenderbuffer(r.FRAMEBUFFER,r.COLOR_ATTACHMENT0+ge,r.RENDERBUFFER,we.__webglColorRenderbuffer[ge]);let ie=i.get(w[ge]).__webglTexture;t.bindFramebuffer(r.FRAMEBUFFER,we.__webglFramebuffer),r.framebufferTexture2D(r.DRAW_FRAMEBUFFER,r.COLOR_ATTACHMENT0+ge,r.TEXTURE_2D,ie,0)}t.bindFramebuffer(r.DRAW_FRAMEBUFFER,we.__webglMultisampledFramebuffer)}else if(k.depthBuffer&&k.resolveDepthBuffer===!1&&l){let w=k.stencilBuffer?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT;r.invalidateFramebuffer(r.DRAW_FRAMEBUFFER,[w])}}}function ut(k){return Math.min(n.maxSamples,k.samples)}function be(k){let w=i.get(k);return k.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&w.__useRenderToTexture!==!1}function Ue(k){let w=a.render.frame;d.get(k)!==w&&(d.set(k,w),k.update())}function kt(k,w){let H=k.colorSpace,X=k.format,Q=k.type;return k.isCompressedTexture===!0||k.isVideoTexture===!0||H!==_t&&H!==Yi&&(Ve.getTransfer(H)===Qe?(X!==Qt||Q!==yi)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",H)),w}function yt(k){return typeof HTMLImageElement<"u"&&k instanceof HTMLImageElement?(c.width=k.naturalWidth||k.width,c.height=k.naturalHeight||k.height):typeof VideoFrame<"u"&&k instanceof VideoFrame?(c.width=k.displayWidth,c.height=k.displayHeight):(c.width=k.width,c.height=k.height),c}this.allocateTextureUnit=j,this.resetTextureUnits=F,this.setTexture2D=K,this.setTexture2DArray=C,this.setTexture3D=U,this.setTextureCube=O,this.rebindTextures=Ot,this.setupRenderTarget=I,this.updateRenderTargetMipmap=ct,this.updateMultisampleRenderTarget=ye,this.setupDepthRenderbuffer=$e,this.setupFrameBufferTexture=he,this.useMultisampledRTT=be}function cv(r,e){function t(i,n=Yi){let s,a=Ve.getTransfer(n);if(i===yi)return r.UNSIGNED_BYTE;if(i===Ba)return r.UNSIGNED_SHORT_4_4_4_4;if(i===Ua)return r.UNSIGNED_SHORT_5_5_5_1;if(i===Cl)return r.UNSIGNED_INT_5_9_9_9_REV;if(i===Rl)return r.UNSIGNED_INT_10F_11F_11F_REV;if(i===kl)return r.BYTE;if(i===El)return r.SHORT;if(i===Mr)return r.UNSIGNED_SHORT;if(i===Da)return r.INT;if(i===cn)return r.UNSIGNED_INT;if(i===ri)return r.FLOAT;if(i===_r)return r.HALF_FLOAT;if(i===Il)return r.ALPHA;if(i===Pl)return r.RGB;if(i===Qt)return r.RGBA;if(i===or)return r.DEPTH_COMPONENT;if(i===Tr)return r.DEPTH_STENCIL;if(i===za)return r.RED;if(i===Ha)return r.RED_INTEGER;if(i===Ol)return r.RG;if(i===ja)return r.RG_INTEGER;if(i===Ga)return r.RGBA_INTEGER;if(i===Ts||i===As||i===ks||i===Es)if(a===Qe)if(s=e.get("WEBGL_compressed_texture_s3tc_srgb"),s!==null){if(i===Ts)return s.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(i===As)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(i===ks)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(i===Es)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(s=e.get("WEBGL_compressed_texture_s3tc"),s!==null){if(i===Ts)return s.COMPRESSED_RGB_S3TC_DXT1_EXT;if(i===As)return s.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(i===ks)return s.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(i===Es)return s.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(i===Va||i===Wa||i===qa||i===$a)if(s=e.get("WEBGL_compressed_texture_pvrtc"),s!==null){if(i===Va)return s.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(i===Wa)return s.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(i===qa)return s.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(i===$a)return s.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(i===Xa||i===Ka||i===Ya)if(s=e.get("WEBGL_compressed_texture_etc"),s!==null){if(i===Xa||i===Ka)return a===Qe?s.COMPRESSED_SRGB8_ETC2:s.COMPRESSED_RGB8_ETC2;if(i===Ya)return a===Qe?s.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:s.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(i===Ja||i===Za||i===Qa||i===eo||i===to||i===io||i===no||i===ro||i===so||i===ao||i===oo||i===lo||i===co||i===uo)if(s=e.get("WEBGL_compressed_texture_astc"),s!==null){if(i===Ja)return a===Qe?s.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:s.COMPRESSED_RGBA_ASTC_4x4_KHR;if(i===Za)return a===Qe?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:s.COMPRESSED_RGBA_ASTC_5x4_KHR;if(i===Qa)return a===Qe?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:s.COMPRESSED_RGBA_ASTC_5x5_KHR;if(i===eo)return a===Qe?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:s.COMPRESSED_RGBA_ASTC_6x5_KHR;if(i===to)return a===Qe?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:s.COMPRESSED_RGBA_ASTC_6x6_KHR;if(i===io)return a===Qe?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:s.COMPRESSED_RGBA_ASTC_8x5_KHR;if(i===no)return a===Qe?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:s.COMPRESSED_RGBA_ASTC_8x6_KHR;if(i===ro)return a===Qe?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:s.COMPRESSED_RGBA_ASTC_8x8_KHR;if(i===so)return a===Qe?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:s.COMPRESSED_RGBA_ASTC_10x5_KHR;if(i===ao)return a===Qe?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:s.COMPRESSED_RGBA_ASTC_10x6_KHR;if(i===oo)return a===Qe?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:s.COMPRESSED_RGBA_ASTC_10x8_KHR;if(i===lo)return a===Qe?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:s.COMPRESSED_RGBA_ASTC_10x10_KHR;if(i===co)return a===Qe?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:s.COMPRESSED_RGBA_ASTC_12x10_KHR;if(i===uo)return a===Qe?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:s.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(i===ho||i===fo||i===po)if(s=e.get("EXT_texture_compression_bptc"),s!==null){if(i===ho)return a===Qe?s.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:s.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(i===fo)return s.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(i===po)return s.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(i===mo||i===yo||i===bo||i===vo)if(s=e.get("EXT_texture_compression_rgtc"),s!==null){if(i===mo)return s.COMPRESSED_RED_RGTC1_EXT;if(i===yo)return s.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(i===bo)return s.COMPRESSED_RED_GREEN_RGTC2_EXT;if(i===vo)return s.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return i===Sr?r.UNSIGNED_INT_24_8:r[i]!==void 0?r[i]:null}return{convert:t}}var uv=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,dv=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`,nc=class{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){let i=new ds(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=i}}getMesh(e){if(this.texture!==null&&this.mesh===null){let t=e.cameras[0].viewport,i=new pi({vertexShader:uv,fragmentShader:dv,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new We(new ki(20,20),i)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}},rc=class extends _i{constructor(e,t){super();let i=this,n=null,s=1,a=null,o="local-floor",l=1,c=null,d=null,u=null,h=null,m=null,y=null,b=typeof XRWebGLBinding<"u",p=new nc,f={},x=t.getContextAttributes(),g=null,v=null,T=[],A=[],E=new Oe,P=null,_=new xt;_.viewport=new Ye;let M=new xt;M.viewport=new Ye;let R=[_,M],F=new Ma,j=null,W=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function($){let Z=T[$];return Z===void 0&&(Z=new hr,T[$]=Z),Z.getTargetRaySpace()},this.getControllerGrip=function($){let Z=T[$];return Z===void 0&&(Z=new hr,T[$]=Z),Z.getGripSpace()},this.getHand=function($){let Z=T[$];return Z===void 0&&(Z=new hr,T[$]=Z),Z.getHandSpace()};function K($){let Z=A.indexOf($.inputSource);if(Z===-1)return;let he=T[Z];he!==void 0&&(he.update($.inputSource,$.frame,c||a),he.dispatchEvent({type:$.type,data:$.inputSource}))}function C(){n.removeEventListener("select",K),n.removeEventListener("selectstart",K),n.removeEventListener("selectend",K),n.removeEventListener("squeeze",K),n.removeEventListener("squeezestart",K),n.removeEventListener("squeezeend",K),n.removeEventListener("end",C),n.removeEventListener("inputsourceschange",U);for(let $=0;$<T.length;$++){let Z=A[$];Z!==null&&(A[$]=null,T[$].disconnect(Z))}j=null,W=null,p.reset();for(let $ in f)delete f[$];e.setRenderTarget(g),m=null,h=null,u=null,n=null,v=null,Xe.stop(),i.isPresenting=!1,e.setPixelRatio(P),e.setSize(E.width,E.height,!1),i.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function($){s=$,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function($){o=$,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||a},this.setReferenceSpace=function($){c=$},this.getBaseLayer=function(){return h!==null?h:m},this.getBinding=function(){return u===null&&b&&(u=new XRWebGLBinding(n,t)),u},this.getFrame=function(){return y},this.getSession=function(){return n},this.setSession=async function($){if(n=$,n!==null){if(g=e.getRenderTarget(),n.addEventListener("select",K),n.addEventListener("selectstart",K),n.addEventListener("selectend",K),n.addEventListener("squeeze",K),n.addEventListener("squeezestart",K),n.addEventListener("squeezeend",K),n.addEventListener("end",C),n.addEventListener("inputsourceschange",U),x.xrCompatible!==!0&&await t.makeXRCompatible(),P=e.getPixelRatio(),e.getSize(E),b&&"createProjectionLayer"in XRWebGLBinding.prototype){let he=null,Ie=null,_e=null;x.depth&&(_e=x.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,he=x.stencil?Tr:or,Ie=x.stencil?Sr:cn);let $e={colorFormat:t.RGBA8,depthFormat:_e,scaleFactor:s};u=this.getBinding(),h=u.createProjectionLayer($e),n.updateRenderState({layers:[h]}),e.setPixelRatio(1),e.setSize(h.textureWidth,h.textureHeight,!1),v=new Si(h.textureWidth,h.textureHeight,{format:Qt,type:yi,depthTexture:new us(h.textureWidth,h.textureHeight,Ie,void 0,void 0,void 0,void 0,void 0,void 0,he),stencilBuffer:x.stencil,colorSpace:e.outputColorSpace,samples:x.antialias?4:0,resolveDepthBuffer:h.ignoreDepthValues===!1,resolveStencilBuffer:h.ignoreDepthValues===!1})}else{let he={antialias:x.antialias,alpha:!0,depth:x.depth,stencil:x.stencil,framebufferScaleFactor:s};m=new XRWebGLLayer(n,t,he),n.updateRenderState({baseLayer:m}),e.setPixelRatio(1),e.setSize(m.framebufferWidth,m.framebufferHeight,!1),v=new Si(m.framebufferWidth,m.framebufferHeight,{format:Qt,type:yi,colorSpace:e.outputColorSpace,stencilBuffer:x.stencil,resolveDepthBuffer:m.ignoreDepthValues===!1,resolveStencilBuffer:m.ignoreDepthValues===!1})}v.isXRRenderTarget=!0,this.setFoveation(l),c=null,a=await n.requestReferenceSpace(o),Xe.setContext(n),Xe.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(n!==null)return n.environmentBlendMode},this.getDepthTexture=function(){return p.getDepthTexture()};function U($){for(let Z=0;Z<$.removed.length;Z++){let he=$.removed[Z],Ie=A.indexOf(he);Ie>=0&&(A[Ie]=null,T[Ie].disconnect(he))}for(let Z=0;Z<$.added.length;Z++){let he=$.added[Z],Ie=A.indexOf(he);if(Ie===-1){for(let $e=0;$e<T.length;$e++)if($e>=A.length){A.push(he),Ie=$e;break}else if(A[$e]===null){A[$e]=he,Ie=$e;break}if(Ie===-1)break}let _e=T[Ie];_e&&_e.connect(he)}}let O=new L,z=new L;function Y($,Z,he){O.setFromMatrixPosition(Z.matrixWorld),z.setFromMatrixPosition(he.matrixWorld);let Ie=O.distanceTo(z),_e=Z.projectionMatrix.elements,$e=he.projectionMatrix.elements,Ot=_e[14]/(_e[10]-1),I=_e[14]/(_e[10]+1),ct=(_e[9]+1)/_e[5],Ne=(_e[9]-1)/_e[5],Ce=(_e[8]-1)/_e[0],ye=($e[8]+1)/$e[0],ut=Ot*Ce,be=Ot*ye,Ue=Ie/(-Ce+ye),kt=Ue*-Ce;if(Z.matrixWorld.decompose($.position,$.quaternion,$.scale),$.translateX(kt),$.translateZ(Ue),$.matrixWorld.compose($.position,$.quaternion,$.scale),$.matrixWorldInverse.copy($.matrixWorld).invert(),_e[10]===-1)$.projectionMatrix.copy(Z.projectionMatrix),$.projectionMatrixInverse.copy(Z.projectionMatrixInverse);else{let yt=Ot+Ue,k=I+Ue,w=ut-kt,H=be+(Ie-kt),X=ct*I/k*yt,Q=Ne*I/k*yt;$.projectionMatrix.makePerspective(w,H,X,Q,yt,k),$.projectionMatrixInverse.copy($.projectionMatrix).invert()}}function re($,Z){Z===null?$.matrixWorld.copy($.matrix):$.matrixWorld.multiplyMatrices(Z.matrixWorld,$.matrix),$.matrixWorldInverse.copy($.matrixWorld).invert()}this.updateCamera=function($){if(n===null)return;let Z=$.near,he=$.far;p.texture!==null&&(p.depthNear>0&&(Z=p.depthNear),p.depthFar>0&&(he=p.depthFar)),F.near=M.near=_.near=Z,F.far=M.far=_.far=he,(j!==F.near||W!==F.far)&&(n.updateRenderState({depthNear:F.near,depthFar:F.far}),j=F.near,W=F.far),F.layers.mask=$.layers.mask|6,_.layers.mask=F.layers.mask&3,M.layers.mask=F.layers.mask&5;let Ie=$.parent,_e=F.cameras;re(F,Ie);for(let $e=0;$e<_e.length;$e++)re(_e[$e],Ie);_e.length===2?Y(F,_,M):F.projectionMatrix.copy(_.projectionMatrix),Te($,F,Ie)};function Te($,Z,he){he===null?$.matrix.copy(Z.matrixWorld):($.matrix.copy(he.matrixWorld),$.matrix.invert(),$.matrix.multiply(Z.matrixWorld)),$.matrix.decompose($.position,$.quaternion,$.scale),$.updateMatrixWorld(!0),$.projectionMatrix.copy(Z.projectionMatrix),$.projectionMatrixInverse.copy(Z.projectionMatrixInverse),$.isPerspectiveCamera&&($.fov=Tn*2*Math.atan(1/$.projectionMatrix.elements[5]),$.zoom=1)}this.getCamera=function(){return F},this.getFoveation=function(){if(!(h===null&&m===null))return l},this.setFoveation=function($){l=$,h!==null&&(h.fixedFoveation=$),m!==null&&m.fixedFoveation!==void 0&&(m.fixedFoveation=$)},this.hasDepthSensing=function(){return p.texture!==null},this.getDepthSensingMesh=function(){return p.getMesh(F)},this.getCameraTexture=function($){return f[$]};let qe=null;function Le($,Z){if(d=Z.getViewerPose(c||a),y=Z,d!==null){let he=d.views;m!==null&&(e.setRenderTargetFramebuffer(v,m.framebuffer),e.setRenderTarget(v));let Ie=!1;he.length!==F.cameras.length&&(F.cameras.length=0,Ie=!0);for(let I=0;I<he.length;I++){let ct=he[I],Ne=null;if(m!==null)Ne=m.getViewport(ct);else{let ye=u.getViewSubImage(h,ct);Ne=ye.viewport,I===0&&(e.setRenderTargetTextures(v,ye.colorTexture,ye.depthStencilTexture),e.setRenderTarget(v))}let Ce=R[I];Ce===void 0&&(Ce=new xt,Ce.layers.enable(I),Ce.viewport=new Ye,R[I]=Ce),Ce.matrix.fromArray(ct.transform.matrix),Ce.matrix.decompose(Ce.position,Ce.quaternion,Ce.scale),Ce.projectionMatrix.fromArray(ct.projectionMatrix),Ce.projectionMatrixInverse.copy(Ce.projectionMatrix).invert(),Ce.viewport.set(Ne.x,Ne.y,Ne.width,Ne.height),I===0&&(F.matrix.copy(Ce.matrix),F.matrix.decompose(F.position,F.quaternion,F.scale)),Ie===!0&&F.cameras.push(Ce)}let _e=n.enabledFeatures;if(_e&&_e.includes("depth-sensing")&&n.depthUsage=="gpu-optimized"&&b){u=i.getBinding();let I=u.getDepthInformation(he[0]);I&&I.isValid&&I.texture&&p.init(I,n.renderState)}if(_e&&_e.includes("camera-access")&&b){e.state.unbindTexture(),u=i.getBinding();for(let I=0;I<he.length;I++){let ct=he[I].camera;if(ct){let Ne=f[ct];Ne||(Ne=new ds,f[ct]=Ne);let Ce=u.getCameraImage(ct);Ne.sourceTexture=Ce}}}}for(let he=0;he<T.length;he++){let Ie=A[he],_e=T[he];Ie!==null&&_e!==void 0&&_e.update(Ie,Z,c||a)}qe&&qe($,Z),Z.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:Z}),y=null}let Xe=new ph;Xe.setAnimationLoop(Le),this.setAnimationLoop=function($){qe=$},this.dispose=function(){}}},Bn=new ni,hv=new Be;function fv(r,e){function t(p,f){p.matrixAutoUpdate===!0&&p.updateMatrix(),f.value.copy(p.matrix)}function i(p,f){f.color.getRGB(p.fogColor.value,Hl(r)),f.isFog?(p.fogNear.value=f.near,p.fogFar.value=f.far):f.isFogExp2&&(p.fogDensity.value=f.density)}function n(p,f,x,g,v){f.isMeshBasicMaterial||f.isMeshLambertMaterial?s(p,f):f.isMeshToonMaterial?(s(p,f),u(p,f)):f.isMeshPhongMaterial?(s(p,f),d(p,f)):f.isMeshStandardMaterial?(s(p,f),h(p,f),f.isMeshPhysicalMaterial&&m(p,f,v)):f.isMeshMatcapMaterial?(s(p,f),y(p,f)):f.isMeshDepthMaterial?s(p,f):f.isMeshDistanceMaterial?(s(p,f),b(p,f)):f.isMeshNormalMaterial?s(p,f):f.isLineBasicMaterial?(a(p,f),f.isLineDashedMaterial&&o(p,f)):f.isPointsMaterial?l(p,f,x,g):f.isSpriteMaterial?c(p,f):f.isShadowMaterial?(p.color.value.copy(f.color),p.opacity.value=f.opacity):f.isShaderMaterial&&(f.uniformsNeedUpdate=!1)}function s(p,f){p.opacity.value=f.opacity,f.color&&p.diffuse.value.copy(f.color),f.emissive&&p.emissive.value.copy(f.emissive).multiplyScalar(f.emissiveIntensity),f.map&&(p.map.value=f.map,t(f.map,p.mapTransform)),f.alphaMap&&(p.alphaMap.value=f.alphaMap,t(f.alphaMap,p.alphaMapTransform)),f.bumpMap&&(p.bumpMap.value=f.bumpMap,t(f.bumpMap,p.bumpMapTransform),p.bumpScale.value=f.bumpScale,f.side===Vt&&(p.bumpScale.value*=-1)),f.normalMap&&(p.normalMap.value=f.normalMap,t(f.normalMap,p.normalMapTransform),p.normalScale.value.copy(f.normalScale),f.side===Vt&&p.normalScale.value.negate()),f.displacementMap&&(p.displacementMap.value=f.displacementMap,t(f.displacementMap,p.displacementMapTransform),p.displacementScale.value=f.displacementScale,p.displacementBias.value=f.displacementBias),f.emissiveMap&&(p.emissiveMap.value=f.emissiveMap,t(f.emissiveMap,p.emissiveMapTransform)),f.specularMap&&(p.specularMap.value=f.specularMap,t(f.specularMap,p.specularMapTransform)),f.alphaTest>0&&(p.alphaTest.value=f.alphaTest);let x=e.get(f),g=x.envMap,v=x.envMapRotation;g&&(p.envMap.value=g,Bn.copy(v),Bn.x*=-1,Bn.y*=-1,Bn.z*=-1,g.isCubeTexture&&g.isRenderTargetTexture===!1&&(Bn.y*=-1,Bn.z*=-1),p.envMapRotation.value.setFromMatrix4(hv.makeRotationFromEuler(Bn)),p.flipEnvMap.value=g.isCubeTexture&&g.isRenderTargetTexture===!1?-1:1,p.reflectivity.value=f.reflectivity,p.ior.value=f.ior,p.refractionRatio.value=f.refractionRatio),f.lightMap&&(p.lightMap.value=f.lightMap,p.lightMapIntensity.value=f.lightMapIntensity,t(f.lightMap,p.lightMapTransform)),f.aoMap&&(p.aoMap.value=f.aoMap,p.aoMapIntensity.value=f.aoMapIntensity,t(f.aoMap,p.aoMapTransform))}function a(p,f){p.diffuse.value.copy(f.color),p.opacity.value=f.opacity,f.map&&(p.map.value=f.map,t(f.map,p.mapTransform))}function o(p,f){p.dashSize.value=f.dashSize,p.totalSize.value=f.dashSize+f.gapSize,p.scale.value=f.scale}function l(p,f,x,g){p.diffuse.value.copy(f.color),p.opacity.value=f.opacity,p.size.value=f.size*x,p.scale.value=g*.5,f.map&&(p.map.value=f.map,t(f.map,p.uvTransform)),f.alphaMap&&(p.alphaMap.value=f.alphaMap,t(f.alphaMap,p.alphaMapTransform)),f.alphaTest>0&&(p.alphaTest.value=f.alphaTest)}function c(p,f){p.diffuse.value.copy(f.color),p.opacity.value=f.opacity,p.rotation.value=f.rotation,f.map&&(p.map.value=f.map,t(f.map,p.mapTransform)),f.alphaMap&&(p.alphaMap.value=f.alphaMap,t(f.alphaMap,p.alphaMapTransform)),f.alphaTest>0&&(p.alphaTest.value=f.alphaTest)}function d(p,f){p.specular.value.copy(f.specular),p.shininess.value=Math.max(f.shininess,1e-4)}function u(p,f){f.gradientMap&&(p.gradientMap.value=f.gradientMap)}function h(p,f){p.metalness.value=f.metalness,f.metalnessMap&&(p.metalnessMap.value=f.metalnessMap,t(f.metalnessMap,p.metalnessMapTransform)),p.roughness.value=f.roughness,f.roughnessMap&&(p.roughnessMap.value=f.roughnessMap,t(f.roughnessMap,p.roughnessMapTransform)),f.envMap&&(p.envMapIntensity.value=f.envMapIntensity)}function m(p,f,x){p.ior.value=f.ior,f.sheen>0&&(p.sheenColor.value.copy(f.sheenColor).multiplyScalar(f.sheen),p.sheenRoughness.value=f.sheenRoughness,f.sheenColorMap&&(p.sheenColorMap.value=f.sheenColorMap,t(f.sheenColorMap,p.sheenColorMapTransform)),f.sheenRoughnessMap&&(p.sheenRoughnessMap.value=f.sheenRoughnessMap,t(f.sheenRoughnessMap,p.sheenRoughnessMapTransform))),f.clearcoat>0&&(p.clearcoat.value=f.clearcoat,p.clearcoatRoughness.value=f.clearcoatRoughness,f.clearcoatMap&&(p.clearcoatMap.value=f.clearcoatMap,t(f.clearcoatMap,p.clearcoatMapTransform)),f.clearcoatRoughnessMap&&(p.clearcoatRoughnessMap.value=f.clearcoatRoughnessMap,t(f.clearcoatRoughnessMap,p.clearcoatRoughnessMapTransform)),f.clearcoatNormalMap&&(p.clearcoatNormalMap.value=f.clearcoatNormalMap,t(f.clearcoatNormalMap,p.clearcoatNormalMapTransform),p.clearcoatNormalScale.value.copy(f.clearcoatNormalScale),f.side===Vt&&p.clearcoatNormalScale.value.negate())),f.dispersion>0&&(p.dispersion.value=f.dispersion),f.iridescence>0&&(p.iridescence.value=f.iridescence,p.iridescenceIOR.value=f.iridescenceIOR,p.iridescenceThicknessMinimum.value=f.iridescenceThicknessRange[0],p.iridescenceThicknessMaximum.value=f.iridescenceThicknessRange[1],f.iridescenceMap&&(p.iridescenceMap.value=f.iridescenceMap,t(f.iridescenceMap,p.iridescenceMapTransform)),f.iridescenceThicknessMap&&(p.iridescenceThicknessMap.value=f.iridescenceThicknessMap,t(f.iridescenceThicknessMap,p.iridescenceThicknessMapTransform))),f.transmission>0&&(p.transmission.value=f.transmission,p.transmissionSamplerMap.value=x.texture,p.transmissionSamplerSize.value.set(x.width,x.height),f.transmissionMap&&(p.transmissionMap.value=f.transmissionMap,t(f.transmissionMap,p.transmissionMapTransform)),p.thickness.value=f.thickness,f.thicknessMap&&(p.thicknessMap.value=f.thicknessMap,t(f.thicknessMap,p.thicknessMapTransform)),p.attenuationDistance.value=f.attenuationDistance,p.attenuationColor.value.copy(f.attenuationColor)),f.anisotropy>0&&(p.anisotropyVector.value.set(f.anisotropy*Math.cos(f.anisotropyRotation),f.anisotropy*Math.sin(f.anisotropyRotation)),f.anisotropyMap&&(p.anisotropyMap.value=f.anisotropyMap,t(f.anisotropyMap,p.anisotropyMapTransform))),p.specularIntensity.value=f.specularIntensity,p.specularColor.value.copy(f.specularColor),f.specularColorMap&&(p.specularColorMap.value=f.specularColorMap,t(f.specularColorMap,p.specularColorMapTransform)),f.specularIntensityMap&&(p.specularIntensityMap.value=f.specularIntensityMap,t(f.specularIntensityMap,p.specularIntensityMapTransform))}function y(p,f){f.matcap&&(p.matcap.value=f.matcap)}function b(p,f){let x=e.get(f).light;p.referencePosition.value.setFromMatrixPosition(x.matrixWorld),p.nearDistance.value=x.shadow.camera.near,p.farDistance.value=x.shadow.camera.far}return{refreshFogUniforms:i,refreshMaterialUniforms:n}}function pv(r,e,t,i){let n={},s={},a=[],o=r.getParameter(r.MAX_UNIFORM_BUFFER_BINDINGS);function l(x,g){let v=g.program;i.uniformBlockBinding(x,v)}function c(x,g){let v=n[x.id];v===void 0&&(y(x),v=d(x),n[x.id]=v,x.addEventListener("dispose",p));let T=g.program;i.updateUBOMapping(x,T);let A=e.render.frame;s[x.id]!==A&&(h(x),s[x.id]=A)}function d(x){let g=u();x.__bindingPointIndex=g;let v=r.createBuffer(),T=x.__size,A=x.usage;return r.bindBuffer(r.UNIFORM_BUFFER,v),r.bufferData(r.UNIFORM_BUFFER,T,A),r.bindBuffer(r.UNIFORM_BUFFER,null),r.bindBufferBase(r.UNIFORM_BUFFER,g,v),v}function u(){for(let x=0;x<o;x++)if(a.indexOf(x)===-1)return a.push(x),x;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function h(x){let g=n[x.id],v=x.uniforms,T=x.__cache;r.bindBuffer(r.UNIFORM_BUFFER,g);for(let A=0,E=v.length;A<E;A++){let P=Array.isArray(v[A])?v[A]:[v[A]];for(let _=0,M=P.length;_<M;_++){let R=P[_];if(m(R,A,_,T)===!0){let F=R.__offset,j=Array.isArray(R.value)?R.value:[R.value],W=0;for(let K=0;K<j.length;K++){let C=j[K],U=b(C);typeof C=="number"||typeof C=="boolean"?(R.__data[0]=C,r.bufferSubData(r.UNIFORM_BUFFER,F+W,R.__data)):C.isMatrix3?(R.__data[0]=C.elements[0],R.__data[1]=C.elements[1],R.__data[2]=C.elements[2],R.__data[3]=0,R.__data[4]=C.elements[3],R.__data[5]=C.elements[4],R.__data[6]=C.elements[5],R.__data[7]=0,R.__data[8]=C.elements[6],R.__data[9]=C.elements[7],R.__data[10]=C.elements[8],R.__data[11]=0):(C.toArray(R.__data,W),W+=U.storage/Float32Array.BYTES_PER_ELEMENT)}r.bufferSubData(r.UNIFORM_BUFFER,F,R.__data)}}}r.bindBuffer(r.UNIFORM_BUFFER,null)}function m(x,g,v,T){let A=x.value,E=g+"_"+v;if(T[E]===void 0)return typeof A=="number"||typeof A=="boolean"?T[E]=A:T[E]=A.clone(),!0;{let P=T[E];if(typeof A=="number"||typeof A=="boolean"){if(P!==A)return T[E]=A,!0}else if(P.equals(A)===!1)return P.copy(A),!0}return!1}function y(x){let g=x.uniforms,v=0,T=16;for(let E=0,P=g.length;E<P;E++){let _=Array.isArray(g[E])?g[E]:[g[E]];for(let M=0,R=_.length;M<R;M++){let F=_[M],j=Array.isArray(F.value)?F.value:[F.value];for(let W=0,K=j.length;W<K;W++){let C=j[W],U=b(C),O=v%T,z=O%U.boundary,Y=O+z;v+=z,Y!==0&&T-Y<U.storage&&(v+=T-Y),F.__data=new Float32Array(U.storage/Float32Array.BYTES_PER_ELEMENT),F.__offset=v,v+=U.storage}}}let A=v%T;return A>0&&(v+=T-A),x.__size=v,x.__cache={},this}function b(x){let g={boundary:0,storage:0};return typeof x=="number"||typeof x=="boolean"?(g.boundary=4,g.storage=4):x.isVector2?(g.boundary=8,g.storage=8):x.isVector3||x.isColor?(g.boundary=16,g.storage=12):x.isVector4?(g.boundary=16,g.storage=16):x.isMatrix3?(g.boundary=48,g.storage=48):x.isMatrix4?(g.boundary=64,g.storage=64):x.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",x),g}function p(x){let g=x.target;g.removeEventListener("dispose",p);let v=a.indexOf(g.__bindingPointIndex);a.splice(v,1),r.deleteBuffer(n[g.id]),delete n[g.id],delete s[g.id]}function f(){for(let x in n)r.deleteBuffer(n[x]);a=[],n={},s={}}return{bind:l,update:c,dispose:f}}var ko=class{constructor(e={}){let{canvas:t=Ud(),context:i=null,depth:n=!0,stencil:s=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:d="default",failIfMajorPerformanceCaveat:u=!1,reversedDepthBuffer:h=!1}=e;this.isWebGLRenderer=!0;let m;if(i!==null){if(typeof WebGLRenderingContext<"u"&&i instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");m=i.getContextAttributes().alpha}else m=a;let y=new Uint32Array(4),b=new Int32Array(4),p=null,f=null,x=[],g=[];this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=Ki,this.toneMappingExposure=1,this.transmissionResolutionScale=1;let v=this,T=!1;this._outputColorSpace=ft;let A=0,E=0,P=null,_=-1,M=null,R=new Ye,F=new Ye,j=null,W=new Me(0),K=0,C=t.width,U=t.height,O=1,z=null,Y=null,re=new Ye(0,0,C,U),Te=new Ye(0,0,C,U),qe=!1,Le=new yr,Xe=!1,$=!1,Z=new Be,he=new L,Ie=new Ye,_e={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0},$e=!1;function Ot(){return P===null?O:1}let I=i;function ct(S,D){return t.getContext(S,D)}try{let S={alpha:!0,depth:n,stencil:s,antialias:o,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:d,failIfMajorPerformanceCaveat:u};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${"180"}`),t.addEventListener("webglcontextlost",ae,!1),t.addEventListener("webglcontextrestored",fe,!1),t.addEventListener("webglcontextcreationerror",ee,!1),I===null){let D="webgl2";if(I=ct(D,S),I===null)throw ct(D)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(S){throw console.error("THREE.WebGLRenderer: "+S.message),S}let Ne,Ce,ye,ut,be,Ue,kt,yt,k,w,H,X,Q,q,we,se,ve,ge,ie,ue,Ee,xe,le,De;function N(){Ne=new Py(I),Ne.init(),xe=new cv(I,Ne),Ce=new Ty(I,Ne,e,xe),ye=new ov(I,Ne),Ce.reversedDepthBuffer&&h&&ye.buffers.depth.setReversed(!0),ut=new Ny(I),be=new Xb,Ue=new lv(I,Ne,ye,be,Ce,xe,ut),kt=new ky(v),yt=new Iy(v),k=new Hp(I),le=new _y(I,k),w=new Oy(I,k,ut,le),H=new Dy(I,w,k,ut),ie=new Fy(I,Ce,Ue),se=new Ay(be),X=new $b(v,kt,yt,Ne,Ce,le,se),Q=new fv(v,be),q=new Yb,we=new iv(Ne),ge=new My(v,kt,yt,ye,H,m,l),ve=new sv(v,H,Ce),De=new pv(I,ut,Ce,ye),ue=new Sy(I,Ne,ut),Ee=new Ly(I,Ne,ut),ut.programs=X.programs,v.capabilities=Ce,v.extensions=Ne,v.properties=be,v.renderLists=q,v.shadowMap=ve,v.state=ye,v.info=ut}N();let ne=new rc(v,I);this.xr=ne,this.getContext=function(){return I},this.getContextAttributes=function(){return I.getContextAttributes()},this.forceContextLoss=function(){let S=Ne.get("WEBGL_lose_context");S&&S.loseContext()},this.forceContextRestore=function(){let S=Ne.get("WEBGL_lose_context");S&&S.restoreContext()},this.getPixelRatio=function(){return O},this.setPixelRatio=function(S){S!==void 0&&(O=S,this.setSize(C,U,!1))},this.getSize=function(S){return S.set(C,U)},this.setSize=function(S,D,G=!0){if(ne.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}C=S,U=D,t.width=Math.floor(S*O),t.height=Math.floor(D*O),G===!0&&(t.style.width=S+"px",t.style.height=D+"px"),this.setViewport(0,0,S,D)},this.getDrawingBufferSize=function(S){return S.set(C*O,U*O).floor()},this.setDrawingBufferSize=function(S,D,G){C=S,U=D,O=G,t.width=Math.floor(S*G),t.height=Math.floor(D*G),this.setViewport(0,0,S,D)},this.getCurrentViewport=function(S){return S.copy(R)},this.getViewport=function(S){return S.copy(re)},this.setViewport=function(S,D,G,V){S.isVector4?re.set(S.x,S.y,S.z,S.w):re.set(S,D,G,V),ye.viewport(R.copy(re).multiplyScalar(O).round())},this.getScissor=function(S){return S.copy(Te)},this.setScissor=function(S,D,G,V){S.isVector4?Te.set(S.x,S.y,S.z,S.w):Te.set(S,D,G,V),ye.scissor(F.copy(Te).multiplyScalar(O).round())},this.getScissorTest=function(){return qe},this.setScissorTest=function(S){ye.setScissorTest(qe=S)},this.setOpaqueSort=function(S){z=S},this.setTransparentSort=function(S){Y=S},this.getClearColor=function(S){return S.copy(ge.getClearColor())},this.setClearColor=function(){ge.setClearColor(...arguments)},this.getClearAlpha=function(){return ge.getClearAlpha()},this.setClearAlpha=function(){ge.setClearAlpha(...arguments)},this.clear=function(S=!0,D=!0,G=!0){let V=0;if(S){let B=!1;if(P!==null){let te=P.texture.format;B=te===Ga||te===ja||te===Ha}if(B){let te=P.texture.type,ce=te===yi||te===cn||te===Mr||te===Sr||te===Ba||te===Ua,pe=ge.getClearColor(),de=ge.getClearAlpha(),ke=pe.r,Re=pe.g,Se=pe.b;ce?(y[0]=ke,y[1]=Re,y[2]=Se,y[3]=de,I.clearBufferuiv(I.COLOR,0,y)):(b[0]=ke,b[1]=Re,b[2]=Se,b[3]=de,I.clearBufferiv(I.COLOR,0,b))}else V|=I.COLOR_BUFFER_BIT}D&&(V|=I.DEPTH_BUFFER_BIT),G&&(V|=I.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),I.clear(V)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){t.removeEventListener("webglcontextlost",ae,!1),t.removeEventListener("webglcontextrestored",fe,!1),t.removeEventListener("webglcontextcreationerror",ee,!1),ge.dispose(),q.dispose(),we.dispose(),be.dispose(),kt.dispose(),yt.dispose(),H.dispose(),le.dispose(),De.dispose(),X.dispose(),ne.dispose(),ne.removeEventListener("sessionstart",bi),ne.removeEventListener("sessionend",Uc),dn.stop()};function ae(S){S.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),T=!0}function fe(){console.log("THREE.WebGLRenderer: Context Restored."),T=!1;let S=ut.autoReset,D=ve.enabled,G=ve.autoUpdate,V=ve.needsUpdate,B=ve.type;N(),ut.autoReset=S,ve.enabled=D,ve.autoUpdate=G,ve.needsUpdate=V,ve.type=B}function ee(S){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",S.statusMessage)}function J(S){let D=S.target;D.removeEventListener("dispose",J),me(D)}function me(S){Pe(S),be.remove(S)}function Pe(S){let D=be.get(S).programs;D!==void 0&&(D.forEach(function(G){X.releaseProgram(G)}),S.isShaderMaterial&&X.releaseShaderCache(S))}this.renderBufferDirect=function(S,D,G,V,B,te){D===null&&(D=_e);let ce=B.isMesh&&B.matrixWorld.determinant()<0,pe=Oh(S,D,G,V,B);ye.setMaterial(V,ce);let de=G.index,ke=1;if(V.wireframe===!0){if(de=w.getWireframeAttribute(G),de===void 0)return;ke=2}let Re=G.drawRange,Se=G.attributes.position,Ge=Re.start*ke,et=(Re.start+Re.count)*ke;te!==null&&(Ge=Math.max(Ge,te.start*ke),et=Math.min(et,(te.start+te.count)*ke)),de!==null?(Ge=Math.max(Ge,0),et=Math.min(et,de.count)):Se!=null&&(Ge=Math.max(Ge,0),et=Math.min(et,Se.count));let mt=et-Ge;if(mt<0||mt===1/0)return;le.setup(B,V,pe,G,de);let lt,st=ue;if(de!==null&&(lt=k.get(de),st=Ee,st.setIndex(lt)),B.isMesh)V.wireframe===!0?(ye.setLineWidth(V.wireframeLinewidth*Ot()),st.setMode(I.LINES)):st.setMode(I.TRIANGLES);else if(B.isLine){let Ae=V.linewidth;Ae===void 0&&(Ae=1),ye.setLineWidth(Ae*Ot()),B.isLineSegments?st.setMode(I.LINES):B.isLineLoop?st.setMode(I.LINE_LOOP):st.setMode(I.LINE_STRIP)}else B.isPoints?st.setMode(I.POINTS):B.isSprite&&st.setMode(I.TRIANGLES);if(B.isBatchedMesh)if(B._multiDrawInstances!==null)ur("THREE.WebGLRenderer: renderMultiDrawInstances has been deprecated and will be removed in r184. Append to renderMultiDraw arguments and use indirection."),st.renderMultiDrawInstances(B._multiDrawStarts,B._multiDrawCounts,B._multiDrawCount,B._multiDrawInstances);else if(Ne.get("WEBGL_multi_draw"))st.renderMultiDraw(B._multiDrawStarts,B._multiDrawCounts,B._multiDrawCount);else{let Ae=B._multiDrawStarts,dt=B._multiDrawCounts,Ke=B._multiDrawCount,Kt=de?k.get(de).bytesPerElement:1,jn=be.get(V).currentProgram.getUniforms();for(let Yt=0;Yt<Ke;Yt++)jn.setValue(I,"_gl_DrawID",Yt),st.render(Ae[Yt]/Kt,dt[Yt])}else if(B.isInstancedMesh)st.renderInstances(Ge,mt,B.count);else if(G.isInstancedBufferGeometry){let Ae=G._maxInstanceCount!==void 0?G._maxInstanceCount:1/0,dt=Math.min(G.instanceCount,Ae);st.renderInstances(Ge,mt,dt)}else st.render(Ge,mt)};function at(S,D,G){S.transparent===!0&&S.side===bt&&S.forceSinglePass===!1?(S.side=Vt,S.needsUpdate=!0,Os(S,D,G),S.side=fi,S.needsUpdate=!0,Os(S,D,G),S.side=bt):Os(S,D,G)}this.compile=function(S,D,G=null){G===null&&(G=S),f=we.get(G),f.init(D),g.push(f),G.traverseVisible(function(B){B.isLight&&B.layers.test(D.layers)&&(f.pushLight(B),B.castShadow&&f.pushShadow(B))}),S!==G&&S.traverseVisible(function(B){B.isLight&&B.layers.test(D.layers)&&(f.pushLight(B),B.castShadow&&f.pushShadow(B))}),f.setupLights();let V=new Set;return S.traverse(function(B){if(!(B.isMesh||B.isPoints||B.isLine||B.isSprite))return;let te=B.material;if(te)if(Array.isArray(te))for(let ce=0;ce<te.length;ce++){let pe=te[ce];at(pe,G,B),V.add(pe)}else at(te,G,B),V.add(te)}),f=g.pop(),V},this.compileAsync=function(S,D,G=null){let V=this.compile(S,D,G);return new Promise(B=>{function te(){if(V.forEach(function(ce){be.get(ce).currentProgram.isReady()&&V.delete(ce)}),V.size===0){B(S);return}setTimeout(te,10)}Ne.get("KHR_parallel_shader_compile")!==null?te():setTimeout(te,10)})};let Je=null;function Ni(S){Je&&Je(S)}function bi(){dn.stop()}function Uc(){dn.start()}let dn=new ph;dn.setAnimationLoop(Ni),typeof self<"u"&&dn.setContext(self),this.setAnimationLoop=function(S){Je=S,ne.setAnimationLoop(S),S===null?dn.stop():dn.start()},ne.addEventListener("sessionstart",bi),ne.addEventListener("sessionend",Uc),this.render=function(S,D){if(D!==void 0&&D.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(T===!0)return;if(S.matrixWorldAutoUpdate===!0&&S.updateMatrixWorld(),D.parent===null&&D.matrixWorldAutoUpdate===!0&&D.updateMatrixWorld(),ne.enabled===!0&&ne.isPresenting===!0&&(ne.cameraAutoUpdate===!0&&ne.updateCamera(D),D=ne.getCamera()),S.isScene===!0&&S.onBeforeRender(v,S,D,P),f=we.get(S,g.length),f.init(D),g.push(f),Z.multiplyMatrices(D.projectionMatrix,D.matrixWorldInverse),Le.setFromProjectionMatrix(Z,di,D.reversedDepth),$=this.localClippingEnabled,Xe=se.init(this.clippingPlanes,$),p=q.get(S,x.length),p.init(),x.push(p),ne.enabled===!0&&ne.isPresenting===!0){let te=v.xr.getDepthSensingMesh();te!==null&&Lo(te,D,-1/0,v.sortObjects)}Lo(S,D,0,v.sortObjects),p.finish(),v.sortObjects===!0&&p.sort(z,Y),$e=ne.enabled===!1||ne.isPresenting===!1||ne.hasDepthSensing()===!1,$e&&ge.addToRenderList(p,S),this.info.render.frame++,Xe===!0&&se.beginShadows();let G=f.state.shadowsArray;ve.render(G,S,D),Xe===!0&&se.endShadows(),this.info.autoReset===!0&&this.info.reset();let V=p.opaque,B=p.transmissive;if(f.setupLights(),D.isArrayCamera){let te=D.cameras;if(B.length>0)for(let ce=0,pe=te.length;ce<pe;ce++){let de=te[ce];Hc(V,B,S,de)}$e&&ge.render(S);for(let ce=0,pe=te.length;ce<pe;ce++){let de=te[ce];zc(p,S,de,de.viewport)}}else B.length>0&&Hc(V,B,S,D),$e&&ge.render(S),zc(p,S,D);P!==null&&E===0&&(Ue.updateMultisampleRenderTarget(P),Ue.updateRenderTargetMipmap(P)),S.isScene===!0&&S.onAfterRender(v,S,D),le.resetDefaultState(),_=-1,M=null,g.pop(),g.length>0?(f=g[g.length-1],Xe===!0&&se.setGlobalState(v.clippingPlanes,f.state.camera)):f=null,x.pop(),x.length>0?p=x[x.length-1]:p=null};function Lo(S,D,G,V){if(S.visible===!1)return;if(S.layers.test(D.layers)){if(S.isGroup)G=S.renderOrder;else if(S.isLOD)S.autoUpdate===!0&&S.update(D);else if(S.isLight)f.pushLight(S),S.castShadow&&f.pushShadow(S);else if(S.isSprite){if(!S.frustumCulled||Le.intersectsSprite(S)){V&&Ie.setFromMatrixPosition(S.matrixWorld).applyMatrix4(Z);let ce=H.update(S),pe=S.material;pe.visible&&p.push(S,ce,pe,G,Ie.z,null)}}else if((S.isMesh||S.isLine||S.isPoints)&&(!S.frustumCulled||Le.intersectsObject(S))){let ce=H.update(S),pe=S.material;if(V&&(S.boundingSphere!==void 0?(S.boundingSphere===null&&S.computeBoundingSphere(),Ie.copy(S.boundingSphere.center)):(ce.boundingSphere===null&&ce.computeBoundingSphere(),Ie.copy(ce.boundingSphere.center)),Ie.applyMatrix4(S.matrixWorld).applyMatrix4(Z)),Array.isArray(pe)){let de=ce.groups;for(let ke=0,Re=de.length;ke<Re;ke++){let Se=de[ke],Ge=pe[Se.materialIndex];Ge&&Ge.visible&&p.push(S,ce,Ge,G,Ie.z,Se)}}else pe.visible&&p.push(S,ce,pe,G,Ie.z,null)}}let te=S.children;for(let ce=0,pe=te.length;ce<pe;ce++)Lo(te[ce],D,G,V)}function zc(S,D,G,V){let B=S.opaque,te=S.transmissive,ce=S.transparent;f.setupLightsView(G),Xe===!0&&se.setGlobalState(v.clippingPlanes,G),V&&ye.viewport(R.copy(V)),B.length>0&&Ps(B,D,G),te.length>0&&Ps(te,D,G),ce.length>0&&Ps(ce,D,G),ye.buffers.depth.setTest(!0),ye.buffers.depth.setMask(!0),ye.buffers.color.setMask(!0),ye.setPolygonOffset(!1)}function Hc(S,D,G,V){if((G.isScene===!0?G.overrideMaterial:null)!==null)return;f.state.transmissionRenderTarget[V.id]===void 0&&(f.state.transmissionRenderTarget[V.id]=new Si(1,1,{generateMipmaps:!0,type:Ne.has("EXT_color_buffer_half_float")||Ne.has("EXT_color_buffer_float")?_r:yi,minFilter:mi,samples:4,stencilBuffer:s,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:Ve.workingColorSpace}));let te=f.state.transmissionRenderTarget[V.id],ce=V.viewport||R;te.setSize(ce.z*v.transmissionResolutionScale,ce.w*v.transmissionResolutionScale);let pe=v.getRenderTarget(),de=v.getActiveCubeFace(),ke=v.getActiveMipmapLevel();v.setRenderTarget(te),v.getClearColor(W),K=v.getClearAlpha(),K<1&&v.setClearColor(16777215,.5),v.clear(),$e&&ge.render(G);let Re=v.toneMapping;v.toneMapping=Ki;let Se=V.viewport;if(V.viewport!==void 0&&(V.viewport=void 0),f.setupLightsView(V),Xe===!0&&se.setGlobalState(v.clippingPlanes,V),Ps(S,G,V),Ue.updateMultisampleRenderTarget(te),Ue.updateRenderTargetMipmap(te),Ne.has("WEBGL_multisampled_render_to_texture")===!1){let Ge=!1;for(let et=0,mt=D.length;et<mt;et++){let lt=D[et],st=lt.object,Ae=lt.geometry,dt=lt.material,Ke=lt.group;if(dt.side===bt&&st.layers.test(V.layers)){let Kt=dt.side;dt.side=Vt,dt.needsUpdate=!0,jc(st,G,V,Ae,dt,Ke),dt.side=Kt,dt.needsUpdate=!0,Ge=!0}}Ge===!0&&(Ue.updateMultisampleRenderTarget(te),Ue.updateRenderTargetMipmap(te))}v.setRenderTarget(pe,de,ke),v.setClearColor(W,K),Se!==void 0&&(V.viewport=Se),v.toneMapping=Re}function Ps(S,D,G){let V=D.isScene===!0?D.overrideMaterial:null;for(let B=0,te=S.length;B<te;B++){let ce=S[B],pe=ce.object,de=ce.geometry,ke=ce.group,Re=ce.material;Re.allowOverride===!0&&V!==null&&(Re=V),pe.layers.test(G.layers)&&jc(pe,D,G,de,Re,ke)}}function jc(S,D,G,V,B,te){S.onBeforeRender(v,D,G,V,B,te),S.modelViewMatrix.multiplyMatrices(G.matrixWorldInverse,S.matrixWorld),S.normalMatrix.getNormalMatrix(S.modelViewMatrix),B.onBeforeRender(v,D,G,V,S,te),B.transparent===!0&&B.side===bt&&B.forceSinglePass===!1?(B.side=Vt,B.needsUpdate=!0,v.renderBufferDirect(G,D,V,B,S,te),B.side=fi,B.needsUpdate=!0,v.renderBufferDirect(G,D,V,B,S,te),B.side=bt):v.renderBufferDirect(G,D,V,B,S,te),S.onAfterRender(v,D,G,V,B,te)}function Os(S,D,G){D.isScene!==!0&&(D=_e);let V=be.get(S),B=f.state.lights,te=f.state.shadowsArray,ce=B.state.version,pe=X.getParameters(S,B.state,te,D,G),de=X.getProgramCacheKey(pe),ke=V.programs;V.environment=S.isMeshStandardMaterial?D.environment:null,V.fog=D.fog,V.envMap=(S.isMeshStandardMaterial?yt:kt).get(S.envMap||V.environment),V.envMapRotation=V.environment!==null&&S.envMap===null?D.environmentRotation:S.envMapRotation,ke===void 0&&(S.addEventListener("dispose",J),ke=new Map,V.programs=ke);let Re=ke.get(de);if(Re!==void 0){if(V.currentProgram===Re&&V.lightsStateVersion===ce)return Vc(S,pe),Re}else pe.uniforms=X.getUniforms(S),S.onBeforeCompile(pe,v),Re=X.acquireProgram(pe,de),ke.set(de,Re),V.uniforms=pe.uniforms;let Se=V.uniforms;return(!S.isShaderMaterial&&!S.isRawShaderMaterial||S.clipping===!0)&&(Se.clippingPlanes=se.uniform),Vc(S,pe),V.needsLights=Nh(S),V.lightsStateVersion=ce,V.needsLights&&(Se.ambientLightColor.value=B.state.ambient,Se.lightProbe.value=B.state.probe,Se.directionalLights.value=B.state.directional,Se.directionalLightShadows.value=B.state.directionalShadow,Se.spotLights.value=B.state.spot,Se.spotLightShadows.value=B.state.spotShadow,Se.rectAreaLights.value=B.state.rectArea,Se.ltc_1.value=B.state.rectAreaLTC1,Se.ltc_2.value=B.state.rectAreaLTC2,Se.pointLights.value=B.state.point,Se.pointLightShadows.value=B.state.pointShadow,Se.hemisphereLights.value=B.state.hemi,Se.directionalShadowMap.value=B.state.directionalShadowMap,Se.directionalShadowMatrix.value=B.state.directionalShadowMatrix,Se.spotShadowMap.value=B.state.spotShadowMap,Se.spotLightMatrix.value=B.state.spotLightMatrix,Se.spotLightMap.value=B.state.spotLightMap,Se.pointShadowMap.value=B.state.pointShadowMap,Se.pointShadowMatrix.value=B.state.pointShadowMatrix),V.currentProgram=Re,V.uniformsList=null,Re}function Gc(S){if(S.uniformsList===null){let D=S.currentProgram.getUniforms();S.uniformsList=Cr.seqWithValue(D.seq,S.uniforms)}return S.uniformsList}function Vc(S,D){let G=be.get(S);G.outputColorSpace=D.outputColorSpace,G.batching=D.batching,G.batchingColor=D.batchingColor,G.instancing=D.instancing,G.instancingColor=D.instancingColor,G.instancingMorph=D.instancingMorph,G.skinning=D.skinning,G.morphTargets=D.morphTargets,G.morphNormals=D.morphNormals,G.morphColors=D.morphColors,G.morphTargetsCount=D.morphTargetsCount,G.numClippingPlanes=D.numClippingPlanes,G.numIntersection=D.numClipIntersection,G.vertexAlphas=D.vertexAlphas,G.vertexTangents=D.vertexTangents,G.toneMapping=D.toneMapping}function Oh(S,D,G,V,B){D.isScene!==!0&&(D=_e),Ue.resetTextureUnits();let te=D.fog,ce=V.isMeshStandardMaterial?D.environment:null,pe=P===null?v.outputColorSpace:P.isXRRenderTarget===!0?P.texture.colorSpace:_t,de=(V.isMeshStandardMaterial?yt:kt).get(V.envMap||ce),ke=V.vertexColors===!0&&!!G.attributes.color&&G.attributes.color.itemSize===4,Re=!!G.attributes.tangent&&(!!V.normalMap||V.anisotropy>0),Se=!!G.morphAttributes.position,Ge=!!G.morphAttributes.normal,et=!!G.morphAttributes.color,mt=Ki;V.toneMapped&&(P===null||P.isXRRenderTarget===!0)&&(mt=v.toneMapping);let lt=G.morphAttributes.position||G.morphAttributes.normal||G.morphAttributes.color,st=lt!==void 0?lt.length:0,Ae=be.get(V),dt=f.state.lights;if(Xe===!0&&($===!0||S!==M)){let Dt=S===M&&V.id===_;se.setState(V,S,Dt)}let Ke=!1;V.version===Ae.__version?(Ae.needsLights&&Ae.lightsStateVersion!==dt.state.version||Ae.outputColorSpace!==pe||B.isBatchedMesh&&Ae.batching===!1||!B.isBatchedMesh&&Ae.batching===!0||B.isBatchedMesh&&Ae.batchingColor===!0&&B.colorTexture===null||B.isBatchedMesh&&Ae.batchingColor===!1&&B.colorTexture!==null||B.isInstancedMesh&&Ae.instancing===!1||!B.isInstancedMesh&&Ae.instancing===!0||B.isSkinnedMesh&&Ae.skinning===!1||!B.isSkinnedMesh&&Ae.skinning===!0||B.isInstancedMesh&&Ae.instancingColor===!0&&B.instanceColor===null||B.isInstancedMesh&&Ae.instancingColor===!1&&B.instanceColor!==null||B.isInstancedMesh&&Ae.instancingMorph===!0&&B.morphTexture===null||B.isInstancedMesh&&Ae.instancingMorph===!1&&B.morphTexture!==null||Ae.envMap!==de||V.fog===!0&&Ae.fog!==te||Ae.numClippingPlanes!==void 0&&(Ae.numClippingPlanes!==se.numPlanes||Ae.numIntersection!==se.numIntersection)||Ae.vertexAlphas!==ke||Ae.vertexTangents!==Re||Ae.morphTargets!==Se||Ae.morphNormals!==Ge||Ae.morphColors!==et||Ae.toneMapping!==mt||Ae.morphTargetsCount!==st)&&(Ke=!0):(Ke=!0,Ae.__version=V.version);let Kt=Ae.currentProgram;Ke===!0&&(Kt=Os(V,D,B));let jn=!1,Yt=!1,Or=!1,ht=Kt.getUniforms(),ei=Ae.uniforms;if(ye.useProgram(Kt.program)&&(jn=!0,Yt=!0,Or=!0),V.id!==_&&(_=V.id,Yt=!0),jn||M!==S){ye.buffers.depth.getReversed()&&S.reversedDepth!==!0&&(S._reversedDepth=!0,S.updateProjectionMatrix()),ht.setValue(I,"projectionMatrix",S.projectionMatrix),ht.setValue(I,"viewMatrix",S.matrixWorldInverse);let Wt=ht.map.cameraPosition;Wt!==void 0&&Wt.setValue(I,he.setFromMatrixPosition(S.matrixWorld)),Ce.logarithmicDepthBuffer&&ht.setValue(I,"logDepthBufFC",2/(Math.log(S.far+1)/Math.LN2)),(V.isMeshPhongMaterial||V.isMeshToonMaterial||V.isMeshLambertMaterial||V.isMeshBasicMaterial||V.isMeshStandardMaterial||V.isShaderMaterial)&&ht.setValue(I,"isOrthographic",S.isOrthographicCamera===!0),M!==S&&(M=S,Yt=!0,Or=!0)}if(B.isSkinnedMesh){ht.setOptional(I,B,"bindMatrix"),ht.setOptional(I,B,"bindMatrixInverse");let Dt=B.skeleton;Dt&&(Dt.boneTexture===null&&Dt.computeBoneTexture(),ht.setValue(I,"boneTexture",Dt.boneTexture,Ue))}B.isBatchedMesh&&(ht.setOptional(I,B,"batchingTexture"),ht.setValue(I,"batchingTexture",B._matricesTexture,Ue),ht.setOptional(I,B,"batchingIdTexture"),ht.setValue(I,"batchingIdTexture",B._indirectTexture,Ue),ht.setOptional(I,B,"batchingColorTexture"),B._colorsTexture!==null&&ht.setValue(I,"batchingColorTexture",B._colorsTexture,Ue));let ti=G.morphAttributes;if((ti.position!==void 0||ti.normal!==void 0||ti.color!==void 0)&&ie.update(B,G,Kt),(Yt||Ae.receiveShadow!==B.receiveShadow)&&(Ae.receiveShadow=B.receiveShadow,ht.setValue(I,"receiveShadow",B.receiveShadow)),V.isMeshGouraudMaterial&&V.envMap!==null&&(ei.envMap.value=de,ei.flipEnvMap.value=de.isCubeTexture&&de.isRenderTargetTexture===!1?-1:1),V.isMeshStandardMaterial&&V.envMap===null&&D.environment!==null&&(ei.envMapIntensity.value=D.environmentIntensity),Yt&&(ht.setValue(I,"toneMappingExposure",v.toneMappingExposure),Ae.needsLights&&Lh(ei,Or),te&&V.fog===!0&&Q.refreshFogUniforms(ei,te),Q.refreshMaterialUniforms(ei,V,O,U,f.state.transmissionRenderTarget[S.id]),Cr.upload(I,Gc(Ae),ei,Ue)),V.isShaderMaterial&&V.uniformsNeedUpdate===!0&&(Cr.upload(I,Gc(Ae),ei,Ue),V.uniformsNeedUpdate=!1),V.isSpriteMaterial&&ht.setValue(I,"center",B.center),ht.setValue(I,"modelViewMatrix",B.modelViewMatrix),ht.setValue(I,"normalMatrix",B.normalMatrix),ht.setValue(I,"modelMatrix",B.matrixWorld),V.isShaderMaterial||V.isRawShaderMaterial){let Dt=V.uniformsGroups;for(let Wt=0,No=Dt.length;Wt<No;Wt++){let hn=Dt[Wt];De.update(hn,Kt),De.bind(hn,Kt)}}return Kt}function Lh(S,D){S.ambientLightColor.needsUpdate=D,S.lightProbe.needsUpdate=D,S.directionalLights.needsUpdate=D,S.directionalLightShadows.needsUpdate=D,S.pointLights.needsUpdate=D,S.pointLightShadows.needsUpdate=D,S.spotLights.needsUpdate=D,S.spotLightShadows.needsUpdate=D,S.rectAreaLights.needsUpdate=D,S.hemisphereLights.needsUpdate=D}function Nh(S){return S.isMeshLambertMaterial||S.isMeshToonMaterial||S.isMeshPhongMaterial||S.isMeshStandardMaterial||S.isShadowMaterial||S.isShaderMaterial&&S.lights===!0}this.getActiveCubeFace=function(){return A},this.getActiveMipmapLevel=function(){return E},this.getRenderTarget=function(){return P},this.setRenderTargetTextures=function(S,D,G){let V=be.get(S);V.__autoAllocateDepthBuffer=S.resolveDepthBuffer===!1,V.__autoAllocateDepthBuffer===!1&&(V.__useRenderToTexture=!1),be.get(S.texture).__webglTexture=D,be.get(S.depthTexture).__webglTexture=V.__autoAllocateDepthBuffer?void 0:G,V.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(S,D){let G=be.get(S);G.__webglFramebuffer=D,G.__useDefaultFramebuffer=D===void 0};let Fh=I.createFramebuffer();this.setRenderTarget=function(S,D=0,G=0){P=S,A=D,E=G;let V=!0,B=null,te=!1,ce=!1;if(S){let de=be.get(S);if(de.__useDefaultFramebuffer!==void 0)ye.bindFramebuffer(I.FRAMEBUFFER,null),V=!1;else if(de.__webglFramebuffer===void 0)Ue.setupRenderTarget(S);else if(de.__hasExternalTextures)Ue.rebindTextures(S,be.get(S.texture).__webglTexture,be.get(S.depthTexture).__webglTexture);else if(S.depthBuffer){let Se=S.depthTexture;if(de.__boundDepthTexture!==Se){if(Se!==null&&be.has(Se)&&(S.width!==Se.image.width||S.height!==Se.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");Ue.setupDepthRenderbuffer(S)}}let ke=S.texture;(ke.isData3DTexture||ke.isDataArrayTexture||ke.isCompressedArrayTexture)&&(ce=!0);let Re=be.get(S).__webglFramebuffer;S.isWebGLCubeRenderTarget?(Array.isArray(Re[D])?B=Re[D][G]:B=Re[D],te=!0):S.samples>0&&Ue.useMultisampledRTT(S)===!1?B=be.get(S).__webglMultisampledFramebuffer:Array.isArray(Re)?B=Re[G]:B=Re,R.copy(S.viewport),F.copy(S.scissor),j=S.scissorTest}else R.copy(re).multiplyScalar(O).floor(),F.copy(Te).multiplyScalar(O).floor(),j=qe;if(G!==0&&(B=Fh),ye.bindFramebuffer(I.FRAMEBUFFER,B)&&V&&ye.drawBuffers(S,B),ye.viewport(R),ye.scissor(F),ye.setScissorTest(j),te){let de=be.get(S.texture);I.framebufferTexture2D(I.FRAMEBUFFER,I.COLOR_ATTACHMENT0,I.TEXTURE_CUBE_MAP_POSITIVE_X+D,de.__webglTexture,G)}else if(ce){let de=D;for(let ke=0;ke<S.textures.length;ke++){let Re=be.get(S.textures[ke]);I.framebufferTextureLayer(I.FRAMEBUFFER,I.COLOR_ATTACHMENT0+ke,Re.__webglTexture,G,de)}}else if(S!==null&&G!==0){let de=be.get(S.texture);I.framebufferTexture2D(I.FRAMEBUFFER,I.COLOR_ATTACHMENT0,I.TEXTURE_2D,de.__webglTexture,G)}_=-1},this.readRenderTargetPixels=function(S,D,G,V,B,te,ce,pe=0){if(!(S&&S.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let de=be.get(S).__webglFramebuffer;if(S.isWebGLCubeRenderTarget&&ce!==void 0&&(de=de[ce]),de){ye.bindFramebuffer(I.FRAMEBUFFER,de);try{let ke=S.textures[pe],Re=ke.format,Se=ke.type;if(!Ce.textureFormatReadable(Re)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!Ce.textureTypeReadable(Se)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}D>=0&&D<=S.width-V&&G>=0&&G<=S.height-B&&(S.textures.length>1&&I.readBuffer(I.COLOR_ATTACHMENT0+pe),I.readPixels(D,G,V,B,xe.convert(Re),xe.convert(Se),te))}finally{let ke=P!==null?be.get(P).__webglFramebuffer:null;ye.bindFramebuffer(I.FRAMEBUFFER,ke)}}},this.readRenderTargetPixelsAsync=async function(S,D,G,V,B,te,ce,pe=0){if(!(S&&S.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let de=be.get(S).__webglFramebuffer;if(S.isWebGLCubeRenderTarget&&ce!==void 0&&(de=de[ce]),de)if(D>=0&&D<=S.width-V&&G>=0&&G<=S.height-B){ye.bindFramebuffer(I.FRAMEBUFFER,de);let ke=S.textures[pe],Re=ke.format,Se=ke.type;if(!Ce.textureFormatReadable(Re))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!Ce.textureTypeReadable(Se))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");let Ge=I.createBuffer();I.bindBuffer(I.PIXEL_PACK_BUFFER,Ge),I.bufferData(I.PIXEL_PACK_BUFFER,te.byteLength,I.STREAM_READ),S.textures.length>1&&I.readBuffer(I.COLOR_ATTACHMENT0+pe),I.readPixels(D,G,V,B,xe.convert(Re),xe.convert(Se),0);let et=P!==null?be.get(P).__webglFramebuffer:null;ye.bindFramebuffer(I.FRAMEBUFFER,et);let mt=I.fenceSync(I.SYNC_GPU_COMMANDS_COMPLETE,0);return I.flush(),await zd(I,mt,4),I.bindBuffer(I.PIXEL_PACK_BUFFER,Ge),I.getBufferSubData(I.PIXEL_PACK_BUFFER,0,te),I.deleteBuffer(Ge),I.deleteSync(mt),te}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(S,D=null,G=0){let V=Math.pow(2,-G),B=Math.floor(S.image.width*V),te=Math.floor(S.image.height*V),ce=D!==null?D.x:0,pe=D!==null?D.y:0;Ue.setTexture2D(S,0),I.copyTexSubImage2D(I.TEXTURE_2D,G,0,0,ce,pe,B,te),ye.unbindTexture()};let Dh=I.createFramebuffer(),Bh=I.createFramebuffer();this.copyTextureToTexture=function(S,D,G=null,V=null,B=0,te=null){te===null&&(B!==0?(ur("WebGLRenderer: copyTextureToTexture function signature has changed to support src and dst mipmap levels."),te=B,B=0):te=0);let ce,pe,de,ke,Re,Se,Ge,et,mt,lt=S.isCompressedTexture?S.mipmaps[te]:S.image;if(G!==null)ce=G.max.x-G.min.x,pe=G.max.y-G.min.y,de=G.isBox3?G.max.z-G.min.z:1,ke=G.min.x,Re=G.min.y,Se=G.isBox3?G.min.z:0;else{let ti=Math.pow(2,-B);ce=Math.floor(lt.width*ti),pe=Math.floor(lt.height*ti),S.isDataArrayTexture?de=lt.depth:S.isData3DTexture?de=Math.floor(lt.depth*ti):de=1,ke=0,Re=0,Se=0}V!==null?(Ge=V.x,et=V.y,mt=V.z):(Ge=0,et=0,mt=0);let st=xe.convert(D.format),Ae=xe.convert(D.type),dt;D.isData3DTexture?(Ue.setTexture3D(D,0),dt=I.TEXTURE_3D):D.isDataArrayTexture||D.isCompressedArrayTexture?(Ue.setTexture2DArray(D,0),dt=I.TEXTURE_2D_ARRAY):(Ue.setTexture2D(D,0),dt=I.TEXTURE_2D),I.pixelStorei(I.UNPACK_FLIP_Y_WEBGL,D.flipY),I.pixelStorei(I.UNPACK_PREMULTIPLY_ALPHA_WEBGL,D.premultiplyAlpha),I.pixelStorei(I.UNPACK_ALIGNMENT,D.unpackAlignment);let Ke=I.getParameter(I.UNPACK_ROW_LENGTH),Kt=I.getParameter(I.UNPACK_IMAGE_HEIGHT),jn=I.getParameter(I.UNPACK_SKIP_PIXELS),Yt=I.getParameter(I.UNPACK_SKIP_ROWS),Or=I.getParameter(I.UNPACK_SKIP_IMAGES);I.pixelStorei(I.UNPACK_ROW_LENGTH,lt.width),I.pixelStorei(I.UNPACK_IMAGE_HEIGHT,lt.height),I.pixelStorei(I.UNPACK_SKIP_PIXELS,ke),I.pixelStorei(I.UNPACK_SKIP_ROWS,Re),I.pixelStorei(I.UNPACK_SKIP_IMAGES,Se);let ht=S.isDataArrayTexture||S.isData3DTexture,ei=D.isDataArrayTexture||D.isData3DTexture;if(S.isDepthTexture){let ti=be.get(S),Dt=be.get(D),Wt=be.get(ti.__renderTarget),No=be.get(Dt.__renderTarget);ye.bindFramebuffer(I.READ_FRAMEBUFFER,Wt.__webglFramebuffer),ye.bindFramebuffer(I.DRAW_FRAMEBUFFER,No.__webglFramebuffer);for(let hn=0;hn<de;hn++)ht&&(I.framebufferTextureLayer(I.READ_FRAMEBUFFER,I.COLOR_ATTACHMENT0,be.get(S).__webglTexture,B,Se+hn),I.framebufferTextureLayer(I.DRAW_FRAMEBUFFER,I.COLOR_ATTACHMENT0,be.get(D).__webglTexture,te,mt+hn)),I.blitFramebuffer(ke,Re,ce,pe,Ge,et,ce,pe,I.DEPTH_BUFFER_BIT,I.NEAREST);ye.bindFramebuffer(I.READ_FRAMEBUFFER,null),ye.bindFramebuffer(I.DRAW_FRAMEBUFFER,null)}else if(B!==0||S.isRenderTargetTexture||be.has(S)){let ti=be.get(S),Dt=be.get(D);ye.bindFramebuffer(I.READ_FRAMEBUFFER,Dh),ye.bindFramebuffer(I.DRAW_FRAMEBUFFER,Bh);for(let Wt=0;Wt<de;Wt++)ht?I.framebufferTextureLayer(I.READ_FRAMEBUFFER,I.COLOR_ATTACHMENT0,ti.__webglTexture,B,Se+Wt):I.framebufferTexture2D(I.READ_FRAMEBUFFER,I.COLOR_ATTACHMENT0,I.TEXTURE_2D,ti.__webglTexture,B),ei?I.framebufferTextureLayer(I.DRAW_FRAMEBUFFER,I.COLOR_ATTACHMENT0,Dt.__webglTexture,te,mt+Wt):I.framebufferTexture2D(I.DRAW_FRAMEBUFFER,I.COLOR_ATTACHMENT0,I.TEXTURE_2D,Dt.__webglTexture,te),B!==0?I.blitFramebuffer(ke,Re,ce,pe,Ge,et,ce,pe,I.COLOR_BUFFER_BIT,I.NEAREST):ei?I.copyTexSubImage3D(dt,te,Ge,et,mt+Wt,ke,Re,ce,pe):I.copyTexSubImage2D(dt,te,Ge,et,ke,Re,ce,pe);ye.bindFramebuffer(I.READ_FRAMEBUFFER,null),ye.bindFramebuffer(I.DRAW_FRAMEBUFFER,null)}else ei?S.isDataTexture||S.isData3DTexture?I.texSubImage3D(dt,te,Ge,et,mt,ce,pe,de,st,Ae,lt.data):D.isCompressedArrayTexture?I.compressedTexSubImage3D(dt,te,Ge,et,mt,ce,pe,de,st,lt.data):I.texSubImage3D(dt,te,Ge,et,mt,ce,pe,de,st,Ae,lt):S.isDataTexture?I.texSubImage2D(I.TEXTURE_2D,te,Ge,et,ce,pe,st,Ae,lt.data):S.isCompressedTexture?I.compressedTexSubImage2D(I.TEXTURE_2D,te,Ge,et,lt.width,lt.height,st,lt.data):I.texSubImage2D(I.TEXTURE_2D,te,Ge,et,ce,pe,st,Ae,lt);I.pixelStorei(I.UNPACK_ROW_LENGTH,Ke),I.pixelStorei(I.UNPACK_IMAGE_HEIGHT,Kt),I.pixelStorei(I.UNPACK_SKIP_PIXELS,jn),I.pixelStorei(I.UNPACK_SKIP_ROWS,Yt),I.pixelStorei(I.UNPACK_SKIP_IMAGES,Or),te===0&&D.generateMipmaps&&I.generateMipmap(dt),ye.unbindTexture()},this.initRenderTarget=function(S){be.get(S).__webglFramebuffer===void 0&&Ue.setupRenderTarget(S)},this.initTexture=function(S){S.isCubeTexture?Ue.setTextureCube(S,0):S.isData3DTexture?Ue.setTexture3D(S,0):S.isDataArrayTexture||S.isCompressedArrayTexture?Ue.setTexture2DArray(S,0):Ue.setTexture2D(S,0),ye.unbindTexture()},this.resetState=function(){A=0,E=0,P=null,ye.reset(),le.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return di}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;let t=this.getContext();t.drawingBufferColorSpace=Ve._getDrawingBufferColorSpace(e),t.unpackColorSpace=Ve._getUnpackColorSpace()}};function ac(r,e){if(e===Ll)return console.warn("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Geometry already defined as triangles."),r;if(e===Ar||e===Cs){let t=r.getIndex();if(t===null){let a=[],o=r.getAttribute("position");if(o!==void 0){for(let l=0;l<o.count;l++)a.push(l);r.setIndex(a),t=r.getIndex()}else return console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Undefined position attribute. Processing not possible."),r}let i=t.count-2,n=[];if(e===Ar)for(let a=1;a<=i;a++)n.push(t.getX(0)),n.push(t.getX(a)),n.push(t.getX(a+1));else for(let a=0;a<i;a++)a%2===0?(n.push(t.getX(a)),n.push(t.getX(a+1)),n.push(t.getX(a+2))):(n.push(t.getX(a+2)),n.push(t.getX(a+1)),n.push(t.getX(a)));n.length/3!==i&&console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unable to generate correct amount of triangles.");let s=r.clone();return s.setIndex(n),s.clearGroups(),s}else return console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unknown draw mode:",e),r}var Co=class extends Ii{constructor(e){super(e),this.dracoLoader=null,this.ktx2Loader=null,this.meshoptDecoder=null,this.pluginCallbacks=[],this.register(function(t){return new fc(t)}),this.register(function(t){return new pc(t)}),this.register(function(t){return new _c(t)}),this.register(function(t){return new Sc(t)}),this.register(function(t){return new Tc(t)}),this.register(function(t){return new yc(t)}),this.register(function(t){return new bc(t)}),this.register(function(t){return new vc(t)}),this.register(function(t){return new gc(t)}),this.register(function(t){return new hc(t)}),this.register(function(t){return new xc(t)}),this.register(function(t){return new mc(t)}),this.register(function(t){return new Mc(t)}),this.register(function(t){return new wc(t)}),this.register(function(t){return new uc(t)}),this.register(function(t){return new Ac(t)}),this.register(function(t){return new kc(t)})}load(e,t,i,n){let s=this,a;if(this.resourcePath!=="")a=this.resourcePath;else if(this.path!==""){let c=$i.extractUrlBase(e);a=$i.resolveURL(c,this.path)}else a=$i.extractUrlBase(e);this.manager.itemStart(e);let o=function(c){n?n(c):console.error(c),s.manager.itemError(e),s.manager.itemEnd(e)},l=new xr(this.manager);l.setPath(this.path),l.setResponseType("arraybuffer"),l.setRequestHeader(this.requestHeader),l.setWithCredentials(this.withCredentials),l.load(e,function(c){try{s.parse(c,a,function(d){t(d),s.manager.itemEnd(e)},o)}catch(d){o(d)}},i,o)}setDRACOLoader(e){return this.dracoLoader=e,this}setKTX2Loader(e){return this.ktx2Loader=e,this}setMeshoptDecoder(e){return this.meshoptDecoder=e,this}register(e){return this.pluginCallbacks.indexOf(e)===-1&&this.pluginCallbacks.push(e),this}unregister(e){return this.pluginCallbacks.indexOf(e)!==-1&&this.pluginCallbacks.splice(this.pluginCallbacks.indexOf(e),1),this}parse(e,t,i,n){let s,a={},o={},l=new TextDecoder;if(typeof e=="string")s=JSON.parse(e);else if(e instanceof ArrayBuffer)if(l.decode(new Uint8Array(e,0,4))===Sh){try{a[je.KHR_BINARY_GLTF]=new Ec(e)}catch(u){n&&n(u);return}s=JSON.parse(a[je.KHR_BINARY_GLTF].content)}else s=JSON.parse(l.decode(e));else s=e;if(s.asset===void 0||s.asset.version[0]<2){n&&n(new Error("THREE.GLTFLoader: Unsupported asset. glTF versions >=2.0 are supported."));return}let c=new Nc(s,{path:t||this.resourcePath||"",crossOrigin:this.crossOrigin,requestHeader:this.requestHeader,manager:this.manager,ktx2Loader:this.ktx2Loader,meshoptDecoder:this.meshoptDecoder});c.fileLoader.setRequestHeader(this.requestHeader);for(let d=0;d<this.pluginCallbacks.length;d++){let u=this.pluginCallbacks[d](c);u.name||console.error("THREE.GLTFLoader: Invalid plugin found: missing name"),o[u.name]=u,a[u.name]=!0}if(s.extensionsUsed)for(let d=0;d<s.extensionsUsed.length;++d){let u=s.extensionsUsed[d],h=s.extensionsRequired||[];switch(u){case je.KHR_MATERIALS_UNLIT:a[u]=new dc;break;case je.KHR_DRACO_MESH_COMPRESSION:a[u]=new Cc(s,this.dracoLoader);break;case je.KHR_TEXTURE_TRANSFORM:a[u]=new Rc;break;case je.KHR_MESH_QUANTIZATION:a[u]=new Ic;break;default:h.indexOf(u)>=0&&o[u]===void 0&&console.warn('THREE.GLTFLoader: Unknown extension "'+u+'".')}}c.setExtensions(a),c.setPlugins(o),c.parse(i,n)}parseAsync(e,t){let i=this;return new Promise(function(n,s){i.parse(e,t,n,s)})}};function mv(){let r={};return{get:function(e){return r[e]},add:function(e,t){r[e]=t},remove:function(e){delete r[e]},removeAll:function(){r={}}}}var je={KHR_BINARY_GLTF:"KHR_binary_glTF",KHR_DRACO_MESH_COMPRESSION:"KHR_draco_mesh_compression",KHR_LIGHTS_PUNCTUAL:"KHR_lights_punctual",KHR_MATERIALS_CLEARCOAT:"KHR_materials_clearcoat",KHR_MATERIALS_DISPERSION:"KHR_materials_dispersion",KHR_MATERIALS_IOR:"KHR_materials_ior",KHR_MATERIALS_SHEEN:"KHR_materials_sheen",KHR_MATERIALS_SPECULAR:"KHR_materials_specular",KHR_MATERIALS_TRANSMISSION:"KHR_materials_transmission",KHR_MATERIALS_IRIDESCENCE:"KHR_materials_iridescence",KHR_MATERIALS_ANISOTROPY:"KHR_materials_anisotropy",KHR_MATERIALS_UNLIT:"KHR_materials_unlit",KHR_MATERIALS_VOLUME:"KHR_materials_volume",KHR_TEXTURE_BASISU:"KHR_texture_basisu",KHR_TEXTURE_TRANSFORM:"KHR_texture_transform",KHR_MESH_QUANTIZATION:"KHR_mesh_quantization",KHR_MATERIALS_EMISSIVE_STRENGTH:"KHR_materials_emissive_strength",EXT_MATERIALS_BUMP:"EXT_materials_bump",EXT_TEXTURE_WEBP:"EXT_texture_webp",EXT_TEXTURE_AVIF:"EXT_texture_avif",EXT_MESHOPT_COMPRESSION:"EXT_meshopt_compression",EXT_MESH_GPU_INSTANCING:"EXT_mesh_gpu_instancing"},uc=class{constructor(e){this.parser=e,this.name=je.KHR_LIGHTS_PUNCTUAL,this.cache={refs:{},uses:{}}}_markDefs(){let e=this.parser,t=this.parser.json.nodes||[];for(let i=0,n=t.length;i<n;i++){let s=t[i];s.extensions&&s.extensions[this.name]&&s.extensions[this.name].light!==void 0&&e._addNodeRef(this.cache,s.extensions[this.name].light)}}_loadLight(e){let t=this.parser,i="light:"+e,n=t.cache.get(i);if(n)return n;let s=t.json,l=((s.extensions&&s.extensions[this.name]||{}).lights||[])[e],c,d=new Me(16777215);l.color!==void 0&&d.setRGB(l.color[0],l.color[1],l.color[2],_t);let u=l.range!==void 0?l.range:0;switch(l.type){case"directional":c=new ln(d),c.target.position.set(0,0,-1),c.add(c.target);break;case"point":c=new In(d),c.distance=u;break;case"spot":c=new ws(d),c.distance=u,l.spot=l.spot||{},l.spot.innerConeAngle=l.spot.innerConeAngle!==void 0?l.spot.innerConeAngle:0,l.spot.outerConeAngle=l.spot.outerConeAngle!==void 0?l.spot.outerConeAngle:Math.PI/4,c.angle=l.spot.outerConeAngle,c.penumbra=1-l.spot.innerConeAngle/l.spot.outerConeAngle,c.target.position.set(0,0,-1),c.add(c.target);break;default:throw new Error("THREE.GLTFLoader: Unexpected light type: "+l.type)}return c.position.set(0,0,0),Li(c,l),l.intensity!==void 0&&(c.intensity=l.intensity),c.name=t.createUniqueName(l.name||"light_"+e),n=Promise.resolve(c),t.cache.add(i,n),n}getDependency(e,t){if(e==="light")return this._loadLight(t)}createNodeAttachment(e){let t=this,i=this.parser,s=i.json.nodes[e],o=(s.extensions&&s.extensions[this.name]||{}).light;return o===void 0?null:this._loadLight(o).then(function(l){return i._getNodeRef(t.cache,o,l)})}},dc=class{constructor(){this.name=je.KHR_MATERIALS_UNLIT}getMaterialType(){return jt}extendParams(e,t,i){let n=[];e.color=new Me(1,1,1),e.opacity=1;let s=t.pbrMetallicRoughness;if(s){if(Array.isArray(s.baseColorFactor)){let a=s.baseColorFactor;e.color.setRGB(a[0],a[1],a[2],_t),e.opacity=a[3]}s.baseColorTexture!==void 0&&n.push(i.assignTexture(e,"map",s.baseColorTexture,ft))}return Promise.all(n)}},hc=class{constructor(e){this.parser=e,this.name=je.KHR_MATERIALS_EMISSIVE_STRENGTH}extendMaterialParams(e,t){let n=this.parser.json.materials[e];if(!n.extensions||!n.extensions[this.name])return Promise.resolve();let s=n.extensions[this.name].emissiveStrength;return s!==void 0&&(t.emissiveIntensity=s),Promise.resolve()}},fc=class{constructor(e){this.parser=e,this.name=je.KHR_MATERIALS_CLEARCOAT}getMaterialType(e){let i=this.parser.json.materials[e];return!i.extensions||!i.extensions[this.name]?null:$t}extendMaterialParams(e,t){let i=this.parser,n=i.json.materials[e];if(!n.extensions||!n.extensions[this.name])return Promise.resolve();let s=[],a=n.extensions[this.name];if(a.clearcoatFactor!==void 0&&(t.clearcoat=a.clearcoatFactor),a.clearcoatTexture!==void 0&&s.push(i.assignTexture(t,"clearcoatMap",a.clearcoatTexture)),a.clearcoatRoughnessFactor!==void 0&&(t.clearcoatRoughness=a.clearcoatRoughnessFactor),a.clearcoatRoughnessTexture!==void 0&&s.push(i.assignTexture(t,"clearcoatRoughnessMap",a.clearcoatRoughnessTexture)),a.clearcoatNormalTexture!==void 0&&(s.push(i.assignTexture(t,"clearcoatNormalMap",a.clearcoatNormalTexture)),a.clearcoatNormalTexture.scale!==void 0)){let o=a.clearcoatNormalTexture.scale;t.clearcoatNormalScale=new Oe(o,o)}return Promise.all(s)}},pc=class{constructor(e){this.parser=e,this.name=je.KHR_MATERIALS_DISPERSION}getMaterialType(e){let i=this.parser.json.materials[e];return!i.extensions||!i.extensions[this.name]?null:$t}extendMaterialParams(e,t){let n=this.parser.json.materials[e];if(!n.extensions||!n.extensions[this.name])return Promise.resolve();let s=n.extensions[this.name];return t.dispersion=s.dispersion!==void 0?s.dispersion:0,Promise.resolve()}},mc=class{constructor(e){this.parser=e,this.name=je.KHR_MATERIALS_IRIDESCENCE}getMaterialType(e){let i=this.parser.json.materials[e];return!i.extensions||!i.extensions[this.name]?null:$t}extendMaterialParams(e,t){let i=this.parser,n=i.json.materials[e];if(!n.extensions||!n.extensions[this.name])return Promise.resolve();let s=[],a=n.extensions[this.name];return a.iridescenceFactor!==void 0&&(t.iridescence=a.iridescenceFactor),a.iridescenceTexture!==void 0&&s.push(i.assignTexture(t,"iridescenceMap",a.iridescenceTexture)),a.iridescenceIor!==void 0&&(t.iridescenceIOR=a.iridescenceIor),t.iridescenceThicknessRange===void 0&&(t.iridescenceThicknessRange=[100,400]),a.iridescenceThicknessMinimum!==void 0&&(t.iridescenceThicknessRange[0]=a.iridescenceThicknessMinimum),a.iridescenceThicknessMaximum!==void 0&&(t.iridescenceThicknessRange[1]=a.iridescenceThicknessMaximum),a.iridescenceThicknessTexture!==void 0&&s.push(i.assignTexture(t,"iridescenceThicknessMap",a.iridescenceThicknessTexture)),Promise.all(s)}},yc=class{constructor(e){this.parser=e,this.name=je.KHR_MATERIALS_SHEEN}getMaterialType(e){let i=this.parser.json.materials[e];return!i.extensions||!i.extensions[this.name]?null:$t}extendMaterialParams(e,t){let i=this.parser,n=i.json.materials[e];if(!n.extensions||!n.extensions[this.name])return Promise.resolve();let s=[];t.sheenColor=new Me(0,0,0),t.sheenRoughness=0,t.sheen=1;let a=n.extensions[this.name];if(a.sheenColorFactor!==void 0){let o=a.sheenColorFactor;t.sheenColor.setRGB(o[0],o[1],o[2],_t)}return a.sheenRoughnessFactor!==void 0&&(t.sheenRoughness=a.sheenRoughnessFactor),a.sheenColorTexture!==void 0&&s.push(i.assignTexture(t,"sheenColorMap",a.sheenColorTexture,ft)),a.sheenRoughnessTexture!==void 0&&s.push(i.assignTexture(t,"sheenRoughnessMap",a.sheenRoughnessTexture)),Promise.all(s)}},bc=class{constructor(e){this.parser=e,this.name=je.KHR_MATERIALS_TRANSMISSION}getMaterialType(e){let i=this.parser.json.materials[e];return!i.extensions||!i.extensions[this.name]?null:$t}extendMaterialParams(e,t){let i=this.parser,n=i.json.materials[e];if(!n.extensions||!n.extensions[this.name])return Promise.resolve();let s=[],a=n.extensions[this.name];return a.transmissionFactor!==void 0&&(t.transmission=a.transmissionFactor),a.transmissionTexture!==void 0&&s.push(i.assignTexture(t,"transmissionMap",a.transmissionTexture)),Promise.all(s)}},vc=class{constructor(e){this.parser=e,this.name=je.KHR_MATERIALS_VOLUME}getMaterialType(e){let i=this.parser.json.materials[e];return!i.extensions||!i.extensions[this.name]?null:$t}extendMaterialParams(e,t){let i=this.parser,n=i.json.materials[e];if(!n.extensions||!n.extensions[this.name])return Promise.resolve();let s=[],a=n.extensions[this.name];t.thickness=a.thicknessFactor!==void 0?a.thicknessFactor:0,a.thicknessTexture!==void 0&&s.push(i.assignTexture(t,"thicknessMap",a.thicknessTexture)),t.attenuationDistance=a.attenuationDistance||1/0;let o=a.attenuationColor||[1,1,1];return t.attenuationColor=new Me().setRGB(o[0],o[1],o[2],_t),Promise.all(s)}},gc=class{constructor(e){this.parser=e,this.name=je.KHR_MATERIALS_IOR}getMaterialType(e){let i=this.parser.json.materials[e];return!i.extensions||!i.extensions[this.name]?null:$t}extendMaterialParams(e,t){let n=this.parser.json.materials[e];if(!n.extensions||!n.extensions[this.name])return Promise.resolve();let s=n.extensions[this.name];return t.ior=s.ior!==void 0?s.ior:1.5,Promise.resolve()}},xc=class{constructor(e){this.parser=e,this.name=je.KHR_MATERIALS_SPECULAR}getMaterialType(e){let i=this.parser.json.materials[e];return!i.extensions||!i.extensions[this.name]?null:$t}extendMaterialParams(e,t){let i=this.parser,n=i.json.materials[e];if(!n.extensions||!n.extensions[this.name])return Promise.resolve();let s=[],a=n.extensions[this.name];t.specularIntensity=a.specularFactor!==void 0?a.specularFactor:1,a.specularTexture!==void 0&&s.push(i.assignTexture(t,"specularIntensityMap",a.specularTexture));let o=a.specularColorFactor||[1,1,1];return t.specularColor=new Me().setRGB(o[0],o[1],o[2],_t),a.specularColorTexture!==void 0&&s.push(i.assignTexture(t,"specularColorMap",a.specularColorTexture,ft)),Promise.all(s)}},wc=class{constructor(e){this.parser=e,this.name=je.EXT_MATERIALS_BUMP}getMaterialType(e){let i=this.parser.json.materials[e];return!i.extensions||!i.extensions[this.name]?null:$t}extendMaterialParams(e,t){let i=this.parser,n=i.json.materials[e];if(!n.extensions||!n.extensions[this.name])return Promise.resolve();let s=[],a=n.extensions[this.name];return t.bumpScale=a.bumpFactor!==void 0?a.bumpFactor:1,a.bumpTexture!==void 0&&s.push(i.assignTexture(t,"bumpMap",a.bumpTexture)),Promise.all(s)}},Mc=class{constructor(e){this.parser=e,this.name=je.KHR_MATERIALS_ANISOTROPY}getMaterialType(e){let i=this.parser.json.materials[e];return!i.extensions||!i.extensions[this.name]?null:$t}extendMaterialParams(e,t){let i=this.parser,n=i.json.materials[e];if(!n.extensions||!n.extensions[this.name])return Promise.resolve();let s=[],a=n.extensions[this.name];return a.anisotropyStrength!==void 0&&(t.anisotropy=a.anisotropyStrength),a.anisotropyRotation!==void 0&&(t.anisotropyRotation=a.anisotropyRotation),a.anisotropyTexture!==void 0&&s.push(i.assignTexture(t,"anisotropyMap",a.anisotropyTexture)),Promise.all(s)}},_c=class{constructor(e){this.parser=e,this.name=je.KHR_TEXTURE_BASISU}loadTexture(e){let t=this.parser,i=t.json,n=i.textures[e];if(!n.extensions||!n.extensions[this.name])return null;let s=n.extensions[this.name],a=t.options.ktx2Loader;if(!a){if(i.extensionsRequired&&i.extensionsRequired.indexOf(this.name)>=0)throw new Error("THREE.GLTFLoader: setKTX2Loader must be called before loading KTX2 textures");return null}return t.loadTextureImage(e,s.source,a)}},Sc=class{constructor(e){this.parser=e,this.name=je.EXT_TEXTURE_WEBP}loadTexture(e){let t=this.name,i=this.parser,n=i.json,s=n.textures[e];if(!s.extensions||!s.extensions[t])return null;let a=s.extensions[t],o=n.images[a.source],l=i.textureLoader;if(o.uri){let c=i.options.manager.getHandler(o.uri);c!==null&&(l=c)}return i.loadTextureImage(e,a.source,l)}},Tc=class{constructor(e){this.parser=e,this.name=je.EXT_TEXTURE_AVIF}loadTexture(e){let t=this.name,i=this.parser,n=i.json,s=n.textures[e];if(!s.extensions||!s.extensions[t])return null;let a=s.extensions[t],o=n.images[a.source],l=i.textureLoader;if(o.uri){let c=i.options.manager.getHandler(o.uri);c!==null&&(l=c)}return i.loadTextureImage(e,a.source,l)}},Ac=class{constructor(e){this.name=je.EXT_MESHOPT_COMPRESSION,this.parser=e}loadBufferView(e){let t=this.parser.json,i=t.bufferViews[e];if(i.extensions&&i.extensions[this.name]){let n=i.extensions[this.name],s=this.parser.getDependency("buffer",n.buffer),a=this.parser.options.meshoptDecoder;if(!a||!a.supported){if(t.extensionsRequired&&t.extensionsRequired.indexOf(this.name)>=0)throw new Error("THREE.GLTFLoader: setMeshoptDecoder must be called before loading compressed files");return null}return s.then(function(o){let l=n.byteOffset||0,c=n.byteLength||0,d=n.count,u=n.byteStride,h=new Uint8Array(o,l,c);return a.decodeGltfBufferAsync?a.decodeGltfBufferAsync(d,u,h,n.mode,n.filter).then(function(m){return m.buffer}):a.ready.then(function(){let m=new ArrayBuffer(d*u);return a.decodeGltfBuffer(new Uint8Array(m),d,u,h,n.mode,n.filter),m})})}else return null}},kc=class{constructor(e){this.name=je.EXT_MESH_GPU_INSTANCING,this.parser=e}createNodeMesh(e){let t=this.parser.json,i=t.nodes[e];if(!i.extensions||!i.extensions[this.name]||i.mesh===void 0)return null;let n=t.meshes[i.mesh];for(let c of n.primitives)if(c.mode!==si.TRIANGLES&&c.mode!==si.TRIANGLE_STRIP&&c.mode!==si.TRIANGLE_FAN&&c.mode!==void 0)return null;let a=i.extensions[this.name].attributes,o=[],l={};for(let c in a)o.push(this.parser.getDependency("accessor",a[c]).then(d=>(l[c]=d,l[c])));return o.length<1?null:(o.push(this.parser.createNodeMesh(e)),Promise.all(o).then(c=>{let d=c.pop(),u=d.isGroup?d.children:[d],h=c[0].count,m=[];for(let y of u){let b=new Be,p=new L,f=new Ut,x=new L(1,1,1),g=new Gi(y.geometry,y.material,h);for(let v=0;v<h;v++)l.TRANSLATION&&p.fromBufferAttribute(l.TRANSLATION,v),l.ROTATION&&f.fromBufferAttribute(l.ROTATION,v),l.SCALE&&x.fromBufferAttribute(l.SCALE,v),g.setMatrixAt(v,b.compose(p,f,x));for(let v in l)if(v==="_COLOR_0"){let T=l[v];g.instanceColor=new an(T.array,T.itemSize,T.normalized)}else v!=="TRANSLATION"&&v!=="ROTATION"&&v!=="SCALE"&&y.geometry.setAttribute(v,l[v]);rt.prototype.copy.call(g,y),this.parser.assignFinalMaterial(g),m.push(g)}return d.isGroup?(d.clear(),d.add(...m),d):m[0]}))}},Sh="glTF",Is=12,xh={JSON:1313821514,BIN:5130562},Ec=class{constructor(e){this.name=je.KHR_BINARY_GLTF,this.content=null,this.body=null;let t=new DataView(e,0,Is),i=new TextDecoder;if(this.header={magic:i.decode(new Uint8Array(e.slice(0,4))),version:t.getUint32(4,!0),length:t.getUint32(8,!0)},this.header.magic!==Sh)throw new Error("THREE.GLTFLoader: Unsupported glTF-Binary header.");if(this.header.version<2)throw new Error("THREE.GLTFLoader: Legacy binary file detected.");let n=this.header.length-Is,s=new DataView(e,Is),a=0;for(;a<n;){let o=s.getUint32(a,!0);a+=4;let l=s.getUint32(a,!0);if(a+=4,l===xh.JSON){let c=new Uint8Array(e,Is+a,o);this.content=i.decode(c)}else if(l===xh.BIN){let c=Is+a;this.body=e.slice(c,c+o)}a+=o}if(this.content===null)throw new Error("THREE.GLTFLoader: JSON content not found.")}},Cc=class{constructor(e,t){if(!t)throw new Error("THREE.GLTFLoader: No DRACOLoader instance provided.");this.name=je.KHR_DRACO_MESH_COMPRESSION,this.json=e,this.dracoLoader=t,this.dracoLoader.preload()}decodePrimitive(e,t){let i=this.json,n=this.dracoLoader,s=e.extensions[this.name].bufferView,a=e.extensions[this.name].attributes,o={},l={},c={};for(let d in a){let u=Oc[d]||d.toLowerCase();o[u]=a[d]}for(let d in e.attributes){let u=Oc[d]||d.toLowerCase();if(a[d]!==void 0){let h=i.accessors[e.attributes[d]],m=Ir[h.componentType];c[u]=m.name,l[u]=h.normalized===!0}}return t.getDependency("bufferView",s).then(function(d){return new Promise(function(u,h){n.decodeDracoFile(d,function(m){for(let y in m.attributes){let b=m.attributes[y],p=l[y];p!==void 0&&(b.normalized=p)}u(m)},o,c,_t,h)})})}},Rc=class{constructor(){this.name=je.KHR_TEXTURE_TRANSFORM}extendTexture(e,t){return(t.texCoord===void 0||t.texCoord===e.channel)&&t.offset===void 0&&t.rotation===void 0&&t.scale===void 0||(e=e.clone(),t.texCoord!==void 0&&(e.channel=t.texCoord),t.offset!==void 0&&e.offset.fromArray(t.offset),t.rotation!==void 0&&(e.rotation=t.rotation),t.scale!==void 0&&e.repeat.fromArray(t.scale),e.needsUpdate=!0),e}},Ic=class{constructor(){this.name=je.KHR_MESH_QUANTIZATION}},Ro=class extends Vi{constructor(e,t,i,n){super(e,t,i,n)}copySampleValue_(e){let t=this.resultBuffer,i=this.sampleValues,n=this.valueSize,s=e*n*3+n;for(let a=0;a!==n;a++)t[a]=i[s+a];return t}interpolate_(e,t,i,n){let s=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=o*2,c=o*3,d=n-t,u=(i-t)/d,h=u*u,m=h*u,y=e*c,b=y-c,p=-2*m+3*h,f=m-h,x=1-p,g=f-h+u;for(let v=0;v!==o;v++){let T=a[b+v+o],A=a[b+v+l]*d,E=a[y+v+o],P=a[y+v]*d;s[v]=x*T+g*A+p*E+f*P}return s}},yv=new Ut,Pc=class extends Ro{interpolate_(e,t,i,n){let s=super.interpolate_(e,t,i,n);return yv.fromArray(s).normalize().toArray(s),s}},si={FLOAT:5126,FLOAT_MAT3:35675,FLOAT_MAT4:35676,FLOAT_VEC2:35664,FLOAT_VEC3:35665,FLOAT_VEC4:35666,LINEAR:9729,REPEAT:10497,SAMPLER_2D:35678,POINTS:0,LINES:1,LINE_LOOP:2,LINE_STRIP:3,TRIANGLES:4,TRIANGLE_STRIP:5,TRIANGLE_FAN:6,UNSIGNED_BYTE:5121,UNSIGNED_SHORT:5123},Ir={5120:Int8Array,5121:Uint8Array,5122:Int16Array,5123:Uint16Array,5125:Uint32Array,5126:Float32Array},wh={9728:It,9729:zt,9984:Fa,9985:wr,9986:Nn,9987:mi},Mh={33071:xi,33648:ar,10497:Mi},oc={SCALAR:1,VEC2:2,VEC3:3,VEC4:4,MAT2:4,MAT3:9,MAT4:16},Oc={POSITION:"position",NORMAL:"normal",TANGENT:"tangent",TEXCOORD_0:"uv",TEXCOORD_1:"uv1",TEXCOORD_2:"uv2",TEXCOORD_3:"uv3",COLOR_0:"color",WEIGHTS_0:"skinWeight",JOINTS_0:"skinIndex"},un={scale:"scale",translation:"position",rotation:"quaternion",weights:"morphTargetInfluences"},bv={CUBICSPLINE:void 0,LINEAR:Sn,STEP:_n},lc={OPAQUE:"OPAQUE",MASK:"MASK",BLEND:"BLEND"};function vv(r){return r.DefaultMaterial===void 0&&(r.DefaultMaterial=new En({color:16777215,emissive:0,metalness:1,roughness:1,transparent:!1,depthTest:!0,side:fi})),r.DefaultMaterial}function Hn(r,e,t){for(let i in t.extensions)r[i]===void 0&&(e.userData.gltfExtensions=e.userData.gltfExtensions||{},e.userData.gltfExtensions[i]=t.extensions[i])}function Li(r,e){e.extras!==void 0&&(typeof e.extras=="object"?Object.assign(r.userData,e.extras):console.warn("THREE.GLTFLoader: Ignoring primitive type .extras, "+e.extras))}function gv(r,e,t){let i=!1,n=!1,s=!1;for(let c=0,d=e.length;c<d;c++){let u=e[c];if(u.POSITION!==void 0&&(i=!0),u.NORMAL!==void 0&&(n=!0),u.COLOR_0!==void 0&&(s=!0),i&&n&&s)break}if(!i&&!n&&!s)return Promise.resolve(r);let a=[],o=[],l=[];for(let c=0,d=e.length;c<d;c++){let u=e[c];if(i){let h=u.POSITION!==void 0?t.getDependency("accessor",u.POSITION):r.attributes.position;a.push(h)}if(n){let h=u.NORMAL!==void 0?t.getDependency("accessor",u.NORMAL):r.attributes.normal;o.push(h)}if(s){let h=u.COLOR_0!==void 0?t.getDependency("accessor",u.COLOR_0):r.attributes.color;l.push(h)}}return Promise.all([Promise.all(a),Promise.all(o),Promise.all(l)]).then(function(c){let d=c[0],u=c[1],h=c[2];return i&&(r.morphAttributes.position=d),n&&(r.morphAttributes.normal=u),s&&(r.morphAttributes.color=h),r.morphTargetsRelative=!0,r})}function xv(r,e){if(r.updateMorphTargets(),e.weights!==void 0)for(let t=0,i=e.weights.length;t<i;t++)r.morphTargetInfluences[t]=e.weights[t];if(e.extras&&Array.isArray(e.extras.targetNames)){let t=e.extras.targetNames;if(r.morphTargetInfluences.length===t.length){r.morphTargetDictionary={};for(let i=0,n=t.length;i<n;i++)r.morphTargetDictionary[t[i]]=i}else console.warn("THREE.GLTFLoader: Invalid extras.targetNames length. Ignoring names.")}}function wv(r){let e,t=r.extensions&&r.extensions[je.KHR_DRACO_MESH_COMPRESSION];if(t?e="draco:"+t.bufferView+":"+t.indices+":"+cc(t.attributes):e=r.indices+":"+cc(r.attributes)+":"+r.mode,r.targets!==void 0)for(let i=0,n=r.targets.length;i<n;i++)e+=":"+cc(r.targets[i]);return e}function cc(r){let e="",t=Object.keys(r).sort();for(let i=0,n=t.length;i<n;i++)e+=t[i]+":"+r[t[i]]+";";return e}function Lc(r){switch(r){case Int8Array:return 1/127;case Uint8Array:return 1/255;case Int16Array:return 1/32767;case Uint16Array:return 1/65535;default:throw new Error("THREE.GLTFLoader: Unsupported normalized accessor component type.")}}function Mv(r){return r.search(/\.jpe?g($|\?)/i)>0||r.search(/^data\:image\/jpeg/)===0?"image/jpeg":r.search(/\.webp($|\?)/i)>0||r.search(/^data\:image\/webp/)===0?"image/webp":r.search(/\.ktx2($|\?)/i)>0||r.search(/^data\:image\/ktx2/)===0?"image/ktx2":"image/png"}var _v=new Be,Nc=class{constructor(e={},t={}){this.json=e,this.extensions={},this.plugins={},this.options=t,this.cache=new mv,this.associations=new Map,this.primitiveCache={},this.nodeCache={},this.meshCache={refs:{},uses:{}},this.cameraCache={refs:{},uses:{}},this.lightCache={refs:{},uses:{}},this.sourceCache={},this.textureCache={},this.nodeNamesUsed={};let i=!1,n=-1,s=!1,a=-1;if(typeof navigator<"u"){let o=navigator.userAgent;i=/^((?!chrome|android).)*safari/i.test(o)===!0;let l=o.match(/Version\/(\d+)/);n=i&&l?parseInt(l[1],10):-1,s=o.indexOf("Firefox")>-1,a=s?o.match(/Firefox\/([0-9]+)\./)[1]:-1}typeof createImageBitmap>"u"||i&&n<17||s&&a<98?this.textureLoader=new vs(this.options.manager):this.textureLoader=new Ms(this.options.manager),this.textureLoader.setCrossOrigin(this.options.crossOrigin),this.textureLoader.setRequestHeader(this.options.requestHeader),this.fileLoader=new xr(this.options.manager),this.fileLoader.setResponseType("arraybuffer"),this.options.crossOrigin==="use-credentials"&&this.fileLoader.setWithCredentials(!0)}setExtensions(e){this.extensions=e}setPlugins(e){this.plugins=e}parse(e,t){let i=this,n=this.json,s=this.extensions;this.cache.removeAll(),this.nodeCache={},this._invokeAll(function(a){return a._markDefs&&a._markDefs()}),Promise.all(this._invokeAll(function(a){return a.beforeRoot&&a.beforeRoot()})).then(function(){return Promise.all([i.getDependencies("scene"),i.getDependencies("animation"),i.getDependencies("camera")])}).then(function(a){let o={scene:a[0][n.scene||0],scenes:a[0],animations:a[1],cameras:a[2],asset:n.asset,parser:i,userData:{}};return Hn(s,o,n),Li(o,n),Promise.all(i._invokeAll(function(l){return l.afterRoot&&l.afterRoot(o)})).then(function(){for(let l of o.scenes)l.updateMatrixWorld();e(o)})}).catch(t)}_markDefs(){let e=this.json.nodes||[],t=this.json.skins||[],i=this.json.meshes||[];for(let n=0,s=t.length;n<s;n++){let a=t[n].joints;for(let o=0,l=a.length;o<l;o++)e[a[o]].isBone=!0}for(let n=0,s=e.length;n<s;n++){let a=e[n];a.mesh!==void 0&&(this._addNodeRef(this.meshCache,a.mesh),a.skin!==void 0&&(i[a.mesh].isSkinnedMesh=!0)),a.camera!==void 0&&this._addNodeRef(this.cameraCache,a.camera)}}_addNodeRef(e,t){t!==void 0&&(e.refs[t]===void 0&&(e.refs[t]=e.uses[t]=0),e.refs[t]++)}_getNodeRef(e,t,i){if(e.refs[t]<=1)return i;let n=i.clone(),s=(a,o)=>{let l=this.associations.get(a);l!=null&&this.associations.set(o,l);for(let[c,d]of a.children.entries())s(d,o.children[c])};return s(i,n),n.name+="_instance_"+e.uses[t]++,n}_invokeOne(e){let t=Object.values(this.plugins);t.push(this);for(let i=0;i<t.length;i++){let n=e(t[i]);if(n)return n}return null}_invokeAll(e){let t=Object.values(this.plugins);t.unshift(this);let i=[];for(let n=0;n<t.length;n++){let s=e(t[n]);s&&i.push(s)}return i}getDependency(e,t){let i=e+":"+t,n=this.cache.get(i);if(!n){switch(e){case"scene":n=this.loadScene(t);break;case"node":n=this._invokeOne(function(s){return s.loadNode&&s.loadNode(t)});break;case"mesh":n=this._invokeOne(function(s){return s.loadMesh&&s.loadMesh(t)});break;case"accessor":n=this.loadAccessor(t);break;case"bufferView":n=this._invokeOne(function(s){return s.loadBufferView&&s.loadBufferView(t)});break;case"buffer":n=this.loadBuffer(t);break;case"material":n=this._invokeOne(function(s){return s.loadMaterial&&s.loadMaterial(t)});break;case"texture":n=this._invokeOne(function(s){return s.loadTexture&&s.loadTexture(t)});break;case"skin":n=this.loadSkin(t);break;case"animation":n=this._invokeOne(function(s){return s.loadAnimation&&s.loadAnimation(t)});break;case"camera":n=this.loadCamera(t);break;default:if(n=this._invokeOne(function(s){return s!=this&&s.getDependency&&s.getDependency(e,t)}),!n)throw new Error("Unknown type: "+e);break}this.cache.add(i,n)}return n}getDependencies(e){let t=this.cache.get(e);if(!t){let i=this,n=this.json[e+(e==="mesh"?"es":"s")]||[];t=Promise.all(n.map(function(s,a){return i.getDependency(e,a)})),this.cache.add(e,t)}return t}loadBuffer(e){let t=this.json.buffers[e],i=this.fileLoader;if(t.type&&t.type!=="arraybuffer")throw new Error("THREE.GLTFLoader: "+t.type+" buffer type is not supported.");if(t.uri===void 0&&e===0)return Promise.resolve(this.extensions[je.KHR_BINARY_GLTF].body);let n=this.options;return new Promise(function(s,a){i.load($i.resolveURL(t.uri,n.path),s,void 0,function(){a(new Error('THREE.GLTFLoader: Failed to load buffer "'+t.uri+'".'))})})}loadBufferView(e){let t=this.json.bufferViews[e];return this.getDependency("buffer",t.buffer).then(function(i){let n=t.byteLength||0,s=t.byteOffset||0;return i.slice(s,s+n)})}loadAccessor(e){let t=this,i=this.json,n=this.json.accessors[e];if(n.bufferView===void 0&&n.sparse===void 0){let a=oc[n.type],o=Ir[n.componentType],l=n.normalized===!0,c=new o(n.count*a);return Promise.resolve(new wt(c,a,l))}let s=[];return n.bufferView!==void 0?s.push(this.getDependency("bufferView",n.bufferView)):s.push(null),n.sparse!==void 0&&(s.push(this.getDependency("bufferView",n.sparse.indices.bufferView)),s.push(this.getDependency("bufferView",n.sparse.values.bufferView))),Promise.all(s).then(function(a){let o=a[0],l=oc[n.type],c=Ir[n.componentType],d=c.BYTES_PER_ELEMENT,u=d*l,h=n.byteOffset||0,m=n.bufferView!==void 0?i.bufferViews[n.bufferView].byteStride:void 0,y=n.normalized===!0,b,p;if(m&&m!==u){let f=Math.floor(h/m),x="InterleavedBuffer:"+n.bufferView+":"+n.componentType+":"+f+":"+n.count,g=t.cache.get(x);g||(b=new c(o,f*m,n.count*m/d),g=new fr(b,m/d),t.cache.add(x,g)),p=new pr(g,l,h%m/d,y)}else o===null?b=new c(n.count*l):b=new c(o,h,n.count*l),p=new wt(b,l,y);if(n.sparse!==void 0){let f=oc.SCALAR,x=Ir[n.sparse.indices.componentType],g=n.sparse.indices.byteOffset||0,v=n.sparse.values.byteOffset||0,T=new x(a[1],g,n.sparse.count*f),A=new c(a[2],v,n.sparse.count*l);o!==null&&(p=new wt(p.array.slice(),p.itemSize,p.normalized)),p.normalized=!1;for(let E=0,P=T.length;E<P;E++){let _=T[E];if(p.setX(_,A[E*l]),l>=2&&p.setY(_,A[E*l+1]),l>=3&&p.setZ(_,A[E*l+2]),l>=4&&p.setW(_,A[E*l+3]),l>=5)throw new Error("THREE.GLTFLoader: Unsupported itemSize in sparse BufferAttribute.")}p.normalized=y}return p})}loadTexture(e){let t=this.json,i=this.options,s=t.textures[e].source,a=t.images[s],o=this.textureLoader;if(a.uri){let l=i.manager.getHandler(a.uri);l!==null&&(o=l)}return this.loadTextureImage(e,s,o)}loadTextureImage(e,t,i){let n=this,s=this.json,a=s.textures[e],o=s.images[t],l=(o.uri||o.bufferView)+":"+a.sampler;if(this.textureCache[l])return this.textureCache[l];let c=this.loadImageSource(t,i).then(function(d){d.flipY=!1,d.name=a.name||o.name||"",d.name===""&&typeof o.uri=="string"&&o.uri.startsWith("data:image/")===!1&&(d.name=o.uri);let h=(s.samplers||{})[a.sampler]||{};return d.magFilter=wh[h.magFilter]||zt,d.minFilter=wh[h.minFilter]||mi,d.wrapS=Mh[h.wrapS]||Mi,d.wrapT=Mh[h.wrapT]||Mi,d.generateMipmaps=!d.isCompressedTexture&&d.minFilter!==It&&d.minFilter!==zt,n.associations.set(d,{textures:e}),d}).catch(function(){return null});return this.textureCache[l]=c,c}loadImageSource(e,t){let i=this,n=this.json,s=this.options;if(this.sourceCache[e]!==void 0)return this.sourceCache[e].then(u=>u.clone());let a=n.images[e],o=self.URL||self.webkitURL,l=a.uri||"",c=!1;if(a.bufferView!==void 0)l=i.getDependency("bufferView",a.bufferView).then(function(u){c=!0;let h=new Blob([u],{type:a.mimeType});return l=o.createObjectURL(h),l});else if(a.uri===void 0)throw new Error("THREE.GLTFLoader: Image "+e+" is missing URI and bufferView");let d=Promise.resolve(l).then(function(u){return new Promise(function(h,m){let y=h;t.isImageBitmapLoader===!0&&(y=function(b){let p=new St(b);p.needsUpdate=!0,h(p)}),t.load($i.resolveURL(u,s.path),y,void 0,m)})}).then(function(u){return c===!0&&o.revokeObjectURL(l),Li(u,a),u.userData.mimeType=a.mimeType||Mv(a.uri),u}).catch(function(u){throw console.error("THREE.GLTFLoader: Couldn't load texture",l),u});return this.sourceCache[e]=d,d}assignTexture(e,t,i,n){let s=this;return this.getDependency("texture",i.index).then(function(a){if(!a)return null;if(i.texCoord!==void 0&&i.texCoord>0&&(a=a.clone(),a.channel=i.texCoord),s.extensions[je.KHR_TEXTURE_TRANSFORM]){let o=i.extensions!==void 0?i.extensions[je.KHR_TEXTURE_TRANSFORM]:void 0;if(o){let l=s.associations.get(a);a=s.extensions[je.KHR_TEXTURE_TRANSFORM].extendTexture(a,o),s.associations.set(a,l)}}return n!==void 0&&(a.colorSpace=n),e[t]=a,a})}assignFinalMaterial(e){let t=e.geometry,i=e.material,n=t.attributes.tangent===void 0,s=t.attributes.color!==void 0,a=t.attributes.normal===void 0;if(e.isPoints){let o="PointsMaterial:"+i.uuid,l=this.cache.get(o);l||(l=new vr,Ht.prototype.copy.call(l,i),l.color.copy(i.color),l.map=i.map,l.sizeAttenuation=!1,this.cache.add(o,l)),i=l}else if(e.isLine){let o="LineBasicMaterial:"+i.uuid,l=this.cache.get(o);l||(l=new br,Ht.prototype.copy.call(l,i),l.color.copy(i.color),l.map=i.map,this.cache.add(o,l)),i=l}if(n||s||a){let o="ClonedMaterial:"+i.uuid+":";n&&(o+="derivative-tangents:"),s&&(o+="vertex-colors:"),a&&(o+="flat-shading:");let l=this.cache.get(o);l||(l=i.clone(),s&&(l.vertexColors=!0),a&&(l.flatShading=!0),n&&(l.normalScale&&(l.normalScale.y*=-1),l.clearcoatNormalScale&&(l.clearcoatNormalScale.y*=-1)),this.cache.add(o,l),this.associations.set(l,this.associations.get(i))),i=l}e.material=i}getMaterialType(){return En}loadMaterial(e){let t=this,i=this.json,n=this.extensions,s=i.materials[e],a,o={},l=s.extensions||{},c=[];if(l[je.KHR_MATERIALS_UNLIT]){let u=n[je.KHR_MATERIALS_UNLIT];a=u.getMaterialType(),c.push(u.extendParams(o,s,t))}else{let u=s.pbrMetallicRoughness||{};if(o.color=new Me(1,1,1),o.opacity=1,Array.isArray(u.baseColorFactor)){let h=u.baseColorFactor;o.color.setRGB(h[0],h[1],h[2],_t),o.opacity=h[3]}u.baseColorTexture!==void 0&&c.push(t.assignTexture(o,"map",u.baseColorTexture,ft)),o.metalness=u.metallicFactor!==void 0?u.metallicFactor:1,o.roughness=u.roughnessFactor!==void 0?u.roughnessFactor:1,u.metallicRoughnessTexture!==void 0&&(c.push(t.assignTexture(o,"metalnessMap",u.metallicRoughnessTexture)),c.push(t.assignTexture(o,"roughnessMap",u.metallicRoughnessTexture))),a=this._invokeOne(function(h){return h.getMaterialType&&h.getMaterialType(e)}),c.push(Promise.all(this._invokeAll(function(h){return h.extendMaterialParams&&h.extendMaterialParams(e,o)})))}s.doubleSided===!0&&(o.side=bt);let d=s.alphaMode||lc.OPAQUE;if(d===lc.BLEND?(o.transparent=!0,o.depthWrite=!1):(o.transparent=!1,d===lc.MASK&&(o.alphaTest=s.alphaCutoff!==void 0?s.alphaCutoff:.5)),s.normalTexture!==void 0&&a!==jt&&(c.push(t.assignTexture(o,"normalMap",s.normalTexture)),o.normalScale=new Oe(1,1),s.normalTexture.scale!==void 0)){let u=s.normalTexture.scale;o.normalScale.set(u,u)}if(s.occlusionTexture!==void 0&&a!==jt&&(c.push(t.assignTexture(o,"aoMap",s.occlusionTexture)),s.occlusionTexture.strength!==void 0&&(o.aoMapIntensity=s.occlusionTexture.strength)),s.emissiveFactor!==void 0&&a!==jt){let u=s.emissiveFactor;o.emissive=new Me().setRGB(u[0],u[1],u[2],_t)}return s.emissiveTexture!==void 0&&a!==jt&&c.push(t.assignTexture(o,"emissiveMap",s.emissiveTexture,ft)),Promise.all(c).then(function(){let u=new a(o);return s.name&&(u.name=s.name),Li(u,s),t.associations.set(u,{materials:e}),s.extensions&&Hn(n,u,s),u})}createUniqueName(e){let t=it.sanitizeNodeName(e||"");return t in this.nodeNamesUsed?t+"_"+ ++this.nodeNamesUsed[t]:(this.nodeNamesUsed[t]=0,t)}loadGeometries(e){let t=this,i=this.extensions,n=this.primitiveCache;function s(o){return i[je.KHR_DRACO_MESH_COMPRESSION].decodePrimitive(o,t).then(function(l){return _h(l,o,t)})}let a=[];for(let o=0,l=e.length;o<l;o++){let c=e[o],d=wv(c),u=n[d];if(u)a.push(u.promise);else{let h;c.extensions&&c.extensions[je.KHR_DRACO_MESH_COMPRESSION]?h=s(c):h=_h(new Ct,c,t),n[d]={primitive:c,promise:h},a.push(h)}}return Promise.all(a)}loadMesh(e){let t=this,i=this.json,n=this.extensions,s=i.meshes[e],a=s.primitives,o=[];for(let l=0,c=a.length;l<c;l++){let d=a[l].material===void 0?vv(this.cache):this.getDependency("material",a[l].material);o.push(d)}return o.push(t.loadGeometries(a)),Promise.all(o).then(function(l){let c=l.slice(0,l.length-1),d=l[l.length-1],u=[];for(let m=0,y=d.length;m<y;m++){let b=d[m],p=a[m],f,x=c[m];if(p.mode===si.TRIANGLES||p.mode===si.TRIANGLE_STRIP||p.mode===si.TRIANGLE_FAN||p.mode===void 0)f=s.isSkinnedMesh===!0?new ns(b,x):new We(b,x),f.isSkinnedMesh===!0&&f.normalizeSkinWeights(),p.mode===si.TRIANGLE_STRIP?f.geometry=ac(f.geometry,Cs):p.mode===si.TRIANGLE_FAN&&(f.geometry=ac(f.geometry,Ar));else if(p.mode===si.LINES)f=new as(b,x);else if(p.mode===si.LINE_STRIP)f=new kn(b,x);else if(p.mode===si.LINE_LOOP)f=new os(b,x);else if(p.mode===si.POINTS)f=new ls(b,x);else throw new Error("THREE.GLTFLoader: Primitive mode unsupported: "+p.mode);Object.keys(f.geometry.morphAttributes).length>0&&xv(f,s),f.name=t.createUniqueName(s.name||"mesh_"+e),Li(f,s),p.extensions&&Hn(n,f,p),t.assignFinalMaterial(f),u.push(f)}for(let m=0,y=u.length;m<y;m++)t.associations.set(u[m],{meshes:e,primitives:m});if(u.length===1)return s.extensions&&Hn(n,u[0],s),u[0];let h=new pt;s.extensions&&Hn(n,h,s),t.associations.set(h,{meshes:e});for(let m=0,y=u.length;m<y;m++)h.add(u[m]);return h})}loadCamera(e){let t,i=this.json.cameras[e],n=i[i.type];if(!n){console.warn("THREE.GLTFLoader: Missing camera parameters.");return}return i.type==="perspective"?t=new xt(Ul.radToDeg(n.yfov),n.aspectRatio||1,n.znear||1,n.zfar||2e6):i.type==="orthographic"&&(t=new Pn(-n.xmag,n.xmag,n.ymag,-n.ymag,n.znear,n.zfar)),i.name&&(t.name=this.createUniqueName(i.name)),Li(t,i),Promise.resolve(t)}loadSkin(e){let t=this.json.skins[e],i=[];for(let n=0,s=t.joints.length;n<s;n++)i.push(this._loadNodeShallow(t.joints[n]));return t.inverseBindMatrices!==void 0?i.push(this.getDependency("accessor",t.inverseBindMatrices)):i.push(null),Promise.all(i).then(function(n){let s=n.pop(),a=n,o=[],l=[];for(let c=0,d=a.length;c<d;c++){let u=a[c];if(u){o.push(u);let h=new Be;s!==null&&h.fromArray(s.array,c*16),l.push(h)}else console.warn('THREE.GLTFLoader: Joint "%s" could not be found.',t.joints[c])}return new ss(o,l)})}loadAnimation(e){let t=this.json,i=this,n=t.animations[e],s=n.name?n.name:"animation_"+e,a=[],o=[],l=[],c=[],d=[];for(let u=0,h=n.channels.length;u<h;u++){let m=n.channels[u],y=n.samplers[m.sampler],b=m.target,p=b.node,f=n.parameters!==void 0?n.parameters[y.input]:y.input,x=n.parameters!==void 0?n.parameters[y.output]:y.output;b.node!==void 0&&(a.push(this.getDependency("node",p)),o.push(this.getDependency("accessor",f)),l.push(this.getDependency("accessor",x)),c.push(y),d.push(b))}return Promise.all([Promise.all(a),Promise.all(o),Promise.all(l),Promise.all(c),Promise.all(d)]).then(function(u){let h=u[0],m=u[1],y=u[2],b=u[3],p=u[4],f=[];for(let g=0,v=h.length;g<v;g++){let T=h[g],A=m[g],E=y[g],P=b[g],_=p[g];if(T===void 0)continue;T.updateMatrix&&T.updateMatrix();let M=i._createAnimationTracks(T,A,E,P,_);if(M)for(let R=0;R<M.length;R++)f.push(M[R])}let x=new Cn(s,void 0,f);return Li(x,n),x})}createNodeMesh(e){let t=this.json,i=this,n=t.nodes[e];return n.mesh===void 0?null:i.getDependency("mesh",n.mesh).then(function(s){let a=i._getNodeRef(i.meshCache,n.mesh,s);return n.weights!==void 0&&a.traverse(function(o){if(o.isMesh)for(let l=0,c=n.weights.length;l<c;l++)o.morphTargetInfluences[l]=n.weights[l]}),a})}loadNode(e){let t=this.json,i=this,n=t.nodes[e],s=i._loadNodeShallow(e),a=[],o=n.children||[];for(let c=0,d=o.length;c<d;c++)a.push(i.getDependency("node",o[c]));let l=n.skin===void 0?Promise.resolve(null):i.getDependency("skin",n.skin);return Promise.all([s,Promise.all(a),l]).then(function(c){let d=c[0],u=c[1],h=c[2];h!==null&&d.traverse(function(m){m.isSkinnedMesh&&m.bind(h,_v)});for(let m=0,y=u.length;m<y;m++)d.add(u[m]);return d})}_loadNodeShallow(e){let t=this.json,i=this.extensions,n=this;if(this.nodeCache[e]!==void 0)return this.nodeCache[e];let s=t.nodes[e],a=s.name?n.createUniqueName(s.name):"",o=[],l=n._invokeOne(function(c){return c.createNodeMesh&&c.createNodeMesh(e)});return l&&o.push(l),s.camera!==void 0&&o.push(n.getDependency("camera",s.camera).then(function(c){return n._getNodeRef(n.cameraCache,s.camera,c)})),n._invokeAll(function(c){return c.createNodeAttachment&&c.createNodeAttachment(e)}).forEach(function(c){o.push(c)}),this.nodeCache[e]=Promise.all(o).then(function(c){let d;if(s.isBone===!0?d=new mr:c.length>1?d=new pt:c.length===1?d=c[0]:d=new rt,d!==c[0])for(let u=0,h=c.length;u<h;u++)d.add(c[u]);if(s.name&&(d.userData.name=s.name,d.name=a),Li(d,s),s.extensions&&Hn(i,d,s),s.matrix!==void 0){let u=new Be;u.fromArray(s.matrix),d.applyMatrix4(u)}else s.translation!==void 0&&d.position.fromArray(s.translation),s.rotation!==void 0&&d.quaternion.fromArray(s.rotation),s.scale!==void 0&&d.scale.fromArray(s.scale);if(!n.associations.has(d))n.associations.set(d,{});else if(s.mesh!==void 0&&n.meshCache.refs[s.mesh]>1){let u=n.associations.get(d);n.associations.set(d,{...u})}return n.associations.get(d).nodes=e,d}),this.nodeCache[e]}loadScene(e){let t=this.extensions,i=this.json.scenes[e],n=this,s=new pt;i.name&&(s.name=n.createUniqueName(i.name)),Li(s,i),i.extensions&&Hn(t,s,i);let a=i.nodes||[],o=[];for(let l=0,c=a.length;l<c;l++)o.push(n.getDependency("node",a[l]));return Promise.all(o).then(function(l){for(let d=0,u=l.length;d<u;d++)s.add(l[d]);let c=d=>{let u=new Map;for(let[h,m]of n.associations)(h instanceof Ht||h instanceof St)&&u.set(h,m);return d.traverse(h=>{let m=n.associations.get(h);m!=null&&u.set(h,m)}),u};return n.associations=c(s),s})}_createAnimationTracks(e,t,i,n,s){let a=[],o=e.name?e.name:e.uuid,l=[];un[s.path]===un.weights?e.traverse(function(h){h.morphTargetInfluences&&l.push(h.name?h.name:h.uuid)}):l.push(o);let c;switch(un[s.path]){case un.weights:c=Ei;break;case un.rotation:c=Ci;break;case un.translation:case un.scale:c=Ri;break;default:switch(i.itemSize){case 1:c=Ei;break;case 2:case 3:default:c=Ri;break}break}let d=n.interpolation!==void 0?bv[n.interpolation]:Sn,u=this._getArrayFromAccessor(i);for(let h=0,m=l.length;h<m;h++){let y=new c(l[h]+"."+un[s.path],t.array,u,d);n.interpolation==="CUBICSPLINE"&&this._createCubicSplineTrackInterpolant(y),a.push(y)}return a}_getArrayFromAccessor(e){let t=e.array;if(e.normalized){let i=Lc(t.constructor),n=new Float32Array(t.length);for(let s=0,a=t.length;s<a;s++)n[s]=t[s]*i;t=n}return t}_createCubicSplineTrackInterpolant(e){e.createInterpolant=function(i){let n=this instanceof Ci?Pc:Ro;return new n(this.times,this.values,this.getValueSize()/3,i)},e.createInterpolant.isInterpolantFactoryMethodGLTFCubicSpline=!0}};function Sv(r,e,t){let i=e.attributes,n=new Pt;if(i.POSITION!==void 0){let o=t.json.accessors[i.POSITION],l=o.min,c=o.max;if(l!==void 0&&c!==void 0){if(n.set(new L(l[0],l[1],l[2]),new L(c[0],c[1],c[2])),o.normalized){let d=Lc(Ir[o.componentType]);n.min.multiplyScalar(d),n.max.multiplyScalar(d)}}else{console.warn("THREE.GLTFLoader: Missing min/max properties for accessor POSITION.");return}}else return;let s=e.targets;if(s!==void 0){let o=new L,l=new L;for(let c=0,d=s.length;c<d;c++){let u=s[c];if(u.POSITION!==void 0){let h=t.json.accessors[u.POSITION],m=h.min,y=h.max;if(m!==void 0&&y!==void 0){if(l.setX(Math.max(Math.abs(m[0]),Math.abs(y[0]))),l.setY(Math.max(Math.abs(m[1]),Math.abs(y[1]))),l.setZ(Math.max(Math.abs(m[2]),Math.abs(y[2]))),h.normalized){let b=Lc(Ir[h.componentType]);l.multiplyScalar(b)}o.max(l)}else console.warn("THREE.GLTFLoader: Missing min/max properties for accessor POSITION.")}}n.expandByVector(o)}r.boundingBox=n;let a=new qt;n.getCenter(a.center),a.radius=n.min.distanceTo(n.max)/2,r.boundingSphere=a}function _h(r,e,t){let i=e.attributes,n=[];function s(a,o){return t.getDependency("accessor",a).then(function(l){r.setAttribute(o,l)})}for(let a in i){let o=Oc[a]||a.toLowerCase();o in r.attributes||n.push(s(i[a],o))}if(e.indices!==void 0&&!r.index){let a=t.getDependency("accessor",e.indices).then(function(o){r.setIndex(o)});n.push(a)}return Ve.workingColorSpace!==_t&&"COLOR_0"in i&&console.warn(`THREE.GLTFLoader: Converting vertex colors from "srgb-linear" to "${Ve.workingColorSpace}" not supported.`),Li(r,e),Sv(r,e,t),Promise.all(n).then(function(){return e.targets!==void 0?gv(r,e.targets,t):r})}var Fc=(function(){var r="b9H79Tebbbe8Fv9Gbb9Gvuuuuueu9Giuuub9Geueu9Giuuueuikqbeeedddillviebeoweuec:q:Odkr;leDo9TW9T9VV95dbH9F9F939H79T9F9J9H229F9Jt9VV7bb8A9TW79O9V9Wt9F9KW9J9V9KW9wWVtW949c919M9MWVbeY9TW79O9V9Wt9F9KW9J9V9KW69U9KW949c919M9MWVbdE9TW79O9V9Wt9F9KW9J9V9KW69U9KW949tWG91W9U9JWbiL9TW79O9V9Wt9F9KW9J9V9KWS9P2tWV9p9JtblK9TW79O9V9Wt9F9KW9J9V9KWS9P2tWV9r919HtbvL9TW79O9V9Wt9F9KW9J9V9KWS9P2tWVT949Wbol79IV9Rbrq;w8Wqdbk;esezu8Jjjjjbcj;eb9Rgv8Kjjjjbc9:hodnadcefal0mbcuhoaiRbbc:Ge9hmbavaialfgrad9Radz1jjjbhwcj;abad9Uc;WFbGgocjdaocjd6EhDaicefhocbhqdnindndndnaeaq9nmbaDaeaq9RaqaDfae6Egkcsfglcl4cifcd4hxalc9WGgmTmecbhPawcjdfhsaohzinaraz9Rax6mvarazaxfgo9RcK6mvczhlcbhHinalgic9WfgOawcj;cbffhldndndndndnazaOco4fRbbaHcoG4ciGPlbedibkal9cb83ibalcwf9cb83ibxikalaoRblaoRbbgOco4gAaAciSgAE86bbawcj;cbfaifglcGfaoclfaAfgARbbaOcl4ciGgCaCciSgCE86bbalcVfaAaCfgARbbaOcd4ciGgCaCciSgCE86bbalc7faAaCfgARbbaOciGgOaOciSgOE86bbalctfaAaOfgARbbaoRbegOco4gCaCciSgCE86bbalc91faAaCfgARbbaOcl4ciGgCaCciSgCE86bbalc4faAaCfgARbbaOcd4ciGgCaCciSgCE86bbalc93faAaCfgARbbaOciGgOaOciSgOE86bbalc94faAaOfgARbbaoRbdgOco4gCaCciSgCE86bbalc95faAaCfgARbbaOcl4ciGgCaCciSgCE86bbalc96faAaCfgARbbaOcd4ciGgCaCciSgCE86bbalc97faAaCfgARbbaOciGgOaOciSgOE86bbalc98faAaOfgORbbaoRbigoco4gAaAciSgAE86bbalc99faOaAfgORbbaocl4ciGgAaAciSgAE86bbalc9:faOaAfgORbbaocd4ciGgAaAciSgAE86bbalcufaOaAfglRbbaociGgoaociSgoE86bbalaofhoxdkalaoRbwaoRbbgOcl4gAaAcsSgAE86bbawcj;cbfaifglcGfaocwfaAfgARbbaOcsGgOaOcsSgOE86bbalcVfaAaOfgORbbaoRbegAcl4gCaCcsSgCE86bbalc7faOaCfgORbbaAcsGgAaAcsSgAE86bbalctfaOaAfgORbbaoRbdgAcl4gCaCcsSgCE86bbalc91faOaCfgORbbaAcsGgAaAcsSgAE86bbalc4faOaAfgORbbaoRbigAcl4gCaCcsSgCE86bbalc93faOaCfgORbbaAcsGgAaAcsSgAE86bbalc94faOaAfgORbbaoRblgAcl4gCaCcsSgCE86bbalc95faOaCfgORbbaAcsGgAaAcsSgAE86bbalc96faOaAfgORbbaoRbvgAcl4gCaCcsSgCE86bbalc97faOaCfgORbbaAcsGgAaAcsSgAE86bbalc98faOaAfgORbbaoRbogAcl4gCaCcsSgCE86bbalc99faOaCfgORbbaAcsGgAaAcsSgAE86bbalc9:faOaAfgORbbaoRbrgocl4gAaAcsSgAE86bbalcufaOaAfglRbbaocsGgoaocsSgoE86bbalaofhoxekalao8Pbb83bbalcwfaocwf8Pbb83bbaoczfhokdnaiam9pmbaHcdfhHaiczfhlarao9RcL0mekkaiam6mvaoTmvdnakTmbawaPfRbbhHawcj;cbfhlashiakhOinaialRbbgzce4cbazceG9R7aHfgH86bbaiadfhialcefhlaOcufgOmbkkascefhsaohzaPcefgPad9hmbxikkcbc99arao9Radcaadca0ESEhoxlkaoaxad2fhCdnakmbadhlinaoTmlarao9Rax6mlaoaxfhoalcufglmbkaChoxekcbhmawcjdfhAinarao9Rax6miawamfRbbhHawcj;cbfhlaAhiakhOinaialRbbgzce4cbazceG9R7aHfgH86bbaiadfhialcefhlaOcufgOmbkaAcefhAaoaxfhoamcefgmad9hmbkaChokabaqad2fawcjdfakad2z1jjjb8Aawawcjdfakcufad2fadz1jjjb8Aakaqfhqaombkc9:hoxekc9:hokavcj;ebf8Kjjjjbaok;cseHu8Jjjjjbc;ae9Rgv8Kjjjjbc9:hodnaeci9UgrcHfal0mbcuhoaiRbbgwc;WeGc;Ge9hmbawcsGgwce0mbavc;abfcFecjez:jjjjb8AavcUf9cu83ibavc8Wf9cu83ibavcyf9cu83ibavcaf9cu83ibavcKf9cu83ibavczf9cu83ibav9cu83iwav9cu83ibaialfc9WfhDaicefgqarfhidnaeTmbcmcsawceSEhkcbhxcbhmcbhPcbhwcbhlindnaiaD9nmbc9:hoxikdndnaqRbbgoc;Ve0mbavc;abfalaocu7gscl4fcsGcitfgzydlhrazydbhzdnaocsGgHak9pmbavawasfcsGcdtfydbaxaHEhoaHThsdndnadcd9hmbabaPcetfgHaz87ebaHclfao87ebaHcdfar87ebxekabaPcdtfgHazBdbaHcwfaoBdbaHclfarBdbkaxasfhxcdhHavawcdtfaoBdbawasfhwcehsalhOxdkdndnaHcsSmbaHc987aHamffcefhoxekaicefhoai8SbbgHcFeGhsdndnaHcu9mmbaohixekaicvfhiascFbGhscrhHdninao8SbbgOcFbGaHtasVhsaOcu9kmeaocefhoaHcrfgHc8J9hmbxdkkaocefhikasce4cbasceG9R7amfhokdndnadcd9hmbabaPcetfgHaz87ebaHclfao87ebaHcdfar87ebxekabaPcdtfgHazBdbaHcwfaoBdbaHclfarBdbkcdhHavawcdtfaoBdbcehsawcefhwalhOaohmxekdnaocpe0mbaxcefgHavawaDaocsGfRbbgocl49RcsGcdtfydbaocz6gzEhravawao9RcsGcdtfydbaHazfgAaocsGgHEhoaHThCdndnadcd9hmbabaPcetfgHax87ebaHclfao87ebaHcdfar87ebxekabaPcdtfgHaxBdbaHcwfaoBdbaHclfarBdbkcdhsavawcdtfaxBdbavawcefgwcsGcdtfarBdbcihHavc;abfalcitfgOaxBdlaOarBdbavawazfgwcsGcdtfaoBdbalcefcsGhOawaCfhwaxhzaAaCfhxxekaxcbaiRbbgOEgzaoc;:eSgHfhraOcsGhCaOcl4hAdndnaOcs0mbarcefhoxekarhoavawaA9RcsGcdtfydbhrkdndnaCmbaocefhxxekaohxavawaO9RcsGcdtfydbhokdndnaHTmbaicefhHxekaicdfhHai8SbegscFeGhzdnascu9kmbaicofhXazcFbGhzcrhidninaH8SbbgscFbGaitazVhzascu9kmeaHcefhHaicrfgic8J9hmbkaXhHxekaHcefhHkazce4cbazceG9R7amfgmhzkdndnaAcsSmbaHhsxekaHcefhsaH8SbbgicFeGhrdnaicu9kmbaHcvfhXarcFbGhrcrhidninas8SbbgHcFbGaitarVhraHcu9kmeascefhsaicrfgic8J9hmbkaXhsxekascefhskarce4cbarceG9R7amfgmhrkdndnaCcsSmbashixekascefhias8SbbgocFeGhHdnaocu9kmbascvfhXaHcFbGhHcrhodninai8SbbgscFbGaotaHVhHascu9kmeaicefhiaocrfgoc8J9hmbkaXhixekaicefhikaHce4cbaHceG9R7amfgmhokdndnadcd9hmbabaPcetfgHaz87ebaHclfao87ebaHcdfar87ebxekabaPcdtfgHazBdbaHcwfaoBdbaHclfarBdbkcdhsavawcdtfazBdbavawcefgwcsGcdtfarBdbcihHavc;abfalcitfgXazBdlaXarBdbavawaOcz6aAcsSVfgwcsGcdtfaoBdbawaCTaCcsSVfhwalcefcsGhOkaqcefhqavc;abfaOcitfgOarBdlaOaoBdbavc;abfalasfcsGcitfgraoBdlarazBdbawcsGhwalaHfcsGhlaPcifgPae6mbkkcbc99aiaDSEhokavc;aef8Kjjjjbaok:flevu8Jjjjjbcz9Rhvc9:hodnaecvfal0mbcuhoaiRbbc;:eGc;qe9hmbav9cb83iwaicefhraialfc98fhwdnaeTmbdnadcdSmbcbhDindnaraw6mbc9:skarcefhoar8SbbglcFeGhidndnalcu9mmbaohrxekarcvfhraicFbGhicrhldninao8SbbgdcFbGaltaiVhiadcu9kmeaocefhoalcrfglc8J9hmbxdkkaocefhrkabaDcdtfaic8Etc8F91aicd47avcwfaiceGcdtVgoydbfglBdbaoalBdbaDcefgDae9hmbxdkkcbhDindnaraw6mbc9:skarcefhoar8SbbglcFeGhidndnalcu9mmbaohrxekarcvfhraicFbGhicrhldninao8SbbgdcFbGaltaiVhiadcu9kmeaocefhoalcrfglc8J9hmbxdkkaocefhrkabaDcetfaic8Etc8F91aicd47avcwfaiceGcdtVgoydbfgl87ebaoalBdbaDcefgDae9hmbkkcbc99arawSEhokaok:Lvoeue99dud99eud99dndnadcl9hmbaeTmeindndnabcdfgd8Sbb:Yab8Sbbgi:Ygl:l:tabcefgv8Sbbgo:Ygr:l:tgwJbb;:9cawawNJbbbbawawJbbbb9GgDEgq:mgkaqaicb9iEalMgwawNakaqaocb9iEarMgqaqNMM:r:vglNJbbbZJbbb:;aDEMgr:lJbbb9p9DTmbar:Ohixekcjjjj94hikadai86bbdndnaqalNJbbbZJbbb:;aqJbbbb9GEMgq:lJbbb9p9DTmbaq:Ohdxekcjjjj94hdkavad86bbdndnawalNJbbbZJbbb:;awJbbbb9GEMgw:lJbbb9p9DTmbaw:Ohdxekcjjjj94hdkabad86bbabclfhbaecufgembxdkkaeTmbindndnabclfgd8Ueb:Yab8Uebgi:Ygl:l:tabcdfgv8Uebgo:Ygr:l:tgwJb;:FSawawNJbbbbawawJbbbb9GgDEgq:mgkaqaicb9iEalMgwawNakaqaocb9iEarMgqaqNMM:r:vglNJbbbZJbbb:;aDEMgr:lJbbb9p9DTmbar:Ohixekcjjjj94hikadai87ebdndnaqalNJbbbZJbbb:;aqJbbbb9GEMgq:lJbbb9p9DTmbaq:Ohdxekcjjjj94hdkavad87ebdndnawalNJbbbZJbbb:;awJbbbb9GEMgw:lJbbb9p9DTmbaw:Ohdxekcjjjj94hdkabad87ebabcwfhbaecufgembkkk;oiliui99iue99dnaeTmbcbhiabhlindndnJ;Zl81Zalcof8UebgvciV:Y:vgoal8Ueb:YNgrJb;:FSNJbbbZJbbb:;arJbbbb9GEMgw:lJbbb9p9DTmbaw:OhDxekcjjjj94hDkalclf8Uebhqalcdf8UebhkabaiavcefciGfcetfaD87ebdndnaoak:YNgwJb;:FSNJbbbZJbbb:;awJbbbb9GEMgx:lJbbb9p9DTmbax:OhDxekcjjjj94hDkabaiavciGfgkcd7cetfaD87ebdndnaoaq:YNgoJb;:FSNJbbbZJbbb:;aoJbbbb9GEMgx:lJbbb9p9DTmbax:OhDxekcjjjj94hDkabaiavcufciGfcetfaD87ebdndnJbbjZararN:tawawN:taoaoN:tgrJbbbbarJbbbb9GE:rJb;:FSNJbbbZMgr:lJbbb9p9DTmbar:Ohvxekcjjjj94hvkabakcetfav87ebalcwfhlaiclfhiaecufgembkkk9mbdnadcd4ae2gdTmbinababydbgecwtcw91:Yaece91cjjj98Gcjjj;8if::NUdbabclfhbadcufgdmbkkk9teiucbcbydj1jjbgeabcifc98GfgbBdj1jjbdndnabZbcztgd9nmbcuhiabad9RcFFifcz4nbcuSmekaehikaik;LeeeudndnaeabVciGTmbabhixekdndnadcz9pmbabhixekabhiinaiaeydbBdbaiclfaeclfydbBdbaicwfaecwfydbBdbaicxfaecxfydbBdbaeczfheaiczfhiadc9Wfgdcs0mbkkadcl6mbinaiaeydbBdbaeclfheaiclfhiadc98fgdci0mbkkdnadTmbinaiaeRbb86bbaicefhiaecefheadcufgdmbkkabk;aeedudndnabciGTmbabhixekaecFeGc:b:c:ew2hldndnadcz9pmbabhixekabhiinaialBdbaicxfalBdbaicwfalBdbaiclfalBdbaiczfhiadc9Wfgdcs0mbkkadcl6mbinaialBdbaiclfhiadc98fgdci0mbkkdnadTmbinaiae86bbaicefhiadcufgdmbkkabkkkebcjwklzNbb",e="b9H79TebbbeKl9Gbb9Gvuuuuueu9Giuuub9Geueuikqbbebeedddilve9Weeeviebeoweuec:q:6dkr;leDo9TW9T9VV95dbH9F9F939H79T9F9J9H229F9Jt9VV7bb8A9TW79O9V9Wt9F9KW9J9V9KW9wWVtW949c919M9MWVbdY9TW79O9V9Wt9F9KW9J9V9KW69U9KW949c919M9MWVblE9TW79O9V9Wt9F9KW9J9V9KW69U9KW949tWG91W9U9JWbvL9TW79O9V9Wt9F9KW9J9V9KWS9P2tWV9p9JtboK9TW79O9V9Wt9F9KW9J9V9KWS9P2tWV9r919HtbrL9TW79O9V9Wt9F9KW9J9V9KWS9P2tWVT949Wbwl79IV9RbDq:p9sqlbzik9:evu8Jjjjjbcz9Rhbcbheincbhdcbhiinabcwfadfaicjuaead4ceGglE86bbaialfhiadcefgdcw9hmbkaec:q:yjjbfai86bbaecitc:q1jjbfab8Piw83ibaecefgecjd9hmbkk:N8JlHud97euo978Jjjjjbcj;kb9Rgv8Kjjjjbc9:hodnadcefal0mbcuhoaiRbbc:Ge9hmbavaialfgrad9Rad;8qbbcj;abad9UhlaicefhodnaeTmbadTmbalc;WFbGglcjdalcjd6EhwcbhDinawaeaD9RaDawfae6Egqcsfglc9WGgkci2hxakcethmalcl4cifcd4hPabaDad2fhsakc;ab6hzcbhHincbhOaohAdndninaraA9RaP6meavcj;cbfaOak2fhCaAaPfhocbhidnazmbarao9Rc;Gb6mbcbhlinaCalfhidndndndndnaAalco4fRbbgXciGPlbedibkaipxbbbbbbbbbbbbbbbbpklbxikaiaopbblaopbbbgQclp:meaQpmbzeHdOiAlCvXoQrLgQcdp:meaQpmbzeHdOiAlCvXoQrLpxiiiiiiiiiiiiiiiip9ogLpxiiiiiiiiiiiiiiiip8JgQp5b9cjF;8;4;W;G;ab9:9cU1:NgKcitc:q1jjbfpbibaKc:q:yjjbfpbbbgYaYpmbbbbbbbbbbbbbbbbaQp5e9cjF;8;4;W;G;ab9:9cU1:NgKcitc:q1jjbfpbibp9UpmbedilvorzHOACXQLpPaLaQp9spklbaoclfaYpQbfaKc:q:yjjbfRbbfhoxdkaiaopbbwaopbbbgQclp:meaQpmbzeHdOiAlCvXoQrLpxssssssssssssssssp9ogLpxssssssssssssssssp8JgQp5b9cjF;8;4;W;G;ab9:9cU1:NgKcitc:q1jjbfpbibaKc:q:yjjbfpbbbgYaYpmbbbbbbbbbbbbbbbbaQp5e9cjF;8;4;W;G;ab9:9cU1:NgKcitc:q1jjbfpbibp9UpmbedilvorzHOACXQLpPaLaQp9spklbaocwfaYpQbfaKc:q:yjjbfRbbfhoxekaiaopbbbpklbaoczfhokdndndndndnaXcd4ciGPlbedibkaipxbbbbbbbbbbbbbbbbpklzxikaiaopbblaopbbbgQclp:meaQpmbzeHdOiAlCvXoQrLgQcdp:meaQpmbzeHdOiAlCvXoQrLpxiiiiiiiiiiiiiiiip9ogLpxiiiiiiiiiiiiiiiip8JgQp5b9cjF;8;4;W;G;ab9:9cU1:NgKcitc:q1jjbfpbibaKc:q:yjjbfpbbbgYaYpmbbbbbbbbbbbbbbbbaQp5e9cjF;8;4;W;G;ab9:9cU1:NgKcitc:q1jjbfpbibp9UpmbedilvorzHOACXQLpPaLaQp9spklzaoclfaYpQbfaKc:q:yjjbfRbbfhoxdkaiaopbbwaopbbbgQclp:meaQpmbzeHdOiAlCvXoQrLpxssssssssssssssssp9ogLpxssssssssssssssssp8JgQp5b9cjF;8;4;W;G;ab9:9cU1:NgKcitc:q1jjbfpbibaKc:q:yjjbfpbbbgYaYpmbbbbbbbbbbbbbbbbaQp5e9cjF;8;4;W;G;ab9:9cU1:NgKcitc:q1jjbfpbibp9UpmbedilvorzHOACXQLpPaLaQp9spklzaocwfaYpQbfaKc:q:yjjbfRbbfhoxekaiaopbbbpklzaoczfhokdndndndndnaXcl4ciGPlbedibkaipxbbbbbbbbbbbbbbbbpklaxikaiaopbblaopbbbgQclp:meaQpmbzeHdOiAlCvXoQrLgQcdp:meaQpmbzeHdOiAlCvXoQrLpxiiiiiiiiiiiiiiiip9ogLpxiiiiiiiiiiiiiiiip8JgQp5b9cjF;8;4;W;G;ab9:9cU1:NgKcitc:q1jjbfpbibaKc:q:yjjbfpbbbgYaYpmbbbbbbbbbbbbbbbbaQp5e9cjF;8;4;W;G;ab9:9cU1:NgKcitc:q1jjbfpbibp9UpmbedilvorzHOACXQLpPaLaQp9spklaaoclfaYpQbfaKc:q:yjjbfRbbfhoxdkaiaopbbwaopbbbgQclp:meaQpmbzeHdOiAlCvXoQrLpxssssssssssssssssp9ogLpxssssssssssssssssp8JgQp5b9cjF;8;4;W;G;ab9:9cU1:NgKcitc:q1jjbfpbibaKc:q:yjjbfpbbbgYaYpmbbbbbbbbbbbbbbbbaQp5e9cjF;8;4;W;G;ab9:9cU1:NgKcitc:q1jjbfpbibp9UpmbedilvorzHOACXQLpPaLaQp9spklaaocwfaYpQbfaKc:q:yjjbfRbbfhoxekaiaopbbbpklaaoczfhokdndndndndnaXco4Plbedibkaipxbbbbbbbbbbbbbbbbpkl8WxikaiaopbblaopbbbgQclp:meaQpmbzeHdOiAlCvXoQrLgQcdp:meaQpmbzeHdOiAlCvXoQrLpxiiiiiiiiiiiiiiiip9ogLpxiiiiiiiiiiiiiiiip8JgQp5b9cjF;8;4;W;G;ab9:9cU1:NgXcitc:q1jjbfpbibaXc:q:yjjbfpbbbgYaYpmbbbbbbbbbbbbbbbbaQp5e9cjF;8;4;W;G;ab9:9cU1:NgXcitc:q1jjbfpbibp9UpmbedilvorzHOACXQLpPaLaQp9spkl8WaoclfaYpQbfaXc:q:yjjbfRbbfhoxdkaiaopbbwaopbbbgQclp:meaQpmbzeHdOiAlCvXoQrLpxssssssssssssssssp9ogLpxssssssssssssssssp8JgQp5b9cjF;8;4;W;G;ab9:9cU1:NgXcitc:q1jjbfpbibaXc:q:yjjbfpbbbgYaYpmbbbbbbbbbbbbbbbbaQp5e9cjF;8;4;W;G;ab9:9cU1:NgXcitc:q1jjbfpbibp9UpmbedilvorzHOACXQLpPaLaQp9spkl8WaocwfaYpQbfaXc:q:yjjbfRbbfhoxekaiaopbbbpkl8Waoczfhokalc;abfhialcjefak0meaihlarao9Rc;Fb0mbkkdnaiak9pmbaici4hlinarao9RcK6miaCaifhXdndndndndnaAaico4fRbbalcoG4ciGPlbedibkaXpxbbbbbbbbbbbbbbbbpkbbxikaXaopbblaopbbbgQclp:meaQpmbzeHdOiAlCvXoQrLgQcdp:meaQpmbzeHdOiAlCvXoQrLpxiiiiiiiiiiiiiiiip9ogLpxiiiiiiiiiiiiiiiip8JgQp5b9cjF;8;4;W;G;ab9:9cU1:NgKcitc:q1jjbfpbibaKc:q:yjjbfpbbbgYaYpmbbbbbbbbbbbbbbbbaQp5e9cjF;8;4;W;G;ab9:9cU1:NgKcitc:q1jjbfpbibp9UpmbedilvorzHOACXQLpPaLaQp9spkbbaoclfaYpQbfaKc:q:yjjbfRbbfhoxdkaXaopbbwaopbbbgQclp:meaQpmbzeHdOiAlCvXoQrLpxssssssssssssssssp9ogLpxssssssssssssssssp8JgQp5b9cjF;8;4;W;G;ab9:9cU1:NgKcitc:q1jjbfpbibaKc:q:yjjbfpbbbgYaYpmbbbbbbbbbbbbbbbbaQp5e9cjF;8;4;W;G;ab9:9cU1:NgKcitc:q1jjbfpbibp9UpmbedilvorzHOACXQLpPaLaQp9spkbbaocwfaYpQbfaKc:q:yjjbfRbbfhoxekaXaopbbbpkbbaoczfhokalcdfhlaiczfgiak6mbkkaoTmeaohAaOcefgOclSmdxbkkc9:hoxlkdnakTmbavcjdfaHfhiavaHfpbdbhYcbhXinaiavcj;cbfaXfglpblbgLcep9TaLpxeeeeeeeeeeeeeeeegQp9op9Hp9rgLalakfpblbg8Acep9Ta8AaQp9op9Hp9rg8ApmbzeHdOiAlCvXoQrLgEalamfpblbg3cep9Ta3aQp9op9Hp9rg3alaxfpblbg5cep9Ta5aQp9op9Hp9rg5pmbzeHdOiAlCvXoQrLg8EpmbezHdiOAlvCXorQLgQaQpmbedibedibedibediaYp9UgYp9AdbbaiadfglaYaQaQpmlvorlvorlvorlvorp9UgYp9AdbbaladfglaYaQaQpmwDqkwDqkwDqkwDqkp9UgYp9AdbbaladfglaYaQaQpmxmPsxmPsxmPsxmPsp9UgYp9AdbbaladfglaYaEa8EpmwDKYqk8AExm35Ps8E8FgQaQpmbedibedibedibedip9UgYp9AdbbaladfglaYaQaQpmlvorlvorlvorlvorp9UgYp9AdbbaladfglaYaQaQpmwDqkwDqkwDqkwDqkp9UgYp9AdbbaladfglaYaQaQpmxmPsxmPsxmPsxmPsp9UgYp9AdbbaladfglaYaLa8ApmwKDYq8AkEx3m5P8Es8FgLa3a5pmwKDYq8AkEx3m5P8Es8Fg8ApmbezHdiOAlvCXorQLgQaQpmbedibedibedibedip9UgYp9AdbbaladfglaYaQaQpmlvorlvorlvorlvorp9UgYp9AdbbaladfglaYaQaQpmwDqkwDqkwDqkwDqkp9UgYp9AdbbaladfglaYaQaQpmxmPsxmPsxmPsxmPsp9UgYp9AdbbaladfglaYaLa8ApmwDKYqk8AExm35Ps8E8FgQaQpmbedibedibedibedip9UgYp9AdbbaladfglaYaQaQpmlvorlvorlvorlvorp9UgYp9AdbbaladfglaYaQaQpmwDqkwDqkwDqkwDqkp9UgYp9AdbbaladfglaYaQaQpmxmPsxmPsxmPsxmPsp9UgYp9AdbbaladfhiaXczfgXak6mbkkaHclfgHad6mbkasavcjdfaqad2;8qbbavavcjdfaqcufad2fad;8qbbaqaDfgDae6mbkkcbc99arao9Radcaadca0ESEhokavcj;kbf8Kjjjjbaokwbz:bjjjbk::seHu8Jjjjjbc;ae9Rgv8Kjjjjbc9:hodnaeci9UgrcHfal0mbcuhoaiRbbgwc;WeGc;Ge9hmbawcsGgwce0mbavc;abfcFecje;8kbavcUf9cu83ibavc8Wf9cu83ibavcyf9cu83ibavcaf9cu83ibavcKf9cu83ibavczf9cu83ibav9cu83iwav9cu83ibaialfc9WfhDaicefgqarfhidnaeTmbcmcsawceSEhkcbhxcbhmcbhPcbhwcbhlindnaiaD9nmbc9:hoxikdndnaqRbbgoc;Ve0mbavc;abfalaocu7gscl4fcsGcitfgzydlhrazydbhzdnaocsGgHak9pmbavawasfcsGcdtfydbaxaHEhoaHThsdndnadcd9hmbabaPcetfgHaz87ebaHclfao87ebaHcdfar87ebxekabaPcdtfgHazBdbaHcwfaoBdbaHclfarBdbkaxasfhxcdhHavawcdtfaoBdbawasfhwcehsalhOxdkdndnaHcsSmbaHc987aHamffcefhoxekaicefhoai8SbbgHcFeGhsdndnaHcu9mmbaohixekaicvfhiascFbGhscrhHdninao8SbbgOcFbGaHtasVhsaOcu9kmeaocefhoaHcrfgHc8J9hmbxdkkaocefhikasce4cbasceG9R7amfhokdndnadcd9hmbabaPcetfgHaz87ebaHclfao87ebaHcdfar87ebxekabaPcdtfgHazBdbaHcwfaoBdbaHclfarBdbkcdhHavawcdtfaoBdbcehsawcefhwalhOaohmxekdnaocpe0mbaxcefgHavawaDaocsGfRbbgocl49RcsGcdtfydbaocz6gzEhravawao9RcsGcdtfydbaHazfgAaocsGgHEhoaHThCdndnadcd9hmbabaPcetfgHax87ebaHclfao87ebaHcdfar87ebxekabaPcdtfgHaxBdbaHcwfaoBdbaHclfarBdbkcdhsavawcdtfaxBdbavawcefgwcsGcdtfarBdbcihHavc;abfalcitfgOaxBdlaOarBdbavawazfgwcsGcdtfaoBdbalcefcsGhOawaCfhwaxhzaAaCfhxxekaxcbaiRbbgOEgzaoc;:eSgHfhraOcsGhCaOcl4hAdndnaOcs0mbarcefhoxekarhoavawaA9RcsGcdtfydbhrkdndnaCmbaocefhxxekaohxavawaO9RcsGcdtfydbhokdndnaHTmbaicefhHxekaicdfhHai8SbegscFeGhzdnascu9kmbaicofhXazcFbGhzcrhidninaH8SbbgscFbGaitazVhzascu9kmeaHcefhHaicrfgic8J9hmbkaXhHxekaHcefhHkazce4cbazceG9R7amfgmhzkdndnaAcsSmbaHhsxekaHcefhsaH8SbbgicFeGhrdnaicu9kmbaHcvfhXarcFbGhrcrhidninas8SbbgHcFbGaitarVhraHcu9kmeascefhsaicrfgic8J9hmbkaXhsxekascefhskarce4cbarceG9R7amfgmhrkdndnaCcsSmbashixekascefhias8SbbgocFeGhHdnaocu9kmbascvfhXaHcFbGhHcrhodninai8SbbgscFbGaotaHVhHascu9kmeaicefhiaocrfgoc8J9hmbkaXhixekaicefhikaHce4cbaHceG9R7amfgmhokdndnadcd9hmbabaPcetfgHaz87ebaHclfao87ebaHcdfar87ebxekabaPcdtfgHazBdbaHcwfaoBdbaHclfarBdbkcdhsavawcdtfazBdbavawcefgwcsGcdtfarBdbcihHavc;abfalcitfgXazBdlaXarBdbavawaOcz6aAcsSVfgwcsGcdtfaoBdbawaCTaCcsSVfhwalcefcsGhOkaqcefhqavc;abfaOcitfgOarBdlaOaoBdbavc;abfalasfcsGcitfgraoBdlarazBdbawcsGhwalaHfcsGhlaPcifgPae6mbkkcbc99aiaDSEhokavc;aef8Kjjjjbaok:flevu8Jjjjjbcz9Rhvc9:hodnaecvfal0mbcuhoaiRbbc;:eGc;qe9hmbav9cb83iwaicefhraialfc98fhwdnaeTmbdnadcdSmbcbhDindnaraw6mbc9:skarcefhoar8SbbglcFeGhidndnalcu9mmbaohrxekarcvfhraicFbGhicrhldninao8SbbgdcFbGaltaiVhiadcu9kmeaocefhoalcrfglc8J9hmbxdkkaocefhrkabaDcdtfaic8Etc8F91aicd47avcwfaiceGcdtVgoydbfglBdbaoalBdbaDcefgDae9hmbxdkkcbhDindnaraw6mbc9:skarcefhoar8SbbglcFeGhidndnalcu9mmbaohrxekarcvfhraicFbGhicrhldninao8SbbgdcFbGaltaiVhiadcu9kmeaocefhoalcrfglc8J9hmbxdkkaocefhrkabaDcetfaic8Etc8F91aicd47avcwfaiceGcdtVgoydbfgl87ebaoalBdbaDcefgDae9hmbkkcbc99arawSEhokaok:wPliuo97eue978Jjjjjbca9Rhiaec98Ghldndnadcl9hmbdnalTmbcbhvabhdinadadpbbbgocKp:RecKp:Sep;6egraocwp:RecKp:Sep;6earp;Geaoczp:RecKp:Sep;6egwp;Gep;Kep;LegDpxbbbbbbbbbbbbbbbbp:2egqarpxbbbjbbbjbbbjbbbjgkp9op9rp;Kegrpxbb;:9cbb;:9cbb;:9cbb;:9cararp;MeaDaDp;Meawaqawakp9op9rp;Kegrarp;Mep;Kep;Kep;Jep;Negwp;Mepxbbn0bbn0bbn0bbn0gqp;KepxFbbbFbbbFbbbFbbbp9oaopxbbbFbbbFbbbFbbbFp9op9qarawp;Meaqp;Kecwp:RepxbFbbbFbbbFbbbFbbp9op9qaDawp;Meaqp;Keczp:RepxbbFbbbFbbbFbbbFbp9op9qpkbbadczfhdavclfgval6mbkkalaeSmeaipxbbbbbbbbbbbbbbbbgqpklbaiabalcdtfgdaeciGglcdtgv;8qbbdnalTmbaiaipblbgocKp:RecKp:Sep;6egraocwp:RecKp:Sep;6earp;Geaoczp:RecKp:Sep;6egwp;Gep;Kep;LegDaqp:2egqarpxbbbjbbbjbbbjbbbjgkp9op9rp;Kegrpxbb;:9cbb;:9cbb;:9cbb;:9cararp;MeaDaDp;Meawaqawakp9op9rp;Kegrarp;Mep;Kep;Kep;Jep;Negwp;Mepxbbn0bbn0bbn0bbn0gqp;KepxFbbbFbbbFbbbFbbbp9oaopxbbbFbbbFbbbFbbbFp9op9qarawp;Meaqp;Kecwp:RepxbFbbbFbbbFbbbFbbp9op9qaDawp;Meaqp;Keczp:RepxbbFbbbFbbbFbbbFbp9op9qpklbkadaiav;8qbbskdnalTmbcbhvabhdinadczfgxaxpbbbgopxbbbbbbFFbbbbbbFFgkp9oadpbbbgDaopmbediwDqkzHOAKY8AEgwczp:Reczp:Sep;6egraDaopmlvorxmPsCXQL358E8FpxFubbFubbFubbFubbp9op;6eawczp:Sep;6egwp;Gearp;Gep;Kep;Legopxbbbbbbbbbbbbbbbbp:2egqarpxbbbjbbbjbbbjbbbjgmp9op9rp;Kegrpxb;:FSb;:FSb;:FSb;:FSararp;Meaoaop;Meawaqawamp9op9rp;Kegrarp;Mep;Kep;Kep;Jep;Negwp;Mepxbbn0bbn0bbn0bbn0gqp;KepxFFbbFFbbFFbbFFbbp9oaoawp;Meaqp;Keczp:Rep9qgoarawp;Meaqp;KepxFFbbFFbbFFbbFFbbp9ogrpmwDKYqk8AExm35Ps8E8Fp9qpkbbadaDakp9oaoarpmbezHdiOAlvCXorQLp9qpkbbadcafhdavclfgval6mbkkalaeSmbaiaeciGgvcitgdfcbcaad9R;8kbaiabalcitfglad;8qbbdnavTmbaiaipblzgopxbbbbbbFFbbbbbbFFgkp9oaipblbgDaopmbediwDqkzHOAKY8AEgwczp:Reczp:Sep;6egraDaopmlvorxmPsCXQL358E8FpxFubbFubbFubbFubbp9op;6eawczp:Sep;6egwp;Gearp;Gep;Kep;Legopxbbbbbbbbbbbbbbbbp:2egqarpxbbbjbbbjbbbjbbbjgmp9op9rp;Kegrpxb;:FSb;:FSb;:FSb;:FSararp;Meaoaop;Meawaqawamp9op9rp;Kegrarp;Mep;Kep;Kep;Jep;Negwp;Mepxbbn0bbn0bbn0bbn0gqp;KepxFFbbFFbbFFbbFFbbp9oaoawp;Meaqp;Keczp:Rep9qgoarawp;Meaqp;KepxFFbbFFbbFFbbFFbbp9ogrpmwDKYqk8AExm35Ps8E8Fp9qpklzaiaDakp9oaoarpmbezHdiOAlvCXorQLp9qpklbkalaiad;8qbbkk;4wllue97euv978Jjjjjbc8W9Rhidnaec98GglTmbcbhvabhoinaiaopbbbgraoczfgwpbbbgDpmlvorxmPsCXQL358E8Fgqczp:Segkclp:RepklbaopxbbjZbbjZbbjZbbjZpx;Zl81Z;Zl81Z;Zl81Z;Zl81Zakpxibbbibbbibbbibbbp9qp;6ep;NegkaraDpmbediwDqkzHOAKY8AEgrczp:Reczp:Sep;6ep;MegDaDp;Meakarczp:Sep;6ep;Megxaxp;Meakaqczp:Reczp:Sep;6ep;Megqaqp;Mep;Kep;Kep;Lepxbbbbbbbbbbbbbbbbp:4ep;Jepxb;:FSb;:FSb;:FSb;:FSgkp;Mepxbbn0bbn0bbn0bbn0grp;KepxFFbbFFbbFFbbFFbbgmp9oaxakp;Mearp;Keczp:Rep9qgxaDakp;Mearp;Keamp9oaqakp;Mearp;Keczp:Rep9qgkpmbezHdiOAlvCXorQLgrp5baipblbpEb:T:j83ibaocwfarp5eaipblbpEe:T:j83ibawaxakpmwDKYqk8AExm35Ps8E8Fgkp5baipblbpEd:T:j83ibaocKfakp5eaipblbpEi:T:j83ibaocafhoavclfgval6mbkkdnalaeSmbaiaeciGgvcitgofcbcaao9R;8kbaiabalcitfgwao;8qbbdnavTmbaiaipblbgraipblzgDpmlvorxmPsCXQL358E8Fgqczp:Segkclp:RepklaaipxbbjZbbjZbbjZbbjZpx;Zl81Z;Zl81Z;Zl81Z;Zl81Zakpxibbbibbbibbbibbbp9qp;6ep;NegkaraDpmbediwDqkzHOAKY8AEgrczp:Reczp:Sep;6ep;MegDaDp;Meakarczp:Sep;6ep;Megxaxp;Meakaqczp:Reczp:Sep;6ep;Megqaqp;Mep;Kep;Kep;Lepxbbbbbbbbbbbbbbbbp:4ep;Jepxb;:FSb;:FSb;:FSb;:FSgkp;Mepxbbn0bbn0bbn0bbn0grp;KepxFFbbFFbbFFbbFFbbgmp9oaxakp;Mearp;Keczp:Rep9qgxaDakp;Mearp;Keamp9oaqakp;Mearp;Keczp:Rep9qgkpmbezHdiOAlvCXorQLgrp5baipblapEb:T:j83ibaiarp5eaipblapEe:T:j83iwaiaxakpmwDKYqk8AExm35Ps8E8Fgkp5baipblapEd:T:j83izaiakp5eaipblapEi:T:j83iKkawaiao;8qbbkk:Pddiue978Jjjjjbc;ab9Rhidnadcd4ae2glc98GgvTmbcbheabhdinadadpbbbgocwp:Recwp:Sep;6eaocep:SepxbbjFbbjFbbjFbbjFp9opxbbjZbbjZbbjZbbjZp:Uep;Mepkbbadczfhdaeclfgeav6mbkkdnavalSmbaialciGgecdtgdVcbc;abad9R;8kbaiabavcdtfgvad;8qbbdnaeTmbaiaipblbgocwp:Recwp:Sep;6eaocep:SepxbbjFbbjFbbjFbbjFp9opxbbjZbbjZbbjZbbjZp:Uep;Mepklbkavaiad;8qbbkk9teiucbcbydj1jjbgeabcifc98GfgbBdj1jjbdndnabZbcztgd9nmbcuhiabad9RcFFifcz4nbcuSmekaehikaikkkebcjwklz:Dbb",t=new Uint8Array([0,97,115,109,1,0,0,0,1,4,1,96,0,0,3,3,2,0,0,5,3,1,0,1,12,1,0,10,22,2,12,0,65,0,65,0,65,0,252,10,0,0,11,7,0,65,0,253,15,26,11]),i=new Uint8Array([32,0,65,2,1,106,34,33,3,128,11,4,13,64,6,253,10,7,15,116,127,5,8,12,40,16,19,54,20,9,27,255,113,17,42,67,24,23,146,148,18,14,22,45,70,69,56,114,101,21,25,63,75,136,108,28,118,29,73,115]);if(typeof WebAssembly!="object")return{supported:!1};var n=WebAssembly.validate(t)?o(e):o(r),s,a=WebAssembly.instantiate(n,{}).then(function(f){s=f.instance,s.exports.__wasm_call_ctors()});function o(f){for(var x=new Uint8Array(f.length),g=0;g<f.length;++g){var v=f.charCodeAt(g);x[g]=v>96?v-97:v>64?v-39:v+4}for(var T=0,g=0;g<f.length;++g)x[T++]=x[g]<60?i[x[g]]:(x[g]-60)*64+x[++g];return x.buffer.slice(0,T)}function l(f,x,g,v,T,A,E){var P=f.exports.sbrk,_=v+3&-4,M=P(_*T),R=P(A.length),F=new Uint8Array(f.exports.memory.buffer);F.set(A,R);var j=x(M,v,T,R,A.length);if(j==0&&E&&E(M,_,T),g.set(F.subarray(M,M+v*T)),P(M-P(0)),j!=0)throw new Error("Malformed buffer data: "+j)}var c={NONE:"",OCTAHEDRAL:"meshopt_decodeFilterOct",QUATERNION:"meshopt_decodeFilterQuat",EXPONENTIAL:"meshopt_decodeFilterExp"},d={ATTRIBUTES:"meshopt_decodeVertexBuffer",TRIANGLES:"meshopt_decodeIndexBuffer",INDICES:"meshopt_decodeIndexSequence"},u=[],h=0;function m(f){var x={object:new Worker(f),pending:0,requests:{}};return x.object.onmessage=function(g){var v=g.data;x.pending-=v.count,x.requests[v.id][v.action](v.value),delete x.requests[v.id]},x}function y(f){for(var x="self.ready = WebAssembly.instantiate(new Uint8Array(["+new Uint8Array(n)+"]), {}).then(function(result) { result.instance.exports.__wasm_call_ctors(); return result.instance; });self.onmessage = "+p.name+";"+l.toString()+p.toString(),g=new Blob([x],{type:"text/javascript"}),v=URL.createObjectURL(g),T=u.length;T<f;++T)u[T]=m(v);for(var T=f;T<u.length;++T)u[T].object.postMessage({});u.length=f,URL.revokeObjectURL(v)}function b(f,x,g,v,T){for(var A=u[0],E=1;E<u.length;++E)u[E].pending<A.pending&&(A=u[E]);return new Promise(function(P,_){var M=new Uint8Array(g),R=++h;A.pending+=f,A.requests[R]={resolve:P,reject:_},A.object.postMessage({id:R,count:f,size:x,source:M,mode:v,filter:T},[M.buffer])})}function p(f){var x=f.data;if(!x.id)return self.close();self.ready.then(function(g){try{var v=new Uint8Array(x.count*x.size);l(g,g.exports[x.mode],v,x.count,x.size,x.source,g.exports[x.filter]),self.postMessage({id:x.id,count:x.count,action:"resolve",value:v},[v.buffer])}catch(T){self.postMessage({id:x.id,count:x.count,action:"reject",value:T})}})}return{ready:a,supported:!0,useWorkers:function(f){y(f)},decodeVertexBuffer:function(f,x,g,v,T){l(s,s.exports.meshopt_decodeVertexBuffer,f,x,g,v,s.exports[c[T]])},decodeIndexBuffer:function(f,x,g,v){l(s,s.exports.meshopt_decodeIndexBuffer,f,x,g,v)},decodeIndexSequence:function(f,x,g,v){l(s,s.exports.meshopt_decodeIndexSequence,f,x,g,v)},decodeGltfBuffer:function(f,x,g,v,T,A){l(s,s.exports[d[T]],f,x,g,v,s.exports[c[A]])},decodeGltfBufferAsync:function(f,x,g,v,T){return u.length>0?b(f,x,g,d[v],c[T]):a.then(function(){var A=new Uint8Array(f*x);return l(s,s.exports[d[v]],A,f,x,g,s.exports[c[T]]),A})}}})();function Th(r){let e=new Map,t=new Map,i=r.clone();return Ah(r,i,function(n,s){e.set(s,n),t.set(n,s)}),i.traverse(function(n){if(!n.isSkinnedMesh)return;let s=n,a=e.get(n),o=a.skeleton.bones;s.skeleton=a.skeleton.clone(),s.bindMatrix.copy(a.bindMatrix),s.skeleton.bones=o.map(function(l){return t.get(l)}),s.bind(s.skeleton,s.bindMatrix)}),i}function Ah(r,e,t){t(r,e);for(let i=0;i<r.children.length;i++)Ah(r.children[i],e.children[i],t)}var Tv=(r,e,t)=>Math.max(e,Math.min(t,r));function Av(r=1450){let e=r>>>0||1;return()=>(e=Math.imul(e,1664525)+1013904223>>>0,e/4294967296)}function kh(r=1450,e="temperate",t=1,i=null){let n=Av(r),s=e==="desert",a=Tv(Math.floor(t||0),0,4),o=i||(s?"desert":"plains"),l=[],c=[],d=[],u=[],h=[],m=[-51.5,-61,-70];for(let y=0;y<m.length;y++)for(let b=-4;b<=4;b++){if(Math.abs(b)<1&&y<2||n()<.16)continue;let p=b*8.6+(n()-.5)*1.6,f=m[y]+(n()-.5)*1.5;l.push({x:p,z:f,w:4.1+n()*1.6,d:4.2+n()*1.6,h:3+n()*1.6,variant:Math.floor(n()*3),roof:s?"flat":n()>.13?"pitched":"flat",chimney:n()>.57})}for(let y of[-1,1])for(let b=0;b<5;b++){let p=y*(35+b%2*6)+n()*2,f=29+Math.floor(b/2)*10+(n()-.5)*2;d.push({x:p,z:f,r:1.65+n()*.48,color:Math.floor(n()*3)})}for(let y=0;y<90;y++){let p=(n()<.5?-1:1)*(50+n()*30),f=(n()-.5)*138;s&&n()<.72||c.push({x:p,z:f,size:2.6+n()*4.5,kind:s?"palm":n()<.55?"pine":"oak"})}for(let y=0;y<65;y++){let p=(n()<.5?-1:1)*(37+n()*41),f=(n()-.5)*130;h.push({x:p,z:f,r:.25+n()*.62})}for(let y=0;y<22;y++){let p=(y%2?-1:1)*(33+n()*10),f=25+n()*30;u.push({x:p,z:f,size:.4+n()*.34})}return{biome:s?"desert":"temperate",terrain:o,forestCovers:Nr(o),fortLevel:a,houses:l,trees:c,tents:d,rocks:h,crates:u,gate:{x:0,z:-42,passageWidth:8},towers:[{x:-40,z:-42},{x:40,z:-42}],siegeEngines:[{x:-32,z:20},{x:32,z:20}],road:{x:0,from:53,to:-68,width:7}}}function Eh(r){return Object.fromEntries(["houses","trees","tents","rocks","crates","siegeEngines","towers"].map(e=>[e,r[e].length]))}var kv=r=>new Me(r);function Io(r,e,t=1450){let i=document.createElement("canvas"),n=256;i.width=i.height=n;let s=i.getContext("2d");s.fillStyle=e,s.fillRect(0,0,n,n);let a=t+r.length*137>>>0,o=()=>(a=Math.imul(a,1664525)+1013904223>>>0,a/4294967296);if(r==="stone")for(let u=0;u<n;u+=20){let h=u/20%2*19;for(let m=-h;m<n;m+=36)s.fillStyle=o()<.5?"rgba(249,232,190,.11)":"rgba(47,41,32,.105)",s.fillRect(m+1,u+1,34,18),s.strokeStyle="rgba(35,37,34,.22)",s.lineWidth=1,s.strokeRect(m+.5,u+.5,36,20)}else if(r==="roof")for(let d=0;d<n;d+=12){s.strokeStyle="rgba(43,25,18,.23)",s.lineWidth=1,s.beginPath(),s.moveTo(0,d),s.lineTo(n,d),s.stroke();for(let u=0;u<n;u+=20)s.beginPath(),s.moveTo(u+d%24,d),s.lineTo(u+d%24,d+12),s.stroke()}else if(r==="wood")for(let d=0;d<n;d+=16)s.strokeStyle="rgba(50,30,18,.2)",s.lineWidth=1.3,s.beginPath(),s.moveTo(d,0),s.lineTo(d,n),s.stroke();let l=r==="ground"?16e3:2300;for(let d=0;d<l;d++){let u=o()*n,h=o()*n,m=.35+o()*(r==="ground"?4:1.3);s.fillStyle=o()<.5?"rgba(255,238,179,.065)":"rgba(19,25,18,.060)",s.fillRect(u,h,m,m)}let c=new cs(i);return c.colorSpace=ft,c.wrapS=c.wrapT=Mi,c.anisotropy=2,c.generateMipmaps=!0,c}var Ev=()=>({box:new Gt(1,1,1),cylinder:new Ti(.5,.5,1,10),cone:new Ai(.5,1,9),sphere:new on(.5,9,7),ring:new ms(.5,.11,5,16)});function vt(r,e=null){return new Rt({color:kv(r),map:e,side:bt})}function Ch(r,e={}){let t=kh(e.seed??1450,e.biome??"temperate",e.fortLevel??1),i=t.biome==="desert",n=new pt;n.name="Medieval battlefield scenery",r.add(n);let s=Io("stone",i?"#d0b38a":"#bcb39a",1450),a=Io("wood","#987453",45),o=Io("roof",i?"#d5ad80":"#8d5c48",71),l=Io("ground",i?"#b79e79":"#778766",1490);l.repeat.set(8,7);let c={stone:vt(i?"#d4b894":"#bcb8a9",s),stoneShade:vt(i?"#9d8063":"#8f8d84",s),plaster:vt(i?"#e3c7a2":"#dacdb3",s),roof:vt(i?"#a87b54":"#86513e",o),roofBlue:vt("#4d7181",o),wood:vt("#6b4931",a),darkWood:vt("#352b28",a),leather:vt("#a17b58"),clothBlue:vt("#37748c"),clothRed:vt("#9c4939"),clothCream:vt("#e0c594"),moss:vt(i?"#9c9563":"#455c3a"),grass:vt(i?"#baa17a":"#7a8d62"),leaves:vt(i?"#728060":"#476b44"),leavesLite:vt("#759459"),dirt:vt(i?"#a88d67":"#716e55"),rock:vt("#77756c"),black:vt("#252b28"),gold:vt("#c7a15b"),ember:vt("#ff923e"),roofPeak:vt("#684538")},d=Ev(),u=new Map,h=new rt,m=[];function y(C,U,O,z,Y,re,Te,qe,Le=0,Xe=0){let $=C+"|"+U;u.has($)||u.set($,{kind:C,material:c[U],list:[]}),u.get($).list.push({x:O,y:z,z:Y,sx:re,sy:Te,sz:qe,rotZ:Le,rotY:Xe})}function b(C,U,O,z,Y,re,Te,qe=0,Le=0){y("box",C,U,O,z,Y,re,Te,qe,Le)}function p(C,U,O,z,Y,re=.12){y("cylinder",C,U,O+Y/2,z,re*2,Y,re*2)}function f(C){let{x:U,z:O,w:z,d:Y,variant:re,roof:Te,chimney:qe}=C,Le=C.h;b(re===0?"plaster":re===1?"stone":"stoneShade",U,Le*.5,O,z,Le,Y);for(let $ of[-z*.37,z*.37])b("wood",U+$,Le*.51,O+Y*.501,.13,Le*.92,.12);b("darkWood",U,.84,O+Y*.506,z*.23,1.64,.12);for(let $ of[-z*.3,z*.3])b("black",U+$,Le*.67,O+Y*.512,.36,.66,.06);if(Te==="pitched"){let Z=Math.atan(1.55/(z*.5)),he=Math.hypot(z*.5,1.55)*1.12;b(re===2?"roofBlue":"roof",U-z*.25,Le+1.55*.51,O,he,.28,Y+.64,Z),b(re===2?"roofBlue":"roof",U+z*.25,Le+1.55*.51,O,he,.28,Y+.64,-Z),p("darkWood",U,Le+1.55,O,.04,.02),qe&&b("stoneShade",U+z*.26,Le+1.55*.85,O-Y*.2,.67,1.35,.73)}else{b("plaster",U,Le+.18,O,z+.4,.38,Y+.4);for(let $ of[-z*.48,z*.48])b("stoneShade",U+$,Le+.53,O,.28,.72,Y+.25)}b("wood",U,.16,O+Y*.56,z*.36,.26,.78)}function x(C,U,O){let z=7.4+O*.45,Y=10.7+O*.8;y("cylinder","stone",C,Y*.5,U,z,Y,z),y("cylinder","stoneShade",C,1,U,z+1,1.3,z+1),y("cylinder","stoneShade",C,Y-.3,U,z+.8,.65,z+.8);for(let re=0;re<10;re++){let Te=re*Math.PI/5;b("stone",C+Math.cos(Te)*z*.45,Y+.4,U+Math.sin(Te)*z*.45,1.45,1.6,1.38,0,Te)}y("cone",i?"stoneShade":"roof",C,Y+2.45,U,z+1.2,4.5,z+1.2),b("black",C,Y*.63,U+z*.49,1.1,1.8,.15),b("wood",C,Y*.32,U+z*.49,1.1,1.35,.22),v(C,Y+4.5,U,O%2===0?"clothBlue":"clothRed")}let g=[];function v(C,U,O,z){p("darkWood",C,U,O,3.1,.09),b(z,C+1,U+2.45,O,1.95,.85,.09),y("sphere","gold",C,U+3.22,O,.3,.3,.3)}function T(){let U=t.gate;b("stone",-5.4,3.9,-42,2,7.8,3.7),b("stone",5.4,3.9,-42,2,7.8,3.7),b("stoneShade",0,7,-42,9.6,2.25,4.2),b("darkWood",0,3.3,-42+1.92,8.1,6.2,.33);for(let O=-3;O<=3;O++)b("stoneShade",O*1.12,3.1,-42+2.13,.16,5.6,.29);b("black",0,4.8,-42+2.14,7.5,.31,.32),b("black",0,1.6,-42+2.14,7.5,.26,.32),b("stone",0,8.45,-42,11.6,.9,4.1),v(0,9.1,-42,"clothRed")}function A(){for(let O=-36;O<=36;O+=6)if(!(Math.abs(O)<6)){b("stone",O,5.3*.55,-42,5.85,5.3*1.45,3),b("stoneShade",O,8.745*.91,-42,6.1,.7,3.35);for(let z=-2;z<=2;z++)b("stone",O+z*1.16,8.745+.5,-40.63,.77,1.3,.84)}for(let O of t.towers)x(O.x,O.z,t.fortLevel);T();for(let O of[-1,1])for(let z=-43;z>=-71;z-=7){b("stone",O*40,3.5,z,3.2,7,6.8);for(let Y=-2;Y<=2;Y+=2)b("stone",O*40,7.55,z+Y,.85,1,.9)}}function E(){let C=new We(new ki(7.2,130),new Rt({color:i?12954245:11380109,map:s,side:bt}));C.name="Gate road",C.rotation.x=-Math.PI/2,C.position.set(0,.026,-8),n.add(C);for(let U=45;U>=-58;U-=7)for(let O of[-1,1])b("stoneShade",O*3.9,.065,U,.16,.09,5.6);for(let U=0;U<125;U++){let O=U*1987%99/99,z=U*31%100/100*8-4,Y=-58+U*73%107;O<.55&&b("dirt",z,.046,Y,.5,.034,.17)}}function P(){for(let C of t.trees){let{x:U,z:O,size:z,kind:Y}=C;if(p("wood",U,0,O,z*.48,z*.068),Y==="pine")y("cone","leaves",U,z*.72,O,z*.43,z*.82,z*.43),y("cone","leavesLite",U,z*.99,O,z*.31,z*.55,z*.31);else if(Y==="palm")for(let re=0;re<6;re++){let Te=re*Math.PI/3,qe=Math.cos(Te)*z*.25,Le=Math.sin(Te)*z*.25;y("cone","leaves",U+qe,z*.99,O+Le,z*.16,z*.65,z*.16,Math.PI*.42,Te)}else y("sphere","leaves",U,z*.82,O,z*.65,z*.64,z*.65),y("sphere","leavesLite",U+z*.16,z*1.04,O-z*.12,z*.38,z*.37,z*.38)}for(let C of t.rocks)y("sphere","rock",C.x,C.r*.32,C.z,C.r*1.8,C.r*.65,C.r*1.3);for(let C=0;C<230;C++){let U=C%2?-1:1,O=U*(40+C*37%43),z=C*29%128-64;y("cone",C%7===0?"clothCream":"moss",O,.24,z,.3,.5,.3)}}function _(){for(let C of t.tents){let U=["clothBlue","clothCream","clothRed"][C.color];y("cylinder","leather",C.x,.1,C.z,C.r*2,.24,C.r*2),y("cone",U,C.x,1.12,C.z,C.r*2,2.25,C.r*2),p("wood",C.x,0,C.z,2.5,.07),C.color===0&&v(C.x,1.45,C.z,"clothBlue")}for(let C of t.crates)b("wood",C.x,C.size*.5,C.z,C.size,C.size,C.size);for(let[C,U]of[[-41,32],[41,36],[-51,54]]){for(let z=0;z<7;z++){let Y=z*Math.PI*2/7;y("sphere","rock",C+Math.cos(Y)*.64,.14,U+Math.sin(Y)*.64,.47,.24,.47)}y("cone","ember",C,.42,U,.72,1.12,.72);let O=new In(16751177,2,10,2);O.position.set(C,1.05,U),n.add(O),m.push(O)}}function M(C,U){b("wood",C,.62,U,3.7,.45,4.2);for(let O of[-1.5,1.5])y("cylinder","darkWood",C+O,.65,U-1.45,1.35,.64,1.35,Math.PI/2),y("cylinder","stoneShade",C+O,.66,U-1.45,.4,.72,.4,Math.PI/2),b("wood",C+O*.44,2.1,U,.29,3.2,.32,O>0?-.45:.45);b("wood",C,3.2,U-1,.34,5.1,.3,.42),y("sphere","rock",C,5.3,U-1,.8,.65,.8),v(C-1,2.75,U+1.7,"clothBlue")}function R(){for(let C of t.houses)f(C);for(let C of t.siegeEngines)M(C.x,C.z);for(let[C,U]of[[-26,-54],[20,-58],[27,-68]]){for(let O of[-2,2])p("wood",C+O,0,U+2,3.1,.09);b("clothBlue",C,3.1,U+1.4,4.8,.15,3.2),b("wood",C,1.3,U,4.2,.18,2.1)}for(let C of[-22,23])for(let U of[-58,-65])y("cylinder","wood",C,.53,U,1,1,1),y("cylinder","darkWood",C,.5,U,1.08,.09,1.08)}let F=new We(new ki(190,175),new Rt({map:l,color:16777215,side:bt}));F.name="Illustrated battlefield ground",F.rotation.x=-Math.PI/2,F.position.y=-.065,n.add(F),E(),A(),R(),P(),_();let j=[];for(let{kind:C,material:U,list:O}of u.values()){if(!O.length)continue;let z=new Gi(d[C],U,O.length);z.instanceMatrix.setUsage(lr),z.frustumCulled=!1,z.name="Battle scenery "+C;for(let Y=0;Y<O.length;Y++){let re=O[Y];h.position.set(re.x,re.y,re.z),h.rotation.set(0,re.rotY||0,re.rotZ||0),h.scale.set(re.sx,re.sy,re.sz),h.updateMatrix(),z.setMatrixAt(Y,h.matrix)}z.instanceMatrix.needsUpdate=!0,n.add(z),j.push(z)}let W={...Eh(t),instancedDrawCalls:j.length,renderedSceneryInstances:[...u.values()].reduce((C,U)=>C+U.list.length,0)},K=!1;return{group:n,layout:t,stats:W,update(C){if(!K)for(let U=0;U<m.length;U++)m[U].intensity=1.8+Math.sin(C*8+U*3.1)*.27},dispose(){if(!K){K=!0,r.remove(n);for(let C of j)n.remove(C);for(let C of Object.values(d))C.dispose();for(let C of Object.values(c))C.dispose();F.geometry.dispose(),F.material.dispose();for(let C of[s,a,o,l])C.dispose();for(let C of n.children)C.isMesh&&(C.geometry.dispose(),C.material.dispose())}}}}var Pr=(r,e,t)=>Math.max(e,Math.min(t,r)),Cv={box:()=>new Gt(1,1,1),cone:()=>new Ai(.5,1,8),cylinder:()=>new Ti(.5,.5,1,8),sphere:()=>new on(.5,9,7)},Ih=r=>r.find(e=>/^(Walking_A|walk)$/i.test(e.name))||r.find(e=>/walk/i.test(e.name))||r.find(e=>/run/i.test(e.name)),Rv=r=>r.find(e=>/^(Running_A|run)$/i.test(e.name))||r.find(e=>/run|charge|gallop/i.test(e.name))||Ih(r),Iv=r=>r.find(e=>/^(Idle_A|idle)$/i.test(e.name))||r.find(e=>/idle/i.test(e.name))||r[0],Ph=r=>r.find(e=>/^(attack_melee|1H_Melee_Attack_Slice)$/i.test(e.name))||r.find(e=>/melee.*attack|attack.*slash|attack_melee/i.test(e.name))||r.find(e=>/attack/i.test(e.name)),Pv=r=>r.find(e=>/^attack_ranged$/i.test(e.name))||r.find(e=>/bow.*(shoot|release)/i.test(e.name))||r.find(e=>/shoot.*bow|archery|attack_ranged/i.test(e.name))||Ph(r),Ov=r=>r.find(e=>/^(death|Death_A)$/i.test(e.name))||r.find(e=>/death|die/i.test(e.name))||null,Lv=r=>r.find(e=>/^(promotion|cheer|rally)$/i.test(e.name))||r.find(e=>/promot|cheer|victory/i.test(e.name))||null,Nv=(r,e,t)=>e*10+r+t*Math.PI*.6,Fv=new Set(["vijayanagara","bahmani","mysore","madurai","keladi","ceylon","kandy"]),Dv=new Set(["delhi","bengal","gujarat","malwa","jaunpur","orissa","mewar","sindh","marwar","gondwana","khandesh","ahmednagar","bijapur","golconda","kashmir"]),Bv=new Set(["ming","manchu","joseon","tibetan","tibet"]),Uv=new Set(["ashikaga","hosokawa","uesugi","oda","shimazu","otomo","date","takeda"]),zv=new Set(["ayutthaya","dai-viet","dai_viet","lan-xang","prome","ava","pegu","shan","majapahit","malacca","sukhothai","khmer","champa"]),Hv=new Set(["horde","golden-horde","uzbek","kazakh","oirat","chagatai","nogai","crimea","timurids","mongol"]),jv=new Set(["ottomans","mamluks","karaman","oman","yemen","rasulids","bahrain","arabia","morocco","tunis","tlemcen","granada"]),Gv=new Set(["persia","safavids","qara","aq-qoyunlu","shirvan","khorasan"]),Vv=new Set(["byzantium","byzantine","trebizond","serbia","wallachia","moldavia","georgia","epirus"]),Wv=new Set(["denmark","sweden","norway","kalmar","scotland","teutonic","teutons","livonia","novgorod"]),qv=new Set(["poland","lithuania","muscovy","hungary","bohemia","mazovia","ryazan","tver"]),$v=new Set(["ethiopia","mali","songhai","kilwa","kongo","benin","kanem","bornu","adal","mutapa"]),Xv=new Set(["aztec","tarascans","maya","mixtec","zapotec","tlaxcala"]),Kv=new Set(["inca","cusco","chimu","muisca"]);function Oo(r){let e=String(r||"").toLowerCase();return Fv.has(e)?"south_india":Dv.has(e)?"north_india":Bv.has(e)?"china":Uv.has(e)?"japan":zv.has(e)?"southeast_asia":Hv.has(e)?"steppe":jv.has(e)?"ottoman":Gv.has(e)?"persia":Vv.has(e)?"byzantine":Wv.has(e)?"northern_europe":qv.has(e)?"eastern_europe":$v.has(e)?"africa":Xv.has(e)?"mesoamerica":Kv.has(e)?"andean":"western_europe"}var Po={low:{label:"Low",pixelRatio:1,soldierScale:.65,propDensity:.45},medium:{label:"Medium",pixelRatio:1.25,soldierScale:1,propDensity:.8},high:{label:"High",pixelRatio:1.5,soldierScale:1.25,propDensity:1}};function Bc(r){return r==="south_india"||r==="north_india"?"india":r==="china"||r==="japan"||r==="southeast_asia"?"east_asia":r==="ottoman"||r==="steppe"||r==="persia"?"persia":"europe"}function Dc(r){return Bc(Oo(r))}function Yv(){return{geo:{body:new on(.5,9,7),neck:new Ti(.22,.31,1,7),box:new Gt(1,1,1),leg:new Ti(.1,.08,.7,6),hoof:new Gt(.19,.14,.27),tail:new Ai(.17,.63,6)},mat:{fur:new Rt({color:7819574}),mane:new Rt({color:3681577}),saddle:new Rt({color:5849399})}}}function Jv(r){let e=new pt,{geo:t,mat:i}=r,n=(l,c,d,u,h,m,y,b)=>{let p=new We(l,c);return p.position.set(d,u,h),p.scale.set(m,y,b),e.add(p),p};n(t.body,i.fur,0,.88,0,.78,.64,1.3);let s=n(t.neck,i.fur,0,1.2,.52,.9,1,.9);s.rotation.x=-.5,n(t.box,i.fur,0,1.52,.8,.34,.42,.61),n(t.box,i.mane,0,1.42,.5,.42,.32,.14),n(t.box,i.saddle,0,1.23,-.12,.7,.22,.56);let a=[];for(let l of[-.3,.3])for(let c of[-.47,.47]){let d=new pt;d.position.set(l,.57,c),e.add(d);let u=new We(t.leg,i.fur);u.position.y=-.31,d.add(u);let h=new We(t.hoof,i.mane);h.position.set(0,-.69,.07),d.add(h),a.push(d)}let o=n(t.tail,i.mane,0,.93,-.83,.85,1,1);return o.rotation.x=.46,{horse:e,legs:a}}function Zv(r,e,t,i=1){let n=Math.floor(r/5),s=r%5;if(t==="cavalry_wedge"||t==="elephant_push"){let a=Math.floor(Math.sqrt(r)),o=a*a,l=r-o,c=a*2+1;return[(l-(c-1)/2)*i,(a-1.3)*i*1.3]}if(t==="longbow_line"||t==="volley_line"||t==="line")return[(r-(e-1)/2)*i*.84,0];if(t==="pike_square"||t==="square"){let a=Math.ceil(Math.sqrt(e));return[(r%a-(a-1)/2)*i,(Math.floor(r/a)-(a-1)/2)*i]}if(t==="encirclement"||t==="ambush"){let a=Math.PI*.15+Math.PI*.7*(r/Math.max(1,e-1));return[Math.cos(a)*i*3.4,Math.sin(a)*i*2.7]}return t==="flank"?[(r%2===0?-1:1)*(i*2.3+Math.floor(r/2)*i*.25),Math.floor(r/2)*i]:t==="shield_wall"?[(r%7-3)*i*.85,(Math.floor(r/7)-.5)*i*.75]:[(s-2)*i,(n-1)*i]}var Rh=class{constructor(e,t={}){this.isThreeBattle=!0,this.canvas=e,this.modelsReady=!1,this.loadingStatus="Loading 3D regional armies";let i=!1;try{let l=document.createElement("canvas").getContext("webgl2");if(l){let c=l.getExtension("WEBGL_debug_renderer_info"),d=String(c&&l.getParameter(c.UNMASKED_RENDERER_WEBGL)||l.getParameter(l.RENDERER)||"");i=/SwiftShader|llvmpipe|softpipe|Software|Basic Render|Mesa/i.test(d),l.getExtension("WEBGL_lose_context")?.loseContext()}}catch{}this.renderer=new ko({canvas:e,antialias:!i,alpha:!1,powerPreference:"high-performance"}),this.renderer.outputColorSpace=ft,this.renderer.toneMapping=Oa,this.renderer.toneMappingExposure=1.42,this.gl=this.renderer.getContext();let n="";try{let l=this.gl?.getExtension?.("WEBGL_debug_renderer_info");n=String(l&&this.gl.getParameter(l.UNMASKED_RENDERER_WEBGL)||this.gl?.getParameter?.(this.gl.RENDERER)||"")}catch{}this.isSoftwareGl=i||/SwiftShader|llvmpipe|softpipe|Software|Basic Render|Mesa/i.test(n),this.scene=new is,this.scene.background=new Me(10332576),this.scene.fog=new ts(10332576,.0034),this.camera=new xt(60,1,.5,340),this.scene.add(new gs(14280154,5326127,2.05));let s=new ln(16771256,2.25);s.position.set(-35,70,55),this.scene.add(s);let a=new ln(10995161,.55);a.position.set(42,30,-52),this.scene.add(a),this.batches={},this.tmp=new rt,this.color=new Me,this._sharedHorse=Yv(),this._sharedAssets=new Set([...Object.values(this._sharedHorse.geo),...Object.values(this._sharedHorse.mat)]),this.frameBudget=hu(60);for(let[l,c]of Object.entries(Cv)){let d=new Gi(c(),new Rt({color:16777215,side:bt}),9e3);d.instanceMatrix.setUsage(Fl),d.frustumCulled=!1,d.count=0,this.scene.add(d),this.batches[l]=d}let o=Po[t.graphicsQuality]?t.graphicsQuality:"medium";this.groups=new Map,this.templates={},this.regionalTemplates={},this.siegeTemplates={},this.envGroup=null,this.siegeProps=null,this.siegeReady=!1,this.graphicsQuality=this.isSoftwareGl?"low":o,this.regionalRealms={attacker:t.attackerRealm,defender:t.defenderRealm},this.mixers=[],this.disposed=!1,this.lastRenderTime=0,this.terrainType=String(t.terrain||"plains").toLowerCase(),this.environment=Ch(this.scene,t),(t.fieldBattle||t.siegeMode)&&(cu(this.scene,this.renderer,t.biome),lu(this.environment)),this.commanderAuras=this._createCommanderAuras(),this.riverGroup=this.terrainType==="river"?this._createRiverVisual():null,this.prepareCharacters()}_createCommanderAuras(){let e=t=>{let i=new pt,n=new We(new gr(2.5,3.25,28),new jt({color:t,side:bt,transparent:!0,opacity:.55}));n.rotation.x=-Math.PI/2,n.position.y=.18,i.add(n);let s=new We(new gr(14.5,15.2,40),new jt({color:t,side:bt,transparent:!0,opacity:.18}));s.rotation.x=-Math.PI/2,s.position.y=.14,i.add(s);let a=new We(new ps(.55,0),new Rt({color:t,emissive:t,emissiveIntensity:.35}));return a.position.y=5.8,i.add(a),i.visible=!1,this.scene.add(i),{grp:i,ring:n,outer:s,crown:a}};return{attacker:e(15980187),defender:e(14904152)}}_createRiverVisual(){let e=new pt;e.name="River Crossing";let t=new We(new ki(340,9.2),new Rt({color:3565954,transparent:!0,opacity:.78,side:bt}));t.rotation.x=-Math.PI/2,t.position.y=-.12,e.add(t);let i=new Rt({color:9339758}),n=new Gt(7.5,.22,9.6);for(let s of[-22,0,22]){let a=new We(n,i);a.position.set(s,-.16,0),e.add(a)}return this.scene.add(e),e}setGraphicsQuality(e){return Po[e]?(this.graphicsQuality=e,this.envGroup&&(this.envGroup.visible=e!=="low"),e):this.graphicsQuality}async _loadEnvironmentProps(e,t){let i=t?.families?.environment?.roles;if(!i||this.disposed)return;let n=String(this.terrainType||"plains").toLowerCase(),s=Oo(this.regionalRealms.attacker),a=n==="desert"||s==="africa"||s==="ottoman"?"tree_palm_date":s==="north_india"||s==="south_india"||s==="southeast_asia"?"tree_banyan":s==="china"||s==="japan"?"tree_bamboo":n==="forest"||n==="mountain"||n==="hills"?"tree_pine":"tree_oak",o=n==="desert"?"rock_desert":n==="hills"||n==="mountain"?"rock_highland":n==="coastal"?"rock_shore":"rock_gray",l=s==="persia"||s==="ottoman"||s==="steppe"?"tent_arab":s==="africa"?"tent_kush":"tent_big",c=[["tree",i[a]?.path||i.tree_oak?.path],["bush",i.bush_scrub?.path],["rock",i[o]?.path||i.rock_gray?.path],["tent",i[l]?.path||i.tent_big?.path]].filter(([,f])=>f),d=await Promise.allSettled(c.map(([,f])=>e.loadAsync(f)));if(this.disposed)return;let u={};if(c.forEach(([f],x)=>{d[x].status==="fulfilled"&&d[x].value?.scene&&(u[f]=d[x].value.scene)}),!Object.keys(u).length)return;this._envTemplates=u;let h=new pt;h.name="0 A.D. Environment Props";let m=Po[this.graphicsQuality]?.propDensity??.8,y=(f,x,g,v,T=0)=>{if(!f)return;let A=f.clone(!0),E=new Pt().setFromObject(A),P=Math.max(.2,E.max.y-E.min.y),_=v/P;A.scale.setScalar(_);let M=ai(x,g,n)-E.min.y*_;A.position.set(x,M,g),A.rotation.y=T,h.add(A)},b=Nr(n);for(let f of b){let x=Math.max(2,Math.round(5*m*(f.density||.8)));for(let g=0;g<x;g++){let v=g*Math.PI*2/x+.3,T=f.radius*(.28+.5*(g%2));y(u.tree,f.x+Math.cos(v)*T,f.z+Math.sin(v)*T,5.2+g%3*1.1,v)}u.bush&&y(u.bush,f.x+1.5,f.z-1.2,1.6,.8)}let p=[[-46,-20],[48,18],[-52,22],[50,-26],[0,-48],[-44,44],[44,-44]];for(let f=0;f<Math.ceil(p.length*m);f++){let[x,g]=p[f];y(u.rock,x,g,1.8+f%3*.6,f*.9)}for(let[f,x,g]of[[-48,48,0],[46,48,-.4],[-48,-48,Math.PI],[46,-48,Math.PI-.4]])y(u.tent,f,x,3.6,g);this.envGroup=h,this.envGroup.visible=this.graphicsQuality!=="low",this.scene.add(h)}async prepareCharacters(){let e=new Co;try{await Fc.ready,e.setMeshoptDecoder(Fc)}catch(t){console.warn("MeshoptDecoder init warning:",t)}this.regionalTemplates={};try{let[t,i]=await Promise.all([e.loadAsync("assets/battle/characters/Knight.glb"),e.loadAsync("assets/battle/characters/Rogue_Hooded.glb")]);if(this.disposed)return;this.templates={infantry:t,archers:i};try{let n=await fetch("assets/battle/0ad/manifest.json");if(n.ok){let s=await n.json();this.manifest=s;let a=new Set;for(let d of[this.regionalRealms.attacker,this.regionalRealms.defender]){let u=Oo(d);a.add(u),a.add(Bc(u))}for(let d of a){let u=s?.families?.[d]?.roles;if(!u)continue;this.regionalTemplates[d]={};let h=new Map;for(let[b,p]of Object.entries(u))b.startsWith("siege_")||(h.has(p.path)?h.get(p.path).roles.push(b):h.set(p.path,{entry:p,roles:[b]}));let m=await Promise.allSettled([...h.keys()].map(b=>e.loadAsync(b)));if(this.disposed)return;let y=0;for(let[,b]of h.entries()){let p=m[y++];if(p.status==="fulfilled"){let f={...p.value,_mountedModel:!!b.entry.mounted,_assetId:b.entry.assetId};for(let x of b.roles)this.regionalTemplates[d][x]=f}}}this._loadEnvironmentProps(e,s).catch(()=>{});let o=Dc(this.regionalRealms.defender),l=Dc(this.regionalRealms.attacker),c=[["gate",[s?.families?.[o]?.roles?.siege_gate?.path,s?.families?.europe?.roles?.siege_gate?.path,"assets/battle/kenney/gate.glb"]],["wall",[s?.families?.[o]?.roles?.siege_wall?.path,s?.families?.europe?.roles?.siege_wall?.path,"assets/battle/kenney/wall.glb"]],["tower",[s?.families?.[o]?.roles?.siege_tower?.path,s?.families?.europe?.roles?.siege_tower?.path,"assets/battle/kenney/tower-square-base.glb"]],["ram",[s?.families?.[l]?.roles?.siege_ram?.path,s?.families?.europe?.roles?.siege_ram?.path,"assets/battle/kenney/siege-catapult.glb"]],["catapult",[s?.families?.[l]?.roles?.siege_catapult?.path,s?.families?.europe?.roles?.siege_catapult?.path,"assets/battle/kenney/siege-catapult.glb"]]];await Promise.all(c.map(async([d,u])=>{for(let h of u.filter(Boolean))try{let m=await e.loadAsync(h);if(!this.disposed&&m?.scene){this.siegeTemplates[d]=m;break}}catch{}})),this.siegeReady=!!(this.siegeTemplates.gate||this.siegeTemplates.wall||this.siegeTemplates.tower)}}catch(n){console.warn("0 A.D. manifest load fallback:",n)}if(Object.values(this.regionalRealms).includes("ashikaga")){let n=await Promise.allSettled([e.loadAsync("assets/characters_3d/ashigaru-foot-soldier-806707.glb"),e.loadAsync("assets/characters_3d/daimyo-lord-78364a.glb")]);if(this.disposed)return;for(let[s,a]of["ashigaru","daimyo"].entries())n[s].status==="fulfilled"&&(this.templates[a]=n[s].value)}this.modelsReady=!0,this.loadingStatus="Animated 3D armies ready (0 A.D. & KayKit)"}catch(t){this.modelsReady=!1,this.loadingStatus="Using geometric soldiers: "+String(t),console.warn("3D character assets unavailable; keeping procedural soldiers",t)}}_resolveTemplate(e,t){let i=this.regionalRealms[e.side],n=Oo(i),s=this.regionalTemplates?.[n]||this.regionalTemplates?.[Bc(n)];if(n==="japan"&&e.type==="infantry"&&!(e.specialistId==="pikes"||e.specialistId==="spearmen")){let a=t===0&&e.id.endsWith("0")&&this.templates.daimyo||this.templates.ashigaru;if(a)return a}if(s){let a=e.specialistId||e.kind||e.type;if((a==="elephants"||e.kind==="elephants")&&s.elephants)return s.elephants;if(t===0&&(e.isCommander||e.id.endsWith("0"))&&s.commander)return s.commander;if((a==="horsebow"||e.kind==="horsebow")&&s.horsebow)return s.horsebow;if(e.type==="cavalry"&&s.cavalry)return s.cavalry;if((a==="crossbow"||e.kind==="crossbow"||a==="handgun")&&(s[a]||s.crossbow))return s[a]||s.crossbow;if(e.type==="archers"&&s.archers)return s.archers;if((a==="pikes"||a==="spearmen"||e.kind==="pikemen")&&(s.pikes||s.spearmen))return s.pikes||s.spearmen;if((a==="guard"||a==="heavy_infantry")&&(s[a]||s.heavy_infantry||s.guard))return s[a]||s.heavy_infantry||s.guard;if(s.infantry)return s.infantry}return this.templates[e.type]||this.templates.infantry}prepareSquad(e){if(this.groups.has(e.id)||!this.modelsReady)return;let i=(e.specialistId||e.kind||e.type)==="elephants"||e.kind==="elephants",n=uu(e.troopCount||e.troops||100,e.type,this.graphicsQuality,this.isSoftwareGl,i);e.regionalFamily=Dc(this.regionalRealms[e.side]);let s=[];for(let a=0;a<n;a++){let o=this._resolveTemplate(e,a),l=Th(o.scene),c=new Pt().setFromObject(l),d=c.max.y-c.min.y||1.7,u=e.type==="cavalry",h=!!o._mountedModel,y=(i?3.15:h?2.35:1.75)/d,b=new pt,p=u&&!h?.74:1;l.scale.multiplyScalar(y*p),l.position.y=(u&&!h?.91:0)-c.min.y*y*p;let f=null;u&&!h&&(f=Jv(this._sharedHorse),b.add(f.horse)),b.add(l),this.scene.add(b);let x=new _s(l),g=o.animations||[],v=Iv(g),T=Ih(g),A=Rv(g),E=e.type==="archers"?Pv(g):Ph(g),P=Ov(g),_=Lv(g),M={};for(let[F,j]of[["idle",v],["walk",T],["run",A],["attack",E],["rally",_]])j&&(M[F]=x.clipAction(j),M[F].loop=xo);P&&(M.death=x.clipAction(P),M.death.loop=go,M.death.clampWhenFinished=!0);let R=M.idle||M.walk||M.attack;R&&R.play(),s.push({root:b,rig:l,mixer:x,actions:M,current:R,mode:"idle",clipState:"idle",phase:a*.19,previous:null,mount:f,regionalModel:!!(this.regionalTemplates?.[e.regionalFamily]||o._assetId),restYaw:l.rotation.y,restZ:l.position.z,wasAlive:!1,dyingStarted:!1,dyingTimer:0,lodAccum:0}),this.mixers.push(x)}this.groups.set(e.id,s)}updateCharacters(e,t){if(e?.some(i=>i.fieldOrder))return pu(this,e,t);if(this.modelsReady)for(let i of e||[]){this.prepareSquad(i);let n=this.groups.get(i.id);if(!n)continue;let s=Math.round(n.length*Pr(i.life/100,0,1)),a=Math.atan2(i.targetX-i.x,i.targetZ-i.z),o=Math.hypot(i.targetX-i.x,i.targetZ-i.z)>.7,l=i.cooldown>.22&&i.cooldown<.72,c=l?"attack":o?"walk":"idle",d=Uo({...i,moving:o,attackPulse:l?.3:0});for(let u=0;u<n.length;u++){let h=n[u];if(h.root.visible=!i.routed&&u<s,!h.root.visible)continue;let m=i.type==="archers"?1.08:i.type==="cavalry"?1.8:.92,[y,b]=Zv(u,n.length,i.formationId,m),p=ai(i.x+y,i.z+b,this.terrainType||"plains");if(h.root.position.set(i.x+y,p,i.z+b),h.root.rotation.y=a+(i.side==="defender"?Math.PI:0),h.mount)for(let f=0;f<h.mount.legs.length;f++)h.mount.legs[f].rotation.x=o?Math.sin(Nv(h.phase,h.mixer.time,f))*.36:0;if(d!==h.clipState||c!==h.mode){let f=h.actions[d]||h.actions[c]||h.actions.walk||h.actions.idle;f&&f!==h.current&&(f.reset().fadeIn(.14).play(),h.current?.fadeOut(.14),h.current=f),h.mode=c,h.clipState=d}h.mixer.update(t)}}}render(e,t,i,n,s=null,a=null){if(this.disposed)return null;let o=globalThis.performance?.now?.()||0,l=this.isSoftwareGl?1:Po[this.graphicsQuality]?.pixelRatio||1.25,c=Math.max(this.canvas.clientWidth,1),d=Math.max(this.canvas.clientHeight,1),u=Math.min(window.devicePixelRatio||1,l);this.renderer.setPixelRatio(u),this.renderer.setSize(c,d,!1),this.camera.aspect=c/d,this.camera.updateProjectionMatrix(),this.camera.position.set(...t.eye),this.camera.lookAt(...t.target);let h={box:0,cone:0,cylinder:0,sphere:0};for(let y of e){let b=this.batches[y.shape]?y.shape:"box",p=this.batches[b],f=h[b]++;f>=p.instanceMatrix.count||(this.tmp.position.set(y[0],y[1],y[2]),this.tmp.rotation.set(0,0,0),this.tmp.scale.set(y[3],y[4],y[5]),this.tmp.updateMatrix(),p.setMatrixAt(f,this.tmp.matrix),this.color.setRGB(y[6],y[7],y[8],_t),p.setColorAt(f,this.color))}for(let[y,b]of Object.entries(this.batches))b.count=Math.min(h[y],b.instanceMatrix.count),b.instanceMatrix.needsUpdate=!0,b.instanceColor&&(b.instanceColor.needsUpdate=!0);if(this.commanderAuras)for(let y of["attacker","defender"]){let b=this.commanderAuras[y],p=(i||[]).find(f=>f.side===y&&f.isCommander&&!f.routed&&(f.life??100)>0);if(b&&p){let f=ai(p.x,p.z,this.terrainType||"plains");b.grp.visible=!0,b.grp.position.set(p.x,f,p.z);let x=1+Math.sin(n*3.2)*.08;b.ring.scale.set(x,x,1),b.crown.rotation.y=n*1.6,b.crown.position.y=5.6+Math.sin(n*2.4)*.22}else b&&(b.grp.visible=!1)}let m=n-this.lastRenderTime;return this.lastRenderTime=n,this.updateCharacters(i,Pr(m,0,.05)),this.updateSiegeVisuals(s,a,i,n),this.environment?.update(n),this.renderer.render(this.scene,this.camera),o&&this.frameBudget?.record((globalThis.performance?.now?.()||o)-o),null}_buildCapitalCompound(e,t,i,n){let s=new pt,a=e.effect==="defense"||e.key==="citadel"||e.key==="fort"||e.key==="watchtower",o=e.key==="palace"||e.key==="town"||e.key==="cathedral"||e.key==="temple",l=!!e.damaged,c=new Rt({color:l?5917762:o?14075816:a?9078653:11969416}),d=new Rt({color:l?3810846:o?12884549:a?6052693:9325112}),u=o?4.6:a?3.6:3,h=(o?4.8+Math.min(2.5,e.level*.28):a?5.6+Math.min(2.5,e.level*.25):2.6+Math.min(2,e.level*.22))*(l?.68:1),m=new We(new Gt(u,h,u*.86),c);m.position.y=h/2,s.add(m);let y=o?new We(new Ai(u*.72,2.4,6),d):a?new We(new Gt(u+.35,.65,u*.86+.35),d):new We(new Ai(u*.76,1.6,4),d);return y.position.y=h+(a?.32:o?1.2:.8),!a&&!o&&(y.rotation.y=Math.PI/4),l&&(y.rotation.z=.14),s.add(y),s.position.set(t,n,i),{node:s,baseY:n,isDef:a,damaged:l,baseScale:1}}updateSiegeVisuals(e,t,i,n){if(!e||!this.siegeReady||this.disposed)return;let s=this.terrainType||"plains";if(!this.siegeProps){let o=new pt;o.name="3D Siege Fortifications",this.scene.add(o);let l=(g,v,T,A,E=0)=>{if(!g?.scene)return null;let P=g.scene.clone(!0),_=new Pt().setFromObject(P),M=Math.max(.1,_.max.y-_.min.y),R=v/M,F=ai(T,A,s);return P.scale.setScalar(R),P.position.set(T,F-_.min.y*R,A),P.rotation.y=E,o.add(P),{node:P,baseY:F-_.min.y*R,baseScale:R}},c=new Map,d=new Map,u=new fs(1.15,0),h=new Rt({color:6708819}),m=new jt({color:15039029});for(let g of e.structures||[]){let v=g.id==="gate"?this.siegeTemplates.gate||this.siegeTemplates.wall:this.siegeTemplates.tower||this.siegeTemplates.wall,T=g.id==="gate"?9.2:10.8,A=l(v,T,g.x,g.z,0);A&&c.set(g.id,A);let E=new pt,P=ai(g.x,g.z,s);for(let M=0;M<5;M++){let R=new We(u,h),F=M*1.25;R.position.set(Math.cos(F)*2.4,.4+M%2*.3,Math.sin(F)*1.4),R.scale.set(.9+M%3*.35,.55+M%2*.3,.9),E.add(R)}let _=new We(u,m);_.scale.set(.55,.3,.55),_.position.set(.4,.35,.2),E.add(_),E.position.set(g.x,P,g.z),E.visible=!1,o.add(E),d.set(g.id,{grp:E,ember:_})}for(let g of[-36,-13,13,36])l(this.siegeTemplates.wall||this.siegeTemplates.tower,6.8,g,-18,0);let y=[],b=e.assaultSide==="defender"?e.defenderEngines:e.attackerEngines,p=Math.min(2,b?.ram||0);for(let g=0;g<p;g++){let v=l(this.siegeTemplates.ram,3.2,(g-.5)*11+(p===1?5.5:0),6,Math.PI);v&&y.push({kind:"ram",item:v,baseZ:6})}let f=Math.min(2,(b?.catapult||0)+(b?.bombard||0));for(let g=0;g<f;g++){let v=l(this.siegeTemplates.catapult,3.4,g===0?-16:16,14,Math.PI);v&&y.push({kind:"catapult",item:v,baseZ:14})}let x=[];if(t?.buildings?.length)for(let g of t.buildings.slice(0,64)){let v=Pr(g.x,-36,36),T=Pr(g.z,-66,-25),A=ai(v,T,s),E=this._buildCapitalCompound(g,v,T,A);o.add(E.node),x.push(E)}this.siegeProps={group:o,structures:c,rubble:d,engines:y,capitalBuildings:x}}for(let o of e.structures||[]){let l=this.siegeProps.structures.get(o.id),c=this.siegeProps.rubble?.get(o.id);if(!l)continue;let d=o.max>0?Pr(o.hp/o.max,0,1):0;d<=0?(l.node.scale.set(l.baseScale,l.baseScale*.14,l.baseScale),l.node.position.y=l.baseY-.7,l.node.rotation.z=o.id==="gate"?0:o.id==="left"?-.24:.24,c&&(c.grp.visible=!0,c.ember.scale.setScalar(.45+Math.abs(Math.sin(n*4.2))*.28))):(l.node.scale.set(l.baseScale,l.baseScale*(.55+.45*d),l.baseScale),l.node.position.y=l.baseY,l.node.rotation.z=0,c&&(c.grp.visible=!1))}let a=e.structures?.[0]?.hp<=0;for(let o of this.siegeProps.engines)if(o.kind==="ram"){let l=a?-22:-13.5,c=(i||[]).filter(u=>u.side===e.assaultSide&&!u.routed).sort((u,h)=>u.z-h.z)[0],d=c?Pr(c.z-1.5,l,8):-8;if(o.item.node.position.z+=(d-o.item.node.position.z)*.08,!a&&o.item.node.position.z<-11.5){let u=Math.pow(Math.max(0,Math.sin(n*2.6)),4)*1.15;o.item.node.position.z-=u*.18}}else{let l=n*1.4,c=Math.pow(Math.max(0,Math.sin(l)),8);o.item.node.position.y=o.item.baseY+c*.24,o.item.node.position.z=o.baseZ+c*.45}}dispose(){this.disposed=!0,au(this);for(let e of this.groups.values())for(let t of e)t.mixer?.stopAllAction?.(),t.rig&&t.mixer?.uncacheRoot?.(t.rig),this.scene.remove(t.root),vi(t.root,this._sharedAssets);if(this.groups.clear(),this.mixers.length=0,this._sharedHorse){for(let e of Object.values(this._sharedHorse.geo))e.dispose?.();for(let e of Object.values(this._sharedHorse.mat))e.dispose?.();this._sharedHorse=null}if(this._sharedAssets?.clear?.(),this.envGroup&&(this.scene.remove(this.envGroup),vi(this.envGroup),this.envGroup=null),this.siegeProps?.group&&(this.scene.remove(this.siegeProps.group),vi(this.siegeProps.group),this.siegeProps=null),this.riverGroup&&(this.scene.remove(this.riverGroup),vi(this.riverGroup),this.riverGroup=null),this.commanderAuras){for(let e of Object.values(this.commanderAuras))this.scene.remove(e.grp),vi(e.grp);this.commanderAuras=null}if(this._envTemplates){for(let e of Object.values(this._envTemplates))vi(e);this._envTemplates=null}for(let e of Object.values(this.templates||{}))vi(e?.scene);for(let e of Object.values(this.regionalTemplates||{}))for(let t of Object.values(e||{}))vi(t?.scene);for(let e of Object.values(this.siegeTemplates||{}))vi(e?.scene);this.templates={},this.regionalTemplates={},this.siegeTemplates={},this.environment?.dispose?.();for(let e of Object.values(this.batches))e.geometry?.dispose?.(),e.material?.dispose?.(),this.scene.remove(e);this.batches={},this.renderer.renderLists?.dispose?.(),this.renderer.dispose?.()}};export{Po as GRAPHICS_PRESETS,Rh as ThreeBattleScene,Oo as detailedRegionalFamilyForRealm,Zv as formationPosition,Bc as regionalAliasFallback,Dc as regionalFamilyForRealm};
