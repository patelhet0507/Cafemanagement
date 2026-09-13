# CafeFlow Landing — GSAP + Framer Motion Snippets

Live on the landing page (`src/app/page.tsx`) via `src/components/landing/landing-motion.ts`.
Stitch source: `CafeFlow - Desktop Motion Choreography Spec` screen. Stack: GSAP 3.15 + ScrollTrigger, Framer Motion 13, React 19, Next 16.

All snippets animate **transform/opacity only**, respect `prefers-reduced-motion`, and clean up via `gsap.context(...).revert()`.

---

## 1) Hero entrance timeline (GSAP)

```tsx
import gsap from "gsap";

const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
tl.from("[data-hero-step='eyebrow']", { y: 8, opacity: 0, duration: 0.8 })
  .from("[data-hero-word]", { y: 22, opacity: 0, duration: 0.85, stagger: 0.06 }, 0.14)
  .from("[data-hero-cup]", { scale: 0.8, opacity: 0, duration: 0.9, ease: "back.out(1.56)" }, 0.44)
  .from("[data-hero-step='copy']", { y: 22, opacity: 0, duration: 0.85 }, 0.62)
  .from("[data-hero-step='cta']", { y: 22, opacity: 0, duration: 0.85 }, 0.7)
  .from("[data-hero-step='ticker']", { y: 22, opacity: 0, duration: 0.85 }, 0.78)
  .from("[data-hero-step='card']", { y: 24, opacity: 0, duration: 1 }, 0.3);
```

## 2) Live-card micro-loops (GSAP)

```tsx
// Gentle float, 5.2s loop
gsap.to("[data-float-card]", { y: -5, duration: 2.6, ease: "sine.inOut", yoyo: true, repeat: -1 });

// Breathing status pill, 2.4s loop
gsap.to("[data-breathe-pill]", {
  scale: 1.03,
  boxShadow: "0 0 0 5px rgba(180, 83, 42, 0)",
  duration: 1.2,
  ease: "sine.inOut",
  yoyo: true,
  repeat: -1,
});
```

## 3) Scroll reveals, once (GSAP + ScrollTrigger)

```tsx
gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
  gsap.from(el, {
    y: 24, opacity: 0, duration: 0.85, ease: "expo.out",
    scrollTrigger: { trigger: el, start: "top 85%", once: true },
  });
});
```

## 4) Scroll progress bar (GSAP scrub)

```tsx
gsap.to("[data-scroll-progress]", {
  scaleX: 1, ease: "none",
  scrollTrigger: { trigger: document.body, start: "top top", end: "bottom bottom", scrub: 0.3 },
});
```

Markup: `<div data-scroll-progress className="h-0.5 w-full bg-accent origin-left scale-x-0" />`

## 5) Hero parallax scrub (GSAP matchMedia)

```tsx
const mm = gsap.matchMedia();
mm.add("(prefers-reduced-motion: no-preference)", () => {
  gsap.to("[data-hero-left]", {
    y: -60, opacity: 0.2, ease: "none",
    scrollTrigger: { trigger: "[data-hero-section]", start: "top top", end: "bottom top", scrub: 0.8 },
  });
  gsap.to("[data-hero-right]", {
    y: 40, ease: "none",
    scrollTrigger: { trigger: "[data-hero-section]", start: "top top", end: "bottom top", scrub: 0.8 },
  });
});
```

## 6) Stat count-up on enter (GSAP)

```tsx
gsap.utils.toArray<HTMLElement>("[data-count]").forEach((el) => {
  const target = parseFloat(el.dataset.count || "0");
  const prefix = el.dataset.prefix || "";
  const obj = { val: 0 };
  ScrollTrigger.create({
    trigger: el, start: "top 90%", once: true,
    onEnter: () => {
      gsap.to(obj, {
        val: target, duration: 1.6, ease: "expo.out",
        onUpdate: () => { el.textContent = prefix + Math.round(obj.val).toLocaleString("en-IN"); },
      });
    },
  });
});
```

## 7) Refresh after fonts/images (ui-ux-pro-max)

```tsx
const refresh = () => ScrollTrigger.refresh();
window.addEventListener("load", refresh);
if (document.fonts) document.fonts.ready.then(refresh).catch(() => {});
return () => window.removeEventListener("load", refresh);
```

## 8) CTA spring press (Framer Motion)

```tsx
import { motion } from "framer-motion";

<motion.span
  whileHover={{ scale: 1.03 }}
  whileTap={{ scale: 0.97, y: 1 }}
  transition={{ type: "spring", stiffness: 400, damping: 22 }}
  className="inline-flex"
>
  <Link href="/scan" className="...">Try Customer Menu</Link>
</motion.span>
```

## 9) Floating badge loop (Framer Motion)

```tsx
import { motion, useReducedMotion } from "framer-motion";

const reduceMotion = useReducedMotion();

<motion.div
  animate={reduceMotion ? undefined : { y: [0, -7, 0] }}
  transition={{ duration: 4.2, ease: "easeInOut", repeat: Infinity }}
>
  {/* badge content */}
</motion.div>
```

## 10) React wiring pattern (scope + cleanup)

```tsx
import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";

const rootRef = useRef<HTMLDivElement>(null);

useLayoutEffect(() => {
  const ctx = gsap.context(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set("[data-hero-step]", { clearProps: "all", opacity: 1, y: 0 });
      return;
    }
    heroEntranceTimeline();
    cardMicroLoops();
    scrollReveals();
    scrollProgressBar();
    heroParallaxScrub();
    statCountUps();
  }, rootRef);
  const removeRefresh = refreshOnLoad();
  return () => { removeRefresh(); ctx.revert(); };
}, []);
```
