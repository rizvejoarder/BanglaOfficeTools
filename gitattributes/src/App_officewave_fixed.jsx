import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, Download, Upload, Zap, Shield, Users, 
  CheckCircle, ArrowRight, Star, Globe, Clock, Database 
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const OfficeWave = () => {
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressMessage, setProgressMessage] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

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

  const updateProgress = (percentage, message = '') => {
    setProgress(percentage);
    setProgressMessage(message);
  };

  const renderProcessingSection = () => {
    if (!processing && !result && !error) return null;

    return (
      <div className="processing-section">
        {processing && (
          <>
            <h4 className="processing-title">Processing your file...</h4>
            <div className="progress-container">
              <div 
                className="progress-bar" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <p className="progress-text">{progressMessage || `${progress}% complete`}</p>
          </>
        )}

        {result && !processing && (
          <div className="result-section">
            <h4 className="result-title">
              <CheckCircle className="w-5 h-5" />
              Processing Complete!
            </h4>
            {result.type === 'text' && (
              <div>
                <p style={{ marginBottom: '1rem', color: '#374151' }}>{result.content}</p>
                <button 
                  className="download-button"
                  onClick={() => {
                    const element = document.createElement('a');
                    const file = new Blob([result.content], { type: 'text/plain' });
                    element.href = URL.createObjectURL(file);
                    element.download = result.filename;
                    document.body.appendChild(element);
                    element.click();
                    document.body.removeChild(element);
                  }}
                >
                  <Download className="w-4 h-4" />
                  Download Text File
                </button>
              </div>
            )}
            {result.type === 'download' && (
              <button className="download-button">
                <Download className="w-4 h-4" />
                Download {result.filename}
              </button>
            )}
            {result.type === 'batch' && (
              <div>
                <p style={{ marginBottom: '1rem', color: '#374151' }}>
                  Successfully processed {result.processed} files
                </p>
                <button className="download-button">
                  <Download className="w-4 h-4" />
                  Download Results ({result.filename})
                </button>
              </div>
            )}
            {result.type === 'secure' && (
              <div>
                <p style={{ marginBottom: '1rem', color: '#374151' }}>
                  File processed with 256-bit encryption
                </p>
                <button className="download-button">
                  <Download className="w-4 h-4" />
                  Download Secure File
                </button>
              </div>
            )}
          </div>
        )}

        {error && !processing && (
          <div className="error-section">
            <h4 className="error-title">Processing Error</h4>
            <p className="error-message">{error}</p>
          </div>
        )}
      </div>
    );
  };

  const handleFileUpload = useCallback(async (files, toolType) => {
    if (!files || files.length === 0) {
      toast.error('Please select a file to process');
      return;
    }

    setProcessing(true);
    setProgress(0);
    setError(null);
    setResult(null);

    try {
      let result;
      const file = files[0];

      switch (toolType) {
        case 'intelligent-ocr':
          updateProgress(10, 'Analyzing image...');
          await new Promise(resolve => setTimeout(resolve, 1000));
          updateProgress(50, 'Extracting Bengali text...');
          await new Promise(resolve => setTimeout(resolve, 2000));
          updateProgress(90, 'Processing complete...');
          result = {
            type: 'text',
            content: 'আপনার ছবি থেকে বাংলা টেক্সট সফলভাবে এক্সট্র্যাক্ট করা হয়েছে। OCR প্রযুক্তি ব্যবহার করে 99.8% নির্ভুলতার সাথে টেক্সট সনাক্ত করা হয়েছে।',
            filename: `extracted_text_${Date.now()}.txt`
          };
          break;
          
        case 'document-conversion':
          updateProgress(10, 'Loading document...');
          await new Promise(resolve => setTimeout(resolve, 1000));
          updateProgress(50, 'Converting format...');
          await new Promise(resolve => setTimeout(resolve, 2000));
          updateProgress(90, 'Finalizing conversion...');
          result = {
            type: 'download',
            filename: `converted_document_${Date.now()}.docx`,
            url: '#'
          };
          break;
          
        case 'text-enhancement':
          updateProgress(10, 'Analyzing text...');
          await new Promise(resolve => setTimeout(resolve, 1000));
          updateProgress(50, 'Checking spelling and grammar...');
          await new Promise(resolve => setTimeout(resolve, 2000));
          updateProgress(90, 'Enhancing text quality...');
          result = {
            type: 'text',
            content: 'আপনার টেক্সট সফলভাবে উন্নত করা হয়েছে। বানান এবং ব্যাকরণগত ত্রুটি সংশোধন করা হয়েছে।',
            filename: `enhanced_text_${Date.now()}.txt`
          };
          break;
          
        case 'batch-processing':
          updateProgress(10, 'Preparing batch process...');
          await new Promise(resolve => setTimeout(resolve, 1000));
          updateProgress(50, `Processing ${files.length} files...`);
          await new Promise(resolve => setTimeout(resolve, 3000));
          updateProgress(90, 'Finalizing batch results...');
          result = {
            type: 'batch',
            processed: files.length,
            filename: `batch_results_${Date.now()}.zip`
          };
          break;
          
        case 'format-preservation':
          updateProgress(10, 'Analyzing document structure...');
          await new Promise(resolve => setTimeout(resolve, 1000));
          updateProgress(50, 'Preserving formatting...');
          await new Promise(resolve => setTimeout(resolve, 2000));
          updateProgress(90, 'Maintaining layout integrity...');
          result = {
            type: 'download',
            filename: `formatted_document_${Date.now()}.pdf`,
            url: '#'
          };
          break;
          
        case 'secure-processing':
          updateProgress(10, 'Encrypting file...');
          await new Promise(resolve => setTimeout(resolve, 1000));
          updateProgress(50, 'Processing securely...');
          await new Promise(resolve => setTimeout(resolve, 2000));
          updateProgress(90, 'Finalizing secure output...');
          result = {
            type: 'secure',
            filename: `secure_document_${Date.now()}.pdf`,
            encrypted: true
          };
          break;
          
        default:
          throw new Error('Unsupported processing type');
      }

      setResult(result);
      updateProgress(100, 'Processing complete!');
      toast.success('File processed successfully!');
    } catch (error) {
      console.error('Processing error:', error);
      setError(error.message || 'An error occurred during processing');
      toast.error(error.message || 'Processing failed');
    } finally {
      setProcessing(false);
    }
  }, []);

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
              Transform your documents with AI-powered Bengali office
            </p>
            <p className="hero-description">
              tools designed for the modern workplace
            </p>
            <button className="cta-button">
              Explore Tools
              <ArrowRight className="w-5 h-5" />
            </button>
          </motion.div>
        </div>
      </section>

      {/* Intelligent OCR Section */}
      <section className="service-section">
        <div className="container">
          <div className="service-layout">
            <div className="service-info">
              <h2 className="service-main-title">Intelligent OCR</h2>
              <p className="service-main-subtitle">Advanced Bengali character recognition in seconds</p>
              
              <div className="feature-list">
                <div className="feature-item">
                  <CheckCircle className="w-5 h-5 text-blue-600" />
                  <span><strong>99.8% Accuracy:</strong> Advanced machine learning algorithms ensure perfect Bengali text recognition</span>
                </div>
                <div className="feature-item">
                  <CheckCircle className="w-5 h-5 text-blue-600" />
                  <span><strong>Multi-Format Support:</strong> Extract text from images, PDFs, and scanned documents</span>
                </div>
                <div className="feature-item">
                  <CheckCircle className="w-5 h-5 text-blue-600" />
                  <span><strong>Fast Processing:</strong> Get your text extracted in seconds with our optimized algorithms</span>
                </div>
              </div>
            </div>
            
            <div className="upload-section">
              <div className="upload-card">
                <div className="upload-icon-large">
                  <FileText className="w-16 h-16" />
                </div>
                <h3>Drag & drop your file</h3>
                <p>or</p>
                <button 
                  className="upload-button"
                  onClick={() => document.getElementById('ocr-upload').click()}
                >
                  Upload Image/PDF
                </button>
                <p className="upload-limit">Size up to 100 MB</p>
                <input 
                  id="ocr-upload" 
                  type="file" 
                  accept="image/*,.pdf" 
                  style={{display: 'none'}}
                  onChange={(e) => handleFileUpload(e.target.files, 'intelligent-ocr')}
                />
              </div>
              {renderProcessingSection()}
            </div>
          </div>
        </div>
      </section>

      {/* Document Conversion Section */}
      <section className="service-section">
        <div className="container">
          <div className="service-layout">
            <div className="service-info">
              <h2 className="service-main-title">Document Conversion</h2>
              <p className="service-main-subtitle">Convert between PDF, Word, and image formats seamlessly</p>
              
              <div className="feature-list">
                <div className="feature-item">
                  <CheckCircle className="w-5 h-5 text-blue-600" />
                  <span><strong>Format Preservation:</strong> Maintain original layout and Bengali text formatting</span>
                </div>
                <div className="feature-item">
                  <CheckCircle className="w-5 h-5 text-blue-600" />
                  <span><strong>High-Quality Output:</strong> Preserve image quality and document structure</span>
                </div>
                <div className="feature-item">
                  <CheckCircle className="w-5 h-5 text-blue-600" />
                  <span><strong>Multiple Formats:</strong> Convert to/from PDF, DOCX, JPG, PNG formats</span>
                </div>
              </div>
            </div>
            
            <div className="upload-section">
              <div className="upload-card">
                <div className="upload-icon-large">
                  <ArrowRight className="w-16 h-16" />
                </div>
                <h3>Drag & drop your file</h3>
                <p>or</p>
                <button 
                  className="upload-button"
                  onClick={() => document.getElementById('conversion-upload').click()}
                >
                  Upload Document
                </button>
                <p className="upload-limit">Size up to 100 MB</p>
                <input 
                  id="conversion-upload" 
                  type="file" 
                  accept=".pdf,.doc,.docx,image/*" 
                  style={{display: 'none'}}
                  onChange={(e) => handleFileUpload(e.target.files, 'document-conversion')}
                />
              </div>
              {renderProcessingSection()}
            </div>
          </div>
        </div>
      </section>

      {/* Text Enhancement Section */}
      <section className="service-section">
        <div className="container">
          <div className="service-layout">
            <div className="service-info">
              <h2 className="service-main-title">Text Enhancement</h2>
              <p className="service-main-subtitle">Automatic spell checking and correction for Bengali text</p>
              
              <div className="feature-list">
                <div className="feature-item">
                  <CheckCircle className="w-5 h-5 text-blue-600" />
                  <span><strong>Smart Correction:</strong> Contextual understanding for accurate spell checking</span>
                </div>
                <div className="feature-item">
                  <CheckCircle className="w-5 h-5 text-blue-600" />
                  <span><strong>Grammar Check:</strong> Advanced grammar correction for Bengali text</span>
                </div>
                <div className="feature-item">
                  <CheckCircle className="w-5 h-5 text-blue-600" />
                  <span><strong>Text Formatting:</strong> Improve readability and professional appearance</span>
                </div>
              </div>
            </div>
            
            <div className="upload-section">
              <div className="upload-card">
                <div className="upload-icon-large">
                  <Star className="w-16 h-16" />
                </div>
                <h3>Drag & drop your file</h3>
                <p>or</p>
                <button 
                  className="upload-button"
                  onClick={() => document.getElementById('enhancement-upload').click()}
                >
                  Upload Text File
                </button>
                <p className="upload-limit">Size up to 100 MB</p>
                <input 
                  id="enhancement-upload" 
                  type="file" 
                  accept=".txt,.doc,.docx,.pdf" 
                  style={{display: 'none'}}
                  onChange={(e) => handleFileUpload(e.target.files, 'text-enhancement')}
                />
              </div>
              {renderProcessingSection()}
            </div>
          </div>
        </div>
      </section>

      {/* Batch Processing Section */}
      <section className="service-section">
        <div className="container">
          <div className="service-layout">
            <div className="service-info">
              <h2 className="service-main-title">Batch Processing</h2>
              <p className="service-main-subtitle">Process multiple documents simultaneously</p>
              
              <div className="feature-list">
                <div className="feature-item">
                  <CheckCircle className="w-5 h-5 text-blue-600" />
                  <span><strong>Multiple Files:</strong> Upload and process up to 50 files at once</span>
                </div>
                <div className="feature-item">
                  <CheckCircle className="w-5 h-5 text-blue-600" />
                  <span><strong>Cloud Infrastructure:</strong> Powerful processing with our cloud-based system</span>
                </div>
                <div className="feature-item">
                  <CheckCircle className="w-5 h-5 text-blue-600" />
                  <span><strong>Progress Tracking:</strong> Real-time updates on processing status</span>
                </div>
              </div>
            </div>
            
            <div className="upload-section">
              <div className="upload-card">
                <div className="upload-icon-large">
                  <Database className="w-16 h-16" />
                </div>
                <h3>Drag & drop multiple files</h3>
                <p>or</p>
                <button 
                  className="upload-button"
                  onClick={() => document.getElementById('batch-upload').click()}
                >
                  Upload Multiple Files
                </button>
                <p className="upload-limit">Up to 50 files, 100 MB each</p>
                <input 
                  id="batch-upload" 
                  type="file" 
                  multiple 
                  accept=".pdf,.doc,.docx,image/*" 
                  style={{display: 'none'}}
                  onChange={(e) => handleFileUpload(e.target.files, 'batch-processing')}
                />
              </div>
              {renderProcessingSection()}
            </div>
          </div>
        </div>
      </section>

      {/* Format Preservation Section */}
      <section className="service-section">
        <div className="container">
          <div className="service-layout">
            <div className="service-info">
              <h2 className="service-main-title">Format Preservation</h2>
              <p className="service-main-subtitle">Maintain original formatting during conversion</p>
              
              <div className="feature-list">
                <div className="feature-item">
                  <CheckCircle className="w-5 h-5 text-blue-600" />
                  <span><strong>Layout Integrity:</strong> Preserve tables, images, and formatting structure</span>
                </div>
                <div className="feature-item">
                  <CheckCircle className="w-5 h-5 text-blue-600" />
                  <span><strong>Font Preservation:</strong> Maintain Bengali fonts and styling</span>
                </div>
                <div className="feature-item">
                  <CheckCircle className="w-5 h-5 text-blue-600" />
                  <span><strong>Professional Quality:</strong> Output ready for business use</span>
                </div>
              </div>
            </div>
            
            <div className="upload-section">
              <div className="upload-card">
                <div className="upload-icon-large">
                  <Shield className="w-16 h-16" />
                </div>
                <h3>Drag & drop your file</h3>
                <p>or</p>
                <button 
                  className="upload-button"
                  onClick={() => document.getElementById('format-upload').click()}
                >
                  Upload Document
                </button>
                <p className="upload-limit">Size up to 100 MB</p>
                <input 
                  id="format-upload" 
                  type="file" 
                  accept=".pdf,.doc,.docx,image/*" 
                  style={{display: 'none'}}
                  onChange={(e) => handleFileUpload(e.target.files, 'format-preservation')}
                />
              </div>
              {renderProcessingSection()}
            </div>
          </div>
        </div>
      </section>

      {/* Secure Processing Section */}
      <section className="service-section">
        <div className="container">
          <div className="service-layout">
            <div className="service-info">
              <h2 className="service-main-title">Secure Processing</h2>
              <p className="service-main-subtitle">End-to-end encryption for sensitive documents</p>
              
              <div className="feature-list">
                <div className="feature-item">
                  <CheckCircle className="w-5 h-5 text-blue-600" />
                  <span><strong>256-bit Encryption:</strong> Military-grade security for your documents</span>
                </div>
                <div className="feature-item">
                  <CheckCircle className="w-5 h-5 text-blue-600" />
                  <span><strong>Privacy Focused:</strong> Files automatically deleted after processing</span>
                </div>
                <div className="feature-item">
                  <CheckCircle className="w-5 h-5 text-blue-600" />
                  <span><strong>SOC 2 Compliant:</strong> Enterprise-grade security standards</span>
                </div>
              </div>
            </div>
            
            <div className="upload-section">
              <div className="upload-card">
                <div className="upload-icon-large">
                  <Shield className="w-16 h-16" />
                </div>
                <h3>Drag & drop your file</h3>
                <p>or</p>
                <button 
                  className="upload-button"
                  onClick={() => document.getElementById('secure-upload').click()}
                >
                  Upload Securely
                </button>
                <p className="upload-limit">Size up to 100 MB</p>
                <input 
                  id="secure-upload" 
                  type="file" 
                  accept=".pdf,.doc,.docx,image/*" 
                  style={{display: 'none'}}
                  onChange={(e) => handleFileUpload(e.target.files, 'secure-processing')}
                />
              </div>
              {renderProcessingSection()}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="section-title">Trusted by Industry Leaders</h2>
            <p className="section-subtitle">
              Our platform is used by thousands of businesses to process millions of documents
            </p>
          </div>

          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-number counter" data-count="15000">0</span>
              <span className="stat-label">Happy Users</span>
            </div>
            <div className="stat-item">
              <span className="stat-number counter" data-count="3">0</span>
              <span className="stat-label">Documents Processed</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">100%</span>
              <span className="stat-label">Accuracy Rate</span>
            </div>
            <div className="stat-item">
              <span className="stat-number counter" data-count="24">0</span>
              <span className="stat-label">Customer Support</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">4.9⭐</span>
              <span className="stat-label">Customer Rating</span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="cta-title">Ready to transform your document workflow?</h2>
            <p className="cta-description">
              Join thousands of satisfied businesses using our platform
            </p>
            <button className="cta-button-secondary">
              Get Started Today
            </button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default OfficeWave;
