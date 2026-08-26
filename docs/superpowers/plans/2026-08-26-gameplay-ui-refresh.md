# Gameplay UI Refresh Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Upgrade the gameplay UX for all 20 in-repository live TrainGames without changing their rules engines or sacrificing offline behavior.

**Architecture:** Add one dependency-free shared gameplay UI CSS/JS layer under `games/`, loaded by every in-repo live game. The layer progressively enhances existing markup into compact settings, game-state HUDs, mobile action docks, focus/motion behavior, and archetype-specific layouts, while game engines remain authoritative and untouched. Existing bespoke game CSS remains in place underneath the shared layer.

**Tech Stack:** Static HTML/CSS/vanilla JavaScript, Node 22 contract tests, existing game-specific service workers, GitHub Actions, Vercel static deployment.

**Spec:** `docs/superpowers/specs/2026-08-26-gameplay-ui-refresh.md`

## Global Constraints

- Scope is exactly the 20 in-repository live games listed in the spec.
- Do not modify game rules, scoring engines, AI algorithms, persistence schemas, or Supabase schema.
- Keep the five externally hosted live games out of this release.
- Preserve current offline/PWA behavior.
- Keep `vercel.json` manual deployment policy disabled except during the single intentional production deploy.
- Use no new runtime dependencies or external CDN assets.
- Honor `prefers-reduced-motion` and 44px primary touch targets.

---

### Task 1: Gameplay UI contract test

**Files:**
- Create: `tests/gameplay-ui-contract.test.js`
- Modify: `.github/workflows/frontend-check.yml`

**Interfaces:**
- Consumes: `games.json`, every local live game's `index.html`, and any local `sw.js`.
- Produces: a Node test that defines the 20-game coverage and offline/shared-asset contract.

- [ ] **Step 1: Write the failing contract test**

The test must:

```js
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '..');
const catalog = JSON.parse(fs.readFileSync(path.join(root, 'games.json'), 'utf8'));
const localLive = catalog.games.filter(game => game.status === 'live' && /^\/games\/[^/]+\/$/.test(game.liveUrl || ''));

test('all 20 repository-hosted live games load the shared gameplay UI', () => {
  assert.equal(localLive.length, 20);
  for (const game of localLive) {
    const slug = game.liveUrl.split('/')[2];
    const html = fs.readFileSync(path.join(root, 'games', slug, 'index.html'), 'utf8');
    assert.match(html, /\.\.\/gameplay-ui\.css/);
    assert.match(html, /\.\.\/gameplay-ui\.js/);
  }
});

test('game-scoped service workers precache shared gameplay UI assets', () => {
  for (const game of localLive) {
    const slug = game.liveUrl.split('/')[2];
    const swPath = path.join(root, 'games', slug, 'sw.js');
    if (!fs.existsSync(swPath)) continue;
    const sw = fs.readFileSync(swPath, 'utf8');
    assert.match(sw, /\.\.\/gameplay-ui\.css/);
    assert.match(sw, /\.\.\/gameplay-ui\.js/);
  }
});
```

- [ ] **Step 2: Run through GitHub Actions and verify RED**

Open a draft PR from `agent/gameplay-ui-refresh` to `main`. Expected result: `Frontend checks` fails in the new gameplay UI contract step because the shared assets and references do not exist yet.

- [ ] **Step 3: Add the test to CI syntax/check sequence**

Add `node --check games/gameplay-ui.js` and `node --test tests/gameplay-ui-contract.test.js` to `.github/workflows/frontend-check.yml` once the implementation file exists. Until then, add only the contract test command so RED is caused by the missing feature, not a missing syntax-check target.

---

### Task 2: Shared progressive-enhancement layer

**Files:**
- Create: `games/gameplay-ui.css`
- Create: `games/gameplay-ui.js`
- Test: `tests/gameplay-ui-contract.test.js`

**Interfaces:**
- Consumes: common markup classes already present across games: `.shell`, `nav`, `header`, `.controls`, `.statusbar`, `.scorebar`, `.game-panel`, `.panel`, `.game-grid`, `.table`, `.actions`, `.help`, `.status`, `.history`.
- Produces: progressive DOM annotations/classes and shared visual behavior. No engine-state mutation.

- [ ] **Step 1: Implement shared JS with game profiles**

