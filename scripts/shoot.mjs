/**
 * Screenshot harness for design review.
 *
 * Usage: node scripts/shoot.mjs <path> <label> [width] [height] [full]
 * Screenshots land in scripts/review/ for inspection.
 */
import { chromium } from "playwright";
import fs from "node:fs";

const [, , route = "/", label = "shot", w = "1440", h = "900", full = "false"] =
  process.argv;

fs.mkdirSync("scripts/review", { recursive: true });

const browser = await chromium.launch({
  executablePath: "/usr/local/bin/chrome",
  args: ["--no-sandbox", "--disable-dev-shm-usage"],
});

const page = await browser.newPage({
  viewport: { width: Number(w), height: Number(h) },
  deviceScaleFactor: 1,
});

const errors = [];
page.on("console", (m) => {
  if (m.type() === "error") errors.push(m.text());
});
page.on("pageerror", (e) => errors.push(`PAGEERROR: ${e.message}`));
page.on("requestfailed", (r) =>
  errors.push(`REQFAIL ${r.url().slice(-70)} ${r.failure()?.errorText}`)
);

const url = `http://127.0.0.1:4321${route}`;
const res = await page.goto(url, { waitUntil: "networkidle", timeout: 45000 });
console.log(`${res?.status()} ${url}`);

// Let fonts settle and reveal animations finish.
await page.evaluate(() => document.fonts.ready);

if (full === "true") {
  // Scroll the page so lazy images and scroll-reveals trigger before capture.
  await page.evaluate(async () => {
    const step = window.innerHeight * 0.8;
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 120));
    }
    window.scrollTo(0, 0);
    await new Promise((r) => setTimeout(r, 400));
  });
}

await page.waitForTimeout(900);

const path = `scripts/review/${label}.png`;
await page.screenshot({ path, fullPage: full === "true" });
console.log(`-> ${path}`);

if (errors.length) {
  console.log("\nCONSOLE/NETWORK ISSUES:");
  [...new Set(errors)].slice(0, 25).forEach((e) => console.log("  " + e));
} else {
  console.log("no console or network errors");
}

await browser.close();
