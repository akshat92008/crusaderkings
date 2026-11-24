import {titleList,claimantCandidates,isImprisoned,regionalLoyalty} from './feudal-systems.js';
import {regionalDecision,AMBITIONS,currentChain,relationshipList,personalOpinion} from './chronicle-systems.js';
import {temperament,strategicPlan,threatAssessment,borderRealms,militaryStrength,defenseSupport} from './strategic-ai.js';
import {occupation,controller} from './campaign-war.js';
import {SHIPS,fleetStats,fleetDestinations,blockadeTargets,portBlocked,embarked,navalUpkeep} from './naval-systems.js';
import {REGIMENTS,ENGINES,regimentOptions,armyReadiness} from './military-systems.js';
import {GOODS,INDUSTRIES,SETTLEMENTS,CRISES,industryCost,tradeDestinations} from './economy-systems.js';
import {ACTIVITIES,RELICS,LEGACIES,activityDestinations,activityIncident,struggleView,heritageModifiers} from './heritage-systems.js';
import {GOVERNMENTS,LIFESTYLES,civicModifiers,civicEvent} from './civic-systems.js';
import {initConflict,councilVotes,availableClaims} from './political-conflict.js';
/** Safe, copy-free royal court, trade and legacy interface views. */
import {marriageCandidates,politicalRevenue,politicalLevy,politicalDispatch} from './dynastic-politics.js';
import {currentRoyalEvent,currentCourt,tradeIncome,tradePactCount,objectives,campaignStanding} from './kingdom-depth.js';
const fmt=x=>Math.round(x).toLocaleString('en-US');
function stat(name,value){return '<label>'+name+'</label><strong>'+value+'</strong>';}
function section(name){return '<div class="sectiontitle">'+name+'</div>';}
function decision(action,name,desc,price){return '<button class="rowbtn" data-action="court-decision" data-type="'+action+'"><b>'+name+'</b> · '+price+'g <small>'+desc+'</small></button>';}
export function renderCourt(g,esc){
 const c=currentCourt(g),f=g.factions[g.player];if(!c)return '<p class="paragraph">Court records are unavailable.</p>';
 const event=currentRoyalEvent(g);
 let html='<div class="label">THE ROYAL HOUSE</div>'+
  '<div class="rule"><h3>'+esc(c.dynasty)+'</h3><div class="statlist">'+
  stat('Sovereign',esc(c.ruler.name))+stat('Ruler age',fmt(c.ruler.age))+
  stat('Designated heir',esc(c.heir.name))+stat('Heir age',fmt(c.heir.age))+
  stat('Stewardship',fmt(c.ruler.stewardship)+'/5')+stat('Martial ability',fmt(c.ruler.martial)+'/5')+
  stat('Diplomatic ability',fmt(c.ruler.diplomacy)+'/5')+stat('Successions',fmt(c.successions))+
  '</div></div>'+section('ROYAL ADVISORS')+
  '<div class="statlist">'+stat('Chief steward',fmt(c.steward)+'/5')+stat('Royal marshal',fmt(c.marshal)+'/5')+
  stat('Prestige',fmt(f.prestige))+stat('Legitimacy',fmt(f.legitimacy)+'%')+stat('Technology',fmt(f.tech)+'/10')+'</div>'+
  section('ISSUE A COURT DECISION')+
  decision('audience','Hold public audience','Restore stability and lower provincial unrest',120)+
  decision('steward','Promote chief steward','Permanently improve tax efficiency',250)+
  decision('marshal','Reform army command','Improve experience and morale of your armies',250)+
  decision('chronicle','Commission a chronicle','Gain prestige and legitimacy',180)+
  decision('succession','Secure the succession','Improve legitimacy and stability',220);
 if(event){
  html+=section('DECISION REQUIRED · ROYAL EVENT')+
   '<div class="rule"><div class="label">COURT DISPATCH</div><h3>'+esc(event.title)+'</h3>'+
   '<p class="paragraph">'+esc(event.description)+'</p>'+
   event.choices.map((ch,i)=>'<button class="rowbtn" data-action="royal-choice" data-choice="'+i+'">'+esc(ch.label)+
    '<small>'+Object.entries(ch).filter(([k])=>k!=='label').map(([k,v])=>esc(k)+' '+(v>0?'+':'')+fmt(v)).join(' · ')+'</small></button>').join('')+'</div>';
 }else html+=section('ROYAL DISPATCHES')+'<p class="paragraph">No unresolved court event. New events appear as the campaign advances.</p>';
 const threats=g.kingdom?.threats||[];
 if(threats.length)html+=section('FRONTIER WARNING')+threats.map(t=>
  '<div class="rule"><b>Enemy army gathering at '+esc(t.province)+'</b><p class="paragraph">'+fmt(t.eta)+' month(s) until invasion. Reinforce the garrison or recruit troops.</p></div>').join('');
 html+='<div class="smallnote">Ruler and heir names are fictional alternate-history content. Succession, decisions and events alter the simulated realm.</div>';
 return html+renderPolitics(g,esc);
}
export function renderTrade(g,world,esc){
 const f=g.factions[g.player],pacts=Object.values(g.kingdom?.tradePacts||{}).filter(p=>p.partners.includes(g.player));
 let html='<div class="label">COMMERCE AND MERCHANTS</div>'+
  '<p class="paragraph">Merchant treaties increase monthly revenue. Markets improve their value. Improve relations through gifts, then negotiate from the Diplomacy tab.</p>'+
  '<div class="statlist">'+stat('Trade treaties',fmt(tradePactCount(g)))+stat('Revenue per month','+'+fmt(tradeIncome(g,g.player))+'g')+
   stat('Treasury',fmt(f.treasury)+'g')+'</div>'+section('TRADE PARTNERS');
 if(!pacts.length)html+='<p class="paragraph">No merchant treaties yet. Establish one with a court that has at least +10 relations.</p>';
 for(const treaty of pacts){
  const other=treaty.partners.find(id=>id!==g.player),name=g.factions[other]?.name||other;
  html+='<div class="rule"><div class="label">ACTIVE TREATY</div><h3>'+esc(name)+'</h3><div class="smallnote">Established on campaign turn '+fmt(treaty.founded)+'. Markets and relations support commerce.</div></div>';
 }
 html+=section('MERCHANT NETWORK')+'<p class="paragraph">The 1450 political map uses synthetic provinces, so these treaties are economy simulations—not verified medieval trade routes.</p>';
 return html;
}
export function renderLegacy(g,esc){
 const result=campaignStanding(g),goals=objectives(g);
 let html='<div class="label">THE LEGACY OF YOUR HOUSE</div>'+
  '<p class="paragraph">Your campaign is scored at the year 1500. Complete at least four of the six objectives while keeping your dynasty on the map to secure a victorious legacy.</p>'+
  '<div class="statlist">'+stat('Campaign year',fmt(g.year))+
  stat('Assessment year',fmt(result.targetYear))+
  stat('Legacy score',fmt(result.score))+stat('Completed objectives',fmt(result.fulfilled)+'/'+fmt(result.total))+
  '</div>'+section('DYNASTIC OBJECTIVES');
 for(const o of goals){
  const w=Math.round(o.progress*100);
  html+='<div class="rule"><div class="label">'+(o.complete?'✓ COMPLETE':'IN PROGRESS')+'</div>'+
   '<h3>'+esc(o.name)+'</h3><div class="smallnote">'+fmt(o.value)+' / '+fmt(o.target)+'</div>'+
   '<div class="unithealth"><div style="width:'+w+'%"></div></div></div>';
 }
 if(result.ended)html+=section('CAMPAIGN ASSESSMENT')+'<div class="rule"><h3>'+
  esc(result.outcome)+'</h3><p class="paragraph">Final score: '+fmt(result.score)+'</p></div>';
 else html+='<p class="paragraph">Your legacy continues. Advance months, build the economy, develop the court, and protect your borders.</p>';
 return html;
}

