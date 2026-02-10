import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    '❌ CRITICAL: Missing Supabase credentials!\n' +
    'Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env.local file\n' +
    'Current URL:', supabaseUrl ? '✓ Set' : '✗ Missing',
    '\nCurrent Key:', supabaseAnonKey ? '✓ Set' : '✗ Missing'
  );
}

console.log('🔗 Supabase Client Initialized:', {
  url: supabaseUrl?.substring(0, 20) + '...' || 'MISSING',
  keyPresent: !!supabaseAnonKey,
});

export const supabase = createClient(supabaseUrl || 'https://hsctoaanbymtmcmyhrrx.supabase.co', supabaseAnonKey || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhzY3RvYWFuYnltdG1jbXlocnJ4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk2NzU1NDcsImV4cCI6MjA4NTI1MTU0N30.QBPBvoq-6GvhzOV5SeBx9PAcHOtdPNGJWUbT9SMBc_Q');
