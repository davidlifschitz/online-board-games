# Per-game community leaderboards

The public Leaderboard is game-first: choose a game and every approved implementation for that game appears in one ranked table.

## Ranking rules

- Each game has an independent all-time leaderboard.
- Approved implementations are ranked by community score, where one browser vote equals one point.
- Higher scores rank first.
- Ties are ordered by approval time, then implementation name, then submission ID for a deterministic result.
- The database computes rank in `public.game_leaderboard`; the browser does not calculate the ordering itself.
- Pending and rejected implementations never appear in the public leaderboard and cannot receive votes.

This intentionally uses an all-time score rather than a time-decay “hot” score. The goal is to rank the strongest implementation of a game over time, while keeping the one-click voting interaction familiar to Hacker News or Reddit users.

## Voting rules

- Anyone can vote; no GitHub/Google sign-in is required.
- A browser profile can vote for an approved implementation once.
- A vote can be removed and added again later.
- Public pages expose aggregate scores only.

## Anonymous voter identity

The browser creates a random UUID once and stores it in local storage. The raw UUID is sent only to the voting RPC. Supabase hashes it with SHA-256 before storing it, so the public database never exposes the browser token itself.

This is intentionally lightweight rather than fraud-proof: clearing browser storage or using another browser/device creates a new voter identity. The goal is zero-friction community voting without requiring an account.

## Data model

`public.build_votes` stores one row per `(submission_id, voter_key_hash)` pair. Direct table access is revoked from browser roles. Public RPC functions handle adding/removing a vote and reading only the submission IDs voted for by the supplied browser token.

`public.builder_submissions.vote_count` is maintained by a database trigger after vote inserts and deletes. `public.game_leaderboard` exposes approved builds with a rank partitioned by `game_id`, and a partial ranking index keeps per-game sorting efficient as submission volume grows.

Database definitions:

- [`supabase/community-voting.sql`](supabase/community-voting.sql) adds anonymous build voting and cached scores.
- [`supabase/game-leaderboard.sql`](supabase/game-leaderboard.sql) adds the per-game ranked view and ranking index.

## Frontend

`leaderboard.html`, `leaderboard.css`, and `leaderboard.js` provide a game selector and a real table with rank, submission, builder, model stack, score, play/source links, and one-click voting. The selected game is stored in the `?game=` query parameter so a specific leaderboard can be linked directly.
