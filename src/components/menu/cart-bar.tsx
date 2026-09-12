"use client";

import { motion } from "framer-motion";
import { ShoppingBag } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface CartBarProps {
  itemCount: number;
  total: number;
  onClick: () => void;
}

export function CartBar({ itemCount, total, onClick }: CartBarProps) {
  if (itemCount === 0) return null;

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
      className="fixed bottom-0 inset-x-0 z-40 p-4 sm:hidden"
    >
      <button
        onClick={onClick}
        className="w-full flex items-center justify-between py-3.5 px-5 rounded-2xl bg-accent text-white shadow-xl"
      >
        <div className="flex items-center gap-2">
          <ShoppingBag className="w-4 h-4" />
          <span className="text-sm font-medium">{itemCount} item{itemCount !== 1 ? "s" : ""}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold font-mono">{formatCurrency(total)}</span>
          <span className="text-xs opacity-70">View Cart →</span>
        </div>
      </button>
    </motion.div>
  );
}
