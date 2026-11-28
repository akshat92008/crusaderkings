# Sovereign 1450 — QA Master Checklist (v2.0 Release Gate)

All V2.0 acceptance criteria must be verified honestly before public demo distribution or commercial release. Never check off an item from file existence alone—require executed tests, rendered browser inspections, or physical hardware measurements.

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
python3 scripts/mobile_browser_smoke.py
python3 scripts/battle_browser_smoke.py
python3 scripts/warfare_browser_smoke.py
```

---

## V2.0 Battle Acceptance Tracker (Section 13)
- [x] **B1.** Every launched regiment role resolves to a cleared 3D model and animation mapping (`0` placeholder horses)
- [x] **B2.** All 15 regional visual army families + `0 A.D.` 3D environment trees/rocks/props verified & inspected
- [x] **B3.** Clash-of-Clans deployment, drag/tap placement & 5 formation presets (`balanced`, `defensive`, `cavalry_assault`, `flanks`, `ranged_cover`) work reliably
- [x] **B4.** Automatic combat AI enforces unit counters (`pike vs cavalry`, `cavalry vs archers`, `archers vs foot`)
- [x] **B5.** Commander Rally Horn (`⚑ RALLY`) & reserve deployment (`Reserve Card`) produce verified gameplay effects
- [x] **B6.** Numerical superiority (`3:1`) produces decisive, explainable outcomes
- [x] **B7.** Defensive battles work cleanly and reliably from incoming threats
- [x] **B8.** `100` full battle sessions completed programmatically without release-blocking failures (`phase23-v2-gate.test.mjs`)
- [x] **B9.** `1,000` seeded combat balance scenarios pass automated checks (`phase23-v2-gate.test.mjs`)
- [x] **B10.** Casualties, captured commanders & warscore persist once to `WorldState` (`42/42` Phase 2 suite)
- [x] **B11.** Zero progressive WebGL2 memory leaks across repeated battle cycles (`phase17_perf_soak_smoke.py`)
- [ ] **B12.** Physical Windows (`8 GB`/`16 GB`) & M3 MacBook Air (`8 GB`) hardware FPS benchmarks completed

---

## Core Game & Deferred Siege Scope
- [x] **C1.** Global `1450–1600` campaign stable across `1,200`-month endurance & `50`-year AI telemetry soaks
- [x] **C2.** Dynasty, succession modes, regencies & personal unions verified (`20/20` Phase 10 suite)
- [x] **C3.** Rival kingdoms pursue coherent agendas with war cooldowns & anti-snowball coalitions
- [x] **C4.** Diplomacy, truces, peace treaties, 2-ruler comparison & warscore updates verified
- [x] **C5.** Crossroads Eras, Reign Chapters & dynamic 3-tier events (`3,051` events, `437` mandates) conclude cleanly
- [x] **S1 (Deferred).** Tactical 3D siege showcase removed/hidden from live campaign UI (`#battle-siege-showcase` hidden); strategic garrisons, forts & siege progress retained cleanly (full playable 3D sieges remain deferred post-V2.0)

## Living Capital & Economy
- [x] **L1.** All 10 capital levels render across 5 architectural stages (`TOWN_VISUAL_TIERS` I–V)
- [x] **L2.** Ghost placement previews, collision indicators, upgrades & movement work smoothly
- [x] **L3.** Readable **Economy Forecast Cards** (`Reserve`, `Delta/mo`, `Months Until Shortage` + progress bar + one-click steward fixes)
- [x] **L4.** Capital visuals reflect prosperity, famine, plague, or siege state

## UI/UX Overhaul, Audio & Onboarding (V2.0 Priority)
- [x] **U1.** Compact *Sunlit Illuminated Chronicle* HUD with 5 primary destinations (`Map`, `Crown`, `Capital`, `Army`, `More`) + live Steward Advice pill + `#resource-food`
- [x] **U2.** Compact Character Profile Card (`portrait`, `traits`, `5 stat shields`, `Spouse/Heir/Marshal/Family/Council/Actions`), 2-Ruler Facing Diplomacy card & Visual Regiment Recruitment cards
- [x] **U3.** Cinematic Start Screen with Featured Kingdom Cards & expandable full-atlas selector (`122` realms)
- [x] **U4.** Settings controls for Graphics Presets (`Low`, `Medium`, `High`), 4-Bus Audio (`Master`, `Music`, `SFX`, `Ambience`), and `5` UI locales (`src/i18n.js`)
- [ ] **U5.** Blind human onboarding & playtest cohort (`50–100` external players, `>= 80%` task completion — pending external human launch)

## Commercial & Store Validation (Website-First External Prerequisites)
- [ ] **M1.** Landing page, gameplay trailer (`60–90s`), & creator outreach (`~100` creators)
- [ ] **M2.** Paid commercial payment setup, privacy/refund/support pages & MIT vs commercial asset licensing separation reviewed
- [ ] **M3.** Offline Electron demo cleanly packaged (`dist/desktop-app/www` verified free of raw `assets/packs` & raw portrait bloat)
- [ ] **M4.** Physical Windows/macOS installer testing, code signing & optional future Steam onboarding
