import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const baseUrl = (process.env.TRAINGAMES_BASE_URL || 'https://os-online-board-games.vercel.app').replace(/\/$/, '');
const localCatalog = JSON.parse(await readFile(new URL('../games.json', import.meta.url), 'utf8'));
const localUpstreams = JSON.parse(await readFile(new URL('../upstreams.json', import.meta.url), 'utf8'));

const batch3 = [
  { id: 'president', cache: 'high-table-v2' },
  { id: 'hearts', cache: 'hearts-v2' },
  { id: 'spades', cache: 'spades-v2' },
  { id: 'gin-rummy', cache: 'gin-rummy-v2' },
  { id: 'rummy-500', cache: 'rummy-500-v2' },
];

async function fetchOk(path) {
  const response = await fetch(`${baseUrl}${path}`, {
    redirect: 'follow',
    headers: { 'cache-control': 'no-cache' },
  });
  assert.equal(response.status, 200, `${path} returned ${response.status}`);
  return response;
}

const home = await (await fetchOk('/')).text();
assert.match(home, /<title>TrainGames\b/);
assert.match(home, new RegExp(`<strong>${localCatalog.summary.liveGames}<\\/strong><span>Live games<\\/span>`));

const catalog = await (await fetchOk('/games.json')).json();
assert.deepEqual(catalog.summary, localCatalog.summary, 'production games.json summary must match checked-out games.json');

const upstreams = await (await fetchOk('/upstreams.json')).json();
const catalogById = new Map(catalog.games.map((game) => [game.id, game]));
const localCatalogById = new Map(localCatalog.games.map((game) => [game.id, game]));
const upstreamById = new Map(upstreams.games.map((game) => [game.id, game]));
const localUpstreamById = new Map(localUpstreams.games.map((game) => [game.id, game]));

for (const expected of batch3) {
  const catalogGame = catalogById.get(expected.id);
  const sourceGame = localCatalogById.get(expected.id);
  assert.ok(sourceGame, `missing ${expected.id} from checked-out games.json`);
  assert.ok(catalogGame, `missing ${expected.id} from production games.json`);
  assert.deepEqual(catalogGame, sourceGame, `production catalog entry for ${expected.id} must match checked-out games.json`);
  assert.equal(catalogGame.status, 'live');
  assert.ok(catalogGame.liveUrl?.startsWith('/games/'), `${expected.id} must use a TrainGames route`);

  const upstream = upstreamById.get(expected.id);
  const sourceUpstream = localUpstreamById.get(expected.id);
  assert.ok(sourceUpstream, `missing ${expected.id} from checked-out upstreams.json`);
  assert.ok(upstream, `missing ${expected.id} from production upstreams.json`);
  assert.deepEqual(upstream, sourceUpstream, `production provenance for ${expected.id} must match checked-out upstreams.json`);
  assert.equal(upstream.license, 'MIT');
  assert.equal(upstream.status, 'audited');
  assert.equal(upstream.liveUrl, catalogGame.liveUrl);

  const [page, worker] = await Promise.all([
    fetchOk(catalogGame.liveUrl).then((response) => response.text()),
    fetchOk(`${catalogGame.liveUrl}sw.js`).then((response) => response.text()),
  ]);

  const escapedTitle = catalogGame.title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  assert.match(page, new RegExp(`<title>${escapedTitle} • TrainGames<\\/title>`));
  assert.match(page, /<span>TrainGames<\/span>/);
  assert.match(worker, new RegExp(expected.cache));
  assert.doesNotMatch(worker, /-v1\b/);
}

const crownJump = upstreamById.get('checkers');
const localCrownJump = localUpstreamById.get('checkers');
assert.ok(crownJump, 'missing Crown Jump production provenance');
assert.deepEqual(crownJump, localCrownJump, 'Crown Jump production provenance must match checked-out upstreams.json');
assert.equal(crownJump.liveUrl, '/games/crown-jump/');

console.log(`Production smoke passed for ${batch3.length} Batch 3 games at ${baseUrl}`);
