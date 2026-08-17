# Scattergories-style category party game

Build an original open-source real-time party word game around categories and a randomly selected starting letter.

## Core gameplay
- 2–12+ players.
- Each round chooses a letter and displays an original category list.
- Players have a timer to enter one answer per category beginning with the selected letter.
- After time expires, reveal answers category by category.
- Duplicate answers score reduced/no points; unique valid answers score.
- Players vote on disputed answers, with optional host override.

## Modes
- Online room-code multiplayer as the primary mode.
- Local party mode.
- Bot/judge assistant optional, but never silently decide ambiguous subjective answers without showing rationale.

## Features
- Custom category packs, family-safe packs, custom timers, team mode, rotating host, round summaries.

## Engineering/UI
- Private answer entry until reveal.
- Robust reconnect and timer synchronization.
- Tests for duplicate normalization, scoring, voting, timers, and room progression.
- Original categories/branding, responsive UI, README, open-source license, Vercel deployment.
