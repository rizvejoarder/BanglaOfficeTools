import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Upload, 
  FileText, 
  Image, 
  Download, 
  Sparkles, 
  Zap, 
  Award,
  Sun,
  Moon,
  TrendingUp,
  Clock,
  Target,
  BarChart3,
  Brain,
  Layers
} from 'lucide-react';

// Modern Tool Card Component with Dashboard Style
export const ModernToolCard = ({ tool, onFileUpload, processing, darkMode }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    handleFiles(files);
  };

  const handleFiles = (files) => {
    setUploadedFiles(files);
    onFileUpload(files, tool.id);
  };

  const getIcon = (iconName) => {
    const iconProps = { className: "w-7 h-7 text-white" };
    
    switch(iconName) {
      case 'brain': return <Brain {...iconProps} />;
      case 'file-text': return <FileText {...iconProps} />;
      case 'image': return <Image {...iconProps} />;
      case 'layers': return <Layers {...iconProps} />;
      case 'download': return <Download {...iconProps} />;
      case 'sparkles': return <Sparkles {...iconProps} />;
      default: return <FileText {...iconProps} />;
    }
  };

  return (
    <motion.div
      className={`relative group h-96 ${processing ? 'pointer-events-none' : ''}`}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      {/* Hover Glow Effect */}
      <div className={`absolute -inset-1 bg-gradient-to-r ${tool.gradient} rounded-3xl blur opacity-0 group-hover:opacity-30 transition duration-500`}></div>
      
      {/* Main Card */}
      <div 
        className={`relative h-full rounded-3xl backdrop-blur-xl transition-all duration-500 cursor-pointer overflow-hidden ${
          isDragOver 
            ? 'border-blue-400 bg-blue-50/90 dark:bg-blue-900/30 scale-105' 
            : darkMode 
              ? 'border-gray-700/50 bg-gray-800/90 hover:bg-gray-800/95 border' 
              : 'border-gray-200/50 bg-white/90 hover:bg-white/95 border shadow-xl'
        } ${processing ? 'opacity-50' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !processing && fileInputRef.current?.click()}
      >
        {/* Header Section */}
        <div className="p-6 pb-4">
          <div className="flex items-start justify-between mb-4">
            <motion.div 
              className={`p-4 rounded-2xl bg-gradient-to-br ${tool.gradient} shadow-lg`}
              whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
              transition={{ duration: 0.5 }}
            >
              {getIcon(tool.icon)}
            </motion.div>
            {tool.isNew && (
              <motion.div 
                className="px-3 py-1 bg-gradient-to-r from-yellow-400 to-orange-400 text-xs font-bold rounded-full text-white shadow-lg"
                initial={{ scale: 0, rotate: -45 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
              >
                নতুন!
              </motion.div>
            )}
          </div>

          <h3 className="text-xl font-bold mb-2 text-gray-800 dark:text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text group-hover:from-purple-600 group-hover:to-blue-600 transition-all duration-300">
            {tool.title}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
            {tool.description}
          </p>

          {/* Accuracy Badge */}
          <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center gap-1 px-3 py-1 bg-green-100 dark:bg-green-900/30 rounded-full">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-xs font-semibold text-green-700 dark:text-green-300">
                {tool.accuracy}% নির্ভুল
              </span>
            </div>
            <div className="flex items-center gap-1 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 rounded-full">
              <Clock className="w-3 h-3 text-blue-600" />
              <span className="text-xs font-semibold text-blue-700 dark:text-blue-300">
                {tool.processingTime}
              </span>
            </div>
          </div>
        </div>

        {/* Upload Area */}
        <div className="px-6 pb-6 flex-1 flex flex-col justify-end">
          <motion.div 
            className={`p-6 rounded-2xl border-2 border-dashed transition-all ${
              isDragOver 
                ? 'border-blue-400 bg-blue-50/50 dark:bg-blue-900/20 scale-105' 
                : 'border-gray-300/50 hover:border-gray-400/70 dark:border-gray-600/50 dark:hover:border-gray-500/70'
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="text-center">
              <motion.div
                animate={isDragOver ? { scale: [1, 1.2, 1] } : {}}
                transition={{ duration: 0.5, repeat: isDragOver ? Infinity : 0 }}
              >
                <Upload className="w-8 h-8 mx-auto mb-3 text-gray-400" />
              </motion.div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                {processing ? 'প্রক্রিয়াকরণ চলছে...' : 'ক্লিক বা ড্র্যাগ করুন'}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500">
                {tool.supportedFormats.join(', ')} • Max {tool.maxSize}
              </p>
            </div>
          </motion.div>

          {/* Hidden File Input */}
          <input
            ref={fileInputRef}
            type="file"
            multiple={tool.multiple}
            accept={tool.accept}
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>

        {/* Processing Overlay */}
        <AnimatePresence>
          {processing && (
            <motion.div 
              className="absolute inset-0 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-3xl flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="text-center">
                <motion.div 
                  className="w-12 h-12 border-3 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
                <p className="text-lg font-semibold text-gray-800 dark:text-white mb-1">Processing...</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Please wait</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

// Theme Toggle Component
export const ThemeToggle = ({ darkMode, setDarkMode }) => {
  return (
    <motion.button
      className="fixed top-6 right-6 z-50 p-3 rounded-2xl backdrop-blur-xl border border-white/20 bg-white/20 hover:bg-white/30 transition-all"
      onClick={() => setDarkMode(!darkMode)}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
    >
      <AnimatePresence mode="wait">
        {darkMode ? (
          <motion.div
            key="sun"
            initial={{ rotate: -180, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 180, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Sun className="w-5 h-5 text-yellow-500" />
          </motion.div>
        ) : (
          <motion.div
            key="moon"
            initial={{ rotate: 180, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: -180, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Moon className="w-5 h-5 text-blue-600" />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
};

// Progress Bar Component
export const ProgressBar = ({ progress, message, darkMode }) => {
  return (
    <motion.div 
      className="fixed bottom-6 left-6 right-6 z-50"
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
      transition={{ type: "spring", stiffness: 200 }}
    >
      <div className={`backdrop-blur-xl rounded-2xl p-6 border ${
        darkMode ? 'bg-gray-800/80 border-gray-700' : 'bg-white/80 border-white/50'
      }`}>
        <div className="flex items-center justify-between mb-3">
          <p className="font-medium">{message || 'প্রক্রিয়াকরণ চলছে...'}</p>
          <span className="text-sm font-mono">{Math.round(progress)}%</span>
        </div>
        
        <div className="relative h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <motion.div 
            className="absolute left-0 top-0 h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          />
          
          {/* Shimmer effect */}
          <motion.div 
            className="absolute top-0 h-full w-20 bg-gradient-to-r from-transparent via-white/30 to-transparent"
            animate={{ x: [-80, 300] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      </div>
    </motion.div>
  );
};

// Floating Action Button
export const FloatingAction = ({ achievements, stats, darkMode }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            className={`absolute bottom-16 right-0 w-80 p-6 rounded-2xl backdrop-blur-xl border ${
              darkMode ? 'bg-gray-800/90 border-gray-700' : 'bg-white/90 border-white/50'
            }`}
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
          >
            <h3 className="font-bold text-lg mb-4 flex items-center">
              <Award className="w-5 h-5 mr-2 text-yellow-500" />
              আপনার পরিসংখ্যান
            </h3>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <FileText className="w-4 h-4 mr-2 text-blue-500" />
                  <span className="text-sm">ফাইল প্রক্রিয়া</span>
                </div>
                <span className="font-bold">{stats.filesProcessed}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Target className="w-4 h-4 mr-2 text-green-500" />
                  <span className="text-sm">নির্ভুলতা</span>
                </div>
                <span className="font-bold">{stats.accuracy}%</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-2 text-purple-500" />
                  <span className="text-sm">সময় সাশ্রয়</span>
                </div>
                <span className="font-bold">{stats.timeSaved} মিনিট</span>
              </div>
            </div>

            {achievements.length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <h4 className="font-semibold text-sm mb-2">সাম্প্রতিক অর্জন</h4>
                <div className="space-y-2">
                  {achievements.slice(0, 3).map((achievement) => (
                    <div key={achievement.id} className="text-xs p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                      🏆 {achievement.message}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        className={`w-14 h-14 rounded-2xl backdrop-blur-xl border-2 flex items-center justify-center ${
          darkMode 
            ? 'bg-gray-800/80 border-gray-600 hover:bg-gray-700/80' 
            : 'bg-white/80 border-white/50 hover:bg-white/90'
        }`}
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        animate={{ rotate: isOpen ? 180 : 0 }}
      >
        <BarChart3 className="w-6 h-6 text-purple-600" />
        
        {/* Notification Badge */}
        {achievements.length > 0 && (
          <motion.div 
            className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-xs text-white font-bold"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring" }}
          >
            {achievements.length}
          </motion.div>
        )}
      </motion.button>
    </div>
  );
};
