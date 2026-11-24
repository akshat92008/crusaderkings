// Institutions and traditions are fictional campaign abstractions, not claims
// about the beliefs or historical capabilities of actual communities.
import {controller} from './campaign-war.js';
const cap=(n,a,b)=>Math.max(a,Math.min(b,n)),ok=msg=>({ok:true,msg}),no=msg=>({ok:false,msg});
const own=(g,r)=>Object.values(g.provinces).filter(p=>p.owner===r&&controller(g,p.id)===r);
const ruler=(g,r)=>g.politics.people[g.politics.realms[r]?.ruler];
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
export function initIdentity(g,world){if(g.identity?.version===1)return g.identity;const s=g.identity={version:1,realms:{},institutions:{},projects:{},history:[],lastTick:-1};
 for(const [r,c] of Object.entries(g.civic.realms)){s.realms[r]={traditions:initialTraditions(g,r),innovations:[],research:null,lastTradition:-120,lastFaith:-120,faithAuthority:55};}
 for(const p of world.provinces)s.institutions[p.id]={level:0,faith:g.civic.provinces[p.id].faith,lastConsultation:-12};
 return s;}
export function identityModifiers(g,r){const s=g.identity?.realms[r],out={tax:1,levy:1,trade:1,build:1,scheme:0,diplomacy:0,research:0,acceptance:0,unrest:0};if(!s)return out;for(const d of [...s.traditions.map(id=>TRADITIONS[id]),...s.innovations.map(id=>INNOVATIONS[id])])if(d)for(const k of Object.keys(out))if(typeof d[k]==='number')out[k]=['tax','levy','trade','build'].includes(k)?out[k]*d[k]:out[k]+d[k];return out;}
export function researchOptions(g,r){const s=g.identity?.realms[r];return s?Object.keys(INNOVATIONS).filter(id=>!s.innovations.includes(id)&&INNOVATIONS[id].requires.every(k=>s.innovations.includes(k))):[];}
export function localIdentities(g,r){const faith=new Set(),culture=new Set();for(const p of own(g,r)){const l=g.civic.provinces[p.id];faith.add(l.faith);culture.add(l.culture);}return {faith:[...faith],culture:[...culture]};}
function research(g,r,id){const s=g.identity.realms[r],f=g.factions[r];if(s.research||!researchOptions(g,r).includes(id)||f.treasury<150)return no('Research requires an available innovation, no active project and 150 gold.');f.treasury-=150;s.research={id,progress:0,started:g.turn};return ok('Research commissioned.');}
function institution(g,r,id){const s=g.identity.institutions[id],p=g.provinces[id],f=g.factions[r];if(!s||p.owner!==r||controller(g,id)!==r||s.level>=3||f.treasury<180*(s.level+1))return no('Requires controlled land, available institution level and sufficient gold.');f.treasury-=180*(s.level+1);s.level++;s.faith=g.civic.provinces[id].faith;return ok('Local institution expanded.');}
function project(g,r,id,kind){const l=g.civic.provinces[id],p=g.provinces[id],f=g.factions[r],c=g.civic.realms[r],s=g.identity;if(!l||p.owner!==r||controller(g,id)!==r||s.projects[id]||l[kind]===c[kind]||l.acceptance<65||l.localTrust<60||c.policy==='coercion'||f.treasury<180)return no('Requires a different local identity, high trust and acceptance, non-coercive policy, controlled land and 180 gold.');f.treasury-=180;s.projects[id]={province:id,realm:r,kind,target:c[kind],original:l[kind],progress:0,started:g.turn};return ok('Voluntary community dialogue begun.');}
export function identityAction(g,world,action,id,extra){const s=initIdentity(g,world),r=g.player,state=s.realms[r],f=g.factions[r],c=g.civic.realms[r],l=g.civic.provinces[id],p=g.provinces[id];
 if(action==='research')return research(g,r,id);
 if(action==='tradition'){if(!TRADITIONS[id]||state.traditions.includes(id)||state.traditions.length>=4||g.turn-state.lastTradition<60||f.treasury<350||f.prestige<20)return no('Requires a new tradition, available slot (four maximum), 350 gold, 20 prestige and five years between changes.');f.treasury-=350;f.prestige-=20;state.traditions.push(id);state.lastTradition=g.turn;return ok('Tradition adopted.');}
 if(action==='institution')return institution(g,r,id);
 if(action==='dialogue')return ['faith','culture'].includes(extra)?project(g,r,id,extra):no('Choose faith or culture.');
 if(action==='cancel'){if(s.projects[id]?.realm!==r)return no('No active dialogue.');delete s.projects[id];return ok('Dialogue ended.');}
 if(action==='consult'){const x=s.institutions[id];if(!p||p.owner!==r||controller(g,id)!==r||!x||g.turn-x.lastConsultation<12||f.treasury<100)return no('Requires controlled land, 100 gold and yearly interval.');f.treasury-=100;x.lastConsultation=g.turn;l.acceptance=cap(l.acceptance+8,0,100);l.localTrust=cap(l.localTrust+10,0,100);return ok('Community consultation completed.');}
 if(action==='adopt-faith'){if(!localIdentities(g,r).faith.includes(id)||id===c.faith||g.turn-state.lastFaith<120||f.treasury<250)return no('Select a faith present in controlled land; requires 250 gold and ten years between changes.');f.treasury-=250;c.faith=id;ruler(g,r).civic.faith=id;state.lastFaith=g.turn;state.faithAuthority=40;f.legitimacy=cap(f.legitimacy-8,0,100);note(g,r,'The ruler adopted a different local faith. Provincial identities remain unchanged.');return ok('Ruler faith changed.');}
 return no('Unknown identity action.');}
