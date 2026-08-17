# Blackjack strategy trainer

Build an open-source Blackjack browser game focused on probability and basic-strategy learning, using only play-money scoring.

## Core gameplay
- Configurable 1–8 deck shoe.
- Dealer hits/stands according to configurable soft-17 rule.
- Support hit, stand, double, split, resplit settings, blackjack payout configuration, surrender where enabled, and insurance toggle.
- Correct ace handling and split-hand resolution.

## Modes
- Casual play-money rounds.
- Basic-strategy trainer that grades each decision.
- Practice scenarios by player hand/dealer up-card.
- Optional card-counting practice using a simulated shoe, framed educationally rather than for real-money play.

## UI/engineering
- Clear table, hand totals including soft/hard status, shoe penetration, decision feedback, session statistics.
- Deterministic seeded simulation option.
- Tests for blackjack detection, split aces, doubling, soft totals, dealer rules, payouts, and shoe reshuffle.
- No payments or real-money features; open-source license, README, Vercel deployment.
