// Astro's import.meta.env.BASE_URL is not guaranteed to end in "/" across
// versions/configs (e.g. base: "/tbi-rust" without a trailing slash yields
// exactly "/tbi-rust", which turns `${base}assets/x.svg` into the broken
// "/tbi-rustassets/x.svg"). Normalize once here and import `base`
// everywhere instead of reading import.meta.env.BASE_URL directly.
export const base: string = import.meta.env.BASE_URL.endsWith("/")
  ? import.meta.env.BASE_URL
  : `${import.meta.env.BASE_URL}/`;
