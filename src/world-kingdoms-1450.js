/**
 * Phase 3 Global Map Overhaul (atlas-1450-v5):
 * Promotes unmapped 1450 polities and regional confederations across all 6 continents
 * from independent districts into 115+ playable kingdoms/states, subdivides oversized
 * provinces cleanly toward 950-1,050 playable districts, and applies regional historical
 * gazetteer province and duchy names.
 */
import {
  DENSE_MAP_VERSION,
  rebuildNeighbors,
  capitalDistrict,
  landComponents,
  realmGeography,
  atlasCoverage,
  verifyAtlasIntegrity,
  splitDistrictPublic,
  areaOfPoly,
  boundsOfPoly,
  insideBoxPublic
} from './historical-world.js';

export const GLOBAL_MAP_VERSION = 'atlas-1450-v5';

const R = (id, name, continent, capital, government, color, doctrineProfile, civicProfile, opts = {}) => ({
  id, name, continent, capital, government, color,
  specialty: doctrineProfile, doctrineProfile, civicProfile,
  initialTreasury: opts.treasury || 950,
  initialPrestige: opts.prestige || 10,
  referenceNames: opts.polities || [],
  boxes: opts.boxes || [],
  dynasty: opts.dynasty || null,
  ruler: opts.ruler || null,
  empire: opts.empire || null,
  kingdom: opts.kingdom || name,
  tradeHub: opts.tradeHub || name
});

