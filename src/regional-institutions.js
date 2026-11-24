// Merchant assemblies and steppe seasonal management use existing houses, herds and treasury.
import {controller} from './campaign-war.js';
import {isImprisoned} from './feudal-systems.js';
const cap=(n,a,b)=>Math.max(a,Math.min(b,n));
const ok=msg=>({ok:true,msg}),no=msg=>({ok:false,msg});
const type=(g,r)=>g.civic?.realms[r]?.government;
const owned=(g,r,id)=>g.provinces[id]?.owner===r&&controller(g,id)===r;
const eligible=(g,r,p)=>p?.alive&&p.age>=18&&p.realm===r&&p.id!==g.politics.realms[r]?.ruler&&!isImprisoned(g,p.id);
const isMerchant=(g,r)=>['republic','city'].includes(type(g,r));
function election(g,r,create=false){
 const s=g.institutions?.realms[r];if(!s||!isMerchant(g,r))return null;
 return s.election||(create?(s.election={chair:null,next:g.turn+12,funds:{},history:[]}):null);
}
function note(g,r,message){
 const root=g.institutions;root.history.unshift({realm:r,turn:g.turn,message});root.history=root.history.slice(0,120);
 if(r===g.player&&Array.isArray(g.log)){g.log.unshift({date:g.year+' · month '+(g.month+1),text:message});g.log=g.log.slice(0,45);}
}
export function merchantElectionView(g,r){
 if(!isMerchant(g,r))return null;
 const s=g.institutions?.realms[r],e=election(g,r),houses=new Map();
 const landed=new Set(Object.entries(g.politics.holdings).filter(([id,h])=>h.realm===r&&owned(g,r,id)).map(([,h])=>h.lord));
 for(const x of Object.values(s?.houses||{})){
  const p=g.politics.people[x.person];if(!eligible(g,r,p)||!landed.has(p.id))continue;
  const house=p.house||p.id,base=x.level*15+(p.skills?.stewardship??0)*5+(p.skills?.diplomacy??0)*3+Math.min(30,Math.floor((p.wealth||0)/20));
  const c={id:p.id,name:p.name||p.id,house,level:x.level,base,fund:e?.funds[house]??0,score:base+(e?.funds[house]??0)/5};
  const prev=houses.get(house);if(!prev||c.score>prev.score||c.score===prev.score&&c.id<prev.id)houses.set(house,c);
 }
 const candidates=[...houses.values()].sort((a,b)=>b.score-a.score||a.id.localeCompare(b.id));
 return {candidates,chair:candidates.find(c=>c.id===e?.chair)||null,next:e?.next??null,last:e?.history[0]||null,canFund:e&&g.turn<e.next&&candidates.length>=2};
}
export function merchantChairBonus(g,r){
 if(!isMerchant(g,r))return 0;const e=election(g,r);if(!e?.chair)return 0;
 const p=g.politics.people[e.chair],h=g.institutions.realms[r].houses[e.chair];
 if(!eligible(g,r,p)||!h||!Object.entries(g.politics.holdings).some(([id,v])=>v.lord===p.id&&v.realm===r&&owned(g,r,id)))return 0;
 return h.level*.015;
}
export function merchantCampaign(g,r,id){
 const v=merchantElectionView(g,r),f=g.factions[r];if(!v?.canFund)return no('Requires two eligible merchant families and an open election.');
 const c=v.candidates.find(c=>c.id===id);if(!c||c.fund>=150||f.treasury<50)return no('Select a candidate below the 150 gold campaign cap; requires 50 gold.');
 const e=election(g,r);f.treasury-=50;e.funds[c.house]=(e.funds[c.house]||0)+50;
 note(g,r,'Campaign support granted to '+c.house+'.');return ok('Merchant campaign funded.');
}
export function tickMerchantElections(g,r){
 if(!isMerchant(g,r))return;let e=election(g,r);
 if(!e&&Object.keys(g.institutions.realms[r].houses).length<2)return;
 const v=merchantElectionView(g,r);if(!e){if(v.candidates.length>=2)e=election(g,r,true);return;}
 if(e.chair&&!v.chair){e.chair=null;e.next=Math.min(e.next,g.turn+3);}
 if(g.turn>=e.next){
  if(v.candidates.length<2){e.next=g.turn+6;return;}
  const winner=v.candidates[0];e.chair=winner.id;e.history.unshift({turn:g.turn,winner:winner.id,house:winner.house,score:winner.score,runnerUp:v.candidates[1].id});e.history=e.history.slice(0,20);
  for(const [id,h] of Object.entries(g.politics.holdings)){if(h.realm!==r||!owned(g,r,id))continue;const candidate=v.candidates.find(c=>c.id===h.lord);if(candidate)h.loyalty=cap((h.loyalty??50)+(candidate.id===winner.id?8:candidate.fund>0?-6:0),0,100);}
  e.funds={};e.next=g.turn+24;note(g,r,winner.house+' won the merchant assembly election.');return;
 }
 if(r!==g.player&&g.turn%3===0&&e.next-g.turn<=6&&g.factions[r].treasury>800&&v.candidates.length>=2){
  const preferred=v.candidates.slice().sort((a,b)=>b.level-a.level||b.base-a.base||a.id.localeCompare(b.id))[0];
  if(preferred.score<v.candidates[0].score&&preferred.fund<150)merchantCampaign(g,r,preferred.id);
 }
}
export function steppePastureView(g,r){
 if(type(g,r)!=='steppe')return null;
 const s=g.institutions?.realms[r];return {herds:s?.herds??0,until:s?.pastureUntil??0,active:(s?.pastureUntil??0)>g.turn,season:['Winter','Spring','Summer','Autumn'][Math.floor((g.month||0)/3)%4]};
}
export function reservePasture(g,r){
 const v=steppePastureView(g,r),f=g.factions[r],s=g.institutions?.realms[r];if(!v||!s||v.herds<10||v.active||f.treasury<80||!Object.keys(g.provinces).some(id=>owned(g,r,id)))return no('Requires steppe government, 10 herds, controlled land, 80 gold and no active pasture reserve.');
 f.treasury-=80;s.pastureUntil=g.turn+12;note(g,r,'Clan pasture reserves secured for the next year.');return ok('Pasture reserves secured.');
}
export function tickSteppePasture(g,r,s){
 if(type(g,r)!=='steppe'||s.herds<=0)return;
 const f=g.factions[r],v=steppePastureView(g,r);
 if(f.food<0)s.herds=Math.max(0,s.herds-(v.active?3:8));
 else{f.food+=Math.floor(s.herds/5);s.herds=Math.min(100,s.herds+(v.active?4:2));}
 if(r!==g.player&&g.turn%12===0&&f.treasury>650&&s.herds>=40&&!v.active)reservePasture(g,r);
}
