// Pillar 4: Heir Education Events (ages 6-16) — developmental choices shaping the future monarch.
import {changeOpinion} from './chronicle-systems.js';

const cap=(n,a,b)=>Math.max(a,Math.min(b,n));
const hash=s=>{let h=2166136261;for(const c of String(s))h=Math.imul(h^c.charCodeAt(0),16777619);return h>>>0;};
const live=(g,id)=>g.politics?.people?.[id]?.alive?g.politics.people[id]:null;

export const HEIR_EDUCATION_EVENTS=Object.freeze([
 {
  id:'heir_court_scholar',
  minAge:7,maxAge:13,
  title:'The Court Scholar’s Tutelage',
  describe:(heir,age)=>`Your ${age}-year-old heir, ${heir.name}, has drawn praise from the court scholar. How should their daily studies be shaped?`,
  choices:[
   {id:'rigorous',label:'Encourage rigorous discipline',cost:45,trait:'diligent',skill:'learning',skillDelta:1,axis:{diligence:25},opinion:8,memory:'Trained under strict scholarly discipline.'},
   {id:'charm',label:'Encourage courtly charm & rhetoric',cost:30,trait:'gregarious',skill:'diplomacy',skillDelta:1,axis:{sociability:25},opinion:12,memory:'Learned the arts of courtly conversation.'}
  ]
 },
 {
  id:'heir_swordsmanship',
  minAge:9,maxAge:16,
  title:'Aptitude in the Training Yard',
  describe:(heir,age)=>`At ${age}, ${heir.name} shows remarkable energy in the arms yard. The Marshal asks whether to train them as a frontline warrior or a grand quartermaster.`,
  choices:[
   {id:'warrior',label:'Train in blade and vanguard command',cost:55,trait:'brave',skill:'martial',skillDelta:1,axis:{boldness:28},opinion:10,memory:'Mastered swordsmanship in the royal yard.'},
   {id:'logistics',label:'Focus on campaign supply and patience',cost:40,trait:'patient',skill:'stewardship',skillDelta:1,axis:{diligence:20},opinion:6,memory:'Studied campaign logistics and fortification.'}
  ]
 },
 {
  id:'heir_tutor_report',
  minAge:8,maxAge:15,
  title:'The Royal Tutor’s Concerning Report',
  describe:(heir,age)=>`The royal tutor reports that ${heir.name} (${age}) was caught eavesdropping outside the privy council chamber with coded notes.`,
  choices:[
   {id:'cunning',label:'Quietly praise their cunning',cost:20,trait:'deceitful',skill:'intrigue',skillDelta:1,axis:{honor:-25},opinion:10,memory:'Encouraged to read the hidden currents of court.'},
   {id:'rebuke',label:'Rebuke them and demand open honor',cost:0,trait:'honest',skill:'diplomacy',skillDelta:1,axis:{honor:28},opinion:-6,memory:'Taught that a sovereign’s word must stand in daylight.'}
  ]
 },
 {
  id:'heir_merchant_ledger',
  minAge:10,maxAge:16,
  title:'The Spice Caravan Ledgers',
  describe:(heir,age)=>`A wealthy guild factor invites ${heir.name} (${age}) to inspect the crown’s customs tallies and caravan contracts.`,
  choices:[
   {id:'bargain',label:'Teach ruthless fiscal extraction',cost:0,trait:'greedy',skill:'stewardship',skillDelta:1,axis:{greed:26},gold:40,opinion:4,memory:'Learned to wring every coin from royal customs.'},
   {id:'patronage',label:'Teach generous royal patronage',cost:60,trait:'generous',skill:'diplomacy',skillDelta:1,axis:{compassion:24,greed:-20},opinion:14,memory:'Sponsored artisans and learned the value of goodwill.'}
  ]
 },
 {
  id:'heir_sanctuary_retreat',
  minAge:11,maxAge:16,
  title:'Questions in the Sanctuary',
  describe:(heir,age)=>`During a solemn observance, ${heir.name} (${age}) challenges the senior clergy on doctrine and temporal authority.`,
  choices:[
   {id:'devotion',label:'Insist on fervent devotion',cost:30,trait:'zealous',skill:'learning',skillDelta:1,axis:{zeal:30},piety:15,opinion:5,memory:'Embraced steadfast devotion to the realm’s faith.'},
   {id:'skeptic',label:'Encourage skeptical philosophical inquiry',cost:25,trait:'cynical',skill:'learning',skillDelta:1,axis:{zeal:-28},opinion:10,memory:'Adopted a cool, skeptical view of clerical power.'}
  ]
 },
 {
  id:'heir_royal_hunt',
  minAge:11,maxAge:16,
  title:'The First Royal Hunt',
  describe:(heir,age)=>`Deep in the royal hunting wood, a wounded tusked boar charges ${heir.name}’s (${age}) mount before the guards can close.`,
  choices:[
   {id:'stand',label:'Hold ground and meet the charge',cost:0,trait:'brave',skill:'martial',skillDelta:1,axis:{boldness:30},prestige:8,opinion:12,memory:'Stood fearless before a charging boar on the royal hunt.'},
   {id:'measured',label:'Order an orderly withdrawal to high ground',cost:0,trait:'cautious',skill:'learning',skillDelta:1,axis:{boldness:-18},opinion:6,memory:'Showed cool caution when danger struck in the forest.'}
  ]
 },
 {
  id:'heir_rival_peer',
  minAge:12,maxAge:16,
  title:'Insult from a Proud Noble’s Son',
  describe:(heir,age)=>`At court, a powerful vassal’s heir mocks ${heir.name} (${age}) over a tournament score. The nobles watch closely.`,
  choices:[
   {id:'iron_will',label:'Let your heir assert fierce dominance',cost:0,trait:'ambitious',skill:'martial',skillDelta:1,axis:{boldness:20,compassion:-15},prestige:6,opinion:8,memory:'Refused to yield an inch to proud vassal youths.'},
   {id:'composure',label:'Counsel dignified humility and restraint',cost:0,trait:'humble',skill:'diplomacy',skillDelta:1,axis:{compassion:20,honor:15},opinion:10,memory:'Won court admiration through calm dignity under insult.'}
  ]
 },
 {
  id:'heir_diplomatic_banquet',
  minAge:13,maxAge:16,
  title:'The Foreign Envoy’s Riddle',
  describe:(heir,age)=>`At a state banquet, foreign ambassadors pose a sharp political riddle to test ${heir.name}’s (${age}) readiness to rule.`,
  choices:[
   {id:'bold_claim',label:'Coach an authoritative sovereign answer',cost:40,trait:'proud',skill:'diplomacy',skillDelta:1,axis:{boldness:18},prestige:10,opinion:10,memory:'Spoke with royal authority before foreign envoys.'},
   {id:'temperate',label:'Counsel careful listening and measured words',cost:20,trait:'temperate',skill:'intrigue',skillDelta:1,axis:{diligence:16},opinion:10,memory:'Read the ambassadors’ hidden motives in silence.'}
  ]
 }
]);

