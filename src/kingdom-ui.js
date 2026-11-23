/** Safe, copy-free royal court, trade and legacy interface views. */
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
 return html;
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
