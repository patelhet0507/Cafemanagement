-- Takeout vs Dine-in + notes via order_items.modifiers JSONB (no schema change for notes)
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname='order_type') THEN
    CREATE TYPE order_type AS ENUM ('dine_in','takeout');
  END IF;
END $$;

ALTER TABLE orders ADD COLUMN IF NOT EXISTS order_type order_type DEFAULT 'dine_in';
-- allow takeout without table
ALTER TABLE orders ALTER COLUMN table_id DROP NOT NULL;

-- ensure realtime still includes orders
DO $$ BEGIN
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE orders;
  EXCEPTION WHEN duplicate_object THEN NULL;
  END;
END $$;

NOTIFY pgrst, 'reload schema';
