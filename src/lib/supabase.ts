import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export const isSupabaseConfigured =
  !!supabaseUrl &&
  !!supabaseAnonKey &&
  !supabaseUrl.includes("your-project") &&
  !supabaseAnonKey.includes("your-anon") &&
  !supabaseAnonKey.includes("REPLACE_ME") &&
  supabaseUrl.startsWith("https://");

if (!isSupabaseConfigured && typeof window !== "undefined") {
  console.warn("Supabase not configured — falling back to mock data. Set NEXT_PUBLIC_SUPABASE_URL/ANON_KEY in .env.local");
}

// createClient requires non-empty strings; use dummy when unconfigured (calls will fail but won't crash on import)
export const supabase = createClient(
  isSupabaseConfigured ? supabaseUrl : "https://placeholder.supabase.co",
  isSupabaseConfigured ? supabaseAnonKey : "placeholder-anon-key"
);
