# Uno-style card game

Build an open-source browser game inspired by classic color-and-number shedding card games.

The app should be deployable on Vercel and work well on desktop and mobile.

## Core gameplay
- 2–6 players.
- Each player starts with a hand of cards.
- Cards have one of four colors and either a number or special action.
- On a turn, a player may play a card matching the current color, number, or action symbol.
- Include original equivalents of Skip, Reverse, Draw Two, Wild, and Wild Draw Four.
- A player who reaches one card must press a prominent “Last card” button before ending their turn.
- First player to empty their hand wins.
- Implement a clear draw/discard pile.
- Enforce all legal-move rules in the game engine.

## Modes
- Solo against 1–5 computer opponents.
- Local pass-and-play.
- Online multiplayer rooms using room codes or invite links.
- Allow bots to fill empty online seats.

## AI
- Easy: mostly random legal moves.
- Medium: prioritizes action cards, color control, and hand reduction.
- Hard: tracks approximate color frequencies and opponent hand sizes.

## Multiplayer
- Use a host-authoritative architecture.
- Prefer peer-to-peer WebRTC if feasible without paid infrastructure.
- Validate all moves on the host.
- Handle disconnects gracefully.
- Show connected/disconnected status.
- Allow the host to restart the game with the same players.

## UI
- Create entirely original card art and branding.
- Use four visually distinct colors with colorblind-accessible symbols/patterns.
- Make cards large enough for phone interaction.
- Animate card plays and turn changes subtly.
- Clearly show current player, direction of play, opponent card counts, draw pile, current discard, and active color after a wild.
- Do not expose opponents’ card contents.

## Technical requirements
- Keep rules in a standalone deterministic game engine.
- Add unit tests for valid/invalid card plays, reverse behavior at 2 players and 3+ players, draw cards, wild color selection, win detection, and turn progression.
- Add randomized bot simulations to ensure games terminate.
- Use no copyrighted card artwork, logos, names, or text beyond generic mechanics.
- Include an open-source license and README.
- Deploy a production version to Vercel.
