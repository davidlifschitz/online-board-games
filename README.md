# OS Online Board Games

## 🎮 [Play the live collection](https://os-online-board-games.vercel.app)

**Play one. Build one. Deploy one. Contribute it back.**

OS Online Board Games is an open-source experiment to build a broad library of polished browser-based board, card, word, party, dice, and strategy games. You can play the finished games immediately, inspect the implementation prompts, build your own version with any coding workflow you like, deploy it, and submit it back to the collection.

**9 live games · 51 build prompts · 43 prompt concepts waiting for a first deployment**

**Want to build one now? → [Claim a starter game](BUILD_QUEUE.md)**  
**Already deployed one? → [Submit it through the live Builder Board](https://os-online-board-games.vercel.app/#submit).** If the website submission flow is unavailable, use the [Submit a deployed game](https://github.com/davidlifschitz/online-board-games/issues/new?template=submit-deployed-game.yml) GitHub issue as a fallback.

> Multiple implementations of the same game are welcome. The goal is not to produce one canonical version of every game; it is to make it easy to experiment, compare approaches, and grow a useful open-source browser-game ecosystem.

**Source provenance:** Every live game now has a documented permissive upstream baseline for rules, AI, or structured game data. See [OPEN_SOURCE_LINEAGE.md](OPEN_SOURCE_LINEAGE.md), the [live provenance page](https://os-online-board-games.vercel.app/open-source.html), and the machine-readable [`upstreams.json`](upstreams.json).

## How it works

1. **Play one** — try the [live arcade](https://os-online-board-games.vercel.app).
2. **Pick one** — claim a starter from the [Build Queue](BUILD_QUEUE.md), browse the [51-game catalog](GAME_CATALOG.md), or choose a difficulty tier in [BUILD_CHALLENGE.md](BUILD_CHALLENGE.md).
3. **Build and deploy it** — use the prompt as a starting specification, implement a complete browser game, test it, and deploy it publicly.
4. **Contribute it back** — use the [live Builder Board submission flow](https://os-online-board-games.vercel.app/#submit), sign in with GitHub or Google, and provide the live URL, public GitHub source, and model/model list used. New submissions enter review as pending; approved submissions appear on the public Builder Board. The GitHub submission issue remains available as a fallback.

## Live games

| Game | Type | Play |
|---|---|---|
| Deal Room | Cards · multiplayer · bot | [Play](https://os-online-board-games.vercel.app/games/deal-room/) |
| DiscShift | 1v1 · strategy · bot | [Play](https://os-online-board-games.vercel.app/games/discshift/) |
| Crown Jump | Checkers · 1v1 · strategy · bot | [Play](https://crown-jump-checkers.vercel.app) |
| Five Dice | Dice · solo · PWA | [Play](https://five-dice.vercel.app) |
| HueBreak | Cards · shedding · multiplayer | [Play](https://huebreak-card-game.vercel.app) |
| Threadmark | Word · teams · party | [Play](https://threadmark-delta.vercel.app) |
| Fourfront | Connect Four · 1v1 · strategy · bot | [Play](https://fourfront-virid.vercel.app) |
| Frontiers | Territory control · multiplayer · bot | [Play](https://frontiers-snowy.vercel.app) |
| Tilebound | Tile placement · strategy · bot · local | [Play](https://os-online-board-games.vercel.app/games/tilebound/) |

Eight of the 51 prompt concepts currently have a live implementation. Deal Room is an additional deployed project outside the numbered 51-prompt catalog.

## Build-a-Game Challenge

Want an open-source weekend project? **Pick a game, build it, deploy it, and add it to the arcade.**

- AI coding tools are welcome.
- Multiple implementations of the same game are welcome.
- Keep the implementation open source and browser playable.
- Use original or appropriately licensed assets and presentation.
- A complete playable core is more valuable than a large unfinished feature list.
- Contributors receive visible credit alongside approved implementations.
- Builder Board submissions require GitHub or Google sign-in and a declared model/model list; use `None` when no AI model was materially used.

Start with the **[Build Queue](BUILD_QUEUE.md)** for claimable starter issues, or see **[BUILD_CHALLENGE.md](BUILD_CHALLENGE.md)** for starter, intermediate, and advanced suggestions.

## Builder Board

The Builder Board is live on the main arcade, including the leaderboard UI, authenticated submission flow, Supabase-backed moderation model, and model-usage summary. The production site deploys from this repository's `main` branch to Vercel. GitHub and Google OAuth providers are configured in Supabase; initial real-account OAuth and end-to-end production verification are tracked in **[issue #13](https://github.com/davidlifschitz/online-board-games/issues/13)**.

The Builder Board reports objective counts rather than a custom point system:

- approved implementations shipped,
- first approved Builder Board submission for a game concept,
- distinct game concepts shipped.

The first-submission metric refers to the first approved implementation recorded on this Builder Board; it does not claim that no implementation existed before the leaderboard.

New website submissions begin as pending and are visible to the submitter. Only approved submissions enter the public Builder Board, recently approved builds, and model-usage summary. The authenticated identity is derived server-side from Supabase Auth rather than from a user-editable form field.

See **[BUILDER_BOARD.md](BUILDER_BOARD.md)** for the auth, data, moderation, and security model. The reproducible database definition is in **[`supabase/schema.sql`](supabase/schema.sql)**.

## Browse by game type

See **[GAME_CATALOG.md](GAME_CATALOG.md)** for the complete categorized collection. Categories intentionally overlap: a game can be 1v1, strategy, hidden-information, and card-based at the same time.

### 1v1 abstract strategy
Connect Four ([Fourfront](https://fourfront-virid.vercel.app)) · Checkers ([Crown Jump](https://crown-jump-checkers.vercel.app)) · Chess · Mancala · Nine Men's Morris · Disk-flipping ([DiscShift](https://os-online-board-games.vercel.app/games/discshift/)) · Go · Hex · Santorini-style · Hive-style · Dots and Boxes

### Multiplayer strategy / board games
Risk-style ([Frontiers](https://frontiers-snowy.vercel.app)) · Settlers-style · Ticket-to-Ride-style · Carcassonne-style ([Tilebound](https://os-online-board-games.vercel.app/games/tilebound/)) · Stratego-inspired · Pandemic-style · Qwirkle-style · Sequence-style

### Cards
Uno-style ([HueBreak](https://huebreak-card-game.vercel.app)) · Dominion-style · Love-Letter-style · Coup-style · President-style · Hearts · Spades · Gin Rummy · Rummy 500 · play-money Poker · Blackjack trainer · Hanabi-style · property-set cards ([Deal Room](https://os-online-board-games.vercel.app/games/deal-room/))

### Party / social deduction
Codenames-style ([Threadmark](https://threadmark-delta.vercel.app)) · Scattergories-style · Pictionary-style · Charades · Werewolf/Mafia · secret-government-style · Resistance/Avalon-style · Coup-style

### Word games
Codenames-style ([Threadmark](https://threadmark-delta.vercel.app)) · Scrabble-style · Boggle-style · Scattergories-style · Pictionary-style · Charades

### Dice / probability
Backgammon · Five Dice ([Five Dice](https://five-dice.vercel.app)) · Farkle · Liar's Dice · Perudo-style · Blackjack trainer

## Requirements

The prompts are intended to produce complete, usable open-source browser games rather than isolated demos. Unless a specific game prompt says otherwise, a finished implementation should aim to meet these baseline requirements:

- **Browser-first:** playable without installing a native application.
- **Vercel-ready:** build and deploy cleanly on Vercel or an equivalent static/web host.
- **Responsive UI:** usable on desktop and mobile with touch-friendly controls.
- **Complete rules engine:** legality, turn progression, scoring, and victory conditions should live in testable game logic rather than only in UI code.
- **Computer opponents:** include bots when the game makes sense for solo play, ideally with multiple difficulty levels.
- **Multiplayer:** support local and/or online multiplayer when appropriate.
- **Private state:** hands, roles, hidden boards, objectives, and other secret information must not leak to players who should not see them.
- **Reliable synchronization:** online games should validate moves and keep clients synchronized, with reconnect handling where practical.
- **Offline-first where practical:** after a successful online load, solo, bot, and local modes should remain launchable offline when their mechanics do not require networking. Cache required assets with a service worker/PWA approach and degrade online-only features gracefully.
- **Testing:** include unit tests for important rules and edge cases; simulation tests are encouraged for bots or complex turn flows.
- **Accessible interaction:** use clear states, sufficient contrast, keyboard support where practical, and do not rely on color alone for critical information.
- **Original/open presentation:** do not copy proprietary logos, artwork, card layouts, maps, word lists, rule text, or branded visual design. Use original or appropriately licensed assets.
- **Open source:** include a README, dependency/license attribution where needed, and an appropriate open-source license.

## How to use these prompts

1. **Choose a game.** Start with the [Build Queue](BUILD_QUEUE.md), [GAME_CATALOG.md](GAME_CATALOG.md), [BUILD_CHALLENGE.md](BUILD_CHALLENGE.md), or any file under [`prompts/`](prompts/).
2. **Copy the full prompt.** Paste it into ChatGPT, Codex, Claude Code, Cursor, another coding agent, or use it as a conventional engineering specification.
3. **Tell the builder where to work.** Point it at an existing repository or ask it to create a clean standalone app.
4. **Customize before building.** Add your preferred visual theme, game name, player limits, AI difficulty, persistence, multiplayer architecture, or experimental mechanics.
5. **Build the smallest complete version first.** Correct rules and a complete playable loop come before accounts, rankings, cosmetics, or advanced infrastructure.
6. **Test the rules.** Run unit tests, edge cases, bot simulations where useful, and a production build.
7. **Verify multiplayer separately.** Test with at least two independent clients/devices and check hidden-information games for state leakage.
8. **Verify offline behavior where applicable.** Load once online, disconnect, reload, and make sure non-network modes still function.
9. **Deploy it.** Publish a production URL and verify the deployed version rather than only the local build.
10. **Submit it back.** Use the [authenticated Builder Board submission flow](https://os-online-board-games.vercel.app/#submit) following [CONTRIBUTING.md](CONTRIBUTING.md). If the website flow is unavailable, use the [Submit a deployed game](https://github.com/davidlifschitz/online-board-games/issues/new?template=submit-deployed-game.yml) issue as a fallback.

A useful starter instruction is:

> Build the game described in this prompt as a production-quality open-source browser app. Implement the complete playable core first, add tests for the rules engine, make it mobile-friendly, make non-network modes offline-capable where practical, and prepare/deploy it on Vercel. Preserve the prompt's privacy, multiplayer, licensing, and originality requirements. Do not stop at a mockup.

Then paste the selected game prompt directly below it.

## Contributing

Contributions can be full game implementations, alternate implementations, prompt improvements, bug reports, accessibility improvements, AI upgrades, multiplayer fixes, or better documentation.

Start with the **[Build Queue](BUILD_QUEUE.md)** for a claimable starter issue or **[CONTRIBUTING.md](CONTRIBUTING.md)** for the full contribution flow. If you want to build another unimplemented game, use the **Claim a game** issue template so other contributors can see what is in progress. Once deployed, use the **[live Builder Board submission flow](https://os-online-board-games.vercel.app/#submit)**; the **[Submit a deployed game](https://github.com/davidlifschitz/online-board-games/issues/new?template=submit-deployed-game.yml)** issue remains available as a fallback.

The machine-readable status of the collection lives in [`games.json`](games.json) so the arcade and future tooling can consume the same catalog. The permissive upstream/source map lives in [`upstreams.json`](upstreams.json).

## Design principles

Every prompt aims for open-source implementation, browser-first deployment, good mobile play, bots where appropriate, online rooms where appropriate, testable game engines, strict private-state handling, practical offline play, and original/open visual presentation.

## License

This repository is licensed under the Apache License 2.0. Individual games built from these prompts should also respect licenses, copyrights, and trademarks for third-party dependencies, source material, word lists, assets, and game branding.
