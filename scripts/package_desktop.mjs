import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'dist', 'desktop-app');
const WWW = path.join(OUT, 'www');

const rootPkg = JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8'));
const version = rootPkg.version || '0.1.0';

fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(WWW, { recursive: true });

const topFiles = [
 'index.html', 'styles.css', 'manifest.webmanifest', 'sw.js', 'LICENSE',
 'docs/HISTORICAL_CONTEXT.md', 'docs/COMMERCIAL_LICENSING.md', 'docs/HOMETOWN.md',
 'docs/production/ASSET_LICENSE_REGISTER.md',
 'docs/production/MOD_ASSET_LEGAL_AUDIT.md',
 'docs/production/0ad_asset_provenance.json'
];

const copyDirs = [
 'src', 'data', 'assets/branding', 'assets/game-art', 'assets/hometown',
 'assets/battle/sprites', 'assets/battle/characters', 'assets/battle/0ad',
 'assets/battle/arenas', 'assets/ui/parchment',
 'assets/audio/music', 'assets/audio/sfx', 'assets/icons', 'assets/video',
 'assets/characters_3d', 'assets/terrain'
];

const explicitAssets = [
 'assets/favicon.svg', 'assets/court-theme.css', 'assets/hometown.css',
 'assets/court-compass.svg', 'assets/monarch-crest.svg',
 'assets/archery_range.png', 'assets/barracks.png', 'assets/blacksmith.png', 'assets/castle.png',
 'assets/stable.png', 'assets/watchtower_wooden_full_size.png', 'assets/house1.png', 'assets/house1b.png', 'assets/house1c.png'
];

function copyFileRel(rel) {
 const src = path.join(ROOT, rel);
 if (!fs.existsSync(src)) return 0;
 const dst = path.join(WWW, rel);
 fs.mkdirSync(path.dirname(dst), { recursive: true });
 fs.copyFileSync(src, dst);
 return 1;
}

function walkCopy(dirRel) {
 const base = path.join(ROOT, dirRel);
 if (!fs.existsSync(base)) return 0;
 let count = 0;
 for (const entry of fs.readdirSync(base, { withFileTypes: true })) {
  const rel = path.join(dirRel, entry.name);
  if (entry.isDirectory()) count += walkCopy(rel);
  else count += copyFileRel(rel);
 }
 return count;
}

let copied = 0;
for (const f of [...topFiles, ...explicitAssets]) copied += copyFileRel(f);
for (const d of copyDirs) copied += walkCopy(d);

const desktopPkg = {
 name: 'sovereign-1450-desktop',
 productName: 'Reign 1450',
 version,
 description: 'Reign 1450 — offline native desktop wrapper for Windows and macOS.',
 main: 'main.js',
 private: true,
 license: 'MIT',
 scripts: {
  start: 'electron .',
  'pack:dir': 'electron-builder --dir',
  'dist:win': 'electron-builder --win nsis portable',
  'dist:mac': 'electron-builder --mac dmg zip',
  'dist:linux': 'electron-builder --linux AppImage tar.gz'
 },
 devDependencies: {
  electron: '^33.2.0',
  'electron-builder': '^25.1.8'
 },
 build: {
  appId: 'com.sovereign1450.desktop',
  productName: 'Reign 1450',
  asar: true,
  directories: { output: 'release' },
  files: ['main.js', 'preload.js', 'www/**/*'],
  win: {
   target: [{ target: 'nsis', arch: ['x64'] }, { target: 'portable', arch: ['x64'] }],
   icon: 'www/assets/branding/icon-512.png'
  },
  nsis: {
   oneClick: false,
   allowToChangeInstallationDirectory: true,
   createDesktopShortcut: true
  },
  mac: {
   target: [{ target: 'dmg', arch: ['arm64', 'x64'] }, { target: 'zip', arch: ['arm64', 'x64'] }],
   category: 'public.app-category.strategy-games',
   icon: 'www/assets/branding/icon-512.png'
  },
  linux: {
   target: ['AppImage', 'tar.gz'],
   category: 'Game'
  }
 }
};

