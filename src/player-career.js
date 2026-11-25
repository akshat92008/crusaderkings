// Player perspective is distinct from legal realm ownership. Supports playable barons, counts, dukes, kings, and emperors.
import {controller} from './campaign-war.js';
import {syncTitles,isImprisoned,characterTitles,characterRank,transferVassal,createTitle} from './feudal-systems.js';
import {requestVassalPetition} from './vassal-courts.js';
import {characterInfluence,characterInteractionAs} from './character-agency.js';
import {estateRetinue,estateRetinueAction,estateClaimTargets,openEstateClaim,estateDisputes} from './estate-conflicts.js';

const no=msg=>({ok:false,msg}),ok=msg=>({ok:true,msg}),cap=(x,a,b)=>Math.max(a,Math.min(b,x));
const person=(g,id)=>g.politics?.people?.[id];
const free=(g,p)=>p?.alive&&p.age>=18&&!isImprisoned(g,p.id);
const crown=(g,r)=>g.politics.realms[r]?.ruler;

export const vassalCareer=g=>g?.playerCareer?.mode==='vassal'?g.playerCareer:null;
export const humanControlsRealm=(g,r)=>r===g.player&&!vassalCareer(g);
export const humanControlsCharacter=(g,id)=>vassalCareer(g)?vassalCareer(g).person===id:g.politics?.realms?.[g.player]?.ruler===id;

function estates(g,r,id,controlled=true){
 return Object.entries(g.politics.holdings).filter(([key,h])=>h.realm===r&&h.lord===id&&g.provinces[key]?.owner===r&&(!controlled||controller(g,key)===r));
}
function baronies(g,r,id,controlled=true){
 return Object.values(g.feudal?.baronies||{}).filter(b=>b.realm===r&&b.holder===id&&g.provinces[b.province]?.owner===r&&(!controlled||controller(g,b.province)===r));
}
function landedCount(g,r,id){
 return estates(g,r,id,false).length+baronies(g,r,id,false).length+characterTitles(g,id).filter(t=>t.realm===r&&['duchy','kingdom','empire'].includes(t.feudalTier)).length;
}
function note(g,msg){g.log.unshift({date:g.year+' · month '+(g.month+1),text:msg});g.log=g.log.slice(0,45);}

export function careerCandidates(g){
 if(vassalCareer(g)||g.playerCareer?.mode==='ended')return [];
 return Object.values(g.politics.people)
  .filter(p=>free(g,p)&&p.realm===g.player&&p.id!==crown(g,g.player)&&landedCount(g,g.player,p.id)>0)
  .sort((a,b)=>characterRank(g,b.id).rank-characterRank(g,a.id).rank||a.name.localeCompare(b.name)||a.id.localeCompare(b.id));
}

export function startVassalCareer(g,id){
 const p=careerCandidates(g).find(p=>p.id===id);
 if(!p)return no('Choose a free adult landed subject in your realm.');
 const rk=characterRank(g,id);
 g.playerCareer={version:2,mode:'vassal',person:id,realm:p.realm,house:p.house,rank:rk.tier,started:g.turn,lastInvestment:{},lastWithdrawal:{},lastTraining:-120};
 note(g,'You now play '+p.name+' ('+rk.label+') as a vassal of '+g.factions[p.realm].name+'. Crown decisions are autonomous.');
 return ok('Vassal career begun.');
}

// Follow a surviving dynast, not an unrelated replacement estate holder.
export function reconcileCareer(g){
 const x=vassalCareer(g);
 if(!x)return null;
 x.version??=2;
 let p=person(g,x.person);
 if(!p?.alive){
  const candidates=Object.values(g.politics.people).filter(q=>q.alive&&q.house===x.house&&q.realm===x.realm);
  const heir=candidates.sort((a,b)=>Number(landedCount(g,x.realm,b.id)>0)-Number(landedCount(g,x.realm,a.id)>0)||characterRank(g,b.id).rank-characterRank(g,a.id).rank||b.age-a.age||a.id.localeCompare(b.id))[0];
  if(!heir){x.status='extinct';return x;}
  x.person=heir.id;x.lastTraining=-120;p=heir;note(g,'Your career continues as '+p.name+'.');
 }
 const rk=characterRank(g,p.id);
 x.rank=rk.tier;
 if(p.id===crown(g,p.realm)&&p.realm===x.realm){
  x.mode='sovereign';x.status='promoted';
  note(g,p.name+' inherited the crown. Sovereign controls are restored.');
  return null;
 }
 x.status=landedCount(g,x.realm,p.id)>0?'landed':'landless';
 return x;
}

const INVESTMENTS={farm:{cost:100,label:'Farm'},market:{cost:140,label:'Market'},barracks:{cost:160,label:'Barracks'}};

