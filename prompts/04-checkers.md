# Checkers

Build an open-source browser checkers game with computer AI and online multiplayer.

Use standard American/English draughts rules by default.

## Core rules
- 8x8 board.
- Pieces move diagonally.
- Captures are mandatory.
- Multi-jump captures must be completed in the same turn.
- Pieces promote to kings on the far rank.
- Kings move diagonally in both directions.
- Win by capturing all opposing pieces or leaving the opponent with no legal moves.

## Modes
- Player vs computer.
- Local two-player.
- Online rooms.
- Optional correspondence mode where the room state can be exported/imported.

## AI
- Easy random legal move.
- Medium minimax.
- Hard alpha-beta with piece value, king value, mobility, center control, promotion potential, and vulnerability.
- Run search in a Web Worker.
- Add adjustable thinking time.

## UI
- Original board and piece design.
- Tap a piece to show legal moves.
- Forced captures should be visually obvious.
- Animate jumps.
- Show captured pieces and move history.
- Mobile-friendly.

## Technical
- Separate legal-move generator.
- Correctly enumerate multi-jump sequences.
- Tests for mandatory captures, multi-jumps, promotion, king movement, no-legal-move loss, and AI tactical positions.
- Open-source license and README.
- Deploy on Vercel.
