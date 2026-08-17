# Carcassonne-style tile game

Build an original open-source tile-placement strategy game inspired by medieval map-building games. Do not copy proprietary artwork, tile layouts, terminology, or scoring text.

## Core gameplay
- 2–5 players.
- Draw one landscape tile per turn and place it so roads, towns, fields, and landmarks connect legally.
- Let players place a limited follower-like piece on eligible features.
- Complete features to score and return pieces where appropriate.
- Score unfinished features at game end using an original scoring system.

## Modes
- Solo vs bots.
- Local pass-and-play.
- Online rooms with bots filling open seats.

## AI
- Easy: legal random placement.
- Medium: maximize immediate score and deny obvious opponent completions.
- Hard: evaluate follower scarcity, feature ownership, future tile probability, blocking, and endgame equity.

## UI and engineering
- Original illustrated tile set generated from deterministic tile definitions.
- Drag/rotate/place interactions with legal-placement previews.
- Host-authoritative online state.
- Deterministic seeded tile bag.
- Unit tests for edge matching, connected features, ownership ties, follower return, scoring, and endgame.
- Mobile-friendly, MIT/Apache-compatible open-source dependencies, README, and Vercel deployment.
