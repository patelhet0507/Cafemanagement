"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { cn } from "@/lib/utils";
import { mockRecentOrders } from "@/lib/mock-data";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { Search, Filter, Download } from "lucide-react";

const statusColors: Record<string, string> = {
  pending: "bg-warning-bg text-warning-text",
  confirmed: "bg-info-bg text-info-text",
  preparing: "bg-info-bg text-info-text",
  paid: "bg-success-bg text-success-text",
};

export default function OrdersPage() {
  const [orders, setOrders] = useState(mockRecentOrders);
  useEffect(() => {
    if (!isSupabaseConfigured) return;
    (async () => {
      const { data } = await supabase.from("orders").select("id, status, total, created_at, table_id").order("created_at", { ascending: false }).limit(20);
      if (!data?.length) return;
      const { data: tables } = await supabase.from("tables").select("id, number");
      const tmap = new Map((tables as { id: string; number: number }[] | null)?.map((t) => [t.id, t.number]) ?? []);
      setOrders((data as { id: string; status: string; total: number; created_at: string; table_id: string }[]).map((o) => ({ id: o.id.slice(0, 5), table: tmap.get(o.table_id) ?? 0, items: "", amount: Number(o.total), status: o.status as (typeof mockRecentOrders)[number]["status"], time: new Date(o.created_at).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }) })));
    })();
  }, []);
  return (
    <div>
      <PageHeader title="Orders" description="View and manage all orders">
        <button className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border text-sm hover:bg-surface-hover transition-colors">
          <Download className="w-4 h-4" /> Export CSV
        </button>
      </PageHeader>
      <div className="bg-surface rounded-xl border border-border overflow-hidden">
        <div className="flex items-center gap-3 px-5 py-3 border-b border-border">
          <div className="flex items-center gap-2 flex-1 px-3 py-2 rounded-lg bg-background border border-border">
            <Search className="w-4 h-4 text-text-muted" />
            <input placeholder="Search orders..." className="bg-transparent text-sm outline-none flex-1" />
          </div>
          <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border text-sm text-text-secondary hover:bg-surface-hover">
            <Filter className="w-3.5 h-3.5" /> Filter
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-text-muted">
                <th className="px-5 py-3 font-medium">Order</th>
                <th className="px-5 py-3 font-medium">Table</th>
                <th className="px-5 py-3 font-medium">Items</th>
                <th className="px-5 py-3 font-medium">Amount</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {orders.map((o) => (
                <tr key={o.id} className="hover:bg-surface-hover transition-colors">
                  <td className="px-5 py-3 font-mono font-medium">#{o.id}</td>
                  <td className="px-5 py-3">T{o.table}</td>
                  <td className="px-5 py-3 text-text-secondary max-w-[200px] truncate">{o.items}</td>
                  <td className="px-5 py-3 font-mono font-semibold">₹{o.amount}</td>
                  <td className="px-5 py-3">
                    <span className={cn("inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold capitalize", statusColors[o.status] || "bg-surface-hover text-text-secondary")}>
                      {o.status}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-text-muted">{o.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
