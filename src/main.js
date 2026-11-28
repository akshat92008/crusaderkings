import {provinceArt,realmEmblem} from './ui/asset-registry.js';
import {bindRoyalEconomy,renderRoyalEconomy} from './ui/royal-economy.js';
import {bindJournal,deliver,installSettings,observeRecords,preferences,renderJournal,selectJournal,getKeybindings} from './ui/chronicle.js';
import {applyTranslations} from './i18n.js';
import {createOnboardingController,openChronicleEndScreen} from './ui/chronicle-endscreen.js';
import {saveRealmCoA,normalizeCoA,renderCoASvg,COA_PATTERNS,COA_TINCTURES,COA_CHARGES} from './ui/coat-of-arms.js';
import {repairWorldStateIntegrity} from './world-integrity.js';
import {bindMinimap} from './ui/minimap.js';
import {openHometown,homeRealm,homeMax,homeQuote,hometownModifiers,stewardAdvice,currentCapitalEvent,resolveCapitalEvent} from './hometown.js';
import {realmArtRegion} from './game-art.js';
import {renderHometown,bindHometown} from './hometown-ui.js';
import {regimentCardIcon} from './banner-renderer.js';
import {fieldActiveCount,cardFormationChoices,cardRoleHint} from './simple-card-battle.js';
import {resolvePersonalDilemma,personalDilemmas,playerLifeAction,currentStressBreak,resolveStressBreak} from './character-agency.js';
import {currentHeirEducationEvent,resolveHeirEducation} from './heir-education.js';
import {currentRegencyDrama,resolveRegencyDrama} from './regency-systems.js';
import {currentFaithConversionChoice,resolveFaithConversionChoice} from './faith-institutions.js';
import {currentAssimilationEvent,resolveAssimilationEvent} from './culture-systems.js';
import {currentChaosEvent,resolveChaosEvent} from './chaos-events.js';
import {tradeRouteAction} from './trade-routes.js';
import {personalUnion,unionPartners,unionTerms} from './personal-unions.js';
import {CAREER_TABS,campaignTab,careerPriorities,renderCareerCharacter,renderCareerProvince,renderCareerLinks} from './campaign-access.js';
import {careerAction,careerView,vassalCareer,renderCareer,renderCareerEntry} from './player-career.js';
import {historicalContext,HISTORICAL_LIMITATION} from './historical-context.js';
import {createPageHistory,campaignGuide,speedDelay} from './interface-experience.js';
import {landlessAction,renderLandless} from './landless-systems.js';
import {councilTaskAction} from './council-tasks.js';
import {battleComparison,formatStabilityTooltip,formatTreasuryTooltip,portraitMark,successionWarningSummary,tooltipData} from './campaign-hud.js';
import {campaignOutliner,renderCampaignOutliner,renderPinButton,toggleCampaignPin} from './campaign-outliner.js';
import {characterLink,contextualButton,realmWarContext,sectionLink} from './campaign-context.js';
import {marriageCandidates,currentPartitionEvent,resolvePartitionEvent,currentSuccessionWarEvent,resolveSuccessionWarEvent} from './dynastic-politics.js';
import {freshBattleCanvas} from './battle-lifecycle.js';
import {SAVE_KEY,MAX_SAVE_BYTES,validatePortableSave,saveFilename,persistCampaign} from './portable-save.js';
import {MANUAL_SLOTS,saveCampaignDurable,loadCampaignDurable,listSaveSlots,readBestLocalSave,saveModPacksDurable,loadModPacksDurable} from './mobile-storage.js';
import {exportModTemplate,applyModPack,removeModPack} from './mod-loader.js';
import {renderModStudio} from './mod-ui.js';
import {renderCrownDispatch} from './dispatch-ui.js';
import {workspaceFor,workspaceTab,realmPriorities,searchRealms} from './campaign-navigation.js';
import {currentExpandedEvents,currentEmergentEvent,expandedAction,classifyEventTier,featuredStartsCatalog} from './expanded-content.js';
import {buildHistoricalWorld,expandHistoricalWorld,densifyHistoricalWorld,worldForSave,capitalDistrict,realmGeography} from './historical-world.js';
import {populateGlobalKingdoms} from './world-kingdoms-1450.js';
import {livingAction} from './living-systems.js';
import {diplomacyAction,mayEnterWithAccess,fieldContingentsAt} from './diplomacy-systems.js';
import {governmentAction} from './government-institutions.js';
import {intrigueAction} from './intrigue-systems.js';
import {campaignWorld} from './independence-systems.js';
import {identityAction} from './identity-systems.js';
import {feudalAction} from './feudal-systems.js';
import {renderCountySubholdings,syncSubholdingSeats} from './subholdings.js';
import {chronicleAction} from './chronicle-systems.js';
import {strategyAction,defenseSupport} from './strategic-ai.js';
import {dlcAction} from './ck2-dlc-systems.js';
import {crossroadsAction} from './crossroads-eras.js';
import {reignAction} from './reign-chapters.js';
import {CampaignMap} from './map.js';
import {BattleGame} from './battle.js';
import {militaryDoctrine,availableFormations} from './military-doctrines.js';
import {resolveInvasion,autoResolveInvasion,nativeInvasionArmies,validReadyInvasion} from './invasions.js';
import {politicsAction} from './dynastic-politics.js';
import {conflictAction} from './political-conflict.js';
import {civicAction,civicModifiers} from './civic-systems.js';
import {heritageAction} from './heritage-systems.js';
import {economyAction,economyModifiers,currentEconomicDilemma,resolveEconomicDilemma} from './economy-systems.js';
import {militaryAction} from './military-systems.js';
import {navalAction,portBlocked} from './naval-systems.js';
import {controller,occupation,declareCasusBelliWar} from './campaign-war.js';
import {activeWar} from './political-conflict.js';
import {renderProvinceBanner,renderDiplomacyHeader,renderDiplomacyFacing,renderEnvoyProposal,renderCampaignSearch,renderDiplomaticAgreements,renderIdentity,renderFeudal,renderStories,renderStrategy,renderNaval,renderMilitary,renderArmyCommand,renderCharacter,renderCharacterDirectory,renderDynasty,renderCouncilDirectory,renderVassalDirectory,renderProvinceLord,renderCampaignHub,renderProvinceConnections,renderPreWarComparison,renderHeritage,renderCivic,renderConflict,renderCourt,renderTrade,renderLegacy} from './kingdom-ui.js';
import {courtDecision,resolveRoyalEvent,currentRoyalEvent,tradeIncome,objectives,campaignStanding} from './kingdom-depth.js';
import {createGame,restoreGame,snapshot,MONTHS,BUILDINGS,POLICY,empireStats,controlled,armiesAt,armySize,advanceMonth,setPolicy,build,recruit,recruitmentQuote,startMarch,concludeBattle,negotiate,ownerName} from './simulation.js';
import {artIcon,setupMenuVideo,portraitImage,assetImage,eventImage} from './game-art.js';
import {browserCampaignAudio} from './field-audio.js';
import {allianceTerms,nonAggressionTerms,polityAction,setChildhoodFocus,setObligationLaw,grantViceroyalty,grantMinorTitle,revokeMinorTitle,callInFavor,assaultSiege} from './ck2-deep-systems.js';
import {civicEvent} from './civic-systems.js';
import {politicalDispatch} from './dynastic-politics.js';
import {activityIncident} from './heritage-systems.js';
import {currentChain} from './chronicle-systems.js';
const el=id=>document.getElementById(id);
setupMenuVideo();
for(const icon of document.querySelectorAll('[data-resource-art]'))icon.innerHTML=artIcon('resources',icon.dataset.resourceArt);
for(const icon of document.querySelectorAll('[data-nav-art]')){
 const art=artIcon(icon.dataset.navArt,icon.dataset.artKey);
 if(art)icon.innerHTML=art;
}
const fmt=n=>Math.round(n).toLocaleString('en-US');
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const legacyWorld=await fetch('data/world.json').then(r=>{if(!r.ok)throw Error(`Map data unavailable (${r.status})`);return r.json();});
const historicalReference=await fetch('data/historical-polities-1450.json').then(r=>r.ok?r.json():null).catch(()=>null);
const atlasV2=buildHistoricalWorld(legacyWorld,historicalReference),atlasV3=expandHistoricalWorld(atlasV2),atlasV4=densifyHistoricalWorld(atlasV3),atlasWorld=populateGlobalKingdoms(atlasV4);let world=atlasWorld;
let staticById=Object.fromEntries(world.provinces.map(p=>[p.id,p]));
const pageHistory=createPageHistory();
let characterId=null,characterBackTab='realm',characterBackProvince=null;
let game=null,selected=null,tab='realm',marchFrom=null,diplomaticTarget='france',battle=null,battleDescriptor=null,speedInterval=null,toastTimer=null;
const map=new CampaignMap(el('world-map'),world,onProvince);bindMinimap(el('campaign-minimap'),map);map.onArmy=marker=>{if(!game)return;selected=marker.province;map.select(selected);renderInspector();setDrawer('province');const command=el('province-panel').querySelector('[data-section="command"]');if(command&&marker.owner===game.player)command.open=true;message(fmt(marker.troops)+' troops · '+ownerName(game,marker.owner));};
if(window.matchMedia('(pointer: coarse)').matches)map.setRelief(false);
if(!map.terrain?.gl){const button=el('toggle-relief');button.textContent='▤ 2D MAP';button.title='3D terrain requires a WebGL2-capable browser';button.setAttribute('aria-pressed','false');button.disabled=true;}
if(historicalReference)map.setHistorical(historicalReference);if(!map.useRelief&&map.terrain?.gl){el('toggle-relief').textContent='▤ 3D OFF';el('toggle-relief').setAttribute('aria-pressed','false');}
function useWorld(next){if(next===world)return;world=next;staticById=Object.fromEntries(world.provinces.map(p=>[p.id,p]));map.setWorld(world);}
const player=()=>game?.factions[game.player];
const displayProvince=p=>p.name.replace(' Province ',' March ');
function message(msg){const t=el('toast');t.textContent=msg;t.classList.add('visible');clearTimeout(toastTimer);toastTimer=setTimeout(()=>t.classList.remove('visible'),3400);}
function clickResult(r){if(!r?.ok){message(r?.msg||'Action unavailable');browserCampaignAudio.playSfx('alert');}else{message(r.msg);browserCampaignAudio.playSfx('seal');render();save(false);}}
function loadRaw(raw,portable=false){el('hometown-screen').hidden=true;pageHistory.reset();characterId=null;tab='realm';deferredModalEvents.clear();closeEventModal();if(portable)validatePortableSave(raw);const next=worldForSave(raw,legacyWorld,atlasV2,atlasV3,atlasV4,atlasWorld),restored=restoreGame(raw,next);repairWorldStateIntegrity(restored,next);if(portable){saveCampaignDurable(snapshot(restored),{storage:localStorage}).catch(()=>{});try{persistCampaign(localStorage,snapshot(restored));}catch{message('Saved in durable browser storage.');}}clearInterval(speedInterval);speedInterval=null;el('auto-time').textContent='▶';cancelMarch();setDrawer(null);useWorld(next);game=restored;el('start-screen').hidden=true;document.body.classList.add('in-campaign');document.body.classList.remove('in-battle');document.body.dataset.state='playing';selected=capitalDistrict(world,game.player,game.provinces)?.id||null;map.setGame(game);map.select(selected);map.focus(...(staticById[selected]?.centroid||player().capital),3);render();onboarding?.render();syncAudioState();if(!openIncomingBattle())message('Saved campaign restored.');}
let saveSlotsCache=[];
function refreshSaveSlots(){listSaveSlots().then(slots=>{saveSlotsCache=slots;if(game&&tab==='realm'&&!el('management-panel').hidden)renderTab();}).catch(()=>{});}
function load(slot='autosave'){loadCampaignDurable({slot,storage:localStorage}).then(res=>{if(res?.raw){loadRaw(res.raw);if(res.recovered)message('Primary save damaged — restored latest backup cleanly.');return;}if(slot==='autosave'){const local=readBestLocalSave(localStorage);if(local){loadRaw(local);return;}}message('No saved campaign found in '+slot+'.');}).catch(e=>message('Unable to load save: '+e.message));}
function save(notify=true,slot='autosave'){if(!game||battle)return false;let raw;try{raw=snapshot(game);}catch(e){if(notify!==false)message('Save serialization failed: '+e.message);return false;}let localSyncOk=false;if(slot==='autosave'){try{persistCampaign(localStorage,raw);localSyncOk=true;}catch{localSyncOk=false;}}saveCampaignDurable(raw,{slot,storage:localStorage}).then(res=>{refreshSaveSlots();if(res.ok){if(notify!==false)message('Campaign saved to '+(slot==='autosave'?'browser':'slot '+slot)+(res.idb?' (IndexedDB)':res.local?' (Local)':'')+'.');}else if(localSyncOk){if(notify!==false)message('Campaign saved to local browser storage.');}else{message('Save failed: browser storage unavailable. Export a .json backup!');}}).catch(err=>{if(localSyncOk){if(notify!==false)message('Campaign saved to local browser storage.');}else message('Save failed: '+(err?.message||'storage error'));});return true;}
const activeObjectUrls=new Set();
function revokeObjectUrls(){for(const u of activeObjectUrls){try{URL.revokeObjectURL(u);}catch{}}activeObjectUrls.clear();}
function exportSave(){if(!game||battle)return;const blob=new Blob([snapshot(game)],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');activeObjectUrls.add(url);a.href=url;a.download=saveFilename(game);document.body.append(a);a.click();a.remove();setTimeout(()=>{if(activeObjectUrls.delete(url))try{URL.revokeObjectURL(url);}catch{}},1000);message('Campaign backup exported.');}
function closePopover(){const pop=el('map-popover');if(pop){pop.hidden=true;pop.innerHTML='';}}
let tooltipTimer;
const tooltipState={target:null,locked:false,level:1,x:0,y:0};
function hideTooltip(force=false){clearTimeout(tooltipTimer);if(tooltipState.locked&&!force)return;tooltipState.locked=false;tooltipState.target=null;const tip=el('ui-tooltip');if(tip){tip.hidden=true;tip.classList.remove('locked');}}
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
function setDrawer(next){closePopover();hideTooltip();const open=next==='management'||next==='province';document.querySelector('.map-options').open=false;el('management-panel').hidden=next!=='management';el('province-drawer').hidden=next!=='province';el('panel-scrim').hidden=!open;el('open-management').setAttribute('aria-expanded',String(next==='management'));el('open-province').setAttribute('aria-expanded',String(next==='province'));if(next!=='management')for(const b of el('quick-nav').querySelectorAll('button'))b.removeAttribute('aria-expanded');}
function cancelMarch(){marchFrom=null;map.setMarchOrigin(null);el('cancel-march').hidden=true;el('map-target-help').textContent='Tap a province to inspect';}
function onProvince(id){if(!game)return;if(marchFrom){let r=startMarch(game,world,marchFrom,id);cancelMarch();if(r.ok&&r.type==='battle'){if(openBattle(r))return;message('Could not open battle. No campaign casualties were applied.');return;}clickResult(r);}
 selected=id;map.select(id);if(map.mode==='diplomacy'||map.mode==='opinion')updateMapLegend();renderInspector();setDrawer('province');}
function render(){if(!game)return;observeRecords(game);const f=player(),s=empireStats(game,game.player),career=careerView(game);
 const goldTip=career?`Personal wealth ${fmt(career.person?.wealth||0)}g · estate funds shown in career panel`:formatTreasuryTooltip(f,s);
 const goldPill=el('resource-gold')?.closest('.resource');if(goldPill){goldPill.dataset.tooltip=goldTip;goldPill.dataset.tooltipDetail=`Tax +${fmt(s.taxIncome||0)}g · Trade +${fmt((s.trade||0)+(s.tradePosts||0))}g · Upkeep −${fmt(s.upkeep||0)}g`;goldPill.dataset.tooltipRule='Royal treasury funds buildings, armies, council missions, and diplomacy. Negative treasury erodes stability & legitimacy.';goldPill.title=goldTip;}
 const stabPill=el('resource-stability')?.closest('.resource');if(stabPill){stabPill.dataset.tooltip=formatStabilityTooltip(f,s);stabPill.dataset.tooltipDetail=`Food ${fmt(f.food)} (${s.foodDelta>=0?'+':''}${fmt(s.foodDelta)}/mo) · Avg realm order & unrest`;stabPill.dataset.tooltipRule='Stability below 45 fuels pretender/independence factions and lowers provincial levy compliance.';}
 const armyPill=el('resource-army')?.closest('.resource');if(armyPill){armyPill.dataset.tooltip=`Total soldiers across ${fmt(s.provinces)} provinces: ${fmt(s.troops)}`;armyPill.dataset.tooltipDetail=`Provincial districts ${fmt(s.provinces)} · Monthly upkeep ${fmt(s.upkeep)}g · Food −${fmt(s.foodUpkeep)}/mo`;armyPill.dataset.tooltipRule='Only armies stationed in the target/adjacent district join an assault. Appoint marshals to boost combat power & morale.';}
 const foodPill=el('resource-food')?.closest('.resource');const netFood=Math.round(s.foodDelta||0);if(foodPill){const fTip=`Royal granaries: ${fmt(f.food)} food (${netFood>=0?'+':''}${fmt(netFood)}/mo)`;foodPill.dataset.tooltip=fTip;foodPill.dataset.tooltipDetail=`Troop drain −${fmt(s.foodUpkeep||0)}/mo · Provincial harvests & Hometown farms replenish granaries.`;foodPill.dataset.tooltipRule='Running out of food starves armies and lowers stability & levy readiness.';foodPill.title=fTip;}
 const prestigePill=el('resource-prestige')?.closest('.resource');if(prestigePill){const pTip=`Dynastic Prestige: ${fmt(f.prestige||0)}`;prestigePill.dataset.tooltip=pTip;prestigePill.dataset.tooltipDetail='Earned from victorious battles, royal marriages, patronages, bloodlines, and great works.';prestigePill.dataset.tooltipRule='Prestige empowers alliance proposals, claim declarations, law reforms, and realm renown.';}
 const legitPill=el('resource-legitimacy')?.closest('.resource');if(legitPill){const lTip=`Crown Legitimacy: ${fmt(f.legitimacy||0)}%`;legitPill.dataset.tooltip=lTip;legitPill.dataset.tooltipDetail=`Succession reforms & crown laws require 65+ legitimacy · Current stability ${fmt(f.stability)}%`;legitPill.dataset.tooltipRule='Low legitimacy emboldens claimant factions, intensifies heresy drain, and lowers vassal loyalty.';}
 if(el('resource-food'))el('resource-food').textContent=fmt(f.food)+(netFood!==0?` (${netFood>0?'+':''}${netFood})`:'');
 const advEl=el('hud-steward-advice');if(advEl){const adv=career?[]:stewardAdvice(game,world,game.player);const topAdv=career?null:(adv[0]||{title:netFood<0?`Food deficit (${netFood}/mo)`:s.balance<0?`Treasury deficit (${fmt(s.balance)}g/mo)`:`Steward: +${fmt(s.balance)}g/mo`,detail:`Food ${fmt(f.food)} (${netFood>=0?'+':''}${netFood}/mo) · Open Steward Forecast`});advEl.hidden=!topAdv;if(topAdv){advEl.textContent='📜 '+topAdv.title;advEl.title=topAdv.detail;}}
 const rFam=realmArtRegion(game.player);document.body.dataset.cultureTheme=['northindia','southindia'].includes(rFam)?'indian':['ottoman','persian'].includes(rFam)?'islamic':['ming','japan','southeast'].includes(rFam)?'eastasian':'european';
 el('resource-prestige').textContent=fmt(f.prestige||0);el('resource-legitimacy').textContent=fmt(f.legitimacy||0)+'%';el('resource-gold').textContent=fmt(career?career.person?.wealth||0:f.treasury)+' ◈';el('resource-army').textContent=fmt(s.troops);el('resource-stability').textContent=fmt(f.stability)+'%';el('date-display').textContent=`${MONTHS[game.month].toUpperCase()} ${game.year}`;
 const ruler=career?career.person:game.politics?.people?.[game.politics?.realms?.[game.player]?.ruler],mark=portraitMark(ruler);el('hud-ruler').hidden=!ruler;el('hud-realm-name').textContent=f.name;el('hud-ruler-name').textContent=(ruler?.name||'—')+(ruler&&personalDilemmas(game,ruler.id).length?' · !':'');const succWarn=career?null:successionWarningSummary(game);const warnEl=el('hud-succession-warning');if(warnEl){warnEl.hidden=!succWarn;warnEl.textContent=succWarn?'⚠ '+succWarn.label:'';warnEl.title=succWarn?.detail||'';}el('hud-portrait').innerHTML=(portraitImage(ruler)||esc(mark.initials)).replace('loading="lazy"','loading="eager"');el('hud-portrait').style.background=mark.color;el('quick-nav').hidden=false;el('open-management').textContent=career?'Manage career':'Manage kingdom';for(const b of el('quick-nav').querySelectorAll('[data-priority-tab]')){b.hidden=!!career&&!CAREER_TABS.includes(b.dataset.priorityTab);if(career)b.querySelector('span').textContent='Career';else if(b.dataset.priorityTab==='realm')b.querySelector('span').textContent='Crown';}const outliner=campaignOutliner(game,world);el('outliner-count').textContent=outliner.count;el('outliner-list').innerHTML=renderCampaignOutliner(outliner,esc);el('faction-name').textContent=f.name;el('faction-government').textContent=career?'Vassal career':f.government;
 el('faction-flag').style.background=f.color;el('faction-flag').innerHTML=(assetImage(realmEmblem(f),'realm-emblem')||'♛').replace('loading="lazy"','loading="eager"');
 el('world-counter').title=world.meta.caveat;el('world-counter').textContent=`${world.provinces.length} DISTRICTS · ${Object.values(game.factions).filter(q=>q.id!=='independent'&&Object.values(game.provinces).some(p=>p.owner===q.id)).length} REALMS`;
 el('latest-event').textContent=game.log[0]?.text||'Your court awaits.';
 const prompts=career?[]:collectEventPrompts();
 const priorities=career?careerPriorities(game):realmPriorities(game,s,Boolean(currentRoyalEvent(game)),prompts.length);
 const strip=el('priority-strip');strip.hidden=!priorities.length;const alertCount=priorities.length||prompts.length;el('open-priorities').hidden=false;el('open-priorities').textContent=alertCount?'Alerts ('+alertCount+')':'Alerts';strip.innerHTML=priorities.slice(0,3).map(p=>'<button class="priority-item '+p.level+'" data-priority-tab="'+esc(p.tab)+'" title="'+esc(p.detail)+'">'+esc(p.label)+'</button>').join('')+(priorities.length>3?'<small>+'+(priorities.length-3)+' more in Alerts</small>':'');
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
 if(!el('management-panel').hidden)renderTab();if(!el('province-drawer').hidden)renderInspector();map.render();updateMapLegend();syncAudioState();const ht=el('hometown-screen');el('open-hometown').hidden=!!career;el('capital-nav').hidden=!!career;if(!ht.hidden){if(career)ht.hidden=true;else renderHometown(game,world,ht);}}
const rememberedTabs={},directoryState={scope:'court',query:'',sort:'martial'};let vassalSort='loyalty',campaignQuery='';
function navigateTab(next,section='',record=true){if(!game)return;next=campaignTab(game,next);if(!document.querySelector('[data-tab="'+next+'"]'))return;characterId=null;tab=next;if(['realm','court','dynasty'].includes(next))onboarding?.mark('crown');if(['trade','diplomacy'].includes(next))onboarding?.mark('diplomacy');setDrawer('management');if(record)pageHistory.visit({tab,character:null,section});renderTab();const panel=el('tab-content');panel.scrollTop=0;if(section){const h=[...panel.querySelectorAll('.sectiontitle')].find(n=>n.textContent===section);h?.scrollIntoView({block:'start'});}}
function openCharacter(id,record=true){if(!game?.politics?.people?.[id])return;if(!characterId){characterBackTab=tab;characterBackProvince=!el('province-drawer').hidden?selected:null;}characterId=id;if(record)pageHistory.visit({tab,character:id,section:''});setDrawer('management');renderTab();el('tab-content').scrollTop=0;}
function renderTab(){if(!game)return;const career=vassalCareer(game);el('tabs').querySelector('[data-tab="realm"] span').textContent=career?'My career':'Overview';if(career){tab=campaignTab(game,tab);el('nav-back').disabled=!pageHistory.canBack;el('nav-forward').disabled=!pageHistory.canForward;el('nav-location').textContent=characterId?(game.politics.people[characterId]?.name||'Character'):'Career / '+tab;for(const b of document.querySelectorAll('.tab')){b.hidden=!CAREER_TABS.includes(b.dataset.tab);const active=b.dataset.tab===tab;b.classList.toggle('active',active);b.setAttribute('aria-current',active?'page':'false');}const live=campaignWorld(game,world);let html;if(characterId)html=renderCareerCharacter(game,live,characterId,esc);else if(tab==='characters')html=renderCharacterDirectory(game,esc,directoryState);else if(tab==='search')html=renderCampaignSearch(game,live,esc,campaignQuery);else if(tab==='chronicle')html='<div class="sectiontitle">CAMPAIGN CHRONICLE</div>'+game.log.map(l=>'<div class="rule"><b>'+esc(l.date)+'</b><p>'+esc(l.text)+'</p></div>').join('');else html=renderCareer(game,live,esc)+renderCareerLinks(game,live,esc);if(html.includes('VASSAL CAREER')&&!html.includes('>VASSAL CAREER<'))html=html.replace('VASSAL CAREER','<span>VASSAL CAREER</span>');el('tab-content').innerHTML=html;return;}el('nav-back').disabled=!pageHistory.canBack;el('nav-forward').disabled=!pageHistory.canForward;el('nav-location').textContent=characterId?(game.politics.people[characterId]?.name||'Character'):(workspaceFor(tab).name+' / '+tab);if(characterId){el('tab-content').innerHTML=renderCharacter(game,world,characterId,esc);return;}const liveWorld=campaignWorld(game,world),workspace=workspaceFor(tab);if(tab!=='search')rememberedTabs[workspace.id]=tab;
 for(const b of el('quick-nav').querySelectorAll('[data-priority-tab]')){
  b.setAttribute('aria-expanded',String(!el('management-panel').hidden&&workspace.tabs.includes(b.dataset.priorityTab)));
 }
 for(const b of document.querySelectorAll('.tab')){b.hidden=!workspace.tabs.includes(b.dataset.tab);const active=b.dataset.tab===tab;b.classList.toggle('active',active);b.setAttribute('aria-current',active?'page':'false');}
 const f=player(),s=empireStats(game,game.player);let html='';
 if(tab==='realm'){
  const priorities=realmPriorities(game,s,Boolean(currentRoyalEvent(game)),currentExpandedEvents(game).length);
  const dispatchHtml=renderCrownDispatch(game,liveWorld,esc,{pendingEvents:(currentRoyalEvent(game)?1:0)+currentExpandedEvents(game).length+(currentEmergentEvent(game)?1:0)});
  const guide=campaignGuide(game,s);const onboarding='<details class="realm-overview first-steps"><summary>First steps · '+guide.filter(x=>x.done).length+'/'+guide.length+'</summary>'+guide.map(x=>'<button class="priority-detail" data-priority-tab="'+esc(x.tab)+'"><b>'+(x.done?'✓ ':'')+esc(x.label)+'</b><small>'+esc(x.detail)+'</small></button>').join('')+'</details>';const guidance=dispatchHtml+onboarding+'<div class="realm-overview"><h3>What needs your attention?</h3>'+(priorities.length?priorities.map(p=>'<button class="priority-detail '+p.level+'" data-priority-tab="'+esc(p.tab)+'"><b>'+esc(p.label)+'</b><small>'+esc(p.detail)+'</small></button>').join(''):'<p class="paragraph">No urgent issues. Select a province to develop it, or advance a month.</p>')+'</div>';
  const history=historicalContext(game.player);const historicalNote=history?'<details class="rule historical-context"><summary>'+esc(history.title)+'</summary><p class="paragraph">'+esc(history.context)+'</p><p class="smallnote">'+esc(HISTORICAL_LIMITATION)+'</p><a href="'+esc(history.url)+'" target="_blank" rel="noopener noreferrer">'+esc(history.source)+'</a></details>':'';
  const slotsHtml='<details class="rule save-slots-panel"><summary>Save Slots &amp; Backups ('+saveSlotsCache.length+')</summary><p class="smallnote">Autosave rotates redundant backups cleanly; manual slots persist across browser sessions.</p>'+MANUAL_SLOTS.map(sl=>{const info=saveSlotsCache.find(x=>x.slot===sl);return '<div class="smallnote"><b>'+esc(sl.toUpperCase())+'</b> · '+(info?esc(info.player)+' · '+info.year+'/'+(info.month+1):'Empty')+' <button class="rowbtn" data-action="save-slot" data-id="'+esc(sl)+'">Save</button>'+(info?'<button class="rowbtn" data-action="load-slot" data-id="'+esc(sl)+'">Load</button>':'')+'</div>';}).join('')+'<button class="rowbtn" data-action="export-backup">Export .JSON Backup</button></details>';
  html=renderCampaignHub(game,esc)+renderLandless(game,liveWorld,esc)+renderCareerEntry(game,esc)+guidance+historicalNote+slotsHtml+`<div class="label">STATE OF THE REALM</div><div class="divider"></div><div class="statlist"><label>Controlled provinces</label><strong>${fmt(s.provinces)}</strong><label>Owned land groups</label><strong>${realmGeography(world,game.player,game.provinces).components}</strong><label>Population</label><strong>${fmt(s.population)}k</strong><label>Total revenue / mo.</label><strong class="up">+${fmt(s.income)}</strong><label>Trade / mo.</label><strong class="up">+${fmt(s.trade||0)}</strong><label>Army upkeep / mo.</label><strong class="down">−${fmt(s.upkeep)}</strong><label>Net treasury / mo.</label><strong class="${s.balance>=0?'up':'down'}">${s.balance>=0?'+':''}${fmt(s.balance)}</strong><label>Food reserve</label><strong>${fmt(f.food)}</strong><label>Food change / mo.</label><strong class="${s.foodDelta>=0?'up':'down'}">${s.foodDelta>=0?'+':''}${fmt(s.foodDelta)}</strong><label>Legitimacy</label><strong>${fmt(f.legitimacy)}%</strong><label>Prestige</label><strong>${fmt(f.prestige)}</strong></div><div class="divider"></div><div class="sectiontitle">MILITARY DOCTRINE</div><div class="rule"><b>⚔ ${esc(militaryDoctrine(f).name)}</b><div class="smallnote">Specialist: ${esc(militaryDoctrine(f).unique)} · Army mix ${militaryDoctrine(f).mix.map(x=>Math.round(x*100)).join(" / ")}% · ${militaryDoctrine(f).formations.map(id=>id.replaceAll("_"," ")).join(" · ")}. These formations affect movement, range, attack and defense in real battles.</div></div><div class="sectiontitle">COURT ADVICE</div><p class="paragraph">Expand with care. Taxes and conscription increase unrest. A depleted treasury or food reserve undermines public stability. Build markets to finance your armies.</p>`;
 }else if(tab==='search'){html=renderCampaignSearch(game,liveWorld,esc,campaignQuery);
 }else if(tab==='decrees'){
  const descriptions={tax:'Taxation balances state revenue against civilian unrest.',levy:'Conscription policy affects the political burden of raising regiments.',tolerance:'Pluralism reduces unrest at the cost of central control.'};
  html=`<div class="label">ROYAL DECREES</div><p class="paragraph" style="margin-top:12px">New laws cost 80 gold to enact. Their consequences apply during monthly simulation.</p>${Object.keys(POLICY).map(key=>`<div class="rule"><div class="label">${key.toUpperCase()}</div><select class="policy-select" data-policy="${key}">${POLICY[key].map((name,i)=>`<option value="${i}" ${f.policies[key]===i?'selected':''}>${esc(name)}</option>`).join('')}</select><div class="smallnote">${descriptions[key]}</div></div>`).join('')}<div class="sectiontitle">REALM STABILITY</div><div class="statlist"><label>Current stability</label><strong>${fmt(f.stability)}%</strong><label>Royal legitimacy</label><strong>${fmt(f.legitimacy)}%</strong></div>`;
 }else if(tab==='diplomacy'){
  const nations=liveWorld.factions.filter(q=>q.id!==game.player).sort((a,b)=>a.name.localeCompare(b.name));if(diplomaticTarget===game.player)diplomaticTarget=nations[0]?.id;
  const other=game.factions[diplomaticTarget]||game.factions[nations[0]?.id];
  if(other)diplomaticTarget=other.id;
  if(!other){el('tab-content').textContent='No foreign powers are available.';return;}
  const aT=allianceTerms(game,game.player,other.id,liveWorld),nT=nonAggressionTerms(game,game.player,other.id,liveWorld);
  const rel=player().relations?.[other.id]||0,tradeReady=rel>=-15&&player().treasury>=140;
  html=`<div class="label">FOREIGN AFFAIRS</div><div class="sectiontitle">SEND ENVOYS</div><select class="select" id="diplomatic-select">${nations.map(n=>`<option value="${n.id}" ${n.id===diplomaticTarget?'selected':''}>${esc(n.name)}</option>`).join('')}</select>${renderDiplomacyFacing(game,other.id,esc,aT,nT)}<div class="sectiontitle">ROYAL DIPLOMATIC ACTIONS</div><button class="rowbtn" data-action="gift">✦ Send gift (250 gold · +20 opinion)</button>${renderEnvoyProposal('Propose alliance',aT,'alliance',other.id,esc,game)}${renderEnvoyProposal('Propose non-aggression',nT,'diplomatic-agreement',other.id,esc,game)}<details class="rule envoy-proposal"><summary>Establish merchant treaty <span>${tradeReady?'Likely':'Blocked'}</span></summary><p class="smallnote">Fee 140 gold · Increases relations +10 &amp; unlocks active trade routes (requires relation ≥ −15).</p><button class="rowbtn" data-action="trade" ${tradeReady?'':'disabled'}>Confirm Merchant Treaty (140g)</button></details><button class="rowbtn negative" data-action="insult">⚑ Issue formal insult (−25 opinion)</button><p class="paragraph" style="margin-top:13px">Relations support merchant treaties, non-aggression pacts, alliances, and dynastic marriages.</p>`;
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
 }else if(tab==='economy'){html=renderRoyalEconomy(game,liveWorld,esc,s);
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
 }else if(tab==='mods'){
  html=renderModStudio(game,liveWorld,esc);
 }else if(tab==='chronicle'){
  const prompts=collectEventPrompts();
  html=renderJournal(game,realmPriorities(game,s,Boolean(currentRoyalEvent(game)),prompts.length),prompts,esc);
 }
 el('tab-content').innerHTML=html;
}
function renderInspector(){if(!game)return;if(vassalCareer(game)){el('province-panel').innerHTML=renderCareerProvince(game,campaignWorld(game,world),selected,esc);return;}let p=staticById[selected],state=game.provinces[selected];if(!p||!state){el('province-panel').innerHTML='<div class="emptyselection"><div class="emptycrest">♜</div><h2>THE KING\'S ATLAS</h2><p>Select any province to inspect its holdings.</p></div>';return;}
 const own=state.owner===game.player&&controller(game,selected)===game.player,owner=game.factions[state.owner],a=armiesAt(game,selected,state.owner),yourArmies=armiesAt(game,selected,game.player).filter(a=>armySize(a)>0).sort((a,b)=>armySize(b)-armySize(a)),yourArmy=yourArmies[0],localTroops=yourArmies.reduce((n,a)=>n+armySize(a),0);const total=a.reduce((s,q)=>s+armySize(q),0);
 const holdingRec=game.politics?.holdings?.[selected],subSeats=holdingRec?syncSubholdingSeats(game,selected):[];
 const builtSubCount=subSeats.filter(s=>s.level>0).length,baronCount=subSeats.filter(s=>s.level>0&&s.holder&&s.holder!==holdingRec?.lord).length;
 let text=`<div class="inspector"><span class="eyebrow">PROVINCE CHANCERY · ${esc(p.continent.toUpperCase())}</span><h2>${esc(displayProvince(p))}</h2>${renderPinButton(game,'province',selected,esc)}<button class="rowbtn" data-quick-province="${esc(selected)}">Quick actions ▾</button><div class="owner"><span class="swatch" style="background:${esc(owner?.color||'#667670')}"></span>${esc(owner?.name||'Independent Polities')} ${own?'<span style="color:#e4ca83"> · YOUR REALM</span>':''}</div>${renderProvinceBanner(game,p,esc)}<div class="province-facts"><div class="fact" data-tooltip="Provincial population drives tax and levies"><label>POPULATION</label><b>${fmt(state.population)}k</b></div><div class="fact" data-tooltip="Development boosts local output and garrison"><label>DEVELOPMENT</label><b>LV. ${fmt(state.development)}</b></div><div class="fact" data-tooltip="High unrest risks local revolt and factions"><label>UNREST</label><b style="color:${state.unrest>55?'#e1a194':'#aed2af'}">${fmt(state.unrest)}%</b></div><div class="fact" data-tooltip="Stationed regiments plus fort garrison"><label>GARRISON & ARMY</label><b>${fmt(total||45+state.development*12)}</b></div></div>`;
 const guests=fieldContingentsAt(game,game.player,selected);
 if(guests.length)text+='<div class="rule"><b>Allied contingents</b>'+guests.map(a=>'<p class="smallnote">'+esc(ownerName(game,a.owner))+' · '+fmt(armySize(a))+' troops</p>').join('')+'</div>';
 const occupied=occupation(game,selected);if(occupied)text+='<div class="rule"><b>OCCUPIED BY '+esc(ownerName(game,occupied.by))+'</b><p class="paragraph">Legal ownership remains with '+esc(ownerName(game,state.owner))+'.</p>'+(occupied.by===game.player&&yourArmy?'<button class="rowbtn" data-action="march">March from occupied territory</button>':'')+'</div>';if(game.naval?.ports[selected])text+='<div class="rule"><b>PORT '+(portBlocked(game,selected)?'· BLOCKADED':'')+'</b></div>';
 const subOpen=state.owner===game.player?' open':'';
 const subLabel=holdingRec?`Baronies & Baron Control (${baronCount}/${builtSubCount} delegated · C${subSeats[0]?.level||0} · Ci${subSeats[1]?.level||0} · T${subSeats[2]?.level||0})`:'County sub-holdings (Castle · City · Temple)';
 text+='<details class="province-section" data-section="lord"><summary>Local lord & vassal contract</summary>'+renderProvinceLord(game,world,selected,esc)+'</details><details class="province-section" data-section="subholdings"'+subOpen+'><summary>'+esc(subLabel)+'</summary>'+renderCountySubholdings(game,selected,esc,'feudal')+'</details><details class="province-section" data-section="connections"><summary>Economy, titles & claims</summary>'+renderProvinceConnections(game,world,selected,esc)+'</details>';const local=game.civic?.provinces[selected];
 if(own){const recruitButtons=['infantry','archers','cavalry'].map(t=>{const q=recruitmentQuote(game,selected,t);return '<button data-action="recruit" data-type="'+t+'" '+(!q.available||player().treasury<q.cost?'disabled':'')+'>'+t.charAt(0).toUpperCase()+t.slice(1)+'<small>'+esc(q.available?fmt(q.count)+' troops · '+fmt(q.cost)+' gold':q.reason)+'</small></button>';}).join('');
 text+=`<p class="paragraph">${yourArmy?`${fmt(localTroops)} troops stationed here · ${yourArmies.length} armies. All local troops march together.`:'No army stationed here.'}</p><button class="btnblock" data-action="march" ${!yourArmy||localTroops<20?'disabled':''}>Move or attack</button>${yourArmy?'<details class="province-section" data-section="command" open><summary>Army & commander</summary>'+yourArmies.map(a=>'<div class="rule"><b>'+fmt(armySize(a))+' troops</b>'+renderArmyCommand(game,a,esc,'province')+'</div>').join('')+'</details>':''}<details class="province-section" data-section="recruit"><summary>Recruit troops</summary><div class="building-grid">${recruitButtons}</div></details><details class="province-section" data-section="build"><summary>Improve province</summary><div class="building-grid">${Object.entries(BUILDINGS).map(([kind,b])=>{const level=state.buildings[kind],cost=Math.round(b.cost*(level+1)*civicModifiers(game,game.player).build*economyModifiers(game,game.player).cost),quote=homeRealm(game)?homeQuote(game,world,'building',kind,selected):null;return '<button data-action="build" data-type="'+kind+'" '+((quote?!quote.ok:level>=homeMax(game)||player().treasury<cost)?'disabled':'')+'>'+esc(b.icon)+' '+esc(b.name)+'<small>Level '+level+' / '+homeMax(game)+' · '+esc(quote?(quote.ok?quote.price.gold+' gold + materials · '+quote.months+' months':quote.msg):level>=homeMax(game)?'Complete':fmt(cost)+' gold')+'</small></button>';}).join('')}</div></details>`;
 }else{
  text+='<div class="sectiontitle">FOREIGN TERRITORY</div>';
  if(mayEnterWithAccess(game,game.player,selected)){
   text+='<p class="paragraph">Military passage is active. This district can be crossed with a field army.</p>';
   if(yourArmy)text+='<button class="btnblock" data-action="march" '+(localTroops<20?'disabled':'')+'>Continue march · '+fmt(localTroops)+' troops</button>';
  }
  text+='<button class="btnblock secondary" data-action="show-diplomacy" data-target="'+esc(state.owner)+'">✦ DIPLOMATIC OPTIONS</button>';
 }
 text+=`<details class="province-section" data-section="details"><summary>Province details</summary>${local?'<div class="rule"><b>'+esc(local.culture)+'</b><p class="paragraph">'+esc(local.faith)+' · '+fmt(local.acceptance)+'% acceptance</p></div>':''}<div class="sectiontitle">ADJACENT PROVINCES</div><p class="paragraph">${p.neighbors.length} connected land provinces. ${p.neighbors.filter(n=>game.provinces[n].owner!==state.owner).length} under foreign control.${p.landComponentSize===1?' No land route: use an available naval route where possible.':p.landComponentSize?' Land network: '+p.landComponentSize+' districts.':''}</p><div class="divider"></div><p class="paragraph">${p.ownershipSource?`Starting ownership: ${esc(p.ownershipSource)}.${p.historicalPolity?' Reference polity: '+esc(p.historicalPolity)+'.':''}${p.referenceInherited?' Inherited from the parent gameplay district.':''}${Number.isFinite(p.referenceSamples)&&p.referenceSamples>0&&p.historicalPolity?' Sample agreement: '+p.referenceMatches+'/'+p.referenceSamples+' points.':''} `:''}${p.nameSource?' Geographic name, not a historical county title.':''} Gameplay districts are approximate, not verified historical counties.</p></details></div>`;
 const panel=el('province-panel'),sameProvince=panel.dataset.province===selected,hadCommand=!!panel.querySelector('[data-section="command"]'),open=sameProvince?[...panel.querySelectorAll('details[open]')].map(d=>d.dataset.section):[];panel.dataset.province=selected;panel.innerHTML=text;for(const d of panel.querySelectorAll('details'))d.open=open.includes(d.dataset.section)||(d.dataset.section==='command'&&(!sameProvince||!hadCommand))||(!sameProvince&&state.owner===game.player&&d.dataset.section==='subholdings');
}
let campaignSound=true;try{const saved=localStorage.getItem('crown-of-nations.audio-enabled.v2');if(saved!==null)campaignSound=saved!=='off';}catch{}
let battleSound=campaignSound;
browserCampaignAudio.setMuted(!campaignSound);
function syncCampaignSoundButton(){const btn=el('campaign-sound');if(btn){btn.setAttribute('aria-pressed',String(campaignSound));btn.textContent=campaignSound?'♫':'🔇';}const menu=el('menu-sound');if(menu){menu.textContent=campaignSound?'Enable / retry music':'Enable music';menu.setAttribute('aria-pressed',String(campaignSound));}}
function syncAudioState(){
 syncCampaignSoundButton();
 if(!campaignSound){browserCampaignAudio.setMode('silent');return;}
 if(!game){browserCampaignAudio.setContext('menu');return;}
 if(battle){browserCampaignAudio.setMode('silent');return;}
 const f=player();
 const modal=el('event-modal');const title=modal&&!modal.hidden?modal.textContent||'':'';
 const override=/succession|heir|coronation|monarch.*death/i.test(title)?'succession':/intrigue|scheme|assassin|conspiracy/i.test(title)?'intrigue':null;
 const mode=f?.atWarWith?.length||game.kingdom?.threats?.some(t=>['ready','approaching'].includes(t.status))?'war':(f?.stability??100)<40||Object.values(game.conflict?.factions||{}).some(x=>x.realm===game.player&&x.status==='civil war')?'crisis':'peace';
 browserCampaignAudio.setContext(mode,game.player,override);
}
syncAudioState();
const retryScore=()=>{if(!campaignSound)return;const s=browserCampaignAudio.score;if(!browserCampaignAudio.unlocked||s?.state==='blocked'||(!battle&&s?.active&&s.media?.paused&&!s.playPending&&!s.exhausted)){syncAudioState();browserCampaignAudio.unlock();}if(battle&&!battle.deployment&&!battle.paused&&!battle.done&&battle.music?.score?.state==='blocked')battle.music.sync(true,true);};
window.addEventListener('click',retryScore,{capture:true});window.addEventListener('pointerup',retryScore,{capture:true});window.addEventListener('keydown',retryScore,{capture:true});
function persistSound(){try{for(const key of ['crown-of-nations.audio-enabled.v2','crown-of-nations.campaign-sound','crown-of-nations.battle-sound'])localStorage.setItem(key,campaignSound?'on':'off');}catch{}}
el('menu-sound')?.addEventListener('click',()=>{campaignSound=battleSound=true;persistSound();browserCampaignAudio.setMuted(false);syncAudioState();browserCampaignAudio.retryMusic();});
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
  out.push({key:'expanded:'+x.id+':'+x.started,badge:x.category||'REALM EVENT',tier:x.tier||classifyEventTier(x),title:x.title,desc:x.description,imgKey:x.id,actor:x.target?.person||x.target?.actor,choices:(x.choices||[]).map((c,i)=>({label:c.label+(c.cost?' ('+c.cost+'g)':''),kind:'expanded',id:x.id+':'+i,chips:effectChips(c.effects,c.cost||0),ready:player().treasury>=(c.cost||0)}))});
 }
 const ce=civicEvent(game);
 if(ce)out.push({key:'civic:'+ce.id,badge:'SOCIETY DISPATCH',title:ce.title,desc:ce.description,imgKey:ce.id,choices:(ce.choices||[]).map((c,i)=>({label:c.label+(c.cost?' ('+c.cost+'g)':''),kind:'civic',id:String(i),chips:effectChips(c,c.cost||0),ready:player().treasury>=(c.cost||0)}))});
 const pd=politicalDispatch(game);
 if(pd)out.push({key:'dispatch:'+pd.title,badge:'COUNCIL DISPATCH',title:pd.title,desc:pd.description,imgKey:'dispatch',choices:(pd.choices||[]).map((c,i)=>({label:c.label+(c.cost?' ('+c.cost+'g)':''),kind:'dispatch',id:String(i),chips:effectChips(c,c.cost||0),ready:player().treasury>=(c.cost||0)}))});
 const inc=activityIncident(game);
 if(inc)out.push({key:'incident:'+inc.title,badge:'ROYAL JOURNEY',title:inc.title,desc:inc.desc,imgKey:'pilgrimage',choices:(inc.choices||[]).map((ch,i)=>({label:ch[0]+(ch[1]?' ('+ch[1]+'g)':''),kind:'incident',id:String(i),chips:ch[1]?[{label:'Treasury',delta:-ch[1]}]:[],ready:player().treasury>=(ch[1]||0)}))});
 const ch=currentChain(game);
 if(ch&&game.turn>=ch.due)out.push({key:'chain:'+ch.id+':'+ch.stage,badge:ch.name+' · '+(ch.stage+1)+'/'+ch.stageCount,title:ch.title,desc:ch.desc,imgKey:ch.id,actor:ch.target,choices:(ch.choices||[]).map((c,i)=>({label:c[0]+(c[1]?' ('+c[1]+'g)':''),kind:'chain',id:String(i),chips:c[1]?[{label:'Treasury',delta:-c[1]}]:[],ready:player().treasury>=(c[1]||0)}))});
 const obit=game.chronicles?.pendingObituary;
 if(obit&&obit.realm===game.player){
  const partInfo=obit.partition?.distributed?.length?` Realm partitioned under ${obit.partition.law||'partition'}: ${obit.partition.distributed.map(d=>d.provinces?`${d.heirName||d.lordName} received ${d.provinces.length} domain(s)`:`${d.lordName||d.heirName} received ${d.province}`).join('; ')}.`:'';
  out.push({key:'obituary:'+obit.rulerId+':'+obit.deathYear,badge:'DYNASTY CHRONICLE · ROYAL OBITUARY',title:`${obit.rulerName} ${obit.epithet||''} (${obit.reignStart}–${obit.deathYear})`,desc:`Aged ${obit.ageAtDeath}. Cause of death: ${obit.deathReason}. ${obit.summary}${partInfo}`,imgKey:'succession',actor:obit.successorId||null,choices:[{label:'Inscribe into the Royal Chronicle',kind:'obituary',id:'ack',chips:[],ready:true}]});
 }
 const sb=currentStressBreak(game);
 if(sb){
  const sbBadge=sb.tier==='crisis'?`STRESS CRISIS · STAGE ${sb.stage||1}/2`:sb.tier==='major'?'MAJOR MENTAL BREAK':'MINOR MENTAL BREAK';
  out.push({key:'stress:'+sb.personId+':'+sb.tier+':'+(sb.stage||1)+':'+sb.turn,badge:sbBadge,tier:'critical',title:sb.title||'The Weight of the Crown',desc:sb.desc||`Stress reached ${sb.stress}/300. Choose how to cope.`,imgKey:'fever',actor:sb.personId,choices:(sb.choices||[]).map(c=>({label:c.label+(c.cost?' ('+c.cost+'g)':''),kind:'stress-break',id:c.id,chips:effectChips(c,c.cost||0),ready:player().treasury>=(c.cost||0)}))});
 }
 const pe=currentPartitionEvent(game);
 if(pe)out.push({key:'partition:'+pe.year+':'+pe.turn,badge:'REALM PARTITION · '+String(pe.law||'GAVELKIND').toUpperCase(),tier:'critical',title:pe.title,desc:pe.desc,imgKey:'succession',actor:pe.heirId||null,choices:(pe.choices||[]).map(c=>({label:c.label+(c.cost?' ('+c.cost+'g)':''),kind:'partition-event',id:c.id,chips:effectChips(c,c.cost||0),ready:player().treasury>=(c.cost||0)}))});
 const sw=currentSuccessionWarEvent(game);
 if(sw)out.push({key:'succession-war:'+sw.claimantId+':'+(sw.stage||1)+':'+sw.turn,badge:`CONTESTED SUCCESSION · STAGE ${sw.stage||1}/2`,tier:'critical',title:sw.title,desc:sw.desc,imgKey:'war',actor:sw.claimantId||null,choices:(sw.choices||[]).map(c=>({label:c.label+(c.cost?' ('+c.cost+'g)':''),kind:'succession-war',id:c.id,chips:effectChips(c,c.cost||0),ready:player().treasury>=(c.cost||0)}))});
 const he=currentHeirEducationEvent(game,game.player);
 if(he)out.push({key:'heir-edu:'+he.heirId+':'+he.eventId,badge:'HEIR EDUCATION · AGE '+he.age,title:he.title,desc:he.desc,imgKey:'scholar',actor:he.heirId,choices:(he.choices||[]).map(c=>({label:c.label+(c.cost?' ('+c.cost+'g)':''),kind:'heir-edu',id:c.id,chips:effectChips(c,c.cost||0),ready:player().treasury>=(c.cost||0)}))});
 const rd=currentRegencyDrama(game,game.player);
 if(rd)out.push({key:'regency:'+rd.id+':'+rd.turn,badge:'REGENCY CRISIS',title:rd.title,desc:rd.text||rd.desc||'',imgKey:'dispatch',actor:rd.regentId,choices:(rd.choices||[]).map((c,i)=>({label:c.label+(c.cost?' ('+c.cost+'g)':''),kind:'regency-drama',id:String(i),chips:effectChips(c,c.cost||0),ready:player().treasury>=(c.cost||0)}))});
 const fc=currentFaithConversionChoice(game,game.player);
 if(fc)out.push({key:'faith-conv:'+fc.province+':'+fc.turn,badge:'RELIGIOUS SETTLEMENT',title:fc.title,desc:fc.desc,imgKey:'pilgrims',choices:(fc.choices||[]).map((c,i)=>({label:c.label+(c.cost?' ('+c.cost+'g)':''),kind:'faith-conv',id:String(i),chips:effectChips(c,c.cost||0),ready:player().treasury>=(c.cost||0)}))});
 const ca=currentAssimilationEvent(game,game.player);
 if(ca)out.push({key:'culture-assim:'+ca.province+':'+ca.turn,badge:'CULTURAL ASSIMILATION',title:ca.title,desc:ca.desc,imgKey:'festival',choices:(ca.choices||[]).map((c,i)=>({label:c.label+(c.cost?' ('+c.cost+'g)':''),kind:'culture-assim',id:String(i),chips:effectChips(c,c.cost||0),ready:player().treasury>=(c.cost||0)}))});
 const capEv=currentCapitalEvent(game);
 if(capEv)out.push({key:'capital-event:'+capEv.id+':'+capEv.turn,badge:'LIVING CAPITAL EVENT',title:capEv.title,desc:capEv.desc,imgKey:'guilds',choices:(capEv.choices||[]).map(c=>({label:c.label+(c.cost?' ('+c.cost+'g)':''),kind:'capital-event',id:c.id,chips:effectChips(c,c.cost||0),ready:player().treasury>=(c.cost||0)}))});
 const ecoD=currentEconomicDilemma(game);
 if(ecoD)out.push({key:'econ-dilemma:'+ecoD.id+':'+ecoD.turn,badge:'ECONOMIC CRISIS',title:ecoD.title,desc:ecoD.desc,imgKey:'drought',choices:(ecoD.choices||[]).map(c=>({label:c.label+(c.cost?' ('+c.cost+'g)':''),kind:'econ-dilemma',id:c.id,chips:effectChips(c,c.cost||0),ready:player().treasury>=(c.cost||0)}))});
 const chaos=currentChaosEvent(game);
 if(chaos)out.push({key:'chaos:'+chaos.id+':'+chaos.turn,badge:'EMERGENT CHRONICLE',title:chaos.title,desc:chaos.desc,imgKey:'embassy',actor:chaos.actorId||null,choices:(chaos.choices||[]).map(c=>({label:c.label+(c.cost?' ('+c.cost+'g)':''),kind:'chaos-event',id:c.id,chips:effectChips(c,c.cost||0),ready:player().treasury>=(c.cost||0)}))});
 const br=game.military?.pendingBrokenRegiment;
 if(br&&br.realm===game.player)out.push({key:'broken-regiment:'+br.armyId+':'+br.turn,badge:'BROKEN REGIMENT',title:`Shattered Banner at ${br.province}`,desc:`${br.commander} barely escaped with the surviving remnants of the routed regiment. Rally the stragglers or disband the banner?`,imgKey:'riders',choices:[{label:'Rally & refit stragglers (60g)',kind:'broken-regiment',id:'rally',chips:[{label:'Treasury',delta:-60},{label:'Troops',delta:65}],ready:player().treasury>=60},{label:'Disband & absorb into garrison',kind:'broken-regiment',id:'disband',chips:[{label:'Stability',delta:-2}],ready:true}]});
 void liveWorld;
 return out;
}
function closeEventModal(){const m=el('event-modal');if(m){const wasOpen=!m.hidden;m.hidden=true;m.innerHTML='';if(wasOpen)syncAudioState();}}
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
 el('event-modal-defer').focus();
 syncAudioState();
}
function maybePopupEventModal(prevKeys,records){
 if(!game||battle||vassalCareer(game))return;
 const prompts=collectEventPrompts().filter(event=>!deferredModalEvents.has(event.key)&&!prevKeys.has(event.key));
 deliver(prompts,records,{
  pause(){if(speedInterval){clearInterval(speedInterval);speedInterval=null;el('auto-time').textContent='▶';}},
  showEvent:renderEventModal,
  notify:message,
  sound:()=>browserCampaignAudio.playSfx('chime')
 });
}
function start(id){el('hometown-screen').hidden=true;pageHistory.reset();characterId=null;tab='realm';deferredModalEvents.clear();closeEventModal();useWorld(atlasWorld);game=createGame(world,id);game.kingdom.difficulty=el('start-difficulty').value;el('start-screen').hidden=true;document.body.classList.add('in-campaign');document.body.classList.remove('in-battle');document.body.dataset.state='playing';selected=capitalDistrict(world,id)?.id||null;map.setGame(game);if(selected)map.select(selected);const f=player();map.focus(...(staticById[selected]?.centroid||f.capital),3.2);browserCampaignAudio.unlock();browserCampaignAudio.playSfx('seal');render();onboarding?.render();save(false);syncAudioState();}
function updateSoundButton(){const b=el('battle-sound');b.setAttribute('aria-pressed',String(battleSound));b.textContent=battleSound?'Sound on':'Sound off';}
function openBattle(desc){el('hometown-screen').hidden=true;setDrawer(null);closeEventModal();onboarding?.mark('battle');desc.soundEnabled=battleSound;updateSoundButton();
 const fortLevel=desc.fortLevel??(game?.provinces?.[desc.to]?.buildings?.fort||0);
 const siege=Boolean(desc.siegeMode);
 desc.graphicsQuality=desc.graphicsQuality||el('battle-quality')?.value||(()=>{try{return localStorage.getItem('crown-of-nations.gfx-quality')||'medium';}catch{return 'medium';}})();
 if(el('battle-quality'))el('battle-quality').value=desc.graphicsQuality;
 desc.interactive=true;desc.fieldBattle=!siege;desc.simpleField=true;desc.bannerView=Boolean(desc.bannerView);el('battle-screen').classList.toggle('field-command',!siege);el('battle-screen').hidden=false;el('battle-result').hidden=true;document.body.classList.add('in-battle');document.body.dataset.state='battle';
 el('battle-move-tap').setAttribute('aria-pressed','false');el('battle-camera').value='overview';el('battle-camera').hidden=desc.bannerView;el('battle-zoom-in').hidden=false;el('battle-zoom-out').hidden=false;if(el('battle-speed'))el('battle-speed').textContent='1×';if(el('battle-rally')){el('battle-rally').disabled=true;el('battle-rally').textContent='⚑ RALLY';}
 const eb=el('battle-event-banner');if(eb){eb.hidden=true;eb.textContent='';}
 el('battle-title').textContent=desc.showcase?(siege?'BATTLE SHOWCASE · FORTRESS SIEGE':'BATTLE SHOWCASE · FIELD BATTLE'):desc.defenseMode?(siege?'DEFEND FORT · '+desc.to.toUpperCase():'DEFEND '+desc.to.toUpperCase()):(siege?'SIEGE OF '+desc.to.toUpperCase():'ASSAULT '+desc.to.toUpperCase());
 el('battle-meta').textContent=desc.showcase?(siege?`PRACTICE SIEGE · FORT LV. ${desc.fortLevel||2} · NO EFFECT ON CAMPAIGN`:'PRACTICE BATTLE · NO EFFECT ON CAMPAIGN'):`${player().name.toUpperCase()} VS ${ownerName(game,desc.enemy).toUpperCase()} · ${desc.defenseMode?'DEFENSIVE':siege?'SIEGE ASSAULT':'FIELD'} BATTLE`;
 if(desc.alliedTroops)el('battle-meta').textContent+=' · '+fmt(desc.alliedTroops)+' ALLIED TROOPS';
 el('battle-units').dataset.deckKey='';battleDescriptor=desc;try{battle=new BattleGame(freshBattleCanvas(el('battle-canvas')),desc,game,onBattleFinished,onBattleStatus,{overlayCanvas:el('battle-overlay')});globalThis.__activeBattle=battle;document.body.style.overflow='hidden';syncAudioState();return true;}catch(e){battleDescriptor=null;el('battle-screen').hidden=true;document.body.dataset.state='playing';syncAudioState();message(`Battle couldn't start: ${e.message}`);return false;}}
