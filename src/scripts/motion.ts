/**
 * MOTION LAYER
 *
 * One small module powers every scroll-driven effect on the site. No animation
 * library is loaded — this is ~3KB of IntersectionObserver plus a single rAF
 * loop shared by all parallax and progress elements.
 *
 * Principles
 *   - Everything is opt-in via data attributes.
 *   - Reduced motion short-circuits the whole module; content shows immediately.
 *   - Transforms and opacity only, so effects stay on the compositor.
 *   - Observers disconnect once an element has revealed; nothing accumulates.
 *
 * Attributes
 *   data-reveal="up|fade|left|right|scale|mask"  reveal on entry
 *   data-reveal-lines                            line-by-line text reveal
 *   data-reveal-group                            staggers direct children
 *   data-parallax="0.08"                         subtle vertical drift
 *   data-count-to="12"                           counts up to a number
 *   data-progress-track                          writes 0–1 scroll progress
 */

const REDUCED = matchMedia("(prefers-reduced-motion: reduce)");

export function initMotion(): void {
  document.documentElement.classList.remove("no-js");

  if (REDUCED.matches) {
    // Show everything, bind nothing.
    document
      .querySelectorAll<HTMLElement>("[data-reveal],[data-reveal-lines]")
      .forEach((el) => el.classList.add("is-visible"));
    document
      .querySelectorAll<HTMLElement>("[data-count-to]")
      .forEach((el) => (el.textContent = el.dataset.countTo ?? el.textContent));
    return;
  }

  // Order matters: stagger groups stamp `data-reveal` onto their children, so
  // they must run before initReveals() collects the elements to observe.
  initStaggerGroups();
  initReveals();
  initCounters();
  initScrollEffects();
}

/* ------------------------------------------------------------------ reveals */

function initReveals(): void {
  const targets = [
    ...document.querySelectorAll<HTMLElement>("[data-reveal],[data-reveal-lines]"),
  ];
  if (!targets.length) return;

  /** Elements still waiting to be revealed. */
  const pending = new Set<HTMLElement>();

  const reveal = (el: HTMLElement) => {
    el.classList.add("is-visible");
    pending.delete(el);
    io.unobserve(el);
  };

  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) reveal(entry.target as HTMLElement);
      }
    },
    {
      // Fire slightly before the element reaches the viewport edge, so the
      // motion completes as it settles into view rather than after.
      rootMargin: "0px 0px -12% 0px",
      threshold: 0.08,
    }
  );

  /**
   * Safety sweep.
   *
   * IntersectionObserver only reports what it samples. A fast wheel scroll or a
   * mobile fling can carry an element from below the viewport to above it
   * between two samples, so the observer never sees it intersect and the
   * element would stay hidden permanently.
   *
   * This sweep reveals anything that has reached or passed the reveal line,
   * which makes stranded content impossible. It also covers elements that are
   * not rendered (inside a `display:none` panel) — there is nothing to animate,
   * so they are simply shown.
   */
  const sweep = () => {
    if (!pending.size) {
      removeEventListener("scroll", onScroll);
      removeEventListener("resize", sweep);
      return;
    }
    const line = innerHeight * 0.92;
    for (const el of [...pending]) {
      if (el.offsetParent === null && el.getClientRects().length === 0) {
        reveal(el);
        continue;
      }
      if (el.getBoundingClientRect().top < line) reveal(el);
    }
  };

  let raf = 0;
  const onScroll = () => {
    if (!raf) {
      raf = requestAnimationFrame(() => {
        raf = 0;
        sweep();
      });
    }
  };

  for (const el of targets) {
    pending.add(el);
    io.observe(el);
  }

  // Reveal whatever is already in view on load, with no flash of hidden content.
  sweep();
  addEventListener("scroll", onScroll, { passive: true });
  addEventListener("resize", sweep, { passive: true });
}

/**
 * Staggers the direct children of a group, so markup doesn't need per-item
 * inline delays.
 */
function initStaggerGroups(): void {
  document
    .querySelectorAll<HTMLElement>("[data-reveal-group]")
    .forEach((group) => {
      const step = Number(group.dataset.revealGroup) || 70;
      const max = Number(group.dataset.revealGroupMax) || 420;
      [...group.children].forEach((child, i) => {
        const el = child as HTMLElement;
        if (!el.hasAttribute("data-reveal")) el.setAttribute("data-reveal", "");
        el.style.setProperty("--reveal-delay", `${Math.min(i * step, max)}ms`);
      });
    });
}

/* ----------------------------------------------------------------- counters */

/**
 * Counts up to a number. Only ever used for values the client has verified —
 * never to dress up an unknown figure.
 */
function initCounters(): void {
  const els = document.querySelectorAll<HTMLElement>("[data-count-to]");
  if (!els.length) return;

  const io = new IntersectionObserver(
    (entries, obs) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const el = entry.target as HTMLElement;
        obs.unobserve(el);

        const target = Number(el.dataset.countTo);
        if (!Number.isFinite(target)) continue;
        const suffix = el.dataset.countSuffix ?? "";
        const duration = Number(el.dataset.countDuration) || 1400;
        const start = performance.now();

        const tick = (now: number) => {
          const t = Math.min((now - start) / duration, 1);
          // easeOutExpo — fast then settling, matching the UI's easing feel.
          const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
          el.textContent = Math.round(target * eased).toLocaleString("en-ZA") + suffix;
          if (t < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }
    },
    { threshold: 0.5 }
  );

  els.forEach((el) => io.observe(el));
}

/* ------------------------------------------------ parallax + progress loop */

type ParallaxItem = { el: HTMLElement; depth: number };
type ProgressItem = { el: HTMLElement };

function initScrollEffects(): void {
  const parallax: ParallaxItem[] = [
    ...document.querySelectorAll<HTMLElement>("[data-parallax]"),
  ].map((el) => ({ el, depth: Number(el.dataset.parallax) || 0.06 }));

  const progress: ProgressItem[] = [
    ...document.querySelectorAll<HTMLElement>("[data-progress-track]"),
  ].map((el) => ({ el }));

  if (!parallax.length && !progress.length) return;

  // Only work on elements currently near the viewport.
  const active = new Set<HTMLElement>();
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) active.add(e.target as HTMLElement);
        else active.delete(e.target as HTMLElement);
      }
    },
    { rootMargin: "20% 0px 20% 0px" }
  );

  [...parallax, ...progress].forEach(({ el }) => io.observe(el));

  let raf = 0;
  const frame = () => {
    raf = 0;
    const vh = innerHeight;

    for (const { el, depth } of parallax) {
      if (!active.has(el)) continue;
      const rect = el.getBoundingClientRect();
      // -1 at the bottom of the viewport, +1 at the top.
      const centre = (rect.top + rect.height / 2 - vh / 2) / (vh / 2 + rect.height / 2);
      const shift = -centre * depth * rect.height;
      el.style.setProperty("--py", `${shift.toFixed(2)}px`);
    }

    for (const { el } of progress) {
      if (!active.has(el)) continue;
      const rect = el.getBoundingClientRect();
      // 0 when the top reaches the viewport bottom, 1 when the bottom passes the top.
      const total = rect.height + vh;
      const p = Math.min(Math.max((vh - rect.top) / total, 0), 1);
      el.style.setProperty("--progress", p.toFixed(4));
      el.dataset.progressValue = p.toFixed(3);
    }
  };

  const schedule = () => {
    if (!raf) raf = requestAnimationFrame(frame);
  };

  frame();
  addEventListener("scroll", schedule, { passive: true });
  addEventListener("resize", schedule, { passive: true });
}
