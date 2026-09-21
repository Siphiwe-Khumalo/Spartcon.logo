import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

/**
 * Spartcon (Pty) Ltd — website build configuration.
 *
 * `site` is used for canonical URLs, Open Graph URLs, the generated sitemap
 * and robots.txt. Update this to the live production domain before deployment.
 */
/**
 * `site` and `base` are overridable by environment variables so the same
 * source can be deployed either at a domain root (the production case) or at a
 * subpath such as GitHub Pages' /<repo>/ (the preview case).
 *
 *   SITE_URL   full origin, e.g. https://siphiwe-khumalo.github.io
 *   SITE_BASE  subpath,     e.g. /Spartcon.logo
 *
 * Neither is needed for local development or a root-domain deployment.
 */
export default defineConfig({
  site: process.env.SITE_URL || "https://www.spartcon.co.za",
  base: process.env.SITE_BASE || "/",
  trailingSlash: "never",
  build: {
    format: "directory",
    inlineStylesheets: "auto",
  },
  integrations: [
    sitemap({
      filter: (page) =>
        !page.includes("/404") && !page.includes("/thank-you"),
      changefreq: "monthly",
      priority: 0.7,
      lastmod: new Date(),
    }),
  ],
  image: {
    // Local images only — no remote image domains are required at build time.
    responsiveStyles: true,
    layout: "constrained",
  },
  vite: {
    build: {
      cssCodeSplit: true,
      assetsInlineLimit: 2048,
    },
  },
});
