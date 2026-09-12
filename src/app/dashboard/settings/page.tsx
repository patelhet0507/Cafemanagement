"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { Upload, Trash2, QrCode, Save } from "lucide-react";
import { useToast } from "@/components/shared/toaster";
import { useUpiQr, saveUpiQr } from "@/lib/settings";

export default function SettingsPage() {
  const toast = useToast();
  const qr = useUpiQr();
  const [preview, setPreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const display = preview ?? qr;

  useEffect(() => { if (qr) setPreview(qr); }, [qr]);

  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.size > 2 * 1024 * 1024) { toast("Image too large (max 2MB)", "error"); return; }
    const r = new FileReader();
    r.onload = () => setPreview(String(r.result));
    r.readAsDataURL(f);
  };

  const save = async () => {
    if (!preview) { toast("Select an image first", "error"); return; }
    setSaving(true);
    try {
      await saveUpiQr(preview);
      toast("UPI QR saved — customers will see it on Pay Now");
    } catch (e) {
      const m = (e as any)?.message ?? String(e);
      toast(m, "error");
    } finally { setSaving(false); }
  };

  const remove = async () => {
    setPreview(null);
    localStorage.removeItem("cafeflow_upi_qr");
    try {
      const { supabase } = await import("@/lib/supabase");
      await supabase.from("app_settings").delete().eq("key", "upi_qr");
    } catch {}
    toast("UPI QR removed");
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <PageHeader title="Settings" description="Payment & store settings" />

      <div className="bg-surface rounded-2xl border border-border p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-accent/10 text-accent flex items-center justify-center"><QrCode className="w-5 h-5" /></div>
          <div>
            <h3 className="font-semibold">UPI Payment QR</h3>
            <p className="text-xs text-text-muted">Shown when customer taps Pay Now. Upload your UPI QR image.</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-6">
          <div className="w-full sm:w-64 h-64 rounded-2xl border-2 border-dashed border-border bg-background flex items-center justify-center overflow-hidden shrink-0">
            {display ? <img src={display} alt="UPI QR" className="w-full h-full object-contain p-2" /> : <span className="text-xs text-text-muted text-center px-4">No QR set<br />Upload below</span>}
          </div>
          <div className="flex-1 space-y-3">
            <label className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-border bg-background hover:bg-surface-hover text-sm font-medium cursor-pointer">
              <Upload className="w-4 h-4" /> Choose image
              <input type="file" accept="image/*" onChange={onFile} className="hidden" />
            </label>
            <input value={display ?? ""} onChange={(e) => setPreview(e.target.value)} placeholder="Or paste image URL" className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm outline-none focus:border-accent" />
            <div className="flex gap-2">
              <button onClick={save} disabled={saving || !preview} className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-accent text-white font-semibold hover:bg-accent-hover disabled:opacity-40"><Save className="w-4 h-4" /> {saving ? "Saving…" : "Save QR"}</button>
              <button onClick={remove} className="px-4 py-2.5 rounded-xl border border-border hover:bg-error/10 hover:text-error text-sm flex items-center gap-1"><Trash2 className="w-4 h-4" /> Remove</button>
            </div>
            <p className="text-[11px] text-text-muted">Customers choosing Pay Now will see this QR with total. Pay at Counter remains for cash.</p>
          </div>
        </div>
      </div>

      <div className="bg-surface rounded-2xl border border-border p-6">
        <h3 className="font-semibold">How it works</h3>
        <ul className="text-sm text-text-secondary mt-2 space-y-1 list-disc pl-4">
          <li>Try Customer Menu → Scan QR → Table → Menu → Add items → Cart shows <b>Pay Now</b> (UPI QR) and <b>Pay at Counter</b>.</li>
          <li>Pay Now creates order as <span className="font-mono bg-surface-hover px-1 rounded">paid via UPI</span>, Pay at Counter as <span className="font-mono bg-surface-hover px-1 rounded">unpaid</span>.</li>
          <li>Update this QR anytime — customers see new one instantly (localStorage + Supabase app_settings).</li>
        </ul>
      </div>
    </div>
  );
}
