# TrainGames V2 Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build 24 coexistence-safe TrainGames V2 game interfaces, excluding DiscShift/Othello, and publish them as independently voteable V2 implementations.

**Architecture:** Add a dependency-free V2 shell (`games/v2-ui.css`, `games/v2-ui.js`) with explicit profile configuration. Existing local engines are reused by separate `/v2/` entry points; five external V1 games receive first-party vanilla-JS V2 implementations in this repository. V1 files stay intact and catalog metadata points to both versions.

**Tech Stack:** Static HTML/CSS/JavaScript, existing game engines, Node test runner, service workers, Vercel static hosting, existing Supabase leaderboard schema.

**Spec:** `docs/superpowers/specs/2026-08-27-traingames-v2-redesign.md`

## Global Constraints

- Build exactly 24 V2 routes; DiscShift/Othello is excluded.
- V1 routes and implementations stay intact.
- V2 routes are `/games/<canonical-slug>/v2/`.
- `games.json.liveUrl` remains the V1 compatibility URL.
- V2 uses no heavy UI framework or new runtime dependency.
- V2 cache cleanup must be scoped to `<slug>-v2-`.
- Vercel Git deployment remains disabled until the release is intentionally deployed.

---

### Task 1: V2 contract test

**Files:**
- Create: `tests/gameplay-v2-contract.test.js`
- Modify: `.github/workflows/frontend-check.yml`

**Interfaces:**
- Consumes: `games.json` and the game directory tree.
- Produces: a CI contract that requires the full 24-game V2 surface before the feature can be considered green.

- [ ] Write a Node test containing the exact V2 slug list and assertions for route existence, shared assets, version switch, catalog metadata, exclusion of DiscShift, and V2 cache-prefix isolation.
- [ ] Commit only the test and CI wiring.
- [ ] Verify the GitHub Actions run fails because V2 routes/assets do not exist yet.

### Task 2: Shared V2 design system

**Files:**
- Create: `games/v2-ui.css`
- Create: `games/v2-ui.js`

**Interfaces:**
- `v2-ui.js` reads `body[data-v2-game]`, adds `tg2-*` family/game classes, injects `.tg2-topbar`, and rehomes configured status/actions/settings/help nodes without cloning IDs.
- `v2-ui.css` styles `.tg2-shell`, `.tg2-stage`, `.tg2-hud`, `.tg2-actions`, `.tg2-settings`, card/table/board/puzzle families, mobile safe-area docks, focus-visible, and reduced motion.

- [ ] Implement the smallest shell that satisfies the V2 route contract.
- [ ] Add profile selectors for every local V2 game and explicit no-op handling for game-specific structures.
- [ ] Keep event-bound nodes intact by moving nodes rather than copying them.
- [ ] Verify syntax with `node --check games/v2-ui.js` via CI.

### Task 3: Local engine-backed board/table V2 routes

**Files:**
- Create `v2/index.html` for: `crown-jump`, `racehome`, `gridwake`, `tilebound`, `boxline`, `sowstone`, `millstone`, `hexline`.

**Interfaces:**
- Reuse each V1 route's local engine/game scripts through `../engine.js` / `../game.js` or the exact existing script set.
- Load `../../v2-ui.css` and `../../v2-ui.js` after the game-specific CSS/scripts.
- Add `data-v2-game="<slug>"`, V1 link `../`, and a `data-v2-switch` affordance.

- [ ] Copy the tested V1 DOM hooks into each separate V2 entry point without modifying V1.
- [ ] Replace long-form header prominence with V2 shell semantics.
- [ ] Add per-game classes/data needed for board-specific compositions.
- [ ] Verify existing engine suites remain green.

### Task 4: Local card/action/puzzle V2 routes

**Files:**
- Create `v2/index.html` for: `deal-room`, `photo-puzzle`, `high-table`, `hearts`, `spades`, `gin-rummy`, `rummy-500`, `twenty-one-lab`, `mergefront`, `cipherloom`, `spark-six`.

**Interfaces:** same coexistence and shared-asset contract as Task 3.

- [ ] Preserve all IDs/data hooks required by existing scripts.
- [ ] Give card hands/central piles/score state explicit V2 semantic classes where markup permits.
- [ ] Preserve Photo Puzzle's existing placement correctness/privacy behavior while restructuring only presentation.
- [ ] Verify existing JS syntax and engine tests remain green.

