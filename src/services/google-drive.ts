// Google Drive Integration Service
// Note: This is a client-side implementation using Google Drive API

interface GoogleDriveConfig {
  apiKey: string;
  clientId: string;
  discoveryDoc: string;
  scopes: string;
}

interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  size?: string;
  createdTime: string;
  modifiedTime: string;
  webViewLink?: string;
  webContentLink?: string;
  parents?: string[];
}

interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

class GoogleDriveService {
  private gapi: any = null;
  private isInitialized = false;
  private isSignedIn = false;
  private quotationFolderId: string | null = null;

  private config: GoogleDriveConfig = {
    apiKey: 'YOUR_API_KEY', // Replace with your actual API key
    clientId: 'YOUR_CLIENT_ID.apps.googleusercontent.com', // Replace with your client ID
    discoveryDoc: 'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest',
    scopes: 'https://www.googleapis.com/auth/drive.file'
  };

  // Initialize Google Drive API
  async initialize(): Promise<boolean> {
    if (this.isInitialized) return true;

    try {
      // Load Google API script if not already loaded
      if (!window.gapi) {
        await this.loadGoogleAPI();
      }

      this.gapi = window.gapi;

      // Initialize the API
      await new Promise<void>((resolve, reject) => {
        this.gapi.load('client:auth2', async () => {
          try {
            await this.gapi.client.init({
              apiKey: this.config.apiKey,
              clientId: this.config.clientId,
              discoveryDocs: [this.config.discoveryDoc],
              scope: this.config.scopes
            });

            // Check if user is already signed in
            const authInstance = this.gapi.auth2.getAuthInstance();
            this.isSignedIn = authInstance.isSignedIn.get();

            this.isInitialized = true;
            console.log('Google Drive API initialized successfully');
            resolve();
          } catch (error) {
            console.error('Failed to initialize Google Drive API:', error);
            reject(error);
          }
        });
      });

      // Create QuoteManager folder if signed in
      if (this.isSignedIn) {
        await this.ensureQuotationFolder();
      }

      return true;
    } catch (error) {
      console.error('Google Drive initialization failed:', error);
      return false;
    }
  }

