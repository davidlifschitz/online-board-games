# Farkle-style push-your-luck dice game

Build an open-source browser implementation of the traditional Farkle dice-game family with configurable scoring rules and original presentation.

## Core gameplay
- Six dice.
- Roll, select at least one scoring die/group, bank it, then choose to stop and score the turn or roll remaining dice.
- If a roll has no scoring combination, the turn scores zero.
- When all six dice score, allow hot-dice reroll of all six.
- Race to a configurable target score with final-round logic.

## Scoring
- Implement a documented default table for singles, triples, and common multi-die combinations.
- Make straight, three-pairs, four/five/six-of-a-kind, and entry-threshold rules configurable.

## Modes/AI
- Solo score chase, bots, local, online rooms.
- Bots choose continue/bank using expected value, score position, and remaining dice.

## UI/engineering
- Dice selection, projected turn score, risk indicator, match scoreboard.
- Tests for every scoring pattern, hot dice, busts, target/final round, and AI legality.
- Open-source license, README, Vercel deployment.