export const GLOBAL_KINGDOMS_1450 = [
  // Europe & Mediterranean
  R('ireland', 'Earldom of Desmond & Irish Lords', 'Europe', [-8.4, 52.3], 'Feudal Lordship', '#4f8f5c', 'highland', ['feudal', 'Irish', 'Latin Christianity'], { boxes: [[-11, -5.5, 51, 55.6]], dynasty: 'FitzGerald', ruler: 'James FitzGerald', empire: 'Empire of Britannia', tradeHub: 'Cork' }),
  R('norway', 'Kingdom of Norway (Oldenburg)', 'Europe', [10.75, 59.91], 'Monarchy', '#6d7fa3', 'maritime', ['feudal', 'Norwegian', 'Latin Christianity'], { polities: ['House of Oldenburg'], boxes: [[4, 29, 58, 72]], dynasty: 'Oldenburg', ruler: 'Christian I', empire: 'Empire of Scandinavia', tradeHub: 'Bergen' }),
  R('livonia', 'Livonian Confederation', 'Europe', [24.11, 56.95], 'Monastic Order', '#8d8c78', 'chivalry', ['theocratic', 'Baltic-German', 'Latin Christianity'], { polities: ['Livonian Conference', 'Livonian Confederation'], boxes: [[21, 28.5, 56, 60]], dynasty: 'Mengede', ruler: 'Johann von Mengede', empire: 'Empire of Wendia', tradeHub: 'Riga' }),
  R('papacy', 'Papal States & Adriatic', 'Europe', [12.49, 41.90], 'Theocracy', '#d8c77b', 'pike', ['theocratic', 'Italian', 'Latin Christianity'], { polities: ['Papal States', 'Republic of Ragusa'], boxes: [[11.5, 19.5, 41, 46]], dynasty: 'Parentucelli', ruler: 'Nicholas V', empire: 'Empire of Italia', tradeHub: 'Rome' }),
  R('karaman', 'Beylik of Karaman', 'Asia', [32.85, 37.53], 'Beylik Sultanate', '#b66c55', 'chivalry', ['sultanate', 'Turkish', 'Sunni Islam'], { polities: ['Beylik of Karaman', 'Beylik of Dulkadir', 'Ramadanid Emirate'], boxes: [[32, 38, 36, 39.2]], dynasty: 'Karamanoğlu', ruler: 'Ibrahim II', empire: 'Ottoman Empire', tradeHub: 'Konya' }),
  R('aq-qoyunlu', 'Aq Qoyunlu Confederation', 'Asia', [40.22, 37.91], 'Tribal Confederation', '#59829d', 'steppe', ['steppe', 'Turkmen', 'Sunni Islam'], { polities: ['Aq Qoyunlu'], boxes: [[38, 46, 33.5, 40.5]], dynasty: 'Bayandur', ruler: 'Jahangir Beg', empire: 'Persian Empire', tradeHub: 'Amid' }),

  // Arabia & Red Sea
  R('rasulids', 'Rasulid Yemen', 'Asia', [44.01, 13.58], 'Sultanate', '#a65d48', 'maritime', ['sultanate', 'Yemeni Arab', 'Sunni Islam'], { polities: ['Rasulid Dynasty'], boxes: [[42.5, 52.5, 12, 18.5]], dynasty: 'Rasulid', ruler: 'Al-Masud Salah al-Din', empire: 'Arabian Empire', tradeHub: 'Aden' }),
  R('oman', 'Sultanate of Oman & Mahra', 'Asia', [58.59, 23.61], 'Maritime Sultanate', '#4c7e80', 'maritime', ['sultanate', 'Omani Arab', 'Islamic traditions'], { polities: ['Mahdids'], boxes: [[52.5, 60.5, 16, 26]], dynasty: 'Nabhanid', ruler: 'Sulaiman al-Nabhani', empire: 'Arabian Empire', tradeHub: 'Muscat' }),
  R('bahrain', 'Jabrid Emirate (East Arabia)', 'Asia', [49.90, 26.25], 'Emirate', '#8f7b4c', 'chivalry', ['sultanate', 'Gulf Arab', 'Sunni Islam'], { polities: ['Bahrani Dynasty'], boxes: [[45.5, 55, 22, 30]], dynasty: 'Jabrid', ruler: 'Ajwad ibn Zamil', empire: 'Arabian Empire', tradeHub: 'Al-Hasa' }),
  R('najd', 'Najd & Oasis Confederations', 'Asia', [46.72, 24.69], 'Tribal Emirate', '#a38961', 'steppe', ['tribal', 'Bedouin Arab', 'Sunni Islam'], { boxes: [[38, 53, 18.5, 29]], dynasty: 'al-Muraid', ruler: 'Mani al-Muraidi', empire: 'Arabian Empire', tradeHub: 'Diriyah' }),

  // Steppe, Urals & Siberia
  R('nogai', 'Nogai Horde', 'Asia', [51.92, 47.12], 'Nomadic Khanate', '#886d54', 'steppe', ['steppe', 'Nogai Tatar', 'Sunni Islam'], { polities: ['Nogai Horde'], boxes: [[48, 60, 42, 51]], dynasty: 'Manghit', ruler: 'Waqas Mirza', empire: 'Empire of Tartaria', tradeHub: 'Saraychik' }),
  R('sibir', 'Khanate of Sibir', 'Asia', [65.53, 57.15], 'Nomadic Khanate', '#577368', 'steppe', ['steppe', 'Siberian Tatar', 'Islamic traditions'], { polities: ['Khanate of Sibir'], boxes: [[56, 95, 50, 74]], dynasty: 'Taibughid', ruler: 'Mar ibn Khwaja', empire: 'Empire of Tartaria', tradeHub: 'Chimgi-Tura' }),
  R('kazakh', 'Kazakh & Moghul Steppe', 'Asia', [71.43, 45.20], 'Steppe Khanate', '#4c7988', 'steppe', ['steppe', 'Kazakh', 'Islamic traditions'], { boxes: [[60, 84, 39, 51]], dynasty: 'Jochid', ruler: 'Kerey Khan', empire: 'Empire of Turan', tradeHub: 'Sighnaq' }),
  R('perm', 'Great Perm & Pechora', 'Europe', [56.25, 58.01], 'Principality', '#6f8564', 'woodland', ['tribal', 'Permian', 'Christian traditions'], { boxes: [[46, 62, 57, 74]], dynasty: 'Velikopermsky', ruler: 'Mikhail of Perm', empire: 'Empire of Rus', tradeHub: 'Cherdyn' }),
  R('buryatia', 'Buryat & Baikal Clans', 'Asia', [107.58, 51.83], 'Steppe Clans', '#7d7a4c', 'steppe', ['steppe', 'Buryat', 'Buddhist and local traditions'], { boxes: [[94, 125, 49, 68]], dynasty: 'Khori', ruler: 'Barga Baatar', empire: 'Empire of Mongolia', tradeHub: 'Barguzin' }),
  R('yakutia', 'Sakha & Lena River Clans', 'Asia', [129.73, 62.03], 'Northern Confederacy', '#627c8e', 'archery', ['tribal', 'Sakha', 'Northern traditions'], { boxes: [[112, 148, 56, 76]], dynasty: 'Tygyn', ruler: 'Badzhei Darkhan', empire: 'Siberian Realm', tradeHub: 'Tuymaada' }),
  R('kamchatka', 'Koryak & Chukchi Polities', 'Asia', [158.65, 53.01], 'Coastal Clans', '#536f7d', 'maritime', ['tribal', 'Paleo-Siberian', 'Northern traditions'], { boxes: [[146, 180, 50, 75]], dynasty: 'Avacha', ruler: 'Elder Yeltun', empire: 'Siberian Realm', tradeHub: 'Nizhnekamchatsk' }),
  R('jurchen', 'Jianzhou Jurchens', 'Asia', [126.55, 43.84], 'Tribal Confederation', '#966d4a', 'steppe', ['steppe', 'Jurchen', 'Chinese and local traditions'], { boxes: [[124, 145, 42, 56]], dynasty: 'Aisin Gioro', ruler: 'Chungshan', empire: 'Manchuria', tradeHub: 'Hetu Ala' }),

  // South Asia, Himalayas & Southeast Asia
  R('ceylon', 'Kingdom of Kotte (Ceylon)', 'Asia', [79.89, 6.89], 'Monarchy', '#b88547', 'elephant', ['monarchy', 'Sinhalese', 'Theravada Buddhism'], { polities: ['Ceylon', 'Jaffna kingdom'], boxes: [[79, 82.5, 5.5, 10.2]], dynasty: 'Savulu', ruler: 'Parakramabahu VI', empire: 'Empire of Karnata', tradeHub: 'Kotte' }),
  R('orissa', 'Gajapati Kingdom (Orissa)', 'Asia', [85.83, 20.46], 'Monarchy', '#b4623e', 'elephant', ['monarchy', 'Odia', 'Hindu traditions'], { boxes: [[81.5, 87.5, 17, 23]], dynasty: 'Suryavamsa', ruler: 'Kapilendra Deva', empire: 'Empire of Hindustan', tradeHub: 'Cuttack' }),
  R('gondwana', 'Garha-Mandla (Gondwana)', 'Asia', [79.93, 23.16], 'Regional Kingdom', '#688351', 'woodland', ['regional', 'Gond', 'Hindu traditions'], { boxes: [[77, 84, 20.5, 25]], dynasty: 'Garha-Mandla', ruler: 'Kharji', empire: 'Empire of Hindustan', tradeHub: 'Garha' }),
  R('multan', 'Langah Sultanate (Multan)', 'Asia', [71.47, 30.19], 'Sultanate', '#5f8772', 'chivalry', ['sultanate', 'Punjabi-Multani', 'Sunni Islam'], { boxes: [[69, 75.5, 28, 33]], dynasty: 'Langah', ruler: 'Qutb al-Din Langah', empire: 'Empire of Hindustan', tradeHub: 'Multan' }),
  R('assam', 'Ahom Kingdom (Assam)', 'Asia', [94.63, 26.98], 'Monarchy', '#608660', 'river', ['monarchy', 'Ahom', 'Hindu and local traditions'], { boxes: [[90.5, 97.5, 24, 29]], dynasty: 'Sukaphaa', ruler: 'Susenphaa', empire: 'Empire of Bengal', tradeHub: 'Charaideo' }),
  R('hanthawaddy', 'Hanthawaddy Pegu', 'Asia', [96.48, 17.33], 'Maritime Kingdom', '#9b6e52', 'elephant', ['monarchy', 'Mon', 'Theravada Buddhism'], { polities: ['Hanthawaddy Kingdom'], boxes: [[95, 98.5, 14, 19.5]], dynasty: 'Wareru', ruler: 'Binnya Ran I', empire: 'Empire of Suvarnabhumi', tradeHub: 'Pegu' }),
  R('shan', 'Shan States & Ava', 'Asia', [97.03, 22.93], 'Confederation', '#837349', 'highland', ['regional', 'Shan-Burmese', 'Theravada Buddhism'], { polities: ['Shan States', 'Ava Kingdom'], boxes: [[94.5, 99.5, 19.5, 26]], dynasty: 'Hsenwi', ruler: 'Narapati of Ava', empire: 'Empire of Suvarnabhumi', tradeHub: 'Ava' }),
  R('khmer', 'Chaktomuk Khmer Kingdom', 'Asia', [104.92, 11.56], 'Monarchy', '#875763', 'elephant', ['monarchy', 'Khmer', 'Theravada Buddhism'], { polities: ['Khmer Empire'], boxes: [[102.5, 108, 10, 15.5]], dynasty: 'Varman', ruler: 'Ponhea Yat', empire: 'Empire of Suvarnabhumi', tradeHub: 'Chaktomuk' }),
  R('brunei', 'Sultanate of Brunei', 'Asia', [114.94, 4.90], 'Maritime Sultanate', '#967c3b', 'maritime', ['sultanate', 'Bruneian Malay', 'Sunni Islam'], { polities: ['Sultanate of Brunei'], boxes: [[108, 119.5, -4, 7.5]], dynasty: 'Bolkiah', ruler: 'Sulaiman', empire: 'Empire of Nusantara', tradeHub: 'Kota Batu' }),
  R('tondo', 'Rajahnate of Tondo & Luzon', 'Asia', [120.97, 14.61], 'Maritime Rajahnate', '#578b8c', 'maritime', ['tributary', 'Tagalog', 'Hindu-Buddhist traditions'], { polities: ['Tondo', 'Namayan'], boxes: [[119, 123.5, 13, 20]], dynasty: 'Lakandula', ruler: 'Gambang', empire: 'Luzon League', tradeHub: 'Tondo' }),
  R('sulu', 'Sultanate of Sulu & Visayas', 'Asia', [121.00, 6.05], 'Maritime Sultanate', '#6e598c', 'maritime', ['sultanate', 'Tausug-Visayan', 'Sunni Islam'], { boxes: [[118.5, 127, 4, 13]], dynasty: 'Al-Hashimi', ruler: 'Sharif ul-Hashim', empire: 'Nusantara', tradeHub: 'Jolo' }),
  R('tidore', 'Sultanates of Ternate & Tidore', 'Asia', [127.38, 0.78], 'Spice Sultanate', '#4c826e', 'maritime', ['sultanate', 'Malukan', 'Islamic and local traditions'], { boxes: [[119, 133, -7, 3.5]], dynasty: 'Kolano', ruler: 'Marhum', empire: 'Maluku Islands', tradeHub: 'Ternate' }),
  R('papua', 'Raja Ampat & Papua Polities', 'Oceania', [140.71, -2.53], 'Maritime Clans', '#637a57', 'woodland', ['tribal', 'Papuan', 'Local traditions'], { boxes: [[132, 153, -11, 1]], dynasty: 'Waigeo', ruler: 'Korano Waigeo', empire: 'Melanesia', tradeHub: 'Sorong' }),
  R('taiwan', 'Kingdom of Middag', 'Asia', [120.68, 24.15], 'Regional League', '#748d68', 'woodland', ['tribal', 'Austronesian', 'Local traditions'], { boxes: [[119.5, 122.5, 21.5, 25.6]], dynasty: 'Camachat', ruler: 'Quataongh', empire: 'Formosa', tradeHub: 'Middag' }),
  R('kanak', 'Melanesian Chiefdoms', 'Oceania', [166.45, -21.5], 'Island Chiefdoms', '#4d857b', 'maritime', ['tribal', 'Melanesian', 'Local traditions'], { boxes: [[154, 174.5, -24, -10]], dynasty: 'Kanak', ruler: 'Grand Chief', empire: 'Melanesia', tradeHub: 'Noumea' }),

  // Africa & Indian Ocean
  R('hafsids', 'Hafsid Sultanate (Tunis)', 'Africa', [10.18, 36.80], 'Sultanate', '#b48b48', 'maritime', ['sultanate', 'Tunisian Arab', 'Sunni Islam'], { polities: ['Hafsid Dynasty'], boxes: [[4.5, 14, 30, 37.5]], dynasty: 'Hafsid', ruler: 'Uthman al-Hafsi', empire: 'Empire of Maghreb', tradeHub: 'Tunis' }),
  R('fezzan', 'Sultanate of Fezzan', 'Africa', [14.43, 25.92], 'Oasis Sultanate', '#967752', 'steppe', ['sultanate', 'Fezzani', 'Sunni Islam'], { boxes: [[10, 26, 22, 32.5]], dynasty: 'Awlad Muhammad', ruler: 'Muntasir', empire: 'Sahara', tradeHub: 'Murzuk' }),
  R('tuareg', 'Tuareg Kel Ahaggar', 'Africa', [5.52, 22.79], 'Nomadic Confederation', '#7d735c', 'steppe', ['steppe', 'Tuareg', 'Islamic traditions'], { boxes: [[-16, 10.5, 18.5, 31]], dynasty: 'Amenokal', ruler: 'Akhamuk', empire: 'Sahara', tradeHub: 'Agadez' }),
  R('makuria', 'Kingdom of Makuria & Alodia', 'Africa', [31.11, 18.17], 'Monarchy', '#7e6087', 'highland', ['monarchy', 'Nubian', 'Christian traditions'], { polities: ['Makuria Kingdom', 'Alodia'], boxes: [[28, 37, 13, 23.5]], dynasty: 'Dotawo', ruler: 'Joel of Dotawo', empire: 'Nile Realm', tradeHub: 'Dongola' }),
  R('darfur', 'Daju Kingdom of Darfur', 'Africa', [25.35, 13.63], 'Regional Kingdom', '#8a6b48', 'river', ['monarchy', 'Daju', 'Local traditions'], { boxes: [[19, 31.5, 9, 21.5]], dynasty: 'Daju', ruler: 'Sultan Tunjur', empire: 'Sudanic Sahel', tradeHub: 'Al-Fashir' }),
  R('bornu', 'Kanem-Bornu Empire', 'Africa', [13.15, 11.85], 'Empire', '#4d6f96', 'chivalry', ['sultanate', 'Kanuri', 'Sunni Islam'], { polities: ['Bornu Empire'], boxes: [[8, 21, 9, 18.5]], dynasty: 'Sayfawa', ruler: 'Kadai III', empire: 'Sudanic Sahel', tradeHub: 'Ngazargamu' }),
  R('hausa', 'Hausa Bakwai Kingdoms', 'Africa', [8.52, 12.00], 'City-State League', '#b57b45', 'chivalry', ['sultanate', 'Hausa', 'Islamic and local traditions'], { boxes: [[2.5, 10.5, 10, 17.5]], dynasty: 'Habe', ruler: 'Muhammad Rumfa', empire: 'Sudanic Sahel', tradeHub: 'Kano' }),
  R('mossi', 'Mossi Kingdoms', 'Africa', [-1.52, 12.37], 'Feudal Cavalry Realm', '#826449', 'chivalry', ['monarchy', 'Mossi', 'West African traditions'], { boxes: [[-7, 2.5, 6.5, 13]], dynasty: 'Mogho Naba', ruler: 'Wubri', empire: 'West Africa', tradeHub: 'Ouagadougou' }),
  R('benin', 'Kingdom of Benin & Yoruba', 'Africa', [5.62, 6.34], 'Monarchy', '#9e4747', 'warrior', ['monarchy', 'Edo-Yoruba', 'West African traditions'], { boxes: [[1, 9.5, 4, 10]], dynasty: 'Oba', ruler: 'Ewuare the Great', empire: 'West Africa', tradeHub: 'Edo' }),
  R('luba', 'Luba-Lunda Empire', 'Africa', [25.00, -7.00], 'Monarchy', '#5d835b', 'warrior', ['monarchy', 'Luba', 'Central African traditions'], { boxes: [[18, 34, -14, 3]], dynasty: 'Kongolo', ruler: 'Ilunga Mbidi', empire: 'Congo Realm', tradeHub: 'Mwibele' }),
  R('kuba', 'Kuba & Loango Polities', 'Africa', [13.00, -3.50], 'Confederation', '#6f7f50', 'woodland', ['tribal', 'Bantu', 'Central African traditions'], { boxes: [[8.5, 18.5, -7, 6.5]], dynasty: 'Bushongo', ruler: 'Shyaam', empire: 'Congo Realm', tradeHub: 'Loango' }),
  R('mutapa', 'Kingdom of Mutapa', 'Africa', [31.05, -17.83], 'Monarchy', '#b08b49', 'highland', ['monarchy', 'Shona', 'Southern African traditions'], { boxes: [[24, 38, -24, -11.5]], dynasty: 'Munhumutapa', ruler: 'Nyatsimba Mutota', empire: 'Empire of Mutapa', tradeHub: 'Great Zimbabwe' }),
  R('sotho', 'Highveld & Zulu Polities', 'Africa', [27.50, -28.00], 'Confederation', '#56756b', 'warrior', ['tribal', 'Nguni-Sotho', 'Southern African traditions'], { boxes: [[19, 34.5, -35.5, -23.5]], dynasty: 'Bakoena', ruler: 'Nguni Elder', empire: 'Southern Africa', tradeHub: 'Thaba Bosiu' }),
  R('khoisan', 'Nama & Cape Polities', 'Africa', [18.42, -33.92], 'Pastoral League', '#827b63', 'archery', ['tribal', 'Khoikhoi', 'Southern African traditions'], { boxes: [[11, 23.5, -35.5, -15]], dynasty: 'Gorachouqua', ruler: 'Chieftain Gogosoa', empire: 'Southern Africa', tradeHub: 'Camissa' }),
  R('ajuran', 'Ajuran & Adal Coast', 'Africa', [45.34, 2.04], 'Maritime Sultanate', '#4d828c', 'maritime', ['sultanate', 'Somali', 'Sunni Islam'], { polities: ['Adal Sultanate'], boxes: [[39.5, 52, -1, 13]], dynasty: 'Garen', ruler: 'Imam Umar', empire: 'Horn of Africa', tradeHub: 'Mogadishu' }),
  R('merina', 'Malagasy Kingdoms', 'Africa', [47.52, -18.91], 'Island Monarchy', '#7b617d', 'river', ['monarchy', 'Malagasy', 'Local traditions'], { boxes: [[43, 51, -26, -11.5]], dynasty: 'Vazimba-Merina', ruler: 'Andriamanelo', empire: 'Indian Ocean', tradeHub: 'Alasora' }),

  // Americas
  R('chimu', 'Chimú Empire (Chan Chan)', 'South America', [-79.07, -8.11], 'Monarchy', '#b88644', 'river', ['monarchy', 'Mochica-Chimu', 'Andean traditions'], { polities: ['Chimu Empire'], boxes: [[-82, -77, -11, -3]], dynasty: 'Tacaynamo', ruler: 'Minchancaman', empire: 'Andean Realm', tradeHub: 'Chan Chan' }),
  R('chibcha', 'Quitu & Northern Andes', 'South America', [-78.51, -0.22], 'Confederation', '#5c8568', 'highland', ['regional', 'Quitu-Caranqui', 'Andean traditions'], { boxes: [[-81, -72, -5.5, 4]], dynasty: 'Shyri', ruler: 'Hualcopo', empire: 'Andean Realm', tradeHub: 'Quito' }),
  R('aymara', 'Aymara Colla Kingdoms', 'South America', [-68.15, -16.50], 'Altiplano Confederation', '#8c694a', 'highland', ['regional', 'Aymara', 'Andean traditions'], { boxes: [[-75.5, -64.5, -24, -8]], dynasty: 'Chuchi Capac', ruler: 'Cari of Chucuito', empire: 'Tawantinsuyu', tradeHub: 'Chucuito' }),
  R('arawak', 'Orinoco & Carib Confederacies', 'South America', [-63.50, 7.00], 'River Confederation', '#4d8774', 'river', ['tribal', 'Arawak-Carib', 'Local traditions'], { boxes: [[-72.5, -52, -1, 11.5]], dynasty: 'Lokono', ruler: 'Cacique Mara', empire: 'Guiana Basin', tradeHub: 'Orinoco' }),
  R('marajo', 'Amazonian River Polities', 'South America', [-58.00, -3.50], 'River Polities', '#42704a', 'woodland', ['tribal', 'Amazonian', 'Local traditions'], { boxes: [[-75, -48, -14, 4]], dynasty: 'Tapajo', ruler: 'Tuxaua Omagua', empire: 'Amazonia', tradeHub: 'Tapajos' }),
  R('guarani', 'Guaraní & Río de la Plata', 'South America', [-57.58, -25.26], 'Confederation', '#6d8a55', 'woodland', ['tribal', 'Guarani', 'Local traditions'], { boxes: [[-64, -49, -29, -13.5]], dynasty: 'Mburuvicha', ruler: 'Karaí Guazú', empire: 'Southern Plains', tradeHub: 'Parana' }),
  R('tehuelche', 'Patagonian & Pampas Nations', 'South America', [-67.50, -43.00], 'Nomadic Confederacy', '#7d785e', 'archery', ['tribal', 'Tehuelche', 'Local traditions'], { boxes: [[-74.5, -56, -56.5, -29]], dynasty: 'Aonikenk', ruler: 'Lonko Chaltén', empire: 'Patagonia', tradeHub: 'Chubut' }),
  R('taino', 'Taíno Caciquedoms', 'North America', [-69.90, 18.48], 'Island Chiefdoms', '#488894', 'maritime', ['tribal', 'Taino', 'Local traditions'], { boxes: [[-85, -59, 9, 25]], dynasty: 'Maguana', ruler: 'Cacique Caonabo', empire: 'Caribbean', tradeHub: 'Xaragua' }),
  R('tarascan', 'Tarascan Empire (Purépecha)', 'North America', [-101.19, 19.70], 'Monarchy', '#874f63', 'warrior', ['monarchy', 'Purepecha', 'Mesoamerican traditions'], { polities: ['Michoacán'], boxes: [[-110, -99, 17, 25]], dynasty: 'Uacusecha', ruler: 'Tangaxuan I', empire: 'Mesoamerica', tradeHub: 'Tzintzuntzan' }),
  R('cahokia', 'Mississippian & Cherokee Towns', 'North America', [-84.38, 33.75], 'Temple Chiefdoms', '#8c6943', 'river', ['tribal', 'Mississippian', 'North American traditions'], { boxes: [[-93, -74, 28, 39.5]], dynasty: 'Coosa', ruler: 'Mico Etowah', empire: 'Mississippi Valley', tradeHub: 'Etowah' }),
  R('lakota', 'Great Plains Confederacies', 'North America', [-100.35, 44.37], 'Nomadic Confederacy', '#967b54', 'steppe', ['steppe', 'Siouan-Plains', 'North American traditions'], { boxes: [[-114, -91, 37, 52]], dynasty: 'Oceti Sakowin', ruler: 'Wicasa Yatapika', empire: 'Great Plains', tradeHub: 'Pipestone' }),
  R('cree', 'Anishinaabe & Boreal Cree', 'North America', [-84.50, 48.00], 'Woodland League', '#597d68', 'woodland', ['tribal', 'Algonquian', 'North American traditions'], { boxes: [[-118, -55, 45.5, 61]], dynasty: 'Nehiyaw', ruler: 'Ogichidaa', empire: 'Boreal Shield', tradeHub: 'Baawitigong' }),
  R('dene', 'Dene & Athabascan Clans', 'North America', [-114.37, 62.45], 'Northern Clans', '#68737d', 'woodland', ['tribal', 'Dene', 'North American traditions'], { boxes: [[-140, -88, 56, 70]], dynasty: 'Yellowknife', ruler: 'Denendeh Elder', empire: 'Subarctic', tradeHub: 'Tinde' }),
  R('inuit', 'Thule & Arctic Polities', 'North America', [-68.52, 63.75], 'Arctic Confederation', '#718899', 'maritime', ['tribal', 'Inuit-Thule', 'Arctic traditions'], { boxes: [[-179, -15, 61, 84]], dynasty: 'Thule', ruler: 'Angakkuq Qitlaq', empire: 'Arctic', tradeHub: 'Baffin' }),
  R('salish', 'Pacific Northwest & Tlingit', 'North America', [-123.12, 49.28], 'Potlatch Chiefdoms', '#3f797d', 'maritime', ['tribal', 'Salish-Tlingit', 'North American traditions'], { boxes: [[-178, -115, 41, 68]], dynasty: 'Haida-Tlingit', ruler: 'Chief Callicum', empire: 'Pacific Northwest', tradeHub: 'Nootka' }),
  R('california', 'Californian Valley Polities', 'North America', [-121.49, 38.58], 'Regional Polities', '#8f7d49', 'woodland', ['tribal', 'Miwok-Chumash', 'North American traditions'], { boxes: [[-126, -112, 29, 41.5]], dynasty: 'Miwok', ruler: 'Chief Marin', empire: 'Pacific Coast', tradeHub: 'Yokuts' }),
  R('hawaii', 'Hawaiian Aliʻi Kingdoms', 'North America', [-157.85, 21.30], 'Island Kingdom', '#54829c', 'maritime', ['monarchy', 'Hawaiian', 'Polynesian traditions'], { boxes: [[-162, -153, 18, 23]], dynasty: 'Pili', ruler: 'Liloa of Hawaii', empire: 'Polynesia', tradeHub: 'Waipio' })
];

