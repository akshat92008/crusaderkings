"""Validate that downloadable build includes *all* required browser-facing assets."""
from pathlib import Path
from zipfile import ZipFile
ROOT=Path(__file__).resolve().parents[1]
zip_path=ROOT/'dist/Crown-of-Nations-1450-Kingdoms-and-AI-Playtest.zip'
required=[
 'crown-of-nations/index.html','crown-of-nations/styles.css',
 'crown-of-nations/src/battle.js','crown-of-nations/src/three-battle.bundle.js',
 'crown-of-nations/src/kingdom-depth.js','crown-of-nations/src/kingdom-ui.js',
 'crown-of-nations/assets/battle/characters/Knight.glb',
 'crown-of-nations/assets/battle/characters/Rogue_Hooded.glb',
 'crown-of-nations/assets/battle/characters/LICENSE.txt',
 'crown-of-nations/data/world.json','crown-of-nations/data/historical-polities-1450.json'
]
with ZipFile(zip_path) as z:
 missing=[x for x in required if x not in z.namelist()]
 if missing:raise RuntimeError('The playtest ZIP is missing runtime assets: '+', '.join(missing))
 bad=z.testzip()
 if bad:raise RuntimeError('ZIP checksum failed: '+bad)
 for name in ('Knight','Rogue_Hooded'):
  data=z.read('crown-of-nations/assets/battle/characters/'+name+'.glb')
  if data[:4]!=b'glTF' or len(data)<1000000:raise RuntimeError('Bad GLB '+name)
 if len(z.read('crown-of-nations/src/three-battle.bundle.js'))<200000:raise RuntimeError('Three bundle missing or stubbed')
 if b'CC0' not in z.read('crown-of-nations/assets/battle/characters/LICENSE.txt'):raise RuntimeError('CC0 license missing')
 if len(z.namelist())>130:raise RuntimeError('Unexpected bulk authoring assets accidentally included')
print('Validated portable playtest:',zip_path,zip_path.stat().st_size,'bytes with',len(required),'required runtime files')
