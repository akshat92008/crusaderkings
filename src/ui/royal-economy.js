import {artIcon, eventArt} from '../game-art.js';
import {GOODS} from '../economy-systems.js';
import {renderEconomy, renderTrade} from '../kingdom-ui.js';
import {INNOVATIONS, researchOptions, researchPointsPerQuarter, RESEARCH_COMMISSION_COST} from '../identity-systems.js';
import {controller} from '../campaign-war.js';
import {MONTHS, POLICY} from '../simulation.js';

const pages = {treasury:'Treasury', ledger:'Provinces', trade:'Trade', research:'Research', management:'Production & construction'};
const columns = {name:'Province', development:'Development', population:'Population', output:'Output', shortage:'Shortage'};
const preferences = new WeakMap();
const number = new Intl.NumberFormat('en', {maximumFractionDigits:1});
const fmt = n => number.format(n);
const signed = n => (n > 0 ? '+' : '') + fmt(n);
let current;

function preferencesFor(game) {
 if (!preferences.has(game)) preferences.set(game, new Map());
 const realms = preferences.get(game);
 if (!realms.has(game.player)) realms.set(game.player, {page:'treasury', query:'', scope:'realm', sort:'name', ascending:true});
 return realms.get(game.player);
}

export function provinceLedgerRows(game, world, state) {
 const names = new Map(world.provinces.map(p => [p.id, p.name]));
 const query = state.query.trim().toLocaleLowerCase();
 const rows = [];
 for (const province of Object.values(game.provinces)) {
  if (state.scope === 'realm' && province.owner !== game.player) continue;
  const name = names.get(province.id) || province.id;
  const realm = game.factions[province.owner]?.name || province.owner;
  if (query && ![name, realm].some(value => value.toLocaleLowerCase().includes(query))) continue;
  const local = game.economy?.provinces?.[province.id];
  rows.push({id:province.id, name, realm, development:province.development, population:province.population,
   output:Object.values(local?.output || {}).reduce((sum,value) => sum + value, 0), shortage:local?.shortage || 0});
 }
 const key = state.sort;
 return rows.sort((a,b) => {
  const order = key === 'name' ? a.name.localeCompare(b.name) : a[key] - b[key];
  return (state.ascending ? order : -order) || a.id.localeCompare(b.id);
 });
}

function ledgerTable(g, world, state, esc) {
 const rows = provinceLedgerRows(g, world, state);
 if (!rows.length) return '<p role="status">No provinces match this search.</p>';
 const header = Object.entries(columns).map(([key,label]) => {
  const active = state.sort === key;
  const direction = state.ascending ? 'ascending' : 'descending';
  return '<th scope="col"'+(active?' aria-sort="'+direction+'"':'')+'><button type="button" data-ledger-sort="'+key+'">'+label+(active?(state.ascending?' ↑':' ↓'):'')+'</button></th>';
 }).join('');
 return '<p class="smallnote" role="status">'+fmt(rows.length)+' provinces · Population in thousands · Output in goods per month</p><div class="royal-table-scroll"><table class="royal-ledger"><thead><tr>'+header+'</tr></thead><tbody>'+rows.map(row =>
  '<tr><th scope="row"><button class="character-link" data-province-link="'+esc(row.id)+'">'+esc(row.name)+'</button><small>'+esc(row.realm)+'</small></th>'+
  ['development','population','output','shortage'].map(key => '<td>'+fmt(row[key])+'</td>').join('')+'</tr>').join('')+'</tbody></table></div>';
}

function ledger(g, world, state, esc) {
 return '<h3>Province ledger</h3><div class="royal-ledger-filters"><label>Find a province or realm<input type="search" data-ledger-query value="'+esc(state.query)+'"></label><label>Territory<select data-ledger-scope><option value="realm">My realm</option><option value="world"'+(state.scope==='world'?' selected':'')+'>Whole world</option></select></label></div><div data-ledger-table>'+ledgerTable(g,world,state,esc)+'</div>';
}

function historyChart(g) {
 const samples = g.treasuryHistory?.[g.player] || [];
 if (samples.length < 2) return '<p class="smallnote">The treasury chart fills in as each month closes.</p>';
 const values = samples.map(s => s.gold);
 const min = Math.min(...values), max = Math.max(...values);
 const points = values.map((v,i) => (3+i*294/(values.length-1)).toFixed(1)+','+(max===min?32:58-(v-min)*52/(max-min)).toFixed(1));
 const label = s => MONTHS[s.month].slice(0,3)+' '+s.year;
 return '<figure class="royal-chart"><figcaption>Treasury history · gold</figcaption><svg aria-hidden="true" viewBox="0 0 300 64" preserveAspectRatio="none"><polyline fill="none" stroke="currentColor" stroke-width="2" vector-effect="non-scaling-stroke" points="'+points.join(' ')+'"/></svg><div><span>'+label(samples[0])+' · '+fmt(values[0])+'</span><span>'+label(samples.at(-1))+' · '+fmt(values.at(-1))+'</span></div></figure><details><summary>Monthly balances</summary><dl class="royal-accounts">'+samples.map(s=>'<div><dt>'+label(s)+'</dt><dd>'+fmt(s.gold)+'g</dd></div>').join('')+'</dl></details>';
}

