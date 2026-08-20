# TrainGames Marketing Challenge Funnel Design

## Goal

Position TrainGames as both an offline-friendly browser-game collection and an open-source build challenge, with one consistent path from play to build to contribution.

## Positioning

The product brand remains **TrainGames** and retains the commute/dead-zone story. The participation tagline becomes **Play one. Build one. Deploy one.** The homepage should speak explicitly to three audiences: players, builders, and open-source contributors.

## Source of truth

`games.json` remains the authoritative catalog for game status, prompt path, difficulty, and deployment counts. Marketing surfaces must not hard-code lists of games that are already represented by the catalog.

The Build page should derive Starter, Intermediate, and Advanced first-build opportunities from prompt-backed entries where `status === "unbuilt"`. Multiple implementations of live concepts remain welcome, but the primary challenge list should prioritize concepts that still need a first deployment.

## Homepage

The homepage hero should pair the TrainGames commute identity with the participation tagline. Primary actions should remain Play and Build, while contribution gets an explicit path to the submission flow. The three audience cards should be Play, Build, and Contribute; the leaderboard remains available in navigation and hero actions.

## Build challenge

The Build page should stop hard-coding starter issue cards. It should render challenge tiers from `games.json`, show live counts from the catalog summary, and provide each unbuilt game with links to its prompt and the Claim-a-game issue form.

A small pure helper module should own challenge grouping and claim-link generation so this logic can be tested without the browser DOM.

## Contributor recognition

The catalog may carry optional `sourceUrl` and `builtBy` metadata for an implementation. Rendering should treat these as optional and never invent attribution. Existing records can be enriched only when source and builder identity are directly verified.

## README and repository docs

The README should lead with the same Play / Build / Deploy loop and current catalog counts, then route readers to Play, Build, Contribute, the catalog, and provenance docs. `BUILD_CHALLENGE.md` should not advertise already-live games as first-build starter tasks.

## Validation

- Node built-in tests cover challenge grouping and claim-link construction.
- Frontend CI runs those tests and syntax-checks the new helper.
- `games.json` summary values must match computed catalog counts.
- Homepage, README, Build page, and challenge docs must use current counts and the shared participation tagline.
- No already-live game should appear in the primary "needs first build" challenge list.
