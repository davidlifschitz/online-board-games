# TrainGames Transit Network Redesign

## Goal
Replace the current TrainGames product shell with a full transit-system interface inspired by New York City subway wayfinding while preserving all game, authentication, submission, voting, V1/V2, and offline behavior.

## Product identity

TrainGames becomes a fictional game transit network rather than a conventional web arcade.

- Warm paper-like light background with dark ink typography.
- NYC subway route colors are used as the core category palette: blue `#0062CF`, red `#D82233`, dark green `#009952`, purple `#9A38A1`, orange `#EB6800`, yellow `#F6BC26`.
- Additional MTA palette tokens may be retained for future route families: light green `#799534`, brown `#8E5C33`, grey `#7C858C`, teal `#008EB7`, MTA blue `#08179C`, ISA blue `#0078C6`.
- Category names are not followed by written color names. The color treatment itself communicates the route color.
- The TrainGames mark is a bespoke transit roundel, not an MTA logo reproduction.

## Information architecture

Existing destinations remain:

- System Map / Home
- Play
- Build
- Rankings / Leaderboard
- Source / GitHub

Underlying URLs remain compatible (`/`, `/play.html`, `/build.html`, `/leaderboard.html`).

## Home / System Map

The homepage is led by a functional SVG network schematic.

- Route geometry uses only horizontal, vertical, and 45-degree segments.
- Consistent route width, station size, interchange rings, and label placement.
- Lines represent TrainGames categories.
- Stations represent live games.
- Interchanges represent games that span meaningful route families.
- The map is horizontally pannable on narrow screens rather than compressed into illegibility.
- Route legend uses category names and colored dots only.
- Map copy says `SCHEMATIC · NOT TO SCALE`.
- Selecting lines/stations may be progressively enhanced later; this release prioritizes a legible system map and working navigation links.

## Play / Departures

Replace the generic game-card grid with a station/departure list.

Each row shows:

- route-colored station code
- game name
- compact metadata (category, difficulty or supported mode where available)
- primary V2 launch where available
- V1 compatibility action where available

Existing filters remain functional and become route filters. V2 remains the preferred action exactly as in the current catalog metadata.

## Build / Extend the Network

The Build page becomes a network-extension/workshop view.

- Existing starter prompts are presented as planned stations/extensions.
- Existing Choose → Ship → Submit workflow remains intact.
- Existing auth provider buttons, form IDs, validation behavior, and Supabase submission semantics remain unchanged.
- The submission workspace adopts transit ticket / permit / planned-extension styling rather than card-based SaaS styling.

## Leaderboard / Service Rankings

The Leaderboard becomes a service-ranking board.

- Existing game selector, table semantics, voting controls, browser voter key, score ordering, links, and Supabase operations remain unchanged.
- Visual hierarchy emphasizes rank, selected game/station, builder, model stack, and score.
- Mobile continues to support horizontal table access without hiding functional columns.

## Navigation

All main pages use the same transit shell:

- `.site-nav.tg-nav`
- `.tg-roundel`
- centered route links on desktop
- compact horizontally safe navigation on mobile
- current section remains programmatically identifiable via `aria-current` / existing `data-page` behavior

## Accessibility

- Sufficient contrast on route colors and controls.
- Visible focus states.
- Direct actions remain at least approximately 44px high on touch layouts.
- SVG map includes a title and description.
- `prefers-reduced-motion` disables nonessential transitions.
- Color is not the sole indicator of game/category identity; category text and station codes remain present. Written color names are intentionally omitted.

## Data and backend contract

No Supabase schema migration is required.

Do not alter:

- authentication provider setup
- submission schema or approval flow
- leaderboard ranking/vote schema
- V1/V2 catalog semantics
- individual game engines or routes
- existing service-worker cache namespaces

## Files in scope

- `index.html`
- `play.html`
- `play.js`
- `build.html`
- `leaderboard.html`
- `styles.css`
- `navigation.css`
- `leaderboard.css`
- `.github/workflows/frontend-check.yml`
- `tests/transit-network-ui.test.js`

## Validation

- Transit UI contract passes.
- Existing frontend JavaScript syntax checks pass.
- Existing catalog, V2, gameplay UI, puzzle, engine, and cache tests continue to pass.
- Production smoke test continues to pass after deployment.
- Supabase project remains healthy; no DDL changes are made.
