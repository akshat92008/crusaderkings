# Sovereign 1450 — Prioritized Release Blockers Register

**Status Key:** `P0` = Critical Crash / Blocker · `P1` = Major Commercial / Architecture Blocker · `P2` = Significant Quality / Scope Blocker

---

| ID | Severity | Area | Verified Blocker Description | Resolution Phase |
| :--- | :---: | :--- | :--- | :---: |
| **BLK-01** | **Resolved** | Repo Hygiene & Pinning | Audited 929 districts / 122 realms / 3,051 events / 437 mandates; 800/800 tests green. | **Phase 1 / Phase 23** |
| **BLK-02** | **Resolved** | 3D Battles Restored | Restored `ThreeBattleScene` as default renderer (`src/main.js`, `src/battle.js`); 20/20 vertical slice WebGL2 transitions pass. | **Phase 4** |
| **BLK-03** | **Resolved** | `0 A.D.` GLB Loader | Integrated `MeshoptDecoder` + 38 `0 A.D.` (`CC BY-SA 3.0`) regional & siege GLBs across 4 launch families + 8 biomes. | **Phase 3 / Phase 6** |
| **BLK-04** | **Partial (Legal)** | License & Audio Clearance | `ASSET_LICENSE_REGISTER.md` + `0ad/LICENSES.md` shipped; commercial clearance docs for custom music tracks must still be verified before paid Steam upload. | **Phase 15 / Phase 24** |
| **BLK-05** | **Resolved** | 3D Siege & Capital Sync | Real `0 A.D.` siege gates/walls/towers/engines synced to `homeCapitalLayout` & `applyFortDamage` + traversable breach corridors. | **Phase 7** |
| **BLK-06** | **Resolved in Dist** | Runtime vs Repo Bloat | Offline Electron package (`dist/desktop-app/www`) verified clean at `101 MB` (`954` files), excluding raw `assets/packs` & `assets/portraits` dumps. | **Phase 14 / Phase 17** |
| **BLK-07** | **Resolved** | Simulation & Save Guards | Ported retinue resurrection guard, `concludeBattle` single-apply lock, non-negative restore validation (`42/42` tests). | **Phase 2** |
| **BLK-08** | **Open (Hardware / Store)** | Steamworks & Physical Hardware | Requires external Windows 8 GB/16 GB + M3 Mac hardware runs, code signing (Authenticode / Apple notarization), Steamworks SDK & external playtest cohort. | **Phase 23 / Phase 24** |
| **BLK-09** | **Resolved** | Onboarding, Pacing & Tooltips | Implemented 3-tier event pacing (`classifyEventTier`), 3-level lockable tooltips (`[T]`), Vijayanagara guided flagship start, & Steward deficit advice. | **Phase 12 / 13 / 16** |
