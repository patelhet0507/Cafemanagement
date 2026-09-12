"use client";

import { useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { mockRawMaterials } from "@/lib/mock-data";
import { useSupabaseTable } from "@/lib/supabase-helpers";
import type { RawMaterial } from "@/types/database";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { cn } from "@/lib/utils";
import { Package, AlertTriangle, ShoppingCart, Trash2, Plus, Search, Pencil, X } from "lucide-react";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { useToast } from "@/components/shared/toaster";

function getStockStatus(rm: { current_stock: number; low_stock_threshold: number }) {
  if (Number(rm.current_stock) <= 0) return { label: "OUT OF STOCK", bg: "bg-error-bg", text: "text-error-text" };
  if (Number(rm.current_stock) < Number(rm.low_stock_threshold)) return { label: "LOW STOCK", bg: "bg-warning-bg", text: "text-warning-text" };
  return { label: "HEALTHY", bg: "bg-success-bg", text: "text-success-text" };
}

function formatStock(rm: { unit: string; current_stock: number }) {
  const v = Number(rm.current_stock);
  if (rm.unit === "ml") return v >= 1000 ? (v / 1000).toFixed(1) + " L" : v + " ml";
  if (rm.unit === "grams") return v >= 1000 ? (v / 1000).toFixed(1) + " kg" : v + " g";
  return v + " " + rm.unit;
}

type Form = { name: string; unit: RawMaterial["unit"]; current_stock: string; low_stock_threshold: string; cost_per_unit: string };
const empty: Form = { name: "", unit: "grams", current_stock: "", low_stock_threshold: "", cost_per_unit: "" };

export default function InventoryPage() {
  const [search, setSearch] = useState("");
  const toast = useToast();
  const { data: materials, refetch } = useSupabaseTable<RawMaterial>("raw_materials", mockRawMaterials);
  const [show, setShow] = useState(false);
  const [editing, setEditing] = useState<RawMaterial | null>(null);
  const [form, setForm] = useState<Form>(empty);
  const [saving, setSaving] = useState(false);
  const [confirm, setConfirm] = useState<RawMaterial | null>(null);

  const filtered = materials.filter((rm) => rm.name.toLowerCase().includes(search.toLowerCase()));
  const totalValue = materials.reduce((s, rm) => s + Number(rm.current_stock) * Number(rm.cost_per_unit), 0);
  const lowStock = materials.filter((rm) => Number(rm.current_stock) < Number(rm.low_stock_threshold) && Number(rm.current_stock) > 0).length;
  const outOfStock = materials.filter((rm) => Number(rm.current_stock) <= 0).length;

  const openAdd = () => { setEditing(null); setForm(empty); setShow(true); };
  const openEdit = (rm: RawMaterial) => {
    setEditing(rm);
    setForm({ name: rm.name, unit: rm.unit, current_stock: String(rm.current_stock), low_stock_threshold: String(rm.low_stock_threshold), cost_per_unit: String(rm.cost_per_unit) });
    setShow(true);
  };

  const save = async () => {
    if (!form.name) { toast("Name required", "error"); return; }
    if (!isSupabaseConfigured) { toast("Supabase not configured — set anon key", "error"); return; }
    setSaving(true);
    try {
      const payload = { name: form.name, unit: form.unit, current_stock: Number(form.current_stock) || 0, low_stock_threshold: Number(form.low_stock_threshold) || 0, cost_per_unit: Number(form.cost_per_unit) || 0 };
      if (editing) {
        const { error } = await supabase.from("raw_materials").update(payload as never).eq("id", editing.id);
        if (error) throw error;
        toast("Material updated"); setShow(false); refetch();
      } else {
        const { error } = await supabase.from("raw_materials").insert(payload as never);
        if (error) throw error;
        toast("Material added"); setShow(false); refetch();
      }
    } catch (e) {
      const m = (e as any)?.message ?? (e instanceof Error ? e.message : String(e));
      toast(m.includes("schema cache") ? "Schema cache stale — run NOTIFY pgrst, 'reload schema';" : m, "error");
    } finally { setSaving(false); }
  };

  const doDelete = async () => {
    if (!confirm) return;
    if (!isSupabaseConfigured) { toast("Supabase not configured", "error"); return; }
    const { error } = await supabase.from("raw_materials").delete().eq("id", confirm.id);
    if (error) { toast(error.message.includes("schema cache") ? "Schema cache stale — run NOTIFY pgrst, 'reload schema';" : error.message, "error"); return; }
    setConfirm(null); toast("Material deleted"); refetch();
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Inventory" description="Monitor every ingredient — Supabase live">
        <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-accent text-white text-sm font-medium hover:bg-accent-hover transition-colors"><Plus className="w-4 h-4" /> Add Material</button>
      </PageHeader>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-surface rounded-xl border border-border"><div className="flex items-center justify-between mb-2"><p className="text-xs text-text-muted">Total Stock Value</p><Package className="w-4 h-4 text-accent" /></div><p className="text-2xl font-semibold font-mono">₹{Math.round(totalValue).toLocaleString("en-IN")}</p></div>
        <div className="p-4 bg-surface rounded-xl border border-border"><div className="flex items-center justify-between mb-2"><p className="text-xs text-text-muted">Low Stock</p><AlertTriangle className="w-4 h-4 text-warning" /></div><p className="text-2xl font-semibold font-mono">{lowStock}</p></div>
        <div className="p-4 bg-surface rounded-xl border border-border"><div className="flex items-center justify-between mb-2"><p className="text-xs text-text-muted">Out of Stock</p><Trash2 className="w-4 h-4 text-error" /></div><p className="text-2xl font-semibold font-mono">{outOfStock}</p></div>
        <div className="p-4 bg-surface rounded-xl border border-border"><div className="flex items-center justify-between mb-2"><p className="text-xs text-text-muted">Materials</p><ShoppingCart className="w-4 h-4 text-info" /></div><p className="text-2xl font-semibold font-mono">{materials.length}</p></div>
      </div>

      <div className="bg-surface rounded-xl border border-border overflow-hidden">
        <div className="px-5 py-3 border-b border-border"><div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-background border border-border max-w-sm"><Search className="w-4 h-4 text-text-muted" /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search materials..." className="bg-transparent text-sm outline-none flex-1" /></div></div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm"><thead><tr className="border-b border-border text-left text-text-muted"><th className="px-5 py-3 font-medium">Ingredient</th><th className="px-5 py-3 font-medium">Unit</th><th className="px-5 py-3 font-medium">Current Stock</th><th className="px-5 py-3 font-medium">Reorder Level</th><th className="px-5 py-3 font-medium">Status</th><th className="px-5 py-3 font-medium">Cost/Unit</th><th className="px-5 py-3 font-medium"></th></tr></thead>
          <tbody className="divide-y divide-border">
            {filtered.map((rm) => { const status = getStockStatus(rm); return (
              <tr key={rm.id} className="hover:bg-surface-hover transition-colors"><td className="px-5 py-3 font-medium">{rm.name}</td><td className="px-5 py-3 text-text-secondary">{rm.unit}</td><td className="px-5 py-3 font-mono">{formatStock(rm)}</td><td className="px-5 py-3 font-mono text-text-muted">{formatStock({ ...rm, current_stock: rm.low_stock_threshold })}</td><td className="px-5 py-3"><span className={cn("inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold", status.bg, status.text)}>{status.label}</span></td><td className="px-5 py-3 font-mono text-text-secondary">₹{rm.cost_per_unit}</td><td className="px-5 py-3 flex gap-1"><button onClick={() => openEdit(rm)} className="p-1.5 rounded-lg hover:bg-surface-hover"><Pencil className="w-3.5 h-3.5" /></button><button onClick={() => setConfirm(rm)} className="p-1.5 rounded-lg hover:bg-error/10 text-error"><Trash2 className="w-3.5 h-3.5" /></button></td></tr>
            );})}
            {filtered.length === 0 && <tr><td colSpan={7} className="px-5 py-8 text-center text-text-muted text-sm">No materials. Click Add Material.</td></tr>}
          </tbody></table>
        </div>
      </div>

      {show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={() => setShow(false)}>
          <div className="w-full max-w-md bg-surface rounded-2xl shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-5 py-4 border-b border-border"><h3 className="font-semibold">{editing ? "Edit Material" : "Add Material"}</h3><button onClick={() => setShow(false)} className="w-8 h-8 rounded-lg hover:bg-surface-hover flex items-center justify-center"><X className="w-4 h-4" /></button></div>
            <div className="p-5 space-y-3">
              <div><label className="text-xs font-semibold tracking-widest text-text-muted">NAME</label><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Milk" className="mt-1 w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm outline-none focus:border-accent" /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-xs font-semibold tracking-widest text-text-muted">UNIT</label><select value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value as Form["unit"] })} className="mt-1 w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm"><option value="ml">ml</option><option value="grams">grams</option><option value="pieces">pieces</option><option value="liters">liters</option><option value="kg">kg</option></select></div>
                <div><label className="text-xs font-semibold tracking-widest text-text-muted">COST/UNIT (₹)</label><input type="number" value={form.cost_per_unit} onChange={(e) => setForm({ ...form, cost_per_unit: e.target.value })} placeholder="0.06" className="mt-1 w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm outline-none focus:border-accent" /></div>
                <div><label className="text-xs font-semibold tracking-widest text-text-muted">CURRENT STOCK</label><input type="number" value={form.current_stock} onChange={(e) => setForm({ ...form, current_stock: e.target.value })} placeholder="12400" className="mt-1 w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm outline-none focus:border-accent" /></div>
                <div><label className="text-xs font-semibold tracking-widest text-text-muted">REORDER LEVEL</label><input type="number" value={form.low_stock_threshold} onChange={(e) => setForm({ ...form, low_stock_threshold: e.target.value })} placeholder="15000" className="mt-1 w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm outline-none focus:border-accent" /></div>
              </div>
            </div>
            <div className="flex gap-2 p-5 border-t border-border"><button onClick={save} disabled={saving || !form.name} className="flex-1 py-2.5 rounded-xl bg-accent text-white font-semibold hover:bg-accent-hover disabled:opacity-40">{saving ? "Saving…" : editing ? "Update" : "Add"}</button><button onClick={() => setShow(false)} className="px-4 py-2.5 rounded-xl border border-border hover:bg-surface-hover text-sm">Cancel</button></div>
          </div>
        </div>
      )}

      <ConfirmDialog open={!!confirm} title={`Delete ${confirm?.name}?`} description="Removes material and related recipes." onConfirm={doDelete} onCancel={() => setConfirm(null)} />
    </div>
  );
}
