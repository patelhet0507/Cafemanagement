"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, PieChart, Pie, Cell, LabelList } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

const revenueConfig = {
  revenue: { label: "Revenue", color: "var(--chart-1)" },
} satisfies ChartConfig;

export function RevenueChart({ data }: { data: { day: string; revenue: number }[] }) {
  return (
    <div className="bg-surface rounded-2xl border border-border p-5">
      <div className="flex items-center justify-between mb-1">
        <h3 className="font-semibold">Revenue This Week</h3>
        <span className="text-xs px-2 py-1 rounded-full bg-success-bg text-success-text font-medium">+12.4% WoW</span>
      </div>
      <p className="text-xs text-text-muted mb-4">Mon–Sun · GST included</p>
      <ChartContainer config={revenueConfig} className="h-[250px] w-full">
        <BarChart accessibilityLayer data={data} barCategoryGap="20%">
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
          <XAxis dataKey="day" tickLine={false} tickMargin={10} axisLine={false} tick={{ fontSize: 12 }} />
          <YAxis
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 11 }}
            tickFormatter={(v: number) => `₹${(v / 1000).toFixed(0)}k`}
          />
          <ChartTooltip
            cursor={{ fill: "var(--color-surface-hover)" }}
            content={<ChartTooltipContent formatter={(value) => `₹${Number(value).toLocaleString("en-IN")}`} />}
          />
          <Bar dataKey="revenue" fill="var(--color-revenue)" radius={[8, 8, 0, 0]}>
            <LabelList dataKey="revenue" position="top" className="fill-(--color-text-muted)" fontSize={10} formatter={(v: unknown) => `₹${(Number(v) / 1000).toFixed(0)}k`} />
          </Bar>
        </BarChart>
      </ChartContainer>
    </div>
  );
}

const CATEGORY_COLORS = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)", "var(--chart-5)"];

export function CategoryChart({ data }: { data: { name: string; value: number; color: string }[] }) {
  const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  const config = Object.fromEntries(
    data.map((d, i) => [slug(d.name), { label: d.name, color: CATEGORY_COLORS[i % CATEGORY_COLORS.length] }])
  ) satisfies ChartConfig;
  const chartData = data.map((d, i) => ({ ...d, fill: CATEGORY_COLORS[i % CATEGORY_COLORS.length] }));

  return (
    <div className="bg-surface rounded-2xl border border-border p-5">
      <h3 className="font-semibold">Sales by Category</h3>
      <p className="text-xs text-text-muted mb-3">Share of revenue</p>
      <div className="h-[250px] flex items-center">
        <div className="w-1/2 h-full relative">
          <ChartContainer config={config} className="h-full w-full">
            <PieChart>
              <ChartTooltip content={<ChartTooltipContent nameKey="name" hideLabel />} />
              <Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={68} outerRadius={92} stroke="none">
                {chartData.map((entry) => (
                  <Cell key={entry.name} fill={entry.fill} />
                ))}
              </Pie>
            </PieChart>
          </ChartContainer>
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center"><p className="text-[11px] tracking-widest text-text-muted">TOTAL</p><p className="text-sm font-semibold">100%</p></div>
          </div>
        </div>
        <div className="w-1/2 space-y-0 pl-4">
          {chartData.map((item) => (
            <div key={item.name} className="flex items-center gap-2 py-2 border-b border-border-subtle last:border-0">
              <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.fill }} />
              <span className="text-xs text-text-secondary flex-1">{item.name}</span>
              <span className="text-xs font-semibold tabular-nums">{item.value}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
