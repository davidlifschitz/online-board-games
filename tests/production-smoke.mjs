import assert from 'node:assert/strict';

const baseUrl = (process.env.TRAINGAMES_BASE_URL || 'https://os-online-board-games.vercel.app').replace(/\/$/, '');

const batch3 = [
  { id: 'president', title: 'High Table', route: '/games/high-table/', cache: 'high-table-v2' },
  { id: 'hearts', title: 'Hearts', route: '/games/hearts/', cache: 'hearts-v2' },
  { id: 'spades', title: 'Spades', route: '/games/spades/', cache: 'spades-v2' },
  { id: 'gin-rummy', title: 'Gin Rummy', route: '/games/gin-rummy/', cache: 'gin-rummy-v2' },
  { id: 'rummy-500', title: 'Rummy 500', route: '/games/rummy-500/', cache: 'rummy-500-v2' },
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
assert.match(home, /<strong>25<\/strong><span>Live games<\/span>/);

const catalog = await (await fetchOk('/games.json')).json();
assert.deepEqual(catalog.summary, {
  liveGames: 25,
  promptConcepts: 51,
  promptConceptsWithLiveImplementations: 23,
  promptConceptsAwaitingFirstDeployment: 28,
});

const upstreams = await (await fetchOk('/upstreams.json')).json();
const catalogById = new Map(catalog.games.map((game) => [game.id, game]));
const upstreamById = new Map(upstreams.games.map((game) => [game.id, game]));

for (const expected of batch3) {
  const catalogGame = catalogById.get(expected.id);
  assert.ok(catalogGame, `missing ${expected.id} from production games.json`);
  assert.equal(catalogGame.status, 'live');
  assert.equal(catalogGame.liveUrl, expected.route);
  assert.equal(catalogGame.title, expected.title);

  const upstream = upstreamById.get(expected.id);
  assert.ok(upstream, `missing ${expected.id} from production upstreams.json`);
  assert.equal(upstream.license, 'MIT');
  assert.equal(upstream.status, 'audited');
  assert.equal(upstream.liveUrl, expected.route);

  const [page, worker] = await Promise.all([
    fetchOk(expected.route).then((response) => response.text()),
    fetchOk(`${expected.route}sw.js`).then((response) => response.text()),
  ]);

  assert.match(page, new RegExp(`<title>${expected.title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')} • TrainGames<\\/title>`));
  assert.match(page, /<span>TrainGames<\/span>/);
  assert.match(worker, new RegExp(expected.cache));
  assert.doesNotMatch(worker, /-v1\b/);
}

const crownJump = upstreamById.get('checkers');
assert.ok(crownJump, 'missing Crown Jump provenance');
assert.equal(crownJump.liveUrl, '/games/crown-jump/');

console.log(`Production smoke passed for ${batch3.length} Batch 3 games at ${baseUrl}`);
