import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { gsap } from 'gsap';
import { 
  TrendingUp, 
  Users, 
  Clock, 
  Target, 
  Database, 
  Activity,
  BarChart3,
  PieChart,
  Zap,
  Shield,
  Award,
  Rocket,
  Globe,
  Brain,
  CheckCircle,
  Download,
  Eye,
  MousePointer,
  Sparkles,
  ArrowRight,
  Play,
  FileText,
  Image,
  Layers,
  Workflow,
  Cpu
} from 'lucide-react';

// Enterprise Tool Card Component
export const EnterpriseToolCard = ({ tool, onFileUpload, processing, darkMode, index }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const fileInputRef = useRef(null);
  const cardRef = useRef(null);

  useEffect(() => {
    if (isHovered && cardRef.current) {
      gsap.to(cardRef.current, {
        y: -8,
        scale: 1.02,
        rotateX: 5,
        rotateY: 2,
        duration: 0.3,
        ease: 'power2.out'
      });
    } else if (cardRef.current) {
      gsap.to(cardRef.current, {
        y: 0,
        scale: 1,
        rotateX: 0,
        rotateY: 0,
        duration: 0.3,
        ease: 'power2.out'
      });
    }
  }, [isHovered]);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      onFileUpload(files, tool.id);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      onFileUpload(files, tool.id);
    }
  };

  return (
    <motion.div
      ref={cardRef}
      className={`relative group cursor-pointer transition-all duration-500 perspective-1000 ${
        processing ? 'pointer-events-none' : ''
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current?.click()}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-white via-blue-50/50 to-purple-50/50 dark:from-gray-800 dark:via-blue-900/20 dark:to-purple-900/20 rounded-3xl opacity-90 group-hover:opacity-100 transition-opacity" />
      
      {/* Animated Border */}
      <div className={`absolute inset-0 rounded-3xl transition-all duration-500 ${
        isDragOver 
          ? 'bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 p-1' 
          : 'bg-gradient-to-r from-gray-200/50 to-gray-300/50 dark:from-gray-700/50 dark:to-gray-600/50 p-px group-hover:from-blue-400/30 group-hover:via-purple-400/30 group-hover:to-cyan-400/30 group-hover:p-1'
      }`}>
        <div className="w-full h-full bg-white dark:bg-gray-800 rounded-3xl" />
      </div>

      {/* Card Content */}
      <div className="relative z-10 p-10 h-full flex flex-col items-center text-center">
        {/* Tool Icon */}
        <motion.div 
          className="mb-6 relative"
          animate={isHovered ? { scale: 1.1, rotate: 5 } : { scale: 1, rotate: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-white shadow-lg bg-gradient-to-r ${tool.gradient}`}>
            {React.createElement(tool.icon, { className: "w-8 h-8" })}
          </div>
          
          {/* Floating Particles */}
          <AnimatePresence>
            {isHovered && (
              <>
                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-1 h-1 bg-blue-400 rounded-full"
                    initial={{ 
                      opacity: 0,
                      x: 30,
                      y: 30,
                      scale: 0
                    }}
                    animate={{ 
                      opacity: [0, 1, 0],
                      x: Math.random() * 80 - 40,
                      y: Math.random() * 80 - 40,
                      scale: [0, 1, 0]
                    }}
                    transition={{ 
                      duration: 1.5,
                      delay: i * 0.1,
                      repeat: Infinity
                    }}
                  />
                ))}
              </>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Content */}
        <div className="space-y-6 flex flex-col items-center text-center">
          <motion.h3 
            className="text-2xl font-bold text-gray-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors"
            animate={isHovered ? { x: 5 } : { x: 0 }}
          >
            {tool.title}
          </motion.h3>
          
          <motion.p 
            className="text-gray-600 dark:text-gray-400 leading-relaxed"
            animate={isHovered ? { x: 5 } : { x: 0 }}
            transition={{ delay: 0.1 }}
          >
            {tool.description}
          </motion.p>

          {/* Features List */}
          <motion.div 
            className="space-y-3 flex flex-col items-center"
            animate={isHovered ? { opacity: 1, y: 0 } : { opacity: 0.8, y: 5 }}
          >
            {tool.features?.slice(0, 3).map((feature, idx) => (
              <motion.div 
                key={idx}
                className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + idx * 0.05 }}
              >
                <CheckCircle className="w-4 h-4 text-green-500" />
                {feature}
              </motion.div>
            ))}
          </motion.div>

          {/* Action Area */}
          <motion.div 
            className="pt-6 border-t border-gray-100 dark:border-gray-700 w-full"
            animate={isHovered ? { y: 0, opacity: 1 } : { y: 10, opacity: 0.7 }}
          >
            <div className="flex items-center justify-center">
              <span className="text-sm font-semibold text-blue-600 dark:text-blue-400 flex items-center gap-2">
                Click or drop files here
                <MousePointer className="w-4 h-4" />
              </span>
            </div>
          </motion.div>
        </div>

        {/* Processing Overlay */}
        <AnimatePresence>
          {processing && (
            <motion.div 
              className="absolute inset-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-3xl flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="flex flex-col items-center gap-3"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
                <span className="text-sm font-semibold text-blue-600">Processing...</span>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          multiple={tool.acceptMultiple}
          accept={tool.acceptedFormats?.join(',')}
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
    </motion.div>
  );
};