const GAZETTEER_PLACES = {
  'British Isles': ['Wessex', 'Mercia', 'Northumbria', 'York', 'Lancaster', 'Norfolk', 'Cornwall', 'Wales', 'Lothian', 'Highlands', 'Aberdeen', 'Galloway', 'Munster', 'Leinster', 'Connacht', 'Ulster'],
  'Iberia': ['Toledo', 'Seville', 'Burgos', 'Leon', 'Galicia', 'Cordoba', 'Coimbra', 'Lisbon', 'Algarve', 'Zaragoza', 'Valencia', 'Barcelona', 'Navarre', 'Granada'],
  'France': ['Ile-de-France', 'Normandy', 'Champagne', 'Orleans', 'Aquitaine', 'Toulouse', 'Anjou', 'Poitou', 'Provence', 'Rennes', 'Nantes', 'Brest', 'Burgundy', 'Flanders', 'Picardy', 'Dauphine'],
  'Italy': ['Lombardy', 'Piedmont', 'Venetia', 'Liguria', 'Tuscany', 'Romagna', 'Umbria', 'Latium', 'Campania', 'Apulia', 'Calabria', 'Sicily', 'Friuli', 'Dalmatia'],
  'Central Europe': ['Swabia', 'Bavaria', 'Franconia', 'Saxony', 'Brandenburg', 'Austria', 'Styria', 'Bohemia', 'Moravia', 'Silesia', 'Krakow', 'Masovia', 'Rhineland', 'Pomerania', 'Tyrol', 'Zurich'],
  'Scandinavia': ['Zealand', 'Scania', 'Uppland', 'Vastergotland', 'Oslo', 'Bergen', 'Trondheim', 'Finland', 'Estonia', 'Livonia', 'Courland', 'Smaland'],
  'Baltic': ['Gdansk', 'Prussia', 'Samogitia', 'Vilnius', 'Riga', 'Dorpat', 'Kaunas', 'Curonia'],
  'Balkans': ['Thrace', 'Macedonia', 'Thessaly', 'Morea', 'Epirus', 'Serbia', 'Bosnia', 'Wallachia', 'Moldavia', 'Bulgaria', 'Albania', 'Thessaloniki', 'Cyprus', 'Crete'],
  'Eastern Europe': ['Moscow', 'Vladimir', 'Tver', 'Novgorod', 'Pskov', 'Smolensk', 'Kiev', 'Ruthenia', 'Ryazan', 'Suzdal', 'Vologda', 'Karelia', 'Perm', 'Viatka'],
  'Anatolia': ['Bithynia', 'Smyrna', 'Ankara', 'Konya', 'Sivas', 'Erzurum', 'Trebizond', 'Cilicia', 'Amid', 'Kayseri'],
  'Caucasus': ['Kartli', 'Kakheti', 'Imereti', 'Shirvan', 'Armenia', 'Derbent', 'Ganja'],
  'Pontic Steppe': ['Crimea', 'Azov', 'Zaporizhia', 'Sarai', 'Astrakhan', 'Don', 'Kuban'],
  'Volga': ['Kazan', 'Bolgar', 'Simbirsk', 'Saratov', 'Samara', 'Saraychik'],
  'Iranian Plateau': ['Tabriz', 'Isfahan', 'Shiraz', 'Kerman', 'Yazd', 'Mashhad', 'Herat', 'Nishapur', 'Sistan', 'Mazandaran'],
  'Arabia': ['Hejaz', 'Mecca', 'Medina', 'Najd', 'Al-Hasa', 'Oman', 'Muscat', 'Yemen', 'Aden', 'Sanaa', 'Hadhramaut', 'Baghdad', 'Basra', 'Syria', 'Aleppo', 'Damascus'],
  'Central Asian Steppe': ['Samarkand', 'Bukhara', 'Khwarazm', 'Fergana', 'Kashgar', 'Yarkand', 'Turpan', 'Ili', 'Taraz', 'Tashkent', 'Sighnaq', 'Aral', 'Ural'],
  'Siberia': ['Tobolsk', 'Tyumen', 'Surgut', 'Ob', 'Yenisei', 'Tomsk', 'Irtysh', 'Angara', 'Baikal', 'Lena', 'Aldan', 'Kolyma', 'Kamchatka'],
  'Maghreb': ['Fez', 'Marrakesh', 'Tangier', 'Tlemcen', 'Oran', 'Algiers', 'Constantine', 'Tunis', 'Kairouan', 'Tripoli'],
  'Nile Valley': ['Cairo', 'Alexandria', 'Damietta', 'Fayyum', 'Asyut', 'Aswan', 'Dongola', 'Sennar'],
  'Horn of Africa': ['Axum', 'Gondar', 'Amhara', 'Shewa', 'Harar', 'Zeila', 'Mogadishu', 'Berbera', 'Merca'],
  'Sahel': ['Timbuktu', 'Gao', 'Jenne', 'Niani', 'Kano', 'Katsina', 'Bornu', 'Kanem', 'Wadai', 'Darfur', 'Mossi'],
  'Sahara': ['Fezzan', 'Murzuk', 'Agadez', 'Ahaggar', 'Taoudenni', 'Chinguetti', 'Ghat'],
  'East African coast': ['Mombasa', 'Malindi', 'Kilwa', 'Sofala', 'Zanzibar', 'Mutapa', 'Zimbabwe', 'Imerina', 'Tamatave'],
  'Congo Basin': ['Mbanza Kongo', 'Soyo', 'Loango', 'Ndongo', 'Kuba', 'Luba', 'Lunda', 'Kasai', 'Katanga'],
  'Indus region': ['Lahore', 'Multan', 'Thatta', 'Bhakkar', 'Srinagar', 'Kangra', 'Peshawar', 'Quetta'],
  'Gangetic Plain': ['Delhi', 'Agra', 'Kanauj', 'Jaunpur', 'Varanasi', 'Patna', 'Gwalior', 'Chittor', 'Mandu', 'Garha'],
  'Bengal Delta': ['Gaur', 'Dhaka', 'Sonargaon', 'Chittagong', 'Kamrup', 'Cuttack', 'Jajpur'],
  'Deccan': ['Bidar', 'Gulbarga', 'Ahmadnagar', 'Hampi', 'Vijayanagara', 'Madurai', 'Tanjore', 'Calicut', 'Ahmedabad', 'Surat', 'Champaner', 'Kotte'],
  'Himalayas': ['Lhasa', 'Shigatse', 'Guge', 'Amdo', 'Kham', 'Kathmandu', 'Mustang', 'Bhutan'],
  'North China': ['Beijing', 'Kaifeng', 'Xian', 'Taiyuan', 'Jinan', 'Luoyang', 'Liaodong', 'Datong', 'Lanzhou', 'Jianzhou'],
  'South China': ['Nanjing', 'Hangzhou', 'Suzhou', 'Fuzhou', 'Guangzhou', 'Chengdu', 'Wuchang', 'Changsha', 'Guilin', 'Kunming', 'Dadu'],
  'Korean Peninsula': ['Hanseong', 'Kaesong', 'Pyongyang', 'Gyeongju', 'Jeonju', 'Hamhung'],
  'Japanese Islands': ['Kyoto', 'Kamakura', 'Osaka', 'Sakai', 'Hakata', 'Sendai', 'Echigo', 'Satsuma', 'Kaga', 'Shuri'],
  'Mongolian Plateau': ['Karakorum', 'Orkhon', 'Khentii', 'Altai', 'Hulunbuir', 'Khalkha'],
  'Mainland Southeast Asia': ['Ayutthaya', 'Sukhothai', 'Chiang Mai', 'Luang Prabang', 'Vientiane', 'Thang Long', 'Hue', 'Pegu', 'Ava', 'Angkor', 'Chaktomuk', 'Vijaya'],
  'Malay Peninsula': ['Malacca', 'Kedah', 'Pahang', 'Johor', 'Patani', 'Singapura'],
  'Sumatra': ['Pasai', 'Aceh', 'Palembang', 'Jambi', 'Minangkabau', 'Siak'],
  'Java': ['Trowulan', 'Majapahit', 'Demak', 'Pakuan', 'Cirebon', 'Mataram', 'Bali'],
  'Borneo': ['Brunei', 'Pontianak', 'Banjarmasin', 'Kutai', 'Sambas'],
  'Philippines': ['Tondo', 'Maynila', 'Cebu', 'Butuan', 'Jolo', 'Cotabato'],
  'Mesoamerica': ['Tenochtitlan', 'Texcoco', 'Tlacopan', 'Tzintzuntzan', 'Oaxaca', 'Mayapan', 'Chichen Itza', 'Tikal', 'Culiacan'],
  'Central Andes': ['Cusco', 'Chan Chan', 'Cajamarca', 'Huanuco', 'Arequipa', 'Chucuito', 'Potosi', 'Titicaca'],
  'Northern Andes': ['Bacata', 'Tunja', 'Quito', 'Tomebamba', 'Popayan', 'Caracas']
};

