# Release acceptance — Crown of Nations

Run from the repository root with Node 22 and Python 3.11:

```sh
npm ci
npm run check
npm test
python -m pip install playwright
python -m playwright install chromium
python scripts/mobile_browser_smoke.py
````

The release campaign tests run the default atlas through 60 months with save/restore checkpoints. Browser QA checks desktop and 390/320px mobile views, map controls, practice battle, audio toggle and backup export/import. Results are attached to GitHub Actions. Passing source checks alone does not establish release readiness.

## Manual acceptance before release

- Play one normal and one hard campaign for at least 10 years; test invasion defense, retreat, diplomacy, succession, economy and naval voyages.
- On actual Android and iOS devices, inspect text readability, pinch zoom, touch orders, sustained frame rate, memory and battery use. Verify desktop Chromium, Firefox and Safari.
- Inspect battlefield screenshots and listen to audio with headphones; validate contrast, character animation, performance and no siege scenery in field battles.
- Confirm backup import across legacy and default atlas versions, no console errors, no broken assets, licenses and deployment smoke test.

Do not tag a stable release until these checks pass on the exact release commit. Keep the scope single-player, open-field tactical battles, approximate alternate-history campaign. No siege/base building or multiplayer requirement.
