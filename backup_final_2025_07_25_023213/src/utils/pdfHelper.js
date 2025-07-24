// Robust PDF processing utility with multiple fallback strategies
import * as pdfjsLib from 'pdfjs-dist';

let workerInitialized = false;
let workerLoadAttempts = 0;
const MAX_WORKER_ATTEMPTS = 3;

// Multiple CDN fallbacks for PDF.js worker
const WORKER_SOURCES = [
  'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js',
  'https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js',
  'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.worker.min.js'
];

const initializeWorkerWithFallback = async () => {
  if (workerInitialized) return true;

  for (let i = 0; i < WORKER_SOURCES.length; i++) {
    try {
      const workerSrc = WORKER_SOURCES[i];
      console.log(`Attempting to load PDF worker from: ${workerSrc}`);
      
      // Test if the worker URL is accessible
      const response = await fetch(workerSrc, { method: 'HEAD' });
      if (response.ok) {
        pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrc;
        workerInitialized = true;
        console.log(`PDF.js worker successfully initialized with: ${workerSrc}`);
        return true;
      }
    } catch (error) {
      console.warn(`Failed to load worker from ${WORKER_SOURCES[i]}:`, error);
      continue;
    }
  }

  // Final fallback: use the first source anyway (might work despite HEAD request failing)
  console.warn('All worker sources failed HEAD requests, using first source as fallback');
  pdfjsLib.GlobalWorkerOptions.workerSrc = WORKER_SOURCES[0];
  workerInitialized = true;
  return true;
};

export const ensurePDFWorker = async () => {
  if (workerInitialized) return;
  
  workerLoadAttempts++;
  if (workerLoadAttempts > MAX_WORKER_ATTEMPTS) {
    throw new Error('পিডিএফ প্রসেসিং সিস্টেম লোড করতে ব্যর্থ। ইন্টারনেট সংযোগ পরীক্ষা করুন।');
  }

  try {
    await initializeWorkerWithFallback();
  } catch (error) {
    console.error('PDF worker initialization failed:', error);
    throw new Error('পিডিএফ প্রসেসিং সিস্টেম প্রস্তুত করতে সমস্যা হয়েছে।');
  }
};

// Enhanced PDF loading with better error handling
export const loadPDFDocument = async (arrayBuffer) => {
  await ensurePDFWorker();
  
  try {
    const loadingTask = pdfjsLib.getDocument({ 
      data: arrayBuffer,
      useWorkerFetch: false,
      disableAutoFetch: true,
      disableStream: true
    });
    
    return await loadingTask.promise;
  } catch (error) {
    console.error('PDF loading error:', error);
    
    if (error.message.includes('worker')) {
      throw new Error('পিডিএফ প্রসেসিং ওয়ার্কার লোড করতে সমস্যা হয়েছে। পেজ রিফ্রেশ করে আবার চেষ্টা করুন।');
    } else if (error.message.includes('Invalid PDF')) {
      throw new Error('অবৈধ বা দূষিত পিডিএফ ফাইল। অন্য পিডিএফ ফাইল চেষ্টা করুন।');
    } else {
      throw new Error(`পিডিএফ লোড করতে সমস্যা হয়েছে: ${error.message}`);
    }
  }
};
