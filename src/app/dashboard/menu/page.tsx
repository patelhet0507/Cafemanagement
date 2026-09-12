"use client";

import { useState, useMemo } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { mockMenuItems } from "@/lib/mock-data";
import { useSupabaseTable } from "@/lib/supabase-helpers";
import type { MenuItem } from "@/types/database";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { formatCurrency } from "@/lib/utils";
import { Plus, ToggleLeft, ToggleRight, Pencil, Trash2, X, Upload, ImageIcon, Search, FolderPlus, ChevronDown, ChevronRight } from "lucide-react";
import { MenuCard } from "@/components/menu/menu-card";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { useToast } from "@/components/shared/toaster";

const defaultSections = ["Recommended", "Main Course", "Appetizer", "Starter", "Hot Coffee", "Cold Coffee", "Chai & Tea", "Fresh Drinks", "Snacks", "Desserts"];
const categoryEmoji: Record<string, string> = { "Hot Coffee": "☕", "Cold Coffee": "☕", "Chai & Tea": "🍵", "Fresh Drinks": "🧃", Snacks: "🥪", Desserts: "🍰", "Main Course": "🍛", Appetizer: "🥗", Starter: "🍢", Recommended: "⭐" };

type FormState = { name: string; description: string; price: string; category: string; image_url: string; prep_time_min: string; is_available: boolean };
const emptyForm: FormState = { name: "", description: "", price: "", category: "Main Course", image_url: "", prep_time_min: "5", is_available: true };

