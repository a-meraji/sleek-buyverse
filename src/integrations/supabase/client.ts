import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://epgpfpazskxcsispbdra.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVwZ3BmcGF6c2t4Y3Npc3BiZHJhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDg5NTM2MDAsImV4cCI6MjAyNDUyOTYwMH0.LqEKN8KQED0lJ0DXy5qjzI0mpq_K8UH2_qfcQbXs_KE';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);