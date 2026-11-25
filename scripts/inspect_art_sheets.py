"""Read-only audit of authoring assets: contact sheets, model and archive metadata.
Generated previews are CI artifacts, not game assets or assertions of licensing.
"""
from pathlib import Path
from PIL import Image, ImageOps, ImageDraw
import base64, hashlib, json, struct, zipfile

ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'dist'/'asset-audit'
OUT.mkdir(parents=True,exist_ok=True)
seen=set()
items=[]
for folder in ['portraits','icons','models']:
    for p in sorted((ROOT/'assets'/folder).glob('*')):
        if p.suffix.lower() not in {'.png','.jpg','.jpeg','.webp'}: continue
        digest=hashlib.sha256(p.read_bytes()).hexdigest()
        if digest in seen: continue
        seen.add(digest)
        with Image.open(p) as im:
            size=im.size
            thumb=ImageOps.contain(im.convert('RGB'),(280,178),Image.Resampling.LANCZOS)
            items.append((str(p.relative_to(ROOT)),size,thumb.copy()))
            print('ART_META',len(items)-1,p.name,*size,flush=True)
for page in range(0,len(items),12):
    subset=items[page:page+12]
    canvas=Image.new('RGB',(4*300,((len(subset)+3)//4)*215),'#292827')
    draw=ImageDraw.Draw(canvas)
    for i,(name,size,im) in enumerate(subset):
        x=(i%4)*300;y=(i//4)*215
        canvas.paste(im,(x+(300-im.width)//2,y+(178-im.height)//2))
        draw.text((x+5,y+180),str(page+i)+' '+Path(name).stem[:28],fill='white')
        draw.text((x+5,y+195),str(size),fill='white')
    file=OUT/f'contact-{page//12+1}.jpg'
    canvas.save(file,quality=80,optimize=True)
    b64=base64.b64encode(file.read_bytes()).decode()
    for i in range(0,len(b64),240): print('ART_PREVIEW_'+str(page//12+1)+':'+b64[i:i+240])
for p in sorted((ROOT/'assets'/'characters_3d').glob('*.glb'))+sorted((ROOT/'assets'/'models').glob('*.glb')):
    try:
        with p.open('rb') as f:
            magic,version,total=struct.unpack('<4sII',f.read(12))
            size,kind=struct.unpack('<II',f.read(8))
            model=json.loads(f.read(size))
        print('MODEL_META',p.name,'skins',len(model.get('skins',[])),'animations',[a.get('name','unnamed') for a in model.get('animations',[])],'meshes',len(model.get('meshes',[])),flush=True)
    except Exception as exc: print('MODEL_ERROR',p.name,str(exc))
for directory in ['audio','maps','ui']:
    for p in sorted((ROOT/'assets'/directory).glob('*.zip')):
        with zipfile.ZipFile(p) as z:
            names=z.namelist()
            print('ARCHIVE_META',p.name,'files',len(names),json.dumps([n for n in names if n.lower().endswith(('.txt','.md','.tif','.tiff','.ogg','.wav'))][:20]),flush=True)
            for name in names:
                if 'license' in Path(name).name.lower() and name.lower().endswith(('.txt','.md')):
                    print('ARCHIVE_LICENSE',p.name,z.read(name).decode('utf-8','replace')[:3000],flush=True)
