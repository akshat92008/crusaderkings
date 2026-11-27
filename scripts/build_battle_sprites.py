"""Extract transparent, multi-frame civilization unit & VFX sprite sheets for Banner Lines."""
from collections import deque
from pathlib import Path
import io
import json
import subprocess
import zipfile
from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'assets' / 'battle' / 'sprites'
CULTURE_OUT = OUT / 'cultures'
OUT.mkdir(parents=True, exist_ok=True)
CULTURE_OUT.mkdir(parents=True, exist_ok=True)

# 6x6 Gemini 2048x2048 historical sprite sheets tracked in git HEAD -> unit role mappings.
# Selected frames: row 0 col 0 (idle), row 1 col 2 (walk), row 3 col 2 (attack), row 4 col 1 (hit/rout).
FRAME_COORDS = [(0, 0), (2, 1), (2, 3), (1, 4)]

DEFAULT_SHEETS = {
    'infantry': ('7r747w7r747w7r74', 96, 96),
    'heavy_infantry': ('7zn1jd7zn1jd7zn1', 96, 96),
    'pikemen': ('gt5r22gt5r22gt5r', 96, 96),
    'archers': ('2jlxix2jlxix2jlx', 96, 96),
    'gunpowder': ('7pzhfq7pzhfq7pzh', 96, 96),
    'commander': ('agskuragskuragsk', 118, 102),
    'cavalry': ('xfh656xfh656xfh6', 118, 102),
    'elephants': ('7y9kha7y9kha7y9k', 128, 110),
}

