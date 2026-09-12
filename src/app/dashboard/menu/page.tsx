"use client";

import { useState, useMemo } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { mockMenuItems } from "@/lib/mock-data";
import { useSupabaseTable } from "@/lib/supabase-helpers";
import type { MenuItem } from "@/types/database";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { formatCurrency } from "@/lib/utils";
import { Plus, ToggleLeft, ToggleRight, Pencil, Trash2, X, Upload, ImageIcon, Search } from "lucide-react";

const categoryEmoji: Record<string, string> = { "Hot Coffee": "☕", "Cold Coffee": "☕", "Chai & Tea": "🍵", "Fresh Drinks": "🧃", Snacks: "🥪", Desserts: "🍰" };
const allCategories = ["Hot Coffee", "Cold Coffee", "Chai & Tea", "Fresh Drinks", "Snacks", "Desserts"];

type FormState = { name: string; description: string; price: string; category: string; image_url: string; prep_time_min: string; is_available: boolean };

const emptyForm: FormState = { name: "", description: "", price: "", category: "Hot Coffee", image_url: "", prep_time_min: "5", is_available: true };

function MenuModal({ open, onClose, form, setForm, onSave, saving, title }: { open: boolean; onClose: () => void; form: FormState; setForm: (f: FormState) => void; onSave: () => void; saving: boolean; title: string }) {
  if (!open) return null;
  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => setForm({ ...form, image_url: String(reader.result) });
    reader.readAsDataURL(f);
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div className="w-full max-w-lg bg-surface rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-border sticky top-0 bg-surface">
          <h3 className="font-semibold">{title}</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-lg hover:bg-surface-hover flex items-center justify-center"><X className="w-4 h-4" /></button>
        </div>
        <div className="p-5 space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-semibold tracking-widest text-text-muted">IMAGE</label>
            <div className="flex gap-3">
              <div className="w-24 h-24 rounded-xl border border-border bg-background flex items-center justify-center overflow-hidden shrink-0">
                {form.image_url ? <img src={form.image_url} alt="preview" className="w-full h-full object-cover" /> : <ImageIcon className="w-6 h-6 text-text-muted" />}
              </div>
              <div className="flex-1 space-y-2">
                <input value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} placeholder="https://... or upload file below" className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm outline-none focus:border-accent" />
                <label className="flex items-center gap-2 px-3 py-2 rounded-lg border border-dashed border-border hover:bg-surface-hover text-xs font-medium cursor-pointer">
                  <Upload className="w-3.5 h-3.5" /> Upload image
                  <input type="file" accept="image/*" onChange={onFile} className="hidden" />
                </label>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <label className="text-xs font-semibold tracking-widest text-text-muted">NAME</label>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Cappuccino" className="mt-1 w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm outline-none focus:border-accent" />
            </div>
            <div className="col-span-2">
              <label className="text-xs font-semibold tracking-widest text-text-muted">DESCRIPTION</label>
              <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Classic Italian..." rows={2} className="mt-1 w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm outline-none focus:border-accent resize-none" />
            </div>
            <div>
              <label className="text-xs font-semibold tracking-widest text-text-muted">PRICE (₹)</label>
              <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="180" className="mt-1 w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm outline-none focus:border-accent" />
            </div>
            <div>
              <label className="text-xs font-semibold tracking-widest text-text-muted">PREP MIN</label>
              <input type="number" value={form.prep_time_min} onChange={(e) => setForm({ ...form, prep_time_min: e.target.value })} placeholder="5" className="mt-1 w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm outline-none focus:border-accent" />
            </div>
            <div className="col-span-2">
              <label className="text-xs font-semibold tracking-widest text-text-muted">CATEGORY</label>
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="mt-1 w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm outline-none focus:border-accent">
                {allCategories.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <label className="col-span-2 flex items-center gap-2 text-sm font-medium cursor-pointer">
              <input type="checkbox" checked={form.is_available} onChange={(e) => setForm({ ...form, is_available: e.target.checked })} className="w-4 h-4 rounded accent-accent" /> Available
            </label>
          </div>
        </div>
        <div className="flex gap-2 p-5 border-t border-border">
          <button onClick={onSave} disabled={saving || !form.name || !form.price} className="flex-1 py-2.5 rounded-xl bg-accent text-white font-semibold hover:bg-accent-hover disabled:opacity-40">{saving ? "Saving…" : "Save"}</button>
          <button onClick={onClose} className="px-4 py-2.5 rounded-xl border border-border hover:bg-surface-hover text-sm">Cancel</button>
        </div>
      </div>
    </div>
  );
}

