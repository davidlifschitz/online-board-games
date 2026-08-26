const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '..');
const catalog = JSON.parse(fs.readFileSync(path.join(root, 'games.json'), 'utf8'));
const localLive = catalog.games.filter(game => game.status === 'live' && /^\/games\/[^/]+\/$/.test(game.liveUrl || ''));

function slugFor(game) {
  return game.liveUrl.split('/')[2];
}

test('catalog exposes exactly 20 repository-hosted live games', () => {
  assert.equal(localLive.length, 20);
});

test('all repository-hosted live games load the shared gameplay UI', () => {
  for (const game of localLive) {
    const slug = slugFor(game);
    const htmlPath = path.join(root, 'games', slug, 'index.html');
    assert.ok(fs.existsSync(htmlPath), `${slug} is missing index.html`);
    const html = fs.readFileSync(htmlPath, 'utf8');
    assert.match(html, /\.\.\/gameplay-ui\.css/, `${slug} does not load shared gameplay CSS`);
    assert.match(html, /\.\.\/gameplay-ui\.js/, `${slug} does not load shared gameplay JS`);
  }
});

test('game-scoped service workers precache shared gameplay UI assets', () => {
  for (const game of localLive) {
    const slug = slugFor(game);
    const swPath = path.join(root, 'games', slug, 'sw.js');
    if (!fs.existsSync(swPath)) continue;
    const sw = fs.readFileSync(swPath, 'utf8');
    assert.match(sw, /\.\.\/gameplay-ui\.css/, `${slug} service worker does not precache shared gameplay CSS`);
    assert.match(sw, /\.\.\/gameplay-ui\.js/, `${slug} service worker does not precache shared gameplay JS`);
  }
});
