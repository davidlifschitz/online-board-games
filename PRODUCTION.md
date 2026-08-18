# Production operations

This repository is the source of truth for the OS Online Board Games hub.

## Production services

- Hub: `https://os-online-board-games.vercel.app`
- Vercel project: `os-online-board-games` (`prj_u5gE9K64MiL8CoEQGArT4aPJ6a8P`)
- Production branch: `main`
- Supabase project: `os-online-board-games` (`slnvfdkyvijrhmisurhw`)
- Supabase Auth callback: `https://slnvfdkyvijrhmisurhw.supabase.co/auth/v1/callback`

## Deployment

The Vercel project is connected to this repository. Changes merged or committed to `main` are intended to trigger the production deployment.

## Release verification

After a production deployment, verify:

1. The hub contains the `BUILDER BOARD` and `SUBMIT AN IMPLEMENTATION` sections.
2. `/games.json`, `/styles.css`, and `/app.js` return successfully from the production alias.
3. GitHub and Google OAuth both return to the production hub successfully.
4. A signed-in builder can create a pending submission with a live URL, public GitHub source URL, and model/model list.
5. Pending submissions are owner-only; approved submissions appear publicly on the Builder Board, recent builds, and model-usage views.
6. Supabase security advisor remains clear after schema changes.

Production activation and initial end-to-end verification are tracked in issue #13.