function renderPolitics(g,esc){
 const p=g.politics;if(!p)return '';const s=p.realms[g.player],r=p.people[s.ruler],vassals=Object.entries(p.holdings).filter(([id,v])=>v.realm===g.player&&g.provinces[id]?.owner===g.player&&v.lord!==r.id);
 const button=(action,id,label,extra='',input='')=>'<button class="rowbtn" data-action="politics" data-type="'+esc(action)+'" data-id="'+esc(id)+'" data-extra="'+esc(extra)+'" data-input="'+esc(input)+'">'+esc(label)+'</button>';
 const person=id=>p.people[id];const show=c=>c?esc(c.name)+' · '+c.age+'y · '+esc(c.traits.join(', '))+(c.alive?'':' · deceased'):'None';
 let html=(s.regent?'<div class="rule"><b>Regency</b><p class="paragraph">'+show(person(s.regent))+' governs during the sovereign’s minority.</p></div>':'')+section('DYNASTY AND LIVING FAMILY')+'<div class="rule"><h3>'+esc(r.house)+'</h3><p class="paragraph">'+show(r)+'</p><div class="smallnote">Consort: '+show(person(r.spouse))+'</div><div class="smallnote">Parents: '+r.parents.map(id=>show(person(id))).join(' / ')+'</div>'+r.children.map(id=>'<div class="smallnote">Child: '+show(person(id))+' · spouse: '+show(person(person(id)?.spouse))+'</div>').join('')+'</div>';
 const dispatch=politicalDispatch(g);if(dispatch)html+=section('POLITICAL DISPATCH')+'<div class="rule"><h3>'+esc(dispatch.title)+'</h3><p class="paragraph">'+esc(dispatch.description)+'</p>'+dispatch.choices.map((x,i)=>button('dispatch',i,x.label+(x.cost?' ('+x.cost+'g)':''))).join('')+'</div>';
 html+=section('SUCCESSION LAW')+'<div class="rule"><b>'+esc(s.law)+'</b><p class="paragraph">Reform costs 250 gold, requires 65 legitimacy, and is limited to once per decade.</p>'+['eldest','youngest','elective','partition'].filter(l=>l!==s.law).map(l=>button('law',l,'Adopt '+l)).join('')+'</div>';
 html+=section('DYNASTIC MARRIAGES')+'<p class="paragraph">Eligible adults only. Weddings cost 180 gold; foreign matches also require +20 relations.</p>';
 const matches=marriageCandidates(g,g.player);if(matches.length){const groups=Object.groupBy?Object.groupBy(matches,x=>x.a):matches.reduce((a,x)=>((a[x.a]??=[]).push(x),a),{});for(const [id,opts] of Object.entries(groups)){const field='spouse-'+id;html+='<div class="rule"><b>'+show(person(id))+'</b><select class="select" id="'+esc(field)+'">'+opts.map(x=>'<option value="'+esc(x.b)+'">'+esc(x.label)+'</option>').join('')+'</select>'+button('marry',id,'Celebrate marriage (180g)','',field)+'</div>';}}else html+='<p class="paragraph">No eligible foreign matches at present.</p>';
 html+=section('ROYAL COUNCIL');const candidates=Object.values(p.people).filter(c=>c.alive&&c.realm===g.player&&c.age>=18&&c.id!==r.id&&!Object.values(s.council).includes(c.id));
 for(const [role,id] of Object.entries(s.council)){const field='office-'+role;html+='<div class="rule"><b>'+esc(role)+'</b><div class="smallnote">'+show(person(id))+'</div>'+ (candidates.length?'<select class="select" id="'+field+'">'+candidates.map(c=>'<option value="'+esc(c.id)+'">'+show(c)+'</option>').join('')+'</select>'+button('appoint',role,'Appoint (80g)','',field):'')+'</div>';}
 html+=section('VASSAL CONTRACTS')+'<p class="paragraph">Tax yield '+Math.round(politicalRevenue(g,g.player)*100)+'% · recruitment yield '+Math.round(politicalLevy(g,g.player)*100)+'%. Raising obligations reduces loyalty.</p>';
 for(const [id,v] of vassals){html+='<div class="rule"><h3>'+esc(id.toUpperCase())+' · '+show(person(v.lord))+'</h3><div class="smallnote">Loyalty '+Math.round(v.loyalty)+'% · Wealth '+Math.round(v.wealth)+'g</div>';
 for(const kind of ['tax','levy','autonomy'])html+='<div class="smallnote">'+kind+': '+['Low','Standard','High'][v[kind]]+'</div>'+[0,1,2].filter(n=>n!==v[kind]).map(n=>button(kind,id,'Set '+kind+' '+['low','standard','high'][n],n)).join('');
 html+=button('gift',id,'Send gift (100g)')+button('replace',id,'Revoke and appoint (10 legitimacy)')+(v.loyalty<45?button('concede',id,'Negotiate concession (150g)'):'')+'</div>';}
 html+=section('POLITICAL SITUATIONS');const situations=Object.values(p.situations).filter(x=>x.realm===g.player);html+=situations.length?situations.map(x=>'<div class="rule"><b>'+esc(x.phase.toUpperCase())+' · '+esc(x.province)+'</b><p class="paragraph">'+show(person(x.lord))+' opposes royal authority. Negotiate or risk unrest.</p></div>').join(''):'<p class="paragraph">No active vassal grievances.</p>';
 return html;
}

