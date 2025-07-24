import React, { useState } from 'react';
import { 
  FileText, Download, Upload, Users, 
  CheckCircle, Star, 
  ImageIcon, ScanLine, FileDown, FileUp, Layers
} from 'lucide-react';
import { toast } from 'react-hot-toast';

function App() {
  const [processing, setProcessing] = useState({});

  const stats = [
    { label: 'সক্রিয় ব্যবহারকারী', value: '৫০,০০০+', icon: Users },
    { label: 'ডকুমেন্ট প্রক্রিয়াজাত', value: '১০ লক্ষ+', icon: FileText },
    { label: 'রূপান্তরের হার', value: '৯৯.৮%', icon: CheckCircle },
    { label: 'গ্রাহক সন্তুষ্টি', value: '৪.৯/৫', icon: Star }
  ];

  const tools = [
    {
      id: 'image-to-word',
      title: 'ছবি থেকে ওয়ার্ড',
      subtitle: 'AI-Enhanced OCR',
      description: 'বাংলা ছবি থেকে সম্পাদনাযোগ্য Word ডকুমেন্ট',
      gradient: 'from-blue-500 to-indigo-600',
      accept: '.jpg,.jpeg,.png,.webp'
    },
    {
      id: 'pdf-to-image',
      title: 'PDF থেকে ছবি',
      subtitle: '4K রেজোলিউশন',
      description: 'PDF ফাইলকে উচ্চ মানের ছবিতে রূপান্তর',
      gradient: 'from-green-500 to-emerald-600',
      accept: '.pdf'
    },
    {
      id: 'images-to-pdf',
      title: 'ছবি থেকে PDF',
      subtitle: 'AI লেআউট',
      description: 'একাধিক ছবিকে একটি PDF ডকুমেন্টে রূপান্তর',
      gradient: 'from-purple-500 to-pink-600',
      accept: '.jpg,.jpeg,.png,.webp'
    },
    {
      id: 'pdf-to-word',
      title: 'PDF থেকে ওয়ার্ড',
      subtitle: 'লেআউট সংরক্ষণ',
      description: 'PDF ডকুমেন্টকে সম্পাদনাযোগ্য Word ফাইলে রূপান্তর',
      gradient: 'from-orange-500 to-red-600',
      accept: '.pdf'
    },
    {
      id: 'word-to-pdf',
      title: 'ওয়ার্ড থেকে PDF',
      subtitle: 'প্রফেশনাল PDF',
      description: 'Word ডকুমেন্টকে উচ্চ মানের PDF এ রূপান্তর',
      gradient: 'from-teal-500 to-cyan-600',
      accept: '.doc,.docx'
    }
  ];

  const getIcon = (toolId) => {
    switch(toolId) {
      case 'image-to-word': return <ScanLine className="w-8 h-8 text-white" />;
      case 'pdf-to-image': return <ImageIcon className="w-8 h-8 text-white" />;
      case 'images-to-pdf': return <Layers className="w-8 h-8 text-white" />;
      case 'pdf-to-word': return <FileDown className="w-8 h-8 text-white" />;
      case 'word-to-pdf': return <FileUp className="w-8 h-8 text-white" />;
      default: return <FileText className="w-8 h-8 text-white" />;
    }
  };

  const handleFileSelect = (file, toolId) => {
    if (!file) return;
    toast.success(`${tools.find(t => t.id === toolId)?.title} ফাইল নির্বাচিত!`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/10 border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">বাংলা অফিস টুলস</h1>
                <p className="text-sm text-blue-200">Professional Document Solutions</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            বাংলা অফিস টুলস
          </h1>
          <p className="text-xl md:text-2xl text-blue-200 mb-8 max-w-3xl mx-auto">
            পেশাদার বাংলা ডকুমেন্ট সমাধান - AI-চালিত OCR এবং কনভার্টার টুলস
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="bg-white/10 backdrop-blur rounded-2xl p-6 text-center border border-white/20"
              >
                <stat.icon className="w-8 h-8 text-blue-400 mx-auto mb-4" />
                <div className="text-2xl md:text-3xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-sm text-blue-200">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tools */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">আমাদের টুলস</h2>
            <p className="text-lg text-blue-200 max-w-2xl mx-auto">
              পেশাদার বাংলা ডকুমেন্ট প্রক্রিয়াকরণের জন্য সম্পূর্ণ সমাধান
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tools.map((tool, index) => (
              <div
                key={tool.id}
                className="bg-white/10 backdrop-blur rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300"
              >
                <div className={`w-16 h-16 bg-gradient-to-r ${tool.gradient} rounded-2xl flex items-center justify-center mb-6`}>
                  {getIcon(tool.id)}
                </div>
                
                <h3 className="text-xl font-bold text-white mb-2">{tool.title}</h3>
                <p className="text-sm text-blue-400 font-medium mb-3">{tool.subtitle}</p>
                <p className="text-blue-200 mb-6 leading-relaxed">{tool.description}</p>
                
                <div className="relative">
                  <input
                    type="file"
                    accept={tool.accept}
                    onChange={(e) => e.target.files[0] && handleFileSelect(e.target.files[0], tool.id)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="border-2 border-dashed border-blue-500/30 rounded-2xl p-8 text-center hover:border-blue-400/50 transition-colors cursor-pointer">
                    <Upload className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                    <h4 className="text-lg font-semibold text-white mb-2">ফাইল আপলোড করুন</h4>
                    <p className="text-blue-200 mb-2">ক্লিক করুন বা ড্র্যাগ করে ফেলুন</p>
                    <p className="text-sm text-blue-400">
                      সাপোর্টেড: {tool.accept.replace(/\./g, '').toUpperCase()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900/50 backdrop-blur border-t border-white/10 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-bold text-white">বাংলা অফিস টুলস</h3>
            </div>
            <p className="text-blue-200/80 mb-4">পেশাদার বাংলা ডকুমেন্ট সমাধানের জন্য আপনার বিশ্বস্ত সঙ্গী</p>
            <p className="text-blue-200/60 text-sm">© ২০২৪ বাংলা অফিস টুলস। সকল অধিকার সংরক্ষিত।</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
