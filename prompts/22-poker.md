# Play-money Poker

Build an open-source browser poker app for entertainment and strategy practice only. Do not implement real-money wagering, deposits, cash-out, or gambling integrations.

## Initial game
- No-limit Texas Hold'em.
- 2–9 seats.
- Dealer button, blinds, hole cards, flop/turn/river, betting rounds, all-ins, side pots, showdown, ties, and split pots.
- Correct hand evaluator.

## Modes
- Play-money solo table with bots.
- Private online rooms using non-purchasable virtual chips.
- Tournament-style elimination mode using only in-game points.

## AI
- Multiple bot personalities using hand strength, pot odds, position, stack-to-pot ratio, opponent tendencies, and controlled bluff frequency.

## UI/engineering
- Poker-table layout, private hole cards, pot/side-pot display, action timer, bet sizing presets, hand history, showdown explanation.
- Host-authoritative deck and game state; cryptographically secure shuffle where feasible.
- Tests for hand ranking, betting legality, all-ins, side pots, odd chips, and showdown.
- Responsible play-money labeling, open-source license, README, Vercel deployment.