export function renderConflict(g,world,esc){
 const c=initConflict(g),realm=g.player,p=g.politics,btn=(action,id,label,extra='',input='')=>'<button class="rowbtn" data-action="conflict" data-type="'+esc(action)+'" data-id="'+esc(id)+'" data-extra="'+esc(extra)+'" data-input="'+esc(input)+'">'+esc(label)+'</button>';
 const name=id=>g.factions[id]?.name||id,place=id=>world.provinces.find(x=>x.id===id)?.name||id;
 let html=section('COUNCIL AUTHORITY')+'<div class="rule"><b>'+esc(c.council[realm]||'advisory')+'</b><p class="paragraph">Binding councils can veto succession reform, title revocation and formal claim wars. Support varies by proposal.</p>'+btn('council','binding','Empower council (150g)')+btn('council','advisory','Return to advisory (150g)')+'</div>';
 for(const v of councilVotes(g,realm)){const person=p.people[v.id],war=councilVotes(g,realm,'war').find(x=>x.id===v.id),rev=councilVotes(g,realm,'revoke').find(x=>x.id===v.id);html+='<div class="rule"><b>'+esc(person.name)+' · '+esc(v.role)+'</b><div class="smallnote">Law '+(v.yes?'YES':'NO')+' · War '+(war?.yes?'YES':'NO')+' · Revocation '+(rev?.yes?'YES':'NO')+'</div>'+ (v.favor?'<div class="smallnote">Favor pledged</div>':btn('favor',v.id,'Secure favor (80g)'))+'</div>';}
 html+=section('FACTIONS AND CIVIL WARS');
 const factions=Object.values(c.factions).filter(x=>x.realm===realm&&['organizing','ultimatum','civil war'].includes(x.status));
 if(!factions.length)html+='<p class="paragraph">No organized opposition. Vassals below 42 loyalty can form factions.</p>';
 for(const x of factions){html+='<div class="rule"><h3>'+esc(x.kind.toUpperCase())+' faction · '+esc(x.status)+(x.claimant?' · '+esc(p.people[x.claimant]?.name||x.claimant):'')+'</h3><p class="paragraph">'+x.members.map(id=>esc(place(id))).join(', ')+'</p><div class="smallnote">Pressure '+x.pressure+'% · Estimated rebel strength '+(x.rebels??x.power??0)+(x.status==='ultimatum'?' · '+Math.max(0,x.deadline-g.turn)+' months to respond':'')+(x.status==='civil war'?' · War score '+x.score:'')+'</div>'+btn('accept',x.id,'Accept demands')+(x.status==='civil war'?btn('mobilize',x.id,'Mobilize royal army (150g)'):btn('negotiate',x.id,'Negotiate (150g)'))+(x.status==='ultimatum'?btn('refuse',x.id,'Reject ultimatum — civil war'):'')+'</div>';}
 html+=section('INTRIGUE AND CHANCERY');
 const running=Object.values(c.schemes).filter(x=>x.realm===realm&&x.status==='active');
 for(const x of running)html+='<div class="rule"><b>'+esc(x.kind)+' · '+esc(place(x.target))+'</b><div class="smallnote">'+Math.max(0,x.due-g.turn)+' months remaining · '+x.chance+'% estimated success</div></div>';
 const own=Object.values(g.provinces).filter(x=>x.owner===realm),foreign=Object.values(g.provinces).filter(x=>x.owner!==realm&&p.realms[x.owner]);
 for(const [type,label,targets] of [['fabricate','Fabricate claim (110g)',foreign],['undermine','Undermine foreign court (100g)',foreign],['sway','Sway vassal (60g)',own],['investigate','Investigate estate (80g)',own]]){const field='scheme-'+type;html+='<div class="rule"><b>'+esc(label)+'</b><select class="select" id="'+field+'">'+targets.map(v=>'<option value="'+esc(v.id)+'">'+esc(place(v.id))+' · '+esc(name(v.owner))+'</option>').join('')+'</select>'+btn('scheme',type,'Begin scheme','',field)+'</div>';}
 html+=section('TERRITORIAL CLAIMS');const claims=availableClaims(g,realm);
 if(!claims.length)html+='<p class="paragraph">No active claims. Use the chancellor to establish one.</p>';
 for(const x of claims)html+='<div class="rule"><b>'+esc(place(x.province))+'</b><div class="smallnote">Expires in '+Math.max(0,x.expires-g.turn)+' months · '+esc(name(g.provinces[x.province].owner))+'</div>'+btn('declare',x.province,'Declare claim war (5 prestige)')+'</div>';
 html+=section('WARS AND PEACE');const wars=Object.values(c.wars).filter(w=>w.status==='active'&&[w.attacker,w.defender].includes(realm));if(!wars.length)html+='<p class="paragraph">No formal claim wars.</p>';
 for(const w of wars)html+='<div class="rule"><b>'+esc(name(w.attacker))+' vs '+esc(name(w.defender))+'</b><div class="smallnote">Goal '+esc(place(w.goal))+' · Attacker war score '+w.score+' · Battles '+w.battles+'</div><p class="paragraph">Occupied territories: '+(Object.values(g.campaignWar.occupations).filter(o=>o.war===w.id).map(o=>esc(place(o.province))+' ('+esc(name(o.by))+')').join(', ')||'None')+'</p>'+btn('peace',w.id,'Demand reparations','reparations')+btn('peace',w.id,'Surrender','surrender')+btn('peace',w.id,'Offer white peace','white')+(w.attacker===realm?btn('peace',w.id,'Enforce claim','enforce'):'')+'</div>';
 html+=section('POLITICAL HISTORY')+c.history.filter(x=>x.realm===realm).slice(0,12).map(x=>'<div class="rule"><div class="smallnote">'+esc(x.message)+'</div></div>').join('');
 return html;
}

