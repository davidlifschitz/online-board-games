# Builder Board

The repository includes a contributor leaderboard and authenticated submission flow for the main arcade. The implementation and Supabase schema are in place; production OAuth/deployment activation is tracked in [issue #13](https://github.com/davidlifschitz/online-board-games/issues/13). Until that issue is complete, the public arcade continues to serve the earlier static version and contributors should use the GitHub `Submit a deployed game` form.

## Submission contract

Once the website flow is activated, a submission requires:

- GitHub or Google authentication through Supabase Auth.
- A game / prompt from `games.json`.
- An implementation name.
- A live HTTPS production URL.
- A public GitHub source URL.
- At least one declared AI model, or `None` when no AI model was materially used.
- Optional implementation notes.

The authenticated user's provider identity is captured server-side. The browser cannot choose the displayed builder name, provider, approval status, first-on-board flag, or owner UUID.

## Leaderboard behavior

New submissions start as `pending`. Pending rows are visible only to their owner and moderators. Only `approved` rows appear in public Builder Board, recent-build, game-count, and model-usage views.

The Builder Board reports objective counts rather than an arbitrary point system:

- approved implementations shipped,
- first approved Builder Board submission for a game concept,
- distinct game concepts shipped.

The database field is named `first_implementation` for compatibility, but it means **first approved implementation recorded on the Builder Board**. It does not claim that no implementation existed before this leaderboard. The flag is assigned automatically when a moderator approves the first accepted Board submission for a game concept.

## Supabase project

Project ref: `slnvfdkyvijrhmisurhw`

Public client URL: `https://slnvfdkyvijrhmisurhw.supabase.co`

The browser uses a Supabase publishable key. Do not put a Supabase secret/service-role key in this repository or in browser code.

## OAuth configuration

The production app URL is:

`https://os-online-board-games.vercel.app`

The Supabase OAuth callback URL to register with GitHub and Google is:

`https://slnvfdkyvijrhmisurhw.supabase.co/auth/v1/callback`

In Supabase Auth URL Configuration, set the Site URL to the production app URL and allow the production redirect. Vercel preview URLs can be added separately for preview testing.

GitHub and Google each require their own OAuth client ID and secret in Supabase Auth provider settings. Those provider secrets must remain outside the repository.

## Moderation

To approve a pending submission, update only its status:

```sql
update public.builder_submissions
set status = 'approved'
where id = '<submission-id>'
  and status = 'pending';
```

Approval metadata is filled automatically by a database trigger. To reject:

```sql
update public.builder_submissions
set status = 'rejected'
where id = '<submission-id>'
  and status = 'pending';
```

## Security model

- Row Level Security is enabled on `public.builder_submissions`.
- Anonymous users can read approved submissions only.
- Authenticated users can read their own pending/rejected submissions in addition to approved submissions.
- Authenticated users can create submissions only for themselves and can edit/delete only their own pending submissions.
- Builder identity fields are derived from `auth.users` inside a database trigger.
- Only GitHub or Google authenticated identities are accepted for website submissions.
- Public GitHub source URLs are required.
- Model metadata is required and normalized server-side.
- Supabase security advisors should remain clean after schema changes.