const OPPOSITES={
 diligent:'indolent',indolent:'diligent',gregarious:'reserved',reserved:'gregarious',
 brave:'cautious',cautious:'brave',patient:'wrathful',wrathful:'patient',
 deceitful:'honest',honest:'deceitful',greedy:'generous',generous:'greedy',
 zealous:'cynical',cynical:'zealous',ambitious:'content',content:'ambitious',
 humble:'proud',proud:'humble',temperate:'gluttonous',gluttonous:'temperate'
};

export function initHeirEducation(g){
 g.heirEducation??={version:1,pending:{},seen:{},lastCheck:-1,history:[]};
 g.heirEducation.pending??={};
 g.heirEducation.seen??={};
 g.heirEducation.history??=[];
 return g.heirEducation;
}

export function primaryHeirChild(g,realm){
 const s=g.politics?.realms?.[realm];if(!s)return null;
 const heir=live(g,s.heir);
 if(heir&&heir.age>=6&&heir.age<=16)return heir;
 const ruler=live(g,s.ruler);
 if(!ruler)return null;
 return (ruler.children||[]).map(id=>live(g,id)).find(c=>c&&c.realm===realm&&c.age>=6&&c.age<=16)||null;
}

export function currentHeirEducationEvent(g,realm=g.player){
 const ed=initHeirEducation(g),p=ed.pending?.[realm];
 if(!p)return null;
 const heir=live(g,p.heirId);
 const def=HEIR_EDUCATION_EVENTS.find(e=>e.id===p.eventId);
 if(!heir||!def||heir.age>17){delete ed.pending[realm];return null;}
 return {
  id:def.id,
  heirId:heir.id,
  heirName:heir.name,
  heirAge:heir.age,
  title:def.title,
  description:def.describe(heir,heir.age),
  choices:def.choices,
  created:p.created
 };
}

