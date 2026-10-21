import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { FileText, Receipt, Scan, SignOut, Plus } from '@phosphor-icons/react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

interface CategoryCard {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
  count: number;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState('');
  const [categories, setCategories] = useState<CategoryCard[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const isDemoMode = localStorage.getItem('demoMode') === 'true';

      if (isDemoMode) {
        setUserEmail(localStorage.getItem('userEmail') || 'demo@example.com');
        setCategories([
          {
            id: 'documents',
            name: 'Documents',
            icon: <FileText size={40} weight="fill" />,
            color: 'from-purple-500 to-purple-600',
            count: 1,
          },
          {
            id: 'invoices',
            name: 'Invoices',
            icon: <Receipt size={40} weight="fill" />,
            color: 'from-green-500 to-green-600',
            count: 2,
          },
          {
            id: 'scans',
            name: 'Scanned Files',
            icon: <Scan size={40} weight="fill" />,
            color: 'from-blue-500 to-blue-600',
            count: 1,
          },
        ]);
        setIsLoading(false);
        return;
      }

      const { data: { session }, error } = await supabase.auth.getSession();

      if (!session || error) {
        navigate('/');
        return;
      }

      setUserEmail(session.user.email || '');
      fetchCategoryCounts(session.user.id);
    };

    checkAuth();
  }, [navigate]);

  const fetchCategoryCounts = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('files')
        .select('category')
        .eq('user_id', userId);

      if (error) throw error;

      const counts = {
        documents: data?.filter((f) => f.category === 'document').length || 0,
        invoices: data?.filter((f) => f.category === 'invoice').length || 0,
        scans: data?.filter((f) => f.category === 'scan').length || 0,
      };

      setCategories([
        {
          id: 'documents',
          name: 'Documents',
          icon: <FileText size={40} weight="fill" />,
          color: 'from-purple-500 to-purple-600',
          count: counts.documents,
        },
        {
          id: 'invoices',
          name: 'Invoices',
          icon: <Receipt size={40} weight="fill" />,
          color: 'from-green-500 to-green-600',
          count: counts.invoices,
        },
        {
          id: 'scans',
          name: 'Scanned Files',
          icon: <Scan size={40} weight="fill" />,
          color: 'from-blue-500 to-blue-600',
          count: counts.scans,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

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

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950">
      {/* Header */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="sticky top-0 z-40 border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-sm"
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FileText size={28} className="text-blue-600 dark:text-blue-400" weight="fill" />
            <div>
              <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
                Document Hub
              </h1>
              <p className="text-xs text-zinc-600 dark:text-zinc-400">{userEmail}</p>
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
      <div className="max-w-7xl mx-auto px-6 py-12">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="mb-12"
        >
          <h2 className="text-3xl font-bold text-zinc-900 dark:text-white mb-2">
            Your Files
          </h2>
          <p className="text-zinc-600 dark:text-zinc-400">
            Organize and manage your documents by category
          </p>
        </motion.div>

        {/* Category Cards Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid md:grid-cols-3 gap-6 mb-12"
        >
          {isLoading ? (
            <div className="col-span-3 text-center py-12">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full mx-auto"
              />
            </div>
          ) : (
            categories.map((category, index) => (
              <motion.button
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  if (category.id === 'invoices') {
                    navigate('/invoices');
                  } else {
                    navigate(`/documents/${category.id}`);
                  }
                }}
                className={`relative p-8 rounded-2xl text-white overflow-hidden shadow-lg hover:shadow-xl transition-shadow group min-h-64`}
              >
                {/* Background Gradient */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-90 group-hover:opacity-100 transition-opacity`}
                />

                {/* Content */}
                <div className="relative z-10 flex flex-col items-center justify-center h-full text-center space-y-4">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className="text-5xl opacity-90"
                  >
                    {category.icon}
                  </motion.div>

                  <div>
                    <h3 className="text-2xl font-bold mb-1">{category.name}</h3>
                    <p className="text-lg opacity-90">
                      {category.count} {category.count === 1 ? 'file' : 'files'}
                    </p>
                  </div>
                </div>

                {/* Accent */}
                <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10" />
              </motion.button>
            ))
          )}
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="grid md:grid-cols-2 gap-6"
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/documents/all')}
            className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border border-blue-200 dark:border-blue-800 rounded-xl hover:border-blue-300 dark:hover:border-blue-700 transition-colors flex flex-col items-center justify-center gap-3"
          >
            <FileText size={32} className="text-blue-600 dark:text-blue-400" />
            <div className="text-center">
              <p className="font-semibold text-zinc-900 dark:text-white">
                View All Documents
              </p>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                See everything in one place
              </p>
            </div>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/documents/all')}
            className="p-6 bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/30 dark:to-red-950/30 border border-orange-200 dark:border-orange-800 rounded-xl hover:border-orange-300 dark:hover:border-orange-700 transition-colors flex flex-col items-center justify-center gap-3"
          >
            <Plus size={32} className="text-orange-600 dark:text-orange-400" />
            <div className="text-center">
              <p className="font-semibold text-zinc-900 dark:text-white">
                Upload New Files
              </p>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Add documents to your hub
              </p>
            </div>
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}