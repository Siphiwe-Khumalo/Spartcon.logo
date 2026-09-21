/**
 * Multi-breakpoint screenshot capture for design review.
 * Produces a side-by-side comparison sheet per page.
 */
import { chromium } from "playwright";
import sharp from "sharp";
import fs from "node:fs";

const BASE = "http://127.0.0.1:4321";
const OUT = "scripts/review";
fs.mkdirSync(OUT, { recursive: true });

const BREAKPOINTS = [
  { name: "desktop", w: 1600, h: 1000 },
  { name: "laptop", w: 1280, h: 860 },
  { name: "tablet", w: 834, h: 1112 },
  { name: "mobile", w: 390, h: 844 },
];

const PAGES = process.argv[2]
  ? [process.argv[2]]
  : ["/", "/about", "/services", "/facilities-engineering", "/contact"];

const full = process.argv[3] === "full";

const browser = await chromium.launch({
  executablePath: "/usr/local/bin/chrome",
  args: ["--no-sandbox", "--disable-dev-shm-usage"],
});

for (const route of PAGES) {
  const slug = route === "/" ? "home" : route.replace(/\//g, "-").slice(1);
  const shots = [];

  for (const bp of BREAKPOINTS) {
    const page = await browser.newPage({
      viewport: { width: bp.w, height: bp.h },
    });
    await page.goto(BASE + (route === "/" ? "/" : route + "/"), {
      waitUntil: "networkidle",
    });
    await page.evaluate(() => document.fonts.ready);

    if (full) {
      await page.evaluate(async () => {
        document.documentElement.style.scrollBehavior = "auto";
        const step = window.innerHeight * 0.7;
        for (let y = 0; y < document.body.scrollHeight; y += step) {
          window.scrollTo(0, y);
          await new Promise((r) => setTimeout(r, 110));
        }
        window.scrollTo(0, 0);
        await new Promise((r) => setTimeout(r, 400));
      });
    }
    await page.waitForTimeout(700);

    const buf = await page.screenshot({ fullPage: full });
    const file = `${OUT}/${slug}-${bp.name}.png`;
    fs.writeFileSync(file, buf);
    shots.push({ file, bp });
    await page.close();
  }

  // Comparison sheet: scale each viewport to a common height.
  const H = 760;
  const tiles = [];
  let x = 0;
  for (const s of shots) {
    const t = await sharp(s.file)
      .resize({ height: H, fit: "inside", withoutEnlargement: false })
      .jpeg({ quality: 76 })
      .toBuffer();
    const m = await sharp(t).metadata();
    tiles.push({ input: t, left: x, top: 0 });
    x += (m.width ?? 0) + 8;
  }

  await sharp({
    create: { width: x, height: H, channels: 3, background: { r: 60, g: 66, b: 78 } },
  })
    .composite(tiles)
    .jpeg({ quality: 80 })
    .toFile(`${OUT}/sheet-${slug}.jpg`);

  console.log(
    `sheet-${slug}.jpg  [${BREAKPOINTS.map((b) => `${b.name} ${b.w}`).join(" | ")}]`
  );
}

await browser.close();
