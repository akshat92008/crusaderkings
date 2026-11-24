"""Create an install-free, offline-friendly playtest ZIP from the runnable game.

The gigantic authoring asset library (source/) is intentionally excluded.
This package is the current playable prototype, not the finished strategy game.
"""
from pathlib import Path
from zipfile import ZipFile, ZIP_DEFLATED
ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'dist' / 'Crown-of-Nations-1450-Cultural-Warfare-Playtest.zip'
OUT.parent.mkdir(exist_ok=True)
keep = [
  'index.html','styles.css','package.json','LICENSE','README.md',
  'START_GAME_MAC.command','START_GAME_WINDOWS.bat'
]
keep += [str(p.relative_to(ROOT)) for folder in ('src','data') for p in (ROOT/folder).rglob('*') if p.is_file()]
keep += ['assets/icons/Strategy_game_trait_icon_sheet_807567b6.jpg','assets/icons/Character_trait_icon_sheet_fe2300f5.jpg','assets/icons/Medieval_strategy_game_skill_icons_c1080878.jpg','assets/icons/Medieval_political_office_icon_s…_7042e0b0.jpg','assets/icons/Create_historical_strategy_game_…_7e8a58fa.jpg','assets/icons/Medieval_strategy_game_icon_sheet_8967b69f.jpg','assets/video/Medieval_war_table_map_animation_ac51bb4b.mp4']
keep += ['assets/favicon.svg','assets/court-theme.css','assets/court-compass.svg','assets/monarch-crest.svg','docs/HISTORICAL_CONTEXT.md']
keep += [str(p.relative_to(ROOT)) for p in (ROOT/'assets/battle/characters').rglob('*') if p.is_file()]
keep += [str(p.relative_to(ROOT)) for p in (ROOT/'assets/game-art').rglob('*') if p.is_file()]
keep += ['assets/characters_3d/ashigaru-foot-soldier-806707.glb','assets/characters_3d/daimyo-lord-78364a.glb','assets/characters_3d/LICENSE-Polyfork.txt']
text = ('CROWN OF NATIONS: 1450 — CULTURAL WARFARE PLAYTEST\n'
        'This is a playable development preview, not a finished game.\n\n'
        'Extract the ZIP. In a terminal inside crown-of-nations run:\n'
        '  python3 -m http.server 8080\n'
        'Then open http://localhost:8080\n\n'
        'The live political atlas has been upgraded. Playable province borders remain synthetic,\n'
        'and the history overlay is incomplete.\n'
        'WebGL2 battles use bundled KayKit animated infantry, archers and riders.\n'
        'New castles, settlements, siege props and camp scenery are procedural.\n'
        'Royal courts, rival AI, trade, government institutions and contextual narrative events are playable.\n'
        'This edition adds cultural army doctrine and defensive battles, with selectable formations and deployment.\n'
        'The world map remains synthetic; political depth and release quality are still under development.\n')
for needed in ['assets/battle/characters/Knight.glb','assets/battle/characters/Rogue_Hooded.glb','src/three-battle.bundle.js']:
  if not (ROOT/needed).is_file(): raise FileNotFoundError('Required playable battle art missing: '+needed)
with ZipFile(OUT,'w',ZIP_DEFLATED,compresslevel=8) as zipf:
  for item in keep:
    f = ROOT/item
    if f.is_file(): zipf.write(f,'crown-of-nations/'+item)
  zipf.writestr('crown-of-nations/PLAY_THIS_BUILD.txt',text)
print(str(OUT),OUT.stat().st_size,'bytes,',len(keep)+1,'entries')