  // Load Google API script dynamically
  private loadGoogleAPI(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (document.getElementById('google-api-script')) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.id = 'google-api-script';
      script.src = 'https://apis.google.com/js/api.js';
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load Google API script'));
      document.head.appendChild(script);
    });
  }

  // Sign in to Google Drive
  async signIn(): Promise<boolean> {
    if (!this.isInitialized) {
      const initialized = await this.initialize();
      if (!initialized) return false;
    }

    try {
      const authInstance = this.gapi.auth2.getAuthInstance();
      await authInstance.signIn();
      this.isSignedIn = true;
      
      // Create QuoteManager folder
      await this.ensureQuotationFolder();
      
      console.log('Successfully signed in to Google Drive');
      return true;
    } catch (error) {
      console.error('Google Drive sign-in failed:', error);
      return false;
    }
  }

  // Sign out from Google Drive
  async signOut(): Promise<void> {
    if (!this.isInitialized) return;

    try {
      const authInstance = this.gapi.auth2.getAuthInstance();
      await authInstance.signOut();
      this.isSignedIn = false;
      this.quotationFolderId = null;
      console.log('Successfully signed out from Google Drive');
    } catch (error) {
      console.error('Google Drive sign-out failed:', error);
    }
  }

  // Check if user is signed in
  isUserSignedIn(): boolean {
    return this.isSignedIn;
  }

  // Get user info
  getUserInfo(): any {
    if (!this.isSignedIn || !this.gapi) return null;

    const authInstance = this.gapi.auth2.getAuthInstance();
    const user = authInstance.currentUser.get();
    const profile = user.getBasicProfile();

    return {
      id: profile.getId(),
      name: profile.getName(),
      email: profile.getEmail(),
      imageUrl: profile.getImageUrl()
    };
  }

  // Ensure QuoteManager folder exists
  private async ensureQuotationFolder(): Promise<string> {
    if (this.quotationFolderId) return this.quotationFolderId;

    try {
      // Search for existing QuoteManager folder
      const response = await this.gapi.client.drive.files.list({
        q: "name='QuoteManager' and mimeType='application/vnd.google-apps.folder' and trashed=false",
        fields: 'files(id, name)'
      });

      if (response.result.files && response.result.files.length > 0) {
        this.quotationFolderId = response.result.files[0].id;
        console.log('Found existing QuoteManager folder:', this.quotationFolderId);
      } else {
        // Create new folder
        const folderResponse = await this.gapi.client.drive.files.create({
          resource: {
            name: 'QuoteManager',
            mimeType: 'application/vnd.google-apps.folder'
          },
          fields: 'id'
        });

        this.quotationFolderId = folderResponse.result.id;
        console.log('Created new QuoteManager folder:', this.quotationFolderId);
      }

      return this.quotationFolderId!;
    } catch (error) {
      console.error('Failed to ensure QuoteManager folder:', error);
      throw error;
    }
  }

  // Upload quotation PDF to Google Drive
  async uploadQuotationPDF(
    pdfBlob: Blob, 
    fileName: string, 
    quotationData: any,
    onProgress?: (progress: UploadProgress) => void
  ): Promise<DriveFile | null> {
    if (!this.isSignedIn) {
      throw new Error('Not signed in to Google Drive');
    }

    try {
      await this.ensureQuotationFolder();

      const metadata = {
        name: fileName,
        parents: [this.quotationFolderId!],
        description: `Quotation PDF for ${quotationData.customerName} - ${quotationData.referenceNumber}`,
        properties: {
          quotationId: quotationData.referenceNumber,
          customerName: quotationData.customerName,
          customerEmail: quotationData.customerEmail,
          total: quotationData.total?.toString() || '0',
          createdBy: 'QuoteManager',
          createdAt: new Date().toISOString()
        }
      };

      // Create form data for multipart upload
      const form = new FormData();
      form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
      form.append('file', pdfBlob);

      // Upload with progress tracking
      const response = await this.uploadWithProgress(form, onProgress);
      
      if (response.ok) {
        const result = await response.json();
        console.log('Successfully uploaded quotation PDF to Google Drive:', result);
        
        return {
          id: result.id,
          name: result.name,
          mimeType: result.mimeType,
          createdTime: result.createdTime,
          modifiedTime: result.modifiedTime,
          webViewLink: result.webViewLink,
          webContentLink: result.webContentLink,
          parents: result.parents
        };
      } else {
        throw new Error(`Upload failed: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Failed to upload quotation PDF:', error);
      throw error;
    }
  }

  // Upload with progress tracking
  private uploadWithProgress(
    formData: FormData, 
    onProgress?: (progress: UploadProgress) => void
  ): Promise<Response> {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      if (onProgress) {
        xhr.upload.addEventListener('progress', (event) => {
          if (event.lengthComputable) {
            const progress: UploadProgress = {
              loaded: event.loaded,
              total: event.total,
              percentage: Math.round((event.loaded / event.total) * 100)
            };
            onProgress(progress);
          }
        });
      }

      xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(new Response(xhr.responseText, { status: xhr.status }));
        } else {
          reject(new Error(`Upload failed: ${xhr.statusText}`));
        }
      });

      xhr.addEventListener('error', () => {
        reject(new Error('Upload failed: Network error'));
      });

      // Get access token
      const authInstance = this.gapi.auth2.getAuthInstance();
      const user = authInstance.currentUser.get();
      const accessToken = user.getAuthResponse().access_token;

      xhr.open('POST', 'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,mimeType,createdTime,modifiedTime,webViewLink,webContentLink,parents');
      xhr.setRequestHeader('Authorization', `Bearer ${accessToken}`);
      xhr.send(formData);
    });
  }

  // List quotation files
  async listQuotationFiles(limit = 50): Promise<DriveFile[]> {
    if (!this.isSignedIn) {
      throw new Error('Not signed in to Google Drive');
    }

    try {
      await this.ensureQuotationFolder();

      const response = await this.gapi.client.drive.files.list({
        q: `'${this.quotationFolderId}' in parents and trashed=false`,
        fields: 'files(id,name,mimeType,size,createdTime,modifiedTime,webViewLink,webContentLink,properties)',
        orderBy: 'modifiedTime desc',
        pageSize: limit
      });

      return response.result.files || [];
    } catch (error) {
      console.error('Failed to list quotation files:', error);
      throw error;
    }
  }

  // Download file from Google Drive
  async downloadFile(fileId: string): Promise<Blob> {
    if (!this.isSignedIn) {
      throw new Error('Not signed in to Google Drive');
    }

    try {
      const response = await this.gapi.client.drive.files.get({
        fileId: fileId,
        alt: 'media'
      });

      // Convert response to blob
      const blob = new Blob([response.body], { type: 'application/pdf' });
      return blob;
    } catch (error) {
      console.error('Failed to download file:', error);
      throw error;
    }
  }

  // Delete file from Google Drive
  async deleteFile(fileId: string): Promise<boolean> {
    if (!this.isSignedIn) {
      throw new Error('Not signed in to Google Drive');
    }

    try {
      await this.gapi.client.drive.files.delete({
        fileId: fileId
      });

      console.log('Successfully deleted file from Google Drive:', fileId);
      return true;
    } catch (error) {
      console.error('Failed to delete file:', error);
      return false;
    }
  }

  // Share file with specific email
  async shareFile(fileId: string, email: string, role: 'reader' | 'writer' = 'reader'): Promise<boolean> {
    if (!this.isSignedIn) {
      throw new Error('Not signed in to Google Drive');
    }

    try {
      await this.gapi.client.drive.permissions.create({
        fileId: fileId,
        resource: {
          role: role,
          type: 'user',
          emailAddress: email
        },
        sendNotificationEmail: true
      });

      console.log(`Successfully shared file ${fileId} with ${email}`);
      return true;
    } catch (error) {
      console.error('Failed to share file:', error);
      return false;
    }
  }

  // Get file sharing link
  async getShareableLink(fileId: string): Promise<string | null> {
    if (!this.isSignedIn) {
      throw new Error('Not signed in to Google Drive');
    }

    try {
      // Make file publicly viewable
      await this.gapi.client.drive.permissions.create({
        fileId: fileId,
        resource: {
          role: 'reader',
          type: 'anyone'
        }
      });

      // Get file info with web view link
      const response = await this.gapi.client.drive.files.get({
        fileId: fileId,
        fields: 'webViewLink'
      });

      return response.result.webViewLink || null;
    } catch (error) {
      console.error('Failed to get shareable link:', error);
      return null;
    }
  }

  // Search files by quotation reference
  async searchByQuotationReference(referenceNumber: string): Promise<DriveFile[]> {
    if (!this.isSignedIn) {
      throw new Error('Not signed in to Google Drive');
    }

    try {
      const response = await this.gapi.client.drive.files.list({
        q: `properties has {key='quotationId' and value='${referenceNumber}'} and trashed=false`,
        fields: 'files(id,name,mimeType,size,createdTime,modifiedTime,webViewLink,properties)'
      });

      return response.result.files || [];
    } catch (error) {
      console.error('Failed to search files:', error);
      throw error;
    }
  }

  // Get storage usage
  async getStorageUsage(): Promise<{ used: number; limit: number }> {
    if (!this.isSignedIn) {
      throw new Error('Not signed in to Google Drive');
    }

    try {
      const response = await this.gapi.client.drive.about.get({
        fields: 'storageQuota'
      });

      const quota = response.result.storageQuota;
      return {
        used: parseInt(quota.usage || '0'),
        limit: parseInt(quota.limit || '0')
      };
    } catch (error) {
      console.error('Failed to get storage usage:', error);
      return { used: 0, limit: 0 };
    }
  }
}

// Create singleton instance
export const googleDriveService = new GoogleDriveService();

// Export types
export type { DriveFile, UploadProgress, GoogleDriveConfig };

// Helper functions
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const isGoogleDriveAvailable = (): boolean => {
  return typeof window !== 'undefined' && 'gapi' in window;
};

export default googleDriveService;
