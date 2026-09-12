"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Play, Check, ChefHat, Bell } from "lucide-react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

interface KOT {
  id: string; // full UUID when live, short mock id when offline
  shortId: string;
  table: number;
  items: { name: string; qty: number; modifiers?: string }[];
  time: string;
  status: "new" | "preparing" | "ready";
}

const initialKOTs: KOT[] = [
  { id: "o1042", shortId: "1042", table: 4, items: [{ name: "Cold Coffee", qty: 2, modifiers: "Extra Vanilla" }, { name: "Veg Sandwich", qty: 1 }], time: "18:42", status: "new" },
  { id: "o1041", shortId: "1041", table: 2, items: [{ name: "Cappuccino", qty: 1 }, { name: "Chocolate Brownie", qty: 1 }], time: "18:35", status: "preparing" },
  { id: "o1040", shortId: "1040", table: 6, items: [{ name: "Masala Chai", qty: 2 }, { name: "Cheese Toast", qty: 2 }], time: "18:28", status: "new" },
];

const columnConfig = {
  new: { label: "NEW", color: "text-warning", bg: "bg-warning/10" },
  preparing: { label: "PREPARING", color: "text-info", bg: "bg-info/10" },
  ready: { label: "READY", color: "text-success", bg: "bg-success/10" },
};

function KOTCard({ kot, onMove }: { kot: KOT; onMove: (fullId: string, status: KOT["status"]) => void }) {
  const nextStatus = kot.status === "new" ? "preparing" : kot.status === "preparing" ? "ready" : null;
  return (
    <motion.div layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
      className="bg-surface rounded-xl border border-border p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold">T{kot.table}</span>
          <span className="text-xs text-text-muted">#{kot.shortId}</span>
        </div>
        <span className="text-xs text-text-muted">{kot.time}</span>
      </div>
      <div className="space-y-1.5 mb-4">
        {kot.items.map((item, i) => (
          <div key={i} className="flex items-start gap-2">
            <span className="text-sm font-semibold font-mono shrink-0">{item.qty}x</span>
            <div>
              <span className="text-sm">{item.name}</span>
              {item.modifiers && <p className="text-[10px] text-accent">{item.modifiers}</p>}
            </div>
          </div>
        ))}
      </div>
      <button onClick={() => window.print()} className="w-full py-1.5 rounded-lg bg-accent text-white text-xs font-semibold hover:bg-accent-hover border border-accent">Print KOT</button>
      {nextStatus && (
        <button onClick={() => onMove(kot.id, nextStatus)}
          className={cn("w-full py-2.5 rounded-lg text-sm font-semibold flex items-center justify-center gap-1.5 transition-colors",
            nextStatus === "preparing" ? "bg-info text-white hover:bg-info/90" : "bg-success text-white hover:bg-success/90")}>
          {nextStatus === "preparing" ? <><Play className="w-4 h-4" /> START</> : <><Check className="w-4 h-4" /> READY</>}
        </button>
      )}
    </motion.div>
  );
}

export default function KitchenPage() {
  const [kots, setKots] = useState<KOT[]>(initialKOTs);

  const fetchKOTs = useCallback(async () => {
    if (!isSupabaseConfigured) return;
    const { data: orders } = await supabase.from("orders").select("id, status, table_id, created_at").in("status", ["pending", "confirmed", "preparing", "ready"]).order("created_at", { ascending: true }).limit(24);
    if (!orders?.length) return;
    const ids = (orders as { id: string }[]).map((o) => o.id);
    const { data: items } = ids.length ? await supabase.from("order_items").select("order_id, quantity, menu_item_id").in("order_id", ids) : { data: [] as unknown[] };
    const { data: menu } = await supabase.from("menu_items").select("id, name");
    const { data: tables } = await supabase.from("tables").select("id, number");
    const menuMap = new Map((menu as { id: string; name: string }[] | null)?.map((m) => [m.id, m.name]) ?? []);
    const tableMap = new Map((tables as { id: string; number: number }[] | null)?.map((t) => [t.id, t.number]) ?? []);
    const statusMap = (s: string): KOT["status"] => (s === "pending" || s === "confirmed" ? "new" : s === "preparing" ? "preparing" : "ready");
    const grouped = new Map<string, KOT>();
    for (const o of orders as { id: string; status: string; table_id: string; created_at: string }[]) {
      const short = o.id.slice(0, 4).toUpperCase();
      grouped.set(o.id, { id: o.id, shortId: short, table: tableMap.get(o.table_id) ?? 0, items: [], time: new Date(o.created_at).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }), status: statusMap(o.status) });
    }
    for (const it of (items as { order_id: string; quantity: number; menu_item_id: string }[] | null) ?? []) {
      const kot = grouped.get(it.order_id);
      if (kot) kot.items.push({ name: menuMap.get(it.menu_item_id) ?? "Item", qty: it.quantity });
    }
    const live = Array.from(grouped.values());
    // show all orders, even if items not yet loaded (helps debug)
    setKots(live.length ? live : []);
  }, []);

  useEffect(() => {
    void fetchKOTs();
    if (!isSupabaseConfigured) return;
    const ch = supabase.channel("kitchen-orders").on("postgres_changes", { event: "*", schema: "public", table: "orders" }, fetchKOTs).on("postgres_changes", { event: "*", schema: "public", table: "order_items" }, fetchKOTs).subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [fetchKOTs]);

  const moveKOT = async (fullId: string, status: KOT["status"]) => {
    const prev = kots.find((k) => k.id === fullId)?.status;
    setKots((p) => p.map((k) => (k.id === fullId ? { ...k, status } : k)));
    if (!isSupabaseConfigured) return;
    const dbStatus = status === "new" ? "pending" : status === "preparing" ? "preparing" : "ready";
    const { error } = await supabase.from("orders").update({ status: dbStatus } as never).eq("id", fullId);
    if (error) {
      if (prev) setKots((p) => p.map((k) => (k.id === fullId ? { ...k, status: prev } : k)));
      alert(error.message.includes("schema cache") ? "Schema cache stale — run NOTIFY pgrst, 'reload schema';" : error.message);
    }
  };
  const columns: KOT["status"][] = ["new", "preparing", "ready"];

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-text-secondary">Live order queue</p>
        <div className="flex items-center gap-2">
          <a href="/display" target="_blank" className="px-3 py-1.5 rounded-full bg-[#0C0A09] text-white text-xs font-semibold hover:bg-black">TV Display ↗</a>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-warning/10 text-warning text-xs font-medium">
            <Bell className="w-3.5 h-3.5" /> {kots.filter((k) => k.status === "new").length} new orders
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {columns.map((col) => {
          const config = columnConfig[col];
          const colKots = kots.filter((k) => k.status === col);
          return (
            <div key={col} className="space-y-3">
              <div className="flex items-center gap-2 mb-4">
                <div className={cn("w-2.5 h-2.5 rounded-full", config.bg)} />
                <h2 className={cn("text-sm font-bold tracking-wider", config.color)}>{config.label}</h2>
                <span className="text-xs text-text-muted bg-surface-hover px-2 py-0.5 rounded-full">{colKots.length}</span>
              </div>
              <div className="space-y-3 min-h-[200px]">
                <AnimatePresence>
                  {colKots.map((kot) => <KOTCard key={kot.id} kot={kot} onMove={moveKOT} />)}
                </AnimatePresence>
                {colKots.length === 0 && (
                  <div className="flex items-center justify-center h-32 rounded-xl border border-dashed border-border text-text-muted text-sm">
                    No orders
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
