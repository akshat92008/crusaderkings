# Sovereign 1450 — Master Commercial Release Plan (Version 1.0)

**Baseline Pinned Commit:** `2bbf4d0` (`2bbf4d0308e9bef513232532b5e4dadbdec58f5a`) + working-tree Phase 1 audit  
**Rule of Execution:** Execute sequentially and cleanly **phase by phase** (`Phase 1` through `Phase 24`). No phase is treated as complete without verified tests, rendered verification (for visual work), and truthful documentation.

---

## 1. Strategic Identity & Product Thesis

> **Rule a dynasty. Build a kingdom. Command its armies. Leave a legacy.**

`Sovereign 1450` is an offline-capable, premium single-player PC (Windows / Steam first; macOS subject to native hardware testing; mobile post-launch) historical grand-strategy game spanning **1450–1600** where every gameplay layer shares one authoritative campaign simulation:

1. **Authoritative Campaign Simulation & Global Atlas (`1450–1600`)**: 929 playable districts and 122 factions (`atlas-1450-v5`), curated featured starts (`Vijayanagara` flagship + Europe/Ottoman-Persia/East Asia) alongside full global sandbox play.
2. **Deep Dynastic Politics & Diegetic Royal Council**: Characters, ambition/personality profiles, stress, succession laws, civil wars, cadet branches, and council delegation with loyal vs. self-interested advisors.
3. **Interactive 2D Isometric Living Capital (`Hometown`)**: One interactive 10-level (5 visual stages) capital per realm directly supplying food, timber, stone, iron, gold, recruits, research, and the persistent fortress layout.
4. **Decisive 3D Tactical Battles & 3D Capital Sieges**: Three.js WebGL2 battles (`src/three-battle-scene.js`) with simple regiment deployment/orders (`src/simple-card-battle.js`), licensed `0 A.D.` `CC BY-SA 3.0` animated regional armies + `CC0` medieval architecture, persistent siege damage tied back to Hometown buildings, and optional fair Auto-Resolve.

---

## 2. Production Stage & Phase Roadmap

### Stage I — Complete the Core Game (Phases 1–12 → Feature-Complete Alpha Gate)
| Phase | Focus | Key Output / Exit Gate | Status |
| :--- | :--- | :--- | :--- |
| **1** | Repository consolidation & scope freeze | Runtime baseline, 103-branch audit, 12 `docs/production/` truth docs, freeze major new features | **Complete (Verified)** |
| **2** | Unified simulation & save integrity | Authoritative `WorldState` transaction boundaries, deterministic RNG/IDs, backup/migration, battle single-apply guard | **Complete (Verified 42/42)** |
| **3** | `0 A.D.` GLB 3D asset production pipeline | `Asset License Register` amendment for `CC BY-SA 3.0`, reproducible `0ad-art-glb` / actor conversion, Indian flagship army proven | **Complete (9 India GLBs Verified in WebGL2)** |
| **4** | Complete 3D battle vertical slice | Restore & modernize `ThreeBattleScene` in `src/battle.js`, fixed tactical camera, ground markers, HUD, full campaign round-trip (20+ clean runs) | **In Progress** |
| **5** | Combat math, formations & tactical AI | Unified melee/ranged/armor/fatigue/morale/flank model + 4-state tactical AI (`deployment/approach/engage/retreat`) + deterministic test matrix | Pending |
| **6** | Civilization army families & arenas | 4 launch regional 3D families (Indian, East Asian, Persian/Middle Eastern, European) + explicit compatible fallbacks + 6–8 reusable biomes | Pending |
| **7** | Full 3D siege warfare & capital integration | Traversable breaches (gates/walls/towers/rams/catapults/bombards) reading/writing Hometown's 64-plot capital state | Pending |
| **8** | Living Capital & Hometown overhaul | 5 distinct architectural stages across 10 levels, ghost placement/collision, ambient settlers, steward deficit summaries | Pending |
| **9** | Economy, production & military integration | Transparent monthly ledger, shortage forecasts + suggested fixes, manpower/supply drain from wars & sieges | Pending |
| **10** | Dynasty, council & political refinement | Autonomous character goals, councilor agendas (`Marshal/Steward/Chancellor/Spymaster/Religious`), audited succession laws | Pending |
| **11** | Strategic AI, diplomacy & difficulty | 4-level AI coordination, attack cooldown/logistics limits, organic anti-snowball coalitions, 50/100/150-yr AI telemetry soak tests | Pending |
| **12** | Historical progression & alpha gate | Audit `3,051` events into 3 pacing tiers, refine Crossroads Eras & Reign Chapters, curated featured starts, Alpha Gate 10/10 | Pending |