export function renderCivic(g,world,esc){
 const c=g.civic;if(!c)return '<p>Society records unavailable.</p>';const realm=g.player,s=c.realms[realm],gov=GOVERNMENTS[s.government],p=g.politics,r=p.people[p.realms[realm].ruler],rc=r.civic,mods=civicModifiers(g,realm),place=id=>world.provinces.find(x=>x.id===id)?.name||id;
 const button=(action,id,label,extra='',input='')=>'<button class="rowbtn" data-action="civic" data-type="'+esc(action)+'" data-id="'+esc(id)+'" data-extra="'+esc(extra)+'" data-input="'+esc(input)+'">'+esc(label)+'</button>';
 let html=section('GOVERNMENT AND INSTITUTIONS')+'<div class="rule"><h3>'+esc(gov.name)+'</h3><div class="smallnote">Authority '+Math.round(s.authority)+'% · Cohesion '+Math.round(s.cohesion)+'%</div><div class="smallnote">Tax '+Math.round(mods.tax*100)+'% · Levies '+Math.round(mods.levy*100)+'% · Trade '+Math.round(mods.trade*100)+'% · Construction cost '+Math.round(mods.build*100)+'%</div><p class="paragraph">'+esc(gov.desc)+'</p>'+button('government','',gov.action+' ('+gov.cost+'g)')+'</div>';
 if(s.government==='republic')html+='<p class="paragraph">Republican election in '+Math.max(0,60-g.turn+(s.lastElection??0))+' months. Elective succession is mandatory.</p>';
 html+=section('CULTURE AND FAITH')+'<div class="rule"><b>'+esc(s.culture)+'</b><p class="paragraph">'+esc(s.faith)+'</p><div class="smallnote">Patronage '+Math.round(s.patronage)+'% · Policy '+esc(s.policy)+'</div>'+['accommodation','pluralism','coercion'].filter(x=>x!==s.policy).map(x=>button('policy',x,'Adopt '+x+' (80g)')).join('')+button('patronage','','Support local institutions (110g)')+button('scholarship','','Fund scholarship (130g)')+'</div>';
 html+=section('PERSONAL LIFESTYLE')+'<div class="rule"><b>'+esc(r.name)+'</b><div class="smallnote">Focus '+esc(rc?.focus||'Unselected')+' · XP '+(rc?.xp||0)+' · Stress '+(rc?.stress||0)+'%</div><p class="paragraph">Perks: '+esc(rc?.perks.join(', ')||'None yet')+'</p>'+Object.entries(LIFESTYLES).filter(([id])=>id!==rc?.focus).map(([id,l])=>button('focus',id,'Study '+l.name)).join('')+button('rest','','Rest (70g)')+'</div>';
 html+=section('WARD EDUCATION');const guardians=Object.values(p.people).filter(x=>x.alive&&x.realm===realm&&x.age>=18);for(const id of r.children){const child=p.people[id];if(!child?.alive||child.age<6||child.age>=18)continue;const field='guardian-'+id;html+='<div class="rule"><b>'+esc(child.name)+' · age '+child.age+'</b><div class="smallnote">Guardian '+esc(p.people[child.civic?.guardian]?.name||'Unassigned')+'</div><select class="select" id="'+field+'">'+guardians.map(x=>'<option value="'+esc(x.id)+'">'+esc(x.name)+' · '+esc(Object.entries(x.skills).map(([k,v])=>k+': '+v).join(' · '))+'</option>').join('')+'</select>'+button('guardian',id,'Assign guardian','',field)+'</div>';}
 html+=section('PROVINCIAL COMMUNITIES');for(const v of Object.values(g.provinces).filter(x=>x.owner===realm)){const local=c.provinces[v.id];if(!local)continue;html+='<div class="rule"><b>'+esc(place(v.id))+'</b><p class="paragraph">'+esc(local.culture)+' · '+esc(local.faith)+'</p><div class="smallnote">Acceptance '+Math.round(local.acceptance)+'% · Local trust '+Math.round(local.localTrust)+'%</div>'+button('integrate',v.id,'Consult community (100g)')+'</div>';}
 html+=section('SOCIETY SITUATIONS');const crisis=c.situations['integration:'+realm];html+=crisis?'<div class="rule"><b>Regional integration '+esc(crisis.phase)+'</b><p class="paragraph">Average acceptance '+crisis.acceptance+'%. Improve local trust through consultation and accommodation.</p></div>':'<p class="paragraph">No regional integration crisis.</p>';
 const e=civicEvent(g);if(e)html+=section('SOCIETY DISPATCH')+'<div class="rule"><h3>'+esc(e.title)+'</h3><p class="paragraph">'+esc(e.description)+(e.province?' · '+esc(place(e.province)):'')+'</p>'+e.choices.map((x,i)=>button('event',i,x.label+(x.cost?' ('+x.cost+'g)':''))).join('')+'</div>';
 html+=section('SOCIETY CHRONICLE')+c.history.filter(x=>x.realm===realm).slice(0,10).map(x=>'<div class="rule"><div class="smallnote">'+esc(x.message)+'</div></div>').join('')+'<p class="paragraph">Starting identities and governments are simplified alternate-history design profiles, not verified demographic records.</p>';
 return html;
}

