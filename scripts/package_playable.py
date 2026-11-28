"""Create an install-free, offline-friendly playtest ZIP from the runnable game.

The gigantic authoring asset library (source/) is intentionally excluded.
This package is the current playable prototype, not the finished strategy game.
"""
from pathlib import Path
from zipfile import ZipFile, ZIP_DEFLATED
import runpy
ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'dist' / 'Crown-of-Nations-1450-Cultural-Warfare-Playtest.zip'
OUT.parent.mkdir(exist_ok=True)
runpy.run_path(str(ROOT/'scripts/build_hometown_art.py'))
keep = [
  'index.html','styles.css','package.json','LICENSE','README.md','manifest.webmanifest','sw.js',
  'START_GAME_MAC.command','START_GAME_WINDOWS.bat'
]
keep += [str(p.relative_to(ROOT)) for folder in ('src','data') for p in (ROOT/folder).rglob('*') if p.is_file()]
keep += ['assets/icons/Strategy_game_trait_icon_sheet_807567b6.jpg','assets/icons/Character_trait_icon_sheet_fe2300f5.jpg','assets/icons/Medieval_strategy_game_skill_icons_c1080878.jpg','assets/icons/Medieval_political_office_icon_s…_7042e0b0.jpg','assets/icons/Create_historical_strategy_game_…_7e8a58fa.jpg','assets/icons/Medieval_strategy_game_icon_sheet_8967b69f.jpg','assets/video/Medieval_war_table_map_animation_ac51bb4b.mp4']
keep += ['assets/favicon.svg','assets/court-theme.css','assets/court-compass.svg','assets/monarch-crest.svg','docs/HISTORICAL_CONTEXT.md']
keep += [str(p.relative_to(ROOT)) for p in (ROOT/'assets/branding').rglob('*') if p.is_file()]
runtime_art = ('battle/0ad', 'battle/arenas', 'battle/characters', 'battle/sprites', 'game-art',
               'audio/music', 'audio/sfx', 'terrain', 'ui/parchment')
keep += [str(p.relative_to(ROOT)) for subfolder in runtime_art
         for p in (ROOT/'assets'/subfolder).rglob('*') if p.is_file()]
keep += ['docs/production/ASSET_LICENSE_REGISTER.md']
keep += ['assets/hometown.css','assets/archery_range.png','assets/barracks.png','assets/blacksmith.png','assets/castle.png','assets/stable.png','assets/watchtower_wooden_full_size.png','assets/house1.png','assets/house1b.png','assets/house1c.png','docs/HOMETOWN.md']
keep += [str(p.relative_to(ROOT)) for p in (ROOT/'assets/hometown').rglob('*') if p.is_file()]
keep += ['assets/characters_3d/ashigaru-foot-soldier-806707.glb','assets/characters_3d/daimyo-lord-78364a.glb','assets/characters_3d/LICENSE-Polyfork.txt']
text = ('REIGN 1450 — PLAYTEST BUILD\n\n'
        'Extract the archive. Start the local game with START_GAME_MAC.command or START_GAME_WINDOWS.bat.\n'
        'You can also run python3 -m http.server 8080 inside the extracted crown-of-nations folder\n'
        'and open http://localhost:8080 in your browser. Python 3 is required by the launchers.\n\n'
        'The campaign features a world atlas, dynastic politics, a capital settlement and 3D field battles.\n'
        'Campaign district borders are approximate. Asset attributions are included in the archive.\n')
for needed in ['assets/battle/characters/Knight.glb','assets/battle/characters/Rogue_Hooded.glb','src/three-battle.bundle.js']:
  if not (ROOT/needed).is_file(): raise FileNotFoundError('Required playable battle art missing: '+needed)
with ZipFile(OUT,'w',ZIP_DEFLATED,compresslevel=8) as zipf:
  for item in keep:
    f = ROOT/item
    if f.is_file(): zipf.write(f,'crown-of-nations/'+item)
  zipf.writestr('crown-of-nations/PLAY_THIS_BUILD.txt',text)
print(str(OUT),OUT.stat().st_size,'bytes,',len(keep)+1,'entries')
