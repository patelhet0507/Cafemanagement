"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";
import type { MenuItem } from "@/types/database";

interface MenuCardProps {
  item: MenuItem;
  onAdd: (item: MenuItem) => void;
  index?: number;
}

const categoryGradients: Record<string, string> = {
  "Hot Coffee": "from-amber-100 to-orange-50",
  "Cold Coffee": "from-blue-100 to-cyan-50",
  "Chai & Tea": "from-green-100 to-emerald-50",
  "Fresh Drinks": "from-yellow-100 to-amber-50",
  "Snacks": "from-orange-100 to-red-50",
  "Desserts": "from-purple-100 to-pink-50",
};

const categoryEmoji: Record<string, string> = {
  "Hot Coffee": "☕", "Cold Coffee": "☕", "Chai & Tea": "🍵",
  "Fresh Drinks": "🧃", "Snacks": "🥪", "Desserts": "🍰",
};

export function MenuCard({ item, onAdd, index = 0 }: MenuCardProps) {
  const gradient = categoryGradients[item.category] || "from-gray-100 to-gray-50";
  const emoji = categoryEmoji[item.category] || "🍽️";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 20, delay: Math.min(index * 0.07, 0.42) }}
      className="group relative bg-surface rounded-[20px] border border-border overflow-hidden hover:shadow-md transition-shadow duration-200"
    >
      <div className={cn("h-28 bg-gradient-to-br flex items-center justify-center overflow-hidden", gradient)}>
        {item.image_url ? <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" loading="lazy" /> : <span className="text-4xl">{emoji}</span>}
      </div>
      <div className="p-3">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="font-semibold text-[15px] leading-tight tracking-tight">{item.name}</h3>
            <p className="text-[11px] text-text-muted mt-0.5 line-clamp-2 leading-relaxed">{item.description}</p>
          </div>
          <span className="text-xs font-mono font-semibold tabular-nums text-accent shrink-0">₹{item.price}</span>
        </div>
        <button
          onClick={() => onAdd(item)}
          className="btn-tactile mt-2.5 w-full flex items-center justify-center gap-1 py-2 rounded-full bg-accent text-white text-xs font-semibold hover:bg-accent-hover transition-colors min-h-[44px]"
        >
          <Plus className="w-3.5 h-3.5" /> Add
        </button>
      </div>
      <div className="absolute top-2 left-2">
        <div className="w-3.5 h-3.5 rounded-sm border-[1.5px] border-green-600 flex items-center justify-center">
          <div className="w-1 h-1 rounded-full bg-green-600" />
        </div>
      </div>
    </motion.div>
  );
}
