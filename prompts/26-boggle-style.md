# Boggle-style word hunt

Build an original open-source timed word-search game based on tracing adjacent letters in a randomly generated grid.

## Core gameplay
- Default 4x4 grid with configurable sizes.
- Generate letters from an original/open frequency model or dice set.
- Players form words by tracing adjacent cells in eight directions without reusing a cell in the same word.
- Validate against an openly licensed dictionary.
- Score longer words more heavily using an original scoring curve.

## Modes
- Solo timed challenge.
- Daily seeded grid.
- Real-time multiplayer where everyone receives the same board and timer.
- Cooperative mode to discover a target percentage of all valid words.

## Features
- At round end show missed words, longest words, unique finds, duplicates, and score breakdown.
- Optional minimum word length and family-safe dictionary.

## Technical
- Efficient trie search to enumerate all legal grid words.
- Seeded RNG for daily games.
- Tests for adjacency, no-cell-reuse, dictionary validation, board generation, and score calculation.
- Mobile-first tracing gestures, keyboard accessibility, open-source license, README, Vercel deployment.