CULTURE_SHEETS = {
    'europe_west': {
        'infantry': ('7r747w7r747w7r74', 96, 96),
        'heavy_infantry': ('fb33uyfb33uyfb33', 96, 96),
        'pikemen': ('gt5r22gt5r22gt5r', 96, 96),
        'archers': ('acp9q7acp9q7acp9', 96, 96),
        'crossbow': ('2jlxix2jlxix2jlx', 96, 96),
        'gunpowder': ('7pzhfq7pzhfq7pzh', 96, 96),
        'cavalry': ('xfh656xfh656xfh6', 118, 102),
        'commander': ('agskuragskuragsk', 118, 102),
    },
    'europe_east': {
        'infantry': ('7zn1jd7zn1jd7zn1', 96, 96),
        'heavy_infantry': ('9lw3b9lw3b9lw3b9', 96, 96),
        'pikemen': ('jzggtdjzggtdjzgg', 96, 96),
        'archers': ('c5hj3mc5hj3mc5hj', 96, 96),
        'gunpowder': ('7pzhfq7pzhfq7pzh', 96, 96),
        'cavalry': ('agskuragskuragsk', 118, 102),
        'commander': ('xfh656xfh656xfh6', 118, 102),
    },
    'ottoman': {
        'infantry': ('33oz2y33oz2y33oz', 96, 96),
        'heavy_infantry': ('d7xpf5d7xpf5d7xp', 96, 96),
        'pikemen': ('3x5hn63x5hn63x5h', 96, 96),
        'archers': ('iehse6iehse6iehs', 96, 96),
        'gunpowder': ('vuvk5zvuvk5zvuvk', 96, 96),
        'cavalry': ('fia0dsfia0dsfia0', 118, 102),
        'commander': ('y3xy70y3xy70y3xy', 118, 102),
    },
    'persian': {
        'infantry': ('m1k4uxm1k4uxm1k4', 96, 96),
        'heavy_infantry': ('v2kpj7v2kpj7v2kp', 96, 96),
        'pikemen': ('44unij44unij44un', 96, 96),
        'archers': ('iehse6iehse6iehs', 96, 96),
        'gunpowder': ('vuvk5zvuvk5zvuvk', 96, 96),
        'cavalry': ('y3xy70y3xy70y3xy', 118, 102),
        'commander': ('fia0dsfia0dsfia0', 118, 102),
    },
    'southindia': {
        'infantry': ('snyt3isnyt3isnyt', 96, 96),
        'heavy_infantry': ('v2kpj7v2kpj7v2kp', 96, 96),
        'pikemen': ('r0d056r0d056r0d0', 96, 96),
        'archers': ('qottp7qottp7qott', 96, 96),
        'gunpowder': ('vuvk5zvuvk5zvuvk', 96, 96),
        'cavalry': ('y3xy70y3xy70y3xy', 118, 102),
        'elephants': ('7y9kha7y9kha7y9k', 128, 110),
        'commander': ('bm3p0qbm3p0qbm3p', 128, 110),
    },
    'northindia': {
        'infantry': ('m1k4uxm1k4uxm1k4', 96, 96),
        'heavy_infantry': ('v2kpj7v2kpj7v2kp', 96, 96),
        'pikemen': ('44unij44unij44un', 96, 96),
        'archers': ('qottp7qottp7qott', 96, 96),
        'gunpowder': ('vuvk5zvuvk5zvuvk', 96, 96),
        'cavalry': ('y3xy70y3xy70y3xy', 118, 102),
        'elephants': ('7y9kha7y9kha7y9k', 128, 110),
        'commander': ('bm3p0qbm3p0qbm3p', 128, 110),
    },
    'ming': {
        'infantry': ('d8i71id8i71id8i7', 96, 96),
        'heavy_infantry': ('d8i71id8i71id8i7', 96, 96),
        'pikemen': ('6s7zl66s7zl66s7z', 96, 96),
        'archers': ('e41b5qe41b5qe41b', 96, 96),
        'gunpowder': ('7pzhfq7pzhfq7pzh', 96, 96),
        'cavalry': ('xhxz1xxhxz1xxhxz', 118, 102),
        'commander': ('lesd2wlesd2wlesd', 118, 102),
    },
    'japan': {
        'infantry': ('feoyafeoyafeoyaf', 96, 96),
        'heavy_infantry': ('feoyafeoyafeoyaf', 96, 96),
        'pikemen': ('6s7zl66s7zl66s7z', 96, 96),
        'archers': ('j27cxtj27cxtj27c', 96, 96),
        'gunpowder': ('7pzhfq7pzhfq7pzh', 96, 96),
        'cavalry': ('lesd2wlesd2wlesd', 118, 102),
        'commander': ('lesd2wlesd2wlesd', 118, 102),
    },
    'southeast': {
        'infantry': ('snyt3isnyt3isnyt', 96, 96),
        'heavy_infantry': ('d8i71id8i71id8i7', 96, 96),
        'pikemen': ('6s7zl66s7zl66s7z', 96, 96),
        'archers': ('e41b5qe41b5qe41b', 96, 96),
        'cavalry': ('lesd2wlesd2wlesd', 118, 102),
        'elephants': ('7y9kha7y9kha7y9k', 128, 110),
        'commander': ('bm3p0qbm3p0qbm3p', 128, 110),
    },
    'steppe': {
        'infantry': ('jyxrnejyxrnejyxr', 96, 96),
        'heavy_infantry': ('7zn1jd7zn1jd7zn1', 96, 96),
        'pikemen': ('jzggtdjzggtdjzgg', 96, 96),
        'archers': ('jyxrnejyxrnejyxr', 96, 96),
        'horsebow': ('au30gmau30gmau30', 118, 102),
        'cavalry': ('ybyd5gybyd5gybyd', 118, 102),
        'commander': ('xhxz1xxhxz1xxhxz', 118, 102),
    },
    'africa': {
        'infantry': ('hzntlwhzntlwhznt', 96, 96),
        'heavy_infantry': ('dv8f0qdv8f0qdv8f', 96, 96),
        'pikemen': ('3x5hn63x5hn63x5h', 96, 96),
        'archers': ('iehse6iehse6iehs', 96, 96),
        'cavalry': ('fia0dsfia0dsfia0', 118, 102),
        'commander': ('33oz2y33oz2y33oz', 96, 96),
    },
    'mesoamerica': {
        'infantry': ('r1potdr1potdr1po', 96, 96),
        'heavy_infantry': ('r7klf8r7klf8r7kl', 96, 96),
        'pikemen': ('w0b414w0b414w0b4', 96, 96),
        'archers': ('hhzz41hhzz41hhzz', 96, 96),
        'cavalry': ('r7klf8r7klf8r7kl', 96, 96),
        'commander': ('r1potdr1potdr1po', 96, 96),
    },
    'andean': {
        'infantry': ('w0b414w0b414w0b4', 96, 96),
        'heavy_infantry': ('tkxrwotkxrwotkxr', 96, 96),
        'pikemen': ('tl4dc2tl4dc2tl4d', 96, 96),
        'archers': ('8bq5ae8bq5ae8bq5', 96, 96),
        'cavalry': ('w0b414w0b414w0b4', 96, 96),
        'commander': ('r1potdr1potdr1po', 96, 96),
    },
}

