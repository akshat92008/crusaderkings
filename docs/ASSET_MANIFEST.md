# Asset sourcing and license record

Research date: **23 November 2026**. Links to the authors' own pages were prioritized. **Only Natural Earth map data and original procedural geometry/icon are currently bundled.** All other sources in this list are recommendations for future art integration, not claims that the files have been downloaded or integrated.

| Required category | Asset source | Confirmed license/status | Prototype integration | Production notes |
|---|---|---|---|---|
| World landmass/coastline | [Natural Earth](https://www.naturalearthdata.com/downloads/110m-cultural-vectors/) · [terms](https://www.naturalearthdata.com/about/terms-of-use/) | Public domain | **Bundled**: `assets/naturalearth/`, `data/world.json` | Only coastline/continental outlines are sourced. Political cells are synthetic. |
| Medieval 3D castle props | [Kenney Castle Kit](https://kenney.nl/assets/castle-kit) | CC0 on pack page | **Researched, not bundled** | High priority for proper fortress sieges; import GLB/OBJ as appropriate and record exact downloaded version. |
| 2D strategy/RTS icons and buildings | [Kenney Medieval RTS](https://kenney.nl/assets/medieval-rts) | CC0 on pack page | Researched, not bundled | For construction and army unit symbols. |
| Medieval villages/settlements | [Quaternius Medieval Village MegaKit](https://quaternius.com/) | Check **specific pack** for CC0; Quaternius also offers QAL license on some packs | Researched, not bundled | Do not assume every Quaternius pack is automatically CC0. Verify pack-specific license file and format. |
| Swords, shields, medieval weapons | [Quaternius LowPoly Medieval Weapons](https://quaternius.itch.io/lowpoly-medieval-weapons) | CC0 stated on pack page | Researched, not bundled | Can replace generic cuboid swords with real low-poly meshes. |
| Stone, grass, ground surfaces | [Poly Haven](https://polyhaven.com/) · [license](https://polyhaven.com/license) | CC0 site-wide | Researched, not bundled | Compress texture sets into WebP/KTX2 to avoid large browser bundles. |
| Medieval impacts/foley | [OpenGameArt medieval impacts](https://opengameart.org/content/medieval-sound-effects-weapon-impacts) | CC0 shown on this item | Researched, not bundled | Choose OGG/MP3 plus optional WAV source. Confirm each exact attachment license. |
| Medieval weapon material sounds | [OpenGameArt weapon textures](https://opengameart.org/content/medieval-sound-effects-weapon-textures) | CC0 shown on this item | Researched, not bundled | Different sounds for shields, armor, and cavalry. |
| Additional music | [OpenGameArt war theme](https://opengameart.org/content/war-theme) | CC0 shown on this item | Researched, not bundled | Check artistic fit and implement audio consent/mute control. |
| Historically faithful 1450 borders | [WhenAtlas open dataset](https://whenatlas.com/dataset), [Moving Polygons 1450 atlas](https://www.movingpolygons.com/atlas/world/1450), and primary historical sources | Cliopatria layers often CC BY 4.0; upstream provenance/coverage still requires verification | **Researched only; no geometry imported** | Check date exactness, data licensing and uncertain boundaries individually. Modern Natural Earth national borders MUST NOT be depicted as 1450. |
| Historical flags/sigils | Original artwork or individually checked public-domain archives | **Not verified** | Original geometric crown icon only | Avoid copying modern flags or third-party proprietary games' shields. |
| Historical rulers' portraits | Original commissions or explicitly licensed archival portrait scans | **Not verified** | Not in prototype | Accurate dating/cultural representation requires scholarly review. |
| Additional theater models | Dedicated period-specific asset creation required | **Not verified** | Procedural 3D soldiers and props | Distinguish infantry/armor per culture rather than universal medieval-European units. |

## License protocol for each future import

1. Open the **specific asset page** and record publisher, URL, pack/version, download date and exact license.
2. Inspect archive contents for `LICENSE`, `COPYING` or creator-specific permissions. Ignore ambiguous reposts when official creators' archives exist.
3. Import only files matching the approved licenses; append to this table with exact file paths.
4. Retain source/license metadata in `assets/THIRD_PARTY_CREDITS.md`. Avoid duplicating huge original ZIPs in a Git repository; transform to browser-friendly runtime assets.
5. If an asset is CC-BY, maintain attribution in-game and in credits; avoid NC assets and assets scraped from paid strategy games.

## Performance budget to aim for

- Campaign initial data + JS (compressed): ideally less than 2 MB.
- First battlefield art download: target less than 15 MB (textures, model instances, sound streaming separately).
- Desktop campaign target: 60 fps interactions; monthly AI under 30 ms on a mid-range laptop.
- Battlefield target: 30–60 fps with instancing, LOD, texture atlases, pooling, and limited independent AI agents.

The current geometric battle is intentionally asset-light and uses no model binaries. It is a mechanics/interaction proof, **not** the desired Total War-quality art pass.
