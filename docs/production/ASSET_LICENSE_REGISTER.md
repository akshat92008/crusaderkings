# Sovereign 1450 — Asset License Register & Provenance Policy

**Status:** Phase 1 Policy Amendment (Supersedes previous `COMMERCIAL_LICENSING.md` blanket exclusion of `CC BY-SA` for distributed 3D battle models)

---

## 1. Deliberate License Architecture (Clean Code vs. ShareAlike 3D Art)

To support **full 3D battles using `0 A.D.` models** while keeping original Sovereign 1450 source code and UI/brand assets cleanly separated:

| Layer | Assets Covered | License | Commercial Rules & Obligations |
| :--- | :--- | :--- | :--- |
| **Engine, Simulation, UI & Scripts** | `src/*.js`, `src/content/*.js`, `scripts/*`, `index.html`, `styles.css` | **MIT License** (`LICENSE`) | Clean-room JS. **ZERO `0 A.D.` C++ / JS / XML simulation code (`GPL-2.0+`) is ever copied or linked.** |
| **`0 A.D.` 3D Unit & Siege Art (`Phase 3+`)** | Imported `codepawl/0ad-art-glb` (`CC-BY-SA-3.0`) & upstream `0ad/0ad` `binaries/data/mods/*/art` derivatives | **CC BY-SA 3.0** | Commercial sale permitted. **Obligations:** (1) Credit **Wildfire Games / 0 A.D.** + `codepawl/0ad-art-glb` in in-game Credits & `THIRD_PARTY_LICENSES.txt`; (2) Retain `CC BY-SA 3.0` on any distributed/modified `.glb`/texture files and keep source/modified `.glb` assets accessible under `CC BY-SA 3.0` without DRM blocking access to those artwork files. |
| **CC0 3D & 2D Packs** | `KayKit` (`Knight.glb`, `Rogue_Hooded.glb`), `Kenney` Castle/UI/Audio/Cartography, `Quaternius` (`Medieval Village MegaKit`, `LowPoly Weapons`), `Polyy.ai` Village, `Feudal Wars`, `Foozle`, `Screaming Brain`, `DawnBlocker`/`Rubberduck` | **CC0 1.0 Universal** | Commercial sale permitted with zero ShareAlike or mandatory attribution (credited voluntarily). |
| **CC-BY 4.0 / 3.0 Packs** | `Polyfork` (`ashigaru-foot-soldier-806707.glb`, `daimyo-lord-78364a.glb` CC-BY 4.0), `Cliopatria` 1450 atlas ref (CC-BY 4.0), `Bleed` (`Medieval Cart` CC-BY 4.0, `Villager_01` CC-BY 3.0), `Varkalandar` Crops (CC-BY 4.0) | **CC-BY 4.0 / 3.0** | Commercial sale permitted with **mandatory attribution, license link, and modification notice**. |
| **Public Domain Geodata** | `Natural Earth` (`assets/naturalearth/`, `data/world.json`) | **Public Domain** | Unrestricted commercial use. |
| **Unresolved / Excluded Packs** | `0ADMods/xiiiad` (NO license file), `0ADMods/millenniumad` / `pre-colonial-mod` / `aristeia` (`License.txt` is root `GPL-2.0` without `art/LICENSE.txt`), unverified `assets/packs/*.zip` | **HOLD / DO NOT SHIP** | **BLOCKED from commercial release** unless explicit written CC0 / CC-BY / CC-BY-SA permission is secured from original authors. |
| **Legacy `source/` Temple GLBs & `assets/portraits/`** | `source/*.glb` (`731 MB` Kadamba/Indian architecture), `assets/portraits/*.png` (`451 MB` `Gemini_Generated_Image_*`), `assets/audio/music/*.mp3` | **Requires Verification / Optimization** | Must record creation provenance, strip raw authoring duplicates from build (`assets/packs/`), curate/compress runtime files, verify music commercial rights (`AUDIO_README.txt`), and prepare truthful Steam AI disclosure. |

---

## 2. Mandatory Importer Ledger Schema (Phase 3 Pipeline)

Every asset imported in Phase 3 (`scripts/import_0ad_assets.mjs` or `.py`) must emit a structured entry in `docs/production/0ad_asset_provenance.json`:

```json
{
  "id": "india_elephant_01",
  "sourceRepo": "https://huggingface.co/datasets/codepawl/0ad-art-glb",
  "upstreamRevision": "<exact commit/tag SHA>",
  "actorOrPath": "mobile/units-maur-champion-elephant.glb",
  "authors": "Wildfire Games (0 A.D.); GLB assembly by codepawl",
  "license": "CC-BY-SA-3.0",
  "modifications": "Meshopt + WebP texture pass, Three.js clip normalization",
  "outputPath": "assets/battle/0ad/india/elephant_champion.glb"
}
```

---

## 3. Immediate Phase 1 / Phase 14 Hygiene Actions Logged

1. **Remove Non-Shipping Bloat from Runtime Packaging:** Ensure `assets/packs/` (`1.3 GB`), `assets/documents/` (`294 MB`), `assets/cliopatria/` (`296 MB`), raw `assets/medieval_village/` (`168 MB`), and `source/` (`731 MB` unoptimized models unless selectively compressed) stay strictly excluded from `dist/desktop-app/` and `package_playable.py`.
2. **Rename UTF-8 Ellipsis Filenames:** Normalize the 3 tracked paths containing `…` / non-ASCII (`assets/icons/*…*.jpg`, `assets/heraldry/Brasão...svg`) in Phase 14 so cross-platform Windows/macOS installers never fail on path encoding.
3. **Music Commercial Audit:** Before demo/Steam release (Phase 15), confirm commercial distribution licensing for all 11 MP3s in `assets/audio/music/`.
