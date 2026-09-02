const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');

test('homepage ships the Transit Network SVG system map', () => {
  const html = read('index.html');
  assert.match(html, /class="tg-network-map"/);
  assert.match(html, /<svg[^>]+viewBox=/);
  assert.match(html, /tg-route tg-route--strategy/);
  assert.match(html, /tg-station[^>]+data-game=/);
  assert.match(html, /SCHEMATIC · NOT TO SCALE/);
});

test('site palette uses the approved NYC subway route colors', () => {
  const css = read('styles.css');
  for (const color of ['#0062CF', '#D82233', '#009952', '#9A38A1', '#EB6800', '#F6BC26']) {
    assert.ok(css.includes(color), `missing ${color}`);
  }
});

test('legend communicates categories with color without spelling color names', () => {
  const html = read('index.html');
  assert.match(html, />Strategy</);
  assert.match(html, />Cards</);
  assert.match(html, />Puzzles</);
  assert.doesNotMatch(html, /Strategy · Blue|Cards · Red|Puzzles · Green|Word · Purple|Party · Orange/);
});

test('Play renders station departures instead of generic game cards', () => {
  const html = read('play.html');
  const js = read('play.js');
  assert.match(html, /id="game-grid"[^>]*class="station-list/);
  assert.match(js, /class="station-row/);
  assert.match(js, /station-code/);
  assert.match(js, /game-play-primary/);
  assert.doesNotMatch(js, /class="game-card/);
});

test('Build and Leaderboard use the shared transit product shell', () => {
  for (const file of ['build.html', 'leaderboard.html']) {
    const html = read(file);
    assert.match(html, /class="site-nav tg-nav"/);
    assert.match(html, /class="tg-roundel"/);
  }
});

test('mobile network map is horizontally pannable', () => {
  const css = read('styles.css');
  assert.match(css, /\.tg-network-scroll\s*\{[^}]*overflow-x\s*:\s*auto/s);
});
