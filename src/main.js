import {CampaignMap} from './map.js';
import {BattleGame} from './battle.js';
import {renderCourt,renderTrade,renderLegacy} from './kingdom-ui.js';
import {courtDecision,resolveRoyalEvent,currentRoyalEvent,tradeIncome,objectives,campaignStanding} from './kingdom-depth.js';
import {createGame,restoreGame,snapshot,MONTHS,BUILDINGS,POLICY,empireStats,controlled,armiesAt,armySize,advanceMonth,setPolicy,build,recruit,startMarch,concludeBattle,negotiate,ownerName} from './simulation.js';
const el=id=>document.getElementById(id);
const fmt=n=>Math.round(n).toLocaleString('en-US');
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const world=await fetch('data/world.json').then(r=>{if(!r.ok)throw Error(`Map data unavailable (${r.status})`);return r.json();});
const staticById=Object.fromEntries(world.provinces.map(p=>[p.id,p]));
let game=null,selected=null,tab='realm',marchFrom=null,diplomaticTarget='france',battle=null,battleDescriptor=null,speedInterval=null,toastTimer=null;
const map=new CampaignMap(el('world-map'),world,onProvince);
if(!map.terrain?.gl){const button=el('toggle-relief');button.textContent='▤ 2D MAP';button.title='3D terrain requires a WebGL2-capable browser';button.setAttribute('aria-pressed','false');button.disabled=true;}
fetch('data/historical-polities-1450.json').then(r=>r.ok?r.json():Promise.reject(new Error('History reference unavailable'))).then(data=>map.setHistorical(data)).catch(e=>console.info('Optional 1450 history layer:',e.message));
const player=()=>game?.factions[game.player];
const displayProvince=p=>p.name.replace(' Province ',' March ');
function message(msg){const t=el('toast');t.textContent=msg;t.classList.add('visible');clearTimeout(toastTimer);toastTimer=setTimeout(()=>t.classList.remove('visible'),3400);}
function clickResult(r){if(!r?.ok)message(r?.msg||'Action unavailable');else{message(r.msg);render();}}
function start(id){game=createGame(world,id);el('start-screen').hidden=true;selected=world.provinces.find(p=>p.owner===id)?.id||null;map.setGame(game);if(selected)map.select(selected);const f=player();map.focus(...f.capital,3.2);render();}
function load(){try{game=restoreGame(localStorage.getItem('crown-of-nations.save'),world);el('start-screen').hidden=true;selected=world.provinces.find(p=>p.owner===game.player)?.id||null;map.setGame(game);map.select(selected);map.focus(...player().capital,3);render();message('Saved campaign restored.');}catch(e){message(`Unable to load save: ${e.message}`);}}
function save(){if(!game)return;try{localStorage.setItem('crown-of-nations.save',snapshot(game));message('Campaign saved to this browser.');}catch(e){message(`Save failed: ${e.message}`);}}
function onProvince(id){if(!game)return;if(marchFrom){let r=startMarch(game,world,marchFrom,id);marchFrom=null;el('map-target-help').textContent='SELECT A PROVINCE TO INSPECT';if(r.ok&&r.type==='battle'){openBattle(r);return;}clickResult(r);}
 selected=id;map.select(id);renderInspector();}
function render(){if(!game)return;const f=player(),s=empireStats(game,game.player);
 el('resource-gold').textContent=fmt(f.treasury)+' ◈';el('resource-army').textContent=fmt(s.troops);el('resource-stability').textContent=fmt(f.stability)+'%';el('date-display').textContent=`${MONTHS[game.month].toUpperCase()} ${game.year}`;
 el('faction-name').textContent=f.name;el('faction-government').textContent=f.government;
 el('faction-flag').style.background=f.color;el('faction-flag').textContent='♛';
 el('world-counter').textContent=`${world.provinces.length} PROVINCES · ${world.factions.length} CIVILIZATIONS`;
 el('latest-event').textContent=game.log[0]?.text||'Your court awaits.';
 const courtButton=document.querySelector('[data-tab="court"]');if(courtButton)courtButton.classList.toggle('pending',Boolean(currentRoyalEvent(game)));
 renderTab();renderInspector();map.render();}