_SHEET_CACHE = {}


def load_git_sheet(sheet_id: str) -> Image.Image:
    if sheet_id in _SHEET_CACHE:
        return _SHEET_CACHE[sheet_id]
    # Note: one blob uses mixed case or space suffix if ever needed; HEAD paths follow Gemini_Generated_Image_<id>.png
    rel = f'assets/Gemini_Generated_Image_{sheet_id}.png'
    try:
        raw = subprocess.check_output(['git', 'show', f'HEAD:{rel}'], cwd=str(ROOT), stderr=subprocess.DEVNULL)
    except subprocess.CalledProcessError:
        dl = Path.home() / 'Downloads' / f'Gemini_Generated_Image_{sheet_id}.png'
        raw = dl.read_bytes()
    im = Image.open(io.BytesIO(raw)).convert('RGBA')
    _SHEET_CACHE[sheet_id] = im
    return im


def key_cell_background(cell: Image.Image) -> Image.Image:
    """Perimeter flood-fill keying for white or light/dark checkerboard mattes.

    Samples actual neutral matte colors from the cell's border band so dark
    checkerboard squares are removed cleanly alongside light ones, without ever
    entering the colored soldier interior.
    """
    w, h = cell.size
    px = cell.load()
    visited = bytearray(w * h)
    q = deque()

    # Sample distinct neutral tones from the outermost 32px corner bands (covers light & dark checker tiles)
    samples = []
    for y in list(range(2, min(36, h), 4)) + list(range(max(0, h - 36), h - 1, 4)):
        for x in list(range(2, min(36, w), 4)) + list(range(max(0, w - 36), w - 1, 4)):
            r, g, b, _ = px[x, y]
            if max(r, g, b) - min(r, g, b) <= 22:
                if all(abs(r - sr) + abs(g - sg) + abs(b - sb) > 16 for sr, sg, sb in samples):
                    samples.append((r, g, b))
        if len(samples) >= 8:
            break
    matte_tones = samples

    def is_matte(r: int, g: int, b: int) -> bool:
        hi = max(r, g, b)
        lo = min(r, g, b)
        sat = hi - lo
        if (sat <= 22 and hi >= 145) or (hi >= 238 and sat <= 34):
            return True
        if sat <= 18:
            for sr, sg, sb in matte_tones:
                tol = 10 if max(sr, sg, sb) < 28 else 22
                if abs(r - sr) <= tol and abs(g - sg) <= tol and abs(b - sb) <= tol:
                    return True
        return False

    for x in range(w):
        q.append((x, 0))
        q.append((x, h - 1))
    for y in range(1, h - 1):
        q.append((0, y))
        q.append((w - 1, y))

    while q:
        x, y = q.popleft()
        idx = y * w + x
        if visited[idx]:
            continue
        r, g, b, a = px[x, y]
        if not is_matte(r, g, b):
            continue
        visited[idx] = 1
        px[x, y] = (0, 0, 0, 0)
        if x > 0 and not visited[idx - 1]:
            q.append((x - 1, y))
        if x + 1 < w and not visited[idx + 1]:
            q.append((x + 1, y))
        if y > 0 and not visited[idx - w]:
            q.append((x, y - 1))
        if y + 1 < h and not visited[idx + w]:
            q.append((x, y + 1))

    # Gentle 1px edge de-fringing for pale anti-aliased halos touching transparent pixels
    for y in range(1, h - 1):
        for x in range(1, w - 1):
            r, g, b, a = px[x, y]
            if a == 0:
                continue
            hi = max(r, g, b)
            lo = min(r, g, b)
            if hi - lo <= 22 and hi >= 145:
                neighbors_clear = (
                    px[x - 1, y][3] == 0 or px[x + 1, y][3] == 0 or
                    px[x, y - 1][3] == 0 or px[x, y + 1][3] == 0
                )
                if neighbors_clear:
                    px[x, y] = (int(r * 0.55), int(g * 0.55), int(b * 0.55), 115)
    return cell


