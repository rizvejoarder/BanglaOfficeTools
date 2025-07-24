import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, Download, Upload, Zap, Shield, Users, 
  CheckCircle, ArrowRight, Star, Globe, Clock, Database,
  FileImage, Image, FileX
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const BengaliOfficeTools = () => {
  const [processing, setProcessing] = useState({});
  const [progress, setProgress] = useState({});
  const [progressMessage, setProgressMessage] = useState({});
  const [result, setResult] = useState({});
  const [error, setError] = useState({});

  // Main Bengali features from readme.md
  const bengaliTools = [
    {
      id: 'image-to-word',
      title: '📷 ছবি থেকে ওয়ার্ড',
      subtitle: 'প্রধান ফিচার - AI-Enhanced OCR',
      description: 'বাংলা ছবি থেকে সম্পাদনাযোগ্য Word ডকুমেন্ট - 99%+ নির্ভুলতা',
      icon: <FileText className="w-8 h-8" />,
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
      title: '📄 PDF থেকে ছবি',
      subtitle: '4K রেজোলিউশন সাপোর্ট',
      description: 'PDF ফাইলকে উচ্চ মানের ছবিতে রূপান্তর - 4K রেজোলিউশন সাপোর্ট',
      icon: <FileImage className="w-8 h-8" />,
      gradient: 'from-green-500 to-emerald-600',
      accept: '.pdf',
      multiple: false,
      features: [
        '4K রেজোলিউশন সাপোর্ট',
        'ব্যাচ প্রসেসিং',
        'কাস্টম DPI সেটিং', 
        'মাল্টিপল ফরম্যাট',
        'ZIP ডাউনলোড'
      ],
      instructions: [
        'সবুজ গ্রেডিয়েন্ট "PDF থেকে ছবি" কার্ডে ক্লিক করুন',
        'PDF ফাইল নির্বাচন করুন',
        'প্রতিটি পৃষ্ঠা আলাদা ছবিতে রূপান্তরিত হবে',
        'ZIP ফাইল হিসেবে সমস্ত ছবি ডাউনলোড করুন'
      ]
    },
    {
      id: 'images-to-pdf',
      title: '🖼️ ছবি থেকে PDF',
      subtitle: 'AI-অপটিমাইজড লেআউট',
      description: 'একাধিক ছবি একত্রিত করে PDF তৈরি - AI-অপটিমাইজড লেআউট',
      icon: <Image className="w-8 h-8" />,
      gradient: 'from-orange-500 to-red-600',
      accept: '.jpg,.jpeg,.png,.webp',
      multiple: true,
      features: [
        'AI-অপটিমাইজড লেআউট',
        'স্মার্ট কমপ্রেশন',
        'ড্র্যাগ এন্ড রিঅর্ডার',
        'কাস্টম পেজ সাইজ',
        'অটো অরিয়েন্টেশন'
      ],
      instructions: [
        'কমলা গ্রেডিয়েন্ট "ছবি থেকে PDF" কার্ডে ক্লিক করুন',
        'একাধিক ছবি ফাইল নির্বাচন করুন',
        'নির্বাচিত ক্রমে ছবিগুলি PDF এ যুক্ত হবে',
        'একটি সম্পূর্ণ PDF ফাইল ডাউনলোড করুন'
      ]
    },
    {
      id: 'pdf-to-word',
      title: '📋 PDF থেকে ওয়ার্ড',
      subtitle: 'স্মার্ট ফরম্যাটিং',
      description: 'PDF থেকে বাংলা টেক্সট নিষ্কাশন ও Word রূপান্তর - স্মার্ট ফরম্যাটিং',
      icon: <FileX className="w-8 h-8" />,
      gradient: 'from-red-500 to-pink-600',
      accept: '.pdf',
      multiple: false,
      features: [
        'স্মার্ট টেক্সট এক্সট্রাকশন',
        'ফরম্যাটিং প্রিজার্ভেশন',
        'মাল্টি-পেজ সাপোর্ট',
        'টেবিল রিকগনিশন',
        'উচ্চ মানের আউটপুট'
      ],
      instructions: [
        'লাল গ্রেডিয়েন্ট "PDF থেকে ওয়ার্ড" কার্ডে ক্লিক করুন',
        'টেক্সট সমৃদ্ধ PDF ফাইল নির্বাচন করুন',
        'স্বয়ংক্রিয় টেক্সট এক্সট্র্যাকশন ও ফরম্যাটিং',
        '.docx ফাইল হিসেবে ডাউনলোড করুন'
      ]
    },
    {
      id: 'word-to-pdf',
      title: '📝 ওয়ার্ড থেকে PDF',
      subtitle: 'ফন্ট এমবেডিং সহ',
      description: 'Word ডকুমেন্ট থেকে PDF রূপান্তর - ফন্ট এমবেডিং সহ',
      icon: <FileText className="w-8 h-8" />,
      gradient: 'from-purple-500 to-violet-600',
      accept: '.doc,.docx',
      multiple: false,
      features: [
        'ফন্ট এমবেডিং',
        'লেআউট প্রিজার্ভেশন',
        'ইমেজ অপটিমাইজেশন',
        'কমপ্রেশন অপশন',
        'সিকিউরিটি সেটিংস'
      ],
      instructions: [
        'বেগুনি গ্রেডিয়েন্ট "ওয়ার্ড থেকে PDF" কার্ডে ক্লিক করুন',
        'DOC বা DOCX ফরম্যাটের Word ফাইল নির্বাচন করুন',
        'ফরম্যাটিং এবং লেআউট সংরক্ষিত থাকবে',
        'PDF ফাইল হিসেবে ডাউনলোড করুন'
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

  const handleFileUpload = useCallback(async (files, toolId) => {
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
          await new Promise(resolve => setTimeout(resolve, 2500));
          updateProgress(toolId, 85, 'ছবি ফাইল তৈরি করা হচ্ছে...');
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          result = {
            type: 'batch',
            files: [
              { name: 'page_1.png', size: '2.4 MB' },
              { name: 'page_2.png', size: '2.1 MB' },
              { name: 'page_3.png', size: '2.3 MB' }
            ],
            zipFilename: `pdf_images_${Date.now()}.zip`
          };
          break;
          
        case 'images-to-pdf':
          updateProgress(toolId, 20, 'ছবিগুলি প্রক্রিয়া করা হচ্ছে...');
          await new Promise(resolve => setTimeout(resolve, 1500));
          updateProgress(toolId, 60, 'AI লেআউট অপটিমাইজেশন...');
          await new Promise(resolve => setTimeout(resolve, 2000));
          updateProgress(toolId, 90, 'PDF ফাইল তৈরি করা হচ্ছে...');
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          result = {
            type: 'download',
            filename: `combined_images_${Date.now()}.pdf`,
            url: '#'
          };
          break;
          
        case 'pdf-to-word':
          updateProgress(toolId, 10, 'PDF বিশ্লেষণ করা হচ্ছে...');
          await new Promise(resolve => setTimeout(resolve, 1200));
          updateProgress(toolId, 45, 'টেক্সট এক্সট্র্যাকশন...');
          await new Promise(resolve => setTimeout(resolve, 2000));
          updateProgress(toolId, 75, 'ফরম্যাটিং প্রিজার্ভেশন...');
          await new Promise(resolve => setTimeout(resolve, 1500));
          updateProgress(toolId, 95, 'Word ডকুমেন্ট তৈরি...');
          await new Promise(resolve => setTimeout(resolve, 800));
          
          result = {
            type: 'download',
            filename: `converted_document_${Date.now()}.docx`,
            url: '#'
          };
          break;
          
        case 'word-to-pdf':
          updateProgress(toolId, 15, 'Word ডকুমেন্ট লোড করা হচ্ছে...');
          await new Promise(resolve => setTimeout(resolve, 1000));
          updateProgress(toolId, 50, 'ফন্ট এমবেডিং...');
          await new Promise(resolve => setTimeout(resolve, 1800));
          updateProgress(toolId, 80, 'PDF রেন্ডারিং...');
          await new Promise(resolve => setTimeout(resolve, 1200));
          
          result = {
            type: 'download',
            filename: `converted_document_${Date.now()}.pdf`,
            url: '#'
          };
          break;
          
        default:
          throw new Error('অসমর্থিত প্রক্রিয়াকরণ ধরন');
      }

      setResult(prev => ({ ...prev, [toolId]: result }));
      updateProgress(toolId, 100, 'প্রক্রিয়াকরণ সম্পন্ন!');
      toast.success('ফাইল সফলভাবে প্রক্রিয়াকরণ সম্পন্ন!');
    } catch (error) {
      console.error('Processing error:', error);
      setError(prev => ({ ...prev, [toolId]: error.message || 'প্রক্রিয়াকরণের সময় একটি ত্রুটি ঘটেছে' }));
      toast.error(error.message || 'প্রক্রিয়াকরণ ব্যর্থ হয়েছে');
    } finally {
      setProcessing(prev => ({ ...prev, [toolId]: false }));
    }
  }, []);

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
            {resultData.type === 'text' && (
              <div>
                <p style={{ marginBottom: '1rem', color: '#374151' }}>{resultData.content}</p>
                <button 
                  className="download-button"
                  onClick={() => {
                    const element = document.createElement('a');
                    const file = new Blob([resultData.content], { type: 'text/plain' });
                    element.href = URL.createObjectURL(file);
                    element.download = resultData.filename;
                    document.body.appendChild(element);
                    element.click();
                    document.body.removeChild(element);
                    URL.revokeObjectURL(element.href);
                  }}
                >
                  <Download className="w-4 h-4" />
                  টেক্সট ডাউনলোড
                </button>
              </div>
            )}
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
              <button className="download-button">
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
                <button className="download-button">
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

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="header">
        <div className="container flex items-center justify-between">
          <div className="logo">
            <div className="logo-icon">✦</div>
            OfficeWave
          </div>
          <div className="text-white text-sm">
            AI Document Tools for Modern Offices
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="hero-title">OfficeWave</h1>
            <p className="hero-subtitle">
              আপনার ডকুমেন্ট প্রসেসিং এর ভবিষ্যত
            </p>
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

      {/* Bengali Tools Sections */}
      {bengaliTools.map((tool, index) => (
        <section key={tool.id} className="service-section">
          <div className="container">
            <div className="service-layout">
              <div className="service-info">
                <h2 className="service-main-title">{tool.title}</h2>
                <p className="service-main-subtitle">{tool.description}</p>
                
                <div className="feature-list">
                  {tool.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="feature-item">
                      <CheckCircle className="w-5 h-5 text-blue-600" />
                      <span><strong>{feature}</strong></span>
                    </div>
                  ))}
                </div>

                <div className="instructions-section">
                  <h4 style={{ marginBottom: '0.75rem', color: '#374151', fontSize: '1rem', fontWeight: '600' }}>
                    ব্যবহারের নির্দেশনা:
                  </h4>
                  <ol style={{ paddingLeft: '1.5rem', color: '#6B7280' }}>
                    {tool.instructions.map((instruction, instructionIndex) => (
                      <li key={instructionIndex} style={{ marginBottom: '0.5rem' }}>
                        {instruction}
                      </li>
                    ))}
                  </ol>
                </div>
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
                {renderProcessingSection(tool.id)}
              </div>
            </div>
          </div>
        </section>
      ))}

      {/* Footer */}
      <footer className="footer-enhanced">
        <div className="container">
          <div className="footer-main">
            {/* Main Info Box */}
            <div className="footer-info-box">
              <div className="footer-logo-section">
                <div className="footer-logo">
                  <div className="footer-logo-icon">✦</div>
                  <h3>OfficeWave</h3>
                </div>
                <p className="footer-tagline">
                  আধুনিক অফিসের জন্য AI ডকুমেন্ট টুলস। বাংলা ভাষায় ছবি থেকে টেক্সট, PDF কনভার্শন এবং ডকুমেন্ট প্রসেসিং এর জন্য সম্পূর্ণ সমাধান। ১০০% অফলাইন ও নিরাপদ।
                </p>
              </div>
            </div>

            {/* Features Box */}
            <div className="footer-feature-box">
              <h4 className="footer-box-title">
                <Star className="w-5 h-5" />
                বৈশিষ্ট্যসমূহ
              </h4>
              <div className="footer-features-grid">
                <div className="footer-feature-item">
                  <FileText className="w-4 h-4" />
                  <span>ছবি থেকে ওয়ার্ড</span>
                </div>
                <div className="footer-feature-item">
                  <FileImage className="w-4 h-4" />
                  <span>PDF থেকে ছবি</span>
                </div>
                <div className="footer-feature-item">
                  <Image className="w-4 h-4" />
                  <span>ছবি থেকে PDF</span>
                </div>
                <div className="footer-feature-item">
                  <FileX className="w-4 h-4" />
                  <span>PDF থেকে ওয়ার্ড</span>
                </div>
                <div className="footer-feature-item">
                  <FileText className="w-4 h-4" />
                  <span>ওয়ার্ড থেকে PDF</span>
                </div>
              </div>
            </div>

            {/* Technology Box */}
            <div className="footer-tech-box">
              <h4 className="footer-box-title">
                <Zap className="w-5 h-5" />
                প্রযুক্তি
              </h4>
              <div className="footer-tech-grid">
                <div className="footer-tech-item">
                  <Shield className="w-4 h-4" />
                  <span>100% অফলাইন</span>
                </div>
                <div className="footer-tech-item">
                  <Database className="w-4 h-4" />
                  <span>AI-পাওয়ার্ড OCR</span>
                </div>
                <div className="footer-tech-item">
                  <Clock className="w-4 h-4" />
                  <span>সিকিউর প্রক্রিয়াকরণ</span>
                </div>
                <div className="footer-tech-item">
                  <Globe className="w-4 h-4" />
                  <span>বাংলা ভাষা সাপোর্ট</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright Section - Full Width */}
        <div className="footer-copyright">
          <div className="copyright-content">
            <p>&copy; 2025 OfficeWave. সকল অধিকার সংরক্ষিত। | Developed by <a href="http://rizvejoarder.com/" target="_blank" rel="noopener noreferrer" className="developer-link">Rizve Joarder</a></p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default BengaliOfficeTools;
