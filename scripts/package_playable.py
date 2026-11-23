"""Create an install-free, offline-friendly playtest ZIP from the runnable game.

The gigantic authoring asset library (source/) is intentionally excluded.
This package is the current playable prototype, not the finished strategy game.
"""
from pathlib import Path
from zipfile import ZipFile, ZIP_DEFLATED
ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'dist' / 'Crown-of-Nations-1450-Atlas-Playtest.zip'
OUT.parent.mkdir(exist_ok=True)
keep = [
  'index.html','styles.css','package.json','LICENSE','README.md',
  'START_GAME_MAC.command','START_GAME_WINDOWS.bat'
]
keep += [str(p.relative_to(ROOT)) for folder in ('src','data') for p in (ROOT/folder).rglob('*') if p.is_file()]
keep.append('assets/favicon.svg')
text = ('CROWN OF NATIONS: 1450 — ATLAS PLAYTEST\n'
        'This is a playable development preview, not a finished game.\n\n'
        'Extract the ZIP. In a terminal inside crown-of-nations run:\n'
        '  python3 -m http.server 8080\n'
        'Then open http://localhost:8080\n\n'
        'The visible political atlas is new. Playable province borders remain synthetic,\n'
        'and the history overlay is incomplete. The 3D battle art remains a prototype.\n')
with ZipFile(OUT,'w',ZIP_DEFLATED,compresslevel=8) as zipf:
  for item in keep:
    f = ROOT/item
    if f.is_file(): zipf.write(f,'crown-of-nations/'+item)
  zipf.writestr('crown-of-nations/PLAY_THIS_BUILD.txt',text)
print(str(OUT),OUT.stat().st_size,'bytes,',len(keep)+1,'entries')
