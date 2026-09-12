"use client";

import { useEffect, useRef, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import gsap from "gsap";
import { Coffee, ArrowRight, Shield, ChefHat, Wallet, Crown, Eye, EyeOff, Sparkles } from "lucide-react";
import { useAuth } from "@/components/auth/auth-provider";
import { DEMO_USERS, type StaffRole } from "@/lib/auth";

const roles: { id: StaffRole; label: string; icon: typeof Shield; desc: string; color: string }[] = [
  { id: "owner", label: "Owner", icon: Crown, desc: "Full access", color: "bg-primary text-white" },
  { id: "manager", label: "Manager", icon: Shield, desc: "Ops + Reports", color: "bg-accent text-white" },
  { id: "chef", label: "Chef", icon: ChefHat, desc: "Kitchen only", color: "bg-info text-white" },
  { id: "cashier", label: "Cashier", icon: Wallet, desc: "POS only", color: "bg-success text-white" },
];

function LoginInner() {
  const router = useRouter();
  const qs = useSearchParams();
  const next = qs.get("next") || "/dashboard";
  const { user, login } = useAuth();
  const [email, setEmail] = useState("owner@cafeflow.demo");
  const [pwd, setPwd] = useState("Owner123!");
  const [show, setShow] = useState(false);
  const [role, setRole] = useState<StaffRole>("owner");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const rootRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLHeadingElement>(null);

  // pick credentials when role changes
  useEffect(() => {
    const u = DEMO_USERS.find((x) => x.role === role);
    if (u) { setEmail(u.email); setPwd(u.password); }
    // eslint-disable-next-line react-hooks/set-state-in-effect
  }, [role]);

  useEffect(() => {
    if (user) router.replace(next);
  }, [user, next, router]);

  // GSAP — insane but 60fps (transform/opacity only, respects reduced-motion)
  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mql.matches) return;
    const ctx = gsap.context(() => {
      const h = heroRef.current;
      if (h) {
        const text = h.textContent || "";
        h.innerHTML = text.split("").map((c) => (c === " " ? " " : `<span class="char inline-block will-change-transform">${c === " " ? "&nbsp;" : c}</span>`)).join("");
        gsap.from(h.querySelectorAll(".char"), { yPercent: 120, rotationX: -20, opacity: 0, duration: 0.9, stagger: 0.02, ease: "expo.out" });
      }
      gsap.from(".form-row", { y: 24, opacity: 0, stagger: 0.07, duration: 0.6, ease: "power3.out", delay: 0.35 });
      gsap.from("[data-beans]", { scale: 0.8, rotate: -8, opacity: 0, duration: 1, ease: "back.out(1.4)", delay: 0.2 });
      gsap.to("[data-beans]", { y: -12, rotate: 4, duration: 3, repeat: -1, yoyo: true, ease: "sine.inOut" });
      gsap.to("[data-steam]", { y: -40, scaleY: 1.15, opacity: 0.9, duration: 3.5, stagger: 0.6, repeat: -1, yoyo: true, ease: "sine.inOut" });
      gsap.to("[data-parallax]", { yPercent: -6, duration: 0.8, ease: "power2.out" });
      const handleMove = (e: MouseEvent) => {
        const x = (e.clientX / window.innerWidth - 0.5) * 14;
        const y = (e.clientY / window.innerHeight - 0.5) * 10;
        gsap.to("#hero-inner", { x, y, duration: 0.8, ease: "power2.out" });
      };
      window.addEventListener("mousemove", handleMove);
      return () => window.removeEventListener("mousemove", handleMove);
    }, rootRef);
    return () => ctx.revert();
  }, []);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null); setLoading(true);
    const msg = login(email, pwd);
    if (msg) { setErr(msg); setLoading(false); return; }
    router.replace(next);
  };

  return (
    <div ref={rootRef} className="min-h-screen bg-background overflow-hidden">
      {/* top nav minimal */}
      <nav className="absolute top-0 inset-x-0 z-20 h-14 flex items-center justify-between px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-primary text-white flex items-center justify-center"><Coffee className="w-4 h-4" /></div>
          <span className="font-semibold tracking-tight">CafeFlow</span>
          <span className="hidden sm:inline text-[10px] tracking-widest font-semibold border border-border rounded-full px-2 py-0.5 text-text-muted">STAFF ACCESS</span>
        </Link>
        <Link href="/menu?table=1" className="text-xs font-medium px-3 py-1.5 rounded-full border border-border bg-surface hover:bg-surface-hover">Customer QR →</Link>
      </nav>

      <div className="min-h-screen grid lg:grid-cols-[60%_40%]">
        {/* HERO */}
        <div id="hero" className="relative flex flex-col justify-center px-6 lg:px-12 xl:px-16 pt-20 pb-10 lg:py-16 overflow-hidden bg-[#1C1917] text-[#FDFBF7]">
          {/* kinetic beans bg */}
          <div aria-hidden className="absolute inset-0">
            <div className="absolute inset-0 opacity-[0.08]" style={{ background: "radial-gradient(600px 400px at 70% 20%, #C2410C 0%, transparent 60%), radial-gradient(800px 500px at 10% 90%, #E8E0D6 0%, transparent 50%)" }} />
            <div data-beans className="absolute right-6 lg:right-10 top-20 lg:top-24 w-28 h-28 lg:w-40 lg:h-40 rounded-[28px] bg-accent/90 shadow-2xl flex items-center justify-center rotate-3"><Coffee className="w-14 h-14 lg:w-20 lg:h-20 text-white/90" /></div>
            <div data-beans className="absolute right-12 bottom-16 w-20 h-20 rounded-2xl bg-surface/10 border border-white/10 backdrop-blur-md hidden lg:flex items-center justify-center -rotate-6"><Sparkles className="w-8 h-8 text-white/70" /></div>
            {/* steam */}
            <div className="absolute left-12 lg:left-20 top-1/2 w-px h-24 bg-gradient-to-t from-transparent via-white/30 to-transparent" data-steam />
            <div className="absolute left-16 lg:left-[88px] top-[48%] w-px h-20 bg-gradient-to-t from-transparent via-white/20 to-transparent" data-steam />
            <div className="absolute left-20 lg:left-24 top-[52%] w-px h-16 bg-gradient-to-t from-transparent via-white/20 to-transparent hidden sm:block" data-steam />
          </div>

          <div data-parallax id="hero-inner" className="relative">
            <p className="text-[11px] tracking-[0.2em] font-semibold text-white/60">EST. 2024 • INDEPENDENT CAFES • INDIA</p>
            <h1 ref={heroRef} className="font-serif text-[42px] sm:text-[56px] lg:text-[68px] font-bold leading-[0.9] tracking-[-0.03em] mt-3">
              Staff only.
              <br />
              <span className="font-normal italic text-accent">Customers</span> use QR.
            </h1>
            <p className="mt-4 text-[15px] leading-relaxed text-white/70 max-w-[44ch]">Owner, Manager, Chef, Cashier log in here. No customer accounts — QR ordering stays frictionless.</p>

            <div className="mt-8 grid grid-cols-3 gap-3 max-w-[520px]">
              <div className="rounded-2xl bg-white/[0.06] border border-white/10 p-3 backdrop-blur"><p className="text-xl font-semibold font-mono">12</p><p className="text-[11px] text-white/60">tables live</p></div>
              <div className="rounded-2xl bg-white/[0.06] border border-white/10 p-3 backdrop-blur"><p className="text-xl font-semibold font-mono">47</p><p className="text-[11px] text-white/60">orders today</p></div>
              <div className="rounded-2xl bg-accent text-white p-3"><p className="text-xl font-semibold font-mono">₹28k</p><p className="text-[11px] text-white/80">sales</p></div>
            </div>

            <div className="mt-6 flex items-center gap-2 text-xs text-white/50">
              <Shield className="w-3.5 h-3.5" /> Role-based access • chef → kitchen • cashier → POS
            </div>
          </div>
        </div>

        {/* FORM */}
        <div className="flex items-center justify-center px-6 lg:px-10 py-8 lg:py-10 bg-background">
          <form onSubmit={onSubmit} className="w-full max-w-[420px] space-y-4">
            <div className="form-row">
              <h2 className="text-xl font-semibold tracking-tight">Welcome back</h2>
              <p className="text-sm text-text-secondary mt-1">Pick a role to autofill demo credentials, or use your own.</p>
            </div>

            <div className="form-row grid grid-cols-2 gap-2">
              {roles.map((r) => (
                <button key={r.id} type="button" onClick={() => setRole(r.id)} aria-pressed={role === r.id}
                  className={`text-left p-3 rounded-2xl border-2 transition-all flex items-center gap-2.5 ${role === r.id ? "border-accent bg-accent-light" : "border-border bg-surface hover:bg-surface-hover"}`}>
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${r.color}`}><r.icon className="w-4 h-4" /></div>
                  <div><p className="text-sm font-semibold leading-none">{r.label}</p><p className="text-[11px] text-text-muted">{r.desc}</p></div>
                </button>
              ))}
            </div>

            <div className="form-row space-y-3">
              <label className="block">
                <span className="text-xs font-semibold tracking-widest text-text-muted">EMAIL</span>
                <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required placeholder="owner@cafeflow.demo"
                  className="mt-1 w-full px-3.5 py-3 rounded-xl border border-border bg-surface focus:border-accent focus:ring-4 focus:ring-accent/10 outline-none text-sm transition-all" />
              </label>
              <label className="block">
                <span className="text-xs font-semibold tracking-widest text-text-muted">PASSWORD</span>
                <div className="mt-1 relative">
                  <input value={pwd} onChange={(e) => setPwd(e.target.value)} type={show ? "text" : "password"} required placeholder="••••••••"
                    className="w-full px-3.5 py-3 pr-10 rounded-xl border border-border bg-surface focus:border-accent focus:ring-4 focus:ring-accent/10 outline-none text-sm transition-all" />
                  <button type="button" onClick={() => setShow(!show)} className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg hover:bg-surface-hover flex items-center justify-center text-text-muted">
                    {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </label>
              {err && <p role="alert" className="text-xs font-medium text-error bg-error-bg border border-error/20 rounded-xl px-3 py-2">{err}</p>}
              <button disabled={loading} className="w-full py-3.5 rounded-xl bg-primary text-white font-semibold hover:bg-primary-hover transition-colors flex items-center justify-center gap-2 disabled:opacity-50">
                {loading ? "Signing in…" : <>Sign in <ArrowRight className="w-4 h-4" /></>}
              </button>
              <p className="text-[11px] text-text-muted text-center">Demo: click a role pill to autofill. Customers never see this — they scan QR at table.</p>
            </div>

            <div className="form-row flex items-center justify-between text-xs pt-2 border-t border-border">
              <Link href="/" className="text-text-secondary hover:text-text-primary">← Back to site</Link>
              <span className="text-text-muted">Secure • demo only, no email sent</span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center">Loading…</div>}>
      <LoginInner />
    </Suspense>
  );
}
