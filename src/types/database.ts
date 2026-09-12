export type TableStatus = "available" | "occupied" | "reserved";
export type OrderStatus = "pending" | "confirmed" | "preparing" | "ready" | "served" | "paid" | "cancelled";
export type PaymentStatus = "unpaid" | "paid" | "refunded";
export type MaterialUnit = "ml" | "grams" | "pieces" | "liters" | "kg";
export type AuditReason = "order_deduction" | "wastage" | "purchase" | "adjustment";
export type WastageReason = "spillage" | "burnt" | "expired" | "damaged" | "preparation_error" | "other";

export interface CafeTable {
  id: string;
  number: number;
  name: string;
  status: TableStatus;
  capacity: number;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image_url: string;
  is_available: boolean;
  prep_time_min: number;
}

export interface Modifier {
  id: string;
  menu_item_id: string;
  name: string;
  price_adjustment: number;
  recipe: Record<string, number> | null;
}

export interface RawMaterial {
  id: string;
  name: string;
  unit: MaterialUnit;
  current_stock: number;
  low_stock_threshold: number;
  cost_per_unit: number;
}

export interface Recipe {
  id: string;
  menu_item_id: string;
  raw_material_id: string;
  quantity: number;
}

export interface Customer {
  id: string;
  phone: string;
  name: string;
  visit_count: number;
  last_visit: string;
}

export type OrderType = "dine_in" | "takeout";

export interface Order {
  id: string;
  table_id: string | null;
  customer_id: string | null;
  status: OrderStatus;
  total: number;
  payment_method: string | null;
  payment_status: PaymentStatus;
  order_type: OrderType;
  created_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  menu_item_id: string;
  quantity: number;
  unit_price: number;
  modifiers: Record<string, unknown> | null;
  status: OrderStatus;
}

export interface WastageLog {
  id: string;
  raw_material_id: string;
  quantity: number;
  reason: WastageReason;
  logged_by: string;
  created_at: string;
}

export interface PurchaseEntry {
  id: string;
  raw_material_id: string;
  quantity: number;
  cost: number;
  supplier: string;
  invoice_number: string | null;
  created_at: string;
}

export interface AuditLog {
  id: string;
  raw_material_id: string;
  change: number;
  reason: AuditReason;
  reference_id: string | null;
  created_at: string;
}

export interface OrderWithItems extends Order {
  table: CafeTable;
  customer: Customer | null;
  items: (OrderItem & { menu_item: MenuItem })[];
}

export interface MenuItemWithModifiers extends MenuItem {
  modifiers: Modifier[];
  recipes: (Recipe & { raw_material: RawMaterial })[];
}
