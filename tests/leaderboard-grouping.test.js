const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');

test('rankings exposes Station and Contributor grouping controls', () => {
  const html = read('leaderboard.html');
  assert.match(html, /aria-label="Group rankings by"/);
  assert.match(html, /data-group-mode="station"[^>]*aria-pressed="true"/);
  assert.match(html, /data-group-mode="contributor"[^>]*aria-pressed="false"/);
  assert.match(html, /id="stationRankingView"/);
  assert.match(html, /id="contributorRankingView"[^>]*hidden/);
});

test('contributor mode groups approved services by stable builder key', () => {
  const js = read('leaderboard.js');
  assert.match(js, /groupMode:\s*'station'/);
  assert.match(js, /from\('builder_submissions'\)/);
  assert.match(js, /builder_key/);
  assert.match(js, /eq\('status','approved'\)/);
  assert.match(js, /function groupRowsByContributor\(/);
  assert.match(js, /new Map\(\)/);
});

test('contributor groups show every approved service with voting and links', () => {
  const js = read('leaderboard.js');
  assert.match(js, /function renderContributorGroups\(/);
  assert.match(js, /contributor-service-row/);
  assert.match(js, /toggleVote\(row\.id/);
  assert.match(js, /link\('Play ↗',row\.live_url\)/);
  assert.match(js, /link\('Source ↗',row\.source_url\)/);
});

test('group mode is URL addressable and mobile styling exists', () => {
  const js = read('leaderboard.js');
  const css = read('leaderboard.css');
  assert.match(js, /searchParams\.get\('group'\)/);
  assert.match(js, /searchParams\.set\('group','contributor'\)/);
  assert.match(css, /\.leaderboard-grouping/);
  assert.match(css, /\.contributor-group/);
  assert.match(css, /@media\(max-width:760px\)/);
});
