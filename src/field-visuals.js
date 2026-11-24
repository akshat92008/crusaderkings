// Renderer-independent visual identity. Material clones are shared by side/type,
// leaving the original KayKit assets untouched and retaining their textures.
export function regimentPalette(side,type){const friendly=side==='attacker';return {tint:friendly?0x8cc7d9:0xd9977e,cloth:friendly?[.24,.56,.70]:[.65,.27,.20],banner:friendly?[.30,.65,.85]:[.88,.36,.24],accent:type==='cavalry'?[.86,.68,.34]:type==='archers'?[.81,.75,.57]:[.68,.72,.73]};}
export function styleFieldSquad(scene,g){const units=scene.groups.get(g.id);if(!units)return;scene.fieldMaterials??=new Map();const palette=regimentPalette(g.side,g.type),key=g.side+':'+g.type;
 if(!scene.fieldMaterials.has(key))scene.fieldMaterials.set(key,new Map());const cache=scene.fieldMaterials.get(key);
 const style=m=>{if(!m?.clone||!m.color)return m;if(cache.has(m))return cache.get(m);const clone=m.clone();if(clone.color?.clone&&clone.color?.lerp){const tint=clone.color.clone().setHex(palette.tint);clone.color.lerp(tint,.30);}cache.set(m,clone);return clone;};
 for(const u of units){if(u.fieldStyled)continue;u.fieldStyled=true;u.rig?.traverse?.(node=>{if(node.isMesh&&node.material)node.material=Array.isArray(node.material)?node.material.map(style):style(node.material);});if(u.current&&Number.isFinite(u.current.time)&&u.current.getClip){const d=u.current.getClip().duration;if(d>0)u.current.time=(u.phase||0)%d;}}
}
export function disposeFieldMaterials(scene){for(const cache of scene.fieldMaterials?.values()||[])for(const m of cache.values())m.dispose?.();scene.fieldMaterials?.clear();}
export function cavalryGait(time,phase,charging){const frequency=charging?13:8,amplitude=charging?.57:.32,t=time*frequency+phase;return {bob:Math.abs(Math.sin(t))*(charging?.09:.045),legs:[0,Math.PI,Math.PI*.7,Math.PI*1.7].map(p=>Math.sin(t+p)*amplitude)};}
export function projectileTrail(p,compact=false){const out=[],t=Math.max(0,Math.min(1,p.t)),count=compact?2:4;for(let i=0;i<count;i++){const u=t-i*.045;if(u<0)continue;const size=i===0?.19:.10*(1-i/count);out.push({x:p.sx+(p.tx-p.sx)*u,z:p.sz+(p.tz-p.sz)*u,y:.9+Math.sin(u*Math.PI)*3,size,head:i===0});}return out;}
