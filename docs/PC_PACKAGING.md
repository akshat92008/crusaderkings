# Native PC Desktop Packaging — Sovereign: 1450

`Sovereign: 1450` ships a self-contained offline Electron desktop wrapper generated into `dist/desktop-app/` via `scripts/package_desktop.mjs`, ready for `electron-builder` packaging into Windows NSIS (`.exe`), Windows Portable (`.exe`), macOS Disk Image (`.dmg`), and Linux `AppImage`.

---

## 1. Generating the Offline Desktop App Bundle

From the repository root:

```sh
node scripts/package_desktop.mjs
```

This creates `dist/desktop-app/` with:

- `package.json`: Electron (`^33.2.0`) + `electron-builder` (`^25.1.8`) manifest configured with `appId: "com.sovereign1450.desktop"`, ASAR packaging, NSIS installer options, macOS universal (`arm64` + `x64`) DMG targets, and `icon-512.png`.
- `main.js`:
  - Registers a privileged `app://` custom protocol (`protocol.handle('app', ...)`) that resolves all game files strictly inside `www/` with path-traversal protection and accurate MIME types—allowing ES modules, `fetch('data/world.json')`, WebAudio MP3s, WebP spritesheets, and WebGL/Canvas2D to run **100% offline** with no local HTTP server or `file://` CORS issues.
  - Initializes a persistent `saves/` directory inside Electron's OS-standard `app.getPath('userData')` (`%APPDATA%/Sovereign 1450/saves` on Windows, `~/Library/Application Support/Sovereign 1450/saves` on macOS) and exposes sandboxed IPC handlers (`sovereign:save-dir`, `sovereign:list-saves`, `sovereign:write-save`, `sovereign:read-save`).
  - Blocks external navigation and `window.open` popups outside `app://`.
- `preload.js`: Exposes `window.sovereignDesktop` via `contextBridge` with `contextIsolation: true`, `nodeIntegration: false`, and `sandbox: true`.
- `www/`: Complete offline runtime copy of `index.html`, `styles.css`, `src/`, `data/`, `assets/` runtime folders (`branding`, `game-art`, `hometown`, `battle/sprites`, `battle/characters`, `ui/parchment`, `audio/music`, `audio/sfx`, `icons`, `video`, `characters_3d`), excluding authoring ZIP/RAR/7z archives in `assets/packs/`, `assets/documents/`, and `assets/notes/`.

---

## 2. Building Native `.exe` and `.dmg` Installers

Install Electron dependencies inside `dist/desktop-app/` and invoke `electron-builder`:

```sh
cd dist/desktop-app
npm install
```

### Run locally in Electron (dev smoke)

```sh
npm start
```

### Build Windows Installer (`.exe` NSIS + Portable)

```sh
npm run dist:win
```

Outputs are written to `dist/desktop-app/release/` (e.g., `Sovereign 1450 Setup <version>.exe` and portable `.exe`). Note: building Windows NSIS installers on macOS/Linux requires Wine or Windows CI runners (`windows-latest`).

### Build macOS Disk Image (`.dmg` + `.zip`)

```sh
npm run dist:mac
```

Outputs `.dmg` and `.zip` bundles under `dist/desktop-app/release/`. Building macOS `.dmg` targets requires a macOS host (`macos-latest`).

### Build Linux Package (`AppImage` + `.tar.gz`)

```sh
npm run dist:linux
```

---

## 3. Code Signing, Storefronts & What Cannot Be Verified on Headless CI

The following release steps **cannot** be verified by headless CI or `scripts/package_desktop.mjs` alone and require dedicated native build environments and hardware:

1. **Windows Physical PC & NSIS Installer Verification:** Headless macOS/Linux environments cannot run Windows SmartScreen, Windows Defender heuristics, physical NSIS install/uninstall registry checks, or DirectX/ANGLE GPU driver validation on Windows 10/11 hardware.
2. **Authenticode & Apple Developer ID Code Signing / Notarization:** Unsigned `.exe` and `.dmg` builds trigger OS security warnings ("Windows protected your PC" / macOS Gatekeeper). Production releases require setting `CSC_LINK` / `CSC_KEY_PASSWORD` (Windows EV/OV cert) and Apple Developer ID + `notarytool` credentials (`APPLE_ID`, `APPLE_APP_SPECIFIC_PASSWORD`, `APPLE_TEAM_ID`).
3. **Steamworks SDK Integration:** This repository does not include Valve's proprietary Steamworks SDK (`steam_api64.dll` / `steamworks.js`), Steam Overlay hooks, Steam Cloud save sync, or Steam Achievements. Wrapping for Steam requires integrating Steamworks in a private release branch and testing with the Steam client (`steam_appid.txt`).
4. **Physical Display, High-DPI & Audio Hardware Testing:** Fullscreen/borderless window scaling across 1080p/1440p/4K monitors, multi-monitor cursor lock, and physical speaker/headphone audio levels must be manually verified on target desktop hardware.
