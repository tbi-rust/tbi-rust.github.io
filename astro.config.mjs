import { defineConfig } from "astro/config";
import { ViteWebfontDownload } from "vite-plugin-webfont-dl";

// Fully static build (Astro's default) — no SSR adapter, no client-side
// framework. Deploy the contents of dist/ to any static host (GitHub
// Pages, Netlify, Cloudflare Pages, etc).
export default defineConfig({
  site: "https://github.io",
  base: "/",
  output: "static",
  trailingSlash: "ignore",
  vite: {
    plugins: [
      ViteWebfontDownload([
        "https://fonts.googleapis.com/css2?family=Source+Sans+3:ital,wght@0,400;0,600;0,700;1,400&family=Source+Serif+4:ital,wght@0,400;1,400&family=IBM+Plex+Mono&display=swap"
      ])
    ]
  }
});