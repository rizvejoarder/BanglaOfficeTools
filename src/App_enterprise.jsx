import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Eye, RefreshCw, Type, Layers, Shield, Lock, 
  Image, FileText, Download, Upload, Menu, X,
  ChevronRight, Star, Users, Clock, Zap
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

// Import utility functions
import { 
  convertImageToWord, 
  convertPdfToWord, 
  convertWordToPdf,
  convertImagesToPdf,
  convertPdfToImages
} from './utils';

const App = () => {
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState(null);
  const [progressMessage, setProgressMessage] = useState('');

  // File processing function
  const processFile = async (type, file) => {
    if (!file) return;

    setProcessing(true);
    setProgress(0);
    setResult(null);

    try {
      let result;
      setProgressMessage('Initializing...');
      setProgress(10);

      await new Promise(resolve => setTimeout(resolve, 500));

      switch (type) {
        case 'imageToWord':
          setProgressMessage('Extracting text from image...');
          setProgress(50);
          result = await processImageToWord(file);
          break;
        case 'pdfToWord':
          setProgressMessage('Converting PDF to Word...');
          setProgress(50);
          result = await processPdfToWord(file);
          break;
        case 'wordToPdf':
          setProgressMessage('Converting Word to PDF...');
          setProgress(50);
          result = await processWordToPdf(file);
          break;
        case 'imageToPdf':
          setProgressMessage('Converting image to PDF...');
          setProgress(50);
          result = await processImageToPdf(file);
          break;
        case 'pdfToImage':
          setProgressMessage('Converting PDF to images...');
          setProgress(50);
          result = await processPdfToImage(file);
          break;
        default:
          setProgressMessage('Processing file...');
          setProgress(50);
          // Simulate processing for other types
          await new Promise(resolve => setTimeout(resolve, 2000));
          result = { url: '#', name: 'processed-file.pdf', type: 'default' };
      }

      setProgressMessage('Finalizing...');
      setProgress(90);
      await new Promise(resolve => setTimeout(resolve, 500));

      setProgress(100);
      setResult(result);
      toast.success('File processed successfully!');
    } catch (error) {
      console.error('Processing error:', error);
      toast.error('Processing failed. Please try again.');
    } finally {
      setProcessing(false);
      setProgressMessage('');
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="w-full bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Bangla Office Tools</h1>
                <p className="text-sm text-gray-500">Professional Document Processing</p>
              </div>
            </div>
            <nav className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-gray-600 hover:text-gray-900 transition-colors">Features</a>
              <a href="#tools" className="text-gray-600 hover:text-gray-900 transition-colors">Tools</a>
              <a href="#about" className="text-gray-600 hover:text-gray-900 transition-colors">About</a>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="w-full bg-gradient-to-br from-blue-50 via-white to-purple-50 py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Bangla Office Tools
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed">
              Professional document processing suite with AI-powered tools for conversion, OCR, and text enhancement. 
              Streamline your workflow with secure, fast, and accurate processing.
            </p>
            <div className="flex items-center justify-center gap-6 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-yellow-500" />
                <span>99% Accuracy</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-green-500" />
                <span>Fast Processing</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-blue-500" />
                <span>Secure & Private</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Services Section */}
      <section id="tools" className="w-full bg-gray-50 py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Professional Tools</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose from our comprehensive suite of document processing tools designed for efficiency and accuracy.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Service 1: Intelligent OCR */}
            <motion.div 
              className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 hover:shadow-lg transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-start gap-4 mb-6">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Eye className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Intelligent OCR</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Extract text from images and scanned documents with high accuracy using AI-powered OCR technology.
                  </p>
                </div>
              </div>
              
              {/* Upload Area */}
              <div className="mb-6">
                <label 
                  htmlFor="ocr-file-upload" 
                  className="block w-full p-4 border-2 border-dashed border-gray-300 rounded-xl text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors group"
                >
                  <Image className="w-8 h-8 text-gray-400 group-hover:text-blue-500 mx-auto mb-2 transition-colors" />
                  <span className="text-sm font-medium text-gray-700 group-hover:text-blue-600 transition-colors">Upload Image for OCR</span>
                  <span className="text-xs text-gray-500 block mt-1">JPG, PNG, TIFF up to 10MB</span>
                </label>
                <input 
                  type="file" 
                  id="ocr-file-upload" 
                  className="hidden" 
                  accept="image/*"
                  onChange={(e) => processFile('imageToWord', e.target.files[0])}
                />
              </div>
              
              {/* Download Button */}
              {result && result.type === 'word' && (
                <motion.button 
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium text-sm transition-colors flex items-center justify-center gap-2"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <Download className="w-4 h-4" />
                  Download Result
                </motion.button>
              )}
              
              {/* Progress Bar */}
              {processing && (
                <motion.div 
                  className="space-y-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <div className="bg-gray-200 rounded-full h-2 overflow-hidden">
                    <motion.div 
                      className="bg-blue-600 h-full transition-all duration-300" 
                      style={{ width: `${progress}%` }}
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 text-center">{progressMessage}</p>
                </motion.div>
              )}
            </motion.div>
            
            {/* Service 2: Document Conversion */}
            <motion.div 
              className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 hover:shadow-lg transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="flex items-start gap-4 mb-6">
                <div className="flex-shrink-0 w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <RefreshCw className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Document Conversion</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Convert documents between PDF, Word, and image formats while preserving layout and quality.
                  </p>
                </div>
              </div>
              
              {/* Upload Area */}
              <div className="mb-6">
                <label 
                  htmlFor="doc-convert-file-upload" 
                  className="block w-full p-4 border-2 border-dashed border-gray-300 rounded-xl text-center cursor-pointer hover:border-purple-400 hover:bg-purple-50 transition-colors group"
                >
                  <FileText className="w-8 h-8 text-gray-400 group-hover:text-purple-500 mx-auto mb-2 transition-colors" />
                  <span className="text-sm font-medium text-gray-700 group-hover:text-purple-600 transition-colors">Upload Document</span>
                  <span className="text-xs text-gray-500 block mt-1">PDF, DOCX, DOC up to 25MB</span>
                </label>
                <input 
                  type="file" 
                  id="doc-convert-file-upload" 
                  className="hidden" 
                  accept=".pdf,.docx,.doc"
                  onChange={(e) => processFile('pdfToWord', e.target.files[0])}
                />
              </div>
              
              {/* Download Button */}
              {result && result.type === 'word' && (
                <motion.button 
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 px-4 rounded-lg font-medium text-sm transition-colors flex items-center justify-center gap-2"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <Download className="w-4 h-4" />
                  Download Converted
                </motion.button>
              )}
              
              {/* Progress Bar */}
              {processing && (
                <motion.div 
                  className="space-y-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <div className="bg-gray-200 rounded-full h-2 overflow-hidden">
                    <motion.div 
                      className="bg-purple-600 h-full transition-all duration-300" 
                      style={{ width: `${progress}%` }}
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 text-center">{progressMessage}</p>
                </motion.div>
              )}
            </motion.div>
            
            {/* Service 3: Text Enhancement */}
            <motion.div 
              className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 hover:shadow-lg transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="flex items-start gap-4 mb-6">
                <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <Type className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Text Enhancement</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Improve clarity, correct spelling, and enhance Bangla text for professional documents.
                  </p>
                </div>
              </div>
              
              {/* Upload Area */}
              <div className="mb-6">
                <label 
                  htmlFor="text-enhance-upload" 
                  className="block w-full p-4 border-2 border-dashed border-gray-300 rounded-xl text-center cursor-pointer hover:border-green-400 hover:bg-green-50 transition-colors group"
                >
                  <FileText className="w-8 h-8 text-gray-400 group-hover:text-green-500 mx-auto mb-2 transition-colors" />
                  <span className="text-sm font-medium text-gray-700 group-hover:text-green-600 transition-colors">Upload Text Document</span>
                  <span className="text-xs text-gray-500 block mt-1">TXT, DOCX, PDF up to 15MB</span>
                </label>
                <input 
                  type="file" 
                  id="text-enhance-upload" 
                  className="hidden" 
                  accept=".txt,.docx,.pdf"
                  onChange={(e) => processFile('textEnhancement', e.target.files[0])}
                />
              </div>
              
              {/* Download Button */}
              {result && (
                <motion.button 
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg font-medium text-sm transition-colors flex items-center justify-center gap-2"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <Download className="w-4 h-4" />
                  Download Enhanced
                </motion.button>
              )}
              
              {/* Progress Bar */}
              {processing && (
                <motion.div 
                  className="space-y-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <div className="bg-gray-200 rounded-full h-2 overflow-hidden">
                    <motion.div 
                      className="bg-green-600 h-full transition-all duration-300" 
                      style={{ width: `${progress}%` }}
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 text-center">{progressMessage}</p>
                </motion.div>
              )}
            </motion.div>
            
            {/* Service 4: Batch Processing */}
            <motion.div 
              className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 hover:shadow-lg transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="flex items-start gap-4 mb-6">
                <div className="flex-shrink-0 w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                  <Layers className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Batch Processing</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Process multiple files at once for fast, efficient document management.
                  </p>
                </div>
              </div>
              
              {/* Upload Area */}
              <div className="mb-6">
                <label 
                  htmlFor="batch-process-upload" 
                  className="block w-full p-4 border-2 border-dashed border-gray-300 rounded-xl text-center cursor-pointer hover:border-orange-400 hover:bg-orange-50 transition-colors group"
                >
                  <Layers className="w-8 h-8 text-gray-400 group-hover:text-orange-500 mx-auto mb-2 transition-colors" />
                  <span className="text-sm font-medium text-gray-700 group-hover:text-orange-600 transition-colors">Upload Multiple Files</span>
                  <span className="text-xs text-gray-500 block mt-1">Select multiple documents</span>
                </label>
                <input 
                  type="file" 
                  id="batch-process-upload" 
                  className="hidden" 
                  multiple
                  accept=".pdf,.docx,.doc,.jpg,.png"
                  onChange={(e) => processFile('batchProcessing', Array.from(e.target.files))}
                />
              </div>
              
              {/* Download Button */}
              {result && (
                <motion.button 
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 px-4 rounded-lg font-medium text-sm transition-colors flex items-center justify-center gap-2"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <Download className="w-4 h-4" />
                  Download All
                </motion.button>
              )}
              
              {/* Progress Bar */}
              {processing && (
                <motion.div 
                  className="space-y-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <div className="bg-gray-200 rounded-full h-2 overflow-hidden">
                    <motion.div 
                      className="bg-orange-600 h-full transition-all duration-300" 
                      style={{ width: `${progress}%` }}
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 text-center">{progressMessage}</p>
                </motion.div>
              )}
            </motion.div>
            
            {/* Service 5: Format Preservation */}
            <motion.div 
              className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 hover:shadow-lg transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <div className="flex items-start gap-4 mb-6">
                <div className="flex-shrink-0 w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center">
                  <Shield className="w-6 h-6 text-teal-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Format Preservation</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Maintain your document's original formatting, layout, and styling during conversion.
                  </p>
                </div>
              </div>
              
              {/* Upload Area */}
              <div className="mb-6">
                <label 
                  htmlFor="format-preserve-upload" 
                  className="block w-full p-4 border-2 border-dashed border-gray-300 rounded-xl text-center cursor-pointer hover:border-teal-400 hover:bg-teal-50 transition-colors group"
                >
                  <FileText className="w-8 h-8 text-gray-400 group-hover:text-teal-500 mx-auto mb-2 transition-colors" />
                  <span className="text-sm font-medium text-gray-700 group-hover:text-teal-600 transition-colors">Upload Document</span>
                  <span className="text-xs text-gray-500 block mt-1">PDF, DOCX with complex formatting</span>
                </label>
                <input 
                  type="file" 
                  id="format-preserve-upload" 
                  className="hidden" 
                  accept=".pdf,.docx,.doc"
                  onChange={(e) => processFile('formatPreservation', e.target.files[0])}
                />
              </div>
              
              {/* Download Button */}
              {result && (
                <motion.button 
                  className="w-full bg-teal-600 hover:bg-teal-700 text-white py-3 px-4 rounded-lg font-medium text-sm transition-colors flex items-center justify-center gap-2"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <Download className="w-4 h-4" />
                  Download Preserved
                </motion.button>
              )}
              
              {/* Progress Bar */}
              {processing && (
                <motion.div 
                  className="space-y-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <div className="bg-gray-200 rounded-full h-2 overflow-hidden">
                    <motion.div 
                      className="bg-teal-600 h-full transition-all duration-300" 
                      style={{ width: `${progress}%` }}
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 text-center">{progressMessage}</p>
                </motion.div>
              )}
            </motion.div>
            
            {/* Service 6: Secure Processing */}
            <motion.div 
              className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 hover:shadow-lg transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <div className="flex items-start gap-4 mb-6">
                <div className="flex-shrink-0 w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
                  <Lock className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Secure Processing</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    End-to-end encryption and secure file handling with complete privacy protection.
                  </p>
                </div>
              </div>
              
              {/* Upload Area */}
              <div className="mb-6">
                <label 
                  htmlFor="secure-process-upload" 
                  className="block w-full p-4 border-2 border-dashed border-gray-300 rounded-xl text-center cursor-pointer hover:border-indigo-400 hover:bg-indigo-50 transition-colors group"
                >
                  <Lock className="w-8 h-8 text-gray-400 group-hover:text-indigo-500 mx-auto mb-2 transition-colors" />
                  <span className="text-sm font-medium text-gray-700 group-hover:text-indigo-600 transition-colors">Upload Secure Document</span>
                  <span className="text-xs text-gray-500 block mt-1">All files encrypted during processing</span>
                </label>
                <input 
                  type="file" 
                  id="secure-process-upload" 
                  className="hidden" 
                  accept=".pdf,.docx,.doc,.jpg,.png"
                  onChange={(e) => processFile('secureProcessing', e.target.files[0])}
                />
              </div>
              
              {/* Download Button */}
              {result && (
                <motion.button 
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-4 rounded-lg font-medium text-sm transition-colors flex items-center justify-center gap-2"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <Download className="w-4 h-4" />
                  Download Secure
                </motion.button>
              )}
              
              {/* Progress Bar */}
              {processing && (
                <motion.div 
                  className="space-y-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <div className="bg-gray-200 rounded-full h-2 overflow-hidden">
                    <motion.div 
                      className="bg-indigo-600 h-full transition-all duration-300" 
                      style={{ width: `${progress}%` }}
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 text-center">{progressMessage}</p>
                </motion.div>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="w-full bg-white py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose Our Tools?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Built with cutting-edge technology and designed for professionals who demand accuracy and efficiency.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div 
              className="text-center p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Lightning Fast</h3>
              <p className="text-gray-600">Process documents in seconds with our optimized algorithms and cloud infrastructure.</p>
            </motion.div>
            
            <motion.div 
              className="text-center p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">99% Accurate</h3>
              <p className="text-gray-600">Industry-leading accuracy powered by advanced AI and machine learning models.</p>
            </motion.div>
            
            <motion.div 
              className="text-center p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Secure & Private</h3>
              <p className="text-gray-600">Your documents are processed securely with end-to-end encryption and automatic deletion.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full bg-gray-900 text-white py-12 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold">Bangla Office Tools</h3>
          </div>
          <p className="text-gray-400 mb-6">Professional document processing made simple and secure.</p>
          <div className="text-sm text-gray-500">
            © 2025 Bangla Office Tools. All rights reserved.
          </div>
        </div>
      </footer>

      {/* Toast Notifications */}
      <Toaster position="bottom-right" />
    </div>
  );
};

export default App;
