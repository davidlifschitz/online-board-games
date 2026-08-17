# Online Board Games

Open-source build prompts for browser-based board and card games with bots, online multiplayer, mobile-friendly UIs, and Vercel deployment.

This repository is evolving into a catalog for an eventual **online game dashboard**: one place where players can choose from classic 1v1 games, multiplayer strategy, cards, party games, social deduction, word games, dice games, cooperative games, and digital-first variants.

## Browse by game type

See **[GAME_CATALOG.md](GAME_CATALOG.md)** for the full categorized collection and overlapping tags.

### 1v1 abstract strategy
Connect Four · Checkers · Chess · Mancala · Nine Men's Morris · Reversi · Go · Hex · Santorini-style · Hive-style · Dots and Boxes

### Multiplayer strategy / board games
Risk-style · Settlers-style · Ticket-to-Ride-style · Carcassonne-style · Stratego-inspired · Pandemic-style · Qwirkle-style · Sequence-style

### Cards
Uno-style · Dominion-style · Love-Letter-style · Coup-style · President-style · Hearts · Spades · Gin Rummy · Rummy 500 · play-money Poker · Blackjack trainer · Hanabi-style

### Party / social deduction
Codenames-style · Scattergories-style · Pictionary-style · Charades · Werewolf/Mafia · secret-government-style · Resistance/Avalon-style · Coup-style

### Word games
Codenames-style · Scrabble-style · Boggle-style · Scattergories-style · Pictionary-style · Charades

### Dice / probability
Backgammon · Five Dice · Farkle · Liar's Dice · Perudo-style · Blackjack trainer

### Digital-first / newer formats
2048 races/battle/co-op · daily seeded challenges · real-time drawing · automated social-deduction moderator · cryptographically committed hidden-board games

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
