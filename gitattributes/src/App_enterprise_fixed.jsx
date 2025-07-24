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
  const [progressMessage, setProgressMessage] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [selectedTool, setSelectedTool] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [achievements, setAchievements] = useState([]);
  const [activeSection, setActiveSection] = useState('home');
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  const containerRef = useRef(null);
  const { scrollY } = useScroll();
  const backgroundY = useTransform(scrollY, [0, 500], [0, 150]);
  const backgroundOpacity = useTransform(scrollY, [0, 300], [1, 0.3]);

  const [stats, setStats] = useState({
    filesProcessed: 2847,
    accuracy: 99.8,
    timeSaved: 1250,
    happyUsers: 15420,
    dataProcessed: 450.7,
    successRate: 99.2,
    avgProcessingTime: 2.3
  });

  // Intersection Observer for animations
  const [heroRef, heroInView] = useInView({ threshold: 0.1, triggerOnce: true });
  const [statsRef, statsInView] = useInView({ threshold: 0.1, triggerOnce: true });
  const [toolsRef, toolsInView] = useInView({ threshold: 0.1, triggerOnce: true });
  const [featuresRef, featuresInView] = useInView({ threshold: 0.1, triggerOnce: true });

  // Mouse tracking for parallax effects
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ 
        x: (e.clientX / window.innerWidth) * 100, 
        y: (e.clientY / window.innerHeight) * 100 
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Enhanced GSAP animations
  useEffect(() => {
    if (statsInView) {
      // Animate counters with more sophisticated timing
      gsap.timeline()
        .to('.stat-counter', {
          innerText: (i, target) => target.getAttribute('data-count'),
          duration: 2.5,
          snap: { innerText: 1 },
          ease: 'power3.out',
          stagger: 0.15
        })
        .from('.stat-label', {
          opacity: 0,
          y: 20,
          duration: 0.8,
          stagger: 0.1
        }, '-=1.5');
    }
  }, [statsInView]);

  // Dark mode with system preference
  useEffect(() => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setDarkMode(prefersDark);

    const darkModeListener = (e) => setDarkMode(e.matches);
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', darkModeListener);
    
    return () => window.matchMedia('(prefers-color-scheme: dark)').removeEventListener('change', darkModeListener);
  }, []);

  // Animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: (i) => ({ 
      opacity: 1, 
      y: 0, 
      transition: { 
        delay: i * 0.1,
        duration: 0.7, 
        ease: [0.21, 0.5, 0.35, 1],
        opacity: { duration: 0.9 }
      }
    })
  };

  const fadeUpVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.8, ease: "easeOut" }
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  };

  // Simulated processing function
  const processFile = useCallback((tool, file) => {
    setProcessing(true);
    setProgress(0);
    setError(null);
    setResult(null);
    setProgressMessage('Initializing processing...');
    
    // Simulate progress updates
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 95) {
          clearInterval(interval);
          return 95;
        }
        const increment = Math.random() * 8 + 2;
        const newProgress = prev + increment;
        
        // Update messages based on progress
        if (newProgress > 20 && newProgress < 40) {
          setProgressMessage('Analyzing content structure...');
        } else if (newProgress > 40 && newProgress < 60) {
          setProgressMessage('Applying OCR technology...');
        } else if (newProgress > 60 && newProgress < 80) {
          setProgressMessage('Processing Bengali characters...');
        } else if (newProgress > 80) {
          setProgressMessage('Finalizing document...');
        }
        
        return Math.min(newProgress, 95);
      });
    }, 500);
    
    // Simulate completion after delay
    setTimeout(() => {
      clearInterval(interval);
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
        title: `Processed ${file?.name || 'document'} with ${tool}`,
        timestamp: new Date().toISOString(),
        points: Math.floor(Math.random() * 50) + 50
      };
      setAchievements(prev => [newAchievement, ...prev].slice(0, 10));
      
    }, 5000);
  }, [darkMode]);

  // Hero text animation ref
  const heroTextAnimation = useRef(null);

  // Hero text animation effect
  useEffect(() => {
    if (heroInView && heroTextAnimation.current) {
      const text = heroTextAnimation.current;
      gsap.fromTo(
        text.querySelectorAll('.animate-char'),
        { opacity: 0, y: 20 },
        { 
          opacity: 1, 
          y: 0, 
          stagger: 0.03,
          delay: 0.3,
          duration: 0.8,
          ease: "power3.out" 
        }
      );
    }
  }, [heroInView, heroTextAnimation]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-purple-100 text-gray-900 dark:text-white flex flex-col">
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
      <section className="relative pt-32 pb-24 px-6 flex flex-col items-center justify-center glass-morphism rounded-3xl shadow-enterprise mx-auto max-w-5xl">
        <h1 className="text-7xl font-extrabold bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent mb-6 drop-shadow-lg">
          OfficeWave
        </h1>
        <p className="text-2xl font-medium text-gray-700 dark:text-gray-300 mb-8 max-w-2xl text-center">
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

      {/* Services Section with Glassmorphic Cards */}
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
            {/* Service 1 */}
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

            {/* Service 2 */}
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

            {/* Service 3 */}
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

            {/* Service 4 */}
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

            {/* Service 5 */}
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

            {/* Service 6 */}
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
            initial={{ opacity: 0, y: 50 }}
          </div>
        </div>

      {/* Features Section */}
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
            {/* Feature 1 */}
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

            {/* Feature 2 */}
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

            {/* Feature 3 */}
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

            {/* Feature 4 */}
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

            {/* Feature 5 */}
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

            {/* Feature 6 */}
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
              className="rounded-3xl p-0.5 bg-gradient-to-br from-purple-500 to-pink-500 shadow-enterprise hover:shadow-xl transition-all duration-300"
              whileHover={{ scale: 1.02 }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="bg-white dark:bg-gray-900 h-full rounded-[22px] p-8">
                <Zap className="w-10 h-10 text-yellow-500 mb-4" />
                <h3 className="text-xl font-bold mb-3">Lightning Fast</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Process documents in seconds with our optimized cloud infrastructure and parallel processing
                </p>
              </div>
            </motion.div>

            {/* Feature 3 */}
            <motion.div 
              className="rounded-3xl p-0.5 bg-gradient-to-br from-pink-500 to-red-500 shadow-enterprise hover:shadow-xl transition-all duration-300"
              whileHover={{ scale: 1.02 }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="bg-white dark:bg-gray-900 h-full rounded-[22px] p-8">
                <Globe className="w-10 h-10 text-blue-500 mb-4" />
                <h3 className="text-xl font-bold mb-3">Multiple Dialects</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Support for all Bengali dialects and variations, including traditional and modern forms
                </p>
              </div>
            </motion.div>

            {/* Feature 4 */}
            <motion.div 
              className="rounded-3xl p-0.5 bg-gradient-to-br from-red-500 to-orange-500 shadow-enterprise hover:shadow-xl transition-all duration-300"
              whileHover={{ scale: 1.02 }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <div className="bg-white dark:bg-gray-900 h-full rounded-[22px] p-8">
                <Database className="w-10 h-10 text-purple-500 mb-4" />
                <h3 className="text-xl font-bold mb-3">Scalable Storage</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Store and manage thousands of documents with our enterprise-grade cloud storage solution
                </p>
              </div>
            </motion.div>

            {/* Feature 5 */}
            <motion.div 
              className="rounded-3xl p-0.5 bg-gradient-to-br from-orange-500 to-yellow-500 shadow-enterprise hover:shadow-xl transition-all duration-300"
              whileHover={{ scale: 1.02 }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <div className="bg-white dark:bg-gray-900 h-full rounded-[22px] p-8">
                <Users className="w-10 h-10 text-cyan-500 mb-4" />
                <h3 className="text-xl font-bold mb-3">Team Collaboration</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Share documents and collaborate with team members in real-time with version control
                </p>
              </div>
            </motion.div>

            {/* Feature 6 */}
            <motion.div 
              className="rounded-3xl p-0.5 bg-gradient-to-br from-yellow-500 to-green-500 shadow-enterprise hover:shadow-xl transition-all duration-300"
              whileHover={{ scale: 1.02 }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <div className="bg-white dark:bg-gray-900 h-full rounded-[22px] p-8">
                <Lock className="w-10 h-10 text-red-500 mb-4" />
                <h3 className="text-xl font-bold mb-3">Enterprise Security</h3>
                <p className="text-gray-600 dark:text-gray-300">
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
        className="py-24 px-6 max-w-7xl mx-auto w-full"
      >
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent">
            Trusted by Industry Leaders
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Our platform is used by thousands of businesses to process millions of documents
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 justify-items-center">
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2 stat-counter" data-count="15000+">0</div>
            <div className="text-gray-600 dark:text-gray-300 stat-label">Happy Users</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-purple-600 dark:text-purple-400 mb-2 stat-counter" data-count="2.5M+">0</div>
            <div className="text-gray-600 dark:text-gray-300 stat-label">Documents Processed</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-pink-600 dark:text-pink-400 mb-2 stat-counter" data-count="99.8%">0</div>
            <div className="text-gray-600 dark:text-gray-300 stat-label">Accuracy Rate</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-teal-600 dark:text-teal-400 mb-2 stat-counter" data-count="24/7">0</div>
            <div className="text-gray-600 dark:text-gray-300 stat-label">Customer Support</div>
          </div>
        </div>

        <div className="mt-20 rounded-3xl overflow-hidden shadow-enterprise">
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 p-10 text-white">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
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
                <div className="relative">
                  <Star className="w-20 h-20 text-yellow-300 absolute -top-4 -right-4 rotate-12" />
                  <div className="text-7xl font-bold">4.9</div>
                  <div className="text-xl">Customer Rating</div>
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
