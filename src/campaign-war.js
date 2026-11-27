// Formal-war occupation, 11 Casus Belli, claim validation/invalidation, and title-level peace settlements.
import {reconcileProvincialHolding} from './dynastic-politics.js';
import {syncTitles,isImprisoned} from './feudal-systems.js';
import {clearWarBlockades} from './naval-systems.js';
import {
 nonAggression,hasHostageBar,recallWarContingents,
 triggerDefensiveCallToArms,addDiplomaticThreat,
 releaseWarHostages
} from './diplomacy-systems.js';
import {
 initSiegeForMarch,advanceProvinceSieges,assaultSiege,activeSiegeAt,
 adjustMoralAuthority,contributeToCrusade
} from './ck2-deep-systems.js';
export {initSiegeForMarch,advanceProvinceSieges,assaultSiege,activeSiegeAt};

const cap=(n,a,b)=>Math.max(a,Math.min(b,n));
const pair=(a,b)=>[a,b].sort().join('|');
const own=(g,realm)=>Object.values(g.provinces).filter(p=>p.owner===realm);
const alive=(g,id)=>g.politics?.people?.[id]?.alive?g.politics.people[id]:null;
const activeWar=(g,a,b)=>Object.values(g.conflict?.wars||{}).find(w=>w.status==='active'&&pair(w.attacker,w.defender)===pair(a,b));
const hasTruce=(g,a,b)=>(g.conflict?.truces?.[pair(a,b)]||0)>g.turn;

export const CASUS_BELLI={
 county_claim:{id:'county_claim',name:'County Claim',prestigeCost:5,warscoreGoal:65,tier:'county',desc:'Enforce a fabricated or inherited claim on a county.'},
 duchy_claim:{id:'duchy_claim',name:'Duchy Claim',prestigeCost:12,warscoreGoal:75,tier:'duchy',desc:'Claim all counties held by the target within a duchy.'},
 kingdom_claim:{id:'kingdom_claim',name:'Kingdom Claim',prestigeCost:25,warscoreGoal:85,tier:'kingdom',desc:'Press a dynastic claim to the target crown.'},
 dejure_claim:{id:'dejure_claim',name:'De Jure Claim',prestigeCost:8,warscoreGoal:65,tier:'county',desc:'Reclaim a province belonging de jure to your realm.'},
 independence:{id:'independence',name:'War of Independence',prestigeCost:10,warscoreGoal:60,tier:'realm',desc:'Throw off tribute, subjugation, or overlordship.'},
 subjugation:{id:'subjugation',name:'Subjugation',prestigeCost:15,warscoreGoal:75,tier:'realm',desc:'Compel a weaker neighboring realm into tributary subjugation.'},
 religious_war:{id:'religious_war',name:'Holy War',prestigeCost:10,warscoreGoal:70,tier:'duchy',desc:'Contest border lands held by a realm of another faith.'},
 succession_dispute:{id:'succession_dispute',name:'Succession Dispute',prestigeCost:15,warscoreGoal:80,tier:'kingdom',desc:'Intervene in a contested or weak succession.'},
 deposition:{id:'deposition',name:'Deposition War',prestigeCost:12,warscoreGoal:75,tier:'realm',desc:'Depose an illegitimate, tyrannical, or excommunicated ruler.'},
 tribute_enforcement:{id:'tribute_enforcement',name:'Tribute Enforcement',prestigeCost:6,warscoreGoal:55,tier:'realm',desc:'Enforce defaulted or demanded tribute obligations.'},
 liberation:{id:'liberation',name:'Liberation War',prestigeCost:8,warscoreGoal:65,tier:'duchy',desc:'Liberate foreign-held de jure or occupied lands.'}
};

export function realmFaith(g,realm){
 return g.civic?.realms?.[realm]?.faith||g.faith?.realms?.[realm]?.faith||null;
}

export function transferProvince(g,id,realm){
 const p=g.provinces[id];
 if(!p||!Object.hasOwn(g.factions,realm)||p.owner===realm)return false;
 p.owner=realm;
 if(realm!=='independent'&&g.independentPolities?.[id])delete g.independentPolities[id];
 if(reconcileProvincialHolding(g,id))syncTitles(g);
 return true;
}

