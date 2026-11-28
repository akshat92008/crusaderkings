# Asset & Content Manifest — Sovereign: 1450

> **Machine-generated audit** produced by `python3 scripts/audit_release_assets.py`.
> Audit timestamp (UTC): `2026-11-27T20:06:22Z`

## 1. Tracked Asset Summary (`assets/`)

- **Total tracked files under `assets/`:** `2435` (1991.75 MB)
- **Tracked `src/content/` modules:** `14`
- **Local untracked files under `assets/` (excluded from tracked counts):** `6`

| Category | Tracked Files | Total Size | Formats | Sprite / Image Dimensions (WxH) |
| :--- | ---: | ---: | :--- | :--- |
| `assets/game-art` | 537 | 10.01 MB | `.webp` (536), `.json` (1) | `239x320` (256), `192x192` (160), `768x429` (84), `192x81` (16), `143x192` (16), `384x215` (4) |
| `assets/battle/sprites` | 26 | 158.7 KB | `.webp` (25), `.json` (1) | `384x96` (7), `96x96` (7), `64x64` (4), `120x120` (3), `472x102` (2), `512x110` (1) (+1 more) |
| `assets/battle/sprites/cultures` | 91 | 970.6 KB | `.webp` (91) | `384x96` (66), `472x102` (19), `512x110` (6) |
| `assets/ui/parchment` | 5 | 172.4 KB | `.webp` (5) | `1024x1024` (5) |
| `assets/ui` | 3 | 5.51 MB | `.zip` (3) | — |
| `assets/hometown` | 50 | 545.9 KB | `.webp` (47), `.txt` (2), `.json` (1) | `114x135` (1), `101x99` (1), `134x140` (1), `44x65` (1), `128x197` (1), `250x266` (1) (+41 more) |
| `assets/icons` | 7 | 3.97 MB | `.jpg` (6), `.png` (1) | `1024x1024` (7) |
| `assets/audio` | 26 | 164.60 MB | `.mp3` (18), `.txt` (3), `.zip` (2), `.7z` (2), `.ogg` (1) | — |
| `assets/branding` | 4 | 619.7 KB | `.png` (3), `.webp` (1) | `180x180` (1), `192x192` (1), `512x512` (1), `960x540` (1) |
| `assets/packs` | 47 | 318.47 MB | `.zip` (39), `.rar` (6), `.txt` (2) | — |
| `assets (root)` | 24 | 3.65 MB | `.png` (16), `.txt` (3), `.svg` (3), `.css` (2) | `512x1024` (2), `500x422` (2), `178x141` (2), `175x140` (2), `178x137` (2), `305x222` (1) (+5 more) |
| `assets/battle` | 61 | 45.81 MB | `.glb` (44), `.webp` (11), `.txt` (2), `.jpg` (2), `.md` (1), `.json` (1) | `1280x720` (11), `1376x768` (2) |
| `assets/characters_3d` | 5 | 4.91 MB | `.glb` (3), `.txt` (1), `.zip` (1) | — |
| `assets/cliopatria` | 519 | 294.54 MB | `.png` (507), `.md` (4), `.ipynb` (3), `.py` (2), `<none>` (1), `.zip` (1), `.txt` (1) | `4800x2400` (507) |
| `assets/documents` | 5 | 293.78 MB | `.part00` (2), `.part01` (2), `.sh` (1) | — |
| `assets/gold_mine` | 6 | 10.54 MB | `.png` (6) | `1920x1080` (6) |
| `assets/heraldry` | 3 | 737.7 KB | `.svg` (3) | — |
| `assets/maps` | 4 | 178.70 MB | `.zip` (4) | — |
| `assets/medieval_village` | 936 | 166.27 MB | `.fbx` (176), `.mtl` (176), `.obj` (176), `.bin` (176), `.gltf` (176), `.png` (54), `.txt` (1), `.jpg` (1) | `2048x2048` (45), `512x512` (5), `4096x4096` (3), `1921x1081` (1), `1024x1024` (1) |
| `assets/models` | 5 | 16.85 MB | `.glb` (2), `.zip` (1), `.jpg` (1), `.png` (1) | `1920x1080` (2) |
| `assets/naturalearth` | 5 | 226.0 KB | `.cpg` (1), `.dbf` (1), `.prj` (1), `.shp` (1), `.shx` (1) | — |
| `assets/notes` | 6 | 316.6 KB | `.txt` (5), `.md` (1) | — |
| `assets/portraits` | 55 | 451.26 MB | `.png` (55) | `2752x1536` (22), `1792x2400` (18), `2048x2048` (13), `1024x1024` (1), `3168x1344` (1) |
| `assets/video` | 5 | 19.24 MB | `.mp4` (5) | — |

