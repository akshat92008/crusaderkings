// Landless continuation: an existing sovereign can seek sanctuary, serve a
// patron and negotiate the restoration of a former holding. No new character,
// faction, army or treasury is created by this system.
import {controller,transferProvince} from './campaign-war.js';
import {isImprisoned} from './feudal-systems.js';
const cap=(n,a,b)=>Math.max(a,Math.min(b,n)),no=msg=>({ok:false,msg}),ok=msg=>({ok:true,msg});
const ruler=(g,realm)=>g.politics?.people?.[g.politics?.realms?.[realm]?.ruler];
const free=(g,p)=>p?.alive&&p.age>=18&&!isImprisoned(g,p.id);
const own=(g,realm)=>Object.values(g.provinces).filter(p=>p.owner===realm);
const controlled=(g,realm)=>own(g,realm).filter(p=>controller(g,p.id)===realm);
const relation=(g,host,realm)=>g.factions[host]?.relations?.[realm]??0;
const war=(g,a,b)=>Object.values(g.conflict?.wars||{}).some(w=>w.status==='active'&&((w.attacker===a&&w.defender===b)||(w.attacker===b&&w.defender===a)));
function newRecord(g,world,realm,land=own(g,realm)){
 const historical=world.provinces.filter(p=>p.owner===realm).map(p=>p.id),dynamic=g.independence?.states?.[realm]?.members||[];
 return {lastDomain:land.length?land.map(p=>p.id):[...new Set([...historical,...dynamic])],host:null,support:0,lastService:-120,lastMove:-120,ruler:ruler(g,realm)?.id??null,exiledAt:land.length?null:g.turn};
}
export function initLandless(g,world){
 if(g.landless?.version===1)return g.landless;
 const s=g.landless={version:1,lastTick:-1,realms:{},history:[]};
 for(const realm of Object.keys(g.politics?.realms||{}))s.realms[realm]=newRecord(g,world,realm);
 return s;
}
function note(g,realm,text){const s=g.landless;s.history.unshift({realm,turn:g.turn,text});s.history=s.history.slice(0,120);if(realm===g.player){g.log.unshift({date:g.year+' · month '+(g.month+1),text});g.log=g.log.slice(0,45);}}
function hostEligible(g,realm,host){return host!==realm&&!!g.politics?.realms?.[host]&&controlled(g,host).length>0&&free(g,ruler(g,host))&&!war(g,realm,host)&&relation(g,host,realm)>=0;}
function restorationTargets(g,realm,x){
 if(!x?.host||!hostEligible(g,realm,x.host)||controlled(g,x.host).length<2)return [];
 return x.lastDomain.filter(id=>g.provinces[id]?.owner===x.host&&controller(g,id)===x.host);
}
export function landlessView(g,world,realm=g.player){
 if(!g.politics?.realms?.[realm]||own(g,realm).length)return null;
 const x=g.landless?.realms?.[realm]||newRecord(g,world,realm),p=ruler(g,realm),activeHost=hostEligible(g,realm,x.host)?x.host:null;
 const hosts=Object.keys(g.politics.realms).filter(id=>hostEligible(g,realm,id)).map(id=>({id,name:g.factions[id].name,opinion:relation(g,id,realm),formerHoldings:x.lastDomain.filter(t=>g.provinces[t]?.owner===id&&controller(g,t)===id).length})).sort((a,b)=>b.formerHoldings-a.formerHoldings||b.opinion-a.opinion||a.id.localeCompare(b.id));
 return {ruler:p?.id,name:p?.name,wealth:p?.wealth??0,eligible:!!free(g,p),host:activeHost,support:x.ruler===p?.id?x.support:Math.floor(x.support/2),hosts,targets:restorationTargets(g,realm,x),serviceWait:Math.max(0,x.lastService+3-g.turn),moveWait:Math.max(0,x.lastMove+6-g.turn),canServe:!!activeHost&&free(g,p)&&g.turn-x.lastService>=3&&g.factions[activeHost].treasury>=40};
}
function resetHost(x){x.host=null;x.support=0;}
function reconcile(g,world,realm,land=own(g,realm)){
 const root=initLandless(g,world),x=root.realms[realm]??=newRecord(g,world,realm,land),p=ruler(g,realm);
 if(land.length){x.lastDomain=land.map(p=>p.id).sort();resetHost(x);x.exiledAt=null;x.ruler=p?.id??null;return x;}
 x.exiledAt??=g.turn;
 if(x.ruler!==p?.id){x.ruler=p?.id??null;x.support=Math.floor(x.support/2);}
 if(x.host&&!hostEligible(g,realm,x.host))resetHost(x);
 return x;
}
function act(g,world,realm,action,id){
 if(!g.politics?.realms?.[realm]||own(g,realm).length)return no('Only a landless sovereign can use these actions.');
 const p=ruler(g,realm);if(!free(g,p))return no('A free adult ruler is required.');
 const x=reconcile(g,world,realm);
 if(action==='asylum'){
  if(!hostEligible(g,realm,id)||x.host===id||g.turn-x.lastMove<6)return no('Requires a peaceful landed court with non-negative opinion; move once per six months.');
  x.host=id;x.support=0;x.lastMove=g.turn;note(g,realm,p.name+' received sanctuary at '+g.factions[id].name+'.');return ok('Sanctuary granted.');
 }
 if(!x.host)return no('Seek sanctuary at a foreign court first.');
 const host=g.factions[x.host],f=g.factions[realm];
 if(action==='service'){
  if(g.turn-x.lastService<3||host.treasury<40)return no('Service requires 40 gold in the host treasury and a three-month interval.');
  const skill=Math.max(p.skills?.diplomacy||1,p.skills?.martial||1,p.skills?.learning||1);
  host.treasury-=40;p.wealth=(p.wealth||0)+40;host.prestige+=1;x.support=cap(x.support+10+skill,0,100);x.lastService=g.turn;
  host.relations??={};host.relations[realm]=cap(relation(g,x.host,realm)+5,-100,100);
  note(g,realm,p.name+' completed court service, earning 40 personal gold and patron support.');return ok('Court service completed.');
 }
 if(action==='restore'){
  if(!restorationTargets(g,realm,x).includes(id)||x.support<60||relation(g,x.host,realm)<20||p.wealth<120)return no('Requires a former holding controlled by the patron, 60 support, +20 opinion, 120 personal gold and another holding for the patron.');
  const patron=x.host;
  if(!transferProvince(g,id,realm))return no('The former holding can no longer be restored.');
  p.wealth-=120;host.treasury+=120;host.relations[realm]=cap(relation(g,patron,realm)-10,-100,100);
  f.legitimacy=Math.max(f.legitimacy,45);x.lastDomain=[id];x.exiledAt=null;resetHost(x);
  note(g,realm,p.name+' negotiated restoration of '+id+' from '+host.name+'.');return ok('Your former holding has been restored.');
 }
 return no('Unknown landless action.');
}
export function landlessAction(g,world,action,id){return act(g,world,g.player,action,id);}
export function tickLandless(g,world){
 const root=initLandless(g,world);if(root.lastTick===g.turn)return;root.lastTick=g.turn;
 const holdings=new Map();for(const p of Object.values(g.provinces)){if(!holdings.has(p.owner))holdings.set(p.owner,[]);holdings.get(p.owner).push(p);}
 for(const realm of Object.keys(g.politics.realms).sort()){
  const land=holdings.get(realm)||[],x=reconcile(g,world,realm,land),p=ruler(g,realm);
  if(land.length||realm===g.player||!free(g,p)||g.turn%3!==0)continue;
  if(!x.host){const view=landlessView(g,world,realm);if(view.hosts.length)act(g,world,realm,'asylum',view.hosts[0].id);continue;}
  const targets=restorationTargets(g,realm,x);
  if(targets.length&&x.support>=60&&relation(g,x.host,realm)>=20&&p.wealth>=120){act(g,world,realm,'restore',targets[0]);continue;}
  act(g,world,realm,'service');
 }
}
export function renderLandless(g,world,esc){
 const v=landlessView(g,world);if(!v)return '';
 const btn=(action,id,label)=>'<button class="rowbtn" data-action="landless" data-type="'+action+'" data-id="'+esc(id)+'">'+esc(label)+'</button>';
 const name=id=>world.provinces.find(p=>p.id===id)?.name||id;
 let html='<div class="rule"><h3>COURT IN EXILE</h3><p class="paragraph">You hold no land. Seek a foreign patron and rebuild your claim to a former holding.</p><p>Personal gold: '+Math.floor(v.wealth)+' · Patron support: '+v.support+'/100</p>';
 if(!v.eligible)return html+'<p class="smallnote">The ruler must be a free adult to act.</p></div>';
 if(v.host){html+='<p>Patron: '+esc(g.factions[v.host].name)+'</p>'+(v.canServe?btn('service','','Perform court service (+40 personal gold)'):'<p class="smallnote">Service unavailable: '+v.serviceWait+' months remaining or insufficient patron funds.</p>');
 html+=v.targets.length?v.targets.map(id=>btn('restore',id,'Petition to restore '+name(id)+' (60 support, +20 opinion, 120 personal gold)')).join(''):'<p class="smallnote">This patron has no eligible former holding to restore.</p>';}
 if(v.moveWait===0)html+='<details '+(!v.host?'open':'')+'><summary>Seek sanctuary</summary>'+(v.hosts.filter(x=>x.id!==v.host).map(x=>btn('asylum',x.id,x.name+' · opinion '+x.opinion+' · '+x.formerHoldings+' former holdings')).join('')||'<p>No willing landed courts.</p>')+'</details>';
 return html+'</div>';
}
