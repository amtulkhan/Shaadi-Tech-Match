import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://swhbqjnxilqqntqbwgoy.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN3aGJxam54aWxxcW50cWJ3Z295Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA2NTQ1NzAsImV4cCI6MjA1NjIzMDU3MH0.bSY5Ig9_KWsmhCIgHWTYpG2YIV8oLfXJZnlPXS2_ZP0"

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);