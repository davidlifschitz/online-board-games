# Qwirkle-style pattern tile game

Build an original open-source abstract tile-laying game inspired by color/shape matching mechanics. Do not copy Qwirkle branding, exact tile symbols, artwork, distribution, or scoring text.

## Core gameplay
- 2–4 players.
- Tiles each combine one attribute from two dimensions, e.g. color + symbol.
- On a turn place one or more tiles in a single row/column so every resulting line follows one consistent attribute while containing no duplicate exact tile.
- Score based on lengths of all lines extended/created.
- Award an original completion bonus when a line contains the full allowed set.
- Draw replacement tiles from a bag; end when bag and a player's rack are exhausted.

## Modes/AI
- Bots, local, online rooms.
- AI searches legal placements and evaluates immediate score, rack leave, board openings, and completion threats.

## UI/engineering
- Original symbol set with colorblind-safe shapes.
- Infinite/expandable board viewport, rack drag/tap placement, score previews.
- Tests for line legality, multi-line scoring, duplicates, bag/rack lifecycle, and endgame.
- Open-source license, README, Vercel deployment.
