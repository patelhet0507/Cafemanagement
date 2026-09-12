"use client";

import { motion } from "framer-motion";
import { Check, Clock, ArrowLeft } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface OrderConfirmationProps {
  tableNumber: number;
  total: number;
  onBack: () => void;
}

export function OrderConfirmation({ tableNumber, total, onBack }: OrderConfirmationProps) {
  const steps = [
    { label: "Order Received", done: true },
    { label: "Accepted", done: false },
    { label: "Preparing", done: false, active: true },
    { label: "Ready", done: false },
    { label: "Completed", done: false },
  ];

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-sm bg-surface rounded-2xl p-6 shadow-lg text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", delay: 0.2, damping: 15 }}
          className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-success/10 text-success mb-4"
        >
          <Check className="w-8 h-8" strokeWidth={3} />
        </motion.div>

        <h2 className="text-xl font-semibold">Your order has been placed ✓</h2>

        <div className="mt-4 p-4 rounded-xl bg-background border border-border">
          <p className="text-sm text-text-secondary">Table</p>
          <p className="text-2xl font-semibold font-mono">0{tableNumber}</p>
          <p className="text-sm text-text-secondary mt-2">Total</p>
          <p className="text-xl font-semibold font-mono text-accent">{formatCurrency(total)}</p>
        </div>

        <p className="text-sm text-text-secondary mt-4">
          Please pay at the counter before leaving.
        </p>

        {/* Status timeline */}
        <div className="mt-6 space-y-2">
          {steps.map((step) => (
            <div key={step.label} className="flex items-center gap-3">
              <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                step.done ? "bg-success text-white" :
                step.active ? "bg-accent text-white animate-pulse" :
                "bg-surface-hover text-text-muted"
              }`}>
                {step.done ? (
                  <Check className="w-3 h-3" strokeWidth={3} />
                ) : step.active ? (
                  <Clock className="w-3 h-3" />
                ) : (
                  <div className="w-1.5 h-1.5 rounded-full bg-current" />
                )}
              </div>
              <span className={`text-xs font-medium ${
                step.done ? "text-success" : step.active ? "text-accent" : "text-text-muted"
              }`}>
                {step.label}
              </span>
            </div>
          ))}
        </div>

        <p className="text-xs text-text-muted mt-6">Estimated time: 12-15 minutes</p>

        <button
          onClick={onBack}
          className="mt-4 flex items-center gap-1.5 mx-auto text-xs font-medium text-text-secondary hover:text-text-primary transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to menu
        </button>
      </motion.div>
    </div>
  );
}
