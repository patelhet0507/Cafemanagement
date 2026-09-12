import type { CafeTable, MenuItem, RawMaterial, Recipe, Order, Customer } from "@/types/database";

export const mockTables: CafeTable[] = [
  { id: "t1", number: 1, name: "Table 1", status: "available", capacity: 4 },
  { id: "t2", number: 2, name: "Table 2", status: "occupied", capacity: 2 },
  { id: "t3", number: 3, name: "Table 3", status: "available", capacity: 6 },
  { id: "t4", number: 4, name: "Table 4", status: "occupied", capacity: 4 },
  { id: "t5", number: 5, name: "Table 5", status: "available", capacity: 2 },
  { id: "t6", number: 6, name: "Table 6", status: "occupied", capacity: 4 },
  { id: "t7", number: 7, name: "Table 7", status: "available", capacity: 8 },
  { id: "t8", number: 8, name: "Table 8", status: "reserved", capacity: 4 },
  { id: "t9", number: 9, name: "Table 9", status: "available", capacity: 2 },
  { id: "t10", number: 10, name: "Table 10", status: "available", capacity: 4 },
  { id: "t11", number: 11, name: "Table 11", status: "available", capacity: 6 },
  { id: "t12", number: 12, name: "Table 12", status: "available", capacity: 4 },
];

export const mockMenuCategories = ["Recommended","Hot Coffee","Cold Coffee","Chai & Tea","Fresh Drinks","Snacks","Desserts"];

export const mockMenuItems: MenuItem[] = [
  { id: "m1", name: "Cappuccino", description: "Classic Italian espresso with steamed milk foam", price: 180, category: "Hot Coffee", image_url: "", is_available: true, prep_time_min: 5 },
  { id: "m2", name: "Cafe Latte", description: "Smooth espresso with creamy steamed milk", price: 190, category: "Hot Coffee", image_url: "", is_available: true, prep_time_min: 5 },
  { id: "m3", name: "Espresso", description: "Bold single shot of premium espresso", price: 120, category: "Hot Coffee", image_url: "", is_available: true, prep_time_min: 3 },
  { id: "m4", name: "Americano", description: "Espresso diluted with hot water", price: 140, category: "Hot Coffee", image_url: "", is_available: true, prep_time_min: 4 },
  { id: "m5", name: "Flat White", description: "Velvety microfoam over double ristretto", price: 200, category: "Hot Coffee", image_url: "", is_available: true, prep_time_min: 5 },
  { id: "m6", name: "Filter Coffee", description: "South Indian filter coffee", price: 90, category: "Hot Coffee", image_url: "", is_available: true, prep_time_min: 6 },
  { id: "m7", name: "Iced Latte", description: "Chilled espresso over cold milk and ice", price: 200, category: "Cold Coffee", image_url: "", is_available: true, prep_time_min: 4 },
  { id: "m8", name: "Cold Coffee", description: "Classic blended cold coffee with ice cream", price: 180, category: "Cold Coffee", image_url: "", is_available: true, prep_time_min: 5 },
  { id: "m9", name: "Mocha Frappe", description: "Chocolate, espresso and milk blended with ice", price: 220, category: "Cold Coffee", image_url: "", is_available: true, prep_time_min: 6 },
  { id: "m10", name: "Iced Americano", description: "Espresso over ice, bold and refreshing", price: 160, category: "Cold Coffee", image_url: "", is_available: true, prep_time_min: 3 },
  { id: "m11", name: "Cold Brew", description: "24-hour cold-steeped, smooth and less acidic", price: 240, category: "Cold Coffee", image_url: "", is_available: true, prep_time_min: 3 },
  { id: "m12", name: "Masala Chai", description: "Traditional spiced Indian tea with cardamom", price: 80, category: "Chai & Tea", image_url: "", is_available: true, prep_time_min: 6 },
  { id: "m13", name: "Green Tea", description: "Light and refreshing Japanese green tea", price: 100, category: "Chai & Tea", image_url: "", is_available: true, prep_time_min: 4 },
  { id: "m14", name: "Ginger Lemon Tea", description: "Fresh ginger and lemon in hot water", price: 90, category: "Chai & Tea", image_url: "", is_available: true, prep_time_min: 5 },
  { id: "m15", name: "Orange Juice", description: "Freshly squeezed orange juice", price: 120, category: "Fresh Drinks", image_url: "", is_available: true, prep_time_min: 3 },
  { id: "m16", name: "Lime Soda", description: "Refreshing lime with soda", price: 80, category: "Fresh Drinks", image_url: "", is_available: true, prep_time_min: 3 },
  { id: "m17", name: "Mango Lassi", description: "Creamy yogurt blended with Alphonso mango", price: 140, category: "Fresh Drinks", image_url: "", is_available: true, prep_time_min: 4 },
  { id: "m18", name: "Veg Sandwich", description: "Grilled sandwich with fresh vegetables", price: 140, category: "Snacks", image_url: "", is_available: true, prep_time_min: 8 },
  { id: "m19", name: "Cheese Toast", description: "Golden crispy toast with melted cheese", price: 120, category: "Snacks", image_url: "", is_available: true, prep_time_min: 6 },
  { id: "m20", name: "French Fries", description: "Crispy golden fries with seasoning", price: 130, category: "Snacks", image_url: "", is_available: true, prep_time_min: 7 },
  { id: "m21", name: "Chocolate Brownie", description: "Rich dark chocolate brownie with nuts", price: 180, category: "Desserts", image_url: "", is_available: true, prep_time_min: 3 },
  { id: "m22", name: "Cheesecake", description: "New York style creamy cheesecake", price: 250, category: "Desserts", image_url: "", is_available: true, prep_time_min: 2 },
];

