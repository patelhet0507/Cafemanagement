-- Enable RLS + anon policies (single-cafe, no auth yet) + realtime
-- Run this after 001_initial_schema.sql

-- RLS
ALTER TABLE tables ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE raw_materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE wastage_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchase_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname='anon all' AND tablename='tables') THEN
    CREATE POLICY "anon all" ON tables FOR ALL TO anon USING (true) WITH CHECK (true);
  END IF;
END $$;
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname='anon all' AND tablename='menu_items') THEN CREATE POLICY "anon all" ON menu_items FOR ALL TO anon USING (true) WITH CHECK (true); END IF; END $$;
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname='anon all' AND tablename='raw_materials') THEN CREATE POLICY "anon all" ON raw_materials FOR ALL TO anon USING (true) WITH CHECK (true); END IF; END $$;
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname='anon all' AND tablename='recipes') THEN CREATE POLICY "anon all" ON recipes FOR ALL TO anon USING (true) WITH CHECK (true); END IF; END $$;
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname='anon all' AND tablename='customers') THEN CREATE POLICY "anon all" ON customers FOR ALL TO anon USING (true) WITH CHECK (true); END IF; END $$;
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname='anon all' AND tablename='orders') THEN CREATE POLICY "anon all" ON orders FOR ALL TO anon USING (true) WITH CHECK (true); END IF; END $$;
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname='anon all' AND tablename='order_items') THEN CREATE POLICY "anon all" ON order_items FOR ALL TO anon USING (true) WITH CHECK (true); END IF; END $$;
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname='anon all' AND tablename='wastage_logs') THEN CREATE POLICY "anon all" ON wastage_logs FOR ALL TO anon USING (true) WITH CHECK (true); END IF; END $$;
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname='anon all' AND tablename='purchase_entries') THEN CREATE POLICY "anon all" ON purchase_entries FOR ALL TO anon USING (true) WITH CHECK (true); END IF; END $$;
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname='anon all' AND tablename='audit_log') THEN CREATE POLICY "anon all" ON audit_log FOR ALL TO anon USING (true) WITH CHECK (true); END IF; END $$;

-- Realtime (for kitchen/POS live)
ALTER PUBLICATION supabase_realtime ADD TABLE orders;
ALTER PUBLICATION supabase_realtime ADD TABLE order_items;
ALTER PUBLICATION supabase_realtime ADD TABLE tables;
