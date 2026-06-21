import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

console.log("ENV CHECK:", { supabaseUrl, supabaseAnonKey });

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase ENV");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);