// Pillar 9: Historical Macro Trade Routes, Node Control, Merchant Republics, Blockades & Plague Vectors.
const cap=(n,a,b)=>Math.max(a,Math.min(b,n));

export const MERCHANT_REPUBLICS=new Set(['venice','genoa','malacca','novgorod','gujarat']);

export const HISTORICAL_TRADE_ROUTES=Object.freeze([
 {
  id:'silk_road',name:'The Silk Road',region:'Eurasia',baseValue:48,
  goods:'Silk, Porcelain & Jade',
  nodes:['ming','chagatai','timurids','qara','ottomans','venice','genoa']
 },
 {
  id:'indian_ocean',name:'Indian Ocean Monsoon Network',region:'Indian Ocean',baseValue:46,
  goods:'Spices, Cotton & Ivory',
  nodes:['gujarat','vijayanagara','bahmani','kilwa','oman','mamluks','bengal']
 },
 {
  id:'levant_med',name:'Mediterranean Levant Corridor',region:'Mediterranean',baseValue:42,
  goods:'Eastern Spices, Glass & Silk',
  nodes:['mamluks','cyprus','ottomans','venice','genoa','aragon']
 },
 {
  id:'hanseatic',name:'Hanseatic North & Baltic Sea',region:'Northern Europe',baseValue:36,
  goods:'Timber, Grain, Wax & Herring',
  nodes:['novgorod','poland','imperial','kalmar','england','burgundy']
 },
 {
  id:'trans_saharan',name:'Trans-Saharan Gold & Salt Road',region:'West & North Africa',baseValue:38,
  goods:'Gold Dust, Salt & Manuscripts',
  nodes:['mali','songhai','morocco','zayyanid','hafsids']
 },
 {
  id:'spice_archipelago',name:'Maritime Spice Archipelago',region:'Southeast Asia',baseValue:44,
  goods:'Cloves, Nutmeg & Pepper',
  nodes:['majapahit','malacca','ayutthaya','bengal','vijayanagara','sunda']
 },
 {
  id:'amber_road',name:'Amber & Fur Overland Route',region:'Eastern Europe',baseValue:30,
  goods:'Amber, Sable Furs & Honey',
  nodes:['muscovy','novgorod','poland','imperial','venice']
 },
 {
  id:'grand_canal',name:'Grand Canal & East China Sea',region:'East Asia',baseValue:45,
  goods:'Tea, Silver, Paper & Lacquer',
  nodes:['ming','joseon','ashikaga','dai-viet']
 },
 {
  id:'danube_corridor',name:'Danube & Black Sea Corridor',region:'Balkans & Pontic',baseValue:32,
  goods:'Grain, Copper, Cattle & Wine',
  nodes:['ottomans','poland','imperial','genoa','horde']
 },
 {
  id:'atlantic_cloth',name:'Atlantic Wool & Cloth Route',region:'Western Europe',baseValue:35,
  goods:'Wool, Flemish Cloth & Wine',
  nodes:['england','burgundy','france','castile','portugal']
 },
 {
  id:'red_sea_incense',name:'Red Sea & Horn Incense Route',region:'Red Sea',baseValue:34,
  goods:'Frankincense, Coffee & Textiles',
  nodes:['ethiopia','mamluks','rasulids','gujarat','kilwa']
 },
 {
  id:'andean_road',name:'Qhapaq Ñan & Pacific Exchange',region:'Americas',baseValue:30,
  goods:'Silver, Coca, Obsidian & Textiles',
  nodes:['inca','muisca','chimu','mexica','maya']
 }
]);

export function initTradeRoutes(g){
 g.tradeRoutes??={version:1,blockades:{},investments:{},plagueLog:[],lastTick:-1};
 g.tradeRoutes.blockades??={};
 g.tradeRoutes.investments??={};
 g.tradeRoutes.plagueLog??=[];
 return g.tradeRoutes;
}

function ownedProvinceCounts(g){
 const counts={};
 for(const p of Object.values(g.provinces||{})){
  if(p?.owner&&p.owner!=='independent')counts[p.owner]=(counts[p.owner]||0)+1;
 }
 return counts;
}

