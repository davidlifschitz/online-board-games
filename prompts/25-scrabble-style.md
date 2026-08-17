# Scrabble-style word board game

Build an original open-source crossword tile-placement game. Do not use Scrabble branding, board layout, tile distribution, artwork, or proprietary word data.

## Core gameplay
- 2–4 players.
- Place letter tiles on a square board to form connected horizontal/vertical words.
- Use an original board layout with letter/word multiplier spaces and an original tile frequency/value distribution.
- Validate every newly formed word against an openly licensed dictionary.
- Draw back to rack size after each turn.
- Support pass and tile exchange.
- End when bag/hand conditions are met; highest score wins.

## Modes
- Solo vs bots, local multiplayer, online rooms, asynchronous correspondence.

## AI
- Generate legal plays using trie/DAWG-style word search, rack leave value, board equity, bingo-like bonuses, and opponent openings.

## UI/engineering
- Drag/tap tiles, rack reordering, score preview, dictionary lookup, move history.
- Never send another player's rack to unauthorized clients.
- Tests for placement geometry, cross-words, multipliers, dictionary checks, bag counts, and final scoring.
- Original/open assets and dictionary, README, license, Vercel deployment.
