/**
 * Deterministic historical-inspired battlefield layout.
 *
 * Layout has a clear field of battle: the centre is deliberately free of
 * static buildings so the existing formation AI remains playable.
 * Buildings are illustrative medieval European types, not period-authentic
 * reconstructions for every faction in the 1450 sandbox.
 */
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
export function seededBattleRandom(seed=1450){
  let s=seed>>>0||1;
  return ()=>{s=(Math.imul(s,1664525)+1013904223)>>>0;return s/4294967296;};
}
export function planMedievalBattlefield(seed=1450,biome='temperate',fortLevel=1){
  const random=seededBattleRandom(seed),desert=biome==='desert',fort=clamp(Math.floor(fortLevel||0),0,4);
  const houses=[],trees=[],tents=[],crates=[],rocks=[];
  // Town lanes remain open around the gate in the fortress's rear.
  const rows=[-51.5,-61,-70];
  for(let row=0;row<rows.length;row++){
    for(let column=-4;column<=4;column++){
      if(Math.abs(column)<1&&row<2)continue;
      if(random()<.16)continue;
      const x=column*8.6+(random()-.5)*1.6,z=rows[row]+(random()-.5)*1.5;
      houses.push({x,z,w:4.1+random()*1.6,d:4.2+random()*1.6,h:3+random()*1.6,
        variant:Math.floor(random()*3),roof:desert?'flat':(random()>.13?'pitched':'flat'),chimney:random()>.57});
    }
  }
  // A populated camp behind the player army: no tents across march lanes.
  for(const side of [-1,1])for(let i=0;i<5;i++){
    const x=side*(35+(i%2)*6)+random()*2,z=29+Math.floor(i/2)*10+(random()-.5)*2;
    tents.push({x,z,r:1.65+random()*.48,color:Math.floor(random()*3)});
  }
  // Tree canopy frames the map without obscuring the two starting armies.
  for(let i=0;i<90;i++){
    const side=random()<.5?-1:1;
    let x=side*(50+random()*30),z=(random()-.5)*138;
    if(desert&&random()<.72)continue;
    trees.push({x,z,size:2.6+random()*4.5,kind:desert?'palm':(random()<.55?'pine':'oak')});
  }
  for(let i=0;i<65;i++){
    const side=random()<.5?-1:1,x=side*(37+random()*41),z=(random()-.5)*130;
    rocks.push({x,z,r:.25+random()*.62});
  }
  for(let i=0;i<22;i++){
    const side=i%2?-1:1,x=side*(33+random()*10),z=25+random()*30;
    crates.push({x,z,size:.4+random()*.34});
  }
  return {biome:desert?'desert':'temperate',fortLevel:fort,houses,trees,tents,rocks,crates,
    gate:{x:0,z:-42,passageWidth:8},towers:[{x:-40,z:-42},{x:40,z:-42}],
    siegeEngines:[{x:-32,z:20},{x:32,z:20}],road:{x:0,from:53,to:-68,width:7}};
}
export function countBattlefieldPieces(layout){
 return Object.fromEntries(['houses','trees','tents','rocks','crates','siegeEngines','towers'].map(k=>[k,layout[k].length]));
}
