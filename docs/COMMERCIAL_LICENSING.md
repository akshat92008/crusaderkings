# Commercial Licensing & Original IP Ledger — Sovereign: 1450

**Brand Title:** Sovereign: 1450  
**Repository:** `crusaderkings` (`Sovereign: 1450` engine & runtime)  
**Target Distribution:** Web PWA, Playable Archive (`.zip`), Android & iOS via Capacitor wrapper (`capacitor.config.json`)

---

## 1. Engine & Source Code License

- **Proprietary / Custom Game Logic (`src/`, `scripts/`, `styles.css`, `index.html`, `manifest.webmanifest`, `sw.js`):** Authored originally for this project. All mechanics—including **Crossroads Eras (1450–1600)**, **Monarch Reign Chapters & Epithets**, **The Crown Dispatch**, asymmetric government simulation, and Banner Lines tactical presentation—are original clean-room implementations containing zero Paradox Interactive script files, prose, portraits, or binary assets.
- **No Third-Party Proprietary Grand-Strategy IP:** No historical names, geographical labels, or general feudal/diplomatic terms are copied from proprietary scripts; `historical-polities-1450.json` provenance uses public-domain geographic sources cited below.

---

## 2. Bundled Libraries & Permissive Open-Source Dependencies

| Dependency / Asset | Purpose | License | Commercial Use |
| :--- | :--- | :--- | :--- |
| **Three.js / bundled WebGL libs** (if referenced in battle track) | 3D rendering primitives | MIT License | Allowed (retain copyright/MIT notice) |
| **Capacitor** (`capacitor.config.json` wrapper target) | iOS/Android native WebView shell | MIT License | Allowed |
| **Playwright / Node.js test harness** (dev-only) | Automated QA & endurance checks | Apache-2.0 / MIT | Dev/CI only; excluded from distribution |

---

## 3. Map, Geographic Data & Media Assets

| Asset Category | Source & Provenance | Commercial Status |
| :--- | :--- | :--- |
| **Natural Earth / Cliopatria 1450 reference boundaries** (`data/world.json`, `data/historical-polities-1450.json`) | Derived from Natural Earth (Public Domain) & Seshat/Cliopatria open historical atlas datasets (CC-BY 4.0 attribution) | Allowed with attribution |
| **Brand Logo & Icons** (`assets/branding/*`) | Custom commissioned Sovereign: 1450 emblem | Exclusive project asset |
| **2D Portraits, Event Scenes, Emblem Tiles, Terrain** (`assets/game-art/*`, `assets/maps/*`) | Project-owned generated artwork (`scripts/build_game_art.py`) | Exclusive project asset |
| **Soundtrack & Audio (`assets/audio/music/*.mp3`)** | User-supplied / commissioned Sovereign: 1450 score (11 MP3 tracks + WebAudio/SFX) | Bundled for release distribution |
| **UI & Emblem SVGs** (`assets/*.svg`) | Project-authored SVGs | Exclusive project asset |

---

## 4. Attribution Notice for Store Builds & About Screen

Include the following notice in store metadata (`Google Play`, `Apple App Store`) and release packages:
> *Sovereign: 1450 includes border approximations informed by Natural Earth (Public Domain) and Cliopatria historical atlas datasets (CC-BY 4.0). Software components use MIT-licensed libraries where applicable.*
