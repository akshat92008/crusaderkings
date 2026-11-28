/** Bundle Three.js + GLTFLoader + ThreeMapScene cleanly without touching battle bundle. */
import {build} from 'esbuild';
import {readFile} from 'node:fs/promises';

await build({
 entryPoints:['src/three-map-scene.js'],
 outfile:'src/three-map.bundle.js',
 bundle:true,
 minify:true,
 format:'esm',
 platform:'browser',
 target:'es2022',
 legalComments:'inline'
});
const size=(await readFile('src/three-map.bundle.js')).length;
console.log('Local Three.js Campaign Map bundle:',size,'bytes');
