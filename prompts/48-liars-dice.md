# Liar's Dice

Build an open-source browser Liar's Dice game with hidden dice, bluffing, bots, and online multiplayer.

## Core gameplay
- 2–8 players, each starting with a configurable number of dice under a private cup.
- All players roll secretly.
- Players make increasingly strong bids about the total count of a face across all hidden dice.
- On a turn, raise the bid or challenge the previous bid.
- Reveal dice on challenge and apply the configured loss/penalty rule.
- Continue rounds until one player remains.

## Rules variants
- Clearly define whether ones are wild.
- Optional exact-bid/call-spot-on mechanic.
- Configurable bid-order rule and starting dice.

## AI
- Estimate probability of bids from own dice and unknown dice, with personality-based bluff/challenge thresholds.

## Online/UI
- Each client receives only its own dice until reveal.
- Cup animation, bid builder, probability helper optional in training mode, round history.
- Tests for bid ordering, wild ones, challenge resolution, exact bids, elimination, and privacy boundaries.
- Open-source license, README, Vercel deployment.
