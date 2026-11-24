import {freshBattleCanvas} from './battle-lifecycle.js';
import {SAVE_KEY,MAX_SAVE_BYTES,validatePortableSave,saveFilename,persistCampaign} from './portable-save.js';
import {workspaceFor,workspaceTab,realmPriorities,searchRealms} from './campaign-navigation.js';
import {currentExpandedEvents} from './expanded-content.js';
import {buildHistoricalWorld,expandHistoricalWorld,densifyHistoricalWorld,worldForSave,capitalDistrict,realmGeography} from './historical-world.js';
import {expandedAction} from './expanded-content.js';
import {livingAction} from './living-systems.js';
import {diplomacyAction} from './diplomacy-systems.js';
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
import {resolveInvasion,autoResolveInvasion} from './invasions.js';
import {politicsAction} from './dynastic-politics.js';
import {conflictAction} from './political-conflict.js';
import {civicAction,civicModifiers} from './civic-systems.js';
import {heritageAction} from './heritage-systems.js';
import {economyAction,economyModifiers} from './economy-systems.js';
import {militaryAction} from './military-systems.js';
import {navalAction,portBlocked} from './naval-systems.js';
import {controller,occupation} from './campaign-war.js';
import {activeWar} from './political-conflict.js';
import {renderDiplomaticAgreements,renderIdentity,renderFeudal,renderStories,renderStrategy,renderNaval,renderMilitary,renderEconomy,renderHeritage,renderCivic,renderConflict,renderCourt,renderTrade,renderLegacy} from './kingdom-ui.js';
import {courtDecision,resolveRoyalEvent,currentRoyalEvent,tradeIncome,objectives,campaignStanding} from './kingdom-depth.js';
import {createGame,restoreGame,snapshot,MONTHS,BUILDINGS,POLICY,empireStats,controlled,armiesAt,armySize,advanceMonth,setPolicy,build,recruit,recruitmentQuote,startMarch,concludeBattle,negotiate,ownerName} from './simulation.js';
const el=id=>document.getElementById(id);
const fmt=n=>Math.round(n).toLocaleString('en-US');
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const legacyWorld=await fetch('data/world.json').then(r=>{if(!r.ok)throw Error(`Map data unavailable (${r.status})`);return r.json();});
const historicalReference=await fetch('data/historical-polities-1450.json').then(r=>r.ok?r.json():null).catch(()=>null);
const atlasV2=buildHistoricalWorld(legacyWorld,historicalReference),atlasV3=expandHistoricalWorld(atlasV2),atlasWorld=densifyHistoricalWorld(atlasV3);let world=atlasWorld;
let staticById=Object.fromEntries(world.provinces.map(p=>[p.id,p]));
let game=null,selected=null,tab='realm',marchFrom=null,diplomaticTarget='france',battle=null,battleDescriptor=null,speedInterval=null,toastTimer=null;
const map=new CampaignMap(el('world-map'),world,onProvince);
if(window.matchMedia('(pointer: coarse)').matches)map.setRelief(false);
if(!map.terrain?.gl){const button=el('toggle-relief');button.textContent='▤ 2D MAP';button.title='3D terrain requires a WebGL2-capable browser';button.setAttribute('aria-pressed','false');button.disabled=true;}
if(historicalReference)map.setHistorical(historicalReference);if(!map.useRelief&&map.terrain?.gl){el('toggle-relief').textContent='▤ 3D OFF';el('toggle-relief').setAttribute('aria-pressed','false');}
function useWorld(next){if(next===world)return;world=next;staticById=Object.fromEntries(world.provinces.map(p=>[p.id,p]));map.setWorld(world);}
const player=()=>game?.factions[game.player];
const displayProvince=p=>p.name.replace(' Province ',' March ');
function message(msg){const t=el('toast');t.textContent=msg;t.classList.add('visible');clearTimeout(toastTimer);toastTimer=setTimeout(()=>t.classList.remove('visible'),3400);}
function clickResult(r){if(!r?.ok)message(r?.msg||'Action unavailable');else{message(r.msg);render();save(false);}}
function start(id){useWorld(atlasWorld);game=createGame(world,id);game.kingdom.difficulty=el('start-difficulty').value;el('start-screen').hidden=true;selected=capitalDistrict(world,id)?.id||null;map.setGame(game);if(selected)map.select(selected);const f=player();map.focus(...(staticById[selected]?.centroid||f.capital),3.2);render();save(false);}
function loadRaw(raw,portable=false){if(portable)validatePortableSave(raw);const next=worldForSave(raw,legacyWorld,atlasV2,atlasV3,atlasWorld),restored=restoreGame(raw,next);if(portable){try{persistCampaign(localStorage,snapshot(restored));}catch{message('Backup opened, but browser storage is unavailable. Export another backup to keep progress.');}}clearInterval(speedInterval);speedInterval=null;el('auto-time').textContent='▶';cancelMarch();setDrawer(null);useWorld(next);game=restored;el('start-screen').hidden=true;selected=capitalDistrict(world,game.player,game.provinces)?.id||null;map.setGame(game);map.select(selected);map.focus(...(staticById[selected]?.centroid||player().capital),3);render();if(!openIncomingBattle())message('Saved campaign restored.');}
function load(){try{loadRaw(localStorage.getItem(SAVE_KEY));}catch(e){message('Unable to load save: '+e.message);}}
function save(notify=true){if(!game||battle)return false;try{persistCampaign(localStorage,snapshot(game));if(notify!==false)message('Campaign saved to this browser.');return true;}catch(e){if(notify!==false)message('Save failed: '+e.message);return false;}}
function exportSave(){if(!game||battle)return;const blob=new Blob([snapshot(game)],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=saveFilename(game);document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);message('Campaign backup exported.');}
function setDrawer(next){const open=next==='management'||next==='province';document.querySelector('.map-options').open=false;el('management-panel').hidden=next!=='management';el('province-drawer').hidden=next!=='province';el('panel-scrim').hidden=!open;el('open-management').setAttribute('aria-expanded',String(next==='management'));el('open-province').setAttribute('aria-expanded',String(next==='province'));}
function cancelMarch(){marchFrom=null;map.setMarchOrigin(null);el('cancel-march').hidden=true;el('map-target-help').textContent='Tap a province to inspect';}
function onProvince(id){if(!game)return;if(marchFrom){let r=startMarch(game,world,marchFrom,id);cancelMarch();if(r.ok&&r.type==='battle'){if(openBattle(r))return;message('Could not open battle. No campaign casualties were applied.');return;}clickResult(r);}
 selected=id;map.select(id);renderInspector();setDrawer('province');}