function MenuModal({ open, onClose, form, setForm, onSave, saving, title, sections }: { open: boolean; onClose: () => void; form: FormState; setForm: (f: FormState) => void; onSave: () => void; saving: boolean; title: string; sections: string[] }) {
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
                <input value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} placeholder="https://... or upload" className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm outline-none focus:border-accent" />
                <label className="flex items-center gap-2 px-3 py-2 rounded-lg border border-dashed border-border hover:bg-surface-hover text-xs font-medium cursor-pointer">
                  <Upload className="w-3.5 h-3.5" /> Upload
                  <input type="file" accept="image/*" onChange={onFile} className="hidden" />
                </label>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <label className="text-xs font-semibold tracking-widest text-text-muted">NAME</label>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Paneer Tikka" className="mt-1 w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm outline-none focus:border-accent" />
            </div>
            <div className="col-span-2">
              <label className="text-xs font-semibold tracking-widest text-text-muted">DESCRIPTION</label>
              <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Description..." rows={2} className="mt-1 w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm outline-none focus:border-accent resize-none" />
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
              <label className="text-xs font-semibold tracking-widest text-text-muted">SECTION</label>
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="mt-1 w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm outline-none focus:border-accent">
                {sections.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
              <p className="text-[11px] text-text-muted mt-1">Create new section via “Add Section” button.</p>
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
  const { data: live, refetch, loading } = useSupabaseTable<MenuItem>("menu_items", mockMenuItems);
  const items = live;
  const toast = useToast();
  const [sections, setSections] = useState<string[]>(defaultSections);
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState<Record<string, boolean>>({ "Main Course": true, Appetizer: true, Starter: true });
  const [showAdd, setShowAdd] = useState(false);
  const [editing, setEditing] = useState<MenuItem | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [showSection, setShowSection] = useState(false);
  const [newSection, setNewSection] = useState("");
  const [confirm, setConfirm] = useState<{ title: string; desc: string; onConfirm: () => void } | null>(null);

  const allSections = useMemo(() => {
    const liveCats = Array.from(new Set(items.map((i) => i.category)));
    return Array.from(new Set([...sections, ...liveCats]));
  }, [sections, items]);

  const filteredBySearch = useMemo(() => {
    if (!search) return items;
    const s = search.toLowerCase();
    return items.filter((it) => it.name.toLowerCase().includes(s) || it.category.toLowerCase().includes(s));
  }, [items, search]);

  const grouped = useMemo(() => {
    const map: Record<string, MenuItem[]> = {};
    for (const sec of allSections) map[sec] = [];
    for (const it of filteredBySearch) {
      if (!map[it.category]) map[it.category] = [];
      map[it.category].push(it);
    }
    return map;
  }, [allSections, filteredBySearch]);

  const openAdd = (section?: string) => { setForm({ ...emptyForm, category: section || allSections[0] || "Main Course" }); setShowAdd(true); };
  const openEdit = (it: MenuItem) => {
    setEditing(it);
    setForm({ name: it.name, description: it.description, price: String(it.price), category: it.category, image_url: it.image_url || "", prep_time_min: String(it.prep_time_min), is_available: it.is_available });
  };

  const addSection = () => {
    if (!newSection.trim()) return;
    if (allSections.includes(newSection.trim())) { toast("Section already exists", "error"); return; }
    setSections([...sections, newSection.trim()]);
    setNewSection(""); setShowSection(false); toast("Section created");
  };

  const toggle = async (it: MenuItem) => {
    if (isSupabaseConfigured) {
      await supabase.from("menu_items").update({ is_available: !it.is_available } as never).eq("id", it.id);
      refetch();
    }
  };

  const handleDelete = (it: MenuItem) => {
    setConfirm({ title: `Delete ${it.name}?`, desc: "This will permanently remove the item and its image.", onConfirm: async () => {
      setConfirm(null);
      if (isSupabaseConfigured) {
        const { error } = await supabase.from("menu_items").delete().eq("id", it.id);
        if (error) { toast(error.message.includes("schema cache") ? "Schema cache stale — run NOTIFY pgrst, 'reload schema'; or re-run 001 migration." : error.message, "error"); return; }
        toast("Item deleted"); refetch();
      }
    }});
  };

  const handleDeleteSection = (sec: string) => {
    const count = grouped[sec]?.length ?? 0;
    if (count > 0) {
      setConfirm({ title: `Delete section "${sec}"?`, desc: `${count} items in this section. Choose to keep or delete them.`, onConfirm: () => {
        setConfirm({ title: `Delete ${count} items too?`, desc: `Cancel keeps items (you must reassign their section). Confirm deletes everything.`, onConfirm: async () => {
          setConfirm(null);
          if (isSupabaseConfigured) { await supabase.from("menu_items").delete().eq("category", sec); refetch(); }
          setSections((s) => s.filter((x) => x !== sec)); toast("Section deleted");
        }});
      }});
      return;
    }
    setSections((s) => s.filter((x) => x !== sec)); toast("Section deleted");
  };

  const saveAdd = async () => {
    setSaving(true);
    try {
      const payload = { name: form.name, description: form.description, price: Number(form.price), category: form.category, image_url: form.image_url, prep_time_min: Number(form.prep_time_min), is_available: form.is_available };
      if (isSupabaseConfigured) {
        const { error } = await supabase.from("menu_items").insert(payload as never);
        if (error) throw error;
        setShowAdd(false); toast("Item added"); refetch();
      } else { toast("Supabase not configured", "error"); }
    } catch (e) { const m = (e as any)?.message ?? (e instanceof Error ? e.message : String(e)); toast(m.includes("schema cache") ? "Schema cache stale — run NOTIFY pgrst, 'reload schema';" : m, "error"); } finally { setSaving(false); }
  };

  const saveEdit = async () => {
    if (!editing) return;
    setSaving(true);
    try {
      const payload = { name: form.name, description: form.description, price: Number(form.price), category: form.category, image_url: form.image_url, prep_time_min: Number(form.prep_time_min), is_available: form.is_available };
      if (isSupabaseConfigured) {
        const { error } = await supabase.from("menu_items").update(payload as never).eq("id", editing.id);
        if (error) throw error;
        setEditing(null); toast("Item updated"); refetch();
      }
    } catch (e) { const m = (e as any)?.message ?? (e instanceof Error ? e.message : String(e)); toast(m.includes("schema cache") ? "Schema cache stale — run NOTIFY pgrst, 'reload schema';" : m, "error"); } finally { setSaving(false); }
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Menu" description="Sections contain items — all data from Supabase">
        <button onClick={() => setShowSection(true)} className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border text-sm hover:bg-surface-hover"><FolderPlus className="w-4 h-4" /> Add Section</button>
        <button onClick={() => openAdd()} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-accent text-white text-sm font-medium hover:bg-accent-hover"><Plus className="w-4 h-4" /> Add Item</button>
      </PageHeader>

      {showSection && (
        <div className="bg-surface rounded-xl border border-border p-4 flex gap-2 items-end">
          <div className="flex-1">
            <label className="text-xs font-semibold tracking-widest text-text-muted">NEW SECTION NAME</label>
            <input value={newSection} onChange={(e) => setNewSection(e.target.value)} placeholder="e.g. Main Course" className="mt-1 w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm outline-none focus:border-accent" />
          </div>
          <button onClick={addSection} className="px-4 py-2.5 rounded-xl bg-accent text-white text-sm font-medium hover:bg-accent-hover">Create</button>
          <button onClick={() => setShowSection(false)} className="px-4 py-2.5 rounded-xl border border-border text-sm">Cancel</button>
        </div>
      )}

      <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-surface border border-border max-w-sm">
        <Search className="w-4 h-4 text-text-muted" /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search items..." className="bg-transparent text-sm outline-none flex-1" />
      </div>

      {loading ? <p className="text-sm text-text-muted text-center py-8">Loading from Supabase…</p> : null}
      {!loading && items.length === 0 && <div className="py-16 text-center rounded-2xl border border-dashed border-border bg-surface"><p className="text-sm text-text-muted">No items in Supabase. Add a section and items.</p></div>}

      <div className="space-y-4">
        {allSections.map((sec) => {
          const secItems = grouped[sec] ?? [];
          const isExpanded = expanded[sec] ?? false;
          const isEmpty = secItems.length === 0;
          // hide empty sections when searching
          if (search && isEmpty) return null;
          return (
            <div key={sec} className="bg-surface rounded-2xl border border-border overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 hover:bg-surface-hover/50">
                <button onClick={() => setExpanded({ ...expanded, [sec]: !isExpanded })} className="flex items-center gap-3 flex-1 text-left">
                  {isExpanded ? <ChevronDown className="w-4 h-4 text-text-muted" /> : <ChevronRight className="w-4 h-4 text-text-muted" />}
                  <span className="text-lg">{categoryEmoji[sec] || "📋"}</span>
                  <h3 className="font-semibold">{sec}</h3>
                  <span className="text-xs bg-surface-hover border border-border px-2 py-0.5 rounded-full">{secItems.length} items</span>
                </button>
                <div className="flex items-center gap-1.5">
                  <button onClick={() => openAdd(sec)} className="p-2 rounded-lg hover:bg-accent/10 text-accent"><Plus className="w-4 h-4" /></button>
                  {sec !== "Recommended" && <button onClick={() => handleDeleteSection(sec)} className="p-2 rounded-lg hover:bg-error/10 text-text-muted hover:text-error"><Trash2 className="w-4 h-4" /></button>}
                </div>
              </div>
              {isExpanded && (
                <div className="px-4 pb-4">
                  {isEmpty ? (
                    <div className="py-8 text-center border-t border-border border-dashed rounded-xl mt-2">
                      <p className="text-xs text-text-muted">No items in {sec}. <button onClick={() => openAdd(sec)} className="text-accent font-medium hover:underline">Add one</button></p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-3 pt-3 border-t border-border">
                      {secItems.map((item) => (
                        <div key={item.id} className="flex flex-col gap-2">
                          <MenuCard item={item} onAdd={() => toast("Customer preview")} />
                          <div className="flex gap-2">
                            <button onClick={() => toggle(item)} className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg border border-border bg-surface text-[11px] font-medium hover:bg-surface-hover">
                              {item.is_available ? <><ToggleRight className="w-4 h-4 text-success" /> On</> : <><ToggleLeft className="w-4 h-4 text-text-muted" /> Off</>}
                            </button>
                            <button onClick={() => openEdit(item)} className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg border border-border bg-surface text-[11px] font-medium hover:bg-surface-hover"><Pencil className="w-3 h-3" /> Edit</button>
                            <button onClick={() => handleDelete(item)} className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg bg-error/10 text-error hover:bg-error hover:text-white text-[11px] font-medium"><Trash2 className="w-3 h-3" /> Del</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <MenuModal open={showAdd} onClose={() => setShowAdd(false)} form={form} setForm={setForm} onSave={saveAdd} saving={saving} title="Add Item" sections={allSections} />
      <MenuModal open={!!editing} onClose={() => setEditing(null)} form={form} setForm={setForm} onSave={saveEdit} saving={saving} title="Edit Item" sections={allSections} />
      <ConfirmDialog open={!!confirm} title={confirm?.title ?? ""} description={confirm?.desc} onConfirm={() => confirm?.onConfirm()} onCancel={() => setConfirm(null)} />
    </div>
  );
}
