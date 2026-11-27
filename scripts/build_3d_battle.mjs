/** Bundle the official CC0 KayKit 1.0 GLB characters and self-hosted Three.js.
 * Original pinned repo https://github.com/KayKit-Game-Assets/KayKit-Character-Pack-Adventures-1.0
 * Do not substitute paid EXTRA assets.
 */
import {mkdir,readFile,writeFile} from 'node:fs/promises';
import path from 'node:path';
import {build} from 'esbuild';
const sha='672074b73ba276876a19e8816ecdc5241817ab47';
const root='https://raw.githubusercontent.com/KayKit-Game-Assets/KayKit-Character-Pack-Adventures-1.0/'+sha;
const dir=path.join('assets','battle','characters');
await mkdir(dir,{recursive:true});
const license=await fetch(root+'/LICENSE.txt');
if(!license.ok)throw Error('Unable to verify source license: HTTP '+license.status);
const terms=await license.text();
if(!/CC0|Creative Commons Zero/i.test(terms))throw Error('KayKit source no longer CC0');
await writeFile(path.join(dir,'LICENSE.txt'),terms);
for(const name of ['Knight','Rogue_Hooded']){
 const url=root+'/addons/kaykit_character_pack_adventures/Characters/gltf/'+name+'.glb';
 const response=await fetch(url);
 if(!response.ok)throw Error('Missing '+name+': HTTP '+response.status);
 const data=Buffer.from(await response.arrayBuffer());
 if(data.toString('utf8',0,4)!=='glTF'||data.length<1000000||data.length>7000000)throw Error('GLB sanity check failed: '+name);
 const dest=path.join(dir,name+'.glb');
 await writeFile(dest,data);console.log('KayKit model imported:',dest, data.length,'bytes');
}
await build({entryPoints:['src/three-battle-scene.js'],outfile:'src/three-battle.bundle.js',bundle:true,minify:true,format:'esm',platform:'browser',target:'es2022',legalComments:'inline'});
const size=(await readFile('src/three-battle.bundle.js')).length;
if(size<200000||size>1800000)throw Error('Unexpected Three bundle size '+size);
console.log('Local Three.js/GLTFLoader bundle',size,'bytes');
