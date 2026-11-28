# Sovereign 1450 — Master Commercial Release Plan (Version 2.0)

**Baseline Pinned Branch:** `main` (`0dbd053` + V2.0 overhaul)  
**Product Focus:** Premium single-player PC (`1450–1600`) grand-strategy game combining deep dynastic politics, an interactive Living Capital, **Clash of Clans-style deployment-first 3D field battles**, and a **map-first Illuminated Chronicle UI**.

---

## 1. Strategic V2.0 Course Correction

Three deliberate product scope decisions govern Version 2.0:
1. **Battles — Deployment-First 3D Field Combat:** Retain full 3D Three.js historical armies (`ThreeBattleScene`), paired with simple Clash of Clans-style deployment (formation presets + drag/tap regiment card placement + one primary `⚔ BEGIN ATTACK` button), autonomous battle AI, optional Reserve deployment, Rally Horn, speed controls, pause, and retreat. Remove complex mandatory real-time micromanagement.
2. **Interface — Complete Visual & Interaction Overhaul:** Eliminate dense "government-website" sidebars and giant static tables in favor of a map-first viewport, 5 primary destinations (`Map`, `Crown`, `Capital`, `Army`, `More`), readable graphic forecast cards, large character portraits, 2-ruler Diplomacy views, and cohesive *Sunlit Illuminated Chronicle* styling.
3. **Siege Warfare — Deferred (Preserved in Repo):** Keep existing 3D siege geometry/structures isolated inside `src/military-systems.js` and `src/three-battle-scene.js` so nothing regresses, **remove unfinished tactical sieges from active player attack flows & Map Options**, and resolve fortified provinces through strategic siege progress + open-field relief/assault engagements.

---

## 2. Production Scorecard & Effort Allocation

| Area | Production Weight | Priority Status |
| :--- | :---: | :--- |
| **3D Battles & Expanded Regional Assets** | 16% (25% effort) | **Active — V2.0 Expansion** |
| **UI, Artwork & Audio Overhaul** | 14% (30% effort) | **Critical — Map-First Chronicle Redesign** |
| **Grand Strategy & Campaign (`1450–1600`)** | 12% | **Stabilized & Verified** |
| **Dynasty, Court & Politics** | 12% | **Consolidated under Crown Cards** |
| **Economy & Living Capital (`Hometown`)** | 12% | **Forecast Cards + 5 Visual Stages** |
| **AI & Diplomacy (`4`-Layer Verification)** | 10% | **Verified + Cooldown & Coalition Polish** |
| **Performance & Release QA** | 10% | **Target 30–60 FPS / Heap & Hardware Bench** |
| **Packaging & Commercial Readiness** | 8% | **Website-First Demo -> Steam Post-Validation** |
| **Content & Historical Progression** | 6% | **3-Tier Event Pacing + Dynasty Legacy** |

---

## 3. Revised 24-Phase Tracker

### Stage I — Establish the Final Game
- **Phase 1 — Repository Consolidation & Scope Freeze:** Pinned `main`, consolidated docs, 7-repo legal asset audit (`MOD_ASSET_LEGAL_AUDIT.md`), scope frozen on V2.0.
- **Phase 2 — Shared Simulation & Save Integrity:** Single authoritative state, deterministic RNG/IDs, IndexedDB + local backups, battle single-apply guard.
- **Phase 3 — Expanded 3D Asset Production Pipeline:** Catalogued `0 A.D.` + 6 community mod repos; excluded GPL-2.0 / unlicensed repos from binary shipping; expanded cleared `0 A.D.` (`CC BY-SA 3.0`) + `KayKit` / `Polyfork` assets to `75–95+` unique combat units, commanders, trees, rocks, and camp tents across **15 regional visual families** (`western_europe`, `eastern_europe`, `northern_europe`, `byzantine`, `ottoman`, `persia`, `north_india`, `south_india`, `china`, `japan`, `southeast_asia`, `steppe`, `africa`, `mesoamerica`, `andean`) + automated model verification.
- **Phase 4 — 3D Battle Vertical Slice:** Open-field 3D battle flow from deployment through reserves, rally horn, autonomous combat, and campaign consequences (`20+` clean runs -> `100` session soak).
- **Phase 5 — Clash-of-Clans Combat & AI:** 5 formation presets (`Balanced`, `Defensive`, `Cavalry Assault`, `Flanking`, `Ranged Protection`), unit counter matrix (`1,000+` seeded simulations), one primary `⚔ BEGIN ATTACK` button, auto-AI, graphic quality tier decoupling simulated strength from rendered soldier models.
- **Phase 6 — 15 Regional Armies & 8–12 Battlefield Biomes:** Every supported realm maps cleanly to its cultural 3D army roster or explicit culturally compatible fallback; arenas load real `0 A.D.` 3D trees, bushes, boulders, and camp props alongside terrain relief & atmosphere.
- **Phase 7 — Siege Warfare (Deferred):** Strategic fortification values, garrisons, siege progress, and fortress bonuses retained cleanly; unfinished tactical 3D siege mode isolated and hidden from campaign UI.
- **Phase 8–12 — Living Capital, Economy, Dynasty, AI & Feature-Complete Alpha:** 5 visual capital tiers, steward deficit forecasts (`months remaining` + bars), council delegation agendas, war cooldowns, 3-tier event pacing (`Critical` / `Important` / `Minor`), 8 featured starts led by `Vijayanagara`.

### Stage II — Premium Game Transformation
- **Phase 13 — Complete UI/UX Redesign:** Map-first Chrome, 5 primary destinations (`Map`, `Crown`, `Capital`, `Army`, `More`), steward advice HUD pill, compact Character Card (17.1), 2-Ruler Diplomacy card, Economy Forecast card (19), Visual Regiment cards (10), Illustrated Menu & Settings modal.
- **Phase 14–15 — Art Unification & 4-Bus Audio:** Illuminated medieval theme across cards/modals; `Master / Music / SFX / Ambience` audio channels + action cues; raw pack bloat excluded.
- **Phase 16–18 — Onboarding, Performance & Offline PC Demo:** Low/Medium/High graphics presets, 3D disposal leak checks, cold-start/memory targets, clean offline Electron demo (`Vijayanagara` + alternate starts, tactical sieges excluded).

### Stage III–IV — Validation, Freeze, QA & Launch
- **Phase 19–20 — External Playtesting & Localization:** `en` mandatory + `zh-CN`, `de`, `es`, `pt-BR` externalized via `src/i18n.js`; behavioral telemetry prepared for `20–30` -> `50–100` human testers.
- **Phase 21–22 — Website-First Validation & Feature Freeze:** Website landing assets, gameplay trailer/screenshots, creator outreach pipeline, hard freeze on new mechanics.
- **Phase 23–24 — Final Release QA & Commercial Launch:** `npm test` (`100%`), `1,000+` combat sims, `100+` complete 3D battle runs, save/load cycling, hardware M3 8GB & Windows benchmarks, commercial legal/payment readiness.
