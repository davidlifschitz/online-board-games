const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const v2 = [
  ['deal-room','deal-room'],
  ['photo-puzzle','photo-puzzle'],
  ['uno-style','huebreak'],
  ['codenames-style','threadmark'],
  ['connect-four','fourfront'],
  ['checkers','crown-jump'],
  ['backgammon','racehome'],
  ['battleship-style','gridwake'],
  ['risk-style','frontiers'],
  ['five-dice','five-dice'],
  ['carcassonne-style','tilebound'],
  ['president','high-table'],
  ['hearts','hearts'],
  ['spades','spades'],
  ['gin-rummy','gin-rummy'],
  ['rummy-500','rummy-500'],
  ['blackjack','twenty-one-lab'],
  ['2048-multiplayer','mergefront'],
  ['dots-and-boxes','boxline'],
  ['mancala','sowstone'],
  ['nine-mens-morris','millstone'],
  ['hex','hexline'],
  ['mastermind','cipherloom'],
  ['farkle','spark-six'],
];

const read = p => fs.readFileSync(path.join(root, p), 'utf8');

test('V2 scope is exactly 24 live games and excludes DiscShift/Othello', () => {
  assert.equal(v2.length, 24);
  assert.equal(v2.some(([, slug]) => slug === 'discshift'), false);
});

test('every V2 game has a separate route with shared V2 assets and version switch', () => {
  for (const [, slug] of v2) {
    const file = `games/${slug}/v2/index.html`;
    assert.ok(fs.existsSync(path.join(root, file)), `${file} must exist`);
    const html = read(file);
    assert.match(html, /v2-ui\.css/, `${slug} V2 must load shared V2 CSS`);
    assert.match(html, /v2-ui\.js/, `${slug} V2 must load shared V2 JS`);
    assert.match(html, /data-v2-switch/, `${slug} V2 must expose a version switch`);
    assert.match(html, new RegExp(`data-v2-game=["']${slug}["']`), `${slug} must identify its V2 profile`);
  }
});

test('shared V2 assets exist and cover all four presentation families', () => {
  const css = read('games/v2-ui.css');
  const js = read('games/v2-ui.js');
  for (const family of ['board','cards','action','puzzle']) {
    assert.match(css, new RegExp(`tg2-${family}`));
    assert.match(js, new RegExp(`['\"]${family}['\"]`));
  }
  assert.match(css, /prefers-reduced-motion/);
  assert.match(css, /safe-area-inset-bottom/);
});

test('games catalog keeps V1 liveUrl and advertises V2 as preferred for every scoped game', () => {
  const catalog = JSON.parse(read('games.json'));
  for (const [gameId, slug] of v2) {
    const game = catalog.games.find(g => g.id === gameId);
    assert.ok(game, `catalog must contain ${gameId}`);
    assert.equal(game.status, 'live');
    assert.ok(game.liveUrl, `${gameId} must retain V1 liveUrl`);
    assert.equal(game.preferredVersion, 'v2');
    assert.equal(game.versions?.v1?.liveUrl, game.liveUrl);
    assert.equal(game.versions?.v2?.liveUrl, `/games/${slug}/v2/`);
  }
  const reversi = catalog.games.find(g => g.id === 'reversi');
  assert.ok(reversi);
  assert.equal(reversi.preferredVersion, undefined);
  assert.equal(reversi.versions?.v2, undefined);
});

test('V2 service workers never delete caches outside their game V2 prefix', () => {
  for (const [, slug] of v2) {
    const sw = path.join(root, 'games', slug, 'v2', 'sw.js');
    if (!fs.existsSync(sw)) continue;
    const source = fs.readFileSync(sw, 'utf8');
    assert.match(source, new RegExp(`${slug.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}-v2-`));
    assert.ok(
      source.includes(`startsWith('${slug}-v2-')`) || source.includes(`startsWith("${slug}-v2-")`),
      `${slug} V2 stale-cache deletion must be prefix-scoped`,
    );
  }
});
