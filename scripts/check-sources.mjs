import {readdirSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
for(const file of readdirSync('src').filter(f=>f.endsWith('.js')&&!f.endsWith('.bundle.js'))){const p=spawnSync(process.execPath,['--check','src/'+file],{stdio:'inherit'});if(p.status!==0)process.exit(p.status||1);}
console.log('All application source files passed syntax checks.');
