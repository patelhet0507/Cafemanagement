"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  ShoppingBag,
  Grid3X3,
  ChefHat,
  UtensilsCrossed,
  BookOpen,
  Package,
  ShoppingCart,
  Trash2,
  Users,
  BarChart3,
  UserCog,
  Settings,
  Coffee,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/components/auth/auth-provider";
import { LogOut } from "lucide-react";

const navSections = [
  {
    label: "Overview",
    items: [
      { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
      { href: "/dashboard/orders", label: "Orders", icon: ShoppingBag },
      { href: "/pos", label: "Tables", icon: Grid3X3 },
      { href: "/kitchen", label: "Kitchen", icon: ChefHat },
    ],
  },
  {
    label: "Operations",
    items: [
      { href: "/dashboard/menu", label: "Menu", icon: UtensilsCrossed },
      { href: "/dashboard/recipes", label: "Recipes", icon: BookOpen },
    ],
  },
  {
    label: "Inventory",
    items: [
      { href: "/dashboard/inventory", label: "Stock", icon: Package },
      { href: "/dashboard/purchases", label: "Purchases", icon: ShoppingCart },
      { href: "/dashboard/wastage", label: "Wastage", icon: Trash2 },
    ],
  },
  {
    label: "Business",
    items: [
      { href: "/dashboard/customers", label: "Customers", icon: Users },
      { href: "/dashboard/variance", label: "Reports", icon: BarChart3 },
      { href: "/dashboard/customers", label: "Staff", icon: UserCog, soon: true },
      { href: "/dashboard/inventory", label: "Settings", icon: Settings, soon: true },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "hidden lg:flex flex-col h-screen bg-surface border-r border-border sticky top-0 transition-all duration-300",
        collapsed ? "w-[68px]" : "w-[260px]"
      )}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 h-16 border-b border-border shrink-0">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-accent text-white shrink-0">
          <Coffee className="w-4 h-4" />
        </div>
        {!collapsed && (
          <span className="font-semibold text-lg tracking-tight">CafeFlow</span>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3">
        {navSections.map((section) => (
          <div key={section.label} className="mb-6">
            {!collapsed && (
              <p className="px-3 mb-2 text-[11px] font-semibold uppercase tracking-wider text-text-muted">
                {section.label}
              </p>
            )}
            <ul className="space-y-0.5">
              {section.items.map((item) => {
                const anySoon = (item as { soon?: boolean }).soon;
                const isActive = !anySoon && (pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href)));
                return (
                  <li key={item.href + item.label}>
                    <Link
                      href={item.href}
                      aria-disabled={anySoon ? "true" : undefined}
                      onClick={(e) => { if (anySoon) e.preventDefault(); }}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                        isActive
                          ? "bg-accent/10 text-accent border-l-2 border-accent"
                          : "text-text-secondary hover:bg-surface-hover hover:text-text-primary",
                        anySoon && "opacity-50 pointer-events-none"
                      )}
                      title={collapsed ? item.label + (anySoon ? " · Soon" : "") : undefined}
                    >
                      <item.icon className="w-[18px] h-[18px] shrink-0" />
                      {!collapsed && <span className="flex items-center gap-2">{item.label}{anySoon && <span className="text-[9px] px-1 py-0.5 rounded bg-surface-hover border border-border font-semibold tracking-widest">SOON</span>}</span>}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* User + logout */}
      {!collapsed && user && (
        <div className="px-3 py-3 border-t border-border flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-accent/10 text-accent flex items-center justify-center text-xs font-bold">{user.name[0]}</div>
          <div className="flex-1 min-w-0"><p className="text-sm font-medium truncate">{user.name}</p><p className="text-[11px] text-text-muted capitalize">{user.role}</p></div>
          <button onClick={logout} className="w-8 h-8 rounded-lg hover:bg-surface-hover flex items-center justify-center text-text-muted"><LogOut className="w-4 h-4" /></button>
        </div>
      )}
      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="flex items-center justify-center h-12 border-t border-border text-text-muted hover:text-text-primary hover:bg-surface-hover transition-colors"
      >
        {collapsed ? (
          <ChevronRight className="w-4 h-4" />
        ) : (
          <ChevronLeft className="w-4 h-4" />
        )}
      </button>
    </aside>
  );
}