export function routeStatus(g,routeId){
 const route=HISTORICAL_TRADE_ROUTES.find(r=>r.id===routeId);
 if(!route)return null;
 const tr=initTradeRoutes(g);
 const counts=ownedProvinceCounts(g);
 const activeNodes=route.nodes.filter(nid=>(counts[nid]||0)>0&&g.factions?.[nid]);
 const totalWeight=activeNodes.reduce((sum,nid)=>{
  const repBonus=MERCHANT_REPUBLICS.has(nid)?1.45:1;
  const invBonus=1+((tr.investments[routeId+':'+nid]||0)*0.25);
  return sum+Math.min(8,counts[nid]||1)*repBonus*invBonus;
 },0);
 const blockades=Object.values(tr.blockades).filter(b=>b.routeId===routeId&&b.until>g.turn);
 const shares={};
 for(const nid of activeNodes){
  const repBonus=MERCHANT_REPUBLICS.has(nid)?1.45:1;
  const invBonus=1+((tr.investments[routeId+':'+nid]||0)*0.25);
  const w=Math.min(8,counts[nid]||1)*repBonus*invBonus;
  const share=totalWeight>0?w/totalWeight:0;
  const isBlockaded=blockades.some(b=>b.target===nid);
  const factor=isBlockaded?0.45:1;
  const monthlyGold=Math.max(1,Math.round(route.baseValue*share*factor));
  shares[nid]={realm:nid,share:Math.round(share*100),monthlyGold,blockaded:isBlockaded,merchantRepublic:MERCHANT_REPUBLICS.has(nid),invested:tr.investments[routeId+':'+nid]||0};
 }
 return {
  ...route,
  activeNodes,
  blockades,
  shares,
  totalValue:route.baseValue+Object.entries(tr.investments).filter(([k])=>k.startsWith(routeId+':')).reduce((s,[,v])=>s+v*6,0)
 };
}

export function realmTradeRoutes(g,realm){
 const out=[];
 for(const route of HISTORICAL_TRADE_ROUTES){
  const st=routeStatus(g,route.id);
  if(st?.shares?.[realm])out.push({...st,myShare:st.shares[realm]});
 }
 return out;
}

export function realmTradeRouteIncome(g,realm){
 if(!realm||realm==='independent')return 0;
 const tr=initTradeRoutes(g);
 let total=0;
 for(const route of HISTORICAL_TRADE_ROUTES){
  const st=routeStatus(g,route.id);
  if(st?.shares?.[realm])total+=st.shares[realm].monthlyGold;
 }
 // Add raiding siphon from active blockades run by this realm
 for(const b of Object.values(tr.blockades)){
  if(b.by===realm&&b.until>g.turn)total+=b.siphon||8;
 }
 return Math.round(total);
}

export function plagueConnectedRealms(g,sourceRealm){
 const connected=new Set();
 for(const route of HISTORICAL_TRADE_ROUTES){
  if(route.nodes.includes(sourceRealm)){
   for(const n of route.nodes)if(n!==sourceRealm&&g.factions?.[n])connected.add(n);
  }
 }
 return [...connected];
}

