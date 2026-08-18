# Community Favorites voting

The Builder Board includes a build-level Community Favorites leaderboard. Approved implementations are ranked by raw community likes.

## Voting rules

- Voting requires an existing GitHub or Google Supabase Auth session.
- A signed-in user can like an approved implementation once.
- A like can be removed and added again later.
- Builders cannot like their own implementations.
- Pending and rejected implementations cannot receive likes.
- The public UI exposes aggregate like counts only. Voter user IDs are not publicly readable.
- Ties are ordered deterministically by approval time and implementation name; likes are the only popularity signal.

## Data model

`public.build_votes` stores one row per `(submission_id, voter_user_id)` pair. Row Level Security restricts signed-in users to reading and deleting their own vote rows. A server-side trigger derives `voter_user_id` from `auth.uid()` and rejects self-votes or votes on non-approved builds.

`public.builder_submissions.vote_count` is maintained by a database trigger after vote inserts and deletes. This cached aggregate is public and is used to sort the Community Favorites cards without exposing the underlying voters.

The additive database definition lives in [`supabase/community-voting.sql`](supabase/community-voting.sql).

## Frontend

`community-voting.js` mounts the Community Favorites block inside the existing Builder Board. It reuses the same Supabase client and persisted OAuth session as `app.js`; it does not create a second auth client.

Signed-out visitors can browse the rankings and counts. Selecting the vote control prompts them to sign in. Signed-in users can like/unlike eligible builds directly from the board.
