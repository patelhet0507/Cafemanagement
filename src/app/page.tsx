"use client";

import { useLayoutEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Coffee, ArrowRight, QrCode, Boxes, LineChart, ShieldCheck, ScanLine } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const WORDS_1 = ["Turn", "every", "table", "into", "a", "swift"];
const WORDS_2 = ["revenue", "stream."];

export default function LandingPage() {
  const rootRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    let removeRefresh = () => {};
    const ctx = gsap.context(() => {
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduced) {
        gsap.set("[data-hero-step]", { clearProps: "all", opacity: 1, y: 0 });
        return;
      }

      // 1) Hero entrance timeline (Stitch spec: expo stagger 0.06s, back pop for cup)
      const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
      tl.from("[data-hero-step='eyebrow']", { y: 8, opacity: 0, duration: 0.8 })
        .from("[data-hero-word]", { y: 22, opacity: 0, duration: 0.85, stagger: 0.06 }, 0.14)
        .from("[data-hero-cup]", { scale: 0.8, opacity: 0, duration: 0.9, ease: "back.out(1.56)" }, 0.44)
        .from("[data-hero-step='copy']", { y: 22, opacity: 0, duration: 0.85 }, 0.62)
        .from("[data-hero-step='cta']", { y: 22, opacity: 0, duration: 0.85 }, 0.7)
        .from("[data-hero-step='ticker']", { y: 22, opacity: 0, duration: 0.85 }, 0.78)
        .from("[data-hero-step='card']", { y: 24, opacity: 0, duration: 1 }, 0.3);

      // 2) Live order card micro-loops (Stitch: breathe 2.4s, float 5.2s)
      gsap.to("[data-float-card]", { y: -5, duration: 2.6, ease: "sine.inOut", yoyo: true, repeat: -1 });
      gsap.to("[data-breathe-pill]", {
        scale: 1.03,
        boxShadow: "0 0 0 5px rgba(180, 83, 42, 0)",
        duration: 1.2,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });

      // 3) Scroll-triggered reveals for feature sections (slide up 24px, once)
      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
        gsap.from(el, {
          y: 24,
          opacity: 0,
          duration: 0.85,
          ease: "expo.out",
          scrollTrigger: { trigger: el, start: "top 85%", once: true },
        });
      });

      // 4) Scroll progress bar under sticky nav (Stitch SPEC 01)
      gsap.to("[data-scroll-progress]", {
        scaleX: 1,
        ease: "none",
        scrollTrigger: { trigger: document.body, start: "top top", end: "bottom bottom", scrub: 0.3 },
      });

      // 5) Hero parallax scrub (Stitch SPEC 01: left y -60 fade, right card y +40)
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

      // 6) Refresh triggers after fonts/images load (ui-ux-pro-max guidance)
      const refresh = () => ScrollTrigger.refresh();
      window.addEventListener("load", refresh);
      if (document.fonts) document.fonts.ready.then(refresh).catch(() => {});
      removeRefresh = () => window.removeEventListener("load", refresh);

      // 7) Stats count-up on scroll into view
      gsap.utils.toArray<HTMLElement>("[data-count]").forEach((el) => {
        const target = parseFloat(el.dataset.count || "0");
        const prefix = el.dataset.prefix || "";
        const obj = { val: 0 };
        ScrollTrigger.create({
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
    }, rootRef);
    return () => { removeRefresh(); ctx.revert(); };
  }, []);

  return (
    <div ref={rootRef} className="min-h-screen bg-background flex flex-col">
      <nav className="sticky top-0 z-30 backdrop-blur-md bg-background/70 border-b border-border">
        <div className="max-w-[1160px] mx-auto px-6 lg:px-8 h-[64px] flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-accent text-white flex items-center justify-center">
              <Coffee className="w-[16px] h-[16px]" />
            </div>
            <span className="font-semibold tracking-tight">CafeFlow</span>
            <span className="hidden sm:inline text-[10px] tracking-widest font-semibold text-text-muted border border-border rounded-full px-2 py-0.5 ml-2">FOR INDEPENDENT CAFES</span>
          </Link>
          <div className="flex items-center gap-2">
            <span className="hidden sm:inline text-xs text-text-muted">Customer ordering only — staff at <span className="font-mono">/login</span></span>
          </div>
        </div>
        <div data-scroll-progress className="h-0.5 w-full bg-accent origin-left scale-x-0" />
      </nav>

      <main className="flex-1">
        {/* Hero — editorial asymmetric */}
        <section data-hero-section className="max-w-[1160px] mx-auto px-6 lg:px-8 pt-10 lg:pt-16 pb-8 grid lg:grid-cols-[1.1fr_0.9fr] gap-10 lg:gap-12 items-start">
          <div data-hero-left>
            <div data-hero-step="eyebrow" className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.15em] text-text-muted">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-accent" />
              </span>
              Bistro operating system · Table-first dispatch
            </div>
            <h1 className="font-display text-[40px] sm:text-[54px] lg:text-[62px] font-semibold tracking-[-0.03em] leading-[1.02] mt-4">
              {WORDS_1.map((w) => (
                <span key={w} data-hero-word className="inline-block mr-[0.24em]">{w}</span>
              ))}
              <span data-hero-cup className="inline-flex items-center align-middle mx-1">
                <img src="https://picsum.photos/seed/cafeflow-latte/112/112" alt="Artisan flat white" className="w-11 h-11 sm:w-14 sm:h-14 rounded-full object-cover border-2 border-white shadow-sm inline-block" loading="lazy" />
              </span>{" "}
              {WORDS_2.map((w) => (
                <span key={w} data-hero-word className="inline-block mr-[0.24em]">{w}</span>
              ))}
            </h1>
            <p data-hero-step="copy" className="mt-5 text-[15px] sm:text-lg leading-relaxed text-text-secondary max-w-[52ch]">
              QR ordering that clears the counter. Recipe-linked inventory that explains every gram. One quiet dashboard that
              tells you what to reorder before you run out.
            </p>
            <div data-hero-step="cta" className="flex flex-wrap items-center gap-3 mt-8">
              <Link href="/scan" className="btn-tactile inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-accent text-white font-semibold hover:bg-accent-hover transition-colors shadow-sm min-h-[44px]">
                Try Customer Menu <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/dashboard" className="inline-flex items-center gap-1.5 text-sm font-semibold text-text-secondary hover:text-accent transition-colors">
                View live demo <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <p data-hero-step="ticker" className="mt-8 font-mono text-[11px] tracking-wide text-text-muted">
              42s avg reorder speed · 0% app download requirement · 100% contactless settlement
            </p>
            <div data-hero-step="ticker" className="mt-4 flex flex-wrap gap-6 text-sm border-t border-border pt-6">
              <div><p className="text-2xl font-semibold font-mono tracking-tight tabular-nums" data-count="28450" data-prefix="₹">₹28,450</p><p className="text-xs text-text-muted">Today, live from demo cafe</p></div>
              <div className="w-px bg-border hidden sm:block" />
              <div><p className="text-2xl font-semibold font-mono tracking-tight tabular-nums" data-count="47">47</p><p className="text-xs text-text-muted">orders · Average ₹605</p></div>
              <div className="w-px bg-border hidden sm:block" />
              <div><p className="text-2xl font-semibold font-mono tracking-tight tabular-nums">—18%</p><p className="text-xs text-text-muted">waste after recipes</p></div>
            </div>
          </div>

          {/* Live order preview card */}
          <div data-hero-right data-hero-step="card" className="relative lg:sticky lg:top-[84px]">
            <div data-float-card className="rounded-[24px] border border-border bg-surface shadow-[0_20px_60px_rgba(28,25,23,0.08)] overflow-hidden">
              <div className="h-10 flex items-center gap-1.5 px-4 border-b border-border bg-background">
                <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F56] border border-black/10" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E] border border-black/10" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#27CA3F] border border-black/10" />
                <span className="ml-auto font-mono text-[11px] tracking-widest text-text-muted">TABLE 04 • ORDER #1042</span>
              </div>
              <div className="p-5 grid grid-cols-2 gap-3 text-sm">
                <div className="col-span-2 flex items-center justify-between p-3 rounded-xl bg-background border border-border">
                  <span className="font-medium">2× Cold Coffee</span><span className="font-mono font-semibold tabular-nums">₹360</span>
                </div>
                <div className="col-span-2 flex items-center justify-between p-3 rounded-xl bg-accent-light border border-accent/15">
                  <span data-breathe-pill className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-accent">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent" /> Preparing
                  </span>
                  <span className="font-mono text-[11px] text-text-muted">~3m</span>
                </div>
                <div className="p-3 rounded-xl bg-accent text-white">
                  <p className="text-[11px] tracking-widest opacity-80">GST 5%</p>
                  <p className="font-mono font-semibold tabular-nums">₹25</p>
                </div>
                <div className="p-3 rounded-xl bg-accent text-white">
                  <p className="text-[11px] tracking-widest opacity-70">TOTAL</p>
                  <p className="font-mono font-semibold tabular-nums">₹525</p>
                </div>
                <div className="col-span-2 flex items-center gap-2 text-xs text-text-secondary mt-1">
                  <ShieldCheck className="w-4 h-4 text-success" /> Inventory auto-deducted · KOT sent to kitchen
                </div>
              </div>
              <div className="px-5 pb-5">
                <div className="shimmer h-1.5 rounded-full bg-border overflow-hidden flex">
                  <div className="flex-1 bg-accent" />
                  <div className="flex-1 bg-success" />
                  <div className="flex-1 bg-border" />
                </div>
                <p className="text-[11px] text-text-muted mt-2 flex justify-between"><span>Ordered → Preparing → Ready</span><span className="font-medium text-accent">Preparing</span></p>
              </div>
            </div>
            <div className="absolute -bottom-4 -right-2 sm:right-4 bg-surface border border-border rounded-2xl shadow-lg px-3 py-2.5 flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-success-bg text-success flex items-center justify-center"><LineChart className="w-4 h-4" /></div>
              <div><p className="text-xs font-semibold leading-none">Sales +18.4%</p><p className="text-[11px] text-text-muted">vs yesterday</p></div>
            </div>
          </div>
        </section>

        {/* Feature strip — editorial, not 3 equal cards */}
        <section className="max-w-[1160px] mx-auto px-6 lg:px-8 py-12 lg:py-16">
          <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-6">
            <div data-reveal className="rounded-[24px] border border-border bg-accent text-white p-7 sm:p-8 flex flex-col">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center"><QrCode className="w-5 h-5" /></div>
              <h3 className="mt-4 text-xl font-semibold tracking-tight">QR ordering, minus the awkward wait</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/70 max-w-[46ch]">Customers scan the table, order from their phone, pay at counter. Staff focus on making coffee, not taking orders.</p>
              <ul className="mt-4 space-y-1.5 text-sm text-white/80">
                <li>• Table-scoped cart, GST auto-calculated</li>
                <li>• WhatsApp confirmation, KOT to kitchen</li>
                <li>• Works on any phone — no app install</li>
              </ul>
              <Link href="/scan" className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-white underline underline-offset-4 decoration-white/30 hover:decoration-white">Scan QR to order →</Link>
            </div>
            <div className="grid grid-rows-2 gap-6">
              <div data-reveal className="rounded-[24px] border border-border bg-surface p-7">
                <div className="w-10 h-10 rounded-xl bg-accent-light text-accent flex items-center justify-center border border-accent/10"><Boxes className="w-5 h-5" /></div>
                <h3 className="mt-3 font-semibold">Recipe-linked stock</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-text-secondary">Every Cappuccino deducts 150 ml milk + 18 g beans. Variance tells you where stock disappears.</p>
              </div>
              <div data-reveal className="rounded-[24px] border border-border bg-surface p-7">
                <div className="w-10 h-10 rounded-xl bg-info-bg text-info flex items-center justify-center border border-info/15"><LineChart className="w-5 h-5" /></div>
                <h3 className="mt-3 font-semibold">A dashboard that earns its keep</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-text-secondary">Live sales, low-stock alerts, customer CRM from phone numbers, exportable variance report.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border">
        <div data-reveal className="max-w-[1160px] mx-auto px-6 lg:px-8 h-14 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-text-muted">
          <span>© {new Date().getFullYear()} CafeFlow — Built for independent cafes</span>
          <div className="flex items-center gap-2">
            <Link href="/menu?table=1" className="px-3 py-1.5 rounded-full border border-border hover:bg-surface-hover">Menu</Link>
            <Link href="/scan" className="px-3 py-1.5 rounded-full border border-border hover:bg-surface-hover">Scan</Link>
            <Link href="/login" className="px-4 py-1.5 rounded-full bg-accent text-white font-medium hover:bg-accent-hover">Staff Login</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
