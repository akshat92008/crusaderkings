"""Generate web-sized public-domain Natural Earth shaded world and a *stylized* relief field.

The relief field uses named mountain ridge approximations, noise and a Natural Earth
landmask. It is NOT a scientific DEM, and must not be presented as such. A future
NOAA ETOPO raster can replace terrain-height.png without changing the renderer.

Usage: python3 scripts/build_terrain_assets.py /path/to/NE2_50M_SR_W.zip
"""
from __future__ import annotations
import io
import sys
import zipfile
from pathlib import Path

import fiona
import numpy as np
from PIL import Image
from rasterio.features import rasterize
from rasterio.transform import from_bounds
from scipy.ndimage import gaussian_filter

ROOT = Path(__file__).resolve().parents[1]
TARGET = ROOT / 'assets' / 'terrain'
W, H = 1024, 512

# Source-backed approximate ridge locations, not DEM observations.
RIDGES = [
    ([( -79,8),(-77,-2),(-75,-12),(-70,-23),(-69,-32),(-71,-43),(-73,-53)],3.8,2.1), # Andes
    ([(-151,61),(-143,58),(-130,53),(-122,47),(-116,42),(-108,34),(-105,28)],2.9,3.1), # Rockies
    ([(-157,63),(-146,61),(-139,59)],1.7,1.6), # Alaska
    ([(7,44),(10,46),(15,47)],1.9,1.5), # Alps
    ([(32,39),(40,42),(49,43)],1.2,2.0), # Caucasus
    ([(43,37),(50,35),(58,30),(65,28)],1.6,2.7), # Zagros
    ([(65,35),(71,36),(76,35)],2.0,2.2), # Hindu Kush
    ([(74,34),(81,31),(87,28),(93,28),(98,28)],4.5,2.7), # Himalaya
    ([(80,35),(88,35),(96,34),(102,33)],2.8,6.0), # Tibet plateau
    ([(100,27),(105,26),(110,25)],1.2,2.4), # Southeast Asia
    ([(27,-1),(30,-4),(34,-7),(37,-10)],1.3,2.1), # East Africa rift
    ([(35,11),(39,9),(41,7)],1.7,2.1), # Ethiopia
    ([(20,-30),(29,-29)],1.1,2.5), # Drakensberg
    ([(133,34),(140,37),(143,43)],1.5,2.0), # Japan
    ([(97,1),(105,-5),(115,-8),(123,-8)],1.8,1.5), # Indonesia
    ([(137,-6),(143,-5),(148,-6)],2.1,1.6), # New Guinea
    ([(145,-19),(148,-28),(150,-36)],1.3,1.6), # Australia divide
    ([(46,-18),(48,-21)],1.0,1.1), # Madagascar
]

def main(archive: Path) -> None:
    TARGET.mkdir(parents=True, exist_ok=True)
    with zipfile.ZipFile(archive) as z:
        tif = next(n for n in z.namelist() if n.endswith('.tif'))
        with Image.open(io.BytesIO(z.read(tif))) as img:
            img=img.convert('RGB')
            print('Natural Earth source image:',img.size)
            img.resize((2048,1024),Image.Resampling.LANCZOS).save(TARGET/'natural-earth-relief.webp', quality=86, method=6)
    xs = np.linspace(-180,180,W,endpoint=False,dtype=np.float32)+180/W
    ys = np.linspace(90,-90,H,endpoint=False,dtype=np.float32)-90/H
    lon,lat=np.meshgrid(xs,ys)
    mask = np.zeros((H,W),dtype=np.uint8)
    shp=ROOT/'assets/naturalearth/naturalearth_lowres.shp'
    with fiona.open(shp) as src:
        polys=[feature['geometry'] for feature in src if feature['geometry'] is not None]
    mask=rasterize([(p,1) for p in polys], out_shape=(H,W),transform=from_bounds(-180,-90,180,90,W,H),fill=0,dtype='uint8').astype(np.float32)
    rng=np.random.default_rng(1450)
    # Smooth non-geographic detail: only visible where the land mask and major ridges support it.
    large=gaussian_filter(rng.standard_normal((H,W)).astype(np.float32),sigma=8)
    medium=gaussian_filter(rng.standard_normal((H,W)).astype(np.float32),sigma=2.1)
    large/=max(float(np.std(large)),1e-5)
    medium/=max(float(np.std(medium)),1e-5)
    hills=np.clip(.045 + .022*large+.013*medium,0,.13)
    for points,amp,width in RIDGES:
        d2=np.full((H,W),1e10,dtype=np.float32)
        for (x1,y1),(x2,y2) in zip(points[:-1],points[1:]):
            cx=(x1+x2)/2;cy=(y1+y2)/2
            # Approximate degrees scaled east/west for local latitude.
            c=np.cos(np.deg2rad(cy))
            px=(lon-x1)*c; py=lat-y1
            vx=(x2-x1)*c; vy=y2-y1
            t=np.clip((px*vx+py*vy)/max(vx*vx+vy*vy,1e-4),0,1)
            d2=np.minimum(d2,(px-vx*t)**2+(py-vy*t)**2)
        ridge=np.exp(-d2/(2*width*width))
        hills+=np.float32(amp*.12)*ridge*(.73+.13*np.clip(medium,-1.6,1.6))
    hills=np.clip(hills,0,1)*mask
    Image.fromarray(np.uint8(np.round(hills*255)),'L').save(TARGET/'terrain-height.png',optimize=True)
    print('Height field:',hills.shape,'max',round(float(hills.max()),3),'assets:',[(f.name,f.stat().st_size) for f in TARGET.iterdir()])

if __name__ == '__main__':
    if len(sys.argv)!=2:raise SystemExit('Usage: python3 scripts/build_terrain_assets.py <NE2_50M_SR_W.zip>')
    main(Path(sys.argv[1]))
