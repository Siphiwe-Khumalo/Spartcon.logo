import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

/**
 * Spartcon (Pty) Ltd — website build configuration.
 *
 * `site` is used for canonical URLs, Open Graph URLs, the generated sitemap
 * and robots.txt. Update this to the live production domain before deployment.
 */
export default defineConfig({
  site: "https://www.spartcon.co.za",
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
