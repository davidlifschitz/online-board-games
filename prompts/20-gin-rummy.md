# Gin Rummy

Build a polished open-source two-player Gin Rummy web app.

## Core gameplay
- Standard 52-card deck, 10 cards per player.
- On each turn draw from stock or discard pile, then discard one card.
- Detect sets and runs and minimize deadwood.
- Support knocking, gin, undercut, layoff where rules allow, and configurable target score.

## Modes
- Player vs computer.
- Local two-player with privacy handoff.
- Online 1v1 rooms and rematches.

## AI
- Easy pursues obvious melds.
- Medium estimates discard value and opponent interest.
- Hard tracks exposed cards, computes optimal meld partitions, estimates unseen-card probabilities, and chooses knock timing strategically.

## UI/engineering
- Automatically suggest optimal meld grouping while allowing manual arrangement.
- Clear stock/discard, score breakdown, round history, and gin/knock controls.
- Tests for meld detection with overlapping possibilities, deadwood minimization, knock legality, undercut, gin bonus, and scoring.
- Open-source licensed assets, mobile UI, README, Vercel deployment.
