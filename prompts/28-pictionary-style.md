# Pictionary-style drawing party game

Build an original open-source online draw-and-guess party game. Use original branding and an original/open prompt list.

## Core gameplay
- 3–12+ players.
- Rotate the drawing role.
- Drawer privately receives a word/phrase and draws on a shared canvas while others submit guesses.
- Correct guesses earn points based on speed; drawer earns points when players guess successfully.
- Round timer and configurable number of rounds.

## Drawing tools
- Pen, eraser, thickness, limited palette, clear canvas, undo policy.
- No text tool, image uploads, or copy/paste into canvas during standard play.

## Multiplayer
- Real-time stroke synchronization with efficient incremental messages.
- Room codes/invite links, spectators, reconnect support, host moderation.
- Chat guesses should filter the exact answer to prevent accidental leakage.

## UI/engineering
- Touch/stylus/mouse support; responsive landscape and portrait.
- Tests for scoring, round rotation, answer normalization, timer behavior, and permission boundaries.
- Original prompt packs, open-source license, README, Vercel deployment.
