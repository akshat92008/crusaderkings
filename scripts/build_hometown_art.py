"""Extract only selected 64px isometric sheets, without loading the raw packs in-game."""
from pathlib import Path
from zipfile import ZipFile
import tempfile, shutil
ROOT=Path(__file__).resolve().parents[1]
DEST=ROOT/'assets/hometown'
DEST.mkdir(exist_ok=True)
for part in (1,2):
    stem=f'City_Builder_Village_Buildings_part_{part}.zip'
    source=ROOT/'assets/packs'/stem
    with tempfile.TemporaryDirectory() as tmp:
        if not source.exists():
            pieces=sorted((ROOT/'assets/packs/large_packs').glob(stem+'.part_*'))
            if not pieces: raise FileNotFoundError(stem)
            source=Path(tmp)/stem
            with source.open('wb') as out:
                for piece in pieces:
                    with piece.open('rb') as inp: shutil.copyfileobj(inp,out)
        with ZipFile(source) as z:
            for item in z.namelist():
                if not item.startswith('sprite/64sun/1x1_') or not item.endswith('_nopalette.png'): continue
                name=item.split('/')[-1][4:-14]
                if name in ('wizard_tower','witch_hut'): continue
                (DEST/(name+'.png')).write_bytes(z.read(item))
            (DEST/'VILLAGE-LICENSE.txt').write_bytes(z.read('LICENSE.txt'))
print('Hometown:',len(list(DEST.glob('*.png'))),'selected 2D sheets')
