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
  const [activeModal, setActiveModal] = useState(null);
  const [currentTool, setCurrentTool] = useState(null);

  // Main Bengali features - ALL YOUR ORIGINAL TOOLS
  const bengaliTools = [
    {
      id: 'image-to-word',
      title: 'ছবি থেকে ওয়ার্ড',
      subtitle: 'প্রধান ফিচার - AI-Enhanced OCR',
      description: 'বাংলা ছবি থেকে সম্পাদনাযোগ্য Word ডকুমেন্ট - 99%+ নির্ভুলতা',
      icon: React.createElement(ScanLine, { className: "w-8 h-8 text-white" }),
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
      icon: React.createElement(ImageIcon, { className: "w-8 h-8 text-white" }),
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
      icon: React.createElement(Layers, { className: "w-8 h-8 text-white" }),
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
      icon: React.createElement(FileDown, { className: "w-8 h-8 text-white" }),
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
        'কমলা গ্রেডিয়েন্ট "📄 PDF থেকে ওয়ার্ড" কার্ডে ক্লিক করুন',
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
      icon: React.createElement(FileUp, { className: "w-8 h-8 text-white" }),
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
        'সায়ান গ্রেডিয়েন্ট "📝 ওয়ার্ড থেকে PDF" কার্ডে ক্লিক করুন',
        'Word ডকুমেন্ট আপলোড করুন',
        'PDF সেটিংস কনফিগার করুন',
        'সিকিউরিটি অপশন সেট করুন (যদি প্রয়োজন হয়)',
        'PDF ফাইল ডাউনলোড করুন'
      ]
    }
  ];

  // Counter animation effect - YOUR ORIGINAL ANIMATION
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
          }, false); // Don't auto-download
          
          updateProgress(toolId, 98, 'ফাইল সংরক্ষণ করা হচ্ছে...');
          
          // Store file for sharing
          const shareInfo = fileStorage.storeFile(
            wordResult.blob, 
            wordResult.fileName, 
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
          );
          
          result = {
            type: 'word',
            content: 'Word ডকুমেন্ট সফলভাবে তৈরি হয়েছে। ডাউনলোড করতে নিচের বাটনে ক্লিক করুন।',
            filename: wordResult.fileName,
            blob: wordResult.blob,
            shareInfo: shareInfo,
            downloadReady: true
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
          
          // Create a zip file with all images
          let zipBlob = imageResult.zipBlob;
          let zipFilename = imageResult.filename || ('pdf_images_' + Date.now() + '.zip');
          
          // If no zip blob, create a simple blob for testing
          if (!zipBlob && imageResult.images && imageResult.images.length > 0) {
            zipBlob = imageResult.images[0].blob;
            zipFilename = imageResult.images[0].fileName || 'converted_images.png';
          }
          
          updateProgress(toolId, 95, 'ফাইল সংরক্ষণ করা হচ্ছে...');
          
          // Store file for sharing
          const imageShareInfo = zipBlob ? fileStorage.storeFile(
            zipBlob, 
            zipFilename, 
            zipBlob.type || 'application/zip'
          ) : null;
          
          result = {
            type: 'batch',
            content: imageResult.images && imageResult.images.length > 0 ? 
              imageResult.images.length + 'টি ছবি সফলভাবে তৈরি হয়েছে। ডাউনলোড করতে নিচের বাটনে ক্লিক করুন।' :
              'PDF থেকে ছবি সফলভাবে তৈরি হয়েছে। ডাউনলোড করতে নিচের বাটনে ক্লিক করুন।',
            files: imageResult.images?.map((img, index) => ({
              name: img.fileName || ('page_' + (index + 1) + '.png'),
              size: ((img.blob?.size / 1024 / 1024).toFixed(1) + ' MB') || 'Unknown',
              blob: img.blob
            })) || [
              { name: 'page_1.png', size: '2.4 MB', blob: null }
            ],
            filename: zipFilename,
            blob: zipBlob,
            shareInfo: imageShareInfo,
            downloadReady: true
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
          
          // Store file for sharing
          const pdfShareInfo = pdfResult.blob ? fileStorage.storeFile(
            pdfResult.blob, 
            pdfResult.filename || ('merged_images_' + Date.now() + '.pdf'), 
            'application/pdf'
          ) : null;
          
          result = {
            type: 'download',
            content: 'PDF ডকুমেন্ট সফলভাবে তৈরি হয়েছে। ডাউনলোড করতে নিচের বাটনে ক্লিক করুন।',
            filename: pdfResult.filename || ('merged_images_' + Date.now() + '.pdf'),
            blob: pdfResult.blob,
            shareInfo: pdfShareInfo,
            downloadReady: true
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
          
          // Store file for sharing
          const pdfToWordShareInfo = wordFromPdfResult.blob ? fileStorage.storeFile(
            wordFromPdfResult.blob, 
            wordFromPdfResult.filename || ('converted_document_' + Date.now() + '.docx'), 
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
          ) : null;
          
          result = {
            type: 'download',
            content: 'Word ডকুমেন্ট সফলভাবে তৈরি হয়েছে। ডাউনলোড করতে নিচের বাটনে ক্লিক করুন।',
            filename: wordFromPdfResult.filename || ('converted_document_' + Date.now() + '.docx'),
            blob: wordFromPdfResult.blob,
            shareInfo: pdfToWordShareInfo,
            downloadReady: true
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
          
          // Store file for sharing
          const wordToPdfShareInfo = pdfFromWordResult.blob ? fileStorage.storeFile(
            pdfFromWordResult.blob, 
            pdfFromWordResult.filename || ('converted_document_' + Date.now() + '.pdf'), 
            'application/pdf'
          ) : null;
          
          result = {
            type: 'download',
            content: 'PDF ডকুমেন্ট সফলভাবে তৈরি হয়েছে। ডাউনলোড করতে নিচের বাটনে ক্লিক করুন।',
            filename: pdfFromWordResult.filename || ('converted_document_' + Date.now() + '.pdf'),
            blob: pdfFromWordResult.blob,
            shareInfo: wordToPdfShareInfo,
            downloadReady: true
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
    const tool = bengaliTools.find(t => t.id === toolId);
    setCurrentTool(tool);
    setActiveModal(toolId);
    processFile(files, toolId);
  };

  const renderActionButtons = (toolId, toolTitle, resultData) => {
    if (!resultData) return null;

    const handleDownload = () => {
      if (resultData.blob && resultData.filename) {
        const link = document.createElement('a');
        const url = URL.createObjectURL(resultData.blob);
        link.href = url;
        link.download = resultData.filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        toast.success('ফাইল ডাউনলোড শুরু হয়েছে!');
      } else {
        toast.error('ডাউনলোড লিংক পাওয়া যায়নি।');
      }
    };

    const handleShare = (platform) => {
      const fileName = resultData.filename || 'generated_file';
      
      // Check if we have a shareable file
      if (resultData.shareInfo) {
        const { shareUrl, expiryHours } = resultData.shareInfo;
        const text = 'আমি ' + toolTitle + ' টুল ব্যবহার করে "' + fileName + '" ফাইল তৈরি করেছি!\n\nফাইল ডাউনলোড করুন: ' + shareUrl + '\n\n⚠️ এই লিংকটি ' + expiryHours + ' ঘন্টা পর মেয়াদ উত্তীর্ণ হবে।\n\nOfficeWave - আধুনিক অফিসের জন্য AI ডকুমেন্ট টুলস';
        
        switch (platform) {
          case 'whatsapp':
            window.open('https://wa.me/?text=' + encodeURIComponent(text), '_blank');
            break;
          case 'email':
            const subject = fileName + ' - OfficeWave AI টুল দিয়ে তৈরি';
            const body = text + '\n\nOfficeWave ব্যবহার করুন: ' + window.location.origin;
            window.open('mailto:?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body), '_blank');
            break;
          case 'copy':
            navigator.clipboard.writeText(shareUrl);
            toast.success('শেয়ার লিংক কপি করা হয়েছে! লিংকটি ২৪ ঘন্টা সক্রিয় থাকবে।');
            break;
          case 'share':
            if (navigator.share) {
              navigator.share({
                title: fileName + ' - OfficeWave',
                text: text,
                url: shareUrl,
              });
            } else {
              navigator.clipboard.writeText(shareUrl);
              toast.success('শেয়ার লিংক কপি করা হয়েছে!');
            }
            break;
        }
      } else {
        // Fallback to sharing the website
        const text = 'আমি ' + toolTitle + ' টুল ব্যবহার করে "' + fileName + '" ফাইল তৈরি করেছি! OfficeWave - আধুনিক অফিসের জন্য AI ডকুমেন্ট টুলস।';
        const url = window.location.href.split('?')[0]; // Remove any query params
        
        switch (platform) {
          case 'whatsapp':
            window.open('https://wa.me/?text=' + encodeURIComponent(text + ' ' + url), '_blank');
            break;
          case 'email':
            const subject = fileName + ' - OfficeWave AI টুল দিয়ে তৈরি';
            const body = text + '\n\nOfficeWave ব্যবহার করুন: ' + url;
            window.open('mailto:?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body), '_blank');
            break;
          case 'copy':
            navigator.clipboard.writeText(url);
            toast.success('ওয়েবসাইট লিংক কপি করা হয়েছে!');
            break;
        }
      }
    };

    return (
      <div className="action-buttons-section">
        {/* Download Section */}
        <div className="action-buttons-container">
          <h4 className="action-title">ফাইল ডাউনলোড</h4>
          <div className="action-buttons">
            <button 
              className="action-button download-primary"
              onClick={handleDownload}
              title="ফাইল ডাউনলোড করুন"
            >
              <Download className="w-4 h-4" />
              <span>ডাউনলোড করুন</span>
            </button>
            
            {resultData.shareInfo && (
              <div className="file-info">
                <p className="text-sm text-gray-600">
                  📁 {resultData.shareInfo.filename} ({resultData.shareInfo.size})
                </p>
                <p className="text-xs text-orange-600">
                  ⏰ মেয়াদ: {resultData.shareInfo.expiryHours} ঘন্টা
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Share Section */}
        <div className="action-buttons-container">
          <h4 className="action-title">
            {resultData.shareInfo ? 'ফাইল শেয়ার করুন' : 'ওয়েবসাইট শেয়ার করুন'}
          </h4>
          <div className="action-buttons">
            {resultData.shareInfo && (
              <button 
                className="action-button copy-link"
                onClick={() => handleShare('copy')}
                title="শেয়ার লিংক কপি করুন"
              >
                <Link className="w-4 h-4" />
                <span>লিংক কপি</span>
              </button>
            )}
            
            <button 
              className="action-button email"
              onClick={() => handleShare('email')}
              title="ইমেইলে শেয়ার করুন"
            >
              <Mail className="w-4 h-4" />
              <span>ইমেইল</span>
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
              className="action-button share-native"
              onClick={() => handleShare('share')}
              title="অন্যান্য অ্যাপে শেয়ার করুন"
            >
              <Share2 className="w-4 h-4" />
              <span>শেয়ার</span>
            </button>
          </div>
        </div>

        {resultData.shareInfo && (
          <div className="share-notice">
            <div className="notice-box">
              <Clock className="w-4 h-4 text-orange-500" />
              <div className="notice-text">
                <p className="font-medium">গুরুত্বপূর্ণ নোটিস</p>
                <p className="text-sm">এই ফাইলটি ২৪ ঘন্টা পর স্বয়ংক্রিয়ভাবে মুছে যাবে। প্রয়োজনে এখনই ডাউনলোড করুন।</p>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header - YOUR ORIGINAL HEADER */}
      <header className="header-modern">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="logo-container">
                <Zap className="w-8 h-8 text-blue-600" />
              </div>
              <div className="brand-text">
                <h1 className="text-xl font-bold text-white">OfficeWave</h1>
                <p className="text-xs text-blue-100">বাংলা ডকুমেন্ট AI টুলস</p>
              </div>
            </div>
            <nav className="nav-links hidden md:flex space-x-6">
              <a href="#image-to-word" className="nav-link">ছবি থেকে ওয়ার্ড</a>
              <a href="#pdf-to-image" className="nav-link">PDF থেকে ছবি</a>
              <a href="#images-to-pdf" className="nav-link">ছবি থেকে PDF</a>
              <a href="#pdf-to-word" className="nav-link">PDF থেকে ওয়ার্ড</a>
              <a href="#word-to-pdf" className="nav-link">ওয়ার্ড থেকে PDF</a>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Stats Section - YOUR ORIGINAL STATS */}
        <section className="stats-section">
          <div className="stats-container">
            <motion.div 
              className="stat-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="stat-icon">
                <Users className="w-8 h-8" />
              </div>
              <div className="stat-content">
                <div className="stat-number counter" data-count="50000">0</div>
                <div className="stat-label">সন্তুষ্ট ব্যবহারকারী</div>
              </div>
            </motion.div>

            <motion.div 
              className="stat-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="stat-icon">
                <FileText className="w-8 h-8" />
              </div>
              <div className="stat-content">
                <div className="stat-number counter" data-count="100000">0</div>
                <div className="stat-label">ডকুমেন্ট প্রক্রিয়াজাত</div>
              </div>
            </motion.div>

            <motion.div 
              className="stat-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="stat-icon">
                <Zap className="w-8 h-8" />
              </div>
              <div className="stat-content">
                <div className="stat-number counter" data-count="99">0</div>
                <div className="stat-label">% নির্ভুলতার হার</div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Tools Grid - ALL YOUR ORIGINAL TOOLS */}
        <section className="tools-grid">
          {bengaliTools.map((tool, index) => (
            <motion.div
              key={tool.id}
              className="service-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              id={tool.id}
            >
              <div className="service-header">
                <div className="service-title-container">
                  <div className={'service-title-icon bg-gradient-to-r ' + tool.gradient}>
                    {tool.icon}
                  </div>
                  <div className="service-title-text">
                    <h3 className="service-title">{tool.title}</h3>
                    <p className="service-subtitle">{tool.subtitle}</p>
                  </div>
                </div>
              </div>

              <div className="service-description">
                <p>{tool.description}</p>
              </div>

              <div className="service-features">
                <ul>
                  {tool.features.map((feature, idx) => (
                    <li key={idx}>
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Upload Area */}
              <div className="upload-section">
                <div className="upload-area">
                  <div className={'upload-icon-large bg-gradient-to-r ' + tool.gradient}>
                    <Upload className="w-12 h-12 text-white" />
                  </div>
                  <div className="upload-content">
                    <h4 className="upload-title">ফাইল আপলোড করুন</h4>
                    <p className="upload-subtitle">ড্র্যাগ ড্রপ করুন বা ক্লিক করে নির্বাচন করুন</p>
                    <button 
                      className="upload-button"
                      onClick={() => document.getElementById(tool.id + '-upload').click()}
                    >
                      <Upload className="w-5 h-5" />
                      <span>ফাইল নির্বাচন করুন</span>
                    </button>
                    <input
                      type="file"
                      id={tool.id + '-upload'} 
                      accept={tool.accept}
                      multiple={tool.multiple}
                      className="hidden"
                      onChange={(e) => handleFileUpload(e.target.files, tool.id)}
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                {result[tool.id] && renderActionButtons(tool.id, tool.title, result[tool.id])}
              </div>
            </motion.div>
          ))}
        </section>
      </main>

      {/* Footer - YOUR ORIGINAL FOOTER */}
      <footer className="footer-modern">
        <div className="container mx-auto px-4 py-8">
          <div className="footer-content">
            <div className="footer-cards">
              <div className="footer-card">
                <div className="footer-card-icon">
                  <Shield className="w-6 h-6" />
                </div>
                <div className="footer-card-content">
                  <h4>নিরাপদ ও দ্রুত</h4>
                  <p>আপনার ফাইল সুরক্ষিত এবং দ্রুত প্রক্রিয়াজাত হয়</p>
                </div>
              </div>

              <div className="footer-card">
                <div className="footer-card-icon">
                  <Globe className="w-6 h-6" />
                </div>
                <div className="footer-card-content">
                  <h4>যেকোনো জায়গা থেকে</h4>
                  <p>ব্রাউজার থেকেই সব কাজ, কোনো সফটওয়্যার ইনস্টল লাগবে না</p>
                </div>
              </div>

              <div className="footer-card">
                <div className="footer-card-icon">
                  <Database className="w-6 h-6" />
                </div>
                <div className="footer-card-content">
                  <h4>বাংলা ভাষার জন্য</h4>
                  <p>বিশেষভাবে বাংলা ভাষার জন্য তৈরি AI টুলস</p>
                </div>
              </div>
            </div>

            <div className="footer-bottom">
              <p className="copyright">
                © {new Date().getFullYear()} OfficeWave. সকল অধিকার সংরক্ষিত।
              </p>
            </div>
          </div>
        </div>
      </footer>

      {/* Modal - YOUR ORIGINAL MODAL SYSTEM */}
      {activeModal && currentTool && (
        <div className="modal-overlay" onClick={() => setActiveModal(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className={'modal-icon bg-gradient-to-r ' + currentTool.gradient}>
                {currentTool.icon}
              </div>
              <div className="modal-title-container">
                <h3 className="modal-title">{currentTool.title}</h3>
                <p className="modal-subtitle">{currentTool.subtitle}</p>
              </div>
              <button 
                className="modal-close-button"
                onClick={() => setActiveModal(null)}
                title="বন্ধ করুন"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="modal-body">
              {processing[activeModal] && (
                <div className="progress-container">
                  <div className="progress-header">
                    <h4 className="progress-title">প্রক্রিয়াকরণ চলছে...</h4>
                    <button 
                      className="progress-close-button"
                      onClick={() => setActiveModal(null)}
                      title="বন্ধ করুন"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="progress-bar-container">
                    <div 
                      className="progress-bar-fill"
                      style={{ width: (progress[activeModal] || 0) + '%' }}
                    ></div>
                  </div>
                  <p className="progress-text">{progressMessage[activeModal] || ((progress[activeModal] || 0) + '% সম্পন্ন')}</p>
                </div>
              )}

              {result[activeModal] && (
                <div className="result-container">
                  <div className="result-success">
                    <CheckCircle className="w-6 h-6 text-green-500" />
                    <div>
                      <h4 className="result-title">সফল!</h4>
                      <p className="result-message">{result[activeModal].content}</p>
                    </div>
                  </div>

                  {renderActionButtons(activeModal, currentTool.title, result[activeModal])}
                </div>
              )}

              {error[activeModal] && (
                <div className="error-container">
                  <div className="error-message">
                    <FileX className="w-6 h-6 text-red-500" />
                    <div>
                      <h4 className="error-title">ত্রুটি</h4>
                      <p className="error-text">{error[activeModal]}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BengaliOfficeTools;
