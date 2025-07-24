import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageCircle, Send, Upload, FileText, Brain, Sparkles,
  X, Settings, Download, Copy, RefreshCw, Bot, User,
  Mic, MicOff, Paperclip, Trash2, BookOpen, Globe,
  Calendar, ClipboardList, FileCheck, Languages
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const AIBotChat = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: 'নমস্কার! আমি বাংলাদেশী সরকারি কাজকর্মের AI সহায়ক। আমি আপনাকে নিম্নলিখিত কাজে সাহায্য করতে পারি:\n\n• যেকোনো সরকারি আবেদন লেখা\n• ডকুমেন্ট বিশ্লেষণ ও সম্পাদনা\n• চিঠিপত্র ও অফিসিয়াল কাগজপত্র তৈরি\n• বাংলা ও ইংরেজি অনুবাদ\n• সরকারি নিয়মকানুন ব্যাখ্যা\n\nআপনার কী সাহায্য প্রয়োজন?',
      timestamp: new Date(),
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [apiProvider, setApiProvider] = useState('gemini');
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const chatContainerRef = useRef(null);

  // Available AI providers
  const aiProviders = [
    { id: 'gemini', name: 'Google Gemini', icon: '🤖', color: 'from-blue-500 to-purple-600' },
    { id: 'openai', name: 'OpenAI GPT', icon: '🧠', color: 'from-green-500 to-emerald-600' },
    { id: 'huggingface', name: 'Hugging Face', icon: '🤗', color: 'from-yellow-500 to-orange-600' },
    { id: 'openrouter', name: 'OpenRouter', icon: '🌐', color: 'from-purple-500 to-pink-600' },
    { id: 'claude', name: 'Anthropic Claude', icon: '🎭', color: 'from-indigo-500 to-blue-600' }
  ];

  // Bengali official document templates
  const documentTemplates = [
    { id: 'application', name: 'সাধারণ আবেদন', icon: FileText },
    { id: 'leave', name: 'ছুটির আবেদন', icon: Calendar },
    { id: 'complaint', name: 'অভিযোগপত্র', icon: ClipboardList },
    { id: 'certificate', name: 'সার্টিফিকেট আবেদন', icon: FileCheck },
    { id: 'recommendation', name: 'সুপারিশপত্র', icon: BookOpen },
    { id: 'official_letter', name: 'সরকারি চিঠি', icon: Globe }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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
      // Import the AI integration utility
      const { getAIResponse } = await import('../utils/aiIntegration');
      
      // Get real AI response
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
      } else if (messageLC.includes('ছুটি') || messageLC.includes('leave')) {
        return `
# ছুটির আবেদনপত্র

**তারিখ:** ${new Date().toLocaleDateString('bn-BD')}

**প্রতি,**
[প্রতিষ্ঠান প্রধানের নাম]
[প্রতিষ্ঠানের নাম]

**বিষয়:** [ছুটির ধরন] ছুটির আবেদন।

জনাব,
সবিনয়ে নিবেদন এই যে, [ছুটির কারণ] কারণে আমার [তারিখ] থেকে [তারিখ] পর্যন্ত [দিনের সংখ্যা] দিন ছুটি প্রয়োজন।

অতএব, আপনার নিকট বিনীত প্রার্থনা এই যে, উক্ত সময়ের জন্য আমাকে ছুটি মঞ্জুর করিলে আমি চিরকৃতজ্ঞ থাকিব।

বিনীত নিবেদক,
[আপনার নাম]
[পদবী]
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

**API কী সেটআপ করতে:**
1. .env ফাইল তৈরি করুন
2. আপনার API কী যোগ করুন
3. ব্রাউজার রিফ্রেশ করুন

${files.length > 0 ? `\n**আপলোডকৃত ফাইল:** ${files.length}টি ফাইল পাওয়া গেছে।` : ''}

**নমুনা প্রশ্ন করুন:**
"আবেদনপত্র লিখে দাও" বা "ছুটির আবেদন তৈরি করো"`;
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
  };

  const copyMessage = (content) => {
    navigator.clipboard.writeText(content);
    toast.success('কপি হয়ে গেছে!');
  };

  const clearChat = () => {
    setMessages([messages[0]]); // Keep welcome message
    toast.success('চ্যাট পরিষ্কার হয়ে গেছে');
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl h-[90vh] flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-700 text-white p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <Bot className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold">বাংলাদেশী অফিসিয়াল AI সহায়ক</h2>
                <p className="text-sm opacity-90">
                  {aiProviders.find(p => p.id === apiProvider)?.name} • সংযুক্ত
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
              >
                <Settings className="w-5 h-5" />
              </button>
              <button
                onClick={clearChat}
                className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
              >
                <Trash2 className="w-5 h-5" />
              </button>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Settings Panel */}
          {showSettings && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mt-4 p-4 bg-white bg-opacity-10 rounded-lg"
            >
              <h3 className="font-semibold mb-3">AI প্রদানকারী নির্বাচন করুন:</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {aiProviders.map(provider => (
                  <button
                    key={provider.id}
                    onClick={() => setApiProvider(provider.id)}
                    className={`p-2 rounded-lg text-sm transition-all ${
                      apiProvider === provider.id
                        ? 'bg-white text-blue-600'
                        : 'bg-white bg-opacity-20 hover:bg-opacity-30'
                    }`}
                  >
                    {provider.icon} {provider.name}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Templates Sidebar */}
          <div className="w-64 bg-gray-50 border-r border-gray-200 p-4 overflow-y-auto">
            <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
              <FileText className="w-4 h-4 mr-2" />
              দ্রুত টেমপ্লেট
            </h3>
            <div className="space-y-2">
              {documentTemplates.map(template => (
                <button
                  key={template.id}
                  onClick={() => handleTemplateClick(template)}
                  className="w-full text-left p-3 rounded-lg hover:bg-blue-50 hover:border-blue-200 border border-transparent transition-all group"
                >
                  <div className="flex items-center space-x-2">
                    <template.icon className="w-4 h-4 text-gray-500 group-hover:text-blue-600" />
                    <span className="text-sm text-gray-700 group-hover:text-blue-800">
                      {template.name}
                    </span>
                  </div>
                </button>
              ))}
            </div>

            <div className="mt-6 p-3 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-800 mb-2">সাহায্যের তথ্য</h4>
              <ul className="text-xs text-blue-600 space-y-1">
                <li>• ফাইল আপলোড করুন</li>
                <li>• ভয়েস রেকর্ড করুন</li>
                <li>• টেক্সট কপি করুন</li>
                <li>• বিভিন্ন AI ব্যবহার করুন</li>
              </ul>
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 flex flex-col">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={chatContainerRef}>
              {messages.map(message => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[80%] ${message.type === 'user' ? 'order-2' : 'order-1'}`}>
                    <div className={`flex items-start space-x-2 ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        message.type === 'user' 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                      }`}>
                        {message.type === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                      </div>
                      <div className={`rounded-2xl p-4 ${
                        message.type === 'user'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        <div className="whitespace-pre-wrap text-sm leading-relaxed">
                          {message.content}
                        </div>
                        {message.files && message.files.length > 0 && (
                          <div className="mt-2 space-y-1">
                            {message.files.map((file, index) => (
                              <div key={index} className="text-xs opacity-80 flex items-center">
                                <Paperclip className="w-3 h-3 mr-1" />
                                {file.name}
                              </div>
                            ))}
                          </div>
                        )}
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs opacity-70">
                            {message.timestamp.toLocaleTimeString('bn-BD')}
                          </span>
                          {message.type === 'bot' && (
                            <button
                              onClick={() => copyMessage(message.content)}
                              className="p-1 hover:bg-black hover:bg-opacity-10 rounded"
                            >
                              <Copy className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
              
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="flex items-start space-x-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white flex items-center justify-center">
                      <Bot className="w-4 h-4" />
                    </div>
                    <div className="bg-gray-100 rounded-2xl p-4">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* File Upload Area */}
            {uploadedFiles.length > 0 && (
              <div className="p-4 bg-gray-50 border-t">
                <div className="flex flex-wrap gap-2">
                  {uploadedFiles.map((file, index) => (
                    <div key={index} className="flex items-center bg-white rounded-lg p-2 text-sm">
                      <Paperclip className="w-4 h-4 mr-2 text-gray-500" />
                      <span className="mr-2">{file.name}</span>
                      <button
                        onClick={() => removeFile(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Input Area */}
            <div className="border-t border-gray-200 p-4">
              <div className="flex items-end space-x-2">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  multiple
                  accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
                  className="hidden"
                />
                
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <Paperclip className="w-5 h-5" />
                </button>

                <button
                  onClick={() => setIsRecording(!isRecording)}
                  className={`p-2 rounded-lg transition-colors ${
                    isRecording 
                      ? 'text-red-600 bg-red-50' 
                      : 'text-gray-500 hover:text-blue-600 hover:bg-blue-50'
                  }`}
                >
                  {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                </button>

                <div className="flex-1">
                  <textarea
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    placeholder="আপনার প্রশ্ন বা অনুরোধ লিখুন... (Enter দিয়ে পাঠান)"
                    className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={1}
                    style={{ minHeight: '44px', maxHeight: '120px' }}
                  />
                </div>

                <button
                  onClick={handleSendMessage}
                  disabled={isLoading || (!inputMessage.trim() && uploadedFiles.length === 0)}
                  className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isLoading ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AIBotChat;
