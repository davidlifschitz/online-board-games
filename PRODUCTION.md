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

### Transit Network product redesign — 2026-09-02

- PR #36, **Rebuild TrainGames as a Transit Network**, was squash-merged as `e4fea90a757ad15d24b82b11f9ff1c9f5410190e`.
- The release replaces the prior product shell with the NYC-subway-inspired Transit Network identity: SVG System Map home, station/departure Play catalog, network-extension Build flow, and Service Rankings presentation.
- The product shell uses the approved subway route palette while category labels rely on the visual color treatment rather than spelling color names in the text.
- V1/V2 game URLs, game engines, service-worker behavior, authentication, submissions, voting, and Supabase schema were preserved.
- Vercel production deployment: `dpl_32PATz9fRfJygVr2MoWaG6sAZ3Td`.
- Deployed Git commit: `8bf9d6e272c6492f9de5f0d4eea683e192e42200`.
- Production alias: `https://os-online-board-games.vercel.app`.
- Repository deploy policy was restored to manual-only immediately after the production build reached `READY` in `666e079aa8c68723029c1e27707ed5cc84d4918f`.
- Production verification confirmed HTTP 200 for `/`, `/play.html`, `/build.html`, `/leaderboard.html`, the production `leaderboard.js`, and representative V2 route `/games/crown-jump/v2/`.
- The production smoke contract was updated to the intentional Transit Network copy in `4d1aef9128c47708bff3cc541ae9fe1646519c3c`; both Frontend checks and Production smoke passed on that commit.
- Supabase project `slnvfdkyvijrhmisurhw` remained `ACTIVE_HEALTHY`; no DDL or database-policy changes were made for this release.

### TrainGames V2 — 2026-08-27

- PR #34, **TrainGames V2 redesign across current games**, was squash-merged as `59af1f39d437f47762a7a451bbe0943e3535ff7c`.
- The release adds separate V2 gameplay routes for 24 live games while preserving every V1 route; DiscShift/Othello remains V1-only by design.
- Vercel production deployment: `dpl_GwjJZeHbqF2NVeTyZibrYa8e5q6W`.
- Deployed Git commit: `a1bcbccdfe930dfab1d14a47df6553d55032c44a`.
- Production alias: `https://os-online-board-games.vercel.app`.
- Repository deploy policy was restored to manual-only immediately after the production build reached `READY` in `086d54216fbf6d1cd89c87edff3d78efff1448ee`.
- The final main-branch Frontend checks and Production smoke workflows both passed on the restored deployment-policy commit.
- Production verification confirmed HTTP 200 for the updated arcade, shared V2 UI asset, V2 catalog metadata, a bridged native V2 route (Deal Room), and a first-party V2 route (HueBreak).
- Supabase contains 24 approved V2 Builder Board submissions, one for each V2 game, all marked as redesigns rather than first implementations. The builder leaderboard reports 32 shipped implementations across 25 distinct game concepts.
- The Supabase security advisor still reports the pre-existing anonymous voting RPC warnings and the intentionally locked-down `build_votes` table; this release did not add or alter those database security surfaces.

### Gameplay UI refresh — 2026-08-26

- Merged feature commit: `ef81a65e065c55f2e86f43db52ab8a355c80c5cd`
- Vercel production deployment: `dpl_7V6He2egtMuHTrnJFCBZRhcTbRhw`
- Deployed Git commit: `a2c6686a12dafa391f3f81cf9c498de64988ba60`
- Production alias: `https://os-online-board-games.vercel.app`
- Repository deploy policy restored to manual-only immediately after the production build reached `READY` in commit `3f13b3139be47de052f5b0560b87f09f1230a957`.
- Production verification confirmed HTTP 200 for `/play.html`, `/games/gameplay-ui.js`, `/games/gameplay-ui.css`, and representative board/card/action/puzzle routes: Boxline, Hearts, Spark Six, and Photo Puzzle.
- Representative Boxline service-worker verification confirmed the shared UI assets are precached and stale-cache cleanup is scoped to `boxline-` caches.

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
8. Supabase security advisor remains clear after schema changes, or any intentional pre-existing warnings are documented and understood.

Production activation and initial end-to-end verification are tracked in issue #13.
