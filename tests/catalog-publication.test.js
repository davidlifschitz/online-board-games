const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const read = (relative) => fs.readFileSync(path.join(root, relative), 'utf8');
const readJson = (relative) => JSON.parse(read(relative));

const batch3 = [
  { id: 'president', title: 'President-style / High Table', liveUrl: '/games/high-table/', dir: 'high-table' },
  { id: 'hearts', title: 'Hearts', liveUrl: '/games/hearts/', dir: 'hearts' },
  { id: 'spades', title: 'Spades', liveUrl: '/games/spades/', dir: 'spades' },
  { id: 'gin-rummy', title: 'Gin Rummy', liveUrl: '/games/gin-rummy/', dir: 'gin-rummy' },
  { id: 'rummy-500', title: 'Rummy 500', liveUrl: '/games/rummy-500/', dir: 'rummy-500' },
];

const expectedUpstreams = {
  president: ['Keesayy/President_Card_Game', 'skiano/president'],
  hearts: ['cakeslice/Next-Hearts', 'zmcx16/OpenAI-Gym-Hearts'],
  spades: ['mreishus/spades', 'Metamess/Spades'],
  'gin-rummy': ['vlmlee/Gin-Rummy', 'jrheling/pylgrum'],
  'rummy-500': ['matheu-s/Rummy500Game_AI', 'Mego/rummy'],
};

test('publishes all five Batch 3 games in the catalog with correct collection totals', () => {
  const catalog = readJson('games.json');
  assert.deepEqual(catalog.summary, {
    liveGames: 25,
    promptConcepts: 51,
    promptConceptsWithLiveImplementations: 23,
    promptConceptsAwaitingFirstDeployment: 28,
  });

  for (const expected of batch3) {
    const game = catalog.games.find((item) => item.id === expected.id);
    assert.ok(game, `missing ${expected.id} from games.json`);
    assert.equal(game.status, 'live', `${expected.id} should be live`);
    assert.equal(game.liveUrl, expected.liveUrl, `${expected.id} should use its TrainGames route`);
    assert.equal(game.title, expected.title, `${expected.id} title should match the public catalog`);
  }
});

test('publishes verified permissive provenance for every Batch 3 game', () => {
  const manifest = readJson('upstreams.json');
  for (const expected of batch3) {
    const item = manifest.games.find((entry) => entry.id === expected.id);
    assert.ok(item, `missing ${expected.id} from upstreams.json`);
    assert.equal(item.license, 'MIT');
    assert.equal(item.status, 'audited');
    assert.deepEqual([item.upstream, item.secondaryUpstream], expectedUpstreams[expected.id]);
    assert.equal(item.liveUrl, expected.liveUrl);
  }
});

test('keeps the TrainGames hub and docs synchronized with the published catalog', () => {
  const home = read('index.html');
  const readme = read('README.md');
  const catalogDoc = read('GAME_CATALOG.md');
  const conversion = read('CONVERSION_PLAN_43.md');
  const lineage = read('OPEN_SOURCE_LINEAGE.md');

  assert.match(home, /<strong>25<\/strong><span>Live games<\/span>/);
  assert.match(readme, /\*\*25 live games · 51 build prompts · 28 prompt concepts waiting for a first deployment\*\*/);
  assert.match(readme, /\*\*23 of the 51 numbered prompt concepts have a live implementation\.\*\*/);
  assert.match(catalogDoc, /\*\*23\*\* have a live implementation/);
  assert.match(catalogDoc, /\*\*28 numbered concepts remain unbuilt\.\*\*/);
  assert.match(conversion, /\*\*Progress:\*\* 15 of the original 43/);
  assert.match(conversion, /\*\*28 remain\.\*\*/);
  assert.match(conversion, /Batch 3 — classic cards I — COMPLETE/);
  assert.match(lineage, /\| High Table \|/);
  assert.match(lineage, /## Batch 3/);
});

test('gives every newly published game a specific play-page description', () => {
  const play = read('play.js');
  for (const { id } of batch3) {
    assert.match(play, new RegExp(`['\"]${id}['\"]\\s*:`), `missing play.js description for ${id}`);
  }
});

test('uses TrainGames branding inside every Batch 3 game shell', () => {
  for (const { dir } of batch3) {
    const html = read(`games/${dir}/index.html`);
    assert.match(html, /TrainGames/, `${dir} should mention TrainGames`);
    assert.doesNotMatch(html, /OS Online Board Games/, `${dir} still contains the retired brand`);
  }
});
