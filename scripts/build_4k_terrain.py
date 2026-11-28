"""Build 4K Natural Earth II terrain diffuse, 1K low-spec diffuse, and 2K RGBA
elevation/bathymetry/landmask/river map directly from bundled assets/maps/ archives
using only PIL + NumPy + SciPy.
"""
from __future__ import annotations
import io
import zipfile
from pathlib import Path

import numpy as np
from PIL import Image
from scipy.ndimage import distance_transform_edt, gaussian_filter

Image.MAX_IMAGE_PIXELS = None
ROOT = Path(__file__).resolve().parents[1]
MAPS = ROOT / 'assets' / 'maps'
TARGET = ROOT / 'assets' / 'terrain'
W_HI, H_HI = 4096, 2048
W_HGT, H_HGT = 2048, 1024

RIDGES = [
    ([(-79,8),(-77,-2),(-75,-12),(-70,-23),(-69,-32),(-71,-43),(-73,-53)],3.8,2.1),
    ([(-151,61),(-143,58),(-130,53),(-122,47),(-116,42),(-108,34),(-105,28)],2.9,3.1),
    ([(-157,63),(-146,61),(-139,59)],1.7,1.6),
    ([(7,44),(10,46),(15,47)],2.3,1.6),
    ([(-2,42.8),(2,42.5)],1.6,1.1),
    ([(21,49),(25,47),(25,45.5)],1.5,1.4),
    ([(32,39),(40,42),(49,43)],1.8,1.9),
    ([(43,37),(50,35),(58,30),(65,28)],2.0,2.5),
    ([(65,35),(71,36),(76,35)],2.5,2.2),
    ([(74,34),(81,31),(87,28),(93,28),(98,28)],4.8,2.6),
    ([(80,35),(88,35),(96,34),(102,33)],3.2,5.5),
    ([(100,27),(105,26),(110,25)],1.4,2.2),
    ([(27,-1),(30,-4),(34,-7),(37,-10)],1.4,2.0),
    ([(35,11),(39,9),(41,7)],1.9,2.0),
    ([(-6,31),(0,34),(5,36)],1.4,1.6),
    ([(6,60),(11,64),(17,68)],1.5,1.9),
    ([(72,20),(75,13)],1.2,1.3),
    ([(133,34),(140,37),(143,43)],1.6,1.9),
    ([(97,1),(105,-5),(115,-8),(123,-8)],1.8,1.5),
    ([(137,-6),(143,-5),(148,-6)],2.1,1.6),
    ([(145,-19),(148,-28),(150,-36)],1.3,1.6),
    ([(46,-18),(48,-21)],1.0,1.1),
]


def load_zip_tif(zip_path: Path, size: tuple[int, int]) -> np.ndarray:
    with zipfile.ZipFile(zip_path) as z:
        tif = next(n for n in z.namelist() if n.endswith('.tif'))
        with Image.open(io.BytesIO(z.read(tif))) as img:
            return np.asarray(img.convert('RGB').resize(size, Image.Resampling.LANCZOS), dtype=np.float32)