const electronMain = `const { app, BrowserWindow, ipcMain, protocol } = require('electron');
const fs = require('node:fs');
const path = require('node:path');

const WWW_ROOT = path.join(__dirname, 'www');
const MIME_TYPES = {
 '.html': 'text/html; charset=utf-8',
 '.js': 'application/javascript; charset=utf-8',
 '.mjs': 'application/javascript; charset=utf-8',
 '.css': 'text/css; charset=utf-8',
 '.json': 'application/json; charset=utf-8',
 '.webmanifest': 'application/manifest+json; charset=utf-8',
 '.svg': 'image/svg+xml',
 '.png': 'image/png',
 '.jpg': 'image/jpeg',
 '.jpeg': 'image/jpeg',
 '.webp': 'image/webp',
 '.mp3': 'audio/mpeg',
 '.ogg': 'audio/ogg',
 '.mp4': 'video/mp4',
 '.glb': 'model/gltf-binary',
 '.md': 'text/markdown; charset=utf-8',
 '.txt': 'text/plain; charset=utf-8'
};

protocol.registerSchemesAsPrivileged([
 {
  scheme: 'app',
  privileges: { standard: true, secure: true, supportFetchAPI: true, corsEnabled: true, stream: true }
 }
]);

function getSaveDir() {
 const dir = path.join(app.getPath('userData'), 'saves');
 fs.mkdirSync(dir, { recursive: true });
 return dir;
}

function sanitizeSlot(slot) {
 const clean = String(slot || 'autosave').replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 48);
 return (clean || 'autosave') + '.json';
}

function resolveOfflineAsset(requestUrl) {
 const u = new URL(requestUrl);
 let rel = decodeURIComponent(u.pathname || '/');
 if (rel === '/' || rel === '') rel = '/index.html';
 const target = path.resolve(WWW_ROOT, rel.replace(/^\\/+/, ''));
 if (!target.startsWith(WWW_ROOT + path.sep) && target !== WWW_ROOT) return null;
 if (fs.existsSync(target) && fs.statSync(target).isFile()) return target;
 return path.join(WWW_ROOT, 'index.html');
}

function createWindow() {
 const win = new BrowserWindow({
  width: 1440,
  height: 900,
  minWidth: 1024,
  minHeight: 680,
  title: 'Reign 1450',
  backgroundColor: '#0a1114',
  icon: path.join(WWW_ROOT, 'assets/branding/icon-512.png'),
  autoHideMenuBar: true,
  webPreferences: {
   contextIsolation: true,
   nodeIntegration: false,
   sandbox: true,
   preload: path.join(__dirname, 'preload.js')
  }
 });

 win.webContents.setWindowOpenHandler(() => ({ action: 'deny' }));
 win.webContents.on('will-navigate', (event, targetUrl) => {
  if (!targetUrl.startsWith('app://')) event.preventDefault();
 });
 win.loadURL('app://sovereign/index.html');
}

app.whenReady().then(() => {
 getSaveDir();
 protocol.handle('app', async (request) => {
  const filePath = resolveOfflineAsset(request.url);
  if (!filePath) return new Response('Forbidden', { status: 403 });
  const ext = path.extname(filePath).toLowerCase();
  const data = await fs.promises.readFile(filePath);
  return new Response(data, {
   status: 200,
   headers: { 'content-type': MIME_TYPES[ext] || 'application/octet-stream' }
  });
 });

 ipcMain.handle('sovereign:save-dir', () => getSaveDir());
 ipcMain.handle('sovereign:list-saves', () => {
  const dir = getSaveDir();
  return fs.readdirSync(dir).filter(f => f.endsWith('.json')).sort();
 });
 ipcMain.handle('sovereign:write-save', (_evt, slot, payload) => {
  const file = path.join(getSaveDir(), sanitizeSlot(slot));
  fs.writeFileSync(file, String(payload || ''), 'utf8');
  return { ok: true, file };
 });
 ipcMain.handle('sovereign:read-save', (_evt, slot) => {
  const file = path.join(getSaveDir(), sanitizeSlot(slot));
  if (!fs.existsSync(file)) return null;
  return fs.readFileSync(file, 'utf8');
 });

 createWindow();
 app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
 });
});

app.on('window-all-closed', () => {
 if (process.platform !== 'darwin') app.quit();
});
`;

const electronPreload = `const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('sovereignDesktop', {
 platform: process.platform,
 getSaveDir: () => ipcRenderer.invoke('sovereign:save-dir'),
 listSaves: () => ipcRenderer.invoke('sovereign:list-saves'),
 writeSave: (slot, payload) => ipcRenderer.invoke('sovereign:write-save', slot, payload),
 readSave: (slot) => ipcRenderer.invoke('sovereign:read-save', slot)
});
`;

fs.writeFileSync(path.join(OUT, 'package.json'), JSON.stringify(desktopPkg, null, 2) + '\n', 'utf8');
fs.writeFileSync(path.join(OUT, 'main.js'), electronMain, 'utf8');
fs.writeFileSync(path.join(OUT, 'preload.js'), electronPreload, 'utf8');

console.log(`Built offline desktop Electron bundle at ${OUT} (${copied} runtime files copied to www/).`);
