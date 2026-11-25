import {regimentCardIcon} from './banner-renderer.js';
import {cardFormationChoices,cardRoleHint} from './simple-card-battle.js';
import {resolvePersonalDilemma,personalDilemmas,playerLifeAction} from './character-agency.js';
import {personalUnion,unionPartners,unionTerms} from './personal-unions.js';
import {CAREER_TABS,campaignTab,careerPriorities,renderCareerCharacter,renderCareerProvince,renderCareerLinks} from './campaign-access.js';
import {careerAction,careerView,vassalCareer,renderCareer,renderCareerEntry} from './player-career.js';
import {historicalContext,HISTORICAL_LIMITATION} from './historical-context.js';
import {createPageHistory,campaignGuide,speedDelay} from './interface-experience.js';
import {landlessAction,renderLandless} from './landless-systems.js';
import {councilTaskAction} from './council-tasks.js';
import {battleComparison,portraitMark,successionWarningSummary,tooltipData} from './campaign-hud.js';
import {campaignOutliner,renderCampaignOutliner,renderPinButton,toggleCampaignPin} from './campaign-outliner.js';
import {characterLink,contextualButton,realmWarContext,sectionLink} from './campaign-context.js';
import {marriageCandidates} from './dynastic-politics.js';
import {freshBattleCanvas} from './battle-lifecycle.js';
import {SAVE_KEY,MAX_SAVE_BYTES,validatePortableSave,saveFilename,persistCampaign} from './portable-save.js';
import {workspaceFor,workspaceTab,realmPriorities,searchRealms} from './campaign-navigation.js';
import {currentExpandedEvents,currentEmergentEvent,expandedAction} from './expanded-content.js';
import {buildHistoricalWorld,expandHistoricalWorld,densifyHistoricalWorld,worldForSave,capitalDistrict,realmGeography} from './historical-world.js';
import {livingAction} from './living-systems.js';
import {diplomacyAction,mayEnterWithAccess,fieldContingentsAt} from './diplomacy-systems.js';
import {governmentAction} from './government-institutions.js';
import {intrigueAction} from './intrigue-systems.js';
import {campaignWorld} from './independence-systems.js';
import {identityAction} from './identity-systems.js';
import {feudalAction} from './feudal-systems.js';
import {chronicleAction} from './chronicle-systems.js';
import {strategyAction,defenseSupport} from './strategic-ai.js';
import {CampaignMap} from './map.js';
import {BattleGame} from './battle.js';
import {militaryDoctrine,availableFormations} from './military-doctrines.js';
import {resolveInvasion,autoResolveInvasion,nativeInvasionArmies,validReadyInvasion} from './invasions.js';
import {politicsAction} from './dynastic-politics.js';
import {conflictAction} from './political-conflict.js';
import {civicAction,civicModifiers} from './civic-systems.js';
import {heritageAction} from './heritage-systems.js';
import {economyAction,economyModifiers} from './economy-systems.js';
import {militaryAction} from './military-systems.js';
import {navalAction,portBlocked} from './naval-systems.js';
import {controller,occupation,declareCasusBelliWar} from './campaign-war.js';
import {activeWar} from './political-conflict.js';
import {renderCampaignSearch,renderDiplomaticAgreements,renderIdentity,renderFeudal,renderStories,renderStrategy,renderNaval,renderMilitary,renderArmyCommand,renderCharacter,renderCharacterDirectory,renderDynasty,renderCouncilDirectory,renderVassalDirectory,renderProvinceLord,renderCampaignHub,renderProvinceConnections,renderPreWarComparison,renderEconomy,renderHeritage,renderCivic,renderConflict,renderCourt,renderTrade,renderLegacy} from './kingdom-ui.js';
import {courtDecision,resolveRoyalEvent,currentRoyalEvent,tradeIncome,objectives,campaignStanding} from './kingdom-depth.js';
import {createGame,restoreGame,snapshot,MONTHS,BUILDINGS,POLICY,empireStats,controlled,armiesAt,armySize,advanceMonth,setPolicy,build,recruit,recruitmentQuote,startMarch,concludeBattle,negotiate,ownerName} from './simulation.js';
import {artIcon,setupMenuVideo,portraitImage,realmArt,assetImage,eventImage} from './game-art.js';
import {browserCampaignAudio} from './field-audio.js';
import {allianceTerms,nonAggressionTerms,polityAction,setChildhoodFocus,setObligationLaw,grantViceroyalty,grantMinorTitle,revokeMinorTitle,callInFavor,assaultSiege} from './ck2-deep-systems.js';
import {civicEvent} from './civic-systems.js';
import {politicalDispatch} from './dynastic-politics.js';
import {activityIncident} from './heritage-systems.js';
import {currentChain} from './chronicle-systems.js';
const el=id=>document.getElementById(id);
setupMenuVideo();for(const n of document.querySelectorAll('[data-resource-art]'))n.innerHTML=artIcon('resources',n.dataset.resourceArt);
const fmt=n=>Math.round(n).toLocaleString('en-US');
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const legacyWorld=await fetch('data/world.json').then(r=>{if(!r.ok)throw Error(`Map data unavailable (${r.status})`);return r.json();});
const historicalReference=await fetch('data/historical-polities-1450.json').then(r=>r.ok?r.json():null).catch(()=>null);
const atlasV2=buildHistoricalWorld(legacyWorld,historicalReference),atlasV3=expandHistoricalWorld(atlasV2),atlasWorld=densifyHistoricalWorld(atlasV3);let world=atlasWorld;
let staticById=Object.fromEntries(world.provinces.map(p=>[p.id,p]));
const pageHistory=createPageHistory();
let characterId=null,characterBackTab='realm',characterBackProvince=null;
let game=null,selected=null,tab='realm',marchFrom=null,diplomaticTarget='france',battle=null,battleDescriptor=null,speedInterval=null,toastTimer=null;
const map=new CampaignMap(el('world-map'),world,onProvince);map.onArmy=marker=>{if(!game)return;selected=marker.province;map.select(selected);renderInspector();setDrawer('province');const command=el('province-panel').querySelector('[data-section="command"]');if(command&&marker.owner===game.player)command.open=true;message(fmt(marker.troops)+' troops · '+ownerName(game,marker.owner));};
if(window.matchMedia('(pointer: coarse)').matches)map.setRelief(false);
if(!map.terrain?.gl){const button=el('toggle-relief');button.textContent='▤ 2D MAP';button.title='3D terrain requires a WebGL2-capable browser';button.setAttribute('aria-pressed','false');button.disabled=true;}
if(historicalReference)map.setHistorical(historicalReference);if(!map.useRelief&&map.terrain?.gl){el('toggle-relief').textContent='▤ 3D OFF';el('toggle-relief').setAttribute('aria-pressed','false');}
function useWorld(next){if(next===world)return;world=next;staticById=Object.fromEntries(world.provinces.map(p=>[p.id,p]));map.setWorld(world);}
const player=()=>game?.factions[game.player];
const displayProvince=p=>p.name.replace(' Province ',' March ');
function message(msg){const t=el('toast');t.textContent=msg;t.classList.add('visible');clearTimeout(toastTimer);toastTimer=setTimeout(()=>t.classList.remove('visible'),3400);}
function clickResult(r){if(!r?.ok){message(r?.msg||'Action unavailable');browserCampaignAudio.playSfx('alert');}else{message(r.msg);browserCampaignAudio.playSfx('seal');render();save(false);}}
function loadRaw(raw,portable=false){pageHistory.reset();characterId=null;tab='realm';deferredModalEvents.clear();closeEventModal();if(portable)validatePortableSave(raw);const next=worldForSave(raw,legacyWorld,atlasV2,atlasV3,atlasWorld),restored=restoreGame(raw,next);if(portable){try{persistCampaign(localStorage,snapshot(restored));}catch{message('Backup opened, but browser storage is unavailable. Export another backup to keep progress.');}}clearInterval(speedInterval);speedInterval=null;el('auto-time').textContent='▶';cancelMarch();setDrawer(null);useWorld(next);game=restored;el('start-screen').hidden=true;selected=capitalDistrict(world,game.player,game.provinces)?.id||null;map.setGame(game);map.select(selected);map.focus(...(staticById[selected]?.centroid||player().capital),3);render();syncAudioState();if(!openIncomingBattle())message('Saved campaign restored.');}
function load(){try{loadRaw(localStorage.getItem(SAVE_KEY));}catch(e){message('Unable to load save: '+e.message);}}
function save(notify=true){if(!game||battle)return false;try{persistCampaign(localStorage,snapshot(game));if(notify!==false)message('Campaign saved to this browser.');return true;}catch(e){if(notify!==false)message('Save failed: '+e.message);return false;}}
const activeObjectUrls=new Set();
function revokeObjectUrls(){for(const u of activeObjectUrls){try{URL.revokeObjectURL(u);}catch{}}activeObjectUrls.clear();}
function exportSave(){if(!game||battle)return;const blob=new Blob([snapshot(game)],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');activeObjectUrls.add(url);a.href=url;a.download=saveFilename(game);document.body.append(a);a.click();a.remove();setTimeout(()=>{if(activeObjectUrls.delete(url))try{URL.revokeObjectURL(url);}catch{}},1000);message('Campaign backup exported.');}
function closePopover(){const pop=el('map-popover');if(pop){pop.hidden=true;pop.innerHTML='';}}
function hideTooltip(){const tip=el('ui-tooltip');if(tip)tip.hidden=true;}
function updateMapLegend(){
 const legendEl=el('map-legend-overlay');if(!legendEl)return;
 const show=game&&(map.mode!=='political'||!el('map-modes')?.hidden);
 legendEl.hidden=!show;if(!show)return;
 const leg=map.modeLegend();
 legendEl.innerHTML='<b>'+esc(leg.title)+'</b><div class="map-legend-items">'+leg.items.map(it=>'<span class="map-legend-item"><span class="map-legend-swatch" style="background:'+esc(it.color)+'"></span>'+esc(it.label)+'</span>').join('')+'</div>';
}
function openQuickPopover(kind,id,x,y){
 if(!game)return;
 const pop=el('map-popover');if(!pop)return;
 const actions=[];let title='';
 if(kind==='province'){
  const p=staticById[id],st=game.provinces?.[id];if(!p||!st)return;
  title=displayProvince(p);
  actions.push({label:'Inspect province',fn:()=>{selected=id;map.select(id);renderInspector();setDrawer('province');}});
  actions.push({label:'Center map here',fn:()=>{selected=id;map.select(id);map.focus(...p.centroid,3.2);}});
  if(st.owner===game.player){
   const arm=armiesAt(game,id,game.player).filter(a=>armySize(a)>0);
   if(arm.length)actions.push({label:'March army from here',fn:()=>{selected=id;setDrawer(null);marchFrom=id;map.setMarchOrigin(id);el('cancel-march').hidden=false;el('map-target-help').textContent='⚔ SELECT ADJACENT DESTINATION';}});
   actions.push({label:'Recruit / Build',fn:()=>{selected=id;map.select(id);renderInspector();setDrawer('province');const rec=el('province-panel').querySelector('[data-section="recruit"]');if(rec)rec.open=true;}});
  }else if(st.owner!=='independent'){
   actions.push({label:'Open diplomacy',fn:()=>{diplomaticTarget=st.owner;navigateTab('diplomacy');}});
   actions.push({label:'Claims & pre-war strength',fn:()=>{selected=id;map.select(id);renderInspector();setDrawer('province');const conn=el('province-panel').querySelector('[data-section="connections"]');if(conn)conn.open=true;}});
  }
  actions.push({label:'Toggle outliner pin',fn:()=>clickResult(toggleCampaignPin(game,'province',id))});
 }else if(kind==='character'){
  const c=game.politics?.people?.[id];if(!c)return;
  title=c.name;
  actions.push({label:'Open dossier',fn:()=>openCharacter(id)});
  actions.push({label:'Toggle outliner pin',fn:()=>clickResult(toggleCampaignPin(game,'character',id))});
  if(c.realm!==game.player&&c.realm!=='independent')actions.push({label:'Open realm diplomacy',fn:()=>{diplomaticTarget=c.realm;navigateTab('diplomacy');}});
  else if(c.realm===game.player&&c.id!==game.politics?.realms?.[game.player]?.ruler)actions.push({label:'Personal gift (40g)',fn:()=>clickResult(politicsAction(game,campaignWorld(game,world),'personal-gift',id))});
 }
 if(!actions.length)return;
 pop.innerHTML='<div class="popover-head">'+esc(title)+'</div>'+actions.map((a,i)=>'<button type="button" data-popover-idx="'+i+'">'+esc(a.label)+'</button>').join('');
 pop._actions=actions;
 pop.hidden=false;
 const rect=pop.getBoundingClientRect();
 const left=Math.max(8,Math.min(window.innerWidth-rect.width-8,x));
 const top=Math.max(8,Math.min(window.innerHeight-rect.height-8,y));
 pop.style.left=left+'px';pop.style.top=top+'px';
}
map.onContextMenu=(id,x,y)=>openQuickPopover('province',id,x,y);
function setDrawer(next){closePopover();hideTooltip();const open=next==='management'||next==='province';document.querySelector('.map-options').open=false;el('management-panel').hidden=next!=='management';el('province-drawer').hidden=next!=='province';el('panel-scrim').hidden=!open;el('open-management').setAttribute('aria-expanded',String(next==='management'));el('open-province').setAttribute('aria-expanded',String(next==='province'));}
function cancelMarch(){marchFrom=null;map.setMarchOrigin(null);el('cancel-march').hidden=true;el('map-target-help').textContent='Tap a province to inspect';}
function onProvince(id){if(!game)return;if(marchFrom){let r=startMarch(game,world,marchFrom,id);cancelMarch();if(r.ok&&r.type==='battle'){if(openBattle(r))return;message('Could not open battle. No campaign casualties were applied.');return;}clickResult(r);}
 selected=id;map.select(id);renderInspector();setDrawer('province');}
function render(){if(!game)return;const f=player(),s=empireStats(game,game.player),career=careerView(game);
 el('resource-prestige').textContent=fmt(f.prestige||0);el('resource-legitimacy').textContent=fmt(f.legitimacy||0)+'%';el('resource-gold').parentElement.parentElement.title=career?'Personal gold; estate funds shown in career panel':'Treasury '+fmt(f.treasury)+' · monthly balance '+fmt(s.balance);el('resource-gold').textContent=fmt(career?career.person?.wealth||0:f.treasury)+' ◈';el('resource-army').textContent=fmt(s.troops);el('resource-stability').textContent=fmt(f.stability)+'%';el('date-display').textContent=`${MONTHS[game.month].toUpperCase()} ${game.year}`;
 const ruler=career?career.person:game.politics?.people?.[game.politics?.realms?.[game.player]?.ruler],mark=portraitMark(ruler);el('hud-ruler').hidden=!ruler;el('hud-ruler-name').textContent=(ruler?.name||'—')+(ruler&&personalDilemmas(game,ruler.id).length?' · !':'');const succWarn=career?null:successionWarningSummary(game);const warnEl=el('hud-succession-warning');if(warnEl){warnEl.hidden=!succWarn;warnEl.textContent=succWarn?'⚠ '+succWarn.label:'';warnEl.title=succWarn?.detail||'';}el('hud-portrait').innerHTML=(portraitImage(ruler)||esc(mark.initials)).replace('loading="lazy"','loading="eager"');el('hud-portrait').style.background=mark.color;el('quick-nav').hidden=false;el('open-management').textContent=career?'Manage career':'Manage kingdom';for(const b of el('quick-nav').querySelectorAll('[data-priority-tab]'))b.hidden=!!career&&!CAREER_TABS.includes(b.dataset.priorityTab);const outliner=campaignOutliner(game,world);el('outliner-count').textContent=outliner.count;el('outliner-list').innerHTML=renderCampaignOutliner(outliner,esc);el('faction-name').textContent=f.name;el('faction-government').textContent=career?'Vassal career':f.government;
 el('faction-flag').style.background=f.color;el('faction-flag').innerHTML=(assetImage(realmArt(f.id),'realm-emblem')||'♛').replace('loading="lazy"','loading="eager"');
 el('world-counter').title=world.meta.caveat;el('world-counter').textContent=`${world.provinces.length} DISTRICTS · ${Object.values(game.factions).filter(q=>q.id!=='independent'&&Object.values(game.provinces).some(p=>p.owner===q.id)).length} REALMS`;
 el('latest-event').textContent=game.log[0]?.text||'Your court awaits.';
 const priorities=career?careerPriorities(game):realmPriorities(game,s,Boolean(currentRoyalEvent(game)),currentExpandedEvents(game).length+(currentEmergentEvent(game)?1:0)),strip=el('priority-strip');strip.hidden=!priorities.length;el('open-priorities').hidden=!priorities.length;el('open-priorities').textContent='Alerts ('+priorities.length+')';strip.innerHTML=priorities.slice(0,3).map(p=>'<button class="priority-item '+p.level+'" data-priority-tab="'+esc(p.tab)+'" title="'+esc(p.detail)+'">'+esc(p.label)+'</button>').join('')+(priorities.length>3?'<small>+'+(priorities.length-3)+' more on Realm</small>':'');
 const threat=game.kingdom?.threats?.[0],banner=el('invasion-alert');
 banner.hidden=!threat||!!career;
 if(threat){
  const opponent=game.factions[threat.by]?.name||'An enemy kingdom';
  el('invasion-text').textContent=threat.status==='ready'
   ?`⚔ ${opponent} IS ATTACKING ${threat.province.toUpperCase()} — DEFEND YOUR REALM`
   :`⚑ ${opponent} APPROACHES ${threat.province.toUpperCase()} · ${threat.eta} MONTH(S) LEFT`;
  el('invasion-defend').hidden=threat.status!=='ready';
  el('invasion-auto').hidden=threat.status!=='ready';
 }
 renderTab();renderInspector();map.render();updateMapLegend();syncAudioState();}
const rememberedTabs={},directoryState={scope:'court',query:'',sort:'martial'};let vassalSort='loyalty',campaignQuery='';
function navigateTab(next,section='',record=true){if(!game)return;next=campaignTab(game,next);if(!document.querySelector('[data-tab="'+next+'"]'))return;characterId=null;setDrawer('management');tab=next;if(record)pageHistory.visit({tab,character:null,section});renderTab();const panel=el('tab-content');panel.scrollTop=0;if(section){const h=[...panel.querySelectorAll('.sectiontitle')].find(n=>n.textContent===section);h?.scrollIntoView({block:'start'});}}
function openCharacter(id,record=true){if(!game?.politics?.people?.[id])return;if(!characterId){characterBackTab=tab;characterBackProvince=!el('province-drawer').hidden?selected:null;}characterId=id;if(record)pageHistory.visit({tab,character:id,section:''});setDrawer('management');renderTab();el('tab-content').scrollTop=0;}
function renderTab(){if(!game)return;const career=vassalCareer(game);el('workspace-nav').hidden=!!career;for(const b of el('workspace-nav').querySelectorAll('[data-workspace]'))b.hidden=!!career;el('tabs').querySelector('[data-tab="realm"] span').textContent=career?'MY CAREER':'THE REALM';if(career){tab=campaignTab(game,tab);el('nav-back').disabled=!pageHistory.canBack;el('nav-forward').disabled=!pageHistory.canForward;el('nav-location').textContent=characterId?(game.politics.people[characterId]?.name||'Character'):'Career / '+tab;for(const b of document.querySelectorAll('.tab')){b.hidden=!CAREER_TABS.includes(b.dataset.tab);const active=b.dataset.tab===tab;b.classList.toggle('active',active);b.setAttribute('aria-current',active?'page':'false');}const live=campaignWorld(game,world);let html;if(characterId)html=renderCareerCharacter(game,live,characterId,esc);else if(tab==='characters')html=renderCharacterDirectory(game,esc,directoryState);else if(tab==='search')html=renderCampaignSearch(game,live,esc,campaignQuery);else if(tab==='chronicle')html='<div class="sectiontitle">CAMPAIGN CHRONICLE</div>'+game.log.map(l=>'<div class="rule"><b>'+esc(l.date)+'</b><p>'+esc(l.text)+'</p></div>').join('');else html=renderCareer(game,live,esc)+renderCareerLinks(game,live,esc);if(html.includes('VASSAL CAREER')&&!html.includes('>VASSAL CAREER<'))html=html.replace('VASSAL CAREER','<span>VASSAL CAREER</span>');el('tab-content').innerHTML=html;return;}el('nav-back').disabled=!pageHistory.canBack;el('nav-forward').disabled=!pageHistory.canForward;el('nav-location').textContent=characterId?(game.politics.people[characterId]?.name||'Character'):(workspaceFor(tab).name+' / '+tab);if(characterId){el('tab-content').innerHTML=renderCharacter(game,world,characterId,esc);return;}const liveWorld=campaignWorld(game,world),workspace=workspaceFor(tab);if(tab!=='search')rememberedTabs[workspace.id]=tab;
 for(const b of document.querySelectorAll('[data-workspace]')){const active=b.dataset.workspace===workspace.id;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active));}
 for(const b of document.querySelectorAll('.tab')){b.hidden=!workspace.tabs.includes(b.dataset.tab);const active=b.dataset.tab===tab;b.classList.toggle('active',active);b.setAttribute('aria-current',active?'page':'false');}
 const f=player(),s=empireStats(game,game.player);let html='';
 if(tab==='realm'){
  const priorities=realmPriorities(game,s,Boolean(currentRoyalEvent(game)),currentExpandedEvents(game).length);
  const guide=campaignGuide(game,s);const onboarding='<details class="realm-overview first-steps"><summary>First steps · '+guide.filter(x=>x.done).length+'/'+guide.length+'</summary>'+guide.map(x=>'<button class="priority-detail" data-priority-tab="'+esc(x.tab)+'"><b>'+(x.done?'✓ ':'')+esc(x.label)+'</b><small>'+esc(x.detail)+'</small></button>').join('')+'</details>';const guidance=onboarding+'<div class="realm-overview"><h3>What needs your attention?</h3>'+(priorities.length?priorities.map(p=>'<button class="priority-detail '+p.level+'" data-priority-tab="'+esc(p.tab)+'"><b>'+esc(p.label)+'</b><small>'+esc(p.detail)+'</small></button>').join(''):'<p class="paragraph">No urgent issues. Select a province to develop it, or advance a month.</p>')+'</div>';
  const history=historicalContext(game.player);const historicalNote=history?'<details class="rule historical-context"><summary>'+esc(history.title)+'</summary><p class="paragraph">'+esc(history.context)+'</p><p class="smallnote">'+esc(HISTORICAL_LIMITATION)+'</p><a href="'+esc(history.url)+'" target="_blank" rel="noopener noreferrer">'+esc(history.source)+'</a></details>':'';html=renderLandless(game,liveWorld,esc)+renderCareerEntry(game,esc)+guidance+historicalNote+renderCampaignHub(game,esc)+`<div class="label">STATE OF THE REALM</div><div class="divider"></div><div class="statlist"><label>Controlled provinces</label><strong>${fmt(s.provinces)}</strong><label>Owned land groups</label><strong>${realmGeography(world,game.player,game.provinces).components}</strong><label>Population</label><strong>${fmt(s.population)}k</strong><label>Total revenue / mo.</label><strong class="up">+${fmt(s.income)}</strong><label>Trade / mo.</label><strong class="up">+${fmt(s.trade||0)}</strong><label>Army upkeep / mo.</label><strong class="down">−${fmt(s.upkeep)}</strong><label>Net treasury / mo.</label><strong class="${s.balance>=0?'up':'down'}">${s.balance>=0?'+':''}${fmt(s.balance)}</strong><label>Food reserve</label><strong>${fmt(f.food)}</strong><label>Food change / mo.</label><strong class="${s.foodDelta>=0?'up':'down'}">${s.foodDelta>=0?'+':''}${fmt(s.foodDelta)}</strong><label>Legitimacy</label><strong>${fmt(f.legitimacy)}%</strong><label>Prestige</label><strong>${fmt(f.prestige)}</strong></div><div class="divider"></div><div class="sectiontitle">MILITARY DOCTRINE</div><div class="rule"><b>⚔ ${esc(militaryDoctrine(f).name)}</b><div class="smallnote">Specialist: ${esc(militaryDoctrine(f).unique)} · Army mix ${militaryDoctrine(f).mix.map(x=>Math.round(x*100)).join(" / ")}% · ${militaryDoctrine(f).formations.map(id=>id.replaceAll("_"," ")).join(" · ")}. These formations affect movement, range, attack and defense in real battles.</div></div><div class="sectiontitle">COURT ADVICE</div><p class="paragraph">Expand with care. Taxes and conscription increase unrest. A depleted treasury or food reserve undermines public stability. Build markets to finance your armies.</p>`;
 }else if(tab==='search'){html=renderCampaignSearch(game,liveWorld,esc,campaignQuery);
 }else if(tab==='decrees'){
  const descriptions={tax:'Taxation balances state revenue against civilian unrest.',levy:'Conscription policy affects the political burden of raising regiments.',tolerance:'Pluralism reduces unrest at the cost of central control.'};
  html=`<div class="label">ROYAL DECREES</div><p class="paragraph" style="margin-top:12px">New laws cost 80 gold to enact. Their consequences apply during monthly simulation.</p>${Object.keys(POLICY).map(key=>`<div class="rule"><div class="label">${key.toUpperCase()}</div><select class="policy-select" data-policy="${key}">${POLICY[key].map((name,i)=>`<option value="${i}" ${f.policies[key]===i?'selected':''}>${esc(name)}</option>`).join('')}</select><div class="smallnote">${descriptions[key]}</div></div>`).join('')}<div class="sectiontitle">REALM STABILITY</div><div class="statlist"><label>Current stability</label><strong>${fmt(f.stability)}%</strong><label>Royal legitimacy</label><strong>${fmt(f.legitimacy)}%</strong></div>`;
 }else if(tab==='diplomacy'){
  const nations=liveWorld.factions.filter(q=>q.id!==game.player).sort((a,b)=>a.name.localeCompare(b.name));if(diplomaticTarget===game.player)diplomaticTarget=nations[0].id;
  const other=game.factions[diplomaticTarget]||game.factions.france,rel=f.relations[other.id]||0;
  const aT=allianceTerms(game,game.player,other.id,liveWorld),nT=nonAggressionTerms(game,game.player,other.id,liveWorld);
  html=`<div class="label">FOREIGN AFFAIRS</div><div class="sectiontitle">SEND ENVOYS</div><select class="select" id="diplomatic-select">${nations.map(n=>`<option value="${n.id}" ${n.id===diplomaticTarget?'selected':''}>${esc(n.name)}</option>`).join('')}</select><div class="rule"><div class="label">FOREIGN POWER</div><h3 style="font-size:14px;margin:9px 0">${esc(other.name)}</h3><div class="statlist"><label>Relationship</label><strong class="${rel>0?'up':rel<0?'down':''}">${rel>0?'+':''}${rel}</strong><label>Political relationship</label><strong>${unionPartners(game,game.player,other.id)?'PERSONAL UNION':f.treaties[other.id]==='alliance'?'ALLIED':f.treaties[other.id]==='marriage'?'DYNASTIC TIE':f.treaties[other.id]==='non_aggression'?'NON-AGGRESSION PACT':'NONE'}</strong><label>State form</label><strong>${esc(other.government)}</strong></div></div><div class="sectiontitle">ROYAL DIPLOMATIC ACTIONS</div><button class="rowbtn" data-action="gift">✦ Send gift (250 gold)</button><button class="rowbtn" data-action="alliance">⚜ Propose alliance (${aT.accepted?'WILL ACCEPT ':'REFUSES '}${aT.score}/${aT.threshold})</button><button class="rowbtn" data-action="diplomatic-agreement" data-type="pact" data-id="${esc(other.id)}">◈ Propose non-aggression (${nT.accepted?'WILL ACCEPT ':'REFUSES '}${nT.score}/${nT.threshold})</button><button class="rowbtn" data-action="trade">◈ Establish merchant treaty (140 gold, relation +10)</button><p class="smallnote">Alliances evaluate opinion, relative strength, faith, threat, treaties &amp; borders.</p><button class="rowbtn negative" data-action="insult">⚑ Issue formal insult</button><p class="paragraph" style="margin-top:13px">Relations support merchant treaties, non-aggression pacts, alliances, and dynastic marriages.</p>`;
 if(unionPartners(game,game.player,other.id))html+='<div class="rule"><h3>United crowns</h3><p>One sovereign, separate armies and treasuries.</p>'+contextualButton('politics','union-switch',other.id,'Administer '+other.name,esc)+sectionLink('dynasty','Review crown succession',esc)+'</div>';else if(!personalUnion(game,game.player)&&!unionTerms(game,game.player,other.id))html+=contextualButton('politics','union-form',other.id,'Recognize united crowns (300 gold)',esc);const sovereign=game.politics?.people?.[game.politics?.realms?.[other.id]?.ruler],matches=marriageCandidates(game,game.player).filter(m=>m.realm===other.id);html+=renderPreWarComparison(game,liveWorld,other.id,esc)+'<div class="rule"><b>Foreign sovereign</b><p>'+characterLink(sovereign,esc)+'</p>'+(matches.length?'<details><summary>Choose a dynastic marriage</summary>'+matches.slice(0,30).map(m=>contextualButton('politics','marry',m.a,m.label+' (180g)',esc,m.b)).join('')+'</details>':'<p class="smallnote">No eligible dynastic match.</p>')+'</div>'+renderDiplomaticAgreements(game,other.id,esc,liveWorld);const wars=realmWarContext(game,other.id);if(wars.length)html+='<div class="rule"><b>Active wars with this realm</b>'+wars.map(w=>'<p class="smallnote">War score '+w.ourScore+'</p>').join('')+sectionLink('political','Negotiate peace',esc,'WARS AND PEACE')+'</div>';else html+=sectionLink('political','Territorial claims and formal war',esc,'TERRITORIAL CLAIMS');
 }else if(tab==='characters'){html=renderCharacterDirectory(game,esc,directoryState);
 }else if(tab==='dynasty'){html=renderDynasty(game,esc);
 }else if(tab==='council'){html=renderCouncilDirectory(game,esc,liveWorld);
 }else if(tab==='vassals'){html=renderVassalDirectory(game,liveWorld,esc,vassalSort);
 }else if(tab==='court'){
  html=renderCourt(game,esc);
 }else if(tab==='political'){html=renderConflict(game,liveWorld,esc);
 }else if(tab==='society'){html=renderCivic(game,liveWorld,esc);
 }else if(tab==='heritage'){html=renderHeritage(game,liveWorld,esc);
 }else if(tab==='economy'){html=renderEconomy(game,liveWorld,esc);
 }else if(tab==='military'){html=renderMilitary(game,liveWorld,esc);
 }else if(tab==='naval'){html=renderNaval(game,liveWorld,esc);
 }else if(tab==='strategy'){html=renderStrategy(game,liveWorld,esc);
 }else if(tab==='stories'){html=renderStories(game,liveWorld,esc);
 }else if(tab==='titles'){html=renderFeudal(game,liveWorld,esc);
 }else if(tab==='identity'){html=renderIdentity(game,liveWorld,esc);
 }else if(tab==='trade'){
  html=renderTrade(game,liveWorld,esc);
 }else if(tab==='legacy'){
  html=renderLegacy(game,esc);
 }else if(tab==='chronicle'){
  html=`<div class="label">THE ROYAL CHRONICLE</div><div class="sectiontitle">COURT RECORDS</div>${game.log.map(l=>`<div class="rule"><div class="label">${esc(l.date)}</div><div class="smallnote">${esc(l.text)}</div></div>`).join('')}`;
 }
 el('tab-content').innerHTML=html;
}
function renderInspector(){if(!game)return;if(vassalCareer(game)){el('province-panel').innerHTML=renderCareerProvince(game,campaignWorld(game,world),selected,esc);return;}let p=staticById[selected],state=game.provinces[selected];if(!p||!state){el('province-panel').innerHTML='<div class="emptyselection"><div class="emptycrest">♜</div><h2>THE KING\'S ATLAS</h2><p>Select any province to inspect its holdings.</p></div>';return;}
 const own=state.owner===game.player&&controller(game,selected)===game.player,owner=game.factions[state.owner],a=armiesAt(game,selected,state.owner),yourArmies=armiesAt(game,selected,game.player).filter(a=>armySize(a)>0).sort((a,b)=>armySize(b)-armySize(a)),yourArmy=yourArmies[0],localTroops=yourArmies.reduce((n,a)=>n+armySize(a),0);const total=a.reduce((s,q)=>s+armySize(q),0);
 let text=`<div class="inspector"><span class="eyebrow">PROVINCE CHANCERY · ${esc(p.continent.toUpperCase())}</span><h2>${esc(displayProvince(p))}</h2>${renderPinButton(game,'province',selected,esc)}<button class="rowbtn" data-quick-province="${esc(selected)}">Quick actions ▾</button><div class="owner"><span class="swatch" style="background:${esc(owner?.color||'#667670')}"></span>${esc(owner?.name||'Independent Polities')} ${own?'<span style="color:#e4ca83"> · YOUR REALM</span>':''}</div><div class="province-hero">${p.terrain==='forest'?'♣':p.terrain==='highlands'?'▲':'♜'}<span>${esc(p.terrain.toUpperCase())} · ${p.centroid[0].toFixed(1)}°, ${p.centroid[1].toFixed(1)}°</span></div><div class="province-facts"><div class="fact" data-tooltip="Provincial population drives tax and levies"><label>POPULATION</label><b>${fmt(state.population)}k</b></div><div class="fact" data-tooltip="Development boosts local output and garrison"><label>DEVELOPMENT</label><b>LV. ${fmt(state.development)}</b></div><div class="fact" data-tooltip="High unrest risks local revolt and factions"><label>UNREST</label><b style="color:${state.unrest>55?'#e1a194':'#aed2af'}">${fmt(state.unrest)}%</b></div><div class="fact" data-tooltip="Stationed regiments plus fort garrison"><label>GARRISON & ARMY</label><b>${fmt(total||45+state.development*12)}</b></div></div>`;
 const guests=fieldContingentsAt(game,game.player,selected);
 if(guests.length)text+='<div class="rule"><b>Allied contingents</b>'+guests.map(a=>'<p class="smallnote">'+esc(ownerName(game,a.owner))+' · '+fmt(armySize(a))+' troops</p>').join('')+'</div>';
 const occupied=occupation(game,selected);if(occupied)text+='<div class="rule"><b>OCCUPIED BY '+esc(ownerName(game,occupied.by))+'</b><p class="paragraph">Legal ownership remains with '+esc(ownerName(game,state.owner))+'.</p>'+(occupied.by===game.player&&yourArmy?'<button class="rowbtn" data-action="march">March from occupied territory</button>':'')+'</div>';if(game.naval?.ports[selected])text+='<div class="rule"><b>PORT '+(portBlocked(game,selected)?'· BLOCKADED':'')+'</b></div>';
 text+='<details class="province-section" data-section="lord"><summary>Local lord & vassal contract</summary>'+renderProvinceLord(game,world,selected,esc)+'</details><details class="province-section" data-section="connections"><summary>Economy, titles & claims</summary>'+renderProvinceConnections(game,world,selected,esc)+'</details>';const local=game.civic?.provinces[selected];
 if(own){const recruitButtons=['infantry','archers','cavalry'].map(t=>{const q=recruitmentQuote(game,selected,t);return '<button data-action="recruit" data-type="'+t+'" '+(player().treasury<q.cost?'disabled':'')+'>'+t.charAt(0).toUpperCase()+t.slice(1)+'<small>'+fmt(q.count)+' troops · '+fmt(q.cost)+' gold</small></button>';}).join('');
 text+=`<p class="paragraph">${yourArmy?`${fmt(localTroops)} troops stationed here · ${yourArmies.length} armies. All local troops march together.`:'No army stationed here.'}</p><button class="btnblock" data-action="march" ${!yourArmy||localTroops<20?'disabled':''}>Move or attack</button>${yourArmy?'<details class="province-section" data-section="command" open><summary>Army & commander</summary>'+yourArmies.map(a=>'<div class="rule"><b>'+fmt(armySize(a))+' troops</b>'+renderArmyCommand(game,a,esc,'province')+'</div>').join('')+'</details>':''}<details class="province-section" data-section="recruit"><summary>Recruit troops</summary><div class="building-grid">${recruitButtons}</div></details><details class="province-section" data-section="build"><summary>Improve province</summary><div class="building-grid">${Object.entries(BUILDINGS).map(([kind,b])=>{const level=state.buildings[kind],cost=Math.round(b.cost*(level+1)*civicModifiers(game,game.player).build*economyModifiers(game,game.player).cost);return '<button data-action="build" data-type="'+kind+'" '+(level>=3||player().treasury<cost?'disabled':'')+'>'+esc(b.icon)+' '+esc(b.name)+'<small>Level '+level+' / 3 · '+(level>=3?'Complete':fmt(cost)+' gold')+'</small></button>';}).join('')}</div></details>`;
 }else{
  text+='<div class="sectiontitle">FOREIGN TERRITORY</div>';
  if(mayEnterWithAccess(game,game.player,selected)){
   text+='<p class="paragraph">Military passage is active. This district can be crossed with a field army.</p>';
   if(yourArmy)text+='<button class="btnblock" data-action="march" '+(localTroops<20?'disabled':'')+'>Continue march · '+fmt(localTroops)+' troops</button>';
  }
  text+='<button class="btnblock secondary" data-action="show-diplomacy" data-target="'+esc(state.owner)+'">✦ DIPLOMATIC OPTIONS</button>';
 }
 text+=`<details class="province-section" data-section="details"><summary>Province details</summary>${local?'<div class="rule"><b>'+esc(local.culture)+'</b><p class="paragraph">'+esc(local.faith)+' · '+fmt(local.acceptance)+'% acceptance</p></div>':''}<div class="sectiontitle">ADJACENT PROVINCES</div><p class="paragraph">${p.neighbors.length} connected land provinces. ${p.neighbors.filter(n=>game.provinces[n].owner!==state.owner).length} under foreign control.${p.landComponentSize===1?' No land route: use an available naval route where possible.':p.landComponentSize?' Land network: '+p.landComponentSize+' districts.':''}</p><div class="divider"></div><p class="paragraph">${p.ownershipSource?`Starting ownership: ${esc(p.ownershipSource)}.${p.historicalPolity?' Reference polity: '+esc(p.historicalPolity)+'.':''}${p.referenceInherited?' Inherited from the parent gameplay district.':''}${Number.isFinite(p.referenceSamples)&&p.referenceSamples>0&&p.historicalPolity?' Sample agreement: '+p.referenceMatches+'/'+p.referenceSamples+' points.':''} `:''}${p.nameSource?' Geographic name, not a historical county title.':''} Gameplay districts are approximate, not verified historical counties.</p></details></div>`;
 const panel=el('province-panel'),sameProvince=panel.dataset.province===selected,hadCommand=!!panel.querySelector('[data-section="command"]'),open=sameProvince?[...panel.querySelectorAll('details[open]')].map(d=>d.dataset.section):[];panel.dataset.province=selected;panel.innerHTML=text;for(const d of panel.querySelectorAll('details'))d.open=open.includes(d.dataset.section)||d.dataset.section==='command'&&(!sameProvince||!hadCommand);
}
let battleSound=true;try{battleSound=localStorage.getItem('crown-of-nations.battle-sound')!=='off';}catch{}
let campaignSound=battleSound;try{if(localStorage.getItem('crown-of-nations.campaign-sound')==='off')campaignSound=false;}catch{}
browserCampaignAudio.setMuted(!campaignSound);
function syncCampaignSoundButton(){const btn=el('campaign-sound');if(btn){btn.setAttribute('aria-pressed',String(campaignSound));btn.textContent=campaignSound?'♫':'🔇';}}
function syncAudioState(){
 syncCampaignSoundButton();
 if(!campaignSound){browserCampaignAudio.setMode('silent');return;}
 if(!game){browserCampaignAudio.setMode('menu');return;}
 if(battle){browserCampaignAudio.setMode('silent');return;}
 const f=player();
 if(f?.atWarWith?.length||game.kingdom?.threats?.length)browserCampaignAudio.setMode('war');
 else if((f?.stability??100)<40||Object.values(game.conflict?.factions||{}).some(x=>x.realm===game.player&&x.status==='civil war'))browserCampaignAudio.setMode('crisis');
 else browserCampaignAudio.setMode('peace');
}
syncAudioState();
const unlockAudioOnce=()=>{browserCampaignAudio.unlock();syncAudioState();};
window.addEventListener('pointerdown',unlockAudioOnce,{once:true});
window.addEventListener('keydown',unlockAudioOnce,{once:true});
const deferredModalEvents=new Set();
function effectChips(obj,cost=0){
 const chips=[];
 if(cost>0)chips.push({label:'Treasury',delta:-cost});
 if(obj&&typeof obj==='object'){
  for(const [k,v] of Object.entries(obj)){
   if(['label','cost','next','wedding'].includes(k)||typeof v!=='number'||v===0)continue;
   chips.push({label:k.replace(/([A-Z])/g,' $1'),delta:v});
  }
  if(obj.wedding)chips.push({label:'Royal Marriage',delta:1,text:'Wedding'});
 }
 return chips;
}
function collectEventPrompts(){
 if(!game||battle||vassalCareer(game))return [];
 const out=[],liveWorld=campaignWorld(game,world);
 const r=currentRoyalEvent(game);
 if(r)out.push({key:'royal:'+r.id+':'+r.created,badge:'ROYAL EVENT',title:r.title,desc:r.description,imgKey:r.id,choices:r.choices.map((c,i)=>({label:c.label,kind:'royal',id:String(i),chips:effectChips(c,c.cost||0),ready:player().treasury>=(c.cost||0)}))});
 const em=currentEmergentEvent(game);
 if(em)out.push({key:'emergent:'+em.id,badge:em.category||'EMERGENT EVENT',title:em.title,desc:em.description,imgKey:em.id,choices:(em.choices||[]).map((c,i)=>({label:c.label+(c.cost?' ('+c.cost+'g)':''),kind:'emergent',id:em.id+':'+i,chips:effectChips(c.effects,c.cost||0),ready:player().treasury>=(c.cost||0)}))});
 for(const x of currentExpandedEvents(game,game.player)){
  if(game.turn<(x.availableAt??x.started))continue;
  out.push({key:'expanded:'+x.id+':'+x.started,badge:x.category||'REALM EVENT',title:x.title,desc:x.description,imgKey:x.id,actor:x.target?.person||x.target?.actor,choices:(x.choices||[]).map((c,i)=>({label:c.label+(c.cost?' ('+c.cost+'g)':''),kind:'expanded',id:x.id+':'+i,chips:effectChips(c.effects,c.cost||0),ready:player().treasury>=(c.cost||0)}))});
 }
 const ce=civicEvent(game);
 if(ce)out.push({key:'civic:'+ce.id,badge:'SOCIETY DISPATCH',title:ce.title,desc:ce.description,imgKey:ce.id,choices:(ce.choices||[]).map((c,i)=>({label:c.label+(c.cost?' ('+c.cost+'g)':''),kind:'civic',id:String(i),chips:effectChips(c,c.cost||0),ready:player().treasury>=(c.cost||0)}))});
 const pd=politicalDispatch(game);
 if(pd)out.push({key:'dispatch:'+pd.title,badge:'COUNCIL DISPATCH',title:pd.title,desc:pd.description,imgKey:'dispatch',choices:(pd.choices||[]).map((c,i)=>({label:c.label+(c.cost?' ('+c.cost+'g)':''),kind:'dispatch',id:String(i),chips:effectChips(c,c.cost||0),ready:player().treasury>=(c.cost||0)}))});
 const inc=activityIncident(game);
 if(inc)out.push({key:'incident:'+inc.title,badge:'ROYAL JOURNEY',title:inc.title,desc:inc.desc,imgKey:'pilgrimage',choices:(inc.choices||[]).map((ch,i)=>({label:ch[0]+(ch[1]?' ('+ch[1]+'g)':''),kind:'incident',id:String(i),chips:ch[1]?[{label:'Treasury',delta:-ch[1]}]:[],ready:player().treasury>=(ch[1]||0)}))});
 const ch=currentChain(game);
 if(ch&&game.turn>=ch.due)out.push({key:'chain:'+ch.id+':'+ch.stage,badge:ch.name+' · '+(ch.stage+1)+'/'+ch.stageCount,title:ch.title,desc:ch.desc,imgKey:ch.id,actor:ch.target,choices:(ch.choices||[]).map((c,i)=>({label:c[0]+(c[1]?' ('+c[1]+'g)':''),kind:'chain',id:String(i),chips:c[1]?[{label:'Treasury',delta:-c[1]}]:[],ready:player().treasury>=(c[1]||0)}))});
 void liveWorld;
 return out;
}
function closeEventModal(){const m=el('event-modal');if(m){m.hidden=true;m.innerHTML='';}}
function renderEventModal(evt){
 const m=el('event-modal');if(!m||!evt){closeEventModal();return;}
 el('toast')?.classList.remove('visible');
 const actor=evt.actor&&game?.politics?.people?.[evt.actor];
 const mark=actor?portraitMark(actor):null;
 m.innerHTML='<div class="event-card"><div class="event-modal-head"><span class="event-badge">'+esc(evt.badge)+'</span><span class="event-date">'+esc(MONTHS[game.month].toUpperCase())+' '+game.year+'</span><button type="button" id="event-modal-defer" class="smallbtn" aria-label="Defer event to court">Later ×</button></div>'
  +eventImage(evt.imgKey||evt.title,game.player)
  +'<h2 id="event-modal-title">'+esc(evt.title)+'</h2>'
  +(actor?'<div class="event-actors"><span class="portrait-mark" style="background:'+mark.color+'">'+(portraitImage(actor)||esc(mark.initials))+'</span><div><strong>'+esc(actor.name)+'</strong><small>'+esc(actor.house||'')+' · Age '+actor.age+'</small></div></div>':'')
  +'<p class="event-body">'+esc(evt.desc)+'</p>'
  +'<div class="event-choices">'+evt.choices.map((ch,idx)=>'<button type="button" class="event-choice-btn" data-modal-choice="'+idx+'" data-modal-kind="'+esc(ch.kind)+'" data-modal-id="'+esc(ch.id)+'"'+(ch.ready?'':' disabled')+'><b>'+esc(ch.label)+'</b><span class="event-effects">'+ch.chips.map(cp=>'<span class="event-effect-chip '+(cp.delta>0?'pos':cp.delta<0?'neg':'')+'">'+esc(cp.text||(cp.label+' '+(cp.delta>0?'+':'')+Math.round(cp.delta)))+'</span>').join('')+'</span></button>').join('')+'</div>'
  +'<div class="event-modal-foot">Campaign paused until resolved or deferred.</div></div>';
 m._eventKey=evt.key;
 m.hidden=false;
 browserCampaignAudio.playSfx('chime');
}
function maybePopupEventModal(prevKeys=new Set()){
 if(!game||battle||vassalCareer(game))return;
 const active=collectEventPrompts();
 if(!el('event-modal').hidden)return;
 const urgent=active.find(e=>!deferredModalEvents.has(e.key)&&!prevKeys.has(e.key)&&e.badge==='Succession');
 const fresh=urgent||((game.turn-(game.kingdom.lastEventPopupTurn??-6)>=6)&&active.find(e=>!deferredModalEvents.has(e.key)&&!prevKeys.has(e.key)&&game.turn>=2));
 if(!fresh)return;
 if(speedInterval){clearInterval(speedInterval);speedInterval=null;el('auto-time').textContent='▶';}
 game.kingdom.lastEventPopupTurn=game.turn;
 renderEventModal(fresh);
 save(false);
}
function start(id){pageHistory.reset();characterId=null;tab='realm';deferredModalEvents.clear();closeEventModal();useWorld(atlasWorld);game=createGame(world,id);game.kingdom.difficulty=el('start-difficulty').value;el('start-screen').hidden=true;selected=capitalDistrict(world,id)?.id||null;map.setGame(game);if(selected)map.select(selected);const f=player();map.focus(...(staticById[selected]?.centroid||f.capital),3.2);browserCampaignAudio.unlock();browserCampaignAudio.playSfx('seal');render();save(false);syncAudioState();}
function updateSoundButton(){const b=el('battle-sound');b.setAttribute('aria-pressed',String(battleSound));b.textContent=battleSound?'Sound on':'Sound off';}
function openBattle(desc){setDrawer(null);closeEventModal();desc.soundEnabled=battleSound;updateSoundButton();desc.interactive=true;desc.fieldBattle=true;desc.simpleField=true;desc.bannerView=true;el('battle-screen').hidden=false;el('battle-result').hidden=true;
 el('battle-move-tap').setAttribute('aria-pressed','false');el('battle-camera').value='overview';el('battle-camera').hidden=true;el('battle-zoom-in').hidden=true;el('battle-zoom-out').hidden=true;if(el('battle-speed'))el('battle-speed').textContent='1×';if(el('battle-rally')){el('battle-rally').disabled=true;el('battle-rally').textContent='⚑ RALLY';}
 el('battle-title').textContent=desc.showcase?'BATTLE SHOWCASE · FIELD BATTLE':desc.defenseMode?'DEFEND '+desc.to.toUpperCase():'ASSAULT '+desc.to.toUpperCase();
 el('battle-meta').textContent=desc.showcase?'PRACTICE BATTLE · NO EFFECT ON CAMPAIGN':`${player().name.toUpperCase()} VS ${ownerName(game,desc.enemy).toUpperCase()} · ${desc.defenseMode?'DEFENSIVE BATTLE':'FIELD BATTLE'}`;
 if(desc.alliedTroops)el('battle-meta').textContent+=' · '+fmt(desc.alliedTroops)+' ALLIED TROOPS';
 el('battle-units').dataset.deckKey='';battleDescriptor=desc;try{battle=new BattleGame(freshBattleCanvas(el('battle-canvas')),desc,game,onBattleFinished,onBattleStatus,{overlayCanvas:el('battle-overlay')});document.body.style.overflow='hidden';syncAudioState();return true;}catch(e){battleDescriptor=null;el('battle-screen').hidden=true;syncAudioState();message(`Battle couldn't start: ${e.message}`);return false;}}
