// Shared formation geometry and renderer-independent skinned character update.
const cap=(x,a,b)=>Math.max(a,Math.min(b,x));
export function formationOffsets(count,id,type='infantry'){
 const n=Math.max(0,Math.floor(count)),spacing=type==='cavalry'?1.65:type==='archers'?1.12:.94,points=[];
 const cols=id==='pike_square'?Math.ceil(Math.sqrt(n)):id==='shield_wall'?Math.min(7,n):id==='longbow_line'||id==='volley_line'?Math.min(9,n):id==='skirmish'?Math.min(5,n):Math.min(6,n);
 for(let i=0;i<n;i++){let x=0,z=0;if(id==='cavalry_wedge'||id==='elephant_push'){const row=Math.floor(Math.sqrt(i)),start=row*row;x=(i-start-row)*spacing;z=-row*spacing*1.15;}else if(id==='encirclement'||id==='ambush'){const a=(i/Math.max(1,n-1)-.5)*Math.PI*1.15;x=Math.sin(a)*spacing*Math.max(2,n/5);z=Math.cos(a)*spacing*2.1;}else if(id==='flank'){const side=i%2?1:-1,row=Math.floor(i/2);x=side*spacing*(2+row%2);z=-Math.floor(row/2)*spacing;}else {const row=Math.floor(i/Math.max(1,cols)),col=i%Math.max(1,cols),width=Math.min(cols,n-row*cols);x=(col-(width-1)/2)*spacing*(id==='skirmish'?1.5:1);z=-row*spacing*(id==='shield_wall'?.76:id==='skirmish'?1.45:1);}points.push([x,z]);}
 if(!n)return points;const center=points.reduce((a,p)=>[a[0]+p[0]/n,a[1]+p[1]/n],[0,0]);return points.map(p=>[p[0]-center[0],p[1]-center[1]]);
}
export function fieldFacing(g){const x=g.facingX??0,z=g.facingZ??(g.side==='attacker'?-1:1);return Math.atan2(x,z);}
export function soldierWorldPose(g,offset){const angle=fieldFacing(g),c=Math.cos(angle),s=Math.sin(angle),rout=g.routed?Math.min(5,g.routAge||0)*2.4:0;return {x:g.x+offset[0]*c+offset[1]*s-Math.sin(angle)*rout,z:g.z-offset[0]*s+offset[1]*c-Math.cos(angle)*rout,yaw:g.routed?angle+Math.PI:angle};}
export function visualMode(g){return g.routed?'walk':(g.attackPulse||0)>0?'attack':g.moving?'walk':'idle';}
export function visibleSoldierCount(g,count){if(g.routed&&(g.routAge||0)>=3)return 0;if(g.life<=0)return 0;return Math.min(count,Math.max(1,Math.ceil(count*cap(g.life/100,0,1))));}
function turnToward(a,b,t){return a+Math.atan2(Math.sin(b-a),Math.cos(b-a))*t;}
export function updateFieldCharacters(scene,groups,dt){
 if(!scene.modelsReady)return;
 for(const g of groups||[]){scene.prepareSquad(g);const units=scene.groups.get(g.id);if(!units)continue;
 const n=visibleSoldierCount(g,units.length),offsets=formationOffsets(units.length,g.formationId,g.type),mode=visualMode(g),blend=1-Math.exp(-Math.max(0,dt)*14);
 for(let i=0;i<units.length;i++){const u=units[i];u.root.visible=i<n;if(!u.root.visible)continue;const p=soldierWorldPose(g,offsets[i]);if(!u.fieldReady||dt<=0){u.root.position.set(p.x,0,p.z);u.root.rotation.y=p.yaw;u.fieldReady=true;}else{u.root.position.set(u.root.position.x+(p.x-u.root.position.x)*blend,0,u.root.position.z+(p.z-u.root.position.z)*blend);u.root.rotation.y=turnToward(u.root.rotation.y,p.yaw,blend);}
 if(u.mount)for(let j=0;j<u.mount.legs.length;j++)u.mount.legs[j].rotation.x=mode==='walk'?Math.sin(u.mixer.time*10+u.phase+j*Math.PI*.6)*.36:0;
 if(mode!==u.mode){const action=u.actions[mode]||u.actions.walk||u.actions.idle;if(action&&action!==u.current){action.reset().fadeIn(.12).play();u.current?.fadeOut(.12);u.current=action;}u.mode=mode;}
 if(u.current&&mode==='walk')u.current.timeScale=g.fieldOrder==='charge'?1.25:1;else if(u.current)u.current.timeScale=1;
 u.mixer.update(dt);
 }}
}
