# Love-Letter-style micro card game

Build an original open-source deduction micro-card game inspired by single-card-hand elimination games. Create original roles, theme, names, artwork, values, and effect text.

## Core gameplay
- 2–6 players.
- Players normally hold one card, draw one on their turn, then play one.
- Cards have distinct ranks and information/deduction effects such as guessing a role, comparing ranks, inspecting a hand, temporary protection, forced discard, or hand swap.
- Last surviving player or highest remaining rank when the deck runs out wins the round.
- Play multiple rounds to a configurable token/point target.

## Modes
- Bots, local pass-and-play with privacy screen, and online rooms.

## AI
- Maintain probabilistic beliefs based on discarded cards, revealed information, protections, and prior actions.

## Technical/UI
- Private hands must not leak to other players.
- Compact portrait-first mobile interface.
- Round history and visible discard pool.
- Tests for every role interaction, elimination, deck exhaustion, turn order, protection expiration, and scoring.
- Original presentation, README, open-source license, and Vercel deployment.
