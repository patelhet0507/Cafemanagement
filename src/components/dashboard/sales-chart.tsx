"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: { value: number }[]; label?: string }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-surface border border-border rounded-lg px-3 py-2 shadow-lg">
        <p className="text-xs text-text-muted">{label}</p>
        <p className="text-sm font-semibold font-mono">₹{payload[0].value.toLocaleString("en-IN")}</p>
      </div>
    );
  }
  return null;
};

export function RevenueChart({ data }: { data: { day: string; revenue: number }[] }) {
  return (
    <div className="bg-surface rounded-2xl border border-border p-5">
      <div className="flex items-center justify-between mb-1">
        <h3 className="font-semibold">Revenue This Week</h3>
        <span className="text-xs px-2 py-1 rounded-full bg-success-bg text-success-text font-medium">+12.4% WoW</span>
      </div>
      <p className="text-xs text-text-muted mb-4">Mon–Sun · GST included</p>
      <div className="h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barCategoryGap="20%">
            <CartesianGrid strokeDasharray="3 3" stroke="#E8E0D6" vertical={false} />
            <XAxis dataKey="day" tick={{ fontSize: 12, fill: "#78716C" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: "#78716C" }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${(v/1000).toFixed(0)}k`} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "#F7F3EE" }} />
            <Bar dataKey="revenue" fill="#C2410C" radius={[8, 8, 0, 0]} activeBar={{ fill: "#9A3412" }} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function CategoryChart({ data }: { data: { name: string; value: number; color: string }[] }) {
  return (
    <div className="bg-surface rounded-2xl border border-border p-5">
      <h3 className="font-semibold">Sales by Category</h3>
      <p className="text-xs text-text-muted mb-3">Share of revenue</p>
      <div className="h-[250px] flex items-center">
        <div className="w-1/2 h-full relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={data} cx="50%" cy="50%" innerRadius={68} outerRadius={92} dataKey="value" stroke="none">
                {data.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center"><p className="text-[11px] tracking-widest text-text-muted">TOTAL</p><p className="text-sm font-semibold">100%</p></div>
          </div>
        </div>
        <div className="w-1/2 space-y-0 pl-4">
          {data.map((item) => (
            <div key={item.name} className="flex items-center gap-2 py-2 border-b border-border-subtle last:border-0">
              <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
              <span className="text-xs text-text-secondary flex-1">{item.name}</span>
              <span className="text-xs font-semibold tabular-nums">{item.value}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