export function renderHeritage(g,world,esc){
 const a=g.heritage,realm=g.player,s=a.realms[realm],r=g.politics.people[g.politics.realms[realm].ruler],d=a.dynasties[realm+'|'+r.house]||{renown:0,legacies:[],achievements:[]},mods=heritageModifiers(g,realm),place=id=>world.provinces.find(p=>p.id===id)?.name||id;
 const button=(action,id,label,extra='',input='',guest='')=>'<button class="rowbtn" data-action="heritage" data-type="'+esc(action)+'" data-id="'+esc(id)+'" data-extra="'+esc(extra)+'" data-input="'+esc(input)+'" data-guest="'+esc(guest)+'">'+esc(label)+'</button>';
 let html=section('ROYAL ACTIVITIES AND JOURNEYS');const x=a.activities[realm];
 if(x){html+='<div class="rule"><h3>'+esc(ACTIVITIES[x.kind].name)+'</h3><p class="paragraph">'+esc(x.phase)+' · '+esc(place(x.path[x.index]))+' → '+esc(place(x.destination))+'</p><div class="smallnote">Quality '+Math.round(x.quality)+'% · '+(x.phase==='travel'?(x.path.length-1-x.index)+' travel steps remaining':x.remaining+' months remaining')+'</div><p class="paragraph">Route: '+x.path.map(id=>esc(place(id))).join(' → ')+'</p></div>';const e=activityIncident(g);if(e)html+='<div class="rule"><h3>'+esc(e.title)+'</h3><p class="paragraph">'+esc(e.desc)+'</p>'+e.choices.map((ch,i)=>button('incident',i,ch[0]+(ch[1]?' ('+ch[1]+'g)':''))).join('')+'</div>';}
 else{const dest=activityDestinations(g,world,realm),guests=world.factions.filter(f=>f.id!==realm&&Object.values(g.provinces).some(p=>p.owner===f.id)&&(g.factions[realm].relations[f.id]||0)>=-30);
 html+='<p class="paragraph">Travel takes one month per connected province. Events may delay the party or change the outcome.</p><select class="select" id="heritage-destination">'+dest.map(v=>'<option value="'+esc(v.id)+'">'+esc(place(v.id))+' · '+(v.route.length-1)+' travel months · '+(v.route.length-1)*15+'g travel cost</option>').join('')+'</select><p class="paragraph">Diplomatic summit guest</p><select class="select" id="heritage-guest">'+guests.map(f=>'<option value="'+esc(f.id)+'">'+esc(f.name)+'</option>').join('')+'</select>';
 for(const [id,rule] of Object.entries(ACTIVITIES)){const cd=Math.max(0,24-g.turn+(s.last[id]??-1000));html+='<div class="rule"><b>'+esc(rule.name)+'</b><div class="smallnote">'+rule.cost+'g + travel · '+rule.duration+' event months'+(cd?' · '+cd+' months cooldown':'')+'</div>'+button('activity',id,'Plan '+rule.name,'','heritage-destination',id==='summit'?'heritage-guest':'')+'</div>';}}
 html+=section('REGIONAL STRUGGLES');const struggles=struggleView(g,realm);if(!struggles.length)html+='<p class="paragraph">No predefined regional scenario for this polity.</p>';
 for(const v of struggles){const t=v.state;html+='<div class="rule"><h3>'+esc(v.name)+'</h3><p class="paragraph">'+esc(v.desc)+'</p><div class="smallnote">Phase '+esc(t.phase)+' · Tension '+t.tension+'% · Cooperation '+t.cooperation+'% · Cycle '+t.cycle+'</div><p class="paragraph">'+v.members.map(id=>esc(g.factions[id]?.name||id)+': '+(t.influence[id]||0)).join(' · ')+'</p>'+(t.ended===null?button('initiative',v.id,'Mediate (120g)','mediation')+button('initiative',v.id,'Apply diplomatic pressure (140g)','pressure')+button('initiative',v.id,'Commercial cooperation (150g)','commerce'):'<p class="paragraph">Scenario resolved; a new cycle can begin after five years.</p>')+'</div>';}
 html+=section('DYNASTIC HERITAGE')+'<div class="rule"><h3>'+esc(d.house||r.house)+'</h3><div class="smallnote">Renown '+d.renown+' · Tax '+Math.round(mods.tax*100)+'% · Levies '+Math.round(mods.levy*100)+'% · Trade '+Math.round(mods.trade*100)+'%</div><p class="paragraph">Achievements: '+esc(d.achievements.join(', ')||'None yet')+'</p>'+Object.entries(LEGACIES).map(([id,l])=>d.legacies.includes(id)?'<div class="smallnote">'+esc(l.name)+' · unlocked</div>':button('legacy',id,l.name+' ('+l.cost+' renown)')).join('')+'</div>';
 html+=section('TREASURY AND ARTIFACTS');for(const [id,l] of Object.entries(RELICS))html+=button('artifact',id,'Commission '+l.name+' ('+l.cost+'g)');
 for(const item of Object.values(a.artifacts).filter(x=>x.realm===realm)){const l=RELICS[item.kind];html+='<div class="rule"><b>'+esc(l.name)+'</b><div class="smallnote">Created '+item.year+' · Condition '+item.durability+'% · '+(s.equipped[l.slot]===item.id?'Equipped':'Stored')+'</div>'+button('equip',item.id,'Equip')+button('repair',item.id,'Repair (80g)')+'</div>';}
 html+=section('DYNASTIC CHRONICLE')+a.history.filter(x=>x.realm===realm).slice(0,15).map(x=>'<div class="rule"><div class="smallnote">'+esc(x.message)+'</div></div>').join('');return html;
}

export function renderEconomy(g,world,esc){
 const e=g.economy,realm=g.player,s=e.realms[realm],f=g.factions[realm],land=Object.values(g.provinces).filter(p=>p.owner===realm),name=id=>world.provinces.find(p=>p.id===id)?.name||id,btn=(action,id,label,extra='',input='',third='')=>'<button class="rowbtn" data-action="economy" data-type="'+esc(action)+'" data-id="'+esc(id)+'" data-extra="'+esc(extra)+'" data-input="'+esc(input)+'" data-third="'+esc(third)+'">'+esc(label)+'</button>';
 let html=section('TREASURY AND CREDIT')+'<div class="rule"><div class="statlist">'+stat('Treasury',fmt(f.treasury)+'g')+stat('Inflation',fmt(s.inflation)+'%')+stat('Credit',fmt(s.credit)+'/100')+stat('Goods trade last month',(s.tradeNet>0?'+':'')+fmt(s.tradeNet)+'g')+'</div>'+[300,600,1200].map(n=>btn('loan',n,'Borrow '+n+'g')).join('')+btn('debase','','Debase currency (+250g)')+btn('stabilize','','Stabilize currency (180g)')+(!s.merchantGuild?btn('guild','','Charter merchant guild (250g)'):'<p class="paragraph">Merchant guild chartered.</p>')+'</div>';
 for(const l of Object.values(e.loans).filter(l=>l.realm===realm&&['active','defaulted'].includes(l.status)))html+='<div class="rule"><b>'+esc(l.status)+' loan · '+fmt(l.remaining+l.interest)+'g outstanding</b><div class="smallnote">Interest '+l.rate+'% monthly · '+Math.max(0,l.due-g.turn)+' months to maturity</div>'+btn('repay',l.id,l.status==='defaulted'?'Settle arrears':'Repay loan')+'</div>';
 html+=section('MARKET PRICES')+'<div class="statlist">'+Object.entries(GOODS).map(([id,v])=>stat(esc(v.name),fmt(e.prices[id])+'g')).join('')+'</div>';
 html+=section('TRADE ROUTES')+'<p class="paragraph">Domestic routes move stock between connected provinces. Foreign routes require a merchant treaty, transfer gold and goods, and close during formal wars. Last-month goods cash flow is separate from existing treaty income.</p>'+[0,1,2].map(n=>btn('tariff',n,'Set '+['free trade','standard','high tariff'][n])).join('');
 for(const r of Object.values(e.routes).filter(r=>r.realm===realm&&r.status==='active'))html+='<div class="rule"><b>'+esc(GOODS[r.good].name)+' · '+esc(name(r.from))+' → '+esc(name(r.to))+'</b><div class="smallnote">'+r.lastVolume+' units last month · '+r.lastValue+'g gross value · '+r.total+' units shipped</div>'+btn('close-route',r.id,'Close route')+'</div>';
 for(const p of land){const l=e.provinces[p.id],targets=tradeDestinations(g,world,realm,p.id),field='route-to-'+p.id,good='route-good-'+p.id;if(targets.length)html+='<details class="rule"><summary>Establish route from '+esc(name(p.id))+'</summary><select class="select" id="'+field+'">'+targets.map(x=>'<option value="'+esc(x.id)+'">'+esc(name(x.id))+' · '+esc(g.factions[x.owner]?.name||x.owner)+'</option>').join('')+'</select><select class="select" id="'+good+'">'+Object.entries(GOODS).map(([id,v])=>'<option value="'+esc(id)+'">'+esc(v.name)+'</option>').join('')+'</select>'+btn('route',p.id,'Establish route (90g)','',field,good)+'</details>';}
 html+=section('SETTLEMENTS AND INDUSTRIES');
 for(const p of land){const l=e.provinces[p.id];html+='<details class="rule"><summary><b>'+esc(name(p.id))+' · '+esc(SETTLEMENTS[l.tier])+'</b></summary><p class="paragraph">Resources: '+l.resources.map(id=>esc(GOODS[id].name)).join(', ')+'</p><div class="statlist">'+Object.entries(GOODS).map(([id,v])=>stat(esc(v.name),fmt(l.stock[id])+' · +'+fmt(l.output[id]||0))).join('')+'</div>'+btn('settlement',p.id,'Upgrade settlement ('+350*(l.tier+1)+'g)')+Object.entries(INDUSTRIES).map(([id,v])=>'<div class="smallnote">'+esc(v.name)+' · level '+l.industries[id]+' / 3 · '+esc(v.desc)+'</div>'+btn('industry',p.id,'Upgrade ('+industryCost(g,realm,p.id,id)+'g)',id)).join('')+'</details>';}
 html+=section('CRISES AND RELIEF');const active=Object.values(e.crises).filter(x=>g.provinces[x.province]?.owner===realm);html+=active.length?active.map(x=>'<div class="rule"><b>'+esc(CRISES[x.kind].name)+' · '+esc(name(x.province))+'</b><div class="smallnote">Severity '+fmt(x.severity)+'% · '+x.remaining+' months remaining</div>'+btn('relief',x.province,'Send relief (120g)')+'</div>').join(''):'<p class="paragraph">No active disasters in your holdings.</p>';
 html+=section('ECONOMIC CHRONICLE')+e.history.filter(x=>x.realm===realm).slice(0,12).map(x=>'<div class="rule"><div class="smallnote">'+esc(x.message)+'</div></div>').join('')+'<p class="paragraph">Resources and trade connections use the existing synthetic map and are gameplay approximations.</p>';return html;
}