def slice_strip(sheet_id: str, fw: int, fh: int) -> Image.Image:
    im = load_git_sheet(sheet_id)
    w, h = im.size
    strip = Image.new('RGBA', (fw * len(FRAME_COORDS), fh), (0, 0, 0, 0))
    cells = []
    bboxes = []
    for col, row in FRAME_COORDS:
        x0 = round(col * w / 6) + 5
        y0 = round(row * h / 6) + 5
        x1 = round((col + 1) * w / 6) - 5
        y1 = round((row + 1) * h / 6) - 5
        cell = key_cell_background(im.crop((x0, y0, x1, y1)))
        bb = cell.getbbox()
        cells.append(cell)
        if bb:
            bboxes.append(bb)

    if not bboxes:
        return strip

    # Consistent union crop box + bottom alignment so sprites don't jitter between poses
    ux0 = min(b[0] for b in bboxes)
    uy0 = min(b[1] for b in bboxes)
    ux1 = max(b[2] for b in bboxes)
    uy1 = max(b[3] for b in bboxes)
    pad = 4
    ux0 = max(0, ux0 - pad)
    uy0 = max(0, uy0 - pad)
    ux1 = min(cells[0].width, ux1 + pad)
    uy1 = min(cells[0].height, uy1 + pad)

    crop_w = max(1, ux1 - ux0)
    crop_h = max(1, uy1 - uy0)
    target_h = fh - 6
    target_w = fw - 6
    scale = min(target_w / crop_w, target_h / crop_h)
    nw = max(1, round(crop_w * scale))
    nh = max(1, round(crop_h * scale))

    for i, cell in enumerate(cells):
        cropped = cell.crop((ux0, uy0, ux1, uy1)).resize((nw, nh), Image.Resampling.LANCZOS)
        dx = i * fw + (fw - nw) // 2
        dy = fh - nh - 2
        strip.paste(cropped, (dx, dy), cropped)
    return strip


def save_webp(img: Image.Image, rel_no_ext: str) -> str:
    path = OUT / f'{rel_no_ext}.webp'
    path.parent.mkdir(parents=True, exist_ok=True)
    img.save(path, 'WEBP', quality=88, method=5)
    return f'assets/battle/sprites/{rel_no_ext}.webp'


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

    # Also extract crisp battle VFX sprites from Downloads when available
    dl_vfx = {
        'fx_slash': ('Axe_slash_trail_sprite_sheet_5833cc93.jpg', (0, 0)),
        'fx_impact': ('Combat_VFX_impact_flash_sprite_94a7b372.jpg', (1, 0)),
        'fx_dust': ('Earthy_dust_burst_sprite_sheet_c25414cb.jpg', (0, 0)),
    }
    for key, (fname, (col, row)) in dl_vfx.items():
        src = Path.home() / 'Downloads' / fname
        if not src.exists():
            continue
        im = Image.open(src).convert('RGBA')
        w, h = im.size
        cell = im.crop((round(col * w / 4) + 4, round(row * h / 4) + 4, round((col + 1) * w / 4) - 4, round((row + 1) * h / 4) - 4))
        cell = key_cell_background(cell)
        cell.thumbnail((96, 96), Image.Resampling.LANCZOS)
        assets[key] = save_webp(cell, key)

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


