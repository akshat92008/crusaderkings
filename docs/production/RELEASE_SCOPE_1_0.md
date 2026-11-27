# Sovereign 1450 — Frozen Version 1.0 Release Scope

**Status:** FROZEN (Phase 1 Scope Lock — effective 28 November 2026 baseline)  
**Rule:** After Phase 1, no new major gameplay genres, extra continents, or unapproved engine rewrites may be added unless required by an approved release blocker.

---

## 1. Product Identity & Business Model
| Dimension | Locked v1.0 Decision |
| :--- | :--- |
| **Title** | Sovereign 1450 |
| **Era** | 1450 – 1600 (Crossroads Eras + Multi-Generational Succession) |
| **Primary Platform** | Windows PC (Steam, offline Electron runtime) |
| **Secondary Platform** | macOS (native `.dmg`/`.zip` subject to M3/macOS hardware verification) |
| **Deferred Post-Launch** | Android / iOS (`capacitor.config.json` maintained as non-blocking, not primary v1.0 launch gate) |
| **Business Model** | Single-player premium one-time purchase (working price hypothesis `$14.99`, validated against `$9.99` and `$19.99` demo feedback; no ads, no P2W, no day-one gameplay DLC, no multiplayer) |
| **Offline Requirement** | 100% playable offline (no runtime CDNs or required external network services) |
| **Minimum Hardware Target** | Ordinary 8 GB RAM laptop (M3 MacBook Air 8 GB benchmark + Windows 8 GB iGPU minimum target) |

---

## 2. Included v1.0 Feature Scope

### 2.1 Grand Strategy & Atlas (`atlas-1450-v5`)
- **Retain Existing Global Atlas:** 929 playable districts and 122 realms across 6 continents (`Europe 20`, `Asia 48`, `Africa 24`, `North America 14`, `South America 11`, `Oceania 5`).
- **Curated Launch Experience (Override vs. Map Shrink):** Do **not** cut the map to 40 provinces. Instead, polish **8–12 Featured Starts** led by **Vijayanagara (Flagship)** plus curated European, Ottoman/Persian, and East Asian realms, keeping the remaining realms as verified sandbox starts without misleading promises of bespoke content for all 122.
- **Crossroads Eras (1450–1600) & Monarch Reign Chapters:** Historical technological shifts (`gunpowder_foundry`, `oceanic_navigation`, `printing_press`, `chartered_finance`, `first_contact`), epithets, succession summary, and endgame illustrated dynastic chronicle.

### 2.2 Politics, Dynasty, Council & AI
- **CK-Inspired Political Simulation:** Characters, traits, health/stress, hereditary/elective/partition/seniority succession, regencies, personal unions, cadet branches, claims, vassal courts, factions, civil wars, intrigues, and playable vassal/landless careers (stabilized & consolidated—no redundant DLC clones).
- **Diegetic Royal Council:** Five council seats (Chancellor, Steward, Marshal, Spymaster, Religious Advisor) supporting delegable automation, competence scaling, and loyalty/agenda conflicts.
- **Four-Level AI Architecture:** Deterministic Kingdom AI (8 ruler personalities), Character AI, Capital AI, and 3D Tactical Battlefield AI with war exhaustion/recovery cooldowns and organic anti-snowball coalitions.

### 2.3 Interactive 2D Isometric Living Capital (`Hometown`)
- **One Interactive Capital per Realm:** Retain 10 mechanical progression tiers across **5 distinct architectural visual stages** (`1–2` Frontier, `3–4` Fortified Township, `5–6` Regional Capital, `7–8` Royal Metropolis, `9–10` Imperial Capital) on the 64-plot settlement layout.
- **Settlement Loop:** Building placement previews, valid/invalid collision, upgrades, repair, walls/gates, 7 workforce roles (manual or steward-delegated), 20 research branches, ambient citizens/merchants/soldiers/state visuals, and transparent shortage diagnostics tied directly to economy & military.

### 2.4 Full 3D Tactical Battles & 3D Sieges (Explicit Override)
- **3D Renderer Only in `#battle-screen`:** Restore and modernize `ThreeBattleScene` (`three@0.180.0`) with **no full-map 3D bloat**; cleanly `.dispose()` scene/GPU buffers on battle exit.
- **Assets:** `0 A.D.` artwork (`CC BY-SA 3.0`, strictly zero GPL code, full attribution/ShareAlike register) + cleared `CC0` (`Kenney`, `Quaternius`, `KayKit`) + cleared `CC-BY` (`Polyfork`) packs.
- **Scope:** Start by proving 1 full **Indian (Vijayanagara)** regional 3D army family end-to-end, then expand to **4 regional visual families** (`Indian`, `East Asian`, `Persian/Middle Eastern`, `European`) plus deliberate compatible fallback families for remaining regions, across **6–8 reusable terrain/weather environments**.
- **Regiment Gameplay & Auto-Resolve:** 14 normalized regiment types (`swordsmen`, `spearmen`, `shieldmen`, `bowmen`, `scouts`, `pikes`, `guard`, `skirmishers`, `longbow`, `crossbow`, `handgun`, `lancers`, `horsebow`, `elephants`), 8+ effective formations, fast regiment deployment/orders (`simple-card-battle` / `field-tactics` backbone), plus fair **Auto-Resolve**.
- **3D Capital Sieges:** Integrated siege assault/defense reading the defender's actual Hometown 64-plot layout/fortification buildings, traversable wall/gate breaches, siege engines (ram, catapult/trebuchet, bombard), and persistent damage back to capital records.

### 2.5 Presentation, Narrative, Modding & Tooling
- **Unified Art Direction (*Sunlit Illuminated Chronicle*):** Cohesive parchment/brass UI, historical cartography, modular/consistent 2D portraits, reusable event illustration archetypes (`~15–20` core scene families covering all events—NOT 3,000 bespoke images), and 4-bus WebAudio (`Master/Music/SFX/Ambience`).
- **Event Consolidation:** Audit and pace our existing **3,051 events / 437 decisions** into 3 urgency tiers (critical pause, important banner, chronicle feed)—no arbitrary new event bloat.
- **Modding:** Stabilize and preserve existing JSON Mod Studio (`src/mod-loader.js`, `src/mod-ui.js`).

---

## 3. Explicit v1.0 Exclusion List
The following will **NOT** ship in v1.0 (candidates for post-launch consideration only):
1. Multiplayer / co-op / PvP.
2. Live 3D free-roam TPS/Bannerlord player avatar combat.
3. 3D interactive naval battles (naval troop transport & blockades remain strategic map mechanics).
4. Bespoke 3D unit & architectural sets for all 122 factions at launch (use 4 curated core regional families + designed fallbacks).
5. Microtransactions, in-game stores, ads, or day-one paid DLC.
6. Mobile storefront launch parity blocking Windows/Steam release.
7. Rewriting working ES modules into TypeScript or replacing Three.js/canvas engines unnecessarily.
