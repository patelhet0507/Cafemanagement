"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { X, Minus, Plus, ShoppingBag, Trash2, Tag } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import type { MenuItem } from "@/types/database";

export interface CartItem {
  item: MenuItem;
  quantity: number;
}

interface CartSheetProps {
  open: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onPlaceOrder: (total: number) => void;
}

export function CartSheet({ open, onClose, items, onUpdateQuantity, onPlaceOrder }: CartSheetProps) {
  const [coupon, setCoupon] = useState("");
  const couponDiscount = coupon.toUpperCase() === "WELCOME10" ? Math.round((items.reduce((s, ci) => s + ci.item.price * ci.quantity, 0)) * 0.1) : 0;
  const subtotal = items.reduce((sum, ci) => sum + ci.item.price * ci.quantity, 0);
  const tax = Math.round(subtotal * 0.05);
  const isHappyHour = new Date().getHours() >= 15 && new Date().getHours() < 17;
  const happyDiscount = isHappyHour ? Math.round(subtotal * 0.15) : 0;
  const points = Math.floor(subtotal / 10);
  const total = subtotal + tax - happyDiscount - couponDiscount;

  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="absolute right-0 top-0 h-full w-full max-w-md bg-surface shadow-2xl flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-accent" />
              <h2 className="text-lg font-semibold">Your Order</h2>
              <span className="text-xs font-mono text-text-muted bg-surface-hover px-2 py-0.5 rounded-full">
                {items.length} items
              </span>
            </div>
            <button onClick={onClose} className="p-2 rounded-lg hover:bg-surface-hover transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Items */}
          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-text-muted">
                <ShoppingBag className="w-10 h-10 mb-3 opacity-40" />
                <p className="text-sm">Your cart is empty</p>
              </div>
            ) : (
              items.map((ci) => (
                <div key={ci.item.id} className="flex items-center gap-3 p-3 rounded-xl bg-background border border-border">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{ci.item.name}</p>
                    <p className="text-xs text-accent font-mono font-semibold mt-0.5">
                      {formatCurrency(ci.item.price)}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => onUpdateQuantity(ci.item.id, ci.quantity - 1)}
                      className="w-8 h-8 rounded-lg bg-surface-hover flex items-center justify-center hover:bg-error/10 hover:text-error transition-colors"
                    >
                      {ci.quantity === 1 ? <Trash2 className="w-3.5 h-3.5" /> : <Minus className="w-3.5 h-3.5" />}
                    </button>
                    <span className="w-8 text-center text-sm font-semibold font-mono">{ci.quantity}</span>
                    <button
                      onClick={() => onUpdateQuantity(ci.item.id, ci.quantity + 1)}
                      className="w-8 h-8 rounded-lg bg-accent/10 text-accent flex items-center justify-center hover:bg-accent hover:text-white transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="px-5 py-4 border-t border-border space-y-3">
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between text-text-secondary">
                  <span>Subtotal</span>
                  <span className="font-mono">{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between text-text-secondary">
                  <span>GST (5%)</span>
                  <span className="font-mono">{formatCurrency(tax)}</span>
                </div>
                {isHappyHour && <div className="flex justify-between text-success font-medium"><span>Happy Hour -15%</span><span className="font-mono">-{formatCurrency(happyDiscount)}</span></div>}
                <div className="flex items-center gap-2 py-1"><Tag className="w-3.5 h-3.5 text-text-muted" /><input value={coupon} onChange={(e) => setCoupon(e.target.value)} placeholder="Coupon WELCOME10" className="flex-1 px-2 py-1 rounded-lg border border-border bg-background text-xs outline-none" /><span className="text-xs font-mono text-success">{couponDiscount ? `-${formatCurrency(couponDiscount)}` : ""}</span></div>
                <div className="flex justify-between text-accent text-xs"><span>Loyalty</span><span className="font-mono">{points} pts (₹{points}) off next</span></div>
                <div className="flex justify-between font-semibold text-base pt-1.5 border-t border-border">
                  <span>Total</span>
                  <span className="font-mono">{formatCurrency(total)}</span>
                </div>
              </div>
              <button
                onClick={() => onPlaceOrder(total)}
                className="w-full py-3.5 rounded-xl bg-accent text-white font-semibold hover:bg-accent-hover transition-colors"
              >
                Place Order — {formatCurrency(total)}
              </button>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
