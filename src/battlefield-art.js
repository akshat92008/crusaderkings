/**
 * Procedural, historically-inspired medieval battle environment for the
 * browser tactical scene. Uses a few instanced geometries and locally generated
 * textures, so players need not download hundreds of MB of authoring models.
 *
 * Forts are a *visual* representation of the province's development. Siege
 * collision, wall destruction and gate/pathfinding remain separate work.
 */
import * as THREE from 'three';
import {planMedievalBattlefield,countBattlefieldPieces} from './battlefield-layout.js';

const rgb=(color)=>new THREE.Color(color);
function texture(type,base,seed=1450){
  const c=document.createElement('canvas'),N=256;c.width=c.height=N;
  const g=c.getContext('2d');g.fillStyle=base;g.fillRect(0,0,N,N);
  let st=(seed+type.length*137)>>>0;const random=()=>{st=(Math.imul(st,1664525)+1013904223)>>>0;return st/4294967296;};
  if(type==='stone'){
    const row=20;
    for(let y=0;y<N;y+=row){const offset=((y/row)%2)*19;for(let x=-offset;x<N;x+=36){
      g.fillStyle=random()<.5?'rgba(249,232,190,.11)':'rgba(47,41,32,.105)';
      g.fillRect(x+1,y+1,34,row-2);
      g.strokeStyle='rgba(35,37,34,.22)';g.lineWidth=1;g.strokeRect(x+.5,y+.5,36,row);
    }}
  }else if(type==='roof'){
    for(let y=0;y<N;y+=12){g.strokeStyle='rgba(43,25,18,.23)';g.lineWidth=1;g.beginPath();g.moveTo(0,y);g.lineTo(N,y);g.stroke();
      for(let x=0;x<N;x+=20){g.beginPath();g.moveTo(x+(y%24),y);g.lineTo(x+(y%24),y+12);g.stroke();}}
  }else if(type==='wood'){
    for(let x=0;x<N;x+=16){g.strokeStyle='rgba(50,30,18,.2)';g.lineWidth=1.3;g.beginPath();g.moveTo(x,0);g.lineTo(x,N);g.stroke();}
  }
  const spots=type==='ground'?16000:2300;
  for(let i=0;i<spots;i++){
    const x=random()*N,y=random()*N,s=.35+random()*(type==='ground'?4:1.3);
    g.fillStyle=random()<.5?'rgba(255,238,179,.065)':'rgba(19,25,18,.060)';
    g.fillRect(x,y,s,s);
  }
  const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;t.wrapS=t.wrapT=THREE.RepeatWrapping;
  t.anisotropy=2;t.generateMipmaps=true;
  return t;
}
const geometry=()=>({
 box:new THREE.BoxGeometry(1,1,1),
 cylinder:new THREE.CylinderGeometry(.5,.5,1,10),
 cone:new THREE.ConeGeometry(.5,1,9),
 sphere:new THREE.SphereGeometry(.5,9,7),
 ring:new THREE.TorusGeometry(.5,.11,5,16)
});
function material(color,tex=null){
  return new THREE.MeshLambertMaterial({color:rgb(color),map:tex,side:THREE.DoubleSide});
}
export function buildMedievalBattlefield(scene,config={}){
  const layout=planMedievalBattlefield(config.seed??1450,config.biome??'temperate',config.fortLevel??1);
  const desert=layout.biome==='desert';
  const group=new THREE.Group();group.name='Medieval battlefield scenery';scene.add(group);
  const texStone=texture('stone',desert?'#d0b38a':'#bcb39a',1450),texWood=texture('wood','#987453',45);
  const texRoof=texture('roof',desert?'#d5ad80':'#8d5c48',71);
  const groundTex=texture('ground',desert?'#b79e79':'#778766',1490);groundTex.repeat.set(8,7);
  const mats={
    stone:material(desert?'#d4b894':'#bcb8a9',texStone),
    stoneShade:material(desert?'#9d8063':'#8f8d84',texStone),
    plaster:material(desert?'#e3c7a2':'#dacdb3',texStone),
    roof:material(desert?'#a87b54':'#86513e',texRoof),
    roofBlue:material('#4d7181',texRoof),
    wood:material('#6b4931',texWood),
    darkWood:material('#352b28',texWood),
    leather:material('#a17b58'),
    clothBlue:material('#37748c'),
    clothRed:material('#9c4939'),
    clothCream:material('#e0c594'),
    moss:material(desert?'#9c9563':'#455c3a'),
    grass:material(desert?'#baa17a':'#7a8d62'),
    leaves:material(desert?'#728060':'#476b44'),
    leavesLite:material('#759459'),
    dirt:material(desert?'#a88d67':'#716e55'),
    rock:material('#77756c'),
    black:material('#252b28'),
    gold:material('#c7a15b'),
    ember:material('#ff923e'),
    roofPeak:material('#684538')
  };
  const geo=geometry(),buckets=new Map(),tmp=new THREE.Object3D(),dynamic=[];
  function add(kind,mat,x,y,z,sx,sy,sz,rotZ=0,rotY=0){
    const key=kind+'|'+mat;
    if(!buckets.has(key))buckets.set(key,{kind,material:mats[mat],list:[]});
    buckets.get(key).list.push({x,y,z,sx,sy,sz,rotZ,rotY});
  }
  function block(mat,x,y,z,sx,sy,sz,rotZ=0,rotY=0){add('box',mat,x,y,z,sx,sy,sz,rotZ,rotY);}
  function pole(mat,x,y,z,h,r=.12){add('cylinder',mat,x,y+h/2,z,r*2,h,r*2);}
  function house(h){
    // Houses have actual pitched roof planes, doors, chimney and narrow windows.
    const {x,z,w,d,variant,roof,chimney}=h,H=h.h,body=variant===0?'plaster':variant===1?'stone':'stoneShade';
    block(body,x,H*.5,z,w,H,d);
    for(const dx of [-w*.37,w*.37]){block('wood',x+dx,H*.51,z+d*.501,.13,H*.92,.12);}
    block('darkWood',x,.84,z+d*.506,w*.23,1.64,.12);
    for(const dx of [-w*.30,w*.30]){block('black',x+dx,H*.67,z+d*.512,.36,.66,.06);}
    if(roof==='pitched'){
      const rise=1.55,angle=Math.atan(rise/(w*.5)),length=Math.hypot(w*.5,rise)*1.12;
      block(variant===2?'roofBlue':'roof',x-w*.25,H+rise*.51,z,length,.28,d+.64,angle);
      block(variant===2?'roofBlue':'roof',x+w*.25,H+rise*.51,z,length,.28,d+.64,-angle);
      pole('darkWood',x,H+rise,z,.04,.02); // small roof ridge pin
      if(chimney){block('stoneShade',x+w*.26,H+rise*.85,z-d*.20,.67,1.35,.73);}
    }else{
      block('plaster',x,H+.18,z,w+.4,.38,d+.4);
      for(const dx of [-w*.48,w*.48])block('stoneShade',x+dx,H+.53,z,.28,.72,d+.25);
    }
    // Heavy timber base beams/entry stair.
    block('wood',x,.16,z+d*.56,w*.36,.26,.78);
  }
  function tower(x,z,level){
    const radius=7.4+level*.45,H=10.7+level*.8;
    add('cylinder','stone',x,H*.5,z,radius,H,radius);
    add('cylinder','stoneShade',x,1,z,radius+1,1.3,radius+1);
    add('cylinder','stoneShade',x,H-.3,z,radius+.8,.65,radius+.8);
    for(let i=0;i<10;i++){const theta=i*Math.PI/5;
      block('stone',x+Math.cos(theta)*radius*.45,H+.4,z+Math.sin(theta)*radius*.45,1.45,1.6,1.38,0,theta);
    }
    add('cone',desert?'stoneShade':'roof',x,H+2.45,z,radius+1.2,4.5,radius+1.2);
    block('black',x,H*.63,z+radius*.49,1.1,1.8,.15);
    block('wood',x,H*.32,z+radius*.49,1.1,1.35,.22);
    flag(x,H+4.5,z,level%2===0?'clothBlue':'clothRed');
  }
  const flags=[];
  function flag(x,y,z,materialName){
    pole('darkWood',x,y,z,3.1,.09);
    block(materialName,x+1.0,y+2.45,z,1.95,.85,.09);
    add('sphere','gold',x,y+3.22,z,.3,.3,.3);
  }
  function mainGate(){
    const z=-42,g=layout.gate;
    block('stone',-5.4,3.9,z,2.0,7.8,3.7);
    block('stone',5.4,3.9,z,2.0,7.8,3.7);
    block('stoneShade',0,7.0,z,9.6,2.25,4.2);
    block('darkWood',0,3.3,z+1.92,8.1,6.2,.33);
    // Vertical portcullis pickets let the door read at isometric camera distances.
    for(let i=-3;i<=3;i++){block('stoneShade',i*1.12,3.1,z+2.13,.16,5.6,.29);}
    block('black',0,4.8,z+2.14,7.5,.31,.32);
    block('black',0,1.6,z+2.14,7.5,.26,.32);
    block('stone',0,8.45,z,11.6,.9,4.1);
    flag(0,9.1,z, 'clothRed');
  }
  function battlements(){
    const height=5.3,wallTop=height*1.65;
    for(let x=-36;x<=36;x+=6){
      if(Math.abs(x)<6)continue;
      block('stone',x,height*.55,-42,5.85,height*1.45,3.0);
      block('stoneShade',x,wallTop*.91,-42,6.1,.7,3.35);
      for(let i=-2;i<=2;i++)block('stone',x+i*1.16,wallTop+0.5,-40.63,.77,1.3,.84);
    }
    // Corner towers make the fort instantly legible from the camera.
    for(const p of layout.towers)tower(p.x,p.z,layout.fortLevel);
    mainGate();
    for(const side of [-1,1]){
      for(let z=-43;z>=-71;z-=7){
        block('stone',side*40,3.5,z,3.2,7.0,6.8);
        for(let dz=-2;dz<=2;dz+=2)block('stone',side*40,7.55,z+dz,.85,1.0,.9);
      }
    }
  }
  function path(){
    // Broad unbroken stone road physically aligns camp and the castle entrance.
    const p=new THREE.Mesh(new THREE.PlaneGeometry(7.2,130),
       new THREE.MeshLambertMaterial({color:desert?0xc5aa85:0xada58d,map:texStone,side:THREE.DoubleSide}));
    p.name='Gate road';p.rotation.x=-Math.PI/2;p.position.set(0,.026,-8);group.add(p);
    for(let z=45;z>=-58;z-=7){
      for(const side of [-1,1])block('stoneShade',side*3.9,.065,z,.16,.09,5.6);
    }
    for(let i=0;i<125;i++){
      const r=(i*1987)%99/99,x=((i*31)%100)/100*8-4,z=-58+((i*73)%107);
      if(r<.55)block('dirt',x,.046,z,.5,.034,.17);
    }
  }
  function woods(){
    for(const t of layout.trees){
      const {x,z,size,kind}=t;
      pole('wood',x,0,z,size*.48,size*.068);
      if(kind==='pine'){
        add('cone','leaves',x,size*.72,z,size*.43,size*.82,size*.43);
        add('cone','leavesLite',x,size*.99,z,size*.31,size*.55,size*.31);
      }else if(kind==='palm'){
        for(let i=0;i<6;i++){const a=i*Math.PI/3,dx=Math.cos(a)*size*.25,dz=Math.sin(a)*size*.25;
          add('cone','leaves',x+dx,size*.99,z+dz,size*.16,size*.65,size*.16,Math.PI*.42,a);}
      }else{
        add('sphere','leaves',x,size*.82,z,size*.65,size*.64,size*.65);
        add('sphere','leavesLite',x+size*.16,size*1.04,z-size*.12,size*.38,size*.37,size*.38);
      }
    }
    for(const t of layout.rocks)add('sphere','rock',t.x,t.r*.32,t.z,t.r*1.8,t.r*.65,t.r*1.3);
    // Wild grasses and yellow flowers in soft clear edges.
    for(let i=0;i<230;i++){
      const side=i%2?-1:1,x=side*(40+(i*37%43)),z=((i*29)%128)-64;
      add('cone',i%7===0?'clothCream':'moss',x,.24,z,.30,.5,.30);
    }
  }
  function tents(){
    for(const t of layout.tents){
      const mat=['clothBlue','clothCream','clothRed'][t.color];
      add('cylinder','leather',t.x,.1,t.z,t.r*2,.24,t.r*2);
      add('cone',mat,t.x,1.12,t.z,t.r*2,2.25,t.r*2);
      pole('wood',t.x,0,t.z,2.5,.07);
      if(t.color===0)flag(t.x,1.45,t.z,'clothBlue');
    }
    for(const t of layout.crates)block('wood',t.x,t.size*.5,t.z,t.size,t.size,t.size);
    // Three military campfires; animated amber lights remain inexpensive.
    for(const [x,z] of [[-41,32],[41,36],[-51,54]]){
      for(let i=0;i<7;i++){const a=i*Math.PI*2/7;
        add('sphere','rock',x+Math.cos(a)*.64,.14,z+Math.sin(a)*.64,.47,.24,.47);
      }
      add('cone','ember',x,.42,z,.72,1.12,.72);
      const lamp=new THREE.PointLight(0xff9a49,2,10,2);lamp.position.set(x,1.05,z);group.add(lamp);dynamic.push(lamp);
    }
  }
  function siegeEngine(x,z){
    // Catapult: wheeled timber base, pyramidal struts, winch and stone payload.
    block('wood',x,.62,z,3.7,.45,4.2);
    for(const dx of [-1.5,1.5]){
      add('cylinder','darkWood',x+dx,.65,z-1.45,1.35,.64,1.35,Math.PI/2);
      add('cylinder','stoneShade',x+dx,.66,z-1.45,.4,.72,.4,Math.PI/2);
      block('wood',x+dx*.44,2.10,z,.29,3.2,.32,dx>0?-.45:.45);
    }
    block('wood',x,3.2,z-1.0,.34,5.1,.3,.42);
    add('sphere','rock',x,5.3,z-1.0,.8,.65,.8);
    flag(x-1,2.75,z+1.7,'clothBlue');
  }
  function streets(){
    for(const h of layout.houses)house(h);
    for(const e of layout.siegeEngines)siegeEngine(e.x,e.z);
    // Village market-stall awnings are visible above the city gate walls.
    for(const [x,z] of [[-26,-54],[20,-58],[27,-68]]){
      for(const dx of [-2,2])pole('wood',x+dx,0,z+2,3.1,.09);
      block('clothBlue',x,3.1,z+1.4,4.8,.15,3.2);
      block('wood',x,1.3,z,4.2,.18,2.1);
    }
    // Surveyed-looking but original decorative stone carts, barrels, sacks.
    for(const x of [-22,23])for(const z of [-58,-65]){
      add('cylinder','wood',x,.53,z,1.0,1.0,1.0);
      add('cylinder','darkWood',x,.50,z,1.08,.09,1.08);
    }
  }
  // Terrain fill is a real textured 3D plane, not the procedural box grid
  // from the previous battle renderer. Ground occupies y≈0.
  const ground=new THREE.Mesh(new THREE.PlaneGeometry(190,175),
       new THREE.MeshLambertMaterial({map:groundTex,color:0xffffff,side:THREE.DoubleSide}));
  ground.name='Illustrated battlefield ground';
  ground.rotation.x=-Math.PI/2;ground.position.y=-.065;group.add(ground);
  path();battlements();streets();woods();tents();
  const meshes=[];
  for(const {kind,material,list} of buckets.values()){
    if(!list.length)continue;
    const m=new THREE.InstancedMesh(geo[kind],material,list.length);
    m.instanceMatrix.setUsage(THREE.StaticDrawUsage);
    m.frustumCulled=false;m.name='Battle scenery '+kind;
    for(let i=0;i<list.length;i++){
      const p=list[i];tmp.position.set(p.x,p.y,p.z);tmp.rotation.set(0,p.rotY||0,p.rotZ||0);
      tmp.scale.set(p.sx,p.sy,p.sz);tmp.updateMatrix();m.setMatrixAt(i,tmp.matrix);
    }
    m.instanceMatrix.needsUpdate=true;group.add(m);meshes.push(m);
  }
  const stats={...countBattlefieldPieces(layout),instancedDrawCalls:meshes.length,
    renderedSceneryInstances:[...buckets.values()].reduce((a,v)=>a+v.list.length,0)};
  let stopped=false;
  return {group,layout,stats,
    update(time){
      if(stopped)return;
      for(let i=0;i<dynamic.length;i++)dynamic[i].intensity=1.8+Math.sin(time*8+i*3.1)*.27;
    },
    dispose(){
      if(stopped)return;stopped=true;scene.remove(group);
      for(const b of meshes)group.remove(b);
      for(const g of Object.values(geo))g.dispose();
      for(const m of Object.values(mats))m.dispose();
      ground.geometry.dispose();ground.material.dispose();
      for(const t of [texStone,texWood,texRoof,groundTex])t.dispose();
      for(const child of group.children)if(child.isMesh){child.geometry.dispose();child.material.dispose();}
    }
  };
}