export function renderMilitary(g,world,esc){
 const realm=g.player,btn=(action,id,label,extra='',input='')=>'<button class="rowbtn" data-action="military" data-type="'+esc(action)+'" data-id="'+esc(id)+'" data-extra="'+esc(extra)+'" data-input="'+esc(input)+'">'+esc(label)+'</button>';
 let html=section('FIELD ARMIES AND LOGISTICS')+'<p class="paragraph">Regiment specialization trains existing soldiers instead of creating duplicate troops. Supply, fatigue, command skill and siege equipment affect tactical combat.</p>';
 for(const a of Object.values(g.armies).filter(a=>a.owner===realm)){const r=g.military.armies[a.id];if(!r)continue;const ready=armyReadiness(g,a),field='commander-'+a.id,people=Object.values(g.politics.people).filter(c=>c.alive&&c.age>=18&&c.realm===realm);html+='<div class="rule"><h3>'+esc(a.commander)+' · '+esc(world.provinces.find(p=>p.id===a.province)?.name||a.province)+'</h3><div class="statlist">'+stat('Infantry',fmt(a.infantry))+stat('Archers',fmt(a.archers))+stat('Cavalry',fmt(a.cavalry))+stat('Supply',fmt(r.supply)+'%')+stat('Fatigue',fmt(r.fatigue)+'%')+stat('Combat power',fmt(ready.power*100)+'%')+stat('Siege power',fmt(ready.siege))+'</div><p class="paragraph">Commander: '+esc(ready.commander||'Unassigned')+'</p><select class="select" id="'+field+'">'+people.map(c=>'<option value="'+esc(c.id)+'">'+esc(c.name)+' · martial '+c.skills.martial+'</option>').join('')+'</select>'+btn('commander',a.id,'Appoint commander','',field)+btn('resupply',a.id,'Resupply (65g + 8 grain)')+'<h3>Specialized regiments</h3>'+regimentOptions(g,realm).map(id=>'<div class="smallnote">'+esc(REGIMENTS[id].name)+' · '+(r.regiments[id]||0)+' trained</div>'+btn('specialize',a.id,'Train up to 30 ('+REGIMENTS[id].cost+'g)',id)).join('')+'<h3>Siege equipment</h3>'+Object.entries(ENGINES).map(([id,v])=>'<div class="smallnote">'+esc(v.name)+' · '+r.engines[id]+' / 3 · '+v.tools+' tools + '+v.timber+' timber</div>'+btn('engine',a.id,'Construct ('+v.cost+'g)',id)).join('')+'</div>';}
 return html;
}

