"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { mockRawMaterials } from "@/lib/mock-data";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { formatCurrency } from "@/lib/utils";
import { Plus } from "lucide-react";
import { useToast } from "@/components/shared/toaster";

const mockPurchases = [
  { id: "p1", material: "Milk", quantity: 10000, unit: "ml", cost: 600, supplier: "Amul Dairy", date: "2026-09-01" },
  { id: "p2", material: "Coffee Beans", quantity: 2000, unit: "grams", cost: 1000, supplier: "Blue Tokai", date: "2026-08-30" },
  { id: "p3", material: "Sugar", quantity: 5000, unit: "grams", cost: 100, supplier: "Local Supplier", date: "2026-08-28" },
];

export default function PurchasesPage() {
  const toast = useToast();
  const [showForm, setShowForm] = useState(false);
  const [materials, setMaterials] = useState(mockRawMaterials);
  const [purchases, setPurchases] = useState(mockPurchases);
  const [form, setForm] = useState({ rm: "", qty: "", cost: "", supplier: "", invoice: "" });
  const [saving, setSaving] = useState(false);
  useEffect(() => {
    if (!isSupabaseConfigured) return;
    supabase.from("raw_materials").select("*").then(({ data }) => { if (data?.length) setMaterials(data as unknown as typeof mockRawMaterials); });
    supabase.from("purchase_entries").select("*").order("created_at", { ascending: false }).limit(20).then(({ data }) => {
      if (data?.length) setPurchases((data as { id: string; raw_material_id: string; quantity: number; cost: number; supplier: string; created_at: string }[]).map((p) => {
        const rm = materials.find((m) => m.id === p.raw_material_id);
        return { id: p.id.slice(0, 4), material: rm?.name ?? p.raw_material_id, quantity: Number(p.quantity), unit: rm?.unit ?? "pieces", cost: Number(p.cost), supplier: p.supplier, date: new Date(p.created_at).toISOString().slice(0, 10) };
      }));
    });
  }, []);
  const save = async () => {
    if (!form.rm || !form.qty) { toast("Pick ingredient + quantity", "error"); return; }
    setSaving(true);
    try {
      if (isSupabaseConfigured) {
        const rm = materials.find((m) => m.id === form.rm) ?? materials.find((m) => m.name === form.rm);
        const { error } = await supabase.from("purchase_entries").insert({ raw_material_id: rm?.id ?? form.rm, quantity: Number(form.qty), cost: Number(form.cost) || 0, supplier: form.supplier, invoice_number: form.invoice || null } as never);
        if (error) throw error;
        if (rm) {
          const { data: cur } = await supabase.from("raw_materials").select("current_stock").eq("id", rm.id).single();
          const stock = (cur as { current_stock: number } | null)?.current_stock ?? rm.current_stock;
          await supabase.from("raw_materials").update({ current_stock: stock + Number(form.qty) } as never).eq("id", rm.id);
          await supabase.from("audit_log").insert({ raw_material_id: rm.id, change: Number(form.qty), reason: "purchase", notes: form.supplier } as never);
        }
      }
      setShowForm(false); setForm({ rm: "", qty: "", cost: "", supplier: "", invoice: "" });
      toast(isSupabaseConfigured ? "Purchase saved" : "Saved locally — set Supabase keys to persist");
    } catch (e) {
      const msg = String(e instanceof Error ? e.message : e);
      toast(msg.includes("schema cache") ? "Schema cache stale — run NOTIFY pgrst, 'reload schema';" : msg, "error");
    } finally { setSaving(false); }
  };
  return (
    <div className="space-y-6">
      <PageHeader title="Purchases" description="Track supplier deliveries and stock inwarding">
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-accent text-white text-sm font-medium hover:bg-accent-hover transition-colors"><Plus className="w-4 h-4" /> Add Purchase</button>
      </PageHeader>
      {showForm && (
        <div className="bg-surface rounded-xl border border-border p-5">
          <h3 className="font-semibold mb-4">New Purchase Entry</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div><label className="block text-xs font-medium text-text-secondary mb-1.5">Ingredient</label><select value={form.rm} onChange={(e) => setForm({ ...form, rm: e.target.value })} className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm outline-none focus:border-accent"><option value="">Select ingredient...</option>{materials.map((rm) => <option key={rm.id} value={rm.id}>{rm.name}</option>)}</select></div>
            <div><label className="block text-xs font-medium text-text-secondary mb-1.5">Quantity</label><input type="number" value={form.qty} onChange={(e) => setForm({ ...form, qty: e.target.value })} placeholder="e.g. 10" className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm outline-none focus:border-accent" /></div>
            <div><label className="block text-xs font-medium text-text-secondary mb-1.5">Cost (₹)</label><input type="number" value={form.cost} onChange={(e) => setForm({ ...form, cost: e.target.value })} placeholder="e.g. 600" className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm outline-none focus:border-accent" /></div>
            <div><label className="block text-xs font-medium text-text-secondary mb-1.5">Supplier</label><input type="text" value={form.supplier} onChange={(e) => setForm({ ...form, supplier: e.target.value })} placeholder="e.g. Amul Dairy" className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm outline-none focus:border-accent" /></div>
            <div><label className="block text-xs font-medium text-text-secondary mb-1.5">Invoice #</label><input type="text" value={form.invoice} onChange={(e) => setForm({ ...form, invoice: e.target.value })} placeholder="Optional" className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm outline-none focus:border-accent" /></div>
          </div>
          <div className="flex gap-2 mt-4">
            <button onClick={save} disabled={saving} className="px-4 py-2 rounded-lg bg-accent text-white text-sm font-medium hover:bg-accent-hover disabled:opacity-50">{saving ? "Saving…" : "Save Purchase"}</button>
            <button onClick={() => setShowForm(false)} className="px-4 py-2 rounded-lg border border-border text-sm text-text-secondary hover:bg-surface-hover">Cancel</button>
          </div>
        </div>
      )}
      <div className="bg-surface rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm"><thead><tr className="border-b border-border text-left text-text-muted"><th className="px-5 py-3 font-medium">Date</th><th className="px-5 py-3 font-medium">Ingredient</th><th className="px-5 py-3 font-medium">Quantity</th><th className="px-5 py-3 font-medium">Cost</th><th className="px-5 py-3 font-medium">Supplier</th></tr></thead>
          <tbody className="divide-y divide-border">
            {purchases.map((p) => (
              <tr key={p.id} className="hover:bg-surface-hover transition-colors"><td className="px-5 py-3 text-text-secondary">{p.date}</td><td className="px-5 py-3 font-medium">{p.material}</td><td className="px-5 py-3 font-mono">{p.quantity} {p.unit}</td><td className="px-5 py-3 font-mono font-semibold">{formatCurrency(p.cost)}</td><td className="px-5 py-3 text-text-secondary">{p.supplier}</td></tr>
            ))}
          </tbody></table>
        </div>
      </div>
    </div>
  );
}