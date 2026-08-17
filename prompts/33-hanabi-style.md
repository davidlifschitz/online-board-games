# Hanabi-style cooperative hidden-hand card game

Build an original open-source cooperative card game where players can see teammates' cards but not their own. Do not copy Hanabi branding, card art, or exact deck presentation.

## Core gameplay
- 2–5 players cooperate to build ordered sequences across several suits/themes.
- Players see everyone else's hands but their own hand is hidden from them.
- On a turn choose one: play a card, discard a card, or spend a limited information token to give a constrained truthful clue.
- Incorrect plays consume limited mistake/life capacity.
- Successful sequence milestones may restore clue capacity.
- Score based on completed sequences.

## Modes
- Online cooperative rooms.
- Local pass-and-play designed to prevent seeing one's own hand.
- Solo multi-hand puzzle variant.

## Engineering/UI
- Information tracking is central: preserve exactly which properties each player has been told about each card.
- Never reveal a player's own hidden cards to that player's client.
- Tests for clue legality, knowledge-state updates, draw order, play/discard effects, endgame countdown, and scoring.
- Original theme/assets, open-source license, README, Vercel deployment.