### Stage II — Transform into a Premium Product (Phases 13–18 → Public Demo Gate)
| Phase | Focus | Key Output / Exit Gate |
| :--- | :--- | :--- |
| **13** | Complete UI/UX redesign | 7 primary destinations (`Crown`, `Court`, `Diplomacy`, `Economy`, `Military`, `Capital`, `Chronicle`), 3-level lockable nested tooltips, 720p–4K desktop layout, 8/10 blind-tester gate |
| **14** | Art direction & asset unification | *Sunlit Illuminated Chronicle* palette unification, prune 1.3 GB packs / 451 MB raw AI PNG bloat, modular character portraits, reusable event illustration matrix, Steam AI compliance |
| **15** | Audio, animations & tactile feedback | 4-bus audio (Master/Music/SFX/Ambience), commercial rights clearance on music, 40-action feedback polish |
| **16** | First-hour experience & onboarding | Guided 15-min Vijayanagara opening + 8–12 featured starts with difficulty/situation cards + 3–4 max Dispatch alerts |
| **17** | Performance optimization & stability | 30–60 FPS budgets on 8 GB laptop, soldier sampling (`80–800`), strict Three.js `.dispose()` on battle exit, 10-hour leak check |
| **18** | Desktop demo packaging & external alpha | Complete offline Electron demo (`Vijayanagara` + 1–2 featured realms, ~60–120 min slice), 50–100 unaffiliated playtesters |

### Stage III — Validate & Finalize Content (Phases 19–22)
| Phase | Focus | Key Output / Exit Gate |
| :--- | :--- | :--- |
| **19** | External playtesting & balance refinement | Behavioral metrics (`40+` min median playtime, `85%+` recommendation, `<5%` onboarding dropoff), P0/P1 bug triage |
| **20** | Content completion & localization | Externalize strings into language files; English mandatory + vetted high-priority localizations (`zh-CN`, `de`, `es`, `pt-BR`, optional `ru`) |
| **21** | Steam Next Fest & store validation | Store Coming Soon page, capsule, 60–90s gameplay trailer, 100 creator outreach, single Next Fest participation gate |
| **22** | Final feature & content freeze | Lock gameplay mechanics/civilizations; bug fixes, balance, perf & legal compliance only |

### Stage IV — Release Engineering (Phases 23–24)
| Phase | Focus | Key Output / Exit Gate |
| :--- | :--- | :--- |
| **23** | Full release QA & release candidate | Automated matrix + 1,000 battle sims + 1,000 campaign sims + Windows 8 GB/16 GB + M3 Air 8 GB certification (`v1.0.0-rc.1`) |
| **24** | Commercial launch & post-launch support | Steam Direct ($100), Steamworks SDK (`steamworks.js`), truthful AI survey, launch pricing validation (`$14.99` hypothesis vs `$9.99`/`$19.99`), 6-month post-launch patch cadence |

---

## 3. Non-Negotiable Engineering Rules

1. **Single Authoritative State:** All gameplay actions mutate the canonical campaign state once with deterministic RNG/seeds and pass save/load round-trips.
2. **Exclusive Module Ownership:** Never run parallel edits by uncoordinated agents against shared core files (`src/battle.js`, `src/simulation.js`, `src/main.js`).
3. **No Fake Features:** Every button, building, regiment, advisor, and ledger metric must connect to live simulation math and persistent saves.
4. **Honest Reporting:** Every completed phase records commit SHA, files changed, exact test output, rendered screenshot inspection (for visual changes), performance telemetry, license status, and known remaining defects.
