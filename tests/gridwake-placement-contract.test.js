const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const E = require('../games/gridwake/engine.js');

let b = E.createBoard(10);
b = E.placeShip(b, E.DEFAULT_FLEET[4], 2, 2, 'h');
const moved = E.placeShip(b, E.DEFAULT_FLEET[4], 2, 3, 'h');
assert.deepEqual(moved.ships.find(s => s.id === 'skiff').cells, [23, 24], 'moving a ship may reuse cells occupied by its previous position');
assert.equal(typeof E.removeShip, 'function', 'engine exposes removeShip for editable setup');
const removed = E.removeShip(moved, 'skiff');
assert.equal(removed.ships.some(s => s.id === 'skiff'), false, 'removeShip removes the chosen vessel');

const html = fs.readFileSync(path.join(__dirname, '../games/gridwake/index.html'), 'utf8');
const game = fs.readFileSync(path.join(__dirname, '../games/gridwake/game.js'), 'utf8');
for (const id of ['setupPanel', 'shipPicker', 'rotateShip', 'removeShip', 'clearFleet', 'randomizeFleet', 'confirmFleet']) {
  assert.match(html, new RegExp(`id=["']${id}["']`), `Gridwake setup UI includes #${id}`);
}
assert.match(game, /phase=['"]setup['"]/, 'Gridwake begins in a setup phase');
assert.match(game, /async function confirmFleet/, 'Gridwake commits the fleet only after explicit confirmation');
assert.doesNotMatch(game, /boards=\[E\.randomFleet\(size,fleet,Date\.now\(\)\),E\.randomFleet/, 'new games do not preset the human fleet');
console.log('gridwake placement contract passed');
