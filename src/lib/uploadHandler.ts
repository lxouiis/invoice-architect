import { supabase } from './supabase';

export const uploadFile = async (
  file: File,
  userId: string,
  category: 'invoice' | 'scan' | 'document'
) => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `${userId}/${fileName}`;

    // Upload file to storage
    const { data, error: uploadError } = await supabase.storage
      .from('documents')
      .upload(filePath, file);

    if (uploadError) {
      throw uploadError;
    }

    // Get public URL
    const { data: publicUrlData } = supabase.storage
      .from('documents')
      .getPublicUrl(filePath);

    const fileUrl = publicUrlData.publicUrl;

    // Insert file metadata into database
    const { data: dbData, error: dbError } = await supabase
      .from('files')
      .insert({
        user_id: userId,
        file_name: file.name,
        file_type: fileExt,
        upload_date: new Date().toISOString().split('T')[0],
        category,
        file_size: file.size,
        file_url: fileUrl,
      })
      .select();

    if (dbError) {
      throw dbError;
    }

    return dbData?.[0];
  } catch (error) {
    console.error('Upload error:', error);
    throw error;
  }
};
