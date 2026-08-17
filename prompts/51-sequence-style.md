# Sequence-style card-and-board game

Build an original open-source team card/board strategy game inspired by matching cards to spaces and forming connected lines. Do not copy Sequence branding, board arrangement, artwork, special-card presentation, or exact rule text.

## Original design
- Create a unique grid whose spaces correspond to an original symbol/card deck rather than standard playing-card imagery if desired.
- 2–6 players, supporting 1v1 and teams.
- On a turn play a card matching an open board space and place a team marker there, then draw a replacement.
- Include original wildcard/remove-marker action cards with balanced restrictions.
- Win by completing one or more connected runs of a target length depending on player count.

## Modes/AI
- Vs bots, local teams, online rooms.
- AI evaluates run creation, opponent blocking, multi-threat intersections, special-card conservation, and team strategy.

## UI/engineering
- Clear card hand, board matching highlights, team markers, completed-run highlighting, turn history.
- Private hands online.
- Tests for card-space mapping, legal placements/removals, run detection in all directions, overlapping-run rules, and win conditions.
- Original assets, open-source license, README, Vercel deployment.
