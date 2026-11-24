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
 const p=g.politics;if(!p)return '';const s=p.realms[g.player],r=p.people[s.ruler],vassals=Object.entries(p.holdings).filter(([id,v])=>v.realm===g.player&&g.provinces[id]?.owner===g.player);
 const button=(action,id,label,extra='',input='')=>'<button class="rowbtn" data-action="politics" data-type="'+esc(action)+'" data-id="'+esc(id)+'" data-extra="'+esc(extra)+'" data-input="'+esc(input)+'">'+esc(label)+'</button>';
 const person=id=>p.people[id];const show=c=>c?esc(c.name)+' · '+c.age+'y · '+esc(c.traits.join(', '))+(c.alive?'':' · deceased'):'None';
 let html=(s.regent?'<div class="rule"><b>Regency</b><p class="paragraph">'+show(person(s.regent))+' governs during the sovereign’s minority.</p></div>':'')+section('DYNASTY AND LIVING FAMILY')+'<div class="rule"><h3>'+esc(r.house)+'</h3><p class="paragraph">'+show(r)+'</p><div class="smallnote">Consort: '+show(person(r.spouse))+'</div><div class="smallnote">Parents: '+r.parents.map(id=>show(person(id))).join(' / ')+'</div>'+r.children.map(id=>'<div class="smallnote">Child: '+show(person(id))+' · spouse: '+show(person(person(id)?.spouse))+'</div>').join('')+'</div>';
 const dispatch=politicalDispatch(g);if(dispatch)html+=section('POLITICAL DISPATCH')+'<div class="rule"><h3>'+esc(dispatch.title)+'</h3><p class="paragraph">'+esc(dispatch.description)+'</p>'+dispatch.choices.map((x,i)=>button('dispatch',i,x.label+(x.cost?' ('+x.cost+'g)':''))).join('')+'</div>';
 html+=section('SUCCESSION LAW')+'<div class="rule"><b>'+esc(s.law)+'</b><p class="paragraph">Reform costs 250 gold, requires 65 legitimacy, and is limited to once per decade.</p>'+['eldest','youngest','elective'].filter(l=>l!==s.law).map(l=>button('law',l,'Adopt '+l)).join('')+'</div>';
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
