# TrainGames

## [Play TrainGames](https://os-online-board-games.vercel.app)

**Play one. Build one. Deploy one.**

TrainGames is an Apache-2.0 collection of open-source browser games and implementation specs built around a simple participation loop: play the finished games, pick one of 51 game prompts, build your own version, deploy it, and contribute it back. The commute/dead-zone idea remains central to the product: many games support offline play after a successful first load, so a tunnel or bad signal does not have to end the game.

**20 live games · 51 build prompts · 33 prompt concepts waiting for a first deployment**

### Choose your path

- **Players:** [Play a game](https://os-online-board-games.vercel.app/play.html) — free browser games, no install.
- **Builders:** [Pick a game to build](https://os-online-board-games.vercel.app/build.html#challenge) — Starter, Intermediate, and Advanced specs generated from the live catalog.
- **OSS contributors:** [Contribute a deployed game](https://os-online-board-games.vercel.app/build.html#submit) — submit a public deployment and source repository.
- **Community:** [See the leaderboard](https://os-online-board-games.vercel.app/leaderboard.html) — compare approved builds and vote.

Multiple implementations of the same prompt are welcome. A first implementation fills a gap in the arcade; alternate implementations let the community compare UI decisions, bots, architectures, frameworks, accessibility, and offline behavior.

The current production hostname remains `os-online-board-games.vercel.app` for compatibility with existing links and OAuth configuration while the product brand is TrainGames.

- [Open Source Game Build Challenge](BUILD_CHALLENGE.md)
- [Claim a build](BUILD_QUEUE.md)
- [See the catalog](GAME_CATALOG.md)
- [Read the contribution guide](CONTRIBUTING.md)
- [Inspect source lineage](OPEN_SOURCE_LINEAGE.md)
- [Browse live provenance](https://os-online-board-games.vercel.app/open-source.html)

## Why TrainGames?

Subway and rail commutes regularly cross dead zones. TrainGames keeps the collection browser-first and asks game implementations to support practical offline play for modes that do not inherently require networking. For the best commute experience, open the hub and the games you want while online before departure.

**TrainGames means games for the train, not games about trains.**

## Live games

| Game | Type | Play |
|---|---|---|
| Deal Room | cards · multiplayer · bot | [Play](/games/deal-room/) |
| Photo Puzzle | puzzle · solo · customizable | [Play](/games/photo-puzzle/) |
| Uno-style / HueBreak | cards · multiplayer · bot | [Play](https://huebreak-card-game.vercel.app) |
| Codenames-style / Threadmark | word · party · teams | [Play](https://threadmark-delta.vercel.app) |
| Connect Four / Fourfront | abstract · bot | [Play](https://fourfront-virid.vercel.app) |
| Checkers / Crown Jump | abstract · bot | [Play](/games/crown-jump/) |
| Racehome | Backgammon · dice · bot | [Play](/games/racehome/) |
| Gridwake | hidden-fleet strategy · bot | [Play](/games/gridwake/) |
| Risk-style / Frontiers | territory · bot | [Play](https://frontiers-snowy.vercel.app) |
| Five Dice | dice · solo · multiplayer | [Play](https://five-dice.vercel.app) |
| Carcassonne-style / Tilebound | tile placement · bot | [Play](/games/tilebound/) |
| Twenty-One Lab | play-money Blackjack trainer | [Play](/games/twenty-one-lab/) |
| Mergefront | seeded puzzle · multiplayer | [Play](/games/mergefront/) |
| Boxline | Dots and Boxes · bot | [Play](/games/boxline/) |
| Sowstone | Kalah · bot | [Play](/games/sowstone/) |
| Millstone | Nine Men's Morris · bot | [Play](/games/millstone/) |
| DiscShift | disk-flipping strategy · bot | [Play](/games/discshift/) |
| Hexline | Hex connection strategy · bot | [Play](/games/hexline/) |
| Cipherloom | deduction · solver | [Play](/games/cipherloom/) |
| Spark Six | dice · probability · bot | [Play](/games/spark-six/) |

**18 of the 51 numbered prompt concepts have a live implementation.** Deal Room and Photo Puzzle are additional deployed games outside the numbered prompt catalog.

## Build-a-Game Challenge

> **Pick one. Build it. Deploy it. Add it to the arcade.**

The Build page derives its first-build opportunities directly from `games.json`, so the public challenge list stays aligned with the actual catalog instead of maintaining a second hard-coded queue.

- AI coding tools are allowed.
- Traditional hand-written implementations are allowed.
- Hybrid workflows are allowed.
- Multiple implementations of the same prompt are allowed.
- A submitted implementation must be open source and playable in the browser.
- Use original or appropriately licensed assets and presentation.
- A complete playable core is more valuable than a large unfinished feature list.

See [BUILD_CHALLENGE.md](BUILD_CHALLENGE.md) for difficulty guidance and [CONTRIBUTING.md](CONTRIBUTING.md) for the submission flow.

## Collection architecture

- [`games.json`](games.json) — source of truth for game status, categories, difficulty, prompt paths, and live routes.
- [`build-catalog.js`](build-catalog.js) — testable helper that derives open build challenges from `games.json`.
- [`play.html`](play.html) + [`play.js`](play.js) — render the live collection from `games.json`.
- [`build.html`](build.html) + [`build.js`](build.js) — render the build challenge and authenticated submission flow.
- [`manifest.webmanifest`](manifest.webmanifest), [`site.js`](site.js), and [`sw.js`](sw.js) — TrainGames install metadata and offline hub shell.
- [`upstreams.json`](upstreams.json) — machine-readable upstream/license/use/status manifest.
- [`OPEN_SOURCE_LINEAGE.md`](OPEN_SOURCE_LINEAGE.md) — human-readable provenance policy and mapping.
- [`open-source.html`](open-source.html) — live provenance UI rendered from `upstreams.json`.
- [`GAME_CATALOG.md`](GAME_CATALOG.md) — categorized prompt/live-game index.

## Offline baseline

Finished games should be browser-first, responsive, testable, accessible, original in presentation, and offline-capable for non-network modes when practical. Network-dependent features such as remote multiplayer, matchmaking, account sync, or uncached server content can still require service.

The TrainGames hub caches its core navigation, catalog, provenance data, and submission/leaderboard shells after a successful visit. Individual games remain responsible for caching the assets and state needed for their own offline modes.

## Open-source conversion policy

Permissive sources are preferred in this order: MIT, Apache-2.0, BSD-2/3-Clause, ISC, CC0, then other clearly permissive licenses. Code/data/assets from unlicensed, GPL, AGPL, or unclear copyleft sources are not copied into this Apache-2.0 project. Commercial presentation, scans, logos, branded artwork, fonts, and rulebook prose are not imported.

## Builder Board

TrainGames includes a public Builder Board and authenticated submission flow backed by Supabase. Submissions identify the game implementation, source, deployed URL, and model/model list used. Public voting does not require sign-in. See [`BUILDER_BOARD.md`](BUILDER_BOARD.md) and [`supabase/schema.sql`](supabase/schema.sql).

## Rebrand / infrastructure compatibility

The user-facing brand is **TrainGames**. Existing technical identifiers remain unchanged in this pass to avoid breaking deployed links and authentication:

- GitHub repository: `davidlifschitz/online-board-games`
- Vercel project: `os-online-board-games`
- Production compatibility URL: `https://os-online-board-games.vercel.app`
- Supabase project ref: `slnvfdkyvijrhmisurhw`

A future custom TrainGames domain can be added as an alias first, then promoted to canonical only after Supabase redirect URLs and the GitHub/Google OAuth application settings include the new origin.

## License

This repository is licensed under Apache License 2.0. Individual games and contributions must also respect third-party licenses, copyrights, trademarks, word lists, and assets.