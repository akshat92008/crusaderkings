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
   const key=node.dataset.townExtra,url=pack.extras?.[key];if(!url)continue;node.style.backgroundImage='url("'+url+'")';node.classList.add('has-art');if(key==='cart')node.textContent='';
  }
  for(const node of root.querySelectorAll('[data-town-svg-extra]')){const url=pack.extras?.[node.dataset.townSvgExtra];if(url){node.setAttribute('href',url);node.setAttribute('visibility','visible');}}
  for(const node of root.querySelectorAll('.ht-scene')){if(pack.extras?.ground)node.style.setProperty('--ht-grass','url("'+pack.extras.ground+'")');}
 });
}
