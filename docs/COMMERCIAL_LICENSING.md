# Commercial Licensing & IP Ledger — Sovereign: 1450

**Brand Title:** Sovereign: 1450  
**Repository:** `crusaderkings` (`Sovereign: 1450` engine & runtime)  
**Target Distribution:** Web PWA, Playable Archive (`.zip`), Native Desktop (Electron `.exe` / `.dmg`), Android & iOS via Capacitor (`capacitor.config.json`)

---

## 1. Reconciling MIT Source License vs. Proprietary Brand & Assets

The repository root [LICENSE](../LICENSE) places the **software source code** under the **MIT License** (`Copyright (c) 2026 Crown of Nations contributors`), while third-party assets and custom project artwork retain their respective licenses and ownership:

| Layer | Scope | License / Ownership | Commercial Distribution Terms |
| :--- | :--- | :--- | :--- |
| **Game Engine & Runtime Code** | `src/*.js`, `src/content/*.js`, `scripts/*`, `index.html`, `styles.css`, `manifest.webmanifest`, `sw.js` | **MIT License** ([LICENSE](../LICENSE)) | Free for commercial and non-commercial use, modification, and redistribution provided the MIT copyright and permission notice are retained. Clean-room original implementation containing zero third-party grand-strategy scripts or proprietary IP. |
| **Custom Brand & Commissioned Art/Audio** | `assets/branding/*`, `assets/game-art/*`, `assets/battle/sprites/*`, `assets/ui/parchment/*`, `assets/icons/*`, `assets/video/*`, `assets/audio/music/*.mp3`, `assets/*.svg`, `assets/court-theme.css` | **Project-Owned Sovereign: 1450 Assets** | Exclusive project assets bundled for Sovereign: 1450 releases (not licensed for standalone resale as third-party asset packs). Note: verify music distribution rights in `assets/audio/AUDIO_README.txt` before commercial storefront upload. |
| **Third-Party CC0 Assets** | Kenney packs, Poly.ai Village Buildings, Feudal Wars, Foozle, Screaming Brain Studios, KayKit, Quaternius | **CC0 1.0 Universal** | Public domain dedication; commercial use permitted without mandatory attribution (credits included below as best practice). |
| **Third-Party CC-BY 4.0 / 3.0 Assets** | Cliopatria 1450 reference data, Polyfork 3D models, Bleed / Varkalandar hometown props | **CC-BY 4.0 / CC-BY 3.0** | Commercial use permitted **with mandatory attribution**, link to license, and indication of modifications. |
| **Public Domain Geodata** | Natural Earth coastlines/landmass (`assets/naturalearth/`, `data/world.json`) | **Public Domain** | Free for commercial and non-commercial use. |
| **Excluded Authoring Packs** | `assets/packs/*.zip`, `assets/packs/*.rar`, `assets/documents/*`, CC-BY-SA reference packs in `assets/CREDITS.TXT` | **Dev / Authoring Only** | **Excluded** from playable `.zip`, Capacitor `dist/mobile-www/`, and Electron `dist/desktop-app/www/`. Any CC-BY-SA source material is never shipped in proprietary commercial builds. |

---

## 2. Third-Party Open-Source Libraries

| Dependency | Purpose | License | Commercial Use |
| :--- | :--- | :--- | :--- |
| **Three.js** (`three@0.180.0`, bundled in `src/three-battle.bundle.js`) | Optional 3D battle primitives | MIT License | Allowed (retain MIT copyright notice) |
| **esbuild** (`0.25.12`, dev-only) | Bundler for `build:battle` | MIT License | Dev/CI only; not shipped |
| **Capacitor** (`capacitor.config.json` wrapper target) | iOS/Android native WebView shell | MIT License | Allowed |
| **Electron / electron-builder** (`dist/desktop-app/` target) | Windows `.exe` & macOS `.dmg` offline desktop wrapper | MIT License | Allowed (Chromium/Electron notices bundled automatically by `electron-builder`) |
| **Playwright / Node.js test harness** (dev-only) | Automated QA & endurance checks | Apache-2.0 / MIT | Dev/CI only; excluded from distribution |

---

## 3. Complete Third-Party Art, Audio & Geographic Provenance

### 3.1 Kenney Packs (CC0 1.0 Universal — Commercial Use Allowed)
- **Castle Kit 2.0** (`assets/battle/kenney/License.txt`, `assets/packs/kenney_castle-kit.zip`) — Created by Kenney (`www.kenney.nl`), CC0 1.0.
- **Impact Sounds 1.0** (`assets/audio/sfx/kenney_impact-sounds-LICENSE.txt`, `assets/audio/kenney_impact-sounds.zip`) — Selected combat SFX extracted to `assets/audio/sfx/`, CC0 1.0.
- **Interface Sounds 1.0** (`assets/audio/sfx/kenney_interface-sounds-LICENSE.txt`, `assets/audio/kenney_interface-sounds.zip`) — Selected UI SFX extracted to `assets/audio/sfx/`, CC0 1.0.
- **Fantasy UI Borders & UI Pack** (`assets/ui/kenney_fantasy-ui-borders.zip`, `assets/ui/kenney_ui-pack.zip`) — Kenney (`www.kenney.nl`), CC0 1.0.
- **Particle Pack & Cartography Pack** (`assets/packs/kenney_particle-pack.zip`, `assets/maps/kenney_cartography-pack.zip`) — Kenney (`www.kenney.nl`), CC0 1.0.

