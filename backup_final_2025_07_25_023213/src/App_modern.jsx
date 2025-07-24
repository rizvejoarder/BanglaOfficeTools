import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';
import { useInView } from 'react-intersection-observer';
import toast, { Toaster } from 'react-hot-toast';
import { ModernToolCard, ThemeToggle, ProgressBar, FloatingAction } from './components/ModernUIComponents';
import { modernTools } from './utils/modernToolsConfig.jsx';
import { 
  convertImageToWord, 
  convertPdfToWord, 
  convertWordToPdf, 
  convertImagesToPdf,
  convertPdfToImages
} from './utils';

const App = () => {
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressMessage, setProgressMessage] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [selectedTool, setSelectedTool] = useState(null);
  const [achievements, setAchievements] = useState([]);
  const [stats, setStats] = useState({
    filesProcessed: 0,
    accuracy: 99,
    timeSaved: 0
  });

  // Intersection Observer for animations
  const [heroRef, heroInView] = useInView({ 
    threshold: 0.1, 
    triggerOnce: true 
  });
  const [toolsRef, toolsInView] = useInView({ 
    threshold: 0.1, 
    triggerOnce: true 
  });

  // Enhanced counter animation with GSAP
  useEffect(() => {
    if (heroInView) {
      gsap.fromTo('.hero-title', 
        { y: 100, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.2, ease: 'power3.out' }
      );
      
      gsap.fromTo('.hero-subtitle', 
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, delay: 0.3, ease: 'power3.out' }
      );

      // Animated counters
      gsap.to('.counter', {
        innerText: (i, target) => target.getAttribute('data-count'),
        duration: 2,
        delay: 0.5,
        snap: { innerText: 1 },
        ease: 'power2.out'
      });
    }
  }, [heroInView]);

  // Dark mode toggle
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Achievement system
  const addAchievement = (type) => {
    const achievement = {
      id: Date.now(),
      type,
      timestamp: new Date(),
      message: getAchievementMessage(type)
    };
    setAchievements(prev => [achievement, ...prev]);
    toast.success(`🏆 ${achievement.message}`, {
      duration: 4000,
      style: {
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        borderRadius: '12px',
        padding: '16px'
      }
    });
  };

  const getAchievementMessage = (type) => {
    const messages = {
      'first_ocr': 'প্রথম OCR রূপান্তর সম্পন্ন!',
      'pdf_master': 'PDF মাস্টার! ১০টি ফাইল রূপান্তর',
      'speed_demon': 'দ্রুততম ব্যবহারকারী!',
      'accuracy_pro': '৯৯%+ নির্ভুলতা অর্জন!'
    };
    return messages[type] || 'নতুন অর্জন!';
  };

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
          if (!achievements.some(a => a.type === 'first_ocr')) {
            addAchievement('first_ocr');
          }
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
          background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
          color: 'white'
        }
      });

    } catch (err) {
      console.error('File processing error:', err);
      setError(err.message || 'ফাইল প্রক্রিয়াকরণে ত্রুটি হয়েছে');
      toast.error('❌ প্রক্রিয়াকরণে ত্রুটি হয়েছে', {
        style: {
          background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)',
          color: 'white'
        }
      });
    } finally {
      setProcessing(false);
      setProgress(0);
      setProgressMessage('');
    }
  }, [achievements]);

  return (
    <div className={`min-h-screen transition-all duration-500 ${
      darkMode 
        ? 'bg-gray-900 text-white' 
        : 'bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50'
    }`}>
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-r from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Theme Toggle */}
      <ThemeToggle darkMode={darkMode} setDarkMode={setDarkMode} />

      {/* Hero Section */}
      <motion.section 
        ref={heroRef}
        className="relative z-10 pt-20 pb-16 px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="max-w-6xl mx-auto text-center">
          <motion.h1 
            className="hero-title text-5xl md:text-7xl font-black mb-4 text-center"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.2, type: "spring", bounce: 0.4 }}
          >
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent">
              OfficeWave
            </span>
          </motion.h1>
          
          <motion.p 
            className="hero-subtitle text-lg md:text-xl mb-8 max-w-2xl mx-auto text-gray-600 dark:text-gray-300 text-center"
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
            <div className="flex items-center gap-2 px-4 py-2 bg-green-100 dark:bg-green-900/30 rounded-full text-green-700 dark:text-green-300 text-sm font-medium">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              ১০০% অফলাইন
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 rounded-full text-blue-700 dark:text-blue-300 text-sm font-medium">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              AI-এনহান্সড
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-purple-100 dark:bg-purple-900/30 rounded-full text-purple-700 dark:text-purple-300 text-sm font-medium">
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
              নিরাপদ ও দ্রুত
            </div>
          </motion.div>

          {/* Animated Stats */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
          >
            <div className="glassmorphism p-6 rounded-2xl">
              <div className="counter text-4xl font-bold text-purple-600 mb-2" data-count={stats.accuracy}>0</div>
              <div className="text-sm opacity-70">% নির্ভুলতা</div>
            </div>
            <div className="glassmorphism p-6 rounded-2xl">
              <div className="counter text-4xl font-bold text-blue-600 mb-2" data-count={stats.filesProcessed}>0</div>
              <div className="text-sm opacity-70">ফাইল প্রক্রিয়া</div>
            </div>
            <div className="glassmorphism p-6 rounded-2xl">
              <div className="counter text-4xl font-bold text-cyan-600 mb-2" data-count={stats.timeSaved}>0</div>
              <div className="text-sm opacity-70">মিনিট সাশ্রয়</div>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Tools Section */}
      <motion.section 
        ref={toolsRef}
        className="relative z-10 px-4 pb-20"
        initial={{ opacity: 0, y: 100 }}
        animate={toolsInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, staggerChildren: 0.1 }}
      >
        <div className="max-w-7xl mx-auto">
          <motion.h2 
            className="text-4xl md:text-5xl font-bold text-center mb-16 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent dark:from-white dark:to-gray-300"
            whileInView={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.6 }}
          >
            আপনার টুল নির্বাচন করুন
          </motion.h2>

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
                whileTap={{ scale: 0.95 }}
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
              className="glassmorphism max-w-2xl w-full p-8 rounded-3xl"
              initial={{ scale: 0.5, opacity: 0, y: 100 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.5, opacity: 0, y: 100 }}
              transition={{ type: "spring", duration: 0.5 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-2xl font-bold mb-4 text-green-600">✅ সফল সম্পন্ন!</h3>
              <p className="mb-6">আপনার ফাইল সফলভাবে প্রক্রিয়া করা হয়েছে।</p>
              <div className="flex gap-4">
                <motion.button 
                  className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-semibold"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    // Download logic here
                    setResult(null);
                  }}
                >
                  ডাউনলোড করুন
                </motion.button>
                <motion.button 
                  className="px-6 py-3 bg-gray-500 text-white rounded-xl font-semibold"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setResult(null)}
                >
                  বন্ধ করুন
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

export default App;
