import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { gsap } from 'gsap';
import { useInView } from 'react-intersection-observer';
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
  Award,
  ChevronRight,
  Eye,
  Target,
  Cpu,
  Database,
  Lock,
  Rocket,
  Activity,
  PieChart,
  LineChart,
  MousePointer,
  Settings,
  Menu,
  X
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { EnterpriseToolCard, AdvancedProgressBar, EnterpriseStats, FeatureShowcase } from './components/EnterpriseComponents';
import { modernTools } from './utils/modernToolsConfig.jsx';
import { 
  convertImageToWord, 
  convertPdfToWord, 
  convertWordToPdf, 
  convertImagesToPdf,
  convertPdfToImages
} from './utils';

const EnterpriseApp = () => {
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [achievements, setAchievements] = useState([]);
  const [heroRef, heroInView] = useInView({ threshold: 0.3 });
  const [statsRef, statsInView] = useInView({ threshold: 0.3 });

  const handleFileUpload = useCallback(async (files, tool) => {
    if (!files || files.length === 0) return;
    
    setProcessing(true);
    setProgress(0);
    setResult(null);
    
    // Enhanced progress simulation
    const progressSteps = [10, 25, 50, 75, 90, 100];
    
    for (let i = 0; i < progressSteps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 800));
      setProgress(progressSteps[i]);
    }
    
    setTimeout(() => {
      setProgress(100);
      setProcessing(false);
      
      // Success notification
      toast.success('Processing completed successfully!', {
        icon: '🎉',
        style: {
          borderRadius: '12px',
          background: darkMode ? '#1E293B' : '#fff',
          color: darkMode ? '#fff' : '#334155',
          border: darkMode ? '1px solid #334155' : '1px solid #E2E8F0'
        },
      });
      
      // Simulate result based on tool
      if (tool === 'imageToWord') {
        setResult({
          type: 'word',
          name: 'converted_document.docx',
          url: '#',
          previewText: 'Document converted successfully with 99.8% accuracy.'
        });
      } else if (tool === 'pdfToWord') {
        setResult({
          type: 'word',
          name: 'extracted_content.docx',
          url: '#',
          previewText: 'PDF content extracted to Word format.'
        });
      } else if (tool === 'imageToPdf') {
        setResult({
          type: 'pdf',
          name: 'combined_images.pdf',
          url: '#',
          previewText: 'Images combined into a single PDF document.'
        });
      }
      
      // Record achievement
      const newAchievement = {
        id: Date.now(),
        title: `Processed ${files[0]?.name || 'document'} with ${tool}`,
        timestamp: new Date().toISOString(),
        points: Math.floor(Math.random() * 50) + 50
      };
      setAchievements(prev => [newAchievement, ...prev].slice(0, 10));
      
    }, 5000);
  }, [darkMode]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 text-gray-900 dark:text-white flex flex-col">
      {/* Simple Header with Brand and Tagline */}
      <header className="sticky top-0 z-50 glass-morphism backdrop-blur-xl border-b border-gray-200 dark:border-gray-800 px-6 py-4 flex items-center justify-between shadow-enterprise">
        <div className="flex items-center gap-3">
          <span className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 flex items-center justify-center shadow-lg">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
          </span>
          <span className="text-2xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent">OfficeWave</span>
        </div>
        <span className="text-base font-medium text-gray-600 dark:text-gray-300">AI Document Tools for Modern Offices</span>
      </header>

      {/* Premium Glassmorphic Hero Section */}
      <section ref={heroRef} className="relative pt-32 pb-24 px-6 flex flex-col items-center justify-center glass-morphism rounded-3xl shadow-enterprise mx-auto max-w-5xl my-8">
        <h1 className="text-7xl font-extrabold bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent mb-6 drop-shadow-lg text-center">
          OfficeWave
        </h1>
        <p className="text-2xl font-medium text-gray-700 dark:text-gray-300 mb-8 max-w-2xl text-center leading-relaxed">
          Transform your documents with AI-powered Bengali office tools designed for the modern workplace
        </p>
        <div className="flex gap-4 mb-12">
          <motion.button 
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-8 rounded-full font-semibold shadow-xl hover:shadow-blue-500/30 hover:scale-105 transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            Explore Tools
          </motion.button>
        </div>
        
        {/* Floating 3D elements */}
        <motion.div 
          className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0"
          style={{ opacity: 0.7 }}
        >
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-24 h-24 rounded-2xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-md"
              initial={{ 
                x: Math.random() * 100 - 50 + '%', 
                y: Math.random() * 100 - 50 + '%',
                rotate: Math.random() * 180 - 90,
                scale: Math.random() * 0.5 + 0.5
              }}
              animate={{ 
                x: [
                  Math.random() * 100 - 50 + '%', 
                  Math.random() * 100 - 50 + '%', 
                  Math.random() * 100 - 50 + '%'
                ],
                y: [
                  Math.random() * 100 - 50 + '%', 
                  Math.random() * 100 - 50 + '%', 
                  Math.random() * 100 - 50 + '%'
                ],
                rotate: [
                  Math.random() * 180 - 90,
                  Math.random() * 180 - 90,
                  Math.random() * 180 - 90
                ]
              }}
              transition={{ 
                duration: 20 + Math.random() * 10, 
                repeat: Infinity,
                repeatType: 'reverse',
                ease: 'easeInOut'
              }}
              style={{
                boxShadow: '0 8px 32px rgba(100, 100, 255, 0.1)'
              }}
            />
          ))}
        </motion.div>
      </section>

      {/* Services Section with Enhanced Layout */}
      <section className="py-32 px-8">
        <div className="max-w-8xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent">
              Our Premium Services
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Advanced tools powered by artificial intelligence for seamless document processing
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 justify-items-center max-w-7xl mx-auto">
            {/* Service 1 - Intelligent OCR */}
            <motion.div 
              className="group w-full max-w-sm"
              whileHover={{ scale: 1.03, y: -8 }}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="bg-white dark:bg-gray-900 h-full rounded-2xl p-12 border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <Brain className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Intelligent OCR</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-10 flex-grow leading-relaxed text-base">
                  Advanced Bengali character recognition with 99.8% accuracy, powered by machine learning algorithms
                </p>
                <motion.div 
                  className="flex justify-center items-center text-blue-600 dark:text-blue-400 font-semibold"
                  whileHover={{ x: 5 }}
                >
                  <span>Learn more</span>
                  <ArrowRight className="w-5 h-5 ml-2" />
                </motion.div>
              </div>
            </motion.div>

            {/* Service 2 - Document Conversion */}
            <motion.div 
              className="group w-full max-w-sm"
              whileHover={{ scale: 1.03, y: -8 }}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="bg-white dark:bg-gray-900 h-full rounded-2xl p-12 border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <FileText className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Document Conversion</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-10 flex-grow leading-relaxed text-base">
                  Seamlessly convert between PDF, Word, and image formats while preserving Bengali text formatting
                </p>
                <motion.div 
                  className="flex justify-center items-center text-purple-600 dark:text-purple-400 font-semibold"
                  whileHover={{ x: 5 }}
                >
                  <span>Learn more</span>
                  <ArrowRight className="w-5 h-5 ml-2" />
                </motion.div>
              </div>
            </motion.div>

            {/* Service 3 - Text Enhancement */}
            <motion.div 
              className="group w-full max-w-sm"
              whileHover={{ scale: 1.03, y: -8 }}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="bg-white dark:bg-gray-900 h-full rounded-2xl p-12 border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-pink-500 to-red-500 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Text Enhancement</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-10 flex-grow leading-relaxed text-base">
                  Automatic spell checking and correction for Bengali text with contextual understanding
                </p>
                <motion.div 
                  className="flex justify-center items-center text-pink-600 dark:text-pink-400 font-semibold"
                  whileHover={{ x: 5 }}
                >
                  <span>Learn more</span>
                  <ArrowRight className="w-5 h-5 ml-2" />
                </motion.div>
              </div>
            </motion.div>

            {/* Service 4 - Batch Processing */}
            <motion.div 
              className="group w-full max-w-sm"
              whileHover={{ scale: 1.03, y: -8 }}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <div className="bg-white dark:bg-gray-900 h-full rounded-2xl p-12 border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-orange-500 to-yellow-500 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <Layers className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Batch Processing</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-10 flex-grow leading-relaxed text-base">
                  Process multiple documents simultaneously with our powerful cloud-based infrastructure
                </p>
                <motion.div 
                  className="flex justify-center items-center text-orange-600 dark:text-orange-400 font-semibold"
                  whileHover={{ x: 5 }}
                >
                  <span>Learn more</span>
                  <ArrowRight className="w-5 h-5 ml-2" />
                </motion.div>
              </div>
            </motion.div>

            {/* Service 5 - Format Preservation */}
            <motion.div 
              className="group w-full max-w-sm"
              whileHover={{ scale: 1.03, y: -8 }}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <div className="bg-white dark:bg-gray-900 h-full rounded-2xl p-12 border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <Download className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Format Preservation</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-10 flex-grow leading-relaxed text-base">
                  Maintain your document's original formatting, layout, and styling during conversion
                </p>
                <motion.div 
                  className="flex justify-center items-center text-green-600 dark:text-green-400 font-semibold"
                  whileHover={{ x: 5 }}
                >
                  <span>Learn more</span>
                  <ArrowRight className="w-5 h-5 ml-2" />
                </motion.div>
              </div>
            </motion.div>

            {/* Service 6 - Secure Processing */}
            <motion.div 
              className="group w-full max-w-sm"
              whileHover={{ scale: 1.03, y: -8 }}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <div className="bg-white dark:bg-gray-900 h-full rounded-2xl p-12 border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Secure Processing</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-10 flex-grow leading-relaxed text-base">
                  End-to-end encryption and privacy-focused document processing for sensitive information
                </p>
                <motion.div 
                  className="flex justify-center items-center text-cyan-600 dark:text-cyan-400 font-semibold"
                  whileHover={{ x: 5 }}
                >
                  <span>Learn more</span>
                  <ArrowRight className="w-5 h-5 ml-2" />
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Enhanced Features Section */}
      <section className="py-32 px-8">
        <div className="max-w-8xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent">
              Enterprise-Grade Features
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Designed for businesses that need reliable, efficient document processing solutions
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 justify-items-center max-w-7xl mx-auto">
            {/* Feature 1 - 99.8% Accuracy */}
            <motion.div 
              className="group w-full max-w-sm"
              whileHover={{ scale: 1.03, y: -8 }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="bg-white dark:bg-gray-900 h-full rounded-2xl p-12 border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <CheckCircle className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">99.8% Accuracy</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-10 flex-grow leading-relaxed text-base">
                  Our advanced OCR algorithms ensure almost perfect recognition of Bengali characters in all documents
                </p>
              </div>
            </motion.div>

            {/* Feature 2 - Lightning Fast */}
            <motion.div 
              className="group w-full max-w-sm"
              whileHover={{ scale: 1.03, y: -8 }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="bg-white dark:bg-gray-900 h-full rounded-2xl p-12 border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-yellow-500 to-orange-500 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Lightning Fast</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-10 flex-grow leading-relaxed text-base">
                  Process documents in seconds with our optimized cloud infrastructure and parallel processing
                </p>
              </div>
            </motion.div>

            {/* Feature 3 - Multiple Dialects */}
            <motion.div 
              className="group w-full max-w-sm"
              whileHover={{ scale: 1.03, y: -8 }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="bg-white dark:bg-gray-900 h-full rounded-2xl p-12 border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <Globe className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Multiple Dialects</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-10 flex-grow leading-relaxed text-base">
                  Support for all Bengali dialects and variations, including traditional and modern forms
                </p>
              </div>
            </motion.div>

            {/* Feature 4 - Scalable Storage */}
            <motion.div 
              className="group w-full max-w-sm"
              whileHover={{ scale: 1.03, y: -8 }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <div className="bg-white dark:bg-gray-900 h-full rounded-2xl p-12 border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <Database className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Scalable Storage</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-10 flex-grow leading-relaxed text-base">
                  Store and manage thousands of documents with our enterprise-grade cloud storage solution
                </p>
              </div>
            </motion.div>

            {/* Feature 5 - Team Collaboration */}
            <motion.div 
              className="group w-full max-w-sm"
              whileHover={{ scale: 1.03, y: -8 }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <div className="bg-white dark:bg-gray-900 h-full rounded-2xl p-12 border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-cyan-500 to-teal-500 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Team Collaboration</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-10 flex-grow leading-relaxed text-base">
                  Share documents and collaborate with team members in real-time with version control
                </p>
              </div>
            </motion.div>

            {/* Feature 6 - Enterprise Security */}
            <motion.div 
              className="group w-full max-w-sm"
              whileHover={{ scale: 1.03, y: -8 }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <div className="bg-white dark:bg-gray-900 h-full rounded-2xl p-12 border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-red-500 to-pink-500 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <Lock className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Enterprise Security</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-10 flex-grow leading-relaxed text-base">
                  SOC 2 compliant with 256-bit encryption, role-based access control, and audit logs
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section 
        ref={statsRef}
        className="py-32 px-8"
      >
        <div className="max-w-8xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent">
              Trusted by Industry Leaders
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Our platform is used by thousands of businesses to process millions of documents
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 max-w-6xl mx-auto">
            <div className="text-center bg-white dark:bg-gray-900 rounded-2xl p-8 border border-gray-200 dark:border-gray-700 shadow-lg">
              <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-3 stat-counter" data-count="15000+">15000+</div>
              <div className="text-gray-600 dark:text-gray-300 stat-label font-medium">Happy Users</div>
            </div>
            <div className="text-center bg-white dark:bg-gray-900 rounded-2xl p-8 border border-gray-200 dark:border-gray-700 shadow-lg">
              <div className="text-4xl font-bold text-purple-600 dark:text-purple-400 mb-3 stat-counter" data-count="2.5M+">3M+</div>
              <div className="text-gray-600 dark:text-gray-300 stat-label font-medium">Documents Processed</div>
            </div>
            <div className="text-center bg-white dark:bg-gray-900 rounded-2xl p-8 border border-gray-200 dark:border-gray-700 shadow-lg">
              <div className="text-4xl font-bold text-pink-600 dark:text-pink-400 mb-3 stat-counter" data-count="99.8%">100%</div>
              <div className="text-gray-600 dark:text-gray-300 stat-label font-medium">Accuracy Rate</div>
            </div>
            <div className="text-center bg-white dark:bg-gray-900 rounded-2xl p-8 border border-gray-200 dark:border-gray-700 shadow-lg">
              <div className="text-4xl font-bold text-teal-600 dark:text-teal-400 mb-3 stat-counter" data-count="24/7">24</div>
              <div className="text-gray-600 dark:text-gray-300 stat-label font-medium">Customer Support</div>
            </div>
          </div>

          <div className="mt-20 rounded-3xl overflow-hidden shadow-enterprise max-w-6xl mx-auto">
            <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 p-12 text-white">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div className="text-center md:text-left">
                  <h3 className="text-3xl font-bold mb-4">Ready to transform your document workflow?</h3>
                  <p className="text-xl opacity-90 mb-6">Join thousands of satisfied businesses using our platform</p>
                  <motion.button 
                    className="bg-white text-blue-600 py-3 px-8 rounded-full font-semibold hover:bg-opacity-90 transition-all"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Get Started Today
                  </motion.button>
                </div>
                <div className="flex justify-center md:justify-end">
                  <div className="relative text-center">
                    <Star className="w-20 h-20 text-yellow-300 absolute -top-4 -right-4 rotate-12" />
                    <div className="text-7xl font-bold">4.9</div>
                    <div className="text-xl">Customer Rating</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Toast notification container */}
      <Toaster position="bottom-right" />
    </div>
  );
};

export default EnterpriseApp;
