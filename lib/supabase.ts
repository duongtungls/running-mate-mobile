import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

const supabaseUrl =
  Constants.expoConfig?.extra?.supabaseUrl ||
  process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey =
  Constants.expoConfig?.extra?.supabaseAnonKey ||
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

// Config check - Supabase configuration loaded

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('[Supabase] Missing configuration:', {
    supabaseUrl,
    supabaseAnonKey,
  });
  throw new Error(
    'Supabase URL and Anon Key must be defined in environment variables',
  );
}

// Initializing Supabase client

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    // Disable auto-refresh tokens in mobile apps for better battery life
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
