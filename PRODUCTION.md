# TrainGames production operations

This repository is the source of truth for the **TrainGames** hub.

## Production services

The user-facing brand is TrainGames. The following legacy technical identifiers intentionally remain in place for compatibility during the rebrand:

- Hub: `https://os-online-board-games.vercel.app`
- Vercel project: `os-online-board-games` (`prj_u5gE9K64MiL8CoEQGArT4aPJ6a8P`)
- Production branch: `main`
- Supabase project: `os-online-board-games` (`slnvfdkyvijrhmisurhw`)
- Supabase Auth callback: `https://slnvfdkyvijrhmisurhw.supabase.co/auth/v1/callback`

## Current verified deployment

- TrainGames rebrand deployed: `2026-08-20`
- Vercel production deployment: `dpl_A7iQDaiqnff51ajojpYAhkzLCCWW`
- Deployed Git commit: `5d92e656e057f556dfdedff2d202c464fa9b1038`
- Production alias: `https://os-online-board-games.vercel.app`
- Repository deploy policy restored to manual-only immediately after the production build reached `READY`.
- Production smoke re-check requested: `2026-08-20`.

## Rebrand migration rule

Do not remove the existing production origin during a domain migration. Add the TrainGames origin as an alias first, add it to the Supabase Auth Site URL/redirect allowlist as appropriate, update the GitHub and Google OAuth application configuration if needed, verify both sign-in providers on the new origin, and only then make the new hostname canonical.

## Deployment

Vercel Git deployment is currently disabled in `vercel.json`; repository changes do not automatically deploy. Use the existing Vercel project when a deployment is intentionally triggered.

## Release verification

After a production deployment, verify:

1. The home page visibly identifies the product as `TrainGames` and includes the commute/offline positioning.
2. `/play.html`, `/build.html`, `/leaderboard.html`, and `/open-source.html` use the TrainGames brand.
3. `/manifest.webmanifest`, `/site.js`, `/sw.js`, `/train-games-icon.svg`, `/games.json`, and the core CSS/JS assets return successfully.
4. A successful online visit installs the TrainGames shell service worker; a later offline revisit can reopen cached hub pages.
5. GitHub and Google OAuth both return to the production hub successfully.
6. A signed-in builder can create a pending submission with a live URL, public GitHub source URL, and model/model list.
7. Pending submissions are owner-only; approved submissions appear publicly on the Builder Board.
8. Supabase security advisor remains clear after schema changes.

Production activation and initial end-to-end verification are tracked in issue #13.
