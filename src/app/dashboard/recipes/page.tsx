"use client";

import { useState, useMemo } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { useSupabaseTable } from "@/lib/supabase-helpers";
import { mockMenuItems, mockRecipes, mockRawMaterials } from "@/lib/mock-data";
import type { MenuItem, RawMaterial, Recipe } from "@/types/database";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { cn, formatCurrency } from "@/lib/utils";
import { Plus, ChevronDown, ChevronUp, Trash2, Pencil, Save, X } from "lucide-react";

export default function RecipesPage() {
  const { data: menuItems, refetch: refetchMenu } = useSupabaseTable<MenuItem>("menu_items", mockMenuItems);
  const { data: rawMaterials } = useSupabaseTable<RawMaterial>("raw_materials", mockRawMaterials);
  const { data: recipes, refetch } = useSupabaseTable<Recipe>("recipes", mockRecipes);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [addingFor, setAddingFor] = useState<string | null>(null);
  const [newIng, setNewIng] = useState({ raw_material_id: "", quantity: "" });
  const [editing, setEditing] = useState<Recipe | null>(null);
  const [editQty, setEditQty] = useState("");

  const recipesByItem = useMemo(() => menuItems.map((item) => {
    const rs = recipes.filter((r) => r.menu_item_id === item.id);
    const totalCost = rs.reduce((sum, r) => { const mat = rawMaterials.find((m) => m.id === r.raw_material_id); return sum + (mat ? Number(r.quantity) * Number(mat.cost_per_unit) : 0); }, 0);
    const margin = Number(item.price) - totalCost;
    const marginPct = Number(item.price) ? (margin / Number(item.price) * 100) : 0;
    return { item, recipes: rs, totalCost, margin, marginPct };
  }), [menuItems, recipes, rawMaterials]);

  const handleAdd = async (menuItemId: string) => {
    if (!newIng.raw_material_id || !newIng.quantity) return alert("Pick ingredient + quantity");
    if (isSupabaseConfigured) {
      const { error } = await supabase.from("recipes").insert({ menu_item_id: menuItemId, raw_material_id: newIng.raw_material_id, quantity: Number(newIng.quantity) } as never);
      if (error) return alert(error.message);
      setNewIng({ raw_material_id: "", quantity: "" }); setAddingFor(null); refetch();
    } else {
      alert("Set Supabase anon key to persist");
    }
  };

  const handleDelete = async (r: Recipe) => {
    if (!confirm("Remove ingredient?")) return;
    if (isSupabaseConfigured) {
      const { error } = await supabase.from("recipes").delete().eq("id", r.id);
      if (error) return alert(error.message);
      refetch();
    }
  };

  const startEdit = (r: Recipe) => { setEditing(r); setEditQty(String(r.quantity)); };
  const saveEdit = async () => {
    if (!editing) return;
    if (isSupabaseConfigured) {
      const { error } = await supabase.from("recipes").update({ quantity: Number(editQty) } as never).eq("id", editing.id);
      if (error) return alert(error.message);
      setEditing(null); refetch();
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Recipes" description="All data from Supabase — edit ingredients per item">
        <span className="text-xs text-text-muted">{recipes.length} recipe rows</span>
      </PageHeader>

      {!isSupabaseConfigured && <div className="p-3 rounded-xl bg-warning-bg border border-warning/20 text-xs text-warning-text">Supabase not configured — showing mock data (read-only). Set NEXT_PUBLIC_SUPABASE_* to edit.</div>}

      <div className="space-y-3">
        {recipesByItem.map(({ item, recipes: rs, totalCost, margin, marginPct }) => (
          <div key={item.id} className="bg-surface rounded-2xl border border-border overflow-hidden">
            <button onClick={() => setExpandedId(expandedId === item.id ? null : item.id)} className="w-full flex items-center justify-between px-5 py-4 hover:bg-surface-hover transition-colors text-left">
              <div className="flex items-center gap-3"><h3 className="font-semibold">{item.name}</h3><span className="text-xs text-text-muted bg-surface-hover px-2 py-0.5 rounded-full">{rs.length} ingredients</span><span className="text-xs text-text-muted hidden sm:inline">{item.category}</span></div>
              <div className="flex items-center gap-4">
                <div className="text-right hidden sm:block"><p className="text-xs text-text-muted">Cost: <span className="font-mono">{formatCurrency(Math.round(totalCost))}</span></p><p className="text-xs text-text-muted">Margin: <span className={cn("font-mono font-semibold", marginPct > 60 ? "text-success" : marginPct > 40 ? "text-warning" : "text-error")}>{marginPct.toFixed(1)}%</span></p></div>
                {expandedId === item.id ? <ChevronUp className="w-4 h-4 text-text-muted" /> : <ChevronDown className="w-4 h-4 text-text-muted" />}
              </div>
            </button>

            {expandedId === item.id && (
              <div className="px-5 pb-4 border-t border-border pt-4 space-y-4">
                {rs.length === 0 ? <p className="text-sm text-text-muted text-center py-4">No ingredients. Add one below.</p> : (
                  <table className="w-full text-sm">
                    <thead><tr className="border-b border-border text-left text-text-muted"><th className="pb-2 font-medium">Ingredient</th><th className="pb-2 font-medium">Quantity</th><th className="pb-2 font-medium">Unit Cost</th><th className="pb-2 font-medium">Total</th><th className="pb-2 font-medium"></th></tr></thead>
                    <tbody>
                      {rs.map((r) => {
                        const mat = rawMaterials.find((m) => m.id === r.raw_material_id);
                        const isEditing = editing?.id === r.id;
                        return (
                          <tr key={r.id} className="border-b border-border-subtle">
                            <td className="py-2 font-medium">{mat?.name ?? r.raw_material_id}</td>
                            <td className="py-2 font-mono">
                              {isEditing ? <input value={editQty} onChange={(e) => setEditQty(e.target.value)} type="number" className="w-20 px-2 py-1 rounded-lg border border-border bg-background text-sm" /> : `${r.quantity} ${mat?.unit ?? ""}`}
                            </td>
                            <td className="py-2 font-mono text-text-secondary">₹{mat?.cost_per_unit ?? "-"}</td>
                            <td className="py-2 font-mono font-semibold">₹{(Number(r.quantity) * Number(mat?.cost_per_unit ?? 0)).toFixed(2)}</td>
                            <td className="py-2 flex gap-1">
                              {isEditing ? (
                                <><button onClick={saveEdit} className="p-1.5 rounded-lg bg-success text-white"><Save className="w-3.5 h-3.5" /></button><button onClick={() => setEditing(null)} className="p-1.5 rounded-lg border border-border"><X className="w-3.5 h-3.5" /></button></>
                              ) : (
                                <><button onClick={() => startEdit(r)} className="p-1.5 rounded-lg hover:bg-surface-hover"><Pencil className="w-3.5 h-3.5" /></button><button onClick={() => handleDelete(r)} className="p-1.5 rounded-lg hover:bg-error/10 text-error"><Trash2 className="w-3.5 h-3.5" /></button></>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}

                {addingFor === item.id ? (
                  <div className="flex flex-wrap gap-2 items-end p-3 rounded-xl bg-background border border-border">
                    <div>
                      <label className="text-xs font-semibold tracking-widest text-text-muted">INGREDIENT</label>
                      <select value={newIng.raw_material_id} onChange={(e) => setNewIng({ ...newIng, raw_material_id: e.target.value })} className="mt-1 px-3 py-2 rounded-lg border border-border bg-surface text-sm outline-none focus:border-accent">
                        <option value="">Select...</option>{rawMaterials.map((m) => <option key={m.id} value={m.id}>{m.name} ({m.unit})</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-semibold tracking-widest text-text-muted">QTY</label>
                      <input type="number" value={newIng.quantity} onChange={(e) => setNewIng({ ...newIng, quantity: e.target.value })} placeholder="18" className="mt-1 w-24 px-3 py-2 rounded-lg border border-border bg-surface text-sm outline-none focus:border-accent" />
                    </div>
                    <button onClick={() => handleAdd(item.id)} className="px-4 py-2 rounded-lg bg-accent text-white text-sm font-medium">Add</button>
                    <button onClick={() => setAddingFor(null)} className="px-4 py-2 rounded-lg border border-border text-sm">Cancel</button>
                  </div>
                ) : (
                  <button onClick={() => setAddingFor(item.id)} className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border hover:bg-surface-hover text-sm"><Plus className="w-4 h-4" /> Add ingredient</button>
                )}

                <div className="flex flex-wrap gap-4 text-sm pt-3 border-t border-border">
                  <span className="text-text-muted">Selling: <span className="font-semibold text-text-primary">{formatCurrency(Number(item.price))}</span></span>
                  <span className="text-text-muted">Cost: <span className="font-mono">{formatCurrency(Math.round(totalCost))}</span></span>
                  <span className="text-text-muted">Margin: <span className={cn("font-semibold", marginPct > 60 ? "text-success" : marginPct > 40 ? "text-warning" : "text-error")}>{formatCurrency(Math.round(margin))} ({marginPct.toFixed(1)}%)</span></span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
