"""Build painterly 2D isometric battlefield arena backdrops (.webp) with organic terrain, tracks, boulders, and edge foliage."""
from pathlib import Path
import math
import random
from PIL import Image, ImageDraw, ImageFilter
import numpy as np

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'assets' / 'battle' / 'arenas'
OUT.mkdir(parents=True, exist_ok=True)

W, H = 1280, 720


def _load_rgba(rel: str) -> Image.Image | None:
    p = ROOT / rel
    return Image.open(p).convert('RGBA') if p.exists() else None


def _noise_field(seed: int, w: int, h: int, scale: float) -> np.ndarray:
    rng = np.random.default_rng(seed)
    low = rng.normal(0.0, 1.0, (max(8, int(h * scale)), max(8, int(w * scale)))).astype(np.float32)
    low_im = Image.fromarray(((low * 0.25 + 0.5).clip(0, 1) * 255).astype(np.uint8)).resize((w, h), Image.Resampling.BICUBIC)
    return np.asarray(low_im, dtype=np.float32) / 255.0 - 0.5


def _render_arena(kind: str, tree_oak: Image.Image | None, tree_pine: Image.Image | None, rubble: Image.Image | None) -> Image.Image:
    presets = {
        'plains': {'seed': 101, 'base': (72, 97, 54), 'alt': (94, 118, 66), 'sky': (34, 48, 36), 'road': (116, 98, 68), 'trees': 'mixed', 'edge_trees': 20},
        'forest': {'seed': 202, 'base': (44, 72, 40), 'alt': (64, 94, 52), 'sky': (20, 36, 24), 'road': (92, 76, 52), 'trees': 'dense', 'edge_trees': 38},
        'hills': {'seed': 303, 'base': (86, 94, 60), 'alt': (114, 114, 76), 'sky': (42, 48, 36), 'road': (122, 108, 80), 'trees': 'pine', 'edge_trees': 14},
        'highlands': {'seed': 404, 'base': (78, 76, 60), 'alt': (102, 98, 78), 'sky': (38, 40, 38), 'road': (112, 102, 82), 'trees': 'pine', 'edge_trees': 12},
        'mountain': {'seed': 505, 'base': (82, 86, 90), 'alt': (112, 116, 120), 'sky': (34, 40, 48), 'road': (108, 106, 98), 'trees': 'pine', 'edge_trees': 10},
        'desert': {'seed': 606, 'base': (156, 122, 72), 'alt': (184, 148, 92), 'sky': (62, 46, 30), 'road': (136, 104, 62), 'trees': 'none', 'edge_trees': 0},
        'steppe': {'seed': 707, 'base': (114, 118, 64), 'alt': (142, 138, 80), 'sky': (50, 52, 34), 'road': (126, 110, 74), 'trees': 'scrub', 'edge_trees': 8},
        'coast': {'seed': 808, 'base': (70, 98, 76), 'alt': (146, 136, 98), 'sky': (30, 48, 52), 'road': (142, 128, 96), 'trees': 'mixed', 'edge_trees': 11},
        'marsh': {'seed': 909, 'base': (48, 74, 62), 'alt': (68, 92, 76), 'sky': (24, 38, 34), 'road': (84, 80, 62), 'trees': 'oak', 'edge_trees': 16},
        'siege_plains': {'seed': 1010, 'base': (78, 90, 58), 'alt': (102, 102, 72), 'sky': (32, 40, 32), 'road': (112, 104, 88), 'trees': 'mixed', 'edge_trees': 12},
        'siege_desert': {'seed': 1111, 'base': (148, 118, 74), 'alt': (172, 136, 88), 'sky': (58, 44, 30), 'road': (130, 110, 78), 'trees': 'none', 'edge_trees': 0},
    }
    cfg = presets[kind]
    rng = random.Random(cfg['seed'])

    # 1. Layered organic biome soil/grass earth texture (multi-scale painterly noise, zero harsh grid seams)
    y_norm = np.linspace(0.0, 1.0, H, dtype=np.float32).reshape(H, 1, 1)
    sky = np.array(cfg['sky'], dtype=np.float32).reshape(1, 1, 3)
    base = np.array(cfg['base'], dtype=np.float32).reshape(1, 1, 3)
    alt = np.array(cfg['alt'], dtype=np.float32).reshape(1, 1, 3)
    top_blend = np.clip((y_norm - 0.03) / 0.19, 0.0, 1.0)
    field = sky * (1.0 - top_blend) + base * top_blend

    n_broad = _noise_field(cfg['seed'], W, H, 0.008)[..., None]
    n_mid = _noise_field(cfg['seed'] + 17, W, H, 0.032)[..., None]
    n_grain = _noise_field(cfg['seed'] + 53, W, H, 0.14)[..., None]
    mix = np.clip(0.45 + n_broad * 0.85 + n_mid * 0.45 + n_grain * 0.22, 0.0, 1.0)
    field = np.where(y_norm > 0.12, field * (1.0 - mix * 0.65) + alt * (mix * 0.65), field)

    # Soft center warm sunlight wash
    x_norm = np.linspace(-1.0, 1.0, W, dtype=np.float32).reshape(1, W, 1)
    y_c = (y_norm - 0.50) * 1.4
    sun = np.exp(-(x_norm ** 2 * 1.1 + y_c ** 2 * 1.6)) * 14.0
    field = np.clip(field + sun, 0, 255)
    canvas = Image.fromarray(field.astype(np.uint8), 'RGB').convert('RGBA')

    # 2. Atmospheric distant horizon ridge silhouettes
    draw = ImageDraw.Draw(canvas, 'RGBA')
    for layer in range(3):
        pts = [(0, 150)]
        amp = 24 if kind in ('mountain', 'hills', 'highlands') else 14 if kind == 'desert' else 9
        for x in range(0, W + 32, 32):
            yy = 86 + layer * 16 + math.sin(x * 0.007 + layer * 2.2 + cfg['seed']) * amp + math.cos(x * 0.019 - layer) * (amp * 0.45)
            pts.append((x, yy))
        pts.extend([(W, 175), (0, 175)])
        shade = tuple(max(12, int(c * (0.66 + layer * 0.12))) for c in cfg['base']) + (190 - layer * 42,)
        draw.polygon(pts, fill=shade)

    # 3. Winding compacted dirt / cobblestone track (soft feathered edge, no dark outline stroke)
    road_layer = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    rd = ImageDraw.Draw(road_layer)
    road_pts = []
    for i in range(25):
        u = i / 24.0
        ry = int(118 + u * (H - 125))
        rx = int(W * 0.5 + math.sin(u * math.pi * 1.35 + 0.3) * (36 if 'siege' not in kind else 16))
        road_pts.append((rx, ry))
    rd.line(road_pts, fill=cfg['road'] + (105,), width=76, joint='curve')
    rd.line(road_pts, fill=cfg['road'] + (165,), width=44, joint='curve')
    road_layer = road_layer.filter(ImageFilter.GaussianBlur(6))
    canvas = Image.alpha_composite(canvas, road_layer)

    draw = ImageDraw.Draw(canvas, 'RGBA')
    if 'siege' in kind:
        # Subtle trampled siege mud & wheel ruts leading toward z=-18 wall line (y ~ 260)
        rut_layer = Image.new('RGBA', (W, H), (0, 0, 0, 0))
        rut_d = ImageDraw.Draw(rut_layer)
        rut_d.rectangle([160, 248, W - 160, 276], fill=(64, 58, 48, 95))
        rut_d.line([(290, 465), (540, 455)], fill=(58, 46, 32, 95), width=12)
        rut_d.line([(740, 455), (990, 465)], fill=(58, 46, 32, 95), width=12)
        canvas = Image.alpha_composite(canvas, rut_layer.filter(ImageFilter.GaussianBlur(5)))
        draw = ImageDraw.Draw(canvas, 'RGBA')

    if kind == 'coast':
        sea_layer = Image.new('RGBA', (W, H), (0, 0, 0, 0))
        sd = ImageDraw.Draw(sea_layer)
        sd.polygon([(910, 105), (W, 105), (W, H), (945, H), (885, 500), (875, 310)], fill=(34, 88, 110, 220))
        sd.line([(910, 105), (875, 310), (885, 500), (945, H)], fill=(232, 242, 224, 165), width=14)
        for wy in range(160, H - 55, 62):
            sd.arc([940, wy, 1235, wy + 24], start=15, end=155, fill=(215, 244, 250, 120), width=3)
        canvas = Image.alpha_composite(canvas, sea_layer.filter(ImageFilter.GaussianBlur(2)))
        draw = ImageDraw.Draw(canvas, 'RGBA')

    if kind == 'marsh':
        pool_layer = Image.new('RGBA', (W, H), (0, 0, 0, 0))
        pd = ImageDraw.Draw(pool_layer)
        for px, py, rx, ry in [(225, 425, 115, 38), (1015, 335, 120, 42), (285, 255, 85, 28)]:
            pd.ellipse([px - rx, py - ry, px + rx, py + ry], fill=(28, 64, 60, 175))
        canvas = Image.alpha_composite(canvas, pool_layer.filter(ImageFilter.GaussianBlur(4)))
        draw = ImageDraw.Draw(canvas, 'RGBA')

    if kind == 'desert':
        dune_layer = Image.new('RGBA', (W, H), (0, 0, 0, 0))
        dd = ImageDraw.Draw(dune_layer)
        for dx, dy, rx, ry in [(190, 320, 160, 44), (1055, 445, 175, 52), (220, 545, 140, 38)]:
            dd.chord([dx - rx, dy - ry, dx + rx, dy + ry], 180, 360, fill=(202, 164, 102, 115))
        canvas = Image.alpha_composite(canvas, dune_layer.filter(ImageFilter.GaussianBlur(7)))
        draw = ImageDraw.Draw(canvas, 'RGBA')

    # Subtle natural earth tufts / small pebbles across open ground
    for _ in range(95):
        px = rng.randint(40, W - 40)
        py = rng.randint(155, H - 50)
        if kind == 'coast' and px > 820:
            continue
        col = tuple(min(255, max(0, c + rng.randint(-16, 18))) for c in cfg['alt']) + (72,)
        draw.ellipse([px - rng.randint(5, 16), py - rng.randint(2, 6), px + rng.randint(5, 16), py + rng.randint(2, 6)], fill=col)

    # 4. Peripheral boulders & perimeter trees (keep central combat diamond & coastal ocean completely clear)
    if rubble:
        stone_tile = rubble.crop((128, 256, 256, 384)).resize((50, 50), Image.Resampling.LANCZOS)
        for _ in range(11 if kind in ('mountain', 'hills', 'highlands') else 4):
            rx = rng.randint(25, 200) if kind == 'coast' else rng.choice([rng.randint(25, 200), rng.randint(1065, W - 70)])
            ry = rng.randint(155, H - 85)
            canvas.paste(stone_tile, (rx, ry), stone_tile)

    sh_layer = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    sh_draw = ImageDraw.Draw(sh_layer)
    tree_placements = []
    for _ in range(cfg['edge_trees']):
        band = rng.random()
        if kind == 'coast':
            tx = rng.randint(24, 185) if band < 0.65 else rng.randint(35, 760)
            ty = rng.randint(155, H - 65) if band < 0.65 else rng.randint(120, 174)
        elif band < 0.38:
            tx = rng.randint(24, 190)
            ty = rng.randint(155, H - 65)
        elif band < 0.76:
            tx = rng.randint(W - 210, W - 36)
            ty = rng.randint(155, H - 65)
        else:
            tx = rng.randint(40, W - 40)
            ty = rng.randint(120, 174)
        timg = tree_pine if (cfg['trees'] == 'pine' or (cfg['trees'] == 'mixed' and rng.random() < 0.45)) else tree_oak
        if timg:
            sc = rng.uniform(0.55, 0.90) if cfg['trees'] != 'scrub' else rng.uniform(0.36, 0.50)
            nw, nh = max(24, int(timg.width * sc)), max(24, int(timg.height * sc))
            sh_draw.ellipse([tx - nw // 3, ty - 6, tx + nw // 3, ty + 8], fill=(12, 18, 12, 68))
            tree_placements.append((ty, tx, timg.resize((nw, nh), Image.Resampling.LANCZOS)))
    canvas = Image.alpha_composite(canvas, sh_layer.filter(ImageFilter.GaussianBlur(4)))
    for ty, tx, spr in sorted(tree_placements, key=lambda item: item[0]):
        canvas.paste(spr, (tx - spr.width // 2, ty - spr.height + 8), spr)

    # 5. Soft vignette around top/bottom HUD rails
    vig = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    vd = ImageDraw.Draw(vig)
    vd.rectangle([0, 0, W, 88], fill=(10, 14, 12, 118))
    vd.rectangle([0, H - 105, W, H], fill=(10, 14, 12, 140))
    canvas = Image.alpha_composite(canvas, vig.filter(ImageFilter.GaussianBlur(20)))
    return canvas.convert('RGB')


def main():
    tree_oak = _load_rgba('assets/hometown/sprites/tree_oak.webp')
    tree_pine = _load_rgba('assets/hometown/sprites/tree_pine.webp')
    rubble = _load_rgba('assets/TileObjectsRubbleWalls.png')
    kinds = ['plains', 'forest', 'hills', 'highlands', 'mountain', 'desert', 'steppe', 'coast', 'marsh', 'siege_plains', 'siege_desert']
    for k in kinds:
        _render_arena(k, tree_oak, tree_pine, rubble).save(OUT / f'{k}.webp', 'WEBP', quality=86, method=5)
    print(f'Generated {len(kinds)} painterly 2D isometric arena backdrops in {OUT.relative_to(ROOT)}')


if __name__ == '__main__':
    main()
