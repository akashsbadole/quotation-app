import { useState, useEffect, useCallback } from 'react';
import { googleDriveService, DriveFile, UploadProgress } from '../services/google-drive';

interface GoogleDriveState {
  isInitialized: boolean;
  isSignedIn: boolean;
  isLoading: boolean;
  error: string | null;
  userInfo: any;
  files: DriveFile[];
  uploadProgress: UploadProgress | null;
}

export const useGoogleDrive = () => {
  const [state, setState] = useState<GoogleDriveState>({
    isInitialized: false,
    isSignedIn: false,
    isLoading: false,
    error: null,
    userInfo: null,
    files: [],
    uploadProgress: null
  });

  // Initialize Google Drive on mount
  useEffect(() => {
    const initializeDrive = async () => {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      try {
        const initialized = await googleDriveService.initialize();
        const signedIn = googleDriveService.isUserSignedIn();
        const userInfo = signedIn ? googleDriveService.getUserInfo() : null;

        setState(prev => ({
          ...prev,
          isInitialized: initialized,
          isSignedIn: signedIn,
          userInfo: userInfo,
          isLoading: false
        }));

        // Load files if signed in
        if (signedIn) {
          await loadFiles();
        }
      } catch (error) {
        setState(prev => ({
          ...prev,
          error: error instanceof Error ? error.message : 'Failed to initialize Google Drive',
          isLoading: false
        }));
      }
    };

    initializeDrive();
  }, []);

  // Sign in to Google Drive
  const signIn = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const success = await googleDriveService.signIn();
      if (success) {
        const userInfo = googleDriveService.getUserInfo();
        setState(prev => ({
          ...prev,
          isSignedIn: true,
          userInfo: userInfo,
          isLoading: false
        }));

        // Load files after sign in
        await loadFiles();
      } else {
        setState(prev => ({
          ...prev,
          error: 'Failed to sign in to Google Drive',
          isLoading: false
        }));
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Sign in failed',
        isLoading: false
      }));
    }
  }, []);

  // Sign out from Google Drive
  const signOut = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true }));

    try {
      await googleDriveService.signOut();
      setState(prev => ({
        ...prev,
        isSignedIn: false,
        userInfo: null,
        files: [],
        isLoading: false
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Sign out failed',
        isLoading: false
      }));
    }
  }, []);

  // Load files from Google Drive
  const loadFiles = useCallback(async () => {
    if (!state.isSignedIn) return;

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const files = await googleDriveService.listQuotationFiles();
      setState(prev => ({
        ...prev,
        files: files,
        isLoading: false
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to load files',
        isLoading: false
      }));
    }
  }, [state.isSignedIn]);

  // Upload quotation PDF
  const uploadQuotationPDF = useCallback(async (
    pdfBlob: Blob,
    fileName: string,
    quotationData: any
  ): Promise<DriveFile | null> => {
    if (!state.isSignedIn) {
      throw new Error('Not signed in to Google Drive');
    }

    setState(prev => ({ ...prev, isLoading: true, error: null, uploadProgress: null }));

    try {
      const file = await googleDriveService.uploadQuotationPDF(
        pdfBlob,
        fileName,
        quotationData,
        (progress) => {
          setState(prev => ({ ...prev, uploadProgress: progress }));
        }
      );

      setState(prev => ({
        ...prev,
        isLoading: false,
        uploadProgress: null
      }));

      // Refresh file list
      await loadFiles();

      return file;
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Upload failed',
        isLoading: false,
        uploadProgress: null
      }));
      throw error;
    }
  }, [state.isSignedIn, loadFiles]);

  // Download file
  const downloadFile = useCallback(async (fileId: string): Promise<Blob> => {
    if (!state.isSignedIn) {
      throw new Error('Not signed in to Google Drive');
    }

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const blob = await googleDriveService.downloadFile(fileId);
      setState(prev => ({ ...prev, isLoading: false }));
      return blob;
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Download failed',
        isLoading: false
      }));
      throw error;
    }
  }, [state.isSignedIn]);

  // Delete file
  const deleteFile = useCallback(async (fileId: string): Promise<boolean> => {
    if (!state.isSignedIn) {
      throw new Error('Not signed in to Google Drive');
    }

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const success = await googleDriveService.deleteFile(fileId);
      setState(prev => ({ ...prev, isLoading: false }));

      if (success) {
        // Refresh file list
        await loadFiles();
      }

      return success;
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Delete failed',
        isLoading: false
      }));
      return false;
    }
  }, [state.isSignedIn, loadFiles]);

  // Share file
  const shareFile = useCallback(async (
    fileId: string,
    email: string,
    role: 'reader' | 'writer' = 'reader'
  ): Promise<boolean> => {
    if (!state.isSignedIn) {
      throw new Error('Not signed in to Google Drive');
    }

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const success = await googleDriveService.shareFile(fileId, email, role);
      setState(prev => ({ ...prev, isLoading: false }));
      return success;
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Share failed',
        isLoading: false
      }));
      return false;
    }
  }, [state.isSignedIn]);

  // Get shareable link
  const getShareableLink = useCallback(async (fileId: string): Promise<string | null> => {
    if (!state.isSignedIn) {
      throw new Error('Not signed in to Google Drive');
    }

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const link = await googleDriveService.getShareableLink(fileId);
      setState(prev => ({ ...prev, isLoading: false }));
      return link;
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to get shareable link',
        isLoading: false
      }));
      return null;
    }
  }, [state.isSignedIn]);

  // Search files by quotation reference
  const searchByQuotationReference = useCallback(async (referenceNumber: string): Promise<DriveFile[]> => {
    if (!state.isSignedIn) {
      throw new Error('Not signed in to Google Drive');
    }

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const files = await googleDriveService.searchByQuotationReference(referenceNumber);
      setState(prev => ({ ...prev, isLoading: false }));
      return files;
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Search failed',
        isLoading: false
      }));
      return [];
    }
  }, [state.isSignedIn]);

  // Get storage usage
  const getStorageUsage = useCallback(async (): Promise<{ used: number; limit: number }> => {
    if (!state.isSignedIn) {
      return { used: 0, limit: 0 };
    }

    try {
      return await googleDriveService.getStorageUsage();
    } catch (error) {
      console.error('Failed to get storage usage:', error);
      return { used: 0, limit: 0 };
    }
  }, [state.isSignedIn]);

  // Clear error
  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  // Refresh files
  const refreshFiles = useCallback(async () => {
    await loadFiles();
  }, [loadFiles]);

  return {
    // State
    isInitialized: state.isInitialized,
    isSignedIn: state.isSignedIn,
    isLoading: state.isLoading,
    error: state.error,
    userInfo: state.userInfo,
    files: state.files,
    uploadProgress: state.uploadProgress,

    // Actions
    signIn,
    signOut,
    uploadQuotationPDF,
    downloadFile,
    deleteFile,
    shareFile,
    getShareableLink,
    searchByQuotationReference,
    getStorageUsage,
    refreshFiles,
    clearError
  };
};

