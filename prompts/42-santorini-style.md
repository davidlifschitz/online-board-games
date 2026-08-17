# Santorini-style build-and-climb strategy game

Build an original open-source 1v1/2v2 abstract strategy game inspired by move-and-build tower games. Do not copy Santorini branding, god cards, art, board presentation, or exact special powers.

## Core gameplay
- 5x5 grid by default.
- Each player controls two workers.
- Turn: move one worker to an adjacent legal space, then build on an adjacent space.
- Buildings rise through several levels; capped towers are impassable.
- Workers may climb at most one level per move.
- Win by moving onto the designated winning height, with original configurable victory conditions.

## Variants
- Base game without powers.
- Optional original character powers designed as modular rule modifiers.
- 2v2 team mode.

## AI/UI
- Minimax/alpha-beta with mobility, height access, immediate threats, blocking, and build-space evaluation.
- Isometric or clean top-down original board, legal move/build highlighting.
- Tests for movement, climbing, building, caps, win conditions, and each power modifier.
- Open-source license, README, Vercel deployment.
