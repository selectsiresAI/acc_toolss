import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});

// ── Custom exports (keep after regeneration) ──
export const supabaseUrl = SUPABASE_URL;
export const supabaseAnonKey = SUPABASE_PUBLISHABLE_KEY;

export function getImportBullsFunctionUrlCandidates() {
  return [`${SUPABASE_URL}/functions/v1/import-bulls`];
}