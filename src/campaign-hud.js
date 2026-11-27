// Presentation models share the authoritative campaign state.
import {successionPreview} from './dynastic-politics.js';
 const num=n=>Number.isFinite(n)?n:0,total=a=>(a.infantry||0)+(a.archers||0)+(a.cavalry||0),fmtInt=n=>Math.round(num(n)).toLocaleString('en-US');
export function formatTreasuryTooltip(f,stats){
 const treasury=Math.round(num(f?.treasury));
 const trade=Math.round(num(stats?.trade)+num(stats?.tradePosts));
 const tax=stats?.taxIncome!=null?Math.round(num(stats.taxIncome)):Math.round(num(stats?.income)-trade);
 const upkeep=Math.round(num(stats?.upkeep));
 const balance=stats?.balance!=null?Math.round(num(stats.balance)):(tax+trade-upkeep);
 const sign=balance>=0?'+':'';
 return `Treasury ${fmtInt(treasury)}g · +${fmtInt(tax)} Tax +${fmtInt(trade)} Trade -${fmtInt(upkeep)} Army Upkeep = ${sign}${fmtInt(balance)} Net Balance/mo`;
}
export function formatStabilityTooltip(f,stats){
 const stability=Math.round(num(f?.stability));
 const food=Math.round(num(f?.food));
 const grossFood=Math.round(num(stats?.grossFood));
 const foodUpkeep=Math.round(num(stats?.foodUpkeep));
 const foodDelta=stats?.foodDelta!=null?Math.round(num(stats.foodDelta)):(grossFood-foodUpkeep);
 const sign=foodDelta>=0?'+':'';
 return `Stability ${stability}% · Food Reserve ${fmtInt(food)} (+${fmtInt(grossFood)} Gross Food -${fmtInt(foodUpkeep)} Army Drain = ${sign}${fmtInt(foodDelta)}/mo)`;
}
export function characterDirectory(g,{scope='court',query='',sort='martial'}={}){const p=g.politics||{},r=g.playerCareer?.mode==='vassal'?g.playerCareer.person:p.realms?.[g.player]?.ruler,head=p.people?.[r],needle=query.trim().toLowerCase();const people=Object.values(p.people||{}).filter(c=>c.alive&&(scope==='foreign'?c.realm!==g.player:scope==='all'?true:c.realm===g.player)&&(scope!=='family'||c.house===head?.house||[head?.spouse,...(head?.children||[]),...(head?.parents||[])].includes(c.id))&&(!needle||[c.name,c.house,g.factions[c.realm]?.name,...(c.traits||[])].join(' ').toLowerCase().includes(needle)));return people.sort((a,b)=>sort==='name'?a.name.localeCompare(b.name):sort==='age'?b.age-a.age||a.name.localeCompare(b.name):num(b.skills?.[sort])-num(a.skills?.[sort])||a.name.localeCompare(b.name));}
export function vassalDirectory(g,sort='loyalty'){const p=g.politics||{},r=p.realms?.[g.player]?.ruler,groups=new Map();for(const [id,h] of Object.entries(p.holdings||{})){if(h.realm!==g.player||h.lord===r||g.provinces[id]?.owner!==g.player||!p.people[h.lord])continue;const x=groups.get(h.lord)||{id:h.lord,person:p.people[h.lord],holdings:[],wealth:0,loyalty:0,population:0,tax:0,levy:0};x.holdings.push(id);x.wealth+=num(h.wealth);x.loyalty+=num(h.loyalty);x.population+=num(g.provinces[id].population);x.tax+=num(h.tax);x.levy+=num(h.levy);groups.set(h.lord,x);}return [...groups.values()].map(x=>({...x,loyalty:x.loyalty/x.holdings.length,tax:x.tax/x.holdings.length,levy:x.levy/x.holdings.length})).sort((a,b)=>sort==='wealth'?b.wealth-a.wealth:sort==='holdings'?b.holdings.length-a.holdings.length:sort==='population'?b.population-a.population:a.loyalty-b.loyalty);}
export function armyOutliner(g){const by=new Map();for(const a of Object.values(g.armies||{})){if(a.owner!==g.player||total(a)<=0)continue;const embarked=!!g.naval?.voyages?.[a.id],key=a.province+'|'+embarked,x=by.get(key)||{province:a.province,embarked,troops:0,armies:0,unassigned:0};x.troops+=total(a);x.armies++;if(!g.military?.armies?.[a.id]?.commander)x.unassigned++;by.set(key,x);}return [...by.values()].sort((a,b)=>b.troops-a.troops||a.province.localeCompare(b.province));}
export function battleComparison(groups){const sides={attacker:{troops:0,morale:0,power:0,mix:{infantry:0,archers:0,cavalry:0}},defender:{troops:0,morale:0,power:0,mix:{infantry:0,archers:0,cavalry:0}}};for(const g of groups){const s=sides[g.side],n=Math.max(0,num(g.troopCount));if(!s||!n)continue;s.troops+=n;s.morale+=n*num(g.morale);s.power+=n*num(g.readiness?.power??1);s.mix[g.type]=(s.mix[g.type]||0)+n;}for(const s of Object.values(sides)){s.morale=s.troops?s.morale/s.troops:0;s.power=s.troops?s.power/s.troops:0;}const {attacker:a,defender:b}=sides;return {...sides,ratio:b.troops?a.troops/b.troops:null};}
export function portraitMark(person){let h=2166136261;for(const c of String(person?.id||'unknown'))h=Math.imul(h^c.charCodeAt(0),16777619);const colors=['#8d6b46','#536f76','#795d70','#6c7954','#a06e58','#6a647f'];return {color:colors[(h>>>0)%colors.length],initials:String(person?.name||'?').split(/\s+/).filter(Boolean).slice(0,2).map(s=>s[0].toUpperCase()).join('')};}

