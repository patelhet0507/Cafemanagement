"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Play, Check, ChefHat, Bell } from "lucide-react";

interface KOT {
  id: string;
  table: number;
  items: { name: string; qty: number; modifiers?: string }[];
  time: string;
  status: "new" | "preparing" | "ready";
}

const initialKOTs: KOT[] = [
  { id: "o1042", table: 4, items: [{ name: "Cold Coffee", qty: 2, modifiers: "Extra Vanilla" }, { name: "Veg Sandwich", qty: 1 }], time: "18:42", status: "new" },
  { id: "o1041", table: 2, items: [{ name: "Cappuccino", qty: 1 }, { name: "Chocolate Brownie", qty: 1 }], time: "18:35", status: "preparing" },
  { id: "o1040", table: 6, items: [{ name: "Masala Chai", qty: 2 }, { name: "Cheese Toast", qty: 2 }], time: "18:28", status: "new" },
];

const columnConfig = {
  new: { label: "NEW", color: "text-warning", bg: "bg-warning/10" },
  preparing: { label: "PREPARING", color: "text-info", bg: "bg-info/10" },
  ready: { label: "READY", color: "text-success", bg: "bg-success/10" },
};

function KOTCard({ kot, onMove }: { kot: KOT; onMove: (id: string, status: KOT["status"]) => void }) {
  const nextStatus = kot.status === "new" ? "preparing" : kot.status === "preparing" ? "ready" : null;
  return (
    <motion.div layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
      className="bg-surface rounded-xl border border-border p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold">T{kot.table}</span>
          <span className="text-xs text-text-muted">#{kot.id}</span>
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
  const [kots, setKots] = useState(initialKOTs);
  const moveKOT = (id: string, status: KOT["status"]) => {
    setKots((prev) => prev.map((k) => k.id === id ? { ...k, status } : k));
  };
  const columns: KOT["status"][] = ["new", "preparing", "ready"];

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-20 bg-background/80 backdrop-blur-md border-b border-border px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-accent text-white"><ChefHat className="w-4 h-4" /></div>
            <div><h1 className="text-lg font-semibold">Kitchen Display</h1><p className="text-xs text-text-muted">Live order queue</p></div>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-warning/10 text-warning text-xs font-medium">
            <Bell className="w-3.5 h-3.5" /> {kots.filter((k) => k.status === "new").length} new orders
          </div>
        </div>
      </div>
      <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
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
