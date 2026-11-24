"""Validate that downloadable build includes *all* required browser-facing assets."""
from pathlib import Path
from zipfile import ZipFile
ROOT=Path(__file__).resolve().parents[1]
zip_path=ROOT/'dist/Crown-of-Nations-1450-Cultural-Warfare-Playtest.zip'
required=[
 'crown-of-nations/assets/game-art/manifest.json',
 'crown-of-nations/assets/game-art/portraits/western-00.webp',
 'crown-of-nations/assets/game-art/events/council-00.webp',
 'crown-of-nations/assets/game-art/realms/europe-00.webp',
 'crown-of-nations/assets/icons/Strategy_game_trait_icon_sheet_807567b6.jpg',
 'crown-of-nations/assets/icons/Character_trait_icon_sheet_fe2300f5.jpg',
 'crown-of-nations/assets/icons/Medieval_strategy_game_skill_icons_c1080878.jpg',
 'crown-of-nations/assets/icons/Medieval_political_office_icon_s…_7042e0b0.jpg',
 'crown-of-nations/assets/icons/Create_historical_strategy_game_…_7e8a58fa.jpg',
 'crown-of-nations/assets/icons/Medieval_strategy_game_icon_sheet_8967b69f.jpg',
 'crown-of-nations/assets/video/Medieval_war_table_map_animation_ac51bb4b.mp4',
 'crown-of-nations/index.html','crown-of-nations/styles.css',
 'crown-of-nations/assets/court-theme.css','crown-of-nations/assets/court-compass.svg','crown-of-nations/assets/monarch-crest.svg','crown-of-nations/src/historical-context.js','crown-of-nations/src/interface-experience.js','crown-of-nations/src/roleplay-systems.js','crown-of-nations/src/supplemental-content.js','crown-of-nations/docs/HISTORICAL_CONTEXT.md',
 'crown-of-nations/src/battle.js','crown-of-nations/src/three-battle.bundle.js',
 'crown-of-nations/src/kingdom-depth.js','crown-of-nations/src/kingdom-ui.js',
 'crown-of-nations/src/invasions.js','crown-of-nations/src/military-doctrines.js',
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
 if any('/source/' in n or '/node_modules/' in n for n in z.namelist()):raise RuntimeError('Unexpected authoring assets in runtime package')
print('Validated portable playtest:',zip_path,zip_path.stat().st_size,'bytes with',len(required),'required runtime files')
