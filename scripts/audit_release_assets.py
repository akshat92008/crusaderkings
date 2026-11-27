#!/usr/bin/env python3
"""Machine-generated asset, sprite, pack, and narrative content audit.

Inspects tracked files under `assets/` and `src/content/`, computes exact file
counts, byte totals, formats, image dimensions, SHA-256 checksums, Downloads
integration status, and live event/mandate counts, then writes docs/ASSET_MANIFEST.md.
"""
from __future__ import annotations

from collections import Counter, defaultdict
from datetime import datetime, timezone
import hashlib
import json
from pathlib import Path
import subprocess
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'docs' / 'ASSET_MANIFEST.md'
IMAGE_EXTS = {'.webp', '.png', '.jpg', '.jpeg', '.gif'}


def git_tracked_files(*paths: str) -> list[Path]:
    raw = subprocess.check_output(
        ['git', '-c', 'core.quotePath=false', 'ls-files', '-z', *paths],
        cwd=ROOT,
    )
    items = [p for p in raw.decode('utf-8', errors='replace').split('\0') if p]
    return [ROOT / p for p in sorted(items) if (ROOT / p).is_file()]


def untracked_asset_files() -> list[Path]:
    raw = subprocess.check_output(
        ['git', '-c', 'core.quotePath=false', 'ls-files', '--others', '--exclude-standard', '-z', 'assets'],
        cwd=ROOT,
    )
    items = [p for p in raw.decode('utf-8', errors='replace').split('\0') if p]
    return [ROOT / p for p in sorted(items) if (ROOT / p).is_file()]


def sha256_file(path: Path) -> str:
    h = hashlib.sha256()
    with path.open('rb') as f:
        while chunk := f.read(65536):
            h.update(chunk)
    return h.hexdigest()


def human_bytes(n: int) -> str:
    if n < 1024:
        return f'{n} B'
    if n < 1024 * 1024:
        return f'{n / 1024:.1f} KB'
    return f'{n / (1024 * 1024):.2f} MB'


def asset_bucket(rel: Path) -> str:
    parts = rel.parts
    if len(parts) < 2:
        return 'assets (root)'
    if parts[1] == 'battle' and len(parts) >= 4 and parts[2] == 'sprites' and parts[3] == 'cultures':
        return 'assets/battle/sprites/cultures'
    if parts[1] == 'battle' and len(parts) >= 3 and parts[2] == 'sprites':
        return 'assets/battle/sprites'
    if parts[1] == 'ui' and len(parts) >= 3 and parts[2] == 'parchment':
        return 'assets/ui/parchment'
    if len(parts) == 2:
        return 'assets (root)'
    return f'assets/{parts[1]}'


def inspect_image_dims(files: list[Path]) -> tuple[Counter, list[str]]:
    dims = Counter()
    errors = []
    for p in files:
        if p.suffix.lower() not in IMAGE_EXTS:
            continue
        try:
            with Image.open(p) as im:
                dims[f'{im.width}x{im.height}'] += 1
        except Exception as exc:
            errors.append(f'{p.relative_to(ROOT)}: {exc}')
    return dims, errors


def query_content_counts() -> dict:
    script = """
    import fs from 'node:fs';
    import * as exp from './src/expanded-content.js';
    import * as em from './src/emergent-content.js';
    const files = fs.readdirSync('src/content').filter(f => f.endsWith('.js')).sort().map(f => {
      const src = fs.readFileSync('src/content/' + f, 'utf8');
      const lines = src.split(/\\r?\\n/).length;
      return { file: f, bytes: Buffer.byteLength(src, 'utf8'), lines };
    });
    console.log(JSON.stringify({
      stats: exp.allContentStats(),
      counts: {
        baselineEvents: exp.EVENTS.length,
        sovereignEvents: exp.SOVEREIGN_CONTENT_EVENTS.length,
        expandedEvents: exp.ALL_EVENTS.length,
        baselineDecisions: exp.DECISIONS.length,
        expandedDecisions: exp.ALL_DECISIONS.length,
        emergentEvents: em.EMERGENT_EVENTS.length,
        extendedEmergentEvents: em.EXTENDED_EMERGENT_EVENTS.length,
        extendedReactiveEvents: em.EXTENDED_REACTIVE_EVENTS.length,
        emergentDecisions: em.EMERGENT_DECISIONS.length,
        extendedEmergentDecisions: em.EXTENDED_EMERGENT_DECISIONS.length,
      },
      contentFiles: files
    }));
    """
    out = subprocess.check_output(['node', '--input-type=module', '-e', script], cwd=ROOT, text=True)
    return json.loads(out)


