from pathlib import Path
from PIL import Image, ImageDraw, ImageOps
import hashlib
root=Path(__file__).resolve().parents[1]
out=root/'art-review'
out.mkdir(exist_ok=True)
items=[]
seen=set()
for p in sorted((root/'assets/portraits').glob('*')):
    if p.suffix.lower() not in ('.png','.jpg','.jpeg','.webp'): continue
    digest=hashlib.sha256(p.read_bytes()).hexdigest()
    if digest in seen: continue
    seen.add(digest);items.append(p)
(out/'index.txt').write_text('\n'.join(f'{i:02d} {p.name}' for i,p in enumerate(items))+'\n')
for page in range(0,len(items),12):
    batch=items[page:page+12]
    sheet=Image.new('RGB',(960,((len(batch)+2)//3)*235),'#292929')
    d=ImageDraw.Draw(sheet)
    for j,p in enumerate(batch):
        with Image.open(p) as im:
            thumb=ImageOps.contain(im.convert('RGB'),(310,210))
            x=(j%3)*320+(320-thumb.width)//2;y=(j//3)*235
            sheet.paste(thumb,(x,y));d.text(((j%3)*320+8,y+212),f'{page+j:02d} {p.name.split("_")[-1][:12]}',fill='white')
    sheet.save(out/f'page-{page//12+1}.jpg',quality=83,optimize=True)
print(f'{len(items)} unique sheets')
