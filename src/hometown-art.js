// Existing Feudal Wars PNGs plus small selected sprites from the supplied CC0 village pack.
const sheets={"thatched_cottage":[1,12516876,212186,67,68,8],"blacksmith_forge":[1,33175222,250661,66,75,8],"timber_frame_house":[1,55226231,272080,69,79,8],"watermill":[1,73369251,173516,60,64,8],"tavern_inn":[1,91750922,219927,66,69,8],"stone_chapel":[1,106894609,153556,53,62,8],"stone_well":[1,126565869,262320,63,80,8],"windmill":[1,149301641,260042,64,91,8],"bakery":[1,165747939,162010,57,62,8],"stable":[1,179225704,138308,57,55,8],"gatehouse":[1,193826480,177033,50,67,8],"granary_staddle":[1,214409354,260863,70,65,8],"watchtower":[1,240895650,308470,61,95,8],"apothecary":[2,13997540,220604,67,73,8],"fisherman_hut":[2,31200942,182000,64,66,8],"round_cottage":[2,45590969,159725,51,50,8],"lumber_shed":[2,108502967,102460,49,43,8],"dovecote":[2,126541054,259467,56,69,8],"longhouse":[2,140160442,122529,51,50,8],"village_hall":[2,154235879,183437,59,59,8],"wayside_shrine":[2,179019351,350336,66,96,8],"farmhouse_barn":[2,194905000,131827,55,50,8],"market_stall":[2,213265520,246161,69,70,8]};
const direct={barracks:'barracks.png',blacksmith:'blacksmith.png',archery_range:'archery_range.png',castle:'castle.png',stable:'stable.png',watchtower:'watchtower_wooden_full_size.png'};
const fallback={village_hall:'house1b.png',thatched_cottage:'house1.png',timber_frame_house:'house1c.png',gatehouse:'castle.png',blacksmith_forge:'blacksmith.png'};
const cache=new Map(),chunk=83886080;
export function townArt(name){if(direct[name])return '<img class="ht-sprite" alt="" src="assets/'+direct[name]+'">';const d=sheets[name];if(!d)return '<span class="ht-sheet" data-town-art="'+name+'"><img alt="" src="assets/house1.png"></span>';return '<span class="ht-sheet" data-town-art="'+name+'"><img alt="" src="assets/'+(fallback[name]||'house1.png')+'"></span>';}
async function loadSheet(name){if(cache.has(name))return cache.get(name);const promise=(async()=>{const [part,start,len]=sheets[name];const directURL='assets/hometown/'+name+'.png';
 // Packaged releases ship extracted sheets; static hosts may support HTTP range requests.
 const check=await fetch(directURL);if(check.ok&&check.headers.get('content-type')?.includes('image'))return directURL;
 if(!globalThis.DecompressionStream)throw Error('Range sprite decoding unsupported');
 const pieces=[];let at=start,left=len;
 while(left){const ix=Math.floor(at/chunk),offset=at%chunk,n=Math.min(left,chunk-offset);
 const url='assets/packs/large_packs/City_Builder_Village_Buildings_part_'+part+'.zip.part_a'+'abcdefghijklmnopqrstuvwxyz'[ix];
 const res=await fetch(url,{headers:{Range:'bytes='+offset+'-'+(offset+n-1)}});
 if(res.status!==206){await res.body?.cancel();throw Error('Host does not support partial downloads');}
 const bytes=await res.arrayBuffer();if(bytes.byteLength!==n)throw Error('Wrong archive range');pieces.push(bytes);at+=n;left-=n;}
 const stream=new Blob(pieces).stream().pipeThrough(new DecompressionStream('deflate-raw'));const blob=await new Response(stream).blob();return URL.createObjectURL(new Blob([blob],{type:'image/png'}));})().catch(()=>null);cache.set(name,promise);return promise;}
