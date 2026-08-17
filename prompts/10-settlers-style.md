# Settlers-style resource game

Build an original open-source hex-based resource-trading strategy game inspired by modern settlement-building games.

Do not use Catan branding, artwork, exact board, named resources, development cards, or copied rules text. Create distinct terminology, balancing, visual design, and content.

Working title: “Harborlands.”

## Core board
- Randomized hex map.
- Five original resource types, for example Timber, Clay, Grain, Wool, and Ore.
- One barren hex.
- Each productive hex gets a number token.
- Settlements sit at hex intersections.
- Roads connect intersections.

## Core mechanics
- Roll two dice on a turn.
- Hexes matching the roll produce resources for adjacent settlements/cities.
- Players build roads, settlements, and upgraded towns.
- Construction requires resource combinations.
- Settlement-placement distance rule.
- Roads must connect legally.

## Trading
- Player-to-player trade offers.
- Bank trades.
- Harbor/port bonuses.

## Conflict
- On a designated roll such as 7, players above a hand threshold discard part of their hand.
- Active player moves a bandit/raider token.
- Block production on that hex.
- Steal one random card from an adjacent player.

## Scoring
- Settlements.
- Town upgrades.
- Longest-road-style bonus with an original name/rule.
- Hidden objective cards or achievement cards using original mechanics.
- First to target score wins.

## Modes
- 2–4 players.
- Vs bots.
- Online rooms.
- Local game.

## AI
- Evaluate production probability, expansion opportunities, resource scarcity, trade value, blocking strategy, and race toward victory points.

## UI
- Attractive procedurally laid-out hex board.
- Touch-friendly placement.
- Highlight legal vertices and road edges.
- Resource hand.
- Build menu.
- Trade modal.
- Production animations.

## Technical
- Graph representation for intersections and edges.
- Tests for board topology, legal placement, road connectivity, resource production, trading, raider behavior, and scoring.
- Use original art and text only.
- Open-source license.
- Deploy to Vercel.
