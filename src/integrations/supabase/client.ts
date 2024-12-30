import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://epgpfpazskxcsispbdra.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVwZ3BmcGF6c2t4Y3Npc3BiZHJhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDM5NDg0MDAsImV4cCI6MjAxOTUyNDQwMH0.0oGHuZ_oHYQlPrYs7WBUYyBDGP8_jQlPYGvwGt1H2VM';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});