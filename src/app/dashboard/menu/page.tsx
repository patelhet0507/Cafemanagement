"use client";

import { PageHeader } from "@/components/shared/page-header";
import { mockMenuItems } from "@/lib/mock-data";
import { useSupabaseTable } from "@/lib/supabase-helpers";
import type { MenuItem } from "@/types/database";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { formatCurrency } from "@/lib/utils";
import { Plus, ToggleLeft, ToggleRight } from "lucide-react";

const categoryEmoji: Record<string, string> = { "Hot Coffee": "☕", "Cold Coffee": "☕", "Chai & Tea": "🍵", "Fresh Drinks": "🧃", "Snacks": "🥪", "Desserts": "🍰" };

export default function MenuManagementPage() {
  const { data: items } = useSupabaseTable<MenuItem>("menu_items", mockMenuItems);
  const toggle = async (it: MenuItem) => {
    if (!isSupabaseConfigured) return;
    await supabase.from("menu_items").update({ is_available: !it.is_available } as never).eq("id", it.id);
    location.reload();
  };
  return (
    <div className="space-y-6">
      <PageHeader title="Menu" description="Manage your menu items and availability">
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-accent text-white text-sm font-medium hover:bg-accent-hover transition-colors"><Plus className="w-4 h-4" /> Add Item</button>
      </PageHeader>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item) => (
          <div key={item.id} className="bg-surface rounded-xl border border-border p-4 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{categoryEmoji[item.category] || "🍽️"}</span>
                <div><h3 className="font-semibold text-sm">{item.name}</h3><p className="text-[11px] text-text-muted">{item.category}</p></div>
              </div>
              <span className="font-mono font-semibold text-accent">{formatCurrency(item.price)}</span>
            </div>
            <p className="text-xs text-text-muted mt-2 line-clamp-2">{item.description}</p>
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
              <span className="text-[11px] text-text-muted">{item.prep_time_min} min prep</span>
              <button onClick={() => toggle(item)} className="flex items-center gap-1 text-xs font-medium">
                {item.is_available ? <><ToggleRight className="w-5 h-5 text-success" /> <span className="text-success">Available</span></> : <><ToggleLeft className="w-5 h-5 text-text-muted" /> <span className="text-text-muted">Unavailable</span></>}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}