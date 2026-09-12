"use client";

import { useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { AnimatePresence } from "framer-motion";
import { Coffee, ChevronRight } from "lucide-react";
import { mockMenuItems } from "@/lib/mock-data";
import { PhoneEntryModal } from "@/components/menu/phone-entry-modal";
import { MenuCard } from "@/components/menu/menu-card";
import { CartBar } from "@/components/menu/cart-bar";
import { CartSheet, type CartItem } from "@/components/menu/cart-sheet";
import { OrderConfirmation } from "@/components/menu/order-confirmation";
import { mockSendWhatsApp, getOrderConfirmationMessage } from "@/lib/mock-services";
import { useSupabaseTable, placeSupabaseOrder } from "@/lib/supabase-helpers";
import { isSupabaseConfigured } from "@/lib/supabase";
import type { MenuItem } from "@/types/database";

function MenuContent() {
  const searchParams = useSearchParams();
  const tableNumber = parseInt(searchParams.get("table") || "1");

  const [phone, setPhone] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState("Recommended");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderTotal, setOrderTotal] = useState(0);
  const [placing, setPlacing] = useState(false);

  const { data: menuItems, loading: menuLoading } = useSupabaseTable<MenuItem>("menu_items", mockMenuItems, (q) => q.eq("is_available", true).order("category", { ascending: true }));
  const categories = useMemo(() => {
    const cats = Array.from(new Set(menuItems.map((m) => m.category)));
    return ["Recommended", ...cats];
  }, [menuItems]);

  const filteredItems = useMemo(() => {
    if (activeCategory === "Recommended") return menuItems.slice(0, 6);
    return menuItems.filter((item) => item.category === activeCategory);
  }, [menuItems, activeCategory]);

  const cartCount = cart.reduce((sum, ci) => sum + ci.quantity, 0);
  const cartTotal = cart.reduce((sum, ci) => sum + ci.item.price * ci.quantity, 0);

  const addToCart = (item: MenuItem) => {
    setCart((prev) => {
      const existing = prev.find((ci) => ci.item.id === item.id);
      if (existing) return prev.map((ci) => ci.item.id === item.id ? { ...ci, quantity: ci.quantity + 1 } : ci);
      return [...prev, { item, quantity: 1 }];
    });
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) setCart((prev) => prev.filter((ci) => ci.item.id !== itemId));
    else setCart((prev) => prev.map((ci) => ci.item.id === itemId ? { ...ci, quantity } : ci));
  };

  const placeOrder = async () => {
    const total = cartTotal + Math.round(cartTotal * 0.05);
    setPlacing(true);
    try {
      // best-effort Supabase — never block confirmation
      if (isSupabaseConfigured) {
        try {
          let tableId: string | null = null;
          try {
            const { supabase } = await import("@/lib/supabase");
            const { data: t } = await supabase.from("tables").select("id").eq("number", tableNumber).maybeSingle();
            if (t) tableId = (t as { id: string }).id;
          } catch {}
          await placeSupabaseOrder({
            tableId,
            customerPhone: phone,
            items: cart.map((c) => ({ id: c.item.id, price: c.item.price, quantity: c.quantity })),
            total,
          });
        } catch (e) {
          console.warn("Supabase place failed, falling back to mock:", e);
        }
      }
      mockSendWhatsApp(phone!, getOrderConfirmationMessage(tableNumber, total));
      setOrderTotal(total);
      setCartOpen(false);
      setOrderPlaced(true);
      setCart([]);
    } catch (e) {
      console.error(e);
      const msg = (e as { message?: string })?.message ?? (e instanceof Error ? e.message : String(e));
      alert("Order failed: " + msg);
    } finally {
      setPlacing(false);
    }
  };

  if (orderPlaced) return <OrderConfirmation tableNumber={tableNumber} total={orderTotal} onBack={() => setOrderPlaced(false)} />;
  if (!phone) return <div className="min-h-screen bg-background flex items-center justify-center"><PhoneEntryModal onSubmit={setPhone} /></div>;

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-accent text-white"><Coffee className="w-4 h-4" /></div>
            <div>
              <h1 className="text-sm font-semibold leading-tight">CafeFlow</h1>
              <p className="text-[10px] text-text-muted leading-tight">Premium Cafe</p>
            </div>
          </div>
          <span className="text-xs font-medium px-3 py-1.5 rounded-full bg-accent/10 text-accent">
            Table {String(tableNumber).padStart(2, "0")}
          </span>
        </div>
        <div className="max-w-2xl mx-auto px-4 pb-3">
          <div className="flex gap-1.5 overflow-x-auto no-scrollbar -mx-1 px-1">
            {categories.map((cat) => (
              <button key={cat} onClick={() => setActiveCategory(cat)}
                className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${activeCategory === cat ? "bg-primary text-white" : "bg-surface-hover text-text-secondary hover:bg-border"}`}>
                {cat}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-4 pb-24">
        {menuLoading ? <p className="text-sm text-text-muted text-center py-8">Loading menu…</p> : null}
        <div className="grid grid-cols-2 gap-3">
          {filteredItems.map((item) => <MenuCard key={item.id} item={item} onAdd={addToCart} />)}
        </div>
        {placing ? <p className="text-xs text-center text-text-muted mt-3">Placing order…</p> : null}
      </main>

      <AnimatePresence>
        <CartBar itemCount={cartCount} total={cartTotal} onClick={() => setCartOpen(true)} />
      </AnimatePresence>

      <div className="hidden sm:block">
        {cartCount > 0 && (
          <div className="fixed bottom-4 right-4 z-40">
            <button onClick={() => setCartOpen(true)} className="flex items-center gap-2 py-3 px-5 rounded-2xl bg-primary text-white shadow-xl hover:bg-primary-hover transition-colors">
              <span className="text-sm font-medium">{cartCount} items</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      <CartSheet open={cartOpen} onClose={() => setCartOpen(false)} items={cart} onUpdateQuantity={updateQuantity} onPlaceOrder={placeOrder} />
    </div>
  );
}

export default function MenuPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center"><Coffee className="w-8 h-8 text-accent animate-pulse" /></div>}>
      <MenuContent />
    </Suspense>
  );
}
