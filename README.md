# Online Board Games

Open-source build prompts for browser-based board and card games with bots, online multiplayer, mobile-friendly UIs, and Vercel deployment.

This repository is evolving into a catalog for an eventual **online game dashboard**: one place where players can choose from classic 1v1 games, multiplayer strategy, cards, party games, social deduction, word games, dice games, cooperative games, and digital-first variants.

## Browse by game type

See **[GAME_CATALOG.md](GAME_CATALOG.md)** for the full categorized collection and overlapping tags.

### 1v1 abstract strategy
Connect Four ([Fourfront](https://fourfront-virid.vercel.app)) · Checkers ([Crown Jump](https://crown-jump-checkers.vercel.app)) · Chess · Mancala · Nine Men's Morris · Reversi / Othello ([Othello](https://othello-vs-computer.vercel.app)) · Go · Hex · Santorini-style · Hive-style · Dots and Boxes

### Multiplayer strategy / board games
Risk-style · Settlers-style · Ticket-to-Ride-style · Carcassonne-style · Stratego-inspired · Pandemic-style · Qwirkle-style · Sequence-style

### Cards
Uno-style ([HueBreak](https://huebreak-card-game.vercel.app)) · Dominion-style · Love-Letter-style · Coup-style · President-style · Hearts · Spades · Gin Rummy · Rummy 500 · play-money Poker · Blackjack trainer · Hanabi-style · Monopoly Deal ([Deal Room](https://monopoly-deal-online.vercel.app))

### Party / social deduction
Codenames-style ([Threadmark](https://threadmark-delta.vercel.app)) · Scattergories-style · Pictionary-style · Charades · Werewolf/Mafia · secret-government-style · Resistance/Avalon-style · Coup-style

### Word games
Codenames-style ([Threadmark](https://threadmark-delta.vercel.app)) · Scrabble-style · Boggle-style · Scattergories-style · Pictionary-style · Charades

### Dice / probability
Backgammon · Five Dice ([Five Dice](https://five-dice.vercel.app)) · Farkle · Liar's Dice · Perudo-style · Blackjack trainer

### Digital-first / newer formats
2048 races/battle/co-op · daily seeded challenges · real-time drawing · automated social-deduction moderator · cryptographically committed hidden-board games

## Requirements

The prompts are intended to produce complete, usable open-source browser games rather than isolated demos. Unless a specific game prompt says otherwise, a finished implementation should aim to meet these baseline requirements:

- **Browser-first:** playable without installing a native application.
- **Vercel-ready:** the project should build and deploy cleanly on Vercel.
- **Responsive UI:** usable on both desktop and mobile, with touch-friendly controls.
- **Complete rules engine:** game legality, turn progression, scoring, and victory conditions should live in testable game logic rather than only in UI code.
- **Computer opponents:** include bots when the game makes sense for solo play, ideally with multiple difficulty levels.
- **Multiplayer:** support local and/or online multiplayer when appropriate for the game.
- **Private state:** hands, roles, hidden boards, objectives, and other secret information must not be exposed to players who should not see them.
- **Reliable synchronization:** online games should validate moves and keep clients in sync, with reconnect handling where practical.
- **Testing:** include unit tests for important rules and edge cases; simulation tests are encouraged for games with bots or complex turn flows.
- **Accessible interaction:** use clear states, sufficient contrast, keyboard support where practical, and avoid relying on color alone to communicate critical information.
- **Original/open presentation:** do not copy proprietary logos, artwork, card layouts, maps, word lists, rule text, or branded visual design. Use original or appropriately licensed assets.
- **Open source:** include a README, dependency/license attribution where needed, and an appropriate open-source license.

Some games will need additional requirements—for example Web Workers for computationally expensive AI, cryptographic commitments for peer-to-peer hidden information, or authoritative server/host state for competitive multiplayer. Those details are specified in the individual prompts.

## How to use these prompts

1. **Choose a game.** Start with [GAME_CATALOG.md](GAME_CATALOG.md) if you want to browse by format, player count, complexity, or game type. Otherwise open any file under [`prompts/`](prompts/).
2. **Copy the full prompt.** Paste it into the coding agent or development environment you want to use—for example ChatGPT with a coding/deployment tool, Codex, Claude Code, Cursor, or another capable coding agent.
3. **Tell the agent where to build it.** If you already have a repository, include the repository name and ask the agent to implement the game there. For a new project, ask it to create a clean standalone app and prepare it for Vercel deployment.
4. **Customize before building.** Add any preferences you care about, such as the visual theme, game name, player limits, AI difficulty, authentication, persistence, matchmaking, analytics, or whether the game should eventually plug into a shared dashboard.
5. **Build the smallest complete version first.** Prioritize a correct rules engine and a fully playable core loop before adding rankings, accounts, cosmetics, statistics, or advanced multiplayer infrastructure.
6. **Test the rules.** Ask the coding agent to run unit tests, exercise edge cases, simulate bot games where useful, and verify the production build before considering the implementation complete.
7. **Verify multiplayer separately.** For online games, test with at least two independent clients/devices. Hidden-information games should also be checked for accidental state leakage.
8. **Deploy to Vercel.** Once the local/build checks pass, deploy a production version and verify the actual deployed URL and core assets.
9. **Keep the implementation original.** Mechanics can inspire a project, but commercial names, artwork, maps, card text, word lists, and distinctive presentation should not simply be copied.
10. **Contribute improvements back.** If a prompt produces recurring implementation problems or misses an important rule, update the prompt so future builds benefit from what was learned.

A useful way to start a coding session is:

> Build the game described in this prompt as a production-quality open-source browser app. Implement the complete playable core first, add tests for the rules engine, make it mobile-friendly, and prepare/deploy it on Vercel. Preserve the prompt's privacy, multiplayer, licensing, and originality requirements. Do not stop at a mockup.

Then paste the selected game prompt directly below that instruction.

## Design principles

Every prompt aims for:

- open-source implementation
- deployment on Vercel
- excellent desktop and mobile play
- computer opponents where appropriate
- online rooms where appropriate
- deterministic/testable core game engines
- strict treatment of private/hidden information
- original or appropriately licensed artwork/assets
- no copying of proprietary branding, artwork, maps, card text, or protected visual presentation

## All prompts

The repository contains **51 implementation prompts**, one per game concept, under [`prompts/`](prompts/). Existing commercial-game-inspired concepts are deliberately phrased as original/open implementations where branding or presentation should not be copied.

Start with the [categorized catalog](GAME_CATALOG.md), then open the individual prompt you want to build.

## License

This repository is licensed under the Apache License 2.0. Individual games built from these prompts should also respect licenses, copyrights, and trademarks for third-party dependencies, source material, word lists, assets, and game branding.
