# Crown of Nations: 1450 — Live Campaign Atlas

This visual atlas is rendered **inside the existing playable game**, not a static screenshot.

## Visible changes
- Illustrated, wood-framed medieval parchment map with shaded terrain and coastlines.
- Realm colors reflect changing game ownership when territories are conquered.
- Fine Voronoi-like decorative subdivisions create the detailed medieval atlas appearance. **These lines are not real historical counties**. Clicking and game logic continue to use the original playable provinces.
- Terrain symbols for mountains and forests, kingdom labels, capital settlements, compass rose, and movable army banners.
- Old World camera preset shows Europe, North Africa and much of Asia.
- Full Atlas expands the political map and hides sidebars temporarily.
- Historical mode overlays 133 dated polity polygons from the Cliopatria 1450 dataset. It is an independent incomplete reference layer, not the game's province graph.

## Sources and license
- The historical polygon extract originates from user-supplied Cliopatria / Seshat data, CC BY 4.0. [Source repository](https://github.com/Seshat-Global-History-Databank/cliopatria). Preserve this attribution and check the underlying record provenance before final historical distribution.
- Natural Earth geographic boundaries are public domain. Decorative textures, fine cell lines and ornaments were authored for this game.
- Existing 299 playable provinces are procedurally defined and do not represent verified 1450 historical counties or nation boundaries. The 133 reference polities are not complete global coverage.

## Verification
- Node syntax and unit tests run on GitHub Actions.
- Browser validation loads the actual game, begins a faction, tests each mode, full-map rendering, zoom, save and month progression. Four screenshots of the actual runtime are generated in docs/atlas-*.png.
- In browsers with WebGL2 the campaign's relief renderer can use locally generated terrain images when external textures are absent. This relief is stylized and is not scientific terrain elevation.
- Existing economy, diplomacy, province selection, saves and battle mechanics remain intact.

## What is still not finished
- Deep historical 1450 province/realm accuracy and full worldwide coverage.
- Rigged KayKit infantry, archers, horse-rider animation, terrain LOD and visual art consistency.
- Region-specific buildings and armies for all civilizations, advanced siege and naval mechanics, dynasties and courts, AI and balancing.
- Extensive performance testing with GPU and large battles, tutorial and release polish.

The goal here is a visible playable improvement to the existing map, not a claim that the full game is complete.