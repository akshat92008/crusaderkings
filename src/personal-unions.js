// A personal union joins two crowns through ONE character record. Provinces,
// treasuries, armies, local councils, contracts and laws remain realm-owned.
import {successionCandidates} from './succession-systems.js';
import {syncTitles,isImprisoned} from './feudal-systems.js';
import {reconcileRegency} from './regency-systems.js';
const no=msg=>({ok:false,msg}),ok=msg=>({ok:true,msg}),cap=(x,a,b)=>Math.max(a,Math.min(b,x));
const person=(g,id)=>g.politics?.people?.[id];
const realm=(g,r)=>g.politics?.realms?.[r];
const ruler=(g,r)=>person(g,realm(g,r)?.ruler);
const landed=(g,r)=>Object.values(g.provinces).some(p=>p.owner===r);
const free=(g,p)=>p?.alive&&!isImprisoned(g,p.id);
const adult=(g,p)=>free(g,p)&&p.age>=18;
const rel=(g,a,b)=>g.factions[a]?.relations?.[b]??0;
const hereditary=s=>['eldest','youngest'].includes(s?.law);
const war=(g,a,b)=>Object.values(g.conflict?.wars||{}).some(w=>w.status==='active'&&((w.attacker===a&&w.defender===b)||(w.attacker===b&&w.defender===a)));
export function initPersonalUnions(g){return g.personalUnions??={version:1,unions:{},history:[],lastTick:-1};}
export function personalUnion(g,r){return Object.values(g.personalUnions?.unions||{}).find(u=>u.senior===r||u.junior===r)||null;}
export function unionPartners(g,a,b){const u=personalUnion(g,a);return !!u&&a!==b&&[u.senior,u.junior].includes(b)&&realm(g,u.senior)?.ruler===u.monarch&&realm(g,u.junior)?.ruler===u.monarch&&person(g,u.monarch)?.alive===true;}
export function unionJuniorDomain(g,r,id){const u=personalUnion(g,r);return u?.junior===r&&u.monarch===id&&realm(g,r)?.ruler===id;}
function note(g,u,msg){const s=initPersonalUnions(g);s.history.unshift({senior:u.senior,junior:u.junior,turn:g.turn,msg});s.history=s.history.slice(0,120);if([u.senior,u.junior].includes(g.player)){g.log.unshift({date:g.year+' · month '+(g.month+1),text:msg});g.log=g.log.slice(0,45);}}
function compatibleLaws(g,a,b){const x=realm(g,a),y=realm(g,b);return hereditary(x)&&hereditary(y)&&x.law===y.law&&g.civic?.realms?.[a]?.government!=='republic'&&g.civic?.realms?.[b]?.government!=='republic';}
export function unionTerms(g,senior,junior){
 const a=realm(g,senior),b=realm(g,junior),p=ruler(g,senior),q=ruler(g,junior),f=g.factions[senior],o=g.factions[junior];
 if(senior===junior||!a||!b||!f||!o||!landed(g,senior)||!landed(g,junior))return 'Both crowns must be landed and independent.';
 if(personalUnion(g,senior)||personalUnion(g,junior)||p?.id===q?.id)return 'Either crown is already in a personal union.';
 if(!adult(g,p)||!adult(g,q)||p.realm!==senior||q.realm!==junior)return 'Both crowns require free adult resident sovereigns.';
 if(!compatibleLaws(g,senior,junior))return 'Both crowns require the same eldest- or youngest-child succession law.';
 if(war(g,senior,junior)||rel(g,senior,junior)<60||rel(g,junior,senior)<60)return 'Requires peace and +60 mutual relations.';
 const married=p.spouse===q.id&&q.spouse===p.id,claim=(p.claims||[]).includes(junior);
 if(!married&&!claim)return 'Your sovereign requires a direct royal marriage or an inherited claim to the other crown.';
 if(!married&&o.legitimacy>40&&successionCandidates(g,junior).some(x=>x.age>=18))return 'The other crown has an established adult succession and refuses the claim.';
 if(f.legitimacy<75||f.prestige<100||f.treasury<300)return 'Requires 75 legitimacy, 100 prestige and 300 gold.';
 return '';
}
function syncCourt(g,r){const p=ruler(g,r),s=realm(g,r),c=g.kingdom?.courts?.[r];if(!p||!c)return;const h=successionCandidates(g,r)[0];c.dynasty=p.house;c.ruler={name:p.name,age:p.age,...p.skills};c.heir=h?{name:h.name,age:h.age}:{name:'No eligible child',age:0};for(const [role,id] of Object.entries(s.council||{}))if(id===p.id){const assigned=new Set(Object.values(s.council));s.council[role]=Object.values(g.politics.people).filter(q=>adult(g,q)&&q.realm===r&&q.id!==p.id&&!assigned.has(q.id)).sort((a,b)=>a.id.localeCompare(b.id))[0]?.id??null;}c.steward=person(g,s.council.steward)?.skills?.stewardship||1;c.marshal=person(g,s.council.marshal)?.skills?.martial||1;reconcileRegency(g,r);}
function domain(g,r,old,next){for(const [id,h] of Object.entries(g.politics.holdings))if(h.realm===r&&g.provinces[id]?.owner===r&&h.lord===old){h.lord=next;h.loyalty=65;}}
function found(g,senior,junior){
 const reason=unionTerms(g,senior,junior);if(reason)return no(reason);
 const p=ruler(g,senior),q=ruler(g,junior),s=initPersonalUnions(g),key=senior+'|'+junior,f=g.factions[senior],o=g.factions[junior];
 const u=s.unions[key]={id:key,senior,junior,monarch:p.id,formerRuler:q.id,formerHouse:q.house,started:g.turn,successions:0};
 f.treasury-=300;o.treasury+=200;realm(g,junior).ruler=p.id;delete realm(g,junior).nominee;
 domain(g,junior,q.id,p.id);o.legitimacy=cap(o.legitimacy+5,0,100);g.kingdom.courts[junior].successions++;
 syncCourt(g,junior);syncTitles(g);note(g,u,p.name+' now holds both crowns in personal union.');return ok('Personal union established; both realms retain separate state.');
}
function localSuccessor(g,u){
 const current=ruler(g,u.junior),old=person(g,u.formerRuler);
 if(free(g,current)&&current.realm===u.junior&&current.id!==u.monarch)return current;
 if(free(g,old)&&old.realm===u.junior)return old;
 const people=Object.values(g.politics.people).filter(p=>free(g,p)&&p.realm===u.junior&&p.id!==u.monarch);
 return people.sort((a,b)=>Number(b.house===u.formerHouse)-Number(a.house===u.formerHouse)||Number(b.age>=18)-Number(a.age>=18)||b.age-a.age||a.id.localeCompare(b.id))[0]||null;
}
function split(g,u,reason){
 const successor=localSuccessor(g,u);if(!successor)return false;
 const junior=realm(g,u.junior),old=u.monarch;
 junior.ruler=successor.id;delete junior.nominee;domain(g,u.junior,old,successor.id);
 delete initPersonalUnions(g).unions[u.id];g.factions[u.junior].legitimacy=cap(g.factions[u.junior].legitimacy-10,0,100);
 g.kingdom.courts[u.junior].successions++;
 syncCourt(g,u.junior);syncTitles(g);note(g,u,'Personal union ended: '+reason+'. '+successor.name+' rules '+g.factions[u.junior].name+'.');return true;
}
// Reconcile before further political ticks: no dead shared sovereign can
// remain on the junior throne after the senior succession is resolved.
export function reconcilePersonalUnions(g){
 const root=initPersonalUnions(g);
 for(const u of Object.values(root.unions)){
  const primary=ruler(g,u.senior),secondary=ruler(g,u.junior),old=person(g,u.monarch);
  if(!primary||!secondary){delete root.unions[u.id];continue;}
  if(secondary.id!==u.monarch){split(g,u,'the junior crown installed a different sovereign');continue;}
  if(!landed(g,u.senior)||!landed(g,u.junior)||!compatibleLaws(g,u.senior,u.junior)||war(g,u.senior,u.junior)){if(split(g,u,'incompatible crowns or loss of land'))continue;}
  if(primary.id===u.monarch)continue;
  const heir=successionCandidates(g,u.junior)[0];
  if(!old?.alive&&primary.alive&&heir?.id===primary.id&&compatibleLaws(g,u.senior,u.junior)){
   realm(g,u.junior).ruler=primary.id;domain(g,u.junior,u.monarch,primary.id);u.monarch=primary.id;u.successions++;g.kingdom.courts[u.junior].successions++;
   syncCourt(g,u.junior);syncTitles(g);note(g,u,primary.name+' inherited both crowns.');
  }else if(!split(g,u,'the crowns have different succession outcomes')&&primary.alive){
   realm(g,u.junior).ruler=primary.id;domain(g,u.junior,u.monarch,primary.id);u.monarch=primary.id;syncCourt(g,u.junior);syncTitles(g);
  }
 }
 return root;
}
export function personalUnionAction(g,action,id){
 const r=g.player,u=personalUnion(g,r);
 if(g.playerCareer?.mode==='vassal')return no('A sovereign must negotiate a crown union.');
 if(action==='union-form')return found(g,r,id);
 if(action==='union-release'){if(!u)return no('No active personal union.');return split(g,u,'voluntary separation')?ok('The crowns are separate again.'):no('No local successor is available.');}
 if(action==='union-switch'){if(!u||!unionPartners(g,r,id))return no('Select the other crown in your union.');if(g.kingdom?.threats?.length)return no('Resolve pending invasion alerts before switching crowns.');g.player=id;return ok('Now administering '+g.factions[id].name+'. The other crown continues autonomously.');}
 return no('Unknown personal union action.');
}
export function tickPersonalUnions(g){
 const s=reconcilePersonalUnions(g);if(s.lastTick===g.turn)return;s.lastTick=g.turn;
 if(g.turn%12!==0)return;
 for(const r of Object.keys(g.politics.realms).sort()){
  if(r===g.player||personalUnion(g,r))continue;const p=ruler(g,r);if(!adult(g,p))continue;
  const candidates=[...new Set([...(p.claims||[]),person(g,p.spouse)?.realm].filter(Boolean))].filter(id=>id!==g.player&&id!==r).sort();
  const junior=candidates.find(id=>!unionTerms(g,r,id));if(junior)found(g,r,junior);
 }
}
export function renderPersonalUnions(g,esc){
 const r=g.player,u=personalUnion(g,r),btn=(action,id,label)=>'<button class="rowbtn" data-action="politics" data-type="'+action+'" data-id="'+esc(id)+'">'+esc(label)+'</button>';
 if(u){const other=u.senior===r?u.junior:u.senior;return '<div class="rule"><h3>PERSONAL UNION</h3><p>'+esc(ruler(g,r)?.name||'')+' holds '+esc(g.factions[u.senior].name)+' and '+esc(g.factions[u.junior].name)+'. Each crown keeps its own treasury, army, laws and vassals.</p>'+btn('union-switch',other,'Administer '+g.factions[other].name)+btn('union-release','','Separate the crowns')+'</div>';}
 const p=ruler(g,r),candidates=[...new Set([...(p?.claims||[]),person(g,p?.spouse)?.realm].filter(id=>id&&id!==r&&g.politics.realms[id]))];
 return '<details class="rule"><summary>Personal unions</summary><p class="paragraph">A consensual union requires a royal marriage or dynastic claim and compatible hereditary laws. Legal ownership and treasuries remain separate.</p>'+(candidates.length?candidates.map(id=>{const reason=unionTerms(g,r,id);return '<p>'+esc(g.factions[id].name)+'</p>'+(reason?'<p class="smallnote">'+esc(reason)+'</p>':btn('union-form',id,'Recognize united crowns (300 gold)'));}).join(''):'<p class="smallnote">No foreign crown claim or sovereign spouse.</p>')+'</details>';
}