export function globalRealmMetadata(id) {
  const r = GLOBAL_KINGDOMS_1450.find(x => x.id === id);
  if (!r) return null;
  return {
    dynasty: r.dynasty || r.name,
    ruler: r.ruler || 'Sovereign',
    culture: r.civicProfile[1],
    faith: r.civicProfile[2],
    empire: r.empire || (r.continent + ' Realm'),
    kingdom: r.kingdom || r.name,
    tradeHub: r.tradeHub || r.name
  };
}

function subdivideV5(world, targetCount = 980) {
  const skipIds = new Set();
  for (let pass = 0; pass < 3 && world.provinces.length < targetCount; pass++) {
    const parents = new Map();
    const candidates = world.provinces.slice().sort((a, b) => {
      const aa = areaOfPoly(a.geometry.coordinates) * Math.cos(a.centroid[1] * Math.PI / 180);
      const ab = areaOfPoly(b.geometry.coordinates) * Math.cos(b.centroid[1] * Math.PI / 180);
      return ab - aa || a.id.localeCompare(b.id);
    });
    for (const p of candidates) {
      if (world.provinces.length + parents.size >= targetCount) break;
      if (skipIds.has(p.id)) continue;
      const savedPop = p.population;
      const boostForSplit = p.population >= 4 && p.population < 8;
      if (boostForSplit) p.population = 8;
      const parts = splitDistrictPublic(p, 0.08);
      p.population = savedPop;
      if (parts) {
        if (boostForSplit) {
          const major = Math.max(2, Math.floor(savedPop / 2));
          parts[0].population = major;
          parts[1].population = Math.max(2, savedPop - major);
        }
        parts[1].id = p.id + '-v5p' + pass;
        parents.set(p.id, parts);
      } else {
        skipIds.add(p.id);
      }
    }
    if (!parents.size) break;

    const oldBy = new Map(world.provinces.map(p => [p.id, p]));
    const nextProvs = world.provinces.flatMap(p => parents.get(p.id) || [p]);
    rebuildNeighbors(nextProvs);
    const find = new Map(nextProvs.map(p => [p.id, p]));
    const invalid = new Set();
    const rootOf = new Map();
    for (const [id, parts] of parents) {
      for (const pt of parts) rootOf.set(pt.id, id);
    }

    for (const [id, parts] of parents) {
      if (!find.get(id).neighbors.includes(parts[1].id)) { invalid.add(id); continue; }
      for (const n of oldBy.get(id).neighbors) {
        const other = parents.get(n)?.map(p => p.id) || [n];
        if (!parts.some(p => find.get(p.id).neighbors.some(x => other.includes(x)))) {
          invalid.add(id);
          if (parents.has(n)) invalid.add(n);
        }
      }
    }
    for (const p of find.values()) {
      const a = rootOf.get(p.id) || p.id;
      for (const nb of p.neighbors) {
        const b = rootOf.get(nb) || nb;
        if (a !== b && !oldBy.get(a).neighbors.includes(b)) {
          if (parents.has(a)) invalid.add(a);
          if (parents.has(b)) invalid.add(b);
        }
      }
    }
    if (invalid.size) {
      for (const id of invalid) { parents.delete(id); skipIds.add(id); }
      world.provinces = world.provinces.flatMap(p => parents.get(p.id) || [p]);
      rebuildNeighbors(world.provinces);
    } else {
      world.provinces = nextProvs;
    }
  }
  return world;
}

