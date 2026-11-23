/**
 * Crown of Nations — alternate-history kingdom systems.
 * Generated rulers, court names and stories are fictional game content.
 * AI is deterministic rule-based gameplay, NOT an external language model.
 */
export const VICTORY_YEAR=1500;
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
const hash=s=>{let n=2166136261;for(const ch of String(s))n=Math.imul(n^ch.charCodeAt(0),16777619);return n>>>0;};
const choose=(v,n)=>v[Math.trunc(Math.abs(n))%v.length];
const pair=(a,b)=>[a,b].sort().join('|');
const seeds={
 Europe:['Alaric','Isolde','Matilda','Edmund','Cecilia','Hugh','Eleanor','Baldwin','Margaret','Theodoric'],
 Asia:['Arslan','Shirin','Farid','Kamala','Jahan','Anika','Rashid','Meera','Yusuf','Soraya'],
 Africa:['Amina','Sundiata','Nefru','Kofi','Zahra','Amara','Idris','Dalia','Mekonnen'],
 'North America':['Itzel','Tecuani','Citlali','Aketzali','Nima','Kaya'],
 'South America':['Amaru','Killa','Inti','Chaska','Tupaq','Nayra'],
 Oceania:['Tama','Moana','Rangi','Aroha','Manaia','Kiri']
};
const monthNames=['January','February','March','April','May','June','July','August','September','October','November','December'];
const rand=g=>{g.seed=(Math.imul(g.seed,1664525)+1013904223)>>>0;return g.seed/4294967296;};
const log=(g,s)=>{g.log.unshift({date:monthNames[g.month]+' '+g.year,text:s});g.log=g.log.slice(0,45);};
const provinces=(g,id)=>Object.values(g.provinces).filter(p=>p.owner===id);
const armies=(g,id)=>Object.values(g.armies).filter(a=>a.owner===id);
const size=a=>a?Math.max(0,a.infantry+a.archers+a.cavalry):0;
const getRelation=(g,a,b)=>g.factions[a]?.relations?.[b]||0;
function newCourt(f){
 const n=hash(f.id),pool=seeds[f.continent]||seeds.Europe;
 return {
  dynasty:'House of '+f.name,
  ruler:{name:choose(pool,n)+' of '+f.name,age:28+n%23,stewardship:1+n%5,martial:1+(n>>>4)%5,diplomacy:1+(n>>>8)%5},
  heir:{name:choose(pool,n>>>5)+' of '+f.name,age:6+(n>>>13)%20},
  steward:1+(n>>>7)%3,marshal:1+(n>>>10)%3,
  lastAudience:-12,lastChronicle:-12,lastSuccession:-12,successions:0
 };
}
export function initializeKingdomSystems(g,world){
 if(g.kingdom?.version===1)return g.kingdom;
 const before=g.kingdom||{},courts={...(before.courts||{})};
 for(const f of world.factions)if(!courts[f.id])courts[f.id]=newCourt(f);
 g.kingdom={version:1,courts,tradePacts:before.tradePacts||{},threats:before.threats||[],
  pendingEvent:before.pendingEvent||null,eventsResolved:before.eventsResolved||0,
  choices:before.choices||[],victory:before.victory||null,difficulty:before.difficulty||'normal'};
 return g.kingdom;
}
export const currentCourt=g=>g.kingdom?.courts?.[g.player]||null;
export const tradePactCount=(g,id=g.player)=>Object.values(g.kingdom?.tradePacts||{}).filter(p=>p.partners.includes(id)).length;
export function tradeIncome(g,id){
 const marketSum=who=>provinces(g,who).reduce((n,p)=>n+(p.buildings.market||0),0);
 let value=0;
 for(const pact of Object.values(g.kingdom?.tradePacts||{})){
  if(!pact.partners.includes(id))continue;
  const other=pact.partners.find(x=>x!==id);
  value+=Math.min(85,6+marketSum(id)*3+marketSum(other)*2);
 }
 return Math.round(value);
}
export function courtDecision(g,world,action){
 initializeKingdomSystems(g,world);const f=g.factions[g.player],c=currentCourt(g);
 const rules={audience:[120,'lastAudience',6],steward:[250,null,0],marshal:[250,null,0],
  chronicle:[180,'lastChronicle',12],succession:[220,'lastSuccession',12]};
 const rule=rules[action];if(!f||!c||!rule)return {ok:false,msg:'Unknown court decision'};
 const [cost,field,cooldown]=rule;
 if(f.treasury<cost)return {ok:false,msg:'Need '+cost+' gold for this decision'};
 if(field&&g.turn-c[field]<cooldown)return {ok:false,msg:'The royal court needs time before repeating that decision'};
 if(action==='steward'&&c.steward>=5||action==='marshal'&&c.marshal>=5)return {ok:false,msg:'Court expertise already at maximum'};
 f.treasury-=cost;
 if(action==='audience'){f.stability=clamp(f.stability+6,0,100);f.legitimacy=clamp(f.legitimacy+3,0,100);for(const p of provinces(g,g.player))p.unrest=clamp(p.unrest-4,0,100);}
 if(action==='steward')c.steward++;
 if(action==='marshal'){c.marshal++;for(const a of armies(g,g.player)){a.experience=clamp(a.experience+.04,0,1);a.morale=clamp(a.morale+3,0,100);}}
 if(action==='chronicle'){f.prestige+=12;f.legitimacy=clamp(f.legitimacy+2,0,100);}
 if(action==='succession'){f.legitimacy=clamp(f.legitimacy+10,0,100);f.stability=clamp(f.stability+2,0,100);}
 if(field)c[field]=g.turn;
 const names={audience:'A royal audience was held',steward:'A steward was promoted',marshal:'The marshal reformed the command',chronicle:'The royal chronicle was commissioned',succession:'The royal succession was recognized'};
 log(g,names[action]+' in '+f.name+'.');
 return {ok:true,msg:names[action]};
}
export function royalDiplomacy(g,world,other,action){
 initializeKingdomSystems(g,world);
 const f=g.factions[g.player],o=g.factions[other];
 if(!f||!o||other==='independent'||other===g.player)return {ok:false,msg:'Invalid diplomatic court'};
 const rel=getRelation(g,g.player,other),id=pair(g.player,other);
 if(action==='trade'){
  if(g.kingdom.tradePacts[id])return {ok:false,msg:'Trade agreement is already active'};
  if(rel<10)return {ok:false,msg:'Relations must be at least +10 for trade'};
  if(f.treasury<140)return {ok:false,msg:'Need 140 gold to charter a trade route'};
  f.treasury-=140;g.kingdom.tradePacts[id]={partners:[g.player,other],founded:g.turn};
  f.relations[other]=clamp(rel+5,-100,100);o.relations[g.player]=clamp(getRelation(g,other,g.player)+5,-100,100);
  log(g,'Trade treaty signed between '+f.name+' and '+o.name+'.');
  return {ok:true,msg:'Merchant treaty signed; monthly trade income increased'};
 }
 if(action==='marriage'){
  if(rel<20)return {ok:false,msg:'Relations must reach +20 for a dynastic marriage'};
  if(f.treaties[other]==='marriage')return {ok:false,msg:'Royal houses are already related'};
  if(f.treasury<180)return {ok:false,msg:'Need 180 gold for a royal marriage'};
  f.treasury-=180;f.treaties[other]='marriage';o.treaties[g.player]='marriage';
  f.relations[other]=clamp(rel+20,-100,100);o.relations[g.player]=clamp(getRelation(g,other,g.player)+20,-100,100);
  f.legitimacy=clamp(f.legitimacy+6,0,100);f.prestige+=4;
  log(g,'A dynastic marriage joined the houses of '+f.name+' and '+o.name+'.');
  return {ok:true,msg:'Royal marriage agreed'};
 }
 return {ok:false,msg:'Unknown diplomatic mission'};
}
export const EVENTS=[
 {id:'harvest',title:'The Great Harvest',description:'Farmers bring carts of grain to the royal storehouses.',choices:[
  {label:'Store grain for leaner years',food:125,stability:-1},
  {label:'Distribute grain freely',cost:50,food:35,stability:7,legitimacy:2}
 ]},
 {id:'merchants',title:'A Merchant Guild Petitions',description:'Guild representatives ask the Crown to charter new markets.',choices:[
  {label:'Grant the merchant charter',cost:140,prestige:7,tech:1},
  {label:'Impose new tolls',gold:180,stability:-5}
 ]},
 {id:'riders',title:'Riders on the Frontier',description:'Your scouts report restless levies massing near the border.',choices:[
  {label:'Pay to reinforce the watch',cost:100,morale:8},
  {label:'Reassure the population',stability:3}
 ]},
 {id:'scholar',title:'A Scholar at Court',description:'A traveling scholar offers to instruct the royal household.',choices:[
  {label:'Sponsor the academy',cost:190,tech:1,prestige:5},
  {label:'Keep existing traditions',gold:15}
 ]},
 {id:'fever',title:'The Fever Season',description:'Physicians warn of illness spreading through crowded towns.',choices:[
  {label:'Fund apothecaries and care',cost:160,stability:5,food:-20},
  {label:'Enforce harsh quarantines',stability:-6,legitimacy:-3}
 ]},
 {id:'guilds',title:'The Guild Dispute',description:'Artisans and landowners compete for the royal ear.',choices:[
  {label:'Support guild workshops',cost:100,prestige:7,stability:2},
  {label:'Favor the landowners',gold:120,legitimacy:3,stability:-4}
 ]},
 {id:'festival',title:'A Festival of the Realm',description:'The court debates whether to hold a grand civic celebration.',choices:[
  {label:'Sponsor a royal festival',cost:155,stability:8,prestige:6},
  {label:'Permit local celebrations',stability:2}
 ]}
];
export function currentRoyalEvent(g){
 const e=EVENTS.find(x=>x.id===g.kingdom?.pendingEvent?.id);
 return e?{...e,created:g.kingdom.pendingEvent.created}:null;
}
export function resolveRoyalEvent(g,world,index){
 initializeKingdomSystems(g,world);const event=currentRoyalEvent(g),item=event?.choices?.[index];
 if(!Number.isInteger(index)||!item)return {ok:false,msg:'No such royal choice'};
 const f=g.factions[g.player];
 if(f.treasury<(item.cost||0))return {ok:false,msg:'Need '+item.cost+' gold for this option'};
 f.treasury=f.treasury-(item.cost||0)+(item.gold||0);
 f.food=clamp(f.food+(item.food||0),-1000,50000);
 f.stability=clamp(f.stability+(item.stability||0),0,100);
 f.legitimacy=clamp(f.legitimacy+(item.legitimacy||0),0,100);
 f.prestige=Math.max(0,f.prestige+(item.prestige||0));
 f.tech=clamp(f.tech+(item.tech||0),1,10);
 if(item.morale)for(const a of armies(g,g.player))a.morale=clamp(a.morale+item.morale,0,100);
 g.kingdom.pendingEvent=null;g.kingdom.eventsResolved++;
 g.kingdom.choices.push({year:g.year,month:g.month,event:event.id,choice:index});
 g.kingdom.choices=g.kingdom.choices.slice(-48);
 log(g,event.title+': '+item.label+'.');
 return {ok:true,msg:'Court decree recorded: '+item.label};
}
export function objectives(g){
 const f=g.factions[g.player],land=provinces(g,g.player);
 const goals=[
  ['provinces','Control six provinces',land.length,6],
  ['prestige','Earn 100 prestige',Math.round(f.prestige),100],
  ['treasury','Keep 3,000 gold in the treasury',Math.round(f.treasury),3000],
  ['stability','Maintain stability above 70',Math.round(f.stability),70],
  ['trade','Sign two merchant treaties',tradePactCount(g),2],
  ['technology','Advance to technology level 3',f.tech,3]
 ];
 return goals.map(([id,name,value,target])=>({id,name,value,target,complete:value>=target,progress:clamp(value/target,0,1)}));
}
export function campaignStanding(g){
 const goals=objectives(g),f=g.factions[g.player],owned=provinces(g,g.player).length;
 const fulfilled=goals.filter(v=>v.complete).length,ended=owned===0||g.year>=VICTORY_YEAR;
 const victory=ended&&owned>0&&fulfilled>=4;
 const score=Math.round(fulfilled*100+owned*13+f.prestige*1.4+Math.max(0,f.stability-40)*2+(g.kingdom?.eventsResolved||0)*8+Math.min(150,f.treasury/100)+tradePactCount(g)*28);
 return {score,fulfilled,total:goals.length,ended,victory,targetYear:VICTORY_YEAR,
  outcome:!ended?'Reign in progress':owned===0?'Your house has lost its last province':victory?'A lasting royal legacy is secured':'The dynasty leaves an uncertain legacy'};
}
function tickSuccession(g,world){
 for(const faction of world.factions){
  const c=g.kingdom.courts[faction.id],f=g.factions[faction.id];if(!c||!f)continue;
  c.ruler.age++;c.heir.age++;
  if(c.ruler.age<58||rand(g)>(c.ruler.age-57)*.003)continue;
  const before=c.ruler,seed=hash(c.heir.name+g.year),pool=seeds[faction.continent]||seeds.Europe;
  c.ruler={name:c.heir.name,age:Math.max(16,c.heir.age),stewardship:1+seed%5,martial:1+(seed>>>5)%5,diplomacy:1+(seed>>>9)%5};
  c.heir={name:choose(pool,seed)+' of '+faction.name,age:3+seed%13};c.successions++;
  f.legitimacy=clamp(f.legitimacy-8,0,100);f.stability=clamp(f.stability-4,0,100);
  if(faction.id===g.player||rand(g)<.05)log(g,c.dynasty+': '+before.name+' died. '+c.ruler.name+' now rules '+faction.name+'.');
 }
}
function aiMonthly(g,world){
 // Cap each rival to one infrastructure action and one recruitment decision
 // per cycle. No API calls, runaway build loops or invented "learning".
 for(const f of world.factions){
  if(f.id===g.player)continue;
  const nation=g.factions[f.id],land=provinces(g,f.id);
  if(!nation||!land.length)continue;
  if(g.turn%3===0&&nation.treasury>450){
   const p=choose(land,hash(f.id+g.turn));
   const neighbor=world.provinces.find(x=>x.id===p.id)?.neighbors||[];
   const frontier=neighbor.some(id=>g.provinces[id]?.owner!==f.id);
   const kind=nation.food<130?'farm':frontier&&(p.buildings.fort||0)<2?'fort':(p.buildings.market||0)<2?'market':'farm';
   const base={farm:180,fort:440,market:260}[kind],level=p.buildings[kind]||0,cost=base*(level+1);
   if(level<3&&nation.treasury>cost+150){nation.treasury-=cost;p.buildings[kind]++;p.development=clamp(p.development+1,1,20);}
  }
  if(g.turn%6===0&&nation.treasury>450){
   const a=armies(g,f.id).sort((x,y)=>size(x)-size(y))[0];
   if(a&&size(a)<650){nation.treasury-=120;a.infantry+=35;a.morale=clamp(a.morale+1,0,100);}
  }
  if(g.turn%12===0&&nation.treasury>450){
   const peers=world.factions.filter(p=>p.continent===f.continent&&p.id!==f.id);
   const other=peers.length?choose(peers,hash(f.id+g.year)):null;
   if(other&&!g.kingdom.tradePacts[pair(f.id,other.id)]&&getRelation(g,f.id,other.id)>-10){
    nation.treasury-=85;g.kingdom.tradePacts[pair(f.id,other.id)]={partners:[f.id,other.id],founded:g.turn,ai:true};
   }
  }
 }
}
function tickTrade(g){
 for(const p of Object.values(g.kingdom.tradePacts))for(const id of p.partners){
  const f=g.factions[id];if(!f)continue;
  const other=p.partners.find(x=>x!==id),sum=who=>provinces(g,who).reduce((n,x)=>n+(x.buildings.market||0),0);
  f.treasury+=Math.round(Math.min(85,6+sum(id)*3+sum(other)*2));
 }
}
function planInvasion(g,world){
 if(g.kingdom.threats.length||g.turn%15!==0||g.kingdom.difficulty==='peaceful')return;
 const targets=[];
 for(const a of Object.values(g.armies)){
  if(a.owner===g.player||a.owner==='independent'||size(a)<130||g.provinces[a.province]?.owner!==a.owner)continue;
  const home=world.provinces.find(p=>p.id===a.province);if(!home)continue;
  if(['alliance','marriage'].includes(g.factions[a.owner]?.treaties?.[g.player]))continue;
  for(const to of home.neighbors){
   const p=g.provinces[to];if(p?.owner!==g.player)continue;
   const defense=45+p.development*12+(p.buildings.fort||0)*45+armies(g,g.player).filter(x=>x.province===to).reduce((n,x)=>n+size(x),0);
   if(size(a)>defense*(g.kingdom.difficulty==='hard'?1.08:1.28))targets.push({by:a.owner,army:a.id,province:to,eta:3});
  }
 }
 if(targets.length){
  const target=choose(targets,hash(g.turn+g.seed));g.kingdom.threats.push(target);
  log(g,'INVASION WARNING: '+g.factions[target.by].name+' will attack '+target.province+' in three months. Move armies or build a fort.');
 }
}
function tickInvasions(g){
 const keep=[];
 for(const threat of g.kingdom.threats){
  threat.eta--;if(threat.eta>0){keep.push(threat);continue;}
  const army=g.armies[threat.army],p=g.provinces[threat.province];
  if(!army||!p||p.owner!==g.player||army.owner!==threat.by)continue;
  const defenders=armies(g,g.player).filter(a=>a.province===threat.province);
  const protection=45+p.development*12+(p.buildings.fort||0)*45+defenders.reduce((n,a)=>n+size(a)*(.65+a.experience*.3),0);
  const offensive=size(army)*(.88+army.experience*.25+army.morale/320);
  const enemyWins=offensive>protection*(1.08+rand(g)*.33);
  if(enemyWins){
   p.owner=threat.by;p.unrest=clamp(p.unrest+26,0,100);army.province=threat.province;
   army.infantry=Math.round(army.infantry*.8);army.archers=Math.round(army.archers*.8);army.cavalry=Math.round(army.cavalry*.8);
   for(const a of defenders){a.infantry=Math.round(a.infantry*.3);a.archers=Math.round(a.archers*.3);a.cavalry=Math.round(a.cavalry*.3);}
   log(g,threat.province+' fell to '+g.factions[threat.by].name+'. The lost province may be reconquered.');
  }else{
   army.infantry=Math.round(army.infantry*.76);army.archers=Math.round(army.archers*.76);army.cavalry=Math.round(army.cavalry*.76);
   g.factions[g.player].prestige+=5;log(g,'The garrison of '+threat.province+' successfully repelled '+g.factions[threat.by].name+'.');
  }
 }
 g.kingdom.threats=keep;
}
export function advanceKingdomSystems(g,world){
 initializeKingdomSystems(g,world);
 tickTrade(g);
 if(g.turn%3===0)aiMonthly(g,world);
 if(g.turn%12===0)tickSuccession(g,world);
 if(g.kingdom.threats.length)tickInvasions(g);
 if(g.turn%15===0)planInvasion(g,world);
 if(g.turn%9===0&&!g.kingdom.pendingEvent){
  const event=choose(EVENTS,hash(g.seed+g.turn+g.kingdom.eventsResolved));
  g.kingdom.pendingEvent={id:event.id,created:g.turn};
  log(g,'COURT EVENT: '+event.title+'. Open the Royal Court to decide.');
 }
 if(g.year>=VICTORY_YEAR&&!g.kingdom.victory){
  const result=campaignStanding(g);g.kingdom.victory={year:g.year,score:result.score,outcome:result.outcome};
  log(g,'THE YEAR 1500 — '+result.outcome+'. Score: '+result.score+'.');
 }
 return g;
}
