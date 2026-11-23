# Milestone 02 — 3D Terrain Campaign Atlas

## What changed
- Native WebGL2 world heightfield under the selectable kingdom/province overlay (256×128 terrain grid, relief lighting and optional tilt).
- Natural Earth II public-domain shaded-relief texture with a separate **stylized** heightfield; **not** a surveyed DEM.
- 2D fallback displays the Natural Earth texture when no WebGL2 context is available.
- Kingdoms, Terrain and 1450 Historical Reference map modes, plus 3D/flat camera control.
- Optional 1450 Cliopatria geometry for 139 sourced features. This is a reference layer, **not** a complete global historical atlas and **not** the playable province geometry.
- Existing province selection, conquest, diplomacy, recruitment, construction, saving and battle entry/return are preserved.
- Deterministic asset generation scripts: scripts/build_terrain_assets.py and scripts/build_historical_overlay.py.

## Verification
- 12 Node tests pass on the complete local build, including 3 terrain-grid tests.
- JavaScript syntax checks pass.
- Offline Chromium smoke test passed the 44-faction launch, three modes, map coordinate round trip, turn progression, save, battle entry and return, and 0 JavaScript exceptions.
- Headless Chromium could **not** create WebGL2. The **GPU heightfield is not yet visually verified or performance-tested**. Screenshots in the separately packaged build illustrate the 2D fallback.

## Asset packaging caveat for this GitHub development branch
The ready-to-run [Milestone 02 downloadable archive] is separately supplied in the conversation and **contains** these three generated files:
- assets/terrain/natural-earth-relief.webp
- assets/terrain/terrain-height.png
- data/historical-1450-reference.geojson

The GitHub branch has the renderer, UI, tests, and generators, but **these generated binary/large data assets are not yet committed**. To produce a locally complete build on this branch, use the source archives supplied by the user:

```bash
python3 scripts/build_terrain_assets.py /path/to/NE2_50M_SR_W.zip
python3 scripts/build_historical_overlay.py /path/to/cliopatria_1450_active_raw.geojson
python3 -m http.server 8080
```

Python asset generation requires Pillow, NumPy, SciPy, Fiona, Rasterio and Shapely. No npm installation is needed to run the static game.

## Limitations and next work
- 299 playable province shapes remain artificial; borders do not equal verified 1450 political extents.
- History overlay is incomplete and independent of political ownership mechanics. Credit Cliopatria (CC BY 4.0); check provenance for release.
- Procedural height is a geographic approximation. Replace with real NOAA ETOPO elevation.
- WebGL2 has not been visually verified on hardware.
- Animated KayKit soldiers, cavalry, historical faction architecture, and true 3D map settlements remain future implementation milestones.
