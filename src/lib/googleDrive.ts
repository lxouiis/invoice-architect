// Google Drive API integration

const DRIVE_API_BASE = 'https://www.googleapis.com/drive/v3';
const SCOPES = 'https://www.googleapis.com/auth/drive.file';

export const uploadFileToDrive = async (
  file: File,
  accessToken: string,
  folderName: string = 'Invoice Architect'
): Promise<{ fileId: string; webViewLink: string; name: string }> => {
  try {
    // First, find or create the folder
    const folderId = await ensureFolder(accessToken, folderName);

    // Upload file to the folder
    const formData = new FormData();
    const metadata = {
      name: file.name,
      mimeType: file.type,
      parents: [folderId],
    };

    formData.append(
      'metadata',
      new Blob([JSON.stringify(metadata)], { type: 'application/json' })
    );
    formData.append('file', file);

    const response = await fetch(`${DRIVE_API_BASE}/files?uploadType=multipart&fields=id,webViewLink`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Failed to upload file: ${response.statusText}`);
    }

    const data = await response.json();
    return {
      fileId: data.id,
      webViewLink: data.webViewLink,
      name: file.name,
    };
  } catch (error) {
    console.error('Error uploading to Google Drive:', error);
    throw error;
  }
};

const ensureFolder = async (accessToken: string, folderName: string): Promise<string> => {
  try {
    // Search for existing folder
    const searchResponse = await fetch(
      `${DRIVE_API_BASE}/files?q=name='${folderName}' and mimeType='application/vnd.google-apps.folder' and trashed=false&spaces=drive&fields=files(id)`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const searchData = await searchResponse.json();

    if (searchData.files && searchData.files.length > 0) {
      return searchData.files[0].id;
    }

    // Create new folder if not found
    const createResponse = await fetch(`${DRIVE_API_BASE}/files?fields=id`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: folderName,
        mimeType: 'application/vnd.google-apps.folder',
      }),
    });

    const createData = await createResponse.json();
    return createData.id;
  } catch (error) {
    console.error('Error managing Drive folder:', error);
    throw error;
  }
};

export const getAccessTokenFromCredential = (credential: string): string => {
  try {
    const decoded = JSON.parse(atob(credential.split('.')[1]));
    return credential;
  } catch {
    return credential;
  }
};