def key_green_screen(cell: Image.Image) -> Image.Image:
    """Chroma-key #00FF00 green-screen sprite backgrounds and de-spill edges cleanly."""
    w, h = cell.size
    px = cell.load()
    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            hi_rb = max(r, b)
            diff = g - hi_rb
            if g > 88 and diff > 28:
                px[x, y] = (0, 0, 0, 0)
            elif diff > 8 and g > 65:
                # De-spill green edge halo onto neutral/warm rim
                alpha = max(60, min(255, int(255 - (diff - 8) * 9)))
                px[x, y] = (r, hi_rb, b, min(a, alpha))
    return cell


def _detect_green_screen_frames(im: Image.Image):
    """Detect row bands and horizontal frame bounding boxes in a green-screen sprite sheet."""
    w, h = im.size
    px = im.load()

    def is_fg(r: int, g: int, b: int) -> bool:
        return not (g > 110 and g - max(r, b) > 36)

    row_bands = []
    in_r, rs = False, 0
    for y in range(h):
        if any(is_fg(*px[x, y][:3]) for x in range(0, w, 2)):
            if not in_r:
                in_r, rs = True, y
        elif in_r:
            in_r = False
            if y - rs >= 24:
                row_bands.append((rs, y))
    if in_r and h - rs >= 24:
        row_bands.append((rs, h))

    grid = []
    for ry0, ry1 in row_bands:
        cols = []
        in_c, cs = False, 0
        for x in range(w):
            if any(is_fg(*px[x, y][:3]) for y in range(ry0, ry1, 2)):
                if not in_c:
                    in_c, cs = True, x
            elif in_c:
                in_c = False
                if x - cs >= 24:
                    cols.append((cs, ry0, x, ry1))
        if in_c and w - cs >= 24:
            cols.append((cs, ry0, w, ry1))
        if cols:
            grid.append(cols)
    return grid


def extract_green_screen_strip(src_path: Path, key: str, picks: list[tuple[int, int]], fw: int = 96, fh: int = 96) -> str | None:
    """Slice a 4-frame horizontal sprite strip from a #00FF00 green-screen sheet or keep committed output."""
    out_path = OUT / f'{key}.webp'
    if not src_path.exists():
        return f'assets/battle/sprites/{key}.webp' if out_path.exists() else None

    im = Image.open(src_path).convert('RGBA')
    grid = _detect_green_screen_frames(im)
    if not grid:
        return f'assets/battle/sprites/{key}.webp' if out_path.exists() else None

    cells = []
    bboxes = []
    for r_idx, c_idx in picks:
        row = grid[min(r_idx, len(grid) - 1)]
        box = row[min(c_idx, len(row) - 1)]
        pad_box = (max(0, box[0] - 4), max(0, box[1] - 4), min(im.width, box[2] + 4), min(im.height, box[3] + 4))
        cell = key_green_screen(im.crop(pad_box))
        bb = cell.getbbox()
        if bb:
            cell = cell.crop(bb)
            bboxes.append(cell.size)
        cells.append(cell)

    if not bboxes:
        return f'assets/battle/sprites/{key}.webp' if out_path.exists() else None

    max_w = max(w for w, _ in bboxes)
    max_h = max(h for _, h in bboxes)
    scale = min((fw - 8) / max(1, max_w), (fh - 8) / max(1, max_h))
    strip = Image.new('RGBA', (fw * len(cells), fh), (0, 0, 0, 0))
    for i, cell in enumerate(cells):
        cw, ch = cell.size
        nw = max(1, round(cw * scale))
        nh = max(1, round(ch * scale))
        resized = cell.resize((nw, nh), Image.Resampling.LANCZOS)
        dx = i * fw + (fw - nw) // 2
        dy = fh - nh - 3
        strip.paste(resized, (dx, dy), resized)
    return save_webp(strip, key)


