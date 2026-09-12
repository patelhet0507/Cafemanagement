"use client";

import { useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { mockRawMaterials } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { Package, AlertTriangle, ShoppingCart, Trash2, Plus, Search } from "lucide-react";

function getStockStatus(rm: { current_stock: number; low_stock_threshold: number }) {
  if (rm.current_stock <= 0) return { label: "OUT OF STOCK", bg: "bg-error-bg", text: "text-error-text" };
  if (rm.current_stock < rm.low_stock_threshold) return { label: "LOW STOCK", bg: "bg-warning-bg", text: "text-warning-text" };
  return { label: "HEALTHY", bg: "bg-success-bg", text: "text-success-text" };
}

function formatStock(rm: { unit: string; current_stock: number }) {
  if (rm.unit === "ml") return rm.current_stock >= 1000 ? (rm.current_stock / 1000).toFixed(1) + " L" : rm.current_stock + " ml";
  if (rm.unit === "grams") return rm.current_stock >= 1000 ? (rm.current_stock / 1000).toFixed(1) + " kg" : rm.current_stock + " g";
  return rm.current_stock + " " + rm.unit;
}

export default function InventoryPage() {
  const [search, setSearch] = useState("");
  const filtered = mockRawMaterials.filter(rm => rm.name.toLowerCase().includes(search.toLowerCase()));
  const totalValue = mockRawMaterials.reduce((s, rm) => s + rm.current_stock * rm.cost_per_unit, 0);
  const lowStock = mockRawMaterials.filter(rm => rm.current_stock < rm.low_stock_threshold && rm.current_stock > 0).length;
  const outOfStock = mockRawMaterials.filter(rm => rm.current_stock <= 0).length;
  return (
    <div className="space-y-6">
      <PageHeader title="Inventory" description="Monitor every ingredient across your cafe">
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-accent text-white text-sm font-medium hover:bg-accent-hover transition-colors"><Plus className="w-4 h-4" /> Add Material</button>
      </PageHeader>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-surface rounded-xl border border-border"><div className="flex items-center justify-between mb-2"><p className="text-xs text-text-muted">Total Stock Value</p><Package className="w-4 h-4 text-accent" /></div><p className="text-2xl font-semibold font-mono">₹{Math.round(totalValue).toLocaleString("en-IN")}</p></div>
        <div className="p-4 bg-surface rounded-xl border border-border"><div className="flex items-center justify-between mb-2"><p className="text-xs text-text-muted">Low Stock</p><AlertTriangle className="w-4 h-4 text-warning" /></div><p className="text-2xl font-semibold font-mono">{lowStock}</p></div>
        <div className="p-4 bg-surface rounded-xl border border-border"><div className="flex items-center justify-between mb-2"><p className="text-xs text-text-muted">Out of Stock</p><Trash2 className="w-4 h-4 text-error" /></div><p className="text-2xl font-semibold font-mono">{outOfStock}</p></div>
        <div className="p-4 bg-surface rounded-xl border border-border"><div className="flex items-center justify-between mb-2"><p className="text-xs text-text-muted">Materials</p><ShoppingCart className="w-4 h-4 text-info" /></div><p className="text-2xl font-semibold font-mono">{mockRawMaterials.length}</p></div>
      </div>
      <div className="bg-surface rounded-xl border border-border overflow-hidden">
        <div className="px-5 py-3 border-b border-border"><div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-background border border-border max-w-sm"><Search className="w-4 h-4 text-text-muted" /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search materials..." className="bg-transparent text-sm outline-none flex-1" /></div></div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm"><thead><tr className="border-b border-border text-left text-text-muted"><th className="px-5 py-3 font-medium">Ingredient</th><th className="px-5 py-3 font-medium">Unit</th><th className="px-5 py-3 font-medium">Current Stock</th><th className="px-5 py-3 font-medium">Reorder Level</th><th className="px-5 py-3 font-medium">Status</th><th className="px-5 py-3 font-medium">Cost/Unit</th></tr></thead>
          <tbody className="divide-y divide-border">
            {filtered.map((rm) => { const status = getStockStatus(rm); return (
              <tr key={rm.id} className="hover:bg-surface-hover transition-colors"><td className="px-5 py-3 font-medium">{rm.name}</td><td className="px-5 py-3 text-text-secondary">{rm.unit}</td><td className="px-5 py-3 font-mono">{formatStock(rm)}</td><td className="px-5 py-3 font-mono text-text-muted">{formatStock({ ...rm, current_stock: rm.low_stock_threshold })}</td><td className="px-5 py-3"><span className={cn("inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold", status.bg, status.text)}>{status.label}</span></td><td className="px-5 py-3 font-mono text-text-secondary">₹{rm.cost_per_unit}</td></tr>
            );})}
          </tbody></table>
        </div>
      </div>
    </div>
  );
}