export default function MenuManagementPage() {
  const { data: live, refetch } = useSupabaseTable<MenuItem>("menu_items", mockMenuItems);
  const [local, setLocal] = useState<MenuItem[] | null>(null);
  const items = local ?? live;
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("All");
  const [showAdd, setShowAdd] = useState(false);
  const [editing, setEditing] = useState<MenuItem | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [saving, setSaving] = useState(false);

  const filtered = useMemo(() => items.filter((it) => {
    const s = search.toLowerCase();
    return (catFilter === "All" || it.category === catFilter) && (it.name.toLowerCase().includes(s) || it.category.toLowerCase().includes(s));
  }), [items, search, catFilter]);

  const openAdd = () => { setForm(emptyForm); setShowAdd(true); };
  const openEdit = (it: MenuItem) => {
    setEditing(it);
    setForm({ name: it.name, description: it.description, price: String(it.price), category: it.category, image_url: it.image_url || "", prep_time_min: String(it.prep_time_min), is_available: it.is_available });
  };

  const toggle = async (it: MenuItem) => {
    const next = { is_available: !it.is_available };
    if (isSupabaseConfigured) {
      await supabase.from("menu_items").update(next as never).eq("id", it.id);
      refetch();
    } else {
      setLocal(items.map((x) => (x.id === it.id ? { ...x, ...next } : x)));
    }
  };

  const handleDelete = async (it: MenuItem) => {
    if (!confirm(`Delete ${it.name}?`)) return;
    if (isSupabaseConfigured) {
      const { error } = await supabase.from("menu_items").delete().eq("id", it.id);
      if (error) return alert(error.message);
      refetch();
    } else {
      setLocal(items.filter((x) => x.id !== it.id));
    }
  };

  const saveAdd = async () => {
    setSaving(true);
    try {
      const payload = { name: form.name, description: form.description, price: Number(form.price), category: form.category, image_url: form.image_url, prep_time_min: Number(form.prep_time_min), is_available: form.is_available };
      if (isSupabaseConfigured) {
        const { error } = await supabase.from("menu_items").insert(payload as never);
        if (error) throw error;
        setShowAdd(false); refetch();
      } else {
        const newItem: MenuItem = { id: `m${Date.now()}`, ...payload };
        setLocal([newItem, ...items]); setShowAdd(false);
      }
    } catch (e) { alert(String(e instanceof Error ? e.message : e)); } finally { setSaving(false); }
  };

  const saveEdit = async () => {
    if (!editing) return;
    setSaving(true);
    try {
      const payload = { name: form.name, description: form.description, price: Number(form.price), category: form.category, image_url: form.image_url, prep_time_min: Number(form.prep_time_min), is_available: form.is_available };
      if (isSupabaseConfigured) {
        const { error } = await supabase.from("menu_items").update(payload as never).eq("id", editing.id);
        if (error) throw error;
        setEditing(null); refetch();
      } else {
        setLocal(items.map((x) => (x.id === editing.id ? { ...x, ...payload } : x))); setEditing(null);
      }
    } catch (e) { alert(String(e instanceof Error ? e.message : e)); } finally { setSaving(false); }
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Menu" description="Add, edit, delete items and images">
        <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-accent text-white text-sm font-medium hover:bg-accent-hover transition-colors"><Plus className="w-4 h-4" /> Add Item</button>
      </PageHeader>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-surface border border-border flex-1 max-w-sm">
          <Search className="w-4 h-4 text-text-muted" /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search name or category..." className="bg-transparent text-sm outline-none flex-1" />
        </div>
        <div className="flex gap-1.5 overflow-x-auto">
          {["All", ...allCategories].map((c) => (
            <button key={c} onClick={() => setCatFilter(c)} className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border ${catFilter === c ? "bg-primary text-white border-primary" : "bg-surface border-border hover:bg-surface-hover"}`}>{c}</button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((item) => (
          <div key={item.id} className="bg-surface rounded-2xl border border-border overflow-hidden hover:shadow-md transition-shadow flex flex-col">
            <div className="h-36 bg-background overflow-hidden flex items-center justify-center">
              {item.image_url ? <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" /> : <span className="text-3xl">{categoryEmoji[item.category] || "🍽️"}</span>}
            </div>
            <div className="p-4 flex-1 flex flex-col">
              <div className="flex items-start justify-between gap-2">
                <div><h3 className="font-semibold text-sm">{item.name}</h3><p className="text-[11px] text-text-muted">{item.category}</p></div>
                <span className="font-mono font-semibold text-accent text-sm">{formatCurrency(item.price)}</span>
              </div>
              <p className="text-xs text-text-muted mt-1.5 line-clamp-2 flex-1">{item.description}</p>
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
                <span className="text-[11px] text-text-muted">{item.prep_time_min} min</span>
                <button onClick={() => toggle(item)} className="flex items-center gap-1 text-xs font-medium">
                  {item.is_available ? <><ToggleRight className="w-5 h-5 text-success" /> <span className="text-success">Available</span></> : <><ToggleLeft className="w-5 h-5 text-text-muted" /> <span className="text-text-muted">Unavailable</span></>}
                </button>
              </div>
              <div className="flex gap-2 mt-3">
                <button onClick={() => openEdit(item)} className="flex-1 flex items-center justify-center gap-1 py-2 rounded-xl border border-border hover:bg-surface-hover text-xs font-medium"><Pencil className="w-3.5 h-3.5" /> Edit</button>
                <button onClick={() => handleDelete(item)} className="flex-1 flex items-center justify-center gap-1 py-2 rounded-xl bg-error/10 text-error hover:bg-error hover:text-white text-xs font-medium"><Trash2 className="w-3.5 h-3.5" /> Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {filtered.length === 0 && <p className="text-sm text-text-muted text-center py-8">No items match.</p>}

      <MenuModal open={showAdd} onClose={() => setShowAdd(false)} form={form} setForm={setForm} onSave={saveAdd} saving={saving} title="Add Item" />
      <MenuModal open={!!editing} onClose={() => setEditing(null)} form={form} setForm={setForm} onSave={saveEdit} saving={saving} title="Edit Item" />
    </div>
  );
}
