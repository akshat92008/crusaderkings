import {controller} from './campaign-war.js';
import {portBlocked} from './naval-systems.js';
// Regional goods, settlement industries, treasury credit and local crises.
const cap=(n,a,b)=>Math.max(a,Math.min(b,n)),ok=msg=>({ok:true,msg}),no=msg=>({ok:false,msg});
const hash=s=>{let n=2166136261;for(const c of String(s))n=Math.imul(n^c.charCodeAt(0),16777619);return n>>>0;};
export const GOODS={grain:{name:'Grain',price:3},timber:{name:'Timber',price:4},ore:{name:'Iron ore',price:5},fiber:{name:'Textile fiber',price:4},salt:{name:'Salt',price:5},tools:{name:'Tools',price:9},cloth:{name:'Cloth',price:8},provisions:{name:'Preserved provisions',price:7}};
export const INDUSTRIES={
 granary:{name:'Granary',cost:180,desc:'Larger grain and provision stocks; famine resistance.'},
 sawmill:{name:'Sawmill',cost:180,desc:'Timber output +5 per level.',output:'timber',amount:5},
 mine:{name:'Mine',cost:230,desc:'Ore output +5 per level in ore-bearing provinces.',output:'ore',amount:5,requires:'ore'},
 loom:{name:'Weaving workshop',cost:220,desc:'Converts 3 fiber into 2 cloth per level.',input:'fiber',use:3,output:'cloth',amount:2},
 smithy:{name:'Smithy',cost:280,desc:'Converts 3 ore and 1 timber into 2 tools per level.',input:'ore',use:3,second:'timber',output:'tools',amount:2},
 saltery:{name:'Preservation workshop',cost:210,desc:'Converts 3 grain and 1 salt into 2 provisions per level.',input:'grain',use:3,second:'salt',output:'provisions',amount:2},
 infirmary:{name:'Infirmary',cost:250,desc:'Reduces disease severity and population losses.'},
 caravan:{name:'Caravanserai',cost:230,desc:'Raises trade route capacity.'},
 irrigation:{name:'Irrigation works',cost:240,desc:'Grain output +5 per level; drought resistance.',output:'grain',amount:5},
 warehouse:{name:'Warehouse',cost:200,desc:'Expands storage capacity for all goods.'}
};
export const SETTLEMENTS=['Village','Market town','City'];
export const CRISES={epidemic:{name:'Epidemic',months:8},drought:{name:'Drought',months:6},famine:{name:'Famine',months:6},fire:{name:'Settlement fire',months:4},flood:{name:'Flood',months:5}};
const RAW=['grain','timber','ore','fiber','salt'];
function resources(p){const n=hash(p.id);const main=p.terrain==='highlands'?'ore':p.terrain==='forest'?'timber':'grain';return [...new Set([main,RAW[n%RAW.length],RAW[(n>>>8)%RAW.length]])];}
function note(g,realm,message){const e=g.economy;e.history.unshift({realm,turn:g.turn,message});e.history=e.history.slice(0,200);if(realm===g.player){g.log.unshift({date:g.year+' · month '+(g.month+1),text:message});g.log=g.log.slice(0,45);}}
function random(e){e.seed=(Math.imul(e.seed,1664525)+1013904223)>>>0;return e.seed/4294967296;}
const own=(g,realm)=>Object.values(g.provinces).filter(p=>p.owner===realm);
export function initEconomy(g,world){if(g.economy?.version===1)return g.economy;const e=g.economy={version:1,next:1,seed:145099,lastTick:-1,provinces:{},realms:{},routes:{},loans:{},crises:{},history:[],prices:Object.fromEntries(Object.entries(GOODS).map(([k,v])=>[k,v.price]))};
 for(const f of world.factions)e.realms[f.id]={inflation:0,credit:70,tariff:1,lastDebase:-120,lastRelief:-120,tradeNet:0,lastPolicy:-24,merchantGuild:false};
 for(const p of world.provinces){e.provinces[p.id]={resources:resources(p),tier:p.development>=9?1:0,industries:Object.fromEntries(Object.keys(INDUSTRIES).map(k=>[k,0])),stock:Object.fromEntries(Object.keys(GOODS).map(k=>[k,k==='grain'?24:8])),shortage:0,output:{},lastRelief:-12};}
 return e;}
