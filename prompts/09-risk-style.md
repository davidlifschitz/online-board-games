# Risk-style territory game

**Live implementation: [Frontiers — The Shattered World](https://frontiers-snowy.vercel.app)**

Build an original open-source turn-based world-conquest strategy game inspired by territory-control board games.

Do not reproduce Risk’s map, cards, branding, rules text, or artwork. Create an original fictional world map and rule set.

Working title: “Frontiers.”

## Map
- Create a fictional world of 30–45 territories grouped into 5–7 regions.
- Territories have adjacency relationships.
- Make an attractive SVG map with clickable regions.
- Each larger region awards a reinforcement bonus if fully controlled.

## Core loop
1. Reinforcement phase.
2. Attack phase.
3. Fortification phase.

## Combat
- Attacker chooses number of armies committed.
- Resolve combat using dice-inspired random outcomes.
- Defender chooses defensive commitment.
- Territories change ownership when defenders reach zero.
- Preserve enough troops to keep territories occupied.

## Game setup
- 2–6 players.
- Random or draft territory assignment.
- Starting-army allocation.
- Optional bots.

## Cards
- Award cards for conquering at least one territory during a turn.
- Sets may be redeemed for increasing reinforcements.
- Use original symbols and progression.

## Win modes
- World domination.
- Capital conquest.
- Objective missions.
- Turn-limited highest-score mode.

## Bots
- Easy expands randomly.
- Medium values regional bonuses and border strength.
- Hard evaluates enemy weakness, chokepoints, region completion, reinforcement efficiency, threat level, and card timing.

## Online
- Room codes.
- 2–6 players.
- Host-authoritative state.
- Turn timer optional.
- Reconnect support.
- Add bots to replace disconnected players if host chooses.

## UI
- SVG world map.
- Hover/tap territory details.
- Army counters.
- Attack arrows.
- Dice/result animation.
- Clear phase indicator.
- Turn history.
- Excellent mobile zoom/pan.

## Technical
- Store adjacency in explicit map data.
- Pure combat/reinforcement engine.
- Deterministic RNG option for tests.
- Tests for adjacency, reinforcement calculations, combat, territory capture, region bonuses, card redemption, and victory conditions.
- Randomized bot simulations.
- Open-source license.
- Deploy to Vercel.
