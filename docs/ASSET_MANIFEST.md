# Asset & Content Manifest — Sovereign: 1450

> **Machine-generated audit** produced by `python3 scripts/audit_release_assets.py`.
> Audit timestamp (UTC): `2026-11-27T14:13:30Z`

## 1. Tracked Asset Summary (`assets/`)

- **Total tracked files under `assets/`:** `2382` (1952.91 MB)
- **Tracked `src/content/` modules:** `8`
- **Local untracked files under `assets/` (excluded from tracked counts):** `3`

| Category | Tracked Files | Total Size | Formats | Sprite / Image Dimensions (WxH) |
| :--- | ---: | ---: | :--- | :--- |
| `assets/game-art` | 537 | 10.01 MB | `.webp` (536), `.json` (1) | `239x320` (256), `192x192` (160), `768x429` (84), `192x81` (16), `143x192` (16), `384x215` (4) |
| `assets/battle/sprites` | 26 | 154.9 KB | `.webp` (25), `.json` (1) | `384x96` (7), `64x64` (4), `96x96` (4), `96x53` (3), `120x120` (3), `472x102` (2) (+2 more) |
| `assets/battle/sprites/cultures` | 91 | 920.0 KB | `.webp` (91) | `384x96` (66), `472x102` (19), `512x110` (6) |
| `assets/ui/parchment` | 5 | 172.4 KB | `.webp` (5) | `1024x1024` (5) |
| `assets/ui` | 3 | 5.51 MB | `.zip` (3) | — |
| `assets/hometown` | 50 | 545.9 KB | `.webp` (47), `.txt` (2), `.json` (1) | `114x135` (1), `101x99` (1), `134x140` (1), `44x65` (1), `128x197` (1), `250x266` (1) (+41 more) |
| `assets/icons` | 7 | 3.97 MB | `.jpg` (6), `.png` (1) | `1024x1024` (7) |
| `assets/audio` | 26 | 164.60 MB | `.mp3` (18), `.txt` (3), `.zip` (2), `.7z` (2), `.ogg` (1) | — |
| `assets/branding` | 4 | 619.7 KB | `.png` (3), `.webp` (1) | `180x180` (1), `192x192` (1), `512x512` (1), `960x540` (1) |
| `assets/packs` | 47 | 318.47 MB | `.zip` (39), `.rar` (6), `.txt` (2) | — |
| `assets (root)` | 24 | 3.63 MB | `.png` (16), `.txt` (3), `.svg` (3), `.css` (2) | `512x1024` (2), `500x422` (2), `178x141` (2), `175x140` (2), `178x137` (2), `305x222` (1) (+5 more) |
| `assets/battle` | 8 | 7.04 MB | `.glb` (6), `.txt` (2) | — |
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
| `assets/battle/sprites/infantry.webp` | Yes | 8.7 KB | `e40ec327c7a30077bab168f27c902d528941538e97bdfdd05f75f58f2229aa24` |
| `assets/battle/sprites/heavy_infantry.webp` | Yes | 7.5 KB | `173cd4d55e08eaef2fa6cea159044043982e9a7410d57743168333c7cc7e0ee6` |
| `assets/battle/sprites/pikemen.webp` | Yes | 8.7 KB | `734328e476bfeaef4a963da3428c5ba1030a1e7ea4a205e65a061bc1252cfca6` |
| `assets/battle/sprites/archers.webp` | Yes | 8.7 KB | `c81178909f7c06fffcef692be8029a6282f6b2c17384ae26fab1b4005347c312` |
| `assets/battle/sprites/gunpowder.webp` | Yes | 9.4 KB | `7cedea1e930615d96f5349d70a648117555591e2dbeed22f7afbfa00cbef2cef` |
| `assets/battle/sprites/cavalry.webp` | Yes | 11.6 KB | `be523dad45a67a3553d57c688e8369b4be1a1dca64873836d027d14dbc9c62da` |
| `assets/battle/sprites/commander.webp` | Yes | 11.5 KB | `f28e75f6bde79ef6596d77145b7196b460bcac3137dd15e306a900c89a3dbc2b` |
| `assets/battle/sprites/elephants.webp` | Yes | 16.0 KB | `d38a5c183cd7e8634bee6e6299946e08515fc723b933cc80aa1fcc4ca674d1c6` |
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

- **Host `~/Downloads` directory:** scanned (`1682` top-level files).
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

## 5. Narrative Event & Mandate Content Audit (`src/content/`)

- **Total unique events (`allContentStats().totalEvents`):** `1071` (Baseline `512` + Sovereign Packs `399` = Expanded `911`; plus Emergent `160` = `90` baseline + `60` extended + `10` reactive)
- **Total unique mandates / decisions (`allContentStats().totalDecisions`):** `357` (Expanded Decisions & Mandates `341` + Emergent Decisions `16` = `10` baseline + `6` extended)

| Content Module | Size | Lines |
| :--- | ---: | ---: |
| `src/content/events-court-intrigue.js` | 16.9 KB | 237 |
| `src/content/events-crossroads.js` | 14.1 KB | 217 |
| `src/content/events-dlc-lifestyles.js` | 28.8 KB | 386 |
| `src/content/events-family-education.js` | 20.0 KB | 275 |
| `src/content/events-grand-chronicles.js` | 33.2 KB | 369 |
| `src/content/events-regions-global.js` | 20.3 KB | 287 |
| `src/content/events-siege-capital-dynasty.js` | 41.1 KB | 548 |
| `src/content/mandates-decisions.js` | 9.5 KB | 88 |