function treasury(g, stats) {
 const lines = [['Provincial taxes',stats.taxIncome],['Treaty revenue',stats.trade],['Trade posts and local commerce',stats.tradePosts],['Army and navy upkeep',-stats.upkeep]];
 return '<div class="royal-cash"><span>Royal treasury</span><strong>'+fmt(g.factions[g.player].treasury)+' <small>gold</small></strong><span>'+signed(stats.balance)+'g monthly operating balance</span></div>'+historyChart(g)+
 '<h3>Monthly accounts</h3><dl class="royal-accounts">'+lines.map(([label,value])=>'<div><dt>'+label+'</dt><dd>'+signed(value)+'g</dd></div>').join('')+'</dl><p class="smallnote">Purchases, loans and shipments also change your treasury.</p>'+
 '<label class="royal-tax">Tax policy <select class="policy-select" data-policy="tax">'+POLICY.tax.map((name,i)=>'<option value="'+i+'"'+(g.factions[g.player].policies.tax===i?' selected':'')+'>'+name+'</option>').join('')+'</select></label><p class="smallnote">Changing policy costs 80g. Higher taxes raise income and unrest.</p>';
}

function trade(g,world,esc) {
 const names = new Map(world.provinces.map(p=>[p.id,p.name]));
 const routes = Object.values(g.economy?.routes || {}).filter(r=>r.realm===g.player && r.status==='active').sort((a,b)=>b.lastValue-a.lastValue || b.lastVolume-a.lastVolume);
 const routeList = routes.map(route=>'<li><strong>'+esc(names.get(route.from)||route.from)+' → '+esc(names.get(route.to)||route.to)+'</strong><span>'+esc(GOODS[route.good]?.name||route.good)+' · '+fmt(route.lastVolume)+' units · '+fmt(route.lastValue)+'g gross'+(route.suspended?' · '+esc(route.suspended):'')+'</span></li>').join('');
 return '<h3>Merchant routes</h3><p>Last month’s goods cash flow <b>'+signed(g.economy?.realms?.[g.player]?.tradeNet || 0)+'g</b></p>'+
 (routes.length?'<ol class="royal-routes">'+routeList+'</ol>':'<p class="smallnote">No active goods routes.</p>')+'<button class="rowbtn" data-economy-page="management">Manage routes and tariffs</button>'+renderTrade(g,world,esc);
}

