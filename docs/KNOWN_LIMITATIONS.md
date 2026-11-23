# Known limitations — prototype audit

## Implemented and tested

- 44 selectable civilizations, 299 synthetic provinces and bundled public-domain map geometry.
- Running economy, policies, construction, recruitment, adjacency-limited march, diplomacy and deterministic AI expansion.
- Tactical fighting, independent player/AI formations, routs, pause, retreat, projected 3D ground targeting, and applying manual battle results back to the campaign.
- Browser interface rendered in headless Chromium through an inlined-source smoke harness; no JavaScript page errors in the tested scenario.
- UI clicks checked for starting a game, advancing time, tax policy change, building/recruitment, saves (mock localStorage), opening a tactical battle, and returning after a victory (province count increased from 2 to 3).
- Seven Node.js simulation tests pass, including a 100-year fast-forward without numerical corruption.

## Not complete / must not be represented as complete

1. **Not historically exact**: map cells, faction territory, population and balance values are generated for gameplay testing. No verified GIS dataset of real 1450 borders has been integrated. Labels denote approximation.
2. **Not a full globe**: game uses a 2D equirectangular campaign map of real global landmasses. Not spherical globe or full 3D map.
3. **Not thousands of tactical agents**: battlefield has 12 controllable/simple formations with instanced low-poly box-shaped troops, not realistic siege formations or historically accurate cavalry/archer models. Camera/battle presentation are prototypes.
4. **No naval gameplay**: overseas logistics, colonization, harbors, naval battles and transoceanic travel not implemented.
5. **Limited AI**: AI has economy, recruitment and opportunistic border conflicts; not fully-planned strategy, dynamic diplomacy, or long-term dynastic politics.
6. **Limited politics**: policy levers and relation/alliances work, but dynastic marriages, royal families, trade treaties, claim fabrication, parliament, religion, espionage, and character personalities are not implemented.
7. **No multiplayer** or backend service. Local browser saves only, and save version 1 is not forward-compatible with future geometry/schema changes.
8. **No final art, sound, cinematics or UI accessibility audit.** External CC0 asset sources are documented but not bundled.
9. **Renderer testing**: Headless browser environment had **no WebGL2**, so the rendered battlefield screenshot uses the software perspective projection fallback. WebGL2 code passes syntax checks but was not GPU-render validated in that environment. Real-device GPU testing is required.
10. **No remote GitHub repository created or deployment** by this package alone. An actual remote requires user/account GitHub permissions to create a new repository and push files.
11. **Historical nuance**: some named factions correspond to decentralized networks/communities rather than single nation-states and need redesigned local political systems to reflect their structures properly.

## Development bar for public release

- Replace procedural political regions with researched historical provinces reviewed for 1450.
- Fix adjacency graph so connections are derived from shared real polygon borders and navigable straits, not 6-nearest-centroid shortcuts.
- Implement peace settlements, sieges, occupation, warscore, supply, proper AI strategic planning, and cross-continental naval logistics.
- Add actual character/dynasty systems, historical governmental differences, events, better economics and faction-specific content.
- Add gameplay accessibility options, tutorials, sound, performance instrumentation and browsers/device testing.
