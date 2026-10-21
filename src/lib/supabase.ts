import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type FileItem = {
  id: string;
  user_id: string;
  file_name: string;
  file_type: string;
  upload_date: string;
  category: 'invoice' | 'scan' | 'document';
  file_size: number;
  file_url: string;
  created_at: string;
};
