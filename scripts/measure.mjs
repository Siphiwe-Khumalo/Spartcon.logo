import { chromium } from "playwright";
const b = await chromium.launch({executablePath:"/usr/local/bin/chrome", args:["--no-sandbox","--disable-dev-shm-usage"]});
const p = await b.newPage({viewport:{width:1200,height:800}});
await p.goto("http://127.0.0.1:4321/",{waitUntil:"networkidle"});
await p.evaluate(()=>document.fonts.ready);
await p.waitForTimeout(400);
console.log(JSON.stringify(await p.evaluate(()=>{
  const l = document.querySelector(".foot__brand .logo");
  const mark = l.querySelector(".logo__mark").getBoundingClientRect();
  const word = l.querySelector(".logo__wordmark").getBoundingClientRect();
  const cs = getComputedStyle(l.querySelector(".logo__wordmark"));
  return {
    markW: +mark.width.toFixed(1), markH: +mark.height.toFixed(1),
    wordW: +word.width.toFixed(1), wordH: +word.height.toFixed(1),
    fontSize: cs.fontSize, fontFamily: cs.fontFamily.split(",")[0],
    ratioMarkToWord: +(mark.width/word.width).toFixed(3),
    targetRatio: 0.91,
    suggestedMarkHeightEm: +((0.91*word.width)/(mark.width/mark.height)/parseFloat(cs.fontSize)).toFixed(3),
  };
}),null,1));
await b.close();