export function careerView(g){
 const x=vassalCareer(g);
 if(!x)return null;
 const p=person(g,x.person);
 const rows=estates(g,x.realm,x.person,false).map(([id,h])=>({id,h,province:g.provinces[id],controlled:controller(g,id)===x.realm}));
 const baronRows=baronies(g,x.realm,x.person,false);
 const titles=characterTitles(g,x.person);
 const rank=characterRank(g,x.person);
 return {
  career:x,person:p,rows,baronies:baronRows,titles,rank,
  free:free(g,p)&&p.realm===x.realm,
  liege:person(g,crown(g,x.realm)),
  petition:Object.values(g.vassalCourts?.petitions||{}).filter(q=>q.person===x.person).sort((a,b)=>b.started-a.started)[0]
 };
}

export function careerAction(g,action,id,extra,world=null){
 if(action==='start')return startVassalCareer(g,id);
 const x=reconcileCareer(g);
 if(!x)return no('No active vassal career.');
 const p=person(g,x.person);
 if(!free(g,p)||p.realm!==x.realm)return no('Your character must be a free adult in this realm.');
 const h=g.politics.holdings[id],pr=g.provinces[id],owned=h&&h.lord===p.id&&h.realm===x.realm&&pr?.owner===x.realm&&controller(g,id)===x.realm;
 if(action==='personal-gift'||action==='personal-rebuke')return characterInteractionAs(g,x.realm,p.id,id,action);
 if(action==='retinue')return estateRetinueAction(g,x.realm,p.id,id,extra);
 if(action==='estate-claim'){
  if(!owned||!estateClaimTargets(g,world,x.realm,p.id,id).includes(extra))return no('Select a controlled estate and an eligible neighboring vassal holding.');
  return openEstateClaim(g,world,x.realm,id,extra,true);
 }
 if(action==='invest'){
  const rule=INVESTMENTS[extra];
  if(!owned||!rule||pr.buildings[extra]>=3||h.wealth<rule.cost||g.turn-(x.lastInvestment[id]??-120)<6)return no('Requires your controlled estate, available building level, estate funds and six months between investments.');
  h.wealth-=rule.cost;pr.buildings[extra]++;pr.development=cap(pr.development+1,1,20);pr.unrest=cap(pr.unrest-3,0,100);x.lastInvestment[id]=g.turn;
  return ok(rule.label+' improved with estate funds.');
 }
 if(action==='withdraw'){
  if(!owned||h.wealth<60||g.turn-(x.lastWithdrawal[id]??-120)<12)return no('Requires 60 estate gold and a yearly interval.');
  h.wealth-=40;p.wealth+=40;x.lastWithdrawal[id]=g.turn;
  return ok('40 estate gold transferred to your personal purse.');
 }
 if(action==='withdraw-barony'){
  const b=g.feudal?.baronies?.[id];
  if(!b||b.holder!==p.id||b.realm!==x.realm||controller(g,b.province)!==x.realm||b.wealth<30||g.turn-(x.lastWithdrawal[id]??-120)<12)return no('Requires your controlled barony with 30 barony gold and a yearly interval.');
  b.wealth-=25;p.wealth+=25;x.lastWithdrawal[id]=g.turn;
  return ok('25 barony gold transferred to your personal purse.');
 }
 if(action==='transfer-vassal'){
  return transferVassal(g,world,x.realm,id,extra);
 }
 if(action==='create-title'){
  return createTitle(g,world,x.realm,id,{holder:p.id});
 }
 if(action==='train'){
  if(!Object.hasOwn(p.skills,id)||p.skills[id]>=5||p.wealth<75||g.turn-x.lastTraining<12)return no('Training requires 75 personal gold, skill below five and a yearly interval.');
  p.wealth-=75;p.skills[id]++;x.lastTraining=g.turn;
  return ok('Personal skill improved.');
 }
 if(action==='petition')return requestVassalPetition(g,x.realm,p.id,id,extra);
 if(action==='recover'){
  const ruler=person(g,crown(g,x.realm)),f=g.factions[x.realm];
  if(estates(g,x.realm,p.id,false).length||!free(g,ruler)||!h||h.realm!==x.realm||h.lord!==ruler.id||pr?.owner!==x.realm||controller(g,id)!==x.realm||p.wealth<200||characterInfluence(g,p.id)<20)return no('Requires a landless adult, 200 personal gold, 20 influence and a controlled crown-held estate.');
  p.wealth-=200;f.treasury+=200;h.lord=p.id;h.loyalty=75;h.tax=1;h.levy=1;h.autonomy=1;syncTitles(g);x.status='landed';
  return ok('The crown granted the estate in exchange for a paid charter.');
 }
 return no('Unknown vassal action.');
}