function onBattleStatus(status){
 const roster=status.roster;
 const field=!!battleDescriptor?.fieldBattle;
 if(roster)el('battle-strength').textContent=status.reserveCount?`${status.reserveCount} in reserve`:'';
 const eb=el('battle-event-banner');if(eb){const lastEv=status.battleEvents?.[status.battleEvents.length-1];eb.hidden=!lastEv;if(lastEv)eb.textContent='⚠ '+lastEv.text;}
 const orderControl=el('battle-order');
 orderControl.hidden=status.deployment||!field;
 el('battle-all-order').hidden=orderControl.hidden;
 el('battle-move-tap').setAttribute('aria-pressed',String(!!status.tapMove));el('battle-pause').textContent=status.paused?'▶ RESUME':'Ⅱ PAUSE';el('battle-pause').disabled=!!status.renderLost;el('battle-start').disabled=!!status.renderLost;el('battle-strength').dataset.renderer=status.rendererMode||'';if(status.renderLost)el('battle-strength').textContent='Graphics context lost. Use Cancel deployment or retreat to return to campaign.';
 const spd=el('battle-speed');if(spd)spd.textContent=(status.battleSpeed||1)+'×';
 const rBtn=el('battle-rally');if(rBtn){const cd=Math.ceil(status.rallyCooldown||0);rBtn.disabled=!!status.deployment||cd>0;rBtn.textContent=cd>0?'⚑ '+cd+'s':'⚑ RALLY';}
 const ours=status.groups.filter(g=>g.side==='attacker'),unit=ours[status.selected];
 const focusEl=el('battle-focus');if(focusEl){focusEl.hidden=!unit;if(unit){const flags=(unit.statusFlags||[]).join(' · ');focusEl.textContent=(unit.isCommander?'♛ '+(unit.commanderName||'General')+' · ':'')+(unit.profile?.name||unit.type).toUpperCase()+' · '+cardRoleHint(unit)+(flags?' · '+flags:'');}}
 const cards=el('battle-units'),deckKey=ours.map(g=>g.id+':'+g.troopCount+':'+g.specialistId+':'+(g.isCommander?1:0)).join('|');
 if(cards.dataset.deckKey!==deckKey||!cards.children.length){
  cards.dataset.deckKey=deckKey;
  const cmdPerson=status.commanders?.attacker?.id&&game?.politics?.people?.[status.commanders.attacker.id]
   ||game?.politics?.people?.[game?.politics?.realms?.[game?.player]?.ruler]||null;
  const cmdMark=cmdPerson?portraitMark(cmdPerson):null;
  const cmdAvatarHtml=cmdPerson?`<span class="commander-portrait-avatar" style="background:${cmdMark.color}" title="${esc(cmdPerson.name)}">${portraitImage(cmdPerson)||esc(cmdMark.initials)}</span>`:'';
  cards.innerHTML=ours.map((g,i)=>'<button class="unitcard'+(g.isCommander?' commander-card':'')+'" data-unit="'+i+'"><span class="regiment-icon">'+(g.isCommander&&cmdAvatarHtml?cmdAvatarHtml:regimentCardIcon(g))+'</span><span class="regiment-count"></span><b>'+esc(g.profile?.name||g.type)+'</b><small class="regiment-leader">'+(g.isCommander?'♛ '+esc(g.commanderName||cmdPerson?.name||'General'):'')+'</small><small class="regiment-status"></small><span class="unithealth"><span></span></span><span class="regiment-morale"><span></span></span><small class="regiment-flags"></small></button>').join('');
 }
 for(let i=0;i<ours.length;i++){const g=ours[i],b=cards.children[i];b.classList.toggle('active',i===status.selected);b.classList.toggle('reserve',!!g.reserve);b.disabled=!!g.routed||g.life<=0||(!field&&!status.deployment&&!g.reserve);b.setAttribute('aria-pressed',String(i===status.selected));b.querySelector('.regiment-count').textContent=fmt(Math.round(g.troopCount*g.life/100));b.querySelector('.regiment-status').textContent=g.routed?'Routed':g.reserve?'Reserve · tap to deploy':status.deployment?(g.formationId||'line').replaceAll('_',' '):({advance:'Advance',charge:'Charge',hold:'Hold',brace:'Braced',fallback:'Fall back',move:'Moving'}[g.fieldOrder]||'Fighting');b.querySelector('.unithealth span').style.width=Math.max(0,g.life)+'%';const mSpan=b.querySelector('.regiment-morale span');if(mSpan)mSpan.style.width=Math.max(0,Math.min(100,Math.round(g.morale??75)))+'%';const fEl=b.querySelector('.regiment-flags');if(fEl)fEl.textContent=(g.statusFlags||[]).slice(0,2).join(' · ');}
 const reserves=el('battle-reserve');reserves.hidden=!status.deployment;reserves.disabled=!unit||!!unit.routed||(!unit.reserve&&status.reserveCount>=Math.min(3,ours.length-1));reserves.textContent=unit?.reserve?'Return to line':'Hold in reserve';
 const timer=el('battle-timer');timer.textContent=status.deployment?'Deployment':Math.max(0,100-Math.floor(status.elapsed))+'s LEFT';
 if(roster){for(const [side,r] of [['your',roster.attacker],['enemy',roster.defender]]){const active=status.deployment?r.initial:fieldActiveCount(status.groups,side==='your'?'attacker':'defender');el('battle-'+side+'-count').textContent=fmt(active)+' / '+fmt(r.initial);el('battle-'+side+'-bar').style.width=(r.initial?Math.round(active/r.initial*100):0)+'%';}}
 const choices=unit?cardFormationChoices(unit,availableFormations(game.factions[game.player],true)):[];
 const formations=el('battle-formation');const choiceKey=choices.map(o=>o.id).join(',');if(formations.dataset.choices!==choiceKey){formations.dataset.choices=choiceKey;formations.innerHTML=choices.map(o=>'<option value="'+o.id+'">'+esc(o.name)+'</option>').join('');}
 if(unit&&document.activeElement!==formations)formations.value=unit.formationId;el('battle-order').title=unit?(unit.terrainName||'Open field')+' · Enemy posture: '+(status.enemyPosture||'Deploying'):'Regiment order';const order=el('battle-order');if(unit&&document.activeElement!==order&&unit.fieldOrder!=='move'&&[...order.options].some(o=>o.value===unit.fieldOrder))order.value=unit.fieldOrder;
 const fort=el('battle-fort-status');if(fort){fort.hidden=!status.siege;fort.textContent=status.siege?status.siege.structures.map(q=>q.name+' '+Math.round(q.hp/q.max*100)+'%').join(' · '):'';}
 const postureEl=el('battle-posture');if(postureEl){const label=status.enemyPosture&&status.enemyPosture!=='Deploying'?status.enemyPosture:'';postureEl.hidden=!label||!!status.deployment;postureEl.textContent=label?'ENEMY AI · '+label.toUpperCase():'';}
 el('battle-screen').classList.toggle('deploying',!!status.deployment);el('battle-presets').hidden=!status.deployment;formations.hidden=!status.deployment;el('battle-formation-label').hidden=!status.deployment;el('battle-retreat').hidden=status.deployment;el('battle-pause').hidden=status.deployment;el('battle-speed').hidden=status.deployment;el('battle-camera').hidden=status.rendererMode==='banner';el('battle-rally').hidden=!!status.deployment||!battle?.descriptor?.fieldBattle;el('battle-guide').textContent=status.deployment?'Choose a regiment, then place it on your side of the field.':status.reserveCount?'Select a reserve card and tap your deployment zone. Remaining reserves join after 12 seconds.':'Select a regiment and tap an enemy to attack or open ground to move.';
 el('battle-lanes').hidden=true;el('battle-start').hidden=!status.deployment;el('battle-cancel').hidden=!status.deployment||!!battleDescriptor?.defenseMode&&!status.renderLost;const comparison=el('battle-comparison');comparison.hidden=!status.deployment||!field;
 if(!comparison.hidden){
  const c=battleComparison(status.groups);
  const line=(side,name,commander)=>`<div><b>${name}${commander?' · '+esc(commander.name):''}</b><small>${fmt(side.mix.infantry)} infantry · ${fmt(side.mix.archers)} archers · ${fmt(side.mix.cavalry)} cavalry · ${fmt(side.morale)}% morale</small></div>`;
  const summary=line(c.attacker,'Your army',status.commanders?.attacker)+line(c.defender,'Opposing army',status.commanders?.defender);
  if(comparison._summary!==summary){
   comparison._summary=summary;
   comparison.innerHTML=summary;
  }
 }
}
function onBattleFinished(result){
 const defense=!!battleDescriptor?.defenseMode,practice=!!battleDescriptor?.showcase,win=result.victory;
 el('battle-result').hidden=false;
 const title=result.reason==='deadlock'?'STALEMATE · '+(win?'DEFENDERS HOLD':'ATTACKERS WITHDRAW'):defense?(win?'THE INVADERS WERE REPELLED':'THE DEFENDERS WERE DEFEATED'):(win?'GLORIOUS VICTORY':'THE ARMY WITHDRAWS');
 const explanation=practice?'Practice battle; your campaign will not be changed.':
   defense?(win?'Your army held the field.':'Your defensive position has been overrun.'):
   win?(activeWar(game,game.player,battleDescriptor.enemy)?'The province will be occupied pending peace.':'The enemy province will be taken.'):'Your army has retreated.';
 const ts=result.tacticalStats||{},statParts=[ts.cavalryCharges&&'Cavalry charges '+ts.cavalryCharges,ts.bracedCounters&&'Braced counters '+ts.bracedCounters,ts.flankStrikes&&'Flank strikes '+ts.flankStrikes,ts.encirclements&&'Encirclements '+ts.encirclements,ts.volleyHits&&'Volley hits '+ts.volleyHits,ts.highGroundShots&&'High-ground shots '+ts.highGroundShots,ts.ralliesUsed&&'Rallies '+ts.ralliesUsed].filter(Boolean);
 const reasons=Array.isArray(result.summaryReasons)&&result.summaryReasons.length?'<div class="rule"><b>WHY THIS BATTLE ENDED THIS WAY</b>'+result.summaryReasons.map(r=>'<p class="smallnote">• '+esc(r)+'</p>').join('')+(statParts.length?'<p class="smallnote">'+esc(statParts.join(' · '))+'</p>':'')+'</div>':'';
 const roster=result.roster,report=roster?'<div class="battle-report"><div><b>YOUR FIELD FORCE</b><small>Deployed '+fmt(roster.attacker.initial)+' · Surviving '+fmt(roster.attacker.surviving)+' · Losses '+fmt(roster.attacker.losses)+' · Routed survivors '+fmt(roster.attacker.routed)+'</small></div><div><b>ENEMY FIELD FORCE</b><small>Deployed '+fmt(roster.defender.initial)+' · Surviving '+fmt(roster.defender.surviving)+' · Losses '+fmt(roster.defender.losses)+' · Routed survivors '+fmt(roster.defender.routed)+'</small></div><small>Battlefield estimates include participating garrisons; campaign outcomes may differ.</small></div>':'';
 el('battle-result').innerHTML='<div class="resultcard"><div class="small-ornament">THE CHRONICLERS REPORT</div><div class="hero-crest">'+(win?'♛':'⚔')+'</div><h2>'+title+'</h2><p>'+explanation+' Remaining strength: '+Math.round(result.attackerRemaining*100)+'%. Battle duration: '+result.seconds+' seconds.'+(result.reason?' · '+esc(result.reason):'')+'</p>'+reasons+report+'<button id="battle-return" class="goldbtn primary">RETURN TO CAMPAIGN ›</button></div>';
 el('battle-return').onclick=()=>{
  if(!battle)return;el('battle-return').disabled=true;
  if(!practice){
   if(defense){const r=resolveInvasion(game,world,battleDescriptor.threat,result);if(!r.ok)message(r.msg);}
   else {const r=concludeBattle(game,battleDescriptor,result,world);if(r&&!r.ok)message(r.msg);}
  }
  battle.stop();battle=null;globalThis.__activeBattle=null;battleDescriptor=null;el('battle-screen').hidden=true;
  document.body.classList.remove('in-battle');document.body.dataset.state='playing';
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
 const garrison=Math.round((45+defense.development*12+(defense.buildings.fort||0)*45)*hometownModifiers(game,game.player).defense);
 const opposingContingents=fieldContingentsAt(game,threat.by,enemyArmy.province,game.player),invaders=[...nativeInvasionArmies(game,threat),...opposingContingents];
 return openBattle({defenseMode:true,attacker:stationed[0]?.id||null,playerArmies:defenders.map(a=>a.id),alliedTroops:guests.reduce((n,a)=>n+armySize(a),0),
  enemyArmy:threat.army,enemyArmies:invaders.map(a=>a.id),enemy:threat.by,from:enemyArmy.province,
  to:threat.province,defenseTroops:invaders.reduce((n,a)=>n+armySize(a),0),defenseGarrison:garrison+defenseSupport(game,game.player,threat.by),
  threat:{army:threat.army,province:threat.province}});
}
function advanceWithInvasions(){
 if(!game||battle)return;
 onboarding?.mark('month');
 if(vassalCareer(game)){const threat=game.kingdom?.threats?.find(t=>t.status==='ready');if(threat)autoResolveInvasion(game,world,threat);advanceMonth(game,world);render();syncAudioState();save(false);return;}
 if(openIncomingBattle())return;
 const prevKeys=new Set(collectEventPrompts().map(e=>e.key));
 observeRecords(game);
 advanceMonth(game,world);const records=observeRecords(game);render();syncAudioState();save(false);
 if(game.year>=1600&&game.chronicles&&!game.chronicles.finaleShown){
  game.chronicles.finaleShown=true;
  if(speedInterval){clearInterval(speedInterval);speedInterval=null;el('auto-time').textContent='▶';}
  openChronicleEndScreen(el('chronicle-endscreen-modal'),game,esc,message,replayGreatestBattle);
  return;
 }
 if(openIncomingBattle()){if(speedInterval){clearInterval(speedInterval);speedInterval=null;el('auto-time').textContent='▶';}return;}
 maybePopupEventModal(prevKeys,records);
}
const onboarding=createOnboardingController(el('onboarding-strip'),{
 onOpenTab(t){if(game&&!battle)navigateTab(t);},
 onOpenCapital(){el('open-hometown')?.click();},
 onOpenBattle(){el('battle-showcase')?.click();},
 onNextMonth(){advanceWithInvasions();}
});
// Bind controls once. Rebuilt content uses delegated events.
installSettings({
 onGraphicsChange(v){if(el('battle-quality'))el('battle-quality').value=v;battle?.setGraphicsQuality?.(v);message('Graphics quality: '+v.toUpperCase());},
 onAudioBusChange(bus,v){browserCampaignAudio.setBusVolume(bus,v);battle?.audio?.setBusVolume?.(bus,v);},
 onColorblindChange(on){applyColorblind(!!on);message(on?'Color-blind safe palette enabled':'Standard palette restored');},
 onLocaleChange(loc){applyTranslations(document,loc);message('Language: '+loc.toUpperCase());},
 onKeybindingsChange(){message('Custom keybindings updated.');},
 onResetOnboarding(){onboarding?.reset();message('First-hour sovereign guide restored.');}
});
applyTranslations(document,preferences.locale);
el('hud-steward-advice')?.addEventListener('click',()=>{if(game&&!battle)navigateTab('economy');});
bindRoyalEconomy(el('tab-content'),renderTab);
bindJournal(el('tab-content'),renderTab,key=>{
 const event=collectEventPrompts().find(prompt=>prompt.key===key);
 if(!event)return;
 if(speedInterval){clearInterval(speedInterval);speedInterval=null;el('auto-time').textContent='▶';}
 renderEventModal(event);
});
el('start-world-count').textContent=atlasWorld.factions.length+' REALMS · '+atlasWorld.provinces.length+' DISTRICTS';
function renderStartFaction(){
 const id=el('start-faction').value;
 const realm=atlasWorld.factions.find(f=>f.id===id);
 const featured=featuredStartsCatalog();
 el('start-new').disabled=!realm;
 el('featured-starts').innerHTML=featured.map(start=>{
  const active=start.id===id;
  return `<button type="button" class="featured-start-btn${active?' active':''}" data-pick-realm="${esc(start.id)}" aria-pressed="${active}" title="${esc(start.difficulty)}">${esc(start.title.split(' of ').pop())}</button>`;
 }).join('');
 const info=el('start-faction-info');
 const capital=realm&&capitalDistrict(atlasWorld,id);
 const art=capital&&provinceArt(capital,realm);
 const illustration=el('start-landscape');
 illustration.hidden=!art;
 if(art){
  el('start-landscape-image').src=art;
  el('start-landscape-caption').textContent=capital.name+' · '+realm.name;
 }
 if(!realm){
  info.textContent='No matching kingdoms. Try another name or region.';
  return;
 }
 const count=atlasWorld.provinces.filter(province=>province.owner===id).length;
 const history=historicalContext(id);
 const feature=featured.find(start=>start.id===id);
 info.innerHTML=`<div class="start-realm-heading">${assetImage(realmEmblem(realm),'realm-emblem start-emblem')}<div><strong>${esc(realm.name)}</strong><small>${esc(realm.continent)} · ${count} districts · ${esc(militaryDoctrine(realm).name)}</small></div></div>
 ${feature?`<p>${esc(feature.summary)}</p>`:''}
 ${history?`<details><summary>Historical context</summary><p>${esc(history.context)}</p></details>`:''}`;
}
function filterStartRealms(preferred=el('start-faction').value){const list=searchRealms(atlasWorld.factions,el('realm-search').value);el('start-faction').innerHTML=list.map(f=>`<option value="${esc(f.id)}">${esc(f.name)} — ${esc(f.continent)}</option>`).join('');if(list.some(f=>f.id===preferred))el('start-faction').value=preferred;renderStartFaction();}
el('featured-starts')?.addEventListener('click',e=>{const b=e.target.closest('[data-pick-realm]');if(!b)return;el('realm-search').value='';filterStartRealms(b.dataset.pickRealm);});
el('realm-search').addEventListener('input',()=>filterStartRealms());el('start-faction').addEventListener('change',renderStartFaction);filterStartRealms('vijayanagara');
el('start-new').addEventListener('click',()=>{if(atlasWorld.factions.some(f=>f.id===el('start-faction').value))start(el('start-faction').value);});
try{if(readBestLocalSave(localStorage))el('load-existing').hidden=false;}catch{}
loadCampaignDurable({storage:localStorage}).then(res=>{if(res?.raw&&el('load-existing'))el('load-existing').hidden=false;}).catch(()=>{});
el('mobile-thumb-bar')?.addEventListener('click',e=>{const b=e.target.closest('[data-thumb-nav]');if(!b||!game||battle)return;const nav=b.dataset.thumbNav;if(nav==='map')setDrawer(null);else if(nav==='dispatch')navigateTab('realm');else if(nav==='court')navigateTab('court');else if(nav==='diplomacy')navigateTab('diplomacy');else if(nav==='search')navigateTab('search');});
if(typeof navigator!=='undefined'&&'serviceWorker'in navigator&&['http:','https:'].includes(location.protocol)){navigator.serviceWorker.register('./sw.js').catch(()=>{});}
el('load-existing').addEventListener('click',()=>load('autosave'));
el('import-save').addEventListener('click',()=>el('save-file').click());
el('save-file').addEventListener('change',async e=>{const f=e.target.files?.[0];e.target.value='';if(!f)return;try{if(f.size>MAX_SAVE_BYTES)throw Error('Save exceeds 20 MB.');loadRaw(await f.text(),true);}catch(err){el('import-status').textContent='Could not import: '+err.message;message('Could not import: '+err.message);}});
el('export-save').addEventListener('click',exportSave);
el('save-game').addEventListener('click',()=>save(true,'autosave'));
refreshSaveSlots();
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
const MAP_MODE_TITLES={political:'POLITICAL',vassals:'VASSALS',diplomacy:'DIPLOMACY',dynasty:'DYNASTIES',dejure:'DE JURE KINGDOMS',duchies:'DE JURE DUCHIES',government:'GOVERNMENTS',opinion:'OPINION',revolt:'REVOLT',economy:'PROSPERITY',control:'BARONS & FORTS',trade:'TRADE & WEALTH',epidemics:'DISEASE',culture:'CULTURE',religion:'RELIGION',terrain:'TERRAIN',historical:'1450 REFERENCE'};
const toggleMapModeBar=()=>{const m=el('map-modes');m.hidden=!m.hidden;el('show-map-modes')?.setAttribute('aria-expanded',String(!m.hidden));el('mapmode-toggle')?.setAttribute('aria-expanded',String(!m.hidden));const opts=document.querySelector('.map-options');if(opts)opts.open=false;updateMapLegend();};
el('map-modes').addEventListener('click',e=>{const button=e.target.closest('[data-mapmode]');if(!button)return;const mode=button.dataset.mapmode;map.setMode(mode);el('mapmode').textContent=MAP_MODE_TITLES[mode]||mode.toUpperCase();for(const b of el('map-modes').querySelectorAll('[data-mapmode]')){const active=b===button;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active));}updateMapLegend();if(mode==='historical')message('Reference map: 1450 borders prioritize balanced campaign districts.');});
const closeHometown=()=>{el('hometown-screen').hidden=true;};
el('open-hometown').addEventListener('click',()=>{if(!game||battle)return;const r=openHometown(game,world);if(!r.ok){message(r.msg);return;}onboarding?.mark('capital');if(speedInterval){clearInterval(speedInterval);speedInterval=null;el('auto-time').textContent='▶';}cancelMarch();setDrawer(null);el('hometown-screen').hidden=false;renderHometown(game,world,el('hometown-screen'));save(false);});
bindHometown(el('hometown-screen'),()=>game,()=>world,message,save,render,closeHometown,advanceWithInvasions);
el('open-management').addEventListener('click',()=>{if(el('management-panel').hidden)navigateTab(tab);else setDrawer(null);});
el('open-province').addEventListener('click',()=>{if(!game)return;if(!el('province-drawer').hidden){setDrawer(null);return;}renderInspector();setDrawer('province');});
el('capital-nav').addEventListener('click',()=>el('open-hometown').click());
el('open-priorities').addEventListener('click',()=>{selectJournal('alerts');navigateTab(vassalCareer(game)?'realm':'chronicle');});
for(const id of ['close-management','close-province','panel-scrim'])el(id).addEventListener('click',()=>setDrawer(null));
el('cancel-march').addEventListener('click',cancelMarch);
document.addEventListener('keydown',e=>{
 if(e.key==='Escape'){closeHometown();closePopover();hideTooltip(true);if(!battle){setDrawer(null);cancelMarch();}}
 if(['INPUT','TEXTAREA','SELECT'].includes(e.target?.tagName)||e.target?.isContentEditable)return;
 const kb=getKeybindings();
 const match=bind=>bind===' '?e.key===' '||e.code==='Space':e.key.toLowerCase()===String(bind).toLowerCase();
 if(match(kb.lockTooltip)&&tooltipState.target){e.preventDefault();tooltipState.locked=true;tooltipState.level=tooltipState.level>=3?1:tooltipState.level+1;showTooltipFor(tooltipState.target,tooltipState.x,tooltipState.y,tooltipState.level,true);return;}
 if(battle&&match(kb.battlePause)){e.preventDefault();battle.togglePause();return;}
 if(!game||battle||e.ctrlKey||e.metaKey||e.altKey)return;
 if(match(kb.search)){e.preventDefault();navigateTab('search');el('campaign-query')?.focus();}
 else if(match(kb.nextMonth)){e.preventDefault();advanceWithInvasions();}
 else if(match(kb.togglePause)){e.preventDefault();el('auto-time')?.click();}
 else if(match(kb.openHometown)){e.preventDefault();el('open-hometown')?.click();}
 else if(match(kb.openChronicle)){e.preventDefault();selectJournal('timeline');navigateTab(vassalCareer(game)?'realm':'chronicle');}
});
el('show-map-modes').addEventListener('click',toggleMapModeBar);
el('mapmode-toggle')?.addEventListener('click',toggleMapModeBar);
document.addEventListener('click',e=>{
 const tipBtn=e.target.closest?.('[data-tip-action]');
 if(tipBtn&&tooltipState.target){
  if(tipBtn.dataset.tipAction==='expand'){tooltipState.locked=true;tooltipState.level=tooltipState.level>=3?1:tooltipState.level+1;showTooltipFor(tooltipState.target,tooltipState.x,tooltipState.y,tooltipState.level,true);}
  else if(tipBtn.dataset.tipAction==='close'){hideTooltip(true);}
  return;
 }
 if(tooltipState.locked&&!e.target.closest?.('#ui-tooltip')&&!e.target.closest?.('[data-tooltip],[data-tooltip-detail]'))hideTooltip(true);
 const pop=el('map-popover');
 const pbtn=e.target.closest('[data-popover-idx]');
 if(pbtn&&pop?._actions){const act=pop._actions[Number(pbtn.dataset.popoverIdx)];closePopover();act?.fn();return;}
 const qp=e.target.closest('[data-quick-province]');
 if(qp){const r=qp.getBoundingClientRect();openQuickPopover('province',qp.dataset.quickProvince,r.left,r.bottom+4);return;}
 const qc=e.target.closest('[data-quick-character]');
 if(qc){const r=qc.getBoundingClientRect();openQuickPopover('character',qc.dataset.quickCharacter,r.left,r.bottom+4);return;}
 if(pop&&!pop.hidden&&!e.target.closest('#map-popover'))closePopover();
});
const showTooltipFor=(target,x,y,level=tooltipState.locked?tooltipState.level:1,locked=tooltipState.locked)=>{
 const tip=el('ui-tooltip');if(!tip||!target)return;
 let text=target.dataset.tooltip||'';
 if(!text&&target.dataset.character&&game)text=tooltipData(game,world,'character',target.dataset.character);
 if(!text&&target.dataset.provinceLink&&game)text=tooltipData(game,world,'province',target.dataset.provinceLink);
 if(!text){tip.hidden=true;return;}
 tooltipState.target=target;tooltipState.x=x;tooltipState.y=y;tooltipState.level=level;tooltipState.locked=locked;
 const detail=target.dataset.tooltipDetail||'';
 const rule=target.dataset.tooltipRule||'';
 const hasMore=Boolean(detail||rule);
 let html=`<div class="tip-head"><span>LEVEL ${level}/3${locked?' · LOCKED':''}</span><span>${hasMore?'[T] Expand':'Info'}</span></div><div>${esc(text)}</div>`;
 if(level>=2&&detail)html+=`<div class="tip-detail"><b>Breakdown:</b> ${esc(detail)}</div>`;
 if(level>=3&&rule)html+=`<div class="tip-rule"><b>Rule:</b> ${esc(rule)}</div>`;
 if(locked)html+=`<div class="tip-actions">${hasMore?`<button type="button" data-tip-action="expand">Level ${(level%3)+1}</button>`:''}<button type="button" data-tip-action="close">Close ×</button></div>`;
 tip.innerHTML=html;tip.classList.toggle('locked',!!locked);tip.hidden=false;
 const rect=tip.getBoundingClientRect();
 tip.style.left=Math.max(8,Math.min(window.innerWidth-rect.width-8,x+12))+'px';
 tip.style.top=Math.max(8,Math.min(window.innerHeight-rect.height-8,y+12))+'px';
};
const tooltipTarget='[data-tooltip],[data-character],[data-province-link]';
document.addEventListener('pointerover',e=>{
 if(e.pointerType==='touch'||tooltipState.locked)return;
 const target=e.target.closest(tooltipTarget);
 if(target===e.relatedTarget?.closest?.(tooltipTarget))return;
 hideTooltip();
 if(target)tooltipTimer=setTimeout(()=>{
  if(target.isConnected)showTooltipFor(target,e.clientX,e.clientY,1,false);
 },Number(preferences.delay));
});
document.addEventListener('pointerout',e=>{
 if(!tooltipState.locked&&e.target.closest(tooltipTarget)!==e.relatedTarget?.closest?.(tooltipTarget))hideTooltip();
});
document.addEventListener('focusin',e=>{
 if(tooltipState.locked)return;
 const target=e.target.closest(tooltipTarget);
 if(target?.matches(':focus-visible')){
  const rect=target.getBoundingClientRect();
  showTooltipFor(target,rect.left,rect.bottom,1,false);
 }
});
document.addEventListener('focusout',e=>{if(e.target.closest(tooltipTarget))hideTooltip();});
el('zoom-in').addEventListener('click',()=>map.zoomAt(map.w/2,map.h/2,1.35));el('zoom-out').addEventListener('click',()=>map.zoomAt(map.w/2,map.h/2,1/1.35));
el('tabs').addEventListener('click',e=>{const t=e.target.closest('[data-tab]');if(t)navigateTab(t.dataset.tab);});
document.addEventListener('click',e=>{const t=e.target.closest('[data-priority-tab]');if(t){
 const destination=t.dataset.priorityTab;
 if(t.id==='open-chronicle')selectJournal('timeline');
 const primary=t.closest('.chronicle-nav');
 if(primary&&t.getAttribute('aria-expanded')==='true')setDrawer(null);
 else navigateTab(primary?workspaceTab(workspaceFor(destination).id,rememberedTabs)||destination:destination,t.dataset.sectionLink||'');
 }const c=e.target.closest('[data-character]');if(c){el('army-outliner').open=false;openCharacter(c.dataset.character);}if(e.target.closest('[data-character-back]')){if(characterBackProvince&&staticById[characterBackProvince]){selected=characterBackProvince;characterId=null;characterBackProvince=null;map.select(selected);renderInspector();setDrawer('province');}else navigateTab(characterBackTab);}const p=e.target.closest('[data-province-link]');if(p&&game&&staticById[p.dataset.provinceLink]){el('army-outliner').open=false;characterId=null;selected=p.dataset.provinceLink;map.select(selected);map.focus(...staticById[selected].centroid,3.2);renderInspector();setDrawer('province');}});
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
 if(action==='save-slot'){save(true,btn.dataset.id||'slot-1');return;}
 if(action==='load-slot'){load(btn.dataset.id||'slot-1');return;}
 if(action==='export-backup'){exportSave();return;}
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
 if(action==='trade-route'){clickResult(tradeRouteAction(game,campaignWorld(game,world),type,btn.dataset.id,btn.dataset.extra||null));}
 if(action==='heritage'){const input=btn.dataset.input?el(btn.dataset.input):null,guest=btn.dataset.guest?el(btn.dataset.guest):null;clickResult(heritageAction(game,world,type,btn.dataset.id,input?.value??btn.dataset.extra,guest?.value));}
 if(action==='diplomatic-agreement'){const input=btn.dataset.input?el(btn.dataset.input):null;clickResult(diplomacyAction(game,campaignWorld(game,world),type,btn.dataset.id,input?.value??btn.dataset.extra));}
 if(action==='casus-belli'){clickResult(declareCasusBelliWar(game,campaignWorld(game,world),game.player,btn.dataset.id,type,btn.dataset.extra||null));}
 if(action==='institution'){const first=btn.dataset.input?el(btn.dataset.input):null,second=btn.dataset.second?el(btn.dataset.second):null;clickResult(governmentAction(game,campaignWorld(game,world),first?.value??btn.dataset.id,second?.value));}
 if(action==='civic'){const input=btn.dataset.input?el(btn.dataset.input):null;clickResult(civicAction(game,world,type,btn.dataset.id,input?.value??btn.dataset.extra));}
 if(action==='dlc'){const input=btn.dataset.input?el(btn.dataset.input):null,extraEl=btn.dataset.extra?el(btn.dataset.extra):null;clickResult(dlcAction(game,campaignWorld(game,world),type,input?.value??btn.dataset.id,extraEl?.value??btn.dataset.extra));}
 if(action==='crossroads'){const input=btn.dataset.input?el(btn.dataset.input):null;clickResult(crossroadsAction(game,campaignWorld(game,world),type,input?.value??btn.dataset.id));}
 if(action==='reign'){clickResult(reignAction(game,campaignWorld(game,world),type,btn.dataset.id));}
 if(action==='mod'){
  if(type==='export-template'){
   const blob=new Blob([JSON.stringify(exportModTemplate(),null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');
   activeObjectUrls.add(url);a.href=url;a.download='sovereign-1450-mod-template.json';document.body.append(a);a.click();a.remove();
   setTimeout(()=>{if(activeObjectUrls.delete(url))try{URL.revokeObjectURL(url);}catch{}},1000);
   message('Sample Mod Pack JSON downloaded.');return;
  }
  if(type==='upload-json'){el('mod-file-input')?.click();return;}
  if(type==='apply-textarea'){
   try{
    const raw=el('mod-json-editor')?.value||'';
    const r=applyModPack(game,campaignWorld(game,world),raw);
    if(r.ok){
     const parsed=JSON.parse(raw);
     loadModPacksDurable({storage:localStorage}).then(prev=>{
      const list=prev.filter(x=>x.id!==parsed.id);list.push(parsed);
      saveModPacksDurable(list,{storage:localStorage}).catch(()=>{});
     }).catch(()=>{});
     selected=capitalDistrict(world,game.player,game.provinces)?.id||selected;
     map.setGame(game);render();save(false);message(`Applied mod pack: ${r.name}`);
    }else message(r.msg||'Could not apply mod pack.');
   }catch(err){message(`Mod validation error: ${err.message}`);}
   return;
  }
  if(type==='remove'){
   const r=removeModPack(game,btn.dataset.id);
   clickResult(r);return;
  }
 }
 if(action==='intrigue'){const input=btn.dataset.input?el(btn.dataset.input):null;clickResult(intrigueAction(game,campaignWorld(game,world),type,btn.dataset.id,input?.value??btn.dataset.extra));}
 if(action==='conflict'){const input=btn.dataset.input?el(btn.dataset.input):null;clickResult(conflictAction(game,campaignWorld(game,world),type,btn.dataset.id,input?.value??btn.dataset.extra));}
 if(action==='royal-choice')clickResult(resolveRoyalEvent(game,world,Number(btn.dataset.choice)));
 if(action==='chronicle-endscreen'){openChronicleEndScreen(el('chronicle-endscreen-modal'),game,esc,message,replayGreatestBattle);return;}
 if(action==='replay-greatest-battle'){replayGreatestBattle(game?.chronicles?.greatestBattle);return;}
 if(action==='coa-save'||action==='coa-random'){
  const studio=btn.closest('#coa-studio');if(!studio)return;
  const readVal=k=>studio.querySelector(`[data-coa-field="${k}"]`)?.value;
  let coa=normalizeCoA({pattern:readVal('pattern'),primary:readVal('primary'),secondary:readVal('secondary'),charge:readVal('charge'),chargeTincture:readVal('chargeTincture'),motto:readVal('motto')},game,game.player);
  if(action==='coa-random'){
   const pick=arr=>arr[Math.floor(Math.random()*arr.length)].id;
   coa=normalizeCoA({pattern:pick(COA_PATTERNS),primary:pick(COA_TINCTURES),secondary:pick(COA_TINCTURES),charge:pick(COA_CHARGES),chargeTincture:pick(COA_TINCTURES),motto:coa.motto},game,game.player);
   for(const [k,v] of Object.entries(coa)){const inp=studio.querySelector(`[data-coa-field="${k}"]`);if(inp)inp.value=v;}
  }
  const prev=studio.querySelector('#coa-studio-preview');if(prev)prev.innerHTML=renderCoASvg(coa,{size:92,showMotto:true,esc});
  if(action==='coa-save'){clickResult(saveRealmCoA(game,game.player,coa));save(false);}
  return;
 }
 if(action==='show-diplomacy'){if(btn.dataset.target==='independent'){selected=btn.dataset.province||selected;renderInspector();setDrawer('province');const conn=el('province-panel').querySelector('[data-section="connections"]');if(conn)conn.open=true;message('Independent polity actions opened in Province drawer.');return;}diplomaticTarget=btn.dataset.target;navigateTab('diplomacy');}
});
document.addEventListener('change',async e=>{
 if(e.target?.id==='mod-file-input'&&e.target.files?.[0]&&game){
  try{
   const text=await e.target.files[0].text();
   const r=applyModPack(game,campaignWorld(game,world),text);
   if(r.ok){
    const parsed=JSON.parse(text);
    const prev=await loadModPacksDurable({storage:localStorage}).catch(()=>[]);
    await saveModPacksDurable([...prev.filter(x=>x.id!==parsed.id),parsed],{storage:localStorage}).catch(()=>{});
    map.setGame(game);render();save(false);message(`Imported mod pack: ${r.name}`);
   }else message(r.msg||'Mod import failed.');
  }catch(err){message(`Mod import error: ${err.message}`);}
  e.target.value='';
 }
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
  else if(kind==='stress-break')r=resolveStressBreak(game,id);
  else if(kind==='partition-event')r=resolvePartitionEvent(game,id);
  else if(kind==='succession-war')r=resolveSuccessionWarEvent(game,campaignWorld(game,world),id);
  else if(kind==='heir-edu')r=resolveHeirEducation(game,game.player,id);
  else if(kind==='regency-drama')r=resolveRegencyDrama(game,game.player,Number(id));
  else if(kind==='faith-conv')r=resolveFaithConversionChoice(game,game.player,Number(id));
  else if(kind==='culture-assim')r=resolveAssimilationEvent(game,game.player,Number(id));
  else if(kind==='capital-event')r=resolveCapitalEvent(game,id);
  else if(kind==='econ-dilemma')r=resolveEconomicDilemma(game,id);
  else if(kind==='chaos-event')r=resolveChaosEvent(game,id);
  else if(kind==='obituary'){if(game.chronicles)game.chronicles.pendingObituary=null;r={ok:true,msg:'Royal obituary inscribed into the Dynasty Chronicle.'};}
  else if(kind==='broken-regiment'){
   const br=game.military?.pendingBrokenRegiment;
   if(br){
    const f=player(),army=game.armies?.[br.armyId];
    if(id==='rally'&&f.treasury>=60){f.treasury-=60;if(army){army.infantry+=45;army.archers+=20;army.morale=Math.min(100,(army.morale||50)+15);}r={ok:true,msg:'Stragglers rallied and re-equipped under the banner.'};}
    else{f.stability=Math.max(0,(f.stability||50)-2);r={ok:true,msg:'Broken regiment disbanded into local garrisons.'};}
    delete game.military.pendingBrokenRegiment;
   }
  }
  closeEventModal();
  if(r?.ok){
   browserCampaignAudio.playSfx('seal');
   clickResult(r);
   const nextPrompts=collectEventPrompts();
   if(kind==='stress-break'){
    const stage2=nextPrompts.find(x=>x.key.startsWith('stress:'));
    if(stage2)renderEventModal(stage2);
   }else if(kind==='succession-war'){
    const stage2=nextPrompts.find(x=>x.key.startsWith('succession-war:'));
    if(stage2)renderEventModal(stage2);
   }else if(kind==='expanded'){
    const follow=nextPrompts.find(x=>!deferredModalEvents.has(x.key)&&x.key.startsWith('expanded:')&&game.turn>=0);
    if(follow&&follow.key!==el('event-modal')._eventKey)renderEventModal(follow);
   }
  }else clickResult(r);
 }
});
el('campaign-sound')?.addEventListener('click',()=>{
 campaignSound=!campaignSound;
 browserCampaignAudio.setMuted(!campaignSound);
 battleSound=campaignSound;updateSoundButton();battle?.setSound(battleSound);
 persistSound();syncAudioState();if(campaignSound)browserCampaignAudio.retryMusic();
});
el('battle-rally')?.addEventListener('click',()=>{if(battle&&!battle.deployment)browserCampaignAudio.playSfx('rally');});
el('mobile-battle-shortcut')?.addEventListener('click',()=>el('battle-showcase').click());
function launchShowcaseBattle({siegeMode=false,fortLevel=0}={}){
 if(!game){message(`Begin your reign before opening a practice ${siegeMode?'siege':'battle'}.`);return;}
 if(battle){message('A battle is already in progress.');return;}
 const armyEntry=Object.entries(game.armies).find(([,a])=>a.owner===game.player&&armySize(a)>0&&!game.naval?.voyages?.[a.id]);
 if(!armyEntry){message(`Recruit at least one army to enter the ${siegeMode?'siege':'battle'} showcase.`);return;}
 const isRivalProv=p=>{const owner=game.provinces[p.id]?.owner;return owner&&owner!==game.player&&game.factions[owner];};
 const target=(siegeMode&&world.provinces.find(p=>isRivalProv(p)&&(game.provinces[p.id]?.buildings?.fort||0)>0))||world.provinces.find(isRivalProv);
 if(!target){message('No opposing provinces are available.');return;}
 const enemy=game.provinces[target.id].owner;
 openBattle({attacker:armyEntry[0],enemy,to:target.id,defenseTroops:110,defenseGarrison:siegeMode?90:80,showcase:true,openField:!siegeMode,siegeMode,fortLevel});
}
el('battle-showcase').addEventListener('click',()=>launchShowcaseBattle());
el('battle-siege-showcase')?.addEventListener('click',()=>launchShowcaseBattle({siegeMode:true,fortLevel:2}));
function replayGreatestBattle(gb){
 if(!game||!gb){message('No historical battle recorded to replay yet.');return;}
 if(battle){message('A battle is already in progress.');return;}
 const prov=(gb.provinceId&&staticById[gb.provinceId])||world.provinces.find(p=>p.name===gb.province||p.id===gb.provinceId)||world.provinces.find(p=>game.provinces[p.id]?.owner!==game.player);
 if(!prov){message('Unable to locate battlefield terrain.');return;}
 const armyEntry=Object.entries(game.armies).find(([,a])=>a.owner===game.player&&armySize(a)>0&&!game.naval?.voyages?.[a.id]);
 const siegeMode=Boolean(gb.siegeMode);
 openBattle({attacker:armyEntry?.[0]||null,enemy:gb.enemyId||game.provinces[prov.id]?.owner||'france',to:prov.id,attackTroops:gb.playerTroops||120,defenseTroops:gb.enemyTroops||120,defenseGarrison:siegeMode?90:70,showcase:true,replay:true,openField:!siegeMode,siegeMode,fortLevel:gb.fortLevel||(siegeMode?2:0)});
}
document.addEventListener('input',e=>{
 const studio=e.target?.closest?.('#coa-studio');if(!studio||!game)return;
 const readVal=k=>studio.querySelector(`[data-coa-field="${k}"]`)?.value;
 const coa=normalizeCoA({pattern:readVal('pattern'),primary:readVal('primary'),secondary:readVal('secondary'),charge:readVal('charge'),chargeTincture:readVal('chargeTincture'),motto:readVal('motto')},game,game.player);
 const prev=studio.querySelector('#coa-studio-preview');if(prev)prev.innerHTML=renderCoASvg(coa,{size:92,showMotto:true,esc});
});
el('battle-move-tap').addEventListener('click',()=>{if(battle){battle.tapMove=!battle.tapMove;battle.report();}});
for(const [id,delta] of [['battle-zoom-in',-12],['battle-zoom-out',12]])el(id).addEventListener('click',()=>{if(!battle)return;if(battle.ctx?.isBannerRenderer){battle.ctx.setZoom(battle.ctx.zoom+(delta<0?.18:-.18));return;}battle.cameraGoal=null;battle.camera.distance=Math.max(35,Math.min(165,battle.camera.distance+delta));});
el('battle-quality')?.addEventListener('change',e=>{const v=e.target.value;try{localStorage.setItem('crown-of-nations.gfx-quality',v);}catch{}battle?.setGraphicsQuality?.(v);message('Battle GFX: '+v.toUpperCase());});
el('battle-camera').addEventListener('change',e=>{if(battle&&!battle.focusCamera(e.target.value))message('Select an active regiment.');});
el('battle-sound').addEventListener('click',()=>{battleSound=!battleSound;campaignSound=battleSound;browserCampaignAudio.setMuted(!campaignSound);updateSoundButton();battle?.setSound(battleSound);persistSound();syncAudioState();});
el('battle-pause').addEventListener('click',()=>battle?.togglePause());
el('battle-retreat').addEventListener('click',()=>battle?.retreat());
el('battle-start').addEventListener('click',()=>battle?.startAssault());
el('battle-cancel').addEventListener('click',()=>{if(!battle?.deployment||battleDescriptor?.defenseMode&&!battle.renderLost)return;battle.stop();battle=null;battleDescriptor=null;el('battle-screen').hidden=true;document.body.classList.remove('in-battle');document.body.dataset.state='playing';document.body.style.overflow='';render();syncAudioState();message('Deployment cancelled. No casualties or territory changes.');});
el('battle-formation').addEventListener('change',e=>{
 if(battle&&!battle.setFormation(battle.selected,e.target.value))message('This formation is not available.');
});
el('battle-reserve').addEventListener('click',()=>battle?.toggleReserve());
el('battle-presets').addEventListener('click',e=>{const b=e.target.closest('[data-preset]');if(b&&battle)battle.arrangeCards(b.dataset.preset);});
let draggingCard=null;
el('battle-units')?.addEventListener('pointerdown',e=>{const card=e.target.closest('[data-unit]');if(card&&battle?.deployment&&e.button===0){draggingCard=Number(card.dataset.unit);battle.selectGroup(draggingCard);}});
window.addEventListener('pointerup',e=>{if(draggingCard===null)return;const idx=draggingCard;draggingCard=null;const canvas=el('battle-canvas');if(!battle?.deployment||!canvas||e.target!==canvas)return;const rect=canvas.getBoundingClientRect();battle.selectGroup(idx);battle.tapField((e.clientX-rect.left)/Math.max(1,rect.width),(e.clientY-rect.top)/Math.max(1,rect.height));});
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

