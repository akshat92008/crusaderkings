// Deterministic open-field regiment tactics; siege simulation remains separate.
const cap=(v,a,b)=>Math.max(a,Math.min(b,v)),dist=(a,b)=>Math.hypot(a.x-b.x,a.z-b.z);
export const FIELD_ORDERS={advance:'Advance',hold:'Hold position',charge:'Charge',fallback:'Fall back',move:'Move and hold'};
export function initializeFieldGroup(g){g.fieldOrder='advance';g.anchorX=g.x;g.anchorZ=g.z;g.fatigue=0;g.facingX=0;g.facingZ=g.side==='attacker'?-1:1;g.life=g.troopCount>0?100:0;g.initialLife=100;g.initialMorale=g.morale;return g;}
export function issueFieldOrder(g,order,point){if(!g||g.routed||!Object.hasOwn(FIELD_ORDERS,order)||order==='move'&&(!point||!Number.isFinite(point[0])||!Number.isFinite(point[1])))return false;g.fieldOrder=order;g.anchorX=g.x;g.anchorZ=g.z;if(order==='move'){g.anchorX=cap(point[0],-64,64);g.anchorZ=cap(point[1],-46,46);}if(order==='fallback'){g.anchorZ=cap(g.z-g.facingZ*16,-46,46);g.anchorX=cap(g.x-g.facingX*16,-64,64);}return true;}
export function fieldTarget(g,enemies){return enemies.slice().sort((a,b)=>{const score=e=>dist(g,e)+(g.type==='cavalry'?(e.type==='archers'?-12:e.formationId==='pike_square'?20:0):g.type==='archers'&&e.type==='cavalry'?-4:0);return score(a)-score(b)||String(a.id).localeCompare(String(b.id));})[0];}
function targetPosition(g,e,all){const order=g.fieldOrder||'advance',d=dist(g,e),dx=(e.x-g.x)/(d||1),dz=(e.z-g.z)/(d||1);if(['hold','move','fallback'].includes(order))return [g.anchorX??g.x,g.anchorZ??g.z];
 if(g.type==='archers'&&order!=='charge'){const preferred=g.range*.83;if(d<g.range*.46)return [g.x-dx*6,g.z-dz*6];if(d<=preferred)return [g.x,g.z];return [e.x-dx*preferred,e.z-dz*preferred];}
 if(g.type==='cavalry'&&order!=='charge'&&e.type==='infantry'&&d>10){const flank=g.order%2?1:-1;return [e.x+flank*7,e.z-dz*2];}
 return [e.x-dx*Math.min(g.range*.55,1.5),e.z-dz*Math.min(g.range*.55,1.5)];}
export function fieldStrength(groups,side){return groups.filter(g=>g.side===side&&!g.routed).reduce((n,g)=>n+(g.troopCount||0)*cap(g.life/100,0,1)*(0.5+cap(g.morale/100,0,1)*.5),0);}
function random(state){state.fieldSeed=((state.fieldSeed??145019)*1664525+1013904223)>>>0;return state.fieldSeed/4294967296;}
export function stepField(state,dt){const live=state.groups.filter(g=>!g.routed),positions=new Map(live.map(g=>[g.id,{x:g.x,z:g.z}])),hits=[];
 for(const g of live){const e=fieldTarget(g,live.filter(x=>x.side!==g.side));if(!e)continue;const order=g.fieldOrder||'advance',target=targetPosition(g,e,live),dx=target[0]-g.x,dz=target[1]-g.z,d=Math.hypot(dx,dz);g.phase=(g.phase||0)+dt*(g.type==='cavalry'?10:5);g.targetX=cap(target[0],-64,64);g.targetZ=cap(target[1],-46,46);
 const moving=d>.35,aggressive=order==='charge';g.fatigue=cap((g.fatigue||0)+dt*(moving?(aggressive?1.2:.30):-.65),0,100);
 if(moving){const step=Math.min(d,dt*g.speed*(.65+.35*g.life/100)*(1-g.fatigue*.004)*(aggressive?1.16:order==='fallback'?.92:1));g.x=cap(g.x+dx/d*step,-64,64);g.z=cap(g.z+dz/d*step,-46,46);g.facingX=dx/d;g.facingZ=dz/d;}else if(order==='move'||order==='fallback'){g.fieldOrder='hold';}
 // Friendly groups repel one another gently, but holding units stay anchored.
 if(!['hold','move','fallback'].includes(order))for(const other of live){if(other===g||other.side!==g.side)continue;const p=positions.get(other.id),sx=g.x-p.x,sz=g.z-p.z,sep=Math.hypot(sx,sz);if(sep>.001&&sep<3){const push=Math.min(.45,dt*(3-sep));g.x=cap(g.x+sx/sep*push,-64,64);g.z=cap(g.z+sz/sep*push,-46,46);}}
 g.cooldown=(g.cooldown||0)-dt;const range=dist(g,e);if(range>g.range||g.cooldown>0||order==='fallback')continue;g.cooldown=g.type==='archers'?1.2:.8;
 const power=cap((g.troopCount||1)/Math.max(1,e.troopCount||1),.35,2.5),charge=aggressive&&g.type==='cavalry'&&moving?1.22:1,brace=e.fieldOrder==='hold'&&['pike_square','shield_wall'].includes(e.formationId)&&g.type==='cavalry'?1.25:1;
 const damage=g.damage*(.55+.45*g.life/100)*(1-g.fatigue*.004)*power*charge*(g.type==='cavalry'&&e.type==='archers'?1.35:1)/(Math.max(.6,e.armor||1)*brace*(g.type==='cavalry'?Math.max(.6,e.cavalryCounter||1):1))*(.88+random(state)*.24);
 hits.push({g,e,damage});if(g.type==='archers')state.projectiles.push({sx:g.x,sz:g.z,tx:e.x,tz:e.z,t:0});}
 for(const {e,damage} of hits){e.life=cap(e.life-damage*.19,0,100);e.morale=cap(e.morale-damage*.31,0,100);}
 const routed=[];for(const g of live)if(g.life<8||g.morale<13){g.routed=true;routed.push(g);}
 for(const g of routed)for(const ally of live)if(!ally.routed&&ally.side===g.side&&dist(ally,g)<14)ally.morale=cap(ally.morale-7,0,100);
 for(const p of state.projectiles)p.t+=dt*2.3;state.projectiles=state.projectiles.filter(p=>p.t<=1);
}
