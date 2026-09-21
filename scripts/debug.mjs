import { chromium } from "playwright";

const browser = await chromium.launch({
  executablePath: "/usr/local/bin/chrome",
  args: ["--no-sandbox", "--disable-dev-shm-usage"],
});
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
page.on("pageerror", (e) => console.log("PAGEERROR:", e.message));
page.on("console", (m) => m.type() === "error" && console.log("CONSOLE:", m.text()));

await page.goto("http://127.0.0.1:4321" + (process.argv[2] || "/index.html"), {
  waitUntil: "networkidle",
});

// Scroll through so observers fire.
await page.evaluate(async () => {
  const step = window.innerHeight * 0.7;
  for (let y = 0; y < document.body.scrollHeight; y += step) {
    window.scrollTo(0, y);
    await new Promise((r) => setTimeout(r, 90));
  }
});
await page.waitForTimeout(800);

const report = await page.evaluate(() => {
  const all = [...document.querySelectorAll("[data-reveal],[data-reveal-lines]")];
  const hidden = all.filter((el) => !el.classList.contains("is-visible"));
  const imgs = [...document.querySelectorAll("img")];
  const brokenImgs = imgs
    .filter((i) => !i.complete || i.naturalWidth === 0)
    .map((i) => i.currentSrc || i.src);
  return {
    htmlClass: document.documentElement.className,
    revealTotal: all.length,
    revealHidden: hidden.length,
    hiddenSample: hidden.slice(0, 8).map((el) => ({
      tag: el.tagName,
      cls: el.className.toString().slice(0, 70),
      reveal: el.getAttribute("data-reveal"),
      rectTop: Math.round(el.getBoundingClientRect().top),
      h: Math.round(el.getBoundingClientRect().height),
    })),
    imgCount: imgs.length,
    brokenImgs,
    // Is the intro media element present and what does it compute to?
    intro: (() => {
      const f = document.querySelector(".intro__media .media__frame");
      if (!f) return "NO .intro__media .media__frame";
      const cs = getComputedStyle(f);
      const img = f.querySelector("img");
      return {
        cls: f.className,
        clip: cs.clipPath,
        h: Math.round(f.getBoundingClientRect().height),
        w: Math.round(f.getBoundingClientRect().width),
        imgSrc: img?.currentSrc?.slice(-45),
        imgNatural: img ? `${img.naturalWidth}x${img.naturalHeight}` : null,
        imgTransform: img ? getComputedStyle(img).transform : null,
        imgH: img ? Math.round(img.getBoundingClientRect().height) : null,
      };
    })(),
  };
});

console.log(JSON.stringify(report, null, 1));
await browser.close();
