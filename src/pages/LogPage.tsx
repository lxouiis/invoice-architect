import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Search, Download, Trash2, FileArrowDown, CalendarDays, FileText } from '@phosphor-icons/react';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';

interface FileItem {
  id: string;
  file_name: string;
  file_type: string;
  upload_date: string;
  category: 'invoice' | 'scan' | 'document';
  google_drive_link: string;
  file_size: number;
}

export default function LogPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'invoice' | 'scan' | 'document'>('all');
  const [files, setFiles] = useState<FileItem[]>([]);
  const [groupedFiles, setGroupedFiles] = useState<{ [key: string]: FileItem[] }>({});

  // Mock data - replace with actual Supabase fetch
  useEffect(() => {
    const mockFiles: FileItem[] = [
      {
        id: '1',
        file_name: 'invoice_001.xlsx',
        file_type: 'xlsx',
        upload_date: '2026-10-17',
        category: 'invoice',
        google_drive_link: 'https://drive.google.com/file/d/example',
        file_size: 45000,
      },
      {
        id: '2',
        file_name: 'receipt_scan.pdf',
        file_type: 'pdf',
        upload_date: '2026-10-17',
        category: 'scan',
        google_drive_link: 'https://drive.google.com/file/d/example',
        file_size: 125000,
      },
      {
        id: '3',
        file_name: 'invoice_002.xlsx',
        file_type: 'xlsx',
        upload_date: '2026-10-16',
        category: 'invoice',
        google_drive_link: 'https://drive.google.com/file/d/example',
        file_size: 48000,
      },
    ];

    setFiles(mockFiles);
    groupFilesByDate(mockFiles);
  }, []);

  const groupFilesByDate = (fileList: FileItem[]) => {
    const grouped: { [key: string]: FileItem[] } = {};

    fileList.forEach((file) => {
      const date = new Date(file.upload_date);
      const key = date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

      if (!grouped[key]) {
        grouped[key] = [];
      }
      grouped[key].push(file);
    });

    setGroupedFiles(grouped);
  };

  const filteredFiles = files.filter((file) => {
    const matchesSearch = file.file_name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || file.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleDelete = (id: string) => {
    setFiles(files.filter((f) => f.id !== id));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">Documents</h1>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/invoices')}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
            >
              Create Invoice
            </motion.button>
          </div>

          {/* Search & Filter */}
          <div className="space-y-4">
            <div className="relative">
              <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" weight="bold" />
              <Input
                type="text"
                placeholder="Search files..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 py-2 bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 focus:border-blue-600 dark:focus:border-blue-400"
              />
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              {(['all', 'invoice', 'scan', 'document'] as const).map((cat) => (
                <motion.button
                  key={cat}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    selectedCategory === cat
                      ? 'bg-blue-600 text-white'
                      : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                  }`}
                >
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Files List */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {filteredFiles.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <FileText size={48} className="mx-auto text-zinc-400 dark:text-zinc-600 mb-4" weight="thin" />
            <h3 className="text-xl font-semibold text-zinc-900 dark:text-white mb-2">No documents yet</h3>
            <p className="text-zinc-600 dark:text-zinc-400 mb-6">Create your first invoice or upload a document to get started.</p>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/invoices')}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors inline-flex items-center gap-2"
            >
              <FileArrowDown size={18} />
              Create Invoice
            </motion.button>
          </motion.div>
        ) : (
          <div className="space-y-8">
            {Object.entries(groupedFiles).map(([date, dateFiles]) => {
              const filteredDateFiles = dateFiles.filter((f) =>
                filteredFiles.some((ff) => ff.id === f.id)
              );

              if (filteredDateFiles.length === 0) return null;

              return (
                <motion.div key={date} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
                  <div className="flex items-center gap-3 mb-4">
                    <CalendarDays size={20} className="text-zinc-400 dark:text-zinc-600" weight="bold" />
                    <h3 className="text-sm font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wide">{date}</h3>
                    <div className="flex-1 h-px bg-zinc-200 dark:bg-zinc-800"></div>
                  </div>

                  <div className="space-y-2">
                    {filteredDateFiles.map((file) => (
                      <motion.div
                        key={file.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.2 }}
                        className="flex items-center justify-between p-4 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors group"
                      >
                        <div className="flex items-center gap-4 flex-1 min-w-0">
                          <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${
                            file.category === 'invoice'
                              ? 'bg-green-100 dark:bg-green-900/30'
                              : file.category === 'scan'
                              ? 'bg-blue-100 dark:bg-blue-900/30'
                              : 'bg-purple-100 dark:bg-purple-900/30'
                          }`}>
                            <span className={`text-sm font-bold ${
                              file.category === 'invoice'
                                ? 'text-green-600 dark:text-green-400'
                                : file.category === 'scan'
                                ? 'text-blue-600 dark:text-blue-400'
                                : 'text-purple-600 dark:text-purple-400'
                            }`}>
                              {file.file_type.toUpperCase().slice(0, 3)}
                            </span>
                          </div>

                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-zinc-900 dark:text-white truncate">{file.file_name}</p>
                            <p className="text-sm text-zinc-500 dark:text-zinc-400">{formatFileSize(file.file_size)}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 ml-4 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                          <motion.a
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            href={file.google_drive_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400 transition-colors"
                            title="Open in Google Drive"
                          >
                            <Download size={18} />
                          </motion.a>

                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleDelete(file.id)}
                            className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg text-red-600 dark:text-red-400 transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={18} />
                          </motion.button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
