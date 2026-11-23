# Milestone 03 — Animated 3D Armies

## Delivered to the playable browser game
- The original campaign, political atlas, combat simulation, diplomacy, save/load and battle transitions remain intact.
- Real rigged KayKit Knight and Rogue Hooded characters replace the geometric infantry/archer soldiers when WebGL2 works and both local GLBs load.
- Characters have 76 embedded animation clips each; the runtime picks idle, locomotion and attack actions and advances separate AnimationMixers per visual soldier.
- Cavalry use the KayKit Knight rig as a rider on an original, procedurally modeled horse with animated legs. These are not Quaternius horse models or finished riding animations.
- The skinned characters are arranged in formations that follow the existing BattleGame group positions and losses. For browser performance, visual soldier counts are limited; one model does not correspond to one of the hundreds of abstract troops.
- Native WebGL2 and Canvas2D fallbacks remain; the older geometric units render if model loading fails. Current 3D scene uses self-hosted Three.js, and there are no external CDN imports in the packaged release.

## Asset provenance
- Author: Kay Lousberg, official [KayKit Character Pack: Adventurers 1.0](https://github.com/KayKit-Game-Assets/KayKit-Character-Pack-Adventures-1.0)
- Source commit: 672074b73ba276876a19e8816ecdc5241817ab47
- License: CC0 1.0 Universal, copied at assets/battle/characters/LICENSE.txt
- Vendored files: Knight.glb, Rogue_Hooded.glb
- The script scripts/build_3d_battle.mjs fetches those exact files, checks the binary headers and licenses, and compiles a local Three.js bundle.
- The user previously uploaded a newer 2.0 pack, but this milestone intentionally uses the creator's public pinned 1.0 source to make the build reproducible. No paid or gated tiers are used.

## Verification (23–24 November 2026)
- GitHub Node CI: 16 tests and syntax checks passed before merge.
- Chromium with SwiftShader/WebGL2: browser smoke test succeeded.
- Browser confirmed 12 formations with 116 skinned animation mixers, and 76 animation clips loaded for each KayKit character type.
- Actual GLB file responses were 200, sizes 3,659,532 bytes and 3,597,652 bytes, with glTF signatures.
- Actual rendered gameplay screenshot: docs/battle-real-kaykit-3d.png.
- Browser test checked unit movement and absence of page-level errors.
- **No frame-time/FPS or visual-quality approval on the target player's hardware yet.** GPU-backed Mac/browser checks remain needed.

## Remaining work
1. Replace the procedural horse with a true optimized animated horse and proper rider/mount retargeting, including mounted combat/charge animations.
2. Integrate the uploaded modular medieval settlement/castle assets, siege equipment, and culturally specific architecture into the 3D renderer with correct art direction, LODs and licenses.
3. Add robust formations, morale/fatigue, flanking, charge impact, pathfinding, archer line-of-sight, sieges and tactical enemy AI.
4. Finish the historically sourced campaign world map, counties, dynasties, courts, diplomacy, trade, navies and AI.
5. Optimize battle visuals and benchmark multiple browsers/devices before calling the game polished or complete.

## Running locally
- From the root: python3 -m http.server 8080; open http://localhost:8080
- To reproduce the source-verified asset bundle: npm ci && npm run build:battle
- Build the shareable preview ZIP with python3 scripts/package_playable.py.
