"use client";

import { PageHeader } from "@/components/shared/page-header";
import { mockCustomers } from "@/lib/mock-data";
import { useSupabaseTable } from "@/lib/supabase-helpers";
import type { Customer } from "@/types/database";
import { formatCurrency } from "@/lib/utils";
import { Users, UserPlus, TrendingUp, Repeat, Search } from "lucide-react";

export default function CustomersPage() {
  const { data: customers } = useSupabaseTable<Customer>(
    "customers",
    mockCustomers,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (q: any) => q.order("visit_count", { ascending: false }).limit(50)
  );
  return (
    <div className="space-y-6">
      <PageHeader title="Customers" description="Your auto-built CRM from QR orders" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-surface rounded-xl border border-border"><div className="flex items-center justify-between mb-2"><p className="text-xs text-text-muted">Total Customers</p><Users className="w-4 h-4 text-accent" /></div><p className="text-2xl font-semibold font-mono">{customers.length}</p></div>
        <div className="p-4 bg-surface rounded-xl border border-border"><div className="flex items-center justify-between mb-2"><p className="text-xs text-text-muted">New This Month</p><UserPlus className="w-4 h-4 text-success" /></div><p className="text-2xl font-semibold font-mono">89</p></div>
        <div className="p-4 bg-surface rounded-xl border border-border"><div className="flex items-center justify-between mb-2"><p className="text-xs text-text-muted">Returning</p><Repeat className="w-4 h-4 text-info" /></div><p className="text-2xl font-semibold font-mono">34%</p></div>
        <div className="p-4 bg-surface rounded-xl border border-border"><div className="flex items-center justify-between mb-2"><p className="text-xs text-text-muted">Avg Spend</p><TrendingUp className="w-4 h-4 text-warning" /></div><p className="text-2xl font-semibold font-mono">{formatCurrency(420)}</p></div>
      </div>
      <div className="bg-surface rounded-xl border border-border overflow-hidden">
        <div className="px-5 py-3 border-b border-border"><div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-background border border-border max-w-sm"><Search className="w-4 h-4 text-text-muted" /><input placeholder="Search customers..." className="bg-transparent text-sm outline-none flex-1" /></div></div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm"><thead><tr className="border-b border-border text-left text-text-muted"><th className="px-5 py-3 font-medium">Name</th><th className="px-5 py-3 font-medium">Phone</th><th className="px-5 py-3 font-medium">Orders</th><th className="px-5 py-3 font-medium">Total Spent</th><th className="px-5 py-3 font-medium">Last Visit</th></tr></thead>
          <tbody className="divide-y divide-border">
            {customers.map((c) => (
              <tr key={c.id} className="hover:bg-surface-hover transition-colors cursor-pointer">
                <td className="px-5 py-3"><div className="flex items-center gap-2.5"><div className="w-8 h-8 rounded-full bg-accent/10 text-accent flex items-center justify-center text-xs font-semibold">{c.name[0]}</div><span className="font-medium">{c.name}</span></div></td>
                <td className="px-5 py-3 font-mono text-text-secondary">{c.phone}</td>
                <td className="px-5 py-3 font-mono">{c.visit_count}</td>
                <td className="px-5 py-3 font-mono font-semibold">{formatCurrency(c.visit_count * 350)}</td>
                <td className="px-5 py-3 text-text-muted">{new Date(c.last_visit).toLocaleDateString("en-IN")}</td>
              </tr>
            ))}
          </tbody></table>
        </div>
      </div>
    </div>
  );
}