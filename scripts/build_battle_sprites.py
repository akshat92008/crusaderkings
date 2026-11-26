"""Generate and extract crisp 2D isometric sprite strips for Banner Lines tactical battles."""
import json
import zipfile
from pathlib import Path
from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'assets' / 'battle' / 'sprites'
OUT.mkdir(parents=True, exist_ok=True)


def save_webp(img: Image.Image, name: str):
    path = OUT / f'{name}.webp'
    img.save(path, 'WEBP', quality=90, lossless=False)
    return f'assets/battle/sprites/{name}.webp'


def extract_particles_and_strips():
    assets = {}
    pp_zip = ROOT / 'assets' / 'packs' / 'kenney_particle-pack.zip'
    if pp_zip.exists():
        wanted = {
            'fx_smoke': 'PNG (Transparent)/smoke_04.png',
            'fx_spark': 'PNG (Transparent)/spark_02.png',
            'fx_dirt': 'PNG (Transparent)/dirt_02.png',
            'fx_flash': 'PNG (Transparent)/star_05.png',
        }
        with zipfile.ZipFile(pp_zip) as zf:
            for key, member in wanted.items():
                if member in zf.namelist():
                    with zf.open(member) as f:
                        im = Image.open(f).convert('RGBA').resize((64, 64), Image.LANCZOS)
                        assets[key] = save_webp(im, key)

    vil_zip = ROOT / 'assets' / 'packs' / 'Villager_01.zip'
    if vil_zip.exists():
        with zipfile.ZipFile(vil_zip) as zf:
            frames = []
            for idx in (0, 2, 4, 6):
                member = f'Villager_01/Walk/villager_walk_2000{idx}.png'
                if member in zf.namelist():
                    with zf.open(member) as f:
                        frames.append(Image.open(f).convert('RGBA').resize((64, 64), Image.LANCZOS))
            if frames:
                strip = Image.new('RGBA', (64 * len(frames), 64), (0, 0, 0, 0))
                for i, fr in enumerate(frames):
                    strip.paste(fr, (i * 64, 0), fr)
                assets['levy_villager'] = save_webp(strip, 'levy_villager')
    return assets


def draw_shadow(d: ImageDraw.ImageDraw, cx: int, cy: int, rx: int = 16, ry: int = 7):
    d.ellipse((cx - rx, cy - ry, cx + rx, cy + ry), fill=(12, 16, 14, 115))


