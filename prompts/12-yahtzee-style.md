# Five Dice / Yahtzee-style game

Build a polished open-source Yahtzee-style dice game for the browser.

Use generic dice-game branding and original presentation. If necessary, call the game “Five Dice” rather than relying on branded presentation.

## Core gameplay
- Five six-sided dice.
- Up to three rolls per turn.
- After each roll, player can lock/unlock individual dice.
- After the final roll or sooner, player must score the roll in one unused category.

## Score categories

### Upper section
- Ones
- Twos
- Threes
- Fours
- Fives
- Sixes

### Lower section
- Three of a Kind
- Four of a Kind
- Full House
- Small Straight
- Large Straight
- Five of a Kind
- Chance

## Scoring
- Upper-section bonus when threshold is reached.
- Five-of-a-kind bonus rules can be configurable.
- Show projected score for every available category before selection.
- Once a category is chosen it cannot be reused.

## Modes
- Solo score chase.
- Vs computer.
- Local multiplayer.
- Online multiplayer room.
- Daily seeded challenge where everyone receives the same deterministic dice sequence.

## AI
- Easy uses simple heuristics.
- Medium estimates expected value by category.
- Hard uses dynamic programming / expected-value strategy to decide which dice to hold, whether to reroll, and which category to score.

## Features
- Match history saved locally.
- Personal best.
- Score distribution.
- Statistics by category.
- Optional multiplayer best-of-N.

## UI
- Large animated dice.
- Tap dice to hold.
- Held dice clearly indicated.
- Scorecard optimized for mobile.
- Highlight available categories with projected scores.
- Turn indicator.
- Confetti/subtle win animation.

## Engineering
- Pure scoring engine.
- Seedable RNG for testing and daily challenge.
- Unit tests for every scoring category.
- AI simulation tests.
- Accessibility: dice pips plus numeric labels, keyboard controls, reduced-motion support.
- Open-source license.
- README.
- Deploy to Vercel.
