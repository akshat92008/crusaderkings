# Release acceptance — Sovereign: 1450

Run from the repository root with Node 22 and Python 3.11:

```sh
npm ci
npm run verify:guard
npm run check
npm test
python3 scripts/package_playable.py
python3 scripts/check_release_package.py
node scripts/build_mobile_www.mjs
```

Browser QA commands:

```sh
python -m pip install playwright
python -m playwright install chromium firefox webkit
python scripts/mobile_browser_smoke.py
```

The release endurance suite checks full multi-year campaigns, save/restore round-trips, title integrity, and determinism. Run 100-year (`1200`) and 300-year (`3600`) endurance checks on dense & global worlds:

```sh
CROWN_ENDURANCE_MONTHS=1200 node --test tests/release-endurance.test.mjs
CROWN_ENDURANCE_MONTHS=3600 node --test tests/release-endurance.test.mjs
```

Browser QA checks desktop campaign play and backup export/import in Chromium, Firefox, and Playwright WebKit. Chromium also covers 390/320px mobile views, touch orders, practice battle and its audio controls. Results are attached to GitHub Actions. Passing source checks alone does not establish release readiness.

## Manual acceptance before release

- Play one normal and one hard campaign for at least 10 years; test invasion defense, retreat, diplomacy, succession, economy and naval voyages.
- On actual Android and iOS devices, inspect text readability, pinch zoom, touch orders, sustained frame rate, memory and battery use. Verify desktop Chromium, Firefox and Safari.
- Inspect battlefield screenshots and listen to audio with headphones; validate contrast, character animation, performance and no siege scenery in field battles.
- Confirm backup import across legacy and default atlas versions, no console errors, no broken assets, licenses and deployment smoke test.

Do not tag a stable release until these checks pass on the exact release commit. Keep the scope single-player, open-field tactical battles, approximate alternate-history campaign. No siege/base building or multiplayer requirement.
