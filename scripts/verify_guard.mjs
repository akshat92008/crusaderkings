import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { spawnSync } from 'node:child_process';

const check = spawnSync(process.execPath, ['scripts/check-sources.mjs'], { stdio: 'inherit' });
if (check.status !== 0) process.exit(check.status || 1);

const manifestPath = 'assets/battle/sprites/manifest.json';
if (!existsSync(manifestPath)) {
  console.error('Missing 2D Banner Lines sprite manifest:', manifestPath);
  process.exit(1);
}
const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
for (const [key, entry] of Object.entries(manifest.units || {})) {
  if (!existsSync(entry.url)) {
    console.error('Missing battle unit sprite sheet:', key, entry.url);
    process.exit(1);
  }
}
for (const [key, url] of Object.entries(manifest.extras || {})) {
  if (!existsSync(url)) {
    console.error('Missing battle FX sprite:', key, url);
    process.exit(1);
  }
}
for (const [cult, units] of Object.entries(manifest.cultures || {})) {
  for (const [key, entry] of Object.entries(units || {})) {
    if (!existsSync(entry.url)) {
      console.error('Missing civilization battle sprite:', cult, key, entry.url);
      process.exit(1);
    }
  }
}

console.log(`Source & 2D Banner Lines asset checks passed (${readdirSync('src').length} src entries, ${Object.keys(manifest.units || {}).length} default + ${Object.keys(manifest.cultures || {}).length} culture sprite sets).`);