export function tickIdentity(g,world){const s=initIdentity(g,world);if(s.lastTick===g.turn)return;s.lastTick=g.turn;if(g.turn%3!==0)return;
 for(const [r,state] of Object.entries(s.realms)){const f=g.factions[r],c=g.civic.realms[r],land=own(g,r);if(!land.length)continue;const mod=identityModifiers(g,r);
 let backing=0;for(const p of land){const i=s.institutions[p.id],l=g.civic.provinces[p.id];if(i.level&&i.faith===l.faith){l.localTrust=cap(l.localTrust+i.level,0,100);l.devotion=cap(l.devotion+1,0,100);if(i.faith===c.faith)backing+=i.level;}l.acceptance=cap(l.acceptance+mod.acceptance,0,100);}
 state.faithAuthority=cap(state.faithAuthority+cap((45+Math.min(40,backing*5)-state.faithAuthority)*.15,-3,3),0,100);
 if(state.research){const rr=state.research,d=INNOVATIONS[rr.id];rr.progress+=5+(ruler(g,r).skills.learning||1)+mod.research;if(rr.progress>=d.cost){state.innovations.push(rr.id);state.research=null;note(g,r,d.name+' discovered.');}}
 if(r!==g.player&&g.turn%12===0&&f.treasury>700){if(!state.research){const opts=researchOptions(g,r);if(opts.length)research(g,r,opts[0]);}const p=land.find(p=>s.institutions[p.id].level===0&&g.civic.provinces[p.id].localTrust<80);if(p&&f.treasury>700)institution(g,r,p.id);}
 }
 for(const [id,x] of Object.entries(s.projects)){const p=g.provinces[id],l=g.civic.provinces[id],c=g.civic.realms[x.realm];if(!p||p.owner!==x.realm||controller(g,id)!==x.realm||c[x.kind]!==x.target||l[x.kind]!==x.original||c.policy==='coercion'){delete s.projects[id];continue;}if(l.acceptance<65||l.localTrust<60){x.progress=Math.max(0,x.progress-5);continue;}x.progress+=6+Math.floor(l.localTrust/20);if(x.progress>=100){l[x.kind]=x.target;delete s.projects[id];note(g,x.realm,'Community dialogue completed at '+id+'. Local '+x.kind+' identity changed in the simulation.');}}
}
