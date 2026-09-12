"use client";
import { useEffect, useState, useCallback } from "react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

// Generic fetch hook with mock fallback
export function useSupabaseTable<T>(
  table: string,
  mock: T[],
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  query?: (q: any) => any,
  deps: unknown[] = []
) {
  const [data, setData] = useState<T[]>(mock);
  const [loading, setLoading] = useState(isSupabaseConfigured);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let q: any = supabase.from(table).select("*");
      if (query) q = query(q);
      const { data: rows, error: err } = await q;
      if (err) throw err;
      if (rows && rows.length > 0) setData(rows as unknown as T[]);
      else setData(mock); // empty table → show mocks so UI not blank
      setError(null);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : String(e));
      setData(mock);
    } finally {
      setLoading(false);
    }
  }, deps); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { data, loading, error, refetch: fetch, isLive: isSupabaseConfigured && !error };
}

// Place order: inserts orders + order_items, deducts stock via audit_log (app-level, no DB function yet)
export async function placeSupabaseOrder(args: {
  tableId: string | null;
  customerPhone: string | null;
  items: { id: string; price: number; quantity: number }[];
  total: number;
}) {
  if (!isSupabaseConfigured) return { id: `mock_${Date.now()}`, mocked: true };

  // upsert customer by phone
  let customerId: string | null = null;
  if (args.customerPhone) {
    const { data: existing } = await supabase.from("customers").select("id, visit_count").eq("phone", args.customerPhone).maybeSingle();
    if (existing) {
      const row = existing as { id: string; visit_count: number };
      customerId = row.id;
      await supabase.from("customers").update({ visit_count: row.visit_count + 1, last_visit: new Date().toISOString() } as never).eq("id", customerId);
    } else {
      const { data: created } = await supabase.from("customers").insert({ phone: args.customerPhone, visit_count: 1 } as never).select("id").single();
      if (created) customerId = (created as { id: string }).id;
    }
  }

  const { data: order, error: oErr } = await supabase
    .from("orders")
    .insert({
      table_id: args.tableId,
      customer_id: customerId,
      status: "pending",
      total: args.total,
      payment_status: "unpaid",
    } as never)
    .select("id")
    .single();
  if (oErr) throw oErr;
  const orderId = (order as { id: string }).id;

  // occupy table
  if (args.tableId) await supabase.from("tables").update({ status: "occupied" } as never).eq("id", args.tableId);

  if (args.items.length) {
    const rows = args.items.map((it) => ({
      order_id: orderId,
      menu_item_id: it.id,
      quantity: it.quantity,
      unit_price: it.price,
      status: "pending",
    }));
    const { error: iErr } = await supabase.from("order_items").insert(rows as never);
    if (iErr) throw iErr;
  }

  // app-level stock deduct + audit (best-effort, no transaction)
  try {
    const { data: recipes } = await supabase.from("recipes").select("raw_material_id, quantity, menu_item_id").in("menu_item_id", args.items.map((i) => i.id));
    if (recipes) {
      for (const it of args.items) {
        const rel = (recipes as { raw_material_id: string; quantity: number; menu_item_id: string }[]).filter((r) => r.menu_item_id === it.id);
        for (const r of rel) {
          const deduct = r.quantity * it.quantity;
          // read current stock then update
          const { data: rm } = await supabase.from("raw_materials").select("current_stock").eq("id", r.raw_material_id).single();
          if (rm) {
            const cur = (rm as { current_stock: number }).current_stock;
            await supabase.from("raw_materials").update({ current_stock: Math.max(0, cur - deduct) } as never).eq("id", r.raw_material_id);
            await supabase.from("audit_log").insert({ raw_material_id: r.raw_material_id, change: -deduct, reason: "order_deduction", reference_id: orderId } as never);
          }
        }
      }
    }
  } catch {
    // non-fatal
  }

  return { id: orderId, mocked: false };
}
