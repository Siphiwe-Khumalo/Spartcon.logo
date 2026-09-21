import { chromium } from "playwright";
const b = await chromium.launch({ executablePath:"/usr/local/bin/chrome", args:["--no-sandbox","--disable-dev-shm-usage"] });
const p = await b.newPage({ viewport:{width:1440,height:900} });
await p.goto("http://127.0.0.1:4321/index.html",{waitUntil:"networkidle"});
await p.evaluate(async()=>{const s=innerHeight*0.6;for(let y=0;y<document.body.scrollHeight;y+=s){scrollTo(0,y);await new Promise(r=>setTimeout(r,110));}});
await p.waitForTimeout(700);
console.log(JSON.stringify(await p.evaluate(()=>{
  const hidden=[...document.querySelectorAll("[data-reveal],[data-reveal-lines]")].filter(e=>!e.classList.contains("is-visible"));
  return hidden.map(e=>({
    cls:e.className.toString().slice(0,50),
    reveal:e.getAttribute("data-reveal"),
    rendered: e.offsetParent!==null,
    display: getComputedStyle(e).display,
    parentChain: (()=>{let c=[],n=e.parentElement,i=0;while(n&&i++<4){c.push(n.className.toString().split(" ")[0]||n.tagName);n=n.parentElement;}return c.join(" < ");})(),
  }));
}),null,1));
await b.close();
