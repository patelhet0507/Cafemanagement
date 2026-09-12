"use client";

import { getGreeting, formatCurrency } from "@/lib/utils";
import { KPICard } from "@/components/shared/kpi-card";
import { RevenueChart, CategoryChart } from "@/components/dashboard/sales-chart";
import { RecentOrders } from "@/components/dashboard/recent-orders";
import {
  mockDashboardStats,
  mockRecentOrders,
  mockRevenueData,
  mockCategoryData,
} from "@/lib/mock-data";
import { useEffect, useState } from "react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import {
  IndianRupee,
  ShoppingBag,
  TrendingUp,
  Grid3X3,
  AlertTriangle,
  Package,
} from "lucide-react";

export default function DashboardPage() {
  const [stats, setStats] = useState(mockDashboardStats);
  const [recent, setRecent] = useState(mockRecentOrders);
  useEffect(() => {
    if (!isSupabaseConfigured) return;
    (async () => {
      const today = new Date().toISOString().slice(0, 10);
      const { data: orders } = await supabase.from("orders").select("total, status, payment_status, created_at, table_id").gte("created_at", today);
      if (orders?.length) {
        const todays = orders as { total: number; status: string; payment_status: string; created_at: string; table_id: string }[];
        const sales = todays.filter((o) => o.payment_status === "paid").reduce((s, o) => s + Number(o.total), 0) || todays.reduce((s, o) => s + Number(o.total), 0);
        const unpaid = todays.filter((o) => o.payment_status === "unpaid").reduce((s, o) => s + Number(o.total), 0);
        const active = new Set(todays.filter((o) => o.payment_status === "unpaid").map((o) => o.table_id)).size;
        setStats((p) => ({ ...p, todaysSales: Math.round(sales), todaysOrders: todays.length, avgOrderValue: todays.length ? Math.round(sales / todays.length) : p.avgOrderValue, activeTables: active, unpaidBills: Math.round(unpaid) }));
      }
      const { data: recentLive } = await supabase.from("orders").select("id, total, status, created_at, table_id").order("created_at", { ascending: false }).limit(5);
      if (recentLive?.length) {
        const { data: tables } = await supabase.from("tables").select("id, number");
        const tmap = new Map((tables as { id: string; number: number }[] | null)?.map((t) => [t.id, t.number]) ?? []);
        setRecent((recentLive as { id: string; total: number; status: string; created_at: string; table_id: string }[]).map((o) => ({ id: o.id.slice(0, 5), table: tmap.get(o.table_id) ?? 0, items: "", amount: Math.round(Number(o.total)), status: o.status as (typeof mockRecentOrders)[number]["status"], time: new Date(o.created_at).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }) })));
      }
    })();
  }, []);

  return (
    <div className="space-y-6">
      {/* Greeting */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          {getGreeting()}, Het 👋
        </h1>
        <p className="text-sm text-text-secondary mt-0.5">
          Here&apos;s what&apos;s happening at your cafe today.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        <KPICard
          title="Today's Sales"
          value={formatCurrency(stats.todaysSales)}
          change={stats.salesChange}
          icon={<IndianRupee className="w-[18px] h-[18px]" />}
        />
        <KPICard
          title="Orders"
          value={stats.todaysOrders}
          change={12}
          changeLabel="vs yesterday"
          icon={<ShoppingBag className="w-[18px] h-[18px]" />}
        />
        <KPICard
          title="Avg Order Value"
          value={formatCurrency(stats.avgOrderValue)}
          change={stats.avgChange}
          icon={<TrendingUp className="w-[18px] h-[18px]" />}
        />
        <KPICard
          title="Active Tables"
          value={`${stats.activeTables}/12`}
          icon={<Grid3X3 className="w-[18px] h-[18px]" />}
        />
        <KPICard
          title="Unpaid Bills"
          value={formatCurrency(stats.unpaidBills)}
          icon={<AlertTriangle className="w-[18px] h-[18px]" />}
        />
        <KPICard
          title="Low Stock"
          value={stats.lowStockItems}
          icon={<Package className="w-[18px] h-[18px]" />}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <RevenueChart data={mockRevenueData} />
        </div>
        <div className="xl:col-span-1">
          <CategoryChart data={mockCategoryData} />
        </div>
      </div>

      {/* Recent Orders */}
      <RecentOrders orders={recent} />
    </div>
  );
}
