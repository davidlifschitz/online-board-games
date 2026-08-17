# Guess-Who-style deduction game

Build an original open-source yes/no identity deduction game. Do not use Guess Who branding, character art, names, or board design.

## Core gameplay
- Each player receives the same roster of original characters/entities defined by visible attributes.
- Each secretly gets one target.
- Alternate asking constrained yes/no questions about attributes, then eliminate candidates.
- Allow a final identity guess instead of a question; incorrect guesses may lose immediately or consume a turn according to room settings.

## Content system
- Generate original themed packs: fantasy characters, robots, animals, historical-object archetypes, etc.
- Each pack has structured attributes so questions can be generated as buttons as well as optional free text.

## Modes
- Vs bot, local 1v1, online 1v1, family mode.

## AI/engineering
- Bot chooses questions by expected information gain and updates candidate set from answers.
- Hidden target must remain private online.
- Tests for attribute filtering, question truth, information-gain selection, target guesses, and game end.
- Accessible responsive roster, open-source license, README, Vercel deployment.
