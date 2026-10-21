import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Cloud, X } from '@phosphor-icons/react';
import { uploadFile } from '../lib/uploadHandler';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  onUploadSuccess: () => void;
}

export default function UploadModal({
  isOpen,
  onClose,
  userId,
  onUploadSuccess,
}: UploadModalProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFiles(files);
    }
  };

  const handleFiles = async (fileList: FileList) => {
    setIsLoading(true);
    setError('');

    try {
      const isDemoMode = localStorage.getItem('demoMode') === 'true';

      for (let i = 0; i < fileList.length; i++) {
        const file = fileList[i];

        // Determine category based on file type
        let category: 'invoice' | 'scan' | 'document' = 'document';
        const fileType = file.type;
        const fileName = file.name.toLowerCase();

        if (
          fileType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
          fileType === 'application/vnd.ms-excel' ||
          fileName.includes('invoice')
        ) {
          category = 'invoice';
        } else if (fileType === 'application/pdf' || fileName.includes('scan')) {
          category = 'scan';
        }

        if (isDemoMode) {
          // Demo mode: store in localStorage
          await new Promise(resolve => setTimeout(resolve, 500));

          const demoFiles = JSON.parse(localStorage.getItem('demoFiles') || '[]');
          const newFile = {
            id: Date.now().toString(),
            user_id: 'demo-user-id',
            file_name: file.name,
            file_type: fileType,
            upload_date: new Date().toISOString().split('T')[0],
            category,
            file_size: file.size,
            file_url: '#',
            created_at: new Date().toISOString(),
          };
          demoFiles.push(newFile);
          localStorage.setItem('demoFiles', JSON.stringify(demoFiles));
        } else {
          // Real mode: upload to Google Drive or Supabase
          const googleToken = localStorage.getItem('googleAccessToken');
          await uploadFile(file, userId, category, googleToken || undefined);
        }
      }

      onUploadSuccess();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
          >
            <div className="bg-white dark:bg-zinc-800 rounded-2xl shadow-2xl max-w-md w-full p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">
                  Upload Documents
                </h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded-lg transition-colors"
                >
                  <X size={20} className="text-zinc-600 dark:text-zinc-400" />
                </button>
              </div>

              {/* Drag & Drop Area */}
              <div
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
                  isDragging
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/30'
                    : 'border-zinc-300 dark:border-zinc-600'
                }`}
              >
                <Cloud size={48} className="mx-auto mb-4 text-blue-600 dark:text-blue-400" />
                <p className="font-semibold text-zinc-900 dark:text-white mb-1">
                  Drag files here
                </p>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
                  or click to browse
                </p>

                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  onChange={(e) => e.target.files && handleFiles(e.target.files)}
                  className="hidden"
                  accept=".pdf,.xlsx,.xls,.doc,.docx,.png,.jpg,.jpeg"
                />

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isLoading}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-zinc-300 dark:disabled:bg-zinc-700 text-white font-semibold rounded-lg transition-colors"
                >
                  {isLoading ? 'Uploading...' : 'Select Files'}
                </motion.button>
              </div>

              {error && (
                <div className="mt-4 p-3 bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-700 rounded-lg text-red-700 dark:text-red-400 text-sm">
                  {error}
                </div>
              )}

              <p className="text-xs text-zinc-500 dark:text-zinc-500 mt-4">
                Supported: PDF, XLSX, DOC, PNG, JPG
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