export function initCampaignWar(g){
 return g.campaignWar??={version:1,occupations:{},history:[],lastTick:-1};
}
export function controller(g,id){return g.campaignWar?.occupations[id]?.by||g.provinces[id]?.owner;}
export function occupation(g,id){return g.campaignWar?.occupations[id]||null;}
export function occupationTax(g,id){return occupation(g,id)?0.35:1;}

export function captureProvince(g,war,realm,id,from){
 const p=g.provinces[id];if(!p)return false;
 const c=initCampaignWar(g),old=c.occupations[id];
 if(old&&old.by!==realm&&p.owner===realm){delete c.occupations[id];return true;}
 if(old&&old.by!==realm&&p.owner!==realm)return false;
 if(war?.status==='active'&&[war.attacker,war.defender].includes(p.owner)&&p.owner!==realm){
  c.occupations[id]={province:id,by:realm,owner:p.owner,war:war.id,from,started:g.turn};
  return true;
 }
 return !old&&transferProvince(g,id,realm);
}

export function occupiedGoal(g,w){
 return g.provinces[w.goal]?.owner===w.attacker||(occupation(g,w.goal)?.war===w.id&&controller(g,w.goal)===w.attacker);
}

function retreat(g,realm,id,preferred){
 const fallback=preferred&&controller(g,preferred)===realm?preferred:own(g,realm).find(p=>controller(g,p.id)===realm)?.id;
 for(const a of Object.values(g.armies)){
  if(a.owner===realm&&a.province===id){
   if(fallback)a.province=fallback;
   else delete g.armies[a.id];
  }
 }
}

function districtForProvince(g,id){
 return Object.values(g.feudal?.districts||{}).find(d=>d.members?.includes(id))||null;
}

function borderNeighbors(g,world,a,b){
 if(!world?.provinces?.length)return [];
 const out=[];
 for(const wp of world.provinces){
  if(g.provinces[wp.id]?.owner!==a)continue;
  for(const nid of wp.neighbors||[]){
   if(g.provinces[nid]?.owner===b&&!out.includes(nid))out.push(nid);
  }
 }
 return out;
}

function validClaimRecord(g,claim){
 if(!claim||claim.expires<=g.turn)return false;
 if(claim.source==='dynastic'){
  const person=alive(g,claim.claimant);
  return !!person&&person.realm===claim.realm&&g.provinces[claim.province]?.owner===claim.foreign&&(person.claims||[]).includes(claim.foreign);
 }
 return true;
}

export function installRulerOnThrone(g,realm,nextId,reason='settlement'){
 const s=g.politics?.realms?.[realm],next=alive(g,nextId);
 if(!s||!next)return false;
 const oldId=s.ruler,old=g.politics.people[oldId];
 if(oldId===nextId)return false;
 const rulesElsewhere=Object.entries(g.politics?.realms||{}).some(([r,rs])=>r!==realm&&rs?.ruler===nextId);
 if(!rulesElsewhere)next.realm=realm;
 s.ruler=nextId;
 delete s.nominee;
 if(g.feudal?.claimants){
  delete g.feudal.claimants[realm+':'+nextId];
  delete g.feudal.claimants['k:'+realm+':'+nextId];
 }
 s.regent=next.age<18?(s.council?.chancellor||null):null;
 if(old){
  for(const [role,pid] of Object.entries(s.council||{}))if(pid===nextId)s.council[role]=oldId;
  if(g.feudal?.claimants)g.feudal.claimants[realm+':'+oldId]={realm,person:oldId,from:nextId,created:g.turn};
 }
 for(const [,h] of Object.entries(g.politics.holdings||{})){
  if(h.realm===realm&&h.lord===oldId){h.lord=nextId;h.loyalty=65;}
 }
 if(g.kingdom?.courts?.[realm]){
  const c=g.kingdom.courts[realm];
  c.successions++;
  c.dynasty=next.house||c.dynasty;
  c.ruler={name:next.name,age:next.age,...(next.skills||{})};
 }
 syncTitles(g);
 if(g.feudal?.history){g.feudal.history.unshift({realm,turn:g.turn,message:`${next.name} took the throne (${reason}).`});g.feudal.history=g.feudal.history.slice(0,150);}
 return true;
}

