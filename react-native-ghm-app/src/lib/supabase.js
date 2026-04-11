import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SUPABASE_URL = 'https://iexcqvcuzmmiruqcssdz.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlleGNxdmN1em1taXJ1cWNzc2R6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA2MDU5NjcsImV4cCI6MjA2NjE4MTk2N30.G7BnxSnKEC7mDYEltnyFvntdpAID5AEGkdwFu8FfAyE';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
