# Pandemic-style cooperative strategy game

Build an original open-source cooperative network-crisis board game inspired by global containment mechanics. Do not copy Pandemic's map, diseases, roles, cards, artwork, or exact rules.

## Original concept
Create a fictional network of 30–50 locations facing several spreading crisis types. Players are specialists cooperating to stabilize the network before outbreak/escalation thresholds are exceeded.

## Core loop
- Each player takes a limited number of actions: move, treat, share resources, build facilities, complete objectives.
- End turn by drawing player/resource cards, then resolving crisis propagation cards.
- Chain reactions can spread into connected locations.
- Multiple shared loss conditions and objective-based team victory.

## Modes
- 1–4 players with optional bots/autopilot suggestions.
- Online cooperative rooms.
- Difficulty levels using crisis deck composition.

## Engineering/UI
- Graph-based map, deterministic seeded deck mode, action undo before hidden/random information is revealed.
- Tests for propagation chains, facility/movement rules, sharing, objectives, deck exhaustion, and all win/loss conditions.
- Original world/theme/assets, open-source license, README, Vercel deployment.