export function tickHeirEducation(g){
 const ed=initHeirEducation(g);
 if(ed.lastCheck===g.turn)return;
 ed.lastCheck=g.turn;
 if(g.turn%6!==0)return;
 for(const realm of Object.keys(g.politics?.realms||{})){
  const existing=ed.pending[realm];
  if(existing){
   const h=live(g,existing.heirId);
   if(!h||h.age>17||g.turn-existing.created>24)delete ed.pending[realm];
   else continue;
  }
  const heir=primaryHeirChild(g,realm);
  if(!heir)continue;
  const seenKey=heir.id;
  ed.seen[seenKey]??=[];
  const eligible=HEIR_EDUCATION_EVENTS.filter(e=>heir.age>=e.minAge&&heir.age<=e.maxAge&&!ed.seen[seenKey].includes(e.id));
  if(!eligible.length)continue;
  const roll=hash(`heir-ed:${g.seed||1450}:${realm}:${heir.id}:${g.turn}`)%100;
  // Trigger roughly every 18 months for player, 24 months for AI
  if(realm===g.player?roll<45:roll<25){
   const chosen=eligible[hash(`pick:${heir.id}:${g.turn}`)%eligible.length];
   if(realm===g.player){
    ed.pending[realm]={eventId:chosen.id,heirId:heir.id,created:g.turn};
    g.log?.unshift({date:g.year+' · month '+(g.month+1),text:`HEIR EDUCATION: ${chosen.title} (${heir.name}, age ${heir.age}).`});
    if(g.log)g.log=g.log.slice(0,45);
   }else{
    // AI auto-resolves deterministically
    ed.pending[realm]={eventId:chosen.id,heirId:heir.id,created:g.turn};
    resolveHeirEducation(g,realm,chosen.choices[roll%chosen.choices.length].id);
   }
  }
 }
}

export function resolveHeirEducation(g,realm,choiceId){
 const ed=initHeirEducation(g),ev=currentHeirEducationEvent(g,realm);
 if(!ev)return {ok:false,msg:'No active heir education event.'};
 const choice=ev.choices.find(c=>c.id===choiceId)||ev.choices[Number(choiceId)];
 if(!choice)return {ok:false,msg:'Unknown education choice.'};
 const f=g.factions?.[realm],heir=live(g,ev.heirId),ruler=live(g,g.politics?.realms?.[realm]?.ruler);
 if(!f||!heir)return {ok:false,msg:'Heir no longer eligible.'};
 if((choice.cost||0)>0&&f.treasury<choice.cost)return {ok:false,msg:`Requires ${choice.cost} gold.`};
 if(choice.cost)f.treasury-=choice.cost;
 if(choice.gold)f.treasury+=choice.gold;
 if(choice.prestige)f.prestige=(f.prestige||0)+choice.prestige;
 if(choice.piety&&ruler)ruler.piety=(ruler.piety||0)+choice.piety;
 heir.traits??=[];
 if(choice.trait&&!heir.traits.includes(choice.trait)){
  const opp=OPPOSITES[choice.trait];
  if(opp)heir.traits=heir.traits.filter(t=>t!==opp);
  if(heir.traits.length>=6)heir.traits=heir.traits.slice(-5);
  heir.traits.push(choice.trait);
 }
 if(choice.skill&&heir.skills){
  heir.skills[choice.skill]=cap((heir.skills[choice.skill]||1)+(choice.skillDelta||1),1,10);
 }
 if(choice.axis){
  heir.personality??={};
  for(const [k,v] of Object.entries(choice.axis))heir.personality[k]=cap((heir.personality[k]||0)+v,-100,100);
 }
 if(heir.civic)heir.civic.education=cap((heir.civic.education||0)+2,0,8);
 if(ruler&&choice.opinion)changeOpinion(g,heir.id,ruler.id,choice.opinion);
 heir.memories??=[];
 heir.memories.push(`${g.year}: ${choice.memory}`);
 heir.memories=heir.memories.slice(-30);
 if(ruler){
  ruler.memories??=[];
  ruler.memories.push(`${g.year}: Guided ${heir.name} (${choice.label}).`);
  ruler.memories=ruler.memories.slice(-30);
 }
 ed.seen[heir.id]??=[];
 if(!ed.seen[heir.id].includes(ev.id))ed.seen[heir.id].push(ev.id);
 ed.history.unshift({turn:g.turn,year:g.year,realm,heirId:heir.id,heirName:heir.name,eventId:ev.id,title:ev.title,choice:choice.label,trait:choice.trait||null});
 ed.history=ed.history.slice(0,80);
 delete ed.pending[realm];
 if(realm===g.player){
  g.log?.unshift({date:g.year+' · month '+(g.month+1),text:`${heir.name} gained ${choice.trait||'experience'} (${choice.label}).`});
  if(g.log)g.log=g.log.slice(0,45);
 }
 return {ok:true,msg:`${heir.name}: ${choice.label} (+${choice.trait||choice.skill}).`,trait:choice.trait||null};
}

export const initEducationAndDrama = initHeirEducation;
export function successionCrisisAction(g, realm, action = 'placate') {
 const rs = g.politics?.realms?.[realm], f = g.factions?.[realm];
 if (!rs || !f) return { ok: false, msg: 'No active succession crisis.' };
 if (action === 'placate') {
  if ((f.treasury || 0) < 160) return { ok: false, msg: 'Requires 160 gold.' };
  f.treasury -= 160; f.legitimacy = Math.min(100, (f.legitimacy || 50) + 12);
  return { ok: true, msg: 'Claimants placated (+12 legitimacy).' };
 }
 f.legitimacy = Math.min(100, (f.legitimacy || 50) + 10);
 return { ok: true, msg: 'Succession authority asserted.' };
}
