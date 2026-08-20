const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { groupChallengeGames, claimUrlForGame } = require('../build-catalog.js');

const games = [
  { id: 'live-starter', title: 'Live Starter', prompt: 'prompts/live.md', difficulty: 'starter', status: 'live' },
  { id: 'open-starter', title: 'Open Starter', prompt: 'prompts/open.md', difficulty: 'starter', status: 'unbuilt' },
  { id: 'open-intermediate', title: 'Open Intermediate', prompt: 'prompts/intermediate.md', difficulty: 'intermediate', status: 'unbuilt' },
  { id: 'open-advanced', title: 'Open Advanced', prompt: 'prompts/advanced.md', difficulty: 'advanced', status: 'unbuilt' },
  { id: 'extra', title: 'No Prompt', prompt: null, difficulty: 'starter', status: 'unbuilt' }
];

test('groups only prompt-backed unbuilt games by difficulty', () => {
  const grouped = groupChallengeGames(games);
  assert.deepEqual(grouped.starter.map(game => game.id), ['open-starter']);
  assert.deepEqual(grouped.intermediate.map(game => game.id), ['open-intermediate']);
  assert.deepEqual(grouped.advanced.map(game => game.id), ['open-advanced']);
});

test('builds a claim issue URL with the game title', () => {
  const url = claimUrlForGame(games[1]);
  assert.match(url, /claim-a-game\.yml/);
  assert.match(url, /Open%20Starter/);
});

test('renders every real prompt concept awaiting a first deployment', () => {
  const catalogPath = path.join(__dirname, '..', 'games.json');
  const catalog = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));
  const expectedIds = catalog.games
    .filter(game => game.prompt && game.status === 'unbuilt')
    .map(game => game.id)
    .sort();
  const groupedIds = Object.values(groupChallengeGames(catalog.games))
    .flat()
    .map(game => game.id)
    .sort();

  assert.equal(expectedIds.length, catalog.summary.promptConceptsAwaitingFirstDeployment);
  assert.deepEqual(groupedIds, expectedIds);
});
