"""Reproducible, visually classified game art extraction. Raw source sheets remain untouched."""
from pathlib import Path
from PIL import Image, ImageChops
import json
root=Path(__file__).resolve().parents[1]
out=root/'assets'/'game-art'
out.mkdir(parents=True,exist_ok=True)
catalog=json.loads((root/'scripts'/'art-catalog.json').read_text())
counts={}
def chroma(im):
    im=im.convert('RGBA')
    r,g,b,a=im.split()
    # Only saturated magenta matte, never ordinary purple or red artwork.
    mask=ImageChops.multiply(r.point(lambda x:255 if x>175 else 0),b.point(lambda x:255 if x>165 else 0))
    mask=ImageChops.multiply(mask,g.point(lambda x:255 if x<105 else 0))
    im.putalpha(ImageChops.subtract(a,mask))
    return im
for kind,items in catalog.items():
    target=out/kind
    target.mkdir(exist_ok=True)
    count=0
    for key,name in items.items():
        n=2 if kind=='events' or key=='panels' else 4
        maxsize=(768,432) if kind=='events' else (256,320) if kind=='portraits' else (384,256) if key=='panels' else (192,192)
        with Image.open(root/'assets'/'portraits'/name) as im:
            im=im.convert('RGB')
            w,h=im.size
            for i in range(n*n):
                x0=round((i%n)*w/n);x1=round((i%n+1)*w/n)
                y0=round((i//n)*h/n);y1=round((i//n+1)*h/n)
                # Eliminate visible grid separators without rescaling neighboring cells.
                dx=round((x1-x0)*.012);dy=round((y1-y0)*.012)
                if kind=='ui' and key!='panels': dx=dy=0
                tile=im.crop((x0+dx,y0+dy,x1-dx,y1-dy))
                if kind=='ui' and key!='panels': tile=chroma(tile)
                tile.thumbnail(maxsize,Image.Resampling.LANCZOS)
                tile.save(target/f'{key}-{i:02}.webp',quality=84,method=5)
                count+=1
    counts[kind]=count
(out/'manifest.json').write_text(json.dumps(counts,indent=2)+'\n')
print(counts)
