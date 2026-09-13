"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/** 1) Hero entrance timeline — expo stagger 0.06s, back pop for cup. */
export function heroEntranceTimeline() {
  const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
  tl.from("[data-hero-step='eyebrow']", { y: 8, opacity: 0, duration: 0.8 })
    .from("[data-hero-word]", { y: 22, opacity: 0, duration: 0.85, stagger: 0.06 }, 0.14)
    .from("[data-hero-cup]", { scale: 0.8, opacity: 0, duration: 0.9, ease: "back.out(1.56)" }, 0.44)
    .from("[data-hero-step='copy']", { y: 22, opacity: 0, duration: 0.85 }, 0.62)
    .from("[data-hero-step='cta']", { y: 22, opacity: 0, duration: 0.85 }, 0.7)
    .from("[data-hero-step='ticker']", { y: 22, opacity: 0, duration: 0.85 }, 0.78)
    .from("[data-hero-step='card']", { y: 24, opacity: 0, duration: 1 }, 0.3);
  return tl;
}

/** 2) Live order card micro-loops — float 5.2s + breathe pill 2.4s. */
export function cardMicroLoops() {
  const float = gsap.to("[data-float-card]", { y: -5, duration: 2.6, ease: "sine.inOut", yoyo: true, repeat: -1 });
  const breathe = gsap.to("[data-breathe-pill]", {
    scale: 1.03,
    boxShadow: "0 0 0 5px rgba(180, 83, 42, 0)",
    duration: 1.2,
    ease: "sine.inOut",
    yoyo: true,
    repeat: -1,
  });
  return [float, breathe];
}

/** 3) Scroll-triggered reveals — slide up 24px, play once. */
export function scrollReveals() {
  return gsap.utils.toArray<HTMLElement>("[data-reveal]").map((el) =>
    gsap.from(el, {
      y: 24,
      opacity: 0,
      duration: 0.85,
      ease: "expo.out",
      scrollTrigger: { trigger: el, start: "top 85%", once: true },
    })
  );
}

/** 4) Scroll progress bar — scaleX 0→1 scrubbed to page scroll. */
export function scrollProgressBar() {
  return gsap.to("[data-scroll-progress]", {
    scaleX: 1,
    ease: "none",
    scrollTrigger: { trigger: document.body, start: "top top", end: "bottom bottom", scrub: 0.3 },
  });
}

/** 5) Hero parallax scrub — left y −60 fade, right card y +40. Reduced-motion safe. */
export function heroParallaxScrub() {
  const mm = gsap.matchMedia();
  mm.add("(prefers-reduced-motion: no-preference)", () => {
    gsap.to("[data-hero-left]", {
      y: -60,
      opacity: 0.2,
      ease: "none",
      scrollTrigger: { trigger: "[data-hero-section]", start: "top top", end: "bottom top", scrub: 0.8 },
    });
    gsap.to("[data-hero-right]", {
      y: 40,
      ease: "none",
      scrollTrigger: { trigger: "[data-hero-section]", start: "top top", end: "bottom top", scrub: 0.8 },
    });
  });
  return mm;
}

/** 6) Stats count-up on scroll into view. */
export function statCountUps() {
  return gsap.utils.toArray<HTMLElement>("[data-count]").map((el) => {
    const target = parseFloat(el.dataset.count || "0");
    const prefix = el.dataset.prefix || "";
    const obj = { val: 0 };
    return ScrollTrigger.create({
      trigger: el,
      start: "top 90%",
      once: true,
      onEnter: () => {
        gsap.to(obj, {
          val: target,
          duration: 1.6,
          ease: "expo.out",
          onUpdate: () => {
            el.textContent = prefix + Math.round(obj.val).toLocaleString("en-IN");
          },
        });
      },
    });
  });
}

/** 7) Refresh triggers after fonts/images load. Returns cleanup. */
export function refreshOnLoad() {
  const refresh = () => ScrollTrigger.refresh();
  window.addEventListener("load", refresh);
  if (document.fonts) document.fonts.ready.then(refresh).catch(() => {});
  return () => window.removeEventListener("load", refresh);
}
