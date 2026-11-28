import {readdirSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
import path from 'node:path';

for (const entry of readdirSync('src', {recursive: true})) {
 if (!entry.endsWith('.js') || entry.endsWith('.bundle.js')) continue;
 const result = spawnSync(process.execPath, ['--check', path.join('src', entry)], {stdio: 'inherit'});
 if (result.status !== 0) process.exit(result.status || 1);
}
console.log('All application source files passed syntax checks.');
