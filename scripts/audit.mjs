/**
 * Site audit: link integrity, accessibility basics, console errors.
 * Crawls every built page and reports problems.
 */
import { chromium } from "playwright";
import fs from "node:fs";

const BASE = "http://127.0.0.1:4321";

/** Every built route, derived from the dist directory. */
const routes = [];
const walk = (dir, prefix = "") => {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.isDirectory()) walk(`${dir}/${e.name}`, `${prefix}/${e.name}`);
    else if (e.name === "index.html") routes.push(prefix || "/");
  }
};
walk("dist");
routes.sort();

const browser = await chromium.launch({
  executablePath: "/usr/local/bin/chrome",
  args: ["--no-sandbox", "--disable-dev-shm-usage"],
});
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

const problems = [];
const allInternalLinks = new Set();
const validRoutes = new Set(routes);

console.log(`Auditing ${routes.length} routes\n`);

for (const route of routes) {
  const consoleErrors = [];
  const reqFails = [];
  page.removeAllListeners("console");
  page.removeAllListeners("pageerror");
  page.removeAllListeners("requestfailed");
  page.on("console", (m) => m.type() === "error" && consoleErrors.push(m.text()));
  page.on("pageerror", (e) => consoleErrors.push(`JS: ${e.message}`));
  page.on("requestfailed", (r) =>
    reqFails.push(`${r.url().replace(BASE, "")} ${r.failure()?.errorText}`)
  );

  const url = BASE + (route === "/" ? "/" : route + "/");
  const res = await page.goto(url, { waitUntil: "networkidle", timeout: 40000 });

  if (!res || res.status() >= 400) {
    problems.push(`${route}: HTTP ${res?.status()}`);
    continue;
  }

  // Scroll the full page so scroll-reveals fire and lazy images load. Anything
  // still hidden afterwards is genuinely stranded content.
  await page.evaluate(async () => {
    // The site sets `scroll-behavior: smooth`, which makes programmatic
    // scrolling animate and lag behind this loop. Disable it for the audit so
    // we measure real positions rather than mid-animation ones.
    document.documentElement.style.scrollBehavior = "auto";
    const step = window.innerHeight * 0.6;
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 70));
    }
    window.scrollTo(0, 0);
    await new Promise((r) => setTimeout(r, 250));
  });

  const report = await page.evaluate(() => {
    const out = { links: [], issues: [] };

    // Internal links
    document.querySelectorAll("a[href]").forEach((a) => {
      const href = a.getAttribute("href");
      if (!href) return;
      if (/^(https?:|mailto:|tel:|#)/.test(href)) return;
      out.links.push(href);
      if (!a.textContent.trim() && !a.getAttribute("aria-label")) {
        out.issues.push(`link with no accessible name -> ${href}`);
      }
    });

    // Images without alt
    document.querySelectorAll("img").forEach((img) => {
      if (!img.hasAttribute("alt")) {
        out.issues.push(`img missing alt: ${(img.currentSrc || img.src).slice(-50)}`);
      }
    });

    // Exactly one h1
    const h1s = document.querySelectorAll("h1");
    if (h1s.length !== 1) out.issues.push(`${h1s.length} <h1> elements`);

    // Heading level jumps
    const heads = [...document.querySelectorAll("h1,h2,h3,h4,h5,h6")];
    let prev = 0;
    for (const h of heads) {
      const lvl = Number(h.tagName[1]);
      if (prev && lvl > prev + 1) {
        out.issues.push(
          `heading jump h${prev} -> h${lvl}: "${h.textContent.trim().slice(0, 40)}"`
        );
      }
      prev = lvl;
    }

    // Title + meta description
    if (!document.title) out.issues.push("no <title>");
    const desc = document.querySelector('meta[name="description"]');
    if (!desc?.getAttribute("content")) out.issues.push("no meta description");
    if (!document.querySelector('link[rel="canonical"]'))
      out.issues.push("no canonical");
    if (!document.querySelector('meta[property="og:image"]'))
      out.issues.push("no og:image");

    // Form labels
    document.querySelectorAll("input,select,textarea").forEach((el) => {
      if (el.type === "hidden") return;
      const id = el.id;
      const labelled =
        (id && document.querySelector(`label[for="${id}"]`)) ||
        el.getAttribute("aria-label") ||
        el.closest("label");
      if (!labelled) out.issues.push(`unlabelled control: ${el.name || el.tagName}`);
    });

    // Content stranded by the reveal system after a full scroll-through
    const stuck = [...document.querySelectorAll("[data-reveal],[data-reveal-lines]")]
      .filter((e) => !e.classList.contains("is-visible")).length;
    if (stuck) out.issues.push(`${stuck} reveal elements STRANDED after scroll`);

    // Colour contrast spot-check on body copy against its background.
    const parseRgb = (s) => (s.match(/[\d.]+/g) || []).slice(0, 3).map(Number);

    /** Parse to {r,g,b,a}; alpha defaults to 1. */
    const parseRgba = (s) => {
      const m = (s || "").match(/[\d.]+/g);
      if (!m || m.length < 3) return null;
      const [r, g, b, a] = m.map(Number);
      return { r, g, b, a: a === undefined ? 1 : a };
    };

    const lum = (rgb) => {
      const a = rgb.map((v) => {
        const c = v / 255;
        return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
      });
      return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2];
    };

    /**
     * Effective background behind an element, compositing translucent layers.
     *
     * Treating a translucent layer as opaque produces wildly wrong ratios — a
     * 4%-white panel over navy would be read as near-white, flagging perfectly
     * legible light text as a failure.
     */
    const bgOf = (el) => {
      const layers = [];
      let n = el;
      while (n && n !== document.documentElement) {
        const c = parseRgba(getComputedStyle(n).backgroundColor);
        if (c && c.a > 0) {
          layers.push(c);
          if (c.a >= 1) break;
        }
        n = n.parentElement;
      }
      layers.push({ r: 255, g: 255, b: 255, a: 1 }); // page default

      let out = layers[layers.length - 1];
      for (let i = layers.length - 2; i >= 0; i--) {
        const top = layers[i];
        out = {
          r: top.r * top.a + out.r * (1 - top.a),
          g: top.g * top.a + out.g * (1 - top.a),
          b: top.b * top.a + out.b * (1 - top.a),
          a: 1,
        };
      }
      return [out.r, out.g, out.b];
    };

    /**
     * The navigation deliberately sits transparent over a dark hero photograph
     * with a scrim, so its white text has no CSS background to measure against.
     * Contrast there is a function of the image, not the stylesheet — skip it
     * rather than report a meaningless 1:1.
     */
    const overHeroPhoto = (el) => {
      const nav = el.closest("[data-nav]");
      return (
        !!nav &&
        nav.dataset.navTransparent === "true" &&
        nav.dataset.navScrolled !== "true"
      );
    };
    const contrast = (fg, bg) => {
      const l1 = lum(fg);
      const l2 = lum(bg);
      return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
    };

    /* Body copy, links and — critically — form controls. Links and inputs were
       previously excluded, which let two invisible-text bugs ship: white
       fields on a white section, and navy footer links on navy. */
    const sample = [
      ...document.querySelectorAll(
        "p, li, dd, .t-body, .t-sm, a, input, select, textarea, address, button"
      ),
    ]
      .filter((e) => {
        if (e.type === "hidden") return false;
        const r = e.getBoundingClientRect();
        if (r.width < 4 || r.height < 4) return false;
        const cs = getComputedStyle(e);
        if (cs.visibility === "hidden" || cs.display === "none") return false;
        // Form controls count even when empty — the user will type into them.
        const isField = /^(INPUT|SELECT|TEXTAREA)$/.test(e.tagName);
        return isField || e.textContent.trim().length > 2;
      })
      .slice(0, 160);

    for (const el of sample) {
      if (overHeroPhoto(el)) continue;

      const cs = getComputedStyle(el);
      const fg = parseRgb(cs.color);
      if (fg.length !== 3) continue;

      // bgOf composites the element's own background along with its ancestors,
      // so translucent panels resolve correctly.
      const bg = bgOf(el);

      const ratio = contrast(fg, bg);
      const size = parseFloat(cs.fontSize);
      const bold = Number(cs.fontWeight) >= 700;
      const large = size >= 24 || (size >= 18.66 && bold);
      const min = large ? 3 : 4.5;

      if (ratio < min) {
        const label = /^(INPUT|SELECT|TEXTAREA)$/.test(el.tagName)
          ? `${el.tagName.toLowerCase()}[name=${el.name || "?"}]`
          : `"${el.textContent.trim().slice(0, 30)}"`;
        out.issues.push(
          `contrast ${ratio.toFixed(2)}:1 (needs ${min}) ${size}px ${el.tagName} ${label}`
        );
      }

      // A control whose border is invisible against its surroundings gives the
      // user no affordance, even if its text would be legible once typed.
      if (/^(INPUT|SELECT|TEXTAREA)$/.test(el.tagName)) {
        const border = parseRgb(cs.borderTopColor);
        const surround = bgOf(el.parentElement ?? el);
        if (border.length === 3 && contrast(border, surround) < 1.25) {
          out.issues.push(
            `invisible field border on ${el.tagName.toLowerCase()}[name=${
              el.name || "?"
            }]`
          );
        }
      }
    }

    return out;
  });

  report.links.forEach((l) => allInternalLinks.add(l.split("#")[0] || route));
  report.issues.forEach((i) => problems.push(`${route}: ${i}`));
  consoleErrors.forEach((e) => problems.push(`${route}: CONSOLE ${e}`));
  reqFails.forEach((e) => problems.push(`${route}: REQFAIL ${e}`));

  process.stdout.write(
    `  ${report.issues.length || consoleErrors.length ? "!" : "."}`
  );
}

console.log("\n");

// Validate every internal link target exists
const broken = [];
for (const link of allInternalLinks) {
  if (!link || link.startsWith("http")) continue;
  const clean = link.replace(/\/$/, "") || "/";
  if (!validRoutes.has(clean)) broken.push(link);
}

if (broken.length) {
  console.log("BROKEN INTERNAL LINKS:");
  broken.sort().forEach((b) => console.log("  " + b));
  console.log();
}

if (problems.length) {
  console.log(`ISSUES (${problems.length}):`);
  problems.forEach((p) => console.log("  " + p));
} else {
  console.log("No issues found.");
}

console.log(`\nRoutes: ${routes.length}`);
await browser.close();
