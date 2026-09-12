-- CafeFlow POS Database Schema
-- Supabase / PostgreSQL Migration

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TYPE table_status AS ENUM ('available', 'occupied', 'reserved');
CREATE TYPE order_status AS ENUM ('pending', 'confirmed', 'preparing', 'ready', 'served', 'paid', 'cancelled');
CREATE TYPE payment_status AS ENUM ('unpaid', 'paid', 'refunded');
CREATE TYPE material_unit AS ENUM ('ml', 'grams', 'pieces', 'liters', 'kg');
CREATE TYPE audit_reason AS ENUM ('order_deduction', 'wastage', 'purchase', 'adjustment');
CREATE TYPE wastage_reason AS ENUM ('spillage', 'burnt', 'expired', 'damaged', 'preparation_error', 'other');

CREATE TABLE tables (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  number INT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  status table_status DEFAULT 'available',
  capacity INT DEFAULT 4,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE menu_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT DEFAULT '',
  price DECIMAL(10,2) NOT NULL,
  category TEXT NOT NULL,
  image_url TEXT DEFAULT '',
  is_available BOOLEAN DEFAULT true,
  prep_time_min INT DEFAULT 5,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE modifiers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  menu_item_id UUID REFERENCES menu_items(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  price_adjustment DECIMAL(10,2) DEFAULT 0,
  recipe JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE raw_materials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  unit material_unit NOT NULL,
  current_stock DECIMAL(10,2) DEFAULT 0,
  low_stock_threshold DECIMAL(10,2) DEFAULT 0,
  cost_per_unit DECIMAL(10,4) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE recipes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  menu_item_id UUID REFERENCES menu_items(id) ON DELETE CASCADE,
  raw_material_id UUID REFERENCES raw_materials(id) ON DELETE CASCADE,
  quantity DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE customers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  phone TEXT UNIQUE NOT NULL,
  name TEXT DEFAULT '',
  visit_count INT DEFAULT 1,
  last_visit TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  table_id UUID REFERENCES tables(id) ON DELETE SET NULL,
  customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
  status order_status DEFAULT 'pending',
  total DECIMAL(10,2) DEFAULT 0,
  payment_method TEXT,
  payment_status payment_status DEFAULT 'unpaid',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  menu_item_id UUID REFERENCES menu_items(id) ON DELETE SET NULL,
  quantity INT DEFAULT 1,
  unit_price DECIMAL(10,2) NOT NULL,
  modifiers JSONB,
  status order_status DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE wastage_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  raw_material_id UUID REFERENCES raw_materials(id) ON DELETE SET NULL,
  quantity DECIMAL(10,2) NOT NULL,
  reason wastage_reason NOT NULL,
  logged_by TEXT DEFAULT '',
  notes TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE purchase_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  raw_material_id UUID REFERENCES raw_materials(id) ON DELETE SET NULL,
  quantity DECIMAL(10,2) NOT NULL,
  cost DECIMAL(10,2) DEFAULT 0,
  supplier TEXT DEFAULT '',
  invoice_number TEXT,
  notes TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE audit_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  raw_material_id UUID REFERENCES raw_materials(id) ON DELETE SET NULL,
  change DECIMAL(10,2) NOT NULL,
  reason audit_reason NOT NULL,
  reference_id UUID,
  notes TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_orders_table ON orders(table_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_customer ON orders(customer_id);
CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_recipes_menu_item ON recipes(menu_item_id);
CREATE INDEX idx_recipes_raw_material ON recipes(raw_material_id);
CREATE INDEX idx_audit_log_raw_material ON audit_log(raw_material_id);
CREATE INDEX idx_customers_phone ON customers(phone);
