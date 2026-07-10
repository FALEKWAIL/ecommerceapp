import { createClient } from '@supabase/supabase-js';

// Get base Supabase URL, dynamically cleaning it to strip any trailing "/rest/v1" or "/rest/v1/"
// which is a common misconfiguration when deploying to hosting providers like Vercel.
let supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
if (supabaseUrl.endsWith('/rest/v1/')) {
  supabaseUrl = supabaseUrl.substring(0, supabaseUrl.length - 9);
} else if (supabaseUrl.endsWith('/rest/v1')) {
  supabaseUrl = supabaseUrl.substring(0, supabaseUrl.length - 8);
}

const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