function local(g,id){return g.economy?.provinces[id];}
export function economyModifiers(g,realm){const s=g.economy?.realms[realm];if(!s)return {cost:1,tax:1,levy:1};return {cost:1+s.inflation/100,tax:1-s.inflation/250,levy:1};}
export function industryCost(g,realm,id,kind){const p=local(g,id),r=INDUSTRIES[kind];return r&&p?Math.round(r.cost*(1+p.industries[kind])*economyModifiers(g,realm).cost):0;}
function capacity(p,good){return 60+p.tier*25+p.industries.warehouse*40+(['grain','provisions'].includes(good)?p.industries.granary*40:0);}
function add(p,good,n){p.stock[good]=cap(p.stock[good]+n,0,capacity(p,good));}
function costOf(g,good){return g.economy.prices[good];}
function war(g,a,b){return Object.values(g.conflict?.wars||{}).some(w=>w.status==='active'&&((w.attacker===a&&w.defender===b)||(w.attacker===b&&w.defender===a)));}
function routeAllowed(g,world,realm,from,to){const a=g.provinces[from],b=g.provinces[to];if(!a||!b||controller(g,from)!==realm||controller(g,to)!==b.owner||portBlocked(g,from)||portBlocked(g,to)||a.owner!==realm||from===to||b.owner==='independent'||!g.economy.realms[b.owner]||war(g,realm,b.owner))return false;
 if(b.owner===realm)return !!world.provinces.find(p=>p.id===from)?.neighbors.includes(to);
 const treaty=g.kingdom.tradePacts[[realm,b.owner].sort().join('|')];return !!treaty&&(g.factions[realm].relations[b.owner]||0)>=-30;}
export function tradeDestinations(g,world,realm,from){return Object.values(g.provinces).filter(p=>routeAllowed(g,world,realm,from,p.id));}
function createRoute(g,world,realm,from,to,good){const e=g.economy,f=g.factions[realm];if(!GOODS[good]||!routeAllowed(g,world,realm,from,to))return no('Select a connected domestic destination or a foreign trade-treaty partner.');
 if(Object.values(e.routes).some(r=>r.realm===realm&&r.from===from&&r.to===to&&r.good===good&&r.status==='active'))return no('This trade route already exists.');
 if(Object.values(e.routes).filter(r=>r.realm===realm&&r.status==='active').length>=Math.max(2,own(g,realm).length*2)+(e.realms[realm].merchantGuild?2:0))return no('Trade route limit reached.');
 if(f.treasury<90)return no('Need 90 gold to establish a route.');f.treasury-=90;const id='t'+e.next++;e.routes[id]={id,realm,from,to,good,status:'active',lastVolume:0,lastValue:0,total:0,started:g.turn};return ok('Merchant route established.');}
function flow(g,world,r){const e=g.economy,a=local(g,r.from),b=local(g,r.to),owner=g.provinces[r.to]?.owner;
 r.lastVolume=0;r.lastValue=0;if(!routeAllowed(g,world,r.realm,r.from,r.to)){r.status='closed';r.closed=g.turn;return;}
 const available=Math.max(0,a.stock[r.good]-8),room=Math.max(0,capacity(b,r.good)-b.stock[r.good]);let qty=Math.floor(Math.min(available,room,5+3*(a.industries.caravan+b.industries.caravan)+a.tier+b.tier));
 const price=costOf(g,r.good),seller=g.factions[r.realm],buyer=g.factions[owner],tax=owner===r.realm?0:[0,.05,.12][e.realms[owner].tariff];
 if(owner!==r.realm)qty=Math.min(qty,Math.floor(Math.max(0,buyer.treasury)/price));
 if(qty<=0)return;add(a,r.good,-qty);add(b,r.good,qty);const value=qty*price;
 if(owner!==r.realm){const fee=Math.round(value*tax);buyer.treasury-=value-fee;seller.treasury+=value-fee;e.realms[owner].tradeNet-=value-fee;e.realms[r.realm].tradeNet+=value-fee;}
 r.lastVolume=qty;r.lastValue=owner===r.realm?0:value;r.total+=qty;}
