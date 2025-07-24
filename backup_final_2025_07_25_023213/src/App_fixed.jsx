import React, { useState, useEffect } from 'react';
import { ToolCard, OCRResultDisplay as ResultCard } from './components/UIComponents';
import { tools } from './utils/toolsConfig';
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

  // Debug: Log tools to check if they're loaded correctly
  console.log('Tools loaded:', tools);

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

  // Progress update function
  const updateProgress = (percentage, message = '') => {
    setProgress(percentage);
    setProgressMessage(message);
  };

  // File upload handler
  const handleFileUpload = async (files, toolType) => {
    if (!files || files.length === 0) {
      setError('অনুগ্রহ করে একটি ফাইল নির্বাচন করুন।');
      return;
    }

    setError(null);
    setResult(null);
    setProcessing(true);
    setActiveTab(toolType);
    setProgress(0);

    try {
      switch (toolType) {
        case 'imageToWord':
          const validImages = Array.from(files).filter(file => 
            file.type.startsWith('image/')
          );
          if (validImages.length === 0) {
            throw new Error('অনুগ্রহ করে বৈধ ছবি ফাইল নির্বাচন করুন।');
          }
          await convertImageToWord(validImages[0], updateProgress);
          setResult({ type: 'success', content: 'সফলভাবে ছবি থেকে টেক্সট রূপান্তরিত হয়েছে!', title: 'OCR সম্পন্ন' });
          break;
          
        case 'pdfToWord':
          const validPdfs = Array.from(files).filter(file => 
            file.type === 'application/pdf'
          );
          if (validPdfs.length === 0) {
            throw new Error('অনুগ্রহ করে বৈধ PDF ফাইল নির্বাচন করুন।');
          }
          await convertPdfToWord(validPdfs[0], updateProgress);
          setResult({ type: 'success', content: 'সফলভাবে PDF থেকে Word রূপান্তরিত হয়েছে!', title: 'রূপান্তর সম্পন্ন' });
          break;
          
        case 'wordToPdf':
          const validWordFiles = Array.from(files).filter(file => 
            file.type.includes('document') || file.name.endsWith('.doc') || file.name.endsWith('.docx')
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Premium Professional Header */}
      <header className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/20 to-purple-900/20"></div>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-20">
          <div className="text-center">
            {/* Premium Brand */}
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-2xl flex items-center justify-center shadow-2xl shadow-blue-500/25">
                  <span className="text-3xl text-white filter drop-shadow-lg">📄</span>
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
              </div>
              <div>
                <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-white via-blue-100 to-indigo-200 bg-clip-text text-transparent">
                  বাংলা অফিস টুলস
                </h1>
                <p className="text-blue-200 text-lg font-semibold mt-1">Premium Document Processing Suite</p>
              </div>
            </div>
            
            <p className="text-xl md:text-2xl text-blue-100 mb-12 max-w-4xl mx-auto leading-relaxed font-medium">
              আধুনিক প্রযুক্তির শক্তিতে বাংলা ডকুমেন্ট প্রসেসিং এর সর্বোচ্চ মানের পেশাদার সমাধান
            </p>

            {/* Premium Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 p-6 hover:bg-white/15 transition-all duration-300">
                <div className="text-4xl font-black bg-gradient-to-r from-blue-300 to-cyan-300 bg-clip-text text-transparent counter" data-count="99">0</div>
                <div className="text-blue-200 font-semibold mt-2">% নির্ভুলতার হার</div>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 p-6 hover:bg-white/15 transition-all duration-300">
                <div className="text-4xl font-black bg-gradient-to-r from-green-300 to-emerald-300 bg-clip-text text-transparent counter" data-count="10000">0</div>
                <div className="text-blue-200 font-semibold mt-2">+ সন্তুষ্ট ব্যবহারকারী</div>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 p-6 hover:bg-white/15 transition-all duration-300">
                <div className="text-4xl font-black bg-gradient-to-r from-orange-300 to-red-300 bg-clip-text text-transparent">∞</div>
                <div className="text-blue-200 font-semibold mt-2">ব্যবহারের সীমা</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Premium Tools Section */}
      <main className="max-w-7xl mx-auto px-6 py-20">
        {/* Sophisticated Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-3 rounded-full border border-blue-200/50 mb-8 shadow-lg backdrop-blur-sm">
            <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full animate-pulse"></div>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 text-sm font-bold tracking-wide">PREMIUM PROFESSIONAL TOOLS</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 leading-tight">
            <span className="bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent">
              আমাদের এক্সক্লুসিভ সেবাসমূহ
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed font-medium">
            বিশ্বমানের প্রযুক্তি এবং উন্নত AI সিস্টেম দিয়ে তৈরি পেশাদার টুলস যা আপনার কাজের দক্ষতা বৃদ্ধি করবে
          </p>
          
          {/* Decorative Line */}
          <div className="flex items-center justify-center gap-3 mt-8">
            <div className="w-16 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent rounded-full"></div>
            <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"></div>
            <div className="w-16 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent rounded-full"></div>
          </div>
        </div>

        {/* Premium Tool Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20">
          {Object.entries(tools).map(([key, tool], index) => (
            <div key={key} className="w-full">
              <ToolCard
                tool={tool}
                onFileUpload={(files) => handleFileUpload(files, key)}
                processing={processing && activeTab === key}
                progress={activeTab === key ? progress : 0}
                progressMessage={activeTab === key ? progressMessage : ''}
              />
            </div>
          ))}
        </div>

        {/* Premium Error Display */}
        {error && (
          <div className="bg-gradient-to-r from-red-50 to-rose-50 border border-red-200/50 rounded-2xl p-6 mb-8 shadow-lg backdrop-blur-sm">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
                <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-bold text-red-800 mb-1">সমস্যা সনাক্ত হয়েছে</h3>
                <p className="text-red-700 font-medium">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Premium Result Display */}
        {result && (
          <div className="mb-8">
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200/50 rounded-2xl overflow-hidden shadow-xl backdrop-blur-sm">
              <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-8 py-6">
                <h3 className="text-xl font-bold text-white flex items-center gap-3">
                  <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                    </svg>
                  </div>
                  {result.title || 'প্রক্রিয়াকরণ সফল'}
                </h3>
              </div>
              
              <div className="p-8">
                <div className="text-gray-700 leading-relaxed text-lg mb-6 font-medium">
                  {result.content}
                </div>
                
                {result.type === 'text' && (
                  <div className="flex flex-col sm:flex-row gap-4">
                    <button
                      onClick={downloadAsWord}
                      className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd"/>
                      </svg>
                      ডাউনলোড করুন
                    </button>
                    <button
                      onClick={copyToClipboard}
                      className="flex-1 bg-gradient-to-r from-gray-600 to-slate-600 hover:from-gray-700 hover:to-slate-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z"/>
                        <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z"/>
                      </svg>
                      কপি করুন
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Premium Call-to-Action Section */}
        <div className="mt-20 text-center">
          <div className="relative bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 rounded-3xl shadow-2xl p-12 md:p-16 overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="absolute top-4 right-8 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
            <div className="absolute bottom-8 left-8 w-32 h-32 bg-white/5 rounded-full blur-3xl"></div>
            
            <div className="relative z-10">
              <h3 className="text-3xl md:text-4xl font-black text-white mb-6">
                আরও উন্নত ফিচার প্রয়োজন?
              </h3>
              <p className="text-blue-100 text-xl mb-8 max-w-3xl mx-auto leading-relaxed font-medium">
                আমাদের প্রিমিয়াম এন্টারপ্রাইজ সলিউশন দিয়ে আপনার ব্যবসার জন্য কাস্টমাইজড টুলস পান
              </p>
              <button className="bg-white text-blue-600 font-bold py-4 px-8 rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
                যোগাযোগ করুন
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Premium Footer */}
      <footer className="bg-gradient-to-r from-slate-900 to-gray-900 text-white mt-20">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="text-center">
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-4 shadow-xl">
                <span className="text-2xl text-white">📄</span>
              </div>
              <h4 className="text-3xl font-black">বাংলা অফিস টুলস</h4>
            </div>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto text-lg leading-relaxed font-medium">
              প্রিমিয়াম AI প্রযুক্তি দিয়ে বাংলা ডকুমেন্ট প্রসেসিং এর সর্বোচ্চ মানের পেশাদার সমাধান
            </p>
            <div className="flex justify-center items-center gap-6 text-sm text-gray-400 font-medium">
              <span>© ২০২৫ সর্বস্বত্ব সংরক্ষিত</span>
              <span>•</span>
              <span>Made with ❤️ for Bangladesh</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
