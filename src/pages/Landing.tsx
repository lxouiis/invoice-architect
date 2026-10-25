import { motion } from 'motion/react';
import { FileText } from '@phosphor-icons/react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { GoogleLogin } from '@react-oauth/google';

export default function Landing() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Check if user is already logged in
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate('/documents');
      }
    };
    checkAuth();
  }, [navigate]);

  const handleGoogleSuccess = async (credentialResponse: any) => {
    try {
      setIsLoading(true);
      setError('');

      // Get user info from credential
      const decoded = JSON.parse(atob(credentialResponse.credential.split('.')[1]));

      // Store Google token and info
      localStorage.setItem('googleAccessToken', credentialResponse.credential);
      localStorage.setItem('userEmail', decoded.email);

      // Navigate directly to dashboard
      navigate('/documents');
    } catch (err) {
      setError('Google sign-in failed');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-zinc-950 dark:to-zinc-900 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Logo & Title */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 dark:bg-blue-500 rounded-2xl mb-4 mx-auto"
          >
            <FileText size={32} className="text-white" weight="fill" />
          </motion.div>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-white mb-2">
            Invoice Architect
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400">
            Your document management system
          </p>
        </div>

        {/* Google Sign-In Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="bg-white dark:bg-zinc-800 rounded-2xl shadow-xl p-8 border border-zinc-100 dark:border-zinc-700"
        >
          <div className="text-center space-y-6">
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">
              Sign in to your Account
            </h2>

            {error && (
              <div className="p-3 bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-700 rounded-lg text-red-700 dark:text-red-400 text-sm">
                {error}
              </div>
            )}

            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => setError('Google login failed')}
                theme="outline"
                size="large"
              />
            </motion.div>

            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Sign in securely with your Google account to manage your documents
            </p>
          </div>
        </motion.div>

        {/* Demo Mode Link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="text-center mt-8"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              localStorage.setItem('demoMode', 'true');
              localStorage.setItem('userEmail', 'demo@example.com');
              navigate('/documents');
            }}
            className="text-xs px-4 py-2 bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300 rounded-full hover:bg-zinc-300 dark:hover:bg-zinc-600 transition-colors font-medium"
          >
            🚀 Demo Mode (test without signing in)
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
}
