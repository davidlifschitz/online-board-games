const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const gameDir = path.join(root, 'games', 'photo-puzzle');

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), 'utf8');
}

test('photo puzzle ships a dedicated low-friction mobile layer', () => {
  assert.ok(fs.existsSync(path.join(gameDir, 'mobile.css')), 'mobile.css should exist');
  assert.ok(fs.existsSync(path.join(gameDir, 'mobile.js')), 'mobile.js should exist');
});

test('mobile board fits the viewport and the tray is a horizontal dock', () => {
  assert.ok(fs.existsSync(path.join(gameDir, 'mobile.css')), 'mobile.css should exist before checking its rules');
  const css = read('games/photo-puzzle/mobile.css');
  assert.match(css, /@media\s*\(max-width:\s*900px\)/);
  assert.match(css, /\.board-stage\s*\{[^}]*min-width:\s*0/);
  assert.match(css, /\.board-stage\s*\{[^}]*width:\s*min\(100%,\s*calc\(100vw\s*-\s*\d+px\)\)/);
  assert.match(css, /\.piece-tray\s*\{[^}]*display:\s*flex/);
  assert.match(css, /\.piece-tray\s*\{[^}]*overflow-x:\s*auto/);
  assert.match(css, /\.mobile-tabs\s*\{[^}]*display:\s*none\s*!important/);
  assert.match(css, /\.mobile-selection\s*\{[^}]*display:\s*none\s*!important/);
  assert.match(css, /\.toolbar-actions\s*\{[^}]*display:\s*flex/);
  assert.match(css, /\.pieces-panel\s*\{[^}]*position:\s*fixed/);
});

test('mobile interaction keeps board and pieces together and auto-selects the next piece', () => {
  assert.ok(fs.existsSync(path.join(gameDir, 'mobile.js')), 'mobile.js should exist before checking its behavior hooks');
  const js = read('games/photo-puzzle/mobile.js');
  assert.match(js, /originalSelectPiece\(pieceId,\s*false\)/);
  assert.match(js, /MutationObserver/);
  assert.match(js, /boardPanel\.appendChild\(piecesPanel\)/);
  assert.match(js, /autoSelectNext/);
  assert.match(js, /tray\.scrollTo/);
});

test('wrong placement is a retry, not an auto-correction', () => {
  const game = read('games/photo-puzzle/game.js');
  const wrongBranch = game.match(/if\(state\.selected!==slotId\)\{([\s\S]*?)return\}/)?.[1];
  assert.ok(wrongBranch, 'attemptPlace should have an explicit wrong-answer branch');
  assert.doesNotMatch(wrongBranch, /state\.selected\s*=\s*null/, 'a wrong answer should keep the same piece selected');
  assert.match(game, /Wrong spot — keep trying with this piece\./, 'wrong-answer feedback should make retry behavior explicit');

  const html = read('games/photo-puzzle/index.html');
  assert.match(html, /Wrong spot\? Keep trying — the piece stays selected\./, 'desktop/help copy should explain retry behavior');

  const mobile = read('games/photo-puzzle/mobile.js');
  assert.match(mobile, /Wrong spot\? Keep trying\./, 'mobile board hint should explain retry behavior');
});

test('photo puzzle page loads the mobile layer after the base game assets', () => {
  const html = read('games/photo-puzzle/index.html');
  const baseCss = html.indexOf('href="styles.css"');
  const mobileCss = html.indexOf('href="mobile.css"');
  const baseJs = html.indexOf('src="game.js"');
  const mobileJs = html.indexOf('src="mobile.js"');
  assert.ok(baseCss >= 0 && mobileCss > baseCss, 'mobile.css should load after styles.css');
  assert.ok(baseJs >= 0 && mobileJs > baseJs, 'mobile.js should load after game.js');
});
