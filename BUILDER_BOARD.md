# TrainGames Builder Board

The contributor leaderboard and authenticated submission flow are live on TrainGames at `https://os-online-board-games.vercel.app`. The URL and the Vercel/Supabase project identifiers intentionally retain the earlier `os-online-board-games` slug during the rebrand so existing links and OAuth continue to work.

## Submission contract

A website submission requires:

- GitHub or Google authentication through Supabase Auth.
- A game / prompt from `games.json`.
- An implementation name.
- A live HTTPS production URL.
- A public GitHub source URL.
- At least one declared AI model, or `None` when no AI model was materially used.
- Optional implementation notes.

The authenticated user's provider identity is captured server-side. The browser cannot choose the displayed builder name, provider, approval status, first-on-board flag, or owner UUID.

## Leaderboard behavior

New submissions start as `pending`. Pending rows are visible only to their owner and moderators. Only `approved` rows appear in public Builder Board views.

The database field `first_implementation` means **first approved implementation recorded on the TrainGames Builder Board**; it does not claim that no implementation existed before the leaderboard.

## Supabase project

Project ref: `slnvfdkyvijrhmisurhw`

Public client URL: `https://slnvfdkyvijrhmisurhw.supabase.co`

The browser uses a Supabase publishable key. Do not put a Supabase secret/service-role key in this repository or in browser code.

## OAuth configuration

Current production app URL:

`https://os-online-board-games.vercel.app`

Supabase OAuth callback URL registered with GitHub and Google:

`https://slnvfdkyvijrhmisurhw.supabase.co/auth/v1/callback`

The Supabase Auth Site URL and allowed production redirect currently use the production app URL. GitHub and Google are enabled as Auth providers with credentials stored privately outside the repository.

When a TrainGames-branded domain is added, keep the old origin allowed until both providers have been verified end to end from the new origin.

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
- The accepted provider is taken from server-controlled Auth app metadata.
- Only GitHub or Google authenticated identities are accepted for website submissions.