function render(){if(!game)return;const f=player(),s=empireStats(game,game.player);
 el('resource-gold').textContent=fmt(f.treasury)+' ◈';el('resource-army').textContent=fmt(s.troops);el('resource-stability').textContent=fmt(f.stability)+'%';el('date-display').textContent=`${MONTHS[game.month].toUpperCase()} ${game.year}`;
 el('faction-name').textContent=f.name;el('faction-government').textContent=f.government;
 el('faction-flag').style.background=f.color;el('faction-flag').textContent='♛';
 el('world-counter').title=world.meta.caveat;el('world-counter').textContent=`${world.provinces.length} DISTRICTS · ${Object.values(game.factions).filter(q=>q.id!=='independent'&&Object.values(game.provinces).some(p=>p.owner===q.id)).length} REALMS`;
 el('latest-event').textContent=game.log[0]?.text||'Your court awaits.';
 const priorities=realmPriorities(game,s,Boolean(currentRoyalEvent(game)),currentExpandedEvents(game).length),strip=el('priority-strip');strip.hidden=!priorities.length;el('open-priorities').hidden=!priorities.length;el('open-priorities').textContent='Alerts ('+priorities.length+')';strip.innerHTML=priorities.slice(0,3).map(p=>'<button class="priority-item '+p.level+'" data-priority-tab="'+esc(p.tab)+'" title="'+esc(p.detail)+'">'+esc(p.label)+'</button>').join('')+(priorities.length>3?'<small>+'+(priorities.length-3)+' more on Realm</small>':'');
 const threat=game.kingdom?.threats?.[0],banner=el('invasion-alert');
 banner.hidden=!threat;
 if(threat){
  const opponent=game.factions[threat.by]?.name||'An enemy kingdom';
  el('invasion-text').textContent=threat.status==='ready'
   ?`⚔ ${opponent} IS ATTACKING ${threat.province.toUpperCase()} — DEFEND YOUR REALM`
   :`⚑ ${opponent} APPROACHES ${threat.province.toUpperCase()} · ${threat.eta} MONTH(S) LEFT`;
  el('invasion-defend').hidden=threat.status!=='ready';
  el('invasion-auto').hidden=threat.status!=='ready';
 }
 renderTab();renderInspector();map.render();}
