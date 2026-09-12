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
import {
  IndianRupee,
  ShoppingBag,
  TrendingUp,
  Grid3X3,
  AlertTriangle,
  Package,
} from "lucide-react";

export default function DashboardPage() {
  const stats = mockDashboardStats;

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
      <RecentOrders orders={mockRecentOrders} />
    </div>
  );
}
