# Connect Four

Build an open-source Connect Four web app with strong computer opponents and online multiplayer.

## Requirements
- Standard 7-column by 6-row board.
- Two players alternate dropping pieces into columns.
- Detect horizontal, vertical, and diagonal wins.
- Detect draws.
- Include move history and restart.

## Modes
- Player vs computer.
- Local two-player.
- Online multiplayer with room codes.
- Optional matchmaking queue if it can be implemented without paid infrastructure.

## AI
- Easy: random legal moves.
- Medium: tactical lookahead that blocks immediate losses and takes immediate wins.
- Hard: minimax with alpha-beta pruning and a strong board evaluation function.
- Expert: deeper search using iterative deepening and a time budget.
- Run AI in a Web Worker so the UI stays responsive.

## Features
- Adjustable board sizes as an optional variant.
- First-player selection.
- Best-of-3 / best-of-5 matches.
- Elo-like local rating for computer difficulty tracking.
- Online rematch flow.

## UI
- Clean original visual design.
- Animated falling pieces.
- Clearly highlight the winning four.
- Excellent mobile touch targets.
- Show AI thinking indicator without blocking the interface.

## Engineering
- Pure deterministic board engine.
- Unit tests for legal drops, full columns, all four win directions, draws, and AI selecting forced wins and forced blocks.
- Benchmark hard AI search depth.
- Open-source license.
- README.
- Vercel deployment.
