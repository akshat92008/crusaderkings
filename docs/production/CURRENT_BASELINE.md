# Sovereign 1450 — Current Baseline (Phase 1 Measured Audit)

**Audit Date:** 28 November 2026  
**Pinned Base Commit:** `2bbf4d0` (`2bbf4d0308e9bef513232532b5e4dadbdec58f5a`) on `main`  
**Working Tree State at Audit:** Modified + untracked narrative/arena/UI files pending Phase 1 consolidation (`3,051` event expansion, `assets/battle/arenas/`, UI updates).

> All counts below are **machine-verified directly from source/runtime evaluation** rather than copied from legacy README text.

---

## 1. Exact Measured Runtime & Codebase Counts

| Category | Measured Value | How Measured / Source | Legacy Docs Said |
| :--- | :--- | :--- | :--- |
| **Global Atlas (`atlas-1450-v5`)** | **929 districts**, **122 factions** (`Europe 20`, `Asia 48`, `Africa 24`, `N. America 14`, `S. America 11`, `Oceania 5`) | Executed `populateGlobalKingdoms(densifyHistoricalWorld(expandHistoricalWorld(buildHistoricalWorld(world.json, historical-polities-1450.json))))` | README/KNOWN_LIMITATIONS varied (`929` vs `980+`; `115+` vs `122`) |
| **Legacy / Intermediate Atlases** | `world.json`: 299 prov / 44 fac; `v2`: 486 / 44; `v3`: 486 / 56; `v4`: 724 / 56 | Direct JS evaluation | — |
| **Narrative Events** | **3,051 total events** (`2,891` expanded = `512` baseline + `2,379` sovereign across 6 modular `src/content/events-*.js` files + `160` emergent) | `allContentStats()` in `src/expanded-content.js` | `1,071` in commit `2bbf4d0` |
| **Decisions & Mandates** | **437 total decisions/mandates** (`421` expanded + `16` emergent) | `allContentStats()` in `src/expanded-content.js` | `357` mandates in `2bbf4d0` |
| **Living Capital (`Hometown`)** | **10 levels**, **40 `HOME_BUILDINGS`**, **20 `HOME_RESEARCH`**, **7 `WORKFORCE_ROLES`**, 64 plot positions (`h.positions`) | `src/hometown.js` exports | 10 levels |
| **Military Roster & Formations** | **14 `REGIMENTS`**, **10 `FORMATIONS`** | `src/military-systems.js` & `src/military-doctrines.js` | — |
| **Source Code (`src/`)** | **118 JS files** (`104` in `src/`, `14` in `src/content/`), **54,848 lines** | `ls -1 src/*.js src/content/*.js \| wc -l` | — |
| **Test Suite (`tests/`)** | **119 `.test.mjs` files**, **9,263 lines** in test definitions | `ls -1 tests/*.test.mjs` + `wc -l` | `115+` |
| **Scripts & CI Workflows** | **27** files in `scripts/`, **15** `.yml` workflows in `.github/workflows/` | Directory audit | — |
| **Git Branches** | **103 total branches** (`63` merged into `main`; `40` unmerged remote/tag pointers + `3` local `swarm-*` aliases) | `git branch -a` | "100+ branches" |
| **Git-Tracked Files** | **2,974 tracked files** (`2,515` in `assets/`, `119` `tests/`, `115` `src/` tracked, `101` `source/`, `33` `docs/`, `32` `qa-screenshots/`, `27` `scripts/`) | `git ls-files` | — |
| **Disk Usage (Workspace)** | `assets/` **2.9 GB** (`packs/` 1.3 GB, `portraits/` 451 MB, `cliopatria/` 296 MB, `documents/` 294 MB, `maps/` 179 MB, `medieval_village/` 168 MB, `audio/` 165 MB), `source/` **731 MB**, `dist/` **138 MB** | `du -sh` | — |

---

## 2. Key Technical Findings on Current `main` + Working Tree

1. **Three.js 3D Engine Already Exists, But Is Bypassed by `bannerView`:**
   - `package.json` includes `three@0.180.0` and `esbuild@0.25.12`, bundled into `src/three-battle.bundle.js` via `scripts/build_3d_battle.mjs`.
   - `src/main.js:319` forces `desc.bannerView = true`, so `src/battle.js:598` instantiates `BannerRenderer` (2D WebP sprites) instead of `ThreeBattleScene`.
   - `src/three-battle-scene.js` currently uses only 2 CC0 KayKit characters (`Knight.glb`, `Rogue_Hooded.glb`) + optional Polyfork Ashikaga models + geometric box/sphere procedural horses (`createHorse()`). Meanwhile `src/glb-art.js` skips `EXT_meshopt_compression` and skinned animations.
2. **Latest Phase 1 Verification Status (`2026-11-28`, Working Tree on top of `2bbf4d0`):**
   - `npm run check`: **PASS**
   - `npm run verify:guard`: **PASS** (`108` src root entries, `8` default + `13` culture sprite sets)
   - `python3 scripts/audit_release_assets.py`: **PASS** (`docs/ASSET_MANIFEST.md` updated: `2,382` tracked asset files / `1,952.99 MB`, `3,051` events, `437` decisions/mandates, `16` untracked asset files)
   - `python3 scripts/mobile_browser_smoke.py`: **PASS** (desktop + `390x844` mobile + `320x640` small-phone + Hometown `40 buildings, 20 research branches, 6 resources`, vassal career, allied contingent, backup import/export)
   - `python3 scripts/warfare_browser_smoke.py`: **PASS** (doctrine, formations, deployed assault, autonomous enemy march, defensive battle, retreat outcome, saved state)
   - `npm test`: **770 / 770 PASS** (`0` fail, `0` skipped, `duration_ms: 197051`, executed 2026-11-28 against current Phase 1 tree)
3. **Important Bloat & Filename Hygiene Defects Discovered:**
   - Root has an untracked duplicate PDF `SOVEREIGN_1450_MASTER_PLA....pdf` (`12 MB`) and duplicated copies in `assets/` (`CREDITS (1).TXT`, `castle (1).png`, `house1 (1).png`, `(1).zip`, etc.).
   - Three tracked paths in `assets/` contain UTF-8 ellipsis/non-ASCII sequences (`assets/icons/...…_7e8a58fa.jpg`, `...…_7042e0b0.jpg`, `assets/heraldry/Brasão...svg`) that trigger quoted path escaping in git/packaging scripts.
   - `assets/portraits/` holds **451 MB** of 8–9 MB uncompressed `Gemini_Generated_Image_*.png` PNGs that risk both laptop RAM/package size and Steam AI-art sentiment if left raw.
4. **Desktop Electron Wrapper Exists, Steamworks Missing:**
   - `scripts/package_desktop.mjs` builds offline `dist/desktop-app/` using `app://` protocol + IPC save dir (`electron@^33.2.0`), cleanly excluding `assets/packs/`, `assets/documents/`, `source/`.
   - **No Steamworks integration** (`steamworks.js`), no Windows/Apple code signing, and no physical Windows test execution has occurred yet.