export function renderCareerEntry(g,esc){
 const choices=careerCandidates(g);
 if(!choices.length)return '';
 return '<details class="rule"><summary>Play as a landed vassal</summary><p class="paragraph">Begin a character career instead of ruling the crown. Play as a baron, count, or duke; your own titles, estates, wealth and skills become the playable resources. The choice is permanent unless your dynasty inherits the crown.</p><select id="career-person" class="select">'+choices.map(p=>'<option value="'+esc(p.id)+'">'+esc(p.name)+' · '+esc(characterRank(g,p.id).label)+' · '+estates(g,p.realm,p.id).length+' estates</option>').join('')+'</select><button class="rowbtn" data-action="career" data-type="start" data-input="career-person">Begin vassal career</button></details>';
}

export function renderCareer(g,world,esc){
 const v=careerView(g);
 if(!v)return '';
 const {career:x,person:p,rows,baronies:baronRows,rank}=v;
 const btn=(type,id,extra,label)=>'<button class="rowbtn" data-action="career" data-type="'+type+'" data-id="'+esc(id)+'" data-extra="'+esc(extra)+'">'+esc(label)+'</button>';
 const name=id=>world.provinces.find(q=>q.id===id)?.name||id;
 let h='<div class="rule"><h3>VASSAL CAREER · '+esc(rank.label.toUpperCase())+'</h3><p>'+esc(p?.name||'Dynasty extinct')+' · '+esc(p?.house||x.house)+'</p><p>Liege: '+esc(v.liege?.name||'None')+' · Personal gold: '+Math.floor(p?.wealth||0)+'</p><p class="smallnote">The crown controls realm-wide policy, armies and diplomacy. You control your own titles, estates, baronies, private retinues, personal relationships and estate claims.</p></div>';
 if(!v.free)return h+'<p class="paragraph">Your character is not a free adult. Advance time for succession or release.</p>';
 for(const row of rows){
  const {id,h:estate,province:pr}=row;
  h+='<div class="rule"><h3>'+esc(name(id))+'</h3><p>Estate gold: '+Math.floor(estate.wealth)+' · Loyalty: '+Math.round(estate.loyalty)+'% · Development: '+pr.development+'</p>';
  if(row.controlled){
   const ret=estateRetinue(g,x.realm,p.id,id);
   if(ret){
    h+='<p class="smallnote">Private retainers: '+ret.troops+' / '+ret.capacity+' · paid from estate funds; used in internal feuds.</p>';
    if(ret.available>0)h+=btn('retinue',id,'recruit','Recruit '+ret.available+' retainers ('+ret.available*4+' estate gold)');
    if(ret.troops)h+=btn('retinue',id,'disband','Disband retainers');
   }
   const claims=estateClaimTargets(g,world,x.realm,p.id,id);
   if(claims.length){
    h+='<details><summary>Assert a neighboring estate claim (60 estate gold)</summary><p class="smallnote">Crown arbitration may prevent an internal feud.</p>'+claims.map(target=>btn('estate-claim',id,target,'Claim '+name(target))).join('')+'</details>';
   }
   h+=Object.entries(INVESTMENTS).filter(([k])=>pr.buildings[k]<3).map(([k,r])=>btn('invest',id,k,r.label+' upgrade ('+r.cost+' estate gold)')).join('')+btn('withdraw',id,'','Withdraw 40 estate gold')+(estate.tax>0?btn('petition',id,'tax','Petition for lower taxes'):'')+(estate.autonomy<2?btn('petition',id,'autonomy','Petition for autonomy'):'')+btn('petition',id,'council','Petition for council office');
  }else h+='<p class="smallnote">Occupied: estate actions unavailable.</p>';
  h+='</div>';
 }
 if(!rows.length&&baronRows.length){
  for(const b of baronRows){
   h+='<div class="rule"><h3>Barony: '+esc(name(b.province)+' '+b.kind)+'</h3><p>Barony gold: '+Math.floor(b.wealth)+'</p>'+btn('withdraw-barony',b.id,'','Withdraw 25 barony gold')+'</div>';
  }
 }
 if(!rows.length&&!baronRows.length){
  const seats=estates(g,x.realm,crown(g,x.realm)).slice(0,20);
  h+='<div class="rule"><h3>Landless courtier</h3><p>Rebuild your position by training or obtaining a crown-held estate (200 personal gold, 20 influence).</p>'+seats.map(([id])=>btn('recover',id,'','Request charter for '+name(id))).join('')+'</div>';
 }
 h+='<div class="rule"><h3>Personal development</h3>'+Object.entries(p.skills||{}).filter(([,n])=>n<5).map(([k])=>btn('train',k,'','Train '+k+' (75 personal gold)')).join('')+'</div>';
 for(const claim of estateDisputes(g,x.realm).filter(q=>[q.claimant,q.defender].includes(p.id)))h+='<div class="rule"><b>Estate claim: '+esc(name(claim.target))+'</b><p>'+esc(claim.status)+' · Crown arbitration / feud in '+Math.max(0,claim.deadline-g.turn)+' months.</p></div>';
 if(v.petition)h+='<p class="smallnote">Latest petition: '+esc(v.petition.kind)+' · '+esc(v.petition.status)+'</p>';
 return h;
}
