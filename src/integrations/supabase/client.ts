import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://epgpfpazskxcsispbdra.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVwZ3BmcGF6c2t4Y3Npc3BiZHJhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQyMDc4ODcsImV4cCI6MjA0OTc4Mzg4N30.lBoTst5fAMEmhcHkmr-CYE6HCjYZEN4utahdsAQ7gbg';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});