import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// File metadata operations
export async function saveFileMetadata(fileData: {
  file_name: string;
  file_type: string;
  google_drive_id: string;
  google_drive_link: string;
  file_size: number;
  upload_date: string;
  category: 'invoice' | 'scan' | 'document';
}) {
  const { data, error } = await supabase
    .from('files')
    .insert([fileData]);

  if (error) {
    console.error('Error saving file metadata:', error);
    throw error;
  }

  return data;
}

export async function getFilesByMonth(year: string, month: string) {
  const startDate = `${year}-${month}-01`;
  const endDate = `${year}-${month}-31`;

  const { data, error } = await supabase
    .from('files')
    .select('*')
    .gte('upload_date', startDate)
    .lte('upload_date', endDate)
    .order('upload_date', { ascending: false });

  if (error) {
    console.error('Error fetching files:', error);
    throw error;
  }

  return data || [];
}

export async function getAllFiles() {
  const { data, error } = await supabase
    .from('files')
    .select('*')
    .order('upload_date', { ascending: false });

  if (error) {
    console.error('Error fetching all files:', error);
    throw error;
  }

  return data || [];
}

export async function deleteFileRecord(fileId: string) {
  const { error } = await supabase
    .from('files')
    .delete()
    .eq('id', fileId);

  if (error) {
    console.error('Error deleting file record:', error);
    throw error;
  }
}

export async function searchFiles(query: string) {
  const { data, error } = await supabase
    .from('files')
    .select('*')
    .ilike('file_name', `%${query}%`)
    .order('upload_date', { ascending: false });

  if (error) {
    console.error('Error searching files:', error);
    throw error;
  }

  return data || [];
}
