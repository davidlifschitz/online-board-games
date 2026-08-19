(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.MergefrontEngine = api;
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  function normalizeSeed(seed) {
    let n = Number(seed) >>> 0;
    return n || 0x9e3779b9;
  }

  function nextRandom(state) {
    let x = state.rng >>> 0;
    x ^= x << 13; x >>>= 0;
    x ^= x >>> 17; x >>>= 0;
    x ^= x << 5; x >>>= 0;
    state.rng = x || 0x9e3779b9;
    return state.rng / 0x100000000;
  }

  function clone(state) {
    return {
      size: state.size,
      cells: state.cells.slice(),
      score: state.score,
      moves: state.moves,
      rng: state.rng >>> 0,
      won: !!state.won,
      over: !!state.over,
      target: state.target,
      lastMerge: state.lastMerge || 0,
      attack: state.attack || 0,
    };
  }

  function emptyCells(state) {
    const out = [];
    for (let i = 0; i < state.cells.length; i += 1) if (state.cells[i] === 0) out.push(i);
    return out;
  }

  function spawn(state) {
    const empties = emptyCells(state);
    if (!empties.length) return false;
    const index = empties[Math.floor(nextRandom(state) * empties.length)];
    state.cells[index] = nextRandom(state) < 0.9 ? 2 : 4;
    return true;
  }

  function createGame(options) {
    options = options || {};
    const size = Math.max(3, Math.min(6, Number(options.size) || 4));
    const state = {
      size,
      cells: Array(size * size).fill(0),
      score: 0,
      moves: 0,
      rng: normalizeSeed(options.seed == null ? Date.now() : options.seed),
      won: false,
      over: false,
      target: Number(options.target) || 2048,
      lastMerge: 0,
      attack: 0,
    };
    spawn(state);
    spawn(state);
    return state;
  }

  function mergeSegment(values) {
    const compact = values.filter((v) => v > 0);
    const out = [];
    let score = 0;
    let maxMerge = 0;
    for (let i = 0; i < compact.length; i += 1) {
      const a = compact[i];
      if (i + 1 < compact.length && compact[i + 1] === a) {
        const merged = a * 2;
        out.push(merged);
        score += merged;
        maxMerge = Math.max(maxMerge, merged);
        i += 1;
      } else {
        out.push(a);
      }
    }
    while (out.length < values.length) out.push(0);
    return { values: out, score, maxMerge };
  }

  function slideLine(line) {
    const result = [];
    let score = 0;
    let maxMerge = 0;
    let segment = [];
    function flush() {
      if (!segment.length) return;
      const merged = mergeSegment(segment);
      result.push.apply(result, merged.values);
      score += merged.score;
      maxMerge = Math.max(maxMerge, merged.maxMerge);
      segment = [];
    }
    for (const value of line) {
      if (value === -1) {
        flush();
        result.push(-1);
      } else segment.push(value);
    }
    flush();
    return { values: result, score, maxMerge };
  }

  function lineIndexes(size, direction, i) {
    const idx = [];
    if (direction === 'left' || direction === 'right') {
      for (let c = 0; c < size; c += 1) idx.push(i * size + c);
      if (direction === 'right') idx.reverse();
    } else {
      for (let r = 0; r < size; r += 1) idx.push(r * size + i);
      if (direction === 'down') idx.reverse();
    }
    return idx;
  }

  function canMove(state) {
    if (emptyCells(state).length) return true;
    const s = state.size;
    for (let r = 0; r < s; r += 1) {
      for (let c = 0; c < s; c += 1) {
        const v = state.cells[r * s + c];
        if (v <= 0) continue;
        if (c + 1 < s && state.cells[r * s + c + 1] === v) return true;
        if (r + 1 < s && state.cells[(r + 1) * s + c] === v) return true;
      }
    }
    return false;
  }

  function move(input, direction, options) {
    options = options || {};
    if (!['left', 'right', 'up', 'down'].includes(direction)) throw new Error('Invalid direction');
    if (input.over) return { state: clone(input), moved: false, scoreGain: 0, maxMerge: 0, attack: 0 };
    const state = clone(input);
    const before = state.cells.slice();
    let scoreGain = 0;
    let maxMerge = 0;
    for (let i = 0; i < state.size; i += 1) {
      const indexes = lineIndexes(state.size, direction, i);
      const line = indexes.map((idx) => state.cells[idx]);
      const slid = slideLine(line);
      scoreGain += slid.score;
      maxMerge = Math.max(maxMerge, slid.maxMerge);
      indexes.forEach((idx, j) => { state.cells[idx] = slid.values[j]; });
    }
    const moved = before.some((v, i) => v !== state.cells[i]);
    if (!moved) return { state, moved: false, scoreGain: 0, maxMerge: 0, attack: 0 };
    state.score += scoreGain;
    state.moves += 1;
    state.lastMerge = maxMerge;
    state.attack = maxMerge >= 64 ? Math.min(3, Math.max(1, Math.floor(Math.log2(maxMerge)) - 5)) : 0;
    if (options.spawn !== false) spawn(state);
    state.won = state.won || state.cells.some((v) => v >= state.target);
    state.over = !canMove(state);
    return { state, moved: true, scoreGain, maxMerge, attack: state.attack };
  }

  function addBlocker(input) {
    const state = clone(input);
    const empties = emptyCells(state);
    if (!empties.length) {
      state.over = !canMove(state);
      return state;
    }
    const index = empties[Math.floor(nextRandom(state) * empties.length)];
    state.cells[index] = -1;
    state.over = !canMove(state);
    return state;
  }

  function applyAttack(input, count) {
    let state = clone(input);
    for (let i = 0; i < (count || 0); i += 1) state = addBlocker(state);
    return state;
  }

  function replay(options) {
    options = options || {};
    let state = createGame(options);
    for (const direction of options.moves || []) {
      const result = move(state, direction);
      if (result.moved) state = result.state;
    }
    return state;
  }

  function stateKey(state) {
    return [state.size, state.score, state.moves, state.rng, state.cells.join(',')].join('|');
  }

  return { createGame, move, spawn, canMove, addBlocker, applyAttack, replay, stateKey, slideLine, mergeSegment };
});
