# Frontiers

Frontiers is an original, open-source, turn-based world-conquest strategy game for the browser. It is inspired by the broad territory-control genre, but it uses its own fictional map, terminology, card symbols, combat system, reinforcement curve, scoring, missions, and presentation.

## What is original

Frontiers does **not** reproduce Risk's map, cards, branding, rules text, or artwork. Its 36-territory world is divided into six original regions: Aurelian Reach, Verdant Coil, Ember Marches, Nacre Isles, Zephyr Crown, and Umbral Expanse.

The clash system is also original: attackers commit up to four armies, defenders commit up to three, each committed army rolls a d6, and 5–6 scores a hit. Hits resolve simultaneously. When neither side scores a hit, the highest roll breaks the deadlock; an equal highest roll costs each side one committed army. A capture only succeeds if at least one committed attacker survives, and the origin must remain occupied. If both committed forces are wiped out in the same clash, the defender keeps a one-army last stand so no territory is ever left empty.

## Features

- 2–6 players.
- Local pass-and-play plus Easy, Medium, and Hard bots.
- Random territory scatter or alternating territory draft.
- Starting reserve allocation with manual or automatic placement.
- Reinforcement, attack, and fortification phases.
- Six region-control bonuses.
- Frontier cards using Forge, Beacon, Aegis, and Prism symbols with escalating set bonuses.
- Four win modes: world domination, capital ascendancy, objective missions, and turn-limited score.
- Host-authoritative online rooms using WebRTC data channels and six-character room codes.
- Reconnect identity via a locally stored client token; hosts can replace disconnected human seats with bots.
- Optional turn timers.
- SVG map with click/tap interactions, cross-region sea routes, army counters, attack arrows, region legend, keyboard territory activation, wheel zoom, drag pan, and touch pinch zoom.
- Pure rules modules with deterministic RNG support.
- Node built-in tests for map adjacency, reinforcement math, combat, capture, region bonuses, cards, victory conditions, fortification, and seeded bot simulations.
- Service worker caching for the local game shell. Online rooms still inherently require network signaling/connectivity.

## Online architecture

Frontiers uses PeerJS 1.5.5 only when online mode is selected. The host owns the canonical game state. Card symbols and objective assignments are public game information in Frontiers, so the canonical state contains no intentionally hidden hand or mission data. Guests send action intents; only the host validates/applies those intents and broadcasts updated state. The default PeerJS Cloud service is used for signaling, while WebRTC carries game data between browsers.

For larger-scale or higher-assurance production use, self-host the PeerServer and configure TURN infrastructure rather than relying on the public signaling service.

PeerJS is MIT-licensed. See: https://github.com/peers/peerjs

## Run locally

The game is static and has no build step.

```bash
python3 -m http.server 8080
```

Then open `http://localhost:8080`.

## Test

```bash
npm test
npm run check
npm run simulate
```

## Deploy

The repository includes `vercel.json` and can be deployed as a static Vercel project.

## Project layout

- `src/map-data.js` — explicit territory, region, SVG polygon, and adjacency data.
- `src/engine.js` — deterministic game rules and state transitions.
- `src/bots.js` — Easy/Medium/Hard heuristics and bot turn runner.
- `src/online.js` — lazy-loaded PeerJS room transport.
- `src/app.js` — browser UI and host-side command routing.
- `tests/` — rules and bot simulations.

## License

MIT. See `LICENSE`.