### 3.2 CC0 Village, Building, Character & Weapon Packs
- **City Builder: Village Buildings** (`assets/hometown/VILLAGE-LICENSE.txt`) — Generated with `polyy.ai`, **CC0 1.0 Universal**. Extracted 45-degree isometric building sprites into `assets/hometown/sprites/`.
- **Medieval Village MegaKit (Standard)** (`assets/medieval_village/Medieval Village MegaKit[Standard]/License_Standard.txt`) — Models by `@Quaternius`, **CC0 1.0 Universal**.
- **LowPoly Medieval Weapons & Models** (`assets/packs/License.txt`, `assets/packs/License (1).txt`) — `@Quaternius`, **CC0 1.0 Universal**.
- **KayKit Adventurers Character Pack 1.0** (`assets/battle/characters/LICENSE.txt`, `Knight.glb`, `Rogue_Hooded.glb`) — Kay Lousberg (`www.kaylousberg.com`), **CC0 1.0 Universal**.
- **Feudal Wars Isometric Medieval Buildings** (`assets/CREDITS.TXT`, `assets/CREDITS (2).TXT`, `assets/archery_range.png`, `assets/barracks.png`, `assets/blacksmith.png`, `assets/castle.png`, `assets/stable.png`, `assets/house1*.png`) — `feudalwars` via OpenGameArt, **CC0 1.0**.
- **Foozle Isometric Gold Mine 1** (`assets/hometown/CREDITS.txt`) — Foozle (`foozlecc.itch.io/isometric-gold-mine-1`), **CC0 1.0**.
- **Screaming Brain Studios Isometric Overworld & Pathways** (`assets/hometown/CREDITS.txt`) — Screaming Brain Studios (`screamingbrainstudios.itch.io/iso-overworld-pack`), **CC0 1.0**.
- **DawnBlocker Palette & Rubberduck Isometric Buildings** (`assets/CREDITS (1).TXT`, `assets/CREDITS.TXT`) — `surt` & `rubberduck` via OpenGameArt, **CC0 1.0**.

### 3.3 Cliopatria & Natural Earth Geographic Boundaries
- **Natural Earth (`assets/naturalearth/`, `data/world.json`)** — Public Domain (`naturalearthdata.com/about/terms-of-use/`). Supplies coastline and landmass geometry; playable campaign province boundaries are synthetic districts.
- **Cliopatria Historical Atlas (`assets/cliopatria/cliopatria-main/LICENSE.md`, `data/historical-polities-1450.json`)** — **CC-BY 4.0 International**. Used strictly as historical polity reference approximations for the 1450 reference overlay and starting polity context. Modern Natural Earth national borders are **never** presented as 1450 borders.

### 3.4 CC-BY 4.0 / CC-BY 3.0 Runtime Models & Hometown Props (Attribution Required)
- **Polyfork 3D Models (`assets/characters_3d/LICENSE-Polyfork.txt`)** — *Ashigaru Foot Soldier* (`ashigaru-foot-soldier-806707.glb`) and *Daimyo Lord* (`daimyo-lord-78364a.glb`) by Polyfork, **CC-BY 4.0** (`https://polyfork.dev/asset/ashigaru-foot-soldier-806707`, `https://polyfork.dev/asset/daimyo-lord-78364a`), source files unchanged.
- **Bleed's Game Art (`assets/hometown/CREDITS.txt`)** — *Medieval Cart Prop* (**CC-BY 4.0**, `https://opengameart.org/content/medieval-cart-prop`) and *Villager_01* (**CC-BY 3.0**, `https://opengameart.org/content/villager01-bleeds-game-art`); sprites cropped/resized/compressed into `assets/hometown/sprites/`.
- **Hansjörg Malthaner / Varkalandar (`assets/hometown/CREDITS.txt`)** — *Isometric Crops and Farmland* (**CC-BY 4.0**, `https://opengameart.org/content/isometric-crops-and-farmland`); sprites cropped/resized/compressed into `assets/hometown/sprites/`.

---

## 4. Required Store & In-Game Attribution Notice

Include the following attribution block in the in-game About/Credits panel, desktop installer README, and mobile/PC store metadata (`Steam`, `itch.io`, `Google Play`, `Apple App Store`):

> *Sovereign: 1450 engine source code is licensed under the MIT License; custom Sovereign: 1450 artwork, branding, UI parchment, and soundtrack assets are proprietary to the project. Geographic coastlines derive from Natural Earth (Public Domain), and 1450 historical polity overlays incorporate reference boundaries from the Cliopatria historical atlas (CC-BY 4.0, modified for campaign scale). Additional runtime 3D/2D assets include Ashigaru Foot Soldier & Daimyo Lord by Polyfork (CC-BY 4.0), Medieval Cart Prop (CC-BY 4.0) & Villager_01 (CC-BY 3.0) by Bleed's Game Art (cropped/compressed), Isometric Crops and Farmland by Hansjörg Malthaner / Varkalandar (CC-BY 4.0, cropped/compressed), and CC0 1.0 assets by Kenney (www.kenney.nl), Kay Lousberg (KayKit), Quaternius, polyy.ai, Foozle, Feudal Wars, and Screaming Brain Studios.*
