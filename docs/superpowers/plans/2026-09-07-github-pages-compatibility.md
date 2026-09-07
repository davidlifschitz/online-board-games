# GitHub Pages Compatibility Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make TrainGames work from both a domain root and the GitHub Pages project path `https://davidlifschitz.github.io/online-board-games/`, then link that Pages URL from the personal-site homepage.

**Architecture:** Keep the repository deployable at `/` while removing assumptions that the app always lives at the origin root. Top-level HTML uses relative URLs; JavaScript derives the site root from the executing script URL; the PWA manifest and service worker derive their own scope dynamically. Shared V2 UI code rewrites the TrainGames brand link so individual games return to the correct project-path homepage without changing every V2 HTML file.

**Tech Stack:** Static HTML/CSS/JavaScript, Web App Manifest, Service Worker API, GitHub Pages, GitHub Actions.

**Spec:** Direct user request in the September 7, 2026 project conversation; no separate repository spec file.

## Global Constraints

- Preserve current root-host deployments such as Vercel.
- Support `https://davidlifschitz.github.io/online-board-games/` without hard-coding that path into files that also run at `/`.
- Keep the existing TrainGames navigation, game catalog, Supabase flows, and offline shell behavior.
- Do not alter external GitHub or Vercel URLs.
- GitHub Pages repository settings remain an account-level manual step if the connected GitHub tool cannot mutate the Pages source setting.

---

### Task 1: Make the top-level shell base-path safe

**Files:**
- Modify: `index.html`
- Modify: `play.html`
- Modify: `build.html`
- Modify: `leaderboard.html`
- Modify: `open-source.html`

**Interfaces:**
- Consumes: static files already stored at repository root.
- Produces: top-level pages whose local assets and navigation resolve relative to the current deployment base.

- [ ] **Step 1: Identify root-absolute local references**

Verify the current pages use local references such as `/styles.css`, `/play.html`, `/site.js`, and `/games.json` that resolve incorrectly when the site is hosted under `/online-board-games/`.

- [ ] **Step 2: Convert only local shell references to relative URLs**

Use forms such as:

```html
<link rel="stylesheet" href="styles.css">
<a href="play.html">Play</a>
<a href="./">System map</a>
<script defer src="site.js"></script>
```

Leave fully qualified external URLs unchanged.

- [ ] **Step 3: Make the open-source lineage page resolve internal game URLs against the current site root**

Use a page-root URL helper so an upstream manifest value such as `/games/foo/` becomes `<deployment-base>/games/foo/` while an `https://...` URL remains unchanged.

- [ ] **Step 4: Re-fetch all five files and scan for remaining root-absolute local shell references**

Expected: no local `href="/…"`, `src="/…"`, or `fetch('/…')` remains in these top-level pages.

### Task 2: Make JavaScript data, auth, and PWA paths base-aware

**Files:**
- Modify: `site.js`
- Modify: `play.js`
- Modify: `build.js`
- Modify: `auth-landing.js`
- Modify: `leaderboard.js`
- Modify: `manifest.webmanifest`
- Modify: `sw.js`

**Interfaces:**
- Consumes: the URL of each executing top-level script.
- Produces: a derived site root that is `/` on root deployments and `/online-board-games/` on GitHub Pages.

- [ ] **Step 1: Derive the site root from each executing script**

Use this pattern in top-level scripts:

```js
const siteRoot = new URL('./', document.currentScript?.src || location.href);
```

- [ ] **Step 2: Resolve catalog and internal game links through that root**

`play.js`, `build.js`, and `leaderboard.js` must fetch `games.json` relative to `siteRoot`. `play.js` must transform catalog URLs beginning with `/` into URLs relative to `siteRoot` before rendering links.

- [ ] **Step 3: Preserve OAuth return paths under the deployment base**

`build.js` must use `siteRoot.href` as its OAuth `redirectTo`. `auth-landing.js` must return to `build.html#submit` resolved from `siteRoot`.

- [ ] **Step 4: Register the shell service worker under the correct scope**

`site.js` must register `sw.js` resolved from `siteRoot`, with the registration scope set to `siteRoot.pathname`.

- [ ] **Step 5: Make the manifest relative**

Use:

```json
{
  "start_url": "./play.html",
  "scope": "./"
}
```

and relative icon sources.

- [ ] **Step 6: Make `sw.js` derive its cache URLs from its own location**

Build the shell URL list from `new URL('./', self.location.href)` so the same file caches root-hosted assets and project-path assets correctly.

- [ ] **Step 7: Re-fetch all modified files and scan for regressions**

Expected: external URLs remain external; internal catalog/auth/PWA paths are deployment-base aware.

### Task 3: Fix the shared V2 return-to-TrainGames link

**Files:**
- Modify: `games/v2-ui.js`

**Interfaces:**
- Consumes: `v2-ui.js` loaded from `<site-root>/games/v2-ui.js`.
- Produces: `.tg2-brand` links that target `<site-root>/play.html`.

- [ ] **Step 1: Derive the site root from `v2-ui.js` itself**

Because the shared script lives one directory below the site root, derive it with:

```js
const siteRoot = new URL('../', document.currentScript.src);
```

- [ ] **Step 2: Rewrite the shared brand link**

When the V2 route bar exists, set its `.tg2-brand` anchor to `new URL('play.html', siteRoot).href`.

- [ ] **Step 3: Spot-check a representative V2 game**

Confirm a file such as `games/crown-jump/v2/index.html` still loads relative V2 assets and its brand link will be corrected by the shared script.

### Task 4: Add TrainGames to the personal-site homepage

**Files:**
- Modify in `davidlifschitz/davidlifschitz.github.io`: `index.html`

**Interfaces:**
- Consumes: the public URL `https://davidlifschitz.github.io/online-board-games/`.
- Produces: one TrainGames product card and one TrainGames surface row.

- [ ] **Step 1: Add a product card in the existing `ia-grid`**

Use the existing card structure and copy:

```html
<a class="ia-card" href="online-board-games/">
  <span>TrainGames — offline subway arcade &amp; prompt playground</span><span class="arrow">→</span>
</a>
```

- [ ] **Step 2: Add a surface row in the existing Surfaces list**

Use:

```html
<a class="surface-row" href="online-board-games/">
  <span>TrainGames — offline subway arcade</span><span class="arrow">→</span>
</a>
```

- [ ] **Step 3: Re-fetch the homepage and verify both links and existing structure**

Expected: both new links point to the GitHub Pages project path and all existing homepage cards/rows remain intact.

### Task 5: Validate and land the changes

**Files:**
- Read: `.github/workflows/frontend-check.yml`
- Read: modified files from Tasks 1–4

**Interfaces:**
- Consumes: feature-branch commits and existing CI.
- Produces: verified commits merged to `main` if checks pass.

- [ ] **Step 1: Run repository validation through the existing GitHub Actions workflow**

Push the implementation branch and inspect the workflow run associated with its commit. Expected: frontend checks pass.

- [ ] **Step 2: Perform a fresh-context self-review**

Review only the requirements, changed files, and validation results. Check project-path routing, root-host compatibility, service-worker scope, OAuth return paths, manifest URLs, and personal-site links.

- [ ] **Step 3: Open and merge the pull request**

Create a PR to `main`, merge only after validation is clean, and record the resulting commit SHA.

- [ ] **Step 4: Verify current Pages state where available**

If repository Pages settings are not exposed by the GitHub connection, do not claim the setting was changed. Report the exact remaining manual setting: Settings → Pages → Deploy from a branch → `main` → `/ (root)` → Save.
