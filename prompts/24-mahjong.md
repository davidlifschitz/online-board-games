# Mahjong

Build an open-source browser Mahjong platform. Start with one clearly identified ruleset and architect the engine so additional rulesets can be added later.

## Initial ruleset
- Implement either Japanese Riichi or Hong Kong Old Style completely and document the choice in the README.
- Four-player wall/deal flow, draws/discards, calls, winning-hand validation, exhaustive draw, and scoring for the selected ruleset.
- For Riichi, include yaku/fu/han, riichi, dora, furiten, kan, and dealer rotation.

## Modes
- Solo with bots.
- Local privacy handoff.
- Online four-player rooms with reconnect support.

## AI
- Tile-efficiency heuristics, shanten calculation, ukeire, defensive discard logic, and score context.

## UI/engineering
- Responsive table with clear discard rivers, calls, winds/dealer, score sticks, and hand sorting.
- Data-driven ruleset module.
- Extensive tests for hand validation, waits, calls, scoring edge cases, wall exhaustion, and round progression.
- Open-source tile artwork, attribution, README, Vercel deployment.
