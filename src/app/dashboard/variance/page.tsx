"use client";

import { useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { mockRawMaterials } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { AlertTriangle, Download, CheckCircle } from "lucide-react";

const expectedStock: Record<string, number> = {
  rm1: 14000, rm2: 5000, rm3: 17500, rm4: 2400, rm5: 200, rm6: 250,
  rm7: 9000, rm8: 2800, rm9: 60, rm10: 1100, rm11: 1800, rm12: 750,
  rm13: 550, rm14: 380, rm15: 20, rm16: 450,
};

function formatQty(val: number, unit: string) {
  if (unit === "ml") return val >= 1000 ? (val / 1000).toFixed(1) + " L" : val + " ml";
  if (unit === "grams") return val >= 1000 ? (val / 1000).toFixed(1) + " kg" : val + " g";
  return val + " " + unit;
}

export default function VariancePage() {
  const [physicalCounts, setPhysicalCounts] = useState<Record<string, number>>({});

  const getVariance = (rm: { id: string; current_stock: number; cost_per_unit: number; unit: string }) => {
    const expected = expectedStock[rm.id] || rm.current_stock;
    const physical = physicalCounts[rm.id];
    if (physical === undefined) return null;
    const variance = physical - expected;
    const pct = Math.abs(variance) / expected * 100;
    let status = "ok";
    if (pct > 10) status = "investigate";
    else if (pct > 5) status = "review";
    const loss = Math.abs(variance) * rm.cost_per_unit;
    return { variance, pct, status, loss };
  };

  const hasAnyVariance = mockRawMaterials.some(rm => { const v = getVariance(rm); return v && v.status !== "ok"; });

  return (
    <div className="space-y-6">
      <PageHeader title="Inventory Variance" description="Find where your stock is disappearing">
        <button className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border text-sm hover:bg-surface-hover transition-colors"><Download className="w-4 h-4" /> Export Report</button>
      </PageHeader>
      <div className="bg-surface rounded-xl border border-border p-5">
        <p className="text-sm text-text-secondary mb-1">How it works:</p>
        <p className="text-xs text-text-muted">Enter the physical count of each ingredient. The system compares it against expected stock (based on orders and purchases) to detect variance.</p>
      </div>
      <div className="bg-surface rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm"><thead><tr className="border-b border-border text-left text-text-muted"><th className="px-5 py-3 font-medium">Ingredient</th><th className="px-5 py-3 font-medium">Expected</th><th className="px-5 py-3 font-medium">Physical Count</th><th className="px-5 py-3 font-medium">Variance</th><th className="px-5 py-3 font-medium">Est. Loss</th><th className="px-5 py-3 font-medium">Status</th></tr></thead>
          <tbody className="divide-y divide-border">
            {mockRawMaterials.map((rm) => {
              const expected = expectedStock[rm.id] || rm.current_stock;
              const v = getVariance(rm);
              return (
                <tr key={rm.id} className="hover:bg-surface-hover transition-colors">
                  <td className="px-5 py-3 font-medium">{rm.name}</td>
                  <td className="px-5 py-3 font-mono text-text-secondary">{formatQty(expected, rm.unit)}</td>
                  <td className="px-5 py-3"><input type="number" placeholder="--" value={physicalCounts[rm.id] ?? ""} onChange={(e) => setPhysicalCounts(prev => ({ ...prev, [rm.id]: Number(e.target.value) }))} className="w-24 px-2 py-1.5 rounded-lg border border-border bg-background text-sm font-mono outline-none focus:border-accent focus:ring-2 focus:ring-accent/20" /></td>
                  <td className="px-5 py-3 font-mono">{v ? <span className={cn(v.variance < 0 ? "text-error" : v.variance > 0 ? "text-info" : "text-success")}>{v.variance > 0 ? "+" : ""}{formatQty(v.variance, rm.unit)}</span> : <span className="text-text-muted">--</span>}</td>
                  <td className="px-5 py-3 font-mono">{v ? <span className={cn(v.loss > 0 ? "text-error font-semibold" : "")}>₹{Math.round(v.loss)}</span> : <span className="text-text-muted">--</span>}</td>
                  <td className="px-5 py-3">{v ? (
                    <span className={cn("inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold", v.status === "ok" ? "bg-success-bg text-success-text" : v.status === "review" ? "bg-warning-bg text-warning-text" : "bg-error-bg text-error-text")}>
                      {v.status === "ok" ? <CheckCircle className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                      {v.status === "ok" ? "OK" : v.status === "review" ? "REVIEW" : "INVESTIGATE"}
                    </span>
                  ) : <span className="text-text-muted text-xs">Awaiting count</span>}</td>
                </tr>
              );
            })}
          </tbody></table>
        </div>
      </div>
      {hasAnyVariance && (
        <div className="bg-surface rounded-xl border border-border p-5">
          <h3 className="font-semibold mb-3">Possible Causes of Variance</h3>
          <p className="text-xs text-text-muted mb-3">This report is based on logged data. Physical counts may vary due to measurement accuracy.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {["Unlogged wastage", "Incorrect recipe measurements", "Complimentary orders", "Over-portioning by staff", "Inventory theft", "Measurement rounding"].map(cause => (
              <div key={cause} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-background border border-border"><input type="checkbox" className="w-4 h-4 rounded accent-accent" /><span className="text-sm">{cause}</span></div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}