# Nine Men's Morris

Build an open-source Nine Men's Morris browser game with AI and online 1v1.

## Core rules
- Standard 24-point board.
- Each player starts with nine pieces.
- Phase 1: alternate placing pieces.
- Forming a mill allows removal of one opposing piece, respecting restrictions on removing pieces already in mills.
- Phase 2: after all pieces are placed, move to adjacent connected points.
- Phase 3: when a player has three pieces, allow flying to any empty point if using the common rule variant.
- Lose with fewer than three pieces or no legal move.

## Modes/AI
- Vs AI, local, online rooms.
- AI uses minimax/alpha-beta with mill formation/blocking, mobility, double-mill threats, piece count, and phase-aware evaluation.

## UI/engineering
- Explicit graph of board points/edges.
- Highlight legal placements/moves and removal targets.
- Tests for mill detection, removal constraints, phase changes, flying, blocked loss, and repetition/draw rule if enabled.
- Responsive, open-source, README, Vercel deployment.