function renderTab(){if(!game)return;for(const b of document.querySelectorAll('.tab'))b.classList.toggle('active',b.dataset.tab===tab);
 const f=player(),s=empireStats(game,game.player);let html='';
 if(tab==='realm'){
  html=`<div class="label">STATE OF THE REALM</div><div class="divider"></div><div class="statlist"><label>Controlled provinces</label><strong>${fmt(s.provinces)}</strong><label>Population</label><strong>${fmt(s.population)}k</strong><label>Total revenue / mo.</label><strong class="up">+${fmt(s.income)}</strong><label>Trade / mo.</label><strong class="up">+${fmt(s.trade||0)}</strong><label>Army upkeep / mo.</label><strong class="down">−${fmt(s.upkeep)}</strong><label>Net treasury / mo.</label><strong class="${s.balance>=0?'up':'down'}">${s.balance>=0?'+':''}${fmt(s.balance)}</strong><label>Food reserve</label><strong>${fmt(f.food)}</strong><label>Food change / mo.</label><strong class="${s.foodDelta>=0?'up':'down'}">${s.foodDelta>=0?'+':''}${fmt(s.foodDelta)}</strong><label>Legitimacy</label><strong>${fmt(f.legitimacy)}%</strong><label>Prestige</label><strong>${fmt(f.prestige)}</strong></div><div class="divider"></div><div class="sectiontitle">CIVILIZATION TRADITION</div><div class="rule">✦ ${esc(f.specialty)}<div class="smallnote">Faction specialties are thematic for this prototype; unique troop bonuses are planned for later versions.</div></div><div class="sectiontitle">COURT ADVICE</div><p class="paragraph">Expand with care. Taxes and conscription increase unrest. A depleted treasury or food reserve undermines public stability. Build markets to finance your armies.</p>`;
 }else if(tab==='decrees'){
  const descriptions={tax:'Taxation balances state revenue against civilian unrest.',levy:'Conscription policy affects the political burden of raising regiments.',tolerance:'Pluralism reduces unrest at the cost of central control.'};
  html=`<div class="label">ROYAL DECREES</div><p class="paragraph" style="margin-top:12px">New laws cost 80 gold to enact. Their consequences apply during monthly simulation.</p>${Object.keys(POLICY).map(key=>`<div class="rule"><div class="label">${key.toUpperCase()}</div><select class="policy-select" data-policy="${key}">${POLICY[key].map((name,i)=>`<option value="${i}" ${f.policies[key]===i?'selected':''}>${esc(name)}</option>`).join('')}</select><div class="smallnote">${descriptions[key]}</div></div>`).join('')}<div class="sectiontitle">REALM STABILITY</div><div class="statlist"><label>Current stability</label><strong>${fmt(f.stability)}%</strong><label>Royal legitimacy</label><strong>${fmt(f.legitimacy)}%</strong></div>`;
 }else if(tab==='diplomacy'){
  const nations=world.factions.filter(q=>q.id!==game.player).sort((a,b)=>a.name.localeCompare(b.name));if(diplomaticTarget===game.player)diplomaticTarget=nations[0].id;
  const other=game.factions[diplomaticTarget]||game.factions.france,rel=f.relations[other.id]||0;
  html=`<div class="label">FOREIGN AFFAIRS</div><div class="sectiontitle">SEND ENVOYS</div><select class="select" id="diplomatic-select">${nations.map(n=>`<option value="${n.id}" ${n.id===diplomaticTarget?'selected':''}>${esc(n.name)}</option>`).join('')}</select><div class="rule"><div class="label">FOREIGN POWER</div><h3 style="font-size:14px;margin:9px 0">${esc(other.name)}</h3><div class="statlist"><label>Relationship</label><strong class="${rel>0?'up':rel<0?'down':''}">${rel>0?'+':''}${rel}</strong><label>Political union</label><strong>${f.treaties[other.id]==='alliance'?'ALLIED':'NONE'}</strong><label>State form</label><strong>${esc(other.government)}</strong></div></div><div class="sectiontitle">ROYAL DIPLOMATIC ACTIONS</div><button class="rowbtn" data-action="gift">✦ Send gift (250 gold)</button><button class="rowbtn" data-action="alliance">⚜ Propose alliance (relation +35)</button><button class="rowbtn" data-action="trade">◈ Establish merchant treaty (140 gold, relation +10)</button><button class="rowbtn" data-action="marriage">♕ Arrange royal marriage (180 gold, relation +20)</button><button class="rowbtn negative" data-action="insult">⚑ Issue formal insult</button><p class="paragraph" style="margin-top:13px">Relations now support merchant treaties and dynastic marriages. Claims, formal peace settlements and dynastic inheritance remain simplified.</p>`;
 }else if(tab==='court'){
  html=renderCourt(game,esc);
 }else if(tab==='trade'){
  html=renderTrade(game,world,esc);
 }else if(tab==='legacy'){
  html=renderLegacy(game,esc);
 }else if(tab==='chronicle'){
  html=`<div class="label">THE ROYAL CHRONICLE</div><div class="sectiontitle">COURT RECORDS</div>${game.log.map(l=>`<div class="rule"><div class="label">${esc(l.date)}</div><div class="smallnote">${esc(l.text)}</div></div>`).join('')}`;
 }
 el('tab-content').innerHTML=html;
}
function renderInspector(){if(!game)return;let p=staticById[selected],state=game.provinces[selected];if(!p||!state){el('province-panel').innerHTML='<div class="emptyselection"><div class="emptycrest">♜</div><h2>THE KING\'S ATLAS</h2><p>Select any province to inspect its holdings.</p></div>';return;}
 const own=state.owner===game.player,owner=game.factions[state.owner],a=armiesAt(game,selected,state.owner),yourArmy=armiesAt(game,selected,game.player)[0];const total=a.reduce((s,q)=>s+armySize(q),0);
 let text=`<div class="inspector"><span class="eyebrow">PROVINCE CHANCERY · ${esc(p.continent.toUpperCase())}</span><h2>${esc(displayProvince(p))}</h2><div class="owner"><span class="swatch" style="background:${esc(owner?.color||'#667670')}"></span>${esc(owner?.name||'Independent Polities')} ${own?'<span style="color:#e4ca83"> · YOUR REALM</span>':''}</div><div class="province-hero">${p.terrain==='forest'?'♣':p.terrain==='highlands'?'▲':'♜'}<span>${esc(p.terrain.toUpperCase())} · ${p.centroid[0].toFixed(1)}°, ${p.centroid[1].toFixed(1)}°</span></div><div class="province-facts"><div class="fact"><label>POPULATION</label><b>${fmt(state.population)}k</b></div><div class="fact"><label>DEVELOPMENT</label><b>LV. ${fmt(state.development)}</b></div><div class="fact"><label>UNREST</label><b style="color:${state.unrest>55?'#e1a194':'#aed2af'}">${fmt(state.unrest)}%</b></div><div class="fact"><label>GARRISON & ARMY</label><b>${fmt(total||45+state.development*12)}</b></div></div>`;
 if(own){text+=`<div class="sectiontitle">MARCHING ORDERS</div><p class="paragraph">${yourArmy?`Your ${fmt(armySize(yourArmy))}-strong field army is stationed here.`:'No field army is stationed here.'} March to a connected province to reinforce or initiate a manual battle.</p><button class="btnblock" data-action="march">⚔ ISSUE MARCH / ATTACK ORDER</button><div class="sectiontitle">RAISE NEW REGIMENTS</div><div class="building-grid"><button data-action="recruit" data-type="infantry">⚔ Infantry <small>50 men · 110g</small></button><button data-action="recruit" data-type="archers">➶ Archers <small>50 men · 150g</small></button><button data-action="recruit" data-type="cavalry">♞ Cavalry <small>25 men · 240g</small></button></div><div class="sectiontitle">PROVINCIAL CONSTRUCTION</div><div class="building-grid">${Object.entries(BUILDINGS).map(([kind,b])=>`<button data-action="build" data-type="${kind}">${b.icon} ${b.name}<small>Lvl ${state.buildings[kind]} / 3 · ${fmt(b.cost*(state.buildings[kind]+1))}g</small></button>`).join('')}</div>`;
 }else{text+=`<div class="sectiontitle">FOREIGN TERRITORY</div><p class="paragraph">To invade, select a neighboring owned province with a field army and choose <strong>Issue March / Attack Order</strong>. Then select this province on the world map.</p><button class="btnblock secondary" data-action="show-diplomacy" data-target="${state.owner}">✦ DIPLOMATIC OPTIONS</button>`;}
 text+=`<div class="sectiontitle">ADJACENT PROVINCES</div><p class="paragraph">${p.neighbors.length} connected land provinces. ${p.neighbors.filter(n=>game.provinces[n].owner!==state.owner).length} under foreign control.</p><div class="divider"></div><p class="paragraph">This map uses generated province shapes for prototype testing. Exact historical 1450 boundaries are not yet represented.</p></div>`;
 el('province-panel').innerHTML=text;
}
function openBattle(desc){el('battle-screen').hidden=false;el('battle-result').hidden=true;el('battle-title').textContent=desc.showcase?'BATTLE SHOWCASE · MEDIEVAL FORTRESS':'THE BATTLE FOR '+desc.to.toUpperCase();el('battle-meta').textContent=desc.showcase?'PRACTICE BATTLE · NO EFFECT ON CAMPAIGN':`${player().name.toUpperCase()} VS ${ownerName(game,desc.enemy).toUpperCase()} · ${fmt(desc.defenseTroops+desc.defenseGarrison)} DEFENDERS`;
 battleDescriptor=desc;try{battle=new BattleGame(el('battle-canvas'),desc,game,onBattleFinished,onBattleStatus);document.body.style.overflow='hidden';}catch(e){el('battle-screen').hidden=true;message(`Battle couldn't start: ${e.message}`);}}
