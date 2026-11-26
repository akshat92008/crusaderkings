import { readdirSync } from 'node:fs';
import { spawnSync } from 'node:child_process';

const BATTLE_FORBIDDEN_RE = /^(src\/(battle|field-|three-battle|border-battle|banner-renderer|simple-card-battle)|assets\/(battle|characters_3d)|scripts\/(build_3d_battle|battle_browser_smoke))/;

const check = spawnSync(process.execPath, ['scripts/check-sources.mjs'], { stdio: 'inherit' });
if (check.status !== 0) process.exit(check.status || 1);

const baseRef = process.env.CROWN_BASE_REF || 'HEAD';
const changed = new Set();
for (const args of [['diff', '--name-only', baseRef], ['diff', '--name-only', '--cached']]) {
  const res = spawnSync('git', args, { encoding: 'utf8' });
  if (res.status === 0 && res.stdout) {
    for (const line of res.stdout.split(/\r?\n/)) {
      const clean = line.trim();
      if (clean) changed.add(clean);
    }
  }
}

const violations = [...changed].filter(f => BATTLE_FORBIDDEN_RE.test(f));
if (violations.length) {
  console.error('BATTLE EXCLUSION VIOLATION — forbidden files modified:\n' + violations.map(v => '  - ' + v).join('\n'));
  process.exit(1);
}

console.log(`Battle-exclusion guard & source checks passed (${readdirSync('src').length} src entries, 0 battle modifications).`);
