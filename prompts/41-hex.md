# Hex

Build an open-source Hex strategy game for the browser with strong AI and online 1v1.

## Core gameplay
- Rhombus-shaped hexagonal grid, default 11x11 with configurable sizes.
- Players alternate claiming empty cells.
- Each player tries to connect their two opposite board edges.
- No draws are possible under standard rules.
- Include optional swap/pie rule after the first move.

## Modes/AI
- Vs computer, local, online rooms.
- Easy random/legal.
- Medium shortest-path and connection heuristics.
- Hard Monte Carlo Tree Search and/or alpha-beta on smaller boards with virtual-connection evaluation.

## UI/engineering
- SVG/canvas hex board, connection highlighting, move history, undo in analysis mode.
- Fast winner detection using union-find or graph search.
- Tests for adjacency, edge connections, swap rule, winner detection, and AI immediate wins/blocks.
- Responsive, open-source license, README, Vercel deployment.