export function findDepositionSuccessor(g,realm){
 const s=g.politics?.realms?.[realm],oldId=s?.ruler,old=g.politics?.people?.[oldId];
 const children=(old?.children||[]).map(id=>alive(g,id)).filter(p=>p&&p.realm===realm&&!isImprisoned(g,p.id));
 if(children.length)return children.sort((a,b)=>b.age-a.age||a.id.localeCompare(b.id))[0];
 const adults=Object.values(g.politics?.people||{}).filter(p=>p.alive&&p.realm===realm&&p.id!==oldId&&p.age>=18&&!isImprisoned(g,p.id));
 if(adults.length)return adults.sort((a,b)=>Number(b.house===old?.house)-Number(a.house===old?.house)||(b.skills?.diplomacy||0)-(a.skills?.diplomacy||0)||a.id.localeCompare(b.id))[0];
 return null;
}

export function availableCasusBelli(g,world,attacker,defender){
 if(!g?.factions?.[attacker]||!g?.factions?.[defender]||attacker===defender)return [];
 const defProvs=own(g,defender);
 if(!defProvs.length)return [];
 const attProvs=own(g,attacker);
 if(!attProvs.length)return [];
 const out=[];
 const borders=borderNeighbors(g,world,attacker,defender);
 const defSeat=defProvs[0].id;
 const attStr=Object.values(g.armies||{}).filter(a=>a.owner===attacker&&!a.contingent).reduce((n,a)=>n+(a.infantry||0)+(a.archers||0)+(a.cavalry||0),0);
 const defStr=Object.values(g.armies||{}).filter(a=>a.owner===defender&&!a.contingent).reduce((n,a)=>n+(a.infantry||0)+(a.archers||0)+(a.cavalry||0),0);

 // 1. county_claim
 for(const cl of Object.values(g.conflict?.claims||{})){
  if(cl.realm===attacker&&g.provinces[cl.province]?.owner===defender&&validClaimRecord(g,cl)){
   out.push({cb:'county_claim',attacker,defender,target:cl.province,goal:cl.province,titleId:'c:'+cl.province,claimant:cl.claimant||null,prestigeCost:CASUS_BELLI.county_claim.prestigeCost});
  }
 }

 // 2. duchy_claim
 const districtCounts=new Map();
 for(const cl of Object.values(g.conflict?.claims||{})){
  if(cl.realm!==attacker||!validClaimRecord(g,cl))continue;
  if(cl.tier==='duchy'&&g.feudal?.districts?.[cl.titleId]){
   const mem=g.feudal.districts[cl.titleId].members.filter(id=>g.provinces[id]?.owner===defender);
   if(mem.length)out.push({cb:'duchy_claim',attacker,defender,target:cl.titleId,goal:mem[0],titleId:cl.titleId,claimant:cl.claimant||null,prestigeCost:CASUS_BELLI.duchy_claim.prestigeCost});
  }
  const d=districtForProvince(g,cl.province);
  if(d&&g.provinces[cl.province]?.owner===defender)districtCounts.set(d.id,(districtCounts.get(d.id)||0)+1);
 }
 for(const [dId,cnt] of districtCounts){
  if(cnt>=2){
   const d=g.feudal.districts[dId],mem=d.members.filter(id=>g.provinces[id]?.owner===defender);
   if(mem.length&&!out.some(x=>x.cb==='duchy_claim'&&x.titleId===dId)){
    out.push({cb:'duchy_claim',attacker,defender,target:dId,goal:mem[0],titleId:dId,prestigeCost:CASUS_BELLI.duchy_claim.prestigeCost});
   }
  }
 }

 // 3. kingdom_claim
 const courtClaimants=Object.values(g.politics?.people||{}).filter(p=>p.alive&&p.realm===attacker&&p.age>=18&&!isImprisoned(g,p.id)&&(p.claims||[]).includes(defender));
 const feudalClaimants=Object.values(g.feudal?.claimants||{}).filter(c=>c.realm===defender&&alive(g,c.person)?.realm===attacker&&!isImprisoned(g,c.person));
 const kClaimant=courtClaimants[0]?.id||feudalClaimants[0]?.person||null;
 if(kClaimant||Object.values(g.conflict?.claims||{}).some(cl=>cl.realm===attacker&&cl.tier==='kingdom'&&cl.foreign===defender&&validClaimRecord(g,cl))){
  out.push({cb:'kingdom_claim',attacker,defender,target:'k:'+defender,goal:borders[0]||defSeat,titleId:'k:'+defender,claimant:kClaimant,prestigeCost:CASUS_BELLI.kingdom_claim.prestigeCost});
 }

 // 4. dejure_claim
 for(const p of defProvs){
  const ct=g.feudal?.titles?.['c:'+p.id],d=districtForProvince(g,p.id);
  const dj=ct?.deJureRealm||d?.deJureRealm;
  if(dj===attacker){
   out.push({cb:'dejure_claim',attacker,defender,target:p.id,goal:p.id,titleId:'c:'+p.id,prestigeCost:CASUS_BELLI.dejure_claim.prestigeCost});
  }
 }

 // 5. independence
 const trib=g.diplomacy?.tributes?.[attacker];
 const union=Object.values(g.personalUnions?.unions||{}).find(u=>u.junior===attacker&&u.senior===defender);
 if((trib?.suzerain===defender&&trib?.until>g.turn)||union){
  out.push({cb:'independence',attacker,defender,target:'k:'+attacker,goal:borders[0]||defSeat,titleId:'k:'+attacker,prestigeCost:CASUS_BELLI.independence.prestigeCost});
 }

 // 6. subjugation
 if((borders.length||defender==='independent')&&!g.diplomacy?.tributes?.[defender]&&(defProvs.length<=4||attStr>=defStr*1.25)){
  out.push({cb:'subjugation',attacker,defender,target:'k:'+defender,goal:borders[0]||defSeat,titleId:'k:'+defender,prestigeCost:CASUS_BELLI.subjugation.prestigeCost});
 }

 // 7. religious_war
 const attFaith=realmFaith(g,attacker),defFaith=realmFaith(g,defender);
 if(borders.length&&attFaith&&defFaith&&attFaith!==defFaith){
  const targetProv=borders[0],d=districtForProvince(g,targetProv);
  out.push({cb:'religious_war',attacker,defender,target:targetProv,goal:targetProv,titleId:d?.id||targetProv,prestigeCost:CASUS_BELLI.religious_war.prestigeCost});
 }

 // 8. succession_dispute
 const defRealm=g.politics?.realms?.[defender],defRuler=alive(g,defRealm?.ruler),defFac=g.factions[defender];
 const disputed=Boolean(defRealm?.regent||(defRuler&&defRuler.age<16)||(defFac?.legitimacy<50)||defRealm?.successionDispute||Object.values(g.feudal?.claimants||{}).some(c=>c.realm===defender));
 if(disputed&&(borders.length||kClaimant)){
  out.push({cb:'succession_dispute',attacker,defender,target:'k:'+defender,goal:borders[0]||defSeat,titleId:'k:'+defender,claimant:kClaimant,prestigeCost:CASUS_BELLI.succession_dispute.prestigeCost});
 }

 // 9. deposition
 const excomm=defRuler&&g.faith?.excommunicated?.[defRuler.id];
 const rel=(g.factions[attacker]?.relations?.[defender])||0;
 if(defRuler&&((defFac?.legitimacy<40)||(defFac?.stability<35)||excomm||rel<=-55)){
  out.push({cb:'deposition',attacker,defender,target:defRuler.id,goal:borders[0]||defSeat,titleId:'k:'+defender,targetRuler:defRuler.id,prestigeCost:CASUS_BELLI.deposition.prestigeCost});
 }

 // 10. tribute_enforcement
 const ownTrib=g.diplomacy?.tributes?.[defender];
 if((ownTrib?.suzerain===attacker&&ownTrib?.defaulted)||(borders.length&&!ownTrib&&attStr>=Math.max(80,defStr*1.3))){
  out.push({cb:'tribute_enforcement',attacker,defender,target:defender,goal:borders[0]||defSeat,titleId:'k:'+defender,prestigeCost:CASUS_BELLI.tribute_enforcement.prestigeCost});
 }

 // 11. liberation
 for(const p of defProvs){
  const ct=g.feudal?.titles?.['c:'+p.id],d=districtForProvince(g,p.id);
  const dj=ct?.deJureRealm||d?.deJureRealm;
  if(dj&&dj!==defender&&(borders.includes(p.id)||dj===attacker||g.factions[attacker]?.treaties?.[dj]==='alliance')){
   out.push({cb:'liberation',attacker,defender,target:p.id,goal:p.id,titleId:d?.id||p.id,liberateTo:dj,prestigeCost:CASUS_BELLI.liberation.prestigeCost});
   break;
  }
 }
 return out;
}

