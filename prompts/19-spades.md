# Spades

Build an open-source browser Spades game centered on partnership play, bidding, bots, and online rooms.

## Core rules
- Four players in two fixed partnerships.
- 13-card deal.
- Each player bids expected tricks.
- Spades are trump and cannot normally be led until broken.
- Follow suit when possible.
- Score contracts, overtricks/bags, penalties, and configurable nil/blind-nil rules.
- Match ends at configurable target score.

## Modes
- Solo with three bots.
- Local pass-and-play.
- Online 4-player rooms with bots filling empty seats.

## AI
- Bidding model based on high cards, trump length, distribution, partner context, and score.
- Play model tracks remaining suits/trumps, contract requirements, nil protection/attack, bags, and endgame score.

## UI/engineering
- Partnership seating, bidding phase, trick animation, contract/score panel, match log.
- Tests for bidding, follow suit, trump break, trick evaluation, nil, bags, and match scoring.
- Responsive, accessible, open-source, Vercel deployment.
