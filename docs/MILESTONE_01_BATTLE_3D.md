# Milestone 01: Native 3D Battle Art

The existing campaign simulation, conquest flow, diplomacy, recruitment and saves remain intact.

## Implemented
- A dependency-free static GLB scenery parser/renderer using the existing native WebGL2 battle. The loader supports ordinary triangle primitives, nested node transforms, simple materials and embedded base-color textures.
- Scene placements for stone fort walls, gate, towers, a catapult, and optional South Indian temple architecture when Indian factions are involved.
- Optional local CC0 Kenney Castle Kit files under assets/battle/kenney/ when present. If these are not yet present, the stone wall attempts to use the preexisting source/low-ruined-wall-section-optimized.glb model, and the procedural fort remains visible. The local downloadable ZIP includes a compact Kenney subset.
- Additional low-poly instanced sphere/cylinder/cone mesh types for soldiers, trees and forts, replacing some of the former block-only silhouettes.
- WebGL2 and Canvas2D fallback paths; software rendering is throttled to reduce CPU use.

## Verified
- All 9 local automated tests passed (7 existing simulation tests, 2 GLB parser tests).
- Syntax checks passed.
- Browser smoke test launched campaign and battles, used laws, recruitment and construction, saved, and successfully returned from a battle with ownership updated, with no JS page errors.
- Static GLB parsing was tested on two uploaded scenes and selected Kenney castle GLBs.

## Not yet verified or complete
- The headless Chromium environment had no WebGL2, so full GPU shader/material rendering and on-device FPS are **not** verified.
- The Crusader Kings-style raised 3D world map has not been built; map is still Canvas2D.
- Infantry and cavalry are still low-poly geometry; KayKit skinned character animation is not yet connected.
- The 299 starting provinces are synthetic, not fully historical for 1450.
- Some source/ Indian architectural GLBs are large (2–12 MiB) and their provenance/license details still need checking before redistribution.
- Not all Kenney GLB binaries are yet committed to GitHub. Their CC0 subset ships in the downloadable ZIP.

## Credits
Kenney Castle Kit (CC0): https://kenney.nl/assets/castle-kit

## Next work
1. Verify the native WebGL2 path on a GPU-enabled browser.
2. Integrate KayKit rigged characters, combat animations and cavalry.
3. Build a terrain-height-based 3D campaign map and import verified historical political borders.
