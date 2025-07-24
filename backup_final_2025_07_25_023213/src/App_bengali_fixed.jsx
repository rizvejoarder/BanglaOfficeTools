//BanglaOfficeTools - AI CHATBOT INTEGRATION - 2025-07-24 17:25
import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, Download, Upload, Zap, Shield, Users, 
  CheckCircle, ArrowRight, Star, Globe, Clock, Database,
  FileImage, Image, FileX, Mail, Share2, MessageCircle, X,
  Camera, File, FilePlus, FileOutput, FileEdit, PenTool,
  ImageIcon, ScanLine, FileDown, FileUp, Layers, Copy, Bot
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import AIAssistantPage from './components/AIAssistantPage';

const BengaliOfficeTools = () => {
  const [processing, setProcessing] = useState({});
  const [progress, setProgress] = useState({});
  const [progressMessage, setProgressMessage] = useState({});
  const [result, setResult] = useState({});
  const [error, setError] = useState({});
  const [activeModal, setActiveModal] = useState(null); // For popup system
  const [currentTool, setCurrentTool] = useState(null);
  const [currentView, setCurrentView] = useState('home'); // 'home' or 'ai-assistant'

  // Main Bengali features from readme.md
  const bengaliTools = [
    {
      id: 'image-to-word',
      title: 'ছবি থেকে ওয়ার্ড',
      subtitle: 'প্রধান ফিচার - AI-Enhanced OCR',
      description: 'বাংলা ছবি থেকে সম্পাদনাযোগ্য Word ডকুমেন্ট - 99%+ নির্ভুলতা',
      icon: <ScanLine className="w-8 h-8 text-black font-bold" />,
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
      icon: <ImageIcon className="w-8 h-8 text-black font-bold" />,
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
        'সবুজ গ্রেডিয়েন্ট "PDF থেকে ছবি" কার্ডে ক্লিক করুন',
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
      icon: <Layers className="w-8 h-8 text-black font-bold" />,
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
        'গোলাপী গ্রেডিয়েন্ট "ছবি থেকে PDF" কার্ডে ক্লিক করুন',
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
      icon: <FileDown className="w-8 h-8 text-black font-bold" />,
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
        'কমলা গ্রেডিয়েন্ট "PDF থেকে ওয়ার্ড" কার্ডে ক্লিক করুন',
        'PDF ফাইল আপলোড করুন',
        'কনভার্শন অপশন সিলেক্ট করুন',
        'প্রক্রিয়াকরণ সম্পন্ন হওয়ার জন্য অপেক্ষা করুন',
        'Word ডকুমেন্ট ডাউনলোড করুন'
      ]
    },
    {
      id: 'word-to-pdf',
      title: 'ওয়ার্ড থেকে PDF',
      subtitle: 'প্রফেশনাল PDF জেনারেশন',
      description: 'Word ডকুমেন্টকে উচ্চ মানের PDF এ রূপান্তর',
      icon: <FileUp className="w-8 h-8 text-black font-bold" />,
      gradient: 'from-teal-500 to-cyan-600',
      accept: '.doc,.docx',
      multiple: false,
      features: [
        'হাই-কোয়ালিটি রেন্ডারিং',
        'পাসওয়ার্ড প্রোটেকশন',
        'মেটাডেটা সংরক্ষণ',
        'বুকমার্ক সাপোর্ট',
        'কমপ্রেশন অপশন'
      ],
      instructions: [
        'সায়ান গ্রেডিয়েন্ট "ওয়ার্ড থেকে PDF" কার্ডে ক্লিক করুন',
        'Word ডকুমেন্ট আপলোড করুন',
        'PDF সেটিংস কনফিগার করুন',
        'সিকিউরিটি অপশন সেট করুন (যদি প্রয়োজন হয়)',
        'PDF ফাইল ডাউনলোড করুন'
      ]
    }
  ];

  // Counter animation effect
  useEffect(() => {
    const animateCounters = () => {
      const counters = document.querySelectorAll('.counter');
      counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-count'));
        const increment = target / 100;
        let current = 0;
        
        const updateCounter = () => {
          if (current < target) {
            current += increment;
            counter.textContent = Math.ceil(current);
            setTimeout(updateCounter, 30);
          } else {
            counter.textContent = target;
          }
        };
        
        updateCounter();
      });
    };

    const timer = setTimeout(animateCounters, 1000);
    return () => clearTimeout(timer);
  }, []);

  const updateProgress = (toolId, percentage, message = '') => {
    setProgress(prev => ({ ...prev, [toolId]: percentage }));
    setProgressMessage(prev => ({ ...prev, [toolId]: message }));
  };

  const processFile = useCallback(async (files, toolId) => {
    if (!files || files.length === 0) return;

    setProcessing(prev => ({ ...prev, [toolId]: true }));
    setError(prev => ({ ...prev, [toolId]: null }));
    setResult(prev => ({ ...prev, [toolId]: null }));
    
    try {
      let result;
      
      switch (toolId) {
        case 'image-to-word':
          updateProgress(toolId, 10, 'ছবি বিশ্লেষণ করা হচ্ছে...');
          await new Promise(resolve => setTimeout(resolve, 1500));
          updateProgress(toolId, 40, 'OCR প্রক্রিয়া চালু...');
          await new Promise(resolve => setTimeout(resolve, 2000));
          updateProgress(toolId, 70, 'বাংলা টেক্সট রিকগনিশন...');
          await new Promise(resolve => setTimeout(resolve, 1500));
          updateProgress(toolId, 90, 'Word ডকুমেন্ট তৈরি করা হচ্ছে...');
          
          // Import and use proper Word conversion
          const { convertImageToWord } = await import('./utils/imageToWord.js');
          const wordResult = await convertImageToWord(files[0], (message) => {
            updateProgress(toolId, 95, message);
          });
          
          result = {
            type: 'word',
            content: 'Word ডকুমেন্ট সফলভাবে তৈরি হয়েছে এবং ডাউনলোড হয়েছে।',
            filename: wordResult.fileName,
            downloadComplete: true
          };
          break;
          
        case 'pdf-to-image':
          updateProgress(toolId, 15, 'PDF ফাইল লোড করা হচ্ছে...');
          await new Promise(resolve => setTimeout(resolve, 1000));
          updateProgress(toolId, 50, 'পৃষ্ঠাগুলি রেন্ডার করা হচ্ছে...');
          
          // Import and use actual PDF to image conversion
          const { convertPdfToImages } = await import('./utils/pdfToImage.js');
          const imageResult = await convertPdfToImages(files[0], (message) => {
            updateProgress(toolId, 75, message);
          });
          
          updateProgress(toolId, 90, 'ছবি ফাইল তৈরি করা হচ্ছে...');
          
          result = {
            type: 'batch',
            files: imageResult.images?.map((img, index) => ({
              name: img.fileName || `page_${index + 1}.png`,
              size: `${(img.blob?.size / 1024 / 1024).toFixed(1)} MB` || 'Unknown',
              blob: img.blob
            })) || [
              { name: 'page_1.png', size: '2.4 MB', blob: null },
              { name: 'page_2.png', size: '2.1 MB', blob: null }
            ],
            zipFilename: imageResult.filename || `pdf_images_${Date.now()}.zip`,
            zipUrl: imageResult.downloadUrl || imageResult.zipUrl,
            zipBlob: imageResult.zipBlob
          };
          break;
          
        case 'images-to-pdf':
          updateProgress(toolId, 20, 'ছবিগুলি প্রক্রিয়া করা হচ্ছে...');
          await new Promise(resolve => setTimeout(resolve, 1000));
          updateProgress(toolId, 60, 'AI লেআউট অপটিমাইজেশন...');
          
          // Import and use actual images to PDF conversion
          const { convertImagesToPdf } = await import('./utils/imageToPdf.js');
          const pdfResult = await convertImagesToPdf(Array.from(files), (message) => {
            updateProgress(toolId, 80, message);
          });
          
          updateProgress(toolId, 95, 'PDF ডকুমেন্ট তৈরি করা হচ্ছে...');
          
          result = {
            type: 'download',
            filename: pdfResult.filename || `merged_images_${Date.now()}.pdf`,
            downloadUrl: pdfResult.downloadUrl,
            blob: pdfResult.blob
          };
          break;
          
        case 'pdf-to-word':
          updateProgress(toolId, 25, 'PDF বিশ্লেষণ করা হচ্ছে...');
          await new Promise(resolve => setTimeout(resolve, 1000));
          updateProgress(toolId, 65, 'টেক্সট ও লেআউট এক্সট্র্যাক্ট করা হচ্ছে...');
          
          // Import and use actual PDF to Word conversion
          const { convertPdfToWord } = await import('./utils/pdfToWord.js');
          const wordFromPdfResult = await convertPdfToWord(files[0], (message) => {
            updateProgress(toolId, 85, message);
          });
          
          updateProgress(toolId, 95, 'Word ডকুমেন্ট ফরম্যাটিং...');
          
          result = {
            type: 'download',
            filename: wordFromPdfResult.filename || `converted_document_${Date.now()}.docx`,
            downloadUrl: wordFromPdfResult.downloadUrl,
            blob: wordFromPdfResult.blob
          };
          break;
          
        case 'word-to-pdf':
          updateProgress(toolId, 30, 'Word ডকুমেন্ট পার্স করা হচ্ছে...');
          await new Promise(resolve => setTimeout(resolve, 1000));
          updateProgress(toolId, 60, 'PDF রেন্ডারিং...');
          
          // Import and use actual Word to PDF conversion
          const { convertWordToPdf } = await import('./utils/wordToPdf.js');
          const pdfFromWordResult = await convertWordToPdf(files[0], (message) => {
            updateProgress(toolId, 80, message);
          });
          
          updateProgress(toolId, 95, 'ফাইনাল প্রক্রিয়াকরণ...');
          
          result = {
            type: 'download',
            filename: pdfFromWordResult.filename || `converted_document_${Date.now()}.pdf`,
            downloadUrl: pdfFromWordResult.downloadUrl,
            blob: pdfFromWordResult.blob
          };
          break;
          
        default:
          throw new Error('অজানা টুল নির্বাচিত হয়েছে');
      }
      
      updateProgress(toolId, 100, 'সম্পন্ন!');
      setResult(prev => ({ ...prev, [toolId]: result }));
      toast.success('ফাইল সফলভাবে প্রক্রিয়া করা হয়েছে!');
      
    } catch (error) {
      console.error('Processing error:', error);
      setError(prev => ({ ...prev, [toolId]: error.message || 'প্রক্রিয়াকরণের সময় একটি ত্রুটি ঘটেছে' }));
      toast.error(error.message || 'প্রক্রিয়াকরণ ব্যর্থ হয়েছে');
    } finally {
      setProcessing(prev => ({ ...prev, [toolId]: false }));
    }
  }, []);

  const handleFileUpload = (files, toolId) => {
    // Find the tool data
    const tool = bengaliTools.find(t => t.id === toolId);
    setCurrentTool(tool);
    setActiveModal(toolId);
    processFile(files, toolId);
  };

  const renderActionButtons = (toolId, toolTitle, resultData) => {
    if (!resultData) return null;

    const handleShare = (platform) => {
      const fileName = resultData.filename || resultData.zipFilename || 'generated_file';
      const text = `আমি ${toolTitle} টুল ব্যবহার করে "${fileName}" ফাইল তৈরি করেছি! OfficeWave - আধুনিক অফিসের জন্য AI ডকুমেন্ট টুলস।`;
      const url = window.location.href;
      
      switch (platform) {
        case 'whatsapp':
          window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`, '_blank');
          break;
        case 'email':
          const subject = `${fileName} - OfficeWave AI টুল দিয়ে তৈরি`;
          const body = `${text}\n\nফাইল: ${fileName}\n\nOfficeWave ব্যবহার করুন: ${url}`;
          window.open(`mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`, '_blank');
          break;
        case 'share':
          if (navigator.share) {
            navigator.share({
              title: `${fileName} - OfficeWave`,
              text: text,
              url: url,
            });
          } else {
            // Fallback: copy to clipboard
            navigator.clipboard.writeText(text + ' ' + url);
            toast.success('লিংক কপি করা হয়েছে!');
          }
          break;
      }
    };

    const handleDownloadAgain = () => {
      // For download type results, trigger download again
      if (resultData.type === 'download') {
        toast.info('ফাইল পুনরায় ডাউনলোড করতে উপরের ডাউনলোড বাটনে ক্লিক করুন।');
      } else if (resultData.type === 'word' && resultData.downloadComplete) {
        toast.success('Word ফাইল ইতিমধ্যে ডাউনলোড হয়েছে!');
      } else {
        toast.info('ফাইল ডাউনলোড সম্পন্ন!');
      }
    };

    return (
      <div className="action-buttons-section">
        <div className="action-buttons-container">
          <h4 className="action-title">ফাইল শেয়ার করুন</h4>
          <div className="action-buttons">
            <button 
              className="action-button download-app"
              onClick={handleDownloadAgain}
              title="ফাইল সম্পর্কে তথ্য"
            >
              <Download className="w-4 h-4" />
              <span>ফাইল তথ্য</span>
            </button>
            
            <button 
              className="action-button email"
              onClick={() => handleShare('email')}
              title="ইমেইলে শেয়ার করুন"
            >
              <Mail className="w-4 h-4" />
              <span>ইমেইল শেয়ার</span>
            </button>
            
            <button 
              className="action-button whatsapp"
              onClick={() => handleShare('whatsapp')}
              title="WhatsApp এ শেয়ার করুন"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp</span>
            </button>
            
            <button 
              className="action-button share"
              onClick={() => handleShare('share')}
              title="অন্যভাবে শেয়ার করুন"
            >
              <Share2 className="w-4 h-4" />
              <span>শেয়ার করুন</span>
            </button>
          </div>
          <p className="share-note">
            "{resultData.filename || resultData.zipFilename || 'Generated File'}" ফাইলের তথ্য শেয়ার করুন
          </p>
        </div>
      </div>
    );
  };

  const renderProcessingSection = (toolId) => {
    const isProcessing = processing[toolId];
    const progressValue = progress[toolId] || 0;
    const progressMsg = progressMessage[toolId] || '';
    const resultData = result[toolId];
    const errorMsg = error[toolId];

    if (!isProcessing && !resultData && !errorMsg) return null;

    return (
      <div className="processing-section">
        {isProcessing && (
          <>
            <h4 className="processing-title">আপনার ফাইল প্রক্রিয়া করা হচ্ছে...</h4>
            <div className="progress-container">
              <div 
                className="progress-bar" 
                style={{ width: `${progressValue}%` }}
              ></div>
            </div>
            <p className="progress-text">{progressMsg || `${progressValue}% সম্পন্ন`}</p>
          </>
        )}

        {resultData && !isProcessing && (
          <div className="result-section">
            <h4 className="result-title">
              <CheckCircle className="w-5 h-5" />
              প্রক্রিয়াকরণ সম্পন্ন!
            </h4>
            
            {resultData.type === 'word' && (
              <div>
                <p style={{ marginBottom: '1rem', color: '#374151' }}>{resultData.content}</p>
                {resultData.downloadComplete && (
                  <div className="success-message">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>ফাইল সফলভাবে ডাউনলোড হয়েছে: {resultData.filename}</span>
                  </div>
                )}
              </div>
            )}
            
            {resultData.type === 'download' && (
              <button 
                className="download-button"
                onClick={() => {
                  if (resultData.downloadUrl && resultData.blob) {
                    // Create blob URL if not exists
                    const url = resultData.downloadUrl || URL.createObjectURL(resultData.blob);
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = resultData.filename;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    
                    // Clean up blob URL if we created it
                    if (!resultData.downloadUrl) {
                      URL.revokeObjectURL(url);
                    }
                    
                    toast.success(`${resultData.filename} ডাউনলোড শুরু হয়েছে!`);
                  } else {
                    toast.error('ডাউনলোড লিংক উপলব্ধ নেই। অনুগ্রহ করে পুনরায় চেষ্টা করুন।');
                  }
                }}
              >
                <Download className="w-4 h-4" />
                {resultData.filename} ডাউনলোড করুন
              </button>
            )}
            
            {resultData.type === 'batch' && (
              <div>
                <p style={{ marginBottom: '1rem', color: '#374151' }}>
                  {resultData.files.length} টি ছবি তৈরি হয়েছে:
                </p>
                <ul style={{ marginBottom: '1rem', paddingLeft: '1.5rem' }}>
                  {resultData.files.map((file, index) => (
                    <li key={index}>{file.name} ({file.size})</li>
                  ))}
                </ul>
                <button 
                  className="download-button"
                  onClick={() => {
                    if (resultData.zipUrl && resultData.zipBlob) {
                      // Create blob URL if not exists
                      const url = resultData.zipUrl || URL.createObjectURL(resultData.zipBlob);
                      const link = document.createElement('a');
                      link.href = url;
                      link.download = resultData.zipFilename;
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                      
                      // Clean up blob URL if we created it
                      if (!resultData.zipUrl) {
                        URL.revokeObjectURL(url);
                      }
                      
                      toast.success(`${resultData.zipFilename} ডাউনলোড শুরু হয়েছে!`);
                    } else {
                      toast.error('ZIP ফাইল উপলব্ধ নেই। অনুগ্রহ করে পুনরায় চেষ্টা করুন।');
                    }
                  }}
                >
                  <Download className="w-4 h-4" />
                  {resultData.zipFilename} ডাউনলোড করুন
                </button>
              </div>
            )}
          </div>
        )}

        {errorMsg && (
          <div className="error-section">
            <h4 className="error-title">ত্রুটি ঘটেছে</h4>
            <p className="error-message">{errorMsg}</p>
          </div>
        )}
      </div>
    );
  };

  // Modal Component for Processing and Results
  const renderModal = () => {
    if (!activeModal || !currentTool) return null;

    return (
      <div className="modal-overlay" onClick={() => setActiveModal(null)}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <div className="modal-title-section">
              <div className={`modal-icon bg-gradient-to-r ${currentTool.gradient}`}>
                {currentTool.icon}
              </div>
              <h3 className="modal-title">{currentTool.title}</h3>
            </div>
            <button 
              className="modal-close"
              onClick={() => setActiveModal(null)}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="modal-body">
            {renderProcessingSection(activeModal)}
            {result[activeModal] && renderActionButtons(activeModal, currentTool.title, result[activeModal])}
            
            {result[activeModal] && !processing[activeModal] && (
              <div className="modal-footer">
                <button 
                  className="modal-complete-button"
                  onClick={() => setActiveModal(null)}
                >
                  <CheckCircle className="w-4 h-4" />
                  সম্পন্ন ও বন্ধ করুন
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Handle view switching
  if (currentView === 'ai-assistant') {
    return <AIAssistantPage onBack={() => setCurrentView('home')} />;
  }

  return (
    <div className="min-h-screen">
      {/* Modal */}
      {renderModal()}
      
      {/* Header */}
      <header className="header">
        <nav className="nav-container">
          <div className="logo">
            <div className="logo-icon">
              <FileText className="w-4 h-4" />
            </div>
            <div className="brand-info">
              <span className="brand-name">আধুনিক অফিসের জন্য AI ডকুমেন্ট টুলস</span>
              <p className="brand-tagline">AI-পাওয়ার্ড বাংলা অফিস টুলস - আধুনিক কর্মক্ষেত্রের জন্য</p>
            </div>
          </div>
          
          {/* Navigation Menu */}
          <div className="main-navigation">
            <ul className="nav-menu">
              <li><a href="#image-to-word" className="nav-link">ছবি থেকে ওয়ার্ড</a></li>
              <li><a href="#pdf-to-image" className="nav-link">PDF থেকে ছবি</a></li>
              <li><a href="#images-to-pdf" className="nav-link">ছবি থেকে PDF</a></li>
              <li><a href="#pdf-to-word" className="nav-link">PDF থেকে ওয়ার্ড</a></li>
              <li><a href="#word-to-pdf" className="nav-link">ওয়ার্ড থেকে PDF</a></li>
              <li>
                <button
                  onClick={() => setCurrentView('ai-assistant')}
                  className="nav-link ai-bot-button"
                  style={{ 
                    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '8px 16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 6px 20px rgba(99, 102, 241, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 4px 12px rgba(99, 102, 241, 0.3)';
                  }}
                >
                  <Bot className="w-4 h-4" />
                  AI সহায়ক
                </button>
              </li>
            </ul>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="hero-content"
          >
            <h1 className="hero-title">
              আধুনিক অফিসের জন্য AI ডকুমেন্ট টুলস
            </h1>
            <p className="hero-description">
              AI-পাওয়ার্ড বাংলা অফিস টুলস - আধুনিক কর্মক্ষেত্রের জন্য
            </p>
            <div className="modern-stats-container">
              <div className="modern-stat-card">
                <div className="stat-icon-wrapper accuracy">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <div className="stat-content">
                  <div className="stat-number">
                    <span className="counter" data-count="99">0</span>
                    <span className="stat-symbol">%</span>
                  </div>
                  <div className="stat-label">নির্ভুলতা</div>
                  <div className="stat-subtitle">AI OCR প্রযুক্তি</div>
                </div>
              </div>
              
              <div className="modern-stat-card">
                <div className="stat-icon-wrapper features">
                  <Star className="w-8 h-8" />
                </div>
                <div className="stat-content">
                  <div className="stat-number">
                    <span className="counter" data-count="5">0</span>
                    <span className="stat-symbol">টি</span>
                  </div>
                  <div className="stat-label">প্রধান ফিচার</div>
                  <div className="stat-subtitle">সম্পূর্ণ সমাধান</div>
                </div>
              </div>
              
              <div className="modern-stat-card">
                <div className="stat-icon-wrapper offline">
                  <Shield className="w-8 h-8" />
                </div>
                <div className="stat-content">
                  <div className="stat-number">
                    <span className="counter" data-count="100">0</span>
                    <span className="stat-symbol">%</span>
                  </div>
                  <div className="stat-label">অফলাইন</div>
                  <div className="stat-subtitle">নিরাপদ ও গোপনীয়</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Individual Tool Sections */}
      {bengaliTools.map((tool, index) => (
        <section key={tool.id} id={tool.id} className="service-section">
          <div className="container">
            <div className="service-layout">
              <div className="service-info">
                <div className="service-title-with-icon">
                  <div className={`service-title-icon bg-gradient-to-r ${tool.gradient}`}>
                    {tool.icon}
                  </div>
                  <h2 className="service-main-title">{tool.title}</h2>
                </div>
                <p className="service-main-subtitle">{tool.description}</p>
                
                <div className="feature-list">
                  {tool.features.map((feature, idx) => (
                    <div key={idx} className="feature-item">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
                
                <h3 style={{marginTop: '1.5rem', marginBottom: '0.75rem', fontSize: '1.25rem', fontWeight: '600'}}>
                  ব্যবহারের নির্দেশনা:
                </h3>
                <ol style={{paddingLeft: '1.5rem', color: '#6b7280'}}>
                  {tool.instructions.map((instruction, idx) => (
                    <li key={idx} style={{marginBottom: '0.25rem', lineHeight: '1.4'}}>{instruction}</li>
                  ))}
                </ol>
              </div>
              
              <div className="upload-section">
                <div className="upload-card">
                  <div className={`upload-icon-large bg-gradient-to-r ${tool.gradient}`}>
                    {tool.icon}
                  </div>
                  <h3>ফাইল ড্র্যাগ এন্ড ড্রপ করুন</h3>
                  <p>অথবা</p>
                  <button 
                    className="upload-button"
                    onClick={() => document.getElementById(`${tool.id}-upload`).click()}
                  >
                    {tool.multiple ? 'একাধিক ফাইল আপলোড' : 'ফাইল আপলোড করুন'}
                  </button>
                  <p className="upload-limit">
                    সাপোর্টেড: {tool.accept} | সাইজ: ১০০ MB পর্যন্ত
                  </p>
                  <input 
                    id={`${tool.id}-upload`} 
                    type="file" 
                    accept={tool.accept}
                    multiple={tool.multiple}
                    style={{display: 'none'}}
                    onChange={(e) => handleFileUpload(e.target.files, tool.id)}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      ))}

      {/* Footer */}
      <footer className="footer-enhanced">
        <div className="container">
          <div className="footer-main">
            {/* Three Card-Style Boxes */}
            <div className="footer-cards-grid">
              {/* Card 1: About */}
              <div className="footer-card">
                <div className="footer-card-header">
                  <div className="footer-card-icon">
                    <FileText className="w-6 h-6" />
                  </div>
                  <h3>BanglaOfficeTools</h3>
                </div>
                <p className="footer-card-text">
                  আধুনিক অফিসের জন্য AI ডকুমেন্ট টুলস। বাংলা ভাষায় ছবি থেকে টেক্সট, PDF কনভার্শন এবং ডকুমেন্ট প্রসেসিং এর জন্য সম্পূর্ণ সমাধান।
                </p>
              </div>

              {/* Card 2: Features */}
              <div className="footer-card">
                <div className="footer-card-header">
                  <div className="footer-card-icon">
                    <Star className="w-6 h-6" />
                  </div>
                  <h3>মূল বৈশিষ্ট্য</h3>
                </div>
                <div className="footer-features-grid">
                  <div className="footer-feature-item">
                    <CheckCircle className="w-4 h-4" />
                    <span>99%+ নির্ভুল OCR</span>
                  </div>
                  <div className="footer-feature-item">
                    <Shield className="w-4 h-4" />
                    <span>সম্পূর্ণ অফলাইন</span>
                  </div>
                  <div className="footer-feature-item">
                    <Zap className="w-4 h-4" />
                    <span>দ্রুত প্রক্রিয়াকরণ</span>
                  </div>
                  <div className="footer-feature-item">
                    <Globe className="w-4 h-4" />
                    <span>বাংলা সাপোর্ট</span>
                  </div>
                </div>
              </div>

              {/* Card 3: Technology */}
              <div className="footer-card">
                <div className="footer-card-header">
                  <div className="footer-card-icon">
                    <Database className="w-6 h-6" />
                  </div>
                  <h3>প্রযুক্তি</h3>
                </div>
                <div className="footer-features-grid">
                  <div className="footer-feature-item">
                    <Zap className="w-4 h-4" />
                    <span>AI OCR</span>
                  </div>
                  <div className="footer-feature-item">
                    <Globe className="w-4 h-4" />
                    <span>React</span>
                  </div>
                  <div className="footer-feature-item">
                    <Shield className="w-4 h-4" />
                    <span>১০০% অফলাইন</span>
                  </div>
                  <div className="footer-feature-item">
                    <FileText className="w-4 h-4" />
                    <span>পিডিএফ JS</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="footer-copyright">
          <div className="container">
            <p>
              © {new Date().getFullYear()} BanglaOfficeTools. সকল অধিকার সংরক্ষিত। | 
              Developed by <a href="http://rizvejoarder.com/" target="_blank" rel="noopener noreferrer">Rizve Joarder</a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default BengaliOfficeTools;
