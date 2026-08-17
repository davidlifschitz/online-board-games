# Mancala / Kalah

Build an open-source browser implementation of Kalah, with architecture that can later support other Mancala-family rulesets.

## Core Kalah rules
- Two rows of pits plus one store per player.
- Configurable stones per pit, default 4.
- Choose a non-empty pit on your side and sow stones counterclockwise, skipping opponent store.
- Last stone in own store grants extra turn.
- Capture rule when last stone lands in an empty own pit opposite occupied opponent pit.
- End when one side's pits are empty; sweep remaining stones; highest store wins.

## Modes/AI
- Vs computer, local 1v1, online rooms.
- Easy random; medium minimax; hard alpha-beta with extra-turn awareness, capture threats, store gain, mobility, and endgame search.

## UI/engineering
- Animated sowing with optional fast mode.
- Show projected landing pit on hover/tap-and-hold.
- Tests for sowing wrap, store skip, extra turn, capture, game end, and AI forced tactics.
- Accessible mobile layout, README, open-source license, Vercel deployment.
