import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { MagnifyingGlass, Download, Trash, Cloud, Camera, SignOut, Calendar, FileText, CaretLeft } from '@phosphor-icons/react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase, type FileItem } from '../lib/supabase';
import UploadModal from '../components/UploadModal';

export default function LogPage() {
  const navigate = useNavigate();
  const { category } = useParams<{ category: string }>();
  const [userEmail, setUserEmail] = useState('');
  const [userId, setUserId] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [files, setFiles] = useState<FileItem[]>([]);
  const [groupedFiles, setGroupedFiles] = useState<{ [key: string]: FileItem[] }>({});
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  const getCategoryLabel = () => {
    const labels: { [key: string]: string } = {
      documents: 'Documents',
      invoices: 'Invoices',
      scans: 'Scanned Files',
      all: 'All Files',
    };
    return labels[category || 'all'] || 'Files';
  };

  const getCategoryType = (cat: string): 'invoice' | 'scan' | 'document' | null => {
    const mapping: { [key: string]: 'invoice' | 'scan' | 'document' | null } = {
      documents: 'document',
      invoices: 'invoice',
      scans: 'scan',
      all: null,
    };
    return mapping[cat] || null;
  };

  useEffect(() => {
    const checkAuth = async () => {
      const isDemoMode = localStorage.getItem('demoMode') === 'true';

      if (isDemoMode) {
        // Demo mode: use mock data + uploaded files
        setUserEmail(localStorage.getItem('userEmail') || 'demo@example.com');
        setUserId('demo-user-id');

        const mockFiles: FileItem[] = [
          {
            id: '1',
            file_name: 'invoice_001.xlsx',
            file_type: 'xlsx',
            upload_date: '2026-10-17',
            category: 'invoice',
            file_url: 'https://example.com/file1.xlsx',
            file_size: 45000,
            user_id: 'demo-user-id',
            created_at: new Date().toISOString(),
          },
          {
            id: '2',
            file_name: 'receipt_scan.pdf',
            file_type: 'pdf',
            upload_date: '2026-10-17',
            category: 'scan',
            file_url: 'https://example.com/file2.pdf',
            file_size: 125000,
            user_id: 'demo-user-id',
            created_at: new Date().toISOString(),
          },
          {
            id: '3',
            file_name: 'invoice_002.xlsx',
            file_type: 'xlsx',
            upload_date: '2026-10-16',
            category: 'invoice',
            file_url: 'https://example.com/file3.xlsx',
            file_size: 48000,
            user_id: 'demo-user-id',
            created_at: new Date().toISOString(),
          },
        ];

        // Add user-uploaded files from demo mode
        const demoFiles = JSON.parse(localStorage.getItem('demoFiles') || '[]');
        const allFiles = [...mockFiles, ...demoFiles];

        setFiles(allFiles);
        groupFilesByDate(allFiles);
        return;
      }

      const { data: { session }, error } = await supabase.auth.getSession();

      if (!session || error) {
        navigate('/');
        return;
      }

      setUserEmail(session.user.email || '');
      setUserId(session.user.id);
      fetchFiles(session.user.id);
    };

    checkAuth();
  }, [navigate]);

  const fetchFiles = async (userId: string) => {
    let query = supabase
      .from('files')
      .select('*')
      .eq('user_id', userId);

    const categoryType = getCategoryType(category || 'all');
    if (categoryType) {
      query = query.eq('category', categoryType);
    }

    const { data, error } = await query.order('upload_date', { ascending: false });

    if (error) {
      console.error('Error fetching files:', error);
      return;
    }

    if (data) {
      setFiles(data);
      groupFilesByDate(data);
    }
  };

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

  const filteredFiles = files.filter((file) =>
    file.file_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleLogout = async () => {
    const isDemoMode = localStorage.getItem('demoMode') === 'true';

    if (isDemoMode) {
      localStorage.removeItem('demoMode');
      localStorage.removeItem('userEmail');
    } else {
      await supabase.auth.signOut();
    }

    navigate('/');
  };

  const handleDelete = async (id: string) => {
    const isDemoMode = localStorage.getItem('demoMode') === 'true';

    if (isDemoMode) {
      // Demo mode: remove from localStorage
      const demoFiles = JSON.parse(localStorage.getItem('demoFiles') || '[]');
      const updated = demoFiles.filter((f: FileItem) => f.id !== id);
      localStorage.setItem('demoFiles', JSON.stringify(updated));
    } else {
      // Real mode: delete from Supabase
      const { error } = await supabase
        .from('files')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting file:', error);
        return;
      }
    }

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
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="sticky top-0 z-40 border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-sm"
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/documents')}
              className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-lg transition-colors"
            >
              <CaretLeft size={24} className="text-zinc-600 dark:text-zinc-400" />
            </motion.button>
            <div className="flex items-center gap-3">
              <FileText size={28} className="text-blue-600 dark:text-blue-400" weight="fill" />
              <div>
                <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
                  {getCategoryLabel()}
                </h1>
                <p className="text-xs text-zinc-600 dark:text-zinc-400">{userEmail}</p>
              </div>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLogout}
            className="px-4 py-2 flex items-center gap-2 text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white transition-colors"
          >
            <SignOut size={20} />
            Sign Out
          </motion.button>
        </div>
      </motion.header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Search Bar */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="relative">
            <MagnifyingGlass size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" weight="bold" />
            <input
              type="text"
              placeholder="Search documents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid md:grid-cols-2 gap-4 mb-12"
        >
          {/* Upload Documents */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsUploadModalOpen(true)}
            className="p-6 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors flex flex-col items-center justify-center gap-3"
          >
            <Cloud size={32} weight="fill" />
            <div className="text-center">
              <p className="font-semibold">Upload Documents</p>
              <p className="text-sm text-blue-100">PDF, XLSX, Images</p>
            </div>
          </motion.button>

          {/* Adobe Scan Documents */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="p-6 bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl transition-colors flex flex-col items-center justify-center gap-3"
          >
            <Camera size={32} weight="fill" />
            <div className="text-center">
              <p className="font-semibold">Scan Documents</p>
              <p className="text-sm text-red-100">Via Adobe Scan</p>
            </div>
          </motion.button>
        </motion.div>

        {/* Documents Section */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-6">
            Your Documents
          </h2>

          {filteredFiles.length === 0 ? (
            <div className="text-center py-16 bg-zinc-50 dark:bg-zinc-900/30 rounded-xl border-2 border-dashed border-zinc-200 dark:border-zinc-700">
              <FileText size={48} className="mx-auto text-zinc-400 dark:text-zinc-600 mb-4" weight="thin" />
              <h3 className="text-xl font-semibold text-zinc-900 dark:text-white mb-2">No documents yet</h3>
              <p className="text-zinc-600 dark:text-zinc-400">Start by uploading or scanning your first document</p>
            </div>
          ) : (
            <div className="space-y-8">
              {Object.entries(groupedFiles).map(([date, dateFiles]) => {
                const filteredDateFiles = dateFiles.filter((f) =>
                  filteredFiles.some((ff) => ff.id === f.id)
                );

                if (filteredDateFiles.length === 0) return null;

                return (
                  <motion.div
                    key={date}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    {/* Date Separator */}
                    <div className="flex items-center gap-3 mb-4">
                      <Calendar size={20} className="text-blue-600 dark:text-blue-400" weight="bold" />
                      <h3 className="text-sm font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wide">
                        {date}
                      </h3>
                      <div className="flex-1 h-px bg-zinc-200 dark:bg-zinc-700"></div>
                    </div>

                    {/* Files Grid */}
                    <div className="space-y-2">
                      {filteredDateFiles.map((file) => (
                        <motion.div
                          key={file.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.2 }}
                          className="flex items-center justify-between p-4 bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 hover:border-blue-300 dark:hover:border-blue-600 transition-colors group"
                        >
                          {/* File Info */}
                          <div className="flex items-center gap-4 flex-1 min-w-0">
                            <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 font-bold text-sm ${
                              file.category === 'invoice'
                                ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                                : file.category === 'scan'
                                ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                                : 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400'
                            }`}>
                              {file.file_type.toUpperCase().slice(0, 3)}
                            </div>

                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-zinc-900 dark:text-white truncate">
                                {file.file_name}
                              </p>
                              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                                {formatFileSize(file.file_size)} • {file.category}
                              </p>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-2 ml-4 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                            <motion.a
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.95 }}
                              href={file.file_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400 transition-colors"
                              title="Open file"
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
                              <Trash size={18} />
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
        </motion.div>
      </div>

      {/* Upload Modal */}
      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        userId={userId}
        onUploadSuccess={() => fetchFiles(userId)}
      />
    </div>
  );
}