function onBattleStatus(s){el('battle-pause').textContent=s.paused?'▶ RESUME':'Ⅱ PAUSE';const status=s.groups.filter(g=>g.side==='attacker');el('battle-units').innerHTML=status.map((g,i)=>`<button class="unitcard ${i===s.selected?'active':''}" data-unit="${i}"><b>${i+1}. ${g.type.toUpperCase()}</b><small>${g.routed?'ROUTED':Math.round(g.life)+'% STRENGTH'}</small><div class="unithealth"><div style="width:${Math.max(0,g.life)}%"></div></div></button>`).join('');}
function onBattleFinished(result){let f=result.victory;el('battle-result').hidden=false;el('battle-result').innerHTML=`<div class="resultcard"><div class="small-ornament">THE CHRONICLERS REPORT</div><div class="hero-crest">${f?'♛':'⚔'}</div><h2>${f?'GLORIOUS VICTORY':'THE ARMY WITHDRAWS'}</h2><p>${battleDescriptor?.showcase?'This practice battle does not affect your campaign.':f?'The enemy line has broken. The territory shall pass to your crown.':'Your forces have been defeated or forced to retreat.'} Surviving strength: ${Math.round(result.attackerRemaining*100)}%.<br>Battle duration: ${result.seconds} seconds.</p><button id="battle-return" class="goldbtn primary">RETURN TO CAMPAIGN ›</button></div>`;
 el('battle-return').onclick=()=>{const practice=Boolean(battleDescriptor?.showcase);if(!practice)concludeBattle(game,battleDescriptor,result);battle.stop();battle=null;battleDescriptor=null;el('battle-screen').hidden=true;document.body.style.overflow='';render();if(!practice)save();};}