export function populateGlobalKingdoms(denseV4) {
  if (!denseV4 || denseV4.meta?.mapVersion !== DENSE_MAP_VERSION) return denseV4;
  const world = JSON.parse(JSON.stringify(denseV4));

  // Step 1: Subdivide additional large districts toward ~980 districts cleanly
  subdivideV5(world, 980);

  // Step 2: Promote GLOBAL_KINGDOMS_1450 strictly from currently independent districts
  const existingIds = new Set(world.factions.map(f => f.id));
  const candidates = GLOBAL_KINGDOMS_1450.filter(r => !existingIds.has(r.id));
  const assignedByRealm = new Map();

  for (const r of candidates) assignedByRealm.set(r.id, []);

  // Pass 2a: Exact historicalPolity match on independent districts
  for (const p of world.provinces) {
    if (p.owner !== 'independent' || !p.historicalPolity) continue;
    const r = candidates.find(x => x.referenceNames.includes(p.historicalPolity));
    if (r) {
      p.owner = r.id;
      p.ownershipSource = 'reference';
      assignedByRealm.get(r.id).push(p);
    }
  }

  // Pass 2b: Bounding box assignment on remaining independent districts (prefer nearest capital when overlapping)
  for (const p of world.provinces) {
    if (p.owner !== 'independent') continue;
    const matching = candidates.filter(r => r.boxes.some(b => insideBoxPublic(p.centroid, b)));
    if (!matching.length) continue;
    matching.sort((a, b) => Math.hypot(p.centroid[0] - a.capital[0], p.centroid[1] - a.capital[1]) - Math.hypot(p.centroid[0] - b.capital[0], p.centroid[1] - b.capital[1]) || a.id.localeCompare(b.id));
    const chosen = matching[0];
    p.owner = chosen.id;
    p.ownershipSource = 'regional approximation';
    assignedByRealm.get(chosen.id).push(p);
  }

  // Pass 2c: Ensure every new realm receives >=1 province cleanly (claim nearest remaining independent or extra multi-province neighbor of same group)
  for (const r of candidates) {
    const owned = assignedByRealm.get(r.id);
    if (owned.length) continue;
    const indOpt = world.provinces
      .filter(p => p.owner === 'independent')
      .sort((a, b) => Math.hypot(a.centroid[0] - r.capital[0], a.centroid[1] - r.capital[1]) - Math.hypot(b.centroid[0] - r.capital[0], b.centroid[1] - r.capital[1]))[0];
    if (indOpt && Math.hypot(indOpt.centroid[0] - r.capital[0], indOpt.centroid[1] - r.capital[1]) <= 18) {
      indOpt.owner = r.id;
      indOpt.ownershipSource = 'playability approximation';
      owned.push(indOpt);
    }
  }

  // Register active new realms into world.factions
  for (const r of candidates) {
    const owned = assignedByRealm.get(r.id);
    if (!owned.length) continue;
    const { boxes, referenceNames, dynasty, ruler, empire, kingdom, tradeHub, ...f } = r;
    f.initialTreasury = 900 + Math.min(600, owned.length * 40);
    f.historicalDynasty = dynasty || f.name;
    f.historicalRuler = ruler || 'Sovereign';
    f.culture = f.civicProfile[1];
    f.faith = f.civicProfile[2];
    f.deJureEmpire = empire || (f.continent + ' Realm');
    f.deJureKingdom = kingdom || f.name;
    f.tradeHub = tradeHub || f.name;
    f.referenceNames = referenceNames;
    f.globalExpansionRealm = true;
    world.factions.push(f);
  }

  // Step 3: Enrich province names, duchies, culture, faith & connectivity across ALL realms
  const components = landComponents(world);
  const byId = new Map(world.provinces.map(p => [p.id, p]));
  for (const [i, ids] of components.entries()) {
    for (const id of ids) {
      const p = byId.get(id);
      p.landComponent = i + 1;
      p.landComponentSize = ids.length;
    }
  }

  const realmById = new Map(world.factions.map(f => [f.id, f]));
  const placeUsed = new Map();
  for (const p of world.provinces) {
    const f = realmById.get(p.owner);
    const rMeta = globalRealmMetadata(p.owner);
    if (rMeta) {
      p.deJureEmpire = rMeta.empire;
      p.deJureKingdom = rMeta.kingdom;
      p.culture = rMeta.culture;
      p.faith = rMeta.faith;
    } else if (p.owner === 'independent') {
      p.deJureKingdom = p.historicalPolity || (p.regionName + ' Frontier');
    }
    const list = GAZETTEER_PLACES[p.regionName] || [];
    const idx = placeUsed.get(p.regionName) || 0;
    placeUsed.set(p.regionName, idx + 1);
    if (list.length) {
      const base = list[idx % list.length];
      const round = Math.floor(idx / list.length) + 1;
      p.name = round === 1 ? base : `${base} (${p.regionName.split(' ')[0]} ${round})`;
    } else {
      const prefix = f ? f.name : (p.regionName || p.continent);
      p.name = `${prefix} · ${idx + 1}`;
    }
    p.nameSource = 'gazetteer-1450';
  }

  // Ensure 100% unique province names
  const seenNames = new Set();
  for (const p of world.provinces) {
    let candidate = p.name;
    let k = 2;
    while (seenNames.has(candidate)) {
      candidate = `${p.name} ${k++}`;
    }
    p.name = candidate;
    seenNames.add(candidate);
  }

  // Recompute named duchies cleanly (eliminate Roman numerals past X / ugly Cluster labels)
  const duchyBuckets = new Map();
  for (const p of world.provinces) {
    const key = p.deJureKingdom + '|' + (p.regionName || p.continent);
    const arr = duchyBuckets.get(key) || [];
    arr.push(p);
    duchyBuckets.set(key, arr);
  }
  const DIR = ['Northern', 'Central', 'Southern', 'Eastern', 'Western', 'Highland', 'Coastal', 'Inner', 'Outer', 'Frontier', 'March of', 'Upper'];
  for (const [key, list] of duchyBuckets) {
    list.sort((a, b) => b.centroid[1] - a.centroid[1] || a.centroid[0] - b.centroid[0] || a.id.localeCompare(b.id));
    const regionLabel = key.split('|')[1] || 'Province';
    const groupCount = Math.max(1, Math.ceil(list.length / 3));
    list.forEach((p, idx) => {
      const cluster = Math.min(groupCount, Math.floor(idx / 3) + 1);
      if (groupCount === 1) {
        p.deJureDuchy = `Duchy of ${regionLabel}`;
      } else {
        const dir = DIR[(cluster - 1) % DIR.length];
        const tail = cluster > DIR.length ? ` ${Math.ceil(cluster / DIR.length)}` : '';
        p.deJureDuchy = `${dir} ${regionLabel}${tail}`;
      }
    });
  }

  const seats = new Set();
  for (const f of world.factions) {
    f.startingSeat = capitalDistrict(world, f.id);
    f.startingGeography = realmGeography(world, f.id);
    if (f.startingSeat?.id) seats.add(f.startingSeat.id);
  }
  for (const p of world.provinces) {
    if (seats.has(p.id)) {
      const f = realmById.get(p.owner);
      p.tradeCenter = true;
      p.tradeCenterName = f?.tradeHub || p.name;
    }
  }

  world.meta = {
    ...world.meta,
    mapVersion: GLOBAL_MAP_VERSION,
    provinceCount: world.provinces.length,
    coverage: atlasCoverage(world),
    landConnectivity: { components: components.length, largest: components[0]?.length || 0 },
    caveat: 'Worldwide 1450 kingdoms & subdivisions aligned to Cliopatria/Seshat and regional confederations; gameplay borders remain approximate.'
  };
  return world;
}

export { verifyAtlasIntegrity };
