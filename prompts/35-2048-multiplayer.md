# 2048-inspired multiplayer puzzle variants

Build an original open-source sliding-number puzzle platform inspired by power-of-two merge games, with genuinely multiplayer modes rather than a simple clone.

## Base engine
- Configurable square grid.
- Swipe/arrow-key moves slide all tiles.
- Equal-valued compatible tiles merge once per move.
- Spawn new tiles using a seeded RNG.
- Detect no-move state and track score.

## Multiplayer variants
- Race: identical seed; first to target tile/score wins.
- Time attack: highest score on same seed after fixed time.
- Battle: strong merges send blocker tiles or board effects to opponent using original balanced mechanics.
- Co-op: players alternate moves on one shared board.

## Features
- Daily seeded challenge, replay log, ghost comparison, local bests.
- Online rooms and matchmaking if infrastructure permits.

## Engineering/UI
- Pure deterministic engine from seed + move sequence.
- Tests for slide/merge ordering, one-merge-per-move, spawning, game over, replay determinism, and battle effects.
- Keyboard/touch/mobile-first, original visuals, README, license, Vercel deployment.
