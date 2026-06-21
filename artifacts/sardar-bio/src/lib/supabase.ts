import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://pfdwgxzhdqtvedwiovtn.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBmZHdneHpoZHF0dmVkd2lvdnRuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE4NDg0MDgsImV4cCI6MjA5NzQyNDQwOH0.23ghiieXZlslFh01hdbv7TAuyMbXYlqjxP7wQDMcPFE";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);