# Frontiers

Frontiers is an original MIT-licensed turn-based territory-control strategy game set on the fictional Shattered World. It is part of the `online-board-games` collection.

## Development

```bash
npm install
npm test
npm run dev
npm run build
```

The rules engine in `src/game.js` keeps explicit adjacency, seeded RNG, reinforcement, combat, card progression, scoring, victory checks, and bot heuristics separate from the UI. The intended online transport is host-authoritative: room-code clients send intents to a validating host, reconnect from canonical snapshots, and may be replaced by bots.

The world, names, presentation, symbols, and implementation are original and do not reproduce Risk artwork, map, branding, cards, or rules text.
