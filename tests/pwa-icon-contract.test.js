const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.join(__dirname, '..');
const manifest = JSON.parse(fs.readFileSync(path.join(root, 'manifest.webmanifest'), 'utf8'));
const icons = manifest.icons || [];
assert.ok(icons.some(i => i.src === './train-games-icon-192.png' && i.sizes === '192x192'), 'manifest includes deployment-relative 192px PNG icon');
assert.ok(icons.some(i => i.src === './train-games-icon-512.png' && i.sizes === '512x512'), 'manifest includes deployment-relative 512px PNG icon');
assert.ok(icons.some(i => i.src === './train-games-icon-maskable-512.png' && /maskable/.test(i.purpose || '')), 'manifest includes a deployment-relative maskable icon');
for (const file of ['train-games-icon-192.png','train-games-icon-512.png','train-games-icon-maskable-512.png','apple-touch-icon.png']) {
  assert.ok(fs.statSync(path.join(root, file)).size > 1000, `${file} is a non-empty raster icon`);
}
const site = fs.readFileSync(path.join(root, 'site.js'), 'utf8');
assert.match(site, /apple-touch-icon/, 'shared TrainGames shell declares an Apple touch icon');
assert.match(site, /new URL\('apple-touch-icon\.png',siteRoot\)/, 'shared TrainGames shell resolves the iPhone icon from the deployment base');
const gridwake = fs.readFileSync(path.join(root, 'games/gridwake/index.html'), 'utf8');
assert.match(gridwake, /rel="apple-touch-icon"[^>]+href="\.\.\/\.\.\/apple-touch-icon\.png"/, 'Gridwake declares the TrainGames iPhone icon relative to the project root');
console.log('pwa icon contract passed');