import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageCircle, Send, Upload, FileText, Brain, Sparkles,
  X, Settings, Download, Copy, RefreshCw, Bot, User,
  Mic, MicOff, Paperclip, Trash2, BookOpen, Globe,
  Calendar, ClipboardList, FileCheck, Languages, Home,
  ArrowLeft, Menu, Star, Zap, Shield, Clock, Database,
  ChevronDown, ChevronUp, Search, Filter, MoreVertical
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { getAIResponse } from '../utils/aiIntegration';
import aiFileStorage from '../utils/aiFileStorage';
import { getTemplatesByCategory, searchTemplates } from '../utils/bangladeshiTemplates';

const AIAssistantPage = ({ onBack }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: 'আসসালামুআলাইকুম! আমি বাংলাদেশী সরকারি কাজকর্মের AI সহায়ক। আমি আপনাকে নিম্নলিখিত কাজে সাহায্য করতে পারি:\n\n• যেকোনো সরকারি আবেদন লেখা\n• ডকুমেন্ট বিশ্লেষণ ও সম্পাদনা\n• চিঠিপত্র ও অফিসিয়াল কাগজপত্র তৈরি\n• বাংলা ও ইংরেজি অনুবাদ\n• সরকারি নিয়মকানুন ব্যাখ্যা\n\nআপনার কী সাহায্য প্রয়োজন?',
      timestamp: new Date(),
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [apiProvider, setApiProvider] = useState('gemini');
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTemplate, setActiveTemplate] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const chatContainerRef = useRef(null);
  const inputRef = useRef(null);

  // Available AI providers
  const aiProviders = [
    { id: 'gemini', name: 'Google Gemini', icon: '🤖', color: 'from-blue-500 to-purple-600', status: 'active' },
    { id: 'openai', name: 'OpenAI GPT', icon: '🧠', color: 'from-green-500 to-emerald-600', status: 'active' },
    { id: 'huggingface', name: 'Hugging Face', icon: '🤗', color: 'from-yellow-500 to-orange-600', status: 'active' },
    { id: 'openrouter', name: 'OpenRouter', icon: '🌐', color: 'from-purple-500 to-pink-600', status: 'premium' },
    { id: 'claude', name: 'Anthropic Claude', icon: '🎭', color: 'from-indigo-500 to-blue-600', status: 'premium' }
  ];

  // Bengali official document templates
  const documentTemplates = [
    { 
      id: 'application', 
      name: 'সাধারণ আবেদন', 
      icon: FileText, 
      category: 'আবেদন',
      description: 'যেকোনো ধরনের সাধারণ আবেদনপত্র',
      keywords: ['আবেদন', 'application', 'চিঠি']
    },
    { 
      id: 'leave', 
      name: 'ছুটির আবেদন', 
      icon: Calendar, 
      category: 'ছুটি',
      description: 'বিভিন্ন ধরনের ছুটির জন্য আবেদন',
      keywords: ['ছুটি', 'leave', 'অবকাশ']
    },
    { 
      id: 'complaint', 
      name: 'অভিযোগপত্র', 
      icon: ClipboardList, 
      category: 'অভিযোগ',
      description: 'সরকারি অফিসে অভিযোগ দাখিল',
      keywords: ['অভিযোগ', 'complaint', 'নালিশ']
    },
    { 
      id: 'certificate', 
      name: 'সার্টিফিকেট আবেদন', 
      icon: FileCheck, 
      category: 'সার্টিফিকেট',
      description: 'বিভিন্ন সার্টিফিকেটের আবেদন',
      keywords: ['সার্টিফিকেট', 'certificate', 'প্রমাণপত্র']
    },
    { 
      id: 'recommendation', 
      name: 'সুপারিশপত্র', 
      icon: BookOpen, 
      category: 'সুপারিশ',
      description: 'সুপারিশ ও প্রশংসাপত্র',
      keywords: ['সুপারিশ', 'recommendation', 'প্রশংসা']
    },
    { 
      id: 'official_letter', 
      name: 'সরকারি চিঠি', 
      icon: Globe, 
      category: 'চিঠি',
      description: 'অফিসিয়াল যোগাযোগের চিঠি',
      keywords: ['চিঠি', 'letter', 'যোগাযোগ']
    },
    { 
      id: 'job_application', 
      name: 'চাকরির আবেদন', 
      icon: User, 
      category: 'চাকরি',
      description: 'সরকারি চাকরির আবেদনপত্র',
      keywords: ['চাকরি', 'job', 'নিয়োগ']
    },
    { 
      id: 'transfer', 
      name: 'বদলির আবেদন', 
      icon: ArrowLeft, 
      category: 'বদলি',
      description: 'কর্মস্থল পরিবর্তনের আবেদন',
      keywords: ['বদলি', 'transfer', 'স্থানান্তর']
    }
  ];

  // Filter templates based on search
  const filteredTemplates = documentTemplates.filter(template =>
    template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    template.keywords.some(keyword => keyword.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Auto-focus input on mount
    inputRef.current?.focus();
  }, []);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() && uploadedFiles.length === 0) return;

    const newMessage = {
      id: Date.now(),
      type: 'user',
      content: inputMessage,
      files: uploadedFiles,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, newMessage]);
    setInputMessage('');
    setUploadedFiles([]);
    setIsLoading(true);

    try {
      // Simulate AI response (replace with actual API calls)
      const response = await simulateAIResponse(inputMessage, uploadedFiles, apiProvider);
      
      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: response,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      toast.error('AI প্রতিক্রিয়ায় ত্রুটি হয়েছে');
      console.error('AI Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const simulateAIResponse = async (message, files, provider) => {
    try {
      // Get real AI response using imported function
      const response = await getAIResponse(message, files, provider);
      return response;
    } catch (error) {
      console.error('AI Response Error:', error);
      
      // Fallback to template responses
      const messageLC = message.toLowerCase();
      
      if (messageLC.includes('আবেদন') || messageLC.includes('application')) {
        return `
# সাধারণ আবেদনপত্র

**তারিখ:** ${new Date().toLocaleDateString('bn-BD')}

**প্রতি,**
[কর্তৃপক্ষের নাম]
[ঠিকানা]

**বিষয়:** [আবেদনের বিষয়]

জনাব,
সবিনয়ে নিবেদন এই যে, [আবেদনের কারণ বিস্তারিত লিখুন]।

অতএব, আপনার নিকট বিনীত প্রার্থনা এই যে, [প্রার্থনার বিষয়] অনুগ্রহ করে [করণীয়] করিলে আমি চিরকৃতজ্ঞ থাকিব।

বিনীত নিবেদক,
[আপনার নাম]
[স্বাক্ষর]
[তারিখ]
        `;
      }

      // General fallback response
      return `আমি আপনার প্রশ্ন "${message}" বুঝতে পেরেছি। 

**${provider.toUpperCase()} AI ব্যবহারের জন্য API কী প্রয়োজন।**

**বর্তমানে আমি নিম্নলিখিত সাহায্য করতে পারি:**
• সাধারণ আবেদনপত্র তৈরি
• ছুটির আবেদন লেখা
• অভিযোগপত্র প্রস্তুত করা
• সরকারি চিঠিপত্রের ফরম্যাট

${files.length > 0 ? `\n**আপলোডকৃত ফাইল:** ${files.length}টি ফাইল পাওয়া গেছে।` : ''}`;
    }
  };

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    setUploadedFiles(prev => [...prev, ...files]);
    toast.success(`${files.length}টি ফাইল আপলোড হয়েছে`);
  };

  const removeFile = (index) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleTemplateClick = (template) => {
    setInputMessage(`${template.name} লিখে দাও`);
    setActiveTemplate(template);
    inputRef.current?.focus();
  };

  const copyMessage = (content) => {
    navigator.clipboard.writeText(content);
    toast.success('কপি হয়ে গেছে!');
  };

  const clearChat = () => {
    setMessages([messages[0]]); // Keep welcome message
    toast.success('চ্যাট পরিষ্কার হয়ে গেছে');
  };

  const downloadChat = () => {
    const chatContent = messages.map(msg => 
      `[${msg.timestamp.toLocaleString('bn-BD')}] ${msg.type === 'user' ? 'আপনি' : 'AI'}: ${msg.content}`
    ).join('\n\n');
    
    const blob = new Blob([chatContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `AI_Chat_${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('চ্যাট ডাউনলোড হয়েছে!');
  };

  return (
    <div className="ai-assistant-page">
      {/* Header */}
      <header className="ai-header">
        <div className="ai-header-content">
          <div className="ai-header-left">
            <button
              onClick={onBack}
              className="back-button"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>ফিরে যান</span>
            </button>
            
            <div className="ai-header-title">
              <div className="ai-logo">
                <Bot className="w-8 h-8" />
              </div>
              <div>
                <h1>বাংলাদেশী AI সহায়ক</h1>
                <p className="ai-subtitle">
                  {aiProviders.find(p => p.id === apiProvider)?.name} • 
                  <span className="status-dot"></span>
                  সংযুক্ত
                </p>
              </div>
            </div>
          </div>

          <div className="ai-header-right">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="sidebar-toggle"
              title="সাইডবার টগল"
            >
              <Menu className="w-5 h-5" />
            </button>
            
            <button
              onClick={downloadChat}
              className="header-action-btn"
              title="চ্যাট ডাউনলোড"
            >
              <Download className="w-5 h-5" />
            </button>
            
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="header-action-btn"
              title="সেটিংস"
            >
              <Settings className="w-5 h-5" />
            </button>
            
            <button
              onClick={clearChat}
              className="header-action-btn danger"
              title="চ্যাট পরিষ্কার"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Settings Panel */}
        <AnimatePresence>
          {showSettings && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="settings-panel"
            >
              <div className="settings-content">
                <h3>AI প্রদানকারী নির্বাচন করুন:</h3>
                <div className="ai-providers-grid">
                  {aiProviders.map(provider => (
                    <button
                      key={provider.id}
                      onClick={() => setApiProvider(provider.id)}
                      className={`provider-card ${apiProvider === provider.id ? 'active' : ''}`}
                    >
                      <div className="provider-icon">{provider.icon}</div>
                      <div className="provider-info">
                        <span className="provider-name">{provider.name}</span>
                        <span className={`provider-status ${provider.status}`}>
                          {provider.status === 'premium' ? 'Premium' : 'Free'}
                        </span>
                      </div>
                      {apiProvider === provider.id && (
                        <div className="provider-check">
                          <Star className="w-4 h-4" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <div className="ai-main-content">
        {/* Sidebar */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.aside
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: '320px', opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              className="ai-sidebar"
            >
              <div className="sidebar-content">
                {/* Search */}
                <div className="sidebar-search">
                  <Search className="w-4 h-4" />
                  <input
                    type="text"
                    placeholder="টেমপ্লেট খুঁজুন..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                {/* Quick Stats */}
                <div className="quick-stats">
                  <div className="stat-card">
                    <Zap className="w-4 h-4" />
                    <span>দ্রুত</span>
                  </div>
                  <div className="stat-card">
                    <Shield className="w-4 h-4" />
                    <span>নিরাপদ</span>
                  </div>
                  <div className="stat-card">
                    <Globe className="w-4 h-4" />
                    <span>বহুভাষিক</span>
                  </div>
                </div>

                {/* Templates */}
                <div className="templates-section">
                  <h3>দ্রুত টেমপ্লেট</h3>
                  <div className="templates-list">
                    {filteredTemplates.map(template => (
                      <motion.button
                        key={template.id}
                        onClick={() => handleTemplateClick(template)}
                        className={`template-card ${activeTemplate?.id === template.id ? 'active' : ''}`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="template-icon">
                          <template.icon className="w-5 h-5" />
                        </div>
                        <div className="template-info">
                          <h4>{template.name}</h4>
                          <p>{template.description}</p>
                          <span className="template-category">{template.category}</span>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Help Section */}
                <div className="help-section">
                  <h4>সাহায্যের তথ্য</h4>
                  <ul>
                    <li>• ফাইল আপলোড করুন</li>
                    <li>• ভয়েস রেকর্ড করুন</li>
                    <li>• টেক্সট কপি করুন</li>
                    <li>• বিভিন্ন AI ব্যবহার করুন</li>
                  </ul>
                </div>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Chat Area */}
        <main className="ai-chat-main">
          {/* Messages */}
          <div className="messages-container" ref={chatContainerRef}>
            <div className="messages-list">
              {messages.map(message => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`message ${message.type}`}
                >
                  <div className="message-avatar">
                    {message.type === 'user' ? (
                      <User className="w-6 h-6" />
                    ) : (
                      <Bot className="w-6 h-6" />
                    )}
                  </div>
                  
                  <div className="message-content">
                    <div className="message-header">
                      <span className="message-sender">
                        {message.type === 'user' ? 'আপনি' : 'AI সহায়ক'}
                      </span>
                      <span className="message-time">
                        {message.timestamp.toLocaleTimeString('bn-BD', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </span>
                    </div>
                    
                    <div className="message-text">
                      {message.content}
                    </div>
                    
                    {message.files && message.files.length > 0 && (
                      <div className="message-files">
                        {message.files.map((file, index) => (
                          <div key={index} className="file-attachment">
                            <Paperclip className="w-4 h-4" />
                            <span>{file.name}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {message.type === 'bot' && (
                      <div className="message-actions">
                        <button
                          onClick={() => copyMessage(message.content)}
                          className="message-action-btn"
                          title="কপি করুন"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        <button
                          className="message-action-btn"
                          title="শেয়ার করুন"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
              
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="message bot loading"
                >
                  <div className="message-avatar">
                    <Bot className="w-6 h-6" />
                  </div>
                  <div className="message-content">
                    <div className="typing-indicator">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* File Upload Area */}
          {uploadedFiles.length > 0 && (
            <div className="upload-area">
              <div className="uploaded-files">
                {uploadedFiles.map((file, index) => (
                  <div key={index} className="uploaded-file">
                    <Paperclip className="w-4 h-4" />
                    <span>{file.name}</span>
                    <button
                      onClick={() => removeFile(index)}
                      className="remove-file"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Input Area */}
          <div className="input-area">
            <div className="input-container">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                multiple
                accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
                className="file-input"
              />
              
              <div className="input-actions-left">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="input-action-btn"
                  title="ফাইল আপলোড"
                >
                  <Paperclip className="w-5 h-5" />
                </button>

                <button
                  onClick={() => setIsRecording(!isRecording)}
                  className={`input-action-btn ${isRecording ? 'recording' : ''}`}
                  title="ভয়েস রেকর্ড"
                >
                  {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                </button>
              </div>

              <div className="input-field">
                <textarea
                  ref={inputRef}
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  placeholder="আপনার প্রশ্ন বা অনুরোধ লিখুন... (Enter দিয়ে পাঠান, Shift+Enter নতুন লাইন)"
                  className="message-input"
                  rows={1}
                />
              </div>

              <button
                onClick={handleSendMessage}
                disabled={isLoading || (!inputMessage.trim() && uploadedFiles.length === 0)}
                className="send-button"
                title="পাঠান"
              >
                {isLoading ? (
                  <RefreshCw className="w-5 h-5 animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AIAssistantPage;
