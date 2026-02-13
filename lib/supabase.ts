import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

// Validate Supabase configuration
if (!supabaseUrl || !supabaseAnonKey || supabaseUrl === 'your_supabase_project_url' || supabaseAnonKey === 'your_supabase_anon_key') {
  console.warn('Supabase configuration is missing or invalid. Please set EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY in your .env file');
}

export const supabase = supabaseUrl && supabaseAnonKey && supabaseUrl !== 'your_supabase_project_url' 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Database types (you can expand these based on your actual schema)
export interface Database {
  public: {
    Tables: {
      // Add your table types here
      // Example:
      // users: {
      //   Row: {
      //     id: string;
      //     email: string;
      //     created_at: string;
      //   };
      //   Insert: {
      //     email: string;
      //   };
      //   Update: {
      //     email?: string;
      //   };
      // };
    };
  };
}
