# Chess

Build a polished open-source chess website deployable on Vercel.

## Core gameplay
- Full legal chess rules: castling, en passant, promotion, check, checkmate, stalemate, threefold repetition, fifty-move rule, and insufficient material.
- Legal move highlighting.
- Move undo only in analysis/solo modes.

## Modes
- Play against Stockfish in-browser using WebAssembly/Web Worker.
- Local two-player.
- Online multiplayer rooms.
- Analysis board.
- Puzzle mode.
- Optional correspondence mode.

## Computer play
- Stockfish strength slider.
- Adjustable think time.
- Optional estimated Elo labels.
- Multiple personalities using configurable engine parameters where feasible.

## Clocks
- No clock.
- 1+0, 3+2, 5+0, 10+0, 15+10, and custom controls.
- Correct increment handling.

## Chess notation
- Display SAN move list.
- Import/export FEN.
- Import/export PGN.
- Copy current position.
- Download PGN.

## Analysis
- Engine evaluation.
- Best-line display.
- Evaluation bar.
- Depth/node information.
- Toggle engine analysis.

## Puzzles
- Include an openly licensed puzzle set or allow PGN/FEN puzzle imports.
- Track local puzzle score.

## Online
- Room codes and links.
- Host-authoritative clocks/state.
- Reconnect handling.
- Draw offers.
- Resignation.
- Rematches.

## UI
- Original board themes and pieces or openly licensed piece sets.
- Drag-and-drop and tap-to-move.
- Responsive mobile board.
- Promotion picker.
- Flip board.
- Highlight last move and check.

## Engineering
- Prefer a well-tested open-source chess rules library rather than reimplementing edge-case legality from scratch.
- Keep Stockfish in a worker.
- Add regression tests around castling, en passant, checkmate, repetition, clocks, and PGN round trips.
- Include license/attribution for third-party open-source dependencies.
- Deploy to Vercel.
