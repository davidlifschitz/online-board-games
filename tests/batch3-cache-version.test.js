const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const gameDirs = ['high-table', 'hearts', 'spades', 'gin-rummy', 'rummy-500'];

test('invalidates every Batch 3 offline cache when publishing the gameplay UI refresh', () => {
  for (const dir of gameDirs) {
    const sw = fs.readFileSync(path.join(root, 'games', dir, 'sw.js'), 'utf8');
    assert.match(sw, new RegExp(`${dir}-v3`), `${dir} service worker must use the v3 cache`);
    assert.doesNotMatch(sw, new RegExp(`${dir}-v2['\"]`), `${dir} service worker still uses the stale v2 cache`);
  }
});