def main() -> None:
    tracked_assets = git_tracked_files('assets')
    tracked_content = git_tracked_files('src/content')
    untracked_assets = untracked_asset_files()

    by_bucket: dict[str, list[Path]] = defaultdict(list)
    for p in tracked_assets:
        by_bucket[asset_bucket(p.relative_to(ROOT))].append(p)

    bucket_order = [
        'assets/game-art',
        'assets/battle/sprites',
        'assets/battle/sprites/cultures',
        'assets/ui/parchment',
        'assets/ui',
        'assets/hometown',
        'assets/icons',
        'assets/audio',
        'assets/branding',
        'assets/packs',
    ]
    remaining = sorted(k for k in by_bucket if k not in bucket_order)
    ordered_buckets = [b for b in bucket_order if b in by_bucket] + remaining

    battle_manifest = json.loads((ROOT / 'assets/battle/sprites/manifest.json').read_text('utf-8'))
    hometown_manifest = json.loads((ROOT / 'assets/hometown/manifest.json').read_text('utf-8'))
    game_art_manifest = json.loads((ROOT / 'assets/game-art/manifest.json').read_text('utf-8'))

    key_hash_targets = [
        'assets/battle/sprites/manifest.json',
        'assets/battle/sprites/infantry.webp',
        'assets/battle/sprites/heavy_infantry.webp',
        'assets/battle/sprites/pikemen.webp',
        'assets/battle/sprites/archers.webp',
        'assets/battle/sprites/gunpowder.webp',
        'assets/battle/sprites/cavalry.webp',
        'assets/battle/sprites/commander.webp',
        'assets/battle/sprites/elephants.webp',
        'assets/hometown/manifest.json',
        'assets/game-art/manifest.json',
        'assets/ui/kenney_fantasy-ui-borders.zip',
        'assets/ui/kenney_ui-pack.zip',
        'assets/ui/game-icons.net.svg.zip',
        'assets/audio/kenney_impact-sounds.zip',
        'assets/audio/kenney_interface-sounds.zip',
        'assets/packs/kenney_castle-kit.zip',
        'assets/packs/kenney_particle-pack.zip',
        'assets/packs/KayKit_Adventurers_2.0_FREE.zip',
        'assets/packs/KayKit_Character_Animations_1.1.zip',
        'assets/packs/medieval-colony-hd-isometric-city-builder-tileset-free.zip',
    ]

    downloads_dir = Path.home() / 'Downloads'
    packs_dir = ROOT / 'assets/packs'
    pack_files = sorted(p for p in packs_dir.iterdir() if p.is_file()) if packs_dir.is_dir() else []
    archive_exts = {'.zip', '.rar', '.7z'}
    tracked_pack_names = {p.name for p in tracked_assets if p.suffix.lower() in archive_exts}
    all_pack_names = {p.name for p in [*tracked_assets, *untracked_assets] if p.suffix.lower() in archive_exts}

    if downloads_dir.is_dir():
        dl_files = {p.name: p for p in downloads_dir.iterdir() if p.is_file()}
        matched_packs = sorted(name for name in all_pack_names if name in dl_files)
        unmatched_packs = sorted(name for name in all_pack_names if name not in dl_files)
        game_keywords = ('kenney', 'village', 'foozle', 'medieval', 'parchment', 'sovereign', 'cliopatria', 'isometric', 'kaykit')
        dl_candidates = sorted(
            name for name in dl_files
            if any(kw in name.lower() for kw in game_keywords) and Path(name).suffix.lower() in archive_exts
        )
        not_integrated = [name for name in dl_candidates if name not in all_pack_names]
        downloads_available = True
    else:
        matched_packs, unmatched_packs, dl_candidates, not_integrated = [], [], [], []
        downloads_available = False

    content_info = query_content_counts()
    stats = content_info['stats']
    counts = content_info['counts']

    total_bytes = sum(p.stat().st_size for p in tracked_assets)
    generated_at = datetime.now(timezone.utc).strftime('%Y-%m-%dT%H:%M:%SZ')

    lines: list[str] = [
        '# Asset & Content Manifest — Sovereign: 1450',
        '',
        '> **Machine-generated audit** produced by `python3 scripts/audit_release_assets.py`.',
        f'> Audit timestamp (UTC): `{generated_at}`',
        '',
        '## 1. Tracked Asset Summary (`assets/`)',
        '',
        f'- **Total tracked files under `assets/`:** `{len(tracked_assets)}` ({human_bytes(total_bytes)})',
        f'- **Tracked `src/content/` modules:** `{len(tracked_content)}`',
        f'- **Local untracked files under `assets/` (excluded from tracked counts):** `{len(untracked_assets)}`',
        '',
        '| Category | Tracked Files | Total Size | Formats | Sprite / Image Dimensions (WxH) |',
        '| :--- | ---: | ---: | :--- | :--- |',
    ]

    dim_errors: list[str] = []
    for bucket in ordered_buckets:
        files = by_bucket[bucket]
        b_size = sum(p.stat().st_size for p in files)
        fmt_counts = Counter((p.suffix.lower() or '<none>') for p in files)
        fmt_str = ', '.join(f'`{ext}` ({cnt})' for ext, cnt in fmt_counts.most_common())
        dims, errs = inspect_image_dims(files)
        dim_errors.extend(errs)
        if dims:
            top_dims = dims.most_common(6)
            dim_str = ', '.join(f'`{d}` ({c})' for d, c in top_dims)
            if len(dims) > 6:
                dim_str += f' (+{len(dims) - 6} more)'
        else:
            dim_str = '—'
        lines.append(f'| `{bucket}` | {len(files)} | {human_bytes(b_size)} | {fmt_str} | {dim_str} |')

    lines.extend([
        '',
        '## 2. Runtime Manifest Verification',
        '',
        f'- **2D Banner Lines (`assets/battle/sprites/manifest.json` v{battle_manifest.get("version")}):** '
        f'`{len(battle_manifest.get("units", {}))}` default unit sheets, '
        f'`{len(battle_manifest.get("cultures", {}))}` culture rosters '
        f'(`{sum(len(v) for v in battle_manifest.get("cultures", {}).values())}` culture-unit sheets), '
        f'`{len(battle_manifest.get("extras", {}))}` FX sprites.',
        f'- **2D Living Capital (`assets/hometown/manifest.json` v{hometown_manifest.get("version")}):** '
        f'`{len(hometown_manifest.get("sprites", {}))}` building sprites, '
        f'`{len(hometown_manifest.get("extras", {}))}` prop/FX sprites, '
        f'`{len(hometown_manifest.get("sources", {}))}` recorded source mappings.',
        f'- **Game Art (`assets/game-art/manifest.json`):** '
        f'portraits `{game_art_manifest.get("portraits")}`, '
        f'events `{game_art_manifest.get("events")}`, '
        f'realms `{game_art_manifest.get("realms")}`, '
        f'dynasties `{game_art_manifest.get("dynasties")}`, '
        f'ui `{game_art_manifest.get("ui")}`.',
        '',
        '### 2.1 Battle Sprite Sheet Frame Geometry (`assets/battle/sprites/manifest.json`)',
        '',
        '| Unit Archetype | Frames | Frame Size (px) | Sheet File |',
        '| :--- | ---: | :--- | :--- |',
    ])
    for unit_key, meta in battle_manifest.get('units', {}).items():
        lines.append(
            f'| `{unit_key}` | {meta.get("frames")} | `{meta.get("frameW")}x{meta.get("frameH")}` | `{meta.get("url")}` |'
        )

    lines.extend([
        '',
        '## 3. SHA-256 Checksums for Key Sprite Packs, Manifests & Archives',
        '',
        '| File | Tracked | Size | SHA-256 |',
        '| :--- | :---: | ---: | :--- |',
    ])
    tracked_set = {p.resolve() for p in tracked_assets}
    for rel_str in key_hash_targets:
        p = ROOT / rel_str
        if not p.is_file():
            continue
        is_tr = 'Yes' if p.resolve() in tracked_set else 'No'
        lines.append(f'| `{rel_str}` | {is_tr} | {human_bytes(p.stat().st_size)} | `{sha256_file(p)}` |')

    lines.extend([
        '',
        '## 4. Downloads & Source Archive Integration Status',
        '',
    ])
    if downloads_available:
        lines.extend([
            f'- **Host `~/Downloads` directory:** scanned (`{len(dl_files)}` top-level files).',
            f'- **Tracked archive packs across `assets/`:** `{len(tracked_pack_names)}` (all archives including untracked local packs: `{len(all_pack_names)}`).',
            f'- **Archive packs matched in `~/Downloads`:** `{len(matched_packs)} / {len(all_pack_names)}`.',
            f'- **Archive packs in `assets/` with no matching filename in `~/Downloads`:** `{len(unmatched_packs)}` '
            + (f'({", ".join(f"`{x}`" for x in unmatched_packs[:8])}{" ..." if len(unmatched_packs) > 8 else ""})' if unmatched_packs else '(none)'),
            f'- **Game-related archives in `~/Downloads` not in `assets/` archives:** `{len(not_integrated)}` '
            + (f'({", ".join(f"`{x}`" for x in not_integrated)})' if not_integrated else '(none)'),
        ])
    else:
        lines.append('- **Host `~/Downloads` directory:** unavailable on this build host (skipping local workstation cross-check).')

    if untracked_assets:
        lines.extend([
            '',
            '### 4.1 Local Untracked Assets (Excluded from Tracked Totals)',
            '',
            '| Local Path | Size | Format |',
            '| :--- | ---: | :--- |',
        ])
        for p in untracked_assets:
            lines.append(f'| `{p.relative_to(ROOT)}` | {human_bytes(p.stat().st_size)} | `{p.suffix.lower() or "<dir>"}` |')

    lines.extend([
        '',
        '## 5. Narrative Event & Mandate Content Audit (`src/content/`)',
        '',
        f'- **Total unique events (`allContentStats().totalEvents`):** `{stats["totalEvents"]}` '
        f'(Baseline `{counts["baselineEvents"]}` + Sovereign Packs `{counts["sovereignEvents"]}` = Expanded `{stats["expandedEvents"]}`; '
        f'plus Emergent `{stats["emergentEvents"]}` = `{counts["emergentEvents"]}` baseline + `{counts["extendedEmergentEvents"]}` extended + `{counts["extendedReactiveEvents"]}` reactive)',
        f'- **Total unique mandates / decisions (`allContentStats().totalDecisions`):** `{stats["totalDecisions"]}` '
        f'(Expanded Decisions & Mandates `{stats["expandedDecisions"]}` + Emergent Decisions `{stats["emergentDecisions"]}` = `{counts["emergentDecisions"]}` baseline + `{counts["extendedEmergentDecisions"]}` extended)',
        '',
        '| Content Module | Size | Lines |',
        '| :--- | ---: | ---: |',
    ])
    for cf in content_info['contentFiles']:
        lines.append(f'| `src/content/{cf["file"]}` | {human_bytes(cf["bytes"])} | {cf["lines"]} |')

    if dim_errors:
        lines.extend(['', '## 6. Image Inspection Warnings', ''])
        lines.extend(f'- `{err}`' for err in dim_errors)

    OUT.write_text('\n'.join(lines) + '\n', encoding='utf-8')
    print(
        f'Wrote {OUT.relative_to(ROOT)}: {len(tracked_assets)} tracked asset files '
        f'({human_bytes(total_bytes)}), {stats["totalEvents"]} events, {stats["totalDecisions"]} decisions/mandates.'
    )


if __name__ == '__main__':
    main()
