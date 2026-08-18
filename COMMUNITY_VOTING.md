# Community Favorites voting

The Builder Board includes a build-level Community Favorites leaderboard. Approved implementations are ranked by raw community likes.

## Voting rules

- Anyone can vote; no GitHub/Google sign-in is required.
- A browser profile can like an approved implementation once.
- A like can be removed and added again later.
- Pending and rejected implementations cannot receive likes.
- Public pages expose aggregate like counts only.
- Ties are ordered deterministically by approval time and implementation name; likes are the only popularity signal.

## Anonymous voter identity

The browser creates a random UUID once and stores it in local storage. The raw UUID is sent only to the voting RPC. Supabase hashes it with SHA-256 before storing it, so the public database never exposes the browser token itself.

This is intentionally lightweight rather than fraud-proof: clearing browser storage or using another browser/device creates a new voter identity. The goal is zero-friction community voting without requiring an account.

## Data model

`public.build_votes` stores one row per `(submission_id, voter_key_hash)` pair. Direct table access is revoked from browser roles. Public RPC functions handle adding/removing a vote and reading only the submission IDs voted for by the supplied browser token.

`public.builder_submissions.vote_count` is maintained by a database trigger after vote inserts and deletes. This cached aggregate is public and sorts the Community Favorites cards without exposing voter identifiers.

The additive database definition lives in [`supabase/community-voting.sql`](supabase/community-voting.sql).

## Frontend

`community-voting.js` mounts the Community Favorites block inside the existing Builder Board and reuses the site Supabase client. Visitors can like/unlike eligible builds immediately without authenticating.
