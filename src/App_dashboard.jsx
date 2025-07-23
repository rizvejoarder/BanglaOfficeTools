import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';
import { useInView } from 'react-intersection-observer';
import toast, { Toaster } from 'react-hot-toast';
import { 
  Brain,
  FileText,
  Image,
  Layers,
  Download,
  Sparkles,
  Zap,
  Star,
  TrendingUp,
  Users,
  CheckCircle,
  ArrowRight,
  Play,
  BarChart3,
  Globe,
  Shield,
  Clock,
  Award
} from 'lucide-react';
import { ModernToolCard, ThemeToggle, ProgressBar, FloatingAction } from './components/ModernUIComponents';
import { modernTools } from './utils/modernToolsConfig.jsx';
import { 
  convertImageToWord, 
  convertPdfToWord, 
  convertWordToPdf, 
  convertImagesToPdf,
  convertPdfToImages
} from './utils';

const DashboardApp = () => {
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressMessage, setProgressMessage] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [selectedTool, setSelectedTool] = useState(null);
  const [achievements, setAchievements] = useState([]);
  const [stats, setStats] = useState({
    filesProcessed: 2847,
    accuracy: 99,
    timeSaved: 1250,
    happyUsers: 15420
  });

  // Intersection Observer for animations
  const [heroRef, heroInView] = useInView({ 
    threshold: 0.1, 
    triggerOnce: true 
  });
  const [statsRef, statsInView] = useInView({ 
    threshold: 0.1, 
    triggerOnce: true 
  });
  const [toolsRef, toolsInView] = useInView({ 
    threshold: 0.1, 
    triggerOnce: true 
  });

  // Enhanced counter animation with GSAP
  useEffect(() => {
    if (statsInView) {
      gsap.to('.stat-counter', {
        innerText: (i, target) => target.getAttribute('data-count'),
        duration: 2,
        snap: { innerText: 1 },
        ease: 'power2.out',
        stagger: 0.2
      });
    }
  }, [statsInView]);

  // Dark mode toggle
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const updateProgress = (percentage, message = '') => {
    setProgress(percentage);
    setProgressMessage(message);
  };

  const handleFileUpload = useCallback(async (files, toolType) => {
    if (!files || files.length === 0) {
      toast.error('কোন ফাইল নির্বাচিত হয়নি');
      return;
    }

    setProcessing(true);
    setProgress(0);
    setError(null);
    setResult(null);

    try {
      let processedResult;
      
      switch (toolType) {
        case 'image-to-word':
          updateProgress(10, 'ছবি লোড হচ্ছে...');
          processedResult = await convertImageToWord(files[0], updateProgress);
          break;
        
        case 'pdf-to-word':
          updateProgress(10, 'PDF পড়া হচ্ছে...');
          processedResult = await convertPdfToWord(files[0], updateProgress);
          break;
        
        case 'pdf-to-image':
          updateProgress(10, 'PDF প্রক্রিয়া শুরু...');
          processedResult = await convertPdfToImages(files[0], updateProgress);
          break;
        
        case 'images-to-pdf':
          updateProgress(10, 'ছবিগুলি প্রক্রিয়া করা হচ্ছে...');
          processedResult = await convertImagesToPdf(files, updateProgress);
          break;
        
        default:
          throw new Error('অজানা টুল টাইপ');
      }

      setResult(processedResult);
      setStats(prev => ({
        ...prev,
        filesProcessed: prev.filesProcessed + 1,
        timeSaved: prev.timeSaved + Math.floor(Math.random() * 30) + 10
      }));
      
      toast.success('✅ সফলভাবে সম্পন্ন হয়েছে!', {
        style: {
          background: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)',
          color: 'white',
          borderRadius: '12px',
          padding: '16px'
        }
      });

    } catch (err) {
      console.error('File processing error:', err);
      setError(err.message || 'ফাইল প্রক্রিয়াকরণে ত্রুটি হয়েছে');
      toast.error('❌ প্রক্রিয়াকরণে ত্রুটি হয়েছে');
    } finally {
      setProcessing(false);
      setProgress(0);
      setProgressMessage('');
    }
  }, []);

  return (
    <div className={`min-h-screen transition-all duration-700 ${
      darkMode 
        ? 'bg-gray-900 text-white' 
        : 'bg-gray-50'
    }`}>
      {/* Theme Toggle */}
      <ThemeToggle darkMode={darkMode} setDarkMode={setDarkMode} />

      {/* Navigation Bar */}
      <motion.nav 
        className={`fixed top-0 left-0 right-0 z-40 backdrop-blur-xl border-b ${
          darkMode 
            ? 'bg-gray-900/80 border-gray-800' 
            : 'bg-white/80 border-gray-200'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <motion.div 
                className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center"
                whileHover={{ scale: 1.1, rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                <Zap className="w-6 h-6 text-white" />
              </motion.div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  OfficeWave
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">AI-Powered Document Processing</p>
              </div>
            </div>
            
            <div className="hidden md:flex items-center space-x-6">
              <div className="flex items-center space-x-4 text-sm">
                <div className="flex items-center space-x-1 text-green-600">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span>Online</span>
                </div>
                <div className="text-gray-500">|</div>
                <div className="flex items-center space-x-1">
                  <Users className="w-4 h-4" />
                  <span>{stats.happyUsers.toLocaleString()}+ Users</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <motion.section 
        ref={heroRef}
        className="relative pt-32 pb-20 px-6 overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-r from-blue-400/10 to-purple-400/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-r from-purple-400/10 to-pink-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/30 rounded-full text-blue-600 dark:text-blue-300 text-sm font-medium mb-6"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
            >
              <Star className="w-4 h-4" />
              New AI Features Available
            </motion.div>

            <motion.h1 
              className="text-5xl md:text-7xl font-black mb-6 text-center"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1.2, type: "spring", bounce: 0.4 }}
            >
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent">
                OfficeWave
              </span>
            </motion.h1>
            
            <motion.p 
              className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto text-gray-600 dark:text-gray-300 text-center font-medium"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              আপনার ডকুমেন্ট প্রসেসিং এর ভবিষ্যত। AI-পাওয়ার্ড টুলস দিয়ে কাজ করুন দ্রুত ও নির্ভুলভাবে।
            </motion.p>

            <motion.div 
              className="flex flex-wrap justify-center gap-4 mb-12"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              <div className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full text-white text-sm font-semibold shadow-lg">
                <Shield className="w-4 h-4" />
                ১০০% নিরাপদ ও অফলাইন
              </div>
              <div className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full text-white text-sm font-semibold shadow-lg">
                <Brain className="w-4 h-4" />
                AI-এনহান্সড প্রসেসিং
              </div>
              <div className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full text-white text-sm font-semibold shadow-lg">
                <Zap className="w-4 h-4" />
                লাইটনিং ফাস্ট
              </div>
            </motion.div>

            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.8 }}
            >
              <motion.button 
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center gap-2"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <Play className="w-5 h-5" />
                Get Started Free
                <ArrowRight className="w-5 h-5" />
              </motion.button>
              <motion.button 
                className="px-8 py-4 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-semibold text-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-300"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                Watch Demo
              </motion.button>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Stats Section */}
      <motion.section 
        ref={statsRef}
        className="py-16 px-6"
        initial={{ opacity: 0, y: 100 }}
        animate={statsInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <motion.div 
                className="stat-counter text-4xl md:text-5xl font-black text-blue-600 mb-2" 
                data-count={stats.filesProcessed}
                whileInView={{ scale: [0, 1] }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                0
              </motion.div>
              <div className="text-gray-600 dark:text-gray-400 font-medium">Files Processed</div>
            </div>
            <div className="text-center">
              <motion.div 
                className="stat-counter text-4xl md:text-5xl font-black text-green-600 mb-2" 
                data-count={stats.accuracy}
                whileInView={{ scale: [0, 1] }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                0
              </motion.div>
              <div className="text-gray-600 dark:text-gray-400 font-medium">% Accuracy</div>
            </div>
            <div className="text-center">
              <motion.div 
                className="stat-counter text-4xl md:text-5xl font-black text-purple-600 mb-2" 
                data-count={stats.timeSaved}
                whileInView={{ scale: [0, 1] }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                0
              </motion.div>
              <div className="text-gray-600 dark:text-gray-400 font-medium">Hours Saved</div>
            </div>
            <div className="text-center">
              <motion.div 
                className="stat-counter text-4xl md:text-5xl font-black text-cyan-600 mb-2" 
                data-count={stats.happyUsers}
                whileInView={{ scale: [0, 1] }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                0
              </motion.div>
              <div className="text-gray-600 dark:text-gray-400 font-medium">Happy Users</div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Tools Section */}
      <motion.section 
        ref={toolsRef}
        className="py-20 px-6"
        initial={{ opacity: 0, y: 100 }}
        animate={toolsInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <motion.h2 
              className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent dark:from-white dark:to-gray-300"
              whileInView={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 50 }}
              transition={{ duration: 0.6 }}
            >
              Powerful Tools for Every Need
            </motion.h2>
            <motion.p 
              className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto"
              whileInView={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 30 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Transform your document workflow with our AI-powered tools designed for speed, accuracy, and ease of use.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {modernTools.map((tool, index) => (
              <motion.div
                key={tool.id}
                initial={{ opacity: 0, y: 50, rotateX: 45 }}
                animate={toolsInView ? { opacity: 1, y: 0, rotateX: 0 } : {}}
                transition={{ 
                  duration: 0.6, 
                  delay: index * 0.1,
                  type: "spring",
                  stiffness: 100
                }}
                whileHover={{ 
                  scale: 1.05, 
                  rotateY: 5,
                  z: 50,
                  transition: { duration: 0.3 }
                }}
              >
                <ModernToolCard
                  tool={tool}
                  onFileUpload={handleFileUpload}
                  processing={processing}
                  darkMode={darkMode}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-800 dark:text-white">
              Why Choose OfficeWave?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Experience the future of document processing with cutting-edge AI technology and user-friendly design.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div 
              className="p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-xl"
              whileHover={{ y: -10, scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mb-6">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">AI-Powered Accuracy</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Our advanced AI algorithms ensure 99%+ accuracy in text recognition and document processing.
              </p>
            </motion.div>

            <motion.div 
              className="p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-xl"
              whileHover={{ y: -10, scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mb-6">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">100% Secure & Private</h3>
              <p className="text-gray-600 dark:text-gray-400">
                All processing happens locally in your browser. Your documents never leave your device.
              </p>
            </motion.div>

            <motion.div 
              className="p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-xl"
              whileHover={{ y: -10, scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-6">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Lightning Fast</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Process documents in seconds with our optimized algorithms and modern web technologies.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Progress Bar */}
      <AnimatePresence>
        {processing && (
          <ProgressBar 
            progress={progress} 
            message={progressMessage}
            darkMode={darkMode}
          />
        )}
      </AnimatePresence>

      {/* Result Modal */}
      <AnimatePresence>
        {result && (
          <motion.div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setResult(null)}
          >
            <motion.div 
              className="bg-white dark:bg-gray-800 max-w-2xl w-full p-8 rounded-3xl shadow-2xl"
              initial={{ scale: 0.5, opacity: 0, y: 100 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.5, opacity: 0, y: 100 }}
              transition={{ type: "spring", duration: 0.5 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-800 dark:text-white">Processing Complete!</h3>
                  <p className="text-gray-600 dark:text-gray-400">Your file has been successfully processed.</p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <motion.button 
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold flex items-center justify-center gap-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setResult(null)}
                >
                  <Download className="w-5 h-5" />
                  Download Result
                </motion.button>
                <motion.button 
                  className="px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-50 dark:hover:bg-gray-700"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setResult(null)}
                >
                  Close
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Action Button */}
      <FloatingAction achievements={achievements} stats={stats} darkMode={darkMode} />

      {/* Toast Notifications */}
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            borderRadius: '12px',
            padding: '16px',
            fontSize: '14px',
          }
        }}
      />
    </div>
  );
};

export default DashboardApp;