function onBattleStatus(status){
 const roster=status.roster;if(roster){const a=roster.attacker,b=roster.defender;el('battle-strength').textContent='YOUR FORCE '+fmt(a.surviving)+' / '+fmt(a.initial)+' · ENEMY '+fmt(b.surviving)+' / '+fmt(b.initial)+(status.enemyPosture?' · '+status.enemyPosture.toUpperCase():'');}
 el('battle-move-tap').setAttribute('aria-pressed',String(!!status.tapMove));el('battle-pause').textContent=status.paused?'▶ RESUME':'Ⅱ PAUSE';el('battle-pause').disabled=!!status.renderLost;el('battle-start').disabled=!!status.renderLost;el('battle-strength').dataset.renderer=status.rendererMode||'';if(status.renderLost)el('battle-strength').textContent='Graphics context lost. Use Cancel deployment or retreat to return to campaign.';
 const spd=el('battle-speed');if(spd)spd.textContent=(status.battleSpeed||1)+'×';
 const rBtn=el('battle-rally');if(rBtn){const cd=Math.ceil(status.rallyCooldown||0);rBtn.disabled=!!status.deployment||cd>0;rBtn.textContent=cd>0?'⚑ '+cd+'s':'⚑ RALLY';}
 const ours=status.groups.filter(g=>g.side==='attacker'),unit=ours[status.selected];
 const focusEl=el('battle-focus');if(focusEl){focusEl.hidden=!unit;if(unit){const flags=(unit.statusFlags||[]).join(' · ');focusEl.textContent=(unit.profile?.name||unit.type).toUpperCase()+' · '+cardRoleHint(unit)+(flags?' · '+flags:'');}}
 const cards=el('battle-units'),deckKey=ours.map(g=>g.id+':'+g.troopCount+':'+g.specialistId).join('|');
 if(cards.dataset.deckKey!==deckKey||!cards.children.length){cards.dataset.deckKey=deckKey;cards.innerHTML=ours.map((g,i)=>'<button class="unitcard" data-unit="'+i+'"><span class="regiment-icon">'+regimentCardIcon(g)+'</span><span class="regiment-count"></span><b>'+esc(g.profile?.name||g.type)+'</b><small class="regiment-status"></small><span class="unithealth"><span></span></span></button>').join('');}
 for(let i=0;i<ours.length;i++){const g=ours[i],b=cards.children[i];b.classList.toggle('active',i===status.selected);b.classList.toggle('reserve',!!g.reserve);b.disabled=!!g.routed||(!status.deployment&&!g.reserve);b.setAttribute('aria-pressed',String(i===status.selected));b.querySelector('.regiment-count').textContent=fmt(Math.round(g.troopCount*g.life/100));b.querySelector('.regiment-status').textContent=g.routed?'Routed':g.reserve?'Reserve · tap to deploy':status.deployment?(g.formationId||'line').replaceAll('_',' '):'Fighting';b.querySelector('.unithealth span').style.width=Math.max(0,g.life)+'%';}
 const reserves=el('battle-reserve');reserves.hidden=!status.deployment;reserves.disabled=!unit||!!unit.routed||(!unit.reserve&&status.reserveCount>=Math.min(3,ours.length-1));reserves.textContent=unit?.reserve?'Return to line':'Hold in reserve';
 const timer=el('battle-timer');timer.textContent=status.deployment?'DEPLOY YOUR ARMY':Math.max(0,100-Math.floor(status.elapsed))+'s LEFT';
 if(roster){for(const [side,r] of [['your',roster.attacker],['enemy',roster.defender]]){el('battle-'+side+'-count').textContent=fmt(r.surviving)+' / '+fmt(r.initial);el('battle-'+side+'-bar').style.width=(r.initial?Math.round(r.surviving/r.initial*100):0)+'%';}}
 const choices=unit?cardFormationChoices(unit,availableFormations(game.factions[game.player],true)):[];
 const formations=el('battle-formation');const choiceKey=choices.map(o=>o.id).join(',');if(formations.dataset.choices!==choiceKey){formations.dataset.choices=choiceKey;formations.innerHTML=choices.map(o=>'<option value="'+o.id+'">'+esc(o.name)+'</option>').join('');}
 if(unit&&document.activeElement!==formations)formations.value=unit.formationId;el('battle-order').title=unit?(unit.terrainName||'Open field')+' · Enemy posture: '+(status.enemyPosture||'Deploying'):'Regiment order';const order=el('battle-order');if(unit&&document.activeElement!==order&&unit.fieldOrder!=='move'&&[...order.options].some(o=>o.value===unit.fieldOrder))order.value=unit.fieldOrder;
 const fort=el('battle-fort-status');if(fort){fort.hidden=!status.siege;fort.textContent=status.siege?status.siege.structures.map(q=>q.name+' '+Math.round(q.hp/q.max*100)+'%').join(' · '):'';}
 el('battle-presets').hidden=!status.deployment;formations.hidden=!status.deployment;el('battle-formation-label').hidden=!status.deployment;el('battle-retreat').hidden=status.deployment;el('battle-pause').hidden=status.deployment;el('battle-speed').hidden=status.deployment;el('battle-rally').hidden=true;el('battle-guide').textContent=status.deployment?'Pick a card, tap the field to place it. Hold up to 3 cards in reserve.':status.reserveCount?'Tap a reserve card, then your deployment zone. Reserves join automatically after 12s.':'Your army fights automatically.';
 el('battle-lanes').hidden=true;el('battle-start').hidden=!status.deployment;el('battle-cancel').hidden=!status.deployment||!!battleDescriptor?.defenseMode&&!status.renderLost;const comparison=el('battle-comparison');comparison.hidden=true;if(status.deployment){const c=battleComparison(status.groups),line=(s,name)=>'<div><b>'+name+' · '+fmt(s.troops)+'</b><small>Inf '+fmt(s.mix.infantry)+' / Arch '+fmt(s.mix.archers)+' / Cav '+fmt(s.mix.cavalry)+' · Morale '+fmt(s.morale)+'% · Readiness '+fmt(s.power*100)+'%</small></div>';comparison.innerHTML=line(c.attacker,'Your force')+line(c.defender,'Enemy force')+'<small>Numerical ratio '+(c.ratio===null?'No opposing soldiers':c.ratio.toFixed(1)+':1')+' · Troop counters, formations and readiness affect outcomes.</small>';}
}
function onBattleFinished(result){
 const defense=!!battleDescriptor?.defenseMode,practice=!!battleDescriptor?.showcase,win=result.victory;
 el('battle-result').hidden=false;
 const title=result.reason==='deadlock'?'STALEMATE · '+(win?'DEFENDERS HOLD':'ATTACKERS WITHDRAW'):defense?(win?'THE INVADERS WERE REPELLED':'THE DEFENDERS WERE DEFEATED'):(win?'GLORIOUS VICTORY':'THE ARMY WITHDRAWS');
 const explanation=practice?'Practice battle; your campaign will not be changed.':
   defense?(win?'Your army held the field.':'Your defensive position has been overrun.'):
   win?(activeWar(game,game.player,battleDescriptor.enemy)?'The province will be occupied pending peace.':'The enemy province will be taken.'):'Your army has retreated.';
 const roster=result.roster,report=roster?'<div class="battle-report"><div><b>YOUR FIELD FORCE</b><small>Deployed '+fmt(roster.attacker.initial)+' · Surviving '+fmt(roster.attacker.surviving)+' · Losses '+fmt(roster.attacker.losses)+' · Routed survivors '+fmt(roster.attacker.routed)+'</small></div><div><b>ENEMY FIELD FORCE</b><small>Deployed '+fmt(roster.defender.initial)+' · Surviving '+fmt(roster.defender.surviving)+' · Losses '+fmt(roster.defender.losses)+' · Routed survivors '+fmt(roster.defender.routed)+'</small></div><small>Battlefield estimates include participating garrisons; campaign outcomes may differ.</small></div>':'';
 el('battle-result').innerHTML='<div class="resultcard"><div class="small-ornament">THE CHRONICLERS REPORT</div><div class="hero-crest">'+(win?'♛':'⚔')+'</div><h2>'+title+'</h2><p>'+explanation+' Remaining strength: '+Math.round(result.attackerRemaining*100)+'%. Battle duration: '+result.seconds+' seconds.'+(result.reason?' · '+esc(result.reason):'')+'</p>'+report+'<button id="battle-return" class="goldbtn primary">RETURN TO CAMPAIGN ›</button></div>';
 el('battle-return').onclick=()=>{
  if(!battle)return;el('battle-return').disabled=true;
  if(!practice){
   if(defense){const r=resolveInvasion(game,world,battleDescriptor.threat,result);if(!r.ok)message(r.msg);}
   else {const r=concludeBattle(game,battleDescriptor,result,world);if(r&&!r.ok)message(r.msg);}
  }
  battle.stop();battle=null;battleDescriptor=null;el('battle-screen').hidden=true;
  document.body.style.overflow='';render();syncAudioState();if(!practice)save();
 };
}
function openIncomingBattle(){
 if(vassalCareer(game))return false;
 const threat=game?.kingdom?.threats?.find(t=>t.status==='ready');
 if(!threat||battle||!validReadyInvasion(game,world,threat))return false;
 const stationed=armiesAt(game,threat.province,game.player),guests=fieldContingentsAt(game,game.player,threat.province,threat.by);
 const defenders=[...stationed,...guests],defense=game.provinces[threat.province];
 const enemyArmy=game.armies[threat.army];if(!enemyArmy)return false;
 const garrison=45+defense.development*12+(defense.buildings.fort||0)*45;
 const opposingContingents=fieldContingentsAt(game,threat.by,enemyArmy.province,game.player),invaders=[...nativeInvasionArmies(game,threat),...opposingContingents];
 return openBattle({defenseMode:true,attacker:stationed[0]?.id||null,playerArmies:defenders.map(a=>a.id),alliedTroops:guests.reduce((n,a)=>n+armySize(a),0),
  enemyArmy:threat.army,enemyArmies:invaders.map(a=>a.id),enemy:threat.by,from:enemyArmy.province,
  to:threat.province,defenseTroops:invaders.reduce((n,a)=>n+armySize(a),0),defenseGarrison:garrison+defenseSupport(game,game.player,threat.by),
  threat:{army:threat.army,province:threat.province}});
}
function advanceWithInvasions(){
 if(!game||battle)return;
 if(vassalCareer(game)){const threat=game.kingdom?.threats?.find(t=>t.status==='ready');if(threat)autoResolveInvasion(game,world,threat);advanceMonth(game,world);render();syncAudioState();save(false);return;}
 if(openIncomingBattle())return;
 const prevKeys=new Set(collectEventPrompts().map(e=>e.key));
 advanceMonth(game,world);render();syncAudioState();save(false);
 if(openIncomingBattle()){if(speedInterval){clearInterval(speedInterval);speedInterval=null;el('auto-time').textContent='▶';}return;}
 maybePopupEventModal(prevKeys);
}
// Bind controls once. Rebuilt content uses delegated events.
el('start-world-count').textContent=atlasWorld.factions.length+' REALMS · '+atlasWorld.provinces.length+' DISTRICTS';
function renderStartFaction(){const f=atlasWorld.factions.find(f=>f.id===el('start-faction').value);el('start-new').disabled=!f;if(!f){el('start-faction-info').textContent='No matching kingdoms. Try another name or region.';return;}const d=militaryDoctrine(f),count=atlasWorld.provinces.filter(p=>p.owner===f.id).length;const history=historicalContext(f.id);el('start-faction-info').innerHTML=assetImage(realmArt(f.id),'realm-emblem start-emblem')+esc(f.continent+' · '+count+' districts · '+d.name+(history?' · '+history.context:''));}
function filterStartRealms(preferred=el('start-faction').value){const list=searchRealms(atlasWorld.factions,el('realm-search').value);el('start-faction').innerHTML=list.map(f=>`<option value="${esc(f.id)}">${esc(f.name)} — ${esc(f.continent)}</option>`).join('');if(list.some(f=>f.id===preferred))el('start-faction').value=preferred;renderStartFaction();}
el('realm-search').addEventListener('input',()=>filterStartRealms());el('start-faction').addEventListener('change',renderStartFaction);filterStartRealms('ottomans');
el('start-new').addEventListener('click',()=>{if(atlasWorld.factions.some(f=>f.id===el('start-faction').value))start(el('start-faction').value);});
try{if(localStorage.getItem('crown-of-nations.save'))el('load-existing').hidden=false;}catch{}
el('load-existing').addEventListener('click',load);
el('import-save').addEventListener('click',()=>el('save-file').click());
el('save-file').addEventListener('change',async e=>{const f=e.target.files?.[0];e.target.value='';if(!f)return;try{if(f.size>MAX_SAVE_BYTES)throw Error('Save exceeds 20 MB.');loadRaw(await f.text(),true);}catch(err){el('import-status').textContent='Could not import: '+err.message;message('Could not import: '+err.message);}});
el('export-save').addEventListener('click',exportSave);
el('save-game').addEventListener('click',save);
function restorePage(entry){tab=entry.tab;if(entry.character&&game?.politics?.people?.[entry.character])openCharacter(entry.character,false);else navigateTab(entry.tab,entry.section,false);}
el('nav-back').addEventListener('click',()=>restorePage(pageHistory.back()));el('nav-forward').addEventListener('click',()=>restorePage(pageHistory.forward()));
el('game-speed').addEventListener('change',()=>{if(speedInterval){clearInterval(speedInterval);speedInterval=setInterval(()=>{if(!game||battle)return;advanceWithInvasions();},speedDelay(el('game-speed').value));}});
el('next-month').addEventListener('click',advanceWithInvasions);
el('auto-time').addEventListener('click',()=>{if(speedInterval){clearInterval(speedInterval);speedInterval=null;el('auto-time').textContent='▶';message('Time paused');}else{speedInterval=setInterval(()=>{if(!game||battle)return;advanceWithInvasions();},speedDelay(el('game-speed').value));el('auto-time').textContent='Ⅱ';message('Time is running');}});
el('focus-capital').addEventListener('click',()=>{if(game){const seat=capitalDistrict(world,game.player,game.provinces);if(seat){selected=seat.id;map.select(selected);map.focus(...staticById[selected].centroid,3.2);renderInspector();}}});
el('reset-map').addEventListener('click',()=>{map.panX=0;map.panY=0;map.zoom=1.02;map.render();});
el('old-world').addEventListener('click',()=>map.focusOldWorld());
el('atlas-expand').addEventListener('click',()=>{
 setDrawer(null);el('atlas-expand').closest('details')?.removeAttribute('open');map.resize();
});
el('toggle-relief').addEventListener('click',()=>{map.setRelief(!map.useRelief);el('toggle-relief').textContent=map.useRelief?'◈ 3D ON':'▤ 3D OFF';el('toggle-relief').setAttribute('aria-pressed',String(map.useRelief));});
el('map-modes').addEventListener('click',e=>{const button=e.target.closest('[data-mapmode]');if(!button)return;const mode=button.dataset.mapmode;map.setMode(mode);el('mapmode').textContent=mode==='historical'?'1450 REFERENCE':mode==='dejure'?'DE JURE':mode.toUpperCase();for(const b of el('map-modes').querySelectorAll('[data-mapmode]')){const active=b===button;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active));}updateMapLegend();if(mode==='historical')message('Reference map only: historical coverage is incomplete. Playable provinces remain experimental.');});
el('open-management').addEventListener('click',()=>setDrawer(el('management-panel').hidden?'management':null));
el('open-province').addEventListener('click',()=>setDrawer(el('province-drawer').hidden?'province':null));
el('open-priorities').addEventListener('click',()=>navigateTab('realm'));
for(const id of ['close-management','close-province','panel-scrim'])el(id).addEventListener('click',()=>setDrawer(null));
el('cancel-march').addEventListener('click',cancelMarch);
document.addEventListener('keydown',e=>{if(e.key==='Escape'){closePopover();hideTooltip();if(!battle){setDrawer(null);cancelMarch();}}if(game&&!battle&&e.key==='/'&&!e.ctrlKey&&!e.metaKey&&!e.altKey&&!['INPUT','TEXTAREA','SELECT'].includes(e.target?.tagName)&&!e.target?.isContentEditable){e.preventDefault();navigateTab('search');el('campaign-query')?.focus();}});
el('show-map-modes').addEventListener('click',()=>{const m=el('map-modes');m.hidden=!m.hidden;el('show-map-modes').setAttribute('aria-expanded',String(!m.hidden));document.querySelector('.map-options').open=false;updateMapLegend();});
document.addEventListener('click',e=>{
 const pop=el('map-popover');
 const pbtn=e.target.closest('[data-popover-idx]');
 if(pbtn&&pop?._actions){const act=pop._actions[Number(pbtn.dataset.popoverIdx)];closePopover();act?.fn();return;}
 const qp=e.target.closest('[data-quick-province]');
 if(qp){const r=qp.getBoundingClientRect();openQuickPopover('province',qp.dataset.quickProvince,r.left,r.bottom+4);return;}
 const qc=e.target.closest('[data-quick-character]');
 if(qc){const r=qc.getBoundingClientRect();openQuickPopover('character',qc.dataset.quickCharacter,r.left,r.bottom+4);return;}
 if(pop&&!pop.hidden&&!e.target.closest('#map-popover'))closePopover();
});
const showTooltipFor=(target,x,y)=>{
 const tip=el('ui-tooltip');if(!tip||!target)return;
 let text=target.dataset.tooltip||'';
 if(!text&&target.dataset.character&&game)text=tooltipData(game,world,'character',target.dataset.character);
 if(!text&&target.dataset.provinceLink&&game)text=tooltipData(game,world,'province',target.dataset.provinceLink);
 if(!text){tip.hidden=true;return;}
 tip.textContent=text;tip.hidden=false;
 const rect=tip.getBoundingClientRect();
 tip.style.left=Math.max(8,Math.min(window.innerWidth-rect.width-8,x+12))+'px';
 tip.style.top=Math.max(8,Math.min(window.innerHeight-rect.height-8,y+12))+'px';
};
document.addEventListener('pointerover',e=>{if(e.pointerType==='touch')return;const t=e.target.closest('[data-tooltip],[data-character],[data-province-link]');if(t)showTooltipFor(t,e.clientX,e.clientY);else hideTooltip();});
document.addEventListener('pointerout',e=>{if(!e.relatedTarget?.closest?.('[data-tooltip],[data-character],[data-province-link]'))hideTooltip();});
el('zoom-in').addEventListener('click',()=>map.zoomAt(map.w/2,map.h/2,1.35));el('zoom-out').addEventListener('click',()=>map.zoomAt(map.w/2,map.h/2,1/1.35));
el('tabs').addEventListener('click',e=>{const t=e.target.closest('[data-tab]');if(t)navigateTab(t.dataset.tab);});
el('workspace-nav').addEventListener('click',e=>{const t=e.target.closest('[data-workspace]');if(t){const next=workspaceTab(t.dataset.workspace,rememberedTabs);if(next)navigateTab(next);}});
document.addEventListener('click',e=>{const t=e.target.closest('[data-priority-tab]');if(t)navigateTab(t.dataset.priorityTab,t.dataset.sectionLink||'');const c=e.target.closest('[data-character]');if(c){el('army-outliner').open=false;openCharacter(c.dataset.character);}if(e.target.closest('[data-character-back]')){if(characterBackProvince&&staticById[characterBackProvince]){selected=characterBackProvince;characterId=null;characterBackProvince=null;map.select(selected);renderInspector();setDrawer('province');}else navigateTab(characterBackTab);}const p=e.target.closest('[data-province-link]');if(p&&game&&staticById[p.dataset.provinceLink]){el('army-outliner').open=false;characterId=null;selected=p.dataset.provinceLink;map.select(selected);map.focus(...staticById[selected].centroid,3.2);renderInspector();setDrawer('province');}});
el('hud-ruler').addEventListener('click',()=>openCharacter(vassalCareer(game)?.person||game?.politics?.realms?.[game.player]?.ruler));
el('tab-content').addEventListener('input',e=>{if(e.target.id==='campaign-query'){campaignQuery=e.target.value;const at=e.target.selectionStart;renderTab();const input=el('campaign-query');input?.focus();input?.setSelectionRange(at,at);return;}if(e.target.id==='people-query'){directoryState.query=e.target.value;const at=e.target.selectionStart;renderTab();const input=el('people-query');input?.focus();input?.setSelectionRange(at,at);}});
el('tab-content').addEventListener('change',e=>{if(e.target.id==='people-scope'||e.target.id==='people-sort'){directoryState[e.target.id==='people-scope'?'scope':'sort']=e.target.value;renderTab();}if(e.target.id==='vassal-sort'){vassalSort=e.target.value;renderTab();}
 if(!vassalCareer(game)&&e.target.matches('.policy-select'))clickResult(setPolicy(game,e.target.dataset.policy,Number(e.target.value)));
 if(e.target.id==='diplomatic-select'){diplomaticTarget=e.target.value;renderTab();}
});
document.addEventListener('click',e=>{const unit=e.target.closest('[data-unit]');if(unit&&battle){battle.selectGroup(Number(unit.dataset.unit));return;}
 const btn=e.target.closest('[data-action]');if(!btn||!game||battle)return;const action=btn.dataset.action,type=btn.dataset.type;
 if(action==='player-life'){clickResult(playerLifeAction(game,btn.dataset.id,type,btn.dataset.extra));return;}
 if(action==='personal-life'){clickResult(resolvePersonalDilemma(game,btn.dataset.id,type));return;}
 if(action==='career'){const id=btn.dataset.input?el(btn.dataset.input)?.value:btn.dataset.id;const result=careerAction(game,type,id,btn.dataset.extra,campaignWorld(game,world));if(result.ok&&type==='start'){cancelMarch();pageHistory.reset();tab='realm';characterId=null;}clickResult(result);return;}
 if(action==='pin'){clickResult(toggleCampaignPin(game,type,btn.dataset.id));return;}
 if(vassalCareer(game))return;
 if(action==='landless'){clickResult(landlessAction(game,campaignWorld(game,world),type,btn.dataset.id));return;}
 if(action==='march'){setDrawer(null);marchFrom=selected;map.setMarchOrigin(selected);el('cancel-march').hidden=false;el('map-target-help').textContent='⚔ SELECT ADJACENT DESTINATION';message('Choose an adjacent district. Foreign territory may allow transit or lead to a battle, depending on treaties.');}
 if(action==='recruit'){clickResult(recruit(game,selected,type));browserCampaignAudio.playSfx('coin');}
 if(action==='build'){clickResult(build(game,selected,type));browserCampaignAudio.playSfx('coin');}
 if(['gift','alliance','insult','trade','marriage'].includes(action))clickResult(negotiate(game,diplomaticTarget,action,world));
 if(action==='deep'){
  const input=btn.dataset.input?el(btn.dataset.input):null,val=input?.value??btn.dataset.extra;
  let r={ok:false,msg:'Unknown action'};
  if(type==='obligation')r=setObligationLaw(game,btn.dataset.id,val,game.player);
  else if(type==='viceroyalty')r=grantViceroyalty(game,'c:'+btn.dataset.id,val,game.player);
  else if(type==='grant-minor-title')r=grantMinorTitle(game,val,btn.dataset.id,game.player);
  else if(type==='revoke-minor-title')r=revokeMinorTitle(game,btn.dataset.id,game.player);
  else if(type==='child-focus')r=setChildhoodFocus(game,btn.dataset.id,val);
  else if(type==='polity'){r=polityAction(game,btn.dataset.id,val);if(val==='raid'||val==='subjugate')browserCampaignAudio.playSfx('horn');}
  else if(type==='assault-siege'){r=assaultSiege(game,btn.dataset.id);browserCampaignAudio.playSfx('horn');}
  else if(type==='call-favor')r=callInFavor(game,game.politics?.realms?.[game.player]?.ruler,btn.dataset.id,val||'council_vote');
  clickResult(r);return;
 }
 if(action==='court-decision')clickResult(courtDecision(game,world,type));
 if(action==='council-task'){const target=btn.dataset.input?el(btn.dataset.input)?.value:btn.dataset.extra;clickResult(councilTaskAction(game,btn.dataset.id,type,target));}
 if(action==='politics'){const input=btn.dataset.input?el(btn.dataset.input):null,before=game.player;const result=politicsAction(game,campaignWorld(game,world),type,btn.dataset.id,input?.value??btn.dataset.extra);if(result.ok&&game.player!==before){cancelMarch();pageHistory.reset();characterId=null;tab='realm';diplomaticTarget=before;selected=capitalDistrict(world,game.player,game.provinces)?.id||null;map.setGame(game);map.select(selected);map.focus(...(staticById[selected]?.centroid||player().capital),3);}clickResult(result);}
 if(action==='living'){const input=btn.dataset.input?el(btn.dataset.input):null;clickResult(livingAction(game,campaignWorld(game,world),type,btn.dataset.id,input?.value));}
 if(action==='identity'){const input=btn.dataset.input?el(btn.dataset.input):null;clickResult(identityAction(game,campaignWorld(game,world),type,input?.value??btn.dataset.id,btn.dataset.extra));}
 if(action==='feudal'){const input=btn.dataset.input?el(btn.dataset.input):null;clickResult(feudalAction(game,campaignWorld(game,world),type,btn.dataset.id,input?.value??btn.dataset.extra));}
 if(action==='expanded'){clickResult(expandedAction(game,campaignWorld(game,world),type,btn.dataset.id));}
 if(action==='story'){const input=btn.dataset.input?el(btn.dataset.input):null;clickResult(chronicleAction(game,world,type,input?.value??btn.dataset.id));}
 if(action==='strategy'){const first=btn.dataset.input?el(btn.dataset.input):null,second=btn.dataset.second?el(btn.dataset.second):null;clickResult(strategyAction(game,world,type,first?.value??btn.dataset.id,second?.value??btn.dataset.extra));}
 if(action==='naval'){const input=btn.dataset.input?el(btn.dataset.input):null,third=btn.dataset.third?el(btn.dataset.third):null;clickResult(navalAction(game,world,type,btn.dataset.id,input?.value??btn.dataset.extra,third?.value));}
 if(action==='profile-command'){const army=el(btn.dataset.input)?.value;if(army)clickResult(militaryAction(game,campaignWorld(game,world),'commander',army,btn.dataset.id));}
 if(action==='profile-grant'){const title=el(btn.dataset.input)?.value;if(title)clickResult(feudalAction(game,campaignWorld(game,world),'grant',title,btn.dataset.id));}
 if(action==='military'){const input=btn.dataset.input?el(btn.dataset.input):null;clickResult(militaryAction(game,campaignWorld(game,world),type,btn.dataset.id,input?.value??btn.dataset.extra));}
 if(action==='economy'){const input=btn.dataset.input?el(btn.dataset.input):null,third=btn.dataset.third?el(btn.dataset.third):null;clickResult(economyAction(game,campaignWorld(game,world),type,btn.dataset.id,input?.value??btn.dataset.extra,third?.value));}
 if(action==='heritage'){const input=btn.dataset.input?el(btn.dataset.input):null,guest=btn.dataset.guest?el(btn.dataset.guest):null;clickResult(heritageAction(game,world,type,btn.dataset.id,input?.value??btn.dataset.extra,guest?.value));}
 if(action==='diplomatic-agreement'){const input=btn.dataset.input?el(btn.dataset.input):null;clickResult(diplomacyAction(game,campaignWorld(game,world),type,btn.dataset.id,input?.value??btn.dataset.extra));}
 if(action==='casus-belli'){clickResult(declareCasusBelliWar(game,campaignWorld(game,world),game.player,btn.dataset.id,type,btn.dataset.extra||null));}
 if(action==='institution'){const first=btn.dataset.input?el(btn.dataset.input):null,second=btn.dataset.second?el(btn.dataset.second):null;clickResult(governmentAction(game,campaignWorld(game,world),first?.value??btn.dataset.id,second?.value));}
 if(action==='civic'){const input=btn.dataset.input?el(btn.dataset.input):null;clickResult(civicAction(game,world,type,btn.dataset.id,input?.value??btn.dataset.extra));}
 if(action==='intrigue'){const input=btn.dataset.input?el(btn.dataset.input):null;clickResult(intrigueAction(game,campaignWorld(game,world),type,btn.dataset.id,input?.value??btn.dataset.extra));}
 if(action==='conflict'){const input=btn.dataset.input?el(btn.dataset.input):null;clickResult(conflictAction(game,campaignWorld(game,world),type,btn.dataset.id,input?.value??btn.dataset.extra));}
 if(action==='royal-choice')clickResult(resolveRoyalEvent(game,world,Number(btn.dataset.choice)));
 if(action==='show-diplomacy'){if(btn.dataset.target==='independent'){selected=btn.dataset.province||selected;setDrawer('province');const conn=el('province-panel').querySelector('[data-section="connections"]');if(conn)conn.open=true;message('Independent polity actions opened in Province drawer.');return;}diplomaticTarget=btn.dataset.target;navigateTab('diplomacy');}
});
document.addEventListener('click',e=>{
 const deferBtn=e.target.closest('#event-modal-defer');
 if(deferBtn){const m=el('event-modal');if(m?._eventKey)deferredModalEvents.add(m._eventKey);closeEventModal();message('Event deferred to Stories / Royal Court tab.');return;}
 const mc=e.target.closest('[data-modal-choice]');
 if(mc&&game&&!battle){
  const kind=mc.dataset.modalKind,id=mc.dataset.modalId;
  let r={ok:false,msg:'Could not resolve event'};
  if(kind==='royal')r=resolveRoyalEvent(game,world,Number(id));
  else if(kind==='expanded')r=expandedAction(game,campaignWorld(game,world),'resolve-event',id);
  else if(kind==='emergent')r=expandedAction(game,campaignWorld(game,world),'emergent-resolve',id);
  else if(kind==='civic')r=civicAction(game,world,'event',id);
  else if(kind==='dispatch')r=politicsAction(game,campaignWorld(game,world),'dispatch',id);
  else if(kind==='incident')r=heritageAction(game,world,'incident',id);
  else if(kind==='chain')r=chronicleAction(game,world,'chain',id);
  closeEventModal();
  if(r?.ok){
   browserCampaignAudio.playSfx('seal');
   const follow=collectEventPrompts().find(x=>!deferredModalEvents.has(x.key)&&x.key.startsWith('expanded:')&&game.turn>=0);
   clickResult(r);
   // Follow-ups remain accessible in the court.
  }else clickResult(r);
 }
});
el('campaign-sound')?.addEventListener('click',()=>{
 campaignSound=!campaignSound;
 browserCampaignAudio.unlock();
 browserCampaignAudio.setMuted(!campaignSound);
 battleSound=campaignSound;updateSoundButton();battle?.setSound(battleSound);
 try{localStorage.setItem('crown-of-nations.campaign-sound',campaignSound?'on':'off');localStorage.setItem('crown-of-nations.battle-sound',battleSound?'on':'off');}catch{}
 syncAudioState();
});
el('battle-rally')?.addEventListener('click',()=>{if(battle&&!battle.deployment)browserCampaignAudio.playSfx('rally');});
el('battle-showcase').addEventListener('click',()=>{
 if(!game){message('Begin your reign before opening a practice battle.');return;}
 if(battle){message('A battle is already in progress.');return;}
 const armyEntry=Object.entries(game.armies).find(([,a])=>a.owner===game.player&&armySize(a)>0&&!game.naval?.voyages?.[a.id]);
 if(!armyEntry){message('Recruit at least one army to enter the battle showcase.');return;}
 const target=world.provinces.find(p=>{const owner=game.provinces[p.id]?.owner;return owner&&owner!==game.player&&game.factions[owner];});
 if(!target){message('No opposing provinces are available.');return;}
 const enemy=game.provinces[target.id].owner;
 openBattle({attacker:armyEntry[0],enemy,to:target.id,defenseTroops:110,defenseGarrison:80,showcase:true});
});
el('battle-move-tap').addEventListener('click',()=>{if(battle){battle.tapMove=!battle.tapMove;battle.report();}});
for(const [id,delta] of [['battle-zoom-in',-12],['battle-zoom-out',12]])el(id).addEventListener('click',()=>{if(battle){battle.cameraGoal=null;battle.camera.distance=Math.max(35,Math.min(165,battle.camera.distance+delta));}});
el('battle-camera').addEventListener('change',e=>{if(battle&&!battle.focusCamera(e.target.value))message('Select an active regiment.');});
el('battle-sound').addEventListener('click',()=>{battleSound=!battleSound;campaignSound=battleSound;browserCampaignAudio.setMuted(!campaignSound);updateSoundButton();battle?.setSound(battleSound);try{localStorage.setItem('crown-of-nations.battle-sound',battleSound?'on':'off');localStorage.setItem('crown-of-nations.campaign-sound',campaignSound?'on':'off');}catch{}syncAudioState();});
el('battle-pause').addEventListener('click',()=>battle?.togglePause());
el('battle-retreat').addEventListener('click',()=>battle?.retreat());
el('battle-start').addEventListener('click',()=>battle?.startAssault());
el('battle-cancel').addEventListener('click',()=>{if(!battle?.deployment||battleDescriptor?.defenseMode&&!battle.renderLost)return;battle.stop();battle=null;battleDescriptor=null;el('battle-screen').hidden=true;document.body.style.overflow='';render();syncAudioState();message('Deployment cancelled. No casualties or territory changes.');});
el('battle-formation').addEventListener('change',e=>{
 if(battle&&!battle.setFormation(battle.selected,e.target.value))message('This formation is not available.');
});
el('battle-reserve').addEventListener('click',()=>battle?.toggleReserve());
el('battle-presets').addEventListener('click',e=>{const b=e.target.closest('[data-preset]');if(b&&battle)battle.arrangeCards(b.dataset.preset);});
el('battle-order').addEventListener('change',e=>battle?.command(battle.selected,e.target.value));
el('battle-all-order').addEventListener('click',()=>battle?.command(battle.selected,el('battle-order').value,null,true));
el('battle-lanes').addEventListener('click',e=>{
 const target=e.target.closest('[data-lane]');if(target&&battle)battle.setLane(battle.selected,Number(target.dataset.lane));
});
el('invasion-defend').addEventListener('click',openIncomingBattle);
el('invasion-auto').addEventListener('click',()=>{
 if(!game||battle||vassalCareer(game))return;const threat=game.kingdom?.threats?.find(t=>t.status==='ready');
 if(!threat)return;const r=autoResolveInvasion(game,world,threat);
 if(r.ok){message(r.msg);render();save();}
});

function teardownPage(){
 if(speedInterval){clearInterval(speedInterval);speedInterval=null;}
 if(battle){try{battle.stop();}catch{}battle=null;battleDescriptor=null;}
 try{el('menu-video')?.pause();}catch{}
 try{map?.terrain?.dispose?.();}catch{}
 revokeObjectUrls();
}
window.addEventListener('pagehide',()=>{if(game&&!battle)save(false);teardownPage();});
window.addEventListener('beforeunload',teardownPage);
