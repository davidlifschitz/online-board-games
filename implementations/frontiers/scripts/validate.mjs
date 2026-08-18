import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { ADJACENCY, REGIONS, TERRITORIES } from '../src/map-data.js';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
if(TERRITORIES.length!==36)throw new Error(`Expected 36 territories, got ${TERRITORIES.length}`);
if(Object.keys(REGIONS).length!==6)throw new Error('Expected six regions.');
for(const [id,neighbors] of Object.entries(ADJACENCY))for(const n of neighbors){if(!ADJACENCY[n])throw new Error(`${id} references missing ${n}`);if(!ADJACENCY[n].includes(id))throw new Error(`${id}<->${n} is asymmetric`);}
const seen=new Set([TERRITORIES[0].id]),q=[TERRITORIES[0].id];while(q.length)for(const n of ADJACENCY[q.shift()])if(!seen.has(n)){seen.add(n);q.push(n);}if(seen.size!==TERRITORIES.length)throw new Error('Map graph is disconnected.');
for(const f of ['map.js','engine-a.js','engine-b.js','bots.js','online.js','app-a.js','app-b.js','app-c.js','sw.js']){if(!fs.existsSync(path.join(root,f)))throw new Error(`Missing ${f}`);const r=spawnSync(process.execPath,['--check',path.join(root,f)],{encoding:'utf8'});if(r.status!==0)throw new Error(`${f} syntax failed: ${r.stderr}`);}
const license=fs.readFileSync(path.join(root,'LICENSE'),'utf8');if(!license.startsWith('MIT License'))throw new Error('MIT license missing.');
console.log(`Frontiers validation clean: ${TERRITORIES.length} territories, ${Object.keys(REGIONS).length} regions, connected symmetric graph, runtime syntax, MIT license.`);
