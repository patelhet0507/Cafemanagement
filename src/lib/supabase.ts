import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || supabaseUrl.includes("your-project-url")) {
  console.warn("Missing NEXT_PUBLIC_SUPABASE_URL — set it in .env.local");
}
if (!supabaseAnonKey || supabaseAnonKey.includes("your-anon-key")) {
  console.warn("Missing NEXT_PUBLIC_SUPABASE_ANON_KEY — set it in .env.local");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
