"use client";

import { Search, Bell, HelpCircle, LogOut } from "lucide-react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/components/auth/auth-provider";

const titles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/dashboard/orders": "Orders",
  "/dashboard/menu": "Menu",
  "/dashboard/inventory": "Inventory",
  "/dashboard/purchases": "Purchases",
  "/dashboard/wastage": "Wastage",
  "/dashboard/recipes": "Recipes",
  "/dashboard/customers": "Customers",
  "/dashboard/variance": "Variance",
  "/pos": "Tables",
  "/kitchen": "Kitchen",
};

export function Topbar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const title = titles[pathname] ?? (pathname.startsWith("/pos") ? "Tables" : pathname.startsWith("/kitchen") ? "Kitchen" : "Dashboard");
  return (
    <header className="sticky top-0 z-30 flex items-center h-16 px-6 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="flex items-center gap-3 flex-1">
        <h1 className="text-lg font-semibold tracking-tight">{title}</h1>
      </div>

      <div className="flex items-center gap-2">
        {/* Search */}
        <button className="flex items-center gap-2 h-9 px-3 rounded-lg border border-border bg-surface text-sm text-text-muted hover:border-accent/30 transition-colors">
          <Search className="w-4 h-4" />
          <span className="hidden sm:inline">Search</span>
          <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono bg-surface-hover text-text-muted border border-border">
            ⌘K
          </kbd>
        </button>

        {/* Live status */}
        <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-success-bg text-success-text text-xs font-medium">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-success" />
          </span>
          Online
        </div>

        {/* Notifications */}
        <button className="relative flex items-center justify-center w-9 h-9 rounded-lg hover:bg-surface-hover transition-colors">
          <Bell className="w-[18px] h-[18px] text-text-secondary" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-error" />
        </button>

        {/* Help */}
        <button className="hidden sm:flex items-center justify-center w-9 h-9 rounded-lg hover:bg-surface-hover transition-colors">
          <HelpCircle className="w-[18px] h-[18px] text-text-secondary" />
        </button>

        {/* User */}
        <div className="flex items-center gap-2 pl-2 ml-1 border-l border-border">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-accent/10 text-accent text-sm font-semibold">
            {(user?.name?.[0] ?? "H").toUpperCase()}
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-medium leading-tight">{user?.name ?? "Het"}</p>
            <p className="text-[11px] text-text-muted leading-tight capitalize">{user?.role ?? "Owner"}</p>
          </div>
          <button onClick={logout} className="hidden sm:flex ml-1 w-8 h-8 rounded-lg hover:bg-surface-hover items-center justify-center text-text-muted hover:text-text-primary" title="Logout">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
