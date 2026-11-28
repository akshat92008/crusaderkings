import {chronicleArt} from './chronicle-art-data.js';
import {realmArt, realmArtRegion} from '../game-art.js';

const landscapeRegion = {
 Iceland:'eastern', 'British Isles':'western', Iberia:'western', Scandinavia:'eastern',
 Baltic:'eastern', Italy:'western', France:'western', 'Central Europe':'western',
 Balkans:'eastern', Anatolia:'ottoman', Caucasus:'eastern', 'Pontic Steppe':'steppe',
 Volga:'steppe', 'Eastern Europe':'eastern', Maghreb:'ottoman', 'Nile Valley':'eastafrica',
 'Red Sea hinterland':'eastafrica', 'Horn of Africa':'eastafrica', Sahel:'westafrica',
 Sahara:'westafrica', 'East African coast':'eastafrica', 'Congo Basin':'westafrica',
 'Southern Africa':'eastafrica', Arabia:'ottoman', 'Iranian Plateau':'persian',
 'Central Asian Steppe':'steppe', Siberia:'steppe', Himalayas:'northindia',
 'Indus region':'northindia', 'Bengal Delta':'northindia', 'Gangetic Plain':'northindia',
 Deccan:'southindia', 'Mongolian Plateau':'steppe', 'North China':'ming', 'South China':'ming',
 'Korean Peninsula':'japan', 'Japanese Islands':'japan', 'Mainland Southeast Asia':'southeast',
 'Malay Peninsula':'southeast', Sumatra:'southeast', Java:'southeast', Borneo:'southeast',
 Philippines:'southeast', 'Eastern Indonesian Islands':'southeast', 'New Guinea':'southeast',
 Australia:'southeast', Aotearoa:'southeast', 'South Pacific':'southeast', Alaska:'eastern',
 'North American Pacific Coast':'mesoamerica', 'Great Lakes':'mesoamerica',
 'North American Interior':'mesoamerica', 'Atlantic North America':'mesoamerica',
 Mesoamerica:'mesoamerica', Caribbean:'mesoamerica', 'Northern Andes':'andean',
 'Central Andes':'andean', 'Amazon Basin':'andean', 'Brazilian Highlands':'andean',
 'Southern Andes':'andean', 'Southern Plains':'andean'
};
const continentRegion = {
 Europe:'western', Africa:'eastafrica', Asia:'steppe',
 'North America':'mesoamerica', 'South America':'andean', Oceania:'southeast'
};
const landscapeFallback = {persian:'ottoman', westafrica:'eastafrica', mesoamerica:'andean'};
const realmId = realm => typeof realm === 'string' ? realm : realm?.id;

function approvedRegion(province, realm){
 return landscapeRegion[province?.regionName] || realmArtRegion(province?.owner)
  || realmArtRegion(realmId(realm)) || continentRegion[province?.continent || realm?.continent] || 'western';
}

function variant(urls, key) {
 if (!urls?.length) return null;
 let hash = 2166136261;
 for (const symbol of String(key ?? '')) hash = Math.imul(hash ^ symbol.charCodeAt(0), 16777619);
 return urls[(hash >>> 0) % urls.length];
}

export function provinceArt(province, realm) {
 const registered = approvedRegion(province, realm);
 const region = chronicleArt.landscapes[registered] || chronicleArt.landscapes[landscapeFallback[registered]];
 const terrain = province?.port || province?.coastal ? 'port' : province?.terrain || 'plains';
 const compatible = region?.[terrain] || region?.plains || chronicleArt.landscapes.western[terrain];
 return variant(compatible, province?.id || province?.name || realmId(realm));
}

export function provinceFlag(province, realm) {
 const region = approvedRegion(province, realm);
 return variant(chronicleArt.flags[region] || chronicleArt.flags.general, province?.id || province?.name || realmId(realm));
}

export function realmEmblem(realm) {
 return realmArt(realmId(realm)) || provinceFlag(null, realm);
}

export function chronicleScene(section, key) {
 return variant(chronicleArt.scenes[section], key);
}
