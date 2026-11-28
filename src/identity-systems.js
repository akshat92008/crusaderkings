import {humanControlsRealm} from './player-career.js';
import {researchPatronBonus} from './living-systems.js';
import {faithCharterAction,faithCharterModifiers,faithSystemModifiers,tickFaithCharter} from './faith-institutions.js';
import {cultureAction,cultureModifiers,tickCulture,cultureLeadership} from './culture-systems.js';
// Institutions and traditions are fictional campaign abstractions, not claims
// about the beliefs or historical capabilities of actual communities.
import {controller} from './campaign-war.js';
import {subholdingProfile} from './subholdings.js';
const cap=(n,a,b)=>Math.max(a,Math.min(b,n)),ok=msg=>({ok:true,msg}),no=msg=>({ok:false,msg});
const own=(g,r)=>Object.values(g.provinces).filter(p=>p.owner===r&&controller(g,p.id)===r);
const ruler=(g,r)=>g.politics.people[g.politics.realms[r]?.ruler];
export const REGIONAL_TECHS=Object.freeze({
 military_org:{name:'Military organization',desc:'Improves regional levy mobilization and army readiness.'},
 construction:{name:'Construction techniques',desc:'Reduces building costs and speeds peacetime reconstruction.'},
 agriculture:{name:'Agricultural practices',desc:'Improves rural grain yields and famine resilience.'},
 trade:{name:'Commercial organization',desc:'Expands regional trade income and market turnover.'},
 legal_admin:{name:'Legal administration',desc:'Strengthens tax collection and local order.'},
 cultural_dev:{name:'Cultural development',desc:'Accelerates scholarship and community integration.'},
 naval_tech:{name:'Maritime & naval craft',desc:'Improves coastal trade, ports and naval logistics.'}
});
const TECH_KEYS=Object.keys(REGIONAL_TECHS);
export function ensureProvinceTech(g,id,p){
 g.identity??={};
 g.identity.provinceTech??={};
 let t=g.identity.provinceTech[id];
 if(!t){
  const dev=p?.development||5,baseProg=Math.min(75,dev*6);
  t=g.identity.provinceTech[id]={levels:Object.fromEntries(TECH_KEYS.map(k=>[k,1])),progress:Object.fromEntries(TECH_KEYS.map(k=>[k,baseProg]))};
 }
 return t;
}
export function provinceTechView(g,provinceId){
 const t=g.identity?.provinceTech?.[provinceId];
 if(!t)return null;
 return TECH_KEYS.map(k=>({id:k,...REGIONAL_TECHS[k],level:t.levels?.[k]||1,progress:Math.round(t.progress?.[k]||0)}));
}
export function realmTechSummary(g,r){
 const land=own(g,r);
 if(!land.length)return Object.fromEntries(TECH_KEYS.map(k=>[k,1]));
 const out={};
 for(const k of TECH_KEYS){
  let sum=0;for(const p of land)sum+=(g.identity?.provinceTech?.[p.id]?.levels?.[k]||1);
  out[k]=Math.round((sum/land.length)*100)/100;
 }
 return out;
}
export const TRADITIONS={
 local_councils:{name:'Local councils',desc:'Community consultation improves acceptance.',acceptance:1},
 craft_guilds:{name:'Craft guilds',desc:'Construction costs fall by 5%.',build:.95},
 merchant_networks:{name:'Merchant networks',desc:'Trade income rises by 6%.',trade:1.06},
 agrarian_stewardship:{name:'Agrarian stewardship',desc:'Improves tax yield by 4%.',tax:1.04},
 military_service:{name:'Military service',desc:'Levy yield rises by 6%.',levy:1.06},
 scholarly_patronage:{name:'Scholarly patronage',desc:'Accelerates innovation research by two points.',research:2},
 legal_mediation:{name:'Legal mediation',desc:'Local unrest decreases by one point.',unrest:-1},
 diplomatic_customs:{name:'Diplomatic customs',desc:'Diplomatic actions gain three additional relation points.',diplomacy:3}
};
export const INNOVATIONS={
 records:{name:'Administrative registers',cost:100,requires:[],desc:'Tax yield +5%.',tax:1.05},
 irrigation:{name:'Water management',cost:100,requires:[],desc:'Construction cost -4%.',build:.96},
 logistics:{name:'Military logistics',cost:120,requires:[],desc:'Levy yield +5%.',levy:1.05},
 accounting:{name:'Commercial accounting',cost:120,requires:[],desc:'Trade income +7%.',trade:1.07},
 courts:{name:'Codified court procedures',cost:160,requires:['records'],desc:'Scheme success +3 points.',scheme:3},
 workshops:{name:'Workshop organization',cost:160,requires:['irrigation','accounting'],desc:'Construction cost -6%.',build:.94},
 supply:{name:'Supply registers',cost:160,requires:['logistics','records'],desc:'Levy yield +6%.',levy:1.06},
 diplomacy:{name:'Permanent envoys',cost:160,requires:['records'],desc:'Diplomacy +5 points.',diplomacy:5},
 scholarship:{name:'Scholarly networks',cost:180,requires:['courts'],desc:'Research +3 points per quarter.',research:3},
 roads:{name:'Commercial road administration',cost:180,requires:['accounting','logistics'],desc:'Trade income +8%.',trade:1.08},
 taxation:{name:'Audited revenue accounts',cost:220,requires:['courts','accounting'],desc:'Tax yield +7%.',tax:1.07},
 public_works:{name:'Coordinated public works',cost:220,requires:['workshops','roads'],desc:'Construction cost -8%.',build:.92}
};
function note(g,r,msg){const s=g.identity;s.history.unshift({realm:r,turn:g.turn,message:msg});s.history=s.history.slice(0,200);if(r===g.player){g.log.unshift({date:g.year+' · month '+(g.month+1),text:msg});g.log=g.log.slice(0,45);}}
function initialTraditions(g,r){const type=g.civic.realms[r].government;return ['republic','city'].includes(type)?['merchant_networks','craft_guilds']:['imperial','centralized'].includes(type)?['scholarly_patronage','legal_mediation']:['steppe','military','shogunate'].includes(type)?['military_service','local_councils']:['kinship','confederation'].includes(type)?['local_councils','legal_mediation']:['agrarian_stewardship','local_councils'];}
export function initIdentity(g,world){if(g.identity?.version===1){g.identity.provinceTech??={};return g.identity;}const s=g.identity={version:1,realms:{},institutions:{},projects:{},provinceTech:{},history:[],lastTick:-1};
 for(const [r,c] of Object.entries(g.civic.realms)){s.realms[r]={traditions:initialTraditions(g,r),innovations:[],research:null,lastTradition:-120,lastFaith:-120,faithAuthority:55};}
 for(const p of world.provinces)s.institutions[p.id]={level:0,faith:g.civic.provinces[p.id].faith,lastConsultation:-12};
 return s;}
