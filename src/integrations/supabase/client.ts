
import { createClient } from '@supabase/supabase-js';
import type { Database } from './schema';

const SUPABASE_URL = "https://vridpeoniowzcszrhyxf.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZyaWRwZW9uaW93emNzenJoeXhmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM4OTU2MTIsImV4cCI6MjA1OTQ3MTYxMn0.yxfY43YSVv0-O6pxsgZrCU5foADP0D2tir_yFZrb1p8";

export const supabase = createClient<Database>(
  SUPABASE_URL, 
  SUPABASE_PUBLISHABLE_KEY,
  {
    auth: {
      storage: localStorage,
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true
    }
  }
);
