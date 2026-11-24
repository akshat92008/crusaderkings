// Field-battle-only scenery, shared by the shipped bundle and fallback renderer.
// Raised props remain outside the playable combat rectangle; no collision or siege mechanics.
export function fieldScenery(seed=1450,biome='temperate',compact=false){
 let st=seed>>>0||1;const rand=()=>{st=(Math.imul(st,1664525)+1013904223)>>>0;return st/4294967296;};
 const desert=biome==='desert',items=[],add=(shape,x,y,z,sx,sy,sz,color)=>{const o=[x,y,z,sx,sy,sz,...color];o.shape=shape;items.push(o);};
 const grass=desert?[.58,.46,.31]:[.31,.40,.26],earth=desert?[.48,.36,.23]:[.36,.32,.22],rock=desert?[.48,.40,.30]:[.38,.39,.34],wood=[.25,.18,.12],leaf=desert?[.32,.39,.22]:[.21,.33,.18];
 const ground=[0,-.34,0,190,.62,175,...grass];ground.shape='box';
 // Shallow, irregular color patches define rough ground without obstructing orders.
 for(const side of [-1,1])for(let i=0;i<(compact?8:18);i++){const x=side*(45+rand()*28),z=-57+rand()*114,r=2+rand()*5;add('sphere',x,.018,z,r,.045,r*(.5+rand()*.6),earth);}
 for(const side of [-1,1]){
  for(let i=0;i<(compact?5:11);i++){const x=side*(69+rand()*15),z=-67+rand()*134,h=2.8+rand()*3.9;if(desert&&i%3!==0){add('sphere',x,h*.24,z,h*1.2,h*.55,h*.9,rock);continue;}add('cylinder',x,h*.25,z,.42,h*.5,.42,wood);if(desert){for(let j=0;j<3;j++)add('sphere',x+(j-1)*h*.20,h*.71,z,h*.52,h*.24,h*.62,leaf);}else{add('cone',x,h*.65,z,h*.63,h*.82,h*.63,leaf);add('cone',x,h*.89,z,h*.42,h*.51,h*.42,[.28,.40,.21]);}}
  for(let i=0;i<(compact?6:12);i++){const x=side*(68+rand()*15),z=-60+rand()*120,r=.35+rand()*1.4;add('sphere',x,r*.24,z,r*1.8,r*.6,r*1.3,rock);}
  // Distant low terrain silhouettes rather than fortifications.
  for(let i=0;i<3;i++){const x=side*(79+rand()*7),z=-55+i*55,h=2+rand()*4;add('sphere',x,h*.25,z,15,h,22,desert?[.48,.39,.29]:[.30,.36,.25]);}
  // Rear camp, outside the field's z=±46 limit.
  for(let i=0;i<(compact?2:3);i++){const x=side*(24+i*8),z=side*(56+rand()*7),r=2.3+rand()*.5;add('cone',x,1.35,z,r*1.6,2.6,r*1.6,side===1?[.38,.49,.56]:[.56,.32,.23]);add('cylinder',x,1.5,z,.12,3,.12,wood);add('box',x+3,.35,z,.8,.7,.8,wood);}
 }
 return {ground,items};
}
export function suppressFortScenery(environment){const group=environment?.group;if(!group)return false;for(const child of group.children||[])if(child.name!=='Illustrated battlefield ground')child.visible=false;return true;}
export function battleContactShadow(g){if(g.routed&&(g.routAge||0)>=3||g.life<=0)return null;const scale=Math.max(1,Math.sqrt(Math.min(36,g.troopCount||1))*.8);const o=[g.x,.015,g.z,scale*1.7,.035,scale,[.18,.22,.17]].flat();o.shape='sphere';return o;}
