# Open Source Game Build Challenge

## Pick one. Build it. Deploy it. Add it to the arcade.

TrainGames contains 51 implementation prompts covering classic abstract strategy, cards, party games, social deduction, word games, dice games, cooperative games, and digital-first experiments.

**20 games are live today. 18 of the 51 numbered prompt concepts have a live implementation, and 33 prompt concepts are still waiting for a first deployment.**

The canonical open-challenge list is rendered on the [TrainGames Build page](https://os-online-board-games.vercel.app/build.html#challenge) directly from `games.json`, so it stays aligned with the current catalog.

The challenge is intentionally simple:

1. Pick an open prompt from the Build page or [GAME_CATALOG.md](GAME_CATALOG.md).
2. Claim it with the repository's **Claim a game** issue form if you want to signal that you are working on it.
3. Build a complete open-source browser implementation.
4. Deploy it publicly.
5. Submit the live URL and source repository.

AI coding tools are allowed. Traditional hand-written implementations are allowed. Hybrid workflows are allowed. The interesting part is the result and what we learn from comparing implementations.

**Multiple implementations of the same prompt are welcome.** Claims are coordination signals, not exclusive reservations. Different UI decisions, bot strategies, networking models, frameworks, accessibility choices, and architectures are part of the experiment.

## Starter builds awaiting a first deployment

Good candidates for a weekend-sized first contribution:

- Love-Letter-style
- President-style card game
- Boggle-style
- Scattergories-style
- Charades / Heads-Up-style
- Guess-Who-style

These generally have compact rule sets, manageable state spaces, or relatively small browser UIs.

## Intermediate builds awaiting a first deployment

Good candidates when you want more rules, multiplayer state, hidden information, or stronger AI:

- Coup-style
- Hearts
- Spades
- Gin Rummy
- Rummy 500
- Pictionary-style
- Werewolf / Mafia
- Secret-government-style
- Resistance / Avalon-style
- Hanabi-style
- Santorini-style
- Hive-style
- Liar's Dice
- Perudo-style
- Qwirkle-style
- Sequence-style

## Advanced builds awaiting a first deployment

These require significantly more work in rules, AI, hidden information, graph logic, content systems, or multiplayer architecture:

- Chess
- Stratego-inspired
- Settlers-style resource game
- Ticket-to-Ride-style route game
- Dominion-style deck builder
- Play-money Poker
- Mahjong
- Scrabble-style word game
- Pandemic-style cooperative game
- Go
- Clue-style deduction game

## Already built? Build another version anyway.

A live implementation does not close a prompt. Alternate implementations are encouraged when you want to explore a different bot, framework, UX, accessibility approach, networking model, visual direction, or offline strategy.

That creates useful comparisons such as:

- Which client-side bot is strongest?
- Which interpretation works best on mobile?
- Which implementation is easiest to fork?
- Which version handles accessibility or offline play best?

## What makes a strong submission?

A strong implementation is not necessarily the one with the most features. Prefer:

- correct rules;
- clean mobile interaction;
- a complete game loop;
- good tests;
- a usable bot when appropriate;
- clear handling of hidden information;
- practical offline support for non-network modes;
- a real verified production deployment;
- original/open assets;
- a concise README explaining architecture and tradeoffs.

## Recognition

Accepted implementations can appear in the arcade and community leaderboard with links to the live game and source repository. Builder attribution is shown only when it has been supplied and verified; TrainGames does not invent contributor credit.

Possible community spotlights include strongest AI, best mobile UX, best accessibility, most interesting multiplayer architecture, and best original visual direction.