export function validateCasusBelli(g,world,spec){
 if(!spec||!spec.cb)return {valid:true,reason:''};
 const {attacker,defender,cb,goal,titleId,claimant,targetRuler}=spec;
 const def=CASUS_BELLI[cb];
 if(!def)return {valid:false,reason:'Unknown Casus Belli.'};
 if(!g.factions?.[attacker]||!g.factions?.[defender]||attacker===defender)return {valid:false,reason:'Invalid belligerents.'};
 if(!own(g,attacker).length||!own(g,defender).length)return {valid:false,reason:'Belligerent lost all provinces.'};

 if(cb==='county_claim'){
  if(g.provinces[goal]?.owner!==defender)return {valid:false,reason:'Target county is no longer held by defender.'};
  const cl=g.conflict?.claims?.[attacker+':'+goal];
  if(!cl||!validClaimRecord(g,cl))return {valid:false,reason:'County claim expired or claimant became invalid.'};
 }else if(cb==='duchy_claim'){
  const d=g.feudal?.districts?.[titleId];
  const hasProv=d?d.members.some(id=>g.provinces[id]?.owner===defender):g.provinces[goal]?.owner===defender;
  if(!hasProv)return {valid:false,reason:'Target duchy is no longer held by defender.'};
  if(claimant&&!alive(g,claimant))return {valid:false,reason:'Duchy claimant died.'};
 }else if(cb==='kingdom_claim'){
  if(claimant&&(!alive(g,claimant)||isImprisoned(g,claimant)))return {valid:false,reason:'Kingdom claimant is no longer available.'};
 }else if(cb==='dejure_claim'){
  const ct=g.feudal?.titles?.['c:'+goal],d=districtForProvince(g,goal);
  if(g.provinces[goal]?.owner!==defender||(ct?.deJureRealm||d?.deJureRealm)!==attacker)return {valid:false,reason:'De jure target no longer applies.'};
 }else if(cb==='religious_war'){
  const af=realmFaith(g,attacker),df=realmFaith(g,defender);
  if(!af||!df||af===df)return {valid:false,reason:'Belligerents now share the same faith.'};
 }else if(cb==='deposition'){
  const curRuler=g.politics?.realms?.[defender]?.ruler;
  if(targetRuler&&curRuler!==targetRuler)return {valid:false,reason:'The targeted ruler is no longer on the throne.'};
 }else if(cb==='liberation'){
  if(g.provinces[goal]?.owner!==defender)return {valid:false,reason:'Province to liberate is no longer held by defender.'};
 }
 return {valid:true,reason:''};
}