def draw_humanoid(d: ImageDraw.ImageDraw, cx: int, cy: int, frame: int, *,
                  tunic=(185, 68, 56), armor=(175, 186, 198), helm=(195, 204, 214),
                  shield=True, kind='infantry'):
    draw_shadow(d, cx, cy, 15, 6)
    bob = -2 if frame == 1 else (1 if frame == 3 else 0)
    lean = 4 if frame == 2 else (-3 if frame == 3 else 0)
    stride = 5 if frame == 1 else (2 if frame == 2 else 0)

    # Legs / boots
    d.line((cx - 4 - stride // 2, cy - 16 + bob, cx - 5 - stride, cy - 2), fill=(52, 40, 32, 255), width=4)
    d.line((cx + 4 + stride // 2, cy - 16 + bob, cx + 5 + stride, cy - 2), fill=(68, 52, 40, 255), width=4)

    # Cape / tunic skirt
    d.polygon([(cx - 9, cy - 20 + bob), (cx + 9, cy - 20 + bob), (cx + 11, cy - 10 + bob), (cx - 11, cy - 10 + bob)],
              fill=tunic + (255,), outline=(28, 22, 20, 255))

    # Torso + armor
    tx = cx + lean // 2
    d.rounded_rectangle((tx - 9, cy - 36 + bob, tx + 9, cy - 18 + bob), radius=4, fill=armor + (255,), outline=(30, 32, 36, 255))
    # Pauldrons
    d.ellipse((tx - 12, cy - 37 + bob, tx - 5, cy - 28 + bob), fill=armor + (255,), outline=(30, 32, 36, 255))
    d.ellipse((tx + 5, cy - 37 + bob, tx + 12, cy - 28 + bob), fill=armor + (255,), outline=(30, 32, 36, 255))

    # Head + helmet
    hx = cx + lean // 2
    d.ellipse((hx - 7, cy - 49 + bob, hx + 7, cy - 35 + bob), fill=(232, 194, 156, 255), outline=(40, 28, 20, 255))
    if kind in ('heavy_infantry', 'pikemen', 'commander'):
        d.pieslice((hx - 9, cy - 52 + bob, hx + 9, cy - 37 + bob), 180, 360, fill=helm + (255,), outline=(30, 32, 36, 255))
        if kind == 'commander':
            d.polygon([(hx, cy - 52 + bob), (hx - 4, cy - 59 + bob), (hx + 6, cy - 55 + bob)], fill=(238, 196, 86, 255))
    elif kind == 'archers':
        d.pieslice((hx - 8, cy - 51 + bob, hx + 8, cy - 39 + bob), 175, 365, fill=(78, 102, 62, 255), outline=(28, 38, 22, 255))
    elif kind == 'gunpowder':
        d.ellipse((hx - 10, cy - 49 + bob, hx + 10, cy - 43 + bob), fill=(58, 48, 42, 255))
        d.rectangle((hx - 6, cy - 54 + bob, hx + 6, cy - 46 + bob), fill=(72, 60, 52, 255), outline=(28, 22, 18, 255))
    else:
        d.pieslice((hx - 8, cy - 50 + bob, hx + 8, cy - 38 + bob), 180, 360, fill=helm + (255,), outline=(30, 32, 36, 255))

    # Weapons & shields by archetype
    if shield and kind in ('infantry', 'heavy_infantry'):
        sx = cx - 12 + lean // 2
        sy = cy - 28 + bob
        d.polygon([(sx - 7, sy - 8), (sx + 7, sy - 8), (sx + 6, sy + 4), (sx, sy + 12), (sx - 6, sy + 4)],
                  fill=tunic + (255,), outline=(228, 198, 118, 255))
        d.line((sx, sy - 6, sx, sy + 8), fill=(242, 220, 145, 255), width=2)

    if kind in ('infantry', 'heavy_infantry'):
        ang_dx = 18 if frame == 2 else 11
        ang_dy = -16 if frame == 2 else -28
        w = 4 if kind == 'heavy_infantry' else 3
        d.line((tx + 8, cy - 26 + bob, tx + ang_dx, cy - 26 + bob + ang_dy), fill=(224, 232, 240, 255), width=w)
        d.line((tx + 5, cy - 28 + bob, tx + 11, cy - 24 + bob), fill=(208, 168, 72, 255), width=3)
    elif kind == 'pikemen':
        tip_x = tx + (26 if frame == 2 else 18)
        tip_y = cy - (26 if frame == 2 else 54) + bob
        d.line((tx - 6, cy - 12 + bob, tip_x, tip_y), fill=(120, 88, 52, 255), width=3)
        d.polygon([(tip_x - 3, tip_y), (tip_x + 4, tip_y - 7), (tip_x + 2, tip_y + 2)], fill=(225, 234, 244, 255))
    elif kind == 'archers':
        bx = tx + 11 + (3 if frame == 2 else 0)
        by = cy - 29 + bob
        d.arc((bx - 6, by - 14, bx + 8, by + 14), 275, 85, fill=(146, 102, 54, 255), width=3)
        if frame == 2:
            d.line((tx + 4, by, bx + 14, by), fill=(238, 226, 190, 255), width=2)
    elif kind == 'gunpowder':
        gx = tx + 16 + (4 if frame == 2 else 0)
        gy = cy - 29 + bob
        d.line((tx + 2, cy - 27 + bob, gx, gy), fill=(84, 72, 62, 255), width=4)
        if frame == 2:
            d.ellipse((gx - 2, gy - 6, gx + 10, gy + 6), fill=(255, 206, 92, 245))
            d.ellipse((gx + 1, gy - 3, gx + 7, gy + 3), fill=(255, 250, 210, 255))
    elif kind == 'commander':
        # Banner pole & heraldic pennon
        px = tx + 10
        d.line((px, cy - 2, px, cy - 60 + bob), fill=(198, 166, 94, 255), width=3)
        wave = 3 if frame in (1, 2) else 0
        d.polygon([(px, cy - 59 + bob), (px + 20, cy - 54 + bob + wave), (px + 14, cy - 48 + bob), (px + 20, cy - 43 + bob - wave), (px, cy - 41 + bob)],
                  fill=tunic + (255,), outline=(238, 206, 118, 255))

    if frame == 3:
        d.line((cx - 12, cy - 44, cx + 12, cy - 20), fill=(255, 118, 92, 210), width=3)


def draw_cavalry(d: ImageDraw.ImageDraw, cx: int, cy: int, frame: int):
    draw_shadow(d, cx, cy + 2, 26, 9)
    bob = -3 if frame == 1 else (2 if frame == 2 else 0)
    # Horse body
    d.ellipse((cx - 21, cy - 28 + bob, cx + 18, cy - 10 + bob), fill=(116, 76, 48, 255), outline=(42, 28, 18, 255))
    # Caparison cloth
    d.polygon([(cx - 17, cy - 25 + bob), (cx + 12, cy - 25 + bob), (cx + 14, cy - 12 + bob), (cx - 19, cy - 12 + bob)],
              fill=(182, 58, 48, 255), outline=(228, 196, 112, 255))
    # Horse legs
    step = 6 if frame in (1, 2) else 1
    d.line((cx - 14, cy - 14 + bob, cx - 17 - step, cy), fill=(86, 54, 34, 255), width=4)
    d.line((cx - 6, cy - 14 + bob, cx - 5 + step // 2, cy), fill=(86, 54, 34, 255), width=4)
    d.line((cx + 8, cy - 14 + bob, cx + 10 + step, cy), fill=(86, 54, 34, 255), width=4)
    d.line((cx + 14, cy - 14 + bob, cx + 18 + step // 2, cy - 2), fill=(86, 54, 34, 255), width=4)
    # Horse neck & head
    d.polygon([(cx + 10, cy - 24 + bob), (cx + 22, cy - 40 + bob), (cx + 28, cy - 33 + bob), (cx + 16, cy - 17 + bob)],
              fill=(124, 82, 52, 255), outline=(42, 28, 18, 255))
    # Rider
    d.rounded_rectangle((cx - 8, cy - 45 + bob, cx + 7, cy - 26 + bob), radius=4, fill=(192, 202, 214, 255), outline=(30, 32, 36, 255))
    d.ellipse((cx - 6, cy - 57 + bob, cx + 6, cy - 44 + bob), fill=(200, 208, 218, 255), outline=(30, 32, 36, 255))
    # Lance
    lx = cx + (30 if frame == 2 else 22)
    ly = cy - (26 if frame == 2 else 54) + bob
    d.line((cx - 8, cy - 30 + bob, lx, ly), fill=(154, 112, 62, 255), width=3)
    d.polygon([(lx - 4, ly - 2), (lx + 6, ly - 4), (lx + 1, ly + 4)], fill=(230, 238, 245, 255))
    d.polygon([(lx - 10, ly + 1), (lx - 3, ly - 5), (lx - 14, ly - 4)], fill=(225, 185, 76, 255))
    if frame == 3:
        d.line((cx - 14, cy - 48, cx + 14, cy - 20), fill=(255, 118, 92, 210), width=3)


def draw_elephant(d: ImageDraw.ImageDraw, cx: int, cy: int, frame: int):
    draw_shadow(d, cx, cy + 3, 30, 11)
    bob = -2 if frame == 1 else (1 if frame == 2 else 0)
    # Huge body
    d.ellipse((cx - 26, cy - 44 + bob, cx + 24, cy - 14 + bob), fill=(122, 126, 134, 255), outline=(48, 50, 56, 255))
    # Legs
    stride = 3 if frame in (1, 2) else 0
    for lx, dx in ((-18, -stride), (-7, stride), (7, -stride), (16, stride)):
        d.rounded_rectangle((cx + lx + dx - 4, cy - 22 + bob, cx + lx + dx + 4, cy + 1), radius=2, fill=(104, 108, 116, 255), outline=(42, 44, 48, 255))
    # Head & ears
    d.ellipse((cx + 12, cy - 45 + bob, cx + 32, cy - 22 + bob), fill=(132, 136, 144, 255), outline=(48, 50, 56, 255))
    d.ellipse((cx + 8, cy - 43 + bob, cx + 20, cy - 24 + bob), fill=(110, 114, 122, 255), outline=(48, 50, 56, 255))
    # Trunk & golden tusks
    trunk_y = cy - (26 if frame == 2 else 10) + bob
    d.line((cx + 29, cy - 30 + bob, cx + 35, trunk_y), fill=(126, 130, 138, 255), width=5)
    d.line((cx + 26, cy - 25 + bob, cx + 38, cy - 20 + bob), fill=(246, 232, 178, 255), width=3)
    # Gilded howdah + blanket (Vijayanagara flagship!)
    d.polygon([(cx - 18, cy - 43 + bob), (cx + 12, cy - 43 + bob), (cx + 14, cy - 24 + bob), (cx - 20, cy - 24 + bob)],
              fill=(178, 62, 42, 255), outline=(238, 200, 96, 255))
    d.rounded_rectangle((cx - 15, cy - 58 + bob, cx + 9, cy - 41 + bob), radius=3, fill=(216, 168, 62, 255), outline=(88, 56, 22, 255))
    # Rider inside howdah
    d.ellipse((cx - 8, cy - 66 + bob, cx + 2, cy - 55 + bob), fill=(235, 198, 140, 255), outline=(42, 30, 20, 255))
    d.pieslice((cx - 10, cy - 69 + bob, cx + 4, cy - 58 + bob), 180, 360, fill=(220, 178, 68, 255))


def build_unit_sheets():
    manifest = {}
    specs = {
        'infantry': (64, 64, lambda d, cx, cy, f: draw_humanoid(d, cx, cy, f, tunic=(172, 62, 52), armor=(168, 178, 192), shield=True, kind='infantry')),
        'heavy_infantry': (64, 64, lambda d, cx, cy, f: draw_humanoid(d, cx, cy, f, tunic=(146, 48, 42), armor=(204, 214, 226), helm=(218, 226, 236), shield=True, kind='heavy_infantry')),
        'pikemen': (64, 64, lambda d, cx, cy, f: draw_humanoid(d, cx, cy, f, tunic=(160, 82, 48), armor=(178, 188, 198), shield=False, kind='pikemen')),
        'archers': (64, 64, lambda d, cx, cy, f: draw_humanoid(d, cx, cy, f, tunic=(78, 118, 68), armor=(122, 98, 72), shield=False, kind='archers')),
        'gunpowder': (64, 64, lambda d, cx, cy, f: draw_humanoid(d, cx, cy, f, tunic=(132, 66, 52), armor=(138, 146, 156), shield=False, kind='gunpowder')),
        'commander': (64, 64, lambda d, cx, cy, f: draw_humanoid(d, cx, cy, f, tunic=(188, 54, 46), armor=(218, 192, 112), helm=(238, 212, 128), shield=False, kind='commander')),
        'cavalry': (88, 72, draw_cavalry),
        'elephants': (96, 78, draw_elephant),
    }
    for key, (fw, fh, fn) in specs.items():
        strip = Image.new('RGBA', (fw * 4, fh), (0, 0, 0, 0))
        d = ImageDraw.Draw(strip)
        for frame in range(4):
            fn(d, frame * fw + fw // 2, fh - 6, frame)
        manifest[key] = {'url': save_webp(strip, key), 'frames': 4, 'frameW': fw, 'frameH': fh}
    return manifest


def main():
    extras = extract_particles_and_strips()
    units = build_unit_sheets()
    data = {'version': 1, 'units': units, 'extras': extras}
    (OUT / 'manifest.json').write_text(json.dumps(data, indent=2) + '\n')
    print(f'Generated {len(units)} battle sprite strips and {len(extras)} battle FX sprites in {OUT}')


if __name__ == '__main__':
    main()
