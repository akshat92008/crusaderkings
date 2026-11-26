"""Compile a small Hometown runtime pack from the supplied, licensed source archives.
No source archive is copied into the runtime. Uses Pillow when available; base sheets
remain available on installations with only the standard library.
"""
from pathlib import Path
from zipfile import ZipFile
import tempfile, shutil, json, re, io, contextlib, subprocess
ROOT=Path(__file__).resolve().parents[1]
PACKS=ROOT/'assets/packs'
DEST=ROOT/'assets/hometown'
DEST.mkdir(parents=True,exist_ok=True)
SPRITES=DEST/'sprites'; SPRITES.mkdir(exist_ok=True)
try:
    from PIL import Image
except ImportError:
    Image=None
manifest={'version':2,'sprites':{},'extras':{},'sources':{}}
credits=[
 'City Builder: Village Buildings, polyy.ai, CC0 1.0; extracted 45-degree rotation.',
 'Feudal Wars, isometric medieval set, CC0: https://opengameart.org/content/isometric-25d-medieval-set',
 "Bleed's Game Art, Medieval Cart Prop, CC BY 4.0: https://opengameart.org/content/medieval-cart-prop ; https://www.patreon.com/bleed",
 "Bleed's Game Art, Villager_01, CC BY 3.0: https://opengameart.org/content/villager01-bleeds-game-art",
 'Hansjörg Malthaner (Varkalandar), Isometric Crops and Farmland, CC BY 4.0: https://opengameart.org/content/isometric-crops-and-farmland ; https://opengameart.org/users/varkalandar',
 'Foozle, Isometric Gold Mine 1, CC0: https://foozlecc.itch.io/isometric-gold-mine-1',
 'Screaming Brain Studios, Isometric Overworld / Pathways Pack, CC0: https://screamingbrainstudios.itch.io/iso-overworld-pack ; https://screamingbrainstudios.com/downloads/',
 'Selected sprites are cropped, resized, compressed and sometimes composited. CC BY 4.0: https://creativecommons.org/licenses/by/4.0/ ; CC BY 3.0: https://creativecommons.org/licenses/by/3.0/ ; CC0: https://creativecommons.org/publicdomain/zero/1.0/'
]
@contextlib.contextmanager
def archive(stem):
    source=PACKS/stem
    if source.is_file():
        with ZipFile(source) as z: yield z
        return
    pieces=sorted((PACKS/'large_packs').glob(stem+'.part_*'))
    if not pieces: raise FileNotFoundError(stem)
    with tempfile.TemporaryDirectory() as tmp:
        source=Path(tmp)/stem
        with source.open('wb') as out:
            for piece in pieces:
                with piece.open('rb') as inp: shutil.copyfileobj(inp,out)
        with ZipFile(source) as z: yield z
def read_image(z,name):
    with Image.open(io.BytesIO(z.read(name))) as im: return im.convert('RGBA')
def save_sprite(im,name,limit=(180,180)):
    im=im.copy()
    box=im.getbbox()
    if box: im=im.crop(box)
    im.thumbnail(limit,Image.Resampling.LANCZOS)
    if not im.getbbox(): raise ValueError('empty sprite: '+name)
    path=SPRITES/(name+'.webp')
    im.save(path,'WEBP',quality=90,method=6)
    return 'assets/hometown/sprites/'+path.name
def candidates(z,pattern,exclude=r'(^|/)(__MACOSX|_shadow)|shadow|preview|readme|license|normal|heightmap'):
    return sorted(n for n in z.namelist() if n.lower().endswith('.png') and re.search(pattern,n,re.I) and not re.search(exclude,n,re.I))
for part in (1,2):
    stem=f'City_Builder_Village_Buildings_part_{part}.zip'
    with archive(stem) as z:
        for item in z.namelist():
            if not item.startswith('sprite/64sun/1x1_') or not item.endswith('_nopalette.png'): continue
            name=item.split('/')[-1][4:-14]
            if name in ('wizard_tower','witch_hut'): continue
            (DEST/(name+'.png')).write_bytes(z.read(item))
            if Image:
                high=item.replace('/64sun/','/128sun/')
                im=read_image(z,high)
                if im.width%8 or im.height%4: raise ValueError('bad 8x4 sheet '+high)
                w,h=im.width//8,im.height//4
                frame=im.crop((4*w,0,5*w,h))
                manifest['sprites'][name]=save_sprite(frame,name)
                manifest['sources'][name]=high
        (DEST/'VILLAGE-LICENSE.txt').write_bytes(z.read('LICENSE.txt'))
