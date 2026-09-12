"use client";

import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown } from "lucide-react";

interface KPICardProps {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon: React.ReactNode;
  className?: string;
}

export function KPICard({ title, value, change, changeLabel, icon, className }: KPICardProps) {
  const isPositive = change !== undefined && change >= 0;
  const isWarning = title === "Unpaid Bills" || title === "Low Stock";
  return (
    <div className={cn("flex flex-col gap-3 p-4 sm:p-5 bg-surface rounded-2xl border border-border", isWarning ? "border-warning/20 bg-warning-bg/30" : "", className)}>
      <div className="flex items-center justify-between">
        <p className="text-[13px] font-medium text-text-secondary">{title}</p>
        <div className={cn("flex items-center justify-center w-9 h-9 rounded-xl border",
          isWarning ? "bg-warning-bg text-warning border-warning/20" : "bg-accent-light text-accent border-accent/10")}>
          {icon}
        </div>
      </div>
      <div>
        <p className="text-[26px] font-semibold tracking-tight tabular-nums">{value}</p>
        {change !== undefined && (
          <div className="flex items-center gap-1 mt-1">
            {isPositive ? <TrendingUp className="w-3.5 h-3.5 text-success" /> : <TrendingDown className="w-3.5 h-3.5 text-error" />}
            <span className={cn("text-xs font-semibold tabular-nums", isPositive ? "text-success" : "text-error")}>
              {isPositive ? "+" : ""}{change}%
            </span>
            <span className="text-xs text-text-muted">{changeLabel || "vs yesterday"}</span>
          </div>
        )}
      </div>
    </div>
  );
}
