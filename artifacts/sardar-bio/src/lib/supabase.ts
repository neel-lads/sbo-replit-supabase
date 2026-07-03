import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://pelqbtytbnxriifwyjfu.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBlbHFidHl0Ym54cmlpZnd5amZ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODMwNjQzNzYsImV4cCI6MjA5ODY0MDM3Nn0.n3DuGfAjZO8GaNujO3bGaBbxRyYP3aSYHezlKsMCJRI";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);