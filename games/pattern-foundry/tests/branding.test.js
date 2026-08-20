const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const css = fs.readFileSync(path.join(root, 'styles.css'), 'utf8');
const manifest = JSON.parse(fs.readFileSync(path.join(root, 'manifest.webmanifest'), 'utf8'));

assert.match(html, /<body data-page="play">/);
assert.match(html, /<span>TG<\/span>\s*TrainGames/);
assert.match(html, /https:\/\/os-online-board-games\.vercel\.app\/play\.html/);
assert.match(html, /https:\/\/os-online-board-games\.vercel\.app\/build\.html/);
assert.match(html, /https:\/\/os-online-board-games\.vercel\.app\/leaderboard\.html/);
assert.match(html, /Load before departure • Play through the dead zones/);
assert.match(html, /meta name="theme-color" content="#0b1020"/);
assert.match(css, /--bg:#080d19/);
assert.match(css, /--accent:#8dffb3/);
assert.match(css, /--accent2:#b9a7ff/);
assert.match(css, /--radius:22px/);
assert.match(css, /\.site-nav\{/);
assert.equal(manifest.background_color, '#0b1020');
assert.equal(manifest.theme_color, '#0b1020');
assert.equal(manifest.icons?.[0]?.src, './train-games-icon.svg');

console.log('pattern foundry TrainGames branding test passed');
