# Perudo-style dice bluffing game

Build an original/open browser implementation of the public-domain Liar's Dice family using a Perudo-like rules profile where legally appropriate, without copying proprietary branding/artwork.

## Gameplay profile
- 2–6 players, five dice each initially.
- Secret simultaneous rolls.
- Bids state a quantity and face value across all dice.
- Ones act as wild under standard rounds.
- Include challenge and exact-count call mechanics using clearly documented terminology.
- Losing rounds removes dice; last player with dice wins.
- Implement a special one-die round variant if included, but document its exact rule behavior.

## Modes/AI
- Bots, local pass-and-play with privacy screen, online rooms.
- AI uses conditional probability from own dice, player dice counts, bidding history, and bluff profiles.

## UI/engineering
- Private dice state, compact bid controls, reveal animation, per-player dice counts, round log.
- Tests for legal bid progression, wild-face conversions, challenge/exact resolution, special rounds, and elimination.
- Original branding/assets, README, open-source license, Vercel deployment.
