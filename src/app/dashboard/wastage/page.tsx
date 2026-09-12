"use client";

import { useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { mockRawMaterials } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/utils";
import { AlertTriangle, Plus } from "lucide-react";

const mockWastage = [
  { id: "w1", material: "Milk", quantity: 500, unit: "ml", reason: "Spillage", cost: 30, reported_by: "Rahul", date: "2026-09-02 14:30" },
  { id: "w2", material: "Coffee Beans", quantity: 50, unit: "grams", reason: "Preparation error", cost: 25, reported_by: "Priya", date: "2026-09-02 11:15" },
  { id: "w3", material: "Bread Slices", quantity: 4, unit: "pieces", reason: "Burnt", cost: 20, reported_by: "Rahul", date: "2026-09-01 16:45" },
];
const reasons = ["Spillage", "Burnt", "Expired", "Damaged", "Preparation error", "Other"];

export default function WastagePage() {
  const [showForm, setShowForm] = useState(false);
  const totalCost = mockWastage.reduce((s, w) => s + w.cost, 0);
  return (
    <div className="space-y-6">
      <PageHeader title="Wastage" description="Track spills, damage, and waste">
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-accent text-white text-sm font-medium hover:bg-accent-hover transition-colors"><Plus className="w-4 h-4" /> Log Wastage</button>
      </PageHeader>
      <div className="p-4 bg-error-bg rounded-xl border border-error/20 flex items-center gap-3">
        <AlertTriangle className="w-5 h-5 text-error shrink-0" />
        <div><p className="text-sm font-medium text-error-text">Total wastage cost this month</p><p className="text-lg font-semibold font-mono text-error">{formatCurrency(totalCost)}</p></div>
      </div>
      {showForm && (
        <div className="bg-surface rounded-xl border border-border p-5">
          <h3 className="font-semibold mb-4">Log Wastage</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div><label className="block text-xs font-medium text-text-secondary mb-1.5">Ingredient</label><select className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm outline-none focus:border-accent"><option>Select ingredient...</option>{mockRawMaterials.map(rm => <option key={rm.id}>{rm.name}</option>)}</select></div>
            <div><label className="block text-xs font-medium text-text-secondary mb-1.5">Quantity</label><input type="number" placeholder="e.g. 500" className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm outline-none focus:border-accent" /></div>
            <div><label className="block text-xs font-medium text-text-secondary mb-1.5">Reason</label><select className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm outline-none focus:border-accent"><option>Spillage</option>{reasons.map(r => <option key={r}>{r}</option>)}</select></div>
            <div><label className="block text-xs font-medium text-text-secondary mb-1.5">Reported by</label><input type="text" placeholder="Staff name" className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm outline-none focus:border-accent" /></div>
          </div>
          <div className="flex gap-2 mt-4">
            <button className="px-4 py-2 rounded-lg bg-error text-white text-sm font-medium hover:bg-error/90">Log Wastage</button>
            <button onClick={() => setShowForm(false)} className="px-4 py-2 rounded-lg border border-border text-sm text-text-secondary hover:bg-surface-hover">Cancel</button>
          </div>
        </div>
      )}
      <div className="bg-surface rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm"><thead><tr className="border-b border-border text-left text-text-muted"><th className="px-5 py-3 font-medium">Date</th><th className="px-5 py-3 font-medium">Ingredient</th><th className="px-5 py-3 font-medium">Quantity</th><th className="px-5 py-3 font-medium">Reason</th><th className="px-5 py-3 font-medium">Cost</th><th className="px-5 py-3 font-medium">By</th></tr></thead>
          <tbody className="divide-y divide-border">
            {mockWastage.map((w) => (
              <tr key={w.id} className="hover:bg-surface-hover transition-colors"><td className="px-5 py-3 text-text-secondary">{w.date}</td><td className="px-5 py-3 font-medium">{w.material}</td><td className="px-5 py-3 font-mono">{w.quantity} {w.unit}</td><td className="px-5 py-3 text-text-secondary">{w.reason}</td><td className="px-5 py-3 font-mono font-semibold text-error">{formatCurrency(w.cost)}</td><td className="px-5 py-3 text-text-secondary">{w.reported_by}</td></tr>
            ))}
          </tbody></table>
        </div>
      </div>
    </div>
  );
}