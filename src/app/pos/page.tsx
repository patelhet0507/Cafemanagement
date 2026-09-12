"use client";

import { useState, useMemo, useEffect } from "react";
import { cn, formatCurrency } from "@/lib/utils";
import { mockTables, mockOrders } from "@/lib/mock-data";
import { useSupabaseTable } from "@/lib/supabase-helpers";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { Clock, X, CreditCard, Banknote, Smartphone, Check, Users, UtensilsCrossed, ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import type { CafeTable, Order } from "@/types/database";

const statusConfig: Record<string, { label: string; dot: string; bg: string; border: string }> = {
  available: { label: "Available", dot: "bg-table-available", bg: "bg-table-available/[0.07]", border: "border-table-available/20" },
  occupied: { label: "Occupied", dot: "bg-table-occupied", bg: "bg-table-occupied/[0.07]", border: "border-table-occupied/20" },
  reserved: { label: "Reserved", dot: "bg-table-reserved", bg: "bg-table-reserved/[0.07]", border: "border-table-reserved/20" },
};

const PAY_METHODS = [
  { id: "cash", label: "Cash", icon: Banknote },
  { id: "upi", label: "UPI", icon: Smartphone },
  { id: "card", label: "Card", icon: CreditCard },
] as const;

export default function POSPage() {
  const [filter, setFilter] = useState<"all" | CafeTable["status"]>("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [payMethod, setPayMethod] = useState<string>("cash");
  const [paid, setPaid] = useState<Set<string>>(new Set());

  const { data: tables } = useSupabaseTable<CafeTable>("tables", mockTables);
  const { data: orders, refetch: refetchOrders } = useSupabaseTable<Order>(
    "orders",
    mockOrders,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (q: any) => q.eq("payment_status", "unpaid").order("created_at", { ascending: false })
  );

  // realtime unpaid orders
  useEffect(() => {
    if (!isSupabaseConfigured) return;
    const ch = supabase
      .channel("pos-orders")
      .on("postgres_changes", { event: "*", schema: "public", table: "orders" }, () => refetchOrders())
      .subscribe();
    return () => {
      supabase.removeChannel(ch);
    };
  }, [refetchOrders]);

  const filtered = useMemo(() => filter === "all" ? tables : tables.filter((t) => t.status === filter), [tables, filter]);
  const selected = selectedId ? tables.find((t) => t.id === selectedId) ?? null : null;
  const selectedOrder = selected ? orders.find((o) => o.table_id === selected.id) : null;
  const isPaid = selected ? paid.has(selected.id) : false;

  const stats = useMemo(
    () => ({
      total: tables.length,
      avail: tables.filter((t) => t.status === "available").length,
      occ: tables.filter((t) => t.status === "occupied").length,
    }),
    [tables]
  );

  const markPaid = async () => {
    if (!selected || !selectedOrder) return;
    if (isSupabaseConfigured) {
      await supabase.from("orders").update({ payment_status: "paid", payment_method: payMethod, status: "paid" } as never).eq("id", selectedOrder.id);
      await supabase.from("tables").update({ status: "available" } as never).eq("id", selected.id);
    }
    setPaid((s) => new Set(s).add(selected.id));
    setTimeout(() => setSelectedId(null), 600);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-surface/80 backdrop-blur-md border-b border-border">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="hidden sm:flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary">
              <ArrowLeft className="w-4 h-4" /> Dashboard
            </Link>
            <div className="h-5 w-px bg-border hidden sm:block" />
            <h1 className="font-semibold tracking-tight">Tables</h1>
            <span className="hidden sm:inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full bg-surface-hover border border-border">
              <span className="w-2 h-2 rounded-full bg-success animate-pulse" /> Live
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="hidden sm:inline text-text-muted">{stats.occ} occupied · {stats.avail} free · {stats.total} total</span>
            <Link href="/kitchen" className="px-3 py-1.5 rounded-lg bg-accent text-white font-medium hover:bg-accent-hover transition-colors">Kitchen →</Link>
          </div>
        </div>
      </header>

      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-6 space-y-5">
        {/* Legend + filters */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            {(["all", "available", "occupied", "reserved"] as const).map(f => (
              <button key={f} onClick={() => setFilter(f)}
                className={cn("px-3.5 py-1.5 rounded-full text-xs font-medium border transition-colors capitalize",
                  filter === f ? "bg-primary text-white border-primary" : "bg-surface border-border text-text-secondary hover:bg-surface-hover")}>
                {f}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3 text-[11px] text-text-muted">
            {Object.entries(statusConfig).map(([k, v]) => (
              <span key={k} className="flex items-center gap-1.5"><span className={cn("w-2 h-2 rounded-full", v.dot)} />{v.label}</span>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3 sm:gap-4">
          {filtered.map((table) => {
            const order = orders.find((o) => o.table_id === table.id);
            const hasOrder = !!order && !paid.has(table.id);
            const cfg = statusConfig[hasOrder ? "occupied" : table.status] ?? statusConfig.available;
            const isSelected = selectedId === table.id;
            return (
              <button key={table.id} onClick={() => setSelectedId(table.id)}
                className={cn("text-left p-4 rounded-2xl border-2 bg-surface transition-all hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
                  isSelected ? "border-accent shadow-md ring-2 ring-accent/20" : hasOrder ? "border-table-occupied/25 bg-table-occupied/[0.04]" : cfg.border + " " + cfg.bg,
                  "min-h-[128px] flex flex-col")}>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold tracking-widest text-text-muted">T{String(table.number).padStart(2, "0")}</span>
                  <span className={cn("w-2.5 h-2.5 rounded-full", hasOrder ? "bg-table-occupied" : cfg.dot)} aria-hidden />
                </div>
                <p className="mt-1 font-semibold leading-tight">{table.name}</p>
                <p className="text-xs text-text-secondary flex items-center gap-1 mt-0.5"><Users className="w-3 h-3" /> {table.capacity} seats</p>
                <div className="mt-auto pt-3">
                  {isPaid ? (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-success"><Check className="w-3.5 h-3.5" /> Paid</span>
                  ) : hasOrder ? (
                    <div>
                      <p className="text-sm font-mono font-semibold text-accent">{formatCurrency(order.total)}</p>
                      <p className="text-[11px] text-text-muted flex items-center gap-1"><Clock className="w-3 h-3" /> 18 min · 2 items</p>
                    </div>
                  ) : (
                    <span className={cn("inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wide", cfg.bg, "border", cfg.border)}>{cfg.label}</span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
        {filtered.length === 0 && (
          <div className="py-16 text-center rounded-xl border border-dashed border-border bg-surface">
            <UtensilsCrossed className="w-8 h-8 mx-auto text-text-muted mb-2" />
            <p className="text-sm text-text-secondary">No {filter} tables</p>
          </div>
        )}
      </div>

      {/* Selected drawer */}
      <AnimatePresence>
        {selected && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedId(null)} className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40" />
            <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 28, stiffness: 320 }}
              className="fixed right-0 top-0 h-full w-full max-w-[420px] bg-surface shadow-2xl z-50 flex flex-col">
              <div className="flex items-center justify-between px-5 h-14 border-b border-border shrink-0">
                <div>
                  <h2 className="font-semibold">Table {String(selected.number).padStart(2, "0")} — {selected.name}</h2>
                  <p className="text-xs text-text-secondary">{selected.capacity} seats · {statusConfig[selected.status].label}</p>
                </div>
                <button onClick={() => setSelectedId(null)} className="w-8 h-8 rounded-lg hover:bg-surface-hover flex items-center justify-center"><X className="w-5 h-5" /></button>
              </div>

              <div className="flex-1 overflow-y-auto p-5 space-y-4">
                {!selectedOrder || isPaid ? (
                  <div className="py-10 text-center">
                    <div className="w-12 h-12 rounded-2xl bg-accent/10 text-accent flex items-center justify-center mx-auto mb-3"><UtensilsCrossed className="w-6 h-6" /></div>
                    <p className="text-sm font-medium">{isPaid ? "Bill settled — table free to reassign" : "No active order"}</p>
                    <p className="text-xs text-text-muted mt-1">{isPaid ? "Tap to clear selection." : "Customer can scan QR at the table to order, or take order manually."}</p>
                    <div className="mt-4 flex gap-2 justify-center">
                      <Link href={`/menu?table=${selected.number}`} className="px-4 py-2 rounded-xl bg-accent text-white text-sm font-medium hover:bg-accent-hover">Open Menu (QR)</Link>
                      <button onClick={() => setSelectedId(null)} className="px-4 py-2 rounded-xl border border-border text-sm hover:bg-surface-hover">Close</button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="rounded-xl border border-border overflow-hidden">
                      <div className="px-4 py-3 bg-background border-b border-border flex items-center justify-between">
                        <span className="text-xs font-semibold tracking-widest text-text-muted">ORDER #{selectedOrder.id.toUpperCase()}</span>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-info-bg text-info-text font-semibold capitalize">{selectedOrder.status}</span>
                      </div>
                      <div className="divide-y divide-border">
                        <div className="px-4 py-3 flex justify-between text-sm"><span className="text-text-secondary">2× Cold Coffee</span><span className="font-mono font-medium">₹360</span></div>
                        <div className="px-4 py-3 flex justify-between text-sm"><span className="text-text-secondary">1× Veg Sandwich</span><span className="font-mono font-medium">₹140</span></div>
                        <div className="px-4 py-2.5 flex justify-between text-xs text-text-muted"><span>GST 5%</span><span className="font-mono">₹25</span></div>
                        <div className="px-4 py-3 flex justify-between font-semibold"><span>Total</span><span className="font-mono text-accent">{formatCurrency(selectedOrder.total)}</span></div>
                      </div>
                    </div>

                    <div>
                      <p className="text-xs font-semibold tracking-widest text-text-muted mb-2">PAYMENT METHOD</p>
                      <div className="grid grid-cols-3 gap-2">
                        {PAY_METHODS.map(m => (
                          <button key={m.id} onClick={() => setPayMethod(m.id)}
                            className={cn("py-3 rounded-xl border flex flex-col items-center gap-1.5 text-xs font-medium transition-colors",
                              payMethod === m.id ? "bg-accent text-white border-accent" : "bg-background border-border hover:bg-surface-hover")}>
                            <m.icon className="w-5 h-5" />{m.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>

              {selectedOrder && !isPaid && (
                <div className="p-5 border-t border-border space-y-2">
                  <button onClick={markPaid}
                    className="w-full py-3 rounded-xl bg-success text-white font-semibold hover:bg-success/90 transition-colors flex items-center justify-center gap-2">
                    <Check className="w-4 h-4" /> Mark Paid — {formatCurrency(selectedOrder.total)}
                  </button>
                  <p className="text-[11px] text-center text-text-muted">KOT already sent to kitchen · <Link href="/kitchen" className="text-accent hover:underline">View KOT</Link></p>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
