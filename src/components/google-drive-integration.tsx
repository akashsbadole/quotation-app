import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';
import { useGoogleDrive, useQuotationUpload } from '../hooks/useGoogleDrive';
import { useGoogleAnalytics } from '../hooks/useGoogleAnalytics';
import { formatFileSize } from '../services/google-drive';

interface GoogleDriveIntegrationProps {
  onNavigate?: (section: string) => void;
}

export const GoogleDriveIntegration: React.FC<GoogleDriveIntegrationProps> = ({ onNavigate }) => {
  const {
    isInitialized,
    isSignedIn,
    isLoading,
    error,
    userInfo,
    files,
    signIn,
    signOut,
    deleteFile,
    shareFile,
    getShareableLink,
    refreshFiles,
    clearError
  } = useGoogleDrive();

  const { uploadQuotation, isUploading, uploadProgress } = useQuotationUpload();
  const { trackUserInteraction, trackDownload, trackExternalLink } = useGoogleAnalytics();

  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareEmail, setShareEmail] = useState('');
  const [shareRole, setShareRole] = useState<'reader' | 'writer'>('reader');

  const handleSignIn = async () => {
    trackUserInteraction('click', 'Google Drive Sign In');
    await signIn();
  };

  const handleSignOut = async () => {
    trackUserInteraction('click', 'Google Drive Sign Out');
    await signOut();
  };

  const handleUploadTest = async () => {
    trackUserInteraction('click', 'Test Upload');
    
    // Create a test quotation
    const testQuotation = {
      referenceNumber: `TEST-${Date.now()}`,
      customerName: 'Test Customer',
      customerEmail: 'test@example.com',
      total: 1000,
      items: [
        {
          id: '1',
          name: 'Test Product',
          description: 'Test product description',
          quantity: 1,
          unitPrice: 1000,
          total: 1000
        }
      ]
    };

    try {
      await uploadQuotation(testQuotation);
      alert('Test quotation uploaded successfully!');
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Upload failed: ' + (error as Error).message);
    }
  };

  const handleDeleteFile = async (fileId: string, fileName: string) => {
    if (confirm(`Are you sure you want to delete "${fileName}"?`)) {
      trackUserInteraction('click', 'Delete File', fileName);
      const success = await deleteFile(fileId);
      if (success) {
        alert('File deleted successfully!');
      }
    }
  };

  const handleShareFile = async () => {
    if (!selectedFile || !shareEmail) return;

    trackUserInteraction('click', 'Share File', selectedFile.name);
    const success = await shareFile(selectedFile.id, shareEmail, shareRole);
    
    if (success) {
      alert(`File shared successfully with ${shareEmail}!`);
      setShowShareModal(false);
      setShareEmail('');
      setSelectedFile(null);
    }
  };

  const handleGetShareableLink = async (file: any) => {
    trackUserInteraction('click', 'Get Shareable Link', file.name);
    const link = await getShareableLink(file.id);
    
    if (link) {
      navigator.clipboard.writeText(link);
      alert('Shareable link copied to clipboard!');
      trackExternalLink(link, `Shared: ${file.name}`);
    }
  };

  const handleDownloadFile = (file: any) => {
    trackDownload(file.name, 'PDF');
    trackUserInteraction('click', 'Download File', file.name);
    
    if (file.webContentLink) {
      window.open(file.webContentLink, '_blank');
    } else if (file.webViewLink) {
      window.open(file.webViewLink, '_blank');
    }
  };

  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Icon icon="lucide:loader" className="text-4xl text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Initializing Google Drive...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Google Drive Integration</h1>
              <p className="text-gray-600">
                Automatically save and manage your quotation PDFs in Google Drive
              </p>
            </div>
            <div className="flex items-center space-x-4">
              {isSignedIn && userInfo && (
                <div className="flex items-center space-x-3 bg-white rounded-lg px-4 py-2 border border-gray-200">
                  <img
                    src={userInfo.imageUrl}
                    alt={userInfo.name}
                    className="w-8 h-8 rounded-full"
                  />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{userInfo.name}</p>
                    <p className="text-xs text-gray-500">{userInfo.email}</p>
                  </div>
                </div>
              )}
              {isSignedIn ? (
                <motion.button
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors duration-200"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSignOut}
                  disabled={isLoading}
                >
                  Sign Out
                </motion.button>
              ) : (
                <motion.button
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSignIn}
                  disabled={isLoading}
                >
                  <Icon icon="logos:google-drive" />
                  <span>Sign In to Google Drive</span>
                </motion.button>
              )}
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Icon icon="lucide:alert-circle" className="text-red-600" />
                <p className="text-red-800">{error}</p>
              </div>
              <motion.button
                className="text-red-600 hover:text-red-800"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={clearError}
              >
                <Icon icon="lucide:x" />
              </motion.button>
            </div>
          </div>
        )}

        {!isSignedIn ? (
          /* Sign In Prompt */
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <Icon icon="logos:google-drive" className="text-6xl mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Connect to Google Drive</h2>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              Sign in to Google Drive to automatically save your quotation PDFs, share them with customers, 
              and access them from anywhere. Your files will be organized in a dedicated QuoteManager folder.
            </p>
            <motion.button
              className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-3 mx-auto"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSignIn}
              disabled={isLoading}
            >
              <Icon icon="logos:google-drive" className="text-xl" />
              <span>Sign In to Google Drive</span>
            </motion.button>
          </div>
        ) : (
          /* Main Content */
          <div className="space-y-8">
            {/* Actions */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <motion.button
                  className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200 text-left"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleUploadTest}
                  disabled={isUploading}
                >
                  <Icon icon="lucide:upload" className="text-2xl text-blue-600 mb-2" />
                  <h4 className="font-medium text-gray-900">Test Upload</h4>
                  <p className="text-sm text-gray-600">Upload a test quotation PDF</p>
                </motion.button>
                
                <motion.button
                  className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200 text-left"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={refreshFiles}
                  disabled={isLoading}
                >
                  <Icon icon="lucide:refresh-cw" className="text-2xl text-green-600 mb-2" />
                  <h4 className="font-medium text-gray-900">Refresh Files</h4>
                  <p className="text-sm text-gray-600">Reload files from Google Drive</p>
                </motion.button>
                
                <motion.button
                  className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200 text-left"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onNavigate?.('quotations-create')}
                >
                  <Icon icon="lucide:file-plus" className="text-2xl text-purple-600 mb-2" />
                  <h4 className="font-medium text-gray-900">Create Quotation</h4>
                  <p className="text-sm text-gray-600">Create a new quotation with auto-save</p>
                </motion.button>
              </div>
            </div>

            {/* Upload Progress */}
            {isUploading && uploadProgress && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Uploading...</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>{uploadProgress.percentage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress.percentage}%` }}
                    ></div>
                  </div>
                  <div className="text-xs text-gray-500">
                    {formatFileSize(uploadProgress.loaded)} of {formatFileSize(uploadProgress.total)}
                  </div>
                </div>
              </div>
            )}

            {/* Files List */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Quotation Files</h3>
                  <div className="text-sm text-gray-500">
                    {files.length} file{files.length !== 1 ? 's' : ''}
                  </div>
                </div>
              </div>
              
              {files.length === 0 ? (
                <div className="p-12 text-center">
                  <Icon icon="lucide:file-x" className="text-4xl text-gray-400 mx-auto mb-4" />
                  <h4 className="text-lg font-medium text-gray-900 mb-2">No files found</h4>
                  <p className="text-gray-600 mb-6">
                    Upload your first quotation PDF to get started.
                  </p>
                  <motion.button
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleUploadTest}
                  >
                    Upload Test File
                  </motion.button>
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {files.map((file) => (
                    <div key={file.id} className="p-6 hover:bg-gray-50 transition-colors duration-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <Icon icon="lucide:file-text" className="text-2xl text-red-600" />
                          <div>
                            <h4 className="font-medium text-gray-900">{file.name}</h4>
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              <span>{new Date(file.createdTime).toLocaleDateString()}</span>
                              {file.size && <span>{formatFileSize(parseInt(file.size))}</span>}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <motion.button
                            className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors duration-200"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleDownloadFile(file)}
                            title="Download"
                          >
                            <Icon icon="lucide:download" />
                          </motion.button>
                          
                          <motion.button
                            className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors duration-200"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleGetShareableLink(file)}
                            title="Get Shareable Link"
                          >
                            <Icon icon="lucide:link" />
                          </motion.button>
                          
                          <motion.button
                            className="p-2 text-purple-600 hover:bg-purple-100 rounded-lg transition-colors duration-200"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => {
                              setSelectedFile(file);
                              setShowShareModal(true);
                            }}
                            title="Share with Email"
                          >
                            <Icon icon="lucide:share" />
                          </motion.button>
                          
                          <motion.button
                            className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors duration-200"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleDeleteFile(file.id, file.name)}
                            title="Delete"
                          >
                            <Icon icon="lucide:trash-2" />
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Share Modal */}
        {showShareModal && selectedFile && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <motion.div
              className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Share File</h3>
                <motion.button
                  className="p-2 text-gray-400 hover:text-gray-600"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowShareModal(false)}
                >
                  <Icon icon="lucide:x" />
                </motion.button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={shareEmail}
                    onChange={(e) => setShareEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter email address"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Permission Level
                  </label>
                  <select
                    value={shareRole}
                    onChange={(e) => setShareRole(e.target.value as 'reader' | 'writer')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="reader">Can view</option>
                    <option value="writer">Can edit</option>
                  </select>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <motion.button
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowShareModal(false)}
                >
                  Cancel
                </motion.button>
                <motion.button
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleShareFile}
                  disabled={!shareEmail}
                >
                  Share
                </motion.button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};