export function renderNaval(g,world,esc){
 const n=g.naval,realm=g.player,place=id=>world.provinces.find(p=>p.id===id)?.name||id,btn=(action,id,label,extra='',input='',third='')=>'<button class="rowbtn" data-action="naval" data-type="'+esc(action)+'" data-id="'+esc(id)+'" data-extra="'+esc(extra)+'" data-input="'+esc(input)+'" data-third="'+esc(third)+'">'+esc(label)+'</button>';
 let html=section('NAVAL COMMAND')+'<p class="paragraph">Sea routes connect designated prototype ports in the same sea basin. Fleet travel is strategic, not a real-time naval battle. Monthly upkeep: '+navalUpkeep(g,realm)+'g.</p>';
 for(const p of Object.values(n.ports).filter(x=>g.provinces[x.province]?.owner===realm)){const l=g.economy.provinces[p.province];html+='<div class="rule"><h3>'+esc(place(p.province))+' · Port level '+p.level+'</h3><div class="smallnote">'+esc(p.basins.join(', '))+' · Timber '+Math.floor(l.stock.timber)+' · Tools '+Math.floor(l.stock.tools)+(portBlocked(g,p.province)?' · BLOCKADED':'')+(controller(g,p.province)!==realm?' · OCCUPIED':'')+'</div>'+btn('port',p.province,'Upgrade port ('+300*p.level+'g)')+Object.entries(SHIPS).map(([id,d])=>btn('ship',p.province,d.name+' ('+d.cost+'g / '+d.timber+' timber / '+d.tools+' tools)',id)).join('')+'</div>';}
 html+=section('FLEETS');
 for(const f of Object.values(n.fleets).filter(x=>x.realm===realm)){const s=fleetStats(f),dest=fleetDestinations(g,f),targets=blockadeTargets(g,f),d='fleet-dest-'+f.id,a='fleet-army-'+f.id,b='fleet-target-'+f.id;html+='<div class="rule"><h3>'+esc(f.id)+' · '+esc(place(f.port))+'</h3><div class="smallnote">'+esc(f.status)+' · '+(f.target?esc(place(f.target))+' · ':'')+f.remaining+' months remaining</div><div class="statlist">'+stat('Ships',s.count)+stat('Capacity',s.capacity)+stat('Combat strength',s.power)+stat('Monthly upkeep',s.upkeep+'g')+'</div><p class="paragraph">'+Object.entries(f.ships).map(([id,v])=>esc(SHIPS[id].name)+': '+v).join(' · ')+'</p>';
 if(f.status==='docked'){if(dest.length)html+='<select class="select" id="'+d+'">'+dest.map(x=>'<option value="'+esc(x.province)+'">'+esc(place(x.province))+'</option>').join('')+'</select><select class="select" id="'+a+'"><option value="">Fleet only</option>'+Object.values(g.armies).filter(x=>x.owner===realm&&x.province===f.port&&!embarked(g,x.id)).map(x=>'<option value="'+esc(x.id)+'">'+esc(x.commander)+' · '+(x.infantry+x.archers+x.cavalry)+' troops</option>').join('')+'</select>'+btn('voyage',f.id,'Begin voyage','',d,a);
 if(targets.length)html+='<select class="select" id="'+b+'">'+targets.map(x=>'<option value="'+esc(x.province)+'">'+esc(place(x.province))+'</option>').join('')+'</select>'+btn('blockade',f.id,'Sail to blockade','',b);if(portBlocked(g,f.port))html+=btn('break-blockade',f.id,'Sortie to break blockade');}
 else if(['blockade','approach'].includes(f.status))html+=btn('recall',f.id,'Recall fleet');html+='</div>';}
 html+=section('NAVAL CHRONICLE')+n.history.filter(x=>x.realm===realm).slice(0,12).map(x=>'<div class="rule"><div class="smallnote">'+esc(x.message)+'</div></div>').join('');return html;
}

export function renderStrategy(g,world,esc){
 const realm=g.player,s=g.strategy,name=id=>g.factions[id]?.name||id,others=world.factions.filter(f=>f.id!==realm&&Object.values(g.provinces).some(p=>p.owner===f.id));
 const btn=(action,id,label,input='',second='')=>'<button class="rowbtn" data-action="strategy" data-type="'+esc(action)+'" data-id="'+esc(id)+'" data-input="'+esc(input)+'" data-second="'+esc(second)+'">'+esc(label)+'</button>';
 let html=section('STRATEGIC INTELLIGENCE')+'<p class="paragraph">Estimates reflect current forces, ruler temperament, relations and formal wars. Plans are reviewed every six months and change on succession.</p>';
 const ranked=borderRealms(g,world,realm).map(id=>({id,risk:threatAssessment(g,world,realm,id)})).sort((a,b)=>b.risk-a.risk);
 for(const {id,risk} of ranked){const t=temperament(g,id),p=strategicPlan(g,id);html+='<div class="rule"><h3>'+esc(name(id))+'</h3><div class="smallnote">'+esc(t.name)+' · Threat '+risk+'/100 · Field strength '+Math.round(militaryStrength(g,id))+'</div><p class="paragraph">Estimated objective: '+esc(p?.goal||'unassessed')+(p?.target?' · '+esc(name(p.target)):'')+'</p><div class="smallnote">Aggression '+t.aggression+' · Prudence '+t.prudence+' · Commerce '+t.commerce+' · Diplomacy '+t.diplomacy+'</div></div>';}
 html+=section('DEFENSIVE PACTS')+'<p class="paragraph">Five-year agreements against a named threat. Partners contribute abstract defensive reserve strength, not separate controllable armies.</p><select class="select" id="pact-partner">'+others.map(f=>'<option value="'+esc(f.id)+'">'+esc(f.name)+'</option>').join('')+'</select><select class="select" id="pact-target">'+others.map(f=>'<option value="'+esc(f.id)+'">'+esc(f.name)+'</option>').join('')+'</select>'+btn('pact','','Propose defensive pact (100g)','pact-partner','pact-target');
 for(const p of Object.values(s.pacts).filter(p=>p.members.includes(realm)&&p.expires>g.turn))html+='<div class="rule"><b>'+esc(p.members.filter(id=>id!==realm).map(name).join(', '))+' · Against '+esc(name(p.target))+'</b><div class="smallnote">'+Math.max(0,p.expires-g.turn)+' months remaining · Combined reserve support '+defenseSupport(g,realm,p.target)+'</div>'+btn('leave',p.id,'Dissolve pact')+'</div>';
 html+=section('FOREIGN RULERS');for(const f of others){const p=strategicPlan(g,f.id),t=temperament(g,f.id);html+='<details class="rule"><summary>'+esc(f.name)+' · '+esc(t.name)+'</summary><p class="paragraph">Objective: '+esc(p?.goal||'unassessed')+(p?.target?' · '+esc(name(p.target)):'')+'</p><div class="smallnote">Aggression '+t.aggression+' · Prudence '+t.prudence+' · Commerce '+t.commerce+' · Diplomacy '+t.diplomacy+'</div></details>';}
 return html;
}