let compiledPromise=null;
function compiled(){return compiledPromise??=fetch('assets/hometown/manifest.json').then(r=>r.ok?r.json():null).catch(()=>null);}
export function hydrateTownArt(root){
 for(const node of root.querySelectorAll('[data-town-art]')){
  const name=node.dataset.townArt;if(node.dataset.loading)continue;node.dataset.loading='yes';
  compiled().then(pack=>{
   const asset=pack?.sprites?.[name]||pack?.extras?.[name];
   if(asset&&node.isConnected){const img=node.querySelector('img');if(img)img.src=asset;node.classList.add('ht-compiled');return;}
   if(!sheets[name])return;loadSheet(name).then(url=>{if(!url||!node.isConnected)return;node.style.aspectRatio=sheets[name][3]+'/'+sheets[name][4];node.style.backgroundImage='url("'+url+'")';node.style.backgroundSize='800% 400%';node.style.backgroundPosition='57.142857% 0';node.querySelector('img')?.remove();});
  });
 }
 compiled().then(pack=>{
  if(!pack)return;
  for(const node of root.querySelectorAll('[data-town-extra]')){
   const key=node.dataset.townExtra,url=pack.extras?.[key]||pack.sprites?.[key];if(!url)continue;node.style.backgroundImage='url("'+url+'")';node.classList.add('has-art');if(key==='cart')node.textContent='';
  }
  for(const node of root.querySelectorAll('[data-town-svg-extra]')){const key=node.dataset.townSvgExtra,url=pack.extras?.[key]||pack.sprites?.[key];if(url){node.setAttribute('href',url);node.setAttribute('visibility','visible');}}
  for(const node of root.querySelectorAll('.ht-scene')){if(pack.extras?.ground)node.style.setProperty('--ht-grass','url("'+pack.extras.ground+'")');}
 });
}

// Composite visual stages use the licensed runtime sprites already checked into main.
// Annexes are architectural decoration, not additional economic buildings.
const HALL_STAGES=[
 ['village_hall',[]],['village_hall',['round_cottage']],['village_hall',['timber_frame_house']],
 ['longhouse',[]],['longhouse',['watchtower']],['longhouse',['gatehouse']],
 ['castle',[]],['castle',['watchtower']],['castle',['watchtower','watchtower']],
 ['castle',['gatehouse','watchtower']]
];
export function buildingAppearance(key,base,level){
 const rank=Math.max(1,Math.min(10,Math.floor(level)||1));
 if(key==='town'){const [main,annexes]=HALL_STAGES[rank-1];return {main,annexes:[...annexes],rank};}
 let main=base,annexes=[];
 if(key==='house')main=rank>=7?'longhouse':rank>=4?'timber_frame_house':base;
 if(key==='farm'){if(rank>=4)annexes.push('granary_staddle');if(rank>=7)annexes.push('windmill');}
 else if(key==='iron'||key==='goldmine'){main='goldmine';if(rank>=4)annexes.push('lumber_shed');if(rank>=7)annexes.push('blacksmith_forge');}
 else if(key==='quarry'){main='lumber_shed';if(rank>=4)annexes.push('stone_well');if(rank>=7)annexes.push('watchtower');}
 else if(key==='market'||key==='tradehall'||key==='guild'){if(rank>=4)annexes.push('market_stall');if(rank>=7)annexes.push('timber_frame_house');}
 else if(key==='fort'||key==='citadel'||key==='palace'){if(rank>=4)annexes.push('watchtower');if(rank>=7)annexes.push('gatehouse');}
 else {if(rank>=4)annexes.push('lumber_shed');if(rank>=7)annexes.push('timber_frame_house');}
 return {main,annexes,rank};
}
function renderVisualSprite(key,main,rank,underConstruction){
 if(underConstruction&&rank<=1)return 'house_foundation';
 if(key==='town'){
  if(rank<=2)return 'hall_stage1';
  if(rank<=4)return 'hall_stage2';
  if(rank<=6)return 'hall_stage3';
 }
 if(key==='house'){
  if(rank<=2)return 'house_stage1';
  if(rank<=5)return 'house_stage2';
  if(rank<=7)return 'house_stage3';
 }
 if(key==='market'&&rank<=3)return 'colony_market';
 if(key==='well'&&rank<=3)return 'colony_well';
 if((key==='shrine'||key==='temple')&&rank<=3)return 'colony_chapel';
 return main;
}
export function buildingComplex(key,base,level,underConstruction=false){
 const v=buildingAppearance(key,base,level);
 const displayMain=renderVisualSprite(key,v.main,level||0,underConstruction);
 return '<span class="ht-complex ht-rank-'+v.rank+(key==='iron'?' ht-iron':'')+'"><span class="ht-complex-main">'+townArt(displayMain)+'</span>'+v.annexes.map((part,i)=>'<span class="ht-annex ht-annex-'+i+'">'+townArt(part)+'</span>').join('')+(underConstruction?'<span class="ht-build-puff" data-town-extra="fx_build_puff" aria-hidden="true"></span>':'')+'</span>';
}
