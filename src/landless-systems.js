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
// Paid commissions operate on the patron's real campaign records.
const CONTRACTS={
 administration:{name:'Estate survey',skill:'stewardship',months:3,wage:65,support:18},
 drill:{name:'Army drill',skill:'martial',months:3,wage:70,support:20},
 embassy:{name:'Diplomatic embassy',skill:'diplomacy',months:4,wage:80,support:22}
};
function contractTargets(g,realm,host,kind){
 if(!hostEligible(g,realm,host))return [];
 if(kind==='administration')return controlled(g,host).filter(p=>p.unrest>=5).sort((a,b)=>b.unrest-a.unrest||a.id.localeCompare(b.id)).map(p=>p.id);
 if(kind==='drill')return Object.values(g.armies).filter(a=>a.owner===host&&!a.contingent&&!g.naval?.voyages?.[a.id]&&controller(g,a.province)===host&&(a.infantry+a.archers+a.cavalry)>0&&((a.experience||0)<.95||(a.morale||0)<90)).sort((a,b)=>(a.experience||0)-(b.experience||0)||a.id.localeCompare(b.id)).map(a=>a.id);
 if(kind==='embassy')return Object.keys(g.politics.realms).filter(r=>r!==host&&r!==realm&&controlled(g,r).length&&!war(g,host,r)&&relation(g,host,r)<65).sort((a,b)=>relation(g,host,a)-relation(g,host,b)||a.localeCompare(b));
 return [];
}
function contractOptions(g,realm,x,p){
 if(!x?.host||!free(g,p)||x.contract||g.turn-x.lastService<3)return [];
 const host=g.factions[x.host];
 return Object.entries(CONTRACTS).filter(([,c])=>(p.skills?.[c.skill]||0)>=2&&host.treasury>=c.wage).flatMap(([kind,c])=>contractTargets(g,realm,x.host,kind).slice(0,5).map(target=>({kind,target,...c})));
}
function closeContract(g,realm,x,status,reason=''){
 const c=x.contract;if(!c)return;
 x.lastContract={...c,status,ended:g.turn,reason};delete x.contract;
 if(status!=='completed')note(g,realm,'Patron commission ended: '+reason+'.');
}
function completeContract(g,realm,x,p){
 const c=x.contract;if(!c||c.due>g.turn)return;
 const rule=CONTRACTS[c.kind],host=g.factions[c.host];
 if(!rule||x.host!==c.host||c.person!==p?.id||!free(g,p)||!hostEligible(g,realm,c.host)||host.treasury<rule.wage||!contractTargets(g,realm,c.host,c.kind).includes(c.target)){closeContract(g,realm,x,'cancelled','patron, funds or target no longer eligible');return;}
 if(c.kind==='administration'){const q=g.provinces[c.target];q.unrest=cap(q.unrest-12,0,100);}
 if(c.kind==='drill'){const a=g.armies[c.target];a.experience=cap((a.experience||0)+.05,0,1);a.morale=cap((a.morale||75)+6,0,100);}
 if(c.kind==='embassy'){const other=g.factions[c.target];host.relations??={};other.relations??={};host.relations[c.target]=cap(relation(g,c.host,c.target)+12,-100,100);other.relations[c.host]=cap(relation(g,c.target,c.host)+6,-100,100);}
 host.treasury-=rule.wage;p.wealth=(p.wealth||0)+rule.wage;host.prestige+=2;x.support=cap(x.support+rule.support,0,100);x.lastService=g.turn;
 host.relations??={};host.relations[realm]=cap(relation(g,c.host,realm)+7,-100,100);
 closeContract(g,realm,x,'completed');note(g,realm,p.name+' completed '+rule.name+' for '+rule.wage+' personal gold.');
}
export function landlessView(g,world,realm=g.player){
 if(!g.politics?.realms?.[realm]||own(g,realm).length)return null;
 const x=g.landless?.realms?.[realm]||newRecord(g,world,realm),p=ruler(g,realm),activeHost=hostEligible(g,realm,x.host)?x.host:null;
 const hosts=Object.keys(g.politics.realms).filter(id=>hostEligible(g,realm,id)).map(id=>({id,name:g.factions[id].name,opinion:relation(g,id,realm),formerHoldings:x.lastDomain.filter(t=>g.provinces[t]?.owner===id&&controller(g,t)===id).length})).sort((a,b)=>b.formerHoldings-a.formerHoldings||b.opinion-a.opinion||a.id.localeCompare(b.id));
 return {ruler:p?.id,name:p?.name,wealth:p?.wealth??0,eligible:!!free(g,p),host:activeHost,support:x.ruler===p?.id?x.support:Math.floor(x.support/2),hosts,targets:restorationTargets(g,realm,x),serviceWait:Math.max(0,x.lastService+3-g.turn),moveWait:Math.max(0,x.lastMove+6-g.turn),contract:x.contract||null,lastContract:x.lastContract||null,contracts:contractOptions(g,realm,{...x,host:activeHost},p),canServe:!!activeHost&&free(g,p)&&!x.contract&&g.turn-x.lastService>=3&&g.factions[activeHost].treasury>=40};
}
function resetHost(x){x.host=null;x.support=0;}
function reconcile(g,world,realm,land=own(g,realm)){
 const root=initLandless(g,world),x=root.realms[realm]??=newRecord(g,world,realm,land),p=ruler(g,realm);
 if(land.length){if(x.contract)closeContract(g,realm,x,'cancelled','sovereign restored to land');x.lastDomain=land.map(p=>p.id).sort();resetHost(x);x.exiledAt=null;x.ruler=p?.id??null;return x;}
 x.exiledAt??=g.turn;
 if(x.ruler!==p?.id){if(x.contract)closeContract(g,realm,x,'cancelled','succession');x.ruler=p?.id??null;x.support=Math.floor(x.support/2);}
 if(x.host&&!hostEligible(g,realm,x.host)){if(x.contract)closeContract(g,realm,x,'cancelled','sanctuary lost');resetHost(x);}
 return x;
}
function act(g,world,realm,action,id){
 if(!g.politics?.realms?.[realm]||own(g,realm).length)return no('Only a landless sovereign can use these actions.');
 const p=ruler(g,realm);if(!free(g,p))return no('A free adult ruler is required.');
 const x=reconcile(g,world,realm);
 if(action==='asylum'){
  if(x.contract||!hostEligible(g,realm,id)||x.host===id||g.turn-x.lastMove<6)return no('Requires a peaceful landed court with non-negative opinion; move once per six months.');
  x.host=id;x.support=0;x.lastMove=g.turn;note(g,realm,p.name+' received sanctuary at '+g.factions[id].name+'.');return ok('Sanctuary granted.');
 }
 if(!x.host)return no('Seek sanctuary at a foreign court first.');
 const host=g.factions[x.host],f=g.factions[realm];
 if(action==='contract'){
  const [kind,target]=String(id||'').split('|'),option=contractOptions(g,realm,x,p).find(q=>q.kind===kind&&q.target===target);
  if(!option)return no('Select an available commission; requires eligible patron, skill and funds.');
  x.contract={kind,target,host:x.host,person:p.id,started:g.turn,due:g.turn+option.months};x.lastService=g.turn;note(g,realm,p.name+' accepted '+option.name+'.');return ok('Commission underway.');
 }
 if(action==='cancel-contract'){if(!x.contract)return no('No commission underway.');closeContract(g,realm,x,'cancelled','voluntary cancellation');return ok('Commission cancelled; no wage paid.');}
 if(action==='service'){
  if(x.contract||g.turn-x.lastService<3||host.treasury<40)return no('Service requires 40 gold in the host treasury and a three-month interval.');
  const skill=Math.max(p.skills?.diplomacy||1,p.skills?.martial||1,p.skills?.learning||1);
  host.treasury-=40;p.wealth=(p.wealth||0)+40;host.prestige+=1;x.support=cap(x.support+10+skill,0,100);x.lastService=g.turn;
  host.relations??={};host.relations[realm]=cap(relation(g,x.host,realm)+5,-100,100);
  note(g,realm,p.name+' completed court service, earning 40 personal gold and patron support.');return ok('Court service completed.');
 }
 if(action==='restore'){
  if(x.contract||!restorationTargets(g,realm,x).includes(id)||x.support<60||relation(g,x.host,realm)<20||p.wealth<120)return no('Requires a former holding controlled by the patron, 60 support, +20 opinion, 120 personal gold and another holding for the patron.');
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
  if(x.contract)completeContract(g,realm,x,p);
  if(land.length||realm===g.player||!free(g,p)||x.contract||g.turn%3!==0)continue;
  if(!x.host){const view=landlessView(g,world,realm);if(view.hosts.length)act(g,world,realm,'asylum',view.hosts[0].id);continue;}
  const targets=restorationTargets(g,realm,x);
  if(targets.length&&x.support>=60&&relation(g,x.host,realm)>=20&&p.wealth>=120){act(g,world,realm,'restore',targets[0]);continue;}
  if(!targets.length){const choice=contractOptions(g,realm,x,p).sort((a,b)=>b.support-a.support||a.target.localeCompare(b.target))[0];if(choice){act(g,world,realm,'contract',choice.kind+'|'+choice.target);continue;}}
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
 if(v.contract)html+='<p class="smallnote">Commission: '+esc(CONTRACTS[v.contract.kind]?.name||v.contract.kind)+' · '+Math.max(0,v.contract.due-g.turn)+' months remaining</p>'+btn('cancel-contract','','Cancel commission');
 else if(v.contracts.length)html+='<details><summary>Paid patron commissions</summary>'+v.contracts.map(c=>btn('contract',c.kind+'|'+c.target,c.name+' · '+(g.armies[c.target]?'Army '+c.target:g.factions[c.target]?.name||name(c.target))+' · '+c.months+' months · '+c.wage+' gold')).join('')+'</details>';
 html+=v.targets.length?v.targets.map(id=>btn('restore',id,'Petition to restore '+name(id)+' (60 support, +20 opinion, 120 personal gold)')).join(''):'<p class="smallnote">This patron has no eligible former holding to restore.</p>';}
 if(v.moveWait===0)html+='<details '+(!v.host?'open':'')+'><summary>Seek sanctuary</summary>'+(v.hosts.filter(x=>x.id!==v.host).map(x=>btn('asylum',x.id,x.name+' · opinion '+x.opinion+' · '+x.formerHoldings+' former holdings')).join('')||'<p>No willing landed courts.</p>')+'</details>';
 return html+'</div>';
}
