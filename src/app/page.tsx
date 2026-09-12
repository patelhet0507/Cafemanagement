import Link from "next/link";
import { Coffee, ArrowRight, QrCode, Boxes, LineChart, Clock3, ShieldCheck, Sparkles, ScanLine } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <nav className="sticky top-0 z-30 backdrop-blur-md bg-background/70 border-b border-border">
        <div className="max-w-[1160px] mx-auto px-6 lg:px-8 h-[64px] flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-primary text-white flex items-center justify-center">
              <Coffee className="w-[16px] h-[16px]" />
            </div>
            <span className="font-semibold tracking-tight">CafeFlow</span>
            <span className="hidden sm:inline text-[10px] tracking-widest font-semibold text-text-muted border border-border rounded-full px-2 py-0.5 ml-2">FOR INDEPENDENT CAFES</span>
          </Link>
          <div className="flex items-center gap-2">
            <span className="hidden sm:inline text-xs text-text-muted">Customer ordering only — staff at <span className="font-mono">/login</span></span>
          </div>
        </div>
      </nav>

      <main className="flex-1">
        {/* Hero — editorial asymmetric */}
        <section className="max-w-[1160px] mx-auto px-6 lg:px-8 pt-10 lg:pt-16 pb-8 grid lg:grid-cols-[1.1fr_0.9fr] gap-10 lg:gap-12 items-start">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-full bg-accent-light border border-accent/15 text-accent">
              <Sparkles className="w-3.5 h-3.5" /> New — variance report catches pilferage in 14 days
            </div>
            <h1 className="font-serif text-[40px] sm:text-[54px] lg:text-[62px] font-semibold tracking-[-0.03em] leading-[0.95] mt-5">
              The <span className="text-accent italic font-normal">operating</span><br /> system for your<br /> cafe.
            </h1>
            <p className="mt-5 text-[15px] sm:text-lg leading-relaxed text-text-secondary max-w-[52ch]">
              QR ordering that clears the counter. Recipe-linked inventory that explains every gram. One quiet dashboard that
              tells you what to reorder before you run out.
            </p>
            <div className="flex flex-wrap items-center gap-3 mt-8">
              <Link href="/scan" className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-accent text-white font-semibold hover:bg-accent-hover transition-colors shadow-sm">
                Try Customer Menu <ArrowRight className="w-4 h-4" />
              </Link>
              <span className="text-xs text-text-muted flex items-center gap-1.5"><QrCode className="w-3.5 h-3.5" /> Scan table QR to order</span>
            </div>

            <div className="mt-10 flex flex-wrap gap-6 text-sm border-t border-border pt-6">
              <div><p className="text-2xl font-semibold font-mono tracking-tight">₹28,450</p><p className="text-xs text-text-muted">Today, live from demo cafe</p></div>
              <div className="w-px bg-border hidden sm:block" />
              <div><p className="text-2xl font-semibold font-mono tracking-tight">47 orders</p><p className="text-xs text-text-muted">Average ₹605</p></div>
              <div className="w-px bg-border hidden sm:block" />
              <div><p className="text-2xl font-semibold font-mono tracking-tight">—18%</p><p className="text-xs text-text-muted">waste after recipes</p></div>
            </div>
          </div>

          {/* Preview card stack — not generic, concrete UI mini */}
          <div className="relative lg:sticky lg:top-[84px]">
            <div className="rounded-[24px] border border-border bg-surface shadow-[0_20px_60px_rgba(28,25,23,0.08)] overflow-hidden">
              <div className="h-10 flex items-center gap-1.5 px-4 border-b border-border bg-background">
                <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F56] border border-black/10" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E] border border-black/10" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#27CA3F] border border-black/10" />
                <span className="ml-auto text-[11px] font-medium tracking-widest text-text-muted">TABLE 04 • ORDER #1042</span>
              </div>
              <div className="p-5 grid grid-cols-2 gap-3 text-sm">
                <div className="col-span-2 flex items-center justify-between p-3 rounded-xl bg-background border border-border">
                  <span className="font-medium">2× Cold Coffee</span><span className="font-mono font-semibold">₹360</span>
                </div>
                <div className="p-3 rounded-xl bg-accent text-white">
                  <p className="text-[11px] tracking-widest opacity-80">GST 5%</p>
                  <p className="font-mono font-semibold">₹25</p>
                </div>
                <div className="p-3 rounded-xl bg-primary text-white">
                  <p className="text-[11px] tracking-widest opacity-70">TOTAL</p>
                  <p className="font-mono font-semibold">₹525</p>
                </div>
                <div className="col-span-2 flex items-center gap-2 text-xs text-text-secondary mt-1">
                  <ShieldCheck className="w-4 h-4 text-success" /> Inventory auto-deducted · KOT sent to kitchen
                </div>
              </div>
              <div className="px-5 pb-5">
                <div className="h-1.5 rounded-full bg-border overflow-hidden flex">
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
            <div className="rounded-[24px] border border-border bg-primary text-white p-7 sm:p-8 flex flex-col">
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
              <div className="rounded-[24px] border border-border bg-surface p-7">
                <div className="w-10 h-10 rounded-xl bg-accent-light text-accent flex items-center justify-center border border-accent/10"><Boxes className="w-5 h-5" /></div>
                <h3 className="mt-3 font-semibold">Recipe-linked stock</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-text-secondary">Every Cappuccino deducts 150 ml milk + 18 g beans. Variance tells you where stock disappears.</p>
              </div>
              <div className="rounded-[24px] border border-border bg-surface p-7">
                <div className="w-10 h-10 rounded-xl bg-info-bg text-info flex items-center justify-center border border-info/15"><LineChart className="w-5 h-5" /></div>
                <h3 className="mt-3 font-semibold">A dashboard that earns its keep</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-text-secondary">Live sales, low-stock alerts, customer CRM from phone numbers, exportable variance report.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border">
        <div className="max-w-[1160px] mx-auto px-6 lg:px-8 h-14 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-text-muted">
          <span>© {new Date().getFullYear()} CafeFlow — Built for independent cafes</span>
          <div className="flex items-center gap-2">
            <Link href="/menu?table=1" className="px-3 py-1.5 rounded-full border border-border hover:bg-surface-hover">Menu</Link>
            <Link href="/scan" className="px-3 py-1.5 rounded-full border border-border hover:bg-surface-hover">Scan</Link>
            <Link href="/login" className="px-4 py-1.5 rounded-full bg-primary text-white font-medium hover:bg-primary-hover">Staff Login</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
