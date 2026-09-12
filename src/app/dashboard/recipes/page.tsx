"use client";

import { useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { mockMenuItems, mockRecipes, mockRawMaterials } from "@/lib/mock-data";
import { cn, formatCurrency } from "@/lib/utils";
import { Plus, ChevronDown, ChevronUp } from "lucide-react";

export default function RecipesPage() {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const recipesByItem = mockMenuItems.map(item => {
    const recipes = mockRecipes.filter(r => r.menu_item_id === item.id);
    const totalCost = recipes.reduce((sum, r) => { const mat = mockRawMaterials.find(m => m.id === r.raw_material_id); return sum + (mat ? r.quantity * mat.cost_per_unit : 0); }, 0);
    const margin = item.price - totalCost;
    const marginPct = (margin / item.price * 100);
    return { item, recipes, totalCost, margin, marginPct };
  });

  return (
    <div className="space-y-6">
      <PageHeader title="Recipes" description="Manage ingredient recipes for each menu item">
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-accent text-white text-sm font-medium hover:bg-accent-hover transition-colors"><Plus className="w-4 h-4" /> Add Recipe</button>
      </PageHeader>
      <div className="space-y-3">
        {recipesByItem.map(({ item, recipes, totalCost, margin, marginPct }) => (
          <div key={item.id} className="bg-surface rounded-xl border border-border overflow-hidden">
            <button onClick={() => setExpandedId(expandedId === item.id ? null : item.id)} className="w-full flex items-center justify-between px-5 py-4 hover:bg-surface-hover transition-colors text-left">
              <div className="flex items-center gap-3"><h3 className="font-semibold">{item.name}</h3><span className="text-xs text-text-muted bg-surface-hover px-2 py-0.5 rounded-full">{recipes.length} ingredients</span></div>
              <div className="flex items-center gap-4">
                <div className="text-right"><p className="text-xs text-text-muted">Cost: <span className="font-mono">{formatCurrency(Math.round(totalCost))}</span></p><p className="text-xs text-text-muted">Margin: <span className={cn("font-mono font-semibold", marginPct > 60 ? "text-success" : marginPct > 40 ? "text-warning" : "text-error")}>{marginPct.toFixed(1)}%</span></p></div>
                {expandedId === item.id ? <ChevronUp className="w-4 h-4 text-text-muted" /> : <ChevronDown className="w-4 h-4 text-text-muted" />}
              </div>
            </button>
            {expandedId === item.id && (
              <div className="px-5 pb-4 border-t border-border pt-3">
                <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-2">
                  <span className="shrink-0 px-3 py-1.5 rounded-lg bg-accent/10 text-accent text-xs font-semibold">{item.name}</span>
                  <span className="text-text-muted">→</span>
                  {recipes.map((r) => { const mat = mockRawMaterials.find(m => m.id === r.raw_material_id); return (
                    <span key={r.id} className="shrink-0 px-2.5 py-1.5 rounded-lg bg-background border border-border text-xs">{r.quantity}{mat?.unit} {mat?.name}</span>
                  );})}
                  <span className="text-text-muted">→</span>
                  <span className="shrink-0 px-3 py-1.5 rounded-lg bg-success/10 text-success text-xs font-semibold">Ready</span>
                </div>
                <table className="w-full text-sm"><thead><tr className="border-b border-border text-left text-text-muted"><th className="pb-2 font-medium">Ingredient</th><th className="pb-2 font-medium">Quantity</th><th className="pb-2 font-medium">Unit Cost</th><th className="pb-2 font-medium">Total Cost</th></tr></thead>
                <tbody>{recipes.map((r) => { const mat = mockRawMaterials.find(m => m.id === r.raw_material_id); return (
                  <tr key={r.id} className="border-b border-border-subtle"><td className="py-2 font-medium">{mat?.name}</td><td className="py-2 font-mono">{r.quantity}</td><td className="py-2 font-mono text-text-secondary">₹{mat?.cost_per_unit}</td><td className="py-2 font-mono font-semibold">₹{(r.quantity * (mat?.cost_per_unit || 0)).toFixed(2)}</td></tr>
                );})}</tbody></table>
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
                  <div className="text-sm"><span className="text-text-muted">Selling Price: </span><span className="font-semibold">{formatCurrency(item.price)}</span></div>
                  <div className="text-sm"><span className="text-text-muted">Cost: </span><span className="font-mono">{formatCurrency(Math.round(totalCost))}</span></div>
                  <div className="text-sm"><span className="text-text-muted">Margin: </span><span className={cn("font-semibold", marginPct > 60 ? "text-success" : marginPct > 40 ? "text-warning" : "text-error")}>{formatCurrency(Math.round(margin))} ({marginPct.toFixed(1)}%)</span></div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}