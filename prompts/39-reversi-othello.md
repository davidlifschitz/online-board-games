# Reversi / Othello-style disk-flipping game

Build an open-source Reversi browser game with strong AI and online 1v1. Use generic Reversi branding unless trademark usage is explicitly appropriate.

## Core rules
- Standard 8x8 board with four center disks.
- A legal move must bracket one or more opposing disks in at least one of eight directions.
- Flip all bracketed lines.
- If a player has no legal move, they pass automatically.
- Game ends when neither player can move; most disks wins.

## Modes
- Vs computer, local 1v1, online rooms.
- Optional board-size variants.

## AI
- Easy random.
- Medium tactical mobility/corners.
- Hard alpha-beta with positional weights, mobility, frontier disks, stable disks, parity, corner/X-square logic.
- Expert iterative deepening with endgame exact solver.

## UI/engineering
- Legal-move markers, flip animation, disk counts, move history, analysis mode.
- Web Worker AI.
- Tests for all-direction flips, forced pass, terminal scoring, stability helpers, and tactical AI positions.
- Mobile-friendly, README, open-source license, Vercel deployment.
