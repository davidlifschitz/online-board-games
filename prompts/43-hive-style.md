# Hive-style expanding-board strategy game

Build an original open-source tile-based abstract strategy game inspired by games played without a fixed board. Do not copy Hive piece names, insect theme, artwork, exact movement set, or branded rules.

## Original concept
Use a distinct theme such as elemental spirits or robots. Each tile type has a unique movement rule.

## Core gameplay
- 2 players alternately place or move tiles in one connected cluster.
- One special core/leader tile must be deployed by an early-turn deadline.
- Win by completely surrounding the opposing leader.
- Enforce a one-cluster connectivity rule so moves cannot split the board.

## Piece design
- Create 5–7 original tile classes: crawlers, jumpers, climbers, sliders, etc., with distinct movement patterns that are not a direct copy of the commercial set.

## AI/engineering
- Dynamic axial/hex coordinates with no fixed board bounds.
- AI evaluates surround pressure, mobility, pinning, connectivity, and tempo.
- Tests for placement adjacency, connectivity, each movement class, surround victory, and edge cases.
- Original art/theme, mobile controls, README, open-source license, Vercel deployment.
