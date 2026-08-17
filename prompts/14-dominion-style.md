# Dominion-style deck-building game

Build an original open-source competitive deck-building card game for the browser. Do not copy Dominion card names, artwork, card text, kingdom sets, or branding.

## Core gameplay
- 2–4 players.
- Everyone starts with the same small deck containing currency and low-value scoring cards.
- Each turn has action, purchase, and cleanup phases.
- Buy cards from a shared market and add them to the discard pile so decks improve over time.
- Include original card families for economy, card draw, extra actions, attacks, reactions, trashing, and scoring.
- End the game when defined market piles are exhausted; highest score wins.

## Modes and AI
- Solo vs 1–3 bots, local multiplayer, and online rooms.
- Easy bots favor purchasing power; medium bots use simple deck archetypes; hard bots estimate card synergy, deck cycling, tempo, denial, and endgame timing.

## Technical/UI
- Data-driven card definitions so new sets can be added without changing the engine.
- Clear hand, play area, discard, deck count, market, action/buy/currency counters, and turn log.
- Hide private hands in multiplayer.
- Tests for shuffle determinism, card effects, action/buy phases, attacks/reactions, trashing, scoring, and end conditions.
- Original assets and wording, responsive UI, README, open-source license, Vercel deployment.
