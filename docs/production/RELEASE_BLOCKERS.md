# Sovereign 1450 — Prioritized Release Blockers Register

**Status Key:** `P0` = Critical Crash / Blocker · `P1` = Major Commercial / Architecture Blocker · `P2` = Significant Quality / Scope Blocker

---

| ID | Severity | Area | Verified Blocker Description | Resolution Phase |
| :--- | :---: | :--- | :--- | :---: |
| **BLK-01** | **P1** | Repo Hygiene & Pinning | Working-tree 3,051-event expansion (`src/content/` + `assets/battle/arenas/` + Phase 1 docs) is not yet pinned in a clean commit on `main`. (`mobile_browser_smoke.py` & `warfare_browser_smoke.py` now **PASS** on Phase 1 audit.) | **Phase 1 / Phase 2** |
| **BLK-02** | **P1** | 3D Battles Disabled | `src/main.js:319` forces `desc.bannerView = true`, bypassing `ThreeBattleScene` in `src/battle.js:598` in favor of 2D `BannerRenderer`. | **Phase 4** |
| **BLK-03** | **P1** | `0 A.D.` GLB Loader Gap | `src/glb-art.js` skips `EXT_meshopt_compression` and lacks skeletal skinning; `src/three-battle-scene.js` currently uses only KayKit EU infantry + primitive cube horses (`createHorse()`), with no `0ad-art-glb` (`mobile/` meshopt) loader yet. | **Phase 3 / Phase 4** |
| **BLK-04** | **P1** | License Register Conflict | `docs/COMMERCIAL_LICENSING.md` currently prohibits `CC BY-SA` runtime art; community mods (`xiiiad` no license, `millenniumad`/`aristeia` root GPL only) lack clearance; music commercial rights in `assets/audio/` need explicit verification before Steam upload. | **Phase 1 (policy) / Phase 3 / Phase 15** |
| **BLK-05** | **P1** | 3D Siege Missing | Sieges currently render only in 2D (`BannerRenderer`); Hometown's 64-plot capital layout does not yet drive 3D siege fortifications, traversable wall/gate breaches, or persistent building damage write-back. | **Phase 7** |
| **BLK-06** | **P1** | Repo Bloat & Portrait Quality | `assets/portraits/` contains **451 MB** of 8–9 MB uncompressed `Gemini_Generated_Image_*.png` PNGs (Steam AI-slop + RAM risk), `assets/packs/` holds **1.3 GB** raw archives, `source/` holds **731 MB** temple GLBs, plus duplicate `(1)` files and 3 UTF-8 ellipsis filenames. | **Phase 14 / Phase 17** |
| **BLK-07** | **P1** | Unmerged Branch Bugfixes | `origin/operation-ck2/multi-front-vassals` contains a missing retinue resurrection guard (`live(g,actor).realm!==r` in `src/estate-conflicts.js`) and autonomous multi-front test missing on `main`. | **Phase 2** |
| **BLK-08** | **P1** | Steamworks & Desktop Hardware | `dist/desktop-app/` lacks `steamworks.js` / Steam depot setup, code signing (Windows Authenticode + Apple notarization), and physical Windows PC / 8 GB M3 memory leak testing across 20+ 3D battles. | **Phase 17 / Phase 18 / Phase 23 / Phase 24** |
| **BLK-09** | **P2** | Onboarding, Pacing & Tooltips | 3,051 events lack 3-tier interruption pacing (`Critical / Important / Chronicle`), HUD tooltips in `campaign-hud.js` are flat 1-line strings rather than 3-level lockable tooltips, and there is no guided 15-minute Vijayanagara opening yet. | **Phase 12 / Phase 13 / Phase 16** |
