import React from 'react';

// Loading Spinner Component
export const LoadingSpinner = ({ message = 'প্রক্রিয়াকরণ চলছে...' }) => (
  <div className="mt-4 flex items-center justify-center">
    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
    <span className="ml-2 text-blue-600">{message}</span>
  </div>
);

// Status Message Component
export const StatusMessage = ({ message, isError = false }) => (
  <div className={`mt-4 p-3 rounded-md text-sm ${
    isError 
      ? 'bg-red-50 text-red-700 border border-red-200' 
      : 'bg-blue-50 text-blue-700 border border-blue-200'
  }`}>
    {message}
  </div>
);

// Tool Card Component - Premium Professional Design
export const ToolCard = ({ 
  tool,
  onFileUpload,
  processing = false,
  progress = 0,
  progressMessage = ''
}) => {
  const handleFileChange = (event) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      onFileUpload(files);
    }
  };

  if (!tool) {
    return <div className="p-4 text-red-500">Tool not found</div>;
  }

  return (
    <div className="group relative bg-white rounded-3xl shadow-xl border border-gray-100/50 overflow-hidden hover:shadow-2xl hover:border-blue-200/50 transition-all duration-500 hover:-translate-y-2 h-full flex flex-col backdrop-blur-sm">
      {/* Premium Header Accent */}
      <div className={`h-1.5 ${tool.gradient || 'bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500'}`}></div>
      
      {/* Card Content */}
      <div className="p-8 flex-1 flex flex-col relative">
        {/* Background Pattern */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-50/30 to-indigo-50/30 rounded-full blur-3xl"></div>
        
        {/* Tool Header - Premium Design */}
        <div className="flex items-start gap-6 mb-8 relative z-10">
          {/* Premium Icon Container */}
          <div className={`flex-shrink-0 w-12 h-12 ${tool.gradient || 'bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500'} rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/25 group-hover:shadow-xl group-hover:shadow-blue-500/30 transition-all duration-300`}>
            <span className="text-lg text-white filter drop-shadow-sm">{tool.icon || '📄'}</span>
          </div>

          {/* Premium Content */}
          <div className="flex-1 min-w-0">
            <h3 className="text-2xl font-bold text-gray-900 mb-3 leading-tight bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text">
              {tool.title}
            </h3>
            <p className="text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 mb-3">
              {tool.subtitle}
            </p>
            <p className="text-gray-600 leading-relaxed text-base">
              {tool.description}
            </p>
          </div>
        </div>

        {/* Premium Instructions Box */}
        <div className="bg-gradient-to-r from-blue-50/80 to-indigo-50/80 rounded-2xl p-6 mb-8 border border-blue-100/50 backdrop-blur-sm relative z-10">
          <h4 className="text-lg font-bold text-blue-900 mb-3 flex items-center gap-2">
            <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
            </svg>
            ব্যবহারের নির্দেশনা
          </h4>
          <p className="text-blue-800 leading-relaxed font-medium">
            {tool.instructions || `${tool.title} ব্যবহার করতে নিচে ফাইল আপলোড করুন এবং প্রক্রিয়াকরণের জন্য অপেক্ষা করুন।`}
          </p>
        </div>

        {/* Premium Upload Section */}
        <div className="space-y-6 flex-1 relative z-10">
          {/* File Type Badge */}
          <div className="flex items-center justify-between mb-6">
            <h4 className="text-lg font-bold text-gray-800">ফাইল আপলোড</h4>
            <span className="inline-flex items-center px-4 py-2 text-sm font-semibold bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 rounded-full border border-blue-200/50 shadow-sm">
              {tool.accept === 'image/*' && '🖼️ Image Files'}
              {tool.accept === '.pdf' && '📄 PDF Files'}
              {tool.accept === '.doc,.docx' && '📝 Word Files'}
              {tool.multiple && ' (Multiple)'}
            </span>
          </div>

          {/* Enhanced File Upload Area */}
          <div className="relative">
            <input
              type="file"
              accept={tool.accept}
              multiple={tool.multiple}
              onChange={handleFileChange}
              disabled={processing}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10 disabled:cursor-not-allowed"
              id={`file-upload-${tool.title}`}
            />
            
            <div className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 ${
              processing 
                ? 'border-blue-300 bg-blue-50/50' 
                : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50/30 group-hover:border-blue-500 group-hover:bg-blue-50/50'
            }`}>
              <div className="space-y-4">
                <div className={`w-12 h-12 mx-auto rounded-2xl flex items-center justify-center ${
                  processing 
                    ? 'bg-blue-100 text-blue-600' 
                    : 'bg-gray-100 text-gray-400 group-hover:bg-blue-100 group-hover:text-blue-600'
                } transition-all duration-300`}>
                  {processing ? (
                    <svg className="w-6 h-6 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
                    </svg>
                  )}
                </div>
                
                <div>
                  <p className={`text-lg font-semibold mb-2 ${
                    processing ? 'text-blue-600' : 'text-gray-700 group-hover:text-blue-600'
                  } transition-colors duration-300`}>
                    {processing ? 'প্রক্রিয়াকরণ চলছে...' : 'ফাইল নির্বাচন করুন'}
                  </p>
                  <p className="text-sm text-gray-500 font-medium">
                    {processing ? progressMessage : `${tool.accept} ফাইল সাপোর্টেড`}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          {processing && progress > 0 && (
            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="font-semibold text-blue-700">অগ্রগতি</span>
                <span className="font-bold text-blue-800">{Math.round(progress)}%</span>
              </div>
              <div className="w-full bg-blue-100 rounded-full h-3 overflow-hidden shadow-inner">
                <div 
                  className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-500 ease-out shadow-sm"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// OCR Result Display Component
export const OCRResultDisplay = ({ result, onDownload, onCopy }) => {
  if (!result) return null;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mt-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">OCR Result</h3>
      <div className="bg-gray-50 rounded-md p-4 mb-4 max-h-96 overflow-y-auto">
        <pre className="whitespace-pre-wrap text-sm text-gray-700 font-mono">
          {result.text}
        </pre>
      </div>
      <div className="flex space-x-3">
        <button
          onClick={onDownload}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Download
        </button>
        <button
          onClick={onCopy}
          className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
        >
          Copy
        </button>
      </div>
    </div>
  );
};