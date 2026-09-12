"use client";

import { cn } from "@/lib/utils";

const statusColors: Record<string, string> = {
  pending: "bg-warning-bg text-warning-text",
  confirmed: "bg-[#EEF2FF] text-[#3730A3]",
  preparing: "bg-info-bg text-info-text",
  ready: "bg-success-bg text-success-text",
  served: "bg-success-bg text-success-text",
  paid: "bg-success-bg text-success-text",
};

const statusLabels: Record<string, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  preparing: "Preparing",
  ready: "Ready",
  served: "Served",
  paid: "Paid",
};

interface RecentOrder {
  id: string;
  table: number;
  items: string;
  amount: number;
  status: string;
  time: string;
}

export function RecentOrders({ orders }: { orders: RecentOrder[] }) {
  return (
    <div className="bg-surface rounded-2xl border border-border">
      <div className="flex items-center justify-between px-5 py-4 border-b border-border">
        <h3 className="font-semibold">Recent Orders</h3>
        <button className="text-xs font-medium text-accent hover:text-accent-hover transition-colors">
          View all
        </button>
      </div>
      <div className="divide-y divide-border">
        {orders.map((order) => (
          <div key={order.id} className="flex items-center gap-4 px-5 py-4 hover:bg-surface-hover transition-colors">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-background border border-border text-sm font-semibold">
              T{order.table}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{order.items}</p>
              <p className="text-xs text-text-muted mt-0.5">#{order.id} · {order.time}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold font-mono">₹{order.amount}</p>
              <span className={cn("inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold mt-0.5", statusColors[order.status])}>
                {statusLabels[order.status]}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
