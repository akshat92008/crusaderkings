# Sovereign 1450 — Feature Verification Matrix (Baseline vs. v1.0)

**Classification Key:**
- **VERIFIED** = Implemented in `main`, wired to UI & saves, covered by passing tests.
- **PARTIAL** = Core exists cleanly, but integration, UX, visuals, or Phase 2–17 depth gaps remain.
- **BROKEN / DISABLED** = Bypassed, stubbed, or failing a current test/smoke gate.
- **MISSING** = Required by v1.0 scope, not yet built.

---

| Subsystem | Key Source Modules | Baseline Status | Gap / Action Required (Target Phase) |
| :--- | :--- | :---: | :--- |
| **Global 1450 Atlas (`atlas-1450-v5`)** | `src/world-kingdoms-1450.js`, `src/historical-world.js`, `src/map.js`, `src/relief-map.js` | **VERIFIED** | Add curated **Featured Starts** showcase + difficulty cards without pruning map (Phase 16) |
| **Core Simulation & Calendar** | `src/simulation.js`, `src/portable-save.js`, `src/mobile-storage.js` | **PARTIAL** | Audit transaction boundaries, port `estateRetinue` title-transfer guard, verify `battleResult` single-apply & deterministic RNG (Phase 2) |
| **Dynasty, Succession & Titles** | `src/dynastic-politics.js`, `src/feudal-systems.js`, `src/succession-systems.js`, `src/personal-unions.js`, `src/subholdings.js`, `src/regency-systems.js` | **VERIFIED** | Stress-test edge-case multi-crown/personal-union inheritance & consolidate duplicate CK2 interactions (Phase 10) |
| **Royal Council & Characters** | `src/character-agency.js`, `src/council-tasks.js`, `src/vassal-courts.js`, `src/intrigue-systems.js` | **PARTIAL** | Expand council delegation so competence ≠ loyalty & councilors pursue autonomous agendas (Phase 10) |
| **Diplomacy & Warfare Goals** | `src/diplomacy-systems.js`, `src/campaign-war.js`, `src/political-conflict.js` | **VERIFIED** | Surface exact AI acceptance breakdowns + AI want/personality cues in UI (Phase 11, 13) |
| **Strategic AI** | `src/strategic-ai.js`, `src/invasions.js` | **PARTIAL** | Enforce attack recovery cooldowns, anti-snowball coalitions, and 50/100/150-yr telemetry runs (Phase 11) |
| **Living Capital (`Hometown`)** | `src/hometown.js`, `src/hometown-ui.js`, `src/hometown-scene.js`, `src/hometown-technologies.js` | **PARTIAL** | Group 10 levels into 5 major visual stages, add ghost placement/collision, ambient townsfolk, steward summary, & couple to 3D siege layout (Phase 8, 7) |
| **Economy & Ledgers** | `src/simulation.js`, `src/economy-systems.js` | **PARTIAL** | Build actionable shortage forecast & deficit remediation UI + connect war losses to recovery cost (Phase 9) |
| **Battle Simulation & Rules** | `src/simple-card-battle.js`, `src/field-tactics.js`, `src/military-systems.js`, `src/military-doctrines.js` | **VERIFIED** | Unify `computeMeleeTickDamage` / armor / fatigue / morale / flanking math + 4-state tactical AI + 1,000-seed balance matrix (Phase 5) |
| **3D Battle Renderer (`0 A.D.`)** | `src/battle.js`, `src/three-battle-scene.js`, `src/battlefield-art.js`, `src/battle-presentation.js`, `src/glb-art.js` | **DISABLED / PARTIAL** | `main.js:319` forces `bannerView = true` (2D)! Must restore Three.js path, add `MeshoptDecoder` + rigged `0 A.D.` `CC BY-SA` units/horses/elephants, replace procedural box scenery & strictly `.dispose()` on exit (Phases 3, 4, 6) |
| **3D Capital Sieges** | `src/battle.js`, `src/military-systems.js`, `src/hometown.js` | **MISSING in 3D** | Currently 2D in `BannerRenderer`. Convert to 3D gates/walls/towers/rams/catapults/bombards mapped from Hometown's 64 plots with traversable breaches & damage write-back (Phase 7) |
| **Narrative Events & Progression** | `src/expanded-content.js`, `src/content/*`, `src/crossroads-eras.js`, `src/reign-chapters.js`, `src/chronicle-systems.js` | **VERIFIED (Needs Pacing)** | `3,051` events / `437` decisions exist; categorize into 3 pacing tiers (Critical/Important/Chronicle) & fix interruption spam (Phase 12) |
| **UI/UX & Tooltips** | `index.html`, `styles.css`, `assets/court-theme.css`, `src/kingdom-ui.js`, `src/campaign-hud.js`, `src/dispatch-ui.js` | **PARTIAL / FAIL** | Redesign into 7 destinations (`Crown/Court/Diplomacy/Economy/Military/Capital/Chronicle`), 3-level lockable nested tooltips, fix mobile `#open-management` smoke timeout (Phase 1, 13) |
| **Art Portraits & Event Illustrations** | `assets/portraits/`, `assets/game-art/`, `src/game-art.js` | **PARTIAL** | **451 MB** raw `Gemini_Generated_Image_*.png` portraits & visual inconsistency risk Steam backlash; curate, downscale/paint-over, standardize event archetypes (Phase 14) |
| **Audio** | `src/field-audio.js`, `src/soundtrack.js`, `src/sample-audio.js`, `assets/audio/` | **PARTIAL** | Add separate Master/Music/SFX/Ambience mixers, verify commercial rights in `AUDIO_README.txt`, complete 40-action cues (Phase 15) |
| **Mod Studio** | `src/mod-loader.js`, `src/mod-ui.js` | **VERIFIED** | Preserve JSON schema stability & validation on v1.0 freeze |
| **PC Packaging & Steamworks** | `scripts/package_desktop.mjs`, `dist/desktop-app/` | **PARTIAL / MISSING** | Electron wrapper built; **missing** `steamworks.js`, Windows/macOS signing, hardware validation, Steam Next Fest telemetry/feedback opt-in (Phase 18, 23, 24) |