def _fit_rgba_canvas(im: Image.Image, size: int = 96, pad: int = 6) -> Image.Image:
    bb = im.getbbox()
    if bb:
        im = im.crop(bb)
    cw, ch = im.size
    scale = min((size - pad * 2) / max(1, cw), (size - pad * 2) / max(1, ch))
    nw, nh = max(1, round(cw * scale)), max(1, round(ch * scale))
    resized = im.resize((nw, nh), Image.Resampling.LANCZOS)
    canvas = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    canvas.paste(resized, ((size - nw) // 2, size - nh - pad), resized)
    return canvas


def _render_bombard_sprite(size: int = 96) -> Image.Image:
    """Render a crisp 2D isometric 15th-century iron siege bombard on oak carriage."""
    s = size * 2
    im = Image.new('RGBA', (s, s), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    # Shadow
    d.ellipse([26, 134, 168, 174], fill=(18, 18, 16, 110))
    # Back wheel
    d.ellipse([54, 96, 108, 150], fill=(78, 52, 30, 255), outline=(36, 22, 12, 255), width=4)
    d.ellipse([72, 114, 90, 132], fill=(56, 56, 62, 255))
    # Oak trail carriage
    d.polygon([(30, 144), (118, 106), (132, 120), (42, 158)], fill=(116, 78, 42, 255), outline=(44, 28, 14, 255))
    d.polygon([(36, 146), (118, 112), (122, 118), (40, 152)], fill=(142, 96, 52, 255))
    # Iron bombard barrel angled toward upper-right
    d.polygon([(66, 98), (144, 58), (158, 84), (78, 124)], fill=(54, 58, 66, 255), outline=(24, 26, 30, 255))
    # Barrel highlight
    d.polygon([(70, 100), (144, 62), (149, 71), (75, 109)], fill=(96, 104, 116, 255))
    # Brass reinforcing bands
    for u in (0.28, 0.56, 0.84):
        bx = 72 + (150 - 72) * u
        by = 110 + (71 - 110) * u
        d.line([(bx - 6, by - 13), (bx + 6, by + 13)], fill=(198, 154, 68, 255), width=6)
    # Muzzle bore
    d.ellipse([140, 58, 160, 86], fill=(24, 24, 28, 255), outline=(110, 118, 128, 255), width=3)
    # Front spoked wheel
    d.ellipse([86, 104, 144, 162], fill=(94, 62, 34, 255), outline=(38, 24, 12, 255), width=4)
    d.ellipse([94, 112, 136, 154], fill=(0, 0, 0, 0), outline=(64, 42, 22, 255), width=3)
    for ang in range(0, 180, 45):
        import math
        rad = math.radians(ang)
        cx, cy, r = 115, 133, 21
        d.line([(cx - math.cos(rad) * r, cy - math.sin(rad) * r), (cx + math.cos(rad) * r, cy + math.sin(rad) * r)], fill=(124, 84, 48, 255), width=3)
    d.ellipse([107, 125, 123, 141], fill=(160, 132, 72, 255), outline=(40, 28, 16, 255), width=2)
    return im.resize((size, size), Image.Resampling.LANCZOS)


def extract_siege_and_extra_sprites(assets: dict):
    """Extract 2D isometric siege equipment, fortress structures, and green-screen unit extras."""
    # 1. Green-screen 4-frame strips (idle, walk, attack, hit/rout)
    dl = Path.home() / 'Downloads'
    gs_specs = {
        'bronze_spear': (dl / 'Bronze Spearman Sprite Sheet.png', [(0, 0), (0, 2), (1, 2), (2, 4)]),
        'knight_elite': (dl / 'Fantasy Knight Combat Sprite Sheet.png', [(0, 0), (1, 2), (2, 4), (3, 7)]),
    }
    for key, (path, picks) in gs_specs.items():
        url = extract_green_screen_strip(path, key, picks)
        if url:
            assets[key] = url

    # 2. Siege engines & fortress sprites
    castle_zip = ROOT / 'assets' / 'packs' / 'kenney_castle-kit.zip'
    if castle_zip.exists():
        with zipfile.ZipFile(castle_zip) as zf:
            for key, member in (
                ('siege_ram', 'Previews/siege-ram.png'),
                ('siege_catapult', 'Previews/siege-catapult.png'),
                ('siege_wall', 'Previews/wall.png'),
            ):
                if member in zf.namelist():
                    with zf.open(member) as f:
                        im = _fit_rgba_canvas(Image.open(f).convert('RGBA'), 96, 6)
                        assets[key] = save_webp(im, key)

    assets['siege_bombard'] = save_webp(_render_bombard_sprite(96), 'siege_bombard')

    gate_src = ROOT / 'assets' / 'hometown' / 'sprites' / 'gatehouse.webp'
    if gate_src.exists():
        gate_im = _fit_rgba_canvas(Image.open(gate_src).convert('RGBA'), 120, 6)
        assets['siege_gate'] = save_webp(gate_im, 'siege_gate')
    elif (ROOT / 'assets' / 'castle.png').exists():
        gate_im = _fit_rgba_canvas(Image.open(ROOT / 'assets' / 'castle.png').convert('RGBA'), 120, 6)
        assets['siege_gate'] = save_webp(gate_im, 'siege_gate')

    tower_src = ROOT / 'assets' / 'hometown' / 'sprites' / 'watchtower.webp'
    if tower_src.exists():
        tower_im = _fit_rgba_canvas(Image.open(tower_src).convert('RGBA'), 120, 6)
        assets['siege_tower'] = save_webp(tower_im, 'siege_tower')

    rubble_src = ROOT / 'assets' / 'TileObjectsRubbleWalls.png'
    if rubble_src.exists():
        rw = Image.open(rubble_src).convert('RGBA')
        # Composite broken masonry wall (5,0) + low stone rubble (2,1)
        broken = rw.crop((0, 5 * 128, 128, 6 * 128))
        rubble = rw.crop((1 * 128, 2 * 128, 2 * 128, 3 * 128))
        comp = Image.new('RGBA', (128, 128), (0, 0, 0, 0))
        comp.paste(broken, (0, -6), broken)
        comp.paste(rubble, (0, 6), rubble)
        assets['siege_gate_breached'] = save_webp(_fit_rgba_canvas(comp, 120, 6), 'siege_gate_breached')
    elif (OUT / 'siege_gate_breached.webp').exists():
        assets['siege_gate_breached'] = 'assets/battle/sprites/siege_gate_breached.webp'


def main():
    extras = extract_particles_and_strips()
    extract_siege_and_extra_sprites(extras)
    units = {}
    built_cache = {}

    for key, (sid, fw, fh) in DEFAULT_SHEETS.items():
        cache_key = (sid, fw, fh)
        strip = built_cache.get(cache_key)
        if strip is None:
            strip = slice_strip(sid, fw, fh)
            built_cache[cache_key] = strip
        units[key] = {'url': save_webp(strip, key), 'frames': len(FRAME_COORDS), 'frameW': fw, 'frameH': fh}

    cultures = {}
    for cult, spec_map in CULTURE_SHEETS.items():
        cultures[cult] = {}
        for ukey, (sid, fw, fh) in spec_map.items():
            strip = slice_strip(sid, fw, fh)
            rel = f'cultures/{cult}-{ukey}'
            cultures[cult][ukey] = {'url': save_webp(strip, rel), 'frames': len(FRAME_COORDS), 'frameW': fw, 'frameH': fh}

    data = {'version': 2, 'units': units, 'cultures': cultures, 'extras': extras}
    (OUT / 'manifest.json').write_text(json.dumps(data, indent=2) + '\n')
    print(f'Extracted {len(units)} default unit strips, {sum(len(v) for v in cultures.values())} civilization unit strips across {len(cultures)} cultures, and {len(extras)} FX sprites.')


if __name__ == '__main__':
    main()
