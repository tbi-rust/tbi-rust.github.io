# Tor Browser Installer — website

Static marketing/docs site for the [Tor Browser Installer](https://github.com/reality-prod/tbi-rust)
app, built with [Astro](https://astro.build) in static-output mode. No client
framework, no server — just HTML/CSS shipped from `dist/` after build.

Visual language follows the Tor Project's own [style guide](https://styleguide.torproject.org/visuals/)
(Purple `#7D4698`, Dark Purple `#59316B`, Green `#68B030`, Grey `#F8F9FA`,
Source Sans / Source Serif type) combined with this app's own purple gradient
and palette from `src/main.rs`'s `mod palette`, so the site and the app read
as the same product.

## Develop

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview   # sanity-check the static output locally
```

Output lands in `dist/` — upload that folder to any static host (GitHub
Pages, Netlify, Cloudflare Pages, S3, etc).

## Deploy to GitHub Pages

A ready-to-go workflow lives at `.github/workflows/deploy-site.yml`. It
assumes this `site/` folder sits inside the same repository as the Rust app
(one repo, `main.rs` at the root and this site under `site/`). To use it:

1. Push this repo to GitHub if it isn't already there.
2. In the repo, go to **Settings → Pages → Build and deployment → Source**
   and choose **GitHub Actions**.
3. Edit `astro.config.mjs` — set `site` to `https://<your-username>.github.io`
   and `base` to `/<your-repo-name>` (a leading slash, no trailing one).
   If you're publishing to a **user/org page** (`<username>.github.io`) or a
   **custom domain** instead of a project page, set `base: "/"` and drop the
   repo name.
4. Push to `master` or `main` — the workflow builds and deploys automatically
   on any change under `site/`. You can also trigger it manually from the
   Actions tab (`workflow_dispatch`).

If you'd rather keep the site in its own separate repository instead of a
`site/` subfolder, edit `.github/workflows/deploy-site.yml` and change
`path: site` to `path: .`, and move this folder's contents to that repo's
root.

## Structure

```
src/
├── layouts/Layout.astro       # <head>, fonts, nav + footer shell
├── components/
│   ├── Nav.astro / Footer.astro / BetaBanner.astro
│   ├── Icon.astro             # inlines the app's own icon set
│   ├── AppMockCard.astro      # recreation of the app's Confirm Install screen
│   ├── FeatureGrid.astro
│   ├── PipelineSteps.astro    # mirrors AppState in main.rs
│   └── PlatformCards.astro
└── pages/
    ├── index.astro
    ├── install.astro
    ├── security.astro
    └── about.astro
```

This site is documentation for beta software — keep the beta notice
(`BetaBanner.astro`) visible on every page it's added to.