export function identityModifiers(g,r){const s=g.identity?.realms[r],out={tax:1,levy:1,trade:1,build:1,scheme:0,diplomacy:0,research:0,acceptance:0,unrest:0};if(!s)return out;for(const d of [...s.traditions.map(id=>TRADITIONS[id]),...s.innovations.map(id=>INNOVATIONS[id])])if(d)for(const k of Object.keys(out))if(typeof d[k]==='number')out[k]=['tax','levy','trade','build'].includes(k)?out[k]*d[k]:out[k]+d[k];const faith=faithCharterModifiers(g,r),culture=cultureModifiers(g,r);for(const k of Object.keys(faith))out[k]+=faith[k];for(const k of Object.keys(culture))out[k]+=culture[k];
 const fSys=faithSystemModifiers(g,r);if(fSys){out.tax*=fSys.tax??1;out.levy*=fSys.levy??1;}
 const tech=realmTechSummary(g,r);
 if(tech){
  if(tech.military_org>1)out.levy*=1+((tech.military_org-1)*0.03);
  if(tech.construction>1)out.build*=Math.max(0.7,1-((tech.construction-1)*0.03));
  if(tech.agriculture>1)out.tax*=1+((tech.agriculture-1)*0.02);
  if(tech.trade>1)out.trade*=1+((tech.trade-1)*0.03);
  if(tech.legal_admin>1)out.tax*=1+((tech.legal_admin-1)*0.02);
  if(tech.cultural_dev>1)out.research+=Math.floor(tech.cultural_dev-1);
 }
 return out;}
