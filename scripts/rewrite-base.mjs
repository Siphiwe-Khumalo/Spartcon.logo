/**
 * Rewrites root-absolute links in the built HTML to sit under a base path.
 *
 * WHY THIS EXISTS
 * Astro's `base` option prefixes the assets Astro itself emits (CSS, JS,
 * optimised images), but it does NOT touch hand-written root-absolute
 * attributes like href="/about". On a root-domain deployment that is exactly
 * what we want. On a subpath deployment — GitHub Pages serving a project repo
 * from /<repo>/ — every one of those links would 404.
 *
 * Rather than thread a base-aware helper through 111 link sites (and make the
 * source worse for the production root-domain case), this runs once after the
 * build and only when a base path is actually in play.
 *
 * Usage:  SITE_BASE=/Spartcon.logo node scripts/rewrite-base.mjs
 * With no SITE_BASE, or SITE_BASE=/, it exits without touching anything.
 */
import fs from "node:fs";
import path from "node:path";

const raw = process.env.SITE_BASE || "/";
const base = "/" + raw.replace(/^\/+|\/+$/g, "");

if (base === "/") {
  console.log("[rewrite-base] no SITE_BASE set — nothing to do");
  process.exit(0);
}

const DIST = "dist";

/** Attributes that can carry a root-absolute URL we need to prefix. */
const ATTRS = ["href", "src", "action", "content", "srcset"];

/**
 * True when a URL should be left alone:
 *   already under the base, external, protocol-relative, or a non-path scheme.
 */
const skip = (url) =>
  !url.startsWith("/") ||
  url.startsWith("//") ||
  url.startsWith(base + "/") ||
  url === base;

function rewriteAttr(html, attr) {
  // Matches attr="/…" — single path values only.
  const re = new RegExp(`(\\s${attr}=")(/[^"]*)(")`, "g");
  return html.replace(re, (m, pre, url, post) =>
    skip(url) ? m : `${pre}${base}${url}${post}`
  );
}

function rewriteSrcset(html) {
  // srcset holds a comma-separated list of "url descriptor" pairs.
  return html.replace(/(\ssrcset=")([^"]+)(")/g, (m, pre, value, post) => {
    const out = value
      .split(",")
      .map((part) => {
        const t = part.trim();
        if (!t) return t;
        const [url, ...rest] = t.split(/\s+/);
        if (skip(url)) return t;
        return [base + url, ...rest].join(" ");
      })
      .join(", ");
    return `${pre}${out}${post}`;
  });
}

/** Absolute URLs inside inline JSON-LD (Organization, BreadcrumbList). */
function rewriteJsonLd(html) {
  return html.replace(
    /(<script[^>]*application\/ld\+json[^>]*>)([\s\S]*?)(<\/script>)/g,
    (m, open, body, close) => {
      const fixed = body.replace(/"(\/(?!\/)[^"]*)"/g, (mm, url) =>
        skip(url) ? mm : `"${base}${url}"`
      );
      return `${open}${fixed}${close}`;
    }
  );
}

let files = 0;
let changed = 0;

const walk = (dir) => {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(full);
      continue;
    }
    if (!/\.(html|xml)$/i.test(entry.name)) continue;

    files++;
    const original = fs.readFileSync(full, "utf8");
    let html = original;

    for (const attr of ATTRS) {
      if (attr === "srcset") continue;
      html = rewriteAttr(html, attr);
    }
    html = rewriteSrcset(html);
    html = rewriteJsonLd(html);

    if (html !== original) {
      fs.writeFileSync(full, html);
      changed++;
    }
  }
};

if (!fs.existsSync(DIST)) {
  console.error(`[rewrite-base] ${DIST}/ not found — run the build first`);
  process.exit(1);
}

walk(DIST);
console.log(`[rewrite-base] base="${base}" — ${changed}/${files} files rewritten`);
