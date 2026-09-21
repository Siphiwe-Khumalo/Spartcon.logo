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
    const parseRgb = (s) => (s.match(/\d+/g) || []).slice(0, 3).map(Number);
    const lum = (rgb) => {
      const a = rgb.map((v) => {
        const c = v / 255;
        return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
      });
      return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2];
    };
    const bgOf = (el) => {
      let n = el;
      while (n && n !== document.documentElement) {
        const bg = getComputedStyle(n).backgroundColor;
        const rgb = parseRgb(bg);
        if (rgb.length === 3 && !/rgba\(0, 0, 0, 0\)|transparent/.test(bg))
          return rgb;
        n = n.parentElement;
      }
      return [255, 255, 255];
    };
    const sample = [...document.querySelectorAll("p, li, dd, .t-body, .t-sm")]
      .filter((e) => e.textContent.trim().length > 25)
      .slice(0, 40);
    for (const el of sample) {
      const cs = getComputedStyle(el);
      const fg = parseRgb(cs.color);
      if (fg.length !== 3) continue;
      const bg = bgOf(el);
      const l1 = lum(fg);
      const l2 = lum(bg);
      const ratio =
        (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
      const size = parseFloat(cs.fontSize);
      const bold = Number(cs.fontWeight) >= 700;
      const large = size >= 24 || (size >= 18.66 && bold);
      const min = large ? 3 : 4.5;
      if (ratio < min) {
        out.issues.push(
          `contrast ${ratio.toFixed(2)}:1 (needs ${min}) ${size}px "${el.textContent
            .trim()
            .slice(0, 32)}"`
        );
        break; // one report per page is enough to flag it
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