`games/gameplay-ui.js` must determine the slug from `location.pathname`, map it to one of `board`, `cards`, `action`, or `puzzle`, add `tg-game` and `tg-<profile>` classes to `body`, and progressively enhance markup after DOM load.

Required behaviors:

```js
const profiles = {
  board: ['crown-jump','boxline','sowstone','millstone','discshift','hexline','gridwake','racehome','tilebound'],
  cards: ['high-table','hearts','spades','gin-rummy','rummy-500'],
  action: ['spark-six','twenty-one-lab','deal-room'],
  puzzle: ['mergefront','cipherloom','photo-puzzle']
};
```

- Convert `.controls` into a compact collapsible settings surface without replacing/removing its existing children.
- Preserve all existing element IDs and event listeners.
- Add a `tg-state` class to `.statusbar`/`.scorebar` surfaces.
- Add `tg-play-surface` to the primary game panel/board/table container.
- Add `tg-action-dock` to `.actions` groups and game-specific primary action containers where present.
- Add `tg-secondary` to rules/help/history side content.
- Observe status text and numeric HUD values with `MutationObserver`; apply a short `tg-state-changed` class when values change.
- Do not inject duplicate settings wrappers on re-execution.
- Do not change Photo Puzzle's setup card or its existing mobile Board/Pieces controls.

- [ ] **Step 2: Implement shared CSS**

The CSS must define:

- TrainGames dark-neutral tokens with game CSS variables allowed to override accents.
- Compact top navigation and reduced header vertical space on game pages.
- Settings `<details>`/summary surface with responsive wrapping.
- HUD chips with tabular numerals.
- Elevated play surface hierarchy.
- Consistent focus-visible rings.
- Selection/legal/disabled state refinement without overriding game-specific color semantics.
- Mobile sticky action dock with `padding-bottom: max(10px, env(safe-area-inset-bottom))`.
- Card-game hand spacing/scroll behavior on narrow screens.
- Board-game sidebar collapse/secondary treatment on narrow screens.
- Action-game button hierarchy and dice/card emphasis.
- Puzzle profile minimal overrides, explicitly excluding Photo Puzzle's existing bespoke layout where selectors conflict.
- State-change transitions, toast-like status emphasis, and `prefers-reduced-motion: reduce` fallback.

- [ ] **Step 3: Extend the contract test for profile coverage**

Import the shared JS source as text and assert every one of the 20 expected slugs appears in exactly one profile list. This prevents a live local game from silently falling back to generic styling.

---

### Task 3: Wire all 20 games and preserve offline caching

**Files:**
- Modify: the 20 `games/*/index.html` files in scope.
- Modify: every in-scope `games/*/sw.js` that exists.
- Test: `tests/gameplay-ui-contract.test.js`

**Interfaces:**
- Consumes: `games/gameplay-ui.css`, `games/gameplay-ui.js`.
- Produces: every local live game loads the shared layer and every game-scoped service worker precaches it.

- [ ] **Step 1: Add the shared stylesheet**

Immediately after each game's own stylesheet(s), add:

```html
<link rel="stylesheet" href="../gameplay-ui.css">
```

This keeps bespoke styling authoritative underneath the enhancement layer.

- [ ] **Step 2: Add the shared script**

At the end of body after each game's own gameplay script(s), add:

```html
<script src="../gameplay-ui.js"></script>
```

Because the enhancer moves existing nodes only after game initialization, existing listeners remain attached.

- [ ] **Step 3: Update service-worker precaches**

For each game-scoped `sw.js`, add `../gameplay-ui.css` and `../gameplay-ui.js` to the install asset list and increment the cache key/version. Do not change fetch semantics.

- [ ] **Step 4: Run contract test GREEN through PR CI**

Expected: gameplay UI contract passes for 20 games and all service-worker-bearing games.

---

### Task 4: Game-specific gameplay polish

**Files:**
- Modify: `games/gameplay-ui.css`
- Modify only when necessary: scoped `games/<slug>/index.html`, `styles.css`, or presentation JS. Do not modify engine files.
- Test: existing game engine tests plus gameplay UI contract.

**Interfaces:**
- Consumes: shared profile/body classes from `gameplay-ui.js`.
- Produces: per-archetype and per-game interaction refinements without rules changes.

- [ ] **Step 1: Board/spatial games**

Implement scoped CSS for:

- Crown Jump: board remains centered and dominant; toolbar/settings collapse; status row stays attached to board.
- Boxline/Sowstone/Millstone/Hexline/DiscShift: board + current-turn copy dominate; hints become secondary; narrow screens avoid board shrink caused by side content.
- Gridwake: paired grids remain visually paired on desktop and stack with Target waters first during active firing on mobile when existing DOM permits without semantic breakage.
- Racehome: dice/action/legal-sequence column becomes sticky adjacent to board on desktop and a mobile action dock on narrow screens.
- Tilebound: preserve bespoke board sizing and only apply common nav/settings/focus/action treatment.

- [ ] **Step 2: Card games**

Implement scoped CSS for High Table, Hearts, Spades, Gin Rummy, and Rummy 500:

- Hands use horizontal overflow on narrow viewports instead of aggressively wrapping into tall walls.
- Selected cards visibly lift; legal cards use a subtler outline.
- Trick/table/discard zone gets stronger separation from hand.
- Score/history sidebars become visually secondary and move after active play on mobile.
- Action groups become sticky mobile docks; disabled actions remain visibly present but subdued so phase flow is understandable.

- [ ] **Step 3: Dice/trainer/action games**

Implement scoped CSS for Spark Six, Twenty-One Lab, and Deal Room:

- Primary dice/cards area gets larger visual weight.
- Action buttons become the strongest controls within the play surface.
- Recommendation/turn score/feedback sits adjacent to actions.
- Reference/rules material uses lower contrast and progressive disclosure where existing markup supports it.

- [ ] **Step 4: Puzzle/deduction games**

Implement scoped CSS for Mergefront and Cipherloom; apply only non-conflicting shared polish to Photo Puzzle:

- Mergefront boards consume more viewport and controls recede after setup.
- Cipherloom composer/palette/history alignment makes the current guess row and feedback the focal point.
- Photo Puzzle keeps its existing stepwise setup, Board/Pieces tabs, progress bar, check flow, and mobile selection UX unchanged.

---

### Task 5: CI, review, merge, production deploy

**Files:**
- Modify: `.github/workflows/frontend-check.yml`
- Modify: `PRODUCTION.md` only after successful deploy to record the new deployment/commit.

**Interfaces:**
- Consumes: completed feature branch and existing CI/deploy policy.
- Produces: reviewed main-branch release and one verified Vercel production deployment.

- [ ] **Step 1: Finish CI wiring**

Add:

```yaml
- name: Check shared gameplay UI syntax
  run: node --check games/gameplay-ui.js
- name: Test gameplay UI coverage and offline contract
  run: node --test tests/gameplay-ui-contract.test.js
```

Keep all existing checks.

- [ ] **Step 2: Primary self-review**

Review the PR diff for scope leakage, missing games, service-worker cache errors, accessibility regressions, and selectors likely to override game geometry incorrectly. Fix every valid finding and re-run PR checks.

- [ ] **Step 3: Clean-room review protocol**

The requested Luna/Terra/Sol separate-model review stages are not available in this connector session. Perform the closest supported independent fresh-context review at each stage by re-fetching only the final PR patch, spec, validation commands, and findings format; do not reuse prior review notes. Repeat each stage until clean or the configured pass cap is reached, and report clearly that these were same-model independent passes rather than actual Luna/Terra/Sol subagents.

Required findings format per pass:

```text
Stage: <Luna-like | Terra-like | Sol-like>
Pass: <n>
Findings:
- [severity] file:line — issue — required fix
Result: CLEAN | FIXES REQUIRED
```

- [ ] **Step 4: Verify PR checks**

Use GitHub workflow/check data for the feature head SHA. Required: all relevant `Frontend checks` jobs pass.

- [ ] **Step 5: Merge**

Squash-merge the reviewed PR into `main` using the verified head SHA.

- [ ] **Step 6: Deploy once through Vercel**

Use the existing `os-online-board-games` Vercel project. Temporarily enable the repository deployment mechanism only if the connected Vercel tooling requires it, deploy the merged main commit once, wait for a READY production deployment, then restore `vercel.json` to manual-only immediately.

- [ ] **Step 7: Production verification**

Verify the hub and representative games from each archetype, shared assets, and offline/service-worker behavior using available deployment/browser tooling. Record the production deployment ID and deployed commit in `PRODUCTION.md`.