function loan(g,realm,amount){const e=g.economy,s=e.realms[realm],f=g.factions[realm];if(![300,600,1200].includes(amount)||s.credit<30||Object.values(e.loans).some(l=>l.realm===realm&&['active','defaulted'].includes(l.status)))return no('One loan at a time, with credit of at least 30.');if(amount>Math.max(300,own(g,realm).length*450))return no('Loan exceeds the realm credit limit.');
 const id='l'+e.next++,rate=s.credit>=70?1:s.credit>=45?2:3;e.loans[id]={id,realm,principal:amount,remaining:amount,rate,interest:0,start:g.turn,due:g.turn+24,status:'active'};f.treasury+=amount;note(g,realm,'A '+amount+' gold loan was issued at '+rate+'% monthly interest.');return ok('Loan received. Interest accrues monthly; repay within 24 months.');}
function repay(g,realm,id){const e=g.economy,l=e.loans[id],f=g.factions[realm],s=e.realms[realm];if(!l||l.realm!==realm||l.status!=='active'||f.treasury<l.remaining+l.interest)return no('Insufficient funds or no active loan.');f.treasury-=l.remaining+l.interest;l.status='repaid';l.closed=g.turn;s.credit=cap(s.credit+8,0,100);return ok('Loan repaid in full.');}
function serviceLoans(g){const e=g.economy;for(const l of Object.values(e.loans)){if(l.status!=='active')continue;const f=g.factions[l.realm],s=e.realms[l.realm];if(g.turn>l.start)l.interest+=Math.ceil(l.remaining*l.rate/100);
 if(g.turn>=l.due){if(repay(g,l.realm,l.id).ok)continue;const due=l.remaining+l.interest,paid=Math.min(due,Math.max(0,f.treasury));f.treasury-=paid;l.remaining=due-paid;l.interest=0;l.status='defaulted';l.closed=g.turn;s.credit=cap(s.credit-35,0,100);s.inflation=cap(s.inflation+5,0,40);f.legitimacy=cap(f.legitimacy-10,0,100);f.stability=cap(f.stability-8,0,100);note(g,l.realm,'The crown defaulted on a loan. Credit, legitimacy and stability fell.');}}}
