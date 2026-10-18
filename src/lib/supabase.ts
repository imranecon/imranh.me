import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export function isSupabaseConfigured(): boolean {
  return Boolean(
    supabaseUrl &&
    supabaseUrl.startsWith("http") &&
    supabaseAnonKey &&
    supabaseAnonKey.length > 10
  );
}

// Client for public or browser-side interactions
let clientInstance: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient | null {
  if (!isSupabaseConfigured()) return null;
  if (!clientInstance) {
    clientInstance = createClient(supabaseUrl!, supabaseAnonKey!);
  }
  return clientInstance;
}

// Server-side client with elevated service role (if configured), falling back to anon key
let serverClientInstance: SupabaseClient | null = null;

export function getSupabaseServerClient(): SupabaseClient | null {
  if (!isSupabaseConfigured()) return null;
  if (!serverClientInstance) {
    const key = supabaseServiceKey || supabaseAnonKey!;
    serverClientInstance = createClient(supabaseUrl!, key, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
  }
  return serverClientInstance;
}
