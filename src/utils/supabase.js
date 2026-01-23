import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://rumxmdrikkvqywrvgwga.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ1bXhtZHJpa2t2cXl3cnZnd2dhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkxNDAyNTQsImV4cCI6MjA4NDcxNjI1NH0.KdWPCBbyqxEuEHGLwCf4nS6OZaRa9d5mA_8_F2Y0G48';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