export function declareCasusBelliWar(g,world,attacker,defender,cbType,target=null){
 const no=msg=>({ok:false,msg});
 if(!g.conflict)g.conflict={next:1,seed:987123,lastTick:-1,factions:{},schemes:{},claims:{},wars:{},truces:{},favors:{},council:{},history:[]};
 const c=g.conflict,f=g.factions?.[attacker],o=g.factions?.[defender];
 if(!f||!o||attacker===defender)return no('Invalid war target.');
 if(activeWar(g,attacker,defender))return no('Already at war with this realm.');
 if(['alliance','marriage'].includes(f.treaties?.[defender])||nonAggression(g,attacker,defender)||hasTruce(g,attacker,defender))return no('Alliance, non-aggression pact, or truce bars war.');
 if(hasHostageBar(g,attacker,defender))return no('An active diplomatic hostage bars war between these courts.');
 const options=availableCasusBelli(g,world,attacker,defender);
 const match=options.find(x=>x.cb===cbType&&(!target||x.target===target||x.goal===target||x.titleId===target))||options.find(x=>x.cb===cbType);
 if(!match)return no('No valid Casus Belli of that type against '+o.name+'.');
 const check=validateCasusBelli(g,world,match);
 if(!check.valid)return no(check.reason);
 const cost=CASUS_BELLI[cbType].prestigeCost;
 if((f.prestige||0)<cost)return no(`Need ${cost} prestige for ${CASUS_BELLI[cbType].name}.`);
 f.prestige-=cost;
 const key='w'+c.next++;
 const w=c.wars[key]={
  id:key,attacker,defender,goal:match.goal,cb:cbType,titleId:match.titleId||match.goal,
  claimant:match.claimant||null,targetRuler:match.targetRuler||null,liberateTo:match.liberateTo||null,
  score:0,battles:0,started:g.turn,status:'active',allies:{attacker:[],defender:[]}
 };
 if(g.log&&(attacker===g.player||defender===g.player)){
  g.log.unshift({date:g.year+' · month '+(g.month+1),text:`${f.name} declared ${CASUS_BELLI[cbType].name} on ${o.name} (${match.goal}).`});
  g.log=g.log.slice(0,45);
 }
 triggerDefensiveCallToArms(g,world,w);
 return {ok:true,war:w,msg:`${CASUS_BELLI[cbType].name} war declared against ${o.name}.`};
}

