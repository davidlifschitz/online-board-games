# Gameplay UI Refresh Spec

## Goal

Make all 20 live games hosted inside this repository feel like one polished TrainGames arcade while preserving each game's mechanics, offline behavior, and distinct play surface.

## Reference principles

Use the user's preferred UI references as inspiration, not templates: Beautiful UI, beUI, Rare UI, Transitions.dev, and shadcn/ui.

Translate those references into these product principles:

1. **Decision-first hierarchy** — the current game state, selectable objects, and legal/primary action should visually outrank setup and documentation.
2. **Contextual actions** — when a player selects cards, pieces, dice, or a move, the actions that operate on that selection should stay physically close and remain reachable on mobile.
3. **Compact setup** — mode, difficulty, target, seed, and rule variants remain available but do not consume the top of the viewport once play starts.
4. **Stateful micro-motion** — use short transitions for selection, state swaps, counters, drawers, tabs, turns, and toasts. Avoid motion that changes perceived board geometry or slows repeated moves.
5. **Tactile controls** — minimum 44px touch targets for primary controls, strong focus-visible states, clear selected/legal/disabled states, and reduced-motion support.
6. **Progressive disclosure** — rules, provenance, history, advanced settings, and secondary metrics should be available without competing with the play surface.
7. **Offline-safe** — every game that currently has its own service worker must precache any shared gameplay UI assets introduced by this change.
8. **No rules regressions** — gameplay engines and scoring rules should remain unchanged unless a UI bug requires a narrowly scoped behavior fix.

## Scope

The 20 in-repository live games from `games.json`:

- Deal Room
- Photo Puzzle
- Crown Jump
- Racehome
- Gridwake
- Tilebound
- High Table
- Hearts
- Spades
- Gin Rummy
- Rummy 500
- Twenty-One Lab
- Mergefront
- Boxline
- Sowstone
- Millstone
- DiscShift
- Hexline
- Cipherloom
- Spark Six

The five externally hosted live games are intentionally out of scope for this release.

## Shared system

Create lightweight, dependency-free shared assets under `games/`:

- `games/gameplay-ui.css` — design tokens, compact navigation, setup drawer, HUD/status chips, mobile action dock, focus states, selection/legal-state polish, micro-motion, reduced-motion behavior, responsive layout helpers, and archetype-specific refinements.
- `games/gameplay-ui.js` — progressive enhancement that identifies the current game, adds an archetype class, upgrades setup controls into a collapsible settings surface, annotates the play area, enhances status/history/help disclosure, and adds non-invasive state-change affordances without changing engine state.

Each local live game loads both assets. Games with a local service worker precache both assets and increment their cache version.

## Archetype-specific intent

### Board / spatial strategy

Games: Crown Jump, Boxline, Sowstone, Millstone, DiscShift, Hexline, Gridwake, Racehome, Tilebound.

- Board is the dominant visual object above the fold.
- Turn/current-decision state sits immediately adjacent to the board.
- Legal/selected targets get consistent but game-appropriate emphasis.
- Secondary history, captures, provenance, and setup collapse away on small screens.
- Racehome keeps dice + legal turn choices attached to the board decision area.
- Gridwake keeps own and target waters legible as a paired tactical surface.
- Tilebound preserves its bespoke board while adopting shared navigation/settings/action ergonomics.

### Card tables

Games: High Table, Hearts, Spades, Gin Rummy, Rummy 500.

- Hand and current table/trick/discard are the primary hierarchy.
- Selected cards lift subtly; legal cards get a restrained ring rather than high visual noise.
- Current action buttons stay reachable on mobile via a sticky dock.
- Score/history becomes secondary and collapsible on narrow screens.
- Bidding/passing/draw-discard phases make the current phase/action more prominent than static match settings.

### Dice / trainer / action games

Games: Spark Six, Twenty-One Lab, Deal Room.

- Dice/cards and the current decision dominate.
- Risk/score/recommendation feedback is visually adjacent to the action it informs.
- Primary action groups become thumb-reachable on mobile.
- Rules/reference material moves behind progressive disclosure.

### Puzzle / deduction

Games: Mergefront, Cipherloom, Photo Puzzle.

- Preserve Photo Puzzle's already-strong stepwise setup and mobile Board/Pieces model.
- Mergefront minimizes chrome during active play and emphasizes swipe/keyboard state feedback.
- Cipherloom keeps composer, palette, and current feedback together; metrics stay secondary.
- Shared assets should improve consistency without overriding Photo Puzzle's bespoke layout.

## Accessibility and motion

- Primary buttons and interactive controls: at least 44px effective touch height.
- Every interactive element must retain a visible keyboard focus indicator.
- `prefers-reduced-motion: reduce` disables nonessential transform/opacity animation and smooth scrolling.
- Status areas retain or gain appropriate `role=status`/`aria-live` behavior only where it does not cause duplicate announcements.
- Color is not the sole indicator for selection/legal state where existing markup supports shape/outline/text alternatives.

## Validation

Automated contract test must verify:

1. Exactly the 20 local live games are covered.
2. Every local live `index.html` loads `../gameplay-ui.css` and `../gameplay-ui.js`.
3. Every local game with `sw.js` precaches both shared assets.
4. Every updated service-worker cache key changes from the pre-refresh version.
5. Existing engine/unit tests and catalog/photo-puzzle tests remain passing.
6. Browser JavaScript syntax checks include `games/gameplay-ui.js`.

Release verification after merge/deploy:

- Home/catalog still load.
- Representative board, card, dice/trainer, and puzzle games load successfully.
- Shared UI assets return 200.
- Mobile viewport does not hide the active game action behind browser safe areas.
- Offline revisit works for representative games that have game-scoped service workers.
- Manual Vercel deployment policy is restored after the production build.