// Hook for uploading quotation PDFs with progress tracking
export const useQuotationUpload = () => {
  const { uploadQuotationPDF, isSignedIn, uploadProgress } = useGoogleDrive();
  const [isUploading, setIsUploading] = useState(false);

  const uploadQuotation = useCallback(async (
    quotationData: any,
    pdfBlob?: Blob
  ): Promise<DriveFile | null> => {
    if (!isSignedIn) {
      throw new Error('Please sign in to Google Drive first');
    }

    setIsUploading(true);

    try {
      // Generate PDF blob if not provided
      let blob = pdfBlob;
      if (!blob) {
        // In a real app, you would generate the PDF here
        // For now, we'll create a dummy PDF blob
        blob = new Blob(['%PDF-1.4 Dummy PDF content'], { type: 'application/pdf' });
      }

      const fileName = `${quotationData.referenceNumber}_${quotationData.customerName.replace(/\s+/g, '_')}.pdf`;
      
      const file = await uploadQuotationPDF(blob, fileName, quotationData);
      setIsUploading(false);
      return file;
    } catch (error) {
      setIsUploading(false);
      throw error;
    }
  }, [isSignedIn, uploadQuotationPDF]);

  return {
    uploadQuotation,
    isUploading,
    uploadProgress
  };
};

export default useGoogleDrive;