## 2. Runtime Manifest Verification

- **2D Banner Lines (`assets/battle/sprites/manifest.json` v2):** `8` default unit sheets, `13` culture rosters (`91` culture-unit sheets), `17` FX sprites.
- **2D Living Capital (`assets/hometown/manifest.json` v3):** `33` building sprites, `14` prop/FX sprites, `35` recorded source mappings.
- **Game Art (`assets/game-art/manifest.json`):** portraits `256`, events `84`, realms `64`, dynasties `64`, ui `68`.

### 2.1 Battle Sprite Sheet Frame Geometry (`assets/battle/sprites/manifest.json`)

| Unit Archetype | Frames | Frame Size (px) | Sheet File |
| :--- | ---: | :--- | :--- |
| `infantry` | 4 | `96x96` | `assets/battle/sprites/infantry.webp` |
| `heavy_infantry` | 4 | `96x96` | `assets/battle/sprites/heavy_infantry.webp` |
| `pikemen` | 4 | `96x96` | `assets/battle/sprites/pikemen.webp` |
| `archers` | 4 | `96x96` | `assets/battle/sprites/archers.webp` |
| `gunpowder` | 4 | `96x96` | `assets/battle/sprites/gunpowder.webp` |
| `commander` | 4 | `118x102` | `assets/battle/sprites/commander.webp` |
| `cavalry` | 4 | `118x102` | `assets/battle/sprites/cavalry.webp` |
| `elephants` | 4 | `128x110` | `assets/battle/sprites/elephants.webp` |

## 3. SHA-256 Checksums for Key Sprite Packs, Manifests & Archives

| File | Tracked | Size | SHA-256 |
| :--- | :---: | ---: | :--- |
| `assets/battle/sprites/manifest.json` | Yes | 17.3 KB | `d5ad7847807100b4a9ca9dfc10adef53620a67445024963ae32ce92c476972e3` |
| `assets/battle/sprites/infantry.webp` | Yes | 8.4 KB | `0e0b42c537192a05c3fe7e719db9ac833227481666588cb4fd9d5b9061892f22` |
| `assets/battle/sprites/heavy_infantry.webp` | Yes | 9.1 KB | `8da5d1110a0874b3afb52166730fdb88b965ea280255bfdf7d707a500489aad0` |
| `assets/battle/sprites/pikemen.webp` | Yes | 11.5 KB | `9072705c918e8b0b04128a48b7c792cc08b6c96cd9bfacf0e2ac245758e8a6c1` |
| `assets/battle/sprites/archers.webp` | Yes | 7.2 KB | `a028aaf00b98b0c77a30c0614a918c39990b2ea52a1497ae032ce75bc48e469b` |
| `assets/battle/sprites/gunpowder.webp` | Yes | 9.8 KB | `70086e4fd826fabb52a55f3d5671d07b2ed05d405163ad205541ebe053601c70` |
| `assets/battle/sprites/cavalry.webp` | Yes | 9.1 KB | `c120193982aa689696b2f4a054b72e58e0da97604fd628e3f50d748fae4ad976` |
| `assets/battle/sprites/commander.webp` | Yes | 12.3 KB | `7a580fdb7b5de282ca0e07ba974c606cf6836bdd9e4e82518b8791722f4ce13d` |
| `assets/battle/sprites/elephants.webp` | Yes | 16.0 KB | `7299c94eb15a576d22d1c72044463bc5841fde701596912ac215ed269599cb24` |
| `assets/hometown/manifest.json` | Yes | 5.5 KB | `9d66b8750fc1f3ce58deaa5b63b70f55de35d9f1fb0711087fc70867ce791201` |
| `assets/game-art/manifest.json` | Yes | 86 B | `0ddc7e43b8b876ad836202ecdf7fbd90331c36edec34e707d56f1d0640107f4f` |
| `assets/ui/kenney_fantasy-ui-borders.zip` | Yes | 350.4 KB | `59532da3bd61195a425585455b40baa6cbf1eda8227c42adcef31a535a737769` |
| `assets/ui/kenney_ui-pack.zip` | Yes | 1.17 MB | `a8a14a234911eb648c062622915c93e79e94e97cb7f9f375a70f6617f1174318` |
| `assets/ui/game-icons.net.svg.zip` | Yes | 3.99 MB | `3cab684ba7eade161d288d888dbefb69087c579ec292440d191f2a908ffa2770` |
| `assets/audio/kenney_impact-sounds.zip` | Yes | 782.1 KB | `029d734af1582474edf3a694d1b0cebc97c1c152f2f39fa34d4c2bafc5de77f8` |
| `assets/audio/kenney_interface-sounds.zip` | Yes | 815.0 KB | `f2193d072726d6758a5f7871b2dcc54dcce0d5c35c6f0a62f92549b327c81232` |
| `assets/packs/kenney_castle-kit.zip` | Yes | 2.13 MB | `921f3f73927bb23106cae34bc21d5ab4b033a9fc120475e96f714a406e3169df` |
| `assets/packs/kenney_particle-pack.zip` | Yes | 14.31 MB | `b631d4b07f7002549fdcf155f01141ad482f79f3440e4e301eed49ce5f1d8958` |
| `assets/packs/KayKit_Adventurers_2.0_FREE.zip` | Yes | 12.42 MB | `abe48f4763fba0896bab486ee9e6d08ca6b5b3884b9601f235c8847ae94dc479` |
| `assets/packs/KayKit_Character_Animations_1.1.zip` | Yes | 14.17 MB | `65882f31f905ad2e953819648a59287cdeab8f623908d5ef701971d3758be20f` |
| `assets/packs/medieval-colony-hd-isometric-city-builder-tileset-free.zip` | Yes | 7.72 MB | `0a87a3e07466f8eca2c9e202a5afe3931d50464659209c78dfe0db7c36d47550` |

