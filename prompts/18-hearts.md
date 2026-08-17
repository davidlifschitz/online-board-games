# Hearts

Build an open-source Hearts web app with strong bots and online multiplayer.

## Rules
- Standard 4-player Hearts with configurable variants.
- Deal 13 cards each and pass three cards in the standard rotating pattern.
- Follow suit when possible.
- Hearts cannot be led until broken unless only hearts remain.
- Enforce opening-trick restrictions on penalty cards.
- Each heart is one penalty point; queen of spades is 13.
- Implement shooting the moon and configurable game target, default 100.

## Modes
- Human + 3 bots, local pass-and-play, and four-player online rooms with bot fill.

## AI
- Easy basic legal play.
- Medium tracks void suits and dangerous cards.
- Hard estimates unseen-card distributions, passing strategy, moon attempts, and score-relative risk.

## UI/engineering
- Sortable private hand, trick center, score table, pass-selection interface, game history.
- Tests for follow-suit, broken-hearts logic, first-trick restrictions, trick winner, moon scoring, and match end.
- Original card assets or open licensed deck, mobile friendly, README, license, Vercel deployment.
