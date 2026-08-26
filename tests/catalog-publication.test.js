const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const read = (relative) => fs.readFileSync(path.join(root, relative), 'utf8');
const readJson = (relative) => JSON.parse(read(relative));

const batch3 = [
  { id: 'president', title: 'High Table', liveUrl: '/games/high-table/', dir: 'high-table' },
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

  const liveGames = catalog.games.filter((game) => game.status === 'live' && game.liveUrl);
  const promptGames = catalog.games.filter((game) => game.prompt);
  const livePromptGames = promptGames.filter((game) => game.status === 'live' && game.liveUrl);
  const unbuiltPromptGames = promptGames.filter((game) => game.status === 'unbuilt' && !game.liveUrl);
  assert.equal(liveGames.length, catalog.summary.liveGames, 'summary liveGames must match catalog rows');
  assert.equal(promptGames.length, catalog.summary.promptConcepts, 'summary promptConcepts must match catalog rows');
  assert.equal(livePromptGames.length, catalog.summary.promptConceptsWithLiveImplementations, 'summary live prompt count must match catalog rows');
  assert.equal(unbuiltPromptGames.length, catalog.summary.promptConceptsAwaitingFirstDeployment, 'summary unbuilt prompt count must match catalog rows');

  for (const expected of batch3) {
    const game = catalog.games.find((item) => item.id === expected.id);
    assert.ok(game, `missing ${expected.id} from games.json`);
    assert.equal(game.status, 'live', `${expected.id} should be live`);
    assert.equal(game.liveUrl, expected.liveUrl, `${expected.id} should use its TrainGames route`);
    assert.equal(game.title, expected.title, `${expected.id} title should match the verified Batch 3 publication`);
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

test('keeps every provenance route synchronized with the live catalog', () => {
  const catalog = readJson('games.json');
  const manifest = readJson('upstreams.json');
  const byId = new Map(catalog.games.map((game) => [game.id, game]));

  for (const entry of manifest.games) {
    const game = byId.get(entry.id);
    assert.ok(game, `provenance entry ${entry.id} must exist in games.json`);
    assert.equal(game.status, 'live', `provenance entry ${entry.id} must describe a live game`);
    assert.equal(entry.liveUrl, game.liveUrl, `provenance route for ${entry.id} must match games.json`);
  }
});

test('keeps the TrainGames hub and docs synchronized with the published catalog', () => {
  const home = read('index.html');
  const readme = read('README.md');
  const catalogDoc = read('GAME_CATALOG.md');
  const conversion = read('CONVERSION_PLAN_43.md');
  const lineage = read('OPEN_SOURCE_LINEAGE.md');
  const sourceResearch = read('SOURCE_RESEARCH_BATCH_3.md');

  assert.match(home, /<strong>25<\/strong><span>Live games<\/span>/);
  assert.match(readme, /\*\*25 live games · 51 build prompts · 28 prompt concepts waiting for a first deployment\*\*/);
  assert.match(readme, /\*\*23 of the 51 numbered prompt concepts have a live implementation\.\*\*/);
  assert.match(catalogDoc, /\*\*23\*\* have a live implementation/);
  assert.match(catalogDoc, /\*\*28 numbered concepts remain unbuilt\.\*\*/);

  const buildPage = read('build.html');
  assert.match(buildPage, /<strong>28<\/strong><span>Awaiting first build<\/span>/);
  assert.match(buildPage, /Claim issue #7/);
  assert.match(buildPage, /Claim issue #8/);
  assert.doesNotMatch(buildPage, /Claim issue #(3|4|5|6)/);
  assert.doesNotMatch(buildPage, /issues\/[3456]"/);
  assert.match(buildPage, /Boggle-style/);
  assert.match(buildPage, /Love-Letter-style/);

  const launchKit = read('LAUNCH_KIT.md');
  assert.match(launchKit, /- 25 live browser games/);
  assert.match(launchKit, /- 23 numbered prompt concepts with live implementations/);
  assert.match(launchKit, /- 28 numbered prompt concepts waiting for a first deployment/);
  assert.match(launchKit, /\*\*25 live games · 51 open-source specs\*\*/);

  const contributing = read('CONTRIBUTING.md');
  assert.match(contributing, /Boggle-style and Love-Letter-style/);
  assert.doesNotMatch(contributing, /including Mastermind-style, Mancala, Dots and Boxes, Farkle/);

  assert.match(readme, /\[How to contribute\]\(CONTRIBUTING\.md\)/);
  assert.match(readme, /\[Claim a starter game\]\(BUILD_QUEUE\.md\)/);
  assert.equal(
    (readme.match(/\[Play\]\(https:\/\/os-online-board-games\.vercel\.app\/games\//g) || []).length,
    20,
    'README first-party Play links should be absolute hub URLs'
  );
  assert.doesNotMatch(readme, /\[Play\]\(\/games\//);

  const buildChallenge = read('BUILD_CHALLENGE.md');
  assert.match(buildChallenge, /Two starter games currently have open build issues/);
  assert.match(buildChallenge, /issues\/7/);
  assert.match(buildChallenge, /issues\/8/);
  assert.doesNotMatch(buildChallenge, /issues\/[3456]\)/);
  assert.doesNotMatch(buildChallenge, /Six starter games/);
  assert.match(conversion, /\*\*Progress:\*\* 15 of the original 43/);
  assert.match(conversion, /\*\*28 remain\.\*\*/);
  assert.match(conversion, /Batch 3 — classic cards I — COMPLETE/);
  assert.match(lineage, /\| High Table \|/);
  assert.match(lineage, /## Batch 3/);
  assert.match(sourceResearch, /TrainGames implementations/);
  assert.doesNotMatch(sourceResearch, /OS Online Board Games/);
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
