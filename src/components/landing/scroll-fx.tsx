"use client";

import { useRef, type ReactNode, type MouseEvent } from "react";
import {
  motion,
  useScroll,
  useVelocity,
  useSpring,
  useTransform,
  useMotionValue,
  useAnimationFrame,
  useReducedMotion,
} from "framer-motion";

/* ------------------------------------------------------------------ */
/* ScrollVelocity marquee (React Bits recipe: velocity-reactive loop)   */
/* ------------------------------------------------------------------ */

function wrap(min: number, max: number, v: number) {
  const range = max - min;
  return ((((v - min) % range) + range) % range) + min;
}

export function VelocityMarquee({ items, baseVelocity = 2.5 }: { items: string[]; baseVelocity?: number }) {
  const reduceMotion = useReducedMotion();
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, { damping: 50, stiffness: 400 });
  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 4], { clamp: false });
  const x = useTransform(baseX, (v) => `${wrap(-50, 0, v)}%`);
  const direction = useRef(1);

  useAnimationFrame((_, delta) => {
    let moveBy = direction.current * baseVelocity * (delta / 1000);
    const vf = velocityFactor.get();
    if (vf < 0) direction.current = -1;
    else if (vf > 0) direction.current = 1;
    moveBy += direction.current * moveBy * Math.abs(vf);
    baseX.set(baseX.get() + moveBy);
  });

  const row = (key: string, hidden?: boolean) => (
    <div key={key} aria-hidden={hidden} className="flex shrink-0 items-center">
      {items.map((item) => (
        <span key={key + item} className="flex items-center">
          <span className="mx-6 font-mono text-[12px] font-medium tracking-[0.2em] whitespace-nowrap">{item}</span>
          <span className="w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
        </span>
      ))}
    </div>
  );

  if (reduceMotion) {
    return (
      <div className="overflow-hidden border-y border-white/10 bg-[#18181B] text-[#FAFAF9] py-3">
        <div className="flex justify-center">{row("static")}</div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden border-y border-white/10 bg-[#18181B] text-[#FAFAF9] py-3">
      <motion.div style={{ x }} className="flex w-max">
        {row("a")}
        {row("b", true)}
      </motion.div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* ScrollRevealText (React Bits recipe: per-word opacity scrub)         */
/* ------------------------------------------------------------------ */

function RevealWord({
  progress,
  range,
  children,
}: {
  progress: ReturnType<typeof useScroll>["scrollYProgress"];
  range: [number, number];
  children: string;
}) {
  const opacity = useTransform(progress, range, [0.14, 1]);
  return (
    <motion.span style={{ opacity }} className="inline-block mr-[0.26em]">
      {children}
    </motion.span>
  );
}

export function ScrollRevealText({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.45"] });
  const words = text.split(" ");

  if (reduceMotion) return <p className={className}>{text}</p>;

  return (
    <p ref={ref} className={className}>
      {words.map((w, i) => (
        <RevealWord key={i} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]}>
          {w}
        </RevealWord>
      ))}
    </p>
  );
}

/* ------------------------------------------------------------------ */
/* Spotlight hover (21st.dev spotlight-card recipe)                    */
/* ------------------------------------------------------------------ */

export function Spotlight({
  children,
  className,
  ...rest
}: {
  children: ReactNode;
  className?: string;
  [key: string]: unknown;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - rect.left}px`);
    el.style.setProperty("--my", `${e.clientY - rect.top}px`);
  };

  return (
    <div ref={ref} onMouseMove={onMove} className={`group/spot relative overflow-hidden ${className ?? ""}`} {...rest}>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover/spot:opacity-100"
        style={{ background: "radial-gradient(520px circle at var(--mx, 50%) var(--my, 50%), rgba(180, 83, 42, 0.1), transparent 45%)" }}
      />
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Magnet CTA (React Bits magnet recipe: spring toward cursor)         */
/* ------------------------------------------------------------------ */

export function Magnet({ children, strength = 22 }: { children: ReactNode; strength?: number }) {
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, { stiffness: 160, damping: 14 });
  const y = useSpring(rawY, { stiffness: 160, damping: 14 });

  const onMove = (e: MouseEvent<HTMLSpanElement>) => {
    const el = ref.current;
    if (!el || reduceMotion) return;
    const rect = el.getBoundingClientRect();
    rawX.set(((e.clientX - rect.left) / rect.width - 0.5) * strength * 2);
    rawY.set(((e.clientY - rect.top) / rect.height - 0.5) * strength * 2);
  };

  const onLeave = () => {
    rawX.set(0);
    rawY.set(0);
  };

  return (
    <motion.span ref={ref} onMouseMove={onMove} onMouseLeave={onLeave} style={{ x, y }} className="inline-flex">
      {children}
    </motion.span>
  );
}