export function warPeaceTerms(g,war,realm){
 if(war?.status!=='active'||![war.attacker,war.defender].includes(realm))return [];
 const attacking=war.attacker===realm,opponent=attacking?war.defender:war.attacker;
 const score=attacking?war.score:-war.score,hasGoal=occupiedGoal(g,war);
 const cb=CASUS_BELLI[war.cb];
 const reqScore=cb?.warscoreGoal??65;
 const amount=Math.min(300,Math.max(0,g.factions[opponent]?.treasury||0));
 const surrender=attacking?'attacker defeated':(hasGoal||['subjugation','tribute_enforcement','deposition','independence'].includes(war.cb))?'claim enforced':'white peace';
 const terms=[
  {id:'reparations',label:'Demand reparations',result:'reparations',amount,reason:score<65?'Requires at least +65 war score.':'',description:`Receive ${amount} gold and return occupied land.`},
  {id:'surrender',label:'Surrender',result:surrender,reason:'',description:'Concede war aims and return remaining occupied land.'},
  {id:'white',label:'Offer white peace',result:'white peace',reason:Math.abs(score)>35||g.turn-war.started<6?'Requires six months of war and a score between -35 and +35.':'',description:'Return occupied land and end the war.'}
 ];
 if(attacking){
  const needsOcc=['county_claim','duchy_claim','dejure_claim','religious_war','liberation'].includes(war.cb||'county_claim');
  const blocked=score<reqScore||(needsOcc&&!hasGoal);
  terms.push({
   id:'enforce',
   label:cb?`Enforce ${cb.name}`:'Enforce claim',
   result:'claim enforced',
   reason:blocked?`Requires at least +${reqScore} war score${needsOcc?' and control of the war goal':''}.`:'',
   description:cb?.desc||'Annex the disputed district and return other occupations.'
  });
 }
 return terms;
}

