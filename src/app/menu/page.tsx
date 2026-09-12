"use client";

import { useState, useMemo, Suspense, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { AnimatePresence } from "framer-motion";
import { Coffee, ChevronRight, Bike } from "lucide-react";
import { mockMenuItems } from "@/lib/mock-data";
import { MenuCard } from "@/components/menu/menu-card";
import { CartBar } from "@/components/menu/cart-bar";
import { CartSheet, type CartItem } from "@/components/menu/cart-sheet";
import { OrderConfirmation } from "@/components/menu/order-confirmation";
import { mockSendWhatsApp, getOrderConfirmationMessage } from "@/lib/mock-services";
import { useSupabaseTable, placeSupabaseOrder, addItemsToOrder } from "@/lib/supabase-helpers";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { useToast } from "@/components/shared/toaster";
import type { MenuItem } from "@/types/database";

const STORE_KEY = "cafeflow_customer_state";
type Stored = { orderId: string; shortId: string; tableNumber: number; orderType: "dine_in" | "takeout"; total: number; status: string; notif: boolean };

function MenuContent() {
  const searchParams = useSearchParams();
  const urlTable = parseInt(searchParams.get("table") || "1");
  const [tableNumber, setTableNumber] = useState(urlTable);
  useEffect(() => setTableNumber(urlTable), [urlTable]);
  const [orderType, setOrderType] = useState<"dine_in" | "takeout">("dine_in");
  const [activeCategory, setActiveCategory] = useState("Recommended");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderTotal, setOrderTotal] = useState(0);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [liveStatus, setLiveStatus] = useState<string | null>(null);
  const prevRef = useRef<string | null>(null);
  const [notifOn, setNotifOn] = useState(false);
  const [placing, setPlacing] = useState(false);
  const [occupiedErr, setOccupiedErr] = useState<string | null>(null);
  const [addMoreMode, setAddMoreMode] = useState(false);
  const toast = useToast();

  const { data: liveItems, loading: menuLoading } = useSupabaseTable<MenuItem>("menu_items", mockMenuItems, (q) => q.eq("is_available", true).order("category", { ascending: true }));
  const menuItems = liveItems.length ? liveItems : mockMenuItems;
  const categories = useMemo(() => {
    const cats = Array.from(new Set(menuItems.map((m) => m.category)));
    return ["Recommended", ...cats];
  }, [menuItems]);
  const filteredItems = useMemo(() => {
    if (activeCategory === "Recommended") return menuItems.slice(0, 6);
    return menuItems.filter((item) => item.category === activeCategory);
  }, [menuItems, activeCategory]);

  useEffect(() => {
    const raw = localStorage.getItem(STORE_KEY);
    if (raw) {
      try {
        const s: Stored = JSON.parse(raw);
        if (s.orderId && s.tableNumber === tableNumber) {
          setOrderId(s.orderId); setOrderTotal(s.total); setLiveStatus(s.status); setOrderType(s.orderType); setNotifOn(!!s.notif);
          setOrderPlaced(true);
        }
      } catch {}
    }
    const n = localStorage.getItem("cafeflow_notif");
    if (n === "1") setNotifOn(true);
  }, [tableNumber]);

  useEffect(() => {
    if (orderPlaced && orderId) {
      const toSave: Stored = { orderId, shortId: orderId.slice(0, 4).toUpperCase(), tableNumber, orderType, total: orderTotal, status: liveStatus || "pending", notif: notifOn };
      localStorage.setItem(STORE_KEY, JSON.stringify(toSave));
    }
  }, [orderPlaced, orderId, tableNumber, orderType, orderTotal, liveStatus, notifOn]);

  useEffect(() => {
    if (!orderId) return;
    if (!isSupabaseConfigured && orderId.startsWith("mock_")) {
      const t = setTimeout(() => {
        setLiveStatus("ready");
        if (notifOn && Notification.permission === "granted") {
          new Notification(`Order ready — ${orderType === "takeout" ? "Takeout" : `Table ${String(tableNumber).padStart(2, "0")}`}`, { body: `Order #${orderId.slice(0, 6).toUpperCase()} ready — collect at counter` });
          navigator.vibrate?.([200, 100, 200]);
        }
      }, 12000);
      return () => clearTimeout(t);
    }
    if (!isSupabaseConfigured) return;
    const ch = supabase.channel(`customer-${orderId}`).on("postgres_changes", { event: "UPDATE", schema: "public", table: "orders", filter: `id=eq.${orderId}` }, (payload) => {
      const ns = (payload.new as { status: string }).status;
      setLiveStatus(ns);
    }).subscribe();
    supabase.from("orders").select("status").eq("id", orderId).single().then(({ data }) => {
      if (data) setLiveStatus((data as { status: string }).status);
    });
    return () => { supabase.removeChannel(ch); };
  }, [orderId]);

  useEffect(() => {
    if (!orderId || !liveStatus) return;
    localStorage.setItem(STORE_KEY, JSON.stringify({ orderId, shortId: orderId.slice(0, 4).toUpperCase(), tableNumber, orderType, total: orderTotal, status: liveStatus, notif: notifOn }));
    if (liveStatus === "ready" && prevRef.current !== "ready") {
      toast(`Order #${orderId.slice(0, 4).toUpperCase()} is ready — ${orderType === "takeout" ? "collect at counter" : `Table ${String(tableNumber).padStart(2, "0")} ready`}`, "success");
      try { new Audio("/ding.mp3").play().catch(() => {}); } catch {}
      navigator.vibrate?.([200, 100, 200]);
      if (notifOn && Notification.permission === "granted") {
        new Notification(`Order ready — ${orderType === "takeout" ? "Takeout" : `Table ${String(tableNumber).padStart(2, "0")}`}`, { body: `Order #${orderId.slice(0, 4).toUpperCase()} ready — collect at counter`, icon: "/favicon.ico" });
      } else if (notifOn && Notification.permission !== "denied") {
        Notification.requestPermission().then((p) => { if (p === "granted") new Notification(`Order ready!`); });
      }
    }
    prevRef.current = liveStatus;
  }, [liveStatus, orderId, tableNumber, orderType, orderTotal, notifOn]);

  useEffect(() => {
    if (orderType === "takeout" || !isSupabaseConfigured) { setOccupiedErr(null); return; }
    supabase.from("tables").select("status").eq("number", tableNumber).maybeSingle().then(({ data }) => {
      const st = (data as { status: string } | null)?.status;
      if (st === "occupied" && !orderId) setOccupiedErr(`Table ${String(tableNumber).padStart(2, "0")} is occupied — choose another table or ask staff.`);
      else setOccupiedErr(null);
    });
  }, [tableNumber, orderType, orderId]);

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

  const updateNote = (itemId: string, note: string) => {
    setCart((prev) => prev.map((ci) => ci.item.id === itemId ? { ...ci, note } : ci) as CartItem[]);
  };

  const placeOrder = async (total: number, method: "upi" | "counter" = "counter") => {
    if (isSupabaseConfigured && menuItems.length === 0) { alert("Menu not seeded — add items in Dashboard → Menu"); return; }
    if (orderType === "dine_in" && occupiedErr) { alert(occupiedErr); return; }
    setPlacing(true);
    try {
      let tableId: string | null = null;
      if (orderType === "dine_in") {
        try {
          const { data: t } = await supabase.from("tables").select("id").eq("number", tableNumber).maybeSingle();
          if (t) tableId = (t as { id: string }).id;
        } catch {}
      }
      if (orderId && addMoreMode) {
        const addTotal = total;
        await addItemsToOrder(orderId, cart.map((c) => ({ id: c.item.id, price: c.item.price, quantity: c.quantity, note: (c as unknown as { note?: string }).note })), addTotal);
        const newTotal = orderTotal + addTotal;
        setOrderTotal(newTotal);
        setCart([]); setCartOpen(false); setAddMoreMode(false);
        const raw = localStorage.getItem(STORE_KEY);
        if (raw) { const s = JSON.parse(raw); s.total = newTotal; localStorage.setItem(STORE_KEY, JSON.stringify(s)); }
        mockSendWhatsApp("", getOrderConfirmationMessage(tableNumber, addTotal) + " (Added to order)");
        return;
      }
      const res = await (async () => {
        if (isSupabaseConfigured) {
          return await placeSupabaseOrder({
            tableId: orderType === "takeout" ? null : tableId,
            customerPhone: null,
            items: cart.map((c) => ({ id: c.item.id, price: c.item.price, quantity: c.quantity, note: (c as unknown as { note?: string }).note })),
            total,
            paymentMethod: method === "upi" ? "upi" : null,
            paymentStatus: method === "upi" ? "paid" : "unpaid",
            orderType,
          });
        }
        return { id: `mock_${Date.now()}`, mocked: true as const };
      })();
      const nid = (res as { id: string }).id;
      setOrderId(nid); setLiveStatus(method === "upi" ? "paid" : "pending");
      mockSendWhatsApp("", getOrderConfirmationMessage(tableNumber, total) + (method === "upi" ? " (Paid via UPI)" : " (Pay at counter)") + (orderType === "takeout" ? " — Takeout, collect at counter" : ""));
      setOrderTotal(total);
      setCartOpen(false);
      setOrderPlaced(true);
      setCart([]);
      if (orderType === "dine_in" && isSupabaseConfigured && tableId) {
        await supabase.from("tables").update({ status: "occupied" } as never).eq("id", tableId);
      }
    } catch (e) {
      console.error(e);
      const msg = (e as { message?: string })?.message ?? (e instanceof Error ? e.message : String(e));
      alert("Order failed: " + msg);
    } finally {
      setPlacing(false);
    }
  };

  const handleNotifToggle = async () => {
    if (!notifOn) {
      const perm = await Notification.requestPermission();
      if (perm !== "granted") { alert("Enable notifications in browser settings"); return; }
      setNotifOn(true); localStorage.setItem("cafeflow_notif", "1");
    } else {
      setNotifOn(false); localStorage.setItem("cafeflow_notif", "0");
    }
  };

  if (orderPlaced && orderId) {
    return (
      <OrderConfirmation
        tableNumber={tableNumber}
        total={orderTotal}
        onBack={() => { setOrderPlaced(false); setAddMoreMode(false); }}
        liveStatus={liveStatus}
        orderId={orderId}
        orderType={orderType}
        notifOn={notifOn}
        onNotifToggle={handleNotifToggle}
        onAddMore={() => { setAddMoreMode(true); setOrderPlaced(false); }}
      />
    );
  }

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
          <div className="flex items-center gap-2">
            <div className="flex rounded-full border border-border overflow-hidden text-xs">
              <button onClick={() => setOrderType("dine_in")} className={`px-3 py-1.5 font-medium ${orderType === "dine_in" ? "bg-primary text-white" : "bg-surface hover:bg-surface-hover"}`}>Dine-in</button>
              <button onClick={() => setOrderType("takeout")} className={`px-3 py-1.5 font-medium flex items-center gap-1 ${orderType === "takeout" ? "bg-primary text-white" : "bg-surface hover:bg-surface-hover"}`}><Bike className="w-3 h-3" /> Takeout</button>
            </div>
            <span className="text-xs font-medium px-3 py-1.5 rounded-full bg-accent/10 text-accent">
              {orderType === "takeout" ? "Takeout" : `Table ${String(tableNumber).padStart(2, "0")}`}
            </span>
          </div>
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
        {orderType === "takeout" && <div className="max-w-2xl mx-auto px-4 pb-2 text-[11px] text-text-muted text-center">Takeout — collect at the counter</div>}
        {occupiedErr && <div className="max-w-2xl mx-auto px-4 pb-3"><div className="px-3 py-2 rounded-xl bg-error-bg border border-error/20 text-error-text text-xs text-center">{occupiedErr}</div></div>}
      </header>

      <main className="max-w-2xl mx-auto px-4 py-4 pb-24">
        {menuLoading ? <p className="text-sm text-text-muted text-center py-8">Loading menu…</p> : null}
        {!menuLoading && menuItems.length === 0 && <p className="text-sm text-text-muted text-center py-12">No menu items — add items in Dashboard → Menu (Supabase live).</p>}
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

      <CartSheet open={cartOpen} onClose={() => setCartOpen(false)} items={cart} onUpdateQuantity={updateQuantity} onPlaceOrder={placeOrder} onUpdateNote={updateNote} />
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