export function researchOptions(g,r){const s=g.identity?.realms[r];return s?Object.keys(INNOVATIONS).filter(id=>!s.innovations.includes(id)&&INNOVATIONS[id].requires.every(k=>s.innovations.includes(k))):[];}
export function localIdentities(g,r){const faith=new Set(),culture=new Set();for(const p of own(g,r)){const l=g.civic.provinces[p.id];faith.add(l.faith);culture.add(l.culture);}return {faith:[...faith],culture:[...culture]};}
export const RESEARCH_COMMISSION_COST = 150;
export function researchPointsPerQuarter(g, realm, modifiers = identityModifiers(g, realm)) {
 const scholar = g.politics?.people?.[g.politics?.realms?.[realm]?.ruler];
 return 5 + (scholar?.skills?.learning || 1) + modifiers.research + researchPatronBonus(g, realm);
}
function research(g,r,id){
 const s=g.identity.realms[r],f=g.factions[r];
 if(!own(g,r).length||s.research||!researchOptions(g,r).includes(id)||f.treasury<RESEARCH_COMMISSION_COST)
  return no('Research requires an available innovation, no active project and '+RESEARCH_COMMISSION_COST+' gold.');
 f.treasury-=RESEARCH_COMMISSION_COST;s.research={id,progress:0,started:g.turn};return ok('Research commissioned.');
}
function institution(g,r,id){const s=g.identity.institutions[id],p=g.provinces[id],f=g.factions[r];if(!s||!p||p.owner!==r||controller(g,id)!==r||s.level>=3||f.treasury<180*(s.level+1))return no('Requires controlled land, available institution level and sufficient gold.');f.treasury-=180*(s.level+1);s.level++;s.faith=g.civic.provinces[id].faith;return ok('Local institution expanded.');}
function project(g,r,id,kind){const l=g.civic.provinces[id],p=g.provinces[id],f=g.factions[r],c=g.civic.realms[r],s=g.identity;if(!l||!p||p.owner!==r||controller(g,id)!==r||s.projects[id]||l[kind]===c[kind]||l.acceptance<65||l.localTrust<60||c.policy==='coercion'||f.treasury<180)return no('Requires a different local identity, high trust and acceptance, non-coercive policy, controlled land and 180 gold.');f.treasury-=180;s.projects[id]={province:id,realm:r,kind,target:c[kind],original:l[kind],progress:0,started:g.turn};return ok('Voluntary community dialogue begun.');}
export function identityAction(g,world,action,id,extra){const s=initIdentity(g,world),r=g.player,state=s.realms[r],f=g.factions[r],c=g.civic.realms[r],l=g.civic.provinces[id],p=g.provinces[id];
 if(action==='culture-replace-tradition'){const leader=cultureLeadership(g,c.culture);if(!own(g,r).length||leader?.realm!==r||!Object.hasOwn(TRADITIONS,id)||state.traditions.includes(id)||!state.traditions.includes(extra)||g.turn-state.lastTradition<60||f.treasury<450||f.prestige<30)return no('Requires cultural leadership, a current tradition to replace, 450 gold, 30 prestige and five years between changes.');f.treasury-=450;f.prestige-=30;state.traditions=state.traditions.map(x=>x===extra?id:x);state.lastTradition=g.turn;note(g,r,'The cultural leader replaced a tradition with '+TRADITIONS[id].name+'.');return ok('Cultural tradition reformed.');}
 if(action.startsWith('culture-'))return cultureAction(g,r,action,id,extra);
 if(action.startsWith('faith-'))return faithCharterAction(g,r,action,id,extra);
 if(action==='research')return research(g,r,id);
 if(action==='tradition'){if(!own(g,r).length||!TRADITIONS[id]||state.traditions.includes(id)||state.traditions.length>=4||g.turn-state.lastTradition<60||f.treasury<350||f.prestige<20)return no('Requires a new tradition, available slot (four maximum), 350 gold, 20 prestige and five years between changes.');f.treasury-=350;f.prestige-=20;state.traditions.push(id);state.lastTradition=g.turn;return ok('Tradition adopted.');}
 if(action==='institution')return institution(g,r,id);
 if(action==='dialogue')return ['faith','culture'].includes(extra)?project(g,r,id,extra):no('Choose faith or culture.');
 if(action==='cancel'){if(s.projects[id]?.realm!==r)return no('No active dialogue.');delete s.projects[id];return ok('Dialogue ended.');}
 if(action==='province-tech'){
  const techKey=id, provId=extra;
  if(!REGIONAL_TECHS[techKey])return no('Unknown regional technology.');
  const p=g.provinces[provId];
  if(!p||p.owner!==r||controller(g,provId)!==r)return no('Requires controlled province.');
  const tech=ensureProvinceTech(g,provId,p);
  const curLvl=tech.levels[techKey]||1;
  if(curLvl>=5)return no('Technology is at maximum level.');
  const cost=curLvl*120;
  if(f.treasury<cost)return no('Requires '+cost+' gold.');
  f.treasury-=cost;
  tech.progress[techKey]=(tech.progress[techKey]||0)+40;
  if(tech.progress[techKey]>=100){
   tech.progress[techKey]-=100;
   tech.levels[techKey]=curLvl+1;
   note(g,r,p.id+' advanced in '+REGIONAL_TECHS[techKey].name+' to level '+(curLvl+1)+'.');
  }
  return ok('Invested in regional technology.');
 }
 if(action==='consult'){const x=s.institutions[id];if(!p||p.owner!==r||controller(g,id)!==r||!x||g.turn-x.lastConsultation<12||f.treasury<100)return no('Requires controlled land, 100 gold and yearly interval.');f.treasury-=100;x.lastConsultation=g.turn;l.acceptance=cap(l.acceptance+8,0,100);l.localTrust=cap(l.localTrust+10,0,100);return ok('Community consultation completed.');}
 if(action==='adopt-faith'){if(!localIdentities(g,r).faith.includes(id)||id===c.faith||g.turn-state.lastFaith<120||f.treasury<250)return no('Select a faith present in controlled land; requires 250 gold and ten years between changes.');f.treasury-=250;c.faith=id;ruler(g,r).civic.faith=id;state.lastFaith=g.turn;state.faithAuthority=40;f.legitimacy=cap(f.legitimacy-8,0,100);note(g,r,'The ruler adopted a different local faith. Provincial identities remain unchanged.');return ok('Ruler faith changed.');}
 return no('Unknown identity action.');}
