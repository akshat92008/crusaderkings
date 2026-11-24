// Salaried royal household offices, distinct from voting council seats.
const cap=(v,a,b)=>Math.max(a,Math.min(b,v)),ok=msg=>({ok:true,msg}),no=msg=>({ok:false,msg});
export const COURT_OFFICES={
 treasurer:{name:'Royal treasurer',skill:'stewardship',salary:15,description:'Improves tax yield'},
 quartermaster:{name:'Quartermaster',skill:'martial',salary:15,description:'Improves levy yield'},
 envoy:{name:'Court envoy',skill:'diplomacy',salary:15,description:'Improves trade yield'},
 archivist:{name:'Keeper of records',skill:'learning',salary:10,description:'Improves construction efficiency'},
 intelligence:{name:'Confidential secretary',skill:'intrigue',salary:15,description:'Improves scheme preparation and counterintelligence'},
 physician:{name:'Court physician',skill:'learning',salary:15,description:'Reduces ruler stress each quarter'}
};
const ruler=(g,r)=>g.politics.people[g.politics.realms[r]?.ruler];
const land=(g,r)=>Object.values(g.provinces).some(p=>p.owner===r);
const opinion=(g,a,b)=>g.chronicles?.relationships?.[[a,b].sort().join('|')]?.opinion||0;
function note(g,r,msg){g.royalCourt.history.unshift({realm:r,turn:g.turn,message:msg});g.royalCourt.history=g.royalCourt.history.slice(0,150);if(r===g.player){g.log.unshift({date:g.year+' · month '+(g.month+1),text:msg});g.log=g.log.slice(0,45);}}
export function initRoyalCourt(g){const root=g.royalCourt??={version:1,realms:{},history:[],lastTick:-1};for(const r of Object.keys(g.politics.realms))root.realms[r]??={offices:{},last:{}};return root;}
function eligible(g,r,id){const p=g.politics.people[id],s=g.politics.realms[r];return !!p?.alive&&p.realm===r&&p.age>=18&&p.id!==s.ruler&&g.feudal?.prisoners?.[id]?.status!=='held'&&!Object.values(s.council||{}).includes(id);}
export function courtCandidates(g,r,role){const def=COURT_OFFICES[role],s=g.royalCourt?.realms[r];if(!def)return [];const busy=new Set(Object.values(s?.offices||{}).map(o=>o.person));return Object.values(g.politics.people).filter(p=>eligible(g,r,p.id)&&!busy.has(p.id)&&(p.skills?.[def.skill]||0)>=2).sort((a,b)=>b.skills[def.skill]-a.skills[def.skill]||a.id.localeCompare(b.id));}
function active(g,r,role){const o=g.royalCourt?.realms[r]?.offices[role];return o&&o.paidUntil>g.turn&&eligible(g,r,o.person)?g.politics.people[o.person]:null;}
function rating(g,r,role){const p=active(g,r,role),d=COURT_OFFICES[role];if(!p)return 0;return cap((p.skills[d.skill]||0)*(opinion(g,ruler(g,r)?.id,p.id)<-30?.5:1),0,5);}
export function courtModifiers(g,r){return {tax:1+rating(g,r,'treasurer')*.012,levy:1+rating(g,r,'quartermaster')*.014,trade:1+rating(g,r,'envoy')*.018,build:1-rating(g,r,'archivist')*.01,scheme:rating(g,r,'intelligence')*2,defense:rating(g,r,'intelligence')*2,stress:rating(g,r,'physician')};}
export function courtAction(g,r,action,role,id){const s=initRoyalCourt(g).realms[r],d=COURT_OFFICES[role],f=g.factions[r];if(!s||!d||!f||!land(g,r))return no('Select an eligible household office.');const old=s.offices[role];if(action==='court-dismiss'){if(!old)return no('Office is vacant.');delete s.offices[role];s.last[role]=g.turn;note(g,r,d.name+' dismissed.');return ok('Office vacated.');}if(action!=='court-appoint'||old||g.turn-(s.last[role]??-120)<6||!courtCandidates(g,r,role).some(p=>p.id===id)||f.treasury<d.salary+40)return no('Requires a vacant office, eligible adult, six-month appointment interval and '+(d.salary+40)+' gold.');f.treasury-=d.salary+40;s.offices[role]={person:id,appointed:g.turn,paidUntil:g.turn+3};s.last[role]=g.turn;note(g,r,g.politics.people[id].name+' appointed '+d.name+'.');return ok('Household appointment confirmed.');}
export function tickRoyalCourt(g){const root=initRoyalCourt(g);if(root.lastTick===g.turn)return;root.lastTick=g.turn;for(const [r,s] of Object.entries(root.realms)){const f=g.factions[r],head=ruler(g,r);if(!f||!head?.alive)continue;for(const [role,o] of Object.entries(s.offices)){const d=COURT_OFFICES[role];if(!d||!eligible(g,r,o.person)||!land(g,r)){delete s.offices[role];s.last[role]=g.turn;continue;}if(o.paidUntil<=g.turn){if(f.treasury<d.salary){delete s.offices[role];s.last[role]=g.turn;note(g,r,d.name+' left office because wages could not be paid.');continue;}f.treasury-=d.salary;o.paidUntil=g.turn+3;}}
 if(g.turn%3===0&&head.civic)head.civic.stress=cap(head.civic.stress-courtModifiers(g,r).stress,0,100);
 if(r!==g.player&&g.turn%12===0&&f.treasury>750&&land(g,r)){const focus=head.civic?.focus,preference={martial:'quartermaster',stewardship:'treasurer',diplomacy:'envoy',intrigue:'intelligence',learning:'archivist'}[focus]||'treasurer';const roles=[...(head.civic?.stress>=60?['physician']:[]),preference,...Object.keys(COURT_OFFICES)];for(const role of new Set(roles)){if(s.offices[role])continue;const options=courtCandidates(g,r,role).filter(p=>opinion(g,head.id,p.id)>=-30);if(options.length&&courtAction(g,r,'court-appoint',role,options[0].id).ok)break;}}
 }}
