"use client";

import { motion } from "framer-motion";
import { Check, Clock, ArrowLeft, Bell, BellOff, Plus, Bike } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface Props {
  tableNumber: number;
  total: number;
  onBack: () => void;
  liveStatus?: string | null;
  orderId?: string | null;
  orderType?: "dine_in" | "takeout";
  notifOn?: boolean;
  onNotifToggle?: () => void;
  onAddMore?: () => void;
}

export function OrderConfirmation({ tableNumber, total, onBack, liveStatus, orderId, orderType = "dine_in", notifOn, onNotifToggle, onAddMore }: Props) {
  const status = (liveStatus || "pending").toLowerCase();
  const isServed = status === "served";
  if (isServed) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-full max-w-sm bg-surface rounded-2xl p-6 shadow-lg text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-success/10 text-success mb-4"><Check className="w-8 h-8" strokeWidth={3} /></div>
          <h2 className="text-xl font-semibold">Thank you! ✓</h2>
          <p className="text-sm text-text-secondary mt-1">Order #{orderId?.slice(0, 6).toUpperCase()} collected</p>
          <p className="text-xs text-text-muted mt-2">We hope you enjoyed your meal.</p>
          <button onClick={onAddMore} className="mt-6 w-full flex items-center justify-center gap-1.5 py-3 rounded-xl bg-accent text-white font-semibold hover:bg-accent-hover"><Plus className="w-4 h-4" /> Order more</button>
          <button onClick={onBack} className="mt-3 w-full py-2.5 rounded-xl border border-border text-sm">Back to menu</button>
        </motion.div>
      </div>
    );
  }
  const isPaid = status === "paid";
  const steps = [
    { label: "Order Received", key: "pending", done: ["confirmed", "preparing", "ready", "paid", "served"].includes(status), active: status === "pending" },
    { label: "Preparing", key: "preparing", done: ["ready", "paid", "served"].includes(status), active: status === "preparing" },
    { label: "Ready", key: "ready", done: ["paid", "served"].includes(status), active: status === "ready" },
    { label: "Completed", key: "paid", done: isPaid, active: false },
  ];

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-full max-w-sm bg-surface rounded-2xl p-6 shadow-lg text-center">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", delay: 0.2, damping: 15 }} className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-success/10 text-success mb-4">
          <Check className="w-8 h-8" strokeWidth={3} />
        </motion.div>
        <h2 className="text-xl font-semibold">Your order placed ✓</h2>
        <p className="text-xs font-mono text-text-muted mt-1">#{orderId?.slice(0, 6).toUpperCase() ?? "—"}</p>
        <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-medium">
          {orderType === "takeout" ? <><Bike className="w-3 h-3" /> Takeout — collect at counter</> : <>Table {String(tableNumber).padStart(2, "0")} • Dine-in</>}
        </div>
        <div className="mt-4 p-4 rounded-xl bg-background border border-border">
          <p className="text-sm text-text-secondary">{orderType === "takeout" ? "Takeout" : "Table"}</p>
          <p className="text-2xl font-semibold font-mono">{orderType === "takeout" ? "Takeout" : `0${tableNumber}`}</p>
          <p className="text-sm text-text-secondary mt-2">Total</p>
          <p className="text-xl font-semibold font-mono text-accent">{formatCurrency(total)}</p>
          <p className="text-xs text-text-muted mt-1 capitalize">Status: {status}</p>
        </div>
        {orderType === "takeout" ? <p className="text-sm text-text-secondary mt-3">Collect at the counter when ready.</p> : <p className="text-sm text-text-secondary mt-3">Please pay at the counter before leaving.</p>}

        <div className="mt-4 flex gap-2">
          <button onClick={onNotifToggle} className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl border text-xs font-medium ${notifOn ? "bg-accent text-white border-accent" : "bg-surface border-border"}`}>
            {notifOn ? <><Bell className="w-3.5 h-3.5" /> Notifications on</> : <><BellOff className="w-3.5 h-3.5" /> Notify when ready</>}
          </button>
          <button onClick={onAddMore} className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl border border-border bg-surface text-xs font-medium"><Plus className="w-3.5 h-3.5" /> Add more</button>
        </div>

        <div className="mt-6 space-y-2 text-left">
          {steps.map((s) => (
            <div key={s.label} className="flex items-center gap-3">
              <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${s.done ? "bg-success text-white" : s.active ? "bg-accent text-white animate-pulse" : "bg-surface-hover text-text-muted"}`}>
                {s.done ? <Check className="w-3 h-3" strokeWidth={3} /> : s.active ? <Clock className="w-3 h-3" /> : <div className="w-1.5 h-1.5 rounded-full bg-current" />}
              </div>
              <span className={`text-xs font-medium ${s.done ? "text-success" : s.active ? "text-accent" : "text-text-muted"}`}>{s.label}</span>
            </div>
          ))}
        </div>
        <p className="text-xs text-text-muted mt-6">Stay on this page — updates live. You can refresh, order stays.</p>
        <button onClick={onBack} className="mt-4 flex items-center gap-1.5 mx-auto text-xs font-medium text-text-secondary hover:text-text-primary"><ArrowLeft className="w-3.5 h-3.5" /> Back to menu</button>
      </motion.div>
    </div>
  );
}