def extra(name,stem,pattern,limit=(160,160)):
    if not Image:return
    try:
        with archive(stem) as z:
            names=candidates(z,pattern)
            for member in names:
                info=z.getinfo(member)
                if info.file_size>32*1024*1024:continue
                im=read_image(z,member)
                if im.width<16 or im.height<16 or im.width>2048 or im.height>2048:continue
                if not im.getbbox():continue
                manifest['extras'][name]=save_sprite(im,name,limit)
                manifest['sources'][name]=stem+':'+member
                return
            print('Optional asset not matched:',name, 'available sample:',z.namelist()[:12])
    except (FileNotFoundError,ValueError,OSError) as exc:print('Optional asset:',name,exc)
if Image:
    extra('cart','cart_isometric.zip',r'(^|/)cart_00000\.png$',(100,65))
    extra('farmland','hjm-crops_v2.zip',r'wheat|grain|farmland|field',(144,100))
    extra('goldmine','Foozle_2DS0008_Isometric_Gold_Mine_1.zip',r'no.?ground|no.?grass|transparent|gold.?mine',(180,180))
    # The villager pack contains separate directional animations. Select only small
    # individual PNG frames from the same walking sequence, not a contact sheet.
    try:
        with archive('Villager_01.zip') as z:
            groups={}
            for member in candidates(z,r'walk'):
                parent=str(Path(member).parent)
                groups.setdefault(parent,[]).append(member)
            for group, members in sorted(groups.items()):
                if len(members)<4:continue
                images=[]
                for n in members[:8]:
                    im=read_image(z,n)
                    if im.width>300 or im.height>300:continue
                    im.thumbnail((52,64),Image.Resampling.LANCZOS);images.append(im)
                if len(images)<4:continue
                strip=Image.new('RGBA',(64*8,72))
                for i in range(8):
                    im=images[i%len(images)];strip.alpha_composite(im,(i*64+(64-im.width)//2,72-im.height))
                path=SPRITES/'villager.webp';strip.save(path,'WEBP',quality=85,method=6)
                manifest['extras']['villager']='assets/hometown/sprites/villager.webp'
                manifest['sources']['villager']='Villager_01.zip:'+group
                break
    except (FileNotFoundError,ValueError,OSError) as exc:print('Optional villager:',exc)
    # Read individual named terrain files from licensed SBS RAR archives when 7z is available.
    seven=shutil.which('7z') or shutil.which('7zz')
    if seven:
        for name,stem,pattern in [('ground','SBS - Isometric Overworld Pack - Small.rar',r'grass'),('road','SBS - Isometric Pathways Pack - Small.rar',r'dirt|stone')]:
            path=PACKS/stem
            if not path.is_file():continue
            try:
                listing=subprocess.check_output([seven,'l','-slt',str(path)],text=True,errors='replace')
                members=[x[7:] for x in listing.splitlines() if x.startswith('Path = ') and x.lower().endswith('.png') and re.search(pattern,x,re.I)]
                for n in sorted(members):
                    data=subprocess.check_output([seven,'x','-so',str(path),n],stderr=subprocess.DEVNULL)
                    with Image.open(io.BytesIO(data)) as raw:im=raw.convert('RGBA')
                    if im.width>512 or im.height>512 or not im.getbbox():continue
                    manifest['extras'][name]=save_sprite(im,name,(128,64));manifest['sources'][name]=stem+':'+n;break
            except (subprocess.CalledProcessError,OSError,ValueError) as exc:print('Optional terrain:',exc)
(DEST/'CREDITS.txt').write_text('\n'.join(credits)+'\n',encoding='utf8')
(DEST/'manifest.json').write_text(json.dumps(manifest,indent=2,sort_keys=True)+'\n',encoding='utf8')
assert len(list(DEST.glob('*.png')))==23, 'Expected 23 licensed village sheets'
if Image: assert len(manifest['sprites'])==23
print('Hometown:',len(manifest['sprites']),'optimized individual sprites;',len(manifest['extras']),'environment extras')

# The manifest is the sole allowlist for optional compiled images in the client.
