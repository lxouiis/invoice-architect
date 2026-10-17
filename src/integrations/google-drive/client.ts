import { google } from 'googleapis';

let authClient: any = null;
let driveClient: any = null;

export async function initializeGoogleDrive() {
  const oauth2Client = new google.auth.OAuth2(
    import.meta.env.VITE_GOOGLE_CLIENT_ID,
    import.meta.env.VITE_GOOGLE_CLIENT_SECRET,
    import.meta.env.VITE_GOOGLE_REDIRECT_URI
  );

  authClient = oauth2Client;
  driveClient = google.drive({ version: 'v3', auth: oauth2Client });

  return authClient;
}

export function getAuthUrl() {
  if (!authClient) initializeGoogleDrive();

  return authClient.generateAuthUrl({
    access_type: 'offline',
    scope: ['https://www.googleapis.com/auth/drive.file'],
  });
}

export async function handleAuthCallback(code: string) {
  if (!authClient) initializeGoogleDrive();

  const { tokens } = await authClient.getToken(code);
  authClient.setCredentials(tokens);

  localStorage.setItem('google_tokens', JSON.stringify(tokens));

  return tokens;
}

export function getStoredTokens() {
  const tokens = localStorage.getItem('google_tokens');
  return tokens ? JSON.parse(tokens) : null;
}

export async function setAuthCredentials(tokens: any) {
  if (!authClient) initializeGoogleDrive();
  authClient.setCredentials(tokens);
}

export async function createFolder(folderName: string, parentId?: string) {
  if (!driveClient) initializeGoogleDrive();

  const fileMetadata = {
    name: folderName,
    mimeType: 'application/vnd.google-apps.folder',
    ...(parentId && { parents: [parentId] }),
  };

  const response = await driveClient.files.create({
    resource: fileMetadata,
    fields: 'id',
  });

  return response.data.id;
}

export async function uploadFile(
  fileName: string,
  fileContent: Blob,
  parentId?: string
) {
  if (!driveClient) initializeGoogleDrive();

  const fileMetadata = {
    name: fileName,
    ...(parentId && { parents: [parentId] }),
  };

  const media = {
    mimeType: 'application/octet-stream',
    body: fileContent,
  };

  const response = await driveClient.files.create({
    resource: fileMetadata,
    media: media,
    fields: 'id, webViewLink',
  });

  return response.data;
}

export async function getOrCreateInvoiceFolder() {
  if (!driveClient) initializeGoogleDrive();

  const folderName = 'Invoice Architect';

  const response = await driveClient.files.list({
    q: `name='${folderName}' and mimeType='application/vnd.google-apps.folder' and trashed=false`,
    fields: 'files(id)',
    pageSize: 1,
  });

  if (response.data.files && response.data.files.length > 0) {
    return response.data.files[0].id;
  }

  return createFolder(folderName);
}

export async function getOrCreateDateFolder(year: string, month: string) {
  const invoiceFolderId = await getOrCreateInvoiceFolder();

  const yearFolderId = await getOrCreateChildFolder(year, invoiceFolderId);
  const monthFolderId = await getOrCreateChildFolder(month, yearFolderId);

  return monthFolderId;
}

async function getOrCreateChildFolder(folderName: string, parentId: string) {
  if (!driveClient) initializeGoogleDrive();

  const response = await driveClient.files.list({
    q: `name='${folderName}' and mimeType='application/vnd.google-apps.folder' and trashed=false and '${parentId}' in parents`,
    fields: 'files(id)',
    pageSize: 1,
  });

  if (response.data.files && response.data.files.length > 0) {
    return response.data.files[0].id;
  }

  return createFolder(folderName, parentId);
}
