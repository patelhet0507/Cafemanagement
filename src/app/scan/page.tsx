"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Coffee, ScanLine, Keyboard, ArrowRight } from "lucide-react";

export default function ScanPage() {
  const router = useRouter();
  const [manual, setManual] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);
  const scannerRef = useRef<{ clear: () => Promise<void> } | null>(null);

  const goTable = async (n: string) => {
    const num = parseInt(n);
    if (!num || num < 1 || num > 100) { setError("Enter table 1-100"); return; }
    // occupied check for dine-in
    try {
      const { supabase } = await import("@/lib/supabase");
      const { data } = await supabase.from("tables").select("status").eq("number", num).maybeSingle();
      if ((data as { status: string } | null)?.status === "occupied") {
        setError(`Table ${String(num).padStart(2, "0")} is occupied — ask staff or choose another table.`);
        return;
      }
    } catch {}
    router.push(`/menu?table=${num}`);
  };

  const handleScan = (decoded: string) => {
    try {
      // try to extract table number from URL or plain number
      const url = new URL(decoded, window.location.origin);
      const t = url.searchParams.get("table");
      if (t) return goTable(t);
      const num = decoded.match(/\d+/);
      if (num) return goTable(num[0]);
      goTable(decoded);
    } catch {
      const num = decoded.match(/\d+/);
      if (num) goTable(num[0]);
      else setError(`Scanned: ${decoded}`);
    }
  };

  useEffect(() => {
    let mounted = true;
    const start = async () => {
      try {
        const { Html5Qrcode } = await import("html5-qrcode");
        if (!mounted) return;
        const id = "qr-reader";
        const el = document.getElementById(id);
        if (!el) return;
        const qr = new Html5Qrcode(id);
        scannerRef.current = qr as unknown as { clear: () => Promise<void> };
        await qr.start(
          { facingMode: "environment" },
          { fps: 10, qrbox: { width: 250, height: 250 } },
          (decoded) => { handleScan(decoded); qr.stop().catch(() => {}); },
          () => {}
        );
        setScanning(true);
      } catch (e) {
        setError((e as Error).message.includes("Permission") ? "Camera permission denied — use manual entry below." : "Camera not available — use manual entry.");
      }
    };
    start();
    return () => {
      mounted = false;
      scannerRef.current?.clear().catch(() => {});
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <nav className="h-14 flex items-center justify-between px-6 border-b border-border bg-surface/80 backdrop-blur">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-primary text-white flex items-center justify-center"><Coffee className="w-4 h-4" /></div>
          <span className="font-semibold">CafeFlow</span>
          <span className="text-[11px] tracking-widest bg-surface-hover border border-border px-2 py-0.5 rounded-full text-text-muted hidden sm:inline">QR SCAN</span>
        </Link>
        <Link href="/menu?table=1" className="text-sm text-text-secondary hover:text-text-primary">Skip → Menu</Link>
      </nav>

      <main className="flex-1 max-w-2xl mx-auto w-full px-6 py-8 space-y-6">
        <div className="text-center">
          <div className="w-14 h-14 rounded-2xl bg-accent/10 text-accent flex items-center justify-center mx-auto"><ScanLine className="w-7 h-7" /></div>
          <h1 className="text-2xl font-semibold mt-3">Scan table QR</h1>
          <p className="text-sm text-text-secondary mt-1">Point camera at the QR on your table to open the menu. Table will be marked occupied as soon as you add an item.</p>
        </div>

        <div className="rounded-2xl overflow-hidden border border-border bg-surface">
          <div id="qr-reader" className="w-full min-h-[280px] bg-black" />
          {!scanning && <p className="text-xs text-center text-text-muted py-2">Starting camera…</p>}
          {error && <p className="text-xs text-center text-error bg-error-bg px-3 py-2">{error}</p>}
        </div>

        <div className="rounded-2xl border border-border bg-surface p-5">
          <h3 className="font-semibold flex items-center gap-2"><Keyboard className="w-4 h-4" /> Or enter table number</h3>
          <div className="flex gap-2 mt-3">
            <input value={manual} onChange={(e) => setManual(e.target.value)} placeholder="e.g. 4" type="number" className="flex-1 px-4 py-3 rounded-xl border border-border bg-background text-sm outline-none focus:border-accent" />
            <button onClick={() => goTable(manual)} className="px-6 py-3 rounded-xl bg-accent text-white font-semibold flex items-center gap-1.5 hover:bg-accent-hover">Go <ArrowRight className="w-4 h-4" /></button>
          </div>
          <p className="text-[11px] text-text-muted mt-2">Staff: generate QR as <span className="font-mono bg-surface-hover px-1 py-0.5 rounded">/menu?table=NUMBER</span></p>
        </div>
      </main>
    </div>
  );
}
