# Dots and Boxes

Build an open-source Dots and Boxes browser game with strong AI and online 1v1/multiplayer variants.

## Core gameplay
- Grid of dots; players claim one unclaimed horizontal or vertical edge per turn.
- Completing a box scores it and grants another move.
- Game ends when every edge is claimed; most boxes wins.
- Configurable board dimensions.

## Modes
- Vs computer.
- Local 2-player and optional 3–4 player mode.
- Online rooms.

## AI
- Easy random.
- Medium avoids giving away immediate boxes and takes free boxes.
- Hard understands chains, loops, sacrifice strategy, parity, and uses search/endgame solvers for feasible board sizes.

## UI/engineering
- Tap/click generous edge hit targets, highlight claimed boxes and current streak.
- Pure graph engine.
- Tests for edge legality, box completion, extra turns, double-box moves, scoring, and terminal state.
- Responsive UI, open-source license, README, Vercel deployment.