export function tickIdentity(g,world){const s=initIdentity(g,world);if(s.lastTick===g.turn)return;s.lastTick=g.turn;if(g.turn%3!==0)return;
 for(const [r,state] of Object.entries(s.realms)){const f=g.factions[r],c=g.civic.realms[r],land=own(g,r);if(!land.length){if(state.faithCharter?.council||state.faithExchange)tickFaithCharter(g,r,land);if(state.culturalCourt?.study)tickCulture(g,r,land);continue;}const mod=identityModifiers(g,r);
 let backing=0;for(const p of land){const i=s.institutions[p.id],l=g.civic.provinces[p.id];if(i.level&&i.faith===l.faith){l.localTrust=cap(l.localTrust+i.level,0,100);l.devotion=cap(l.devotion+1,0,100);if(i.faith===c.faith)backing+=i.level;}const temple=subholdingProfile(g,p.id).temple;if(temple){l.localTrust=cap(l.localTrust+temple,0,100);if(l.faith===c.faith)backing+=temple;}l.acceptance=cap(l.acceptance+mod.acceptance,0,100);}
 state.faithAuthority=cap(state.faithAuthority+cap((45+Math.min(40,backing*5)-state.faithAuthority)*.15,-3,3),0,100);if(state.faithAuthority>=70&&g.turn%12===0)f.legitimacy=cap(f.legitimacy+1,0,100);
 tickFaithCharter(g,r,land);tickCulture(g,r,land);
  for(const p of land){
   const t=ensureProvinceTech(g,p.id,p);
   const learn=(ruler(g,r)?.skills?.learning||1);
   const instLvl=s.institutions[p.id]?.level||0;
   for(const k of TECH_KEYS){
    const lvl=t.levels[k]||1;
    if(lvl>=5)continue;
    let gain=1+Math.floor(learn/3)+(instLvl>0?1:0);
    const neighbors=world?.provinces?.find(wp=>wp.id===p.id)?.neighbors||[];
    for(const nid of neighbors){
     const nt=g.identity?.provinceTech?.[nid];
     if(nt&&(nt.levels?.[k]||1)>lvl){gain+=1;break;}
    }
    t.progress[k]=(t.progress[k]||0)+gain;
    if(t.progress[k]>=100){t.progress[k]-=100;t.levels[k]=lvl+1;}
   }
  }
 if(state.research){const rr=state.research,d=INNOVATIONS[rr.id];rr.progress+=researchPointsPerQuarter(g,r,mod);if(rr.progress>=d.cost){state.innovations.push(rr.id);state.research=null;note(g,r,d.name+' discovered.');}}
 if(!humanControlsRealm(g,r)&&g.turn%12===0&&f.treasury>700){if(!state.research){const opts=researchOptions(g,r);if(opts.length)research(g,r,opts[0]);}const p=land.find(p=>s.institutions[p.id].level===0&&g.civic.provinces[p.id].localTrust<80);if(p&&f.treasury>700)institution(g,r,p.id);if(f.treasury>1000&&f.prestige>=20&&state.traditions.length<4&&g.turn-state.lastTradition>=60){const options=Object.keys(TRADITIONS).filter(id=>!state.traditions.includes(id));const id=options.find(id=>id==='scholarly_patronage')||options[0];if(id){f.treasury-=350;f.prestige-=20;state.traditions.push(id);state.lastTradition=g.turn;}}}
 }
 for(const [id,x] of Object.entries(s.projects)){const p=g.provinces[id],l=g.civic.provinces[id],c=g.civic.realms[x.realm];if(!p||p.owner!==x.realm||controller(g,id)!==x.realm||c[x.kind]!==x.target||l[x.kind]!==x.original||c.policy==='coercion'){delete s.projects[id];continue;}if(l.acceptance<65||l.localTrust<60){x.progress=Math.max(0,x.progress-5);continue;}x.progress+=6+Math.floor(l.localTrust/20);if(x.progress>=100){l[x.kind]=x.target;delete s.projects[id];note(g,x.realm,'Community dialogue completed at '+id+'. Local '+x.kind+' identity changed in the simulation.');}}
}