// Bind controls once. Rebuilt content uses delegated events.
el('start-faction').innerHTML=world.factions.slice().sort((a,b)=>a.name.localeCompare(b.name)).map(f=>`<option value="${f.id}" ${f.id==='ottomans'?'selected':''}>${esc(f.name)} — ${esc(f.continent)}</option>`).join('');
function renderStartFaction(){const f=world.factions.find(f=>f.id===el('start-faction').value);el('start-faction-info').textContent=`${f.government} · ${f.continent} · Military tradition: ${f.specialty}`;}
el('start-faction').addEventListener('change',renderStartFaction);renderStartFaction();
el('start-new').addEventListener('click',()=>start(el('start-faction').value));
try{if(localStorage.getItem('crown-of-nations.save'))el('load-existing').hidden=false;}catch{}
el('load-existing').addEventListener('click',load);
el('save-game').addEventListener('click',save);
el('next-month').addEventListener('click',()=>{if(!game||battle)return;advanceMonth(game,world);render();});
el('auto-time').addEventListener('click',()=>{if(speedInterval){clearInterval(speedInterval);speedInterval=null;el('auto-time').textContent='▶';message('Time paused');}else{speedInterval=setInterval(()=>{if(!game||battle)return;advanceMonth(game,world);render();},1500);el('auto-time').textContent='Ⅱ';message('Time is running');}});
el('focus-capital').addEventListener('click',()=>{if(game)map.focus(...player().capital,3.2);});
el('reset-map').addEventListener('click',()=>{map.panX=0;map.panY=0;map.zoom=1.02;map.render();});
el('old-world').addEventListener('click',()=>map.focusOldWorld());
el('atlas-expand').addEventListener('click',()=>{
 const expanded=document.body.classList.toggle('atlas-expanded');
 el('atlas-expand').textContent=expanded?'⊟ RESTORE PANELS':'⛶ FULL ATLAS';
 map.resize();
});
el('toggle-relief').addEventListener('click',()=>{map.setRelief(!map.useRelief);el('toggle-relief').textContent=map.useRelief?'◈ 3D ON':'▤ 3D OFF';el('toggle-relief').setAttribute('aria-pressed',String(map.useRelief));});
el('map-modes').addEventListener('click',e=>{const button=e.target.closest('[data-mapmode]');if(!button)return;map.setMode(button.dataset.mapmode);el('mapmode').textContent=button.dataset.mapmode==='historical'?'1450 REFERENCE':button.dataset.mapmode.toUpperCase();for(const b of el('map-modes').querySelectorAll('[data-mapmode]')){const active=b===button;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active));}if(button.dataset.mapmode==='historical')message('Reference map only: historical coverage is incomplete. Playable provinces remain experimental.');});
el('tabs').addEventListener('click',e=>{let t=e.target.closest('[data-tab]');if(t){tab=t.dataset.tab;renderTab();}});
el('tab-content').addEventListener('change',e=>{
 if(e.target.matches('.policy-select'))clickResult(setPolicy(game,e.target.dataset.policy,Number(e.target.value)));
 if(e.target.id==='diplomatic-select'){diplomaticTarget=e.target.value;renderTab();}
});
document.addEventListener('click',e=>{const unit=e.target.closest('[data-unit]');if(unit&&battle){battle.selected=Number(unit.dataset.unit);battle.report();return;}
 const btn=e.target.closest('[data-action]');if(!btn||!game)return;const action=btn.dataset.action,type=btn.dataset.type;
 if(action==='march'){marchFrom=selected;el('map-target-help').textContent='⚔ SELECT ADJACENT DESTINATION';message('Select a connected province to march or attack.');}
 if(action==='recruit')clickResult(recruit(game,selected,type));
 if(action==='build')clickResult(build(game,selected,type));
 if(['gift','alliance','insult','trade','marriage'].includes(action))clickResult(negotiate(game,diplomaticTarget,action,world));
 if(action==='court-decision')clickResult(courtDecision(game,world,type));
 if(action==='royal-choice')clickResult(resolveRoyalEvent(game,world,Number(btn.dataset.choice)));
 if(action==='show-diplomacy'){if(btn.dataset.target==='independent'){message('Independent polities have no central court to negotiate with.');return;}tab='diplomacy';diplomaticTarget=btn.dataset.target;renderTab();}
});
el('battle-showcase').addEventListener('click',()=>{
 if(!game){message('Begin your reign before opening a practice battle.');return;}
 if(battle){message('A battle is already in progress.');return;}
 const armyEntry=Object.entries(game.armies).find(([,a])=>a.owner===game.player);
 if(!armyEntry){message('Recruit at least one army to enter the battle showcase.');return;}
 const target=world.provinces.find(p=>{const owner=game.provinces[p.id]?.owner;return owner&&owner!==game.player&&game.factions[owner];});
 if(!target){message('No opposing provinces are available.');return;}
 const enemy=game.provinces[target.id].owner;
 openBattle({attacker:armyEntry[0],enemy,to:target.id,defenseTroops:110,defenseGarrison:80,showcase:true});
});
el('battle-pause').addEventListener('click',()=>battle?.togglePause());
el('battle-retreat').addEventListener('click',()=>battle?.retreat());
window.addEventListener('beforeunload',()=>{if(game){try{localStorage.setItem('crown-of-nations.save',snapshot(game));}catch{}}});
