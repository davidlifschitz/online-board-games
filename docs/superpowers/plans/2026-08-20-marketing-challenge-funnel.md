# TrainGames Marketing Challenge Funnel Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make TrainGames' Play → Build → Deploy → Contribute loop the primary marketing funnel while deriving build opportunities from `games.json`.

**Architecture:** Keep `games.json` as the source of truth. Add a small browser/Node-compatible `build-catalog.js` helper for challenge grouping and claim URLs, render Build-page opportunities dynamically, and align homepage/README/challenge copy. Add Node built-in regression tests and wire them into frontend CI.

**Tech Stack:** Static HTML/CSS/JavaScript, JSON catalog, Node.js 22 built-in test runner, GitHub Actions.

**Spec:** `docs/superpowers/specs/2026-08-20-marketing-challenge-funnel-design.md`

## Global Constraints

- Product brand remains TrainGames.
- Participation tagline is `Play one. Build one. Deploy one.`
- `games.json` remains the source of truth for build status and counts.
- Never invent builder attribution; optional attribution fields render only when verified.
- Preserve existing Supabase authentication/submission and public leaderboard behavior.

---

### Task 1: Testable challenge catalog helper

**Files:**
- Create: `build-catalog.js`
- Create: `tests/build-catalog.test.cjs`
- Modify: `.github/workflows/frontend-check.yml`

**Interfaces:**
- Produces: `TrainGamesBuildCatalog.groupChallengeGames(games)` and `TrainGamesBuildCatalog.claimUrlForGame(game)` in browsers; CommonJS exports in Node.

- [ ] Write tests proving live games and prompt-less extras are excluded from first-build challenge groups.
- [ ] Run `node --test tests/build-catalog.test.cjs` and confirm it fails before `build-catalog.js` exists.
- [ ] Implement the minimal helper.
- [ ] Run the test and `node --check build-catalog.js` until green.
- [ ] Add the helper syntax check and Node test command to frontend CI.

### Task 2: Dynamic Build challenge page

**Files:**
- Modify: `build.html`
- Modify: `build.js`

**Interfaces:**
- Consumes: `/games.json` and `TrainGamesBuildCatalog`.
- Produces: a `#challengeCatalog` tiered list of unbuilt prompt-backed games.

- [ ] Remove the stale hard-coded starter issue cards.
- [ ] Load `build-catalog.js` before `build.js`.
- [ ] Render Starter, Intermediate, and Advanced sections from the catalog.
- [ ] Give every card direct Prompt and Claim links.
- [ ] Populate build-page counts from `games.json.summary` rather than static numbers where practical.
- [ ] Preserve the existing authenticated submission form unchanged.

### Task 3: Homepage audience funnel

**Files:**
- Modify: `index.html`

- [ ] Add `Play one. Build one. Deploy one.` to the hero.
- [ ] Retain the commute/dead-zone explanation beneath it.
- [ ] Make the three portal cards explicitly address Players, Builders, and Contributors.
- [ ] Route Contribute directly to `/build.html#submit` while keeping Leaderboard in nav/hero actions.
- [ ] Update visible collection counts to the current `games.json` summary.

### Task 4: Repository marketing alignment

**Files:**
- Modify: `README.md`
- Modify: `BUILD_CHALLENGE.md`

- [ ] Put the participation tagline and Play / Build / Contribute routes near the top of README.
- [ ] Use current counts: 20 live games, 51 prompts, 33 awaiting a first deployment.
- [ ] Remove already-live games from the first-build starter list in `BUILD_CHALLENGE.md`.
- [ ] Keep alternate implementations explicitly welcome.

### Task 5: Contributor metadata contract

**Files:**
- Modify: `games.json`
- Modify: `play.js`

- [ ] Document optional `sourceUrl` and `builtBy` fields on verified live implementations only.
- [ ] Render Source and Built by links/text on game cards when those fields exist.
- [ ] Do not populate unverified attribution.

### Task 6: Validation and review

- [ ] Run Node tests and syntax checks for changed JavaScript.
- [ ] Parse `games.json` and recompute summary counts.
- [ ] Confirm stale issue references for already-live starter games are absent from Build challenge surfaces.
- [ ] Compare branch with `main` and inspect only intended files.
- [ ] Perform three fresh-context self-review passes because separate Luna/Terra/Sol reviewer processes are not available in this harness.
