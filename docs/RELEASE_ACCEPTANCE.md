# Release Acceptance — Sovereign: 1450

Run from the repository root with Node 22 and Python 3.11+:

```sh
npm ci
npm run verify:guard
npm run check
npm test
python3 scripts/audit_release_assets.py
python3 scripts/package_playable.py
python3 scripts/check_release_package.py
node scripts/build_mobile_www.mjs
node scripts/package_desktop.mjs
```

## Architecture Scope Covered by Acceptance

- **CK2 Parchment UI & Grand Strategy Campaign:** `assets/court-theme.css`, `assets/ui/parchment/*`, economic transparency tooltips (`formatTreasuryTooltip`, `formatStabilityTooltip`), 5-tier feudal titles, council voting, dynastic succession, royal court & 3,051 events / 437 decisions & mandates, plus the **2D Living Capital** (`Hometown`) settlement loop.
- **2D Isometric Banner Lines Field Battles:** `src/banner-renderer.js` + `src/simple-card-battle.js` + `assets/battle/sprites/manifest.json` cultural unit spritesheets (default + regional rosters), deployment presets, reserves, and directional formations.
- **2D Playable Fortress Sieges:** `#battle-siege-showcase` (`siegeMode: true, fortLevel: 2`) and fortified campaign province battles (`fort > 0`), tracking gate/tower structure HP (`#battle-fort-status`), breach resolution, and post-siege fort damage (`applyFortDamage`).

## Endurance Verification Commands

The release endurance suite verifies multi-century campaigns, save/restore round-trips, title hierarchy integrity, and determinism across dense & global worlds:

```sh
CROWN_ENDURANCE_MONTHS=1200 node --test tests/release-endurance.test.mjs
CROWN_ENDURANCE_MONTHS=3600 node --test tests/release-endurance.test.mjs
```

## Browser QA Commands

```sh
python3 -m pip install playwright
python3 -m playwright install chromium firefox webkit
python3 scripts/mobile_browser_smoke.py
python3 scripts/battle_browser_smoke.py
python3 scripts/warfare_browser_smoke.py
```

Browser QA verifies desktop campaign play, topbar HUD & portraits, backup export/import, allied field contingents, vassal career mode, 2D Hometown construction/progression, and 2D Banner Lines battle deployment/reserves/audio in Chromium, Firefox, and Playwright WebKit (with Chromium additionally covering `390x844` and `320x640` touch viewports). Passing source checks alone does not establish release readiness.

## Manual Acceptance Before Tagging a Release

- Play one normal and one hard campaign for at least 10 years; test invasion defense, open-field and fortified siege battles, retreat, diplomacy, succession, economy tooltips, and naval voyages.
- Inspect `docs/ASSET_MANIFEST.md` (regenerated via `python3 scripts/audit_release_assets.py`) and `docs/COMMERCIAL_LICENSING.md` to ensure all bundled runtime assets match approved licenses and attribution notices.
- On actual Windows/macOS desktop builds (`docs/PC_PACKAGING.md`) and Android/iOS devices (`dist/mobile-www/`), verify text readability, window/touch scaling, sustained frame rate, audio mix, and local save persistence.
- Confirm backup import across legacy and default atlas versions, zero console errors, zero broken asset URLs, and clean CI status on the exact release commit.
