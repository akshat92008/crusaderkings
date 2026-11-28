# Sovereign 1450 — 7-Repository 3D Asset Legal & Technical Audit (V2.0)

**Purpose:** Document every candidate 0 A.D. & community mod repository inspected for commercial V2.0 3D asset expansion, separating **commercially cleared assets** from **excluded/unverified GPL or unlicensed packs**.

> **Principle (Part II, Section 4.1):** *Free-to-download does not automatically mean free for commercial redistribution.* Every shipped 3D model must carry an explicit, compatible commercial redistribution license (`CC0`, `CC BY 4.0`, `CC BY-SA 3.0` with ShareAlike attribution, or permissive MIT/Polyfork) and verified provenance.

---

## 1. Repository Audit Summary

| Repository | Inspected Branch / Commit | Reported License | Decision for Sovereign 1450 Commercial Build | Reason & Runtime Mapping |
| :--- | :--- | :--- | :--- | :--- |
| **[0ad/0ad](https://github.com/0ad/0ad)** (via pinned `codepawl/0ad-art-glb`) | `master` / `main` (`61a3b950...`) | **`CC BY-SA 3.0`** | **CLEARED & INTEGRATED** | Wildfire Games explicitly licenses 0 A.D. artwork (`art/`) under `CC BY-SA 3.0`, allowing commercial redistribution with attribution (`0ad/LICENSES.md`, `ASSET_LICENSE_REGISTER.md`). Supplies pre-assembled WebP + Meshopt GLBs for infantry, archers, crossbows, cavalry, horse-archers, elephants, camels, heroes/commanders, flora trees, rocks, and military tents (`1,670` catalogued assets). |
| **[0ADMods/medievalad](https://github.com/0ADMods/medievalad)** | `main` (`LICENSE.MD`) | Dual: **`CC-BY-4.0`** & **`GPL-2.0-or-later`** | **CATALOGUED (Source-Level Pending Blender Conversion)** | Contains 651 files (`teutonics` & `poland` medieval units). Requires Blender/COLLADA conversion (`.dae`/`.xml`/`.dds` -> `.glb`) and per-asset separation of `CC-BY-4.0` vs `GPL-2.0` files before binary shipment. Raw DAE/DDS files are excluded from shipping bundles. |
| **[0ADMods/xiiiad](https://github.com/0ADMods/xiiiad)** | `main` (`mod.json`) | **None (`undefined` at root)** | **EXCLUDED (Legally Blocked)** | High medieval relevance (Western/Eastern European knights & Steppe), **but has no root license file (`LICENSE`)**. Commercial redistribution cannot occur without explicit written clearance from repository maintainers. |
| **[0ADMods/millenniumad](https://github.com/0ADMods/millenniumad)** | `master` (`License.txt`) | **`GPL-2.0`** (repo root) | **EXCLUDED (Copyleft Conflict)** | Repository carries GNU GPL v2 without clear per-asset CC split; distributing raw GPL art inside a mixed commercial bundle risks license contamination unless authors issue separate CC grants. |
| **[0ADMods/terra_magna](https://github.com/0ADMods/terra_magna)** | `master` (`license.txt`) | **`GPL-2.0`** (repo root) | **EXCLUDED (Copyleft Conflict)** | Repo-level GPL-2.0. Chinese & steppe unit visual roles are fulfilled cleanly using cleared `0 A.D.` `han` and `persians` (`CC BY-SA 3.0`) assets instead. |
| **[0ADMods/pre-colonial-mod](https://github.com/0ADMods/pre-colonial-mod)** | `master` (`License.txt`) | **`GPL-2.0`** (repo root) | **EXCLUDED (Copyleft Conflict)** | Repo-level GPL-2.0. Mesoamerican & Andean factions use explicitly documented `0 A.D.` (`iberian` slingers/skirmishers + `mauryan`/`kushite` feathered/spear foot) `CC BY-SA 3.0` compatible mappings so they never fall back to European knights. |
| **[0ADMods/yayoi_japan](https://github.com/0ADMods/yayoi_japan)** | `master` (`license.txt`) | **`GPL-2.0`** (repo root) | **EXCLUDED (Copyleft Conflict)** | Repo-level GPL-2.0. Japanese forces use our already-cleared **Polyfork (`MIT/CC0`)** `ashigaru-foot-soldier-806707.glb` + `daimyo-lord-78364a.glb` paired with cleared `0 A.D.` `han` cavalry/archers (`CC BY-SA 3.0`). |
| **KayKit Adventurers + Kenney** | Local pinned GLBs | **`CC0` (Public Domain)** | **CLEARED & RETAINED (Equipment/Structure Fallback)** | Retained cleanly for fallback infrastructure and weapon/armor references; procedural box horses are eliminated from regional battle rosters. |

---

## 2. Regional Family Visual Resolution Matrix (15 Target Identities)

All 15 V2.0 target visual families resolve to explicitly documented, legally cleared 3D model sets in `assets/battle/0ad/manifest.json` (`ZERO` generic placeholder knights outside European realms):

1. `western_europe` — `0 A.D.` (`romans` + `gauls`) armoured swordsmen, spearmen, pikemen, javelineers/crossbows, heavy mounted knights, commanders (`Scipio`, `Vercingetorix`)
2. `eastern_europe` — `0 A.D.` (`gauls` + `seleucids`) spearmen, armoured swordsmen, pikes, mounted lancers, hero commander (`Brennus`)
3. `northern_europe` — `0 A.D.` (`britons`) swordsmen, spearmen, skirmishers, heavy horsemen, hero (`Caratacos` / `Boudicca`)
4. `byzantine` — `0 A.D.` (`macedonians` + `seleucids` + `romans`) imperial heavy infantry, phalanx pikemen, cataphract-style armoured cavalry, commanders (`Antiochus IV`, `Philip`)
5. `ottoman` — `0 A.D.` (`persians` + `ptolemies`) armoured spearmen, composite archers, mounted axemen/lancers, camel scouts, commanders
6. `persia` — `0 A.D.` (`persians`) Immortals, heavy spearmen, foot archers, mounted horse-archers, cataphract axes, war elephants, hero commanders (`Cyrus`, `Xerxes`)
7. `north_india` — `0 A.D.` (`mauryas`) imperial swordsmen, elite spearmen, macemen, archers, heavy cavalry, war elephants, hero commander
8. `south_india` — `0 A.D.` (`mauryas`) southern warriors, archers, spearmen, macemen, armoured war elephants, royal guard
9. `china` — `0 A.D.` (`han`) armoured swordsmen, halberd pikemen, repeating crossbows, heavy cavalry, horse-archers, hero generals (`Han Xin`, `Liu Bang`)
10. `japan` — `Polyfork CC0/MIT` (`ashigaru`, `daimyo`) + `0 A.D.` (`han`) cavalry & archers
11. `southeast_asia` — `0 A.D.` (`mauryas` + `han`) tropical war elephants, halberdiers, archers, skirmishers
12. `steppe` — `0 A.D.` (`persians` + `han`) composite horse-archers, lancers, skirmisher riders, steppe khans
13. `africa` — `0 A.D.` (`kushites` + `ptolemies` + `carthaginians`) Kushite heavy infantry, Nubian longbow archers, African war elephants, mounted nobles, commanders
14. `mesoamerica` — `0 A.D.` (`iberians` + `mauryas` compatible indigenous warriors: slingers, macemen, javelin skirmishers, plumed hero commander)
15. `andean` — `0 A.D.` (`iberians` highland slingers + `kushites` bronze-age/highland spear infantry + compatible mountain commander)

*(All 4 original shorthand family IDs — `india`, `east_asia`, `persia`, `europe` — are retained as aliases in `manifest.json` so all existing tests and smoke scripts continue passing seamlessly.)*
