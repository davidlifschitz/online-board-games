# Contributing to OS Online Board Games

Thanks for helping grow the collection. The core loop is simple:

**play → pick → build → deploy → contribute**

You do not need to implement an entire platform to contribute. A polished single game, a prompt improvement, a bug fix, an accessibility improvement, or a better bot is useful.

## Fastest way to start

If you want a concrete weekend-sized task instead of browsing all 51 prompts, open **[BUILD_QUEUE.md](BUILD_QUEUE.md)**. The queue links directly to starter build issues that you can claim by commenting on the issue.

Claims are coordination signals, not exclusive reservations. Multiple independent implementations of the same game are welcome.

## Ways to contribute

### Build a game

1. Browse [BUILD_QUEUE.md](BUILD_QUEUE.md), [GAME_CATALOG.md](GAME_CATALOG.md), or [BUILD_CHALLENGE.md](BUILD_CHALLENGE.md).
2. For a queued starter game, comment on the linked build issue that you want to build it. For another prompt, open a **Claim a game** issue so others can see that an implementation is in progress.
3. Use the matching file under `prompts/` as your starting specification.
4. Build a complete playable browser version.
5. Open-source your implementation.
6. Deploy it publicly.
7. Open a **Submit a deployed game** issue with the live URL and source repository.

Multiple implementations of the same concept are welcome. A claimed game is not locked exclusively to one contributor.

### Improve a prompt

If a prompt has a rules ambiguity, architectural issue, missing edge case, licensing concern, or repeatedly causes bad implementations, open an **Improve a prompt** issue or a pull request.

### Improve an existing game

Existing games can benefit from stronger bots, accessibility, PWA/offline support, multiplayer reliability, mobile polish, performance work, or additional tests. Use the relevant source repository when available and describe the improvement clearly when linking it back here.

## Baseline implementation expectations

A submitted game should aim to be:

- browser playable;
- open source;
- mobile friendly;
- complete enough to play from start to finish;
- built around a testable rules engine;
- tested for important rules and edge cases;
- safe with private/hidden game state;
- deployable at a stable public URL;
- original in branding/artwork/presentation or based on appropriately licensed assets;
- offline-capable for solo, bot, and local modes where practical after the first successful online load.

Online-only mechanics such as matchmaking, remote leaderboards, account synchronization, and internet multiplayer do not need to function offline. They should fail gracefully rather than breaking the whole app.

## Submission checklist

When submitting a deployed game, include:

- Game/concept name
- Live production URL
- Source repository URL
- Matching prompt file, if applicable
- Supported player counts
- Modes: bot / local / online / cooperative / solo
- Whether offline/PWA play is supported
- Short description of the implementation
- Tests/build verification performed
- Asset/license notes
- Contributor name or GitHub handle for credit

## Pull requests

Keep pull requests focused. For prompt changes, explain the implementation problem the change solves. For catalog/status changes, update `games.json` if the deployment state changed.

Before opening a PR:

- verify Markdown links;
- validate JSON if `games.json` changed;
- avoid copyrighted/proprietary art or copied rule text;
- make sure any claimed production URL is actually reachable;
- do not mark a game `live` until a public deployment exists.

## Attribution

Contributors who submit implementations may be credited in the dashboard/catalog with their GitHub handle and source repository. If you prefer not to be credited, say so in the submission.

## Good first projects

For a smaller weekend-sized contribution, start with the live issues in [BUILD_QUEUE.md](BUILD_QUEUE.md), including Mastermind-style, Mancala, Dots and Boxes, Farkle, Boggle-style, and Love-Letter-style. See [BUILD_CHALLENGE.md](BUILD_CHALLENGE.md) for more.
