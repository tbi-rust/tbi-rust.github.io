import { defineConfig } from "astro/config";

// Fully static build (Astro's default) — no SSR adapter, no client-side
// framework. Deploy the contents of dist/ to any static host (GitHub
// Pages, Netlify, Cloudflare Pages, etc).
export default defineConfig({
  site: "https://tbi-rust.github.io",
  base: "/",
  output: "static",
  trailingSlash: "ignore",
});