export function settleOccupations(g,w,result){
 const c=initCampaignWar(g),ceded=[];
 const cb=w.cb||'county_claim';
 const applySingleCede=(id,toRealm)=>{
  const p=g.provinces[id];
  if(!p||p.owner===toRealm)return;
  if(transferProvince(g,id,toRealm)){
   p.unrest=cap(p.unrest+10,0,100);
   ceded.push(id);
   retreat(g,w.defender,id);
  }
 };

 // Release/return occupied provinces first, ceding if legacy or county_claim.
 for(const [id,o] of Object.entries(c.occupations)){
  if(o.war!==w.id)continue;
  const p=g.provinces[id];
  delete c.occupations[id];
  if(!p)continue;
  if(result==='claim enforced'&&(!w.cb||cb==='county_claim'||cb==='dejure_claim')&&id===w.goal&&o.by===w.attacker&&p.owner===w.defender){
   applySingleCede(id,w.attacker);
  }else{
   retreat(g,o.by,id,o.from);
  }
 }

 // Title-level and diplomatic settlements for the 11 Casus Belli.
 if(result==='claim enforced'&&w.cb){
  if((cb==='county_claim'||cb==='dejure_claim')&&!ceded.includes(w.goal)&&g.provinces[w.goal]?.owner===w.defender){
   applySingleCede(w.goal,w.attacker);
  }else if(cb==='duchy_claim'||cb==='religious_war'){
   const d=g.feudal?.districts?.[w.titleId]||districtForProvince(g,w.goal);
   const targets=d?d.members.filter(id=>g.provinces[id]?.owner===w.defender):[w.goal];
   for(const id of targets)applySingleCede(id,w.attacker);
  }else if(cb==='kingdom_claim'||cb==='succession_dispute'){
   if(w.claimant&&alive(g,w.claimant)&&!isImprisoned(g,w.claimant)){
    installRulerOnThrone(g,w.defender,w.claimant,cb);
   }else if(g.provinces[w.goal]?.owner===w.defender){
    applySingleCede(w.goal,w.attacker);
   }
  }else if(cb==='deposition'){
   const next=findDepositionSuccessor(g,w.defender);
   if(next)installRulerOnThrone(g,w.defender,next.id,'deposition');
   if(g.factions[w.attacker])g.factions[w.attacker].prestige+=15;
   if(g.factions[w.defender]&&g.factions[w.attacker]){
    const rep=Math.min(150,Math.max(0,g.factions[w.defender].treasury));
    g.factions[w.defender].treasury-=rep;
    g.factions[w.attacker].treasury+=rep;
   }
  }else if(cb==='subjugation'||cb==='tribute_enforcement'){
   if(g.diplomacy){
    g.diplomacy.tributes??={};
    g.diplomacy.tributes[w.defender]={
     suzerain:w.attacker,tributary:w.defender,rate:0.15,minGold:15,
     started:g.turn,until:g.turn+60,subjugated:cb==='subjugation',defaulted:false
    };
   }
   if(cb==='tribute_enforcement'&&g.factions[w.defender]&&g.factions[w.attacker]){
    const rep=Math.min(250,Math.max(0,g.factions[w.defender].treasury));
    g.factions[w.defender].treasury-=rep;
    g.factions[w.attacker].treasury+=rep;
   }
  }else if(cb==='independence'){
   if(g.diplomacy?.tributes?.[w.attacker]?.suzerain===w.defender)delete g.diplomacy.tributes[w.attacker];
   const u=Object.values(g.personalUnions?.unions||{}).find(x=>x.junior===w.attacker&&x.senior===w.defender);
   if(u)delete g.personalUnions.unions[u.id];
   if(g.factions[w.attacker]){
    g.factions[w.attacker].prestige+=15;
    const rep=Math.min(100,Math.max(0,g.factions[w.defender]?.treasury||0));
    if(g.factions[w.defender])g.factions[w.defender].treasury-=rep;
    g.factions[w.attacker].treasury+=rep;
   }
  }else if(cb==='liberation'){
   const d=g.feudal?.districts?.[w.titleId];
   const list=d?d.members.filter(id=>g.provinces[id]?.owner===w.defender):[w.goal];
   for(const id of list){
    const dj=g.feudal?.titles?.['c:'+id]?.deJureRealm||d?.deJureRealm;
    const dest=(dj&&dj!==w.defender&&g.factions[dj])?dj:'independent';
    applySingleCede(id,dest);
   }
  }
  if(ceded.length)addDiplomaticThreat(g,w.attacker,ceded.length*10);
 }

 // Clear active deep province sieges tied to this war and apply religious war moral authority / crusade score shifts.
 if(g.deepSystems?.sieges){
  for(const siege of Object.values(g.deepSystems.sieges)){
   if(siege.status!=='active')continue;
   if(siege.warId===w.id||((siege.attacker===w.attacker&&siege.defender===w.defender)||(siege.attacker===w.defender&&siege.defender===w.attacker))){
    siege.status='lifted';
    siege.endedTurn=g.turn;
   }
  }
 }
 if(cb==='religious_war'||w.cb==='holy_war'){
  const attFaith=g.factions?.[w.attacker]?.religion;
  const defFaith=g.factions?.[w.defender]?.religion;
  if(result==='claim enforced'){
   if(attFaith)adjustMoralAuthority(g,attFaith,4,'Holy war victory');
   if(defFaith)adjustMoralAuthority(g,defFaith,-4,'Holy war defeat');
   contributeToCrusade(g,w.attacker,20);
  }else if(result==='attacker defeated'){
   if(attFaith)adjustMoralAuthority(g,attFaith,-3,'Holy war repulsed');
   if(defFaith)adjustMoralAuthority(g,defFaith,3,'Holy war defended');
   contributeToCrusade(g,w.defender,15);
  }
 }

 c.history.unshift({war:w.id,turn:g.turn,result,ceded});
 c.history=c.history.slice(0,100);
 return ceded;
}

