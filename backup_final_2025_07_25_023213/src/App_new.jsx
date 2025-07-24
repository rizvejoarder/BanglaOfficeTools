import React, { useState } from 'react';
import { 
  convertPdfToImages, 
  convertImagesToPdf, 
  convertPdfToWord, 
  convertImageToWord,
  validateFileType,
  formatFileSize,
  handleError
} from './utils';

function App() {
  // State for managing processing status
  const [processing, setProcessing] = useState({
    pdfToImage: false,
    imageToPdf: false,
    pdfToWord: false,
    imageToWord: false
  });

  const [statusMessages, setStatusMessages] = useState({
    pdfToImage: '',
    imageToPdf: '',
    pdfToWord: '',
    imageToWord: ''
  });

  // Update status message for a specific tool
  const updateStatus = (tool, message, isError = false) => {
    setStatusMessages(prev => ({
      ...prev,
      [tool]: { message, isError }
    }));
  };

  // Clear status message
  const clearStatus = (tool) => {
    setStatusMessages(prev => ({
      ...prev,
      [tool]: ''
    }));
  };

  // PDF to Image handler
  const handlePdfToImage = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!validateFileType(file, ['application/pdf'])) {
      updateStatus('pdfToImage', 'অনুগ্রহ করে একটি বৈধ PDF ফাইল নির্বাচন করুন।', true);
      return;
    }

    setProcessing(prev => ({ ...prev, pdfToImage: true }));
    clearStatus('pdfToImage');

    try {
      await convertPdfToImages(file, (message) => {
        updateStatus('pdfToImage', message);
      });
      updateStatus('pdfToImage', 'সফলভাবে PDF থেকে ছবি তৈরি হয়েছে!');
    } catch (error) {
      updateStatus('pdfToImage', handleError(error), true);
    } finally {
      setProcessing(prev => ({ ...prev, pdfToImage: false }));
      event.target.value = ''; // Reset file input
    }
  };

  // Image to PDF handler
  const handleImageToPdf = async (event) => {
    const files = Array.from(event.target.files);
    if (!files.length) return;

    const invalidFiles = files.filter(file => 
      !validateFileType(file, ['image/jpeg', 'image/png', 'image/jpg'])
    );

    if (invalidFiles.length > 0) {
      updateStatus('imageToPdf', 'অনুগ্রহ করে শুধুমাত্র JPEG বা PNG ছবি নির্বাচন করুন।', true);
      return;
    }

    setProcessing(prev => ({ ...prev, imageToPdf: true }));
    clearStatus('imageToPdf');

    try {
      await convertImagesToPdf(files, (message) => {
        updateStatus('imageToPdf', message);
      });
      updateStatus('imageToPdf', 'সফলভাবে ছবি থেকে PDF তৈরি হয়েছে!');
    } catch (error) {
      updateStatus('imageToPdf', handleError(error), true);
    } finally {
      setProcessing(prev => ({ ...prev, imageToPdf: false }));
      event.target.value = ''; // Reset file input
    }
  };

  // PDF to Word handler
  const handlePdfToWord = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!validateFileType(file, ['application/pdf'])) {
      updateStatus('pdfToWord', 'অনুগ্রহ করে একটি বৈধ PDF ফাইল নির্বাচন করুন।', true);
      return;
    }

    setProcessing(prev => ({ ...prev, pdfToWord: true }));
    clearStatus('pdfToWord');

    try {
      await convertPdfToWord(file, (message) => {
        updateStatus('pdfToWord', message);
      });
      updateStatus('pdfToWord', 'সফলভাবে PDF থেকে Word ডকুমেন্ট তৈরি হয়েছে!');
    } catch (error) {
      updateStatus('pdfToWord', handleError(error), true);
    } finally {
      setProcessing(prev => ({ ...prev, pdfToWord: false }));
      event.target.value = ''; // Reset file input
    }
  };

  // Image to Word (OCR) handler
  const handleImageToWord = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!validateFileType(file, ['image/jpeg', 'image/png', 'image/jpg'])) {
      updateStatus('imageToWord', 'অনুগ্রহ করে একটি বৈধ ছবি ফাইল (JPEG বা PNG) নির্বাচন করুন।', true);
      return;
    }

    setProcessing(prev => ({ ...prev, imageToWord: true }));
    clearStatus('imageToWord');

    try {
      await convertImageToWord(file, (message) => {
        updateStatus('imageToWord', message);
      });
      updateStatus('imageToWord', 'সফলভাবে ছবি থেকে Word ডকুমেন্ট তৈরি হয়েছে!');
    } catch (error) {
      updateStatus('imageToWord', handleError(error), true);
    } finally {
      setProcessing(prev => ({ ...prev, imageToWord: false }));
      event.target.value = ''; // Reset file input
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 font-sans antialiased p-4">
      <div className="container mx-auto max-w-4xl bg-white rounded-xl shadow-lg overflow-hidden my-8">
        <header className="text-center py-8 px-4 bg-blue-600 text-white">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-2">বাংলা অফিস টুলস</h1>
          <p className="text-lg md:text-xl opacity-90">আপনার অফিসের কাজ সহজ করার জন্য কিছু টুলস</p>
        </header>

        <main className="p-6 space-y-8">
          {/* PDF to Image Tool Card */}
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-xl transition-shadow duration-300">
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">পিডিএফ থেকে ছবি</h2>
            <p className="text-gray-600 mb-4">আপনার পিডিএফ ফাইলকে ছবিতে রূপান্তর করুন। প্রতিটি পৃষ্ঠা একটি পৃথক ছবি হিসাবে সংরক্ষিত হবে।</p>
            <input 
              type="file" 
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50" 
              accept=".pdf" 
              onChange={handlePdfToImage}
              disabled={processing.pdfToImage}
            />
            {statusMessages.pdfToImage && (
              <div className={`mt-4 p-3 rounded-md text-sm ${
                statusMessages.pdfToImage.isError 
                  ? 'bg-red-50 text-red-700 border border-red-200' 
                  : 'bg-blue-50 text-blue-700 border border-blue-200'
              }`}>
                {statusMessages.pdfToImage.message}
              </div>
            )}
            {processing.pdfToImage && (
              <div className="mt-4 flex items-center justify-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                <span className="ml-2 text-blue-600">প্রক্রিয়াকরণ চলছে...</span>
              </div>
            )}
          </div>

          {/* Image to PDF Tool Card */}
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-xl transition-shadow duration-300">
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">ছবি থেকে পিডিএফ</h2>
            <p className="text-gray-600 mb-4">আপনার এক বা একাধিক ছবিকে একটি পিডিএফ ফাইলে রূপান্তর করুন।</p>
            <input 
              type="file" 
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50" 
              accept="image/jpeg,image/png,image/jpg" 
              multiple 
              onChange={handleImageToPdf}
              disabled={processing.imageToPdf}
            />
            {statusMessages.imageToPdf && (
              <div className={`mt-4 p-3 rounded-md text-sm ${
                statusMessages.imageToPdf.isError 
                  ? 'bg-red-50 text-red-700 border border-red-200' 
                  : 'bg-blue-50 text-blue-700 border border-blue-200'
              }`}>
                {statusMessages.imageToPdf.message}
              </div>
            )}
            {processing.imageToPdf && (
              <div className="mt-4 flex items-center justify-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                <span className="ml-2 text-blue-600">প্রক্রিয়াকরণ চলছে...</span>
              </div>
            )}
          </div>

          {/* PDF to Word (Text) Tool Card */}
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-xl transition-shadow duration-300">
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">পিডিএফ থেকে ওয়ার্ড (.docx)</h2>
            <p className="text-gray-600 mb-4">আপনার পিডিএফ ফাইল থেকে লেখা বের করে একটি মাইক্রোসফট ওয়ার্ড (.docx) ফাইলে সংরক্ষণ করুন।</p>
            <input 
              type="file" 
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50" 
              accept=".pdf" 
              onChange={handlePdfToWord}
              disabled={processing.pdfToWord}
            />
            {statusMessages.pdfToWord && (
              <div className={`mt-4 p-3 rounded-md text-sm ${
                statusMessages.pdfToWord.isError 
                  ? 'bg-red-50 text-red-700 border border-red-200' 
                  : 'bg-blue-50 text-blue-700 border border-blue-200'
              }`}>
                {statusMessages.pdfToWord.message}
              </div>
            )}
            {processing.pdfToWord && (
              <div className="mt-4 flex items-center justify-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                <span className="ml-2 text-blue-600">প্রক্রিয়াকরণ চলছে...</span>
              </div>
            )}
          </div>

          {/* Image to Word (OCR Text) Tool Card */}
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-xl transition-shadow duration-300">
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">ছবি থেকে ওয়ার্ড (OCR .docx)</h2>
            <p className="text-gray-600 mb-4">আপনার ছবি থেকে বাংলা লেখা শনাক্ত করে একটি মাইক্রোসফট ওয়ার্ড (.docx) ফাইলে সংরক্ষণ করুন।</p>
            <input 
              type="file" 
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50" 
              accept="image/jpeg,image/png,image/jpg" 
              onChange={handleImageToWord}
              disabled={processing.imageToWord}
            />
            {statusMessages.imageToWord && (
              <div className={`mt-4 p-3 rounded-md text-sm ${
                statusMessages.imageToWord.isError 
                  ? 'bg-red-50 text-red-700 border border-red-200' 
                  : 'bg-blue-50 text-blue-700 border border-blue-200'
              }`}>
                {statusMessages.imageToWord.message}
              </div>
            )}
            {processing.imageToWord && (
              <div className="mt-4 flex items-center justify-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                <span className="ml-2 text-blue-600">প্রক্রিয়াকরণ চলছে...</span>
              </div>
            )}
          </div>
        </main>

        <footer className="text-center py-6 px-4 bg-gray-50 text-gray-600">
          <p>সমস্ত প্রক্রিয়াকরণ আপনার ব্রাউজারে হয়। কোনো ফাইল সার্ভারে পাঠানো হয় না।</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