### Task 5: First-party V2 Fourfront and Five Dice

**Files:**
- Create: `games/fourfront/v2/index.html`, `styles.css`, `game.js`, `sw.js`
- Create: `games/five-dice/v2/index.html`, `styles.css`, `game.js`, `sw.js`
- Create: focused Node tests for Connect Four win detection and Five Dice scoring/hold behavior.

**Interfaces:**
- Fourfront exports pure helpers on `window.FourfrontV2` for board creation, legal columns, winner detection, and bot choice.
- Five Dice exports pure helpers on `window.FiveDiceV2` for category scoring and dice-state transitions.

- [ ] Write failing pure-function tests before game code.
- [ ] Implement local/bot Fourfront with 7x6 board and legal drop/win handling.
- [ ] Implement Five Dice with five dice, up to three rolls, holds, and standard open score categories.
- [ ] Use V2 shared shell and scoped offline caches.

### Task 6: First-party V2 HueBreak, Threadmark, Frontiers

**Files:**
- Create game-local V2 `index.html`, `styles.css`, `game.js`, and `sw.js` under `games/huebreak/v2/`, `games/threadmark/v2/`, `games/frontiers/v2/`.
- Create focused pure-function tests for HueBreak playability/winner rules, Threadmark team reveal/win conditions, and Frontiers phase/territory ownership invariants.

**Interfaces:**
- HueBreak: local player vs bots; cards match hue/value/action; draw/pass and wild hue selection.
- Threadmark: local two-team word grid with spymaster reveal mode, neutral/opponent/assassin outcomes, and team turn transitions.
- Frontiers: compact territory graph with reinforce → attack → fortify phases, dice-based attacks, ownership/troop invariants, and a bot opponent.

- [ ] Write failing rules tests first.
- [ ] Implement functional first-party V2 games with no cross-origin dependencies.
- [ ] Add V1 external links in the version switch.
- [ ] Add scoped V2 offline caches.

### Task 7: Version-aware catalog and arcade

**Files:**
- Modify: `games.json`
- Modify: `play.js`
- Modify: `styles.css` only if needed for version actions.

**Interfaces:**
- Preserve `liveUrl` as V1.
- Add `versions.v1.liveUrl`, `versions.v2.liveUrl`, and `preferredVersion="v2"` for every live non-Reversi entry.
- Arcade card primary link uses preferred V2; secondary V1 link remains visible.

- [ ] Add backward-compatible metadata to exactly 24 live entries.
- [ ] Teach `play.js` to render V2 as primary and V1 as secondary when versions exist.
- [ ] Keep Reversi/DiscShift single-version.
- [ ] Verify catalog/publication tests and V2 contract tests.

### Task 8: Offline and CI hardening

**Files:**
- Create or update V2 workers for routes that support offline play.
- Modify: `.github/workflows/frontend-check.yml`
- Modify/add tests as required.

**Interfaces:**
- Cache names begin `<slug>-v2-`.
- Activate cleanup deletes only keys beginning with the same prefix and not equal to the current cache.
- Shared V2 CSS/JS are precached.

- [ ] Add static cache-isolation assertions.
- [ ] Run all existing engine and frontend contract suites in CI.
- [ ] Fix regressions without touching V1 game behavior.

### Task 9: PR, deployment, and V2 submissions

**Files:**
- Modify: `PRODUCTION.md` after deployment.

**Interfaces:**
- GitHub PR targets `main` from `feature/traingames-v2-redesign`.
- Vercel production deploy occurs only once the full PR is ready and CI is green.
- Leaderboard receives 24 separate `TrainGames V2` approved implementations against existing game IDs after the V2 URLs are live.

- [ ] Open the V2 PR and verify full diff/CI.
- [ ] Merge only after green verification.
- [ ] Perform one intentional production deployment and restore manual-only Vercel deployment policy.
- [ ] Smoke-test all 24 V2 routes and shared assets on production.
- [ ] Add/approve 24 separate V2 leaderboard rows without modifying V1 rows.
- [ ] Record deployment/submission details in `PRODUCTION.md`.
