# TrainGames V2 Redesign

## Goal
Create a materially redesigned V2 gameplay experience for every currently live TrainGames game except DiscShift/Othello while preserving every V1 route and implementation.

## Scope

Twenty-four V2 builds:

- deal-room
- photo-puzzle
- uno-style / HueBreak
- codenames-style / Threadmark
- connect-four / Fourfront
- checkers / Crown Jump
- backgammon / Racehome
- battleship-style / Gridwake
- risk-style / Frontiers
- five-dice
- carcassonne-style / Tilebound
- president / High Table
- hearts
- spades
- gin-rummy
- rummy-500
- blackjack / Twenty-One Lab
- 2048-multiplayer / Mergefront
- dots-and-boxes / Boxline
- mancala / Sowstone
- nine-mens-morris / Millstone
- hex / Hexline
- mastermind / Cipherloom
- farkle / Spark Six

DiscShift/Reversi/Othello is explicitly excluded.

## Coexistence contract

- V1 routes remain unchanged and continue to be the compatibility routes recorded by `liveUrl`.
- Each V2 route is hosted under `/games/<canonical-slug>/v2/`.
- For externally hosted V1 games, the V1 deployment remains untouched while a first-party V2 implementation is added to the TrainGames repository.
- The arcade becomes version aware. When V2 is available, V2 is the primary play action and V1 remains one tap away.
- Each game screen contains a visible V1/V2 switch.
- V2 submissions use the existing game IDs and are independent leaderboard entries, so V1 and V2 can receive separate votes.

## Presentation architecture

Use a shared dependency-free V2 design system plus per-game profiles. V2 is not a runtime skin over V1. Local games may reuse their tested rule/AI engines and DOM hooks, but the V2 route receives a separate shell and aggressive presentation layer with its own markup entry point. External games receive first-party V2 implementations in this repository.

Four presentation families:

1. **Board/table strategy:** Crown Jump, Racehome, Gridwake, Tilebound, Boxline, Sowstone, Millstone, Hexline, Fourfront, Frontiers.
2. **Card/table:** HueBreak, High Table, Hearts, Spades, Gin Rummy, Rummy 500, Twenty-One Lab, Five Dice.
3. **Action/social:** Deal Room, Threadmark, Spark Six.
4. **Puzzle/solo:** Photo Puzzle, Mergefront, Cipherloom.

## Shared visual contract

Every V2 route must visibly differ from V1 at first glance on both desktop and phone:

- compact floating TrainGames game bar with arcade exit, game title, V1/V2 switch, restart/settings access;
- current state/turn/score/phase is visually dominant;
- play surface owns the majority of useful viewport space;
- rules, provenance, and setup details are secondary drawers/sheets rather than permanent primary content;
- valid-now actions sit adjacent to the play surface or in a mobile thumb dock;
- phone layout is purpose-built rather than a stacked desktop layout;
- purposeful animations for placement, capture, trick completion, dice rolls, scoring, and turn changes;
- `prefers-reduced-motion` disables nonessential animation;
- accessible focus rings and at least 44px direct-action touch targets where geometry permits;
- no heavy UI framework or external runtime dependency.

## Per-game direction

- Deal Room: sets dominate the table; swipeable hand; contextual play/pay/collect sheet.
- Photo Puzzle: workbench canvas first; docked/swipe-up tray; floating zoom/pan.
- HueBreak: large discard/draw focal point; curved hand rail; direction/current-hue indicator.
- Threadmark: near-full-screen word grid; team/turn strip; spymaster mode bar.
- Fourfront: oversized vertical board; column previews; turn halo.
- Crown Jump: tactile board; capture-chain feedback; forced moves obvious.
- Racehome: real board/trays/dice zone; legal destination feedback.
- Gridwake: target grid primary while firing; own fleet as tactical mini-map.
- Frontiers: map dominates; explicit reinforce/attack/fortify phase controls.
- Five Dice: large dice tray; interactive score sheet; eligible scoring rows highlighted.
- Tilebound: expandable landscape; current tile staged separately from follower placement.
- High Table: four-seat table; central pile; hand rail; rank/finish badges.
- Hearts: four-seat table; dedicated pass state; hearts-broken and penalties compactly visible.
- Spades: partnership scores; distinct bidding/trick phases; contract always visible.
- Gin Rummy: two-player table; stock/discard center; meld cues; contextual knock/gin.
- Rummy 500: shared meld area center; contextual draw/discard/meld actions.
- Twenty-One Lab: dealer/player table; optional analysis drawer.
- Mergefront: grid is the object; compact score/best; movement supplies feedback.
- Boxline: minimal board/paper treatment; large usable edges without geometry distortion.
- Sowstone: physical mancala treatment; sow-path feedback and distinct stores.
- Millstone: centered board with place/move/fly phase tracker and reserves.
- Hexline: responsive hex board; edge goals and connection paths emphasized.
- Cipherloom: vertical attempt history; isolated active guess; thumb-reachable picker.
- Spark Six: tactile dice; banked vs active dice separated; roll/bank dominate controls.

## Offline contract

- V1 service workers and cache namespaces remain unchanged.
- V2 service workers, where provided, must use a `<slug>-v2-` namespace and only delete stale caches beginning with that same prefix.
- V2 shared CSS/JS must be precached by every game-scoped V2 worker that supports offline play.

## Catalog contract

`games.json` remains backward compatible. Existing `liveUrl` stays V1. Live entries except Reversi gain:

```json
"versions": {
  "v1": {"liveUrl": "..."},
  "v2": {"liveUrl": "/games/<slug>/v2/", "label": "TrainGames V2"}
},
"preferredVersion": "v2"
```

Reversi/DiscShift has no V2 metadata.

## Leaderboard contract

No ranking-schema migration is required. V2 is submitted as a separate approved implementation against the existing `game_id`. Each submission has its own V2 play URL, source URL, implementation name, and vote count. V1 records are never mutated or deleted.

## Validation

- Contract test enumerates exactly 24 V2 routes and explicitly excludes DiscShift.
- Every V2 route references shared V2 assets and contains a version-switch affordance.
- Existing V1 HTML files are byte-for-byte untouched by the V2 implementation except catalog/arcade files outside the game routes.
- Engine regression suites continue passing.
- V2 service-worker cache isolation is statically tested.
- JavaScript syntax and JSON parsing run in CI.
- Production deployment happens only after PR code/CI review; Vercel Git deployment remains disabled during development.
