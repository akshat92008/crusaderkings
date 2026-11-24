// Five workspaces retain every existing panel and its original action handlers.
export const WORKSPACES=[
 {id:'realm',name:'Realm',tabs:['realm','decrees','economy','trade']},
 {id:'court',name:'Court',tabs:['court','political','titles','stories']},
 {id:'foreign',name:'Diplomacy',tabs:['diplomacy','strategy']},
 {id:'war',name:'Military',tabs:['military','naval']},
 {id:'people',name:'Society',tabs:['society','identity','heritage','legacy','chronicle']}
];
export function workspaceFor(tab){return WORKSPACES.find(g=>g.tabs.includes(tab))||WORKSPACES[0];}
export function workspaceTab(id,remembered={}){const g=WORKSPACES.find(w=>w.id===id);return g?(g.tabs.includes(remembered[id])?remembered[id]:g.tabs[0]):null;}
export function realmPriorities(g,stats,royalEvent=false,expandedEvents=0){const f=g.factions[g.player],out=[];const add=(tab,label,detail,level='attention')=>out.push({tab,label,detail,level});if(!f)return out;
 const uncommanded=Object.values(g.armies||{}).filter(a=>a.owner===g.player&&(a.infantry+a.archers+a.cavalry)>0&&!g.naval?.voyages?.[a.id]&&!g.military?.armies?.[a.id]?.commander).length;if(g.kingdom?.threats?.length)add('military','Border threat','Check the invasion warning on the map.','urgent');
 if(f.treasury<0||stats.balance<0)add('economy','Treasury under pressure',f.treasury<0?'Treasury is in debt.':'Monthly expenses exceed income.',f.treasury<0?'urgent':'attention');
 if(f.food<30||stats.foodDelta<0)add('economy','Food supply',f.food<30?'Food reserves are low.':'Food reserves are falling.');
 if(uncommanded)add('military','Unassigned commanders',uncommanded+' field army/armies need a commander.');
 if(f.stability<45)add('decrees','Low stability','Review your laws and provincial unrest.');
 if(royalEvent)add('court','Royal court decision','A court decision is waiting.');
 if(expandedEvents>0)add('stories','Campaign events waiting',expandedEvents+' pending campaign event(s).');
 const factions=Object.values(g.conflict?.factions||{}).filter(x=>x.realm===g.player&&['organizing','ultimatum','civil war'].includes(x.status)&&x.pressure>=65);if(factions.length)add('political','Faction pressure','Review powerful internal opposition.','urgent');
 return out.sort((a,b)=>Number(b.level==='urgent')-Number(a.level==='urgent'));}

// Search by realm, geography, or government without exposing hidden game data.
export function searchRealms(factions,query=''){const normalized=s=>String(s??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();const words=normalized(query).trim().split(/\s+/).filter(Boolean);return factions.filter(f=>words.every(w=>normalized([f.name,f.id,f.continent,f.government].join(' ')).includes(w))).sort((a,b)=>a.name.localeCompare(b.name));}
