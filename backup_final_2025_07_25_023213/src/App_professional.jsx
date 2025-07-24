import React, { useState, useEffect } from 'react';
import ToolCard from './components/UIComponents';
import ResultCard from './components/UIComponents';
import { tools } from './utils';
import { 
  convertImageToWord, 
  convertPdfToWord, 
  convertWordToPdf, 
  convertImagesToPdf 
} from './utils';

function App() {
  const [activeTab, setActiveTab] = useState('imageToWord');
  
  // State management
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressMessage, setProgressMessage] = useState('');
  
  // Results and errors
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  // Add counter animation effect
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

    // Trigger animation after a delay
    const timer = setTimeout(animateCounters, 1000);
    return () => clearTimeout(timer);
  }, []);

  const updateProgress = (percent, message = '') => {
    setProgress(percent);
    setProgressMessage(message);
  };

  const handleFileUpload = async (files, toolType) => {
    if (!files || files.length === 0) {
      setError('অনুগ্রহ করে একটি ফাইল নির্বাচন করুন।');
      return;
    }

    setError(null);
    setResult(null);
    setProcessing(true);
    setProgress(0);
    
    try {
      switch (toolType) {
        case 'imageToWord':
          const validImageFiles = Array.from(files).filter(file => 
            file.type.startsWith('image/')
          );
          if (validImageFiles.length === 0) {
            throw new Error('অনুগ্রহ করে বৈধ ছবি ফাইল নির্বাচন করুন।');
          }
          await convertImageToWord(validImageFiles[0], updateProgress);
          setResult({ type: 'success', content: 'সফলভাবে ছবি থেকে টেক্সট রূপান্তরিত হয়েছে!', title: 'রূপান্তর সম্পন্ন' });
          break;
          
        case 'pdfToWord':
          const validPdfFiles = Array.from(files).filter(file => 
            file.type === 'application/pdf'
          );
          if (validPdfFiles.length === 0) {
            throw new Error('অনুগ্রহ করে বৈধ PDF ফাইল নির্বাচন করুন।');
          }
          await convertPdfToWord(validPdfFiles[0], updateProgress);
          setResult({ type: 'success', content: 'সফলভাবে PDF থেকে Word রূপান্তরিত হয়েছে!', title: 'রূপান্তর সম্পন্ন' });
          break;
          
        case 'wordToPdf':
          const validWordFiles = Array.from(files).filter(file => 
            file.type.includes('document') || file.name.endsWith('.docx') || file.name.endsWith('.doc')
          );
          if (validWordFiles.length === 0) {
            throw new Error('অনুগ্রহ করে বৈধ Word ফাইল নির্বাচন করুন।');
          }
          await convertWordToPdf(validWordFiles[0], updateProgress);
          setResult({ type: 'success', content: 'সফলভাবে Word থেকে PDF রূপান্তরিত হয়েছে!', title: 'রূপান্তর সম্পন্ন' });
          break;
          
        case 'imagesToPdf':
          const validFiles = Array.from(files).filter(file => 
            file.type.startsWith('image/')
          );
          if (validFiles.length === 0) {
            throw new Error('অনুগ্রহ করে বৈধ ছবি ফাইল নির্বাচন করুন।');
          }
          await convertImagesToPdf(validFiles, updateProgress);
          setResult({ type: 'success', content: 'সফলভাবে ছবি থেকে PDF তৈরি হয়েছে!', title: 'রূপান্তর সম্পন্ন' });
          break;
          
        default:
          throw new Error('অজানা টুল টাইপ');
      }
      
    } catch (err) {
      console.error('Processing error:', err);
      setError(err.message || 'প্রক্রিয়াকরণে ত্রুটি হয়েছে');
    } finally {
      setProcessing(false);
    }
  };

  // Download result as Word
  const downloadAsWord = () => {
    if (!result || result.type !== 'text') return;
    
    const blob = new Blob([result.content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'bengali-ocr-result.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Copy to clipboard
  const copyToClipboard = () => {
    if (!result || result.type !== 'text') return;
    
    navigator.clipboard.writeText(result.content).then(() => {
      // Show success feedback
      const originalTitle = result.title;
      setResult(prev => ({ ...prev, title: '✅ কপি সম্পন্ন!' }));
      setTimeout(() => {
        setResult(prev => ({ ...prev, title: originalTitle }));
      }, 2000);
    }).catch(() => {
      setError('টেক্সট কপি করতে ব্যর্থ।');
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100">
      {/* Professional Header */}
      <header className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="text-center">
            {/* Professional Logo Section */}
            <div className="flex items-center justify-center mb-6">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-4 shadow-lg">
                <span className="text-3xl text-white">📄</span>
              </div>
              <div className="ml-4 text-left">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                  বাংলা অফিস টুলস
                </h1>
                <p className="text-gray-600 text-lg">Professional Document Processing</p>
              </div>
            </div>
            
            {/* Professional Subtitle */}
            <p className="text-xl text-gray-700 mb-8 max-w-3xl mx-auto leading-relaxed">
              উন্নত প্রযুক্তি দিয়ে বাংলা ডকুমেন্ট প্রসেসিং এর সম্পূর্ণ সমাধান
            </p>
            
            {/* Professional Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <div className="text-3xl font-bold text-blue-600 counter" data-count="98">0</div>
                <div className="text-sm text-gray-600 font-medium">% নির্ভুলতা</div>
              </div>
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <div className="text-3xl font-bold text-indigo-600 counter" data-count="4">0</div>
                <div className="text-sm text-gray-600 font-medium">টুল</div>
              </div>
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <div className="text-3xl font-bold text-green-600 counter" data-count="100">0</div>
                <div className="text-sm text-gray-600 font-medium">% অফলাইন</div>
              </div>
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <div className="text-3xl font-bold text-purple-600 counter" data-count="0">0</div>
                <div className="text-sm text-gray-600 font-medium">টাকা খরচ</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Professional Tools Section */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            আমাদের সেবাসমূহ
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            আপনার প্রয়োজন অনুযায়ী সঠিক টুল নির্বাচন করুন
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 mx-auto mt-6 rounded"></div>
        </div>

        {/* Professional Tool Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {Object.entries(tools).map(([key, tool], index) => (
            <div
              key={key}
              onClick={() => setActiveTab(key)}
              className={`group relative bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden transition-all duration-300 cursor-pointer hover:shadow-xl hover:-translate-y-1 ${
                activeTab === key
                  ? 'ring-2 ring-blue-500 shadow-xl -translate-y-1'
                  : ''
              }`}
            >
              {/* Card Header */}
              <div className={`h-2 ${tool.gradient}`}></div>
              
              {/* Card Content */}
              <div className="p-8">
                <div className="flex items-start space-x-6">
                  {/* Icon */}
                  <div className={`flex-shrink-0 w-16 h-16 ${tool.gradient} rounded-xl flex items-center justify-center shadow-md transition-transform duration-300 ${
                    activeTab === key ? 'scale-110' : 'group-hover:scale-105'
                  }`}>
                    <span className="text-2xl text-white">{tool.icon}</span>
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      {tool.title}
                    </h3>
                    <p className="text-lg text-blue-600 font-medium mb-3">
                      {tool.subtitle}
                    </p>
                    <p className="text-gray-600 leading-relaxed mb-4">
                      {tool.description}
                    </p>
                    
                    {/* Features List */}
                    <ul className="space-y-2">
                      {tool.features.map((feature, fIndex) => (
                        <li key={fIndex} className="flex items-center text-sm text-gray-600">
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-3"></div>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  {/* Status Indicator */}
                  <div className={`flex-shrink-0 w-4 h-4 rounded-full transition-colors ${
                    activeTab === key 
                      ? 'bg-green-500' 
                      : 'bg-gray-300 group-hover:bg-blue-400'
                  }`}></div>
                </div>
                
                {/* Action Button */}
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <button className={`w-full py-3 px-6 rounded-lg font-medium transition-all duration-200 ${
                    activeTab === key
                      ? `${tool.gradient} text-white shadow-md`
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}>
                    {activeTab === key ? '✓ নির্বাচিত' : 'নির্বাচন করুন'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Main Content Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Upload Section */}
          <div className="lg:col-span-2 space-y-6">
            <ToolCard
              tool={tools[activeTab]}
              onFileUpload={(files) => handleFileUpload(files, activeTab)}
              processing={processing}
              progress={progress}
              progressMessage={progressMessage}
            />
            
            {/* Error Display */}
            {error && (
              <div className="bg-red-50 border-l-4 border-red-400 rounded-lg p-6">
                <div className="flex items-start">
                  <div className="text-red-500 text-xl mr-4 mt-1">⚠️</div>
                  <div className="flex-1">
                    <h3 className="text-red-800 font-semibold text-lg">ত্রুটি হয়েছে</h3>
                    <p className="text-red-700 mt-2 leading-relaxed">{error}</p>
                    <button
                      onClick={() => setError(null)}
                      className="mt-4 bg-red-100 hover:bg-red-200 text-red-800 px-4 py-2 rounded-lg font-medium transition-colors"
                    >
                      বন্ধ করুন
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Result & Features Section */}
          <div className="space-y-6">
            {result && (
              <ResultCard
                result={result}
                onDownload={downloadAsWord}
                onCopy={copyToClipboard}
              />
            )}
            
            {/* Professional Features Showcase */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
                <h3 className="text-xl font-bold text-white flex items-center">
                  <span className="mr-3">⭐</span>
                  বিশেষ বৈশিষ্ট্য
                </h3>
              </div>
              
              <div className="p-6 space-y-6">
                {[
                  {
                    icon: '🎯',
                    title: 'উচ্চ নির্ভুলতা OCR',
                    description: '৯৮%+ নির্ভুল বাংলা টেক্সট শনাক্তকরণ',
                    color: 'blue'
                  },
                  {
                    icon: '🔒',
                    title: 'সম্পূর্ণ নিরাপত্তা',
                    description: 'আপনার ডেটা সম্পূর্ণ অফলাইনে প্রসেস হয়',
                    color: 'green'
                  },
                  {
                    icon: '⚡',
                    title: 'দ্রুত প্রক্রিয়াকরণ',
                    description: 'সেকেন্ডের মধ্যে ফলাফল পান',
                    color: 'yellow'
                  },
                  {
                    icon: '💎',
                    title: 'প্রিমিয়াম কোয়ালিটি',
                    description: 'পেশাদার মানের আউটপুট',
                    color: 'purple'
                  }
                ].map((feature, index) => (
                  <div key={index} className="flex items-start space-x-4 p-4 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className={`flex-shrink-0 w-12 h-12 bg-${feature.color}-100 rounded-lg flex items-center justify-center`}>
                      <span className="text-xl">{feature.icon}</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">{feature.title}</h4>
                      <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Professional CTA Section */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-xl p-12">
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
              আরও কিছু প্রয়োজন?
            </h3>
            <p className="text-blue-100 text-xl mb-8 max-w-2xl mx-auto">
              আমাদের সাথে যোগাযোগ করুন এবং আপনার প্রয়োজন অনুযায়ী কাস্টম সলিউশন পান
            </p>
            <button className="bg-white text-blue-600 font-bold py-4 px-8 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200">
              যোগাযোগ করুন
            </button>
          </div>
        </div>
      </main>

      {/* Professional Footer */}
      <footer className="bg-gray-900 text-white mt-20">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="text-center">
            <h4 className="text-2xl font-bold mb-4">বাংলা অফিস টুলস</h4>
            <p className="text-gray-400 mb-6">
              আধুনিক প্রযুক্তি দিয়ে বাংলা ডকুমেন্ট প্রসেসিং এর সম্পূর্ণ সমাধান
            </p>
            <div className="flex justify-center space-x-6">
              <span className="text-sm text-gray-500">© ২০২৫ সর্বস্বত্ব সংরক্ষিত</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