// Advanced Progress Bar Component
export const AdvancedProgressBar = ({ progress, message, darkMode }) => {
  const progressRef = useRef(null);

  useEffect(() => {
    if (progressRef.current) {
      gsap.to(progressRef.current, {
        width: `${progress}%`,
        duration: 0.5,
        ease: 'power2.out'
      });
    }
  }, [progress]);

  return (
    <motion.div 
      className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50"
      initial={{ opacity: 0, y: 100, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 100, scale: 0.8 }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
    >
      <div className={`px-8 py-6 rounded-2xl backdrop-blur-2xl border shadow-2xl min-w-96 ${
        darkMode 
          ? 'bg-gray-900/90 border-gray-700/50 text-white' 
          : 'bg-white/90 border-gray-200/50 text-gray-800'
      }`}>
        <div className="flex items-center gap-4 mb-4">
          <motion.div
            className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center"
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <Brain className="w-5 h-5 text-white" />
          </motion.div>
          <div className="flex-1">
            <div className="font-bold text-lg">AI Processing</div>
            <div className="text-sm opacity-75">{message || 'Analyzing document...'}</div>
          </div>
          <div className="text-2xl font-bold">
            {Math.round(progress)}%
          </div>
        </div>
        
        <div className="relative h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <motion.div
            ref={progressRef}
            className="absolute left-0 top-0 h-full bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 rounded-full"
            style={{ width: '0%' }}
          />
          <motion.div
            className="absolute left-0 top-0 h-full w-20 bg-gradient-to-r from-transparent via-white/30 to-transparent"
            animate={{ x: [-80, 400] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      </div>
    </motion.div>
  );
};

// Enterprise Stats Dashboard
export const EnterpriseStats = React.forwardRef(({ stats, inView, darkMode }, ref) => {
  const statsData = [
    { label: 'Files Processed', value: stats.filesProcessed, suffix: '+', icon: FileText, color: 'from-blue-500 to-cyan-500' },
    { label: 'Accuracy Rate', value: stats.accuracy, suffix: '%', icon: Target, color: 'from-green-500 to-emerald-500' },
    { label: 'Hours Saved', value: stats.timeSaved, suffix: '+', icon: Clock, color: 'from-purple-500 to-pink-500' },
    { label: 'Happy Users', value: stats.happyUsers, suffix: '+', icon: Users, color: 'from-orange-500 to-red-500' },
    { label: 'Data Processed', value: stats.dataProcessed, suffix: 'GB', icon: Database, color: 'from-indigo-500 to-blue-500' },
    { label: 'Success Rate', value: stats.successRate, suffix: '%', icon: CheckCircle, color: 'from-teal-500 to-cyan-500' },
    { label: 'Avg Speed', value: stats.avgProcessingTime, suffix: 's', icon: Zap, color: 'from-yellow-500 to-orange-500' },
    { label: 'Enterprise Ready', value: 100, suffix: '%', icon: Shield, color: 'from-rose-500 to-pink-500' }
  ];

  return (
    <motion.section 
      ref={ref}
      className="py-24 px-6 relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={inView ? { opacity: 1 } : {}}
      transition={{ duration: 1 }}
    >
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/2 right-1/4 w-64 h-64 bg-purple-400/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full text-blue-600 dark:text-blue-300 text-sm font-semibold mb-6"
            whileInView={{ scale: [0, 1] }}
            transition={{ duration: 0.5 }}
          >
            <BarChart3 className="w-4 h-4" />
            Real-time Analytics
          </motion.div>
          
          <motion.h2 
            className="text-5xl md:text-6xl font-black mb-6 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent dark:from-white dark:to-gray-300"
            whileInView={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.6 }}
          >
            Enterprise Performance
          </motion.h2>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8">
          {statsData.map((stat, index) => (
            <motion.div
              key={stat.label}
              className={`relative group p-8 rounded-3xl backdrop-blur-xl border transition-all duration-500 ${
                darkMode 
                  ? 'bg-gray-800/50 border-gray-700/50 hover:bg-gray-800/80' 
                  : 'bg-white/50 border-gray-200/50 hover:bg-white/80'
              }`}
              initial={{ opacity: 0, y: 100, rotateX: 45 }}
              animate={inView ? { opacity: 1, y: 0, rotateX: 0 } : {}}
              transition={{ 
                duration: 0.8, 
                delay: index * 0.1,
                type: "spring",
                stiffness: 80
              }}
              whileHover={{ y: -5, scale: 1.02 }}
            >
              {/* Background Gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-10 rounded-3xl transition-opacity duration-500`} />
              
              {/* Icon */}
              <motion.div 
                className={`w-12 h-12 rounded-2xl bg-gradient-to-r ${stat.color} flex items-center justify-center mb-4 shadow-lg`}
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ duration: 0.3 }}
              >
                <stat.icon className="w-6 h-6 text-white" />
              </motion.div>

              {/* Value */}
              <motion.div 
                className="text-4xl md:text-5xl font-black mb-2 text-gray-800 dark:text-white"
                data-count={stat.value}
                whileInView={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <span className="stat-counter">0</span>
                <span className="text-2xl md:text-3xl">{stat.suffix}</span>
              </motion.div>

              {/* Label */}
              <motion.p 
                className="stat-label text-gray-600 dark:text-gray-400 font-semibold text-sm md:text-base"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.5 + index * 0.1 }}
              >
                {stat.label}
              </motion.p>

              {/* Trend Indicator */}
              <motion.div 
                className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity"
                initial={{ scale: 0 }}
                whileHover={{ scale: 1 }}
              >
                <TrendingUp className="w-5 h-5 text-green-500" />
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
});

// Feature Showcase Component
export const FeatureShowcase = React.forwardRef(({ inView, darkMode }, ref) => {
  const features = [
    {
      title: 'AI-Powered Processing',
      description: 'Advanced machine learning algorithms ensure 99.8% accuracy in document conversion and text recognition.',
      icon: Brain,
      gradient: 'from-blue-500 to-cyan-500',
      points: ['Neural network OCR', 'Context-aware processing', 'Multi-language support']
    },
    {
      title: 'Enterprise Security',
      description: 'Bank-grade encryption and complete offline processing ensure your documents never leave your device.',
      icon: Shield,
      gradient: 'from-green-500 to-emerald-500',
      points: ['End-to-end encryption', 'Zero data retention', 'Compliance ready']
    },
    {
      title: 'Lightning Fast',
      description: 'Process documents 10x faster than traditional methods with our optimized algorithms.',
      icon: Zap,
      gradient: 'from-purple-500 to-pink-500',
      points: ['Parallel processing', 'GPU acceleration', 'Instant preview']
    },
    {
      title: 'Cloud Integration',
      description: 'Seamlessly connect with popular cloud storage services and collaboration platforms.',
      icon: Globe,
      gradient: 'from-orange-500 to-red-500',
      points: ['Multi-cloud support', 'Real-time sync', 'Team collaboration']
    }
  ];

  return (
    <motion.section 
      ref={ref}
      className="py-24 px-6 relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={inView ? { opacity: 1 } : {}}
      transition={{ duration: 1 }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-20">
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 bg-purple-50 dark:bg-purple-900/30 rounded-full text-purple-600 dark:text-purple-300 text-sm font-semibold mb-6"
            whileInView={{ scale: [0, 1] }}
            transition={{ duration: 0.5 }}
          >
            <Award className="w-4 h-4" />
            Premium Features
          </motion.div>
          
          <motion.h2 
            className="text-5xl md:text-6xl font-black mb-6 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent dark:from-white dark:to-gray-300"
            whileInView={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.6 }}
          >
            Why Choose OfficeWave?
          </motion.h2>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              className={`relative group p-10 rounded-3xl backdrop-blur-xl border transition-all duration-500 ${
                darkMode 
                  ? 'bg-gray-800/50 border-gray-700/50 hover:bg-gray-800/80' 
                  : 'bg-white/50 border-gray-200/50 hover:bg-white/80'
              }`}
              initial={{ opacity: 0, x: index % 2 === 0 ? -100 : 100 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ 
                duration: 0.8, 
                delay: index * 0.2,
                type: "spring",
                stiffness: 80
              }}
              whileHover={{ y: -5, scale: 1.02 }}
            >
              {/* Background Gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 rounded-3xl transition-opacity duration-500`} />
              
              {/* Icon */}
              <motion.div 
                className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${feature.gradient} flex items-center justify-center mb-6 shadow-lg`}
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ duration: 0.3 }}
              >
                <feature.icon className="w-8 h-8 text-white" />
              </motion.div>

              {/* Content */}
              <div className="space-y-6">
                <h3 className="text-3xl font-bold text-gray-800 dark:text-white">
                  {feature.title}
                </h3>
                
                <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                  {feature.description}
                </p>

                {/* Feature Points */}
                <div className="space-y-3">
                  {feature.points.map((point, idx) => (
                    <motion.div 
                      key={idx}
                      className="flex items-center gap-3"
                      initial={{ opacity: 0, x: -10 }}
                      animate={inView ? { opacity: 1, x: 0 } : {}}
                      transition={{ delay: 0.3 + index * 0.2 + idx * 0.1 }}
                    >
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700 dark:text-gray-300">{point}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
});

export default {
  EnterpriseToolCard,
  AdvancedProgressBar,
  EnterpriseStats,
  FeatureShowcase
};
