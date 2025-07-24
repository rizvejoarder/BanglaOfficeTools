import React from 'react';
import { ArrowLeft, Bot } from 'lucide-react';

const AIAssistantPageSimple = ({ onBack }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex flex-col">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-sm border-b border-white/20 p-4">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </button>
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">AI Assistant</h1>
              <p className="text-sm text-gray-600">Bangladeshi Official Assistant</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-2xl">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Bot className="w-10 h-10 text-white" />
              </div>
              
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                বাংলাদেশী AI সহায়ক
              </h2>
              
              <p className="text-lg text-gray-600 mb-8">
                সরকারি কাজকর্ম, ডকুমেন্ট তৈরি এবং বিশ্লেষণের জন্য আপনার বুদ্ধিমান সহায়ক
              </p>
              
              <div className="grid md:grid-cols-2 gap-6 mt-8">
                <div className="p-6 bg-blue-50 rounded-xl">
                  <h3 className="text-xl font-semibold text-blue-800 mb-3">✍️ ডকুমেন্ট তৈরি</h3>
                  <p className="text-blue-600">সরকারি আবেদন, চিঠিপত্র এবং অফিসিয়াল কাগজপত্র তৈরি করুন</p>
                </div>
                
                <div className="p-6 bg-purple-50 rounded-xl">
                  <h3 className="text-xl font-semibold text-purple-800 mb-3">📋 ফাইল বিশ্লেষণ</h3>
                  <p className="text-purple-600">যেকোনো ধরনের ডকুমেন্ট আপলোড করে বিশ্লেষণ করুন</p>
                </div>
                
                <div className="p-6 bg-green-50 rounded-xl">
                  <h3 className="text-xl font-semibold text-green-800 mb-3">🔄 অনুবাদ সেবা</h3>
                  <p className="text-green-600">বাংলা ও ইংরেজির মধ্যে সঠিক অনুবাদ পান</p>
                </div>
                
                <div className="p-6 bg-orange-50 rounded-xl">
                  <h3 className="text-xl font-semibold text-orange-800 mb-3">🤖 AI সাপোর্ট</h3>
                  <p className="text-orange-600">একাধিক AI প্রোভাইডার থেকে সেরা সমাধান পান</p>
                </div>
              </div>
              
              <div className="mt-8">
                <p className="text-sm text-gray-500 mb-4">
                  পূর্ণ ফিচার এখনও ডেভেলপমেন্টে রয়েছে। শীঘ্রই আরও উন্নত ফিচার যোগ করা হবে।
                </p>
                
                <button 
                  className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                  disabled
                >
                  Coming Soon - চালু হচ্ছে শীঘ্রই
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AIAssistantPageSimple;
