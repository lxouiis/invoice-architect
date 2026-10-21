import { supabase } from './supabase';
import { uploadFileToDrive } from './googleDrive';

export const uploadFile = async (
  file: File,
  userId: string,
  category: 'invoice' | 'scan' | 'document',
  googleAccessToken?: string
) => {
  try {
    let fileUrl: string;

    // Upload to Google Drive if token available, otherwise use Supabase Storage
    if (googleAccessToken) {
      const driveFile = await uploadFileToDrive(file, googleAccessToken);
      fileUrl = driveFile.webViewLink;
    } else {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `${userId}/${fileName}`;

      // Upload file to Supabase storage
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

      fileUrl = publicUrlData.publicUrl;
    }

    // Insert file metadata into database
    const { data: dbData, error: dbError } = await supabase
      .from('files')
      .insert({
        user_id: userId,
        file_name: file.name,
        file_type: file.name.split('.').pop(),
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
