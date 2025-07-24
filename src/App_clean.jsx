import React, { useState, useRef, useCallback } from 'react';
import { 
  Upload, FileText, Download, Share2, Trash2, 
  ScanLine, ImageIcon, Layers, FileDown, FileUp,
  ArrowRight, Users, Star, Award, TrendingUp,
  Github, Mail, Heart
} from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

// Import utilities
import { convertImageToWord } from './utils/imageToWord';
import { convertPdfToImages } from './utils/pdfToImage';
import { convertImagesToPdf } from './utils/imageToPdf';
import { convertPdfToWord } from './utils/pdfToWord';
import { convertWordToPdf } from './utils/wordToPdf';
import fileStorage from './utils/fileStorage';

function App() {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState(null);
  const [currentTool, setCurrentTool] = useState(null);
  const fileInputRef = useRef(null);

  // Tool icon mapping
  const getToolIcon = (toolId) => {
    const iconProps = { className: "w-8 h-8 text-white" };
    switch(toolId) {
      case 'image-to-word': return <ScanLine {...iconProps} />;
      case 'pdf-to-image': return <ImageIcon {...iconProps} />;
      case 'images-to-pdf': return <Layers {...iconProps} />;
      case 'pdf-to-word': return <FileDown {...iconProps} />;
      case 'word-to-pdf': return <FileUp {...iconProps} />;
      default: return <FileText {...iconProps} />;
    }
  };

  // Main Bengali tools configuration
  const bengaliTools = [
    {
      id: 'image-to-word',
      title: 'ছবি থেকে ওয়ার্ড',
      subtitle: 'প্রধান ফিচার - AI-Enhanced OCR',
      description: 'বাংলা ছবি থেকে সম্পাদনাযোগ্য Word ডকুমেন্ট - 99%+ নির্ভুলতা',
      gradient: 'from-blue-500 to-indigo-600',
      accept: '.jpg,.jpeg,.png,.webp',
      multiple: false,
      features: [
        '99%+ নির্ভুল বাংলা OCR',
        'রিয়েল-টাইম প্রিভিউ', 
        'স্মার্ট ইমেজ এনহান্সমেন্ট',
        'বিজয় ইউনিকোড সাপোর্ট',
        'ইনস্ট্যান্ট ডাউনলোড'
      ]
    },
    {
      id: 'pdf-to-image',
      title: 'PDF থেকে ছবি',
      subtitle: '4K রেজোলিউশন সাপোর্ট',
      description: 'PDF ফাইলকে উচ্চ মানের ছবিতে রূপান্তর - 4K রেজোলিউশন সাপোর্ট',
      gradient: 'from-green-500 to-emerald-600',
      accept: '.pdf',
      multiple: false,
      features: [
        '4K রেজোলিউশন আউটপুট',
        'ব্যাচ প্রক্রিয়াকরণ',
        'কাস্টম DPI সেটিংস',
        'ZIP ডাউনলোড',
        'ফাস্ট রেন্ডারিং'
      ]
    },
    {
      id: 'images-to-pdf',
      title: 'ছবি থেকে PDF',
      subtitle: 'AI লেআউট অপটিমাইজেশন',
      description: 'একাধিক ছবিকে একটি PDF ডকুমেন্টে রূপান্তর - AI-powered layout',
      gradient: 'from-purple-500 to-pink-600',
      accept: '.jpg,.jpeg,.png,.webp',
      multiple: true,
      features: [
        'একাধিক ছবি সাপোর্ট',
        'AI স্মার্ট লেআউট',
        'কমপ্রেশন অপশন',
        'কাস্টম পেজ সাইজ',
        'ড্র্যাগ ড্রপ অর্ডারিং'
      ]
    },
    {
      id: 'pdf-to-word',
      title: 'PDF থেকে ওয়ার্ড',
      subtitle: 'উন্নত লেআউট সংরক্ষণ',
      description: 'PDF ডকুমেন্টকে সম্পাদনাযোগ্য Word ফাইলে রূপান্তর',
      gradient: 'from-orange-500 to-red-600',
      accept: '.pdf',
      multiple: false,
      features: [
        'লেআউট সংরক্ষণ',
        'টেবিল ও ইমেজ সাপোর্ট',
        'ফন্ট ম্যাচিং',
        'পেজ নাম্বারিং',
        'হেডার ফুটার'
      ]
    },
    {
      id: 'word-to-pdf',
      title: 'ওয়ার্ড থেকে PDF',
      subtitle: 'প্রফেশনাল PDF জেনারেশন',
      description: 'Word ডকুমেন্টকে উচ্চ মানের PDF এ রূপান্তর',
      gradient: 'from-teal-500 to-cyan-600',
      accept: '.doc,.docx',
      multiple: false,
      features: [
        'প্রফেশনাল ফরম্যাটিং',
        'হাই রেজোলিউশন',
        'এমবেডেড ফন্ট',
        'সিকিউরিটি অপশন',
        'কমপ্যাটিবিলিটি চেক'
      ]
    }
  ];

  // Stats data
  const stats = [
    { id: 1, name: 'সক্রিয় ব্যবহারকারী', value: '৫০,০০০+', icon: Users },
    { id: 2, name: 'ডকুমেন্ট প্রক্রিয়াজাত', value: '১০ লক্ষ+', icon: FileText },
    { id: 3, name: 'সফলতার হার', value: '৯৯.৮%', icon: TrendingUp },
    { id: 4, name: 'গ্রাহক সন্তুষ্টি', value: '৪.৯/৫', icon: Star }
  ];

  // File processing logic
  const processFile = async (file, toolId) => {
    setIsProcessing(true);
    setResult(null);
    
    try {
      let processedResult;
      
      switch(toolId) {
        case 'image-to-word':
          processedResult = await convertImageToWord(file);
          break;
        case 'pdf-to-image':
          processedResult = await convertPdfToImages(file);
          break;
        case 'images-to-pdf':
          processedResult = await convertImagesToPdf([file]);
          break;
        case 'pdf-to-word':
          processedResult = await convertPdfToWord(file);
          break;
        case 'word-to-pdf':
          processedResult = await convertWordToPdf(file);
          break;
        default:
          throw new Error('Unknown tool');
      }
      
      setResult(processedResult);
      toast.success('ফাইল সফলভাবে প্রক্রিয়া করা হয়েছে!');
    } catch (error) {
      console.error('Processing error:', error);
      toast.error('ফাইল প্রক্রিয়া করতে সমস্যা হয়েছে।');
    } finally {
      setIsProcessing(false);
    }
  };

  // File upload handler
  const handleFileUpload = useCallback((files, toolId) => {
    if (!files || files.length === 0) return;
    
    const file = files[0];
    setUploadedFile(file);
    processFile(file, toolId);
  }, []);

  // Drag and drop handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = useCallback((e, toolId) => {
    e.preventDefault();
    e.stopPropagation();
    
    const files = Array.from(e.dataTransfer.files);
    handleFileUpload(files, toolId);
  }, [handleFileUpload]);

  // Download handler
  const handleDownload = (result) => {
    if (result?.downloadUrl) {
      const link = document.createElement('a');
      link.href = result.downloadUrl;
      link.download = result.fileName || 'converted-file';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success('ডাউনলোড শুরু হয়েছে!');
    }
  };

  // Share handler
  const handleShare = async (result) => {
    try {
      if (result?.blob && result?.fileName) {
        const shareInfo = fileStorage.storeFile(result.blob, result.fileName, 'application/octet-stream');
        await navigator.clipboard.writeText(shareInfo.shareUrl);
        toast.success('শেয়ার লিঙ্ক কপি হয়েছে!');
      } else {
        toast.error('শেয়ার করার জন্য কোন ফাইল নেই।');
      }
    } catch (error) {
      console.error('Share error:', error);
      toast.error('শেয়ার করতে সমস্যা হয়েছে।');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      {/* Modern Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/10 border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">বাংলা অফিস টুলস</h1>
                <p className="text-sm text-blue-200">Professional Document Solutions</p>
              </div>
            </div>
            <nav className="hidden md:flex items-center space-x-6">
              <a href="#tools" className="text-white/80 hover:text-white transition-colors">টুলস</a>
              <a href="#stats" className="text-white/80 hover:text-white transition-colors">পরিসংখ্যান</a>
              <a href="#about" className="text-white/80 hover:text-white transition-colors">সম্পর্কে</a>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              বাংলা অফিস টুলস
            </h1>
            <p className="text-xl md:text-2xl text-blue-200 mb-8 max-w-3xl mx-auto">
              পেশাদার বাংলা ডকুমেন্ট সমাধান - AI-চালিত OCR এবং কনভার্টার টুলস
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => document.getElementById('tools').scrollIntoView({ behavior: 'smooth' })}
                className="px-8 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-semibold hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
              >
                টুলস দেখুন
              </button>
              <button className="px-8 py-4 bg-white/10 backdrop-blur text-white border border-white/20 rounded-xl font-semibold hover:bg-white/20 transition-all duration-300">
                গাইড পড়ুন
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section id="stats" className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white/10 backdrop-blur rounded-2xl p-6 text-center border border-white/20 hover:bg-white/20 transition-all duration-300"
              >
                <stat.icon className="w-8 h-8 text-blue-400 mx-auto mb-4" />
                <div className="text-2xl md:text-3xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-sm text-blue-200">{stat.name}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Tools Section */}
      <section id="tools" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">আমাদের টুলস</h2>
            <p className="text-lg text-blue-200 max-w-2xl mx-auto">
              পেশাদার বাংলা ডকুমেন্ট প্রক্রিয়াকরণের জন্য সম্পূর্ণ সমাধান
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {bengaliTools.map((tool, index) => (
              <motion.div
                key={tool.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white/10 backdrop-blur rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 cursor-pointer group"
                onClick={() => setCurrentTool(tool)}
              >
                <div className={`w-16 h-16 bg-gradient-to-r ${tool.gradient} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  {getToolIcon(tool.id)}
                </div>
                
                <h3 className="text-xl font-bold text-white mb-2">{tool.title}</h3>
                <p className="text-sm text-blue-400 font-medium mb-3">{tool.subtitle}</p>
                <p className="text-blue-200 mb-4 leading-relaxed">{tool.description}</p>
                
                <ul className="space-y-2 mb-6">
                  {tool.features.slice(0, 3).map((feature, idx) => (
                    <li key={idx} className="text-sm text-blue-200/80 flex items-center">
                      <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-3 flex-shrink-0"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
                
                <button className="w-full py-3 bg-gradient-to-r from-blue-500/20 to-indigo-600/20 text-white rounded-xl border border-blue-500/30 hover:border-blue-400 hover:bg-gradient-to-r hover:from-blue-500/30 hover:to-indigo-600/30 transition-all duration-300 flex items-center justify-center group">
                  <span className="mr-2">শুরু করুন</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Tool Modal */}
      {currentTool && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-slate-800/90 backdrop-blur rounded-2xl p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto border border-white/20"
          >
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center space-x-4">
                <div className={`w-12 h-12 bg-gradient-to-r ${currentTool.gradient} rounded-xl flex items-center justify-center`}>
                  {getToolIcon(currentTool.id)}
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">{currentTool.title}</h3>
                  <p className="text-blue-400">{currentTool.subtitle}</p>
                </div>
              </div>
              <button
                onClick={() => setCurrentTool(null)}
                className="text-white/60 hover:text-white p-2"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>

            {!uploadedFile ? (
              <div
                className="border-2 border-dashed border-blue-500/30 rounded-2xl p-12 text-center hover:border-blue-400/50 transition-colors cursor-pointer"
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, currentTool.id)}
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="w-16 h-16 text-blue-400 mx-auto mb-4" />
                <h4 className="text-xl font-semibold text-white mb-2">ফাইল আপলোড করুন</h4>
                <p className="text-blue-200 mb-4">ড্র্যাগ করে ফেলুন অথবা ব্রাউজ করুন</p>
                <p className="text-sm text-blue-400">
                  সাপোর্টেড ফরম্যাট: {currentTool.accept.replace(/\./g, '').toUpperCase()}
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept={currentTool.accept}
                  multiple={currentTool.multiple}
                  onChange={(e) => handleFileUpload(e.target.files, currentTool.id)}
                  className="hidden"
                />
              </div>
            ) : (
              <div className="space-y-6">
                {isProcessing ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-white font-semibold">প্রক্রিয়াকরণ চলছে...</p>
                  </div>
                ) : result ? (
                  <div className="bg-green-500/10 border border-green-500/30 rounded-2xl p-6">
                    <h4 className="text-lg font-semibold text-white mb-4">সফল!</h4>
                    <div className="flex gap-4">
                      <button
                        onClick={() => handleDownload(result)}
                        className="flex-1 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold hover:shadow-xl transition-all duration-300 flex items-center justify-center"
                      >
                        <Download className="w-5 h-5 mr-2" />
                        ডাউনলোড
                      </button>
                      <button
                        onClick={() => handleShare(result)}
                        className="flex-1 py-3 bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-xl font-semibold hover:bg-blue-500/30 transition-all duration-300 flex items-center justify-center"
                      >
                        <Share2 className="w-5 h-5 mr-2" />
                        শেয়ার
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-white">ফাইল প্রস্তুত, প্রক্রিয়াকরণ শুরু করুন</p>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-slate-900/50 backdrop-blur border-t border-white/10 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-bold text-white">বাংলা অফিস টুলস</h3>
              </div>
              <p className="text-blue-200/80 mb-4">পেশাদার বাংলা ডকুমেন্ট সমাধানের জন্য আপনার বিশ্বস্ত সঙ্গী</p>
              <div className="flex space-x-4">
                <a href="#" className="text-blue-400 hover:text-blue-300 transition-colors">
                  <Github className="w-5 h-5" />
                </a>
                <a href="#" className="text-blue-400 hover:text-blue-300 transition-colors">
                  <Mail className="w-5 h-5" />
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">টুলস</h4>
              <ul className="space-y-2">
                {bengaliTools.slice(0, 3).map((tool) => (
                  <li key={tool.id}>
                    <button 
                      onClick={() => setCurrentTool(tool)}
                      className="text-blue-200/80 hover:text-white transition-colors text-left"
                    >
                      {tool.title}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">সাহায্য</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-blue-200/80 hover:text-white transition-colors">ব্যবহারের গাইড</a></li>
                <li><a href="#" className="text-blue-200/80 hover:text-white transition-colors">সাপোর্ট</a></li>
                <li><a href="#" className="text-blue-200/80 hover:text-white transition-colors">FAQ</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-blue-200/60 text-sm">© ২০২৪ বাংলা অফিস টুলস। সকল অধিকার সংরক্ষিত।</p>
            <div className="flex items-center space-x-2 mt-4 md:mt-0">
              <Heart className="w-4 h-4 text-red-500" />
              <span className="text-blue-200/60 text-sm">বাংলাদেশে তৈরি</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
