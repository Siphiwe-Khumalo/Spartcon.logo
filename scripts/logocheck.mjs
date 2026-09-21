import { chromium } from "playwright";
import sharp from "sharp";
const b = await chromium.launch({executablePath:"/usr/local/bin/chrome", args:["--no-sandbox","--disable-dev-shm-usage"]});
const p = await b.newPage({viewport:{width:900,height:400}});
await p.goto("http://127.0.0.1:4321/facilities-engineering/",{waitUntil:"networkidle"});
await p.evaluate(()=>document.fonts.ready);
await p.waitForTimeout(500);
// Capture the big inverted stacked lockup in the Spartcon Tech hero
const el = await p.$(".thero__lockup .logo");
await el.screenshot({path:"scripts/review/logo-live.png"});
// And the navy footer Spartcon lockup
await p.goto("http://127.0.0.1:4321/",{waitUntil:"networkidle"});
await p.evaluate(()=>document.fonts.ready);
await p.waitForTimeout(400);
const f = await p.$(".foot__brand .logo");
await f.screenshot({path:"scripts/review/logo-foot.png"});
console.log("captured");
await b.close();

// Build comparison: official artwork on top, our render below
const official = await sharp("/projects/sandbox/Spartcon.logo/Screenshot_2026-09-17-18-47-30-387_com.mi.globalbrowser~2.jpg")
  .resize({width:560}).toBuffer();
const ours = await sharp("scripts/review/logo-foot.png")
  .resize({width:560, fit:"contain", background:{r:16,g:26,b:48}}).toBuffer();
const om = await sharp(official).metadata();
const nm = await sharp(ours).metadata();
await sharp({create:{width:580, height:om.height+nm.height+30, channels:3, background:{r:16,g:26,b:48}}})
  .composite([{input:official,left:10,top:5},{input:ours,left:10,top:om.height+20}])
  .jpeg({quality:88}).toFile("scripts/review/logo-compare.jpg");
console.log("compare sheet: official (top) vs ours (bottom)");
