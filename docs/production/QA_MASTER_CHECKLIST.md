# Sovereign 1450 — QA Master Checklist (v1.0 Release Gate)

All **41 acceptance criteria** must be verified before tagging `v1.0.0-rc.1`. Never check off an item from file existence alone—require executed tests or physical verification.

---

## Automated Baseline Commands
```sh
npm ci
npm run verify:guard
npm run check
npm test
python3 scripts/audit_release_assets.py
python3 scripts/package_playable.py
python3 scripts/check_release_package.py
node scripts/package_desktop.mjs
CROWN_ENDURANCE_MONTHS=1200 node --test tests/release-endurance.test.mjs
CROWN_ENDURANCE_MONTHS=3600 node --test tests/release-endurance.test.mjs
python3 scripts/mobile_browser_smoke.py
python3 scripts/battle_browser_smoke.py
python3 scripts/warfare_browser_smoke.py
```

---

## Core Game (5 / 5 Verified)
- [x] **C1.** Global 1450–1600 campaign is playable and stable across 100–150 year (`1200`-month dense endurance + `600`-month AI soak) simulation runs
- [x] **C2.** Dynasty, all succession modes (hereditary, elective, partition, seniority, turkish_open), regencies & personal unions verified (`20/20` Phase 10 suite)
- [x] **C3.** Rival kingdoms & autonomous characters pursue coherent goals (`50 yr` AI telemetry + attack cooldowns verified)
- [x] **C4.** Diplomacy, truces, coalitions, peace treaties & warscore updates work consistently
- [x] **C5.** Crossroads Eras & Monarch Reign Chapters conclude in an illustrated dynastic legacy summary (`3,051` 3-tier paced events + `437` mandates)

## Living Capital (5 / 5 Verified)
- [x] **L1.** All 10 capital levels render cleanly across 5 distinct visual stages (`TOWN_VISUAL_TIERS` Tiers I–V)
- [x] **L2.** Building placement, ghost previews, collision, upgrades, repair, walls & movement work intuitively
- [x] **L3.** Resource ledgers accurately show inflows/outflows, months until shortage, & suggested remedies (`stewardAdvice`); 7 workforce roles manual + steward-delegable
- [x] **L4.** Capital visually reflects prosperity, famine, plague, or siege damage
- [x] **L5.** Hometown 64-plot layout maps directly into 3D tactical siege geometry (`homeCapitalLayout`) & persistent post-battle damage (`applyFortDamage`)

## 3D Warfare & Sieges (7 / 7 Verified)
- [x] **W1.** `0 A.D.` (`CC BY-SA 3.0`) & `CC0` conversion pipeline + full provenance license register verified (`38` meshopt GLBs)
- [x] **W2.** 4 launch regional 3D army families (`india`, `east_asia`, `persia`, `europe`) + explicit fallbacks render and animate cleanly across WebGL2 (`phase6_regions_3d_smoke.py`)
- [x] **W3.** Responsive regiment deployment, reserves, fixed tactical camera & selection/order rings (`battle_3d_vertical_slice_smoke.py` `20/20`)
- [x] **W4.** Unified combat model (`3:1` advantage, braced pikes vs cavalry, flanking, fatigue, morale) passes deterministic simulations
- [x] **W5.** Transparent Auto-Resolve produces explainable, fair outcomes matching manual power ratios
- [x] **W6.** 3D sieges support gates, walls, towers, rams, catapults, bombards & traversable breaches (`phase7_siege_3d_smoke.py` + `siege-matrix.test.mjs`)
- [x] **W7.** Battle casualties, captured commanders, loot & warscore apply cleanly back to `WorldState` once per battle (`phase2-simulation-integrity.test.mjs`)

## Presentation, UX & Onboarding (5 / 7 Verified)
- [x] **P1.** Cohesive *Sunlit Illuminated Chronicle* art direction across map, UI, portraits & 3D battlefields
- [x] **P2.** 7-destination HUD architecture + 3-level lockable nested tooltips (`[T]` / click expand, verified in Chromium)
- [x] **P3.** Curated consistent 2D portraits & archetype event illustrations (raw packs & portrait PNGs excluded from distribution `dist/desktop-app/www`)
- [x] **P4.** 4-bus WebAudio (`Master/Music/SFX/Ambience`), commercial music notice tracking
- [x] **P5.** Tactile visual & audio feedback verified across browser smokes
- [ ] **P6.** Guided first-hour experience + 8 featured starts pass `>= 80%` blind-tester onboarding rate *(automated checks pass; blind-tester cohort pending external human run)*
- [ ] **P7.** Full physical-device accessibility audit across 720p–4K desktop monitors & high-contrast OS themes *(1280×720 desktop & mobile viewports verified)*

## Technical Quality (6 / 8 Verified)
- [x] **T1.** Zero P0 crashes across 1,200-month dense endurance + 6-cycle WebGL2 transition soak
- [x] **T2.** Zero save corruption or duplicated resources across manual, auto, & backup saves (`42/42` Phase 2 suite)
- [x] **T3.** Legacy save migration (`v1`–`v5`) & backup export/import pass deterministic checks
- [x] **T4.** Full automated suite (`npm test` `800/800`, `check`, `verify:guard`, `audit_release_assets.py`, `package_playable.py`, `check_release_package.py`) 100% green
- [ ] **T5.** Physical Windows 8 GB & 16 GB PC compatibility verified *(requires Windows hardware target execution)*
- [ ] **T6.** M3 MacBook Air 8 GB performance targets benchmarked *(headless Chromium WebGL2 heap soak `71→195 MB` verified; physical M3 FPS telemetry remaining)*
- [x] **T7.** Offline desktop Electron package built (`954` files, `101 MB`, `app://` protocol + offline IPC save dir, external raw bloat excluded)
- [x] **T8.** Every runtime asset path audited (`2,435` tracked repo files, clean `101 MB` packaged runtime)

## Commercial Preparation (1 / 9 Verified — External Business/Store Prerequisites)
- [ ] **M1.** Steamworks partner onboarding & `$100` Steam Direct fee cleared
- [ ] **M2.** Steam Coming Soon page, main/small/library capsules & screenshots approved
- [x] **M3.** Public offline demo package & portable zip built cleanly (`dist/Crown-of-Nations-1450-Cultural-Warfare-Playtest.zip`, `dist/desktop-app`)
- [ ] **M4.** External validation scorecard passes Next Fest / launch thresholds
- [ ] **M5.** Launch price validated (`$14.99` working hypothesis vs `$9.99`/`$19.99`) & regional pricing configured
- [ ] **M6.** Truthful Steam Content Survey & AI-disclosure completed
- [ ] **M7.** 60–90s authentic gameplay trailer & Steam Next Fest campaign executed
- [ ] **M8.** `v1.0.0-rc.1` depot builds signed/verified cleanly on Steam client (`steamworks.js`)
- [ ] **M9.** Day-1 support channel & 6-month post-launch hotfix workflow documented
