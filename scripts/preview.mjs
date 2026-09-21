/**
 * Renders full-page previews of the site to /projects/sandbox/preview/ so the
 * whole thing can be reviewed without a deployment.
 */
import { chromium } from "playwright";
import sharp from "sharp";
import fs from "node:fs";

const BASE = "http://127.0.0.1:4321";
const OUT = "/projects/sandbox/preview";
fs.mkdirSync(OUT, { recursive: true });

const DESKTOP = [
  ["/", "01-home"],
  ["/about", "02-about"],
  ["/services", "03-services"],
  ["/services/building-construction", "04-service-building-construction"],
  ["/industries", "05-industries"],
  ["/capabilities", "06-capabilities"],
  ["/credentials", "07-credentials"],
  ["/projects", "08-projects"],
  ["/contact", "09-contact"],
  ["/facilities-engineering", "10-spartcon-tech"],
  ["/facilities-engineering/building-systems", "11-tech-building-systems"],
  ["/facilities-engineering/maintenance-operations", "12-tech-maintenance"],
  ["/facilities-engineering/maintenance-management", "13-tech-maint-management"],
  ["/facilities-engineering/energy-utilities", "14-tech-energy"],
  ["/facilities-engineering/contact", "15-tech-contact"],
  ["/image-credits", "16-image-credits"],
];

const MOBILE = [
  ["/", "m01-home"],
  ["/facilities-engineering", "m02-spartcon-tech"],
  ["/contact", "m03-contact"],
];

const browser = await chromium.launch({
  executablePath: "/usr/local/bin/chrome",
  args: ["--no-sandbox", "--disable-dev-shm-usage"],
});

async function shoot(route, label, width, height, outWidth) {
  const page = await browser.newPage({ viewport: { width, height } });
  await page.goto(BASE + (route === "/" ? "/" : route + "/"), {
    waitUntil: "networkidle",
    timeout: 45000,
  });
  await page.evaluate(() => document.fonts.ready);

  // Scroll through so every reveal fires and lazy images load.
  await page.evaluate(async () => {
    document.documentElement.style.scrollBehavior = "auto";
    const step = window.innerHeight * 0.7;
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 110));
    }
    window.scrollTo(0, 0);
    await new Promise((r) => setTimeout(r, 450));
  });
  await page.waitForTimeout(500);

  const buf = await page.screenshot({ fullPage: true });
  await page.close();

  await sharp(buf)
    .resize({ width: outWidth })
    .jpeg({ quality: 72, mozjpeg: true })
    .toFile(`${OUT}/${label}.jpg`);

  const kb = Math.round(fs.statSync(`${OUT}/${label}.jpg`).size / 1024);
  console.log(`  ${label}.jpg  (${kb} KB)`);
}

console.log("Desktop (1440px):");
for (const [route, label] of DESKTOP) {
  await shoot(route, label, 1440, 900, 1300);
}

console.log("Mobile (390px):");
for (const [route, label] of MOBILE) {
  await shoot(route, label, 390, 844, 420);
}

await browser.close();
console.log(`\n${DESKTOP.length + MOBILE.length} previews -> ${OUT}`);