export function tradeRouteAction(g,world,action,routeId,targetRealm=null){
 const tr=initTradeRoutes(g),realm=g.player,f=g.factions?.[realm];
 if(!f)return {ok:false,msg:'Invalid realm.'};
 const st=routeStatus(g,routeId);
 if(!st)return {ok:false,msg:'Unknown trade route.'};
 if(action==='invest'){
  if(!st.shares[realm])return {ok:false,msg:'You must control a node along this trade route to charter caravans.'};
  const key=routeId+':'+realm,lvl=tr.investments[key]||0;
  if(lvl>=3)return {ok:false,msg:'Maximum caravan charter rank reached on this route.'};
  const cost=160+lvl*90;
  if(f.treasury<cost)return {ok:false,msg:`Need ${cost} gold to expand caravan charters.`};
  f.treasury-=cost;
  tr.investments[key]=lvl+1;
  g.log?.unshift({date:g.year+' · month '+(g.month+1),text:`Expanded crown caravan charter on ${st.name} (Tier ${lvl+1}).`});
  if(g.log)g.log=g.log.slice(0,45);
  return {ok:true,msg:`Chartered new convoys on ${st.name} (+25% route share).`};
 }
 if(action==='blockade'){
  const target=targetRealm||st.activeNodes.find(n=>n!==realm);
  if(!target||target===realm||!st.shares[target])return {ok:false,msg:'Select a rival realm operating on this route.'};
  const key=routeId+':'+realm+':'+target;
  if(tr.blockades[key]?.until>g.turn)return {ok:false,msg:'Already blockading that realm on this route.'};
  if(f.treasury<95)return {ok:false,msg:'Need 95 gold to dispatch commerce raiders.'};
  f.treasury-=95;
  const siphon=Math.max(6,Math.round(st.shares[target].monthlyGold*0.45));
  tr.blockades[key]={id:key,routeId,by:realm,target,started:g.turn,until:g.turn+12,siphon};
  if(g.factions[target]){
   g.factions[target].relations??={};
   g.factions[target].relations[realm]=cap((g.factions[target].relations[realm]||0)-22,-100,100);
  }
  g.log?.unshift({date:g.year+' · month '+(g.month+1),text:`Blockaded ${g.factions[target]?.name||target} along ${st.name} (−55% their route income, +${siphon}g/mo loot).`});
  if(g.log)g.log=g.log.slice(0,45);
  return {ok:true,msg:`Blockaded ${g.factions[target]?.name||target} on ${st.name} for 12 months.`};
 }
 if(action==='lift-blockade'){
  const key=Object.keys(tr.blockades).find(k=>tr.blockades[k].routeId===routeId&&tr.blockades[k].target===realm&&tr.blockades[k].until>g.turn);
  if(!key)return {ok:false,msg:'No active enemy blockade against you on this route.'};
  if(f.treasury<110)return {ok:false,msg:'Need 110 gold to deploy escort convoys.'};
  f.treasury-=110;
  delete tr.blockades[key];
  return {ok:true,msg:`Escort convoys cleared the blockade on ${st.name}.`};
 }
 return {ok:false,msg:'Unknown trade route action.'};
}

export function tickTradeRoutes(g){
 const tr=initTradeRoutes(g);
 if(tr.lastTick===g.turn)return;
 tr.lastTick=g.turn;
 for(const [k,b] of Object.entries(tr.blockades)){
  if(b.until<=g.turn)delete tr.blockades[k];
 }
 // Spread active epidemics along connected macro trade routes every 6 months
 if(g.turn%6===0&&g.economy?.crises){
  const activeEpidemics=Object.values(g.economy.crises).filter(c=>c.kind==='epidemic'&&c.until>g.turn);
  for(const ep of activeEpidemics.slice(0,2)){
   const owner=g.provinces?.[ep.province]?.owner;
   if(!owner||owner==='independent')continue;
   const partners=plagueConnectedRealms(g,owner);
   if(!partners.length)continue;
   const idx=((g.turn*31+ep.province.length*7)%partners.length);
   const targetRealm=partners[idx];
   const targetProv=Object.values(g.provinces).find(p=>p.owner===targetRealm&&!g.economy.crises['ep-tr-'+p.id]);
   if(targetProv&&((g.turn+targetProv.id.length)%4===0)){
    const key='ep-tr-'+targetProv.id;
    g.economy.crises[key]={id:key,kind:'epidemic',province:targetProv.id,started:g.turn,until:g.turn+9,severity:2,viaTradeRoute:true};
    tr.plagueLog.unshift({turn:g.turn,year:g.year,from:owner,to:targetRealm,province:targetProv.id});
    tr.plagueLog=tr.plagueLog.slice(0,24);
    if(targetRealm===g.player){
     g.log?.unshift({date:g.year+' · month '+(g.month+1),text:`PLAGUE BY TRADE: Merchants carried pestilence from ${g.factions[owner]?.name||owner} into ${targetProv.id}!`});
     if(g.log)g.log=g.log.slice(0,45);
    }
   }
  }
 }
}