const rememberedTabs={};
function navigateTab(next){if(!game||!document.querySelector('[data-tab="'+next+'"]'))return;setDrawer('management');tab=next;renderTab();el('tab-content').scrollTop=0;}
function renderTab(){if(!game)return;const liveWorld=campaignWorld(game,world),workspace=workspaceFor(tab);rememberedTabs[workspace.id]=tab;
 for(const b of document.querySelectorAll('[data-workspace]')){const active=b.dataset.workspace===workspace.id;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active));}
 for(const b of document.querySelectorAll('.tab')){b.hidden=!workspace.tabs.includes(b.dataset.tab);const active=b.dataset.tab===tab;b.classList.toggle('active',active);b.setAttribute('aria-current',active?'page':'false');}
 const f=player(),s=empireStats(game,game.player);let html='';
 if(tab==='realm'){
  const priorities=realmPriorities(game,s,Boolean(currentRoyalEvent(game)),currentExpandedEvents(game).length);
  const guidance='<div class="realm-overview"><h3>What needs your attention?</h3>'+(priorities.length?priorities.map(p=>'<button class="priority-detail '+p.level+'" data-priority-tab="'+esc(p.tab)+'"><b>'+esc(p.label)+'</b><small>'+esc(p.detail)+'</small></button>').join(''):'<p class="paragraph">No urgent issues. Select a province to develop it, or advance a month.</p>')+'</div>';
  html=guidance+`<div class="label">STATE OF THE REALM</div><div class="divider"></div><div class="statlist"><label>Controlled provinces</label><strong>${fmt(s.provinces)}</strong><label>Owned land groups</label><strong>${realmGeography(world,game.player,game.provinces).components}</strong><label>Population</label><strong>${fmt(s.population)}k</strong><label>Total revenue / mo.</label><strong class="up">+${fmt(s.income)}</strong><label>Trade / mo.</label><strong class="up">+${fmt(s.trade||0)}</strong><label>Army upkeep / mo.</label><strong class="down">−${fmt(s.upkeep)}</strong><label>Net treasury / mo.</label><strong class="${s.balance>=0?'up':'down'}">${s.balance>=0?'+':''}${fmt(s.balance)}</strong><label>Food reserve</label><strong>${fmt(f.food)}</strong><label>Food change / mo.</label><strong class="${s.foodDelta>=0?'up':'down'}">${s.foodDelta>=0?'+':''}${fmt(s.foodDelta)}</strong><label>Legitimacy</label><strong>${fmt(f.legitimacy)}%</strong><label>Prestige</label><strong>${fmt(f.prestige)}</strong></div><div class="divider"></div><div class="sectiontitle">MILITARY DOCTRINE</div><div class="rule"><b>⚔ ${esc(militaryDoctrine(f).name)}</b><div class="smallnote">Specialist: ${esc(militaryDoctrine(f).unique)} · Army mix ${militaryDoctrine(f).mix.map(x=>Math.round(x*100)).join(" / ")}% · ${militaryDoctrine(f).formations.map(id=>id.replaceAll("_"," ")).join(" · ")}. These formations affect movement, range, attack and defense in real battles.</div></div><div class="sectiontitle">COURT ADVICE</div><p class="paragraph">Expand with care. Taxes and conscription increase unrest. A depleted treasury or food reserve undermines public stability. Build markets to finance your armies.</p>`;
 }else if(tab==='decrees'){
  const descriptions={tax:'Taxation balances state revenue against civilian unrest.',levy:'Conscription policy affects the political burden of raising regiments.',tolerance:'Pluralism reduces unrest at the cost of central control.'};
  html=`<div class="label">ROYAL DECREES</div><p class="paragraph" style="margin-top:12px">New laws cost 80 gold to enact. Their consequences apply during monthly simulation.</p>${Object.keys(POLICY).map(key=>`<div class="rule"><div class="label">${key.toUpperCase()}</div><select class="policy-select" data-policy="${key}">${POLICY[key].map((name,i)=>`<option value="${i}" ${f.policies[key]===i?'selected':''}>${esc(name)}</option>`).join('')}</select><div class="smallnote">${descriptions[key]}</div></div>`).join('')}<div class="sectiontitle">REALM STABILITY</div><div class="statlist"><label>Current stability</label><strong>${fmt(f.stability)}%</strong><label>Royal legitimacy</label><strong>${fmt(f.legitimacy)}%</strong></div>`;
 }else if(tab==='diplomacy'){
  const nations=liveWorld.factions.filter(q=>q.id!==game.player).sort((a,b)=>a.name.localeCompare(b.name));if(diplomaticTarget===game.player)diplomaticTarget=nations[0].id;
  const other=game.factions[diplomaticTarget]||game.factions.france,rel=f.relations[other.id]||0;
  html=`<div class="label">FOREIGN AFFAIRS</div><div class="sectiontitle">SEND ENVOYS</div><select class="select" id="diplomatic-select">${nations.map(n=>`<option value="${n.id}" ${n.id===diplomaticTarget?'selected':''}>${esc(n.name)}</option>`).join('')}</select><div class="rule"><div class="label">FOREIGN POWER</div><h3 style="font-size:14px;margin:9px 0">${esc(other.name)}</h3><div class="statlist"><label>Relationship</label><strong class="${rel>0?'up':rel<0?'down':''}">${rel>0?'+':''}${rel}</strong><label>Political union</label><strong>${f.treaties[other.id]==='alliance'?'ALLIED':'NONE'}</strong><label>State form</label><strong>${esc(other.government)}</strong></div></div><div class="sectiontitle">ROYAL DIPLOMATIC ACTIONS</div><button class="rowbtn" data-action="gift">✦ Send gift (250 gold)</button><button class="rowbtn" data-action="alliance">⚜ Propose alliance (relation +35)</button><button class="rowbtn" data-action="trade">◈ Establish merchant treaty (140 gold, relation +10)</button><button class="rowbtn" data-action="marriage">♕ Arrange royal marriage (180 gold, relation +20)</button><button class="rowbtn negative" data-action="insult">⚑ Issue formal insult</button><p class="paragraph" style="margin-top:13px">Relations now support merchant treaties and dynastic marriages. Royal marriages now link actual adults and their descendants. Formal peace settlements remain simplified.</p>`;
 html+=renderDiplomaticAgreements(game,other.id,esc);
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
function renderInspector(){if(!game)return;let p=staticById[selected],state=game.provinces[selected];if(!p||!state){el('province-panel').innerHTML='<div class="emptyselection"><div class="emptycrest">♜</div><h2>THE KING\'S ATLAS</h2><p>Select any province to inspect its holdings.</p></div>';return;}
 const own=state.owner===game.player&&controller(game,selected)===game.player,owner=game.factions[state.owner],a=armiesAt(game,selected,state.owner),yourArmy=armiesAt(game,selected,game.player)[0];const total=a.reduce((s,q)=>s+armySize(q),0);
 let text=`<div class="inspector"><span class="eyebrow">PROVINCE CHANCERY · ${esc(p.continent.toUpperCase())}</span><h2>${esc(displayProvince(p))}</h2><div class="owner"><span class="swatch" style="background:${esc(owner?.color||'#667670')}"></span>${esc(owner?.name||'Independent Polities')} ${own?'<span style="color:#e4ca83"> · YOUR REALM</span>':''}</div><div class="province-hero">${p.terrain==='forest'?'♣':p.terrain==='highlands'?'▲':'♜'}<span>${esc(p.terrain.toUpperCase())} · ${p.centroid[0].toFixed(1)}°, ${p.centroid[1].toFixed(1)}°</span></div><div class="province-facts"><div class="fact"><label>POPULATION</label><b>${fmt(state.population)}k</b></div><div class="fact"><label>DEVELOPMENT</label><b>LV. ${fmt(state.development)}</b></div><div class="fact"><label>UNREST</label><b style="color:${state.unrest>55?'#e1a194':'#aed2af'}">${fmt(state.unrest)}%</b></div><div class="fact"><label>GARRISON & ARMY</label><b>${fmt(total||45+state.development*12)}</b></div></div>`;
 const occupied=occupation(game,selected);if(occupied)text+='<div class="rule"><b>OCCUPIED BY '+esc(ownerName(game,occupied.by))+'</b><p class="paragraph">Legal ownership remains with '+esc(ownerName(game,state.owner))+'.</p>'+(occupied.by===game.player&&yourArmy?'<button class="rowbtn" data-action="march">March from occupied territory</button>':'')+'</div>';if(game.naval?.ports[selected])text+='<div class="rule"><b>PORT '+(portBlocked(game,selected)?'· BLOCKADED':'')+'</b></div>';
 const local=game.civic?.provinces[selected];
 if(own){const recruitButtons=['infantry','archers','cavalry'].map(t=>{const q=recruitmentQuote(game,selected,t);return '<button data-action="recruit" data-type="'+t+'" '+(player().treasury<q.cost?'disabled':'')+'>'+t.charAt(0).toUpperCase()+t.slice(1)+'<small>'+fmt(q.count)+' troops · '+fmt(q.cost)+' gold</small></button>';}).join('');
 text+=`<p class="paragraph">${yourArmy?`Your army: ${fmt(armySize(yourArmy))} troops.`:'No army stationed here.'}</p><button class="btnblock" data-action="march" ${!yourArmy||armySize(yourArmy)<20||game.naval?.voyages?.[yourArmy.id]?'disabled':''}>Move or attack</button><details class="province-section" data-section="recruit"><summary>Recruit troops</summary><div class="building-grid">${recruitButtons}</div></details><details class="province-section" data-section="build"><summary>Improve province</summary><div class="building-grid">${Object.entries(BUILDINGS).map(([kind,b])=>{const level=state.buildings[kind],cost=Math.round(b.cost*(level+1)*civicModifiers(game,game.player).build*economyModifiers(game,game.player).cost);return '<button data-action="build" data-type="'+kind+'" '+(level>=3||player().treasury<cost?'disabled':'')+'>'+esc(b.icon)+' '+esc(b.name)+'<small>Level '+level+' / 3 · '+(level>=3?'Complete':fmt(cost)+' gold')+'</small></button>';}).join('')}</div></details>`;
 }else{text+=`<div class="sectiontitle">FOREIGN TERRITORY</div><p class="paragraph">To invade, select a neighboring owned province with a field army and choose <strong>Issue March / Attack Order</strong>. Then select this province on the world map.</p><button class="btnblock secondary" data-action="show-diplomacy" data-target="${state.owner}">✦ DIPLOMATIC OPTIONS</button>`;}
 text+=`<details class="province-section" data-section="details"><summary>Province details</summary>${local?'<div class="rule"><b>'+esc(local.culture)+'</b><p class="paragraph">'+esc(local.faith)+' · '+fmt(local.acceptance)+'% acceptance</p></div>':''}<div class="sectiontitle">ADJACENT PROVINCES</div><p class="paragraph">${p.neighbors.length} connected land provinces. ${p.neighbors.filter(n=>game.provinces[n].owner!==state.owner).length} under foreign control.${p.landComponentSize===1?' No land route: use an available naval route where possible.':p.landComponentSize?' Land network: '+p.landComponentSize+' districts.':''}</p><div class="divider"></div><p class="paragraph">${p.ownershipSource?`Starting ownership: ${esc(p.ownershipSource)}.${p.historicalPolity?' Reference polity: '+esc(p.historicalPolity)+'.':''}${p.referenceInherited?' Inherited from the parent gameplay district.':''}${Number.isFinite(p.referenceSamples)&&p.referenceSamples>0&&p.historicalPolity?' Sample agreement: '+p.referenceMatches+'/'+p.referenceSamples+' points.':''} `:''}${p.nameSource?' Geographic name, not a historical county title.':''} Gameplay districts are approximate, not verified historical counties.</p></details></div>`;
 const panel=el('province-panel'),open=panel.dataset.province===selected?[...panel.querySelectorAll('details[open]')].map(d=>d.dataset.section):[];panel.dataset.province=selected;panel.innerHTML=text;for(const d of panel.querySelectorAll('details'))d.open=open.includes(d.dataset.section);
}
let battleSound=true;try{battleSound=localStorage.getItem('crown-of-nations.battle-sound')!=='off';}catch{}
function updateSoundButton(){const b=el('battle-sound');b.setAttribute('aria-pressed',String(battleSound));b.textContent=battleSound?'Sound on':'Sound off';}
function openBattle(desc){setDrawer(null);desc.soundEnabled=battleSound;updateSoundButton();desc.interactive=true;desc.fieldBattle=true;el('battle-screen').hidden=false;el('battle-result').hidden=true;
 el('battle-move-tap').setAttribute('aria-pressed','false');el('battle-camera').value='tactical';el('battle-title').textContent=desc.showcase?'BATTLE SHOWCASE · FIELD BATTLE':desc.defenseMode?'DEFEND '+desc.to.toUpperCase():'ASSAULT '+desc.to.toUpperCase();
 el('battle-meta').textContent=desc.showcase?'PRACTICE BATTLE · NO EFFECT ON CAMPAIGN':`${player().name.toUpperCase()} VS ${ownerName(game,desc.enemy).toUpperCase()} · ${desc.defenseMode?'DEFENSIVE BATTLE':'FIELD BATTLE'}`;
 battleDescriptor=desc;try{battle=new BattleGame(freshBattleCanvas(el('battle-canvas')),desc,game,onBattleFinished,onBattleStatus);document.body.style.overflow='hidden';return true;}catch(e){battleDescriptor=null;el('battle-screen').hidden=true;message(`Battle couldn't start: ${e.message}`);return false;}}
function onBattleStatus(status){
 const roster=status.roster;if(roster){const a=roster.attacker,b=roster.defender;el('battle-strength').textContent='YOUR FORCE '+fmt(a.surviving)+' / '+fmt(a.initial)+' · ENEMY '+fmt(b.surviving)+' / '+fmt(b.initial)+(status.enemyPosture?' · '+status.enemyPosture.toUpperCase():'');}
 el('battle-move-tap').setAttribute('aria-pressed',String(!!status.tapMove));el('battle-pause').textContent=status.paused?'▶ RESUME':'Ⅱ PAUSE';el('battle-pause').disabled=!!status.renderLost;el('battle-start').disabled=!!status.renderLost;el('battle-strength').dataset.renderer=status.rendererMode||'';if(status.renderLost)el('battle-strength').textContent='Graphics context lost. Retreat to return to campaign.';
 const ours=status.groups.filter(g=>g.side==='attacker'),unit=ours[status.selected];
 const cards=el('battle-units'),markup=ours.map((g,i)=>'<button class="unitcard '+(i===status.selected?'active':'')+'" data-unit="'+i+'"><b>'+(i+1)+'. '+esc((g.profile?.name||g.type).toUpperCase())+'</b><small>'+(g.routed?'ROUTED':Math.round(g.life)+'% HP · '+Math.round(g.morale)+'% MORALE · '+Math.round(g.fatigue||0)+'% FATIGUE · '+Math.round(g.cohesion??100)+'% COHESION · '+(g.fieldOrder||'advance').toUpperCase())+'</small><div class="unithealth"><div style="width:'+Math.max(0,g.life)+'%"></div></div></button>').join('');if(cards.dataset.markup!==markup){const left=cards.scrollLeft,focus=document.activeElement?.dataset?.unit;cards.innerHTML=markup;cards.dataset.markup=markup;cards.scrollLeft=left;if(focus!==undefined)cards.querySelector('[data-unit="'+focus+'"]')?.focus({preventScroll:true});}
 const choices=availableFormations(game.factions[game.player]);
 const formations=el('battle-formation');const choiceKey=choices.map(o=>o.id).join(',');if(formations.dataset.choices!==choiceKey){formations.dataset.choices=choiceKey;formations.innerHTML=choices.map(o=>'<option value="'+o.id+'">'+esc(o.name)+' · '+Math.round(o.damage*100)+'% attack / '+Math.round(o.defense*100)+'% defense</option>').join('');}
 if(unit&&document.activeElement!==formations)formations.value=unit.formationId;el('battle-order').title=unit?(unit.terrainName||'Open field')+' · Enemy posture: '+(status.enemyPosture||'Deploying'):'Regiment order';const order=el('battle-order');if(unit&&document.activeElement!==order&&unit.fieldOrder!=='move'&&[...order.options].some(o=>o.value===unit.fieldOrder))order.value=unit.fieldOrder;
 const fort=el('battle-fort-status');if(fort){fort.hidden=!status.siege;fort.textContent=status.siege?status.siege.structures.map(q=>q.name+' '+Math.round(q.hp/q.max*100)+'%').join(' · '):'';}
 el('battle-lanes').hidden=!status.deployment;el('battle-start').hidden=!status.deployment;
}
function onBattleFinished(result){
 const defense=!!battleDescriptor?.defenseMode,practice=!!battleDescriptor?.showcase,win=result.victory;
 el('battle-result').hidden=false;
 const title=defense?(win?'THE INVADERS WERE REPELLED':'THE DEFENDERS WERE DEFEATED'):(win?'GLORIOUS VICTORY':'THE ARMY WITHDRAWS');
 const explanation=practice?'Practice battle; your campaign will not be changed.':
   defense?(win?'Your army held the field.':'Your defensive position has been overrun.'):
   win?(activeWar(game,game.player,battleDescriptor.enemy)?'The province will be occupied pending peace.':'The enemy province will be taken.'):'Your army has retreated.';
 const roster=result.roster,report=roster?'<div class="battle-report"><div><b>YOUR FIELD FORCE</b><small>Deployed '+fmt(roster.attacker.initial)+' · Surviving '+fmt(roster.attacker.surviving)+' · Losses '+fmt(roster.attacker.losses)+' · Routed survivors '+fmt(roster.attacker.routed)+'</small></div><div><b>ENEMY FIELD FORCE</b><small>Deployed '+fmt(roster.defender.initial)+' · Surviving '+fmt(roster.defender.surviving)+' · Losses '+fmt(roster.defender.losses)+' · Routed survivors '+fmt(roster.defender.routed)+'</small></div><small>Battlefield estimates include participating garrisons; campaign outcomes may differ.</small></div>':'';
 el('battle-result').innerHTML='<div class="resultcard"><div class="small-ornament">THE CHRONICLERS REPORT</div><div class="hero-crest">'+(win?'♛':'⚔')+'</div><h2>'+title+'</h2><p>'+explanation+' Remaining strength: '+Math.round(result.attackerRemaining*100)+'%. Battle duration: '+result.seconds+' seconds.</p>'+report+'<button id="battle-return" class="goldbtn primary">RETURN TO CAMPAIGN ›</button></div>';
 el('battle-return').onclick=()=>{
  if(!battle)return;el('battle-return').disabled=true;
  if(!practice){
   if(defense){const r=resolveInvasion(game,world,battleDescriptor.threat,result);if(!r.ok)message(r.msg);}
   else concludeBattle(game,battleDescriptor,result,world);
  }
  battle.stop();battle=null;battleDescriptor=null;el('battle-screen').hidden=true;
  document.body.style.overflow='';render();if(!practice)save();
 };
}
function openIncomingBattle(){
 const threat=game?.kingdom?.threats?.find(t=>t.status==='ready');
 if(!threat||battle)return false;
 const defenders=armiesAt(game,threat.province,game.player).filter(a=>!game.naval?.voyages?.[a.id]),stationed=defenders[0],defense=game.provinces[threat.province];
 const enemyArmy=game.armies[threat.army];if(!enemyArmy)return false;
 const garrison=45+defense.development*12+(defense.buildings.fort||0)*45;
 return openBattle({defenseMode:true,attacker:stationed?.id||null,playerArmies:defenders.map(a=>a.id),enemyArmy:threat.army,enemyArmies:[threat.army],enemy:threat.by,
  to:threat.province,defenseTroops:armySize(enemyArmy),defenseGarrison:garrison+defenseSupport(game,game.player,threat.by),
  threat:{army:threat.army,province:threat.province}});
}
function advanceWithInvasions(){
 if(!game||battle)return;
 if(openIncomingBattle())return;
 advanceMonth(game,world);render();save(false);
 if(openIncomingBattle()&&speedInterval){
  clearInterval(speedInterval);speedInterval=null;el('auto-time').textContent='▶';
 }
}
// Bind controls once. Rebuilt content uses delegated events.
el('start-world-count').textContent=atlasWorld.factions.length+' REALMS · '+atlasWorld.provinces.length+' DISTRICTS';
function renderStartFaction(){const f=atlasWorld.factions.find(f=>f.id===el('start-faction').value);el('start-new').disabled=!f;if(!f){el('start-faction-info').textContent='No matching kingdoms. Try another name or region.';return;}const d=militaryDoctrine(f),count=atlasWorld.provinces.filter(p=>p.owner===f.id).length;el('start-faction-info').textContent=f.continent+' · '+count+' districts · '+d.name;}
function filterStartRealms(preferred=el('start-faction').value){const list=searchRealms(atlasWorld.factions,el('realm-search').value);el('start-faction').innerHTML=list.map(f=>`<option value="${esc(f.id)}">${esc(f.name)} — ${esc(f.continent)}</option>`).join('');if(list.some(f=>f.id===preferred))el('start-faction').value=preferred;renderStartFaction();}
el('realm-search').addEventListener('input',()=>filterStartRealms());el('start-faction').addEventListener('change',renderStartFaction);filterStartRealms('ottomans');
el('start-new').addEventListener('click',()=>{if(atlasWorld.factions.some(f=>f.id===el('start-faction').value))start(el('start-faction').value);});
try{if(localStorage.getItem('crown-of-nations.save'))el('load-existing').hidden=false;}catch{}
el('load-existing').addEventListener('click',load);
el('import-save').addEventListener('click',()=>el('save-file').click());
el('save-file').addEventListener('change',async e=>{const f=e.target.files?.[0];e.target.value='';if(!f)return;try{if(f.size>MAX_SAVE_BYTES)throw Error('Save exceeds 20 MB.');loadRaw(await f.text(),true);}catch(err){el('import-status').textContent='Could not import: '+err.message;message('Could not import: '+err.message);}});
el('export-save').addEventListener('click',exportSave);
el('save-game').addEventListener('click',save);
el('next-month').addEventListener('click',advanceWithInvasions);
el('auto-time').addEventListener('click',()=>{if(speedInterval){clearInterval(speedInterval);speedInterval=null;el('auto-time').textContent='▶';message('Time paused');}else{speedInterval=setInterval(()=>{if(!game||battle)return;advanceWithInvasions();},1500);el('auto-time').textContent='Ⅱ';message('Time is running');}});
el('focus-capital').addEventListener('click',()=>{if(game){const seat=capitalDistrict(world,game.player,game.provinces);if(seat){selected=seat.id;map.select(selected);map.focus(...staticById[selected].centroid,3.2);renderInspector();}}});
el('reset-map').addEventListener('click',()=>{map.panX=0;map.panY=0;map.zoom=1.02;map.render();});
el('old-world').addEventListener('click',()=>map.focusOldWorld());
el('atlas-expand').addEventListener('click',()=>{
 setDrawer(null);el('atlas-expand').closest('details')?.removeAttribute('open');map.resize();
});
el('toggle-relief').addEventListener('click',()=>{map.setRelief(!map.useRelief);el('toggle-relief').textContent=map.useRelief?'◈ 3D ON':'▤ 3D OFF';el('toggle-relief').setAttribute('aria-pressed',String(map.useRelief));});
el('map-modes').addEventListener('click',e=>{const button=e.target.closest('[data-mapmode]');if(!button)return;map.setMode(button.dataset.mapmode);el('mapmode').textContent=button.dataset.mapmode==='historical'?'1450 REFERENCE':button.dataset.mapmode.toUpperCase();for(const b of el('map-modes').querySelectorAll('[data-mapmode]')){const active=b===button;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active));}if(button.dataset.mapmode==='historical')message('Reference map only: historical coverage is incomplete. Playable provinces remain experimental.');});
el('open-management').addEventListener('click',()=>setDrawer(el('management-panel').hidden?'management':null));
el('open-province').addEventListener('click',()=>setDrawer(el('province-drawer').hidden?'province':null));
el('open-priorities').addEventListener('click',()=>navigateTab('realm'));
for(const id of ['close-management','close-province','panel-scrim'])el(id).addEventListener('click',()=>setDrawer(null));
el('cancel-march').addEventListener('click',cancelMarch);
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!battle){setDrawer(null);cancelMarch();}});
el('show-map-modes').addEventListener('click',()=>{const m=el('map-modes');m.hidden=!m.hidden;el('show-map-modes').setAttribute('aria-expanded',String(!m.hidden));document.querySelector('.map-options').open=false;});
el('zoom-in').addEventListener('click',()=>map.zoomAt(map.w/2,map.h/2,1.35));el('zoom-out').addEventListener('click',()=>map.zoomAt(map.w/2,map.h/2,1/1.35));
el('tabs').addEventListener('click',e=>{const t=e.target.closest('[data-tab]');if(t)navigateTab(t.dataset.tab);});
el('workspace-nav').addEventListener('click',e=>{const t=e.target.closest('[data-workspace]');if(t){const next=workspaceTab(t.dataset.workspace,rememberedTabs);if(next)navigateTab(next);}});
document.addEventListener('click',e=>{const t=e.target.closest('[data-priority-tab]');if(t)navigateTab(t.dataset.priorityTab);});
el('tab-content').addEventListener('change',e=>{
 if(e.target.matches('.policy-select'))clickResult(setPolicy(game,e.target.dataset.policy,Number(e.target.value)));
 if(e.target.id==='diplomatic-select'){diplomaticTarget=e.target.value;renderTab();}
});
document.addEventListener('click',e=>{const unit=e.target.closest('[data-unit]');if(unit&&battle){battle.selected=Number(unit.dataset.unit);battle.report();return;}
 const btn=e.target.closest('[data-action]');if(!btn||!game)return;const action=btn.dataset.action,type=btn.dataset.type;
 if(action==='march'){setDrawer(null);marchFrom=selected;map.setMarchOrigin(selected);el('cancel-march').hidden=false;el('map-target-help').textContent='⚔ SELECT ADJACENT DESTINATION';message('Highlighted land neighbors: green for friendly territory, amber for foreign territory. Treaties may restrict attacks.');}
 if(action==='recruit')clickResult(recruit(game,selected,type));
 if(action==='build')clickResult(build(game,selected,type));
 if(['gift','alliance','insult','trade','marriage'].includes(action))clickResult(negotiate(game,diplomaticTarget,action,world));
 if(action==='court-decision')clickResult(courtDecision(game,world,type));
 if(action==='politics'){const input=btn.dataset.input?el(btn.dataset.input):null;clickResult(politicsAction(game,world,type,btn.dataset.id,input?.value??btn.dataset.extra));}
 if(action==='living'){const input=btn.dataset.input?el(btn.dataset.input):null;clickResult(livingAction(game,campaignWorld(game,world),type,btn.dataset.id,input?.value));}
 if(action==='identity'){const input=btn.dataset.input?el(btn.dataset.input):null;clickResult(identityAction(game,world,type,input?.value??btn.dataset.id,btn.dataset.extra));}
 if(action==='feudal'){const input=btn.dataset.input?el(btn.dataset.input):null;clickResult(feudalAction(game,world,type,btn.dataset.id,input?.value));}
 if(action==='expanded'){clickResult(expandedAction(game,campaignWorld(game,world),type,btn.dataset.id));}
 if(action==='story'){const input=btn.dataset.input?el(btn.dataset.input):null;clickResult(chronicleAction(game,world,type,input?.value??btn.dataset.id));}
 if(action==='strategy'){const first=btn.dataset.input?el(btn.dataset.input):null,second=btn.dataset.second?el(btn.dataset.second):null;clickResult(strategyAction(game,world,type,first?.value??btn.dataset.id,second?.value??btn.dataset.extra));}
 if(action==='naval'){const input=btn.dataset.input?el(btn.dataset.input):null,third=btn.dataset.third?el(btn.dataset.third):null;clickResult(navalAction(game,world,type,btn.dataset.id,input?.value??btn.dataset.extra,third?.value));}
 if(action==='military'){const input=btn.dataset.input?el(btn.dataset.input):null;clickResult(militaryAction(game,world,type,btn.dataset.id,input?.value??btn.dataset.extra));}
 if(action==='economy'){const input=btn.dataset.input?el(btn.dataset.input):null,third=btn.dataset.third?el(btn.dataset.third):null;clickResult(economyAction(game,world,type,btn.dataset.id,input?.value??btn.dataset.extra,third?.value));}
 if(action==='heritage'){const input=btn.dataset.input?el(btn.dataset.input):null,guest=btn.dataset.guest?el(btn.dataset.guest):null;clickResult(heritageAction(game,world,type,btn.dataset.id,input?.value??btn.dataset.extra,guest?.value));}
 if(action==='diplomatic-agreement'){const input=btn.dataset.input?el(btn.dataset.input):null;clickResult(diplomacyAction(game,campaignWorld(game,world),type,btn.dataset.id,input?.value));}
 if(action==='institution'){const first=btn.dataset.input?el(btn.dataset.input):null,second=btn.dataset.second?el(btn.dataset.second):null;clickResult(governmentAction(game,campaignWorld(game,world),first?.value??btn.dataset.id,second?.value));}
 if(action==='civic'){const input=btn.dataset.input?el(btn.dataset.input):null;clickResult(civicAction(game,world,type,btn.dataset.id,input?.value??btn.dataset.extra));}
 if(action==='intrigue'){const input=btn.dataset.input?el(btn.dataset.input):null;clickResult(intrigueAction(game,campaignWorld(game,world),type,btn.dataset.id,input?.value??btn.dataset.extra));}
 if(action==='conflict'){const input=btn.dataset.input?el(btn.dataset.input):null;clickResult(conflictAction(game,campaignWorld(game,world),type,btn.dataset.id,input?.value??btn.dataset.extra));}
 if(action==='royal-choice')clickResult(resolveRoyalEvent(game,world,Number(btn.dataset.choice)));
 if(action==='show-diplomacy'){if(btn.dataset.target==='independent'){message('Independent polities have no central court to negotiate with.');return;}diplomaticTarget=btn.dataset.target;navigateTab('diplomacy');}
});
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
el('battle-sound').addEventListener('click',()=>{battleSound=!battleSound;updateSoundButton();battle?.setSound(battleSound);try{localStorage.setItem('crown-of-nations.battle-sound',battleSound?'on':'off');}catch{}});
el('battle-pause').addEventListener('click',()=>battle?.togglePause());
el('battle-retreat').addEventListener('click',()=>battle?.retreat());
el('battle-start').addEventListener('click',()=>battle?.startAssault());
el('battle-formation').addEventListener('change',e=>{
 if(battle&&!battle.setFormation(battle.selected,e.target.value))message('This formation is not available.');
});
el('battle-order').addEventListener('change',e=>battle?.command(battle.selected,e.target.value));
el('battle-all-order').addEventListener('click',()=>battle?.command(battle.selected,el('battle-order').value,null,true));
el('battle-lanes').addEventListener('click',e=>{
 const target=e.target.closest('[data-lane]');if(target&&battle)battle.setLane(battle.selected,Number(target.dataset.lane));
});
el('invasion-defend').addEventListener('click',openIncomingBattle);
el('invasion-auto').addEventListener('click',()=>{
 if(!game||battle)return;const threat=game.kingdom?.threats?.find(t=>t.status==='ready');
 if(!threat)return;const r=autoResolveInvasion(game,world,threat);
 if(r.ok){message(r.msg);render();save();}
});

window.addEventListener('pagehide',()=>{if(game&&!battle)save(false);});