export const mockRawMaterials: RawMaterial[] = [
  { id: "rm1", name: "Milk", unit: "ml", current_stock: 12400, low_stock_threshold: 15000, cost_per_unit: 0.06 },
  { id: "rm2", name: "Coffee Beans", unit: "grams", current_stock: 4200, low_stock_threshold: 2000, cost_per_unit: 0.5 },
  { id: "rm3", name: "Sugar", unit: "grams", current_stock: 18000, low_stock_threshold: 5000, cost_per_unit: 0.02 },
  { id: "rm4", name: "Tea Leaves", unit: "grams", current_stock: 2500, low_stock_threshold: 1000, cost_per_unit: 0.8 },
  { id: "rm5", name: "Paper Cups (Hot)", unit: "pieces", current_stock: 180, low_stock_threshold: 100, cost_per_unit: 3 },
  { id: "rm6", name: "Plastic Cups (Cold)", unit: "pieces", current_stock: 220, low_stock_threshold: 100, cost_per_unit: 4 },
  { id: "rm7", name: "Ice", unit: "grams", current_stock: 8000, low_stock_threshold: 5000, cost_per_unit: 0.03 },
  { id: "rm8", name: "Orange Juice Concentrate", unit: "ml", current_stock: 3000, low_stock_threshold: 2000, cost_per_unit: 0.15 },
  { id: "rm9", name: "Bread Slices", unit: "pieces", current_stock: 48, low_stock_threshold: 20, cost_per_unit: 5 },
  { id: "rm10", name: "Cheese", unit: "grams", current_stock: 1200, low_stock_threshold: 500, cost_per_unit: 0.4 },
  { id: "rm11", name: "Oat Milk", unit: "ml", current_stock: 2000, low_stock_threshold: 1000, cost_per_unit: 0.12 },
  { id: "rm12", name: "Vanilla Syrup", unit: "ml", current_stock: 800, low_stock_threshold: 300, cost_per_unit: 0.2 },
  { id: "rm13", name: "Chocolate Syrup", unit: "ml", current_stock: 600, low_stock_threshold: 300, cost_per_unit: 0.25 },
  { id: "rm14", name: "Ginger", unit: "grams", current_stock: 400, low_stock_threshold: 200, cost_per_unit: 0.3 },
  { id: "rm15", name: "Lemon", unit: "pieces", current_stock: 24, low_stock_threshold: 10, cost_per_unit: 8 },
  { id: "rm16", name: "Whipped Cream", unit: "grams", current_stock: 500, low_stock_threshold: 200, cost_per_unit: 0.5 },
];