function crisis(g,id,kind,severity=35){const e=g.economy,p=g.provinces[id];if(!p||!CRISES[kind]||e.crises[id])return false;e.crises[id]={province:id,kind,severity:cap(severity,5,90),started:g.turn,remaining:CRISES[kind].months,reliefTurn:-12};note(g,p.owner,CRISES[kind].name+' in '+id+'.');return true;}
function stepCrises(g,world){const e=g.economy,active=Object.values(e.crises);
 for(const x of active){const p=g.provinces[x.province],l=local(g,x.province),f=g.factions[p.owner];if(!p||!l)continue;
 const protection=x.kind==='epidemic'?l.industries.infirmary*5:x.kind==='drought'||x.kind==='famine'?l.industries.irrigation*3+l.industries.granary*3:0;
 const severity=Math.max(0,x.severity-protection);p.unrest=cap(p.unrest+Math.floor(severity/24),0,100);
 if(x.kind==='epidemic'||x.kind==='famine'){p.population=cap(p.population-Math.floor(severity/35),4,800);}
 if(x.kind==='fire'&&g.turn===x.started+1&&severity>=30){const kind=Object.keys(l.industries).find(k=>l.industries[k]>0);if(kind)l.industries[kind]--;}
 if(x.kind==='flood'||x.kind==='drought')add(l,'grain',-Math.ceil(severity/12));
 if(f&&p.owner!=='independent'&&x.kind==='famine')f.food=cap(f.food-5,-1000,50000);
 if(x.kind==='epidemic'&&severity>=45&&Object.keys(e.crises).length<20&&random(e)<.14){const neighbors=world.provinces.find(q=>q.id===p.id)?.neighbors||[];const target=neighbors.find(id=>!e.crises[id]);if(target)crisis(g,target,'epidemic',Math.max(20,Math.floor(severity*.65)));}
 x.severity=cap(x.severity-(2+protection*.3),0,90);x.remaining--;if(x.remaining<=0||x.severity<=0){delete e.crises[p.id];note(g,p.owner,CRISES[x.kind].name+' subsided in '+p.id+'.');}
 }
 if(g.turn%6===0&&Object.keys(e.crises).length<12){const candidates=world.provinces.filter(p=>!e.crises[p.id]&&g.provinces[p.id]?.owner!=='independent');if(candidates.length&&random(e)<.65){const p=candidates[Math.floor(random(e)*candidates.length)],k=['epidemic','drought','fire','flood'][Math.floor(random(e)*4)];crisis(g,p.id,k,30+Math.floor(random(e)*25));}}
}
function produce(g,id){const p=g.provinces[id],l=local(g,id);if(!p||!l)return;const x=g.economy.crises[id];l.output={};const factor=x&&['drought','flood','epidemic'].includes(x.kind)?1-x.severity/150:1;
 for(const good of RAW){let qty=good==='grain'?3+p.buildings.farm*2:1; if(l.resources.includes(good))qty+=4;qty=Math.max(0,Math.floor(qty*factor));add(l,good,qty);l.output[good]=qty;}
 for(const [kind,rule] of Object.entries(INDUSTRIES)){const level=l.industries[kind];if(!level||!rule.output)continue;let n=level;if(rule.input){n=Math.min(n,Math.floor(l.stock[rule.input]/rule.use));if(rule.second)n=Math.min(n,Math.floor(l.stock[rule.second]));add(l,rule.input,-n*rule.use);if(rule.second)add(l,rule.second,-n);}
 const qty=Math.floor(n*rule.amount*factor);add(l,rule.output,qty);l.output[rule.output]=(l.output[rule.output]||0)+qty;}
 const demand=Math.max(3,Math.ceil(p.population/35));if(l.stock.grain<demand){const missing=demand-l.stock.grain;add(l,'grain',-l.stock.grain);const supplied=Math.min(missing,l.stock.provisions);add(l,'provisions',-supplied);l.shortage=supplied<missing?l.shortage+1:Math.max(0,l.shortage-1);}else{add(l,'grain',-demand);l.shortage=Math.max(0,l.shortage-1);}
 for(const good of ['cloth','tools','salt'])add(l,good,-Math.min(l.stock[good],Math.max(1,l.tier)));
 if(l.shortage>=4){p.unrest=cap(p.unrest+2,0,100);if(l.shortage>=8&&!g.economy.crises[id]&&p.owner!=='independent')crisis(g,id,'famine',30);}
}
function setPrices(g){const e=g.economy,all=Object.values(e.provinces);for(const [k,v] of Object.entries(GOODS)){const avg=all.reduce((n,p)=>n+p.stock[k],0)/Math.max(1,all.length);e.prices[k]=Math.max(1,Math.round(v.price*cap(1.5-avg/100,.65,1.6)));}}
export function economyAction(g,world,action,id,extra,third){const e=initEconomy(g,world),realm=g.player,s=e.realms[realm],f=g.factions[realm],p=g.provinces[id],l=local(g,id);
 if(action==='route')return createRoute(g,world,realm,id,extra,third);
 if(action==='close-route'){const r=e.routes[id];if(!r||r.realm!==realm||r.status!=='active')return no('No active route.');r.status='closed';r.closed=g.turn;return ok('Trade route closed.');}
 if(action==='loan')return loan(g,realm,Number(id));
 if(action==='repay'){const l=e.loans[id];if(l?.realm===realm&&l.status==='defaulted'){if(f.treasury<l.remaining)return no('Insufficient gold to settle arrears.');f.treasury-=l.remaining;l.remaining=0;l.status='settled';l.closed=g.turn;s.credit=cap(s.credit+12,0,100);return ok('Defaulted loan arrears settled.');}return repay(g,realm,id);}
 if(action==='debase'){if(g.turn-s.lastDebase<24||s.inflation>=30)return no('Debasement limited to once every two years and below 30% inflation.');s.lastDebase=g.turn;s.inflation=cap(s.inflation+8,0,40);f.treasury+=250;f.legitimacy=cap(f.legitimacy-3,0,100);return ok('250 gold raised through debasement; inflation increased.');}
 if(action==='stabilize'){if(f.treasury<180||s.inflation<=0)return no('Need inflation and 180 gold.');f.treasury-=180;s.inflation=cap(s.inflation-6,0,40);return ok('Currency stabilized.');}
 if(action==='guild'){if(s.merchantGuild||f.treasury<250)return no('Guild already chartered or need 250 gold.');f.treasury-=250;s.merchantGuild=true;s.credit=cap(s.credit+10,0,100);return ok('Merchant guild chartered; credit improved.');}
 if(action==='tariff'){const n=Number(id);if(![0,1,2].includes(n)||s.tariff===n||g.turn-s.lastPolicy<12)return no('Tariff policy may be changed once per year.');s.tariff=n;s.lastPolicy=g.turn;return ok('Tariff policy changed.');}
 if(!p||p.owner!==realm||controller(g,id)!==realm||!l)return no('Select an owned settlement.');
 if(action==='industry'){const r=INDUSTRIES[extra],level=l.industries[extra];if(!r||level>=3||r.requires&&!l.resources.includes(r.requires))return no('Industry unavailable or at maximum level.');const cost=industryCost(g,realm,id,extra);if(f.treasury<cost)return no('Need '+cost+' gold.');f.treasury-=cost;l.industries[extra]++;return ok(r.name+' upgraded.');}
 if(action==='settlement'){const cost=350*(l.tier+1);if(l.tier>=2||p.development<5+l.tier*4||f.treasury<cost)return no('Settlement upgrade needs sufficient development and '+cost+' gold.');f.treasury-=cost;l.tier++;p.development=cap(p.development+1,1,20);return ok('Settlement upgraded to '+SETTLEMENTS[l.tier]+'.');}
 if(action==='relief'){const x=e.crises[id];if(!x||g.turn-x.reliefTurn<3||f.treasury<120)return no('Relief requires an active crisis, 120 gold, and a three-month interval.');f.treasury-=120;x.reliefTurn=g.turn;x.severity=cap(x.severity-18,0,90);p.unrest=cap(p.unrest-6,0,100);add(l,'grain',12);return ok('Emergency relief delivered.');}
 return no('Unknown economic action.');
}
export function tickEconomy(g,world){const e=initEconomy(g,world);if(e.lastTick===g.turn)return;e.lastTick=g.turn;
 for(const s of Object.values(e.realms))s.tradeNet=0;
 for(const id of Object.keys(g.provinces))produce(g,id);
 setPrices(g);for(const r of Object.values(e.routes))if(r.status==='active')flow(g,world,r);serviceLoans(g);stepCrises(g,world);
 if(g.turn%12===0)for(const [realm,s] of Object.entries(e.realms)){if(g.factions[realm].treasury>=0){s.inflation=cap(s.inflation-1,0,40);s.credit=cap(s.credit+1,0,100);}}
 if(g.turn%6===0)for(const [realm,s] of Object.entries(e.realms)){if(realm===g.player)continue;const f=g.factions[realm],land=own(g,realm);if(!land.length)continue;
 if(f.treasury>400){const p=land.find(p=>e.crises[p.id]&&e.crises[p.id].severity>=35);if(p){f.treasury-=120;e.crises[p.id].severity=cap(e.crises[p.id].severity-18,0,90);add(local(g,p.id),'grain',12);}}
 if(f.treasury>700){const p=land[hash(realm+g.turn)%land.length],l=local(g,p.id),kind=l.shortage>0?'irrigation':l.resources.includes('ore')?'mine':l.resources.includes('fiber')?'loom':l.resources.includes('timber')?'sawmill':'granary';const cost=industryCost(g,realm,p.id,kind);if(l.industries[kind]<2&&f.treasury>cost+300){f.treasury-=cost;l.industries[kind]++;}}
 if(f.treasury>700&&g.turn%12===0&&random(e)<.35){const from=land[0],dest=tradeDestinations(g,world,realm,from.id).find(p=>p.owner!==realm);if(dest)createRoute(g,world,realm,from.id,dest.id,local(g,from.id).resources[0]);}
 const arrears=Object.values(e.loans).find(l=>l.realm===realm&&l.status==='defaulted');if(arrears&&f.treasury>arrears.remaining+150){f.treasury-=arrears.remaining;arrears.remaining=0;arrears.status='settled';arrears.closed=g.turn;s.credit=cap(s.credit+12,0,100);}else if(f.treasury<100&&s.credit>=55&&g.turn%12===0)loan(g,realm,300);
 }
 for(const map of [e.routes,e.loans])for(const [id,x] of Object.entries(map))if(x.closed!==undefined&&x.status!=='defaulted'&&g.turn-x.closed>120)delete map[id];
}
