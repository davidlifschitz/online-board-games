# TrainGames Launch Kit

This file is the reusable positioning and launch material for the TrainGames brand.

## Core message

**TrainGames**

**Games for the train. Play through the dead zones.**

TrainGames is a growing collection of open-source browser board, card, word, dice, puzzle, and strategy games. Many games are designed to keep working after a successful first load, making the collection useful on subways, trains, flights, and anywhere service disappears.

**Clarifier:** TrainGames means *games for the train*, not games about trains.

## Current project snapshot

- 20 live browser games
- 51 build prompts
- 18 numbered prompt concepts with live implementations
- 33 numbered prompt concepts waiting for a first deployment
- 2 additional live games outside the numbered prompt catalog: Deal Room and Photo Puzzle
- Public per-game community leaderboards
- GitHub/Google-verified build submissions
- Open-source provenance tracking

## Primary calls to action

### Players

**Load games before your ride:** https://os-online-board-games.vercel.app/play.html

For offline play, open the individual game while online first. Offline behavior varies by implementation.

### Builders

**Build the next commute game:** [BUILD_QUEUE.md](BUILD_QUEUE.md)

### Open-source contributors

**Contribute a game or improvement:** [CONTRIBUTING.md](CONTRIBUTING.md)

## Show HN

### Preferred title

**Show HN: TrainGames — open-source browser games for subway dead zones**

### First comment draft

I kept running into the same small problem on the subway: the moment I actually had time to play something, service disappeared.

That became the framing for TrainGames: a growing collection of open-source browser board, card, word, dice, puzzle, and strategy games that are useful on a commute. Many of the games support offline play after you load them once, and the hub itself caches its core pages after a successful visit.

There are currently 20 live games and 51 implementation prompts. Eighteen numbered prompt concepts have a live implementation; 33 are still waiting for a first deployment. Deal Room and Photo Puzzle are two additional live games outside the numbered prompt catalog.

The project is also a build challenge. You can play a finished game, inspect the prompt/spec and source lineage, build another implementation, deploy it, and submit it to a per-game community leaderboard.

Live collection: https://os-online-board-games.vercel.app/play.html

Repository: https://github.com/davidlifschitz/online-board-games

The current URL still has the old project slug while the product brand moves to TrainGames; I am keeping it stable so existing links and OAuth do not break during the transition.

## Reddit / SideProject angle

### Title

**I’m turning my open-source browser arcade into TrainGames: games for subway dead zones**

### Post draft

I built a collection of browser games, then realized the best use case was hiding in my commute: subway service is unreliable exactly when I have time to play.

So the project is becoming **TrainGames** — games for the train, not games about trains.

The collection currently has 20 live games and 51 build prompts. Many of the games support offline play after the first load, and the open-source specs explicitly encourage offline support for modes that do not require networking.

The loop is still open-source and participatory:

**Play one → pick a prompt → build your version → deploy it → submit it → let the community rank it.**

Live collection: https://os-online-board-games.vercel.app/play.html

Repo: https://github.com/davidlifschitz/online-board-games

## 30–45 second demo video

### 0–5 seconds

Show a subway entering a tunnel or a phone losing signal.

On-screen text: **No service? Good.**

### 5–15 seconds

Open TrainGames and rapidly show several games.

On-screen text: **TrainGames — games for the train.**

### 15–25 seconds

Show a game continuing after connectivity is disabled where that game supports offline play.

On-screen text: **Load once. Keep playing where supported.**

### 25–35 seconds

Show the GitHub prompt catalog and build flow.

On-screen text: **20 live games · 51 open-source specs**

### 35–45 seconds

Show the leaderboard and end card.

**TrainGames**

**Play through the dead zones.**

https://os-online-board-games.vercel.app

## Launch sequence

Before public launch:

1. Verify every live-game link.
2. Verify the TrainGames brand on home/play/build/leaderboard/provenance pages.
3. Verify the shell service worker can reopen cached hub pages offline after one successful visit.
4. Verify each game advertised as offline-capable with a real browser offline test; do not imply universal offline support without that verification.
5. Verify GitHub and Google OAuth on the current production origin.
6. Capture current screenshots/video under the TrainGames brand.
7. If a new domain is introduced, add it as an alias and complete the OAuth migration checklist in `PRODUCTION.md` before making it canonical.

## Metrics worth tracking

- Hub visits
- Game launches
- Repeat visits from mobile
- Offline shell usage where measurable without invasive tracking
- GitHub visits and forks
- Prompt opens
- Starter issues claimed
- New public deployments
- Leaderboard submissions and votes