## 4. Downloads & Source Archive Integration Status

- **Host `~/Downloads` directory:** scanned (`1684` top-level files).
- **Tracked archive packs across `assets/`:** `59` (all archives including untracked local packs: `62`).
- **Archive packs matched in `~/Downloads`:** `61 / 62`.
- **Archive packs in `assets/` with no matching filename in `~/Downloads`:** `1` (`cliopatria.geojson.zip`)
- **Game-related archives in `~/Downloads` not in `assets/` archives:** `1` (`Meshy_AI_Sovereign_of_the_Eternal_Wheel_20261031_texture_fbx.zip`)

### 4.1 Local Untracked Assets (Excluded from Tracked Totals)

| Local Path | Size | Format |
| :--- | ---: | :--- |
| `assets/packs/City_Builder_Village_Buildings_part_1.zip` | 237.76 MB | `.zip` |
| `assets/packs/City_Builder_Village_Buildings_part_2.zip` | 209.33 MB | `.zip` |
| `assets/packs/Foozle_2DS0008_Isometric_Gold_Mine_1.zip` | 531.93 MB | `.zip` |
| `assets/terrain/natural-earth-relief-low.webp` | 44.3 KB | `.webp` |
| `assets/terrain/natural-earth-relief.webp` | 1.16 MB | `.webp` |
| `assets/terrain/terrain-height.png` | 1.09 MB | `.png` |

## 5. Narrative Event & Mandate Content Audit (`src/content/`)

- **Total unique events (`allContentStats().totalEvents`):** `3051` (Baseline `512` + Sovereign Packs `2379` = Expanded `2891`; plus Emergent `160` = `90` baseline + `60` extended + `10` reactive)
- **Total unique mandates / decisions (`allContentStats().totalDecisions`):** `437` (Expanded Decisions & Mandates `421` + Emergent Decisions `16` = `10` baseline + `6` extended)

| Content Module | Size | Lines |
| :--- | ---: | ---: |
| `src/content/events-ck2-dlc-epics.js` | 190.1 KB | 2413 |
| `src/content/events-ck2-world-court.js` | 188.9 KB | 2387 |
| `src/content/events-court-intrigue.js` | 16.9 KB | 237 |
| `src/content/events-crossroads.js` | 14.1 KB | 217 |
| `src/content/events-cultures-world.js` | 137.2 KB | 1700 |
| `src/content/events-dlc-lifestyles.js` | 28.8 KB | 386 |
| `src/content/events-economy-trade.js` | 174.8 KB | 2249 |
| `src/content/events-faith-society.js` | 142.7 KB | 1763 |
| `src/content/events-family-education.js` | 20.0 KB | 275 |
| `src/content/events-grand-chronicles.js` | 33.2 KB | 369 |
| `src/content/events-regions-global.js` | 20.3 KB | 287 |
| `src/content/events-siege-capital-dynasty.js` | 41.1 KB | 548 |
| `src/content/events-war-diplomacy.js` | 149.2 KB | 1972 |
| `src/content/mandates-decisions.js` | 24.3 KB | 180 |
