const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const gameDirs = ['high-table', 'hearts', 'spades', 'gin-rummy', 'rummy-500'];

test('invalidates every Batch 3 offline cache when publishing the TrainGames shell', () => {
  for (const dir of gameDirs) {
    const sw = fs.readFileSync(path.join(root, 'games', dir, 'sw.js'), 'utf8');
    assert.match(sw, new RegExp(`${dir}-v2`), `${dir} service worker must use the v2 cache`);
    assert.doesNotMatch(sw, new RegExp(`${dir}-v1`), `${dir} service worker still uses the stale v1 cache`);
  }
});
