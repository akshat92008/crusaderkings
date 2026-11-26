import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'dist', 'mobile-www');

fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });

const topFiles = [
 'index.html', 'styles.css', 'manifest.webmanifest', 'sw.js',
 'docs/HISTORICAL_CONTEXT.md', 'docs/COMMERCIAL_LICENSING.md', 'docs/HOMETOWN.md'
];

const copyDirs = [
 'src', 'data', 'assets/branding', 'assets/game-art', 'assets/hometown', 'assets/audio/music', 'assets/battle/characters'
];

const explicitAssets = [
 'assets/favicon.svg', 'assets/court-theme.css', 'assets/hometown.css', 'assets/court-compass.svg', 'assets/monarch-crest.svg',
 'assets/archery_range.png', 'assets/barracks.png', 'assets/blacksmith.png', 'assets/castle.png',
 'assets/stable.png', 'assets/watchtower_wooden_full_size.png', 'assets/house1.png', 'assets/house1b.png', 'assets/house1c.png',
 'assets/icons/Strategy_game_trait_icon_sheet_807567b6.jpg',
 'assets/icons/Character_trait_icon_sheet_fe2300f5.jpg',
 'assets/icons/Medieval_strategy_game_skill_icons_c1080878.jpg',
 'assets/icons/Medieval_political_office_icon_s…_7042e0b0.jpg',
 'assets/icons/Create_historical_strategy_game_…_7e8a58fa.jpg',
 'assets/icons/Medieval_strategy_game_icon_sheet_8967b69f.jpg',
 'assets/video/Medieval_war_table_map_animation_ac51bb4b.mp4',
 'assets/characters_3d/ashigaru-foot-soldier-806707.glb',
 'assets/characters_3d/daimyo-lord-78364a.glb',
 'assets/characters_3d/LICENSE-Polyfork.txt'
];

function copyFileRel(rel) {
 const src = path.join(ROOT, rel);
 if (!fs.existsSync(src)) return 0;
 const dst = path.join(OUT, rel);
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
console.log(`Built Capacitor webDir at ${OUT} (${copied} runtime files copied).`);
