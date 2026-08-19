const assert = require('node:assert/strict');
const E = require('../engine.js');

function state(cells, size = 4) {
  return { size, cells: cells.slice(), score: 0, moves: 0, rng: 123, won: false, over: false, target: 2048, lastMerge: 0, attack: 0 };
}

assert.deepEqual(E.slideLine([2,2,2,2]).values, [4,4,0,0], 'pairs merge once');
assert.deepEqual(E.slideLine([2,2,4,0]).values, [4,4,0,0], 'newly merged tile does not merge again');
assert.deepEqual(E.slideLine([2,2,-1,2,2]).values, [4,0,-1,4,0], 'blockers split movement segments');
let s = state([2,2,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0]);
let r = E.move(s, 'left', {spawn:false});
assert.equal(r.moved, true);
assert.equal(r.state.cells[0], 4);
assert.equal(r.scoreGain, 4);

const a = E.replay({seed: 98765, moves:['left','down','right','up','left']});
const b = E.replay({seed: 98765, moves:['left','down','right','up','left']});
assert.equal(E.stateKey(a), E.stateKey(b), 'seed + move log is deterministic');

const blocked = E.applyAttack(state([2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]), 2);
assert.equal(blocked.cells.filter(v => v === -1).length, 2, 'battle attack places blockers');

const full = state([2,4,2,4, 4,2,4,2, 2,4,2,4, 4,2,4,2]);
assert.equal(E.canMove(full), false, 'detects terminal board');
console.log('mergefront engine tests passed');
