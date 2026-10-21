import { motion } from 'motion/react';
import { SignIn, FileText, Check, EnvelopeOpen } from '@phosphor-icons/react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { GoogleLogin } from '@react-oauth/google';

export default function Landing() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isLinkSent, setIsLinkSent] = useState(false);

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

  const handleSendMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    setError('');

    try {
      const { error: authError } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/documents`,
        },
      });

      if (authError) {
        setError(authError.message);
        setIsLoading(false);
        return;
      }

      setIsLinkSent(true);
    } catch (err) {
      setError('An unexpected error occurred');
      setIsLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    try {
      setIsLoading(true);
      setError('');

      // Get user info from credential
      const decoded = JSON.parse(atob(credentialResponse.credential.split('.')[1]));

      // Store Google token and info
      localStorage.setItem('googleAccessToken', credentialResponse.credential);
      localStorage.setItem('userEmail', decoded.email);

      // Sign in to Supabase with email
      const { error: signInError } = await supabase.auth.signInWithOtp({
        email: decoded.email,
        options: {
          emailRedirectTo: `${window.location.origin}/documents`,
        },
      });

      if (signInError) {
        setError('Failed to sign in. Please use magic link instead.');
        setIsLoading(false);
        return;
      }

      setIsLinkSent(true);
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

        {/* Login Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="bg-white dark:bg-zinc-800 rounded-2xl shadow-xl p-8 border border-zinc-100 dark:border-zinc-700"
        >
          {isLinkSent ? (
            <div className="text-center space-y-4">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="inline-flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full mx-auto"
              >
                <Check size={32} className="text-green-600 dark:text-green-400" weight="bold" />
              </motion.div>
              <div>
                <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">
                  Magic link sent!
                </h2>
                <p className="text-zinc-600 dark:text-zinc-400">
                  Check your email for a link to log in. It expires in 24 hours.
                </p>
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setIsLinkSent(false);
                  setEmail('');
                }}
                className="w-full py-3 bg-zinc-200 dark:bg-zinc-700 text-zinc-900 dark:text-white font-semibold rounded-lg hover:bg-zinc-300 dark:hover:bg-zinc-600 transition-colors"
              >
                Try another email
              </motion.button>
            </div>
          ) : (
            <form onSubmit={handleSendMagicLink} className="space-y-6">
              {error && (
                <div className="p-3 bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-700 rounded-lg text-red-700 dark:text-red-400 text-sm">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-zinc-900 dark:text-white mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="dad@example.com"
                  required
                  className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-700 border border-zinc-200 dark:border-zinc-600 rounded-lg text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors"
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isLoading || !email}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-zinc-300 dark:disabled:bg-zinc-700 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity }}
                      className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                    />
                    Sending link...
                  </>
                ) : (
                  <>
                    <SignIn size={20} />
                    Send Magic Link
                  </>
                )}
              </motion.button>

              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-zinc-300 dark:border-zinc-600" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                    Or
                  </span>
                </div>
              </div>

              <div className="flex justify-center">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={() => setError('Google login failed')}
                  theme="outline"
                  size="large"
                />
              </div>
            </form>
          )}

          <p className="text-center text-sm text-zinc-600 dark:text-zinc-400 mt-6">
            Sign in with magic link or Google to store files in your Drive
          </p>
        </motion.div>

        {/* Demo Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="text-center mt-8 space-y-3"
        >
          <div className="p-3 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg">
            <p className="text-xs text-blue-700 dark:text-blue-300 font-medium">
              💡 Hit auth rate limit? Use demo mode to test all features
            </p>
          </div>
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
            🚀 Enter Demo Mode
          </motion.button>
          <p className="text-xs text-zinc-500 dark:text-zinc-500">
            Rate limit resets in ~1 hour. Session persists with magic link!
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