def main() -> None:
    TARGET.mkdir(parents=True, exist_ok=True)
    sr_w_4k = load_zip_tif(MAPS / 'NE2_50M_SR_W.zip', (W_HI, H_HI))
    sr_4k = load_zip_tif(MAPS / 'NE2_50M_SR.zip', (W_HI, H_HI))

    # Extract pixel-accurate ocean vs. land vs. inland water/rivers from SR vs SR_W difference.
    # Ocean pixels are bright white (~250) in NE2_50M_SR and slate/cyan blue in NE2_50M_SR_W.
    diff_ocean = np.abs(sr_4k - sr_w_4k).sum(axis=2)
    is_ocean_4k = (sr_4k.min(axis=2) > 232) & (diff_ocean > 45)
    is_river_or_lake_4k = (~is_ocean_4k) & (diff_ocean > 28) & (sr_w_4k[:, :, 2] > sr_w_4k[:, :, 0] + 8)

    # Warm illuminated cartographic grading on Natural Earth II diffuse.
    warm_4k = sr_w_4k.copy()
    # Slightly deepen greens/golds & cool oceans gently for rich CK3 contrast.
    land_4k = ~is_ocean_4k
    warm_4k[land_4k, 0] = np.clip(warm_4k[land_4k, 0] * 1.03, 0, 255)
    warm_4k[land_4k, 1] = np.clip(warm_4k[land_4k, 1] * 1.01, 0, 255)
    warm_4k[land_4k, 2] = np.clip(warm_4k[land_4k, 2] * 0.93, 0, 255)
    img_4k = Image.fromarray(warm_4k.astype(np.uint8), 'RGB')
    img_4k.save(TARGET / 'natural-earth-relief.webp', quality=88, method=6)
    img_4k.resize((1024, 512), Image.Resampling.LANCZOS).save(
        TARGET / 'natural-earth-relief-low.webp', quality=82, method=6
    )

    # Build 2048x1024 RGBA terrain-height.png (R: elevation, G: coastal shelf/bevel, B: landmask, A: water/river).
    sr_w_2k = np.asarray(img_4k.resize((W_HGT, H_HGT), Image.Resampling.BILINEAR), dtype=np.float32)
    land_2k = ~np.asarray(
        Image.fromarray((is_ocean_4k * 255).astype(np.uint8), 'L').resize((W_HGT, H_HGT), Image.Resampling.BILINEAR),
        dtype=np.float32,
    ).__gt__(127)
    river_2k = np.asarray(
        Image.fromarray((is_river_or_lake_4k * 255).astype(np.uint8), 'L').resize((W_HGT, H_HGT), Image.Resampling.BILINEAR),
        dtype=np.float32,
    ) / 255.0

    dist_from_land = distance_transform_edt(~land_2k).astype(np.float32)
    dist_inland = distance_transform_edt(land_2k).astype(np.float32)
    shelf_sea = np.exp(-dist_from_land / 14.0)
    inland_fade = np.clip(dist_inland / 8.0, 0.0, 1.0)

    # Ridges + subtle procedural relief noise
    xs = np.linspace(-180, 180, W_HGT, endpoint=False, dtype=np.float32) + 180 / W_HGT
    ys = np.linspace(90, -90, H_HGT, endpoint=False, dtype=np.float32) - 90 / H_HGT
    lon, lat = np.meshgrid(xs, ys)
    rng = np.random.default_rng(1450)
    fine = gaussian_filter(rng.standard_normal((H_HGT, W_HGT)).astype(np.float32), sigma=2.2)
    broad = gaussian_filter(rng.standard_normal((H_HGT, W_HGT)).astype(np.float32), sigma=9.0)
    fine /= max(float(np.std(fine)), 1e-5)
    broad /= max(float(np.std(broad)), 1e-5)

    # Extract high-pass relief contrast from Natural Earth's artist-shaded gray luminance
    lum = (sr_w_2k[:, :, 0] * 0.299 + sr_w_2k[:, :, 1] * 0.587 + sr_w_2k[:, :, 2] * 0.114) / 255.0
    lum_hp = lum - gaussian_filter(lum, sigma=6.0)
    hills = np.clip(0.08 + 0.03 * broad + 0.02 * fine + lum_hp * 0.45, 0.02, 0.30)

    for points, amp, width in RIDGES:
        d2 = np.full((H_HGT, W_HGT), 1e10, dtype=np.float32)
        for (x1, y1), (x2, y2) in zip(points[:-1], points[1:]):
            c = np.cos(np.deg2rad((y1 + y2) * 0.5))
            px = (lon - x1) * c
            py = lat - y1
            vx = (x2 - x1) * c
            vy = y2 - y1
            t = np.clip((px * vx + py * vy) / max(vx * vx + vy * vy, 1e-4), 0, 1)
            d2 = np.minimum(d2, (px - vx * t) ** 2 + (py - vy * t) ** 2)
        ridge = np.exp(-d2 / (2.0 * width * width))
        hills += np.float32(amp * 0.145) * ridge * (0.78 + 0.16 * np.clip(fine, -1.5, 1.5))

    hills = gaussian_filter(np.clip(hills, 0.0, 1.0), sigma=1.1)
    hills = np.clip(hills * inland_fade * (1.0 - river_2k * 0.6), 0.0, 1.0) * land_2k.astype(np.float32)

    # Soft anti-aliased coastal alpha in B channel for ultra-crisp coastline edge shading
    land_soft = np.clip(gaussian_filter(land_2k.astype(np.float32), sigma=0.7), 0.0, 1.0)

    g_channel = np.where(land_2k, 1.0 - inland_fade, shelf_sea)
    rgba = np.stack([
        np.round(hills * 255),
        np.round(np.clip(g_channel, 0.0, 1.0) * 255),
        np.round(land_soft * 255),
        np.round(np.clip(river_2k, 0.0, 1.0) * 255),
    ], axis=-1).astype(np.uint8)
    Image.fromarray(rgba, 'RGBA').save(TARGET / 'terrain-height.png', optimize=True)

    for p in sorted(TARGET.iterdir()):
        print(f'Built {p.name}: {p.stat().st_size / 1024:.1f} KB')


if __name__ == '__main__':
    main()
