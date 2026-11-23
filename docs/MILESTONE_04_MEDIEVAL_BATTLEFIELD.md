# Milestone 04 — Medieval Battlefields and Instant Battle Showcase

## Implemented in the existing playable game

The real-time WebGL2 battle renderer uses a completely rebuilt environment instead of bare green geometric blocks. On the standard temperate battlefield the browser creates:

- A stone gate with portcullis, battlements, ramparts, roofed towers, banners, and side perimeter walls.
- A medieval village behind the gate (20 procedural multi-part houses in the standard seed), with pitched tiled roofs, chimneys, doors, narrow windows, lanes, and market stalls.
- Stone gate road, tinted height-free ground texturing, stone/wood/roof material textures generated locally in the browser.
- A staging area with 10 military tents, crates, barrels, fires with subtle lighting, and two purely visual catapult props.
- 90 generated trees, 65 rocks, and grasses around the field edges. Alternate desert palettes generate flat-roof houses and palms.
- A deterministic layout so collision-free space is kept between the starting armies, allowing the earlier formation and combat simulation to keep working.
- Static geometry grouped into WebGL2 instanced meshes to reduce draw calls.
- All v0.4 KayKit infantry, archer, and rider characters, plus the previous campaign world, government management and save system, are retained.

The standard 1450 layout yielded 1,186 static scenery placements across 28 instanced draw calls and 116 active character animation mixers in an automated Chromium/WebGL2 test. These are integration measurements, **not an FPS benchmark**.

## Instant battle showcase

A new BATTLE SHOWCASE button is visible from the kingdom screen after beginning a reign.

It opens a practice battle in the new environment without requiring a declaration of war. A practice battle can be paused, commanded, retreated from, and returned to the campaign. It **does not mutate** province ownership, troop totals, treasury, or the saved game. Ordinary battles still use their existing consequence flow.

## Asset provenance and honesty

- Character files remain the original freely downloadable CC0 KayKit Knight and Rogue Hooded GLBs, bundled locally.
- The settlement architecture, road, catapult placeholders, tent and tree models are **original code-generated 3D geometry**, with procedural textures generated in the browser. They are not claimed to be the uploaded Kenney/Quaternius meshes.
- This pass is historically inspired and primarily European medieval; the world needs distinct regional architecture.
- The 100 large South Indian architectural source GLBs are kept in the repository's authoring source collection, not downloaded together to load one battle.
- Gate collision, siege pathfinding, walls that can be breached, cavalry charging, physics demolition and complete battlefield AI are **not implemented** by this artwork milestone.

## Verification

- Run `npm test` and `npm run check` for deterministic scene layout and existing simulation regressions.
- Run `python3 scripts/battle_browser_smoke.py` with Playwright/Chromium to check rendered WebGL2 art, animation, screenshot, and practice-battle flow.
- Run `python3 scripts/package_playable.py` then `python3 scripts/check_release_package.py` to validate the downloadable ZIP.
- GitHub Actions publishes browser screenshots from actual runtime; see `docs/battle-medieval-fortress-3d.png`.
- **No target-machine frame rate, final art direction sign-off, or complete-game claim.**

## Next milestones

1. Inspect real battlefield screenshots at multiple zoom levels and simplify the scene for low-powered GPUs.
2. Import selected CC0 Kenney castles, Quaternius villages, and properly animated horses with conversion and performance budgets.
3. Make walls, gates, towers, and siege engines have gameplay: hit points, collision, breached access, rams, missiles, morale, defensive positions.
4. Add historically appropriate architecture and units for India, the Middle East, East Asia, Africa, and the Americas.
5. Continue historical 1450 province reconstruction, character/dynasty court depth, diplomacy, trade, navies, combat AI, tutorial, and performance testing.

Play: extract the v0.5 ZIP, run `python3 -m http.server 8080`, begin a reign and click **BATTLE SHOWCASE**.
