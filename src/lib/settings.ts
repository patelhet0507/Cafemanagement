"use client";
import { useEffect, useState } from "react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

const KEY = "cafeflow_upi_qr";

export function useUpiQr() {
  const [qr, setQr] = useState<string | null>(null);
  useEffect(() => {
    const local = typeof window !== "undefined" ? localStorage.getItem(KEY) : null;
    if (local) setQr(local);
    if (!isSupabaseConfigured) return;
    supabase.from("app_settings").select("value").eq("key", "upi_qr").maybeSingle().then(({ data }) => {
      const v = (data as { value: string } | null)?.value;
      if (v) { setQr(v); localStorage.setItem(KEY, v); }
    });
  }, []);
  return qr;
}

export async function saveUpiQr(dataUrl: string) {
  localStorage.setItem(KEY, dataUrl);
  if (isSupabaseConfigured) {
    // upsert, ignore if table missing
    try {
      await supabase.from("app_settings").upsert({ key: "upi_qr", value: dataUrl } as never);
    } catch {}
  }
}
