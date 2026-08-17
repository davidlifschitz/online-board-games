# Backgammon

Build an open-source online Backgammon web game with bots and peer-to-peer multiplayer.

## Core rules
- Standard 24-point Backgammon board.
- 15 checkers per player.
- Roll two dice each turn.
- Correct legal-move generation including using both dice when possible, doubles producing four moves, bar entry, hitting blots, blocked points, bearing off, and oversized bear-off rolls.
- Player wins after bearing off all checkers.

## Scoring
- Single game.
- Gammon.
- Backgammon.
- Optional match play to a chosen point total.

## Doubling cube
- Optional toggle.
- Offer double.
- Take/pass.
- Correct cube ownership.
- Crawford rule in match mode if implemented.

## Modes
- Vs computer.
- Local two-player.
- Online room code.
- Spectator mode.

## AI
- Easy: random valid turn sequence.
- Medium: heuristic evaluator.
- Hard: shallow expectiminimax or rollout-based evaluation.
- Evaluate pip count, blots, made points, prime strength, bar pressure, home-board strength, and race position.

## UI
- Original Backgammon board.
- Dice animation.
- Click checker then destination.
- Highlight all legal moves.
- If multiple complete move sequences are legal, enforce the official dice-usage rules.
- Show pip counts.
- Move history.
- Responsive landscape layout on phones/tablets.

## Technical
- The legal-move generator is the most important component.
- Generate complete legal turn sequences, not just individual moves.
- Tests for bar entry, doubles, forced higher die, bearing off, blocked moves, hits, and gammon/backgammon scoring.
- Random bot-game simulations.
- Open-source license.
- Deploy on Vercel.
