-- UPI QR settings for Pay Now
CREATE TABLE IF NOT EXISTS app_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
-- allow anon for now (single cafe)
ALTER TABLE app_settings ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname='anon all' AND tablename='app_settings') THEN CREATE POLICY "anon all" ON app_settings FOR ALL TO anon USING (true) WITH CHECK (true); END IF; END $$;
NOTIFY pgrst, 'reload schema';
