"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { Coffee, Maximize2 } from "lucide-react";

type ReadyOrder = { id: string; shortId: string; table: number; time: string };

export default function DisplayPage() {
  const [orders, setOrders] = useState<ReadyOrder[]>([
    { id: "demo1", shortId: "1042", table: 4, time: "18:42" },
    { id: "demo2", shortId: "1041", table: 2, time: "18:35" },
  ]);

  const fetchReady = useCallback(async () => {
    if (!isSupabaseConfigured) return;
    const { data } = await supabase.from("orders").select("id, table_id, created_at").eq("status", "ready").order("created_at", { ascending: true }).limit(12);
    if (!data?.length) { setOrders([]); return; }
    const { data: tables } = await supabase.from("tables").select("id, number");
    const tmap = new Map((tables as { id: string; number: number }[] | null)?.map((t) => [t.id, t.number]) ?? []);
    setOrders((data as { id: string; table_id: string; created_at: string }[]).map((o) => ({ id: o.id, shortId: o.id.slice(0, 4).toUpperCase(), table: tmap.get(o.table_id) ?? 0, time: new Date(o.created_at).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }) })));
  }, []);

  useEffect(() => {
    fetchReady();
    if (!isSupabaseConfigured) return;
    const ch = supabase.channel("display-ready").on("postgres_changes", { event: "*", schema: "public", table: "orders" }, fetchReady).subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [fetchReady]);

  // auto fullscreen hint + clock
  const [now, setNow] = useState(new Date());
  useEffect(() => { const t = setInterval(() => setNow(new Date()), 1000); return () => clearInterval(t); }, []);

  return (
    <div className="min-h-screen bg-[#0C0A09] text-white flex flex-col">
      <header className="flex items-center justify-between px-6 lg:px-10 h-16 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-accent flex items-center justify-center"><Coffee className="w-5 h-5 text-white" /></div>
          <span className="font-semibold tracking-tight">CafeFlow</span>
          <span className="hidden sm:inline text-xs px-2.5 py-1 rounded-full bg-white/10 border border-white/10">READY FOR PICKUP • TV</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm font-mono text-white/70 hidden sm:inline">{now.toLocaleTimeString("en-IN")}</span>
          <button onClick={() => document.documentElement.requestFullscreen?.()} className="p-2 rounded-lg bg-white/10 hover:bg-white/15"><Maximize2 className="w-4 h-4" /></button>
          <Link href="/kitchen" className="text-xs px-3 py-1.5 rounded-full bg-white text-black font-medium">Kitchen →</Link>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-6 lg:px-10 py-8">
        {orders.length === 0 ? (
          <div className="text-center">
            <p className="text-[11px] tracking-[0.2em] text-white/40">READY ORDERS</p>
            <h1 className="font-serif text-[56px] lg:text-[84px] font-bold tracking-tight mt-2 text-white/20">—</h1>
            <p className="text-lg text-white/50 mt-4">No ready orders</p>
          </div>
        ) : (
          <>
            <p className="text-[11px] tracking-[0.2em] text-white/40 mb-6">READY FOR PICKUP — COLLECT AT COUNTER</p>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 w-full max-w-6xl">
              {orders.map((o) => (
                <div key={o.id} className="bg-white text-[#0C0A09] rounded-[28px] p-6 lg:p-8 flex flex-col items-center justify-center shadow-[0_20px_60px_rgba(0,0,0,0.4)]">
                  <p className="text-[11px] tracking-widest font-semibold text-text-muted">ORDER #{o.shortId} • TABLE {String(o.table).padStart(2, "0")}</p>
                  <p className="font-mono text-[56px] lg:text-[84px] font-black tracking-[-0.04em] leading-none mt-2">{o.shortId}</p>
                  <p className="text-sm font-semibold mt-1">Table {o.table} • {o.time}</p>
                  <span className="mt-3 text-xs font-bold tracking-widest px-3 py-1 rounded-full bg-success text-white">READY</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-white/40 mt-8">Updates live • {orders.length} ready</p>
          </>
        )}
      </main>

      <footer className="px-6 lg:px-10 py-4 text-center text-[11px] tracking-widest text-white/30 border-t border-white/10">PLEASE COLLECT YOUR ORDER AT COUNTER • THANK YOU</footer>
    </div>
  );
}
