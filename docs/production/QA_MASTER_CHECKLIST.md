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

## Core Game (0 / 5)
- [ ] **C1.** Global 1450–1600 campaign is playable and stable across 150-year simulation runs
- [ ] **C2.** Dynasty, all succession modes (hereditary, elective, partition, seniority), regencies & personal unions verified
- [ ] **C3.** Rival kingdoms & autonomous characters pursue coherent goals (`50/100/150 yr` AI telemetry audit)
- [ ] **C4.** Diplomacy, truces, coalitions, peace treaties & warscore updates work consistently
- [ ] **C5.** Crossroads Eras & Monarch Reign Chapters conclude in an illustrated dynastic legacy summary

## Living Capital (0 / 5)
- [ ] **L1.** All 10 capital levels render cleanly across 5 distinct visual stages
- [ ] **L2.** Building placement, ghost previews, collision, upgrades, repair, walls & movement work intuitively
- [ ] **L3.** Resource ledgers accurately show inflows/outflows, months until shortage, & suggested remedies; 7 workforce roles manual + steward-delegable
- [ ] **L4.** Capital visually reflects prosperity, famine, plague, or siege damage
- [ ] **L5.** Hometown 64-plot layout maps directly into 3D tactical siege geometry & persistent post-battle damage

## 3D Warfare & Sieges (0 / 7)
- [ ] **W1.** `0 A.D.` (`CC BY-SA 3.0`) & `CC0` conversion pipeline + full provenance license register verified
- [ ] **W2.** 4 launch regional 3D army families (Indian flagship, East Asian, Persian/ME, European) + explicit fallbacks render and animate cleanly (`idle/walk/run/attack/death`)
- [ ] **W3.** Responsive regiment deployment, reserves, fixed tactical camera & selection/order rings
- [ ] **W4.** Unified combat model (`3:1` advantage, braced pikes vs cavalry, flanking, fatigue, morale) passes 1,000+ deterministic simulations
- [ ] **W5.** Transparent Auto-Resolve produces explainable, fair outcomes matching manual power ratios
- [ ] **W6.** 3D sieges support gates, walls, towers, rams, catapults, bombards & traversable breaches
- [ ] **W7.** Battle casualties, captured commanders, loot & warscore apply cleanly back to `WorldState` once per battle

## Presentation, UX & Onboarding (0 / 7)
- [ ] **P1.** Cohesive *Sunlit Illuminated Chronicle* art direction across map, UI, portraits & 3D battlefields
- [ ] **P2.** 7-destination HUD simplification (`Crown/Court/Diplomacy/Economy/Military/Capital/Chronicle`) + 3-level lockable nested tooltips
- [ ] **P3.** Curated consistent 2D portraits & archetype event illustrations with zero raw AI artifacts
- [ ] **P4.** 4-bus WebAudio (`Master/Music/SFX/Ambience`), commercial music clearance & non-overlapping transitions
- [ ] **P5.** 40-action tactile visual & audio feedback verified
- [ ] **P6.** Guided first-hour experience + 8–12 featured starts pass `>= 80%` blind-tester onboarding rate
- [ ] **P7.** Accessibility verified (720p–4K scaling, contrast, text size, reduced motion, auto-pause)

## Technical Quality (0 / 8)
- [ ] **T1.** Zero known P0 crashes or soft-locks across 10-hour continuous play sessions
- [ ] **T2.** Zero save corruption or duplicated resources across manual, auto, & Electron saves
- [ ] **T3.** Legacy save migration (`v1`–`v5`) & backup export/import pass deterministic checks
- [ ] **T4.** Full automated suite (`unit`, `integration`, `endurance`, `visual`, `browser smoke`) 100% green on RC commit
- [ ] **T5.** Physical Windows 8 GB & 16 GB PC compatibility verified (DirectX/ANGLE WebGL2, fullscreen, audio)
- [ ] **T6.** M3 MacBook Air 8 GB performance targets met (`>= 30 FPS` battle floor, `<= 1.6–2.0 GB` RAM, zero battle memory leaks over 20 consecutive transitions)
- [ ] **T7.** Electron desktop app boots and saves 100% offline with zero console/network errors
- [ ] **T8.** Every runtime asset path audited clean (ASCII-safe filenames, zero excluded authoring bloat)

## Commercial Preparation (0 / 9)
- [ ] **M1.** Steamworks partner onboarding & `$100` Steam Direct fee cleared
- [ ] **M2.** Steam Coming Soon page, main/small/library capsules & screenshots approved
- [ ] **M3.** Public offline demo (`Vijayanagara` + 1–2 featured realms) live for external testers (`>= 50–100` unaffiliated players)
- [ ] **M4.** External validation scorecard passes Next Fest / launch thresholds
- [ ] **M5.** Launch price validated (`$14.99` working hypothesis vs `$9.99`/`$19.99`) & regional pricing configured
- [ ] **M6.** Truthful Steam Content Survey & AI-disclosure completed
- [ ] **M7.** 60–90s authentic gameplay trailer & Steam Next Fest campaign executed
- [ ] **M8.** `v1.0.0-rc.1` depot builds signed/verified cleanly on Steam client (`steamworks.js`)
- [ ] **M9.** Day-1 support channel & 6-month post-launch hotfix workflow documented
