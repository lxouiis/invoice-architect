import { motion } from 'motion/react';
import { ArrowRight, FileSpreadsheet, Cloud, Mail, LogIn } from '@phosphor-icons/react';
import { useNavigate } from 'react-router-dom';

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="bg-white dark:bg-zinc-950 min-h-screen">
      {/* Navigation */}
      <nav className="sticky top-0 z-40 border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <FileSpreadsheet size={24} className="text-blue-600 dark:text-blue-400" weight="fill" />
            <span className="font-semibold text-lg text-zinc-900 dark:text-white">Invoice Architect</span>
          </div>
          <div className="flex items-center gap-4">
            <button className="text-sm text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white transition-colors">
              Docs
            </button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/invoices')}
              className="px-4 py-2 text-sm font-medium rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors flex items-center gap-2"
            >
              <LogIn size={16} />
              Open App
            </motion.button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-20 lg:py-32 grid lg:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <h1 className="text-5xl lg:text-6xl font-bold leading-tight text-zinc-900 dark:text-white mb-6">
            Invoices, organized. Always.
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed mb-8 max-w-lg">
            Generate professional invoices instantly. Back them up to Google Drive automatically. View everything in one place—no chaos, no lost files.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/invoices')}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2 w-full sm:w-auto"
            >
              Start Generating
              <ArrowRight size={18} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/documents')}
              className="px-6 py-3 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-white font-medium rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors flex items-center justify-center gap-2 w-full sm:w-auto"
            >
              View Documents
              <ArrowRight size={18} />
            </motion.button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative"
        >
          <div className="bg-gradient-to-br from-blue-100 to-blue-50 dark:from-blue-950 dark:to-zinc-900 rounded-2xl p-8 lg:p-12 border border-blue-200 dark:border-blue-900">
            <div className="space-y-4">
              <div className="h-12 bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700"></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="h-8 bg-white dark:bg-zinc-800 rounded border border-zinc-200 dark:border-zinc-700"></div>
                <div className="h-8 bg-white dark:bg-zinc-800 rounded border border-zinc-200 dark:border-zinc-700"></div>
              </div>
              <div className="h-24 bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700"></div>
            </div>
          </div>
          <div className="absolute -bottom-4 -right-4 bg-white dark:bg-zinc-900 rounded-xl shadow-lg p-4 border border-zinc-200 dark:border-zinc-800 max-w-xs">
            <p className="text-sm font-medium text-zinc-900 dark:text-white mb-2">Auto-synced to Google Drive</p>
            <p className="text-xs text-zinc-600 dark:text-zinc-400">Every invoice backed up instantly</p>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="bg-zinc-50 dark:bg-zinc-900/50 py-20 lg:py-28 border-t border-zinc-200 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
            className="mb-16"
          >
            <h2 className="text-4xl font-bold text-zinc-900 dark:text-white mb-4">Everything you need</h2>
            <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl">
              Built for contractors and builders who need invoices that work, not workflows that slow you down.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {[
              {
                icon: FileSpreadsheet,
                title: 'Professional Invoices',
                description: 'Create invoices instantly. Customize seller details, tax rates, and signatures. Export to Excel.',
              },
              {
                icon: Cloud,
                title: 'Google Drive Sync',
                description: 'Every invoice auto-backs up to your Google Drive. Organize by date, type, or client. Never lose a file.',
              },
              {
                icon: Mail,
                title: 'Gmail Integration',
                description: 'Coming soon: attach invoices directly from your app. Search and manage files alongside your email.',
              },
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-white dark:bg-zinc-800 rounded-xl p-8 border border-zinc-200 dark:border-zinc-700 hover:border-blue-300 dark:hover:border-blue-700 transition-colors"
              >
                <feature.icon size={32} className="text-blue-600 dark:text-blue-400 mb-4" weight="bold" />
                <h3 className="text-xl font-semibold text-zinc-900 dark:text-white mb-2">{feature.title}</h3>
                <p className="text-zinc-600 dark:text-zinc-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="max-w-7xl mx-auto px-6 py-20 lg:py-28">
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          className="text-4xl font-bold text-zinc-900 dark:text-white mb-16 text-center"
        >
          Three steps to organized invoices
        </motion.h2>

        <div className="space-y-12">
          {[
            {
              number: '01',
              title: 'Fill in your details',
              description: 'Enter seller info, buyer details, and work items. Customize signatures and tax rates once—use forever.',
            },
            {
              number: '02',
              title: 'Generate & download',
              description: 'Create a professional XLSX invoice. Download it, print it, send it. All in seconds.',
            },
            {
              number: '03',
              title: 'Auto-synced to Drive',
              description: 'Invoice automatically backs up to your Google Drive. Access it anytime, anywhere. No manual uploads.',
            },
          ].map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={`flex gap-12 items-center ${i % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}
            >
              <div className="flex-1">
                <div className="text-6xl font-bold text-blue-600/20 dark:text-blue-400/20 mb-4">{step.number}</div>
                <h3 className="text-2xl font-semibold text-zinc-900 dark:text-white mb-3">{step.title}</h3>
                <p className="text-lg text-zinc-600 dark:text-zinc-400">{step.description}</p>
              </div>
              <div className="flex-1 hidden lg:block">
                <div className="bg-gradient-to-br from-blue-100 to-blue-50 dark:from-blue-950 dark:to-zinc-900 rounded-xl h-64 border border-blue-200 dark:border-blue-900"></div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 dark:bg-blue-900 py-20 lg:py-28">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto px-6 text-center"
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">Stop losing track of invoices</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Start generating professional invoices today. Back them up automatically. Access them anytime.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/invoices')}
            className="px-8 py-4 bg-white hover:bg-blue-50 text-blue-600 font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 mx-auto"
          >
            Get Started Now
            <ArrowRight size={20} />
          </motion.button>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="bg-zinc-950 dark:bg-black text-zinc-400 py-12 border-t border-zinc-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <FileSpreadsheet size={20} className="text-blue-400" weight="fill" />
                <span className="font-semibold text-white">Invoice Architect</span>
              </div>
              <p className="text-sm">Built for contractors who value their time.</p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Docs</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Support</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-zinc-800 pt-8 text-center text-sm">
            <p>© 2026 Invoice Architect. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
