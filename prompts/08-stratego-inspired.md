# Stratego-inspired hidden-rank game

Build an original open-source hidden-rank strategy board game inspired by Stratego-style mechanics.

Do not use Stratego branding, names, board design, rank names, piece art, or exact proprietary presentation. Create an original theme, terminology, and piece set.

Suggested theme: “Shadow Command” — rival intelligence agencies attempt to capture the opposing command core.

## Board
- 10x10 board.
- Several impassable terrain zones in the center.
- Each player privately deploys pieces on their side.

## Piece system
Create an original rank hierarchy with approximately:
- 1 Commander Core / flag-like objective
- 1 highest-rank unit
- Several descending combat ranks
- Scouts with long-range movement
- Engineers that defeat mines
- Assassins that can defeat the strongest piece under specific conditions
- Immobile mines

## Core rules
- Piece ranks are hidden until combat.
- Most units move one orthogonal square.
- Scouts move any number of unobstructed orthogonal spaces.
- Combat reveals involved pieces.
- Higher rank wins except for special matchups.
- Capture the enemy objective to win.
- Also win if the opponent has no movable pieces.

## Modes
- Vs computer.
- Local pass-and-play.
- Online multiplayer.
- Ranked setup presets plus custom setups.

## Online
- Hidden piece identities must remain private from the other client until revealed.
- Consider cryptographic commitments or host-authoritative encrypted/private state.
- Reconnect support.

## AI
- Maintain probability distributions over unrevealed enemy pieces.
- Easy uses basic positional rules.
- Medium tracks revealed information.
- Hard uses probabilistic search and objective-location inference.

## UI
- Original sci-fi/spy visual theme.
- Deployment interface.
- Hidden piece backs.
- Reveal animations after combat.
- Move history that records revealed ranks without leaking unrevealed ones.

## Tests
- Combat hierarchy.
- Special unit interactions.
- Long-range movement.
- Terrain blocking.
- Hidden information.
- Objective capture.
- No-move victory.
- Open-source license.
- Deploy to Vercel.