export const mockRecipes: Recipe[] = [
  { id: "r1", menu_item_id: "m1", raw_material_id: "rm1", quantity: 150 },
  { id: "r2", menu_item_id: "m1", raw_material_id: "rm2", quantity: 18 },
  { id: "r3", menu_item_id: "m1", raw_material_id: "rm3", quantity: 5 },
  { id: "r4", menu_item_id: "m1", raw_material_id: "rm5", quantity: 1 },
  { id: "r5", menu_item_id: "m2", raw_material_id: "rm1", quantity: 200 },
  { id: "r6", menu_item_id: "m2", raw_material_id: "rm2", quantity: 18 },
  { id: "r7", menu_item_id: "m2", raw_material_id: "rm3", quantity: 5 },
  { id: "r8", menu_item_id: "m2", raw_material_id: "rm5", quantity: 1 },
  { id: "r9", menu_item_id: "m3", raw_material_id: "rm2", quantity: 18 },
  { id: "r10", menu_item_id: "m3", raw_material_id: "rm5", quantity: 1 },
  { id: "r11", menu_item_id: "m12", raw_material_id: "rm1", quantity: 200 },
  { id: "r12", menu_item_id: "m12", raw_material_id: "rm4", quantity: 5 },
  { id: "r13", menu_item_id: "m12", raw_material_id: "rm3", quantity: 8 },
  { id: "r14", menu_item_id: "m12", raw_material_id: "rm5", quantity: 1 },
  { id: "r15", menu_item_id: "m8", raw_material_id: "rm1", quantity: 100 },
  { id: "r16", menu_item_id: "m8", raw_material_id: "rm2", quantity: 15 },
  { id: "r17", menu_item_id: "m8", raw_material_id: "rm3", quantity: 10 },
  { id: "r18", menu_item_id: "m8", raw_material_id: "rm7", quantity: 200 },
  { id: "r19", menu_item_id: "m8", raw_material_id: "rm6", quantity: 1 },
];

export const mockOrders: Order[] = [
  { id: "o1", table_id: "t2", customer_id: "c1", status: "preparing", total: 450, payment_method: null, payment_status: "unpaid", order_type: "dine_in", created_at: new Date(Date.now() - 18 * 60000).toISOString() },
  { id: "o2", table_id: "t4", customer_id: "c2", status: "confirmed", total: 360, payment_method: null, payment_status: "unpaid", order_type: "dine_in", created_at: new Date(Date.now() - 12 * 60000).toISOString() },
  { id: "o3", table_id: "t6", customer_id: "c3", status: "pending", total: 620, payment_method: null, payment_status: "unpaid", order_type: "dine_in", created_at: new Date(Date.now() - 5 * 60000).toISOString() },
];

export const mockCustomers: Customer[] = [
  { id: "c1", phone: "9876543210", name: "Priya Sharma", visit_count: 12, last_visit: new Date().toISOString() },
  { id: "c2", phone: "9876543211", name: "Rahul Patel", visit_count: 5, last_visit: new Date().toISOString() },
  { id: "c3", phone: "9876543212", name: "Ananya Singh", visit_count: 8, last_visit: new Date().toISOString() },
  { id: "c4", phone: "9876543213", name: "Vikram Desai", visit_count: 23, last_visit: new Date(Date.now() - 86400000).toISOString() },
  { id: "c5", phone: "9876543214", name: "Neha Gupta", visit_count: 15, last_visit: new Date(Date.now() - 86400000).toISOString() },
];

export const mockDashboardStats = {
  todaysSales: 28450, todaysOrders: 47, avgOrderValue: 605,
  activeTables: 3, unpaidBills: 2340, lowStockItems: 2,
  salesChange: 18.4, ordersChange: 12, avgChange: 5.1,
};

export const mockRecentOrders = [
  { id: "o1042", table: 4, items: "2x Cold Coffee, 1x Sandwich", amount: 450, status: "preparing" as const, time: "18:42" },
  { id: "o1041", table: 2, items: "1x Cappuccino, 1x Brownie", amount: 360, status: "confirmed" as const, time: "18:35" },
  { id: "o1040", table: 6, items: "2x Masala Chai, 2x Cheese Toast", amount: 620, status: "pending" as const, time: "18:28" },
  { id: "o1039", table: 1, items: "1x Latte, 1x French Fries", amount: 320, status: "paid" as const, time: "18:15" },
  { id: "o1038", table: 9, items: "1x Espresso", amount: 120, status: "paid" as const, time: "18:02" },
];

export const mockRevenueData = [
  { day: "Mon", revenue: 18500 }, { day: "Tue", revenue: 22300 },
  { day: "Wed", revenue: 19800 }, { day: "Thu", revenue: 24100 },
  { day: "Fri", revenue: 28450 }, { day: "Sat", revenue: 32000 },
  { day: "Sun", revenue: 28450 },
];

export const mockCategoryData = [
  { name: "Hot Coffee", value: 35, color: "#D97706" },
  { name: "Cold Coffee", value: 28, color: "#3B82F6" },
  { name: "Chai & Tea", value: 12, color: "#22C55E" },
  { name: "Snacks", value: 15, color: "#F97316" },
  { name: "Desserts", value: 10, color: "#A855F7" },
];