// Color-Blind Mode Toggle (Okabe-Ito safe palette)
const cbBtn=el('toggle-colorblind');
const applyColorblind=on=>{
 document.body.classList.toggle('colorblind-mode',on);
 if(cbBtn)cbBtn.setAttribute('aria-pressed',String(on));
 try{localStorage.setItem('reign1450.colorblind',on?'on':'off');}catch{}
};
try{if(localStorage.getItem('reign1450.colorblind')==='on')applyColorblind(true);}catch{}
cbBtn?.addEventListener('click',()=>{const next=!document.body.classList.contains('colorblind-mode');applyColorblind(next);message(next?'Color-blind safe palette enabled':'Standard palette restored');});

// Initial screen state & ?autostart=1 deterministic launch hook
document.body.dataset.state='title';
const bootParams=new URLSearchParams(location.search);
if(bootParams.get('autostart')==='1'){
 const desired=bootParams.get('realm')||'ottomans';
 const chosen=atlasWorld.factions.some(f=>f.id===desired)?desired:atlasWorld.factions[0]?.id;
 if(chosen)start(chosen);
}

function teardownPage(){
 if(speedInterval){clearInterval(speedInterval);speedInterval=null;}
 if(battle){try{battle.stop();}catch{}battle=null;battleDescriptor=null;}
 try{el('menu-video')?.pause();}catch{}
 try{map?.terrain?.dispose?.();}catch{}
 revokeObjectUrls();
}
window.addEventListener('pagehide',()=>{if(game&&!battle)save(false);teardownPage();});
window.addEventListener('beforeunload',teardownPage);
