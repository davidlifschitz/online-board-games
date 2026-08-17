# President-style climbing card game

Build an open-source browser implementation of the traditional climbing/shedding card-game family often called President, using neutral original branding.

## Core gameplay
- 3–8 players.
- Standard 52-card deck by default.
- Players take turns playing one card or matching groups of equal rank that beat the current play.
- Players may pass; trick resets when everyone else passes.
- First player to empty their hand finishes first; continue until standings are determined.
- Make rank order and optional house rules configurable.

## Modes
- Solo with bots, local pass-and-play, and online rooms.

## Variants
- Optional revolution/four-of-a-kind reversal, clearing cards, jokers, and between-round card exchanges.
- House-rule configuration stored in room settings.

## AI/UI/engineering
- Bots evaluate hand structure, control cards, group preservation, and opponent hand sizes.
- Private hands, clear current combination, pass state, standings, and turn history.
- Deterministic rules engine with tests for legal combinations, passes, resets, finishing order, and each enabled variant.
- Responsive, original presentation; README, open-source license, Vercel deployment.
