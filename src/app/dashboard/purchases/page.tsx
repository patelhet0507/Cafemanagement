"use client";

import { useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { mockRawMaterials } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/utils";
import { Plus } from "lucide-react";

const mockPurchases = [
  { id: "p1", material: "Milk", quantity: 10000, unit: "ml", cost: 600, supplier: "Amul Dairy", date: "2026-09-01" },
  { id: "p2", material: "Coffee Beans", quantity: 2000, unit: "grams", cost: 1000, supplier: "Blue Tokai", date: "2026-08-30" },
  { id: "p3", material: "Sugar", quantity: 5000, unit: "grams", cost: 100, supplier: "Local Supplier", date: "2026-08-28" },
];

export default function PurchasesPage() {
  const [showForm, setShowForm] = useState(false);
  return (
    <div className="space-y-6">
      <PageHeader title="Purchases" description="Track supplier deliveries and stock inwarding">
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-accent text-white text-sm font-medium hover:bg-accent-hover transition-colors"><Plus className="w-4 h-4" /> Add Purchase</button>
      </PageHeader>
      {showForm && (
        <div className="bg-surface rounded-xl border border-border p-5">
          <h3 className="font-semibold mb-4">New Purchase Entry</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div><label className="block text-xs font-medium text-text-secondary mb-1.5">Ingredient</label><select className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm outline-none focus:border-accent"><option>Select ingredient...</option>{mockRawMaterials.map(rm => <option key={rm.id}>{rm.name}</option>)}</select></div>
            <div><label className="block text-xs font-medium text-text-secondary mb-1.5">Quantity</label><input type="number" placeholder="e.g. 10" className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm outline-none focus:border-accent" /></div>
            <div><label className="block text-xs font-medium text-text-secondary mb-1.5">Cost (₹)</label><input type="number" placeholder="e.g. 600" className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm outline-none focus:border-accent" /></div>
            <div><label className="block text-xs font-medium text-text-secondary mb-1.5">Supplier</label><input type="text" placeholder="e.g. Amul Dairy" className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm outline-none focus:border-accent" /></div>
            <div><label className="block text-xs font-medium text-text-secondary mb-1.5">Invoice #</label><input type="text" placeholder="Optional" className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm outline-none focus:border-accent" /></div>
          </div>
          <div className="flex gap-2 mt-4">
            <button className="px-4 py-2 rounded-lg bg-accent text-white text-sm font-medium hover:bg-accent-hover">Save Purchase</button>
            <button onClick={() => setShowForm(false)} className="px-4 py-2 rounded-lg border border-border text-sm text-text-secondary hover:bg-surface-hover">Cancel</button>
          </div>
        </div>
      )}
      <div className="bg-surface rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm"><thead><tr className="border-b border-border text-left text-text-muted"><th className="px-5 py-3 font-medium">Date</th><th className="px-5 py-3 font-medium">Ingredient</th><th className="px-5 py-3 font-medium">Quantity</th><th className="px-5 py-3 font-medium">Cost</th><th className="px-5 py-3 font-medium">Supplier</th></tr></thead>
          <tbody className="divide-y divide-border">
            {mockPurchases.map((p) => (
              <tr key={p.id} className="hover:bg-surface-hover transition-colors"><td className="px-5 py-3 text-text-secondary">{p.date}</td><td className="px-5 py-3 font-medium">{p.material}</td><td className="px-5 py-3 font-mono">{p.quantity} {p.unit}</td><td className="px-5 py-3 font-mono font-semibold">{formatCurrency(p.cost)}</td><td className="px-5 py-3 text-text-secondary">{p.supplier}</td></tr>
            ))}
          </tbody></table>
        </div>
      </div>
    </div>
  );
}