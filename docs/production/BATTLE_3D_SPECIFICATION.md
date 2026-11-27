# Sovereign 1450 — 3D Battle & Siege Integration Specification

**Goal:** Replace the bypassed 2D battle sprite view (`desc.bannerView = true`) with a fast, decisive, tactile **Three.js 3D Battle & Siege System** driven by deterministic regiment simulation (`src/simple-card-battle.js` & `src/field-tactics.js`) and `0 A.D.` + `CC0` 3D assets.

---

## 1. Architecture Separation (Simulation vs. 3D Presentation)

| Layer | File(s) | Responsibility |
| :--- | :--- | :--- |
| **Deterministic Battle Rules** | `src/simple-card-battle.js`, `src/field-tactics.js`, `src/military-systems.js`, `src/military-doctrines.js` | Regiment positioning, formations, reserves (max 3), melee/ranged/armor/morale/flank math, tactical AI, siege breach HP & navigation state, outcome generation. **Zero DOM or WebGL dependency.** |
| **Three.js Battle Engine** | `src/three-battle-scene.js` → bundled to `src/three-battle.bundle.js` via `scripts/build_3d_battle.mjs` | `GLTFLoader` + **`MeshoptDecoder`** (`three/examples/jsm/libs/meshopt_decoder.module.js`) loading `0 A.D.` `CC BY-SA 3.0` animated `.glb` models, animation mixers, SkeletonUtils cloning, instanced environmental props, tactical camera, raycast unit selection. |
| **Battlefield & Siege Scenery** | `src/battlefield-art.js`, `src/field-scenery.js`, `src/field-atmosphere.js` | Textured terrain elevation, groves/rocks/rivers, fortress walls, gatehouses, watchtowers, battering rams, catapults, bombards synchronized with Hometown capital buildings. |
| **Battle Orchestrator** | `src/battle.js`, `src/battle-presentation.js`, `src/battle-lifecycle.js` | Single entry point via `chooseBattleRenderer`; removes default `bannerView = true` bypass (`src/main.js:319`); updates ground selection rings, arrow volleys, charge trails, HUD, and enforces strict `.dispose()` on exit. |

---

## 2. Why `0 A.D.` Assets Work Directly in Three.js (`MeshoptDecoder` Upgrade)

- Upstream `codepawl/0ad-art-glb` (`CC BY-SA 3.0`, pinned revision recorded in Phase 3) provides **pre-assembled, skinned `.glb` units** (`mobile/units-*.glb` using `EXT_meshopt_compression` + WebP textures) with `idle`, `walk`, `run`, `attack`, and `death` clips, **plus cavalry mounts, war elephants, and siege engines**.
- **Critical technical fix required in Phase 3/4:**
  - Legacy `src/glb-art.js` (`BattleModelArt`) skips `EXT_meshopt_compression` and lacks skeletal skinning.
  - Adding `MeshoptDecoder` directly to `GLTFLoader` inside `src/three-battle-scene.js` allows native loading of lightweight `mobile/` GLBs in-browser & Electron with **zero Blender compilation dependency** for already-built `0ad-art-glb` units, supplemented by offline optimization scripts where needed.

---

## 3. Battle Loop, Camera, Controls & Roster

### 3.1 Tactile Control Contract
- **Camera:** Fixed readable ~45° tactical angle (`PerspectiveCamera`), smooth WASD/edge/drag pan, zoom clamp, optional Q/E rotation, **auto-frame deployment & action**. No awkward free-flight camera needed.
- **Commands:** Click regiment or card → left/right-click ground destination or enemy target → toggle 8 formations (`Line`, `Shield Wall`, `Pike Brace`, `Loose`, `Wedge`, `Square`, `Skirmish`, `Column`) + hold/release up to 3 reserve regiments.
- **Duration & Auto-Resolve:** Open field battles resolve cleanly in **2–5 minutes**; **Auto-Resolve** (`preWarComparison` odds preview) always available pre-battle.

### 3.2 Regional Families (Phased Rollout)
1. **Phase 3–4 Proof (Indian Flagship — Vijayanagara):** `Maurya` / Indian spear, sword, longbow/archer, cavalry, war elephant, royal guard, fortress props.
2. **Phase 6 Expansion (Launch 4 Regional Families):**
   - **Indian** (flagship `Vijayanagara`, `Delhi`, `Bahmani`, etc.)
   - **East Asian** (`Ming`, `Joseon`, `Ashikaga` + existing Polyfork `ashigaru`/`daimyo` `CC-BY 4.0`)
   - **Persian / Middle Eastern** (`Ottomans`, `Timurids`, `Mamluks`, `Persia`, `Aq Qoyunlu`)
   - **European** (`England`, `France`, `Castile`, `Hungary`, `Poland`, etc. + KayKit `CC0` / cleared `0 A.D.` medieval packs)
   - Remaining Africa/Americas/Oceania realms map to clean, explicitly documented compatible regional visual archetypes until dedicated packs are added.

---

## 4. 3D Siege Integration (Defend the Capital You Built)

- `createSiegeState` reads the defender's active `hometown.buildings[capital]` and `hometown.realms[defender].positions` (`64` plots) to spawn 3D walls, wooden palisades, gatehouse, watchtowers, and inner courtyard structures matching built levels.
- Siege engines (`ram` vs gatehouse, `catapult`/`trebuchet` & `bombard` vs stone walls/towers) visibly damage target meshes and trigger real traversable nav-gap opening upon breach (`siegeBreached()`).
- Post-siege damage writes back to the exact province `buildings.fort` and Hometown capital structure HP once per concluded battle.