const disciplines = {records:'administration', irrigation:'engineering', logistics:'strategy', accounting:'commerce', courts:'administration', workshops:'engineering', supply:'strategy', diplomacy:'diplomacy', scholarship:'scholarship', roads:'commerce', taxation:'stewardship', public_works:'engineering'};
function techTier(id, seen = new Set()) {
 const tech = INNOVATIONS[id];
 if (!tech?.requires?.length || seen.has(id)) return 1;
 seen.add(id);
 return 1 + Math.max(...tech.requires.map(req => techTier(req, seen)));
}
function research(g,esc) {
 const realm = g.player, state = g.identity?.realms?.[realm];
 if (!state) return '<p>Research becomes available once your realm has a court.</p>';
 const eligible = new Set(researchOptions(g,realm));
 const rate = researchPointsPerQuarter(g,realm);
 const landed = Object.values(g.provinces).some(p=>p.owner===realm && controller(g,p.id)===realm);
 const tierNames = {1:'Tier I · Foundations', 2:'Tier II · Statecraft & Commerce', 3:'Tier III · Grand Synthesis'};
 const byTier = new Map([[1,[]],[2,[]],[3,[]]]);
 for (const [id, tech] of Object.entries(INNOVATIONS)) {
  const t = Math.min(3, techTier(id));
  byTier.get(t).push([id, tech]);
 }
 const renderNode = ([id, tech]) => {
  const done = state.innovations.includes(id), active = state.research?.id===id;
  const needed = tech.requires.filter(k=>!state.innovations.includes(k));
  const status = done?'✓ Discovered':active?'◐ In progress':needed.length?'🔒 Locked':'★ Available';
  const statusCls = done?'done':active?'active':needed.length?'locked':'ready';
  const progress = active ? state.research.progress : 0;
  const quarters = Math.ceil((tech.cost-progress)/Math.max(1, rate));
  const months = Math.max(0,quarters*3-(g.turn%3));
  const disabled = !landed?'Requires a controlled province':state.research?'Another project is underway':g.factions[realm].treasury<RESEARCH_COMMISSION_COST?'Insufficient gold':'';
  const reqChips = tech.requires.map(k => '<span class="tech-req-chip '+(state.innovations.includes(k)?'met':'missing')+'">'+(state.innovations.includes(k)?'✓ ':'○ ')+esc(INNOVATIONS[k].name)+'</span>').join('');
  const nextStepId = needed.find(k => eligible.has(k));
  return '<article class="royal-innovation '+statusCls+'"><header>'+artIcon('skills',disciplines[id])+'<div><small class="tech-status '+statusCls+'">'+status+'</small><h4>'+esc(tech.name)+'</h4></div></header><p>'+esc(tech.desc)+'</p>'+
   (reqChips?'<div class="tech-req-row">'+reqChips+'</div>':'')+(done?'':'<small>'+tech.cost+' research pts · '+(landed&&rate>0?'~'+months+' mo at current pace':'Paused')+'</small>')+
   (active?'<progress aria-label="Research progress" max="'+tech.cost+'" value="'+progress+'"></progress><small>'+fmt(progress)+' / '+tech.cost+' points</small>':'')+
   (!done&&!active&&eligible.has(id)?'<button class="rowbtn" data-action="identity" data-type="research" data-id="'+id+'"'+(disabled?' disabled':'')+'>Commission · '+RESEARCH_COMMISSION_COST+'g</button>'+(disabled?'<small>'+disabled+'</small>':''):'')+
   (!done&&!active&&nextStepId?'<button class="rowbtn" data-action="identity" data-type="research" data-id="'+nextStepId+'"'+(disabled?' disabled':'')+'>Path → Commission '+esc(INNOVATIONS[nextStepId].name)+' ('+RESEARCH_COMMISSION_COST+'g)</button>':'')+'</article>';
 };
 return '<h3>Royal research tree</h3><p>'+fmt(rate)+' pts/quarter · '+state.innovations.length+' / '+Object.keys(INNOVATIONS).length+' innovations mastered</p><div class="royal-tech-tree">'+[1,2,3].map(tier => '<section class="royal-tech-tier"><h4>'+tierNames[tier]+'</h4><div class="royal-innovations">'+byTier.get(tier).map(renderNode).join('')+'</div></section>').join('')+'</div>';
}

export function renderRoyalEconomy(g, world, esc, stats) {
 const state = preferencesFor(g);
 current = {g,world,state,esc};
 const views = {treasury:()=>treasury(g,stats), ledger:()=>ledger(g,world,state,esc), trade:()=>trade(g,world,esc), research:()=>research(g,esc), management:()=>renderEconomy(g,world,esc)};
 return '<section class="royal-economy"><header class="royal-economy-hero"><img src="'+eventArt('merchant',g.player)+'" alt=""><h2>Royal economy</h2></header><nav aria-label="Economy sections">'+Object.entries(pages).map(([id,name])=>'<button type="button" data-economy-page="'+id+'" aria-pressed="'+(state.page===id)+'">'+name+'</button>').join('')+'</nav>'+views[state.page]()+'</section>';
}

export function bindRoyalEconomy(container, redraw) {
 function updateTable() {
  const table = container.querySelector('[data-ledger-table]');
  if (table && current) table.innerHTML = ledgerTable(current.g,current.world,current.state,current.esc);
 }
 container.addEventListener('click',event=>{
  const page = event.target.closest('[data-economy-page]')?.dataset.economyPage;
  if (Object.hasOwn(pages,page) && current) {
   current.state.page=page;
   redraw();
   container.querySelector('nav [data-economy-page="'+page+'"]')?.focus({preventScroll:true});
  }
  const sort = event.target.closest('[data-ledger-sort]')?.dataset.ledgerSort;
  if (Object.hasOwn(columns,sort) && current) {
   current.state.ascending=current.state.sort===sort?!current.state.ascending:sort==='name';
   current.state.sort=sort;
   updateTable();
   container.querySelector('[data-ledger-sort="'+sort+'"]')?.focus({preventScroll:true});
  }
 });
 container.addEventListener('input',event=>{
  if (!current || !event.target.matches('[data-ledger-query]')) return;
  current.state.query=event.target.value;
  updateTable();
 });
 container.addEventListener('change',event=>{
  if (!current || !event.target.matches('[data-ledger-scope]')) return;
  current.state.scope=event.target.value;
  updateTable();
 });
}