export function pickArmyMarker(markers,x,y){let best=null,d=Infinity;for(const m of markers){if(x<m.x-m.halfWidth||x>m.x+m.halfWidth||y<m.y-14||y>m.y+m.bottom)continue;const next=Math.hypot(x-m.x,y-m.y);if(next<d){best=m;d=next;}}return best;}

export function successionWarningSummary(g){
 const r=g?.politics?.realms?.[g.player];if(!r)return null;
 const people=g.politics?.people||{},ruler=people[r.ruler],heir=r.heir===null?null:(r.heir&&people[r.heir]?.alive)?people[r.heir]:successionPreview(g,g.player);
 if(!heir||!heir.alive)return {level:'urgent',label:'No living heir',detail:'No surviving dynastic successor is designated. Arrange a marriage or reform succession.'};
 const regent=g.regency?.realms?.[g.player];
 if((ruler?.age??20)<18||regent?.active)return {level:'attention',label:'Regency active',detail:'A regency governs until the sovereign comes of age or reasserts authority.'};
 const claimants=Object.values(g.feudal?.claimants||{}).filter(c=>c.realm===g.player&&c.person!==r.ruler&&people[c.person]?.alive);
 if(r.successionCrisis||g.succession?.crises?.[g.player]||claimants.length>=2)return {level:'attention',label:'Claimant pressure',detail:claimants.length+' rival claimant(s) hold claims on the crown.'};
 return null;
}

export function preWarComparison(g,world,targetRealm){
 if(!g||!targetRealm||!g.factions?.[targetRealm])return null;
 const countRealmTroops=id=>Object.values(g.armies||{}).filter(a=>a.owner===id&&!g.naval?.voyages?.[a.id]).reduce((n,a)=>n+total(a),0);
 const alliesOf=id=>{
  const set=new Set();
  const treaties=g.factions?.[id]?.treaties||{};
  for(const [k,v] of Object.entries(treaties))if(v==='alliance'&&g.factions[k])set.add(k);
  for(const p of Object.values(g.diplomacy?.guarantees||{}))if(p.protected===id&&g.factions[p.guarantor])set.add(p.guarantor);
  for(const pact of Object.values(g.strategy?.pacts||{}))if(pact.expires>g.turn&&pact.members?.includes(id))for(const m of pact.members)if(m!==id)set.add(m);
  set.delete(g.player);if(id!==targetRealm)set.delete(targetRealm);else set.delete(g.player);
  return [...set].filter(x=>Object.values(g.provinces||{}).some(p=>p.owner===x));
 };
 const ourAllies=alliesOf(g.player).filter(x=>x!==targetRealm),theirAllies=alliesOf(targetRealm).filter(x=>x!==g.player);
 const ourTroops=countRealmTroops(g.player),theirTroops=countRealmTroops(targetRealm);
 const ourAllyTroops=ourAllies.reduce((n,id)=>n+countRealmTroops(id),0),theirAllyTroops=theirAllies.reduce((n,id)=>n+countRealmTroops(id),0);
 const ourTotal=ourTroops+ourAllyTroops,theirTotal=theirTroops+theirAllyTroops;
 const ratio=theirTotal?ourTotal/theirTotal:null;
 const truceUntil=g.conflict?.truces?.[g.player+':'+targetRealm]||g.conflict?.truces?.[targetRealm+':'+g.player]||0;
 return {
  target:targetRealm,ourTroops,ourAllyTroops,ourTotal,ourAllies,
  theirTroops,theirAllyTroops,theirTotal,theirAllies,
  ratio,truceMonths:Math.max(0,truceUntil-g.turn),
  verdict:ratio===null?'Unopposed':ratio>=1.8?'Strongly favored':ratio>=1.15?'Favored':ratio>=0.85?'Even':'Outnumbered'
 };
}

export function tooltipData(g,world,kind,id){
 if(!g)return '';
 if(kind==='province'){
  const p=world?.provinces?.find(x=>x.id===id),st=g.provinces?.[id];
  if(!p||!st)return '';
  const owner=g.factions?.[st.owner]?.name||'Independent';
  const culture=g.civic?.provinces?.[id]?.culture||p.culture||'Local';
  const faith=g.civic?.provinces?.[id]?.faith||p.faith||'Local';
  return p.name+' · '+owner+' · Pop '+Math.round(st.population)+'k · Dev '+st.development+' · '+culture+' · '+faith+(p.deJureKingdom?' · De Jure '+p.deJureKingdom:'');
 }
 if(kind==='character'){
  const c=g.politics?.people?.[id];if(!c)return '';
  const s=c.skills||{};
  return c.name+' ('+c.age+'y) · '+(g.factions?.[c.realm]?.name||c.realm)+' · M '+num(s.martial)+' D '+num(s.diplomacy)+' S '+num(s.stewardship)+' I '+num(s.intrigue)+' L '+num(s.learning)+((c.traits?.length)?' · '+c.traits.slice(0,3).join(', '):'');
 }
 return '';
}