export function renderStories(g,world,esc){
 const realm=g.player,s=g.chronicles.realms[realm],r=g.politics.people[g.politics.realms[realm].ruler],d=regionalDecision(g,realm);
 const btn=(action,id,label,input='')=>'<button class="rowbtn" data-action="story" data-type="'+esc(action)+'" data-id="'+esc(id)+'" data-input="'+esc(input)+'">'+esc(label)+'</button>';
 let html=section('REGIONAL DECISION')+'<div class="rule"><h3>'+esc(d[0])+'</h3><p class="paragraph">'+esc(d[1])+'</p><div class="smallnote">180g · '+Math.max(0,36-g.turn+s.decisionAt)+' months cooldown remaining</div>'+btn('decision','','Enact decision')+'</div>';
 html+=section('PERSONAL AMBITIONS');
 if(s.ambition){const a=AMBITIONS[s.ambition.id];html+='<div class="rule"><h3>'+esc(a.name)+'</h3><p class="paragraph">'+esc(a.desc)+'</p><div class="smallnote">Reward: '+a.reward+' prestige and dynastic renown, 6 legitimacy.</div>'+btn('abandon','','Abandon ambition (-5 prestige)')+'</div>';}else for(const [id,a] of Object.entries(AMBITIONS)){if(s.completed.some(x=>x.ambition===id&&x.ruler===r.id))continue;html+='<div class="rule"><b>'+esc(a.name)+'</b><p class="paragraph">'+esc(a.desc)+'</p>'+btn('ambition',id,'Choose ambition')+'</div>';}
 html+=section('FRIENDS AND RIVALS');const people=Object.values(g.politics.people).filter(p=>p.alive&&p.realm===realm&&p.age>=18&&p.id!==r.id);
 html+='<p class="paragraph">Personal opinions influence council votes and provincial lord loyalty.</p><select class="select" id="story-person">'+people.map(p=>'<option value="'+esc(p.id)+'">'+esc(p.name)+' · opinion '+personalOpinion(g,r.id,p.id)+'</option>').join('')+'</select>'+btn('befriend','','Offer friendship (90g)','story-person')+btn('challenge','','Challenge courtier','story-person');
 for(const x of relationshipList(g,realm).filter(x=>g.politics.people[x.other]?.alive).sort((a,b)=>b.opinion-a.opinion))html+='<div class="rule"><b>'+esc(g.politics.people[x.other].name)+'</b><div class="smallnote">'+esc(x.kind)+' · Opinion '+x.opinion+'</div></div>';
 html+=section('ONGOING STORIES');const x=currentChain(g);if(x){html+='<div class="rule"><h3>'+esc(x.name)+' · '+(x.stage+1)+'/3</h3><b>'+esc(x.title)+'</b><p class="paragraph">'+esc(x.desc)+'</p>'+(x.target&&g.politics.people[x.target]?'<p class="paragraph">Courtier: '+esc(g.politics.people[x.target].name)+'</p>':'')+(g.turn>=x.due?x.choices.map((ch,i)=>btn('chain',i,ch[0]+(ch[1]?' ('+ch[1]+'g)':''))).join(''):'<div class="smallnote">Next stage in '+(x.due-g.turn)+' months</div>')+'</div>';}else html+='<p class="paragraph">No active storyline. Succession, noble discontent, disasters, trade and rivalries may trigger new stories.</p>';
 html+=section('COURT CHRONICLE')+g.chronicles.history.filter(x=>x.realm===realm).slice(0,20).map(x=>'<div class="rule"><div class="smallnote">'+esc(x.message)+'</div></div>').join('');return html;
}

export function renderFeudal(g,world,esc){
 const realm=g.player,r=g.politics.realms[realm].ruler,titles=titleList(g,realm),name=id=>g.politics.people[id]?.name||id,place=id=>world.provinces.find(p=>p.id===id)?.name||id;
 const btn=(action,id,label,input='')=>'<button class="rowbtn" data-action="feudal" data-type="'+esc(action)+'" data-id="'+esc(id)+'" data-input="'+esc(input)+'">'+esc(label)+'</button>';
 const adults=Object.values(g.politics.people).filter(p=>p.alive&&p.realm===realm&&p.age>=18&&!isImprisoned(g,p.id)&&p.id!==r);
 const crown=titles.filter(t=>t.tier==='province'&&t.holder===r);
 let html=section('TITLE HIERARCHY')+'<div class="rule"><h3>'+esc(g.factions[realm].name)+'</h3><p class="paragraph">Sovereign: '+esc(name(r))+' · '+crown.length+' personally held provinces. Crown → regional titles → provincial titles. Districts use the prototype map; they are not historical duchy boundaries.</p></div>';
 for(const t of titles.filter(t=>t.tier==='regional')){const field='regional-'+t.id.replaceAll(':','-'),lords=adults.filter(p=>t.members.some(id=>g.politics.holdings[id].lord===p.id));html+='<details class="rule"><summary>'+esc(t.name)+' · '+esc(name(t.holder))+'</summary><p class="paragraph">Regional loyalty effect: '+regionalLoyalty(g,t.members[0]).toFixed(1)+'</p>'+(lords.length?'<select class="select" id="'+field+'">'+lords.map(p=>'<option value="'+esc(p.id)+'">'+esc(p.name)+'</option>').join('')+'</select>'+btn('regional',t.id,'Grant regional title (120g)',field):'');
 for(const id of t.members){const v=g.politics.holdings[id],p=titles.find(x=>x.province===id),grant='grant-'+id;html+='<div class="rule"><b>'+esc(place(id))+' · '+esc(name(v.lord))+'</b><div class="smallnote">Loyalty '+Math.round(v.loyalty)+'%'+(isImprisoned(g,v.lord)?' · imprisoned':'')+'</div>';
 if(v.lord===r&&adults.length)html+='<select class="select" id="'+grant+'">'+adults.map(a=>'<option value="'+esc(a.id)+'">'+esc(a.name)+'</option>').join('')+'</select>'+btn('grant',p.id,'Grant province',grant);
 else if(v.lord!==r){html+=btn('reclaim',p.id,'Reclaim with evidence (8 legitimacy)');if(!isImprisoned(g,v.lord))html+=btn('arrest',v.lord,'Arrest with evidence (3 legitimacy)');}html+='</div>';}html+='</details>';}
 html+=section('CROWN CLAIMANTS')+'<p class="paragraph">Other eligible children inherit claims on succession. Discontented vassals may support an adult claimant when legitimacy is low.</p>';for(const c of claimantCandidates(g,realm))html+='<div class="rule"><b>'+esc(name(c.person))+'</b><div class="smallnote">Claim from '+esc(name(c.from))+' · expires in '+Math.max(0,180-g.turn+c.created)+' months</div></div>';
 html+=section('PRISONERS AND RANSOM');for(const x of Object.values(g.feudal.prisoners).filter(x=>x.status==='held'&&(x.captor===realm||x.realm===realm)))html+='<div class="rule"><b>'+esc(name(x.person))+'</b><div class="smallnote">'+esc(x.reason)+' · held by '+esc(g.factions[x.captor]?.name||x.captor)+' · '+(g.turn-x.started)+' months</div>'+(x.captor===realm?btn('release',x.person,'Release prisoner')+btn('ransom',x.person,'Ransom (100g)'):'')+'</div>';
 return html;
}
