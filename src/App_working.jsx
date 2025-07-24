import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, Download, Upload, Zap, Shield, Users, 
  CheckCircle, ArrowRight, Star, Globe, Clock, Database,
  FileImage, Image, FileX, Mail, Share2, MessageCircle, X,
  Camera, File, FilePlus, FileOutput, FileEdit, PenTool,
  ImageIcon, ScanLine, FileDown, FileUp, Layers, Copy, Link, ExternalLink
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import fileStorage from './utils/fileStorage.js';

const BengaliOfficeTools = () => {
  const [processing, setProcessing] = useState({});
  const [progress, setProgress] = useState({});
  const [progressMessage, setProgressMessage] = useState({});
  const [result, setResult] = useState({});
  const [error, setError] = useState({});
  const [activeModal, setActiveModal] = useState(null); // For popup system
  const [currentTool, setCurrentTool] = useState(null);

  // Tool icon component
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

  // Main Bengali features from readme.md
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
      ],
      instructions: [
        'নীল গ্রেডিয়েন্ট "📷 ছবি থেকে ওয়ার্ড" কার্ডে ক্লিক করুন',
        'ড্র্যাগ ড্রপ এলাকায় ছবি টেনে আনুন বা ক্লিক করে নির্বাচন করুন',
        'সাপোর্টেড ফরম্যাট: JPEG, PNG, JPG, WEBP',
        'রিয়েল-টাইম প্রগ্রেস দেখুন ও অপেক্ষা করুন',
        'টেক্সট প্রিভিউ দেখুন এবং কপি বা ডাউনলোড করুন'
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
      ],
      instructions: [
        'সবুজ গ্রেডিয়েন্ট "📄 PDF থেকে ছবি" কার্ডে ক্লিক করুন',
        'PDF ফাইল আপলোড করুন',
        'রেজোলিউশন সেটিংস নির্বাচন করুন',
        'রূপান্তর প্রক্রিয়া সম্পন্ন হওয়ার জন্য অপেক্ষা করুন',
        'ZIP ফাইল ডাউনলোড করুন যেতে সব ছবি রয়েছে'
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
      ],
      instructions: [
        'গোলাপী গ্রেডিয়েন্ট "🖼️ ছবি থেকে PDF" কার্ডে ক্লিক করুন',
        'একাধিক ছবি নির্বাচন করুন বা ড্র্যাগ ড্রপ করুন',
        'ছবির ক্রম সাজান (ড্র্যাগ করে)',
        'লেআউট এবং সেটিংস কনফিগার করুন',
        'PDF ডাউনলোড করুন'
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
      ],
      instructions: [
        'কমলা গ্রেডিয়েন্ট "📖 PDF থেকে ওয়ার্ড" কার্ডে ক্লিক করুন',
        'PDF ফাইল সিলেক্ট করুন',
        'রূপান্তর অপশন কনফিগার করুন',
        'প্রক্রিয়াকরণ সম্পন্ন হওয়ার অপেক্ষা করুন',
        'Word ডকুমেন্ট ডাউনলোড করুন'
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
      ],
      instructions: [
        'সায়ান গ্রেডিয়েন্ট "📑 ওয়ার্ড থেকে PDF" কার্ডে ক্লিক করুন',
        'Word ডকুমেন্ট (.doc/.docx) আপলোড করুন',
        'PDF সেটিংস নির্ধারণ করুন',
        'কনভার্শন প্রক্রিয়া চালু করুন',
        'তৈরি PDF ফাইল ডাউনলোড করুন'
      ]
    }
  ];

  // Import utility functions dynamically to avoid circular dependencies
  const processFile = useCallback(async (file, toolId) => {
    setProcessing(prev => ({ ...prev, [toolId]: true }));
    setProgress(prev => ({ ...prev, [toolId]: 0 }));
    setError(prev => ({ ...prev, [toolId]: null }));
    
    const updateProgress = (progressValue, message = '') => {
      setProgress(prev => ({ ...prev, [toolId]: progressValue }));
      setProgressMessage(prev => ({ ...prev, [toolId]: message }));
    };

    try {
      let result;
      
      switch (toolId) {
        case 'image-to-word':
          const { convertImageToWord } = await import('./utils/imageToWord');
          result = await convertImageToWord(file, updateProgress, false);
          break;
        case 'pdf-to-image':
          const { convertPdfToImages } = await import('./utils/pdfToImage');
          result = await convertPdfToImages(file, updateProgress);
          break;
        case 'images-to-pdf':
          const { convertImagesToPdf } = await import('./utils/imageToPdf');
          result = await convertImagesToPdf([file], updateProgress);
          break;
        case 'pdf-to-word':
          const { convertPdfToWord } = await import('./utils/pdfToWord');
          result = await convertPdfToWord(file, updateProgress);
          break;
        case 'word-to-pdf':
          const { convertWordToPdf } = await import('./utils/wordToPdf');
          result = await convertWordToPdf(file, updateProgress);
          break;
        default:
          throw new Error('Unsupported tool');
      }
      
      setResult(prev => ({ ...prev, [toolId]: result }));
      toast.success(`${bengaliTools.find(t => t.id === toolId)?.title} সফলভাবে সম্পন্ন হয়েছে!`);
    } catch (error) {
      console.error('Processing error:', error);
      setError(prev => ({ ...prev, [toolId]: error.message || 'রূপান্তর করতে সমস্যা হয়েছে' }));
      toast.error('ফাইল প্রক্রিয়া করতে সমস্যা হয়েছে');
    } finally {
      setProcessing(prev => ({ ...prev, [toolId]: false }));
    }
  }, [bengaliTools]);

  const handleFileSelect = useCallback((file, toolId) => {
    if (!file) return;
    
    const tool = bengaliTools.find(t => t.id === toolId);
    if (!tool) return;
    
    // Validate file type
    const acceptedTypes = tool.accept.split(',').map(type => type.trim());
    const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
    
    if (!acceptedTypes.includes(fileExtension)) {
      toast.error(`অসমর্থিত ফাইল ফরম্যাট। সাপোর্টেড: ${tool.accept}`);
      return;
    }
    
    processFile(file, toolId);
  }, [bengaliTools, processFile]);

  const downloadResult = useCallback((result, filename) => {
    if (result?.downloadUrl) {
      const link = document.createElement('a');
      link.href = result.downloadUrl;
      link.download = filename || 'converted-file';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }, []);

  const shareResult = useCallback(async (result, toolId) => {
    try {
      if (result?.blob) {
        const shareInfo = fileStorage.storeFile(
          result.blob, 
          result.filename || 'shared-file', 
          result.mimeType || 'application/octet-stream'
        );
        
        const shareText = `${bengaliTools.find(t => t.id === toolId)?.title} - ${shareInfo.filename}\n${shareInfo.shareUrl}`;
        
        if (navigator.share) {
          await navigator.share({
            title: 'বাংলা অফিস টুলস',
            text: shareText,
            url: shareInfo.shareUrl
          });
        } else {
          await navigator.clipboard.writeText(shareInfo.shareUrl);
          toast.success('শেয়ার লিঙ্ক কপি করা হয়েছে!');
        }
      }
    } catch (error) {
      console.error('Share error:', error);
      toast.error('শেয়ার করতে সমস্যা হয়েছে');
    }
  }, [bengaliTools]);

  const resetTool = useCallback((toolId) => {
    setProcessing(prev => ({ ...prev, [toolId]: false }));
    setProgress(prev => ({ ...prev, [toolId]: 0 }));
    setProgressMessage(prev => ({ ...prev, [toolId]: '' }));
    setResult(prev => ({ ...prev, [toolId]: null }));
    setError(prev => ({ ...prev, [toolId]: null }));
  }, []);

  // Stats data
  const stats = [
    { 
      label: 'সক্রিয় ব্যবহারকারী', 
      value: '৫০,০০০+', 
      icon: Users,
      color: 'text-blue-400'
    },
    { 
      label: 'ডকুমেন্ট প্রক্রিয়াজাত', 
      value: '১০ লক্ষ+', 
      icon: FileText,
      color: 'text-green-400'
    },
    { 
      label: 'রূপান্তরের হার', 
      value: '৯৯.৮%', 
      icon: CheckCircle,
      color: 'text-purple-400'
    },
    { 
      label: 'গ্রাহক সন্তুষ্টি', 
      value: '৪.৯/৅', 
      icon: Star,
      color: 'text-yellow-400'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      {/* Enhanced Header with Glassmorphism */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/10 border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-3">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">বাংলা অফিস টুলস</h1>
                <p className="text-xs text-blue-200">Professional Document Solutions</p>
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

      {/* Hero Section - Reduced padding */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              বাংলা অফিস টুলস
            </h1>
            <p className="text-lg md:text-xl text-blue-200 mb-6 max-w-3xl mx-auto">
              পেশাদার বাংলা ডকুমেন্ট সমাধান - AI-চালিত OCR এবং কনভার্টার টুলস
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => document.getElementById('tools').scrollIntoView({ behavior: 'smooth' })}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-semibold hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
              >
                টুলস দেখুন
              </button>
              <button className="px-6 py-3 bg-white/10 backdrop-blur text-white border border-white/20 rounded-xl font-semibold hover:bg-white/20 transition-all duration-300">
                গাইড পড়ুন
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section - Enhanced */}
      <section id="stats" className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white/10 backdrop-blur rounded-2xl p-4 text-center border border-white/20 hover:bg-white/20 transition-all duration-300"
              >
                <stat.icon className={`w-6 h-6 ${stat.color} mx-auto mb-2`} />
                <div className="text-xl md:text-2xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-xs text-blue-200">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Tools Section - Improved */}
      <section id="tools" className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">আমাদের টুলস</h2>
            <p className="text-lg text-blue-200 max-w-2xl mx-auto">
              পেশাদার বাংলা ডকুমেন্ট প্রক্রিয়াকরণের জন্য সম্পূর্ণ সমাধান
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bengaliTools.map((tool, index) => (
              <motion.div
                key={tool.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white/10 backdrop-blur rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 group"
              >
                {/* Tool Header */}
                <div className="flex items-center space-x-4 mb-4">
                  <div className={`w-12 h-12 bg-gradient-to-r ${tool.gradient} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    {getToolIcon(tool.id)}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-white">{tool.title}</h3>
                    <p className="text-sm text-blue-400 font-medium">{tool.subtitle}</p>
                  </div>
                </div>

                <p className="text-blue-200 mb-4 text-sm leading-relaxed">{tool.description}</p>
                
                {/* Features List */}
                <ul className="space-y-1 mb-4">
                  {tool.features.slice(0, 3).map((feature, idx) => (
                    <li key={idx} className="text-xs text-blue-200/80 flex items-center">
                      <div className="w-1 h-1 bg-blue-400 rounded-full mr-2 flex-shrink-0"></div>
                      {feature}
                    </li>
                  ))}
                </ul>

                {/* File Input Area */}
                <div className="relative">
                  <input
                    type="file"
                    accept={tool.accept}
                    multiple={tool.multiple}
                    onChange={(e) => e.target.files[0] && handleFileSelect(e.target.files[0], tool.id)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="border-2 border-dashed border-blue-500/30 rounded-xl p-4 text-center hover:border-blue-400/50 transition-colors cursor-pointer group-hover:border-blue-400/70">
                    <Upload className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                    <p className="text-sm text-blue-200 mb-1">ফাইল নির্বাচন করুন</p>
                    <p className="text-xs text-blue-400">{tool.accept.replace(/\./g, '').toUpperCase()}</p>
                  </div>
                </div>

                {/* Processing State */}
                {processing[tool.id] && (
                  <div className="mt-4 p-3 bg-blue-500/10 rounded-xl border border-blue-500/20">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-blue-200">প্রক্রিয়াকরণ চলছে...</span>
                      <span className="text-sm text-blue-400">{progress[tool.id]}%</span>
                    </div>
                    <div className="w-full bg-blue-900/50 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${progress[tool.id]}%` }}
                      ></div>
                    </div>
                    {progressMessage[tool.id] && (
                      <p className="text-xs text-blue-300 mt-2">{progressMessage[tool.id]}</p>
                    )}
                  </div>
                )}

                {/* Result State */}
                {result[tool.id] && (
                  <div className="mt-4 p-3 bg-green-500/10 rounded-xl border border-green-500/20">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-green-200 flex items-center">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        সফল!
                      </span>
                      <button
                        onClick={() => resetTool(tool.id)}
                        className="text-green-400 hover:text-green-300"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => downloadResult(result[tool.id], `${tool.id}-result`)}
                        className="flex-1 py-2 px-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg text-sm font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center"
                      >
                        <Download className="w-4 h-4 mr-1" />
                        ডাউনলোড
                      </button>
                      <button
                        onClick={() => shareResult(result[tool.id], tool.id)}
                        className="flex-1 py-2 px-3 bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-lg text-sm font-semibold hover:bg-blue-500/30 transition-all duration-300 flex items-center justify-center"
                      >
                        <Share2 className="w-4 h-4 mr-1" />
                        শেয়ার
                      </button>
                    </div>
                  </div>
                )}

                {/* Error State */}
                {error[tool.id] && (
                  <div className="mt-4 p-3 bg-red-500/10 rounded-xl border border-red-500/20">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-red-200 flex items-center">
                        <FileX className="w-4 h-4 mr-2" />
                        ত্রুটি!
                      </span>
                      <button
                        onClick={() => resetTool(tool.id)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-xs text-red-300">{error[tool.id]}</p>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Footer */}
      <footer className="bg-slate-900/50 backdrop-blur border-t border-white/10 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-bold text-white">বাংলা অফিস টুলস</h3>
              </div>
              <p className="text-blue-200/80 mb-4">
                পেশাদার বাংলা ডকুমেন্ট সমাধানের জন্য আপনার বিশ্বস্ত সঙ্গী। 
                AI-চালিত OCR প্রযুক্তি এবং উন্নত কনভার্টার টুলস দিয়ে 
                আপনার কাজকে সহজ করুন।
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-blue-400 hover:text-blue-300 transition-colors">
                  <Mail className="w-5 h-5" />
                </a>
                <a href="#" className="text-blue-400 hover:text-blue-300 transition-colors">
                  <Globe className="w-5 h-5" />
                </a>
                <a href="#" className="text-blue-400 hover:text-blue-300 transition-colors">
                  <Share2 className="w-5 h-5" />
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">টুলস</h4>
              <ul className="space-y-2">
                {bengaliTools.slice(0, 5).map((tool) => (
                  <li key={tool.id}>
                    <a href={`#${tool.id}`} className="text-blue-200/80 hover:text-white transition-colors text-sm">
                      {tool.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">সাহায্য</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-blue-200/80 hover:text-white transition-colors text-sm">ব্যবহারের গাইড</a></li>
                <li><a href="#" className="text-blue-200/80 hover:text-white transition-colors text-sm">সাপোর্ট</a></li>
                <li><a href="#" className="text-blue-200/80 hover:text-white transition-colors text-sm">FAQ</a></li>
                <li><a href="#" className="text-blue-200/80 hover:text-white transition-colors text-sm">যোগাযোগ</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-blue-200/60 text-sm">
              © ২০২৪ বাংলা অফিস টুলস। সকল অধিকার সংরক্ষিত।
            </p>
            <div className="flex items-center space-x-2 mt-4 md:mt-0">
              <span className="text-blue-200/60 text-sm">🇧🇩 বাংলাদেশে তৈরি</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default BengaliOfficeTools;
