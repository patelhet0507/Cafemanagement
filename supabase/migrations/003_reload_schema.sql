-- Fix PostgREST schema cache after 001/002
-- Run if you see: "Could not find the table 'public.menu_items' in the schema cache"
NOTIFY pgrst, 'reload schema';
-- Verify tables exist
SELECT table_name FROM information_schema.tables WHERE table_schema='public' AND table_name IN ('menu_items','tables','raw_materials','recipes','orders','order_items');
