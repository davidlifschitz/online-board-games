# Prompt 52 — Tile-drafting mosaic strategy

Build an original browser-based tile-drafting strategy game inspired by the factory-to-pattern-line structure popularized by Azul, without copying branded artwork, logos, commercial graphic design, or rulebook prose.

## Required gameplay

- Support 2–4 local players.
- Use 5 tile colors, 100 tiles total, and 5/7/9 workshops for 2/3/4 players.
- Each workshop starts a round with 4 randomly drawn tiles.
- On a turn, draft every tile of one color from one workshop or from the center.
- Move unchosen workshop tiles to the center.
- The first player to draft from the center takes a lead marker, starts the next round, and incurs one floor space.
- Pattern lines have capacities 1–5, accept one color each, and cannot prepare a color already present in the corresponding wall row.
- Overflow goes to the floor.
- At round end, each complete pattern line places one tile onto its fixed-color wall position and discards the rest.
- Score newly placed wall tiles using connected horizontal/vertical adjacency.
- Apply floor penalties with values -1, -1, -2, -2, -2, -3, -3 without taking a player's score below zero.
- End after a round where at least one player completes a horizontal wall row.
- Award end bonuses for completed rows, columns, and all five tiles of one color.

## Modes and UX

- Local multiplayer for 2–4 players.
- Two-player mode against a computer opponent with at least easy/medium/hard choices.
- Responsive touch-first interaction: source color first, highlighted destination second.
- Persist in-progress games locally.
- Work offline after one successful online load.
- Provide readable rules and provenance in-app.

## Open-source constraints

- Original presentation and assets only.
- Permissively licensed upstreams may be used as behavioral or AI references with attribution.
- Do not import proprietary Azul artwork, logos, scans, fonts, or commercial rulebook text.
