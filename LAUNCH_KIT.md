# OS Online Board Games Launch Kit

This file turns the project positioning into reusable launch material.

## Core message

**OS Online Board Games**

**Play one. Build one. Deploy one. Contribute it back.**

A growing collection of open-source browser games and implementation prompts. Try the finished games, pick one of 51 game specs, build your own version, deploy it, and contribute it back to the collection.

## Current project snapshot

- 8 live browser games
- 51 build prompts
- 44 prompt concepts waiting for a first deployment
- Starter, intermediate, and advanced build tiers
- Public claim and deployment-submission flows
- Multiple implementations of the same game are welcome

## Primary calls to action

### Players

**Play a game:** https://os-online-board-games.vercel.app

### Builders

**Pick a starter issue:** [BUILD_QUEUE.md](BUILD_QUEUE.md)

### Open-source contributors

**Contribute a game or improvement:** [CONTRIBUTING.md](CONTRIBUTING.md)

---

# Show HN

## Preferred title

**Show HN: Play, fork, and deploy open-source browser games**

## Alternate title

**Show HN: I’m building 51 open-source browser games from reusable game specs**

## First comment draft

I started this by building a browser version of Othello against a computer. Then I built more games and noticed the same pattern kept repeating: define the rules and product constraints clearly, build the smallest complete browser version, deploy it, and iterate.

So I turned that into OS Online Board Games.

There are currently 8 playable browser games and 51 implementation prompts in the repo. Seven of those prompt concepts have a live implementation today; the remaining 44 are open for someone to build first. Deal Room is an additional live game outside the numbered prompt catalog.

The project is meant to be participatory rather than just a directory. You can:

1. play one of the finished games;
2. inspect the prompt/spec that shaped it;
3. pick an unbuilt game;
4. build your own version with any workflow you like;
5. deploy it publicly; and
6. contribute the deployment back to the collection.

Multiple implementations of the same game are welcome. I think the comparisons could become as interesting as the games themselves: different UI choices, bot strategies, frameworks, multiplayer architectures, offline support, and interpretations of the same spec.

Live arcade: https://os-online-board-games.vercel.app

Repository: https://github.com/davidlifschitz/online-board-games

Starter build queue: https://github.com/davidlifschitz/online-board-games/blob/main/BUILD_QUEUE.md

Feedback on the contribution flow, prompts, architecture, and games is welcome.

---

# Reddit — r/SideProject angle

## Title

**I accidentally turned 8 browser games into an open-source challenge to build 51**

## Post draft

I started with one browser game, then kept building more. At some point I realized the more interesting project was not the arcade itself — it was the repeatable process behind each game.

So I turned the repo into an open-source build challenge.

There are 8 live browser games right now and 51 game implementation prompts. Seven prompt concepts have a live implementation; 44 are still waiting for their first deployment.

The loop is:

**Play one → pick a prompt → build your own version → deploy it → add it back to the arcade.**

The repo now has starter/intermediate/advanced tiers, claim issues, deployment submission forms, a machine-readable catalog, and a starter queue with concrete games people can pick up.

AI coding tools are allowed, but they are not the point. The interesting part is seeing different developers interpret the same game spec and comparing the results.

Multiple implementations are intentionally allowed. If three people build Mancala, I want all three to be able to exist and be compared.

Live arcade: https://os-online-board-games.vercel.app

Repo: https://github.com/davidlifschitz/online-board-games

Starter queue: https://github.com/davidlifschitz/online-board-games/blob/main/BUILD_QUEUE.md

I’m especially interested in whether the contribution flow feels simple enough that someone would actually pick a game and build it over a weekend.

---

# DEV / #showdev article outline

## Title

**I built 8 browser games and turned the architecture into 51 open-source game specifications**

## Structure

1. **Why this started**
   - One browser game became several.
   - Repeated implementation patterns became obvious.

2. **The live collection**
   - Show the current games and the arcade.

3. **The reusable specification idea**
   - Prompts are implementation specs rather than tiny code-generation commands.
   - Rules, multiplayer, bots, private state, offline behavior, testing, mobile UX, and originality are part of the spec.

4. **Browser-first architecture**
   - Keep the core playable without native installation.
   - Treat local/bot/offline modes separately from network-dependent features.

5. **Bots and game logic**
   - Rules engines should be testable and separate from presentation where practical.

6. **Multiplayer and hidden information**
   - Validate moves and avoid leaking private state.

7. **Why the prompts live in the repo**
   - Anyone can inspect, improve, fork, or reinterpret the starting specification.

8. **The 51-game roadmap**
   - 7 prompt concepts deployed; 44 waiting for a first implementation.

9. **How to build one**
   - Pick a starter issue from `BUILD_QUEUE.md`.
   - Build, test, deploy, submit.

10. **What happens when multiple people build the same game**
    - Compare bot strength, UX, accessibility, mobile behavior, architecture, and visual direction.

11. **Call for contributors**
    - Play one.
    - Build one.
    - Deploy one.
    - Contribute it back.

---

# 30–45 second demo video

## Shot list

### 0–3 seconds

On-screen text:

**What if every classic board game had a clean open-source browser version?**

### 3–15 seconds

Rapid cuts through live games:

- Othello
- Crown Jump
- Fourfront
- HueBreak
- Five Dice
- Threadmark
- Deal Room
- Frontiers

Keep each clip long enough to show one unmistakable interaction rather than only a static title screen.

### 15–22 seconds

Show the OS Online Board Games hub.

On-screen text:

**8 live games**

### 22–30 seconds

Open the GitHub repository and scroll through the prompt catalog / `prompts/` directory.

On-screen text:

**51 build specs**

### 30–40 seconds

Show the build loop visually:

**Pick a game → use the prompt → build → deploy → submit**

Briefly show `BUILD_QUEUE.md` and one starter issue.

### 40–45 seconds

End card:

**Play one. Build one.**

**OS Online Board Games**

https://os-online-board-games.vercel.app

---

# Launch sequence

## Before public launch

- Verify every live-game link.
- Verify the hub loads on desktop and mobile.
- Verify the six starter build issues are open and understandable without extra context.
- Verify `games.json` parses successfully.
- Capture one clean screenshot or short clip from every live game.
- Record the 30–45 second demo.

## Initial distribution

1. Show HN
2. r/SideProject
3. DEV / #showdev
4. Additional web-development, game-development, JavaScript, open-source, and indie communities only after checking each community's current rules

Do not post identical copy everywhere. Change the story and CTA for each community.

## Follow-up stories

- A new external contributor claims a game.
- Game #9 ships.
- Two implementations of the same prompt are compared.
- A technical write-up on offline/PWA behavior.
- A technical write-up on client-side game AI.
- A technical write-up on hidden-information multiplayer.
- A contributor spotlight.
- A 30-day progress recap.

## Metrics worth tracking

- Hub visits
- Game launches
- GitHub visits
- Prompt opens
- Forks
- Starter issues claimed
- Pull requests
- New public deployments
- Returning contributors

Stars are useful social proof, but the strongest activation event is a developer actually claiming and shipping a game.
