# OS Online Board Games

## 🎮 [Play the live collection](https://os-online-board-games.vercel.app)

**Play one. Build one. Deploy one. Contribute it back.**

OS Online Board Games is an Apache-2.0 experiment to build a broad library of polished browser-based board, card, word, party, dice, and strategy games with transparent open-source provenance.

**19 live games · 51 build prompts · 33 prompt concepts waiting for a first deployment**

- [Play the live arcade](https://os-online-board-games.vercel.app/play.html)
- [Claim a starter game](BUILD_QUEUE.md)
- [See the catalog](GAME_CATALOG.md)
- [Inspect source lineage](OPEN_SOURCE_LINEAGE.md)
- [Browse live provenance](https://os-online-board-games.vercel.app/open-source.html)

## Live games

| Game | Type | Play |
|---|---|---|
| Deal Room | cards · multiplayer · bot | [Play](/games/deal-room/) |
| Uno-style / HueBreak | cards · multiplayer · bot | [Play](https://huebreak-card-game.vercel.app) |
| Codenames-style / Threadmark | word · party · teams | [Play](https://threadmark-delta.vercel.app) |
| Connect Four / Fourfront | abstract · bot | [Play](https://fourfront-virid.vercel.app) |
| Checkers / Crown Jump | abstract · bot | [Play](https://crown-jump-checkers.vercel.app) |
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

**18 of the 51 numbered prompt concepts have a live implementation.** Deal Room is an additional deployed game outside the numbered prompt catalog.

## 2026-08-19 conversion Batch 1

Five concepts that were unbuilt at the start of this pass are now production routes:

- **Mergefront** — deterministic seeded merge puzzle; solo, local race, time attack, battle and co-op.
- **Boxline** — Dots and Boxes; 2–4 local players and computer opponents.
- **Sowstone** — Kalah; configurable setup, captures, extra turns, projected landing and alpha-beta bots.
- **Cipherloom** — code-breaking; daily puzzle, local maker/breaker and candidate-elimination solver.
- **Spark Six** — Farkle-family dice; combination scoring, hot dice, risk model, bots and final round.

Every Batch 1 game includes a service worker/manifest, local-state resume, rules tests, and `THIRD_PARTY_NOTICES.md`. Source selection is documented in [`SOURCE_RESEARCH_BATCH_1.md`](SOURCE_RESEARCH_BATCH_1.md).

## 2026-08-19 conversion Batch 2

Five more previously unbuilt concepts have production-verified routes:

- **Millstone** — Nine Men's Morris with placement, movement, optional flying, mill removals, repetition handling, local play, and alpha-beta computer opponents.
- **Hexline** — configurable Hex with pie rule, graph winner detection, path-cost analysis, local/analysis modes, and computer opponents.
- **Racehome** — Backgammon with complete-turn legal sequence generation, bar entry, hits, bearing off, gammons/backgammons, doubling cube flow, match scoring, and bots.
- **Gridwake** — original hidden-fleet naval game with local privacy screen, bot modes, SHA-256 fleet commitments, and probability-density targeting.
- **Twenty-One Lab** — play-money Blackjack/basic-strategy trainer with configurable shoe/rules, splits, doubles, surrender, insurance, deterministic simulation support, and hidden-hole-safe counting feedback.

Every Batch 2 game includes offline caching, local-state persistence, rules tests, and `THIRD_PARTY_NOTICES.md`. All selected reference repositories were directly license-checked as MIT and are used only as audited/reference baselines; no upstream code or artwork was copied. Research is documented in [`SOURCE_RESEARCH_BATCH_2.md`](SOURCE_RESEARCH_BATCH_2.md).

The remaining sequence is tracked in [`CONVERSION_PLAN_43.md`](CONVERSION_PLAN_43.md).

## Collection architecture

- [`games.json`](games.json) — source of truth for game status, categories, and live routes.
- [`play.html`](play.html) — renders the live arcade from `games.json` rather than maintaining a second hard-coded card list.
- [`upstreams.json`](upstreams.json) — machine-readable upstream/license/use/status manifest.
- [`OPEN_SOURCE_LINEAGE.md`](OPEN_SOURCE_LINEAGE.md) — human-readable provenance policy and mapping.
- [`open-source.html`](open-source.html) — live provenance UI rendered from `upstreams.json`.
- [`GAME_CATALOG.md`](GAME_CATALOG.md) — categorized prompt/live-game index.

## Baseline requirements

Finished games should be browser-first, responsive, testable, accessible, original in presentation, offline-capable for non-network modes, and strict about hidden information. Bots should be responsive; randomized tests should use deterministic seeds where practical. Online modes should validate actions authoritatively and filter private state before transmission.

## Open-source conversion policy

Permissive sources are preferred in this order: MIT, Apache-2.0, BSD-2/3-Clause, ISC, CC0, then other clearly permissive licenses. Code/data/assets from unlicensed, GPL, AGPL, or unclear copyleft sources are not copied into this Apache-2.0 project. Commercial presentation, scans, logos, branded artwork, fonts, and rulebook prose are not imported.

## Builder Board

The main site includes a public Builder Board and authenticated submission flow backed by Supabase. Submissions identify the game implementation, source, deployed URL, and model/model list used. Public voting does not require sign-in. See [`BUILDER_BOARD.md`](BUILDER_BOARD.md) and [`supabase/schema.sql`](supabase/schema.sql).

## License

This repository is licensed under Apache License 2.0. Individual games and contributions must also respect third-party licenses, copyrights, trademarks, word lists, and assets.