export function coordinatedPeace(g,world,warId,termId,actor=g.player){
 const c=g.conflict,w=c?.wars?.[warId];
 const terms=warPeaceTerms(g,w,actor);
 if(!terms.length)return {ok:false,msg:'No such active war.'};
 const term=terms.find(t=>t.id===termId);
 if(!term||term.reason)return {ok:false,msg:term?.reason||'Unknown peace terms.'};
 if(term.id==='reparations'){
  const other=w.attacker===actor?w.defender:w.attacker;
  g.factions[other].treasury-=term.amount;
  g.factions[actor].treasury+=term.amount;
 }
 settleOccupations(g,w,term.result);
 w.status=term.result;
 w.ended=g.turn;
 recallWarContingents(g,w.id);
 clearWarBlockades(g,w);
 releaseWarHostages(g,w);
 const attSide=[w.attacker,...(w.allies?.attacker||[])];
 const defSide=[w.defender,...(w.allies?.defender||[])];
 for(const a of attSide){
  for(const b of defSide){
   c.truces[pair(a,b)]=Math.max(c.truces[pair(a,b)]||0,g.turn+36);
  }
 }
 c.history??=[];
 c.history.unshift({turn:g.turn,kind:'war',realm:w.attacker,message:`${w.attacker} vs ${w.defender} (${w.cb||'claim'}): ${term.result}`});
 c.history=c.history.slice(0,200);
 return {ok:true,result:term.result,msg:`Peace concluded (${term.result}); occupations and allied contingents resolved.`};
}

export function tickCampaignWar(g,world=null){
 const c=initCampaignWar(g);
 if(c.lastTick===g.turn)return;
 c.lastTick=g.turn;
 for(const [id,o] of Object.entries(c.occupations)){
  const p=g.provinces[id],w=g.conflict?.wars[o.war];
  if(!p||p.owner!==o.owner||w?.status!=='active'){
   delete c.occupations[id];
   if(p&&p.owner!==o.by)retreat(g,o.by,id,o.from);
   continue;
  }
  p.unrest=cap(p.unrest+1,0,100);
 }
 // Invalidate active CB wars if their legal basis vanished mid-war.
 for(const w of Object.values(g.conflict?.wars||{})){
  if(w.status!=='active'||!w.cb)continue;
  const check=validateCasusBelli(g,world,w);
  if(!check.valid){
   settleOccupations(g,w,'cb invalidated');
   w.status='cb invalidated';
   w.ended=g.turn;
   w.invalidReason=check.reason;
   recallWarContingents(g,w.id);
   clearWarBlockades(g,w);
   g.conflict.truces[pair(w.attacker,w.defender)]=Math.max(g.conflict.truces[pair(w.attacker,w.defender)]||0,g.turn+12);
  }
 }
}
